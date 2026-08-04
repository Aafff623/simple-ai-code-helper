# README 配图 Brief · readme-diagram-brief

> 用途：project-init Phase B Step 1 契约层产物。定义 README 章节地图、配图节点、设计语言与验收标准。执行层产物见同目录 `readme-image-prompts.md`。

> 补录说明：本文档为事后补录（六张图与 README 已完成组装后补齐规范要求的 brief 层文档），内容与已落地的 `VISUAL-DIRECTION.md`、`readme-image-prompts.md` §0 保持一致，不重新设计。

## 章节地图 × 配图节点

| README 章节 | 配图 | 叙事定位 |
|------|------|------|
| 页首 | `banner.png` | 项目主视觉：AI 对话壳体、代码切面、流式数据、简历载体 |
| 功能特性 | `features.png` | 8 项能力（对话/流式/RAG/MCP/工具/记忆/护轨/监听）围绕对话核心的功能星盘 |
| Showcase | `showcase-*.png` | 产品主链路实机：空会话 / 对话态 / BYOK 设置 |
| Preview | （省略） | 单产品无 Gallery；README 壳用 `preview-readme.html` |
| 架构与能力链路 | `architecture.png` | AI Service 中枢；对话 DeepSeek、向量层 DashScope Qwen Embedding |
| 技术栈 | `tech-stack.png` | 六项技术作为"材料样本"悬浮于同一轨道，而非 Logo 宫格 |
| API / 主链路 | `workflow.png` | 用户与 AI 分处两端，token 流形成可感知的 SSE 流式过程 |
| 目录结构 | `structure.png` | 仓库目录重构为发光的代码分支网络 |

## 资产清单

```
assets/images/readme/
├── banner.png                 (3:1)     # 说明图
├── features.png               (16:9)
├── architecture.png           (4:3)
├── tech-stack.png             (16:9)
├── workflow.png               (16:9)
├── structure.png              (4:3)
├── showcase-home.png          # 产品主链路实机
├── showcase-chat.png
├── showcase-settings.png
├── preview-contact-sheet.png  # 历史 contact sheet（≠ preview-shell）
└── sources/svg/               # 可编辑 SVG 源

docs/outputs/prd/readme-diagrams/
├── VISUAL-DIRECTION.md       # 方向稿：母题、色彩、叙事
├── readme-diagram-brief.md   # 本文档：契约层
└── readme-image-prompts.md   # 执行层：可投喂 GPT 的英文 prompt
```

## 设计语言

沿用 `VISUAL-DIRECTION.md` 的判断：**Dark Editorial Computational Atlas（暗色编辑式计算图谱）**，放弃"深色背景 + 发光图标卡片 + 机械连线"的常见模板。

- 品牌母题：推理核心、数据丝带、知识轨道、玻璃/金属薄片、蓝图式层级
- 视觉节奏：大面积留白 + 单一视觉焦点 + 少量橙色高光
- 统一色彩：深墨蓝 `#060817`、靛青 `#5b7cff`、冷青 `#62ddff`、信号橙 `#ff7a1a`
- 技术隐喻：不依赖文字标签，通过流、轨道、晶体、分支、层级表达 SSE / Memory / RAG / MCP / Tools / 目录结构

## 验收

- [x] 六张说明图按命名契约落盘 `assets/images/readme/`
- [x] README 对应章节已引用图片
- [x] 无文字标签内嵌图内（文字由 README markdown 叠加）
- [x] 色彩与母题在六张图间保持一致
- [x] **Preview 站**：单产品应用，**省略**独立 Gallery；README 已书面声明；不强制 `preview-shell.png`
- [x] **Showcase**：`showcase-home/chat/settings.png` 已落盘并在 README 引用（Vite 实机截图）
- [x] **README 预览壳**：根 `preview-readme.{html,css,js}`，端口 8092
