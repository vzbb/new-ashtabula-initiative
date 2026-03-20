# New Ashtabula Initiative (NAI)

**81 AI-powered applications transforming how our community lives, works, and connects.**

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://newashtabula.vercel.app)
[![Sites](https://img.shields.io/badge/sites-81-blue?style=flat-square)]()
[![Status](https://img.shields.io/badge/status-live-success?style=flat-square)]()

---

## 🚀 Live Demo

**Main Landing Page:** https://new-ashtabula-initiative.vercel.app

**Featured MVPs:**
- 🏛️ [Civic Insight Engine](https://new-ashtabula-initiative.vercel.app/civic-insight/) — AI-powered municipal transparency
- 📈 [Invest Ashtabula](https://new-ashtabula-initiative.vercel.app/invest/) — Economic development showcase
- 📋 [Permit Whisperer](https://new-ashtabula-initiative.vercel.app/permits/) — AI-guided permit assistant
- 🛒 [Local Grocer Go](https://new-ashtabula-initiative.vercel.app/grocer/) — Local food marketplace
- 🔧 [Contractor Match](https://new-ashtabula-initiative.vercel.app/contractors/) — Verified contractor finder

**See all 81 sites:** [SITEMAP.md](SITEMAP.md)

---

## 📊 Stats

| Metric | Value |
|--------|-------|
| **Total Solutions** | 81 |
| **Categories** | 8 (GovTech, Business, Services, Tourism, etc.) |
| **Build Status** | Live |
| **Platform** | Vercel |
| **Architecture** | Main landing + MVP subpaths |

---

## 🏗️ Architecture

```
new-ashtabula-initiative.vercel.app/
├── /                    ← Main landing page
├── /civic-insight/      ← Civic Insight Engine (GovTech)
├── /invest/             ← Invest Ashtabula (Economic Dev)
├── /permits/            ← Permit Whisperer (GovTech)
├── /grocer/             ← Local Grocer Go (Services)
├── /contractors/        ← Contractor Match (Services)
├── /parts/              ← Parts Finder (Auto)
├── /plating/            ← Plating Tracker (Manufacturing)
├── /eligibility/        ← Eligibility Screener (GovTech)
├── /harbor/             ← Harbor Cam Dashboard (Tourism)
└── /{mvp}/              ← 71 additional MVPs
```

---

## 📁 Project Structure

```
new-ashtabula-initiative/
├── 📄 README.md                    # This file
├── 📄 SITEMAP.md                   # Complete site directory
├── 📄 PROJECT_STATUS.md            # Current project status
├── 📄 DOCUMENTATION_INDEX.md       # Find any document
│
├── 🎯 SALES_OUTREACH_BIBLE.md      # Sales playbook (consolidated)
├── 🎯 LEAD_RESEARCH_REPORT.md      # Buyer research & personas
├── 🗺️ SITE_PROSPECT_MAPPING.md     # Site-to-buyer assignments
│
├── 🚀 DEPLOYMENT.md                # Deployment guide
├── ⚙️ vercel.json                  # Vercel routing config
├── 🔧 deploy.sh                    # Deployment automation
│
├── 🏠 landing-page/                # Main landing page
├── 🌐 websites/                    # All 81 MVP websites
│   ├── civic-insight-engine/
│   ├── invest-ashtabula/
│   ├── permit-whisperer/
│   └── ... (65 more)
│
├── 📁 archive/                     # Old/consolidated files
└── 📁 outreach-tracking/           # Sales contact data
```

---

## 📚 Documentation

### 🚀 Start Here

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | 📖 Project overview (this file) |
| [AGENTS.md](AGENTS.md) | 🤖 Project-specific guidance for agents |
| [MONOREPO_PROTOCOL.md](MONOREPO_PROTOCOL.md) | 🧭 Short monorepo workflow rules |
| [SITEMAP.md](SITEMAP.md) | 📍 Complete site directory & URLs |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | 📊 Current status dashboard |

### 🎯 Sales & Business Development

| Document | Purpose |
|----------|---------|
| [SALES_OUTREACH_BIBLE.md](SALES_OUTREACH_BIBLE.md) | 🎯 **PRIMARY** — Complete sales playbook (templates, scripts, pricing) |
| [LEAD_RESEARCH_REPORT.md](LEAD_RESEARCH_REPORT.md) | 🔍 Deep buyer research for all 81 MVPs |
| [SITE_PROSPECT_MAPPING.md](SITE_PROSPECT_MAPPING.md) | 🗺️ Site-to-prospect assignments |
| [THE_CLOSER_IRRESISTIBLE_OFFERS.md](THE_CLOSER_IRRESISTIBLE_OFFERS.md) | 💎 Offer psychology & personalization |

### 🏗️ Technical

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | 🚀 Deployment guide |


### 📖 Navigation

| Document | Purpose |
|----------|---------|
| [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) | 📚 Index of all docs (including archived) |

---

## 🎯 Sales Quick Start

**Hot Prospects (Call This Week):**

| Prospect | Phone | Assigned Sites | Budget |
|----------|-------|----------------|--------|
| City Building Dept | 440-992-7115 | 18 gov sites | $5K-$25K |
| Chamber of Commerce | 440-998-4741 | 23 business sites | $10K-$40K |
| Lakeland SBDC | 440-525-7450 | 12 SBDC sites | $5K-$25K |
| County Commissioners | TBD | 15 county sites | $10K-$50K |

**See [SALES_OUTREACH_BIBLE.md](SALES_OUTREACH_BIBLE.md) for:**
- Complete email templates
- Demo scripts & talk tracks
- Pricing & packaging
- Objection handling

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Vercel CLI: `npm i -g vercel`
- Vercel account and login

### Deploy to Production

```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative

# Use the workflow command
./nai deploy

# Or manual deployment
vercel --prod
```

### Build Individual Sites

```bash
cd websites/{site-name}
npm install
npm run build
```

### Track Progress

```bash
./nai screenshots
```

### Agent Workflow

When an AI agent is assigned to one MVP, follow this order:

1. Find the route in [`SITEMAP.md`](SITEMAP.md).
2. Map the slug to the correct folder under [`websites/`](websites/).
3. Edit only that app unless the bug is shared across multiple sites.
4. If the issue is shared, fix the common code in [`shared/`](shared/) or [`siteflow.py`](siteflow.py).
5. Do not edit generated `dist/` output by hand.
6. Do not treat `node_modules/` or `.vercel/` as source.
7. Use [`./nai scan`](nai) to confirm the site path, build root, and shim status.
8. Use [`./nai routes`](nai) if the route map changed.
9. Use [`./nai deploy`](nai) when you are ready to publish production.

Rules of thumb:

- Prefer source fixes over one-off deploy hacks.
- Rebuild only the site you changed unless you touched shared code.
- If a page looks blank, check the built `dist/index.html`, the active `vercel.json`, and the deploy target.
- Treat [`SITEMAP.md`](SITEMAP.md) as the source of truth for live routes.

---

## 🛠️ Technology Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API
- **Deployment:** Vercel
- **Build:** Node.js + npm

---

## 📈 Development Status

- ✅ 81/81 sites built and live
- ✅ Vercel configuration complete
- ✅ Landing page ready
- ✅ Sales materials complete
- ✅ Documentation consolidated
- 🟡 Outreach starting

---

## 🤝 Contributing

This is a showcase project by [Noirsys AI](https://noirsys.com) demonstrating AI-powered community solutions.

---

## 📝 License

Proprietary — All rights reserved by Noirsys AI.

---

## 🙏 Acknowledgments

Built with care for the Ashtabula community.

**Questions?** Contact: Michael A. Vega, Noirsys AI  
**Sales:** michael@noirsys.com | 440-555-NAI1

---

<p align="center">
<strong>81 Solutions. One Mission: Empower Our Community.</strong>
</p>
