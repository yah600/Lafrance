# FEATURE ADDITIONS TO MULTI-DIVISION DISPATCH PLATFORM
## Roofing/Isolation Departments + Advanced Capabilities

**Document Purpose:** Additions to existing 8-division platform  
**Date:** January 16, 2026  
**Status:** Ready for Implementation

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Department Additions: Roofing & Isolation](#2-department-additions-roofing--isolation)
3. [Thermal Heat Map Visualization System](#3-thermal-heat-map-visualization-system)
4. [Remote Quoting with 3D Property Modeling](#4-remote-quoting-with-3d-property-modeling)
5. [Regulatory Compliance Scanner](#5-regulatory-compliance-scanner)
6. [Client Bidding System](#6-client-bidding-system)
7. [Integration with Existing Platform](#7-integration-with-existing-platform)
8. [UI/UX Additions](#8-uiux-additions)

---

## 1. EXECUTIVE SUMMARY

### What's Being Added

**Two New Divisions:**
- Les Toitures Jonathan Isabel (Roofing)
- Isolation Mike Turmel (Insulation)

**Five Major Features:**
1. **Thermal Heat Map System** - Visual heat loss identification for buildings
2. **Remote Quoting Engine** - Generate accurate quotes without site visits using 3D models
3. **Heat Map API Integration** - Pull thermal imaging data for marketing and assessment
4. **Compliance Scanner** - Automated license verification (CMMTQ, RBQ, Alberta)
5. **Client Bidding Platform** - Reverse auction where clients set budget, contractors compete

### Impact on Existing Platform

**Existing 8 Divisions:** Plomberie, Toitures, Isolation, Conteneurs, Gouttières, Patio/Terrasse, Maison Cash, Construction

**Changes Required:**
- Add 2 new division workflows (Roofing, Insulation)
- Extend service request forms with thermal data
- Add 3D property viewer to quoting system
- Implement bidding module across all divisions
- Expand compliance tracking for Alberta regulations

---

## 2. DEPARTMENT ADDITIONS: ROOFING & ISOLATION

### 2.1 Les Toitures Jonathan Isabel (Roofing)

**Services Offered:**
- Roof replacement (asphalt shingles, metal, TPO)
- Emergency leak repairs (24/7)
- Roof inspections with thermal imaging
- Ventilation system upgrades
- Ice dam prevention
- Warranty work

**Service Area:**
- Rive-Sud (primary)
- Rive-Nord (secondary)
- Montreal Island (limited)

**Regulatory Requirements:**
- RBQ License Category: Entrepreneur en couverture
- Service Alberta Prepaid Contractor License (for Alberta expansion)
- WCB coverage
- $2M liability insurance minimum

**Unique Workflow Features:**

**Emergency vs Scheduled:**
- 🔴 **Emergency** (<24h): Leak repairs, storm damage, fallen tree
- 🟡 **Urgent** (2-7 days): Missing shingles, exposed underlayment
- 🟢 **Scheduled** (2-4 weeks): Full replacement, planned upgrades

**Thermal Inspection Process:**
```
Client reports issue → 
Dispatcher assigns thermal inspection → 
Technician captures infrared images on-site → 
Images uploaded to platform → 
Heat loss zones identified automatically → 
Quote generated showing thermal data → 
Client sees visual proof of heat loss → 
Higher conversion rate
```

**Integration with Isolation Department:**
- Auto-detect poor attic insulation during roof work
- Offer combined package (roof + insulation)
- Shared technician notes (attic condition visible to both departments)
- Cross-referral commission structure

**Pricing Structure:**
- Base: $X/sq ft (varies by material)
- Complexity multiplier: 1.0 (simple gable) to 1.5 (complex hip with dormers)
- Emergency surcharge: +$500-$1,000 (24h response)
- Thermal inspection: Included free with quote
- Warranty: 5-year labor, 25-50 year material

### 2.2 Isolation Mike Turmel (Insulation)

**Services Offered:**
- Attic insulation (blown fiberglass, cellulose, spray foam)
- Wall insulation retrofits (injection foam, dense-pack cellulose)
- Basement/crawl space insulation
- Air sealing (caulking, weatherstripping, vapor barriers)
- Ventilation balancing
- Energy audits (pre/post installation)
- Grant application assistance (federal/provincial rebates)

**Service Area:**
- Rive-Sud (primary)
- Rive-Nord (secondary)
- Montreal Island (selective - high-value projects)

**Regulatory Requirements:**
- RBQ License Category: Entrepreneur spécialisé - Isolation
- Alberta Building Code compliance (for expansion)
- Certification: Energy auditor (CAE/HOT2000 software)
- WCB coverage

**Unique Workflow Features:**

**Energy Audit Integration:**
```
Client requests quote → 
Schedule free energy audit → 
Technician measures current R-values → 
Thermal camera scan (heat loss identification) → 
Calculate required insulation depth → 
Estimate energy savings (kWh + $) → 
Generate quote with ROI calculation → 
Include grant eligibility information
```

**Alberta Building Code Compliance:**
- **Attics:** RSI 10.43 (R60) minimum
- **Walls:** RSI 3.08 (R22) minimum
- **Vapor barrier:** 6-mil polyethylene required
- **Ventilation:** 1 sq ft per 300 sq ft attic area

**Quebec Building Code Compliance:**
- Similar R-value requirements
- Additional Loi 25 privacy requirements (client consent for data)

**Grant Programs Supported:**
- Canada Greener Homes Grant (up to $5,600)
- RenoVert Quebec (up to $23,750)
- Hydro-Quebec Energy Efficiency Program
- Énergir Natural Gas Efficiency Program

**Pricing Structure:**
- Base: $X/sq ft (varies by R-value target and material)
- Air sealing package: +$500-$1,500 (included with most jobs)
- Energy audit: $300 (credited toward job if booked)
- Post-install thermal verification: +$150 (optional)
- Grant application support: Included free

**Integration with Roofing Department:**
- Roof replacement triggers insulation assessment
- Combined packages save 15-25%
- Shared access notes (roof ventilation impacts insulation performance)
- Coordinated scheduling (do insulation first if both services needed)

---

## 3. THERMAL HEAT MAP VISUALIZATION SYSTEM

### 3.1 What This Feature Does

**Purpose:** Display building heat loss visually using thermal imaging overlays on property images.

**Data Sources:**
- Infrared thermal cameras (handheld or drone-mounted)
- Aerial thermal imaging data (if available from city/utility programs)
- Historical thermal scans from previous inspections

**Visual Display:**
- Color-coded heat loss overlay (blue = low, red = high)
- Side-by-side comparison (visible photo vs thermal image)
- Annotated zones (roof, walls, windows, doors, penetrations)
- Heat loss intensity scale (1-10 rating)

### 3.2 Heat Loss Rating System

**Building Heat Loss Score (1-10 Scale):**

**1-3 (Low Loss - Blue/Green):**
- Well-insulated, efficient building
- Target for heat pump installations
- Ideal for smart thermostat programs
- Minimal weatherization needed

**4-6 (Moderate Loss - Yellow/Orange):**
- Average insulation
- Good candidate for targeted upgrades
- Air sealing recommended
- Moderate energy savings potential

**7-9 (High Loss - Orange/Red):**
- Poor insulation, significant heat escape
- Priority for weatherization programs
- Major energy savings opportunity
- Combined roof + insulation recommended

**10 (Critical Loss - Deep Red):**
- Emergency intervention needed
- Extreme energy waste
- Structural concerns possible (ice dams, moisture)
- Immediate assessment required

**Algorithm for Heat Loss Calculation:**
```
Factors:
- Thermal intensity (infrared temperature differential)
- Building size (normalize by square footage)
- Outdoor temperature (correction factor)
- Building age (expected baseline)
- Comparison to neighborhood average

Score = weighted_average([
  thermal_intensity * 0.4,
  size_normalized_loss * 0.3,
  comparison_to_neighbors * 0.2,
  building_age_factor * 0.1
])
```

### 3.3 Thermal Data in Service Request Forms

**New Fields Added to Intake Forms:**

**For Roofing Requests:**
- [ ] Thermal scan available? (Yes/No)
- [ ] Heat loss visible on roof? (None/Moderate/Severe)
- [ ] Ice dam history? (Never/Occasionally/Every winter)
- [ ] Attic insulation last upgraded: [Year or "Unknown"]

**For Insulation Requests:**
- [ ] Current estimated R-value: [Number or "Unknown"]
- [ ] Target R-value: [Auto-filled based on code]
- [ ] Energy bill increase noticed? (Yes/No)
- [ ] Rooms feel drafty? (Which rooms)
- [ ] Grant program interested in? (Checkboxes)

**Auto-Population:**
If thermal data exists for address:
```
System pre-fills:
- Heat loss rating: "Your home rates 8/10 for heat loss (higher than 75% of neighbors)"
- Priority zones: "Roof and attic show severe heat loss"
- Estimated savings: "Proper insulation could save $900/year on heating"
```

### 3.4 Thermal Imaging in Technician Mobile App

**New Mobile Features:**

**Thermal Camera Integration:**
- Connect FLIR One, FLIR C5, or similar via Bluetooth
- Capture infrared + visible light simultaneously
- Auto-tag images with GPS coordinates
- Upload directly to job record

**Thermal Annotation Tools:**
- Draw zones on thermal image (roof ridge, eaves, walls)
- Add temperature readings (tap to place thermometer icon)
- Compare before/after (side-by-side slider)
- Generate thermal report PDF automatically

**Workflow:**
```
Technician arrives on-site → 
Opens job in mobile app → 
Taps "Thermal Scan" → 
Captures 5-10 images (exterior + attic if accessible) → 
App processes images (enhances contrast, normalizes temperature) → 
Technician annotates problem areas → 
Uploads to cloud → 
Dispatcher/client sees thermal data in real-time
```

### 3.5 Heat Map in Client Portal

**What Clients See:**

**Property Dashboard:**
```
┌─────────────────────────────────────────┐
│ YOUR HOME HEAT LOSS REPORT              │
│                                         │
│ 📍 2279 ch. des Patriotes, Richelieu   │
│ 🌡️ Heat Loss Rating: 8/10 (High)       │
│ 📊 Neighborhood Avg: 5/10               │
│                                         │
│ [Visible Photo] [Thermal Photo]        │
│ (Side-by-side comparison)               │
│                                         │
│ Priority Areas:                         │
│ 🔴 Roof Ridge - Critical heat escape   │
│ 🟠 Northeast Corner - High loss        │
│ 🟡 Attic Hatch - Moderate loss         │
│                                         │
│ Estimated Annual Energy Waste: $1,200  │
│ Potential Savings with Upgrades: $950  │
│                                         │
│ [Request Free Assessment]              │
└─────────────────────────────────────────┘
```

**Interactive Heat Map:**
- Click on thermal zones to see details
- View temperature readings
- Compare to "ideal" building (simulation)
- See before/after projections (if quote accepted)

### 3.6 Heat Map in Marketing (Avero Integration)

**Targeted Campaigns:**

**High Heat Loss Targeting:**
```
Filter buildings by heat loss rating ≥7 → 
Generate personalized postcards/emails → 
Include thermal image of client's property → 
Message: "Your home is losing $1,200/year in heat. 
We can fix it. Free thermal assessment this month."
```

**Neighborhood Comparison:**
```
"Your home has 60% more heat loss than neighbors.
See why with a free thermal inspection."
```

**Conversion Rate Impact:**
- Generic ad: 1-2% conversion
- Personalized thermal image: 5-8% conversion
- **5X improvement in lead quality**

---

## 4. REMOTE QUOTING WITH 3D PROPERTY MODELING

### 4.1 What This Feature Does

**Purpose:** Generate accurate project quotes without requiring on-site visit, using 3D building models and aerial/satellite imagery.

**Use Cases:**
- Roofing replacement (measure roof area, pitch, complexity)
- Insulation (estimate attic area, calculate insulation depth)
- Exterior work (siding, gutters, windows)
- Any service where visual inspection sufficient

**Benefits:**
- 80% faster quote generation (5 minutes vs 2-7 days)
- Serve clients anywhere (not limited to local area)
- 24/7 quote requests (automated)
- Lower cost per acquisition (no travel time)
- Higher conversion (instant gratification)

### 4.2 Data Sources for Remote Quoting

**Google Maps Platform APIs:**

**3D Buildings API:**
- Building footprint (perimeter, square footage)
- Roof geometry (hip, gable, flat, complex)
- Building height (calculate stories)
- Roof pitch (calculated from 3D model)
- Surrounding obstacles (trees, adjacent buildings)

**Street View API:**
- Facade condition (material type, visible damage)
- Access assessment (driveway, street parking, obstacles)
- Material identification (asphalt shingles, metal, cedar shake)
- Color/style (for material matching)

**Satellite Imagery (Google Earth):**
- High-resolution roof photos (identify repairs needed)
- Historical imagery (track roof condition over time)
- Terrain elevation (impacts access logistics)

**Municipal Data:**
- Building age (year built)
- Property dimensions (lot size)
- Zoning (residential, commercial)
- Permit history (previous roof work, violations)

**Thermal Data:**
- Heat loss rating (indicates insulation quality)
- Problem zones (concentrated heat loss areas)
- Comparison to neighbors (relative condition)

**Historical Project Database:**
- Similar projects in same neighborhood
- Average costs by postal code
- Material pricing by region
- Labor rates by city
- Complexity factors (roof type, access)

### 4.3 Remote Quoting Workflow

**Client Initiates Quote:**

**Step 1: Address Entry**
```
Client visits website/app → 
Clicks "Get Instant Quote" → 
Enters address → 
System geocodes address (lat/lng) → 
Confirms address on map (satellite view) → 
Client proceeds
```

**Step 2: Service Selection**
```
Select service type:
[ ] Roofing - Replacement
[ ] Roofing - Repair
[ ] Insulation - Attic
[ ] Insulation - Walls
[ ] Combined Package (discount)

Optional: Upload photos (smartphone camera)
```

**Step 3: Brief Questionnaire (5-10 questions)**

**For Roofing:**
- When was your roof last replaced? [Year or "Unknown"]
- Any visible leaks or damage? [Yes/No, describe]
- Preferred material? [Asphalt/Metal/TPO/Other]
- Timeline? [Emergency/1 month/3 months/Flexible]
- Budget range? [Optional - for bidding system]

**For Insulation:**
- Do you have attic access? [Yes/No]
- Current insulation type? [Unknown/Fiberglass/Cellulose/None]
- Interested in grants? [Yes/No]
- Timeline? [1 month/3 months/Flexible]
- Budget range? [Optional]

**Step 4: Automated Data Gathering (30 seconds)**
```
Backend processes:

1. Call Google Maps 3D API
   → Extract roof dimensions, pitch, complexity

2. Call Google Street View API
   → Capture facade images, material type

3. Query thermal database
   → Pull heat loss rating if available

4. Query municipal records
   → Building age, permit history

5. AI processing
   → Roof complexity score (1-5)
   → Material quantity calculation
   → Labor hours estimation

6. Pricing algorithm
   → Base cost calculation
   → Regional adjustment
   → Complexity multiplier
   → Confidence score
```

**Step 5: Quote Generation (Instant)**

**Quote Package Includes:**

```
┌─────────────────────────────────────────┐
│ INSTANT QUOTE - ROOFING REPLACEMENT     │
│                                         │
│ Property: 123 Main St, Calgary         │
│ Roof Area: 2,150 sq ft                 │
│ Complexity: Medium (Score: 3/5)        │
│                                         │
│ PRICE RANGE: $8,500 - $9,800          │
│ Confidence: High (92%)                 │
│                                         │
│ Included:                               │
│ ✓ Complete tear-off                    │
│ ✓ 30-year architectural shingles       │
│ ✓ Synthetic underlayment               │
│ ✓ Drip edge & ridge cap                │
│ ✓ Attic ventilation inspection         │
│ ✓ Cleanup & disposal                   │
│                                         │
│ Timeline: 2-3 days                     │
│ Warranty: 5-year labor, 30-year mat.  │
│                                         │
│ [3D Model View] [Schedule Site Visit]  │
│ [Accept Quote] [Request Modifications] │
└─────────────────────────────────────────┘
```

**3D Interactive Model:**
- Rotate property 360°
- Highlight roof area (colored overlay)
- Show measurement lines
- Click zones for details

**Thermal Overlay (if available):**
- Toggle thermal view on/off
- See heat loss intensity
- View problem areas

### 4.4 Measurement Algorithms

**Roof Area Calculation:**
```
Base area from 3D footprint (length × width)

Pitch adjustment:
- Flat roof (0-15°): multiply by 1.0
- Low slope (15-30°): multiply by 1.05
- Medium slope (30-45°): multiply by 1.15
- Steep slope (45-60°): multiply by 1.3
- Very steep (>60°): multiply by 1.5

Complexity additions:
- Each valley: +10 linear feet
- Each hip: +8 linear feet
- Each dormer: +25-50 sq ft
- Each skylight: measure opening

Waste factor: +10-15% depending on complexity
```

**Insulation Depth Calculation:**
```
Target R-value (e.g., R60 for attics in Alberta)
Current R-value (estimated from thermal data or building age)

Depth required = (Target R-value - Current R-value) / Material R-value per inch

Example:
Target: R60
Current: R20 (estimated)
Material: Blown fiberglass (R-3.2 per inch)
Depth needed: (60 - 20) / 3.2 = 12.5 inches
```

**Labor Hours Estimation:**
```
Base hours = (Area / Technician productivity rate)

Productivity rates:
- Roofing: 150-200 sq ft/hour (simple), 80-120 sq ft/hour (complex)
- Insulation: 500-800 sq ft/hour (blown), 200-400 sq ft/hour (batt)

Complexity adjustments:
- Steep pitch: +30% time
- Limited access: +20% time
- Multiple stories: +15% per story above 1st
- Intricate roof (score 4-5): +40% time
```

**Pricing Algorithm:**
```
Material cost = Area × Material unit price × Waste factor
Labor cost = Hours × Hourly rate
Equipment cost = Fixed + (Per day rate × Estimated days)
Overhead = (Material + Labor + Equipment) × 0.15
Profit margin = (Material + Labor + Equipment + Overhead) × 0.20

Total = Material + Labor + Equipment + Overhead + Profit

Regional multiplier:
- Urban center: ×1.1
- Suburbs: ×1.0
- Rural: ×0.9

Complexity multiplier:
- Simple (1-2): ×1.0
- Moderate (3): ×1.15
- Complex (4-5): ×1.3

Thermal factor (if heat loss data available):
- Low loss (1-3): ×1.0 (minimal work)
- Moderate (4-6): ×1.05
- High (7-9): ×1.15 (extensive repairs likely)
- Critical (10): ×1.25 (worst-case scenario)

Final quote = Total × Regional × Complexity × Thermal
```

### 4.5 Confidence Scoring

**System calculates confidence in remote quote:**

**High Confidence (90-100%):**
- Clear 3D building model
- Simple roof geometry (gable or hip)
- Recent Street View imagery (<1 year)
- Thermal data available
- Similar historical projects in database

**Medium Confidence (70-89%):**
- Adequate 3D model (some unclear areas)
- Moderate complexity
- Street View imagery 1-3 years old
- No thermal data, but building age known
- Few similar projects in database

**Low Confidence (<70%):**
- Poor 3D model quality
- Complex or unusual roof design
- Outdated imagery (>3 years)
- No thermal data, no building age
- No comparable projects

**Actions Based on Confidence:**
- **High:** Proceed with instant quote
- **Medium:** Generate quote but recommend site visit for verification
- **Low:** Flag for human estimator review before sending to client

### 4.6 Quote Refinement Options

**Client Modifications:**
```
Client can adjust:
- Material upgrade (Good → Better → Best)
- Add services (gutters, ventilation, insulation)
- Change timeline
- Adjust scope (repair vs. full replacement)

System recalculates instantly
```

**Estimator Override:**
```
If confidence <70% or client requests changes:
→ Estimator reviews AI-generated quote
→ Adjusts measurements if needed
→ Adds notes for technician
→ Updates quote
→ Sends to client (within 2 hours)
```

### 4.7 Site Visit Trigger Logic

**Free Site Visit Offered When:**
- Quote confidence <70%
- Project value >$10,000
- Client explicitly requests verification
- Complex roof (score ≥4)
- Historical building or special requirements

**Site Visit Process:**
```
Quote generated remotely → 
Client accepts OR requests site visit → 
Technician scheduled with tablet → 
Technician verifies measurements on-site → 
Takes thermal photos → 
Adjusts quote if needed (typically ±10%) → 
Client signs contract on-site
```

**Accuracy Target:** 90% of remote quotes within ±15% of final invoice

---

## 5. REGULATORY COMPLIANCE SCANNER

### 5.1 What This Feature Does

**Purpose:** Automatically verify contractor licenses across multiple jurisdictions and ensure consumer protection law compliance.

**Covered Jurisdictions:**
- **Quebec:** CMMTQ (plumbing), RBQ (general contractors), Revenu Québec (NEQ)
- **Alberta:** Service Alberta (prepaid contractors), Apprenticeship & Training, Safety Codes Council
- **Future:** Ontario, BC, Saskatchewan (extensible system)

**Key Functions:**
1. Real-time license verification
2. Expiration tracking and alerts
3. Consumer protection compliance checks
4. Automated reporting
5. Job assignment blocking (if non-compliant)

### 5.2 License Verification System

**Technician License Management:**

**License Data Stored:**
```
For each technician:
- Full name
- License type(s): CMMTQ, RBQ, Service Alberta, Trade certification
- License number(s)
- Issue date
- Expiry date
- Status: Active/Expired/Suspended
- Restrictions: None or specific limitations
- Verification date (last checked)
- Verification method: API/Web scraping/Manual
```

**Verification Methods:**

**Quebec - CMMTQ (Plumbing):**
- Method: Web scraping (no public API)
- URL: https://www.cmmtq.org/recherche-membre/
- Process: Submit license number → Parse HTML results
- Data extracted: Status, name, license type, address
- Frequency: Daily automated check

**Quebec - RBQ (General Contractors, Roofers):**
- Method: Web scraping
- URL: https://www.rbq.gouv.qc.ca/en/licence-holder-search.html
- Process: Submit NEQ or license number → Parse results
- Data extracted: License status, categories, restrictions, expiry
- Frequency: Daily automated check

**Quebec - NEQ (Business Registration):**
- Method: API (Registre des entreprises du Québec)
- Verification: Business name, address, status (active/inactive)
- Frequency: Monthly check

**Alberta - Service Alberta (Prepaid Contractors):**
- Method: Public business license search
- URL: https://www.alberta.ca/business-licence-search
- Process: Search by business name or registration number
- Data extracted: License status, business type
- Frequency: Monthly check (Alberta licenses don't have short expiry)

**Alberta - Apprenticeship & Industry Training:**
- Method: Tradesecrets website lookup
- URL: https://tradesecrets.alberta.ca/
- Verification: Journeyperson certification for roofers, insulators
- Frequency: Annual check + when technician joins

**WCB/CNESST Coverage (Workers' Compensation):**
- Method: Certificate upload by technician
- Validation: Verify certificate number on WCB/CNESST website
- Frequency: Annually or when technician joins team

### 5.3 License Expiration Alert System

**Automated Alert Schedule:**

**90 Days Before Expiry:**
```
Email + SMS to technician:
"⏰ Reminder: Your RBQ license expires in 90 days.
Please initiate renewal process.
License: #8241-1234-56
Expiry: 2027-06-01"

Copy to: Division head
```

**60 Days Before Expiry:**
```
Email + SMS to technician + division head:
"⚠️ URGENT: Your RBQ license expires in 60 days.
Renewal must be completed soon to avoid job assignment restrictions.
License: #8241-1234-56
Expiry: 2027-06-01

[Start Renewal Process]"
```

**30 Days Before Expiry:**
```
Email + SMS to technician + division head + operations manager:
"🚨 CRITICAL: Your RBQ license expires in 30 days.
Job assignments will be BLOCKED in 30 days if not renewed.
License: #8241-1234-56
Expiry: 2027-06-01

[Upload Renewal Certificate]"

System flags: "⚠️ Expiring license - 30 days remaining"
```

**7 Days Before Expiry:**
```
Email + SMS + Push notification (all three) to technician + admin:
"🔴 FINAL NOTICE: Your RBQ license expires in 7 days.
Job assignments will be BLOCKED on 2027-05-25 if not renewed.
License: #8241-1234-56
Expiry: 2027-06-01

[Upload Renewal Certificate NOW]"

System flags: "🔴 EXPIRING SOON - 7 days"
```

**On Expiry Date:**
```
Technician automatically deactivated from job assignment pool
Email to technician + admin:
"❌ Your RBQ license has EXPIRED.
You cannot be assigned to jobs until license is renewed.
License: #8241-1234-56
Expired: 2027-06-01

[Upload Renewed License Certificate]"
```

### 5.4 Job Assignment Compliance Blocking

**Pre-Assignment Checks:**

```
Dispatcher assigns job to technician → 

System checks:
1. ✓ All required licenses active?
2. ✓ License valid for this service type?
3. ✓ License valid for this location (Quebec vs Alberta)?
4. ✓ WCB coverage active?
5. ✓ No outstanding compliance violations?

If ALL checks pass → Job assigned
If ANY check fails → BLOCKED
```

**Blocking Scenarios:**

**Expired License:**
```
❌ Cannot assign job

Error message:
"Job assignment BLOCKED
Technician: Marc Dubois
Reason: RBQ license expired on 2027-06-01
Action required: Upload renewed license certificate"

Alternative: System suggests other available technicians
```

**Wrong License Type:**
```
❌ Cannot assign job

Error message:
"Job assignment BLOCKED
Technician: Marc Dubois
Reason: This job requires RBQ Category 'Entrepreneur en isolation'
Technician only holds 'Entrepreneur en plomberie'
Action required: Assign to licensed insulation technician"
```

**Jurisdiction Mismatch:**
```
❌ Cannot assign job

Error message:
"Job assignment BLOCKED
Job location: Calgary, Alberta
Technician: Marc Dubois
Reason: Quebec licenses not valid in Alberta
Technician must hold Service Alberta license for this job"
```

### 5.5 Consumer Protection Compliance

**Pre-Contract Compliance Checklist:**

**For Quebec Projects (Loi sur la protection du consommateur):**

**Written Contract Must Include:**
- [ ] Business name and NEQ
- [ ] RBQ license number (displayed prominently)
- [ ] Contractor full address
- [ ] Detailed scope of work
- [ ] Total price (itemized)
- [ ] Payment schedule
- [ ] Start date and estimated completion
- [ ] Warranty terms (labor and materials)
- [ ] 10-day cancellation right disclosure
- [ ] Dispute resolution clause

**Deposit Limitations (Loi 62):**
- [ ] Deposit ≤10% of total contract value
- [ ] Cannot demand payment >10% before work starts
- [ ] System validates deposit amount before accepting payment

**For Alberta Projects (Fair Trading Act):**

**Written Contract Must Include:**
- [ ] Business name and Service Alberta license number
- [ ] Detailed scope of work
- [ ] Total price (itemized)
- [ ] Payment schedule
- [ ] Deposit ≤10% of total contract value
- [ ] Start date and estimated completion
- [ ] Warranty terms
- [ ] WCB clearance certificate attached (PDF)
- [ ] Dispute resolution information

**Contract Template Auto-Generation:**
```
Job created → 
System detects job location (Quebec or Alberta) → 
System loads jurisdiction-specific contract template → 
System auto-fills required fields → 
System validates all mandatory disclosures present → 
Contract sent to client for digital signature → 
System stores signed contract (immutable record)
```

### 5.6 Compliance Dashboard

**Admin View:**

```
┌─────────────────────────────────────────────┐
│ COMPLIANCE OVERVIEW                         │
│                                             │
│ Overall Compliance: 98% ✅                  │
│                                             │
│ Active Technicians: 46                      │
│ Fully Compliant: 45 (98%)                  │
│ Issues: 1 (2%)                             │
│                                             │
│ Expiring Licenses (Next 90 Days):          │
│ 📅 15 licenses require renewal             │
│                                             │
│ [View Details] [Generate Report]           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ EXPIRING LICENSES (Next 90 Days)            │
│                                             │
│ ⚠️ Marc Dubois - RBQ #8241-1234-56         │
│    Expires: 2027-03-15 (58 days)           │
│    Status: Renewal in progress             │
│                                             │
│ ⚠️ Jean Tremblay - CMMTQ #12345-C          │
│    Expires: 2027-04-22 (96 days)           │
│    Status: Not started                     │
│    [Send Reminder]                         │
│                                             │
│ ... 13 more                                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ COMPLIANCE ISSUES (Require Action)          │
│                                             │
│ 🔴 Sophie Gagnon - RBQ License EXPIRED     │
│    Expired: 2026-12-01 (46 days ago)       │
│    Jobs blocked: Yes                       │
│    Action: Upload renewed certificate      │
│    [Contact Technician] [Deactivate]       │
│                                             │
└─────────────────────────────────────────────┘
```

**Monthly Compliance Report:**
```
Generated automatically on 1st of each month
Emailed to: Operations Manager, Division Heads, Admin

Report includes:
- Overall compliance rate
- License verification summary (all licenses checked)
- Upcoming expirations (next 90 days)
- Non-compliant technicians (if any - should be 0)
- Jobs blocked due to compliance (should be 0)
- Regulatory changes tracked (new laws, fee increases)
```

### 5.7 Client-Facing Compliance Display

**Quote Footer:**
```
────────────────────────────────────────────
Plomberie Michaël Lacoste
9441-3267 Québec inc. | NEQ: 1176538933
CMMTQ License: #12345-C | RBQ: #8241-1234-56
Licensed and insured to protect you.

Your Rights as a Consumer:
✓ You may cancel this contract within 10 days of signing
✓ We cannot require more than 10% deposit before work begins
✓ You may verify our licenses at:
  - CMMTQ: www.cmmtq.org/recherche-membre
  - RBQ: www.rbq.gouv.qc.ca
✓ Questions? Contact Office de la protection du consommateur: 1-888-672-2556

[Verify CMMTQ License] [Verify RBQ License] [Download WCB Certificate]
────────────────────────────────────────────
```

**Clickable License Verification:**
- Links open government websites in new tab
- Pre-filled with contractor's license number
- Client can verify instantly (builds trust)

---

## 6. CLIENT BIDDING SYSTEM

### 6.1 What This Feature Does

**Purpose:** Reverse auction model where clients post project with budget, contractors compete with bids.

**Traditional Model:**
```
Contractor sets price → 
Client accepts or declines → 
No price negotiation
```

**New Bidding Model:**
```
Client posts project with budget range → 
Multiple contractors see opportunity → 
Contractors submit competitive bids → 
Client compares bids (price, rating, timeline, warranty) → 
Client selects best value (not always lowest price) → 
Job awarded to winner
```

**Benefits for Clients:**
- Transparent pricing
- Competition drives better prices (15% average savings)
- Client feels in control
- Multiple options to compare
- Fast response (<24 hours)

**Benefits for Contractors:**
- Access to motivated buyers (budget already allocated)
- Fill schedule gaps (bid lower during slow periods)
- Win jobs competitors might decline
- Data-driven pricing (AI suggests competitive bid)
- Higher conversion (clients pre-qualified)

### 6.2 How Bidding System Works

**Step 1: Client Posts Job**

**Job Posting Form:**
```
┌─────────────────────────────────────────────┐
│ REQUEST BIDS FOR YOUR PROJECT               │
│                                             │
│ Address: [Auto-filled or enter manually]   │
│                                             │
│ Service Type:                               │
│ [ ] Plumbing                                │
│ [X] Roofing                                 │
│ [ ] Insulation                              │
│ [ ] Other: ________________                │
│                                             │
│ Project Description:                        │
│ [Text area - 500 characters max]           │
│ "Need asphalt shingle roof replacement,    │
│  approximately 2,000 sq ft, moderate slope" │
│                                             │
│ Your Budget Range (Optional but encouraged):│
│ Min: $_______ Max: $_______                │
│ Or: [ ] I don't have a specific budget     │
│                                             │
│ Timeline:                                   │
│ ( ) Emergency (<48h) - Will pay premium    │
│ ( ) Urgent (1-2 weeks)                     │
│ (X) Flexible (1-3 months)                  │
│                                             │
│ Upload Photos (Optional):                  │
│ [Drag & drop or click to upload]           │
│                                             │
│ Bidding Deadline: [Auto-set 48 hours]     │
│                                             │
│ [Post Job & Receive Bids]                  │
└─────────────────────────────────────────────┘
```

**After Posting:**
```
Client receives confirmation:
"Your project has been posted!
You will receive bid notifications via email and SMS.
Expected bids: 3-7 contractors
Deadline: January 18, 2026 at 3:00 PM"
```

**Step 2: Contractors Notified**

**Bid Opportunity Notification:**
```
SMS:
"🔔 New bid opportunity in Richelieu
Budget: $8,000-$10,000
Service: Roofing replacement
Heat loss: 8/10 (high priority)
Deadline: 48 hours
[View Details & Bid]"

Email:
Subject: New Roofing Job - $8K-$10K - Richelieu QC

Body:
"A new bidding opportunity matches your service area and expertise.

Project: Roofing replacement
Location: Richelieu, QC (15 km from your base)
Budget: $8,000-$10,000
Heat loss rating: 8/10 (insulation likely needed too)
Timeline: Flexible (1-3 months)
Deadline to bid: January 18, 2026 at 3:00 PM

Currently bidding: 2 contractors
Your win rate: 28% (last 30 days)

[View Full Details] [Place Bid] [Pass on This Job]"
```

**Who Gets Notified:**
```
System filters contractors by:
- Service area (within X km of job location)
- Service type (Roofing division active)
- License status (must be compliant)
- Schedule capacity (available within client's timeline)
- Preferences (budget range within contractor's accepted range)
```

**Step 3: Contractor Reviews Opportunity**

**Bid Details Page:**
```
┌─────────────────────────────────────────────┐
│ BID OPPORTUNITY #BID-2026-0142              │
│                                             │
│ 📍 2279 ch. des Patriotes, Richelieu       │
│ 🏠 Single-family, 2-story, built 1985      │
│ 🌡️ Heat Loss Rating: 8/10 (High)          │
│                                             │
│ Client Budget: $8,000 - $10,000            │
│ Timeline: Flexible (1-3 months)            │
│                                             │
│ Project Description:                        │
│ "Need asphalt shingle roof replacement,    │
│  approximately 2,000 sq ft, moderate slope, │
│  noticed ice dams last winter, might need  │
│  insulation upgrade too."                  │
│                                             │
│ [3D Model View] [Street View] [Thermal]    │
│                                             │
│ Photos Uploaded by Client: (3)             │
│ [View Photos]                              │
│                                             │
│ Competitive Intel:                          │
│ • 2 contractors currently bidding          │
│ • Average bid in this range: $9,200       │
│ • Your past win rate: 28%                 │
│                                             │
│ AI Recommendation:                          │
│ Suggested bid: $8,800 - $9,400             │
│ Rationale: Heat loss suggests additional   │
│ roof venting work needed, competitive but  │
│ profitable at this range.                  │
│                                             │
│ [Place Bid] [Pass on Job]                  │
└─────────────────────────────────────────────┘
```

**Step 4: Contractor Submits Bid**

**Bid Submission Form:**
```
┌─────────────────────────────────────────────┐
│ SUBMIT YOUR BID                             │
│                                             │
│ Your Bid Amount: $_______.00               │
│ (Client budget: $8,000-$10,000)            │
│                                             │
│ Scope of Work Included:                     │
│ [Pre-filled template, edit as needed]      │
│                                             │
│ ✓ Complete tear-off of existing shingles   │
│ ✓ Inspect roof deck, replace damaged boards│
│ ✓ Install synthetic underlayment           │
│ ✓ Install 30-year architectural shingles   │
│ ✓ Replace drip edge and valley flashing    │
│ ✓ Install new ridge ventilation            │
│ ✓ Cleanup and disposal included            │
│ ✓ FREE thermal inspection ($150 value)     │
│                                             │
│ Optional Add-ons:                           │
│ [ ] Attic insulation upgrade: +$2,500      │
│ [ ] Gutter replacement: +$1,800            │
│                                             │
│ Start Date: [Date picker]                  │
│ Estimated Duration: [__ days]              │
│                                             │
│ Warranty:                                   │
│ (X) Standard: 5-year labor, 30-year mat.  │
│ ( ) Extended: 10-year labor, 50-year mat.  │
│                                             │
│ Payment Terms:                              │
│ (X) Standard: 10% deposit, balance on      │
│     completion                             │
│ ( ) Custom: [Describe]                     │
│                                             │
│ Additional Notes (Optional):                │
│ [Text area]                                │
│ "Based on thermal image, I recommend attic │
│  insulation upgrade to prevent future ice  │
│  dams. Happy to provide combined package." │
│                                             │
│ [Submit Bid] [Save Draft]                  │
└─────────────────────────────────────────────┘
```

**Bid Rules:**
- Can submit one bid per job
- Can update bid ONCE before deadline
- Bid visible to client once submitted
- Cannot see competitors' bid amounts (blind auction)
- Can see number of competing bids

**Step 5: Client Evaluates Bids**

**Client Bid Dashboard:**
```
┌─────────────────────────────────────────────┐
│ YOUR BIDS FOR: Roofing Replacement          │
│                                             │
│ You received 4 bids (deadline closed)      │
│                                             │
│ Sort by: [Best Value ▼] Price | Rating | Timeline
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ ⭐ BEST VALUE                            ││
│ │                                          ││
│ │ Plomberie ML (Roofing Div) - $9,200    ││
│ │ ★★★★★ 4.9/5 (127 reviews)               ││
│ │                                          ││
│ │ Includes: Everything + FREE thermal     ││
│ │ inspection + attic ventilation upgrade  ││
│ │                                          ││
│ │ Timeline: Start Jan 25, Complete Jan 27 ││
│ │ Warranty: 5-year labor, 30-year mat.    ││
│ │                                          ││
│ │ [View Full Details] [Select This Bid]   ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ 💰 LOWEST PRICE                          ││
│ │                                          ││
│ │ ABC Roofing - $7,800                    ││
│ │ ★★★★☆ 4.2/5 (34 reviews)                ││
│ │                                          ││
│ │ Includes: Basic tear-off & re-shingle  ││
│ │ (25-year shingles, standard ventilation)││
│ │                                          ││
│ │ Timeline: Start Feb 5, Complete Feb 8   ││
│ │ Warranty: 2-year labor, 25-year mat.    ││
│ │                                          ││
│ │ [View Full Details] [Select This Bid]   ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ... 2 more bids                            │
│                                             │
│ [Compare All] [Request Clarifications]     │
└─────────────────────────────────────────────┘
```

**Client Decision Factors:**
- Price (but not only factor)
- Contractor rating & reviews
- Scope of work (what's included)
- Timeline (soonest start date)
- Warranty terms
- Professional presentation of bid

**Step 6: Client Accepts Winning Bid**

```
Client clicks "Select This Bid" → 
Winning contractor notified immediately → 
Contract auto-generated from bid details → 
Client signs contract digitally → 
Deposit requested (≤10% of bid amount) → 
Client pays deposit → 
Job officially scheduled → 
Losing bidders notified (encourages future participation)
```

**Notification to Winner:**
```
SMS + Email + Push:
"🎉 Congratulations! You won the bid!

Job: Roofing replacement - Richelieu
Your bid: $9,200
Client: [Name]
Contract ready to sign.

Next steps:
1. Review auto-generated contract
2. Client will sign and pay deposit
3. Job scheduled for start date: Jan 25

[View Contract] [Contact Client]"
```

**Notification to Losers:**
```
Email:
"Thank you for bidding on Job #BID-2026-0142

Unfortunately, another contractor was selected.
Your bid: $9,500
Winning bid: $9,200 (3% lower)

Feedback to improve your win rate:
- Your bid was competitive on price
- Winner had higher rating (4.9 vs your 4.7)
- Winner included thermal inspection for free

Keep bidding! Next opportunity coming soon.

[View Your Bidding Stats] [Adjust Your Strategy]"
```

### 6.3 Bidding System Features

**AI Bid Recommendations:**

**Algorithm:**
```
Analyze:
- Client budget range
- Remote measurements (roof area, complexity)
- Thermal data (heat loss severity → more work needed)
- Historical costs (similar projects in area)
- Contractor's past win rate
- Current schedule capacity (bid lower if slow period)
- Number of competitors

Recommend:
Bid range: $X - $Y
Rationale: "Competitive but profitable. 
Heat loss rating suggests additional venting work. 
3 competitors bidding. 
Your win rate in this range: 32%"
```

**Bid Filters for Contractors:**

**Auto-Bid Preferences:**
```
Contractor sets:
- Service area: Within 30 km of Montreal
- Budget range: $3,000 - $25,000 (auto-ignore if outside)
- Service types: Roofing ✓ | Insulation ✓
- Heat loss priority: Only HEAT rating ≥6 (focus high-impact jobs)
- Timeline: Only if can start within 2 weeks
- Notification frequency: Immediate | Batched 2x daily | Off

System auto-filters opportunities:
If job doesn't match criteria → Don't notify contractor
If job matches → Send notification
```

**Bidding Analytics Dashboard (for Contractors):**

```
┌─────────────────────────────────────────────┐
│ YOUR BIDDING PERFORMANCE                    │
│                                             │
│ Last 30 Days:                               │
│ • Bids placed: 28                           │
│ • Bids won: 8 (29% win rate)               │
│ • Average bid: $8,750                       │
│ • Average winning bid: $8,200              │
│ • Revenue from bidding: $65,600            │
│                                             │
│ Insights:                                   │
│ ✓ Your win rate improved 5% vs last month  │
│ ⚠️ You're bidding 6% higher than winners   │
│ 💡 Try bidding $500-700 lower to improve   │
│                                             │
│ [View Detailed Stats] [Adjust Strategy]    │
└─────────────────────────────────────────────┘
```

**Competitive Intelligence (Anonymized):**

```
Contractors can see:
- Number of competitors bidding (e.g., "3 other contractors")
- Average bid range in market (e.g., "$8K-$10K typical for this job")
- Win rate by bid level (e.g., "Bids under $9K win 65% of time")

Contractors CANNOT see:
- Competitor names
- Specific competitor bid amounts
- Who is winning bids
```

### 6.4 Business Rules

**Bid Validity:**
- Bids valid for 7 days after submission
- Contractor can extend up to 30 days
- If client doesn't decide in 7 days, bids expire (must re-bid)

**Bid Modification:**
- Contractor can update bid ONCE before deadline
- After deadline, no changes allowed
- If client requests scope change, new bidding round starts

**Bid Acceptance:**
- Client accepts bid → Binding agreement
- Client has 24 hours to pay deposit
- If deposit not paid → Bid released, reopens to others

**No-Bid Penalties:**
- If contractor bids, wins, then cancels: -10 reputation points
- If contractor no-shows after winning: -50 points + 7-day suspension
- Repeat offenders: Permanent deactivation

**Fair Bidding Enforcement:**
- System monitors for collusion (bid patterns)
- Suspiciously high/low bids flagged for review
- Clients cannot accept then "shop around" after (binding)

### 6.5 Bidding System Revenue Model

**Option 1: Contractor Commission (Recommended)**
```
Contractor pays 5-10% commission on won bids
Example: $9,200 job → $460-$920 to platform
Deducted from final payment automatically
```

**Option 2: Client Booking Fee**
```
Client pays flat $99 "Bid Management Fee"
Refunded if no contractors bid
Non-refundable if client cancels after accepting
```

**Option 3: Tiered Contractor Subscriptions**
```
Free: Bid on 5 jobs/month
Premium ($99/month): Unlimited bids + priority notifications
Enterprise ($299/month): Unlimited + dedicated account manager + API access
```

**Recommended:** Option 1 (Commission) - Aligns incentives, fair to all parties

### 6.6 Success Metrics

**Target KPIs (Year 1):**
- 80% of posted jobs receive ≥3 bids
- 70% of posted jobs result in accepted bid
- Contractors win 25% of bids placed (healthy competition)
- Client satisfaction with bidding: >4.5/5
- Contractor satisfaction with bidding: >4.0/5
- Time to hire: <3 days (vs 7-14 days traditional)
- Client savings: 15% average vs traditional quotes

---

## 7. INTEGRATION WITH EXISTING PLATFORM

### 7.1 Updates to Existing Modules

**Service Request Forms:**
- Add thermal data fields (heat loss rating, problem zones)
- Add remote quoting option checkbox
- Add "Post for Bidding" vs "Request Quote" toggle
- Include photo upload for remote assessment

**Dispatcher Dashboard:**
- Add heat loss rating badge to job cards
- Add "Bidding" status (separate from regular job flow)
- Add compliance status indicator (✅ or ❌ for licenses)
- Add 3D model viewer link

**Technician Mobile App:**
- Add thermal camera integration (FLIR Bluetooth devices)
- Add thermal photo annotation tools
- Add license status display (alerts if expiring)
- Add bidding notifications

**Client Portal:**
- Add heat map visualization page
- Add remote quote request form
- Add bidding interface (post job, review bids)
- Add 3D property viewer

**Super Admin Dashboard:**
- Add compliance overview panel
- Add bidding performance metrics
- Add heat map usage statistics
- Add remote quote accuracy tracking

### 7.2 New Database Tables

**Thermal Data:**
```
thermal_scans
- scan_id (PK)
- property_address
- scan_date
- heat_loss_rating (1-10)
- thermal_image_url
- visible_image_url
- problem_zones (JSON array)
- technician_id
- notes
```

**Remote Quotes:**
```
remote_quotes
- quote_id (PK)
- job_id (FK)
- property_address
- measurement_source (3D model/manual)
- confidence_score (0-100)
- roof_area
- roof_complexity (1-5)
- estimated_hours
- price_range_min
- price_range_max
- requires_site_visit (boolean)
```

**Bids:**
```
bids
- bid_id (PK)
- job_id (FK)
- contractor_id (FK)
- bid_amount
- scope_of_work (text)
- start_date
- duration_days
- warranty_terms
- status (pending/accepted/declined)
- submitted_at
- updated_at
```

**Licenses:**
```
technician_licenses
- license_id (PK)
- technician_id (FK)
- license_type (CMMTQ/RBQ/Service Alberta/etc)
- license_number
- issue_date
- expiry_date
- status (active/expired/suspended)
- last_verified_date
- verification_method (API/scraping/manual)
```

### 7.3 API Endpoint Additions

**Thermal Data:**
- GET /api/v1/thermal/{address} - Get thermal scan for address
- POST /api/v1/thermal/upload - Upload thermal images
- GET /api/v1/thermal/jobs/{job_id} - Get thermal data for job

**Remote Quoting:**
- POST /api/v1/quotes/remote - Generate remote quote
- GET /api/v1/quotes/{quote_id}/3d-model - Get 3D viewer data
- PATCH /api/v1/quotes/{quote_id}/refine - Client modifies quote

**Bidding:**
- POST /api/v1/bids/create - Client posts job for bidding
- GET /api/v1/bids/opportunities - Contractor sees available bids
- POST /api/v1/bids/{bid_id}/submit - Contractor places bid
- PATCH /api/v1/bids/{bid_id}/accept - Client accepts bid

**Compliance:**
- POST /api/v1/compliance/verify - Verify license
- GET /api/v1/compliance/expiring - List expiring licenses
- GET /api/v1/compliance/report - Generate compliance report

---

## 8. UI/UX ADDITIONS

### 8.1 New Screens Required

**Client Portal:**
1. Heat Map Viewer (Property thermal visualization)
2. Remote Quote Request Form
3. Bidding Interface - Post Job
4. Bidding Interface - Review Bids
5. 3D Property Viewer

**Contractor Portal:**
6. Bidding Opportunities List
7. Bid Submission Form
8. Bidding Analytics Dashboard
9. License Management Page
10. Thermal Image Viewer/Annotator

**Dispatcher Dashboard:**
11. Compliance Alert Panel
12. Bidding Job Board (separate from regular jobs)

**Super Admin:**
13. Compliance Dashboard
14. Bidding System Analytics
15. Remote Quote Accuracy Report

**Mobile App (Technician):**
16. Thermal Camera Capture Screen
17. Thermal Annotation Tools
18. License Status Widget
19. Bidding Notification Screen

### 8.2 Design Specifications

**Heat Map Color Scale:**
```
1-3 (Low): #0066CC (Blue) → #00CC66 (Green)
4-6 (Moderate): #FFCC00 (Yellow) → #FF9900 (Orange)
7-9 (High): #FF6600 (Orange) → #FF0000 (Red)
10 (Critical): #CC0000 (Deep Red)
```

**3D Property Viewer:**
- Three.js or Google Earth API
- Rotate 360° (touch/mouse drag)
- Zoom in/out (pinch/scroll)
- Toggle layers (roof outline, heat overlay, measurements)

**Bidding UI Colors:**
```
Bid status:
- Pending: #FFB800 (Yellow/Orange)
- Won: #00C853 (Green)
- Lost: #6B7280 (Gray)
- Expired: #DC2626 (Red)
```

**Compliance Status Indicators:**
```
✅ Compliant: #10B981 (Green)
⚠️ Expiring Soon: #F59E0B (Amber)
❌ Non-Compliant: #EF4444 (Red)
```

### 8.3 Responsive Design Updates

**Mobile Optimizations:**
- Heat maps optimized for touch (pinch-zoom, swipe)
- 3D viewer simplified controls (single-finger rotate)
- Bidding forms simplified (fewer fields, smart defaults)
- Thermal camera capture native integration

**Tablet Optimizations:**
- Side-by-side bid comparison view
- Split-screen 3D model + quote details
- Thermal annotation with Apple Pencil/stylus support

**Desktop Optimizations:**
- Multi-bid comparison table
- Advanced 3D model controls (measurement tools)
- Compliance dashboard with multiple panels
- Thermal image batch processing

---

## APPENDIX: IMPLEMENTATION PRIORITY

### Phase 1 (Months 1-3): Foundation
**Priority: CRITICAL**
1. ✅ Add Roofing department (Les Toitures Jonathan Isabel)
2. ✅ Add Insulation department (Isolation Mike Turmel)
3. ✅ Thermal imaging capture & upload
4. ✅ Basic heat map visualization
5. ✅ Compliance scanner (Quebec: CMMTQ, RBQ)
6. ✅ License expiration alerts

### Phase 2 (Months 4-5): Advanced Features
**Priority: HIGH**
7. ✅ Remote quoting engine (Google Maps 3D)
8. ✅ 3D property viewer
9. ✅ Bidding system (full implementation)
10. ✅ Compliance scanner (Alberta: Service Alberta)

### Phase 3 (Months 6-9): Optimization
**Priority: MEDIUM**
11. ✅ AI bid recommendations
12. ✅ Advanced thermal analytics
13. ✅ Cross-department packages
14. ✅ Grant application automation

### Phase 4 (Months 10-12): Expansion
**Priority: LOW**
15. ✅ Ontario/BC compliance (future expansion)
16. ✅ Thermal drone integration
17. ✅ Energy savings guarantee program
18. ✅ White-label bidding platform

---

**Document Status:** Ready for Development  
**Created:** January 16, 2026  
**Version:** 1.0

**Next Steps:**
1. Review with Gabriel Lafrance
2. Prioritize features with division heads
3. Begin Phase 1 development
4. Train teams on new features
5. Launch pilot program (10 clients)

✅ **All features specified without external company dependencies - ready to build in-house.**
