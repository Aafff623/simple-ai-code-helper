# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root（领域术语与技术事实）
- **`LANGUAGES.md`** at the repo root（共享任务流用词）
- **`docs/adr/`** — ADRs that touch the area you're about to work in

If a listed optional file doesn't exist, **proceed silently** for producer skills that create them lazily. For this repo, `CONTEXT.md` and `LANGUAGES.md` are required entry points after project-init.

## File structure

Single-context repo:

```
/
├── CONTEXT.md
├── LANGUAGES.md
├── docs/adr/
└── src/          # backend
frontend/         # Vite UI shell
```

## Use the glossary's vocabulary

When your output names a domain concept, use the term as defined in `CONTEXT.md`. Task-flow words use `LANGUAGES.md`. UI chrome words may use `docs/glossary/frontend-ui.md`.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding.
