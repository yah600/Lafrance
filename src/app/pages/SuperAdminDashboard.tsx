/**
 * Super Admin Multi-Division Dashboard
 * Implements update.md Section 3.5 - Super Admin Dashboard
 * Shows consolidated view of all 8 divisions
 */

import { useState } from 'react';
import { Building2, DollarSign, Briefcase, Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useApp } from '../context/AppContext';
import { DIVISIONS } from '../data/divisions';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SuperAdminDashboard() {
  const { jobs, technicians, invoices } = useApp();
  const { setActiveDivision } = useAuth();
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<'overview' | 'financial' | 'operational'>('overview');

  // Calculate division-specific metrics
  const getDivisionMetrics = (divisionId: string) => {
    const divJobs = jobs.filter(j => j.division === divisionId);
    const divTechs = technicians.filter(t => t.division === divisionId);
    const divInvoices = invoices.filter(i => i.division === divisionId);
    
    const activeJobs = divJobs.filter(j => j.status === 'in-progress' || j.status === 'en-route');
    const completedToday = divJobs.filter(j => j.status === 'completed');
    const revenue = divInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const activeTechs = divTechs.filter(t => t.status !== 'off-duty');
    const utilization = divTechs.length > 0 ? Math.round((activeTechs.length / divTechs.length) * 100) : 0;
    
    // Check for issues
    const issues = [];
    if (utilization < 50) issues.push('Low utilization');
    if (activeJobs.length > divTechs.length * 2) issues.push('Overload');
    
    return {
      totalJobs: divJobs.length,
      activeJobs: activeJobs.length,
      completedToday: completedToday.length,
      revenue,
      technicians: divTechs.length,
      activeTechs: activeTechs.length,
      utilization,
      issues,
    };
  };

  // Get division color
  const getDivisionColor = (divisionId: string) => {
    const colors: Record<string, string> = {
      'plomberie': '#2B5A8E',
      'construction': '#1C3D5A',
      'toitures': '#8B4513',
      'isolation': '#FF8C00',
      'conteneurs': '#4A7C59',
      'gutters': '#708090',
      'decks': '#8B7355',
      'real-estate': '#DAA520',
    };
    return colors[divisionId] || '#2B5A8E';
  };

  const handleDivisionClick = (divisionId: any) => {
    setActiveDivision(divisionId);
    navigate('/');
  };

  // Calculate totals
  const totalJobs = jobs.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalTechnicians = technicians.length;
  const activeJobs = jobs.filter(j => j.status === 'in-progress' || j.status === 'en-route').length;
  const avgSatisfaction = 4.8;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vue Multi-Divisions</h1>
        <p className="text-gray-600">Tableau de bord consolidé - Groupe G. Lafrance</p>
      </div>

      {/* Top KPI Cards - As per update.md Section 3.5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus aujourd'hui</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↑ 18%</span> vs hier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cible mensuelle</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">▲ En bonne voie</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Travaux actifs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              Sur {totalJobs} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSatisfaction}/5.0 ⭐</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↑ 0.2</span> vs mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={selectedView} onValueChange={(v: any) => setSelectedView(v)}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="financial">Financier</TabsTrigger>
          <TabsTrigger value="operational">Opérationnel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Division Performance Matrix - As per update.md Section 3.5 */}
          <Card>
            <CardHeader>
              <CardTitle>Matrice de performance par division</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Division</th>
                      <th className="text-right p-3 font-semibold">Travaux</th>
                      <th className="text-right p-3 font-semibold">Revenus</th>
                      <th className="text-right p-3 font-semibold">Utilisation</th>
                      <th className="text-right p-3 font-semibold">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DIVISIONS.filter(d => d.active).map((division) => {
                      const metrics = getDivisionMetrics(division.id);
                      const color = getDivisionColor(division.id);
                      
                      return (
                        <tr 
                          key={division.id} 
                          className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleDivisionClick(division.id)}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: color }}
                              />
                              <span className="font-medium">{division.nameFr}</span>
                            </div>
                          </td>
                          <td className="text-right p-3">
                            <div>
                              <div className="font-semibold">{metrics.activeJobs}</div>
                              <div className="text-xs text-gray-500">actifs</div>
                            </div>
                          </td>
                          <td className="text-right p-3">
                            <div className="font-semibold">
                              ${metrics.revenue.toLocaleString()}
                            </div>
                          </td>
                          <td className="text-right p-3">
                            <div className="flex items-center justify-end gap-2">
                              <div className="text-sm">{metrics.utilization}%</div>
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all"
                                  style={{ 
                                    width: `${metrics.utilization}%`,
                                    backgroundColor: metrics.utilization > 70 ? '#22c55e' : metrics.utilization > 50 ? '#eab308' : '#ef4444'
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="text-right p-3">
                            {metrics.issues.length > 0 ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                🟡 {metrics.issues[0]}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                ✅ Bon
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Division Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DIVISIONS.filter(d => d.active).map((division) => {
              const metrics = getDivisionMetrics(division.id);
              const color = getDivisionColor(division.id);
              
              return (
                <Card 
                  key={division.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleDivisionClick(division.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: color }}
                        />
                        <CardTitle className="text-base">{division.nameFr.split(' ').slice(-1)}</CardTitle>
                      </div>
                      <Building2 className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Travaux actifs</span>
                      <span className="font-semibold">{metrics.activeJobs}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenus</span>
                      <span className="font-semibold">${metrics.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Techniciens</span>
                      <span className="font-semibold">{metrics.activeTechs}/{metrics.technicians}</span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Utilisation</span>
                        <span className="font-medium">{metrics.utilization}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${metrics.utilization}%`,
                            backgroundColor: color
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenus par division</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DIVISIONS.filter(d => d.active).map((division) => {
                  const metrics = getDivisionMetrics(division.id);
                  const color = getDivisionColor(division.id);
                  const percentage = totalRevenue > 0 ? (metrics.revenue / totalRevenue) * 100 : 0;
                  
                  return (
                    <div key={division.id}>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-sm font-medium">{division.nameFr}</span>
                        </div>
                        <span className="text-sm font-semibold">
                          ${metrics.revenue.toLocaleString()} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Techniciens par division</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {DIVISIONS.filter(d => d.active).map((division) => {
                    const metrics = getDivisionMetrics(division.id);
                    const color = getDivisionColor(division.id);
                    
                    return (
                      <div key={division.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-sm">{division.nameFr.split(' ').slice(-1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{metrics.technicians}</span>
                          <span className="text-xs text-gray-500">({metrics.activeTechs} actifs)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes et problèmes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {DIVISIONS.filter(d => d.active).map((division) => {
                    const metrics = getDivisionMetrics(division.id);
                    if (metrics.issues.length === 0) return null;
                    
                    return (
                      <div key={division.id} className="flex items-start gap-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-yellow-900">{division.nameFr}</div>
                          <div className="text-xs text-yellow-700">{metrics.issues.join(', ')}</div>
                        </div>
                      </div>
                    );
                  })}
                  {DIVISIONS.filter(d => d.active).every(d => getDivisionMetrics(d.id).issues.length === 0) && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded border border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">Aucun problème détecté</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
