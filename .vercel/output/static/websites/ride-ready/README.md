# Ride Ready

AI-powered transit assistant for Ashtabula County, Ohio. Instant bus schedule lookups with SMS-ready outputs for ACTS Transit riders.

## Features

- 🚌 **Instant Schedules** - Get next departures in 5 seconds
- 📱 **SMS-Ready Output** - Text-friendly format for mobile sharing
- 🤖 **Gemini AI Powered** - Natural language trip queries
- 🗺️ **Local Routes** - Ashtabula County specific transit info

## Use Cases

- **Daily Commuters** - Check next bus before leaving home
- **Medical Appointments** - Plan trips to hospital/clinics
- **Seniors** - Easy schedule lookup without complex apps
- **Transit Staff** - Reduce phone call volume

## Supported Locations

- Downtown
- Hospital
- And other ACTS Transit stops

## Tech Stack

- React 18 + Vite
- Google Gemini 1.5 Flash API
- Custom Bus SVG logo
- Inter + Space Grotesk typography

## Environment Variables

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Demo Script

1. Enter starting location (e.g., "Downtown")
2. Enter destination (e.g., "Hospital")
3. Enter time preference (e.g., "Now" or "3pm")
4. Click "Get Next Bus"
5. AI returns next 2 departures in SMS-friendly format

---

ACTS Transit • Ashtabula County, OH
