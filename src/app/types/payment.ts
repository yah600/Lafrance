// Payment split system types for GROUPE LAFRANCE APP
// 75% immediate payment, 25% after 30 days with compliance checks

export enum PaymentStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  SPLIT_RELEASED = 'split_released', // First 75% paid
  FULLY_RELEASED = 'fully_released', // All 100% paid
  HELD = 'held', // Payment held due to claim
  PARTIALLY_REFUNDED = 'partially_refunded',
  FULLY_REFUNDED = 'fully_refunded',
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING_VERIFICATION = 'pending_verification',
  GRACE_PERIOD = 'grace_period',
}

export enum ComplianceDocumentType {
  RBQ = 'rbq', // Régie du bâtiment du Québec
  CNESST = 'cnesst', // Commission des normes, de l'équité, de la santé et de la sécurité du travail
  CCQ = 'ccq', // Commission de la construction du Québec
  RQ_TAXES = 'rq_taxes', // Revenu Québec - Tax compliance
  LIABILITY_INSURANCE = 'liability_insurance',
}

export interface ComplianceDocument {
  type: ComplianceDocumentType;
  documentNumber: string;
  expiryDate: Date;
  status: 'valid' | 'expired' | 'pending';
  lastVerified: Date;
  fileUrl?: string;
}

export interface PaymentSplit {
  id: string;
  invoiceId: string;
  jobId: string;
  plumberId: string;
  clientId: string;

  // Amounts
  totalAmount: number;
  immediateAmount: number; // 75%
  heldAmount: number; // 25%

  // Status tracking
  immediatePaymentStatus: PaymentStatus;
  heldPaymentStatus: PaymentStatus;

  // Release conditions
  heldPaymentReleaseDate: Date; // 30 days after job completion
  canReleaseHeldPayment: boolean;

  // Compliance tracking
  complianceStatus: ComplianceStatus;
  complianceDocuments: ComplianceDocument[];
  complianceCheckDate: Date;

  // Penalty tracking
  compliancePenaltyApplied: boolean;
  penaltyAmount: number; // 10% of held amount if non-compliant
  penaltyReason?: string;

  // After-sales holds
  afterSalesHoldActive: boolean;
  afterSalesHoldAmount: number;
  afterSalesClaimIds: string[];

  // Dates
  jobCompletedAt: Date;
  immediatePaymentAt?: Date;
  heldPaymentAt?: Date;

  // Stripe
  stripePaymentIntentId?: string;
  stripeTransferIds?: {
    immediate?: string;
    held?: string;
  };
}

export interface PaymentSplitSummary {
  totalEarned: number;
  totalPaid: number;
  totalPending: number;
  totalHeld: number;
  totalAfterSalesHold: number;
  totalPenalties: number;
  paymentsAwaitingRelease: number;
  estimatedReleaseDate?: Date;
}

export const PAYMENT_SPLIT_RULES = {
  IMMEDIATE_PERCENTAGE: 0.75, // 75%
  HELD_PERCENTAGE: 0.25, // 25%
  HELD_DAYS: 30, // Days before held payment can be released
  COMPLIANCE_PENALTY_PERCENTAGE: 0.10, // 10% penalty if non-compliant
  GRACE_PERIOD_DAYS: 7, // Days to update expired documents
  AFTER_SALES_HOLD_PERCENTAGE: 0.25, // 25% held for after-sales claims
};

export const COMPLIANCE_CHECK_REQUIREMENTS = {
  [ComplianceDocumentType.RBQ]: {
    required: true,
    description: 'Licence RBQ valide',
    renewalReminder: 30, // Days before expiry
  },
  [ComplianceDocumentType.CNESST]: {
    required: true,
    description: 'Attestation CNESST valide',
    renewalReminder: 30,
  },
  [ComplianceDocumentType.CCQ]: {
    required: false, // Optional for some plumbers
    description: 'Certificat CCQ (si applicable)',
    renewalReminder: 30,
  },
  [ComplianceDocumentType.RQ_TAXES]: {
    required: true,
    description: 'Attestation Revenu Québec',
    renewalReminder: 30,
  },
  [ComplianceDocumentType.LIABILITY_INSURANCE]: {
    required: true,
    description: 'Assurance responsabilité civile',
    renewalReminder: 30,
  },
};

export interface PaymentReleaseConditions {
  canRelease: boolean;
  reasons: string[];
  blockers: {
    afterSalesHold: boolean;
    complianceIssue: boolean;
    pendingDocuments: string[];
    timeNotElapsed: boolean;
  };
  estimatedReleaseDate?: Date;
}

export const calculatePaymentSplit = (totalAmount: number): { immediate: number; held: number } => {
  const immediate = Math.round(totalAmount * PAYMENT_SPLIT_RULES.IMMEDIATE_PERCENTAGE * 100) / 100;
  const held = Math.round(totalAmount * PAYMENT_SPLIT_RULES.HELD_PERCENTAGE * 100) / 100;

  return { immediate, held };
};

export const calculateCompliancePenalty = (heldAmount: number): number => {
  return Math.round(heldAmount * PAYMENT_SPLIT_RULES.COMPLIANCE_PENALTY_PERCENTAGE * 100) / 100;
};

export const checkPaymentReleaseConditions = (split: PaymentSplit): PaymentReleaseConditions => {
  const reasons: string[] = [];
  const blockers = {
    afterSalesHold: false,
    complianceIssue: false,
    pendingDocuments: [] as string[],
    timeNotElapsed: false,
  };

  // Check if 30 days have elapsed
  const now = new Date();
  const daysSinceCompletion = Math.floor(
    (now.getTime() - split.jobCompletedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceCompletion < PAYMENT_SPLIT_RULES.HELD_DAYS) {
    blockers.timeNotElapsed = true;
    reasons.push(`Délai de ${PAYMENT_SPLIT_RULES.HELD_DAYS} jours non écoulé (${daysSinceCompletion}/${PAYMENT_SPLIT_RULES.HELD_DAYS})`);
  }

  // Check for active after-sales holds
  if (split.afterSalesHoldActive) {
    blockers.afterSalesHold = true;
    reasons.push('Réclamation après-vente active');
  }

  // Check compliance status
  if (split.complianceStatus === ComplianceStatus.NON_COMPLIANT) {
    blockers.complianceIssue = true;
    reasons.push('Non-conformité - Pénalité de 10% appliquée');
  }

  // Check for expired documents
  const expiredDocs = split.complianceDocuments.filter((doc) => doc.status === 'expired');
  if (expiredDocs.length > 0) {
    blockers.complianceIssue = true;
    expiredDocs.forEach((doc) => {
      blockers.pendingDocuments.push(doc.type);
      reasons.push(`Document expiré: ${doc.type}`);
    });
  }

  const canRelease = reasons.length === 0;

  // Calculate estimated release date
  let estimatedReleaseDate: Date | undefined;
  if (!canRelease && !blockers.afterSalesHold && !blockers.complianceIssue) {
    estimatedReleaseDate = new Date(split.heldPaymentReleaseDate);
  }

  return {
    canRelease,
    reasons,
    blockers,
    estimatedReleaseDate,
  };
};
