/**
 * Contractor Bid Management
 * Contractors view opportunities and submit bids
 */

import { useState } from 'react';
import { Gavel, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle, Send, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { getOpenBidProjects, CONTRACTOR_BID_STATS, type BidProject } from '../../data/bids';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function ContractorBids() {
  const { user, activeDivision } = useAuth();
  const [selectedOpportunity, setSelectedOpportunity] = useState<BidProject | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidNotes, setBidNotes] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);

  const openOpportunities = getOpenBidProjects().filter(project =>
    !activeDivision || project.division === activeDivision
  );

  const stats = CONTRACTOR_BID_STATS[0]; // Using sample stats

  const handleSubmitBid = () => {
    if (!bidAmount) {
      toast.error('Veuillez entrer un montant');
      return;
    }
    
    toast.success(`Soumission envoyée! Montant: $${parseInt(bidAmount).toLocaleString()}`);
    setShowBidForm(false);
    setBidAmount('');
    setBidNotes('');
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 0) return 'Expiré';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}j`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Opportunités de Soumission</h1>
        <p className="text-gray-600 mt-1">Soumissionnez sur des projets dans votre région</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Opportunités Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openOpportunities.length}</div>
            <p className="text-xs text-gray-500 mt-1">Projets disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taux de Réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.winRate}%</div>
            <p className="text-xs text-gray-500 mt-1">30 derniers jours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Soumissions Gagnées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.bidsWon}</div>
            <p className="text-xs text-gray-500 mt-1">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenu Généré</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">30 derniers jours</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      {stats.insights && stats.insights.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base">💡 Conseils pour Améliorer</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.insights.map((insight, index) => (
                <li key={index} className="text-sm text-blue-900 flex items-start gap-2">
                  <span className="text-blue-600 flex-shrink-0">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Opportunities List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Opportunités</CardTitle>
            <CardDescription>Cliquez pour voir les détails</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {openOpportunities.map((opportunity) => {
                const isSelected = selectedOpportunity?.id === opportunity.id;

                return (
                  <div
                    key={opportunity.id}
                    onClick={() => setSelectedOpportunity(opportunity)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{opportunity.serviceType}</p>
                        <p className="text-xs text-gray-500 mt-1">{opportunity.address.split(',')[0]}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeRemaining(opportunity.deadline)}
                      </Badge>
                    </div>

                    {opportunity.budgetMin && opportunity.budgetMax && (
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">
                          ${opportunity.budgetMin.toLocaleString()} - ${opportunity.budgetMax.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{opportunity.bidCount} soumissions</span>
                      {opportunity.heatLossRating && (
                        <Badge variant="outline" className="text-xs">
                          Perte chaleur: {opportunity.heatLossRating}/10
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}

              {openOpportunities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Gavel className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm">Aucune opportunité disponible</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="lg:col-span-2">
          {selectedOpportunity ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedOpportunity.serviceType}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {selectedOpportunity.address}
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowBidForm(!showBidForm)}>
                    {showBidForm ? 'Annuler' : 'Soumissionner'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!showBidForm ? (
                  <>
                    {/* Project Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Description du Projet</h3>
                      <p className="text-sm text-gray-700 mb-4">{selectedOpportunity.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {selectedOpportunity.budgetMin && selectedOpportunity.budgetMax && (
                          <div>
                            <p className="text-gray-600">Budget du Client</p>
                            <p className="font-semibold text-lg text-green-700">
                              ${selectedOpportunity.budgetMin.toLocaleString()} - ${selectedOpportunity.budgetMax.toLocaleString()}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-600">Échéancier</p>
                          <p className="font-semibold capitalize">{selectedOpportunity.timeline}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Compétiteurs</p>
                          <p className="font-semibold">{selectedOpportunity.bidCount} entrepreneurs</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date Limite</p>
                          <p className="font-semibold">{getTimeRemaining(selectedOpportunity.deadline)} restant</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-900">Recommandation IA</p>
                          <p className="text-sm text-blue-800 mt-1">
                            Soumission suggérée: ${Math.round((selectedOpportunity.budgetMin! + selectedOpportunity.budgetMax!) / 2).toLocaleString()}
                          </p>
                          <p className="text-xs text-blue-700 mt-2">
                            Basé sur votre taux de réussite ({stats.winRate}%), nous recommandons de soumissionner 
                            près de la moyenne du budget pour maximiser vos chances.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Thermal Data */}
                    {selectedOpportunity.heatLossRating && (
                      <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-orange-900">Données Thermiques Disponibles</p>
                            <p className="text-sm text-orange-800 mt-1">
                              Perte de chaleur: {selectedOpportunity.heatLossRating}/10 (Élevé)
                            </p>
                            <p className="text-xs text-orange-700 mt-2">
                              Cette propriété présente une perte de chaleur élevée. Considérez inclure 
                              des travaux d'isolation supplémentaires dans votre soumission.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3D Model Placeholder */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 text-center">
                      <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="font-semibold text-gray-900 mb-2">Modèle 3D de la Propriété</p>
                      <p className="text-sm text-gray-600 mb-4">
                        Visualisez la propriété et les mesures estimées
                      </p>
                      <Button variant="outline" size="sm">
                        Voir le modèle 3D
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Bid Submission Form */
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-sm font-semibold text-blue-900 mb-2">
                        Budget du client: ${selectedOpportunity.budgetMin?.toLocaleString()} - ${selectedOpportunity.budgetMax?.toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-700">
                        Votre soumission sera visible par le client une fois envoyée. 
                        Vous pourrez la modifier une seule fois avant la date limite.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bidAmount">Montant de votre soumission *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="bidAmount"
                          type="number"
                          placeholder="9500"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          className="pl-10 text-lg font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bidNotes">Notes Additionnelles (Optionnel)</Label>
                      <Textarea
                        id="bidNotes"
                        placeholder="Ex: Basé sur l'image thermique, je recommande une mise à niveau de l'isolation pour prévenir les futurs barrages de glace. Heureux de fournir un forfait combiné avec 15% de rabais."
                        value={bidNotes}
                        onChange={(e) => setBidNotes(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-semibold mb-2">Votre soumission inclura automatiquement:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Votre note de {stats.winRate}% ({CONTRACTOR_BID_STATS[0].contractorReviews} avis)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Vos termes de paiement standard (10% dépôt)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Votre garantie standard (5 ans main-d'œuvre)
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowBidForm(false)}
                      >
                        Annuler
                      </Button>
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={handleSubmitBid}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer la soumission
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center text-gray-500">
                <Gavel className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium">Sélectionnez une opportunité</p>
                <p className="text-sm mt-2">Cliquez sur une opportunité pour voir les détails et soumissionner</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}