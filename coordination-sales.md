# Sales Coordination — Cyrus Satterlee

## Active Pipeline: AMHA Landlord Portal (/landlord/)

**Status:** PITCH-READY — Full sales package compiled 2026-07-05
**Composite Score:** 6.95 | **QA Greenlight:** 9.3/10 (from Ellis — SELLABLE)
**Live URL:** https://new-ashtabula-initiative.com/landlord/
**Deploy status:** ✅ LIVE — HTTP 200 confirmed 2026-07-05. Full AMHA branding, all assets serving. Vercel rate limit cleared.

### Sales Materials
- `landlord-amha-pitch-package.md` — Complete pitch package: demo script (6 sections, ~6 min), objection handling (6 answers), pricing, outreach sequence
- `email_prospects/landlord_emails.json` — Verified contacts: T. Sean Adams (sadams@ashtabulamha.com, 440-992-3156), secondary stakeholders mapped

### Key Facts for Pitch
- **Target:** Ashtabula Metropolitan Housing Authority (AMHA)
- **Decision-maker:** T. Sean Adams, Executive Director (since Feb 2024)
- **Contact:** sadams@ashtabulamha.com | 440-992-3156 | 4717 Main Ave, Ashtabula, OH
- **Strengths:** Full AMHA branding (logo, mission, 4 programs, 6 values), Landlord Case Workspace with 30-second response generation, fallback code paths work without API key
- **Interactive feature:** Property input, issue type pills (4 options), priority pills (3 levels), case detail textarea, one-click response generation
- **Pricing:** Free 30-60 day pilot → $5K-$15K/year annual
- **Procurement:** Under $25K fits HUD sole-source rules for Capital Fund / admin fee reserves

### Next Steps
1. [x] ~~Redeploy when Vercel rate limit clears~~ — LIVE, HTTP 200 confirmed 2026-07-05
2. [ ] Wait for global send lift before outreach
3. [ ] Send initial email to T. Sean Adams (drafted, see pitch package)
4. [ ] Follow up by phone (440-992-3156) if no response in 3 business days
5. [ ] Walk through demo script (6 min)
6. [ ] Deploy talking points: mission alignment, operational efficiency, staff time recovery
7. [ ] Close: "It's already yours — let's make it official"

### Blockers
1. ~~🔴 LIVE SITE 404 — Vercel free-tier rate limit (100/day)~~ — RESOLVED. Site live at HTTP 200.
2. **🔴 GLOBAL SEND HOLD** — No outreach can be sent. Emails drafted and ready.

---

## HAVE HVAC (/hvac/) — Outreach Package Prepared

**Status:** OUTREACH DRAFTED (not sent — global send hold)
**Composite Score:** 6.65 | **QA Greenlight:** 10/10 render, 9/10 brand
**Live URL:** https://new-ashtabula-initiative.vercel.app/hvac/

### Target Buyer
- **Organization:** HAVE, Inc. (HAVE Heating and Cooling)
- **Contact:** Rob Schimmelpfennig, President
- **Phone:** 440-998-7252
- **Email:** info@have-inc.com
- **Address:** 2101 Aetna Road, Ashtabula, OH 44004
- **Fit Score:** 96/100

### Brand Strength (9/10)
| Element | Status |
|---------|--------|
| HAVE logo (flame+fan icon) | ✅ Top-left header |
| Address, phone, license | ✅ SERVICE HUB section |
| Coverage areas (18+ cities) | ✅ COVERAGE section |
| NATE Certified | ✅ Info card |
| Est. 1975 | ✅ Info card |
| 24/7 Emergency support | ✅ Info card |
| Bryant Factory Authorized Dealer | ✅ Secondary Trust Cue |
| Color palette (#1E4D8C, #E85A24, #F8F9FA) | ✅ Matches brandkit |
| MVP Value Plan integration | ✅ Built into dispatch form |

### Key Pitch Angles
1. **MVP Value Plan ready** — They already run maintenance agreements. The scheduler extends their existing program digitally.
2. **1975 legacy meets 2026 tech** — A company that's invested in infrastructure (3,000+ sq ft sheet metal shop, Bryant partnership) is ready for this.
3. **Local dispatch context** — Form dropdowns pre-populated with their actual service areas and request types.
4. **24/7 emergency support** — Site highlights their around-the-clock service naturally.

### Next Steps (paused — global outreach hold)
1. [ ] Send outreach email to Rob Schimmelpfennig
2. [ ] Follow up by phone (440-998-7252) if no response in 3 business days
3. [ ] Schedule live demo walkthrough
4. [ ] Close

### Outreach Draft (v1.0 — saved but NOT sent)
- Subject: "Your HAVE-branded HVAC scheduler — it's already built and live"
- Email to: Rob Schimmelpfennig <info@have-inc.com>
- Draft saved in email_prospects/hvac_emails.json
