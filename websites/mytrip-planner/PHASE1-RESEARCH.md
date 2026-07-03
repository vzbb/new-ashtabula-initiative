# Phase 1 Research — MyTrip Planner
**Project:** mytrip-planner  
**Date:** 2026-02-19  
**Status:** 🔴 Phase 1 Complete → Ready for Phase 2

---

## Executive Summary

MyTrip Planner is an AI-powered itinerary builder for Ashtabula County visitors. Unlike generic trip planners, it specializes in 3-day custom itineraries tailored to visitor interests (wineries, beaches, covered bridges, local dining).

**Key Differentiator:** Local expertise + AI personalization for a specific destination, not generic travel planning.

---

## 1. Competitor Analysis

### Established Players

| Competitor | Model | Strengths | Weaknesses | Our Opportunity |
|------------|-------|-----------|------------|-----------------|
| **TripIt** | Email forwarding + auto-organization | Streamlined experience, email integration | No local expertise, generic recommendations | Local curation + AI |
| **Wanderlog** | Visual trip planner | Beautiful UI, collaborative planning | Limited activity suggestions, no local depth | Ashtabula-specific knowledge |
| **TripAdvisor** | Reviews + bookings | Massive database, user reviews | Information overload, no itinerary AI | Curated, AI-optimized flow |
| **Google Travel** | Data aggregation | Integrated with Maps/Gmail | Generic, no local insider knowledge | Hyper-local expertise |
| **TripHugger** | Social group planning | Group chat, collaborative | No navigation, not on desktop | Solo + group friendly |

### Gap Analysis

**What competitors miss for Ashtabula specifically:**
- Covered bridge routing optimization
- Winery trail sequencing (by proximity/tastings)
- Beach glass hunting spots + timing
- Local event calendars (harbor festivals, farm markets)
- Seasonal considerations (wine harvest, fall foliage, winter activities)
- Integration with local booking systems (not just national chains)

---

## 2. Data Sources & APIs

### Essential APIs

| API | Purpose | Cost | Notes |
|-----|---------|------|-------|
| **Google Places API** | Attraction/venue data, photos, reviews | $5 per 1000 requests | Essential for venue details |
| **Google Directions API** | Route optimization between stops | $5 per 1000 requests | Multi-stop route planning |
| **Gemini/Claude API** | Itinerary generation, personalization | Variable | Core AI functionality |
| **Eventbrite API** | Local events, festivals | Free tier | Harbor events, wine festivals |
| **OpenWeather API** | Weather-aware planning | Free tier | 1000 calls/day free |

### Local Data Sources (UNVERIFIED — requires outreach)

| Source | Contact | Data Needed |
|--------|---------|-------------|
| **Visit Ashtabula County** | visitashtabulacounty.com | Official attraction listings, events |
| **Ashtabula County CVB** | accvb.org | Tourism data, partner businesses |
| **Lakehouse Inn** | thelakehouseinn.com | Local recommendations |
| **Geneva-on-the-Lake** | Various | Shore lodging, bike rentals |

### Static Data to Curate

```
LOCAL_ASSETS = {
  "covered_bridges": ["Harpersfield", "Root Road", "Doyle Road", ...],
  "wineries": ["Laurentia", "Ferrante", "Debonne", "M Cellars", ...],
  "beaches": ["Headlands Beach", "Breakwater Beach", "Lake Shore Park"],
  "museums": ["Underground Railroad Museum", "Ashtabula Maritime Museum"],
  "dining_categories": ["Lake Erie perch", "Winery restaurants", "Farm-to-table"],
  "seasonal_events": ["Grape Jamboree", "Bridge Festival", "Harbor Hop"]
}
```

---

## 3. Stakeholders

### Primary Users

| Segment | Needs | Pain Points |
|---------|-------|-------------|
| **Weekend visitors** (couples, 25-55) | Quick 2-3 day plan | Overwhelmed by options, don't know local gems |
| **Wine tourists** | Winery routing | Don't know which wineries to prioritize |
| **Families** | Kid-friendly activities | Need beach + activity balance |
| **Outdoor enthusiasts** | Hiking, beaches, nature | Want off-beaten-path suggestions |

### Business Partners (Future)

| Partner Type | Value Exchange |
|--------------|----------------|
| Wineries | Featured placement → referral traffic |
| B&Bs/Hotels | Embed widget → guest value-add |
| Restaurants | Reservation integration → bookings |
| Activity providers (kayak, bike) | Itinerary inclusion → customers |
| Ashtabula County CVB | Official endorsement → credibility |

---

## 4. Local Tourism Intelligence

### Ashtabula County Highlights

**Unique Selling Points:**
- 🍷 **Ohio Wine Country** — 20+ wineries along Lake Erie
- 🌉 **Covered Bridge Capital** — 19 historic covered bridges (longest in US)
- 🏖️ **Beach Glass Hunting** — World-renowned for sea glass collecting
- 🚢 **Historic Harbor** — Underground Railroad stop, maritime history
- 🎣 **Lake Erie Fishing** — Walleye, perch, steelhead

### Seasonal Patterns

| Season | Highlights | Content Focus |
|--------|------------|---------------|
| **Spring** | Wine bud break, fishing opener | Outdoor activities, winery tours |
| **Summer** | Beaches, festivals, boating | Family itineraries, water activities |
| **Fall** | Grape harvest, foliage, Grape Jamboree | Wine-focused, photography routes |
| **Winter** | Ice fishing, cozy winery visits | Indoor activities, weekend getaways |

### Sample 3-Day Itinerary Themes

1. **"Wine & Dine"** — 6 wineries + lakefront dining
2. **"Covered Bridge Tour"** — Photography route + historic stops
3. **"Family Beach Adventure"** — Lake activities + kid-friendly dining
4. **"Romantic Getaway"** — B&B + sunset spots + fine dining
5. **"History & Heritage"** — Underground Railroad + maritime museums

---

## 5. Technical Architecture Notes

### Recommended Stack (for Phase 3)

```
Frontend: React + Tailwind (existing)
AI Layer: Gemini 1.5 Pro (multimodal, large context)
Data Layer: 
  - Google Places API (venue data)
  - Firebase (user itineraries, caching)
  - Curated JSON (local knowledge)
Maps: Google Maps JavaScript API
Export: PDF generation, calendar invites (.ics)
```

### Key Features to Build

- [ ] Interest-based questionnaire (3-5 questions)
- [ ] AI-generated 3-day itinerary with time slots
- [ ] Interactive map with route visualization
- [ ] Save/share itinerary (PDF, link, calendar)
- [ ] Real-time adjustments (weather, closures)
- [ ] Mobile-optimized for on-the-go use

---

## 6. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API costs (Google Places) | Medium | High | Cache aggressively, use free tier limits |
| Outdated venue info | High | Medium | Partner with CVB for official data |
| Generic AI responses | Medium | High | Fine-tune with local knowledge base |
| Seasonal content staleness | Medium | Low | Automated seasonal prompt switching |

---

## 7. Success Metrics

**Phase 1 (MVP):**
- Itinerary generation accuracy (user rating)
- Time to generate itinerary (<10 seconds)
- Mobile usability score

**Phase 2+:**
- Itineraries created per week
- Save/share rate
- Partner referral clicks
- User return rate

---

## Next Steps (Phase 2)

1. **Procure API keys:** Google Places, Directions, Gemini
2. **Curate local dataset:** 50+ attractions with metadata
3. **Contact CVB:** Explore partnership/data sharing
4. **Draft prompt engineering:** Test AI itinerary quality
5. **Design export formats:** PDF, calendar, shareable link

---

**Deliverable completed:** 6:33 PM  
**Size:** ~4.5KB  
**Status:** Ready for resource procurement phase
