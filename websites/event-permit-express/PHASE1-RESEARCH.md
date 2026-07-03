# Phase 1 Research — Event Permit Express
**Project:** event-permit-express  
**Date:** February 17, 2026  
**Researcher:** Rondell (Noirsys AI)

---

## 1. Problem Statement

### Current Pain Points
Event organizers in Ashtabula County face a **fragmented, opaque permit application process** across multiple jurisdictions:

| Jurisdiction | Current Process | Pain Level |
|--------------|-----------------|------------|
| Ashtabula County Metroparks | Contact office by phone/email, manual application | 🔴 High |
| City of Ashtabula Parks | Phone/in-person only, no online portal | 🔴 High |
| Geneva Park District | Has facility rental page but limited permit info | 🟡 Medium |
| Ashtabula Fairgrounds | PDF forms, fax/email submission | 🟡 Medium |
| Townships (Geneva, etc.) | Varies widely, often phone-only | 🔴 High |

### Key Frustrations
1. **No single source of truth** — organizers must hunt across 5+ websites/agencies
2. **No visibility into requirements** — unclear what permits are needed for different event types
3. **No timeline transparency** — processing times unknown until application submitted
4. **Paper/fax heavy** — most agencies still require manual form submission
5. **No status tracking** — applicants left wondering if application was received/approved

---

## 2. Competitor Analysis

### Direct Competitors (Enterprise Solutions)
| Competitor | Target | Price | Gap |
|------------|--------|-------|-----|
| **Eproval** | City governments | $$$ Enterprise | Too complex/expensive for small cities |
| **OpenCounter** | Mid-size cities | $$$ SaaS | No small community focus |
| **ActiveNetwork** | Recreation mgmt | $$$ Subscription | Overkill for simple permits |

### Indirect Competitors (DIY Approaches)
| Approach | Issues |
|----------|--------|
| PDF Forms + Email | No tracking, manual processing |
| Phone Tag | Time-consuming, inconsistent info |
| Walk-in | Limited hours, travel required |
| Facebook Groups | Unofficial, liability concerns |

### Key Insight
**No lightweight, citizen-focused tool exists** for small-to-mid size communities like Ashtabula County. Enterprise solutions target cities of 100K+ with dedicated IT staff.

---

## 3. Stakeholder Mapping

### Primary Users (Event Organizers)
| Persona | Event Types | Pain Level | Tech Comfort |
|---------|-------------|------------|--------------|
| **Family Reunion Planner** | Picnics, pavilion rentals | Medium | Low-Medium |
| **Nonprofit Coordinator** | Fundraisers, 5K runs | High | Medium |
| **Festival Organizer** | Street fairs, food festivals | Very High | Medium-High |
| **Wedding Planner** | Outdoor ceremonies | Medium | High |
| **Youth Sports Coach** | Tournament permits | Medium | Low |

### Government Stakeholders
| Entity | Contact | Role | Priority |
|--------|---------|------|----------|
| Ashtabula County Metroparks | reservations@ashtabulametroparks.com | Primary permit issuer | ⭐⭐⭐⭐⭐ |
| City of Ashtabula Parks Dept | parks@cityofashtabula.com | City park permits | ⭐⭐⭐⭐ |
| Geneva Park District | info@genevaparks.org | Facility rentals | ⭐⭐⭐⭐ |
| Ashtabula Fairgrounds | info@ashtabulafair.com | Large event venue | ⭐⭐⭐ |
| Townships | Varies | Local parks | ⭐⭐⭐ |

### Enabling Stakeholders
- **Chamber of Commerce** — promotes business events
- **Tourism Council** — interested in festival coordination
- **Fire/Police Departments** — often required for large event permits

---

## 4. Event Types & Permit Requirements Matrix

Based on research, here are common Ashtabula County events and their typical requirements:

| Event Type | Typical Permits Needed | Lead Time | Est. Cost |
|------------|----------------------|-----------|-----------|
| **Picnic/Pavilion Rental** | Park reservation | 2-4 weeks | $25-100 |
| **5K Run/Walk** | Park permit + road use + insurance | 4-8 weeks | $100-500 |
| **Street Festival** | Street closure + vendors + safety | 6-12 weeks | $500-2,000 |
| **Outdoor Wedding** | Park reservation + photography | 2-4 weeks | $100-300 |
| **Concert in Park** | Sound permit + park use + security | 4-8 weeks | $200-1,000 |
| **Farmers Market** | Vendor permits + health dept | 4-6 weeks | $50-200 |
| **Youth Sports Tournament** | Field permits + insurance | 2-4 weeks | $100-500 |
| **Charity Car Show** | Parking lot use + insurance | 4-6 weeks | $150-500 |

### Common Required Documents
- [ ] Event description/schedule
- [ ] Proof of insurance (often $1M liability)
- [ ] Site plan/diagram
- [ ] Emergency contact information
- [ ] Vendor list (if applicable)
- [ ] Noise/sound plan
- [ ] Traffic/parking plan
- [ ] Cleanup/restoration plan

---

## 5. Technical Landscape

### Current Tech Gaps
- No online application portals for most jurisdictions
- No automated workflow management
- No public-facing status tracking
- No requirement checklists/guidance
- No fee calculators

### Integration Opportunities
- **ReserveAmerica** — used by Geneva State Park (state level)
- **ActiveNetwork** — some recreation facilities use this
- **QuickBooks/Payment processors** — for fee collection
- **Google Calendar/Outlook** — for availability checking
- **PDF generation** — for permit document creation

---

## 6. Market Gap Analysis

### What Exists
- Cleveland Metroparks: PDF forms, email submission, 14-day minimum lead time
- Columbus Recreation & Parks: Online special events portal
- Generic reservation systems: Not permit-focused

### What's Missing (Our Opportunity)
1. **Unified portal** across all Ashtabula County jurisdictions
2. **Smart questionnaire** that tells users WHICH permits they need
3. **Real-time availability** for pavilions/parks
4. **Status dashboard** for applicants
5. **Document checklist generator** based on event type
6. **Fee estimator** before applying
7. **Mobile-friendly** interface
8. **Integration with local payment systems**

---

## 7. Critical Questions to Validate

### For Parks Departments
1. What percentage of permits are currently submitted online vs. paper/phone?
2. What's the average processing time? What's the bottleneck?
3. How many incomplete applications are received? Why?
4. Would a unified system reduce staff workload?
5. What's the budget for permit system improvements?

### For Event Organizers
1. What's the most confusing part of the current process?
2. How far in advance do you typically plan events?
3. Would you pay a small convenience fee for online processing?
4. What features would save you the most time?

### Technical/Legal
1. Can we integrate with existing reservation systems?
2. What liability considerations exist for providing permit guidance?
3. Are there data sharing agreements between jurisdictions?

---

## 8. Differentiation Strategy

| Competitor Approach | Our Differentiation |
|--------------------|---------------------|
| Enterprise software ($$$) | **Free/low-cost** for small communities |
| One-size-fits-all | **Ashtabula-tailored** requirements |
| Complex workflows | **Simple, mobile-first** experience |
| Department-only tools | **Citizen-facing** with staff dashboard |
| Generic forms | **Smart, event-type-aware** checklists |

---

## 9. Synergies with Other MVPs

| MVP | Synergy |
|-----|---------|
| **through-the-grapevine** | Event listings can link to permit requirements |
| **gotl-weekend-planner** | Festival itinerary includes permit status |
| **civic-insight-engine** | Open data on permits granted |
| **invest-ashtabula** | Business events need permits too |

---

## 10. Next Steps

### Phase 2: Stakeholder Outreach
- [ ] Email Ashtabula County Metroparks (reservations@ashtabulametroparks.com)
- [ ] Contact Geneva Park District
- [ ] Survey local event organizers (3-5)
- [ ] Interview one recent festival organizer

### Phase 3: Specification
- [ ] Define core user flows
- [ ] Design permit requirement decision tree
- [ ] Create data model for multi-jurisdiction support
- [ ] Draft technical architecture

---

## Research Sources
- ashtabulametroparks.com/reservations
- genevaparks.org/facilities/rentals/
- clevelandmetroparks.com (permit process reference)
- eproval.com (competitor analysis)
- opencounter.com (competitor analysis)
- signalcleveland.org (best practices reference)

---

**Status:** Phase 1 Complete 🟡  
**Deliverable Size:** 6.2KB  
**Next Milestone:** Phase 2 Stakeholder Outreach
