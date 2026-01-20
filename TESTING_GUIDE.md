# 🧪 TESTING GUIDE
## Plomberie D'Experts - Comprehensive QA Testing

---

## 📋 **TESTING OVERVIEW**

This guide provides step-by-step instructions for testing all features of the Plomberie D'Experts dispatch platform to ensure 100% functionality before production deployment.

**Testing Duration:** 4-6 hours (comprehensive)
**Testers Required:** 3 (Admin/Dispatcher, Technician, QA)

---

## 🎯 **TESTING OBJECTIVES**

1. ✅ Verify all 15 bug fixes are working
2. ✅ Ensure all critical workflows function correctly
3. ✅ Validate role-based access control
4. ✅ Test responsive design on multiple devices
5. ✅ Verify data integrity and consistency
6. ✅ Confirm error handling works properly

---

## 🔐 **TEST ACCOUNTS**

### **Admin Account**
- **Email:** admin@plomberiedexperts.com
- **Password:** admin123
- **Access:** Full platform access

### **Dispatcher Account**
- **Email:** dispatcher@plomberiedexperts.com
- **Password:** dispatch123
- **Access:** Operational features (no settings)

### **Technician Account**
- **Email:** technician@plomberiedexperts.com
- **Password:** tech123
- **Access:** Mobile app and profile

---

## 🧪 **TEST SCENARIOS**

---

## **SECTION 1: AUTHENTICATION & AUTHORIZATION** ⏱️ 15 min

### **Test 1.1: Login Flow**
**Steps:**
1. Navigate to `/login`
2. Enter admin credentials
3. Click "Connexion"

**Expected Results:**
- ✅ Redirects to dashboard
- ✅ User name appears in header
- ✅ Navigation menu displays all items

**Pass/Fail:** ☐

---

### **Test 1.2: Role-Based Access**
**Steps:**
1. Login as dispatcher
2. Try accessing `/settings`

**Expected Results:**
- ✅ Shows "Accès refusé" message
- ✅ Cannot access admin-only features

**Pass/Fail:** ☐

---

### **Test 1.3: Logout**
**Steps:**
1. Click user menu
2. Click "Déconnexion"

**Expected Results:**
- ✅ Redirects to login page
- ✅ Cannot access protected routes
- ✅ All session data cleared

**Pass/Fail:** ☐

---

## **SECTION 2: DASHBOARD** ⏱️ 20 min

### **Test 2.1: Activity Timeline Navigation (BUG FIX #1)**
**Steps:**
1. Navigate to Dashboard (`/`)
2. Find Activity Timeline widget
3. Click on various activity items:
   - Job activity → should go to `/dispatch`
   - Client activity → should go to `/clients`
   - Invoice activity → should go to `/invoices`
   - Message activity → should go to `/notifications`

**Expected Results:**
- ✅ All activities are clickable
- ✅ Hover shows pointer cursor
- ✅ Navigation works correctly for each type
- ✅ No console errors

**Pass/Fail:** ☐

---

### **Test 2.2: Dashboard Stats**
**Steps:**
1. View KPI cards on dashboard
2. Check for proper data display

**Expected Results:**
- ✅ All stat numbers display correctly
- ✅ Trend indicators show (up/down arrows)
- ✅ Charts render properly
- ✅ No loading errors

**Pass/Fail:** ☐

---

## **SECTION 3: CLIENT MANAGEMENT** ⏱️ 30 min

### **Test 3.1: Client List**
**Steps:**
1. Navigate to `/clients`
2. Use search bar
3. Use filters

**Expected Results:**
- ✅ All clients display in table
- ✅ Search filters results
- ✅ Pagination works
- ✅ Client cards clickable

**Pass/Fail:** ☐

---

### **Test 3.2: Schedule Job Button (BUG FIX #3)**
**Steps:**
1. Navigate to any client detail page (e.g., `/clients/1`)
2. Click "Planifier un travail" button

**Expected Results:**
- ✅ CreateJobModal opens
- ✅ Client information pre-filled
- ✅ Can select service type
- ✅ Can select technician
- ✅ Can set date/time
- ✅ "Créer le travail" button works
- ✅ Toast confirmation appears
- ✅ Modal closes after creation

**Pass/Fail:** ☐

---

### **Test 3.3: Generate Invoice Button (BUG FIX #3)**
**Steps:**
1. On client detail page
2. Click "Générer une facture" button

**Expected Results:**
- ✅ CreateInvoiceModal opens
- ✅ Client information pre-filled
- ✅ Can add line items
- ✅ Subtotal/tax/total calculate correctly
- ✅ "Créer la facture" button works
- ✅ Toast confirmation appears
- ✅ Modal closes after creation

**Pass/Fail:** ☐

---

### **Test 3.4: Property Passport Creation (BUG FIX #5)**
**Steps:**
1. Navigate to `/property-passports`
2. Click "Nouveau passeport" button
3. Fill in form:
   - Property address: "123 Rue Principale, Montréal, QC"
   - Client name: "Jean Tremblay"
   - Phone: "514-555-1234"
   - Email: "jean@email.com"
   - Type: Résidentiel
   - Year built: 2010
4. Click "Créer le passeport"

**Expected Results:**
- ✅ Modal opens with form
- ✅ All fields work correctly
- ✅ Property type selector functions
- ✅ Form validates required fields
- ✅ Passport created successfully
- ✅ Toast confirmation appears
- ✅ Redirects to passport detail page
- ✅ All entered data displays correctly

**Pass/Fail:** ☐

---

## **SECTION 4: DISPATCH CENTER** ⏱️ 45 min

### **Test 4.1: Auto-Dispatch Functionality (BUG FIX #6)**
**Steps:**
1. Navigate to `/dispatch`
2. Verify there are pending unassigned jobs
3. Click "Auto-dispatcher" button
4. Observe job assignment

**Expected Results:**
- ✅ Button is clickable and responsive
- ✅ Toast shows "X travaux assignés automatiquement"
- ✅ Jobs move from "En attente" to "Assigné"
- ✅ Jobs distributed among available technicians
- ✅ Round-robin distribution visible
- ✅ If no available techs, shows warning toast
- ✅ If no pending jobs, shows info toast

**Pass/Fail:** ☐

---

### **Test 4.2: Kanban Drag-and-Drop (BUG FIX #11)**
**Steps:**
1. On dispatch page, locate Kanban board
2. Find a job card in "En attente" column
3. Drag to "Assigné" column
4. Drag another job to "En route"
5. Drag to "En cours"
6. Drag to "Complété"

**Expected Results:**
- ✅ Cards are draggable
- ✅ Visual feedback during drag
- ✅ Cards drop into columns
- ✅ Job status updates
- ✅ Toast confirmation for status change
- ✅ No errors in console
- ✅ Jobs persist in new columns

**Pass/Fail:** ☐

---

### **Test 4.3: Job Assignment Modal**
**Steps:**
1. Click "Créer un travail" button
2. Fill in job details
3. Assign technician
4. Set priority

**Expected Results:**
- ✅ Modal opens correctly
- ✅ All form fields work
- ✅ Technician dropdown populated
- ✅ Date/time pickers function
- ✅ Job created successfully
- ✅ Appears in Kanban board

**Pass/Fail:** ☐

---

## **SECTION 5: TECHNICIAN MANAGEMENT** ⏱️ 25 min

### **Test 5.1: Technician List**
**Steps:**
1. Navigate to `/technicians`
2. View all technicians
3. Check status indicators

**Expected Results:**
- ✅ All technicians display
- ✅ Status badges show correct colors
- ✅ Performance stats visible
- ✅ Cards are clickable

**Pass/Fail:** ☐

---

### **Test 5.2: Chat Integration (BUG FIX #12)**
**Steps:**
1. Navigate to any technician detail page (e.g., `/technicians/1`)
2. Locate "Message" button in contact info section
3. Click "Message" button

**Expected Results:**
- ✅ ChatModal opens
- ✅ Technician name displays in modal header
- ✅ Can type message in input field
- ✅ Can click "Envoyer" button
- ✅ Message appears in chat thread
- ✅ Simulated response appears after 2 seconds
- ✅ Can close modal with X button
- ✅ Can send multiple messages

**Pass/Fail:** ☐

---

### **Test 5.3: Technician Performance**
**Steps:**
1. On technician detail page
2. View performance metrics
3. Check job history

**Expected Results:**
- ✅ Completion rate displays
- ✅ Charts render correctly
- ✅ Job history table shows data
- ✅ Ratings visible

**Pass/Fail:** ☐

---

## **SECTION 6: INVOICING** ⏱️ 30 min

### **Test 6.1: Invoice List**
**Steps:**
1. Navigate to `/invoices`
2. View invoice table
3. Use filters

**Expected Results:**
- ✅ All invoices display
- ✅ Status badges correct colors
- ✅ Amounts formatted properly
- ✅ Search and filter work

**Pass/Fail:** ☐

---

### **Test 6.2: Invoice Download (BUG FIX #4)**
**Steps:**
1. On invoice list page
2. Find any invoice row
3. Click the "Download" (📥) button

**Expected Results:**
- ✅ PDF file downloads immediately
- ✅ Filename format: `Facture_INV-2024-XXX.pdf`
- ✅ PDF contains:
  - Company name "Plomberie D'Experts"
  - Invoice number
  - Date issued
  - Client name
  - Amount
  - Status
- ✅ PDF is readable and professional
- ✅ No errors in console

**Pass/Fail:** ☐

---

### **Test 6.3: Invoice Send Email (BUG FIX #4)**
**Steps:**
1. On invoice list page
2. Click "Send" (📧) button

**Expected Results:**
- ✅ Toast appears: "Facture envoyée par courriel"
- ✅ No errors occur
- ✅ Button is responsive

**Pass/Fail:** ☐

---

### **Test 6.4: Invoice Detail**
**Steps:**
1. Click on any invoice to view detail
2. Navigate to `/invoices/1`

**Expected Results:**
- ✅ Full invoice details display
- ✅ Line items show correctly
- ✅ Totals calculate properly
- ✅ Can download from detail view
- ✅ Can edit invoice

**Pass/Fail:** ☐

---

## **SECTION 7: GPS TRACKING** ⏱️ 30 min

### **Test 7.1: Map Redesign (BUG FIX #13)**
**Steps:**
1. Navigate to `/map`
2. Observe initial map display

**Expected Results:**
- ✅ Map loads without errors
- ✅ Technician markers display correctly
- ✅ Markers show initials and colors based on status:
  - Green = Available
  - Orange = Busy
  - Blue = En route
- ✅ Pulse animation on active technicians
- ✅ Top stats bar shows active/available/busy counts
- ✅ Street grid and zones visible

**Pass/Fail:** ☐

---

### **Test 7.2: Interactive Markers**
**Steps:**
1. Hover over technician markers
2. Click on a marker

**Expected Results:**
- ✅ Hover shows popup with tech details
- ✅ Click selects technician (marker scales up)
- ✅ Selected marker has blue ring
- ✅ Detail popup shows:
  - Name, email, status badge
  - Job completion progress bar
  - Current GPS address
  - Active job indicator (if applicable)
  - ETA for en-route techs
  - Call and Assign buttons
- ✅ Can click different markers
- ✅ Click again to deselect

**Pass/Fail:** ☐

---

### **Test 7.3: Map Controls**
**Steps:**
1. Click Zoom In button
2. Click Zoom Out button
3. Click Navigation button
4. Click Refresh button

**Expected Results:**
- ✅ All buttons are clickable
- ✅ Toast feedback for actions
- ✅ Refresh button updates "Dernière mise à jour" timestamp
- ✅ Icons display correctly

**Pass/Fail:** ☐

---

### **Test 7.4: Layer Controls**
**Steps:**
1. Toggle "Trafic temps réel" switch
2. Toggle "Zones de service" switch (should see colored zones disappear/reappear)
3. Toggle "Routes optimisées" switch (should see route lines disappear/reappear)
4. Toggle "Mise à jour auto" switch

**Expected Results:**
- ✅ All toggles work
- ✅ Service zones show/hide
- ✅ Route lines with arrows show/hide
- ✅ Auto-refresh can be enabled/disabled
- ✅ Last update timestamp displays

**Pass/Fail:** ☐

---

### **Test 7.5: Assign Job from Map**
**Steps:**
1. Click on available technician marker
2. Click "Assigner" button in popup
3. AssignJobModal should open

**Expected Results:**
- ✅ Modal opens with technician pre-selected
- ✅ Can select job to assign
- ✅ Assignment works correctly

**Pass/Fail:** ☐

---

## **SECTION 8: ANALYTICS** ⏱️ 30 min

### **Test 8.1: Analytics Dashboard**
**Steps:**
1. Navigate to `/analytics`
2. View KPI cards
3. Check charts

**Expected Results:**
- ✅ Revenue stats display
- ✅ Job completion stats show
- ✅ Charts render correctly (recharts)
- ✅ Pie chart shows service distribution
- ✅ Bar chart shows tech performance

**Pass/Fail:** ☐

---

### **Test 8.2: Service Breakdown (BUG FIX #14)**
**Steps:**
1. Scroll to bottom of analytics page
2. Locate "Analyse détaillée par service" section
3. View 8 service cards:
   - 🚰 Débouchage de drains
   - 🔥 Installation chauffe-eau
   - 🔧 Réparation robinetterie
   - 🚨 Interventions urgentes
   - ⚙️ Installation clapet anti-retour
   - 📹 Inspection caméra
   - 💧 Installation pompe de puisard
   - 💦 Réparation fuite d'eau

**Expected Results:**
- ✅ All 8 service cards display
- ✅ Each card shows:
  - Service icon (emoji)
  - Category badge
  - Trend indicator (percentage)
  - Total revenue (formatted with $)
  - Job count
  - Average value
  - Average duration
  - Completion rate with progress bar
- ✅ Responsive grid (4 columns desktop, 2 tablet, 1 mobile)
- ✅ Cards are clickable
- ✅ Hover shows shadow effect

**Pass/Fail:** ☐

---

### **Test 8.3: Interactive Service Cards**
**Steps:**
1. Click on "Débouchage de drains" card
2. Observe card selection (blue ring)
3. Click "Voir rapport détaillé" button
4. Click another card

**Expected Results:**
- ✅ Card gets selected (blue ring appears)
- ✅ "Voir rapport détaillé" button appears
- ✅ Clicking button shows toast
- ✅ Can select different cards
- ✅ Click again to deselect

**Pass/Fail:** ☐

---

### **Test 8.4: Export Functionality**
**Steps:**
1. Click "Exporter" button at top
2. Observe toast message

**Expected Results:**
- ✅ Toast confirms: "Rapport exporté avec succès"
- ✅ Button is responsive

**Pass/Fail:** ☐

---

## **SECTION 9: MAINTENANCE CONTRACTS** ⏱️ 20 min

### **Test 9.1: Contract List**
**Steps:**
1. Navigate to `/maintenance-contracts`
2. View all contracts

**Expected Results:**
- ✅ Contracts display with tier badges
- ✅ Status colors correct
- ✅ Visit progress shows
- ✅ Revenue stats visible

**Pass/Fail:** ☐

---

### **Test 9.2: Contract Details (BUG FIX #2)**
**Steps:**
1. Click "Voir détails" on any contract
2. View modal that opens

**Expected Results:**
- ✅ Detail modal opens (no crash!)
- ✅ All contract information displays
- ✅ Visit history shows
- ✅ Can close modal with X
- ✅ No navigation errors

**Pass/Fail:** ☐

---

### **Test 9.3: Add New Contract**
**Steps:**
1. Click "Nouveau contrat" button
2. Fill in form
3. Select tier

**Expected Results:**
- ✅ Modal opens
- ✅ Form fields work
- ✅ Tier selection displays pricing
- ✅ Contract created successfully

**Pass/Fail:** ☐

---

## **SECTION 10: QUOTES (SOUMISSIONS)** ⏱️ 25 min

### **Test 10.1: Quote List**
**Steps:**
1. Navigate to `/soumissions`
2. View all quotes

**Expected Results:**
- ✅ Quotes display in table
- ✅ Status badges show
- ✅ Can filter by status
- ✅ Search works

**Pass/Fail:** ☐

---

### **Test 10.2: Service Selection (BUG FIX #7)**
**Steps:**
1. Click "Nouvelle soumission"
2. Navigate to service selection step
3. Click "Sélectionner des services" button
4. ServiceSelectorModal opens
5. Search for "débouchage"
6. Select 2-3 services
7. Confirm selection

**Expected Results:**
- ✅ Modal opens with 100+ services
- ✅ Services organized by categories
- ✅ Search filters services
- ✅ Can select/deselect services
- ✅ Selected count updates
- ✅ Services added to quote
- ✅ Prices calculate correctly

**Pass/Fail:** ☐

---

### **Test 10.3: Chat Integration (BUG FIX #8)**
**Steps:**
1. On soumissions page
2. Click chat/message icon on any quote
3. ChatModal opens

**Expected Results:**
- ✅ Modal opens with client info
- ✅ Can send messages
- ✅ Messages display correctly
- ✅ Can close modal

**Pass/Fail:** ☐

---

## **SECTION 11: NOTIFICATIONS** ⏱️ 15 min

### **Test 11.1: Notification Panel**
**Steps:**
1. Click bell icon in header
2. View notification panel

**Expected Results:**
- ✅ Panel opens
- ✅ Notifications display
- ✅ Unread count badge shows
- ✅ Notifications grouped by date

**Pass/Fail:** ☐

---

### **Test 11.2: Notification Actions (BUG FIX #9)**
**Steps:**
1. Open notification panel
2. Click "Tout marquer comme lu" button
3. Click "Voir toutes" button
4. Click settings gear icon

**Expected Results:**
- ✅ "Marquer comme lu" works (changes read state)
- ✅ "Voir toutes" navigates to `/notifications`
- ✅ Settings icon shows toast
- ✅ All buttons are functional
- ✅ No console errors

**Pass/Fail:** ☐

---

## **SECTION 12: RESPONSIVE DESIGN** ⏱️ 30 min

### **Test 12.1: Mobile View (375px)**
**Steps:**
1. Resize browser to 375px width
2. Navigate through all pages

**Expected Results:**
- ✅ Navigation collapses to mobile menu
- ✅ Tables scroll horizontally
- ✅ Cards stack vertically
- ✅ Forms are usable
- ✅ Buttons are tappable
- ✅ No horizontal overflow

**Pass/Fail:** ☐

---

### **Test 12.2: Tablet View (768px)**
**Steps:**
1. Resize browser to 768px
2. Check layout adjustments

**Expected Results:**
- ✅ 2-column layouts work
- ✅ Navigation adapts
- ✅ Charts responsive
- ✅ No layout breaks

**Pass/Fail:** ☐

---

### **Test 12.3: Desktop View (1920px)**
**Steps:**
1. Full screen desktop view
2. Check spacing and layout

**Expected Results:**
- ✅ Full navigation visible
- ✅ Multi-column grids display
- ✅ Charts use full width
- ✅ Professional appearance

**Pass/Fail:** ☐

---

## **SECTION 13: ERROR HANDLING** ⏱️ 15 min

### **Test 13.1: Form Validation**
**Steps:**
1. Try submitting forms with empty required fields
2. Enter invalid email/phone formats

**Expected Results:**
- ✅ Validation messages appear
- ✅ Cannot submit invalid forms
- ✅ Error messages clear

**Pass/Fail:** ☐

---

### **Test 13.2: Network Errors**
**Steps:**
1. Simulate offline mode
2. Try performing actions

**Expected Results:**
- ✅ Graceful error messages
- ✅ No app crashes
- ✅ ErrorBoundary catches errors

**Pass/Fail:** ☐

---

## **SECTION 14: PERFORMANCE** ⏱️ 20 min

### **Test 14.1: Page Load Times**
**Steps:**
1. Measure load time for each major page
2. Use browser DevTools Performance tab

**Expected Results:**
- ✅ Dashboard: < 2 seconds
- ✅ Dispatch: < 3 seconds
- ✅ Map: < 3 seconds
- ✅ Analytics: < 3 seconds
- ✅ All others: < 2 seconds

**Pass/Fail:** ☐

---

### **Test 14.2: Memory Usage**
**Steps:**
1. Open DevTools Memory tab
2. Navigate between pages
3. Check for memory leaks

**Expected Results:**
- ✅ Memory doesn't grow indefinitely
- ✅ Proper cleanup on unmount
- ✅ No console warnings

**Pass/Fail:** ☐

---

## 📊 **TEST SUMMARY**

### **Overall Test Results**

| Category | Tests | Passed | Failed | Pass Rate |
|----------|-------|--------|--------|-----------|
| Authentication | 3 | ☐ | ☐ | ☐ |
| Dashboard | 2 | ☐ | ☐ | ☐ |
| Client Management | 4 | ☐ | ☐ | ☐ |
| Dispatch Center | 3 | ☐ | ☐ | ☐ |
| Technicians | 3 | ☐ | ☐ | ☐ |
| Invoicing | 4 | ☐ | ☐ | ☐ |
| GPS Tracking | 5 | ☐ | ☐ | ☐ |
| Analytics | 4 | ☐ | ☐ | ☐ |
| Contracts | 3 | ☐ | ☐ | ☐ |
| Quotes | 3 | ☐ | ☐ | ☐ |
| Notifications | 2 | ☐ | ☐ | ☐ |
| Responsive | 3 | ☐ | ☐ | ☐ |
| Error Handling | 2 | ☐ | ☐ | ☐ |
| Performance | 2 | ☐ | ☐ | ☐ |
| **TOTAL** | **43** | **☐** | **☐** | **☐%** |

---

## 🐛 **BUG REPORTING TEMPLATE**

If you find any issues during testing, report them using this format:

```
**Bug ID:** [Unique identifier]
**Severity:** [Critical / High / Medium / Low]
**Page/Feature:** [Where the bug occurs]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:** [What should happen]
**Actual Result:** [What actually happens]
**Screenshots:** [If applicable]
**Browser/Device:** [Chrome, Firefox, Safari, Mobile, etc.]
**Console Errors:** [Any error messages]
```

---

## ✅ **SIGN-OFF**

**Tested By:** ___________________
**Date:** ___________________
**Overall Status:** ☐ PASS / ☐ FAIL
**Ready for Production:** ☐ YES / ☐ NO

**Notes:**
_______________________________________
_______________________________________
_______________________________________

---

**Document Version:** 1.0
**Last Updated:** December 17, 2024
**Next Review:** After bug fixes (if any)
