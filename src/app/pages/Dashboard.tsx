import { Briefcase, Users, DollarSign, Star, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import StatCard from '../components/dashboard/StatCard';
import JobCard from '../components/dashboard/JobCard';
import CreateJobModal from '../components/modals/CreateJobModal';
import AIAssistant from '../components/ai/AIAssistant';
import { WeatherWidget } from '../components/dashboard/WeatherWidget';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { IncidentDashboard } from '../components/compliance/IncidentReport';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

export default function Dashboard() {
  const navigate = useNavigate();
  const { divisionJobs, divisionTechnicians } = useApp(); // Use division-filtered data
  const { user, activeDivision } = useAuth();
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [mapZoom, setMapZoom] = useState(12);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  // Use division-filtered data
  const jobs = divisionJobs;
  const technicians = divisionTechnicians;
  
  const activeJobs = jobs.filter(j => j.status === 'in-progress' || j.status === 'en-route');
  const upcomingJobs = jobs.filter(j => j.status === 'assigned' || j.status === 'pending');
  const completedToday = jobs.filter(j => j.status === 'completed');
  const activeTechs = technicians.filter(t => t.status !== 'off-duty');

  // Mock incident reports data
  const mockIncidentReports = [
    {
      id: 'inc-001',
      reportedBy: 'tech-1',
      reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      jobId: 'job-123',
      incidentType: 'injury' as const,
      severity: 'low' as const,
      description: 'Technicien s\'est coupé légèrement au doigt avec un outil',
      location: '456 Rue Saint-Denis, Montréal',
      witnesses: ['Client présent'],
      immediateActions: 'Premiers soins appliqués, pansement mis en place',
      photos: [],
      status: 'reported' as const,
    },
    {
      id: 'inc-002',
      reportedBy: 'tech-2',
      reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      jobId: 'job-456',
      incidentType: 'property-damage' as const,
      severity: 'medium' as const,
      description: 'Fuite d\'eau mineure causée lors de l\'installation',
      location: '789 Avenue du Parc, Laval',
      witnesses: [],
      immediateActions: 'Fuite arrêtée immédiatement, zone séchée',
      photos: [],
      status: 'under-review' as const,
    }
  ];

  // Calculate today's revenue
  const todayRevenue = completedToday.reduce((sum, job) => sum + (job.amount || 0), 0) + 
                       activeJobs.reduce((sum, job) => sum + (job.amount || 0), 0);

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 8));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 pb-20 lg:pb-6">
      <CreateJobModal open={createJobOpen} onOpenChange={setCreateJobOpen} />
      <AIAssistant open={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bonjour, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Mercredi 17 décembre 2025
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <WeatherWidget />
          {user?.permissions?.canCreateJobs && (
            <Button 
              size={isMobile ? "default" : "lg"} 
              className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 flex-1 sm:flex-none min-h-[44px]" 
              onClick={() => setCreateJobOpen(true)}
            >
              <Plus className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Nouveau travail</span>
            </Button>
          )}
          <Button 
            size={isMobile ? "default" : "lg"} 
            variant="outline" 
            className="gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 hidden sm:flex min-h-[44px]" 
            onClick={() => setAiAssistantOpen(true)}
          >
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="hidden lg:inline">Assistant IA</span>
          </Button>
        </div>
      </div>

      {/* AI Assistant Floating Button */}
      <button
        onClick={() => setAiAssistantOpen(true)}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
        aria-label="Assistant IA"
      >
        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Travaux aujourd'hui"
          value={jobs.length}
          icon={Briefcase}
          trend={{ value: '+12% vs last week', isPositive: true }}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Techniciens actifs"
          value={`${activeTechs.length}/${technicians.length}`}
          icon={Users}
          trend={{ value: '2 en pause', isPositive: false }}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Revenus du jour"
          value={`$${todayRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: '+8%', isPositive: true }}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-100"
        />
        <StatCard
          title="Satisfaction client"
          value="4.8/5"
          icon={Star}
          trend={{ value: '+0.2 pts', isPositive: true }}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map - Left side (2/3) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Carte en temps réel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden h-[500px] flex items-center justify-center">
              {/* Simple map placeholder with markers */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100">
                {/* Montreal streets simulation */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-300 opacity-50" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 opacity-50" />
                  <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-gray-300 opacity-50" />
                  <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-300 opacity-50" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 opacity-50" />
                  <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-gray-300 opacity-50" />
                </div>

                {/* Technician markers */}
                {technicians.filter(t => t.status !== 'off-duty').slice(0, 4).map((tech, index) => (
                  <div
                    key={tech.id}
                    className="absolute w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-xs font-semibold text-white cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: tech.status === 'available' ? '#28A745' : tech.status === 'busy' ? '#E67E22' : '#2E86AB',
                      left: `${25 + index * 20}%`,
                      top: `${30 + index * 15}%`
                    }}
                  >
                    {tech.name.split(' ').map(n => n[0]).join('')}
                  </div>
                ))}

                {/* Job location markers */}
                {activeJobs.slice(0, 3).map((job, index) => (
                  <div
                    key={job.id}
                    className="absolute w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      left: `${40 + index * 15}%`,
                      top: `${40 + index * 10}%`
                    }}
                  >
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                ))}
              </div>

              {/* Map controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <Button size="sm" variant="secondary" className="shadow-md" onClick={handleZoomIn}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="shadow-md" onClick={handleZoomOut}>
                  −
                </Button>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span>Occupé</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Travail urgent</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Feed - Right side (1/3) */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Activité du jour</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">En cours</TabsTrigger>
                <TabsTrigger value="upcoming">À venir</TabsTrigger>
                <TabsTrigger value="completed">Terminés</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
                {activeJobs.length > 0 ? (
                  activeJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">Aucun travail en cours</p>
                )}
              </TabsContent>
              
              <TabsContent value="upcoming" className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
                {upcomingJobs.length > 0 ? (
                  upcomingJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">Aucun travail à venir</p>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
                {completedToday.length > 0 ? (
                  completedToday.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">Aucun travail terminé</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline />
        </CardContent>
      </Card>

      {/* Incident Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports d'incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <IncidentDashboard reports={mockIncidentReports} />
        </CardContent>
      </Card>
    </div>
  );
}