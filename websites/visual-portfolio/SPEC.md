# Phase 3: Technical Specification (SPEC.md)

## Project: Visual Portfolio - Real Estate Virtual Tour Platform
**Version:** 1.0  
**Date:** February 2026  
**Status:** MVP Specification

---

## 1. Executive Summary

Visual Portfolio is a web-based platform enabling real estate professionals in Ashtabula County to create, manage, and share professional property showcases including photo galleries, 360° virtual tours, and floor plans. The platform bridges the gap between expensive enterprise solutions (Matterport) and free but limited alternatives (Zillow 3D).

### Core Value Proposition
- **Affordable:** Starting at $29/month vs $69-309 for competitors
- **Local:** Built for and supported in Ashtabula County
- **Branded:** Agent/brokerage branding, not third-party
- **Simple:** No proprietary hardware required

---

## 2. User Stories & Acceptance Criteria

### US-001: Agent Registration
**As a** real estate agent, **I want to** create an account, **so that** I can start creating property listings.

**Acceptance Criteria:**
- [ ] Agent can register with email, password, name, brokerage, and license number
- [ ] Email verification required before account activation
- [ ] Password must meet security requirements (8+ chars, mixed case, number)
- [ ] Duplicate email addresses rejected with clear error message
- [ ] Welcome email sent upon successful verification
- [ ] Account creation < 2 seconds

---

### US-002: Property Creation
**As an** agent, **I want to** add a new property, **so that** I can start building its showcase.

**Acceptance Criteria:**
- [ ] Agent can enter property address (auto-complete via Google Places API)
- [ ] Required fields: Address, City, State (default OH), ZIP, Property Type, List Price
- [ ] Optional fields: Bedrooms, Bathrooms, Square Footage, Lot Size, Description
- [ ] Property saved with unique ID and timestamp
- [ ] Property appears in agent's dashboard within 1 second
- [ ] Agent can edit property details after creation

---

### US-003: Photo Gallery Upload
**As an** agent, **I want to** upload property photos, **so that** buyers can view the property.

**Acceptance Criteria:**
- [ ] Support JPEG, PNG formats up to 10MB per image
- [ ] Bulk upload (up to 50 images at once)
- [ ] Automatic image optimization (WebP conversion, resizing)
- [ ] Drag-and-drop reordering of photos
- [ ] Set featured/cover image
- [ ] Add captions to individual photos
- [ ] Progress indicator during upload
- [ ] Images stored with CDN delivery (Cloudinary)

---

### US-004: 360° Tour Creation
**As an** agent, **I want to** create a virtual tour by linking 360° photos, **so that** buyers can virtually walk through the property.

**Acceptance Criteria:**
- [ ] Upload 360° equirectangular images (JPEG, 2:1 aspect ratio)
- [ ] Visual editor to place hotspots connecting rooms
- [ ] Click hotspots to navigate between 360° views
- [ ] Set initial view direction for each 360° image
- [ ] Add info hotspots with text descriptions
- [ ] Preview tour before publishing
- [ ] Tour works on mobile (gyroscope support) and desktop
- [ ] Tour loads in < 3 seconds on 4G connection

---

### US-005: Property Showcase Sharing
**As an** agent, **I want to** share my property showcase, **so that** potential buyers can view it.

**Acceptance Criteria:**
- [ ] Generate unique public URL for each property
- [ ] Share button with pre-filled social media posts
- [ ] Copy link to clipboard functionality
- [ ] QR code generation for print materials
- [ ] Embed code for MLS/website integration
- [ ] Email share with customizable message
- [ ] Share preview shows property image, address, price

---

### US-006: Subscription Management
**As an** agent, **I want to** manage my subscription, **so that** I can control my costs.

**Acceptance Criteria:**
- [ ] View current plan and usage (active listings count)
- [ ] Upgrade/downgrade between plans
- [ ] View billing history and download invoices
- [ ] Update payment method (credit card via Stripe)
- [ ] Cancel subscription (with confirmation modal)
- [ ] Receive email notification 3 days before billing
- [ ] Grace period of 7 days if payment fails

---

### US-007: Dashboard Analytics
**As an** agent, **I want to** see analytics for my listings, **so that** I understand buyer interest.

**Acceptance Criteria:**
- [ ] View total views per property (last 7, 30, 90 days)
- [ ] View unique visitors per property
- [ ] See tour completion rate (how many viewed full tour)
- [ ] Track clicks on "Contact Agent" button
- [ ] Export analytics to CSV
- [ ] Visual charts (line graph for views over time)
- [ ] Data updates within 5 minutes of activity

---

### US-008: Team/Brokerage Management (Team Plan)
**As a** brokerage manager, **I want to** manage multiple agents, **so that** I can control our brand and billing.

**Acceptance Criteria:**
- [ ] Invite agents via email to join team
- [ ] Set team branding (logo, colors, contact info)
- [ ] View all team listings in dashboard
- [ ] Reassign listings between agents
- [ ] Set usage limits per agent
- [ ] Centralized billing (one invoice for all agents)
- [ ] Remove agents from team

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Web App    │  │  Mobile Web  │  │   Agent Dashboard    │   │
│  │  (React)     │  │  (Responsive)│  │   (React)            │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY                               │
│              (Firebase Cloud Functions / Express)                │
│         Auth, Rate Limiting, Request Validation                  │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   PROPERTY      │  │     USER        │  │   SUBSCRIPTION  │
│   SERVICE       │  │   SERVICE       │  │    SERVICE      │
│                 │  │                 │  │                 │
│ - CRUD props    │  │ - Auth          │  │ - Stripe        │
│ - Image mgmt    │  │ - Profiles      │  │ - Plans         │
│ - Tour builder  │  │ - Teams         │  │ - Billing       │
└────────┬────────┘  └─────────────────┘  └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Firestore  │  │    Stripe    │  │    Cloudinary        │   │
│  │  (Primary DB)│  │  (Payments)  │  │  (Image CDN)         │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React 18 + TypeScript | Type safety, component ecosystem |
| **Styling** | Tailwind CSS + Headless UI | Rapid development, accessibility |
| **State Mgmt** | Zustand + React Query | Simple state, efficient data fetching |
| **Routing** | React Router v6 | Standard, well-supported |
| **Backend** | Firebase Cloud Functions | Serverless, scales to zero, integrated auth |
| **Auth** | Firebase Authentication | Built-in email/password, social auth |
| **Database** | Cloud Firestore | Real-time sync, document model fits data |
| **Storage** | Cloudinary | Image optimization, CDN, transformations |
| **Payments** | Stripe | Industry standard, excellent docs |
| **Analytics** | Google Analytics 4 + custom events | Free tier, comprehensive |
| **Hosting** | Vercel (frontend) + Firebase (backend) | Fast deploys, global CDN |
| **Monitoring** | Firebase Analytics + Sentry | Error tracking, performance |

### 3.3 API Endpoints

#### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/reset-password
POST   /api/auth/verify-email
```

#### Properties
```
GET    /api/properties              # List user's properties
POST   /api/properties              # Create property
GET    /api/properties/:id          # Get property details
PATCH  /api/properties/:id          # Update property
DELETE /api/properties/:id          # Delete property
POST   /api/properties/:id/images   # Upload images
DELETE /api/properties/:id/images/:imageId
POST   /api/properties/:id/tour     # Create/update tour
GET    /api/properties/:id/share    # Get share links
```

#### Tours (Public)
```
GET    /tour/:publicId              # View public tour (no auth)
POST   /tour/:publicId/analytics    # Track view event
```

#### User/Account
```
GET    /api/user/profile
PATCH  /api/user/profile
GET    /api/user/subscription
POST   /api/user/subscription/upgrade
POST   /api/user/subscription/cancel
GET    /api/user/analytics
```

#### Team (Team Plan)
```
GET    /api/team
POST   /api/team/invite
DELETE /api/team/members/:id
PATCH  /api/team/branding
```

---

## 4. Database Schema

### 4.1 Collections Overview

```
users/
├── {userId}/
│   ├── profile
│   ├── subscription
│   └── teamMembership

properties/
├── {propertyId}/
│   ├── details
│   ├── images (subcollection)
│   ├── tour (subcollection)
│   └── analytics (subcollection)

teams/
├── {teamId}/
│   ├── details
│   ├── members (subcollection)
│   └── branding

subscriptions/
├── {subscriptionId}/
│   ├── details
│   └── invoices (subcollection)
```

### 4.2 Detailed Schema

#### Users Collection
```typescript
interface User {
  id: string;                      // Firebase Auth UID
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  brokerage: string;
  licenseNumber: string;
  role: 'agent' | 'broker' | 'admin';
  avatarUrl?: string;
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
  
  // Subscription ref
  subscriptionId: string;
  
  // Team ref (optional)
  teamId?: string;
  teamRole?: 'owner' | 'admin' | 'member';
  
  // Settings
  preferences: {
    emailNotifications: boolean;
    weeklyReport: boolean;
    timezone: string;
  };
}
```

#### Properties Collection
```typescript
interface Property {
  id: string;
  userId: string;                  // Owner agent
  teamId?: string;                 // If team listing
  
  // Basic Info
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
    formatted: string;
  };
  
  // Property Details
  propertyType: 'single_family' | 'condo' | 'townhouse' | 'land' | 'commercial' | 'multi_family';
  listPrice: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  lotSize?: string;
  yearBuilt?: number;
  description?: string;
  
  // Status
  status: 'draft' | 'active' | 'sold' | 'off_market';
  mlsNumber?: string;
  
  // Media
  featuredImageId?: string;
  imageCount: number;
  hasTour: boolean;
  
  // Sharing
  publicId: string;                // Unique slug for public URL
  isPublic: boolean;
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  expiresAt?: Timestamp;
}

// Subcollection: properties/{id}/images
interface PropertyImage {
  id: string;
  url: string;                     // Cloudinary URL
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;                    // bytes
  caption?: string;
  order: number;                   // Display order
  isFeatured: boolean;
  uploadedAt: Timestamp;
}

// Subcollection: properties/{id}/tour
interface Tour {
  id: string;
  scenes: TourScene[];
  config: {
    autoRotate: boolean;
    autoRotateSpeed: number;
    showZoomControls: boolean;
    showFullscreen: boolean;
    showGyroscope: boolean;
    themeColor: string;
  };
  updatedAt: Timestamp;
}

interface TourScene {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  title: string;
  initialView: {
    pitch: number;                 // -90 to 90
    yaw: number;                   // 0 to 360
    hfov: number;                  // zoom level
  };
  hotspots: Hotspot[];
}

interface Hotspot {
  id: string;
  type: 'scene' | 'info';
  pitch: number;
  yaw: number;
  // For scene type
  targetSceneId?: string;
  // For info type
  text?: string;
}
```

#### Teams Collection
```typescript
interface Team {
  id: string;
  name: string;
  brokerageName: string;
  ownerId: string;                 // User ID of team owner
  
  // Branding
  branding: {
    logoUrl?: string;
    primaryColor: string;
    accentColor: string;
    customDomain?: string;
  };
  
  // Contact
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
    address?: string;
  };
  
  // Subscription
  subscriptionId: string;
  maxAgents: number;
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Subcollection: teams/{id}/members
interface TeamMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Timestamp;
  maxListings?: number;            // Optional limit
}
```

#### Subscriptions Collection
```typescript
interface Subscription {
  id: string;
  userId?: string;                 // For individual plans
  teamId?: string;                 // For team plans
  
  // Plan Details
  planId: 'starter' | 'professional' | 'team' | 'enterprise';
  planName: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  
  // Limits
  maxListings: number;
  maxTeamMembers?: number;
  features: string[];              // Feature flags
  
  // Billing
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  
  // Usage
  currentListingCount: number;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Analytics Collection
```typescript
// Subcollection: properties/{id}/analytics/events
interface AnalyticsEvent {
  id: string;
  type: 'view' | 'tour_start' | 'tour_complete' | 'image_view' | 'contact_click' | 'share';
  timestamp: Timestamp;
  sessionId: string;
  
  // Visitor info (anonymized)
  ipHash: string;                  // Hashed IP for unique counting
  userAgent: string;
  referrer?: string;
  
  // Event details
  metadata?: {
    imageId?: string;
    sceneId?: string;
    shareMethod?: string;
  };
}

// Aggregated daily stats (computed)
interface DailyStats {
  date: string;                    // YYYY-MM-DD
  propertyId: string;
  totalViews: number;
  uniqueVisitors: number;
  tourStarts: number;
  tourCompletions: number;
  contactClicks: number;
}
```

### 4.3 Firestore Indexes

```json
{
  "indexes": [
    {
      "collectionGroup": "properties",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "properties",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "teamId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "analyticsEvents",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" },
        { "fieldPath": "type", "order": "ASCENDING" }
      ]
    }
  ]
}
```

---

## 5. UI/UX Specifications

### 5.1 Design System

#### Color Palette
```css
:root {
  /* Primary */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-900: #1e3a8a;
  
  /* Neutral */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-500: #6b7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;
  
  /* Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

#### Typography
- **Headings:** Inter (sans-serif)
- **Body:** Inter (sans-serif)
- **Scale:**
  - H1: 2rem (32px) / font-weight: 700
  - H2: 1.5rem (24px) / font-weight: 600
  - H3: 1.25rem (20px) / font-weight: 600
  - Body: 1rem (16px) / font-weight: 400
  - Small: 0.875rem (14px)

#### Spacing Scale
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

---

### 5.2 Page Specifications

#### Dashboard (/dashboard)
**Layout:** Sidebar navigation + main content area

**Components:**
- **Stat Cards (4-up):** Active Listings, Total Views (30d), Tour Completions, New Leads
- **Recent Listings Table:** Thumbnail, address, status, views, actions
- **Quick Actions:** "Add Property" CTA, "Upload Photos", "View Analytics"
- **Usage Bar:** Current plan usage (X of Y listings)

**Empty State:**
- Illustration of house with camera
- Headline: "Ready to showcase your first property?"
- CTA: "Create Your First Listing"

---

#### Property Detail (/properties/:id)
**Layout:** Two-column (info left, media right on desktop)

**Sections:**
1. **Header:** Address, price, status badge, action menu
2. **Photo Gallery:**
   - Main image display (click to lightbox)
   - Thumbnail strip below
   - Drag-to-reorder in edit mode
   - Upload zone for new images
3. **Tour Section:**
   - Tour preview/embed
   - "Edit Tour" button
   - Tour analytics (views, completion rate)
4. **Property Info:**
   - Editable form fields
   - Auto-save indicator
5. **Sharing:**
   - Public link with copy button
   - QR code display
   - Social share buttons

---

#### Tour Editor (/properties/:id/tour/edit)
**Layout:** Full-width, split view

**Left Panel - Scene List:**
- Vertical list of uploaded 360° images
- Thumbnail + scene name
- Add scene button
- Delete scene button

**Right Panel - Editor:**
- 360° viewer (Pannellum/Three.js)
- Toolbar: Add hotspot, Set initial view, Preview
- Hotspot placement mode (click on 360° to place)
- Properties panel for selected hotspot

**Workflow:**
1. Upload 360° images
2. Arrange scenes in order
3. Click "Add Hotspot" → click on image → select target scene
4. Set initial view for each scene
5. Save and preview

---

#### Public Property Page (/tour/:publicId)
**Layout:** Full-screen immersive

**Components:**
- **Header (overlay):** Address, price, agent info (collapsed on scroll)
- **Gallery View (default):**
  - Featured image hero
  - Thumbnail grid
  - Property details panel
- **Tour View:**
  - Full-screen 360° viewer
  - Scene navigation sidebar (collapsible)
  - Info hotspots display
- **Contact CTA:** Floating button, opens contact modal
- **Share Button:** Dropdown with share options

**Responsive:**
- Mobile: Stacked layout, touch-optimized gallery
- Tablet: Side-by-side where appropriate
- Desktop: Full immersive experience

---

#### Subscription Settings (/settings/billing)
**Components:**
- Current Plan card (plan name, price, next billing date)
- Usage meter (listings used / listings allowed)
- Plan comparison table
- Payment method (Stripe Elements)
- Billing history table (downloadable invoices)
- Cancel subscription (with retention modal)

---

### 5.3 Component Library

#### Core Components
| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | variant, size, loading, disabled | Primary, secondary, ghost styles |
| `Card` | children, className | Elevated container |
| `Input` | label, error, helperText, ... | Form input with label |
| `Select` | options, value, onChange | Dropdown select |
| `Modal` | isOpen, onClose, title, children | Overlay dialog |
| `Toast` | type, message, duration | Notification |
| `LoadingSpinner` | size | Animated loader |
| `ImageUpload` | onUpload, maxFiles, accept | Drag-drop upload zone |

#### Domain Components
| Component | Props | Description |
|-----------|-------|-------------|
| `PropertyCard` | property, onClick, actions | Listing preview card |
| `PhotoGallery` | images, onReorder, onDelete | Sortable image grid |
| `TourViewer` | tour, onSceneChange, ... | 360° tour display |
| `TourEditor` | tour, onSave | Tour creation interface |
| `StatsCard` | title, value, change, icon | Analytics display |
| `ShareMenu` | property, onShare | Share options dropdown |
| `PricingTable` | plans, currentPlan | Plan comparison |

---

## 6. Implementation Phases

### Phase 1: Core MVP (Weeks 1-4)
**Goal:** Usable property showcase with photos

**Features:**
- User registration/login
- Property CRUD
- Photo upload and gallery
- Public property pages
- Basic sharing

**Hours Estimate:**
- Setup & architecture: 8h
- Auth system: 12h
- Property management: 16h
- Photo upload/gallery: 16h
- Public pages: 12h
- UI polish: 12h
- **Total: 76 hours**

---

### Phase 2: Virtual Tours (Weeks 5-7)
**Goal:** 360° tour creation and viewing

**Features:**
- 360° image upload
- Tour editor (hotspot linking)
- Tour viewer with navigation
- Mobile gyroscope support
- Tour analytics

**Hours Estimate:**
- 360° upload: 8h
- Tour editor UI: 20h
- Tour viewer integration: 16h
- Analytics: 8h
- Mobile optimization: 8h
- **Total: 60 hours**

---

### Phase 3: Business Features (Weeks 8-10)
**Goal:** Monetization and team features

**Features:**
- Stripe subscription integration
- Plan management and limits
- Team/brokerage accounts
- Usage analytics dashboard
- Billing and invoicing

**Hours Estimate:**
- Stripe integration: 16h
- Subscription management: 12h
- Team features: 20h
- Analytics dashboard: 16h
- Billing UI: 8h
- **Total: 72 hours**

---

### Phase 4: Polish & Launch (Weeks 11-12)
**Goal:** Production-ready platform

**Features:**
- Performance optimization
- SEO improvements
- Email notifications
- Help documentation
- Onboarding flow

**Hours Estimate:**
- Performance: 12h
- SEO: 8h
- Email system: 12h
- Documentation: 16h
- Onboarding: 12h
- Testing & bug fixes: 20h
- **Total: 80 hours**

---

### Summary Timeline

| Phase | Duration | Hours | Cumulative |
|-------|----------|-------|------------|
| Phase 1: Core MVP | 4 weeks | 76h | 76h |
| Phase 2: Virtual Tours | 3 weeks | 60h | 136h |
| Phase 3: Business | 3 weeks | 72h | 208h |
| Phase 4: Launch | 2 weeks | 80h | 288h |
| **TOTAL** | **12 weeks** | **288h** | - |

**At 20 hours/week:** ~14 weeks (3.5 months)  
**At 40 hours/week:** ~7 weeks (1.75 months)

---

## 7. Cost Estimates

### 7.1 Infrastructure Costs (Monthly)

| Service | Tier | Monthly Cost | Notes |
|---------|------|--------------|-------|
| **Vercel** | Pro | $20 | Frontend hosting, analytics |
| **Firebase** | Blaze (pay-as-you-go) | $25-50 | Auth, Firestore, Functions |
| **Cloudinary** | Plus | $25 | 25GB storage, 100GB bandwidth |
| **Stripe** | Standard | $0 | 2.9% + 30¢ per transaction |
| **Google Maps API** | Pay-as-you-go | $5-20 | Address autocomplete |
| **Sentry** | Developer | $0 | Error tracking (free tier) |
| **Domain** | - | $1 | $12/year |
| **Email (SendGrid)** | Free | $0 | 100 emails/day free |
| **TOTAL** | | **$76-116/month** | |

### 7.2 Scaling Projections

| Metric | MVP | 100 Users | 500 Users | 1000 Users |
|--------|-----|-----------|-----------|------------|
| Active Listings | 50 | 500 | 2,500 | 5,000 |
| Monthly Images | 500 | 5,000 | 25,000 | 50,000 |
| Storage (GB) | 5 | 50 | 250 | 500 |
| Bandwidth (GB) | 20 | 200 | 1,000 | 2,000 |
| **Est. Monthly Cost** | **$100** | **$200** | **$500** | **$800** |

### 7.3 Revenue Projections

| Plan | Price | 100 Users | 500 Users | 1000 Users |
|------|-------|-----------|-----------|------------|
| Starter ($29) | 40% | $1,160 | $5,800 | $11,600 |
| Professional ($79) | 50% | $3,950 | $19,750 | $39,500 |
| Team ($199) | 10% | $1,990 | $9,950 | $19,900 |
| **MRR** | | **$7,100** | **$35,500** | **$71,000** |
| **Costs** | | $200 | $500 | $800 |
| **Gross Margin** | | 97% | 99% | 99% |

---

## 8. Security Considerations

### 8.1 Authentication & Authorization
- Firebase Auth with email verification
- JWT tokens with 1-hour expiration
- Refresh token rotation
- Role-based access control (RBAC)

### 8.2 Data Protection
- Firestore security rules for all collections
- Input validation on all API endpoints
- Rate limiting (100 req/min per user)
- Image upload restrictions (type, size)

### 8.3 Payment Security
- Stripe Elements for PCI compliance
- No credit card data stored locally
- Webhook signature verification

### 8.4 Privacy
- GDPR-compliant data export/deletion
- Analytics data anonymized
- Clear privacy policy and ToS

---

## 9. Testing Strategy

### 9.1 Unit Tests
- Jest + React Testing Library
- Target: 70% code coverage
- Focus on utilities, hooks, business logic

### 9.2 Integration Tests
- Firebase emulator suite
- API endpoint testing
- Stripe webhook testing

### 9.3 E2E Tests
- Playwright for critical paths:
  - Registration → Create property → Upload → Share
  - Subscription upgrade flow
  - Tour creation workflow

### 9.4 Manual QA Checklist
- [ ] Cross-browser (Chrome, Safari, Firefox, Edge)
- [ ] Mobile responsive (iOS Safari, Android Chrome)
- [ ] Accessibility (keyboard nav, screen reader)
- [ ] Performance (Lighthouse score > 90)

---

**Next Step:** Phase 4 - BUILD_CHECKLIST.md (implementation commands and code structure)
