# Phase 1 Research — Curbside Pickup Tracker
## New Ashtabula Initiative

**Date:** February 19, 2026  
**Researcher:** Rondell / Noirsys AI  
**Status:** Complete — Ready for Phase 2 Stakeholder Outreach

---

## Executive Summary

The **Curbside Pickup Tracker** is positioned to address a critical gap in Ashtabula County's local business infrastructure. While national chains (Walmart, Target, ALDI) offer sophisticated curbside pickup, independent restaurants and retailers in Ashtabula lack affordable, easy-to-implement solutions. The BOPIS (Buy Online, Pick Up In-Store) market reached $140 billion by 2024, yet small businesses remain underserved by existing solutions that require customer app downloads, complex integrations, or high monthly fees.

**Key Finding:** There is a clear blue-ocean opportunity for a lightweight, SMS-based curbside coordination tool specifically designed for small-town independent businesses that cannot justify $300-500/month enterprise solutions.

---

## 1. Market Landscape Analysis

### 1.1 Market Size & Growth

| Metric | Value | Source |
|--------|-------|--------|
| BOPIS Market Size (2024) | $140 billion | Verizon Business Analysis |
| Curbside Growth (2019-2020) | +208% | Adobe Analytics |
| Consumer Preference for Curbside | 41% abandonment due to complicated checkout | Baymard Institute |
| Post-Pandemic Retention | Curbside remains "highly favorable" beyond pandemic | Nextdoor Research |

**Market Insight:** The pandemic permanently shifted consumer expectations. Customers now expect curbside convenience as standard, but small businesses lack the technical resources to implement it effectively.

### 1.2 Competitive Landscape

#### Direct Competitors

| Competitor | Pricing Model | Key Features | Limitations for Small Business |
|------------|---------------|--------------|-------------------------------|
| **SWIPEBY** | $0.99/order OR $58/month + ~4% fee | Geofenced arrival, predictive traffic, customer app | Requires customers to download app; $58/month minimum |
| **SimpleTexting** | $29/month base | SMS notifications, two-way messaging, no app needed | No geofencing; separate from ordering system |
| **FlyBuy** | Pricing on request | Real-time location sharing, staff dashboard | Requires location-beacon hardware; complex setup |
| **Zapiet** | $20/month + Shopify required | Shopify POS integration, multi-location inventory | Requires Shopify; no SMS notifications |
| **Curbspot** | $79/month | Email/SMS alerts, cloud-based, 1-hour setup | Limited feature transparency; no geofencing |

#### Indirect Competitors

| Platform | Role | Gap |
|----------|------|-----|
| **DoorDash** | Delivery marketplace | No curbside coordination; 15-30% commission |
| **UberEats** | Delivery marketplace | No curbside coordination; high fees |
| **Square POS** | Payment/ordering | Basic pickup notifications; limited curbside features |
| **Toast** | Restaurant POS | Integrated ordering; expensive for small operators |

### 1.3 Competitive Gap Analysis

**The Critical Gap:** All existing solutions fall into one of two categories:
1. **Enterprise-level** ($79-500/month): Feature-rich but cost-prohibitive for small businesses
2. **Delivery marketplaces** (15-30% commission): Expensive, don't support true curbside coordination

**Opportunity:** A solution that offers:
- No customer app required (SMS-based)
- Under $50/month pricing
- Simple 15-minute setup
- Works with existing phone/ordering systems
- Specifically designed for small-town business constraints

---

## 2. Local Market Analysis — Ashtabula County

### 2.1 Current Curbside Landscape

**National Chains with Curbside:**
| Business | Location | Curbside Status |
|----------|----------|-----------------|
| Walmart | 2359 Ashtabula | ✅ Full curbside via Walmart app |
| ALDI | 3124 North Ridge East | ✅ Curbside pickup available |
| Target | (nearby) | ✅ Drive Up Returns + Pickup |

**Independent Businesses Mentioning Curbside:**
| Business | Location | Notes |
|----------|----------|-------|
| Fat Sally's Warehouse | 1569 Laird Drive, Ashtabula | Facebook lists "Curbside pickup" |

**Observation:** Independent businesses have minimal curbside presence compared to chains.

### 2.2 Addressable Market

**Restaurants (Ashtabula County):**
- Geneva-on-the-Lake: 25+ restaurants (TripAdvisor)
- Ashtabula city: 50+ restaurants (DoorDash/UberEats listings)
- Total estimated: 100-150 food service establishments

**Retailers (Ashtabula County):**
- Greater Ashtabula Chamber directory: 200+ member businesses
- Retail category: Department/retail stores, specialty shops
- AshtaBeautiful retail listings: Local crafts, clothing, auto parts, groceries

**Total Addressable Market (TAM):**
- Conservative: 75-100 businesses could benefit
- Optimistic: 150-200 businesses with seasonal/tourism fluctuations

### 2.3 Seasonal Considerations

**Peak Season (May-September):**
- Geneva-on-the-Lake tourism surge
- High demand for quick pickup options
- Parking congestion makes curbside valuable

**Off-Season (October-April):**
- Reduced tourism traffic
- Local customer base relies on convenience
- Opportunity for year-round adoption

---

## 3. Stakeholder Analysis

### 3.1 Primary Users

**Persona 1: "Busy Betty" — Working Parent**
- Orders dinner on phone during commute
- Needs 15-minute pickup window
- Wants SMS notification when order ready
- Pain point: Waiting in parking lot unsure if order is ready

**Persona 2: "Tourist Tom" — GOTL Visitor**
- Visiting Geneva-on-the-Lake for weekend
- Wants to avoid crowded restaurants
- Unfamiliar with local establishments
- Pain point: Doesn't know which places offer curbside

**Persona 3: "Senior Sam" — Accessibility Needs**
- Limited mobility makes parking/walking difficult
- Prefers to wait in car
- Simple phone user (no apps)
- Pain point: Complex apps and ordering systems

### 3.2 Business Stakeholders

| Stakeholder | Role | Contact/Access | Priority |
|-------------|------|----------------|----------|
| **Greater Ashtabula Chamber of Commerce** | Business network, promotion | ashtabulachamber.net | P0 — Partnership gateway |
| **Geneva Area Chamber of Commerce** | Tourism business network | genevachamber.org | P0 — Beachhead market |
| **Individual Restaurants** | End users, beta testers | Local outreach needed | P1 — Direct adoption |
| **Retail Shop Owners** | End users | Chamber directory | P2 — Expansion |
| **Fat Sally's Warehouse** | Early adopter example | 1569 Laird Drive | P2 — Case study |

### 3.3 Outreach Contacts

**Greater Ashtabula Chamber:**
- Website: ashtabulachamber.net
- Business directory: ashtabulachamber.chambermaster.com
- Contact form available online

**Geneva Area Chamber:**
- Website: genevachamber.org
- Restaurant listings: 25+ establishments
- Crosswinds Grille, Rosemary's Pizza identified

---

## 4. Data Source Assessment

### 4.1 Authoritative Data Sources

| Data Type | Source | Access Method | Reliability |
|-----------|--------|---------------|-------------|
| Business listings | Greater Ashtabula Chamber | ChamberMaster directory | High |
| Restaurant database | TripAdvisor | Public API/scrape | Medium |
| Tourism data | Visit Geneva-on-the-Lake | visitgenevaonthelake.com | High |
| Local food guide | OSU Extension Ashtabula | PDF publication | High |

### 4.2 Data Collection Strategy

**Phase 1 (Immediate):**
- Chamber directory scraping/browsing
- Manual research of 25-50 priority businesses
- Phone verification of curbside interest

**Phase 2 (Post-Launch):**
- Direct business onboarding interviews
- Customer usage analytics
- Seasonal demand tracking

---

## 5. Business Model Analysis

### 5.1 Revenue Model Options

| Model | Price Point | Pros | Cons |
|-------|-------------|------|------|
| **SaaS Monthly** | $29-49/month | Predictable revenue, low friction | Monthly commitment concerns |
| **Per-Order Fee** | $0.50-0.99/order | Scales with usage | Unpredictable revenue |
| **Freemium** | Free basic + $39/month premium | Easy adoption | Conversion challenge |
| **Chamber Partnership** | $500/year bulk license | Bulk adoption | Lower per-customer revenue |

**Recommendation:** Start with SaaS Monthly at $39/month with 30-day free trial. This positions between SimpleTexting ($29) and SWIPEBY ($58) while offering more curbside-specific features than generic SMS.

### 5.2 Unit Economics

**Estimated Costs:**
- SMS delivery: $0.0075/message (Twilio)
- Hosting: $15/month (Cloudflare/Vercel)
- Payment processing: 2.9% + $0.30 (Stripe)

**Break-Even:** ~3-5 businesses at $39/month covers infrastructure.

### 5.3 Market Positioning

**Value Proposition:**
"The curbside pickup tool designed for small-town businesses — no apps, no complex setup, just simple SMS coordination that your customers already know how to use."

**Differentiation:**
- vs. SWIPEBY: No customer app required
- vs. SimpleTexting: Curbside-specific features (arrival notifications, parking spot IDs)
- vs. Curbspot: Lower price, simpler setup
- vs. DoorDash: You keep the customer relationship

---

## 6. Technical Feasibility Assessment

### 6.1 Core Features Required

**MVP Feature Set:**
1. Business dashboard (order status management)
2. SMS notifications to customers
3. "I'm here" customer arrival notification
4. Parking spot/vehicle identification
5. Basic order queue management

**Nice-to-Have Features:**
- Geofenced auto-arrival detection
- Integration with Square/Toast POS
- Customer preference storage
- Analytics dashboard

### 6.2 Technical Architecture

**Recommended Stack:**
- Frontend: React + Tailwind (consistent with other NAI projects)
- Backend: Cloudflare Workers or Vercel Functions
- Database: PostgreSQL (Neon) or SQLite (libSQL)
- SMS: Twilio API
- Hosting: Cloudflare Pages

**Integration Points:**
- Optional: Square Webhooks for order import
- Optional: Google Sheets for simple business management
- Future: POS system APIs

### 6.3 Development Estimate

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| MVP Core | 2 weeks | SMS notifications, basic dashboard |
| Polish | 1 week | UI/UX refinement, onboarding flow |
| Beta Launch | 1 week | 3-5 pilot businesses |
| **Total MVP** | **4 weeks** | Production-ready for pilot |

---

## 7. Risk Assessment

### 7.1 Identified Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low business adoption | Medium | High | Chamber partnership, free trial, case studies |
| Competition from Square/Toast | Low | Medium | Focus on simplicity and price advantage |
| SMS deliverability issues | Low | Medium | Use established provider (Twilio), fallback options |
| Seasonal demand fluctuation | High | Medium | Target year-round businesses (not just tourism) |
| Technical complexity creep | Medium | High | Strict MVP scope, resist feature requests initially |

### 7.2 Success Metrics

| Metric | Target (3 months) | Target (12 months) |
|--------|-------------------|-------------------|
| Pilot businesses | 3-5 | 15-25 |
| Monthly active orders | 100 | 1,000 |
| Customer satisfaction | 4.5/5 | 4.5/5 |
| Monthly recurring revenue | $150 | $750 |

---

## 8. Recommendations

### 8.1 Go-to-Market Strategy

**Phase 1: Chamber Partnership (Month 1)**
- Contact Greater Ashtabula Chamber for partnership discussion
- Propose: "Free pilot for 3 Chamber member businesses"
- Offer: Co-marketing opportunity for Chamber

**Phase 2: Beachhead Market (Month 2-3)**
- Target Geneva-on-the-Lake restaurants (high visibility, seasonal surge)
- Focus on: Crosswinds Grille, established Strip restaurants
- Leverage: Tourism season for maximum impact demonstration

**Phase 3: Expansion (Month 4-6)**
- Expand to Ashtabula city retailers
- Target: Fat Sally's Warehouse (already doing curbside manually)
- Chamber newsletter feature and member discount

### 8.2 Immediate Next Steps

1. **Stakeholder Outreach (Phase 2)**
   - Email Greater Ashtabula Chamber Executive Director
   - Draft partnership proposal with free pilot offer
   - Identify 3-5 priority pilot businesses

2. **Technical Preparation**
   - Finalize SPEC.md with technical architecture
   - Create wireframes for business dashboard
   - Set up Twilio account for SMS testing

3. **Validation Questions for Businesses**
   - How do you currently handle phone orders?
   - What percentage of orders are takeout vs. dine-in?
   - Would your customers use SMS notifications?
   - What's your monthly budget for operational tools?

---

## Appendix A: Comparable Market Research

### Lake Geneva, WI (Similar Tourism Market)
- Population: ~7,700 (similar to GOTL area)
- Tourism-driven economy
- No dedicated curbside pickup solution identified
- Relies on individual restaurant websites/phone orders

### Traverse City, MI (Larger Comparison)
- Population: ~15,000
- Strong tourism + local retail mix
- Some restaurants use third-party delivery
- Curbside pickup not systematically coordinated

### Conclusion
Neither comparable market has a dedicated small-business curbside solution, supporting the blue-ocean opportunity hypothesis.

---

## Appendix B: Research Sources

1. SimpleTexting — "The 5 best curbside pickup software services" (2023)
2. Verizon Business — "Curbside Pickup Solutions Just Got Better" (2022)
3. Nextdoor — "Curbside Pickup 101: A Guide for Local Retailers" (2022)
4. Adobe Analytics — BOPIS growth statistics (2020)
5. Greater Ashtabula Chamber — Business directory (2026)
6. Geneva Area Chamber — Restaurant listings (2026)
7. TripAdvisor — Geneva-on-the-Lake restaurant reviews (2026)
8. Innovation Quarter — SWIPEBY analysis (2024)

---

**Document Status:** Phase 1 Complete  
**Next Phase:** Stakeholder Outreach & Validation  
**Blockers:** None — Ready for Michael approval to proceed
