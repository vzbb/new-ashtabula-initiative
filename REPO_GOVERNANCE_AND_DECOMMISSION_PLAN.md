# Repo Governance and Decommission Plan

This document is the active plan for preventing repeat deploy drift, keeping agents aligned, and removing MVPs that are no longer worth maintaining.

## Why This Exists

This repo already had multiple layers of helper scripts, generated outputs, and agent-written notes. That made it easy for agents to work from stale assumptions.

The goal now is:

- one source of truth for routes
- one source of truth for workflow
- one source of truth for live verification
- a clear retirement process for MVPs that should no longer stay active

## Current Canonical Files

- `README.md` = project overview and human-facing entrypoint
- `AGENTS.md` = project-specific rules for all agents working in this repo
- `MONOREPO_PROTOCOL.md` = short, fast-scan workflow rules
- `SITEMAP.md` = live route source of truth
- `vercel.json` = generated route target map
- `nai` = primary workflow entrypoint
- `siteflow.py` = shared build / route / verification helpers
- `screenshots_sitemap.py` = screenshot capture and live browser verification
- `analyze_sitemap_screenshots.py` = visual QA analysis tool
- `coordination.md` = my working planning/response file
- `coordination2.md` = live Kimi-agent input/status stream

## Retirement List

The following MVPs are marked for removal from the active portfolio:

- `59` `Pocket Historian Pro` (`/historian-pro/`)
- `61` `Pocket Sommelier Pro` (`/sommelier-pro/`)

### Retirement Standard

For each retired MVP:

1. Remove it from the active route list in `SITEMAP.md`.
2. Remove it from `vercel.json` generation and live routing.
3. Remove it from the active README stats, architecture map, and featured site lists.
4. Archive the source folder or remove it from the active `websites/` tree.
5. Remove/adjust screenshots, audits, and generated references that point to it.
6. If you choose to touch any external task tracker at all, use it only as a human-facing note. Do not rely on it for canonical state.

## Future Agent Rules

### When editing a single MVP

- touch only that site folder unless the bug is shared
- check `SITEMAP.md` first
- verify local build output before deploying
- verify the live URL before closing the task

### When editing shared infrastructure

- change `siteflow.py`, `update_vercel.py`, `nai`, or `screenshots_sitemap.py`
- update docs in the same change if the workflow changed
- re-run route and visual verification after the edit

### When removing an MVP

- do not leave the route half-removed
- do not leave stale docs saying the MVP is still active
- do not leave any external task tracker in an ambiguous “maybe later” state
- remove the route, the source reference, and the task reference together

## Tooling Guardrails

- `./nai scan` should fail loudly when route/build assumptions drift
- `./nai routes` should regenerate the route map from current truth
- `./nai screenshots --live` should be the standard visual truth check
- `./nai analyze-screenshots` should turn screenshots into machine-readable QA output
- legacy helper scripts should be treated as archival unless they are wired into `nai`

## Acceptance Criteria

A cleanup cycle is complete when:

- docs and route maps match the live deploy
- retired MVPs are removed from active docs and routing
- active MVPs render correctly in screenshots and live browser checks
- the repo reflects the same truth in its own canonical files
- no helper file contradicts the canonical workflow
