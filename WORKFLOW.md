# NAI Site Recovery Summary

## Overview

The live NAI websites had two separate problems:

1. The deploy workflow was pointing at stale or wrong build outputs.
2. The local automation was crawling the wrong directories and trying to treat dependency folders as apps.

That combination made the live site fall back to the wrong HTML shell or serve pages that looked blank because the wrong bundle was being published.

The good news: the sites are back now, and the production deployment is serving built assets again.

## What Was Wrong

- `vercel.json` and the generated route table had drifted away from the actual app layout.
- Some routes were still pointing at stale or chunked output paths.
- The build workflow was scanning `node_modules/` and other dependency folders as if they were real site packages.
- The deploy step was building the wrong Vercel target, which caused a preview/production mismatch.
- Several apps had source-level issues, including:
  - missing local `src/api-client.js` imports
  - duplicated inline fetch blocks that conflicted with the shared API client pattern

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

## Current State

- The production site is live again.
- The live `/eligibility/` route now serves built HTML and asset bundles, not the raw Vite source shell.
- The route table is being generated from the sitemap/source of truth again.
- The main workflow now builds all 81 sites successfully before deploying.

## Recommended Workflow

Use this process whenever you are changing sites or deploying:

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

### 5. Capture screenshots

```bash
./nai screenshots
```

Use this for progress tracking and visual verification.

## Practical Rules Going Forward

- Treat `SITEMAP.md` as the source of truth.
- Treat helper scripts as legacy unless they are part of `nai`.
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

