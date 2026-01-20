import { Calendar, Clock, MapPin, Phone, Mail, Star, Award, TrendingUp, Briefcase, CheckCircle, PlayCircle, Camera, FileText, AlertCircle, LogOut, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useAuth } from '../context/AuthContext';
import { StatusIndicator } from '../components/ui/status-indicator';
import { toast } from 'sonner';
import { useState } from 'react';
import JobDetailsModal from '../components/modals/JobDetailsModal';
import WeekCalendarModal from '../components/modals/WeekCalendarModal';
import { IncidentReport } from '../components/compliance/IncidentReport';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function TechnicianProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Marc Gagnon',
    phone: '+1 514-555-0100',
    email: user?.email || 'marc.gagnon@plomberiedexperts.com',
    specialization: 'Chauffe-eau et systèmes de chauffage',
    hourlyRate: 45,
  });

  // Today's jobs for the technician
  const [todaysJobs, setTodaysJobs] = useState([
    {
      id: '1',
      time: '08:00 - 10:00',
      client: 'Jean Dupont',
      phone: '+1 514-555-1001',
      address: '123 Rue Principale, Montréal',
      service: 'Débouchage',
      priority: 'normal',
      status: 'completed',
      description: 'Drain de cuisine bloqué',
    },
    {
      id: '2',
      time: '10:30 - 12:30',
      client: 'Marie Tremblay',
      phone: '+1 514-555-1002',
      address: '456 Avenue des Érables, Laval',
      service: 'Chauffe-eau',
      priority: 'high',
      status: 'in-progress',
      description: 'Chauffe-eau ne fonctionne plus',
    },
    {
      id: '3',
      time: '14:00 - 16:00',
      client: 'Pierre Gagnon',
      phone: '+1 514-555-1003',
      address: '789 Boulevard Saint-Laurent, Montréal',
      service: 'Robinetterie',
      priority: 'urgent',
      status: 'pending',
      description: 'Fuite importante sous l\'évier',
    },
  ]);

  const stats = {
    todayCompleted: todaysJobs.filter(j => j.status === 'completed').length,
    todayTotal: todaysJobs.length,
    weekRevenue: 3450,
    avgRating: 4.9,
    totalJobs: 1247,
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    toast.success('Déconnexion réussie');
  };

  const handleViewFullSchedule = () => {
    setCalendarOpen(true);
  };

  const handleStartJob = (jobId: string) => {
    const job = todaysJobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setJobDetailsOpen(true);
    }
  };

  const handleViewJobDetails = (jobId: string) => {
    const job = todaysJobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setJobDetailsOpen(true);
    }
  };

  const handleReviewJob = (jobId: string) => {
    const job = todaysJobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setJobDetailsOpen(true);
    }
  };

  const handleStatusChange = (jobId: string, newStatus: string) => {
    setTodaysJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
  };

  const handleCallClient = (phone: string) => {
    console.log('Calling client:', phone);
    window.location.href = `tel:${phone}`;
    toast.success('Appel du client...');
  };

  const handleNavigate = (address: string) => {
    console.log('Navigating to:', address);
    // Open in maps app
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    toast.success('Ouverture de la navigation...');
  };

  const handleViewWeekCalendar = () => {
    setCalendarOpen(true);
  };

  const handleViewHistory = (date: string) => {
    toast.info(`Affichage de l'historique pour ${date}`);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success('Profil mis à jour');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-[var(--primary)] text-white text-2xl">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
            {user?.role === 'technician' && (
              <p className="text-sm text-gray-500 mt-1">Technicien Plombier</p>
            )}
            <div className="text-gray-600 flex items-center gap-2 mt-1">
              <StatusIndicator status="available" label="Disponible" />
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {user?.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {user?.email}
              </span>
            </div>
          </div>
        </div>
        <Button onClick={handleViewFullSchedule}>
          <Calendar className="h-4 w-4 mr-2" />
          Voir mon horaire complet
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.todayCompleted}/{stats.todayTotal}
                </p>
                <p className="text-xs text-gray-500 mt-1">travaux</p>
              </div>
              <Briefcase className="h-10 w-10 text-[var(--primary)] opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus semaine</p>
                <p className="text-2xl font-bold text-gray-900">${stats.weekRevenue}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12%
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Évaluation</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating}/5</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(stats.avgRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <Star className="h-10 w-10 text-yellow-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total travaux</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                <p className="text-xs text-gray-500 mt-1">complétés</p>
              </div>
              <Award className="h-10 w-10 text-[var(--primary)] opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="today" className="w-full">
        <TabsList>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="week">Cette semaine</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="skills">Compétences</TabsTrigger>
        </TabsList>

        {/* Today Tab */}
        <TabsContent value="today" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Mes travaux du jour</h3>
            <Badge variant="outline">{todaysJobs.length} travaux</Badge>
          </div>

          {todaysJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="font-semibold">{job.time}</span>
                      <Badge
                        variant={
                          job.status === 'completed'
                            ? 'default'
                            : job.status === 'in-progress'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {job.status === 'completed'
                          ? 'Complété'
                          : job.status === 'in-progress'
                          ? 'En cours'
                          : 'À venir'}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-lg text-gray-900 mb-2">{job.client}</h4>

                    <div className="flex items-start gap-2 text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{job.address}</span>
                    </div>

                    <Badge variant="outline" className="mt-2">
                      {job.service}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-2">
                    {job.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartJob(job.id);
                        }}
                      >
                        Démarrer
                      </Button>
                    )}
                    {job.status === 'in-progress' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewJobDetails(job.id);
                        }}
                      >
                        Voir détails
                      </Button>
                    )}
                    {job.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReviewJob(job.id);
                        }}
                      >
                        Revoir
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCallClient(job.phone);
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(job.address);
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Navigation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Week Tab */}
        <TabsContent value="week" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Planning de la semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Vue du calendrier de la semaine complète avec tous vos rendez-vous.
              </p>
              <Button className="mt-4" onClick={handleViewWeekCalendar}>Voir le calendrier</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des travaux</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Consultez l'historique complet de vos {stats.totalJobs} travaux réalisés.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">15 déc. 2025</p>
                    <p className="text-sm text-gray-600">5 travaux complétés</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleViewHistory('15 déc. 2025')}>Voir</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">14 déc. 2025</p>
                    <p className="text-sm text-gray-600">4 travaux complétés</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleViewHistory('14 déc. 2025')}>Voir</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">13 déc. 2025</p>
                    <p className="text-sm text-gray-600">6 travaux complétés</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleViewHistory('13 déc. 2025')}>Voir</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Compétences & Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Spécialités</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Débouchage</Badge>
                    <Badge>Chauffe-eau</Badge>
                    <Badge>Robinetterie</Badge>
                    <Badge>Urgences</Badge>
                    <Badge>Installation</Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Certifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-[var(--primary)]" />
                      <span>Plombier certifié RBQ</span>
                      <Badge variant="outline">Valide</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-[var(--primary)]" />
                      <span>Formation gaz naturel</span>
                      <Badge variant="outline">Valide</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Formations récentes</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Nouveaux systèmes de chauffe-eau - Nov 2025</li>
                    <li>Techniques d'inspection caméra - Oct 2025</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Job Details Modal */}
      <JobDetailsModal
        open={jobDetailsOpen}
        onOpenChange={setJobDetailsOpen}
        job={selectedJob}
        onStatusChange={handleStatusChange}
      />

      {/* Week Calendar Modal */}
      <WeekCalendarModal
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
      />

      {/* Incident Report Modal */}
      <Dialog open={incidentOpen} onOpenChange={setIncidentOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Signaler un incident</DialogTitle>
          </DialogHeader>
          <IncidentReport
            reportedBy={user?.id || 'tech-1'}
            onSubmit={(report) => {
              toast.success('Incident signalé avec succès');
              setIncidentOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Floating Incident Button */}
      <button
        onClick={() => setIncidentOpen(true)}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
        aria-label="Signaler un incident"
      >
        <AlertCircle className="h-6 w-6" />
      </button>

      {/* Logout Button */}
      <Button className="mt-6" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Se déconnecter
      </Button>
    </div>
  );
}