# Phase 1: Research & Recon — Visitor Parking Finder
**Date:** February 19, 2026  
**Researcher:** Rondell / Noirsys AI  
**Project:** visitor-parking-finder (New Ashtabula Initiative)

---

## Executive Summary

The visitor parking problem in small tourism markets like Ashtabula County presents a **high-value, under-served opportunity**. While major cities have mature parking app ecosystems (ParkMobile, SpotHero), small tourism destinations lack affordable, easy-to-deploy solutions that match their scale and visitor patterns.

**Key Finding:** There is no dominant parking finder solution for small city tourism markets. Current options are either:
- Too expensive/complex for small municipalities (ParkMobile integration)
- Focused on major metros (SpotHero, ParkWhiz)
- Non-existent (Ashtabula County has no unified parking information system)

---

## 1. Competitor Landscape

### Tier 1: Major Players (Not Direct Competition)
| Competitor | Model | Pricing | Small City Fit |
|------------|-------|---------|----------------|
| **ParkMobile** | Pay-by-app meter integration | ~$0.35/transaction + setup | ❌ Poor — requires meter infrastructure, 500+ cities only |
| **SpotHero** | Pre-book garage/lot parking | 10-20% commission on bookings | ❌ Poor — focuses on major metros, garages only |
| **ParkWhiz** | Reservation marketplace | Commission-based | ❌ Poor — needs density of supply |

**Key Insight:** These platforms ignore small tourism markets because transaction volumes don't justify infrastructure costs.

### Tier 2: Municipal Solutions (Fragmented)
| Approach | Examples | Limitations |
|----------|----------|-------------|
| PDF maps | Lake Geneva, Traverse City | Static, outdated, poor mobile experience |
| Pay-by-plate kiosks | Downtown Lake Geneva | Infrastructure cost ($5K-15K per kiosk) |
| WordPress plugins | Various small towns | No real-time data, poor UX |

**Gap Identified:** No solution offers **affordable, dynamic, mobile-first parking guidance** for small tourism destinations.

### Tier 3: Tourism-Specific (Adjacent Competition)
- **Visit Widget parking modules** — Expensive, white-glove setup
- **Custom city apps** — High dev cost ($50K+), maintenance burden
- **Google Maps parking layer** — Limited small city coverage, no local rules

---

## 2. Ashtabula County Stakeholder Map

### Primary Stakeholders (Direct Beneficiaries)

#### A. Geneva-on-the-Lake (GOTL)
**Role:** Primary tourism destination (Ohio's First Summer Resort)  
**Pain Points:**
- Summer congestion (Memorial Day–Labor Day)
- Limited street parking on "The Strip"
- RV parking confusion (separate ordinance, different rules)
- No real-time availability data

**Contact Leads:**
- Geneva-on-the-Lake Convention & Visitors Bureau: visitus@ashtabulacounty.com / (440) 466-8600
- Geneva Township Park Board: genevatownshippark.org
- Village of Geneva-on-the-Lake Administration

#### B. Historic Ashtabula Harbor
**Role:** Secondary tourism hub, dining/retail district  
**Pain Points:**
- Bridge Street congestion during events
- Walnut Beach parking overflow
- Mix of free (street) and paid (lot) parking creates confusion
- Visitors circle looking for spots

**Contact Leads:**
- Historic Ashtabula Harbor organization: historicashtabulaharbor.org
- Ashtabula County Tourism Bureau: Stephanie Siegel, Executive Director
- City of Ashtabula Economic Development

#### C. Ashtabula County Convention & Visitors Bureau
**Role:** County-wide tourism coordination  
**Pain Points:**
- Fragmented information across 20+ municipalities
- No unified visitor experience
- Limited digital infrastructure budget

**Contact:**
- Main: (440) 466-8197
- Email: visitus@ashtabulacounty.com
- Location: 4631 Main Ave, Ashtabula, OH 44004

### Secondary Stakeholders

| Entity | Interest | Engagement Strategy |
|--------|----------|---------------------|
| **Geneva Township** | Park operations | Data sharing agreement for lot status |
| **City of Ashtabula** | Harbor parking management | Pilot program for dynamic signage |
| **Local businesses** | Customer convenience | Embed widget on websites |
| **Rental property owners** | Guest amenity | Include in welcome packets |
| **Event organizers** | Festival parking | Integration with event calendars |

---

## 3. Data Sources & Availability

### Tier 1: Authoritative (Municipal)
| Source | Data Type | Access Method | Reliability |
|--------|-----------|---------------|-------------|
| Geneva Township Park | Lot capacity, hours | Manual partnership | High (single authority) |
| City of Ashtabula | Street parking rules | FOIA/public records | Medium (fragmented) |
| GOTL CVB | Visitor patterns | Partnership | Medium |

### Tier 2: Observable (User-Generated/Crowd)
| Source | Data Type | Collection Method |
|--------|-----------|-------------------|
| Traffic cameras | Congestion levels | Computer vision (future) |
| User check-ins | "I found parking" | App feedback loop |
| Business reports | Lot fullness | SMS/email to admin |

### Tier 3: Static (Reference)
| Source | Data Type | Maintenance |
|--------|-----------|-------------|
| Municipal codes | Rules, restrictions | Annual review |
| Google Maps | Location data | API integration |
| Tourism websites | Descriptions | Quarterly audit |

### Critical Data Gaps
1. **Real-time occupancy** — No municipal sensors exist
2. **Event-based changes** — No centralized event calendar with parking impacts
3. **Seasonal variations** — Rules change (summer vs. winter parking bans)

---

## 4. Technical Feasibility Assessment

### Current MVP State
- React + Vite frontend
- Gemini API for text generation
- No persistent data layer
- No real-time integrations

### Required Enhancements for Production

#### Phase A: Static Intelligence (Immediate)
- Curated parking location database (JSON/CSV)
- Rules engine for seasonal/time-based restrictions
- Basic admin dashboard for updates

#### Phase B: Semi-Dynamic (3-6 months)
- Business owner "fullness" reporting (SMS/web)
- Event calendar integration
- Push notifications for changes

#### Phase C: Smart Features (6-12 months)
- Computer vision for lot counting (if cameras available)
- Predictive availability based on historical patterns
- Integration with municipal payment systems

---

## 5. Business Model Options

### Option A: Municipal SaaS (Recommended)
- **Pricing:** $200-500/month per municipality
- **Value Prop:** White-label parking guide, admin dashboard, embeddable widget
- **Target:** CVB, township administrations
- **Advantage:** Recurring revenue, civic mission alignment

### Option B: Tourism Partnership
- **Pricing:** Free tool, sponsored by CVB/hospitality businesses
- **Value Prop:** Visitor experience improvement
- **Target:** CVB as single sponsor
- **Advantage:** Fast deployment, community goodwill

### Option C: Freemium Consumer App
- **Pricing:** Free basic, $2.99/event day premium (real-time updates)
- **Value Prop:** Stress-free parking during peak times
- **Target:** Visitors directly
- **Risk:** Low adoption in small market

---

## 6. Go-to-Market Recommendations

### Immediate Actions (Week 1-2)
1. **Stakeholder outreach:** Contact GOTL CVB for initial conversation
2. **Data collection:** Manual audit of parking in GOTL and Harbor
3. **Competitor validation:** Confirm no competing solution in market

### Short-Term (Month 1)
1. **Pilot location:** Partner with one high-traffic area (GOTL "Strip" or Harbor Bridge Street)
2. **Static MVP:** Launch with curated, manually-updated data
3. **Feedback loop:** QR codes at parking areas for user reports

### Medium-Term (Months 2-6)
1. **Expand coverage:** Add remaining Ashtabula County destinations
2. **Dynamic features:** Implement business owner reporting
3. **Integration:** Embed on CVB website, local business sites

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Municipal politics slow adoption | High | Medium | Start with CVB (marketing), not city hall (bureaucracy) |
| Data becomes stale | Medium | High | Simple admin UI + SMS update system for business owners |
| Low visitor adoption | Low | High | Embed on tourism sites, don't require app download |
| Competing solution emerges | Low | Medium | Move fast on partnerships, build relationships |

---

## 8. Next Steps (Phase 2 Prep)

### Resource Procurement Targets
1. **GOTL CVB** — Partnership lead, data sharing
2. **Geneva Township** — Parking lot data, event calendar
3. **3-5 local businesses** — Beta testers for owner reporting feature

### Phase 2 Deliverables Needed
- Outreach email templates
- Data sharing agreement template
- Pilot program proposal deck
- Technical architecture for static MVP

---

## Appendix A: Research Sources

### Web Sources
- ParkMobile municipal integration docs (parkmobile.io)
- SpotHero city coverage analysis (spothero.com)
- Lake Geneva parking guide (visitlakegeneva.com)
- Traverse City parking integration (traversecity.com)
- Historic Ashtabula Harbor (historicashtabulaharbor.org)
- Geneva-on-the-Lake CVB (genevaonthelake.org)

### Local Intelligence
- GOTL "Strip" — Known summer congestion from local knowledge
- Ashtabula Harbor Bridge Street — Event-based parking issues
- Geneva Township Park — Municipal lot with defined capacity

---

## Appendix B: Comparable Markets

| Market | Population | Tourism Volume | Parking Solution | Our Advantage |
|--------|------------|----------------|------------------|---------------|
| Lake Geneva, WI | 7,700 | High (Chicago getaway) | ParkMobile + PDF maps | Lower cost, easier setup |
| Traverse City, MI | 15,700 | Very High | ParkMobile integration | No meter infrastructure needed |
| Put-in-Bay, OH | 138 | Extreme (seasonal) | None (ferry-centric) | First-mover advantage |
| Geneva-on-the-Lake, OH | 1,200 | High (Cleveland/Pittsburgh) | None identified | **Blue ocean** |

**Conclusion:** Geneva-on-the-Lake represents an ideal beachhead market — significant tourism volume, no existing solution, manageable geographic scope for pilot.

---

*Document Version: 1.0*  
*Next Review: After Phase 2 stakeholder outreach*  
*Owner: New Ashtabula Initiative / Noirsys AI*
