# Deployment Checklist — Parts Finder + Plating Tracker

**Date:** 2026-02-19  
**Goal:** Deploy both prototypes to Firebase for live demos  
**ETA:** 30 minutes per site once started

---

## Pre-Flight (Both Sites)

- [ ] Confirm Firebase CLI installed: `firebase --version`
- [ ] Confirm logged in: `firebase login`
- [ ] Check current Firebase projects: `firebase projects:list`
- [ ] Decide: New projects or existing `noirsys-ashtabula` project?

---

## Parts Finder Deployment

### 1. Build Verification (2 min)
```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/parts-finder
npm install  # if needed
npm run build
```
- [ ] Build completes without errors
- [ ] `dist/` folder contains `index.html` + assets

### 2. Firebase Setup (3 min)
```bash
firebase init hosting
# Select: Configure files for Firebase Hosting
# Select: existing project OR create new
# Public directory: dist
# Configure as SPA: Yes
# Overwrite index.html: No
```
- [ ] `.firebaserc` created
- [ ] `firebase.json` created

### 3. Environment Configuration (2 min)
- [ ] Create `.env.production` with production Gemini API key
- [ ] Ensure `VITE_GEMINI_API_KEY` is set (restricted key recommended)
- [ ] Rebuild: `npm run build`

### 4. Deploy (2 min)
```bash
firebase deploy --only hosting
```
- [ ] Deploy succeeds
- [ ] URL returned (e.g., `https://parts-finder-ashtabula.web.app`)

### 5. Smoke Test (5 min)
- [ ] Load deployed URL
- [ ] Test search: "Alternator for 2015 F-150"
- [ ] Verify Gemini response appears
- [ ] Check mobile responsiveness
- [ ] Note any console errors

**Target URL:** `https://parts-finder-ashtabula.web.app` (or similar)

---

## Plating Tracker Deployment

### 1. Build Verification (2 min)
```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/plating-tracker
npm install  # if needed
npm run build
```
- [ ] Build completes without errors
- [ ] `dist/` folder contains `index.html` + assets

### 2. Firebase Setup (3 min)
```bash
firebase init hosting
# Same options as above
```
- [ ] `.firebaserc` created
- [ ] `firebase.json` created

### 3. Environment Configuration (2 min)
- [ ] Create `.env.production` with production Gemini API key
- [ ] Rebuild: `npm run build`

### 4. Deploy (2 min)
```bash
firebase deploy --only hosting
```
- [ ] Deploy succeeds
- [ ] URL returned

### 5. Smoke Test (5 min)
- [ ] Load deployed URL
- [ ] Test tracking demo
- [ ] Verify workflow steps display
- [ ] Check mobile responsiveness

**Target URL:** `https://plating-tracker-ashtabula.web.app` (or similar)

---

## Post-Deployment (Both Sites)

- [ ] Add deployed URLs to WEBSITE_TRACKING.md
- [ ] Update PROJECT.md status: "🟢 Live at [URL]"
- [ ] Create "Share for Feedback" message template
- [ ] Queue for pitch deck inclusion

---

## Blockers to Resolve

| Issue | Owner | Resolution |
|-------|-------|------------|
| Gemini API key for production | Michael | Create restricted key in Google AI Studio |
| Firebase project selection | Michael | New project per site or single project? |
| Domain preference | Michael | `.web.app` acceptable or custom domain? |

---

## Pitch-Ready Checklist

Once deployed, each site needs:

- [ ] Demo script (30-second walkthrough)
- [ ] "What it does" one-liner
- [ ] "Who it's for" target customer
- [ ] "What to do next" CTA for prospects

**Next Action:** Get Michael's go-ahead + API key, then execute deployment.
