# NAI Tier 1 Demo Sites — Manual Verification Checklist

**Generated:** 2026-03-03  
**Purpose:** Pre-outreach spot-check for highest-priority demo sites

## Tier 1 Sites (Demo-Critical)

### 1. City of Ashtabula Building Dept
**URL:** https://newashtabula.vercel.app/city-of-ashtabula-building-dept  
**Target Buyer:** Municipal Government  
**Demo Flow:** Permit application → Status tracking

- [ ] Page loads without errors (check console)
- [ ] Hero section displays correctly
- [ ] "Apply for Permit" CTA visible and clickable
- [ ] Form renders properly (all fields visible)
- [ ] Form validation works (required fields)
- [ ] Submit button responds
- [ ] Mobile: Layout adapts (375px width)
- [ ] Tablet: Layout adapts (768px width)
- [ ] H1 heading present
- [ ] Contact information accurate

**Issues Found:**
- 

---

### 2. Ashtabula Area Chamber of Commerce
**URL:** https://newashtabula.vercel.app/ashtabula-area-chamber-of-commerce  
**Target Buyer:** Economic Development  
**Demo Flow:** Membership info → Contact form

- [ ] Page loads without errors
- [ ] Chamber branding displays
- [ ] Membership benefits section visible
- [ ] Contact/lead form renders
- [ ] Form fields functional
- [ ] Submit button responds
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] H1 heading present
- [ ] Social links work (if present)

**Issues Found:**
- 

---

### 3. Lakeland SBDC
**URL:** https://newashtabula.vercel.app/lakeland-sbdc  
**Target Buyer:** Small Business Development Center  
**Demo Flow:** Services overview → Appointment booking

- [ ] Page loads without errors
- [ ] SBDC branding displays
- [ ] Services section visible
- [ ] Appointment/schedule CTA works
- [ ] Calendar widget renders (if present)
- [ ] Contact form functional
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] H1 heading present
- [ ] Partner logos display correctly

**Issues Found:**
- 

---

### 4. Ashtabula County Commissioners
**URL:** https://newashtabula.vercel.app/ashtabula-county-commissioners  
**Target Buyer:** County Government  
**Demo Flow:** Department directory → Contact

- [ ] Page loads without errors
- [ ] Official county branding
- [ ] Department directory visible
- [ ] Meeting schedule/calendar displays
- [ ] Contact information accurate
- [ ] News/updates section (if present)
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] H1 heading present
- [ ] Accessibility: Color contrast OK

**Issues Found:**
- 

---

## Quick Mobile Test Protocol

For each site, test on actual devices or browser dev tools:

1. **iPhone SE (375×667)** — Smallest common phone
2. **iPad (768×1024)** — Standard tablet
3. **Desktop (1920×1080)** — Full screen

**Check:**
- Text readable without zooming
- Buttons tappable (min 44px touch targets)
- No horizontal scroll
- Images scale appropriately

---

## Form Test Protocol

For sites with forms:

1. **Empty Submit:** Click submit without filling fields → Should show validation
2. **Invalid Email:** Enter "test" in email field → Should require valid format
3. **Required Fields:** Leave one required field empty → Should highlight
4. **Successful Fill:** Complete all fields correctly → Should show success message
5. **Mobile Keyboard:** Focus input field → Keyboard shouldn't cover field

---

## Browser Test Matrix

Minimum verification:

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ☐ | ☐ |
| Safari | ☐ | ☐ |
| Firefox | ☐ | N/A |

---

## Sign-Off

**Verification Completed By:** _______________  
**Date:** _______________  
**All Tier 1 Sites Pass:** ☐ Yes ☐ No

**Blockers for Outreach:**
- 

**Ready for Demo:** ☐ Yes ☐ No — Date: _______________
