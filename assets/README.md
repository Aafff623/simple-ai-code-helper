# assets · 媒体约定

本目录存放 README / 演示用媒体。**禁止**新建 `docs/images/`。

## 当前结构

```text
assets/
├── README.md                 # 本文件
└── images/
    └── readme/               # README 契约配图 + Showcase
        ├── banner.png
        ├── features.png
        ├── architecture.png
        ├── tech-stack.png
        ├── workflow.png
        ├── structure.png
        ├── preview-contact-sheet.png   # 历史 contact sheet（非 Preview 站壳）
        ├── showcase-*.png              # 产品主链路（有则引用）
        └── sources/svg/                # 可编辑 SVG 源
```

按需再建（有内容时）：`backup/` · `images/avatar/` · `images/icon/` · `video/` · `ppt/` · `speeches/`。  
**不要**用 `.gitkeep` 占空目录。

## 契约文件名

见 `docs/outputs/prd/readme-diagrams/readme-diagram-brief.md` 与 project-init / readme-polish。

## 本仓策略

- 六张说明图已齐，Phase B **不强制重生图**（视觉方向见 `VISUAL-DIRECTION.md`）。  
- 单产品应用：**省略 Preview Gallery**；以 **Showcase** 为主（`showcase-home/chat/settings.png` 已齐）。  
- `preview-contact-sheet.png` 保留作历史资产，不充当 `preview-shell.png`。  
- 2026-08-05 gap-review：缺图清单为空，未调用生图工具。
