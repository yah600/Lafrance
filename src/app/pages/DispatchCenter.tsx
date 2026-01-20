import { Calendar, Plus, Sparkles, LayoutGrid, List, Inbox, ClipboardList, UserCheck, Truck, Wrench, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import CreateJobModal from '../components/modals/CreateJobModal';
import { useApp } from '../context/AppContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableJobCard } from '../components/kanban/DraggableJobCard';
import { DroppableColumn } from '../components/kanban/DroppableColumn';
import { toast } from 'sonner';

const statusColumns = [
  { id: 'pending', label: 'Nouveaux', color: 'bg-yellow-50', icon: <Inbox className="h-4 w-4" /> },
  { id: 'assigned', label: 'Assignés', color: 'bg-blue-50', icon: <UserCheck className="h-4 w-4" /> },
  { id: 'en-route', label: 'En route', color: 'bg-purple-50', icon: <Truck className="h-4 w-4" /> },
  { id: 'in-progress', label: 'En cours', color: 'bg-teal-50', icon: <Wrench className="h-4 w-4" /> },
  { id: 'completed', label: 'Complétés', color: 'bg-green-50', icon: <CheckCircle2 className="h-4 w-4" /> }
];

export default function DispatchCenter() {
  const { jobs, updateJob, technicians } = useApp();
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const jobsByStatus = statusColumns.map(col => ({
    ...col,
    jobs: jobs.filter(j => j.status === col.id)
  }));

  const handleJobDrop = (jobId: string, newStatus: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.status !== newStatus) {
      updateJob(jobId, { status: newStatus });
      toast.success(`Le travail ${job.client.name} a été déplacé à ${newStatus}`);
    }
  };

  const handleAutoDispatch = () => {
    const pendingJobs = jobs.filter(j => j.status === 'pending' && !j.technician);
    const availableTechs = technicians.filter(t => t.status === 'available');

    if (pendingJobs.length === 0) {
      toast.info('Aucun travail en attente à assigner');
      return;
    }

    if (availableTechs.length === 0) {
      toast.error('Aucun technicien disponible');
      return;
    }

    let assignedCount = 0;
    pendingJobs.forEach((job, index) => {
      const tech = availableTechs[index % availableTechs.length];
      updateJob(job.id, { 
        technician: tech,
        status: 'assigned' 
      });
      assignedCount++;
    });

    toast.success(`✨ ${assignedCount} travaux assignés automatiquement`, {
      description: `${availableTechs.length} techniciens disponibles utilisés`
    });
  };

  return (
    <div className="p-6 space-y-6">
      <CreateJobModal open={createJobOpen} onOpenChange={setCreateJobOpen} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centre de Dispatch</h1>
          <p className="text-gray-600 mt-1">Gérez et planifiez tous vos travaux</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="lg" variant="outline" onClick={() => setSelectedDate(new Date())}>
            <Calendar className="h-5 w-5 mr-2" />
            Aujourd'hui
          </Button>
          <Button size="lg" variant="outline" className="gap-2" onClick={handleAutoDispatch}>
            <Sparkles className="h-5 w-5" />
            Auto-dispatch
          </Button>
          <Button size="lg" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90" onClick={() => setCreateJobOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Nouveau travail
          </Button>
        </div>
      </div>

      {/* View Options */}
      <Tabs defaultValue="kanban" className="w-full">
        <TabsList>
          <TabsTrigger value="kanban" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            Liste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6">
          <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-5 gap-4">
              {jobsByStatus.map(column => (
                <DroppableColumn
                  key={column.id}
                  id={column.id}
                  label={column.label}
                  count={column.jobs.length}
                  color={column.color}
                  icon={column.icon}
                  onDrop={handleJobDrop}
                >
                  {column.jobs.map(job => (
                    <DraggableJobCard key={job.id} job={job} />
                  ))}
                </DroppableColumn>
              ))}
            </div>
          </DndProvider>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vue Calendrier</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                  <div key={day} className="bg-gray-100 p-3 text-center font-semibold text-sm">
                    {day}
                  </div>
                ))}
                {/* Days */}
                {Array.from({ length: 35 }, (_, i) => (
                  <div key={i} className="bg-white p-3 min-h-[120px]">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      {i + 1}
                    </div>
                    {i === 15 && jobs.length >= 6 && (
                      <div className="space-y-1">
                        <div className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1 truncate">
                          {jobs[0].client.name}
                        </div>
                        <div className="text-xs bg-green-100 text-green-800 rounded px-2 py-1 truncate">
                          {jobs[5].client.name}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Liste des travaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobs.map(job => (
                  <div 
                    key={job.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-1 h-12 rounded ${
                        job.priority === 'urgent' ? 'bg-red-500' :
                        job.priority === 'high' ? 'bg-orange-400' : 'bg-blue-400'
                      }`} />
                      <div>
                        <h4 className="font-semibold">{job.client.name}</h4>
                        <p className="text-sm text-muted-foreground">{job.client.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{job.serviceType}</Badge>
                      <span className="text-sm text-muted-foreground">{job.scheduledTime}</span>
                      {job.technician && (
                        <span className="text-sm font-medium">{job.technician.name}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}