# project-init 细致 Review · 查缺补齐

**仓库**：`simple-ai-code-helper`  
**分支**：`chore/maintain-assets`  
**日期**：2026-08-05  
**对照**：`%USERPROFILE%\.agents\skills\project-init\SKILL.md`  
**参考**：`canvases/simple-ai-code-helper-analysis.canvas.tsx`

按全局默认：本地 `.scratch/` Issue · 五种 triage · 单 `CONTEXT.md` · 五份 MDC 已同步。

---

## Phase A 清单

| 项 | 状态 | 说明 |
|----|:----:|------|
| 五份 `.cursor/rules/*.mdc` 与用户级一致 | ✅ | hash 比对 identical |
| 根 `AGENTS` / `CLAUDE` / `CONTEXT` / `LANGUAGES` | ✅ | humanizer + Windows + answer-format 已引用 |
| `docs/agents` 无 language/context | ✅ | 仅有 workflow/deliver/archive/domain/issue-tracker/triage-labels/voice |
| ADR-0000 · knowledge · glossary | ✅ | |
| `docs/outputs/{report,prd,handoff,commit-history}` | ✅ | 有产物才建，无空壳凑齐 |
| `assets/README.md` + `images/readme/` | ✅ | 无空 `.gitkeep`；无 `docs/images/` |
| Full 五维调研填充 CONTEXT | ✅ | `2026-08-04-five-dimension-research.md` |
| 密钥未入库 | ✅ | `application-local.yml` 本机存在且 **未 tracked** |

## Phase B 清单

| 项 | 状态 | 说明 |
|----|:----:|------|
| 六张说明图契约文件名 | ✅ | banner…structure；**本轮不重生** |
| Showcase 三连 | ✅ | home / chat / settings 已引用 |
| Preview 站 | ✅ 省略 | 单产品声明；`preview-contact-sheet` ≠ `preview-shell` |
| README 预览壳 8092 | ✅ | `preview-readme.{html,css,js}` |
| brief / prompts / VISUAL-DIRECTION | ✅ | brief 验收项本轮纠偏 |
| 目录树 / Key docs 无 `<details>` | ✅ | |
| 快速开始可跑 | ✅ | mvnw + frontend Vite |

## 本轮发现的漂移（已修）

1. `readme-diagram-brief.md` 仍写「无前端 / Showcase 不适用」→ 已改为 Preview 省略 + Showcase 已齐  
2. `handoff/.../phase-b-completion.md` 仍写「纯后端」「Showcase 留待 PRD」→ 覆盖式重写  
3. README 路线图未勾选已完成的 Showcase / init → 已勾选  
4. Canvas 仍告警「README 纯后端漂移」→ 改为「文档已同步」；P2 风险改为「历史已修」  

## 缺图判定

| 契约文件 | 存在 | 动作 |
|----------|:----:|------|
| banner / features / architecture / tech-stack / workflow / structure | ✅ | 跳过生图 |
| showcase-home / chat / settings | ✅ | 跳过生图 |
| preview-shell.png | — | 本仓省略 Preview Gallery，**不生成** |

→ **MiniMax / GenerateImage：未调用**（无缺口图）。

## 明确不做

- 不提交 `application-local.yml` / 真实 API Key  
- 不改业务代码（memoryId / SSRF / CORS 等 Canvas P0/P1 留业务 theme）  
- 不预建空 `ppt/` / `avatar/` / `CONTEXT-MAP.md`  

## Gate

Init 资产与 README Polish **可进入 Gate Review**；首个业务 theme 须另开 PRD。
