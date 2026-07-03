# Harbor Cam Dashboard — Pitch Materials
## Real-Time Marine Conditions Dashboard for Ashtabula Harbor

---

## 30-Second Demo Script

### Hook
> "Imagine you're a boater trying to decide if it's safe to head out on Lake Erie today, but you're stuck checking 5 different websites for wind, waves, forecast, and harbor cameras..."

### Demo Steps (30 seconds total)

**Step 1 (5 sec):** Show the dashboard header — "Ashtabula Harbor Dashboard — Real-time Marine Conditions" with the live Go/No-Go status indicator

**Step 2 (6 sec):** Point to the live camera feed — refreshing every 60 seconds showing actual harbor conditions

**Step 3 (6 sec):** Scroll to the Buoy Card — real-time wind speed, wave height, water temperature from NOAA Buoy 45005

**Step 4 (6 sec):** Show the Marine Forecast section — 3-day Nearshore Marine Forecast for Zone LEZ148

**Step 5 (7 sec):** Display the Daylight card — sunrise/sunset times plus the safety reminder card

### What It Does
A unified marine conditions dashboard combining live harbor camera feeds, NOAA buoy data, marine forecasts, and boater safety status for real-time go/no-go decision making.

### Who It's For
- Recreational boaters and anglers checking conditions before heading out
- Charter captains monitoring daily conditions for client safety
- Marina operators communicating conditions to slip holders
- Harbor patrol and emergency services

### CTA (Call to Action)
> "Give your boaters one place to check everything. Let's deploy this for your harbor today."

---

## What/Who/CTA Summary

| Element | Details |
|---------|---------|
| **What** | Real-time marine dashboard with live camera, NOAA buoy data, marine forecasts, and safety status |
| **Who** | Marinas, harbormasters, charter operators, boaters, coastal towns |
| **CTA** | Deploy a branded version for your harbor or marina |

---

## Key Features

1. **Live Harbor Camera** — Real-time feed from LakeVision (refreshes every 60 seconds)
2. **Go/No-Go Status** — At-a-glance safety indicator (🟢 Good to Go / 🟡 Caution / 🔴 Dangerous)
3. **NOAA Buoy 45005 Data** — Real-time wind speed, wave height, water/air temp, barometric pressure
4. **Marine Forecast** — 3-day Nearshore Marine Forecast (Zone LEZ148)
5. **Daylight Info** — Sunrise/sunset times for Ashtabula, OH
6. **Auto-Refresh** — Data updates every 60 seconds automatically
7. **Offline Resilience** — Graceful fallbacks when buoy is down for maintenance
8. **Mobile Optimized** — Perfect for checking on the dock or in the truck

---

## Value Proposition

### For Boaters
- **One Dashboard, Everything** — No more checking 5 different sites
- **Safety First** — Clear visual status before you launch
- **Real-Time Confidence** — Live camera shows actual conditions, not just data
- **Mobile Ready** — Check conditions while walking down the dock

### For Marinas & Harbormasters
- **Liability Reduction** — Clear safety messaging helps boaters make informed decisions
- **Customer Service** — Proactive condition updates reduce phone calls
- **Professional Image** — Modern dashboard positions your marina as tech-forward
- **Custom Branding** — Can be white-labeled with your marina name and colors

### For Coastal Communities
- **Tourism Safety** — Protects visitors unfamiliar with local conditions
- **Economic Protection** — Fewer weather-related incidents = fewer closures
- **Data Transparency** — Open access to official NOAA data builds trust

---

## Technical Notes

- **Stack:** React + Vite + Custom Hooks
- **Data Sources:**
  - NOAA NDBC (Buoy 45005)
  - National Weather Service (Marine Forecast)
  - Sunrise-Sunset.org (Daylight)
  - LakeVision (Harbor Camera)
- **Status Logic:**
  - 🟢 Good to Go: Wind <15kt, Waves <2.5ft
  - 🟡 Caution: Wind 15-25kt OR Waves 2.5-4ft
  - 🔴 Dangerous: Wind >25kt OR Waves >4ft
- **Screenshots:** ✅ Available in `/screenshots/` folder
- **Offline Handling:** Displays mock data with clear "Buoy Offline" notice during maintenance

---

## Use Cases

1. **Morning Pre-Launch Check** — Boater opens dashboard while having coffee
2. **Charter Captain Briefing** — Show clients real conditions before departure
3. **Marina Office Display** — Dashboard on lobby screen for all visitors
4. **Emergency Management** — Harbor patrol uses for quick condition assessment

---

*Prepared by: Noirsys AI*  
*Contact: Michael A. Vega, michael@noirsys.com*
