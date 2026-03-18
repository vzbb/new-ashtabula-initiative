# SPEC.md — Boat Storage Waitlist

## Project Overview
Digital waitlist system for Ashtabula County marinas to capture winter boat storage demand with automated confirmation messages and upsell integration.

---

## Research Summary (Phase 1)

### Local Market Context
- **Ashtabula Harbor** has 11 marinas/yacht clubs along the riverfront
- Services include seasonal dock space, overnight docking, camping, picnic facilities, boat launching ramps, and **winter storage**
- Lake Erie access via 20-minute cruise down the Ashtabula River

### Key Stakeholders
| Marina | Services | Notes |
|--------|----------|-------|
| Redbrook Boat Club | Dockage, winter storage, ship store | Known for welcoming atmosphere |
| North Coast Marina & Campground | Dockage, camping, scenic location | Listed on Dockwa platform |
| ARU Marina & Campgrounds | RV campsites, boat docks, dry storage, launch ramps | Active Facebook presence |
| City of Ashtabula | 11 marinas total | Official municipal info available |

### Competitor Analysis — Marina Management Software
| Platform | Key Features | Price Point |
|----------|--------------|-------------|
| DockMaster | Visual slip assignments, billing, POS, CRM | Enterprise |
| Harbour Assist | Waitlist management, berth allocation, lift/launch scheduling | Mid-market |
| MarinaOffice | Billing, reservations, POS, fuel sales, service mgmt | Mid-market |
| Molo | Service management, online contracts, stored credit cards | SMB-focused |
| Dockwa | Mobile-first, digital reservations, boater app | Commission-based |

**Gap Identified:** No simple, free waitlist tool specifically for small marinas without full management system overhead.

### Revenue Upsell Opportunities
- **Spring launch service** — de-winterization, engine checks
- **Valet storage** — premium handling
- **Secure gear lockers** — winter gear storage
- **Priority spring launch scheduling** — skip the spring rush
- **Winterization service** — $160+/hour labor + parts typical rate

---

## Phase 2: Resource Procurement

### Data Sources
- [City of Ashtabula Marinas](https://www.cityofashtabula.com/marinas) — official list
- [Dockwa — North Coast Marina](https://dockwa.com/explore/destination/95cdgx-north-coast-marina-and-campground) — booking platform
- Local marina Facebook pages for contact info

### API Requirements
- **Gemini API** — already integrated for AI confirmation messages
- **Optional:** Email/SMS API (Twilio, SendGrid) for notifications
- **Optional:** Payment integration (Stripe) for deposits

### Marina Contact Targets
- Redbrook Boat Club — winter storage + ship store
- North Coast Marina — already on Dockwa, may want waitlist supplement
- ARU Marina — dry storage specialist

---

## Phase 3: Technical Architecture

### Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Styling | CSS (custom, no framework) |
| AI | Google Gemini 1.5 Flash API |
| State | React useState (local) |
| Storage | LocalStorage (MVP) → Firestore (scale) |
| Hosting | Firebase Hosting |

### Core Features (MVP)
1. **Boat details capture** — length, contact info
2. **AI confirmation generator** — Gemini-powered messaging
3. **Upsell suggestions** — spring launch, winterization, valet
4. **Waitlist queue view** — local storage based
5. **Export capability** — CSV for marina admin

### Future Enhancements (Post-MVP)
- Firebase Auth for marina operator accounts
- Firestore database for multi-device sync
- SMS notifications via Twilio
- Payment deposits via Stripe
- Calendar integration for launch scheduling
- Marina-specific branding/customization

---

## Implementation Phases

### Phase A: Core Waitlist (Current)
- [x] Basic React scaffold
- [x] Gemini API integration for confirmations
- [x] Boat length + contact capture
- [ ] LocalStorage persistence
- [ ] Waitlist queue display

### Phase B: Admin Features
- [ ] Marina operator dashboard
- [ ] CSV export
- [ ] Status management (pending → confirmed → stored)
- [ ] Upsell tracking

### Phase C: Integration
- [ ] Firebase Firestore backend
- [ ] SMS notifications
- [ ] Stripe payment integration
- [ ] Multi-marina support

---

## Success Metrics
- Waitlist signups captured: 50+ boats in first season
- Upsell conversion: 30% add spring launch service
- Admin time saved: 5+ hours/week vs manual spreadsheet
- Marina adoption: 3+ Ashtabula marinas using tool

---

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Small marinas resistant to tech | Keep it simple, free tier, CSV export for existing workflows |
| Seasonal demand only | Expand to slip reservations, launch scheduling |
| Data privacy concerns | No PII storage in MVP, opt-in consent |
| Gemini API costs | Caching, rate limiting, fallback templates |

---

## Done Condition
Marina operator can:
1. Share waitlist link with customers
2. Collect boat details + contact info
3. Send AI-generated confirmation with timing estimate
4. View/export waitlist queue
5. Track upsell interest (spring launch, winterization)

**Shipped MVP =** Firebase-hosted waitlist form + local queue + CSV export
