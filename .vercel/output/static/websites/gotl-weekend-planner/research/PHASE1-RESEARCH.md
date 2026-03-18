# Phase 1 Research — GotL Weekend Planner
## Geneva-on-the-Lake Tourism Itinerary Builder

**Date:** 2025-02-17  
**Researcher:** Rondell / Noirsys AI  
**Project:** gotl-weekend-planner

---

## 1. Competitor Analysis

### National/General Trip Planners

| Competitor | Model | Strengths | Weaknesses | Gaps We Can Fill |
|------------|-------|-----------|------------|------------------|
| **TripIt** | Email forwarding, auto-organization | Seamless reservation parsing, pro features for $49/yr | No AI recommendations, generic for all destinations | Local expertise, GOTL-specific optimization |
| **Wanderlog** | Manual + map-based planning | Free tier, collaborative, expense tracking | Time-consuming manual input, no local intelligence | Pre-built GOTL templates, automated suggestions |
| **Sygic Travel** | Map-first itinerary builder | Visual trip planning, offline maps | Limited AI, generic POI database | Hyperlocal GOTL knowledge, seasonal awareness |
| **TriPandoo** | AI-generated itineraries | Fast AI generation, optimization | Limited regional depth, subscription model | Free tier, community-driven updates |
| **Google Travel** | Integrated with Google ecosystem | Flights, hotels, maps integration | Generic recommendations, no local curation | Curated GOTL experiences, insider tips |

### Local/Regional Competitors

| Competitor | Type | Coverage | Assessment |
|------------|------|----------|------------|
| **VisitGenevaOnTheLake.com** | Official CVB site | GOTL focused | Static guide, no personalization, no itinerary builder |
| **Ohio.org Travel Planner** | State tourism | All Ohio | Too broad, no GOTL depth, no AI features |
| **TripAdvisor GOTL** | Reviews/forum | Global with GOTL section | UGC chaos, dated info, no structured planning |
| **LakeErie Shores & Islands** | Regional CVB | Lake Erie region | Broader than GOTL, limited personalization |

### Key Insights

1. **No AI-native GOTL planner exists** — all competitors are either generic tools or static guides
2. **Local CVB sites lack interactivity** — opportunity for dynamic, preference-based planning
3. **Free tier gap** — most AI planners require subscriptions; free + local focus = differentiation
4. **Seasonal unawareness** — competitors don't optimize for GOTL's seasonal variations (summer beach vs. fall wine)

---

## 2. User Personas

### Persona A: "The Wine Weekender" (Primary)
- **Demographics:** 35-55, couples or friend groups, income $75k+
- **Goals:** Maximize winery visits, discover hidden gems, safe transportation
- **Pain points:** Finding DD/shuttle options, knowing which wineries require reservations, pairing food with tastings
- **Tech comfort:** Moderate, uses apps but prefers simple UX
- **Trip length:** 2-3 days

### Persona B: "The Family Adventurer" (Secondary)
- **Demographics:** 30-45, families with kids 5-15
- **Goals:** Kid-friendly activities (Adventure Zone, beach), family dining, budget-conscious
- **Pain points:** Finding activities for mixed ages, dining with kids, knowing what's open when
- **Tech comfort:** High, books everything on phone
- **Trip length:** Weekend getaway

### Persona C: "The Nostalgia Seeker" (Niche)
- **Demographics:** 50-70, returning visitors, often local/regional
- **Goals:** Experience "old GOTL" charm, The Strip, arcades, classic dining
- **Pain points:** Finding what's still open, what's changed, accessibility concerns
- **Tech comfort:** Low-moderate, needs simple interface
- **Trip length:** 1-2 days

---

## 3. Data Sources & APIs

### Attractions & POIs
| Source | Data Type | Access | Notes |
|--------|-----------|--------|-------|
| **Visit Geneva on the Lake CVB** | Official listings | Web scraping/partnership | Primary source for verified info |
| **Ohio Wine Producers Association** | Winery database | API/scraping | 30+ wineries in area, trail maps |
| **Google Places API** | POI data, reviews | Paid API | General backup for hours, photos, reviews |
| **TripAdvisor API** | Reviews, ratings | Partnership required | Social proof integration |

### Real-Time Data
| Source | Data Type | Use Case |
|--------|-----------|----------|
| **OpenWeatherMap** | Weather forecasts | Outfit/activity suggestions |
| **Lake Erie water temps** | Beach conditions | Swimming recommendations |
| **Winery event calendars** | Special events | Seasonal itinerary updates |

### Transportation
| Source | Service | Integration |
|--------|---------|-------------|
| **The Lodge at Geneva** | Wine shuttle | Partner API/scraping |
| **Uber/Lyft** | Rideshare | Deep link integration |
| **Local taxi services** | Phone/booking | Directory listing |

### Lodging
| Source | Type | Notes |
|--------|------|-------|
| **Booking.com API** | Hotels, rentals | Affiliate integration |
| **Airbnb API** | Vacation rentals | Limited access, partner program |
| **Direct B&B contacts** | Local inns | Manual curation for GOTL charm |

---

## 4. GOTL-Specific Knowledge Base

### Key Attractions by Category

**Wineries (30+ in area)**
- Old Firehouse Winery (carousel bar, iconic)
- Ferrante Winery (award-winning, restaurant)
- M Cellars (boutique, red focus)
- Laurentia Vineyard (scenic, events)
- South River Vineyard (converted church)
- Debonne Vineyards (largest, family-friendly)

**Family Activities**
- Adventure Zone (zip line, go-karts, mini-golf, arcade)
- Lake Erie Canopy Tours (zipline, high ropes)
- GOTL State Park beach (swimming, sunbathing)
- The Strip (arcades, old-school entertainment)
- Geneva Township Park (playground, picnic)

**Dining**
- The Lakehouse Inn (farm-to-table, lakefront)
- Mary’s Kitchen (local favorite, comfort food)
- Eddie’s Grill (Strip classic, seasonal)
- Old Firehouse Winery (casual, view)
- Crosswinds Grille (upscale, The Lodge)

**Seasonal Considerations**
- **Summer (Jun-Aug):** Peak season, beach focus, Adventure Zone open, book lodging early
- **Fall (Sep-Nov):** Wine harvest, leaf peeping, slower pace
- **Winter (Dec-Feb):** Limited attractions, holiday events, cozy B&B season
- **Spring (Mar-May):** Quiet, wine trail weekends opening, unpredictable weather

---

## 5. Technical Opportunities

### Differentiation Features
1. **Preference quiz** → AI generates 3 custom itinerary options
2. **"Kid-friendly + Wineries" combo** — unique persona mixing
3. **Integrated shuttle/wine transport booking**
4. **Real-time weather-based suggestions**
5. **Save & share** itineraries (social viral potential)
6. **Offline mode** for spotty lakeside cell service

### Mobile-First Considerations
- GOTL visitors are mobile-dominant
- Cell service can be spotty near lake
- Print/save itinerary feature essential
- Click-to-call for reservations

---

## 6. Research Summary

**Key Finding:** No competitor combines AI itinerary generation with deep GOTL local knowledge. The official CVB site has the content but lacks interactivity. Generic trip planners have the tech but lack the local expertise.

**Opportunity:** Position as "The only AI trip planner built specifically for Geneva-on-the-Lake" — free, fast, locally-curated.

**Next Phase:** Convert research into technical SPEC.md with Firebase architecture, Gemini AI integration, and phased build plan.

---

**File:** `research/PHASE1-RESEARCH.md`  
**Status:** ✅ Complete  
**Delivered:** 2025-02-17
