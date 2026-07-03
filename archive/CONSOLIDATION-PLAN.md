# Project Consolidation Plan

**Generated:** 2026-03-15 11:31
**Project:** Unknown

---

## Current State

- **Total markdown files:** 1218
- **Versioned files:** 6
- **Potential duplicates:** 697
- **Categories detected:** 18
- **Business Portfolio:** Yes
- **Website doc issues:** 3

## Recommendations

### 1. 🔴 Archive 6 versioned files

**Priority:** HIGH
**Type:** archive_versioned

**Files affected:**
- `.vercel/output/static/P0-BUILD-SCHEDULE-v0.1.md`
- `.vercel/output/static/websites/invest-ashtabula/COMPETITIVE-ANALYSIS-v0.1.md`
- `.vercel/output/static/websites/invest-ashtabula/PHASE2-SPEC-REFINEMENT-v0.1.md`
- `P0-BUILD-SCHEDULE-v0.1.md`
- `websites/invest-ashtabula/COMPETITIVE-ANALYSIS-v0.1.md`
- `websites/invest-ashtabula/PHASE2-SPEC-REFINEMENT-v0.1.md`

### 2. 🔴 Reduce 113 markdown files in root directory

**Priority:** HIGH
**Type:** reduce_root_clutter

### 3. 🟡 Review 697 potential duplicate files

**Priority:** MEDIUM
**Type:** review_duplicates

**Files affected:**
- `('.vercel/output/static/websites/adaptive-reuse-planner/README.md', '.vercel/output/static/websites/ai-docent/README.md')`
- `('.vercel/output/static/websites/adaptive-reuse-planner/README.md', '.vercel/output/static/websites/ai-docent-pro/README.md')`
- `('.vercel/output/static/websites/adaptive-reuse-planner/README.md', '.vercel/output/static/websites/aidflow-navigator/README.md')`
- `('.vercel/output/static/websites/adaptive-reuse-planner/README.md', '.vercel/output/static/websites/artist-commission-form/README.md')`
- `('.vercel/output/static/websites/adaptive-reuse-planner/README.md', '.vercel/output/static/websites/auto-detail-booking/README.md')`
- `('.vercel/output/static/websites/adaptive-reuse-planner/README.md', '.vercel/output/static/websites/blueprint-analyzer/README.md')`
- `('.vercel/output/static/websites/adaptive-reuse-planner/README.md', '.vercel/output/static/websites/boat-storage-waitlist/README.md')`
- `('.vercel/output/static/README.md', '.vercel/output/static/websites/boat-storage-waitlist/SPEC.md')`
- `('.vercel/output/static/websites/boat-storage-waitlist/PROJECT.md', '.vercel/output/static/websites/box-builder/PROJECT.md')`
- `('.vercel/output/static/websites/adaptive-reuse-planner/README.md', '.vercel/output/static/websites/box-builder/README.md')`
- ... and 687 more

### 4. 🔴 Archive 71 batch processing reports

**Priority:** HIGH
**Type:** archive_batch_reports

**Files affected:**
- `.vercel/output/static/BATCH_1_COMPLETE.md`
- `.vercel/output/static/BATCH_1_REPORT.md`
- `.vercel/output/static/DEPLOY_READINESS_REPORT.md`
- `.vercel/output/static/FINAL_BATCH_COMPLETE.md`
- `.vercel/output/static/INDIVIDUAL_DESIGN_BATCH4.md`
- `.vercel/output/static/IRRESISTIBLE_OFFER_BATCH_REPORT.md`
- `.vercel/output/static/PITCH_READINESS_REPORT.md`
- `.vercel/output/static/PROJECT_STATUS_REPORT.md`
- `.vercel/output/static/WEBSITE_ANALYSIS_REPORT.md`
- `.vercel/output/static/WEBSITE_VERIFICATION_REPORT.md`
- ... and 61 more

### 5. 🟡 Consolidate 28 branding files

**Priority:** MEDIUM
**Type:** consolidate_branding

**Files affected:**
- `.vercel/output/static/AUTHENTIC_BRANDING_RESEARCH.md`
- `.vercel/output/static/BRANDING_PROGRESS_CHAMBER.md`
- `.vercel/output/static/BRANDING_PROGRESS_COUNTY.md`
- `.vercel/output/static/BRANDING_PROGRESS_SBDC.md`
- `.vercel/output/static/BRAND_CHAMBER_OF_COMMERCE.md`
- `.vercel/output/static/BRAND_CITY_OF_ASHTABULA.md`
- `.vercel/output/static/BRAND_LAKELAND_SBDC.md`
- `.vercel/output/static/TARGET_BUYER_BRAND_RESEARCH.md`
- `.vercel/output/static/websites/BRAND_ASHTABULA_COUNTY.md`
- `AUTHENTIC_BRANDING_RESEARCH.md`
- ... and 18 more

### 6. 🟡 Clean up documentation in 3 website directories

**Priority:** MEDIUM
**Type:** cleanup_website_docs

---

## Proposed Structure (Business Portfolio)

```
new-ashtabula-initiative/
├── README.md                    # Portfolio overview
├── PORTFOLIO.md                 # Website catalog & status
├── SALES_STRATEGY.md            # Sales approach & targets
├── OUTREACH.md                  # Outreach playbook
├── DEPLOYMENT.md                # Deployment procedures
│
├── websites/                    # Website projects
│   ├── harbor-cam-dashboard/    # Each website:
│   │   ├── README.md            #   Website overview
│   │   ├── PITCH.md             #   Sales pitch
│   │   ├── SPEC.md              #   Technical spec
│   │   ├── CONTEXT.md           #   Project context
│   │   ├── BACKLOG.md           #   Tasks & progress
│   │   ├── src/                 #   Source code
│   │   ├── dist/                #   Build output
│   │   └── archive/             #   Old research/docs
│   ├── ai-docent/
│   ├── permit-whisperer/
│   └── ... (80+ more)
│
└── archive/                     # Portfolio-level archive
    ├── batch-reports/           # Batch processing reports
    ├── branding-research/       # Branding documents
    ├── process-docs/            # Checklists, guides, workflows
    └── completed-websites/      # Finished & delivered sites
```

### Website Documentation Standards

**Keep in root (5 files max):**
- `README.md` - Overview & quick links
- `PITCH.md` - Sales pitch for client
- `SPEC.md` - Technical specification
- `CONTEXT.md` - Business context & goals
- `BACKLOG.md` - Current tasks & status

**Move to archive/:**
- `PHASE1-RESEARCH.md` - Initial research (completed)
- `PHASE2-OUTREACH.md` - Outreach research (completed)
- `BUILD_CHECKLIST.md` - Build tracking (completed)
- `IRRESISTIBLE_OFFER_NOTES.md` - Working notes
- Any `*_COMPLETE.md` or old iteration files

## Next Steps

1. Review this plan
2. Customize if needed
3. Run consolidation
4. Verify results
