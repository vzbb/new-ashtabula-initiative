# Plating Tracker

**Status:** 🟡 Phase 1 Complete (Research)  
**Priority:** P2 (Manufacturing/Business Tools)  
**Target:** Plating shops and restoration customers in Ashtabula County

---

## Problem
Plating shops get 10-20 status calls per day. Customers drop off parts with no visibility into when they'll be ready. Batch processing makes individual status complex. Parts fail QC with no communication about rework.

## Solution
"FedEx tracking for plating shops" — customers see exactly where parts are in the process: Intake → Stripping → Prep → Plating → QC → Ready.

## Key Differentiators
- Plating-specific workflow (not generic job shop)
- Batch management (track individual parts within batches)
- Quality hold handling (rework approval workflow)
- Photo documentation
- Affordable for small shops ($39/mo vs. $200+ for job shop software)

## Market
- 5-10 plating shops in Ashtabula County
- 200-400 direct customers (restoration shops, manufacturers)
- Chrome, zinc, nickel, powder coating, anodizing
- Average order: $100-$2,000
- Turnaround: 1-4 weeks (standard), 3-7 days (rush)

## Revenue Model
| Tier | Price | Target |
|------|-------|--------|
| Basic | $39/mo | Small shops (50 jobs/mo) |
| Pro | $79/mo | Medium shops (150 jobs) |
| Business | $149/mo | Large shops, multi-location |

## Tech Stack (Proposed)
- Next.js + Tailwind CSS
- Supabase (database + storage)
- Twilio (SMS notifications)
- SendGrid (email)
- Tablet-friendly PWA for shop floor

## Next Steps
1. Research active plating shops in Ashtabula County
2. Contact chrome restoration specialists
3. Visit powder coating shops
4. Survey 3-5 shop owners about current process

## Documents
- [PHASE1-RESEARCH.md](./PHASE1-RESEARCH.md) — Full research (12KB)

## Contacts to Acquire
- [ ] Chrome plating shops (2-3)
- [ ] Powder coating shops (3-5)
- [ ] Zinc/nickel plating shops (2-3)
- [ ] Classic car restoration shops (5-10)
- [ ] Motorcycle customizers (3-5)
