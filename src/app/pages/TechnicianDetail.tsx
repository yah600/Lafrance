import { ArrowLeft, Phone, MessageSquare, Mail, MapPin, Star, Calendar, TrendingUp, Award } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { AssignJobModal } from '../components/modals/AssignJobModal';
import { SendEmailModal } from '../components/modals/SendEmailModal';
import ChatModal from '../components/ChatModal';
import { toast } from 'sonner';
import { LicenseManagement } from '../components/compliance/LicenseManagement';
import { EducationTracking } from '../components/compliance/EducationTracking';

const performanceData = [
  { week: 'Sem 1', jobs: 12, rating: 4.8 },
  { week: 'Sem 2', jobs: 15, rating: 4.9 },
  { week: 'Sem 3', jobs: 14, rating: 4.7 },
  { week: 'Sem 4', jobs: 16, rating: 5.0 }
];

const scheduleData = [
  { day: 'Lun', hours: 8 },
  { day: 'Mar', hours: 9 },
  { day: 'Mer', hours: 8 },
  { day: 'Jeu', hours: 10 },
  { day: 'Ven', hours: 8 },
  { day: 'Sam', hours: 4 },
  { day: 'Dim', hours: 0 }
];

export default function TechnicianDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assignJobOpen, setAssignJobOpen] = useState(false);
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  const { technicians, jobs } = useApp();
  const technician = technicians.find(t => t.id === id) || technicians[0];
  const techJobs = jobs.filter(j => j.technicianId === id);
  const completion = (technician.completedJobs / technician.todayJobs) * 100 || 0;

  const statusConfig = {
    available: { label: 'Disponible', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
    busy: { label: 'Occupé', color: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
    'en-route': { label: 'En route', color: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
    'off-duty': { label: 'Hors service', color: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' }
  };

  const status = statusConfig[technician.status];

  const handleCallTechnician = () => {
    window.location.href = `tel:${technician.phone}`;
    toast.success(`Appel de ${technician.name}...`);
  };

  const handleSendMessage = () => {
    toast.success('Fonctionnalité de messagerie bientôt disponible');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Modals */}
      <AssignJobModal 
        open={assignJobOpen} 
        onOpenChange={setAssignJobOpen}
        technicianId={technician.id}
        technicianName={technician.name}
      />
      <SendEmailModal 
        open={sendEmailOpen} 
        onOpenChange={setSendEmailOpen}
        recipientEmail={technician.email}
        recipientName={technician.name}
      />
      <ChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        clientName={technician.name}
        clientEmail={technician.email}
        clientPhone={technician.phone}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/technicians')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Profil Technicien</h1>
        </div>
        <Button variant="outline" size="lg" onClick={() => setSendEmailOpen(true)}>
          <Mail className="h-5 w-5 mr-2" />
          Envoyer un email
        </Button>
        <Button size="lg" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90" onClick={() => setAssignJobOpen(true)}>
          Assigner un travail
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-3xl bg-blue-100 text-blue-700">
                  {technician.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${status.dot}`} />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{technician.name}</h2>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                    <span className="text-3xl font-bold">{technician.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Note moyenne</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <button 
                      onClick={handleCallTechnician}
                      className="font-medium hover:underline text-left"
                    >
                      {technician.phone}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <button 
                      onClick={() => setSendEmailOpen(true)}
                      className="font-medium hover:underline text-left"
                    >
                      {technician.email}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Message</p>
                    <button 
                      onClick={() => setChatOpen(true)}
                      className="font-medium hover:underline text-left"
                    >
                      Envoyer un message
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{technician.completedJobs}/{technician.todayJobs}</p>
                  <p className="text-sm text-muted-foreground">Travaux aujourd'hui</p>
                  <Progress value={completion} className="mt-2" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">1,247</p>
                  <p className="text-sm text-muted-foreground">Travaux complétés</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">98.5%</p>
                  <p className="text-sm text-muted-foreground">Taux de complétion</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="schedule">Horaire</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
          <TabsTrigger value="conformite">Conformité</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Compétences & Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Spécialisations</p>
                  <div className="flex flex-wrap gap-2">
                    {technician.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Certifications</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span>Maître Plombier (RBQ)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-green-600" />
                      <span>Formation Gaz Naturel</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-purple-600" />
                      <span>Systèmes Géothermiques</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Localisation actuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <p className="font-medium">{technician.location.address}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Dernière mise à jour: Il y a 2 minutes
                      </p>
                    </div>
                  </div>
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600 border-4 border-white shadow-lg flex items-center justify-center text-white font-semibold">
                      {technician.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance (4 dernières semaines)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="jobs" stroke="#0B5394" strokeWidth={2} name="Travaux" />
                  <Line yAxisId="right" type="monotone" dataKey="rating" stroke="#E67E22" strokeWidth={2} name="Note" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Current Job */}
          {technician.currentJob && (
            <Card>
              <CardHeader>
                <CardTitle>Travail en cours</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const job = techJobs.find(j => j.id === technician.currentJob);
                  return job ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg">{job.client.name}</h4>
                        <Badge className="bg-teal-100 text-teal-800">En cours</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Type de service</p>
                          <p className="font-medium">{job.serviceType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Heure de début</p>
                          <p className="font-medium">{job.scheduledTime}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Adresse</p>
                          <p className="font-medium">{job.client.address}</p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Horaire de la semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scheduleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#0B5394" name="Heures travaillées" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disponibilité hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, index) => (
                  <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{day}</span>
                    <span className="text-sm text-muted-foreground">
                      {index < 5 ? '8:00 - 17:00' : index === 5 ? '8:00 - 12:00' : 'Fermé'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des travaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {techJobs.slice(0, 10).map(job => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h4 className="font-semibold">{job.client.name}</h4>
                      <p className="text-sm text-muted-foreground">{job.serviceType}</p>
                      <p className="text-xs text-muted-foreground mt-1">{job.scheduledDate}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {job.status}
                      </Badge>
                      {job.amount && (
                        <p className="text-sm font-semibold mt-1">${job.amount}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Avis clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { name: 'Jean Dupont', rating: 5, comment: 'Excellent service! Très professionnel et rapide.', date: '2025-12-15' },
                  { name: 'Marie Bergeron', rating: 5, comment: 'Travail impeccable, je recommande fortement.', date: '2025-12-10' },
                  { name: 'Pierre Lavoie', rating: 4, comment: 'Bon travail, quelques retards mais résultat satisfaisant.', date: '2025-12-05' }
                ].map((review, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conformité Tab */}
        <TabsContent value="conformite" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des licences</CardTitle>
            </CardHeader>
            <CardContent>
              <LicenseManagement technicianId={technician.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suivi de la formation</CardTitle>
            </CardHeader>
            <CardContent>
              <EducationTracking technicianId={technician.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}