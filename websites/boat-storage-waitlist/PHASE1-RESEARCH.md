# Phase 1: Research & Recon — Boat Storage Waitlist

**Project:** boat-storage-waitlist  
**Date:** 2026-02-18  
**Status:** Phase 1 Complete

---

## 1. Problem Statement

Marinas in Ashtabula County struggle with:
- **Manual waitlist management** for winter boat storage (high demand, limited space)
- **Slow response times** to inquiries, leading to lost customers
- **Missed upsell opportunities** for spring launch services and maintenance packages
- **Administrative burden** on small marina staff

The current prototype provides AI-generated confirmation messages with upsell suggestions, but needs refinement based on real market needs.

---

## 2. Competitor Analysis

### National Marina Management Software

| Competitor | Key Features | Price | Gap |
|------------|--------------|-------|-----|
| **Dockwa** | Waitlist mgmt, reservations, payments, 300K+ boater network | Subscription-based | Expensive for small marinas |
| **DockMaster** | Visual slip assignments, billing, customer info | Enterprise pricing | Complex, overkill for small operations |
| **Harbour Assist** | Wait lists, berth allocation, lift/launch scheduling | Unknown | UK-focused, less US presence |
| **Molo** | Space management, contracts, payments | SaaS pricing | Feature-heavy for simple waitlists |

### Local Ashtabula Marinas (The Users)

| Marina | Services | Storage Type | Potential Fit |
|--------|----------|--------------|---------------|
| **A.R.U. Marina & Campgrounds** | Seasonal dry storage, launch ramps, camping | Dry/rack storage | Primary target |
| **North Coast Marina** | Dockage, Ashtabula River access | Wet slips + winter storage | Secondary target |
| **River Marine** | Winter storage, pre-season prep | Dry storage | High-priority target |
| **City of Ashtabula Marinas** | Seasonal/overnight dock, winter storage | Mixed | Municipal opportunity |

### Competitive Gaps
1. **Affordable solution** - Most software targets larger marinas with enterprise budgets
2. **AI-powered messaging** - No competitors offer AI-generated confirmations with upsells
3. **Quick deployment** - Existing solutions require extensive setup
4. **Local focus** - Tailored for Lake Erie/Great Lakes marina workflows

---

## 3. Stakeholder Map

### Primary Users
| Role | Needs | Pain Points |
|------|-------|-------------|
| **Marina Owners/Operators** | Fill storage spots, reduce admin, increase revenue | Manual tracking, slow responses, missed upsells |
| **Boat Owners** | Quick confirmation, clear pricing, easy booking | Waiting for callbacks, unclear availability |

### Secondary Stakeholders
| Role | Interest |
|------|----------|
| **Ashtabula Port Authority** | Economic development, harbor management |
| **Lake Erie Marine Trades Association** | Industry standards, member services |
| **Local boat service companies** | Spring launch partnerships, maintenance upsells |
| **Ashtabula County Tourism** | Boating tourism, visitor experience |

### Decision Makers for Adoption
- Marina owners/managers (budget authority)
- Harbor masters (operational authority)
- Boat owner associations (influence)

---

## 4. Data Sources & APIs

### Required Data
| Data Type | Source | Availability |
|-----------|--------|--------------|
| Marina contact info | Manual research, Chamber of Commerce | Public |
| Storage capacity | Direct outreach | Private |
| Boat owner demographics | Ohio DNR boating registrations | Public records |
| Competitor pricing | Website research, calls | Public |

### APIs to Integrate
| API | Purpose | Status |
|-----|---------|--------|
| **Gemini API** | AI confirmation generation | ✅ Already integrated |
| **Stripe/PayPal** | Payment processing for reservations | Planned |
| **SendGrid/AWS SES** | Email confirmations | To add |
| **Google Maps API** | Marina locations, directions | Optional |

### Local Data Sources
- **Ohio DNR Watercraft Registration**: https://ohiodnr.gov/watercraft
- **Ashtabula County Chamber of Commerce**: Business directory
- **City of Ashtabula Harbor**: Municipal marina data
- **Lake Erie boating forums**: User sentiment, needs

---

## 5. Market Opportunity

### TAM/SAM/SOM
- **TAM (Total Addressable Market)**: ~4,500 marinas in the US Great Lakes region
- **SAM (Serviceable Available Market)**: ~200 marinas in Ohio/Lake Erie
- **SOM (Serviceable Obtainable Market)**: 10-15 marinas in Ashtabula County area

### Revenue Potential
- Target price: $49-99/month per marina
- 10 marinas × $75/month = $750/month = $9,000/year initial target
- Upsell potential: Payment processing fees, premium AI features

### Seasonality
- **Peak demand**: August-October (winter storage booking)
- **Secondary**: March-May (spring launch prep)
- **Off-season**: Maintenance, system improvements

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Small marina budget constraints | High | Medium | Freemium tier, simple pricing |
| Established competitor dominance | Medium | Medium | Local focus, AI differentiation |
| Seasonal revenue fluctuations | High | Medium | Diversify with spring launch tools |
| Marina staff tech adoption | Medium | High | Simple UI, on-site training |

---

## 7. Next Steps for Phase 2

1. **Contact local marinas** - Schedule 3-5 discovery calls
2. **Refine value proposition** - Focus on ROI (time saved, upsell revenue)
3. **Build simple CRM** - Track marina contacts, status
4. **Develop email integration** - Automated confirmations beyond AI text
5. **Create demo scenario** - Local marina data for live demos

---

## 8. Key Contacts (To Acquire)

| Marina | Priority | Contact Method |
|--------|----------|----------------|
| A.R.U. Marina | High | Phone/Email |
| River Marine | High | Phone/Email |
| North Coast Marina | Medium | Email |
| City of Ashtabula Harbor | Medium | Official inquiry |
| Ashtabula Port Authority | Low (partnership) | Email |

---

**Research completed by:** Rondell ♟️  
**Next review:** After 3-5 stakeholder interviews
