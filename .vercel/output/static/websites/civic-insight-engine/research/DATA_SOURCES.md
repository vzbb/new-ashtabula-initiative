# Civic Insight Engine — Data Sources & API Resources

## Date: 2025-02-17

---

## 1. Primary Data Sources

### Ohio Checkbook (Financial Transparency)
- **URL:** https://checkbook.ohio.gov/
- **Data:** State and local government spending, revenue allocation
- **Access:** Public web interface, limited API
- **Value:** Provides Ashtabula Area City School District data already
- **Integration Approach:** 
  - Scrape or iframe embed for specific township views
  - Link to pre-filtered views for transparency
- **Rate Limits:** Unknown, treat as static reference

### Ashtabula County Government Website
- **URL:** https://www.ashtabulacounty.us/
- **Data:** Meeting schedules, documents, department contacts
- **Access:** Public website (CivicEngage platform)
- **Integration Approach:**
  - RSS feeds for news/updates (if available)
  - iCal feeds for meeting calendars
  - Link to document repositories
- **Contact:** County Commissioners Office for data sharing agreement

### Individual Township Websites
- **Coverage:** 27 townships in Ashtabula County
- **Data:** Meeting minutes, zoning decisions, permits
- **Challenge:** Each uses different platforms (some have no website)
- **Integration Approach:**
  - Manual collection for high-priority townships
  - Email alerts to clerks for upload workflow
  - PDF parsing pipeline for standard formats

---

## 2. Geospatial Data

### OpenStreetMap
- **URL:** https://www.openstreetmap.org/
- **Data:** Streets, boundaries, points of interest
- **License:** ODbL (Open Database License)
- **API:** Overpass API for queries
- **Use Cases:**
  - Issue location mapping
  - Township boundary visualization
  - Routing for service requests

### US Census Bureau TIGER/Line
- **URL:** https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html
- **Data:** Township boundaries, demographic data
- **Format:** Shapefile, GeoJSON
- **Use Cases:**
  - Population maps
  - Service area planning

### Ashtabula County GIS
- **URL:** https://www.ashtabulacounty.us/252/GIS
- **Data:** Parcels, zoning, flood zones
- **Access:** Public GIS viewer, limited download
- **Contact:** GIS Department for data access

---

## 3. AI/ML Services

### Google Gemini API
- **Current Usage:** Meeting summarization
- **Model:** gemini-1.5-flash
- **Cost:** Free tier available, pay-as-you-scale
- **Capabilities:**
  - Text summarization
  - PDF document analysis
  - Multi-language support
- **API Key:** Environment variable `VITE_GEMINI_API_KEY`

### Alternative: OpenAI GPT-4o-mini
- **Pros:** More mature API, better JSON mode
- **Cons:** Higher cost
- **Fallback:** Implement provider abstraction

---

## 4. Communication Services

### Email (SMTP)
- **For:** Notifications, newsletters, issue updates
- **Options:**
  - SendGrid (free tier: 100 emails/day)
  - Mailgun (free tier: 5k emails/month)
  - Self-hosted (Postfix)

### SMS (Future)
- **For:** Urgent notifications
- **Options:**
  - Twilio (pay-per-message)
  - AWS SNS

---

## 5. Deployment Infrastructure

### Firebase (Recommended)
- **Hosting:** Free tier, custom domain support
- **Firestore:** Real-time database for issues/comments
- **Authentication:** Anonymous + email link auth
- **Functions:** Serverless for Gemini API proxy
- **Storage:** PDF/document storage

### Alternative: Self-hosted
- **Hosting:** Netlify or Vercel
- **Database:** Supabase (PostgreSQL)
- **Storage:** MinIO or cloud

---

## 6. Data Collection Workflow

### Phase 1: Manual Collection
Township clerk uploads PDF minutes → AI processes → Published to dashboard

### Phase 2: Automated Collection
Email alerts to clerk → Clerk confirms/corrects AI summary → Auto-publish

### Phase 3: Full Integration
Direct integration with township document management systems

---

## 7. Contact List for Data Access

| Entity | Contact Type | Purpose |
|--------|--------------|---------|
| Ashtabula County Commissioners | Official | Endorsement, data sharing |
| County GIS Department | Technical | GIS data access |
| Individual Township Clerks | Operational | Meeting minutes workflow |
| Ohio Treasurer's Office | State | Ohio Checkbook API info |

---

## 8. Data Privacy Considerations

- **Public Data:** Meeting minutes, budgets, public records = safe to publish
- **Sensitive Data:** Resident contact info (opt-in only)
- **Anonymous Issues:** Allow residents to report without account
- **Retention:** Auto-archive old summaries based on retention policy

---

**Resource Status:** Ready for SPEC.md architecture design.
