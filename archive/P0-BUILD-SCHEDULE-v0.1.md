# New Ashtabula Initiative — P0 Build Schedule & Kickoff v0.1

**Date:** 2026-02-15  
**Status:** Ready for Michael review → Build phase  
**Goal:** Transform 3 complete specs into deployed, pitch-ready tools

---

## P0 Site Pipeline Overview

| Site | Spec Status | Checklists | Est. Build | Blockers |
|------|-------------|------------|------------|----------|
| **zoning-clerk** | ✅ Complete | 3A ✅, 3B ✅ | 6-9 hrs | None (3/6 docs sufficient) |
| **invest-ashtabula** | ✅ Complete | ❌ | 8-12 hrs | Site inventory data needed |
| **contractor-match** | ✅ Complete | ❌ | 10-14 hrs | None (MVP can use mock data) |

**Recommended sequence:** zoning-clerk → contractor-match → invest-ashtabula
- Rationale: zoning-clerk has full checklists; contractor-match is standalone; invest-ashtabula needs external data

---

## zoning-clerk — Build Phase Breakdown

### Phase 3A: Foundation (2-3 hours) — READY TO START
| Step | Task | Verification |
|------|------|--------------|
| 1 | `npx create-next-app@latest zoning-clerk --typescript --tailwind --app` | `npm run dev` loads at localhost:3000 |
| 2 | `npx shadcn@latest init` + add components (button, card, input, scroll-area) | UI renders without errors |
| 3 | `npm install ai @ai-sdk/openai` + Qdrant client | `npm list` shows all deps |
| 4 | Create `scripts/setup-qdrant.ts` — collection with 768-dim vectors | `ts-node scripts/setup-qdrant.ts` returns "Collection zoning_docs created" |
| 5 | Create `scripts/ingest-pdfs.ts` — PDF → text → chunks → embeddings | Run on 3 obtained PDFs, verify 100+ vectors in Qdrant |
| 6 | Create `app/api/chat/route.ts` — RAG retrieval + streaming response | `curl` test returns streamed response with sources |
| 7 | Create `app/page.tsx` — Chat UI with legal disclaimer modal | Disclaimer must be accepted before chat unlocks |

**Phase 3A Definition of Done:**  
✅ Local dev server running  
✅ Chat responds with RAG-augmented answers  
✅ All 3 PDFs ingested and queryable  
✅ Legal disclaimer enforced  

### Phase 3B: Advanced Features (3-4 hours) — START AFTER 3A COMPLETE
| Step | Task | Verification |
|------|------|--------------|
| 1 | Citation system — source metadata in response | Each response shows "Source: [filename], Page X" |
| 2 | Citation cards — clickable source preview | Click citation → sidebar shows excerpt |
| 3 | Permit Wizard component — 4-step state machine | Form validation, progress indicator, completion summary |
| 4 | Tabbed layout — Chat / Wizard / City Contacts | Smooth tab switching, deep-linkable |
| 5 | Pre-deployment config — env vars, error handling | `npm run build` succeeds, `vercel --prod` deploys |

**Phase 3B Definition of Done:**  
✅ Deployed to Vercel with custom subdomain  
✅ Permit Wizard functional end-to-end  
✅ Citations working with all 3 source PDFs  
✅ Mobile-responsive  

### Phase 3C: Polish (1-2 hours) — POST-DEPLOY
- Analytics (Vercel + simple event tracking)
- Feedback widget ("Was this helpful?")
- Mobile-specific UX refinements

---

## Quick-Start Commands (Copy/Paste)

```bash
# 1. Setup (run once)
cd ~/projects/new-ashtabula-initiative/websites
mkdir -p zoning-clerk && cd zoning-clerk

# 2. Project init
echo "my-app" | npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm

# 3. shadcn init
cd my-app
npx shadcn@latest init -d -y
npx shadcn add button card input scroll-area separator badge dialog

# 4. AI + Qdrant deps
npm install ai @ai-sdk/openai @qdrant/js-client-rest

# 5. PDF processing
npm install pdf-parse langchain @langchain/openai

# 6. Dev server
npm run dev
```

---

## Resource Files (Already Obtained)

Located in `projects/new-ashtabula-initiative/websites/zoning-clerk/resources/`:
- `historic-district-zoning-guide.pdf` (440KB)
- `city-welcome-info-packet.pdf` (718KB)
- `city-document.pdf` (544KB)

**Missing (non-blocking for MVP):**
- Part 11 Zoning Code (AM Legal protected)
- Permit application forms (need city contact)
- Fee schedule (need city contact)

**Strategy:** Build with 3 docs; add remaining via manual entry or city partnership.

---

## Deployment Checklist

Pre-deploy verification:
- [ ] All env vars in `.env.local` (OpenAI, Qdrant)
- [ ] `npm run build` passes with 0 errors
- [ ] Lighthouse score > 90 (Performance, Accessibility, SEO)
- [ ] Legal disclaimer tested (must accept to chat)
- [ ] Mobile tested (iPhone SE, Pixel 5)

Post-deploy:
- [ ] Vercel production domain configured
- [ ] Custom domain (optional): `zoning.ashtabulatools.com`
- [ ] Analytics dashboard confirmed receiving events
- [ ] Screenshot for pitch deck captured

---

## Pitch Deck Slide (Auto-generated from build)

Once deployed, capture:
```
Slide 1: Problem — "Finding zoning info in Ashtabula takes 3+ phone calls"
Slide 2: Solution — Screenshot of zoning-clerk chat interface
Slide 3: Impact — "Resident gets answers in 30 seconds vs. 3 days"
Slide 4: Expandable — invest-ashtabula + contractor-match in pipeline
Slide 5: Ask — "Partner with us to deploy city-wide"
```

---

## Next Actions (Requires Michael)

1. **Approve build start** — Reply "build zoning-clerk" and I'll execute Phase 3A
2. **Prioritize sequence** — Confirm order: zoning-clerk → contractor-match → invest-ashtabula
3. **Domain decision** — Custom subdomain now or stick with Vercel default?
4. **City outreach timing** — Start conversation with PCD dept now or after demo ready?

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Missing zoning docs limit accuracy | Build with available docs; mark uncertain answers; add manual override |
| OpenAI API costs | Use GPT-4o-mini for embeddings, GPT-4o-turbo for chat; monitor usage |
| City resistance | Lead with resident benefit, not "replacing staff"; offer hybrid pilot |
| Build scope creep | Strict MVP: chat + wizard only; defer Phase 3C until traction |

---

## Deliverable Produced By
Heartbeat rotation — 2026-02-15 07:26  
**Next heartbeat:** Begin build or shift to contractor-match Phase 3A checklist
