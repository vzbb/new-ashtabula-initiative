# SPECIFICATION — Invest Ashtabula Portal v0.1

**Project:** invest-ashtabula  
**Type:** Economic Development / Site Selection Portal  
**Status:** Specification Complete — Ready for Development  
**Date:** 2026-02-15  
**Estimated Build:** 8–12 hours (3 phases)

---

## 1. Executive Summary

AI-powered economic development portal showcasing Ashtabula County's available industrial sites, real-time utility capacities, and incentive programs. Targets site selectors, business owners, and developers evaluating relocation or expansion opportunities.

**Core Value Proposition:** Reduce friction in the site selection process by consolidating scattered data (parcels, utilities, incentives) into a unified, queryable interface with direct connection to economic development staff.

---

## 2. Core Features

### 2.1 Interactive Site Map (Primary)
- **Map display:** Full-screen interactive map (Mapbox/Leaflet) of Ashtabula County
- **Site markers:** Color-coded pins for available industrial sites
  - Green: Shovel-ready (utilities confirmed, permitted)
  - Yellow: Available (needs verification/development)
  - Blue: Incentive zone (opportunity zone, TIF district, etc.)
- **Site cards:** Click marker → slide-out panel with:
  - Acreage, zoning classification, price/lease terms
  - Distance to I-90, CSX rail, Port of Ashtabula
  - Photos (if available), PDF site plan download
  - "Save to Shortlist" button
- **Filters sidebar:**
  - Acreage range (1–5, 5–20, 20–50, 50+)
  - Zoning type (Industrial, Mixed-Use, TIF)
  - Utility requirements (Electric ≥ X kVA, Natural Gas, Fiber)
  - Rail access (Y/N), Port access (Y/N)
  - Incentive eligibility (Opportunity Zone, New Markets Tax Credit)

### 2.2 Utility Capacity Dashboard
- **Real-time (or cached) utility data:**
  - AEP Ohio: Available 3-phase capacity by substation area
  - Columbia Gas: Pressure/capacity by zone
  - Broadband: Fiber providers (Lumen, Spectrum Business) coverage map
  - Water/Sewer: City of Ashtabula and AADC service areas
- **Visual indicators:**
  - Green check: Confirmed capacity available
  - Yellow warning: Limited capacity / contact utility
  - Gray: Unknown / requires inquiry
- **Inquiry form:** "Check Capacity at This Location" → submits to AADC staff

### 2.3 Incentives Finder
- **Searchable database:**
  - Tax abatements (City of Ashtabula, county-level)
  - Opportunity Zones (federal)
  - Workforce development grants (Ohio TechCred, Incumbent Worker Training)
  - Infrastructure grants (ODOT, JobsOhio)
  - Port/Foreign Trade Zone benefits
- **Eligibility wizard:** 5-question flow → matched incentives list
  - "Are you creating 10+ jobs?" → Workforce grants
  - "Are you exporting goods?" → FTZ benefits
  - "Are you in manufacturing?" → Specific abatements
- **Calculator (basic):** Estimated tax savings based on investment size, job count

### 2.4 Shortlist & Contact Flow
- **My Shortlist:** Saved sites persist in localStorage (no auth required for MVP)
  - Compare view: Side-by-side table of 2–3 sites
  - Export: PDF summary or email to user
- **Contact AADC form:**
  - Fields: Name, Company, Email, Phone, Project Type (New/Expansion/Relocation), Timeline (0–6mo, 6–12mo, 1–2yr, 2yr+), Message
  - Auto-attaches: Shortlist site IDs, selected incentives
  - Submit → email to AADC + confirmation to user
- **Schedule a Call:** Calendly integration (AADC sets available slots)

### 2.5 Admin Dashboard (AADC Staff)
- **Site management:**
  - Add/edit/delete site listings (form with map pin placement)
  - Upload photos, PDFs (site plans, environmental assessments)
  - Mark site status (Available, Under Option, Sold/Leased)
- **Inquiry queue:**
  - Table of submitted contact forms
  - Status: New, Contacted, Qualified, Closed
  - Assign to staff member, add internal notes
- **Analytics:**
  - Map views, most-saved sites, popular filters
  - Inquiry volume by week/month

---

## 3. Technical Architecture

### 3.1 Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Maps:** Mapbox GL JS (free tier: 50k loads/month)
- **Database:** Supabase (PostgreSQL + PostGIS for geospatial queries)
- **Auth (admin only):** Supabase Auth (email/password)
- **Storage:** Supabase Storage (site photos, PDFs)
- **Email:** Resend or SendGrid (inquiry notifications)
- **Calendar:** Calendly embed (no API needed for MVP)
- **Hosting:** Vercel (serverless functions for API routes)

### 3.2 Data Schema (Core Tables)

```sql
-- Sites table with PostGIS geometry
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  acres DECIMAL(8,2),
  zoning_type TEXT,
  status TEXT CHECK (status IN ('available', 'shovel_ready', 'option', 'leased')),
  price_type TEXT CHECK (price_type IN ('sale', 'lease', 'contact')),
  price_amount DECIMAL(12,2),
  has_rail BOOLEAN DEFAULT false,
  has_port_access BOOLEAN DEFAULT false,
  geo_location GEOGRAPHY(POINT,4326),
  photos TEXT[], -- array of storage URLs
  documents JSONB, -- {site_plan_url, environmental_url, ...}
  aep_zone TEXT,
  gas_zone TEXT,
  fiber_available BOOLEAN,
  incentives UUID[], -- references incentives table
  contact_email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Incentives table
CREATE TABLE incentives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('tax_abatement', 'opportunity_zone', 'workforce_grant', 'infrastructure_grant', 'ftz')),
  description TEXT,
  eligibility_criteria JSONB,
  estimated_value TEXT, -- e.g., "Up to $2,000 per job"
  contact_info TEXT,
  apply_url TEXT
);

-- Inquiries table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT,
  timeline TEXT,
  message TEXT,
  shortlisted_sites UUID[],
  interested_incentives UUID[],
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  assigned_to TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics events (optional, for MVP can defer)
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT,
  site_id UUID,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.3 API Routes (Next.js App Router)

```
/app
  /api
    /sites
      GET    → List sites (with filters, geo bounds)
      POST   → Create site (admin only)
    /sites/[id]
      GET    → Single site details
      PATCH  → Update site (admin only)
      DELETE → Remove site (admin only)
    /incentives
      GET    → List all incentives
    /inquiries
      POST   → Submit new inquiry (public)
      GET    → List inquiries (admin only)
    /inquiries/[id]
      PATCH  → Update status/notes (admin only)
    /utility-check
      POST   → Submit utility capacity inquiry (emails AADC)
```

### 3.4 External Data Sources (Integration Plan)

**Phase 1 (Static/Manual):**
- AADC provides site list via spreadsheet → manual import to Supabase
- Utility zones provided as GeoJSON → static map layers
- Incentives list curated by AADC → manual entry

**Phase 2 (Automated/Real-time):**
- Ashtabula County Auditor parcel API (if available)
- AEP Ohio grid capacity API (if available, likely request-based)
- JobsOhio incentive database scrape/API

**Phase 3 (Advanced):**
- Real-time utility capacity feeds
- Integration with AADC CRM (HubSpot/Salesforce)

---

## 4. UI/UX Design System

### 4.1 Visual Style
- **Palette:**
  - Primary: `#1E40AF` (blue — trust, business)
  - Secondary: `#059669` (green — growth, availability)
  - Accent: `#D97706` (amber — incentives, attention)
  - Neutral: `#374151` (slate — text), `#F3F4F6` (gray — backgrounds)
- **Typography:** Inter (Google Fonts) — clean, professional
- **Map style:** Mapbox "Light" or custom muted style (professional, not playful)

### 4.2 Key Screens

**Home/Landing:**
- Hero: "Find Your Next Industrial Site in Ashtabula County"
- Stats bar: X sites available, Y acres, Z incentive programs
- CTA: "Explore the Map" → scrolls to map
- Featured sites carousel (3 shovel-ready sites)

**Map View (Primary Interface):**
- 70% map, 30% collapsible sidebar
- Sidebar: Filters at top, site list below (scrollable)
- Click site → card expands with details, "View Full Profile" button
- Mobile: Bottom sheet for site details, full-screen map

**Site Detail Page:**
- Photo gallery (if available)
- Key stats grid: Acres, Zoning, Price, Utilities
- Map embed (static, for sharing)
- Download: Site plan PDF
- CTA: "Add to Shortlist", "Contact AADC About This Site"

**Incentives Page:**
- Search bar (fuzzy search on name/description)
- Filter pills by type
- Cards: Name, type badge, brief description, "Learn More" → modal with full details

**Shortlist Page:**
- Table of saved sites
- Compare button (opens comparison view)
- Clear shortlist
- "Share with AADC" button → pre-fills contact form

**Admin Dashboard:**
- Login page (simple, Supabase Auth)
- Sites management: Table view + "Add Site" button
- Inquiries: Kanban board (New → Contacted → Qualified → Closed)
- Simple charts (inquiries per week, popular sites)

---

## 5. Content Requirements

### 5.1 Required from AADC (Before Build)
- [ ] Site inventory spreadsheet (name, address, acres, zoning, price, contact)
- [ ] Site photos (1–5 per site, min 1200px wide)
- [ ] Site plans/PDFs (if available)
- [ ] Utility zone maps or contact for verification
- [ ] Incentives list with eligibility criteria
- [ ] AADC staff contact info for inquiry routing
- [ ] Calendly link for "Schedule a Call"

### 5.2 Static Copy (Can Draft)
- Homepage hero text, value propositions
- About Ashtabula County (location advantages, workforce, logistics)
- How it works (3-step: Explore → Shortlist → Connect)
- Footer: AADC address, phone, social links

### 5.3 Legal/Disclaimer
> "Site information is provided as a courtesy and may not reflect real-time availability. All transactions require due diligence and direct negotiation with property owners. Utility capacity confirmations require direct coordination with utility providers."

---

## 6. Development Phases

### Phase 1: Foundation (3–4 hours)
- [ ] Next.js project scaffold + Tailwind config
- [ ] Supabase project setup + schema migration
- [ ] Mapbox integration + basic map display
- [ ] Sites table seed with 3–5 sample sites (AADC to provide)
- [ ] Site markers on map + click-to-view basic info

**Milestone:** Map loads, markers visible, click shows site name + acres

### Phase 2: Core Features (4–5 hours)
- [ ] Site detail slide-out/card with full fields
- [ ] Filters sidebar (acreage, zoning, utilities)
- [ ] Shortlist functionality (localStorage)
- [ ] Incentives list page + detail modals
- [ ] Contact form + email integration (Resend)

**Milestone:** User can filter sites, save to shortlist, submit inquiry

### Phase 3: Admin & Polish (2–3 hours)
- [ ] Supabase Auth setup (admin only)
- [ ] Admin dashboard: Sites CRUD
- [ ] Admin dashboard: Inquiries queue
- [ ] Mobile responsive pass
- [ ] SEO meta tags, sitemap
- [ ] Analytics (Plausible or Vercel Analytics)

**Milestone:** AADC staff can add/edit sites, view/manage inquiries

---

## 7. Open Questions for AADC/Michael

1. **Data readiness:** Does AADC have a current site inventory spreadsheet, or do we need to create one from scratch?
2. **Utility data:** Is there a contact at AEP/Columbia Gas who can provide zone capacity data, or should utility inquiries route to AADC staff manually?
3. **Site photos:** Are photos available for sites, or should we use satellite imagery as fallback?
4. **Domain:** Deploy to `invest.ashtacounty.org` or `invest-ashtabula.vercel.app` initially?
5. **Calendly:** Does AADC have a Calendly account, or should we use a simple "Request a Call" form instead?

---

## 8. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AADC doesn't have structured site data | Start with 3–5 manually entered examples; build import tool for later |
| Utility data unavailable | Mark all as "Contact AADC to verify" in Phase 1 |
| Low initial site inventory | Launch with available sites + "Coming Soon" markers for known properties |
| Maintenance burden post-launch | Build simple admin UI; train AADC staff on updates |

---

## 9. Success Metrics

- **Adoption:** 50+ map sessions in first month
- **Engagement:** 10+ shortlists created, 5+ inquiries submitted
- **Utility:** AADC reports 2+ qualified leads in first quarter
- **Maintenance:** AADC staff can add new site without developer help

---

## 10. Appendix

### A. Similar Reference Sites
- [JobsOhio Site Selection](https://jobsohio.com/)
- [OhioSE Regional Sites](https://www.ohiose.com/)
- [SiteOhio](https://siteohio.com/)

### B. Data Sources to Investigate
- Ashtabula County Auditor: https://www.ashtabulacounty.us/auditor/
- AEP Ohio Economic Development: https://www.aepohio.com/business/economic_development/
- JobsOhio Site Selection: https://jobsohio.com/site-selection/
- Ohio Opportunity Zones: https://development.ohio.gov/community-development/opportunity-zones
