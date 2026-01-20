/**
 * Remote Quoting Engine
 * Generate accurate quotes without site visits using 3D property modeling
 */

import { useState } from 'react';
import { MapPin, Ruler, DollarSign, Calendar, CheckCircle, AlertCircle, Eye, Building, Download, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { REMOTE_QUOTES, QUOTE_OPTIONS, calculateRoofArea } from '../../data/remoteQuotes';
import { getThermalScanByAddress } from '../../data/thermalData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function RemoteQuoting() {
  const { user } = useAuth();
  const [step, setStep] = useState<'address' | 'service' | 'details' | 'quote'>('address');
  const [address, setAddress] = useState('');
  const [serviceType, setServiceType] = useState<'roofing' | 'insulation'>('roofing');
  const [selectedOption, setSelectedOption] = useState('Better');
  const [generatedQuote, setGeneratedQuote] = useState(REMOTE_QUOTES[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get thermal data if available
  const thermalData = getThermalScanByAddress(address);

  const handleGenerateQuote = async () => {
    setIsGenerating(true);
    
    // Simulate API call to generate quote
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use sample quote
    const quote = REMOTE_QUOTES.find(q => 
      q.division === (serviceType === 'roofing' ? 'toitures' : 'isolation')
    ) || REMOTE_QUOTES[0];
    
    setGeneratedQuote(quote);
    setIsGenerating(false);
    setStep('quote');
    toast.success('Soumission générée avec succès!');
  };

  const getConfidenceBadge = (confidence: string, score: number) => {
    if (confidence === 'high') {
      return <Badge className="bg-green-500 text-white">Haute confiance ({score}%)</Badge>;
    } else if (confidence === 'medium') {
      return <Badge className="bg-yellow-500 text-white">Confiance moyenne ({score}%)</Badge>;
    } else {
      return <Badge className="bg-red-500 text-white">Faible confiance ({score}%)</Badge>;
    }
  };

  const selectedQuoteOption = QUOTE_OPTIONS[serviceType === 'roofing' ? 'roofing' : 'insulation'].find(
    opt => opt.name === selectedOption
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Soumission À Distance</h1>
          <p className="text-gray-600 mt-1">Obtenez une soumission instantanée sans visite sur place</p>
        </div>
        {step === 'quote' && (
          <Button variant="outline" onClick={() => setStep('address')}>
            Nouvelle soumission
          </Button>
        )}
      </div>

      {/* Progress Steps */}
      {step !== 'quote' && (
        <div className="flex items-center justify-center gap-4">
          {[
            { id: 'address', label: 'Adresse', icon: MapPin },
            { id: 'service', label: 'Service', icon: Building },
            { id: 'details', label: 'Détails', icon: Ruler },
          ].map((s, index) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isComplete = ['address', 'service'].indexOf(s.id) < ['address', 'service', 'details'].indexOf(step);
            
            return (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${
                  isActive ? 'text-blue-600' : isComplete ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-blue-100 border-2 border-blue-600' :
                    isComplete ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {isComplete ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className="font-medium hidden sm:inline">{s.label}</span>
                </div>
                {index < 2 && (
                  <ArrowRight className="h-5 w-5 text-gray-400 mx-2" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Step 1: Address */}
      {step === 'address' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Entrez l'adresse de la propriété</CardTitle>
            <CardDescription>Nous utiliserons l'imagerie satellite et les données 3D pour générer votre soumission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adresse complète</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="address"
                  placeholder="123 rue Principale, Longueuil, QC"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Thermal Data Alert */}
            {address && thermalData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900">Données thermiques disponibles!</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Cette propriété a une cote de perte de chaleur de {thermalData.heatLossRating}/10.
                      Nous utiliserons ces données pour une soumission plus précise.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setStep('service')}
                disabled={!address}
              >
                Continuer
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Service Selection */}
      {step === 'service' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Sélectionnez le type de service</CardTitle>
            <CardDescription>Choisissez le service dont vous avez besoin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setServiceType('roofing')}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  serviceType === 'roofing'
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg">Toiture</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Remplacement ou réparation de toiture complète
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Soumission typique: $8,000 - $15,000
                </p>
              </button>

              <button
                onClick={() => setServiceType('insulation')}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  serviceType === 'insulation'
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Building className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-lg">Isolation</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Isolation du grenier ou des murs
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Soumission typique: $3,000 - $7,000
                </p>
              </button>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setStep('address')}
              >
                Retour
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => setStep('details')}
              >
                Continuer
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Additional Details */}
      {step === 'details' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Quelques détails supplémentaires</CardTitle>
            <CardDescription>Ces informations nous aident à générer une soumission plus précise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timeline">Échéancier</Label>
              <Select defaultValue="flexible">
                <SelectTrigger id="timeline">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Urgence (&lt;48h)</SelectItem>
                  <SelectItem value="urgent">Urgent (1-2 semaines)</SelectItem>
                  <SelectItem value="flexible">Flexible (1-3 mois)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description du projet (optionnel)</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre projet ou tout détail important..."
                rows={4}
              />
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-gray-600" />
                <p className="font-semibold text-gray-900">Analyse automatique</p>
              </div>
              <p className="text-sm text-gray-600">
                Nous utiliserons l'imagerie satellite 3D, Street View, et nos bases de données
                pour mesurer votre toit et calculer le prix exact.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setStep('service')}
              >
                Retour
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleGenerateQuote}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Génération...
                  </>
                ) : (
                  <>
                    Générer la soumission
                    <DollarSign className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Generated Quote */}
      {step === 'quote' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quote Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">Soumission Instantanée</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {generatedQuote.address}
                    </CardDescription>
                  </div>
                  {getConfidenceBadge(generatedQuote.confidence, generatedQuote.confidenceScore)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Fourchette de prix</p>
                      <p className="text-4xl font-bold text-gray-900">
                        ${generatedQuote.pricing.priceRangeMin.toLocaleString()} - ${generatedQuote.pricing.priceRangeMax.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Prix estimé: ${generatedQuote.pricing.priceEstimate.toLocaleString()}</span>
                  </div>
                </div>

                {/* Property Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Détails de la Propriété</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Surface du toit</p>
                      <p className="text-lg font-bold">{generatedQuote.measurements.roofArea.toLocaleString()} pi²</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Âge du bâtiment</p>
                      <p className="text-lg font-bold">{generatedQuote.buildingData.age} ans</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Type de toit</p>
                      <p className="text-lg font-bold capitalize">{generatedQuote.buildingData.roofType}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Complexité</p>
                      <p className="text-lg font-bold">{generatedQuote.buildingData.roofComplexity}/5</p>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Inclus dans la soumission</h3>
                  <div className="space-y-2">
                    {generatedQuote.pricing.materials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{material.description}</span>
                        </div>
                        <span className="text-sm font-semibold">${material.total.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Main-d'œuvre ({generatedQuote.pricing.labor.hours}h)</span>
                      </div>
                      <span className="text-sm font-semibold">${generatedQuote.pricing.labor.total.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Nettoyage et élimination</span>
                      </div>
                      <span className="text-sm font-semibold">Inclus</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold">Échéancier</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Durée estimée</p>
                      <p className="font-semibold">2-3 jours</p>
                    </div>
                    <div className="h-8 w-px bg-gray-300" />
                    <div>
                      <p className="text-gray-600">Garantie</p>
                      <p className="font-semibold">{selectedQuoteOption?.warranty.labor} ans main-d'œuvre, {selectedQuoteOption?.warranty.material} ans matériaux</p>
                    </div>
                  </div>
                </div>

                {/* 3D Model Placeholder */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                  <div className="text-center">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900 mb-2">Modèle 3D de la Propriété</p>
                    <p className="text-sm text-gray-600 mb-4">
                      Vue interactive de votre toit avec mesures
                    </p>
                    <Button variant="outline">
                      Voir le modèle 3D
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Options & Actions */}
          <div className="space-y-6">
            {/* Quote Options */}
            <Card>
              <CardHeader>
                <CardTitle>Options de soumission</CardTitle>
                <CardDescription>Personnalisez votre projet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {QUOTE_OPTIONS[serviceType === 'roofing' ? 'roofing' : 'insulation'].map((option) => (
                  <button
                    key={option.name}
                    onClick={() => setSelectedOption(option.name)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      selectedOption === option.name
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{option.name}</h4>
                      {option.recommended && (
                        <Badge className="bg-blue-500 text-white text-xs">Recommandé</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {option.priceAdjustment >= 0 ? '+' : ''}${Math.abs(option.priceAdjustment).toLocaleString()}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Prochaines étapes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Accepter la soumission
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-5 w-5 mr-2" />
                  Demander une visite
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-5 w-5 mr-2" />
                  Télécharger PDF
                </Button>
              </CardContent>
            </Card>

            {/* Confidence Note */}
            {generatedQuote.confidence !== 'high' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-900">Visite recommandée</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Nous recommandons une visite gratuite pour confirmer les mesures et affiner la soumission.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
