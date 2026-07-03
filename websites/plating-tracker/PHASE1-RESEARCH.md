# Plating Tracker — Phase 1 Research
## Chrome Plating & Metal Finishing Order Tracking for Ashtabula County

**Date:** February 19, 2026  
**Status:** Phase 1 Research  
**Next:** Phase 2 Resource Procurement

---

## 1. Problem Statement

### The Pain Point
Plating shops and customers struggle with order status visibility:
- **No visibility:** Drop off parts, no idea when they'll be ready
- **Phone tag:** Customers call repeatedly for status updates
- **Batch processing:** Jobs grouped together, individual status unclear
- **Quality holds:** Parts fail inspection, no communication about rework
- **Rush confusion:** Rush jobs vs. standard, priority unclear
- **Pickup coordination:** Parts ready but customer doesn't know

### Impact on Plating Shops
- **Status call interruptions:** 10-20 calls/day per shop
- **Customer frustration:** Uncertainty leads to complaints
- **Rework delays:** Failed parts sit without customer notification
- **Cash flow:** Completed jobs not picked up, payment delayed

### Impact on Customers
- **Project delays:** Can't plan around uncertain delivery
- **Business impact:** Restoration shops can't commit to customer timelines
- **Multiple trips:** Drive to shop to check status
- **Trust erosion:** No transparency into process

---

## 2. Market Analysis

### Target Market Size
**Ashtabula County Plating Market:**
- **Plating shops:** 5-10 (chrome, zinc, nickel, powder coating)
- **Direct customers:** 200-400 (restoration shops, manufacturers, individuals)
- **Indirect market:** Classic car restoration, motorcycle restoration, manufacturing
- **Average order value:** $100-$2,000 (varies by part size/complexity)
- **Turnaround time:** 1-4 weeks (standard), 3-7 days (rush)

**Plating Services in Area:**
| Type | Est. Shops | Avg Order | Turnaround |
|------|------------|-----------|------------|
| Chrome plating | 2-3 | $200-$1,500 | 2-4 weeks |
| Zinc plating | 2-3 | $50-$300 | 1-2 weeks |
| Nickel plating | 1-2 | $150-$800 | 2-3 weeks |
| Powder coating | 3-5 | $75-$500 | 1-2 weeks |
| Anodizing | 1-2 | $100-$600 | 1-2 weeks |

### Local Stakeholders

**Plating Shops (Primary Users):**
| Shop Type | Count | Avg Jobs/Week | Pain Level |
|-----------|-------|---------------|------------|
| Chrome restoration | 2-3 | 20-40 | High |
| Industrial plating | 2-3 | 30-60 | Medium |
| Powder coating | 3-5 | 40-80 | Medium |
| Specialty (anodizing) | 1-2 | 15-30 | High |

**Customer Types:**
| Type | Examples | Volume | Needs |
|------|----------|--------|-------|
| Auto restoration | Classic car shops, hobbyists | High | Quality critical, timeline flexible |
| Motorcycle shops | Harley restoration, custom bikes | Medium | Aesthetic focus, rush orders |
| Manufacturers | Local factories, machine shops | High | Spec compliance, documentation |
| Marine | Boat hardware, anchors | Low | Corrosion resistance |
| Individuals | DIY restorers | Medium | Education, patience needed |

---

## 3. Competitor Analysis

### Plating-Specific Software

| Competitor | Model | Price | Features |
|------------|-------|-------|----------|
| **JobBOSS** | Shop management | $$$ | Full ERP, complex |
| **Shoptech** | Job shop software | $$$ | Scheduling, quoting |
| **E2 Shop System** | Manufacturing | $$$ | Comprehensive |

### Generic Solutions
- **Spreadsheets** — Most common, manual updates
- **Whiteboards** — Visual tracking, shop floor
- **Paper job travelers** — Physical documentation
- **Phone/text** — Informal customer updates

### What Exists Locally
- **Nothing digital** — No plating-specific tracking platform
- Shops use:
  - Paper job tickets
  - Whiteboard scheduling
  - Phone calls for status
  - Memory/experience for timing

### Gap Analysis
**✓ Opportunity Confirmed:**
- No plating-specific customer portal exists
- No local platform for Ashtabula plating shops
- Batch processing makes status complex (not one-to-one)
- Quality holds/rework need special handling

---

## 4. User Personas

### Primary: "Plater Paul" (Chrome Shop Owner)
- **Demographics:** 45-65, owns family plating business
- **Business:** 20-40 jobs/week, 2-5 employees
- **Tech comfort:** Low-moderate (basic computer use)
- **Pain points:**
  - Constant phone calls for status updates
  - Jobs grouped in batches, hard to give individual ETA
  - Parts fail inspection, need customer approval for rework
  - Rush jobs disrupt schedule, priority conflicts
- **Needs:** Simple status updates, batch management, customer communication

### Primary: "Restorer Rick" (Classic Car Restoration)
- **Demographics:** 35-55, owns restoration shop
- **Business:** 3-5 restorations/year, many parts per car
- **Tech comfort:** Moderate
- **Pain points:**
  - Can't give customer timeline without plating ETA
  - Multiple parts at different stages
  - Quality issues delay entire project
  - Rush charges add up
- **Needs:** Multi-part order tracking, quality notifications, reliable ETAs

### Secondary: "Biker Bob" (Motorcycle Enthusiast)
- **Demographics:** 40-60, hobbyist, 1-2 bike projects/year
- **Tech comfort:** High
- **Pain points:**
  - No idea when parts will be done
  - Expensive parts, anxious about status
  - Hard to plan assembly timeline
- **Needs:** Simple status check, photo updates, completion notification

### Secondary: "Manufacturer Mike" (Machine Shop)
- **Demographics:** 40-55, production manager
- **Business:** Regular plating for manufactured parts
- **Pain points:**
  - Production schedule depends on plating turnaround
  - QC documentation needed for customers
  - Volume orders, batch tracking
- **Needs:** Batch tracking, QC documentation, reliable scheduling

---

## 5. Solution Concept

### Core Concept
**"FedEx tracking for plating shops — customers see exactly where their parts are in the process, from drop-off to pickup."**

### Key Features

**For Plating Shops:**
1. **Job Tracking** — Digital work orders, status updates
2. **Batch Management** — Group jobs, track individual parts within batches
3. **Process Pipeline** — Intake → Stripping → Prep → Plating → QC → Ready
4. **Quality Holds** — Flag failed parts, request rework approval
5. **Rush Management** — Priority queue, expedited processing
6. **Customer Notifications** — Automated updates at key stages
7. **Photo Documentation** — Before/after, quality issues
8. **Pickup Scheduling** — Coordinate customer pickup times

**For Customers:**
1. **Order Tracking** — Web link showing current stage
2. **Batch Status** — See individual part status within batch
3. **ETA Updates** — Estimated completion (batch-aware)
4. **Quality Alerts** — Notification if parts need rework
5. **Photo Updates** — Visual progress, quality documentation
6. **Ready Notification** — SMS/email when order complete
7. **Pickup Scheduling** — Book pickup slot
8. **Order History** — Past jobs, reorder easily

**For Batch/Volume Customers:**
1. **Multi-Order Dashboard** — All orders, all statuses
2. **Batch Analytics** — Average turnaround, quality rates
3. **Priority Queue** — Rush request management
4. **Documentation** — QC reports, certifications

### Differentiation

| Feature | Plating Tracker | Generic Job Shop | Phone/Whiteboard |
|---------|-----------------|------------------|------------------|
| Plating-specific workflow | ✓ | Partial | ✗ |
| Batch management | ✓ | Partial | ✗ |
| Quality hold handling | ✓ | ✗ | ✗ |
| Customer self-service | ✓ | $$ | ✗ |
| Photo documentation | ✓ | Partial | ✗ |
| Local Ashtabula focus | ✓ | ✗ | ✗ |
| Affordable for small shops | ✓ ($39-99) | $200+ | Free |

---

## 6. Tech Stack Options

### Recommended: Next.js + Supabase + Twilio
- **Frontend:** Next.js 14, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Notifications:** Twilio (SMS), SendGrid (email)
- **Storage:** Supabase Storage (photos)
- **Hosting:** Vercel
- **Cost:** ~$40-80/mo (scales with shops)

### Mobile Considerations
- **Shop app:** Tablet-friendly PWA for shop floor
- **Customer:** Web-based status link (no app needed)

---

## 7. Revenue Model

### Tiered Pricing

| Tier | Price | Features | Target |
|------|-------|----------|--------|
| **Basic** | $39/mo | 50 jobs/mo, basic status, email | Small shops |
| **Pro** | $79/mo | 150 jobs, SMS, photos, rush queue | Medium shops |
| **Business** | $149/mo | Unlimited, API, white-label | Large shops, multi-location |

### Per-Job Value
- **Time saved:** 10-15 status calls/day @ 3 min = 30-45 min
- **Labor cost:** $20-35/day = $400-700/mo
- **Price:** $39-79/mo
- **ROI:** 400-1,700%

### Additional Revenue
- **SMS overage:** $0.02/message beyond included
- **Priority support:** $49/mo
- **Setup/training:** $199 one-time

---

## 8. Implementation Roadmap

### Phase 1: MVP (Weeks 1-4)
- [ ] Basic job tracking (5 stages)
- [ ] Shop dashboard
- [ ] Customer status link
- [ ] Email notifications
- [ ] 1-2 pilot plating shops

### Phase 2: Feature Complete (Weeks 5-8)
- [ ] Batch management
- [ ] Photo upload
- [ ] Quality hold workflow
- [ ] SMS notifications
- [ ] Rush queue
- [ ] 3-5 shops

### Phase 3: Scale (Weeks 9-12)
- [ ] Multi-order dashboard (restoration shops)
- [ ] QC documentation
- [ ] Mobile shop app
- [ ] 8-10 shops
- [ ] Customer accounts

### Phase 4: Expansion (Months 4-6)
- [ ] Expand to powder coating
- [ ] Machine shop integration
- [ ] Regional expansion
- [n] Wholesale customer portal

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Plating shops tech-averse | High | High | Simple UI, training, free trial |
| Batch complexity confusing | Medium | Medium | Clear UI, education |
| Customers don't use portal | Low | Medium | SMS fallback, still saves calls |
| Low shop density (only 5-10) | High | Medium | Expand to powder coating, machine shops |
| Competing with generic software | Low | Medium | Plating-specific features, price |

---

## 10. Open Questions for Phase 2

### Shop Research
1. [ ] How many status calls per day?
2. [ ] Average batch size (parts per batch)?
3. [ ] What's the typical process flow (stages)?
4. [ ] How often do parts fail QC and need rework?
5. [ ] What percentage of jobs are rush vs. standard?

### Customer Research
6. [ ] How often do they call for status updates?
7. [ ] What's the average order value?
8. [ ] Would they pay for rush service visibility?

### Market Research
9. [ ] Which plating shops are still operating?
10. [ ] Are there powder coating shops that would use this?

---

## 11. Success Metrics

### 90-Day Targets
- [ ] 2-3 pilot plating shops
- [ ] 100+ jobs tracked
- [ ] 50% customer use status link
- [ ] 30% reduction in status calls
- [ ] $300+ MRR

### 6-Month Targets
- [ ] 5-8 plating/powder coating shops
- [ ] 500+ jobs/month
- [ ] 10 restoration shop customers
- [ ] Expand to adjacent counties
- [ ] $1,500+ MRR

---

## 12. Next Steps (Phase 2)

### Immediate Actions
1. **Plating shop outreach**
- [ ] Research active plating shops in Ashtabula County
- [ ] Contact chrome restoration specialists
- [ ] Visit powder coating shops
- [ ] Survey shop owners about current process

2. **Customer outreach**
- [ ] Classic car restoration shops
- [ ] Motorcycle customizers
- [ ] Machine shops with plating needs

3. **Process research**
- [ ] Document typical plating workflow
- [ ] Understand batch processing complexity
- [ ] Identify QC failure handling

4. **Competitor research**
- [ ] Demo job shop software
- [ ] Document pricing

---

**Document Status:** Phase 1 Complete — Ready for Phase 2 Resource Procurement
**Next Deliverable:** PHASE2-RESOURCES.md (plating shop contacts, process research)
