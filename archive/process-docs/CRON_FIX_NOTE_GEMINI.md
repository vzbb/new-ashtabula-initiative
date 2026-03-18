# Gemini MVP Generator — Cron Fix

If the cron job still tries to use API keys, add this to the top of the command (or before running gemini):

```
unset GEMINI_API_KEY VITE_GEMINI_API_KEY
```

This forces Gemini CLI to use browser login auth instead of API key auth.

## Latest Status
- 2026-03-04: `gemini-mvp-generator` still failing with **"API key not valid"**.
- Action: ensure cron payload unsets `GEMINI_API_KEY` + `VITE_GEMINI_API_KEY` before running gemini.

---
