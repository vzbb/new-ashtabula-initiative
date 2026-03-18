# Markdown Watchdog — Decisions Log

## Decisions
- **Rules‑first routing** with optional LLM fallback (to reduce misroutes).
- **No deletion** by default; use tagging or move to archive only with approval.
- **Qdrant** as vector index (already available at 192.168.1.223:6333).

## Open Questions
- Final canonical destination files list.
- Preferred embedding model (local vs API).
- Archive behavior: tag vs move.
