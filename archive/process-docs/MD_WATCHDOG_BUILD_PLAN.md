# Build Plan — Markdown Watchdog + Vector Archive + Routing (MVP)

## Objective
Automatically catch new/updated `.md` files, index in vector DB, and route summaries into canonical docs to reduce markdown sprawl.

## MVP Scope (1–2 days)
1) Watch `workspace/**.md` for create/modify (debounced).
2) Extract text + metadata (path, created/modified, size, project).
3) Embed + upsert into Qdrant.
4) Rule‑based routing to canonical files.
5) Append short summary block + backlink to original.
6) Log all actions to JSONL.

## Components
### A) Watcher
- Python `watchdog` or Node `chokidar`.
- Ignore: `.git/`, `node_modules/`, `.venv/`, `dist/`, `build/`.

### B) Indexer
- Embed via local model or API (configurable).
- Upsert to Qdrant collection `workspace_md` with metadata.

### C) Router (rules‑first)
- `projects/<name>/*` → `projects/<name>/PROJECTS.md`
- `memory/YYYY-MM-DD.md` → keep in daily log
- `runbooks/*` → `runbooks/INDEX.md`
- fallback → `docs/INBOX.md`

### D) Summarizer
- 3–6 bullet summary + source link.
- Include file path + timestamp.

## Config (YAML)
- Watch paths, ignore patterns
- Router rules
- Summary length
- Qdrant URL

## Outputs
- `logs/md_watchdog.jsonl` (audit)
- `docs/INBOX.md` (fallback summary target)

## Next Decisions
1) Preferred embedding model (local vs API)
2) Canonical routing targets list
3) Archive behavior (move vs tag)

If approved, I can implement the MVP script.
