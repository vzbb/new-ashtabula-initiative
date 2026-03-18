# Phase 1: Research & Recon — Civic Insight Engine
**Date:** 2026-02-17
**Status:** Phase 1 Complete → Ready for Phase 2 (Resource Procurement)

---

## Executive Summary

**Product Concept:** Civic Insight Engine — A unified public dashboard that aggregates city/county data into an accessible, searchable transparency portal for Ashtabula residents.

**Pivot Recommendation:** Shift from "meeting video summarizer" (crowded market, undifferentiated) to "city data transparency dashboard" (clear gap, nearby exemplar, city strategic priority).

---

## 1. Competitor Analysis

### 1.1 Meeting Summarizer Space (Original Concept)
| Competitor | Pricing | Key Features |
|------------|---------|--------------|
| **Fireflies.ai** | $10-19/user/mo | Transcription, action items, CRM integration |
| **Read.ai** | $15-30/user/mo | Meeting coaching, analytics, summaries |
| **Meeting.ai** | $8-12/user/mo | Mind maps, secure processing |
| **Zoom AI Companion** | Bundled | Native integration, basic summaries |

**Verdict:** Saturated market. No clear differentiation for municipal use case.

### 1.2 Civic Data Dashboard Space (Recommended Pivot)
| Competitor | Location | Features | Gaps We Can Fill |
|------------|----------|----------|------------------|
| **Cleveland Open Data Portal** | data.clevelandohio.gov | Datasets, dashboards, civic apps | No Ashtabula coverage; complex for small city |
| **Ashtabula County GIS Portal** | gis-ashtabulacounty.opendata.arcgis.com | Property, parcels, CAMA data | County-level only; no city data; technical interface |
| **Ashtabula County Transparency Portal** | co.ashtabula.oh.us | Budgets, financials | Limited datasets; PDF-heavy |
| **Cambridge MA 311 Dashboard** | cambridgema.gov | Service request performance | Ashtabula lacks equivalent |
| **NYC BoardStat** | betanyc.org | Community board analytics | No local equivalent |

**Opportunity:** Ashtabula City has NO unified data portal. County has GIS/financials but city-specific data (permits, council activity, budgets, projects) is scattered across PDFs, video streams, and department pages.

---

## 2. Data Sources Identified

### 2.1 Existing Open Data (County Level)
| Source | URL | Data Available | Access |
|--------|-----|----------------|--------|
| **County GIS Portal** | gis-ashtabulacounty.opendata.arcgis.com | Parcels, property, boundaries, environment, transportation | ArcGIS REST API, downloadable |
| **County Transparency** | co.ashtabula.oh.us/232/Transparency-Portal | Budgets, audits, financial reports | PDF downloads |
| **County CAMA Data** | Nightly export | Real estate database flat files | Download link |

### 2.2 City Data Sources (To Be Integrated)
| Source | Current Format | Data Type | Contact/Location |
|--------|---------------|-----------|------------------|
| **City Council Live Stream** | BoxCast/YouTube/Facebook | Meeting video | cityofashtabula.com/stream-live |
| **Meeting Agendas & Minutes** | PDF | Official records | cityofashtabula.com/council-meeting-agendas-minutes |
| **Codified Ordinances** | PDF | Municipal code | cityofashtabula.com |
| **Boards & Commissions** | Web pages | Member lists, schedules | cityofashtabula.com |
| **Clerk of Council** | Manual | Meeting schedules, public records | clerkofcouncil@cityofashtabula.com, (440) 992-7119 |
| **City Budgets** | Likely PDF | Financial planning | Finance Dept (TBD) |
| **Building Permits** | Unknown | Permit status, data | PCD Dept (potential overlap with permit-whisperer) |
| **311/Service Requests** | Unknown | Citizen issues | TBD — may not exist |

### 2.3 Potential Data Integrations
| Data Type | Value | Difficulty | Source |
|-----------|-------|------------|--------|
| **Property/Parcel data** | High | Low | County GIS API |
| **Council meeting transcripts** | High | Medium | AI transcription of video |
| **Voting records** | High | Low | Minutes parsing |
| **Budget visualizations** | Medium | Medium | PDF extraction |
| **Permit activity** | High | Medium | PCD integration |
| **Project tracking** | High | High | Manual entry/dept coordination |
| **Crime/afety stats** | Medium | Unknown | APD (TBD) |

---

## 3. Stakeholder Mapping

### 3.1 Primary Users
| Segment | Needs | Pain Points |
|---------|-------|-------------|
| **Engaged Residents** | Track issues, understand decisions | Can't find meeting info, scattered data |
| **Journalists/Advocates** | Research, accountability | FOIA delays, PDF archaeology |
| **Business Owners** | Permits, zoning, development | Unclear process, no status tracking |
| **City Council** | Public engagement, transparency | Limited tools for constituent communication |
| **City Staff** | Reduce repetitive inquiries | "Where's my permit?" calls |

### 3.2 Decision Makers / Partners
| Role | Entity | Contact | Influence |
|------|--------|---------|-----------|
| **Clerk of Council** | City of Ashtabula | clerkofcouncil@cityofashtabula.com | Controls meeting data, minutes |
| **Mayor's Office** | City of Ashtabula | TBD | Strategic priority alignment |
| **IT Department** | City of Ashtabula | TBD | Technical integration |
| **Planning & Community Development** | City of Ashtabula | TBD | Permit data overlap |
| **County GIS Team** | Ashtabula County | TBD | County data partnership |
| **County Auditor** | Ashtabula County | TBD | Property data authority |

### 3.3 Comparable City Contacts (For Benchmarking)
| City | Contact | Relevance |
|------|---------|-----------|
| **Cleveland** | data.clevelandohio.gov team | Built portal April 2024 — best practice |
| **Cambridge MA** | Open Data team | 311 dashboard model |

---

## 4. Technical Feasibility Assessment

### 4.1 Data Availability Score: 6/10
- **County data:** Good (GIS API, financials)
- **City data:** Poor (scattered, PDF-heavy, no API)
- **Meeting data:** Medium (video available, needs transcription)

### 4.2 Integration Complexity: Medium
- County GIS: REST API available
- City pages: Web scraping or manual coordination
- Video processing: AI transcription (AssemblyAI, Whisper)

### 4.3 MVP Scope Recommendation
| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Property lookup, council calendar, meeting archive with search | 2-3 weeks |
| **Phase 2** | Permit tracking integration, budget visualizations | +2 weeks |
| **Phase 3** | Real-time alerts, mobile app, AI chatbot | +4 weeks |

---

## 5. Strategic Positioning

### 5.1 Value Proposition
> "The first unified transparency portal for Ashtabula — property data, council activity, permits, and budgets in one searchable dashboard."

### 5.2 Differentiation
- **vs. County GIS:** City-specific focus, simpler UX, meeting integration
- **vs. Cleveland Portal:** Small-city appropriate, faster to deploy, lower cost
- **vs. Manual Research:** Saves hours of PDF/video archaeology

### 5.3 Monetization Pathways
1. **City contract:** Annual SaaS fee for hosting/maintenance
2. **Grant funded:** Transparency/good government foundation grants
3. **Freemium:** Basic free, premium alerts/API access

---

## 6. Open Questions (Phase 2 Research Targets)

### Critical Blockers
1. **Does the City have any existing open data policy or API infrastructure?**
2. **What is the Clerk of Council's appetite for digitization?**
3. **Can we secure a pilot partnership with one City department?**

### Important Context
4. **Are there active civic tech volunteers/advocates in Ashtabula?**
5. **What similar tools have been proposed/piloted before?**
6. **What are the top 3 transparency requests from residents?**

---

## 7. Next Steps (Phase 2: Resource Procurement)

1. **Draft outreach email to Clerk of Council** — Introduce concept, request 15-min call
2. **Draft outreach email to County GIS team** — Request API documentation meeting
3. **Research Cleveland Open Data Portal team** — Request best-practice call
4. **Create one-page concept deck** — Visual summary for stakeholder meetings
5. **Map existing City website structure** — Identify all data sources to scrape/integrate

---

## 8. Files Produced

| File | Location | Description |
|------|----------|-------------|
| **Phase 1 Research** | `websites/civic-insight-engine/PHASE1-RESEARCH.md` | This document |

---

## Summary

**Pivot Recommendation:** ✅ Proceed with City Data Dashboard concept
**Priority:** P0 (transparency aligns with flagship project values)
**Blocker Status:** None — ready for Phase 2 outreach
**Confidence:** High (clear gap, available data, nearby exemplar)
