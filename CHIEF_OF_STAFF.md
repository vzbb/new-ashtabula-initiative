# NAI Chief of Staff — Operating Framework

**Established:** July 3, 2026 — Turn 1 of ~1000  
**Chief of Staff:** Harriet (Hermes Agent)  
**Principal:** Michael Vega, Noirsys AI

---

## 1. Mission

Shepherd the New Ashtabula Initiative from a 75-site portfolio into a revenue-generating operation. This is a long-game project measured in months, not days. The goal is not speed — it's steady, irreversible progress across three fronts:

- **Product quality** — every site works, every site is branded for a real buyer, every site is sellable
- **Sales activation** — prospects contacted, demos delivered, deals closed, revenue flowing
- **Engineering independence** — provider-agnostic AI, clean toolchain, swarm-capable dev team

The Chief of Staff does not do all the work. The Chief of Staff maintains the map, assigns the lanes, prevents collisions, and surfaces decisions.

---

## 2. Current State (Turn 1 Baseline)

### Assets
- 75 React+Vite MVPs deployed on Vercel, all routes live
- `./nai` toolchain: scan, build, routes, deploy, screenshots, analyze, clone-mvp, hub
- Canonical sitemap: SITEMAP.json (machine) → SITEMAP.md (human)
- Research pipeline: lead_research_json/, brandkits/, email_prospects/, branding_research/
- Clone program: `./nai clone-mvp` with Tier 1 parents identified
- Sales collateral: SALES_OUTREACH_BIBLE, THE_CLOSER, LEAD_RESEARCH_REPORT, PITCH_SITES
- ~37 sites repaired (LAST_MILE_FIXES.md), ~28 remaining in queue
- Codex swarm architecture defined (7 roles in SWARM_KICKOFF.md)
- 4 hot prospects mapped with phone numbers and budget ranges

### Liabilities
- **Zero revenue.** No calls made. No demos delivered.
- **Gemini lock-in.** Every MVP calls `callGeminiAPI()` → Google Gemini directly. One provider, no fallback.
- **~37 sites flagged for repair.** Some are trivial (stale build), some need code fixes.
- **Branding gap.** Many sites still `branding_status = unbranded` or `partial` in visual analysis.
- **No QA gate.** No formal definition of "ready to sell."
- **Coordination debt.** coordination.md is stale. No active inter-agent protocol.

---

## 3. Agent Teams

### Chief of Staff (this role)
Owns the map. Does not own the territory.

- Maintain this framework document as the living source of truth
- Run `./nai scan` regularly, know the repo state cold
- Assign work to agents, prevent write conflicts
- Maintain the master task board (this file, section 5)
- Surface decisions Michael needs to make (section 6)
- Report progress at meaningful intervals, not every turn

### Sales & Outreach ("Closer")
Lives in: `lead_research_json/`, `email_prospects/`, sales docs.

- Own the relationship with 4 hot prospects + any new ones
- Draft outreach, get approval, execute
- Track responses, schedule demos
- Keep contact data current
- Eventually: handle pricing negotiations, close deals

### Product Management ("PM")
Lives in: `visual_analysis_report.json`, `brandkits/`, `SITEMAP.json`.

- Define what "done" means for each site
- Triage all 75 sites: Ready / Needs Branding / Needs Fix / Retire
- Maintain priority queue for dev team
- Verify branding against target buyer research
- Run and interpret `./nai analyze-screenshots`
- Own the artifact pipeline — ensure every layer is populated or intentionally stubbed
- Recommend site retirements (per REPO_GOVERNANCE_AND_DECOMMISSION_PLAN.md)

### Engineering ("Dev" — Codex/OpenCode swarm)
Lives in: `websites/`, `nai_suite/`, `shared/`, build/deploy.

- Fix broken sites from PM's priority queue
- Migrate all AI calls from Gemini-direct → OpenRouter (provider-agnostic)
- Implement branding from brandkits into site source
- Maintain build/deploy health (`./nai scan` exit 0)
- Execute clone operations when PM + Sales identify new buyer targets
- Keep the toolchain healthy (nai_suite/, shared/)

---

## 4. Phased Roadmap (1000-Turn Horizon)

### Phase 1: Foundation (Turns 1-100)
Know what we have. Stabilize. Set up comms.

- [ ] PM Agent: Full 75-site triage — categorize every MVP
- [ ] Dev Agent: Audit Gemini usage — count every `callGeminiAPI` call site
- [ ] Chief of Staff: Establish coordination protocol (coordination files per agent)
- [ ] Chief of Staff: Run `./nai scan`, document baseline state
- [ ] All agents: Load and understand the NAI skill and this framework

### Phase 2: Core Infrastructure (Turns 100-300)
Fix the toolchain. Migrate AI. Repair broken sites.

- [ ] Dev Agent: Design and implement OpenRouter API client in `shared/`
- [ ] Dev Agent: Migrate Tier 1 sites (5 pitch anchors) from Gemini → OpenRouter
- [ ] Dev Agent: Clear the LAST_MILE_FIXES.md repair queue (37 → 0)
- [ ] PM Agent: Define launch-readiness criteria
- [ ] Chief of Staff: Regular `./nai scan` checks, keep build green

### Phase 3: Brand & Product (Turns 300-600)
Make every site sellable.

- [ ] PM Agent: Drive branding sprint — brandkits → site implementation for unbranded MVPs
- [ ] Dev Agent: Implement branding across priority sites
- [ ] Dev Agent: Migrate remaining sites to OpenRouter
- [ ] PM Agent: Run `./nai analyze-screenshots`, verify branding quality
- [ ] Chief of Staff: Identify which sites are demo-ready vs. which need more work

### Phase 4: Sales Activation (Turns 400-800)
Start the revenue engine. Overlaps with Phase 3.

- [ ] Sales Agent: Draft personalized outreach for 4 hot prospects
- [ ] Chief of Staff + Michael: Review and approve outreach
- [ ] Sales Agent: Execute first contact (email + phone)
- [ ] Sales Agent: Track responses, schedule demos
- [ ] PM Agent: Prepare demo instances for prospect meetings
- [ ] Sales Agent: Iterate based on prospect feedback

### Phase 5: Scale (Turns 600-1000)
Clone, expand, optimize.

- [ ] Sales Agent: Expand prospect list beyond top 4
- [ ] PM Agent + Dev Agent: Clone program — spin up child MVPs for new buyers
- [ ] Dev Agent: Optimize build/deploy pipeline for scale
- [ ] Chief of Staff: Document processes, reduce bus factor
- [ ] All: First revenue milestone → iterate

---

## 5. Pitch-Ready Pipeline

The core operating rhythm: pick one MVP → run it through the 5-gate pipeline → pitch it → close → repeat.

See `PITCH_READY_WORKFLOW.md` for the complete 5-gate checklist. Summary:

```
GATE 1: VERIFY     →  Screenshot, test, build check — does it work?
GATE 2: BRAND      →  Colors, logo, local data, remove template smell — is it THEIRS?
GATE 3: WEAPONIZE  →  Urgency, trust badges, loss aversion, ROI, CTA — can they refuse?
GATE 4: PREP       →  Demo script, talking points, objection handlers — what do I say?
GATE 5: DELIVER    →  Domain readiness, pricing, go-live plan — can we go live in 48h?
```

### Master Task Board

### Blocked (needs Michael)
- OpenRouter API key — which models? fallback chain?
- Sales authorization — green light to contact prospects?
- Site retirements — confirm Pocket Historian Pro, Pocket Sommelier Pro removal?
- Pricing finalization — are SALES_OUTREACH_BIBLE numbers approved?
- Custom domain strategy — when to move off vercel.app?

### Ready (can start now)
- PM: Site triage — categorize all 75 MVPs
- Dev: Gemini API audit — count + catalog every call site
- Dev: Build OpenRouter API client shim in shared/
- Chief of Staff: Set up coordination files per agent team

### In Progress
- Chief of Staff: Absorbing full NAI context (done — skill created)
- Chief of Staff: This framework (Turn 1)

---

## 6. Coordination Protocol

### Files
- `CHIEF_OF_STAFF.md` — this file. Decisions, priorities, assignments. Chief of Staff writes.
- `coordination.md` — legacy. May be deprecated or absorbed.
- `coordination-sales.md` — Sales agent handoffs and status
- `coordination-pm.md` — PM agent triage, priority queue, decisions
- `coordination-dev.md` — Dev agent work log, current site, blockers

### Write Conflict Rules
- One agent works on one site at a time
- Agent declares current site(s) in their coordination file before touching code
- Chief of Staff checks for conflicts before assigning work
- If two agents need the same file, Chief of Staff serializes

### Communication Rhythm
- Agents update their coordination file at end of each meaningful work session
- Chief of Staff reads all coordination files before each session
- Chief of Staff reports to Michael at natural breakpoints, not every turn
- Agents escalate blockers immediately; otherwise stay in their lane
