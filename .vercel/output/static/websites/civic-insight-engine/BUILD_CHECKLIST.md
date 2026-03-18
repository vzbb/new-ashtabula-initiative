# Civic Insight Engine — Build Checklist

**Date:** 2025-02-17  
**Spec Version:** 1.0  
**Estimated Effort:** 3-4 weeks (1 developer)

---

## Phase 1: Core MVP (Weeks 1-2)

### Week 1: Foundation

#### Day 1-2: Project Setup
- [ ] Initialize Firebase project (`firebase init`)
- [ ] Set up Firestore database
- [ ] Configure Firebase Authentication (Anonymous + Email)
- [ ] Set up Firebase Hosting
- [ ] Create Firebase Cloud Functions skeleton
- [ ] Add environment variables to `.env` and `.env.example`

```bash
# Commands to run
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/civic-insight-engine
npm install -g firebase-tools
firebase login
firebase init
```

#### Day 2-3: Data Layer
- [ ] Create Firestore security rules (`firestore.rules`)
- [ ] Create TypeScript interfaces from SPEC.md data model
- [ ] Set up Firestore collections: `townships`, `summaries`, `issues`, `users`
- [ ] Create data seed script for Ashtabula County townships
- [ ] Test security rules with Firebase emulator

#### Day 3-4: AI Summarizer Enhancement
- [ ] Create Cloud Function: `summarizeMeeting`
- [ ] Implement PDF parsing (use `pdf-parse` library)
- [ ] Update Gemini prompt for structured JSON output
- [ ] Add retry logic for Gemini API failures
- [ ] Implement response validation (zod schema)
- [ ] Store raw minutes in Firebase Storage, return download URL

```typescript
// Cloud Function pseudocode
export const summarizeMeeting = functions.https.onCall(async (data, context) => {
  // 1. Verify admin auth
  // 2. Fetch PDF or use provided text
  // 3. Call Gemini API with structured prompt
  // 4. Parse and validate response
  // 5. Return structured summary
});
```

#### Day 4-5: Admin Panel (Basic)
- [ ] Create admin route: `/admin`
- [ ] Build login screen (Firebase Auth)
- [ ] Create "New Summary" page:
  - [ ] File upload component (PDF)
  - [ ] Text paste fallback
  - [ ] Submit button → call `summarizeMeeting`
  - [ ] Loading state during AI processing
- [ ] Create summary preview/edit screen:
  - [ ] Editable bullets (5 items)
  - [ ] Editable action items (3 items)
  - [ ] Overview text area
  - [ ] Tag selector
- [ ] Save draft functionality
- [ ] Publish button → write to Firestore

### Week 2: Public Dashboard

#### Day 6-7: Dashboard UI
- [ ] Set up Tailwind CSS configuration
- [ ] Create layout components: Header, Footer, Navigation
- [ ] Build hero section with latest summary
- [ ] Create summary card component:
  - [ ] Date badge
  - [ ] Truncated bullets (click to expand)
  - [ ] "Read full summary" link
- [ ] Build summary list with pagination
- [ ] Add search input (client-side filter first)
- [ ] Add date range filter

#### Day 7-8: Summary Detail View
- [ ] Create route: `/summary/:id`
- [ ] Fetch summary from Firestore
- [ ] Display full content:
  - [ ] All 5 bullets
  - [ ] All 3 action items
  - [ ] Overview paragraph
  - [ ] Tags
  - [ ] Published date
- [ ] Add "Back to dashboard" link
- [ ] Add PDF download link (if available)

#### Day 8-9: Ohio Checkbook Integration
- [ ] Create budget widget component
- [ ] Embed Ohio Checkbook iframe (pre-filtered)
- [ ] Add link to full checkbook site
- [ ] Style to match dashboard

#### Day 9-10: Polish & Testing
- [ ] Add loading skeletons
- [ ] Error boundaries
- [ ] Empty states
- [ ] Mobile responsiveness pass
- [ ] Test on actual mobile device
- [ ] Deploy to Firebase Hosting (staging)

---

## Phase 2: Issue System (Week 3)

### Day 11-12: Issue Reporting Form
- [ ] Create route: `/report-issue`
- [ ] Build multi-step form:
  - [ ] Step 1: Location (map picker + GPS button)
  - [ ] Step 2: Category selector (icons)
  - [ ] Step 3: Title + description
  - [ ] Step 4: Photo upload (optional)
  - [ ] Step 5: Review + submit
- [ ] Integrate OpenStreetMap (Leaflet.js)
- [ ] Photo upload to Firebase Storage
- [ ] EXIF location extraction from photos

### Day 13-14: Issue Management
- [ ] Create route: `/issues` (public list)
- [ ] Build issue card component:
  - [ ] Status badge (color-coded)
  - [ ] Category icon
  - [ ] Truncated description
  - [ ] Location preview
- [ ] Add filter: status, category, date
- [ ] Create issue detail view
- [ ] Add public comments (read-only for public)

### Day 14-15: Admin Issue Dashboard
- [ ] Add to admin panel: `/admin/issues`
- [ ] Build issue queue (newest first)
- [ ] Status update buttons:
  - [ ] Open → In Review
  - [ ] In Review → Assigned
  - [ ] Assigned → Resolved
  - [ ] Any → Closed
- [ ] Add internal notes (admin only)
- [ ] Email notification on status change

### Day 15-16: Issue Tracking for Residents
- [ ] Create tracking page: `/track/:issueId`
- [ ] Show issue details + status history
- [ ] Status timeline visualization
- [ ] Option to add follow-up comment
- [ ] Anonymous tracking (no auth required if they have the link)

---

## Phase 3: Polish & Deploy (Week 4)

### Day 17-18: PWA Features
- [ ] Add `vite-plugin-pwa`
- [ ] Generate icons for all sizes
- [ ] Create `manifest.json`
- [ ] Add service worker for:
  - [ ] Cache static assets
  - [ ] Cache recent summaries (IndexedDB)
  - [ ] Background sync for issue submissions
- [ ] Test "Add to Home Screen" flow
- [ ] Test offline reading

### Day 18-19: Email Notifications
- [ ] Set up SendGrid account
- [ ] Create email templates:
  - [ ] New summary published
  - [ ] Issue status updated
  - [ ] Weekly digest
- [ ] Build subscription form
- [ ] Create preference management page
- [ ] Add unsubscribe links
- [ ] Cloud Functions to trigger emails

### Day 19-20: Analytics & Monitoring
- [ ] Add Firebase Analytics
- [ ] Track key events:
  - [ ] Summary viewed
  - [ ] Issue submitted
  - [ ] Search performed
  - [ ] Subscription created
- [ ] Add Sentry for error tracking
- [ ] Create simple admin analytics view

### Day 20-21: First Township Pilot
- [ ] Select pilot township (suggestion: Jefferson Township)
- [ ] Onboard clerk (15-min training)
- [ ] Import 2-3 historical meeting minutes
- [ ] Test full workflow end-to-end
- [ ] Collect feedback
- [ ] Quick fixes based on feedback

---

## Phase 4: Scale (Month 2+)

### Multi-Township Support
- [ ] Refactor routes for township slugs (`/:townshipSlug`)
- [ ] Add subdomain support config
- [ ] Create township selector on homepage
- [ ] Per-township theming (colors, logo)
- [ ] Shared auth across townships

### Advanced Features
- [ ] Voice-to-text for meeting input (Web Speech API)
- [ ] Multi-language support (Spanish translation)
- [ ] QR code generation for meeting rooms
- [ ] SMS notifications (Twilio)
- [ ] Integration with existing township websites (widget)

---

## Quick Start (Copy-Paste)

### Install Dependencies
```bash
cd civic-insight-engine
npm install
npm install -D firebase-tools @types/node
npm install leaflet react-leaflet zustand @tanstack/react-query
npm install firebase pdf-parse zod
```

### Firebase Init (One-time)
```bash
firebase login
firebase init
# Select: Firestore, Functions, Hosting, Storage, Emulators
```

### Run Development
```bash
# Terminal 1: Vite dev server
npm run dev

# Terminal 2: Firebase emulators
firebase emulators:start

# Terminal 3: Cloud Functions (if working on backend)
cd functions && npm run build:watch
```

### Deploy
```bash
# Deploy everything
firebase deploy

# Or individually
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

---

## File Structure

```
civic-insight-engine/
├── public/
│   └── icons/              # PWA icons
├── src/
│   ├── components/         # Reusable UI
│   │   ├── Layout.jsx
│   │   ├── SummaryCard.jsx
│   │   ├── IssueCard.jsx
│   │   └── MapPicker.jsx
│   ├── pages/              # Route components
│   │   ├── Dashboard.jsx
│   │   ├── SummaryDetail.jsx
│   │   ├── ReportIssue.jsx
│   │   ├── TrackIssue.jsx
│   │   └── admin/
│   │       ├── Login.jsx
│   │       ├── NewSummary.jsx
│   │       ├── EditSummary.jsx
│   │       └── Issues.jsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useSummaries.js
│   │   └── useIssues.js
│   ├── lib/                # Utilities
│   │   ├── firebase.js     # Firebase init
│   │   └── formatters.js   # Date/text formatters
│   ├── store/              # Zustand stores
│   │   └── authStore.js
│   └── App.jsx
├── functions/              # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts
│   │   ├── summarize.ts    # Gemini integration
│   │   └── notifications.ts
│   └── package.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── firebase.json
├── vite.config.js
└── package.json
```

---

## Testing Checklist

### Before Each Deploy
- [ ] All TypeScript compiles without errors
- [ ] Firestore rules pass emulator tests
- [ ] Admin flow works end-to-end
- [ ] Public dashboard loads on mobile
- [ ] Issue submission works anonymously
- [ ] Email notifications send

### Performance Checks
- [ ] Lighthouse score > 80
- [ ] Page load < 2s on simulated 3G
- [ ] AI summary generates < 15s
- [ ] No console errors

---

## Rollback Plan

If deployment fails:
1. `firebase hosting:clone staging live` (if using channels)
2. Or revert commit → `firebase deploy`
3. Cloud Functions: previous version kept automatically

---

**Next Action:** Begin Phase 1, Day 1 (Firebase setup)
