# New Ashtabula Initiative (NAI)

**75 public MVP routes currently tracked in the canonical map, with a major transformation sprint completed and production healthy.**

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://newashtabula.vercel.app)
[![Routes](https://img.shields.io/badge/routes-75-blue?style=flat-square)]()
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

**See all public routes:** [SITEMAP.md](SITEMAP.md)

---

## 📊 Stats

| Metric | Value |
|--------|-------|
| **Public Routes in `SITEMAP.md`** | 75 |
| **Categories** | 8 (GovTech, Business, Services, Tourism, etc.) |
| **Build Status** | Production deploy healthy |
| **Platform** | Vercel |
| **Architecture** | Main landing + MVP subpaths |

Current canonical route count is `75`, with `SITEMAP.json` as the machine-readable source of truth and `SITEMAP.md` as the rendered human reference.

Canonical sitemap workflow:
- `SITEMAP.json` is the machine-readable source of truth
- `SITEMAP.md` is the human-readable rendered reference
- use `./nai sitemap-validate` and `./nai sitemap-render-md` when changing sitemap data

Saybrook request lane:
- `Qdrant` stores the zoning-code retrieval vectors
- `SQLite` stores the request-intake records
- run `./nai saybrook-request-api --host 0.0.0.0 --port 18765` to serve the local request writer
- the request intake workflow posts to `http://host.docker.internal:18765/saybrook-zoning-request` by default
- the local queue DB lives at `data/saybrook-zoning-requests.db`
- the live Saybrook experience is an interaction-first municipal workstation with a CivicSidebar, a right-side chat canvas, and an IntakeDrawer for official submission
- the township seal remains as a contained trust anchor, not a competing hero element

Tooling awareness:
- `NAI_TOOLCHAIN.json` is the structured registry for which scripts are core, support, or legacy
- `NAI_TOOLCHAIN.md` is the human-readable rendered view
- run `./nai tooling` when you want a refreshed script inventory

---

## 🎯 Product + Brand Doctrine

Each MVP has two equally important jobs:

- **Product quality**: it has to work, feel polished, and solve the intended problem.
- **Buyer-specific branding**: it has to clearly speak to a real target buyer or customer.

A site is only truly done when both are solid. Strong branding cannot rescue a broken product, and a strong product without a buyer is still unfinished.

If an MVP can legitimately serve more than one qualified buyer, it is okay to clone it and brand separate versions for each buyer instead of forcing one generic site to cover everyone.

Use the visual QA report and the buyer research docs together:

- `visual_analysis_report.json` helps decide whether the product itself needs code, layout, or polish work.
- `LEAD_RESEARCH_REPORT.md` and `SITE_PROSPECT_MAPPING.md` help decide who the target buyer should be.

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
└── /{mvp}/              ← 68 additional MVPs
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
├── 📦 nai_suite/                   # Internal NAI suite implementation modules
│
├── 🏠 landing-page/                # Main landing page
├── 🌐 websites/                    # Source-owned MVP websites
│   ├── civic-insight-engine/
│   ├── invest-ashtabula/
│   ├── permit-whisperer/
│   └── ... (74 more)
│
├── 📁 archive/                     # Old/consolidated files
├── 📁 lead_research_json/          # Top-2 buyer research JSONs (source leads)
├── 📁 brandkits/                   # Brandkit JSONs (buyer-aligned branding)
├── 📁 email_prospects/             # Outreach-ready email JSONs + exports
└── 📁 outreach-tracking/           # Sales contact data
```

### Repo Boundaries

- `websites/` is the source tree for the individual MVP apps.
- `shared/` contains reusable code that multiple MVPs can import.
- `landing-page/` contains the main marketing/landing site.
- `research/`, `outreach/`, `reports/`, and similar folders are project work products, not app source.
- `archive/` is for older or retired material that should stay out of the active workflow.
- Generated deploy output such as `.vercel/`, `dist/`, and screenshots should be treated as derived artifacts.

When in doubt, edit the app source in `websites/` first, and only touch shared or generated areas if the change truly applies across multiple MVPs.

The root now keeps the top-level operator entrypoints relatively thin. Most of the internal NAI suite implementation lives under `nai_suite/`, while `nai`, `deploy.sh`, and the canonical docs stay easy to find at the root.

---

## 📦 Research + Outreach Data Outputs

**Primary data directories:**
- `lead_research_json/` → Top‑2 lead research per MVP (source of buyer targets)
- `brandkits/` → Brandkit JSONs derived from real buyer branding research
- `email_prospects/` → Outreach‑ready email files + exports

### Email Prospects Schema (per MVP)
Each MVP has a `{mvp_slug}_emails.json` file in `email_prospects/` with this required shape:
```json
{
  "mvp": "<slug>",
  "research_date": "YYYY-MM-DD",
  "target_buyers": [
    {
      "rank": 1,
      "organization": "<name>",
      "website": "<url>",
      "why_target": "<short rationale>",
      "contacts": [
        {"name": "<person>", "title": "<title>", "email": "<email>", "phone": "<phone?>", "notes": "<optional>"}
      ]
    },
    {
      "rank": 2,
      "organization": "<name>",
      "website": "<url>",
      "why_target": "<short rationale>",
      "contacts": [
        {"name": "<person>", "title": "<title>", "email": "<email>", "phone": "<phone?>", "notes": "<optional>"}
      ]
    }
  ],
  "sources": ["<url>", "<url>"]
}
```

**Exports available in `email_prospects/`:**
- `MIN_110_EMAILS_v5.csv/.json` → 2 leads per MVP (110 rows; may include phone‑only rows)
- `MIN_110_EMAILS_WITH_EMAILS_ONLY.csv/.json` → Email‑only subset
- `PHONE_ONLY_LEADS.csv/.json` → Missing‑email rows for phone outreach

---

## 📚 Documentation

### 🚀 Start Here

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | 📖 Project overview (this file) |
| [SESSION_HANDBOOK.md](SESSION_HANDBOOK.md) | 🧠 Current project memory + target mapping |
| [ARTIFACT_PIPELINE.md](ARTIFACT_PIPELINE.md) | 🧩 Canonical artifact chain + generation order |
| [SWARM_KICKOFF.md](SWARM_KICKOFF.md) | 🐝 Codex worker swarm operating brief |
| [MEMORY_PROTOCOL.md](MEMORY_PROTOCOL.md) | 🧠 Mem0 memory rules, stable IDs, and restart behavior |
| [AGENTS.md](AGENTS.md) | 🤖 Project-specific guidance for agents |
| [.codex/config.toml](.codex/config.toml) | ⚙️ Project Codex swarm config and role limits |
| [MONOREPO_PROTOCOL.md](MONOREPO_PROTOCOL.md) | 🧭 Short monorepo workflow rules |
| [REPO_GOVERNANCE_AND_DECOMMISSION_PLAN.md](REPO_GOVERNANCE_AND_DECOMMISSION_PLAN.md) | 🧹 Active cleanup + retirement plan |
| [SITEMAP.md](SITEMAP.md) | 📍 Complete site directory & URLs |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | 📊 Current status dashboard |

### 🎯 Sales & Business Development

| Document | Purpose |
|----------|---------|
| [SALES_OUTREACH_BIBLE.md](SALES_OUTREACH_BIBLE.md) | 🎯 **PRIMARY** — Complete sales playbook (templates, scripts, pricing) |
| [LEAD_RESEARCH_REPORT.md](LEAD_RESEARCH_REPORT.md) | 🔍 Deep buyer research across the portfolio |
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

# Start with the scan
./nai scan

# Then use the workflow command
./nai deploy

# Or manual deployment
vercel --prod
```

### Use The Friendly Wrapper

```bash
./nai hub
```

This opens a lightweight local control room in your browser for the most common NAI commands, with live logs and without needing to remember flags.

### Understand The Script Surface

```bash
./nai tooling
```

This refreshes the human-readable tooling registry and prints the current `core / support / legacy` classification for repo scripts.

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

This overwrites the local `sitemap_screenshots/` gallery from scratch with one image per site so you can visually track progress while you work.

To watch the live production deployment in the browser, use:

```bash
./nai screenshots --live --headed --linger 1
```

When you run `./nai screenshots --live`, the command also writes a rolling pre-run snapshot of `sitemap_screenshots/` to the sibling folder `../.sitemap_screenshots_snapshot/previous` so you can compare the current gallery state against the last live-capture starting point without building an archive.

To browse the live production URLs without taking screenshots, use:

```bash
./nai browse
```

This opens each live page in a visible browser and lingers briefly so you can see what the public site actually looks like. The default linger is now shorter so the pass runs faster unless you ask for a longer pause.

To generate a structured visual QA report from those screenshots, use:

```bash
./nai analyze-screenshots --limit 3
```

By default it writes `sitemap_screenshots/visual_analysis_report.json`.
Each analysis run also leaves behind a lightweight timestamped archive of the non-image outputs in `../.sitemap_screenshots_analysis_archive/` so you can compare report history without storing duplicate screenshots.

To build the score-focused progress dashboard from the archived JSON reports, use:

```bash
./nai progress
```

That writes `sitemap_screenshots/progress.html` and `sitemap_screenshots/progress_data.json`.

Use `--quality deep` when you want a more detailed OpenRouter vision pass:

```bash
./nai analyze-screenshots --quality deep
```

The default fast preset uses `google/gemini-3.1-flash-lite-preview`; the deep preset uses `google/gemini-3.1-pro-preview` unless you override it with `--model`, `OPENROUTER_MODEL_FAST`, or `OPENROUTER_MODEL_DEEP`.
Fast runs use lighter reasoning by default, while deep runs turn reasoning up so the model is more careful about layout and branding judgments.
Candidate target/buyer entities are now web-verified during analysis runs unless you disable that with `--no-verify-targets`. Use `--verify-targets` / `--no-verify-targets` to control that pass.

For a quick product-vs-buyer triage pass, use:

```bash
python visual_report_summary.py
```

That summary now includes a simple target/buyer mapping so you can quickly tell which MVPs are already clearly tied to a buyer and which ones still need target-definition work.
The analyzer now also asks the vision model to explicitly name the target brand entity when it is clear, or mark the site as needing research when it is not.

For a narrower re-check on a small set of sites, use:

```bash
./nai focus-analyze --slugs compassionate farm-stand
```

For a branding-only refresh that reuses the current report as the baseline and only updates branding/target fields, use:

```bash
./nai branding-pass --slugs compassionate farm-stand
```

Both of these modes are meant to save money by avoiding a full-gallery rerun when you only need to revisit a few branding judgments.

### Single-Site Edit Cheat Sheet

If you just want to change one MVP and ship it live, use this loop:

1. Find the slug in [`SITEMAP.md`](SITEMAP.md).
2. Edit only that app under [`websites/<site-name>/`](websites/).
3. Build that site locally with `npm run build`.
4. Check it in the browser with `./nai screenshots --live` or `./nai browse`.
5. Deploy with `./nai deploy` when it looks right.

If the change affects shared behavior, move it into [`shared/`](shared/) or [`siteflow.py`](siteflow.py) instead of duplicating it inside one app.
If the site is already clearly branded, keep the slug and tighten the presentation. If it still needs target research, do that before trying to “finish” the branding.

### Agent Workflow

When an AI agent is assigned to one MVP, follow this order:

1. Find the route in [`SITEMAP.md`](SITEMAP.md).
2. Map the slug to the correct folder under [`websites/`](websites/).
3. Edit only that app unless the bug is shared across multiple sites.
4. If the issue is shared, fix the common code in [`shared/`](shared/) or [`siteflow.py`](siteflow.py).
5. Do not edit generated `dist/` output by hand.
6. Do not treat `node_modules/` or `.vercel/` as source.
7. Do not use external task trackers as canonical portfolio metadata.
8. Use [`./nai scan`](nai) to confirm the site path, build root, and shim status.
9. Use [`./nai routes`](nai) if the route map changed.
10. Use [`./nai deploy`](nai) when you are ready to publish production.

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

- ✅ Major transformation sprint completed across a large batch of MVPs
- ✅ Production deploy path verified today
- ✅ Landing page and core route system healthy
- 🟡 Canonical docs still need final reconciliation
- ✅ retired canonical ghosts were scrubbed from the live sitemap and active workflow surface
- 🟡 Next phase is live verification plus documentation cleanup

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
<strong>One portfolio. One mission: empower the community with real, usable digital tools.</strong>
</p>
