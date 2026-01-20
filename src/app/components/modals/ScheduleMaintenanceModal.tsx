import { useState } from 'react';
import { X, Calendar, Wrench } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { useApp } from '../../context/AppContext';

interface ScheduleMaintenanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipmentId?: string;
  equipmentName?: string;
  clientId?: string;
  clientName?: string;
}

export default function ScheduleMaintenanceModal({ 
  open, 
  onOpenChange,
  equipmentId,
  equipmentName,
  clientId,
  clientName
}: ScheduleMaintenanceModalProps) {
  const { addJob, technicians } = useApp();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    technicianId: '',
    priority: 'medium',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || !formData.technicianId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const selectedTech = technicians.find(t => t.id === formData.technicianId);

    const newJob = {
      title: `Entretien - ${equipmentName}`,
      description: `Entretien préventif de l'équipement: ${equipmentName}\n\n${formData.notes}`,
      status: 'assigned' as const,
      priority: formData.priority as 'low' | 'medium' | 'high' | 'urgent',
      scheduledDate: formData.date,
      scheduledTime: formData.time,
      technicianId: formData.technicianId,
      technicianName: selectedTech?.name || '',
      client: {
        id: clientId || '',
        name: clientName || '',
        phone: '',
        address: ''
      },
      type: 'maintenance',
      serviceType: 'Entretien préventif'
    };

    addJob(newJob);
    toast.success(`Entretien planifié pour le ${formData.date} à ${formData.time}`);
    onOpenChange(false);
    setFormData({
      date: '',
      time: '',
      technicianId: '',
      priority: 'medium',
      notes: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-600" />
            Planifier un entretien
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Equipment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900">Équipement</p>
            <p className="text-sm text-blue-700">{equipmentName}</p>
            {clientName && (
              <p className="text-xs text-blue-600 mt-1">Client: {clientName}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="time">Heure *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Technician */}
          <div>
            <Label htmlFor="technician">Technicien *</Label>
            <Select 
              value={formData.technicianId}
              onValueChange={(value) => setFormData({ ...formData, technicianId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un technicien..." />
              </SelectTrigger>
              <SelectContent>
                {technicians
                  .filter(t => t.status !== 'off-duty')
                  .map(tech => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name} - {tech.status === 'available' ? '✓ Disponible' : 'Occupé'}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="priority">Priorité</Label>
            <Select 
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Basse</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes supplémentaires</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Instructions spéciales, pièces nécessaires, etc."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
              <Calendar className="h-4 w-4 mr-2" />
              Planifier l'entretien
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
