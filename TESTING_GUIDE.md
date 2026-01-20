# Testing Guide - Complete BET Marketplace

## 🎯 Quick Demo for Pitch (5-7 minutes)

**Status:** ✅ FULL APP COMPLETE - All features integrated

---

## Prerequisites

1. **Start dev server:**
   ```bash
   cd /Users/justinleanca/GROUPE-LAFRANCE-APP
   npm run dev
   ```

2. **Open browser:** `http://localhost:5177/`

3. **First load:** App generates 50 plumbers, 100 clients, and 5 active jobs automatically

---

## 🎬 Complete Demo Flow

### Step 0: See Active Jobs Immediately (30 sec)

**Navigate to:** `/plumber-marketplace`  
**Login:** `technicien@plomberie.com` / `password`

✅ **5 active jobs** already in marketplace
✅ **Real countdown timers** ticking down
✅ **Distance displayed** on each card
✅ **Mix of urgent** (5min) and normal (2hr) jobs

**Pro Tip:** Jobs are auto-generated on first load!

---

### Step 1: Client Submits Request (2 min)

**Navigate to:** `/client-request`

1. **Urgency:** Choose "URGENT" or "Non-urgent"
2. **Description:** "Fuite d'eau sous l'évier"
3. **AI Reformulation:** Click button to enhance
4. **Photos:** Upload 1-3 images
5. **Address:** "1234 Rue Saint-Denis, Montréal"
6. **Card:** 4242 4242 4242 4242, 12/25, 123
7. **Submit** → Saved to localStorage

**Result:** Job created with status `pending_review`

---

### Step 2: Admin Approves (1 min)

**Navigate to:** `/admin/review-queue`  
**Login:** `gabriel@lafrance.com` / `password`

1. **See pending job** in queue
2. **Click job** to view details
3. **Optional:** Add admin note or chat
4. **Click "Approuver"**

**Result:**
- Job → status `in_bet`
- Countdown starts (5min or 2hr)
- Appears in plumber marketplace

---

### Step 3: Plumber Bids (1 min)

**Navigate to:** `/plumber-marketplace`  
**Login:** `technicien@plomberie.com` / `password`

1. **See job** with countdown timer (updates every second!)
2. **Distance shown:** "12.3 km"
3. **Last minute:** Timer turns red and pulses
4. **Click "Soumettre une offre"**
5. **Enter:** Amount: 200, Duration: 60
6. **Submit bid**

**Result:**
- Bid saved to localStorage
- Job shows "Offre soumise" badge
- Timer continues (job stays visible)
- **Winner auto-selected** when timer hits 0

---

### Step 4: Mobile Workflow (3 min)

**Navigate to:** `/mobile/job/JOB-xxxxx` (use job ID from winner notification)

**Tab 1: GPS Tracking**
1. **Route simulation** starts automatically
2. **Distance updates** every 5 seconds
3. **Watch distance decrease** (e.g., 4.2km → 3.8km → ...)
4. **Geofence:** When <100m, enter zone
5. **Dwell timer:** 3-minute countdown begins
6. **Auto-start:** Timer starts after 3 minutes! (Status: "En cours")

**Tab 2: Photos**
1. **45-minute reminders** (or manual trigger for demo)
2. **Upload photo**
3. **Add description**
4. **AI reformulation**
5. **Save photo** → Added to progression history

**Tab 3: Invoice**
1. **Click "Travail terminé"**
2. **Switch to Invoice tab**
3. **Add final photos** (minimum 2)
4. **Work description** (minimum 50 chars)
5. **AI reformulation**
6. **Review invoice** preview
7. **Click "Finaliser et envoyer"**

**Result:**
- Job → status `completed`
- Invoice saved with all photos
- Navigate to payments dashboard

---

### Step 5: Payment Processing (1 min)

**Navigate to:** `/portal/payment` (with invoice ID)

**Or simulate payment:**
```javascript
// In browser console
mockDataService.updateJob('JOB-xxx', { status: 'paid', paidAt: new Date() })
```

**Result:**
- Payment record created
- **75% immediate** payout to plumber
- **25% held** for 30 days
- Job status: `paid`

---

### Step 6: After-Sales (Optional, 1 min)

**Navigate to:** `/portal/aftersales/INV-xxxxx`

1. **Select priority:** Urgent, Important, or Aesthetic
2. **Add photos**
3. **Description**
4. **Submit claim**

**Result:**
- Claim saved to localStorage
- **25% payment frozen**
- Plumber notified
- Hold amount displayed

---

### Step 7: Plumber Registration (Optional, 2 min)

**Navigate to:** `/plumber-register`

1. **Select subscription:** Bronze, Silver, or Gold
2. **Business info:** Name, address, RBQ number
3. **Preferences:** Service types, radius, hours
4. **Account:** Email, password, phone
5. **Submit**

**Result:**
- Plumber profile saved to localStorage
- 6-month trial activated
- Compliance docs marked pending
- Navigate to marketplace

---

## 📊 Key Features to Highlight

### Real-Time Features
✅ **Countdown timers** update every second
✅ **Last minute:** Red, bold, pulsing animation
✅ **GPS updates** every 5 seconds (20 waypoints)
✅ **Distance calculation** with Haversine formula
✅ **Geofence detection** (100m radius)

### Business Logic
✅ **Auto-winner selection** (lowest bid when timer expires)
✅ **Geofence auto-start** (100m + 3min dwell)
✅ **Payment split** (75% immediate, 25% held)
✅ **Payment freeze** when claim submitted
✅ **State validation** (9 job states enforced)

### Data Persistence
✅ **localStorage** for all data
✅ **Refresh page** → data persists
✅ **50 plumbers** with Quebec names
✅ **100 clients** with Montreal addresses
✅ **5 active demo jobs** on first load

---

## 💡 Pro Tips for Pitch

### Multi-Window Setup

**Window 1 (Admin):** `/admin/review-queue`
- Show approval process
- Real-time job queue

**Window 2 (Plumber):** `/plumber-marketplace`
- Show countdown timers
- Distance filtering
- Bid submission

**Window 3 (Mobile):** `/mobile/job/xxx`
- DevTools → Mobile view (Ctrl+Shift+M)
- iPhone 12 Pro viewport
- GPS tracking simulation

**Window 4 (Client):** `/portal/aftersales/xxx`
- Show after-sales flow
- Payment hold

### Speed Up Demo

**Use urgent jobs** (5-min bidding instead of 2 hours)

**Manual timer trigger:**
```javascript
// In mobile workflow, simulate reaching geofence
mockDataService.updateJob('JOB-xxx', { 
  status: 'in_progress',
  startedAt: new Date()
})
```

**Check active jobs:**
```javascript
mockDataService.getJobsByStatus('in_bet')
```

---

## 🎨 Visual Highlights

1. **Countdown Animation**
   - Last minute: Red pulse effect
   - Color changes: Gray → Orange → Red
   - Format changes: 2h 15m → 5m 23s → 45s

2. **Distance Indicators**
   - Dynamic badges: "12.3 km"
   - Updates during GPS simulation
   - Color-coded by proximity

3. **Geofence Visualization**
   - Progress bar for 3-minute dwell
   - Green highlight when in zone
   - **Timer auto-starts** (BIG moment!)

4. **Status Badges**
   - Color-coded: Blue (en route), Green (working)
   - Animated pulse for urgent jobs
   - "Offre soumise" after bidding

5. **Sticky Timer**
   - Blue bar at bottom of mobile view
   - Large format: `00:12:34`
   - Always visible while working

---

## 🐛 Troubleshooting

### No jobs in marketplace?
```javascript
// Check if jobs exist
mockDataService.getJobsByStatus('in_bet')

// If empty, reload page to regenerate demo data
location.reload()
```

### Timer not auto-starting?
- Must be <100m for 3 full minutes
- Watch progress bar in GeofenceTracker
- Check dwell time counter

### GPS not moving?
- Route updates every 5 seconds
- 20 waypoints = ~100 seconds total
- Distance should decrease gradually

### Can't submit bid?
- Check timer hasn't expired
- Must be within 50km for urgent jobs
- Can't bid twice on same job

### Clear all data:
```javascript
localStorage.clear()
location.reload()
```

---

## 📱 Mobile Testing

**Chrome DevTools:**
- F12 → Device toolbar (Ctrl+Shift+M)
- Select "iPhone 12 Pro"
- Responsive design mode

**Routes:**
- `/mobile/job/:jobId` - Full workflow
- GPS, Photos, Invoice tabs

---

## ✅ Success Criteria

Your demo is successful if you show:

1. ✅ Active jobs in marketplace immediately
2. ✅ Real countdown timer (color changes)
3. ✅ Distance displayed on cards
4. ✅ Bid submission (job stays visible)
5. ✅ Auto-winner when timer expires
6. ✅ GPS route simulation
7. ✅ Geofence auto-starts timer
8. ✅ Photo reminders every 45min
9. ✅ Invoice with all photos
10. ✅ 75%/25% payment split

---

## 📞 Quick Reference

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `gabriel@lafrance.com` | `password` |
| Plumber | `technicien@plomberie.com` | `password` |
| Client | `client@example.com` | `password` |

### Key Routes

| Feature | Route |
|---------|-------|
| Admin Review | `/admin/review-queue` |
| BET Marketplace | `/plumber-marketplace` |
| Mobile Workflow | `/mobile/job/:jobId` |
| Client Request | `/client-request` |
| After-Sales | `/portal/aftersales/:invoiceId` |
| Plumber Register | `/plumber-register` |

### Demo Data Stats

- **50 plumbers** (Quebec names, Montreal coords)
- **100 clients** (Montreal addresses)
- **5 active jobs** (ready for bidding)
- **200 historical jobs** (for analytics)

---

## 🚀 What's 100% Working

✅ Client request with photos
✅ Admin approval workflow
✅ Real-time countdown timers
✅ Geolocation filtering (50km)
✅ Distance calculation
✅ Bid submission & tracking
✅ Auto-winner selection
✅ GPS route simulation
✅ Geofencing with auto-start
✅ Photo progression (45min)
✅ Auto-invoice generation
✅ Payment with 75%/25% split
✅ After-sales with payment freeze
✅ Plumber registration
✅ All data persists in localStorage

---

**Ready for your pitch! The full app is complete! 🎉**
