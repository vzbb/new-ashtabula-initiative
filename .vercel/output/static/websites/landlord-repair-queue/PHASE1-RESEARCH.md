# Landlord Repair Queue — Phase 1 Research
## Maintenance Coordination Platform for Ashtabula County Property Managers

**Date:** February 19, 2026  
**Status:** Phase 1 Research  
**Next:** Phase 2 Resource Procurement

---

## 1. Problem Statement

### The Pain Point
Property managers and landlords in Ashtabula County struggle with maintenance coordination:
- **Tenant frustration:** Maintenance requests go into black hole, no status updates
- **Phone tag:** Constant calls between tenants, landlords, and contractors
- **No prioritization:** Can't triage urgent (heat out) vs. cosmetic (paint touch-up)
- **Lost requests:** Text messages, emails, phone calls scattered everywhere
- **Vendor coordination:** Hard to dispatch right contractor for right job
- **Documentation gaps:** No photo evidence, no repair history tracking
- **After-hours emergencies:** No system for urgent 24/7 issues

### Impact on Property Managers
- **Time drain:** 10-15 hours/week on maintenance coordination
- **Tenant turnover:** Slow repairs = non-renewals = vacancy costs
- **Legal risk:** Documented repair requests protect against liability
- **Vendor management:** No tracking of contractor performance

### Impact on Tenants
- **Quality of life:** Living with broken appliances, heating issues
- **Uncertainty:** Never know when repair will happen
- **Accessibility:** Elderly/disabled tenants can't easily call repeatedly

---

## 2. Market Analysis

### Target Market Size
**Ashtabula County Rental Market:**
- **Rental units:** ~12,000-15,000 (35-40% of housing stock)
- **Property managers:** 
  - Professional management companies: ~15-25
  - Independent landlords (5+ units): ~100-150
  - Small landlords (1-4 units): ~800-1,200
- **Average units per manager:** 50-200 (professionals), 5-20 (independents)
- **Maintenance requests:** 2-4 per unit per year
- **Total annual requests:** ~30,000-60,000

**Repair Contractor Market:**
- **HVAC contractors:** 15-25
- **Plumbers:** 20-30
- **Electricians:** 15-25
- **General handymen:** 40-60
- **Appliance repair:** 8-12
- **Locksmiths:** 5-8
- **Roofing:** 10-15
- **Landscaping:** 20-30

### Local Stakeholders

**Property Management Companies (Primary):**
| Company | Type | Est. Units | Notes |
|---------|------|------------|-------|
| **Ashtabula Management Group** | Professional | 500+ | Largest in county |
| **Lake Erie Properties** | Professional | 300+ | Geneva focus |
| **AMHA (Ashtabula Metropolitan Housing Authority)** | Public | 800+ | Government |
| **Various independent** | Small | 10-100 | Scattered |

**Landlord Types:**
| Type | Count | Units Each | Pain Level |
|------|-------|------------|------------|
| Professional PM | 15-25 | 50-500 | Medium (have some systems) |
| Independent (5-20 units) | 100-150 | 5-20 | High (doing it manually) |
| Small landlords | 800-1,200 | 1-4 | Low (DIY manageable) |

---

## 3. Competitor Analysis

### Property Management Software

| Competitor | Model | Price | Features | Local Fit |
|------------|-------|-------|----------|-----------|
| **AppFolio** | Full PM suite | $200-400/mo + setup | Complete but expensive | Overkill for small operators |
| **Buildium** | PM software | $50-200/mo | Good features, learning curve | Moderate |
| **Propertyware** | Enterprise PM | $250+/mo | Complex, for large portfolios | Too big |
| **Rentec Direct** | PM software | $35-100/mo | Affordable, basic | Good for midsize |
| **TenantCloud** | Freemium | $0-50/mo | Limited features | Entry level |

### Maintenance-Specific Tools

| Competitor | Model | Price | Focus |
|------------|-------|-------|-------|
| **HappyCo** | Inspection/maintenance | Custom | Move-in/move-out inspections |
| **Landlord Studio** | Accounting + maintenance | $15-40/mo | Part of broader suite |
| **RentRedi** | Tenant app + maintenance | $20-50/mo | Tenant-facing |
| **Latchel** | Maintenance outsourcing | Per-work-order | Full service, expensive |
| **TaskEasy** | Landscaping only | Per-job | Single category |

### What Exists Locally
- **Nothing** — No Ashtabula-specific maintenance coordination platform
- Current methods:
  - Phone calls and texts
  - Email threads
  - Spreadsheet tracking
  - Property management software (expensive)
  - Paper work orders

### Gap Analysis
**✓ Opportunity Confirmed:**
- No affordable, maintenance-focused tool for small-medium property managers
- Existing PM software is overkill/expensive for 5-50 unit landlords
- No local contractor network integration
- No tenant-facing mobile app for local market

---

## 4. User Personas

### Primary: "Manager Maria" (Property Manager)
- **Demographics:** 35-55, manages 50-150 units
- **Business:** Professional property management company
- **Tech comfort:** Moderate (uses software, not power user)
- **Pain points:**
  - 50+ maintenance requests per month
  - Constant phone calls from tenants
  - Hard to track which contractor did what
  - No visibility into repair status
  - After-hours emergencies disrupt personal life
- **Needs:** Centralized queue, vendor management, tenant portal, mobile app

### Primary: "Landlord Larry" (Independent Landlord)
- **Demographics:** 45-65, owns 8-20 rental units
- **Business:** Side income, not full-time
- **Tech comfort:** Low-Moderate (smartphone, basic computer)
- **Pain points:**
  - Maintenance calls interrupt day job
  - Can't remember which tenant reported what
  - Hard to find reliable contractors
  - Tenants text at all hours
- **Needs:** Simple system, affordable, reduces phone calls

### Secondary: "Tenant Tina" (Renter)
- **Demographics:** 25-45, rents apartment/house
- **Tech comfort:** High
- **Pain points:**
  - Called landlord 3 times about leaky faucet, no response
  - Doesn't know if repair is scheduled
  - Can't report issues after business hours
- **Needs:** Easy request submission, status updates, photo upload

### Secondary: "Handyman Hank" (Repair Contractor)
- **Demographics:** 30-55, independent repair person
- **Business:** Serves 10-20 property managers
- **Tech comfort:** Moderate (smartphone)
- **Pain points:**
  - Gets calls from multiple managers, hard to track
  - No scheduling system
  - Invoicing is disorganized
- **Needs:** Job dispatch, scheduling, payment tracking

---

## 5. Solution Concept

### Core Concept
**"Zendesk for property maintenance — tenants submit requests, managers triage and dispatch, contractors complete and bill, everyone stays informed."**

### Key Features

**For Tenants:**
1. **Mobile Request Submission** — Photo + description + urgency
2. **Status Tracking** — See if request is received, assigned, in progress, complete
3. **Messaging** — Communicate with manager/contractor in app
4. **Emergency Hotline** — After-hours urgent issues
5. **History** — View past requests and repairs

**For Property Managers:**
1. **Unified Queue** — All requests in one dashboard
2. **Smart Triage** — Auto-prioritize by urgency and category
3. **Vendor Dispatch** — Assign to preferred contractors
4. **Scheduling** — Coordinate tenant availability
5. **Photo Documentation** — Before/after repair photos
6. **Cost Tracking** — Budget vs. actual spend
7. **Tenant Communication** — Automated status updates
8. **Reports** — Maintenance spend by property, vendor performance

**For Contractors:**
1. **Job App** — Receive dispatch notifications
2. **Scheduling** — Accept/decline, set arrival time
3. **Work Orders** — Access details, tenant contact
4. **Photo Upload** — Document completion
5. **Invoicing** — Submit bills through platform
6. **Payment Tracking** — See what's paid/pending

### Differentiation

| Feature | Repair Queue | AppFolio | Buildium | Text/Email |
|---------|--------------|----------|----------|------------|
| Tenant mobile app | ✓ | ✓ | ✓ | ✗ |
| Photo documentation | ✓ | ✓ | ✓ | ✗ |
| Vendor dispatch | ✓ | ✓ | ✓ | ✗ |
| Affordable for small PMs | ✓ ($29-79) | ✗ ($200+) | ✗ ($50+) | ✓ |
| Ashtabula contractor network | ✓ | ✗ | ✗ | ✗ |
| Local focus | ✓ | ✗ | ✗ | ✓ |
| After-hours emergency routing | ✓ | ✓ | ✓ | ✗ |

---

## 6. Tech Stack Options

### Recommended: Next.js + Supabase + Twilio
- **Frontend:** Next.js 14, Tailwind CSS
- **Mobile:** React Native or PWA
- **Database:** Supabase (PostgreSQL)
- **Notifications:** Twilio (SMS), Firebase (push)
- **Storage:** Supabase Storage (photos)
- **Hosting:** Vercel
- **Cost:** ~$50-100/mo (scales with units)

### Alternative: No-Code
- **Platform:** Bubble or Webflow
- **Database:** Airtable
- **Cost:** ~$50-80/mo
- **Pros:** Faster to build
- **Cons:** Limited customization, scaling limits

---

## 7. Revenue Model

### Tiered Pricing

| Tier | Price | Features | Target |
|------|-------|----------|--------|
| **Free** | $0 | 10 units, basic queue, email only | Small landlords testing |
| **Pro** | $29/mo | 50 units, full features, SMS | Independent landlords |
| **Business** | $79/mo | 200 units, vendor network, analytics | Small PM companies |
| **Enterprise** | $199/mo | Unlimited, API access, custom | Large PM companies |

### Per-Unit Pricing (Alternative)
| Units | Price/Unit/Mo |
|-------|---------------|
| 1-10 | $2 |
| 11-50 | $1.50 |
| 51-200 | $1 |
| 200+ | $0.75 |

### Contractor Network Revenue
- **Lead fee:** $5-10 per dispatched job
- **Priority placement:** $25/mo for featured contractor status

### Example Economics (Pro tier, 30 units):
- Monthly subscription: $29
- Maintenance requests: 6/month
- Time saved: 8 hours @ $25/hr = $200
- **ROI: 690%**

---

## 8. Implementation Roadmap

### Phase 1: MVP (Weeks 1-4)
- [ ] Tenant request form (web)
- [ ] Manager dashboard (queue, assign)
- [ ] Basic status tracking
- [ ] Email notifications
- [ ] 2-3 pilot property managers

### Phase 2: Feature Complete (Weeks 5-8)
- [ ] Mobile apps (tenant + manager)
- [ ] Photo upload
- [ ] SMS notifications
- [ ] Vendor dispatch system
- [ ] 10-15 property managers

### Phase 3: Scale (Weeks 9-12)
- [ ] Vendor network (contractor app)
- [ ] Emergency after-hours routing
- [ ] Reporting and analytics
- [ ] 30+ property managers
- [ ] Contractor marketplace

### Phase 4: Expansion (Months 4-6)
- [ ] Expand to Lake County
- [ ] Integration with accounting software (QuickBooks)
- [ ] Preventive maintenance scheduling
- [ ] Inspection checklists
- [ ] Tenant screening integration

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Property managers resist new system | Medium | High | Free tier, easy onboarding, import tools |
| Tenants won't use app | Low | Medium | SMS fallback, simple web form |
| Contractors won't participate | Medium | Medium | Pay-per-lead incentive, simple app |
| Competing with free solutions | Medium | Medium | Superior UX, local contractor network |
| Seasonal low activity | Low | Low | Year-round maintenance needs |

---

## 10. Open Questions for Phase 2

### Property Manager Research
1. [ ] What's the average maintenance requests per unit per year?
2. [ ] How many hours per week spent on maintenance coordination?
3. [ ] What software (if any) currently used for tracking?
4. [ ] What's the biggest pain point: tenant communication or vendor management?
5. [ ] Would they pay $29-79/mo for maintenance-only tool?

### Tenant Research
6. [ ] How do they currently report maintenance issues?
7. [ ] Would they use a mobile app for requests?
8. [ ] What's most frustrating about current maintenance process?

### Contractor Research
9. [ ] How do they currently receive job requests?
10. [ ] Would they pay $5-10 per lead for qualified jobs?

---

## 11. Success Metrics

### 90-Day Targets
- [ ] 5-10 pilot property managers
- [ ] 200+ units under management
- [ ] 100+ maintenance requests processed
- [ ] 10-15 contractors in network
- [ ] $500+ MRR

### 6-Month Targets
- [ ] 30+ property managers
- [ ] 1,000+ units
- [ ] 500+ requests/month
- [ ] 50+ contractors
- [ ] $3,000+ MRR

---

## 12. Next Steps (Phase 2)

### Immediate Actions
1. **Property manager outreach**
   - [ ] Ashtabula Management Group — contact needed
   - [ ] Lake Erie Properties — contact needed
   - [ ] AMHA — public info available
   - [ ] Local landlords (Facebook groups, BiggerPockets)

2. **Contractor recruitment**
   - [ ] HVAC contractors (5-10)
   - [ ] Plumbers (5-10)
   - [ ] Handymen (10-15)
   - [ ] Appliance repair (3-5)

3. **Competitor research**
   - [ ] Sign up for Buildium trial
   - [ ] Test Rentec Direct
   - [ ] Document feature gaps

4. **Validation**
   - [ ] Survey 10 property managers
   - [ ] Survey 20 tenants
   - [ ] Interview 5 contractors

---

## Appendix A: Maintenance Categories & Urgency

### Emergency (24-hour response)
- No heat (winter)
- No water
- Sewer backup
- Electrical hazard
- Security issue (broken lock/window)
- Gas leak

### Urgent (3-5 day response)
- Appliance not working
- Plumbing leak (not emergency)
- HVAC not cooling (summer)
- Pest issues

### Routine (1-2 week response)
- Cosmetic repairs
- Paint touch-ups
- Minor fixtures
- Landscaping

### Scheduled (30+ day response)
- Upgrades
- Renovations
- Preventive maintenance

---

**Document Status:** Phase 1 Complete — Ready for Phase 2 Resource Procurement
**Next Deliverable:** PHASE2-RESOURCES.md (property manager contacts, contractor database)
