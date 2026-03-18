# Pocket Historian — Technical Specification

**Project:** Pocket Historian MVP  
**Platform:** React Progressive Web App (PWA)  
**Stack:** Firebase + Mapbox + Web Audio API  
**Version:** 1.0  
**Date:** February 19, 2026

---

## 1. User Stories & Acceptance Criteria

### Visitor Stories

#### US-001: Browse Available Tours
> **As a** visitor, **I want** to see a list of available walking tours **so that** I can choose one that interests me.

**Acceptance Criteria:**
- [ ] Display tour cards with: title, thumbnail image, duration, distance, difficulty rating
- [ ] Show "Free Sample" badge on tours with preview content
- [ ] Filter by category: "UGRR History", "Covered Bridges", "Harbor District", "Downtown"
- [ ] Sort by: popularity, distance from me, recently added
- [ ] Tap to view tour details page

**Priority:** P0 (MVP)  
**Est. Effort:** 2 days

---

#### US-002: Preview Tour Content
> **As a** visitor, **I want** to listen to a sample of the audio **so that** I can decide if I want to purchase.

**Acceptance Criteria:**
- [ ] "Play Sample" button on each tour card
- [ ] 60-90 second audio sample plays
- [ ] Sample is the first stop's introduction
- [ ] Visual indicator showing sample vs. full content
- [ ] Clear call-to-action to unlock full tour

**Priority:** P0  
**Est. Effort:** 1 day

---

#### US-003: Purchase/Unlock Tour
> **As a** visitor, **I want** to unlock a full tour **so that** I can access all the audio content.

**Acceptance Criteria:**
- [ ] Stripe integration for $2.99 single tour purchase
- [ ] Unlock persists across sessions (Firebase Auth + Firestore)
- [ ] "Restore Purchases" for returning users
- [ ] Purchase confirmation with tour access
- [ ] Graceful handling of payment failure

**Priority:** P0  
**Est. Effort:** 3 days

---

#### US-004: Start Tour & Navigate
> **As a** visitor, **I want** to start a tour and see my location on a map **so that** I can follow the route.

**Acceptance Criteria:**
- [ ] "Start Tour" button initiates navigation mode
- [ ] Map displays with user's current location (blue dot)
- [ ] Route polyline shows path between stops
- [ ] Stop markers indicate audio trigger points
- [ ] Distance to next stop displayed
- [ ] Works in "preview mode" without purchase

**Priority:** P0  
**Est. Effort:** 3 days

---

#### US-005: GPS-Triggered Audio Playback
> **As a** visitor, **I want** audio to play automatically when I approach a stop **so that** I don't have to look at my phone.

**Acceptance Criteria:**
- [ ] Geofence radius: 30 meters (configurable per stop)
- [ ] Audio auto-plays when entering geofence (if enabled)
- [ ] Manual play button always available as fallback
- [ ] Audio pauses if user leaves geofence mid-playback (optional setting)
- [ ] Preload next audio segment for seamless playback
- [ ] Works offline after initial download

**Priority:** P0  
**Est. Effort:** 4 days

---

#### US-006: Audio Player Controls
> **As a** visitor, **I want** to control playback **so that** I can pause, skip, or replay content.

**Acceptance Criteria:**
- [ ] Persistent audio player bar (mini player)
- [ ] Play/Pause button with clear state
- [ ] 15-second skip backward/forward
- [ ] Progress bar with scrub capability
- [ ] Current time / total duration display
- [ ] Background audio playback (mobile)
- [ ] Lock screen controls (media session API)

**Priority:** P0  
**Est. Effort:** 2 days

---

#### US-007: Offline Mode
> **As a** visitor, **I want** to use the app without cell service **so that** I can explore rural bridge locations.

**Acceptance Criteria:**
- [ ] "Download Tour" button on tour details
- [ ] Download includes: audio files, map tiles, images, text
- [ ] Visual indicator of download progress
- [ ] Downloaded tours work completely offline
- [ ] Storage usage display per tour
- [ ] Option to delete downloaded content

**Priority:** P0  
**Est. Effort:** 3 days

---

#### US-008: Track Tour Progress
> **As a** visitor, **I want** to see my progress through a tour **so that** I know how much is left.

**Acceptance Criteria:**
- [ ] Progress indicator: "Stop 3 of 8"
- [ ] Visual map showing completed stops
- [ ] Option to resume incomplete tour
- [ ] Completion badge/celebration at end
- [ ] Share completion to social media

**Priority:** P1 (Post-MVP)  
**Est. Effort:** 1 day

---

### Content Admin Stories

#### US-009: Admin Dashboard Login
> **As a** content admin, **I want** to log into a dashboard **so that** I can manage tour content.

**Acceptance Criteria:**
- [ ] Firebase Authentication with email/password
- [ ] Role-based access (admin, editor, viewer)
- [ ] Secure session management
- [ ] Password reset functionality
- [ ] 2FA optional for admin accounts

**Priority:** P1  
**Est. Effort:** 2 days

---

#### US-010: Create/Edit Tour
> **As a** content admin, **I want** to create a new tour **so that** I can publish content.

**Acceptance Criteria:**
- [ ] Form fields: title, description, category, difficulty, duration, distance
- [ ] Upload hero image (auto-resize)
- [ ] Set price (free, $2.99, or custom)
- [ ] Add/edit stops with ordering
- [ ] Preview mode before publishing
- [ ] Publish/unpublish toggle

**Priority:** P1  
**Est. Effort:** 3 days

---

#### US-011: Manage Tour Stops
> **As a** content admin, **I want** to add stops with GPS coordinates **so that** audio triggers at the right location.

**Acceptance Criteria:**
- [ ] Map interface for selecting stop location
- [ ] Manual coordinate entry (lat/lng)
- [ ] Upload audio file per stop (MP3, max 20MB)
- [ ] Audio transcription/notes field
- [ ] Geofence radius per stop (default 30m)
- [ ] Stop ordering (drag to reorder)

**Priority:** P1  
**Est. Effort:** 3 days

---

#### US-012: View Analytics
> **As a** content admin, **I want** to see tour usage statistics **so that** I can understand engagement.

**Acceptance Criteria:**
- [ ] Total downloads per tour
- [ ] Completion rate (started vs. finished)
- [ ] Most/least popular stops
- [ ] Geographic heat map of users
- [ ] Revenue tracking (if purchases enabled)
- [ ] Date range filtering
- [ ] Export to CSV

**Priority:** P2  
**Est. Effort:** 2 days

---

## 2. System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (PWA)                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  React App  │  │  Mapbox GL  │  │ Web Audio   │  │  Service Worker     │ │
│  │  (UI/UX)    │◄─┤  (Maps)     │  │  API        │  │  (Offline Cache)    │ │
│  └──────┬──────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│         │                                                                   │
│  ┌──────▼──────┐  ┌─────────────┐  ┌─────────────┐                         │
│  │  IndexedDB  │  │  LocalStorage│  │  Cache API  │                         │
│  │ (Audio/Maps)│  │  (User Data) │  │ (App Shell) │                         │
│  └─────────────┘  └─────────────┘  └─────────────┘                         │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │ HTTPS/WSS
┌────────────────────────────▼────────────────────────────────────────────────┐
│                           FIREBASE                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Auth       │  │  Firestore  │  │  Cloud      │  │  Hosting            │ │
│  │  (Users)    │  │  (Database) │  │  Functions  │  │  (CDN/Distribution) │ │
│  └─────────────┘  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘ │
│                          │                │                                  │
└──────────────────────────┼────────────────┼──────────────────────────────────┘
                           │                │
┌──────────────────────────▼────────────────▼──────────────────────────────────┐
│                      EXTERNAL SERVICES                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Mapbox     │  │  Stripe     │  │ ElevenLabs  │  │  Cloud Storage      │ │
│  │  API        │  │  Payments   │  │  TTS (opt)  │  │  (Audio/Images)     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### Frontend (React PWA)
```
src/
├── components/
│   ├── common/           # Button, Card, Modal, Loading
│   ├── map/              # MapContainer, RouteLayer, StopMarker
│   ├── audio/            # AudioPlayer, ProgressBar, VolumeControl
│   └── tour/             # TourCard, TourDetail, StopList
├── pages/
│   ├── Home/             # Tour browsing
│   ├── TourDetail/       # Tour info + purchase
│   ├── Navigation/       # Active tour mode
│   ├── Profile/          # Downloads, purchases, settings
│   └── Admin/            # Content management
├── hooks/
│   ├── useGeolocation.js # GPS tracking, geofencing
│   ├── useAudio.js       # Playback control, background audio
│   ├── useOffline.js     # Connectivity detection
│   └── useTourProgress.js# Stop completion tracking
├── services/
│   ├── firebase.js       # Auth, Firestore init
│   ├── audioStorage.js   # IndexedDB audio caching
│   ├── mapTiles.js       # Mapbox offline tile management
│   └── payments.js       # Stripe integration
├── store/
│   ├── tourSlice.js      # Redux/Zustand tour state
│   ├── userSlice.js      # User auth, purchases
│   └── audioSlice.js     # Playback state
└── utils/
    ├── geofence.js       # Distance calculation, trigger logic
    ├── constants.js      # Config values
    └── helpers.js        # Formatting, validation
```

#### Backend (Firebase)

**Firestore Collections:**
```
users/
  {userId}/
    - email: string
    - purchasedTours: array of tourIds
    - downloadHistory: array
    - createdAt: timestamp

tours/
  {tourId}/
    - title: string
    - description: string
    - category: enum
    - price: number (0 = free)
    - duration: number (minutes)
    - distance: number (miles)
    - difficulty: enum
    - heroImage: storage URL
    - stops: subcollection
    - isPublished: boolean
    - createdAt: timestamp
    - updatedAt: timestamp
    
tours/{tourId}/stops/
  {stopId}/
    - title: string
    - description: string
    - audioUrl: storage URL
    - duration: number (seconds)
    - coordinates: geopoint
    - geofenceRadius: number (meters, default 30)
    - order: number
    - transcript: string

purchases/
  {purchaseId}/
    - userId: ref
    - tourId: ref
    - amount: number
    - stripePaymentIntentId: string
    - status: enum
    - createdAt: timestamp

analytics/
  {eventId}/
    - type: enum (tour_start, stop_complete, purchase, etc.)
    - userId: ref
    - tourId: ref
    - stopId: ref (optional)
    - timestamp: timestamp
    - metadata: object
```

**Cloud Functions:**
```
functions/
├── onPurchaseCompleted/    # Grant tour access after Stripe webhook
├── onUserCreated/          # Welcome email, analytics
├── cleanupOldDownloads/    # Scheduled: purge inactive cached data
├── generateAudioTTS/       # Optional: ElevenLabs integration
└── exportAnalytics/        # Admin: CSV export
```

---

## 3. Data Schema

### Tour Object
```typescript
interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;  // For cards
  category: 'ugrr' | 'bridges' | 'harbor' | 'downtown' | 'other';
  
  // Metadata
  price: number;             // 0 = free, 2.99 = standard
  isPublished: boolean;
  isPreview: boolean;        // Has free sample
  
  // Route info
  duration: number;          // minutes
  distance: number;          // miles
  difficulty: 'easy' | 'moderate' | 'challenging';
  startCoordinates: {
    latitude: number;
    longitude: number;
  };
  
  // Media
  heroImage: string;         // Storage URL
  thumbnailImage: string;    // Optimized for cards
  badgeImage?: string;       // "Featured", "New", etc.
  
  // Stats
  downloadCount: number;
  rating: number;            // 1-5
  reviewCount: number;
  
  // Stops
  stops: Stop[];
  stopCount: number;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}
```

### Stop Object
```typescript
interface Stop {
  id: string;
  tourId: string;
  order: number;             // Display sequence
  
  // Content
  title: string;
  description: string;       // Shown while audio plays
  transcript: string;        // Full audio text (accessibility)
  
  // Location
  coordinates: {
    latitude: number;
    longitude: number;
  };
  geofenceRadius: number;    // meters, default 30
  address?: string;          // Human-readable
  
  // Audio
  audioUrl: string;
  audioDuration: number;     // seconds
  audioFileSize: number;     // bytes (for download planning)
  
  // Media
  images: string[];          // Gallery for this stop
  primaryImage?: string;
  
  // Optional TTS
  useTTS: boolean;
  ttsVoice?: string;         // ElevenLabs voice ID
}
```

### User Object
```typescript
interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  
  // Preferences
  settings: {
    autoPlayAudio: boolean;
    downloadQuality: 'high' | 'standard' | 'low';
    geofenceRadius: number;
    notificationsEnabled: boolean;
  };
  
  // Purchases
  purchasedTourIds: string[];
  purchaseHistory: Purchase[];
  
  // Downloads
  downloadedTours: {
    tourId: string;
    downloadedAt: Timestamp;
    lastAccessedAt: Timestamp;
  }[];
  
  // Progress
  tourProgress: {
    tourId: string;
    startedAt: Timestamp;
    completedAt?: Timestamp;
    currentStopId?: string;
    completedStopIds: string[];
    percentComplete: number;
  }[];
  
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

---

## 4. API Integration Details

### Mapbox Integration

**Configuration:**
```javascript
// mapboxConfig.js
export const MAPBOX_CONFIG = {
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
  style: 'mapbox://styles/mapbox/outdoors-v12', // Good for walking
  center: [-80.7982, 41.8995], // Ashtabula Harbor
  zoom: 13,
  minZoom: 10,
  maxZoom: 18
};
```

**Offline Tile Caching:**
```javascript
// Cache tiles for tour bounding box
const cacheTilesForTour = async (tour) => {
  const bounds = calculateBoundingBox(tour.stops);
  const zoomRange = [12, 16]; // Detail level for walking
  
  // Download tile URLs for offline storage
  const tileUrls = generateTileUrls(bounds, zoomRange);
  await cacheInIndexedDB(tileUrls);
};
```

**Route Display:**
```javascript
// Add route polyline
map.addSource('route', {
  type: 'geojson',
  data: {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: tour.stops.map(s => [s.lng, s.lat])
    }
  }
});

map.addLayer({
  id: 'route-line',
  type: 'line',
  source: 'route',
  paint: {
    'line-color': '#2E7D32',
    'line-width': 4,
    'line-opacity': 0.8
  }
});
```

### ElevenLabs TTS (Optional)

**Configuration:**
```javascript
// elevenlabsConfig.js
export const ELEVENLABS_CONFIG = {
  apiKey: process.env.ELEVENLABS_API_KEY,
  voiceId: 'CXAc4DNZL6wonQQNlNgZ', // Recommended voice
  modelId: 'eleven_monolingual_v1',
  settings: {
    stability: 0.5,
    similarity_boost: 0.75
  }
};
```

**Generate Audio Function:**
```javascript
// Cloud Function
exports.generateTTSAudio = functions.https.onCall(async (data, context) => {
  const { text, voiceId = DEFAULT_VOICE } = data;
  
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  });
  
  const audioBuffer = await response.arrayBuffer();
  const fileName = `tts/${Date.now()}_${hash(text)}.mp3`;
  
  // Upload to Firebase Storage
  await admin.storage().bucket().file(fileName).save(Buffer.from(audioBuffer));
  
  return { audioUrl: getPublicUrl(fileName) };
});
```

### Stripe Payments

**Configuration:**
```javascript
// stripeConfig.js
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export const createPaymentIntent = async (tourId, userId) => {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tourId, userId })
  });
  return response.json();
};
```

**Cloud Function:**
```javascript
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  const { tourId } = data;
  const tour = await getTour(tourId);
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(tour.price * 100), // Convert to cents
    currency: 'usd',
    metadata: { tourId, userId: context.auth.uid }
  });
  
  return { clientSecret: paymentIntent.client_secret };
});
```

---

## 5. UI/UX Flow Diagrams

### User Flow: First-Time Visitor

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Landing    │────►│   Browse     │────►│ Tour Detail  │
│    Page      │     │   Tours      │     │    Page      │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                         ┌────────────────────────┘
                         ▼
                  ┌──────────────┐
                  │  Play Sample │◄──────┐
                  └──────┬───────┘       │
                         │               │
           ┌─────────────┼─────────────┐ │
           ▼             ▼             ▼ │
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ Purchase │  │  Share   │  │ Download │
    │  $2.99   │  │  Sample  │  │ (Future) │
    └────┬─────┘  └──────────┘  └──────────┘
         │
         ▼
    ┌──────────┐     ┌──────────┐     ┌──────────┐
    │  Stripe  │────►│  Success │────►│  Start   │
    │ Checkout │     │  Page    │     │   Tour   │
    └──────────┘     └──────────┘     └──────────┘
```

### User Flow: Active Tour Mode

```
┌──────────────┐
│  Navigation  │◄──────────────────────────────────────────┐
│    Mode      │                                           │
└──────┬───────┘                                           │
       │                                                   │
       ├──► GPS Enter Geofence ──► Auto-Play Audio ────────┤
       │                                                   │
       ├──► Manual Play Button ──► Audio Player Overlay ───┤
       │                                                   │
       ├──► Next Stop Button ──► Advance to Next Stop ─────┤
       │                                                   │
       ├──► Pause Tour ──► Background Mode ────────────────┤
       │                                                   │
       └──► End Tour ──► Completion Screen ──► Share/Review│
```

### Admin Flow: Content Creation

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Admin Login  │────►│  Dashboard   │────►│ Create Tour  │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                         ┌────────────────────────┘
                         ▼
                  ┌──────────────┐
                  │  Tour Form   │
                  │ (Basic Info) │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Add Stops    │◄─────────────────────┐
                  │ (Map + Audio)│                      │
                  └──────┬───────┘                      │
                         │                              │
                         ├──► Place Pin on Map          │
                         ├──► Upload Audio              │
                         ├──► Add Description           │
                         └──► Add Another Stop? ────────┘
                         │
                         ▼
                  ┌──────────────┐     ┌──────────────┐
                  │    Preview   │────►│   Publish    │
                  │     Tour     │     │   to Live    │
                  └──────────────┘     └──────────────┘
```

---

## 6. Four-Phase Implementation Plan (8 Weeks)

### Phase 1: Foundation (Weeks 1-2)

**Goals:** Setup, core infrastructure, authentication

| Day | Task | Deliverable |
|-----|------|-------------|
| 1-2 | Initialize React PWA with Vite | Running dev server |
| 3 | Firebase project setup | Auth, Firestore, Storage ready |
| 4 | Deploy to Firebase Hosting | Live staging URL |
| 5-6 | Implement auth flow | Login/signup working |
| 7-8 | Basic routing & navigation | Multi-page structure |
| 9-10 | Tour list page (static data) | Browse UI complete |
| 11-14 | Service worker + PWA config | Offline shell works |

**Phase 1 Gates:**
- [ ] App installs as PWA on mobile
- [ ] User can create account and log in
- [ ] Tour list displays from Firestore
- [ ] Works offline (cached shell)

---

### Phase 2: Core Features (Weeks 3-5)

**Goals:** Maps, audio, geofencing, tour playback

| Day | Task | Deliverable |
|-----|------|-------------|
| 15-17 | Mapbox integration | Map displays, user location |
| 18-20 | Route visualization | Polyline between stops |
| 21-23 | Audio player component | Play/pause, progress, background |
| 24-26 | Geofencing logic | Distance calculation, triggers |
| 27-29 | Tour navigation mode | GPS following, stop detection |
| 30-32 | Audio download/caching | IndexedDB storage |
| 33-35 | Offline maps (tile caching) | Map works without network |

**Phase 2 Gates:**
- [ ] Map shows user location and tour route
- [ ] Audio plays when entering geofence
- [ ] Audio continues in background
- [ ] Tour works completely offline after download

---

### Phase 3: Commerce & Polish (Weeks 6-7)

**Goals:** Payments, admin dashboard, UI polish

| Day | Task | Deliverable |
|-----|------|-------------|
| 36-38 | Stripe integration | Payment flow working |
| 39-40 | Purchase persistence | Unlocked tours saved |
| 41-43 | Admin dashboard layout | Basic CRUD interface |
| 44-46 | Tour creation form | Add/edit tours in admin |
| 47-48 | Stop management with map | Pin dropping, coordinate entry |
| 49-50 | Tour preview mode | Admin can test tours |
| 51-52 | UI/UX polish, animations | Professional feel |

**Phase 3 Gates:**
- [ ] User can purchase and unlock tour
- [ ] Admin can create complete tour with stops
- [ ] All screens responsive (mobile-first)
- [ ] App feels polished, not buggy

---

### Phase 4: Launch Prep (Week 8)

**Goals:** Content, testing, deployment

| Day | Task | Deliverable |
|-----|------|-------------|
| 53-54 | Create pilot tour content | 1 complete tour in production |
| 55-56 | Analytics implementation | Event tracking working |
| 57-58 | Beta testing with stakeholders | Feedback collected |
| 59-60 | Bug fixes, performance | Stable build |
| 61-62 | Production deployment | Live production URL |
| 63-64 | Launch materials | QR codes, documentation |
| 65-66 | Soft launch with partners | Initial users onboarded |

**Phase 4 Gates:**
- [ ] 1 complete tour live with real audio
- [ ] Beta testers completed tour without issues
- [ ] Production environment stable
- [ ] Partners have QR codes and instructions

---

## 7. Cost Estimates & Pricing

### Development Costs (One-Time)

| Item | Cost | Notes |
|------|------|-------|
| Developer time (8 weeks) | $8,000-12,000 | Based on $100-150/hr freelance |
| Voice talent (pilot tour) | $500-1,000 | ~30 min narration, local actor |
| Content production | $500 | Script writing, photo licensing |
| Design assets | $300 | Icons, splash screens |
| **Total Development** | **$9,300-13,800** | |

### Ongoing Operational Costs (Monthly)

| Service | Free Tier | Expected Usage | Monthly Cost |
|---------|-----------|----------------|--------------|
| Firebase Auth | 50K users/mo | <5K | $0 |
| Firestore | 50K reads/day | ~20K | $0 |
| Firebase Storage | 5GB | ~10GB | $5-10 |
| Firebase Hosting | 10GB/mo | ~5GB | $0 |
| Mapbox | 50K loads/mo | ~10K | $0 |
| ElevenLabs TTS | 10K chars/mo | As needed | $0-5 |
| Stripe | Per transaction | Variable | 2.9% + $0.30 |
| **Total Monthly** | | | **$5-15** |

### Pricing Strategy

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Browse, 90-sec samples, 1 free "intro" tour |
| **Single Tour** | $2.99 | Full audio, offline, 1 tour |
| **County Bundle** | $9.99 | All current + 1 year of new Ashtabula tours |
| **All Access** | $19.99/year | All regions, unlimited downloads |

### Revenue Projection

| Metric | Conservative | Moderate | Optimistic |
|--------|--------------|----------|------------|
| Year 1 Downloads | 2,000 | 5,000 | 10,000 |
| Conversion Rate | 8% | 12% | 15% |
| Paid Transactions | 160 | 600 | 1,500 |
| Avg Revenue/Transaction | $4 | $5 | $6 |
| Gross Revenue | $640 | $3,000 | $9,000 |
| After Stripe Fees (~3%) | $620 | $2,910 | $8,730 |

---

## 8. Success Metrics & KPIs

### Product Metrics

| Metric | Target (MVP) | Target (Year 1) | Measurement |
|--------|--------------|-----------------|-------------|
| App Downloads | 500 | 5,000 | Firebase Analytics |
| Monthly Active Users | 200 | 1,500 | Firebase Auth events |
| Tour Completion Rate | 60% | 70% | Stop completion tracking |
| Average Session Duration | 15 min | 20 min | Analytics |
| Offline Usage Rate | 40% | 50% | Analytics flag |

### Business Metrics

| Metric | Target (MVP) | Target (Year 1) |
|--------|--------------|-----------------|
| Paid Conversion Rate | 5% | 10% |
| Revenue | $500 | $5,000 |
| Customer Acquisition Cost | <$2 | <$1 |
| Net Promoter Score | N/A | >40 |

### Content Metrics

| Metric | Target |
|--------|--------|
| Tours Published | 3 by MVP, 8 by Year 1 |
| Total Stops | 25 by MVP, 60 by Year 1 |
| Average Audio Quality Rating | >4.0/5 |
| Historical Accuracy Complaints | 0 major |

### Technical Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| App Load Time | <3s | >5s |
| Audio Start Latency | <500ms | >2s |
| Crash Rate | <1% | >2% |
| Offline Functionality | 100% of downloaded tours | Any failure |

---

## 9. Future Roadmap

### Phase 2 Enhancements (Months 4-6)

| Feature | Description | Value |
|---------|-------------|-------|
| **AR Markers** | Point camera at building to see historical overlay | Novelty, engagement |
| **Seasonal Tours** | Haunted Ashtabula (Halloween), Holiday Lights (Winter) | Recurring revenue |
| **User Submissions** | Suggest stories, photos, corrections | Community engagement |
| **Multi-language** | Spanish, French for international visitors | Accessibility |
| **Social Features** | Share progress, group tours | Viral growth |

### Phase 3 Expansion (Months 7-12)

| Feature | Description |
|---------|-------------|
| **White Label Platform** | License to other small towns (SaaS model) |
| **School Dashboard** | Classroom management, quiz integration |
| **Accessibility Mode** | Sign language videos, enhanced visual descriptions |
| **Live Events** | Special event tours (re-enactments, openings) |
| **Integration APIs** | Connect with hotel booking, restaurant reservations |

### Long-Term Vision (Year 2+)

- **Regional Network:** Lake Erie Historic Trail (Ashtabula to Toledo)
- **National Platform:** "Pocket Historian" brand for small-town America
- **AI Features:** Personalized tour recommendations, dynamic routing
- **Museum Partnerships:** Indoor positioning, exhibit audio

---

## 10. Appendix: Technical Decisions

### Why PWA vs. Native App?

| Factor | PWA | Native |
|--------|-----|--------|
| Development cost | Lower (1 codebase) | Higher (2 platforms) |
| Distribution | Direct (no app store) | App Store approval required |
| Offline capability | Yes (Service Worker) | Yes (built-in) |
| Background audio | Supported | Better support |
| Push notifications | Supported | Better support |
| iOS limitations | Some (Safari quirks) | None |

**Decision:** PWA for MVP (speed to market). Consider native wrapper (Capacitor) if iOS limitations become blocking.

### Why Firebase?

- **Rapid development:** Minimal backend code
- **Real-time:** Live sync for multi-user features
- **Cost:** Generous free tier for MVP scale
- **Ecosystem:** Auth, Storage, Functions, Hosting in one

### Why Mapbox over Google Maps?

- **Pricing:** More generous free tier
- **Styling:** Better custom map design
- **Offline:** Better tile caching support
- **Privacy:** Less user data collection

---

*This specification is a living document. Update as requirements evolve.*
