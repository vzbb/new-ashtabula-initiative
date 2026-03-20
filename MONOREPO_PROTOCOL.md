# Monorepo Protocol

This is a short project supplement for people and agents working in the NAI monorepo.

## Purpose

The repo contains many MVPs, one landing page, shared helpers, and generated deploy artifacts. The goal is to keep changes localized, traceable, and easy to deploy.

## Working Rules

- Treat `SITEMAP.md` as the source of truth for live routes.
- Edit one MVP at a time unless the issue is clearly shared.
- Put shared fixes in shared code, not in every app.
- Use `nai` for route, build, deploy, and screenshot workflows.
- Verify before publishing.
- Commit and push a coherent finished unit of work.

## Good Change Pattern

1. Find the target route in `SITEMAP.md`.
2. Edit only the matching site in `websites/<site-name>/`.
3. Reuse shared helpers when the same bug affects multiple sites.
4. Run the relevant local build or `./nai scan`.
5. Run `./nai routes` if the route map changed.
6. Run `./nai deploy` for production.
7. Commit the completed change.
8. Push the commit.

## Do Not

- Do not hand-edit generated `dist/` output.
- Do not treat `.vercel/` or `node_modules/` as source.
- Do not change routes without updating the sitemap and route generator.
- Do not spread one fix across many apps when a shared helper is the right place.

## Helpful References

- [README.md](README.md)
- [AGENTS.md](AGENTS.md)
- [WORKFLOW.md](WORKFLOW.md)
- [nai](nai)

