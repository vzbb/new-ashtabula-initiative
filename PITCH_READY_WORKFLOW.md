# NAI Pitch-Ready Workflow

**The goal:** When a buyer sees their MVP, they feel like someone already built it FOR THEM. Not "we could build this" — "this is already yours, just claim it."

---

## The Philosophy

> "Here it is. It's already built. It's ridiculously better than what you have. It's already branded for you — IT'S ALREADY YOURS. Pay a small fee, put it on your domain, and you're now at the pinnacle of tech among your competitors."

The sale happens before the meeting. The demo is not a pitch — it's a reveal. They're not deciding whether to buy something. They're deciding whether to claim something that's clearly, obviously theirs.

---

## The 5-Gate Pipeline

Each gate must pass before moving to the next. No skipping.

```
GATE 1: VERIFY     →  GATE 2: BRAND    →  GATE 3: WEAPONIZE  →  GATE 4: PREP    →  GATE 5: DELIVER
  "Does it work?"     "Is it theirs?"     "Can they refuse?"    "What do I say?"    "Can we go live?"
```

---

## GATE 1: VERIFY — "Does it actually work?"

**Owner:** Dev Agent  
**Exit criteria:** The site renders correctly, all interactions work, no console errors, mobile-responsive.

### Steps:
1. `./nai scan` — confirm build healthy, dist exists, no base mismatches
2. Screenshot the live site: `./nai screenshots --live --slugs <slug>`
3. Manual QA checklist:
   - [ ] Page loads without console errors
   - [ ] All buttons/inputs/linkclickable and functional
   - [ ] Forms submit (even if backend is mock)
   - [ ] Mobile viewport renders correctly (375px width)
   - [ ] No placeholder text, no lorem ipsum
   - [ ] No broken images or 404 asset paths
   - [ ] AI features (if any) degrade gracefully without API key
4. Run a local build: `cd websites/<folder> && npm run build`
5. Verify: `ls -la dist/` — index.html + assets exist, >1KB

**Fail = fix before proceeding.** Do not brand a broken product.

---

## GATE 2: BRAND — "Is it unmistakably theirs?"

**Owner:** PM Agent  
**Exit criteria:** A buyer would immediately recognize this as built FOR THEM, not adapted from a template.

### Steps:

#### 2a. Research the buyer
1. Read `lead_research_json/<slug>.json` — who is the target?
2. Read `brandkits/<slug>.json` — what colors, typography, voice?
3. Read `branding_research/<slug>/branding.md` — what assets exist?
4. Visit the buyer's actual website — what does their real branding look like?

#### 2b. Apply buyer-specific branding
- [ ] **Colors** match the buyer's actual brand (not generic, not "close enough")
- [ ] **Logo/Seal** present in header — their actual logo, not a placeholder
- [ ] **Business name** appears prominently — correct spelling, correct formatting
- [ ] **Voice/tone** matches their industry (municipal = official, contractor = direct, restaurant = warm)
- [ ] **Local data** pre-populated:
  - Street names from their service area
  - Landmarks near their location
  - Actual phone numbers, addresses
  - Their real service categories, pricing, or product names
- [ ] **Favicon** is theirs, not the default Vite icon
- [ ] **Page title** includes their business name
- [ ] **OG meta tags** reference their business

#### 2c. Remove template artifacts
- [ ] No reference to "Ashtabula" generically when it should be THEIR city/town
- [ ] No default Vite or React boilerplate visible
- [ ] No placeholder images from unsplash or stock
- [ ] No dead Gemini API key references in README if the site doesn't use AI

**The test:** If you showed this site to the buyer, would they say "this looks like ours" or "this looks like a template you adapted"?

---

## GATE 3: WEAPONIZE — "Can they possibly refuse?"

**Owner:** Sales Agent  
**Exit criteria:** The site contains psychological elements that make refusal feel like a loss.

### Irresistible Offer Elements (from THE_CLOSER):

- [ ] **Urgency Banner** — "🔥 Launch Pricing — 60% Off First Year | Only 3 pilot spots | [BY INVITATION ONLY]"
- [ ] **Claim CTA** — "✨ Claim Your [TOOL NAME] →" as primary button
- [ ] **Trust Badges** (3 minimum):
  - 🛡️ 30-Day Satisfaction Guarantee
  - 🔒 Secure & Local — Ohio-hosted
  - 🏆 Join X+ [peer organizations]
- [ ] **Loss Aversion Alert** — "⚠️ Don't let [competitor] get the AI-first advantage"
- [ ] **ROI Teaser** — "💰 Projected Annual Impact: $XX,XXX savings | XX hrs/week recovered"
- [ ] **Go-Live Promise** — "⚡ 48 Hours — From 'Yes' to 'Live'. No IT headaches."
- [ ] **Personalized Footer:**
  - Organization seal/logo
  - "Your Dedicated NAI Representative" box
  - Michael Vega contact: 440-555-NAI1 / michael@noirsys.com
  - Schedule Demo button

### Psychology calibration:
| Element | What it does |
|---------|-------------|
| Scarcity ("3 spots") | Creates urgency to act NOW |
| Exclusivity ("By invitation only") | They're special, not mass-marketed |
| Loss aversion ("Don't let competitors...") | Fear of missing out > desire to gain |
| Social proof ("Join X+ others") | Reduces perceived risk |
| Risk reversal ("30-day guarantee") | Removes the last objection |
| Speed promise ("48 hours") | Eliminates "this will take months" fear |

---

## GATE 4: PREP — "What do I say when they're interested?"

**Owner:** Sales Agent  
**Exit criteria:** A personalized demo script, talking points, and objection handlers exist for THIS specific buyer.

### Demo Script Template:

```
OPENING (30 seconds):
"I didn't bring a generic demo — I brought YOUR [tool name]. 
Notice your [logo/colors/seal]? Your [street names/data] in the examples? 
This isn't a concept. This is YOUR tool, ready to go live."

THE WALKTHROUGH (2 minutes):
"Let me show you how it solves [their specific pain point]..."
[Walk through the primary use case using THEIR data]

THE PROOF (1 minute):
"[Similar organization] is already seeing [specific result]."

THE CLOSE (30 seconds):
"This can be live on your domain by [day of week]. 
What's stopping us from starting a 30-day pilot?"
```

### Prep checklist:
- [ ] Personalized demo script written (use template above)
- [ ] 3 talking points specific to THIS buyer's pain points
- [ ] ROI justification with real numbers
- [ ] Competitor comparison (who in their space has better tech?)
- [ ] Answers to 5 most likely objections:
  1. "We don't have budget" → Pilot is free, ROI covers cost in 90 days
  2. "We need to think about it" → "What specifically do you need to think through?"
  3. "We already have a website" → "This isn't a replacement — it's a tool your current site doesn't have"
  4. "Who would maintain it?" → "We handle everything. You get the benefit, we do the work."
  5. "It's too technical for us" → "If you can use Facebook, you can use this. Zero training needed."

---

## GATE 5: DELIVER — "Can we actually go live?"

**Owner:** Dev Agent  
**Exit criteria:** We can deploy to a custom domain within 48 hours of a "yes."

### Steps:
1. Confirm Vercel project can accept custom domains
2. Prepare DNS instructions (CNAME record to `cname.vercel-dns.com`)
3. Verify SSL will auto-provision
4. Have pricing ready:
   - One-time setup fee
   - Monthly hosting/maintenance
   - Annual contract discount
5. Prepare a "Welcome Live" email template for post-payment

---

## Workflow Summary

```
GATE 1: VERIFY     →  Screenshot, test, build check
GATE 2: BRAND      →  Colors, logo, local data, remove template smell
GATE 3: WEAPONIZE  →  Urgency, trust badges, loss aversion, ROI, CTA
GATE 4: PREP       →  Demo script, talking points, objection handlers
GATE 5: DELIVER    →  Domain readiness, pricing, go-live plan
```

**When all 5 gates pass:** The MVP is pitch-ready. The conversation isn't "would you buy this?" — it's "this is already yours, let's make it official."
