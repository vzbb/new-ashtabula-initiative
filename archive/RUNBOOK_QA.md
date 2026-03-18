# NAI QA Runbook

## New Ashtabula Initiative - Quality Assurance Phase

**Status:** ACTIVE per HEARTBEAT.md  
**Sites:** 68 deployed on Vercel  
**Base URL:** https://newashtabula.vercel.app  
**Last Updated:** 2026-03-02

---

## 🎯 QA Phase Objectives (per HEARTBEAT.md)

### Phase 1: Site Audit
- [x] Automated scan for broken links
- [x] Mobile responsiveness validation (375px, 768px, 1920px)
- [x] WCAG accessibility compliance check
- [x] Performance audit (load times, bundle sizes)
- [ ] Cross-browser testing

### Phase 2: Critical Fixes
- [ ] Fix broken functionality
- [ ] Resolve mobile layout issues
- [ ] Ensure all forms work
- [ ] Verify API integrations
- [ ] Standardize navigation patterns

### Phase 3: Polish & Consistency
- [ ] Brand consistency across all 68 sites
- [ ] Color/contrast compliance
- [ ] Typography standardization
- [ ] Image optimization
- [ ] SEO meta tags

### Phase 4: Validation
- [ ] Manual spot-checks on priority sites
- [ ] Demo flow verification
- [ ] Mobile-first validation

---

## 🚀 QA Suite Usage

### Quick Start

```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative

# Quick check (5 sample sites)
python3 nai_qa_suite.py --quick-check

# Full audit of all 68 sites
python3 nai_qa_suite.py --full-audit

# Audit Tier 1 sites only (demo-critical)
python3 nai_qa_suite.py --tier 1

# Save all report formats
python3 nai_qa_suite.py --full-audit --save-all
```

### Report Formats

| Format | Command | Output |
|--------|---------|--------|
| Console | `--report console` | Rich terminal output |
| JSON | `--report json --save` | Machine-readable data |
| CSV | `--report csv --save` | Spreadsheet import |
| Markdown | `--report markdown --save` | Human-readable report |

---

## 📊 Scoring Methodology

### Mobile Responsiveness (0-100)
- **Viewport meta tag:** -30 if missing
- **Responsive CSS patterns:** -20 if none detected
- **Fixed-width elements:** -10 if excessive

### Accessibility/WCAG 2.1 AA (0-100)
- **Images without alt text:** -5 per image (max -20)
- **Form inputs without labels:** -3 per input (max -15)
- **Missing H1 heading:** -10
- **Multiple H1 headings:** warning
- **Missing lang attribute:** -5

### Performance (0-100)
- **Page size > 2MB:** -20
- **Page size > 1MB:** -10
- **Load time > 5s:** -25
- **Load time > 3s:** -15

---

## 🏆 Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Sites passing QA | 68/68 | TBD |
| Critical issues | 0 | TBD |
| Mobile score | >90 | 80 avg |
| Accessibility | WCAG 2.1 AA | 90 avg |
| Performance | <3s load | 100 avg |

---

## 🎯 Tier 1 Sites (Priority)

Per HEARTBEAT.md, audit these first:

1. **City of Ashtabula Building Dept**
2. **Ashtabula Area Chamber of Commerce**
3. **Lakeland SBDC**
4. **Ashtabula County Commissioners**

---

## 🔧 Common Issues & Fixes

### Issue: Missing H1 Heading
**Impact:** Accessibility -10  
**Fix:** Add `<h1>` tag to each page with main heading

### Issue: No Responsive CSS Patterns
**Impact:** Mobile -20  
**Fix:** Add `@media` queries or Tailwind responsive classes

### Issue: Large Page Size
**Impact:** Performance -10 to -20  
**Fix:** Optimize images, lazy loading, code splitting

---

## 📁 QA Artifacts

| File | Purpose |
|------|---------|
| `nai_qa_suite.py` | Main QA automation tool |
| `NAI_QA_REPORT_*.json` | JSON data export |
| `NAI_QA_REPORT_*.csv` | Spreadsheet data |
| `NAI_QA_REPORT_*.md` | Human-readable report |
| `RUNBOOK.md` | This document |

---

## 🔄 QA Workflow

1. **Run audit:** `python3 nai_qa_suite.py --full-audit --save-all`
2. **Review report:** Check `NAI_QA_REPORT_*.md`
3. **Identify issues:** Focus on sites with scores <80
4. **Create fix tickets:** Document in BACKLOG.md
5. **Fix & re-audit:** Run suite again after fixes
6. **Validate:** Confirm all Tier 1 sites pass

---

## ⚠️ Out of Scope

Per HEARTBEAT.md directive:
- **Outreach suspended** until QA complete
- **No demos** until sites are pitch-ready
- Focus on technical quality only

---

**Next Action:** Run full audit and document critical issues for Phase 2 fixes.
