import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Home, User, Phone, Mail, Calendar, Wrench, FileText, 
  Plus, Edit, Download, AlertTriangle, CheckCircle, Clock, Trash2, MapPin 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import CreateEquipmentModal from '../components/modals/CreateEquipmentModal';
import EditEquipmentModal from '../components/modals/EditEquipmentModal';
import ScheduleMaintenanceModal from '../components/modals/ScheduleMaintenanceModal';

// Mock data (in production, this would come from API)
const mockPassport = {
  id: '1',
  address: '123 Rue Principale, Montréal, QC H1A 1A1',
  clientName: 'Marie Tremblay',
  clientPhone: '514-555-0123',
  clientEmail: 'marie.tremblay@example.com',
  propertyType: 'residential' as const,
  yearBuilt: 1985,
  lastInspection: '2024-06-15',
  nextInspection: '2025-06-15',
  equipment: [
    {
      id: 'eq1',
      type: 'water-heater' as const,
      brand: 'Rheem',
      model: 'Performance Platinum 50 Gal',
      serialNumber: 'RH2019-12345',
      installDate: '2019-03-15',
      warranty: { years: 12, expiryDate: '2031-03-15' },
      lastMaintenance: '2024-03-15',
      nextMaintenance: '2025-03-15',
      condition: 'good' as const,
      notes: 'Détecteur WiFi installé pour surveillance à distance',
    },
    {
      id: 'eq2',
      type: 'backwater-valve' as const,
      brand: 'Mainline',
      installDate: '2020-08-10',
      lastMaintenance: '2024-08-10',
      nextMaintenance: '2025-08-10',
      condition: 'excellent' as const,
      notes: 'Certificat municipal valide jusqu\'en août 2025',
    },
    {
      id: 'eq3',
      type: 'sump-pump' as const,
      brand: 'Zoeller',
      model: 'M53 Mighty-Mate',
      serialNumber: 'ZO2021-67890',
      installDate: '2021-05-20',
      lastMaintenance: '2024-05-20',
      nextMaintenance: '2025-05-20',
      condition: 'excellent' as const,
      notes: 'Pompe de secours à batterie installée - testée mensuellement',
    },
  ],
  interventions: [
    {
      id: 'int1',
      date: '2024-11-15',
      technicianName: 'Pierre Gagnon',
      serviceType: 'Entretien annuel',
      description: 'Inspection complète du chauffe-eau et de la pompe de puisard. Vidange du chauffe-eau, test de la vanne de sécurité. Test de la pompe de secours.',
      cost: 250,
      invoiceId: 'INV-2024-1156',
    },
    {
      id: 'int2',
      date: '2024-08-10',
      technicianName: 'Marc Leblanc',
      serviceType: 'Nettoyage clapet',
      description: 'Nettoyage et inspection du clapet anti-retour. Certificat de conformité émis pour la municipalité.',
      cost: 175,
      invoiceId: 'INV-2024-0892',
    },
    {
      id: 'int3',
      date: '2024-03-15',
      technicianName: 'Pierre Gagnon',
      serviceType: 'Entretien printemps',
      description: 'Entretien préventif de printemps. Inspection de tous les équipements.',
      cost: 200,
      invoiceId: 'INV-2024-0245',
    },
  ],
  notes: 'Client préfère rendez-vous le matin entre 8h-10h. Chien amical dans la cour arrière (Golden Retriever nommé Max). Entrée par la porte latérale.',
  createdAt: '2019-03-15',
  updatedAt: '2024-11-15',
};

const equipmentTypeLabels: Record<string, string> = {
  'water-heater': 'Chauffe-eau',
  'backwater-valve': 'Clapet anti-retour',
  'sump-pump': 'Pompe de puisard',
  'water-main': 'Entrée d\'eau principale',
  'drain-system': 'Système de drainage',
};

const conditionConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  'excellent': { label: 'Excellent', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'good': { label: 'Bon', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  'fair': { label: 'Acceptable', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'poor': { label: 'Mauvais', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
  'needs-replacement': { label: 'À remplacer', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
};

export default function PropertyPassportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [passport, setPassport] = useState(mockPassport);
  const [activeTab, setActiveTab] = useState('overview');
  const [addEquipmentOpen, setAddEquipmentOpen] = useState(false);
  const [addInterventionOpen, setAddInterventionOpen] = useState(false);
  const [editEquipmentOpen, setEditEquipmentOpen] = useState(false);
  const [scheduleMaintenanceOpen, setScheduleMaintenanceOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<typeof passport.equipment[0] | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
    });
  };

  const calculateAge = (installDate: string) => {
    const install = new Date(installDate);
    const now = new Date();
    const years = now.getFullYear() - install.getFullYear();
    const months = now.getMonth() - install.getMonth();
    
    if (years === 0) return `${months} mois`;
    if (months < 0) return `${years - 1} ans ${12 + months} mois`;
    return `${years} ans ${months} mois`;
  };

  const isWarrantyValid = (equipment: typeof passport.equipment[0]) => {
    if (!equipment.warranty) return false;
    return new Date(equipment.warranty.expiryDate) > new Date();
  };

  const isMaintenanceDue = (equipment: typeof passport.equipment[0]) => {
    if (!equipment.nextMaintenance) return false;
    const nextDate = new Date(equipment.nextMaintenance);
    const now = new Date();
    const daysUntil = Math.floor((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30;
  };

  const handleDownloadPDF = () => {
    toast.success('Génération du PDF du passeport...');
    // TODO: Generate PDF
  };

  const handleScheduleMaintenance = (equipmentId: string) => {
    const equipment = passport.equipment.find(eq => eq.id === equipmentId);
    if (equipment) {
      setSelectedEquipment(equipment);
      setScheduleMaintenanceOpen(true);
    }
  };

  const totalInterventionCost = passport.interventions.reduce((sum, int) => sum + int.cost, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/property-passports')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Home className="h-8 w-8 text-blue-600" />
            Passeport de propriété
          </h1>
          <p className="text-muted-foreground mt-1">{passport.address}</p>
        </div>
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger PDF
        </Button>
        <Button onClick={() => toast.info('Modification à venir...')}>
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      {/* Client Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du client</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-semibold">{passport.clientName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-semibold">{passport.clientPhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Courriel</p>
              <p className="font-semibold text-sm">{passport.clientEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-semibold">
                {passport.propertyType === 'residential' && 'Résidentiel'}
                {passport.propertyType === 'commercial' && 'Commercial'}
                {passport.yearBuilt && ` • ${passport.yearBuilt}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="equipment">Équipements ({passport.equipment.length})</TabsTrigger>
          <TabsTrigger value="interventions">Historique ({passport.interventions.length})</TabsTrigger>
          <TabsTrigger value="maintenance">Entretien</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Equipment Summary */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Équipements installés</CardTitle>
                <Button size="sm" onClick={() => setAddEquipmentOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {passport.equipment.map((equipment) => {
                  const ConditionIcon = conditionConfig[equipment.condition].icon;
                  const age = calculateAge(equipment.installDate);
                  const warrantyValid = isWarrantyValid(equipment);
                  const maintenanceDue = isMaintenanceDue(equipment);

                  return (
                    <div key={equipment.id} className="p-4 border rounded-lg hover:border-blue-500 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Wrench className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold">{equipmentTypeLabels[equipment.type]}</h3>
                            <Badge className={conditionConfig[equipment.condition].color}>
                              <ConditionIcon className="h-3 w-3 mr-1" />
                              {conditionConfig[equipment.condition].label}
                            </Badge>
                            {maintenanceDue && (
                              <Badge className="bg-orange-100 text-orange-800">
                                <Clock className="h-3 w-3 mr-1" />
                                Entretien dû
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {equipment.brand} {equipment.model && `• ${equipment.model}`}
                          </p>
                          {equipment.serialNumber && (
                            <p className="text-xs text-gray-500">S/N: {equipment.serialNumber}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                        <div>
                          <p className="text-gray-600">Installation</p>
                          <p className="font-medium">{formatDate(equipment.installDate)} ({age})</p>
                        </div>
                        {equipment.warranty && (
                          <div>
                            <p className="text-gray-600">Garantie</p>
                            <p className={`font-medium ${warrantyValid ? 'text-green-600' : 'text-red-600'}`}>
                              {equipment.warranty.years} ans {warrantyValid ? '✓' : '(expirée)'}
                            </p>
                          </div>
                        )}
                        {equipment.lastMaintenance && (
                          <div>
                            <p className="text-gray-600">Dernier entretien</p>
                            <p className="font-medium">{formatDate(equipment.lastMaintenance)}</p>
                          </div>
                        )}
                        {equipment.nextMaintenance && (
                          <div>
                            <p className="text-gray-600">Prochain entretien</p>
                            <p className="font-medium">{formatDate(equipment.nextMaintenance)}</p>
                          </div>
                        )}
                      </div>

                      {equipment.notes && (
                        <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                          <p className="text-gray-700">{equipment.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Interventions totales</p>
                    <p className="text-2xl font-bold">{passport.interventions.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Coût total investi</p>
                    <p className="text-2xl font-bold text-green-600">
                      {totalInterventionCost.toLocaleString('fr-CA')} $
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dernière visite</p>
                    <p className="font-medium">{formatDate(passport.interventions[0].date)}</p>
                  </div>
                  {passport.nextInspection && (
                    <div>
                      <p className="text-sm text-muted-foreground">Prochaine inspection</p>
                      <p className="font-medium">{formatDate(passport.nextInspection)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {passport.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notes importantes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{passport.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Gérez tous les équipements de plomberie installés dans cette propriété
            </p>
            <Button onClick={() => setAddEquipmentOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter équipement
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {passport.equipment.map((equipment) => {
              const ConditionIcon = conditionConfig[equipment.condition].icon;
              
              return (
                <Card key={equipment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">{equipmentTypeLabels[equipment.type]}</CardTitle>
                      </div>
                      <Badge className={conditionConfig[equipment.condition].color}>
                        <ConditionIcon className="h-3 w-3 mr-1" />
                        {conditionConfig[equipment.condition].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Marque</p>
                        <p className="font-medium">{equipment.brand || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Modèle</p>
                        <p className="font-medium">{equipment.model || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Âge</p>
                        <p className="font-medium">{calculateAge(equipment.installDate)}</p>
                      </div>
                      {equipment.warranty && (
                        <div>
                          <p className="text-gray-600">Garantie restante</p>
                          <p className="font-medium">
                            {isWarrantyValid(equipment) ? 
                              `Jusqu'en ${new Date(equipment.warranty.expiryDate).getFullYear()}` : 
                              'Expirée'
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    {isMaintenanceDue(equipment) && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm font-medium text-orange-900 mb-2">
                          Entretien dû prochainement
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleScheduleMaintenance(equipment.id)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Planifier l'entretien
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Interventions Tab */}
        <TabsContent value="interventions" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Historique complet des interventions effectuées
            </p>
            <Button onClick={() => setAddInterventionOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter intervention
            </Button>
          </div>

          <div className="space-y-3">
            {passport.interventions.map((intervention, index) => (
              <Card key={intervention.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{intervention.serviceType}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(intervention.date)} • {intervention.technicianName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        {intervention.cost.toLocaleString('fr-CA')} $
                      </p>
                      {intervention.invoiceId && (
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          Facture #{intervention.invoiceId}
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{intervention.description}</p>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Intervention #{passport.interventions.length - index}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier d'entretien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {passport.equipment
                  .filter(eq => eq.nextMaintenance)
                  .sort((a, b) => new Date(a.nextMaintenance!).getTime() - new Date(b.nextMaintenance!).getTime())
                  .map((equipment) => {
                    const daysUntil = Math.floor(
                      (new Date(equipment.nextMaintenance!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const isDue = daysUntil <= 30;

                    return (
                      <div 
                        key={equipment.id} 
                        className={`p-4 border rounded-lg ${isDue ? 'border-orange-300 bg-orange-50' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{equipmentTypeLabels[equipment.type]}</p>
                              {isDue && (
                                <Badge className="bg-orange-100 text-orange-800">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {daysUntil <= 0 ? 'En retard' : `Dans ${daysUntil} jours`}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Prochain entretien: {formatDate(equipment.nextMaintenance!)}
                            </p>
                          </div>
                          <Button 
                            size="sm"
                            variant={isDue ? 'default' : 'outline'}
                            onClick={() => handleScheduleMaintenance(equipment.id)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Planifier
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateEquipmentModal 
        open={addEquipmentOpen} 
        onOpenChange={setAddEquipmentOpen}
        clientId={passport.clientName}
      />

      <EditEquipmentModal 
        open={editEquipmentOpen} 
        onOpenChange={setEditEquipmentOpen}
        equipment={selectedEquipment}
      />

      <ScheduleMaintenanceModal 
        open={scheduleMaintenanceOpen} 
        onOpenChange={setScheduleMaintenanceOpen}
        equipmentId={selectedEquipment?.id}
        equipmentName={selectedEquipment ? `${selectedEquipment.brand} ${selectedEquipment.model}` : ''}
        clientId={passport.clientName}
        clientName={passport.clientName}
      />
    </div>
  );
}