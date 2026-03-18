# ContractorMatch - Phase 1 Foundation

A Next.js 14+ contractor matching platform for Ashtabula County homeowners and contractors.

## Features (Phase 1)

- ✅ Next.js 14+ with App Router
- ✅ Supabase Auth with dual roles (homeowner/contractor)
- ✅ Project intake wizard (3 steps)
- ✅ Contractor profile with verification flags
- ✅ Simple rule-based matching (specialty + location)
- ✅ Tailwind CSS + shadcn/ui components

## Project Structure

```
my-app/
├── app/
│   ├── auth/
│   │   └── actions.ts          # Auth server actions
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard navigation
│   │   └── page.tsx            # Role-based dashboard
│   ├── login/
│   │   └── page.tsx            # Login form
│   ├── register/
│   │   └── page.tsx            # Registration form
│   ├── projects/
│   │   ├── new/
│   │   │   └── page.tsx        # Project wizard
│   │   ├── [id]/
│   │   │   └── matches/
│   │   │       └── page.tsx    # Match results
│   │   ├── page.tsx            # Projects list
│   │   └── actions.ts          # Project actions
│   ├── matching/
│   │   └── actions.ts          # Matching logic
│   ├── profile/
│   │   ├── page.tsx            # Contractor profile
│   │   └── actions.ts          # Profile actions
│   ├── leads/
│   │   └── page.tsx            # Contractor leads
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   └── ui/                     # shadcn components
├── lib/
│   ├── database.types.ts       # TypeScript types
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts       # Auth middleware
│   └── utils.ts                # Utility functions
├── supabase/
│   └── schema.sql              # Database schema
├── middleware.ts               # Next.js middleware
└── .env.local.example          # Environment template
```

## Quick Start

### 1. Install Dependencies

```bash
cd my-app
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor
3. Copy `.env.local.example` to `.env.local` and add your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

### Tables

- **user_roles**: User role assignment (homeowner/contractor)
- **homeowners**: Homeowner profiles
- **contractors**: Contractor profiles with verification flags
- **projects**: Project listings
- **matches**: Project-contractor matches

### Verification Flags (Contractors)

- `insurance_verified`: BOOLEAN (default FALSE)
- `background_check_passed`: BOOLEAN (default FALSE)
- `license_number`: VARCHAR (nullable)

All verification flags are set to FALSE by default for the MVP.

## User Flows

### Homeowner
1. Register as homeowner
2. Complete 3-step project wizard
3. View matched contractors
4. Request quotes

### Contractor
1. Register as contractor
2. Complete profile with specialties
3. View matching leads
4. Submit quotes

## Matching Algorithm

Simple rule-based scoring (Phase 1):
- Specialty match: +100 points
- Rating bonus: up to +20 points
- Years in business: up to +10 points
- Verification badges: +10 points each

Max score: 150 points

## Next Steps (Phase 2+)

- AI project classification
- Advanced matching with location proximity
- Quote submission and comparison
- Review system
- Payment milestones
- Contract integration

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (Auth + Database)
- PostGIS (Geolocation)