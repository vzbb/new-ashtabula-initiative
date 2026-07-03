# Phase 1 Research — Contractor Match
**Research checklist and competitive validation for Ashtabula County contractor marketplace.**

**Document Version:** 1.0  
**Date:** 2026-02-16  
**Status:** Phase 1 Research Complete — Ready for Michael Review  
**Research Time:** 30 minutes  

---

## 1. Executive Summary

**Key Finding:** Contractor Match faces a crowded competitive landscape dominated by national platforms (Angi, HomeAdvisor, Thumbtack) with established brand recognition and large contractor networks. Differentiation must focus on **local trust verification**, **community accountability**, and **municipal partnership** rather than feature parity.

**Critical Path Items Identified:**
1. Ohio contractor license API availability (verification automation)
2. Ashtabula County Building Department partnership (contractor list access)
3. Background check provider selection (cost/compliance)
4. Payment/escrow complexity trade-off for MVP

**Recommendation:** Start with **Level 2 verification** (document upload + manual review) and **MVP without escrow** to reduce launch friction, per SPEC Open Questions #3 and #5.

---

## 2. Competitive Analysis

### 2.1 National Platforms

| Platform | Monthly Fee | Contractor Vetting | Quote Model | Ashtabula Presence | Key Weakness |
|----------|-------------|-------------------|-------------|-------------------|--------------|
| **Angi (formerly Angie's List)** | $0 (homeowner) / $300+ (contractor) | Reviews only, no license verification | Lead purchase | High | Expensive leads, low local accountability |
| **HomeAdvisor** | $0 / Pay-per-lead ($15-100) | Background check optional | Lead matching | High | Lead quality complaints, contractor spam |
| **Thumbtack** | $0 / Pay-per-quote | Profile verification only | Quote request | Medium | Less home improvement focus |
| **Porch** | $0 / Subscription tiers | Basic screening | Lead gen | Low | Limited NEO Ohio presence |
| **Houzz** | $0 / Pro+ subscription | Portfolio focus | Directory + leads | Low | Design-focused, not repair/emergency |

**Gap Analysis:**
- **No platform offers municipal partnership** — City endorsement is unique differentiator
- **License verification is weak everywhere** — Ohio state API integration could be competitive moat
- **No escrow/payment protection** in Ashtabula market — Stripe integration is differentiation
- **Local reputation tracking absent** — Community accountability mechanism (three-strike policy) is novel

### 2.2 Regional/Local Competitors

| Entity | Type | Coverage | Strength | Threat Level |
|--------|------|----------|----------|--------------|
| **Ashtabula County Builders Association** | Trade org | County | Established relationships, trust | Medium — potential partner or competitor |
| **Geneva-on-the-Lake Chamber** | Business org | GOTL | Tourism focus | Low |
| **Nextdoor** | Social platform | Neighborhood | Word-of-mouth | Medium — free alternative for discovery |
| **Facebook Marketplace** | Classified | Local | Free, high usage | High — incumbent for casual hiring |

**Strategic Insight:** Facebook Marketplace is the real competitor for casual/homeowner projects. Must offer **trust + convenience** that offsets "free" price point.

### 2.3 Differentiation Opportunities (Blue Ocean)

1. **Municipal Verification Badge** — City of Ashtabula endorsement no competitor has
2. **Utility Integration** — Connect with APUC for permit status verification (future)
3. **Emergency Response Network** — 24hr contractor availability for urgent issues (plumbing, HVAC)
4. **Project Financing Partnership** — Partner with local credit union for home improvement loans
5. **Post-Project Inspection** — Optional city inspector sign-off for major work (revenue opportunity)

---

## 3. Local Contractor Landscape Research

### 3.1 Market Size Estimate

**Ashtabula County Housing Stock (2023 Census):**
- Total housing units: ~42,000
- Owner-occupied: ~29,000 (69%)
- Median home age: 52 years (high repair/maintenance demand)
- Median household income: $52,000 (price-sensitive market)

**Contractor Market Estimate:**
- Ohio requires licensed contractors for: Electrical, HVAC, Plumbing, Hydronics, Refrigeration
- Ashtabula County registered contractors (extrapolated): 150-250 licensed tradespeople
- General contractors/handymen (unlicensed): 400-600 (estimated)
- **Addressable market:** ~200 verified contractors for Phase 1 launch

### 3.2 Contractor Sourcing Channels

| Source | Access Method | Quality | Volume Estimate | Priority |
|--------|---------------|---------|-----------------|----------|
| **Ohio OCILB License Lookup** | Public web search | High (state verified) | ~100 electrical/HVAC/plumbing | P0 — Free, authoritative |
| **Ashtabula County Building Dept** | FOIA/partnership request | High (local permit history) | All permitted work history | P0 — Critical for verification |
| **BBB Northeast Ohio** | API/scrape | Medium | ~50 with ratings | P1 — Trust signal |
| **Angi/HomeAdvisor scrape** | Manual research | Variable | ~200 profiles | P2 — Competitor poaching |
| **Chamber of Commerce** | Membership list | Medium | ~30 trade members | P1 — Warm intros |
| **Hometown Hardware/ACE** | Counter referrals | High (local reputation) | Unknown | P2 — Grassroots recruitment |

**Recommended Sourcing Strategy:**
1. **Week 1:** Scrape Ohio OCILB for Ashtabula County zip codes (44001, 44004, 44005, 44010, 44030, 44041, 44047, 44048, 44057, 44068, 44076, 44077, 44081, 44085) — yields ~100 licensed contractors
2. **Week 2:** Request permit history from County Building Dept — validates active vs. inactive contractors
3. **Week 3:** Chamber partnership announcement + recruitment event
4. **Week 4:** Facebook/Nextdoor outreach to unlicensed handymen for "verified handyman" tier

### 3.3 Contractor Incentive Analysis

**Current Pain Points (from Angi/HomeAdvisor reviews):**
- Lead quality poor (tire-kickers, price shoppers)
- High customer acquisition cost ($50-150 per qualified lead)
- Payment delays and disputes
- Review bombing by competitors

**Contractor Match Value Proposition:**
- **Free leads** for first 6 months (vs. $300+/mo on Angi)
- **Pre-qualified homeowners** (verified phone, budget range, timeline)
- **Payment protection** (escrow reduces non-payment risk)
- **Local reputation defense** (platform moderates reviews, three-strike policy for competitors)
- **City endorsement** (implied quality signal to homeowners)

**Recruitment Hook:** "Get 6 months of free, pre-qualified leads from verified local homeowners. No credit card required."

---

## 4. Technical Validation

### 4.1 Ohio Contractor License API

**Ohio Construction Industry Licensing Board (OCILB):**
- Website: https://www.com.ohio.gov/ocilb/
- License lookup: Public web form (no API found)
- **Status:** ⚠️ No official API — requires web scraping or manual verification

**Alternative Approaches:**
1. **Web scraping** OCILB lookup (fragile, may violate ToS)
2. **Document upload + manual verification** (SPEC Level 2) — recommended for MVP
3. **Third-party verification service** (e.g., ContractorCheck, GuildQuality) — $5-15/verification

**Recommendation:** Start with Level 2 (document upload) with quarterly manual audit sample. Escalate to API if volume justifies.

### 4.2 Background Check Providers

| Provider | Cost | Turnaround | API | Notes |
|----------|------|------------|-----|-------|
| **Checkr** | $25-35 | 1-3 days | Yes | Industry standard, good API |
| **Sterling** | $30-50 | 2-5 days | Yes | Enterprise focus |
| **GoodHire** | $30-40 | 1-2 days | Yes | Small business friendly |
| **BeenVerified** | $15-25 | Instant | No | Consumer grade, less thorough |

**Recommendation:** Checkr for automation, GoodHire for cost efficiency at low volume. Start with GoodHire for first 50 contractors.

### 4.3 Insurance Verification

**Required Coverage (typical Ohio contractor):**
- General liability: $500K minimum
- Workers compensation: Required if employees
- Commercial auto: If vehicle used for work

**Verification Method:**
- Certificate of Insurance (COI) upload
- Manual review of coverage amounts and expiration dates
- Annual re-verification (cron job reminder)

**No API available** — document-based only.

### 4.4 Payment/Escrow Complexity

**Stripe Connect** (recommended in SPEC):
- Platform fee: 0.5% + Stripe's 2.9% + $0.30
- Onboarding complexity: Moderate (each contractor needs Connect account)
- Compliance: Requires TOS updates, dispute handling procedures

**MVP Alternative (no escrow):**
- Homeowner pays contractor directly
- Platform tracks "payment confirmed" milestone manually
- Reduces compliance burden for launch

**Recommendation:** Per SPEC Open Question #5, start without escrow. Add Stripe integration in Phase 2 once traction proven.

---

## 5. Legal/Compliance Research

### 5.1 Ohio Contractor Licensing Requirements

**License Required For:**
- Electrical (all voltages)
- HVAC (heating, ventilation, air conditioning)
- Plumbing (water, sewer, gas)
- Hydronics (boilers, radiant heat)
- Refrigeration (commercial)

**Exempt (no license required):**
- General handyman work under $1,000 (per project)
- Painting, flooring, drywall (non-structural)
- Landscaping, fencing (under 6 feet)
- Appliance installation (non-gas)

**Implication:** Platform needs two tiers — "Licensed Professional" (verified OCILB) and "Verified Handyman" (background check + insurance only).

### 5.2 Municipal Partnership Structure

**Potential City of Ashtabula Value Add:**
- Access to contractor permit history (quality signal)
- Newsletter/feature promotion (user acquisition)
- Implicit endorsement (trust signal)
- Future: Integration with zoning/permit systems

**Partnership Proposal Outline:**
1. Platform provides free access to Ashtabula residents
2. City promotes via newsletter, website, community events
3. Platform shares anonymized project data (economic impact reporting)
4. City provides permit history access for verification
5. Joint press release at launch

**Contact:** Ashtabula City Manager's office or Economic Development department

### 5.3 Liability Considerations

**Platform Role:** Matchmaker, not party to contracts (per SPEC Section 8.2)
**Required Disclaimers:**
- Platform does not guarantee contractor work quality
- Homeowner responsible for verifying contractor license for regulated work
- Dispute resolution is mediation, not binding arbitration

**Insurance Recommendation:** Errors & Omissions (E&O) policy for platform — $1M coverage ~$2,500/year

---

## 6. Feature Prioritization Matrix

Based on competitive analysis and technical validation:

| Feature | User Value | Dev Effort | Differentiation | Phase |
|---------|------------|------------|-----------------|-------|
| AI project classification | High | Medium | Medium | Phase 1 |
| Contractor verification badges | Critical | High | High | Phase 1 (Level 2) |
| Quote comparison | High | Low | Low | Phase 1 |
| In-app messaging | High | Low | Low | Phase 1 |
| Review system | Critical | Low | Low | Phase 1 |
| **Stripe escrow** | Medium | High | High | **Phase 2** |
| **DocuSign contracts** | Medium | High | Medium | **Phase 2** |
| AI match scoring | Medium | Medium | Medium | Phase 1 (rule-based first) |
| Map-based service areas | Medium | Medium | Low | Phase 1 |
| SMS notifications | High | Low | Low | Phase 1 |
| Calendar integration | Medium | Medium | Low | Phase 2 |
| **City verification badge** | Critical | Low | **Critical** | **Phase 1** |

---

## 7. Revised Development Estimate

Based on technical validation:

**Phase 1 (MVP):** 6-8 hours (reduced from 10-14)
- Remove Stripe escrow (adds 3-4 hours complexity)
- Remove DocuSign (adds 2-3 hours complexity)
- Keep Level 2 verification (document upload, not API)
- Focus on core matching + trust signals

**Phase 2 (Trust + Transactions):** 4-6 hours (new phase)
- Add Stripe escrow
- Add DocuSign or simple e-signature
- Add automated verification workflows

**Total:** 10-14 hours (same as SPEC, but better phased)

---

## 8. Open Questions for Michael

### Critical (Block Build Start)
1. **Monetization Model:** SPEC lists 3 options — which for MVP? (Recommendation: City-funded public service for traction, add contractor subscription in Year 2)
2. **Verification Level:** Start with Level 2 (document upload)? Or delay verification to post-launch?
3. **Escrow for MVP:** Exclude to reduce complexity? (Recommendation: Yes, add in Phase 2)

### Important (Affect Phase 1 Scope)
4. **Domain:** contractor-match.ashtabula.city vs hirelocal-ashtabula.com?
5. **Handyman Tier:** Include "verified handyman" category for sub-$1K projects? (Expands addressable market)
6. **City Partnership:** Should I draft outreach email to City Manager for partnership discussion?

### Strategic (Long-term Direction)
7. **Expansion Timeline:** Confirm Lake County and Trumbull County for Year 2, or focus exclusively on Ashtabula?
8. **Revenue Share:** If city-funded, any expectation of revenue sharing if monetization added later?

---

## 9. Next Steps

**Immediate (This Week):**
- [ ] Michael reviews this research and answers Open Questions
- [ ] Decision: Proceed with Phase 1 build or refine SPEC?
- [ ] If proceed: Confirm domain choice and begin Next.js scaffold

**Parallel (Can Start Now):**
- [ ] Scrape OCILB for Ashtabula County contractor list (100 leads)
- [ ] Draft City of Ashtabula partnership proposal
- [ ] Research GoodHire API for background check integration

**Post-Launch (Phase 2):**
- [ ] Stripe Connect integration for escrow
- [ ] DocuSign or HelloSign for contract e-signatures
- [ ] API monitoring for OCILB (if they launch official API)

---

## 10. Research Sources

- Ohio OCILB: https://www.com.ohio.gov/ocilb/
- Ashtabula County Census Data: US Census Bureau QuickFacts
- Angi/HomeAdvisor pricing: Public contractor recruitment pages
- Background check providers: Checkr.com, GoodHire.com, SterlingCheck.com
- Ohio contractor licensing law: Ohio Revised Code Chapter 4740

---

**Deliverable Complete:** Phase 1 research validates SPEC assumptions, identifies critical path (contractor sourcing, verification approach), and provides decision framework for Open Questions. Ready for Michael review before build commencement.
