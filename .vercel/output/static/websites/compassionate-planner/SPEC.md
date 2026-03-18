# SPEC.md — Compassionate Planner
## Technical Specification Document
### Ashtabula End-of-Life Planning Platform

**Version:** 1.0  
**Date:** February 19, 2026  
**Status:** Draft — Ready for Review  
**Previous Phases:** [Phase 1 Research](./PHASE1-RESEARCH.md) | [Phase 2 Outreach](./PHASE2-OUTREACH.md)

---

## 1. EXECUTIVE SUMMARY

### Product Vision
Compassionate Planner is a web-based platform that helps Ashtabula County families navigate end-of-life planning with dignity, clarity, and local relevance. It bridges the gap between families, funeral homes, and hospice organizations through intuitive digital tools designed for a rural, aging demographic.

### Core Value Proposition
- **For Families:** Reduce stress during crisis by having wishes documented and accessible
- **For Funeral Directors:** Pre-qualified leads with documented preferences
- **For Hospice:** Smoother care transitions with planning resources

### Success Metrics (6-Month Targets)
| Metric | Target |
|--------|--------|
| Registered Users | 500 |
| Completed Plans | 150 |
| Funeral Home Partners | 3 |
| Hospice Partnerships | 2 |

---

## 2. SYSTEM ARCHITECTURE

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Public     │  │  Family     │  │  Funeral Home Portal    │  │
│  │  Marketing  │  │  Dashboard  │  │  (B2B Partner)          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Auth       │  │  Plans      │  │  Partner Integration    │  │
│  │  API        │  │  API        │  │  API                    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  PostgreSQL │  │  File       │  │  Redis (Sessions)       │  │
│  │  (Supabase) │  │  Storage    │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 14 (App Router) | SSR, SEO, React ecosystem |
| **Language** | TypeScript | Type safety, maintainability |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI, accessibility |
| **Backend** | Next.js API Routes | Unified codebase, serverless |
| **Database** | Supabase (PostgreSQL) | Managed, auth included, realtime |
| **Storage** | Supabase Storage | Document storage, HIPAA-ready |
| **Auth** | Supabase Auth | Magic links, social OAuth |
| **Hosting** | Vercel | Edge deployment, CI/CD |
| **Monitoring** | Vercel Analytics + Sentry | Performance, error tracking |

### 2.3 Infrastructure Diagram

```
User → Vercel Edge (CDN) → Next.js Server → Supabase (Database + Storage)
              ↓
        Cloudflare (DNS + Security)
```

---

## 3. FEATURE SPECIFICATIONS

### 3.1 Feature Matrix by Release

| Feature | MVP | v1.1 | v1.2 | Future |
|---------|-----|------|------|--------|
| User Registration/Auth | ✅ | | | |
| Planning Checklists | ✅ | | | |
| Document Storage | ✅ | | | |
| Family Sharing (up to 3) | ✅ | | | |
| Local Directory | ✅ | | | |
| Print Plan Export | ✅ | | | |
| Premium Subscriptions | | ✅ | | |
| Expanded Family Sharing | | ✅ | | |
| Funeral Home Portal | | | ✅ | |
| Hospice Integration | | | ✅ | |
| Mobile App | | | | ✅ |
| AI Planning Assistant | | | | ✅ |

### 3.2 Core Feature Definitions

#### F1: User Authentication & Profiles
**Description:** Secure account creation and management

**Requirements:**
- Email/password registration
- Magic link (passwordless) option
- Social login (Google)
- Profile management (name, contact, emergency contacts)
- Account deletion (GDPR compliance)

**Acceptance Criteria:**
- [ ] User can register with email in < 2 minutes
- [ ] Magic link arrives within 30 seconds
- [ ] Profile data encrypted at rest
- [ ] Session persists for 7 days

#### F2: Planning Checklists
**Description:** Guided step-by-step planning modules

**Modules:**
1. **Basic Information** (SSN, DOB, vital stats)
2. **Funeral Preferences** (burial vs cremation, service type)
3. **Financial Information** (insurance policies, bank accounts)
4. **Legal Documents** (will status, power of attorney)
5. **Digital Legacy** (social media, online accounts)
6. **Personal Wishes** (music, readings, obituary notes)

**Requirements:**
- Progress tracking per module
- Skip and return later functionality
- Tooltips explaining each field
- Local autosave (draft state)

**Acceptance Criteria:**
- [ ] Each module has 5-10 questions max
- [ ] Progress visible on dashboard
- [ ] Drafts saved every 30 seconds
- [ ] Can complete modules in any order

#### F3: Document Storage
**Description:** Secure upload and organization of important documents

**Document Types:**
- Will / Trust documents
- Insurance policies
- Bank account statements
- Property deeds
- Advance directives / Living will
- Power of attorney
- Military discharge (DD-214)

**Requirements:**
- PDF, JPG, PNG support (max 10MB per file)
- Folder organization
- Thumbnail preview for images
- Download and delete capabilities
- Encryption at rest (AES-256)

**Acceptance Criteria:**
- [ ] Upload completes in < 10 seconds for 5MB file
- [ ] Files encrypted before storage
- [ ] Only account owner can access
- [ ] Virus scanning on upload

#### F4: Family Sharing
**Description:** Controlled access sharing with family members

**Sharing Levels:**
- **View Only:** Can see plan but not edit
- **Contributor:** Can edit non-sensitive fields
- **Full Access:** Can edit all fields, manage documents

**Requirements:**
- Email invitation system
- Revocable access
- Activity log of changes
- Notification on updates

**Acceptance Criteria:**
- [ ] Invite sent within 30 seconds
- [ ] Shared user sees data immediately
- [ ] Revocation takes effect immediately
- [ ] Activity log shows who changed what

#### F5: Local Directory
**Description:** Curated list of Ashtabula County funeral and end-of-life services

**Categories:**
- Funeral Homes (5+ listings)
- Cremation Services
- Estate Attorneys
- Grief Counselors
- Hospice Organizations
- Monument/Marker Services

**Data Points per Listing:**
- Name, address, phone, website
- Hours of operation
- Services offered
- Price range indicators ($ - $$$$)
- Distance from user's ZIP

**Requirements:**
- Search by name or service type
- Filter by location
- Click-to-call on mobile
- Save favorites

**Acceptance Criteria:**
- [ ] Directory loads in < 2 seconds
- [ ] All Ashtabula funeral homes listed
- [ ] Mobile tap-to-call works

#### F6: Print Plan Export
**Description:** Generate a printable/savable PDF summary

**Sections in Export:**
- Cover page with emergency contact info
- Personal information summary
- Funeral preferences
- Document inventory (list, not files)
- Important contacts
- Local resource directory

**Requirements:**
- Clean, professional formatting
- Wallet card option (condensed)
- Full binder option (comprehensive)
- Watermark indicating "Copy - Verify Originals"

**Acceptance Criteria:**
- [ ] PDF generates in < 5 seconds
- [ ] Wallet card fits standard wallet
- [ ] All data current at generation time

---

## 4. DATA MODEL

### 4.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │───────│    Plan     │───────│   Module    │
│             │ 1:M   │             │ 1:M   │             │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ email       │       │ user_id (FK)│       │ plan_id (FK)│
│ full_name   │       │ status      │       │ type        │
│ phone       │       │ progress    │       │ data        │
│ created_at  │       │ created_at  │       │ progress    │
└─────────────┘       └─────────────┘       └─────────────┘
        │
        │ 1:M
        ▼
┌─────────────┐       ┌─────────────┐
│  Document   │       │    Share    │
│             │       │             │
├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │
│ user_id (FK)│       │ plan_id (FK)│
│ file_name   │       │ email       │
│ file_path   │       │ permission  │
│ doc_type    │       │ status      │
│ encrypted   │       │ created_at  │
└─────────────┘       └─────────────┘
```

### 4.2 Database Schema (PostgreSQL)

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plans table
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'complete')),
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Planning modules
CREATE TABLE plan_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    module_type VARCHAR(50) NOT NULL CHECK (module_type IN (
        'basic_info', 'funeral_preferences', 'financial', 
        'legal', 'digital_legacy', 'personal_wishes'
    )),
    data JSONB DEFAULT '{}',
    is_complete BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(plan_id, module_type)
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    file_name VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    doc_type VARCHAR(50) CHECK (doc_type IN (
        'will', 'trust', 'insurance', 'bank_statement', 
        'property_deed', 'advance_directive', 'poa', 
        'military_discharge', 'other'
    )),
    encryption_key_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shares
CREATE TABLE shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    shared_by UUID NOT NULL REFERENCES profiles(id),
    shared_with_email VARCHAR(255) NOT NULL,
    shared_with_user_id UUID REFERENCES profiles(id),
    permission VARCHAR(20) NOT NULL CHECK (permission IN ('view', 'contributor', 'full')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'revoked')),
    invite_token VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Activity log
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Local directory listings
CREATE TABLE directory_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'funeral_home', 'cremation', 'attorney', 
        'grief_counselor', 'hospice', 'monument'
    )),
    address TEXT,
    phone VARCHAR(20),
    website VARCHAR(500),
    hours TEXT,
    services TEXT[],
    price_range INTEGER CHECK (price_range BETWEEN 1 AND 4),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. USER INTERFACE SPECIFICATIONS

### 5.1 Page Structure

```
/
├── / (Landing/Marketing)
├── /auth
│   ├── /login
│   ├── /register
│   └── /magic-link
├── /dashboard (Main family dashboard)
├── /plan
│   ├── /create
│   ├── /[id]
│   │   ├── /edit (Planning wizard)
│   │   ├── /documents
│   │   ├── /share
│   │   └── /export
│   └── /[id]/view (Read-only view for shared users)
├── /directory (Local resources)
├── /account
│   ├── /profile
│   ├── /settings
│   └── /subscription
└── /help
    ├── /faq
    ├── /guides
    └── /contact
```

### 5.2 Key Screen Specifications

#### Dashboard Screen
```
┌─────────────────────────────────────────────────────────────┐
│  Compassionate Planner                    [Profile] [Menu]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Welcome back, [Name]                        [+ New Plan]   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  YOUR ACTIVE PLAN                        [Edit]     │   │
│  │                                                     │   │
│  │  ████████████░░░░░░  75% Complete                  │   │
│  │                                                     │   │
│  │  □ Basic Information          ✓ Complete          │   │
│  │  □ Funeral Preferences        ✓ Complete          │   │
│  │  □ Financial Information      ~ In Progress       │   │
│  │  □ Legal Documents            ✗ Not Started       │   │
│  │  □ Digital Legacy             ✓ Complete          │   │
│  │  □ Personal Wishes            ✓ Complete          │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  QUICK ACTIONS:                                             │
│  [📄 View Documents]  [👥 Share Plan]  [🖨️ Print Plan]     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SHARED WITH YOU                                    │   │
│  │  No plans shared with you yet.                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  LOCAL RESOURCES                                    │   │
│  │  • Guerriero Funeral Home (0.8 mi)                  │   │
│  │  • Ducro Funeral Services (1.2 mi)                  │   │
│  │  • [View All Resources]                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Planning Module Screen (Wizard)
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard        Funeral Preferences    3 of 6   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Would you prefer burial or cremation?                      │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   ⚰️        │    │   🔥        │    │   ❓        │     │
│  │   Burial    │    │  Cremation  │    │  Undecided  │     │
│  │   [Select]  │    │   [Select]  │    │   [Select]  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  If burial, do you have a cemetery preference?              │
│  [                                            ]            │
│  □ No preference / Undecided                               │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Service preferences:                                       │
│  □ Religious service                                        │
│  □ Memorial service (no body present)                       │
│  □ Celebration of life                                      │
│  □ Private family only                                      │
│  □ No service                                               │
│                                                             │
│                                    [Save & Continue →]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Design System

#### Color Palette
```css
:root {
  /* Primary - Trust, calm */
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-900: #0c4a6e;

  /* Secondary - Warmth, compassion */
  --secondary-50: #fdf4f3;
  --secondary-100: #fce8e6;
  --secondary-500: #f87171;
  --secondary-600: #dc2626;

  /* Neutral - Clean, professional */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-400: #9ca3af;
  --gray-600: #4b5563;
  --gray-900: #111827;

  /* Semantic */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

#### Typography
- **Headings:** Inter (600, 700 weight)
- **Body:** Inter (400, 500 weight)
- **Base size:** 16px
- **Scale:** 1.25 (major third)
  - H1: 48px
  - H2: 39px
  - H3: 31px
  - H4: 25px
  - Body: 16px
  - Small: 13px

#### Component Library
Based on shadcn/ui with custom overrides:
- **Buttons:** Rounded-lg, 44px min-height (touch-friendly)
- **Inputs:** Rounded-md, 48px height, clear focus states
- **Cards:** Rounded-xl, subtle shadow, hover:shadow-md
- **Progress:** Segmented bar for planning modules

---

## 6. API SPECIFICATIONS

### 6.1 RESTful Endpoints

#### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/magic-link
POST   /api/auth/verify-magic-link
POST   /api/auth/logout
GET    /api/auth/session
```

#### Plans
```
GET    /api/plans                 # List user's plans
POST   /api/plans                 # Create new plan
GET    /api/plans/:id             # Get plan details
PATCH  /api/plans/:id             # Update plan
DELETE /api/plans/:id             # Delete plan
GET    /api/plans/:id/progress    # Get completion status
```

#### Modules
```
GET    /api/plans/:id/modules              # List all modules
GET    /api/plans/:id/modules/:type        # Get specific module
PATCH  /api/plans/:id/modules/:type        # Update module data
POST   /api/plans/:id/modules/:type/complete  # Mark complete
```

#### Documents
```
GET    /api/documents             # List user's documents
POST   /api/documents             # Upload document (multipart)
GET    /api/documents/:id         # Get document metadata
GET    /api/documents/:id/download  # Download file
DELETE /api/documents/:id         # Delete document
```

#### Sharing
```
POST   /api/plans/:id/shares      # Create share invitation
GET    /api/plans/:id/shares      # List shares for plan
PATCH  /api/shares/:id            # Update share permission
DELETE /api/shares/:id            # Revoke share
POST   /api/shares/accept         # Accept invitation
```

#### Directory
```
GET    /api/directory             # List all listings
GET    /api/directory/:category   # Filter by category
GET    /api/directory/search?q=   # Search listings
GET    /api/directory/nearby      # Listings near lat/lon
```

### 6.2 API Response Format

```typescript
// Standard response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page?: number;
    perPage?: number;
    total?: number;
  };
}

// Example success response
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "Jane Smith",
    "progress": 75
  }
}

// Example error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Email is required"],
      "phone": ["Invalid phone format"]
    }
  }
}
```

---

## 7. SECURITY SPECIFICATIONS

### 7.1 Authentication & Authorization
- **Session Management:** JWT tokens, 7-day expiry
- **Password Policy:** Min 8 chars, 1 uppercase, 1 number, 1 special
- **Rate Limiting:** 5 login attempts per 5 minutes per IP
- **Magic Links:** 15-minute expiry, single use
- **2FA:** Optional TOTP (future release)

### 7.2 Data Protection
- **Encryption at Rest:** AES-256 for all documents
- **Encryption in Transit:** TLS 1.3 required
- **PII Handling:** Logged but masked, encrypted in database
- **Database:** Row-level security (RLS) policies on all tables
- **Backups:** Daily encrypted backups, 30-day retention

### 7.3 Privacy Compliance
- **GDPR:** Data export, account deletion, consent tracking
- **CCPA:** Data inventory, disclosure mechanism
- **Data Retention:** User data deleted 30 days after account deletion
- **Audit Logging:** All data access logged with user ID and timestamp

---

## 8. PERFORMANCE SPECIFICATIONS

| Metric | Target | Max Acceptable |
|--------|--------|----------------|
| Page Load (First Contentful Paint) | < 1.5s | 2.5s |
| Time to Interactive | < 3s | 5s |
| API Response (p95) | < 200ms | 500ms |
| Document Upload (5MB) | < 10s | 20s |
| PDF Generation | < 5s | 10s |
| Lighthouse Score | > 90 | 70 |

### 8.1 Performance Optimizations
- **Images:** Next.js Image component with WebP
- **Fonts:** Subset Inter, font-display: swap
- **Code:** Route-level code splitting
- **Caching:** SWR for data, 5-minute stale time
- **CDN:** Vercel Edge for static assets

---

## 9. ACCESSIBILITY SPECIFICATIONS

### 9.1 WCAG 2.1 AA Compliance
- Keyboard navigation for all interactive elements
- Focus indicators with 3:1 contrast ratio
- Alt text for all images
- ARIA labels for icon-only buttons
- Skip links for main content
- Reduced motion support

### 9.2 Screen Reader Support
- Semantic HTML (nav, main, article, etc.)
- ARIA live regions for dynamic updates
- Form labels explicitly associated
- Error announcements immediate

### 9.3 Target Audience Considerations
- **Touch targets:** Minimum 44x44px
- **Font size:** Base 16px, scalable to 200%
- **Color contrast:** 4.5:1 minimum for text
- **Reading level:** Flesch-Kincaid 8th grade max

---

## 10. IMPLEMENTATION PHASES

### Phase 1: MVP (Weeks 1-4)
**Goal:** Functional planning platform for family users

**Deliverables:**
- [ ] Project setup (Next.js + Supabase + Tailwind)
- [ ] Authentication system
- [ ] Dashboard with plan overview
- [ ] 6 planning modules (basic UI)
- [ ] Document upload/download
- [ ] Family sharing (basic)
- [ ] Local directory (static data)
- [ ] Print export (basic PDF)

**Definition of Done:**
- User can create account and complete a full plan
- All 6 modules functional with data persistence
- Documents upload and download securely
- Plan can be shared with one family member

### Phase 2: Polish & Premium (Weeks 5-8)
**Goal:** Production-ready with monetization

**Deliverables:**
- [ ] UI/UX polish based on user testing
- [ ] Premium subscription (Stripe)
- [ ] Expanded sharing (up to 5 members)
- [ ] Advanced document features (foldering)
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Help center content

**Definition of Done:**
- Lighthouse score > 90
- First paid subscriber
- 50+ registered users

### Phase 3: B2B Portal (Weeks 9-12)
**Goal:** Funeral home partner features

**Deliverables:**
- [ ] Funeral home registration/approval
- [ ] Partner dashboard
- [ ] Lead notification system
- [ ] White-label options
- [ ] Integration APIs
- [ ] Partner onboarding flow

**Definition of Done:**
- 3 funeral homes onboarded
- First lead generated for partner

### Phase 4: Scale & Integrations (Weeks 13-16)
**Goal:** Ecosystem expansion

**Deliverables:**
- [ ] Hospice partner portal
- [ ] Calendar integrations
- [ ] Mobile app (PWA)
- [ ] Advanced analytics
- [ ] Marketing automation
- [ ] Community features

**Definition of Done:**
- 500+ registered users
- 3+ funeral home partners active
- 2+ hospice partnerships

---

## 11. TESTING STRATEGY

### 11.1 Testing Pyramid
```
        /\
       /  \     E2E (Playwright) - 5%
      /    \    Critical user flows
     /______\   
    /        \  Integration (Vitest) - 20%
   /          \ API + Component tests
  /____________\
 /              \ Unit (Vitest) - 75%
/________________\ Utils, helpers, validation
```

### 11.2 Test Coverage Targets
- Unit tests: 80% coverage
- Integration: All API endpoints
- E2E: Critical paths (signup → create plan → share → export)

### 11.3 Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

---

## 12. DEPLOYMENT & DEVOPS

### 12.1 Environments
| Environment | URL | Purpose |
|-------------|-----|---------|
| Production | compassionateplanner.com | Live users |
| Staging | staging.compassionateplanner.com | Pre-release testing |
| Preview | [branch].vercel.app | PR reviews |

### 12.2 CI/CD Pipeline (GitHub Actions)
```
Push to main ──► Lint ──► Test ──► Build ──► Deploy to Production
     │
     └─ PR ──► Lint ──► Test ──► Build ──► Preview Deploy
```

### 12.3 Monitoring & Alerting
- **Error Tracking:** Sentry
- **Performance:** Vercel Analytics
- **Uptime:** UptimeRobot (1-min checks)
- **Database:** Supabase Dashboard
- **Alerts:** Email + Slack for P1 issues

---

## 13. RISK ANALYSIS

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data breach | Low | Critical | Encryption, 2FA, security audit |
| Low adoption | Medium | High | User testing early, iterate fast |
| Funeral home resistance | Medium | Medium | Position as complementary, not replacement |
| HIPAA complexity | Low | High | Clarify scope, avoid PHI |
| Technical debt | Medium | Medium | Strong types, tests, code reviews |
| Dependency failures | Low | High | Multi-region, backup vendors |

---

## 14. APPENDICES

### Appendix A: Glossary
- **EOL:** End of Life
- **PHI:** Protected Health Information
- **Pre-need:** Funeral arrangements made before death
- **Advance Directive:** Legal document outlining medical wishes

### Appendix B: References
- [Phase 1 Research](./PHASE1-RESEARCH.md)
- [Phase 2 Outreach](./PHASE2-OUTREACH.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### Appendix C: Document History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-19 | Rondell ♟️ | Initial specification |

---

**Next Phase:** [Phase 4: Implementation Checklist](./PHASE4-BUILD.md) (To be created)

**Questions or feedback?** Document in project backlog or discuss in next sync.
