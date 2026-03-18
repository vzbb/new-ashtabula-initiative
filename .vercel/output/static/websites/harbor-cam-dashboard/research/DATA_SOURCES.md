# Phase 1 — Research: Data Sources & APIs

## 1. Live Camera Feed

### Primary Source: Weather Underground / Webcam Galore
**URL:** https://www.webcamgalore.com/webcam/USA/Ashtabula-Ohio/14848.html
**Description:** Live cam operated by ExChief @ Weather Underground, pointed at Ashtabula Harbor area
**Access:** Free, public website
**Update Frequency:** Unknown (likely 5-15 minutes)
**Status:** Active since 2012, 18,000+ visitors

### Alternative: Ashtabula Marine Museum Camera
**Location:** 1071 Walnut St (Great Lakes Marine & Coast Guard Memorial Museum)
**Description:** Web camera installed on east side of museum
**Views:** Lighthouse/lakefront, coal dock, ODNR building
**Source:** Star-Beacon article (Aug 17, 2006)
**Status:** UNVERIFIED — may be the same as above or different camera

### Technical Options for Camera Integration:
1. **Iframe embed** — If direct stream URL available
2. **Static image refresh** — Pull latest image on interval
3. **Link out** — Link to external camera page
4. **Image proxy** — Cloud Function fetches and caches image

## 2. NOAA Buoy Data

### Station 45005 — West Erie
**Location:** 41.677 N 82.398 W (16 NM NW of Lorain, OH)
**Distance from Ashtabula:** ~40 miles west
**Type:** 2.3-meter foam discus buoy
**Owner:** National Data Buoy Center (NDBC)

**Available Data Fields:**
- Wind direction and speed
- Wind gusts
- Wave height
- Dominant wave period
- Air temperature
- Water temperature (1.3m depth)
- Barometric pressure

**API Endpoints:**
- Real-time data: `https://www.ndbc.noaa.gov/data/realtime2/45005.txt`
- Latest observations: `https://www.ndbc.noaa.gov/data/latest_obs/45005.rss`
- 45-day history: Station history page

**Update Frequency:** Hourly (typically at :00 and :40)
**Status:** ⚠️ Seasonal — Buoy recovered for winter (Nov 19 - Apr/May typically)

### Backup/Secondary Stations
**Station 45001 (West Lake Superior)** — Too far
**Station 45167 (Lake Erie near Cleveland)** — Check availability
**Station 45170 (Lake Erie)** — Check availability

## 3. Marine Forecast

### NWS Marine Forecast Zone LEZ148
**Coverage:** Conneaut OH to Ripley NY beyond 5 NM offshore to US-Canada border
**Includes:** Ashtabula Harbor area

**API Endpoint:**
- Text forecast: `https://tgftp.nws.noaa.gov/data/forecasts/marine/near_shore/le/lez148.txt`
- XML forecast: `https://forecast.weather.gov/product.php?site=NWS&issuedby=KCLE&product=CWF&format=txt`

**Update Frequency:** 3-4 times daily
**Fields:**
- Wind speed and direction
- Wave heights
- Weather conditions
- Warnings/advisories

### Great Lakes Marine Weather Portal
**URL:** https://www.weather.gov/marine/leopen
**Features:**
- Point-specific forecasts
- Graphical forecasts
- Wave model data

## 4. Additional Weather Data

### Open-Meteo Marine API
**URL:** https://open-meteo.com/en/docs/marine-weather-api
**Features:**
- Ocean wave forecasts
- Free for non-commercial use
- No API key required
- Global coverage

### Weather.gov API
**Base:** https://api.weather.gov/
**Grid Endpoint:** Points → Forecast Grid Data
**Ashtabula coordinates:** ~41.87°N, 80.79°W

## 5. Harbor Authority / Local Data

### Harbor Yacht Club of Ashtabula
**URL:** https://www.harboryachtclub.net/
**Contact:** Through website contact form
**Potential Data:**
- Local conditions reports
- Harbor events
- Temporary advisories

### Ashtabula Port Authority
**URL:** https://www.ashtabulaport.org/
**Potential Data:**
- Commercial shipping schedule
- Harbor maintenance notices
- Safety advisories

### Ashtabula Marine Museum
**Address:** 1071 Walnut St, Ashtabula, OH
**Phone:** (440) 964-8167
**Potential:** Camera access, historical data, local expertise

## 6. Contact List for Permissions/Data Access

| Organization | Contact Method | Purpose | Status |
|--------------|----------------|---------|--------|
| Harbor Yacht Club | Contact form | Data partnership, validation | PENDING |
| Ashtabula Marine Museum | (440) 964-8167 | Camera access, expertise | PENDING |
| NDBC / NOAA | Public data | Buoy data (already public) | ✅ Available |
| Weather Underground | TOS compliance | Camera embedding rights | PENDING |

## 7. Data Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Harbor Cam Dashboard                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Camera Feed  │  │  Buoy Data   │  │  Forecast    │      │
│  │   (Proxy)    │  │   (NDBC)     │  │    (NWS)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│        │                 │                 │                │
│        ▼                 ▼                 ▼                │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Firebase Cloud Functions (Cache)            │    │
│  │  - Camera image proxy (refresh every 60s)          │    │
│  │  - Buoy data fetch (refresh every 10min)           │    │
│  │  - Forecast cache (refresh every hour)             │    │
│  └────────────────────────────────────────────────────┘    │
│                            │                                │
│                            ▼                                │
│                   ┌─────────────────┐                       │
│                   │  React Frontend │                       │
│                   │  Auto-refresh UI│                       │
│                   └─────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

## 8. Rate Limits & Constraints

### NDBC Data
- No rate limit documented for text files
- Be courteous: max 1 request per 10 minutes for buoy data
- RSS feed available for lighter polling

### NWS API
- No API key required
- Fair use policy: Don't hammer the server
- Cache aggressively

### Camera Feed
- Unknown rate limits
- Should proxy/cache to avoid hotlinking issues
- Check robots.txt and TOS before embedding

## 9. Data Freshness Requirements

| Data Source | Target Freshness | Max Cache Time |
|-------------|------------------|----------------|
| Camera image | 1-5 minutes | 60 seconds |
| Buoy data | 10-60 minutes | 10 minutes |
| Forecast | 3-6 hours | 1 hour |
| Alerts/Warnings | Immediate | 5 minutes |
