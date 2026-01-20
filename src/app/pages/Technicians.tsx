import { Plus, Phone, MessageSquare, MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { mockTechnicians } from '../data/mockData';
import { toast } from 'sonner';
import ChatModal from '../components/ChatModal';
import CreateTechnicianModal from '../components/modals/CreateTechnicianModal';

const statusConfig = {
  available: { label: 'Disponible', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  busy: { label: 'Occupé', color: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
  'en-route': { label: 'En route', color: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
  'off-duty': { label: 'Hors service', color: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' }
};

export default function Technicians() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [createTechnicianOpen, setCreateTechnicianOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<typeof mockTechnicians[0] | null>(null);

  const handleCall = (phone: string, techName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
    toast.success(`Appel vers ${techName}`);
  };

  const handleMessage = (tech: typeof mockTechnicians[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTechnician(tech);
    setChatOpen(true);
  };
  
  return (
    <div className="p-6 space-y-6">
      <ChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        clientName={selectedTechnician?.name || ''}
        clientPhone={selectedTechnician?.phone}
      />
      <CreateTechnicianModal
        open={createTechnicianOpen}
        onOpenChange={setCreateTechnicianOpen}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Techniciens</h1>
          <p className="text-gray-600 mt-1">{mockTechnicians.length} techniciens au total</p>
        </div>
        <Button size="lg" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90" onClick={() => setCreateTechnicianOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Ajouter technicien
        </Button>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTechnicians.map(tech => {
          const status = statusConfig[tech.status];
          const completion = (tech.completedJobs / tech.todayJobs) * 100 || 0;
          
          return (
            <Card key={tech.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/technicians/${tech.id}`)}>
              <CardContent className="p-6">
                {/* Avatar and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                          {tech.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${status.dot}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{tech.name}</h3>
                      <a href={`tel:${tech.phone}`} className="text-sm text-muted-foreground hover:underline">
                        {tech.phone}
                      </a>
                    </div>
                  </div>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-2xl font-bold">{tech.completedJobs}/{tech.todayJobs}</p>
                    <p className="text-sm text-muted-foreground">Travaux aujourd'hui</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <p className="text-2xl font-bold">{tech.rating}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Note moyenne</p>
                  </div>
                </div>

                {/* Progress */}
                {tech.todayJobs > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-medium">{Math.round(completion)}%</span>
                    </div>
                    <Progress value={completion} className="h-2" />
                  </div>
                )}

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Compétences</p>
                  <div className="flex flex-wrap gap-2">
                    {tech.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Location */}
                {tech.status !== 'off-duty' && (
                  <div className="mb-4 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground line-clamp-2">{tech.location.address}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm" onClick={(e) => handleCall(tech.phone, tech.name, e)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm" onClick={(e) => handleMessage(tech, e)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}