import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, Search, Filter, Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, Users, DollarSign, Phone, Mail, User, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import CreateMaintenanceContractModal from '../components/modals/CreateMaintenanceContractModal';

type ContractTier = 'bronze' | 'silver' | 'gold' | 'platinum';
type ContractStatus = 'active' | 'expiring-soon' | 'expired' | 'cancelled';

interface Contract {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  address: string;
  tier: ContractTier;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  annualCost: number;
  lastVisit?: string;
  nextVisit?: string;
  visitsCompleted: number;
  totalVisits: number;
  autoRenewal: boolean;
  notes?: string;
}

const tierConfig: Record<ContractTier, {
  name: string;
  color: string;
  bgColor: string;
  icon: string;
  price: number;
  discount: number;
  visits: number;
  features: string[];
}> = {
  bronze: {
    name: 'Bronze',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100 border-orange-300',
    icon: '🥉',
    price: 199,
    discount: 10,
    visits: 1,
    features: [
      '1 visite annuelle d\'inspection',
      '10% de rabais sur les réparations',
      'Rappels d\'entretien automatiques',
      'Support téléphonique prioritaire',
    ],
  },
  silver: {
    name: 'Argent',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100 border-gray-300',
    icon: '🥈',
    price: 349,
    discount: 15,
    visits: 2,
    features: [
      '2 visites annuelles d\'inspection',
      '15% de rabais sur les réparations',
      'Nettoyage clapet anti-retour inclus',
      'Vidange chauffe-eau incluse',
      'Support prioritaire 24/7',
      'Historique détaillé en ligne',
    ],
  },
  gold: {
    name: 'Or',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100 border-yellow-300',
    icon: '🥇',
    price: 549,
    discount: 20,
    visits: 3,
    features: [
      '3 visites annuelles d\'inspection',
      '20% de rabais sur les réparations',
      'Tous les avantages Argent',
      'Test de pompe de puisard inclus',
      'Inspection caméra annuelle (jusqu\'à 50 pieds)',
      'Intervention urgence sans frais déplacement',
      'Garantie pièces et main d\'œuvre 1 an',
    ],
  },
  platinum: {
    name: 'Platine',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100 border-purple-300',
    icon: '💎',
    price: 899,
    discount: 25,
    visits: 4,
    features: [
      '4 visites annuelles d\'inspection',
      '25% de rabais sur les réparations',
      'Tous les avantages Or',
      'Inspection caméra complète (illimitée)',
      'Détection de fuites infrarouge',
      'Entretien complet système de drainage',
      'Service VIP - technicien dédié',
      'Garantie totale 2 ans',
      'Transfert de contrat lors de vente',
    ],
  },
};

const statusConfig: Record<ContractStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  'active': { label: 'Actif', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'expiring-soon': { label: 'Expire bientôt', color: 'bg-orange-100 text-orange-800', icon: Clock },
  'expired': { label: 'Expiré', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  'cancelled': { label: 'Annulé', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
};

// Mock data
const mockContracts: Contract[] = [
  {
    id: 'CON-001',
    clientName: 'Marie Tremblay',
    clientPhone: '514-555-0123',
    clientEmail: 'marie.tremblay@example.com',
    address: '123 Rue Principale, Montréal, QC H1A 1A1',
    tier: 'gold',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    annualCost: 549,
    lastVisit: '2024-09-15',
    nextVisit: '2024-12-20',
    visitsCompleted: 2,
    totalVisits: 3,
    autoRenewal: true,
    notes: 'Client très satisfait. Préfère rendez-vous le matin.',
  },
  {
    id: 'CON-002',
    clientName: 'Jean Dupont',
    clientPhone: '450-555-0456',
    clientEmail: 'jean.dupont@example.com',
    address: '456 Avenue des Érables, Laval, QC H7E 2E2',
    tier: 'silver',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    annualCost: 349,
    lastVisit: '2024-10-05',
    nextVisit: '2025-04-01',
    visitsCompleted: 1,
    totalVisits: 2,
    autoRenewal: true,
  },
  {
    id: 'CON-003',
    clientName: 'Sophie Martin',
    clientPhone: '514-555-0789',
    clientEmail: 'sophie.martin@example.com',
    address: '789 Boulevard Saint-Laurent, Montréal, QC H2X 3B3',
    tier: 'platinum',
    status: 'active',
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    annualCost: 899,
    lastVisit: '2024-11-01',
    nextVisit: '2024-12-15',
    visitsCompleted: 3,
    totalVisits: 4,
    autoRenewal: true,
    notes: 'Propriété haut de gamme. Technicien Pierre Gagnon assigné.',
  },
  {
    id: 'CON-004',
    clientName: 'Luc Bergeron',
    clientPhone: '450-555-0321',
    clientEmail: 'luc.bergeron@example.com',
    address: '321 Rue Fleury, Laval, QC H7L 1L1',
    tier: 'bronze',
    status: 'expiring-soon',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    annualCost: 199,
    lastVisit: '2024-06-15',
    visitsCompleted: 1,
    totalVisits: 1,
    autoRenewal: false,
    notes: 'Renouvellement à confirmer avant fin décembre.',
  },
];

export default function MaintenanceContracts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | ContractStatus>('all');
  const [filterTier, setFilterTier] = useState<'all' | ContractTier>('all');
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const filteredContracts = mockContracts.filter(contract => {
    const matchesSearch = 
      contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTier = filterTier === 'all' || contract.tier === filterTier;
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const getContractsByStatus = (status: ContractStatus) => {
    return mockContracts.filter(c => c.status === status).length;
  };

  const getTotalRevenue = () => {
    return mockContracts
      .filter(c => c.status === 'active')
      .reduce((sum, c) => sum + c.annualCost, 0);
  };

  const getContractsByTier = (tier: ContractTier) => {
    return mockContracts.filter(c => c.tier === tier && c.status === 'active').length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
    });
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const days = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleScheduleVisit = (contractId: string) => {
    toast.success('Redirection vers la planification...');
    navigate(`/dispatch?contract=${contractId}`);
  };

  const handleRenewContract = (contractId: string) => {
    toast.success('Renouvellement du contrat initié!');
    // TODO: Open renewal dialog
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Contrats d'entretien
          </h1>
          <p className="text-muted-foreground mt-1">Gestion des abonnements et plans de maintenance préventive</p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[var(--primary)] hover:bg-[var(--accent-blue)]"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau contrat
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contrats actifs</p>
                <p className="text-3xl font-bold">{getContractsByStatus('active')}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenus annuels</p>
                <p className="text-3xl font-bold text-green-600">
                  {getTotalRevenue().toLocaleString('fr-CA')} $
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expirent bientôt</p>
                <p className="text-3xl font-bold text-orange-600">
                  {getContractsByStatus('expiring-soon')}
                </p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux renouvellement</p>
                <p className="text-3xl font-bold text-blue-600">94%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={(value: any) => setSelectedTab(value)}>
        <TabsList>
          <TabsTrigger value="all">Tous ({mockContracts.length})</TabsTrigger>
          <TabsTrigger value="active">Actifs ({getContractsByStatus('active')})</TabsTrigger>
          <TabsTrigger value="expiring">Expirent bientôt ({getContractsByStatus('expiring-soon')})</TabsTrigger>
          <TabsTrigger value="expired">Expirés ({getContractsByStatus('expired')})</TabsTrigger>
        </TabsList>

        {/* All Contracts Tab */}
        <TabsContent value="all" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par client, adresse ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les plans</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Argent</SelectItem>
                <SelectItem value="gold">Or</SelectItem>
                <SelectItem value="platinum">Platine</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="expiring-soon">Expire bientôt</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contracts List */}
          <div className="space-y-4">
            {filteredContracts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun contrat trouvé</p>
                </CardContent>
              </Card>
            ) : (
              filteredContracts.map((contract) => {
                const StatusIcon = statusConfig[contract.status].icon;
                const daysUntilExpiry = getDaysUntilExpiry(contract.endDate);
                const tierInfo = tierConfig[contract.tier];

                return (
                  <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{contract.clientName}</h3>
                            <Badge className={tierInfo.bgColor + ' ' + tierInfo.color}>
                              {tierInfo.icon} {tierInfo.name}
                            </Badge>
                            <Badge className={statusConfig[contract.status].color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[contract.status].label}
                            </Badge>
                            {contract.autoRenewal && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Auto-renouvellement
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{contract.address}</p>
                          <p className="text-xs text-gray-500">Contrat #{contract.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {contract.annualCost.toLocaleString('fr-CA')} $
                          </p>
                          <p className="text-xs text-gray-500">par année</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Contact Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-500" />
                            {contract.clientPhone}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-gray-500" />
                            {contract.clientEmail}
                          </div>
                        </div>

                        {/* Contract Dates */}
                        <div className="space-y-2">
                          <div className="text-sm">
                            <p className="text-gray-600">Début du contrat</p>
                            <p className="font-medium">{formatDate(contract.startDate)}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">Fin du contrat</p>
                            <p className="font-medium">
                              {formatDate(contract.endDate)}
                              {contract.status === 'expiring-soon' && (
                                <span className="ml-2 text-orange-600">
                                  ({daysUntilExpiry} jours restants)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Visits */}
                        <div className="space-y-2">
                          <div className="text-sm">
                            <p className="text-gray-600">Visites complétées</p>
                            <p className="font-medium">
                              {contract.visitsCompleted} / {contract.totalVisits}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(contract.visitsCompleted / contract.totalVisits) * 100}%` }}
                              />
                            </div>
                          </div>
                          {contract.nextVisit && (
                            <div className="text-sm">
                              <p className="text-gray-600">Prochaine visite</p>
                              <p className="font-medium text-blue-600">{formatDate(contract.nextVisit)}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {contract.notes && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                          {contract.notes}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedContract(contract);
                            setDetailModalOpen(true);
                          }}
                        >
                          Voir détails
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleScheduleVisit(contract.id)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Planifier visite
                        </Button>
                        {contract.status === 'expiring-soon' && (
                          <Button 
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => handleRenewContract(contract.id)}
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Renouveler
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/clients/${contract.id}`)}
                        >
                          Profil client
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Tiers Tab */}
        <TabsContent value="tiers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.keys(tierConfig) as ContractTier[]).map((tier) => {
              const config = tierConfig[tier];
              const activeCount = getContractsByTier(tier);

              return (
                <Card key={tier} className={`${config.bgColor} border-2 hover:shadow-xl transition-shadow`}>
                  <CardHeader>
                    <div className="text-center">
                      <div className="text-5xl mb-2">{config.icon}</div>
                      <CardTitle className={config.color}>{config.name}</CardTitle>
                      <CardDescription className="mt-2">
                        <span className="text-3xl font-bold text-gray-900">
                          {config.price}$
                        </span>
                        <span className="text-gray-600">/an</span>
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600">Clients actifs</p>
                      <p className="text-2xl font-bold">{activeCount}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="font-semibold">{config.visits} visite{config.visits > 1 ? 's' : ''} annuelle{config.visits > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="font-semibold">{config.discount}% de rabais</span>
                      </div>
                      {config.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full" variant="outline">
                      Créer contrat {config.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenus par plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(Object.keys(tierConfig) as ContractTier[]).map((tier) => {
                  const config = tierConfig[tier];
                  const count = getContractsByTier(tier);
                  const revenue = count * config.price;
                  const total = getTotalRevenue();
                  const percentage = total > 0 ? (revenue / total) * 100 : 0;

                  return (
                    <div key={tier}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span>{config.icon}</span>
                          <span className="font-medium">{config.name}</span>
                          <Badge variant="secondary">{count} contrats</Badge>
                        </div>
                        <span className="font-bold text-green-600">
                          {revenue.toLocaleString('fr-CA')} $
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            tier === 'bronze' ? 'bg-orange-500' :
                            tier === 'silver' ? 'bg-gray-500' :
                            tier === 'gold' ? 'bg-yellow-500' :
                            'bg-purple-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% du total</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Métriques clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Valeur moyenne</p>
                    <p className="text-2xl font-bold text-green-600">
                      {mockContracts.length > 0 
                        ? Math.round(getTotalRevenue() / mockContracts.filter(c => c.status === 'active').length)
                        : 0
                      } $
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Taux rétention</p>
                    <p className="text-2xl font-bold text-blue-600">94%</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Revenus mensuels</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(getTotalRevenue() / 12).toLocaleString('fr-CA')} $
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Croissance</p>
                    <p className="text-2xl font-bold text-orange-600">+23%</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Opportunités</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium">Renouvellements à faire</p>
                        <p className="text-sm text-gray-600">Prochains 30 jours</p>
                      </div>
                      <Badge className="bg-orange-600 text-white">
                        {getContractsByStatus('expiring-soon')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Clients sans contrat</p>
                        <p className="text-sm text-gray-600">Opportunité de vente</p>
                      </div>
                      <Badge className="bg-blue-600 text-white">47</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Contract Dialog */}
      <CreateMaintenanceContractModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen}
      />

      {/* Contract Detail Dialog */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du contrat</DialogTitle>
            <DialogDescription>
              Informations détaillées sur le contrat d'entretien
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedContract && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom du client</Label>
                    <Input value={selectedContract.clientName} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input value={selectedContract.clientPhone} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Courriel</Label>
                  <Input type="email" value={selectedContract.clientEmail} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input value={selectedContract.address} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Plan d'entretien</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un plan..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bronze">🥉 Bronze - 199$/an</SelectItem>
                      <SelectItem value="silver">🥈 Argent - 349$/an</SelectItem>
                      <SelectItem value="gold">🥇 Or - 549$/an</SelectItem>
                      <SelectItem value="platinum">💎 Platine - 899$/an</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input type="date" value={selectedContract.startDate} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input type="date" value={selectedContract.endDate} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Coût annuel</Label>
                  <Input type="number" value={selectedContract.annualCost} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Visites complétées</Label>
                  <Input type="number" value={selectedContract.visitsCompleted} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Total de visites</Label>
                  <Input type="number" value={selectedContract.totalVisits} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Renouvellement automatique</Label>
                  <Input type="checkbox" checked={selectedContract.autoRenewal} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Notes (optionnel)</Label>
                  <Textarea value={selectedContract.notes || ''} readOnly />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}