# SPEC — GOTL Weekend Planner

## 1. Overview

**Product:** GOTL Weekend Planner  
**Tagline:** *Build your perfect Geneva-on-the-Lake getaway in 2 minutes*  
**Type:** Web application (mobile-first)  
**Status:** MVP Specification

---

## 2. Problem Statement

Visitors to Geneva-on-the-Lake currently:
- Piece together trips from scattered sources (CVB site, TripAdvisor, word-of-mouth)
- Miss hidden gems and local favorites
- Arrive unprepared for seasonal differences
- Waste decision time during their limited weekend

**The GOTL Weekend Planner solves this** with a personalized itinerary builder that curates the best of wineries, the Strip, State Park, and events based on visitor preferences and timing.

---

## 3. User Stories

### Primary
1. **As a** couple planning a romantic getaway, **I want** a curated winery + dining itinerary **so that** I don't waste time researching.
2. **As a** family with young kids, **I want** to know which activities are age-appropriate **so that** I can plan confidently.
3. **As an** event attendee, **I want** my itinerary to account for festival logistics **so that** I maximize my experience.
4. **As a** first-time visitor, **I want** insider tips on parking and timing **so that** I avoid common frustrations.

### Secondary
5. **As a** local business, **I want** to be featured in relevant itineraries **so that** I get qualified visitors.
6. **As a** returning visitor, **I want** to discover new experiences **so that** each trip feels fresh.

---

## 4. Feature Matrix

| Feature | Priority | Phase | Notes |
|---------|----------|-------|-------|
| **Onboarding Quiz** | P0 | 1 | 4-5 questions → itinerary |
| **Seasonal Logic** | P0 | 1 | Different recs for peak vs off-season |
| **Itinerary Generator** | P0 | 1 | Time-bucketed activities |
| **Mobile-First UI** | P0 | 1 | 70%+ mobile traffic expected |
| **Save/Share Itinerary** | P0 | 1 | URL-based sharing |
| **Event-Aware Planning** | P1 | 2 | Integrate festival/event calendar |
| **Winery Focus Mode** | P1 | 2 | Wine trail optimized path |
| **Weather Integration** | P1 | 2 | "Beach day" vs "indoor" suggestions |
| **Maps/Directions** | P1 | 2 | Link to Google Maps |
| **Business Profiles** | P1 | 2 | Detailed pages for featured spots |
| **User Accounts** | P2 | 3 | Save multiple trips |
| **Reviews/Ratings** | P2 | 3 | Community feedback |
| **Booking Integration** | P2 | 3 | Deep links to reservations |
| **Analytics Dashboard** | P2 | 3 | Partner insights |

---

## 5. Architecture

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React + Vite + TypeScript | Fast, modern, great DX |
| **Styling** | Tailwind CSS | Rapid UI development |
| **State** | React Query + Zustand | Server + client state |
| **Routing** | React Router v6 | SPA navigation |
| **Backend** | Firebase (Firestore + Functions) | Serverless, real-time, free tier |
| **Hosting** | Firebase Hosting | CDN, SSL, easy deploy |
| **Maps** | Mapbox GL JS | Better pricing than Google |
| **Analytics** | Plausible or GA4 | Privacy-friendly option |

### Data Model

```typescript
// User preferences
interface TripPreferences {
  dates: DateRange;
  groupType: 'couple' | 'family' | 'friends' | 'solo';
  interests: Interest[]; // wineries, beach, dining, nightlife, nature
  pace: 'relaxed' | 'balanced' | 'packed';
  budget: 'budget' | 'moderate' | 'luxury';
}

// Activity/venue
interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  subcategory: string; // 'winery', 'restaurant', 'beach', etc.
  description: string;
  address: string;
  coordinates: [number, number];
  hours: Hours;
  seasonality: Season;
  priceRange: 1 | 2 | 3 | 4;
  kidFriendly?: boolean;
  petFriendly?: boolean;
  website?: string;
  phone?: string;
  images: string[];
  tags: string[];
}

// Itinerary item
interface ItineraryItem {
  venueId: string;
  startTime: string; // "14:00"
  duration: number; // minutes
  notes?: string; // "Arrive early for parking"
  alternatives?: string[]; // venue IDs
}

// Generated itinerary
interface Itinerary {
  id: string;
  preferences: TripPreferences;
  items: ItineraryItem[];
  day: Date;
  shareUrl: string;
  createdAt: Timestamp;
}

// Event
interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue?: string;
  category: 'festival' | 'music' | 'food' | 'sports' | 'family';
  url?: string;
}
```

---

## 6. User Flows

### Flow A: First-Time Visitor
```
Landing Page → Quiz (5 steps) → Itinerary Preview → Save/Share → Done
```

**Quiz Steps:**
1. When are you visiting? (Date picker with season indicator)
2. Who's coming? (Couple/Family/Friends/Solo)
3. What interests you? (Multi-select: Wineries, Beach, Dining, Nightlife, Nature)
4. What's your pace? (Relaxed/Balanced/Packed)
5. Any special occasion? (Optional: Anniversary, Birthday, Event attendance)

### Flow B: Share Recipient
```
Shared URL → View Itinerary → "Customize This Trip" → Quiz → New Itinerary
```

### Flow C: Local Business
```
Partner Page → Feature Request Form → Admin Review → Listing Update
```

---

## 7. UI/UX Design

### Visual Identity
- **Primary:** Deep lake blue (#1E3A5F)
- **Secondary:** Sunset coral (#FF6B6B)
- **Accent:** Wine burgundy (#722F37)
- **Background:** Sand/cream (#F5F0E6)
- **Typography:** Inter (body), Playfair Display (headings)

### Key Screens

#### 1. Landing
- Hero: GOTL aerial/lake imagery
- Value prop: "Your perfect GOTL weekend, planned in 2 minutes"
- CTA: "Plan My Trip" (prominent)
- Preview: Sample itinerary screenshots

#### 2. Quiz
- Progress indicator (step X of 5)
- Large touch targets
- Skip option where appropriate
- Contextual imagery per question

#### 3. Itinerary View
- Day timeline (morning → afternoon → evening)
- Venue cards with images
- Expandable details (hours, tips, alternatives)
- "Remix" button for regeneration
- Share button (copy URL, social)

#### 4. Venue Detail
- Photo gallery
- Description + hours
- Map location
- Tips (insider info)
- Related itineraries

---

## 8. Implementation Phases

### Phase 1: MVP (Weeks 1-4)
- [ ] Landing page with quiz
- [ ] Static venue database (20-30 curated spots)
- [ ] Basic itinerary algorithm (rule-based)
- [ ] Itinerary view + share
- [ ] Mobile-optimized styling
- **Definition of Done:** Visitor can complete quiz and get shareable itinerary

### Phase 2: Enhanced (Weeks 5-8)
- [ ] Event calendar integration
- [ ] Weather API integration
- [ ] Expand venue database (50+ spots)
- [ ] Improved algorithm (preference weighting)
- [ ] Maps integration
- **Definition of Done:** Event-aware, weather-informed itineraries

### Phase 3: Scale (Weeks 9-12)
- [ ] User accounts
- [ ] Multi-day itineraries
- [ ] Partner portal
- [ ] Analytics dashboard
- [ ] Feedback/review system
- **Definition of Done:** Full-featured platform with partner tools

---

## 9. Algorithm Logic (MVP)

```
INPUT: Preferences (dates, group, interests, pace)
OUTPUT: Ordered list of itinerary items

STEPS:
1. Filter venues by:
   - Seasonal availability
   - Group compatibility (kid-friendly check)
   - Interest match score > threshold

2. Categorize into time slots:
   - Morning: Nature, coffee, early winery
   - Midday: Beach, lunch, activities
   - Afternoon: Winery tours, shopping
   - Evening: Dinner, sunset, nightlife

3. Apply constraints:
   - Travel time between venues (cluster by location)
   - Opening hours compatibility
   - "Don't schedule winery before 11am"
   - Meal timing (lunch 11:30-2, dinner 5-9)

4. Select top venue per slot based on:
   - Interest match (weighted by user selection)
   - Rating/score
   - Variety (don't repeat categories)

5. Add tips based on:
   - Venue-specific advice
   - Seasonal notes
   - Parking/traffic guidance
```

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Quiz completion rate | >70% | Funnel analytics |
| Itinerary shares | >30% of users | Share button clicks |
| Return visits | >20% within 6mo | User tracking |
| Partner signups | 10 businesses | Form submissions |
| Page load time | <2s | Lighthouse |
| Mobile traffic | >70% | Analytics |

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data accuracy | High | Medium | Quarterly reviews, user feedback |
| Seasonal traffic spikes | Medium | Medium | Static hosting, CDN caching |
| Partner buy-in | Medium | High | Free value first, prove ROI |
| Algorithm edge cases | Medium | Low | Manual override options |

---

## 12. Open Questions

1. Can we get official event calendar API from Chamber/CVB?
2. What's the policy on featuring businesses without explicit permission?
3. Should we include user reviews in MVP or defer to Phase 2?
4. How do we handle winery reservation requirements during peak season?

---

*SPEC Version: 1.0*  
*Date: February 18, 2026*  
*Next Review: After Phase 1 completion*
