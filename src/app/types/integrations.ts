/**
 * Integration Types
 * API Connectors and Webhooks for CRM & Accounting Integration
 * 
 * Supported Integrations:
 * - CRM: Salesforce, HubSpot, Pipedrive, Zoho CRM
 * - Accounting: QuickBooks, Xero, Sage, FreshBooks
 * - Property Management: ROVIDA, Yardi
 * - Payment: Stripe, Square, Financeit
 * - Communication: Twilio, SendGrid
 */

export type IntegrationType = 
  | 'crm'
  | 'accounting'
  | 'property-management'
  | 'payment'
  | 'communication'
  | 'analytics';

export type IntegrationProvider =
  // CRM Systems
  | 'salesforce'
  | 'hubspot'
  | 'pipedrive'
  | 'zoho-crm'
  // Accounting Systems
  | 'quickbooks'
  | 'xero'
  | 'sage'
  | 'freshbooks'
  // Property Management
  | 'rovida'
  | 'yardi'
  // Payment Processors
  | 'stripe'
  | 'square'
  | 'financeit'
  // Communication
  | 'twilio'
  | 'sendgrid'
  // Analytics
  | 'google-analytics'
  | 'mixpanel';

export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'configuring';

export type SyncDirection = 'one-way-in' | 'one-way-out' | 'two-way';

export type WebhookEvent =
  // Customer Events
  | 'customer.created'
  | 'customer.updated'
  | 'customer.deleted'
  // Job Events
  | 'job.created'
  | 'job.updated'
  | 'job.completed'
  | 'job.cancelled'
  // Invoice Events
  | 'invoice.created'
  | 'invoice.sent'
  | 'invoice.paid'
  | 'invoice.overdue'
  // Payment Events
  | 'payment.received'
  | 'payment.failed'
  | 'payment.refunded'
  // Cross-Referral Events
  | 'referral.captured'
  | 'referral.converted'
  | 'referral.lost'
  // Property Events
  | 'property.created'
  | 'property.updated';

export interface Integration {
  id: string;
  name: string;
  provider: IntegrationProvider;
  type: IntegrationType;
  status: IntegrationStatus;
  
  // Configuration
  config: IntegrationConfig;
  credentials: IntegrationCredentials;
  
  // Sync Settings
  syncDirection: SyncDirection;
  syncFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly' | 'manual';
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  
  // Field Mapping
  fieldMappings: FieldMapping[];
  
  // Webhooks
  webhooksEnabled: boolean;
  webhookUrl?: string;
  webhookSecret?: string;
  subscribedEvents: WebhookEvent[];
  
  // Statistics
  stats: {
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    lastError?: string;
    recordsSynced: number;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
}

export interface IntegrationConfig {
  // API Settings
  apiUrl?: string;
  apiVersion?: string;
  timeout?: number; // milliseconds
  retryAttempts?: number;
  
  // Sync Settings
  batchSize?: number;
  includeDeleted?: boolean;
  
  // Filters
  divisionFilter?: string[]; // Sync only specific divisions
  dateFilter?: {
    field: string;
    from?: Date;
    to?: Date;
  };
  
  // Custom Settings (provider-specific)
  customSettings?: Record<string, any>;
}

export interface IntegrationCredentials {
  // OAuth 2.0
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  
  // API Key
  apiKey?: string;
  apiSecret?: string;
  
  // Basic Auth
  username?: string;
  password?: string;
  
  // Custom Auth
  customAuth?: Record<string, string>;
  
  // OAuth URLs
  authorizationUrl?: string;
  tokenUrl?: string;
  
  // Encrypted flag
  isEncrypted: boolean;
}

export interface FieldMapping {
  id: string;
  localField: string;
  remoteField: string;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  transform?: string; // JavaScript function as string
  required: boolean;
  direction: 'in' | 'out' | 'both';
}

export interface WebhookEndpoint {
  id: string;
  integrationId: string;
  url: string;
  secret: string;
  events: WebhookEvent[];
  isActive: boolean;
  
  // Retry Configuration
  retryConfig: {
    maxRetries: number;
    retryDelay: number; // milliseconds
    backoffMultiplier: number;
  };
  
  // Headers
  customHeaders?: Record<string, string>;
  
  // Statistics
  stats: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    lastDeliveryAt?: Date;
    lastError?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookDelivery {
  id: string;
  webhookEndpointId: string;
  event: WebhookEvent;
  payload: any;
  
  // Delivery Info
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  maxAttempts: number;
  
  // Response Info
  responseStatus?: number;
  responseBody?: string;
  responseHeaders?: Record<string, string>;
  
  // Timing
  sentAt?: Date;
  deliveredAt?: Date;
  nextRetryAt?: Date;
  
  // Error Info
  error?: string;
  
  createdAt: Date;
}

export interface SyncJob {
  id: string;
  integrationId: string;
  type: 'full' | 'incremental' | 'manual';
  direction: 'pull' | 'push';
  
  // Status
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  
  // Records
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  skippedRecords: number;
  
  // Errors
  errors: SyncError[];
  
  // Timing
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // milliseconds
  
  // Metadata
  triggeredBy: 'system' | 'user' | 'webhook';
  triggeredByUserId?: string;
  
  createdAt: Date;
}

export interface SyncError {
  id: string;
  recordId: string;
  recordType: string;
  errorType: 'validation' | 'authentication' | 'network' | 'mapping' | 'business-logic';
  message: string;
  details?: any;
  timestamp: Date;
  canRetry: boolean;
}

export interface IntegrationLog {
  id: string;
  integrationId: string;
  level: 'info' | 'warning' | 'error';
  category: 'sync' | 'webhook' | 'auth' | 'config' | 'other';
  message: string;
  details?: any;
  timestamp: Date;
}

// ============================================================================
// PROVIDER-SPECIFIC TYPES
// ============================================================================

// QuickBooks Types
export interface QuickBooksConfig {
  realmId: string; // Company ID
  environment: 'production' | 'sandbox';
  syncCustomers: boolean;
  syncInvoices: boolean;
  syncPayments: boolean;
  syncExpenses: boolean;
  accountMapping: {
    revenueAccount: string;
    expenseAccount: string;
    assetAccount: string;
  };
}

export interface QuickBooksCustomer {
  Id: string;
  DisplayName: string;
  CompanyName?: string;
  GivenName?: string;
  FamilyName?: string;
  PrimaryPhone?: {
    FreeFormNumber: string;
  };
  PrimaryEmailAddr?: {
    Address: string;
  };
  BillAddr?: {
    Line1?: string;
    City?: string;
    CountrySubDivisionCode?: string;
    PostalCode?: string;
  };
}

export interface QuickBooksInvoice {
  Id: string;
  DocNumber: string;
  CustomerRef: {
    value: string;
    name: string;
  };
  TxnDate: string;
  DueDate: string;
  TotalAmt: number;
  Balance: number;
  Line: Array<{
    Amount: number;
    Description?: string;
    DetailType: string;
  }>;
}

// Salesforce Types
export interface SalesforceConfig {
  instanceUrl: string;
  apiVersion: string;
  syncAccounts: boolean;
  syncContacts: boolean;
  syncOpportunities: boolean;
  recordTypeMapping: Record<string, string>;
}

export interface SalesforceAccount {
  Id: string;
  Name: string;
  Phone?: string;
  BillingStreet?: string;
  BillingCity?: string;
  BillingState?: string;
  BillingPostalCode?: string;
  Type?: string;
}

export interface SalesforceContact {
  Id: string;
  FirstName?: string;
  LastName: string;
  Email?: string;
  Phone?: string;
  AccountId?: string;
}

export interface SalesforceOpportunity {
  Id: string;
  Name: string;
  AccountId: string;
  Amount?: number;
  CloseDate: string;
  StageName: string;
  Probability?: number;
}

// HubSpot Types
export interface HubSpotConfig {
  portalId: string;
  syncContacts: boolean;
  syncDeals: boolean;
  syncCompanies: boolean;
  pipelineId?: string;
}

export interface HubSpotContact {
  id: string;
  properties: {
    email?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

export interface HubSpotDeal {
  id: string;
  properties: {
    dealname: string;
    amount?: string;
    closedate?: string;
    dealstage: string;
    pipeline: string;
  };
}

// ROVIDA (Property Management) Types
export interface ROVIDAConfig {
  companyId: string;
  syncProperties: boolean;
  syncWorkOrders: boolean;
  syncTenants: boolean;
  autoCreateWorkOrders: boolean;
}

export interface ROVIDAProperty {
  id: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    unit?: string;
  };
  propertyType: string;
  units: number;
  managementStatus: string;
}

export interface ROVIDAWorkOrder {
  id: string;
  propertyId: string;
  unitNumber?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  description: string;
  status: 'open' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  createdDate: Date;
  dueDate?: Date;
}

// Stripe Types
export interface StripeConfig {
  mode: 'live' | 'test';
  syncCustomers: boolean;
  syncPayments: boolean;
  syncInvoices: boolean;
  webhookEndpoint: string;
}

export interface StripeCustomer {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  metadata?: Record<string, string>;
}

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  customer?: string;
  status: string;
  metadata?: Record<string, string>;
}

// ============================================================================
// WEBHOOK PAYLOAD TYPES
// ============================================================================

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: Date;
  data: any;
  metadata: {
    integrationId: string;
    provider: IntegrationProvider;
    version: string;
  };
}

export interface CustomerWebhookPayload extends WebhookPayload {
  event: 'customer.created' | 'customer.updated' | 'customer.deleted';
  data: {
    customerId: string;
    name: string;
    email: string;
    phone?: string;
    address?: any;
    properties?: string[];
  };
}

export interface InvoiceWebhookPayload extends WebhookPayload {
  event: 'invoice.created' | 'invoice.sent' | 'invoice.paid' | 'invoice.overdue';
  data: {
    invoiceId: string;
    invoiceNumber: string;
    customerId: string;
    amount: number;
    dueDate: Date;
    status: string;
  };
}

export interface PaymentWebhookPayload extends WebhookPayload {
  event: 'payment.received' | 'payment.failed' | 'payment.refunded';
  data: {
    paymentId: string;
    invoiceId?: string;
    customerId: string;
    amount: number;
    method: string;
    status: string;
  };
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    page?: number;
    pageSize?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface IntegrationTestResult {
  success: boolean;
  provider: IntegrationProvider;
  connectionStatus: 'connected' | 'failed';
  authenticationStatus: 'valid' | 'invalid' | 'expired';
  features: {
    [key: string]: {
      available: boolean;
      tested: boolean;
      error?: string;
    };
  };
  latency?: number; // milliseconds
  timestamp: Date;
}
