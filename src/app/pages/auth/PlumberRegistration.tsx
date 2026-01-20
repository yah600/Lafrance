import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Checkbox } from '../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Progress } from '../../components/ui/progress';
import { toast } from 'sonner';
import { SubscriptionTier } from '../../types/subscription';
import { SubscriptionTierCard } from '../../components/subscription/SubscriptionTierCard';
import { Language } from '../../types/bidding';

interface RegistrationData {
  // Step 1: Subscription
  subscriptionTier: SubscriptionTier | null;
  billingCycle: 'monthly' | 'yearly';

  // Step 2: Business Information
  ownerName: string;
  legalBusinessName: string;
  operatingName: string;
  businessAddress: string;
  postalAddress: string;
  ownerAddress: string;

  // Step 3: Tax & License Information
  taxNumber: string;
  rbqNumber: string;
  rbqExpiry: string;

  // Step 4: Documents (to be requested before first payment)
  // CNESST, CCQ, RQ attestations will be requested later

  // Step 5: Preferences
  acceptUrgentJobs: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  serviceTypes: string[];
  serviceRadius: number;
  languages: Language[];

  // Step 6: Account Information
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const STEPS = [
  { id: 1, title: 'Abonnement', description: 'Choisissez votre forfait' },
  { id: 2, title: 'Entreprise', description: 'Informations d\'entreprise' },
  { id: 3, title: 'Taxes & Licences', description: 'Numéros officiels' },
  { id: 4, title: 'Préférences', description: 'Paramètres de service' },
  { id: 5, title: 'Compte', description: 'Créez votre compte' },
  { id: 6, title: 'Confirmation', description: 'Vérifiez vos informations' },
];

const SERVICE_TYPES = [
  'Débouchage',
  'Installation chauffe-eau',
  'Robinetterie',
  'Urgences',
  'Clapet anti-retour',
  'Inspection caméra',
  'Pompe de puisard',
  'Réparation fuite',
];

export default function PlumberRegistration() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    subscriptionTier: null,
    billingCycle: 'yearly',
    ownerName: '',
    legalBusinessName: '',
    operatingName: '',
    businessAddress: '',
    postalAddress: '',
    ownerAddress: '',
    taxNumber: '',
    rbqNumber: '',
    rbqExpiry: '',
    acceptUrgentJobs: false,
    workingHoursStart: '08:00',
    workingHoursEnd: '17:00',
    serviceTypes: [],
    serviceRadius: 50,
    languages: [Language.FRENCH],
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const updateFormData = (field: keyof RegistrationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1 && !formData.subscriptionTier) {
      toast.error('Veuillez sélectionner un abonnement');
      return;
    }

    if (currentStep === 2) {
      if (!formData.ownerName || !formData.legalBusinessName || !formData.businessAddress) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }

    if (currentStep === 3) {
      if (!formData.taxNumber || !formData.rbqNumber) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }

    if (currentStep === 5) {
      if (!formData.email || !formData.password || !formData.phone) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // Submit registration
    toast.success('Inscription réussie! Bienvenue sur GROUPE LAFRANCE APP');
    navigate('/dashboard');
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Inscription - Plombier/Entrepreneur
          </h1>
          <p className="text-lg text-gray-600">
            Rejoignez le réseau GROUPE LAFRANCE et recevez des appels de service
          </p>
          <p className="text-sm text-green-600 font-medium mt-2">
            ✨ Obtenez 6 mois gratuits sur tous les abonnements!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex-1 text-center ${
                  step.id === currentStep ? 'text-primary font-semibold' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    step.id < currentStep
                      ? 'bg-green-600 text-white'
                      : step.id === currentStep
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <div className="text-xs font-medium">{step.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Subscription Selection */}
            {currentStep === 1 && (
              <div>
                <div className="flex justify-center gap-4 mb-6">
                  <Button
                    variant={formData.billingCycle === 'monthly' ? 'default' : 'outline'}
                    onClick={() => updateFormData('billingCycle', 'monthly')}
                  >
                    Mensuel
                  </Button>
                  <Button
                    variant={formData.billingCycle === 'yearly' ? 'default' : 'outline'}
                    onClick={() => updateFormData('billingCycle', 'yearly')}
                  >
                    Annuel (Économisez 2 mois!)
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.values(SubscriptionTier).map((tier) => (
                    <SubscriptionTierCard
                      key={tier}
                      tier={tier}
                      currentTier={formData.subscriptionTier || undefined}
                      onSelect={(tier) => updateFormData('subscriptionTier', tier)}
                      billingCycle={formData.billingCycle}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerName">Nom du propriétaire *</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => updateFormData('ownerName', e.target.value)}
                      placeholder="Jean Tremblay"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="(514) 555-1234"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="legalBusinessName">Nom légal de l'entreprise *</Label>
                  <Input
                    id="legalBusinessName"
                    value={formData.legalBusinessName}
                    onChange={(e) => updateFormData('legalBusinessName', e.target.value)}
                    placeholder="Plomberie Jean Tremblay Inc."
                  />
                </div>

                <div>
                  <Label htmlFor="operatingName">Raison sociale (nom d'opération)</Label>
                  <Input
                    id="operatingName"
                    value={formData.operatingName}
                    onChange={(e) => updateFormData('operatingName', e.target.value)}
                    placeholder="JT Plomberie"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Le nom qui apparaîtra sur la plateforme et les factures
                  </p>
                </div>

                <div>
                  <Label htmlFor="businessAddress">Adresse de l'entreprise *</Label>
                  <Textarea
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => updateFormData('businessAddress', e.target.value)}
                    placeholder="1234 Rue Principale, Montréal, QC H1A 1A1"
                  />
                </div>

                <div>
                  <Label htmlFor="postalAddress">Adresse postale</Label>
                  <Textarea
                    id="postalAddress"
                    value={formData.postalAddress}
                    onChange={(e) => updateFormData('postalAddress', e.target.value)}
                    placeholder="Même que l'adresse de l'entreprise ou différente"
                  />
                </div>

                <div>
                  <Label htmlFor="ownerAddress">Adresse du propriétaire</Label>
                  <Textarea
                    id="ownerAddress"
                    value={formData.ownerAddress}
                    onChange={(e) => updateFormData('ownerAddress', e.target.value)}
                    placeholder="Adresse résidentielle du propriétaire"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Tax & License Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="taxNumber">Numéro de taxes (TPS/TVQ) *</Label>
                  <Input
                    id="taxNumber"
                    value={formData.taxNumber}
                    onChange={(e) => updateFormData('taxNumber', e.target.value)}
                    placeholder="123456789 RT0001"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rbqNumber">Numéro RBQ *</Label>
                    <Input
                      id="rbqNumber"
                      value={formData.rbqNumber}
                      onChange={(e) => updateFormData('rbqNumber', e.target.value)}
                      placeholder="1234-5678-91"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rbqExpiry">Date d'expiration RBQ</Label>
                    <Input
                      id="rbqExpiry"
                      type="date"
                      value={formData.rbqExpiry}
                      onChange={(e) => updateFormData('rbqExpiry', e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-2">Attestations à fournir plus tard</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    Pour éviter de rendre l'inscription trop lourde, les attestations suivantes seront
                    demandées avant votre premier paiement:
                  </p>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Attestation CNESST</li>
                    <li>• Attestation CCQ</li>
                    <li>• Attestation RQ</li>
                  </ul>
                  <p className="text-xs text-amber-600 mt-3">
                    ⚠️ Sans ces attestations, vous serez payé à 90% jusqu'à leur soumission
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Preferences */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label>Accepter les appels urgents?</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="urgentJobs"
                      checked={formData.acceptUrgentJobs}
                      onCheckedChange={(checked) =>
                        updateFormData('acceptUrgentJobs', checked === true)
                      }
                    />
                    <label htmlFor="urgentJobs" className="text-sm">
                      Oui, je veux recevoir des appels urgents (temps de réponse: 5 minutes)
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workingHoursStart">Début de plage horaire</Label>
                    <Input
                      id="workingHoursStart"
                      type="time"
                      value={formData.workingHoursStart}
                      onChange={(e) => updateFormData('workingHoursStart', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="workingHoursEnd">Fin de plage horaire</Label>
                    <Input
                      id="workingHoursEnd"
                      type="time"
                      value={formData.workingHoursEnd}
                      onChange={(e) => updateFormData('workingHoursEnd', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Types de services offerts</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {SERVICE_TYPES.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={formData.serviceTypes.includes(service)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData('serviceTypes', [...formData.serviceTypes, service]);
                            } else {
                              updateFormData(
                                'serviceTypes',
                                formData.serviceTypes.filter((s) => s !== service)
                              );
                            }
                          }}
                        />
                        <label htmlFor={service} className="text-sm">
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="serviceRadius">Rayon de service (km)</Label>
                  <Input
                    id="serviceRadius"
                    type="number"
                    min="10"
                    max="200"
                    value={formData.serviceRadius}
                    onChange={(e) => updateFormData('serviceRadius', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Distance maximale que vous êtes prêt à parcourir pour un appel
                  </p>
                </div>

                <div>
                  <Label>Langues parlées</Label>
                  <div className="flex gap-4 mt-2">
                    {[
                      { value: Language.FRENCH, label: 'Français' },
                      { value: Language.ENGLISH, label: 'Anglais' },
                      { value: Language.SPANISH, label: 'Espagnol' },
                    ].map((lang) => (
                      <div key={lang.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={lang.value}
                          checked={formData.languages.includes(lang.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData('languages', [...formData.languages, lang.value]);
                            } else {
                              updateFormData(
                                'languages',
                                formData.languages.filter((l) => l !== lang.value)
                              );
                            }
                          }}
                        />
                        <label htmlFor={lang.value} className="text-sm">
                          {lang.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Account Information */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="email">Adresse courriel *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="jean@plomberie.com"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="Minimum 8 caractères"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    placeholder="Retapez votre mot de passe"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Confirmation */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <Check className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-900 mb-2">
                    Prêt à commencer!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Vous êtes sur le point de rejoindre le réseau GROUPE LAFRANCE avec l'abonnement
                    <span className="font-bold"> {formData.subscriptionTier?.toUpperCase()}</span>.
                  </p>
                  <p className="text-sm text-green-600">
                    Profitez de 6 mois gratuits pour découvrir tous les avantages de la plateforme!
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold">Récapitulatif</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Propriétaire:</div>
                    <div className="font-medium">{formData.ownerName}</div>

                    <div className="text-gray-600">Entreprise:</div>
                    <div className="font-medium">{formData.legalBusinessName}</div>

                    <div className="text-gray-600">RBQ:</div>
                    <div className="font-medium">{formData.rbqNumber}</div>

                    <div className="text-gray-600">Courriel:</div>
                    <div className="font-medium">{formData.email}</div>

                    <div className="text-gray-600">Téléphone:</div>
                    <div className="font-medium">{formData.phone}</div>

                    <div className="text-gray-600">Rayon de service:</div>
                    <div className="font-medium">{formData.serviceRadius} km</div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    En cliquant sur "Créer mon compte", vous acceptez les{' '}
                    <a href="#" className="text-primary underline">
                      conditions d'utilisation
                    </a>{' '}
                    et la{' '}
                    <a href="#" className="text-primary underline">
                      politique de confidentialité
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>

          {currentStep < STEPS.length ? (
            <Button onClick={handleNext} className="flex items-center gap-2">
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              Créer mon compte
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
