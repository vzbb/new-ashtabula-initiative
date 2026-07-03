# NAI Website Build Documentation - Batch 2

**Date:** February 28, 2026  
**Sites:** harvest-alert, hvac-tuneup, insta-book, insta-book-stripe

---

## Build Status Summary

| Site | Build Status | Dist Size | Notes |
|------|-------------|-----------|-------|
| harvest-alert | ✅ SUCCESS | ~200KB | Standard Vite React app |
| hvac-tuneup | ✅ SUCCESS | ~200KB | Standard Vite React app |
| insta-book | ✅ SUCCESS | ~200KB | Standard Vite React app |
| insta-book-stripe | ✅ SUCCESS | ~440KB | Full-stack app (client+server) |

---

## Site Details

### 1. harvest-alert
**Type:** Vite React SPA  
**Location:** `/websites/harvest-alert/`

**Build Steps:**
```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/harvest-alert
npm install
npm run build
```

**Output:**
- `dist/index.html` (460 B)
- `dist/assets/index-BdL8XZdT.css` (2.54 KB)
- `dist/assets/index-7nmI08St.js` (195.64 KB)
- `dist/vite.svg`

**Build Command:**
```json
"build": "VITE_GEMINI_API_KEY=$GEMINI_API_KEY vite build"
```

---

### 2. hvac-tuneup
**Type:** Vite React SPA  
**Location:** `/websites/hvac-tuneup/`

**Build Steps:**
```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/hvac-tuneup
npm install
npm run build
```

**Output:**
- `dist/index.html` (458 B)
- `dist/assets/index-EfYDOzSb.css` (2.55 KB)
- `dist/assets/index-CZ1oq5Ry.js` (196.05 KB)
- `dist/vite.svg`

**Build Command:**
```json
"build": "VITE_GEMINI_API_KEY=$GEMINI_API_KEY vite build"
```

---

### 3. insta-book
**Type:** Vite React SPA  
**Location:** `/websites/insta-book/`

**Build Steps:**
```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/insta-book
npm install
npm run build
```

**Output:**
- `dist/index.html` (457 B)
- `dist/assets/index-7PJA-CLg.css` (2.54 KB)
- `dist/assets/index-BExKICou.js` (195.82 KB)
- `dist/vite.svg`

**Build Command:**
```json
"build": "VITE_GEMINI_API_KEY=$GEMINI_API_KEY vite build"
```

---

### 4. insta-book-stripe
**Type:** Full-Stack (React + Node.js/Express)  
**Location:** `/websites/insta-book-stripe/`

**Structure:**
```
insta-book-stripe/
├── client/          # Vite React SPA
│   ├── package.json
│   └── dist/        # Build output
├── server/          # Node.js/Express API
│   └── package.json
└── package.json     # Root orchestrator
```

**Build Steps:**
```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/insta-book-stripe

# Install all dependencies
npm run install:all

# Build client only (static assets)
npm run build

# Or build from client directory directly:
cd client && npm install && npm run build
```

**Client Output:**
- `client/dist/index.html` (453 B)
- `client/dist/assets/index-B3hcOsJH.css` (34.16 KB)
- `client/dist/assets/index-MP7zy27t.js` (405.75 KB)
- `client/dist/vite.svg`

**Dependencies:**
- Client: React 19, Vite 7, Tailwind 4, Firebase, Stripe, Zustand
- Server: Express, Firebase Admin, Redis, Stripe SDK, Nodemailer

**New Files Created:**
- `/insta-book-stripe/package.json` - Root orchestrator for deployment

---

## Issues Fixed

### 1. Missing Root Package.json (insta-book-stripe)
**Issue:** The insta-book-stripe project had separate client/server packages but no root package.json for unified deployment.

**Fix:** Created root `package.json` with orchestration scripts:
- `install:all` - Install all dependencies
- `build` - Build client static assets
- `build:client` - Build client only
- `dev` - Run both client and server in dev mode

### 2. No Build Errors
All sites built successfully on first attempt. No TypeScript errors, missing dependencies, or path resolution issues were encountered.

---

## Deployment Notes

### Static Sites (harvest-alert, hvac-tuneup, insta-book)
Deploy the `dist/` folder contents to any static host:
- Netlify: Connect repo, build command `npm run build`, publish directory `dist`
- Vercel: Connect repo, framework preset `Vite`, output directory `dist`
- Cloudflare Pages: Build command `npm run build`, output directory `dist`

### Full-Stack (insta-book-stripe)
**Client (Static):** Deploy `client/dist/` to static host
**Server (Node.js):** Deploy `server/` to Node.js host (Render, Railway, VPS)

**Environment Variables Required:**
```bash
# Client (.env)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_STRIPE_PUBLISHABLE_KEY=

# Server (.env)
PORT=3000
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
REDIS_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## Common Build Issues (Reference)

| Issue | Solution |
|-------|----------|
| Missing @types/* | `npm install --save-dev @types/package-name` |
| Path alias errors | Check `vite.config.js` resolve.alias config |
| Environment variables | Ensure VITE_ prefix for client-side vars |
| Module resolution | Verify "type": "module" in package.json |
| CSS processing | Ensure PostCSS/Tailwind configs are present |

---

## Verification Commands

```bash
# Verify all dist folders exist
ls -la /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/harvest-alert/dist/
ls -la /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/hvac-tuneup/dist/
ls -la /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/insta-book/dist/
ls -la /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/insta-book-stripe/client/dist/
```

---

**Build completed successfully - All 4 sites ready for deployment**
