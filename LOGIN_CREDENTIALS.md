# Login Credentials & Demo Accounts

## 🌐 Access URL
**http://localhost:5177/**

---

## 🔐 Demo Accounts

**Password for ALL accounts:** Any password works! (Type anything)

### 1. Super Admin (Full Access)
- **Email:** `gabriel@lafrance.com`
- **Password:** `password` (or any text)
- **Division:** Plomberie (or any)
- **Access:** All features, all divisions, complete system control

**What you can see:**
- Admin payment management (`/admin/payments`)
- Admin claim arbitration (`/admin/aftersales/:claimId`)
- All plumber features
- All client features
- Multi-division dashboard
- Analytics and settings

---

### 2. Division Head - Plomberie
- **Email:** `michael@lafrance.com`
- **Password:** `password` (or any text)
- **Division:** Plomberie
- **Access:** Full access to plumbing division

**What you can see:**
- Plumber marketplace (`/plumber-marketplace`)
- Plumber payments (`/plumber/payments`)
- After-sales claims (`/plumber/aftersales`)
- Mobile job workflow
- All plumbing-specific features

---

### 3. Division Head - Toitures
- **Email:** `jonathan@lafrance.com`
- **Password:** `password` (or any text)
- **Division:** Toitures
- **Access:** Full access to roofing division

---

### 4. Dispatcher - Plomberie
- **Email:** `dispatcher.plomberie@lafrance.com`
- **Password:** `password` (or any text)
- **Division:** Plomberie
- **Access:** Job dispatch, technician management

---

### 5. Dispatcher - Toitures
- **Email:** `dispatcher.toitures@lafrance.com`
- **Password:** `password` (or any text)
- **Division:** Toitures
- **Access:** Job dispatch, technician management

---

### 6. Technician (Plumber)
- **Email:** `technicien@plomberie.com`
- **Password:** `password` (or any text)
- **Division:** Plomberie
- **Name:** Marc Tremblay
- **License:** CMMTQ M789012

**What you can see:**
- Mobile job workflow (`/mobile/job/:jobId`)
- Job tracking with GPS
- Photo progression
- Invoice generation
- Payment dashboard (`/plumber/payments`)
- After-sales management (`/plumber/aftersales`)

---

### 7. Client
- **Email:** `client@example.com`
- **Password:** `password` (or any text)
- **Name:** Jean Dupont

**What you can see:**
- Client request form (`/client-request`)
- Invoice view (`/portal/invoice/:invoiceId`)
- Payment page (`/portal/payment`)
- After-sales service (`/portal/aftersales/:invoiceId`)
- Rating system

---

### 8. Admin User
- **Email:** `admin@lafrance.com`
- **Password:** `password` (or any text)
- **Division:** Plomberie (has access to multiple)
- **Access:** Multi-division admin access

---

## 📍 Key URLs to Test Features

### Without Login (Public Pages)
- **Login:** `/login`
- **Client Login:** `/client-login`
- **Client Registration:** `/client-register`
- **Plumber Registration:** `/plumber-register` ⭐ NEW FEATURE

### Plumber Features (Login as technician or admin)
- **BET Marketplace:** `/plumber-marketplace` ⭐ NEW FEATURE
- **Payments Dashboard:** `/plumber/payments` ⭐ NEW FEATURE
- **After-Sales Claims:** `/plumber/aftersales` ⭐ NEW FEATURE
- **Mobile Job Workflow:** `/mobile/job/JOB-123` ⭐ NEW FEATURE

### Client Features (Can access without login or as client)
- **Request Service:** `/client-request` ⭐ NEW FEATURE
- **View Invoice:** `/portal/invoice/INV-2026-001` ⭐ NEW FEATURE
- **Payment Page:** `/portal/payment` ⭐ NEW FEATURE
- **After-Sales:** `/portal/aftersales/INV-2026-001` ⭐ NEW FEATURE

### Admin Features (Login as admin or super-admin)
- **Payment Management:** `/admin/payments` ⭐ NEW FEATURE
- **Claim Arbitration:** `/admin/aftersales/CLAIM-001` ⭐ NEW FEATURE

### Legacy Features (All users)
- **Dashboard:** `/`
- **Dispatch Center:** `/dispatch`
- **Technicians:** `/technicians`
- **Clients:** `/clients`
- **Map View:** `/map`
- **Invoices:** `/invoices`
- **Analytics:** `/analytics`

---

## 🎯 Recommended Testing Flow

### 1. Test Complete Plumber Workflow
**Login:** `technicien@plomberie.com`

1. Go to `/plumber-register` - See subscription tiers
2. Go to `/plumber-marketplace` - See BET bidding system
3. Go to `/mobile/job/JOB-456` - See mobile workflow with:
   - GPS tracking
   - Photo progression
   - Invoice generation
4. Go to `/plumber/payments` - See payment split dashboard
5. Go to `/plumber/aftersales` - See after-sales claims

### 2. Test Complete Client Workflow
**Login:** `client@example.com` OR no login

1. Go to `/client-request` - Submit service request
2. Go to `/portal/payment` - See payment options
3. Go to `/portal/invoice/INV-2026-001` - View invoice
4. Click "Évaluer le service" - Rate plumber
5. Go to `/portal/aftersales/INV-2026-001` - Submit claim

### 3. Test Admin Features
**Login:** `gabriel@lafrance.com` (Super Admin)

1. Go to `/admin/payments` - Manage all plumber payments
2. Click any payment - Release held payments
3. Go to `/admin/aftersales/CLAIM-004` - Arbitrate disputes
4. See compliance document tracking
5. Review penalty applications

---

## 🔑 Quick Copy-Paste Logins

### For Super Admin Testing:
```
Email: gabriel@lafrance.com
Password: password
Division: Plomberie
```

### For Plumber Testing:
```
Email: technicien@plomberie.com
Password: password
Division: Plomberie
```

### For Client Testing:
```
Email: client@example.com
Password: password
```

---

## 💡 Tips

1. **Any password works** - The demo mode accepts any text as password
2. **Division matters** - Select the right division for role-specific features
3. **Use Super Admin** - For complete access to all features
4. **Test mobile view** - Use browser dev tools (F12 → mobile view) for `/mobile/*` routes
5. **Mock data** - All data is mock/demo data, no real backend calls

---

## 🐛 Troubleshooting

### If login doesn't work:
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check console for errors (F12)
3. Try different browser
4. Make sure dev server is running on port 5177

### If features don't appear:
1. Check you're logged in with correct role
2. Super admin has access to everything
3. Some features require specific roles (technician, admin, etc.)

---

## 📱 Mobile Features

For best mobile experience, use:
- Chrome DevTools mobile view (F12 → Toggle device toolbar)
- iPhone SE or iPhone 12 Pro viewport
- Mobile routes: `/mobile/*`

Mobile features:
- GPS tracking
- Photo progression
- Timer display
- Invoice generation on-the-go

---

## 🎉 New Features to Test

All these are newly built for GROUPE LAFRANCE APP:

1. ✅ Subscription tiers (`/plumber-register`)
2. ✅ BET marketplace (`/plumber-marketplace`)
3. ✅ Client request with AI (`/client-request`)
4. ✅ GPS geofencing (`/mobile/job/:jobId`)
5. ✅ Photo progression (`/mobile/job/:jobId`)
6. ✅ Auto invoice generation (`/mobile/job/:jobId`)
7. ✅ Rating system (`/portal/invoice/:invoiceId`)
8. ✅ Payment split (`/plumber/payments`)
9. ✅ Compliance tracking (`/plumber/payments` → Compliance tab)
10. ✅ After-sales service (`/portal/aftersales/:invoiceId`)
11. ✅ Credit card payment (`/portal/payment`)
12. ✅ Interac e-Transfer (`/portal/payment`)
13. ✅ Admin payment management (`/admin/payments`)

**Have fun testing! 🚀**
