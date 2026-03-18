# Engineers Assistant — Technical Specification (SPEC.md)
**Project:** engineers-assistant  
**MVP Number:** #21  
**Date:** 2026-02-19  
**Status:** Phase 3 Complete → Ready for Phase 4 (Build Checklist)

---

## 1. Executive Summary

### Purpose
A free, AI-powered conversational tool that helps Ashtabula homeowners and contractors navigate engineering permits, zoning requirements, and property improvement questions across City and County jurisdictions.

### Problem Statement
Residents face confusion navigating the overlap between:
- City Engineering (streets, sewers, curbs, sidewalks)
- County Building Department (building permits, inspections)
- City Zoning (setbacks, zoning permits)

Current process requires calling multiple offices during business hours, creating bottlenecks and frustration.

### Solution
24/7 conversational AI that provides accurate, jurisdiction-aware guidance with clear escalation paths to human officials when needed.

---

## 2. Technical Architecture

### 2.1 Stack Overview
| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 14 (App Router) | SEO-friendly, fast, PWA-ready |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI development, accessible |
| **Backend** | Next.js API Routes | Simplified deployment, type safety |
| **Database** | Supabase (PostgreSQL) | Auth, real-time, generous free tier |
| **Vector Store** | Pinecone | Fast RAG retrieval, metadata filtering |
| **AI/LLM** | OpenAI GPT-4o | Reliable reasoning, function calling |
| **Embeddings** | OpenAI text-embedding-3-small | Cost-effective, high quality |
| **Hosting** | Vercel | Edge deployment, CI/CD, free tier |
| **Monitoring** | Vercel Analytics + custom events | Usage tracking, improvement insights |

### 2.2 System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Chat Window  │  │ Topic Browser│  │ Permit Wizard        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APPLICATION                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ API Routes   │  │ Auth (Supa)  │  │ RAG Pipeline         │  │
│  │ /api/chat    │  │ /auth/*      │  │ /api/rag             │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└────────────────────┬────────────────────┬───────────────────────┘
                     │                    │
                     ▼                    ▼
┌────────────────────────┐      ┌─────────────────────────────┐
│      SUPABASE          │      │        PINECONE             │
│  ┌──────────────────┐  │      │  ┌─────────────────────┐   │
│  │ PostgreSQL       │  │      │  │ Vector Index        │   │
│  │ - User sessions  │  │      │  │ - Code chunks       │   │
│  │ - Feedback       │  │      │  │ - Q&A pairs         │   │
│  │ - Analytics      │  │      │  │ - Process docs      │   │
│  └──────────────────┘  │      │  └─────────────────────┘   │
└────────────────────────┘      └─────────────────────────────┘
```

### 2.3 Data Flow

```
User Question
     │
     ▼
┌─────────────────────────────────────┐
│ 1. Query Classification             │
│    - Jurisdiction detection         │
│    - Topic classification           │
│    - Complexity scoring             │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 2. RAG Retrieval                    │
│    - Semantic search (Pinecone)     │
│    - Metadata filtering             │
│    - Top-k chunk selection          │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 3. LLM Generation                   │
│    - Context assembly               │
│    - GPT-4o response generation     │
│    - Confidence scoring             │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 4. Post-Processing                  │
│    - Disclaimer injection           │
│    - Contact link insertion         │
│    - Confidence-based warnings      │
└─────────────┬───────────────────────┘
              │
              ▼
         Response to User
```

---

## 3. Feature Specifications

### 3.1 Core Features (MVP)

#### F1: Conversational AI Chat
| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Primary interaction mode for Q&A |
| **Input** | Natural language questions |
| **Output** | Markdown-formatted responses with citations |
| **Context** | 5-message conversation history |
| **Response Time** | <3 seconds (target) |
| **Confidence Threshold** | <0.7 = show "I'm not certain" warning |

#### F2: Topic Browser
| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Browse common questions by category |
| **Categories** | Driveways, Decks/Sheds, Drainage, Sidewalks, Sewer, Excavation |
| **Display** | Card grid with expandable Q&A |
| **Search** | Filter by keyword |

#### F3: Permit Wizard
| Attribute | Specification |
|------------|---------------|
| **Purpose** | Step-by-step permit requirement checker |
| **Flow** | 3-5 question decision tree |
| **Output** | Permit checklist with contacts |
| **Projects** | Driveway, Deck, Shed, Fence, Pool, Demolition |

#### F4: Contact Directory
| Attribute | Specification |
|-----------|---------------|
| **Purpose** | One-tap access to all relevant offices |
| **Features** | Click-to-call, email links, hours display |
| **Contacts** | City Eng, County Building, Zoning, OHIO 811 |

#### F5: Feedback System
| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Improve accuracy through user feedback |
| **Input** | Thumbs up/down + optional text |
| **Storage** | Supabase with session correlation |

### 3.2 Future Features (Post-MVP)

- **Document Upload**: Users upload permit docs for AI review
- **Project Tracker**: Save and track multiple permit projects
- **Notification**: Reminders for inspections, expirations
- **Spanish Support**: Full Spanish language interface
- **Contractor Directory**: Verified local contractor listings

---

## 4. Data Models

### 4.1 Database Schema (Supabase)

```sql
-- User sessions (anonymous + authenticated)
create table sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp default now(),
  user_agent text,
  ip_hash text, -- hashed for privacy
  is_pro boolean default false
);

-- Chat messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id),
  role text check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp default now(),
  confidence_score float,
  sources jsonb -- array of cited sources
);

-- User feedback
create table feedback (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id),
  is_helpful boolean,
  comment text,
  created_at timestamp default now()
);

-- Analytics events
create table events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id),
  event_type text, -- 'page_view', 'chat_start', 'permit_wizard_complete', etc.
  metadata jsonb,
  created_at timestamp default now()
);
```

### 4.2 Vector Store Schema (Pinecone)

```
Index: engineers-assistant-kb

Vector Structure:
{
  id: "chunk-001",
  values: [1536-dim embedding],
  metadata: {
    source: "city-code-ch1109",
    category: "driveways",
    jurisdiction: "city-engineering",
    title: "Curb Cut Requirements",
    content: "...",
    url: "..."
  }
}

Namespaces:
- city-code: City of Ashtabula ordinances
- county-processes: County Building procedures
- faq: Common Q&A pairs
- contacts: Contact information
```

---

## 5. UI/UX Specifications

### 5.1 Design Principles
- **Mobile-first**: 70%+ of users will be on mobile
- **Clear hierarchy**: Jurisdiction badges (City/County/Zoning)
- **Trust signals**: Confidence indicators, source citations, disclaimers
- **Speed**: Skeleton loaders, progressive enhancement

### 5.2 Key Screens

#### Home Screen
```
┌─────────────────────────────┐
│  🏗️ Engineers Assistant     │
│  Ask about permits & codes  │
├─────────────────────────────┤
│  [🔍 Ask a question...]     │
├─────────────────────────────┤
│  Browse Topics:             │
│  [Driveways] [Decks]        │
│  [Drainage] [Sewer]         │
│  [Sidewalks] [More...]      │
├─────────────────────────────┤
│  🧭 Permit Wizard           │
│  "What permits do I need?"  │
├─────────────────────────────┤
│  📞 Contact Directory       │
└─────────────────────────────┘
```

#### Chat Interface
```
┌─────────────────────────────┐
│  ← Engineers Assistant       │
├─────────────────────────────┤
│  🏛️ City Engineering         │
│  For driveway work that...   │
│  [Sources: City Code 1109]   │
├─────────────────────────────┤
│  ⚠️ This guidance is for...  │
├─────────────────────────────┤
│  [Type your question...] [➤]│
└─────────────────────────────┘
```

### 5.3 Component Library
- Use **shadcn/ui** base components
- Custom components:
  - `JurisdictionBadge`: City | County | Zoning
  - `ConfidenceIndicator`: High | Medium | Low certainty
  - `SourceCitation`: Expandable source reference
  - `ContactCard`: Click-to-call contact display
  - `PermitChecklist`: Checkbox list for permits needed

---

## 6. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Project setup (Next.js + Tailwind + shadcn)
- [ ] Supabase project creation
- [ ] Pinecone index setup
- [ ] Basic layout and navigation
- [ ] Deploy to Vercel

### Phase 2: Core Chat (Week 2)
- [ ] Knowledge base document structure
- [ ] Document ingestion pipeline
- [ ] RAG retrieval API endpoint
- [ ] Chat UI components
- [ ] Basic conversation flow

### Phase 3: Features (Week 3)
- [ ] Topic browser page
- [ ] Permit wizard decision trees
- [ ] Contact directory
- [ ] Feedback system
- [ ] Analytics instrumentation

### Phase 4: Polish (Week 4)
- [ ] Mobile responsiveness pass
- [ ] Performance optimization
- [ ] Error handling & fallbacks
- [ ] Disclaimer and legal review
- [ ] User testing (5-10 homeowners)

### Phase 5: Launch (Week 5)
- [ ] Final content review
- [ ] SEO meta tags
- [ ] Social sharing preview
- [ ] Soft launch (friends/family)
- [ ] Public announcement

---

## 7. API Specifications

### 7.1 Chat Endpoint
```
POST /api/chat

Request:
{
  "message": "Do I need a permit for a deck?",
  "sessionId": "uuid",
  "history": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ]
}

Response:
{
  "response": "Based on Ashtabula County requirements...",
  "confidence": 0.85,
  "sources": [
    {"title": "Deck Permit Requirements", "url": "..."}
  ],
  "jurisdiction": "county-building",
  "disclaimer": "Always verify with..."
}
```

### 7.2 Permit Wizard Endpoint
```
POST /api/wizard

Request:
{
  "projectType": "deck",
  "answers": {
    "height": "over-30in",
    "attachment": "attached-to-house"
  }
}

Response:
{
  "permitsRequired": [
    {
      "type": "building-permit",
      "authority": "Ashtabula County Building",
      "description": "Required for decks over 30"...",
      "estimatedCost": "$150-300",
      "timeline": "5-10 business days"
    }
  ],
  "nextSteps": [
    "Call County Building at (440) 576-3737",
    "Prepare site plans"
  ]
}
```

---

## 8. Security & Privacy

### 8.1 Data Handling
- No PII collection (anonymous sessions)
- IP addresses hashed
- Chat history retained for 90 days max
- No user accounts required

### 8.2 Content Safety
- OpenAI moderation API on all outputs
- Blocked topics: legal advice, emergency services
- Escalation prompts for complex situations

### 8.3 Legal
- Prominent disclaimer: "This tool provides general guidance only. Always verify with City/County officials."
- No liability for incorrect AI responses
- Clear attribution of information sources

---

## 9. Success Metrics

### Launch Targets (Month 1)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Unique Users | 100+ | Vercel Analytics |
| Questions Answered | 300+ | messages table |
| Avg Session Duration | 2+ min | Vercel Analytics |
| Helpful Rating | 70%+ | feedback table |

### Growth Targets (Month 6)
| Metric | Target |
|--------|--------|
| Monthly Active Users | 500+ |
| Return Users | 50%+ |
| City Endorsement | Secured |
| Call Reduction (City Eng) | 20%+ (via survey) |

---

## 10. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Incorrect AI advice | Confidence thresholds, disclaimers, escalation prompts |
| City opposition | Position as complementary, seek partnership |
| Low adoption | Library kiosk promotion, City website link, word of mouth |
| Maintenance burden | Simple KB structure, annual code review schedule |

---

## 11. Open Questions

1. Will City/County provide digital copies of forms/fee schedules?
2. Is there appetite for future contractor referral features?
3. Should we prioritize Spanish translation for MVP or post-MVP?
4. Any liability concerns from City legal counsel?

---

**Document Status:** Phase 3 Complete  
**File Location:** `websites/engineers-assistant/SPEC.md`  
**Word Count:** ~2,800 words  
**Next Phase:** Phase 4 — Build Checklist
