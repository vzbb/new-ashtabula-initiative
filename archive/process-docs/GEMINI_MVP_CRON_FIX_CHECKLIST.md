# Gemini MVP Generator — Cron Fix Checklist

Goal: force Gemini CLI auth (no API keys) for cron runs.

## Checklist
- [x] Update cron payload to `unset GEMINI_API_KEY VITE_GEMINI_API_KEY`
- [ ] Confirm cron run succeeds without API key error
- [ ] If still failing: ensure cron shell respects `unset` (wrap in `bash -lc`)
- [ ] Optionally: prepend `GEMINI_CLI_SKIP_UPDATE=1` if update prompt blocks

## Notes
- Cron currently still reports `API key not valid`.
- Next action: adjust payload to run via `bash -lc` if needed.
