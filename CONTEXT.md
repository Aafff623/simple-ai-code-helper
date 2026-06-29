# CONTEXT · 领域术语表

本文件定义 **AI Code Helper** 项目的领域语言。所有 issue、PRD、重构提案、测试命名、假设描述都应使用此处的术语，避免漂移到同义词。新概念若不在表中，要么是在引入项目不使用的语言（请重新斟酌），要么是真实缺口（补充到此处）。

> 布局：单上下文（single-context）。本文件 + `docs/adr/` 位于仓库根目录。

---

## 项目一句话

一个基于 Spring Boot + LangChain4j 的 **AI 编程面试助手**后端，围绕「编程学习路线、项目建议、求职全流程、高频面试题」四个方向，通过大模型对话 + RAG + 工具调用为用户提供帮助。

---

## 业务领域词汇

| 术语 | 定义 |
|------|------|
| **助手 / AI 小助手** | 系统对外呈现的角色，由 `system-prompt.txt` 设定人设，聚焦编程学习与求职面试。 |
| **会话（Session）** | 一次有上下文记忆的连续对话，由 `memoryId` 唯一标识；不同 `memoryId` 之间记忆相互隔离。 |
| **知识库（Knowledge Base）** | `src/main/resources/docs/` 下的 Markdown 资料（面试题、简历指南），作为 RAG 的检索来源，是项目的核心**数据资产**。 |
| **学习报告（Report）** | `chatForReport` 返回的结构化结果，含用户名与建议列表（`record Report(String name, List<String> suggestionList)`）。 |

---

## 技术领域词汇（LangChain4j 概念在本项目的具体含义）

| 术语 | 在本项目中的含义 | 代码位置 |
|------|------------------|----------|
| **AiService** | LangChain4j 声明式 AI 接口。本项目指 `AiCodeHelperService` 接口，通过注解声明系统提示词、护轨与各方法。**不使用** `@AiService` 自动扫描（已注释），改由工厂手动装配。 | `AiCodeHelperService` |
| **工厂（Factory）** | 手动构建 AiService 实例的配置类，用 `AiServices.builder(...)` 串联 ChatModel、记忆、RAG、工具、MCP。注意拼写为 `Factor`（非 `Factory`）。 | `AiCodeHelperServiceFactor` |
| **ChatModel** | 同步大模型。项目存在两个 Bean：`myQwenChatModel`（自定义、带监听器，工厂使用）与 starter 自动配置的 `qwenChatModel`（`AiCodeHelper` 示例类使用）。引用时务必区分。 | `QwenChatModelConfig` |
| **StreamingChatModel** | 流式大模型 `qwenStreamingChatModel`（starter 自动配置），支撑 `chatStream` 的逐字输出。 | `AiCodeHelperServiceFactor` |
| **RAG / 内容检索器（ContentRetriever）** | 检索增强生成。`RagConfig` 加载知识库 → 切段 → 向量化 → 检索，返回 Top 5、相似度 ≥ 0.75 的片段注入提示词。 | `RagConfig` |
| **EmbeddingStore** | 向量存储。当前为内存实现，每次启动重建，不持久化。 | `RagConfig`（注入） |
| **EmbeddingModel** | 文本向量化模型 `qwenEmbeddingModel`（starter 自动配置）。 | `RagConfig`（注入） |
| **DocumentSplitter** | 文档切段器，本项目用 `DocumentByParagraphSplitter(1000, 200)`：按段落切，最大 1000 字符、重叠 200。 | `RagConfig` |
| **ChatMemory / MemoryId** | 会话记忆。`MessageWindowChatMemory` 每会话保留最近 10 条；`@MemoryId` 注解实现按用户隔离。 | `AiCodeHelperServiceFactor` |
| **Tool / 工具调用（Tool Calling）** | 大模型自主调用的本地方法。项目内置 `InterviewQuestionTool#searchInterviewQuestions`（`@Tool` 注解，Jsoup 爬取搜索页）。 | `InterviewQuestionTool` |
| **McpToolProvider / MCP** | Model Context Protocol 外部工具。经 `HttpMcpTransport` 以 SSE 连接智谱 BigModel 的 web_search 服务。 | `McpConfig` |
| **Guardrail / 输入护轨** | 请求进入大模型前的安全校验。`SafeInputGuardrail` 检测敏感词（`kill`/`evil`），命中返回 `fatal` 拦截。 | `SafeInputGuardrail` |
| **ChatModelListener** | 大模型调用监听器，记录 `onRequest`/`onResponse`/`onError` 日志，用于调试。 | `ChatModelListenerConfig` |
| **系统提示词（System Prompt）** | `system-prompt.txt`，经 `@SystemMessage(fromResource=...)` 注入。注意 `AiCodeHelper` 类内另有一份**硬编码**的等价提示词。 | `system-prompt.txt` |
| **SSE / 流式输出** | Server-Sent Events。`AiController#chat` 返回 `Flux<ServerSentEvent<String>>`，逐块推送回答。 | `AiController` |

---

## 关键命名约定（避免歧义）

- **两个 ChatModel Bean**：`myQwenChatModel`（自定义带监听器）≠ `qwenChatModel`（starter 自动配置）。讨论「Qwen 模型」时必须指明是哪一个。
- **两条对话实现路径**：`AiCodeHelperService`（接口，项目实际经 Controller 使用）≠ `AiCodeHelper`（类，直接调 ChatModel 的演示）。
- **工厂类名**：源码中为 `AiCodeHelperServiceFactor`（缺 `y`），引用类名时以源码为准。

---

## 配置约定

| 配置项 | 用途 | 放置位置 |
|--------|------|----------|
| `langchain4j.community.dashscope.chat-model.model-name` | Qwen 模型名（`qwen-max`） | `application.yml` |
| `langchain4j.community.dashscope.chat-model.api-key` | DashScope 密钥 | **真实值放 `application-local.yml`** |
| `bigmodel.api-key` | 智谱 BigModel 密钥（MCP web_search） | **真实值放 `application-local.yml`** |

- 真实密钥一律放入被 `.gitignore` 忽略的 `application-local.yml`；`application.yml` 仅保留占位符与说明。
- 模板见 `application-local.yml.example`。
- 激活 profile 固定为 `local`。

---

## 架构决策（ADR）

重要的架构权衡记录在 `docs/adr/`（当前尚无条目，按需在解决具体决策时新增）。若某项输出与既有 ADR 冲突，应显式指出而非默默覆盖。
