# New Ashtabula Initiative — Unified Deployment Plan

## Domain: newashtabulainitiative.org

## Architecture
Single Vercel deployment with each MVP as a sub-route:

```
newashtabulainitiative.org/
├── /                    (Landing page - catalog of all MVPs)
├── /parts-finder/       (Auto parts search)
├── /plating-tracker/    (Plating status tracking)
├── /resource-compass/   (Social services directory)
├── /invest-ashtabula/   (Economic development)
├── /engineers-assistant/ (Future deployment)
├── /pet-matchmaker/     (Future deployment)
└── ... (more as they build)
```

## Landing Page Structure
- Hero: "50+ Tools for Ashtabula County"
- Categories: Contractor Tools, Tourism, Civic, Arts, Automotive
- Grid of MVPs with status badges
- Search/filter functionality
- "Submit an Idea" form

## Technical Setup
- Monorepo: All MVP builds in `/apps/*`
- Shared components in `/packages/ui`
- Single Vercel project
- Custom domain: newashtabulainitiative.org

## Deployment Steps
1. Create landing page app
2. Copy existing builds to sub-routes
3. Configure vercel.json rewrites
4. Set up custom domain
5. Deploy

## Status Legend
- 🟢 Live - Deployed and working
- 🟡 Beta - Deployed, needs testing
- 🔵 Building - In development
- ⚪ Planned - Research complete, not started
