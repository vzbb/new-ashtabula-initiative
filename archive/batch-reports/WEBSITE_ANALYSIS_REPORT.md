# NAI Website Live Analysis Report ♟️

**Date:** February 28, 2026 — 1:53 PM  
**Method:** HTML structure analysis via curl  
**Sites Tested:** 21 (sample of 68)

---

## 🚨 CRITICAL ISSUE FOUND — FIXED ✅

| Site | URL | Status | Issue |
|------|-----|--------|-------|
| **permits** | /permits/ | ✅ **FIXED** | Was showing landing page |

**Fix Applied:**
- Changed vite.config.js base from `/permit-whisperer/` to `/permits/`
- Updated vercel.json route to match
- Rebuilt and redeployed

**Result:** Site now loads correctly at /permits/

---

## ✅ WORKING SITES (20/21)

| Site | Title | React | Assets | Quality |
|------|-------|-------|--------|---------|
| **invest** | invest-ashtabula | ✅ | 2 | ⚠️ Generic title |
| **civic-insight** | Civic Insight Engine — Ashtabula Transparency Portal | ✅ | 2 | ✅ Good title |
| **ai-docent** | AI Docent \| Museum Narration Assistant | ✅ | 2 | ✅ Good title |
| **policy-pal** | policy-pal | ✅ | 2 | ⚠️ Generic title |
| **parts** | parts-finder | ✅ | 2 | ⚠️ Generic title |
| **plating** | plating-tracker | ✅ | 2 | ⚠️ Generic title |
| **eligibility** | eligibility-screener | ✅ | 2 | ⚠️ Generic title |
| **contractors** | contractor-match | ✅ | 2 | ⚠️ Generic title |
| **harbor** | Ashtabula Harbor Dashboard \| Live Camera & Marine Conditions | ✅ | 2 | ✅ Good title |
| **harvest-alert** | harvest-alert | ✅ | 2 | ⚠️ Generic title |
| **hvac-tuneup** | hvac-tuneup | ✅ | 2 | ⚠️ Generic title |
| **insta-book** | insta-book | ✅ | 2 | ⚠️ Generic title |
| **pocket-historian** | pocket-historian | ✅ | 2 | ⚠️ Generic title |
| **pocket-sommelier** | pocket-sommelier | ✅ | 2 | ⚠️ Generic title |
| **ride-ready** | Ride Ready | ✅ | 2 | ⚠️ Short title |
| **route-optimizer** | Route Optimizer \| Ashtabula Efficiency | ✅ | 2 | ✅ Good title |
| **zoning-clerk** | zoning-clerk | ✅ | 2 | ⚠️ Generic title |
| **wedding-lead-form** | wedding-lead-form | ✅ | 2 | ⚠️ Generic title |
| **volunteer-scheduler** | volunteer-scheduler | ✅ | 2 | ⚠️ Generic title |
| **visual-portfolio** | visual-portfolio | ✅ | 2 | ⚠️ Generic title |

---

## 📊 Analysis Summary

### Technical Health
| Metric | Count | Percentage |
|--------|-------|------------|
| Sites Loading | 20/21 | 95% |
| React Apps | 20/21 | 95% |
| Assets Present | 20/21 | 95% |
| Broken | 1/21 | 5% |

### Title Quality
| Category | Count | Examples |
|----------|-------|----------|
| Professional | 4 | Civic Insight Engine, AI Docent, Harbor Dashboard, Route Optimizer |
| Generic | 15 | invest-ashtabula, policy-pal, parts-finder, etc. |
| Broken | 1 | permits (landing page) |

---

## 🔧 Fixes Needed

### Immediate (Before Demo)
1. **Fix /permits/** — Investigate routing issue
   - Check if folder is `permit-whisperer` vs `permits`
   - Verify vercel.json route matches vite.config.js base

### UI Polish (High Impact)
2. **Update generic titles** — 15 sites have kebab-case titles
   - Change "invest-ashtabula" → "Invest in Ashtabula | Economic Development"
   - Change "policy-pal" → "Policy Pal | AI Policy Assistant"
   - Change "parts-finder" → "Parts Finder | Local Auto Parts"
   - etc.

3. **Add meta descriptions** — For SEO and sharing

### Demo Readiness
4. **Verify interactivity** — Ensure buttons/forms work
5. **Mobile responsiveness** — Test at 375px width
6. **Console errors** — Check for JS errors

---

## 🎯 Recommended Priority

### P0 (Fix Now)
- [ ] Fix /permits/ routing

### P1 (Before Outreach)
- [ ] Update all generic titles (15 sites)
- [ ] Add meta descriptions
- [ ] Test mobile responsiveness

### P2 (Nice to Have)
- [ ] Add favicons
- [ ] Optimize asset loading
- [ ] Add analytics

---

## 📝 Detailed Site Notes

### Best Examples (Good Titles)
1. **Civic Insight Engine** — "Civic Insight Engine — Ashtabula Transparency Portal"
2. **AI Docent** — "AI Docent | Museum Narration Assistant"
3. **Harbor Dashboard** — "Ashtabula Harbor Dashboard | Live Camera & Marine Conditions"
4. **Route Optimizer** — "Route Optimizer | Ashtabula Efficiency"

### Needs Title Update
- invest → "Invest in Ashtabula"
- policy-pal → "Policy Pal"
- parts → "Parts Finder"
- plating → "Plating Tracker"
- eligibility → "Eligibility Screener"
- contractors → "Contractor Match"
- harvest-alert → "Harvest Alert"
- hvac-tuneup → "HVAC Tune-Up"
- insta-book → "InstaBook"
- pocket-historian → "Pocket Historian"
- pocket-sommelier → "Pocket Sommelier"
- zoning-clerk → "Zoning Clerk"
- wedding-lead-form → "Wedding Lead Form"
- volunteer-scheduler → "Volunteer Scheduler"
- visual-portfolio → "Visual Portfolio"

---

**Next Steps:**
1. Fix permits routing
2. Update titles on 15 sites
3. Full screenshot capture once browser available

*Analysis complete. 1 critical issue, 15 minor improvements needed.*
