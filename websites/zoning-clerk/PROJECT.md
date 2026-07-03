# PROJECT — Zoning Clerk

## Vision
An AI-powered zoning assistant that provides instant, accurate answers to resident zoning questions with citations to official code sections — reducing staff burden while improving public service.

## Desired Functionality (from CSV)
- **Zoning Clerk (RAG Chatbot):** Text-based agent that answers resident zoning questions with citations to PDF code sections.

## Current Functionality (observed)
- Single-page React UI with basic input fields.
- Uses Gemini API to generate a response based on user inputs.
- Output is shown on-screen only; no persistence or backend workflows.

## Gaps
- No real data integrations (zoning code, maps, permit systems).
- No persistence, intake routing, or audit trail.
- No operational integrations (escalation to PCD staff).
- Limited validation, multi-step flows, or admin tooling.
- No RAG implementation (responses not grounded in code).

## High‑Priority Improvements
1. **Implement RAG pipeline** — Vectorize Part 11 zoning code, retrieve relevant sections
2. **Add citations** — Link every answer to American Legal Publishing source
3. **Build escalation workflow** — Complex questions routed to PCD@cityofashtabula.com
4. **Add confidence scoring** — Low confidence → "I don't know" + escalate
5. **Create analytics dashboard** — Track common questions, accuracy, satisfaction

## Technical Stack (Proposed)
- **Frontend:** React + Vite
- **Vector DB:** Qdrant
- **Embeddings:** Gemini Embedding API
- **LLM:** Gemini 2.0 Flash
- **Hosting:** Vercel
- **Analytics:** Firebase or local

## Data Sources
- **Primary:** American Legal Publishing — Part 11 Zoning Code
- **Secondary:** Zoning map (GIS), permit applications, FAQ list from PCD
- **URL:** https://codelibrary.amlegal.com/codes/ashtabula/latest/ashtabula_oh/

## Business Model
- **Cost:** $20-70/month (API + hosting)
- **Value:** Save ~$8,100/year in staff time (16x ROI)
- **Pricing:** Free for City of Ashtabula (sponsored by Noirsys)

## Success Metrics
- Query volume: 100+/month
- Deflection rate: 50%+
- User satisfaction: 4.0/5.0
- Response accuracy: 95%+

## Assumptions
- Mapped to **Zoning Clerk (RAG Chatbot)** CSV entry.
- City of Ashtabula willing to partner on deployment.
- American Legal Publishing content can be accessed/scraped.
- PCD staff see value in reduced inquiry volume.

## Status
- **Phase 1:** ✅ Complete (2026-02-19)
- **Phase 2:** 🔄 Pending stakeholder outreach
- **Phase 3:** ⏳ Blocked
- **Phase 4:** ⏳ Blocked

## Documents
- [PHASE1-RESEARCH.md](./PHASE1-RESEARCH.md) — Market research, stakeholder mapping, architecture
- [DELIVERABLES.md](./DELIVERABLES.md) — Phase tracking and risk register

## Next Steps
1. Contact PCD Director for partnership discussion
2. Request zoning code export/permission
3. Set up Qdrant + begin vectorization
4. Build MVP with core code sections
