import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { PaymentMethodSelector } from '../../components/payment/PaymentMethodSelector';
import { PaymentResult } from '../../services/paymentService';

interface PaymentPageState {
  amount: number;
  invoiceId: string;
  jobId: string;
  plumberName: string;
  plumberEmail: string;
  serviceType: string;
  authorizeOnly?: boolean;
}

export default function ClientPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentPageState;

  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  // If no state, redirect back
  if (!state) {
    navigate('/');
    return null;
  }

  const { amount, invoiceId, jobId, plumberName, plumberEmail, serviceType, authorizeOnly } = state;

  const handlePaymentSuccess = (result?: PaymentResult) => {
    console.log('Payment successful:', result);
    setPaymentResult(result || null);
    setPaymentComplete(true);

    // In production: Update backend with payment confirmation
  };

  const handleContinue = () => {
    if (authorizeOnly) {
      // For urgent jobs with authorization, show tracking page
      navigate(`/portal/job/${jobId}/tracking`);
    } else {
      // For normal jobs, show confirmation
      navigate('/portal/request-success', {
        state: { invoiceId, jobId },
      });
    }
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <Card className="border-green-300 bg-green-50">
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  {authorizeOnly ? 'Paiement pré-autorisé!' : 'Paiement effectué avec succès!'}
                </h2>
                <p className="text-green-800 mb-4">
                  {authorizeOnly
                    ? 'Votre carte a été autorisée. Le montant final sera capturé après le service.'
                    : 'Votre paiement a été traité avec succès.'}
                </p>

                {paymentResult && paymentResult.cardDetails && (
                  <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Détails du paiement:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Montant:</span>
                        <span className="font-medium">{paymentResult.amount.toFixed(2)} $ CAD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carte:</span>
                        <span className="font-medium">
                          {paymentResult.cardDetails.brand} •••• {paymentResult.cardDetails.last4}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {paymentResult.transactionDate.toLocaleString('fr-CA')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Prochaines étapes:</h3>
              <div className="space-y-3">
                {authorizeOnly ? (
                  <>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-semibold">Le plombier est en route</p>
                        <p className="text-sm text-gray-600">
                          Vous pouvez suivre sa localisation en temps réel
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-semibold">Service complété</p>
                        <p className="text-sm text-gray-600">
                          Le paiement final sera capturé automatiquement (±20% du montant autorisé)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Facture et évaluation</p>
                        <p className="text-sm text-gray-600">
                          Vous recevrez votre facture finale et pourrez évaluer le service
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-semibold">Votre demande est en cours de traitement</p>
                        <p className="text-sm text-gray-600">
                          Les plombiers disponibles vont soumettre des offres
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-semibold">Sélection du plombier</p>
                        <p className="text-sm text-gray-600">
                          Nous sélectionnerons la meilleure offre pour vous
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Confirmation</p>
                        <p className="text-sm text-gray-600">
                          Vous recevrez un courriel de confirmation avec les détails
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button
            size="lg"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
            onClick={handleContinue}
          >
            Continuer
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Un courriel de confirmation a été envoyé à votre adresse
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {authorizeOnly ? 'Pré-autorisation de paiement' : 'Paiement de la demande'}
            </h1>
            <p className="text-gray-600">{serviceType}</p>
          </div>
        </div>

        {/* Service Summary */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Résumé de la demande:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{serviceType}</span>
              </div>
              {plumberName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Plombier:</span>
                  <span className="font-medium">{plumberName}</span>
                </div>
              )}
              {jobId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Job ID:</span>
                  <span className="font-medium">{jobId}</span>
                </div>
              )}
              {invoiceId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Facture:</span>
                  <span className="font-medium">{invoiceId}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Selector */}
        <PaymentMethodSelector
          amount={amount}
          invoiceId={invoiceId}
          jobId={jobId}
          clientId="CLIENT-001" // In production: Get from auth context
          recipientEmail={plumberEmail || 'paiements@groupelafrance.ca'}
          recipientName={plumberName || 'Groupe Lafrance'}
          onSuccess={handlePaymentSuccess}
          onCancel={() => navigate(-1)}
          authorizeOnly={authorizeOnly}
          showInterac={!authorizeOnly} // Only show Interac for non-urgent jobs
        />
      </div>
    </div>
  );
}
