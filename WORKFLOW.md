# NAI Site Recovery Summary

## Overview

The live NAI websites had two separate problems:

1. The deploy workflow was pointing at stale or wrong build outputs.
2. The local automation was crawling the wrong directories and trying to treat dependency folders as apps.

That combination made the live site fall back to the wrong HTML shell or serve pages that looked blank because the wrong bundle was being published.

The good news: the sites are back now, and the production deployment is serving built assets again.

## Current Focus

The repo is now post-recovery and post-sprint.

Immediate focus:
- deploy the materially improved MVP batch
- verify the live routes
- reconcile canonical documentation drift
- keep the Saybrook request lane documented and easy to restart

Current scan truth:
- `SITEMAP.json` defines 75 public routes
- 75 are currently source-backed
- retired routes should be removed from `SITEMAP.json`, rerendered into `SITEMAP.md`, and scrubbed from active screenshot/report surfaces together

Canonical data note:
- `SITEMAP.json` is now the canonical machine-readable source of truth
- `SITEMAP.md` is the rendered human-readable reference file
- the standardized change flow is:
  - edit `SITEMAP.json`
  - run `./nai sitemap-validate`
  - run `./nai sitemap-render-md`
  - run `./nai routes` if route data changed

Saybrook request lane note:
- Saybrook request intake now uses n8n Data Tables as the shared row store for resident requests
- the request workflow should insert normalized rows into the Saybrook request Data Table
- the trustee workflow should fetch rows back from the same table for the hidden queue view
- keep the request intake docs in `n8n/SAYBROOK_ZONING_REQUEST_FLOW.md` in sync with the workflow artifact
- keep the trustee read-side docs in `n8n/SAYBROOK_ZONING_TRUSTEE_REQUESTS.md` in sync with the workflow artifact
- the live Saybrook UI should stay interaction-first, keep the seal contained, use the CivicSidebar + chat canvas + IntakeDrawer structure, and avoid any sign-header or demo/draft framing in the visible product

Tooling note:
- `NAI_TOOLCHAIN.json` is the canonical registry for which scripts are core, support, or legacy
- `NAI_TOOLCHAIN.md` is the rendered human-readable reference
- use `./nai tooling` whenever you need to see which scripts are safe to ignore and which are integral to the suite

## Product + Brand Doctrine

Each MVP is judged on two equal axes:

1. **Product quality** - does it work, feel polished, and solve the problem cleanly?
2. **Buyer-specific branding** - is it clearly aimed at a real target buyer or customer?

Both matter. A beautiful brand on a broken product is not done. A great product with no buyer is not done either.

If a site is strong enough to be reused for multiple legitimate buyers, clone it and brand each version separately instead of forcing one generic version to do everything.

## What Was Wrong

- `vercel.json` and the generated route table had drifted away from the actual app layout.
- Some routes were still pointing at stale or chunked output paths.
- The build workflow was scanning `node_modules/` and other dependency folders as if they were real site packages.
- The deploy step was building the wrong Vercel target, which caused a preview/production mismatch.
- Several apps had source-level issues, including:
  - missing local `src/api-client.js` imports
  - duplicated inline fetch blocks that conflicted with the shared API client pattern
- ClickUp was also being treated like a canonical metadata source, which created plan-limit noise and wasted time.

## What I Changed

- Rebuilt the route generation flow so it reads from `SITEMAP.md` and the actual site layout.
- Added `siteflow.py` to centralize:
  - sitemap parsing
  - site slug mapping
  - build-root detection
  - build-output normalization
  - API-client shim detection
- Added the `nai` command as a single entrypoint for:
  - `scan`
  - `build`
  - `routes`
  - `deploy`
  - `screenshots`
- Moved the internal NAI suite implementation under `nai_suite/` so the root stays focused on entrypoints and canonical docs.
- Added a structured sitemap layer:
  - `SITEMAP.json` for canonical machine-readable data
  - rendered `SITEMAP.md` for humans
  - explicit validate/render steps instead of brittle Markdown parsing
- Fixed the package discovery logic so it ignores:
  - `node_modules`
  - `.vercel`
  - `dist`
  - `build`
  - `out`
- Updated deploy logic to use a production build before pushing prebuilt output:
  - `vercel build --prod`
  - `vercel deploy --prebuilt --prod --yes`
- Added missing local API-client shims for affected apps.
- Removed duplicate inline Gemini fetch code from the apps that had been refactored to use the shared client.
- Removed the stale `/wine/` route from the source of truth.
- Removed the deprecated `name` field from `vercel.json`.
- Stopped treating ClickUp as the source of truth for site numbering or portfolio order.

## Current State

- The production site is live again.
- The live `/eligibility/` route now serves built HTML and asset bundles, not the raw Vite source shell.
- The route table is being generated from the sitemap/source of truth again.
- The main workflow currently builds and deploys the source-backed route set successfully.

## Recommended Workflow

Use this process whenever you are changing sites or deploying:

If you prefer not to work directly in the terminal, open the lightweight browser wrapper:

```bash
./nai hub
```

### 1. Check the site inventory

```bash
./nai scan
```

Use this to see:
- which routes are in the sitemap
- which site folders exist
- which sites already have build output
- which sites still need an `api-client.js` shim

### 2. Make your source changes

Edit the relevant site files under `websites/`, or the shared helpers if the change applies broadly.

Prefer fixing the source app itself rather than patching around the symptom in generated output.

### 3. Regenerate routes

```bash
./nai routes
```

This refreshes `vercel.json` from the current sitemap and build-aware route logic.

### 4. Build and deploy

```bash
./nai deploy
```

This now:
- builds each site
- skips dependency-folder noise
- regenerates route config
- runs `vercel build --prod`
- deploys the production prebuilt output

### Pre-deploy gate

Run this before a meaningful publish:

```bash
./nai scan
```

If scan is clean enough for the intended publish:
- resolve any missing route/source mismatches you care about
- run `./nai deploy`
- verify the live routes
- rerun screenshots if you need visual confirmation

### 5. Capture screenshots

```bash
./nai screenshots
```

Use this for progress tracking and visual verification.

For score-only trend visualization across archived analysis runs, use:

```bash
./nai progress
```

## Practical Rules Going Forward

- Treat `SITEMAP.json` as the canonical source of truth.
- Treat `SITEMAP.md` as the rendered human-readable reference.
- Treat helper scripts as legacy unless they are part of `nai`.
- Treat ClickUp as optional human tracking, not as a canonical database.
- Use the report tools to separate "fix the product" work from "pick the buyer and brand it" work.
- Use `visual_report_summary.py` when you want a quick target/buyer mapping pass on top of the design buckets.
- The screenshot analyzer now asks the model to name the exact target brand entity when it is clear, or to mark the site as needing target research when it is not.
- Avoid changing live deployment paths by hand unless you are deliberately updating the route model.
- Fix source-level app errors first, then rebuild, then deploy.
- If a route looks blank or wrong, check:
  - the built `dist/index.html`
  - the active `vercel.json`
  - the deploy target/root directory

## Short Version

The problem was stale routing plus a broken build/deploy workflow.

The fix was to:
- regenerate routes from the sitemap
- make builds app-aware
- ignore dependency folders
- deploy the correct production prebuilt output

The current one-command workflow is:

```bash
./nai deploy
```
