/**
 * Plumber Dashboard
 *
 * Main dashboard for plumbers showing:
 * - Active jobs in marketplace
 * - My bids
 * - Won jobs
 * - Earnings summary
 * - Quick actions
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBETAuth } from '../../context/BETAuthContext';
import { isPlumber } from '../../types/betUser';
import { MockDataService } from '../../services/mockDataService';
import {
  Briefcase,
  DollarSign,
  Clock,
  TrendingUp,
  Star,
  AlertCircle,
  MapPin,
  Settings,
  LogOut,
  FileText,
  Bell,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export default function PlumberDashboard() {
  const { user, logout } = useBETAuth();
  const navigate = useNavigate();
  const mockDataService = MockDataService.getInstance();
  const [stats, setStats] = useState({
    activeJobsCount: 0,
    myBidsCount: 0,
    wonJobsCount: 0,
    totalEarnings: 0,
    pendingClaims: 0,
  });

  useEffect(() => {
    if (!isPlumber(user)) {
      navigate('/bet-login');
      return;
    }

    loadStats();
  }, [user]);

  const loadStats = () => {
    // Get active jobs in marketplace
    const activeJobs = mockDataService.getJobsByStatus('in_bet');

    // Get my bids
    const allBids = mockDataService.getAllBids();
    const myBids = allBids.filter((bid: any) => bid.plumberId === user?.id);

    // Get won jobs
    const allJobs = mockDataService.getAllJobs();
    const wonJobs = allJobs.filter((job: any) =>
      job.plumberId === user?.id && ['assigned', 'en_route', 'in_progress'].includes(job.status)
    );

    // Get my claims
    const myClaims = mockDataService.getClaimsByPlumber(user?.id || '');
    const pendingClaims = myClaims.filter((c: any) => c.status === 'submitted' || c.status === 'awaiting_client_selection');

    setStats({
      activeJobsCount: activeJobs.length,
      myBidsCount: myBids.length,
      wonJobsCount: wonJobs.length,
      totalEarnings: user?.stats?.totalEarnings || 0,
      pendingClaims: pendingClaims.length,
    });
  };

  if (!isPlumber(user)) {
    return null;
  }

  const subscriptionColor = {
    bronze: 'bg-orange-100 text-orange-700 border-orange-300',
    silver: 'bg-gray-100 text-gray-700 border-gray-300',
    gold: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  }[user.subscription.tier];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.businessName}
                </h1>
                <p className="text-sm text-gray-600">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${subscriptionColor} border`}>
                {user.subscription.tier.toUpperCase()}
                {user.subscription.status === 'trial' && ' (Essai)'}
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => navigate('/plumber/settings')}>
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
        {/* Compliance Warning */}
        {!user.complianceStatus.isCompliant && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-900 mb-1">
                    Documents de conformité manquants
                  </h3>
                  <p className="text-sm text-orange-700 mb-3">
                    {user.complianceStatus.note}
                  </p>
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => navigate('/plumber/compliance')}
                  >
                    Téléverser les documents
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jobs actifs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.activeJobsCount}
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
                  <p className="text-sm font-medium text-gray-600">Mes offres</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.myBidsCount}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jobs gagnés</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.wonJobsCount}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gains totaux</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    ${stats.totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/plumber-marketplace')}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Marketplace BET</CardTitle>
                  <CardDescription>Voir les jobs disponibles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                {stats.activeJobsCount} jobs actifs dans votre rayon
              </p>
              <Button className="w-full">
                Accéder au marketplace
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/plumber/payments')}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Paiements</CardTitle>
                  <CardDescription>Gérer vos paiements</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Consultez vos gains et paiements en attente
              </p>
              <Button variant="outline" className="w-full">
                Voir les paiements
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/plumber/aftersales')}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Après-vente</CardTitle>
                  <CardDescription>Réclamations clients</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {stats.pendingClaims > 0 ? (
                <>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="destructive">{stats.pendingClaims}</Badge>
                    <p className="text-sm text-red-600 font-medium">
                      Réclamations en attente
                    </p>
                  </div>
                  <Button variant="destructive" className="w-full">
                    Répondre maintenant
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Aucune réclamation en attente
                  </p>
                  <Button variant="outline" className="w-full">
                    Voir l'historique
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Profil & Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-600">Évaluation</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {user.rating.average > 0 ? user.rating.average.toFixed(1) : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  {user.rating.count} évaluations
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Jobs complétés</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {user.stats.jobsCompleted}
                </p>
                <p className="text-sm text-gray-500">
                  {user.stats.jobsCancelled} annulés
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">Taux de ponctualité</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {user.stats.onTimeRate > 0 ? `${user.stats.onTimeRate}%` : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  Temps de réponse: {user.stats.averageResponseTime}min
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
