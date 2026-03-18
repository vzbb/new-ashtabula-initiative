# Artist Commission Form — SPEC.md
**Date:** February 18, 2026  
**Status:** 🟡 Draft — Phase 3 Initiated  
**Constraint:** Research-only, no external stakeholder contact

---

## 1. Purpose

A web-based platform connecting Ashtabula-area clients with local artists for commissioned artwork. Streamlines the inquiry-to-delivery workflow while providing transparency on pricing, process, and expectations.

---

## 2. Core Features

### 2.1 Client-Facing Features

| Feature | Priority | Description |
|---------|----------|-------------|
| **Commission Intake Form** | P0 | Multi-step form capturing project details |
| **Artist Directory** | P0 | Browse/filter local artists by specialty |
| **Pricing Calculator** | P1 | Estimate costs based on type/size/complexity |
| **Portfolio Viewer** | P1 | Artist work samples with lightbox |
| **Process Guide** | P1 | Step-by-step explanation of commissioning |
| **FAQ Section** | P2 | Common questions about commissions |

### 2.2 Artist-Facing Features

| Feature | Priority | Description |
|---------|----------|-------------|
| **Artist Profile** | P0 | Portfolio, bio, pricing, availability |
| **Inquiry Dashboard** | P0 | View and manage commission requests |
| **Proposal Generator** | P1 | Auto-generate quotes from inquiry data |
| **Contract Template** | P1 | Standard agreement with customization |
| **Payment Tracking** | P2 | Deposit/final payment status |

### 2.3 Admin Features

| Feature | Priority | Description |
|---------|----------|-------------|
| **Artist Onboarding** | P0 | Approve new artist registrations |
| **Dispute Resolution** | P2 | Mediation tools for issues |
| **Analytics** | P2 | Commission volume, satisfaction metrics |

---

## 3. Commission Intake Form Fields

### Step 1: Project Type
- [ ] Commission type (dropdown):
  - Portrait (person/family)
  - Pet portrait
  - Mural (indoor/outdoor)
  - Custom artwork (size-based)
  - Illustration (commercial/personal)
  - Restoration
  - Public art
- [ ] Brief description (textarea, 500 chars)

### Step 2: Specifications
- [ ] Size requirements (dimensions or "flexible")
- [ ] Medium preference (dropdown + "artist choice"):
  - Oil painting
  - Acrylic
  - Watercolor
  - Digital
  - Mixed media
  - Other
- [ ] Style reference (image upload or URL)
- [ ] Deadline (date picker with "flexible" option)

### Step 3: Budget & Logistics
- [ ] Budget range (dropdown):
  - Under $250
  - $250-$500
  - $500-$1,000
  - $1,000-$2,500
  - $2,500-$5,000
  - $5,000+
- [ ] Location (zip code for travel estimate)
- [ ] Installation needed? (toggle for murals/large pieces)

### Step 4: Contact & Submission
- [ ] Name
- [ ] Email
- [ ] Phone (optional)
- [ ] Preferred contact method
- [ ] Terms acknowledgment checkbox
- [ ] Submit → Confirmation email

---

## 4. Pricing Calculator Logic

### Formula by Type

```
Portrait (size-based):
  Base: $150 (8x10)
  Formula: Base × (width × height / 80) × Complexity
  Complexity: 1.0 (simple) to 2.0 (high detail)

Mural (square-foot):
  Base: $15/sq ft (interior), $25/sq ft (exterior)
  Formula: Width × Height × Base Rate × Detail Factor
  Detail: 1.0 (simple) to 2.5 (intricate)

Pet Portrait:
  Base: $100 (single pet, simple background)
  Formula: Base + (Number of Pets × $75) + (Background Detail × $50)

Custom Artwork:
  Formula: Hours Estimate × Artist Hourly Rate + Materials
  Hours: User-estimated or artist-provided

Illustration:
  Formula: Base + (Usage Rights Factor × Complexity)
  Usage: Personal (1.0), Commercial (2.0), Exclusive (3.0)
```

### Display
- Show estimate range (±20%)
- Note: "Final quote provided by artist"
- Deposit estimate (typically 50%)

---

## 5. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + Tailwind CSS |
| State | React Query / Zustand |
| Forms | React Hook Form + Zod validation |
| Backend | Firebase (Auth, Firestore, Storage) |
| Payments | Stripe (deposits, final payments) |
| Email | Firebase Functions + SendGrid |
| Images | Firebase Storage + Cloudinary (optimization) |
| Maps | Google Maps API (artist location/travel) |

---

## 6. Data Models

### Artist
```typescript
interface Artist {
  id: string;
  name: string;
  bio: string;
  specialties: CommissionType[];
  hourlyRate?: number;
  baseRates: Record<CommissionType, number>;
  portfolio: Image[];
  location: GeoPoint;
  serviceRadius: number; // miles
  availability: 'accepting' | 'limited' | 'booked';
  contact: {
    email: string;
    phone?: string;
    website?: string;
    instagram?: string;
  };
  rating: number;
  reviewCount: number;
  approved: boolean;
  createdAt: Timestamp;
}
```

### Commission Request
```typescript
interface CommissionRequest {
  id: string;
  client: {
    name: string;
    email: string;
    phone?: string;
    userId?: string; // if registered
  };
  type: CommissionType;
  description: string;
  specifications: {
    dimensions?: { width: number; height: number; unit: 'in' | 'ft' };
    medium?: string;
    styleReference?: string;
    deadline?: Date;
    flexibleDeadline: boolean;
  };
  budget: {
    range: BudgetRange;
    max?: number;
  };
  location: {
    zipCode: string;
    installationNeeded: boolean;
  };
  status: 'submitted' | 'reviewed' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  artistId?: string;
  quote?: Quote;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Quote
```typescript
interface Quote {
  id: string;
  requestId: string;
  artistId: string;
  items: {
    description: string;
    amount: number;
  }[];
  total: number;
  depositPercent: number;
  depositAmount: number;
  timeline: {
    startDate: Date;
    milestones: { description: string; date: Date }[];
    completionDate: Date;
  };
  revisionsIncluded: number;
  additionalRevisionCost: number;
  expirationDate: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  contractUrl?: string;
  createdAt: Timestamp;
}
```

---

## 7. User Flows

### Client Flow
1. Landing page → Browse artists OR Start commission form
2. Complete intake form → Receive confirmation email
3. Matched artists review request → Send quotes (24-48 hrs)
4. Client reviews quotes → Selects artist → Pays deposit
5. Artist creates work → Progress updates
6. Client approves final → Pays balance → Delivery
7. Leave review → Complete

### Artist Flow
1. Apply for listing → Submit portfolio + rates
2. Admin approval → Profile live
3. Receive inquiry notifications → Review request details
4. Send quote with contract terms → Client accepts
5. Receive deposit → Begin work → Update progress
6. Deliver final → Receive final payment
7. Request review → Build reputation

---

## 8. MVP Scope (Phase 1 Build)

### Must-Have (P0)
- [ ] Commission intake form (4 steps)
- [ ] Artist profile creation/edit
- [ ] Basic artist directory (filter by specialty)
- [ ] Email notifications (new inquiry, quote received)
- [ ] Simple quote workflow (accept/decline)
- [ ] Stripe deposit integration

### Should-Have (P1)
- [ ] Pricing calculator
- [ ] Portfolio image gallery
- [ ] Contract template generation
- [ ] Progress tracking updates

### Nice-to-Have (P2)
- [ ] Review/rating system
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Mobile app

---

## 9. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Project setup, Firebase config
- Commission form UI
- Artist profile schema
- Basic email notifications

### Phase 2: Matching (Week 3-4)
- Artist directory
- Inquiry → Artist notification
- Quote creation flow
- Quote acceptance/rejection

### Phase 3: Transactions (Week 5-6)
- Stripe integration (deposits)
- Contract PDF generation
- Progress update workflow
- Final payment + delivery

### Phase 4: Polish (Week 7-8)
- Pricing calculator
- Portfolio gallery
- Review system
- Admin tools

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| No artists sign up | High | Partner with Ashtabula Arts Center first |
| Pricing disputes | Medium | Clear estimate ranges, final quote required |
| Quality issues | Medium | Artist approval process, review system |
| Scope creep | Medium | Detailed intake form, revision limits in contracts |
| Payment delays | Low | 50% deposit requirement, Stripe holds |

---

## 11. Success Metrics

| Metric | Target (6 months) |
|--------|-------------------|
| Registered artists | 20+ |
| Commission requests | 50+ |
| Completed commissions | 15+ |
| Average commission value | $400+ |
| Artist satisfaction | 4.5/5 stars |
| Client satisfaction | 4.5/5 stars |

---

## 12. Next Steps

1. **Awaiting approval** — noirsys.com site approval before stakeholder outreach
2. **Phase 2 (Resource Procurement)** — Contact Ashtabula Arts Center, recruit initial artists
3. **Phase 4 (Build)** — Begin implementation per phases above

---

**Status:** SPEC.md drafted. Blocked on Phase 2 until external contact approved.
