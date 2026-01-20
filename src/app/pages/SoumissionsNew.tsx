import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Send, Download, Save, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { PriceEstimator } from '../components/estimator';
import { toast } from 'sonner';
import { SERVICE_CATEGORIES, searchServices } from '../data/services';
import { DetailedQuoteBuilder } from '../components/compliance/DetailedQuoteBuilder';
import { BSDQCompliance } from '../components/compliance/BSDQCompliance';

export default function SoumissionsNew() {
  const navigate = useNavigate();
  
  const [clientInfo, setClientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const [serviceType, setServiceType] = useState<string>('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [showEstimator, setShowEstimator] = useState(false);
  const [estimateData, setEstimateData] = useState<any>(null);

  // Filter services based on search
  const filteredCategories = serviceSearch 
    ? searchServices(serviceSearch)
    : SERVICE_CATEGORIES;

  const handleClientInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientInfo.name || !clientInfo.phone || !serviceType) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    setShowEstimator(true);
  };

  const handleEstimateComplete = (selection: any) => {
    setEstimateData(selection);
    toast.success('Estimation complétée!');
  };

  const handleSave = () => {
    // TODO: Save to backend
    toast.success('Estimation sauvegardée!');
    navigate('/soumissions');
  };

  const handleSendEmail = () => {
    // TODO: Generate PDF and send email
    toast.success(`Estimation envoyée à ${clientInfo.email}!`);
    navigate('/soumissions');
  };

  const handleDownloadPDF = () => {
    // TODO: Generate and download PDF
    toast.success('Téléchargement du PDF...');
  };

  if (!showEstimator) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/soumissions')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nouvelle Soumission</h1>
              <p className="text-gray-600">Créer une estimation pour un client</p>
            </div>
          </div>

          {/* Client Information Form */}
          <form onSubmit={handleClientInfoSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nom complet <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="Jean Tremblay"
                        className="pl-10"
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Téléphone <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="514-555-0123"
                        className="pl-10"
                        value={clientInfo.phone}
                        onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Courriel</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean.tremblay@exemple.ca"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="address"
                        placeholder="123 Rue Principale, Montréal"
                        className="pl-10"
                        value={clientInfo.address}
                        onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Notes additionnelles..."
                    rows={3}
                    value={clientInfo.notes}
                    onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Type de service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service-search">Rechercher un service</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="service-search"
                      placeholder="Ex: chauffe-eau, drain, robinet..."
                      className="pl-10"
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {filteredCategories.length} service(s) trouvé(s)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">
                    Service demandé <span className="text-red-500">*</span>
                  </Label>
                  <Select value={serviceType} onValueChange={setServiceType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un service..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {filteredCategories.map((category) => (
                        <div key={category.id}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-100 sticky top-0">
                            {category.label}
                          </div>
                          {category.services.map((service) => (
                            <SelectItem key={service.value} value={service.value}>
                              <div className="flex flex-col">
                                <span>{service.label}</span>
                                {service.description && (
                                  <span className="text-xs text-gray-500">{service.description}</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/soumissions')}>
                Annuler
              </Button>
              <Button type="submit">
                Continuer vers l'estimation
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Show estimator
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEstimator(false)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Soumission détaillée pour {clientInfo.name}</h1>
            <p className="text-gray-600">{clientInfo.phone} • {clientInfo.address}</p>
          </div>
        </div>

        {/* Detailed Quote Builder */}
        <DetailedQuoteBuilder
          clientId={`client_${Date.now()}`}
          clientName={clientInfo.name}
          clientEmail={clientInfo.email}
          clientPhone={clientInfo.phone}
          clientAddress={clientInfo.address}
          onSave={(quote) => {
            setEstimateData(quote);
            toast.success('Soumission sauvegardée!');
            navigate('/soumissions');
          }}
          onApprove={(quote) => {
            toast.success('Soumission approuvée par le client!');
            navigate('/soumissions');
          }}
        />

        {/* BSDQ Compliance Check */}
        {estimateData && estimateData.total > 20000 && (
          <BSDQCompliance
            jobId={`job_${Date.now()}`}
            quoteId={`quote_${Date.now()}`}
            estimatedValue={estimateData.total}
            hasMultipleSubcontractors={false}
            isBidSituation={false}
            onSubmit={(compliance) => {
              toast.success('Conformité BSDQ confirmée');
            }}
          />
        )}
      </div>
    </div>
  );
}