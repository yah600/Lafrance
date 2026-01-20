/**
 * Quebec Regulatory Compliance Types
 * CMMTQ, RBQ, BSDQ, and Civil Code Requirements
 */

// 1. License and Credential Management
export interface TechnicianLicense {
  rbqLicenseNumber: string;
  rbqLicenseExpiry: string;
  rbqLicenseStatus: 'active' | 'expired' | 'suspended' | 'pending';
  rbqSubclasses: string[]; // e.g., "15.1", "15.2"
  cmmtqMembershipId: string;
  cmmtqMembershipExpiry: string;
  cmmtqMembershipStatus: 'active' | 'expired' | 'pending';
  cmmtqMemberType: 'compagnon' | 'maitre' | 'apprenti';
  lastVerificationDate: string;
  verifiedBy?: string;
}

export interface LicenseBadge {
  type: 'rbq' | 'cmmtq';
  status: 'verified' | 'expired' | 'missing' | 'pending';
  displayText: string;
  expiryDate?: string;
}

// 2. Certified Materials
export interface CertifiedMaterial {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  certificationBody: 'CSA' | 'ULC' | 'Intertek' | 'autre';
  certificationNumber: string;
  isCertified: boolean;
  lastVerified: string;
}

export interface MaterialUsage {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  isCertified: boolean;
  certificationNumber?: string;
  warningIssued: boolean;
  addedAt: string;
  addedBy: string;
}

// 3. Pre-Work Quotation
export interface DetailedQuote {
  id: string;
  jobId?: string;
  clientId: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'modified' | 'expired';
  
  // Quote breakdown
  services: QuoteServiceItem[];
  labor: QuoteLaborItem[];
  materials: QuoteMaterialItem[];
  
  // Totals
  subtotal: number;
  tps: number; // 5%
  tvq: number; // 9.975%
  total: number;
  
  // Validity
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  
  // Client consent
  clientConsent?: ClientConsent;
  
  // Modifications
  modifications: QuoteModification[];
}

export interface QuoteServiceItem {
  description: string;
  estimatedDuration: number; // in hours
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface QuoteLaborItem {
  technicianType: 'compagnon' | 'maitre' | 'apprenti';
  hours: number;
  hourlyRate: number;
  total: number;
}

export interface QuoteMaterialItem {
  materialId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  isCertified: boolean;
}

export interface ClientConsent {
  consentGiven: boolean;
  consentType: 'signature' | 'checkbox' | 'verbal';
  signatureData?: string; // Base64 image for digital signature
  consentedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface QuoteModification {
  id: string;
  modifiedAt: string;
  modifiedBy: string;
  reason: string;
  changeDescription: string;
  previousTotal: number;
  newTotal: number;
  clientNotified: boolean;
  clientApproved?: boolean;
  clientApprovedAt?: string;
}

// 4. Safety and Quality Control Checklists
export interface ChecklistTemplate {
  id: string;
  name: string;
  jobType: string; // 'chauffe-eau', 'debouchage', etc.
  items: ChecklistItem[];
  requiresPhotos: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ChecklistItem {
  id: string;
  description: string;
  category: 'safety' | 'quality' | 'regulatory' | 'cleanup';
  isMandatory: boolean;
  requiresPhoto: boolean;
  requiresNote: boolean;
}

export interface CompletedChecklist {
  id: string;
  jobId: string;
  templateId: string;
  technicianId: string;
  items: CompletedChecklistItem[];
  completedAt: string;
  signedOffBy: string;
  overallStatus: 'complete' | 'incomplete' | 'partial';
}

export interface CompletedChecklistItem {
  checklistItemId: string;
  completed: boolean;
  note?: string;
  photoUrls: string[];
  completedAt?: string;
  skippedReason?: string;
}

// 5. Complaint and Incident Reporting
export interface IncidentReport {
  id: string;
  referenceNumber: string;
  reportedBy: string; // technician or admin ID
  reportedAt: string;
  
  // Incident details
  incidentType: 'produit-non-certifie' | 'pratique-illegale' | 'non-conformite' | 'securite' | 'autre';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  address: string;
  
  // Evidence
  photoUrls: string[];
  documentUrls: string[];
  
  // Regulatory submission
  forwardedToRBQ: boolean;
  forwardedToCMMTQ: boolean;
  forwardedAt?: string;
  submissionReferenceRBQ?: string;
  submissionReferenceCMMTQ?: string;
  
  // Privacy
  isConfidential: boolean;
  
  // Status tracking
  status: 'submitted' | 'under-review' | 'resolved' | 'escalated' | 'closed';
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

// 6. Document Identification
export interface CompanyLegalInfo {
  cmmtqLogoUrl: string;
  rbqLogoUrl: string;
  rbqLicenseNumber: string;
  cmmtqMembershipNumber: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  autoInsertOnDocuments: boolean;
}

export interface DocumentTemplate {
  id: string;
  type: 'invoice' | 'quote' | 'contract' | 'completion-certificate';
  headerHtml: string;
  footerHtml: string;
  includesCMMTQLogo: boolean;
  includesRBQLicense: boolean;
  isLegallyCompliant: boolean;
  lastValidated: string;
}

// 7. Legal Warranty Management
export interface Warranty {
  id: string;
  jobId: string;
  clientId: string;
  
  // Warranty periods
  laborWarrantyStartDate: string;
  laborWarrantyEndDate: string; // +1 year
  structuralWarrantyStartDate: string;
  structuralWarrantyEndDate: string; // +5 years
  
  // Coverage details
  coverageDescription: string;
  exclusions: string[];
  
  // Status
  status: 'active' | 'expired' | 'claimed' | 'void';
  
  // Warranty claims
  claims: WarrantyClaim[];
}

export interface WarrantyClaim {
  id: string;
  warrantyId: string;
  claimDate: string;
  claimType: 'labor' | 'structural';
  description: string;
  photoUrls: string[];
  assignedTechnicianId?: string;
  status: 'submitted' | 'approved' | 'denied' | 'in-progress' | 'completed';
  resolution?: string;
  completedAt?: string;
  noChargeConfirmed: boolean;
}

// 8. Education and Formation Tracking
export interface ContinuingEducation {
  technicianId: string;
  periodStart: string; // 2-year period start
  periodEnd: string;   // 2-year period end
  requiredHours: number; // 16, 24, or 32 based on certification
  completedHours: number;
  courses: EducationCourse[];
  status: 'on-track' | 'at-risk' | 'overdue' | 'completed';
  nextDeadline: string;
}

export interface EducationCourse {
  id: string;
  title: string;
  provider: string;
  hours: number;
  completedDate: string;
  certificateUrl?: string;
  cmmtqApproved: boolean;
  category: string;
}

export interface EducationNotification {
  technicianId: string;
  type: '90-day' | '60-day' | '30-day' | 'overdue';
  sentAt: string;
  dueDate: string;
  hoursRemaining: number;
}

// 9. Formal Notice and Recourse
export interface CollectionEscalation {
  id: string;
  invoiceId: string;
  clientId: string;
  
  currentStage: 'none' | 'reminder-1' | 'reminder-2' | 'mise-en-demeure' | 'legal';
  
  stages: EscalationStage[];
  
  taggedForLegal: boolean;
  legalReferenceNumber?: string;
}

export interface EscalationStage {
  stage: 'reminder-1' | 'reminder-2' | 'mise-en-demeure' | 'legal';
  sentAt: string;
  sentBy: string;
  method: 'email' | 'mail' | 'registered-mail';
  documentUrl: string;
  deadline?: string;
  responseReceived: boolean;
  responseDate?: string;
}

export interface MiseEnDemeureTemplate {
  recipientName: string;
  recipientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  amountDue: number;
  daysOverdue: number;
  paymentDeadline: string; // Usually 10 days from notice
  interestRate: number;
  legalFees: number;
  companyName: string;
  companyAddress: string;
  companyRepresentative: string;
}

// 10. BSDQ Compliance
export interface BSDQCompliance {
  jobId: string;
  quoteId: string;
  
  // Trigger conditions
  estimatedValue: number;
  hasMultipleSubcontractors: boolean;
  isBidSituation: boolean;
  
  // Compliance check
  requiresBSDQSubmission: boolean;
  bsdqSubmitted: boolean;
  bsdqSubmissionDate?: string;
  bsdqReferenceNumber?: string;
  
  // TES Platform link
  tesUrl: string;
  instructions: string;
  
  // Export restriction
  fullQuoteExportAllowed: boolean;
  blockReason?: string;
}

// 11. Completion Certificate
export interface CompletionCertificate {
  id: string;
  jobId: string;
  
  // Parties
  clientName: string;
  clientAddress: string;
  technicianName: string;
  technicianLicense: string;
  
  // Work details
  workDescription: string;
  materialsUsed: MaterialUsage[];
  checklistId: string;
  
  // Photos
  beforePhotoUrls: string[];
  afterPhotoUrls: string[];
  
  // Signatures
  technicianSignature: string; // Base64
  technicianSignedAt: string;
  clientSignature: string; // Base64
  clientSignedAt: string;
  
  // Certificate metadata
  certificateNumber: string;
  issuedAt: string;
  pdfUrl: string;
  
  // Warranty activation
  warrantyActivated: boolean;
  warrantyId?: string;
}

// 12. Public Profile Compliance
export interface PublicComplianceProfile {
  companyId: string;
  
  // Badges
  cmmtqMemberBadge: boolean;
  rbqLicenseDisplayed: boolean;
  
  // License info
  rbqLicenseNumber: string;
  cmmtqMembershipNumber: string;
  
  // Verification links
  cmmtqVerificationUrl: string;
  rbqVerificationUrl: string;
  
  // Publication status
  canPublish: boolean;
  missingData: string[];
  lastVerified: string;
}

// Helper types
export type ComplianceModule = 
  | 'license-verification'
  | 'certified-materials'
  | 'pre-work-quotation'
  | 'safety-checklists'
  | 'incident-reporting'
  | 'document-identification'
  | 'warranty-management'
  | 'education-tracking'
  | 'collection-workflow'
  | 'bsdq-compliance'
  | 'completion-certificate'
  | 'public-compliance';

export interface ComplianceAlert {
  id: string;
  module: ComplianceModule;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: string;
  dismissible: boolean;
  dismissed: boolean;
}
