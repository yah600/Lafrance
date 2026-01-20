import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Droplet, Shield, Flame, Gauge, Wrench, Home, 
  AlertTriangle, FileText, X
} from 'lucide-react';
import DrainUnblockingForm from './DrainUnclockingForm';
import BackwaterValveForm from './BackwaterValveForm';
import WaterHeaterForm from './WaterHeaterForm';
import SumpPumpForm from './SumpPumpForm';
import type { ServiceFormType } from './index';

interface Props {
  jobId: string;
  onComplete: (formType: ServiceFormType, data: any) => void;
  onCancel: () => void;
  preselectedType?: ServiceFormType;
}

interface ServiceTypeOption {
  type: ServiceFormType;
  label: string;
  icon: any;
  color: string;
  description: string;
}

const serviceTypes: ServiceTypeOption[] = [
  {
    type: 'drain-unblocking',
    label: 'Débouchage de drains',
    icon: Droplet,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    description: 'Débouchage, inspection caméra, état des tuyaux'
  },
  {
    type: 'backwater-valve',
    label: 'Clapet anti-retour',
    icon: Shield,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    description: 'Installation, inspection, certificat de conformité'
  },
  {
    type: 'water-heater',
    label: 'Chauffe-eau',
    icon: Flame,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    description: 'Installation, réparation, flush, inspection complète'
  },
  {
    type: 'sump-pump',
    label: 'Pompe de puisard',
    icon: Gauge,
    color: 'text-teal-600 bg-teal-50 border-teal-200',
    description: 'Installation, test fonctionnel, inspection backup'
  },
];

export default function ServiceFormSelector({ jobId, onComplete, onCancel, preselectedType }: Props) {
  const [selectedType, setSelectedType] = useState<ServiceFormType | null>(preselectedType || null);

  if (!selectedType) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sélectionner le type de fiche technique</h2>
            <p className="text-gray-600">Choisissez le service effectué pour remplir la fiche appropriée</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceTypes.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.type}
                onClick={() => setSelectedType(service.type)}
                className={`text-left p-6 border-2 rounded-lg transition-all hover:shadow-lg ${service.color}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{service.label}</h3>
                    <p className="text-sm opacity-80">{service.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Other Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Autres services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Pour les autres types de services, une fiche technique générique sera disponible prochainement.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Robinetterie',
                'Toilette',
                'Tuyaux',
                'Fuites',
                'Rénovation salle de bain',
                'Inspection générale'
              ].map((service) => (
                <Button key={service} variant="outline" size="sm" disabled>
                  {service} (Bientôt disponible)
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the selected form
  const handleFormComplete = (data: any) => {
    onComplete(selectedType, data);
  };

  const handleBackToSelection = () => {
    setSelectedType(null);
  };

  switch (selectedType) {
    case 'drain-unblocking':
      return <DrainUnblockingForm jobId={jobId} onComplete={handleFormComplete} onCancel={handleBackToSelection} />;
    case 'backwater-valve':
      return <BackwaterValveForm jobId={jobId} onComplete={handleFormComplete} onCancel={handleBackToSelection} />;
    case 'water-heater':
      return <WaterHeaterForm jobId={jobId} onComplete={handleFormComplete} onCancel={handleBackToSelection} />;
    case 'sump-pump':
      return <SumpPumpForm jobId={jobId} onComplete={handleFormComplete} onCancel={handleBackToSelection} />;
    default:
      return null;
  }
}
