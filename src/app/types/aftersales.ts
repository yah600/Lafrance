/**
 * After-Sales Service Types for GROUPE LAFRANCE APP
 *
 * Manages post-service warranty claims and interventions
 * - Automatic 25% payment hold on warranty claims
 * - Urgent/Important/Aesthetic priority levels
 * - Automatic alerts and escalation
 */

export enum AfterSalesStatus {
  REPORTED = 'reported', // Client reported issue
  ACKNOWLEDGED = 'acknowledged', // Plumber acknowledged
  IN_PROGRESS = 'in_progress', // Fixing in progress
  RESOLVED = 'resolved', // Issue resolved
  ESCALATED = 'escalated', // No response, internal takeover
  CLOSED = 'closed', // Case closed
}

export enum AfterSalesPriority {
  URGENT = 'urgent', // Water leak/flood - 1 hour response
  IMPORTANT = 'important', // Function broken - 48 hours response
  AESTHETIC = 'aesthetic', // Cosmetic issue - 7 days response
}

export enum AfterSalesClaimType {
  WARRANTY = 'warranty', // Manufacturing defect or work-related problem
  DAMAGE = 'damage', // Damage caused during work
  DISSATISFACTION = 'dissatisfaction', // Quality or result unsatisfactory
}

export interface AfterSalesCase {
  id: string;
  originalJobId: string;
  clientId: string;
  plumberId: string;
  invoiceId: string;

  // Issue details
  title: string;
  description: string;
  priority: AfterSalesPriority;
  photos: string[];
  reportedAt: Date;

  // Status
  status: AfterSalesStatus;
  resolvedAt: Date | null;
  escalatedAt: Date | null;

  // Response times
  plumberResponseDeadline: Date;
  plumberRespondedAt: Date | null;
  resolutionDeadline: Date;

  // Payment hold
  holdAmount: number; // 25% of original job or all future 25% payments
  holdApplied: boolean;
  holdReleasedAt: Date | null;

  // Intervention
  interventionScheduled: boolean;
  interventionDate: Date | null;
  interventionTimeSlot: TimeSlot | null;
  interventionCompleted: boolean;

  // Damages
  hasDamages: boolean;
  damageAmount: number | null;
  damageResolution: DamageResolution | null;

  // Internal handling
  internallyHandled: boolean;
  internalHandlerName: string | null;
  replacementPlumberId: string | null;

  // Notes and communication
  notes: AfterSalesNote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export enum DamageResolution {
  DIRECT_PAYMENT = 'direct_payment', // Plumber pays directly
  INSURANCE_CLAIM = 'insurance_claim', // Insurance handles
  BID_TO_OTHERS = 'bid_to_others', // New job for repairs
}

export interface AfterSalesNote {
  id: string;
  caseId: string;
  authorId: string;
  authorName: string;
  authorRole: 'client' | 'plumber' | 'internal';
  message: string;
  photos: string[];
  createdAt: Date;
}

export interface AfterSalesAlert {
  id: string;
  caseId: string;
  type: AlertType;
  message: string;
  recipientIds: string[]; // Internal staff to notify
  triggeredAt: Date;
  acknowledgedAt: Date | null;
  acknowledgedBy: string | null;
}

export enum AlertType {
  URGENT_NO_RESPONSE = 'urgent_no_response', // Urgent case, no plumber response in 5 min
  DEADLINE_APPROACHING = 'deadline_approaching', // Response deadline in 4 hours
  DEADLINE_MISSED = 'deadline_missed', // Plumber missed deadline
  ESCALATION_REQUIRED = 'escalation_required', // Case needs internal handling
}

export interface PaymentHold {
  id: string;
  caseId: string;
  plumberId: string;
  amount: number;
  appliedAt: Date;
  releasedAt: Date | null;
  reason: string;

  // Credit note
  creditNoteIssued: boolean;
  creditNoteId: string | null;
  creditNoteAmount: number | null;
}

export interface CreditNote {
  id: string;
  invoiceId: string;
  plumberId: string;
  amount: number;
  reason: string;
  relatedCaseId: string;
  issuedAt: Date;
  appliedToInvoiceIds: string[]; // Future invoices this was deducted from
}

// After-sales rules and SLAs
export const AFTERSALES_RULES = {
  [AfterSalesPriority.URGENT]: {
    responseTimeMinutes: 60,
    resolutionTimeHours: 4,
    internalInterventionMinutes: 5, // If no plumber response
    description: 'Fuite ou infiltration d\'eau importante',
  },
  [AfterSalesPriority.IMPORTANT]: {
    responseTimeMinutes: 2880, // 48 hours
    resolutionTimeHours: 48,
    internalInterventionMinutes: 60,
    description: 'Problème fonctionnel important',
  },
  [AfterSalesPriority.AESTHETIC]: {
    responseTimeMinutes: 10080, // 7 days
    resolutionTimeHours: 168, // 7 days
    internalInterventionMinutes: 1440, // 24 hours
    description: 'Problème esthétique ou mineur',
  },
  PAYMENT_HOLD: {
    holdPercentage: 25,
    minimumHoldAmount: 50, // Minimum $50 CAD hold
    maximumHoldAmount: 5000, // Maximum $5000 CAD hold
    releaseAfterResolution: true,
  },
};

export interface AfterSalesAnalytics {
  plumberId: string;

  // Case statistics
  totalCases: number;
  urgentCases: number;
  importantCases: number;
  aestheticCases: number;

  // Response performance
  averageResponseTime: number; // minutes
  missedDeadlines: number;
  onTimeResponses: number;
  responseRate: number; // percentage

  // Resolution
  casesResolved: number;
  casesEscalated: number;
  averageResolutionTime: number; // hours
  resolutionRate: number; // percentage

  // Financial impact
  totalHoldAmount: number;
  totalCreditNotes: number;
  averageCreditNoteAmount: number;

  // Reputation
  repeatIssueRate: number; // same client, same issue type
  clientSatisfaction: number; // 1-5 rating
}

export interface AfterSalesNotification {
  id: string;
  caseId: string;
  recipientId: string;
  type: 'new_case' | 'deadline_reminder' | 'escalation' | 'resolution' | 'payment_hold';
  title: string;
  message: string;
  priority: AfterSalesPriority;
  read: boolean;
  createdAt: Date;

  // Action required
  requiresAction: boolean;
  actionDeadline: Date | null;
  actionUrl: string | null;
}
