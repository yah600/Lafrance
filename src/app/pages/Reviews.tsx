import { useState } from 'react';
import { Star, TrendingUp, Award, MessageSquare, Mail, ThumbsUp, Filter, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

interface Review {
  id: string;
  clientName: string;
  technicianName: string;
  technicianId: string;
  jobId: string;
  rating: number;
  comment: string;
  serviceType: string;
  createdAt: string;
  source: 'email' | 'sms' | 'google' | 'manual';
  responded: boolean;
  response?: string;
}

// Mock data
const mockReviews: Review[] = [
  {
    id: '1',
    clientName: 'Marie Tremblay',
    technicianName: 'Pierre Gagnon',
    technicianId: 'tech-1',
    jobId: 'job-123',
    rating: 5,
    comment: 'Service exceptionnel! Pierre est arrivé à l\'heure, a bien expliqué le problème et a tout réparé rapidement. Très professionnel!',
    serviceType: 'Débouchage',
    createdAt: '2024-12-15T10:30:00',
    source: 'email',
    responded: true,
    response: 'Merci beaucoup Marie! C\'était un plaisir de vous aider. N\'hésitez pas à nous contacter pour vos futurs besoins!',
  },
  {
    id: '2',
    clientName: 'Jean Dupont',
    technicianName: 'Marc Leblanc',
    technicianId: 'tech-2',
    jobId: 'job-124',
    rating: 5,
    comment: 'Excellent travail! Marc a installé mon nouveau chauffe-eau rapidement et proprement. Je recommande!',
    serviceType: 'Chauffe-eau',
    createdAt: '2024-12-14T14:20:00',
    source: 'google',
    responded: false,
  },
  {
    id: '3',
    clientName: 'Sophie Martin',
    technicianName: 'Pierre Gagnon',
    technicianId: 'tech-1',
    jobId: 'job-125',
    rating: 4,
    comment: 'Bon service, mais le délai d\'attente était un peu long. Le travail a été bien fait une fois sur place.',
    serviceType: 'Clapet anti-retour',
    createdAt: '2024-12-13T09:15:00',
    source: 'sms',
    responded: true,
    response: 'Merci pour votre retour Sophie. Nous sommes désolés pour l\'attente et travaillons à améliorer nos délais.',
  },
  {
    id: '4',
    clientName: 'Luc Gendron',
    technicianName: 'Marc Leblanc',
    technicianId: 'tech-2',
    jobId: 'job-126',
    rating: 5,
    comment: 'Parfait! Très satisfait du service. Marc a pris le temps de tout m\'expliquer.',
    serviceType: 'Pompe de puisard',
    createdAt: '2024-12-12T16:45:00',
    source: 'email',
    responded: false,
  },
];

// Calculate technician stats
const calculateTechnicianStats = (reviews: Review[]) => {
  const techStats: Record<string, { 
    name: string;
    totalReviews: number;
    averageRating: number;
    fiveStars: number;
    fourStars: number;
    threeStars: number;
    twoStars: number;
    oneStar: number;
  }> = {};

  reviews.forEach(review => {
    if (!techStats[review.technicianId]) {
      techStats[review.technicianId] = {
        name: review.technicianName,
        totalReviews: 0,
        averageRating: 0,
        fiveStars: 0,
        fourStars: 0,
        threeStars: 0,
        twoStars: 0,
        oneStar: 0,
      };
    }

    const stats = techStats[review.technicianId];
    stats.totalReviews++;
    
    if (review.rating === 5) stats.fiveStars++;
    else if (review.rating === 4) stats.fourStars++;
    else if (review.rating === 3) stats.threeStars++;
    else if (review.rating === 2) stats.twoStars++;
    else if (review.rating === 1) stats.oneStar++;
  });

  // Calculate averages
  Object.values(techStats).forEach(stats => {
    const total = stats.fiveStars * 5 + stats.fourStars * 4 + stats.threeStars * 3 + stats.twoStars * 2 + stats.oneStar * 1;
    stats.averageRating = total / stats.totalReviews;
  });

  return Object.values(techStats).sort((a, b) => b.averageRating - a.averageRating);
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'responded' | 'leaderboard'>('all');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [responseText, setResponseText] = useState('');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  const filteredReviews = reviews.filter(review => {
    if (activeTab === 'pending') return !review.responded;
    if (activeTab === 'responded') return review.responded;
    if (filterRating !== 'all') return review.rating === parseInt(filterRating);
    return true;
  });

  const handleRespond = (reviewId: string) => {
    if (!responseText.trim()) {
      toast.error('Veuillez entrer une réponse');
      return;
    }

    setReviews(reviews.map(r => 
      r.id === reviewId 
        ? { ...r, responded: true, response: responseText }
        : r
    ));

    setResponseText('');
    setRespondingTo(null);
    toast.success('Réponse publiée avec succès!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const pendingCount = reviews.filter(r => !r.responded).length;
  const techStats = calculateTechnicianStats(reviews);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Avis clients</h1>
        <p className="text-muted-foreground mt-1">Gérez et répondez aux avis clients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">{reviews.length}</p>
              </div>
              <MessageSquare className="h-10 w-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-yellow-600">{avgRating}</p>
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <TrendingUp className="h-10 w-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-3xl font-bold text-blue-600">{pendingCount}</p>
              </div>
              <Mail className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">5 étoiles</p>
                <p className="text-3xl font-bold text-green-600">
                  {reviews.filter(r => r.rating === 5).length}
                </p>
              </div>
              <ThumbsUp className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Tous ({reviews.length})</TabsTrigger>
            <TabsTrigger value="pending">En attente ({pendingCount})</TabsTrigger>
            <TabsTrigger value="responded">Répondus ({reviews.filter(r => r.responded).length})</TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Award className="h-4 w-4 mr-2" />
              Classement
            </TabsTrigger>
          </TabsList>

          {activeTab !== 'leaderboard' && (
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les notes</SelectItem>
                <SelectItem value="5">5 étoiles</SelectItem>
                <SelectItem value="4">4 étoiles</SelectItem>
                <SelectItem value="3">3 étoiles</SelectItem>
                <SelectItem value="2">2 étoiles</SelectItem>
                <SelectItem value="1">1 étoile</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Reviews List */}
        <TabsContent value={activeTab} className="mt-6">
          {activeTab === 'leaderboard' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {techStats.map((tech, index) => (
                <Card key={tech.name} className={`${index === 0 ? 'border-yellow-400 border-2 shadow-lg' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-[var(--primary)] text-white">
                            {tech.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-lg">{tech.name}</p>
                          {index === 0 && (
                            <Badge className="bg-yellow-400 text-yellow-900 mt-1">
                              <Award className="h-3 w-3 mr-1" />
                              #1 Meilleur technicien
                            </Badge>
                          )}
                        </div>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Note moyenne</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-yellow-600">{tech.averageRating.toFixed(1)}</span>
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total d'avis</span>
                      <span className="font-semibold">{tech.totalReviews}</span>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          5 étoiles
                        </span>
                        <span className="font-medium">{tech.fiveStars}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          4 étoiles
                        </span>
                        <span className="font-medium">{tech.fourStars}</span>
                      </div>
                      {tech.threeStars > 0 && (
                        <div className="flex items-center justify-between text-sm text-yellow-600">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            3 étoiles
                          </span>
                          <span className="font-medium">{tech.threeStars}</span>
                        </div>
                      )}
                      {(tech.twoStars > 0 || tech.oneStar > 0) && (
                        <div className="flex items-center justify-between text-sm text-red-600">
                          <span>Moins de 3⭐</span>
                          <span className="font-medium">{tech.twoStars + tech.oneStar}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun avis à afficher</p>
                  </CardContent>
                </Card>
              ) : (
                filteredReviews.map((review) => (
                  <Card key={review.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-900">
                              {review.clientName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{review.clientName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-muted-foreground">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline">{review.serviceType}</Badge>
                          <Badge variant="secondary" className="text-xs">
                            {review.source === 'google' && 'Google'}
                            {review.source === 'email' && 'Email'}
                            {review.source === 'sms' && 'SMS'}
                            {review.source === 'manual' && 'Manuel'}
                          </Badge>
                          {review.responded && (
                            <Badge className="bg-green-100 text-green-800">
                              Répondu
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Review comment */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{review.comment}</p>
                      </div>

                      {/* Technician info */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Technicien: <span className="font-medium text-gray-900">{review.technicianName}</span></span>
                      </div>

                      {/* Response */}
                      {review.responded && review.response && (
                        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                          <p className="text-sm font-semibold text-blue-900 mb-2">
                            Réponse de l'entreprise:
                          </p>
                          <p className="text-sm text-blue-800">{review.response}</p>
                        </div>
                      )}

                      {/* Respond button */}
                      {!review.responded && (
                        <div className="pt-4 border-t">
                          {respondingTo === review.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Rédigez votre réponse..."
                                className="w-full p-3 border rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleRespond(review.id)}
                                  className="bg-[var(--primary)]"
                                >
                                  Publier la réponse
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setRespondingTo(null);
                                    setResponseText('');
                                  }}
                                >
                                  Annuler
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setRespondingTo(review.id)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Répondre à cet avis
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
