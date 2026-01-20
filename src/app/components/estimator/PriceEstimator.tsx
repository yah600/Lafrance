import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { CheckCircle2, Star, Flame, Droplet, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface PricingOption {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  features: string[];
  savings?: string;
  warranty: string;
  recommended?: boolean;
  image?: string;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface EstimatorProps {
  serviceType: 'water-heater' | 'backwater-valve' | 'sump-pump';
  onComplete?: (selection: {
    option: PricingOption;
    addOns: AddOn[];
    total: number;
  }) => void;
}

const WATER_HEATER_OPTIONS: PricingOption[] = [
  {
    id: 'economy',
    title: 'ÉCONOMIQUE',
    subtitle: 'Giant 40 gal Standard',
    price: 1150,
    features: [
      '6 ans garantie réservoir',
      'Installation standard',
      'Conformité au code',
      'Garantie main d\'oeuvre 1 an'
    ],
    warranty: '6 ans réservoir + 1 an main d\'oeuvre',
  },
  {
    id: 'recommended',
    title: 'RECOMMANDÉ',
    subtitle: 'Giant 60 gal Energy Star',
    price: 1450,
    features: [
      '10 ans garantie réservoir',
      'Économie ~80$/an énergie',
      'Installation professionnelle',
      'Garantie main d\'oeuvre 1 an',
      'Certification Energy Star',
      'Meilleur rapport qualité-prix'
    ],
    savings: 'Économie de 800$ sur 10 ans',
    warranty: '10 ans réservoir + 1 an main d\'oeuvre',
    recommended: true,
  },
  {
    id: 'premium',
    title: 'PREMIUM',
    subtitle: 'Bradford White 60 gal',
    price: 1875,
    features: [
      '12 ans garantie réservoir',
      'Économie ~120$/an énergie',
      'Anode powered (durée de vie +)',
      'Installation premium',
      'Garantie main d\'oeuvre 2 ans',
      'Matériaux haute qualité',
      'Performance maximale'
    ],
    savings: 'Économie de 1200$ sur 10 ans',
    warranty: '12 ans réservoir + 2 ans main d\'oeuvre',
  },
];

const WATER_HEATER_ADDONS: AddOn[] = [
  {
    id: 'drip-pan',
    name: 'Bac de récupération',
    description: 'Protection contre les fuites et dégâts d\'eau',
    price: 125,
  },
  {
    id: 'wifi-detector',
    name: 'Détecteur de fuite WiFi',
    description: 'Alertes en temps réel sur votre téléphone',
    price: 95,
  },
  {
    id: 'auto-shutoff',
    name: 'Vanne d\'arrêt automatique',
    description: 'Fermeture automatique en cas de fuite détectée',
    price: 225,
  },
  {
    id: 'expansion-tank',
    name: 'Réservoir d\'expansion',
    description: 'Protection contre la surpression',
    price: 175,
  },
];

const BACKWATER_VALVE_OPTIONS: PricingOption[] = [
  {
    id: 'standard',
    title: 'STANDARD',
    subtitle: 'Clapet PVC 4"',
    price: 1250,
    features: [
      'Clapet normalement fermé',
      'Installation conforme',
      'Certificat de conformité',
      'Garantie 5 ans fabricant',
      'Garantie main d\'oeuvre 1 an'
    ],
    warranty: '5 ans fabricant + 1 an main d\'oeuvre',
  },
  {
    id: 'recommended',
    title: 'RECOMMANDÉ',
    subtitle: 'Mainline ML-FR4 4"',
    price: 1650,
    features: [
      'Clapet normalement fermé',
      'Installation professionnelle',
      'Certificat de conformité',
      'Garantie 10 ans fabricant',
      'Garantie main d\'oeuvre 2 ans',
      'Inspection annuelle gratuite (1 an)',
      'Meilleure qualité',
    ],
    warranty: '10 ans fabricant + 2 ans main d\'oeuvre',
    recommended: true,
  },
  {
    id: 'premium',
    title: 'PREMIUM',
    subtitle: 'Mainline Double-Check 4"',
    price: 2150,
    features: [
      'Double clapet (sécurité maximale)',
      'Installation premium',
      'Certificat de conformité',
      'Garantie 15 ans fabricant',
      'Garantie main d\'oeuvre 3 ans',
      'Inspection annuelle gratuite (2 ans)',
      'Protection maximale',
    ],
    warranty: '15 ans fabricant + 3 ans main d\'oeuvre',
  },
];

const BACKWATER_VALVE_ADDONS: AddOn[] = [
  {
    id: 'alarm',
    name: 'Alarme de refoulement',
    description: 'Alerte sonore en cas de refoulement détecté',
    price: 195,
  },
  {
    id: 'inspection-camera',
    name: 'Inspection caméra complète',
    description: 'Inspection vidéo de vos conduites d\'égout',
    price: 350,
  },
];

const SUMP_PUMP_OPTIONS: PricingOption[] = [
  {
    id: 'standard',
    title: 'STANDARD',
    subtitle: 'Pompe 1/3 HP Submersible',
    price: 850,
    features: [
      'Pompe submersible 1/3 HP',
      'Installation standard',
      'Clapet de retenue',
      'Garantie 3 ans fabricant',
      'Garantie main d\'oeuvre 1 an'
    ],
    warranty: '3 ans fabricant + 1 an main d\'oeuvre',
  },
  {
    id: 'recommended',
    title: 'RECOMMANDÉ',
    subtitle: 'Pompe 1/2 HP + Backup',
    price: 1450,
    features: [
      'Pompe submersible 1/2 HP',
      'Pompe backup à batterie',
      'Installation professionnelle',
      'Clapet de retenue premium',
      'Garantie 5 ans fabricant',
      'Garantie main d\'oeuvre 2 ans',
      'Protection en cas de panne',
    ],
    warranty: '5 ans fabricant + 2 ans main d\'oeuvre',
    recommended: true,
  },
  {
    id: 'premium',
    title: 'PREMIUM',
    subtitle: 'Pompe 3/4 HP Double Système',
    price: 2250,
    features: [
      'Pompe principale 3/4 HP',
      'Pompe secondaire complète',
      'Système backup à batterie',
      'Installation premium',
      'Clapet de retenue double',
      'Garantie 7 ans fabricant',
      'Garantie main d\'oeuvre 3 ans',
      'Protection maximale',
    ],
    warranty: '7 ans fabricant + 3 ans main d\'oeuvre',
  },
];

const SUMP_PUMP_ADDONS: AddOn[] = [
  {
    id: 'wifi-monitor',
    name: 'Moniteur WiFi',
    description: 'Surveillance en temps réel de votre pompe',
    price: 195,
  },
  {
    id: 'high-water-alarm',
    name: 'Alarme niveau d\'eau',
    description: 'Alerte sonore en cas de niveau élevé',
    price: 85,
  },
  {
    id: 'battery-upgrade',
    name: 'Batterie premium',
    description: 'Batterie longue durée (12h autonomie)',
    price: 275,
  },
];

export default function PriceEstimator({ serviceType, onComplete }: EstimatorProps) {
  const [selectedOption, setSelectedOption] = useState<string>('recommended');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // Get options and add-ons based on service type
  const getOptions = (): PricingOption[] => {
    switch (serviceType) {
      case 'water-heater':
        return WATER_HEATER_OPTIONS;
      case 'backwater-valve':
        return BACKWATER_VALVE_OPTIONS;
      case 'sump-pump':
        return SUMP_PUMP_OPTIONS;
      default:
        return WATER_HEATER_OPTIONS;
    }
  };

  const getAddOns = (): AddOn[] => {
    switch (serviceType) {
      case 'water-heater':
        return WATER_HEATER_ADDONS;
      case 'backwater-valve':
        return BACKWATER_VALVE_ADDONS;
      case 'sump-pump':
        return SUMP_PUMP_ADDONS;
      default:
        return WATER_HEATER_ADDONS;
    }
  };

  const options = getOptions();
  const addOns = getAddOns();

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateTotal = () => {
    const option = options.find(opt => opt.id === selectedOption);
    const optionPrice = option?.price || 0;
    const addOnsPrice = selectedAddOns.reduce((total, addonId) => {
      const addon = addOns.find(a => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
    return optionPrice + addOnsPrice;
  };

  const handleComplete = () => {
    const option = options.find(opt => opt.id === selectedOption);
    const selectedAddOnObjects = selectedAddOns.map(id => addOns.find(a => a.id === id)!).filter(Boolean);
    
    if (option && onComplete) {
      onComplete({
        option,
        addOns: selectedAddOnObjects,
        total: calculateTotal(),
      });
      toast.success('Estimation enregistrée avec succès!');
    }
  };

  const getServiceIcon = () => {
    switch (serviceType) {
      case 'water-heater':
        return <Flame className="h-6 w-6" />;
      case 'backwater-valve':
        return <Shield className="h-6 w-6" />;
      case 'sump-pump':
        return <Droplet className="h-6 w-6" />;
      default:
        return <Flame className="h-6 w-6" />;
    }
  };

  const getServiceTitle = () => {
    switch (serviceType) {
      case 'water-heater':
        return 'Chauffe-eau';
      case 'backwater-valve':
        return 'Clapet anti-retour';
      case 'sump-pump':
        return 'Pompe de puisard';
      default:
        return 'Service';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[var(--primary)]/10 rounded-lg">
          {getServiceIcon()}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Estimation - {getServiceTitle()}
          </h2>
          <p className="text-gray-600">Choisissez l'option qui correspond à vos besoins</p>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`relative cursor-pointer transition-all hover:shadow-xl ${
              selectedOption === option.id
                ? 'border-[var(--primary)] border-2 shadow-lg'
                : 'border-gray-200'
            } ${option.recommended ? 'ring-2 ring-[var(--flame-orange)]' : ''}`}
            onClick={() => setSelectedOption(option.id)}
          >
            {option.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-[var(--flame-orange)] hover:bg-[var(--flame-orange)] text-white flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  RECOMMANDÉ
                </Badge>
              </div>
            )}

            <CardHeader className={option.recommended ? 'pt-6' : ''}>
              <div className="text-center space-y-2">
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <CardDescription className="text-base font-semibold">
                  {option.subtitle}
                </CardDescription>
                <div className="pt-4">
                  <div className="text-4xl font-bold text-[var(--primary)]">
                    {option.price.toLocaleString('fr-CA')} $
                  </div>
                  <p className="text-sm text-gray-600 mt-1">+ taxes</p>
                </div>
                {option.savings && (
                  <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                    {option.savings}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Features */}
              <div className="space-y-2">
                {option.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Warranty */}
              <div className="pt-4 border-t">
                <p className="text-xs font-semibold text-gray-600 mb-1">GARANTIE:</p>
                <p className="text-xs text-gray-700">{option.warranty}</p>
              </div>

              {/* Select Button */}
              <Button
                className={`w-full ${
                  selectedOption === option.id
                    ? 'bg-[var(--primary)] hover:bg-[var(--accent-blue)]'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                {selectedOption === option.id ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Sélectionné
                  </>
                ) : (
                  'Sélectionner'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add-ons Section */}
      {addOns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Options additionnelles</CardTitle>
            <CardDescription>Améliorez votre installation avec ces options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addOns.map((addon) => (
                <div
                  key={addon.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedAddOns.includes(addon.id)
                      ? 'border-[var(--primary)] bg-blue-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => toggleAddOn(addon.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedAddOns.includes(addon.id)}
                      onCheckedChange={() => toggleAddOn(addon.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Label className="font-semibold cursor-pointer">{addon.name}</Label>
                        <span className="font-bold text-[var(--primary)]">
                          +{addon.price} $
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{addon.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Summary */}
      <Card className="sticky bottom-4 shadow-2xl border-2 border-[var(--primary)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de l'estimation</p>
              <p className="text-4xl font-bold text-[var(--primary)]">
                {calculateTotal().toLocaleString('fr-CA')} $
              </p>
              <p className="text-sm text-gray-600 mt-1">
                + taxes • Valide 30 jours
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg">
                Télécharger PDF
              </Button>
              <Button size="lg" onClick={handleComplete}>
                Accepter l'estimation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
