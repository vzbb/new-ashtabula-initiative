# SPEC — Marina Slip Waitlist v1.0

## Overview
A two-sided digital waitlist platform connecting boaters seeking seasonal slips with Ashtabula County marinas. Boaters see real-time position and estimated wait times; marinas manage waitlists digitally and fill slips faster with automatic notifications.

**Status:** Draft  
**Version:** 1.0  
**Last Updated:** 2026-02-20  
**Owner:** New Ashtabula Initiative  

---

## Goals

### Primary
1. Replace paper/spreadsheet waitlists with a simple digital system
2. Give boaters transparency into waitlist position and estimated wait time
3. Reduce time-to-fill when slips open from days/hours to minutes
4. Launch pilot with 2-3 Ashtabula marinas for 2025 season

### Secondary
1. Create regional network effect — boaters check multiple marinas in one place
2. Generate data on demand patterns to help marinas optimize pricing
3. Build foundation for payment processing (waitlist deposits)
4. Position for expansion to other Lake Erie ports

### Non-Goals (v1)
1. Transient/nightly slip bookings (Dockwa already serves this)
2. Marina management features (invoicing, fuel tracking, etc.)
3. Mobile native apps (web-first)
4. Advanced analytics/reports for marinas
5. Multi-language support

---

## Target Market

### Primary: Marina Managers
- **Profile:** Manage 50-250 slips, 1-3 office staff, limited technical resources
- **Pain:** Paper waitlists, missed calls, slips sit empty, repetitive "where am I?" calls
- **Motivation:** Fill slips faster, reduce admin time, improve customer service
- **Tech Comfort:** Low-moderate; needs simple, intuitive interface

### Secondary: Seasonal Slip Seekers
- **Profile:** Boat owners (25-40ft), 45-65 years old, live within 2 hours of Lake Erie
- **Pain:** No visibility into waitlists, call 5+ marinas every spring, miss opportunities
- **Motivation:** Secure reliable slip, plan season confidently, avoid repeated calling
- **Tech Comfort:** Moderate; comfortable with web/apps, email, SMS

---

## Architecture

### Stack
- **Frontend:** React 18 + Vite
- **Hosting:** Firebase Hosting
- **Backend:** Firebase Cloud Functions (Node.js)
- **Database:** Firestore (real-time updates)
- **Authentication:** Firebase Auth (anonymous for boaters, email/password for marinas)
- **Notifications:** Firebase Cloud Messaging + Twilio SMS (fallback)
- **Payments:** Stripe Connect (v2 — for waitlist deposits)

### System Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                        BOATER SIDE                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Join        │───▶│  View        │───▶│  Receive     │      │
│  │  Waitlist    │    │  Position    │    │  Alerts      │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FIREBASE PLATFORM                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Firestore   │◄──▶│  Cloud       │◄──▶│  Cloud       │      │
│  │  (Database)  │    │  Functions   │    │  Messaging   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MARINA SIDE                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Dashboard   │───▶│  Manage      │───▶│  Notify      │      │
│  │  (Auth)      │    │  Waitlists   │    │  Waitlist    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Model

### Marina (Collection: `marinas`)
```typescript
interface Marina {
  id: string;
  name: string;                    // "Brockway North Coast Marina"
  slug: string;                    // "brockway-north-coast"
  location: {
    address: string;
    city: string;                  // "Ashtabula"
    state: string;                 // "OH"
    zip: string;
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  amenities: string[];             // ["fuel", "pumpout", "restrooms", "launch"]
  
  // Managed by marina admin
  slipTypes: SlipType[];
  isActive: boolean;               // Accepting new waitlist entries
  settings: {
    autoNotify: boolean;           // Auto-notify next on list
    notifyMethods: ('email' | 'sms')[];
    customMessage?: string;        // Message template for notifications
  };
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  adminUserIds: string[];          // Firebase UIDs with admin access
}

interface SlipType {
  id: string;
  name: string;                    // "Standard Slip 20-24ft"
  minLength: number;               // 20 (feet)
  maxLength: number;               // 24 (feet)
  maxBeam?: number;                // 8 (feet)
  seasonalPrice?: number;          // Optional: displayed to boaters
  description?: string;
  isActive: boolean;
}
```

### Waitlist Entry (Collection: `waitlistEntries`)
```typescript
interface WaitlistEntry {
  id: string;
  marinaId: string;
  slipTypeId: string;
  
  // Boater info (can be anonymous or authenticated)
  boaterId?: string;               // Firebase UID (if authenticated)
  boaterInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredContact: 'email' | 'sms' | 'both';
  };
  
  // Boat info
  boatInfo: {
    name?: string;
    length: number;                // Feet
    beam?: number;                 // Feet
    type?: 'sail' | 'power' | 'other';
    year?: number;
  };
  
  // Waitlist status
  status: 'active' | 'notified' | 'offered' | 'accepted' | 'declined' | 'expired' | 'cancelled';
  position: number;                // Current position in queue
  joinedAt: Timestamp;
  
  // Offer tracking
  offerExpiresAt?: Timestamp;      // 48-72 hour offer window
  offeredAt?: Timestamp;
  respondedAt?: Timestamp;
  
  // Metadata
  notes?: string;                  // Marina admin notes
  source: 'web' | 'referral' | 'walkin';
  utmCampaign?: string;
}
```

### Notification Log (Collection: `notifications`)
```typescript
interface Notification {
  id: string;
  entryId: string;
  marinaId: string;
  type: 'position_update' | 'slip_available' | 'offer' | 'reminder' | 'system';
  channel: 'email' | 'sms' | 'push';
  
  recipient: {
    email?: string;
    phone?: string;
  };
  
  content: {
    subject?: string;              // For email
    body: string;
    actionUrl?: string;            // Link to respond
  };
  
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  sentAt?: Timestamp;
  deliveredAt?: Timestamp;
  errorMessage?: string;
  
  // Analytics
  openedAt?: Timestamp;
  clickedAt?: Timestamp;
}
```

---

## Features

### Feature 1: Boater Waitlist Signup
**Priority:** P0  
**Description:** Public form for boaters to join a marina's waitlist

**Requirements:**
- Marina selection (dropdown or search)
- Slip size selection (based on boat length)
- Boater contact info (name, email, phone, preferred contact method)
- Boat details (name, length, beam, type)
- Optional: create account for status tracking
- Confirmation screen with position estimate

**Validation:**
- Email format validation
- Phone format validation (E.164)
- Boat length must be > 0 and < 200
- Required fields: name, email OR phone, boat length, slip type

**Post-Submission:**
- Create Firestore document with status: 'active'
- Calculate and store initial position
- Send confirmation email/SMS
- Show boater their position and estimated wait

---

### Feature 2: Boater Status Portal
**Priority:** P0  
**Description:** Page for boaters to check their waitlist position

**Access Methods:**
- Magic link sent via email/SMS (no password required)
- Account login (if they created one)

**Display:**
- Current position ("You are #3 in line")
- Estimated wait time (based on historical data)
- Marina contact info
- Option to update contact preferences
- Option to cancel waitlist entry

**Real-Time:**
- Position updates via Firestore onSnapshot
- Push notification permission request (optional)

---

### Feature 3: Marina Admin Dashboard
**Priority:** P0  
**Description:** Secure dashboard for marina managers to manage waitlists

**Authentication:**
- Email/password login
- Password reset flow
- Role-based access (admin vs. staff)

**Dashboard Views:**

#### 3.1 Waitlist Overview
- Total active entries per slip type
- Entries by status (active, notified, offered)
- Average wait time per slip type
- Recent activity feed

#### 3.2 Manage Waitlist
- Sortable/filterable table of all entries
- Columns: Position, Name, Boat, Length, Joined Date, Status
- Actions per row:
  - View details
  - Send notification
  - Make offer (opens 48-hour window)
  - Move position (drag/drop or manual entry)
  - Add notes
  - Cancel entry

#### 3.3 Slip Available Workflow
- Button: "Slip Now Available"
- Select slip type
- Auto-select next boater in queue
- Preview notification
- Send offer (email + SMS)
- Track response status

#### 3.4 Settings
- Marina profile editing
- Slip type management (add/edit/activate)
- Notification templates
- Auto-notify preferences
- Staff member management

---

### Feature 4: Automatic Notifications
**Priority:** P1  
**Description:** Multi-channel notifications to keep boaters informed

**Notification Types:**

| Trigger | Channels | Content |
|---------|----------|---------|
| Join confirmation | Email + SMS | Welcome, position#, estimated wait, magic link |
| Position update | Email or SMS | "You moved from #5 to #4" |
| Slip available | Email + SMS | Offer with 48-72hr expiration, response link |
| Offer reminder | SMS | 24hr before expiration |
| Offer expired | Email | Entry moved to bottom or cancelled |
| Marina message | Email | Custom broadcast from marina |

**Delivery Logic:**
- Respect boater's preferred contact method
- Fallback: if primary fails, try secondary
- Rate limiting: max 1 position update per day
- Quiet hours: no SMS 9pm-8am

---

### Feature 5: Public Marina Directory
**Priority:** P1  
**Description:** Browseable list of participating marinas

**Features:**
- Map view with marina locations
- Filter by amenities
- Filter by slip availability
- Marina detail page with:
  - Contact info
  - Amenities list
  - Photos (if provided)
  - Waitlist signup CTA
  - Estimated wait times (if shared by marina)

---

## API Endpoints (Cloud Functions)

### Public Endpoints

#### POST /api/waitlist/join
Create new waitlist entry
```json
// Request
{
  "marinaId": "marina_abc123",
  "slipTypeId": "slip_20ft",
  "boaterInfo": {
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "phone": "+14405551234",
    "preferredContact": "email"
  },
  "boatInfo": {
    "name": "Sea Breeze",
    "length": 22,
    "beam": 8,
    "type": "power"
  }
}

// Response
{
  "success": true,
  "entryId": "entry_xyz789",
  "position": 5,
  "estimatedWaitWeeks": 8,
  "magicLink": "https://.../status?token=..."
}
```

#### GET /api/waitlist/status/:token
Get entry status by magic link token
```json
{
  "entryId": "entry_xyz789",
  "position": 5,
  "status": "active",
  "marina": {
    "name": "Brockway North Coast Marina",
    "phone": "440-998-6272"
  },
  "joinedAt": "2025-02-20T10:00:00Z",
  "estimatedAvailability": "2025-04-15"
}
```

#### POST /api/waitlist/cancel
Cancel waitlist entry
```json
// Request
{
  "token": "...",
  "reason": "optional"
}
```

#### GET /api/marinas
List all active marinas
```json
{
  "marinas": [
    {
      "id": "marina_abc123",
      "name": "Brockway North Coast Marina",
      "slug": "brockway-north-coast",
      "location": { "city": "Ashtabula", "state": "OH" },
      "amenities": ["fuel", "pumpout"],
      "hasWaitlist": true,
      "estimatedWaitWeeks": 8
    }
  ]
}
```

### Authenticated Endpoints (Marina Admin)

#### GET /api/admin/marina/:id/waitlist
Get full waitlist for marina
```json
{
  "entries": [...],
  "stats": {
    "totalActive": 45,
    "bySlipType": { "slip_20ft": 20, "slip_30ft": 15 },
    "avgWaitWeeks": 6.5
  }
}
```

#### POST /api/admin/entries/:id/offer
Send slip offer to boater
```json
// Request
{
  "expiresInHours": 72,
  "message": "A 24ft slip is now available!"
}

// Response
{
  "offerId": "offer_123",
  "sentAt": "2025-02-20T10:00:00Z",
  "expiresAt": "2025-02-23T10:00:00Z"
}
```

#### POST /api/admin/entries/:id/notify
Send custom notification
```json
{
  "message": "Update: We expect openings in 2 weeks",
  "channels": ["email", "sms"]
}
```

#### PATCH /api/admin/entries/:id/position
Update entry position
```json
{
  "newPosition": 3,
  "reason": "Manual adjustment"
}
```

---

## UI/UX Design

### Color Palette
```css
:root {
  /* Primary - Lake Blue */
  --color-primary: #0066CC;
  --color-primary-dark: #004C99;
  --color-primary-light: #4A90E2;
  
  /* Secondary - Sand/Beige */
  --color-secondary: #C4A77D;
  --color-secondary-dark: #9A835F;
  
  /* Semantic Colors */
  --color-success: #22C55E;
  --color-warning: #EAB308;
  --color-danger: #EF4444;
  --color-info: #3B82F6;
  
  /* Neutrals */
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-border: #E2E8F0;
  --color-text: #1E293B;
  --color-text-muted: #64748B;
}
```

### Typography
- **Headings:** Inter, 600-700 weight
- **Body:** Inter, 400 weight
- **Data/Numbers:** Inter, tabular nums

### Key Screens

#### 1. Public Landing Page
```
┌─────────────────────────────────────────────┐
│  🌊 Ashtabula Marina Waitlist              │
│                                             │
│  Find and join waitlists for seasonal      │
│  boat slips at Lake Erie marinas.          │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  [Select a Marina ▼]                │   │
│  │                                     │   │
│  │  Or browse all 11 Ashtabula marinas │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Join Waitlist]  [Check My Status]        │
│                                             │
│  ──── Popular Marinas ────                 │
│  [Brockway North Coast] [Harbor YC] [...]  │
└─────────────────────────────────────────────┘
```

#### 2. Waitlist Signup Form
```
┌─────────────────────────────────────────────┐
│  Join Waitlist — Brockway North Coast      │
│                                             │
│  Step 1: Select Slip Size                  │
│  ○ 20-24 ft ($1,800/season)                │
│  ● 25-30 ft ($2,200/season)                │
│  ○ 31-35 ft ($2,800/season)                │
│                                             │
│  Step 2: Your Information                  │
│  Name: [First] [Last]                      │
│  Email: [________________]                 │
│  Phone: [________________]                 │
│  Preferred contact: (• Email  ○ Text)      │
│                                             │
│  Step 3: Boat Information                  │
│  Boat Name: [________________]             │
│  Length: [22] ft                           │
│  Type: (• Power  ○ Sail)                   │
│                                             │
│  [Review & Submit]                         │
└─────────────────────────────────────────────┘
```

#### 3. Status Portal
```
┌─────────────────────────────────────────────┐
│  Your Waitlist Status                      │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │           #3                        │   │
│  │      in line                        │   │
│  │                                     │   │
│  │   Estimated: 4-6 weeks              │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  📍 Brockway North Coast Marina             │
│  🚤 Sea Breeze (22 ft Power)               │
│  📅 Joined February 15, 2025               │
│                                             │
│  [Update Contact Info]  [Cancel]           │
│                                             │
│  Notifications: [• Email  • Text]          │
└─────────────────────────────────────────────┘
```

#### 4. Marina Admin Dashboard
```
┌─────────────────────────────────────────────┐
│  🏖️ Brockway North Coast — Dashboard       │
│  [Waitlists] [Activity] [Settings] [Help]  │
│  ─────────────────────────────────────────  │
│                                             │
│  Quick Stats                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │  Active │ │  Offered│ │ Avg Wait│      │
│  │   47    │ │    2    │ │ 6 weeks │      │
│  └─────────┘ └─────────┘ └─────────┘      │
│                                             │
│  [+ Slip Available] [Export] [Message All] │
│  ─────────────────────────────────────────  │
│                                             │
│  Waitlist — 20-24 ft Slips                 │
│  #  Name           Boat     Joined   Status│
│  ─────────────────────────────────────────  │
│  1  John Smith     Sea Brz  2/15    Active │
│  2  Mary Johnson   Lazy Daze 2/10   Active │
│  3  Bob Wilson     Windward 2/08    Notified│
│  ...                                       │
└─────────────────────────────────────────────┘
```

---

## Security & Privacy

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Marinas - public read, admin write
    match /marinas/{marinaId} {
      allow read: if true;
      allow write: if request.auth != null && 
        resource.data.adminUserIds.hasAny([request.auth.uid]);
    }
    
    // Waitlist entries - boater can read own, admin can read marina's
    match /waitlistEntries/{entryId} {
      allow read: if request.auth != null && (
        resource.data.boaterId == request.auth.uid ||
        exists(/databases/$(database)/documents/marinas/$(resource.data.marinaId)/adminUserIds/$(request.auth.uid))
      );
      allow create: if true; // Public signup
      allow update: if request.auth != null && (
        resource.data.boaterId == request.auth.uid ||
        exists(/databases/$(database)/documents/marinas/$(resource.data.marinaId)/adminUserIds/$(request.auth.uid))
      );
    }
    
    // Notifications - system only
    match /notifications/{notificationId} {
      allow read: if request.auth != null && (
        resource.data.recipientEmail == request.auth.token.email
      );
      allow write: if false; // Cloud Functions only
    }
  }
}
```

### Data Retention
- Active entries: Retained indefinitely
- Cancelled/declined entries: Anonymize after 2 years
- Notification logs: Purge after 1 year
- Export capability for marina data ownership

---

## Implementation Phases

### Phase 1: MVP (Weeks 1-2)
**Goal:** Working demo for pilot marina

- [ ] Firebase project setup + hosting
- [ ] Firestore schema + security rules
- [ ] Public waitlist signup form
- [ ] Simple status check page (magic link)
- [ ] Basic marina admin dashboard
- [ ] Email notifications via SendGrid
- [ ] One pilot marina onboarding

### Phase 2: Pilot Launch (Weeks 3-4)
**Goal:** 2-3 marinas live, real boaters using it

- [ ] SMS notifications via Twilio
- [ ] Position management UI (drag/drop)
- [ ] Slip offer workflow with expiration
- [ ] Marina directory page
- [ ] Real-time position updates
- [ ] Analytics dashboard
- [ ] Feedback collection

### Phase 3: Polish & Scale (Weeks 5-6)
**Goal:** Production-ready, onboarding more marinas

- [ ] Mobile app optimization
- [ ] Push notifications
- [ ] Advanced filtering/search
- [ ] Multi-marina boater accounts
- [ ] Automated testing
- [ ] Documentation + training materials
- [ ] Pricing implementation

---

## Pricing Model

### Marina Pricing (B2B)
| Slip Count | Monthly Price | Annual Price (2 months free) |
|------------|---------------|------------------------------|
| 0-50       | $49/mo        | $490/yr                      |
| 51-150     | $79/mo        | $790/yr                      |
| 151-300    | $99/mo        | $990/yr                      |
| 300+       | Custom        | Custom                       |

**Pilot Program:** Free for 2025 season (first 3 marinas)

### Boater Pricing (B2C)
- **Free:** Join unlimited waitlists, receive notifications
- **Premium ($9.99/yr):** Priority notifications, advanced filtering, historical data (v2)

---

## Success Metrics

### Marina Adoption
- Target: 5 marinas by end of 2025 season
- Target: 10 marinas by end of 2026

### Boater Usage
- Waitlist signups: 200+ by end of 2025
- Active entries (not cancelled): 150+
- Status page views: 500+/month

### Operational Efficiency
- Average time-to-fill slips: < 24 hours (vs. current 3-7 days)
- Marina admin time saved: 5+ hours/week
- "Where am I?" call reduction: 80%

### Business Metrics
- Pilot → paid conversion: 75%+
- Monthly recurring revenue: $500+ by end of 2025
- Customer satisfaction (marinas): 8+/10

---

## Open Questions

1. **Data sharing:** Will marinas share estimated wait times publicly?
2. **Deposit handling:** Should we integrate waitlist deposits in v1 or v2?
3. **Multi-marina coordination:** Do marinas refer overflow to each other currently?
4. **ODNR integration:** Can we get official marina slip count data?
5. **Seasonality:** How do we handle winter shutdown/off-season?

---

## Appendix

### Research References
- Phase 1 Research: `PHASE1-RESEARCH.md`
- Phase 2 Outreach: `PHASE2-OUTREACH.md`

### Competitor Analysis
- Dockwa: https://dockwa.com
- Snag-A-Slip: https://snagaslip.com
- Molo: https://molo.io

### Technical References
- Firebase Documentation: https://firebase.google.com/docs
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security
- Twilio SMS API: https://www.twilio.com/docs/sms

---

*Document prepared for New Ashtabula Initiative — marina-slip-waitlist MVP v1.0*
