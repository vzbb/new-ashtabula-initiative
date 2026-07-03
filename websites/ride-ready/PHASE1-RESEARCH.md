# Ride Ready — Phase 1 Research
## Vehicle Readiness Tracking for Auto Shops and Fleet Operators

**Date:** February 19, 2026  
**Status:** Phase 1 Research  
**Next:** Phase 2 Resource Procurement

---

## 1. Problem Statement

### The Pain Point
Auto repair shops and fleet operators struggle with vehicle readiness communication:
- **Customer uncertainty:** "Is my car ready yet?" calls all day
- **Status confusion:** Multiple mechanics, unclear what's complete
- **Pickup delays:** Customers arrive before car is actually ready
- **No transparency:** Can't see repair progress in real-time
- **Notification gaps:** Forget to call customers when work is done
- **Parts delays:** Job stalled waiting for parts, no communication

### Impact on Auto Shops
- **Phone interruptions:** 20-30% of staff time on status calls
- **Customer frustration:** Uncertainty leads to complaints
- **Inefficiency:** Cars sitting done but owners not notified
- **Trust issues:** Customers feel out of the loop

### Impact on Fleet Operators
- **Dispatch chaos:** Don't know which vehicles are road-ready
- **Missed deadlines:** Promised vehicles not actually complete
- **Maintenance gaps:** Overdue services not tracked
- **Compliance risk:** Inspection status unclear

---

## 2. Market Analysis

### Target Market Size
**Ashtabula County Auto Repair Market:**
- **Auto repair shops:** 40-60 (independent + chains)
  - Independent shops: 30-45
  - Chain locations (Midas, Meineke, etc.): 10-15
- **Fleet operators:** 50-100 (delivery, service, municipal)
  - Small fleets (5-20 vehicles): 30-50
  - Medium fleets (20-100): 15-30
  - Large fleets (100+): 5-10
- **Daily repair jobs:** 200-400 across county
- **Average repair time:** 2-6 hours (same day) to 2-5 days (major work)

**Status Check Volume:**
- **Calls per shop per day:** 15-30 status inquiries
- **Total daily status calls:** 600-1,800 county-wide
- **Time per call:** 2-5 minutes
- **Daily time wasted:** 20-75 hours across all shops

### Local Stakeholders

**Auto Repair Shops (Primary Users):**
| Shop Type | Count | Avg Jobs/Day | Pain Level |
|-----------|-------|--------------|------------|
| Full-service independent | 20-30 | 8-15 | High |
| Quick lube/oil change | 10-15 | 20-40 | Medium |
| Specialty (transmission, exhaust) | 5-10 | 3-8 | High |
| Tire/service centers | 5-10 | 15-30 | Medium |
| Dealership service | 3-5 | 20-50 | Medium |

**Fleet Operators (Secondary Users):**
| Type | Count | Fleet Size | Need |
|------|-------|------------|------|
| Delivery services | 10-15 | 5-50 | Daily readiness |
| Municipal/government | 5-8 | 20-200 | Compliance tracking |
| Service companies | 15-25 | 5-30 | Job scheduling |
| Rental companies | 3-5 | 20-100 | Turnaround speed |

---

## 3. Competitor Analysis

### Shop Management Software

| Competitor | Model | Price | Features | Shop Fit |
|------------|-------|-------|----------|----------|
| **Shop-Ware** | SaaS | $200-500/mo | Full management, customer portal | Large shops only |
| **AutoFluent** | Desktop + cloud | $1,500+ setup | Comprehensive, complex | Overkill for small shops |
| ** Mitchell 1** | Enterprise | Custom | Dealer-grade | Too expensive |
| **Shop Boss** | Cloud | $100-300/mo | Good features, learning curve | Medium shops |
| **Nexsyis** | Legacy | $$$ | Established | Outdated, expensive |

### Customer Communication Tools

| Competitor | Model | Price | Focus |
|------------|-------|-------|-------|
| **DropIn Auto** | Photos + video | $50-150/mo | Visual inspection reports |
| **AutoServe1** | Digital inspections | $100-300/mo | Upsell tool |
| **Pando** | Messaging | Per-user | Shop-customer chat |
| **PulseM** | Reviews + comms | $50-200/mo | Reputation management |

### Fleet Management

| Competitor | Model | Price | Fleet Fit |
|------------|-------|-------|-----------|
| **Fleetio** | SaaS | $5-10/vehicle/mo | Full fleet management |
| **Samsara** | Hardware + software | $$$ | Enterprise only |
| **Whip Around** | Inspections | $10-20/driver/mo | Inspection focus |

### What Exists Locally
- **Nothing** — No Ashtabula-specific vehicle readiness platform
- Current methods:
  - Phone calls
  - Text messages (informal)
  - Whiteboards in shop
  - Paper work orders
  - Some shops use generic software

### Gap Analysis
**✓ Opportunity Confirmed:**
- No simple, affordable status tracking for small shops
- No customer-facing progress updates
- No fleet readiness dashboard for local operators
- Existing software is overkill/expensive for small shops

---

## 4. User Personas

### Primary: "Shop Owner Steve" (Independent Auto Shop)
- **Demographics:** 40-60, owns 3-6 bay shop, 3-5 employees
- **Business:** 8-15 repairs/day
- **Tech comfort:** Low-moderate (uses computer for invoicing)
- **Pain points:**
  - Constant phone interruptions for status checks
  - Customers arrive before cars are ready
  - Mechanics forget to update status
  - No way for customers to self-check progress
- **Needs:** Simple status updates, customer notifications, mobile-friendly

### Primary: "Fleet Manager Fiona" (Service Company)
- **Demographics:** 35-55, manages 20-vehicle service fleet
- **Business:** Daily dispatch, maintenance scheduling
- **Tech comfort:** Moderate
- **Pain points:**
  - Don't know which vehicles are shop-ready
  - Promised completion times not met
  - Drivers sitting idle waiting for vehicles
  - Maintenance tracking on spreadsheets
- **Needs:** Fleet dashboard, readiness status, maintenance alerts

### Secondary: "Customer Carl" (Vehicle Owner)
- **Demographics:** 30-60, car in for repair
- **Tech comfort:** High
- **Pain points:**
  - Called shop 3 times, still don't know when car ready
  - Drove to shop to find out work not done
  - No communication about delays
- **Needs:** Real-time status check, notifications when ready

### Secondary: "Mechanic Mike" (Shop Technician)
- **Demographics:** 25-45, ASE certified technician
- **Role:** Performs repairs, updates work status
- **Tech comfort:** Moderate (smartphone)
- **Pain points:**
  - Forget to tell service writer when job done
  - Paperwork takes time away from repairs
  - Customers hovering asking for updates
- **Needs:** One-tap status updates, simple interface

---

## 5. Solution Concept

### Core Concept
**"Domino's Pizza Tracker for auto repair — customers see exactly where their car is in the process and get notified when it's ready."**

### Key Features

**For Auto Shops:**
1. **Digital Work Orders** — Replace paper, track status digitally
2. **Status Pipeline** — Intake → Diagnosis → Parts → In Progress → Quality Check → Ready
3. **One-Tap Updates** — Mechanics update status from phone/tablet
4. **Customer Notifications** — Automatic SMS/email at key milestones
5. **Photo Documentation** — Before/after, problem areas, completed work
6. **Delay Alerts** — Notify customers of parts delays, additional issues
7. **Customer Self-Service** — Link to check status without calling
8. **Pickup Scheduling** — Customer selects pickup time when notified

**For Customers:**
1. **Status Tracker** — Web link showing current repair stage
2. **Progress Photos** — See what's being done
3. **ETA Updates** — Estimated completion time
4. **Ready Notification** — SMS/email when car is ready
5. **Digital Invoice** — Review charges before pickup
6. **Approval Workflow** — Approve additional work via app

**For Fleet Operators:**
1. **Fleet Dashboard** — All vehicles, all statuses at a glance
2. **Readiness Calendar** — Which vehicles available which days
3. **Maintenance Tracking** — Scheduled services, overdue items
4. **Shop Coordination** — Manage multiple vehicles across shops
5. **Driver Notifications** — Automatic updates to drivers

### Differentiation

| Feature | Ride Ready | Shop-Ware | DropIn | Phone/Whiteboard |
|---------|------------|-----------|--------|------------------|
| Price | $29-79/mo | $200-500/mo | $50-150/mo | Free (labor cost) |
| Customer self-check | ✓ | ✓ | Partial | ✗ |
| Photo updates | ✓ | ✓ | ✓ | ✗ |
| Fleet dashboard | ✓ | Partial | ✗ | ✗ |
| Simple setup | ✓ | ✗ | ✓ | ✓ |
| Shop-specific (Ashtabula) | ✓ | ✗ | ✗ | ✗ |
| Pickup scheduling | ✓ | Partial | ✗ | ✗ |

---

## 6. Tech Stack Options

### Recommended: Next.js + Supabase + Twilio
- **Frontend:** Next.js 14, Tailwind CSS
- **Mobile:** PWA or React Native
- **Database:** Supabase (PostgreSQL)
- **Notifications:** Twilio (SMS), SendGrid (email)
- **Storage:** Supabase Storage (photos)
- **Hosting:** Vercel
- **Cost:** ~$50-100/mo (scales with shops)

### Alternative: No-Code + Integration
- **Platform:** Bubble or Webflow
- **Database:** Airtable
- **Cost:** ~$40-80/mo
- **Pros:** Faster to build
- **Cons:** Limited customization

---

## 7. Revenue Model

### Tiered Pricing

| Tier | Price | Features | Target |
|------|-------|----------|--------|
| **Free** | $0 | 5 jobs/day, basic status | Solo mechanics |
| **Pro** | $29/mo | Unlimited jobs, photos, SMS | Small shops (1-3 bays) |
| **Business** | $79/mo | Fleet features, multi-shop | Large shops, small fleets |
| **Fleet** | $199/mo | Unlimited vehicles, API | Large fleets |

### Per-Shop Value
- **Time saved:** 10-20 calls/day @ 3 min = 30-60 min
- **Labor cost saved:** $25-50/day = $500-1,000/mo
- **Price:** $29-79/mo
- **ROI:** 600-3,400%

### Example Economics (Pro tier shop):**
- Monthly subscription: $29
- Time saved: 15 min/day @ $50/hr = $12.50/day = $250/mo
- **Net value: $221/mo**

---

## 8. Implementation Roadmap

### Phase 1: MVP (Weeks 1-4)
- [ ] Basic work order status (5 stages)
- [ ] Shop dashboard (web)
- [ ] Customer status link (view only)
- [ ] SMS notifications (ready only)
- [ ] 2-3 pilot shops

### Phase 2: Feature Complete (Weeks 5-8)
- [ ] Photo upload
- [ ] Full status pipeline
- [ ] Customer approval workflow
- [ ] Fleet dashboard
- [ ] 10-15 shops

### Phase 3: Scale (Weeks 9-12)
- [ ] Mobile apps
- [ ] Digital inspections
- [ ] Parts integration
- [ ] 30+ shops
- [ ] Fleet customers

### Phase 4: Expansion (Months 4-6)
- [ ] Expand to Lake County
- [ ] Multi-shop chains
- [ ] Dealer service departments
- [ ] Predictive maintenance

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Shops resist new system | Medium | High | Free tier, simple setup, prove time savings |
| Mechanics won't update status | Medium | High | One-tap simplicity, shop owner mandate |
| Customers don't use status link | Low | Medium | SMS fallback, still saves shop calls |
| Competing with existing software | Medium | Medium | Price advantage, local focus |
| Feature creep | Medium | Medium | Stay focused on status/communication only |

---

## 10. Open Questions for Phase 2

### Shop Research
1. [ ] How many status calls per day on average?
2. [ ] What software (if any) currently used for tracking?
3. [ ] What's the average repair time (same day vs. multi-day)?
4. [ ] Would mechanics use mobile app for status updates?
5. [ ] What percentage of customers would use status link vs. call?

### Fleet Research
6. [ ] How many vehicles in typical fleet?
7. [ ] How do they currently track vehicle readiness?
8. [ ] What's the cost of vehicle downtime?

### Customer Research
9. [ ] How often do they call for status updates?
10. [ ] What information do they want most (ETA, cost, what's being done)?

---

## 11. Success Metrics

### 90-Day Targets
- [ ] 5-10 pilot shops
- [ ] 100+ work orders tracked
- [ ] 50% customer use status link (vs. calling)
- [ ] 20% reduction in status calls
- [ ] $500+ MRR

### 6-Month Targets
- [ ] 30+ shops
- [ ] 1,000+ work orders/month
- [ ] 3 fleet customers
- [ ] Expand to adjacent counties
- [ ] $3,000+ MRR

---

## 12. Next Steps (Phase 2)

### Immediate Actions
1. **Shop outreach**
   - [ ] Independent shops on Main Street (Ashtabula)
   - [ ] Quick lube locations
   - [ ] Tire/service centers
   - [ ] AAA approved shops

2. **Fleet outreach**
   - [ ] Delivery companies (FedEx contractors, etc.)
   - [ ] Service companies (HVAC, plumbing fleets)
   - [ ] Municipal fleet managers

3. **Competitor research**
   - [ ] Shop-Ware trial
   - [ ] DropIn Auto demo
   - [ ] Document pricing and features

4. **Validation**
   - [ ] Survey 10 shop owners
   - [ ] Survey 20 customers
   - [ ] Time study: How long do status calls take?

---

**Document Status:** Phase 1 Complete — Ready for Phase 2 Resource Procurement
**Next Deliverable:** PHASE2-RESOURCES.md (shop contact database, outreach templates)
