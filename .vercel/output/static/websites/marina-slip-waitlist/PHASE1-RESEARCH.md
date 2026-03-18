# Phase 1: Research & Recon — Marina Slip Waitlist
**Project:** marina-slip-waitlist  
**Date:** 2026-02-20  
**Researcher:** Rondell (Noirsys AI)

---

## Executive Summary

The marina-slip-waitlist tool addresses a critical gap in Ashtabula's maritime infrastructure: **the lack of transparent, digital waitlist management for boat slips**. While competitors like Dockwa and Snag-A-Slip focus on transient reservations, there's no affordable, waitlist-focused solution for seasonal slip seekers. With 11 marinas in Ashtabula Harbor alone and 380+ marinas on Ohio's Lake Erie waters, the market opportunity is significant.

**Key Insight:** Most marinas still manage waitlists via paper, spreadsheets, or memory — creating friction for boaters and lost revenue for marinas when slips sit empty between tenants.

---

## 1. Market Landscape

### 1.1 Regional Marina Infrastructure

**Ashtabula Harbor Marinas (11 total):**

| Marina | Contact | Phone | Notes |
|--------|---------|-------|-------|
| Archway Marina | — | 440-964-6494 | — |
| ARU Marina & Campgrounds | 1500 Great Lakes | 440-992-9445 / 440-228-1208 | 2025 reservations open; campsites + docks |
| Ashtabula Yacht Club | 970 West 5th Street | 440-964-3129 | [aycohio.com](http://www.aycohio.com/) |
| Brockway North Coast Marina | 115 East 24th Street | 440-998-6272 | [northcoastmarina.com](http://www.northcoastmarina.com/) — 250 boat capacity, on Dockwa |
| Harbor Yacht Club | 1833 Giannell Avenue | 440-992-2628 | [harboryachtclub.net](https://www.harboryachtclub.net/) — private marina, seasonal openings |
| Jack's Marine | 2000 Great Lakes Avenue | 440-997-5060 | — |
| Kister Marina | 950 West 5th Street | 440-997-5676 | — |
| Marshall Marine | 529 Front Street | 440-992-1508 | — |
| River Marine | 465 East 5th Street | 440-964-3474 | — |
| Riverside Yacht Club | 183 East 15th Street | 440-992-1388 | — |
| Sutherland Marine | 970 Bridge Street | 440-964-3434 | sutherlandmarine@windstream.net |

**Nearby Major Facility:**
- **Geneva Marina**: 379 slips, transient docking, accommodates up to 90ft vessels — [genevamarina.com](https://www.genevamarina.com/)

### 1.2 Economic Impact Data

| Metric | Value | Source |
|--------|-------|--------|
| Ohio recreational boating economic impact | **$3.6 Billion** | ODNR/Penn & Associates 2022 |
| Lake Erie contribution to Ohio boating | **$1.3 Billion** | ODNR 2022 |
| Ohio tourism total visitor spending | **$47 Billion/year** | Lake Erie Quality Index 2022 |
| Licensed marinas on Ohio Lake Erie waters | **~380** | ODNR |
| Ohio boat registrations ranking | **Top 5 in US** | OMTA |

---

## 2. Competitor Analysis

### 2.1 Direct Competitors

| Platform | Focus | Pricing | Waitlist Feature | Notes |
|----------|-------|---------|------------------|-------|
| **Dockwa** | Transient reservations | Commission-based | ✅ Yes | Market leader, 24/7 booking, mobile app |
| **Snag-A-Slip** | Slip reservations | Commission-based | ⚠️ Limited | Seamless integration pitch |
| **Molo** | Marina management | SaaS subscription | ✅ Yes | Contract management focus |
| **DockMaster** | Full marina ERP | Enterprise pricing | ✅ Yes | Boatyard, dealership features |
| **Guest Tracker** | Lodge + Marina | SaaS | ✅ Yes | POS integration |
| **Sharper MMS** | Marina management | Flat rate | ✅ Yes | Color-coded mapping |

### 2.2 Gap Analysis

**What exists:**
- Transient/nightly reservation platforms (Dockwa, Snag-A-Slip)
- Full marina ERP systems (DockMaster — expensive, complex)
- General reservation tools (not waitlist-optimized)

**What's missing:**
- **Waitlist-first design** — Most tools treat waitlist as secondary to immediate bookings
- **Affordable pricing for small marinas** — Enterprise tools cost too much for 50-200 slip operations
- **Regional network effect** — No tool aggregates waitlists across multiple local marinas
- **Boater-side transparency** — Boaters can't see position, estimated wait time, or alternatives

---

## 3. User Personas

### 3.1 Primary: Seasonal Slip Seeker "Captain Carl"
- **Demographics:** 45-65, boat owner (25-40ft), lives within 2 hours of Lake Erie
- **Pain points:** 
  - Calls 5+ marinas every spring hoping for openings
  - No visibility into waitlist position
  - Misses opportunities when slips open unexpectedly
  - Doesn't know which marinas have shorter waits
- **Goals:** Secure reliable seasonal slip, plan boating season confidently
- **Tech comfort:** Moderate — uses smartphone, Facebook, email

### 3.2 Secondary: Marina Manager "Marina Mary"
- **Demographics:** 35-60, manages 50-250 slips, wears many hats
- **Pain points:**
  - Paper waitlists get lost or outdated
  - No-shows when slips open (can't reach next person quickly)
  - Spreadsheets don't sync between staff
  - No data on demand patterns
- **Goals:** Fill slips efficiently, reduce administrative overhead, improve customer service
- **Tech comfort:** Low-moderate — uses email, basic software, resistant to complex systems

### 3.3 Tertiary: Transient Boater "Weekend Wendy"
- **Demographics:** 30-55, day/weekend trips, no permanent slip
- **Pain points:**
  - Last-minute planning means few options
  - Doesn't know which marinas have transient space
- **Goals:** Easy spontaneous trips, backup options when favorite marina is full

---

## 4. Stakeholder Mapping

### 4.1 Marina Operators (Direct Customers)
**Priority targets for Phase 2 outreach:**

| Marina | Priority | Why | Contact Method |
|--------|----------|-----|----------------|
| Brockway North Coast Marina | P0 | Already on Dockwa = tech-forward, 250 slips | Phone: 440-998-6272 |
| Harbor Yacht Club | P0 | Private club, seasonal openings mentioned online | Phone: 440-992-2628 |
| Geneva Marina | P0 | Largest facility (379 slips), public entity | GM: 440.466.7565 |
| ARU Marina | P1 | Mixed campground/marina, 2025 bookings open | 440-228-1208 |
| Ashtabula Yacht Club | P1 | Organized club with website | 440-964-3129 |

### 4.2 Support Organizations
| Organization | Role | Contact Angle |
|--------------|------|---------------|
| Ashtabula County Visitors Bureau | Tourism promotion | Partnership for boater outreach |
| OMTA (Ohio Marine Trades Assoc) | Industry advocacy | Distribution channel |
| ODNR (Ohio DNR) | Marina licensing | Credibility, potential pilot |
| Lake Erie Marine Trades Assoc | Regional advocacy | Network introductions |

### 4.3 Synergies with Other MVPs
| Project | Synergy |
|---------|---------|
| boat-storage-waitlist | Same marinas, different service — bundle opportunity |
| harbor-cam-dashboard | Combined boater portal: slips + conditions |
| gotl-weekend-planner | Referral traffic: visitors need transient slips |

---

## 5. Data Sources & APIs

### 5.1 Potential Integrations
| Source | Data Type | Access |
|--------|-----------|--------|
| ODNR Marina Database | Licensed marinas, slip counts | Public records request |
| NOAA Weather API | Marine conditions | Free API |
| Dockwa API | Transient availability | Partner program? |
| Stripe/PayPal | Waitlist deposits | Standard integration |

### 5.2 Required Data Points
- Marina contact information ✅ (partially collected)
- Slip counts by size (20ft, 24ft, 26ft, 30ft, 90ft+)
- Seasonal vs. transient split
- Current waitlist lengths (Phase 2 research)
- Pricing by slip size

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Marinas resistant to technology | Medium | High | Start with tech-forward marinas; emphasize simplicity |
| Dockwa/Snag-A-Slip adds waitlist features | Medium | Medium | Focus on regional network, affordability |
| Low boater adoption | Low | High | Free for boaters; marina-driven onboarding |
| Seasonal business (May-Oct) | High | Medium | Annual pricing, winter storage tie-ins |
| Data accuracy (marina-provided) | Medium | Medium | Self-service portal, verification workflows |

---

## 7. Key Questions for Phase 2

1. **What's the average wait time for seasonal slips at each marina?** (Days? Months? Years?)
2. **How do marinas currently manage waitlists?** (Paper? Excel? Memory?)
3. **What percentage of slips turn over annually?**
4. **Would marinas pay for waitlist management? How much?**
5. **Do marinas currently take waitlist deposits?**
6. **What slip sizes have highest demand/lowest availability?**
7. **Is there coordination between marinas for overflow?**

---

## 8. Next Steps (Phase 2)

1. **Contact priority marinas** — Phone interviews with North Coast, Harbor Yacht Club, Geneva Marina
2. **Create outreach package** — Email templates, one-pager, demo mockup
3. **Validate pricing hypothesis** — Survey marina managers on willingness to pay
4. **Map detailed slip inventory** — Size breakdowns, amenities, pricing tiers
5. **Identify early adopter** — Marina willing to pilot waitlist tool

---

## Appendix: Research Sources

- [City of Ashtabula Marinas](https://www.cityofashtabula.com/marinas)
- [Geneva Marina](https://www.genevamarina.com/)
- [Harbor Yacht Club](https://www.harboryachtclub.net/)
- [North Coast Marina on Dockwa](https://dockwa.com/explore/destination/95cdgx-north-coast-marina-and-campground)
- [ODNR Boating Economic Impact 2022](https://dam.assets.ohio.gov/image/upload/ohiodnr.gov/documents/parks/survey/Ohio-Recreational-Boating-Economic-Impact-2022-Report.pdf)
- [Lake Erie Tourism Economic Impact](https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/lakeerieoh/LAKE_ERIE_S_ECONOMIC_IMPACT_UPDATE_06_2025_3ac71689-40d6-4394-a95f-39f5023e4561.pdf)
- Competitor platforms: Dockwa, Snag-A-Slip, Molo, DockMaster, Sharper MMS

---

*Document prepared for New Ashtabula Initiative — marina-slip-waitlist MVP*
