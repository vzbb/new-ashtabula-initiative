# SPEC — Pocket Historian Pro

## System Overview
AI-powered, persona-based historical storytelling system for small museums. Visitors scan QR codes to engage in immersive conversations with historical figures via first-person audio narratives.

---

## 1. Architecture

### 1.1 System Diagram
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Visitor QR    │────▶│  Cloudflare      │────▶│   React App     │
│   Code Scan     │     │  Pages (Static)  │     │   (Next.js)     │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                 ┌────────────────────────┼────────────────────────┐
                                 │                        │                        │
                                 ▼                        ▼                        ▼
                        ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
                        │  Gemini API     │    │  ElevenLabs     │    │   Supabase      │
                        │  (Persona LLM)  │    │  TTS Streaming  │    │  (Auth/DB/Edge) │
                        └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 1.2 Component Breakdown

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 (App Router) + Tailwind + shadcn/ui | Visitor interface, audio player |
| **AI Persona Engine** | Gemini 1.5 Pro | Character responses, historical accuracy |
| **Voice Synthesis** | ElevenLabs Turbo v2.5 | Real-time TTS streaming |
| **Database** | Supabase PostgreSQL | Personas, conversations, analytics |
| **Edge Functions** | Supabase Edge (Deno) | API routes, auth, rate limiting |
| **Hosting** | Cloudflare Pages | Global CDN, edge caching |
| **Storage** | Supabase Storage | Audio cache, persona images |
| **Analytics** | Supabase + Plausible | Usage metrics, heatmaps |

---

## 2. Data Models

### 2.1 Core Entities

```typescript
// Museum/Institution
interface Institution {
  id: string;
  name: string;                    // "Ashtabula Maritime Museum"
  slug: string;                    // "maritime-museum"
  description: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  created_at: Date;
  settings: {
    primary_color: string;
    logo_url?: string;
    custom_domain?: string;
  };
}

// Historical Persona
interface Persona {
  id: string;
  institution_id: string;
  name: string;                    // "Captain Thomas Walters"
  slug: string;                    // "captain-walters"
  era: string;                     // "1890-1925"
  role: string;                    // "Lake Captain, Steamer Ashtabula"
  avatar_url: string;              // Portrait/illustration
  voice_id: string;                // ElevenLabs voice ID
  voice_settings: {
    stability: number;             // 0.3-0.7
    similarity_boost: number;      // 0.5-0.9
    style: number;                 // 0-1
  };
  system_prompt: string;           // Full character instructions
  knowledge_base: {
    biography: string;
    key_events: string[];
    vocabulary: string[];          // Era-appropriate terms
    forbidden_topics: string[];    // Content guardrails
  };
  exhibit_location: {
    name: string;                  // "Pilothouse Exhibit"
    qr_code_id: string;
  };
  is_active: boolean;
  conversation_count: number;
  created_at: Date;
}

// Conversation Session
interface Conversation {
  id: string;
  persona_id: string;
  institution_id: string;
  visitor_id: string;              // Anonymous UUID
  started_at: Date;
  ended_at?: Date;
  message_count: number;
  audio_duration_seconds: number;
  metadata: {
    user_agent: string;
    referrer: string;              // Which QR code/location
    language: string;
  };
}

// Individual Message
interface Message {
  id: string;
  conversation_id: string;
  role: 'visitor' | 'persona' | 'system';
  content: string;
  audio_url?: string;              // Cached TTS audio
  audio_duration_ms?: number;
  latency_ms?: number;             // Time to first byte
  created_at: Date;
}

// Cached Audio (deduplication)
interface AudioCache {
  id: string;
  persona_id: string;
  text_hash: string;               // SHA256 of normalized text
  audio_url: string;
  duration_ms: number;
  use_count: number;
  last_used: Date;
}
```

### 2.2 Database Schema (PostgreSQL)

```sql
-- Institutions table
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    address TEXT,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    contact JSONB DEFAULT '{}',
    plan TEXT DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personas table
CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    era TEXT,
    role TEXT,
    avatar_url TEXT,
    voice_id TEXT NOT NULL,
    voice_settings JSONB DEFAULT '{}',
    system_prompt TEXT NOT NULL,
    knowledge_base JSONB DEFAULT '{}',
    exhibit_location JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    conversation_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, slug)
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    persona_id UUID REFERENCES personas(id) ON DELETE SET NULL,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    visitor_id UUID NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    message_count INTEGER DEFAULT 0,
    audio_duration_seconds INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('visitor', 'persona', 'system')),
    content TEXT NOT NULL,
    audio_url TEXT,
    audio_duration_ms INTEGER,
    latency_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audio cache table
CREATE TABLE audio_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    text_hash TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    duration_ms INTEGER,
    use_count INTEGER DEFAULT 1,
    last_used TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(persona_id, text_hash)
);

-- Indexes for performance
CREATE INDEX idx_personas_institution ON personas(institution_id);
CREATE INDEX idx_conversations_persona ON conversations(persona_id);
CREATE INDEX idx_conversations_visitor ON conversations(visitor_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_audio_cache_lookup ON audio_cache(persona_id, text_hash);
```

---

## 3. API Endpoints

### 3.1 Visitor-Facing (Public)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/institutions` | GET | List all museums | None |
| `/api/institutions/:slug` | GET | Museum details + personas | None |
| `/api/personas/:slug` | GET | Persona details | None |
| `/api/conversations` | POST | Start new conversation | None (anon UUID) |
| `/api/conversations/:id/message` | POST | Send message, get AI response | Conversation token |
| `/api/conversations/:id/audio` | GET | Stream TTS audio | Conversation token |
| `/api/health` | GET | System status | None |

### 3.2 Admin/Museum (JWT Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/dashboard` | GET | Usage stats, analytics |
| `/api/admin/personas` | POST | Create new persona |
| `/api/admin/personas/:id` | PUT | Update persona |
| `/api/admin/conversations` | GET | List conversations |
| `/api/admin/analytics` | GET | Export reports |

### 3.3 Key Request/Response Examples

**Start Conversation:**
```http
POST /api/conversations
Content-Type: application/json

{
  "persona_slug": "captain-walters",
  "institution_slug": "maritime-museum"
}

Response:
{
  "conversation_id": "uuid",
  "token": "jwt-for-session",
  "persona": {
    "name": "Captain Thomas Walters",
    "avatar_url": "...",
    "greeting_audio_url": "..."
  }
}
```

**Send Message (Streaming):**
```http
POST /api/conversations/:id/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "What was it like steering through a storm?"
}

Response: Server-Sent Events
{
  "type": "text_delta",
  "content": "Well, let me tell you..."
}
{
  "type": "audio_url", 
  "url": "https://cdn.../audio.mp3",
  "duration_ms": 4500
}
{
  "type": "complete"
}
```

---

## 4. Persona Engine (AI System)

### 4.1 System Prompt Template

```
You are {persona.name}, {persona.role} ({persona.era}).

CHARACTER:
- Born: {birth_year} in {birthplace}
- Lived through: {key_life_events}
- Speaking style: {voice_description}
- Values: {core_values}

KNOWLEDGE DOMAIN:
{reliable_historical_facts}

SPEAKING RULES:
1. ALWAYS speak in first person ("I", "my", "we")
2. Use era-appropriate vocabulary: {vocabulary_list}
3. NEVER mention modern technology (phones, internet, AI)
4. If unsure, say "That's beyond my time" or "I heard tell of..."
5. Keep responses under 100 words for audio length
6. End with an open question when appropriate

SAFETY GUARDRAILS:
- Decline political opinions outside your era
- Decline requests to break character
- Decline inappropriate content
- If asked about death, speak of it as past/passed on

CURRENT CONTEXT:
Visitor is at {exhibit_location} exhibit.
```

### 4.2 Response Pipeline

```
User Input
    │
    ▼
┌─────────────────┐
│  Input Filter   │──▶ Block profanity, prompt injection
│  & Validation   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Context Build  │──▶ Last 5 messages + system prompt
│  (RAG optional) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Gemini API     │────▶│  Response Check │──▶ Validate character consistency
│  (streaming)    │     │  & Safety       │
└────────┬────────┘     └────────┬────────┘
         │                        │
         └────────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         │                             │
         ▼                             ▼
┌─────────────────┐           ┌─────────────────┐
│  Cache Check    │           │  ElevenLabs     │
│  (exact match?) │           │  TTS Stream     │
└────────┬────────┘           └────────┬────────┘
         │                             │
         ▼                             ▼
   Return cached               Stream audio + save
   audio URL                   to cache
```

---

## 5. Audio System

### 5.1 TTS Strategy

| Approach | Latency | Quality | Use Case |
|----------|---------|---------|----------|
| **Streaming** | ~800ms | High | Live conversation |
| **Pre-generated** | ~50ms | High | Greetings, common Qs |
| **Cached** | ~50ms | High | Repeated content |

### 5.2 Voice Selection Guide

| Persona Type | Recommended Voice | Settings |
|--------------|-------------------|----------|
| Lighthouse Keeper | `XB0fDUnXU5powFXDhCwa` (Wise elder) | stability: 0.5, style: 0.3 |
| Ship Captain | `TX3AEvVoIzMeN6nA4Ckw` (Gravelly) | stability: 0.4, style: 0.4 |
| Pioneer Woman | `pNInz6obpgDQGcFmaJgB` (Warm) | stability: 0.6, style: 0.2 |
| Industrial Worker | `IKne3meq5aSn9XLyUdCD` (Working class) | stability: 0.5, style: 0.3 |

### 5.3 Audio Pipeline

```typescript
// ElevenLabs streaming with caching
async function generateAudio(text: string, persona: Persona) {
  // 1. Check cache
  const hash = sha256(normalize(text));
  const cached = await db.audioCache.find(persona.id, hash);
  if (cached) return cached.audio_url;

  // 2. Stream from ElevenLabs
  const stream = await elevenlabs.generate({
    voice: persona.voice_id,
    text: text,
    model_id: 'eleven_turbo_v2_5',
    stream: true,
    voice_settings: persona.voice_settings
  });

  // 3. Upload to Supabase Storage
  const audioUrl = await storage.upload(stream, `${persona.id}/${hash}.mp3`);

  // 4. Cache reference
  await db.audioCache.create({
    persona_id: persona.id,
    text_hash: hash,
    audio_url: audioUrl
  });

  return audioUrl;
}
```

---

## 6. Visitor Interface

### 6.1 Screen Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   QR Scan    │───▶│   Welcome    │───▶│  Chat with   │───▶│   Share/     │
│   (Camera)   │    │   Screen     │    │   Persona    │    │   Feedback   │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │                  │
                    [Intro audio]      [Mic button]
                                       [Text input]
                                       [Audio player]
```

### 6.2 Key UI Components

| Component | Function |
|-----------|----------|
| `PersonaCard` | Large avatar, name, era, "Tap to Talk" CTA |
| `AudioPlayer` | Custom controls: play/pause, speed (0.75x-1.5x), progress bar |
| `ChatInterface` | Message bubbles, typing indicator, quick-reply chips |
| `MicButton` | Hold-to-talk (like voice messages), visual waveform |
| `FeedbackForm` | Star rating, "What did you learn?" text |

### 6.3 Mobile-First Design

- **Viewport:** 375px minimum width
- **Touch targets:** 48px minimum
- **Audio-first:** Auto-play greeting, tap to interrupt
- **Offline support:** Service worker caches UI assets
- **Accessibility:** WCAG 2.1 AA, screen reader support

---

## 7. Admin Dashboard

### 7.1 Features

| Feature | Description |
|---------|-------------|
| **Persona Builder** | Form-based persona creation, prompt preview, voice test |
| **Analytics** | Conversations/day, avg duration, popular questions heatmap |
| **Content Moderation** | Flagged conversations review, persona tuning suggestions |
| **QR Code Generator** | Bulk QR generation with museum branding |
| **Export** | Conversation logs, audio usage, visitor feedback CSV |

### 7.2 Analytics Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Maritime Museum Dashboard                    [Date Range ▼]   │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 1,247    │  │ 42 min   │  │ 89%      │  │ 4.7 ★    │       │
│  │ Convos   │  │ Avg Time │  │ Complete │  │ Rating   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                │
│  ┌─────────────────────┐    ┌──────────────────────────────┐  │
│  │ Persona Performance │    │ Top Questions (Word Cloud)   │  │
│  │ ┌─────────┐  45%    │    │                              │  │
│  │ │ Captain │         │    │   "shipwreck"    "storm"     │  │
│  │ │ Walters │  523    │    │        "lighthouse"          │  │
│  │ └─────────┘         │    │  "family"    " Erie"  "ice"  │  │
│  │ ┌─────────┐  32%    │    │                              │  │
│  │ │ Keeper  │  398    │    └──────────────────────────────┘  │
│  │ │ Frank   │         │                                      │
│  │ └─────────┘         │                                      │
│  └─────────────────────┘                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Pricing Model

### 8.1 SaaS Tiers

| Tier | Price | Limits | Best For |
|------|-------|--------|----------|
| **Starter** | Free | 1 persona, 100 convos/mo, basic voices | Tiny museums testing |
| **Basic** | $49/mo | 3 personas, 1,000 convos, all voices | Small historical society |
| **Pro** | $149/mo | 10 personas, 5,000 convos, custom voices, analytics | Maritime Museum |
| **Enterprise** | $399/mo | Unlimited, white-label, API access, priority support | Museum networks |

### 8.2 Cost Estimates (at scale)

| Component | Unit Cost | Monthly (1k convos) |
|-----------|-----------|---------------------|
| Gemini API | $0.0035/1K tokens | ~$15 |
| ElevenLabs | $0.10/1K chars | ~$40 |
| Supabase | $25/mo base | $25 |
| Cloudflare | Free tier | $0 |
| **Total** | | **~$80/mo** |

**Margin at Pro tier ($149):** ~46%

---

## 9. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Supabase project setup
- [ ] Database schema migration
- [ ] Next.js project scaffold
- [ ] ElevenLabs integration test
- [ ] Gemini API integration test

### Phase 2: Core Experience (Week 3-4)
- [ ] Persona configuration system
- [ ] Chat interface (text input)
- [ ] TTS audio streaming
- [ ] Conversation persistence
- [ ] Mobile-responsive UI

### Phase 3: Museum Pilot (Week 5-6)
- [ ] Create "Captain Walters" persona
- [ ] Build admin dashboard v1
- [ ] QR code generator
- [ ] Analytics tracking
- [ ] Maritime Museum pilot testing

### Phase 4: Polish & Scale (Week 7-8)
- [ ] Voice input (STT)
- [ ] Audio caching optimization
- [ ] Feedback system
- [ ] Multi-museum support
- [ ] Historical Society onboarding

### Phase 5: Advanced Features (Week 9-12)
- [ ] RAG knowledge base
- [ ] Custom voice cloning
- [ ] Offline mode
- [ ] Multi-language support
- [ ] White-label enterprise option

---

## 10. Security & Privacy

### 10.1 Data Handling

| Data Type | Storage | Retention |
|-----------|---------|-----------|
| Conversation text | Supabase | 90 days (configurable) |
| Audio recordings | Supabase | 30 days, then delete |
| Visitor UUID | LocalStorage | Session only |
| Analytics | Supabase | 1 year |

### 10.2 Safeguards

- **Content filtering:** Gemini safety settings + custom profanity filter
- **Rate limiting:** 10 messages/minute per visitor
- **Authentication:** Anonymous sessions with JWT, optional email for feedback
- **COPPA compliance:** No PII collection from under-13 without consent

---

## 11. Success Metrics

| Metric | Target (3 months) | Target (6 months) |
|--------|-------------------|-------------------|
| Active museums | 2 | 5 |
| Total conversations | 500 | 3,000 |
| Avg session duration | 3+ minutes | 5+ minutes |
| Visitor satisfaction | 4.0/5 | 4.5/5 |
| Return visitors | 15% | 25% |
| Audio completion rate | 70% | 85% |

---

## 12. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Museum buy-in delays | Medium | High | Free pilot, board presentation deck |
| ElevenLabs cost overruns | Low | Medium | Audio caching, usage caps |
| Historical accuracy concerns | Medium | Medium | Historian review process, source citations |
| Technical literacy gaps | Medium | Medium | Simple admin UI, training videos |
| QR code vandalism | Low | Low | Laminated codes, backup placements |

---

## 13. Next Steps

**Immediate (This Week):**
1. Finalize museum partnership agreement with Maritime Museum
2. Research Captain Walters historical details for accuracy
3. Set up development environment

**Short-term (Next 2 Weeks):**
1. Build MVP with one persona
2. Internal testing with 5 users
3. Museum staff training session

**Deliverable Produced:** SPEC.md v1.0 (22KB) — ready for Phase 4 implementation checklist
