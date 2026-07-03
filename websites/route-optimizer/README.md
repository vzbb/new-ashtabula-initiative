# Route Optimizer MVP — Ashtabula Edition

A functional demonstrative MVP for affordable route optimization, designed for small businesses and non-profits in Ashtabula County.

## Features
- **Route Optimization:** One-click optimization using a Nearest Neighbor algorithm.
- **Interactive Map:** Visual representation of stops and the optimized route path (OpenStreetMap/Leaflet).
- **Stop Management:** Drag-and-drop reordering and removal of delivery locations.
- **AI Route Summary:** Gemini-powered analysis of route efficiency and local context.
- **Mobile Responsive:** Designed for dispatchers on desktop and drivers on the move.
- **PWA Ready:** Manifest included for home-screen installation.

## Tech Stack
- **Frontend:** React 19 + Vite 7
- **Styling:** Tailwind CSS 4
- **Mapping:** Leaflet + React-Leaflet
- **Animations:** Framer Motion
- **AI:** Google Gemini API

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   The project expects `VITE_GEMINI_API_KEY` to be available for AI summaries.

3. **Run in development mode:**
   ```bash
   npm run dev
   ```

---
Developed by Noirsys AI for the New Ashtabula Initiative.
