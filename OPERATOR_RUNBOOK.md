# NAI Operator Runbook

This is the working procedure for recovering and operating the NAI monorepo without reintroducing the Markdown-driven route drift that previously broke deployment workflows.

## Route Source Of Truth

- `SITEMAP.json` is canonical for deployment and workflow tooling.
- `SITEMAP.md` is rendered for developers, users, and agents.
- Do not parse or hand-edit `SITEMAP.md` for production operations.
- If route data changes, edit `SITEMAP.json`, validate it, render Markdown, then regenerate route config.

```bash
./nai sitemap-validate
./nai sitemap-render-md
./nai routes
```

The code path that keeps the files connected is `nai_suite/sitemap_data.py`; `./nai sitemap-render-md` renders `SITEMAP.md` from `SITEMAP.json`.

## Safe Local Health Check

These commands do not publish production:

```bash
./nai sitemap-validate
./nai scan
```

Use them at the start of a session to confirm route count, source folders, build roots, Vite base configuration, and API-client shims.

## One-MVP Edit Loop

1. Find the route in `SITEMAP.json` or the rendered `SITEMAP.md`.
2. Map the slug to the source folder under `websites/`.
3. Read the relevant `lead_research_json/`, `brandkits/`, and `branding_research/` files when the work touches buyer targeting or brand.
4. Edit source files only; do not hand-edit `dist/`.
5. Build the affected site locally when dependencies are available.
6. Run `./nai scan`.
7. Commit and push the coherent change when verified.

## Visual QA Loop

Use local screenshots for source-work verification and live screenshots only when intentionally checking the current public deployment.

```bash
./nai screenshots --slugs <slug>
./nai analyze-screenshots --slugs <slug>
```

For production-state review:

```bash
./nai screenshots --live --slugs <slug>
```

## Route Change Loop

1. Edit `SITEMAP.json`.
2. Run `./nai sitemap-validate`.
3. Run `./nai sitemap-render-md`.
4. Run `./nai routes`.
5. Inspect `vercel.json` before publishing.
6. Commit the route, rendered sitemap, and route config together if they are intended to ship.

## Production Publish Gate

Production deploys are blocked by default. `./nai deploy` will stop before building or calling Vercel unless production is explicitly confirmed.

```bash
./nai deploy --confirm-production
```

Equivalent non-interactive form:

```bash
NAI_CONFIRM_PRODUCTION_DEPLOY=1 ./nai deploy
```

Use this only after local scan/build checks and after verifying the change scope.

## Recovery Rules

- If a route looks blank, check the source app, the built `dist/index.html`, generated `vercel.json`, and the Vercel target.
- If `SITEMAP.md` and `SITEMAP.json` disagree, trust `SITEMAP.json` and rerender Markdown.
- If the workflow seems to depend on Markdown parsing for deployment, treat that as a regression and move the logic back to `SITEMAP.json`.
- If a command would publish, require an explicit production confirmation.
