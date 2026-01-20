# FIGMA MAKE
## DESIGN SYSTEM & UI/UX COMPLET
### Plateforme de Dispatch Intelligent — Enterprise Edition

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 Design System Complet  
🎨 50+ Composants UI  
📱 35+ Pages & Écrans  
🔄 Workflows Interactifs  
✨ Features Innovantes IA  

**Décembre 2025**

---

## 📑 Table des Matières

### PARTIE 1 — DESIGN SYSTEM
- 1.1 Design Tokens (Couleurs, Typography, Spacing, Shadows)
- 1.2 Composants Atomiques (Buttons, Inputs, Badges, Icons)
- 1.3 Composants Moléculaires (Cards, Forms, Modals, Alerts)
- 1.4 Composants Organismes (Navigation, Headers, Data Tables)

### PARTIE 2 — DASHBOARD ADMIN (Desktop)
- 2.1 Auth Flow (Login, 2FA, Password Reset, Onboarding)
- 2.2 Dashboard Home (Stats, Map, Live Feed)
- 2.3 Dispatch Center (Calendar, Drag & Drop, Auto-Assign)
- 2.4 Gestion Techniciens (List, Profile, Performance)
- 2.5 CRM Clients (List, Fiche, Équipements, Historique)
- 2.6 Carte GPS Temps Réel (Tracking, Routes, Zones)
- 2.7 Facturation & Paiements (Invoices, Stripe, Reports)
- 2.8 Analytics & Rapports (KPIs, Charts, Export)
- 2.9 Settings & Administration (Users, Roles, Integrations)

### PARTIE 3 — APP TECHNICIEN (Mobile)
- 3.1 Onboarding & Login (PIN, Biometrics)
- 3.2 Home & Today's Jobs
- 3.3 Job Detail & Navigation
- 3.4 Active Job Flow (Checklist, Photos, Timer)
- 3.5 Completion & Signature
- 3.6 Messages & Notifications

### PARTIE 4 — FEATURES INNOVANTES
- 4.1 AI Dispatch Assistant (Chat, Suggestions)
- 4.2 Voice Commands
- 4.3 AR Diagnostic Mode
- 4.4 Predictive Maintenance
- 4.5 Customer Self-Service Portal

### PARTIE 5 — WORKFLOWS & USER FLOWS
- 5.1 Job Lifecycle (Création → Complétion)
- 5.2 Emergency Flow
- 5.3 Rescheduling Flow
- 5.4 Payment Flow

---

## PARTIE 1 — DESIGN SYSTEM

### 1.1 Design Tokens

#### 🎨 Color Palette

**PRIMARY COLORS (from logo):**
- Primary Blue: `#0B5394` (headers, nav, primary actions)
- Accent Blue: `#2E86AB` (buttons, links, interactive elements)
- Light Blue: `#5DADE2` (backgrounds, hovers, selection)
- Flame Red: `#E74C3C` (urgent, errors, emergencies)
- Flame Orange: `#E67E22` (warnings, in-progress states)

**SEMANTIC COLORS:**
- Success: `#28A745` (completed, available, confirmed)
- Warning: `#F59E0B` (pending, attention needed)
- Danger: `#DC3545` (errors, urgent, cancelled)
- Info: `#17A2B8` (notifications, tips)

**NEUTRAL SCALE:**
- Gray 900: `#1A1A2E` (text primary)
- Gray 700: `#374151` (text secondary)
- Gray 500: `#6B7280` (text muted)
- Gray 300: `#D1D5DB` (borders)
- Gray 100: `#F3F4F6` (backgrounds)
- White: `#FFFFFF`

**Requirements:**
- Main color + hover/active/disabled states
- 10% 20% 30% opacity variants
- Dark mode equivalents
- Contrast ratios for accessibility (WCAG AA)

---

#### 📝 Typography System

**Font Family:** Inter

**DISPLAY:**
- Display XL: 72px / Bold / -2% tracking (hero sections)
- Display L: 48px / Bold / -1.5% tracking (page titles)
- Display M: 36px / Semibold / -1% tracking (section headers)

**HEADINGS:**
- H1: 32px / Bold / 40px line-height
- H2: 24px / Semibold / 32px line-height
- H3: 20px / Semibold / 28px line-height
- H4: 18px / Medium / 24px line-height
- H5: 16px / Medium / 22px line-height
- H6: 14px / Medium / 20px line-height

**BODY:**
- Body Large: 18px / Regular / 28px line-height
- Body: 16px / Regular / 24px line-height
- Body Small: 14px / Regular / 20px line-height
- Caption: 12px / Regular / 16px line-height
- Overline: 12px / Semibold / Uppercase / 2% tracking

**SPECIAL:**
- Code: 14px / JetBrains Mono / Monospace
- Label: 14px / Medium / 20px line-height
- Button: 14px / Semibold / Uppercase for small, Normal for large

**Note:** Must support French accents: é, è, ê, ë, à, ù, ç, œ

---

#### 📏 Spacing & Grid System

**SPACING SCALE (base 4px):**
- 0: 0px
- 1: 4px (tight)
- 2: 8px (compact)
- 3: 12px (default small)
- 4: 16px (default)
- 5: 20px
- 6: 24px (comfortable)
- 8: 32px (spacious)
- 10: 40px
- 12: 48px
- 16: 64px (section gap)
- 20: 80px
- 24: 96px (page gap)

**GRID:**

Desktop (1440px):
- 12 columns, 72px each
- 24px gutters
- 80px margins

Tablet (768px):
- 8 columns, 80px each
- 16px gutters
- 32px margins

Mobile (390px):
- 4 columns, 77px each
- 16px gutters
- 20px margins

---

#### 🌫️ Shadows & Effects

**SHADOWS:**
- Shadow XS: `0 1px 2px rgba(0,0,0,0.05)` — subtle lift
- Shadow SM: `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` — cards
- Shadow MD: `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` — dropdowns
- Shadow LG: `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` — modals
- Shadow XL: `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` — popovers
- Shadow 2XL: `0 25px 50px rgba(0,0,0,0.25)` — full-screen overlays

**COLORED SHADOWS (for primary buttons):**
- Primary Glow: `0 4px 14px rgba(11,83,148,0.4)`
- Success Glow: `0 4px 14px rgba(40,167,69,0.4)`
- Danger Glow: `0 4px 14px rgba(220,53,69,0.4)`

**BLUR EFFECTS:**
- Backdrop Blur: `blur(8px)` — glass morphism
- Background Blur: `blur(24px)` — modal backgrounds

**BORDER RADIUS:**
- None: 0
- SM: 4px
- MD: 6px (default)
- LG: 8px (cards)
- XL: 12px (modals)
- 2XL: 16px (large cards)
- Full: 9999px (pills, avatars)

---

### 1.2 Composants Atomiques

#### 🔘 Buttons

**VARIANTS:**
1. Primary — #0B5394 bg, white text, blue glow on hover
2. Secondary — White bg, #0B5394 border & text
3. Tertiary/Ghost — Transparent, #2E86AB text
4. Danger — #E74C3C bg, white text
5. Success — #28A745 bg, white text
6. Warning — #F59E0B bg, dark text

**SIZES:**
- XS: 24px height, 12px padding, 12px text
- SM: 32px height, 14px padding, 13px text
- MD: 40px height, 16px padding, 14px text (default)
- LG: 48px height, 20px padding, 16px text
- XL: 56px height, 24px padding, 18px text

**STATES for each:**
- Default
- Hover (lighten 10%, slight lift shadow)
- Active/Pressed (darken 5%, no shadow)
- Focus (blue ring outline 2px offset)
- Disabled (50% opacity, no pointer)
- Loading (spinner replacing text, disabled)

**ICON BUTTONS:**
- Icon only (square aspect)
- Icon + Text left
- Text + Icon right
- Icon both sides

**SPECIAL BUTTONS:**
- FAB (Floating Action Button) — circular, shadow LG
- Split Button — main action + dropdown
- Button Group — connected buttons
- Toggle Button — on/off state

---

#### 📝 Form Inputs

**TEXT INPUTS:**
- Default: 40px height, gray border, white bg
- Filled: Light gray bg, no border until focus
- Outlined: Transparent bg, prominent border

**STATES:**
- Empty with placeholder
- Filled with value
- Focused (blue border, subtle shadow)
- Error (red border, error icon, error message below)
- Success (green border, checkmark)
- Disabled (gray bg, 50% opacity)
- Read-only (no border, subtle bg)

**WITH ADDONS:**
- Left icon (search, email, phone)
- Right icon (clear X, show/hide password, calendar)
- Left text addon ($, +1, https://)
- Right text addon (.00, kg, km)
- Character counter

**INPUT TYPES:**
1. Text input
2. Email input (with validation)
3. Password (show/hide toggle)
4. Number (with +/- steppers)
5. Phone (with country code dropdown)
6. Search (with clear button, search icon)
7. Textarea (resizable, auto-grow option)
8. Date picker (calendar popup)
9. Time picker (scroll wheels or dropdown)
10. Date-time picker (combined)
11. Select/Dropdown (single)
12. Multi-select (tags/chips)
13. Combobox (searchable dropdown)
14. Autocomplete (async search)
15. File upload (drag & drop zone)
16. Rich text editor (WYSIWYG)

---

#### 🏷️ Badges & Tags

**STATUS BADGES (job/technician status):**
- Pending: Yellow bg (#FEF3C7), orange text, clock icon
- Assigned: Blue bg (#DBEAFE), blue text, user icon
- En route: Purple bg (#EDE9FE), purple text, truck icon
- In Progress: Teal bg (#CCFBF1), teal text, wrench icon
- Completed: Green bg (#D1FAE5), green text, checkmark
- Cancelled: Red bg (#FEE2E2), red text, X icon
- On Hold: Gray bg (#F3F4F6), gray text, pause icon

**PRIORITY BADGES:**
- Low: Gray outline
- Normal: Blue outline
- High: Orange filled
- Urgent: Red filled, pulsing animation

**SERVICE TYPE BADGES:**
- Débouchage: 💧 water drop icon
- Chauffe-eau: 🔥 flame icon
- Robinetterie: 🚿 faucet icon
- Urgence: ⚡ lightning bolt
- Inspection: 🔍 magnifier

**NOTIFICATION BADGES:**
- Count badge (red circle with number)
- Dot indicator (small colored dot)
- New badge (pulsing)

**SIZES:** SM (20px), MD (24px), LG (28px)

---

#### 🖼️ Avatars & Icons

**AVATARS:**

Sizes: XS(24), SM(32), MD(40), LG(48), XL(64), 2XL(96), 3XL(128)

Types:
- Photo (rounded, object-fit cover)
- Initials (colored background based on name hash)
- Icon placeholder (user silhouette)
- Company logo

With status indicator:
- Online (green dot bottom-right)
- Busy (red dot)
- Away (yellow dot)
- Offline (gray dot)

Avatar Group:
- Stacked overlapping (-8px margin)
- +N overflow count
- Expandable on hover

**ICON SET (Lucide icons):**

Navigation: home, menu, arrow-left, arrow-right, chevron, external-link  
Actions: plus, minus, edit, trash, copy, download, upload, share  
Status: check, x, alert-triangle, info, help-circle  
Users: user, users, user-plus, user-check  
Jobs: briefcase, wrench, tool, hammer, clipboard  
Location: map-pin, navigation, compass, route  
Time: clock, calendar, timer, history  
Communication: phone, message, mail, bell  
Finance: dollar-sign, credit-card, receipt, invoice  
Charts: bar-chart, line-chart, pie-chart, trending-up  

Each icon in: 16, 20, 24, 32px sizes  
Stroke width options: 1.5, 2, 2.5

---

### 1.3 Composants Moléculaires

#### 🃏 Cards

**1. JOB CARD (list view):**
- Left color bar indicating priority/status
- Time slot (8:00 - 10:00)
- Client name (bold)
- Address (truncated with tooltip)
- Service type badge
- Assigned technician (avatar + name) or 'Unassigned'
- Status badge
- Hover: subtle lift, show quick actions (edit, assign, cancel)
- Click: expand or navigate to detail

**2. JOB CARD (kanban view):**
- Compact version for drag & drop
- Client name, time, service icon
- Technician avatar
- Draggable handle

**3. TECHNICIAN CARD:**
- Profile photo (large)
- Name, phone (click to call)
- Status badge (Available/Busy/Off)
- Today's stats: 3/5 jobs completed
- Skills tags (max 3 visible + more)
- Star rating
- Actions: View, Assign Job, Message

**4. CLIENT CARD:**
- Name, address
- Phone (click to call), email
- Last service date
- Equipment icons (water heater, etc.)
- Total spent badge
- Actions: View, New Job, Edit

**5. STAT CARD (dashboard):**
- Icon in colored circle
- Large number value
- Label
- Trend indicator (+12% ↑ green or -5% ↓ red)
- Sparkline mini chart

**6. NOTIFICATION CARD:**
- Type icon
- Title, message preview
- Time ago
- Unread dot indicator
- Actions: Mark read, Dismiss

---

#### 📋 Forms & Modals

**FORM LAYOUTS:**
1. Single column (mobile, simple forms)
2. Two column (desktop, related fields side by side)
3. Multi-step wizard (progress indicator, prev/next)
4. Inline editing (click to edit, save/cancel)

**FORM SECTIONS:**
- Section header with description
- Collapsible sections
- Conditional fields (show/hide based on selection)
- Field groups with background

**MODALS:**

Sizes: SM(400px), MD(560px), LG(720px), XL(900px), Full(90vw)

Types:
1. **Confirmation modal:**
   - Icon (warning/danger/success)
   - Title, message
   - Cancel + Confirm buttons

2. **Form modal:**
   - Header with title + close X
   - Scrollable body
   - Sticky footer with actions

3. **Side panel (drawer):**
   - Slides from right
   - Full height
   - 400px or 600px width
   - For job details, technician profile

4. **Command palette (⌘K):**
   - Search input at top
   - Categorized results
   - Keyboard navigation
   - Recent actions

5. **Image gallery modal:**
   - Full screen
   - Thumbnails navigation
   - Zoom, download

**OVERLAYS:**
- Backdrop: rgba(0,0,0,0.5) with blur(4px)
- Center or slide animations
- Click outside to close option
- Escape key closes

---

#### 🔔 Alerts & Toasts

**INLINE ALERTS:**
- Info: Blue left border, info icon, light blue bg
- Success: Green border, checkmark, light green bg
- Warning: Yellow border, alert icon, light yellow bg
- Error: Red border, X icon, light red bg

Features:
- Title + description
- Dismissible X button
- Action link/button
- Collapsible details

**TOAST NOTIFICATIONS:**

Position: Top-right corner, stacked

Types:
- Success: "Job créé avec succès" + checkmark
- Error: "Erreur de connexion" + retry button
- Warning: "Session expire dans 5 min"
- Info: "Nouveau job assigné à Marc"
- Loading: "Envoi en cours..." + spinner
- Promise: Loading → Success/Error

Features:
- Auto-dismiss (5s default, configurable)
- Progress bar showing time remaining
- Pause on hover
- Manual dismiss
- Action button
- Undo action for destructive operations

**BANNER ALERTS:**
- Full width at top of page
- Important announcements
- Dismissible
- Can include CTA button

---

### 1.4 Composants Organismes

#### 🧭 Navigation

**SIDEBAR NAVIGATION (Desktop):**

Width: 280px expanded, 72px collapsed

Structure:
- Logo at top (flame icon + 'Plomberie D'Experts' or just icon)
- Collapse toggle button
- Main nav items with icons:
  • Dashboard (grid icon)
  • Dispatch (calendar)
  • Techniciens (users)
  • Clients (address-book)
  • Carte GPS (map)
  • Factures (file-text)
  • Rapports (bar-chart)
- Divider
- Secondary nav:
  • Paramètres (gear)
  • Aide (help-circle)

Item states:
- Default: Icon + label, transparent bg
- Hover: Light blue bg
- Active: Blue bg (#0B5394), white text, left border indicator
- With notification: Red dot or count badge

Collapsed state:
- Icons only
- Tooltip on hover showing label
- Active state: blue bg pill

**USER SECTION (bottom):**
- Avatar
- Name + Role
- Dropdown: Profile, Settings, Logout

**TOP HEADER BAR:**
- Breadcrumbs
- Search bar (⌘K shortcut hint)
- Notification bell with count
- User avatar dropdown

**MOBILE NAVIGATION:**
- Bottom tab bar (5 items max)
- Hamburger menu for more
- Slide-out drawer

---

#### 📊 Data Tables

**TABLE FEATURES:**

1. **Column headers:**
   - Sortable (click to sort, arrow indicator)
   - Resizable (drag border)
   - Reorderable (drag to reposition)
   - Hideable (column visibility toggle)

2. **Row features:**
   - Selectable (checkbox)
   - Expandable (click to show details)
   - Hover highlight
   - Alternating row colors option
   - Click row to navigate

3. **Cells:**
   - Text (truncate with tooltip)
   - Number (right-aligned)
   - Currency ($299.00)
   - Date/Time
   - Status badge
   - Avatar + name
   - Actions (icon buttons)
   - Progress bar
   - Rating stars
   - Boolean (checkmark/x)

4. **Toolbar:**
   - Search/filter input
   - Column visibility dropdown
   - Export button (CSV, PDF)
   - Bulk actions when selected
   - View toggle (table/grid/list)

5. **Pagination:**
   - Rows per page selector
   - Page navigation
   - Showing X-Y of Z items

6. **Empty state:**
   - Illustration
   - "No results found" message
   - Suggestion or CTA

7. **Loading state:**
   - Skeleton rows
   - Spinner overlay

---

## PARTIE 2 — DASHBOARD ADMIN

### 2.1 Auth Flow

#### Page: Login

**LAYOUT:** Split screen (desktop)

Left 50%: Hero section
- Large background image: professional plumber at work, blue overlay
- Company tagline: "Gérez vos interventions en toute simplicité"
- Customer testimonial quote

Right 50%: Login form
- White background
- Logo centered at top (flame + text)
- "Connexion" heading
- Email field with envelope icon
- Password field with eye toggle
- "Se souvenir de moi" checkbox
- "Mot de passe oublié?" link (right-aligned)
- Primary login button (full width)
- Divider "ou"
- "Connexion avec Microsoft" button (for enterprise SSO)
- Footer: "Besoin d'aide? Contactez le support"

**MOBILE:** Single column, hero becomes small banner

**ERROR STATES:**
- Invalid email format
- Wrong credentials (shake animation)
- Account locked
- Network error

---

#### Page: 2FA Verification

**LAYOUT:**
- Back arrow to return to login
- Icon: shield with lock
- Title: "Vérification en deux étapes"
- Subtitle: "Entrez le code envoyé à votre téléphone *** *** 4567"

**CODE INPUT:**
- 6 separate digit boxes
- Auto-advance on input
- Paste support
- Backspace to go back

- "Renvoyer le code" link with countdown timer
- "Utiliser une autre méthode" dropdown:
  • SMS
  • Email
  • Authenticator app

- Verify button
- "Faire confiance à cet appareil" checkbox

---

#### Page: Password Reset Flow

**STEP 1 - Request:**
- "Réinitialiser votre mot de passe"
- Email input
- "Envoyer le lien" button
- "Retour à la connexion" link

**STEP 2 - Email Sent:**
- Checkmark icon animation
- "Vérifiez votre boîte mail"
- "Nous avons envoyé un lien à email@example.com"
- "Vous n'avez rien reçu?" + Resend button
- Open email app button (deep link)

**STEP 3 - New Password:**
- "Créer un nouveau mot de passe"
- New password field
- Confirm password field
- Password strength indicator (weak/medium/strong)
- Requirements checklist:
  ✓ 8 caractères minimum
  ✓ Une majuscule
  ✓ Un chiffre
  ✓ Un caractère spécial
- "Réinitialiser" button

**SUCCESS:**
- Confetti animation
- "Mot de passe mis à jour!"
- Auto-redirect countdown

---

#### Page: First-time Onboarding

**PROGRESS:** Stepper at top showing all steps

**STEP 1 - Welcome:**
- "Bienvenue sur la plateforme!"
- Brief intro animation/illustration
- Company setup (confirm name, address, phone)

**STEP 2 - Add Technicians:**
- "Ajoutez votre équipe"
- Quick add form (name, phone, email)
- Or import from CSV
- Skip option (add later)

**STEP 3 - Service Areas:**
- "Définissez vos zones de service"
- Interactive map
- Draw zones or enter postal codes

**STEP 4 - Working Hours:**
- "Configurez vos horaires"
- Weekly schedule grid
- Holiday exceptions

**STEP 5 - Integrations:**
- "Connectez vos outils"
- Calendar sync (Google, Outlook)
- Accounting (QuickBooks)
- Payment (Stripe setup)
- Skip available

**COMPLETION:**
- Celebration animation
- "Vous êtes prêt!"
- Quick tour offer or start button

---

### 2.2 Dashboard Home

**HEADER:**
- "Bonjour, [Prénom] 👋" greeting
- Today's date: "Mardi 16 décembre 2025"
- Weather widget (Montreal: -5°C, snow icon)
- Quick action buttons: "+ Nouveau travail", "Dispatch auto"

**STATS ROW (4 cards):**
1. Travaux aujourd'hui: 24 (↑ 12% vs last week)
2. Techniciens actifs: 4/6 (2 en pause)
3. Revenus du jour: $4,850 (↑ 8%)
4. Satisfaction client: 4.8/5 ⭐

**MAIN CONTENT (2 columns, 60/40 split):**

**LEFT (60%) - LIVE MAP:**
- Interactive MapBox map
- Technician pins with avatars
- Color-coded status rings
- Job location pins
- Traffic layer toggle
- Zoom controls
- "Voir plein écran" button
- Click pin = popup with details

**RIGHT (40%) - TODAY'S FEED:**

Tab navigation: "En cours" | "À venir" | "Complétés"

En cours tab:
- Live job cards
- Technician avatar, name
- Client, address
- Started at time, duration timer
- Progress indicator
- Quick actions: Call, Message, View

À venir tab:
- Upcoming jobs list
- Time slot, client
- Assigned tech or "À assigner" warning
- Drag to reorder

Complétés tab:
- Completed jobs
- Duration, rating
- Invoice status

**BOTTOM SECTION:**

Recent Activity Timeline:
- "Marc a terminé le travail #1234"
- "Nouveau client ajouté: Jean Dupont"
- "Facture #567 payée"
Time stamps, icons per activity type

---

### 2.3 Dispatch Center

#### Page: Calendar View

**TOOLBAR:**
- Date navigation: < Today >
- View toggles: Jour | Semaine | Mois
- Filters: Technician, Service type, Status
- "+ Nouveau travail" button
- "Auto-dispatch" AI button with sparkle icon

**CALENDAR GRID (Week view):**

Rows = Technicians (with avatar, name, status)  
Columns = Days (Mon-Sun)  
Cells = Time slots (7AM-7PM, 30min increments)

**JOB BLOCKS on grid:**
- Colored by service type
- Show: time, client name, service icon
- Resize handles (drag to extend)
- Drag & drop to reschedule
- Drag between technicians to reassign
- Overlap warning indicator

**INTERACTIONS:**
- Drag job block to move
- Click empty slot = create new job
- Click job = open detail panel
- Right-click = context menu (edit, duplicate, cancel)
- Shift+click = multi-select

**VISUAL INDICATORS:**
- Conflicts: red outline, warning icon
- Travel time: gray blocks between jobs
- Breaks: hatched pattern
- Unavailable: grayed out
- Overtime: orange highlight

**RIGHT PANEL (when job selected):**
- Job details
- Client info
- Edit form
- History log
- Actions: Assign, Reschedule, Cancel

---

#### Page: Kanban Board View

**COLUMNS:**
1. 📥 Nouveaux (incoming requests)
2. 📋 À planifier (needs scheduling)
3. 👤 Assignés (assigned, not started)
4. 🚗 En route (technician traveling)
5. 🔧 En cours (work in progress)
6. ✅ Complétés (done today)

Each column:
- Header with count badge
- Scrollable card list
- Drop zone highlight on drag

**JOB CARDS (compact):**
- Priority color stripe
- Client name
- Time slot
- Service type icon
- Technician avatar (if assigned)
- Drag handle

**FEATURES:**
- Drag & drop between columns
- Quick assign: drag tech avatar onto card
- Collapse/expand columns
- Column WIP limits (warning when exceeded)
- Swimlanes by service type option

**FILTERS:**
- Date picker
- Technician filter
- Priority filter
- Search

**QUICK ACTIONS:**
- Floating "+ Add Job" button per column
- Bulk select and move

---

#### Modal: Create New Job

**SIZE:** Large (720px width)

**HEADER:**
- "Nouveau travail"
- Close X button

**FORM SECTIONS:**

**1. CLIENT (with tabs: Existant | Nouveau)**

Existing tab:
- Searchable dropdown
- Recent clients quick select
- Selected shows: name, address, phone

New client tab:
- Name, Phone, Email
- Address with autocomplete
- Notes

**2. SERVICE**
- Service type dropdown with icons
- Description textarea
- Equipment involved (from client history)
- Priority selector (Normal/High/Urgent)
- Estimated duration

**3. SCHEDULE**
- Date picker
- Time slot picker (morning/afternoon/specific)
- Preferred technician (optional)
- Or "Auto-assign" checkbox with AI icon

**4. ASSIGNMENT (if not auto)**
- Technician dropdown
- Show availability indicator
- Show distance from last job
- Skill match indicator

**5. ADDITIONAL**
- Internal notes
- Attachments (photos from client)
- Recurring job toggle
- Reminder settings

**FOOTER:**
- Cancel button
- "Enregistrer comme brouillon"
- "Créer le travail" primary button

**SMART FEATURES:**
- Address auto-populates from client
- Time suggestions based on tech availability
- Conflict warnings inline

---

### 2.4 Gestion Techniciens

#### Page: Technicians List

**HEADER:**
- "Techniciens" title with count (6 techniciens)
- View toggle: Cards | List
- Filters: Status, Skills, Zone
- Search
- "+ Ajouter technicien" button

**CARD GRID VIEW:**

Cards showing:
- Large profile photo
- Name, phone
- Status badge (Available/On Job/Off Today)
- Current job info (if on job)
- Today's progress: "3/5 travaux"
- Skills tags
- Rating stars
- Quick actions: View, Assign, Message

**LIST TABLE VIEW:**

Columns: Photo, Name, Phone, Status, Current Job, Today's Jobs, Skills, Rating, Actions

**LIVE STATUS INDICATORS:**
- Green dot: Available
- Yellow dot: En route
- Blue dot: On job
- Red dot: Offline
- Gray dot: Off today

**BULK ACTIONS:**
- Send message to selected
- Export list
- Change status

---

#### Page: Technician Profile

**HEADER:**
- Back arrow
- Cover photo area
- Large profile photo (editable)
- Name, role "Technicien Senior"
- Status badge
- Contact buttons: Call, Message, Email
- Edit profile button

**STATS BAR:**

4 stat cards:
- Travaux complétés: 1,247
- Taux de complétion: 98.5%
- Note moyenne: 4.9/5
- Revenus générés: $89,450

**TABS:** Aperçu | Horaire | Historique | Avis | Paramètres

**APERÇU TAB:**

Left column:
- Contact info card
- Skills & certifications
- Zones assignées (mini map)
- Equipment/vehicle info

Right column:
- Today's schedule (mini calendar)
- Active job (if any)
- Recent activity

**HORAIRE TAB:**
- Weekly availability grid
- Working hours per day
- Time off requests
- Overtime history

**HISTORIQUE TAB:**
- Job history table
- Filters by date, status, type
- Performance trends chart

**AVIS TAB:**
- Customer reviews
- Star rating distribution
- Featured reviews
- Response rate

---

### 2.5 CRM Clients

#### Page: Clients List

**HEADER:**
- "Clients" title with count
- Search bar (name, phone, address)
- Filters: Zone, Last service, Equipment type
- Segment: All | Residential | Commercial
- "+ Nouveau client" button
- Import/Export buttons

**TABLE COLUMNS:**
- Name (with avatar initial)
- Phone (click to call)
- Address (truncated)
- Last Service (date + type)
- Equipment (icon badges)
- Total Spent ($)
- Actions

**ROW FEATURES:**
- Click to open detail
- Hover shows quick actions
- Row color by segment (residential=blue, commercial=purple)

**FILTERS PANEL (collapsible):**
- Date range (last service)
- Postal code / zone
- Equipment type checkboxes
- Spent amount range slider
- Has upcoming appointment toggle

**EMPTY STATE:**
- Illustration
- "Aucun client trouvé"
- "Ajoutez votre premier client" CTA

---

#### Page: Client Detail

**HEADER:**
- Back button
- Client name (large)
- Segment badge (Résidentiel/Commercial)
- Address (click for maps)
- Edit button

**QUICK ACTIONS BAR:**
- 📞 Appeler
- 💬 Message
- 📧 Email
- 📅 Planifier travail
- 📄 Créer facture

**CONTENT LAYOUT (2 columns):**

**LEFT COLUMN (40%):**

1. Contact Info Card:
   - Phone (with call button)
   - Email
   - Address (with map preview)
   - Preferred contact method
   - Notes

2. Equipment Card:
   - List of equipment at location
   - Each: Type, Brand, Model, Install date, Warranty status
   - Add equipment button
   - Maintenance schedule

3. Documents Card:
   - Uploaded photos
   - Previous invoices
   - Contracts

**RIGHT COLUMN (60%):**

1. Service History Timeline:
   - Chronological list
   - Each: Date, Service type, Technician, Duration, Amount, Rating
   - Click to expand details
   - Filter by year

2. Upcoming Appointments:
   - Scheduled jobs
   - Quick reschedule

3. Financial Summary:
   - Total spent
   - Outstanding balance
   - Payment history
   - Preferred payment method

---

### 2.6 Carte GPS Temps Réel

**LAYOUT:** Full screen with overlay panels

**MAP (MapBox Dark or Light style):**
- Fill entire viewport
- Smooth animations on updates

**TECHNICIAN MARKERS:**
- Custom pins with avatar photo
- Status ring: Green/Yellow/Red
- Direction indicator (arrow showing heading)
- Click = popup with:
  • Name, phone
  • Current status
  • Current job details
  • ETA to destination
  • Quick actions: Call, Message, Reassign

**JOB LOCATION MARKERS:**
- Pin with service type icon
- Color by priority
- Number showing job order
- Click = job details popup

**ROUTES:**
- Draw route from tech to destination
- Show estimated time
- Traffic-aware coloring (green/yellow/red)
- Alternative routes option

**LEFT PANEL (300px, collapsible):**
- Technician list
- Status filter tabs: All | Active | Available
- Each tech: avatar, name, status, current address
- Click to center map on tech
- Live update indicators

**TOP TOOLBAR:**
- Search location
- Layer toggles:
  • Traffic
  • Satellite view
  • Service zones
  • Heatmap (job density)
- Time machine slider (replay past routes)

**BOTTOM STATUS BAR:**
- Active techs count
- Jobs in progress
- Average ETA
- Last update time

**REAL-TIME FEATURES:**
- Position updates every 30 seconds
- Push notification when tech arrives
- Geofence alerts (entering/leaving zones)
- Breadcrumb trail option

---

### 2.7 Facturation & Paiements

#### Page: Invoices List

**HEADER:**
- "Facturation" title
- Stats: $45,230 ce mois | $12,450 en attente | $890 en retard
- "+ Nouvelle facture" button
- Export PDF/CSV

**TABS:** Toutes | Brouillons | Envoyées | Payées | En retard

**TABLE COLUMNS:**
- Invoice # (link)
- Date
- Client
- Job reference
- Amount
- Status badge
- Actions

**STATUS BADGES:**
- Brouillon: Gray
- Envoyée: Blue
- Vue: Purple (client opened)
- Payée: Green
- Partiel: Yellow
- En retard: Red (pulsing)
- Annulée: Strikethrough

**BULK ACTIONS:**
- Send selected
- Mark as paid
- Export

**ROW ACTIONS:**
- View/Edit
- Send reminder
- Record payment
- Void/Cancel

---

#### Page: Invoice Detail/Editor

**LAYOUT:** Two panels

**LEFT (60%) - Invoice Preview:**
- Looks like actual PDF
- Company logo, address
- "FACTURE" header
- Invoice #, Date, Due date
- Bill To (client info)
- Service address

Line items table:
- Description
- Quantity
- Unit price
- Amount

Subtotal  
Taxes (TPS 5%, TVQ 9.975%)  
TOTAL (large, bold)

Payment terms  
Notes  
"Merci pour votre confiance!"

**RIGHT (40%) - Controls:**

Status section:
- Current status badge
- Status history timeline
- Send/Resend button

Payment section:
- Payment method received
- "Enregistrer un paiement" button
- Partial payment support

Actions:
- Download PDF
- Email to client
- Print
- Duplicate
- Void

Activity log:
- Created, Sent, Viewed, Paid timestamps

---

### 2.8 Analytics & Rapports

**HEADER:**
- "Rapports & Analytics" title
- Date range picker (presets: Today, 7d, 30d, 90d, YTD, Custom)
- Compare toggle (vs previous period)
- Export report button

**KPI CARDS ROW:**
1. Revenus: $124,500 (+12% ↑)
2. Travaux complétés: 387 (+8% ↑)
3. Valeur moyenne: $322 (+3% ↑)
4. Satisfaction: 4.8/5 ⭐

**CHARTS SECTION (2x2 grid):**

**1. Revenus (Line chart)**
- Daily/Weekly/Monthly toggle
- Compare with previous period
- Tooltip on hover
- Goal line indicator

**2. Travaux par type (Donut chart)**
- Segments: Débouchage, Chauffe-eau, Robinetterie, etc.
- Legend with counts
- Click to filter

**3. Performance techniciens (Horizontal bar chart)**
- Each tech: jobs completed, revenue generated
- Sort by metric
- Click to see individual report

**4. Heures de pointe (Heatmap)**
- Days vs Hours grid
- Color intensity = job volume
- Identify busy times

**DETAILED TABLES:**

Tabs: Par technicien | Par service | Par zone | Par client

Each with sortable columns and export

---

### 2.9 Settings & Administration

**LAYOUT:** Left sidebar nav + content area

**SETTINGS NAV:**
- Profil entreprise
- Utilisateurs & Rôles
- Services & Tarification
- Zones de service
- Horaires
- Notifications
- Intégrations
- Facturation
- Sécurité
- API & Webhooks

**PROFIL ENTREPRISE:**
- Company logo upload
- Business name, address
- Phone, email, website
- Business hours
- Tax numbers (TPS/TVQ)

**UTILISATEURS & RÔLES:**
- User list table
- Invite user button
- Role assignment (Admin, Dispatcher, Viewer)
- Permission matrix

**SERVICES & TARIFICATION:**
- Service type list
- Each: name, description, default price, duration
- Add/edit/delete services
- Price modifiers (urgency, after-hours)

**NOTIFICATIONS:**
- Email notification toggles
- SMS notification toggles
- Push notification settings
- Notification templates editor

**INTÉGRATIONS:**
- Google Calendar sync
- QuickBooks connection
- Stripe setup
- Twilio configuration
- Connected apps list

**SÉCURITÉ:**
- Password policy
- 2FA settings
- Session management
- Audit log

---

## PARTIE 3 — APP TECHNICIEN (Mobile)

**Tous les écrans: 390x844px (iPhone 14 Pro)**

### 3.1 Login & Onboarding

**SPLASH SCREEN:**
- Company logo centered
- Animated flame icon
- Loading indicator

**LOGIN SCREEN:**
- Logo at top
- "Connexion technicien" title
- Phone number input (+1 prefix)
- 4-digit PIN input (hidden dots)
- "Connexion" button
- "Code PIN oublié?" link
- Biometric login option (Face ID / Touch ID icon)

**BIOMETRIC PROMPT:**
- Face ID / Touch ID animation
- "Utiliser Face ID pour vous connecter"
- Fallback to PIN button

**FIRST-TIME SETUP:**

Step 1: "Bienvenue, [Prénom]!"
- Profile photo capture/upload
- Verify phone number

Step 2: "Autorisations requises"
- Location permission (required)
- Camera permission (for photos)
- Notifications permission
- Each with explanation why needed

Step 3: "Prêt à commencer!"
- Quick tutorial slides
- Tips for using the app
- "C'est parti" button

---

### 3.2 Home Screen

**STATUS BAR:**
- Time, signal, battery (system)

**HEADER:**
- "Bonjour, Marc 👋"
- Today's date
- Notification bell with badge
- Settings gear

**STATUS TOGGLE:**
- Big toggle button: "Disponible" ↔ "En pause"
- Green when available, yellow when paused

**STATS ROW (3 cards):**
- Aujourd'hui: 5 travaux
- Complétés: 2 ✓
- À faire: 3

**TODAY'S SCHEDULE:**

Section header: "Mes travaux aujourd'hui"

Job cards (scrollable):

Each card:
- Time slot badge (8:00-10:00)
- Status indicator (color bar left side)
- Client name (bold)
- Address (truncated)
- Service type with icon
- Tap to expand/navigate

Card states:
- Upcoming: Default styling
- Next up: Blue highlight, "PROCHAIN" badge
- In progress: Green pulsing border
- Completed: Faded, checkmark

**EMPTY STATE:**
- Illustration (relaxed technician)
- "Aucun travail prévu"
- "Profitez de votre journée! 😎"

**BOTTOM NAV:**
🏠 Accueil | 🗺️ Carte | 💬 Messages | 👤 Profil

---

### 3.3 Job Detail Screen

**HEADER:**
- Back arrow
- "Travail #1234"
- More menu (...)

**STATUS BANNER:**
- Full width
- Color by status
- Status text: "À venir" / "En route" / "En cours" / "Terminé"
- Time info: "Dans 45 min" or "Commencé il y a 23 min"

**SECTIONS:**

**1. CLIENT INFO CARD:**
- Name (large)
- Phone with call button
- Address with navigate button
- Notes from dispatcher
- Previous visits count

**2. SERVICE DETAILS CARD:**
- Service type with icon
- Description
- Estimated duration
- Equipment info (if any)
- Attached photos from client

**3. TIME SLOT CARD:**
- Date
- Scheduled time
- Travel time estimate
- Weather at job time

**4. INTERNAL NOTES CARD:**
- Notes from dispatcher
- Access code / gate info
- Client preferences

**BOTTOM FIXED ACTIONS:**

Before start:
- "Naviguer" (secondary, opens Maps)
- "Commencer" (primary, large)

During job:
- Timer display
- "Voir checklist" (secondary)
- "Terminer" (primary)

Completed:
- "Voir résumé" button

---

### 3.4 Active Job Flow

**1. EN ROUTE SCREEN:**
- Map showing route
- ETA countdown
- Client info summary
- "J'arrive" button (sends SMS to client)
- "Arrivé" button when close

**2. ARRIVAL CONFIRMATION:**
- "Vous êtes arrivé?"
- Confirm button
- Auto-detect via geofence

**3. ACTIVE JOB SCREEN:**

Header:
- Timer (large, counting up)
- Status: "En cours" badge
- Client name

Checklist section:
☐ Arrivé sur place  
☐ Diagnostic effectué  
☐ Client informé du devis  
☐ Travail effectué  
☐ Test de fonctionnement  
☐ Site nettoyé

Photos section:
- "Photos avant" grid (tap to add)
- "Photos après" grid
- Camera button
- Gallery access

Notes section:
- Expandable textarea
- Voice-to-text button

Materials section:
- Add materials used
- Quantity selector
- Price auto-calculated

Actions:
- "Pause" button (bathroom, lunch)
- "Appeler bureau" quick dial
- "Terminer le travail" primary

**4. PAUSE OVERLAY:**
- Timer paused
- Pause reason selection
- "Reprendre" button

---

### 3.5 Job Completion

**STEP 1: SUMMARY**
- Job duration (total time)
- Checklist completion
- Photos attached count
- Materials list with prices

**STEP 2: MATERIALS & PRICING**
- Line items list
- Add item (search or manual)
- Quantity, unit price, total
- Subtotal, taxes, grand total
- Edit capability

**STEP 3: CLIENT SIGNATURE**
- "Signature du client" header
- Signature pad (full width)
- Clear button
- "Le client approuve les travaux effectués"
- Skip option (if client absent)

**STEP 4: PAYMENT**

Options:
- "Payer maintenant" (Stripe terminal)
- "Envoyer la facture" (email later)
- "Paiement reçu" (cash/check)

If pay now:
- Card reader integration
- Amount confirmation
- Processing animation
- Receipt options

**STEP 5: COMPLETION**
- Confetti animation 🎉
- "Travail terminé!"
- Summary card
- "Voir prochain travail" or "Retour à l'accueil"
- Rating prompt (how was this job?)

---

### 3.6 Messages & Notifications

**MESSAGES SCREEN:**
- Search bar
- Filter tabs: All | Dispatcher | Clients
- Conversation list with:
  • Avatar
  • Name
  • Last message preview
  • Time
  • Unread badge

**CONVERSATION VIEW:**
- Header with contact info
- Messages (sent/received bubbles)
- Text input with send button
- Attachment button (photos, location)
- Quick replies for common responses

**NOTIFICATIONS:**
- List of all notifications
- Group by: Today | Yesterday | Earlier
- Types:
  • New job assigned
  • Schedule change
  • Payment received
  • System alerts
- Tap to navigate to relevant screen
- Mark all as read
- Settings to customize notification preferences

---

## PARTIE 4 — FEATURES INNOVANTES

### 4.1 AI Dispatch Assistant

**TRIGGER:**
- Floating AI button (sparkle icon) on dashboard
- Or "Dispatch IA" button in toolbar
- Keyboard shortcut: ⌘+J

**CHAT INTERFACE:**
- Slide-up panel or modal
- Chat bubbles style
- AI avatar (robot with company colors)

**CAPABILITIES:**

1. **Natural language job creation:**
   "Crée un travail pour débouchage chez Jean Dupont demain matin"
   → AI creates job, shows confirmation

2. **Smart scheduling:**
   "Qui est disponible cet après-midi pour une urgence?"
   → Shows available techs with locations

3. **Route optimization:**
   "Optimise les routes de Marc pour aujourd'hui"
   → Shows before/after with time saved

4. **Analytics queries:**
   "Combien de travaux avons-nous fait ce mois?"
   → Shows stats with chart

5. **Recommendations:**
   "Ce client a un chauffe-eau installé en 2015"
   → Suggests maintenance reminder

**UI ELEMENTS:**
- Typing indicator
- Suggestion chips (quick actions)
- Inline cards (job preview, tech card)
- Action buttons in responses
- Copy response
- Feedback thumbs up/down

---

### 4.2 Voice Commands (Mobile)

**ACTIVATION:**
- Long-press microphone button
- Or shake phone
- "Hey Dispatch" wake word

**VOICE UI:**
- Full screen overlay
- Animated waveform (Siri-style)
- Transcription appearing in real-time
- Cancel X button

**SUPPORTED COMMANDS:**
- "Appelle le client" → Initiates call
- "Envoie ma position" → Shares ETA with client
- "Prends une photo" → Opens camera
- "J'ai terminé" → Starts completion flow
- "Prochain travail" → Shows next job
- "Appelle le bureau" → Calls dispatcher
- "Je suis en pause" → Pauses timer
- "Ajoute une note: [texte]" → Adds note

**FEEDBACK:**
- Visual confirmation of command
- Audio feedback (beep)
- Haptic feedback
- Error handling for unrecognized

---

### 4.3 AR Diagnostic Mode

**CONCEPT:** Use phone camera to identify equipment and get info

**ACCESS:** Button in active job screen "Mode AR 🔍"

**AR VIEW:**
- Camera feed
- Equipment detection overlay
- Bounding boxes around recognized items

**WHEN EQUIPMENT DETECTED:**
- Label overlay: "Chauffe-eau Giant 50 gal"
- Floating info card:
  • Model info
  • Install date (from CRM)
  • Last service
  • Common issues
  • Repair guides link

**VISUAL AIDS:**
- Highlight problem areas
- Show internal diagram overlay
- Part identification

**CAPTURE:**
- Take photo with annotations
- Auto-tag with equipment type
- Add to job photos

**REMOTE ASSIST:**
- Video call with AR annotations
- Senior tech can draw on screen
- Shared view

**EQUIPMENT DATABASE:**
- Common water heaters
- Faucet brands
- Pipe fittings
- Learns from captured photos

---

### 4.4 Predictive Maintenance

**DASHBOARD WIDGET:**

"Entretiens prédictifs" card
- Count: "12 clients à contacter"
- Revenue potential: "$3,600"
- "Voir détails" button

**PREDICTIVE MAINTENANCE PAGE:**

Header:
- Title with AI sparkle icon
- "Basé sur l'historique et l'âge des équipements"

**RECOMMENDATIONS LIST:**

Each item:
- Client name, address
- Equipment: "Chauffe-eau (installé 2018)"
- Predicted issue: "Anode à remplacer"
- Confidence: High/Medium indicator
- Last service date
- Actions: Schedule, Dismiss, Snooze

**FILTERS:**
- Equipment type
- Confidence level
- Time frame (due this month/quarter)
- Revenue potential

**AUTOMATION:**
- Auto-send reminder emails toggle
- Template customization
- Batch schedule option

**ANALYTICS:**
- Conversion rate (reminders → bookings)
- Revenue from predictive
- Equipment lifespan trends

---

### 4.5 Customer Self-Service Portal

**LANDING PAGE:**
- Company hero banner
- "Prendre rendez-vous" CTA
- Services offered (cards)
- Coverage area map
- Testimonials
- Contact info

**BOOKING FLOW:**

**Step 1: Service Selection**
- Service type cards with icons
- Description, price range
- "Urgence 24h" option highlighted

**Step 2: Location**
- Address input with autocomplete
- Verify service area coverage
- Photos upload (optional)
- Problem description

**Step 3: Time Selection**
- Calendar showing available slots
- AM/PM preferences
- First available highlight

**Step 4: Contact Info**
- Name, phone, email
- Preferred contact method
- Create account option

**Step 5: Confirmation**
- Summary review
- Price estimate
- Confirm booking button
- Calendar invite sent

**CUSTOMER DASHBOARD:**
- Upcoming appointments
- Service history
- Invoices & payments
- Equipment registered
- Book new service button

**LIVE TRACKING (appointment day):**
- "Votre technicien arrive"
- Map with tech location
- ETA countdown
- Tech photo and name
- Call/message buttons

---

## PARTIE 5 — WORKFLOWS & USER FLOWS

### 5.1 Job Lifecycle Flow

**STAGES (horizontal flow with branches):**

**1. CRÉATION**
   ↓
├─ Via dispatch (admin creates)  
├─ Via customer portal (client books)  
├─ Via phone (dispatcher enters)  
└─ Via AI assistant (natural language)  
   ↓

**2. PLANIFICATION**
   ↓
├─ Auto-assign (AI dispatch)  
└─ Manual assign (dispatcher chooses)  
   ↓

**3. ASSIGNÉ**
   ↓
   Technicien reçoit notification  
   ↓

**4. CONFIRMÉ**
   ↓
   SMS envoyé au client  
   ↓

**5. JOUR J**
   ↓
├─ Rappel SMS 24h avant  
├─ Rappel SMS 1h avant  
   ↓

**6. EN ROUTE**
   ↓
   Client reçoit ETA  
   ↓

**7. ARRIVÉ**
   ↓
   Géolocalisation confirmée  
   ↓

**8. EN COURS**
   ↓
├─ Checklist  
├─ Photos  
├─ Notes  
├─ Matériaux  
   ↓

**9. TERMINÉ**
   ↓
├─ Signature client  
├─ Paiement  
├─ Facture générée  
   ↓

**10. CLOS**
    ↓
├─ Demande d'avis  
└─ Ajout historique client

**BRANCH PATHS:**
- Annulation (at any stage)
- Report (reschedule)
- Escalation (problème)

---

### 5.2 Emergency Flow

**TRIGGER:**
- "URGENCE" button in dispatch
- Flagged incoming call
- Customer portal urgent option

**EMERGENCY MODAL:**
- Red header "🚨 URGENCE"
- Quick client info entry
- Problem description
- Location

**IMMEDIATE ACTIONS:**

1. Find nearest available tech
   - Map shows all available
   - Distance + ETA for each
   
2. Auto-assign to closest
   - Override current schedule
   - Push notification with alarm sound

3. Tech receives URGENT alert
   - Full screen alert
   - Accept/Decline (with reason)
   - Auto-accept after 30 seconds

4. Client notification
   - "Un technicien arrive en urgence"
   - ETA
   - Tech contact

**SPECIAL UI:**
- Red color scheme throughout
- Pulsing indicators
- Priority badge on all cards
- Timeline shows expedited

**POST-EMERGENCY:**
- Reschedule affected jobs
- Overtime tracking
- Premium pricing applied

---

### 5.3 Rescheduling Flow

**TRIGGERS:**
- Dispatcher reschedules
- Client requests change
- Technician unavailable
- Weather delay

**RESCHEDULE MODAL:**
- Current booking shown
- Reason selection dropdown:
  • Demande client
  • Technicien non disponible
  • Météo
  • Urgence prioritaire
  • Autre

- New date/time picker
  - Show conflicts
  - Suggest alternatives
  
- Technician selection
  - Keep same or reassign
  
- Notify client toggle
  - Preview SMS message

**IMPACT PREVIEW:**
- Show affected jobs
- Cascade changes option
- Route impact

**CONFIRMATION:**
- Summary of changes
- Send notifications
- Update calendar

**CLIENT COMMUNICATION:**
- SMS: "Votre RDV a été reporté à [date]"
- Confirm new time link
- Reschedule self-service link

---

### 5.4 Payment Flow

**ON-SITE PAYMENT (Tech app):**

1. Job completed
2. Amount displayed
3. Payment method selection:
   - Carte (Stripe Terminal)
   - Comptant
   - Chèque
   - Interac
   
**4A. CARD PAYMENT:**
- Connect to terminal
- Insert/Tap card prompt
- Processing animation
- Approved ✓ or Declined ✗
- Receipt options (email, SMS, print)

**4B. CASH:**
- Enter amount received
- Calculate change
- Receipt sent

**4C. INTERAC:**
- Show e-Transfer request
- Waiting for transfer...
- Confirmation

**INVOICE PAYMENT (Customer):**

1. Email with invoice link
2. View invoice page
3. "Payer maintenant" button
4. Stripe checkout:
   - Card details
   - Save for future toggle
5. Confirmation page
6. Receipt email

**PARTIAL PAYMENT:**
- Enter amount
- Remaining balance shown
- Payment plan option

**REFUND FLOW:**
- Find original transaction
- Refund amount (full/partial)
- Reason required
- Approval for large amounts
- Process refund
- Notify customer

---

## 📊 RÉCAPITULATIF

**Company:** Plomberie D'Experts  
**Project:** Enterprise Dispatch Platform  
**Design System:** Complete  
**Components:** 50+  
**Pages:** 35+  
**Features:** AI-powered, Real-time GPS, Mobile-first  

**SynergAir × Plomberie D'Experts**  
**Décembre 2025**

— **Fin du Document** —
