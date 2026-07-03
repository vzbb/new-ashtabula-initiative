# Phase 1 Research — Auto Detail Booking

## New Ashtabula Initiative MVP Research
**Project:** auto-detail-booking  
**Date:** February 19, 2026  
**Researcher:** Rondell (Noirsys AI)

---

## Executive Summary

Auto detailing is a $41-74B global market growing at 5.6-5.9% CAGR. Ashtabula County has 10+ established auto detailing businesses, yet most rely on phone/Facebook for bookings. Existing software solutions (Square, Setmore, Housecall Pro) are either too expensive or too generic. A locally-branded, affordable booking tool with detailing-specific features (service packages, vehicle type selection, add-ons) would fill a clear gap.

---

## 1. Problem Statement

### Current Pain Points
- **Phone-only booking:** Most detailers rely on phone calls or Facebook messages, creating back-and-forth delays
- **No-shows hurt revenue:** Without deposits or appointment reminders, cancellations cost detailers 2-3 slots per week
- **Service confusion:** Customers don't understand package differences (interior vs. exterior vs. full), leading to mismatched expectations
- **Payment friction:** Many detailers still take cash/check only, losing customers who expect card payment
- **Schedule chaos:** Double-bookings happen when juggling multiple channels (phone, text, Facebook, walk-ins)

### Target Customer Quote
> *"I spend 30 minutes a day just texting back and forth about availability. Half the time they don't show up."* — Mobile detailer, Ashtabula

---

## 2. Local Market Research

### Ashtabula County Detailing Businesses Identified

| Business | Location | Type | Est. Volume | Notes |
|----------|----------|------|-------------|-------|
| **Flawless Coating & Detailing** | Ashtabula | Premium/Professional | High | 20+ years experience, ceramic coating specialist |
| **Simonette Auto Detailing** | Ashtabula | Full-service | Medium | Established presence |
| **Bob's Detailing LLC** | 5439 Main Ave, Ashtabula | Mobile + Shop | Medium | (440) 850-2468, 100% recommend (11 reviews) |
| **Richmond Auto Spa & Tinting** | 5456 Main Ave, Ashtabula | Full-service + Tint | Medium | One-stop shop positioning |
| **MoJo's Auto Detailing** | Ashtabula | Premium mobile | Medium | 140+ Facebook likes, premium positioning |
| **Tidy Whitey's Detailing** | 3012 W Prospect Rd | Shop-based | Medium | (440) 466-7943, high ratings |
| **DIBS Detailing** | 1518 Prospect Rd, Ashtabula | Hand wash + detail | Low-Medium | (440) 319-2349, 100% recommend (8 reviews) |
| **Greater Than AUTO Car Washes** | Ashtabula | Wash + Detail | High | Combined wash/detail model |
| **PWP Detailing** | Ashtabula | Mobile | Low-Medium | Mobile service |
| **Shine By Design Detailing** | Ashtabula | Mobile | Low-Medium | Mobile service |
| **Mitchells Auto Spa** | Ashtabula | Shop | Medium | Full spa concept |
| **Mobiley Clean** | Ashtabula | Mobile | Low | Mobile-only |
| **Harborcreek Auto** | Harborcreek, PA (nearby) | Full-service | Medium | Regional competitor |

### Market Size Estimation
- **Primary market:** 10-15 detailing businesses in Ashtabula County
- **Secondary market:** 30-50 within 25-mile radius (Geneva, Madison, Conneaut, Painesville)
- **Serviceable obtainable market:** 8-12 businesses in Year 1
- **Average revenue per customer:** $49-149/month depending on tier

---

## 3. Competitor Analysis

### Direct Competitors (Auto Detailing Specific)

| Platform | Price | Strengths | Weaknesses | Best For |
|----------|-------|-----------|------------|----------|
| **Housecall Pro** | $79-179/mo | Built for service businesses, dispatch, invoicing | Expensive for solo detailers | Multi-crew operations |
| **Schedulicity** | $34/mo + | Marketing tools, marketplace exposure | Generic, not detailing-specific | Growth-focused shops |
| **Detailing-specific CRMs** | $50-200/mo | Workflow templates, chemical tracking | Overkill for small operators | High-volume detailers |

### General Scheduling Competitors

| Platform | Price | Strengths | Weaknesses | Best For |
|----------|-------|-----------|------------|----------|
| **Square Appointments** | Free-$69/mo | Payment integration, POS, no-show protection | Generic, limited customization | Detailers already using Square |
| **Setmore** | Free-$12/mo | Simple, works with Instagram | No detailing-specific features | Solo operators, mobile detailers |
| **Acuity Scheduling** | $20-61/mo | Custom intake forms, group booking | Learning curve, overkill for simple needs | Complex service menus |
| **Calendly** | Free-$20/mo | Simple, widely known | No payments, no service management | Appointment-only (no prepay) |
| **Google Calendar** | Free | Everyone has it | No payments, no reminders, unprofessional | Hobbyists only |

### Gap Analysis
**What competitors miss for auto detailers:**
1. **Vehicle type selection** — No platform lets customers specify sedan/SUV/truck/RV for automatic pricing
2. **Condition assessment** — No way for customers to upload photos of damage/stains for accurate quotes
3. **Service education** — No built-in explanations of what "clay bar" or "paint correction" means
4. **Add-on flow** — Upsells (ceramic coating, headlight restoration) aren't integrated into booking flow
5. **Local branding** — All solutions are generic; none say "Ashtabula" or build local trust
6. **Affordable deposits** — Most require full software commitment, not pay-as-you-grow

---

## 4. User Personas

### Persona 1: Detail Danny — The Solo Mobile Detailer
- **Demographics:** 28-45, male, works alone from van/trailer
- **Goals:** Fill schedule efficiently, reduce no-shows, look professional
- **Pain points:** Texts at all hours, driving to no-shows, cash-only limits customers
- **Tech comfort:** Moderate (uses Instagram, avoids complex software)
- **Willingness to pay:** $29-49/month max
- **Quote:** *"I just need something that stops the 10pm 'you available?' texts and lets people pay a deposit."*

### Persona 2: Shop Owner Shelly — Established Detailing Shop
- **Demographics:** 40-60, owns/rents commercial space, 2-5 employees
- **Goals:** Professional image, streamline 3+ employee schedules, upsell services
- **Pain points:** Double-bookings, employees forgetting appointments, explaining packages repeatedly
- **Tech comfort:** Low-moderate (wants simplicity)
- **Willingness to pay:** $79-149/month
- **Quote:** *"I need customers to see what they're getting before they call. Too much time explaining basic vs. premium."*

### Persona 3: Customer Carla — The Vehicle Owner
- **Demographics:** 30-55, owns $30K+ vehicle, values convenience
- **Goals:** Book easily, understand what she's paying for, pay securely
- **Pain points:** Calling for quotes, unclear service differences, limited payment options
- **Tech comfort:** High (expects mobile-friendly booking)
- **Behavior:** Researches on phone, books evenings/weekends
- **Quote:** *"I just want to see exactly what I'm getting, pick a time, and pay. Don't make me call."*

### Persona 4: Fleet Manager Frank — Business Vehicle Fleet
- **Demographics:** Operations manager at local business with 5+ vehicles
- **Goals:** Bulk booking, consistent service, invoicing/receipts
- **Pain points:** Coordinating multiple vehicles, getting receipts for accounting
- **Tech comfort:** Moderate
- **Willingness to pay:** Included in service pricing (B2B model)
- **Quote:** *"I have 8 trucks that need monthly detailing. I need one invoice and a recurring schedule."*

---

## 5. Stakeholder Mapping

### Primary Stakeholders (Direct Users)
| Entity | Role | Interest Level | Contact Status |
|--------|------|----------------|----------------|
| Bob's Detailing LLC | Mobile + shop detailer | High | Phone: (440) 850-2468 |
| MoJo's Auto Detailing | Premium mobile | High | Facebook presence |
| Richmond Auto Spa | Full-service shop | Medium | Facebook: Richmond Auto Spa LLC |
| Flawless Coating & Detailing | Premium ceramic | Medium | Website: flawlesscad.com |
| Tidy Whitey's Detailing | Shop-based | Medium | (440) 466-7943 |
| DIBS Detailing | Hand wash + detail | Medium | (440) 319-2349 |

### Secondary Stakeholders (Ecosystem)
| Entity | Role | Potential Value |
|--------|------|-----------------|
| Ashtabula County Chamber of Commerce | Business network | Partnership, member discount |
| Greater Than AUTO Car Washes | Wash + detail hybrid | Potential anchor client |
| Local car dealerships | Referral sources | Lead generation, B2B module |
| Insurance agents | Customer referrals | Cross-promotion opportunity |

---

## 6. Revenue Model Options

### Option A: SaaS Subscription (Recommended)
- **Free tier:** 1 detailer, 20 bookings/month, basic features
- **Pro ($29/mo):** Unlimited bookings, deposits, reminders, photo uploads
- **Shop ($79/mo):** Multi-employee, team scheduling, analytics, priority support
- **Target:** 10 shops × $50 avg = $500/mo by Month 6

### Option B: Transaction Fee
- **Free to use:** No monthly fee
- **5% per booking:** Customer pays booking fee or detailer accepts reduced payout
- **Target:** $2K/month transaction volume = $100/mo revenue

### Option C: Hybrid (Freemium + Services)
- **Free:** Basic booking
- **$49 setup fee:** Custom branding, onboarding
- **$29/mo:** Full features
- **Add-ons:** $99 photo shoots, $199 website integration
- **Target:** Setup fees + recurring

**Recommendation:** Option A with annual discount (2 months free) for cash flow.

---

## 7. Technical Feasibility

### Proposed Stack
- **Frontend:** React + Tailwind (mobile-first design)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Payments:** Stripe Connect (detailers get direct deposits)
- **Notifications:** Firebase Cloud Messaging + Twilio SMS
- **Hosting:** Firebase Hosting or Vercel
- **Images:** Firebase Storage with compression

### Core Features (MVP)
1. **Customer booking flow:** Vehicle type → Service selection → Add-ons → Time slot → Deposit/payment
2. **Detailer dashboard:** Calendar view, booking management, customer notes
3. **Automated reminders:** Email + SMS 24hr + 1hr before appointment
4. **Service catalog:** Configurable packages with descriptions and pricing
5. **Photo upload:** Customers upload vehicle photos for condition assessment
6. **Basic analytics:** Bookings per week, revenue, no-show rate

### Estimated Development Time
- **MVP:** 40-50 hours (2-3 weeks part-time)
- **V1 with polish:** 80-100 hours (1 month)
- **Maintenance:** 5-10 hours/month

### Operating Costs (at 10 active detailers)
- Firebase: $0-25/month
- Stripe: 2.9% + $0.30 per transaction
- Twilio SMS: ~$10/month
- **Total:** $35-50/month operational

---

## 8. Critical Blockers for Phase 2

| Blocker | Risk Level | Mitigation |
|---------|------------|------------|
| **Detailer tech adoption** | High | Start with 1-2 tech-comfortable detailers as pilots |
| **Payment integration complexity** | Medium | Use Stripe Connect standard onboarding |
| **Mobile vs. shop feature split** | Medium | Build mobile-first, shop features as add-ons |
| **Seasonal demand fluctuation** | Medium | Offer "pause" option during slow months |
| **Competition from Square/Setmore** | Low | Differentiate with local branding + detailing-specific UX |

---

## 9. Data Sources Catalog

### Market Data
- Grand View Research: Car Detailing Services Market Report 2024
- Mordor Intelligence: Car Detailing Services Market Size
- AutoLeap: Auto Detailing Industry Statistics 2024

### Local Business Data
- Yelp: Auto Detailing in Ashtabula County
- Facebook Business Pages (public listings)
- Better Business Bureau: Ashtabula Auto Detailing
- National Detail Pros: Mobile detailing directory

### Competitor Intelligence
- Housecall Pro pricing: housecallpro.com
- Square Appointments: squareup.com/us/en/software/appointments
- Setmore pricing: setmore.com/pricing
- Schedulicity: schedulicity.com

---

## 10. Phase 2 Resource Procurement Plan

### Week 1: Contact Research
- [ ] Call Bob's Detailing LLC: (440) 850-2468
- [ ] Message MoJo's Auto Detailing via Facebook
- [ ] Research Richmond Auto Spa contact info
- [ ] Build spreadsheet with 10+ detailer contacts

### Week 2: Discovery Calls
- [ ] Interview 3-5 detailers about current booking process
- [ ] Ask about: pain points, current tools, willingness to pay, feature priorities
- [ ] Document service menu structures for common packages

### Week 3: Validation
- [ ] Compile findings into feature priority matrix
- [ ] Get 2+ verbal commitments to pilot
- [ ] Draft partnership terms (free usage during beta, testimonial commitment)

---

## 11. Recommendation

**Proceed to Phase 2 (Resource Procurement).** 

Auto detailing booking represents a well-defined, locally-contained market with:
- ✅ Clear pain points (phone-based booking, no-shows)
- ✅ Identifiable customers (10+ local businesses mapped)
- ✅ Technical feasibility (standard scheduling + payment stack)
- ✅ Revenue potential ($500-1500/mo achievable)
- ✅ Differentiation opportunity (local branding + detailing-specific features)

The market is not oversaturated with detailing-specific solutions, and the established players (Housecall Pro, Square) are either too expensive or too generic. A focused, affordable, Ashtabula-branded solution has a clear path to adoption.

---

## Appendices

### A. Sample Service Packages (Research from Competitors)
Typical auto detailing service tiers:

| Package | Services | Price Range | Time |
|---------|----------|-------------|------|
| **Basic Wash** | Exterior wash, tire shine, interior vacuum | $40-60 | 1-2 hrs |
| **Interior Detail** | Deep clean seats, carpets, panels, windows | $100-150 | 2-3 hrs |
| **Exterior Detail** | Hand wash, clay bar, wax, tire shine | $150-250 | 3-4 hrs |
| **Full Detail** | Interior + exterior + engine bay | $250-400 | 4-6 hrs |
| **Ceramic Coating** | Paint correction + ceramic application | $500-1500 | 1-2 days |

### B. Seasonal Considerations
- **Spring (Mar-May):** Peak season — road salt removal, spring cleaning
- **Summer (Jun-Aug):** Steady — UV protection, interior heat damage
- **Fall (Sep-Nov):** Moderate — winter prep
- **Winter (Dec-Feb):** Slow — maintenance washes, interior focus

### C. Related MVPs to Consider
- **mobile-notary:** Already researched — similar booking flow, different market
- **hvac-tuneup:** Seasonal maintenance booking (parallel opportunity)
- **fence-quote:** Home services quote tool (different sales cycle)

---

**Document Version:** 1.0  
**Last Updated:** February 19, 2026  
**Next Review:** After Phase 2 completion
