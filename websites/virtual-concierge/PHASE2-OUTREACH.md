# Virtual Concierge — Phase 2: Resource Procurement

**Date:** 2026-02-19  
**MVP:** Virtual Concierge (Ashtabula Community Initiative)

---

## 1. Contact Registry

### 1.1 Official Organizations

| Organization | Role | Contact Info | Status | Notes |
|--------------|------|--------------|--------|-------|
| **Ashtabula County Convention & Visitors Bureau** | Primary partner | 2046 OH-45, Austinburg, OH 44010<br>Phone: 440-275-3202<br>Email: visitus@visitashtabulacounty.com<br>Web: visitashtabulacounty.com | **OUTREACH NEEDED** | Main tourism promotion org |
| **Ashtabula County Government** | Economic development | Web: ashtabulacounty.us | **OUTREACH NEEDED** | Potential public funding |
| **Geneva-on-the-Lake Chamber of Commerce** | Local business coord | Web: visitgenevaonthelake.com | **OUTREACH NEEDED** | Key tourism area |
| **Ashtabula Chamber of Commerce** | Downtown businesses | TBD | **RESEARCH NEEDED** | City-specific business data |
| **OSU Extension Ashtabula County** | Agricultural tourism | 39 Wall St, Jefferson, OH 44047<br>Phone: 440-576-9008 | **OUTREACH NEEDED** | Winery connections |

### 1.2 Winery Partners (Sample Outreach List)

| Winery | Location | Contact Method | Data Needed | Priority |
|--------|----------|----------------|-------------|----------|
| **Laurentia Vineyard & Winery** | Madison | Website form | Hours, events, tasting info | High |
| **Ferrante Winery** | Geneva | Website/phone | Hours, menu, events | High |
| **M Cellars** | Geneva | Website form | Hours, specialties | High |
| **South River Vineyard** | Geneva | Website/phone | Hours, church building info | Medium |
| **Old Firehouse Winery** | Geneva-on-the-Lake | Direct contact | Hours, live music schedule | High |
| **Cask 307** | Geneva | Website form | Hours, events | Medium |
| **Grand River Cellars** | Madison | Website/phone | Hours, events | Medium |
| **Debonne Vineyards** | Madison | Website/phone | Hours, largest vineyard info | Medium |

### 1.3 Technology Vendors

| Vendor | Product | Contact | Pricing | Status |
|--------|---------|---------|---------|--------|
| **HeyGen** | Avatar API | heygen.com/api-pricing | $29-89/mo + usage | **EVALUATING** |
| **Synthesia** | AI Avatars | synthesia.io | $22-67/mo | **ALTERNATIVE** |
| **ElevenLabs** | TTS | elevenlabs.io | $5-22/mo + usage | **PREFERRED TTS** |
| **Google Cloud** | Translation, TTS, LLM | cloud.google.com | Pay-per-use | **BACKUP** |
| **DeepL** | Translation | deepl.com/pro-api | $6.99/million chars | **EVALUATING** |
| **HootBoard** | Kiosk hardware/software | hootboard.com | Custom enterprise | **REFERENCE** |

---

## 2. API Resources

### 2.1 Selected API Stack (Recommended)

| Layer | Service | API Endpoint | Cost Estimate |
|-------|---------|--------------|---------------|
| **LLM** | Google Gemini 1.5 Flash | `generativelanguage.googleapis.com` | ~$0.50/million tokens |
| **TTS** | ElevenLabs | `api.elevenlabs.io` | ~$5/mo base + usage |
| **Translation** | Google Cloud Translate | `translation.googleapis.com` | $20/million chars |
| **Maps** | MapLibre/Leaflet + OSM | Self-hosted | Free |
| **Weather** | Open-Meteo | `api.open-meteo.com` | Free |
| **Search** | Local vector DB | Self-hosted (Qdrant) | Compute only |

### 2.2 API Credentials Needed

- [ ] Google Cloud API key (Gemini + Translate)
- [ ] ElevenLabs API key
- [ ] Mapbox token (optional, for enhanced maps)

### 2.3 API Rate Limits & Budgeting

| Service | Free Tier | Expected Monthly Usage | Est. Monthly Cost |
|---------|-----------|------------------------|-------------------|
| Gemini Flash | 1,500 req/day | ~5,000 req | $2-5 |
| ElevenLabs | 10k chars/mo | ~100k chars | $5-10 |
| Google Translate | None | ~500k chars | $10 |
| Open-Meteo | Unlimited | ~1,000 calls | Free |
| **TOTAL** | — | — | **$17-25/mo** |

---

## 3. Data Procurement Plan

### 3.1 Structured Data to Acquire

| Data Type | Source | Format | Priority | Method |
|-----------|--------|--------|----------|--------|
| **Winery database** | CVB, manual research | JSON/CSV | Critical | Partnership + scraping |
| **Covered bridge locations** | CVB, ACCVB.org | GeoJSON | Critical | Download + verify |
| **Barn quilt locations** | BarnQuiltAshtabulaCounty.com | PDF → manual | High | PDF extraction |
| **Event calendar** | CVB, local papers | iCal/API | High | RSS scraping |
| **Restaurant directory** | Google Places, manual | JSON | Medium | API + verification |
| **Lodging list** | CVB, booking sites | JSON | Medium | Partnership |
| **Historical content** | Historical societies | Text/docs | Low | Request |

### 3.2 Content License Requirements

| Content | License Needed | Approach |
|---------|----------------|----------|
| Bridge photos | CC-BY or permission | Request from CVB |
| Wineries logos | Usage permission | Include in partnership agreement |
| Barn quilt images | Photographer permission | Credit-based usage |
| Map data | OpenStreetMap (ODbL) | Use OSM, attribute properly |

---

## 4. Hardware & Deployment Resources

### 4.1 Kiosk Hardware Options

| Option | Specs | Est. Cost | Pros | Cons |
|--------|-------|-----------|------|------|
| **Raspberry Pi 5 + Touch Display** | 8GB RAM, 15" touch | ~$300/unit | Cheap, maintainable | Less polished |
| **Commercial Android Tablet** | 10-15", rugged case | ~$400/unit | Integrated, reliable | Less flexible |
| **Intel NUC + Touch Screen** | Full x86, 16GB RAM | ~$800/unit | Powerful, standard | Expensive |
| **Chromebox + Touch Display** | Chrome OS | ~$500/unit | Secure, managed | Limited offline |

### 4.2 Deployment Locations (Proposed)

| Location | Foot Traffic | WiFi Available | Contact | Priority |
|----------|--------------|----------------|---------|----------|
| **CVB Visitor Center** | High | Yes | 440-275-3202 | 1st |
| **Geneva-on-the-Lake (Arcade)** | High | Yes | TBD | 1st |
| **Downtown Ashtabula** | Medium | Yes | Chamber | 2nd |
| **Jefferson Courthouse** | Medium | Yes | County | 2nd |
| **Selected Wineries** | Medium | Varies | Individual | 3rd |
| **Covered Bridge Festival** | Very High | No | Event org | Event |

### 4.3 Infrastructure Requirements

| Requirement | Solution | Cost |
|-------------|----------|------|
| **Hosting** | Firebase/Vercel + xai server | $0-20/mo |
| **Domain** | concierge.ashtabula.xyz | $12/yr |
| **SSL Certificate** | Let's Encrypt | Free |
| **CDN** | Cloudflare | Free tier |
| **Monitoring** | UptimeRobot | Free tier |

---

## 5. Documentation & Templates

### 5.1 Templates to Create

| Template | Purpose | Status |
|----------|---------|--------|
| **Business Partnership Agreement** | Wineries, restaurants opt-in | TODO |
| **CVB Partnership Proposal** | Formal proposal to CVB | TODO |
| **Data Update Request Form** | Businesses update their info | TODO |
| **User Feedback Form** | Capture visitor suggestions | TODO |
| **Kiosk Placement Agreement** | Venues hosting hardware | TODO |

### 5.2 Reference Documents to Gather

| Document | Source | Status |
|----------|--------|--------|
| CVB Official Map PDF | visitashtabulacounty.com | DOWNLOADED |
| Covered Bridges Map PDF | barnquiltsashtabulacounty.com | DOWNLOADED |
| County Tourism Plan | ashtabulacounty.us | REQUEST NEEDED |
| Wineries Association Contact List | OSU Extension | REQUEST NEEDED |

---

## 6. Outreach Tracker

| Organization | Date Contacted | Response | Next Action |
|--------------|----------------|----------|-------------|
| Ashtabula County CVB | — | — | Send partnership proposal |
| OSU Extension | — | — | Request winery contacts |
| HeyGen Sales | — | — | API evaluation |
| ElevenLabs | — | — | Confirm pricing |
| Geneva-on-the-Lake Chamber | — | — | Intro email |

---

## 7. Open Questions

1. **Does the CVB have an existing digital strategy** we should align with?
2. **Are there any existing kiosk installations** in the county we should avoid duplicating?
3. **What's the WiFi reliability** at proposed deployment locations?
4. **Is there budget** available from the CVB or county for this project?
5. **Are wineries open to API integrations** or will manual updates be required?
6. **What languages** are most needed beyond English? (Spanish? Mandarin?)

---

## 8. Resource Procurement Checklist

### Immediate (This Week)
- [ ] Draft CVB partnership proposal
- [ ] Create business outreach email template
- [ ] Set up API test accounts (Gemini, ElevenLabs)
- [ ] Download and parse available PDF maps
- [ ] Create data schema for attractions database

### Short-term (Next 2 Weeks)
- [ ] Send CVB partnership proposal
- [ ] Contact 5 pilot wineries
- [ ] Evaluate HeyGen vs DIY avatar approach
- [ ] Identify 3 kiosk deployment locations
- [ ] Create sample conversation dataset

### Medium-term (Next Month)
- [ ] Secure CVB partnership agreement
- [ ] Sign up 10+ businesses for directory
- [ ] Order/procure kiosk hardware for testing
- [ ] Establish data update workflow
- [ ] Draft content license agreements

---

*End Phase 2 Resource Procurement*
