/**
 * Webhook Handler
 * Handles incoming and outgoing webhooks
 * 
 * Features:
 * - Signature verification
 * - Event routing
 * - Retry logic with exponential backoff
 * - Delivery tracking
 * - Error handling
 */

import type {
  WebhookEvent,
  WebhookPayload,
  WebhookDelivery,
  WebhookEndpoint
} from '../../types/integrations';

export class WebhookHandler {
  private static instance: WebhookHandler;
  
  private constructor() {}

  static getInstance(): WebhookHandler {
    if (!WebhookHandler.instance) {
      WebhookHandler.instance = new WebhookHandler();
    }
    return WebhookHandler.instance;
  }

  // ============================================================================
  // INCOMING WEBHOOKS
  // ============================================================================

  /**
   * Verify webhook signature
   */
  async verifySignature(
    payload: string,
    signature: string,
    secret: string,
    algorithm: 'sha256' | 'sha1' = 'sha256'
  ): Promise<boolean> {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(payload);

      // Import the key for HMAC
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: algorithm === 'sha256' ? 'SHA-256' : 'SHA-1' },
        false,
        ['sign']
      );

      // Sign the payload
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, messageData);
      const calculatedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Constant-time comparison
      return this.constantTimeCompare(signature, calculatedSignature);
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   */
  private constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }

  /**
   * Parse and validate incoming webhook
   */
  async handleIncomingWebhook(
    provider: string,
    headers: Record<string, string>,
    body: any
  ): Promise<{
    success: boolean;
    event?: WebhookEvent;
    data?: any;
    error?: string;
  }> {
    try {
      // Provider-specific parsing
      switch (provider) {
        case 'stripe':
          return this.handleStripeWebhook(headers, body);
        case 'quickbooks':
          return this.handleQuickBooksWebhook(headers, body);
        case 'salesforce':
          return this.handleSalesforceWebhook(headers, body);
        case 'hubspot':
          return this.handleHubSpotWebhook(headers, body);
        default:
          return {
            success: false,
            error: `Unknown provider: ${provider}`
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Handle Stripe webhook
   */
  private handleStripeWebhook(headers: Record<string, string>, body: any) {
    const signature = headers['stripe-signature'];
    if (!signature) {
      return { success: false, error: 'Missing signature' };
    }

    // Map Stripe events to our event types
    const eventMapping: Record<string, WebhookEvent> = {
      'customer.created': 'customer.created',
      'customer.updated': 'customer.updated',
      'customer.deleted': 'customer.deleted',
      'invoice.created': 'invoice.created',
      'invoice.finalized': 'invoice.sent',
      'invoice.paid': 'invoice.paid',
      'payment_intent.succeeded': 'payment.received',
      'payment_intent.payment_failed': 'payment.failed',
      'charge.refunded': 'payment.refunded'
    };

    const ourEvent = eventMapping[body.type];
    if (!ourEvent) {
      return { success: false, error: `Unmapped event: ${body.type}` };
    }

    return {
      success: true,
      event: ourEvent,
      data: body.data.object
    };
  }

  /**
   * Handle QuickBooks webhook
   */
  private handleQuickBooksWebhook(headers: Record<string, string>, body: any) {
    const signature = headers['intuit-signature'];
    if (!signature) {
      return { success: false, error: 'Missing signature' };
    }

    // QuickBooks sends notifications about changes
    const entities = body.eventNotifications?.[0]?.dataChangeEvent?.entities || [];
    
    if (entities.length === 0) {
      return { success: false, error: 'No entities in webhook' };
    }

    const entity = entities[0];
    const operation = entity.operation; // CREATE, UPDATE, DELETE

    // Map to our events
    let event: WebhookEvent;
    if (entity.name === 'Customer') {
      event = operation === 'Create' ? 'customer.created' :
              operation === 'Update' ? 'customer.updated' :
              'customer.deleted';
    } else if (entity.name === 'Invoice') {
      event = operation === 'Create' ? 'invoice.created' :
              'invoice.updated' as WebhookEvent;
    } else if (entity.name === 'Payment') {
      event = 'payment.received';
    } else {
      return { success: false, error: `Unmapped entity: ${entity.name}` };
    }

    return {
      success: true,
      event,
      data: entity
    };
  }

  /**
   * Handle Salesforce webhook (Outbound Message)
   */
  private handleSalesforceWebhook(headers: Record<string, string>, body: any) {
    // Salesforce uses SOAP, so we'd parse XML here
    // For now, simplified JSON example
    
    const notifications = body.notifications || [];
    if (notifications.length === 0) {
      return { success: false, error: 'No notifications' };
    }

    const notification = notifications[0];
    const objectType = notification.sObject?.type;
    
    let event: WebhookEvent;
    if (objectType === 'Account' || objectType === 'Contact') {
      event = 'customer.created'; // Simplified
    } else if (objectType === 'Opportunity') {
      event = 'referral.captured' as WebhookEvent; // Map opportunities to referrals
    } else {
      return { success: false, error: `Unmapped object: ${objectType}` };
    }

    return {
      success: true,
      event,
      data: notification.sObject
    };
  }

  /**
   * Handle HubSpot webhook
   */
  private handleHubSpotWebhook(headers: Record<string, string>, body: any) {
    const signature = headers['x-hubspot-signature'];
    if (!signature) {
      return { success: false, error: 'Missing signature' };
    }

    const subscriptionType = body.subscriptionType;
    
    const eventMapping: Record<string, WebhookEvent> = {
      'contact.creation': 'customer.created',
      'contact.propertyChange': 'customer.updated',
      'contact.deletion': 'customer.deleted',
      'deal.creation': 'referral.captured' as WebhookEvent
    };

    const event = eventMapping[subscriptionType];
    if (!event) {
      return { success: false, error: `Unmapped subscription: ${subscriptionType}` };
    }

    return {
      success: true,
      event,
      data: body.objectId
    };
  }

  // ============================================================================
  // OUTGOING WEBHOOKS
  // ============================================================================

  /**
   * Send webhook to external endpoint
   */
  async sendWebhook(
    endpoint: WebhookEndpoint,
    event: WebhookEvent,
    payload: any
  ): Promise<WebhookDelivery> {
    const delivery: WebhookDelivery = {
      id: this.generateId(),
      webhookEndpointId: endpoint.id,
      event,
      payload,
      status: 'pending',
      attempts: 0,
      maxAttempts: endpoint.retryConfig.maxRetries,
      createdAt: new Date()
    };

    try {
      await this.deliverWebhook(endpoint, delivery);
      return delivery;
    } catch (error) {
      delivery.status = 'failed';
      delivery.error = error instanceof Error ? error.message : 'Unknown error';
      return delivery;
    }
  }

  /**
   * Deliver webhook with retry logic
   */
  private async deliverWebhook(
    endpoint: WebhookEndpoint,
    delivery: WebhookDelivery,
    attempt: number = 1
  ): Promise<void> {
    delivery.attempts = attempt;
    delivery.sentAt = new Date();

    try {
      // Generate signature
      const payloadString = JSON.stringify(delivery.payload);
      const signature = await this.generateSignature(payloadString, endpoint.secret);

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': delivery.event,
        'X-Webhook-Delivery-Id': delivery.id,
        'X-Webhook-Timestamp': new Date().toISOString(),
        ...endpoint.customHeaders
      };

      // Send request
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers,
        body: payloadString,
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      delivery.responseStatus = response.status;
      delivery.responseHeaders = Object.fromEntries(response.headers.entries());
      delivery.responseBody = await response.text();

      // Check if delivery was successful
      if (response.status >= 200 && response.status < 300) {
        delivery.status = 'delivered';
        delivery.deliveredAt = new Date();
      } else {
        throw new Error(`HTTP ${response.status}: ${delivery.responseBody}`);
      }
    } catch (error) {
      delivery.error = error instanceof Error ? error.message : 'Unknown error';

      // Retry logic
      if (attempt < delivery.maxAttempts) {
        delivery.status = 'retrying';
        
        // Calculate backoff delay
        const baseDelay = endpoint.retryConfig.retryDelay;
        const backoffMultiplier = endpoint.retryConfig.backoffMultiplier;
        const delay = baseDelay * Math.pow(backoffMultiplier, attempt - 1);
        
        delivery.nextRetryAt = new Date(Date.now() + delay);

        // Schedule retry
        setTimeout(() => {
          this.deliverWebhook(endpoint, delivery, attempt + 1);
        }, delay);
      } else {
        delivery.status = 'failed';
      }
    }
  }

  /**
   * Generate HMAC signature
   */
  private async generateSignature(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);

    // Import the key for HMAC
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Sign the payload
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, messageData);
    const signature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return signature;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============================================================================
  // EVENT ROUTING
  // ============================================================================

  /**
   * Route event to appropriate handler
   */
  async routeEvent(event: WebhookEvent, data: any): Promise<void> {
    switch (event) {
      case 'customer.created':
      case 'customer.updated':
      case 'customer.deleted':
        await this.handleCustomerEvent(event, data);
        break;

      case 'job.created':
      case 'job.updated':
      case 'job.completed':
      case 'job.cancelled':
        await this.handleJobEvent(event, data);
        break;

      case 'invoice.created':
      case 'invoice.sent':
      case 'invoice.paid':
      case 'invoice.overdue':
        await this.handleInvoiceEvent(event, data);
        break;

      case 'payment.received':
      case 'payment.failed':
      case 'payment.refunded':
        await this.handlePaymentEvent(event, data);
        break;

      case 'referral.captured':
      case 'referral.converted':
      case 'referral.lost':
        await this.handleReferralEvent(event, data);
        break;

      default:
        console.warn(`Unhandled event: ${event}`);
    }
  }

  /**
   * Handle customer events
   */
  private async handleCustomerEvent(event: WebhookEvent, data: any): Promise<void> {
    console.log(`Handling customer event: ${event}`, data);
    // Implementation would update customer records in database
    // and sync with other integrations
  }

  /**
   * Handle job events
   */
  private async handleJobEvent(event: WebhookEvent, data: any): Promise<void> {
    console.log(`Handling job event: ${event}`, data);
    // Implementation would update job records and trigger
    // invoice generation, technician notifications, etc.
  }

  /**
   * Handle invoice events
   */
  private async handleInvoiceEvent(event: WebhookEvent, data: any): Promise<void> {
    console.log(`Handling invoice event: ${event}`, data);
    // Implementation would update invoice status and sync
    // with accounting systems
  }

  /**
   * Handle payment events
   */
  private async handlePaymentEvent(event: WebhookEvent, data: any): Promise<void> {
    console.log(`Handling payment event: ${event}`, data);
    // Implementation would record payments and update
    // invoice status
  }

  /**
   * Handle referral events
   */
  private async handleReferralEvent(event: WebhookEvent, data: any): Promise<void> {
    console.log(`Handling referral event: ${event}`, data);
    // Implementation would update cross-referral pipeline
    // and calculate commissions
  }
}

// Export singleton instance
export const webhookHandler = WebhookHandler.getInstance();