// Payment service for GROUPE LAFRANCE APP
// Handles Stripe and Interac e-Transfer integrations

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  INTERAC = 'interac',
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'failed';
  metadata: {
    invoiceId: string;
    jobId: string;
    clientId: string;
  };
}

export interface InteracTransferRequest {
  id: string;
  amount: number;
  recipientEmail: string;
  message: string;
  securityQuestion?: string;
  securityAnswer?: string;
  status: 'pending' | 'sent' | 'deposited' | 'expired' | 'cancelled';
  expiryDate: Date;
  createdAt: Date;
}

export interface StripeCardDetails {
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  paymentMethod: PaymentMethodType;
  amount: number;
  transactionDate: Date;
  cardDetails?: StripeCardDetails;
  interacEmail?: string;
  error?: string;
}

class PaymentService {
  private stripePublicKey: string;

  constructor() {
    // In production, load from environment variables
    this.stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_demo';
  }

  /**
   * Create a Stripe payment intent for credit card payment
   */
  async createPaymentIntent(
    amount: number,
    invoiceId: string,
    jobId: string,
    clientId: string
  ): Promise<PaymentIntent> {
    try {
      // Simulate API call to backend
      console.log('Creating payment intent:', { amount, invoiceId, jobId, clientId });

      // In production: POST to backend API which calls Stripe
      // const response = await fetch('/api/payments/create-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount, invoiceId, jobId, clientId }),
      // });
      // const data = await response.json();
      // return data;

      // Mock response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        id: `pi_${Date.now()}`,
        clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
        amount: Math.round(amount * 100), // Stripe uses cents
        currency: 'cad',
        status: 'requires_payment_method',
        metadata: {
          invoiceId,
          jobId,
          clientId,
        },
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Confirm a payment with Stripe
   */
  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<PaymentResult> {
    try {
      console.log('Confirming payment:', { paymentIntentId, paymentMethodId });

      // In production: POST to backend API
      // const response = await fetch('/api/payments/confirm', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ paymentIntentId, paymentMethodId }),
      // });
      // const data = await response.json();

      // Mock successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return {
        success: true,
        paymentId: paymentIntentId,
        paymentMethod: PaymentMethodType.CREDIT_CARD,
        amount: 287.44, // Mock amount
        transactionDate: new Date(),
        cardDetails: {
          last4: '4242',
          brand: 'Visa',
          expMonth: 12,
          expYear: 2027,
        },
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        paymentId: paymentIntentId,
        paymentMethod: PaymentMethodType.CREDIT_CARD,
        amount: 0,
        transactionDate: new Date(),
        error: 'Payment confirmation failed',
      };
    }
  }

  /**
   * Process Interac e-Transfer request
   */
  async requestInteracTransfer(
    amount: number,
    recipientEmail: string,
    message: string,
    invoiceId: string,
    jobId: string
  ): Promise<InteracTransferRequest> {
    try {
      console.log('Requesting Interac transfer:', {
        amount,
        recipientEmail,
        message,
        invoiceId,
        jobId,
      });

      // In production: POST to backend API
      // Backend would integrate with bank's Interac API
      // const response = await fetch('/api/payments/interac-request', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount, recipientEmail, message, invoiceId, jobId }),
      // });
      // const data = await response.json();

      // Mock response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 days expiry

      return {
        id: `interac_${Date.now()}`,
        amount,
        recipientEmail,
        message,
        status: 'sent',
        expiryDate,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error requesting Interac transfer:', error);
      throw new Error('Failed to request Interac transfer');
    }
  }

  /**
   * Send Interac auto-deposit
   */
  async sendInteracAutoDeposit(
    amount: number,
    recipientEmail: string,
    recipientName: string,
    message: string
  ): Promise<InteracTransferRequest> {
    try {
      console.log('Sending Interac auto-deposit:', {
        amount,
        recipientEmail,
        recipientName,
        message,
      });

      // In production: POST to backend API for auto-deposit
      // const response = await fetch('/api/payments/interac-auto-deposit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount, recipientEmail, recipientName, message }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        id: `interac_auto_${Date.now()}`,
        amount,
        recipientEmail,
        message,
        status: 'deposited',
        expiryDate: new Date(),
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error sending Interac auto-deposit:', error);
      throw new Error('Failed to send Interac auto-deposit');
    }
  }

  /**
   * Authorize a payment (hold funds without capturing)
   */
  async authorizePayment(
    amount: number,
    invoiceId: string,
    jobId: string,
    clientId: string
  ): Promise<PaymentIntent> {
    try {
      console.log('Authorizing payment:', { amount, invoiceId, jobId, clientId });

      // In production: POST to backend with capture_method: 'manual'
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        id: `pi_auth_${Date.now()}`,
        clientSecret: `pi_auth_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
        amount: Math.round(amount * 100),
        currency: 'cad',
        status: 'requires_payment_method',
        metadata: {
          invoiceId,
          jobId,
          clientId,
        },
      };
    } catch (error) {
      console.error('Error authorizing payment:', error);
      throw new Error('Failed to authorize payment');
    }
  }

  /**
   * Capture a previously authorized payment
   */
  async capturePayment(paymentIntentId: string): Promise<PaymentResult> {
    try {
      console.log('Capturing authorized payment:', paymentIntentId);

      // In production: POST to backend to capture the payment
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        success: true,
        paymentId: paymentIntentId,
        paymentMethod: PaymentMethodType.CREDIT_CARD,
        amount: 287.44,
        transactionDate: new Date(),
      };
    } catch (error) {
      console.error('Error capturing payment:', error);
      return {
        success: false,
        paymentId: paymentIntentId,
        paymentMethod: PaymentMethodType.CREDIT_CARD,
        amount: 0,
        transactionDate: new Date(),
        error: 'Payment capture failed',
      };
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    try {
      console.log('Processing refund:', { paymentId, amount, reason });

      // In production: POST to backend API
      // const response = await fetch('/api/payments/refund', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ paymentId, amount, reason }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      return {
        success: true,
        refundId: `re_${Date.now()}`,
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        error: 'Refund processing failed',
      };
    }
  }

  /**
   * Transfer funds to plumber (75% immediate or 25% held release)
   */
  async transferToPlumber(
    plumberId: string,
    amount: number,
    type: 'immediate' | 'held',
    invoiceId: string
  ): Promise<{ success: boolean; transferId?: string; error?: string }> {
    try {
      console.log('Transferring to plumber:', { plumberId, amount, type, invoiceId });

      // In production: POST to backend which uses Stripe Connect transfers
      // const response = await fetch('/api/payments/transfer', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ plumberId, amount, type, invoiceId }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      return {
        success: true,
        transferId: `tr_${Date.now()}`,
      };
    } catch (error) {
      console.error('Error transferring to plumber:', error);
      return {
        success: false,
        error: 'Transfer failed',
      };
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
