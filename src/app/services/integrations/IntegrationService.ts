/**
 * Integration Service
 * Core service for managing API connectors and webhooks
 * 
 * Handles:
 * - Connection management
 * - Authentication (OAuth, API keys)
 * - Data syncing
 * - Webhook delivery
 * - Error handling and retries
 */

import type {
  Integration,
  IntegrationProvider,
  WebhookEndpoint,
  WebhookDelivery,
  WebhookEvent,
  SyncJob,
  IntegrationLog,
  IntegrationTestResult,
  APIResponse
} from '../../types/integrations';

export class IntegrationService {
  private static instance: IntegrationService;
  private baseUrl: string = '/api/integrations';

  private constructor() {}

  static getInstance(): IntegrationService {
    if (!IntegrationService.instance) {
      IntegrationService.instance = new IntegrationService();
    }
    return IntegrationService.instance;
  }

  // ============================================================================
  // INTEGRATION MANAGEMENT
  // ============================================================================

  /**
   * Get all integrations
   */
  async getIntegrations(): Promise<APIResponse<Integration[]>> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch integrations',
          details: error
        }
      };
    }
  }

  /**
   * Get integration by ID
   */
  async getIntegration(id: string): Promise<APIResponse<Integration>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch integration',
          details: error
        }
      };
    }
  }

  /**
   * Create new integration
   */
  async createIntegration(data: Partial<Integration>): Promise<APIResponse<Integration>> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: 'Failed to create integration',
          details: error
        }
      };
    }
  }

  /**
   * Update integration
   */
  async updateIntegration(id: string, data: Partial<Integration>): Promise<APIResponse<Integration>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update integration',
          details: error
        }
      };
    }
  }

  /**
   * Delete integration
   */
  async deleteIntegration(id: string): Promise<APIResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: 'Failed to delete integration',
          details: error
        }
      };
    }
  }

  /**
   * Test integration connection
   */
  async testIntegration(id: string): Promise<APIResponse<IntegrationTestResult>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/test`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TEST_ERROR',
          message: 'Failed to test integration',
          details: error
        }
      };
    }
  }

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  /**
   * Initialize OAuth flow
   */
  async initiateOAuth(provider: IntegrationProvider): Promise<APIResponse<{ authUrl: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/oauth/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'OAUTH_ERROR',
          message: 'Failed to initiate OAuth',
          details: error
        }
      };
    }
  }

  /**
   * Complete OAuth flow
   */
  async completeOAuth(provider: IntegrationProvider, code: string): Promise<APIResponse<Integration>> {
    try {
      const response = await fetch(`${this.baseUrl}/oauth/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, code })
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'OAUTH_ERROR',
          message: 'Failed to complete OAuth',
          details: error
        }
      };
    }
  }

  /**
   * Refresh OAuth token
   */
  async refreshToken(integrationId: string): Promise<APIResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${integrationId}/refresh-token`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REFRESH_ERROR',
          message: 'Failed to refresh token',
          details: error
        }
      };
    }
  }

  // ============================================================================
  // SYNC OPERATIONS
  // ============================================================================

  /**
   * Trigger sync job
   */
  async triggerSync(
    integrationId: string,
    options?: {
      type?: 'full' | 'incremental';
      direction?: 'pull' | 'push';
    }
  ): Promise<APIResponse<SyncJob>> {
    try {
      const response = await fetch(`${this.baseUrl}/${integrationId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options || {})
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: 'Failed to trigger sync',
          details: error
        }
      };
    }
  }

  /**
   * Get sync job status
   */
  async getSyncJob(integrationId: string, jobId: string): Promise<APIResponse<SyncJob>> {
    try {
      const response = await fetch(`${this.baseUrl}/${integrationId}/sync/${jobId}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch sync job',
          details: error
        }
      };
    }
  }

  /**
   * Get sync history
   */
  async getSyncHistory(integrationId: string, limit = 20): Promise<APIResponse<SyncJob[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/${integrationId}/sync?limit=${limit}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch sync history',
          details: error
        }
      };
    }
  }

  /**
   * Cancel sync job
   */
  async cancelSync(integrationId: string, jobId: string): Promise<APIResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${integrationId}/sync/${jobId}/cancel`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CANCEL_ERROR',
          message: 'Failed to cancel sync',
          details: error
        }
      };
    }
  }

  // ============================================================================
  // WEBHOOK MANAGEMENT
  // ============================================================================

  /**
   * Create webhook endpoint
   */
  async createWebhook(data: Partial<WebhookEndpoint>): Promise<APIResponse<WebhookEndpoint>> {
    try {
      const response = await fetch(`${this.baseUrl}/webhooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: 'Failed to create webhook',
          details: error
        }
      };
    }
  }

  /**
   * Update webhook endpoint
   */
  async updateWebhook(id: string, data: Partial<WebhookEndpoint>): Promise<APIResponse<WebhookEndpoint>> {
    try {
      const response = await fetch(`${this.baseUrl}/webhooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update webhook',
          details: error
        }
      };
    }
  }

  /**
   * Delete webhook endpoint
   */
  async deleteWebhook(id: string): Promise<APIResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/webhooks/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: 'Failed to delete webhook',
          details: error
        }
      };
    }
  }

  /**
   * Get webhook deliveries
   */
  async getWebhookDeliveries(
    webhookId: string,
    options?: {
      limit?: number;
      status?: 'pending' | 'delivered' | 'failed' | 'retrying';
    }
  ): Promise<APIResponse<WebhookDelivery[]>> {
    try {
      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.status) params.append('status', options.status);

      const response = await fetch(`${this.baseUrl}/webhooks/${webhookId}/deliveries?${params}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch webhook deliveries',
          details: error
        }
      };
    }
  }

  /**
   * Retry webhook delivery
   */
  async retryWebhookDelivery(webhookId: string, deliveryId: string): Promise<APIResponse<void>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/webhooks/${webhookId}/deliveries/${deliveryId}/retry`,
        { method: 'POST' }
      );
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'RETRY_ERROR',
          message: 'Failed to retry webhook delivery',
          details: error
        }
      };
    }
  }

  /**
   * Test webhook endpoint
   */
  async testWebhook(webhookId: string, event: WebhookEvent): Promise<APIResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/webhooks/${webhookId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event })
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TEST_ERROR',
          message: 'Failed to test webhook',
          details: error
        }
      };
    }
  }

  // ============================================================================
  // LOGS
  // ============================================================================

  /**
   * Get integration logs
   */
  async getLogs(
    integrationId: string,
    options?: {
      level?: 'info' | 'warning' | 'error';
      category?: string;
      limit?: number;
    }
  ): Promise<APIResponse<IntegrationLog[]>> {
    try {
      const params = new URLSearchParams();
      if (options?.level) params.append('level', options.level);
      if (options?.category) params.append('category', options.category);
      if (options?.limit) params.append('limit', options.limit.toString());

      const response = await fetch(`${this.baseUrl}/${integrationId}/logs?${params}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch logs',
          details: error
        }
      };
    }
  }

  // ============================================================================
  // PROVIDER-SPECIFIC METHODS
  // ============================================================================

  /**
   * QuickBooks: Get customers
   */
  async getQuickBooksCustomers(integrationId: string): Promise<APIResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/${integrationId}/quickbooks/customers`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch QuickBooks customers',
          details: error
        }
      };
    }
  }

  /**
   * QuickBooks: Create invoice
   */
  async createQuickBooksInvoice(integrationId: string, invoice: any): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/${integrationId}/quickbooks/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: 'Failed to create QuickBooks invoice',
          details: error
        }
      };
    }
  }

  /**
   * Salesforce: Get accounts
   */
  async getSalesforceAccounts(integrationId: string): Promise<APIResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/${integrationId}/salesforce/accounts`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch Salesforce accounts',
          details: error
        }
      };
    }
  }

  /**
   * Salesforce: Create opportunity
   */
  async createSalesforceOpportunity(integrationId: string, opportunity: any): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/${integrationId}/salesforce/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opportunity)
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: 'Failed to create Salesforce opportunity',
          details: error
        }
      };
    }
  }

  /**
   * ROVIDA: Get properties
   */
  async getROVIDAProperties(integrationId: string): Promise<APIResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/${integrationId}/rovida/properties`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch ROVIDA properties',
          details: error
        }
      };
    }
  }

  /**
   * ROVIDA: Create work order
   */
  async createROVIDAWorkOrder(integrationId: string, workOrder: any): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/${integrationId}/rovida/work-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workOrder)
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: 'Failed to create ROVIDA work order',
          details: error
        }
      };
    }
  }
}

// Export singleton instance
export const integrationService = IntegrationService.getInstance();
