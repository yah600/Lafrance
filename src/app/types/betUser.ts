/**
 * BET Marketplace User Type Definitions
 * Three distinct user types: Plumber (external contractors), Client (customers), Internal Admin (staff)
 */

import { DivisionType } from './user';

// BET-specific user roles
export type BETUserRole = 'plumber' | 'client' | 'internal-admin';

// Subscription tiers for plumbers
export type SubscriptionTier = 'bronze' | 'silver' | 'gold';

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired';

export type BillingCycle = 'monthly' | 'yearly';

// Compliance document types required in Quebec
export type ComplianceDocumentType = 'RBQ' | 'CNESST' | 'CCQ' | 'RQ' | 'LIABILITY_INSURANCE';

export type ComplianceDocumentStatus = 'provided' | 'pending' | 'missing' | 'expired' | 'approved';

export interface ComplianceDocument {
  type: ComplianceDocumentType;
  status: ComplianceDocumentStatus;
  documentUrl?: string;
  expiryDate?: string;
  uploadedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  startDate: string;
  trialEndDate?: string;
  renewalDate?: string;
  cancelledAt?: string;
  price: number;
}

export interface PlumberPreferences {
  serviceTypes: string[]; // e.g., ['débouchage', 'chauffe-eau', 'urgences']
  serviceRadius: number; // km
  workingHours: {
    start: string; // e.g., '08:00'
    end: string; // e.g., '18:00'
  };
  availableWeekdays: number[]; // 0-6 (Sunday-Saturday)
  acceptUrgentJobs: boolean;
  acceptNormalJobs: boolean;
}

// Base BET User interface
export interface BETUserBase {
  id: string;
  email: string;
  role: BETUserRole;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Plumber - External contractor who bids on jobs
export interface PlumberUser extends BETUserBase {
  role: 'plumber';
  plumberId: string; // Same as id, for clarity
  businessName: string;
  rbqNumber: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  subscription: SubscriptionInfo;
  complianceStatus: {
    isCompliant: boolean;
    documents: Record<ComplianceDocumentType, ComplianceDocument>;
    lastChecked?: string;
    note?: string;
  };
  preferences: PlumberPreferences;
  rating: {
    average: number;
    count: number;
    last5Stars: number; // Count of recent 5-star ratings
    last30Days: number; // Count of ratings in last 30 days
  };
  stats: {
    jobsCompleted: number;
    jobsCancelled: number;
    totalEarnings: number;
    averageResponseTime: number; // minutes
    onTimeRate: number; // percentage
  };
}

// Client - Regular customer who requests services
export interface ClientUser extends BETUserBase {
  role: 'client';
  clientId: string; // Same as id, for clarity
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  preferredLanguage: 'fr' | 'en';
  paymentMethods: {
    creditCard?: {
      last4: string;
      expiryMonth: number;
      expiryYear: number;
      brand: string; // 'visa', 'mastercard', etc.
    };
    interac?: {
      email: string;
    };
  };
  stats: {
    jobsRequested: number;
    jobsCompleted: number;
    totalSpent: number;
    averageRatingGiven: number;
  };
}

// Internal Admin - Groupe Lafrance staff who manage the platform
export interface InternalAdminUser extends BETUserBase {
  role: 'internal-admin';
  adminId: string; // Same as id, for clarity
  division?: DivisionType; // Primary division they manage
  divisions: DivisionType[]; // All divisions they have access to
  permissions: {
    canReviewJobs: boolean;
    canApproveJobs: boolean;
    canRejectJobs: boolean;
    canArbitrateClaims: boolean;
    canManagePayments: boolean;
    canManagePlumbers: boolean;
    canManageClients: boolean;
    canViewAnalytics: boolean;
  };
  title?: string; // e.g., 'Operations Manager', 'Dispatcher'
}

// Union type for all BET users
export type BETUser = PlumberUser | ClientUser | InternalAdminUser;

// Type guards
export function isPlumber(user: BETUser | null): user is PlumberUser {
  return user?.role === 'plumber';
}

export function isClient(user: BETUser | null): user is ClientUser {
  return user?.role === 'client';
}

export function isInternalAdmin(user: BETUser | null): user is InternalAdminUser {
  return user?.role === 'internal-admin';
}

// Helper to get user display name
export function getUserDisplayName(user: BETUser | null): string {
  if (!user) return 'Guest';
  return `${user.firstName} ${user.lastName}`;
}

// Helper to get user role display
export function getUserRoleDisplay(role: BETUserRole): string {
  const roleMap: Record<BETUserRole, string> = {
    'plumber': 'Plombier',
    'client': 'Client',
    'internal-admin': 'Administrateur',
  };
  return roleMap[role];
}

// Subscription tier details
export const SUBSCRIPTION_TIERS = {
  bronze: {
    name: 'Bronze',
    monthlyPrice: 49.99,
    yearlyPrice: 539.89, // ~10% discount
    features: [
      'Recevoir des appels via BET',
      'Facturation automatique',
      'Support de base',
      'Notifications par email',
    ],
    trialDays: 180,
  },
  silver: {
    name: 'Argent',
    monthlyPrice: 99.99,
    yearlyPrice: 1079.89, // ~10% discount
    features: [
      'Tout Bronze +',
      'Factures manuelles',
      'Soumissions en ligne',
      'Suivi avancé des jobs',
      'Support prioritaire',
      'Statistiques détaillées',
    ],
    trialDays: 180,
  },
  gold: {
    name: 'Or',
    monthlyPrice: 199.99,
    yearlyPrice: 2159.89, // ~10% discount
    features: [
      'Tout Argent +',
      'Comptabilité complète',
      'IA conciliation bancaire',
      'Rapports trimestriels',
      'Support 24/7',
      'Gestionnaire de compte dédié',
      'Formation personnalisée',
    ],
    trialDays: 180,
  },
} as const;

// Required compliance documents in Quebec
export const REQUIRED_COMPLIANCE_DOCUMENTS: ComplianceDocumentType[] = [
  'RBQ',
  'CNESST',
  'CCQ',
  'RQ',
  'LIABILITY_INSURANCE',
];

export const COMPLIANCE_DOCUMENT_NAMES: Record<ComplianceDocumentType, string> = {
  RBQ: 'Licence RBQ',
  CNESST: 'CNESST',
  CCQ: 'CCQ',
  RQ: 'Revenu Québec',
  LIABILITY_INSURANCE: 'Assurance Responsabilité Civile',
};
