# AGENTS.md

> **Output Style**: 统一引用 `humanizer-output-style` skill，定义输出语气与去 AI 味规则。详见 `skills/humanizer-output-style/SKILL.md`。

所有 AI agent 进入本仓库的统一入口。Claude Code 专属约定见 `CLAUDE.md`。

## 关键资源

- 领域术语表：`CONTEXT.md`（单上下文，术语以此为准，不要漂移到同义词）
- 项目说明：`README.md`
- Agent 协作约定：`CLAUDE.md` 与 `docs/agents/`
- 架构决策：`docs/adr/`

## 工作流

日常业务流、交付、归档约定见 `docs/agents/` 下的 `workflow.md`、`deliver.md`、`archive.md`。PRD 未批准前不写业务功能代码。

## 安全约定

真实密钥一律放入 `application-local.yml`（已被 `.gitignore` 忽略），`application.yml` 仅保留占位符。不要把密钥写进任何提交的文件。
