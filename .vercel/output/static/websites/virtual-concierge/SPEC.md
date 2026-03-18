# Virtual Concierge — SPEC.md

**Project:** Ashtabula Virtual Concierge  
**Version:** 1.0  
**Date:** 2026-02-19  
**Status:** Draft for Review

---

## 1. Overview

### 1.1 Purpose
A multilingual, AI-powered virtual concierge for Ashtabula County, Ohio, providing 24/7 assistance to tourists via kiosks, tablets, and web browsers. The concierge answers FAQs, provides recommendations, offers wayfinding assistance, and helps visitors discover local attractions, wineries, covered bridges, and events.

### 1.2 Target Users
- **Primary:** Tourists and day-trippers visiting Ashtabula County
- **Secondary:** Local residents seeking event/attraction information
- **Tertiary:** Business owners wanting to promote their establishments

### 1.3 Success Criteria
- Answer 80%+ of common visitor questions without human intervention
- Support at least 5 languages with natural conversation flow
- Generate measurable foot traffic to participating businesses
- Achieve 4.0+ user satisfaction rating
- Cost less than $0.10 per conversation to operate

---

## 2. Architecture

### 2.1 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Kiosk Mode  │  │  Web App    │  │   Mobile Responsive     │  │
│  │ (Tablet/    │  │  (Browser)  │  │   (QR → Web)            │  │
│  │  Touchscreen)│  │             │  │                         │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
└─────────┼────────────────┼─────────────────────┼────────────────┘
          │                │                     │
          └────────────────┼─────────────────────┘
                           │ HTTPS/WSS
┌──────────────────────────▼─────────────────────────────────────┐
│                      API GATEWAY (OpenClaw)                     │
│         Rate limiting, routing, authentication                  │
└──────────────────────────┬─────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼────────┐  ┌─────▼──────┐
│   CHAT API   │  │   AVATAR API    │  │  MAP API   │
│   (Gemini)   │  │  (ElevenLabs    │  │ (MapLibre) │
│              │  │   TTS + WebRTC) │  │            │
└───────┬──────┘  └────────┬────────┘  └─────┬──────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────────────┐
│                    BACKEND SERVICES                             │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐  │
│  │ Conversation │ │   Vector     │ │   Business Data        │  │
│  │    Engine    │ │    Store     │ │     Service            │  │
│  │              │ │  (Qdrant)    │ │   (SQLite/Firestore)   │  │
│  └──────────────┘ └──────────────┘ └────────────────────────┘  │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐  │
│  │   Analytics  │ │  Translation │ │   Cache Layer          │  │
│  │   (Plausible │ │   (Google/   │ │   (Redis optional)     │  │
│  │    or local) │ │    DeepL)    │ │                        │  │
│  └──────────────┘ └──────────────┘ └────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────────────┐
│                      DATA LAYER                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐  │
│  │  Attraction  │ │   Events     │ │   Knowledge Base       │  │
│  │  Database    │ │   Calendar   │ │   (RAG documents)      │  │
│  │  (JSON/YAML) │ │   (iCal/API) │ │   (Markdown/PDF)       │  │
│  └──────────────┘ └──────────────┘ └────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | React 18 + Vite | Fast dev, modern, familiar |
| **UI Framework** | Tailwind CSS + shadcn/ui | Rapid styling, accessible |
| **State Management** | Zustand | Lightweight, simple |
| **Backend** | Node.js + Fastify | Fast, async, WebSocket support |
| **LLM** | Google Gemini 1.5 Flash | Multilingual, cost-effective, 1M context |
| **TTS** | ElevenLabs | High quality, natural voices |
| **Translation** | Google Cloud Translate | 100+ languages, reliable |
| **Vector DB** | Qdrant | Self-hosted, fast similarity search |
| **Maps** | MapLibre GL + OSM | Free, no API keys needed |
| **Database** | SQLite (local) / Firestore (cloud) | Simple, sync-capable |
| **Hosting** | Firebase Hosting + xai VPS | Hybrid approach |
| **Monitoring** | UptimeRobot + Sentry | Free tiers, adequate |

### 2.3 Data Flow

1. **User Input:** Voice or text query (multilingual)
2. **Language Detection:** Auto-detect or user-select
3. **Translation (if needed):** To English for processing
4. **RAG Retrieval:** Query vector DB for relevant local context
5. **LLM Generation:** Gemini generates response with local knowledge
6. **Response Translation:** Back to user's language
7. **TTS Generation:** ElevenLabs converts to speech (if voice mode)
8. **Avatar Display:** Lip-sync or visual feedback (if enabled)
9. **Analytics Log:** Track question, source, satisfaction

---

## 3. Features

### 3.1 Core Features (MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Multilingual Chat** | Text-based Q&A in 10+ languages | P0 |
| **Voice Output** | TTS responses in user's language | P0 |
| **Knowledge Base** | 100+ facts about attractions, businesses | P0 |
| **Wayfinding** | "How do I get to X?" with directions | P0 |
| **Business Directory** | Searchable listings with hours/info | P0 |
| **Event Calendar** | Current and upcoming events | P1 |
| **Weather Integration** | Current conditions and forecast | P1 |
| **Feedback Collection** | Rate answers, suggest improvements | P1 |

### 3.2 Enhanced Features (Phase 2)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Avatar Character** | Visual AI avatar with lip-sync | P2 |
| **Voice Input** | Speech-to-text for queries | P2 |
| **Interactive Map** | Visual map with POI markers | P2 |
| **Itinerary Builder** | "Plan my day" feature | P2 |
| **QR Code Sharing** | Share locations to mobile | P2 |
| **Business Owner Portal** | Self-service listing updates | P3 |
| **Analytics Dashboard** | Usage stats, popular questions | P3 |
| **Offline Mode** | Basic functionality without internet | P3 |

### 3.3 Kiosk-Specific Features

| Feature | Description |
|---------|-------------|
| **Idle Attractor** | Looping demo/promo when not in use |
| **Accessibility Mode** | Larger text, high contrast |
| **Multiple Language Selection** | Visual language picker |
| **Receipt Printer (optional)** | Print directions/coupons |
| **Emergency Button** | Quick access to 911/local services |

---

## 4. User Interface

### 4.1 Screen States

```
┌─────────────────────────────────────┐
│           IDLE STATE                │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │   Welcome to Ashtabula      │    │
│  │   [Animated scenery]        │    │
│  │                             │    │
│  │   [Tap to Start]            │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│  [EN] [ES] [FR] [DE] [ZH] ...       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         ACTIVE CONVERSATION         │
│  ┌─────────────────────────────┐    │
│  │  User: Where are wineries?  │    │
│  │                             │    │
│  │  [Avatar visual]            │    │
│  │                             │    │
│  │  Ashtabula has 30+ wineries...│  │
│  │  [Map preview]              │    │
│  │                             │    │
│  │  [🔊] [Show Map] [Details]  │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  Type or speak...          │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 4.2 Key UI Components

| Component | Description |
|-----------|-------------|
| **LanguageSelector** | Flag/icon grid for language selection |
| **ChatBubble** | Message display with optional audio replay |
| **AvatarDisplay** | Visual character (static or animated) |
| **MapPreview** | Embedded map for location responses |
| **BusinessCard** | Rich display of business information |
| **QuickReplies** | Suggested follow-up questions |
| **FeedbackButtons** | Thumbs up/down + comment |
| **EmergencyBar** | Always-visible emergency info |

---

## 5. Data Schema

### 5.1 Attraction Entity

```typescript
interface Attraction {
  id: string;
  type: 'covered_bridge' | 'winery' | 'restaurant' | 'museum' | 'park' | 'beach' | 'historical_site';
  name: string;
  name_local?: Record<string, string>;  // Translated names
  description: string;
  description_local?: Record<string, string>;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  hours: {
    monday?: string;
    tuesday?: string;
    // ... or structured
    seasonal_note?: string;
  };
  contact: {
    phone?: string;
    website?: string;
    email?: string;
  };
  photos: string[];
  tags: string[];
  features: string[];  // ['wheelchair_accessible', 'pet_friendly', etc]
  metadata: {
    price_range?: 1 | 2 | 3 | 4;
    requires_reservation?: boolean;
    best_time_to_visit?: string;
  };
  knowledge_chunks: string[];  // For RAG retrieval
}
```

### 5.2 Conversation Entity

```typescript
interface Conversation {
  id: string;
  session_id: string;
  started_at: Date;
  language: string;
  kiosk_id?: string;  // If from specific kiosk
  messages: Message[];
  feedback?: {
    rating: 1 | 2 | 3 | 4 | 5;
    comment?: string;
  };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  content_translated?: string;  // If translated
  timestamp: Date;
  sources?: string[];  // Knowledge base sources used
  latency_ms: number;
}
```

### 5.3 Knowledge Base Chunk

```typescript
interface KnowledgeChunk {
  id: string;
  content: string;
  embedding: number[];  // Vector embedding
  metadata: {
    source: string;  // Filename, URL
    category: string;
    last_updated: Date;
    confidence: 'high' | 'medium' | 'low';
  };
}
```

---

## 6. API Specifications

### 6.1 Chat Endpoint

```http
POST /api/chat
Content-Type: application/json

{
  "session_id": "uuid",
  "message": "Where are the covered bridges?",
  "language": "en",
  "include_avatar": false
}

Response:
{
  "response": "Ashtabula County has 19 covered bridges...",
  "response_translated": null,
  "sources": ["bridges_guide_v1.md"],
  "suggested_followups": ["Which bridge is closest?", "Are they all drivable?"],
  "audio_url": "/api/tts/response_id.mp3",
  "processing_time_ms": 850
}
```

### 6.2 TTS Endpoint

```http
POST /api/tts
Content-Type: application/json

{
  "text": "Welcome to Ashtabula County!",
  "language": "en",
  "voice_id": "default_female"
}

Response:
{
  "audio_url": "/api/audio/abc123.mp3",
  "duration_ms": 2500
}
```

### 6.3 Search Endpoint

```http
GET /api/attractions?query=wineries&near=41.9,-80.8&limit=5

Response:
{
  "results": [Attraction[]],
  "total": 12,
  "query_expansion": "vineyards wine tasting"
}
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Project scaffold (React + Vite + Tailwind)
- [ ] Basic chat UI with mock responses
- [ ] Gemini API integration
- [ ] Static knowledge base (JSON files)
- [ ] Simple text-only responses

**Deliverable:** Demo-able chat interface with 20+ facts

### Phase 2: Intelligence (Weeks 3-4)
- [ ] Vector DB setup (Qdrant)
- [ ] RAG pipeline implementation
- [ ] Attraction data schema finalized
- [ ] Import first 50 attractions
- [ ] Multilingual query support

**Deliverable:** AI can answer specific questions about attractions

### Phase 3: Voice & Polish (Weeks 5-6)
- [ ] ElevenLabs TTS integration
- [ ] Language selection UI
- [ ] Basic avatar visualization
- [ ] Mobile responsive layout
- [ ] Analytics/logging

**Deliverable:** Full voice-enabled web app

### Phase 4: Kiosk Deployment (Weeks 7-8)
- [ ] Kiosk mode UI (fullscreen, attractor)
- [ ] Hardware procurement/setup
- [ ] Offline caching strategy
- [ ] Deployment at first location
- [ ] User feedback collection

**Deliverable:** Physical kiosk running at CVB or GOTL

### Phase 5: Scale & Enhance (Weeks 9-12)
- [ ] Additional kiosk locations
- [ ] Business owner portal
- [ ] Event calendar integration
- [ ] Interactive maps
- [ ] Analytics dashboard

**Deliverable:** Multi-location deployment with analytics

---

## 8. Security & Privacy

### 8.1 Data Handling
- No PII collection beyond optional feedback
- Session data retained for 30 days max
- Analytics aggregated/anonymized
- Business data publicly available anyway (directories)

### 8.2 API Security
- Rate limiting: 100 req/min per IP
- API keys for backend services (not exposed)
- HTTPS only
- CORS restricted to known origins

### 8.3 Content Safety
- LLM output filtering for inappropriate content
- Human-curated knowledge base (reduces hallucination)
- Clear "AI-generated" disclosure
- Emergency contacts verified with official sources

---

## 9. Testing Strategy

| Test Type | Coverage | Method |
|-----------|----------|--------|
| **Unit** | Components, utilities | Vitest |
| **Integration** | API endpoints, DB queries | Supertest |
| **E2E** | Critical user flows | Playwright |
| **Load** | Concurrent users | k6 |
| **User** | Real visitor feedback | In-person testing |

### 9.1 Test Scenarios

- "What wineries are open today?"
- "How do I get to the Smolen-Gulf Bridge?"
- "Restaurants near me" (with location)
- "What events this weekend?"
- "Tell me about the Barn Quilt Trail"
- "Emergency - where is the nearest hospital?"

---

## 10. Open Questions

1. Should we implement real-time availability (requires business integrations)?
2. Do we need booking/reservation capabilities (Stripe integration)?
3. Should the avatar be photorealistic or stylized/cartoon?
4. What's the target number of languages for launch?
5. Is offline mode a hard requirement or nice-to-have?
6. Do we need integration with existing CVB systems (CRM, etc)?

---

## 11. Appendix

### A. Glossary
- **RAG:** Retrieval-Augmented Generation
- **TTS:** Text-to-Speech
- **CVB:** Convention & Visitors Bureau
- **GOTL:** Geneva-on-the-Lake
- **POI:** Point of Interest
- **OSM:** OpenStreetMap

### B. Related Documents
- PHASE1-RESEARCH.md
- PHASE2-OUTREACH.md
- BUILD_CHECKLIST.md (derived from this spec)

### C. Change Log
| Date | Version | Changes |
|------|---------|---------|
| 2026-02-19 | 1.0 | Initial spec draft |

---

*End SPEC.md*
