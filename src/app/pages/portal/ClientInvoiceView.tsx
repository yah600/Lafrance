import React, { useState } from 'react';
import { Download, Star, Check, FileText, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { RatingModal } from '../../components/rating/RatingModal';
import { toast } from 'sonner';

// Mock invoice data
const mockInvoice = {
  id: 'INV-2026-001',
  jobId: 'JOB-456',
  date: new Date('2026-01-20'),
  plumberName: 'Michel Lacoste',
  plumberCompany: 'Plomberie M. Lacoste Inc.',
  serviceType: 'Réparation fuite sous évier',
  address: '1234 Rue Principale, Montréal, QC H1A 1A1',

  workStartTime: new Date('2026-01-20T09:30:00'),
  workEndTime: new Date('2026-01-20T11:45:00'),
  hoursWorked: 2.25,

  labor: 225.00,
  transport: 25.00,
  materials: 0,
  subtotal: 250.00,
  tps: 12.50,
  tvq: 24.94,
  total: 287.44,

  status: 'paid',
  paidAt: new Date('2026-01-20T12:00:00'),
  paymentMethod: 'Carte de crédit',

  progressPhotos: [
    { id: '1', url: '/photo1.jpg', caption: 'État initial de la fuite' },
    { id: '2', url: '/photo2.jpg', caption: 'Réparation en cours' },
    { id: '3', url: '/photo3.jpg', caption: 'Travaux complétés' },
  ],

  description: 'Réparation d\'une fuite d\'eau sous l\'évier de cuisine. Remplacement du raccord défectueux et vérification de l\'étanchéité. Travaux réalisés conformément aux normes.',

  rated: false,
};

export default function ClientInvoiceView() {
  const [invoice, setInvoice] = useState(mockInvoice);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [canDownload, setCanDownload] = useState(false);

  const handleRatingSubmit = async (rating: number, comment: string) => {
    console.log('Rating submitted:', { rating, comment });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update invoice as rated
    setInvoice((prev) => ({ ...prev, rated: true }));
    setCanDownload(true);

    // Simulate Google Reviews posting for 5 stars
    if (rating === 5) {
      setTimeout(() => {
        toast.success('Avis publié sur Google Reviews!', {
          description: 'Merci d\'avoir partagé votre expérience positive.',
        });
      }, 1500);
    }

    // Simulate internal notification for low ratings
    if (rating <= 3) {
      console.log('Internal notification: Client rating <=3, needs follow-up');
    }
  };

  const handleDownloadInvoice = () => {
    if (!canDownload && !invoice.rated) {
      toast.error('Vous devez d\'abord évaluer le service', {
        description: 'Cliquez sur "Évaluer le service" pour continuer.',
      });
      return;
    }

    toast.success('Téléchargement de la facture en cours...');
    // In production: trigger PDF download
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Facture payée</h1>
          <p className="text-gray-600">Merci pour votre confiance!</p>
        </div>

        {/* Download Notice */}
        {!canDownload && !invoice.rated && (
          <Card className="mb-6 border-blue-300 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Évaluez le service pour télécharger votre facture
                  </h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Pour accéder à votre facture payée, nous vous demandons d'évaluer le service reçu.
                    Cela ne prend que quelques secondes!
                  </p>
                  <Button
                    onClick={() => setRatingModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Évaluer le service maintenant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Notice */}
        {canDownload && invoice.rated && (
          <Card className="mb-6 border-green-300 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Check className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">
                    Merci pour votre évaluation!
                  </h3>
                  <p className="text-sm text-green-800">
                    Vous pouvez maintenant télécharger votre facture.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invoice Card */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Facture {invoice.id}</CardTitle>
                <CardDescription>
                  {invoice.plumberCompany}
                </CardDescription>
              </div>
              <Badge className="bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                Payée
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Date du service:</span>
                <p className="font-medium">{invoice.date.toLocaleDateString('fr-CA')}</p>
              </div>

              <div>
                <span className="text-gray-600">Plombier:</span>
                <p className="font-medium">{invoice.plumberName}</p>
              </div>

              <div>
                <span className="text-gray-600">Adresse:</span>
                <p className="font-medium">{invoice.address}</p>
              </div>

              <div>
                <span className="text-gray-600">Type de service:</span>
                <p className="font-medium">{invoice.serviceType}</p>
              </div>

              <div>
                <span className="text-gray-600">Durée:</span>
                <p className="font-medium">{invoice.hoursWorked} heures</p>
              </div>

              <div>
                <span className="text-gray-600">Payé le:</span>
                <p className="font-medium">
                  {invoice.paidAt.toLocaleDateString('fr-CA')} via {invoice.paymentMethod}
                </p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description des travaux</h3>
              <p className="text-sm text-gray-700">{invoice.description}</p>
            </div>

            {/* Photos */}
            {invoice.progressPhotos.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Photos des travaux</h3>
                <div className="grid grid-cols-3 gap-4">
                  {invoice.progressPhotos.map((photo) => (
                    <div key={photo.id} className="space-y-1">
                      <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-600">{photo.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Amounts */}
            <div className="space-y-3">
              <h3 className="font-semibold">Détails de facturation</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Main d'œuvre ({invoice.hoursWorked}h)</span>
                  <span>{invoice.labor.toFixed(2)} $</span>
                </div>

                <div className="flex justify-between">
                  <span>Transport</span>
                  <span>{invoice.transport.toFixed(2)} $</span>
                </div>

                {invoice.materials > 0 && (
                  <div className="flex justify-between">
                    <span>Matériaux</span>
                    <span>{invoice.materials.toFixed(2)} $</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{invoice.subtotal.toFixed(2)} $</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>TPS (5%)</span>
                  <span>{invoice.tps.toFixed(2)} $</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>TVQ (9.975%)</span>
                  <span>{invoice.tvq.toFixed(2)} $</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">{invoice.total.toFixed(2)} $</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {!invoice.rated && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setRatingModalOpen(true)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Évaluer le service
                </Button>
              )}

              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleDownloadInvoice}
                disabled={!canDownload && !invoice.rated}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger la facture PDF
              </Button>
            </div>

            {!canDownload && !invoice.rated && (
              <p className="text-xs text-center text-gray-500">
                Vous devez évaluer le service avant de télécharger la facture
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rating Modal */}
      <RatingModal
        open={ratingModalOpen}
        onOpenChange={setRatingModalOpen}
        plumberName={invoice.plumberName}
        jobId={invoice.jobId}
        invoiceId={invoice.id}
        onRatingSubmit={handleRatingSubmit}
      />
    </div>
  );
}
