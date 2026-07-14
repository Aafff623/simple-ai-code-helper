# Commit 攒批 · 2026-06-29 文档基线

## 范围

`b4638e9` .. `f9932e6`（3 个 commit）

| commit | 说明 |
|--------|------|
| `b4638e9` | fix: 修复 RAG 文档文件名括号不闭合 |
| `c9cdabe` | docs: 新增 README 与 CONTEXT 项目文档 |
| `f9932e6` | chore: 加固密钥配置并补全缺失的 bigmodel.api-key |

## 背景

项目早期功能开发（chat/memory/rag/mcp/guardrail/sse 等能力）完成后，首次补齐项目级文档基线：README 说明整体能力与快速开始，CONTEXT.md 建立领域术语表。同批修复了 RAG 知识库文件名的括号转义问题，并加固密钥配置，避免占位符缺失导致启动失败。

## 影响

- 无业务逻辑变更，纯文档 + 配置加固
- 为后续 project-init 资产骨架搭建打下基础
