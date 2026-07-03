# Markdown Watchdog — Requirements

## Functional
- Detect new/modified `.md` files in workspace.
- Index content into vector DB (Qdrant).
- Route summary into canonical markdown file.
- Record audit trail of actions.

## Non‑functional
- Low overhead (debounce file events).
- Deterministic routing (rules first).
- Safe by default (no deletion unless approved).

## Configurable
- Watch paths + ignore patterns
- Routing rules (path → destination)
- Summary length
- Archive behavior (tag/move/leave)

## Success Criteria
- New markdown file becomes searchable in Qdrant.
- Summary appended to correct canonical doc.
- Original file remains (or tagged) with backlink.
