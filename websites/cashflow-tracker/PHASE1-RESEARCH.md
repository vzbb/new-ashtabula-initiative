# Cashflow Tracker — Phase 1 Research Report
**Date:** 2026-02-18  
**Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)

---

## 1. Problem Statement

### Core Problem
Small businesses in Ashtabula County lack accessible tools to manage cash flow, creating unnecessary financial stress and business failures that could be prevented with better visibility into income and expenses.

### Why It Matters
- **Cash flow is the #1 reason small businesses fail** — 82% of business failures are tied to cash flow mismanagement (U.S. Bank study)
- **Seasonal economy** — Ashtabula's tourism-driven economy creates feast-or-famine cycles for many businesses
- **Limited access to financial expertise** — Most small businesses cannot afford CFO services or complex enterprise tools
- **Grant and loan dependency** — Many local businesses rely on RLF (Revolving Loan Fund) and SBA assistance, requiring financial documentation

### Current Pain Points
1. **Reactive management** — Owners discover cash problems after it's too late
2. **Spreadsheet chaos** — DIY solutions break, get out of sync, or require expertise
3. **Accounting software complexity** — QuickBooks, Xero are overkill for simple cash monitoring
4. **No local context** — Generic tools don't understand Ashtabula's seasonal patterns
5. **Cost barrier** — Existing solutions start at $50-100/month, prohibitive for micro-businesses

---

## 2. Competitor Analysis

### Enterprise/Complex Solutions

| Tool | Price | Best For | Key Features | Weaknesses |
|------|-------|----------|--------------|------------|
| **Agicap** | Custom/$$$ | Mid-market | AI forecasting, bank integration, scenario planning | Overkill for small biz; custom pricing only |
| **HighRadius** | Enterprise $$$ | Large corps | Treasury management, collections automation | Complex implementation, dedicated staff needed |
| **Kyriba** | Enterprise $$$ | Global corps | Multi-currency, complex treasury | Requires treasury expertise |
| **OneStream** | $$$ | Large orgs | FP&A, consolidation | High cost, long implementation |

### SMB-Focused Solutions

| Tool | Price | Best For | Key Features | Weaknesses |
|------|-------|----------|--------------|------------|
| **Float** | $59-199/mo | Small business | Simple forecasting, Xero/QB sync | Still pricey; no Ashtabula context |
| **Tidely** | €55+/mo ($60+) | SMB liquidity | Real-time cash position, team access | EU-focused; limited US bank support |
| **Centime** | $$ | AR/AP focus | Credit management, collections | Narrow focus on receivables only |
| **YayPay** | $$ | AR automation | Collections workflow | Narrow focus; mid-market pricing |

### Free/Low-Cost Alternatives

| Tool | Price | Limitations |
|------|-------|-------------|
| **Excel/Google Sheets** | Free | Manual, error-prone, no automation |
| **Wave Accounting** | Free | Basic accounting, no cash flow forecasting |
| **Mint (personal)** | Free | Not business-focused; discontinued soon |
| **Pumpkin/CountAbout** | $10-15/mo | Personal finance tools adapted poorly |

### Market Gap Analysis
**Critical Finding:** No tool exists that is:
- **Free or ultra-low cost** (<$20/mo)
- **Designed for micro-businesses** (<10 employees)
- **Seasonal-aware** (understands tourism cycles)
- **Ashtabula-specific** (local context, local support)
- **Simple to use** (no accounting background needed)

---

## 3. User Personas

### Persona 1: "Seasonal Sarah" — Tourism Business Owner
- **Business:** Gift shop on The Strip (GOTL)
- **Employees:** 2-4 seasonal
- **Pain:** Makes 70% of revenue May-September, struggles to budget for winter
- **Needs:** Visual seasonal forecasting, expense smoothing suggestions, winter survival calculator
- **Tech comfort:** Moderate (uses Facebook, avoids spreadsheets)

### Persona 2: "Startup Marcus" — New Entrepreneur
- **Business:** Home-based service (landscaping, repair)
- **Employees:** Just himself
- **Pain:** Unpredictable income, doesn't know if he can afford tools/equipment
- **Needs:** Simple cash-in/cash-out tracking, break-even calculator, goal setting
- **Tech comfort:** High (smartphone native)

### Persona 3: "Growth Jennifer" — Expanding Business
- **Business:** Restaurant/café considering second location
- **Employees:** 8-12
- **Pain:** Needs cash flow documentation for loans, current system is chaotic
- **Needs:** Professional reports, lender-ready projections, scenario planning
- **Tech comfort:** Moderate (uses QuickBooks but doesn't understand it)

### Persona 4: "Resource Robert" — Nonprofit Coordinator
- **Organization:** Small community nonprofit
- **Budget:** Grant-dependent, irregular funding cycles
- **Pain:** Grant reporting requirements, need to show fiscal responsibility
- **Needs:** Grant period tracking, donor reporting, board-ready dashboards
- **Tech comfort:** Low-Moderate

---

## 4. Data Sources & Integrations

### Bank/Financial Data
- **Plaid API** — Bank account connection (2,000+ institutions)
- **Yodlee** — Alternative bank aggregation
- **Manual entry** — Fallback for unsupported banks

### Local Economic Context
- **Ashtabula Growth Partnership** — Economic indicators, business climate data
- **Tourism Council** — Seasonal visitor patterns, event calendars
- **Historical weather data** — Correlate with seasonal business patterns

### Benchmark Data
- **SBDC Ohio** — Small business financial benchmarks by industry
- **Bureau of Labor Statistics** — Local wage and employment data
- **Census Bureau** — Demographic and spending data

### Potential Partnerships
| Organization | Role | Contact Path |
|--------------|------|--------------|
| **Growth Partnership** | Business outreach, validation | ashtabulagrowth.com |
| **SBDC at YSU** | Training integration, referrals | sbdc-ysu.org |
| **NEO Fund** | Capital connection, user testing | neofund.org |
| **Local Chambers** (3) | Distribution, credibility | Conneaut, Geneva, Ashtabula |
| **City Revolving Loan Fund** | Required tool for borrowers | City of Ashtabula Economic Dev |

---

## 5. Stakeholder Mapping

### Primary Stakeholders (Direct Benefit)
1. **Small business owners** — End users
2. **Bookkeepers/accountants** — May recommend to clients
3. **SBDC advisors** — Can incorporate into counseling

### Secondary Stakeholders (Ecosystem)
1. **Ashtabula Growth Partnership** — Economic development alignment
2. **Banks/lenders** — Tool for loan applicants
3. **Grant funders** — Reporting requirement satisfaction
4. **Chambers of Commerce** — Member benefit offering

### Potential Champions
- **Local accountants serving small biz** — Natural advocates
- **SCORE mentors** — Tool to recommend to mentees
- **Jumpstart Inc.** (via Growth Partnership) — Startup ecosystem

---

## 6. Technical Feasibility

### MVP Features (P0)
1. **Manual cash entry** — Income/expense tracking without bank connection
2. **Simple forecasting** — 30/60/90 day cash projection
3. **Visual dashboard** — Charts showing cash position over time
4. **Category tagging** — Basic expense categorization
5. **Export to CSV** — For accountants/bookkeepers

### Phase 2 Features (P1)
1. **Plaid integration** — Automatic bank sync
2. **Seasonal insights** — Compare to prior years, local benchmarks
3. **Goal tracking** — Save for equipment, expansion, slow season
4. **Mobile app** — iOS/Android native or PWA
5. **Multi-user** — Bookkeeper/accountant access

### Phase 3 Features (P2)
1. **AI insights** — Anomaly detection, spending suggestions
2. **Lender integration** — One-click loan application prep
3. **Peer benchmarking** — Anonymous comparison to similar local businesses
4. **Grant tracking** — Specific modules for grant compliance

### Technical Stack Options
**Option A: Simple/Fast (MVP)**
- Frontend: Next.js + Tailwind
- Backend: Supabase (PostgreSQL + Auth)
- Charts: Recharts or Chart.js
- Hosting: Vercel
- Bank sync: Plaid (Phase 2)

**Option B: Firebase (Aligned with other projects)**
- Frontend: React + Tailwind
- Backend: Firebase (Firestore, Auth, Functions)
- Charts: Chart.js
- Hosting: Firebase Hosting
- Bank sync: Plaid

---

## 7. Differentiation Strategy

### vs. Paid Competitors
| Competitor | Their Price | Our Position |
|------------|-------------|--------------|
| Float | $59-199/mo | **FREE tier** — Basic tracking always free |
| Tidely | $60+/mo | **Local context** — Ashtabula seasonality built-in |
| Agicap | Custom/$$$ | **Simplicity** — No training required |
| QuickBooks | $30-200/mo | **Focused** — Just cash flow, not full accounting |

### Unique Value Propositions
1. **"Built for Ashtabula"** — Seasonal tourism patterns, local support
2. **"Free Forever" tier** — Basic tracking at no cost
3. **"Lender-Ready Reports"** — One-click export for RLF, SBA loans
4. **"Zero Learning Curve"** — If you can use a phone, you can use this
5. **"Local Support"** — In-person help via SBDC partnership

### Potential Monetization (Phase 3+)
- **Free tier:** Manual entry, 30-day forecast, basic dashboard
- **Pro tier ($9/mo):** Bank sync, unlimited history, reports
- **Business tier ($19/mo):** Multi-user, API access, priority support
- **White-label:** Offer to other rural counties

---

## 8. Risk Assessment

### High Risk
| Risk | Impact | Mitigation |
|------|--------|------------|
| **Bank API costs** | Plaid charges per connection | Start manual-only; add Plaid at Pro tier |
| **Low adoption** | Effort wasted | Partner with SBDC for direct distribution |
| **Data security** | Breach destroys trust | Use established providers (Supabase/Firebase), SOC-2 |

### Medium Risk
| Risk | Impact | Mitigation |
|------|--------|------------|
| **Scope creep** | Becomes accounting tool | Strict focus: cash flow ONLY |
| **Seasonal miscalculation** | Wrong predictions | Use 3+ years historical data |
| **Competitor response** | Float adds free tier | Differentiate via local context |

### Low Risk
| Risk | Impact | Mitigation |
|------|--------|------------|
| **Maintenance burden** | Ongoing costs | Open source core, community contributions |
| **Legal/accounting liability** | Bad advice given | Disclaimers, educational focus only |

---

## 9. Open Questions (Phase 2 Blockers)

### Critical (Must Answer)
1. **Would SBDC/YSU partner to distribute?** — Channel viability
2. **Do local accountants want this for clients?** — Professional validation
3. **What do businesses currently use?** — Competitive alternative reality
4. **Is Plaid cost-prohibitive for free tier?** — Pricing model validation
5. **Would Growth Partnership endorse?** — Credibility and reach

### Important (Should Answer)
6. **How many businesses would actually use this?** — Market size validation
7. **What specific reports do lenders want?** — Feature prioritization
8. **Are there existing tools we should integrate with?** — Integration strategy

### Nice to Know
9. **Would other rural counties want this?** — Expansion potential
10. **Can we get anonymized benchmark data?** — Feature enhancement

---

## 10. Recommended Next Steps (Phase 2)

### Week 1: Stakeholder Outreach
- [ ] Email SBDC at YSU (partnership inquiry)
- [ ] Email Growth Partnership (endorsement request)
- [ ] Contact 2-3 local accountants (validation interviews)

### Week 2: User Research
- [ ] Survey 10-15 small business owners about current cash flow practices
- [ ] Interview 3 business owners in-depth
- [ ] Document current tools used (spreadsheets, QuickBooks, nothing)

### Week 3: Technical Validation
- [ ] Test Plaid API costs and integration complexity
- [ ] Verify Supabase/Firebase pricing for projected user load
- [ ] Create simple prototype wireframes for user testing

### Week 4: Specification
- [ ] Write SPEC.md with finalized feature set
- [ ] Define database schema
- [ ] Create BUILD_CHECKLIST.md

---

## 11. Related Opportunities

### Synergies with Other Ashtabula Tools
- **grantgenius** — Cash flow helps grant compliance; shared user base
- **service-scheduler** — Booking revenue feeds into cash flow
- **contractor-match** — Contractor income tracking
- **eligibility-lite/pro** — Financial data enables benefit screening

### Expansion Possibilities
- **Personal finance version** — For gig workers/side hustles
- **Agricultural variant** — Crop planning + cash flow for farmers
- **Nonprofit-specific** — Grant period management
- **Regional rollout** — Trumbull, Lake, Geauga counties

---

## 12. Success Metrics

### Phase 1 (MVP Launch)
- 50+ registered businesses
- 70% of users track at least 10 transactions
- Average 4+ logins per month

### Phase 2 (Growth)
- 200+ active businesses
- 20% upgrade to Pro tier
- SBDC refers 30% of clients

### Phase 3 (Maturity)
- 500+ businesses in Ashtabula County
- White-label deployed in 2+ other counties
- Featured in local business press

---

**Document Status:** Phase 1 Complete — Ready for Phase 2 Resource Procurement  
**Next Action:** Outreach to SBDC and Growth Partnership for partnership discussions
