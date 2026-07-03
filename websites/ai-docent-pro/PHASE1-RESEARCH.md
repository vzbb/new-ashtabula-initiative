# AI Docent Pro — Phase 1 Research

**Project:** ai-docent-pro  
**Focus:** Ashtabula Maritime Museum — Photo-to-Narration AI Docent  
**Date:** February 19, 2026  
**Researcher:** Rondell / Noirsys AI

---

## 1. Problem Statement

### Current Pain Point
The Ashtabula Maritime Museum (and similar small maritime museums) relies entirely on volunteer docents who are:
- Available only limited hours (weekends, seasonal)
- Unable to provide consistent narration quality across all artifacts
- Limited in language accessibility
- Unable to serve self-guided visitors during off-hours

### Visitor Experience Gap
- 70%+ of museum visitors prefer self-guided exploration (industry standard)
- Small museums cannot afford commercial audio guide systems ($5K–$20K+)
- No visual recognition system to identify unlabeled artifacts
- Written placards are static, limited in detail, and deteriorate

### Institutional Challenge
- Volunteer recruitment is declining nationally (22% drop since 2019)
- Training new docents takes 20–40 hours per volunteer
- Artifact cataloging is inconsistent and often digitized only partially

---

## 2. Market & Stakeholder Research

### Primary Target: Ashtabula Maritime Museum

**Location:** 1071 Walnut Blvd, Ashtabula, OH 44004  
**Status:** Volunteer-run nonprofit  
**Annual Visitors:** ~8,000–12,000 estimated  
**Current Technology:** Basic website, no digital exhibits  
**Contact:** (440) 964-8167  
**Key Personnel:**
- Board President: [Research needed]
- Curator: [Research needed]
- Volunteer Coordinator: [Research needed]

### Secondary Targets (Maritime Museum Network)

| Museum | Location | Visitors/Year | Tech Level |
|--------|----------|---------------|------------|
| Fairport Harbor Marine Museum | Fairport Harbor, OH | ~5,000 | Basic |
| Great Lakes Historical Society | Vermilion, OH | ~15,000 | Moderate |
| National Museum of the Great Lakes | Toledo, OH | ~40,000 | Advanced |
| Door County Maritime Museum | WI | ~35,000 | Moderate |
| Wisconsin Maritime Museum | Manitowoc, WI | ~45,000 | Advanced |

**Strategic Insight:** If ai-docent-pro succeeds at Ashtabula Maritime, it becomes a template for 50+ Great Lakes maritime museums with similar constraints.

### Visitor Personas

**Persona 1: Curious Carl**
- 58-year-old history buff, visiting with spouse
- Wants deep context on shipwrecks and harbor history
- Frustrated by skimpy placards, wants stories
- Tech comfort: Moderate (uses smartphone, not apps)

**Persona 2: Family Fiona**
- 42-year-old parent with 2 kids (ages 8, 11)
- Wants engaging content that holds children's attention
- Needs audio (kids can't/won't read long text)
- Tech comfort: High (kids expect interactive experiences)

**Persona 3: International Ivan**
- Tourist from abroad, limited English proficiency
- Needs multilingual support
- Visual recognition helps overcome language barriers
- Tech comfort: High (relies on translation apps)

**Persona 4: Educator Ellen**
- 35-year-old teacher planning field trip
- Needs accurate, curriculum-aligned content
- Wants to preview museum experience
- Tech comfort: Moderate

---

## 3. Competitor Analysis

### Direct Competitors

| Solution | Price | Photo Recognition | TTS | Target |
|----------|-------|-------------------|-----|--------|
| **Smartify** | $5K–$15K setup + $500/mo | ✅ Yes | ✅ Yes | Large museums |
| **Bloomberg Connects** | Free for museums | ❌ No | ✅ Yes | Broad network |
| **Guidekick** | $10K+ setup | ❌ No | ✅ Yes | Mid-size museums |
| **Ava Robotics** | $3K–$10K/mo | ✅ Yes | ✅ Yes | Enterprise |

**Gap Identified:** No affordable solution for small museums with photo-to-narration capability.

### Indirect Competitors
- **Google Lens + Search:** Free, but no curated narration, inconsistent quality
- **Museum-specific apps:** Usually lack visual recognition, require manual navigation
- **Audio guide rentals:** $3–$5/visitor, requires hardware management

### Competitive Advantage (ai-docent-pro)
- **Cost:** ~$50–$150/mo at scale vs. $5K+ competitors
- **Zero hardware:** Uses visitor smartphones
- **Photo-first:** Visitors snap first, learn second (intuitive)
- **Offline capable:** Cache content for poor cellular areas
- **Museum-branded:** White-label appearance

---

## 4. Technical Feasibility Assessment

### Core Technology Stack

**Image Recognition Pipeline:**
1. **Option A (Gemini Vision):** Direct image-to-text via Gemini 1.5 Flash/Pro
   - Pros: Single API, handles both recognition + narration
   - Cons: Higher per-request cost (~$0.003–$0.015/image)
   
2. **Option B (Hybrid):** Custom YOLO/CLIP model for artifact detection + Gemini for narration
   - Pros: Lower API costs at scale, works offline
   - Cons: Requires training data, more complex

3. **Option C (Cloud Vision + Gemini):** Google Cloud Vision for labeling + Gemini for narration
   - Pros: Reliable object detection, cost-effective
   - Cons: Multiple API calls, vendor lock-in

**Recommendation:** Start with Option A (Gemini Vision), migrate to B if volume exceeds 10K images/month.

**Text-to-Speech Options:**
| Provider | Cost/1M chars | Voice Quality | Latency |
|----------|---------------|---------------|---------|
| ElevenLabs | $5–$30 | Exceptional | Low |
| Google Cloud TTS | $4–$16 | Good | Low |
| OpenAI TTS | $15 | Good | Low |
| Browser Web Speech API | Free | Variable | Instant |

**Recommendation:** ElevenLabs for production quality, Web Speech API as fallback.

### Technical Architecture (High-Level)

```
Visitor uploads photo
        ↓
[Image Preprocessing] → Resize, compress, format
        ↓
[Gemini Vision API] → "Identify this maritime artifact"
        ↓
[Confidence Check] → >0.7? Proceed : Ask for clarification
        ↓
[Gemini Pro] → Generate narration (120 words, age-appropriate)
        ↓
[TTS Service] → Convert to audio
        ↓
[Visitor Experience] → Display text + play audio
        ↓
[Analytics] → Log interaction (anonymized)
```

### Data Model (Artifacts)

```typescript
interface Artifact {
  id: string;
  museumId: string;
  name: string;
  description: string;
  historicalContext: string;
  yearRange: [number, number];
  category: 'tool' | 'equipment' | 'vessel' | 'document' | 'image';
  images: string[]; // URLs to reference photos
  verifiedFacts: string[];
  relatedArtifacts: string[];
  generatedNarrations: Narration[];
}

interface Narration {
  id: string;
  artifactId: string;
  version: number;
  tone: 'formal' | 'conversational' | 'child';
  wordCount: number;
  text: string;
  audioUrl?: string;
  generatedAt: Date;
  verifiedBy?: string; // curator email
}
```

---

## 5. Revenue Model Options

### Option A: Museum SaaS Subscription (Recommended)
- **Starter:** $49/mo — 1 museum, 50 artifacts, basic TTS
- **Professional:** $99/mo — Unlimited artifacts, ElevenLabs voices, analytics
- **Enterprise:** $199/mo — Multi-location, custom training, priority support

### Option B: Per-Visitor Model
- $0.25–$0.50 per unique visitor
- Aligns costs with usage
- Harder to predict revenue

### Option C: Grant-Funded Nonprofit
- Seek Ohio Arts Council, National Maritime Heritage grants
- Free for qualifying small museums
- Sustainability concerns

**Recommendation:** Option A with 501(c)(3) discount (20% off).

---

## 6. Critical Blockers for Phase 2

1. **Image Recognition Accuracy:** Will Gemini Vision reliably identify maritime artifacts without training data? → **Mitigation:** Test with 20+ sample photos before commitment

2. **Content Accuracy:** AI-generated historical facts may hallucinate → **Mitigation:** Curator verification workflow required

3. **Cellular Connectivity:** Ashtabula Maritime Museum has weak indoor cell signal → **Mitigation:** Offline caching, WiFi provision

4. **Museum Buy-In:** Volunteer-run org may resist technology adoption → **Mitigation:** Emphasize time-saving, volunteer augmentation not replacement

5. **Copyright Concerns:** Training on museum photos may raise IP questions → **Mitigation:** Clear data ownership terms, opt-in for contributed images

---

## 7. Research Artifacts Cataloged

| Source | Type | URL/Contact | Status |
|--------|------|-------------|--------|
| Ashtabula Maritime Museum | Primary | (440) 964-8167, ashtabulamaritimemuseum.org | Contact needed |
| Ohio Arts Council | Grant | oac.ohio.gov | Bookmarked |
| Smartify | Competitor | smartify.org | Analyzed |
| Bloomberg Connects | Competitor | bloombergconnects.org | Analyzed |
| Great Lakes Historical Society | Partner Candidate | inlandseas.org | Bookmarked |

---

## 8. Phase 2 Resource Procurement Plan

**Target Contacts:**
1. Ashtabula Maritime Museum — Board/Curator for pilot partnership
2. Great Lakes Historical Society — Network expansion
3. Ohio Arts Council — Grant opportunity research
4. 2–3 comparable maritime museums — Validation interviews

**Information Needed:**
- Photo inventory of top 20 artifacts for testing
- Current visitor demographics
- Existing technology infrastructure
- Volunteer coordinator availability
- Annual operating budget (range)

**Success Criteria:**
- 1 museum commits to pilot
- 20+ artifact photos obtained
- Grant opportunities identified
- 2+ comparable museums express interest

---

*Next: Phase 2 — Resource Procurement & Outreach*
