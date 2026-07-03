# SPEC.md — Cashflow Tracker
**Date:** 2026-02-19
**Version:** 1.0 — MVP Specification
**Project:** cashflow-tracker

---

## 1. Product Overview

### One-Line Description
A free, dead-simple cash flow tracking tool built for Ashtabula's small businesses and seasonal economy.

### Target User
Small business owners (1-10 employees) in Ashtabula County who:
- Can't afford $50+/mo for accounting software
- Need basic cash flow visibility
- Experience seasonal income fluctuations
- May need cash flow reports for loans/grants

### Core Value Proposition
"Know your cash position in 30 seconds — no accounting degree required."

---

## 2. Feature Specification

### P0 — MVP (Must Have for Launch)

| Feature | Description | User Value |
|---------|-------------|------------|
| **Manual Entry** | Add income/expense with amount, category, date, note | No bank connection required to start |
| **Cash Position Dashboard** | Big number showing current cash position | Instant clarity on financial health |
| **30-Day Forecast** | Simple projection based on recurring patterns | Early warning of cash crunches |
| **Category Tracking** | Predefined categories (Sales, Rent, Payroll, Supplies, etc.) | Organized without complexity |
| **Transaction History** | List view with filtering by date/category | Find past transactions quickly |
| **CSV Export** | Download data for accountants | Bridge to professional services |
| **Seasonal View** | Compare current month to same month last year | Context for seasonal businesses |

### P1 — Post-Launch (Next 30 Days)

| Feature | Description |
|---------|-------------|
| **Bank Sync (Plaid)** | Automatic transaction import |
| **Recurring Transactions** | Mark income/expenses as repeating |
| **Goal Tracking** | Set and track savings targets |
| **Mobile Optimization** | PWA with offline support |

### P2 — Future

| Feature | Description |
|---------|-------------|
| **Lender Reports** | One-click RLF/SBA-ready reports |
| **Multi-User** | Accountant/bookkeeper access |
| **AI Insights** | Anomaly detection, spending suggestions |
| **Peer Benchmarking** | Anonymous comparison to similar businesses |

---

## 3. Technical Architecture

### Stack
| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React 19 + Vite + Tailwind CSS | Fast, familiar, consistent with other projects |
| **Backend** | Firebase (Firestore, Auth, Hosting) | Free tier, serverless, real-time sync |
| **State** | React Context + useReducer | Simple state management |
| **Charts** | Recharts | Lightweight, React-native |
| **Auth** | Firebase Auth (email/password, Google) | Secure, free, social login option |

### Data Model

```typescript
// User
interface User {
  uid: string;
  email: string;
  displayName?: string;
  businessName?: string;
  createdAt: Timestamp;
  onboardingComplete: boolean;
}

// Transaction
interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: Category;
  description: string;
  date: Timestamp;
  isRecurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
  createdAt: Timestamp;
}

// Category
interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  isDefault: boolean;
}

// Cash Snapshot (for fast dashboard loads)
interface CashSnapshot {
  userId: string;
  currentPosition: number;
  last30DaysIncome: number;
  last30DaysExpenses: number;
  projected30Days: number;
  updatedAt: Timestamp;
}
```

### Default Categories

**Income:**
- Sales/Revenue
- Service Income
- Grants/Loans
- Other Income

**Expenses:**
- Rent/Lease
- Payroll
- Supplies/Materials
- Utilities
- Marketing
- Insurance
- Taxes
- Equipment
- Professional Services
- Other Expense

---

## 4. User Flow

### Onboarding Flow (3 steps)
1. **Welcome** — Value proposition + "Get Started"
2. **Business Setup** — Business name + starting cash position
3. **First Transaction** — Guided entry of income or expense

### Core Loop
1. Land on Dashboard → See current cash position
2. Add transaction → Quick add modal (type, amount, category)
3. View forecast → Scroll to 30-day projection
4. Check history → Filterable transaction list
5. Export data → CSV download for accountant

---

## 5. UI/UX Specification

### Dashboard Layout
```
┌─────────────────────────────────────┐
│  Cashflow Tracker      [+ Add] [≡]  │
├─────────────────────────────────────┤
│                                     │
│   Your Cash Position                │
│   $12,450                           │
│   ↑ $2,340 vs last month            │
│                                     │
├─────────────────────────────────────┤
│  [30-Day Forecast Chart]            │
│  Line: projected cash position      │
├─────────────────────────────────────┤
│  Quick Stats                        │
│  Income: $8,200  |  Expenses: $5,860│
├─────────────────────────────────────┤
│  Recent Transactions                │
│  • Sale - $450 - Today              │
│  • Rent - $1,200 - Yesterday        │
│  • Supplies - $85 - Feb 17          │
│                                     │
│  [View All]                         │
└─────────────────────────────────────┘
```

### Add Transaction Modal
```
┌─────────────────────────────────────┐
│  Add Transaction              [×]   │
├─────────────────────────────────────┤
│  [Income] [Expense]                 │
│                                     │
│  Amount: $ [________]               │
│                                     │
│  Category: [Dropdown ▼]             │
│                                     │
│  Description: [________] (optional) │
│                                     │
│  Date: [Today ▼]                    │
│                                     │
│  [☐] Recurring monthly              │
│                                     │
│  [    Save Transaction    ]         │
└─────────────────────────────────────┘
```

### Design System
- **Primary:** Blue (#2563EB) — trust, finance
- **Income:** Green (#10B981)
- **Expense:** Red (#EF4444)
- **Background:** Gray-50 (#F9FAFB)
- **Card:** White with subtle shadow
- **Typography:** Inter (system fallback)

---

## 6. API Endpoints (Firebase Functions)

### Cloud Functions
```typescript
// Generate CSV export
POST /exportCsv
Request: { userId, startDate?, endDate? }
Response: { downloadUrl }

// Calculate forecast
POST /calculateForecast  
Request: { userId, days: 30 }
Response: { dailyProjections: Array<{date, projectedBalance}> }

// Update cash snapshot (triggered on transaction write)
// Internal function, no endpoint
```

---

## 7. Security Rules

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
                          resource.data.userId == request.auth.uid;
    }
    
    match /cashSnapshots/{snapshotId} {
      allow read: if request.auth != null && 
                   resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 8. Performance Targets

| Metric | Target |
|--------|--------|
| Time to Interactive | < 2 seconds |
| Dashboard load (cached) | < 500ms |
| Transaction add | < 2 seconds |
| CSV export | < 5 seconds |
| Lighthouse Score | > 90 |

---

## 9. Analytics & Monitoring

### Track Events
- `transaction_added`
- `transaction_edited`
- `transaction_deleted`
- `dashboard_viewed`
- `csv_exported`
- `onboarding_completed`

### Key Metrics
- Daily Active Users (DAU)
- Transactions per user per week
- Retention (7-day, 30-day)
- CSV exports (proxy for accountant engagement)

---

## 10. Open Questions

1. Should we integrate with existing accounting tools (QuickBooks API) for import?
2. Do we need multi-currency support for Canadian tourists/businesses?
3. Should we build a companion mobile app or stick to PWA?
4. What's the path to lender integration (RLF direct API vs manual report)?

---

## 11. Success Criteria

### Launch Success
- 50+ registered users in first month
- 70% complete onboarding
- Average 5+ transactions per active user

### 90-Day Success
- 200+ active users
- 20% weekly retention
- 5+ CSV exports (evidence of accountant engagement)
- 1 SBDC partnership confirmed

---

**Status:** ✅ Phase 3 Complete — Ready for Phase 4 (Build Checklist)
