# AI Docent Pro — SPEC.md

**Project:** ai-docent-pro  
**Version:** 1.0  
**Date:** February 19, 2026  
**Status:** Draft — Pending Museum Partnership

---

## 1. Overview

### Product Description
AI Docent Pro is a photo-to-narration system for small maritime museums. Visitors photograph artifacts with their smartphones and receive instant AI-generated audio narration, bringing exhibits to life without requiring on-site docents.

### Target User
- **Primary:** Ashtabula Maritime Museum (pilot)
- **Secondary:** Small to mid-size Great Lakes maritime museums
- **End Users:** Museum visitors (ages 8–80), self-guided tour preference

### Value Proposition
Transform any smartphone into a personal docent. Snap a photo, hear the story. Professional-quality audio narration at 1/100th the cost of traditional audio guide systems.

---

## 2. Goals & Success Metrics

### Goals
1. Enable 24/7 digital docent coverage for 20–50 museum artifacts
2. Reduce reliance on volunteer availability while enhancing visitor experience
3. Create replicable model for 50+ Great Lakes maritime museums
4. Generate sustainable SaaS revenue within 12 months

### Success Metrics (Pilot Phase)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Artifact photo recognition accuracy | >85% | Manual testing with 50 photos |
| Visitor engagement rate | >30% | Scans per visitor / total visitors |
| Audio completion rate | >60% | Full plays / starts |
| Curator approval of narrations | >90% | Verified/approved / total generated |
| Visitor satisfaction | >4.2/5 | Post-visit survey |

### Success Metrics (Scale Phase)
| Metric | Year 1 Target |
|--------|---------------|
| Museums onboarded | 5–10 |
| MRR (Monthly Recurring Revenue) | $2,000–$5,000 |
| Artifacts cataloged across all museums | 500+ |
| Total visitor interactions | 50,000+ |

---

## 3. User Stories

### Visitor Stories

**Story 1: Photo-to-Story**
> As a visitor, I want to photograph an interesting tool and immediately hear its history, so I can understand what I'm looking at without reading a placard.

**Acceptance Criteria:**
- Upload or capture photo in-app
- Receive narration within 3 seconds
- Audio plays automatically with transcript visible
- Option to replay or download

**Story 2: Language Accessibility**
> As an international visitor, I want to hear narrations in my native language, so I can fully appreciate the museum despite language barriers.

**Acceptance Criteria:**
- 5+ language options (EN, ES, FR, DE, ZH)
- Language auto-detect from browser or manual select
- Consistent voice quality across languages

**Story 3: Save for Later**
> As a visitor, I want to save artifacts I found interesting, so I can revisit the information after leaving the museum.

**Acceptance Criteria:**
- One-tap "Save" button
- Email or SMS link to personal collection
- No account required (token-based)

### Museum Staff Stories

**Story 4: Curator Review**
> As a curator, I want to review and approve AI-generated narrations before they go live, so I can ensure historical accuracy.

**Acceptance Criteria:**
- Draft/published workflow
- Edit narration text directly
- Regenerate audio after edits
- Bulk approve/reject interface

**Story 5: Analytics Dashboard**
> As a museum director, I want to see which artifacts generate the most interest, so I can optimize exhibit placement and marketing.

**Acceptance Criteria:**
- Daily/weekly/monthly scan counts per artifact
- Popular artifacts leaderboard
- Visitor demographic estimates (language, time spent)
- Export to CSV

**Story 6: Easy Setup**
> As a volunteer coordinator with limited tech skills, I want to add new artifacts without coding, so the system stays current as exhibits change.

**Acceptance Criteria:**
- Simple upload form (photo + description)
- AI auto-generates draft narration
- One-click publish after review

---

## 4. Technical Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser/PWA)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Photo Upload │  │ Audio Player │  │   Artifact Viewer    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         └─────────────────┴─────────────────────┘              │
│                           │                                     │
│                    [Service Worker] ← Offline Cache            │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────┼─────────────────────────────────────┐
│                    CLOUD FLARE / CDN                             │
│              (Static assets, cached narrations)                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                    FIREBASE / BACKEND                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Hosting    │  │   Storage    │  │     Firestore DB     │  │
│  │  (React App) │  │(Images/Audio)│  │(Artifacts/Narrations)│  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Auth       │  │   Functions  │  │      Analytics       │  │
│  │(Museum Admin)│  │(API Gateway) │  │   (User Behavior)    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
└─────────┼─────────────────┼─────────────────────────────────────┘
          │                 │
          │         ┌───────┴───────┐
          │         │  Cloud Functions │
          │         └───────┬───────┘
          │                 │
    ┌─────┴─────┐    ┌──────┴──────┐
    │ ElevenLabs│    │Gemini Vision │
    │    TTS    │    │  + Pro API   │
    └───────────┘    └─────────────┘
```

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React + Vite | Fast development, PWA-ready |
| Styling | CSS Modules | Scoped styles, no runtime overhead |
| Backend | Firebase | Serverless, scales to zero, auth included |
| Database | Firestore | Real-time updates, offline persistence |
| Storage | Firebase Storage | Images + audio files |
| Hosting | Firebase Hosting | CDN, SSL, custom domains |
| AI Vision | Gemini 1.5 Flash | Best cost/quality for image understanding |
| AI Text | Gemini 1.5 Pro | High-quality narration generation |
| TTS | ElevenLabs API | Best voice quality, multilingual |
| Auth | Firebase Auth | Email/password + Google OAuth |
| Analytics | Firebase Analytics + custom | Free tier, sufficient for MVP |

### API Integration Details

**Gemini Vision (Image Recognition)**
```javascript
// Endpoint: generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
// Cost: ~$0.0035 per image (128K context)
// Request:
{
  contents: [{
    parts: [
      { inline_data: { mime_type: "image/jpeg", data: base64Image } },
      { text: "Identify this maritime artifact. If it's in our database, return the artifact ID. If unknown, describe what you see and suggest what it might be." }
    ]
  }]
}
```

**Gemini Pro (Narration Generation)**
```javascript
// System prompt:
"You are a knowledgeable maritime museum docent. Write a compelling 120-word narration about the following artifact. Include historical context, interesting details, and a memorable fact. Tone: conversational but informative. Audience: general museum visitors including families."

// Cost: ~$0.001 per 1K tokens output
```

**ElevenLabs TTS**
```javascript
// Endpoint: api.elevenlabs.io/v1/text-to-speech/{voice_id}
// Voice: "Josh" (warm, professional) or "Rachel" (friendly, approachable)
// Cost: $5 per 1M characters (~$0.005 per narration)
// Caching: Generated audio stored in Firebase Storage to minimize costs
```

### Data Schema

**Artifacts Collection**
```javascript
{
  id: string,           // Auto-generated
  museumId: string,     // Reference to museums collection
  name: string,         // "Brass Harbor Master's Whistle"
  shortDesc: string,    // "19th century navigation tool"
  fullDesc: string,     // Detailed curator description
  category: enum,       // ['tool', 'vessel', 'document', 'image', 'equipment', 'other']
  era: string,          // "1850–1900"
  origin: string,       // "Ashtabula Harbor"
  images: [{
    url: string,
    isPrimary: boolean,
    uploadedAt: timestamp
  }],
  dimensions?: { h: number, w: number, d: number, unit: 'in'|'cm' },
  condition: string,    // Curator notes on physical state
  accessionNumber?: string, // Museum's internal ID
  location: string,     // "Gallery B, Case 3"
  isPublished: boolean,
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: string     // User ID
}
```

**Narrations Collection**
```javascript
{
  id: string,
  artifactId: string,   // Reference
  version: number,      // For versioning/rollback
  status: enum,         // ['draft', 'pending_review', 'approved', 'published', 'archived']
  
  // Content
  text: string,         // Generated narration
  wordCount: number,
  readingTimeSeconds: number,
  tone: enum,           // ['conversational', 'formal', 'child', 'scholarly']
  language: string,     // 'en', 'es', etc.
  
  // Audio
  audioUrl?: string,    // Firebase Storage URL
  audioDuration?: number,
  voiceId: string,      // ElevenLabs voice used
  
  // Metadata
  generatedBy: string,  // 'ai' or user ID
  reviewedBy?: string,  // Curator who approved
  reviewedAt?: timestamp,
  publishedAt?: timestamp,
  
  // Usage
  playCount: number,    // Analytics
  averageCompletionRate: number, // % who listen to end
  
  createdAt: timestamp
}
```

**Museums Collection**
```javascript
{
  id: string,
  name: string,
  slug: string,         // URL-friendly
  location: {
    address: string,
    city: string,
    state: string,
    zip: string,
    lat: number,
    lng: number
  },
  contact: {
    email: string,
    phone?: string,
    website?: string
  },
  plan: enum,           // ['pilot', 'starter', 'professional', 'enterprise']
  planExpiresAt?: timestamp,
  maxArtifacts: number,
  settings: {
    primaryColor: string,
    logoUrl?: string,
    languages: [string],
    defaultVoice: string,
    requireApproval: boolean
  },
  createdAt: timestamp,
  adminIds: [string]    // Firebase Auth UIDs
}
```

**Interactions Collection (Analytics)**
```javascript
{
  id: string,
  museumId: string,
  artifactId: string,
  narrationId: string,
  
  // Anonymous session tracking
  sessionId: string,    // Anonymous UUID
  userAgent: string,
  language: string,
  
  // Event details
  eventType: enum,      // ['photo_upload', 'artifact_view', 'audio_start', 'audio_complete', 'artifact_save']
  timestamp: timestamp,
  
  // For photo uploads
  recognitionConfidence?: number,
  recognizedArtifactId?: string,
  
  // For audio
  listenDuration?: number, // seconds
  completionRate?: number
}
```

---

## 5. User Interface Design

### Visitor Experience Flow

```
Landing (Museum-branded)
    ↓
┌─────────────────────────────────────────────┐
│  Welcome to [Museum Name]                   │
│                                             │
│  [📷 Take Photo]  or  [📁 Upload]          │
│                                             │
│  ── OR ──                                   │
│                                             │
│  Browse Artifacts: [Search/Grid]           │
└─────────────────────────────────────────────┘
    ↓ Photo captured/uploaded
    ↓
┌─────────────────────────────────────────────┐
│  Analyzing... 🔍                            │
│  (Gemini Vision processing)                 │
└─────────────────────────────────────────────┘
    ↓ Match found
    ↓
┌─────────────────────────────────────────────┐
│  [Artifact Image]                           │
│                                             │
│  Harbor Master's Whistle                    │
│  c. 1870 — Ashtabula Harbor                 │
│                                             │
│  ▶️ Play Audio (2:34)                       │
│  ────────────────────────                   │
│  [Transcript text...]                       │
│                                             │
│  [❤️ Save]  [↻ Replay]  [🔗 Share]         │
└─────────────────────────────────────────────┘
```

### Museum Admin Dashboard

**Dashboard Home**
- Quick stats: Total artifacts, monthly visitors, popular artifact
- Recent activity: Latest narrations, pending reviews
- Alerts: Low-confidence recognitions, failed generations

**Artifacts Manager**
- Grid view with search/filter
- Bulk upload (CSV + zip of images)
- Edit artifact: Photos, descriptions, narrations
- Publish/unpublish toggle

**Narration Editor**
- Side-by-side: Artifact photo + narration text
- Audio player with regenerate button
- Version history
- Approval workflow buttons

**Analytics View**
- Line chart: Daily interactions
- Bar chart: Top 10 artifacts
- Table: Recent interactions (anonymized)
- Export: CSV/JSON

---

## 6. Implementation Phases

### Phase A: Foundation (Weeks 1–2)
**Goal:** Working photo-to-narration for single artifact

**Tasks:**
- [ ] Project scaffolding (React + Vite + Firebase)
- [ ] Firebase project setup (auth, firestore, storage)
- [ ] Basic photo upload component
- [ ] Gemini Vision integration (image → artifact match)
- [ ] Gemini Pro narration generation
- [ ] ElevenLabs TTS integration
- [ ] Audio player component

**Deliverable:** Demo app with 3 hardcoded artifacts

### Phase B: Museum Admin (Weeks 3–4)
**Goal:** Curator can add and manage artifacts

**Tasks:**
- [ ] Firebase Auth (email/password)
- [ ] Admin dashboard shell
- [ ] Artifact CRUD forms
- [ ] Photo upload to Firebase Storage
- [ ] Draft/published workflow
- [ ] Narration editor with preview
- [ ] Basic analytics (view counts)

**Deliverable:** Admin portal with full artifact management

### Phase C: Visitor Experience (Weeks 5–6)
**Goal:** Polished public-facing experience

**Tasks:**
- [ ] Public landing page (museum-branded)
- [ ] Photo capture (camera API)
- [ ] Recognition results UI (confidence display)
- [ ] Audio player with controls
- [ ] Transcript display
- [ ] Save/share functionality
- [ ] PWA manifest + service worker

**Deliverable:** Production-ready visitor app

### Phase D: Scale & Refinement (Weeks 7–8)
**Goal:** Ready for museum pilot

**Tasks:**
- [ ] Multi-language support
- [ ] Offline caching
- [ ] Analytics dashboard
- [ ] Bulk import tools
- [ ] Documentation for museum staff
- [ ] Error handling & logging
- [ ] Performance optimization

**Deliverable:** Pilot-ready system with documentation

---

## 7. Cost Estimates

### Development Costs (One-Time)
| Item | Estimate |
|------|----------|
| Development time (8 weeks @ $0, internal) | $0 |
| Design assets (icons, illustrations) | $200–$500 |
| Domain + SSL | $50/year |
| **Total** | **$250–$550** |

### Operational Costs (Monthly at Scale)

**Small Museum (1K visitors/month, 100 artifacts)**
| Service | Usage | Cost |
|---------|-------|------|
| Firebase (Spark) | Within free tier | $0 |
| Gemini Vision | 500 images | $1.75 |
| Gemini Pro | 200K tokens | $0.20 |
| ElevenLabs | 50K chars | $0.25 |
| **Total** | | **~$2.20/mo** |

**Medium Museum (5K visitors/month, 500 artifacts)**
| Service | Usage | Cost |
|---------|-------|------|
| Firebase (Blaze) | Moderate usage | $20 |
| Gemini Vision | 2,500 images | $8.75 |
| Gemini Pro | 1M tokens | $1.00 |
| ElevenLabs | 250K chars | $1.25 |
| **Total** | | **~$31/mo** |

**Revenue Model vs. Costs:**
- Starter ($49/mo) → ~$2–$10 cost = 80–95% gross margin
- Professional ($99/mo) → ~$20–$40 cost = 60–80% gross margin

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Gemini misidentifies artifacts | Medium | High | Confidence threshold + human fallback |
| AI generates inaccurate history | Medium | Critical | Curator approval workflow required |
| Museum lacks WiFi/cell coverage | Medium | High | Offline caching + encourage museum WiFi |
| TTS costs exceed projections | Low | Medium | Cache all audio, use Web Speech fallback |
| Museums resistant to AI-generated content | Medium | High | Emphasize curator control, offer human narration option |
| Photo recognition fails for unusual angles | Medium | Medium | Multiple reference photos per artifact |
| User privacy concerns | Low | Medium | Anonymous sessions, no PII collection, clear policy |

---

## 9. Future Roadmap

### V2 Features (Post-Pilot)
- [ ] Augmented reality overlay (point camera, see labels)
- [ ] Social sharing with custom cards
- [ ] Visitor accounts + "my museum passport"
- [ ] School group features (teacher dashboard, quiz mode)
- [ ] Donation integration ("Support this exhibit")

### V3 Features (Scale)
- [ ] Multi-museum passport program
- [ ] AI chat follow-up ("Ask me more about this artifact")
- [ ] Gamification (badges for visiting all exhibits)
- [ ] Accessibility enhancements (sign language video, haptic feedback)
- [ ] Integration with museum POS/ticketing

---

## 10. Open Questions

1. Does Ashtabula Maritime Museum have high-quality artifact photos ready, or do we need to photograph?
2. What's the typical volunteer technical comfort level? (affects admin UI complexity)
3. Is there existing catalog data (spreadsheets, collection databases) to import?
4. Are there sensitive artifacts where photography should be restricted?
5. What's the museum's current annual technology spending? (pricing calibration)

---

*SPEC.md v1.0 — Ready for Phase 4 Implementation upon museum partnership confirmation.*
