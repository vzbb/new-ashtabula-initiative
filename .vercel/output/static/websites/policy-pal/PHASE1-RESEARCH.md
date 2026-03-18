# policy-pal — Phase 1: Research & Recon
**Date:** 2026-02-18  
**Status:** Phase 1 Complete → Ready for Phase 2 (Resource Procurement)  
**Researcher:** Rondell / Noirsys AI

---

## 1. Problem Definition

### The Pain Point
Residents and engaged citizens in Ashtabula lack visibility into City Council activities:
- Meeting schedules are buried on city website or announced with short notice
- Agenda items appear without context—residents don't know what ordinances mean
- No easy way to track specific issues (zoning changes, budget items, new ordinances)
- Meeting minutes take weeks to post, if at all
- No alerts when topics of interest come up for vote

### Who Suffers
| Persona | Pain | Frequency |
|---------|------|-----------|
| **Engaged Resident** | Misses important votes, finds out too late to provide input | Weekly |
| **Small Business Owner** | Unaware of ordinance changes affecting their property/operations | Monthly |
| **Nonprofit Coordinator** | Misses funding or partnership opportunities in council business | Quarterly |
| **Journalist/Blogger** | Spends hours manually tracking agendas across jurisdictions | Weekly |
| **City Council Candidate** | Can't easily research voting records or past decisions | As needed |

### Current Workarounds
- Manually checking city website (ashtabulacity.com)
- Attending meetings in person (high time cost)
- Following council members on social media (inconsistent)
- Word of mouth from other engaged residents
- Reading Star Beacon coverage (delayed, selective)

---

## 2. Competitor Analysis

### National Solutions
| Competitor | What It Does | Pricing | Ashtabula Fit |
|------------|--------------|---------|---------------|
| **LegiStorm** | Federal legislative tracking | $$$ Enterprise | Wrong level (federal only) |
| **FiscalNote** | Government relations platform | $$$$ Enterprise | Overkill, no municipal focus |
| **Ballotpedia** | Election/candidate info | Free | No ongoing legislative tracking |
| **Municode** | Code hosting for cities | $ (city pays) | Ashtabula uses it, but no tracking features |
| **Granicus** | Gov meeting management | $$$ (city pays) | Ashtabula may use for streaming, no public alerts |

### Nearby/Regional Solutions
| Competitor | Coverage | Gap Analysis |
|------------|----------|--------------|
| **Cleveland City Council** | Has meeting videos, agendas | Larger city, better resourced—no alert system |
| **Lakewood City Council** | Uses Granicus, some transparency | No citizen-friendly tracking/alerts |
| **Elyria City Council** | Basic website listings | No notification system |

### Key Finding
**No affordable, citizen-focused legislative tracking exists for cities under 100K population.** All solutions are either:
- Enterprise-grade (FiscalNote, Granicus full suite)
- Federal/state focused (LegiStorm)
- Passive document hosting (Municode, city websites)

**Gap:** Simple, free, AI-enhanced legislative alerts with plain-language summaries.

---

## 3. Data Sources & Accessibility

### Primary Sources

#### City of Ashtabula Clerk of Council
- **Contact:** clerkofcouncil@cityofashtabula.com
- **Phone:** (440) 992-7112
- **Address:** 4717 Main Avenue, Ashtabula, OH 44004
- **Hours:** Monday-Friday, 8:00 AM - 4:00 PM

**What They Have:**
- Meeting schedules (1st and 3rd Tuesday, 6:30 PM typically)
- Agendas (posted ~1 week before meetings)
- Minutes (approved at next meeting, then posted)
- Ordinances and resolutions (introduced, pending, passed)
- Video recordings (if available)

**Data Format:** PDFs on website, potentially BoxCast for video

#### City Website — Council Page
- **URL:** https://www.cityofashtabula.com/city-council
- **Content:** Member bios, meeting schedules, some PDFs

#### BoxCast / Video Streaming
- **Check:** ashtabulacity.com or BoxCast platform
- **Content:** Live and archived meeting videos

### Secondary Sources

#### Ashtabula Star Beacon
- **URL:** starbeacon.com
- **Content:** Meeting coverage, sometimes delayed by days/weeks

#### Ashtabula County Commissioners
- **Note:** Separate from City Council but relevant for county-level issues
- **Meeting:** Weekly, Wednesday mornings

---

## 4. Stakeholder Mapping

### Primary Stakeholders (Users)

| Stakeholder | Motivation | Access Point |
|-------------|------------|--------------|
| **Clerk of Council** | Wants transparency, reduced FOIA requests | Direct email |
| **City Council Members** | Want constituent engagement, feedback | Public meetings, email |
| **Mayor's Office** | Wants public trust, efficient governance | City website contact |

### Secondary Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| **Ashtabula Growth Partnership** | Tracks ordinances affecting business |
| **Chamber of Commerce** | Wants pro-business policy awareness |
| **ACDI (Community Development)** | Tracks housing/zoning ordinances |
| **Local Journalists** | Need story leads, voting records |
| **Historical Society** | Tracks preservation-related ordinances |

---

## 5. Technical Feasibility

### Data Collection Methods

| Method | Feasibility | Effort | Notes |
|--------|-------------|--------|-------|
| **PDF scraping** | Medium | Medium | Agendas/minutes are PDFs—extractable but fragile |
| **Website monitoring** | High | Low | Watch city website for new PDF uploads |
| **Email alerts from Clerk** | High | Low | Request to be added to distribution list |
| **Video transcription** | Medium | High | BoxCast videos → AI transcription → searchable |
| **Manual curation** | High | Ongoing | Hybrid: automated + human verification |

### AI Enhancement Opportunities
1. **Plain-language summaries** — Convert legalese to resident-friendly language
2. **Topic categorization** — Auto-tag: zoning, budget, public safety, infrastructure
3. **Impact assessment** — Flag items affecting specific wards or property owners
4. **Voting record analysis** — Track council member positions over time
5. **Duplicate detection** — Link related agenda items across meetings

---

## 6. Feature Hypothesis (MVP)

### Core Features (P0)
1. **Meeting Calendar** — Simple list view of upcoming meetings with dates/times
2. **Agenda Alerts** — Email/SMS notification when new agenda posted
3. **Plain-Language Summaries** — AI-generated "What this means" for each agenda item
4. **Topic Filtering** — Subscribe to specific categories (zoning, budget, etc.)
5. **Search Archive** — Full-text search past agendas, minutes, ordinances

### Enhanced Features (P1)
6. **Voting Records** — Track how each council member voted on issues
7. **Public Comment Tracker** — Log resident comments and outcomes
8. **Ordinance Lifecycle** — Follow items from introduction to final passage
9. **Ward-Specific Alerts** — Notify residents of issues affecting their ward
10. **Integration with civic-insight-engine** — Link to budget data, permits

---

## 7. Business Model Options

| Model | Viability | Notes |
|-------|-----------|-------|
| **Free civic service** | High | Community goodwill, supports other Noirsys initiatives |
| **Sponsored by local org** | Medium | Chamber, Growth Partnership might sponsor |
| **Freemium** | Low | Hard to justify paid tier for this use case |
| **White-label to other cities** | Medium | Build once, deploy to similar-sized cities |

**Recommendation:** Launch as free community tool. Consider white-label licensing to other Ohio cities later.

---

## 8. Open Questions (Phase 2 Blockers)

### Critical Blockers
1. **Clerk cooperation** — Will Clerk of Council share data proactively or require FOIA?
2. **Meeting video access** — Are videos on BoxCast publicly accessible? Can we get API/transcript access?
3. **Agenda standardization** — Are agendas consistently formatted? PDF structure varies?

### Important Questions
4. **Alert delivery method** — Email preferred? SMS? Push notification? Hybrid?
5. **Update frequency** — Real-time (as items posted) or digest (daily/weekly summary)?
6. **Legal review** — Any liability in summarizing legislation? Need disclaimer?

### Nice-to-Know
7. **Council member interest** — Do any council members actively want better transparency?
8. **Resident demand** — How many people would actually use this?

---

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Clerk non-cooperation | High | Low | Frame as reducing their workload; FOIA fallback |
| Data format changes | Medium | High | Build flexible scraper; manual override |
| Low adoption | Medium | Medium | Partner with engaged residents for launch |
| Legal concerns about summaries | Low | Low | Clear disclaimer: "Unofficial summary, verify with official documents" |
| Maintenance burden | Medium | Medium | Automate as much as possible; community volunteers |

---

## 10. Recommended Next Steps (Phase 2)

### Immediate (This Week)
1. **Email Clerk of Council** — Introduce project, request:
   - Meeting schedule feed (iCal/RSS preferred, PDF acceptable)
   - Agenda distribution list access
   - Minutes posting schedule/process
   - BoxCast video access info

2. **Analyze existing PDFs** — Download last 6 months of agendas/minutes, assess:
   - Format consistency
   - Extractability (text vs scanned images)
   - Structure patterns

3. **Council member survey** — Brief email to all council members:
   - "Would this tool help your constituents engage?"
   - "What features would you most want to see?"

### Short Term (Next 2 Weeks)
4. **Prototype scraper** — Build basic PDF downloader/parser
5. **User validation** — Survey 10-15 engaged residents (Facebook groups, Nextdoor)
6. **Technical spike** — Test BoxCast API/video transcription feasibility

### Medium Term
7. **Draft SPEC.md** — Based on Phase 2 findings
8. **Build MVP** — Core calendar + alerts + summaries
9. **Pilot launch** — Soft launch to engaged resident network

---

## 11. Strategic Positioning

### Unique Value Proposition
> **"Know what your city council is doing before they vote on it—explained in plain English."**

### Differentiation
- **vs. city website:** Proactive alerts, plain language, searchable
- **vs. newspaper:** Real-time, comprehensive, persistent archive
- **vs. attending meetings:** Low time investment, no schedule conflicts
- **vs. enterprise solutions:** Free, focused, simple

### Synergies with Other Tools
- **civic-insight-engine** — Link legislative items to budget/permits data
- **permit-whisperer** — Flag zoning ordinance changes affecting permits
- **invest-ashtabula** — Track economic development legislation

---

## 12. Appendix

### Sample Outreach Email (Draft)

**To:** clerkofcouncil@cityofashtabula.com  
**Subject:** Transparency Tool Proposal — Policy Pal

---

Dear Clerk of Council,

I'm building a free civic tool called "Policy Pal" to help Ashtabula residents better understand and engage with City Council activities.

**What it does:**
- Sends alerts when new agendas are posted
- Provides plain-language summaries of agenda items
- Maintains a searchable archive of past meetings
- Helps residents find issues that matter to them

**Why I'm reaching out:**
I'd love to discuss how we can access meeting information in the most efficient way—ideally through an email distribution list or feed for agendas, minutes, and schedules.

This tool is purely informational, nonprofit, and designed to complement the excellent work your office already does.

Would you be available for a brief 15-minute conversation?

Best regards,  
[Name]  
Noirsys AI / New Ashtabula Initiative

---

### Relevant Links
- City Council Page: https://www.cityofashtabula.com/city-council
- Clerk of Council Email: clerkofcouncil@cityofashtabula.com
- Meeting Schedule: 1st and 3rd Tuesday, 6:30 PM (City Hall)

---

**Research Complete.** Ready for Phase 2: Resource Procurement (stakeholder outreach, data access validation).
