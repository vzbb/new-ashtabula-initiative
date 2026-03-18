# Invest Ashtabula - Economic Development Portal

A Next.js 14+ application for the Ashtabula Area Development Corporation (AADC) showcasing available industrial sites, incentives, and economic development opportunities in Ashtabula County, Ohio.

## Phase 1: Foundation - Completed

This phase establishes the core infrastructure and UI components for the portal.

### Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Maps**: Mapbox GL JS
- **Icons**: Lucide React

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── home/              # Home page with hero, featured sites, utility teaser
│   ├── sites/             # Sites directory with search/filter
│   ├── site/[id]/         # Dynamic site detail pages
│   ├── incentives/        # Incentives listing page
│   ├── about/             # About AADC page
│   ├── contact/           # Contact form page
│   ├── not-found.tsx      # 404 page
│   ├── layout.tsx         # Root layout with navigation
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx    # Site navigation
│   ├── footer.tsx        # Site footer
│   ├── site-card.tsx     # Site card component
│   ├── site-map.tsx      # Mapbox map component
│   ├── site-filters.tsx  # Filter sidebar component
│   └── utility-dashboard.tsx # Utility capacity display
├── lib/                  # Utilities and data
│   ├── utils.ts         # Utility functions (cn helper)
│   ├── types.ts         # TypeScript interfaces
│   └── data.ts          # Mock data for sites and incentives
```

### Sample Data

Three sample sites are included:

1. **Former Manufacturing Complex** (site-001)
   - 10 acres, Industrial, Shovel-ready
   - Rail access, utilities available

2. **Downtown Commercial Opportunity** (site-002)
   - 0.5 acres, TIF eligible
   - Downtown location, high visibility

3. **Waterfront Industrial Port Site** (site-003)
   - 25 acres, Port access
   - Rail proximity, Foreign Trade Zone eligible

### Features Implemented

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Professional blue/green color palette
- ✅ Interactive Mapbox map with site markers
- ✅ Site filtering by acreage, zoning, status, utilities
- ✅ Site detail pages with full property information
- ✅ Incentives listing page
- ✅ Contact form with validation
- ✅ About page with AADC information
- ✅ SEO-optimized metadata

### Build

Static export is configured. To build:

```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/invest-ashtabula/my-app
npm run build
```

Output is in the `dist/` directory.

### Development

```bash
npm run dev
```

### Mapbox Configuration

The map uses a demo token. For production, replace the token in `src/components/site-map.tsx`:

```typescript
const MAPBOX_TOKEN = 'your-production-token-here';
```

### Phase 2 Preview

Next phase will include:
- Supabase integration for real data
- User authentication for admin dashboard
- Shortlist functionality with localStorage
- Contact form backend with email integration
- Image uploads and management

---

Built by Noirsys AI for Ashtabula Area Development Corporation
