# Phase 4 — Build Checklist

## Pre-Flight
- [ ] Michael approval to proceed
- [ ] Domain decision: `gotl.noirsys.com` or custom domain
- [ ] Firebase project created
- [ ] Repository initialized (or add to existing mono-repo)

---

## Week 1: Foundation

### Day 1-2: Setup
```bash
# Create project
npm create vite@latest gotl-weekend-planner -- --template react-ts
cd gotl-weekend-planner
npm install

# Install dependencies
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom zustand @tanstack/react-query
npm install lucide-react framer-motion
npm install -D @types/node

# Firebase
npm install firebase
npm install -g firebase-tools
firebase login
firebase init hosting firestore
```

- [ ] Vite + React + TypeScript scaffolded
- [ ] Tailwind configured
- [ ] Firebase initialized
- [ ] Git repo + initial commit

### Day 3-4: Data Layer
- [ ] Create `src/data/venues.ts` with 20-30 curated venues
- [ ] Create `src/data/events.ts` with annual events
- [ ] Define TypeScript interfaces (`src/types/index.ts`)
- [ ] Create venue images directory (or use Unsplash placeholders)

### Day 5-7: Quiz Component
- [ ] Build `QuizWizard` component with 5 steps
- [ ] Create state management for quiz responses
- [ ] Add progress indicator
- [ ] Style with Tailwind (mobile-first)
- [ ] Add animations (Framer Motion)

**Deliverable:** Working quiz flow with state

---

## Week 2: Core Features

### Day 8-10: Itinerary Algorithm
```typescript
// src/lib/itinerary-generator.ts
export function generateItinerary(prefs: TripPreferences): Itinerary {
  // Implementation per SPEC section 9
}
```

- [ ] Filter venues by season/group
- [ ] Time slot categorization
- [ ] Constraint application
- [ ] Selection algorithm
- [ ] Add contextual tips

### Day 11-12: Itinerary View
- [ ] Build `ItineraryView` component
- [ ] Timeline layout (morning/afternoon/evening)
- [ ] Venue cards with images
- [ ] Expandable details
- [ ] "Remix" button (regenerate)

### Day 13-14: Share Functionality
- [ ] Generate shareable URLs (`/itinerary/:id`)
- [ ] Copy to clipboard
- [ ] Social share buttons (optional)
- [ ] Firebase persistence for shared itineraries

**Deliverable:** Full quiz → itinerary → share flow

---

## Week 3: Polish & Content

### Day 15-17: Landing Page
- [ ] Hero section with GOTL imagery
- [ ] Value proposition copy
- [ ] "Plan My Trip" CTA
- [ ] Sample itinerary preview
- [ ] FAQ section
- [ ] Footer with contact/partner links

### Day 18-19: Content & Assets
- [ ] Source 20-30 high-quality venue photos
- [ ] Write venue descriptions (150 words each)
- [ ] Compile insider tips (parking, timing, etc.)
- [ ] Create event descriptions

### Day 20-21: Responsive & Testing
- [ ] Mobile viewport testing (Chrome DevTools)
- [ ] Tablet testing
- [ ] Desktop optimization
- [ ] Cross-browser check (Chrome, Safari, Firefox)

**Deliverable:** Polished, content-complete MVP

---

## Week 4: Deploy & Iterate

### Day 22-23: Firebase Deploy
```bash
npm run build
firebase deploy --only hosting
```

- [ ] Production build
- [ ] Firebase hosting deploy
- [ ] Custom domain setup (if applicable)
- [ ] SSL certificate verification

### Day 24-25: Analytics
- [ ] Add Plausible or GA4
- [ ] Track quiz funnel events
- [ ] Track share events
- [ ] Set up dashboard

### Day 26-28: Feedback & Fixes
- [ ] Test with 5-10 friends/family
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Update venue data if needed

**Deliverable:** Live MVP with analytics

---

## Post-MVP (Phase 2)

- [ ] Event calendar integration (Chamber API)
- [ ] Weather API (OpenWeatherMap)
- [ ] Expand to 50+ venues
- [ ] Maps integration (Mapbox)
- [ ] Partner portal (simple admin)

---

## Copy-Paste Commands

### Deploy to Firebase
```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/gotl-weekend-planner
npm run build
firebase deploy --only hosting
```

### Update venue data
```bash
# Edit src/data/venues.ts, then:
npm run build && firebase deploy
```

### Check logs
```bash
firebase functions:log
```

---

## Definition of Done

- [ ] Visitor can complete quiz in <2 minutes
- [ ] Itinerary generates in <1 second
- [ ] Share URL works and displays correctly
- [ ] Mobile experience is smooth
- [ ] Page loads in <2 seconds
- [ ] Zero critical bugs
- [ ] Analytics tracking active

---

*Checklist created: February 18, 2026*
