# Gemini MVP Generator — Key Troubleshooting

## Symptom
Cron job fails with: **API key not valid**.

## Checks
1. Confirm cron payload exports the correct key:
   - `VITE_GEMINI_API_KEY=...`
2. Confirm key works via manual test:
   ```bash
   export VITE_GEMINI_API_KEY=YOUR_KEY
   gemini -y "Say OK"
   ```
3. Ensure no older `.env` overrides in `projects/new-ashtabula-initiative/websites/*`.

## Fix
- Update cron payload with the working key and rerun.
- If still failing, rotate to a fresh key.

---

## Next Action (Suggested)
- I can run a manual `gemini -y "Say OK"` test with the current key to verify.

## Cron Environment Note
If Gemini CLI insists on API key auth, explicitly unset:
```
unset GEMINI_API_KEY VITE_GEMINI_API_KEY
```
Then run gemini normally (browser login).

## Cron Patch Suggestion
Modify the cron command to start with:
```
unset GEMINI_API_KEY VITE_GEMINI_API_KEY
```
so Gemini CLI uses browser login auth.
