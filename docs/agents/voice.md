# Voice · 输出语气与回答格式

本项目 Agent 输出（PR 描述、commit 说明、issue、文档正文）统一引用 `humanizer-output-style` skill，并叠加本文件的项目级约定。

全局 skill：`skills/humanizer-output-style/SKILL.md`（或 `~/.claude/skills/humanizer-output-style/SKILL.md`）。

## 落地位置

- `AGENTS.md` 顶部引用  
- `CLAUDE.md` 顶部引用  

两处只声明引用，不重复展开规则本体。

## 回答格式（Dual-Track）

与项目规则 `.cursor/rules/answer-format.mdc` 对齐（`alwaysApply: true`）：

1. 对用户：中文、直接、可扫读；长文先给结论。  
2. 结构说明需要图时：优先 **白话 Mermaid**（节点用日常中文，少堆类名）。  
3. 代码注释：本仓约定中文注释（与用户规则一致）。  
4. 勿把本机绝对路径当作文档唯一说明。

完整条款以 `answer-format.mdc` 与用户级 `%USERPROFILE%\.cursor\AGENTS.md` §16 为准。

## 适用范围

- README、CONTEXT、LANGUAGES、PRD、handoff、Issue  
- GitHub / 本地 Issue 与 PR 描述  
- commit message 的自然语言部分  

不适用：遵循语言规范的代码本体；结构化配置文件。

## 本仓语气补充

- 产品是「面试助手 / LangChain4j 示例」，说明时区分**教学示例**与**生产级**承诺。  
- 谈模型时写清 DeepSeek（对话）vs Qwen Embedding，避免含糊说「Qwen 项目」。  
- 少用空泛形容词；用可核对路径与命令。
