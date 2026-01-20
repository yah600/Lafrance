import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface CreateEquipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId?: string;
  onEquipmentCreated?: (equipment: any) => void;
}

export default function CreateEquipmentModal({ 
  open, 
  onOpenChange, 
  clientId,
  onEquipmentCreated 
}: CreateEquipmentModalProps) {
  const [formData, setFormData] = useState({
    type: '',
    brand: '',
    model: '',
    serialNumber: '',
    installDate: '',
    warrantyExpiry: '',
    location: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.brand) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    const newEquipment = {
      id: `eq-${Date.now()}`,
      ...formData,
      status: 'operational',
      lastMaintenance: formData.installDate,
      nextMaintenance: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    if (onEquipmentCreated) {
      onEquipmentCreated(newEquipment);
    }

    toast.success(`Équipement ${formData.brand} ${formData.model} ajouté avec succès!`);
    onOpenChange(false);
    setFormData({
      type: '',
      brand: '',
      model: '',
      serialNumber: '',
      installDate: '',
      warrantyExpiry: '',
      location: '',
      notes: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Ajouter un équipement
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type d'équipement *</Label>
              <Select 
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chauffe-eau">Chauffe-eau</SelectItem>
                  <SelectItem value="Chaudière">Chaudière</SelectItem>
                  <SelectItem value="Pompe">Pompe</SelectItem>
                  <SelectItem value="Adoucisseur d'eau">Adoucisseur d'eau</SelectItem>
                  <SelectItem value="Système de filtration">Système de filtration</SelectItem>
                  <SelectItem value="Toilettes">Toilettes</SelectItem>
                  <SelectItem value="Évier">Évier</SelectItem>
                  <SelectItem value="Robinetterie">Robinetterie</SelectItem>
                  <SelectItem value="Tuyauterie">Tuyauterie</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brand">Marque *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Ex: Bradford White"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="model">Modèle</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Ex: M-2-40T6DS"
              />
            </div>

            <div>
              <Label htmlFor="serialNumber">Numéro de série</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="Ex: SN123456789"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="installDate">Date d'installation</Label>
              <Input
                id="installDate"
                type="date"
                value={formData.installDate}
                onChange={(e) => setFormData({ ...formData, installDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="warrantyExpiry">Fin de garantie</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Emplacement</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ex: Sous-sol, Salle mécanique"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informations supplémentaires..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
              Ajouter l'équipement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
