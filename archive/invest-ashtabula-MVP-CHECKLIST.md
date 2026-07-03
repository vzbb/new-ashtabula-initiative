# invest-ashtabula MVP Build Checklist

**Project:** New Ashtabula Initiative — Investment Portal  
**Scope:** MVP (4-day implementation)  
**Status:** Ready for Build Kickoff  
**Created:** 2026-02-23 10:51 PM ET

---

## 🎯 MVP Scope Summary

Static-site investment portal showcasing 3 sample industrial sites with:
- Professional landing page with hero + site cards
- Individual site detail pages
- Contact form (Resend integration)
- Mobile-responsive design
- No backend/database (JSON data files)

**Timeline:** 4 days | **Deploy Target:** Static hosting (Vercel/Netlify)

---

## 📋 Pre-Build Setup (Day 0 — 30 min)

### Repository & Tooling
- [ ] Create repo: `na-invest-ashtabula`
- [ ] Initialize: `npm create vite@latest . -- --template react`
- [ ] Install deps: `npm install tailwindcss @tailwindcss/vite react-router-dom lucide-react`
- [ ] Configure Tailwind v4 (`@import "tailwindcss"` in CSS)
- [ ] Setup project structure (see below)

### Project Structure
```
src/
├── components/
│   ├── Hero.jsx
│   ├── SiteCard.jsx
│   ├── SiteGrid.jsx
│   ├── ContactForm.jsx
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   └── SiteDetail.jsx
├── data/
│   └── sites.json          # 3 sample sites
├── utils/
│   └── resend.js           # Contact form handler
├── App.jsx
└── main.jsx
public/
├── images/                 # Site photos (stock initially)
└── favicon.svg
```

---

## 🏗️ Build Tasks

### Day 1 — Foundation + Hero (2-3 hours)

**Global Styles & Layout**
- [ ] Configure brand colors in CSS:
  - Primary: `#1e40af` (Ohio blue)
  - Secondary: `#059669` (growth green)
  - Accent: `#d97706` (energy amber)
- [ ] Create `Layout.jsx` wrapper with nav + footer
- [ ] Responsive nav with mobile hamburger

**Hero Component**
- [ ] Full-width hero with background image/gradient
- [ ] Headline: "Invest in Ashtabula's Future"
- [ ] Subheadline about industrial advantages
- [ ] CTA buttons: "View Sites" + "Contact AADC"
- [ ] Stats bar: "3 Sites | 150+ Acres | Rail + Port Access"

**Footer**
- [ ] AADC logo + contact info
- [ ] Quick links (Sites, Contact, About)
- [ ] Social placeholders

**Deliverable:** Homepage renders with hero and footer

---

### Day 2 — Site Data + Grid (2-3 hours)

**Sample Site Data** (`data/sites.json`)
- [ ] Site 1: "Harbor Industrial Park" (50 acres, rail, port-adjacent)
- [ ] Site 2: "Route 20 Commerce Center" (45 acres, highway frontage)
- [ ] Site 3: "Prospect Road Flex Campus" (60 acres, mixed-use)

Each site object:
```json
{
  "id": "harbor-industrial-park",
  "name": "Harbor Industrial Park",
  "acres": 50,
  "type": "Heavy Industrial",
  "status": "Shovel-Ready",
  "features": ["Rail Access", "Port-Adjacent", "Utilities Ready"],
  "highlights": ["CSX Rail Spur", "50k SF Available", "Tax Incentives"],
  "description": "Prime industrial site...",
  "location": { "lat": 41.865, "lng": -80.789, "address": "..." },
  "photos": ["/images/site1-1.jpg", ...],
  "contact": { "name": "AADC", "email": "invest@ashtabula.org" }
}
```

**SiteCard Component**
- [ ] Photo thumbnail with status badge
- [ ] Site name + acreage + type
- [ ] 3 key features as tags
- [ ] "View Details" link
- [ ] Hover state with subtle lift

**SiteGrid Component**
- [ ] Responsive grid (1 col mobile, 2 tablet, 3 desktop)
- [ ] Filter by type (optional MVP stretch)
- [ ] Load data from sites.json

**Home Page Integration**
- [ ] Add SiteGrid below Hero
- [ ] Add "Why Ashtabula" section (3 benefits cards)

**Deliverable:** Homepage shows 3 site cards with real data

---

### Day 3 — Detail Pages + Contact (2-3 hours)

**SiteDetail Page**
- [ ] Dynamic route: `/site/:siteId`
- [ ] Hero image gallery (1 main + thumbnails)
- [ ] Site specs table (acres, zoning, utilities)
- [ ] Features list with icons
- [ ] Location map placeholder (static image)
- [ ] "Request Info" CTA button
- [ ] Back to all sites link

**ContactForm Component**
- [ ] Fields: Name, Company, Email, Phone, Interest (select), Message
- [ ] Validation with error states
- [ ] Submit button with loading state
- [ ] Success/error message display

**Resend Integration**
- [ ] Create `utils/resend.js` (API key from env)
- [ ] Netlify/Vercel serverless function for form handling
- [ ] Email template for inquiries
- [ ] Send confirmation to user + notification to AADC

**Contact Page**
- [ ] Route: `/contact`
- [ ] Two-column layout: form + AADC contact info
- [ ] Embedded map (Google Maps embed)

**Deliverable:** Full navigation flow working, contact form submits

---

### Day 4 — Polish + Deploy (2-3 hours)

**Responsive Polish**
- [ ] Mobile: Hero text sizes, card stacking
- [ ] Tablet: Grid adjustments
- [ ] Desktop: Max-width containers

**SEO & Meta**
- [ ] Page titles and meta descriptions
- [ ] Open Graph tags for social sharing
- [ ] Favicon

**Performance**
- [ ] Image optimization (WebP where possible)
- [ ] Lazy loading for below-fold images
- [ ] Lighthouse audit: target 90+ all categories

**Content Review**
- [ ] Spell check all copy
- [ ] Verify site data accuracy
- [ ] Test all links and buttons

**Deploy**
- [ ] Build: `npm run build`
- [ ] Vercel deploy: `vercel --prod`
- [ ] Configure custom domain (post-MVP)
- [ ] Test live site on mobile/desktop

**Deliverable:** Live deployed site at Vercel URL

---

## 📦 Component Specifications

### Hero.jsx
```jsx
// Props: none (self-contained)
// Features: Background image, gradient overlay, CTA buttons
// Responsive: Text scales, buttons stack on mobile
```

### SiteCard.jsx
```jsx
// Props: { site: SiteObject }
// Features: Image, badges, tags, link
// Hover: translateY(-4px) shadow-lg
```

### ContactForm.jsx
```jsx
// Props: none
// State: formData, errors, submitting, success
// Validation: Email regex, required fields
// Submit: POST to /api/contact
```

---

## 🔧 Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | React + Vite | Fast dev, small bundle |
| Styling | Tailwind v4 | Utility-first, fast iteration |
| Routing | react-router-dom | Standard, works with Vite |
| Icons | lucide-react | Clean, consistent |
| Form API | Resend | Free tier, simple setup |
| Hosting | Vercel | Free, fast CDN, easy deploy |
| Images | Unsplash stock | Professional look initially |

---

## 📊 Post-MVP Enhancement Roadmap

**Phase 2 (Full Build — 2 weeks)**
- Supabase backend for dynamic site data
- Admin dashboard for AADC to manage listings
- Interactive maps (Mapbox/Leaflet)
- Calendly integration for site visits
- Document downloads (site plans, incentives)

**Phase 3 (Scale)**
- Real photography for sites
- Video tours
- Testimonials from local businesses
- Analytics dashboard

---

## ✅ Success Criteria

- [ ] Site loads in < 2 seconds
- [ ] All pages mobile-responsive
- [ ] Contact form delivers emails
- [ ] 0 console errors
- [ ] Lighthouse score 90+
- [ ] Professional appearance matching brand

---

## 🚀 Quick Start Command

```bash
# Run this to scaffold Day 0 in one command
cd ~/projects
curl -s https://raw.githubusercontent.com/.../scaffold-invest-mvp.sh | bash
```

*(Scaffold script can be created if desired)*

---

**Status:** READY FOR KICKOFF  
**Next Action:** Approve MVP scope → execute Day 0 setup

</file>
