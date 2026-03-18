# AI Docent — Phase 2 Resource Procurement
## New Ashtabula Initiative | MVP Resource Document

**Date:** February 20, 2026  
**Status:** Phase 2 Complete → Ready for SPEC Development  
**Previous:** Phase 1 Research ✅

---

## 1. Primary Stakeholder Contacts

### Museum & Cultural Sites

| Institution | Contact | Phone | Email | Website | Notes |
|-------------|---------|-------|-------|---------|-------|
| **Ashtabula County Historical Society** | General/volunteer-run | 866-533-3277 | ashcohs@gmail.com | ashtabulahistory.com | 3 properties, all-volunteer |
| **Hubbard House UGRR Museum** | General/volunteer-run | (440) 964-8168 | — | hubbardhouseugrrmuseum.org | Website offline, FB active |
| **Ashtabula Maritime Museum** | General/volunteer-run | 440-964-6847 | — | ashtabulamaritime.org | Memorial Day–August |
| **Victorian Perambulator Museum** | Sisters (owners) | (440) 576-9588 | — | perambulatormuseum.com | World's only, 15 rooms |

### Tourism & Economic Development

| Organization | Contact | Title | Phone | Email | Relevance |
|--------------|---------|-------|-------|-------|-----------|
| **Ashtabula County Visitors Bureau** | Stephanie Seigel | Executive Director | 440-275-3202 | visitus@visitashtabulacounty.com | County tourism lead, potential partner |
| **Visit Ashtabula County** | — | General | 440-275-3202 | visitus@visitashtabulacounty.com | 500K+ wine trail visitors |
| **Geneva Area Chamber** | — | — | — | genevachamber.org | ACHS listed member |
| **Jefferson Area Chamber** | — | — | — | jeffersonchamber.com | Visitors Bureau member |

---

## 2. Key Personnel to Identify

### Priority Outreach Targets

1. **ACHS Board President/Chair**
   - Needed for: Partnership approval, pilot site selection
   - How to reach: Call 866-533-3277, request board contact
   - Ask for: Decision-maker for technology partnerships

2. **Hubbard House UGRR Curator/Director**
   - Needed for: Historical content accuracy, UGRR narrative expertise
   - How to reach: Call (440) 964-8168, leave detailed message
   - Note: Website is offline — may indicate funding/technical struggles (opportunity)

3. **Maritime Museum Director**
   - Needed for: Harbor/nautical artifact expertise
   - How to reach: Call 440-964-6847, request director callback

4. **Victorian Perambulator Museum Owner**
   - Needed for: Specialty museum perspective, unique collection stories
   - How to reach: Call (440) 576-9588 during hours
   - Note: Privately owned — may be more agile for partnership

5. **Stephanie Seigel (Visitors Bureau)**
   - Needed for: County-wide tourism integration, grant coordination
   - How to reach: Email visitus@visitashtabulacounty.com
   - Pitch: "Digital accessibility initiative for all county museums"

---

## 3. Potential Funding Sources

| Source | Type | Amount Range | Fit | Contact Path |
|--------|------|--------------|-----|--------------|
| **Ohio Arts Council** | Grant | $5K–$50K | High | ohioartscouncil.org |
| **National Endowment for the Humanities** | Grant | $10K–$350K | High | neh.gov (Digital Humanities) |
| **Ohio Historical Society** | Grant/In-kind | Varies | High | ohiohistory.org |
| **Ashtabula County Foundation** | Local Grant | $1K–$10K | Medium | ashtabulacountyfoundation.org |
| **Lake Erie Coastal Trail** | Partnership | In-kind | Medium | Through Visitors Bureau |

---

## 4. Technical Resources

### AI/API Resources
| Resource | Use | Cost | Notes |
|----------|-----|------|-------|
| **Gemini API** | Image-to-description | Free tier: 60 req/min | Already using |
| **ElevenLabs** | Audio narration | $5–$22/month | TTS for accessibility |
| **OpenAI Whisper** | Audio descriptions | API per-minute | Transcription backup |
| **Google Cloud Vision** | Object detection | Free tier: 1000 units/mo | Artifact identification |

### Infrastructure
| Resource | Use | Cost | Notes |
|----------|-----|------|-------|
| **Firebase** | Hosting, DB | Spark: Free | Already using |
| **Vercel** | Frontend hosting | Free tier | Deploy React app |
| **Cloudflare** | CDN, QR redirects | Free tier | QR code management |

---

## 5. Content Resources

### Historical Data Sources
1. **ACHS Research Hub** — archives, photos, documents
2. **Ohio Memory Project** — digital archive (ohiomemory.org)
3. **Digital Public Library of America** — artifacts, images
4. **Smithsonian Open Access** — comparative artifacts
5. **Library of Congress** — UGRR primary sources

### Image/Photo Resources
- ACHS photo archives (contact for usage rights)
- Historic Ashtabula Harbor photos (public domain, pre-1929)
- Maritime Museum vessel documentation

---

## 6. Partnership Opportunities

### Win-Win Partnerships

| Partner | What They Get | What We Get |
|---------|---------------|-------------|
| **Visitors Bureau** | Modern tourism offering, "tech-forward" narrative | Promotion, visitor traffic, legitimacy |
| **ACHS** | Free digital docent, accessibility compliance | Pilot site, content, credibility |
| **Local Schools** | Educational tool, field trip enhancement | User testing, youth engagement |
| **Wineries** | Cross-promotion (wine + history tours) | Tourist traffic, adult demo |
| **Geneva-on-the-Lake** | Extended visitor engagement | Beach tourist overflow |

### Pitch Templates

**For Museums:**
> "We're developing a free pilot program to give visitors instant, AI-powered information about your artifacts — no app download, no expensive hardware, just a QR code and their phone. Would you be open to a 15-minute call to discuss how this could work for [Museum Name]?"

**For Visitors Bureau:**
> "I'm reaching out about a digital accessibility initiative that could position Ashtabula County museums as leaders in inclusive tourism. Our AI Docent project provides instant audio descriptions and multilingual support via smartphone. Could we schedule a brief call to explore partnership opportunities?"

---

## 7. Next Steps for SPEC Development

### Required Before SPEC
- [ ] Contact ACHS (ashcohs@gmail.com) — request board president intro
- [ ] Contact Hubbard House — assess interest, technical capacity
- [ ] Contact Stephanie Seigel — gauge Visitors Bureau partnership potential
- [ ] Draft pilot proposal (1-page) for museum review

### SPEC Sections to Draft
1. **System Architecture** — QR → Cloud Function → Gemini → TTS
2. **Content Model** — Artifact schema, narrative templates
3. **Accessibility Features** — Audio descriptions, multilingual, visual impairment support
4. **Pilot Scope** — 1 museum, 10–20 artifacts, 30-day trial
5. **Success Metrics** — Usage stats, visitor feedback, museum satisfaction

---

## 8. Risk Mitigation Resources

| Risk | Mitigation Resource |
|------|---------------------|
| Museum distrust of "tech" | Emphasize no hardware, no cost, easy removal |
| Content accuracy concerns | Partner with ACHS historians for review |
| Volunteer capacity | Zero training required — fully automated |
| Funding sustainability | Free tier sufficient for pilot; grants for scale |
| Visitor adoption | QR codes on existing signage — no behavior change |

---

**Document Status:** Ready for Phase 3 SPEC development  
**Last Updated:** February 20, 2026  
**Next Action:** Outreach to ACHS and Visitors Bureau for partnership confirmation
