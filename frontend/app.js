// ---------------------------------------------------------------------------
// AI 编程面试助手 — 前端主逻辑
// 对接后端 SSE: GET /ai/chat?memoryId={int}&message={string}
// ---------------------------------------------------------------------------

// --- 内置服务商（OpenAI 兼容）---
// base-url 与模型列表都内置，用户只需在选定服务商后填自己的 API Key
var PROVIDERS = [
  { id: 'deepseek',    name: 'DeepSeek',        baseUrl: 'https://api.deepseek.com',                              models: ['deepseek-v4-flash', 'deepseek-v4-pro'] },
  { id: 'dashscope',   name: '通义千问 Qwen',    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',     models: ['qwen-max', 'qwen-plus', 'qwen-turbo'] },
  { id: 'zhipu',       name: '智谱 GLM',         baseUrl: 'https://open.bigmodel.cn/api/paas/v4',                  models: ['glm-4-plus', 'glm-4-air', 'glm-4-flash'] },
  { id: 'moonshot',    name: 'Moonshot Kimi',   baseUrl: 'https://api.moonshot.cn/v1',                            models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'] },
  { id: 'openai',      name: 'OpenAI',          baseUrl: 'https://api.openai.com/v1',                             models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'] },
  { id: 'siliconflow', name: '硅基流动',         baseUrl: 'https://api.siliconflow.cn/v1',                         models: ['deepseek-ai/DeepSeek-V3', 'Qwen/Qwen2.5-72B-Instruct'] }
];
function findProvider(id) {
  for (var i = 0; i < PROVIDERS.length; i++) { if (PROVIDERS[i].id === id) return PROVIDERS[i]; }
  return null;
}

// --- 模型配置（BYOK）---
// provider 为空 = 使用后端默认模型（application-local.yml）
var DEFAULT_SETTINGS = {
  backend: 'http://localhost:8080',
  provider: '',  // 服务商 id，空 = 后端默认
  model: '',     // 该服务商下选中的模型
  apiKey: ''     // 用户自己的 Key
};
function loadSettings() {
  try {
    var saved = localStorage.getItem('ai-helper-settings');
    if (saved) {
      var loaded = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(saved));
      var provider = findProvider(loaded.provider);
      if (provider && !provider.models.includes(loaded.model)) loaded.model = provider.models[0];
      return loaded;
    }
  } catch (_) {}
  return Object.assign({}, DEFAULT_SETTINGS);
}
function saveSettings() {
  try { localStorage.setItem('ai-helper-settings', JSON.stringify(settings)); } catch (_) {}
}
var settings = loadSettings();

// 后端地址（去掉尾部斜杠）
function backendBase() {
  return (settings.backend || DEFAULT_SETTINGS.backend).replace(/\/+$/, '');
}

// 当前是否启用了自定义模型（选了服务商且填了 Key）
function overrideActive() {
  return !!(settings.provider && settings.apiKey && findProvider(settings.provider));
}

// --- 会话持久化 ---
function loadConversations() {
  try {
    var saved = localStorage.getItem('ai-helper-conversations');
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return [];
}
function saveConversations() {
  try { localStorage.setItem('ai-helper-conversations', JSON.stringify(conversations)); } catch (_) {}
}

var conversations = loadConversations();

// --- 状态 ---
var activeConversation = conversations.length > 0 ? conversations[0].id : null;
var isStreaming = false;
var abortController = null;

// --- DOM ---
var els = {
  list: document.getElementById('conversationList'),
  view: document.getElementById('conversationView'),
  search: document.getElementById('conversationSearch'),
  input: document.getElementById('messageInput'),
  send: document.getElementById('sendButton'),
  toast: document.getElementById('toast'),
  sidebar: document.getElementById('sidebar'),
  scrim: document.getElementById('scrim'),
  stage: document.getElementById('chatStage')
};

// --- 会话列表 ---
function renderConversationList() {
  var query = els.search.value.trim().toLowerCase();
  var items = conversations.filter(function (c) { return c.title.toLowerCase().includes(query); });

  if (items.length === 0) {
    els.list.innerHTML = '<div class="conversation-group-title">暂无会话</div>';
    return;
  }

  var html = '';
  items.forEach(function (item) {
    var cls = item.id === activeConversation ? 'conversation-item active' : 'conversation-item';
    html += '<button class="' + cls + '" data-id="' + item.id + '">'
      + '<span class="title">' + escapeHtml(item.title) + '</span>'
      + '<span class="time">' + item.time + '</span></button>';
  });
  els.list.innerHTML = html;

  els.list.querySelectorAll('.conversation-item').forEach(function (btn) {
    btn.addEventListener('click', function () { selectConversation(Number(btn.dataset.id)); });
  });
}

function selectConversation(id) {
  activeConversation = id;
  renderConversationList();
  renderActiveConversation();
  closeSidebar();
}

function renderActiveConversation() {
  var conversation = conversations.find(function (c) { return c.id === activeConversation; });
  var template = (conversation && conversation.content)
    ? document.getElementById('chatTemplate')
    : document.getElementById('emptyTemplate');
  els.view.innerHTML = '';
  els.view.appendChild(template.content.cloneNode(true));
  bindPromptButtons(els.view);
  els.stage.scrollTop = 0;
}

function bindPromptButtons(root) {
  if (!root) root = document;
  root.querySelectorAll('[data-prompt]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      els.input.value = btn.dataset.prompt;
      updateComposer();
      sendMessage();
    });
  });
}

// --- 新建会话 ---
// 不再创建空占位会话，只回到欢迎页；会话在首次发消息时才落地
function createNewChat() {
  activeConversation = null;
  renderConversationList();
  renderActiveConversation();
  els.input.focus();
  closeSidebar();
}

// --- 输入框 ---
function updateComposer() {
  var value = els.input.value;
  els.send.disabled = !value.trim() && !isStreaming;
  els.input.style.height = 'auto';
  els.input.style.height = Math.min(120, Math.max(24, els.input.scrollHeight)) + 'px';
}

// --- 发送 ---
function sendMessage() {
  if (isStreaming) { stopStreaming(); return; }
  var text = els.input.value.trim();
  if (!text) return;

  // 如果没有活跃会话，自动创建一个
  if (!activeConversation) {
    var id = Date.now();
    conversations.unshift({ id: id, title: text.slice(0, 20), time: '刚刚', content: true });
    activeConversation = id;
  } else {
    var conversation = conversations.find(function (c) { return c.id === activeConversation; });
    if (conversation) {
      if (!conversation.content || conversation.title === '新建会话') conversation.title = text.slice(0, 20);
      conversation.content = true;
      conversation.time = '刚刚';
    }
  }
  saveConversations();

  // 清掉欢迎页
  var welcome = els.view.querySelector('.welcome');
  if (welcome) els.view.innerHTML = '';
  var placeholder = els.view.querySelector('.chat-history-placeholder');
  if (placeholder) placeholder.remove();

  // 追加消息
  var userMsg = document.createElement('div');
  userMsg.className = 'message user-message';
  userMsg.innerHTML = '<div class="message-content"></div>';
  userMsg.querySelector('.message-content').textContent = text;
  els.view.appendChild(userMsg);

  var assistantMsg = document.createElement('div');
  assistantMsg.className = 'message assistant-message streaming-message';
  assistantMsg.innerHTML =
    '<div class="message-avatar"><i class="ti ti-braces"></i></div>' +
    '<div class="assistant-card"><p class="stream-target"></p>' +
    '<div class="message-actions"><button class="stop-gen-btn"><i class="ti ti-player-stop"></i>停止</button></div></div>';
  els.view.appendChild(assistantMsg);

  var stopBtn = assistantMsg.querySelector('.stop-gen-btn');
  if (stopBtn) stopBtn.addEventListener('click', stopStreaming);

  els.input.value = '';
  updateComposer();
  renderConversationList();
  els.stage.scrollTop = els.stage.scrollHeight;

  streamFromBackend(text);
}

// --- SSE 流 ---
async function streamFromBackend(message) {
  isStreaming = true;
  els.send.disabled = false;
  els.send.classList.add('streaming');
  els.send.innerHTML = '<i class="ti ti-player-stop"></i>';

  var target = els.view.querySelector('.streaming-message .stream-target');
  abortController = new AbortController();

  var url = backendBase() + '/ai/chat?memoryId=' + encodeURIComponent(activeConversation) +
    '&message=' + encodeURIComponent(message);

  // BYOK：选了服务商且填了 Key 才发覆盖头，否则后端用默认 DeepSeek
  var headers = {};
  if (overrideActive()) {
    var p = findProvider(settings.provider);
    headers['X-Model-Api-Key'] = settings.apiKey;
    headers['X-Model-Base-Url'] = p.baseUrl;
    headers['X-Model-Name'] = settings.model || p.models[0];
  }

  try {
    var response = await fetch(url, { signal: abortController.signal, headers: headers });
    if (!response.ok) {
      target.textContent = '请求失败 ' + response.status;
      finishStreaming();
      return;
    }

    var reader = response.body.getReader();
    var decoder = new TextDecoder('utf-8');
    var buffer = '';
    var fullText = '';

    while (true) {
      var result = await reader.read();
      if (result.done) break;

      buffer += decoder.decode(result.value, { stream: true });
      var events = buffer.split('\n\n');
      buffer = events.pop();

      for (var i = 0; i < events.length; i++) {
        var lines = events[i].split('\n');
        for (var j = 0; j < lines.length; j++) {
          if (lines[j].startsWith('data:')) {
            fullText += lines[j].slice(5);
          }
        }
      }

      target.textContent = fullText;
      var cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      cursor.textContent = '\u258B';
      target.appendChild(cursor);
      els.stage.scrollTop = els.stage.scrollHeight;
    }

    if (buffer.trim()) {
      var remaining = buffer.split('\n');
      for (var k = 0; k < remaining.length; k++) {
        if (remaining[k].startsWith('data:')) fullText += remaining[k].slice(5);
      }
      target.textContent = fullText;
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      target.textContent = (target.textContent || '') + '\n\n[连接失败: ' + err.message + ']';
    }
  }

  finishStreaming();
}

function finishStreaming() {
  isStreaming = false;
  abortController = null;
  els.send.classList.remove('streaming');
  els.send.innerHTML = '<i class="ti ti-arrow-up"></i>';
  els.send.disabled = !els.input.value.trim();

  var cursor = els.view.querySelector('.typing-cursor');
  if (cursor) cursor.remove();

  var streamingMsg = els.view.querySelector('.streaming-message');
  if (streamingMsg) {
    streamingMsg.classList.remove('streaming-message');
    var actions = streamingMsg.querySelector('.message-actions');
    if (actions) {
      actions.innerHTML =
        '<button class="copy-btn"><i class="ti ti-copy"></i>复制</button><time>刚刚</time>';
      var copyBtn = actions.querySelector('.copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', function () {
          var content = streamingMsg.querySelector('.stream-target');
          navigator.clipboard.writeText(content ? content.textContent : '').then(function () { showToast('已复制'); });
        });
      }
    }
  }
}

function stopStreaming() {
  if (!isStreaming) return;
  if (abortController) abortController.abort();
  showToast('已停止');
}

// --- 清空 / 删除当前会话 ---
function clearCurrentChat() {
  if (isStreaming) { stopStreaming(); }
  if (!activeConversation) { showToast('当前没有会话'); return; }
  // 移除该会话并回到欢迎页
  conversations = conversations.filter(function (c) { return c.id !== activeConversation; });
  activeConversation = null;
  saveConversations();
  renderConversationList();
  renderActiveConversation();
  showToast('已删除会话');
}

// --- Toast ---
var toastTimeout;
function showToast(msg) {
  clearTimeout(toastTimeout);
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  toastTimeout = setTimeout(function () { els.toast.classList.remove('show'); }, 1800);
}

// --- 侧边栏 ---
function openSidebar() { els.sidebar.classList.add('open'); els.scrim.classList.add('show'); }
function closeSidebar() { els.sidebar.classList.remove('open'); els.scrim.classList.remove('show'); }

// --- 模型配置弹窗 ---
var settingsEls = {
  backdrop: document.getElementById('settingsBackdrop'),
  backend: document.getElementById('cfgBackend'),
  provider: document.getElementById('cfgProvider'),
  model: document.getElementById('cfgModel'),
  apiKey: document.getElementById('cfgApiKey'),
  baseUrlHint: document.getElementById('cfgBaseUrlHint'),
  modelField: document.getElementById('cfgModelField'),
  apiKeyField: document.getElementById('cfgApiKeyField'),
  badge: document.getElementById('modelBadge')
};

function updateModelBadge() {
  var label;
  if (overrideActive()) {
    var p = findProvider(settings.provider);
    var name = settings.model || p.models[0];
    label = name.split(/[-/:]/)[0].toUpperCase();
  } else {
    label = 'DEEPSEEK'; // 后端默认
  }
  settingsEls.badge.textContent = '\u25C6 ' + label;
}

// 填充服务商下拉（含"默认"选项）
function populateProviderSelect() {
  var html = '<option value="">默认（后端配置）</option>';
  PROVIDERS.forEach(function (p) {
    html += '<option value="' + p.id + '">' + p.name + '</option>';
  });
  settingsEls.provider.innerHTML = html;
}

// 根据服务商填充模型下拉
function populateModelSelect(providerId, selectedModel) {
  var p = findProvider(providerId);
  if (!p) { settingsEls.model.innerHTML = ''; return; }
  var html = '';
  p.models.forEach(function (m) {
    var sel = m === selectedModel ? ' selected' : '';
    html += '<option value="' + m + '"' + sel + '>' + m + '</option>';
  });
  settingsEls.model.innerHTML = html;
}

// 根据当前选中服务商切换字段显隐与提示
function refreshSettingsFields() {
  var providerId = settingsEls.provider.value;
  var p = findProvider(providerId);
  if (p) {
    settingsEls.modelField.hidden = false;
    settingsEls.apiKeyField.hidden = false;
    settingsEls.baseUrlHint.textContent = 'Base URL：' + p.baseUrl;
  } else {
    settingsEls.modelField.hidden = true;
    settingsEls.apiKeyField.hidden = true;
    settingsEls.baseUrlHint.textContent = '使用后端 application-local.yml 中配置的模型';
  }
}

function openSettings() {
  settingsEls.backend.value = settings.backend || '';
  populateProviderSelect();
  settingsEls.provider.value = settings.provider || '';
  populateModelSelect(settings.provider, settings.model);
  settingsEls.apiKey.value = settings.apiKey || '';
  refreshSettingsFields();
  settingsEls.backdrop.classList.add('show');
}
function closeSettings() { settingsEls.backdrop.classList.remove('show'); }

function commitSettings() {
  settings.backend = settingsEls.backend.value.trim() || DEFAULT_SETTINGS.backend;
  settings.provider = settingsEls.provider.value;
  settings.model = settings.provider ? settingsEls.model.value : '';
  settings.apiKey = settingsEls.apiKey.value.trim();
  saveSettings();
  updateModelBadge();
  closeSettings();
  // 选了服务商但没填 Key 时提醒
  if (settings.provider && !settings.apiKey) {
    showToast('已保存，但未填 Key，仍走后端默认');
  } else {
    showToast('配置已保存');
  }
}
function resetSettings() {
  settings = Object.assign({}, DEFAULT_SETTINGS);
  saveSettings();
  updateModelBadge();
  openSettings(); // 重新填充为默认
  showToast('已重置为默认');
}

// --- 工具 ---
function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- 事件绑定 ---
els.search.addEventListener('input', renderConversationList);
els.input.addEventListener('input', updateComposer);
els.input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
els.send.addEventListener('click', sendMessage);
document.getElementById('newChatButton').addEventListener('click', createNewChat);
document.getElementById('clearChat').addEventListener('click', clearCurrentChat);
document.getElementById('themeToggle').addEventListener('click', function () {
  document.body.classList.toggle('light');
  showToast(document.body.classList.contains('light') ? '浅色模式' : '深色模式');
});
document.getElementById('mobileMenu').addEventListener('click', openSidebar);
document.getElementById('sidebarCollapse').addEventListener('click', closeSidebar);
els.scrim.addEventListener('click', closeSidebar);
bindPromptButtons(document.getElementById('quickPrompts'));

// 设置弹窗事件
document.getElementById('settingsButton').addEventListener('click', openSettings);
document.getElementById('settingsClose').addEventListener('click', closeSettings);
document.getElementById('settingsCancel').addEventListener('click', closeSettings);
document.getElementById('settingsSave').addEventListener('click', commitSettings);
document.getElementById('settingsReset').addEventListener('click', resetSettings);
settingsEls.provider.addEventListener('change', function () {
  populateModelSelect(settingsEls.provider.value, null);
  refreshSettingsFields();
});
settingsEls.backdrop.addEventListener('click', function (e) {
  if (e.target === settingsEls.backdrop) closeSettings();
});

document.addEventListener('keydown', function (e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSidebar(); els.search.focus(); }
  if (e.key === 'Escape') { closeSidebar(); closeSettings(); }
});

// --- 初始化 ---
// 始终以欢迎页启动，历史会话列在侧栏，不自动选中（消息未持久化）
activeConversation = null;
updateModelBadge();
renderConversationList();
renderActiveConversation();
updateComposer();
