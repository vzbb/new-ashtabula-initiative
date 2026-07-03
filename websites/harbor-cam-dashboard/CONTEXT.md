# Harbor Cam Dashboard — Project Context

## Vision
A real-time dashboard for Ashtabula Harbor displaying live camera feeds, marine weather conditions, and harbor status — serving boaters, fishermen, and the local community.

## Problem
- Boaters currently check multiple sources for harbor conditions (weather apps, marine radio, physical observations)
- No centralized view combining live video + real-time marine data
- No easy way to check harbor conditions before heading out
- Ashtabula's harbor camera exists but isn't prominently featured for public use

## Target Users
1. **Recreational Boaters** — Day sailors, fishing enthusiasts, weekend boaters
2. **Commercial Fishermen** — Charter operators, commercial fishing vessels
3. **Lake Enthusiasts** — Kayakers, paddleboarders, beachgoers
4. **Harbor Authority** — Staff monitoring conditions, emergency services

## Success Metrics
- Daily active users checking conditions
- Reduced "is it safe to go out?" calls to Harbor Yacht Club
- Community adoption as "the place to check" before boating

## Key Features (MVP)
- Live harbor camera feed (Great Lakes Marine Museum cam)
- Real-time NOAA buoy data (Station 45005 - West Erie)
- Marine weather forecast (NWS Cleveland)
- Water temperature, wave height, wind conditions
- Mobile-first responsive design

## Data Sources
- Weather Underground webcam (Ashtabula Harbor)
- NOAA NDBC Buoy 45005 (West Erie, 16 NM NW of Lorain)
- NOAA Marine Forecast Zone LEZ148 (Conneaut OH to Ripley NY)
- NWS API for forecasts

## Technical Direction
- React + Vite (existing scaffold)
- Firebase Hosting + Cloud Functions
- Real-time data aggregation
- Auto-refresh intervals (camera: 30s, buoy: 10min, forecast: hourly)
