# Parts Finder — Deployment Plan

## Quick Deploy (Vercel) — 15 Minutes

### Prerequisites
- Vercel CLI installed: `npm i -g vercel`
- Vercel account (free tier sufficient)
- Gemini API key in `.env`

### Step 1: Environment Setup
```bash
cd projects/new-ashtabula-initiative/websites/parts-finder

# Create .env if not exists
echo "VITE_GEMINI_API_KEY=your_key_here" > .env
```

### Step 2: Build Verification
```bash
npm install
npm run build

# Verify dist/ folder created
ls dist/
```

### Step 3: Deploy to Vercel
```bash
# First deploy (interactive)
vercel

# Follow prompts:
# - Link to existing project? [N]
# - Project name: parts-finder-ashtabula
# - Directory: ./
# - Build command: npm run build
# - Output directory: dist

# Subsequent deploys
vercel --prod
```

### Step 4: Environment Variables
```bash
# Add API key to Vercel project
vercel env add VITE_GEMINI_API_KEY
# Enter your key when prompted
# Select: Production, Preview, Development

# Redeploy to apply
vercel --prod
```

### Step 5: Verify Deployment
- URL: `https://parts-finder-ashtabula.vercel.app`
- Test search: "brake pads 2015 F-150"
- Confirm AI response loads

---

## Alternative: Firebase Hosting

### Prerequisites
- Firebase CLI: `npm i -g firebase-tools`
- Firebase project created

### Deploy Steps
```bash
# Login
firebase login

# Initialize (if first time)
firebase init hosting
# - Select project
# - Public directory: dist
# - SPA: Yes
# - Overwrite: No

# Build and deploy
npm run build
firebase deploy
```

---

## Post-Deploy Checklist

### Functionality
- [ ] Search returns AI response
- [ ] Loading state shows
- [ ] Error messages display
- [ ] Mobile layout works
- [ ] No console errors

### Performance
- [ ] First load < 3 seconds
- [ ] Response time < 5 seconds
- [ ] Lighthouse score > 80

### Next Steps After Deploy
1. Share URL with Michael for review
2. Begin Phase 2: Store API research
3. Create demo video for store outreach
4. Add analytics (Plausible or Vercel)

---

## Rollback
```bash
# Vercel — revert to previous
cd parts-finder
vercel rollback [deployment-url]

# Or redeploy previous commit
git checkout [previous-commit]
vercel --prod
```
