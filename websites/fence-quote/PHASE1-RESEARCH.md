# Fence Quote — Phase 1 Research
## Instant Fencing Quote Tool for Ashtabula County

**Date:** February 19, 2026  
**Status:** Phase 1 Research  
**Next:** Phase 2 Resource Procurement

---

## 1. Problem Statement

### The Pain Point
Fencing contractors in Ashtabula County face inefficient quoting processes:
- **Site visits required** for every quote — time-consuming, costly
- **Phone tag** with homeowners — multiple calls to get basic info
- **Inconsistent pricing** — quotes vary based on who's calculating
- **Delayed responses** — homeowners wait days for quotes, lose interest
- **No-shows** — contractors drive to sites for homeowners who aren't serious

### Impact on Contractors
- Wasted time on unqualified leads
- Lost business to faster-responding competitors
- Inefficient scheduling (site visits scattered across county)
- Difficulty scaling beyond word-of-mouth

### Impact on Homeowners
- Frustrating process to get basic pricing
- Unclear what factors affect cost
- Can't easily compare options (materials, heights, styles)
- No transparency on timeline

---

## 2. Market Analysis

### Target Market Size
**Ashtabula County Fencing Market:**
- **Housing units:** ~45,000 (owner-occupied ~32,000)
- **Fencing demand drivers:**
  - Pool installations (safety code requirements)
  - Pet owners (dog containment)
  - Privacy needs (suburban/rural properties)
  - Property boundary disputes
  - Agricultural fencing (rural areas)

**Annual Market Estimate:**
- Residential fence installations: 800-1,200/year
- Average project value: $3,000-$8,000
- Total addressable market: $2.4M - $9.6M annually

### Local Competitors (Fencing Contractors)

| Company | Location | Specialties | Online Presence |
|---------|----------|-------------|-----------------|
| **Ashtabula Fence Co.** | Ashtabula | Residential, commercial | Basic website |
| **Geneva Fence** | Geneva | Wood, vinyl, chain-link | Facebook only |
| **Lake County Fence** | Madison | All types | Minimal |
| **Chardon Fence** (serves area) | Chardon | High-end residential | Good website |
| **Lowe's Installation** | Ashtabula | Big-box referral | Online quotes limited |
| **Home Depot Services** | Ashtabula | Big-box referral | Limited customization |

**Gap:** None offer instant online quoting with accurate local pricing.

### Local Stakeholders

**Fencing Contractors (Primary Users):**
| Company | Type | Service Area | Est. Volume |
|---------|------|--------------|-------------|
| Ashtabula Fence Co. | Local | County-wide | Medium |
| Geneva Fence | Local | Eastern county | Small |
| Lake County Fence | Local | Western county | Small |
| Independent installers | Solo | Variable | 10-15 operators |

**Secondary Users:**
- Pool companies (subcontract fence work)
- Landscaping companies (fence as add-on)
- Property management companies (multi-unit fencing)

---

## 3. Competitor Analysis

### National Quote Tools

| Competitor | Model | Strengths | Weaknesses | Local Gap |
|------------|-------|-----------|------------|-----------|
| **FenceCalc.com** | Calculator only | Free, instant | No contractor connection | No local pricing |
| **HomeAdvisor** | Lead gen | Wide reach | Expensive leads ($45-85), shared | No instant quote |
| **Thumbtack** | Lead gen | Large network | Competitive, fees | No self-service quoting |
| **ImproveNet** | Calculator + leads | Educational | Generic pricing | Inaccurate for Ashtabula |
| **Contractor websites** | Contact forms | Direct | No instant response | No automation |

### What Exists Locally
- **Nothing** — No dedicated instant quote tool for Ashtabula County
- Contractors rely on:
  - Phone/email contact forms
  - Facebook messages
  - Word of mouth
  - Yard signs/driving by

### Gap Analysis
**✓ Opportunity Confirmed:**
- No instant quote tool exists for local market
- National calculators use generic pricing (not Ashtabula-specific)
- Lead gen services are expensive and don't provide instant gratification
- Contractors want qualified leads, not just more calls

---

## 4. User Personas

### Persona 1: "Contractor Carl" (Fencing Business Owner)
- **Demographics:** 35-55, owns small fencing company (2-5 employees)
- **Business:** 100-200 jobs/year, mostly residential
- **Tech comfort:** Moderate (uses smartphone, basic computer)
- **Pain points:**
  - Drives 30+ min for quotes that don't convert
  - Spends evenings doing estimates instead of family time
  - Can't compete with big-box stores' response times
- **Needs:** Qualified leads, automated quoting, route optimization

### Persona 2: "Homeowner Hannah" (Residential Customer)
- **Demographics:** 30-50, suburban homeowner
- **Project:** Privacy fence for backyard (pool, pets, or privacy)
- **Tech comfort:** High
- **Pain points:**
  - Just wants ballpark pricing before committing to site visit
  - Doesn't know wood vs. vinyl cost difference
  - Frustrated waiting days for contractors to respond
- **Needs:** Instant pricing, material comparisons, clear next steps

### Persona 3: "Property Manager Pete" (Commercial User)
- **Demographics:** 40-60, manages 50+ rental units
- **Projects:** Ongoing fence repairs, occasional full replacements
- **Tech comfort:** Moderate
- **Pain points:**
  - Needs quick quotes for budget planning
  - Multiple properties across county
  - Repeat work with same specifications
- **Needs:** Volume pricing, quick turnaround, reliable timeline

### Persona 4: "Pool Installer Paul" (Trade Partner)
- **Demographics:** 35-50, pool installation company
- **Projects:** 20-30 pools/year, each needs safety fence
- **Tech comfort:** Moderate
- **Pain points:**
  - Subcontract fence work, needs reliable partner
  - Customers want fence quote with pool quote
  - Code compliance requirements vary by township
- **Needs:** Quick turnaround, code expertise, partnership terms

---

## 5. Solution Concept

### Core Concept
**"Instant fencing quotes that qualify leads before you drive — saving contractors time and homeowners frustration."**

### Key Features

**For Homeowners (Public-Facing):**
1. **Interactive Property Mapper** — Draw fence line on satellite imagery
2. **Material Selector** — Compare wood, vinyl, chain-link, aluminum with pricing
3. **Instant Quote** — Real estimate based on linear feet + material + options
4. **Visual Preview** — See fence style/color on property photo
5. **Book Site Visit** — Schedule with contractor if quote looks right

**For Contractors (Dashboard):**
1. **Lead Management** — Qualified leads with quote details
2. **Pricing Control** — Set per-foot rates by material
3. **Service Area Map** — Define where you'll travel
4. **Quote Templates** — Customizable for common scenarios
5. **Analytics** — Conversion rates, popular materials, peak seasons

### Differentiation

| Feature | Fence Quote Tool | National Calculators | HomeAdvisor |
|---------|------------------|---------------------|-------------|
| Instant pricing | ✓ Local rates | ✓ Generic | ✗ |
| Visual mapping | ✓ | ✗ | ✗ |
| Contractor-specific | ✓ | ✗ | ✓ (expensive) |
| Material comparison | ✓ Detailed | ✓ Basic | ✗ |
| Qualified leads | ✓ Pre-priced | ✗ | ✓ Cold leads |
| Ashtabula-specific | ✓ | ✗ | ✗ |

---

## 6. Tech Stack Options

### Recommended: Next.js + Supabase + Google Maps
- **Frontend:** Next.js 14, Tailwind CSS, React-Leaflet (mapping)
- **Database:** Supabase (PostgreSQL)
- **Mapping:** Google Maps API or Mapbox
- **Storage:** Supabase Storage (fence photos, permits)
- **Auth:** Supabase Auth (contractor accounts)
- **Hosting:** Vercel
- **Cost:** ~$30-60/mo (scales with usage)

### Alternative: No-Code + Integration
- **Platform:** Webflow or Bubble
- **Mapping:** Embedded Google Maps
- **Cost:** ~$40-80/mo
- **Pros:** Faster build
- **Cons:** Limited customization for mapping features

---

## 7. Revenue Model

### Tiered Pricing for Contractors

| Tier | Price | Features | Target |
|------|-------|----------|--------|
| **Free** | $0 | 5 quotes/month, basic listing | New contractors |
| **Pro** | $79/mo | Unlimited quotes, priority listing, analytics | Solo operators |
| **Business** | $199/mo | Multi-user, API access, white-label | 5+ employee companies |
| **Enterprise** | Custom | CRM integration, custom fields, support | Regional chains |

### Lead Generation Revenue
- **Premium placement:** $25/lead for top 3 spots
- **Instant booking fee:** $10/booking (optional)

### Example Economics (Pro tier contractor):
- Monthly subscription: $79
- 20 qualified leads/month
- 40% conversion rate = 8 jobs
- Average job: $5,000
- Revenue: $40,000
- Cost per job acquired: $9.88
- **ROI: 50,500%**

---

## 8. Implementation Roadmap

### Phase 1: MVP (Weeks 1-4)
- [ ] Build quote calculator (linear feet × material rate)
- [ ] Basic contractor profiles (3-5 pilot contractors)
- [ ] Simple contact form → email notification
- [ ] Mobile-responsive design
- [ ] Deploy with 1 pilot contractor

### Phase 2: Feature Complete (Weeks 5-8)
- [ ] Interactive mapping (draw fence line)
- [ ] Material comparison tool
- [ ] Contractor dashboard with analytics
- [ ] Online booking/scheduling
- [ ] Onboard 5-10 contractors

### Phase 3: Scale (Weeks 9-12)
- [ ] Visual fence preview (overlay on property photo)
- [ ] Township code lookup (setback requirements)
- [ ] Permit requirement checker
- [ ] Customer reviews/ratings
- [ ] Marketing to homeowners

### Phase 4: Expansion (Months 4-6)
- [ ] Expand to Lake, Geauga counties
- [ ] Commercial/gate automation quotes
- [ ] Agricultural fencing options
- [ ] Trade partner portal (pool companies, landscapers)

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Contractors don't want to share pricing | Medium | High | Start with free tier, prove value |
| Quotes inaccurate vs. actual site conditions | High | Medium | Clear disclaimers, "estimate only" |
| Homeowners price-shop without intent | Medium | Medium | Qualifying questions, deposit required |
| Mapping API costs | Low | Low | Cache imagery, optimize calls |
| Seasonal demand (winter slow) | High | Low | Focus on planning/booking for spring |

---

## 10. Open Questions for Phase 2

### Contractor Research
1. [ ] Will Ashtabula Fence Co. share their per-foot pricing?
2. [ ] What's the average closing rate from quote to job?
3. [ ] How far will contractors travel for a job?
4. [ ] What percentage of quotes are "tire kickers"?
5. [ ] Do contractors want deposits before site visits?

### Technical Research
6. [ ] Which mapping API is most cost-effective (Google vs. Mapbox)?
7. [ ] Can we access township setback requirements via API?
8. [ ] Should we integrate with QuickBooks or other contractor software?

### Market Validation
9. [ ] What do homeowners expect from an "instant quote"?
10. [ ] Would pool companies use this for subcontractor quotes?

---

## 11. Success Metrics

### 90-Day Targets
- [ ] 3-5 pilot contractors onboarded
- [ ] 100+ quote requests generated
- [ ] 20% quote-to-site-visit conversion
- [ ] $50,000+ in quoted projects
- [ ] 4.5+ star contractor satisfaction

### 6-Month Targets
- [ ] 15+ contractors using platform
- [ ] 500+ quotes/month
- [ ] Expand to 2 adjacent counties
- [ ] $5,000+ MRR from subscriptions

---

## 12. Next Steps (Phase 2)

### Immediate Actions
1. **Contact pilot contractors**
   - [ ] Ashtabula Fence Co. — ??? (need phone)
   - [ ] Geneva Fence — ??? (need phone)
   - [ ] Lake County Fence — ??? (need phone)

2. **Competitor pricing research**
   - [ ] Call 3 contractors as mystery shopper
   - [ ] Document current quoting process
   - [ ] Gather per-foot pricing ranges

3. **Technical validation**
   - [ ] Set up Google Maps API account
   - [ ] Test property boundary detection
   - [ ] Build simple calculator prototype

4. **Homeowner validation**
   - [ ] Survey 10 homeowners about fencing plans
   - [ ] Ask about biggest frustrations with current process

---

## Appendix A: Fencing Types & Typical Pricing

### Material Types (Ashtabula Market Estimates)
| Material | Cost/Linear Ft | Pros | Cons | Best For |
|----------|---------------|------|------|----------|
| **Wood (Pressure-Treated)** | $15-25 | Natural look, affordable | Maintenance, rotting | Privacy, traditional homes |
| **Vinyl** | $25-40 | Low maintenance, durable | Higher cost, limited styles | Long-term value |
| **Chain-Link** | $10-18 | Affordable, durable | Industrial look | Security, pets, budget |
| **Aluminum** | $30-50 | Decorative, rust-proof | Expensive | Pool enclosures, ornamental |
| **Wrought Iron** | $40-70 | Premium look, secure | Very expensive, rusts | Estate homes, security |

### Common Heights
- 4' — Pool code compliance, decorative
- 6' — Privacy (most common)
- 8' — Maximum privacy, security

### Additional Costs
- Gates: $200-800 each (varies by size/material)
- Posts: Every 6-8 feet
- Removal of old fence: $3-8/linear foot
- Grade changes/hills: +10-30%

---

**Document Status:** Phase 1 Complete — Ready for Phase 2 Resource Procurement
**Next Deliverable:** PHASE2-RESOURCES.md (contact database, pricing research, outreach templates)
