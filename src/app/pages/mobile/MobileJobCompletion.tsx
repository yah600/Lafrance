import { ArrowLeft, CheckCircle2, DollarSign, PartyPopper } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { SignaturePad } from '../../components/signature/SignaturePad';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';
import { FileText } from 'lucide-react';

export default function MobileJobCompletion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob } = useApp();
  const [step, setStep] = useState(1); // 1: Materials, 2: Signature, 3: Payment, 4: Success
  const [signature, setSignature] = useState<string>('');
  const [materials, setMaterials] = useState([
    { item: 'Tuyau PVC 2"', quantity: 1, price: 45.00 },
  ]);

  const job = jobs.find(j => j.id === id);

  if (!job) {
    return <div className="p-4">Travail non trouvé</div>;
  }

  const subtotal = materials.reduce((sum, m) => sum + (m.quantity * m.price), 0);
  const tps = subtotal * 0.05;
  const tvq = subtotal * 0.09975;
  const total = subtotal + tps + tvq;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!signature) {
        toast.error('Veuillez obtenir la signature du client');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // Complete the job
      updateJob(id!, { status: 'completed' });
      setStep(4);
      
      // Show confetti effect
      setTimeout(() => {
        navigate('/mobile');
      }, 3000);
    }
  };

  const handleSkipSignature = () => {
    toast.info('Signature non requise - Client absent');
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white p-4">
        <div className="flex items-center gap-3">
          {step < 4 && (
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold flex-1">
            {step === 1 && 'Matériaux utilisés'}
            {step === 2 && 'Signature du client'}
            {step === 3 && 'Paiement'}
            {step === 4 && 'Travail terminé!'}
          </h1>
        </div>

        {/* Progress indicator */}
        {step < 4 && (
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map(s => (
              <div 
                key={s}
                className={`h-1 flex-1 rounded-full ${
                  s <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Step 1: Materials & Pricing */}
        {step === 1 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Résumé des matériaux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {materials.map((material, index) => (
                  <div key={index} className="flex items-center justify-between pb-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{material.item}</p>
                      <p className="text-sm text-muted-foreground">
                        Qté: {material.quantity} × ${material.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(material.quantity * material.price).toFixed(2)}
                    </p>
                  </div>
                ))}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setMaterials([...materials, { item: '', quantity: 1, price: 0 }]);
                  }}
                >
                  + Ajouter un article
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>TPS (5%)</span>
                  <span>${tps.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>TVQ (9.975%)</span>
                  <span>${tvq.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[var(--primary)]">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 2: Signature */}
        {step === 2 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Signature du client</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Le client approuve les travaux effectués et le montant de ${total.toFixed(2)}
                </p>
              </CardHeader>
              <CardContent>
                <SignaturePad
                  onSave={(signatureData) => setSignature(signatureData)}
                  onClear={() => setSignature('')}
                />
              </CardContent>
            </Card>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleSkipSignature}
            >
              Client absent - Ignorer la signature
            </Button>
          </>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Mode de paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-4"
                  onClick={handleNext}
                >
                  <div className="text-left">
                    <p className="font-semibold">Payer maintenant</p>
                    <p className="text-sm text-muted-foreground">Terminal Stripe / Carte de crédit</p>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-4"
                  onClick={handleNext}
                >
                  <div className="text-left">
                    <p className="font-semibold">Paiement reçu</p>
                    <p className="text-sm text-muted-foreground">Comptant / Chèque / Interac</p>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-4"
                  onClick={handleNext}
                >
                  <div className="text-left">
                    <p className="font-semibold">Envoyer la facture</p>
                    <p className="text-sm text-muted-foreground">Facturation ultérieure</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Total à payer:</strong> ${total.toFixed(2)}
              </p>
            </div>

            {/* Service Form Button */}
            <Card className="border-[var(--flame-orange)] bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-[var(--flame-orange)] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      Fiche technique recommandée
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      Remplissez une fiche technique détaillée avec photos pour générer un rapport professionnel.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-[var(--flame-orange)] text-[var(--flame-orange)] hover:bg-[var(--flame-orange)] hover:text-white"
                      onClick={() => navigate('/mobile/service-form', { state: { jobId: id } })}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Remplir la fiche technique
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <PartyPopper className="h-12 w-12 text-green-600" />
              </div>
              {/* Confetti animation */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Travail terminé! 🎉
            </h2>
            <p className="text-muted-foreground mb-6">
              Excellent travail! Le travail #{job.id.slice(0, 8)} est maintenant complété.
            </p>

            <Card className="w-full mb-6">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client</span>
                  <span className="font-medium">{job.client.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{job.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="font-bold text-[var(--primary)]">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground mb-6">
              Redirection vers l'accueil dans quelques instants...
            </p>

            <Button 
              size="lg"
              className="bg-[var(--primary)]"
              onClick={() => navigate('/mobile')}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      {step < 3 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button 
            size="lg"
            className="w-full bg-[var(--primary)]"
            onClick={handleNext}
          >
            {step === 1 && 'Continuer →'}
            {step === 2 && 'Signer et continuer →'}
          </Button>
        </div>
      )}
    </div>
  );
}