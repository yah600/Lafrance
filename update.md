# MULTI-DIVISION DISPATCHING PLATFORM
## Comprehensive Figma Design Integration Prompt

**Project:** Synergair x Groupe G. Lafrance Joint Venture  
**Platform:** Unified Service Operations & Dispatch Management  
**Date:** January 2026  
**Version:** 1.0 - Complete Integration Specification

---

## EXECUTIVE SUMMARY

Design a comprehensive, multi-tenant dispatching and operations management platform that unifies **8 distinct service divisions** under Groupe G. Lafrance's ecosystem, powered by Synergair's proprietary SYN Engine technology. The platform must support division-specific workflows while maintaining centralized oversight, compliance (Loi 25, CMMTQ, RBQ), and cross-division coordination.

---

## 1. DIVISION ARCHITECTURE

### 1.1 Division Overview

| Division | Primary Services | RBQ/License Requirements | Urgency Level | Service Area |
|----------|-----------------|-------------------------|---------------|--------------|
| **Plomberie Michael Lacoste** | Emergency plumbing, installations, renovations, camera inspection | CMMTQ certified | 24/7 Emergency | Rive-Sud, Rive-Nord, Montreal |
| **Les Toitures Jonathan Isabel** | Asphalt shingle roofing, installation, repair, maintenance | RBQ required | Seasonal high | Rive-Sud, Rive-Nord, Montreal |
| **Isolation Mike Turmel** | Insulation installation, energy efficiency upgrades | RBQ required | Standard | Rive-Sud, Rive-Nord, Montreal |
| **Conteneurs Mira** | Container rental, waste management, construction sites | Transport permits | On-demand | Greater Montreal |
| **Gouttières et Revêtements Alex Roussin** | Gutter installation/repair, siding, exterior cladding | RBQ required | Seasonal | Rive-Sud, Rive-Nord, Montreal |
| **Patio Terrasse Francis Girard** | Deck construction, patio installation, outdoor structures | RBQ required | Seasonal | Rive-Sud, Rive-Nord, Montreal |
| **Maison Cash** | Real estate transactions, property flipping, valuations | Real estate license | Standard | Greater Montreal |
| **Groupe G. Lafrance Construction** | General contracting, foundations, waterproofing, framing | RBQ entrepreneur général | Standard/Complex | Rive-Sud, Rive-Nord, Montreal |

### 1.2 Division-Specific Color Coding

Each division must have a distinct brand color throughout the UI:

- **Plomberie Michael Lacoste**: `#2B5A8E` (Deep Blue)
- **Les Toitures Jonathan Isabel**: `#8B4513` (Saddle Brown)
- **Isolation Mike Turmel**: `#FF8C00` (Dark Orange)
- **Conteneurs Mira**: `#4A7C59` (Forest Green)
- **Gouttières et Revêtements Alex Roussin**: `#708090` (Slate Gray)
- **Patio Terrasse Francis Girard**: `#8B7355` (Burlywood)
- **Maison Cash**: `#DAA520` (Goldenrod)
- **Groupe G. Lafrance Construction**: `#1C3D5A` (Navy Blue)

---

## 2. USER ROLES & PERMISSION ARCHITECTURE

### 2.1 Role Hierarchy

```
┌─────────────────────────────────────────────┐
│         SUPER ADMIN (Gabriel Lafrance)       │
│         • Full system access                 │
│         • All divisions                      │
│         • Financial oversight                │
│         • System configuration               │
└─────────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼────────┐         ┌───────▼────────┐
│  DIVISION HEAD │         │ OPERATIONS MGR  │
│  • Michael L.  │         │  • Cross-div    │
│  • Jonathan I. │         │  • Scheduling   │
│  • Mike T.     │         │  • Resource     │
│  • etc.        │         │    allocation   │
└───────┬────────┘         └───────┬────────┘
        │                           │
        ├─────────────┬─────────────┤
        │             │             │
┌───────▼────────┐ ┌──▼──────┐ ┌──▼────────┐
│   DISPATCHER   │ │TECHNICIAN│ │  CLIENT   │
│  • Scheduling  │ │• Mobile  │ │• Portal   │
│  • Assignment  │ │• Jobs    │ │• Tracking │
│  • Tracking    │ │• Reports │ │• Invoices │
└────────────────┘ └─────────┘ └───────────┘
```

### 2.2 Detailed Role Permissions

#### **SUPER ADMIN**
- Dashboard: Consolidated view of all 8 divisions
- Access: Complete system, all financial data, all divisions
- Actions: Create/modify users, configure system settings, view all jobs, approve major contracts
- Reports: Cross-division analytics, profitability by division, resource utilization

#### **DIVISION HEAD**
- Dashboard: Division-specific metrics + limited cross-division view
- Access: Own division + read-only on related divisions
- Actions: Approve quotes, manage division staff, set division pricing, view division P&L
- Reports: Division performance, team productivity, client satisfaction

#### **OPERATIONS MANAGER**
- Dashboard: Real-time job status across divisions
- Access: All active jobs, resource calendar, inventory
- Actions: Schedule across divisions, allocate shared resources, optimize routes
- Reports: Resource utilization, job completion rates, bottlenecks

#### **DISPATCHER (Division-Specific)**
- Dashboard: Division job board, available technicians, incoming requests
- Access: Division jobs, division technicians, client info
- Actions: Accept/assign jobs, schedule appointments, communicate with techs
- Reports: Daily dispatch summary, technician utilization

#### **TECHNICIAN (Mobile-First)**
- Dashboard: Personal job queue, today's schedule, navigation
- Access: Assigned jobs, client contact info, job details, time tracking
- Actions: Start/complete jobs, upload photos, digital signatures, inventory requests
- Reports: Personal productivity, completed jobs, hours worked

#### **CLIENT (Customer Portal)**
- Dashboard: Service history, scheduled appointments, invoices
- Access: Own account, past services, quotes, loyalty rewards
- Actions: Request service, track technician, approve quotes, pay invoices
- Reports: Service history, spending summary

---

## 3. CORE MODULES & FEATURES

### 3.1 SERVICE REQUEST INTAKE MODULE

**Universal Intake Flow:**
```
Client Contact → Lead Qualification → Division Routing → 
Technician Assignment → Job Execution → Quality Control → 
Invoice & Payment → Follow-up
```

**Division-Specific Intake Fields:**

#### **Plomberie (Emergency Priority)**
- **Emergency Level**: 🔴 Critical (1h) | 🟡 Urgent (4h) | 🟢 Scheduled
- **Problem Type**: Leak, Blockage, No Hot Water, Frozen Pipes, Installation
- **Access Info**: Building type, floor, parking, key code
- **After-hours surcharge**: Auto-calculated based on time ($190/h, $275/h, $375/h+)
- **Camera Inspection**: Yes/No toggle
- **CMMTQ License Verification**: Auto-check technician certification

#### **Toitures (Project-Based)**
- **Job Type**: New Installation, Repair, Inspection, Emergency Leak
- **Roof Area (sq ft)**: Input field
- **Current Roof Type**: Asphalt shingle, flat, metal
- **Roof Access**: Ladder needed, scaffolding, lift
- **Weather Window**: Seasonal scheduling preference
- **RBQ License Verification**: Auto-check

#### **Isolation (Energy Efficiency)**
- **Area to Insulate**: Attic, walls, basement, crawl space
- **Current R-Value**: Known/Unknown
- **Square Footage**: Input
- **Energy Audit**: Completed/Needed
- **Grant Application**: Federal, provincial (auto-link to programs)
- **Timeline**: Flexible, seasonal preference

#### **Conteneurs (Rental Management)**
- **Container Size**: 10yd, 20yd, 30yd, 40yd
- **Rental Duration**: Days/Weeks
- **Material Type**: Construction debris, renovation, clean fill
- **Site Access**: Street, driveway, backyard
- **Permit Required**: Auto-check municipal requirements
- **Pickup Schedule**: One-time, recurring

#### **Gouttières et Revêtements (Exterior)**
- **Service Type**: Gutter installation, cleaning, repair, siding
- **Linear Feet**: Input
- **Stories**: 1, 2, 3+
- **Material Preference**: Aluminum, vinyl, steel
- **Color**: Standard options + custom
- **Debris Removal**: Included/Additional

#### **Patio/Terrasse (Outdoor Construction)**
- **Project Type**: New build, repair, expansion, staining
- **Square Footage**: Input
- **Material**: Treated wood, cedar, composite, stone
- **Elevation**: Ground-level, elevated
- **Permits**: Auto-check municipal requirements
- **Timeline**: Rush/Standard/Flexible

#### **Maison Cash (Real Estate)**
- **Transaction Type**: Purchase, sale, valuation, flip consultation
- **Property Type**: Residential, commercial, multi-family
- **Timeline**: Urgent, 30 days, 60 days, flexible
- **Current Condition**: Move-in ready, minor repairs, major renovation
- **Financing**: Cash, pre-approved, needs financing
- **Renovation Services**: Yes/No (trigger cross-division quotes)

#### **Construction (General Contracting)**
- **Project Scope**: Foundation repair, waterproofing, framing, addition
- **Project Size**: Small (<$10k), Medium ($10k-$50k), Large ($50k+)
- **Timeline**: Emergency, <1 month, 1-3 months, 3+ months
- **Permits**: Residential, commercial (auto-check requirements)
- **Engineering Required**: Yes/No
- **Multi-Division**: Auto-flag if requires plumbing/roofing/etc.

---

### 3.2 DISPATCHER DASHBOARD

**Layout Requirements:**

#### **Top Navigation Bar**
- Division selector dropdown (show current division with color indicator)
- Date range picker
- Real-time clock
- Notification bell (incoming requests, tech updates, client messages)
- User profile menu

#### **Main Job Board (Kanban-Style)**

**Columns:**
1. **Incoming Requests** (Red badge count)
   - Unassigned jobs
   - Sort by: Priority, Time received, Value
   - Quick filters: Emergency, Same-day, Scheduled

2. **Assigned & Pending** (Yellow badge)
   - Jobs assigned but not yet started
   - Technician avatar + name
   - ETA to start
   - Client name + address

3. **In Progress** (Blue badge)
   - Active jobs
   - Real-time tech location (GPS)
   - Elapsed time
   - Quick message button

4. **Pending Approval** (Orange badge)
   - Jobs awaiting client quote approval
   - Jobs requiring division head approval (over threshold)
   - Jobs needing parts/equipment

5. **Completed Today** (Green badge)
   - Jobs completed and signed
   - Invoice status
   - Quality check flag

6. **Follow-up Required** (Purple badge)
   - Warranty work
   - Quality issues
   - Client callbacks

**Card Design (Job Card):**
```
┌─────────────────────────────────────────┐
│ [Division Color Strip]                  │
│ #JOB-12345 | 🔴 URGENT                 │
│                                         │
│ Jean Tremblay                           │
│ 123 rue Principale, Longueuil           │
│ ☎ (514) 555-1234                       │
│                                         │
│ Problem: Burst pipe in basement         │
│ Requested: 2026-01-16 08:30            │
│                                         │
│ [Technician Avatar] Marc Dubois         │
│ ETA: 10:15 AM | Distance: 12 km        │
│                                         │
│ Value: $450-$650 (estimated)           │
│                                         │
│ [View Details] [Message] [Reassign]    │
└─────────────────────────────────────────┘
```

#### **Right Sidebar - Resource Panel**

**Available Technicians:**
- Name + avatar
- Current status: Available | On Job | Break | Off Duty
- Current location (map pin)
- Jobs completed today: X
- Skills/Certifications badges
- Drag-and-drop to assign

**Shared Equipment/Vehicles:**
- Vehicle ID + type
- Current assignment
- Next available time
- Maintenance status

#### **Bottom Metrics Bar**
- Today's Jobs: Completed X / Total Y
- Revenue Today: $XX,XXX
- Average Job Duration: X hrs
- Customer Satisfaction: X.X/5.0 stars

---

### 3.3 TECHNICIAN MOBILE APP

**Mobile-First Design Principles:**
- Thumb-reachable action buttons
- Minimal text input (voice, photos, signatures)
- Offline-capable for areas with poor reception
- Battery-efficient location tracking

#### **Home Screen**
```
┌───────────────────────────────────────┐
│   [Profile Photo]    Marc Dubois      │
│   Plomberie Michael Lacoste           │
│                                       │
│   ┌─────────────────────────────┐    │
│   │  TODAY'S SCHEDULE           │    │
│   │                             │    │
│   │  09:00 - 123 rue St-Jean   │←  │
│   │  ✓ Water heater install    │    │
│   │  Status: Completed          │    │
│   │                             │    │
│   │  →  11:30 - 456 ch. Chambly│    │
│   │  🔴 Emergency leak          │    │
│   │  ETA: 15 min                │    │
│   │  [START NAVIGATION]         │    │
│   │                             │    │
│   │  14:00 - 789 rue Principale│    │
│   │  Camera inspection          │    │
│   │  Scheduled                  │    │
│   └─────────────────────────────┘    │
│                                       │
│   [Clock In/Out] [Lunch Break]       │
│   [Request Parts] [Emergency SOS]    │
└───────────────────────────────────────┘
```

#### **Job Detail Screen**

**Essential Info at Top:**
- Client name + phone (tap to call)
- Address (tap to navigate)
- Job type + urgency indicator
- Estimated duration
- Parts/equipment needed

**Action Buttons (Large, Bottom of Screen):**
- [START JOB] - Starts timer, notifies dispatcher
- [ADD PHOTOS] - Before/during/after
- [ADD NOTES] - Voice-to-text enabled
- [REQUEST PARTS] - Quick order from inventory
- [CLIENT SIGNATURE] - Digital signature capture
- [COMPLETE JOB] - Triggers invoice generation

#### **Photo Capture Flow**
- Required photos: "Before" (mandatory), "During" (optional), "After" (mandatory)
- Auto-tagged with: Timestamp, GPS, technician name, job ID
- Compressed for mobile upload
- Offline queue if no connection

#### **Digital Signature**
- Client signs on screen
- Captures: Name, signature, timestamp
- Option to email receipt immediately
- Stored in job record

#### **Inventory/Parts Management**
- Scan barcode to request parts
- View truck inventory
- Mark items used on job (auto-deduct from inventory)
- Low stock alerts

---

### 3.4 CLIENT PORTAL

#### **Public-Facing (Pre-Login)**

**Homepage:**
- Division selector (8 cards with icons)
- "Get a Quote" prominent CTA
- Emergency hotline (prominent for Plomberie)
- Service area map
- Testimonials
- CMMTQ/RBQ badges

**Service Request Form:**
- Step 1: Select division
- Step 2: Describe problem (text + photos)
- Step 3: Property details
- Step 4: Contact info + preferred times
- Step 5: Confirmation + ETA for quote

#### **Client Dashboard (Logged In)**

**My Services Overview:**
```
┌─────────────────────────────────────────────┐
│  Welcome back, Jean Tremblay                │
│                                             │
│  ┌──────────────┐  ┌──────────────┐       │
│  │ ACTIVE JOBS  │  │ SERVICE      │       │
│  │      2       │  │ HISTORY: 12  │       │
│  └──────────────┘  └──────────────┘       │
│                                             │
│  CURRENT APPOINTMENTS                       │
│  ┌─────────────────────────────────────┐  │
│  │ Jan 18, 2026 - 9:00 AM             │  │
│  │ Plomberie: Kitchen faucet install   │  │
│  │ Technician: Marc Dubois             │  │
│  │ [Track Technician] [Reschedule]    │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ Jan 20, 2026 - 1:00 PM             │  │
│  │ Toitures: Roof inspection           │  │
│  │ Technician: TBD                     │  │
│  │ [View Details] [Cancel]             │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  PENDING QUOTES                             │
│  └─→ Patio: 12x16 deck - $8,500           │
│      [Approve] [Request Changes]           │
│                                             │
│  [Request New Service] [View Invoices]     │
└─────────────────────────────────────────────┘
```

**Features:**
- Real-time technician tracking (map view)
- Service history with photos
- Digital invoices + online payment
- Loyalty rewards program
- Referral tracking
- Schedule management
- Multi-property support (for landlords)

---

### 3.5 SUPER ADMIN DASHBOARD

**Executive Overview (Gabriel Lafrance View):**

#### **Top KPI Cards**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ TODAY'S      │ │ MONTHLY      │ │ ACTIVE       │ │ CUSTOMER     │
│ REVENUE      │ │ TARGET       │ │ JOBS         │ │ SATISFACTION │
│ $42,350      │ │ 68% ($340K)  │ │ 127          │ │ 4.8/5.0 ⭐   │
│ ↑ 18%        │ │ ▲ On Track   │ │ 8 Emergency  │ │ ↑ 0.2        │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

#### **Division Performance Matrix**
| Division | Jobs Today | Revenue | Utilization | Issues |
|----------|-----------|---------|-------------|--------|
| Plomberie | 23 | $12,450 | 87% | 1 🟡 |
| Toitures | 8 | $18,200 | 72% | 0 ✅ |
| Isolation | 5 | $6,800 | 65% | 0 ✅ |
| Conteneurs | 12 | $1,900 | 90% | 0 ✅ |
| Gouttières | 4 | $3,200 | 58% | 1 🟡 |
| Patio | 2 | $0 (quotes) | 45% | 0 ✅ |
| Maison Cash | 1 | $0 (pending) | N/A | 0 ✅ |
| Construction | 3 | $24,500 | 83% | 0 ✅ |

#### **Resource Allocation Map**
- Real-time map showing all active technicians across all divisions
- Color-coded by division
- Job density heatmap
- Service area coverage visualization

#### **Financial Deep Dive**
- Revenue by division (current vs. last year)
- Profit margins by division
- Account receivables aging
- Cash flow projection
- Top clients by spend

#### **Operational Metrics**
- Average response time by division
- Job completion rate
- Technician productivity rankings
- Parts/inventory costs
- Subcontractor utilization

#### **Compliance & Quality**
- License expiration tracking (RBQ, CMMTQ)
- Insurance certificate status
- Safety incidents log
- Customer complaints
- Quality control checklist completion rates

---

### 3.6 CROSS-DIVISION COORDINATION

#### **Multi-Service Job Orchestration**

**Scenario:** Client needs roof replacement + new gutters + attic insulation

**Workflow:**
1. **Initial Quote** - Construction (general contracting) assesses full scope
2. **Division Assignment** - System auto-creates 3 linked jobs:
   - Toitures (Jonathan Isabel): Roof tear-off & installation
   - Gouttières (Alex Roussin): Gutter system
   - Isolation (Mike Turmel): Attic insulation upgrade
3. **Sequencing Logic** - System enforces order:
   - Day 1-2: Isolation (before roof disturbed)
   - Day 3-5: Toitures (roof replacement)
   - Day 6: Gouttières (after roof complete)
4. **Shared Resources** - Single dumpster (Conteneurs) for all divisions
5. **Unified Client Communication** - One point of contact, consolidated updates
6. **Combined Invoicing** - Single invoice with breakdown by division

**UI Design:**
```
┌────────────────────────────────────────────────┐
│  MULTI-DIVISION PROJECT #5678                  │
│  Client: Marie Leclerc                         │
│  123 rue des Érables, Longueuil                │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ 1. ISOLATION (Mike Turmel)     ✓ DONE   │ │
│  │    Attic insulation upgrade              │ │
│  │    Completed: Jan 12, 2026               │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ 2. TOITURES (Jonathan Isabel)  → ACTIVE │ │
│  │    Asphalt shingle roof replacement      │ │
│  │    Started: Jan 14 | ETA: Jan 18         │ │
│  │    [View Progress] [Photos: 12]          │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ 3. GOUTTIÈRES (Alex Roussin)   PENDING  │ │
│  │    Seamless gutter installation          │ │
│  │    Scheduled: Jan 19, 2026               │ │
│  │    Dependencies: Job #2 completion       │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  SHARED RESOURCES:                             │
│  • Conteneur 20yd (Mira) - Jan 14-20          │
│                                                │
│  Total Project Value: $32,500                  │
│  Client Payment: 30% deposit paid ✓           │
│                  70% due on completion         │
└────────────────────────────────────────────────┘
```

#### **Shared Equipment Calendar**

**Resources to Track:**
- Boom lifts
- Scaffolding
- Large tools (compressors, generators)
- Specialty equipment (camera inspection, drain snake)
- Vehicles (when shared across divisions)

**Calendar View:**
- Week/month view
- Color-coded by division using equipment
- Conflict detection (double-booking prevention)
- Reservation system with approval workflow

---

### 3.7 INVENTORY & PARTS MANAGEMENT

#### **Multi-Tier Inventory System**

**Central Warehouse:**
- Bulk storage for all divisions
- Reorder point automation
- Supplier integration (purchase orders)
- Cost tracking by division

**Division-Specific Stock:**
- Small parts common to division (e.g., Plomberie: fittings, valves)
- Allocated budget per division
- Transfer requests between divisions

**Truck Inventory:**
- Each technician's vehicle tracked separately
- Morning stock-out, evening reconciliation
- Usage auto-deducted on job completion
- Low-stock alerts

**UI Features:**
- Barcode scanning
- Parts request from job site (mobile)
- Auto-reorder when below threshold
- Cost allocation to jobs
- Warranty parts tracking

---

### 3.8 MARKETING & LEAD GENERATION (AVERO INTEGRATION)

#### **Avero.cloud Integration Points**

**Lead Intake from Marketing:**
```
Google Ads/SEO → Landing Page → Lead Form → 
Avero Qualification → SYN Engine Routing → 
Division Dispatcher → Technician Assignment
```

**Lead Qualification Automation:**
- AI-powered chatbot for initial triage
- Urgency assessment
- Service area validation
- Budget pre-qualification
- Division auto-routing

**Lead Tracking Dashboard:**
- Source attribution (Google, Facebook, referral, organic)
- Cost per lead by source
- Conversion rate by division
- ROI by marketing channel
- A/B test results

**Client Acquisition Metrics:**
- New clients this month
- Client lifetime value by division
- Retention rate
- Referral rate
- Repeat service interval

#### **Technician Recruitment Module**

**Candidate Pipeline:**
```
Job Posting → Application → AI Screening → 
Interview Scheduling → Background Check → 
License Verification → Onboarding → Active Roster
```

**Features:**
- Applicant tracking system (ATS)
- Automated license verification (CMMTQ, RBQ)
- Interview scheduling with video calls
- Digital offer letters
- Onboarding checklist
- Skills assessment tests
- References tracking

---

## 4. TECHNICAL SPECIFICATIONS

### 4.1 Technology Stack (For Development Reference)

**Frontend:**
- React Native (mobile apps - iOS/Android)
- Next.js (web dashboards)
- TailwindCSS (styling)
- React Query (data fetching)

**Backend:**
- Node.js (API layer)
- PostgreSQL (primary database)
- Redis (caching, real-time features)
- S3-compatible storage (photos, documents)

**Real-Time Features:**
- WebSocket (job updates, messaging)
- GPS tracking (technician locations)
- Push notifications (mobile)

**Compliance:**
- Encryption at rest and in transit
- Loi 25 compliance (data residency in Quebec)
- Role-based access control (RBAC)
- Audit logging

**SYN Engine (Proprietary):**
- Predictive scheduling algorithms
- Dynamic pricing optimization
- Route optimization
- Demand forecasting
- Technician-job matching AI

### 4.2 Data Architecture

**Core Entities:**

1. **Users**
   - ID, role, division_id, permissions, authentication
   - Technician details: licenses, certifications, skills, vehicle

2. **Jobs**
   - ID, division_id, client_id, status, priority, value
   - Timestamps: created, scheduled, started, completed
   - Location: address, GPS coordinates, service area
   - Linked jobs (multi-division projects)

3. **Clients**
   - ID, contact info, properties, service history
   - Payment methods, credit status
   - Preferences, notes, loyalty tier

4. **Divisions**
   - ID, name, color, settings, license requirements
   - Pricing rules, service areas, hours of operation

5. **Inventory**
   - Items, locations (warehouse/division/truck), quantities
   - Costs, suppliers, reorder points

6. **Financials**
   - Invoices, payments, refunds
   - Division-level P&L
   - Accounts receivable aging

7. **Documents**
   - Photos, signatures, contracts, permits
   - Job documentation, before/after

### 4.3 Integration Points

**Must Integrate With:**
- Accounting software (QuickBooks or similar)
- Payment gateway (Stripe, Square)
- SMS/Email (Twilio, SendGrid)
- Mapping/Navigation (Google Maps)
- Marketing automation (Avero.cloud)

**Nice to Have:**
- CRM (Salesforce, HubSpot)
- Project management (for Construction division)
- Payroll systems
- Fleet management

---

## 5. FIGMA DESIGN DELIVERABLES

### 5.1 Required Screens (Minimum)

#### **Super Admin Dashboard** (Desktop)
- [ ] Main dashboard with KPIs
- [ ] Division performance matrix
- [ ] Financial overview
- [ ] Resource allocation map
- [ ] User management
- [ ] System settings

#### **Division Head Dashboard** (Desktop)
- [ ] Division-specific dashboard
- [ ] Job board (Kanban)
- [ ] Team management
- [ ] Performance reports
- [ ] Quote approval queue

#### **Dispatcher Dashboard** (Desktop)
- [ ] Job board (Kanban)
- [ ] Technician resource panel
- [ ] Calendar view
- [ ] Client communication
- [ ] Quick job creation

#### **Technician Mobile App** (iOS/Android)
- [ ] Login / Authentication
- [ ] Home screen (today's schedule)
- [ ] Job list view
- [ ] Job detail view
- [ ] Navigation integration
- [ ] Photo capture flow
- [ ] Digital signature
- [ ] Time tracking
- [ ] Parts request
- [ ] Job completion
- [ ] Messaging

#### **Client Portal** (Desktop + Mobile Responsive)
- [ ] Public homepage (division selector)
- [ ] Service request form (all 8 divisions)
- [ ] Client dashboard
- [ ] Appointment management
- [ ] Technician tracking (live map)
- [ ] Invoice viewing + payment
- [ ] Service history
- [ ] Account settings

#### **Division-Specific Intake Forms**
- [ ] Plomberie emergency intake
- [ ] Toitures project intake
- [ ] Isolation energy audit intake
- [ ] Conteneurs rental intake
- [ ] Gouttières service intake
- [ ] Patio/Terrasse project intake
- [ ] Maison Cash property intake
- [ ] Construction general contracting intake

#### **Cross-Division Coordination**
- [ ] Multi-division project view
- [ ] Shared resource calendar
- [ ] Cross-division messaging
- [ ] Unified client communication

#### **Inventory Management** (Desktop)
- [ ] Central warehouse view
- [ ] Division stock
- [ ] Truck inventory
- [ ] Parts request workflow
- [ ] Reorder management

#### **Reporting & Analytics** (Desktop)
- [ ] Revenue dashboards
- [ ] Technician productivity
- [ ] Client satisfaction
- [ ] Marketing ROI (Avero)
- [ ] Compliance tracking

### 5.2 Design System Components

**Must Create:**
- Color palette (8 division colors + neutrals)
- Typography scale
- Button styles (primary, secondary, danger, etc.)
- Form inputs (text, select, date, file upload)
- Cards (job cards, KPI cards, division cards)
- Navigation (top nav, sidebar, mobile bottom nav)
- Tables (data tables with sorting, filtering)
- Modals/Dialogs
- Toast notifications
- Loading states
- Empty states
- Error states
- Icons (custom icon set for each division)
- Badges (status indicators, urgency levels)
- Avatars (user profiles, technicians)
- Progress indicators
- Maps (Google Maps integration mockups)

### 5.3 Responsive Breakpoints

- **Mobile**: 320px - 767px (Primary for technician app)
- **Tablet**: 768px - 1023px (Dispatcher on iPad)
- **Desktop**: 1024px+ (Admin, division heads)
- **Large Desktop**: 1920px+ (Operations center displays)

### 5.4 Accessibility Requirements

- WCAG 2.1 Level AA compliance
- Color contrast ratios: 4.5:1 minimum (text), 3:1 (UI elements)
- Keyboard navigation support
- Screen reader friendly
- Touch targets: 44x44px minimum
- Clear focus states

---

## 6. USER FLOWS TO DESIGN

### 6.1 Critical User Journeys

#### **Flow 1: Emergency Plomberie Job (End-to-End)**
1. Client calls emergency line
2. Dispatcher creates emergency job
3. System auto-assigns nearest available CMMTQ technician
4. Technician receives push notification
5. Technician navigates to site
6. Technician starts job, uploads photos
7. Technician requests emergency part
8. Dispatcher approves part rush order
9. Technician completes job, gets signature
10. Invoice auto-generated and sent to client
11. Client pays via portal
12. Follow-up satisfaction survey sent

#### **Flow 2: Multi-Division Project (Roof + Gutters + Insulation)**
1. Client submits request via Construction division
2. Operations manager reviews scope
3. System creates 3 linked jobs (Toitures, Gouttières, Isolation)
4. Each division head approves quote for their portion
5. Combined quote sent to client
6. Client approves online
7. Jobs scheduled in sequence
8. Shared dumpster (Conteneurs) reserved
9. Each division completes their job in order
10. Client receives consolidated invoice
11. Payment processed
12. Project marked complete across all divisions

#### **Flow 3: Technician Onboarding**
1. Applicant submits application (via Avero recruitment)
2. HR admin reviews in ATS
3. Interview scheduled via calendar
4. Background check initiated
5. License verification (CMMTQ/RBQ) auto-checked
6. Offer letter sent digitally
7. Candidate signs offer
8. Onboarding checklist auto-generated
9. Division head assigns mentor
10. New tech receives mobile app credentials
11. First job assigned (shadow shift)
12. Tech becomes active in system

#### **Flow 4: Client Loyalty Program**
1. New client completes first job
2. Account auto-created in client portal
3. Loyalty points awarded (1 point per $100 spent)
4. Client reaches 100 points
5. System sends reward notification (10% off next service)
6. Client books second service with discount code
7. Repeat business triggers VIP status
8. VIP clients get priority scheduling + dedicated dispatcher

---

## 7. DATA VISUALIZATION & ANALYTICS

### 7.1 Key Charts & Graphs to Design

#### **Revenue Analytics**
- Line chart: Revenue by division (last 12 months)
- Bar chart: Monthly revenue vs. target
- Pie chart: Revenue mix by division
- Heatmap: Job density by geographic area

#### **Operational Metrics**
- Gantt chart: Technician schedules
- Calendar heatmap: Jobs per day
- Funnel chart: Lead to conversion
- Speedometer: Customer satisfaction score

#### **Resource Utilization**
- Bar chart: Technician productivity (jobs/day)
- Stacked bar: Hours worked vs. available
- Pie chart: Division capacity utilization
- Line chart: Equipment usage over time

#### **Client Insights**
- Bar chart: Top clients by spend
- Line chart: Client acquisition trend
- Pie chart: Service mix by client segment
- NPS score gauge

---

## 8. COMPLIANCE & LEGAL REQUIREMENTS

### 8.1 License Verification UI

**RBQ/CMMTQ License Tracker:**
```
┌─────────────────────────────────────────────┐
│  LICENSE COMPLIANCE DASHBOARD               │
│                                             │
│  ⚠️ 2 licenses expiring in next 30 days    │
│                                             │
│  Plomberie Michael Lacoste:                 │
│  ├─ Marc Dubois (CMMTQ #12345)             │
│  │  ✅ Valid until: 2027-03-15             │
│  └─ Sophie Martin (CMMTQ #67890)            │
│     ⚠️ Expires: 2026-02-10 (25 days)       │
│                                             │
│  Toitures Jonathan Isabel:                  │
│  ├─ Company RBQ #8241-1234-56              │
│  │  ✅ Valid until: 2027-06-30             │
│  └─ Jonathan Isabel (RBQ #5717-1111-01)    │
│     ✅ Valid until: 2028-01-15             │
│                                             │
│  [Generate Renewal Reminders]               │
│  [Export Compliance Report]                 │
└─────────────────────────────────────────────┘
```

**Features:**
- Auto-import license data from government registries
- Expiration alerts (90, 60, 30, 7 days)
- Block job assignment if license expired
- Audit trail for compliance

### 8.2 Loi 25 (Quebec Privacy Law)

**Data Privacy Controls:**
- Client consent tracking (opt-in for marketing)
- Right to access personal data (client can download)
- Right to deletion (anonymization workflow)
- Data residency indicator (stored in Quebec)
- Privacy policy acknowledgment on signup

**UI Elements:**
- Privacy settings in client portal
- Consent checkboxes in forms
- Data download button
- Account deletion workflow

### 8.3 Warranty & Liability Tracking

**Warranty Management:**
- Warranty period by service type
- Warranty claims tracking
- Automated warranty expiration notices
- Warranty work vs. new work distinction

---

## 9. MOBILE APP SPECIFIC CONSIDERATIONS

### 9.1 Offline Functionality

**Must Work Offline:**
- View today's schedule
- Access job details (cached)
- Take photos (queue for upload)
- Clock in/out
- Start/complete job (sync when online)

**Requires Internet:**
- Receive new job assignments
- Real-time GPS tracking
- Messaging
- Payment processing
- Document downloads

### 9.2 Battery Optimization

- GPS tracking: Use significant location changes, not continuous
- Photo upload: Compress images, batch upload on Wi-Fi
- Background sync: Interval-based, not real-time
- Push notifications: Efficient wake-up

### 9.3 Mobile Gestures

- Swipe right: Accept job
- Swipe left: Request reassignment
- Long press: Quick actions menu
- Pull to refresh: Update job list
- Pinch to zoom: Map view

---

## 10. IMPLEMENTATION PHASES (ROADMAP)

### Phase 1: MVP (Months 1-3)
**Priority Divisions:**
- Plomberie Michael Lacoste (highest volume)
- Toitures Jonathan Isabel (seasonal priority)
- Groupe G. Lafrance Construction (general contracting)

**MVP Features:**
- Basic dispatcher dashboard
- Technician mobile app (core features)
- Client portal (basic)
- Single-division job management
- Manual scheduling (no AI optimization yet)

### Phase 2: Expansion (Months 4-6)
**Add Divisions:**
- Isolation Mike Turmel
- Gouttières et Revêtements Alex Roussin
- Conteneurs Mira

**New Features:**
- Cross-division coordination
- Inventory management
- Advanced reporting
- SYN Engine optimization (auto-scheduling)

### Phase 3: Full Integration (Months 7-9)
**Final Divisions:**
- Patio Terrasse Francis Girard
- Maison Cash (real estate)

**Advanced Features:**
- Avero.cloud marketing integration
- Technician recruitment module
- Predictive analytics
- Multi-division project automation
- Client loyalty program

### Phase 4: Optimization (Months 10-12)
- AI-powered demand forecasting
- Dynamic pricing
- Advanced route optimization
- Integration with external systems (accounting, CRM)
- White-label capability (for partner expansion)

---

## 11. SUCCESS METRICS (KPIs TO TRACK)

### 11.1 Operational Efficiency
- Average response time (emergency jobs): Target <60 min
- Job completion rate: Target >95%
- Technician utilization: Target 75-85%
- First-time fix rate: Target >90%
- On-time arrival: Target >90%

### 11.2 Financial Performance
- Revenue per technician per day: Target $1,500+
- Collection rate: Target >98%
- Average job value: Track trend upward
- Upsell rate: Target 20%

### 11.3 Client Satisfaction
- NPS score: Target >50
- 5-star reviews: Target >80%
- Repeat client rate: Target >40%
- Referral rate: Target >25%

### 11.4 Marketing (Avero)
- Cost per lead: By division
- Lead to conversion: Target >30%
- Marketing ROI: Target 5:1
- Client acquisition cost: Target <$200

### 11.5 Technician Recruitment
- Time to hire: Target <30 days
- Offer acceptance rate: Target >80%
- First-year retention: Target >85%
- Applications per posting: Target >20

---

## 12. BRAND GUIDELINES INTEGRATION

### 12.1 Typography

**Primary Font:** Inter (or similar sans-serif)
- Headings: Inter Bold, 24-32px
- Subheadings: Inter Semibold, 18-20px
- Body: Inter Regular, 14-16px
- Mobile: Scale down by 2px

**Secondary Font (Optional):** Roboto Mono for codes, IDs

### 12.2 Color Palette

**Division Colors** (as defined in section 1.2):
- Each division has primary brand color
- Use at 100%, 80%, 60% opacity for hierarchy

**Neutral Palette:**
- Gray 900: `#1A1A1A` (Primary text)
- Gray 700: `#4A4A4A` (Secondary text)
- Gray 500: `#9E9E9E` (Placeholder text)
- Gray 300: `#D1D1D1` (Borders)
- Gray 100: `#F5F5F5` (Background)
- White: `#FFFFFF`

**Semantic Colors:**
- Success: `#22C55E` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)
- Info: `#3B82F6` (Blue)

**Urgency Indicators:**
- 🔴 Critical: `#DC2626`
- 🟡 Urgent: `#F59E0B`
- 🟢 Normal: `#22C55E`

### 12.3 Iconography

**Custom Icons Needed:**
- Division icons (8 unique)
- Service type icons (plumbing fixtures, roofing, etc.)
- Status icons (pending, active, complete)
- Emergency alert icons
- License/certification badges

**Icon Style:**
- Outline style (2px stroke)
- 24x24px default size
- Consistent corner radius
- Division color on hover

### 12.4 Photography Style

- Authentic job site photos (not stock)
- Technicians in branded uniforms
- Before/after transformations
- Equipment and vehicles
- Happy clients (with permission)

---

## 13. FUTURE ENHANCEMENTS (BEYOND V1)

### 13.1 Advanced Features Roadmap

**AI & Machine Learning:**
- Chatbot for client intake (multilingual: FR/EN)
- Predictive maintenance alerts (IoT integration)
- Fraud detection (anomalous jobs)
- Demand forecasting by division/season

**Client Experience:**
- Mobile app for clients (not just portal)
- In-app video calls (tech to client)
- Augmented reality (AR) for visualizing renovations
- Subscription services (annual maintenance plans)

**Technician Tools:**
- Wearable tech integration (smart glasses for hands-free)
- Voice commands in mobile app
- Gamification (leaderboards, badges)
- Peer-to-peer skill sharing platform

**Business Intelligence:**
- Profitability by job type
- Client lifetime value predictions
- Market basket analysis (which services often purchased together)
- Competitive intelligence dashboard

**Partnerships:**
- White-label for other contractors
- Franchise management module
- Supplier integration (direct ordering)
- Insurance integration (instant quotes for clients)

### 13.2 Geographic Expansion

**Phase 1:** Rive-Sud, Rive-Nord, Montreal (current)
**Phase 2:** Laval, Québec City
**Phase 3:** Ottawa-Gatineau, Sherbrooke, Trois-Rivières
**Phase 4:** Rest of Quebec
**Phase 5:** Ontario expansion

**Multi-Region Features:**
- Regional pricing variations
- Multi-language support (FR/EN)
- Regional compliance (Ontario RBQ equivalent)
- Currency (if expanding to US)

---

## 14. FIGMA FILE ORGANIZATION

### 14.1 Recommended Page Structure

```
📁 MULTI-DIVISION DISPATCH PLATFORM
│
├── 📄 00 - COVER & OVERVIEW
│   ├── Project summary
│   ├── Stakeholder info
│   └── Version history
│
├── 📄 01 - DESIGN SYSTEM
│   ├── Color palette
│   ├── Typography
│   ├── Components
│   ├── Icons
│   └── Spacing & Grid
│
├── 📄 02 - SUPER ADMIN
│   ├── Dashboard
│   ├── Division performance
│   ├── Financial overview
│   ├── User management
│   └── System settings
│
├── 📄 03 - DIVISION HEAD
│   ├── Dashboard (per division)
│   ├── Job board
│   ├── Team management
│   └── Reports
│
├── 📄 04 - DISPATCHER
│   ├── Job board (Kanban)
│   ├── Calendar view
│   ├── Resource panel
│   └── Communication
│
├── 📄 05 - TECHNICIAN MOBILE
│   ├── Login & onboarding
│   ├── Home screen
│   ├── Job list
│   ├── Job detail
│   ├── Photo capture
│   ├── Signature
│   ├── Parts request
│   └── Time tracking
│
├── 📄 06 - CLIENT PORTAL
│   ├── Public homepage
│   ├── Service request forms (8 divisions)
│   ├── Client dashboard
│   ├── Technician tracking
│   ├── Invoices & payment
│   └── Account settings
│
├── 📄 07 - INTAKE FORMS
│   ├── Plomberie
│   ├── Toitures
│   ├── Isolation
│   ├── Conteneurs
│   ├── Gouttières
│   ├── Patio/Terrasse
│   ├── Maison Cash
│   └── Construction
│
├── 📄 08 - CROSS-DIVISION
│   ├── Multi-division project view
│   ├── Shared resource calendar
│   └── Unified client communication
│
├── 📄 09 - INVENTORY
│   ├── Central warehouse
│   ├── Division stock
│   ├── Truck inventory
│   └── Parts request workflow
│
├── 📄 10 - REPORTING & ANALYTICS
│   ├── Revenue dashboards
│   ├── Operational metrics
│   ├── Client insights
│   └── Marketing ROI
│
├── 📄 11 - COMPLIANCE
│   ├── License tracking
│   ├── Privacy controls (Loi 25)
│   └── Warranty management
│
└── 📄 12 - USER FLOWS
    ├── Emergency job flow
    ├── Multi-division project flow
    ├── Technician onboarding flow
    └── Client loyalty flow
```

### 14.2 Component Library Structure

**Atoms:**
- Buttons
- Input fields
- Icons
- Badges
- Avatars
- Checkboxes/radios

**Molecules:**
- Form groups
- Search bars
- Job cards
- KPI cards
- Navigation items

**Organisms:**
- Navigation bars
- Job boards
- Forms (complete)
- Tables
- Modals

**Templates:**
- Dashboard layouts
- Form layouts
- List views
- Detail views

### 14.3 Naming Conventions

**Frames:** `[Screen-Name] - [Device] - [State]`
- Example: `Dispatcher-Dashboard - Desktop - Default`
- Example: `Job-Detail - Mobile - Loading`

**Components:** `[Category]/[Component-Name]`
- Example: `Buttons/Primary-Large`
- Example: `Cards/Job-Card-Urgent`

**Auto Layout:** Use consistently for responsive design

**Variants:** Use for states (default, hover, active, disabled)

---

## 15. COLLABORATION & HANDOFF

### 15.1 Design Review Process

**Stakeholders:**
1. **Gabriel Lafrance** (Super Admin) - Final approval
2. **Division Heads** (8 total) - Division-specific feedback
3. **Synergair Development Team** - Technical feasibility
4. **Avero Marketing Team** - Marketing integration
5. **End Users** (dispatchers, techs) - Usability testing

**Review Cycles:**
- Week 1-2: Wireframes & user flows
- Week 3-4: High-fidelity designs (50% complete)
- Week 5-6: Full designs + interactive prototype
- Week 7: Final review & approval
- Week 8: Developer handoff

### 15.2 Developer Handoff Checklist

- [ ] Design system documented (Figma)
- [ ] All screens designed for 3 breakpoints (mobile, tablet, desktop)
- [ ] Interactive prototype with all key flows
- [ ] Component library with variants
- [ ] Annotations for interactions
- [ ] Asset export (icons, logos, images)
- [ ] Color variables defined
- [ ] Typography scale defined
- [ ] Spacing/grid system documented
- [ ] Animation/transition specs
- [ ] Accessibility notes
- [ ] Edge case designs (loading, error, empty states)

### 15.3 Design Specification Document

For each screen, provide:
1. **Purpose:** What is this screen for?
2. **User Role:** Who accesses this?
3. **Data Source:** Where does data come from?
4. **Actions:** What can the user do?
5. **Validation:** What are the rules?
6. **Error Handling:** What if something fails?
7. **Responsive Behavior:** How does it adapt?
8. **Accessibility:** Special considerations?

---

## 16. TESTING & VALIDATION

### 16.1 Usability Testing Plan

**Test Scenarios:**
1. Dispatcher assigns emergency plumbing job
2. Technician completes job on mobile
3. Client requests multi-division service
4. Super admin reviews division performance
5. Division head approves quote

**Test Users:**
- 2 dispatchers (current employees)
- 3 technicians (different experience levels)
- 5 clients (first-time and repeat)
- 1 super admin (Gabriel Lafrance)
- 2 division heads

**Metrics to Track:**
- Task completion rate
- Time to complete task
- Errors per task
- Satisfaction score (1-10)
- Qualitative feedback

### 16.2 A/B Testing Opportunities

**Candidate Features:**
- Job card layout (vertical vs. horizontal)
- Color coding intensity (bold vs. subtle)
- Navigation placement (top vs. side)
- Mobile button sizes (large vs. extra large)
- Notification frequency (real-time vs. batched)

### 16.3 Pilot Program

**Phase 1:** Single division (Plomberie) for 2 weeks
- 3 dispatchers
- 10 technicians
- 100 jobs

**Metrics:**
- System uptime
- User adoption
- Bug reports
- Feature requests

**Phase 2:** Add 2 more divisions (Toitures, Construction) for 4 weeks
**Phase 3:** Full rollout (all 8 divisions)

---

## 17. SUPPORT & TRAINING

### 17.1 Training Materials Needed

**For Dispatchers:**
- Video: How to create and assign jobs
- PDF: Job board navigation guide
- Interactive demo: Multi-division coordination
- FAQ: Common scenarios

**For Technicians:**
- Video: Mobile app walkthrough
- Cheat sheet: Quick reference card
- Practice mode: Sandbox environment
- In-person: Half-day training session

**For Clients:**
- Video: How to request service
- Infographic: Benefits of client portal
- Email: Welcome email with tips

**For Admins:**
- Comprehensive manual (PDF + online)
- Video series: All modules explained
- Live training: Full-day workshop

### 17.2 In-App Help Features

- Contextual tooltips (first-time user)
- Help center (searchable articles)
- Video tutorials (embedded)
- Live chat support (business hours)
- Feedback button (every screen)

### 17.3 Change Management

**Communication Plan:**
- Month before launch: Announce new system
- 3 weeks before: Start training sessions
- 2 weeks before: Provide early access to volunteers
- 1 week before: Final testing
- Launch day: Go-live support (on-site if needed)
- Week after: Daily check-ins
- Month after: Feedback survey

---

## 18. RISK MITIGATION

### 18.1 Potential Challenges

**Resistance to Change:**
- Mitigation: Involve users early in design process
- Mitigation: Show clear benefits (time savings, revenue increase)
- Mitigation: Provide excellent training and support

**Technical Complexity:**
- Mitigation: Phased rollout (not all divisions at once)
- Mitigation: Robust testing before launch
- Mitigation: Have rollback plan

**Data Migration:**
- Mitigation: Start with new jobs only (legacy data view-only)
- Mitigation: Gradual migration over 6 months
- Mitigation: Data validation checks

**Mobile Connectivity:**
- Mitigation: Offline-capable app
- Mitigation: Optimize for low-bandwidth
- Mitigation: Provide data plans for technicians

**License Compliance:**
- Mitigation: Automated license verification
- Mitigation: Block job assignment if license expired
- Mitigation: Early expiration alerts

### 18.2 Contingency Plans

**If System Goes Down:**
- Backup: Manual dispatch via phone/SMS
- Communication: Pre-written templates for clients
- Recovery: Documented recovery procedures
- SLA: 99.5% uptime target

**If User Adoption is Low:**
- Analysis: User interviews to identify blockers
- Adjustment: Rapid iteration on pain points
- Incentives: Gamification, rewards for early adopters

---

## 19. LEGAL & CONTRACTUAL CONSIDERATIONS

### 19.1 Intellectual Property

**Owned by Synergair:**
- SYN Engine proprietary algorithms
- Platform architecture
- Codebase

**Owned by Groupe G. Lafrance:**
- Division names and logos
- Client data
- Business processes

**Joint Ownership:**
- Custom features built for this specific platform
- Division-specific workflows

### 19.2 Data Ownership & Privacy

**Client Data:**
- Owned by Groupe G. Lafrance
- Hosted on Quebec servers (Loi 25 compliance)
- Synergair has access for platform maintenance only
- Data portability: Client can export at any time

**Analytics & Aggregated Data:**
- Anonymized data can be used by Synergair for benchmarking
- Individual client data never shared without consent

### 19.3 SLA (Service Level Agreement)

**Uptime:**
- Target: 99.5% (less than 3.65 days/year downtime)
- Scheduled maintenance: Off-peak hours, advance notice

**Support Response:**
- Critical (system down): <1 hour
- High (feature broken): <4 hours
- Medium (degraded performance): <24 hours
- Low (feature request): <72 hours

**Data Backup:**
- Frequency: Every 6 hours
- Retention: 90 days
- Tested restore: Monthly

---

## 20. CONCLUSION & NEXT STEPS

### 20.1 Design Priorities

**Must Have (MVP):**
✅ Super admin dashboard  
✅ Dispatcher job board  
✅ Technician mobile app (core features)  
✅ Client portal (basic)  
✅ Single-division job management  
✅ License compliance tracking  

**Should Have (Phase 2):**
⭐ Cross-division coordination  
⭐ Inventory management  
⭐ Advanced reporting  
⭐ Avero marketing integration  

**Nice to Have (Future):**
💡 AI chatbot  
💡 Predictive analytics  
💡 AR visualization  
💡 White-label capability  

### 20.2 Immediate Action Items

1. **Review this document** with Gabriel Lafrance and division heads
2. **Gather feedback** on priorities and must-have features
3. **Begin Figma wireframes** for Super Admin + Dispatcher dashboards
4. **Schedule user interviews** with current dispatchers and technicians
5. **Validate RBQ/CMMTQ requirements** with legal team
6. **Kick off design system** (colors, typography, components)
7. **Create interactive prototype** of critical user flow (emergency job)
8. **Present V1 designs** for approval (target: 4 weeks from start)

### 20.3 Success Criteria

**The platform is successful if:**
- ✅ All 8 divisions are onboarded within 9 months
- ✅ Dispatcher efficiency increases by 30%+
- ✅ Technician job completion rate >95%
- ✅ Client satisfaction (NPS) >50
- ✅ Revenue increases by 35%+ in Year 1
- ✅ Zero compliance violations (RBQ, CMMTQ, Loi 25)
- ✅ 90%+ user adoption within 3 months of launch

---

## APPENDICES

### Appendix A: Glossary of Terms

- **CMMTQ**: Corporation des maîtres mécaniciens en tuyauterie du Québec (plumbing certification)
- **RBQ**: Régie du bâtiment du Québec (general construction licensing)
- **Loi 25**: Quebec's privacy law (similar to GDPR)
- **NEQ**: Numéro d'entreprise du Québec (business number)
- **SYN Engine**: Synergair's proprietary optimization algorithm
- **Avero**: Synergair's marketing automation platform
- **Dispatch**: Assigning jobs to technicians
- **Multi-tenant**: Platform that supports multiple organizations/divisions
- **Kanban**: Visual workflow management (board with columns)

### Appendix B: Competitor Analysis (Brief)

**Existing Solutions:**
- ServiceTitan: Comprehensive but expensive ($300-500/user/month)
- Housecall Pro: Simpler, lacks multi-division support
- Jobber: Good for single trades, not optimized for Quebec market
- FieldEdge: Strong for HVAC, weak for plumbing

**Competitive Advantages of Synergair Platform:**
- ✅ Built specifically for Quebec market (Loi 25, CMMTQ, RBQ)
- ✅ Multi-division coordination (unique)
- ✅ SYN Engine optimization (proprietary)
- ✅ Integrated marketing (Avero)
- ✅ Owned data (not SaaS dependency)

### Appendix C: Reference Screenshots

*(Designer note: Collect screenshots from existing platforms for inspiration)*
- ServiceTitan dispatcher board
- Uber driver app (simple job acceptance)
- DoorDash live tracking (client view)
- Asana project views (multi-division coordination)
- Stripe dashboard (financial reporting)

### Appendix D: Stakeholder Contact List

| Name | Role | Division | Email | Phone |
|------|------|----------|-------|-------|
| Gabriel Lafrance | Owner/Super Admin | All | [redacted] | [redacted] |
| Michael Lacoste | Division Head | Plomberie | [redacted] | [redacted] |
| Jonathan Isabel | Division Head | Toitures | [redacted] | [redacted] |
| Mike Turmel | Division Head | Isolation | [redacted] | [redacted] |
| Mira [Last Name] | Division Head | Conteneurs | [redacted] | [redacted] |
| Alex Roussin | Division Head | Gouttières | [redacted] | [redacted] |
| Francis Girard | Division Head | Patio/Terrasse | [redacted] | [redacted] |
| [Contact] | Division Head | Maison Cash | [redacted] | [redacted] |
| [Synergair Team] | Development | Technology | [redacted] | [redacted] |
| [Avero Team] | Marketing | Acquisition | [redacted] | [redacted] |

---

## FINAL NOTES FOR FIGMA DESIGNER

### What Makes This Platform Unique:

1. **Multi-division but unified**: 8 separate businesses that need to feel like one cohesive platform
2. **Emergency + Scheduled**: Some divisions (Plomberie) need real-time urgency, others (Patio) are project-based
3. **Quebec-specific**: Compliance with local laws (Loi 25, CMMTQ, RBQ) is not optional
4. **Cross-division synergy**: A single client might need 3+ divisions working on one property
5. **Mobile-first for techs**: Technicians live in their trucks, not offices

### Design Philosophy:

- **Clarity over cleverness**: Dispatchers make split-second decisions, UI must be instantly clear
- **Speed over beauty**: Technicians need to complete actions in <30 seconds (per action)
- **Trust through transparency**: Clients must feel informed and in control
- **Data-driven decisions**: Every screen should surface actionable insights

### Questions to Answer During Design:

- How do we make 8 division colors work harmoniously without clashing?
- How do we indicate multi-division projects without confusing users?
- How do we handle edge cases (e.g., technician cancels last minute)?
- How do we make compliance feel helpful, not burdensome?
- How do we balance information density (desktop) vs. simplicity (mobile)?

---

**End of Design Prompt**

**Document Version:** 1.0  
**Last Updated:** January 16, 2026  
**Total Word Count:** ~12,000 words  
**Estimated Design Hours:** 300-400 hours (full platform)  

---

**For questions or clarifications, contact:**  
Synergair Development Team  
Email: info@synergair.ai  
Web: www.synergair.ai
