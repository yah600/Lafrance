import { ArrowLeft, MapPin, Phone, Clock, DollarSign, Camera, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { useApp } from '../../context/AppContext';

export default function MobileJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs } = useApp();
  
  const job = jobs.find(j => j.id === id);

  if (!job) {
    return <div className="p-4">Travail non trouvé</div>;
  }

  const canStart = job.status === 'assigned' || job.status === 'en-route';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/mobile')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold flex-1">Détails du travail</h1>
          <Badge className="bg-white/20 text-white">#{job.id}</Badge>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-4 ${
        job.priority === 'urgent' ? 'bg-red-50' : 'bg-blue-50'
      }`}>
        <div className="flex items-center gap-3">
          {job.priority === 'urgent' && (
            <>
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Urgence!</p>
                <p className="text-sm text-red-700">Intervention prioritaire requise</p>
              </div>
            </>
          )}
          {job.priority !== 'urgent' && (
            <>
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">Planifié</p>
                <p className="text-sm text-blue-700">{job.scheduledDate} à {job.scheduledTime}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Client Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">Client</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`tel:${job.client.phone}`)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-semibold">{job.client.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium">{job.client.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="font-medium flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  {job.client.address}
                </p>
              </div>
            </div>

            <Button 
              className="w-full mt-4"
              variant="outline"
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(job.client.address)}`, '_blank')}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Ouvrir dans Maps
            </Button>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Service demandé
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Type de service</p>
                <Badge className="mt-1">{job.serviceType}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1">{job.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Durée estimée</p>
                  <p className="font-semibold">{job.duration} minutes</p>
                </div>
                {job.amount && (
                  <div>
                    <p className="text-sm text-muted-foreground">Montant</p>
                    <p className="font-semibold text-green-600">${job.amount}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priorité</p>
                <Badge variant={job.priority === 'urgent' ? 'destructive' : 'secondary'} className="mt-1">
                  {job.priority}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes internes
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-900">
                • Client préfère les appels 30 min avant l'arrivée
                <br />
                • Code d'accès immeuble: #4567
                <br />
                • Stationnement disponible à l'arrière
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Weather Alert */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">❄️</div>
              <div>
                <p className="font-semibold text-blue-900">Alerte météo</p>
                <p className="text-sm text-blue-700">
                  Températures froides (-5°C). Prévoir du temps supplémentaire pour le déplacement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto">
        {canStart ? (
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {/* Navigate to maps */}}
            >
              <Navigation className="h-5 w-5 mr-2" />
              Naviguer
            </Button>
            <Button 
              className="flex-1 bg-[var(--primary)]"
              onClick={() => navigate(`/mobile/active-job/${job.id}`)}
            >
              Commencer
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate('/mobile')}
          >
            Retour à l'accueil
          </Button>
        )}
      </div>
      <div className="h-20"></div> {/* Spacer for fixed button */}
    </div>
  );
}