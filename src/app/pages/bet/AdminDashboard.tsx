/**
 * Internal Admin Dashboard
 *
 * Main dashboard for Groupe Lafrance staff showing:
 * - Pending job reviews
 * - Active BET jobs
 * - After-sales claims
 * - Payment management
 * - Platform stats
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBETAuth } from '../../context/BETAuthContext';
import { isInternalAdmin } from '../../types/betUser';
import { MockDataService } from '../../services/mockDataService';
import {
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
  Users,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export default function AdminDashboard() {
  const { user, logout } = useBETAuth();
  const navigate = useNavigate();
  const mockDataService = MockDataService.getInstance();
  const [stats, setStats] = useState({
    pendingReviews: 0,
    activeBets: 0,
    pendingClaims: 0,
    totalPlumbers: 0,
    totalClients: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    if (!isInternalAdmin(user)) {
      navigate('/bet-login');
      return;
    }

    loadStats();
  }, [user]);

  const loadStats = () => {
    const allJobs = mockDataService.getAllJobs();
    const pending = allJobs.filter((j: any) => j.status === 'pending_review');
    const activeBets = allJobs.filter((j: any) => j.status === 'in_bet');

    const allClaims = mockDataService.getAllClaims();
    const pendingClaims = allClaims.filter(
      (c: any) => c.status === 'submitted' || c.status === 'awaiting_client_selection'
    );

    const plumbers = mockDataService.getAllPlumbers();
    const clients = mockDataService.getAllClients();

    // Calculate today's revenue (mock calculation)
    const today = new Date().toDateString();
    const payments = mockDataService.getAllPayments();
    const todayPayments = payments.filter(
      (p: any) => new Date(p.transactionDate).toDateString() === today
    );
    const todayRevenue = todayPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    setStats({
      pendingReviews: pending.length,
      activeBets: activeBets.length,
      pendingClaims: pendingClaims.length,
      totalPlumbers: plumbers.length,
      totalClients: clients.length,
      todayRevenue,
    });
  };

  if (!isInternalAdmin(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Administration BET
                </h1>
                <p className="text-sm text-gray-600">
                  {user.firstName} {user.lastName} - {user.title}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-purple-100 text-purple-700 border border-purple-300">
                ADMIN
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/settings')}>
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
        {/* Alerts */}
        {(stats.pendingReviews > 0 || stats.pendingClaims > 0) && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">
                    Actions requises
                  </h3>
                  <div className="space-y-2">
                    {stats.pendingReviews > 0 && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-orange-700">
                          {stats.pendingReviews} demandes en attente de révision
                        </p>
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => navigate('/admin/review-queue')}
                        >
                          Réviser
                        </Button>
                      </div>
                    )}
                    {stats.pendingClaims > 0 && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-orange-700">
                          {stats.pendingClaims} réclamations après-vente nécessitent votre attention
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-600 text-orange-600"
                          onClick={() => navigate('/admin/claims')}
                        >
                          Voir
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Demandes à réviser</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.pendingReviews}
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
                  <p className="text-sm font-medium text-gray-600">BET actifs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.activeBets}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Réclamations</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.pendingClaims}
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
                  <p className="text-sm font-medium text-gray-600">Plombiers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.totalPlumbers}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clients</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.totalClients}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus aujourd'hui</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    ${stats.todayRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/review-queue')}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">File de révision</CardTitle>
                  <CardDescription>Approuver/rejeter les demandes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {stats.pendingReviews > 0 ? (
                <>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="destructive">{stats.pendingReviews}</Badge>
                    <p className="text-sm text-red-600 font-medium">
                      En attente
                    </p>
                  </div>
                  <Button className="w-full">
                    Réviser maintenant
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Aucune demande en attente
                  </p>
                  <Button variant="outline" className="w-full">
                    Voir l'historique
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/claims')}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Réclamations</CardTitle>
                  <CardDescription>Arbitrer les après-ventes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {stats.pendingClaims > 0 ? (
                <>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="destructive">{stats.pendingClaims}</Badge>
                    <p className="text-sm text-red-600 font-medium">
                      Nécessitent arbitrage
                    </p>
                  </div>
                  <Button variant="destructive" className="w-full">
                    Arbitrer
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Aucune réclamation active
                  </p>
                  <Button variant="outline" className="w-full">
                    Voir l'historique
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/payments')}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Gestion des paiements</CardTitle>
                  <CardDescription>Suivi 75%/25%</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Gérer les paiements et les retenues
              </p>
              <Button variant="outline" className="w-full">
                Accéder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
