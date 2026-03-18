# Feasibility Study — Markdown Watchdog + Vector Archive + Routing

## Problem
Workspace is accumulating many markdown files created by the assistant, which then get forgotten. Need an automatic system to:
1) detect new/updated markdown files,
2) archive/index them in a vector DB,
3) route/summarize content into a more appropriate, existing markdown file (or delete/retire originals).

## Feasibility Summary (✅ feasible)
This is straightforward with a file‑watcher + indexing pipeline. Complexity is moderate; biggest design choice is **routing logic** (rules vs. LLM). Expect 1–2 days for a reliable MVP.

## Proposed Architecture
**A) File Watcher**
- Use `watchdog` (Python) or `chokidar` (Node) to monitor `workspace/**.md`.
- Trigger on create + modify (debounced).

**B) Indexer + Archive**
- Extract text, add metadata: path, created/modified time, tags.
- Embed content and upsert into vector DB (Qdrant already available: `http://192.168.1.223:6333`).
- Also store a JSONL audit log of ingested files.

**C) Router**
- **Rule‑based:** map folder prefixes to a canonical file (e.g., `projects/new-ashtabula-initiative/*` → `PROJECTS.md`, `memory/*` → daily log). Fast + predictable.
- **LLM‑assisted:** use embeddings + a short routing prompt to pick the best destination file and generate a summary paragraph.
- **Hybrid (recommended):** rules first; if no match, fallback to LLM.

**D) Consolidator**
- Append a short summary block to the destination file (or create a “digest” file).
- Optionally add a backlink to original file and mark original as archived.

## Routing Targets (examples)
- `projects/**/PROJECTS.md`
- `memory/YYYY-MM-DD.md`
- `MEMORY.md` (only for durable facts)
- `runbooks/*.md`
- `docs/*.md`

## Data Flow (MVP)
1. File created → watcher triggers
2. Parser extracts text + metadata
3. Embed + upsert into Qdrant
4. Router chooses target doc
5. Append summary + backlink
6. Mark original as archived (tag in header)

## Risks / Considerations
- **Noise:** too many auto‑summaries → mitigate by size thresholds + debounce.
- **Wrong routing:** add “review queue” file for manual approval.
- **Privacy:** avoid routing sensitive files externally; keep local only.

## MVP Scope
- Watch `workspace/` for new `.md`
- Index into Qdrant
- Route to 1–3 target files (rules only)
- Add summary block + backlink

## Phase 2
- LLM routing fallback
- Duplicate detection / clustering
- Auto‑archive (move to `archive/`)

## Next Questions
1) Which destination files should be canonical for routing?
2) Is LLM routing allowed (local model) or rules‑only?
3) Should originals be archived, deleted, or left in place with a banner?

---
If you want, I can turn this into a build plan + MVP script.
