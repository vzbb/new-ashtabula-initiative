# Phase 1: Research & Recon — Farm Stand Finder
**Project:** Farm Stand Finder (New Ashtabula Initiative)  
**Date:** February 19, 2026  
**Status:** ✅ COMPLETE

---

## 1. Ashtabula County Farm Ecosystem Overview

### 1.1 Farmers Markets (2025 Season)

| Market | Location | Schedule | Manager Contact |
|--------|----------|----------|-----------------|
| **Ashtabula Farmers Market** | 1105 Bridge St, Ashtabula | Sundays, June 9–Oct 12, 10am–2pm | Rees Davis, 440-992-8362 |
| **Conneaut Farmers Market** | 280 Park Ave (Moose Lodge), Conneaut | Saturdays, June 15–Oct 11, 9am–1pm | Joanne Seavy, 440-599-8684 |
| **Geneva Farmers Market** | 89 S Broadway, Geneva | Saturdays, June 29–Oct 5, 9:30am–1:30pm | Pastor Randy/Barb Lomasney, 440-466-2817 |
| **Jefferson Farmers Market** | 42 E. Jefferson St, Jefferson | Saturdays, June 8–Oct 12, 9am–1pm | Judy/Joy Pallant, 440-474-1285 |
| **Jefferson Wellness Market** | 25 W Jefferson St (Courtyard) | Thursdays, Mid-June–Oct, 3pm–5pm | Jennifer Skinner, 440-576-3752 |
| **Pierpont Farmers Market** | 1071 Route 7 N, Pierpont | Saturdays, June 22–Sept 28, 8am–Noon | Cheri Hoover, 440-361-0209 |
| **My Neighborhood Farmers Market** | 2231 Lake Ave, Ashtabula | Dates TBD | my.neighborhood.collaborative@gmail.com |
| **Orwell Farmers Market** | State Route 45 & Park, Orwell | Wednesdays, 4pm–8:30pm | NEW 2025 |
| **Hartsgrove Farmers Market** | 5130 State Rt 534, Rome | Saturdays | NEW 2025 |

### 1.2 Farm Stands & U-Pick Operations

| Farm | Location | Products | Contact | Notes |
|------|----------|----------|---------|-------|
| **Kiraly's Orchard** | 6031 S Ridge Rd W, Ashtabula | Apples, peaches, plums, cider | 440-969-1297, skiraly@suite224.net | U-pick, Aug–Nov, 9am–5pm |
| **Rainbow Farms** | 2464 Townline Rd, Madison | Pick-your-own peppers, tomatoes, pumpkins | 440-259-4924, rainbowfarmsonline.com | Winter: Fri 1pm–5pm, Sat 10am–2pm |
| **West Orchards** | 3034 North Ridge Rd, Perry Twp | Strawberries, cherries, peaches, apples, veggies | (Lake County - nearby) | Century Farm, U-pick June–Dec |
| **Scenic Ridge Fruit Farm** | 2031 State Route 89, Jeromesville | 84+ acres apples, peaches, blackberries, grapes, corn | 419-368-3353 | Bauman Orchards location |
| **Szalay's Sweet Corn Farm** | 4563 Riverview Rd, Peninsula | Sweet corn, produce, local goods | 330-657-2727, szalaysfarm.com | 94 years, 4 generations |
| **Farm 153** | Ashtabula area | (Market vendor) | Via Jefferson Wellness Market | Flower farm, baked goods |
| **9th of September Flower Farm** | Ashtabula area | Flowers, plants | Via Jefferson Wellness Market | You-pick flowers |

### 1.3 CSA Programs (Community Supported Agriculture)
- **Status:** Limited documented CSAs in Ashtabula County specifically
- **Gap Opportunity:** Most CSA activity appears to be in neighboring Lake/Geauga counties
- **LocalHarvest.org listings:** Multiple farms near Ashtabula offering CSA shares

### 1.4 OSU Extension Local Food Guide 2024
- **Source:** ashtabula.osu.edu/sites/ashtabula/files/imce/Local%20Food%20Guide%202024_FINAL_pdfversion.pdf
- **Key Finding:** Comprehensive guide exists but is PDF-based, not interactive
- **Gap:** No real-time hours, inventory, or map-based discovery

---

## 2. Competitive Analysis

### 2.1 Direct Competitors

| Platform | Type | Strengths | Weaknesses | Pricing |
|----------|------|-----------|------------|---------|
| **LocalHarvest.org** | National farm directory | 20+ years, extensive database, CSA listings | Outdated UI, no real-time updates, limited mobile | Free listings, premium $100/year |
| **Farmish** | Mobile marketplace | Modern app, social features, free listings | Limited Ashtabula presence, $10/mo for unlimited | Free (3 listings), $10/mo unlimited |
| **GrownBy** | Farmer-owned co-op marketplace | Farmer-owned, CSA support, SNAP integration | National focus, less discovery-focused | Free to list, transaction fees |
| **Farmstand App** | Farmers market finder | Simple, GPS-based, covers US/Canada/UK/Australia/NZ | Basic, no inventory, limited farm details | Free |
| **Locavore** | Local food app | Seasonal produce tracking, recipes, social | Limited updates, smaller database | Free |

### 2.2 Indirect Competitors
- **Facebook Groups:** Ashtabula Farmers Market, local community groups
- **VisitAshtabulaCounty.com:** Tourism-focused, limited farm details
- **Google Maps:** Generic, no farm-specific features
- **Yelp:** Reviews but no farm-specific discovery

### 2.3 Competitive Gap Analysis

**What exists nationally but NOT locally:**
1. ❌ Real-time farm stand hours (most rely on Facebook posts)
2. ❌ Live inventory/availability updates
3. ❌ Integrated map with filtering by product type
4. ❌ Tourist-friendly discovery (visitors don't know where to look)
5. ❌ U-pick availability tracking
6. ❌ CSA subscription management for local farms
7. ❌ Multi-language support (Ashtabula has Hispanic agriculture workers)
8. ❌ Offline mode for rural areas with poor cell coverage

---

## 3. User Personas

### 3.1 Primary Personas

#### 👨‍🌾 Farmer Fred (Producer)
- **Age:** 45-65
- **Tech Comfort:** Low-Medium (uses Facebook, struggles with websites)
- **Pain Points:**
  - Updating hours across multiple platforms
  - Reaching tourists who don't know local spots
  - Managing customer questions about availability
  - Competing with big box stores on visibility
- **Goals:** Increase foot traffic, reduce time spent on marketing, capture tourist dollars
- **Devices:** Older Android phone, occasional laptop use

#### 🛒 Shopper Sally (Local Resident)
- **Age:** 30-55
- **Tech Comfort:** High
- **Pain Points:**
  - Drives to farm stand only to find it closed
  - Doesn't know what's in season
  - Wants to support local but convenience wins
- **Goals:** Find fresh produce quickly, plan efficient routes, discover new farms
- **Devices:** iPhone, uses Google Maps heavily

#### 🏖️ Tourist Tom (Visitor)
- **Age:** 35-65
- **Tech Comfort:** Medium
- **Pain Points:**
  - Doesn't know local farm scene exists
  - Relies on Yelp/Google which have incomplete info
  - Wants "authentic local experience" but hard to find
- **Goals:** Discover hidden gems, buy fresh fruit for vacation rental, Instagram-worthy experiences
- **Devices:** iPhone, searches "things to do near me"

#### 🍓 U-Pick Patty (Family Activity Seeker)
- **Age:** 30-45 (parents)
- **Tech Comfort:** High
- **Pain Points:**
  - Shows up for strawberry picking to find field picked out
  - Doesn't know which farms offer u-pick
  - Kids disappointed when activity fails
- **Goals:** Plan reliable family activities, know before driving
- **Devices:** Family-shared iPhone, plans ahead

### 3.2 Secondary Personas

#### 🏪 Market Manager Mary
- Manages multiple vendors
- Needs to coordinate market hours, vendor lists
- Wants to promote the entire market, not just individual farms

#### 📱 Digital Native Dave
- Wants to order ahead for pickup
- Expects app-like experience
- Will pay premium for convenience

---

## 4. Revenue Model Options

### 4.1 Option A: Freemium SaaS for Farmers (Recommended)
- **Free Tier:** Basic listing, hours, location
- **Pro Tier ($15-29/mo):** Real-time inventory updates, photos, featured placement, analytics
- **Market Tier ($49-99/mo):** Multi-vendor management for market organizers
- **Pros:** Sustainable, aligns incentives, proven model (Farmish)
- **Cons:** Requires sales effort to onboard farmers

### 4.2 Option B: Tourism Commission Model
- **Free for farmers**
- **Revenue:** 5-10% commission on referred sales OR tourism board sponsorship
- **Pros:** Low barrier for farmers, aligns with Visit Ashtabula mission
- **Cons:** Hard to track, requires partnership development

### 4.3 Option C: Municipal/GovTech Contract
- **City/County pays for economic development tool**
- **Free for all farmers**
- **Pros:** Stable funding, aligns with existing zoning-clerk work**
- **Cons:** Long sales cycle, scope creep risk

### 4.4 Option D: Hybrid (Recommended Hybrid)
- **Core:** Free basic listings
- **Pro Features:** $19/month for enhanced listings
- **Tourism Sponsorship:** $2,000-5,000/year from Ashtabula County visitors bureau
- **Grant Funding:** USDA Local Food Promotion Program, Ohio Farm Bureau grants

---

## 5. Critical Blockers & Risks

### 5.1 Technical Blockers
| Blocker | Severity | Mitigation |
|---------|----------|------------|
| Rural cell coverage gaps | Medium | Offline-first PWA design |
| Farmer tech adoption | High | Simple SMS-based update option |
| Real-time inventory accuracy | Medium | Self-reported + grace period messaging |
| Seasonal data maintenance | Medium | Automated "closed for season" detection |

### 5.2 Business Blockers
| Blocker | Severity | Mitigation |
|---------|----------|------------|
| Chicken-and-egg (need farms AND users) | High | Launch with 5+ committed farms minimum |
| Farmer skepticism of "another platform" | Medium | Lead with free tier, demonstrate value |
| Competing with Facebook (free) | Medium | Focus on discovery features FB lacks |
| Limited year-round activity (seasonal) | Medium | Expand to year-round products (honey, crafts) |

### 5.3 Regulatory Considerers
- **Food safety disclaimers:** Not responsible for product quality
- **Accessibility:** WCAG compliance for public tool
- **Data privacy:** Farmer contact information protection

---

## 6. Market Size & Opportunity

### 6.1 Addressable Market
- **Ashtabula County population:** ~97,000
- **Annual tourists:** 500,000+ (wine country, Geneva-on-the-Lake, covered bridges)
- **Farm stands/markets identified:** 15+ operations
- **Adjacent counties (Lake, Geauga, Trumbull):** Similar density of farms

### 6.2 Expansion Path
1. **Phase 1:** Ashtabula County (prove model)
2. **Phase 2:** Lake & Geauga counties (Northeast Ohio region)
3. **Phase 3:** Statewide Ohio template
4. **Phase 4:** White-label for other rural regions

---

## 7. Key Insights & Recommendations

### 7.1 Top Insights
1. **Discovery is broken:** Tourists and even locals struggle to find farm stands despite their abundance
2. **Facebook is the incumbent:** Most farms use FB but it's not designed for discovery
3. **Seasonality matters:** Hours and availability change frequently—static directories fail
4. **Trust is local:** Farms want to be associated with trusted local brand, not national platform
5. **Simplicity wins:** Farmers won't use complex tools; SMS updates may be more valuable than apps

### 7.2 Recommended Positioning
> **"Ashtabula's Real-Time Farm Finder"**
- Focus on **real-time hours** (not just addresses)
- Emphasize **tourist discovery** (visitor-friendly)
- Lead with **free** for farmers (remove friction)
- Build **local brand** (not generic national tool)

### 7.3 Success Metrics
- **Month 1:** 5 farms onboarded, basic listings live
- **Month 3:** 15 farms, 500 monthly users
- **Month 6:** 25 farms, 2,000 monthly users, 1 paid conversion
- **Month 12:** 40 farms, 5,000 monthly users, 10 paid subscribers

---

## 8. Open Questions for Phase 2 Outreach

1. Do farmers currently pay for any listing services?
2. How do they currently update customers on hours/availability?
3. What would make them check a platform daily?
4. Are they interested in taking pre-orders via the platform?
5. Do they participate in any cooperative marketing efforts?

---

*Document prepared for Phase 2: Resource Procurement & Outreach*
