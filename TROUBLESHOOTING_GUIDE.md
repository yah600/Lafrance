# 🔧 TROUBLESHOOTING GUIDE
## Plomberie D'Experts - Quick Problem Resolution

---

## 📋 **HOW TO USE THIS GUIDE**

1. **Identify the problem** from the categories below
2. **Follow the step-by-step solution**
3. **Verify the fix** works
4. **Contact support** if problem persists

**💡 Pro Tip:** Most issues can be resolved by refreshing the page or clearing cache!

---

## 🚨 **CRITICAL ISSUES** (Immediate Action Required)

### **🔴 Issue: Cannot log in / "Invalid credentials" error**

**Symptoms:**
- Login fails with correct password
- "Invalid credentials" message appears
- Account locked message

**Solution:**
```
STEP 1: Verify credentials
- Check Caps Lock is OFF
- Verify email spelling
- Ensure no extra spaces

STEP 2: Try password reset
- Click "Mot de passe oublié?"
- Enter your email
- Follow reset link in email

STEP 3: Check account status
- Contact administrator
- Account may be locked after failed attempts
- Administrator can unlock

STEP 4: Browser issues
- Clear browser cache
- Try incognito/private mode
- Try different browser
```

**Prevention:**
- Save password in secure password manager
- Enable 2FA for added security
- Keep administrator contact handy

---

### **🔴 Issue: Page shows blank white screen**

**Symptoms:**
- White screen after login
- No content visible
- Spinning loader never stops

**Solution:**
```
STEP 1: Refresh the page
- Press Ctrl+R (Windows) or Cmd+R (Mac)
- Or click browser refresh button

STEP 2: Clear cache
Chrome:
- Press Ctrl+Shift+Delete
- Select "Cached images and files"
- Click "Clear data"

Firefox:
- Press Ctrl+Shift+Delete
- Check "Cache"
- Click "Clear Now"

Safari:
- Develop → Empty Caches
- Or Safari → Clear History

STEP 3: Check browser console
- Press F12 to open Developer Tools
- Click "Console" tab
- Look for red error messages
- Screenshot and send to IT support

STEP 4: Try different browser
- Chrome, Firefox, Safari, or Edge
- If works, problem is browser-specific
```

**When to escalate:** If issue persists after clearing cache and trying different browser

---

### **🔴 Issue: "Accès refusé" (Access Denied) message**

**Symptoms:**
- Cannot access certain pages
- "You don't have permission" message
- Redirect to error page

**Solution:**
```
STEP 1: Verify your role
- Check what role you're assigned
- Admin: Full access
- Dispatcher: No settings access
- Technician: Profile only

STEP 2: Confirm expected access
- Some features are role-restricted
- This is by design for security

STEP 3: Request access upgrade
- Contact your administrator
- Explain which feature you need
- Administrator can update your role

STEP 4: Check URL
- You may have wrong URL
- Go back to dashboard
- Navigate through menu instead
```

**Expected Behavior:**
- Dispatchers cannot access `/settings`
- Technicians cannot access admin features
- This is correct security behavior

---

## 🚀 **DISPATCH CENTER ISSUES**

### **⚠️ Issue: Auto-Dispatch button does nothing**

**Symptoms:**
- Click "Auto-dispatcher" button
- No jobs get assigned
- Toast says "Aucun travail en attente" or "Aucun technicien disponible"

**Solution:**
```
STEP 1: Verify pending jobs exist
- Check "En attente" column has jobs
- If empty, create test job first
- Jobs must be unassigned

STEP 2: Verify technicians available
- Check technician status
- At least one must be "Disponible"
- Change status if all are busy

STEP 3: Check job details
- Jobs must have required fields filled
- Service type selected
- Time/date set

STEP 4: Refresh page
- Sometimes state gets out of sync
- Refresh with Ctrl+R
- Try auto-dispatch again
```

**Expected Results:**
- Jobs move from "En attente" to "Assigné"
- Toast shows: "X travaux assignés automatiquement"
- Distributed among available technicians

---

### **⚠️ Issue: Kanban drag-and-drop not working**

**Symptoms:**
- Cannot drag job cards
- Cards snap back to original column
- Drop doesn't register

**Solution:**
```
STEP 1: Check browser compatibility
Supported browsers:
✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
❌ Internet Explorer (not supported)

STEP 2: Disable browser extensions
- Ad blockers can interfere
- Try in incognito/private mode
- Temporarily disable extensions

STEP 3: Check mouse/trackpad
- Try with different input device
- On touch device, use touch drag
- Ensure clean grab of card

STEP 4: Refresh page
- Reload the page
- Try dragging again
```

**Mobile Note:** Drag-and-drop works on touch devices - use touch and drag gestures.

---

### **⚠️ Issue: Cannot create new job**

**Symptoms:**
- "Créer un travail" button doesn't open modal
- Modal opens but submit fails
- Validation errors

**Solution:**
```
STEP 1: Check required fields
Required:
- Client (must select existing client)
- Service type
- Priority
- Scheduled date/time

STEP 2: Verify client exists
- If no clients in dropdown, create client first
- Go to Clients → Add new client
- Return to dispatch and try again

STEP 3: Check form validation
- Red borders indicate errors
- Fill all required fields
- Ensure valid date (not in past)

STEP 4: Browser console check
- Press F12 → Console
- Look for JavaScript errors
- Screenshot and report if found
```

---

## 🗺️ **GPS & MAP ISSUES**

### **⚠️ Issue: Map shows no technicians**

**Symptoms:**
- Map loads but is empty
- No technician markers visible
- All white/gray map

**Solution:**
```
STEP 1: Check technician status
- Only active techs show on map
- Go to Technicians page
- Verify some are not "Hors service"

STEP 2: Refresh map
- Click refresh button (🔄) on map
- Or reload page (Ctrl+R)
- Auto-update should be ON

STEP 3: Check layer settings
- Bottom left layer controls
- Ensure layers are toggled ON
- Try toggling OFF and ON again

STEP 4: Zoom level
- Zoom out to see wider area
- Markers may be outside view
- Click "Voir tout" if available
```

**Expected Behavior:**
- Only technicians with status ≠ "Hors service" show
- Off-duty techs intentionally hidden

---

### **⚠️ Issue: GPS markers not updating**

**Symptoms:**
- Markers show old positions
- "Last updated" timestamp is old
- Techs say they've moved but map doesn't reflect

**Solution:**
```
STEP 1: Check auto-refresh setting
- Bottom left: "Mise à jour auto"
- Toggle OFF then ON
- Should update every 30 seconds

STEP 2: Manual refresh
- Click refresh button (🔄)
- Check "Dernière mise à jour" timestamp
- Should show current time

STEP 3: Verify tech app running
- Technician must have app open
- GPS permissions must be enabled
- Check with technician directly

STEP 4: Network connection
- Check internet connection
- Try different network
- VPN can sometimes interfere
```

---

### **⚠️ Issue: Routes not showing on map**

**Symptoms:**
- No blue route lines visible
- Toggle seems to do nothing

**Solution:**
```
STEP 1: Enable routes layer
- Bottom left: "Routes optimisées"
- Toggle to ON (blue)
- Routes only show for en-route techs

STEP 2: Check for en-route technicians
- Routes only appear when:
  - Technician status = "En route"
  - Technician has active job
- Change a tech's status to test

STEP 3: Refresh map
- Click refresh button
- Routes recalculate

STEP 4: Zoom level
- Zoom in closer
- Routes may not render when zoomed out far
```

---

## 💰 **INVOICE ISSUES**

### **⚠️ Issue: PDF won't download**

**Symptoms:**
- Click download icon (📥)
- Nothing happens
- Or file downloads but is blank/corrupted

**Solution:**
```
STEP 1: Check popup blocker
Chrome:
- Click icon in address bar (right side)
- Allow popups from this site

Firefox:
- Click shield icon in address bar
- Disable popup blocking

Safari:
- Safari → Preferences → Websites
- Popup Windows → Allow

STEP 2: Try different download method
- Right-click download icon
- Select "Save Link As"
- Choose download location

STEP 3: Check download folder
- File may have downloaded
- Check Downloads folder
- Look for "Facture_INV-*.pdf"

STEP 4: Try different browser
- Test in Chrome if using Firefox
- Browser PDF generation varies
- Report which browsers fail
```

**Expected Filename:** `Facture_INV-2024-XXX.pdf`

---

### **⚠️ Issue: Invoice total calculating incorrectly**

**Symptoms:**
- Numbers don't add up
- Tax calculation wrong
- Total seems off

**Solution:**
```
STEP 1: Verify line item amounts
- Check each line item
- Ensure numbers are correct
- No extra characters (like $)

STEP 2: Check tax rates
Expected (Quebec):
- TPS: 5%
- TVQ: 9.975%
- Total tax: ~14.975%

STEP 3: Manual calculation
Subtotal: Sum of all line items
TPS: Subtotal × 0.05
TVQ: Subtotal × 0.09975
Total: Subtotal + TPS + TVQ

STEP 4: Refresh and recreate
- If still wrong, delete invoice
- Create new invoice
- Report bug if persists
```

---

### **⚠️ Issue: Cannot send invoice email**

**Symptoms:**
- Click send icon (📧)
- Error message or no confirmation
- Client says they didn't receive email

**Solution:**
```
STEP 1: Verify client email
- Go to client detail
- Check email address is correct
- Update if needed

STEP 2: Check spam folder
- Ask client to check spam/junk
- Add sender to contacts
- Mark as "Not Spam"

STEP 3: Wait and retry
- Email may be delayed
- Wait 5-10 minutes
- Try sending again

STEP 4: Email service check
- Contact IT/Admin
- Email service may need configuration
- Backend integration required
```

**Note:** Email functionality may require backend API integration.

---

## 👥 **CLIENT & TECHNICIAN ISSUES**

### **⚠️ Issue: Chat messages not sending**

**Symptoms:**
- Type message and click send
- Message doesn't appear
- Or appears but no response

**Solution:**
```
STEP 1: Check internet connection
- Verify you're online
- Try loading another page
- Reconnect to network if needed

STEP 2: Refresh chat modal
- Close chat modal (X button)
- Reopen chat
- Try sending again

STEP 3: Check recipient status
- Recipient must be active user
- If offline, they won't respond
- Simulated responses take 2 seconds

STEP 4: Verify chat integration
- Chat uses mock responses currently
- Real-time requires backend
- Check with admin if should be live
```

**Expected Behavior (Current):**
- Your messages appear immediately
- Simulated response after 2 seconds
- Real backend needed for true real-time

---

### **⚠️ Issue: Property Passport creation fails**

**Symptoms:**
- Fill form but submit doesn't work
- Validation errors
- Modal doesn't close

**Solution:**
```
STEP 1: Check required fields
Required:
✅ Property address
✅ Client name
✅ Phone number
✅ Email address
✅ Property type
✅ Year built

STEP 2: Verify email format
- Must be valid email (user@domain.com)
- No spaces
- Check for typos

STEP 3: Verify phone format
- Quebec format: 514-XXX-XXXX
- Or: (514) XXX-XXXX
- Or: 5145551234

STEP 4: Check year built
- Must be 4-digit year
- Between 1800 and current year
- Numeric only
```

---

### **⚠️ Issue: Maintenance contract detail won't open**

**Symptoms:**
- Click "Voir détails" button
- Modal doesn't open
- Page crashes

**Solution:**
```
STEP 1: Refresh page
- This bug was FIXED in v0.7.0
- If still occurs, clear cache
- Hard refresh: Ctrl+Shift+R

STEP 2: Check contract status
- Contract must be active
- If expired/cancelled, may not open
- Verify contract ID exists

STEP 3: Try different contract
- Test with another contract
- If one fails but others work
- That contract may have data issue

STEP 4: Contact support
- If bug reappears after fix
- Provide contract ID
- Screenshot error (if any)
```

**This was Bug #2 - Should be fixed in current version!**

---

## 📊 **ANALYTICS ISSUES**

### **⚠️ Issue: Service breakdown cards not showing**

**Symptoms:**
- Analytics page loads
- Service category cards missing
- Only see top charts

**Solution:**
```
STEP 1: Scroll down
- Service cards are at bottom of page
- Scroll to "Analyse détaillée par service"
- Should see 8 service cards

STEP 2: Refresh page
- This feature added in v0.7.0
- Clear cache if not visible
- Hard refresh: Ctrl+Shift+R

STEP 3: Check browser zoom
- Reset zoom to 100%
- Zoom out may hide cards off-screen
- Ctrl+0 to reset zoom

STEP 4: Responsive layout
Mobile:
- Cards stack vertically (1 column)
Tablet:
- 2 columns
Desktop:
- 4 columns
```

**This was Bug #14 - Should be fixed in current version!**

---

### **⚠️ Issue: Charts not rendering**

**Symptoms:**
- Empty chart boxes
- No data visible
- Broken chart graphics

**Solution:**
```
STEP 1: Check date range
- Ensure date range has data
- Try "Ce mois" (This Month)
- Widen date range if narrow

STEP 2: Verify data exists
- Charts require job/revenue data
- If new installation, create test data
- Add jobs and invoices first

STEP 3: Browser compatibility
- recharts requires modern browser
- Update browser to latest version
- IE 11 not supported

STEP 4: Clear cache and reload
- Charts may fail to load if cache corrupt
- Ctrl+Shift+R for hard refresh
- Try in incognito mode
```

---

## 🔧 **TECHNICAL / SYSTEM ISSUES**

### **⚠️ Issue: Slow page loading**

**Symptoms:**
- Pages take > 5 seconds to load
- Spinning loader for extended time
- Lag when clicking

**Solution:**
```
STEP 1: Check internet speed
- Run speed test (fast.com)
- Minimum 5 Mbps recommended
- Switch to faster network if slow

STEP 2: Close other tabs/programs
- Too many tabs use memory
- Close unused tabs
- Close heavy applications

STEP 3: Clear browser cache
- Old cache can slow performance
- Ctrl+Shift+Delete
- Clear all time

STEP 4: Check browser extensions
- Disable ad blockers temporarily
- Disable unnecessary extensions
- Test in incognito (no extensions)

STEP 5: System resources
- Check CPU/RAM usage
- Restart computer if high
- Close background apps
```

**Performance Targets:**
- Dashboard: < 2 seconds
- Dispatch: < 3 seconds
- Map: < 3 seconds

---

### **⚠️ Issue: Session keeps expiring**

**Symptoms:**
- Logged out frequently
- "Session expirée" message
- Must log in multiple times per day

**Solution:**
```
STEP 1: Check "Remember Me"
- Enable "Remember Me" on login
- Keeps you logged in longer
- Session should last 7 days

STEP 2: Browser cookies
- Ensure cookies enabled
- Don't clear cookies daily
- Check browser privacy settings

STEP 3: Company security policy
- Session timeout may be configured
- Contact IT/Admin
- May be set to 1 hour for security

STEP 4: Multiple devices
- Logging in on another device logs out this one
- This is security feature
- Use one device at a time
```

---

### **⚠️ Issue: Mobile app doesn't work on phone**

**Symptoms:**
- Mobile interface broken
- Buttons too small
- Layout overflow

**Solution:**
```
STEP 1: Use correct URL
Technicians should use:
✅ /mobile/login (mobile interface)
❌ /login (desktop interface)

STEP 2: Check phone orientation
- Some features better in portrait
- Rotate phone for better layout
- Landscape works but varies

STEP 3: Browser compatibility
iOS:
✅ Safari (recommended)
✅ Chrome

Android:
✅ Chrome (recommended)
✅ Firefox

STEP 4: Zoom level
- Reset browser zoom
- Pinch to zoom out if needed
- Don't zoom text size in settings
```

---

## 🆘 **ESCALATION PROCEDURES**

### **When to Contact Support**

**IMMEDIATE (Critical):**
- Cannot log in at all
- Platform completely down
- Data loss suspected
- Security breach

**URGENT (Same Day):**
- Key revenue feature broken (invoicing)
- Multiple users affected
- Major workflow disrupted

**NORMAL (1-2 Days):**
- Minor feature issue
- Single user affected
- Cosmetic problem
- Enhancement request

### **How to Report Issues**

**Include this information:**

```
1. WHAT happened:
   - Describe the problem
   - What you were trying to do
   - What went wrong

2. WHEN it happened:
   - Date and time
   - First occurrence
   - How often it happens

3. WHERE it happened:
   - Which page/URL
   - Which feature
   - Browser and device

4. STEPS to reproduce:
   - Step 1: ...
   - Step 2: ...
   - Step 3: ...

5. SCREENSHOTS:
   - Attach screenshots
   - Include error messages
   - Show console errors (F12)

6. IMPACT:
   - How many users affected
   - Workaround available?
   - Business impact
```

### **Contact Information**

| Issue Type | Contact | Response Time |
|------------|---------|---------------|
| **Critical** | [emergency-phone] | Immediate |
| **Technical** | support@plomberiedexperts.com | 4 hours |
| **Training** | training@plomberiedexperts.com | 1 day |
| **Feature** | pm@plomberiedexperts.com | 2 days |

---

## ✅ **PREVENTION TIPS**

### **Daily Best Practices:**
1. ✅ Keep browser updated
2. ✅ Clear cache weekly
3. ✅ Log out properly (don't just close browser)
4. ✅ Save work frequently
5. ✅ Report issues immediately

### **Weekly Maintenance:**
1. ✅ Check for platform updates
2. ✅ Review error logs (admin)
3. ✅ Backup important data
4. ✅ Test critical workflows

### **Monthly Checkup:**
1. ✅ Update browser
2. ✅ Review user permissions
3. ✅ Archive old data
4. ✅ Performance audit

---

## 📊 **ISSUE QUICK REFERENCE**

| Symptom | Likely Cause | Quick Fix |
|---------|-------------|-----------|
| Blank page | Cache | Clear cache + refresh |
| Can't login | Wrong password | Password reset |
| Access denied | Wrong role | Check permissions |
| PDF won't download | Popup blocker | Allow popups |
| Map empty | Techs off-duty | Check tech status |
| Chat not working | Internet | Check connection |
| Slow loading | Many tabs | Close tabs, clear cache |
| Auto-dispatch fails | No jobs/techs | Add jobs or set techs available |

---

## 🎯 **COMMON ERROR MESSAGES**

| Error | Meaning | Solution |
|-------|---------|----------|
| "Accès refusé" | No permission | Contact admin for access |
| "Session expirée" | Logged out | Log in again |
| "Erreur de connexion" | Network issue | Check internet |
| "Données non trouvées" | Item deleted | Go back, refresh |
| "Échec de validation" | Form error | Fill required fields |
| "Limite dépassée" | Rate limit | Wait 1 minute, try again |

---

## 📞 **STILL NEED HELP?**

**This guide didn't solve your problem?**

1. **Check FAQ:** See FAQ.md for common questions
2. **Search Documentation:** DOCUMENTATION_INDEX.md
3. **Contact Support:** Use contact info above
4. **Emergency:** Call [emergency number]

**We're here to help!** 🚀

---

**Last Updated:** December 17, 2024  
**Version:** v0.7.0  
**All 15 bugs fixed - most issues should not occur!**
