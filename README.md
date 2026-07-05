# New Ashtabula Initiative

NAI is a monorepo for the New Ashtabula Initiative landing page plus 75 independent MVP websites under `websites/`.

## Source Of Truth

- `SITEMAP.json` is the canonical machine-readable route map.
- `SITEMAP.md` is rendered from `SITEMAP.json` for humans and agents.
- `vercel.json` is generated from `SITEMAP.json` and the detected build outputs.
- `dist/`, `.vercel/`, screenshot galleries, and analysis reports are derived artifacts.

## Core Commands

```bash
./nai scan
./nai build --slugs saybrook-zoning
./nai screenshots --slugs saybrook-zoning
./nai screenshots --live --slugs saybrook-zoning
./nai analyze-screenshots --slugs saybrook-zoning
./nai deploy --confirm-production
```

Use `./nai build --slugs <slug...>` for focused local verification. Use `./nai deploy --confirm-production` only when a production publish is intended; it builds all sites, regenerates routes, prepares a pruned `.vercel/output`, and deploys with Vercel prebuilt output.

## Single-MVP Workflow

1. Find the route in `SITEMAP.json`.
2. Edit the source under `websites/<site-folder>/`, not generated `dist/` output.
3. Run `./nai build --slugs <slug>`.
4. Run `./nai screenshots --slugs <slug>` for local visual verification when UI changed.
5. Run `./nai deploy --confirm-production` when the change is ready to publish.
6. Run `./nai screenshots --live --slugs <slug>` and `./nai analyze-screenshots --slugs <slug>` to verify production.

See `WORKFLOW.md` for the full operator procedure.
