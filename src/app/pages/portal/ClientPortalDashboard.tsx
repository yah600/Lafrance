import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText,
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus,
  MessageSquare,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useMediaQuery';

export default function ClientPortalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Mock data - in production, this would come from API
  const [requests] = useState([
    {
      id: '1',
      service: 'Réparation robinet',
      status: 'in-progress',
      date: '2025-12-15',
      technician: 'Marc Tremblay',
      priority: 'high'
    },
    {
      id: '2',
      service: 'Installation chauffe-eau',
      status: 'scheduled',
      date: '2025-12-20',
      technician: 'Pierre Gagnon',
      priority: 'normal'
    },
    {
      id: '3',
      service: 'Débouchage drain',
      status: 'completed',
      date: '2025-12-10',
      technician: 'Marc Tremblay',
      priority: 'urgent'
    }
  ]);

  const [invoices] = useState([
    {
      id: 'INV-001',
      amount: 250.00,
      status: 'paid',
      date: '2025-12-10'
    },
    {
      id: 'INV-002',
      amount: 450.00,
      status: 'pending',
      date: '2025-12-15',
      dueDate: '2025-12-25'
    }
  ]);

  const statusColors = {
    'new': 'bg-blue-100 text-blue-800',
    'scheduled': 'bg-purple-100 text-purple-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    'low': 'border-gray-300',
    'normal': 'border-blue-300',
    'high': 'border-orange-300',
    'urgent': 'border-red-500'
  };

  const stats = {
    activeRequests: requests.filter(r => ['new', 'scheduled', 'in-progress'].includes(r.status)).length,
    completedJobs: requests.filter(r => r.status === 'completed').length,
    pendingPayments: invoices.filter(i => i.status === 'pending').length,
    unreadMessages: 3
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-600 mt-1">Voici un aperçu de vos services de plomberie</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Demandes actives</p>
                <p className="text-3xl font-bold text-blue-600">{stats.activeRequests}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Travaux complétés</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedJobs}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paiements en attente</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingPayments}</p>
              </div>
              <CreditCard className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages non lus</p>
                <p className="text-3xl font-bold text-purple-600">{stats.unreadMessages}</p>
              </div>
              <MessageSquare className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-100/50 transition-colors cursor-pointer" onClick={() => navigate('/client-portal/new-request')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Nouvelle demande</h3>
                <p className="text-sm text-blue-700">Créer une nouvelle demande de service</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-100/50 transition-colors cursor-pointer" onClick={() => navigate('/client-portal/messages')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Messages</h3>
                <p className="text-sm text-purple-700">Communiquer avec notre équipe</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Demandes récentes</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/client-portal/requests')}>
              Voir tout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requests.slice(0, 3).map((request) => (
              <div 
                key={request.id} 
                className={`p-4 border-l-4 ${priorityColors[request.priority as keyof typeof priorityColors]} rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => navigate(`/client-portal/requests/${request.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">{request.service}</h4>
                      <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                        {request.status === 'in-progress' && 'En cours'}
                        {request.status === 'scheduled' && 'Planifié'}
                        {request.status === 'completed' && 'Complété'}
                        {request.status === 'new' && 'Nouveau'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(request.date).toLocaleDateString('fr-CA')}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {request.technician}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Détails
                  </Button>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Aucune demande pour le moment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Factures récentes</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/client-portal/invoices')}>
              Voir tout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div 
                key={invoice.id} 
                className="p-4 rounded-lg bg-white border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/client-portal/invoices/${invoice.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">{invoice.id}</h4>
                      <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                        {invoice.status === 'paid' ? 'Payé' : 'En attente'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(invoice.date).toLocaleDateString('fr-CA')}
                      </div>
                      {invoice.status === 'pending' && invoice.dueDate && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Clock className="h-4 w-4" />
                          Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-CA')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${invoice.amount.toFixed(2)}</p>
                    {invoice.status === 'pending' && (
                      <Button size="sm" className="mt-2">
                        Payer maintenant
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {invoices.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Aucune facture disponible</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}