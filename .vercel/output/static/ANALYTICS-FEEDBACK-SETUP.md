# Analytics & Feedback Collection Setup — New Ashtabula Initiative

**Purpose:** Track usage, measure impact, and gather resident feedback for civic tools  
**Scope:** permit-whisperer, contractor-match, invest-ashtabula  
**Privacy-First:** No PII, aggregate only, transparent data practices  

---

## Analytics Strategy

### Option A: Plausible Analytics (Recommended)
**Why:** Privacy-focused, no cookies, GDPR-compliant, lightweight

**Setup:**
```bash
# Self-hosted Plausible (on xai)
docker run -d --name plausible \
  -p 8000:8000 \
  -e BASE_URL=https://analytics.noirsys.com \
  plausible/analytics

# Or use Plausible Cloud (paid, zero maintenance)
# $9/month for unlimited sites
```

**Pros:**
- No cookie banner required
- Open source, can self-host
- Simple dashboard
- Low overhead (~1KB script)

**Cons:**
- Self-hosted needs maintenance
- Cloud version costs $9/mo

### Option B: Vercel Analytics
**Why:** Native integration if deploying to Vercel

**Setup:**
```javascript
// Already included with Vercel Pro ($20/mo)
// Just enable in dashboard
```

**Pros:**
- Zero config if on Vercel
- Real-time data
- Web Vitals tracking

**Cons:**
- Locked to Vercel platform
- Pro plan required ($20/mo)

### Option C: Custom Lightweight
**Why:** Full control, minimal dependencies

**Setup:**
```javascript
// Simple API endpoint + SQLite
// ~50 lines of code
```

**Pros:**
- Full data ownership
- Custom metrics
- No external dependencies

**Cons:**
- Build it yourself
- Dashboard needs to be built

---

## Recommended: Option A (Plausible)

### Implementation

#### Step 1: Add Tracking Script
```html
<!-- In <head> of each tool -->
<script defer data-domain="permit-whisperer.noirsys.com" 
        src="https://analytics.noirsys.com/js/script.js"></script>
```

#### Step 2: Track Custom Events
```javascript
// Track wizard completions
plausible('Wizard Complete', {props: {category: 'shed'}})

// Track fee calculator usage
plausible('Fee Calculation', {props: {project_type: 'deck'}})

// Track form downloads
plausible('Form Download', {props: {form: 'zoning-permit'}})
```

### Key Metrics to Track

| Metric | Tool | Implementation |
|--------|------|----------------|
| Page views | All | Automatic |
| Unique visitors | All | Automatic |
| Wizard starts | permit-whisperer | `plausible('Wizard Start')` |
| Wizard completions | permit-whisperer | `plausible('Wizard Complete')` |
| Fee calculations | permit-whisperer | `plausible('Fee Calc')` |
| Form downloads | permit-whisperer | `plausible('Download')` |
| Contractor searches | contractor-match | `plausible('Search')` |
| Quote requests | contractor-match | `plausible('Quote Request')` |
| Site inquiries | invest-ashtabula | `plausible('Inquiry')` |

---

## Feedback Collection

### In-App Feedback Widget

**Library:** Feedback Fish (free tier: 100 responses/mo)
```html
<script src="https://feedback.fish/sdk" data-feedback-fish="YOUR_ID"></script>
<button data-feedback-fish>Feedback</button>
```

**Alternative:** Custom lightweight form
```javascript
// Simple modal + API endpoint
// Stores to SQLite or Google Sheets
```

### Feedback Questions (Standard)
1. "How easy was it to find what you needed?" (1-5 scale)
2. "Did you complete your task?" (Yes/No/Partially)
3. "What would make this better?" (open text)
4. "Would you recommend this to others?" (1-10 NPS)

### Placement Strategy
| Tool | Feedback Trigger |
|------|------------------|
| permit-whisperer | After wizard completion |
| contractor-match | After quote request submission |
| invest-ashtabula | After contact form submission |
| All | Footer "Give Feedback" link |

---

## Success Metrics Dashboard

### Weekly Report (Auto-generated)
```
Week of 2026-02-17
====================

permit-whisperer:
- Visitors: 234 (↑ 12%)
- Wizard completions: 89 (↑ 8%)
- Avg. completion time: 2m 30s
- Top category: sheds (34%)
- Feedback score: 4.2/5

contractor-match:
- Visitors: 156 (↑ 23%)
- Searches: 67 (↑ 15%)
- Quote requests: 12 (↑ 50%)
- Feedback score: 4.5/5

invest-ashtabula:
- Visitors: 89 (↑ 5%)
- Site inquiries: 3 (↑ 0%)
- Feedback score: 4.0/5
```

### Monthly Summary
- Total residents served
- Task completion rates
- Feedback trends
- City staff time saved (estimated)

---

## Privacy & Compliance

### Data Collection Policy
✅ **We collect:**
- Anonymous usage patterns
- Aggregate completion rates
- Tool performance metrics
- Voluntary feedback text

❌ **We do NOT collect:**
- Names or contact info
- IP addresses (anonymized)
- Personal permit details
- Contractor/client identities

### Transparency
- Privacy policy linked in footer
- "Why we collect data" explainer
- Opt-out option (honor DNT header)
- Data retention: 12 months

---

## Implementation Checklist

### Phase 1: Basic Analytics (30 min)
- [ ] Set up Plausible (self-hosted or cloud)
- [ ] Add tracking script to all tools
- [ ] Configure custom domains
- [ ] Test events are firing

### Phase 2: Custom Events (1 hour)
- [ ] Implement wizard tracking
- [ ] Add form download tracking
- [ ] Set up conversion goals
- [ ] Create dashboard views

### Phase 3: Feedback Collection (1 hour)
- [ ] Add Feedback Fish or custom widget
- [ ] Design feedback modal
- [ ] Set up response storage
- [ ] Create weekly report template

### Phase 4: Reporting (30 min)
- [ ] Configure weekly email reports
- [ ] Set up city stakeholder dashboard
- [ ] Document metrics definitions
- [ ] Train team on interpretation

---

## Cost Estimate

| Component | Option | Monthly Cost |
|-----------|--------|--------------|
| Analytics | Plausible Cloud | $9 |
| Analytics | Self-hosted | $0 (server cost) |
| Feedback | Feedback Fish Free | $0 (100/mo limit) |
| Feedback | Custom | $0 |
| **Total** | Recommended setup | **$9** |

---

## Next Steps

1. **Decision:** Self-hosted vs. Plausible Cloud?
2. **Set up:** Deploy analytics infrastructure
3. **Integrate:** Add tracking to permit-whisperer first
4. **Test:** Verify events are collecting
5. **Report:** Share first week of data with stakeholders

**Ready to implement:** Pick option A/B/C and proceed with Phase 1 checklist.
