# Civic Insight Engine — Research & Competitor Analysis

## Date: 2025-02-17
## Researcher: Rondell / Noirsys AI

---

## 1. Problem Statement

Ashtabula County and similar townships face a transparency gap:
- Meeting minutes are dense and difficult for residents to parse
- Budget data exists on OhioCheckbook.gov but isn't locally contextualized
- No unified dashboard for civic engagement metrics
- Residents lack easy ways to track issues they've reported

---

## 2. Existing Prototype Analysis

**Current MVP Features:**
- Gemini-powered meeting minutes summarizer (5 bullets + 3 action items)
- "Publish to site" button (UI only, not functional)
- Basic trust indicators and audit trail mentions

**Gaps in Current Prototype:**
- No actual publishing workflow
- No integration with real data sources
- Single-user only, no persistence
- No dashboard for historical summaries

---

## 3. Competitor Analysis

### SeeClickFix (CivicPlus)
- **Model:** 311 CRM for non-emergency neighborhood issues
- **Features:** Issue reporting, routing to government, two-way updates, OpenGov integration
- **Pricing:** Subscription-based (~$1M+ annual revenue)
- **Strengths:** Mature platform, resident notifications, mobile apps
- **Weaknesses:** Expensive for small townships, complex setup

### CitySourced
- **Model:** Community reporting app for civic issues
- **Features:** Photo-based reporting, location tagging, status tracking
- **Strengths:** Mobile-first, easy resident adoption
- **Weaknesses:** Limited customization, per-city pricing

### OpenGov Community Feedback
- **Model:** Enterprise transparency + engagement platform
- **Features:** Budget visualization, feedback collection, reporting
- **Strengths:** Powerful analytics, government-grade security
- **Weaknesses:** Enterprise pricing, overkill for small jurisdictions

### PublicInput / Reach Data Dashboard
- **Model:** Central toolkit for civic data sharing
- **Features:** Data reporting, insight visualization, public sharing
- **Strengths:** Purpose-built for engagement metrics
- **Weaknesses:** SaaS dependency, limited local control

### FixMyStreet (UK/MySociety)
- **Model:** Open-source issue reporting
- **Features:** Map-based reporting, email routing
- **Strengths:** Open source, customizable
- **Weaknesses:** UK-centric, limited US integrations

---

## 4. Market Gap Opportunity

**What existing tools miss:**
1. **AI-powered content generation** (meeting summaries, plain-language budgets)
2. **Small-jurisdiction affordability** (many townships <10k population)
3. **Unified dashboard** (combining meetings, budgets, issues, projects)
4. **Offline-capable** (rural connectivity issues)
5. **Simple deployment** (no IT department required)

---

## 5. Target User Personas

### Persona A: Township Clerk (Admin)
- Needs: Quick meeting summarization, easy publishing, compliance records
- Tech level: Moderate, uses Google Workspace
- Pain: Manually creating summaries takes 2+ hours per meeting

### Persona B: Engaged Resident
- Needs: Understand local government, track issues, get notified
- Tech level: High, smartphone power user
- Pain: Can't find meeting info, doesn't know who to contact

### Persona C: Busy Parent
- Needs: Quick overview of what's happening, easy issue reporting
- Tech level: Moderate, uses Facebook for local news
- Pain: No time to read full minutes, doesn't attend meetings

---

## 6. Differentiation Strategy

**Civic Insight Engine competitive advantages:**
1. **AI-first:** Gemini/LLM integration for content generation (not just display)
2. **Open source + self-hostable:** Lower cost, local control
3. **Ashtabula-optimized:** Pre-configured for Ohio township structures
4. **Unified:** One tool for summaries, budgets, issues, and projects
5. **Offline-capable:** PWA with local caching for rural connectivity

---

## 7. Key Insights

1. **Transparency is expected:** Residents increasingly expect open data (Philadelphia's Litter Index model)
2. **Mobile is essential:** Most engagement happens on smartphones
3. **Simplicity wins:** Complex tools fail in small jurisdictions
4. **Trust through visibility:** Public dashboards improve trust scores
5. **Cost is barrier:** Subscription pricing excludes most small townships

---

## 8. Recommended Feature Priorities (Based on Research)

**P0 (Must-have):**
- AI meeting summarization ✓ (already exists)
- Public dashboard for summaries
- Issue reporting with status tracking
- OhioCheckbook.gov integration

**P1 (Should-have):**
- Mobile PWA
- Email notifications
- Anonymous vs authenticated modes
- Admin approval workflow

**P2 (Nice-to-have):**
- Voice-to-text for meeting input
- Multi-language support
- Integration with existing township websites
- Analytics/engagement metrics

---

## 9. Data Sources Identified

| Source | Type | URL | Integration Notes |
|--------|------|-----|-------------------|
| Ohio Checkbook | Budget/Spending | checkbook.ohio.gov | API available, JSON export |
| Ashtabula County Site | Documents | ashtabulacounty.us | Scraping or RSS feeds |
| Township Meeting Minutes | Documents | Varies by township | PDF parsing required |
| Census Data | Demographics | census.gov | API available |
| OpenStreetMap | Maps | openstreetmap.org | Free, no API key |

---

**Next Step:** Proceed to SPEC.md with architecture based on this research.
