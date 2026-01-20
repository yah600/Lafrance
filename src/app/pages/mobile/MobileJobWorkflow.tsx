import React, { useState } from 'react';
import { ArrowLeft, Navigation2, Clock, Camera, FileText, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { GeofenceTracker } from '../../components/tracking/GeofenceTracker';
import { PhotoProgressTracker } from '../../components/tracking/PhotoProgressTracker';
import { AutoInvoiceGenerator } from '../../components/invoice/AutoInvoiceGenerator';
import { toast } from 'sonner';

// Mock job data
const mockJob = {
  id: '123',
  clientName: 'Jean Tremblay',
  address: '1234 Rue Principale, Montréal, QC H1A 1A1',
  coordinates: { lat: 45.5017, lng: -73.5673 },
  serviceType: 'Réparation fuite sous évier',
  description: 'Fuite d\'eau importante sous l\'évier de cuisine',
  urgency: 'urgent',
  bidAmount: 250,
  estimatedDuration: 90,
};

export default function MobileJobWorkflow() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  // State
  const [jobStatus, setJobStatus] = useState<'en-route' | 'on-site' | 'working' | 'completing' | 'completed'>('en-route');
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);
  const [timerElapsedSeconds, setTimerElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [plumberLocation, setPlumberLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [progressPhotos, setProgressPhotos] = useState<any[]>([]);

  // Simulate getting current location
  React.useEffect(() => {
    // In production, use navigator.geolocation.watchPosition()
    const updateLocation = () => {
      // Mock location update - gradually moving towards job site
      const mockLat = 45.5017 + (Math.random() - 0.5) * 0.001;
      const mockLng = -73.5673 + (Math.random() - 0.5) * 0.001;
      setPlumberLocation({ lat: mockLat, lng: mockLng });
    };

    updateLocation();
    const interval = setInterval(updateLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update timer
  React.useEffect(() => {
    if (!isTimerRunning || !timerStartTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - timerStartTime.getTime()) / 1000);
      setTimerElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timerStartTime]);

  const handleStartEnRoute = () => {
    setJobStatus('en-route');
    toast.success('En route vers le client. Le client peut maintenant vous suivre en temps réel.');
  };

  const handleTimerStart = () => {
    const startTime = new Date();
    setTimerStartTime(startTime);
    setIsTimerRunning(true);
    setJobStatus('working');
    toast.success('Timer démarré automatiquement!');
  };

  const handleCompleteWork = () => {
    setJobStatus('completing');
    setIsTimerRunning(false);
    toast.info('Génération de la facture...');
  };

  const handleInvoiceGenerated = (invoiceData: any) => {
    console.log('Invoice generated:', invoiceData);
    setJobStatus('completed');
    toast.success('Job complété! Le client va recevoir la facture.');

    // Navigate to completed jobs
    setTimeout(() => {
      navigate('/mobile/jobs/completed');
    }, 2000);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="text-center flex-1">
            <h1 className="font-semibold text-lg">{mockJob.clientName}</h1>
            <p className="text-xs text-gray-500">{mockJob.serviceType}</p>
          </div>

          <Badge
            className={
              jobStatus === 'en-route'
                ? 'bg-blue-600'
                : jobStatus === 'working'
                ? 'bg-green-600'
                : jobStatus === 'completing'
                ? 'bg-orange-600'
                : 'bg-gray-600'
            }
          >
            {jobStatus === 'en-route' && 'En route'}
            {jobStatus === 'working' && 'En cours'}
            {jobStatus === 'completing' && 'Finalisation'}
            {jobStatus === 'completed' && 'Complété'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Job Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Détails du job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-gray-600">Client:</span>
              <p className="font-medium">{mockJob.clientName}</p>
            </div>

            <div>
              <span className="text-gray-600">Adresse:</span>
              <p className="font-medium">{mockJob.address}</p>
            </div>

            <div>
              <span className="text-gray-600">Service:</span>
              <p className="font-medium">{mockJob.serviceType}</p>
            </div>

            <div>
              <span className="text-gray-600">Montant soumis:</span>
              <p className="font-bold text-lg text-green-600">{mockJob.bidAmount} $ CAD</p>
            </div>
          </CardContent>
        </Card>

        {/* Timer Display (if working) */}
        {isTimerRunning && (
          <Card className="border-blue-300 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-blue-900">Temps écoulé:</span>
                </div>
                <span className="text-4xl font-bold text-blue-900 tabular-nums">
                  {formatTime(timerElapsedSeconds)}
                </span>
              </div>
              <p className="text-xs text-blue-700 text-center mt-3">
                Démarré à {timerStartTime?.toLocaleTimeString('fr-CA')}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Workflow Tabs */}
        <Tabs defaultValue="tracking" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracking" className="text-xs">
              <Navigation2 className="h-4 w-4 mr-1" />
              Suivi GPS
            </TabsTrigger>
            <TabsTrigger value="photos" className="text-xs" disabled={!isTimerRunning}>
              <Camera className="h-4 w-4 mr-1" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="invoice" className="text-xs" disabled={jobStatus !== 'completing'}>
              <FileText className="h-4 w-4 mr-1" />
              Facture
            </TabsTrigger>
          </TabsList>

          {/* GPS Tracking Tab */}
          <TabsContent value="tracking" className="mt-4">
            <GeofenceTracker
              jobAddress={mockJob.address}
              jobCoordinates={mockJob.coordinates}
              plumberLocation={plumberLocation}
              geofenceRadius={100}
              minDwellTime={3}
              onTimerStart={handleTimerStart}
            />

            {jobStatus === 'en-route' && (
              <Button
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                size="lg"
                onClick={handleStartEnRoute}
              >
                <Navigation2 className="h-4 w-4 mr-2" />
                Démarrer "En route"
              </Button>
            )}
          </TabsContent>

          {/* Photo Progress Tab */}
          <TabsContent value="photos" className="mt-4">
            {isTimerRunning ? (
              <PhotoProgressTracker
                timerStartTime={timerStartTime!}
                intervalMinutes={45}
                onPhotoSubmit={(entry) => {
                  setProgressPhotos((prev) => [...prev, entry]);
                }}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Camera className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Le timer doit être démarré pour prendre des photos</p>
              </div>
            )}
          </TabsContent>

          {/* Invoice Tab */}
          <TabsContent value="invoice" className="mt-4">
            {jobStatus === 'completing' && timerStartTime ? (
              <AutoInvoiceGenerator
                jobId={mockJob.id}
                clientName={mockJob.clientName}
                serviceAddress={mockJob.address}
                serviceType={mockJob.serviceType}
                timerElapsedSeconds={timerElapsedSeconds}
                timerStartTime={timerStartTime}
                distanceTraveled={12.5}
                progressPhotos={progressPhotos}
                hourlyRate={100}
                transportRatePerKm={2}
                onGenerateInvoice={handleInvoiceGenerated}
                onCancel={() => setJobStatus('working')}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Complétez les travaux pour générer la facture</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Complete Work Button */}
        {isTimerRunning && jobStatus === 'working' && (
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            onClick={handleCompleteWork}
          >
            <Check className="h-5 w-5 mr-2" />
            Travaux terminés - Générer facture
          </Button>
        )}
      </div>
    </div>
  );
}
