# Civic Insight Engine — Technical Specification

**Version:** 1.0  
**Date:** 2025-02-17  
**Status:** Draft → Ready for Implementation  
**Project:** new-ashtabula-initiative/websites/civic-insight-engine

---

## 1. Overview

Civic Insight Engine is an AI-powered transparency dashboard for small-town governments. It transforms dense meeting minutes into readable summaries, tracks community issues, and provides budget transparency—all in a single, affordable, self-hostable platform.

**Target Users:** Townships of 5,000-50,000 population in Ashtabula County, Ohio

**Core Value Proposition:**  
*"Meeting minutes to public-ready summaries in 10 seconds—not 2 hours."*

---

## 2. Architecture

### 2.1 System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CITIZEN FACING                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Dashboard   │  │ Issue Report │  │  Budget Explorer     │  │
│  │  (React)     │  │  (PWA)       │  │  (Embedded/iframe)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼─────────────────────┼──────────────┘
          │                 │                     │
          └─────────────────┼─────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                    FIREBASE BACKEND                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Firestore DB │  │ Cloud Funcs  │  │  Authentication      │  │
│  │  (NoSQL)     │  │  (Node.js)   │  │  (Anon + Email)      │  │
│  └──────────────┘  └──────┬───────┘  └──────────────────────┘  │
└───────────────────────────┼────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
┌─────────▼────────┐ ┌──────▼──────┐ ┌───────▼───────┐
│   Gemini API     │ │  External   │ │  File Storage │
│  (Summarization) │ │   APIs      │ │   (PDFs)      │
└──────────────────┘ │- Ohio Check │ └───────────────┘
                     │- Census     │
                     └─────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React 18 + Vite | Fast dev, excellent PWA support |
| **State** | React Query + Zustand | Server state + client state separation |
| **Styling** | Tailwind CSS | Rapid UI, consistent design system |
| **Backend** | Firebase | Zero-ops, scales to 0, real-time |
| **Database** | Firestore | Real-time sync, offline persistence |
| **Auth** | Firebase Auth | Anonymous auth for low friction |
| **AI** | Gemini 1.5 Flash | Cost-effective, good summaries |
| **Storage** | Firebase Storage | Document hosting |
| **Hosting** | Firebase Hosting | Free SSL, CDN, easy deploys |

### 2.3 Data Model

```typescript
// Meeting Summary
interface MeetingSummary {
  id: string;
  townshipId: string;
  date: Timestamp;
  rawMinutesUrl: string;
  summary: {
    bullets: string[];        // 5 key points
    actionItems: string[];    // 3 action items
    fullText: string;         // Complete summary
  };
  publishedBy: string;        // Admin UID
  publishedAt: Timestamp;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
}

// Issue Report
interface IssueReport {
  id: string;
  reporterId: string;         // Anonymous or authenticated
  townshipId: string;
  category: 'roads' | 'utilities' | 'zoning' | 'safety' | 'other';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  images: string[];           // URLs to stored images
  status: 'open' | 'in_review' | 'assigned' | 'resolved' | 'closed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  comments: Comment[];
}

// Township Config
interface Township {
  id: string;
  name: string;
  slug: string;
  county: string;
  bounds: GeoPoint[];         // Boundary polygon
  ohioCheckbookUrl?: string;
  contactEmail: string;
  admins: string[];           // UID array
  settings: {
    allowAnonymousIssues: boolean;
    requireApproval: boolean;
    publicBudgetView: boolean;
  };
}

// User (Minimal)
interface User {
  uid: string;
  email?: string;
  displayName?: string;
  isAdmin: boolean;
  subscribedTownships: string[];
  notificationPrefs: {
    email: boolean;
    newMeetings: boolean;
    issueUpdates: boolean;
  };
}
```

---

## 3. Feature Specification

### 3.1 Core Features

#### F1: AI Meeting Summarizer (P0)
**Existing:** Basic Gemini integration exists

**Enhancements:**
- [ ] PDF upload (not just paste text)
- [ ] Structured output (JSON mode for reliability)
- [ ] Admin review before publish
- [ ] Version history (edit trail)
- [ ] Auto-tagging (zoning, budget, personnel)

**Prompt Template:**
```
You are a municipal clerk assistant. Summarize the following 
township meeting minutes into:
1. Five bullet points of key decisions/actions (max 20 words each)
2. Three specific action items with responsible parties (if mentioned)
3. One paragraph overview for residents who want more detail

Minutes:
{input_text}

Return valid JSON with keys: bullets (array), actionItems (array), overview (string), tags (array)
```

#### F2: Public Dashboard (P0)
**New component:** Main landing page for residents

**Features:**
- [ ] Latest meeting summaries (paginated)
- [ ] Search summaries by keyword
- [ ] Filter by date range, category
- [ ] Issue map (OpenStreetMap integration)
- [ ] Budget quick-view (Ohio Checkbook embed)
- [ ] Subscribe to updates (email capture)

#### F3: Issue Reporting System (P0)
**New component:** 311-style reporting

**Features:**
- [ ] Anonymous or authenticated submission
- [ ] Photo upload (with EXIF location extraction)
- [ ] Map-based location picker
- [ ] Category selection
- [ ] Status tracking page for submitter
- [ ] Public issue list (opt-in anonymity)

#### F4: Admin Panel (P0)
**New component:** Township clerk interface

**Features:**
- [ ] Upload minutes (PDF or text)
- [ ] Review AI summary, edit before publish
- [ ] Manage issue reports (status updates)
- [ ] Township settings
- [ ] Analytics (views, engagement)

### 3.2 Supporting Features

#### F5: Email Notifications (P1)
- New meeting published
- Issue status changed
- Weekly digest option

#### F6: PWA Capabilities (P1)
- Offline reading of cached summaries
- "Add to Home Screen"
- Background sync for issue submissions

#### F7: Multi-Township Support (P1)
- Subdomain or path-based routing (/geneva, /jefferson)
- Shared code, separate data

#### F8: Analytics Dashboard (P2)
- Page views
- Popular issues
- Engagement metrics

---

## 4. User Flows

### Flow 1: Clerk Publishes Meeting Summary

```
1. Clerk logs into Admin Panel
2. Clicks "New Summary"
3. Uploads PDF or pastes minutes
4. AI generates summary (10 sec)
5. Clerk reviews/edits summary
6. Clicks "Publish"
7. Summary appears on public dashboard
8. Email notification sent to subscribers
```

### Flow 2: Resident Reports Issue

```
1. Resident opens dashboard
2. Clicks "Report Issue"
3. Selects location on map or allows GPS
4. Takes/uploads photo
5. Selects category, enters description
6. Submits (anonymous or provides email)
7. Receives tracking link
8. Can check status anytime
```

### Flow 3: Resident Browses Summaries

```
1. Resident visits township subdomain
2. Sees latest summaries (newest first)
3. Searches for "zoning"
4. Clicks relevant summary
5. Reads bullets + action items
6. Subscribes to email updates
```

---

## 5. Security Considerations

| Threat | Mitigation |
|--------|------------|
| API key exposure | Cloud Function proxy for Gemini calls |
| Anonymous abuse | Rate limiting, CAPTCHA on high-volume |
| Data tampering | Firestore security rules (township-scoped) |
| XSS | React's built-in escaping, sanitize HTML |
| File uploads | Size limits, virus scan (Cloud Functions) |

### Firestore Security Rules (Concept)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Summaries: public read, admin write
    match /summaries/{summaryId} {
      allow read: if true;
      allow write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Issues: public read (anonymized), authenticated create, admin update
    match /issues/{issueId} {
      allow read: if true;
      allow create: if request.auth != null || request.resource.data.anonymous == true;
      allow update: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

---

## 6. Performance Targets

| Metric | Target |
|--------|--------|
| Page load (dashboard) | < 2s on 3G |
| AI summary generation | < 15s |
| Issue submission | < 5s |
| Real-time sync | < 500ms |
| Offline capability | Read cached data |

---

## 7. Development Phases

### Phase 1: Core MVP (Weeks 1-2)
- AI summarizer enhancement
- Admin panel (basic)
- Public dashboard
- Firebase setup

### Phase 2: Issue System (Week 3)
- Issue reporting form
- Map integration
- Status tracking

### Phase 3: Polish & Deploy (Week 4)
- PWA features
- Email notifications
- First township pilot

### Phase 4: Scale (Month 2+)
- Multi-township support
- Analytics
- Additional AI features

---

## 8. API Endpoints (Cloud Functions)

```
POST /api/summarize
  Body: { text?: string, pdfUrl?: string }
  Response: { bullets, actionItems, overview, tags }

POST /api/notify
  Body: { type: 'new_summary' | 'issue_update', townshipId, data }
  Response: { sent: number }

GET /api/ohio-checkbook/:township
  Response: { url: string, embedHtml: string }
```

---

## 9. Deployment

### Firebase Configuration

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "function": "app" }]
  },
  "functions": { "source": "functions" },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": { "rules": "storage.rules" }
}
```

### Environment Variables

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
# Server-side only:
GEMINI_API_KEY=
SENDGRID_API_KEY=
```

---

## 10. Success Criteria

| Metric | Target |
|--------|--------|
| Summaries generated | 10+ in first month |
| Issues reported | 25+ in first month |
| Resident subscribers | 50+ per township |
| Clerk time saved | 80% reduction |
| Page load | < 2s average |

---

**Spec Status:** Complete  
**Next Action:** See BUILD_CHECKLIST.md for implementation steps.
