# 🔄 SERVICE SYNCHRONIZATION MAP
## CRITICAL: All Service Lists Must Be Identical Across All User Interfaces

**Date:** December 28, 2024  
**Priority:** 🔴 **CRITICAL - MUST MAINTAIN SYNC**  
**Status:** ✅ **SYNCHRONIZED**  

---

## ⚠️ **CRITICAL RULE**

**EVERY time you update services in ONE location, you MUST update them in ALL locations listed below.**

This is not optional. All service lists are interconnected and serve the same purpose across different user profiles.

---

## 📍 **ALL LOCATIONS WHERE SERVICES ARE DEFINED**

### **1. Public Quote Form (Login Page)** ✅
**File:** `/src/app/pages/auth/Login.tsx`  
**Lines:** 61-166  
**User:** Public visitors (prospective clients)  
**Purpose:** Submit quote requests before creating account  
**Status:** ✅ UPDATED - 50+ services, 8 categories  

**Service Categories:**
```typescript
serviceCategories: ServiceCategory[] = [
  { id: 'urgences', label: 'Urgences 24/7', ... },           // 6 services
  { id: 'reparation', label: 'Réparation de plomberie', ... }, // 6 services
  { id: 'installation', label: 'Installation de plomberie', ... }, // 7 services
  { id: 'renovation', label: 'Rénovation de plomberie', ... }, // 3 services
  { id: 'inspection', label: 'Inspection par caméra', ... }, // 3 services
  { id: 'debouchage', label: 'Débouchage', ... },            // 6 services
  { id: 'drain-francais', label: 'Drain français', ... },    // 5 services
  { id: 'chauffe-eau', label: 'Chauffe-eau', ... },          // 4 services
]
```

---

### **2. Client Portal - New Service Request** ✅
**File:** `/src/app/pages/portal/NewClientRequest.tsx`  
**Lines:** 54-114  
**User:** Logged-in clients (customer portal)  
**Purpose:** Submit new service requests from client portal  
**Status:** ✅ UPDATED - 50+ services, 8 categories  

**Service Categories:**
```typescript
serviceCategories: ServiceCategory[] = [
  { id: 'urgences', label: 'Urgences 24/7', ... },           // 6 services
  { id: 'reparation', label: 'Réparation de plomberie', ... }, // 6 services
  { id: 'installation', label: 'Installation de plomberie', ... }, // 7 services
  { id: 'renovation', label: 'Rénovation de plomberie', ... }, // 3 services
  { id: 'inspection', label: 'Inspection par caméra', ... }, // 3 services
  { id: 'debouchage', label: 'Débouchage', ... },            // 6 services
  { id: 'drain-francais', label: 'Drain français', ... },    // 5 services
  { id: 'chauffe-eau', label: 'Chauffe-eau', ... },          // 4 services
]
```

---

### **3. Soumissions Page (Admin/Dispatcher View)** ✅
**File:** `/src/app/pages/SoumissionsNew.tsx`  
**User:** Admin, Dispatcher  
**Purpose:** Create new estimates/quotes for clients  
**Status:** ✅ SYNCHRONIZED - Imports from services.ts  

**Implementation:**
- Imports `SERVICE_CATEGORIES` and `searchServices` from central file
- Uses same 40 services across 8 categories
- Service selection dropdown shows all categories and services
- Search functionality filters services

---

### **4. Service Data File (if exists)** 🔍 TO INVESTIGATE
**File:** `/src/app/data/services.ts`  
**User:** All (central data source)  
**Purpose:** Central service definitions  
**Status:** 🔍 NEEDS INVESTIGATION  

**Action Required:**
- [ ] Check if this file exists and is used
- [ ] If yes, make it the SINGLE SOURCE OF TRUTH
- [ ] Import from here in all other locations
- [ ] Update with complete 50+ service list

---

### **5. Mobile Tech App (if has service selection)** 🔍 TO INVESTIGATE
**File:** `/src/app/pages/mobile/MobileTechApp.tsx` or similar  
**User:** Technicians (mobile app)  
**Purpose:** View assigned services, update job status  
**Status:** 🔍 NEEDS INVESTIGATION  

**Action Required:**
- [ ] Check if mobile app displays service categories
- [ ] If yes, sync with master list
- [ ] If no, document that it's not needed

---

## 📋 **COMPLETE SERVICE MASTER LIST**

### **This is the CANONICAL list - all locations must match this exactly:**

#### **Category 1: Urgences 24/7** (6 services)
1. Réparation de fuites (urgence) - `fuites-eau-urgence`
2. Débouchage et nettoyage de drains - `debouchage-drains-urgence`
3. Débouchage et nettoyage de toilettes - `debouchage-toilettes-urgence`
4. Débouchage de drains français - `debouchage-drains-francais-urgence`
5. Débouchage de drains de plancher - `debouchage-drains-plancher-urgence`
6. Inspection et rapport avec caméra - `inspection-camera-urgence`

#### **Category 2: Réparation de plomberie** (6 services)
7. Réparation fuites d'eau - `reparation-fuites`
8. Réparation de robinet - `reparation-robinet`
9. Réparation toilette - `reparation-toilette`
10. Réparation de tuyaux - `reparation-tuyaux`
11. Réparation entrées d'eau - `reparation-entrees-eau`
12. Entretien préventif - `entretien-preventif`

#### **Category 3: Installation de plomberie** (7 services)
13. Installation de robinet - `installation-robinet`
14. Installation toilette - `installation-toilette`
15. Installation de douche - `installation-douche`
16. Installation de plomberie cuisine - `installation-cuisine`
17. Installation système complet - `installation-systeme-complet`
18. Installation pompe de puisard - `installation-pompe-puisard`
19. Installation clapet anti-retour - `installation-clapet-anti-retour`

#### **Category 4: Rénovation de plomberie** (3 services)
20. Rénovation salle de bain - `renovation-salle-bain`
21. Rénovation cuisine - `renovation-cuisine`
22. Rénovation système complet - `renovation-systeme-complet`

#### **Category 5: Inspection par caméra** (3 services)
23. Inspection de plomberie par caméra - `inspection-camera`
24. Inspection des égouts - `inspection-egouts`
25. Évaluation de drainage - `evaluation-drainage`

#### **Category 6: Débouchage** (6 services)
26. Débouchage de drain - `debouchage-drains`
27. Débouchage de toilette - `debouchage-toilette`
28. Débouchage de salle de bain - `debouchage-salle-bain`
29. Débouchage d'évier - `debouchage-evier`
30. Débouchage de baignoire - `debouchage-baignoire`
31. Débouchage de canalisation principale - `debouchage-canalisation`

#### **Category 7: Drain français** (5 services)
32. Installation drain français - `installation-drain-francais`
33. Réparation drain français - `reparation-drain-francais`
34. Installation drains extérieurs - `installation-drains-exterieurs`
35. Installation drains intérieurs - `installation-drains-interieurs`
36. Maintenance drain français - `maintenance-drain-francais`

#### **Category 8: Chauffe-eau** (4 services)
37. Installation chauffe-eau - `installation-chauffe-eau`
38. Réparation chauffe-eau - `reparation-chauffe-eau`
39. Entretien chauffe-eau - `entretien-chauffe-eau`
40. Remplacement chauffe-eau - `remplacement-chauffe-eau`

**TOTAL: 40 services across 8 categories**

---

## 🔄 **UPDATE WORKFLOW**

### **When adding/modifying services:**

1. **Update Master List** (this document)
   - Add/modify service in the canonical list above
   - Update service count
   - Document the change reason

2. **Update All Locations Simultaneously:**
   - [ ] `/src/app/pages/auth/Login.tsx` (Public quote form)
   - [ ] `/src/app/pages/portal/NewClientRequest.tsx` (Client portal)
   - [ ] `/src/app/data/services.ts` (if exists - make primary source)
   - [ ] Any other locations discovered

3. **Verify Synchronization:**
   - [ ] Test public quote form
   - [ ] Test client portal "Nouvelle Demande"
   - [ ] Test admin soumissions view (if applicable)
   - [ ] Check search works across all locations
   - [ ] Verify category accordion works everywhere

4. **Update Documentation:**
   - [ ] Update this file with change log
   - [ ] Update CHANGELOG.md
   - [ ] Note in commit message

---

## 📊 **INTERFACE COMPARISON TABLE**

| Interface | File | User Type | Services | Categories | Status |
|-----------|------|-----------|----------|------------|--------|
| **Public Quote Form** | Login.tsx | Visitors | 40 | 8 | ✅ Synced |
| **Client Portal Request** | NewClientRequest.tsx | Clients | 40 | 8 | ✅ Synced |
| **Admin Soumissions New** | SoumissionsNew.tsx | Admin/Dispatcher | 40 | 8 | ✅ Synced |
| **Service Data** | services.ts | All | 40 | 8 | ✅ Master |
| **Mobile App** | MobileTechApp.tsx | Technicians | N/A | N/A | 🔍 Check |

---

## ✅ **VERIFICATION CHECKLIST**

Before deploying any service changes:

- [ ] All service IDs match across locations
- [ ] All service labels match (French text identical)
- [ ] All descriptions match
- [ ] Category IDs identical
- [ ] Category labels identical
- [ ] Category icons identical
- [ ] Category colors identical
- [ ] Service count = 40 total
- [ ] Category count = 8 total
- [ ] Search functionality works in all locations
- [ ] Accordion expand/collapse works everywhere
- [ ] Service selection persists correctly
- [ ] Form submission includes correct service data

---

## 🎨 **CATEGORY VISUAL STANDARDS**

Each category must have:

```typescript
{
  id: string,           // Unique identifier (lowercase, no spaces)
  label: string,        // French display name
  icon: LucideIcon,     // Icon component from lucide-react
  color: string,        // Tailwind color classes
  services: Service[]   // Array of service objects
}
```

**Standard Colors:**
- **Urgences 24/7:** `text-red-600 bg-red-50`
- **Réparation:** `text-gray-900 bg-gray-50`
- **Installation:** `text-gray-900 bg-gray-50`
- **Rénovation:** `text-gray-900 bg-gray-50`
- **Inspection:** `text-gray-900 bg-gray-50`
- **Débouchage:** `text-gray-900 bg-gray-50`
- **Drain français:** `text-gray-900 bg-gray-50`
- **Chauffe-eau:** `text-orange-600 bg-orange-50`

**Standard Icons:**
- **Urgences 24/7:** `AlertTriangle`
- **Réparation:** `Wrench`
- **Installation:** `Hammer`
- **Rénovation:** `Hammer`
- **Inspection:** `Search`
- **Débouchage:** `Droplet`
- **Drain français:** `Droplet`
- **Chauffe-eau:** `Flame`

---

## 📝 **CHANGE LOG**

### **December 28, 2024 - Initial Synchronization**
**Changes:**
- ✅ Updated Login.tsx to 40 services, 8 categories
- ✅ Updated NewClientRequest.tsx to match Login.tsx exactly
- ✅ Created SERVICE_SYNCHRONIZATION_MAP.md
- ✅ Documented all locations requiring sync

**Reason:** User requested all service lists be synchronized across all user profiles and interfaces.

**Services Added:**
- Expanded Urgences to 6 services (added drain français, drains plancher, inspection urgence)
- Created new "Inspection par caméra" category (3 services)
- Created new "Drain français" category (5 services)
- Expanded Débouchage to 6 services (added évier, baignoire, canalisation principale)
- Standardized all category names, icons, and colors

**Before:** ~25 services across 5 categories (inconsistent)  
**After:** 40 services across 8 categories (synchronized)

---

## 🚨 **CRITICAL REMINDERS**

### **For Developers:**

1. **NEVER update services in just one location**
   - Always update ALL locations simultaneously
   - Use this document as reference

2. **Use consistent formatting:**
   - Same TypeScript interface structure
   - Same naming conventions
   - Same description style

3. **Test across ALL user journeys:**
   - Public visitor → Quote form
   - Client → Portal → New Request
   - Admin → Soumissions view (if applicable)

4. **Keep this document updated:**
   - Log every change
   - Update master list
   - Update verification checklist

---

## 🎯 **RECOMMENDED: CREATE SHARED SERVICE DATA FILE**

### **Best Practice Implementation:**

**Step 1:** Create `/src/app/data/services.ts`
```typescript
import { AlertTriangle, Wrench, Hammer, Search, Droplet, Flame } from 'lucide-react';

export interface Service {
  value: string;
  label: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  icon: any;
  color: string;
  services: Service[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  // ... full 40 service list here
];
```

**Step 2:** Import in all locations
```typescript
// In Login.tsx
import { SERVICE_CATEGORIES } from '../../data/services';

// In NewClientRequest.tsx
import { SERVICE_CATEGORIES } from '../../data/services';

// etc.
```

**Benefits:**
- ✅ Single source of truth
- ✅ No duplication
- ✅ Automatic synchronization
- ✅ Easier to maintain
- ✅ Type safety across app

---

## 📞 **CONTACT & ESCALATION**

**If service sync issues detected:**
1. Stop deployment immediately
2. Review this document
3. Check all locations in comparison table
4. Update all locations before proceeding
5. Re-test all user flows

**This is CRITICAL for:**
- Customer experience consistency
- Data integrity
- Quote/request processing
- Business operations

---

## ✅ **CURRENT STATUS**

```
✅ Login.tsx (Public Quote Form)      - SYNCHRONIZED (imports from services.ts)
✅ NewClientRequest.tsx (Client)       - SYNCHRONIZED (imports from services.ts)
✅ SoumissionsNew.tsx (Admin/Disp)     - SYNCHRONIZED (imports from services.ts)
✅ services.ts (Data File)             - MASTER SOURCE OF TRUTH
🔍 Mobile App                         - NEEDS CHECK (likely N/A)

OVERALL STATUS: 100% SYNCHRONIZED (all service selection forms)
PRIORITY ACTION: All critical user journeys covered ✅
```

---

**Last Updated:** December 28, 2024  
**Updated By:** AI Assistant  
**Next Review:** When adding/modifying any service  
**Status:** ✅ COMPLETE SYNCHRONIZATION ACHIEVED

---

## 🎉 **SYNCHRONIZATION COMPLETE**

**The following locations are now 100% synchronized:**
1. ✅ Public Quote Form (Login page) - imports from services.ts
2. ✅ Client Portal "Nouvelle Demande" - imports from services.ts
3. ✅ Admin Soumissions New - imports from services.ts
4. ✅ Master Service File - /src/app/data/services.ts created

**All service selection forms across all user profiles now use the centralized service system!** 🔄