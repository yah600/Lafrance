import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, DollarSign, Clock, Briefcase, Filter, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BidTimer } from '../components/bidding/BidTimer';
import { toast } from 'sonner';
import { BiddingJob, JobUrgency, BidStatus, Bid } from '../types/bidding';

// Mock data
const mockJobs: BiddingJob[] = [
  {
    id: '1',
    clientId: 'client1',
    title: 'Fuite d\'eau urgente - Cuisine',
    description: 'Service requis: Fuite sous l\'évier de cuisine. URGENT - Le client nécessite une intervention professionnelle rapide. Photos disponibles: 3. Adresse: 1234 Rue Principale, Montréal.',
    originalDescription: 'J\'ai une fuite d\'eau sous mon évier...',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    urgency: JobUrgency.URGENT,
    serviceType: 'Réparation fuite',
    estimatedDuration: 60,
    suggestedPrice: 250,
    address: '1234 Rue Principale, Montréal, QC H1A 1A1',
    coordinates: { lat: 45.5017, lng: -73.5673 },
    serviceRadius: 50,
    createdAt: new Date(),
    biddingStartTime: new Date(),
    biddingEndTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    preferredTimeSlots: [],
    status: BidStatus.ACTIVE,
    winnerId: null,
    winningBid: null,
    languagePreference: [],
    requiresInsurance: true,
    requiresRBQ: true,
    depositAmount: 150,
    depositStatus: 'authorized',
  },
  {
    id: '2',
    clientId: 'client2',
    title: 'Installation chauffe-eau',
    description: 'Service requis: Installation d\'un nouveau chauffe-eau électrique 40 gallons. Le client nécessite une intervention professionnelle rapide. Photos disponibles: 2.',
    originalDescription: 'Je veux installer un nouveau chauffe-eau...',
    photos: ['photo1.jpg', 'photo2.jpg'],
    urgency: JobUrgency.NORMAL,
    serviceType: 'Installation chauffe-eau',
    estimatedDuration: 180,
    suggestedPrice: 600,
    address: '5678 Avenue des Érables, Laval, QC H7A 2B2',
    coordinates: { lat: 45.6066, lng: -73.7124 },
    serviceRadius: 50,
    createdAt: new Date(),
    biddingStartTime: new Date(),
    biddingEndTime: new Date(Date.now() + 120 * 60 * 1000), // 2 hours
    preferredTimeSlots: [
      { id: '1', date: '2026-01-22', startTime: '09:00', endTime: '12:00', available: true },
      { id: '2', date: '2026-01-22', startTime: '13:00', endTime: '17:00', available: true },
    ],
    status: BidStatus.ACTIVE,
    winnerId: null,
    winningBid: null,
    languagePreference: [],
    requiresInsurance: true,
    requiresRBQ: true,
    depositAmount: 100,
    depositStatus: 'authorized',
  },
];

export default function BiddingMarketplacePlumber() {
  const [jobs, setJobs] = useState<BiddingJob[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<BiddingJob | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDuration, setBidDuration] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [filter, setFilter] = useState<'all' | 'urgent' | 'normal'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate real-time job notifications
    const playSound = () => {
      // In production, play actual sound
      console.log('🔔 New job alert!');
    };

    // Check for new urgent jobs every 30 seconds
    const interval = setInterval(() => {
      // Simulate new jobs
      if (Math.random() > 0.9) {
        playSound();
        toast.info('Nouveau appel urgent disponible!', {
          duration: 5000,
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenBidDialog = (job: BiddingJob) => {
    setSelectedJob(job);
    setBidAmount(job.suggestedPrice.toString());
    setBidDuration(job.estimatedDuration.toString());
    setBidMessage('');
    setSelectedTimeSlot('');
  };

  const handleSubmitBid = () => {
    if (!selectedJob) return;

    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    if (selectedJob.urgency === JobUrgency.NORMAL && !selectedTimeSlot) {
      toast.error('Veuillez sélectionner une plage horaire');
      return;
    }

    // Submit bid
    toast.success('Offre soumise avec succès!');
    setSelectedJob(null);

    // Remove job from list (already bid)
    setJobs(jobs.filter((j) => j.id !== selectedJob.id));
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'urgent' && job.urgency === JobUrgency.URGENT) ||
      (filter === 'normal' && job.urgency === JobUrgency.NORMAL);

    const matchesSearch =
      searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const urgentJobs = filteredJobs.filter((j) => j.urgency === JobUrgency.URGENT);
  const normalJobs = filteredJobs.filter((j) => j.urgency === JobUrgency.NORMAL);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
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
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Plus de filtres
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
              <Badge variant="destructive" className="ml-2 animate-pulse">
                {urgentJobs.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="normal">
            Non-urgents
            {normalJobs.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {normalJobs.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="urgent" className="space-y-6 mt-6">
          {urgentJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">Aucun appel urgent pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            urgentJobs.map((job) => (
              <Card key={job.id} className="border-red-300 border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <Badge variant="destructive">URGENT</Badge>
                      </div>
                      <CardDescription>{job.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <BidTimer endTime={job.biddingEndTime} urgent onExpire={() => {
                    toast.info('Période de soumission expirée');
                    setJobs(jobs.filter((j) => j.id !== job.id));
                  }} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{job.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        Prix suggéré: <strong>{job.suggestedPrice} $</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">~{job.estimatedDuration} min</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {job.photos.slice(0, 3).map((_, index) => (
                      <div
                        key={index}
                        className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs"
                      >
                        Photo {index + 1}
                      </div>
                    ))}
                    {job.photos.length > 3 && (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium">
                        +{job.photos.length - 3}
                      </div>
                    )}
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => handleOpenBidDialog(job)}
                  >
                    Soumettre une offre
                  </Button>

                  <p className="text-xs text-red-700 text-center font-medium">
                    ⚠️ Attention: Une fois engagé, vous ne pouvez plus reculer. Des pénalités s'appliquent en cas d'annulation.
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="normal" className="space-y-6 mt-6">
          {normalJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">Aucun appel non-urgent pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            normalJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription>{job.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <BidTimer endTime={job.biddingEndTime} onExpire={() => {
                    toast.info('Période de soumission expirée');
                    setJobs(jobs.filter((j) => j.id !== job.id));
                  }} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{job.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        Prix suggéré: <strong>{job.suggestedPrice} $</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">~{job.estimatedDuration} min</span>
                    </div>
                  </div>

                  {job.preferredTimeSlots.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-900 mb-2">Plages horaires disponibles:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.preferredTimeSlots.map((slot) => (
                          <Badge key={slot.id} variant="outline" className="bg-white">
                            {new Date(slot.date).toLocaleDateString('fr-CA')} • {slot.startTime} - {slot.endTime}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => handleOpenBidDialog(job)}
                  >
                    Soumettre une offre
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Bid Dialog */}
      <Dialog open={selectedJob !== null} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>Soumettre votre offre</DialogTitle>
                <DialogDescription>{selectedJob.title}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="bidAmount">Montant de votre offre (CAD) *</Label>
                  <Input
                    id="bidAmount"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="250"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Prix suggéré par la plateforme: {selectedJob.suggestedPrice} $
                  </p>
                </div>

                <div>
                  <Label htmlFor="bidDuration">Durée estimée (minutes) *</Label>
                  <Input
                    id="bidDuration"
                    type="number"
                    value={bidDuration}
                    onChange={(e) => setBidDuration(e.target.value)}
                    placeholder="60"
                  />
                </div>

                {selectedJob.urgency === JobUrgency.NORMAL && (
                  <div>
                    <Label htmlFor="timeSlot">Choisir une plage horaire *</Label>
                    <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                      <SelectTrigger id="timeSlot">
                        <SelectValue placeholder="Sélectionner une plage horaire" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedJob.preferredTimeSlots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {new Date(slot.date).toLocaleDateString('fr-CA')} • {slot.startTime} -{' '}
                            {slot.endTime}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="bidMessage">Message au client (optionnel)</Label>
                  <Textarea
                    id="bidMessage"
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    placeholder="Décrivez votre expertise, votre approche, etc."
                    rows={3}
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800 font-medium mb-2">
                    ⚠️ Attention - Engagement ferme
                  </p>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>• Une fois votre offre acceptée, vous ne pouvez plus reculer</li>
                    <li>• Annulation après acceptation: pénalité de 50 $ CAD</li>
                    <li>• Non-présentation: pénalité de 100 $ CAD</li>
                    {selectedJob.urgency === JobUrgency.URGENT && (
                      <li>• Arrivée dans l'heure requise, sinon pénalité de 25 $ CAD</li>
                    )}
                  </ul>
                </div>

                <Button size="lg" className="w-full" onClick={handleSubmitBid}>
                  Confirmer et soumettre l'offre
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
