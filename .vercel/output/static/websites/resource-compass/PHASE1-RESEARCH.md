# resource-compass — Phase 1: Research & Recon

**Project:** Resource Compass — Social Services Aid Navigator for Ashtabula County  
**Type:** Civic/Community Tool  
**Date:** February 18, 2026  
**Researcher:** Rondell (Noirsys AI)

---

## 1. Executive Summary

**Resource Compass** is a unified social services directory and navigation tool designed to help Ashtabula County residents quickly find and access local aid resources — from food pantries and shelters to mental health services and emergency assistance.

**Key Finding:** While 211 Ashtabula provides an existing phone/online resource portal, there's an opportunity to create a **mobile-first, modern, map-based interface** that makes resource discovery faster and more intuitive — especially for users in crisis situations who need immediate, visual, location-based results.

---

## 2. Problem Statement

Ashtabula County residents facing hardship currently must:
- Call 211 and navigate phone menus during business hours
- Use a basic Wix-based web portal with limited search/filter capabilities
- Navigate multiple disconnected websites (ACCAA, Homesafe, 211, United Way)
- Lack mobile-optimized, real-time resource availability information

**Pain Points:**
- No map-based "find services near me" view
- No real-time availability (shelter bed availability, food pantry hours)
- No mobile app or PWA for offline access
- Difficult to filter by eligibility requirements
- No clear path for service providers to update their own listings

---

## 3. User Personas

### Persona 1: Emergency Emily
- **Situation:** Just evicted, needs emergency shelter tonight
- **Needs:** Immediate shelter availability, location map, eligibility check
- **Tech comfort:** Smartphone-only, limited data plan
- **Pain point:** Can't wait for 211 callback during crisis

### Persona 2: Struggling Steve
- **Situation:** Working family, paycheck-to-paycheck, needs food assistance
- **Needs:** Food pantry hours, requirements, multiple options near home/work
- **Tech comfort:** Basic smartphone skills
- **Pain point:** Drives to pantry only to find it closed or requirements changed

### Persona 3: Social Worker Sarah
- **Situation:** Case manager helping multiple clients
- **Needs:** Comprehensive directory, referral tracking, printable resource lists
- **Tech comfort:** Desktop + mobile, power user
- **Pain point:** Outdated resource information, no way to verify current services

### Persona 4: Senior Margaret
- **Situation:** Fixed income, needs help with utilities and prescription costs
- **Needs:** Large text, simple interface, phone numbers prominent
- **Tech comfort:** Limited, prefers simple websites
- **Pain point:** Complex forms, small text, confusing navigation

---

## 4. Competitive Analysis

### Direct Competitors

| Competitor | Strengths | Weaknesses | Opportunity for Resource Compass |
|------------|-----------|------------|----------------------------------|
| **211 Ashtabula** | Established, trusted, comprehensive | Basic Wix site, no map view, limited mobile UX | Modern mobile-first redesign with maps |
| **Findhelp.org (Aunt Bertha)** | National platform, extensive database | Paywalled features, not Ashtabula-specific | Free, hyper-local focus with real-time updates |
| **GracesList.org** | Christian-focused, simple listings | Limited coverage, not comprehensive | Broader service coverage, secular option |
| **United Way Ashtabula** | Local trust, partner charities | Static PDF lists, no interactive search | Dynamic, searchable database |

### Indirect Competitors
- Google Maps (generic, no service details)
- Facebook community groups (unreliable, scattered info)
- Word-of-mouth / paper resource lists (outdated quickly)

**Gap Analysis:**
- No free, modern, mobile-optimized social services directory exists specifically for Ashtabula County
- Existing 211 portal lacks map-based discovery and real-time availability
- Opportunity for provider self-service portal to keep data fresh

---

## 5. Service Categories & Stakeholder Map

### Service Categories (8 Core Areas)

1. **Emergency Shelter & Housing**
   - Domestic violence shelter (Homesafe)
   - Homeless/transitional housing (New Hope Program/ACCAA)
   - Emergency rental assistance

2. **Food Assistance**
   - Food pantries (20+ locations)
   - Hot meal programs (Lighthouse Harvest, Dream Center)
   - Weekend backpack programs for kids

3. **Utilities & Financial Aid**
   - HEAP (Home Energy Assistance)
   - PIPP Plus (Percentage of Income Payment Plan)
   - Emergency Food & Shelter Program (FEMA funds via ACCAA)

4. **Healthcare & Mental Health**
   - Ashtabula County MHRS Board services
   - Lake-Geauga Recovery Centers
   - Community Counseling Center (Conneaut)
   - Ashtabula County Medical Center

5. **Emergency Crisis Support**
   - 211 hotline
   - Crisis text lines
   - Domestic violence hotline (Homesafe: 800-952-2873)

6. **Clothing & Household Goods**
   - Ashtabula Dream Center (clothing bank)
   - Goodwill Ashtabula
   - Various church-based ministries

7. **Transportation**
   - ACTS (Ashtabula County Transportation System)
   - Medical transportation services

8. **Employment & Training**
   - ACCAA employment services
   - OhioMeansJobs Ashtabula

### Stakeholder Map

| Organization | Role | Contact | Priority |
|--------------|------|---------|----------|
| **ACCAA** | Primary service provider, 211 operator | 440-997-1721, 211@accaa.org | P0 - Essential partner |
| **211 Ashtabula** | Information & referral service | 211 or 800-874-8545 | P0 - Data source |
| **Homesafe, Inc.** | DV shelter & services | 440-992-2727, 800-952-2873 | P0 - Critical resource |
| **United Way Ashtabula** | Funding, partner charities | unitedwayashtabula.org | P1 - Data & funding |
| **Ashtabula Dream Center** | Food/clothing pantry | 440-998-3732 | P1 - Key resource |
| **Ashtabula MHRS Board** | Mental health services | ashtabulamhrs.org | P1 - Health services |
| **Country Neighbor** | Regional food bank | countryneighbor.org | P2 - Food distribution |
| **Local Churches** | Various ministries | Multiple | P2 - Supplemental |

---

## 6. Technical Feasibility

### Data Sources

**Primary (Open/Accessible):**
- 211 Ashtabula resource database (potential API or data export)
- Publicly listed service information (manual curation initially)
- Google Places API for geocoding

**Potential Partnerships:**
- ACCAA data feed
- United Way partner database
- Individual provider self-service portal

### MVP Feature Set

**Core (Phase 1):**
- Searchable directory with 50+ resources
- Category filtering (8 core areas)
- Map view with location pins
- Basic details: hours, requirements, phone, address
- Mobile-responsive design

**Phase 2:**
- Provider self-service portal for updates
- "Open Now" filtering
- Printable resource lists
- Spanish language toggle
- SMS resource lookup

**Phase 3:**
- Real-time shelter bed availability
- User reviews/ratings
- Referral tracking for case managers
- Offline PWA capability

### Tech Stack Options

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **Airtable + Glide** | Rapid deployment, built-in CMS | Limited customization, ongoing costs | Good for MVP |
| **Supabase + Next.js** | Full control, scalable, low cost | More development time | Good for v1.0 |
| **WordPress + Directory Plugin** | Easy content management | Less mobile-optimized, plugin dependencies | Avoid |
| **Firebase + React** | Real-time updates, scalable | Vendor lock-in | Good for real-time features |

**Recommended MVP:** Supabase + Next.js + Mapbox/Google Maps

---

## 7. Market Size & Impact

### Ashtabula County Demographics
- Population: ~97,000 residents
- Poverty rate: ~18% (higher than Ohio average)
- Median household income: ~$45,000 (below state median)
- Estimated households needing assistance: 10,000+ annually

### Usage Projections (Year 1)
- Conservative: 500 unique users/month
- Moderate: 2,000 unique users/month (with outreach)
- Optimistic: 5,000+ unique users/month (with 211 integration)

### Impact Metrics
- Time saved per resource search: 15-30 minutes vs. calling 211
- Reduced "wrong trip" instances (closed pantries, ineligible services)
- Improved case worker efficiency

---

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data becomes outdated | High | High | Provider portal + quarterly verification |
| 211 views as competition | Medium | Medium | Position as complementary, seek partnership |
| Low adoption without marketing | High | Medium | Partner with ACCAA for promotion |
| Shelter availability accuracy | Medium | High | Manual verification + disclaimer |
| Liability for incorrect info | Low | High | Clear disclaimers, terms of service |

---

## 9. Differentiation Strategy

**Why Resource Compass vs. Existing Options:**

1. **Mobile-First Design:** Built for smartphones first, not desktop
2. **Map-Centric:** Visual, location-based discovery
3. **Real-Time Hours:** Integration with Google Business hours
4. **Offline Capability:** PWA works without constant connection
5. **No Paywall:** Completely free for users and providers
6. **Local Control:** Ashtabula-owned, not national platform
7. **Case Worker Tools:** Features specifically for social workers

---

## 10. Phase 2: Resource Procurement Plan

### Immediate Actions

1. **Contact ACCAA (211)**
   - Request meeting with 211 coordinator
   - Discuss data sharing partnership
   - Position as complementary tool, not replacement

2. **Contact Homesafe**
   - Verify shelter information
   - Discuss real-time bed availability API (future)

3. **Contact Ashtabula Dream Center**
   - Verify food/clothing pantry hours
   - Discuss partnership for resource updates

4. **Contact United Way Ashtabula**
   - Access partner charity database
   - Discuss co-marketing opportunity

### Outreach Email Draft (ACCAA)

```
Subject: Partnership Proposal — Resource Compass for Ashtabula County

Dear [ACCAA Leadership],

I'm reaching out from Noirsys AI, a local technology initiative focused on 
modernizing Ashtabula's community infrastructure.

We've identified an opportunity to complement 211 Ashtabula's excellent phone 
service with a modern, mobile-first web directory that makes it easier for 
residents to visually discover nearby social services on a map.

Key features we'd build:
- Map-based resource discovery
- Mobile-optimized interface
- Integration with existing 211 data
- Free for all users and providers

Would you be open to a 15-minute conversation about how we could work together 
to serve Ashtabula residents more effectively?

Best regards,
[Name]
Noirsys AI / New Ashtabula Initiative
```

---

## 11. Success Metrics

### MVP Success Criteria
- [ ] 50+ resources catalogued with accurate information
- [ ] 500+ unique visitors in first 3 months
- [ ] Partnership agreement with ACCAA or United Way
- [ ] 5+ service providers using self-update portal
- [ ] Average time-to-find-resource under 2 minutes

### Long-Term Goals
- [ ] Integration with 211 data feed
- [ ] Real-time shelter bed availability
- [ ] 5,000+ monthly active users
- [ ] Expansion to Lake/Geauga counties
- [ ] Recognition as official county resource directory

---

## 12. Next Steps

1. **Phase 2 — Resource Procurement** (Week 1-2)
   - Contact ACCAA, Homesafe, Dream Center
   - Compile comprehensive resource database
   - Verify all contact information and hours

2. **Phase 3 — SPEC.md** (Week 3)
   - Define technical architecture
   - Create wireframes
   - Plan provider portal

3. **Phase 4 — Build Checklist** (Week 4)
   - Development tasks
   - Content migration plan
   - Launch checklist

---

## Appendix: Resource Directory (Initial Seed)

### Emergency Housing
| Organization | Services | Phone | Address |
|--------------|----------|-------|---------|
| Homesafe, Inc. | DV shelter, 24/7 crisis | 800-952-2873 | PO Box 702, Ashtabula |
| ACCAA New Hope | Homeless assistance | 440-997-1721 | 6920 Austinburg Rd |

### Food Assistance
| Organization | Services | Phone | Address |
|--------------|----------|-------|---------|
| Ashtabula Dream Center | Food pantry, hot meals | 440-998-3732 | 5028 Benefit Ave |
| Lighthouse Harvest | Hot lunch M-Th | 440-998-7813 | 2710 State Rd |
| Country Neighbor | Regional food bank | (see website) | Lake/Geauga/Ashtabula |

### Crisis Lines
- 211: Dial 211 or 800-874-8545
- Homesafe Crisis: 800-952-2873
- Text: 898-211 (M-F 8am-4pm)

### Mental Health
| Organization | Services | Phone |
|--------------|----------|-------|
| Ashtabula MHRS Board | Planning/funding | (see website) |
| Lake-Geauga Recovery | Addiction services | (see website) |
| Community Counseling | Mental health | Conneaut, OH |

---

**Document Status:** Phase 1 Complete  
**Next Phase:** Resource Procurement (Stakeholder Outreach)  
**Last Updated:** 2026-02-18
