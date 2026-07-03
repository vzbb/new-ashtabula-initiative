# service-scheduler — Phase 1 Research
## Appointment Booking Platform for Ashtabula Service Businesses

**Date:** 2026-02-18  
**Status:** Phase 1 Complete — Ready for Phase 2 (Resource Procurement)  
**Researcher:** Rondell (Noirsys AI)

---

## Executive Summary

**service-scheduler** is a lightweight, mobile-first appointment booking platform designed specifically for small service businesses in Ashtabula County. The global appointment scheduling software market is projected to grow significantly, with SaaS-based solutions commanding ~63.5% market share. However, existing solutions (Calendly, Square, Acuity) are either too expensive for micro-businesses or too complex for non-technical owners.

**Key Finding:** There is a clear market gap for a **free-to-use, locally-branded** scheduling tool that requires minimal setup and serves Ashtabula's unique seasonal business patterns.

---

## 1. Problem Statement

### Small Business Pain Points

| Pain Point | Impact | Current Workaround |
|------------|--------|-------------------|
| Phone-only booking | Lost customers who won't call | Facebook DMs, missed opportunities |
| Double-bookings | Frustrated customers, reputation damage | Paper calendars, memory-based |
| No-show appointments | Lost revenue, idle staff | None — absorb the cost |
| Scheduling friction | Abandoned inquiries | Back-and-forth messaging |
| Lack of reminders | Forgotten appointments | Manual text/call reminders |
| Complex existing tools | Abandon expensive subscriptions | Return to phone/paper |

### The "Appointment Anxiety" Gap
Research shows that **the longer the gap between scheduling and appointment, the higher the no-show rate**. Small businesses without automated reminder systems experience 15-30% no-show rates vs. 5-10% for those with automated reminders.

---

## 2. Market Analysis

### Global Market Context
- **Market Size:** Appointment scheduling software market growing steadily (exact figures vary by source, but all indicate sustained growth)
- **Deployment:** Web-based/SaaS leads with ~63.5% market share in 2024
- **Trend:** Consumer expectation of "digital-first" booking experience — businesses without it risk losing customers to competitors

### Competitor Landscape

| Competitor | Free Tier | Paid Starting | Key Limitations |
|------------|-----------|---------------|-----------------|
| **Calendly** | Yes (1 event type, 1 calendar) | $10-12/mo | Limited free features, Calendly branding |
| **Square Appointments** | Yes (individuals) | $29/mo+ | Best for Square payment users, feature bloat |
| **Acuity Scheduling** | No | $20/mo | No free plan, Squarespace-owned |
| **Fresha** | Yes | Paid add-ons | Salon/spa focused, not general service |
| **Goldie** | Limited | $20/mo+ | Mobile-first but limited customization |

### The Ashtabula Gap
**No existing solution adequately serves:**
1. **Single-person businesses** (barbers, auto detailers, HVAC techs)
2. **Seasonal businesses** (lawn care, snow removal, tourism services)
3. **Non-technical owners** who can't configure complex systems
4. **Free/low-cost requirement** for businesses with tight margins

---

## 3. Target User Personas

### Persona 1: "Solo Sarah" — Independent Stylist
- **Profile:** Hair stylist/barber, works alone, books 10-15 appointments/day
- **Current Process:** Phone, text, Facebook — chaos during busy periods
- **Pain Points:** Double-bookings, no-shows, can't take bookings while working
- **Tech Comfort:** Moderate — uses smartphone, avoids complex software
- **Willingness to Pay:** $0-10/month max; wants free option

### Persona 2: "Seasonal Steve" — Lawn/Snow Service Owner
- **Profile:** Runs 2-3 crews, highly seasonal (April-Nov lawn, Dec-Mar snow)
- **Current Process:** Whiteboard, group text, phone tag
- **Pain Points:** Route optimization, crew scheduling, weather cancellations
- **Tech Comfort:** Low — prefers simple, visual tools
- **Willingness to Pay:** Would pay for route optimization, basic scheduling should be free

### Persona 3: "Mechanic Mike" — Auto Shop Owner
- **Profile:** 2-bay shop, books repair appointments, needs vehicle info upfront
- **Current Process:** Phone only, intake form on clipboard
- **Pain Points:** Wasted time on unsuitable appointments, no customer info capture
- **Tech Comfort:** Low-moderate — uses shop management software but it's clunky
- **Willingness to Pay:** $15-25/month for integrated system

### Persona 4: "Therapist Tina" — Wellness Practitioner
- **Profile:** Massage therapist, works from home/small studio
- **Current Process:** DM scheduling, manual calendar
- **Pain Points:** Clients forget appointments, no buffer between sessions
- **Tech Comfort:** Moderate — uses Instagram for marketing, needs simple integration
- **Willingness to Pay:** $5-15/month for professional appearance

---

## 4. Ashtabula Market Landscape

### Service Business Categories (High Opportunity)

| Category | Est. Count | Booking Need | Current Solution |
|----------|-----------|--------------|------------------|
| Hair/Beauty Salons | 25-40 | High | Phone, Facebook, some Fresha |
| Auto Repair/Detail | 15-25 | High | Phone, walk-ins |
| HVAC/Plumbing | 10-15 | Medium-High | Phone, dispatch software |
| Lawn/Landscaping | 20-30 | Seasonal | Phone, whiteboard |
| Pet Grooming | 5-10 | Medium | Phone |
| Massage/Wellness | 8-12 | Medium | Phone, DMs |
| Tattoos/Piercing | 5-8 | High | Instagram DMs |
| Photography | 10-15 | Medium | Phone, email |
| Home Repair/Handyman | 15-25 | Medium | Phone |

### Stakeholder Map

**Primary Stakeholders:**
1. **Greater Ashtabula Chamber of Commerce** — Member directory, business support
2. **Small Business Development Center (SBDC) at YSU** — Counseling, training
3. **Growth Partnership for Ashtabula County** — Economic development
4. **Individual Business Owners** — Direct users

**Potential Partners:**
- **Visit Ashtabula County** — Tourism-related service bookings
- **Downtown Ashtabula Development** — Retail appointment shopping
- **Local Trade Schools** — Student client booking for services

---

## 5. Data Sources & APIs

### Technical Resources
| Resource | Purpose | Access |
|----------|---------|--------|
| **Google Calendar API** | Sync with existing calendars | OAuth, free tier |
| **Twilio** | SMS reminders | Pay-per-message |
| **SendGrid/Mailgun** | Email notifications | Free tier available |
| **Supabase/Firebase** | Database, auth, hosting | Generous free tier |
| **Cal.com Open Source** | Self-hosted alternative | MIT license |

### Local Data Sources
1. **Ashtabula Chamber Business Directory** — https://www.ashtabulachamber.net/business-directory
2. **Yelp Ashtabula** — Business listings with review data
3. **Facebook Business Pages** — Active business discovery
4. **Google Maps API** — Location data, business hours

---

## 6. MVP Feature Hypothesis

### Core MVP (Free Tier)
- [ ] Simple booking page per business (public URL)
- [ ] Basic service/appointment type setup
- [ ] Google Calendar sync
- [ ] Automated email reminders (24hr + 1hr)
- [ ] Mobile-friendly interface
- [ ] Simple admin dashboard

### Pro Tier ($9-19/month)
- [ ] SMS reminders
- [ ] Multiple staff/team members
- [ ] Custom branding (logo, colors)
- [ ] Recurring appointments
- [ ] Buffer time between appointments
- [ ] Intake forms/custom fields
- [ ] Payment integration (Stripe)

### Local Differentiation
- [ ] "Book Local Ashtabula" discovery directory
- [ ] Seasonal business mode (enable/disable by season)
- [ ] Simple route optimization for mobile services
- [ ] Integration with local event calendars
- [ ] Co-marketing with Chamber of Commerce

---

## 7. Open Questions (for Phase 2)

### Business Questions
1. How many local businesses currently use any online scheduling?
2. What's the average no-show rate for Ashtabula service businesses?
3. Which business categories have the highest pain/friction?
4. What is the typical appointment lead time (booking to service)?
5. Would businesses pay for SMS reminders vs. email only?

### Technical Questions
1. How many businesses currently use Google Calendar vs. paper/whiteboard?
2. What percentage of customers book via mobile vs. desktop?
3. Which integrations are most valuable (Facebook, Instagram, website)?

### Partnership Questions
1. Would the Chamber endorse/feature a local booking platform?
2. Can we get a list of Chamber members without online booking?
3. Would SBDC include this in their small business workshops?

---

## 8. Phase 2: Resource Procurement Plan

### Stakeholder Outreach (Priority Order)

**Email 1: Greater Ashtabula Chamber of Commerce**
- Contact: Executive Director (via website contact form)
- Purpose: Partnership discussion, member directory access
- Ask: Endorsement, co-marketing opportunity, member education

**Email 2: SBDC at YSU — Ashtabula Office**
- Contact: Regional Director
- Purpose: Integration with small business counseling
- Ask: Workshop presentation, client referrals

**Email 3: Growth Partnership for Ashtabula County**
- Contact: Executive Director
- Purpose: Economic development alignment
- Ask: Feature in business resource guide

### Business Outreach
- Target 20 businesses across categories for interviews
- Survey questions: current process, pain points, willingness to try free tool
- Focus: Salons, auto shops, lawn services (highest volume)

### Competitive Deep Dive
- Sign up for Calendly free, Square, Acuity trials
- Document onboarding friction points
- Benchmark feature sets vs. local needs

---

## 9. Draft Outreach Email (Chamber of Commerce)

**Subject:** Partnership Opportunity — Free Scheduling Tool for Ashtabula Businesses

---

Dear [Director Name],

I'm reaching out on behalf of Noirsys AI, a local technology company working to modernize Ashtabula's small business infrastructure.

We're building **service-scheduler** — a free, simple appointment booking platform specifically designed for Ashtabula County service businesses. Think Calendly, but built for our local market with:

- ✅ Free forever tier (no credit card required)
- ✅ 5-minute setup (no technical skills needed)
- ✅ "Book Local Ashtabula" discovery directory
- ✅ Built for seasonal businesses (lawn care, snow removal, tourism)

**Why this matters for Chamber members:**
Our research shows most local businesses still rely on phone-only booking, leading to double-bookings, no-shows, and lost customers. Existing solutions are too expensive ($20-50+/month) or too complex.

**Partnership ask:**
We'd love to discuss how the Chamber could:
1. Feature service-scheduler as a member benefit
2. Allow us to present at a future member meeting
3. Share insights about member needs

Would you be open to a 15-minute call this week or next?

Best regards,  
Michael A. Vega  
Founder, Noirsys AI  
[Contact Information]

---

## 10. Success Metrics (to validate in Phase 2)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Chamber partnership | Signed MOU or verbal commitment | Email/call confirmation |
| Business interviews | 20 completed | Interview notes |
| Pain point validation | 70%+ confirm scheduling pain | Survey results |
| Feature prioritization | Top 5 features ranked | Ranked list |
| Pricing validation | 30%+ willing to pay for Pro | Survey results |

---

## Appendices

### A. Competitor Pricing Comparison (Detailed)

**Calendly:**
- Free: 1 event type, 1 calendar, Calendly branding
- Standard: $10/mo (unlimited event types, integrations)
- Teams: $16/mo per user

**Square Appointments:**
- Free: Individuals only
- Plus: $29/mo (multi-staff, advanced features)
- Premium: $69/mo (resource management)

**Acuity Scheduling:**
- Emerging: $20/mo (1 location)
- Growing: $34/mo (6 locations, text reminders)
- Powerhouse: $61/mo (36 locations, API access)

### B. Local Business Discovery Sources

1. **Greater Ashtabula Chamber Business Directory**
   - URL: https://www.ashtabulachamber.net/business-directory
   - Estimated listings: 200+

2. **Yelp Ashtabula Categories**
   - Hair salons, barbers, auto repair, HVAC, landscaping
   - Filter by "accepts appointments" vs. "walk-ins only"

3. **Facebook Groups**
   - Ashtabula County Business Exchange
   - Local service recommendation groups

4. **Google Maps Search**
   - "[service] near Ashtabula, OH"
   - Check for "Appointment" links on profiles

### C. Research Sources

- SkyQuest: Appointment Scheduling Software Market Report
- Verified Market Research: Market Size & Forecast
- Fortune Business Insights: Market Growth Projections
- IMARC Group: Market Share Analysis (63.5% SaaS)
- Calendly, Acuity, Square official pricing pages
- HubSpot: 30+ Online Booking Systems comparison
- Curogram: No-show reduction strategies

---

**Next Step:** Proceed to Phase 2 — Stakeholder outreach and business interviews. Priority: Chamber of Commerce partnership discussion.
