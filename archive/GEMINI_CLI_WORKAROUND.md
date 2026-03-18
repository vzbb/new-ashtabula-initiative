# Gemini CLI — Update Prompt Workaround

## Problem
Gemini CLI auto‑update prompts are interrupting runs and cancelling requests.

## Workarounds
- Rerun after manual update:
  ```bash
  npm i -g @google/gemini-cli@0.32.1
  ```
- If prompts persist, run with smaller prompts and retry.

## Notes
- Multiple runs ended with SIGKILL or were cancelled by the update prompt.
