# 五维调研报告 · project-init Full（老项目）

**仓库**：`simple-ai-code-helper`  
**日期**：2026-08-04  
**模式**：Full · 非轻量化完整资产  
**策略判定**：**迁移（migrate）** —— 已有 Agent/docs/assets 骨架，但路径与事实落后于最新规范，且 README/CONTEXT 与代码漂移。

按全局默认：本地 `.scratch/` Issue · 五种 triage · 单 `CONTEXT.md` · 同步五份 MDC。

---

## Agent 1 · 项目结构

| 区域 | 路径 | 说明 |
|------|------|------|
| 后端入口 | `src/main/java/.../AiCodeHelperApplication.java` | Spring Boot |
| AI 包 | `.../ai/` | Controller · 工厂 · RAG · MCP · Tool · Guardrail · DeepSeek/Qwen 配置 |
| 知识库 | `src/main/resources/docs/*.md` | 3 份 RAG 语料 |
| 前端 | `frontend/` | Vite · `index.html` / `app.js` / `styles.css` |
| 分析 Canvas | `canvases/simple-ai-code-helper-analysis.canvas.tsx` | 只读架构评审 |
| 文档 | `docs/` | agents / adr / outputs（本轮迁自 output） |
| 媒体 | `assets/images/readme/` | 六张契约图 + SVG 源 |

产品层根：**后端 `src/` + 前端 `frontend/`**（非单 `src/` SPA）。

---

## Agent 2 · 技术栈

- JDK 21 · Spring Boot 3.5.13 · Maven Wrapper  
- LangChain4j 1.1.0 / beta7（reactor · mcp · dashscope · open-ai）  
- **对话默认 DeepSeek**（`deepseek-v4-flash`）；**Embedding = DashScope Qwen**  
- 前端 Vite ^6.3.5，原生 JS，端口 5173；后端 8080  
- Jsoup Tool · 智谱 MCP web_search  

---

## Agent 3 · 资产现状

| 资产 | 调研前 | 缺口 |
|------|--------|------|
| `.cursor/rules` 五份 MDC | 无 | 需同步 |
| `LANGUAGES.md` | 无 | 需新建 |
| `docs/output`（单数） | 有 | → `docs/outputs` |
| `docs/commit-history` | 扁平 | → `outputs/commit-history/{branch}/` |
| `assets/theme/{ppt,script}` | 空壳 gitkeep | → 按需 `ppt`/`speeches`，删空壳 |
| 六张 README 图 | **已齐** | Phase B 可跳过重生图 |
| `showcase-*.png` | 无 | Showcase 占位或实机截 |
| Preview 站 | 不适用 | 单产品声明省略 |
| `preview-readme.*` | 无 | 需补 |
| ADR-0000 | 无 | 需补 |
| CONTEXT / README | 过时（仍写纯后端 + Qwen 对话） | 需按代码重填 |

---

## Agent 4 · 业务领域

- 定位：编程面试 / 求职学习助手（教学向完整示例）  
- 主链路：前端 → `GET /ai/chat` SSE → Guardrail → Memory → RAG → Tools/MCP → StreamingChatModel  
- BYOK：Header 覆盖模型；动态工厂缓存  
- 术语见更新后 `CONTEXT.md`  

---

## Agent 5 · 规范差距

1. 路径：`docs/output` · 旧 commit-history · theme 媒体槽 → 迁到最新树  
2. 缺根 `LANGUAGES.md`、五份 MDC、ADR-0000、assets/README、README 预览壳  
3. issue-tracker 曾写 GitHub；按 §2.2 默认改为本地 `.scratch/`  
4. 事实漂移：README「纯后端 / Qwen 对话」↔ 实有 frontend + DeepSeek  
5. 禁止件：无 `language.md`/`context.md`（保持）  
6. 空 `.gitkeep` 占位过多 → 清理  

---

## 策略结论

| 选项 | 是否 | 理由 |
|------|------|------|
| 增量 | 否 | 缺口含路径迁移与事实重写，非小补 |
| **迁移** | **是** | 保留可用配图、agents 文、知识库与代码；改路径与入口 |
| 重建 | 否 | 已有可复用资产，不必推倒 |

**轻量化判定**：**否**（用户授权非轻量化完整资产；补齐根入口、outputs、voice、ADR、README 壳、Showcase 槽位）。
