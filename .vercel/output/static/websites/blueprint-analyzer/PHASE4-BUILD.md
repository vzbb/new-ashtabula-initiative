# Phase 4 Build Checklist — Blueprint Analyzer

**Status:** Ready for Implementation  
**Priority:** MVP → Full Build  
**Estimated Time:** 4-6 hours

---

## Setup & Dependencies

### 1.1 Install Required Packages
```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/blueprint-analyzer
npm install pdfjs-dist fabric jspdf papaparse
# or if using pnpm:
pnpm add pdfjs-dist fabric jsparse papaparse
```

### 1.2 Configure PDF.js Worker
```javascript
// In main entry or vite.config.js
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
```

### 1.3 Setup Environment
```bash
# .env (do not commit)
VITE_GEMINI_API_KEY=your_key_here
```

---

## Component Architecture

### 2.1 File Structure
```
src/
├── components/
│   ├── UploadZone.jsx       # Drag-and-drop PDF upload
│   ├── PDFViewer.jsx        # Render PDF page with canvas
│   ├── ScaleSelector.jsx    # Blueprint scale detection/selection
│   ├── BOMAnalysis.jsx      # AI analysis progress/results
│   ├── BOMEditor.jsx        # Editable material list table
│   ├── PricingEditor.jsx    # Unit price inputs
│   └── ExportPanel.jsx      # CSV/PDF/Print export
├── hooks/
│   ├── usePDFParser.js      # PDF.js integration
│   ├── useGeminiAnalysis.js # Gemini API calls
│   ├── useLocalStorage.js   # Persistence
│   └── useBOMCalculator.js  # Cost calculations
├── utils/
│   ├── pdfToImage.js        # Convert PDF to image for AI
│   ├── bomParser.js         # Parse Gemini response
│   ├── exportCSV.js         # CSV generation
│   └── exportPDF.js         # PDF generation
├── contexts/
│   └── ProjectContext.jsx   # Global state
└── App.jsx                  # Main flow
```

---

## Implementation Steps

### Step 1: Upload & PDF Rendering (30 min)
- [ ] Create `UploadZone.jsx` with drag-and-drop
- [ ] Integrate `PDFViewer.jsx` using PDF.js
- [ ] Handle file validation (PDF, <10MB)
- [ ] Store file in IndexedDB via `useLocalStorage`

**Test:** Upload sample blueprint → preview renders

### Step 2: Scale Selection (20 min)
- [ ] Build `ScaleSelector.jsx` with common scales
- [ ] Auto-detect attempt (parse title block text via OCR)
- [ ] Manual override dropdown
- [ ] Store selected scale in state

**Test:** Scale selection updates grid overlay correctly

### Step 3: Gemini Integration (45 min)
- [ ] Create `useGeminiAnalysis.js` hook
- [ ] Convert PDF page to base64 JPEG (canvas.toDataURL)
- [ ] Build prompt for blueprint analysis
- [ ] Parse JSON response into BOM format
- [ ] Handle errors (retry, manual fallback)

**Prompt Template:**
```javascript
const PROMPT = `Analyze this residential construction blueprint.

Extract and return JSON ONLY:
{
  "rooms": [{"name": "", "dimensions": "", "sqft": 0}],
  "materials": {
    "lumber": [{"item": "", "quantity": 0, "unit": "", "notes": ""}],
    "drywall": [...],
    "flooring": [...],
    "roofing": [...],
    "insulation": [...]
  },
  "totals": {"sqft": 0, "linear_ft_walls": 0}
}

Be precise with quantities. Include waste factor of 10% in calculations.`;
```

**Test:** Sample blueprint returns valid JSON structure

### Step 4: BOM Editor (40 min)
- [ ] Build `BOMEditor.jsx` table component
- [ ] Editable quantity and unit price cells
- [ ] Add/remove rows
- [ ] Category grouping (accordion or tabs)
- [ ] Real-time subtotal calculation

**Test:** Edit quantity → total updates immediately

### Step 5: Pricing & Templates (30 min)
- [ ] Create default pricing template for Ashtabula area
- [ ] Allow user to save custom templates
- [ ] Calculate job totals with tax option
- [ ] Show cost breakdown by category

**Default Prices (Ashtabula approximate):**
```javascript
const DEFAULT_PRICES = {
  lumber: {
    '2x4 Studs (8ft)': 4.50,
    '2x6 Studs (8ft)': 6.75,
    '2x10 Joist (12ft)': 18.00,
  },
  drywall: {
    '1/2" 4x8 Sheet': 12.50,
    '5/8" 4x8 Sheet': 15.00,
  },
  // ... etc
};
```

### Step 6: Export Features (30 min)
- [ ] `exportCSV.js` — Generate CSV with PapaParse
- [ ] `exportPDF.js` — Generate formatted PDF with jsPDF
- [ ] Print stylesheet for browser print
- [ ] Export filename: `{project-name}-BOM-{date}.csv/pdf`

**Test:** Export files open correctly in Excel/Adobe Reader

### Step 7: Persistence (20 min)
- [ ] Save project to IndexedDB on changes
- [ ] List saved projects on homepage
- [ ] Load/delete projects
- [ ] Auto-save indicator

### Step 8: Polish (30 min)
- [ ] Loading states for AI analysis
- [ ] Error handling with user-friendly messages
- [ ] Responsive design (mobile-friendly)
- [ ] Empty states and help tooltips

---

## Testing Checklist

### Functional Tests
- [ ] Upload 5 different blueprint PDFs
- [ ] Verify scale detection on each
- [ ] Run AI analysis, check output structure
- [ ] Edit BOM quantities
- [ ] Export CSV and verify in Excel
- [ ] Export PDF and verify formatting
- [ ] Save project, close, reopen

### Edge Cases
- [ ] Large PDF (>5MB)
- [ ] Multi-page PDF (use page 1 only for MVP)
- [ ] Poor quality scan
- [ ] Non-blueprint PDF uploaded
- [ ] No internet connection during AI call

---

## Deployment

### Build
```bash
npm run build
```

### Deploy Options
1. **Firebase Hosting** (recommended) — Free, fast
2. **Vercel** — Free, auto-deploy from Git
3. **Netlify** — Free, drop-in build folder

### Post-Deploy
- [ ] Test on mobile device
- [ ] Share with 1-2 local contractors for feedback
- [ ] Add analytics (optional: Plausible/GA)

---

## Post-MVP Enhancements

### Phase 2 Features
- [ ] Multi-page blueprint support
- [ ] Multiple blueprint projects (combine BOMs)
- [ ] Material price lookup from Home Depot/Menards
- [ ] Ashtabula County permit requirement integration
- [ ] Share estimates via email
- [ ] Photo integration (job site photos)

### Phase 3 Features
- [ ] User accounts (save projects across devices)
- [ ] Team collaboration
- [ ] Supplier quote integration
- [ ] Mobile app (React Native/Expo)

---

**Checklist Created:** 2026-02-18  
**Next Action:** Begin Step 1 (Upload & PDF Rendering)
