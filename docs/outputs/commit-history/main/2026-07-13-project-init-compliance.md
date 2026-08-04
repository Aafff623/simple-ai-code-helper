# Commit 攒批 · 2026-07-13~14 project-init 规范落地

## 范围

`481f31e` .. `d8768a6`（5 个 commit）

| commit | 日期 | 说明 |
|--------|------|------|
| `481f31e` | 07-13 | chore(assets): 规范化 agent 协作资产骨架 |
| `e6f2299` | 07-14 | docs(prd): 前端界面需求与 README 配图 prompts |
| `5f9462e` | 07-14 | docs(readme): 嵌入配图重构 README 版面 |
| `9ab6dc6` | 07-14 | docs(project-init): 补齐 voice.md · README brief · 产品预览章节 |
| `d8768a6` | 07-14 | docs(rag): 清理 Java 基础面试题知识库文档格式 |

## 背景

对齐 `project-init` skill 规范，分三个动作完成：

1. **资产骨架**（`481f31e`）：搭建 `docs/agents/`、`docs/adr/`、`docs/outputs/{report,prd,handoff}/`、`assets/{backup,images,video,theme}/` 标准目录树
2. **前端 PRD + README Polish**（`e6f2299` → `5f9462e`）：产出前端界面需求 PRD（draft，未批准，未进入实施）；完成 README 配图 Phase B 全流程（方向稿 → image-prompts → 六张图落盘 → README 组装）
3. **验收补齐**（`9ab6dc6`）：通读规范验收清单后补齐三处缺口——`docs/agents/voice.md` 独立落地、`readme-diagram-brief.md` 补录契约层文档、确认 README「产品预览」章节已显式说明 Preview/Showcase 不适用的原因
4. **知识库清理**（`d8768a6`）：与 project-init 无关的独立改动，顺带清理 Java 面试题文档的格式问题（推广文字、全角符号、乱码字符）

## 已知偏差

- `docs/outputs/prd/readme-diagrams/VISUAL-DIRECTION.md` 与规范要求的 `readme-diagram-brief.md` 存在命名/产出顺序上的历史漂移：`VISUAL-DIRECTION.md` 是先产出的方向稿，`readme-diagram-brief.md` 是本批次补录的规范契约层文档，两者内容协调一致，非冲突。

## 影响

- 无业务逻辑变更
- `frontend-ui-requirements.md` 仍处 draft，Gate 未开，业务功能代码尚未开始
