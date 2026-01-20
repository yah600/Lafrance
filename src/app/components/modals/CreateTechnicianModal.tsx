import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { useApp } from '../../context/AppContext';

interface CreateTechnicianModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTechnicianModal({ open, onOpenChange }: CreateTechnicianModalProps) {
  const { addTechnician } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: '',
    hourlyRate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newTechnician = {
      id: `tech-${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      status: 'available' as const,
      location: {
        lat: 45.5017,
        lng: -73.5673,
        address: 'Montréal, QC'
      },
      skills: [formData.specialization],
      todayJobs: 0,
      completedJobs: 0,
      rating: 5.0,
      efficiency: 100
    };

    addTechnician(newTechnician);
    toast.success(`Technicien ${formData.name} ajouté avec succès!`);
    onOpenChange(false);
    setFormData({ name: '', phone: '', email: '', specialization: '', hourlyRate: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Ajouter un nouveau technicien
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jean Dupont"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 514-555-0123"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jean.dupont@plomberie.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialization">Spécialisation</Label>
              <Select 
                value={formData.specialization}
                onValueChange={(value) => setFormData({ ...formData, specialization: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Plomberie résidentielle">Plomberie résidentielle</SelectItem>
                  <SelectItem value="Plomberie commerciale">Plomberie commerciale</SelectItem>
                  <SelectItem value="Urgences">Urgences</SelectItem>
                  <SelectItem value="Installation">Installation</SelectItem>
                  <SelectItem value="Réparation">Réparation</SelectItem>
                  <SelectItem value="Entretien">Entretien</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hourlyRate">Taux horaire ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="85"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
              Ajouter le technicien
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
