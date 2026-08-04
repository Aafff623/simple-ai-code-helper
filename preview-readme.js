(function () {
  // README 预览壳：fetch README.md → marked 渲染
  const cfg = window.__PREVIEW_README__ || {
    readmeFile: 'README.md',
    pageLang: 'zh-CN',
    title: 'README Preview',
    toolbarTitle: 'README Preview',
    hint: 'Preview README.md locally',
    reloadLabel: 'Reload README',
    openLabel: 'Open README.md',
    loading: 'Loading README…',
    loadedPrefix: 'Loaded',
    fileProtocolError:
      'Open via local HTTP server (file:// cannot fetch README). From repo root: python -m http.server 8090',
    fetchError: 'Failed to load README.',
    footerNote: 'Preview: preview-readme.html · Assets: assets/images/readme/',
    activeLang: 'zh',
    zhPage: 'preview-readme.html',
    enPage: 'preview-readme.html',
  };

  document.documentElement.lang = cfg.pageLang;
  document.title = cfg.title;

  const contentEl = document.getElementById('content');
  const statusEl = document.getElementById('status');
  const reloadBtn = document.getElementById('reload-btn');
  const toolbarTitle = document.getElementById('toolbar-title');
  const toolbarHint = document.getElementById('toolbar-hint');
  const openLink = document.getElementById('open-readme-link');
  const footerNote = document.getElementById('footer-note');

  if (toolbarTitle) toolbarTitle.textContent = cfg.toolbarTitle;
  if (toolbarHint) toolbarHint.innerHTML = cfg.hint;
  if (reloadBtn) reloadBtn.textContent = cfg.reloadLabel;
  if (openLink) {
    openLink.href = './' + cfg.readmeFile;
    openLink.textContent = cfg.openLabel;
  }
  if (footerNote) footerNote.textContent = cfg.footerNote;

  marked.setOptions({ gfm: true, breaks: false });

  function setStatus(type, message) {
    statusEl.className = 'status ' + type;
    statusEl.textContent = message;
  }

  async function loadReadme() {
    if (location.protocol === 'file:') {
      setStatus('error', cfg.fileProtocolError);
      contentEl.innerHTML =
        '<p>Cannot load README under <code>file://</code>. Start a local HTTP server first.</p>';
      return;
    }

    setStatus('ok', cfg.loading);
    if (reloadBtn) reloadBtn.disabled = true;

    try {
      const res = await fetch('./' + cfg.readmeFile + '?ts=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const md = await res.text();
      contentEl.innerHTML = marked.parse(md);
      const locale = cfg.pageLang.startsWith('zh') ? 'zh-CN' : 'en-US';
      setStatus('ok', cfg.loadedPrefix + ' ' + cfg.readmeFile + ' · ' + new Date().toLocaleString(locale));
    } catch (err) {
      setStatus('error', cfg.fetchError + ' ' + err.message);
      contentEl.innerHTML =
        '<p>Could not read <code>' + cfg.readmeFile + '</code>. Serve from repo root via HTTP.</p>';
    } finally {
      if (reloadBtn) reloadBtn.disabled = false;
    }
  }

  if (reloadBtn) reloadBtn.addEventListener('click', loadReadme);
  loadReadme();
})();
