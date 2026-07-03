# invest-ashtabula — Phase 2 SPEC Refinement v0.1

**Project:** invest-ashtabula (Economic Development Portal)  
**Status:** Phase 1 Research Complete → Phase 2 SPEC Refinement  
**Date:** 2026-02-16  
**Target:** Implementation-ready build specification

---

## 1. Executive Summary

### Strategic Position
Based on competitive analysis, **invest-ashtabula** has a **blue ocean opportunity** with an interactive utility capacity dashboard — no regional competitor offers self-serve utility data. This feature alone can differentiate Ashtabula from JobsOhio, Columbus Region, and Team NEO.

### Scope Decision: MVP vs. Full Build
| Approach | Timeline | Features | Risk |
|----------|----------|----------|------|
| **MVP (Recommended)** | 2-3 days | Static site map, basic incentives list, contact form | Low, fast feedback |
| Full Build | 2-3 weeks | Interactive map, utility dashboard, AI matching | Requires data access |

**Recommendation:** Proceed with **MVP first**, then iterate to full build based on stakeholder feedback.

---

## 2. Competitive Differentiation Strategy

### Gap Analysis Summary
From `COMPETITIVE-ANALYSIS-v0.1.md`:

| Competitor | Their Strength | Their Gap | Our Opportunity |
|------------|---------------|-----------|-----------------|
| JobsOhio | Statewide reach, polished UI | No local utility data | Ashtabula-specific utility dashboard |
| Columbus Region | Interactive map, rich data | Requires account for details | Open access, no login required |
| Team NEO | Good storytelling | Static content | Live data, dynamic availability |
| Erie County | Simple, direct | Limited features | Feature-rich but focused |

### Key Differentiators for MVP
1. **No login required** — Open access to all site data (vs. Columbus Region's gated approach)
2. **Utility-first messaging** — Lead with capacity, not just location
3. **Fast response guarantee** — Calendly integration for immediate meetings
4. **Local photography** — Real Ashtabula assets, not stock imagery

---

## 3. MVP Feature Specification

### 3.1 Core Pages

#### Home Page
**Hero Section:**
- Headline: "Invest in Ashtabula — Industrial Ready Sites with Utility Capacity"
- Subhead: "Available now: Rail-served, I-90 accessible, Port-connected"
- CTA: "View Available Sites" (primary) + "Schedule a Call" (secondary)

**Value Props (3 cards):**
1. **Available Sites** — " shovel-ready industrial sites with confirmed utility capacity"
2. **Fast Permitting** — "Streamlined local process, state incentive coordination"
3. **Connectivity** — "I-90, Class I rail, deep-water port within 15 minutes"

**Featured Sites Preview:**
- Display top 3 sites with thumbnail, size, key attributes
- "View All Sites" link to directory

**Stats Bar:**
- "X acres available" / "Y sites ready" / "Z days average permitting"

#### Sites Directory Page
**Filter Bar:**
- Size range (slider: 1-10 acres, 10-50, 50-100, 100+)
- Features (rail access, port access, utilities confirmed)
- Zoning (industrial, commercial, mixed-use)

**Site Cards:**
- Photo thumbnail
- Name + address
- Size (acres)
- Key tags (rail, port, utilities)
- "View Details" CTA

**Site Detail Page:**
- Photo gallery (3-5 images)
- Map embed (Google Maps static or Mapbox)
- Site specifications table
  - Total acreage
  - Zoning classification
  - Current status (available/optioned/sold)
  - Utility capacity (water, sewer, electric, gas)
  - Transportation access
- Contact form (or Calendly embed)
- "Similar Sites" recommendations

#### Incentives Page
**Content Sections:**
1. **Local Incentives** — ACED programs, city grants, fee reductions
2. **State Incentives** — JobsOhio, OhioSE, tax credits
3. **Federal Programs** — Opportunity Zone, EDA grants

**Format:** Card-based with eligibility checklist for each

#### About Ashtabula Page
**Sections:**
- Location advantages (I-90, rail, port)
- Workforce overview (commuting radius, education levels)
- Quality of life (cost of living, recreation, education)
- Success stories (placeholder for case studies)

#### Contact Page
- Simple form: Name, Company, Interest, Message
- Calendly embed for direct booking
- ACED contact information
- Social links

### 3.2 Technical Architecture (MVP)

**Stack:**
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel (free tier sufficient for MVP)
- **Forms:** Resend.com (free tier, 100 emails/day)
- **Images:** Local or Cloudinary (free tier)
- **Maps:** Google Maps embed (free with API key) or static images

**Data Structure (Static JSON for MVP):**
```json
{
  "sites": [
    {
      "id": "site-001",
      "name": "West Avenue Industrial Park",
      "address": "1234 West Ave, Ashtabula, OH 44004",
      "acreage": 45,
      "zoning": "Industrial",
      "status": "available",
      "features": ["rail-access", "utilities-confirmed"],
      "photos": ["/sites/site-001-1.jpg"],
      "utilities": {
        "water": "confirmed",
        "sewer": "confirmed", 
        "electric": "confirmed",
        "gas": "confirmed"
      },
      "transportation": {
        "i90_distance": "2 miles",
        "rail_access": "CSX spur on-site",
        "port_distance": "8 miles"
      }
    }
  ]
}
```

**Page Routes:**
```
/                    → Home
/sites               → Sites directory
/sites/[id]          → Site detail
/incentives          → Incentives overview
/about               → About Ashtabula
/contact             → Contact page
```

---

## 4. Content Requirements

### 4.1 Required Assets

**Photography Needs:**
| Site | Shots Needed | Priority |
|------|-------------|----------|
| West Avenue Industrial | Aerial, street view, utility close-up | P0 |
| Harbor Street Parcel | Aerial, port view, rail access | P0 |
| Downtown Commercial | Street view, storefronts, parking | P1 |

**Data to Collect:**
- [ ] Exact acreage for each site (GIS or survey)
- [ ] Utility capacity confirmations (city water/sewer dept)
- [ ] Zoning verification (City PCD)
- [ ] Current availability status (ACED)
- [ ] Rail access details (CSX contact)

### 4.2 Copy Needs

**Homepage:**
- Hero headline + subhead (2-3 variants to test)
- Value prop card copy (3 x 50 words)
- Stats (need real numbers from ACED)

**Sites Pages:**
- Site descriptions (100-150 words each)
- Utility spec explanations (help text)
- Filter labels and helper text

**About Page:**
- Location/transportation overview
- Workforce narrative
- Quality of life highlights

---

## 5. Implementation Plan

### Phase 1: Foundation (Day 1)
- [ ] Initialize Next.js project with shadcn/ui
- [ ] Set up base layout and navigation
- [ ] Create static data file with 2-3 sample sites
- [ ] Build home page shell

### Phase 2: Sites Directory (Day 1-2)
- [ ] Sites listing page with filters
- [ ] Site detail page template
- [ ] Site data for 3 real locations
- [ ] Photo placeholders

### Phase 3: Content Pages (Day 2)
- [ ] Incentives page
- [ ] About page
- [ ] Contact form with Resend integration
- [ ] Calendly embed

### Phase 4: Polish & Deploy (Day 2-3)
- [ ] Responsive testing
- [ ] SEO basics (meta tags, sitemap)
- [ ] Vercel deployment
- [ ] Domain configuration (subdomain of noirsys or ACED)

---

## 6. Open Questions for Michael

1. **Photography:** Do we have budget for drone/site photography, or should we use existing ACED photos?
2. **Data Access:** Can ACED provide a spreadsheet of available sites with specifications?
3. **Stakeholder Review:** Should we share MVP with ACED before public launch?
4. **Domain:** invest-ashtabula.com, ashtabula.noirsys.com, or ACED subdomain?
5. **Utility Data:** Who at the city can confirm utility capacity for specific sites?

---

## 7. Success Metrics (MVP)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Site visits (month 1) | 100+ | Vercel Analytics |
| Form submissions | 5+ | Resend logs |
| Time on site | 2+ min | Vercel Analytics |
| Bounce rate | <60% | Vercel Analytics |

---

## 8. Post-MVP Roadmap

**Phase 2:** Interactive map with Mapbox, dynamic filtering
**Phase 3:** Utility capacity dashboard (the blue ocean feature)
**Phase 4:** AI site matching based on requirements
**Phase 5:** Admin dashboard for ACED to update sites

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| No site photography available | Medium | High | Use Google Street View, plan photo shoot |
| ACED data incomplete | Medium | Medium | Start with 2-3 confirmed sites, expand later |
| Utility data hard to obtain | High | Medium | Use "contact to confirm" fallback for MVP |
| Low initial traffic | Low | Low | Share with ACED, local business groups |

---

**Status:** Ready for Michael review and Phase 1 implementation kickoff.
