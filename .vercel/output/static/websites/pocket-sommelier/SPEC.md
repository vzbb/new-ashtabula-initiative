# SPEC.md — Pocket Sommelier
**Project:** AI Wine Pairing Tool for Ashtabula County Restaurants  
**Date:** 2026-02-20  
**Status:** Phase 3 Complete — Ready for Implementation  
**Previous:** Phase 1 Research, Phase 2 Outreach

---

## 1. Executive Summary

**Concept:** A QR-code-based AI sommelier that diners scan at their table to get personalized wine pairing recommendations from the restaurant's wine list. Helps diners discover local wines while reducing server burden.

**Target Users:**
- Restaurant diners (customers)
- Restaurant staff (servers, managers)
- Local wineries (featured partners)

**Key Differentiators:**
- Instant AI recommendations (no waiting for server)
- Showcases local Ashtabula/Geneva wines
- Reduces server training burden
- No app download required (web-based)
- Restaurant controls wine list and pricing

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │   Diner      │  │   Server     │  │  Restaurant  │                       │
│  │   (Mobile    │  │   (Tablet    │  │   Dashboard  │                       │
│  │   Web)       │  │   Web)       │  │   (React)    │                       │
│  └──────────────┘  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER (Node.js/Express)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Pairing   │ │   Wine      │ │  Restaurant │ │   Order     │           │
│  │   Engine    │ │   API       │ │    API      │ │   API       │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐                                           │
│  │   Menu      │ │  Analytics  │                                           │
│  │   Parser    │ │   API       │                                           │
│  └─────────────┘ └─────────────┘                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   PostgreSQL     │  │     Redis        │  │    Firebase      │          │
│  │   (Primary DB)   │  │  (Sessions)      │  │   (Storage)      │          │
│  │   - Wines        │  │  - Pairing       │  │   - Wine photos  │          │
│  │   - Restaurants  │  │    cache         │  │   - QR codes     │          │
│  │   - Pairings     │  │                  │  │                  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                                   │
│  │  Gemini  │  │  SendGrid│  │  QR Code │                                   │
│  │  API     │  │  Email   │  │  Generator                                  │
│  └──────────┘  └──────────┘  └──────────┘                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | React 18 + Vite | Fast, mobile-first |
| **State** | Zustand | Simple state management |
| **Styling** | Tailwind CSS | Rapid UI, responsive |
| **Backend** | Node.js + Express | Restaurant-friendly |
| **Database** | PostgreSQL 15 | Relational wine data |
| **Cache** | Redis | Pairing suggestions cache |
| **AI** | Gemini API | Wine pairing intelligence |
| **Storage** | Firebase Storage | Wine photos, QR codes |
| **Email** | SendGrid | Notifications |
| **Hosting** | Railway/Render | Simple deploy |

---

## 4. Data Models

### Wine
```typescript
interface Wine {
  id: string;
  restaurant_id: string;
  
  // Basic info
  name: string;
  winery: string;
  vintage?: number;
  
  // Classification
  type: 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert';
  varietal: string;                        // "Cabernet Sauvignon", "Chardonnay"
  region: string;                          // "Geneva, Ohio", "Napa Valley"
  
  // Characteristics (for AI pairing)
  profile: {
    body: 'light' | 'medium' | 'full';
    sweetness: 'dry' | 'off-dry' | 'sweet';
    acidity: 'low' | 'medium' | 'high';
    tannins: 'low' | 'medium' | 'high';
    flavor_notes: string[];                // ["blackberry", "oak", "vanilla"]
  };
  
  // Pricing
  price_glass?: number;
  price_bottle: number;
  price_taste?: number;
  
  // Availability
  is_available: boolean;
  inventory_count?: number;
  
  // Media
  photo_url?: string;
  description?: string;
  
  // Metadata
  is_local: boolean;                       // Ashtabula/Geneva winery
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}
```

### Restaurant
```typescript
interface Restaurant {
  id: string;
  name: string;
  slug: string;                            // URL-friendly name
  
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    lat?: number;
    lng?: number;
  };
  
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  
  // Configuration
  settings: {
    currency: string;                      // "USD"
    timezone: string;
    
    // QR Code settings
    qr_code_enabled: boolean;
    qr_code_table_specific: boolean;       // Different codes per table
    
    // Pairing settings
    allow_ai_pairing: boolean;
    require_server_approval: boolean;      // For orders
    
    // Display settings
    show_prices: boolean;
    show_winery_details: boolean;
    highlight_local_wines: boolean;
  };
  
  // Subscription
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_expires_at?: Date;
  
  is_active: boolean;
  created_at: Date;
}
```

### Pairing Session
```typescript
interface PairingSession {
  id: string;
  restaurant_id: string;
  table_number?: string;
  
  // Diner preferences
  diner_profile: {
    occasion?: 'casual' | 'date' | 'business' | 'celebration';
    wine_preference?: 'red' | 'white' | 'rosé' | 'sparkling' | 'any';
    sweetness_preference?: 'dry' | 'any' | 'sweet';
    price_range?: 'budget' | 'moderate' | 'premium' | 'luxury';
    adventurousness: 1-5;                  // 1=safe, 5=experimental
  };
  
  // Food they're having
  food_order: {
    items: {
      name: string;
      description: string;
      category: 'appetizer' | 'entree' | 'dessert';
      protein?: 'beef' | 'pork' | 'chicken' | 'fish' | 'seafood' | 'vegetarian';
      preparation?: 'grilled' | 'fried' | 'roasted' | 'raw';
      sauce_profile?: 'creamy' | 'tomato' | 'butter' | 'citrus' | 'spicy';
    }[];
  };
  
  // AI Recommendations
  recommendations: WineRecommendation[];
  
  // Selection
  selected_wine?: Wine;
  ordered: boolean;
  
  created_at: Date;
  expires_at: Date;                        // Session TTL
}

interface WineRecommendation {
  wine_id: string;
  wine: Wine;
  
  // AI-generated
  pairing_score: number;                   // 0-100
  pairing_reason: string;                  // "The bold tannins complement the ribeye's richness"
  suggested_food_pairing?: string;         // "Try with the herb-crusted salmon"
  
  // Positioning
  rank: number;                            // 1st, 2nd, 3rd choice
  is_local_highlight: boolean;
  
  // Engagement
  was_viewed: boolean;
  was_selected: boolean;
}
```

### QR Code
```typescript
interface QRCode {
  id: string;
  restaurant_id: string;
  
  // Configuration
  code_type: 'general' | 'table-specific';
  table_number?: string;
  
  // Generated data
  url: string;                             // https://pocketsommelier.com/r/{restaurant_slug}/{code}
  image_url: string;                       // PNG/SVG QR code
  
  // Analytics
  scan_count: number;
  last_scanned_at?: Date;
  
  is_active: boolean;
  created_at: Date;
}
```

---

## 5. API Endpoints

### Diner API (Public)
```
GET  /r/:restaurantSlug           # Landing page for restaurant
POST /api/v1/sessions             # Start pairing session
POST /api/v1/sessions/:id/food    # Add food items
GET  /api/v1/sessions/:id/recommendations  # Get AI pairings
POST /api/v1/sessions/:id/select  # Select a wine
GET  /api/v1/wines/:id            # Wine details
```

### Restaurant Dashboard API
```
GET  /api/v1/admin/restaurant     # Get restaurant profile
PUT  /api/v1/admin/restaurant     # Update settings

GET  /api/v1/admin/wines          # List wines
POST /api/v1/admin/wines          # Add wine
PUT  /api/v1/admin/wines/:id      # Update wine
DELETE /api/v1/admin/wines/:id    # Remove wine

GET  /api/v1/admin/qrcodes        # List QR codes
POST /api/v1/admin/qrcodes        # Generate new QR
DELETE /api/v1/admin/qrcodes/:id  # Deactivate

GET  /api/v1/admin/analytics      # Dashboard stats
GET  /api/v1/admin/sessions       # Recent sessions
```

---

## 6. Frontend Component Hierarchy

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── WineGlass.tsx
│   │
│   ├── diner/
│   │   ├── WelcomeScreen.tsx      # Restaurant branding, start button
│   │   ├── OccasionSelector.tsx   # Casual/date/business
│   │   ├── PreferenceSelector.tsx # Red/white/sweetness
│   │   ├── FoodInput.tsx          # Describe what they're eating
│   │   ├── RecommendationCard.tsx # Single wine recommendation
│   │   ├── RecommendationList.tsx # Ranked list
│   │   ├── WineDetail.tsx         # Full wine info
│   │   └── CallServer.tsx         # "Call server to order"
│   │
│   ├── restaurant/
│   │   ├── WineForm.tsx           # Add/edit wine
│   │   ├── WineList.tsx           # Manage wine inventory
│   │   ├── QRCodeGenerator.tsx    # Create QR codes
│   │   ├── QRCodeDisplay.tsx      # Print-ready QR
│   │   ├── AnalyticsDashboard.tsx # Stats/charts
│   │   └── SettingsPanel.tsx      # Restaurant config
│   │
│   └── shared/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── pages/
│   ├── diner/
│   │   ├── RestaurantLanding.tsx  # /r/:slug
│   │   ├── Preferences.tsx        # Set preferences
│   │   ├── FoodInput.tsx          # What are you eating?
│   │   ├── Recommendations.tsx    # AI suggestions
│   │   └── WineDetail.tsx         # Selected wine
│   │
│   └── restaurant/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── Wines.tsx
│       ├── QRCodes.tsx
│       └── Analytics.tsx
│
└── lib/
    ├── api.ts
    └── pairing-engine.ts
```

---

## 7. Key User Flows

### Flow 1: Diner Experience
```
1. Sit at table, see QR code
2. Scan with phone camera
3. Land on restaurant-branded page
4. Tap "Find My Perfect Wine"
5. Select occasion (casual/date/business)
6. Select wine preference (red/white/any)
7. Describe what they're eating (text or pick from menu)
8. AI generates 3 recommendations
9. Browse wines with pairing explanations
10. Tap "I'd like this" → notifies server
11. Server brings wine
```

### Flow 2: Restaurant Setup
```
1. Sign up for account
2. Add restaurant details
3. Upload wine list (CSV or manual entry)
4. Generate QR codes (general or per-table)
5. Print QR codes, place on tables
6. Train staff: "Guests may scan for wine help"
7. Monitor analytics dashboard
```

### Flow 3: AI Pairing Engine
```
1. Receive: diner preferences + food description
2. Query restaurant's available wines
3. For each wine, Gemini API generates:
   - Pairing score (0-100)
   - Pairing explanation
   - Alternative food suggestions
4. Rank wines by score
5. Return top 3 recommendations
6. Cache results for 1 hour
```

---

## 8. AI Pairing Prompt

```typescript
const pairingPrompt = `
You are an expert sommelier. Recommend wines from this list to pair with the customer's meal.

AVAILABLE WINES:
${wines.map(w => `- ${w.name} (${w.type}, ${w.varietal}, ${w.profile.body} body, ${w.profile.sweetness}, notes: ${w.profile.flavor_notes.join(', ')}) - $${w.price_bottle}`).join('\n')}

DINER PREFERENCES:
- Occasion: ${preferences.occasion}
- Wine preference: ${preferences.wine_preference}
- Price range: ${preferences.price_range}
- Adventurousness: ${preferences.adventurousness}/5

FOOD ORDER:
${food.items.map(f => `- ${f.name}: ${f.description} (${f.protein}, ${f.preparation}, ${f.sauce_profile})`).join('\n')}

For each wine, provide:
1. Pairing score (0-100)
2. Detailed explanation of why it pairs well
3. Suggested food pairing from their order

Return JSON format with top 3 recommendations ranked by score.
`;
```

---

## 9. Business Model

| Tier | Monthly Fee | Features |
|------|-------------|----------|
| **Free** | $0 | 20 wines, basic QR, email support |
| **Pro** | $29 | Unlimited wines, table-specific QR, analytics |
| **Enterprise** | $99 | Multi-location, API access, priority support |

**Alternative Revenue:**
- Featured winery placement (local wineries pay for highlighting)
- Commission on wine sales (future integration)

**Cost Estimates (Monthly)**
| Item | Cost |
|------|------|
| Hosting | $20 |
| Database | $15 |
| Gemini API | $20 (estimate) |
| Firebase Storage | $5 |
| **Total** | **~$60/mo** |

---

## 10. Implementation Phases

### Phase 1: MVP Core (Weeks 1-4)
- [ ] Restaurant signup + dashboard
- [ ] Wine list management
- [ ] QR code generation
- [ ] Diner mobile experience
- [ ] Basic AI pairing (Gemini)
- [ ] One pilot restaurant (Ferrante)

**Success Criteria:** 100 sessions, 50 wine selections

### Phase 2: Polish + Growth (Weeks 5-8)
- [ ] Table-specific QR codes
- [ ] Server notification system
- [ ] Analytics dashboard
- [ ] Local wine highlighting
- [ ] 3-5 restaurant pilots

**Success Criteria:** 500 sessions, 3 restaurants active

### Phase 3: Scale (Weeks 9-12)
- [ ] Menu integration (PDF/image parsing)
- [ ] Order integration with POS
- [ ] Winery partner portal
- [ ] Wine trail integration
- [ ] 10+ restaurants

**Success Criteria:** 2000 sessions, 10 restaurants, 1 winery partnership

---

## 11. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Restaurants don't want diners on phones | Medium | High | Position as server assistant, not replacement |
| AI pairing quality poor | Medium | High | Manual sommelier review, feedback loop |
| Diners prefer human sommelier | Low | Medium | Hybrid model, server gets AI suggestions too |
| Gemini API costs high | Low | Medium | Caching, rate limiting |
| Wine list maintenance burden | Medium | Medium | CSV import, simple UI |

---

## 12. Next Steps

### Immediate
1. **Contact Ferrante Winery** — Call (440) 466-8466, request pilot
2. **Scaffold project** — React + Node setup
3. **Build wine form** — Restaurant data entry
4. **QR code generator** — Basic implementation

### Week 1
1. Restaurant dashboard (add wines)
2. QR code landing page
3. Basic pairing flow
4. Gemini integration

---

**Document Status:** Phase 3 Complete  
**Ready for:** Implementation (Phase 4)  
**Priority Pilot:** Ferrante Winery & Ristorante (440-466-8466)
