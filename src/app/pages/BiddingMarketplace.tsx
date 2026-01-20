/**
 * Bidding Marketplace - Client View
 * Clients post projects and receive competitive bids from contractors
 */

import { useState } from 'react';
import { Gavel, Clock, DollarSign, Star, CheckCircle, AlertCircle, TrendingUp, Users, Plus, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { BID_PROJECTS, rankBids, type BidProject, type Bid } from '../../data/bids';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function BiddingMarketplace() {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<BidProject | null>(null);
  const [showBidComparison, setShowBidComparison] = useState(false);

  // Filter projects for current user (mock - would use actual user ID)
  const userProjects = BID_PROJECTS;
  const openProjects = userProjects.filter(p => p.status === 'open');
  const closedProjects = userProjects.filter(p => p.status === 'closed' || p.status === 'awarded');

  const handleAcceptBid = (bid: Bid) => {
    toast.success(`Soumission acceptée! Montant: $${bid.bidAmount.toLocaleString()}`);
    // Would update project status to 'awarded'
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 0) return 'Expiré';
    if (hours < 24) return `${hours}h restantes`;
    const days = Math.floor(hours / 24);
    return `${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}`;
  };

  const getBestValueBid = (bids: Bid[]) => {
    const ranked = rankBids(bids);
    return ranked[0];
  };

  const getLowestBid = (bids: Bid[]) => {
    return [...bids].sort((a, b) => a.bidAmount - b.bidAmount)[0];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace de Soumissions</h1>
          <p className="text-gray-600 mt-1">Publiez votre projet et recevez des soumissions compétitives</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Publier un projet
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Projets Actifs</CardTitle>
            <Gavel className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openProjects.length}</div>
            <p className="text-xs text-gray-500 mt-1">En attente de soumissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Soumissions Reçues</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {openProjects.reduce((sum, p) => sum + p.bidCount, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Entrepreneurs intéressés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Économies Moyennes</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">15%</div>
            <p className="text-xs text-gray-500 mt-1">Vs. soumissions traditionnelles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Projets Complétés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedProjects.length}</div>
            <p className="text-xs text-gray-500 mt-1">Entrepreneurs embauchés</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Vos Projets</CardTitle>
            <CardDescription>Cliquez pour voir les soumissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {openProjects.map((project) => {
                const isSelected = selectedProject?.id === project.id;
                const timeLeft = getTimeRemaining(project.deadline);

                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">{project.serviceType}</p>
                        <p className="text-xs text-gray-500 mt-1">{project.address}</p>
                      </div>
                      <Badge className="bg-blue-500 text-white">
                        {project.bidCount} soumissions
                      </Badge>
                    </div>
                    
                    {project.budgetMin && project.budgetMax && (
                      <div className="text-xs text-gray-600 mb-2">
                        Budget: ${project.budgetMin.toLocaleString()} - ${project.budgetMax.toLocaleString()}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className={`font-medium ${
                        timeLeft.includes('h') ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {timeLeft}
                      </span>
                    </div>
                  </div>
                );
              })}

              {openProjects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Gavel className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm">Aucun projet actif</p>
                  <Button className="mt-4" size="sm">
                    Publier un projet
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bid Details */}
        <Card className="lg:col-span-2">
          {selectedProject ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedProject.serviceType}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {selectedProject.address}
                    </CardDescription>
                  </div>
                  <Badge 
                    className={`${
                      selectedProject.status === 'open' ? 'bg-green-500' :
                      selectedProject.status === 'awarded' ? 'bg-blue-500' :
                      'bg-gray-500'
                    } text-white`}
                  >
                    {selectedProject.status === 'open' ? 'Ouvert' :
                     selectedProject.status === 'awarded' ? 'Attribué' : 'Fermé'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Project Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Détails du Projet</h3>
                  <p className="text-sm text-gray-700 mb-4">{selectedProject.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedProject.budgetMin && selectedProject.budgetMax && (
                      <div>
                        <p className="text-gray-600">Budget</p>
                        <p className="font-semibold">
                          ${selectedProject.budgetMin.toLocaleString()} - ${selectedProject.budgetMax.toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Échéancier</p>
                      <p className="font-semibold capitalize">{selectedProject.timeline}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Soumissions reçues</p>
                      <p className="font-semibold">{selectedProject.bidCount} entrepreneurs</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date limite</p>
                      <p className="font-semibold">{getTimeRemaining(selectedProject.deadline)}</p>
                    </div>
                  </div>
                </div>

                {/* Bids Received */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Soumissions Reçues ({selectedProject.bids.length})</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowBidComparison(!showBidComparison)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {showBidComparison ? 'Vue liste' : 'Comparer'}
                    </Button>
                  </div>

                  {!showBidComparison ? (
                    /* List View */
                    <div className="space-y-4">
                      {rankBids(selectedProject.bids).map((bid, index) => {
                        const isBestValue = bid.id === getBestValueBid(selectedProject.bids).id;
                        const isLowest = bid.id === getLowestBid(selectedProject.bids).id;

                        return (
                          <Card key={bid.id} className={`${
                            isBestValue ? 'border-2 border-blue-500 shadow-lg' : ''
                          }`}>
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-bold text-lg">{bid.contractorName}</h4>
                                    {isBestValue && (
                                      <Badge className="bg-blue-500 text-white">⭐ Meilleure Valeur</Badge>
                                    )}
                                    {isLowest && !isBestValue && (
                                      <Badge className="bg-green-500 text-white">💰 Prix Plus Bas</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                      <span className="font-semibold">{bid.contractorRating}/5</span>
                                      <span>({bid.contractorReviews} avis)</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-3xl font-bold text-gray-900">
                                    ${bid.bidAmount.toLocaleString()}
                                  </p>
                                  {selectedProject.budgetMax && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {bid.bidAmount <= selectedProject.budgetMax ? '✓ Dans le budget' : 'Au-dessus du budget'}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Scope of Work */}
                              <div className="mb-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Travaux inclus:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {bid.scopeOfWork.slice(0, 6).map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                      <span>{item}</span>
                                    </div>
                                  ))}
                                </div>
                                {bid.scopeOfWork.length > 6 && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    +{bid.scopeOfWork.length - 6} autres items...
                                  </p>
                                )}
                              </div>

                              {/* Timeline & Warranty */}
                              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                                <div className="bg-gray-50 rounded p-2">
                                  <p className="text-gray-600 text-xs">Début</p>
                                  <p className="font-semibold">{new Date(bid.timeline.startDate).toLocaleDateString('fr-CA')}</p>
                                </div>
                                <div className="bg-gray-50 rounded p-2">
                                  <p className="text-gray-600 text-xs">Durée</p>
                                  <p className="font-semibold">{bid.timeline.duration} jours</p>
                                </div>
                                <div className="bg-gray-50 rounded p-2">
                                  <p className="text-gray-600 text-xs">Garantie</p>
                                  <p className="font-semibold">{bid.warranty.labor} ans</p>
                                </div>
                              </div>

                              {/* Notes */}
                              {bid.notes && (
                                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                                  <p className="text-xs font-semibold text-blue-900 mb-1">Note de l'entrepreneur:</p>
                                  <p className="text-sm text-blue-800">{bid.notes}</p>
                                </div>
                              )}

                              {/* Actions */}
                              {bid.status === 'pending' && (
                                <div className="flex gap-3">
                                  <Button 
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => handleAcceptBid(bid)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Accepter cette soumission
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    Demander clarification
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    /* Comparison View */
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-3 border-b font-semibold text-sm">Entrepreneur</th>
                            <th className="text-center p-3 border-b font-semibold text-sm">Prix</th>
                            <th className="text-center p-3 border-b font-semibold text-sm">Note</th>
                            <th className="text-center p-3 border-b font-semibold text-sm">Début</th>
                            <th className="text-center p-3 border-b font-semibold text-sm">Durée</th>
                            <th className="text-center p-3 border-b font-semibold text-sm">Garantie</th>
                            <th className="text-center p-3 border-b font-semibold text-sm">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rankBids(selectedProject.bids).map((bid) => {
                            const isBestValue = bid.id === getBestValueBid(selectedProject.bids).id;
                            
                            return (
                              <tr key={bid.id} className={`border-b hover:bg-gray-50 ${
                                isBestValue ? 'bg-blue-50' : ''
                              }`}>
                                <td className="p-3">
                                  <div>
                                    <p className="font-semibold text-sm">{bid.contractorName}</p>
                                    {isBestValue && (
                                      <Badge className="bg-blue-500 text-white text-xs mt-1">⭐ Meilleure Valeur</Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-center">
                                  <p className="font-bold">${bid.bidAmount.toLocaleString()}</p>
                                </td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="font-semibold">{bid.contractorRating}</span>
                                  </div>
                                  <p className="text-xs text-gray-500">({bid.contractorReviews})</p>
                                </td>
                                <td className="p-3 text-center text-sm">
                                  {new Date(bid.timeline.startDate).toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' })}
                                </td>
                                <td className="p-3 text-center text-sm">{bid.timeline.duration} jours</td>
                                <td className="p-3 text-center text-sm">{bid.warranty.labor} ans</td>
                                <td className="p-3 text-center">
                                  <Button 
                                    size="sm"
                                    onClick={() => handleAcceptBid(bid)}
                                  >
                                    Accepter
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center text-gray-500">
                <Gavel className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium">Sélectionnez un projet</p>
                <p className="text-sm mt-2">Cliquez sur un projet pour voir les soumissions reçues</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
