# New Ashtabula Initiative (NAI)

**68 AI-powered applications transforming how our community lives, works, and connects.**

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://newashtabula.vercel.app)
[![Sites](https://img.shields.io/badge/sites-68-blue?style=flat-square)]()
[![Status](https://img.shields.io/badge/status-ready%20for%20deploy-success?style=flat-square)]()

---

## 🚀 Live Demo

**Main Landing Page:** https://newashtabula.vercel.app

**Featured MVPs:**
- 🏛️ [Civic Insight Engine](https://newashtabula.vercel.app/civic-insight/) — AI-powered municipal transparency
- 📈 [Invest Ashtabula](https://newashtabula.vercel.app/invest/) — Economic development showcase
- 📋 [Permit Whisperer](https://newashtabula.vercel.app/permits/) — AI-guided permit assistant
- 🛒 [Local Grocer Go](https://newashtabula.vercel.app/grocer/) — Local food marketplace
- 🔧 [Contractor Match](https://newashtabula.vercel.app/contractors/) — Verified contractor finder

---

## 📊 Stats

| Metric | Value |
|--------|-------|
| **Total Solutions** | 68 |
| **Categories** | 12 (GovTech, Economic, Services, Tourism, etc.) |
| **Build Status** | 67/68 ready (99%) |
| **Platform** | Vercel |
| **Architecture** | Main landing + MVP subpaths |

---

## 🏗️ Architecture

```
newashtabula.vercel.app/
├── /                    ← Main landing page
├── /civic-insight/      ← Civic Insight Engine (GovTech)
├── /invest/             ← Invest Ashtabula (Economic Dev)
├── /permits/            ← Permit Whisperer (GovTech)
├── /grocer/             ← Local Grocer Go (Services)
├── /contractors/        ← Contractor Match (Services)
├── /parts/              ← Parts Finder (Auto)
├── /plating/            ← Plating Tracker (Manufacturing)
├── /eligibility/        ← Eligibility Screener (GovTech)
├── /wine/               ← Through The Grapevine (Tourism)
├── /harbor/             ← Harbor Cam Dashboard (Tourism)
└── /{mvp}/              ← 58 additional MVPs
```

---

## 📁 Project Structure

```
new-ashtabula-initiative/
├── landing-page/
│   └── index.html              # Main landing page
├── websites/
│   ├── civic-insight-engine/   # MVP 1
│   ├── invest-ashtabula/       # MVP 2
│   ├── permit-whisperer/       # MVP 3
│   ├── ...                     # 65 more MVPs
│   └── zoning-clerk/           # MVP 68
├── vercel.json                 # Vercel routing config
├── deploy.sh                   # Deployment automation
├── DEPLOYMENT.md               # Deployment guide
├── DEPLOYMENT_STATUS.md        # Current status
├── PITCH_SITES.md              # Site tracking
├── PITCH_DECK_SNIPPETS.md      # Pitch copy
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Vercel CLI: `npm i -g vercel`
- Vercel account and login

### Deploy to Production

```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative

# Option 1: Use automation script
./deploy.sh

# Option 2: Manual deployment
vercel --prod
```

### Build Individual Sites

```bash
cd websites/{site-name}
npm install
npm run build
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Complete deployment guide |
| [DEPLOYMENT_STATUS.md](DEPLOYMENT_STATUS.md) | Current build/deploy status |
| [PITCH_SITES.md](PITCH_SITES.md) | Site tracking for pitches |
| [PITCH_DECK_SNIPPETS.md](PITCH_DECK_SNIPPETS.md) | Copy-paste pitch content |

---

## 🎯 Pitch Ready Sites

Each Tier 1 site includes:
- ✅ Full build with dist/
- ✅ 30-second demo script
- ✅ Pitch document (PITCH.md)
- ✅ One-liner description
- ✅ Problem/solution framing
- ✅ Call to action

| Site | Category | Pitch Doc | URL |
|------|----------|-----------|-----|
| Civic Insight Engine | GovTech | ✅ | /civic-insight/ |
| Invest Ashtabula | Economic | ✅ | /invest/ |
| Permit Whisperer | GovTech | ✅ | /permits/ |
| Local Grocer Go | Services | ✅ | /grocer/ |
| Contractor Match | Services | ✅ | /contractors/ |

---

## 🛠️ Technology Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API
- **Deployment:** Vercel
- **Build:** Node.js + npm

---

## 📈 Development Status

- ✅ 67/68 sites built successfully
- ✅ Vercel configuration complete
- ✅ Landing page ready
- ✅ Documentation complete
- ✅ Deployment automation ready
- ⚠️ 1 site blocked (through-the-grapevine — Remotion issue)

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

---

<p align="center">
  <strong>68 Solutions. One Mission: Empower Our Community.</strong>
</p>
