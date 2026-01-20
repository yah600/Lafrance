import { MapPin, Star, Clock, Wrench, CheckCircle, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { useApp } from '../../context/AppContext';

export default function MobileHome() {
  const navigate = useNavigate();
  const { jobs, technicians } = useApp();
  
  const technician = technicians[0] || { name: 'Technicien', completedJobs: 0, todayJobs: 0, rating: 0 };
  const todayJobs = jobs.filter(j => j.technicianId === technician.id);
  const completion = technician.todayJobs > 0 ? (technician.completedJobs / technician.todayJobs) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" className="text-white">
            <Navigation className="h-6 w-6" />
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-white">
              <Bell className="h-6 w-6" />
            </Button>
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">Bonjour, Marc 👋</h1>
          <p className="text-blue-100">Mardi 16 décembre 2025</p>
        </div>

        {/* Status Toggle */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Statut</p>
              <p className="text-sm text-blue-100">
                {technician.status === 'available' ? 'Disponible' : 'Occupé'}
              </p>
            </div>
            <Switch 
              defaultChecked={technician.status === 'available'}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{technician.todayJobs}</p>
            <p className="text-xs text-blue-100">Aujourd'hui</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{technician.completedJobs}</p>
            <p className="text-xs text-blue-100">Complétés</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{technician.todayJobs - technician.completedJobs}</p>
            <p className="text-xs text-blue-100">À faire</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progression du jour</span>
            <span>{Math.round(completion)}%</span>
          </div>
          <Progress value={completion} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Today's Jobs */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Mes travaux aujourd'hui</h2>
          <Badge variant="secondary">{todayJobs.length}</Badge>
        </div>

        <div className="space-y-3">
          {todayJobs.map((job, index) => {
            const isNext = index === 0 && job.status !== 'completed';
            const statusConfig = {
              'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Planifié' },
              'assigned': { color: 'bg-blue-100 text-blue-800', label: 'Assigné' },
              'en-route': { color: 'bg-purple-100 text-purple-800', label: 'En route' },
              'in-progress': { color: 'bg-teal-100 text-teal-800', label: 'En cours' },
              'completed': { color: 'bg-green-100 text-green-800', label: 'Terminé' }
            };
            const status = statusConfig[job.status as keyof typeof statusConfig];

            return (
              <Card 
                key={job.id}
                className={`${isNext ? 'ring-2 ring-blue-500' : ''} ${job.status === 'completed' ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-4">
                  {isNext && (
                    <Badge className="bg-blue-500 text-white mb-3">PROCHAIN</Badge>
                  )}
                  
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{job.client.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>{job.scheduledTime} • {job.duration} min</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{job.client.address}</span>
                      </div>
                    </div>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {job.serviceType}
                    </Badge>
                    {job.priority === 'urgent' && (
                      <Badge variant="destructive" className="text-xs">⚡ Urgent</Badge>
                    )}
                  </div>

                  {job.status === 'assigned' || job.status === 'pending' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        Naviguer
                      </Button>
                      <Button size="sm" className="bg-[var(--primary)]">
                        Commencer
                      </Button>
                    </div>
                  ) : job.status === 'in-progress' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Temps écoulé</span>
                        <span className="font-semibold">23:45</span>
                      </div>
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Terminer
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Complété • {job.duration} min</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button className="flex flex-col items-center gap-1 p-3 text-blue-600">
            <Briefcase className="h-6 w-6" />
            <span className="text-xs font-medium">Travaux</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 text-gray-400">
            <MapPin className="h-6 w-6" />
            <span className="text-xs">Carte</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 text-gray-400">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs">Messages</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 text-gray-400">
            <User className="h-6 w-6" />
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Missing import
import { Briefcase } from 'lucide-react';