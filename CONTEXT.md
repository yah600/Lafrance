# GROUPE LAFRANCE APP - Development Context

**Project:** GROUPE LAFRANCE APP - Enhanced Plumbing Service Platform
**Started:** January 20, 2026
**Status:** In Development

---

## Overview

This application is an evolution of the Plomberie D'Experts platform, redesigned with new features based on a comprehensive specification for a bidding-based plumbing service marketplace.

### Key New Features Being Implemented:

1. **Subscription Tier System** - Bronze, Silver, and Gold membership levels for plumbers
2. **Plumber Registration Flow** - Complete onboarding with document verification
3. **Client Request System** - Urgent/non-urgent service requests with AI reformulation
4. **Bidding System (BET)** - Competitive job allocation marketplace
5. **Advanced GPS Tracking** - Geofencing, automatic timers, and real-time tracking
6. **Automated Invoice Generation** - Smart invoicing with 20% flexibility margin
7. **Photo Progression Tracking** - Automated photo capture every 45 minutes
8. **Rating & Review System** - 5-star ratings with Google Reviews integration
9. **Dual Payment System** - Credit card and Interac e-Transfer
10. **After-Sales Service** - Automatic payment holds and resolution tracking
11. **Split Payment System** - 75% immediate, 25% after 30 days (with compliance penalties)

---

## Technology Stack

- **Frontend:** React 18.3.1 + TypeScript
- **Build Tool:** Vite 6.3.5
- **Styling:** Tailwind CSS 4.1.12
- **UI Components:** shadcn/ui (Radix UI), Konsta UI for mobile
- **Routing:** React Router 7.10.1
- **State Management:** React Context API
- **Payment:** Stripe integration
- **PDF Generation:** jsPDF + html2canvas
- **Drag & Drop:** react-dnd
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** Sonner

---

## Development Log

### Session 1 - January 20, 2026

**Completed:**
- ✅ Created new git repository "GROUPE-LAFRANCE-APP"
- ✅ Initialized project structure from existing codebase
- ✅ Created CONTEXT.md tracking file
- ✅ Implemented subscription tier system (Bronze, Silver, Gold)
  - Created subscription.ts with comprehensive type definitions
  - Built SubscriptionTierCard component with pricing display
  - Configured 6-month free trial for all tiers
- ✅ Created plumber registration flow
  - Multi-step registration form (6 steps)
  - Subscription selection with monthly/yearly billing
  - Business information collection
  - Tax & license verification
  - Service preferences configuration
  - Account creation with validation
- ✅ Implemented client request system
  - ClientRequestForm.tsx with photo upload (6 max)
  - AI-powered description reformulation
  - Urgency-based pricing (urgent/normal)
  - Time slot selection for non-urgent requests
  - Credit card pre-authorization
  - Language preference selection
- ✅ Built bidding marketplace (BET system)
  - BidTimer component with real-time countdown
  - BidCard component with plumber profiles
  - BiddingMarketplacePlumber page with job feed
  - 5-minute window for urgent, 2-hour for normal
  - Search and filter functionality
  - Live notifications and sound alerts
  - Engagement warnings and penalty system

**In Progress:**
- 🔄 Implementing GPS tracking with geofencing and automatic timers
- 🔄 Building photo progression system

**Next Steps:**
- Create GPS geofencing component
- Implement automatic timer on geofence entry
- Build photo progression tracker (45-minute intervals)
- Create automated invoice generation with 20% margin
- Implement 5-star rating system with Google integration
- Build payment split system (75%/25%)
- Create after-sales service management

---

## Architecture Notes

### Existing Platform Features (v0.7.0)
- Multi-division support (8 divisions)
- Real-time GPS tracking
- Auto-dispatch system
- Client portal
- Mobile technician app
- Invoice & quote management
- Analytics dashboard
- Compliance tracking

### New Platform Enhancements
The new features will integrate seamlessly with the existing architecture, leveraging:
- Context API for state management
- Existing type definitions
- Integration service infrastructure
- Mobile-first design principles
- Role-based access control

---

## File Structure Changes

```
/src/app/
├── types/
│   ├── subscription.ts (NEW - Subscription tiers)
│   ├── bidding.ts (NEW - Bidding system)
│   └── aftersales.ts (NEW - After-sales service)
├── pages/
│   ├── PlumberRegistration.tsx (NEW)
│   ├── BiddingMarketplace.tsx (ENHANCED)
│   ├── ClientRequestForm.tsx (NEW)
│   └── AfterSalesManagement.tsx (NEW)
├── components/
│   ├── subscription/
│   │   ├── SubscriptionTierCard.tsx (NEW)
│   │   └── SubscriptionUpgrade.tsx (NEW)
│   ├── bidding/
│   │   ├── BidTimer.tsx (NEW)
│   │   └── BidCard.tsx (NEW)
│   └── tracking/
│       ├── GeofenceTracker.tsx (NEW)
│       └── PhotoProgressTracker.tsx (NEW)
```

---

## Implementation Strategy

### Phase 1: Core Systems
1. Subscription tier infrastructure
2. Enhanced user types (plumber vs client differentiation)
3. Bidding system database schema

### Phase 2: User Flows
1. Plumber registration flow
2. Client request submission
3. Bidding marketplace

### Phase 3: Operational Features
1. GPS geofencing
2. Automated timers
3. Photo progression tracking

### Phase 4: Payment & After-Sales
1. Split payment system
2. After-sales service tracking
3. Compliance penalty system

### Phase 5: UI/UX Redesign
1. Modern component library updates
2. Improved navigation flow
3. Enhanced mobile experience

---

## Git Commit Strategy

Commits will be made after completing each major feature or subsystem, with descriptive messages following the format:
- `feat: [description]` for new features
- `enhance: [description]` for improvements
- `fix: [description]` for bug fixes
- `refactor: [description]` for code refactoring
- `docs: [description]` for documentation

---

---

## Summary of Session 1 (January 20, 2026)

### Major Features Implemented

✅ **Subscription System** (Bronze/Silver/Gold)
- 3 tier pricing with 6-month free trial
- Monthly/yearly billing options
- Feature differentiation and benefits display

✅ **Plumber Registration** (6-step wizard)
- Subscription selection
- Business and tax information
- Service preferences and account creation

✅ **Client Request System**
- Urgent/non-urgent job requests
- AI description reformulation
- Photo upload (6 max)
- Credit card pre-authorization
- Time slot selection

✅ **Bidding Marketplace (BET)**
- Real-time job feed with filters
- 5-minute window for urgent jobs
- 2-hour window for normal jobs
- Bid timer with countdown
- Plumber profile cards
- Search and notification system

✅ **GPS Geofencing**
- Real-time distance calculation
- 100m geofence detection
- Auto-timer start after 3 minutes in zone
- Visual status indicators

✅ **Photo Progression Tracking**
- Automated 45-minute reminders
- Photo upload with AI descriptions
- Timeline history
- Completion tracking

### Git Commits

1. Initial platform setup with type definitions
2. Subscription and registration implementation
3. Client request and bidding system
4. GPS geofencing and photo tracking
5. Documentation and README

### Files Created

- `src/app/types/subscription.ts`
- `src/app/types/bidding.ts`
- `src/app/types/aftersales.ts`
- `src/app/components/subscription/SubscriptionTierCard.tsx`
- `src/app/components/bidding/BidTimer.tsx`
- `src/app/components/bidding/BidCard.tsx`
- `src/app/components/tracking/GeofenceTracker.tsx`
- `src/app/components/tracking/PhotoProgressTracker.tsx`
- `src/app/pages/auth/PlumberRegistration.tsx`
- `src/app/pages/portal/ClientRequestForm.tsx`
- `src/app/pages/BiddingMarketplacePlumber.tsx`
- `README_GROUPE_LAFRANCE.md`
- `GITHUB_SETUP_INSTRUCTIONS.md`

### Statistics

- **Lines of Code Added:** ~3000+
- **Components Created:** 8
- **Pages Created:** 3
- **Type Definitions:** 3 files
- **Git Commits:** 5

### Ready for GitHub Push

Follow instructions in `GITHUB_SETUP_INSTRUCTIONS.md` to push to GitHub.

---

**Last Updated:** January 20, 2026 15:00 EST
