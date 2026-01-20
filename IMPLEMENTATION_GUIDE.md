# 🔧 QUEBEC COMPLIANCE - PROPER IMPLEMENTATION GUIDE

**THIS DOCUMENT explains EXACTLY where and how to integrate all 12 compliance features into the existing Plomberie Michael Lacoste platform**

---

## ✅ COMPLETED SO FAR:

### 1. Settings Page - New Tabs Added
**Location:** `/src/app/pages/Settings.tsx`
- ✅ Added "Techniciens" tab
- ✅ Added "Conformité" tab  
- ✅ Integrated DocumentCompliance component into Conformité tab

---

## 🚀 REMAINING IMPLEMENTATION TASKS

### **FEATURE 1: License Verification & Credential Management**
**Status:** Components created, needs integration

**Where to add:**
1. **Admin > Paramètres > Techniciens Tab** ✅ (tab exists, needs content)
   - Add LicenseManagement component for each technician
   - Show badge status, expiry dates
   - Add "Gérer les licences" button

2. **Technician Profile Page** (TechnicianProfile.tsx)
   - Add LicenseManagement widget
   - Show badges on technician card

3. **Technicians List Page** (Technicians.tsx)
   - Add license badges to each tech card
   - Filter by license status

4. **Dispatch Center** (DispatchCenter.tsx)
   - Show license badge on tech selection
   - Block assignment if license expired/missing

**Implementation needed:**
- Update Settings > Techniciens tab to show full license management
- Add LicenseBadges component to all technician cards
- Add validation logic to dispatch assignment

---

### **FEATURE 2: Certified Materials Entry**
**Status:** Component created, needs integration

**Where to add:**
1. **Mobile Technician App > Active Job**
   - Add "Matériaux utilisés" section
   - Use CertifiedMaterialsEntry component
   - Show warnings for uncertified materials

2. **Job Details Modal** (JobDetailsModal)
   - Add Materials tab
   - Allow viewing/editing materials used

3. **Invoice Detail** (InvoiceDetail.tsx)
   - Show materials list with certification status
   - Green checkmarks for certified, yellow warnings for uncertified

**Implementation needed:**
- Create mobile view for material entry
- Add materials tab to job modal
- Display certification badges on invoices

---

### **FEATURE 3: Pre-Work Quotation & Client Consent**
**Status:** Component created, needs integration

**Where to add:**
1. **CRM > Client Detail > New Job**
   - Before scheduling, require quote creation
   - Use DetailedQuoteBuilder component
   - Capture client signature/consent

2. **Soumissions Page** (Soumissions.tsx)
   - Add "Créer soumission détaillée" button
   - Use DetailedQuoteBuilder
   - Track approval status

3. **Job Modal** (JobDetailsModal)
   - Add Quote tab
   - Show approved quote
   - Allow modification requests

**Implementation needed:**
- Add quote builder to job creation flow
- Create quote approval workflow
- Link quotes to jobs

---

### **FEATURE 4: Safety & Quality Checklists**
**Status:** Component created, needs integration

**Where to add:**
1. **Mobile App > Active Job > Checklist Tab**
   - Use SafetyChecklist component
   - Job-type specific templates
   - Photo capture per item

2. **Job Details Modal**
   - Add Checklist tab
   - Show completion status
   - Block completion if incomplete

3. **Admin > Settings > Services**
   - Add "Gérer les checklists" section
   - Create/edit templates per service type

**Implementation needed:**
- Add checklist tab to mobile job view
- Create checklist template editor
- Add validation to job completion

---

### **FEATURE 5: Incident Reporting**
**Status:** Component created, needs integration

**Where to add:**
1. **Dashboard** (Dashboard.tsx)
   - Add "Incidents" widget
   - Show recent incidents
   - Alert count

2. **Mobile App > Menu**
   - Add "Signaler un incident" button
   - Open IncidentReport dialog

3. **Admin > New "Incidents" Page**
   - Create `/src/app/pages/Incidents.tsx`
   - Use IncidentDashboard component
   - Show all reports with filters

**Implementation needed:**
- Create Incidents page
- Add incident button to mobile menu
- Add dashboard widget
- Add route in App.tsx

---

### **FEATURE 6: Document Identification**
**Status:** ✅ COMPLETED (already in Settings > Conformité)

**Additional integration needed:**
- Apply logos to invoice PDFs
- Apply logos to quote PDFs
- Apply logos to completion certificates

---

### **FEATURE 7: Warranty Management**
**Status:** Component created, needs integration

**Where to add:**
1. **Invoice Detail** (InvoiceDetail.tsx)
   - Add "Garantie" tab
   - Use WarrantyManagement component
   - Show warranty status

2. **Client Detail** (ClientDetail.tsx)
   - Add "Garanties" section
   - Show all active warranties
   - Allow warranty claim submission

3. **Dashboard**
   - Add "Garanties expirant bientôt" widget
   - Use WarrantyExpiryNotifications

**Implementation needed:**
- Add warranty tab to invoices
- Create warranty section in client profile
- Add dashboard widget

---

###  **FEATURE 8: Education Tracking**
**Status:** Component created, needs integration

**Where to add:**
1. **Technician Profile** (TechnicianProfile.tsx)
   - Add "Formation" tab
   - Use EducationTracking component
   - Show progress

2. **Admin > Settings > Techniciens**
   - Show education status for each tech
   - Alert icons for at-risk/overdue

3. **Dashboard**
   - Add "Formation continue" widget
   - Use EducationDashboard component

**Implementation needed:**
- Add formation tab to tech profile
- Update technicians list with education status
- Add dashboard widget

---

### **FEATURE 9: Collection Workflow**
**Status:** Component created, needs integration

**Where to add:**
1. **Invoices Page** (Invoices.tsx)
   - Add "En retard" filter/tab
   - Show collection status badges

2. **Invoice Detail** (InvoiceDetail.tsx)
   - Add "Recouvrement" tab
   - Use CollectionWorkflow component
   - Show escalation timeline

3. **Dashboard**
   - Add "Factures en recouvrement" widget
   - Show counts by stage

**Implementation needed:**
- Add collection tab to invoice detail
- Update invoices page with collection filters
- Add dashboard widget

---

### **FEATURE 10: BSDQ Compliance**
**Status:** Component created, needs integration

**Where to add:**
1. **Quote Creation** (Soumissions.tsx, SoumissionsNew.tsx)
   - Add BSDQCompliance component
   - Check value > $20k
   - Block PDF export if required

2. **Dashboard**
   - Add "BSDQ" widget
   - Use BSDQDashboard component

**Implementation needed:**
- Add BSDQ check to quote workflow
- Add conditional PDF export logic
- Add dashboard widget

---

### **FEATURE 11: Completion Certificate**
**Status:** Component created, needs integration

**Where to add:**
1. **Job Completion Flow**
   - After marking job "Completed"
   - Show CompletionCertificate dialog
   - Capture signatures

2. **Job Details / History**
   - View existing certificates
   - Download PDF

3. **Client Portal**
   - Allow clients to view/download certificates

**Implementation needed:**
- Add to job completion workflow
- Store certificates in job data
- Add view/download to job history

---

### **FEATURE 12: Public Profile Compliance**
**Status:** Handled by DocumentCompliance

**Integration needed:**
- Client portal shows CMMTQ/RBQ badges
- Public-facing quotes show verification links
- Block profile publication if data missing

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Settings & Admin (Quick Wins)
- [x] Add Techniciens tab to Settings
- [x] Add Conformité tab to Settings  
- [x] Integrate DocumentCompliance
- [ ] Add full LicenseManagement to Techniciens tab
- [ ] Create Incidents page
- [ ] Add checklist template editor to Services

### Phase 2: Technician Profiles
- [ ] Add license badges to TechnicianProfile
- [ ] Add formation tab to TechnicianProfile
- [ ] Add license badges to Technicians list
- [ ] Add education status to Technicians list

### Phase 3: Job Workflow
- [ ] Add materials entry to mobile job view
- [ ] Add checklist tab to mobile job view
- [ ] Add quote requirement to job creation
- [ ] Add completion certificate to job completion
- [ ] Add materials tab to JobDetailsModal
- [ ] Add checklist tab to JobDetailsModal
- [ ] Add quote tab to JobDetailsModal

### Phase 4: CRM & Invoicing
- [ ] Add warranty tab to InvoiceDetail
- [ ] Add collection tab to InvoiceDetail
- [ ] Add warranties section to ClientDetail
- [ ] Add collection filters to Invoices page
- [ ] Add BSDQ check to quote creation

### Phase 5: Dashboard Widgets
- [ ] Add incidents widget
- [ ] Add warranties expiring widget
- [ ] Add education tracking widget
- [ ] Add collection status widget
- [ ] Add BSDQ widget

### Phase 6: Mobile Integration
- [ ] Add incident reporting to mobile menu
- [ ] Add materials entry to mobile job
- [ ] Add checklist to mobile job
- [ ] Add signature capture for completion

### Phase 7: PDF Generation
- [ ] Apply logos to invoice PDFs
- [ ] Apply logos to quote PDFs
- [ ] Generate completion certificate PDFs
- [ ] Generate mise en demeure PDFs

---

## 🔧 TECHNICAL TASKS

### New Pages to Create:
1. `/src/app/pages/Incidents.tsx` - Incident management page

### Modals to Update:
1. `JobDetailsModal` - Add materials, checklist, quote tabs
2. Job completion flow - Add completion certificate dialog

### Components to Integrate:
1. LicenseManagement → Settings, TechnicianProfile, Technicians list
2. CertifiedMaterialsEntry → Mobile job, JobDetailsModal
3. DetailedQuoteBuilder → Soumissions, Job creation
4. SafetyChecklist → Mobile job, JobDetailsModal
5. IncidentReport → Dashboard, Mobile menu, Incidents page
6. WarrantyManagement → InvoiceDetail, ClientDetail
7. EducationTracking → TechnicianProfile, Settings
8. CollectionWorkflow → InvoiceDetail, Invoices page
9. BSDQCompliance → Quote creation
10. CompletionCertificate → Job completion flow

### Routes to Add:
```typescript
<Route path="/incidents" element={<Incidents />} />
```

### Context/State Management:
- Add license data to technician state
- Add materials data to job state
- Add checklist data to job state
- Add warranty data to invoice state
- Add collection status to invoice state

---

## 💡 IMPLEMENTATION STRATEGY

### Recommended Order:
1. **Start with Settings** (already done) ✅
2. **Add to existing pages** (profiles, invoices, etc.)
3. **Create new modals/dialogs**
4. **Add dashboard widgets**
5. **Mobile integration**
6. **PDF generation last**

### Each feature implementation involves:
1. Import the compliance component
2. Add UI elements (tabs, buttons, sections)
3. Connect to existing data/state
4. Add validation/logic
5. Test the workflow

---

## 🎯 NEXT STEPS

**I recommend we implement these in order:**
1. License Management integration (Settings + Profiles)
2. Incident Reporting (new page + dashboard)
3. Warranty Management (invoices + client detail)
4. Education Tracking (profiles + dashboard)
5. Materials Entry (job workflow)
6. Checklists (job workflow)
7. Collection Workflow (invoices)
8. Quote Builder (CRM workflow)
9. BSDQ Compliance (quotes)
10. Completion Certificate (job completion)

**Let me know which feature you want me to implement first, and I'll do it properly with full integration!** 🚀

