# Voice · 输出语气

本项目所有 Agent 输出（PR 描述、commit 说明、issue 撰写、文档正文）统一引用 `humanizer-output-style` skill，定义语气与去 AI 味规则。

详见 `skills/humanizer-output-style/SKILL.md`。

## 落地位置

- `AGENTS.md` 顶部
- `CLAUDE.md` 顶部

两处均以引用行声明，不重复展开规则本体，避免多处维护同一套语气规范导致漂移。

## 适用范围

- README、CONTEXT.md 等面向人类读者的文档正文
- GitHub Issue / PR 描述
- commit message 的自然语言部分

不适用于：代码注释（遵循 `java-coding-standards`）、结构化配置文件。
