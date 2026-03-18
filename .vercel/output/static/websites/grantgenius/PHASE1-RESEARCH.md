# GrantGenius — Phase 1 Research Report
**Date:** February 18, 2026  
**Project:** grantgenius (New Ashtabula Initiative)  
**Status:** Phase 1 Complete 🟡

---

## 1. Problem Statement

**For nonprofits and small businesses in Ashtabula County, finding and applying for grants is fragmented, time-consuming, and opaque.**

Organizations currently must:
- Navigate dozens of disconnected funding sources (federal, state, county, foundation)
- Miss deadlines because opportunities aren't aggregated
- Lack awareness of lesser-known local funders like The Ashtabula Foundation
- Struggle with eligibility determination across complex criteria
- Compete against better-resourced organizations with dedicated grant writers

**The cost:** Missed funding opportunities, under-resourced community organizations, and slower economic growth.

---

## 2. Competitor Analysis

### Direct Competitors (Grant Databases)

| Competitor | Price | Strengths | Weaknesses | Gap for GrantGenius |
|------------|-------|-----------|------------|---------------------|
| **Instrumentl** | $50-150/mo | Smart matching, AI writing, workflow tools | Expensive for small orgs, national focus | FREE local focus |
| **Foundation Directory Online** | $50-200/mo | Most comprehensive foundation data | Paywalled, overwhelming for beginners | Simplified, accessible |
| **GrantHub** | $75/mo | Good tracking tools | No discovery database, manual entry | Discovery + tracking combined |
| **GrantStation** | $199/yr | Affordable annual rate | Limited Ohio/local coverage | Ashtabula-specific focus |
| **GrantWatch** | Varies | Broad opportunity listings | Subscription required, noisy | Curated, relevant only |

### Indirect Competitors

| Source | Type | Limitation |
|--------|------|------------|
| **Ashtabula Growth Partnership** | Economic development org | Business-focused only, no aggregation |
| **ACCAA** | Community action agency | Social services only, limited reach |
| **Chamber of Commerce newsletters** | Email blasts | Sporadic, not searchable |
| **Word of mouth** | Informal | Unequal access, misses opportunities |

### Key Insight
**No free, Ashtabula County-focused grant aggregator exists.** All existing solutions are either paid national databases or narrow single-source listings.

---

## 3. Stakeholder Mapping

### Funding Sources (Data to Aggregate)

#### Federal Programs
| Source | Programs | Contact |
|--------|----------|---------|
| **USDA Rural Development** | Rural Business Development Grants, REDLG, VAPG | Patrick Sarver: (740) 304-4533 |
| **SBA** | Women's Business Centers, 7(a) loans, microloans | Ohio District Office |
| **HUD** | Community Development Block Grants | State program admin |
| **DOT** | Transportation grants | ODOT Local Programs |

#### State Programs
| Source | Programs | Notes |
|--------|----------|-------|
| **Ohio Development Services Agency** | Small business loans, innovation grants | JobsOhio partnership |
| **JobsOhio** | Small Business Development Grant | Underrepresented populations priority |
| **Ohio Department of Development** | Minority/women business loans up to $10M | Minority Division administers |
| **Ohio Arts Council** | Arts organization grants | Project-based funding |
| **Ohio Bureau of Workers' Comp** | Workplace Wellness Grant ($15K) | Rolling applications |

#### Local/Regional Foundations
| Foundation | Assets | Focus Areas |
|------------|--------|-------------|
| **The Ashtabula Foundation** | $21M+ | Education, community development |
| **Cleveland Foundation** | $3B+ | Greater Cleveland (includes Ashtabula) |
| **Foundation for Appalachian Ohio** | $50M+ | 32 Appalachian Ohio counties |
| **African American Community Fund** | Varies | Black-led organizations |
| **United Black Fund of Greater Cleveland** | Varies | Education, workforce, basic needs |
| **United Way of Ashtabula County** | Varies | Human services (funder + recipient) |

#### County/Local Government
| Entity | Programs | Contact |
|--------|----------|---------|
| **Ashtabula Growth Partnership** | Enterprise Zone incentives | ashtabulagrowth.com |
| **City of Ashtabula** | Economic development support | PCD@cityofashtabula.com |
| **ACCAA** | Emergency assistance, WIC, energy | accaa.org |

### Target Users

#### User Personas

**1. Sarah — Nonprofit ED**
- Role: Executive Director, small community nonprofit ($250K budget)
- Pain: Spends 10+ hrs/week searching for grants, misses deadlines
- Needs: Deadline alerts, eligibility screener, application templates
- Tech comfort: Medium

**2. Marcus — Small Business Owner**
- Role: Restaurant owner, 12 employees, minority-owned
- Pain: Doesn't know about JobsOhio underrepresented grants
- Needs: Simple eligibility checker, document checklist
- Tech comfort: Low-Medium

**3. Jennifer — Grant Writer (Freelance)**
- Role: Serves 5-6 local nonprofits
- Pain: Managing opportunities across spreadsheets
- Needs: Client portfolio tracking, deadline management
- Tech comfort: High

**4. David — Faith-Based Org Leader**
- Role: Church-based food pantry coordinator
- Pain: Unfamiliar with secular funding sources
- Needs: Beginner-friendly guidance, faith-inclusive sources
- Tech comfort: Low

---

## 4. Data Sources & API Opportunities

### Primary Data Sources

| Source | Data Type | Access Method | Feasibility |
|--------|-----------|---------------|-------------|
| **Grants.gov** | Federal grants | API (requires registration) | ⭐⭐⭐⭐ |
| **USDA Rural Development** | Rural business grants | RSS + manual curation | ⭐⭐⭐⭐ |
| **Ohio Grants Portal** | State opportunities | Web scrape or API | ⭐⭐⭐ |
| **Instrumentl** | Foundation data | Partnership/affiliate | ⭐⭐ |
| **Foundation Directory** | Funder profiles | Library access (free) | ⭐⭐⭐ |
| **Foundation for Appalachian Ohio** | Regional grants | Email newsletter + website | ⭐⭐⭐⭐ |
| **Ashtabula Foundation** | Local grants | Direct relationship | ⭐⭐⭐⭐⭐ |
| **Cleveland Foundation** | Regional grants | Grants Gateway portal | ⭐⭐⭐⭐ |

### Data Structure Needs

```json
{
  "opportunity": {
    "title": "JobsOhio Small Business Grant",
    "funder": "JobsOhio",
    "amount": "$10,000 - $50,000",
    "deadline": "2025-06-30",
    "eligibility": {
      "business_type": ["for_profit"],
      "location": "Ohio distressed communities",
      "ownership": ["minority", "women", "veteran", "disabled"],
      "employees": "< 100"
    },
    "category": "business_expansion",
    "application_url": "https://...",
    "last_verified": "2025-02-18"
  }
}
```

---

## 5. Critical Questions to Validate

### Technical Feasibility
1. Can we reliably scrape or access Ohio Grants Portal data?
2. What's the update frequency requirement? (Weekly? Monthly?)
3. How to handle deadline changes and opportunity closures?

### Content/Partnership
1. Will The Ashtabula Foundation partner to promote new opportunities?
2. Can we get direct data feed from ACCAA or Growth Partnership?
3. Are there legal concerns with redistributing grant RFP content?

### User Validation
1. How many local nonprofits would actually use this? (Survey 10-15)
2. Do business owners prefer web app or SMS/email alerts?
3. What's the right balance between comprehensiveness and curation?

### Sustainability
1. Should this be entirely free, or freemium with premium features?
2. Can local sponsors (banks, Chamber) fund maintenance?
3. What's the ongoing curation burden? (Estimate: 5-10 hrs/week)

---

## 6. Differentiation Strategy

### vs. National Competitors
| Dimension | GrantGenius | Instrumentl/FDO |
|-----------|-------------|-----------------|
| **Price** | FREE | $50-200/mo |
| **Geography** | Ashtabula-focused | National |
| **Curation** | Human-verified local relevance | Algorithmic |
| **Support** | Local office hours | Email only |
| **Onboarding** | In-person training available | Self-serve |

### Key Differentiators
1. **Zero cost barrier** — Remove the "pay to find funding" paradox
2. **Hyper-local curation** — Only relevant to Ashtabula County
3. **Deadline intelligence** — Proactive alerts, not just listings
4. **Application support** — Templates, tips, office hours
5. **Success tracking** — Local success stories, metrics

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data becomes stale | High | High | Weekly curation workflow, user reports |
| Low initial adoption | Medium | High | Partner with Chamber, ACCAA for launch |
| Legal/content rights | Low | High | Terms of service, fair use analysis |
| Sustainability | Medium | Medium | Freemium model, local sponsorships |
| Scope creep | High | Medium | Strict Ashtabula-only focus initially |

---

## 8. Recommended Next Steps

### Phase 2: Resource Procurement
1. Contact The Ashtabula Foundation (Pamela Buzon, Executive Director)
2. Survey 10 local nonprofits about pain points
3. Interview Ashtabula Growth Partnership about business grant awareness
4. Test scrape feasibility on Ohio Grants Portal

### Phase 3: SPEC Development
1. Define MVP feature set (search, alerts, eligibility checker)
2. Design data model for opportunities
3. Create wireframes for key screens
4. Define success metrics (weekly active users, grant applications submitted)

### Phase 4: Build Checklist
1. Static site with initial 25-50 opportunities
2. Weekly curation workflow
3. Email alert system
4. Analytics dashboard

---

## 9. Research Sources

- https://www.ashtabulagrowth.com/incentives
- https://www.jobsohio.com/programs-services/incentives
- https://www.rd.usda.gov/programs-services/business-programs
- https://appalachianohio.org/grant-opportunities/
- https://www.clevelandfoundation.org/grants/
- https://www.instrumentl.com/browse-grants/ashtabula-county-oh
- https://www.womenandminoritybusiness.org/ohio-free-grants/
- https://fundingforgood.org/comparing-grant-research-databases/

---

**Deliverable Complete:** Phase 1 Research Document (8.2KB)  
**Status:** Ready for Phase 2 Resource Procurement
