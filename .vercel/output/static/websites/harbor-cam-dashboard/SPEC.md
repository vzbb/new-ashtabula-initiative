# SPEC — Harbor Cam Dashboard v1.0

## Overview
Real-time harbor conditions dashboard for Ashtabula Harbor, combining live camera feeds with NOAA marine data, serving boaters and the local community.

**Status:** Draft  
**Version:** 1.0  
**Last Updated:** 2025-02-17  
**Owner:** New Ashtabula Initiative  

---

## Goals

### Primary
1. Provide at-a-glance harbor conditions for boaters
2. Combine camera + weather + marine data in one view
3. Reduce information gathering time from 5+ minutes to <30 seconds

### Secondary
1. Promote Ashtabula as a modern, tech-forward harbor community
2. Provide historical data for pattern analysis
3. Create foundation for alerts/notifications (v2)

### Non-Goals (v1)
1. User accounts/authentication
2. Historical data charts (beyond current readings)
3. Push notifications
4. Multiple camera angles
5. Social features

---

## Architecture

### Stack
- **Frontend:** React 18 + Vite (existing)
- **Hosting:** Firebase Hosting
- **Backend:** Firebase Cloud Functions (Node.js)
- **Data Cache:** Firebase (in-memory / Firestore optional)
- **APIs:** NOAA NDBC, NWS Weather, Camera proxy

### Data Flow
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Camera     │────▶│   Cloud      │────▶│   React      │
│   Source     │     │   Function   │     │   Client     │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
┌──────────────┐     ┌─────┴────────┐
│   NOAA       │────▶│   Cache      │
│   NDBC       │     │   (Memory)   │
└──────────────┘     └──────────────┘

┌──────────────┐
│   NWS        │────▶ (Direct client fetch with caching)
│   Forecast   │
└──────────────┘
```

---

## Features

### Feature 1: Live Camera Feed
**Priority:** P0 (Must Have)  
**Description:** Display live harbor camera image with auto-refresh  

**Requirements:**
- Display camera image prominently (hero section)
- Auto-refresh every 60 seconds
- Timestamp showing image age
- Fallback message if camera unavailable
- Mobile-responsive sizing

**Technical:**
- Cloud Function proxies camera image to avoid hotlinking/CORS issues
- Cache image for 60 seconds
- Serve from Firebase Hosting cache when possible

### Feature 2: Real-Time Buoy Data
**Priority:** P0 (Must Have)  
**Description:** Current conditions from NOAA Buoy 45005  

**Data Fields to Display:**
- Wind speed (knots) with direction arrow
- Wind gusts (if available)
- Wave height (feet)
- Dominant wave period (seconds)
- Water temperature (°F)
- Air temperature (°F)
- Barometric pressure (inHg)
- Last update timestamp

**Requirements:**
- Large, readable numbers for critical data (wind, waves)
- Direction arrows for wind
- Color coding: Green/Yellow/Red based on conditions
- Auto-refresh every 10 minutes
- Show "Buoy offline" message during winter recovery period

### Feature 3: Marine Forecast
**Priority:** P1 (Should Have)  
**Description:** Text forecast from NWS for Lake Erie near Ashtabula  

**Requirements:**
- Display 3-day forecast
- Parse forecast text into readable sections
- Highlight warnings/advisories
- Show issue time
- Collapsible sections for space efficiency

### Feature 4: Quick Stats Bar
**Priority:** P1 (Should Have)  
**Description:** At-a-glance summary row  

**Display:**
- Current wind: "15 knots NW"
- Wave height: "2-3 ft"
- Water temp: "45°F"
- Status indicator: 🟢 Good / 🟡 Caution / 🔴 Dangerous

### Feature 5: Sunrise/Sunset
**Priority:** P2 (Nice to Have)  
**Description:** Display today's sunrise/sunset times  

**Data Source:** Sunrise-Sunset API or calculation

### Feature 6: Last Update Indicators
**Priority:** P1  
**Description:** Show freshness of all data sources  

**Requirements:**
- Relative timestamps ("2 minutes ago", "10 minutes ago")
- Visual indicators for stale data (>1 hour)
- Pull-to-refresh on mobile

---

## Data Model

### Buoy Reading (Cached)
```typescript
interface BuoyReading {
  stationId: string;        // "45005"
  timestamp: Date;          // Observation time
  windSpeed: number;        // knots
  windDirection: number;    // degrees (0-360)
  windGust: number | null;  // knots
  waveHeight: number;       // feet
  wavePeriod: number;       // seconds
  waterTemp: number | null; // °F
  airTemp: number | null;   // °F
  pressure: number | null;  // inHg
  fetchedAt: Date;          // When we retrieved it
}
```

### Camera Image (Cached)
```typescript
interface CameraCache {
  imageBase64: string;      // or URL
  capturedAt: Date;
  contentType: string;
}
```

### Forecast
```typescript
interface MarineForecast {
  zone: string;             // "LEZ148"
  issuedAt: Date;
  text: string;             // Raw forecast text
  periods: ForecastPeriod[];
}

interface ForecastPeriod {
  name: string;             // "Tonight", "Wednesday", etc.
  description: string;
  wind?: string;
  waves?: string;
  weather?: string;
}
```

---

## API Endpoints (Cloud Functions)

### GET /api/camera
Returns cached camera image
```json
{
  "imageUrl": "...",
  "capturedAt": "2025-02-17T22:00:00Z",
  "nextRefresh": "2025-02-17T22:01:00Z"
}
```

### GET /api/buoy/current
Returns latest buoy reading
```json
{
  "stationId": "45005",
  "timestamp": "2025-02-17T21:40:00Z",
  "windSpeed": 15,
  "windDirection": 315,
  "windGust": 20,
  "waveHeight": 2.5,
  "wavePeriod": 4,
  "waterTemp": 45.2,
  "airTemp": 42.1,
  "pressure": 30.12,
  "fetchedAt": "2025-02-17T21:45:00Z"
}
```

### GET /api/forecast
Returns marine forecast
```json
{
  "zone": "LEZ148",
  "issuedAt": "2025-02-17T15:30:00Z",
  "periods": [...]
}
```

---

## UI Design

### Layout (Mobile-First)
```
┌─────────────────────────────────────┐
│  🌊 Ashtabula Harbor Dashboard     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │     LIVE CAMERA FEED       │   │
│  │      (refreshes 60s)       │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│  Updated: 2 minutes ago             │
├─────────────────────────────────────┤
│  🌡️ CONDITIONS NOW                  │
├─────────────────────────────────────┤
│  Wind:  15 kts ↗ NW    🟢          │
│  Waves: 2.5 ft                      │
│  Water: 45°F                        │
│  Air:   42°F                        │
│  Pressure: 30.12"                   │
│                                     │
│  Buoy: 45005 (40 mi west)           │
│  Updated: 10 min ago                │
├─────────────────────────────────────┤
│  📋 FORECAST ▼                      │
├─────────────────────────────────────┤
│  Tonight: NW winds 10-15 kts...    │
│  Wed: W winds 5-10 kts...          │
│  Thu: Variable winds...            │
├─────────────────────────────────────┤
│  🌅 Sunrise: 7:12 AM                │
│  🌇 Sunset: 6:05 PM                 │
├─────────────────────────────────────┤
│  Data: NOAA NDBC | NWS | [Cam Src] │
│  © 2025 New Ashtabula Initiative   │
└─────────────────────────────────────┘
```

### Color Scheme
- **Primary:** #0066CC (Lake blue)
- **Secondary:** #4A90E2 (Sky blue)
- **Background:** #0F172A (Dark navy)
- **Card:** #1E293B (Slate)
- **Text:** #F8FAFC (Off-white)
- **Success (Good):** #22C55E
- **Warning (Caution):** #EAB308
- **Danger (Unsafe):** #EF4444

### Typography
- **Display:** Inter or system-ui
- **Headings:** 600 weight
- **Data numbers:** 700 weight, large (24-32px for key stats)

---

## Security Rules

### Firestore (if used)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;  // Public dashboard
      allow write: if false; // Only Cloud Functions write
    }
  }
}
```

### Cloud Functions
- All endpoints are public read-only
- No authentication required for v1
- Rate limiting via Firebase (built-in)

---

## Performance Targets

- **Time to First Content:** < 2 seconds
- **Camera Image Load:** < 1 second (cached)
- **Buoy Data Load:** < 500ms (cached)
- **Total Page Load (3G):** < 3 seconds
- **Auto-refresh:** No jank, smooth updates

---

## Error Handling

### Camera Down
- Display placeholder with message: "Camera temporarily unavailable"
- Show last successful image with timestamp
- Retry every 2 minutes

### Buoy Offline (Winter)
- Display message: "Buoy recovered for winter maintenance"
- Show last reading before recovery
- Provide link to NOAA status page

### Network Errors
- Offline indicator
- Display cached data with staleness warning
- Retry on connection restore

---

## Phased Implementation

### Phase 1: MVP (Week 1)
- Camera proxy + display
- Buoy data fetch + display
- Basic styling
- Mobile layout

### Phase 2: Polish (Week 2)
- Forecast integration
- Auto-refresh
- Error states
- Status indicators

### Phase 3: Launch (Week 3)
- Performance optimization
- SEO/meta tags
- Analytics
- Community feedback integration

---

## Open Questions

1. Can we get direct camera stream URL or must we scrape/proxy?
2. Should we add Station 45167/45170 as fallback when 45005 is offline?
3. Do we need a "Report Issue" button for user feedback?
4. Should we archive historical data for trend analysis (v2)?
5. Any Harbor Yacht Club partnership opportunities for validation?

---

## References

- NDBC Data Documentation: https://www.ndbc.noaa.gov/faq/measdes.shtml
- NWS Marine Forecasts: https://www.weather.gov/marine/
- Great Lakes Marine Portal: https://www.weather.gov/marine/leopen
