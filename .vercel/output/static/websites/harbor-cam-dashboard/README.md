# Ashtabula Harbor Dashboard v1.0 (MVP)

A real-time marine conditions dashboard for Ashtabula Harbor, designed for boaters and lake enthusiasts.

## Features
- **Live Camera Feed**: Real-time view of the harbor entrance (Refreshes every 60s).
- **Go/No-Go Status**: At-a-glance safety indicator based on current wind and wave conditions.
- **Buoy 45005 Data**: Real-time wind speed, wave height, water/air temperature, and pressure from the West Erie buoy.
- **Marine Forecast**: Latest Nearshore Marine Forecast for Zone LEZ148 (Lake Erie near Ashtabula).
- **Daylight Info**: Real-time sunrise and sunset times for Ashtabula, OH.
- **Mobile Responsive**: Optimized for use on the dock or on the boat.

## Tech Stack
- **Frontend**: React 19 + Vite
- **Styling**: Vanilla CSS (Mobile-first, Dark Theme)
- **Data APIs**:
  - NOAA NDBC (Buoy Data)
  - National Weather Service (Forecast)
  - Sunrise-Sunset.org (Daylight)
  - LakeVision (Harbor Camera)

## Installation & Development
1. Clone the repository.
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Build for production: `npm run build`

## Project Status
Functional MVP complete. Demonstrates real-time integration and core dashboard features.

---
© 2026 New Ashtabula Initiative
