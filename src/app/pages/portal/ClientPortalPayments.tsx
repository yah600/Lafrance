import { useState } from 'react';
import { ArrowLeft, CreditCard, DollarSign, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { toast } from 'sonner';

export default function ClientPortalPayments() {
  const navigate = useNavigate();
  const params = useParams();
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock invoice data (would come from API in production)
  const invoice = {
    id: params.id || 'INV-002',
    amount: 450.00,
    status: 'pending',
    date: '2025-12-15',
    dueDate: '2025-12-25',
    description: 'Réparation robinet et installation chauffe-eau'
  };

  // Card form state
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // Validate card data
      if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
        throw new Error('Veuillez remplir tous les champs');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store payment record
      const payment = {
        id: `pay-${Date.now()}`,
        invoiceId: invoice.id,
        amount: invoice.amount,
        status: 'completed',
        paymentMethod: 'card',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      const existingPayments = JSON.parse(localStorage.getItem('clientPayments') || '[]');
      localStorage.setItem('clientPayments', JSON.stringify([...existingPayments, payment]));

      toast.success('Paiement effectué avec succès!', {
        description: `Facture ${invoice.id} - $${invoice.amount.toFixed(2)}`
      });

      setPaymentSuccess(true);
      setTimeout(() => {
        navigate('/client-portal/invoices');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du paiement');
      toast.error('Échec du paiement');
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-green-500">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi!</h2>
            <p className="text-gray-600 mb-4">
              Votre paiement de ${invoice.amount.toFixed(2)} a été traité avec succès.
            </p>
            <p className="text-sm text-gray-500">
              Vous serez redirigé vers vos factures dans quelques secondes...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/client-portal/invoices')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payer une facture</h1>
          <p className="text-gray-600 mt-1">Paiement sécurisé</p>
        </div>
      </div>

      {/* Payment Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Détails de la facture</CardTitle>
            <CardDescription>Facture #{invoice.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Date d'émission:</span>
              <span className="font-medium">{new Date(invoice.date).toLocaleDateString('fr-CA')}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Date d'échéance:</span>
              <span className="font-medium text-orange-600">
                {new Date(invoice.dueDate).toLocaleDateString('fr-CA')}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Description:</span>
              <span className="font-medium text-right max-w-xs">{invoice.description}</span>
            </div>
            <div className="flex justify-between py-3 bg-blue-50 px-4 rounded-lg">
              <span className="font-semibold text-lg">Montant total:</span>
              <span className="font-bold text-2xl text-blue-600">${invoice.amount.toFixed(2)}</span>
            </div>

            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                Le paiement sera traité immédiatement. Vous recevrez un reçu par email.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de paiement</CardTitle>
            <CardDescription>Entrez vos informations de carte bancaire</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                  maxLength={19}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Nom sur la carte</Label>
                <Input
                  id="cardName"
                  type="text"
                  placeholder="Jean Dupont"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiration</Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                    maxLength={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Total à payer:</span>
                <span className="text-2xl font-bold text-blue-600">${invoice.amount.toFixed(2)}</span>
              </div>

              <Button
                type="submit"
                disabled={processing}
                className="w-full"
                size="lg"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payer ${invoice.amount.toFixed(2)}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                <Lock className="h-3 w-3 inline mr-1" />
                Paiement sécurisé. Vos informations sont cryptées et protégées.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Paiement 100% sécurisé</h3>
              <p className="text-sm text-gray-600">
                Vos informations de carte bancaire sont cryptées selon les normes PCI-DSS. 
                Dans une application de production, ce formulaire serait intégré avec Stripe, 
                PayPal ou un autre processeur de paiement sécurisé.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
