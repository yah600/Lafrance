import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { PriceEstimator } from '../../components/estimator';
import { toast } from 'sonner';

export default function MobileEstimator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceType = (searchParams.get('service') || 'water-heater') as 'water-heater' | 'backwater-valve' | 'sump-pump';
  const clientName = searchParams.get('client') || 'Client';

  const [estimateCreated, setEstimateCreated] = useState(false);

  const handleComplete = (selection: any) => {
    console.log('Estimate created:', selection);
    
    // TODO: Save estimate to backend
    // TODO: Generate PDF
    // TODO: Send to client via email/SMS
    
    setEstimateCreated(true);
    toast.success('Estimation créée avec succès!');
  };

  const handleSendToClient = () => {
    toast.success(`Estimation envoyée à ${clientName}!`);
    navigate('/mobile/home');
  };

  const handleDownloadPDF = () => {
    toast.success('Téléchargement du PDF...');
    // TODO: Generate and download PDF
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mobile/home')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Nouvelle Estimation</h1>
            <p className="text-sm text-gray-600">Pour: {clientName}</p>
          </div>
        </div>
      </div>

      {/* Estimator Content */}
      <div className="pb-20">
        <PriceEstimator 
          serviceType={serviceType}
          onComplete={handleComplete}
        />
      </div>

      {/* Mobile Action Buttons - Fixed at bottom */}
      {estimateCreated && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-3">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSendToClient}
          >
            <Send className="h-5 w-5 mr-2" />
            Envoyer au client
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            size="lg"
            onClick={handleDownloadPDF}
          >
            <Download className="h-5 w-5 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      )}
    </div>
  );
}
