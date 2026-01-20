# SYNERGAIR x GROUPE G. LAFRANCE DISPATCH PLATFORM

## Complete Technical Architecture & Features Documentation

**Version:** 2.0.0  
**Date:** January 19, 2026  
**Platform Type:** Multi-Division Enterprise Dispatch Management System  
**Technology Stack:** React + TypeScript + Tailwind CSS v4 + shadcn/ui + Konsta UI  
**Architecture:** PWA with Offline-First Capabilities

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Division Architecture](#division-architecture)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Application Architecture](#application-architecture)
5. [Core Features & Modules](#core-features--modules)
6. [Data Models & Types](#data-models--types)
7. [Routing & Navigation](#routing--navigation)
8. [State Management](#state-management)
9. [Design System & Tokens](#design-system--tokens)
10. [API Integrations](#api-integrations)
11. [Offline & PWA Features](#offline--pwa-features)
12. [Quebec Compliance](#quebec-compliance)
13. [File Structure](#file-structure)
14. [Component Inventory](#component-inventory)
15. [Data Flow & Connections](#data-flow--connections)

---

## EXECUTIVE SUMMARY

### Platform Purpose

Unified service operations and dispatch management platform serving **8 distinct service divisions** under the Groupe G. Lafrance ecosystem, powered by Synergair's proprietary SYN Engine technology.

### Key Capabilities

- ✅ Multi-division job dispatching and tracking
- ✅ Real-time GPS technician location monitoring
- ✅ Role-based access control (7 user roles)
- ✅ Division-specific intake forms
- ✅ Cross-division project coordination
- ✅ Client CRM with service history
- ✅ Invoice generation and tracking
- ✅ Analytics and reporting dashboards
- ✅ Mobile technician application
- ✅ Client self-service portal
- ✅ Quebec regulatory compliance (RBQ, CMMTQ, Loi 25)
- ✅ PWA with offline mode
- ✅ Bidding marketplace for subcontractors
- ✅ Thermal heat mapping
- ✅ Remote quoting system

### Technology Highlights

- **Frontend:** React 18.3.1 with TypeScript
- **Styling:** Tailwind CSS v4.1.12 + Konsta UI v5.0.6 (iOS theme)
- **Routing:** React Router v7.10.1
- **UI Components:** shadcn/ui + Radix UI primitives
- **Charts:** Recharts 2.15.2
- **Forms:** React Hook Form 7.55.0
- **Animations:** Motion (Framer Motion) 12.23.24
- **Maps:** Google Maps integration (simulated)
- **PDF Generation:** jsPDF 3.0.4 + html2canvas
- **Payments:** Stripe integration
- **Icons:** Lucide React 0.487.0

---

## DIVISION ARCHITECTURE

### 1. The 8 Service Divisions

| Division ID    | Full Name                              | Primary Contact  | License             | Service Area           | Color Code               |
| -------------- | -------------------------------------- | ---------------- | ------------------- | ---------------------- | ------------------------ |
| `plomberie`    | Plomberie Michaël Lacoste              | Michael Lacoste  | CMMTQ M123456       | Greater Montreal       | `#2B5A8E` (Deep Blue)    |
| `construction` | GAB Lafrance Construction              | Gabriel Lafrance | RBQ 5726.2941.01    | Greater Montreal       | `#1C3D5A` (Navy Blue)    |
| `toitures`     | Les Toitures Jonathan Isabel           | Jonathan Isabel  | RBQ Subcategory 7   | Rive-Sud/Nord/Montreal | `#8B4513` (Saddle Brown) |
| `isolation`    | Isolation Mike Turmel                  | Mike Turmel      | RBQ Subcategory 7   | Greater Montreal       | `#FF8C00` (Dark Orange)  |
| `conteneurs`   | Conteneurs Mira                        | Mira Operations  | Transport Permits   | Greater Montreal       | `#4A7C59` (Forest Green) |
| `gutters`      | Gouttières et Revêtements Alex Roussin | Alex Roussin     | RBQ Subcategory 7   | Greater Montreal       | `#708090` (Slate Gray)   |
| `decks`        | Patio Terrasse Francis Girard          | Francis Girard   | RBQ Subcategory 6   | Greater Montreal       | `#8B7355` (Burlywood)    |
| `real-estate`  | Maison Cash                            | Real Estate Team | Real Estate License | Greater Montreal       | `#DAA520` (Goldenrod)    |

### 2. Division Configuration Data Structure

**Location:** `/src/app/data/divisions.ts`

```typescript
export interface Division {
  id: DivisionType;
  name: string;
  nameFr: string;
  rrbqLicense?: string;
  ccqCertificate?: string;
  active: boolean;
  primaryContact: string;
  emergencyPhone?: string;
  serviceArea: string[]; // Postal code prefixes (H1, J4, etc.)
}
```

### 3. Division-Specific Service Catalogs

Each division has a comprehensive service catalog:

- **Plomberie:** 40 services across 8 categories (Emergency, Installation, Repair, etc.)
- **Construction:** 11 services (Renovation, Structural Repairs, Foundations, etc.)
- **Toitures:** 14 services (Installation, Repair, Inspection, Emergency)
- **Isolation:** 11 services (Attic, Wall, Basement, Energy Audit)
- **Conteneurs:** 9 services (Construction Toilets, Event Toilets, IoT-Optimized)
- **Gutters:** 10 services (Installation, Cleaning, Repair, Cladding)
- **Decks:** 12 services (Wood/Composite Decks, Patios, Gazebos, Pergolas)
- **Real Estate:** Property transactions, valuations, flip consultations

---

## USER ROLES & PERMISSIONS

### 1. Role Hierarchy

```
┌─────────────────────────────────────┐
│       SUPER ADMIN (Level 7)         │
│   Gabriel Lafrance - All Access     │
└─────────────────┬───────────────────┘
                  │
      ┌───────────┴──────────┐
      ▼                      ▼
┌─────────────────┐   ┌──────────────────┐
│  DIVISION HEAD  │   │ OPERATIONS MGR   │
│    (Level 6)    │   │    (Level 5)     │
└────────┬────────┘   └────────┬─────────┘
         │                     │
         └──────────┬──────────┘
                    │
         ┌──────────┴─────────┐
         ▼                    ▼
┌────────────────┐    ┌───────────────┐
│  DISPATCHER    │    │  TECHNICIAN   │
│   (Level 4)    │    │   (Level 3)   │
└────────────────┘    └───────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │    CLIENT    │
                      │   (Level 1)  │
                      └──────────────┘
```

### 2. Role Definitions

#### UserRole Type

```typescript
type UserRole =
  | "super-admin"
  | "division-head"
  | "operations-manager"
  | "admin"
  | "dispatcher"
  | "technician"
  | "client";
```

#### Mock Users (AuthContext)

**Location:** `/src/app/context/AuthContext.tsx`

```typescript
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "gabriel@lafrance.com",
    name: "Gabriel Lafrance",
    role: "super-admin",
    divisions: [
      "plomberie",
      "construction",
      "toitures",
      "isolation",
      "conteneurs",
      "gutters",
      "decks",
      "real-estate",
    ], // All 8 divisions
  },
  {
    id: "2",
    email: "michael@lafrance.com",
    name: "Michael Lacoste",
    role: "division-head",
    division: "plomberie",
    divisions: ["plomberie"],
    license: "CMMTQ M123456",
  },
  // ... 6 more users
];
```

### 3. Permission Matrix

| Feature                  | Super Admin | Div Head | Ops Mgr | Admin   | Dispatcher | Tech | Client   |
| ------------------------ | ----------- | -------- | ------- | ------- | ---------- | ---- | -------- |
| View All Divisions       | ✅          | ❌       | ✅      | Partial | ❌         | ❌   | ❌       |
| Super Admin Dashboard    | ✅          | ❌       | ❌      | ❌      | ❌         | ❌   | ❌       |
| Multi-Division Dashboard | ✅          | ❌       | ✅      | ✅      | ❌         | ❌   | ❌       |
| Cross-Division Projects  | ✅          | ✅       | ✅      | ✅      | ❌         | ❌   | ❌       |
| Dispatch Center          | ✅          | ✅       | ✅      | ✅      | ✅         | ❌   | ❌       |
| Assign Jobs              | ✅          | ✅       | ✅      | ✅      | ✅         | ❌   | ❌       |
| Complete Jobs            | ❌          | ❌       | ❌      | ❌      | ❌         | ✅   | ❌       |
| View Invoices            | ✅          | ✅       | ✅      | ✅      | ✅         | ✅   | Own Only |
| Create Invoices          | ✅          | ✅       | ✅      | ✅      | ✅         | ❌   | ❌       |
| System Settings          | ✅          | ✅       | ❌      | ✅      | ❌         | ❌   | ❌       |
| Integrations             | ✅          | ❌       | ❌      | ✅      | ❌         | ❌   | ❌       |
| Analytics                | ✅          | ✅       | ✅      | ✅      | ✅         | ❌   | ❌       |

---

## APPLICATION ARCHITECTURE

### 1. Core Technology Stack

**Root Application:** `/src/app/App.tsx`

```typescript
// Wrapper Hierarchy
<ErrorBoundary>
  <KonstaApp theme="ios">
    <AuthProvider>
      <BrowserRouter>
        <AppProvider>
          <Toaster position="top-right" />
          <AppRoutes />
          <OfflineIndicator />
        </AppProvider>
      </BrowserRouter>
    </AuthProvider>
  </KonstaApp>
</ErrorBoundary>
```

### 2. Context Providers

#### AuthContext (`/src/app/context/AuthContext.tsx`)

- **Purpose:** User authentication and session management
- **State:**
  - `user: User | null` - Current authenticated user
  - `isAuthenticated: boolean` - Auth status
  - `isLoading: boolean` - Loading state
  - `activeDivision: DivisionType | null` - Current selected division
- **Methods:**
  - `login(email, password, division?)` - Authenticate user
  - `logout()` - Clear session
  - `register(userData)` - Client registration
  - `setActiveDivision(division)` - Switch divisions
  - `hasRole(role)` - Check user role
  - `canAccessDivision(division)` - Check division access

#### AppContext (`/src/app/context/AppContext.tsx`)

- **Purpose:** Global application state
- **State:**
  - `jobs: Job[]` - All jobs
  - `technicians: Technician[]` - All technicians
  - `clients: Client[]` - All clients
  - `invoices: Invoice[]` - All invoices
  - `quoteSubmissions: QuoteSubmission[]` - Quote requests
  - `divisionJobs` - Filtered jobs for active division
  - `divisionTechnicians` - Filtered technicians
  - `divisionInvoices` - Filtered invoices
- **Methods:**
  - `addJob()`, `updateJob()`, `deleteJob()`
  - `addClient()`, `updateClient()`
  - `addTechnician()`, `updateTechnician()`
  - `addInvoice()`, `updateInvoice()`
  - `addQuoteSubmission()`, `updateQuoteSubmission()`

### 3. Division Filtering Logic

```typescript
// Automatic filtering based on activeDivision
const divisionJobs = activeDivision
  ? jobs.filter((job) => job.division === activeDivision)
  : jobs;

const divisionTechnicians = activeDivision
  ? technicians.filter(
      (tech) => tech.division === activeDivision,
    )
  : technicians;
```

### 4. Error Suppression System

**Purpose:** Suppress Figma Make internal errors while allowing real errors

**Location:** `/src/app/App.tsx` (lines 54-169)

Suppressed patterns:

- `webpack-artifacts`
- `code_components_preview_iframe`
- `figma.com`
- `service-worker` errors
- `IndexedDB` errors
- Offline storage errors

---

## CORE FEATURES & MODULES

### 1. SERVICE REQUEST INTAKE MODULE

**Division-Specific Forms:** `/src/app/components/intake/`

Each division has a custom intake form:

| Division     | Form Component               | Key Fields                                                               |
| ------------ | ---------------------------- | ------------------------------------------------------------------------ |
| Plomberie    | `PlomberieIntakeForm.tsx`    | Emergency level, problem type, after-hours surcharge, CMMTQ verification |
| Construction | `ConstructionIntakeForm.tsx` | Project scope, size, permits, engineering required                       |
| Toitures     | `ToituresIntakeForm.tsx`     | Roof type, area, access requirements, weather window                     |
| Isolation    | `IsolationIntakeForm.tsx`    | Area to insulate, R-value, energy audit, grant eligibility               |
| Conteneurs   | `ConteneursIntakeForm.tsx`   | Container size, duration, material type, permit requirements             |
| Gutters      | `GouttiereIntakeForm.tsx`    | Service type, linear feet, stories, material preference                  |
| Decks        | `PatioIntakeForm.tsx`        | Project type, square footage, material, elevation                        |
| Real Estate  | `MaisonCashIntakeForm.tsx`   | Transaction type, property type, timeline, financing                     |

**Router:** `DivisionIntakeRouter.tsx` - Dynamically routes to correct form based on division

### 2. DISPATCHER DASHBOARD

**Location:** `/src/app/pages/DispatchCenter.tsx`

**Layout:**

```
┌────────────────────────────────────────────────────────┐
│  Top Bar: Division Selector | Date | Notifications    │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ INCOMING │ │ ASSIGNED │ │IN PROGRESS│ │COMPLETED│ │
│  │          │ │          │ │           │ │         │ │
│  │ [Jobs]   │ │ [Jobs]   │ │  [Jobs]   │ │ [Jobs]  │ │
│  └──────────┘ └──────────┘ └───────────┘ └─────────┘ │
│                                                        │
│  Right Sidebar:                                        │
│  ┌────────────────────────┐                           │
│  │ Available Technicians  │                           │
│  │ - Marc (Available) ✅  │                           │
│  │ - Jean (On Job) 🔵     │                           │
│  └────────────────────────┘                           │
└────────────────────────────────────────────────────────┘
```

**Features:**

- Drag-and-drop job assignment (React DnD)
- Real-time job status updates
- Division color-coded job cards
- Technician availability panel
- Quick filters (Emergency, Same-day, Scheduled)

**Job Card Structure:**

```typescript
interface JobCard {
  jobId: string;
  division: DivisionType; // Color-coded header
  priority: "low" | "normal" | "high" | "urgent";
  client: {
    name: string;
    address: string;
    phone: string;
  };
  technician?: {
    name: string;
    avatar: string;
    eta: string;
  };
  estimatedValue: string;
  actions: ["View", "Message", "Reassign"];
}
```

### 3. MOBILE TECHNICIAN APP

**Main Entry:** `/src/app/pages/mobile/MobileTechApp.tsx`

**Routes:**

- `/mobile/home` - Today's schedule
- `/mobile/job/:id` - Job details
- `/mobile/active-job` - Active job tracking
- `/mobile/completion` - Job completion flow
- `/mobile/service-form` - Division-specific service forms
- `/mobile/estimator` - On-site price calculator
- `/mobile/messages` - Communication hub
- `/mobile/profile` - Technician profile

**Key Features:**

- ✅ Offline-capable job data
- ✅ GPS location tracking (simulated)
- ✅ Digital signature capture (`react-signature-canvas`)
- ✅ Photo upload (before/during/after)
- ✅ Time tracking (clock in/out)
- ✅ Parts/equipment requests
- ✅ Voice-to-text notes
- ✅ Navigation integration

**Job Completion Flow:**

```
1. Start Job → Timer starts, dispatcher notified
2. Add Photos → Before photos (required)
3. Add Notes → Voice or text
4. Request Parts → Barcode scan
5. Complete Work → During/After photos
6. Client Signature → Digital signature pad
7. Generate Invoice → Auto-calculation
8. Submit → Sync to server
```

### 4. CLIENT PORTAL

**Public Portal:** `/src/app/pages/portal/CustomerPortal.tsx`

**Authenticated Portal:** `/src/app/pages/portal/ClientPortalMain.tsx`

**Routes:**

- `/portal/` - Division selector landing page
- `/portal/home` - Service request forms
- `/portal/booking` - Appointment booking
- `/portal/invoices` - Invoice history
- `/portal/settings` - Account settings
- `/client-portal/dashboard` - Logged-in dashboard
- `/client-portal/requests` - Service requests
- `/client-portal/messages` - Communication
- `/client-portal/payments` - Payment history

**Client Dashboard Features:**

- Active jobs overview
- Real-time technician tracking (map view)
- Service history with photos
- Digital invoices + Stripe payments
- Quote approvals
- Multi-property support (landlords)
- Referral tracking
- Loyalty rewards program

### 5. SUPER ADMIN DASHBOARD

**Location:** `/src/app/pages/SuperAdminDashboard.tsx`

**Access:** Super Admin only (`gabriel@lafrance.com`)

**Key Sections:**

#### Top KPI Cards

```typescript
interface KPI {
  todayRevenue: number; // $42,350 ↑18%
  monthlyTarget: number; // 68% ($340K)
  activeJobs: number; // 127 (8 emergency)
  satisfaction: number; // 4.8/5.0 ⭐ ↑0.2
}
```

#### Division Performance Matrix

Real-time table showing:

- Jobs today per division
- Revenue per division
- Technician utilization %
- Issues/alerts

#### Resource Allocation Map

- Live map of all 8 divisions
- Technician locations (color-coded)
- Job density heatmap
- Service area coverage

#### Financial Deep Dive

- Revenue by division (YoY comparison)
- Profit margins
- Accounts receivable aging
- Cash flow projection
- Top clients by spend

#### Compliance Dashboard

- License expiration tracking (RBQ, CMMTQ)
- Insurance certificate status
- Safety incidents log
- Customer complaints
- Quality checklist completion rates

### 6. CROSS-DIVISION COORDINATION

**Location:** `/src/app/pages/CrossDivisionProjects.tsx`

**Purpose:** Coordinate multi-service jobs across divisions

**Example Scenario:**

```
Client needs: Roof replacement + gutters + attic insulation

System creates:
1. Toitures job (roof) - Days 3-5
2. Isolation job (attic) - Days 1-2 (before roof)
3. Gutters job (gutters) - Day 6 (after roof)
4. Shared: Conteneurs (1 dumpster for all)

Unified invoice: $32,500 total
```

**Features:**

- Automatic phase sequencing
- Dependency tracking
- Shared resource allocation (equipment, dumpsters)
- Single point of contact for client
- Consolidated invoicing
- Progress tracking across phases

### 7. BIDDING MARKETPLACE

**Location:** `/src/app/pages/BiddingMarketplace.tsx`

**Purpose:** Subcontractor bidding system for overflow work

**Workflow:**

1. Division posts job to marketplace
2. Pre-qualified contractors receive notification
3. Contractors submit bids with timeline
4. Division head reviews and awards
5. Progress tracking and payment

**Features:**

- Contractor profiles with ratings
- Bid comparison matrix
- Automated notifications
- Performance tracking
- Payment escrow (integration ready)

### 8. THERMAL HEAT MAPPING

**Location:** `/src/app/pages/ThermalHeatMap.tsx`

**Purpose:** Visual heat map of service demand by area

**Features:**

- Interactive Montreal area map
- Color-coded demand density
- Division-specific overlays
- Time-based filtering (hourly/daily/weekly)
- Predictive analytics
- Route optimization suggestions

### 9. REMOTE QUOTING

**Location:** `/src/app/pages/RemoteQuoting.tsx`

**Purpose:** AI-assisted remote quote generation

**Features:**

- Photo upload for assessment
- Video call integration (simulated)
- Measurement tools (image annotation)
- Instant quote calculator
- Material cost database
- Labor time estimation
- PDF quote generation
- Client e-signature

### 10. INVOICING SYSTEM

**Location:** `/src/app/pages/Invoices.tsx` + `/src/app/pages/InvoiceDetail.tsx`

**Features:**

- Auto-generation from completed jobs
- Division-specific templates
- Line item breakdown
- Tax calculation (QST + GST)
- Payment tracking
- Overdue alerts
- Stripe integration
- PDF export
- Email delivery
- Multi-currency support

**Invoice Statuses:**

- `draft` - Created but not sent
- `sent` - Emailed to client
- `viewed` - Client opened
- `paid` - Payment received
- `overdue` - Past due date
- `cancelled` - Voided

### 11. ANALYTICS & REPORTING

**Location:** `/src/app/pages/Analytics.tsx`

**Charts & Visualizations:**

1. **Revenue Line Chart** (Recharts)
   - Last 7/30/90 days
   - YoY comparison
   - Division breakdown

2. **Service Mix Pie Chart**
   - Revenue by service type
   - Job count by type
   - Division comparison

3. **Technician Productivity**
   - Jobs completed per tech
   - Average job duration
   - Customer ratings
   - Revenue per tech

4. **Geographic Heat Map**
   - Service density by postal code
   - Revenue by area
   - Travel time analysis

5. **Client Acquisition Funnel**
   - Lead sources
   - Conversion rates
   - Cost per acquisition
   - Lifetime value

6. **Compliance Metrics**
   - License compliance %
   - Safety incident rate
   - Warranty claim rate
   - Quality score

### 12. PROPERTY PASSPORTS

**Location:** `/src/app/pages/PropertyPassports.tsx`

**Purpose:** Comprehensive property service history database

**Features:**

- Full service history per property
- Equipment installed (water heater, furnace, etc.)
- Warranty tracking
- Maintenance schedules
- Photo documentation
- Multi-division service timeline
- Property value impact reports
- Transferable to new owners

---

## DATA MODELS & TYPES

### 1. Core Type Definitions

**Location:** `/src/app/types/index.ts`

```typescript
// Job Management
export type JobStatus =
  | "pending"
  | "assigned"
  | "en-route"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "on-hold";

export type JobPriority = "low" | "normal" | "high" | "urgent";

export interface Job {
  id: string;
  clientId: string;
  client: {
    name: string;
    address: string;
    phone: string;
  };
  technicianId?: string;
  technician?: {
    name: string;
    avatar?: string;
  };
  status: JobStatus;
  priority: JobPriority;
  serviceType: ServiceType;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // minutes
  amount?: number;
  rating?: number;
  division: DivisionType;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Technician Management
export type TechnicianStatus =
  | "available"
  | "busy"
  | "en-route"
  | "off-duty";

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  status: TechnicianStatus;
  division: DivisionType;
  currentJob?: string;
  todayJobs: number;
  completedJobs: number;
  rating: number;
  skills: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

// Client Management
export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  type: "residential" | "commercial";
  totalSpent: number;
  lastService?: string;
  equipment: string[];
  divisions?: DivisionType[]; // Cross-division services
}

// Invoice Management
export interface Invoice {
  id: string;
  jobId: string;
  clientId: string;
  division: DivisionType;
  amount: number;
  status:
    | "draft"
    | "sent"
    | "viewed"
    | "paid"
    | "overdue"
    | "cancelled";
  dueDate: string;
  paidDate?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
}
```

### 2. Division Types

**Location:** `/src/app/types/user.ts`

```typescript
export type DivisionType =
  | "plomberie"
  | "construction"
  | "toitures"
  | "isolation"
  | "conteneurs"
  | "gutters"
  | "decks"
  | "real-estate";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  division?: DivisionType; // Primary division
  divisions?: DivisionType[]; // All accessible divisions
  phone: string;
  license?: string; // RBQ/CMMTQ license number
  active: boolean;
  createdAt: string | Date;
  lastLogin?: string | Date;
}
```

### 3. Compliance Types

**Location:** `/src/app/types/compliance.ts`

```typescript
export interface ComplianceRecord {
  id: string;
  division: DivisionType;
  licenseType: 'RBQ' | 'CMMTQ' | 'Real Estate' | 'Transport';
  licenseNumber: string;
  holderName: string;
  expiryDate: string;
  status: 'active' | 'expiring' | 'expired' | 'suspended';
  verifiedDate: string;
}

export interface SafetyIncident {
  id: string;
  date: string;
  division: DivisionType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  injuries: boolean;
  reportedTo: string[]; // CNESST, etc.
  corrective Actions: string;
  status: 'open' | 'investigating' | 'resolved';
}

export interface Loi25Consent {
  clientId: string;
  consentDate: string;
  dataUsage: string[];
  marketingConsent: boolean;
  thirdPartySharing: boolean;
  revocable: boolean;
  signature: string;
}
```

---

## ROUTING & NAVIGATION

### 1. Route Structure

**Main Router:** `/src/app/App.tsx` (AppRoutes component)

```typescript
// Authentication Routes (Public)
/login                    → Login
/client-login             → ClientLogin
/client-register          → ClientRegistration
/2fa                      → TwoFactorAuth
/reset-password           → PasswordReset

// Mobile App Routes
/mobile/login             → MobileLogin
/mobile/*                 → MobileTechApp (sub-routes)

// Customer Portal Routes
/portal/*                 → CustomerPortal
/client-portal/*          → ClientPortalMain

// Protected Dashboard Routes (requires auth)
/                         → Role-based redirect:
                            - technician → /profile
                            - client → /client-portal
                            - super-admin → /super-admin
                            - others → Dashboard

/super-admin              → SuperAdminDashboard (super-admin only)
/multi-division           → MultiDivisionDashboard (admin+)
/cross-division-projects  → CrossDivisionProjects (admin+)
/dispatch                 → DispatchCenter (dispatcher+)
/technicians              → Technicians (dispatcher+)
/technicians/:id          → TechnicianDetail
/clients                  → Clients (dispatcher+)
/clients/:id              → ClientDetail
/map                      → MapView (dispatcher+)
/invoices                 → Invoices (dispatcher+)
/invoices/:id             → InvoiceDetail
/analytics                → Analytics (dispatcher+)
/settings                 → Settings (admin only)
/integrations             → Integrations (super-admin only)
/soumissions              → Soumissions (quotes)
/soumissions/new          → SoumissionsNew
/reviews                  → Reviews
/property-passports       → PropertyPassports
/property-passports/:id   → PropertyPassportDetail
/maintenance-contracts    → MaintenanceContracts
/notifications            → Notifications
/thermal-heat-map         → ThermalHeatMap
/remote-quoting           → RemoteQuoting
/bidding-marketplace      → BiddingMarketplace
/contractor-bids          → ContractorBids
/help                     → Help (all users)
/profile                  → TechnicianProfile (all users)
```

### 2. Route Protection

**ProtectedRoute Component:**

```typescript
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}
```

**RoleProtectedRoute Component:**

```typescript
function RoleProtectedRoute({
  children,
  allowedRoles
}: {
  children: ReactNode;
  allowedRoles: UserRole[];
}) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }
  return children;
}
```

### 3. Navigation Components

**DashboardLayout** (`/src/app/components/layouts/DashboardLayout.tsx`)

**Sidebar Navigation Items:**

```typescript
const navigationItems = [
  // Super Admin Only
  {
    name: "Super Admin",
    icon: Crown,
    path: "/super-admin",
    roles: ["super-admin"],
  },

  // Multi-Division
  {
    name: "Multi-Division",
    icon: Building2,
    path: "/multi-division",
    roles: ["super-admin", "operations-manager", "admin"],
  },

  // Standard Items
  { name: "Dashboard", icon: Home, path: "/" },
  { name: "Dispatch", icon: Radio, path: "/dispatch" },
  { name: "Jobs", icon: ClipboardList, path: "/dispatch" },
  { name: "Technicians", icon: Users, path: "/technicians" },
  { name: "Clients", icon: UserCircle, path: "/clients" },
  { name: "Map", icon: MapPin, path: "/map" },
  { name: "Invoices", icon: FileText, path: "/invoices" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  {
    name: "Cross-Division",
    icon: Network,
    path: "/cross-division-projects",
  },
  {
    name: "Thermal Heat Map",
    icon: Flame,
    path: "/thermal-heat-map",
  },
  {
    name: "Remote Quoting",
    icon: Video,
    path: "/remote-quoting",
  },
  {
    name: "Bidding Marketplace",
    icon: Gavel,
    path: "/bidding-marketplace",
  },
  { name: "Soumissions", icon: FileEdit, path: "/soumissions" },
  { name: "Reviews", icon: Star, path: "/reviews" },
  {
    name: "Property Passports",
    icon: Home,
    path: "/property-passports",
  },
  {
    name: "Maintenance",
    icon: Calendar,
    path: "/maintenance-contracts",
  },
  { name: "Settings", icon: Settings, path: "/settings" },
  { name: "Help", icon: HelpCircle, path: "/help" },
];
```

**Division Switcher Component:**

```tsx
<DivisionSwitcher
  activeDivision={activeDivision}
  onDivisionChange={handleDivisionChange}
  userDivisions={user.divisions}
/>
```

---

## STATE MANAGEMENT

### 1. React Context Architecture

**Global State Flow:**

```
┌──────────────────┐
│   AuthContext    │ ← User authentication & division selection
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   AppContext     │ ← Jobs, Technicians, Clients, Invoices
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  DashboardLayout │ ← UI state & navigation
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Page Components │ ← Feature-specific state
└──────────────────┘
```

### 2. Data Initialization

**MockData Import:** `/src/app/data/mockData.ts`

```typescript
// AppContext useEffect
useEffect(() => {
  const loadData = async () => {
    const mockData = await import("../data/mockData");
    setJobs(mockData.mockJobs || []);
    setTechnicians(mockData.mockTechnicians || []);
    setClients(mockData.mockClients || []);
    setInvoices(mockData.mockInvoices || []);

    // Load from localStorage
    const localQuotes = JSON.parse(
      localStorage.getItem("quoteSubmissions") || "[]",
    );
    setQuoteSubmissions([
      ...mockData.mockQuoteSubmissions,
      ...localQuotes,
    ]);

    setIsInitialized(true);
  };

  loadData();
}, []);
```

### 3. Division Filtering

**Automatic filtering in AppContext:**

```typescript
const divisionJobs = activeDivision
  ? jobs.filter((job) => job.division === activeDivision)
  : jobs;

const divisionTechnicians = activeDivision
  ? technicians.filter(
      (tech) => tech.division === activeDivision,
    )
  : technicians;

const divisionInvoices = activeDivision
  ? invoices.filter((inv) => inv.division === activeDivision)
  : invoices;
```

### 4. Local Storage Persistence

**Stored Data:**

- `currentUser` - Authenticated user session
- `quoteSubmissions` - Client quote requests
- `registeredClients` - Client registration data
- `pending_jobs` - Offline job queue
- `pending_photos` - Offline photo uploads
- `pending_signatures` - Offline signatures
- `pending_time_entries` - Offline time tracking

**Offline Storage Utility:** `/src/app/utils/offlineStorage.ts`

```typescript
export const offlineStorage = {
  async saveJobOffline(job: Job): Promise<void> {
    const db = await openDB("lacoste-dispatch", 1);
    await db.put("pending_jobs", job, job.id);
  },

  async getUnsyncedJobs(): Promise<Job[]> {
    const db = await openDB("lacoste-dispatch", 1);
    return db.getAll("pending_jobs");
  },

  async syncPendingData(): Promise<void> {
    // Sync all offline data when online
  },
};
```

---

## DESIGN SYSTEM & TOKENS

### 1. Color System

**Primary Theme:** Black & White with Brand Accents

**CSS Variables:** `/src/styles/theme.css`

```css
:root {
  /* Black & White Core */
  --primary-black: #000000;
  --secondary-black: #1a1a1a;
  --dark-gray: #2d2d2d;
  --medium-gray: #6b7280;
  --light-gray: #f3f4f6;

  /* Brand Accent Colors */
  --flame-red: #e74c3c;
  --flame-orange: #e67e22;

  /* Semantic Colors */
  --primary: #000000;
  --primary-foreground: #ffffff;
  --secondary: #f3f4f6;
  --destructive: #e74c3c;
  --warning: #e67e22;
  --success: #28a745;

  /* Division-Specific Colors (programmatic) */
  --division-plomberie: #2b5a8e;
  --division-construction: #1c3d5a;
  --division-toitures: #8b4513;
  --division-isolation: #ff8c00;
  --division-conteneurs: #4a7c59;
  --division-gutters: #708090;
  --division-decks: #8b7355;
  --division-real-estate: #daa520;

  /* UI Elements */
  --background: #ffffff;
  --foreground: #000000;
  --border: #e5e7eb;
  --input-background: #f9fafb;
  --radius: 0.5rem;

  /* Sidebar */
  --sidebar: #000000;
  --sidebar-foreground: #ffffff;
  --sidebar-border: #1a1a1a;
}
```

### 2. Division Color Mapping

**Function:** `getDivisionColor(division: DivisionType)`

```typescript
const getDivisionColor = (division: string | null) => {
  const colors: Record<string, string> = {
    plomberie: "#2B5A8E", // Deep Blue
    construction: "#1C3D5A", // Navy Blue
    toitures: "#8B4513", // Saddle Brown
    isolation: "#FF8C00", // Dark Orange
    conteneurs: "#4A7C59", // Forest Green
    gutters: "#708090", // Slate Gray
    decks: "#8B7355", // Burlywood
    "real-estate": "#DAA520", // Goldenrod
  };
  return colors[division || ""] || "#6B7280";
};
```

### 3. Typography

**Base Font Size:** 16px

**Heading Scale:**

```css
h1 {
  font-size: var(--text-2xl);
  font-weight: 500;
}
h2 {
  font-size: var(--text-xl);
  font-weight: 500;
}
h3 {
  font-size: var(--text-lg);
  font-weight: 500;
}
h4 {
  font-size: var(--text-base);
  font-weight: 500;
}
```

**Font Weights:**

- Normal: 400
- Medium: 500 (headings, buttons, labels)

### 4. Component Variants

**shadcn/ui Components:** `/src/app/components/ui/`

All components use `class-variance-authority` (CVA) for variant management.

**Button Variants:**

```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      outline: "border border-input bg-background",
      secondary: "bg-secondary text-secondary-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
});
```

### 5. Konsta UI Integration

**Theme:** iOS-style components

**Wrapper:** `/src/app/App.tsx`

```tsx
<KonstaApp theme="ios">{/* App content */}</KonstaApp>
```

**Konsta Components Used:**

- `Page`, `Navbar`, `NavbarBackLink`
- `List`, `ListItem`, `ListInput`
- `Card`, `CardHeader`, `CardContent`
- `Button`, `Link`
- `Toolbar`, `Tabbar`, `TabbarLink`
- `Popup`, `Sheet`

**Styles:** `/src/styles/konsta-ios.css`

### 6. Responsive Breakpoints

**Tailwind Default Breakpoints:**

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

**Custom Hook:** `/src/app/hooks/useMediaQuery.ts`

```typescript
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
```

---

## API INTEGRATIONS

### 1. Integration Service

**Location:** `/src/app/services/integrations/IntegrationService.ts`

**Supported Integrations:**

- QuickBooks (accounting)
- Stripe (payments)
- Twilio (SMS)
- SendGrid (email)
- Google Maps (mapping)
- Avero.cloud (marketing)

**Integration Types:**

```typescript
export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  status: "active" | "inactive" | "error" | "pending";
  config: Record<string, any>;
  lastSync?: string;
  webhookUrl?: string;
}

export type IntegrationType =
  | "accounting" // QuickBooks
  | "payment" // Stripe
  | "communication" // Twilio, SendGrid
  | "mapping" // Google Maps
  | "marketing" // Avero
  | "crm" // Salesforce (future)
  | "project"; // Monday.com (future);
```

### 2. Webhook Handler

**Location:** `/src/app/services/integrations/WebhookHandler.ts`

**Purpose:** Handle incoming webhooks from external services

```typescript
export class WebhookHandler {
  async handleStripeWebhook(event: any): Promise<void> {
    switch (event.type) {
      case "payment_intent.succeeded":
        await this.handlePaymentSuccess(event.data.object);
        break;
      case "payment_intent.failed":
        await this.handlePaymentFailure(event.data.object);
        break;
    }
  }

  async handleQuickBooksWebhook(event: any): Promise<void> {
    // Sync invoice/payment data
  }

  async handleTwilioWebhook(event: any): Promise<void> {
    // Handle SMS delivery status
  }
}
```

### 3. Stripe Integration

**Payment Flow:**

```typescript
// Client Portal Payment
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_...");

function PaymentForm({ invoice }: { invoice: Invoice }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    const { error, paymentIntent } =
      await stripe.confirmCardPayment(invoice.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

    if (paymentIntent.status === "succeeded") {
      // Update invoice status
      updateInvoice(invoice.id, { status: "paid" });
    }
  };
}
```

### 4. Google Maps Integration

**Map View Component:** `/src/app/pages/MapView.tsx`

**Simulated Implementation:**

```typescript
// Production would use @react-google-maps/api
const markers = technicians.map((tech) => ({
  id: tech.id,
  position: { lat: tech.location.lat, lng: tech.location.lng },
  icon: getDivisionColor(tech.division),
  label: tech.name,
}));

// Real-time location updates
useEffect(() => {
  const interval = setInterval(() => {
    updateTechnicianLocations();
  }, 10000); // Every 10 seconds

  return () => clearInterval(interval);
}, []);
```

### 5. SMS/Email Notifications

**Twilio SMS:**

```typescript
export async function sendSMS(to: string, message: string) {
  const response = await fetch('/api/twilio/send', {
    method: 'POST',
    body: JSON.stringify({
      to: formatPhoneNumber(to),
      body: message,
    }),
  });
  return response.json();
}

// Use cases:
- Job assignment notification to technician
- ETA update to client
- Invoice reminder
- Appointment confirmation
```

**SendGrid Email:**

```typescript
export async function sendEmail(options: EmailOptions) {
  const response = await fetch('/api/email/send', {
    method: 'POST',
    body: JSON.stringify({
      to: options.to,
      from: 'noreply@lafrance.com',
      subject: options.subject,
      html: options.html,
      attachments: options.attachments, // PDF invoices
    }),
  });
  return response.json();
}

// Templates:
- Invoice delivery
- Quote submission
- Appointment reminders
- Service completion summary
- Marketing campaigns
```

---

## OFFLINE & PWA FEATURES

### 1. Service Worker

**Location:** `/public/service-worker.js`

**Registration:** `/src/app/utils/registerServiceWorker.ts`

```typescript
export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration =
        await navigator.serviceWorker.register(
          "/service-worker.js",
        );
      console.log(
        "✅ Service Worker registered:",
        registration.scope,
      );
    } catch (error) {
      console.error(
        "❌ Service Worker registration failed:",
        error,
      );
    }
  }
}
```

**Capabilities:**

- Offline page caching
- API response caching
- Background sync
- Push notifications
- Install prompt

### 2. Offline Indicator

**Component:** `/src/app/components/OfflineIndicator.tsx`

```tsx
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-warning p-2 text-center">
      ⚠️ Mode hors ligne - Les données seront synchronisées lors
      de la reconnexion
    </div>
  );
}
```

### 3. PWA Manifest

**Location:** `/public/manifest.json`

```json
{
  "name": "Synergair x Groupe G. Lafrance Dispatch",
  "short_name": "Lafrance Dispatch",
  "description": "Multi-division service dispatch platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 4. Offline Data Sync

**IndexedDB Schema:**

```typescript
const DB_NAME = "lacoste-dispatch";
const DB_VERSION = 1;

// Object Stores:
-pending_jobs -
  pending_photos -
  pending_signatures -
  pending_time_entries -
  pending_notes -
  cached_clients -
  cached_jobs;
```

**Sync Logic:**

```typescript
export async function syncOfflineData() {
  if (!navigator.onLine) return;

  const pendingJobs = await offlineStorage.getUnsyncedJobs();

  for (const job of pendingJobs) {
    try {
      await fetch("/api/jobs", {
        method: "POST",
        body: JSON.stringify(job),
      });
      await offlineStorage.removeJob(job.id);
      toast.success(`Job ${job.id} synced`);
    } catch (error) {
      console.error("Sync failed:", error);
    }
  }
}
```

### 5. Install Prompt

**Setup:** `/src/app/utils/registerServiceWorker.ts`

```typescript
export function setupPWAInstallPrompt() {
  let deferredPrompt: any;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show custom install button
    showInstallPrompt(() => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          toast.success("Application installée!");
        }
        deferredPrompt = null;
      });
    });
  });
}
```

---

## QUEBEC COMPLIANCE

### 1. License Tracking

**RBQ (Régie du bâtiment du Québec):**

```typescript
interface RBQLicense {
  number: string;          // e.g., "5726.2941.01"
  category: string;        // e.g., "Entrepreneur général"
  subcategory?: string;    // e.g., "Subcategory 7"
  holderName: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'suspended';
  verificationUrl: string;
}

// Divisions requiring RBQ:
- Construction: General Contractor
- Toitures: Subcategory 7
- Isolation: Subcategory 7
- Gutters: Subcategory 7
- Decks: Subcategory 6
```

**CMMTQ (Corporation des maîtres mécaniciens en tuyauterie du Québec):**

```typescript
interface CMMTQLicense {
  number: string;          // e.g., "M123456"
  type: 'Plombier' | 'Chauffagiste';
  holderName: string;
  expiryDate: string;
  status: 'active' | 'expired';
  continuingEducation: {
    hours: number;
    deadline: string;
  };
}

// Required for:
- Plomberie division (all technicians)
```

### 2. Loi 25 (Privacy Law) Compliance

**Component:** `/src/app/components/compliance/DocumentCompliance.tsx`

**Data Protection Requirements:**

```typescript
interface Loi25Compliance {
  // Consent tracking
  consent: {
    collected: boolean;
    date: string;
    purpose: string[];
    canRevoke: boolean;
  };

  // Data residency
  dataLocation: "Quebec" | "Canada" | "Other";

  // Breach notification
  breachProtocol: {
    notificationDeadline: "72 hours";
    responsibleParty: string;
  };

  // Data access requests
  accessRequestProcess: {
    maxResponseTime: "30 days";
    freeOfCharge: boolean;
  };
}
```

**Client Consent Form:**

```tsx
export function Loi25ConsentForm({ clientId }: Props) {
  return (
    <form onSubmit={handleSubmit}>
      <h3>Protection de vos renseignements personnels</h3>

      <Checkbox
        name="dataCollection"
        label="J'autorise la collecte de mes données personnelles"
      />

      <Checkbox
        name="serviceImprovement"
        label="J'accepte l'utilisation de mes données pour améliorer les services"
      />

      <Checkbox
        name="marketing"
        label="J'accepte de recevoir des communications marketing"
      />

      <p className="text-sm text-gray-600">
        Vous pouvez révoquer votre consentement en tout temps en
        nous contactant.
      </p>

      <SignaturePad onSave={handleSignature} />

      <Button type="submit">Confirmer</Button>
    </form>
  );
}
```

### 3. CNESST (Construction Safety)

**Component:** `/src/app/components/compliance/SafetyChecklist.tsx`

**Requirements for Construction Sites:**

```typescript
interface CNESSTCompliance {
  // Worker ratios for portable toilets
  toiletRatio: "1:30 workers";

  // Toilet types based on worker count
  flushToiletRequired: "if workers >= 25";

  // Handwashing stations
  handwashingRequired: boolean;

  // Safety equipment
  safetyEquipment: string[];

  // Incident reporting
  incidentReporting: {
    deadline: "24 hours";
    authority: "CNESST";
  };
}
```

### 4. Permit Automation

**Component:** `/src/app/components/compliance/DetailedQuoteBuilder.tsx`

**Automatic Permit Detection:**

```typescript
function checkPermitRequired(job: Job): PermitRequirement {
  const rules = {
    // Deck permits
    deck: {
      required: job.details.height > 60, // cm
      type: "municipal",
      note: "Permis requis pour hauteur > 60cm",
    },

    // Roofing permits
    roof: {
      required: job.details.height > 60, // cm from ground
      type: "municipal",
    },

    // Plumbing permits
    plumbing: {
      required: job.serviceType === "installation",
      type: "municipal + CMMTQ inspection",
    },

    // Construction permits
    construction: {
      required:
        job.details.structural || job.details.value > 10000,
      type: "municipal + RBQ",
    },
  };

  return rules[job.division];
}
```

### 5. Warranty Management

**Component:** `/src/app/components/compliance/WarrantyManagement.tsx`

**Quebec Warranty Requirements:**

```typescript
interface WarrantyRequirement {
  // Legal warranty (Quebec Civil Code)
  legalWarranty: {
    duration: "1 year hidden defects";
    coverageStart: "date of delivery";
  };

  // RBQ new construction warranty
  rbqNewConstruction: {
    durations: {
      workmanship: "1 year";
      building: "3 years";
      structure: "5 years";
    };
  };

  // Division-specific warranties
  divisionWarranty: {
    plomberie: "1-2 years parts + labor";
    toitures: "5 years workmanship";
    construction: "5-10 years";
  };
}
```

---

## FILE STRUCTURE

### Complete Directory Tree

```
/
├── public/
│   ├── error-suppressor.js
│   ├── manifest.json
│   ├── offline.html
│   └── service-worker.js
│
├── src/
│   ├── app/
│   │   ├── App.tsx                          # Main application entry
│   │   │
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   │   ├── AIAssistant.tsx          # AI dispatch assistant
│   │   │   │   └── AIAssistantButton.tsx
│   │   │   │
│   │   │   ├── compliance/
│   │   │   │   ├── BSDQCompliance.tsx
│   │   │   │   ├── CertifiedMaterialsEntry.tsx
│   │   │   │   ├── CollectionWorkflow.tsx
│   │   │   │   ├── CompletionCertificate.tsx
│   │   │   │   ├── DetailedQuoteBuilder.tsx
│   │   │   │   ├── DocumentCompliance.tsx
│   │   │   │   ├── EducationTracking.tsx
│   │   │   │   ├── IncidentReport.tsx
│   │   │   │   ├── LicenseManagement.tsx
│   │   │   │   ├── SafetyChecklist.tsx
│   │   │   │   └── WarrantyManagement.tsx
│   │   │   │
│   │   │   ├── cross-referral/
│   │   │   │   └── CrossReferralCapture.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── ActivityTimeline.tsx
│   │   │   │   ├── JobCard.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   └── WeatherWidget.tsx
│   │   │   │
│   │   │   ├── divisions/
│   │   │   │   └── DivisionSwitcher.tsx     # Switch between divisions
│   │   │   │
│   │   │   ├── estimator/
│   │   │   │   ├── PriceEstimator.tsx
│   │   │   │   └── index.tsx
│   │   │   │
│   │   │   ├── intake/
│   │   │   │   ├── ConstructionIntakeForm.tsx
│   │   │   │   ├── ConteneursIntakeForm.tsx
│   │   │   │   ├── DivisionIntakeRouter.tsx  # Routes to correct intake form
│   │   │   │   ├── GouttiereIntakeForm.tsx
│   │   │   │   ├── IsolationIntakeForm.tsx
│   │   │   │   ├── MaisonCashIntakeForm.tsx
│   │   │   │   ├── PatioIntakeForm.tsx
│   │   │   │   ├── PlomberieIntakeForm.tsx
│   │   │   │   └── ToituresIntakeForm.tsx
│   │   │   │
│   │   │   ├── kanban/
│   │   │   │   ├── DraggableJobCard.tsx     # Drag-and-drop job cards
│   │   │   │   └── DroppableColumn.tsx      # Kanban columns
│   │   │   │
│   │   │   ├── layouts/
│   │   │   │   └── DashboardLayout.tsx       # Main layout wrapper
│   │   │   │
│   │   │   ├── modals/
│   │   │   │   ├── AssignJobModal.tsx
│   │   │   │   ├── BulkActionsModal.tsx
│   │   │   │   ├── CreateClientModal.tsx
│   │   │   │   ├── CreateEquipmentModal.tsx
│   │   │   │   ├── CreateInvoiceModal.tsx
│   │   │   │   ├── CreateJobModal.tsx
│   │   │   │   ├── CreateMaintenanceContractModal.tsx
│   │   │   │   ├── CreateTechnicianModal.tsx
│   │   │   │   ├── EditEquipmentModal.tsx
│   │   │   │   ├── JobDetailsModal.tsx
│   │   │   │   ├── RecordPaymentModal.tsx
│   │   │   │   ├── ScheduleMaintenanceModal.tsx
│   │   │   │   ├── SendEmailModal.tsx
│   │   │   │   └── WeekCalendarModal.tsx
│   │   │   │
│   │   │   ├── service-forms/
│   │   │   │   ├── BackwaterValveForm.tsx
│   │   │   │   ├── DrainUnclockingForm.tsx
│   │   │   │   ├── ServiceFormSelector.tsx
│   │   │   │   ├── SumpPumpForm.tsx
│   │   │   │   ├── WaterHeaterForm.tsx
│   │   │   │   └── index.tsx
│   │   │   │
│   │   │   ├── signature/
│   │   │   │   └── SignaturePad.tsx          # Digital signature capture
│   │   │   │
│   │   │   ├── ui/                           # shadcn/ui components
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── calendar.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   └── ... (40+ components)
│   │   │   │
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── ChatModal.tsx
│   │   │   ├── CommandPalette.tsx           # Cmd+K search
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── NotificationPanel.tsx
│   │   │   └── OfflineIndicator.tsx
│   │   │
│   │   ├── context/
│   │   │   ├── AppContext.tsx               # Global app state
│   │   │   └── AuthContext.tsx              # Authentication
│   │   │
│   │   ├── data/
│   │   │   ├── divisions.ts                 # 8 division configs
│   │   │   ├── mockData.ts                  # Sample data
│   │   │   └── services.ts                  # Service catalog
│   │   │
│   │   ├── hooks/
│   │   │   └── useMediaQuery.ts
│   │   │
│   │   ├── lib/
│   │   │   └── utils.ts                     # Utility functions
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── ClientLogin.tsx
│   │   │   │   ├── ClientRegistration.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Onboarding.tsx
│   │   │   │   ├── PasswordReset.tsx
│   │   │   │   └── TwoFactorAuth.tsx
│   │   │   │
│   │   │   ├── mobile/
│   │   │   │   ├── MobileActiveJob.tsx
│   │   │   │   ├── MobileEstimator.tsx
│   │   │   │   ├── MobileHome.tsx
│   │   │   │   ├── MobileJobCompletion.tsx
│   │   │   │   ├── MobileJobDetail.tsx
│   │   │   │   ├── MobileLogin.tsx
│   │   │   │   ├── MobileMessages.tsx
│   │   │   │   ├── MobileProfile.tsx
│   │   │   │   ├── MobileServiceForm.tsx
│   │   │   │   └── MobileTechApp.tsx        # Mobile app router
│   │   │   │
│   │   │   ├── portal/
│   │   │   │   ├── ClientPortalDashboard.tsx
│   │   │   │   ├── ClientPortalInvoices.tsx
│   │   │   │   ├── ClientPortalMain.tsx     # Client portal router
│   │   │   │   ├── ClientPortalMessages.tsx
│   │   │   │   ├── ClientPortalPayments.tsx
│   │   │   │   ├── ClientPortalRequests.tsx
│   │   │   │   ├── ClientPortalSettings.tsx
│   │   │   │   ├── ClientProfile.tsx
│   │   │   │   ├── CustomerPortal.tsx       # Public portal
│   │   │   │   ├── CustomerPortalBooking.tsx
│   │   │   │   ├── CustomerPortalHome.tsx
│   │   │   │   ├── CustomerPortalInvoices.tsx
│   │   │   │   ├── CustomerPortalSettings.tsx
│   │   │   │   └── NewClientRequest.tsx
│   │   │   │
│   │   │   ├── Analytics.tsx
│   │   │   ├── BiddingMarketplace.tsx       # Subcontractor bidding
│   │   │   ├── ClientDetail.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── ComplianceTracking.tsx
│   │   │   ├── ContractorBids.tsx
│   │   │   ├── CrossDivisionProjects.tsx    # Multi-division coordination
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DispatchCenter.tsx           # Main dispatch board
│   │   │   ├── Help.tsx
│   │   │   ├── Integrations.tsx
│   │   │   ├── Inventory.tsx
│   │   │   ├── InvoiceDetail.tsx
│   │   │   ├── Invoices.tsx
│   │   │   ├── MaintenanceContracts.tsx
│   │   │   ├── MapView.tsx                  # GPS tracking map
│   │   │   ├── MultiDivisionDashboard.tsx   # Multi-division overview
│   │   │   ├── Notifications.tsx
│   │   │   ├── PropertyPassportDetail.tsx
│   │   │   ├── PropertyPassports.tsx
│   │   │   ├── RemoteQuoting.tsx            # Remote quote system
│   │   │   ├── Reviews.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Soumissions.tsx
│   │   │   ├── SoumissionsNew.tsx
│   │   │   ├── SuperAdminDashboard.tsx      # Super admin dashboard
│   │   │   ├── TechnicianDetail.tsx
│   │   │   ├── TechnicianProfile.tsx
│   │   │   ├── Technicians.tsx
│   │   │   └── ThermalHeatMap.tsx           # Demand heat mapping
│   │   │
│   │   ├── services/
│   │   │   └── integrations/
│   │   │       ├── IntegrationService.ts
│   │   │       └── WebhookHandler.ts
│   │   │
│   │   ├── types/
│   │   │   ├── compliance.ts
│   │   │   ├── index.ts                     # Core types
│   │   │   ├── integrations.ts
│   │   │   ├── lacoste-platform.ts
│   │   │   └── user.ts
│   │   │
│   │   └── utils/
│   │       ├── offlineStorage.ts            # IndexedDB utilities
│   │       ├── pdfGenerator.ts              # PDF invoice generation
│   │       └── registerServiceWorker.ts
│   │
│   ├── data/
│   │   ├── bids.ts
│   │   ├── inventory.ts
│   │   ├── remoteQuotes.ts
│   │   └── thermalData.ts
│   │
│   └── styles/
│       ├── fonts.css
│       ├── index.css
│       ├── konsta-ios.css
│       ├── tailwind.css
│       └── theme.css                        # Design tokens
│
├── package.json
├── postcss.config.mjs
├── update.md                                # Source of truth specification
├── vite.config.ts
│
└── [70+ .md documentation files]
```

---

## COMPONENT INVENTORY

### Total Components: 150+

**By Category:**

**UI Components (shadcn/ui):** 40+

- Alert, Badge, Button, Card, Checkbox, Dialog, Dropdown, Form, Input, Label, Select, Separator, Sheet, Switch, Table, Tabs, Textarea, Tooltip, etc.

**Feature Components:** 60+

- Intake Forms (8)
- Compliance Components (11)
- Dashboard Components (4)
- Modal Components (15)
- Mobile Components (9)
- Portal Components (15)
- Service Forms (5)
- AI Components (2)
- Kanban Components (2)

**Page Components:** 45+

- Main Pages (23)
- Auth Pages (6)
- Mobile Pages (9)
- Portal Pages (11)

**Layout Components:** 5

- DashboardLayout
- ErrorBoundary
- OfflineIndicator
- Breadcrumbs
- CommandPalette

---

## DATA FLOW & CONNECTIONS

### 1. Authentication Flow

```
User enters credentials
       ↓
AuthContext.login(email, password, division)
       ↓
MOCK_USERS lookup (in production: API call)
       ↓
User object + activeDivision stored in state
       ↓
localStorage.setItem('currentUser', user)
       ↓
Redirect based on role:
  - super-admin → /super-admin
  - technician → /profile
  - client → /client-portal
  - others → /dashboard
```

### 2. Job Creation Flow

```
Dispatcher clicks "Create Job"
       ↓
CreateJobModal opens
       ↓
Select division (if multi-division user)
       ↓
DivisionIntakeRouter loads appropriate form
       ↓
User fills division-specific fields
       ↓
Submit → AppContext.addJob(jobData)
       ↓
New job added to jobs array
       ↓
Job appears in DispatchCenter (Incoming column)
       ↓
Dispatcher drags to technician
       ↓
AssignJobModal opens → assign technician
       ↓
AppContext.updateJob(jobId, { technicianId, status: 'assigned' })
       ↓
Technician receives notification
       ↓
Job appears in MobileTechApp
```

### 3. Job Completion Flow

```
Technician opens job in mobile app
       ↓
Clicks "Start Job" → status: 'in-progress'
       ↓
Takes before photos → stored offline if needed
       ↓
Completes work
       ↓
Takes after photos
       ↓
Requests client signature → SignaturePad
       ↓
Clicks "Complete Job"
       ↓
Auto-generate invoice → CreateInvoiceModal
       ↓
AppContext.updateJob(jobId, { status: 'completed' })
AppContext.addInvoice(invoiceData)
       ↓
Job moves to "Completed" column in DispatchCenter
       ↓
Invoice sent to client via email
       ↓
Client receives invoice in portal
       ↓
Client pays via Stripe
       ↓
Webhook updates invoice status: 'paid'
```

### 4. Cross-Division Project Flow

```
Client requests multi-service work
       ↓
Intake captures: roof + insulation + gutters
       ↓
System creates CrossDivisionProject
       ↓
Auto-creates 3 linked jobs:
  - Job #1: Isolation (division: 'isolation')
  - Job #2: Toitures (division: 'toitures')
  - Job #3: Gutters (division: 'gutters')
       ↓
Sets dependencies:
  - Job #2 depends on Job #1
  - Job #3 depends on Job #2
       ↓
Allocates shared resources:
  - Conteneur (20yd dumpster)
       ↓
Each division head assigns technicians
       ↓
Jobs execute in sequence
       ↓
Combined invoice generated
       ↓
Single client communication
```

### 5. Offline Data Sync Flow

```
Technician goes offline (no network)
       ↓
Completes job, takes photos, gets signature
       ↓
Data stored in IndexedDB:
  - pending_jobs
  - pending_photos
  - pending_signatures
       ↓
OfflineIndicator shows "Mode hors ligne"
       ↓
Technician goes back online
       ↓
Service Worker detects online event
       ↓
offlineStorage.syncPendingData() triggered
       ↓
For each pending item:
  - Upload to server
  - Update job status
  - Remove from IndexedDB
  - Show success toast
       ↓
All data synced
OfflineIndicator disappears
```

### 6. Division Filtering Flow

```
User logs in → activeDivision set from user.division
       ↓
AppContext filters all data:
  divisionJobs = jobs.filter(job => job.division === activeDivision)
  divisionTechnicians = technicians.filter(tech => tech.division === activeDivision)
  divisionInvoices = invoices.filter(inv => inv.division === activeDivision)
       ↓
Components consume filtered data:
  - DispatchCenter shows only divisionJobs
  - Technicians page shows only divisionTechnicians
  - Analytics calculates only divisionInvoices
       ↓
User switches division via DivisionSwitcher
       ↓
AuthContext.setActiveDivision(newDivision)
       ↓
All components re-render with new filtered data
```

### 7. Integration Data Flow

```
Job completed → Invoice created
       ↓
IntegrationService.syncToQuickBooks(invoice)
       ↓
POST /api/quickbooks/invoice
       ↓
QuickBooks creates invoice record
       ↓
Webhook received: invoice.created
       ↓
WebhookHandler.handleQuickBooksWebhook(event)
       ↓
Update local invoice with QB ID
       ↓
Client pays invoice via Stripe
       ↓
Webhook received: payment_intent.succeeded
       ↓
WebhookHandler.handleStripeWebhook(event)
       ↓
Update invoice status: 'paid'
       ↓
Sync payment to QuickBooks
       ↓
Send confirmation email to client (SendGrid)
       ↓
Send SMS receipt to client (Twilio)
```

---

## ANALYTICS & METRICS

### 1. Dashboard KPIs

**Real-time Metrics:**

- Today's Revenue (with % change from yesterday)
- Monthly Target Progress (with % complete)
- Active Jobs Count (with emergency count)
- Customer Satisfaction (5-star average with trend)

**Division Performance:**

- Jobs completed per division
- Revenue per division
- Technician utilization % per division
- Issue/alert count per division

### 2. Recharts Visualizations

**Revenue Line Chart:**

```tsx
<LineChart data={revenueData}>
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line
    type="monotone"
    dataKey="revenue"
    stroke="#000000"
    strokeWidth={2}
  />
  <Line
    type="monotone"
    dataKey="target"
    stroke="#6B7280"
    strokeDasharray="5 5"
  />
</LineChart>
```

**Service Mix Pie Chart:**

```tsx
<PieChart>
  <Pie
    data={serviceData}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={80}
    label
  >
    {serviceData.map((entry, index) => (
      <Cell
        key={index}
        fill={getDivisionColor(entry.division)}
      />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
```

### 3. Thermal Heat Map Data

**Structure:**

```typescript
interface HeatMapData {
  location: {
    lat: number;
    lng: number;
    postalCode: string;
  };
  metrics: {
    jobCount: number;
    revenue: number;
    avgJobValue: number;
    topService: string;
  };
  intensity: number; // 0-100 for heat coloring
}
```

---

## CONCLUSION

This documentation represents the complete technical architecture of the Synergair x Groupe G. Lafrance multi-division dispatch platform.

### Platform Statistics

- **8 Service Divisions** fully configured
- **7 User Roles** with granular permissions
- **150+ Components** across 40+ feature modules
- **45+ Pages** including mobile and portal variants
- **40+ UI Components** from shadcn/ui
- **8 Division-Specific Intake Forms**
- **PWA Capabilities** with offline mode
- **Quebec Compliance** (RBQ, CMMTQ, Loi 25, CNESST)
- **Multi-Division Coordination** with dependency tracking
- **Real-time GPS Tracking** (simulated)
- **Bidding Marketplace** for subcontractors
- **Thermal Heat Mapping** for demand visualization
- **Remote Quoting System** with AI assistance

### Technology Highlights

- React 18.3.1 + TypeScript
- Tailwind CSS v4.1.12
- Konsta UI v5.0.6 (iOS theme)
- 69 npm packages installed
- Offline-first architecture
- IndexedDB for local storage
- Service Worker for PWA
- Stripe integration for payments
- jsPDF for invoice generation

### Next Steps for Production

1. Replace mock data with real API endpoints
2. Implement real GPS tracking API
3. Connect Stripe production keys
4. Set up QuickBooks OAuth flow
5. Configure Twilio/SendGrid credentials
6. Deploy backend API (Node.js + PostgreSQL)
7. Set up CI/CD pipeline
8. Configure production domain
9. SSL certificates
10. Load testing and optimization

---

**Document Version:** 2.0.0  
**Last Updated:** January 19, 2026  
**Maintained By:** Development Team  
**Reference:** update.md (source of truth)