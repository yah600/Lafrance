import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, Search, Filter, Calendar, Wrench, MapPin, Phone, Mail, User, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

interface Equipment {
  id: string;
  type: 'water-heater' | 'backwater-valve' | 'sump-pump' | 'water-main' | 'drain-system';
  brand?: string;
  model?: string;
  serialNumber?: string;
  installDate: string;
  warranty?: {
    years: number;
    expiryDate: string;
  };
  lastMaintenance?: string;
  nextMaintenance?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs-replacement';
  notes?: string;
}

interface Intervention {
  id: string;
  date: string;
  technicianName: string;
  serviceType: string;
  description: string;
  cost: number;
  invoiceId?: string;
}

interface PropertyPassport {
  id: string;
  address: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  propertyType: 'residential' | 'commercial' | 'multi-unit';
  yearBuilt?: number;
  lastInspection?: string;
  nextInspection?: string;
  equipment: Equipment[];
  interventions: Intervention[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockPassports: PropertyPassport[] = [
  {
    id: '1',
    address: '123 Rue Principale, Montréal, QC H1A 1A1',
    clientName: 'Marie Tremblay',
    clientPhone: '514-555-0123',
    clientEmail: 'marie.tremblay@example.com',
    propertyType: 'residential',
    yearBuilt: 1985,
    lastInspection: '2024-06-15',
    nextInspection: '2025-06-15',
    equipment: [
      {
        id: 'eq1',
        type: 'water-heater',
        brand: 'Rheem',
        model: 'Performance Platinum 50 Gal',
        serialNumber: 'RH2019-12345',
        installDate: '2019-03-15',
        warranty: { years: 12, expiryDate: '2031-03-15' },
        lastMaintenance: '2024-03-15',
        nextMaintenance: '2025-03-15',
        condition: 'good',
        notes: 'Détecteur WiFi installé',
      },
      {
        id: 'eq2',
        type: 'backwater-valve',
        brand: 'Mainline',
        installDate: '2020-08-10',
        lastMaintenance: '2024-08-10',
        nextMaintenance: '2025-08-10',
        condition: 'excellent',
        notes: 'Certificat municipal valide jusqu\'en 2025',
      },
      {
        id: 'eq3',
        type: 'sump-pump',
        brand: 'Zoeller',
        model: 'M53',
        serialNumber: 'ZO2021-67890',
        installDate: '2021-05-20',
        lastMaintenance: '2024-05-20',
        nextMaintenance: '2025-05-20',
        condition: 'excellent',
        notes: 'Pompe de secours à batterie installée',
      },
    ],
    interventions: [
      {
        id: 'int1',
        date: '2024-11-15',
        technicianName: 'Pierre Gagnon',
        serviceType: 'Entretien annuel',
        description: 'Inspection complète du chauffe-eau et de la pompe de puisard',
        cost: 250,
        invoiceId: 'INV-2024-1156',
      },
      {
        id: 'int2',
        date: '2024-08-10',
        technicianName: 'Marc Leblanc',
        serviceType: 'Nettoyage clapet',
        description: 'Nettoyage et inspection du clapet anti-retour',
        cost: 175,
        invoiceId: 'INV-2024-0892',
      },
    ],
    notes: 'Client préfère rendez-vous le matin. Chien amical dans la cour.',
    createdAt: '2019-03-15',
    updatedAt: '2024-11-15',
  },
  {
    id: '2',
    address: '456 Avenue des Érables, Laval, QC H7E 2E2',
    clientName: 'Jean Dupont',
    clientPhone: '450-555-0456',
    clientEmail: 'jean.dupont@example.com',
    propertyType: 'residential',
    yearBuilt: 2010,
    lastInspection: '2024-09-20',
    equipment: [
      {
        id: 'eq4',
        type: 'water-heater',
        brand: 'Bradford White',
        model: 'AeroTherm',
        installDate: '2010-01-15',
        condition: 'poor',
        notes: '⚠️ Remplacement recommandé - 14 ans d\'âge',
      },
    ],
    interventions: [
      {
        id: 'int3',
        date: '2024-09-20',
        technicianName: 'Pierre Gagnon',
        serviceType: 'Dépannage urgence',
        description: 'Réparation fuite chauffe-eau',
        cost: 350,
      },
    ],
    createdAt: '2022-05-10',
    updatedAt: '2024-09-20',
  },
];

const equipmentTypeLabels: Record<Equipment['type'], string> = {
  'water-heater': 'Chauffe-eau',
  'backwater-valve': 'Clapet anti-retour',
  'sump-pump': 'Pompe de puisard',
  'water-main': 'Entrée d\'eau principale',
  'drain-system': 'Système de drainage',
};

const conditionConfig: Record<Equipment['condition'], { label: string; color: string }> = {
  'excellent': { label: 'Excellent', color: 'bg-green-100 text-green-800' },
  'good': { label: 'Bon', color: 'bg-blue-100 text-blue-800' },
  'fair': { label: 'Acceptable', color: 'bg-yellow-100 text-yellow-800' },
  'poor': { label: 'Mauvais', color: 'bg-orange-100 text-orange-800' },
  'needs-replacement': { label: 'À remplacer', color: 'bg-red-100 text-red-800' },
};

export default function PropertyPassports() {
  const navigate = useNavigate();
  const [passports, setPassports] = useState<PropertyPassport[]>(mockPassports);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPassport, setNewPassport] = useState({
    address: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    propertyType: 'residential' as PropertyPassport['propertyType'],
    yearBuilt: '',
  });

  const filteredPassports = passports.filter(passport => {
    const matchesSearch = 
      passport.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      passport.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || passport.propertyType === filterType;

    return matchesSearch && matchesType;
  });

  const getEquipmentNeedingAttention = (passport: PropertyPassport) => {
    return passport.equipment.filter(eq => 
      eq.condition === 'poor' || eq.condition === 'needs-replacement'
    ).length;
  };

  const getTotalEquipment = () => {
    return passports.reduce((sum, p) => sum + p.equipment.length, 0);
  };

  const getEquipmentByCondition = (condition: Equipment['condition']) => {
    return passports.reduce((sum, p) => 
      sum + p.equipment.filter(eq => eq.condition === condition).length, 0
    );
  };

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
    return years;
  };

  const handleCreatePassport = () => {
    const newId = (passports.length + 1).toString();
    const newPassportWithId: PropertyPassport = {
      ...newPassport,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      equipment: [],
      interventions: [],
    };
    setPassports([...passports, newPassportWithId]);
    setCreateModalOpen(false);
    toast.success('Passeport créé avec succès');
    navigate(`/property-passports/${newId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Passeports de propriété</h1>
          <p className="text-muted-foreground mt-1">Dossier complet de chaque propriété et ses équipements</p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[var(--primary)] hover:bg-[var(--accent-blue)]"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau passeport
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total propriétés</p>
                <p className="text-3xl font-bold">{passports.length}</p>
              </div>
              <Home className="h-10 w-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Équipements</p>
                <p className="text-3xl font-bold">{getTotalEquipment()}</p>
              </div>
              <Wrench className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attention requise</p>
                <p className="text-3xl font-bold text-orange-600">
                  {getEquipmentByCondition('poor') + getEquipmentByCondition('needs-replacement')}
                </p>
              </div>
              <AlertTriangle className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Excellent état</p>
                <p className="text-3xl font-bold text-green-600">
                  {getEquipmentByCondition('excellent')}
                </p>
              </div>
              <Wrench className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par adresse ou nom de client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="residential">Résidentiel</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="multi-unit">Multi-logements</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Passports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPassports.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="p-12 text-center">
              <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun passeport trouvé</p>
            </CardContent>
          </Card>
        ) : (
          filteredPassports.map((passport) => {
            const needsAttention = getEquipmentNeedingAttention(passport);
            
            return (
              <Card 
                key={passport.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/property-passports/${passport.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-blue-600" />
                        {passport.address}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          {passport.propertyType === 'residential' && 'Résidentiel'}
                          {passport.propertyType === 'commercial' && 'Commercial'}
                          {passport.propertyType === 'multi-unit' && 'Multi-logements'}
                        </Badge>
                        {passport.yearBuilt && (
                          <Badge variant="secondary">
                            Construit en {passport.yearBuilt}
                          </Badge>
                        )}
                        {needsAttention > 0 && (
                          <Badge className="bg-orange-100 text-orange-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {needsAttention} attention requise
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Client Info */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{passport.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {passport.clientPhone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      {passport.clientEmail}
                    </div>
                  </div>

                  {/* Equipment Summary */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Équipements ({passport.equipment.length})</p>
                    <div className="space-y-2">
                      {passport.equipment.slice(0, 3).map((equipment) => {
                        const age = calculateAge(equipment.installDate);
                        
                        return (
                          <div key={equipment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <div className="flex-1">
                              <p className="font-medium">{equipmentTypeLabels[equipment.type]}</p>
                              <p className="text-xs text-gray-600">
                                {equipment.brand} {equipment.model && `• ${equipment.model}`} • {age} ans
                              </p>
                            </div>
                            <Badge className={conditionConfig[equipment.condition].color}>
                              {conditionConfig[equipment.condition].label}
                            </Badge>
                          </div>
                        );
                      })}
                      {passport.equipment.length > 3 && (
                        <p className="text-xs text-center text-gray-500">
                          +{passport.equipment.length - 3} de plus...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Last Intervention */}
                  {passport.interventions.length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-semibold mb-1">Dernière intervention</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(passport.interventions[0].date)}
                        <span>•</span>
                        <span>{passport.interventions[0].serviceType}</span>
                      </div>
                    </div>
                  )}

                  {/* View Button */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/property-passports/${passport.id}`);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Voir le passeport complet
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Passport Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nouveau passeport de propriété</DialogTitle>
            <DialogDescription>
              Créez un nouveau passeport de propriété pour une nouvelle propriété.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={newPassport.address}
                onChange={(e) => setNewPassport({ ...newPassport, address: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientName">Nom du client</Label>
              <Input
                id="clientName"
                value={newPassport.clientName}
                onChange={(e) => setNewPassport({ ...newPassport, clientName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientPhone">Téléphone du client</Label>
              <Input
                id="clientPhone"
                value={newPassport.clientPhone}
                onChange={(e) => setNewPassport({ ...newPassport, clientPhone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientEmail">Email du client</Label>
              <Input
                id="clientEmail"
                value={newPassport.clientEmail}
                onChange={(e) => setNewPassport({ ...newPassport, clientEmail: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="propertyType">Type de propriété</Label>
              <Select
                value={newPassport.propertyType}
                onValueChange={(value) => setNewPassport({ ...newPassport, propertyType: value as PropertyPassport['propertyType'] })}
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Résidentiel</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="multi-unit">Multi-logements</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="yearBuilt">Année de construction</Label>
              <Input
                id="yearBuilt"
                value={newPassport.yearBuilt}
                onChange={(e) => setNewPassport({ ...newPassport, yearBuilt: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleCreatePassport}
              className="bg-[var(--primary)] hover:bg-[var(--accent-blue)]"
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}