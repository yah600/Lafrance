# 🔧 QUEBEC COMPLIANCE - FULL IMPLEMENTATION PLAN

This document provides the complete integration roadmap for all 12 Quebec compliance features into the existing Plomberie Michael Lacoste platform.

---

## ✅ COMPLETED SO FAR

### 1. Document Compliance (Feature #6) - ✅ INTEGRATED
**Location:** Admin > Paramètres > Conformité  
**Status:** Fully integrated into Settings page  
**Component:** `/src/app/components/compliance/DocumentCompliance.tsx`

---

## 🚀 IMPLEMENTATION ROADMAP

### **FEATURE #1: License Verification and Credential Management**

**Admin Implementation:**
- **Location:** Admin > Paramètres > "Techniciens" Tab (NEW)
- **File to Modify:** `/src/app/pages/Settings.tsx`
- **Add:** New tab `<TabsTrigger value="technicians">Techniciens</TabsTrigger>`
- **Content:** List all technicians with license management UI
- **Component to use:** `<LicenseManagement />` for each technician

**Technician Profile Implementation:**
- **Location:** Technician > Profil
- **File to Modify:** `/src/app/pages/TechnicianProfile.tsx` 
- **Add:** New tab in existing Tabs component: "Licences & Certifications"
- **Component to use:** `<LicenseManagement technicianId={user.id} />`
- **Display badges:** Use `<LicenseBadges />` component in header next to name

**TechnicianDetail Implementation:**
- **Location:** Admin view of individual technician
- **File to Modify:** `/src/app/pages/TechnicianDetail.tsx`
- **Add:** New tab "Conformité" 
- **Display:** License badges, expiry warnings, compliance status
- **Integration:** Add license validation check before job assignment

**Key Features to Implement:**
```tsx
// In TechnicianDetail.tsx - add to tabs
<TabsTrigger value="conformite">Conformité</TabsTrigger>

<TabsContent value="conformite">
  <LicenseManagement 
    technicianId={id}
    technicianName={technician.name}
    license={technician.license}
    onUpdate={(license) => handleLicenseUpdate(license)}
  />
</TabsContent>

// Show badges in header
<LicenseBadges license={technician.license} />
```

---

### **FEATURE #2: Certification-Aware Job Material Entry**

**JobDetailsModal Implementation:**
- **Location:** Active job view when technician is working
- **File to Modify:** `/src/app/components/modals/JobDetailsModal.tsx`
- **Add:** New tab "Matériaux" in the modal
- **Component to use:** `<CertifiedMaterialsEntry jobId={job.id} />`

**Implementation:**
```tsx
// In JobDetailsModal.tsx
<Tabs>
  <TabsList>
    <TabsTrigger value="details">Détails</TabsTrigger>
    <TabsTrigger value="materials">Matériaux</TabsTrigger>
    <TabsTrigger value="photos">Photos</TabsTrigger>
  </TabsList>

  <TabsContent value="materials">
    <CertifiedMaterialsEntry
      jobId={job.id}
      materials={job.materials}
      onMaterialAdd={(material) => handleAddMaterial(material)}
      onAlert={(message) => toast.warning(message)}
    />
  </TabsContent>
</Tabs>
```

**Dispatcher Alert:**
- Add real-time notification when uncertified material is used
- Show warning badge on job card in DispatchCenter

---

### **FEATURE #3: Pre-Work Quotation and Client Consent**

**CreateJobModal Implementation:**
- **Location:** When creating a new job
- **File to Modify:** `/src/app/components/modals/CreateJobModal.tsx`
- **Add:** Checkbox option "Créer une soumission détaillée"
- **If checked:** Open DetailedQuoteBuilder before job creation

**Soumissions Page Enhancement:**
- **Location:** Existing Soumissions page
- **File to Modify:** `/src/app/pages/Soumissions.tsx` or `/src/app/pages/SoumissionsNew.tsx`
- **Add:** Use `<DetailedQuoteBuilder />` component
- **Features:** Service breakdown, labor calc, material list, digital signature

**Implementation:**
```tsx
// In SoumissionsNew.tsx
<DetailedQuoteBuilder
  clientId={selectedClient.id}
  clientName={selectedClient.name}
  clientEmail={selectedClient.email}
  onSave={(quote) => handleSaveQuote(quote)}
  onApprove={(quote) => handleApproveQuote(quote)}
/>
```

---

### **FEATURE #4: Safety and Quality Control Checklists**

**JobDetailsModal Implementation:**
- **Location:** Active job modal
- **File to Modify:** `/src/app/components/modals/JobDetailsModal.tsx`
- **Add:** New tab "Checklist"
- **Component:** `<SafetyChecklist jobId={job.id} jobType={job.service} />`

**Admin Checklist Templates:**
- **Location:** Admin > Paramètres > Services tab
- **Add:** "Gérer les checklists" button
- **Opens:** Modal to create/edit checklist templates per service type

**Implementation:**
```tsx
// In JobDetailsModal.tsx
<TabsContent value="checklist">
  <SafetyChecklist
    jobId={job.id}
    jobType={job.service}
    onComplete={(checklist) => handleChecklistComplete(checklist)}
    onPhotoCapture={(photo) => handlePhotoAdd(photo)}
  />
  {!checklistComplete && (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        La checklist doit être complétée avant de terminer le travail
      </AlertDescription>
    </Alert>
  )}
</TabsContent>

// Block job completion
const handleCompleteJob = () => {
  if (!job.checklistComplete) {
    toast.error('Veuillez compléter la checklist de sécurité');
    return;
  }
  // ... proceed with completion
};
```

---

### **FEATURE #5: Complaint and Incident Reporting**

**Dashboard Implementation:**
- **Location:** Admin Dashboard
- **File to Modify:** `/src/app/pages/Dashboard.tsx`
- **Add:** Widget showing recent incidents with `<IncidentDashboard />`

**TechnicianProfile Implementation:**
- **Location:** Technician app
- **File to Modify:** `/src/app/pages/TechnicianProfile.tsx`
- **Add:** Floating action button "Signaler un incident"
- **Opens:** `<IncidentReport />` modal

**DispatchCenter Implementation:**
- **Location:** Dispatch Center
- **File to Modify:** `/src/app/pages/DispatchCenter.tsx`
- **Add:** "Incidents" button in header
- **Opens:** Sheet with all incident reports

**Implementation:**
```tsx
// In TechnicianProfile.tsx
<Button 
  className="fixed bottom-6 right-6 rounded-full h-14 w-14"
  onClick={() => setIncidentReportOpen(true)}
>
  <AlertTriangle className="h-6 w-6" />
</Button>

<Dialog open={incidentReportOpen} onOpenChange={setIncidentReportOpen}>
  <DialogContent>
    <IncidentReport
      jobId={currentJob?.id}
      reportedBy={user.id}
      onSubmit={(report) => handleIncidentSubmit(report)}
    />
  </DialogContent>
</Dialog>
```

---

### **FEATURE #7: Legal Warranty and Warranty Management**

**InvoiceDetail Implementation:**
- **Location:** Invoice detail view after job completion
- **File to Modify:** `/src/app/pages/InvoiceDetail.tsx`
- **Add:** New section "Garantie" below payment info
- **Component:** `<WarrantyManagement jobId={invoice.jobId} />`

**ClientDetail Implementation:**
- **Location:** Client detail page
- **File to Modify:** `/src/app/pages/ClientDetail.tsx`
- **Add:** New tab "Garanties"
- **Shows:** All warranties for this client with claim functionality

**Implementation:**
```tsx
// In InvoiceDetail.tsx
<Card>
  <CardHeader>
    <CardTitle>Garantie légale</CardTitle>
  </CardHeader>
  <CardContent>
    <WarrantyManagement
      jobId={invoice.jobId}
      clientId={invoice.clientId}
      jobCompletedDate={invoice.completedAt}
      onWarrantyCreate={(warranty) => handleWarrantyCreate(warranty)}
      onClaimSubmit={(claim) => handleWarrantyClaim(claim)}
    />
  </CardContent>
</Card>
```

---

### **FEATURE #8: Education and Formation Tracking**

**TechnicianProfile Implementation:**
- **Location:** Technician > Profil
- **File to Modify:** `/src/app/pages/TechnicianProfile.tsx`
- **Add:** New tab "Formation"
- **Component:** `<EducationTracking technicianId={user.id} />`

**TechnicianDetail (Admin) Implementation:**
- **Location:** Admin view of technician
- **File to Modify:** `/src/app/pages/TechnicianDetail.tsx`
- **Add:** In "Conformité" tab, show education progress
- **Widget:** Display hours completed, deadline countdown

**Dashboard Widget:**
- **Location:** Admin Dashboard
- **File to Modify:** `/src/app/pages/Dashboard.tsx`
- **Add:** `<EducationDashboard technicians={technicians} />` widget

**Implementation:**
```tsx
// In TechnicianProfile.tsx
<TabsContent value="formation">
  <EducationTracking
    technicianId={user.id}
    technicianName={user.name}
    certificationLevel="compagnon"
    education={user.education}
    onUpdate={(education) => handleEducationUpdate(education)}
  />
</TabsContent>
```

---

### **FEATURE #9: Formal Notice and Recourse Workflow**

**Invoices Page Implementation:**
- **Location:** Invoices list with overdue filter
- **File to Modify:** `/src/app/pages/Invoices.tsx`
- **Add:** Filter for "En retard" invoices
- **Action:** Button "Gérer les relances" opens collection workflow

**InvoiceDetail Implementation:**
- **Location:** Invoice detail page for overdue invoices
- **File to Modify:** `/src/app/pages/InvoiceDetail.tsx`
- **Add:** Section "Recouvrement" if invoice is overdue
- **Component:** `<CollectionWorkflow invoice={invoice} />`

**Implementation:**
```tsx
// In InvoiceDetail.tsx
{invoice.status === 'overdue' && (
  <Card className="border-orange-300 bg-orange-50">
    <CardHeader>
      <CardTitle className="text-orange-900">Processus de recouvrement</CardTitle>
    </CardHeader>
    <CardContent>
      <CollectionWorkflow
        invoiceId={invoice.id}
        clientId={invoice.clientId}
        clientName={invoice.clientName}
        clientAddress={invoice.clientAddress}
        clientEmail={invoice.clientEmail}
        invoiceNumber={invoice.number}
        invoiceDate={invoice.date}
        amountDue={invoice.total}
        daysOverdue={calculateDaysOverdue(invoice)}
        onEscalate={(escalation) => handleEscalation(escalation)}
      />
    </CardContent>
  </Card>
)}
```

---

### **FEATURE #10: BSDQ Compliance Flag**

**SoumissionsNew Implementation:**
- **Location:** When creating a quote
- **File to Modify:** `/src/app/pages/SoumissionsNew.tsx`
- **Add:** Auto-detection logic for BSDQ requirements
- **Component:** `<BSDQCompliance />` alert if conditions met

**CreateJobModal Implementation:**
- **Location:** When creating jobs from quotes
- **File to Modify:** `/src/app/components/modals/CreateJobModal.tsx`
- **Add:** Check if quote requires BSDQ
- **Block:** Prevent conversion to job if not submitted

**Implementation:**
```tsx
// In SoumissionsNew.tsx
{quoteValue > 20000 && (hasMultipleSubcontractors || isBidSituation) && (
  <BSDQCompliance
    jobId={quoteId}
    quoteId={quoteId}
    estimatedValue={quoteValue}
    hasMultipleSubcontractors={hasMultipleSubcontractors}
    isBidSituation={isBidSituation}
    onSubmit={(compliance) => handleBSDQSubmit(compliance)}
  />
)}
```

---

### **FEATURE #11: Completion Certificate and Sign-Off**

**JobDetailsModal Implementation:**
- **Location:** When completing a job
- **File to Modify:** `/src/app/components/modals/JobDetailsModal.tsx`
- **Add:** Final step before completion: "Générer certificat"
- **Component:** `<CompletionCertificate />` with signatures

**ClientDetail Implementation:**
- **Location:** Client history
- **File to Modify:** `/src/app/pages/ClientDetail.tsx`
- **Add:** In job history, show download button for certificates

**Implementation:**
```tsx
// In JobDetailsModal.tsx - when completing job
<Dialog open={completionDialogOpen} onOpenChange={setCompletionDialogOpen}>
  <DialogContent className="max-w-4xl">
    <CompletionCertificate
      jobId={job.id}
      clientName={job.clientName}
      clientAddress={job.clientAddress}
      technicianName={technician.name}
      technicianLicense={technician.license.rbqNumber}
      workDescription={job.description}
      materialsUsed={job.materials}
      beforePhotos={job.beforePhotos}
      afterPhotos={job.afterPhotos}
      onGenerate={(certificate) => {
        handleCertificateGenerate(certificate);
        activateWarranty(job.id);
      }}
    />
  </DialogContent>
</Dialog>
```

---

### **FEATURE #12: Public Profile Compliance Enhancements**

**Client Portal Implementation:**
- **Location:** Public-facing client portal
- **Files to Create/Modify:** `/src/app/pages/portal/` directory
- **Add:** Company profile page with CMMTQ/RBQ badges
- **Display:** License numbers with verification links

**Public Pages:**
```tsx
// In portal/CompanyProfile.tsx
<Card>
  <CardHeader>
    <CardTitle>Plomberie Michael Lacoste</CardTitle>
    <div className="flex gap-2 mt-2">
      <Badge className="bg-blue-600">
        <Shield className="h-3 w-3 mr-1" />
        Membre CMMTQ
      </Badge>
      <Badge className="bg-green-600">
        <CheckCircle className="h-3 w-3 mr-1" />
        RBQ Vérifié
      </Badge>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div>
        <Label>Licence RBQ</Label>
        <div className="flex items-center gap-2">
          <p className="font-mono">{companyInfo.rbqLicenseNumber}</p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.open(`https://www.rbq.gouv.qc.ca/repertoire/${companyInfo.rbqLicenseNumber}`, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Vérifier
          </Button>
        </div>
      </div>
      <div>
        <Label>Adhésion CMMTQ</Label>
        <div className="flex items-center gap-2">
          <p className="font-mono">{companyInfo.cmmtqMembershipNumber}</p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.open(`https://www.cmmtq.org/verification/${companyInfo.cmmtqMembershipNumber}`, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Vérifier
          </Button>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 📋 INTEGRATION CHECKLIST BY FILE

### `/src/app/pages/Settings.tsx`
- [x] Add "Conformité" tab
- [x] Integrate DocumentCompliance
- [ ] Add "Techniciens" tab for license management
- [ ] Add checklist template editor

### `/src/app/pages/TechnicianProfile.tsx`
- [ ] Add "Licences & Certifications" tab
- [ ] Add "Formation" tab
- [ ] Add incident report button
- [ ] Display license badges in header

### `/src/app/pages/TechnicianDetail.tsx`
- [ ] Add "Conformité" tab
- [ ] Show license status and badges
- [ ] Show education progress
- [ ] Add license validation before job assignment

### `/src/app/pages/Dashboard.tsx`
- [ ] Add IncidentDashboard widget
- [ ] Add EducationDashboard widget
- [ ] Add warranty expiry alerts

### `/src/app/components/modals/JobDetailsModal.tsx`
- [ ] Add "Matériaux" tab with CertifiedMaterialsEntry
- [ ] Add "Checklist" tab with SafetyChecklist
- [ ] Add completion certificate generation step
- [ ] Block completion if checklist incomplete

### `/src/app/components/modals/CreateJobModal.tsx`
- [ ] Add quote creation option
- [ ] Add BSDQ compliance check
- [ ] Integrate DetailedQuoteBuilder

### `/src/app/pages/Soumissions.tsx` or `/src/app/pages/SoumissionsNew.tsx`
- [ ] Integrate DetailedQuoteBuilder
- [ ] Add BSDQ compliance alert
- [ ] Add digital signature capture

### `/src/app/pages/InvoiceDetail.tsx`
- [ ] Add WarrantyManagement section
- [ ] Add CollectionWorkflow for overdue invoices
- [ ] Display completion certificate download

### `/src/app/pages/Invoices.tsx`
- [ ] Add "En retard" filter
- [ ] Add bulk collection workflow action

### `/src/app/pages/ClientDetail.tsx`
- [ ] Add "Garanties" tab
- [ ] Show warranty claims
- [ ] Display completion certificates

### `/src/app/pages/DispatchCenter.tsx`
- [ ] Add incident reports button
- [ ] Show uncertified material alerts
- [ ] Display license warnings for technicians

---

## 🎯 PRIORITY IMPLEMENTATION ORDER

1. **HIGH PRIORITY (User-Facing)**
   - Feature #3: Pre-Work Quotation (revenue-critical)
   - Feature #11: Completion Certificate (legal requirement)
   - Feature #7: Warranty Management (customer satisfaction)
   - Feature #1: License Verification (compliance-critical)

2. **MEDIUM PRIORITY (Operational)**
   - Feature #4: Safety Checklists
   - Feature #2: Material Entry
   - Feature #9: Collection Workflow
   - Feature #8: Education Tracking

3. **LOW PRIORITY (Administrative)**
   - Feature #5: Incident Reporting
   - Feature #10: BSDQ Compliance
   - Feature #12: Public Profile
   - Feature #6: Document Compliance ✅ (DONE)

---

## 🔧 TECHNICAL NOTES

### State Management
- Use React Context for compliance data
- Add `ComplianceContext` for global compliance state
- Store in localStorage for persistence

### API Integration Points
```typescript
// Suggested API endpoints to add
POST /api/licenses/verify
POST /api/materials/certify
POST /api/quotes/create
POST /api/quotes/approve
POST /api/checklists/complete
POST /api/incidents/report
POST /api/warranties/create
POST /api/warranties/claim
POST /api/education/track
POST /api/collection/escalate
POST /api/bsdq/submit
POST /api/certificates/generate
```

### Database Schema Extensions
```typescript
// Add to existing schemas
Technician {
  license: TechnicianLicense
  education: ContinuingEducation
}

Job {
  materials: MaterialUsage[]
  checklist: CompletedChecklist
  certificate: CompletionCertificate
  quote: DetailedQuote
}

Invoice {
  warranty: Warranty
  collectionEscalation: CollectionEscalation
}

Company {
  legalInfo: CompanyLegalInfo
  bsdqCompliance: BSDQCompliance[]
}
```

---

## ✅ SUCCESS CRITERIA

- [ ] All 12 features integrated into appropriate pages
- [ ] No navigation disruption to existing flows
- [ ] All components render without errors
- [ ] Mobile-responsive design maintained
- [ ] French language consistency
- [ ] Design system compliance
- [ ] Type safety maintained
- [ ] All modals and dialogs functional
- [ ] Real-time notifications working
- [ ] PDF generation functional
- [ ] Signature capture working
- [ ] Photo upload working
- [ ] External links functional

---

**NEXT STEPS:** Implement features in priority order, starting with #3 (Quotation), #11 (Certificate), #7 (Warranty), and #1 (License Management).
