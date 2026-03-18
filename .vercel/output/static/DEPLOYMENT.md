# Vercel Deployment Guide — New Ashtabula Initiative

**Platform:** Vercel  
**URL Pattern:** `https://newashtabula.vercel.app/{mvpname}/`

---

## Architecture

```
newashtabula.vercel.app/
├── /                        ← Main landing page (landing-page/index.html)
├── /civic-insight/          ← Civic Insight Engine
├── /invest/                 ← Invest Ashtabula
├── /permits/                ← Permit Whisperer
├── /grocer/                 ← Local Grocer Go
├── /contractors/            ← Contractor Match
├── /parts/                  ← Parts Finder
├── /plating/                ← Plating Tracker
├── /eligibility/            ← Eligibility Screener
├── /wine/                   ← Through The Grapevine
└── /harbor/                 ← Harbor Cam Dashboard
```

---

## Prerequisites

- Vercel CLI installed: `npm i -g vercel`
- Logged in: `vercel login`
- Environment variables configured (if needed)

---

## Build All MVPs

```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative

# Build Tier 1 (Priority)
cd websites/civic-insight-engine && npm run build && cd ../..
cd websites/invest-ashtabula && npm run build && cd ../..
cd websites/permit-whisperer && npm run build && cd ../..
cd websites/local-grocer-go/client && npm run build && cd ../../..
cd websites/contractor-match && npm run build && cd ../..

# Build Tier 2
cd websites/parts-finder && npm run build && cd ../..
cd websites/plating-tracker && npm run build && cd ../..
cd websites/eligibility-screener && npm run build && cd ../..

# Build Tier 3 (when fixed)
# cd websites/through-the-grapevine && npm run build && cd ../..
# cd websites/harbor-cam-dashboard && npm run build && cd ../..
```

---

## Deploy

```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative

# Preview deployment
vercel

# Production deployment
vercel --prod
```

---

## Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Sites Using |
|----------|-------|-------------|
| `VITE_GEMINI_API_KEY` | Your Gemini API key | All sites with AI features |

---

## Post-Deploy Checklist

- [ ] Main landing page loads at root `/`
- [ ] Each MVP loads at its subpath
- [ ] Navigation between MVPs works
- [ ] Mobile responsiveness verified
- [ ] API integrations working
- [ ] No console errors

---

## URL Reference

| MVP | Production URL |
|-----|----------------|
| Landing Page | https://newashtabula.vercel.app/ |
| Civic Insight Engine | https://newashtabula.vercel.app/civic-insight/ |
| Invest Ashtabula | https://newashtabula.vercel.app/invest/ |
| Permit Whisperer | https://newashtabula.vercel.app/permits/ |
| Local Grocer Go | https://newashtabula.vercel.app/grocer/ |
| Contractor Match | https://newashtabula.vercel.app/contractors/ |
| Parts Finder | https://newashtabula.vercel.app/parts/ |
| Plating Tracker | https://newashtabula.vercel.app/plating/ |
| Eligibility Screener | https://newashtabula.vercel.app/eligibility/ |
| Through The Grapevine | https://newashtabula.vercel.app/wine/ |
| Harbor Cam Dashboard | https://newashtabula.vercel.app/harbor/ |

---

## Adding New MVPs

1. Build the MVP: `cd websites/{mvp} && npm run build`
2. Add route to `vercel.json`:
   ```json
   {
     "src": "/{path}/:path*",
     "dest": "/websites/{mvp}/dist/:path*"
   }
   ```
3. Add card to `landing-page/index.html`
4. Redeploy: `vercel --prod`

---

## Troubleshooting

### 404 on subpath
- Check that `dist/` folder exists after build
- Verify route in `vercel.json` matches folder structure
- Ensure base path is configured in vite.config.js if needed

### API not working
- Check environment variables are set in Vercel dashboard
- Verify API routes are not being rewritten incorrectly
- Check CORS settings for external APIs

### Assets not loading
- Ensure relative paths in HTML/CSS
- Check that assets are in `dist/` folder after build
