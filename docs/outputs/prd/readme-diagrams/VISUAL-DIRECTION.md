# AI Code Helper · README 视觉重构方向

## 核心判断

放弃常见的“深色背景 + 发光图标卡片 + 机械连线”模板，改为 **Dark Editorial Computational Atlas（暗色编辑式计算图谱）**。

- **品牌母题**：推理核心、数据丝带、知识轨道、玻璃/金属薄片、蓝图式层级。
- **视觉节奏**：大面积留白 + 单一视觉焦点 + 少量橙色高光。
- **技术隐喻**：不依赖文字标签，通过流、轨道、晶体、分支和层级表达 SSE、Memory、RAG、MCP、Tools 与目录结构。
- **统一色彩**：深墨蓝 `#060817`、靛青 `#5b7cff`、冷青 `#62ddff`、信号橙 `#ff7a1a`。

## 六张图的叙事

1. `banner.png`：AI 对话壳体、代码切面、流式数据与简历载体，形成项目主视觉。
2. `architecture.png`：中央 AI Service 作为推理中枢，五项能力环绕，下接 Qwen 与向量知识层。
3. `workflow.png`：用户与 AI 分处两端，token 流在中间形成可感知的 SSE 流式过程。
4. `tech-stack.png`：技术不再排列成普通 Logo 宫格，而是作为六块“材料样本”悬浮在同一轨道中。
5. `features.png`：八项能力围绕对话核心形成仪器式功能星盘。
6. `structure.png`：仓库目录被重构为一棵发光的代码分支网络，而不是普通文件树截图。

## 文件结构

```text
assets/images/readme/
├── banner.png
├── architecture.png
├── workflow.png
├── tech-stack.png
├── features.png
└── structure.png

sources/svg/
└── 对应六张可编辑 SVG 源文件
```
