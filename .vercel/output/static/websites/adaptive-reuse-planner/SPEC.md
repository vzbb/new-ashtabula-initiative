# Adaptive Reuse Planner — SPEC.md
**Version:** 1.0  
**Date:** February 17, 2026  
**Status:** Draft  

---

## Overview

A web-based tool to help Ashtabula property owners and developers understand adaptive reuse options, requirements, and incentives for repurposing existing buildings.

**Target Users:**
- Property owners considering building repurposing
- Small developers exploring conversion projects  
- Residents curious about neighborhood building changes

---

## Core Features

### 1. Building Type Selector
**Purpose:** Identify the starting building type

**Options:**
- Warehouse/Industrial
- Retail/Commercial
- School/Church
- Factory/Mill
- Gas Station
- Bank
- Hospital/Clinic
- Theater

**UI:** Card-based selection with icons

---

### 2. Proposed Use Selector
**Purpose:** Identify the target use

**Options:**
- Residential (apartments/condos)
- Mixed-use (retail + residential)
- Office/Business
- Restaurant/Food service
- Community/Cultural space
- Maker space/Workshop
- Hospitality (hotel/Airbnb)

**UI:** Card-based, filtered by building type compatibility

---

### 3. Requirements Checklist Generator
**Purpose:** Show permit/zoning requirements

**Outputs:**
- Zoning change required? (Y/N + explanation)
- Use permit required? (Y/N)
- Building permit triggers
- Historic preservation review (if applicable)
- Parking requirement changes
- Accessibility upgrades needed

**Data Source:** Public zoning code research (not stakeholder contact)

---

### 4. Incentive Calculator
**Purpose:** Identify potential funding/tax credits

**Programs to Check:**

| Program | Eligibility | Value |
|---------|-------------|-------|
| **Ohio Historic Preservation Tax Credit** | Historic buildings, substantial rehab | 25-35% of qualified rehab costs |
| **Federal Historic Tax Credit** | Income-producing historic properties | 20% of rehab costs |
| **Ohio Brownfield Fund** | Contaminated/industrial sites | Assessment + cleanup grants |
| **Abandoned Gas Station Grant** | Former gas stations with petroleum | Cleanup funding |
| **Opportunity Zones** | Properties in designated zones | Capital gains tax deferral |
| **LIHTC** | Low-income housing projects | Tax credits for affordable housing |

**UI:** Simple checkboxes → calculates potential eligibility

---

### 5. Permit Roadmap
**Purpose:** Step-by-step permit sequence

**Typical Flow:**
1. Pre-application meeting (optional but recommended)
2. Zoning verification/change
3. Building permit application
4. Historic review (if applicable)
5. Plan review (30 days)
6. Inspections during construction
7. Certificate of Occupancy

**UI:** Timeline visualization with estimated durations

---

### 6. Resource Directory
**Purpose:** Contact info for key entities

**Listings:**
- City of Ashtabula PCD (zoning)
- Ashtabula County Building Department (permits)
- Ohio Historic Preservation Office
- Ashtabula County Land Bank
- Ohio Brownfield Program
- Local contractors (self-reported/listings)

**Note:** Research-only, no direct integration

---

## Technical Architecture

### Frontend
- **Framework:** Next.js + React
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Deployment:** Vercel

### Data
- **Static JSON:** Building types, use mappings, requirements
- **No backend required** for MVP

### Design
- Dark theme matching noirsys.com aesthetic
- Glass-morphism cards
- Progressive disclosure (wizard-style)

---

## Implementation Phases

### Phase 1: Core Wizard (4-6 hours)
- Building type selector
- Proposed use selector
- Basic compatibility check
- Results display

### Phase 2: Requirements Engine (3-4 hours)
- Permit requirement logic
- Zoning change calculator
- Checklist generation

### Phase 3: Incentives Module (2-3 hours)
- Eligibility questionnaire
- Program descriptions
- Estimated values

### Phase 4: Polish (2-3 hours)
- Permit roadmap timeline
- Resource directory
- Mobile responsiveness
- Styling refinement

**Total:** ~12-16 hours

---

## Data Sources (Research-Based)

### Zoning
- Ashtabula City Zoning Code (public)
- Ashtabula County Building requirements (public)

### Incentives
- Ohio Historic Preservation Tax Credit Program
- Federal Historic Tax Credit (NPS)
- Ohio Brownfield Fund (ODOD)
- EPA Brownfield resources

### Examples
- Research-based building type mappings
- Common conversion patterns

---

## Success Metrics

- Tool accurately identifies permit requirements
- Users understand incentive eligibility
- Clear next steps provided
- Mobile-friendly usage

---

## Constraints

- **No stakeholder contact** until noirsys.com approved
- **Public data only** for requirements
- **Estimates only** for incentive values
- **Not legal advice** disclaimer required

---

## Next Steps

1. [ ] Finalize building type → use mappings
2. [ ] Draft permit requirement logic
3. [ ] Compile incentive program details
4. [ ] Build Phase 1 prototype

---

**Status:** SPEC drafted, ready for Phase 1 implementation when approved.