# Markdown Watchdog — Existing RSI Tools We Can Leverage

## Available Now
- **HistorySearch** (`scb history search <query>`): find orphan notes fast.
- **SessionDiff** (`scb diff session <a> <b>`): see what new markdown appeared.
- **WorkspaceSnapshot**: baseline state for comparisons.
- **BlockerManager** (`scb blocker add/list/resolve`): track cleanup tasks.

## How They Help
- Use HistorySearch to locate relevant canonical docs.
- Use SessionDiff to detect new files created by automation.
- Use WorkspaceSnapshot to measure markdown growth over time.
- Use BlockerManager to keep cleanup tasks from getting lost.

## Next Step
Integrate these into the watchdog MVP (rules‑based routing + Qdrant index).
