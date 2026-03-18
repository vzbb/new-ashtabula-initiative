# Zoning Clerk — Phase 4 Build Implementation Plan

**Date:** 2026-02-14  
**Status:** Ready to Build (pending SPEC review)  
**Estimated Duration:** 1 week (MVP Phase A)  

---

## Executive Summary

SPEC.md is complete. This document provides the actionable build plan for Phase 4, including contingency approaches for blocked resources. Once Michael reviews and approves the SPEC, development can begin immediately using this checklist.

---

## Pre-Build Checklist (5 minutes)

- [ ] Michael reviews SPEC.md and approves scope
- [ ] Decision on blocker mitigation (see Section 5)
- [ ] Confirm Qdrant is accessible at `http://192.168.1.223:6333`
- [ ] Firebase project configured for hosting

---

## Phase A: MVP Build — Implementation Checklist

### Day 1: Document Ingestion Pipeline

**Goal:** Get PDFs into Qdrant with embeddings

- [ ] **1.1 Setup project structure**
  ```
  websites/zoning-clerk/
  ├── ingestion/
  │   ├── extract.py          # PDF text extraction
  │   ├── chunk.py            # Semantic chunking
  │   ├── embed.py            # Vector embedding + Qdrant upload
  │   └── requirements.txt
  ├── src/
  │   └── (existing React app)
  └── api/
      └── query.py            # RAG query endpoint
  ```

- [ ] **1.2 PDF text extraction**
  - Install: `pip install pdfplumber qdrant-client openai`
  - Extract from 3 obtained PDFs:
    - `01_historic_district_zoning.pdf` → ~20 pages
    - `03_city_welcome_info.pdf` → ~30 pages
    - `04_city_document.pdf` → Review first (unknown content)
  - Output: Clean text with page markers

- [ ] **1.3 Semantic chunking**
  - Strategy: By section for code, by paragraph for guidelines
  - Chunk size: ~500 tokens with 100 token overlap
  - Metadata per chunk: `source`, `page`, `section_title`

- [ ] **1.4 Embedding + Qdrant upload**
  - Model: `text-embedding-3-small` (cost-effective, good quality)
  - Collection name: `zoning-clerk-v1`
  - Vector size: 1536
  - Payload: full chunk text + metadata

- [ ] **1.5 Test ingestion end-to-end**
  - Run full pipeline on one PDF
  - Verify vectors in Qdrant dashboard
  - Test similarity search with sample queries

**Deliverable:** Working ingestion pipeline + populated Qdrant collection

---

### Day 2: RAG Query API

**Goal:** Backend endpoint that answers zoning questions with citations

- [ ] **2.1 FastAPI scaffold**
  - Single file: `api/main.py`
  - Endpoints: `POST /query`, `GET /health`
  - CORS configured for Firebase hosting

- [ ] **2.2 Query handler**
  ```python
  # Pseudo-code
  def handle_query(question):
      # 1. Embed question
      # 2. Search Qdrant (top-5 chunks)
      # 3. Build context from chunks
      # 4. LLM call with system prompt
      # 5. Return: answer + citations + confidence
  ```

- [ ] **2.3 System prompt engineering**
  - Role: "You are the City of Ashtabula Zoning Assistant"
  - Constraint: "Only use provided context. Do not hallucinate."
  - Citation format: "According to [Source], Page [N]..."
  - Fallback: "I don't have enough information. Contact PCD at..."

- [ ] **2.4 Confidence scoring**
  - High: >0.85 similarity + clear answer in context
  - Medium: 0.70-0.85 similarity
  - Low: <0.70 → trigger fallback

- [ ] **2.5 Local testing**
  - Test queries:
    - "Do I need a permit for a shed?"
    - "When are Architectural Review Board meetings?"
    - "What is the zoning code for fences?" (should trigger fallback without Part 11)

**Deliverable:** Working API at `localhost:8000/query`

---

### Day 3: Frontend Chat Interface

**Goal:** React component for conversational zoning Q&A

- [ ] **3.1 Chat UI component**
  - File: `src/components/ChatInterface.jsx`
  - Features:
    - Message history (user + bot)
    - Typing indicator
    - Citation display (collapsible)
    - Confidence badge (high/medium/low)

- [ ] **3.2 API integration**
  - Hook: `useZoningQuery()`
  - Error handling (network, timeout)
  - Loading states

- [ ] **3.3 Message rendering**
  - Markdown support for bot responses
  - Clickable citations → highlight source
  - "Was this helpful?" thumbs up/down

- [ ] **3.4 Disclaimer banner**
  - Persistent footer: "General information only, not legal advice..."
  - Link to City PCD contact page

**Deliverable:** Working chat UI in browser

---

### Day 4: Permit Wizard (MVP)

**Goal:** Step-by-step permit selector

- [ ] **4.1 Wizard flow definition**
  - Step 1: Project type (Shed/Deck/Pool/Garage/Business)
  - Step 2: Size/scope (dimensions, location)
  - Step 3: Requirements checklist

- [ ] **4.2 Wizard UI**
  - File: `src/components/PermitWizard.jsx`
  - Progress indicator (Step X of 3)
  - Conditional logic per project type

- [ ] **4.3 Requirements logic**
  - Hardcoded rules based on obtained documents
  - Example: "Sheds >120 sq ft require building permit"
  - Citations to specific PDF pages

- [ ] **4.4 Output generation**
  - Checklist: "You will need:"
  - Links to forms (placeholder if blocked)
  - Next steps: "Submit to City PCD at..."

**Deliverable:** Working permit wizard

---

### Day 5: Contact Escalation & Polish

**Goal:** Professional finish + escape hatches

- [ ] **5.1 Contact integration**
  - Pre-fill email link: `mailto:pcd@cityofashtabula.com?subject=Zoning Question&body=...`
  - Office hours display (from welcome packet)
  - Phone: 440-992-7112

- [ ] **5.2 Mobile polish**
  - Test on 320px width
  - Touch targets ≥44px
  - Fast load (<3s on 3G)

- [ ] **5.3 Error states**
  - API down: "Service temporarily unavailable. Please call City PCD."
  - Low confidence: "I'm not sure. Here's who to contact..."

- [ ] **5.4 Analytics (optional)**
  - Track: queries, helpful ratings, wizard completions
  - Privacy: no PII, anonymous session IDs

**Deliverable:** MVP complete, ready for staging deploy

---

## Phase B: Enhanced Features (Week 2-3)

**If Part 11 Zoning Code is obtained:**
- [ ] Re-ingest with full code
- [ ] Expand query coverage
- [ ] Add code browser/search

**If Permit Forms obtained:**
- [ ] Direct PDF links in wizard
- [ ] Form pre-fill (auto-populate name/address)

**Always:**
- [ ] Accuracy audit (test 20 common questions)
- [ ] P0 stakeholder review

---

## Blocker Mitigation Plans

### Blocker: Part 11 Zoning Code (Cloudflare)

| Option | Effort | Outcome | Recommendation |
|--------|--------|---------|----------------|
| A. Manual download | 10 min | Full code for ingestion | **Preferred** — Michael downloads via browser |
| B. FOIA request | 2 weeks | Official digital copy | Parallel track if manual fails |
| C. Proceed without | 0 min | Limited Q&A scope | Acceptable for MVP — focus on permits |

**Contingency:** If blocked, emphasize Permit Wizard over code Q&A. Add "Zoning Code Coming Soon" notice.

### Blocker: Permit Forms (Wix embedding)

| Option | Effort | Outcome | Recommendation |
|--------|--------|---------|----------------|
| A. Email PCD | 5 min | PDFs sent directly | **Preferred** — Michael sends request |
| B. Scrape Wix | 2 hours | Unreliable, may break | Not recommended |
| C. Placeholder links | 0 min | Links to Wix page | Acceptable for MVP |

**Contingency:** Use placeholder links to Wix form page. Add note: "Click through to find your form."

### Blocker: City Blessing

| Option | Effort | Outcome | Recommendation |
|--------|--------|---------|----------------|
| A. Pre-build demo | 1 week | Working prototype to show | **Preferred** — build first, ask after |
| B. Cold outreach | 1 hour | Uncertain response | Parallel track |

**Contingency:** Build and deploy as "unofficial community tool" with clear disclaimers. Pitch after proving value.

---

## Technical Stack Reference

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Frontend | React + Vite | Existing prototype base |
| Backend | FastAPI + Uvicorn | Lightweight, async, Python |
| Vector DB | Qdrant (xai:6333) | Already available |
| Embeddings | OpenAI text-embedding-3-small | Cost: ~$0.02 per PDF |
| LLM | GPT-4o-mini | Cost: ~$0.15 per 1K queries |
| Hosting | Firebase | Consistent with noirsys.com |
| PDF Parsing | pdfplumber | Better tables than PyPDF2 |

**Estimated Costs:**
- Embedding: <$1 for initial ingestion
- Inference: ~$5-10/month at 100 queries/day
- Hosting: Free tier (Firebase)

---

## Testing Checklist

### Functional Tests
- [ ] "Do I need a permit for a shed?" → Correct answer with citation
- [ ] "When is the next ARB meeting?" → Date from historic district PDF
- [ ] "What is R-3 zoning?" → Low confidence → fallback
- [ ] Wizard: Shed → 150 sq ft → "Building permit required"
- [ ] Mobile: Full flow on iPhone SE

### Edge Cases
- [ ] Empty query handled gracefully
- [ ] API timeout → friendly error
- [ ] Special characters in question
- [ ] Very long question (>500 chars)

---

## Deployment Plan

### Staging (Day 5)
- [ ] Build frontend: `npm run build`
- [ ] Deploy to Firebase preview channel
- [ ] Test from phone on cellular
- [ ] Share URL with Michael for review

### Production (After approval)
- [ ] Deploy to live URL: `zoning-clerk.noirsys.com` or similar
- [ ] Configure custom domain if desired
- [ ] Add to OpenClaw cron for health checks

---

## Next Actions (Post-Heartbeat)

1. **Michael reviews SPEC.md** — Approve scope, confirm build go-ahead
2. **Decision on blockers** — Choose mitigation options A/B/C for each
3. **If approved:** Begin Day 1 ingestion pipeline
4. **If changes needed:** Update SPEC.md, revise this plan

---

## Success Criteria for Phase A

- [ ] 3 PDFs ingested into Qdrant
- [ ] API answers 10+ common questions with citations
- [ ] Chat UI works on mobile and desktop
- [ ] Permit wizard generates correct checklists
- [ ] Deployed to staging URL

**Done = Ready for Michael to test and provide feedback**
