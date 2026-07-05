# Brand Insights: Scheduler & Scheduler-SMS

## Overview

Extracted from `lead_research_json/scheduler.json` + live site code for `scheduler` and
`scheduler-sms`. The scheduler-sms lead research JSON does not yet exist — the brand
insights here are drawn from the deployed MVP source code (App.jsx, App.css) and the
existing audit/screenshot records.

---

## 1. Buyer Personas

### Persona A — The Service Business Owner (HVAC / Contractor)
- **Example:** Blank Heating Company Inc. (3-generation family HVAC)
- **Behavior:** Phone-only booking, uses web "Request Appointment" form but no real-time
  scheduling
- **Tech level:** Modest — has a website but hasn't adopted online booking
- **Motivation:** Reduce time on the phone during peak seasons (winter heating, summer AC),
  capture after-hours requests
- **Fear:** Losing calls / missing urgent service during busy months
- **Decision trigger:** FREE in-home estimates, NATE-certified technicians, family heritage

### Persona B — The Salon / Personal Services Owner
- **Example:** Ultimate Appearance Salon (4702 Main Ave, Ashtabula)
- **Behavior:** Phone-only booking, active on Instagram + Facebook, gift cards via Phorest
- **Tech level:** Higher — uses social media, understands digital tools
- **Motivation:** Instagram "Book Now" button, reduced phone interruptions during client
  service hours
- **Fear:** Double bookings, missed appointment inquiries through social media

### Persona C — The Auto Repair / Fixed-Ops Shop
- **Example:** Route 20 Auto Repair
- **Behavior:** Appointment-based with diagnostic scheduling, sends digital inspections via
  text/email
- **Tech level:** Moderate — already uses digital customer communication tools
- **Motivation:** Customer self-service booking, after-hours scheduling, transparent
  appointment windows
- **Fear:** No-show diagnostic slots that waste shop time

### Persona D — The Medical / Dental Clinic
- **Example:** Rural Health Clinic of Ashtabula (LECOM Health)
- **Behavior:** Phone-only, limited hours (4 days/week)
- **Tech level:** Low-moderate — corporate IT decisions likely for EHR integration
- **Motivation:** Efficient scheduling for limited-hours operations, reduced phone volume
- **Fear:** Patient no-shows wasting appointment slots

---

## 2. Industry Context

| Factor | Observation |
|--------|-------------|
| Current booking method | 100% of researched leads use phone-only booking |
| Online booking adoption | Very low — "opportunity for market penetration" |
| Competitive landscape | Calendly, Housecall Pro, ServiceTitan, Square Appointments, HeyGoldie |
| Local advantage | Niche focus on Ashtabula County businesses with personalized onboarding |
| Market validation | No public emails found — businesses rely entirely on phone outreach |

**Key insight:** The market gap is real and verified. Every single lead is phone-only. The
scheduler doesn't compete on features with national platforms — it competes on *local
presence*, *personal onboarding*, and *Ashtabula-specific trust*.

---

## 3. Pain Points (Across All Personas)

1. **Phone dependency** — All leads rely on incoming phone calls to book. This means
   missed calls = lost revenue, and staff time spent on scheduling is taken from
   service delivery.
2. **No after-hours booking** — HVAC emergencies and salon appointment requests happen
   outside business hours. No online option means no capture.
3. **No-show problem** — No automated reminders means customers forget. The SMS version
   directly addresses this.
4. **Peak season overwhelm** — HVAC in winter/summer, salons before holidays — phone
   lines get buried.
5. **No customer self-service** — Customers can't see available slots, reschedule, or
   cancel without calling.
6. **Limited hours constraints** — Rural Health Clinic operates 4 days/week, making
   every missed slot expensive.

---

## 4. Sentiment & Emotional Drivers

- **Trust anxiety** — Local business owners are skeptical of "national platforms" that
  charge per booking. The Ashtabula County angle matters.
- **Heritage pride** — Blank Heating's "3 generations" framing is not just branding;
  it's a trust signal that resonates locally.
- **Overwhelmed but resourceful** — Small businesses want better tools but can't
  justify Calendly/Housecall Pro pricing for their size.
- **Peer proof matters** — "The HVAC shop on Route 20 uses it" carries more weight
  than any ad campaign.

---

## 5. What Makes the Scheduling Tools Unique & Appealing

### Base Scheduler (Blank Heating focus)
- **Whitelabel by design** — Logo swap, color palette, service types, hours. Not a
  one-size-fits-all SaaS.
- **HVAC-contextual booking** — Service types (heating repair, AC service, checkup,
  estimate, IAQ) match real business workflows
- **After-hours capture** — "Send a service request any time of day" is the primary
  value prop
- **Local first** — "Comfort-first scheduling", "Built for busy homeowners", Ashtabula
  County references throughout
- **Multi-vertical potential** — HVACK, salon, medical, auto, pet, fitness, dental

### Scheduler-SMS
- **Proactive no-show prevention** — The primary value prop is "set up reminders and
  forget it"
- **Automated multi-channel** — SMS + email reminders with configurable timing (1 hour
  to 1 week)
- **Client self-service** — Reply CONFIRM or CANCEL via text — reduces call volume
  further
- **Mobile-first design** — Purple (#8b5cf6) color scheme with SMS/message iconography
  is distinct from the base scheduler's blue+orange
- **Delivery tracking** — "Track message delivery and client responses in real-time"
- **Complementary upsell** — The SMS version isn't a replacement for the scheduler; it's
  the layer on top that adds proactive reminders

---

## 6. Visual Direction Summary

| Attribute | Scheduler | Scheduler-SMS |
|-----------|-----------|---------------|
| Primary color | Blue #2B6CB0 | Purple #8b5cf6 |
| Accent color | Orange #ED8936 | Green #34d399 (success) |
| Background | Light gray #F7FAFC | Gradient #faf5ff → white |
| Typography | Clean professional sans-serif | Inter / system-ui |
| Iconography | FlameMark (heat+cool SVG) | SMS bubble, message, bell, smartphone |
| Mood keywords | Professional, dependable, family-owned, quality | Automated, modern, mobile, reliable |
| Brand tagline | "Book Appointments. Save Time." | "Appointment Reminders" |
| Target industry | HVAC (primary), adaptable to others | Any appointment-based business |

---

## 7. Copy Tone Guidelines

- **Base Scheduler:** Honest, warm, family-owned. Use phrases like "your neighborhood HVAC
  team", "three generations serving Ashtabula families", "free in-home estimates with clear
  equipment options". Avoid corporate SaaS language.
- **Scheduler-SMS:** Direct, reassuring, capable. Use phrases like "Reduce no-shows with
  automated text reminders", "Set up once, we'll handle the rest", "Clients can confirm or
  cancel with a simple text reply." Emphasize ease of setup and hands-off automation.
- **Both:** Never use "powered by AI", "cutting-edge", "disruptive" — these alienate the
  buyer. Instead: "online booking that works for your business", "reminders your customers
  will actually see".

---

## 8. Cross-Sell Opportunity

The scheduler and scheduler-SMS serve the same market at different stages of the customer
journey:

```
Business starts using scheduler → Discovers SMS reminders → Reduces no-shows
```

Together they create a complete booking + retention loop. Marketing should present them as
layers, not alternatives.

---

## File References

- `lead_research_json/scheduler.json` — Lead research (5 high-fit leads)
- `lead_research_json/scheduler_research_log.txt` — Research methodology log
- `brandkits/scheduler.json` — Existing brandkit by @nai-creative
- `branding_research/scheduler/branding.md` — Existing branding notes
- `branding_research/scheduler/assets/` — Logo + favicon assets
- `websites/scheduler/src/App.jsx` — Base scheduler source (Blank Heating)
- `websites/scheduler-sms/src/App.jsx` — SMS reminder source
- `email_prospects/scheduler_emails.json` — Phone-only lead verification
- `audit_results/service-scheduler-sms.txt` — Visual audit (branding score: 6/10)
- `sitemap_screenshots/033_scheduler-sms.txt` — Live site metadata

**Note:** `lead_research_json/scheduler-sms.json` does not exist yet. Consider creating it
when lead research for the SMS-specific buyer personas is needed.
