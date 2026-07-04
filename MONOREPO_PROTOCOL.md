# Monorepo Protocol

This is a short project supplement for people and agents working in the NAI monorepo.

## Purpose

The repo contains many MVPs, one landing page, shared helpers, and generated deploy artifacts. The goal is to keep changes localized, traceable, and easy to deploy.

## Working Rules

- Treat `SITEMAP.json` as the canonical source of truth for live routes.
- Treat `SITEMAP.md` as the rendered human-readable route reference.
- Edit one MVP at a time unless the issue is clearly shared.
- Put shared fixes in shared code, not in every app.
- Use `nai` for route, build, deploy, and screenshot workflows.
- Verify before publishing.
- Commit and push a coherent finished unit of work.
- Treat product quality and buyer-specific branding as equal goals.
- If one MVP can honestly support multiple buyers, clone and rebrand it instead of trying to force a single generic version.

## Good Change Pattern

1. Find the target route in `SITEMAP.json` or the rendered `SITEMAP.md`.
2. Edit only the matching site in `websites/<site-name>/`.
3. Reuse shared helpers when the same bug affects multiple sites.
4. Run the relevant local build or `./nai scan`.
5. If the route map changed, edit `SITEMAP.json`, then run `./nai sitemap-validate` and `./nai sitemap-render-md`.
6. Run `./nai routes` if deployment route config needs to be regenerated.
7. Run `./nai deploy --confirm-production` only when you intend to publish production.
8. Commit the completed change.
9. Push the commit.

## Do Not

- Do not hand-edit generated `dist/` output.
- Do not treat `.vercel/` or `node_modules/` as source.
- Do not change routes in Markdown directly; update `SITEMAP.json`, render `SITEMAP.md`, then regenerate routes.
- Do not spread one fix across many apps when a shared helper is the right place.

## Helpful References

- [README.md](README.md)
- [AGENTS.md](AGENTS.md)
- [WORKFLOW.md](WORKFLOW.md)
- [nai](nai)
