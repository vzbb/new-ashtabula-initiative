# Zoning Clerk — SPEC.md
## Phase 3: Build Blueprint

**Date:** 2026-02-15  
**Status:** Draft — Ready for Review  
**Based on:** Phase 1 Research + Phase 2 Partial Procurement

---

## 1. Executive Summary

**Product:** A RAG-based zoning assistant for City of Ashtabula residents  
**Goal:** Reduce friction in zoning/permitting processes via conversational interface with citations  
**Target Users:** Residents seeking permits, contractors, business owners  
**Key Differentiator:** Citation-backed answers from official city documents (not generic LLM responses)

---

## 2. Core Functionality

### 2.1 Primary Features (MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Zoning Q&A** | Answer questions about zoning requirements with citations to code sections | P0 |
| **Permit Wizard** | Guide users through permit selection via conversational flow | P0 |
| **Historic District Info** | Explain Architectural Review Board process with official citations | P0 |
| **Contact Integration** | Route complex questions to PCD@cityofashtabula.com | P1 |
| **Form Access** | Link to relevant permit PDFs (when available) | P1 |

### 2.2 Feature Details

#### Zoning Q&A (P0)
- Accept natural language questions about:
  - "Do I need a permit for a shed?"
  - "What are the setback requirements?"
  - "Can I run a business from my home?"
- Return structured responses with:
  - Direct answer
  - Citation (document + section reference)
  - Confidence indicator
  - Disclaimer: "This is general information, not legal advice"
- Handle unknowns gracefully: "I don't have that specific information. Contact PCD at (440) 992-7125"

#### Permit Wizard (P0)
- Conversational flow to identify permit type:
  1. "What type of project are you working on?"
  2. Branch based on response (residential/commercial, new construction/renovation)
  3. Ask clarifying questions (size, location, historic district?)
  4. Output: Required permits, next steps, contact info

#### Historic District Info (P0)
- Specific flow for Historic District questions
- Explain Certificate of Appropriateness process
- Link to Architectural Review Board procedures
- Citations from obtained Historic District Zoning Guide

---

## 3. Data Sources & RAG Architecture

### 3.1 Available Documents (Ingested)

| Document | Content | RAG Value |
|----------|---------|-----------|
| `01_historic_district_zoning.pdf` | Architectural Review Board procedures | High — specific process steps |
| `03_city_welcome_info.pdf` | General city info, contacts | Medium — voice, general procedures |
| `04_city_document.pdf` | TBD (needs review) | Unknown |

### 3.2 Pending Documents (Placeholder Architecture)

| Document | Status | Impact if Missing |
|----------|--------|-------------------|
| Part 11 Zoning Code | Cloudflare blocked | Cannot answer specific code questions |
| Permit Forms | Links not found | Cannot link to forms |
| Fee Schedule | Requires contact | Cannot provide cost estimates |

### 3.3 RAG Pipeline

```
User Query → Embedding → Qdrant Search (xai:6333) → 
Top-K Chunks → Context Assembly → LLM Response → 
Citation Extraction → Formatted Output
```

**Chunking Strategy:**
- Documents split by section headers
- Metadata: source file, page number, section title
- Overlap: 100 tokens for context continuity

**Citation Format:**
> According to the [Historic District Zoning Guide, Section 1115.03](#), alterations to exterior features require...

---

## 4. UI/UX Specifications

### 4.1 Visual Design

**Color Palette (Municipal Professional)**
- Primary: `#1e40af` (Government Blue)
- Secondary: `#64748b` (Slate Gray)
- Accent: `#059669` (Success Green for available permits)
- Warning: `#d97706` (Amber for complex processes)
- Background: `#f8fafc` (Light slate)
- Surface: `#ffffff` (White cards)

**Typography**
- Headings: Inter or system-ui, semibold
- Body: Inter or system-ui, regular
- Monospace: For citations/code references

### 4.2 Layout Structure

```
┌─────────────────────────────────────────┐
│  🏛️ Ashtabula Zoning Assistant          │
│  Get answers about permits & zoning     │
├─────────────────────────────────────────┤
│                                         │
│  [Chat Message History]                 │
│  • User: "Do I need a permit..."        │
│  • Bot: "Yes, for sheds over..."        │
│    [Citation: Zoning Code §1105]        │
│                                         │
├─────────────────────────────────────────┤
│  [Quick Questions]                      │
│  [Shed permit?] [Pool permit?]          │
│  [Historic district?] [Contact PCD]     │
├─────────────────────────────────────────┤
│  [Type your question...] [Send]         │
├─────────────────────────────────────────┤
│  ⚠️ General information only. For       │
│     binding decisions, contact PCD.     │
└─────────────────────────────────────────┘
```

### 4.3 Key Screens

#### Welcome Screen
- Brief intro: "Ask about zoning, permits, or historic district requirements"
- 4 quick-action buttons for common questions
- "Start chat" primary CTA

#### Chat Interface
- Message bubbles (user right, bot left)
- Citations as subtle links under bot responses
- "Was this helpful?" feedback thumbs
- "Contact PCD" fallback for unanswerable questions

#### Citation Modal
- Click citation → slide-over with:
  - Full quoted text
  - Source document
  - Page/section reference
  - "View original PDF" link (if available)

---

## 5. Technical Stack

### 5.1 Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui or Radix primitives
- **Icons:** Lucide React
- **Chat:** Vercel AI SDK or custom WebSocket

### 5.2 Backend/API
- **Runtime:** Next.js API Routes (Edge preferred)
- **LLM:** OpenAI GPT-4o-mini or local via xai
- **Embeddings:** OpenAI text-embedding-3-small or local
- **Vector DB:** Qdrant (already running at xai:6333)
- **Document Processing:** LangChain or LlamaIndex

### 5.3 Data Pipeline
- **PDF Processing:** pdf-parse or PyPDF2 (if Python service)
- **Chunking:** RecursiveCharacterTextSplitter
- **Embedding Generation:** Batch process on document update
- **Metadata Tracking:** Source file, section, page

### 5.4 Deployment
- **Hosting:** Vercel or Firebase (consistent with other sites)
- **Domain:** TBD (zoning.ashtabula.city or similar)
- **Analytics:** Plausible or Vercel Analytics

---

## 6. Content Requirements

### 6.1 Static Content

**Welcome Messages:**
- "Welcome to the Ashtabula Zoning Assistant. I can help with questions about permits, zoning requirements, and historic district rules."
- "What would you like to know?"

**Quick Question Buttons:**
1. "Do I need a permit for a shed?"
2. "What is the historic district process?"
3. "How do I contact the zoning office?"
4. "What permits do I need for a pool?"

**Disclaimer (Footer):**
> This assistant provides general information based on publicly available city documents. For binding zoning decisions, permit applications, or legal advice, contact the Planning & Community Development office at (440) 992-7125 or PCD@cityofashtabula.com.

### 6.2 Fallback Responses

**Unknown Question:**
> I don't have specific information about that in my current documents. For accurate guidance, please contact the Planning & Community Development office:
> • Phone: (440) 992-7125
> • Email: PCD@cityofashtabula.com
> • Address: 4717 Main Avenue, Ashtabula, OH 44004

**Pending Document Reference:**
> I have limited information about [topic] until I receive the complete zoning code. The PCD office can provide the most current details.

---

## 7. Integration Points

### 7.1 Email Integration (P1)
- "Contact PCD" button opens mailto:PCD@cityofashtabula.com
- Optional: Pre-fill subject with conversation context
- Future: Form submission API if city approves

### 7.2 Analytics (P2)
- Track: Popular questions, unanswered queries, user satisfaction
- Goal: Identify document gaps for procurement

### 7.3 Future Integrations
- Permit status API (if city has one)
- Online form submission (if city approves)
- SMS/phone bot via Twilio

---

## 8. Risk Mitigation

### 8.1 Legal Risks
- ✅ Clear disclaimer on every page
- ✅ No "approvals" or binding decisions
- ✅ Citations to official sources
- ✅ Fallback to human contact for edge cases

### 8.2 Accuracy Risks
- ✅ RAG architecture reduces hallucinations
- ✅ Citations allow user verification
- ✅ Limited to ingested documents only
- ✅ Regular update process (see §9)

### 8.3 Maintenance Risks
- ✅ Simple document update process (re-chunk + re-embed)
- ✅ Version tracking for document changes
- ✅ Clear documentation for handoff

---

## 9. Document Update Protocol

When new documents are obtained (zoning code, forms, etc.):

1. **Add to `/resources/` folder**
2. **Run ingestion script:**
   ```bash
   npm run ingest-documents
   # or
   python scripts/ingest.py
   ```
3. **Verify in Qdrant:** Check embeddings and metadata
4. **Update SPEC.md:** Mark document as available
5. **Test queries:** Verify new information is retrieved

---

## 10. Development Phases

### Phase 3A: Foundation (2-3 hours)
- [ ] Scaffold Next.js project with shadcn/ui
- [ ] Set up Qdrant connection
- [ ] Implement document ingestion pipeline
- [ ] Create basic chat UI

### Phase 3B: RAG Integration (2-3 hours)
- [ ] Implement embedding + search
- [ ] Build LLM prompt with context
- [ ] Add citation extraction/formatting
- [ ] Ingest 3 available documents

### Phase 3C: Polish (2-3 hours)
- [ ] Add quick question buttons
- [ ] Implement citation modals
- [ ] Add disclaimer/footer
- [ ] Mobile responsiveness
- [ ] Error handling & fallbacks

### Phase 4: Deploy & Pitch
- [ ] Deploy to live URL
- [ ] Create PITCH.md
- [ ] Contact PCD with demo

---

## 11. Open Questions

1. **Should we proceed without Part 11 Zoning Code?**
   - Current recommendation: Yes — launch with historic district info + general Q&A, add code when obtained

2. **Domain preference?**
   - Options: zoning.ashtabula.city, ashtabula-zoning.com, ashtabulazoning.org
   - Suggestion: Keep under noirsys.com subdomain initially, migrate if city adopts

3. **LLM hosting?**
   - Option A: OpenAI API (fastest, external)
   - Option B: Local via xai (private, requires setup)
   - Recommendation: Start with OpenAI for speed, migrate to local if needed

4. **City partnership approach?**
   - Soft launch as "demo/prototype"
   - Present to PCD with "already built, seeking partnership"
   - Emphasize: free tool, reduces phone calls, improves access

---

## 12. Resources Checklist

| Resource | Status | Blocking? |
|----------|--------|-----------|
| Historic District Guide | ✅ Ingested | No |
| City Welcome Info | ✅ Ingested | No |
| City Document (04) | ⏳ Review needed | No |
| Part 11 Zoning Code | ❌ Blocked | Partial — limits Q&A depth |
| Permit Forms | ❌ Not found | Partial — limits permit wizard |
| Fee Schedule | ❌ Not obtained | Partial — limits cost info |

**Proceed with build:** Yes — sufficient for MVP with clear documentation of limitations.

---

## Next Action

**Ready for:** Phase 3A — Scaffold project and begin foundation work  
**Estimated Total Build Time:** 6-9 hours across 3 sub-phases  
**Blockers:** None for MVP (enhancements pending procurement)

---

*SPEC Version: 0.1*  
*Last Updated: 2026-02-15*  
*Next Review: Post-scaffold (Phase 3A complete)*
