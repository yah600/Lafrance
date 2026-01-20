import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Filter, Search, FileText, Clock, CheckCircle2, XCircle, 
  AlertCircle, Calendar, MapPin, User, Phone, MessageSquare, Eye,
  Download, MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  address: string;
  technician?: {
    name: string;
    phone: string;
    photo?: string;
  };
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  attachments?: string[];
  updates: {
    id: string;
    timestamp: Date;
    message: string;
    type: 'status' | 'note' | 'schedule';
  }[];
}

export default function ClientPortalRequests() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Mock data - would come from API
  const [requests] = useState<ServiceRequest[]>([
    {
      id: 'REQ-2025-001',
      title: 'Réparation fuite robinet cuisine',
      description: 'Le robinet de la cuisine fuit constamment. L\'eau coule même lorsque le robinet est fermé.',
      serviceType: 'Dépannage et réparation',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date('2025-12-17T08:30:00'),
      scheduledDate: new Date('2025-12-17T14:00:00'),
      address: '123 Rue Principale, Montréal, QC H1A 1A1',
      technician: {
        name: 'Marc Tremblay',
        phone: '514-555-0100',
      },
      estimatedCost: 150,
      updates: [
        {
          id: '1',
          timestamp: new Date('2025-12-17T09:00:00'),
          message: 'Demande confirmée. Un technicien a été assigné.',
          type: 'status',
        },
        {
          id: '2',
          timestamp: new Date('2025-12-17T13:30:00'),
          message: 'Le technicien est en route vers votre adresse.',
          type: 'status',
        },
      ],
    },
    {
      id: 'REQ-2025-002',
      title: 'Installation chauffe-eau',
      description: 'Installation d\'un nouveau chauffe-eau électrique 40 gallons.',
      serviceType: 'Installation',
      status: 'confirmed',
      priority: 'normal',
      createdAt: new Date('2025-12-16T10:15:00'),
      scheduledDate: new Date('2025-12-19T09:00:00'),
      address: '123 Rue Principale, Montréal, QC H1A 1A1',
      technician: {
        name: 'Jean Lapointe',
        phone: '514-555-0101',
      },
      estimatedCost: 850,
      updates: [
        {
          id: '1',
          timestamp: new Date('2025-12-16T11:00:00'),
          message: 'Demande reçue et confirmée pour le 19 décembre.',
          type: 'status',
        },
      ],
    },
    {
      id: 'REQ-2025-003',
      title: 'Débouchage drain principal',
      description: 'Le drain principal de la maison est complètement bouché.',
      serviceType: 'Dépannage et réparation',
      status: 'completed',
      priority: 'urgent',
      createdAt: new Date('2025-12-14T15:20:00'),
      scheduledDate: new Date('2025-12-14T16:00:00'),
      completedDate: new Date('2025-12-14T17:45:00'),
      address: '123 Rue Principale, Montréal, QC H1A 1A1',
      technician: {
        name: 'Pierre Dubois',
        phone: '514-555-0102',
      },
      estimatedCost: 200,
      actualCost: 275,
      updates: [
        {
          id: '1',
          timestamp: new Date('2025-12-14T15:30:00'),
          message: 'Intervention d\'urgence planifiée dans 30 minutes.',
          type: 'status',
        },
        {
          id: '2',
          timestamp: new Date('2025-12-14T17:45:00'),
          message: 'Travaux terminés. Le drain fonctionne normalement.',
          type: 'status',
        },
      ],
    },
    {
      id: 'REQ-2025-004',
      title: 'Inspection annuelle système plomberie',
      description: 'Inspection complète du système de plomberie pour maintenance préventive.',
      serviceType: 'Entretien',
      status: 'pending',
      priority: 'low',
      createdAt: new Date('2025-12-17T11:00:00'),
      address: '123 Rue Principale, Montréal, QC H1A 1A1',
      estimatedCost: 125,
      updates: [
        {
          id: '1',
          timestamp: new Date('2025-12-17T11:00:00'),
          message: 'Demande reçue. Nous vous contacterons sous peu pour planifier.',
          type: 'status',
        },
      ],
    },
    {
      id: 'REQ-2025-005',
      title: 'Réparation toilette qui coule',
      description: 'La toilette continue de couler après la chasse d\'eau.',
      serviceType: 'Dépannage et réparation',
      status: 'cancelled',
      priority: 'normal',
      createdAt: new Date('2025-12-10T09:00:00'),
      address: '123 Rue Principale, Montréal, QC H1A 1A1',
      updates: [
        {
          id: '1',
          timestamp: new Date('2025-12-10T14:00:00'),
          message: 'Demande annulée par le client.',
          type: 'status',
        },
      ],
    },
  ]);

  const getStatusBadge = (status: ServiceRequest['status']) => {
    const statusConfig = {
      pending: {
        label: 'En attente',
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        icon: Clock,
      },
      confirmed: {
        label: 'Confirmée',
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
        icon: CheckCircle2,
      },
      'in-progress': {
        label: 'En cours',
        className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
        icon: AlertCircle,
      },
      completed: {
        label: 'Complétée',
        className: 'bg-green-100 text-green-800 hover:bg-green-100',
        icon: CheckCircle2,
      },
      cancelled: {
        label: 'Annulée',
        className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
        icon: XCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: ServiceRequest['priority']) => {
    const priorityConfig = {
      low: { label: 'Basse', className: 'bg-gray-100 text-gray-800' },
      normal: { label: 'Normale', className: 'bg-blue-100 text-blue-800' },
      high: { label: 'Haute', className: 'bg-orange-100 text-orange-800' },
      urgent: { label: 'Urgente', className: 'bg-red-100 text-red-800' },
    };

    const config = priorityConfig[priority];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getRequestsByStatus = (status: ServiceRequest['status'] | 'all') => {
    if (status === 'all') return filteredRequests;
    return filteredRequests.filter(r => r.status === status);
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleCancelRequest = (requestId: string) => {
    toast.success(`Demande ${requestId} annulée avec succès`);
    setIsDetailsOpen(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatShortDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-CA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes demandes de service</h1>
          <p className="text-gray-600 mt-1">Suivez toutes vos demandes et interventions</p>
        </div>
        <Button 
          onClick={() => navigate('/client-portal/new-request')}
          className="bg-[var(--primary)] hover:bg-[var(--primary)]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Complétées</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par numéro, titre ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="completed">Complétée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Vos demandes</CardTitle>
          <CardDescription>
            {filteredRequests.length} demande{filteredRequests.length !== 1 ? 's' : ''} trouvée{filteredRequests.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
              <TabsTrigger value="all">
                Toutes ({filteredRequests.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                En attente ({getRequestsByStatus('pending').length})
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                Confirmées ({getRequestsByStatus('confirmed').length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                En cours ({getRequestsByStatus('in-progress').length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Complétées ({getRequestsByStatus('completed').length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Annulées ({getRequestsByStatus('cancelled').length})
              </TabsTrigger>
            </TabsList>

            {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(status => (
              <TabsContent key={status} value={status} className="space-y-4">
                {getRequestsByStatus(status as ServiceRequest['status'] | 'all').length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune demande dans cette catégorie</p>
                  </div>
                ) : (
                  getRequestsByStatus(status as ServiceRequest['status'] | 'all').map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(request)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-semibold text-gray-900">{request.id}</span>
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                            <Badge variant="outline" className="text-xs">
                              {request.serviceType}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-lg text-gray-900">{request.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Créée: {formatShortDate(request.createdAt)}</span>
                            </div>

                            {request.scheduledDate && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>Planifiée: {formatShortDate(request.scheduledDate)}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{request.address}</span>
                            </div>

                            {request.technician && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <User className="h-4 w-4" />
                                <span>{request.technician.name}</span>
                              </div>
                            )}
                          </div>

                          {request.estimatedCost && (
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-600">
                                Coût estimé: <span className="font-semibold text-gray-900">${request.estimatedCost}</span>
                              </span>
                              {request.actualCost && (
                                <span className="text-sm text-gray-600">
                                  Coût final: <span className="font-semibold text-gray-900">${request.actualCost}</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(request);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Request Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
            <DialogDescription>
              Informations complètes sur votre demande de service
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-xl">{selectedRequest.id}</h3>
                    {getStatusBadge(selectedRequest.status)}
                    {getPriorityBadge(selectedRequest.priority)}
                  </div>
                  <p className="text-gray-600">{selectedRequest.serviceType}</p>
                </div>
              </div>

              <Separator />

              {/* Main Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Titre</h4>
                  <p className="text-gray-700">{selectedRequest.title}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{selectedRequest.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date de création
                    </h4>
                    <p className="text-gray-700">{formatDate(selectedRequest.createdAt)}</p>
                  </div>

                  {selectedRequest.scheduledDate && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Date planifiée
                      </h4>
                      <p className="text-gray-700">{formatDate(selectedRequest.scheduledDate)}</p>
                    </div>
                  )}

                  {selectedRequest.completedDate && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Date de complétion
                      </h4>
                      <p className="text-gray-700">{formatDate(selectedRequest.completedDate)}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Adresse
                    </h4>
                    <p className="text-gray-700">{selectedRequest.address}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Technician Info */}
              {selectedRequest.technician && (
                <>
                  <div>
                    <h4 className="font-semibold mb-3">Technicien assigné</h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{selectedRequest.technician.name}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {selectedRequest.technician.phone}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contacter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Separator />
                </>
              )}

              {/* Cost Info */}
              {selectedRequest.estimatedCost && (
                <>
                  <div>
                    <h4 className="font-semibold mb-3">Coûts</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600 mb-1">Coût estimé</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${selectedRequest.estimatedCost}
                          </p>
                        </CardContent>
                      </Card>
                      {selectedRequest.actualCost && (
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Coût final</p>
                            <p className="text-2xl font-bold text-gray-900">
                              ${selectedRequest.actualCost}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Updates Timeline */}
              <div>
                <h4 className="font-semibold mb-3">Historique des mises à jour</h4>
                <div className="space-y-3">
                  {selectedRequest.updates.map((update, index) => (
                    <div key={update.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        {index < selectedRequest.updates.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm text-gray-900">{update.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(update.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                  className="flex-1"
                >
                  Fermer
                </Button>
                {selectedRequest.status === 'pending' && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelRequest(selectedRequest.id)}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Annuler la demande
                  </Button>
                )}
                {selectedRequest.status === 'completed' && selectedRequest.actualCost && (
                  <Button
                    onClick={() => {
                      toast.info('Redirection vers la facture...');
                      setIsDetailsOpen(false);
                      navigate('/client-portal/invoices');
                    }}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Voir la facture
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
