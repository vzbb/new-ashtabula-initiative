# Ashtabula Benefits Navigator — Eligibility Screener

A functional demonstrative MVP of a benefits pre-screening tool for Ashtabula County residents.

## Features
- **Anonymous Wizard:** Multi-step intake form for household basics, income, and situation.
- **Deterministic Logic:** Eligibility screening based on 2025 Federal Poverty Level (FPL) guidelines.
- **Programs Covered:** SNAP, Medicaid, HEAP/PIPP, WIC, OWF, and Senior Meals.
- **AI Navigator Advice:** Personalized guidance powered by Gemini 2.5 Flash.
- **Document Checklist:** Automated list of required documents based on likely eligible programs.
- **Printable Results:** Users can print their results and checklist for reference.

## Tech Stack
- **Frontend:** React 19 + Vite
- **AI:** Gemini 2.5 Flash API
- **Styling:** Vanilla CSS (Mobile-first, Accessible)

## Setup
1. Clone the repository.
2. Create a `.env` file with `VITE_GEMINI_API_KEY=your_key_here`.
3. Install dependencies: `npm install`
4. Run dev server: `npm run dev`
5. Build for production: `npm run build`

## Project Status
This is a **Functional MVP**.
- [x] Phase 1: Research
- [x] Phase 2: Resources & Outreach Plan
- [x] Phase 3: SPEC
- [x] Phase 4: Build (MVP Complete)
- [ ] Phase 5: Polish & Deployment

## Disclaimer
This tool provides estimates only and is not an official application for benefits. Users must apply through official channels (ACDJFS, ACCAA, etc.) to confirm eligibility.
