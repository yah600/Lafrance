/**
 * Client Dashboard
 *
 * Main dashboard for clients showing:
 * - My service requests
 * - Active jobs
 * - Invoices
 * - Quick actions
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBETAuth } from '../../context/BETAuthContext';
import { isClient } from '../../types/betUser';
import { MockDataService } from '../../services/mockDataService';
import {
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
  Plus,
  Settings,
  LogOut,
  CheckCircle,
  MapPin,
  Star,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export default function ClientDashboard() {
  const { user, logout } = useBETAuth();
  const navigate = useNavigate();
  const mockDataService = MockDataService.getInstance();
  const [stats, setStats] = useState({
    pendingRequests: 0,
    activeJobs: 0,
    unpaidInvoices: 0,
    totalSpent: 0,
  });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);

  useEffect(() => {
    if (!isClient(user)) {
      navigate('/bet-login');
      return;
    }

    loadStats();
    loadRecentJobs();
  }, [user]);

  const loadStats = () => {
    const allJobs = mockDataService.getAllJobs();
    const myJobs = allJobs.filter((job: any) => job.clientId === user?.id);

    const pending = myJobs.filter((j: any) => j.status === 'pending_review');
    const active = myJobs.filter((j: any) =>
      ['in_bet', 'assigned', 'en_route', 'in_progress'].includes(j.status)
    );
    const unpaid = myJobs.filter((j: any) => j.status === 'completed');

    setStats({
      pendingRequests: pending.length,
      activeJobs: active.length,
      unpaidInvoices: unpaid.length,
      totalSpent: user?.stats?.totalSpent || 0,
    });
  };

  const loadRecentJobs = () => {
    const allJobs = mockDataService.getAllJobs();
    const myJobs = allJobs
      .filter((job: any) => job.clientId === user?.id)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    setRecentJobs(myJobs);
  };

  if (!isClient(user)) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending_review: { label: 'En révision', className: 'bg-yellow-100 text-yellow-700' },
      in_bet: { label: 'Enchères en cours', className: 'bg-blue-100 text-blue-700' },
      assigned: { label: 'Plombier assigné', className: 'bg-green-100 text-green-700' },
      en_route: { label: 'En route', className: 'bg-purple-100 text-purple-700' },
      in_progress: { label: 'En cours', className: 'bg-indigo-100 text-indigo-700' },
      completed: { label: 'À payer', className: 'bg-orange-100 text-orange-700' },
      paid: { label: 'Payé', className: 'bg-gray-100 text-gray-700' },
      closed: { label: 'Terminé', className: 'bg-gray-100 text-gray-700' },
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tableau de bord Client
                </h1>
                <p className="text-sm text-gray-600">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/client/settings')}>
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Demandes en attente</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.pendingRequests}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jobs actifs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.activeJobs}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Factures impayées</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.unpaidInvoices}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dépenses totales</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    ${stats.totalSpent.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/client-request')}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Nouvelle demande</CardTitle>
                  <CardDescription>Demander un service de plomberie</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Soumettez une nouvelle demande de service (urgent ou normal)
              </p>
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Créer une demande
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/client/invoices')}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Mes factures</CardTitle>
                  <CardDescription>Voir et payer les factures</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {stats.unpaidInvoices > 0 ? (
                <>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="destructive">{stats.unpaidInvoices}</Badge>
                    <p className="text-sm text-red-600 font-medium">
                      Factures impayées
                    </p>
                  </div>
                  <Button variant="destructive" className="w-full">
                    Payer maintenant
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Toutes vos factures sont à jour
                  </p>
                  <Button variant="outline" className="w-full">
                    Voir l'historique
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Demandes récentes</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/client/jobs')}>
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentJobs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">Aucune demande pour le moment</p>
                <Button onClick={() => navigate('/client-request')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer votre première demande
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => navigate(`/client/jobs/${job.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <p className="font-medium text-gray-900">
                          {job.description?.substring(0, 60)}...
                        </p>
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(job.createdAt).toLocaleDateString('fr-CA')}
                        </span>
                        {job.urgency && (
                          <Badge variant={job.urgency === 'urgent' ? 'destructive' : 'secondary'}>
                            {job.urgency === 'urgent' ? 'Urgent' : 'Normal'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {job.estimatedPrice && (
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-gray-900">
                          ${job.estimatedPrice}
                        </p>
                        <p className="text-xs text-gray-500">estimé</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
