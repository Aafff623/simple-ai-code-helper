# handoff · readme-diagrams / project-init 收口

**分支**：`chore/maintain-assets`  
**状态**：awaiting-review → 本轮查缺补齐后可 ship  
**日期**：2026-08-05（覆盖式更新；取代「纯后端 / Showcase 待补」旧叙述）

## 任务

对照 `project-init` Full 验收清单做细致 Review，收口文档漂移；不改业务代码、不提交密钥。

## 上下文

- 调研：`docs/outputs/report/project-init/2026-08-04-five-dimension-research.md`
- 本轮复核：`docs/outputs/report/project-init/2026-08-05-gap-review.md`
- Canvas：`canvases/simple-ai-code-helper-analysis.canvas.tsx`
- 视觉：`docs/outputs/prd/readme-diagrams/`（brief · prompts · VISUAL-DIRECTION）
- 事实源：根 `CONTEXT.md` · `LANGUAGES.md` · `AGENTS.md`

## 当前真相（勿再写反）

| 项 | 事实 |
|----|------|
| 产品形态 | 后端 `src/` + 前端 `frontend/`（Vite），**不是**纯后端 |
| 默认对话 | DeepSeek；Qwen / DashScope 主要服务 Embedding |
| Preview 站 | **省略**（单产品、无 Gallery） |
| Showcase | **已齐**：`showcase-home/chat/settings.png` |
| README 壳 | `preview-readme.*` · 端口 **8092** |
| 六张说明图 | 已齐，本轮**不重生** |
| 密钥 | `application-local.yml` 仅本机；已 gitignore，勿提交 |

## 本轮变更

1. 修正 `readme-diagram-brief.md` 验收项（去掉「无前端 / Showcase 不适用」误判）  
2. 覆盖本 handoff，对齐 Full 迁移后现状  
3. README 路线图：Showcase 三连标为已完成  
4. Canvas：去掉「README 仍写纯后端」过时告警，改为文档已同步  
5. 产出 gap-review 报告  

## 验证

- [x] Phase A：五份 MDC 与用户级一致；根入口 / agents / adr / assets / voice 齐全  
- [x] 无 `docs/agents/language.md` · `context.md`；无空 `.gitkeep` 媒体槽  
- [x] `application-local.yml` 未 tracked  
- [x] 契约图齐全；缺图清单为空 → **不调用** MiniMax / GenerateImage  
- [x] Preview 省略理由 + Showcase 实图 + README 壳端口一致  

## 接手引导

- 业务功能须走 `Issue → PRD → handoff`；本分支仅资产维护  
- Canvas 中 P0/P1（memoryId 类型、BYOK SSRF、CORS 等）属代码债，**不在**本 init 收口范围  
- 若更换视觉方向：同步 `VISUAL-DIRECTION.md` + brief + prompts，再决定是否重生说明图  
