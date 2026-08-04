# ADR · 架构决策记录

记录项目中重要的架构权衡与决策。每条 ADR 说明背景、决策、权衡与后果。

## 命名

`000N-kebab-title.md`，序号从 0000（制度）/ 0001（具体决策）递增。

## 索引

| ADR | 标题 | Status |
|-----|------|--------|
| [0000](./0000-record-architecture-decisions.md) | 采用 Architecture Decision Records | Accepted |

## 何时写 ADR

- 做出影响多个模块的架构选择时
- 在多个可行方案间取舍时
- 决定引入或移除重要依赖时

## 冲突处理

新决策与既有 ADR 矛盾时，在新 ADR 中显式指出冲突（"Contradicts ADR-000N"），不要默默覆盖旧决策。
