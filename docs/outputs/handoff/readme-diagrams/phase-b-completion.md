## 任务

完成 README 配图 Phase B 全流程并补齐 project-init 规范验收缺口。关联 theme：`readme-diagrams`。

## 上下文

- PRD/方向稿：`docs/outputs/prd/readme-diagrams/VISUAL-DIRECTION.md`（视觉方向：Dark Editorial Computational Atlas）
- 执行层：`docs/outputs/prd/readme-diagrams/readme-image-prompts.md`（六张图的 GPT image-to-image prompt）
- 契约层（本次补录）：`docs/outputs/prd/readme-diagrams/readme-diagram-brief.md`
- 目标：为纯后端项目的 README 生成六张统一视觉语言的配图，替代常见的"深色卡片 + 机械连线"模板

## 变更

1. 六张图（banner / features / architecture / tech-stack / workflow / structure）已生成并落盘 `assets/images/readme/`
2. README.md 组装：页首 banner、各章节内嵌对应配图、新增「产品预览」章节说明当前无前端 Preview/Showcase
3. 补录 `readme-diagram-brief.md`：规范要求 brief 先于 image-prompts 产出，本次事后补齐，标注为补录并与已有产物对齐，未重新设计
4. 落地 `docs/agents/voice.md`：将 AGENTS.md/CLAUDE.md 中的 humanizer-output-style 引用固化为独立文件

## 验证

- 六张图确认已存在 `assets/images/readme/` 且文件名符合命名契约（`ls` 确认）
- README.md 渲染检查：图片引用路径正确，章节顺序符合 brief 中的章节地图
- 对照 `project-init` skill 验收清单逐项复核，Phase A 全绿，Phase B 缺口（brief 文档、voice.md）已补齐

## 接手引导

- 无后续代码改动待办；此 theme 视为完成
- 若后续更换视觉方向，需同步更新 `VISUAL-DIRECTION.md` 与 `readme-diagram-brief.md` 两份文档，避免再次产生漂移
- Preview/Showcase（`preview-shell.png`/`showcase-*.png`）留待 `frontend-ui-requirements.md` PRD 批准并实施后补充，当前不适用
