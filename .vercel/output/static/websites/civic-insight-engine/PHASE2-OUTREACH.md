# Phase 2 Resource Procurement — Civic Insight Engine
**Project:** Unified City Data Transparency Dashboard for Ashtabula  
**Date:** 2026-02-20  
**Status:** Phase 2 Complete — Ready for Stakeholder Outreach  
**Previous:** Phase 1 Research (Pivot from meeting summarizer to civic data portal)

---

## 1. Stakeholder Contact Directory

### City of Ashtabula (Primary)

| Role | Department | Contact | Priority |
|------|------------|---------|----------|
| **Clerk of Council** | Legislative | clerkofcouncil@cityofashtabula.com, 440-992-7119 | 🔥 CRITICAL |
| **Mayor's Office** | Executive | TBD (call city main 440-992-7115) | 🔥 CRITICAL |
| **IT Department** | Technology | TBD | HIGH |
| **Planning & Community Dev** | Permits/Zoning | TBD (PCD Dept) | HIGH |
| **Finance Department** | Budgets | TBD | MEDIUM |
| **City Council Members** | Legislative | 7 members (contact via Clerk) | MEDIUM |

### Ashtabula County (Data Partners)

| Role | Department | Contact | Data Access |
|------|------------|---------|-------------|
| **GIS Team** | IT/GIS | Via county website | Property/parcel API |
| **County Auditor** | Administration | 440-994-3250 | CAMA data authority |
| **Transparency Portal Admin** | Finance | Via co.ashtabula.oh.us | Budget PDFs |

### External Benchmarks (Best Practices)

| City | Contact | Relevance |
|------|---------|-----------|
| **Cleveland Open Data** | data@clevelandohio.gov | Portal launched April 2024 — best practice |
| **Cambridge MA** | opendata@cambridgema.gov | 311 dashboard model |
| **Code for America** | brigade-info@codeforamerica.org | Brigade network support |

### Potential Advocates

| Organization | Contact | Role |
|--------------|---------|------|
| **Ashtabula Star-Beacon** | Editorial desk | Journalism use case |
| **League of Women Voters** | Local chapter | Transparency advocacy |
| **Ashtabula Downtown Assoc** | Business org | Business use case |
| **Geneva Area Chamber** | Business org | Regional interest |

---

## 2. Outreach Email Templates

### Template A: Clerk of Council (Data Gatekeeper)

**Subject:** Proposal — searchable council meeting archive and public dashboard

```
Dear Clerk [Name],

I'm writing from a local technology initiative to propose a tool 
that could increase public engagement with City Council while 
reducing your administrative burden.

**The challenge we see:**
Residents want to follow council activity but struggle to:
• Find meeting videos, agendas, and minutes across different pages
• Search past discussions to understand how decisions were made
• Track specific issues (zoning, budgets, projects) across meetings

**Our proposed solution:**
A unified "Civic Insight Engine" that:
• Centralizes council calendars, agendas, minutes, and video
• Makes everything searchable ("show me all discussions about 
  Harbor Road")
• Provides automatic summaries of meeting topics
• Is completely free for the city to use

**What we'd need from you:**
• Permission to access existing meeting videos and documents
• 30-minute conversation about current workflow and pain points
• Feedback on what residents ask about most

**What you get:**
• Reduced "where can I find..." phone calls
• Better public engagement without extra work
• Modern, searchable archive of council activity
• Recognition for transparency leadership

Would you be open to a brief conversation about this?

Best regards,
[Your Name]
[Phone]
[Email]
```

### Template B: Mayor's Office (Strategic Alignment)

**Subject:** Partnership proposal — city transparency dashboard

```
Dear Mayor [Name],

I'm reaching out from a local tech initiative to propose a project 
that could support your administration's transparency and 
engagement goals.

**The opportunity:**
Ashtabula lacks a unified public data portal. Residents, businesses, 
and journalists struggle to find information scattered across 
department pages, PDFs, and video archives.

Cleveland recently launched data.clevelandohio.gov (April 2024) 
with great success. We believe Ashtabula could benefit from a 
similar but simpler approach tailored to our size and needs.

**Civic Insight Engine would provide:**
• Unified property lookup (county data + city permits)
• Searchable council meeting archive with AI summaries
• Project tracking (what's being built, when, by whom)
• Budget visualizations (where tax dollars go)
• All in one dashboard, mobile-friendly, free to city

**Why now:**
• Public expectation for digital transparency growing
• Nearby exemplar (Cleveland) proves viability
• Free, maintained by external partners
• Positions Ashtabula as a small-city leader

**The ask:**
A 30-minute meeting to discuss strategic alignment and potential 
pilot scope. No commitment required — just exploration.

Thank you for your service to our city,
[Your Name]
```

### Template C: County GIS Team (Data Partnership)

**Subject:** Collaboration — city data portal using existing county GIS

```
Dear GIS Team,

I'm developing a civic transparency project for Ashtabula and 
would love to explore a partnership with your team.

**The concept:**
A unified dashboard for Ashtabula residents combining:
• Your excellent county GIS data (parcels, property, boundaries)
• City-level data (permits, council activity, projects)
• Simple, mobile-friendly interface

**Why partner:**
• Your GIS portal is already the authoritative source — we'd 
  integrate it, not duplicate it
• City-specific context makes county data more useful
• Shared mission of transparency and public service
• No technical burden on your team — we handle integration

**Questions:**
• Are there API rate limits or usage guidelines?
• Would you be open to a brief technical call?
• Any concerns about how we'd use the data?

Thanks for all the great work you do with open data,
[Your Name]
```

### Template D: Cleveland Open Data (Benchmark Interview)

**Subject:** Asking about your open data portal — lessons for smaller cities?

```
Dear Cleveland Data Team,

Congratulations on the successful launch of your open data portal 
(data.clevelandohio.gov) in April 2024.

I'm working on a civic technology initiative in Ashtabula (smaller 
city ~19K population) and hoping to learn from your experience.

**Quick questions:**
• What were the biggest challenges in launching?
• What has resident engagement been like?
• What would you do differently?
• Any advice for a small city with limited IT resources?

Even 15 minutes on the phone would be incredibly helpful.

Thanks for pioneering open data in Northeast Ohio,
[Your Name]
```

---

## 3. Data Access Roadmap

### Immediate (No Permission Needed)

| Data Source | Access | Integration |
|-------------|--------|-------------|
| **County GIS API** | Public | REST API, documented |
| **County CAMA Data** | Public | Nightly export |
| **County Budgets** | Public | PDF download |
| **City Council Videos** | Public (YouTube) | URL scraping |
| **Meeting Agendas** | Public | PDF scraping |

### Requires Permission

| Data Source | Gatekeeper | Request |
|-------------|------------|---------|
| **Minutes in parseable format** | Clerk of Council | Digital access vs PDF |
| **City budget raw data** | Finance | CSV/Excel export |
| **Permit data feed** | PCD Dept | API or export access |
| **Project status updates** | Various | Coordination workflow |

### Long-term Partnerships

| Data Source | Partner | Value |
|-------------|---------|-------|
| **311/service requests** | City IT | Citizen issue tracking |
| **Police stats** | APD | Safety dashboard |
| **Building inspections** | PCD | Permit status |
| **Real-time alerts** | City | Push notifications |

---

## 4. Technical Resource Assessment

### Data Processing Pipeline

```
Sources:
├── County GIS API ──────┐
├── County Budget PDFs ──┼──→ ETL Pipeline ──→ Database ──→ Dashboard
├── City Videos ─────────┤
├── Meeting Minutes ─────┘
└── (Future: permits, 311)
```

### Tech Stack Options

| Component | Option A | Option B |
|-----------|----------|----------|
| Frontend | Next.js + Tailwind | React + Material UI |
| Backend | Node.js + Express | Python + FastAPI |
| Database | PostgreSQL | Supabase |
| Search | Meilisearch | Algolia |
| Video Processing | Whisper (local) | AssemblyAI (API) |
| PDF Parsing | pdf-parse | Tika |
| Hosting | Vercel + Railway | Netlify + Supabase |
| GIS Maps | Leaflet | MapLibre |

### Cost Estimate

| Tier | Monthly Cost | Capability |
|------|--------------|------------|
| **Free tier** | $0 | 10K searches, 100 video hours, basic maps |
| **Small city** | $50 | 100K searches, unlimited video, advanced features |
| **Growth** | $200 | API access, alerts, multi-city |

---

## 5. Competitive Intelligence

### Cleveland Open Data Portal
- **Strengths:** Comprehensive, well-designed, API-first
- **Weaknesses:** Complex for non-technical users, no meeting integration
- **Our angle:** Simpler UX, meeting archive, small-city focus

### County GIS Portal
- **Strengths:** Authoritative data, professional mapping
- **Weaknesses:** Technical interface, county-only, no city context
- **Our angle:** City focus, simpler UX, meeting integration

### Manual Research (Status Quo)
- **Strengths:** No tech investment
- **Weaknesses:** Hours of PDF/video archaeology, inconsistent
- **Our angle:** Minutes vs hours, consistent experience

**Key Differentiation:**
- First unified portal (city + county)
- Meeting archive with search (nobody has this)
- Designed for residents, not data scientists
- Free to city (grant/philanthropy funded)

---

## 6. User Validation Plan

### Target Interviewees

| Segment | Count | Recruitment |
|---------|-------|-------------|
| Engaged residents | 3-5 | Facebook groups, council attendees |
| Local journalists | 1-2 | Star-Beacon contact |
| Business owners | 2-3 | Chamber of Commerce |
| City Council members | 1-2 | Via Clerk of Council |
| City staff | 2-3 | Various departments |

### Interview Questions

**For Residents:**
1. How do you currently find information about city decisions?
2. What city information is hardest to find?
3. Would you use a dashboard with property data + council activity?
4. What features would be most valuable?

**For City Staff:**
1. What questions do you get most often from residents?
2. What data do you wish was more accessible?
3. What concerns would you have about a public dashboard?
4. How could this reduce your workload?

---

## 7. Risk Assessment Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| City doesn't cooperate | Medium | HIGH | Start with public data only, demonstrate value |
| Data quality issues | Medium | Medium | Clear source attribution, disclaimers |
| Low resident engagement | Medium | Medium | Marketing through local media, social |
| Maintenance burden | Low | Medium | Automated data pipelines, partner funding |
| Legal/privacy concerns | Low | HIGH | Legal review, no PII, public data only |

---

## 8. Go/No-Go Decision Tree

```
After outreach:
│
├─► If Clerk of Council supports:
│   └─► Proceed to Phase 3 (SPEC.md)
│       └─► Full meeting archive integration
│
├─► If County GIS partners:
│   └─► Proceed with property focus
│       └─► Demonstrate value for city buy-in
│
├─► If no government partners but residents interested:
│   └─► Proceed with public data only
│       └─► Build momentum for future partnership
│
└─► If zero interest:
    └─► Pause
        └─► Document learnings, reassess approach
```

### Go Criteria
- [ ] Clerk of Council OR Mayor's Office engaged
- [ ] OR 10+ residents commit to using it
- [ ] OR County GIS team supports partnership

### No-Go Criteria
- [ ] Active opposition from city leadership
- [ ] Legal barriers to public data use
- [ ] Zero stakeholder interest

---

## 9. Quick Reference — Key Contacts

| Organization | Phone/Contact | Best Time | Notes |
|--------------|---------------|-----------|-------|
| Clerk of Council | 440-992-7119 | Morning | Meeting data gatekeeper |
| City Main | 440-992-7115 | Business hrs | Mayor's office routing |
| County Auditor | 440-994-3250 | Morning | Property data authority |
| Cleveland Data | data@clevelandohio.gov | Email | Best practice benchmark |

---

**Document Status:** Phase 2 Complete  
**Next:** Execute outreach OR proceed to Phase 3 with conservative scope  
**Priority:** Contact Clerk of Council (440-992-7119) — meeting data is critical differentiator
