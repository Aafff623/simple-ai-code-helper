# ADR-0000 · 采用 Architecture Decision Records

## Status

Accepted · 2026-08-04

## Context

本仓已有 Spring Boot + LangChain4j 后端与 Vite 前端，并经历多轮文档/资产规范演进（`docs/output` → `docs/outputs`、媒体进 `assets/` 等）。需要固定「重要架构取舍写在哪里、怎么命名、如何处理冲突」，避免只在聊天或 README 里口头约定。

## Decision

1. 采用 ADR：重要架构权衡写入 `docs/adr/000N-kebab-title.md`。  
2. 本文件（0000）声明制度本身；后续从 0001 起记具体决策。  
3. 新决策与既有 ADR 冲突时，在新 ADR 中显式写 `Contradicts ADR-000N`，禁止默默覆盖。  
4. 领域术语仍以根 `CONTEXT.md` 为单一事实源；ADR 记**权衡与后果**，不复制术语表。

## Consequences

- Agent / 人类改架构前先扫 `docs/adr/`。  
- 小修小补不必写 ADR；跨模块选型、依赖引入/移除、双路径（如 DeepSeek vs 遗留 Qwen Chat）取舍应落 ADR。  
- `docs/adr/README.md` 作为目录说明，与 0000 互补。
