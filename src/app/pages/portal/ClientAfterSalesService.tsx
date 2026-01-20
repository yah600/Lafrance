import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Home } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { AfterSalesClaimForm } from '../../components/aftersales/AfterSalesClaimForm';
import { Button } from '../../components/ui/button';
import { mockDataService } from '../../services/mockDataService';
import { toast } from 'sonner';
import { useBETAuth } from '../../context/BETAuthContext';
import { isClient } from '../../types/betUser';

export default function ClientAfterSalesService() {
  const { user } = useBETAuth();
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    // Load invoice and job data
    if (invoiceId) {
      // In a real app, you'd have invoice stored separately
      // For now, find the job associated with this invoice ID pattern
      const allJobs = mockDataService.getAllJobs();
      const matchedJob = allJobs.find(j =>
        j.invoiceId === invoiceId ||
        j.status === 'completed' ||
        j.status === 'paid'
      );

      if (matchedJob) {
        setJob(matchedJob);
        // Mock invoice data from job
        setInvoice({
          id: invoiceId,
          jobId: matchedJob.id,
          date: matchedJob.completedAt || new Date(),
          plumberName: 'Plombier',
          address: matchedJob.address,
          serviceType: matchedJob.description,
          total: matchedJob.winningBid || matchedJob.estimatedPrice || 0,
        });
      }
    }
  }, [invoiceId]);

  const handleClaimSubmit = (claim: any) => {
    console.log('Claim submitted:', claim);

    // Check if user is logged in as client
    if (!user || !isClient(user)) {
      toast.error('Vous devez être connecté en tant que client');
      navigate('/bet-login');
      return;
    }

    // Save claim to mockDataService
    const fullClaim = {
      ...claim,
      id: `CLAIM-${Date.now()}`,
      invoiceId,
      jobId: job?.id,
      clientId: user.id, // Use actual client ID from BET auth
      clientName: `${user.firstName} ${user.lastName}`,
      clientEmail: user.email,
      plumberId: job?.plumberId || job?.winnerId,
      status: 'submitted',
      submittedAt: new Date(),
      holdAmount: invoice ? invoice.total * 0.25 : 0,
    };

    mockDataService.addClaim(fullClaim);

    // Freeze held payment
    if (job?.id) {
      const heldPayouts = mockDataService.getHeldPayments(job.plumberId || job.winnerId);
      heldPayouts.forEach(payout => {
        if (payout.jobId === job.id) {
          mockDataService.updatePlumberPayout(payout.id, {
            status: 'frozen',
            claimId: fullClaim.id,
            frozenAt: new Date(),
          });
        }
      });
    }

    // Send notification to plumber
    mockDataService.addNotification({
      recipientId: job?.plumberId || job?.winnerId,
      type: 'aftersales_claim',
      title: 'Nouvelle réclamation après-vente',
      message: `Réclamation urgence ${claim.priority} pour job ${job?.id}`,
      priority: claim.priority,
    });

    setSubmittedClaim(fullClaim);
    setClaimSubmitted(true);
    toast.success('Réclamation soumise avec succès!');
  };

  const handleBackToInvoice = () => {
    navigate(`/portal/invoice/${invoiceId}`);
  };

  if (claimSubmitted && submittedClaim) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Card */}
          <Card className="border-green-300 bg-green-50 mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  Réclamation soumise avec succès
                </h2>
                <p className="text-green-800 mb-4">
                  Votre réclamation a été enregistrée et le plombier en a été notifié.
                </p>
                <Badge className="bg-green-600 text-lg px-4 py-2">
                  Réclamation {submittedClaim.id}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Hold Notice */}
          <Card className="border-amber-300 bg-amber-50 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Retenue de paiement activée
                  </h3>
                  <p className="text-sm text-amber-800 mb-2">
                    Un montant de <span className="font-bold">{submittedClaim.holdAmount.toFixed(2)} $</span> (25% de la facture) a été automatiquement retenu du paiement au plombier.
                  </p>
                  <p className="text-sm text-amber-800">
                    Ce montant sera libéré uniquement après la résolution de votre réclamation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Prochaines étapes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Notification au plombier</p>
                    <p className="text-sm text-gray-600">
                      {submittedClaim.priority === 'urgent'
                        ? 'Le plombier doit répondre dans la prochaine heure.'
                        : submittedClaim.priority === 'important'
                        ? 'Le plombier doit répondre dans les 48 prochaines heures.'
                        : 'Le plombier doit répondre dans les 7 prochains jours.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Réponse du plombier</p>
                    <p className="text-sm text-gray-600">
                      Le plombier peut accepter la réclamation et proposer une date de correction, ou la contester.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Résolution</p>
                    <p className="text-sm text-gray-600">
                      Si acceptée: rendez-vous pour correction. Si contestée: un administrateur examinera le dossier.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Libération des fonds</p>
                    <p className="text-sm text-gray-600">
                      Une fois le problème résolu à votre satisfaction, les fonds retenus seront libérés.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Résumé de votre réclamation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <Badge>{submittedClaim.type}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priorité:</span>
                <Badge
                  className={
                    submittedClaim.priority === 'urgent'
                      ? 'bg-red-600'
                      : submittedClaim.priority === 'important'
                      ? 'bg-orange-600'
                      : 'bg-yellow-600'
                  }
                >
                  {submittedClaim.priority}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Photos soumises:</span>
                <span className="font-medium">{submittedClaim.photos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date de soumission:</span>
                <span className="font-medium">
                  {new Date(submittedClaim.createdAt).toLocaleString('fr-CA')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              variant="outline"
              onClick={handleBackToInvoice}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la facture
            </Button>

            <p className="text-xs text-center text-gray-500">
              Vous recevrez une notification par courriel dès que le plombier répondra à votre réclamation.
            </p>
          </div>
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
            onClick={handleBackToInvoice}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la facture
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service après-vente</h1>
          <p className="text-gray-600">
            Soumettez une réclamation pour un problème lié au service reçu
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-6 border-blue-300 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Protection de paiement automatique
                </h3>
                <p className="text-sm text-blue-800">
                  Lorsque vous soumettez une réclamation, 25% du paiement au plombier est
                  automatiquement retenu jusqu'à la résolution du problème. Cela garantit votre
                  satisfaction et protège vos droits.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claim Form */}
        <AfterSalesClaimForm
          invoiceId={mockInvoice.id}
          jobId={mockInvoice.jobId}
          plumberName={mockInvoice.plumberName}
          serviceDate={mockInvoice.date}
          invoiceAmount={mockInvoice.total}
          onSubmit={handleClaimSubmit}
        />
      </div>
    </div>
  );
}
