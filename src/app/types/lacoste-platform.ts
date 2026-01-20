/**
 * 🏗️ SYNERGAIR x GROUPE G. LAFRANCE - CORE TYPE DEFINITIONS
 * Unified Multi-Trade Construction Platform - Joint Venture
 * 
 * Property-Centric Data Model for 8 Divisions
 * 
 * @fileoverview Core TypeScript interfaces for the joint venture platform
 * @version 2.0.0
 * @date January 16, 2026
 */

// ============================================================================
// DIVISION TYPES
// ============================================================================

export type DivisionType =
  | 'plomberie'        // Plomberie Michaël Lacoste
  | 'construction'     // GAB Lafrance Construction
  | 'toitures'         // Les Toitures Jonathan Isabel
  | 'isolation'        // Isolation Mike Turmel
  | 'conteneurs'       // Conteneurs Mira
  | 'gutters'          // Gouttières et Revêtements Alex Roussin
  | 'decks'            // Patio Terrasse Francis Girard
  | 'real-estate';     // Maison Cash

export interface Division {
  id: DivisionType;
  name: string;
  nameFr: string;
  rrbqLicense?: string;
  ccqCertificate?: string;
  active: boolean;
  primaryContact: string;
  emergencyPhone?: string;
  serviceArea: string[]; // Postal code prefixes
}

// ============================================================================
// PROPERTY (Core Entity - Everything revolves around properties)
// ============================================================================

export interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  unit?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export type PropertyType = 'residential' | 'commercial' | 'industrial';

export interface Property {
  id: string;
  address: Address;
  propertyType: PropertyType;
  
  // Property Details
  yearBuilt?: number;
  squareFeet?: number;
  stories?: number;
  bedrooms?: number;
  bathrooms?: number;
  lotSize?: number;
  
  // Quebec/Montreal Specific
  heritageDesignation: boolean; // Montreal patrimony zones
  arrondissement?: string;
  municipalTaxAccount?: string;
  
  // Equipment Inventory (Multi-Division)
  equipment: EquipmentItem[];
  
  // Service History (All Divisions)
  serviceHistory: ServiceRecord[];
  
  // Permits & Compliance
  permits: Permit[];
  inspections: Inspection[];
  
  // Ownership & Contacts
  currentOwner?: Contact;
  propertyManager?: Contact;
  tenants: Contact[];
  
  // Financial
  accountBalance: number;
  paymentMethod?: PaymentMethod;
  
  // Metadata
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastServiceDate?: Date;
  nextScheduledService?: Date;
}

// ============================================================================
// EQUIPMENT TRACKING (Multi-Division)
// ============================================================================

export type EquipmentCategory =
  // Plumbing
  | 'water-heater'
  | 'fixture'
  | 'pipe-system'
  | 'backflow-preventer'
  | 'sump-pump'
  // Roofing
  | 'roof-system'
  | 'flashing'
  | 'ventilation'
  // Insulation
  | 'attic-insulation'
  | 'wall-insulation'
  | 'basement-insulation'
  // HVAC (coordination)
  | 'furnace'
  | 'air-conditioner'
  // Gutters
  | 'gutter-system'
  | 'downspouts'
  // Decks
  | 'deck-structure'
  | 'railing-system'
  // Other
  | 'other';

export type EquipmentCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'failed';
export type MaintenanceSchedule = 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'as-needed';

export interface EquipmentItem {
  id: string;
  propertyId: string;
  division: DivisionType;
  category: EquipmentCategory;
  
  // Equipment Details
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  installDate?: Date;
  warrantyExpires?: Date;
  expectedLifespan?: number; // years
  
  // Specifications
  specifications?: Record<string, any>; // Flexible for different equipment types
  
  // Maintenance
  lastServiceDate?: Date;
  nextServiceDue?: Date;
  maintenanceSchedule: MaintenanceSchedule;
  maintenanceHistory: MaintenanceRecord[];
  
  // Status
  condition: EquipmentCondition;
  requiresAttention: boolean;
  notes?: string;
  
  // Photos
  photos: Photo[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  serviceRecordId?: string; // Links to job
  date: Date;
  type: 'inspection' | 'service' | 'repair' | 'replacement';
  description: string;
  technicianId: string;
  technicianName: string;
  cost?: number;
  notes?: string;
}

// ============================================================================
// SERVICE RECORDS (Multi-Division Job Tracking)
// ============================================================================

export type JobStatus = 
  | 'quote-requested'
  | 'quote-sent'
  | 'quote-accepted'
  | 'scheduled'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'on-hold';

export type UrgencyLevel = 'emergency' | 'urgent' | 'standard' | 'scheduled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';

export interface ServiceRecord {
  id: string;
  jobNumber: string; // Format: DIV-YYYYMMDD-XXXX
  propertyId: string;
  division: DivisionType;
  serviceType: string;
  
  // Job Details
  status: JobStatus;
  urgency: UrgencyLevel;
  description: string;
  
  // Personnel
  technicianId?: string;
  technicianName?: string;
  assistants?: string[]; // Additional technician IDs
  
  // Work Performed
  workDescription?: string;
  partsUsed: Part[];
  laborHours?: number;
  
  // Financial
  estimatedAmount?: number;
  totalAmount?: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  invoiceId?: string;
  
  // Cross-Referrals
  generatedReferrals: CrossReferral[]; // Opportunities found during this job
  originatingReferral?: string; // If this job came from a cross-referral
  
  // Documentation
  photos: Photo[];
  documents: Document[];
  beforePhotos?: Photo[];
  afterPhotos?: Photo[];
  
  // Compliance (Quebec-specific)
  permitRequired: boolean;
  permitNumber?: string;
  permitCost?: number;
  inspectionRequired: boolean;
  inspectionPassed?: boolean;
  rrbqDeclaration?: boolean; // Required for plumbing
  
  // Scheduling
  requestedDate: Date;
  scheduledDate?: Date;
  scheduledTimeSlot?: string; // 'morning' | 'afternoon' | 'evening'
  arrivalWindowStart?: Date;
  arrivalWindowEnd?: Date;
  startedAt?: Date;
  completedDate?: Date;
  
  // Warranty
  warrantyPeriod?: number; // months
  warrantyExpires?: Date;
  
  // Customer Communication
  customerNotes?: string;
  internalNotes?: string;
  technicianNotes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

export interface Part {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  supplier?: string;
}

// ============================================================================
// CROSS-REFERRAL SYSTEM (Revenue Multiplier)
// ============================================================================

export type ReferralStatus =
  | 'captured'     // Technician captured opportunity
  | 'scored'       // ML scored the lead
  | 'contacted'    // Customer contacted
  | 'quoted'       // Quote generated
  | 'won'          // Job closed
  | 'lost'         // Opportunity lost
  | 'cancelled';   // Customer not interested

export type ReferralPriority = 'low' | 'standard' | 'high';

export interface CrossReferral {
  id: string;
  propertyId: string;
  
  // Origin (Where the opportunity was found)
  originDivision: DivisionType;
  originTechnicianId: string;
  originTechnicianName: string;
  originJobId: string;
  originJobNumber: string;
  
  // Opportunity
  targetDivision: DivisionType;
  serviceType: string;
  description: string;
  severityRating: 1 | 2 | 3 | 4 | 5; // Technician assessment
  photos: Photo[];
  voiceNote?: string; // Audio file URL
  voiceTranscription?: string; // AI transcription
  
  // ML Scoring (0-100)
  mlScore?: number;
  scoringFactors?: {
    severity: number;
    propertyAge: number;
    customerLTV: number;
    seasonalRelevance: number;
    timeSinceLastService: number;
    customerResponsiveness: number;
  };
  
  // Workflow
  status: ReferralStatus;
  priority: ReferralPriority;
  assignedTo?: string; // Sales rep ID
  contactAttempts: ContactAttempt[];
  
  // Financial
  estimatedValue?: number;
  actualValue?: number; // If converted
  finderFee: number; // Paid to originating technician
  paidToTechnician: boolean;
  commissionPaidDate?: Date;
  
  // Division P&L Attribution
  closingDivisionRevenue?: number; // 70%
  referringDivisionCredit?: number; // 30%
  
  // Dates
  capturedDate: Date;
  scoredDate?: Date;
  contactedDate?: Date;
  quotedDate?: Date;
  closedDate?: Date;
  lostReason?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactAttempt {
  id: string;
  referralId: string;
  date: Date;
  method: 'phone' | 'email' | 'sms' | 'in-person';
  contactedBy: string;
  result: 'connected' | 'voicemail' | 'no-answer' | 'email-sent' | 'sms-sent';
  notes?: string;
  nextFollowUp?: Date;
}

// ============================================================================
// CUSTOMER CONTACTS (Many-to-Many with Properties)
// ============================================================================

export type CustomerType = 
  | 'homeowner'
  | 'tenant'
  | 'property-manager'
  | 'contractor'
  | 'realtor'
  | 'commercial-owner';

export type LoyaltyTier = 'member' | 'silver' | 'gold' | 'platinum';
export type Language = 'fr' | 'en';
export type PreferredContactMethod = 'phone' | 'email' | 'sms';

export interface Contact {
  id: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  phoneSecondary?: string;
  preferredLanguage: Language;
  
  // Relationships to Properties
  ownedProperties: string[]; // Property IDs
  managedProperties: string[]; // For property managers
  tenantOf?: string; // Property ID if tenant
  
  // Customer Profile
  customerType: CustomerType;
  customerSince: Date;
  
  // Loyalty Program
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  annualSpending: number;
  lifetimeValue: number;
  
  // Communication Preferences
  marketingOptIn: boolean;
  smsOptIn: boolean;
  emailOptIn: boolean;
  preferredContactMethod: PreferredContactMethod;
  
  // Behavioral Metrics
  avgResponseTime?: number; // hours
  cancellationRate?: number; // 0-1
  onTimePaymentRate?: number; // 0-1
  referralsMade?: number;
  
  // Account
  accountBalance: number;
  paymentMethods: PaymentMethod[];
  billingAddress?: Address;
  
  // Portal Access
  portalEmail?: string;
  portalPasswordHash?: string;
  portalEmailVerified: boolean;
  lastLogin?: Date;
  twoFactorEnabled: boolean;
  
  // Notes & Tags
  notes?: string;
  tags?: string[];
  alerts?: string[]; // Important notices (e.g., "Requires payment upfront")
  
  // Metadata
  source?: string; // How they found us
  referredBy?: string; // Contact ID of referrer
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit-card' | 'bank-account' | 'cash' | 'check' | 'financing';
  isDefault: boolean;
  
  // Card details (tokenized)
  cardToken?: string;
  cardLast4?: string;
  cardBrand?: string;
  cardExpiry?: string;
  
  // Bank details (tokenized)
  bankToken?: string;
  bankLast4?: string;
  bankName?: string;
  
  // Financing
  financingProvider?: string; // e.g., "Financeit"
  financingAccount?: string;
  
  // Metadata
  createdAt: Date;
}

// ============================================================================
// PERMITS & INSPECTIONS (Quebec Compliance)
// ============================================================================

export type PermitStatus = 'not-required' | 'required' | 'applied' | 'approved' | 'denied' | 'expired';
export type InspectionStatus = 'not-required' | 'required' | 'scheduled' | 'passed' | 'failed' | 'pending-reinspection';

export interface Permit {
  id: string;
  propertyId: string;
  serviceRecordId?: string;
  division: DivisionType;
  
  // Permit Details
  permitType: string; // e.g., "Montreal Building Permit", "Heritage Approval"
  permitNumber?: string;
  status: PermitStatus;
  
  // Municipal Info
  municipality: string;
  department?: string;
  
  // Financial
  estimatedCost: number;
  actualCost?: number;
  
  // Timeline
  requiredDate: Date;
  applicationDate?: Date;
  approvalDate?: Date;
  expiryDate?: Date;
  processingTime?: string; // "5-10 business days"
  
  // Documents
  applicationDocuments: Document[];
  approvalDocuments: Document[];
  
  // Notes
  notes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface Inspection {
  id: string;
  propertyId: string;
  serviceRecordId?: string;
  permitId?: string;
  division: DivisionType;
  
  // Inspection Details
  inspectionType: string; // e.g., "Building Inspection", "AIBQ Pre-Purchase"
  status: InspectionStatus;
  
  // Inspector
  inspectorName?: string;
  inspectorCompany?: string;
  inspectorLicense?: string;
  
  // Scheduling
  scheduledDate?: Date;
  completedDate?: Date;
  
  // Results
  passed?: boolean;
  findings?: string[];
  recommendations?: string[];
  
  // Documents
  report?: Document;
  photos: Photo[];
  
  // Follow-up
  reinspectionRequired: boolean;
  reinspectionDate?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// DOCUMENTS & PHOTOS
// ============================================================================

export type DocumentType = 
  | 'invoice'
  | 'quote'
  | 'contract'
  | 'warranty'
  | 'permit'
  | 'inspection-report'
  | 'insurance-cert'
  | 'license'
  | 'other';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string; // Cloud storage URL
  mimeType: string;
  size: number; // bytes
  
  // Associations
  propertyId?: string;
  serviceRecordId?: string;
  contactId?: string;
  
  // Metadata
  uploadedBy: string;
  uploadedAt: Date;
  tags?: string[];
}

export interface Photo {
  id: string;
  url: string; // Cloud storage URL
  thumbnailUrl?: string;
  caption?: string;
  
  // Associations
  propertyId?: string;
  serviceRecordId?: string;
  equipmentId?: string;
  crossReferralId?: string;
  
  // Photo Metadata
  width?: number;
  height?: number;
  size: number; // bytes
  mimeType: string;
  
  // Location
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Upload Info
  uploadedBy: string;
  uploadedAt: Date;
  tags?: string[];
}

// ============================================================================
// LOYALTY PROGRAM
// ============================================================================

export type PointsTransactionType = 
  | 'earned-service'
  | 'earned-referral'
  | 'earned-review'
  | 'earned-bonus'
  | 'redeemed-discount'
  | 'redeemed-service'
  | 'expired'
  | 'adjusted';

export interface PointsTransaction {
  id: string;
  contactId: string;
  type: PointsTransactionType;
  points: number; // Positive for earned, negative for redeemed
  
  // Association
  serviceRecordId?: string;
  orderId?: string;
  
  // Description
  description: string;
  
  // Metadata
  createdAt: Date;
  expiresAt?: Date;
}

export interface LoyaltyBenefit {
  tier: LoyaltyTier;
  benefit: string;
  value: string;
  active: boolean;
}

// ============================================================================
// MULTI-TRADE PROJECTS (Coordinated Work)
// ============================================================================

export interface MultiTradeProject {
  id: string;
  projectNumber: string; // Format: PROJ-YYYYMMDD-XXXX
  name: string;
  propertyId: string;
  
  // Component Jobs (Multiple Divisions)
  jobs: ServiceRecord[];
  
  // Trade Sequencing
  dependencies: ProjectDependency[];
  
  // Timeline
  estimatedStartDate: Date;
  estimatedCompletionDate: Date;
  actualStartDate?: Date;
  actualCompletionDate?: Date;
  
  // Project Management
  projectManager: Contact;
  singlePointOfContact: boolean;
  
  // Financial
  totalEstimatedValue: number;
  totalActualValue?: number;
  billingType: 'combined' | 'per-division';
  paymentTerms: 'upfront' | 'milestone' | 'completion' | 'deferred';
  
  // Status
  status: 'planning' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectDependency {
  id: string;
  projectId: string;
  jobId: string; // The job that must be completed
  dependentJobId: string; // The job that depends on it
  reason: string; // e.g., "Roofing must complete before gutters"
  criticalPath: boolean;
}

// ============================================================================
// ROUTE OPTIMIZATION (Multi-Division Dispatching)
// ============================================================================

export interface RouteStop {
  id: string;
  serviceRecordId: string;
  propertyId: string;
  address: Address;
  
  // Time Window
  earliestArrival: Date;
  latestArrival: Date;
  estimatedDuration: number; // minutes
  
  // Requirements
  requiredSkills: string[]; // CCQ certifications
  requiredTools: string[];
  priority: number; // 1-5
}

export interface OptimizedRoute {
  id: string;
  date: Date;
  division: DivisionType;
  technicianId: string;
  technicianName: string;
  
  // Route
  stops: RouteStop[];
  totalDistance: number; // km
  totalDuration: number; // minutes
  
  // Vehicle
  vehicleId?: string;
  startDepot: Address;
  endDepot: Address;
  
  // Performance
  estimatedFuelCost: number;
  trafficDelay?: number; // minutes
  
  // Status
  status: 'planned' | 'in-progress' | 'completed';
  
  // Metadata
  generatedAt: Date;
  generatedBy: string; // 'ai' | 'manual'
}

// ============================================================================
// IOT SENSORS (Container Division)
// ============================================================================

export type SensorType = 'fill-level' | 'gps-tracker' | 'temperature' | 'door-open';

export interface IoTSensor {
  id: string;
  deviceId: string; // Physical device ID
  type: SensorType;
  
  // Asset Association
  containerId?: string; // For Conteneurs Mira division
  equipmentId?: string; // For other equipment
  
  // Device Info
  manufacturer: string;
  model: string;
  firmwareVersion: string;
  batteryLevel?: number; // 0-100%
  
  // Connectivity
  connectionType: 'LoRaWAN' | 'cellular' | 'wifi';
  lastHeartbeat: Date;
  online: boolean;
  
  // Sensor Data
  currentReading?: any;
  lastReadingDate?: Date;
  alertThreshold?: any;
  
  // Alerts
  alertsEnabled: boolean;
  alertRecipients: string[]; // Email addresses or phone numbers
  
  // Metadata
  installedDate: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  timestamp: Date;
  value: any; // Type depends on sensor (number for fill-level, coordinates for GPS, etc.)
  unit?: string;
  
  // Alerts
  alertTriggered: boolean;
  alertMessage?: string;
}

// ============================================================================
// REAL ESTATE (Maison Cash Division)
// ============================================================================

export interface RealEstateTransaction {
  id: string;
  propertyId: string;
  transactionType: 'purchase' | 'sale' | 'pre-listing-reno';
  
  // OACIQ Compliance
  brokerId: string;
  brokerName: string;
  oaciqLicense: string;
  
  // Parties
  buyer?: Contact;
  seller?: Contact;
  
  // Financial
  listPrice?: number;
  salePrice?: number;
  renovationBudget?: number;
  expectedROI?: number; // 0-1.5 (1:1 to 1:1.5 renovation-to-value ratio)
  
  // Renovation Package
  renovationServices: ServiceRecord[]; // Multi-division work
  contractorOptions: Contact[]; // 3+ required by OACIQ
  referralDisclosureSigned: boolean;
  
  // Deferred Payment
  paymentDeferredToClosing: boolean;
  closingDate?: Date;
  paymentReleased: boolean;
  
  // Inspection
  inspectionReport?: Document;
  inspectionDate?: Date;
  inspectorCompany?: string;
  
  // Status
  status: 'listing' | 'under-contract' | 'renovating' | 'sold' | 'cancelled';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// WEATHER INTEGRATION (Storm Response)
// ============================================================================

export type WeatherEventType = 'heavy-rain' | 'high-wind' | 'hail' | 'ice-storm' | 'freeze';
export type SeverityLevel = 'watch' | 'warning' | 'severe';

export interface WeatherAlert {
  id: string;
  eventType: WeatherEventType;
  severity: SeverityLevel;
  
  // Location
  affectedAreas: string[]; // Postal code prefixes
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  radius?: number; // km
  
  // Timing
  issuedAt: Date;
  effectiveFrom: Date;
  effectiveUntil: Date;
  
  // Description
  description: string;
  recommendations?: string[];
  
  // Response
  responseTriggered: boolean;
  affectedDivisions: DivisionType[];
  propertiesContacted?: number;
  leadsGenerated?: number;
  
  // Metadata
  source: string; // Weather API provider
  sourceId: string;
}

export interface StormResponse {
  id: string;
  weatherAlertId: string;
  division: DivisionType;
  
  // Target Properties
  affectedProperties: string[]; // Property IDs in affected areas
  
  // Outreach
  outreachType: 'sms' | 'email' | 'phone' | 'multi-channel';
  messageTemplate: string;
  sentAt: Date;
  
  // Results
  messagesSent: number;
  responses: number;
  inspectionsScheduled: number;
  jobsBooked: number;
  revenue?: number;
  
  // Metadata
  createdAt: Date;
  createdBy: string;
}

// ============================================================================
// EXPORTS
// ============================================================================

export interface LacosteGroupPlatform {
  divisions: Division[];
  properties: Property[];
  contacts: Contact[];
  serviceRecords: ServiceRecord[];
  crossReferrals: CrossReferral[];
  multiTradeProjects: MultiTradeProject[];
  equipment: EquipmentItem[];
  permits: Permit[];
  inspections: Inspection[];
  iotSensors: IoTSensor[];
  realEstateTransactions: RealEstateTransaction[];
  weatherAlerts: WeatherAlert[];
}