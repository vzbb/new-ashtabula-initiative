# Harbor Cam Dashboard — Phase 1: Research & Reconnaissance

**Project:** Harbor Cam Dashboard  
**MVP Category:** Maritime / Recreation / Safety  
**Research Date:** 2026-02-18  
**Status:** 🟡 Phase 1 Complete → Ready for Phase 2

---

## 1. Problem Statement

### The Gap
Boaters, anglers, and lake enthusiasts visiting Ashtabula Harbor lack a **single, centralized dashboard** to view real-time harbor conditions before making the trip. Current workflow requires checking multiple disjointed sources:
- NOAA buoy websites (technical, not mobile-friendly)
- Individual webcam sites (scattered, inconsistent availability)
- Weather apps (don't show actual lake conditions)
- Social media (unreliable, delayed)

### Impact
- **Wasted trips:** Boaters drive to the harbor only to find unsafe conditions
- **Safety risk:** No quick way to assess wave height, visibility, or weather changes
- **Missed opportunities:** Anglers can't time trips for optimal conditions
- **Tourism friction:** Visitors lack confidence planning lake activities

---

## 2. Existing Solutions & Competitors

### Direct Competitors

| Solution | Strengths | Weaknesses | Ashtabula Coverage |
|----------|-----------|------------|-------------------|
| **LakeErieDashboard.com** | Aggregates buoys, clean UI | No Ashtabula-specific cams, generic | Partial (buoys only) |
| **Redbrook LakeVision Cam** | Actual Ashtabula harbor view | Single camera, no data overlay, dated UI | ✅ Yes |
| **WeatherBug Cameras** | Multiple angles, weather data | Scattered, ad-heavy, not harbor-focused | Partial |
| **NOAA NDBC Direct** | Authoritative data | Technical interface, mobile-unfriendly, no cams | Buoy 45005 nearby |
| **Surfline/WeatherForYou** | Buoy data, surf focus | No harbor cameras, no local context | Buoy only |

### Key Insight
**No existing solution combines Ashtabula harbor cameras with real-time NOAA buoy data in a purpose-built dashboard.** LakeErieDashboard is the closest competitor but lacks Ashtabula-specific camera integration and local context.

---

## 3. Available Data Sources

### Confirmed Accessible

#### NOAA Buoy 45005 (West Erie - 16 NM NW of Lorain)
- **Location:** 41.677°N, 82.398°W
- **Data available:** Wind speed/direction, wave height, water temp, air temp, barometric pressure
- **API:** `https://www.ndbc.noaa.gov/station_realtime.php?station=45005`
- **Update frequency:** Hourly
- **Cost:** Free public data
- **Relevance:** Closest active NOAA buoy to Ashtabula Harbor (~25 miles west)

#### LakeVision Camera (Redbrook Boat Club)
- **Location:** Ashtabula Harbor
- **URL:** `http://www.redbrookboatclub.com/lakevision-camera.html`
- **Status:** Active since 2013
- **View:** Harbor entrance, lake conditions
- **Access:** Public webpage (may require embedding permission)
- **Cost:** Unknown (contact Redbrook Boat Club)

#### NOAA GLERL Ice Coverage
- **Source:** `https://www.glerl.noaa.gov`
- **Data:** Daily ice concentration maps
- **Relevance:** Winter boating safety
- **Cost:** Free

### Potential Sources (Need Verification)

| Source | Data Type | Contact/Access | Status |
|--------|-----------|----------------|--------|
| Harbor Yacht Club | Private marina cam | harboryachtclub.net | UNVERIFIED |
| Ashtabula Yacht Club | Member dock cam | aycohio.com | UNVERIFIED |
| City of Ashtabula | Municipal harbor cam | cityofashtabula.com | UNVERIFIED |
| USCG Station Ashtabula | Safety/operations cam | USCG contact needed | UNVERIFIED |
| Regional Science Consortium | Water quality data | regsciconsort.com | UNVERIFIED |

---

## 4. User Personas

### Primary Users

#### Captain Carl (Recreational Boater)
- **Demographics:** 45-65, boat owner, lives within 50 miles
- **Needs:** Quick pre-trip condition check, wave height, visibility
- **Pain points:** Drives 45 min to find 4ft waves when forecast said 1ft
- **Usage pattern:** Checks morning of trip, from mobile
- **Tech comfort:** Moderate, uses smartphone apps

#### Angler Andy (Fishing Enthusiast)
- **Demographics:** 35-60, serious fisherman, plans trips days ahead
- **Needs:** Water temperature, recent condition trends, wind direction
- **Pain points:** No historical view of conditions, missed fishing windows
- **Usage pattern:** Checks multiple times per week, desktop and mobile
- **Tech comfort:** High, active on fishing forums

#### Tourist Tina (Weekend Visitor)
- **Demographics:** 30-50, occasional visitor, plans Geneva-on-the-Lake trips
- **Needs:** Is it safe to go out? Can we swim? Will the ferry run?
- **Pain points:** No easy way to "see" conditions before arriving
- **Usage pattern:** Checks day before/day of visit
- **Tech comfort:** Moderate, expects mobile-friendly experience

### Secondary Users

#### Marina Mike (Harbor Manager)
- **Needs:** Monitor harbor activity, safety, promote facility
- **Value:** Reduced phone calls asking "how's the lake?"

#### Safety Sam (USCG/First Responder)
- **Needs:** Quick visual assessment of conditions during incidents
- **Value:** Remote reconnaissance before dispatch

---

## 5. Feature Set Recommendations

### MVP Features (Phase 1 Build)

1. **Live Harbor Camera Feed**
   - Primary: LakeVision camera embed
   - Fallback message if offline
   - Timestamp overlay

2. **NOAA Buoy Data Widget**
   - Current readings from Station 45005
   - Wind speed/direction with compass arrow
   - Wave height with safety indicator (green/yellow/red)
   - Water temperature
   - Last updated timestamp

3. **Simple Condition Summary**
   - "Go / Caution / No-Go" indicator based on wave height
   - One-sentence human-readable summary
   - Last 3-hour trend arrow (improving/worsening)

4. **Mobile-First Design**
   - Large touch targets
   - Vertical layout optimized for phones
   - Fast load time (<2s)

### Phase 2 Features

5. **Multiple Camera Views**
   - Harbor Yacht Club (if permission granted)
   - Ashtabula Yacht Club (if permission granted)
   - City/municipal camera (if available)
   - Camera selector tabs

6. **Historical Data**
   - 24-hour buoy data chart
   - Yesterday vs today comparison
   - Fishing condition "score" algorithm

7. **Alert System**
   - Email/SMS for condition thresholds
   - "Good fishing conditions" alert
   - Severe weather warnings

8. **Weather Overlay**
   - Local radar embed
   - Marine forecast from NWS
   - Sunrise/sunset times

### Future Enhancements

9. **User-Submitted Reports**
   - "On the water" condition reports
   - Photo uploads
   - Community fishing reports

10. **Business Integration**
    - Marina contact info & services
    - Bait shop hours/availability
    - Charter booking links

---

## 6. Technical Architecture

### Recommended Stack

```
Frontend:    Next.js 14 (App Router) + Tailwind CSS
Hosting:     Vercel (free tier sufficient)
Data APIs:   NOAA NDBC (direct fetch)
Camera:      iframe embed or image proxy
Cache:       Vercel Edge (60-second cache for buoy data)
Analytics:   Vercel Analytics or Plausible
```

### Data Flow

```
User Request → Vercel Edge → Cache Check
                    ↓
            [Cache Miss]
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
NOAA API      Camera Feed      Weather API
(45005)       (LakeVision)     (OpenMeteo)
    ↓               ↓               ↓
    └───────────────┴───────────────┘
                    ↓
            Render Dashboard
                    ↓
            Cache (60s TTL)
```

### API Endpoints Required

| Endpoint | Purpose | Update Frequency |
|----------|---------|------------------|
| `https://www.ndbc.noaa.gov/data/realtime2/45005.txt` | Buoy latest obs | Hourly |
| `https://www.ndbc.noaa.gov/data/5day2/45005_5day.txt` | Buoy 5-day history | Hourly |
| `http://www.redbrookboatclub.com/lakevision-camera.html` | Camera feed | Real-time |

---

## 7. Differentiation Strategy

### Why This Beats Competitors

| Feature | LakeErieDashboard | Our Dashboard |
|---------|-------------------|---------------|
| Ashtabula camera | ❌ No | ✅ Yes (LakeVision) |
| Mobile-optimized | ⚠️ Mediocre | ✅ Designed mobile-first |
| Local context | ❌ Generic | ✅ Ashtabula-specific |
| Simple "Go/No-Go" | ❌ No | ✅ Yes |
| Speed | ⚠️ Heavy site | ✅ Lightweight (<100KB) |
| No ads | ❌ Ads | ✅ Clean, no ads |

### Unique Value Propositions

1. **"Is it safe to go out?"** — Immediate answer, not just data
2. **Ashtabula-specific** — Not another generic lake site
3. **Fisherman-focused** — Water temp, recent trends, fish behavior hints
4. **Mobile-native** — Built for checking from the car before launching

---

## 8. Business Model Options

### Recommended: Community Resource (No Monetization)
- Free public service
- Sponsored by local businesses (subtle logo placement)
- Promotes tourism and safety

### Alternative: Freemium
- **Free:** Current conditions, one camera
- **Pro ($3/mo):** Historical data, alerts, multiple cams, fishing reports

### Sponsorship Opportunities
- Harbor Yacht Club
- Ashtabula Yacht Club
- Local bait & tackle shops
- Charter fishing operators
- Geneva-on-the-Lake tourism board

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| LakeVision camera goes offline | Medium | High | Contact Redbrook for direct feed access; seek backup cameras |
| NOAA buoy 45005 decommissioned | Low | High | Use next closest buoy; integrate weather station data |
| Permission denied for camera embed | Medium | Medium | Link out instead of embed; negotiate attribution deal |
| Low usage | Medium | Low | Promote via fishing forums, marinas, tourism board |
| Data accuracy disputes | Low | Medium | Clear disclaimer: "Conditions may vary in harbor vs open water" |

---

## 10. Open Questions (Phase 2 Blockers)

1. **Camera permission:** Can we get explicit permission from Redbrook Boat Club to embed their camera? Who is the contact?

2. **Additional cameras:** Are there other active cameras in Ashtabula Harbor? (USCG, City, private marinas)

3. **Marina partnership:** Will Harbor Yacht Club or Ashtabula Yacht Club share camera access or promote the dashboard?

4. **User validation:** Do boaters/anglers actually want this? Survey at local marinas/bait shops.

5. **Maintenance commitment:** Who keeps the camera permissions current and monitors for outages?

---

## 11. Phase 2: Resource Procurement Plan

### Contacts to Reach

| Organization | Purpose | Contact Method | Priority |
|--------------|---------|----------------|----------|
| Redbrook Boat Club | Camera embed permission | Website contact form / Phone | 🔴 Critical |
| Harbor Yacht Club | Additional camera, promotion | harboryachtclub.net contact | 🟡 High |
| Ashtabula Yacht Club | Camera access, member feedback | aycohio.com contact | 🟡 High |
| City of Ashtabula | Municipal camera, tourism support | cityofashtabula.com | 🟢 Medium |
| USCG Station Ashtabula | Safety camera, official endorsement | USCG public affairs | 🟢 Medium |

### User Research

- Survey at Harbor Bait & Tackle (if exists)
- Post in Lake Erie fishing Facebook groups
- Interview 5-10 boaters at Ashtabula Harbor
- Survey anglers at local fishing forums (Walleye Central, etc.)

---

## 12. Success Metrics

### Launch Targets
- 500+ monthly unique visitors within 3 months
- 3+ camera feeds integrated
- <2 second page load time
- 80%+ mobile traffic

### Engagement Targets
- Average 2+ page views per session
- 20%+ return visitor rate
- Positive feedback from 3+ local marinas

---

## 13. Next Steps

1. **Contact Redbrook Boat Club** — Request camera embed permission
2. **Survey potential users** — Validate demand with 10+ boaters/anglers
3. **Identify additional cameras** — Reach out to marinas and city
4. **Create wireframes** — Design mobile-first dashboard layout
5. **Build MVP** — Single camera + buoy data widget
6. **Soft launch** — Share with fishing forums for feedback

---

*Document Version: 1.0*  
*Last Updated: 2026-02-18*  
*Status: Phase 1 Complete → Awaiting Phase 2 Resource Procurement*
