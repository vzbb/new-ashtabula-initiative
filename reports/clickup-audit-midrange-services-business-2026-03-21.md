# ClickUp Audit (Worker 2): Mid-Range Services/Business MVP Slice

Date: 2026-03-21  
Scope: ClickUp tasks `86e0fj58c`, `86e0fj58f`, `86e0fj58q`, `86e0fj58t`, `86e0fj58u`, `86e0fj58w`, `86e0fj589`, `86e0fj592`, `86e0fj593`, `86e0fj596`, `86e0fj598`, `86e0fj59m`, `86e0fj53d`, `86e0fj53j`, `86e0fj53k`, `86e0fj53r`, `86e0fj53u`, `86e0fj53y`, `86e0fj53z`, `86e0fj54b`, `86e0fj54e`, `86e0fj54f`, `86e0fj54p`, `86e0fj54q`, `86e0fj54y`, `86e0fj55a`, `86e0fj55b`, `86e0fj55e`, `86e0fj563`, `86e0fj565`, `86e0fj568`, `86e0fj569`

Compared against:
- `SITEMAP.md` (routes and display names)
- `README.md` (project status expectations)
- `PROJECT_STATUS.md` (high-level state)
- `websites/` folder names and built `dist/index.html` `<title>` (when present)

## Summary

- Inspected: 32 tasks
- ClickUp field changes made: see “Second Pass” section below
- Cross-check result: all 32 task names matched a `SITEMAP.md` entry and mapped to an existing `websites/<site>/` folder.

## Per-Task Cross-Check

Columns:
- Route = canonical route in `SITEMAP.md`
- Site Folder = canonical folder under `websites/` (may differ from route slug due to short-route aliases)
- Title (built) = `<title>` from `websites/<site>/dist/index.html` (or `index.html` fallback)
- Changes = ClickUp field edits performed in this audit

| ClickUp ID | MVP | Route | Site Folder | Status | Tags | Title (built) | Changes | Notes |
|---|---|---|---|---|---|---|---|---|
| 86e0fj58c | Cut Custom | `/cut-custom/` | `cut-custom` | ready for triage | generic | My Google AI Studio App | none | Title looks like placeholder/unrelated branding |
| 86e0fj58f | Rennick Market | `/rennick-market/` | `rennick-market` | ready for triage | generic | Rennick Meat Market | none |  |
| 86e0fj58q | Trumbull Locker | `/trumbull-locker/` | `trumbull-locker` | ready for triage | generic | Trumbull Meat Locker | none |  |
| 86e0fj58t | Terra Vantage | `/terra-vantage/` | `terra-vantage` | ready for triage | generic | EarthFlow Estimator | none | Title looks like placeholder/unrelated branding |
| 86e0fj58u | ParcelVisor | `/parcelvisor/` | `parcelvisor` | ready for triage | generic | My Google AI Studio App | none | Title looks like placeholder/unrelated branding |
| 86e0fj58w | RoofQuote | `/roofquote/` | `roofquote` | ready for triage | generic | My Google AI Studio App | none | Title looks like placeholder/unrelated branding |
| 86e0fj589 | Thomas Fence | `/thomas-fence/` | `thomas-fence` | ready for triage | generic | Thomas Fence Company - Serving Ashtabula for 50 Years | none |  |
| 86e0fj592 | Site Ops Pro | `/site-ops-pro/` | `site-ops-pro` | ready for triage | generic | EarthFlow Estimator | none | Title looks like placeholder/unrelated branding |
| 86e0fj593 | SBDC Business Counseling | `/sbdc-business-counseling/` | `sbdc-business-counseling` | ready for triage | targeted | Business Counseling | Lakeland SBDC | none |  |
| 86e0fj596 | SBDC Business Planning | `/sbdc-business-planning/` | `sbdc-business-planning` | ready for triage | targeted | Business Planning Tools — Lakeland SBDC Resource | none |  |
| 86e0fj598 | SBDC Educational Resources | `/sbdc-educational-resources/` | `sbdc-educational-resources` | ready for triage | targeted | Educational Resources — Lakeland SBDC Resource | none |  |
| 86e0fj59m | SBDC Support Tools | `/sbdc-support-tools/` | `sbdc-support-tools` | ready for triage | targeted | Small Business Support Tools — Lakeland SBDC Resource | none |  |
| 86e0fj53d | Curbside Pickup Tracker | `/curbside/` | `curbside-pickup-tracker` | ready for triage | generic | curbside-pickup-tracker | none |  |
| 86e0fj53j | Farm Stand Finder | `/farm-stand/` | `farm-stand-finder` | ready for triage | generic | farm-stand-finder | none |  |
| 86e0fj53k | Mobile Notary | `/notary/` | `mobile-notary` | ready for triage | generic | Mobile Notary Services | none |  |
| 86e0fj53r | Auto Detail Booking | `/auto-detail/` | `auto-detail-booking` | ready for triage | generic | Auto Detail Pro \| AI Booking Assistant | none |  |
| 86e0fj53u | Truck Wash Booking | `/truck-wash/` | `truck-wash-booking` | ready for triage | generic | truck-wash-booking | none |  |
| 86e0fj53y | Service Scheduler | `/scheduler/` | `service-scheduler` | ready for triage | generic | Service Scheduler | none |  |
| 86e0fj53z | Service Scheduler SMS | `/scheduler-sms/` | `service-scheduler-sms` | ready for triage | generic | service-scheduler-sms | none |  |
| 86e0fj54b | MyTrip Planner | `/mytrip/` | `mytrip-planner` | ready for triage | generic | MyTrip Planner | none |  |
| 86e0fj54e | Route Optimizer | `/routes/` | `route-optimizer` | ready for triage | generic | Route Optimizer \| Ashtabula Efficiency | none |  |
| 86e0fj54f | Ride Ready | `/ride-ready/` | `ride-ready` | ready for triage | generic | Ride Ready \| Ashtabula County Transit Assistant | none |  |
| 86e0fj54p | Charter Booking | `/charter/` | `charter-booking` | ready for triage | generic | Ashtabula Fishing Charters \| Lake Erie Walleye Capital | none |  |
| 86e0fj54q | Marina Slip Waitlist | `/marina/` | `marina-slip-waitlist` | ready for triage | generic | Marina Slip Waitlist | none |  |
| 86e0fj54y | Resource Compass | `/resource/` | `resource-compass` | ready for triage | generic | Ashtabula Circles Navigator - Surviving to Thriving | none |  |
| 86e0fj55a | Policy Pal | `/policy-pal/` | `policy-pal` | ready for triage | generic | Policy Pal \| AI Insurance Policy Summarizer for Agents | none |  |
| 86e0fj55b | Boat Storage Waitlist | `/boat-storage/` | `boat-storage-waitlist` | ready for triage | generic | Boat Storage Waitlist — AI-Powered Marina Confirmations | none |  |
| 86e0fj55e | Harvest Alert | `/harvest/` | `harvest-alert` | ready for triage | generic | Ashtabula County Agricultural Services — Harvest Alert System | none |  |
| 86e0fj563 | Pocket Historian | `/historian/` | `pocket-historian` | ready for triage | generic | pocket-historian | none |  |
| 86e0fj565 | Pocket Historian Pro | `/historian-pro/` | `pocket-historian-pro` | ready for triage | generic | pocket-historian-pro | none |  |
| 86e0fj568 | Pocket Sommelier | `/sommelier/` | `pocket-sommelier` | ready for triage | generic | pocket-sommelier | none |  |
| 86e0fj569 | Pocket Sommelier Pro | `/sommelier-pro/` | `pocket-sommelier-pro` | ready for triage | generic | pocket-sommelier-pro | none |  |

## Notes And Uncertainties

- All tasks are currently `ready for triage`. The repo indicates these MVPs exist and are deployable, but whether a given MVP should be considered “triage-ready” vs “done” depends on the ClickUp workflow definition. I left statuses unchanged.
- Tagging is currently `generic` for most sites and `targeted` for SBDC sites. I left tags unchanged because there is no explicit tag taxonomy defined in repo docs.
- Several MVPs have placeholder-looking `<title>` values (see Notes column). This is a website polish issue rather than a ClickUp field accuracy issue; I did not change task names/statuses based on this alone.

## Second Pass (Visual QA Report)

Input: `sitemap_screenshots/visual_analysis_report.json` (generated 2026-03-21).

Concrete ClickUp edits made in this pass:

- Updated ClickUp **descriptions** (were empty) to record a Visual QA title mismatch and point to a repo/site fix (not a ClickUp rename):
  - `86e0fj58c` (Cut Custom): Visual QA reports `<title>` = `My Google AI Studio App`
  - `86e0fj58t` (Terra Vantage): Visual QA reports `<title>` = `EarthFlow Estimator`
  - `86e0fj58u` (ParcelVisor): Visual QA reports `<title>` = `My Google AI Studio App`
  - `86e0fj58w` (RoofQuote): Visual QA reports `<title>` = `My Google AI Studio App`
  - `86e0fj592` (Site Ops Pro): Visual QA reports `<title>` = `EarthFlow Estimator`

No changes made to:
- task titles (ClickUp names)
- task statuses
- task tags
- due dates
