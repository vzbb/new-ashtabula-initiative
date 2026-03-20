# Noirsys AI Deployment Guide

**Purpose:** Standard procedures for deploying websites to production  
**Platforms:** Vercel, Netlify, Cloudflare Pages, Firebase  
**Last Updated:** 2026-03-15

---

## Deployment Platforms

### Recommended: Vercel
**Best for:** React/Vue/Next.js apps, serverless functions
- **Pros:** Excellent React support, edge functions, preview deploys
- **Cons:** Vendor lock-in
- **Cost:** Free tier generous, Pro $20/mo

### Alternative: Netlify
**Best for:** Static sites, JAMstack, form handling
- **Pros:** Great forms, edge functions, Git-based deploys
- **Cons:** Build time limits on free tier
- **Cost:** Free tier, Pro $19/mo

### Alternative: Cloudflare Pages
**Best for:** Global performance, edge computing
- **Pros:** Fastest global CDN, Workers integration
- **Cons:** Newer platform, smaller ecosystem
- **Cost:** Free tier generous

### Alternative: Firebase Hosting
**Best for:** Google ecosystem, mobile apps
- **Pros:** Google integration, easy auth, real-time DB
- **Cons:** Google-specific
- **Cost:** Free tier, pay-as-you-go

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All features working in dev environment
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] No console errors
- [ ] Build completes without warnings
- [ ] Environment variables configured

### Content
- [ ] All placeholder content replaced
- [ ] Ashtabula-specific content added
- [ ] Contact information correct
- [ ] Privacy policy included (if collecting data)
- [ ] Terms of service included (if needed)

### Assets
- [ ] All images optimized (< 500KB each)
- [ ] Favicon generated
- [ ] Open Graph meta tags added
- [ ] PWA manifest (if applicable)

### SEO
- [ ] Title tags unique per page
- [ ] Meta descriptions added
- [ ] robots.txt configured
- [ ] Sitemap generated

---

## Deployment Process

### Step 1: Build Verification

```bash
# Build and normalize every site
./nai build

# Inspect the current build summary
./nai scan
```

### Step 2: Platform Setup

#### Vercel Deployment

```bash
# One-command deploy
./nai deploy
```

#### Netlify Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist

# Or drag-and-drop in web UI
```

#### Cloudflare Pages

```bash
# Use Wrangler CLI
npm i -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy dist
```

### Step 3: Environment Variables

```bash
# Example: Set env vars on Vercel
vercel env add OPENAI_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY

# Pull env vars locally
vercel env pull
```

### Step 4: Domain Configuration

#### Option A: Vercel Subdomain (Free)
```
https://[project-name]-ashtabula.vercel.app
```

#### Option B: Custom Domain
```
https://[tool-name]-ashtabula.com
```

**DNS Setup:**
1. Buy domain (Namecheap, Cloudflare, etc.)
2. Add to Vercel/Netlify dashboard
3. Update nameservers or add CNAME
4. Wait for SSL certificate (auto-provisioned)

### Step 5: Post-Deployment Verification

```bash
# Smoke test commands
curl -s https://[deployed-url] | head -20

# Check SSL
curl -I https://[deployed-url]

# Test key functionality
# [Manual testing checklist]
```

**Manual Checklist:**
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Forms submit successfully
- [ ] Mobile responsive
- [ ] No broken images
- [ ] No console errors

---

## Environment-Specific Configs

### Production Build
```javascript
// vite.config.js
export default {
  build: {
    outDir: 'dist',
    sourcemap: false,  // Disable in prod
  },
  define: {
    __API_URL__: JSON.stringify(process.env.VITE_API_URL),
  }
}
```

### Environment Variables
```bash
# .env.production
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=[key]
VITE_OPENAI_API_KEY=[key]
```

---

## Monitoring & Maintenance

### Uptime Monitoring
- **UptimeRobot** - Free tier: 50 monitors, 5-min intervals
- **Pingdom** - Paid, more features
- **Better Uptime** - Modern alternative

### Error Tracking
- **Sentry** - Free tier: 5k errors/mo
- **LogRocket** - Session replay + errors
- **Rollbar** - Error tracking

### Analytics
- **Plausible** - Privacy-friendly, paid
- **Fathom** - Privacy-friendly, paid
- **Google Analytics** - Free, privacy concerns

---

## Rollback Procedures

### Immediate Rollback (Vercel)
```bash
# List deployments
vercel deployments

# Rollback to previous
vercel --prod [previous-deployment-url]
```

### Git-Based Rollback
```bash
# Revert commit
git revert HEAD

# Push (triggers new deploy)
git push origin main
```

### Emergency Procedure
1. Identify issue
2. Decide: Fix forward vs. rollback
3. Execute rollback if needed
4. Communicate to stakeholders
5. Post-mortem after resolution

---

## Deployment Schedule

### Regular Deploys
- **Development:** Continuous (feature branches)
- **Staging:** Daily (main branch)
- **Production:** Weekly or bi-weekly

### Deployment Windows
- **Preferred:** Tuesday-Thursday, 10am-4pm ET
- **Avoid:** Friday afternoons, weekends, holidays
- **Emergency:** Anytime with approval

---

## Security Checklist

### Pre-Deployment
- [ ] No secrets in code
- [ ] Environment variables set
- [ ] CORS configured properly
- [ ] HTTPS enforced
- [ ] Security headers set

### Headers to Configure
```
Strict-Transport-Security: max-age=63072000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Troubleshooting

### Common Issues

**Build Fails**
- Check Node version matches
- Clear node_modules and reinstall
- Check for syntax errors
- Verify all imports resolve

**Environment Variables Missing**
- Check variable names (VITE_ prefix for Vite)
- Verify set in platform dashboard
- Redeploy after setting

**404 Errors**
- Check routing configuration
- Verify SPA fallback settings
- Check build output structure

**Slow Performance**
- Run Lighthouse audit
- Check bundle size
- Verify images optimized
- Enable compression

---

## Website-Specific Deployment Notes

### harbor-cam-dashboard
- **Platform:** Vercel
- **Domain:** harbor-cam-ashtabula.vercel.app
- **Special:** Requires API keys for camera feeds
- **Status:** Deployed

### permit-whisperer
- **Platform:** TBD
- **Domain:** TBD
- **Special:** May need City endorsement before public deploy
- **Status:** Build ready

### ai-docent
- **Platform:** TBD
- **Domain:** TBD
- **Special:** Requires museum partnership
- **Status:** SPEC complete

---

## Deployment Tracking

| Website | Platform | Domain | Status | Last Deploy |
|---------|----------|--------|--------|-------------|
| harbor-cam-dashboard | Vercel | harbor-cam-ashtabula.vercel.app | 🟢 Live | 2026-03-01 |
| [others] | TBD | TBD | 🟡 In Dev | - |

---

## Next Steps

1. **Set up deployment pipeline** for active projects
2. **Configure monitoring** for deployed sites
3. **Document domain strategy** (subdomain vs. custom)
4. **Create staging environment** for testing
5. **Train team** on deployment procedures

---

*For sales strategy, see SALES_STRATEGY.md*
*For outreach procedures, see OUTREACH.md*
