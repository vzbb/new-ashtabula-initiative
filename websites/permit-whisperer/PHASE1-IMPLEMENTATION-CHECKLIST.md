# permit-whisperer — Phase 1 Implementation Checklist

Complete step-by-step guide to build the MVP permit guide. Estimated time: 4-6 hours.

---

## Pre-Flight Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Vercel CLI installed (`npm i -g vercel`)
- [ ] Git configured with your credentials
- [ ] Reference docs open:
  - [ ] `SPEC.md` (product requirements)
  - [ ] `FEE-SCHEDULE.md` (fee calculations)
  - [ ] `FORMS-INVENTORY.md` (document references)

---

## Step 1: Project Initialization (30 min)

### 1.1 Create Next.js Project
```bash
cd ~/projects/ashtabula/
mkdir -p permit-whisperer
cd permit-whisperer
npx shadcn@latest init --yes --template next --base-color slate
```

**Verify:** Project creates without errors, see `my-app/` directory.

### 1.2 Install Dependencies
```bash
cd my-app
npm install @radix-ui/react-accordion @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-tabs class-variance-authority clsx tailwind-merge lucide-react
```

**Verify:** `node_modules/` populated, no peer dependency warnings.

### 1.3 Initialize shadcn Components
```bash
npx shadcn add button card dialog input label radio-group select separator tabs accordion
```

**Verify:** Components in `components/ui/` directory.

### 1.4 Test Dev Server
```bash
npm run dev
```

**Verify:** Open `http://localhost:3000`, see default Next.js page.

---

## Step 2: Core Page Structure (45 min)

### 2.1 Update Root Layout
Edit `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Permit Whisperer | Ashtabula Permit Guide",
  description: "Simple permit guidance for Ashtabula residents. Find what permits you need, calculate fees, and download forms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### 2.2 Create Main Page Shell
Replace `app/page.tsx`:

```typescript
import { PermitWizard } from "@/components/permit-wizard";
import { FeeCalculator } from "@/components/fee-calculator";
import { DocumentLibrary } from "@/components/document-library";
import { FAQSection } from "@/components/faq-section";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Ashtabula Permit Whisperer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find the permits you need, calculate costs, and get your project started. 
            Serving City of Ashtabula and Ashtabula County residents.
          </p>
        </section>

        {/* Wizard Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            What are you building?
          </h2>
          <PermitWizard />
        </section>

        {/* Fee Calculator */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Estimate Your Permit Costs
          </h2>
          <FeeCalculator />
        </section>

        {/* Document Library */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Permit Forms & Documents
          </h2>
          <DocumentLibrary />
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Common Questions
          </h2>
          <FAQSection />
        </section>
      </main>
      <Footer />
    </div>
  );
}
```

**Verify:** Page loads without errors, all sections render (placeholders OK).

---

## Step 3: Build Components (2.5 hours)

### 3.1 Header Component
Create `components/header.tsx`:

```typescript
import { HardHat } from "lucide-react";

export function Header() {
  return (
    <header className="bg-slate-900 text-white py-4">
      <div className="container mx-auto px-4 max-w-4xl flex items-center gap-3">
        <HardHat className="w-8 h-8 text-amber-400" />
        <div>
          <h1 className="text-xl font-bold">Permit Whisperer</h1>
          <p className="text-xs text-slate-400">Ashtabula Permit Guide</p>
        </div>
      </div>
    </header>
  );
}
```

### 3.2 Footer Component
Create `components/footer.tsx`:

```typescript
export function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 py-6 mt-12">
      <div className="container mx-auto px-4 max-w-4xl text-center text-sm">
        <p className="mb-2">
          <strong>Disclaimer:</strong> This tool provides general guidance only. 
          Always verify requirements with City of Ashtabula PCD (440-992-7115) 
          and Ashtabula County Building Department (440-576-3375).
        </p>
        <p className="text-slate-500">
          Not an official government website. Built for the Ashtabula community.
        </p>
      </div>
    </footer>
  );
}
```

### 3.3 Permit Wizard Component
Create `components/permit-wizard.tsx`:

```typescript
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Home, TreeDeciduous, Droplets, Fence, Wrench, Hammer, Trash2 } from "lucide-react";

const categories = [
  { id: "shed", label: "Shed or Garage", icon: Home },
  { id: "deck", label: "Deck or Patio", icon: TreeDeciduous },
  { id: "pool", label: "Pool or Spa", icon: Droplets },
  { id: "fence", label: "Fence", icon: Fence },
  { id: "addition", label: "Room Addition", icon: Home },
  { id: "interior", label: "Interior Remodel", icon: Wrench },
  { id: "trade", label: "Electrical/Plumbing/HVAC", icon: Hammer },
  { id: "demolition", label: "Demolition", icon: Trash2 },
];

const workflowData: Record<string, {
  title: string;
  steps: string[];
  cityPermit: boolean;
  countyPermit: boolean;
  notes: string;
}> = {
  shed: {
    title: "Shed or Garage Permit",
    steps: [
      "Verify setback requirements (contact City PCD)",
      "Apply for Zoning Permit at City PCD (if >200 sq ft)",
      "If >200 sq ft or with electric: Apply for Building Permit at County",
      "Submit site plan and construction details",
      "Pay permit fees",
      "Schedule inspections",
    ],
    cityPermit: true,
    countyPermit: true,
    notes: "No permit needed for sheds under 200 sq ft without electric.",
  },
  deck: {
    title: "Deck Permit",
    steps: [
      "Check zoning setbacks at City PCD",
      "If attached to house or >30" high: Building permit required from County",
      "Submit construction plans with footings details",
      "Pay permit fees",
      "Pass rough and final inspections",
    ],
    cityPermit: true,
    countyPermit: true,
    notes: "Decks under 30" high and not attached may not need County permit.",
  },
  pool: {
    title: "Pool or Spa Permit",
    steps: [
      "Get Zoning Permit from City PCD (fence requirements)",
      "Apply for Building Permit from County",
      "Submit pool plans and fencing details",
      "Electrical permit required for pump/filter",
      "Pay all permit fees",
      "Pass multiple inspections",
    ],
    cityPermit: true,
    countyPermit: true,
    notes: "Both City and County permits always required for pools.",
  },
  fence: {
    title: "Fence Permit",
    steps: [
      "Verify property lines and corner visibility rules",
      "Apply for Zoning Permit at City PCD",
      "Height limits: 6' rear/side, 4' front (varies by zone)",
      "Corner lots have additional visibility restrictions",
      "Pay permit fee",
    ],
    cityPermit: true,
    countyPermit: false,
    notes: "Most fences only need City Zoning Permit.",
  },
  addition: {
    title: "Room Addition Permit",
    steps: [
      "Verify setbacks with City PCD",
      "Apply for Zoning Permit from City",
      "Apply for Building Permit from County",
      "Submit architectural plans and engineering",
      "Trade permits required (electric, plumbing if applicable)",
      "Pay all permit fees",
      "Multiple inspections required",
    ],
    cityPermit: true,
    countyPermit: true,
    notes: "Always requires both City and County permits.",
  },
  interior: {
    title: "Interior Remodel Permit",
    steps: [
      "No Zoning Permit needed (interior only)",
      "Apply for Building Permit from County if structural",
      "Trade permits for electrical/plumbing/HVAC",
      "Submit scope of work",
      "Pay permit fees",
      "Schedule inspections",
    ],
    cityPermit: false,
    countyPermit: true,
    notes: "Cosmetic changes (paint, flooring) typically don't need permits.",
  },
  trade: {
    title: "Trade Permit (Electrical/Plumbing/HVAC)",
    steps: [
      "Must be performed by licensed contractor",
      "Contractor pulls permit from County",
      "Submit plans for panel upgrades/new circuits",
      "Pay permit fees",
      "Inspections required",
    ],
    cityPermit: false,
    countyPermit: true,
    notes: "Homeowners cannot pull trade permits — licensed pros only.",
  },
  demolition: {
    title: "Demolition Permit",
    steps: [
      "Apply for Demolition Permit from County",
      "Utility disconnect verification required",
      "Asbestos survey may be required for older buildings",
      "Notify adjacent property owners",
      "Pay permit fees",
    ],
    cityPermit: false,
    countyPermit: true,
    notes: "Always requires County permit. May need additional approvals.",
  },
};

export function PermitWizard() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (selected) setShowResult(true);
  };

  const handleBack = () => {
    setShowResult(false);
    setSelected(null);
  };

  if (showResult && selected) {
    const data = workflowData[selected];
    return (
      <Card className="border-2 border-slate-200">
        <CardHeader className="bg-slate-100">
          <CardTitle className="text-xl text-slate-800">{data.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 mb-6">
            <div className="flex gap-4">
              <div className={`px-4 py-2 rounded-lg font-medium ${data.cityPermit ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>
                {data.cityPermit ? '✓ City Permit Required' : 'No City Permit'}
              </div>
              <div className={`px-4 py-2 rounded-lg font-medium ${data.countyPermit ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'}`}>
                {data.countyPermit ? '✓ County Permit Required' : 'No County Permit'}
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-slate-800 mb-3">Steps to Complete:</h3>
          <ol className="list-decimal list-inside space-y-2 mb-6 text-slate-700">
            {data.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-amber-800 text-sm font-medium">⚠️ Important Note:</p>
            <p className="text-amber-700 text-sm mt-1">{data.notes}</p>
          </div>

          <Button onClick={handleBack} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-slate-200">
      <CardContent className="pt-6">
        <RadioGroup value={selected || ""} onValueChange={setSelected} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.id}>
                <RadioGroupItem value={cat.id} id={cat.id} className="peer sr-only" />
                <Label
                  htmlFor={cat.id}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 cursor-pointer transition-all hover:border-slate-300 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50"
                >
                  <Icon className="w-8 h-8 text-slate-600 peer-data-[state=checked]:text-blue-600" />
                  <span className="text-sm font-medium text-center">{cat.label}</span>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleNext} disabled={!selected} className="gap-2">
            Get Permit Info
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 3.4 Fee Calculator Component
Create `components/fee-calculator.tsx`:

```typescript
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const projectTypes = [
  { value: "residential", label: "Residential Building" },
  { value: "electrical", label: "Electrical Work" },
  { value: "plumbing", label: "Plumbing Work" },
  { value: "hvac", label: "HVAC Work" },
  { value: "demolition", label: "Demolition" },
];

export function FeeCalculator() {
  const [projectType, setProjectType] = useState("residential");
  const [projectValue, setProjectValue] = useState("");

  const calculateFees = () => {
    const value = parseFloat(projectValue) || 0;
    
    if (projectType === "residential") {
      const countyFee = value * 0.01; // 1% of project value
      const cityFee = value * 0.01;   // 1% for zoning permit
      return {
        county: Math.max(countyFee, 50), // Minimum $50
        city: Math.max(cityFee, 25),     // Minimum $25
        total: Math.max(countyFee, 50) + Math.max(cityFee, 25),
      };
    }
    
    // Trade permits (rough estimates)
    const tradeFees: Record<string, number> = {
      electrical: 75,
      plumbing: 75,
      hvac: 100,
      demolition: 150,
    };
    
    return {
      county: tradeFees[projectType] || 0,
      city: 0,
      total: tradeFees[projectType] || 0,
    };
  };

  const fees = calculateFees();

  return (
    <Card className="border-2 border-slate-200">
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-type">Project Type</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger id="project-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {projectType === "residential" && (
              <div>
                <Label htmlFor="project-value">Estimated Project Value ($)</Label>
                <Input
                  id="project-value"
                  type="number"
                  placeholder="e.g., 25000"
                  value={projectValue}
                  onChange={(e) => setProjectValue(e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Include materials and labor costs
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 mb-4">Estimated Fees</h3>
            
            {projectType === "residential" && (
              <>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">Ashtabula County Building</span>
                  <span className="font-medium">${fees.county.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">City of Ashtabula PCD</span>
                  <span className="font-medium">${fees.city.toFixed(2)}</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between py-3 font-bold text-lg">
              <span>Total Estimated</span>
              <span className="text-blue-600">${fees.total.toFixed(2)}</span>
            </div>

            <p className="text-xs text-slate-500 mt-4">
              ⚠️ This is an estimate only. Actual fees may vary. 
              Contact offices for exact amounts.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 3.5 Document Library Component
Create `components/document-library.tsx`:

```typescript
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const documents = [
  {
    category: "City of Ashtabula",
    items: [
      { name: "Zoning Permit Application", url: "#", note: "Required for most projects" },
      { name: "Historic District Guidelines", url: "#", note: "For properties in historic districts" },
      { name: "Sign Permit Application", url: "#", note: "Commercial signage" },
      { name: "Fence Permit Application", url: "#", note: "All fence installations" },
    ],
  },
  {
    category: "Ashtabula County",
    items: [
      { name: "Building Permit Application", url: "#", note: "New construction, additions" },
      { name: "Electrical Permit Application", url: "#", note: "Licensed contractors only" },
      { name: "Plumbing Permit Application", url: "#", note: "Licensed contractors only" },
      { name: "HVAC Permit Application", url: "#", note: "Licensed contractors only" },
      { name: "Demolition Permit Application", url: "#", note: "Structure demolition" },
    ],
  },
];

export function DocumentLibrary() {
  return (
    <div className="space-y-6">
      {documents.map((section) => (
        <Card key={section.category} className="border-2 border-slate-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-slate-800 mb-4">{section.category}</h3>
            <div className="grid gap-3">
              {section.items.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{doc.name}</p>
                    <p className="text-sm text-slate-500">{doc.note}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center">
        <Button variant="outline" className="gap-2">
          <ExternalLink className="w-4 h-4" />
          Visit Official Permit Portals
        </Button>
      </div>
    </div>
  );
}
```

### 3.6 FAQ Section Component
Create `components/faq-section.tsx`:

```typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need a permit for a shed?",
    answer: "It depends on size. Sheds under 200 square feet without electricity typically don't need a permit. Larger sheds or those with electrical require both City Zoning and County Building permits.",
  },
  {
    question: "What's the difference between City and County permits?",
    answer: "City of Ashtabula handles zoning permits (setbacks, land use). Ashtabula County handles building permits (structural safety, electrical, plumbing). Many projects need both.",
  },
  {
    question: "How long does the permit process take?",
    answer: "Simple zoning permits: 3-5 business days. Building permits: 7-14 business days depending on complexity. Plan reviews and busy seasons may extend timelines.",
  },
  {
    question: "Can I do my own electrical work?",
    answer: "Homeowners can perform electrical work on their own residence, but must still pull permits and pass inspections. Rental properties and commercial work require licensed electricians.",
  },
  {
    question: "What happens if I don't get a permit?",
    answer: "You may face fines, be required to remove work, or have issues selling your property. It's always better to get permits before starting work.",
  },
  {
    question: "Where do I submit permit applications?",
    answer: "City permits: Ashtabula City Hall, 4717 Main Ave, Permit & Community Development. County permits: Ashtabula County Building Department, 25 W Jefferson St, Jefferson, OH.",
  },
];

export function FAQSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left text-slate-800 hover:text-blue-600">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-slate-600">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
```

---

## Step 4: Verification (30 min)

### 4.1 Functional Testing
- [ ] Wizard: All 8 categories selectable
- [ ] Wizard: Results show correct permit requirements
- [ ] Wizard: "Start Over" button works
- [ ] Calculator: Residential fees calculate correctly (1% each)
- [ ] Calculator: Trade permit fees display correctly
- [ ] Documents: All categories display
- [ ] FAQ: Accordion expands/collapses
- [ ] Footer disclaimer visible on all views

### 4.2 Responsive Testing
- [ ] Mobile view (320px): Layout stacks correctly
- [ ] Tablet view (768px): Grid adjusts
- [ ] Desktop view (1024px): Full layout

### 4.3 Build Verification
```bash
npm run build
```

**Verify:** Build completes with 0 errors.

---

## Step 5: Deployment (30 min)

### 5.1 Vercel Setup
```bash
vercel login
vercel
```

**Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

### 5.2 Environment Variables
None required for Phase 1 (static data only).

### 5.3 Deploy
```bash
vercel --prod
```

**Verify:**
- [ ] Site loads at assigned domain
- [ ] All components functional
- [ ] Mobile responsive
- [ ] No console errors

### 5.4 Post-Deploy
- [ ] Test on mobile device
- [ ] Share URL with stakeholder for feedback
- [ ] Document any issues in daily memory

---

## Next Steps (Post Phase 1)

1. **Phase 2:** Add real form PDF links (pending stakeholder outreach)
2. **Phase 3:** CitizenServe API integration (if approved)
3. **Phase 4:** Analytics, feedback collection, iterative improvements

---

## Quick Reference

| Resource | Contact |
|----------|---------|
| City of Ashtabula PCD | 440-992-7115 |
| Ashtabula County Building | 440-576-3375 |
| CitizenServe Portal | citizenserve.com/ashtabula |
