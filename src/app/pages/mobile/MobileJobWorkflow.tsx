import React, { useState, useEffect } from 'react';
import { ArrowLeft, Navigation2, Clock, Camera, FileText, Check, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { GeofenceTracker } from '../../components/tracking/GeofenceTracker';
import { PhotoProgressTracker } from '../../components/tracking/PhotoProgressTracker';
import { AutoInvoiceGenerator } from '../../components/invoice/AutoInvoiceGenerator';
import { toast } from 'sonner';
import { mockDataService } from '../../services/mockDataService';

// GPS route simulation
interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: Date;
}

export default function MobileJobWorkflow() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  // Load job from mockDataService
  const [job, setJob] = useState<any>(null);
  const [jobStatus, setJobStatus] = useState<'en-route' | 'on-site' | 'working' | 'completing' | 'completed'>('en-route');
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);
  const [timerElapsedSeconds, setTimerElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [plumberLocation, setPlumberLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [progressPhotos, setProgressPhotos] = useState<any[]>([]);
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);

  // Load job data
  useEffect(() => {
    if (!jobId) return;

    const loadedJob = mockDataService.getJobById(jobId);
    if (!loadedJob) {
      toast.error('Job non trouvé');
      navigate('/mobile/jobs');
      return;
    }

    setJob(loadedJob);

    // Generate route from random start location to job location
    const startLat = loadedJob.coordinates.lat + (Math.random() - 0.5) * 0.05; // ~5km away
    const startLng = loadedJob.coordinates.lng + (Math.random() - 0.5) * 0.05;

    const generatedRoute = generateRoute(
      { lat: startLat, lng: startLng },
      loadedJob.coordinates,
      20 // 20 waypoints
    );

    setRoute(generatedRoute);
    setPlumberLocation({ lat: startLat, lng: startLng });

    // Update job status to en_route if assigned
    if (loadedJob.status === 'assigned') {
      mockDataService.updateJob(jobId, {
        status: 'en_route',
        enRouteAt: new Date(),
      });
    }
  }, [jobId, navigate]);

  // Generate realistic route between two points
  const generateRoute = (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number },
    numPoints: number
  ): RoutePoint[] => {
    const points: RoutePoint[] = [];
    const now = new Date();

    for (let i = 0; i <= numPoints; i++) {
      const ratio = i / numPoints;

      // Add some curve to make it more realistic
      const curveFactor = Math.sin(ratio * Math.PI) * 0.002;

      const lat = start.lat + (end.lat - start.lat) * ratio + curveFactor;
      const lng = start.lng + (end.lng - start.lng) * ratio + curveFactor;

      points.push({
        lat,
        lng,
        timestamp: new Date(now.getTime() + i * 30000), // 30 seconds between points
      });
    }

    return points;
  };

  // Simulate GPS movement along route
  useEffect(() => {
    if (jobStatus !== 'en-route' || route.length === 0) return;

    const interval = setInterval(() => {
      setRouteIndex((prev) => {
        const nextIndex = prev + 1;

        if (nextIndex >= route.length) {
          // Reached destination
          const finalPoint = route[route.length - 1];
          setPlumberLocation(finalPoint);
          return prev; // Stop updating
        }

        const nextPoint = route[nextIndex];
        setPlumberLocation(nextPoint);

        // Save location to mockDataService for client tracking
        if (job) {
          mockDataService.updateJob(job.id, {
            plumberLocation: nextPoint,
            lastLocationUpdate: new Date(),
          });
        }

        return nextIndex;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [jobStatus, route, job]);

  // Update timer
  useEffect(() => {
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

    if (job) {
      mockDataService.updateJob(job.id, {
        status: 'en_route',
        enRouteAt: new Date(),
      });
    }
  };

  const handleTimerStart = () => {
    const startTime = new Date();
    setTimerStartTime(startTime);
    setIsTimerRunning(true);
    setJobStatus('working');
    toast.success('Timer démarré automatiquement!');

    if (job) {
      mockDataService.updateJob(job.id, {
        status: 'in_progress',
        startedAt: startTime,
        timerId: `TIMER-${Date.now()}`,
      });
    }
  };

  const handleCompleteWork = () => {
    setJobStatus('completing');
    setIsTimerRunning(false);
    toast.info('Préparation de la facture...');

    if (job) {
      mockDataService.updateJob(job.id, {
        status: 'completing',
        workDuration: timerElapsedSeconds,
      });
    }
  };

  const handleInvoiceGenerated = (invoiceData: any) => {
    console.log('Invoice generated:', invoiceData);
    setJobStatus('completed');

    if (job) {
      // Create invoice record
      const invoice = {
        id: `INV-${Date.now()}`,
        jobId: job.id,
        clientId: job.clientId,
        plumberId: job.plumberId || 'plumber-1',
        amount: invoiceData.total,
        subtotal: invoiceData.subtotal,
        taxes: invoiceData.taxes,
        items: invoiceData.items,
        workDescription: invoiceData.workDescription,
        photos: [...progressPhotos.map((p) => p.photoPreview), ...invoiceData.finalPhotos],
        createdAt: new Date(),
        status: 'pending',
      };

      // Update job
      mockDataService.updateJob(job.id, {
        status: 'completed',
        completedAt: new Date(),
        invoiceId: invoice.id,
        finalPhotos: invoiceData.finalPhotos,
        workDescription: invoiceData.workDescription,
      });

      toast.success('Job complété! Le client va recevoir la facture.');

      // Navigate to completed jobs
      setTimeout(() => {
        navigate('/plumber/payments');
      }, 2000);
    }
  };

  const handlePhotoSubmit = (entry: any) => {
    setProgressPhotos((prev) => [...prev, entry]);

    // Save photo to mockDataService (in production, upload to server)
    console.log('Photo submitted:', entry);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getStatusBadge = () => {
    switch (jobStatus) {
      case 'en-route':
        return <Badge className="bg-blue-600">En route</Badge>;
      case 'working':
        return <Badge className="bg-green-600">En cours</Badge>;
      case 'completing':
        return <Badge className="bg-orange-600">Finalisation</Badge>;
      case 'completed':
        return <Badge className="bg-gray-600">Complété</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (degrees: number): number => {
    return (degrees * Math.PI) / 180;
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du job...</p>
        </div>
      </div>
    );
  }

  const distanceToJob =
    plumberLocation && calculateDistance(plumberLocation.lat, plumberLocation.lng, job.coordinates.lat, job.coordinates.lng);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="text-center flex-1">
            <h1 className="font-semibold text-lg">{job.clientName || 'Client'}</h1>
            <p className="text-xs text-gray-500">{job.serviceType || job.description?.substring(0, 30)}</p>
          </div>

          {getStatusBadge()}
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
              <span className="text-gray-600">Job ID:</span>
              <p className="font-medium">{job.id}</p>
            </div>

            <div>
              <span className="text-gray-600">Adresse:</span>
              <p className="font-medium">{job.address}</p>
            </div>

            <div>
              <span className="text-gray-600">Description:</span>
              <p className="font-medium">{job.description}</p>
            </div>

            {distanceToJob !== null && distanceToJob !== false && (
              <div>
                <span className="text-gray-600">Distance:</span>
                <p className="font-medium text-blue-600">
                  {distanceToJob < 1 ? `${Math.round(distanceToJob * 1000)} m` : `${distanceToJob.toFixed(1)} km`}
                </p>
              </div>
            )}

            {job.urgency === 'urgent' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-red-800 font-medium">Appel URGENT - Arriver dans l'heure</span>
                </div>
              </div>
            )}

            {job.winningBid && (
              <div>
                <span className="text-gray-600">Montant de l'offre:</span>
                <p className="font-medium text-green-600">{job.winningBid} $</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Actions */}
        {jobStatus === 'en-route' && routeIndex >= route.length - 1 && (
          <Card>
            <CardContent className="pt-6">
              <Button className="w-full" size="lg" onClick={handleStartEnRoute}>
                <Navigation2 className="h-5 w-5 mr-2" />
                Confirmer l'arrivée sur place
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="tracking" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracking">
              <Navigation2 className="h-4 w-4 mr-2" />
              GPS
            </TabsTrigger>
            <TabsTrigger value="photos" disabled={!isTimerRunning}>
              <Camera className="h-4 w-4 mr-2" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="invoice" disabled={jobStatus !== 'completing' && jobStatus !== 'completed'}>
              <FileText className="h-4 w-4 mr-2" />
              Facture
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="mt-4">
            <GeofenceTracker
              jobAddress={job.address}
              jobCoordinates={job.coordinates}
              plumberLocation={plumberLocation}
              geofenceRadius={100}
              minDwellTime={3}
              onTimerStart={handleTimerStart}
            />
          </TabsContent>

          <TabsContent value="photos" className="mt-4">
            {timerStartTime ? (
              <PhotoProgressTracker
                timerStartTime={timerStartTime}
                intervalMinutes={45}
                onPhotoSubmit={handlePhotoSubmit}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Le suivi de photos démarrera quand le timer sera activé</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="invoice" className="mt-4">
            {(jobStatus === 'completing' || jobStatus === 'completed') && (
              <AutoInvoiceGenerator
                jobId={job.id}
                workDuration={timerElapsedSeconds}
                bidAmount={job.winningBid || job.suggestedPrice || job.estimatedPrice || 0}
                progressPhotos={progressPhotos}
                onInvoiceGenerated={handleInvoiceGenerated}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Complete Work Button */}
        {isTimerRunning && jobStatus === 'working' && (
          <Card>
            <CardContent className="pt-6">
              <Button className="w-full bg-green-600 hover:bg-green-700" size="lg" onClick={handleCompleteWork}>
                <Check className="h-5 w-5 mr-2" />
                Travail terminé - Générer facture
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Timer Display (sticky bottom) */}
        {isTimerRunning && (
          <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 shadow-lg z-20">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                <span className="font-medium">Temps écoulé:</span>
              </div>
              <span className="text-3xl font-bold tabular-nums">{formatTime(timerElapsedSeconds)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
