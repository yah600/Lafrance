# 🚀 QUICK START GUIDE
## Plomberie D'Experts - Platform Usage Guide
### December 17, 2024

---

## 📋 **TABLE OF CONTENTS**

1. [Login & Navigation](#login--navigation)
2. [Maintenance Contracts](#maintenance-contracts)
3. [Property Passports](#property-passports)
4. [Review Management](#review-management)
5. [Price Estimator](#price-estimator)
6. [Service Forms & Reports](#service-forms--reports)
7. [Mobile Technician App](#mobile-technician-app)

---

## 🔐 **LOGIN & NAVIGATION**

### **Desktop Login**
1. Navigate to `/login`
2. Enter credentials:
   - **Admin:** admin@plomberiedexperts.com
   - **Dispatcher:** dispatcher@plomberiedexperts.com
3. Dashboard opens based on role

### **Mobile Login (Technicians)**
1. Navigate to `/mobile/login`
2. Enter technician credentials
3. Mobile-optimized interface loads

### **Navigation Menu**
- **Dashboard** - Overview and quick actions
- **Dispatch** - Job scheduling and assignment
- **Soumissions** - Quote management
- **Contrats entretien** - Maintenance contracts ✨ NEW
- **Avis clients** - Review management ✨ NEW
- **Passeports** - Property tracking ✨ NEW
- **Techniciens** - Technician management
- **Clients** - Client database
- **Carte GPS** - Real-time tracking
- **Factures** - Invoicing
- **Rapports** - Analytics

---

## 🛡️ **MAINTENANCE CONTRACTS**

### **Accessing the Feature**
**Route:** `/maintenance-contracts`  
**Access:** Admin & Dispatcher only

### **Dashboard Overview**

#### **Statistics Cards**
- **Total Contracts** - Number of active contracts
- **Monthly Revenue** - Recurring revenue from contracts
- **Expiring Soon** - Contracts needing renewal attention
- **Active Visits** - Scheduled maintenance visits

#### **Contract Tiers**

| Tier | Price | Discount | Visits | Best For |
|------|-------|----------|--------|----------|
| 🥉 Bronze | $199/year | 10% | 1 | Entry-level |
| 🥈 Silver | $349/year | 15% | 2 | Standard residential |
| 🥇 Gold | $549/year | 20% | 3 | Premium residential |
| 💎 Platinum | $899/year | 25% | 4 | VIP/Commercial |

### **How to Add a New Contract**

1. Click **"+ Nouveau contrat"** button
2. Fill in client information:
   - Name, phone, email
   - Property address
3. Select contract tier
4. Choose start date
5. Enable/disable auto-renewal
6. Add notes (optional)
7. Click **"Créer le contrat"**

### **Managing Contracts**

#### **Search & Filter**
- Search by client name or address
- Filter by tier (Bronze/Silver/Gold/Platinum)
- Filter by status (Active/Expiring Soon/Expired)

#### **Contract Actions**
- **View Details** - Click on contract card
- **Schedule Visit** - Click "Planifier visite" button
- **Renew Contract** - For expiring contracts
- **Cancel Contract** - For customer cancellations

#### **Auto-Renewal**
- Contracts with auto-renewal enabled renew automatically
- System sends reminder 30 days before renewal
- Client charged automatically (if payment method on file)

---

## 🏠 **PROPERTY PASSPORTS**

### **Accessing the Feature**
**Route:** `/property-passports`  
**Access:** Admin & Dispatcher only

### **What is a Property Passport?**
A comprehensive digital record for each property including:
- All installed plumbing equipment
- Maintenance history
- Equipment warranties
- Intervention records
- Client preferences

### **Dashboard View**

#### **Statistics**
- Total properties tracked
- Total equipment count
- Equipment needing attention
- Equipment in excellent condition

#### **Search & Filter**
- Search by address or client name
- Filter by property type (Residential/Commercial/Multi-unit)

### **Property Passport Detail**

Click on any property to view:

#### **Tabs:**
1. **Vue d'ensemble** - Summary of all equipment & recent work
2. **Équipements** - Detailed equipment list with condition
3. **Historique** - Complete intervention history
4. **Entretien** - Maintenance calendar

### **Equipment Tracking**

#### **Supported Equipment Types:**
- 🔥 Chauffe-eau (Water Heater)
- ⬇️ Clapet anti-retour (Backwater Valve)
- 💧 Pompe de puisard (Sump Pump)
- 🚰 Entrée d'eau principale (Water Main)
- 🚿 Système de drainage (Drain System)

#### **Equipment Information:**
- Brand & model
- Serial number
- Installation date & age
- Warranty status & expiry
- Last maintenance date
- Next maintenance due
- Condition (Excellent/Good/Fair/Poor/Needs Replacement)
- Notes

### **How to Add Equipment**

1. Open property passport
2. Go to **Équipements** tab
3. Click **"+ Ajouter équipement"**
4. Fill in details:
   - Type of equipment
   - Brand & model
   - Installation date
   - Warranty info (if applicable)
   - Notes
5. Click **"Ajouter"**

### **Maintenance Alerts**

System automatically shows:
- ⚠️ **Attention requise** - Equipment in poor condition
- 🔔 **Entretien dû** - Maintenance due within 30 days
- 📅 **Garantie expirée** - Warranty expired

### **Intervention History**

Every service visit is logged with:
- Date of service
- Technician name
- Service type
- Description of work
- Cost
- Invoice link

---

## ⭐ **REVIEW MANAGEMENT**

### **Accessing the Feature**
**Route:** `/reviews`  
**Access:** Admin & Dispatcher only

### **Dashboard Overview**

#### **Statistics**
- Total reviews
- Average rating (out of 5 stars)
- Pending responses
- 5-star reviews count

### **Review Dashboard**

#### **Filter Options:**
- **By Rating:** All / 5⭐ / 4⭐ / 3⭐ / 2⭐ / 1⭐
- **By Status:** All / Pending Response / Responded
- **Search:** Find specific reviews

### **Responding to Reviews**

1. Find the review
2. Click **"Répondre"** button
3. Type your response (professional, courteous)
4. Click **"Publier réponse"**
5. Response shows publicly under review

**Best Practices:**
- Respond within 24 hours
- Thank client for positive reviews
- Address concerns in negative reviews
- Stay professional and solution-focused

### **Technician Leaderboard**

View top-performing technicians:
- Ranked by average rating
- Shows total reviews
- Breakdown by star rating
- Individual performance metrics

**Use Cases:**
- Performance bonuses
- Training opportunities
- Customer assignment decisions

---

## 💰 **PRICE ESTIMATOR**

### **Two Access Points:**

#### **1. Office Estimator** (Dispatchers)
**Route:** `/soumissions/new`

**Workflow:**
1. Click **"Nouvelle soumission"**
2. Enter client information
3. Select service type
4. Price estimator opens
5. Configure options
6. Generate PDF quote
7. Email to client

#### **2. Mobile Estimator** (Technicians)
**Route:** `/mobile/estimator`

**Workflow:**
1. Technician visits property
2. Opens mobile estimator
3. Builds quote on-site
4. Shows options to client
5. Client approves
6. Quote saved

### **Service Types**

#### **Water Heater Replacement**
- **Standard:** $1,995 - Basic unit, standard warranty
- **Premium:** $2,795 - High-efficiency, 10-year warranty
- **Ultra:** $3,995 - Tankless, lifetime warranty

#### **Backwater Valve Installation**
- **Standard:** $2,495 - Basic valve, municipal certificate
- **Premium:** $3,295 - Premium valve, extended warranty
- **Professional:** $4,495 - Complete system, monitoring

#### **Sump Pump Installation**
- **Standard:** $1,295 - Basic pump, 1-year warranty
- **Premium:** $1,895 - Backup pump included
- **Complete:** $2,695 - WiFi monitoring, battery backup

### **Add-ons Available**
- Extended warranties
- Smart home integration
- WiFi monitoring
- Leak detection sensors
- Emergency service packages

### **Creating a Quote**

1. Select service type
2. Choose tier (Standard/Premium/Ultra)
3. Add optional upgrades
4. Review total price
5. Add notes for client
6. Generate PDF
7. Email or print

---

## 📄 **SERVICE FORMS & REPORTS**

### **Mobile Service Forms** (Technicians Only)
**Route:** `/mobile/service-form`

**When to Use:**
After completing a job, before collecting payment

**Workflow:**
1. Complete job
2. Go to payment screen (Step 3)
3. See **"Fiche technique recommandée"** card
4. Click **"Remplir la fiche"**
5. Fill form with photos
6. Generate PDF report
7. Show/email to client
8. Complete job

### **Available Report Types:**

#### **1. Drain Unblocking Report**
- Job details
- Methods used
- Before/after photos
- Recommendations

#### **2. Backwater Valve Certificate**
- Installation details
- Compliance confirmation
- Municipal certificate
- Warranty information

#### **3. Water Heater Report**
- Equipment specifications
- Installation date
- Maintenance performed
- Warranty details

#### **4. Sump Pump Inspection**
- Pump condition
- Testing results
- Backup system status
- Recommendations

### **PDF Features**
- Company branding
- Professional formatting
- Client-ready
- Compliance documentation
- Email-ready

---

## 📱 **MOBILE TECHNICIAN APP**

### **Accessing Mobile App**
**Route:** `/mobile`  
**Login:** `/mobile/login`

### **Bottom Navigation**

- 🏠 **Accueil** - Job list and dashboard
- 💬 **Messages** - Communication center
- 👤 **Profil** - Personal info and stats

### **Home Screen**

#### **Job Types Shown:**
- **À venir** - Scheduled future jobs
- **En cours** - Active job
- **Complétées** - Completed jobs

### **Job Workflow**

1. **View Job Details** - Tap on job card
2. **Start Job** - Click "Commencer le travail"
3. **Active Job Screen:**
   - Timer running
   - Client info
   - Service details
   - Navigation to property
4. **Complete Job:**
   - Fill service form (optional but recommended)
   - Create on-site quote if needed
   - Take photos
   - Collect payment
   - Job marked complete

### **Mobile-Specific Features**

#### **Service Form**
- Access via job completion
- Take photos with camera
- Upload documents
- Generate PDF on-device

#### **Price Estimator**
- Build quotes on-site
- Show tiers to client
- Instant approval
- Save for office processing

#### **Quick Actions**
- Call client
- Navigate to address
- View property history
- Access equipment info

---

## 🎯 **COMMON WORKFLOWS**

### **Workflow 1: New Maintenance Contract**

1. Client calls requesting maintenance plan
2. Dispatcher opens `/maintenance-contracts`
3. Click **"+ Nouveau contrat"**
4. Explain tier options (Bronze/Silver/Gold/Platinum)
5. Client chooses tier
6. Create contract with details
7. Schedule first visit
8. Email confirmation to client

### **Workflow 2: Equipment Installation**

1. Technician completes water heater installation
2. In mobile app, complete job
3. Fill **Water Heater Report** form
4. Add photos of installation
5. Add equipment to Property Passport
6. Generate PDF report
7. Show client and get signature
8. Email copy to client
9. Equipment automatically tracked for future maintenance

### **Workflow 3: Quote Follow-up**

1. Dispatcher created quote last week
2. Client calls back ready to proceed
3. Open `/soumissions`
4. Find quote in list
5. Create job from quote
6. Assign to technician
7. Technician receives job in mobile app
8. Quote auto-applied to invoice

### **Workflow 4: Contract Renewal**

1. Contract expiring in 30 days
2. System shows in **"Expiring Soon"** filter
3. Dispatcher calls client
4. Client agrees to renew
5. Click **"Renouveler"** button
6. Confirm auto-renewal enabled
7. New year starts automatically
8. Client charged (if payment method on file)

---

## 💡 **TIPS & BEST PRACTICES**

### **For Dispatchers**

✅ **DO:**
- Create property passports for all repeat clients
- Enroll satisfied clients in maintenance contracts
- Respond to reviews within 24 hours
- Use price estimator for all quotes
- Schedule maintenance visits in advance

❌ **DON'T:**
- Create quotes without client info
- Ignore expiring contracts
- Skip equipment documentation
- Forget to follow up on negative reviews

### **For Technicians**

✅ **DO:**
- Fill service forms after every job
- Take before/after photos
- Add equipment to property passports
- Use mobile estimator for upsells
- Update job status in real-time

❌ **DON'T:**
- Skip documentation
- Forget to log equipment details
- Rush through client explanations
- Leave without client signature

### **For Admins**

✅ **DO:**
- Monitor technician performance via reviews
- Track contract renewal rates
- Review property passport data for trends
- Use analytics for business decisions
- Keep equipment warranties updated

❌ **DON'T:**
- Ignore low-rated reviews
- Let contracts expire without follow-up
- Neglect property passport updates
- Skip regular data backups

---

## 📞 **SUPPORT & HELP**

### **In-App Help**
Navigate to `/help` for:
- Feature tutorials
- Video guides
- FAQs
- Contact support

### **Common Issues**

**Issue:** Can't see Maintenance Contracts menu
**Solution:** Check user role - only Admin & Dispatcher can access

**Issue:** Property Passport not saving
**Solution:** Fill all required fields (address, client name)

**Issue:** PDF not generating
**Solution:** Ensure all form fields are complete

**Issue:** Mobile app not loading jobs
**Solution:** Check internet connection, refresh page

---

## 🎓 **TRAINING RESOURCES**

### **Video Tutorials** (Coming Soon)
- Creating maintenance contracts
- Using property passports
- Mobile app walkthrough
- Price estimator demo

### **Written Guides**
- This Quick Start Guide
- `/USER_PROFILE_MAPPING.md` - Who accesses what
- `/MASTER_PROGRESS_REPORT.md` - Feature overview

---

## ✅ **QUICK CHECKLIST**

### **Daily Tasks (Dispatcher)**
- [ ] Check expiring contracts
- [ ] Respond to new reviews
- [ ] Follow up on pending quotes
- [ ] Schedule maintenance visits
- [ ] Review technician performance

### **After Each Job (Technician)**
- [ ] Complete service form
- [ ] Add/update equipment in property passport
- [ ] Take photos
- [ ] Generate PDF report
- [ ] Get client signature
- [ ] Mark job complete

### **Weekly Tasks (Admin)**
- [ ] Review contract revenue
- [ ] Check technician ratings
- [ ] Analyze quote conversion rate
- [ ] Update equipment warranties
- [ ] Review property maintenance schedules

---

## 🚀 **NEXT STEPS**

**You're now ready to use the platform!**

Start with:
1. ✅ Explore the navigation menu
2. ✅ Create your first maintenance contract
3. ✅ Add a property passport
4. ✅ Generate a price estimate
5. ✅ Try the mobile app (if you're a technician)

**Need help?** Navigate to `/help` or contact your system administrator.

---

**Last Updated:** December 17, 2024  
**Platform Version:** v0.6.0  
**Document Status:** Complete & Current
