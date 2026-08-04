# AGENTS.md

> **Output Style**: `humanizer-output-style` skill — 统一语气风格与去 AI 味配置。加载路径：`skills/humanizer-output-style/SKILL.md`  
> **项目语气覆盖**：`docs/agents/voice.md`（含回答格式，链到 `.cursor/rules/answer-format.mdc`）  
> **Windows Rules**：`.cursor/rules/windows-path-discipline.mdc` · `windows-shell-discipline.mdc`  
> **Answer Format / 白话 Mermaid**：`.cursor/rules/answer-format.mdc`  
> **Global Agent 镜像**：`.cursor/rules/AGENTS.mdc`  
> **commit-history**：`.cursor/rules/commit-history.mdc`

所有 AI agent 进入本仓库的统一入口。Claude Code 专属约定见 `CLAUDE.md`。

## 关键资源（单一事实源）

| 事实 | 入口 |
|------|------|
| 领域术语与硬约束 | `CONTEXT.md` |
| 共享用词 | `LANGUAGES.md` |
| 人读摘要与运行 | `README.md` |
| Agent 协作细则 | `docs/agents/`（仅 workflow / deliver / archive / domain / issue-tracker / triage-labels / voice） |
| 架构决策 | `docs/adr/` |
| 任务产物 | `docs/outputs/{report,prd,handoff,commit-history}/` |
| 媒体 | `assets/`（见 `assets/README.md`） |

**禁止**维护 `docs/agents/language.md` / `docs/agents/context.md`。

## Agent skills

### Issue tracker

本地 Markdown：`.scratch/<feature>/`。见 `docs/agents/issue-tracker.md`。

### Triage labels

`needs-triage` · `needs-info` · `ready-for-agent` · `ready-for-human` · `wontfix`。见 `docs/agents/triage-labels.md`。

### Domain docs

单上下文：根 `CONTEXT.md` + `docs/adr/`。见 `docs/agents/domain.md`。

## 工作流门禁

日常路径见 `docs/agents/workflow.md` · `deliver.md` · `archive.md`。

硬约束：

1. **PRD 未批准不写业务功能代码**  
2. handoff **覆盖式**更新（旧文件直接删除）  
3. Review 通过后再 commit；攒批写入 `docs/outputs/commit-history/{branch}/`  
4. 真实密钥只放 `application-local.yml`（已 gitignore）  
5. 路径写相对仓库根；不要把本机绝对路径当作唯一说明  

## 安全约定

- 勿提交 `application-local.yml`、真实 API Key、`.env`  
- 勿把密钥写进 README / PRD / handoff  
- 爬虫与 MCP 工具遵守目标站与服务条款；勿在文档中鼓励滥用  

## 项目规则资产

本仓已落盘 Cursor MDC（`alwaysApply: true`）：

- `.cursor/rules/windows-path-discipline.mdc`
- `.cursor/rules/windows-shell-discipline.mdc`
- `.cursor/rules/answer-format.mdc`
- `.cursor/rules/AGENTS.mdc`
- `.cursor/rules/commit-history.mdc`

语义以用户级 `%USERPROFILE%\.cursor\rules\` 为真相源；项目内只同步、不手改语义。
