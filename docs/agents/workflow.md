# Workflow · 日常业务流

init 完成后的标准业务推进路径。PRD 未批准不写功能代码，一任务一 handoff，Review 先于 commit。

## 推进路径

```
GitHub Issue
  → docs/output/report/{theme}/        # 调研，可选
  → docs/output/prd/{theme}/prd.md     # PRD draft
  → approved                           # 用户批准
  → docs/output/handoff/{theme}/{task}.md
  → 实施 → awaiting-review【停】
  → 通过 → commit / commit-history / archive
```

## Bug 流（诊断与修复分离）

Bug 统一走 GitHub Issue，含根因、复现、修复方向、接手引导。诊断与修复用不同模型交叉验证，避免同模型既诊断又修。

- 复现脚本放 `scripts/repro-*.mjs`，可反复运行
- Issue 编号写入 commit body（`Closes #N`）

详见 `project-init` skill 的 Bug Issue 管理范式。

## 目录映射

| 产物 | 位置 |
|------|------|
| 调研报告 | `docs/output/report/{theme}/` |
| PRD | `docs/output/prd/{theme}/` |
| 交接文档 | `docs/output/handoff/{theme}/` |
| 架构决策 | `docs/adr/` |
| commit 攒批 | `docs/commit-history/` |
| 归档 | `docs/output/` 下按主题归档 |
