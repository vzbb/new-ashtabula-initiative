# SPEC.md — Pet-Matchmaker
**Project:** Ashtabula County Pet Adoption Matching Platform  
**Date:** 2026-02-20  
**Status:** Phase 3 Complete — Ready for Implementation  
**Previous:** Phase 1 Research, Phase 2 Resources

---

## 1. Executive Summary

**Concept:** A personality-based pet matching platform that connects prospective adopters with shelter pets at ACAPL (Ashtabula County Animal Protective League) and partner organizations based on lifestyle compatibility, not just breed/appearance.

**Target Users:**
- Prospective pet adopters in Ashtabula County
- ACAPL staff and volunteers
- Partner shelters/rescues
- Veterinary clinics (referral partners)

**Key Differentiators:**
- Focus on personality matching (not just breed/age)
- Local-only (Ashtabula County shelters)
- Integration with shelter management systems
- Post-adoption support and resources
- Community features (lost/found, pet tips)

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Adopter    │  │   Shelter    │  │   Admin      │  │   Vet Portal │    │
│  │   Web App    │  │   Dashboard  │  │   Panel      │  │   (future)   │    │
│  │   (React)    │  │   (React)    │  │   (React)    │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER (Node.js/Express)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │    Pets     │ │   Matches   │ │   Adopters  │ │  Shelters   │           │
│  │    API      │ │    API      │ │    API      │ │    API      │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                           │
│  │ Personality │ │  Adoption   │ │   Notify    │                           │
│  │   Matrix    │ │   Workflow  │ │   (Email)   │                           │
│  └─────────────┘ └─────────────┘ └─────────────┘                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   PostgreSQL     │  │     Redis        │  │    Firebase      │          │
│  │   (Primary DB)   │  │  (Sessions)      │  │   (Storage)      │          │
│  │   - Pets         │  │  - Match cache   │  │   - Pet photos   │          │
│  │   - Adopters     │  │  - Rate limits   │  │   - Documents    │          │
│  │   - Matches      │  │                  │  │                  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │  SendGrid│  │  Stripe  │  │   ACAPL  │  │  Petstablished               │
│  │  Email   │  │ (future) │  │  API(Δ)  │  │  API(Δ)    │                     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | React 18 + Vite | Fast, modern, mobile-first |
| **State** | Zustand | Lightweight state management |
| **Styling** | Tailwind CSS | Rapid UI, responsive design |
| **Backend** | Node.js + Express | Mature, shelter staff can understand |
| **Database** | PostgreSQL 15 | Relational data, ACID for adoptions |
| **Cache** | Redis | Session management, match caching |
| **Storage** | Firebase Storage | Pet photos, adoption documents |
| **Email** | SendGrid | Reliable transactional email |
| **Hosting** | Railway/Render | Simple deploy, cost-effective |

---

## 4. Data Models

### Pet
```typescript
interface Pet {
  id: string;
  shelter_id: string;              // ACAPL, etc.
  name: string;
  species: 'dog' | 'cat' | 'rabbit' | 'other';
  breed_primary: string;
  breed_secondary?: string;
  age_years: number;
  age_months: number;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large' | 'xl';
  
  // Personality Profile (shelter assessed)
  personality: {
    energy_level: 1-5;             // 1=calm, 5=high energy
    friendliness: 1-5;             // 1=shy, 5=outgoing
    trainability: 1-5;             // 1=stubborn, 5=eager
    independence: 1-5;             // 1=clingy, 5=independent
    child_friendly?: 1-5;
    dog_friendly?: 1-5;
    cat_friendly?: 1-5;
  };
  
  // Care Requirements
  care_needs: {
    exercise_minutes_daily: number;
    grooming_needs: 'low' | 'medium' | 'high';
    special_needs: string[];       // medical, behavioral
  };
  
  photos: string[];
  description: string;
  intake_date: Date;
  status: 'available' | 'pending' | 'adopted' | 'hold';
  
  // Adoption tracking
  match_count: number;
  inquiry_count: number;
  created_at: Date;
  updated_at: Date;
}
```

### Adopter Profile
```typescript
interface AdopterProfile {
  id: string;
  email: string;
  phone?: string;
  name: string;
  
  // Lifestyle Assessment
  lifestyle: {
    home_type: 'apartment' | 'house_small' | 'house_large' | 'farm';
    has_yard: boolean;
    yard_fenced: boolean;
    
    household: {
      adults: number;
      children: number;
      children_ages?: number[];
      other_pets_dogs: number;
      other_pets_cats: number;
      other_pets_other: string;
    };
    
    activity_level: 1-5;           // 1=homebody, 5=very active
    hours_away_daily: number;      // work schedule
    experience_level: 'none' | 'some' | 'experienced';
    
    preferences: {
      species: ('dog' | 'cat' | 'rabbit' | 'other')[];
      age_preference: 'puppy/kitten' | 'young' | 'adult' | 'senior' | 'any';
      size_preference: ('small' | 'medium' | 'large')[];
      grooming_commitment: 'low' | 'medium' | 'high';
      special_needs_ok: boolean;
    };
  };
  
  // Matching
  saved_pets: string[];            // Pet IDs
  match_history: Match[];
  
  created_at: Date;
  updated_at: Date;
}
```

### Match
```typescript
interface Match {
  id: string;
  pet_id: string;
  adopter_id: string;
  
  // Scoring
  compatibility_score: number;     // 0-100
  score_breakdown: {
    lifestyle: number;             // home, activity, schedule
    personality: number;           // energy, temperament match
    experience: number;            // skill vs pet needs
    preferences: number;           // stated prefs alignment
  };
  
  // Status
  status: 'suggested' | 'viewed' | 'saved' | 'inquired' | 'visit_scheduled' | 'adopted' | 'declined';
  
  // Adoption Workflow
  inquiry?: {
    message: string;
    sent_at: Date;
    shelter_response?: string;
    responded_at?: Date;
  };
  
  visit?: {
    scheduled_at: Date;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
  };
  
  created_at: Date;
  updated_at: Date;
}
```

### Shelter
```typescript
interface Shelter {
  id: string;
  name: string;                    // "ACAPL"
  type: 'shelter' | 'rescue' | 'vet_partner';
  address: {
    street: string;
    city: string;
    zip: string;
  };
  phone: string;
  email: string;
  website?: string;
  
  hours: {
    monday?: { open: string; close: string };
    // ... tuesday-sunday
  };
  
  // Integration
  has_api_integration: boolean;    // Shelterluv, Petstablished, etc.
  api_provider?: string;
  last_sync_at?: Date;
  
  // Stats
  pets_available: number;
  total_adoptions: number;
  
  is_active: boolean;
  created_at: Date;
}
```

---

## 5. API Endpoints

### Adopter API
```
POST /api/v1/adopters                    # Create profile + take quiz
GET  /api/v1/adopters/:id/matches        # Get ranked matches
GET  /api/v1/adopters/:id/saved          # Get saved pets
PUT  /api/v1/adopters/:id/save/:petId    # Save a pet
DELETE /api/v1/adopters/:id/save/:petId  # Unsave

POST /api/v1/matches/:id/inquire         # Send inquiry to shelter
GET  /api/v1/matches/:id/status          # Check adoption status
```

### Public Pet API
```
GET /api/v1/pets                         # List available pets (filterable)
GET /api/v1/pets/:id                     # Pet detail with personality
GET /api/v1/shelters                     # List partner shelters
GET /api/v1/shelters/:id/pets            # Pets at specific shelter
```

### Shelter Dashboard API
```
GET  /api/v1/shelter-admin/pets          # Manage pets
POST /api/v1/shelter-admin/pets
PUT  /api/v1/shelter-admin/pets/:id
DELETE /api/v1/shelter-admin/pets/:id

GET  /api/v1/shelter-admin/inquiries     # View inquiries
PUT  /api/v1/shelter-admin/inquiries/:id/respond  # Respond

GET  /api/v1/shelter-admin/matches       # Match analytics
GET  /api/v1/shelter-admin/stats         # Dashboard stats
```

---

## 6. Frontend Component Hierarchy

```
src/
├── components/
│   ├── ui/                    # Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx          # "Good with kids", "High energy"
│   │   └── Slider.tsx         # Personality scales
│   │
│   ├── adopter/
│   │   ├── QuizFlow.tsx       # Step-by-step lifestyle quiz
│   │   ├── PetCard.tsx        # Pet preview card
│   │   ├── PetDetail.tsx      # Full pet profile
│   │   ├── MatchGrid.tsx      # Grid of matched pets
│   │   ├── CompatibilityMeter.tsx  // Score visualization
│   │   └── InquiryForm.tsx    # Contact shelter form
│   │
│   ├── shelter/
│   │   ├── PetManager.tsx     # CRUD for pets
│   │   ├── PersonalityForm.tsx // Assessment form
│   │   ├── InquiryQueue.tsx   # Incoming inquiries
│   │   └── DashboardStats.tsx
│   │
│   └── shared/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── pages/
│   ├── adopter/
│   │   ├── Quiz.tsx           # Take matching quiz
│   │   ├── Matches.tsx        # View matches
│   │   ├── Pet.tsx            # Pet detail page
│   │   └── Saved.tsx          # Saved pets
│   │
│   └── shelter/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── Pets.tsx
│       └── Inquiries.tsx
│
└── lib/
    ├── api.ts
    └── matching-algorithm.ts
```

---

## 7. Key User Flows

### Flow 1: Adopter Journey
```
1. Visit site → "Find Your Perfect Pet" CTA
2. Start Quiz → 10 lifestyle questions (home, activity, experience)
3. Submit → Algorithm generates matches
4. View Matches → See ranked pets with compatibility scores
5. Explore → Click pet for full profile + personality radar
6. Save/Compare → Save favorites, compare side-by-side
7. Inquire → Fill form, message goes to shelter
8. Shelter Response → Email notification to adopter
9. Schedule Visit → Book meet-and-greet (optional integration)
10. Adoption → Shelter updates status, pet marked adopted
```

### Flow 2: Shelter Staff Workflow
```
1. Login to dashboard
2. Add/Edit Pet → Upload photos, fill personality assessment
3. Review Inquiries → See adopter profile + compatibility score
4. Respond → Send message or call
5. Schedule Visit → Mark visit scheduled
6. Update Status → Mark adopted/pending
```

### Flow 3: Matching Algorithm
```
1. Parse adopter lifestyle quiz
2. For each available pet:
   - Calculate lifestyle match (home size, activity alignment)
   - Calculate personality match (energy, temperament)
   - Calculate experience match (adopter skill vs pet needs)
   - Calculate preference match (species, age, size prefs)
3. Weighted scoring (25% each factor)
4. Return top matches (>60% compatibility)
5. Cache results in Redis (TTL 1 hour)
```

---

## 8. Personality Matching Algorithm

```typescript
function calculateCompatibility(adopter: AdopterProfile, pet: Pet): MatchScore {
  // 1. Lifestyle Match (25%)
  const lifestyleScore = calculateLifestyleMatch(adopter, pet);
  
  // 2. Personality Match (25%)
  // Adopter activity (1-5) vs Pet energy (1-5) - closer is better
  const personalityScore = 100 - Math.abs(
    adopter.lifestyle.activity_level - pet.personality.energy_level
  ) * 20;
  
  // 3. Experience Match (25%)
  // First-time owners shouldn't get high-needs pets
  const experienceScore = calculateExperienceMatch(adopter, pet);
  
  // 4. Preference Match (25%)
  const preferenceScore = calculatePreferenceMatch(adopter, pet);
  
  // Weighted total
  const total = (
    lifestyleScore * 0.25 +
    personalityScore * 0.25 +
    experienceScore * 0.25 +
    preferenceScore * 0.25
  );
  
  return {
    overall: Math.round(total),
    breakdown: {
      lifestyle: Math.round(lifestyleScore),
      personality: Math.round(personalityScore),
      experience: Math.round(experienceScore),
      preferences: Math.round(preferenceScore)
    }
  };
}
```

---

## 9. Business Model

**Non-Profit / Free Model**
- Free for all shelters (ACAPL, partners)
- Free for adopters
- Optional: Donation integration for ACAPL
- Future: Premium features for multi-shelter management

**Costs (Monthly)**
| Item | Cost |
|------|------|
| Railway/Render hosting | $15 |
| PostgreSQL | $0 (self-hosted) |
| Firebase Storage | $5 |
| SendGrid | $0 (free tier) |
| **Total** | **~$20/mo** |

---

## 10. Security Considerations

- Adopter PII encrypted at rest
- Shelter staff auth (email/password + 2FA)
- API rate limiting (prevent scraping)
- Image upload validation
- Adoption inquiries logged for audit

---

## 11. Implementation Phases

### Phase 1: MVP Core (Weeks 1-4)
- [ ] Adopter quiz + matching algorithm
- [ ] Pet browsing + detail pages
- [ ] Basic shelter dashboard
- [ ] Email inquiry system
- [ ] ACAPL as pilot shelter

**Success Criteria:** 10 adopter profiles, 5 inquiries sent

### Phase 2: Polish + Growth (Weeks 5-8)
- [ ] Save/compare pets
- [ ] Shelter analytics dashboard
- [ ] Partner shelter onboarding
- [ ] Post-adoption resources page
- [ ] Mobile app (PWA)

**Success Criteria:** 3 shelters onboarded, 50 matches made

### Phase 3: Scale (Weeks 9-12)
- [ ] Shelter management system integration
- [ ] Automated personality assessment tools
- [ ] Lost/found pet posting
- [ ] Veterinary partner network
- [ ] Community features (tips, events)

**Success Criteria:** 100+ pets matched, 20+ adoptions facilitated

---

## 12. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Shelters won't adopt new tool | Medium | High | Free, easy onboarding, ACAPL pilot first |
| Personality assessment subjective | High | Medium | Staff training, simple 1-5 scales |
| Low adopter traffic | Medium | High | Social media, ACAPL promotion, SEO |
| Shelter system integration complex | Medium | Medium | Start manual, integrate later |
| Adoption inquiries without follow-up | Medium | Medium | Auto-reminders, inquiry tracking |

---

## 13. Next Steps

### Immediate
1. **Confirm ACAPL partnership** — Call 440-224-1222
2. **Design personality assessment** — Simple 5-point scales
3. **Scaffold project** — React + Node.js setup
4. **Create pet profile mockups** — Show ACAPL what shelter sees

### Week 1
1. Build adopter quiz flow
2. Implement matching algorithm
3. Basic pet browsing
4. ACAPL feedback session

---

**Document Status:** Phase 3 Complete  
**Ready for:** Implementation (Phase 4)  
**Priority Integration:** ACAPL (primary), then Humane Society of Ashtabula County
