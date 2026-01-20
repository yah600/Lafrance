# 👥 USER PROFILE & FEATURE MAPPING
## Plomberie D'Experts - Logical Access Control

---

## 🎯 USER ROLES IN SYSTEM

### 1. **ADMIN** (Administrateur)
- Full system access
- Manages all users, settings, configurations
- Views all analytics and reports

### 2. **DISPATCHER** (Répartiteur)  
- Job management and assignment
- Client management
- Invoice management
- Analytics viewing

### 3. **VIEWER** (Observateur)
- Read-only access
- Analytics viewing
- Job monitoring

### 4. **TECHNICIAN** (Technicien)
- Mobile app access
- View assigned jobs
- Complete service forms
- Generate reports on-site

### 5. **CLIENT** (Client)
- Client portal access
- Request services
- View own jobs
- Pay invoices

---

## ✅ CORRECT FEATURE PLACEMENT

### 📝 **SERVICE FORMS + PDF GENERATION**

**WHO USES IT:** ✅ **TECHNICIANS** (Primary) + Dispatchers (Review)

**CURRENT LOCATION:** 
- ❌ `/src/app/components/service-forms/` - Generic location
- ✅ Should be in TECHNICIAN interface

**WHERE IT SHOULD BE ACCESSIBLE:**

1. **Technician Mobile App** (`/src/app/pages/mobile/`)
   - Route: `/mobile/job/:id/service-form`
   - After completing a job, technician fills out service form
   - Generates PDF on-site for client signature
   - **USE CASE:** Technician finishes drain unblocking → Opens form → Fills details → Generates PDF → Client signs → Job complete

2. **Technician Profile/Dashboard** (`/src/app/pages/TechnicianProfile.tsx`)
   - Can review past service forms
   - Re-generate PDFs if needed
   - **USE CASE:** Client lost report → Technician regenerates from profile

3. **Dispatcher View** (Secondary - Review Only)
   - Route: `/dispatch/jobs/:id/service-form`
   - View completed forms
   - Download PDFs
   - **USE CASE:** Dispatcher needs to send report to client after the fact

**ACTIONS NEEDED:**
```
✅ Create: /src/app/pages/mobile/MobileServiceForm.tsx
✅ Integrate into: MobileJobCompletion.tsx
✅ Add route for dispatchers to review
```

---

### 💰 **GOOD-BETTER-BEST PRICE ESTIMATOR**

**WHO USES IT:** ✅ **TECHNICIANS** (on-site) + **DISPATCHERS** (office quotes)

**CURRENT LOCATION:**
- ❌ `/src/app/components/estimator/` - Generic location
- ✅ Needs to be in BOTH technician AND dispatcher interfaces

**WHERE IT SHOULD BE ACCESSIBLE:**

1. **Technician Mobile App** (`/src/app/pages/mobile/`)
   - Route: `/mobile/estimate/new`
   - When technician is on-site and needs to give quote
   - Can show client 3 options on tablet
   - Client selects option → Technician gets approval → Job created
   - **USE CASE:** Client asks "How much to replace my water heater?" → Technician opens estimator → Shows 3 options → Client picks middle tier + WiFi detector → Total 1,545$ → Approved → Job scheduled

2. **Dispatcher Dashboard** (`/src/app/pages/DispatchCenter.tsx` or `/Soumissions.tsx`)
   - Route: `/soumissions/new` or `/estimates/new`
   - When client calls in asking for quote
   - Dispatcher creates estimate, emails to client
   - **USE CASE:** Client calls office → "How much for sump pump?" → Dispatcher creates estimate → Emails PDF → Client accepts → Job created

3. **Client Portal** (Optional - Self-Service)
   - Route: `/client-portal/request-estimate`
   - Client can see pricing tiers online
   - Request quote with selected option
   - **USE CASE:** Client browses online → Sees water heater pricing → Selects premium option → Submits request → Dispatcher follows up

**ACTIONS NEEDED:**
```
✅ Create: /src/app/pages/mobile/MobileEstimator.tsx (mobile version)
✅ Create: /src/app/pages/SoumissionsNew.tsx (dispatcher version)
✅ Optionally: /src/app/pages/portal/RequestEstimate.tsx (client self-service)
```

---

### 🏠 **PROPERTY PASSPORT** (When Implemented)

**WHO USES IT:** ✅ **TECHNICIANS** (View/Update) + **DISPATCHERS** (Manage) + **CLIENTS** (View)

**WHERE IT SHOULD BE:**

1. **Technician Mobile App**
   - View property history before arriving
   - See past interventions
   - Add new equipment records
   - **USE CASE:** Before visiting 123 Rue Example → Opens passport → Sees they have 5-year-old water heater → Knows history

2. **Dispatcher Dashboard**
   - Manage all property passports
   - Update property information
   - Schedule maintenance based on equipment age
   - **USE CASE:** Dispatcher sees client's water heater is 11 years old → Proactively calls client to schedule replacement

3. **Client Portal**
   - View their property passport
   - See equipment list with warranties
   - Download intervention history
   - **USE CASE:** Client selling house → Downloads property passport → Gives to buyer → Shows all plumbing maintenance

**ACTIONS NEEDED:**
```
⚠️ Create: /src/app/pages/mobile/PropertyPassport.tsx
⚠️ Create: /src/app/pages/PropertyPassports.tsx (dispatcher)
⚠️ Create: /src/app/pages/portal/MyPropertyPassport.tsx (client)
```

---

### ⭐ **AUTOMATED REVIEW SYSTEM** (When Implemented)

**WHO USES IT:** ✅ **ADMIN/DISPATCHER** (Manage) + **TECHNICIANS** (View ratings)

**WHERE IT SHOULD BE:**

1. **Admin/Dispatcher Dashboard**
   - Configure review request settings
   - View all reviews
   - Respond to reviews
   - Technician leaderboard
   - **USE CASE:** Dispatcher sees negative review → Responds → Schedules follow-up visit

2. **Technician Profile**
   - View own reviews
   - See rating history
   - Performance metrics
   - **USE CASE:** Technician logs in → Sees new 5-star review → Morale boost!

**ACTIONS NEEDED:**
```
⚠️ Create: /src/app/pages/Reviews.tsx (admin/dispatcher)
⚠️ Update: TechnicianProfile.tsx (show reviews)
⚠️ Create: /src/app/pages/Settings.tsx section (review configuration)
```

---

### 📋 **MAINTENANCE CONTRACTS** (When Implemented)

**WHO USES IT:** ✅ **DISPATCHERS** (Manage) + **CLIENTS** (Subscribe/View)

**WHERE IT SHOULD BE:**

1. **Dispatcher Dashboard**
   - Manage contracts (Bronze/Silver/Gold)
   - Schedule annual visits
   - Apply discounts automatically
   - Track renewals
   - **USE CASE:** Client signs up for Gold plan → Dispatcher creates contract → System automatically schedules 2 visits/year

2. **Client Portal**
   - View contract details
   - See upcoming scheduled visits
   - Upgrade/downgrade plan
   - Auto-renewal management
   - **USE CASE:** Client logs in → Sees Bronze plan → Upgrades to Silver → Gets 15% discount on next job

**ACTIONS NEEDED:**
```
⚠️ Create: /src/app/pages/MaintenanceContracts.tsx (dispatcher)
⚠️ Create: /src/app/pages/portal/MyContract.tsx (client)
⚠️ Create: /src/app/pages/portal/SubscribeContract.tsx (client signup)
```

---

## 🚨 CRITICAL ISSUES WITH CURRENT IMPLEMENTATION

### ❌ **PROBLEM 1: Service Forms Not in Technician Interface**

**Current State:**
- Service forms are in generic `/src/app/components/service-forms/`
- No clear route for technicians to access them
- Not integrated into mobile app workflow

**Fix Required:**
```typescript
// Create mobile service form page
/src/app/pages/mobile/MobileServiceForm.tsx

// Integrate into job completion flow
/src/app/pages/mobile/MobileJobCompletion.tsx
  → After "Marquer comme complété"
  → Show "Remplir fiche technique" button
  → Opens ServiceFormSelector
  → Fills form
  → Generates PDF
  → Job marked as complete with report
```

### ❌ **PROBLEM 2: Price Estimator Not Accessible**

**Current State:**
- PriceEstimator component exists but no route to access it
- Not in mobile app (where technicians need it on-site)
- Not in dispatcher dashboard (where quotes are created)

**Fix Required:**
```typescript
// Add to mobile app
/src/app/pages/mobile/MobileEstimator.tsx

// Add to dispatcher routes
/src/app/pages/SoumissionsNew.tsx
  → When creating new quote
  → Use PriceEstimator component
  → Save estimate
  → Email/SMS to client
```

### ❌ **PROBLEM 3: Missing Workflow Integration**

**Current State:**
- Features exist in isolation
- No clear user journey
- Missing "when" and "how" users access them

**Fix Required:**
- Map out complete user journeys
- Add proper routing
- Integrate into existing workflows
- Add navigation/buttons where logical

---

## ✅ CORRECTED WORKFLOW EXAMPLES

### **TECHNICIAN WORKFLOW - Complete Job**
```
1. Technician arrives at job
   → Opens /mobile/job/:id

2. Works on drain unblocking
   → Updates status to "En cours"

3. Finishes work
   → Clicks "Marquer comme complété"
   
4. System prompts: "Remplir la fiche technique?"
   → YES → Opens DrainUnblockingForm
   
5. Fills form with photos, details
   → Clicks "Générer rapport"
   
6. PDF opens on tablet
   → Shows to client
   → Client signs on device
   
7. Job marked complete
   → PDF saved to job
   → Technician moves to next job
```

### **DISPATCHER WORKFLOW - Create Quote**
```
1. Client calls: "How much for water heater?"
   
2. Dispatcher opens /soumissions/new
   → Selects client
   → Selects "Chauffe-eau"
   
3. PriceEstimator opens
   → Shows 3 tiers: 1,150$ / 1,450$ / 1,875$
   → Client mentions old house → Recommends Premium
   → Adds expansion tank add-on (+175$)
   → Total: 2,050$
   
4. Client accepts over phone
   → Dispatcher clicks "Accepter l'estimation"
   → Creates job
   → Assigns to technician
   → Sends PDF quote via email
```

### **CLIENT WORKFLOW - Request Service**
```
1. Client logs into portal
   → /client-portal
   
2. Clicks "Nouvelle demande de service"
   → Selects "Chauffe-eau"
   
3. Optional: Views pricing tiers
   → Sees what to expect cost-wise
   
4. Submits request
   → Dispatcher receives
   → Calls client back with official quote
```

---

## 🎯 RECOMMENDED IMMEDIATE FIXES

### **Priority 1: Mobile Service Forms Integration** 
```bash
1. Create /src/app/pages/mobile/MobileServiceForm.tsx
2. Import ServiceFormSelector component
3. Add route in MobileTechApp.tsx
4. Add button in MobileJobCompletion.tsx
5. Test complete workflow
```

### **Priority 2: Estimator Routes**
```bash
1. Create /src/app/pages/SoumissionsNew.tsx
2. Import PriceEstimator component
3. Add route for /soumissions/new
4. Add "Nouvelle soumission" button in Soumissions.tsx
5. Test creating quote
```

### **Priority 3: Navigation Updates**
```bash
1. Add "Mes tâches" to technician navigation
2. Add "Créer soumission" to dispatcher navigation
3. Add breadcrumbs showing user where they are
```

---

## 📊 FEATURE ACCESS MATRIX

| Feature | Admin | Dispatcher | Viewer | Technician | Client |
|---------|-------|------------|--------|------------|--------|
| **Service Forms (Fill)** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Service Forms (View)** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **PDF Generation** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Price Estimator (Create)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Price Estimator (View)** | ✅ | ✅ | ✅ | ✅ | ✅* |
| **Property Passport (Edit)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Property Passport (View)** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Review Management** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Review Viewing (Own)** | - | - | - | ✅ | - |
| **Maintenance Contracts (Manage)** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Maintenance Contracts (View/Subscribe)** | - | - | - | - | ✅ |

*Client can view pricing estimates, but cannot create official quotes

---

## 🚀 NEXT STEPS

1. **Create mobile service form integration** (1-2 hours)
2. **Create estimator routes for dispatcher** (1 hour)
3. **Update navigation for logical access** (30 min)
4. **Test complete user workflows** (1-2 hours)
5. **Document user guides** (optional)

---

**This ensures features are in the RIGHT places for the RIGHT users at the RIGHT time!**
