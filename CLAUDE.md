# CLAUDE.md

> **Output Style**: `humanizer-output-style` — see `~/.claude/skills/humanizer-output-style/SKILL.md`  
> **项目语气**：`docs/agents/voice.md`  
> **Windows / Answer Format / AGENTS / commit-history**：见 `.cursor/rules/*.mdc`（与根 `AGENTS.md` 一致）

Guidance for agents working in this repository.

## 三层加载

1. 根 `AGENTS.md`（跨工具硬约束）  
2. 本文件（Claude 维护协议与 skills 挂载）  
3. `CONTEXT.md` + `LANGUAGES.md` + 当前 theme 的 PRD / handoff  

## Agent skills

### Issue tracker

Issues live as **local markdown** under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical triage vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — one `CONTEXT.md` plus `docs/adr/` at the repo root. Shared task vocabulary in `LANGUAGES.md`. See `docs/agents/domain.md`.

## 偏好归档

- 产品层：后端 `src/`，前端 `frontend/`  
- 文档产物：`docs/outputs/`（复数）  
- README 配图：`assets/images/readme/`  
- README 本地预览壳：根 `preview-readme.html`，端口 **8092**（`python -m http.server 8092`）  
- 单产品：**省略 Preview Gallery**；Showcase 为主  
- 不写 `docs/agents/language.md` / `context.md`  

## 维护协议

- 改领域事实 → 只改 `CONTEXT.md`  
- 改任务流用词 → 只改 `LANGUAGES.md`  
- 改 Agent 门禁 → `AGENTS.md` + 对应 `docs/agents/*`  
- MDC 规则只从用户级同步，不在项目内改语义  
