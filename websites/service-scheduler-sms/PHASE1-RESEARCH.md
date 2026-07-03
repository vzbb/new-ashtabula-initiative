# Phase 1 Research: service-scheduler-sms
## SMS Appointment Reminders for Ashtabula Service Businesses

**Date:** February 18, 2026  
**Researcher:** Rondell (Noirsys AI)  
**Status:** Phase 1 Complete — Ready for Resource Procurement

---

## 1. Problem Statement

### The No-Show Epidemic
Service businesses in Ashtabula County (salons, auto shops, consultancies) lose significant revenue to appointment no-shows. Unlike urban areas with established digital booking infrastructure, local businesses rely primarily on phone-based scheduling with minimal automated follow-up.

**Key Pain Points:**
- **Revenue Loss:** No-shows cost service businesses 15-30% of potential monthly revenue
- **Inefficient Operations:** Staff scheduled for appointments that don't materialize
- **Manual Burden:** Business owners manually calling to confirm appointments
- **Customer Friction:** No easy way for customers to confirm or reschedule

### Local Context
Ashtabula's service economy operates differently than metropolitan markets:
- Many businesses are owner-operated with limited administrative support
- Personal relationships matter — customers expect local, friendly communication
- Digital adoption is growing but uneven across business types
- Cell phone penetration is near-universal; SMS is the most reliable channel

---

## 2. Market Research

### No-Show Statistics by Industry

| Industry | Average No-Show Rate | Average Service Value | Monthly Loss (100 appts) |
|----------|---------------------|----------------------|-------------------------|
| Hair/Nail Salons | 15-20% | $50-85 | $750-1,700 |
| Auto Repair | 10-15% | $150-400 | $1,500-6,000 |
| Massage/Therapy | 20-25% | $60-120 | $1,200-3,000 |
| Consultancies | 10-12% | $100-200 | $1,000-2,400 |
| Home Repair | 15-20% | $200-500 | $3,000-10,000 |

*Source: Industry benchmarks from salon software providers, MGMA medical practice data, service business surveys*

### SMS Reminder Effectiveness

**Research Findings:**
- SMS reminders reduce no-shows by **29-38%** (multiple peer-reviewed studies)
- Single reminder: 7% reduction in no-shows
- Multiple/timed reminders: Up to 38% reduction
- Two-way SMS (confirmation replies): Additional 15-20% improvement
- Healthcare data shows consistent results applicable to service businesses

**Timing Strategy (Best Practices):**
- **Initial reminder:** 24-48 hours before appointment
- **Final reminder:** 2-4 hours before appointment
- **Confirmation request:** Include reply option (YES/NO/RESCHEDULE)

---

## 3. Competitor Analysis

### National Solutions

| Platform | Pricing | SMS Features | Local Focus |
|----------|---------|--------------|-------------|
| **Twilio** | $0.0079/SMS + phone number | API-only, requires dev | None |
| **SimpleTexting** | $29-145/mo | Campaigns, reminders, 2-way | None |
| **TextMagic** | Pay-as-you-go ~$0.04/SMS | Reminders, templates, API | None |
| **Square Appointments** | $0-69/mo | Built-in SMS reminders | Generic branding |
| **Acuity Scheduling** | $16-49/mo | SMS add-on $0.08/msg | No local focus |
| **Remindercall** | $0.09-0.14/call or text | Voice + SMS reminders | No local focus |
| **Apptoto** | $39-99/mo | Automated sequences | No local focus |

### Key Gaps in Existing Solutions

1. **No Ashtabula-specific branding** — Generic national messaging
2. **API-first complexity** — Twilio requires technical integration
3. **Monthly minimums** — Many platforms charge $29+/mo regardless of volume
4. **No local support** — No one to call for help with setup
5. **Overkill features** — Scheduling + payments + marketing when only reminders needed

---

## 4. Target Market (Ashtabula County)

### Service Business Inventory (Estimated)

| Business Type | Count (Est.) | No-Show Pain Level | SMS Readiness |
|---------------|--------------|-------------------|---------------|
| Hair/Nail Salons | 40-60 | HIGH | HIGH |
| Auto Repair Shops | 25-35 | MEDIUM-HIGH | MEDIUM |
| Massage/Therapy | 15-25 | HIGH | HIGH |
| Dental/Medical Offices | 20-30 | HIGH | MEDIUM |
| Tax/Financial Consultants | 15-25 | MEDIUM | MEDIUM |
| Home Repair/Contractors | 30-50 | MEDIUM | LOW-MEDIUM |
| Pet Grooming | 8-12 | HIGH | HIGH |

### User Personas

**Persona 1: Maria — Salon Owner**
- Owns "Styles on Main" in downtown Ashtabula
- 3 stylists, 80-100 appointments/week
- Currently writes appointment cards by hand
- No-shows cost her ~$800/month
- Wants simple solution, doesn't want to learn new software
- Cell phone is her primary business tool

**Persona 2: Tom — Auto Shop Manager**
- Runs Route 20 Auto Repair
- 15-20 appointments daily for oil changes, inspections
- Customers forget appointments frequently
- Would pay for reliability improvement
- Needs integration with existing booking (or simple standalone)

**Persona 3: Jennifer — Massage Therapist**
- Solo practice, works from home studio
- 25-30 clients/week
- High no-show rate (20%+) hurts solo income
- Wants automated reminders without monthly subscription
- Prefers pay-per-use model

---

## 5. Stakeholder Mapping

### Primary Users (Service Providers)

**Hair/Nail Salons:**
- Manestreeks (Geneva)
- Xtreme Hair (Ashtabula)
- Ultimate Appearance (Ashtabula)
- Salon Ten Twenty (Ashtabula)
- The Beauty Crew (Ashtabula)
- Styles by Carol (Multiple locations)
- Fresh Rayne Salon (Ashtabula — has online booking)

**Auto Repair:**
- Route 20 Auto Repair (Ashtabula)
- Great Lakes GMC Buick (Ashtabula)
- R20 Auto (Ashtabula)
- Various independent shops (25-35 estimated)

**Business Associations:**
- Ashtabula Chamber of Commerce
- Geneva Area Chamber of Commerce
- Conneaut Area Chamber of Commerce
- Downtown Ashtabula Alliance

### Potential Partners

**Technology:**
- Twilio (SMS API provider)
- Local IT providers (for setup assistance)

**Distribution:**
- Chambers of Commerce (member benefit)
- Trade associations (salon guilds, automotive groups)
- Business development organizations

---

## 6. Data Sources & APIs

### SMS Infrastructure

**Twilio (Recommended Primary):**
- Cost: $0.0079 per SMS + $1.15/mo per phone number
- Coverage: 100% US carrier coverage
- Features: Two-way SMS, scheduling, delivery receipts
- API: Well-documented, extensive libraries

**Alternatives:**
- **TextMagic:** ~$0.04/SMS, simpler API
- **MessageBird:** Competitive pricing, global reach
- **Vonage (Nexmo):** $0.0068/SMS, good delivery rates

### Business Data

**Ashtabula County Business Directory:**
- Chamber of Commerce directories (3 chambers)
- BBB accredited business list
- Yelp business API (for reviews/verification)
- Google Places API (for business discovery)

### Cost Modeling

**Per-Business Estimate (Monthly):**
- Phone number: $1.15
- SMS volume (100 reminders): $0.79
- **Total direct cost: ~$2/business/month**

**Pricing Models to Test:**
1. **Freemium:** 50 free SMS/month, then $0.05/SMS
2. **Flat Rate:** $9.99/month unlimited
3. **Pay-as-you-go:** $0.10/SMS with no monthly fee
4. **Local Partnership:** Free via chamber/sponsor subsidy

---

## 7. Technical Considerations

### MVP Feature Set

**Core:**
- Simple phone number input for customers
- Appointment time/date entry
- Automated 24-hour reminder SMS
- Automated 2-hour reminder SMS
- Reply handling (YES confirms, NO cancels, RESCHEDULE prompts call)

**Nice-to-Have:**
- Recurring appointment support
- Custom message templates
- Business branding in messages
- Simple web dashboard
- Calendar integration (Google/Outlook)

### Technical Stack (Recommended)

- **Backend:** Node.js + Express (or Python + FastAPI)
- **Database:** PostgreSQL (appointments, logs)
- **SMS:** Twilio API
- **Scheduling:** node-cron or Bull queue
- **Frontend:** Simple React or vanilla JS
- **Hosting:** Vercel/Netlify + Railway/Render

### Compliance

- **TCPA:** Requires opt-in consent for automated SMS
- **Opt-out:** Must honor STOP requests immediately
- **Business hours:** Only send during 8am-9pm local time
- **Data retention:** Clear policy on phone number storage

---

## 8. Differentiation Strategy

### "Ashtabula-First" Positioning

**What Makes This Different:**

1. **Local Phone Numbers** — (440) area code builds trust vs. generic short codes
2. **Local Language** — Messages can include local references, weather, events
3. **No Monthly Fees (Option)** — Pay-per-use fits seasonal/cyclical local economy
4. **Local Support** — Phone number to call for help (not just email/chat)
5. **Chamber Partnership** — Potential for member discount or free tier
6. **Simple Setup** — 5-minute setup vs. complex platform configuration

### Sample Message Templates

**Standard:**
```
Hi [Name], this is [Business] confirming your appointment 
tomorrow at [Time]. Reply YES to confirm or NO to cancel. 
Questions? Call [Phone].
```

**Local Flavor:**
```
Hi [Name]! [Business] here — looking forward to seeing you 
tomorrow at [Time] in downtown Ashtabula. Reply YES to 
confirm or call [Phone] to reschedule. Have a great day!
```

---

## 9. Open Questions (Phase 2 Research Needed)

1. **Opt-in mechanics:** How do businesses currently collect cell numbers?
2. **Integration needs:** Do businesses want calendar sync or standalone?
3. **Volume expectations:** Average appointments per business per week?
4. **Price sensitivity:** What would businesses pay per month for this?
5. **Competitor awareness:** Are businesses already using Square/Acuity reminders?
6. **Chamber relationship:** Would chamber promote as member benefit?
7. **Texting habits:** Do Ashtabula customers prefer SMS over calls?
8. **Seasonal patterns:** Does no-show rate vary by season/industry?

---

## 10. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low business digital literacy | Medium | Medium | Offer setup service, simple UI |
| Customers without cell phones | Low | Low | Voice call fallback option |
| TCPA compliance issues | Medium | High | Clear opt-in, easy opt-out |
| Existing platform competition | Medium | Medium | Price/local focus differentiation |
| Carrier filtering/blocks | Medium | Medium | Use registered local numbers |
| Seasonal business viability | Medium | Low | Pay-per-use pricing model |

---

## 11. Next Steps (Phase 2: Resource Procurement)

### Immediate Actions

1. **Interview 5-10 local service businesses**
   - Ask about current no-show rates
   - Gauge interest in SMS reminders
   - Determine price sensitivity

2. **Contact Ashtabula Chamber of Commerce**
   - Propose partnership/member benefit
   - Request member business contact list
   - Explore sponsorship opportunity

3. **Technical Validation**
   - Set up Twilio trial account
   - Build minimal prototype (5-10 hours)
   - Test with friendly local business

4. **Competitive Deep Dive**
   - Sign up for SimpleTexting/Apptoto trials
   - Document onboarding friction
   - Identify feature gaps

### Deliverables for Phase 2

- [ ] Business interview notes (5+ conversations)
- [ ] Chamber partnership proposal
- [ ] Working prototype (basic SMS send/receive)
- [ ] Revised pricing model based on feedback
- [ ] SPEC.md with technical architecture

---

## Summary

**service-scheduler-sms** addresses a clear, quantifiable problem: service businesses lose 15-30% of revenue to no-shows, and SMS reminders can reduce this by 30-40%. The Ashtabula market has 150+ potential business customers with limited access to affordable, locally-focused solutions.

**Key Numbers:**
- **Market Size:** 150+ service businesses
- **Pain Point:** $750-10,000 monthly no-show losses per business
- **Solution Impact:** 30-40% reduction in no-shows
- **Cost to Deliver:** ~$2/business/month
- **Differentiation:** Local focus, simple pricing, Ashtabula branding

**Recommendation:** Proceed to Phase 2 (Resource Procurement) with business interviews and chamber outreach.

---

*Document Version: 1.0*  
*Research completed: February 18, 2026*  
*Next review: Upon completion of Phase 2 stakeholder interviews*
