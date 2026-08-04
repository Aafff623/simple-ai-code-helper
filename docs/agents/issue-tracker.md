# Issue tracker: Local Markdown

Issues and PRDs for this repo live as **local markdown** under `.scratch/<feature>/`（不默认走 GitHub Issues，除非任务明确要求 `gh`）。

## Conventions

- **Create an issue**：在 `.scratch/<feature>/` 新建 `YYYY-MM-DD-<slug>.md`（或主题内 `ISSUE.md`）。
- **Read an issue**：直接打开对应 markdown。
- **List issues**：浏览 `.scratch/` 下未归档文件；可用文件名 / frontmatter 状态字段过滤。
- **Comment**：在同一文件追加 `## Updates` 时间戳段落。
- **Labels**：在文件 frontmatter 或首节写 canonical triage 标签（见 `triage-labels.md`）。
- **Close**：将状态改为 `closed` / `wontfix`，或移入 `.scratch/archive/`。

## When a skill says "publish to the issue tracker"

在 `.scratch/<feature>/` 创建或更新 markdown Issue。

## When a skill says "fetch the relevant ticket"

读取 `.scratch/` 中对应 feature 的 Issue 文件（含后续 Updates）。

## 与 GitHub

远端仓库可并存 GitHub Issues；**Agent 默认写本地 `.scratch/`**，避免未授权 `gh` 操作。用户明确要求时再用 `gh issue`。
