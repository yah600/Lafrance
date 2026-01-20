/**
 * Subscription Types for GROUPE LAFRANCE APP
 *
 * Defines the subscription tier system for plumbers/contractors
 * - BRONZE: Basic call management with automatic billing
 * - SILVER: Manual invoicing + online quote system
 * - GOLD: Full accounting, bank reconciliation, quarterly reports
 */

export enum SubscriptionTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
}

export interface SubscriptionFeatures {
  // Call Management
  receiveServiceCalls: boolean;
  automaticBilling: boolean;

  // Invoicing & Quotes
  manualInvoicing: boolean;
  onlineQuotes: boolean;

  // Accounting & Financial
  accountingManagement: boolean;
  bankReconciliation: boolean;
  quarterlyReports: boolean;
  aiAccountant: boolean;

  // Support & Limits
  maxJobsPerMonth: number | 'unlimited';
  prioritySupport: boolean;
  dedicatedAccountManager: boolean;
}

export interface SubscriptionPricing {
  tier: SubscriptionTier;
  monthlyPrice: number;
  yearlyPrice: number;
  setupFee: number;
  currency: string;
  trialDays: number; // 6 months = 180 days
}

export interface Subscription {
  id: string;
  userId: string; // Plumber/contractor user ID
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  features: SubscriptionFeatures;
  pricing: SubscriptionPricing;

  // Dates
  startDate: Date;
  endDate: Date | null;
  trialEndDate: Date | null;
  nextBillingDate: Date;
  cancelledAt: Date | null;

  // Payment
  paymentMethod: PaymentMethod | null;
  lastPaymentDate: Date | null;
  lastPaymentAmount: number | null;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionStatus {
  TRIAL = 'trial', // In 6-month trial period
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_account';
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardBrand?: string; // visa, mastercard, amex
  isDefault: boolean;
}

// Subscription tier configurations
export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  features: SubscriptionFeatures;
  pricing: Omit<SubscriptionPricing, 'tier'>;
  color: string;
  popular?: boolean;
}> = {
  [SubscriptionTier.BRONZE]: {
    name: 'Bronze',
    nameEn: 'Bronze',
    description: 'Gestion d\'appels avec facturation automatique',
    descriptionEn: 'Call management with automatic billing',
    features: {
      receiveServiceCalls: true,
      automaticBilling: true,
      manualInvoicing: false,
      onlineQuotes: false,
      accountingManagement: false,
      bankReconciliation: false,
      quarterlyReports: false,
      aiAccountant: false,
      maxJobsPerMonth: 50,
      prioritySupport: false,
      dedicatedAccountManager: false,
    },
    pricing: {
      monthlyPrice: 99,
      yearlyPrice: 990, // 2 months free
      setupFee: 0,
      currency: 'CAD',
      trialDays: 180, // 6 months free
    },
    color: '#CD7F32', // Bronze color
  },
  [SubscriptionTier.SILVER]: {
    name: 'Argent',
    nameEn: 'Silver',
    description: 'Facturation manuelle + soumissions en ligne',
    descriptionEn: 'Manual invoicing + online quotes',
    features: {
      receiveServiceCalls: true,
      automaticBilling: true,
      manualInvoicing: true,
      onlineQuotes: true,
      accountingManagement: false,
      bankReconciliation: false,
      quarterlyReports: false,
      aiAccountant: false,
      maxJobsPerMonth: 'unlimited',
      prioritySupport: true,
      dedicatedAccountManager: false,
    },
    pricing: {
      monthlyPrice: 249,
      yearlyPrice: 2490, // 2 months free
      setupFee: 0,
      currency: 'CAD',
      trialDays: 180, // 6 months free
    },
    color: '#C0C0C0', // Silver color
    popular: true,
  },
  [SubscriptionTier.GOLD]: {
    name: 'Or',
    nameEn: 'Gold',
    description: 'Comptabilité complète + IA + rapports trimestriels',
    descriptionEn: 'Full accounting + AI + quarterly reports',
    features: {
      receiveServiceCalls: true,
      automaticBilling: true,
      manualInvoicing: true,
      onlineQuotes: true,
      accountingManagement: true,
      bankReconciliation: true,
      quarterlyReports: true,
      aiAccountant: true,
      maxJobsPerMonth: 'unlimited',
      prioritySupport: true,
      dedicatedAccountManager: true,
    },
    pricing: {
      monthlyPrice: 499,
      yearlyPrice: 4990, // 2 months free
      setupFee: 0,
      currency: 'CAD',
      trialDays: 180, // 6 months free
    },
    color: '#FFD700', // Gold color
  },
};

export interface SubscriptionUpgradeRequest {
  currentTier: SubscriptionTier;
  targetTier: SubscriptionTier;
  billingCycle: 'monthly' | 'yearly';
  immediateUpgrade: boolean;
  userId: string;
}

export interface SubscriptionAnalytics {
  totalRevenue: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  tierDistribution: Record<SubscriptionTier, number>;
}
