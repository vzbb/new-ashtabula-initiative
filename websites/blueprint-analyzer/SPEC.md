# Phase 3: Technical Specification — Blueprint Analyzer MVP
**Project:** Blueprint Analyzer (New Ashtabula Initiative)  
**Date:** February 19, 2026  
**Version:** 1.0 — MVP Scope

---

## 1. User Stories with Acceptance Criteria

### US-001: Upload Blueprint
**As a** contractor, **I want to** upload a PDF blueprint, **so that** I can analyze it for measurements.

**Acceptance Criteria:**
- [ ] User can drag-and-drop or select PDF files up to 50MB
- [ ] Supported formats: PDF, PNG, JPG
- [ ] User sees upload progress indicator
- [ ] Invalid file types show clear error message
- [ ] Uploaded file appears in project within 3 seconds

**Priority:** P0 (Critical)  
**Estimate:** 4 hours

---

### US-002: Automatic Measurement Extraction
**As a** contractor, **I want to** automatically extract room dimensions, **so that** I don't have to measure manually.

**Acceptance Criteria:**
- [ ] AI identifies rooms, walls, and openings from blueprint
- [ ] System displays extracted measurements on overlay
- [ ] User can correct any incorrect measurements
- [ ] Measurements display in feet/inches format
- [ ] Processing completes within 30 seconds for typical blueprint

**Priority:** P0 (Critical)  
**Estimate:** 12 hours

---

### US-003: Square Footage Calculation
**As a** contractor, **I want to** calculate total square footage by room and overall, **so that** I can estimate materials accurately.

**Acceptance Criteria:**
- [ ] System calculates square footage for each identified room
- [ ] System calculates total living area / footprint
- [ ] Results display in table format with room names
- [ ] User can manually add rooms not detected by AI
- [ ] Calculations update in real-time when measurements change

**Priority:** P0 (Critical)  
**Estimate:** 6 hours

---

### US-004: Scale Calibration
**As a** contractor, **I want to** specify or verify the blueprint scale, **so that** measurements are accurate.

**Acceptance Criteria:**
- [ ] User can select from common scales (1/4"=1', 1/8"=1', 1:100, etc.)
- [ ] User can enter custom scale ratio
- [ ] System provides visual scale reference on blueprint
- [ ] User can calibrate using known dimension (e.g., "this wall is 12 feet")
- [ ] Scale setting persists for all sheets in multi-page PDF

**Priority:** P0 (Critical)  
**Estimate:** 6 hours

---

### US-005: Export to Excel/CSV
**As a** contractor, **I want to** export measurements to Excel, **so that** I can use them in my estimating workflow.

**Acceptance Criteria:**
- [ ] Export button available on all analysis results
- [ ] Export formats: CSV and XLSX
- [ ] Export includes: room name, dimensions, square footage, notes
- [ ] File downloads immediately
- [ ] Export filename includes project name and date

**Priority:** P1 (High)  
**Estimate:** 4 hours

---

### US-006: Project Management
**As a** contractor, **I want to** organize blueprints into projects, **so that** I can manage multiple jobs.

**Acceptance Criteria:**
- [ ] User can create projects with name and address
- [ ] User can upload multiple blueprints per project
- [ ] Project list view shows all active projects
- [ ] User can archive or delete projects
- [ ] Search/filter projects by name or date

**Priority:** P1 (High)  
**Estimate:** 6 hours

---

### US-007: User Authentication
**As a** contractor, **I want to** create an account and log in securely, **so that** my project data is private.

**Acceptance Criteria:**
- [ ] Email/password registration with validation
- [ ] Email verification required
- [ ] Password reset functionality
- [ ] Google OAuth option
- [ ] Session persists for 7 days

**Priority:** P1 (High)  
**Estimate:** 6 hours

---

### US-008: Measurement Annotation
**As a** contractor, **I want to** add notes and annotations to measurements, **so that** I can remember specific details.

**Acceptance Criteria:**
- [ ] User can click any measurement to add text note
- [ ] Notes display on hover or in sidebar
- [ ] Notes are included in export
- [ ] User can edit or delete notes
- [ ] Notes persist across sessions

**Priority:** P2 (Medium)  
**Estimate:** 4 hours

---

## 2. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   React App  │  │  Firebase   │  │   Gemini Vision API     │ │
│  │  (Frontend)  │  │    Auth     │  │    (AI Analysis)        │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
│         │                │                      │               │
│         └────────────────┴──────────────────────┘               │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                    FIREBASE / GCP LAYER                          │
│  ┌─────────────┐  ┌──────┴──────┐  ┌─────────────────────────┐ │
│  │   Cloud     │  │  Firestore  │  │    Cloud Storage        │ │
│  │  Functions  │  │  (Database) │  │   (Blueprint Files)     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript 5 | UI framework |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **State** | Zustand | Global state management |
| **Routing** | React Router 6 | SPA navigation |
| **Auth** | Firebase Authentication | User management |
| **Database** | Cloud Firestore | Project/document data |
| **Storage** | Firebase Storage | Blueprint PDF/images |
| **Backend** | Firebase Cloud Functions | API endpoints |
| **AI Vision** | Google Gemini Vision API | Blueprint analysis |
| **PDF Processing** | PDF.js | Client-side PDF rendering |
| **Hosting** | Firebase Hosting | Production deployment |
| **CI/CD** | GitHub Actions | Automated deploys |

### Component Architecture

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── blueprint/
│   │   ├── BlueprintViewer.tsx      # PDF display with zoom/pan
│   │   ├── MeasurementOverlay.tsx    # SVG overlay for measurements
│   │   ├── ScaleCalibrator.tsx       # Scale input/calibration
│   │   └── RoomList.tsx              # Detected rooms sidebar
│   ├── projects/
│   │   ├── ProjectList.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ProjectForm.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── AppLayout.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── ProjectDetail.tsx
│   ├── BlueprintAnalyze.tsx
│   └── Settings.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useProject.ts
│   ├── useBlueprint.ts
│   └── useGemini.ts
├── services/
│   ├── firebase.ts
│   ├── gemini.ts
│   └── export.ts
├── types/
│   └── index.ts
└── utils/
    ├── measurements.ts
    ├── pdf.ts
    └── export.ts
```

---

## 3. Data Schema

### Firestore Collections

#### Users Collection
```typescript
interface User {
  uid: string;                    // Firebase Auth UID
  email: string;
  displayName: string;
  companyName?: string;
  phone?: string;
  subscriptionTier: 'free' | 'pro' | 'team' | 'enterprise';
  subscriptionStatus: 'active' | 'trialing' | 'canceled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  projectsCount: number;
  lastLoginAt: Timestamp;
}
```

#### Projects Collection
```typescript
interface Project {
  id: string;                     // Auto-generated
  userId: string;                 // Owner reference
  name: string;
  address?: string;
  clientName?: string;
  description?: string;
  status: 'active' | 'archived' | 'completed';
  blueprints: Blueprint[];
  totalSquareFootage?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Blueprints Subcollection
```typescript
interface Blueprint {
  id: string;
  projectId: string;
  name: string;                   // Filename or user-defined
  fileUrl: string;                // Firebase Storage URL
  fileType: 'pdf' | 'png' | 'jpg';
  fileSize: number;               // Bytes
  pageCount: number;              // For PDFs
  
  // Analysis results
  scale?: {
    ratio: string;                // e.g., "1/4 inch = 1 foot"
    pixelsPerUnit?: number;       // Calculated calibration
  };
  
  rooms: Room[];
  totalSquareFootage: number;
  
  // AI processing
  analysisStatus: 'pending' | 'processing' | 'completed' | 'failed';
  analysisResults?: GeminiAnalysisResult;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Rooms (Embedded in Blueprint)
```typescript
interface Room {
  id: string;                     // UUID
  name: string;                   // e.g., "Master Bedroom"
  type?: string;                  // e.g., "bedroom", "kitchen"
  
  // Measurements
  dimensions: {
    width: number;                // Feet
    length: number;               // Feet
    height?: number;              // Feet (if available)
  };
  
  squareFootage: number;
  
  // Position on blueprint (for overlay)
  boundingBox: {
    x: number;                    // Normalized 0-1
    y: number;
    width: number;
    height: number;
  };
  
  // Manual adjustments
  isManuallyCreated: boolean;
  notes?: string;
  
  // AI confidence
  confidence?: number;            // 0-1
}
```

#### Analysis Results (Cached)
```typescript
interface GeminiAnalysisResult {
  model: string;                  // e.g., "gemini-3-flash"
  promptVersion: string;
  rawResponse: string;
  parsedRooms: Room[];
  processingTimeMs: number;
  tokensUsed: {
    input: number;
    output: number;
  };
  createdAt: Timestamp;
}
```

#### Export History (Optional tracking)
```typescript
interface ExportRecord {
  id: string;
  userId: string;
  projectId: string;
  blueprintId: string;
  format: 'csv' | 'xlsx' | 'pdf';
  fileUrl?: string;               // If stored
  exportedAt: Timestamp;
}
```

### Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects belong to users
    match /projects/{projectId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Blueprints are subcollections
      match /blueprints/{blueprintId} {
        allow read, write: if request.auth != null && get(/databases/$(database)/documents/projects/$(projectId)).data.userId == request.auth.uid;
      }
    }
  }
}
```

---

## 4. Implementation Plan (3 Phases)

### Phase 1: Foundation (Week 1) — 32 hours

| Task | Hours | Owner |
|------|-------|-------|
| Project setup (React + TS + Tailwind + Firebase) | 4 | Dev |
| Firebase configuration (Auth, Firestore, Storage) | 4 | Dev |
| Authentication pages (Login, Register, Reset) | 6 | Dev |
| Project CRUD (list, create, edit, delete) | 8 | Dev |
| File upload component with Storage integration | 6 | Dev |
| Basic routing and navigation | 4 | Dev |

**Deliverable:** Working auth + project management system

---

### Phase 2: Core AI Features (Week 2) — 40 hours

| Task | Hours | Owner |
|------|-------|-------|
| PDF viewer component (PDF.js integration) | 8 | Dev |
| Scale calibration UI and logic | 6 | Dev |
| Gemini Vision API integration | 8 | Dev |
| Prompt engineering for room detection | 6 | Dev |
| Measurement overlay (SVG) | 8 | Dev |
| Room list sidebar with editing | 4 | Dev |

**Deliverable:** Blueprint upload + AI analysis + manual correction

---

### Phase 3: Polish & Launch (Week 3) — 28 hours

| Task | Hours | Owner |
|------|-------|-------|
| Export to CSV/Excel | 4 | Dev |
| Measurement annotations/notes | 4 | Dev |
| UI polish and responsive design | 6 | Dev |
| Error handling and loading states | 4 | Dev |
| Subscription tier enforcement | 4 | Dev |
| Landing page and marketing site | 4 | Dev |
| Deployment and testing | 2 | Dev |

**Deliverable:** Production-ready MVP

### Total MVP Estimate: **100 hours** (~2.5 weeks full-time)

---

## 5. API Integration Details

### Gemini Vision API Configuration

**Model:** `gemini-3-flash` (fast, cost-effective)  
**Fallback:** `gemini-3-pro` (higher accuracy if needed)

**Endpoint:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent
```

**Request Structure:**
```typescript
const requestBody = {
  contents: [{
    role: 'user',
    parts: [
      {
        text: `Analyze this architectural blueprint and extract room measurements.
        
Blueprint scale: ${scale}

Identify each room and provide:
1. Room name (e.g., "Kitchen", "Master Bedroom")
2. Dimensions in feet (width x length)
3. Square footage
4. Position on the drawing (bounding box)

Return ONLY valid JSON in this format:
{
  "rooms": [
    {
      "name": "string",
      "dimensions": { "width": number, "length": number },
      "squareFootage": number,
      "boundingBox": { "x": number, "y": number, "width": number, "height": number }
    }
  ],
  "totalSquareFootage": number
}`
      },
      {
        fileData: {
          mimeType: 'application/pdf',
          fileUri: storageUrl
        }
      }
    ]
  }],
  generationConfig: {
    temperature: 0.1,  // Low for consistent output
    responseMimeType: 'application/json'
  }
};
```

**Pricing Estimate:**
- Input: ~$0.075 per 1K tokens (includes PDF)
- Output: ~$0.30 per 1K tokens
- Typical blueprint: ~10K-20K input tokens + 2K output tokens
- **Cost per analysis: ~$1.50-2.00**

**Rate Limits:**
- 1,000 RPM (requests per minute) on free tier
- 2,000 RPM on paid tier

### Cloud Functions

#### analyzeBlueprint (Callable)
```typescript
// Triggered from frontend after upload
exports.analyzeBlueprint = onCall(async (request) => {
  const { blueprintId, scale } = request.data;
  
  // 1. Get blueprint from Firestore
  // 2. Download from Storage
  // 3. Call Gemini Vision API
  // 4. Parse and validate results
  // 5. Save rooms to Firestore
  // 6. Return results to client
});
```

#### exportMeasurements (Callable)
```typescript
// Generate CSV/Excel export
exports.exportMeasurements = onCall(async (request) => {
  const { blueprintId, format } = request.data;
  
  // 1. Get measurements from Firestore
  // 2. Generate file
  // 3. Upload to temporary Storage location
  // 4. Return signed URL
});
```

---

## 6. Cost Estimates

### Development Costs

| Item | Cost | Notes |
|------|------|-------|
| Developer time | $0* | Internal development |
| Firebase Blaze plan | ~$20-50/mo | Pay-as-you-go |
| Gemini Vision API | ~$50-100/mo | Based on 50-100 analyses/day |
| Domain name | $12/year | Namecheap/Google Domains |
| **Monthly operational** | **~$80-160** | At launch scale |

### Revenue Projections (Month 6)

| Tier | Price | Subscribers | Monthly Revenue |
|------|-------|-------------|-----------------|
| Free | $0 | 200 | $0 |
| Pro | $29 | 30 | $870 |
| Team | $79 | 5 | $395 |
| **Total** | | **35 paid** | **$1,265/mo** |

### Break-Even Analysis
- Monthly costs: ~$150
- Break-even: ~6 paid subscribers
- Target: 35 paid by month 6

---

## 7. Success Metrics

### Technical Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Analysis accuracy | >85% | Manual review of 50 blueprints |
| Analysis speed | <30s | Average processing time |
| Uptime | >99% | Firebase monitoring |
| Error rate | <2% | Failed analyses / total |

### Business Metrics
| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Signups | 20 | 100 | 300 |
| Active users | 10 | 50 | 150 |
| Paying customers | 2 | 15 | 35 |
| Churn rate | — | <10% | <8% |
| NPS score | — | >30 | >40 |

### Product Metrics
| Metric | Target | Notes |
|--------|--------|-------|
| Blueprints analyzed | >500 | Total by month 6 |
| Avg projects per user | >3 | Engagement indicator |
| Export rate | >60% | Users who export data |
| Manual correction rate | <20% | AI accuracy indicator |

---

## 8. Future Roadmap (Post-MVP)

### Phase 2 Features (Months 3-6)
- [ ] Material takeoff calculations (drywall, flooring, paint)
- [ ] Integration with QuickBooks / Xero
- [ ] Multi-user collaboration (real-time cursors)
- [ ] Mobile app (React Native)
- [ ] 3D visualization from 2D plans

### Phase 3 Features (Months 6-12)
- [ ] Electrical/plumbing symbol recognition
- [ ] Code compliance checking
- [ ] Cost estimating database integration
- [ ] White-label option for large contractors
- [ ] API access for third-party integrations

---

**Next Step:** Phase 4 — Build Checklist (Implementation Commands)
