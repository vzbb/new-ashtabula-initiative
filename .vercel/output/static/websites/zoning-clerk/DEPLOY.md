# Zoning Clerk — Deployment Guide

**Status:** Build Complete ✅  
**Date:** 2026-02-14  
**Ready for:** Firebase Hosting Deployment

---

## Quick Deploy (3 commands)

```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/zoning-clerk

# 1. Install Firebase CLI (if not already)
npm install -g firebase-tools

# 2. Login to Firebase (one-time)
firebase login

# 3. Deploy
firebase deploy --only hosting
```

---

## Pre-Deploy Checklist

- [x] Build verified (`npm run build` succeeds)
- [x] All assets generated (JS, CSS, HTML)
- [x] Gemini API key configured in environment
- [ ] Firebase project selected/created
- [ ] Domain configured (optional: `zoning-clerk.noirsys.com`)

---

## Build Artifacts

| File | Size | Purpose |
|------|------|---------|
| `dist/index.html` | 0.46 KB | Entry point |
| `dist/assets/index-*.js` | 286 KB | Application bundle |
| `dist/assets/index-*.css` | 29 KB | Styles (Tailwind) |
| `dist/vite.svg` | 1.5 KB | Logo |

---

## Environment Variables

The app expects:
- `VITE_GEMINI_API_KEY` — Set during build, embedded in bundle

Current: Using system env var `GEMINI_API_KEY`

---

## Features Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| RAG Chat Assistant | ✅ | Gemini 2.5 Flash with historic district context |
| Property Lookup | ✅ | Mock data, ready for GIS integration |
| Use Eligibility Checker | ✅ | Interactive table with zoning rules |
| Permit Wizard | ✅ | 4-step wizard with document checklist |
| Document Center | ✅ | Mock forms, ready for PDF links |
| Mobile Responsive | ✅ | Tailwind CSS, touch-friendly |

---

## Post-Deploy Verification

```bash
# Test the live URL
curl https://YOUR-PROJECT.web.app

# Verify chat works (requires browser)
# 1. Open URL
# 2. Ask: "When are Architectural Review Board meetings?"
# 3. Should respond with context from historic district PDF
```

---

## Next Steps (Post-Deploy)

1. **Real GIS Data** — Replace mock property lookup with Ashtabula County data
2. **Vector DB RAG** — Migrate from prompt-injection to Qdrant for full zoning code
3. **Form Links** — Add actual PDF links once obtained from City PCD
4. **Analytics** — Add Firebase Analytics for usage tracking

---

## Rollback

```bash
# List previous versions
firebase hosting:releases:list

# Rollback to previous
firebase hosting:clone SOURCE:TARGET
```

---

**Build verified at:** Feb 14, 2026 9:27 PM EST  
**Built by:** Heartbeat automation (RSI rotation)
