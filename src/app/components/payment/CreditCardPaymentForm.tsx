import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { paymentService, PaymentResult } from '../../services/paymentService';

interface CreditCardPaymentFormProps {
  amount: number;
  invoiceId: string;
  jobId: string;
  clientId: string;
  onSuccess: (result: PaymentResult) => void;
  onCancel?: () => void;
  authorizeOnly?: boolean; // For pre-authorization (urgent jobs)
}

export function CreditCardPaymentForm({
  amount,
  invoiceId,
  jobId,
  clientId,
  onSuccess,
  onCancel,
  authorizeOnly = false,
}: CreditCardPaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Card number validation (simplified)
    const cleanedCard = cardNumber.replace(/\s/g, '');
    if (!cleanedCard || cleanedCard.length < 13 || cleanedCard.length > 19) {
      newErrors.cardNumber = 'Numéro de carte invalide';
    }

    // Name validation
    if (!cardName.trim()) {
      newErrors.cardName = 'Nom requis';
    }

    // Expiry validation
    const expiryParts = expiryDate.split('/');
    if (expiryParts.length !== 2) {
      newErrors.expiryDate = 'Format: MM/AA';
    } else {
      const month = parseInt(expiryParts[0]);
      const year = parseInt('20' + expiryParts[1]);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Mois invalide';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'Carte expirée';
      }
    }

    // CVV validation
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      newErrors.cvv = 'CVV invalide';
    }

    // Postal code validation (Canadian format)
    const postalRegex = /^[A-Za-z]\d[A-Za-z][\s-]?\d[A-Za-z]\d$/;
    if (!postalCode || !postalRegex.test(postalCode)) {
      newErrors.postalCode = 'Code postal invalide (ex: H1A 1A1)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create payment intent
      const intent = authorizeOnly
        ? await paymentService.authorizePayment(amount, invoiceId, jobId, clientId)
        : await paymentService.createPaymentIntent(amount, invoiceId, jobId, clientId);

      // Step 2: In production, use Stripe.js to create payment method
      // const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);
      // const { paymentMethod, error } = await stripe.createPaymentMethod({
      //   type: 'card',
      //   card: cardElement,
      //   billing_details: { name: cardName, address: { postal_code: postalCode } },
      // });

      // Simulate payment method creation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockPaymentMethodId = `pm_${Date.now()}`;

      // Step 3: Confirm payment
      const result = await paymentService.confirmPayment(intent.id, mockPaymentMethodId);

      if (result.success) {
        toast.success(
          authorizeOnly
            ? 'Paiement pré-autorisé avec succès'
            : 'Paiement effectué avec succès',
          {
            description: authorizeOnly
              ? 'Les fonds seront capturés après le service'
              : 'Votre paiement a été traité',
          }
        );
        onSuccess(result);
      } else {
        toast.error('Échec du paiement', {
          description: result.error || 'Veuillez vérifier vos informations',
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erreur lors du paiement', {
        description: 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {authorizeOnly ? 'Pré-autorisation par carte' : 'Paiement par carte de crédit'}
        </CardTitle>
        <CardDescription>
          {authorizeOnly
            ? 'Nous autoriserons le montant maintenant et le capturerons après le service'
            : 'Entrez vos informations de paiement de manière sécurisée'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {authorizeOnly ? 'Montant à autoriser:' : 'Montant à payer:'}
              </span>
              <span className="text-2xl font-bold text-blue-900">{amount.toFixed(2)} $ CAD</span>
            </div>
          </div>

          {/* Card Number */}
          <div>
            <Label htmlFor="card-number">Numéro de carte</Label>
            <Input
              id="card-number"
              type="text"
              value={cardNumber}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 19));
                setCardNumber(formatted);
              }}
              placeholder="1234 5678 9012 3456"
              maxLength={23}
              className={errors.cardNumber ? 'border-red-500' : ''}
            />
            {errors.cardNumber && (
              <p className="text-xs text-red-600 mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Cardholder Name */}
          <div>
            <Label htmlFor="card-name">Nom sur la carte</Label>
            <Input
              id="card-name"
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              placeholder="JEAN TREMBLAY"
              className={errors.cardName ? 'border-red-500' : ''}
            />
            {errors.cardName && <p className="text-xs text-red-600 mt-1">{errors.cardName}</p>}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Date d'expiration</Label>
              <Input
                id="expiry"
                type="text"
                value={expiryDate}
                onChange={(e) => {
                  const formatted = formatExpiryDate(e.target.value);
                  setExpiryDate(formatted);
                }}
                placeholder="MM/AA"
                maxLength={5}
                className={errors.expiryDate ? 'border-red-500' : ''}
              />
              {errors.expiryDate && (
                <p className="text-xs text-red-600 mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                maxLength={4}
                className={errors.cvv ? 'border-red-500' : ''}
              />
              {errors.cvv && <p className="text-xs text-red-600 mt-1">{errors.cvv}</p>}
            </div>
          </div>

          {/* Postal Code */}
          <div>
            <Label htmlFor="postal-code">Code postal de facturation</Label>
            <Input
              id="postal-code"
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
              placeholder="H1A 1A1"
              maxLength={7}
              className={errors.postalCode ? 'border-red-500' : ''}
            />
            {errors.postalCode && (
              <p className="text-xs text-red-600 mt-1">{errors.postalCode}</p>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-2">
            <Lock className="h-4 w-4 text-gray-600 mt-0.5" />
            <div className="text-xs text-gray-700">
              <p className="font-semibold mb-1">Paiement sécurisé</p>
              <p>
                Vos informations sont cryptées et traitées de manière sécurisée via Stripe. Nous ne
                stockons jamais vos informations de carte.
              </p>
            </div>
          </div>

          {/* Authorization Notice */}
          {authorizeOnly && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <p className="font-semibold mb-1">Pré-autorisation uniquement</p>
                  <p>
                    Nous autoriserons ce montant sur votre carte maintenant, mais ne le capturerons
                    qu'une fois le service complété. Le montant final pourra varier de ±20%.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  {authorizeOnly ? 'Autorisation...' : 'Traitement...'}
                </span>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  {authorizeOnly
                    ? `Autoriser ${amount.toFixed(2)} $`
                    : `Payer ${amount.toFixed(2)} $`}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
