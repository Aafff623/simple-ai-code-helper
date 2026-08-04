# README 配图需求 · readme-image-prompts

> 用途：投喂 GPT image-to-image 生成 README 配图。生成后图落盘 `assets/images/readme/`，再由 Phase B Step 5 组装进 README。本文档为 project-init Phase B 的执行层产物。

## §0 全局规范

### 项目定位
AI Code Helper：基于 Spring Boot + LangChain4j + 阿里云百炼 Qwen 的 AI 编程面试助手后端。整合 RAG 检索增强、MCP 外部工具、流式输出、会话记忆、输入安全护轨。

### 视觉总调
- 调性：科技感、专业、开发者审美，暗色为主
- 色板：深蓝/紫主色（`#6366f1` / `#3b82f6` / `#1e1b4b` 深底），辅助阿里云橙（`#ff6a00`）点缀，中性灰（`#94a3b8`）
- 材质：磨砂玻璃（glassmorphism）、柔和发光（neon glow）、细线网格背景
- 光影：冷色辉光，蓝紫渐变，边缘柔光，无过曝
- 风格：扁平 + 微立体，等距视角（isometric）用于架构/结构图

### 出图优先级
1. banner.png（最高）
2. architecture.png
3. workflow.png
4. tech-stack.png
5. features.png
6. structure.png

### 命名契约
- 目录：`assets/images/readme/`
- 文件名：小写 + 连字符，见下表
- 除非特别说明，图内不含文字标签（保持干净，文字由 README markdown 叠加）

| 文件 | 用途 | 比例 |
|------|------|------|
| banner.png | 页首横幅 | 3:1 |
| features.png | 核心功能一览 | 16:9 |
| architecture.png | 系统架构 | 4:3 |
| tech-stack.png | 技术栈 | 16:9 |
| workflow.png | 用户/业务主链路 | 16:9 |
| structure.png | 仓库目录结构 | 4:3 |

### GPT 系统指令模板（每张图前注入）
```
You are a senior technical illustrator. Generate a clean, modern, developer-facing illustration with a dark navy/purple palette (#6366f1, #3b82f6, #1e1b4b), subtle neon glow, glassmorphism, fine grid background. Flat design with micro-depth. No text labels unless specified. Crisp, high-detail, 4k.
```

---

## 图 1 · banner.png

- 基本信息：页首横幅，3:1，dark
- 一句话：AI 编程面试助手的 hero 横幅，呈现 AI + 编程 + 面试主题
- 详细描述：深蓝紫渐变背景，左侧一个发光的 AI 对话气泡与代码尖括号 `</>` 交织，右侧抽象的简历文档剪影，中间一条流式数据光带横向贯穿，底部细网格
- 元素清单：AI 对话气泡、代码尖括号 `</>`、流式光带、简历文档剪影、网格背景、蓝紫辉光
- 构图：左重右轻，光带横向贯穿，留呼吸空间
- 英文 Prompt：
```
A wide hero banner for an AI coding interview assistant, 3:1 aspect ratio. Dark navy-to-purple gradient background (#1e1b4b to #6366f1) with a fine grid overlay. On the left, a glowing AI chat bubble intertwined with code brackets </>. A horizontal streaming light band flows across the center. On the right, an abstract resume document silhouette. Subtle neon blue and purple glow, glassmorphism accents, flat design with micro-depth, no text, crisp 4k.
```

## 图 2 · architecture.png

- 基本信息：系统架构，4:3，等距视角
- 一句话：HTTP 请求到 Controller 到 AiService 到五项能力（ChatModel / Memory / RAG / Tools / MCP）的分层架构
- 详细描述：等距视角分层架构。顶层 HTTP 请求入口，向下 AiController（SSE），再下 AiCodeHelperService，底层分五列：StreamingChatModel、ChatMemory、ContentRetriever(RAG)、Tools、McpToolProvider。各层发光连线，底端指向 Qwen 大模型与向量库
- 元素清单：HTTP 入口节点、Controller 节点、AiService 节点、5 个能力节点、Qwen 模型节点、向量库节点、发光连线
- 构图：自上而下分层，等距视角，节点圆角矩形
- 英文 Prompt：
```
An isometric system architecture diagram, 4:3, dark theme. Top: HTTP request entry node. Below: an SSE controller node, then an AI service node. Bottom layer splits into five parallel nodes: streaming chat model, chat memory, RAG content retriever, tools, and MCP tool provider. Glowing connection lines flow downward to a Qwen LLM node and a vector store node. Dark navy background, fine grid, neon blue/purple glow, rounded rectangle nodes, no text labels, flat isometric, crisp 4k.
```

## 图 3 · workflow.png

- 基本信息：用户业务主链路，16:9
- 一句话：用户提问到流式 SSE 回答的对话流程
- 详细描述：横向流程。左侧用户头像提问，中间流式光带（由顺序文本块组成），右侧 AI 助手回复。底部 4 个方向小图标：学习路线、项目、求职、面试题
- 元素清单：用户节点、AI 节点、流式光带、4 方向图标、对话气泡
- 构图：左到右，流式光带强调逐块
- 英文 Prompt：
```
A horizontal workflow diagram, 16:9, dark theme. Left: a user avatar asking a question. Center: a streaming light band made of sequential text chunks flowing right. Right: an AI assistant avatar responding. Four small icons along the bottom: learning path, project, job search, interview questions. Navy background, grid overlay, neon blue glow, flat design, no text, crisp 4k.
```

## 图 4 · tech-stack.png

- 基本信息：技术栈，16:9
- 一句话：Spring Boot + LangChain4j + Qwen + MCP + RAG + SSE 的技术组合
- 详细描述：6 个发光技术卡片 3x2 网格排列：绿叶(Spring Boot)、链环(LangChain4j)、橙圆(Qwen)、插头(MCP)、向量嵌入(RAG)、流式信号(SSE)。深底玻璃卡片
- 元素清单：6 个技术卡片、发光边框、网格底
- 构图：3x2 网格，等距
- 英文 Prompt：
```
A technology stack illustration, 16:9, dark theme. Six glowing tech cards arranged in a 3x2 grid: a green leaf (Spring Boot), a chain link (LangChain4j), an orange circle (Qwen), a plug icon (MCP), a vector embedding icon (RAG), and a streaming signal icon (SSE). Dark navy background, fine grid, neon blue and orange glow, glassmorphism cards, flat design, no text, crisp 4k.
```

## 图 5 · features.png

- 基本信息：核心功能一览，16:9
- 一句话：8 大能力（对话/流式/RAG/MCP/工具/记忆/护轨/监听）的图标矩阵
- 详细描述：8 个功能图标卡 4x2 网格：对话气泡、流式波、书本检索、联网搜索、扳手工具、记忆节点、盾牌护轨、波形监听
- 元素清单：8 图标卡、发光、网格
- 构图：4x2 网格
- 英文 Prompt：
```
A feature grid illustration, 16:9, dark theme. Eight glowing icon cards in a 4x2 grid: chat bubble, streaming wave, book search (RAG), web search (MCP), wrench tool, memory node, shield guardrail, waveform monitor. Dark navy background, fine grid, neon blue/purple glow, glassmorphism, flat design, no text, crisp 4k.
```

## 图 6 · structure.png

- 基本信息：仓库目录结构，4:3，等距视角
- 一句话：项目目录树的可视化
- 详细描述：等距视角文件夹树。根节点 simple-ai-code-helper，分支 src/main/java（controller/config/rag/mcp/tools 等子目录）、resources（docs/system-prompt）、docs、assets。文件夹发光，文件细线
- 元素清单：文件夹节点、文件节点、树形连线
- 构图：自上而下树形，等距
- 英文 Prompt：
```
An isometric directory structure diagram, 4:3, dark theme. A tree of folders and files from a project root. Branches: src/main/java with subfolders (controller, config, rag, mcp, tools), resources (docs, system-prompt), docs, assets. Folders glow softly, files are thin lines. Dark navy background, fine grid, neon blue glow, flat isometric, no text labels, crisp 4k.
```

---

## 出图后落盘

- 6 张图放入 `assets/images/readme/`
- 文件名严格按上表
- 之后进入 Phase B Step 5：组装 README（结构 + 样式 + 图引用）
