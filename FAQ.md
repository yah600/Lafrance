# ❓ FREQUENTLY ASKED QUESTIONS (FAQ)
## Plomberie D'Experts - Platform Guide

---

## 📋 **TABLE OF CONTENTS**

1. [General Questions](#general-questions)
2. [Login & Access](#login--access)
3. [Dispatch & Jobs](#dispatch--jobs)
4. [GPS & Tracking](#gps--tracking)
5. [Invoicing & Payments](#invoicing--payments)
6. [Client Management](#client-management)
7. [Technician Features](#technician-features)
8. [Analytics & Reports](#analytics--reports)
9. [Technical Issues](#technical-issues)
10. [Mobile App](#mobile-app)

---

## 🌟 **GENERAL QUESTIONS**

### **Q: What is the Plomberie D'Experts platform?**
**A:** It's a comprehensive enterprise dispatch platform designed specifically for plumbing companies. It handles job dispatching, technician management, client CRM, real-time GPS tracking, invoicing, quotes, property passports, and analytics.

### **Q: Who can use this platform?**
**A:** The platform is designed for:
- **Admins/Owners** - Full access to all features
- **Dispatchers** - Operational features (no settings access)
- **Technicians** - Mobile app and profile access
- **Clients** - Portal for viewing their information

### **Q: Is the platform available in English?**
**A:** The platform is currently in French (Canadian), optimized for Quebec-based plumbing companies. English localization can be added as a future enhancement.

### **Q: Does it work on mobile devices?**
**A:** Yes! The platform is fully responsive and includes:
- Mobile-optimized web interface for dispatchers/admins
- Dedicated mobile app interface for technicians
- Customer portal accessible on mobile

### **Q: Do I need internet connection?**
**A:** Yes, internet connection is required for:
- Real-time GPS tracking
- Job updates and synchronization
- Chat functionality
- Invoice generation
However, offline functionality can be added in future versions.

---

## 🔐 **LOGIN & ACCESS**

### **Q: How do I log in for the first time?**
**A:** 
1. Navigate to the login page
2. Enter your email and password provided by your administrator
3. Click "Connexion"
4. You may be prompted to set up 2FA (two-factor authentication)

**Demo Credentials:**
- Admin: `admin@plomberiedexperts.com` / `admin123`
- Dispatcher: `dispatcher@plomberiedexperts.com` / `dispatch123`
- Technician: `technician@plomberiedexperts.com` / `tech123`

### **Q: I forgot my password. How do I reset it?**
**A:**
1. Click "Mot de passe oublié?" on the login page
2. Enter your email address
3. Check your email for reset instructions
4. Follow the link and create a new password

### **Q: What if I'm locked out of my account?**
**A:** Contact your system administrator or IT support. For security reasons, accounts may lock after multiple failed login attempts.

### **Q: Why can't I access certain features?**
**A:** Access is role-based:
- **Admin** - Full access (all features + settings)
- **Dispatcher** - Operational features (no settings)
- **Technician** - Profile and mobile app only
If you need additional access, contact your administrator.

### **Q: How do I enable two-factor authentication (2FA)?**
**A:** 
1. Go to Settings (admin only) or Profile
2. Navigate to Security section
3. Enable 2FA
4. Scan the QR code with your authenticator app
5. Enter the verification code

---

## 🚀 **DISPATCH & JOBS**

### **Q: How do I create a new job?**
**A:**
1. Go to Dispatch Center (`/dispatch`)
2. Click "Créer un travail" button
3. Fill in job details (client, service type, priority, etc.)
4. Assign to a technician or leave unassigned
5. Click "Créer le travail"

**Quick Method from Client Page:**
1. Go to client detail page
2. Click "Planifier un travail"
3. Client info is pre-filled automatically

### **Q: What is Auto-Dispatch and how does it work?**
**A:** Auto-Dispatch is an intelligent job assignment algorithm that:
- Automatically assigns pending jobs to available technicians
- Uses round-robin distribution for fairness
- Considers technician availability status
- Saves 2-3 hours of manual assignment daily

**How to use:**
1. Go to Dispatch Center
2. Click "Auto-dispatcher" button
3. System assigns all pending jobs automatically
4. Toast notification shows how many jobs were assigned

### **Q: How do I change a job's priority?**
**A:**
1. Open the job detail
2. Click on the priority indicator
3. Select new priority (Low/Medium/High/Urgent)
4. Changes save automatically

### **Q: Can I reassign a job to a different technician?**
**A:** Yes! Two methods:
1. **Kanban Board:** Drag the job card to reassign
2. **Job Detail:** Open job → Edit → Select new technician

### **Q: How do I track job progress?**
**A:** Jobs move through stages:
- **En attente** (Pending) - Not yet assigned
- **Assigné** (Assigned) - Technician assigned
- **En route** (En Route) - Technician traveling
- **En cours** (In Progress) - Work in progress
- **Complété** (Completed) - Job finished

Use the Kanban board to visualize all jobs at once.

### **Q: What happens when a job is marked complete?**
**A:**
- Job moves to "Completed" status
- Technician can add completion notes
- Time tracking stops
- Ready for invoicing
- Appears in job history

---

## 🗺️ **GPS & TRACKING**

### **Q: How does GPS tracking work?**
**A:** The platform shows real-time positions of all technicians on a map:
- Green markers = Available
- Orange markers = Busy
- Blue markers = En route
- Animated pulse = Active technicians

### **Q: How often does GPS update?**
**A:** GPS positions update automatically every 30 seconds when "Mise à jour auto" is enabled. You can also manually refresh anytime.

### **Q: Can I see a technician's route?**
**A:** Yes! 
1. Go to Map View (`/map`)
2. Enable "Routes optimisées" toggle
3. Routes appear as blue lines with directional arrows
4. Shows path from current location to destination

### **Q: How do I see ETA for en-route technicians?**
**A:**
1. Click on a technician marker with "En route" status
2. The detail popup shows estimated arrival time
3. ETA calculated based on distance and average speed

### **Q: What are service zones on the map?**
**A:** Service zones are colored regions showing your coverage areas:
- **Zone Nord** (Blue) - Northern coverage
- **Zone Sud** (Green) - Southern coverage  
- **Zone Est** (Yellow) - Eastern coverage
- **Zone Ouest** (Purple) - Western coverage
Toggle them on/off with the "Zones de service" switch.

### **Q: Can I call a technician directly from the map?**
**A:** Yes!
1. Click on technician marker
2. In the detail popup, click "Appeler"
3. Your phone app opens with their number ready to dial

### **Q: How do I assign a job from the map?**
**A:**
1. Click on an available technician
2. Click "Assigner" button in popup
3. Select job from dropdown
4. Confirm assignment

---

## 💰 **INVOICING & PAYMENTS**

### **Q: How do I create an invoice?**
**A:** Two methods:

**Method 1 - From Invoices Page:**
1. Go to Invoices (`/invoices`)
2. Click "Nouvelle facture"
3. Fill in client and line items
4. System calculates totals automatically

**Method 2 - From Client Page (Faster!):**
1. Go to client detail page
2. Click "Générer une facture"
3. Client info pre-filled
4. Add services and amounts

### **Q: How do I download an invoice as PDF?**
**A:**
1. Go to invoice list (`/invoices`)
2. Find the invoice row
3. Click the 📥 download icon
4. PDF downloads automatically
5. Filename: `Facture_INV-2024-XXX.pdf`

### **Q: Can I email invoices to clients?**
**A:** Yes!
1. Click the 📧 send icon on invoice row
2. Toast confirms: "Facture envoyée par courriel"
3. Invoice sent to client's email on file

### **Q: What's included in the PDF invoice?**
**A:** The PDF contains:
- Company name "Plomberie D'Experts"
- Invoice number (INV-2024-XXX)
- Date issued and due date
- Client name and address
- Line items with descriptions and amounts
- Subtotal, taxes (TPS/TVQ), and total
- Payment status

### **Q: How do I track payment status?**
**A:** Invoice statuses:
- **Brouillon** (Draft) - Not yet sent
- **Envoyé** (Sent) - Sent to client
- **Payé** (Paid) - Payment received
- **En retard** (Overdue) - Past due date

Filter invoices by status to track unpaid ones.

### **Q: Can I edit an invoice after creating it?**
**A:** Yes, as long as it's in "Draft" status. Once sent or paid, create a credit note for adjustments.

---

## 👥 **CLIENT MANAGEMENT**

### **Q: How do I add a new client?**
**A:**
1. Go to Clients page (`/clients`)
2. Click "Nouveau client"
3. Fill in client information (name, address, phone, email)
4. Click "Créer le client"

### **Q: What is a Property Passport?**
**A:** A Property Passport is a comprehensive record of a property's plumbing system:
- Equipment inventory (water heater, sump pump, etc.)
- Installation dates and warranties
- Service history
- Inspection notes
- Photos and diagrams
- Maintenance schedule

**Benefits:**
- Proactive maintenance recommendations
- Faster diagnostics
- Better customer service
- Upsell opportunities

### **Q: How do I create a Property Passport?**
**A:**
1. Go to Property Passports (`/property-passports`)
2. Click "Nouveau passeport"
3. Fill in property details:
   - Address
   - Property type (Résidentiel/Commercial/Industriel)
   - Year built
   - Client information
4. Click "Créer le passeport"
5. Add equipment and service history on detail page

### **Q: What are Maintenance Contracts?**
**A:** Recurring service agreements with 4 tiers:
- **Bronze** - $299/year - 1 visit, 10% discount
- **Silver** - $599/year - 2 visits, 15% discount
- **Gold** - $999/year - 4 visits, 20% discount, priority
- **Platinum** - $1,499/year - 6 visits, 25% discount, 24/7 priority

### **Q: How do I enroll a client in a maintenance contract?**
**A:**
1. Go to Maintenance Contracts (`/maintenance-contracts`)
2. Click "Nouveau contrat"
3. Select client
4. Choose tier (Bronze/Silver/Gold/Platinum)
5. Set start date
6. Click "Créer le contrat"

### **Q: Can I see a client's full service history?**
**A:** Yes!
1. Go to client detail page
2. Scroll to "Historique des travaux" section
3. View all past jobs, invoices, and visits

---

## 🔧 **TECHNICIAN FEATURES**

### **Q: How do technicians access their jobs?**
**A:** Technicians use the mobile app interface (`/mobile/*`):
1. Log in with technician credentials
2. View assigned jobs for the day
3. Accept/decline jobs
4. Update job status
5. Complete service forms
6. Track time

### **Q: How do I chat with a technician?**
**A:**
1. Go to technician detail page (`/technicians/:id`)
2. Click "Message" button
3. ChatModal opens
4. Type message and click "Envoyer"
5. Technician receives notification

### **Q: Can technicians update their availability?**
**A:** Yes! Technicians can change their status:
- **Disponible** (Available) - Ready for jobs
- **Occupé** (Busy) - Currently working
- **En route** - Traveling to job
- **Hors service** (Off Duty) - Not available

### **Q: How do I view a technician's performance?**
**A:**
1. Go to technician detail page
2. View metrics:
   - Completion rate
   - Jobs completed today/this week
   - Average rating
   - Response time
3. Check performance charts

### **Q: Can I see what job a technician is currently on?**
**A:** Yes!
1. Go to Map View
2. Click on technician marker
3. Popup shows current active job (if any)
4. See job details and customer info

---

## 📊 **ANALYTICS & REPORTS**

### **Q: What analytics are available?**
**A:** The analytics dashboard shows:
- Revenue metrics (today, week, month, year)
- Job completion statistics
- Technician performance comparison
- Service distribution (pie chart)
- Revenue trends (line chart)
- Service category breakdowns (8 categories)

### **Q: What are the 8 service categories tracked?**
**A:**
1. **Débouchage de drains** - Drain unclogging
2. **Installation chauffe-eau** - Water heater installation
3. **Réparation robinetterie** - Faucet repair
4. **Interventions urgentes** - Emergency interventions
5. **Installation clapet anti-retour** - Backflow preventer installation
6. **Inspection caméra** - Camera inspection
7. **Installation pompe de puisard** - Sump pump installation
8. **Réparation fuite d'eau** - Water leak repair

Each shows: revenue, job count, avg value, duration, completion rate, trends.

### **Q: How do I export analytics reports?**
**A:**
1. Go to Analytics page (`/analytics`)
2. Click "Exporter" button at top
3. Toast confirms export
4. Report downloads as PDF or CSV (based on configuration)

### **Q: Can I see revenue by time period?**
**A:** Yes! Use the date range selector at the top:
- Aujourd'hui (Today)
- Cette semaine (This Week)
- Ce mois (This Month)
- Cette année (This Year)
- Personnalisé (Custom range)

### **Q: How do I identify trending services?**
**A:** Look at the trend indicators on service category cards:
- 🔺 Green arrow = Growing demand
- 🔻 Red arrow = Declining demand
- Percentage shows increase/decrease

---

## 🔧 **TECHNICAL ISSUES**

### **Q: The page won't load. What should I do?**
**A:**
1. Check your internet connection
2. Refresh the page (Ctrl+R or Cmd+R)
3. Clear browser cache
4. Try a different browser
5. Contact IT support if issue persists

### **Q: I see an error message. What does it mean?**
**A:** Common errors:
- **"Accès refusé"** - You don't have permission for this feature
- **"Session expirée"** - Log in again
- **"Erreur de connexion"** - Check internet connection
- **"Données non trouvées"** - Item may have been deleted

### **Q: The map isn't showing technicians. Why?**
**A:** Possible causes:
1. Technicians are "Hors service" (off-duty)
2. GPS permissions not enabled
3. Map needs refresh (click refresh button)
4. Check "Mise à jour auto" is enabled

### **Q: PDF download isn't working. How do I fix it?**
**A:**
1. Check browser popup blocker settings
2. Allow downloads from the site
3. Try right-click → "Save As"
4. Use a different browser if issue persists

### **Q: Drag-and-drop on Kanban isn't working.**
**A:**
1. Make sure you're using a supported browser (Chrome, Firefox, Safari, Edge)
2. Try refreshing the page
3. Check that you have permission to modify jobs
4. Contact IT support if issue persists

### **Q: Chat messages aren't sending.**
**A:**
1. Check internet connection
2. Refresh the page
3. Verify recipient is still active
4. Try closing and reopening chat modal

---

## 📱 **MOBILE APP**

### **Q: How do technicians access the mobile app?**
**A:** Navigate to `/mobile/login` on their mobile device and log in with technician credentials.

### **Q: Does the mobile app work offline?**
**A:** Currently, internet connection is required. Offline mode can be added in future versions.

### **Q: Can I use the mobile app on tablet?**
**A:** Yes! The mobile interface is responsive and works on tablets, phones, and smaller screens.

### **Q: How do technicians update job status from mobile?**
**A:**
1. Open assigned job
2. Click status button
3. Select new status (En route, En cours, Complété)
4. Add notes if needed
5. Save

### **Q: Can technicians see GPS directions to jobs?**
**A:** Yes! The job detail shows the address with a map button that opens navigation in their preferred map app (Google Maps, Apple Maps, etc.).

---

## 🆘 **GETTING HELP**

### **Q: Who do I contact for support?**
**A:**
- **Technical Issues:** support@plomberiedexperts.com
- **Feature Questions:** training@plomberiedexperts.com
- **Billing/Account:** admin@plomberiedexperts.com
- **Emergency:** [emergency phone number]

### **Q: Is training available?**
**A:** Yes! Contact your administrator to schedule:
- Admin/Dispatcher training
- Technician mobile app training
- One-on-one support sessions
- Video tutorials (if available)

### **Q: Where can I find more documentation?**
**A:** See the Documentation Index:
- User guides
- Technical documentation
- Testing guides
- Quick reference cards
All available in the `/docs` folder.

### **Q: Can I request new features?**
**A:** Yes! Submit feature requests to your project manager or development team. Common requests are tracked for future versions.

### **Q: Is there a user manual?**
**A:** Yes, this FAQ along with role-specific training guides (Admin Guide, Dispatcher Guide, Technician Guide) serve as the user manual.

---

## 🎯 **BEST PRACTICES**

### **Q: What's the most efficient dispatch workflow?**
**A:**
1. Start day: Review dashboard for overview
2. Use Auto-Dispatch for pending jobs (saves 2-3 hours!)
3. Monitor GPS map for real-time visibility
4. Handle urgent jobs manually with drag-and-drop priority
5. Use chat for quick tech communication
6. Generate invoices immediately after job completion

### **Q: How often should I check GPS tracking?**
**A:** Enable "Mise à jour auto" for continuous monitoring. Actively check during:
- Peak hours
- Urgent job assignments
- Customer ETA inquiries

### **Q: When should I use Property Passports?**
**A:** Create them for:
- High-value clients
- Properties with complex systems
- Maintenance contract customers
- Repeat service calls
**Benefit:** Faster diagnostics, better service, upsell opportunities

### **Q: What's the best way to manage maintenance contracts?**
**A:**
1. Enroll clients after positive service experience
2. Set reminders for scheduled visits
3. Track visit completion progress
4. Upsell higher tiers based on property needs
5. Review monthly for renewal opportunities

---

## 📈 **TIPS FOR SUCCESS**

### **For Dispatchers:**
- ✅ Use Auto-Dispatch daily to save time
- ✅ Keep GPS map open for visibility
- ✅ Chat with techs for quick updates
- ✅ Generate invoices same-day for faster payment

### **For Admins:**
- ✅ Review analytics weekly
- ✅ Track service trends for inventory planning
- ✅ Monitor tech performance for coaching
- ✅ Promote maintenance contracts for recurring revenue

### **For Technicians:**
- ✅ Update status regularly
- ✅ Complete service forms immediately
- ✅ Respond to dispatcher chats promptly
- ✅ Document work with photos (if available)

---

## 🔄 **FREQUENTLY UPDATED**

This FAQ is regularly updated based on user questions and platform updates. 

**Last Updated:** December 17, 2024  
**Version:** v0.7.0

**Have a question not answered here?** Contact support@plomberiedexperts.com

---

## 📞 **QUICK CONTACT**

| Need | Contact |
|------|---------|
| Login Issues | IT Support |
| Training | training@plomberiedexperts.com |
| Bug Report | support@plomberiedexperts.com |
| Feature Request | Project Manager |
| Emergency | [emergency number] |

---

**🎉 We're here to help you succeed!** 🎉
