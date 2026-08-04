# Workflow · 日常业务流

init 完成后的标准业务推进路径。PRD 未批准不写功能代码，一任务一 handoff，Review 先于 commit。

## 推进路径

```
Local Issue（.scratch/<feature>/）
  → docs/outputs/report/{theme}/        # 调研，可选
  → docs/outputs/prd/{theme}/prd.md     # PRD draft
  → approved                            # 用户批准
  → docs/outputs/handoff/{theme}/YYYY-MM-DD-{branch}-{task}.md
  → 实施 → awaiting-review【停】
  → 通过 → commit / docs/outputs/commit-history/{branch}/ / archive
```

## Bug 流（诊断与修复分离）

Bug 统一走 Issue（本地 `.scratch/` 或用户指定的 GitHub Issue），含根因、复现、修复方向、接手引导。诊断与修复用不同模型交叉验证。

- 复现脚本放 `scripts/repro-*.mjs`（可反复运行）
- Issue 编号或本地路径写入 commit body

详见 `project-init` skill §5.0 Bug Issue 管理范式。

## 目录映射

| 产物 | 位置 |
|------|------|
| 调研报告 | `docs/outputs/report/{theme}/` |
| PRD | `docs/outputs/prd/{theme}/` |
| 交接文档 | `docs/outputs/handoff/{theme}/`（覆盖式） |
| 架构决策 | `docs/adr/` |
| commit 攒批 | `docs/outputs/commit-history/{branch}/` |
| 归档 | `docs/outputs/commit-history/archive/`（已合并分支） |
