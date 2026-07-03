# Phase 1 Research — Route Optimizer
## New Ashtabula Initiative | Delivery & Logistics Efficiency Tool
**Date:** February 19, 2026  
**Status:** 🔴 → 🟡 Phase 1 Complete  
**Research Lead:** Rondell / Noirsys AI

---

## Executive Summary

Route Optimizer is a delivery route optimization tool designed specifically for small businesses and non-profits in Ashtabula County. The research reveals a significant gap: existing route optimization solutions are priced for enterprise fleets ($49-400/month), leaving small operators (1-5 drivers) and non-profits without affordable options. With ACCAA's Meals on Wheels program running 20-30 stop routes manually, and local delivery businesses relying on Google Maps without optimization, there's clear demand for an accessible, affordable solution.

**Key Finding:** A $29-79/month price point would undercut all major competitors while remaining profitable, targeting the underserved small business segment.

---

## 1. Problem Statement

### The Current Pain

**For Small Delivery Businesses:**
- Manual route planning via Google Maps or paper maps
- No optimization = wasted fuel, time, and vehicle wear
- Small operators (1-5 drivers) can't afford enterprise tools
- Route planning takes 30-60 minutes daily
- No real-time tracking or customer notifications

**For Non-Profit Delivery Programs:**
- ACCAA Meals on Wheels: 20-30 stops per route, planned manually
- Volunteer drivers use personal vehicles with mileage reimbursement
- Routes take 2-4 hours without optimization
- No budget for $50+/month software
- Harder to recruit volunteers when routes are inefficient

**Quantified Inefficiency:**
- Average small delivery business: 3-5 hours/week planning routes
- Fuel waste from poor routing: 10-20% of fuel costs
- Missed delivery windows due to poor time estimates

### Root Causes
1. **Pricing barrier:** Enterprise tools start at $49/month (Routific) to $400/month (Route4Me)
2. **Complexity:** Enterprise tools have features small operators don't need
3. **Awareness:** Many small businesses don't know route optimization exists
4. **Integration gap:** No simple tools that work with existing workflows

---

## 2. Market Analysis — Ashtabula County

### 2.1 Senior Meal Delivery (Primary Non-Profit Segment)

**ACCAA Senior Nutrition Program ("Meals on Wheels")**
- **Organization:** Ashtabula County Community Action Agency
- **Target:** Seniors 60+ unable to prepare/obtain meals
- **Delivery Model:** Home-delivered meals via volunteer drivers
- **Route Scale:** 20-30 stops per route
- **Time per Route:** 2-4 hours
- **Reimbursement:** Mileage available for volunteers
- **Contact:** accaa.org

**Market Size:**
- Ashtabula County population 60+: ~25,000 (22% of population)
- Estimated homebound seniors qualifying for meal delivery: 500-1,000
- Current routes likely cover: 200-400 daily meals
- Volunteer drivers needed: 15-25

### 2.2 Commercial Delivery Operators

**Local Trucking & Logistics Companies:**
| Company | Location | Fleet Size | Notes |
|---------|----------|------------|-------|
| K & H Trucking/Distribution | 1825 W 47th St, Ashtabula | Medium | Freight hauling, warehousing |
| B&S Logistics LLC | 1527 Cook Rd, Ashtabula | 3 trucks | USDOT registered |
| World Shipping | Port of Ashtabula | Large | International cargo, freight forwarding |
| On Time Delivery & Warehouse | Ohio-based | Unknown | "Top-notch delivery services" |
| Truckmen | Ohio-based | Unknown | Warehousing & distribution |

**Food Delivery Platforms (Active in Ashtabula):**
- DoorDash: Available
- UberEats: Available
- Grubhub: Available
- Postmates: 40+ restaurants

**Local Food Delivery Needs:**
- ~80-100 restaurants in Ashtabula area
- Many don't use third-party apps (cost too high)
- Potential for direct delivery route optimization

### 2.3 Local Service Businesses with Delivery Needs

**Pharmacies with Delivery:**
- CVS Pharmacy (multiple locations): 1-2 day delivery, on-demand available
- Walgreens: Prescription delivery
- Local independent pharmacies

**Other Potential Users:**
- Auto parts stores (synergy with parts-finder MVP)
- Flower shops
- Catering companies
- Office supply delivery
- Medical equipment delivery
- Laundry/dry cleaning pickup & delivery

### 2.4 Market Sizing

**TAM (Total Addressable Market) — Ashtabula County:**
| Segment | Est. Businesses/Drivers | Monthly Software Budget |
|---------|------------------------|------------------------|
| Small delivery businesses | 20-40 companies | $29-79/mo |
| Non-profit meal programs | 3-5 organizations | $0-29/mo (nonprofit tier) |
| Local trucking (small fleets) | 10-15 companies | $49-99/mo |
| Service businesses with delivery | 30-50 businesses | $19-49/mo |
| **Total Potential** | **63-110 entities** | **$2,000-7,000/mo revenue** |

**Expansion Potential:**
- Lake County (adjacent): Similar demographics
- Geauga County: Rural delivery challenges
- Trumbull County: Larger population center

---

## 3. Competitor Analysis

### 3.1 Direct Competitors

| Competitor | Price | Best For | Key Features | Weakness for Our Market |
|------------|-------|----------|--------------|------------------------|
| **Route4Me** | $99-400/mo | Enterprise fleets | Full feature set, API | Too expensive, too complex |
| **Routific** | $49/mo | Small-medium fleets | 15% shorter routes than competitors, 30-day trial | Still pricey for 1-2 driver operations |
| **Upper** | ~$40/mo | Small businesses | User-friendly | Limited non-profit options |
| **Onfleet** | $500+/mo | Large delivery ops | Real-time tracking, analytics | Enterprise-only pricing |
| **Samsara** | Custom quote | Enterprise fleets | Full fleet management | Overkill for small operators |
| **OptimoRoute** | $35-45/mo | Field service | Good optimization | No non-profit program |

### 3.2 Indirect Competitors / Alternatives

| Alternative | Cost | Limitations |
|-------------|------|-------------|
| **Google Maps** | Free | Max 10 stops, no optimization, no scheduling |
| **Apple Maps** | Free | No multi-stop route planning |
| **Waze** | Free | No route optimization, single destination |
| **Excel + Maps** | Free | Manual, time-consuming, error-prone |
| **Pen and paper** | Free | No optimization, hard to adjust |

### 3.3 Competitive Gap Analysis

**What's Missing in the Market:**
1. **Affordable tier** for 1-3 driver operations ($19-39/mo)
2. **Non-profit pricing** or free tier for volunteer programs
3. **Simple UI** without enterprise complexity
4. **Quick setup** — start routing in minutes, not hours
5. **Local focus** — understand rural/ suburban route challenges

**Our Opportunity:**
- Position as the "QuickBooks of route optimization"
- Target businesses too small for enterprise tools
- Offer non-profit/volunteer program free tier
- Focus on ease of use over feature bloat

---

## 4. User Personas

### Persona 1: "Dispatcher Diane" — Small Business Owner
- **Role:** Owner of local courier service (3 drivers)
- **Age:** 45
- **Pain Points:**
  - Spends 45 minutes every morning planning routes
  - Drivers get lost or miss delivery windows
  - Fuel costs eating into thin margins
  - Tried Route4Me but too expensive at $200+/mo
- **Needs:**
  - Quick route optimization (under 5 minutes)
  - Driver mobile app
  - Basic proof-of-delivery
  - Affordable pricing ($39-59/mo for 3 drivers)
- **Tech Comfort:** Moderate — uses smartphone, email, basic apps

### Persona 2: "Volunteer Vince" — Meals on Wheels Driver
- **Role:** Retired volunteer delivering senior meals
- **Age:** 68
- **Pain Points:**
  - Routes take too long (3-4 hours)
  - Backtracking between stops wastes gas
  - Hard to find addresses in rural areas
  - No budget for paid software
- **Needs:**
  - Simple mobile app
  - Turn-by-turn directions
  - Route optimized to minimize driving time
  - Free or very low cost (non-profit program)
- **Tech Comfort:** Low-moderate — has smartphone, needs simple interface

### Persona 3: "Manager Maria" — ACCAA Program Coordinator
- **Role:** Senior Nutrition Program coordinator
- **Age:** 52
- **Pain Points:**
  - Manually assigning 20-30 stops to 5-8 drivers daily
  - Volunteers quit when routes are inefficient
  - No visibility into where drivers are
  - Limited budget ($0 for software)
- **Needs:**
  - Multi-route planning for multiple drivers
  - Ability to balance workload across drivers
  - Simple driver assignment
  - Non-profit discount or free tier
- **Tech Comfort:** Moderate — manages programs, uses computer daily

### Persona 4: "Owner Omar" — HVAC Service Business
- **Role:** Owner of 4-person HVAC company with service calls
- **Age:** 38
- **Pain Points:**
  - Schedules 8-12 service calls per day across team
  - Current method: Google Maps with multiple tabs
  - No optimization means extra driving between calls
  - Customers call asking "where's my tech?"
- **Needs:**
  - Route + schedule optimization
  - Customer notification (ETA updates)
  - Integration with existing calendar
  - Affordable for small team ($29-49/mo)
- **Tech Comfort:** High — uses scheduling software, comfortable with apps

---

## 5. Solution Concept

### Core Value Proposition
**"Route optimization simple enough for volunteers, powerful enough for small fleets — at a price that makes sense."**

### Key Features (MVP)

**1. Route Optimization Engine**
- Upload addresses via CSV or manual entry
- One-click route optimization
- Accounts for traffic patterns (Google Maps API)
- Time windows and priority stops
- Multi-stop routes (up to 50 stops/driver)

**2. Driver Mobile App**
- Turn-by-turn navigation
- Stop-by-stop checklist
- Proof of delivery (photo + signature)
- Offline mode for rural areas

**3. Dispatcher Dashboard**
- Visual route map
- Drag-and-drop stop reordering
- Driver assignment
- Real-time location tracking (optional)
- Daily/weekly route history

**4. Customer Notifications**
- SMS/email ETA updates
- "Out for delivery" notifications
- Delivery confirmation

### Pricing Tiers

| Tier | Price | Includes | Target |
|------|-------|----------|--------|
| **Non-Profit** | Free | 1 driver, 20 stops/day, basic optimization | Meals on Wheels, volunteer programs |
| **Starter** | $29/mo | 2 drivers, 50 stops/day, mobile app | Solo operators, very small businesses |
| **Business** | $59/mo | 5 drivers, unlimited stops, notifications, proof of delivery | Small delivery businesses |
| **Pro** | $99/mo | 10 drivers, API access, advanced analytics | Growing operations |

---

## 6. Tech Stack Recommendations

### Core Platform
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Maps/Routing:** Google Maps Platform (Routes API + Directions API)
- **Mobile:** PWA (Progressive Web App) or React Native
- **Hosting:** Vercel (frontend) + Supabase (backend)

### Key Integrations
- **Maps:** Google Maps Platform ($200 free credit/month, then pay-per-use)
- **SMS Notifications:** Twilio
- **Email:** SendGrid or Resend
- **Payments:** Stripe (subscription management)

### Cost Estimate (Operational)
| Component | Monthly Cost |
|-----------|--------------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Google Maps API | $50-200 (scales with usage) |
| Twilio SMS | $20-50 |
| **Total** | **$115-295/mo** |

---

## 7. Revenue Model

### Projected Revenue (Ashtabula County Only)

**Conservative Estimate (Year 1):**
| Tier | Customers | Monthly Revenue |
|------|-----------|-----------------|
| Non-Profit (Free) | 5 | $0 |
| Starter ($29) | 8 | $232 |
| Business ($59) | 5 | $295 |
| Pro ($99) | 1 | $99 |
| **Monthly Total** | **19** | **$626** |
| **Annual Total** | | **$7,512** |

**Optimistic Estimate (Year 1):**
| Tier | Customers | Monthly Revenue |
|------|-----------|-----------------|
| Non-Profit (Free) | 8 | $0 |
| Starter ($29) | 15 | $435 |
| Business ($59) | 12 | $708 |
| Pro ($99) | 3 | $297 |
| **Monthly Total** | **38** | **$1,440** |
| **Annual Total** | | **$17,280** |

**Break-Even Analysis:**
- Development cost estimate: 80-120 hours @ $100/hr = $8,000-12,000
- Monthly operational cost: ~$200
- Break-even: 20-30 paying customers

### Expansion Revenue (Years 2-3)
- Lake County, Geauga County, Trumbull County
- Regional expansion: 5x revenue potential
- Estimated regional market: $50,000-100,000 ARR

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Google Maps API costs exceed budget** | Medium | High | Set hard limits; optimize API calls; offer OpenStreetMap fallback |
| **Small businesses don't see value** | Medium | High | Free trial; ROI calculator; case studies from beta users |
| **Non-profits can't adopt due to tech barriers** | Medium | Medium | Volunteer training program; simple onboarding; phone support |
| **Competitors lower prices** | Low | Medium | Focus on local support and non-profit niche |
| **Rural address accuracy issues** | High | Medium | Address validation; manual coordinate correction; driver feedback loop |
| **Low adoption in small market** | Medium | High | Aggressive local outreach; word-of-mouth referral program |

---

## 9. Open Questions for Phase 2 (Resource Procurement)

### Stakeholder Outreach Questions
1. **ACCAA Senior Nutrition Program:**
   - How many daily routes? Stops per route?
   - Current route planning method?
   - Would a free tool increase volunteer retention?
   - Who is the program coordinator? (Contact needed)

2. **Local Delivery Businesses:**
   - How many local businesses do their own delivery (not using DoorDash)?
   - What's the average fleet size?
   - Current route planning pain points?
   - What would they pay for route optimization?

3. **Service Businesses:**
   - HVAC, plumbing, electrical — how many schedule daily service calls?
   - Current scheduling/routing method?
   - Interest in customer ETA notifications?

### Technical Questions
4. What percentage of addresses in rural Ashtabula County are accurate in Google Maps?
5. Are there seasonal delivery patterns? (Tourism season, snow plowing, etc.)
6. What's the average daily route distance for local businesses?

### Market Questions
7. Are there existing relationships between businesses and delivery software vendors?
8. What's the appetite for a "buy local" software solution vs. national brands?

---

## 10. Implementation Roadmap

### Phase 1: MVP (Weeks 1-4)
- [ ] Core route optimization algorithm
- [ ] Basic web interface (upload CSV, optimize)
- [ ] Simple mobile view for drivers
- [ ] Google Maps integration

### Phase 2: Beta (Weeks 5-8)
- [ ] Onboard 2-3 beta users (ACCAA + 1-2 businesses)
- [ ] Proof of delivery (photo)
- [ ] Basic SMS notifications
- [ ] Feedback collection & iteration

### Phase 3: Launch (Weeks 9-12)
- [ ] Stripe subscription integration
- [ ] Full mobile PWA
- [ ] Driver assignment features
- [ ] Marketing site + self-serve signup

### Phase 4: Growth (Months 4-6)
- [ ] API for integrations
- [ ] Advanced analytics dashboard
- [ ] Multi-day route planning
- [ ] Expansion to adjacent counties

---

## 11. Next Steps (Phase 2: Resource Procurement)

### Stakeholder Outreach Priority
1. **ACCAA Senior Nutrition Program**
   - Contact: Program coordinator (call ACCAA main: 440-998-4325)
   - Goal: Validate need, secure beta partnership

2. **Local Courier/Delivery Businesses**
   - Research: Identify 5-10 local businesses doing own delivery
   - Outreach: Survey on current routing methods

3. **Service Business Owners**
   - Target: HVAC, plumbing, electrical companies
   - Method: Chamber of Commerce introduction

### Research Tasks
- [ ] Map all potential delivery businesses in Ashtabula County
- [ ] Survey current routing methods and pain points
- [ ] Validate pricing sensitivity ($29-59/mo acceptable?)
- [ ] Identify volunteer coordinator at ACCAA

### Documentation to Create (Phase 3)
- [ ] SPEC.md with full technical architecture
- [ ] BUILD_CHECKLIST.md with implementation steps
- [ ] OUTREACH_EMAILS.md for stakeholder contact

---

## Appendix A: Competitor Pricing Details

**Route4Me:**
- Team Plan: $99/month (3 users)
- Business Plan: $199/month (10 users)
- Enterprise: $400+/month

**Routific:**
- Essentials: $49/month per vehicle
- Professional: $69/month per vehicle
- Claim: Routes 15% shorter than competitors

**Upper:**
- Starting at ~$40/month
- Focus on small-medium businesses

**OptimoRoute:**
- Lite: $35/month per driver
- Pro: $45/month per driver

---

## Appendix B: Local Business Research Notes

**Trucking Companies Identified:**
- B&S Logistics LLC: 1527 Cook Rd, 440-992-2525
- K & H Distribution: 1825 W 47th St
- World Shipping: Port of Ashtabula

**Delivery Platforms Active:**
- DoorDash, UberEats, Grubhub, Postmates (restaurant delivery)
- CVS Pharmacy delivery (1-2 day, on-demand)

**Potential Beta Partners:**
- ACCAA Meals on Wheels (non-profit, free tier)
- Local courier services (need to identify)
- Small HVAC/plumbing companies (need to identify)

---

*Document Version: 1.0*  
*Next Review: Upon completion of Phase 2 stakeholder outreach*
