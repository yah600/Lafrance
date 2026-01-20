import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface Equipment {
  id: string;
  type: string;
  brand: string;
  model: string;
  serialNumber?: string;
  installDate?: string;
  warrantyExpiry?: string;
  location?: string;
  notes?: string;
  status: string;
}

interface EditEquipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
  onEquipmentUpdated?: (equipment: Equipment) => void;
}

export default function EditEquipmentModal({ 
  open, 
  onOpenChange, 
  equipment,
  onEquipmentUpdated 
}: EditEquipmentModalProps) {
  const [formData, setFormData] = useState({
    type: '',
    brand: '',
    model: '',
    serialNumber: '',
    installDate: '',
    warrantyExpiry: '',
    location: '',
    notes: '',
    status: 'operational'
  });

  useEffect(() => {
    if (equipment) {
      setFormData({
        type: equipment.type || '',
        brand: equipment.brand || '',
        model: equipment.model || '',
        serialNumber: equipment.serialNumber || '',
        installDate: equipment.installDate || '',
        warrantyExpiry: equipment.warrantyExpiry || '',
        location: equipment.location || '',
        notes: equipment.notes || '',
        status: equipment.status || 'operational'
      });
    }
  }, [equipment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.brand) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    const updatedEquipment = {
      ...equipment!,
      ...formData
    };

    if (onEquipmentUpdated) {
      onEquipmentUpdated(updatedEquipment);
    }

    toast.success(`Équipement ${formData.brand} ${formData.model} mis à jour!`);
    onOpenChange(false);
  };

  if (!equipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Modifier l'équipement
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
              <Label htmlFor="status">État</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Opérationnel</SelectItem>
                  <SelectItem value="warning">Attention requise</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Marque *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="model">Modèle</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serialNumber">Numéro de série</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="location">Emplacement</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
              Sauvegarder les modifications
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
