import React, { useState } from 'react';
import { CreditCard, Mail, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CreditCardPaymentForm } from './CreditCardPaymentForm';
import { InteracPaymentForm } from './InteracPaymentForm';
import { PaymentResult } from '../../services/paymentService';

interface PaymentMethodSelectorProps {
  amount: number;
  invoiceId: string;
  jobId: string;
  clientId: string;
  recipientEmail: string;
  recipientName: string;
  onSuccess: (result?: PaymentResult) => void;
  onCancel?: () => void;
  authorizeOnly?: boolean;
  showInterac?: boolean;
}

export function PaymentMethodSelector({
  amount,
  invoiceId,
  jobId,
  clientId,
  recipientEmail,
  recipientName,
  onSuccess,
  onCancel,
  authorizeOnly = false,
  showInterac = true,
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'credit_card' | 'interac' | null>(null);

  if (selectedMethod === 'credit_card') {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedMethod(null)}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Changer de méthode
        </Button>
        <CreditCardPaymentForm
          amount={amount}
          invoiceId={invoiceId}
          jobId={jobId}
          clientId={clientId}
          onSuccess={onSuccess}
          onCancel={onCancel}
          authorizeOnly={authorizeOnly}
        />
      </div>
    );
  }

  if (selectedMethod === 'interac' && showInterac) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedMethod(null)}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Changer de méthode
        </Button>
        <InteracPaymentForm
          amount={amount}
          invoiceId={invoiceId}
          jobId={jobId}
          recipientEmail={recipientEmail}
          recipientName={recipientName}
          onSuccess={() => onSuccess()}
          onCancel={onCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre méthode de paiement</h2>
        <p className="text-gray-600">
          {authorizeOnly
            ? 'Sélectionnez comment vous souhaitez autoriser le paiement'
            : `Montant à payer: ${amount.toFixed(2)} $ CAD`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Credit Card Option */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
          onClick={() => setSelectedMethod('credit_card')}
        >
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Carte de crédit</h3>
              <p className="text-sm text-gray-600 mb-4">
                {authorizeOnly
                  ? 'Pré-autorisation instantanée'
                  : 'Paiement instantané et sécurisé'}
              </p>

              <div className="space-y-1 text-xs text-gray-500 mb-4">
                <p>✓ Traitement immédiat</p>
                <p>✓ Visa, Mastercard, Amex</p>
                <p>✓ Sécurisé par Stripe</p>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Payer par carte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interac Option */}
        {showInterac && (
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-500"
            onClick={() => setSelectedMethod('interac')}
          >
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Interac e-Transfer</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Payez directement de votre compte bancaire
                </p>

                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  <p>✓ Aucuns frais</p>
                  <p>✓ Directement de votre banque</p>
                  <p>✓ Dépôt automatique</p>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Payer par Interac
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Note about authorization */}
      {authorizeOnly && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">Note sur la pré-autorisation:</p>
          <p>
            Nous autoriserons le montant maintenant mais ne le capturerons qu'après le service. Le
            montant final peut varier de ±20% selon le temps réel et les matériaux utilisés.
          </p>
        </div>
      )}

      {/* Cancel Button */}
      {onCancel && (
        <Button variant="outline" className="w-full" onClick={onCancel}>
          Annuler
        </Button>
      )}
    </div>
  );
}
