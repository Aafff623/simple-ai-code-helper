# Archive · 归档

完成的任务与决策的归档约定，保留决策链，避免根目录膨胀。

## 归档时机

任务通过 Review 并 commit 后归档。

## 归档内容

| 类型 | 归档位置 |
|------|----------|
| 架构决策 | `docs/adr/000N-kebab-title.md`（永久保留，不删） |
| 已完成 theme 的 PRD / handoff / report | 留在 `docs/output/{prd,handoff,report}/{theme}/`，标记完成状态 |
| commit 攒批记录 | `docs/commit-history/` |

## ADR 约定

- 文件名 `000N-kebab-title.md`，序号递增
- 记录背景、决策、权衡、后果
- 与既有 ADR 冲突时显式指出，不默默覆盖

## 不归档

- 临时调研草稿、被否决的方案：删除或留在 report 目录标注 `discarded`
- 密钥、个人配置：不入库
