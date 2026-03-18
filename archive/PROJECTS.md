# NEW ASHTABULA INITIATIVE — PROJECTS.md

**Purpose:** High‑visibility log of ongoing work, status, and next actions.

---

## ✅ ACTIVE WORKSTREAMS

### 1) Landing Page — Professionalization
- **Goal:** Make main landing page credible, community‑rescue tone, buyer‑ready.
- **Status:** Expanded Infrastructure section (Variant B mission copy + accent panel), removed MVP filters, added 9 teaser cards; deployed to production.
- **Next:** Verify contact form email delivery; confirm rollback decision if needed

### 2) MVP Branding — Targeted by Business
- **Goal:** Every MVP is branded to a specific business/lead (no generic sites).
- **Status:** NEW FOCUS
- **Next:** Create per‑site target list and branding plan; update MVPs accordingly.

### 3) Tier‑1 Outreach Prep
- **Status:** READY (drafts + demos + follow‑ups prepared)
- **Next:** Contact research + send schedule

### 4) Tier‑2 Verification
- **Status:** PENDING
- **Next:** GOTL + BoxFlow + Box Builder checks

---

## 🔁 RECURRING: Branding Rounds
- **Goal:** Ensure each SPA is branded for a specific buyer/lead.
- **If unbranded:** research candidate buyers → duplicate site if multiple targets.
- **Checklist:** `BRANDING_ROUND_CHECKLIST.md`

---

## 📌 Notes
- Keep outreach emails **from Rondell Williams**.
- Do not send outreach until manual Tier‑1 verification is complete.

## 🔁 Branding Round Checklist (Recurring)
- [ ] Run per‑site branding audit
- [ ] Identify unbranded/generic sites
- [ ] Research 2–3 target buyers per site
- [ ] Duplicate + re‑skin for each buyer
- [ ] Log updates here

### Landing Page — Review Checklist
- Checklist: `LANDING_PAGE_REVIEW_CHECKLIST.md`
- Pending: approve copy + verify contact form delivery

### Gemini CLI Auth
- Status: logged in via browser (satterlee@gmail.com)
- Note: CLI uses browser auth; cron uses CLI auth (no API key exports)

### Branding Round Log
- Template: `BRANDING_ROUND_TEMPLATE.md`

### Landing Page — Deploy
- Deployed updated landing page to https://new-ashtabula-initiative.vercel.app

### Gemini MVP Generator
- Status: still failing with API key in cron environment
- Next: force CLI auth by unsetting GEMINI_API_KEY/VITE_GEMINI_API_KEY in cron payload

### Landing Page — Preview
- Prefer `file://` local preview (avoid local ports when possible)

### Landing Page — Hopeful Tone Update
- Updated to “Full‑Scale Infrastructure Modernization” messaging
- Accent color shifted to modern cyan/teal
- Removed rescue/urgent phrasing + tech jargon
- Header label set to NEW.ASHTABULA.INITIATIVE
