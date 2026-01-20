/**
 * Multi-Division Dashboard
 * Overview of all 7 Lacoste Group divisions with cross-referral tracking
 * 
 * Key Metrics:
 * - Revenue per division
 * - Cross-referral opportunities
 * - Active jobs across all trades
 * - Storm response alerts
 */

import { useState } from 'react';
import { DivisionSwitcher } from '../components/divisions/DivisionSwitcher';
import { CrossReferralCapture } from '../components/cross-referral/CrossReferralCapture';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  DollarSign, 
  ArrowRight,
  Target,
  Zap,
  CloudRain,
  Trophy,
  Plus
} from 'lucide-react';
import type { DivisionType } from '../types/lacoste-platform';
import { DIVISIONS } from '../data/divisions';
import { toast } from 'sonner';

export default function MultiDivisionDashboard() {
  const [activeDivision, setActiveDivision] = useState<DivisionType>('plomberie');
  const [crossReferralOpen, setCrossReferralOpen] = useState(false);

  // Mock data (in production, this would come from API)
  const divisionStats = {
    plomberie: { revenue: 156780, jobs: 234, growth: 18.5, active: 12 },
    toitures: { revenue: 89340, jobs: 67, growth: 24.2, active: 8 },
    isolation: { revenue: 67200, jobs: 45, growth: 31.8, active: 5 },
    conteneurs: { revenue: 45600, jobs: 156, growth: 12.3, active: 23 },
    gutters: { revenue: 34200, jobs: 89, growth: 15.7, active: 6 },
    decks: { revenue: 78900, jobs: 34, growth: 22.1, active: 7 },
    'real-estate': { revenue: 125000, jobs: 8, growth: 45.6, active: 3 }
  };

  const crossReferrals = {
    captured: 42,
    contacted: 28,
    quoted: 18,
    won: 12,
    revenue: 89400,
    avgScore: 67
  };

  const totalRevenue = Object.values(divisionStats).reduce((sum, stat) => sum + stat.revenue, 0);
  const totalJobs = Object.values(divisionStats).reduce((sum, stat) => sum + stat.jobs, 0);

  const handleTestCrossReferral = () => {
    setCrossReferralOpen(true);
  };

  const handleStormAlert = () => {
    toast.info('🌧️ Alerte météo activée', {
      description: 'Tempête détectée dans H1-H4. 127 propriétés seront contactées dans 48h.',
      duration: 5000
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord multi-divisions</h1>
          <p className="text-gray-500 mt-1">
            Vue d'ensemble de toutes les divisions du Groupe Lacoste
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleStormAlert} variant="outline">
            <CloudRain className="w-4 h-4 mr-2" />
            Alerte tempête
          </Button>
          <Button onClick={handleTestCrossReferral} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle opportunité
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600">+23.4%</span> vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emplois actifs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              Répartis sur 7 divisions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunités inter-divisions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crossReferrals.captured}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-blue-600">{crossReferrals.won} converties</span> (28.6%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu cross-sell</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(crossReferrals.revenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-green-600">Score ML moyen: {crossReferrals.avgScore}/100</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Division Switcher */}
      <DivisionSwitcher 
        activeDivision={activeDivision}
        onDivisionChange={setActiveDivision}
      />

      {/* Active Division Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Performance - {DIVISIONS.find(d => d.id === activeDivision)?.nameFr}
              <Badge variant={divisionStats[activeDivision].growth > 20 ? 'default' : 'secondary'}>
                {divisionStats[activeDivision].growth > 20 ? '🔥 En feu!' : 'Actif'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Statistiques du mois en cours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Revenu</span>
                <span className="text-lg font-bold">${(divisionStats[activeDivision].revenue / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {divisionStats[activeDivision].growth > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={divisionStats[activeDivision].growth > 0 ? 'text-green-600' : 'text-red-600'}>
                  {divisionStats[activeDivision].growth > 0 ? '+' : ''}{divisionStats[activeDivision].growth}%
                </span>
                <span className="text-gray-500">vs mois dernier</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Emplois complétés</span>
                <span className="text-lg font-bold">{divisionStats[activeDivision].jobs}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Emplois actifs</span>
                <span className="text-lg font-bold text-blue-600">{divisionStats[activeDivision].active}</span>
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <ArrowRight className="w-4 h-4 mr-2" />
              Voir le tableau de bord complet
            </Button>
          </CardContent>
        </Card>

        {/* Cross-Referral Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Pipeline inter-divisions
            </CardTitle>
            <CardDescription>
              Opportunités capturées ce mois
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm font-medium">Capturées</div>
                <div className="text-xs text-gray-600">Par les techniciens</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{crossReferrals.captured}</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="text-sm font-medium">Contactées</div>
                <div className="text-xs text-gray-600">Client contacté</div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{crossReferrals.contacted}</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <div className="text-sm font-medium">Soumises</div>
                <div className="text-xs text-gray-600">Devis envoyé</div>
              </div>
              <div className="text-2xl font-bold text-orange-600">{crossReferrals.quoted}</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="text-sm font-medium">Gagnées 🎉</div>
                <div className="text-xs text-gray-600">Contrat signé</div>
              </div>
              <div className="text-2xl font-bold text-green-600">{crossReferrals.won}</div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Taux de conversion</span>
                <span className="font-bold text-green-600">
                  {((crossReferrals.won / crossReferrals.captured) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Top Techniciens - Cross-Sell
            </CardTitle>
            <CardDescription>
              Classement des opportunités capturées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Jean Tremblay', opportunities: 8, revenue: 24500, division: 'Plomberie' },
              { name: 'Marc Dubois', opportunities: 6, revenue: 18900, division: 'Toitures' },
              { name: 'Pierre Lavoie', opportunities: 5, revenue: 15200, division: 'Isolation' },
              { name: 'Luc Martin', opportunities: 4, revenue: 12800, division: 'Gutters' },
              { name: 'André Côté', opportunities: 3, revenue: 9400, division: 'Decks' }
            ].map((tech, index) => (
              <div key={tech.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                    index === 1 ? 'bg-gray-200 text-gray-700' : 
                    index === 2 ? 'bg-orange-100 text-orange-700' : 
                    'bg-blue-50 text-blue-700'}
                `}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{tech.name}</div>
                  <div className="text-xs text-gray-500">{tech.division}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{tech.opportunities}</div>
                  <div className="text-xs text-gray-500">${(tech.revenue / 1000).toFixed(1)}K</div>
                </div>
              </div>
            ))}

            <Button className="w-full mt-4" variant="outline" size="sm">
              Voir le classement complet
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Cross-Referral Modal */}
      <CrossReferralCapture
        open={crossReferralOpen}
        onOpenChange={setCrossReferralOpen}
        currentJobId="job-123"
        propertyId="prop-456"
        technicianId="tech-789"
        technicianName="Jean Tremblay"
        originDivision={activeDivision}
      />
    </div>
  );
}
