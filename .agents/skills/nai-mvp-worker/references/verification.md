# Verification Gate

Verify independently. Do not repair source unless the orchestrator creates a separate
implementation assignment.

## Required story

1. Build the assigned slug if local evidence is required.
2. Capture the assigned route with `./nai screenshots --slugs <slug>`.
3. Run `./nai analyze-screenshots --slugs <slug>`; use `--quality deep` only
   when the decision warrants the added model work.
4. Exercise the primary user workflow in a browser, including validation,
   success, and material error states.
5. Inspect console errors, failed network requests, layout, responsive behavior,
   factual accuracy, target branding, and template leakage.
6. For AI features, confirm the user action reaches the production/shared API,
   receives a successful provider response, and renders a usable result.
7. Use `--live` only after explicit production authorization.

## Evidence

Provide asset-specific screenshot, metadata, analysis, or verification-report
paths. A page screenshot alone does not prove an interactive feature. A direct
API call alone does not prove the browser integration. Record both sides for an
AI workflow.

Report low-priority polish separately from functional blockers. Do not mark the
gate passed; return the verdict and evidence to the orchestrator.
