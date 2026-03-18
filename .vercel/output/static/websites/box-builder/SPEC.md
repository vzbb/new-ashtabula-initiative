# SPEC.md — Box Builder
**Project:** AI Custom Box Estimation Tool for Packaging Manufacturers  
**Date:** 2026-02-20  
**Status:** Phase 3 Complete — Ready for Implementation  
**Previous:** Phase 1 Research, Phase 2 Outreach

---

## 1. Executive Summary

**Concept:** An AI-powered box estimation tool that helps packaging manufacturers (starting with Northeast Ohio) provide instant custom box quotes to customers. Customers enter product dimensions, get 3D box recommendations with rough pricing, then connect with the manufacturer for final quote.

**Target Users:**
- Packaging manufacturers (Northeast Box, Welch Packaging Ashtabula)
- E-commerce sellers needing custom boxes
- Small businesses shipping products

**Key Differentiators:**
- Instant quotes vs. hours/days wait
- 3D visualization of box fit
- Local manufacturer focus (not national platforms like Packlane)
- SVG dieline generation for download

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │   Customer   │  │ Manufacturer │  │   Admin      │                       │
│  │   Web App    │  │   Dashboard  │  │   Panel      │                       │
│  │   (React)    │  │   (React)    │  │   (React)    │                       │
│  └──────────────┘  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER (Node.js/Express)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Box Calc  │ │   Pricing   │ │   Quotes    │ │   Users     │           │
│  │   Engine    │ │   Engine    │ │   API       │ │   API       │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                           │
│  │  Dieline    │ │   Email     │ │   Analytics │                           │
│  │  Generator  │ │   (SendGrid)│ │   API       │                           │
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
│  │   - Boxes        │  │  - Quote cache   │  │   - Dielines     │          │
│  │   - Quotes       │  │  - Rate limits   │  │   - Assets       │          │
│  │   - Pricing      │  │                  │  │                  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | React 18 + Vite + Three.js | 3D visualization essential |
| **State** | Zustand | Simple, effective |
| **Styling** | Tailwind CSS | Rapid UI development |
| **Backend** | Node.js + Express | Mature, manufacturer-friendly |
| **Database** | PostgreSQL 15 | Relational pricing data |
| **Cache** | Redis | Quote caching, sessions |
| **3D Engine** | Three.js | Box visualization |
| **Storage** | Firebase Storage | SVG dielines, assets |
| **Email** | SendGrid | Quote notifications |
| **Hosting** | Railway/Render | Simple deployment |

---

## 4. Data Models

### Box Configuration
```typescript
interface BoxConfig {
  id: string;
  style: 'rsc' | 'folf' | 'mailer';      // Regular Slotted Container (MVP only)
  dimensions: {
    length: number;                        // inches
    width: number;
    height: number;
  };
  material: {
    flute: 'A' | 'B' | 'C' | 'E';          // C-flute standard
    ect: 32 | 44 | 48 | 51;               // Edge Crush Test
    liner: 'kraft' | 'white' | 'test';
  };
  print?: {
    type: 'none' | 'one_color' | 'two_color' | 'full';
    locations?: ('outside' | 'inside')[];
  };
  quantity: number;
  
  // Calculated fields
  board_sq_ft: number;
  dieline_svg?: string;
  estimated_cost?: number;
  
  created_at: Date;
}
```

### Product Input
```typescript
interface ProductInput {
  id: string;
  session_id: string;
  
  // What the customer is shipping
  product_dimensions: {
    length: number;
    width: number;
    height: number;
    weight_oz: number;
  };
  
  // Fit preferences
  clearances: {
    top: number;                           // extra space (inches)
    sides: number;
    length_end: number;
  };
  
  // Protection needs
  fragility: 'low' | 'medium' | 'high';
  needs_insert: boolean;
  
  // Volume
  estimated_monthly_volume: number;
  
  // Calculated recommendations
  recommended_boxes: BoxRecommendation[];
  
  created_at: Date;
}

interface BoxRecommendation {
  box_config: BoxConfig;
  fit_score: number;                       // 0-100
  price_estimate: {
    min: number;
    max: number;
    per_unit: number;
  };
  warnings: string[];                      // "tight fit", "oversized", etc.
}
```

### Quote Request
```typescript
interface QuoteRequest {
  id: string;
  manufacturer_id: string;
  
  // Customer info
  customer: {
    email: string;
    name: string;
    company?: string;
    phone?: string;
  };
  
  // What they want
  product_input: ProductInput;
  selected_box: BoxConfig;
  
  // Status
  status: 'submitted' | 'viewed' | 'quoted' | 'accepted' | 'declined';
  
  // Manufacturer response
  manufacturer_response?: {
    final_price: number;
    lead_time_days: number;
    notes: string;
    responded_at: Date;
  };
  
  created_at: Date;
  updated_at: Date;
}
```

### Manufacturer
```typescript
interface Manufacturer {
  id: string;
  name: string;                            // "Northeast Box Company"
  location: {
    city: string;
    state: string;
    zip: string;
  };
  
  // Contact
  email: string;
  phone: string;
  website?: string;
  
  // Pricing model
  pricing_config: {
    base_markup_percent: number;
    volume_discounts: {
      min_quantity: number;
      discount_percent: number;
    }[];
    material_costs: {
      [key: string]: number;               // $ per sq ft by material
    };
  };
  
  // Capabilities
  capabilities: {
    min_quantity: number;
    max_quantity: number;
    box_styles: string[];
    print_options: string[];
    lead_time_days: number;
  };
  
  is_active: boolean;
  created_at: Date;
}
```

---

## 5. API Endpoints

### Public API
```
POST /api/v1/calculate-box            # Calculate box from product dimensions
GET  /api/v1/box-styles               # Available box styles
GET  /api/v1/materials                # Available materials
GET  /api/v1/dieline/:boxId           # Download SVG dieline
```

### Quote API
```
POST /api/v1/quotes                   # Submit quote request
GET  /api/v1/quotes/:id               # Check quote status
PUT  /api/v1/quotes/:id/cancel        # Cancel pending quote
```

### Manufacturer Dashboard API
```
GET  /api/v1/mfr/quotes               # List incoming quotes
GET  /api/v1/mfr/quotes/:id           # Quote detail
PUT  /api/v1/mfr/quotes/:id/respond   # Send final quote
GET  /api/v1/mfr/stats                # Dashboard stats
PUT  /api/v1/mfr/pricing              # Update pricing config
```

---

## 6. Frontend Component Hierarchy

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Slider.tsx
│   │   └── Select.tsx
│   │
│   ├── calculator/
│   │   ├── ProductInputForm.tsx     # L×W×H + weight input
│   │   ├── ClearanceSelector.tsx    # Tight vs loose fit
│   │   ├── FragilitySelector.tsx    # Protection level
│   │   ├── VolumeEstimator.tsx      # Monthly volume
│   │   └── CalculateButton.tsx
│   │
│   ├── results/
│   │   ├── RecommendationCard.tsx   # Single box option
│   │   ├── RecommendationList.tsx   # Ranked options
│   │   ├── Box3DPreview.tsx         # Three.js viewer
│   │   ├── FitVisualization.tsx     # Product inside box
│   │   ├── PriceEstimate.tsx        # Min/max pricing
│   │   ├── DielineDownload.tsx      # SVG download
│   │   └── QuoteForm.tsx            # Contact manufacturer
│   │
│   ├── manufacturer/
│   │   ├── QuoteQueue.tsx           # Incoming requests
│   │   ├── QuoteDetail.tsx          # Full quote view
│   │   ├── PricingConfig.tsx        # Update pricing
│   │   └── StatsDashboard.tsx
│   │
│   └── threejs/
│       ├── BoxMesh.tsx              # 3D box geometry
│       ├── ProductMesh.tsx          # Product inside
│       ├── Scene.tsx                # Three.js scene
│       └── Controls.tsx             # Rotate/zoom
│
├── pages/
│   ├── customer/
│   │   ├── Home.tsx
│   │   ├── Calculator.tsx
│   │   ├── Results.tsx
│   │   └── QuoteConfirmation.tsx
│   │
│   └── manufacturer/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── Quotes.tsx
│       └── Settings.tsx
│
└── lib/
    ├── api.ts
    ├── box-calculator.ts
    ├── dieline-generator.ts
    └── pricing-engine.ts
```

---

## 7. Key User Flows

### Flow 1: Customer Gets Box Estimate
```
1. Visit site → "Get Custom Box Quote" CTA
2. Enter product dimensions (L×W×H in inches)
3. Enter product weight
4. Select fit preference (tight/snug/loose)
5. Select fragility (durable/normal/fragile)
6. Estimate monthly volume
7. Click "Calculate"
8. See 3 recommendations with:
   - 3D visualization (product in box)
   - Fit score percentage
   - Price estimate range
   - Box specifications
9. Select preferred option
10. Download SVG dieline (optional)
11. Fill contact info + submit quote request
12. Receive confirmation email
```

### Flow 2: Manufacturer Responds
```
1. Login to manufacturer dashboard
2. See new quote request in queue
3. View product details + requested box
4. Enter final pricing in dashboard
5. Add lead time estimate
6. Add any notes
7. Send quote
8. Customer receives email notification
```

### Flow 3: 3D Visualization
```
1. Customer enters dimensions
2. Algorithm calculates optimal box sizes
3. Three.js renders:
   - Outer box (wireframe + solid toggle)
   - Inner product (to scale)
   - Clearance visualization (gaps shown)
4. Customer rotates/zooms to inspect fit
5. Hover shows exact dimensions
```

---

## 8. Box Calculation Algorithm

```typescript
function calculateBoxDimensions(product: ProductInput): BoxConfig[] {
  const { length, width, height, weight_oz } = product.product_dimensions;
  const { top, sides, length_end } = product.clearances;
  
  // Calculate inner dimensions needed
  const innerLength = length + (length_end * 2);
  const innerWidth = width + (sides * 2);
  const innerHeight = height + top;
  
  // Determine material strength based on weight + fragility
  const ect = determineECT(weight_oz, product.fragility);
  
  // Calculate board dimensions (accounting for material thickness)
  const materialThickness = getMaterialThickness(ect);
  const outerLength = innerLength + (materialThickness * 2);
  const outerWidth = innerWidth + (materialThickness * 2);
  const outerHeight = innerHeight + (materialThickness * 2);
  
  // Calculate board square footage for pricing
  const blankLength = (outerWidth * 2) + (outerLength * 2) + 2; // glue flap
  const blankWidth = outerHeight + (outerWidth * 0.5) + (outerLength * 0.5);
  const sqFt = (blankLength * blankWidth) / 144;
  
  return {
    style: 'rsc',
    dimensions: { length: outerLength, width: outerWidth, height: outerHeight },
    material: { flute: 'C', ect, liner: 'kraft' },
    board_sq_ft: sqFt,
    // ...
  };
}

function estimatePrice(box: BoxConfig, quantity: number, mfr: Manufacturer): PriceEstimate {
  const materialCost = box.board_sq_ft * mfr.pricing_config.material_costs[box.material.liner];
  const baseCost = materialCost * quantity;
  const markup = baseCost * (mfr.pricing_config.base_markup_percent / 100);
  
  // Apply volume discounts
  let total = baseCost + markup;
  for (const discount of mfr.pricing_config.volume_discounts) {
    if (quantity >= discount.min_quantity) {
      total = total * (1 - discount.discount_percent / 100);
    }
  }
  
  // Add uncertainty range (±15% until confirmed)
  const perUnit = total / quantity;
  return {
    min: perUnit * 0.85,
    max: perUnit * 1.15,
    per_unit: perUnit
  };
}
```

---

## 9. SVG Dieline Generation

```typescript
function generateRSCDieline(box: BoxConfig): string {
  const { length, width, height } = box.dimensions;
  
  // RSC blank layout:
  // [ flap ][  width  ][ length ][  width  ][ length ][ flap ]
  //         [   panel (height)   ]
  //         [   panel (height)   ]
  //         [      flaps         ]
  
  const glueFlap = 2; // inches
  const blankWidth = (width * 2) + (length * 2) + glueFlap;
  const blankHeight = height + width + width; // height + top/bottom flaps
  
  return `
    <svg viewBox="0 0 ${blankWidth} ${blankHeight}" xmlns="http://www.w3.org/2000/svg">
      <!-- Cut lines -->
      <path d="M ${glueFlap} 0 L ${glueFlap + width} 0 ..." stroke="black" fill="none"/>
      <!-- Crease lines (dash) -->
      <path d="M 0 ${height} L ${blankWidth} ${height}" stroke="black" stroke-dasharray="5,5"/>
      <!-- Dimensions标注 -->
      <text x="${glueFlap + width/2}" y="${height/2}">${width}"</text>
      <!-- ... -->
    </svg>
  `;
}
```

---

## 10. Business Model

**Manufacturer SaaS Model**
| Tier | Monthly Fee | Features |
|------|-------------|----------|
| **Free** | $0 | 10 quotes/mo, basic branding |
| **Pro** | $49 | Unlimited quotes, custom branding, analytics |
| **Enterprise** | $199 | API access, multi-user, priority support |

**Alternative: Lead Generation**
- Free for manufacturers
- Charge per qualified lead ($5-10)
- Premium placement for sponsored manufacturers

**Cost Estimates (Monthly)**
| Item | Cost |
|------|------|
| Hosting | $25 |
| Database | $15 |
| Three.js CDN | $0 |
| SendGrid | $0 (free tier) |
| **Total** | **~$40/mo** |

---

## 11. Implementation Phases

### Phase 1: MVP Core (Weeks 1-4)
- [ ] Product dimension input form
- [ ] Box calculation engine (RSC only)
- [ ] Basic 3D visualization (Three.js)
- [ ] SVG dieline generation
- [ ] Quote submission form
- [ ] Email notifications (SendGrid)
- [ ] One pilot manufacturer (Northeast Box)

**Success Criteria:** 50 calculations, 10 quote requests

### Phase 2: Polish + Growth (Weeks 5-8)
- [ ] Advanced 3D (rotate, zoom, wireframe)
- [ ] Fit visualization (product inside box)
- [ ] Manufacturer dashboard
- [ ] Pricing configuration UI
- [ ] Multiple manufacturers
- [ ] Volume discount calculator

**Success Criteria:** 3 manufacturers, 100 quotes/mo

### Phase 3: Scale (Weeks 9-12)
- [ ] Additional box styles (FOL, mailers)
- [ ] Shipping cost estimates (FedEx/UPS APIs)
- [ ] Insert/void fill recommendations
- [ ] Print design upload
- [ ] White-label option

**Success Criteria:** 10 manufacturers, 500 quotes/mo

---

## 12. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Pricing inaccurate | Conservative estimates + "contact for final quote" |
| No manufacturer partners | Pivot to affiliate model (Packlane/Arka) |
| Complex box geometry | Limit MVP to RSC, expand later |
| 3D performance issues | Optimize geometry, LOD models |

---

## 13. Next Steps

1. **Contact Northeast Box** — Call 440-998-2411, request pilot partnership
2. **Scaffold project** — React + Vite + Three.js setup
3. **Build calculator** — Product input → box dimensions
4. **3D prototype** — Basic box visualization

---

**Document Status:** Phase 3 Complete  
**Ready for:** Implementation (Phase 4)  
**Priority Partner:** Northeast Box Company / Welch Packaging Ashtabula
