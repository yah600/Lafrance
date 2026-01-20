# Testing Guide - BET Marketplace Implementation

## 🎯 Quick Demo for Pitch (5 minutes)

This guide shows how to demonstrate the complete BET bidding workflow from client request to job completion.

---

## Prerequisites

1. **Start dev server:**
   ```bash
   cd /Users/justinleanca/GROUPE-LAFRANCE-APP
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:5177/
   ```

3. **Clear data (optional for fresh start):**
   - Open browser console (F12)
   - Run: `localStorage.clear()`
   - Refresh page

---

## 🎬 Demo Flow: Complete Job Lifecycle

### Step 1: Client Submits Request (2 min)

**Navigate to:** `/client-request`

1. **Select urgency:** Choose "URGENT" (5-minute bidding)
2. **Add description:** "J'ai une fuite d'eau sous mon évier"
3. **Click "Reformuler avec l'IA"** to see AI enhancement
4. **Upload 1-3 photos** (any images)
5. **Enter address:** "1234 Rue Saint-Denis, Montréal"
6. **Card:** 4242 4242 4242 4242, Expiry: 12/25, CVC: 123
7. **Submit** → Job saved with status `pending_review`

### Step 2: Admin Approves (1 min)

**Navigate to:** `/admin/review-queue`  
**Login:** gabriel@lafrance.com / password

1. **View pending job** in queue
2. **Click on job** to review details
3. **Click "Approver"**
4. **Result:** Job → `in_bet`, countdown starts

### Step 3: Plumber Bids (1 min)

**Navigate to:** `/plumber-marketplace`  
**Login:** technicien@plomberie.com / password

1. **See job with real countdown timer**
2. **Distance shown:** "12.3 km"
3. **Click "Soumettre une offre"**
4. **Enter amount:** 200, Duration: 60
5. **Submit** → "Offre soumise" badge appears
6. **Wait for timer to expire** → Winner auto-selected

### Step 4: Mobile Workflow (3 min)

**Navigate to:** `/mobile/job/JOB-xxxxx`

1. **GPS Tab:** Watch route simulation (5s updates)
2. **Distance decreases** as plumber "travels"
3. **Geofence:** When <100m, 3-min countdown starts
4. **Auto-timer:** Starts automatically after 3 minutes
5. **Photos Tab:** 45-minute interval reminders
6. **Click "Travail terminé"**
7. **Invoice Tab:** Generate invoice with photos
8. **Complete** → Job marked `completed`

---

## 📊 Key Features to Highlight

✅ **Real-time countdown** (updates every second, color changes)  
✅ **Geolocation filtering** (50km for urgent)  
✅ **Distance display** on cards  
✅ **Auto-winner selection** (lowest bid)  
✅ **GPS route simulation** (20 waypoints, curved path)  
✅ **Geofencing** (100m + 3min = auto-start)  
✅ **Photo progression** (every 45 minutes)  
✅ **Auto-invoice generation**  
✅ **localStorage persistence** (refresh = data persists)

---

## 💡 Pro Tips

### Open 4 Browser Windows:
1. Client View: `/client-request`
2. Admin View: `/admin/review-queue`
3. Plumber View: `/plumber-marketplace`
4. Mobile View: `/mobile/job/xxx` (DevTools mobile mode)

### Speed Up Demo:
- Use URGENT jobs (5-min bidding vs 2 hours)
- Browser console: `mockDataService.getJobsByStatus('in_bet')`

---

## 🐛 Troubleshooting

**No jobs in marketplace?**
- Check admin approved the job
- Verify status is `in_bet`

**Timer not auto-starting?**
- Must be <100m for 3 full minutes
- Watch progress bar

**GPS not moving?**
- Check status is `en-route`
- Updates every 5 seconds

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | gabriel@lafrance.com | password |
| Plumber | technicien@plomberie.com | password |
| Client | client@example.com | password |

---

**Ready for your pitch! 🚀**
