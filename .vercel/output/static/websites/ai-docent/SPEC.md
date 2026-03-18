# AI Docent — SPEC.md
**Version:** 1.0  
**Date:** February 17, 2026  
**Status:** Draft — Maritime Museum MVP  

---

## Overview

An AI-powered virtual docent for the Ashtabula Maritime & Surface Transportation Museum. Visitors use their phones to ask questions about exhibits, artifacts, and maritime history—getting instant, accurate responses based on the museum's collection.

**Target Users:**
- Casual visitors curious about artifacts
- Families with questions
- History enthusiasts seeking deep dives
- School groups (teacher mode)

---

## Core Features

### 1. Exhibit Chat Interface
**Purpose:** Primary Q&A interface for visitors

**UI:**
- Full-screen chat (mobile-optimized)
- Floating "Ask" button on exhibit pages
- Quick-question chips ("What is this?", "Tell me more", "How does it work?")
- Voice input option (accessibility)

**Capabilities:**
- Answer questions about any artifact
- Explain historical context
- Tell stories (shipwrecks, disasters, innovations)
- Compare items ("How is this different from...")
- Handle follow-up questions

---

### 2. Artifact Recognition
**Purpose:** Help visitors identify what they're looking at

**Input Methods:**
- Photo upload (user takes picture)
- Exhibit number input
- Description ("the big metal thing by the window")

**Output:**
- Artifact identification
- Key facts
- Related stories
- "See also" suggestions

---

### 3. Story Mode
**Purpose:** Narrative exploration for engagement

**Themes:**
- **Shipwreck Stories:** Titanic, Edmund Fitzgerald, local wrecks
- **Engineering Marvels:** Hulett unloaders, Fresnel lenses
- **Disaster & Survival:** 1876 train disaster
- **Daily Life:** Lighthouse keeper routines, sailor experiences

**Format:**
- Choose a theme → AI tells connected stories
- "Continue" or "Ask a question" at each point
- Image suggestions for related exhibits

---

### 4. Kids Mode
**Purpose:** Age-appropriate explanations

**Features:**
- Simpler language
- Interactive "Did you know?" facts
- Scavenger hunt integration ("Find the Hulett model, then ask me...")
- Quiz mode ("What did sailors use this for?")

---

### 5. Accessibility Features
**Purpose:** Inclusive experience

**Features:**
- Voice input (ask without typing)
- Text-to-speech responses
- High contrast mode
- Large text option
- Screen reader optimized

---

## Technical Architecture

### Option A: RAG-Based (Recommended)
**Stack:**
- Next.js + React frontend
- Vector database (Pinecone/Qdrant) for artifact knowledge
- OpenAI GPT-4o / Claude for responses
- Embedding model (text-embedding-3-small)

**Knowledge Base:**
- Artifact descriptions (curated from website, research)
- Historical documents (public domain)
- Shipwreck databases (Great Lakes Historical Society)
- Engineering explanations (Hulett mechanics, optics)

**Pros:**
- Accurate, cite sources
- Can be updated with new exhibits
- Handles specific Ashtabula content
- No hallucination risk on facts

**Cons:**
- Requires content curation (one-time effort)
- Vector DB costs (~$10-20/mo)

### Option B: General AI with Context
**Stack:**
- Next.js + React
- OpenAI GPT-4o with detailed system prompt
- No vector DB

**Pros:**
- Faster to deploy
- Lower cost
- Broad knowledge

**Cons:**
- May hallucinate specific Ashtabula facts
- Harder to verify accuracy
- No source citations

### Recommendation
**Start with Option A** for accuracy and credibility with a historical museum.

---

## Content Curation Plan

### Phase 1: Core Artifacts (Priority)

| Artifact | Content Needed | Source |
|----------|---------------|--------|
| **Hulett Unloader** | History, mechanics, significance, model details | Museum website, engineering docs |
| **Fresnel Lens** | Optics, lighthouse history, 1915-1995 service | Maritime websites, optics references |
| **Titanic Display** | Great Lakes connection, shipwreck details | Public shipwreck databases |
| **1876 Train Disaster** | Event details, casualties, aftermath | Historical records, news archives |
| **1914 Steel Hull Ship** | First electrically welded, significance | Engineering history |

### Phase 2: Extended Collection
- 25,000 item categorization (by theme)
- Railroad history deep dive
- Naval/Coast Guard items
- Harbor development timeline

### Phase 3: Interactive Elements
- "Ask the Lighthouse Keeper" persona
- "Engineer Explains" technical mode
- "Survivor Stories" first-person accounts

---

## Implementation Phases

### Phase 1: Basic Chat (6-8 hours)
- Landing page with museum branding
- Chat interface
- 5 core artifacts in knowledge base
- Basic Q&A functionality
- Mobile-responsive design

### Phase 2: Enhanced Features (4-5 hours)
- Artifact recognition (photo + exhibit number)
- Story mode (3-4 themes)
- Quick-question chips
- Voice input

### Phase 3: Kids & Accessibility (3-4 hours)
- Kids mode toggle
- Simplified explanations
- Scavenger hunt framework
- Accessibility features (TTS, high contrast)

### Phase 4: Content Expansion (4-6 hours)
- Expand to 20+ artifacts
- Historical timeline integration
- "Related exhibits" suggestions
- Teacher/school group mode

**Total:** ~18-24 hours for full MVP

---

## Sample Interactions

### Casual Visitor
**User:** "What's that big metal thing outside?"
**AI:** "That's a Hulett unloader bucket—the last surviving piece from Ashtabula's ore docks. These massive machines unloaded iron ore from Great Lakes freighters. Want to know how they worked, or see the working model inside?"

### History Enthusiast
**User:** "Tell me about the 1876 train disaster."
**AI:** "The Ashtabula Train Disaster of December 29, 1876, was one of the deadliest railroad accidents in U.S. history. The Lake Shore and Michigan Southern Railway's 'Pacific Express' was crossing the Ashtabula River bridge when the structure collapsed... [continues with details from diorama]"

### Family with Kids
**User:** [In Kids Mode] "What is the lighthouse lens?"
**AI:** "It's a giant glass puzzle that makes light super bright! This one helped ships see the Ashtabula lighthouse from really far away—like seeing a flashlight from across a huge lake. Want to know how glass can make light stronger?"

---

## Success Metrics

- **Engagement:** Average 5+ questions per visitor
- **Accuracy:** >95% factual accuracy (curated content)
- **Satisfaction:** Positive feedback on helpfulness
- **Accessibility:** All features work on mobile
- **Coverage:** 20+ artifacts explained in depth

---

## Data Sources (Public Only)

- **Ashtabula Maritime Museum website** (ashtabulamaritime.org)
- **Great Lakes Historical Society** databases
- **Lighthouse preservation societies** (Fresnel lens info)
- **Engineering history resources** (Hulett mechanics)
- **Shipwreck databases** (public records)
- **Historical newspapers** (train disaster accounts)

---

## Constraints

- **No stakeholder contact** until noirsys.com approved
- **Public data only** for content curation
- **Accuracy priority:** RAG-based for factual reliability
- **Privacy:** No visitor data stored
- **Accessibility:** WCAG 2.1 AA compliance

---

## Next Steps

1. [ ] Curate content for 5 core artifacts
2. [ ] Set up vector database
3. [ ] Build basic chat interface
4. [ ] Test with sample questions
5. [ ] Deploy for museum review

---

**Status:** SPEC complete, ready for Phase 1 implementation when approved.