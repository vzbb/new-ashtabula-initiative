# Phase 1 Research: Rental Availability Finder
**Project:** rental-availability  
**Date:** 2026-02-18  
**Status:** Phase 1 Complete → Ready for Phase 2 (Resource Procurement)

---

## 1. Problem Statement

### The Core Issue
Ashtabula County residents face significant challenges finding available rental housing due to:
- **Severe inventory shortage:** Only 25-26 total rental listings county-wide on major platforms
- **Fragmented data:** Listings scattered across 8+ platforms with no single source of truth
- **Affordable housing crisis:** 376 rent-subsidized units exist but are difficult to discover
- **Long waitlists:** AMHA Section 8 vouchers have waiting lists with 6-month recertification requirements

### Impact
- Residents spend weeks checking multiple sites for basic availability
- Low-income families struggle to find qualifying affordable units
- Property managers lose leads due to scattered marketing
- Workforce housing shortage impacts local business recruitment

---

## 2. Market Analysis

### Current Fair Market Rent (2023-2025)
| Bedrooms | Fair Market Rent | Notes |
|----------|-----------------|-------|
| Studio | ~$650 | Limited availability |
| 1-Bed | ~$725 | Senior apartments available (Willowbrook) |
| 2-Bed | **$794** | Most common unit type |
| 3-Bed | ~$950 | Below-market deals occasionally available |

### Listing Volume by Platform (Ashtabula County)
| Platform | Listings | Data Quality | Notes |
|----------|----------|--------------|-------|
| Zillow | 26 | Moderate | Aggregates from multiple sources |
| Apartments.com | 25 | High | Verified listings only |
| RentCafe | ~20 | High | Property manager direct feeds |
| Apartment Finder | Varies | Moderate | National aggregator |
| Redfin | 10 | High | Limited rental focus |
| Craigslist | Variable | Low | Unverified, high scam risk |
| Facebook Marketplace | Variable | Low | Informal, unverified |

**Critical Gap:** No platform provides a unified view of ALL available rentals including affordable housing units.

---

## 3. Competitor Analysis

### National Aggregators

#### Zillow Rental Manager
- **Strengths:** Largest rental pool, free listings for landlords, integrated applications
- **Weaknesses:** Duplicate/outdated listings, Ashtabula inventory very limited
- **Pricing:** Free for basic listings, $9.99/week for premium placement

#### Apartments.com (Cozy)
- **Strengths:** Verified listings only, rent comparison reports, largest dedicated rental site
- **Weaknesses:** Smaller rural coverage, charges landlords for featured listings
- **Pricing:** Free basic, subscription for property managers

#### Rent.com
- **Strengths:** Simple interface, good filtering
- **Weaknesses:** Limited rural coverage
- **Pricing:** Pay-per-listing or subscription

#### HotPads
- **Strengths:** Map-first design, neighborhood comparison tools
- **Weaknesses:** Urban-focused, limited rural utility

### Affordable Housing Specific

#### AffordableHousingOnline.com
- **Strengths:** Section 8 and low-income listings, AMHA integration
- **Weaknesses:** No market-rate units, limited search features

#### Ashtabula MHA (ashtabulamha.com)
- **Strengths:** Official Section 8 and public housing waitlist
- **Weaknesses:** No self-service portal, manual application process

### Local Property Managers (Direct)
- Ridgeview Estates (ridgeviewestate.me) — affordable focus
- Tucker Real Estate Property Management
- DTS Property Management
- Western Reserve Properties
- Maleno
- Acumen Property Management

---

## 4. Key Stakeholders

### Primary Stakeholders

#### Property Managers / Landlords
- **Ridgeview Estates** — 440-XXX-XXXX, ridgeviewestate.me
- **Tucker Real Estate** — Property management division
- **DTS Property Management** — Yelp-rated local company
- **Western Reserve Properties** — Madison area focus
- **Individual landlords** — Craigslist/Facebook advertisers

#### Housing Authority
- **Ashtabula Metropolitan Housing Authority (AMHA)**
  - Website: ashtabulamha.com
  - Programs: Public Housing, Section 8 Vouchers
  - Status: Section 8 waiting list opening March 10, 2025 (per HUD Housing Network)
  - Properties: 268 total buildings (combined Public Housing + Section 8)

### Secondary Stakeholders

#### Support Organizations
- **Ashtabula County Community Action Agency (ACCAA)** — housing assistance
- **Homesafe** — emergency housing
- **Dream Center** — transitional housing
- **Growth Partnership** — workforce housing initiatives
- **SBDC at YSU** — small business/landlord resources

#### City/County Officials
- City of Ashtabula Planning & Community Development (PCD)
- Ashtabula County Department of Community Services

### Target User Personas

#### 1. "Searching Sarah" — Young Professional
- **Demographics:** 25-35, single, income $35-50K
- **Needs:** 1-2 bedroom apartment, pet-friendly, near work
- **Pain points:** Finds 3-5 listings total, many outdated
- **Behavior:** Checks Zillow daily, frustrated by duplicates

#### 2. "Family Marcus" — Relocating Family
- **Demographics:** 35-45, married with kids, income $50-75K
- **Needs:** 3+ bedroom house, good schools, backyard
- **Pain points:** Limited single-family rentals, no central listing source
- **Behavior:** Drives neighborhoods looking for "For Rent" signs

#### 3. "Senior Dorothy" — Fixed Income Renter
- **Demographics:** 65+, Social Security income <$20K
- **Needs:** Affordable/subsidized housing, accessibility features
- **Pain points:** Doesn't know about AMHA programs, long waitlists
- **Behavior:** Calls housing authority directly, limited internet use

#### 4. "Landlord Larry" — Small Property Owner
- **Demographics:** 50-65, owns 2-5 rental units
- **Needs:** Fill vacancies quickly, find qualified tenants
- **Pain points:** Free listing options limited, paid sites too expensive for small volume
- **Behavior:** Posts on Facebook Marketplace, Craigslist

#### 5. "Worker Wendy" — Seasonal/Temp Worker
- **Demographics:** 25-40, seasonal employment (tourism/agriculture)
- **Needs:** Short-term rentals, furnished options, flexible leases
- **Pain points:** No short-term rental inventory, hotels too expensive
- **Behavior:** Asks employer for housing leads

---

## 5. Technical Feasibility

### Data Sources Available

#### APIs (Potential Integration)
1. **Zillow API** — Rental listings (terms restrictive, primarily for display)
2. **Realtor.com API** — Limited rental data
3. **RentSpree API** — Application/screening integration

#### Scraping Targets (Legal Review Required)
1. **Craigslist** — RSS feeds available
2. **Facebook Marketplace** — Difficult to scrape legally
3. **Individual property manager sites** — Variable structure

#### Official Data
1. **AMHA listings** — Manual entry or partnership
2. **AffordableHousingOnline** — No API, manual data

### Data Model Needs
- Property (address, type, beds, baths, sqft, amenities)
- Listing (price, availability date, lease terms, photos)
- Source (platform, property manager, individual)
- Affordability (Section 8 eligible, income limits, subsidies)

### MVP Feature Set (Free)
1. **Unified search** — Aggregated view across all sources
2. **Filter/sort** — Price, bedrooms, location, pet policy
3. **Saved searches** — Email alerts for new listings
4. **Map view** — Geographic search with neighborhood context
5. **Affordable housing section** — Dedicated AMHA/section 8 portal

### Pro Features (Potential Revenue)
1. **Instant alerts** — SMS for new listings (hot market)
2. **Application integration** — Pre-qualification, credit check
3. **Landlord dashboard** — Listing management, applicant tracking
4. **Neighborhood reports** — School ratings, transit, safety

---

## 6. Differentiation Strategy

### What Competitors Miss
1. **No rural county focus** — All platforms optimize for urban markets
2. **No affordable housing integration** — Market-rate and subsidized exist in separate worlds
3. **No local context** — School districts, commute times to specific employers
4. **No landlord tools for small operators** — Facebook/Craigslist only free options

### Our Unique Value Proposition
> "The only complete rental picture for Ashtabula County — market-rate apartments, single-family homes, and affordable housing all in one place, with local expertise you won't find on national sites."

### Key Differentiators
1. **Ashtabula-only focus** — Every listing verified for county location
2. **Affordable housing portal** — Integration with AMHA waitlists and eligibility
3. **Local landlord support** — Free listings for properties with <10 units
4. **Employer partnerships** — Workforce housing matching for major employers
5. **Community context** — School info, transit, neighborhood guides

---

## 7. Risk Assessment

### High Risk
1. **Data staleness** — Aggregated listings go stale quickly
   - *Mitigation:* Real-time scraping + landlord direct posting + user flagging
2. **Low inventory** — Only 25-50 active listings at any time
   - *Mitigation:* Include surrounding counties (Lake, Geauga), include "coming soon"
3. **AMHA partnership** — Critical for affordable housing accuracy
   - *Mitigation:* Start with manual research, formalize partnership after validation

### Medium Risk
1. **Landlord adoption** — Need critical mass of listings
   - *Mitigation:* Free tier for small landlords, outreach to property managers
2. **Zillow duplication** — Why use this over Zillow?
   - *Mitigation:* Affordable housing focus, local filtering, no duplicates
3. **Revenue model** — How to sustain?
   - *Mitigation:* Landlord paid listings, application fees, employer sponsorships

### Low Risk
1. **Technical complexity** — Standard CRUD app
   - *Mitigation:* Use Firebase/Supabase for rapid deployment
2. **Legal issues** — Fair housing compliance
   - *Mitigation:* Standard disclaimers, no discriminatory filtering

---

## 8. Open Questions (Phase 2 Blockers)

### Critical Questions
1. **AMHA Partnership:** Will AMHA share waitlist status data or integrate listings?
2. **Property Manager Interest:** Will local managers (Ridgeview, Tucker, DTS) participate?
3. **User Validation:** How many residents would use this vs. existing platforms?
4. **Data Strategy:** Scrape vs. API vs. manual entry vs. landlord self-service?
5. **Geographic Scope:** Ashtabula County only, or include Geneva/Conneaut/Madison?

### Important Questions
6. **Revenue Model:** Free community service, or sustainable business?
7. **Mobile Priority:** Web-first or native app needed?
8. **Accessibility:** ADA compliance requirements for housing sites?
9. **Integration:** Connect to existing application platforms (RentSpree, etc.)?
10. **Synergies:** Partner with job boards for workforce housing matching?

---

## 9. Recommended Next Steps (Phase 2)

### Immediate Actions
1. **Contact AMHA** — Request partnership meeting, discuss waitlist integration
2. **Survey Property Managers** — Email Ridgeview, Tucker, DTS about participation
3. **User Interviews** — 5-10 renters about current search process and pain points
4. **Competitor Audit** — Deep dive into actual Zillow/Apartments.com UX for Ashtabula

### Stakeholder Outreach Targets
| Organization | Contact Method | Goal |
|--------------|----------------|------|
| AMHA | ashtabulamha.com contact form | Partnership for affordable housing data |
| Ridgeview Estates | ridgeviewestate.me | Property manager pilot partner |
| Tucker Real Estate | Phone/email | Listing integration |
| DTS Property Management | Yelp message | Listing integration |
| Growth Partnership | Existing contact | Workforce housing initiative alignment |
| ACCAA | Phone | Low-income renter outreach |

### Success Metrics for Phase 2
- [ ] 3+ property manager conversations completed
- [ ] 10+ user interviews conducted
- [ ] AMHA meeting scheduled or declined
- [ ] Decision on data sourcing strategy
- [ ] Draft revenue model validated

---

## 10. Strategic Fit

### Alignment with New Ashtabula Initiative
- **Community need:** Housing is #1 quality-of-life issue
- **Economic impact:** Workforce housing supports business recruitment
- **Digital equity:** Affordable housing portal serves underserved population
- **Feasibility:** Lower technical complexity than many other MVPs

### Synergies with Other MVPs
- **invest-ashtabula:** Housing data supports investment decisions
- **eligibility-lite/screener:** Cross-promote affordable housing resources
- **contractor-match:** Landlords need maintenance/repair services
- **policy-pal:** Housing policy issues affect availability

---

**Document Status:** Phase 1 Complete  
**Next Phase:** Phase 2 — Resource Procurement (stakeholder outreach, data source validation)  
**Estimated Phase 2 Duration:** 1-2 weeks  
**Prepared By:** Heartbeat Automation  
**Date:** 2026-02-18
