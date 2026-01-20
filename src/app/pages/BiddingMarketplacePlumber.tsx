import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Filter,
  Search,
  CheckCircle,
  Timer,
  Home,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { JobUrgency } from '../types/bidding';
import { mockDataService } from '../services/mockDataService';
import { useBETAuth } from '../context/BETAuthContext';
import { isPlumber } from '../types/betUser';
import { useNavigate } from 'react-router-dom';

export default function BiddingMarketplacePlumber() {
  const { user } = useBETAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDuration, setBidDuration] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [filter, setFilter] = useState<'all' | 'urgent' | 'normal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [myBids, setMyBids] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Get plumber location from BET user profile
  const plumberLocation = isPlumber(user)
    ? user.coordinates
    : { lat: 45.5017, lng: -73.5673 }; // Fallback to Montreal center

  useEffect(() => {
    loadJobs();

    // Refresh jobs every 5 seconds
    const jobInterval = setInterval(loadJobs, 5000);

    // Update current time every second for countdown
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    // Check for expired bids every 10 seconds
    const expiryInterval = setInterval(checkExpiredBids, 10000);

    // Play sound for new urgent jobs
    const soundInterval = setInterval(checkForNewUrgentJobs, 30000);

    return () => {
      clearInterval(jobInterval);
      clearInterval(timeInterval);
      clearInterval(expiryInterval);
      clearInterval(soundInterval);
    };
  }, []);

  const loadJobs = () => {
    // Get all jobs with status 'in_bet'
    const activeBetJobs = mockDataService.getJobsByStatus('in_bet');

    // Filter by distance (50km for urgent, unlimited for normal)
    const filtered = activeBetJobs.filter((job) => {
      const distance = calculateDistance(
        plumberLocation.lat,
        plumberLocation.lng,
        job.coordinates.lat,
        job.coordinates.lng
      );

      // Urgent jobs: must be within 50km
      if (job.urgency === 'urgent') {
        return distance <= 50;
      }

      // Normal jobs: no distance restriction
      return true;
    });

    setJobs(filtered);
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

  const checkExpiredBids = () => {
    const now = Date.now();

    jobs.forEach((job) => {
      const endTime = new Date(job.biddingEndTime).getTime();
      if (now >= endTime && job.status === 'in_bet') {
        // Bidding expired, select winner
        selectWinner(job.id);
      }
    });
  };

  const selectWinner = (jobId: string) => {
    // Get all bids for this job
    const jobBids = mockDataService.getBidsByJobId(jobId);

    if (jobBids.length === 0) {
      // No bids, cancel job
      mockDataService.updateJob(jobId, {
        status: 'cancelled',
        cancelReason: 'Aucune offre reçue',
      });
      toast.info(`Job ${jobId}: Aucune offre reçue`);
      loadJobs();
      return;
    }

    // Find lowest bid
    const sortedBids = [...jobBids].sort((a, b) => a.amount - b.amount);
    const winningBid = sortedBids[0];

    // Update job status
    mockDataService.updateJob(jobId, {
      status: 'assigned',
      winnerId: winningBid.plumberId,
      winningBid: winningBid.amount,
      assignedAt: new Date(),
    });

    // Notify winner (check if current plumber won)
    if (user && isPlumber(user) && winningBid.plumberId === user.id) {
      // This plumber won
      toast.success(`Félicitations! Vous avez remporté le job ${jobId}!`, {
        duration: 10000,
      });
      playSound();
    }

    loadJobs();
  };

  const checkForNewUrgentJobs = () => {
    const urgentJobs = jobs.filter((j) => j.urgency === 'urgent');
    if (urgentJobs.length > 0) {
      playSound();
    }
  };

  const playSound = () => {
    // In production, play actual sound
    console.log('🔔 Alert sound!');
    try {
      const audio = new Audio('/sounds/alert.mp3');
      audio.play().catch(() => console.log('Sound play blocked'));
    } catch (error) {
      console.log('Sound not available');
    }
  };

  const handleOpenBidDialog = (job: any) => {
    setSelectedJob(job);
    setBidAmount(job.suggestedPrice?.toString() || job.estimatedPrice?.toString() || '');
    setBidDuration(job.estimatedDuration?.toString() || '60');
    setBidMessage('');
    setSelectedTimeSlot('');
  };

  const handleSubmitBid = async () => {
    if (!selectedJob) return;

    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    if (selectedJob.urgency === 'normal' && !selectedTimeSlot) {
      toast.error('Veuillez sélectionner une plage horaire');
      return;
    }

    // Check if bidding still open
    const now = Date.now();
    const endTime = new Date(selectedJob.biddingEndTime).getTime();
    if (now >= endTime) {
      toast.error('La période de soumission est terminée');
      setSelectedJob(null);
      loadJobs();
      return;
    }

    try {
      // Check if user is logged in as plumber
      if (!user || !isPlumber(user)) {
        toast.error('Vous devez être connecté en tant que plombier');
        navigate('/bet-login');
        return;
      }

      // Create bid object
      const bid = {
        id: `BID-${Date.now()}`,
        jobId: selectedJob.id,
        plumberId: user.id, // Use actual plumber ID from BET auth
        plumberName: `${user.firstName} ${user.lastName}`,
        businessName: user.businessName,
        amount,
        estimatedDuration: parseInt(bidDuration),
        message: bidMessage,
        selectedTimeSlot: selectedTimeSlot || null,
        submittedAt: new Date(),
      };

      // Save bid
      mockDataService.addBid(bid);

      // Mark that this plumber has bid
      setMyBids((prev) => new Set(prev).add(selectedJob.id));

      toast.success('Offre soumise avec succès!');
      toast.info('Vous serez notifié si vous remportez l\'appel');

      setSelectedJob(null);

      // Job stays visible in list (don't remove)
      loadJobs();
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Erreur lors de la soumission');
    }
  };

  const getTimeRemaining = (endTime: Date): string => {
    const now = currentTime;
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Expiré';

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes === 0) {
      return `${seconds}s`;
    }

    return `${minutes}m ${seconds}s`;
  };

  const getTimeRemainingClass = (endTime: Date): string => {
    const now = currentTime;
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 60000) return 'text-red-600 font-bold animate-pulse'; // Last minute
    if (diff <= 5 * 60000) return 'text-orange-600 font-semibold'; // Last 5 minutes
    return 'text-gray-700';
  };

  const formatDistance = (lat: number, lng: number): string => {
    const distance = calculateDistance(plumberLocation.lat, plumberLocation.lng, lat, lng);
    return `${distance.toFixed(1)} km`;
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'urgent' && job.urgency === 'urgent') ||
      (filter === 'normal' && job.urgency === 'normal');

    const matchesSearch =
      searchQuery === '' ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.address?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const urgentJobs = filteredJobs.filter((j) => j.urgency === 'urgent');
  const normalJobs = filteredJobs.filter((j) => j.urgency === 'normal');

  const renderJobCard = (job: any) => {
    const timeRemaining = getTimeRemaining(job.biddingEndTime);
    const timeClass = getTimeRemainingClass(job.biddingEndTime);
    const hasBid = myBids.has(job.id);
    const distance = formatDistance(job.coordinates.lat, job.coordinates.lng);

    return (
      <Card
        key={job.id}
        className={`${hasBid ? 'border-green-500 bg-green-50/50' : ''} hover:shadow-lg transition-all`}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {job.id}
                {job.urgency === 'urgent' ? (
                  <Badge variant="destructive" className="animate-pulse">
                    URGENT
                  </Badge>
                ) : (
                  <Badge variant="secondary">Non-urgent</Badge>
                )}
                {hasBid && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Offre soumise
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span className={timeClass}>{timeRemaining}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{job.address}</span>
              <Badge variant="outline" className="text-xs">
                {distance}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">{job.estimatedPrice || job.suggestedPrice} $</span>
                <span className="text-xs text-gray-500">(suggéré)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{job.estimatedDuration || 60} min</span>
              </div>
            </div>
          </div>

          {job.photos && job.photos.length > 0 && (
            <div className="flex gap-2">
              {job.photos.slice(0, 3).map((photo: string, index: number) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
              ))}
              {job.photos.length > 3 && (
                <div className="w-16 h-16 rounded border bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                  +{job.photos.length - 3}
                </div>
              )}
            </div>
          )}

          <div className="pt-2">
            <Button className="w-full" onClick={() => handleOpenBidDialog(job)} disabled={hasBid}>
              {hasBid ? 'Offre déjà soumise' : 'Soumettre une offre'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => navigate('/plumber-dashboard')}
            className="flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Retour au tableau de bord</span>
          </Button>
          {user && isPlumber(user) && (
            <div className="text-right">
              <p className="font-medium text-gray-900">{user.businessName}</p>
              <p className="text-sm text-gray-600">{user.firstName} {user.lastName}</p>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Marché des soumissions (BET)</h1>
        <p className="text-lg text-gray-600">
          Consultez les appels de service disponibles et soumissionnez
        </p>
      </div>

      {/* Filters & Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par mots-clés..."
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filter">Filtrer par urgence</Label>
              <Select value={filter} onValueChange={(val: any) => setFilter(val)}>
                <SelectTrigger id="filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les appels</SelectItem>
                  <SelectItem value="urgent">Urgents uniquement</SelectItem>
                  <SelectItem value="normal">Non-urgents uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={loadJobs}>
                <Filter className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appels urgents</p>
                <p className="text-3xl font-bold text-red-600">{urgentJobs.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appels normaux</p>
                <p className="text-3xl font-bold text-blue-600">{normalJobs.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total disponible</p>
                <p className="text-3xl font-bold text-gray-900">{filteredJobs.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Tabs */}
      <Tabs defaultValue="urgent">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="urgent" className="relative">
            Urgents
            {urgentJobs.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {urgentJobs.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="normal" className="relative">
            Non-urgents
            {normalJobs.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {normalJobs.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="urgent" className="mt-6">
          {urgentJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Aucun appel urgent pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{urgentJobs.map(renderJobCard)}</div>
          )}
        </TabsContent>

        <TabsContent value="normal" className="mt-6">
          {normalJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Aucun appel non-urgent pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{normalJobs.map(renderJobCard)}</div>
          )}
        </TabsContent>
      </Tabs>

      {/* Bid Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Soumettre une offre - {selectedJob?.id}</DialogTitle>
            <DialogDescription>
              {selectedJob?.urgency === 'urgent' ? 'Appel URGENT' : 'Appel non-urgent'} - Temps restant:{' '}
              {selectedJob && (
                <span className={getTimeRemainingClass(selectedJob.biddingEndTime)}>
                  {getTimeRemaining(selectedJob.biddingEndTime)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-4">
              {/* Job Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Description:</p>
                <p className="text-sm text-gray-900">{selectedJob.description}</p>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4" />
                  {selectedJob.address}
                </p>
                {selectedJob.photos && selectedJob.photos.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {selectedJob.photos.map((photo: string, index: number) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Bid Form */}
              <div>
                <Label htmlFor="bidAmount">Montant de votre offre ($)</Label>
                <Input
                  id="bidAmount"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Ex: 250"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Montant suggéré: {selectedJob.suggestedPrice || selectedJob.estimatedPrice} $
                </p>
              </div>

              <div>
                <Label htmlFor="bidDuration">Durée estimée (minutes)</Label>
                <Input
                  id="bidDuration"
                  type="number"
                  value={bidDuration}
                  onChange={(e) => setBidDuration(e.target.value)}
                  placeholder="Ex: 60"
                />
              </div>

              {selectedJob.urgency === 'normal' && selectedJob.timeSlots && (
                <div>
                  <Label>Plage horaire (obligatoire)</Label>
                  <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une plage" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedJob.timeSlots.map((slot: any) => (
                        <SelectItem key={slot.date + slot.startTime} value={`${slot.date} ${slot.startTime}-${slot.endTime}`}>
                          {slot.date} de {slot.startTime} à {slot.endTime}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="bidMessage">Message au client (optionnel)</Label>
                <Input
                  id="bidMessage"
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  placeholder="Ex: Je peux arriver dans 30 minutes..."
                />
              </div>

              {selectedJob.urgency === 'urgent' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800 font-medium">
                    ⚡ Appel urgent: Vous devez arriver dans l'heure après avoir remporté l'offre
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setSelectedJob(null)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleSubmitBid} className="flex-1">
                  Soumettre l'offre
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
