import { X, ChevronLeft, ChevronRight, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { useState } from 'react';
import { toast } from 'sonner';

interface WeekCalendarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WeekCalendarModal({ open, onOpenChange }: WeekCalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!open) return null;

  // Mock weekly schedule data
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const weekSchedule = {
    'Lun': [
      { time: '08:00-10:00', client: 'Jean Dupont', service: 'Débouchage', address: '123 Rue Principale' },
      { time: '10:30-12:00', client: 'Marie Tremblay', service: 'Chauffe-eau', address: '456 Ave des Érables' },
    ],
    'Mar': [
      { time: '09:00-11:00', client: 'Pierre Gagnon', service: 'Robinetterie', address: '789 Blvd St-Laurent' },
      { time: '14:00-16:00', client: 'Sophie Martin', service: 'Installation', address: '321 Rue Sherbrooke' },
    ],
    'Mer': [
      { time: '08:30-10:30', client: 'Luc Bouchard', service: 'Urgence', address: '654 Ave du Parc' },
    ],
    'Jeu': [
      { time: '10:00-12:00', client: 'Anne Lavoie', service: 'Inspection', address: '987 Rue Ste-Catherine' },
      { time: '14:00-15:30', client: 'Michel Roy', service: 'Réparation', address: '147 Blvd René-Lévesque' },
    ],
    'Ven': [
      { time: '08:00-09:30', client: 'Claire Dubois', service: 'Débouchage', address: '258 Rue Notre-Dame' },
      { time: '11:00-13:00', client: 'Robert Côté', service: 'Chauffe-eau', address: '369 Ave McGill' },
      { time: '15:00-17:00', client: 'Isabelle Forget', service: 'Installation', address: '741 Rue St-Denis' },
    ],
    'Sam': [
      { time: '09:00-11:00', client: 'Marc Leblanc', service: 'Urgence', address: '852 Ave Papineau' },
    ],
    'Dim': [],
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleJobClick = (job: any) => {
    toast.info(`${job.client} - ${job.service}`);
  };

  const getWeekRange = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Sunday
    
    const formatDate = (date: Date) => {
      return `${date.getDate()} ${date.toLocaleDateString('fr-FR', { month: 'short' })}`;
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mon calendrier hebdomadaire</h2>
            <p className="text-gray-600 mt-1">{getWeekRange()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevWeek}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Aujourd'hui
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextWeek}>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, idx) => {
              const jobs = weekSchedule[day as keyof typeof weekSchedule] || [];
              const isToday = idx === 0; // Mock: Monday is today
              const isWeekend = idx >= 5;

              return (
                <div key={day} className="space-y-2">
                  {/* Day Header */}
                  <div className={`text-center p-3 rounded-lg ${
                    isToday 
                      ? 'bg-[var(--primary)] text-white' 
                      : isWeekend 
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-gray-50'
                  }`}>
                    <div className="font-semibold">{day}</div>
                    <div className="text-sm">
                      {17 + idx} déc
                    </div>
                  </div>

                  {/* Jobs for the day */}
                  <div className="space-y-2">
                    {jobs.length > 0 ? (
                      jobs.map((job, jobIdx) => (
                        <Card 
                          key={jobIdx}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleJobClick(job)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs font-medium">{job.time}</span>
                            </div>
                            <p className="font-semibold text-sm mb-1">{job.client}</p>
                            <Badge variant="outline" className="text-xs">
                              {job.service}
                            </Badge>
                            <div className="flex items-start gap-1 mt-2">
                              <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-gray-600 line-clamp-2">{job.address}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center text-sm text-gray-400 py-4">
                        {isWeekend ? 'Repos' : 'Aucun travail'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-sm text-gray-600">Travaux cette semaine</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">32h</p>
                <p className="text-sm text-gray-600">Heures planifiées</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">$4,250</p>
                <p className="text-sm text-gray-600">Revenus prévus</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
