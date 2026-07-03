# Phase 1 Research — gotl-weekend-planner

## Project Overview
**Name:** GOTL Weekend Planner  
**Type:** Tourism/visitor itinerary tool  
**Target:** Geneva-on-the-Lake (GOTL), Ohio — "Ohio's First Summer Resort"

---

## 1. Destination Profile

### Geneva-on-the-Lake (GOTL)
- **Location:** Northeast Ohio, Lake Erie shoreline, Ashtabula County
- **Population:** ~1,200 (village), seasonal influx to 50,000+
- **History:** Founded 1869, oldest resort town in Ohio
- **Nickname:** "Ohio's First Summer Resort"
- **Season:** Memorial Day to Labor Day (peak), events year-round

### Key Attractions
| Category | Venues/Activities |
|----------|-------------------|
| **Strip (Lake Rd)** | Arcade, rides, food stands, bars, shops — 1 mile stretch |
| **Wineries** | 20+ in Ashtabula County wine trail, 5+ in GOTL proper |
| **State Park** | Geneva State Park (698 acres, beach, marina, lodge) |
| **Water Sports** | Boating, jet skis, paddleboarding, fishing charters |
| **Entertainment** | Eddie's Grill, Madsen Donuts, live music venues |
| **Nature** | Geneva State Park trails, covered bridges nearby |
| **Dining** | Waterfront restaurants, casual strip eats, winery dining |

### Seasonal Events (Annual)
| Event | Timing | Description |
|-------|--------|-------------|
| Wine & Walleye Festival | May | Wine tasting, fishing tournament, live music |
| Thunder on the Strip | June | Car show, largest in Ohio |
| Fourth of July Fireworks | July | Lakefront fireworks display |
| Grape Jamboree | September | Harvest festival, parade, grape stomping |
| Christmas in the Village | December | Holiday lights, shopping, events |

---

## 2. Competitor Analysis

### Direct Competitors
| Competitor | Type | Strengths | Weaknesses |
|------------|------|-----------|------------|
| **Geneva-on-the-Lake CVB website** | Official | Authoritative info | Static, no personalization |
| **TripAdvisor GOTL** | Review platform | User reviews | Generic, no itinerary builder |
| **Visit Lake Erie** | Regional tourism | Broader region | Not GOTL-specific |
| **Ohio.org** | State tourism | Comprehensive | Not focused, no planning tools |

### Indirect Competitors
| Competitor | Type | Notes |
|------------|------|-------|
| **Google Maps/Travel** | General | No GOTL-specific curation |
| **Yelp** | Reviews | Activity discovery only |
| **Hotel booking sites** | Booking | No experience planning |

### Gap Analysis
**Opportunity:** No dedicated GOTL weekend planning tool exists that:
- Builds personalized itineraries based on preferences
- Accounts for seasonal/event timing
- Balances Strip activities with winery/water experiences
- Provides local insider tips (parking, best times, hidden gems)

---

## 3. Stakeholder Map

### Primary Stakeholders
| Entity | Role | Interest | Contact Priority |
|--------|------|----------|------------------|
| **Geneva-on-the-Lake Chamber of Commerce** | Business promotion | Drive tourism | P0 |
| **GOTL Visitors Bureau** | Official tourism org | Increase visitor satisfaction | P0 |
| **Geneva State Park** | State managed | Visitor education | P1 |
| **Local Wineries** | Wine trail | Increase tastings/sales | P1 |
| **Strip Business Owners** | Food/retail/entertainment | Drive foot traffic | P1 |
| **Charter Boat Operators** | Water activities | Bookings | P2 |
| **Lodging Providers** | Hotels/campgrounds | Extend stays | P2 |

### Secondary Stakeholders
- Ashtabula County Tourism Council
- Ohio Travel Association
- Local media (Star Beacon, Cleveland.com)

---

## 4. User Personas

### Persona A: "The Weekend Escape Artist"
- **Demographics:** 28-40, couples or friend groups, from Cleveland/Pittsburgh/Buffalo
- **Goals:** Quick getaway, mix of relaxation and fun
- **Pain points:** Don't know what's happening, waste time deciding, miss hidden gems
- **Tech comfort:** High, mobile-first

### Persona B: "The Wine Trail Explorer"
- **Demographics:** 35-55, couples, wine enthusiasts
- **Goals:** Taste local wines, pair with dining, scenic experience
- **Pain points:** Don't know which wineries to prioritize, need DD options
- **Tech comfort:** Medium, tablet/desktop for planning

### Persona C: "The Family Vacation Planner"
- **Demographics:** 30-45, families with kids
- **Goals:** Kid-friendly activities, beach time, budget-conscious
- **Pain points:** Need to know what's age-appropriate, parking struggles
- **Tech comfort:** Medium, plans ahead

### Persona D: "The Event Attendee"
- **Demographics:** Variable, coming for specific festival/event
- **Goals:** Maximize event experience, find nearby amenities
- **Pain points:** Hotels sell out, don't know local logistics
- **Tech comfort:** High, last-minute mobile usage

---

## 5. Data Sources

### Static Data (Can scrape/compile)
- [ ] Wineries list with hours, offerings, locations
- [ ] Restaurant menus, hours, price ranges
- [ ] State park facilities and schedules
- [ ] Annual event calendar
- [ ] Strip business directory
- [ ] Charter boat operators
- [ ] Lodging options (hotels, campgrounds, rentals)

### Dynamic Data (Requires feeds/APIs)
- [ ] Live events calendar (Chamber CVB)
- [ ] Weather forecasts
- [ ] Marina/boat launch availability
- [ ] Winery event schedules
- [ ] Live music schedules at venues

### User-Generated Content (Future)
- [ ] Reviews and ratings
- [ ] Photos from visitors
- [ ] Itinerary sharing
- [ ] Tips and recommendations

---

## 6. Technical Considerations

### Data Challenges
- **Seasonal hours:** Many businesses have different hours Memorial-Labor Day vs off-season
- **Weather dependency:** Beach/water activities weather-sensitive
- **Rapid turnover:** Strip businesses change frequently
- **No central API:** Data scattered across multiple sources

### Integration Opportunities
- Google Places API (business data)
- OpenWeatherMap (forecasts)
- Mapbox/Google Maps (routing)
- Eventbrite/FB Events (event feeds)
- Winery association data (if available)

---

## 7. Risk Factors

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data freshness | High | Medium | User feedback loop, seasonal updates |
| Business changes | Medium | Low | Allow user corrections, manual verification |
| Seasonal traffic spikes | Medium | Medium | Static site + CDN, cached data |
| Stakeholder buy-in | Medium | High | Free tool, demonstrate value first |

---

## 8. Research Summary

**Key Insight:** GOTL is a beloved regional destination with no modern planning tool. Visitors currently piece together trips from scattered sources. A curated, personalized weekend planner would fill a clear gap.

**Differentiation Opportunity:** 
- Season-aware recommendations (don't suggest beach in November)
- Strip vs. winery vs. nature balance
- Local insider knowledge (best parking, avoid crowds)
- Event-aware planning (festival weekends need different strategies)

**Next Phase:** Resource procurement — contact Chamber and CVB for data partnerships and validation.

---

*Research completed: February 18, 2026*
