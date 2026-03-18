# Pocket Historian — Project Deliverables

**Project:** Walking tour mobile app for Ashtabula's historic sites with GPS-triggered audio narration
**Status:** 🟢 Phases 1-4 Complete — Ready for Implementation
**Last Updated:** February 19, 2026

---

## Deliverables Overview

| Phase | Status | Document | Size | Description |
|-------|--------|----------|------|-------------|
| Phase 1 | ✅ Complete | `PHASE1-RESEARCH.md` | 19 KB | Market research, competitor analysis, stakeholder mapping |
| Phase 2 | ✅ Complete | `PHASE2-OUTREACH.md` | 21 KB | Contact research, email templates, outreach strategy |
| Phase 3 | ✅ Complete | `SPEC.md` | 33 KB | Technical specification, user stories, architecture |
| Phase 4 | ✅ Complete | `BUILD_CHECKLIST.md` | 24 KB | Copy-paste implementation guide, code snippets |

---

## Phase 1: Research & Reconnaissance

**Status:** ✅ COMPLETE (February 19, 2026)

**Key Findings:**
- **Ashtabula Tourism Market:** 500K+ annual visitors, $50M+ economic impact
- **Historic Sites Identified:** 8 major sites including Hubbard House UGRR Museum, Percy Covered Bridge, Harbor District, Victorian Perambulator Museum
- **Competitor Gap:** GPSmyCity ($5.99/tour), VoiceMap ($4.99/tour) — expensive for small markets; no Ashtabula-specific content
- **Revenue Model:** Freemium $2.99/tour or SaaS $49-149/mo for museums
- **Technical Feasibility:** React PWA + Firebase + Mapbox + Web Audio API — all proven technologies

**Critical Blockers Identified:**
1. Historical content permissions (ACHS content licensing)
2. Hubbard House partnership for UGRR tour content
3. iOS Safari audio autoplay restrictions

**File:** `PHASE1-RESEARCH.md`

---

## Phase 2: Resource Procurement

**Status:** ✅ COMPLETE (February 19, 2026)

**Contacts Researched:**
| Organization | Phone | Email/Contact | Priority |
|--------------|-------|---------------|----------|
| Ashtabula County Historical Society | (440) 998-7252 | ashtabhistsoc@gmail.com | P0 |
| Hubbard House UGRR Museum | (440) 964-8167 | hubbardhouse@atwoodfoundation.org | P0 |
| Main Street Ashtabula | (440) 992-2100 | info@mainstreetashtabula.org | P1 |
| Ashtabula County Tourism Council | (440) 998-6966 | info@visitashtabulacounty.com | P1 |
| Great Lakes Historical Society | (440) 964-3637 | info@inlandseas.org | P2 |
| Lake Shore Railway Museum | (440) 969-2192 | info@lakeshorerailway.org | P2 |

**Deliverables:**
- ✅ 3 tailored email templates (Historical Society, Museum Partner, Tourism Board)
- ✅ 15 discovery call questions per stakeholder type
- ✅ 3-week outreach timeline with follow-up cadence
- ✅ Data source catalog (Archives, Ohio Memory, Digital Public Library)
- ✅ Risk assessment matrix with mitigations

**Gate Criteria for Phase 3:** 2+ content partnerships secured OR grant funding approved

**File:** `PHASE2-OUTREACH.md`

---

## Phase 3: Technical Specification

**Status:** ✅ COMPLETE (February 19, 2026)

**Specification Highlights:**

### User Stories: 12 total
- **Visitor Stories (8):** Browse tours, preview content, purchase/unlock, start navigation, GPS-triggered audio, player controls, offline mode, track progress
- **Admin Stories (4):** Dashboard login, create/edit tours, manage stops, view analytics

### Architecture Stack
- **Frontend:** React 18 + Vite + PWA
- **Backend:** Firebase (Auth, Firestore, Storage, Hosting)
- **Maps:** Mapbox GL JS
- **Audio:** Howler.js + Web Audio API
- **Payments:** Stripe
- **Offline:** IndexedDB + Service Worker

### Data Model
- `users` — Auth, purchases, progress
- `tours` — Tour metadata, publishing status
- `tours/{tourId}/stops` — Subcollection with GPS coordinates, audio URLs
- `purchases` — Transaction records
- `analytics` — Usage events

### Implementation Timeline
- **Phase A:** Project setup, Firebase (3 days)
- **Phase B:** Core components (7 days)
- **Phase C:** Map integration (4 days)
- **Phase D:** Audio & offline storage (4 days)
- **Phase E:** PWA config (1 day)
- **Phase F:** Testing & deploy (2 days)

**Total Estimate:** 60-80 hours (8 weeks part-time)

**File:** `SPEC.md`

---

## Phase 4: Build Checklist

**Status:** ✅ COMPLETE (February 19, 2026)

**Implementation Guide Includes:**

### Copy-Paste Code Snippets
- ✅ Firebase initialization (`src/services/firebase.js`)
- ✅ Environment variable template (`.env.local`)
- ✅ Geolocation hook with watchPosition (`src/hooks/useGeolocation.js`)
- ✅ Haversine distance calculation (`src/utils/geofence.js`)
- ✅ Audio hook with MediaSession API (`src/hooks/useAudio.js`)
- ✅ Mapbox component with markers (`src/components/map/MapContainer.jsx`)
- ✅ IndexedDB service for offline audio (`src/services/audioStorage.js`)
- ✅ Audio player component (`src/components/audio/AudioPlayer.jsx`)
- ✅ Vite PWA configuration (`vite.config.js`)

### Testing Checklist
- [ ] App installs on iOS Safari
- [ ] App installs on Android Chrome
- [ ] Background audio playback
- [ ] Lock screen controls
- [ ] GPS geofence triggers
- [ ] Offline mode after download
- [ ] Stripe purchase flow
- [ ] Map route display

### Deployment Commands
```bash
npm run build
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only functions
```

**File:** `BUILD_CHECKLIST.md`

---

## Next Action Required

**Recommended Path:**

1. **Send Phase 2 Outreach Emails** (pending Michael approval)
   - Target: Ashtabula County Historical Society, Hubbard House UGRR Museum
   - Goal: Secure content licensing partnership

2. **Upon Partnership Confirmation:**
   - Begin Phase A implementation per BUILD_CHECKLIST.md
   - Estimated 8 weeks to MVP launch

3. **Alternative Path (Demo First):**
   - Build MVP with placeholder/sample content
   - Use demo to pitch partners with working prototype
   - Lower friction for partnership discussions

---

## Project Files Summary

```
projects/new-ashtabula-initiative/websites/pocket-historian/
├── PHASE1-RESEARCH.md     # 19 KB - Market research
├── PHASE2-OUTREACH.md     # 21 KB - Contact research, emails
├── SPEC.md                # 33 KB - Technical specification
├── BUILD_CHECKLIST.md     # 24 KB - Implementation guide
├── DELIVERABLES.md        # This file - Project tracker
├── PROJECT.md             # Original project brief
├── src/                   # Source code (existing)
├── dist/                  # Build output
└── node_modules/          # Dependencies
```

**Total Documentation:** 97 KB (4 comprehensive documents)

---

## Status Change Log

| Date | Change | Notes |
|------|--------|-------|
| Feb 9, 2026 | Project initiated | Base React template created |
| Feb 19, 2026 | Phases 1-4 complete | Full 4-phase workflow executed |

---

## MVP Status: Ready for Build

All four phases of the MVP workflow are complete. The project is ready for:
1. Outreach to historical partners (Phase 2 emails)
2. Implementation following BUILD_CHECKLIST.md (8 weeks)
3. Deployment to Firebase + testing

**Estimated Time to Launch:** 8-10 weeks (including partner negotiations)
