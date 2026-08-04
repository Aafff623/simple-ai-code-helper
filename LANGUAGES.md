# LANGUAGES · 共享用词

Agent 输出（Issue / PRD / handoff / commit / Review）必须使用本表词汇。领域术语定义见 `CONTEXT.md`；此处只列**共享任务流与协作用词**，避免与 CONTEXT 抢事实源。

---

## Issue / Triage

| 用词 | 含义 |
|------|------|
| **Issue** | 本地 `.scratch/<feature>/` 下的 markdown 工单（默认 tracker） |
| **needs-triage** | 新进尚未分类 |
| **needs-info** | 缺复现 / 缺验收标准 |
| **ready-for-agent** | 可交 Agent 实施 |
| **ready-for-human** | 需人拍板或验收 |
| **wontfix** | 明确不做 |

---

## 任务流

| 用词 | 含义 |
|------|------|
| **report** | 调研分析，路径 `docs/outputs/report/{theme}/` |
| **PRD** | 产品需求，路径 `docs/outputs/prd/{theme}/prd.md` |
| **handoff** | 任务交接快照，路径 `docs/outputs/handoff/{theme}/`；**覆盖式**更新（旧文件直接删除） |
| **awaiting-review** | 实施完成、停等用户 Review |
| **commit-history** | 攒批摘要，`docs/outputs/commit-history/{branch}/YYYY-MM-DD.md` |
| **ADR** | 架构决策记录，`docs/adr/000N-kebab-title.md` |
| **theme** | 业务主题目录名（kebab-case） |

---

## 产品与路径用词

| 用词 | 必须写为 |
|------|----------|
| 后端产品根 | `src/` |
| 前端产品根 | `frontend/` |
| 知识库 | `src/main/resources/docs/`（勿写成仓库根 `docs/`） |
| 文档产物根 | `docs/outputs/`（**复数**；禁止 `docs/output/`） |
| README 配图 | `assets/images/readme/` |
| 生产 API | `GET /ai/chat` |
| 默认对话模型 | DeepSeek（配置 `deepseek.*`） |
| Embedding | DashScope Qwen Embedding |
| 流式协议 | SSE / `text/event-stream` |
| 自带密钥覆盖 | BYOK |

---

## Preview vs Showcase

| 用词 | 本仓用法 |
|------|----------|
| **Preview** | 资产 Gallery / 多 demo 预览站 —— **本仓省略** |
| **Showcase** | 产品主链路实机相册 `showcase-*.png` —— **本仓主用** |
| **README 预览壳** | `preview-readme.html`（渲染 README 本身，不是产品站） |

---

## 禁止漂移

- 不要写 `docs/agents/language.md` / `docs/agents/context.md`
- 不要把「Qwen」说成默认对话模型（对话已切 DeepSeek；Qwen 主要服务 Embedding / 遗留路径）
- 不要把仓库说成「纯后端、无前端」（已有 `frontend/`）
