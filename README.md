# AI Code Helper · AI 编程面试助手

基于 **Spring Boot 3.5 + LangChain4j** 构建的 AI 编程学习与求职面试助手后端。以阿里云百炼 Qwen 大模型为核心，整合了 **RAG 检索增强、MCP 外部工具、流式输出、会话记忆、输入安全护轨** 等大模型应用工程的典型能力。

> 定位：一个用于学习 LangChain4j 大模型应用开发的完整示例后端，聚焦编程学习路线、项目建议、求职全流程与高频面试题四个方向。

---

## ✨ 功能特性

| 能力 | 说明 | 关键实现 |
|------|------|----------|
| 💬 智能对话 | 编程学习/求职面试领域问答，内置系统提示词 | `AiCodeHelperService` + `system-prompt.txt` |
| 🌊 流式输出（SSE） | 基于 Reactor `Flux` 的 Server-Sent Events 逐字返回 | `AiController#chat` |
| 📚 RAG 检索增强 | 加载本地面试题/简历指南知识库，向量检索后增强回答 | `RagConfig` |
| 🔧 MCP 外部工具 | 接入智谱 BigModel 的 Web Search MCP 服务联网搜索 | `McpConfig` |
| 🛠️ 自定义工具调用 | Tool Calling 爬取公开搜索页的面试题资源 | `InterviewQuestionTool` |
| 🧠 会话记忆 | 按 `memoryId` 隔离用户会话，每会话保留最近 10 条 | `AiCodeHelperServiceFactor` |
| 🛡️ 输入安全护轨 | 敏感词检测，命中即拦截请求 | `SafeInputGuardrail` |
| 📋 请求监听日志 | 监听大模型请求/响应/错误，便于调试 | `ChatModelListenerConfig` |
| 🌐 跨域支持 | 全局 CORS 配置，为前端联调准备 | `CorsConfig` |

---

## 🧰 技术栈

- **JDK**：Java 21
- **框架**：Spring Boot 3.5.13（spring-boot-starter-web）
- **大模型框架**：LangChain4j 1.1.0
  - `langchain4j` / `langchain4j-spring-boot-starter`
  - `langchain4j-reactor`（流式输出）
  - `langchain4j-mcp`（MCP 工具）
  - `langchain4j-community-dashscope-spring-boot-starter`（阿里云百炼 Qwen 接入）
- **大模型**：阿里云百炼 DashScope `qwen-max`
- **网页解析**：Jsoup 1.20.1（工具调用爬取）
- **辅助**：Lombok
- **构建**：Maven（含 `mvnw` Wrapper）

---

## 🏗️ 架构与能力链路

```
HTTP 请求 (GET /ai/chat)
      │
      ▼
┌─────────────────┐   SSE 流式 Flux<ServerSentEvent>
│  AiController   │ ──────────────────────────────────▶ 客户端
└────────┬────────┘
         │ 调用
         ▼
┌──────────────────────────────────────────────────────┐
│  AiCodeHelperService  (LangChain4j 声明式 AiService)    │
│  · @SystemMessage(system-prompt.txt) 系统提示词         │
│  · @InputGuardrails  → SafeInputGuardrail 敏感词拦截    │
└────────┬─────────────────────────────────────────────┘
         │ 由工厂 AiCodeHelperServiceFactor 装配以下组件
         ▼
   ┌──────────────┬───────────────┬──────────────┬───────────────┐
   ▼              ▼               ▼              ▼               ▼
StreamingChat   ChatMemory     ContentRetriever  Tools         McpToolProvider
Model(流式)    (每会话10条)    (RAG 检索)        (面试题爬取)   (智谱 Web Search)
   │                              │
   ▼                              ▼
Qwen 大模型              EmbeddingStore 向量库
(myQwenChatModel         ← RagConfig 加载 docs/*.md
 + ChatModelListener)      切段(1000/200) → 向量化 → 检索(top5, score≥0.75)
```

---

## 📁 目录结构

```
simple-ai-code-helper/
├── src/main/java/com/threetwoa/aicodehelper/
│   ├── AiCodeHelperApplication.java        # Spring Boot 启动入口
│   └── ai/
│       ├── AiCodeHelper.java               # 直接调用 ChatModel 的示例 Service（硬编码提示词）
│       ├── AiCodeHelperService.java        # 声明式 AiService 接口（项目实际使用）
│       ├── AiCodeHelperServiceFactor.java  # 工厂：手动装配 AiService 各能力 Bean
│       ├── config/CorsConfig.java          # 全局跨域
│       ├── controller/AiController.java    # REST 接口，SSE 流式输出
│       ├── guardrail/SafeInputGuardrail.java   # 输入安全护轨
│       ├── listener/ChatModelListenerConfig.java # 大模型请求监听日志
│       ├── mcp/McpConfig.java              # MCP 工具提供者（智谱 Web Search）
│       ├── model/QwenChatModelConfig.java  # 自定义 Qwen ChatModel Bean
│       ├── rag/RagConfig.java              # RAG 内容检索器
│       └── tools/InterviewQuestionTool.java # 自定义工具：面试题搜索
└── src/main/resources/
    ├── application.yml                     # 主配置（占位符，提交到 git）
    ├── application-local.yml.example       # 本地私密配置模板（复制后填真实密钥）
    ├── system-prompt.txt                   # 系统提示词
    └── docs/                               # 📚 RAG 知识库（面试题 / 简历指南）
        ├── AI大模型原理和应用面试题速记通关版.md
        ├── Java_基础面试题速记通关版.md
        └── 程序员鱼皮写简历指南(保姆级).md
```

---

## 🚀 快速开始

### 1. 前置条件

- JDK 21+
- Maven 3.9+（或直接用项目自带的 `mvnw`）
- 两个 API Key：
  - **阿里云百炼 DashScope**：https://bailian.console.aliyun.com/ （Qwen 大模型与 Embedding）
  - **智谱 BigModel**：https://open.bigmodel.cn/ （Web Search MCP 工具）

### 2. 配置密钥（重要）

真实密钥**不要**写进 `application.yml`（该文件会提交到 git）。请使用本地私密配置：

```bash
# 复制模板为本地配置（application-local.yml 已被 .gitignore 忽略）
cp src/main/resources/application-local.yml.example src/main/resources/application-local.yml
```

然后编辑 `application-local.yml`，填入真实密钥：

```yaml
langchain4j:
  community:
    dashscope:
      chat-model:
        model-name: qwen-max
        api-key: sk-你的真实DashScopeKey

bigmodel:
  api-key: 你的真实BigModelKey
```

### 3. 运行

```bash
# 从项目根目录启动（RagConfig 使用相对路径 src/main/resources/docs 加载知识库）
./mvnw spring-boot:run        # Linux/macOS
mvnw.cmd spring-boot:run      # Windows
```

启动时会自动读取 `docs/` 下的 Markdown，切段并向量化写入内存向量库（每次启动重建）。

---

## 🔌 API 说明

### 流式对话

```
GET /ai/chat?memoryId={会话ID}&message={用户消息}
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `memoryId` | int | 会话标识，相同 ID 共享上下文记忆（最近 10 条） |
| `message`  | String | 用户输入；命中敏感词（如 `kill`/`evil`）会被护轨拦截 |

**返回**：`text/event-stream`（SSE），大模型回答逐块流式推送。

示例：

```bash
curl -N "http://localhost:8080/ai/chat?memoryId=1&message=如何准备Java并发面试"
```

---

## 📚 RAG 知识库

- 知识库位于 `src/main/resources/docs/`，目前包含 Java 基础面试题、AI 大模型面试题、简历指南三份资料。
- 加载流程（见 `RagConfig`）：`FileSystemDocumentLoader` 加载目录 → `DocumentByParagraphSplitter`（最大 1000 字符、重叠 200）切段 → 每段注入文件名 → `qwenEmbeddingModel` 向量化 → 写入 `EmbeddingStore`。
- 检索规则：返回 Top 5 结果，过滤相似度低于 `0.75` 的片段。
- **新增知识**：把 Markdown 文件放入 `docs/` 目录即可，重启应用后自动生效。

---

## ⚠️ 已知限制与说明

- **纯后端项目**：当前仓库仅含后端 API，前端界面尚未包含（CORS 已为前端联调预留）。
- **内存向量库**：向量数据存于内存，每次启动重新构建，重启后不持久化。
- **知识库相对路径**：`RagConfig` 以相对路径 `src/main/resources/docs` 加载文档，需从项目根目录启动；若打包成可执行 jar 运行，该路径将不可用（属已知待改进点）。
- `AiCodeHelper`（类）与 `AiCodeHelperService`（接口）是两条独立实现路径：前者为直接调用 `ChatModel` 的示例，后者是项目实际通过 Controller 使用的声明式 AiService。

---

## 🧪 测试

```bash
./mvnw test
```

测试位于 `src/test/java/...`，覆盖 AiService 工厂装配、对话调用与工具调用等。

---

## 📄 相关文档

- 领域术语表：[`CONTEXT.md`](./CONTEXT.md)
- Agent 协作约定：[`CLAUDE.md`](./CLAUDE.md) 与 [`docs/agents/`](./docs/agents/)
