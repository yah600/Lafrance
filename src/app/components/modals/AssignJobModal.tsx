import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../context/AppContext';

interface AssignJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technicianId: string;
  technicianName: string;
}

export function AssignJobModal({ open, onOpenChange, technicianId, technicianName }: AssignJobModalProps) {
  const { jobs } = useApp();
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Get unassigned or pending jobs
  const availableJobs = jobs.filter(j => j.status === 'pending' || !j.technicianId);

  const handleAssign = () => {
    if (!selectedJob || !date || !time) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    // Simulate API call
    toast.success(`Travail assigné à ${technicianName} avec succès!`);
    onOpenChange(false);
    
    // Reset form
    setSelectedJob('');
    setDate('');
    setTime('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assigner un travail</DialogTitle>
          <DialogDescription>
            Assigner un nouveau travail à {technicianName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Job Selection */}
          <div className="space-y-2">
            <Label htmlFor="job">Travail</Label>
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger id="job">
                <SelectValue placeholder="Sélectionner un travail" />
              </SelectTrigger>
              <SelectContent>
                {availableJobs.length === 0 ? (
                  <SelectItem value="none" disabled>Aucun travail disponible</SelectItem>
                ) : (
                  availableJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.client.name} - {job.serviceType}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Heure</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Sélectionner une heure" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 8).map((hour) => (
                  <SelectItem key={hour} value={`${hour}:00`}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {hour}:00
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes internes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Ajoutez des notes pour le technicien..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleAssign} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
            Assigner le travail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
