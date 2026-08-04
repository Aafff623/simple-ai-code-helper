# CONTEXT · 领域术语表

本文件定义 **AI Code Helper** 的领域语言与技术事实。issue、PRD、重构提案、测试命名均以此为准。新概念若不在表中：要么是项目不用的语言（请改用现有词），要么是真实缺口（补到此处）。

> 布局：单上下文（single-context）。本文件 + `docs/adr/`。  
> 共享任务流用词见根 `LANGUAGES.md`（勿在 `docs/agents/` 再维护 language/context）。

---

## 项目一句话

基于 **Spring Boot + LangChain4j** 的 **AI 编程面试助手**：后端提供 SSE 流式对话、RAG、Tool Calling、MCP、会话记忆与输入护轨；前端为 Vite 原生 JS 对话壳，支持 BYOK（自带 Key）覆盖模型。

---

## 产品边界

聚焦四个方向：

1. 编程学习路线  
2. 项目学习建议  
3. 求职全流程（简历 / 投递）  
4. 高频面试题与技巧  

人设由 `src/main/resources/system-prompt.txt` 注入；演示类 `AiCodeHelper` 内另有硬编码副本（非 Controller 主路径）。

---

## 业务领域词汇

| 术语 | 定义 |
|------|------|
| **助手 / AI 小助手 / 面试助手** | 对外角色；由系统提示词设定，聚焦编程学习与求职面试。 |
| **会话（Session）** | 一次有上下文记忆的连续对话，由 `memoryId` 标识；不同 ID 记忆隔离。 |
| **知识库（Knowledge Base）** | `src/main/resources/docs/` 下 Markdown（面试题、简历指南），RAG 检索来源。 |
| **学习报告（Report）** | `chatForReport` 的结构化结果：`record Report(String name, List<String> suggestionList)`。 |
| **BYOK** | Bring Your Own Key：前端通过 `X-Model-Api-Key` / `X-Model-Base-Url` / `X-Model-Name` 覆盖默认对话模型。 |
| **产品层根** | 后端 `src/`；前端 `frontend/`（非 monorepo 包管理，双目录并列）。 |

---

## 技术领域词汇

| 术语 | 在本项目中的含义 | 代码位置 |
|------|------------------|----------|
| **AiService** | 声明式 AI 接口 `AiCodeHelperService`；不用 `@AiService` 自动扫描，由工厂手动装配。 | `AiCodeHelperService` |
| **默认工厂** | `AiCodeHelperServiceFactor`（拼写缺 `y`，以源码为准）：装配 DeepSeek + Memory + RAG + Tool + MCP。 | `AiCodeHelperServiceFactor` |
| **动态工厂** | `DynamicAiServiceFactory`：按 BYOK 参数缓存 AiService。 | `DynamicAiServiceFactory` |
| **对话模型（默认）** | DeepSeek（OpenAI 兼容），配置前缀 `deepseek.*`，默认 `deepseek-v4-flash`。 | `DeepSeekChatModelConfig` |
| **Embedding / 遗留 Chat** | DashScope Qwen：`qwenEmbeddingModel` 服务 RAG；`myQwenChatModel` / starter `qwenChatModel` 为遗留/演示路径。 | `QwenChatModelConfig` · starter |
| **RAG / ContentRetriever** | 加载知识库 → 切段 → 向量化 → Top 5、相似度 ≥ 0.75。 | `RagConfig` |
| **EmbeddingStore** | 内存实现，每次启动重建，不持久化。 | `RagConfig` |
| **ChatMemory / MemoryId** | `MessageWindowChatMemory`，每会话最近 10 条。 | 工厂装配 |
| **Tool** | `InterviewQuestionTool#searchInterviewQuestions`（Jsoup 爬公开搜索页）。 | `InterviewQuestionTool` |
| **MCP** | 经 `HttpMcpTransport` SSE 连接智谱 BigModel `web_search`。 | `McpConfig` |
| **Guardrail** | `SafeInputGuardrail` 敏感词（如 `kill`/`evil`）→ `fatal`。 | `SafeInputGuardrail` |
| **SSE** | `AiController#chat` → `Flux<ServerSentEvent<String>>`；前端 `fetch` + ReadableStream。 | `AiController` · `frontend/app.js` |
| **生产 API** | 唯一生产入口：`GET /ai/chat?memoryId=&message=`。 | `AiController` |

---

## 关键命名约定

- **两条对话路径**：`AiCodeHelperService`（Controller 使用）≠ `AiCodeHelper`（直接调 ChatModel 的演示）。
- **多个 ChatModel Bean**：默认流式对话走 DeepSeek；`myQwenChatModel` ≠ starter `qwenChatModel`。讨论「用哪个模型」必须指明 Bean。
- **工厂类名**：`AiCodeHelperServiceFactor`（缺 `y`）以源码为准。

---

## 技术栈事实

| 层 | 选型 | 说明 |
|----|------|------|
| 运行时 | JDK 21 | |
| 后端 | Spring Boot 3.5.13 Web | Maven Wrapper |
| AI | LangChain4j 1.1.0 / beta7 | reactor · mcp · dashscope · open-ai |
| 对话 | DeepSeek OpenAI 兼容 | `deepseek-v4-flash` 默认 |
| 向量 | DashScope Qwen Embedding | starter 自动配置 |
| 网页解析 | Jsoup 1.20.1 | Tool Calling |
| 前端 | Vite ^6.3.5 + 原生 JS | 端口 5173；无 React/Vue |
| 后端端口 | 8080 | |

---

## 配置约定

| 配置项 | 用途 | 存放 |
|--------|------|------|
| `deepseek.*` | 流式/同步对话 | `application-local.yml` |
| `langchain4j.community.dashscope.*` | Embedding / 遗留 Qwen Chat | `application-local.yml` |
| `bigmodel.api-key` | 智谱 Web Search MCP | `application-local.yml` |

- 真实密钥只放被 `.gitignore` 忽略的 `application-local.yml`。
- 模板：`application-local.yml.example`。
- `spring.profiles.active=local`。
- RagConfig 以相对路径 `src/main/resources/docs` 加载语料 → **必须从仓库根启动**。

---

## 前端事实（产品壳）

| 项 | 说明 |
|----|------|
| 入口 | `frontend/index.html` · `frontend/app.js` · `frontend/styles.css` |
| 能力 | 会话列表、SSE 渲染、主题切换、模型设置弹窗、快捷提问 |
| 持久化 | `localStorage`：`ai-helper-settings`、`ai-helper-conversations`（仅元数据，消息正文不落盘） |
| BYOK 预设 | DeepSeek · 通义 · 智谱 · Moonshot · OpenAI · 硅基流动 |

---

## Preview / Showcase

| 类型 | 本仓策略 |
|------|----------|
| **Preview 站** | **省略**：单产品应用，无组件库/多 demo 目录式预览壳。 |
| **Showcase** | 以产品主链路实机截图为主（`assets/images/readme/showcase-*.png`）。 |
| **README 预览壳** | 根目录 `preview-readme.{html,css,js}`，端口 **8092**（无 port-registry）。 |

---

## 架构决策（ADR）

重要权衡记在 `docs/adr/`。采用 ADR 制度见 `docs/adr/0000-record-architecture-decisions.md`。与既有 ADR 冲突须显式指出。

---

## 已知限制

- 内存向量库：重启重建，不持久化。
- 知识库相对路径：打可执行 jar 后 `src/main/resources/docs` 相对路径不可用（待改进）。
- 前端消息正文不落盘：刷新后侧栏有会话名，内容需重聊。
