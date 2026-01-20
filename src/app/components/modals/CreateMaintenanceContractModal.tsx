import { useState } from 'react';
import { X, FileText, Calendar, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface CreateMaintenanceContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContractCreated?: (contract: any) => void;
}

export default function CreateMaintenanceContractModal({ 
  open, 
  onOpenChange,
  onContractCreated 
}: CreateMaintenanceContractModalProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    address: '',
    tier: 'bronze',
    startDate: '',
    frequency: 'quarterly',
    annualCost: '',
    services: [] as string[],
    notes: ''
  });

  const tierPricing = {
    bronze: 399,
    silver: 799,
    gold: 1499
  };

  const tierServices = {
    bronze: [
      'Inspection annuelle complète',
      'Rabais 10% sur les réparations',
      'Priorité sur les appels de service'
    ],
    silver: [
      '2 inspections annuelles',
      'Entretien préventif printemps/automne',
      'Rabais 15% sur les réparations',
      'Priorité sur les appels de service',
      'Support téléphonique 24/7'
    ],
    gold: [
      '4 inspections annuelles (trimestrielles)',
      'Entretien préventif complet',
      'Rabais 20% sur les réparations',
      'Priorité maximale',
      'Support 24/7',
      'Remplacement gratuit des pièces mineures',
      'Garantie prolongée sur les travaux'
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.address || !formData.startDate) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    const tierName = formData.tier as keyof typeof tierPricing;
    const price = tierPricing[tierName];

    const newContract = {
      id: `contract-${Date.now()}`,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientEmail: formData.clientEmail,
      address: formData.address,
      tier: formData.tier,
      status: 'active',
      startDate: formData.startDate,
      endDate: new Date(new Date(formData.startDate).setFullYear(new Date(formData.startDate).getFullYear() + 1)).toISOString().split('T')[0],
      frequency: formData.frequency,
      annualCost: price,
      nextService: formData.startDate,
      servicesIncluded: tierServices[tierName],
      notes: formData.notes
    };

    if (onContractCreated) {
      onContractCreated(newContract);
    }

    toast.success(`Contrat ${formData.tier.toUpperCase()} créé pour ${formData.clientName}!`);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      address: '',
      tier: 'bronze',
      startDate: '',
      frequency: 'quarterly',
      annualCost: '',
      services: [],
      notes: ''
    });
  };

  const selectedTier = formData.tier as keyof typeof tierPricing;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Nouveau contrat d'entretien
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Informations client</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Nom du client *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Jean Dupont"
                  required
                />
              </div>

              <div>
                <Label htmlFor="clientPhone">Téléphone</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  placeholder="514-555-0123"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                placeholder="client@example.com"
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Rue Principale, Montréal, QC"
                required
              />
            </div>
          </div>

          {/* Contract Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Détails du contrat</h3>
            
            <div>
              <Label htmlFor="tier">Forfait *</Label>
              <Select 
                value={formData.tier}
                onValueChange={(value) => setFormData({ ...formData, tier: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bronze">
                    <div className="flex items-center justify-between w-full">
                      <span>🥉 Bronze</span>
                      <span className="ml-4 text-gray-500">{tierPricing.bronze}$/an</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="silver">
                    <div className="flex items-center justify-between w-full">
                      <span>🥈 Argent</span>
                      <span className="ml-4 text-gray-500">{tierPricing.silver}$/an</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="gold">
                    <div className="flex items-center justify-between w-full">
                      <span>🥇 Or</span>
                      <span className="ml-4 text-gray-500">{tierPricing.gold}$/an</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Services Included */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                Services inclus - {formData.tier.toUpperCase()}
              </h4>
              <ul className="space-y-1">
                {tierServices[selectedTier].map((service, idx) => (
                  <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-blue-300">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-900">Prix annuel:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {tierPricing[selectedTier]}$ <span className="text-sm font-normal">/an</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Date de début *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <Label htmlFor="frequency">Fréquence des visites</Label>
                <Select 
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuelle</SelectItem>
                    <SelectItem value="quarterly">Trimestrielle</SelectItem>
                    <SelectItem value="biannual">Semestrielle</SelectItem>
                    <SelectItem value="annual">Annuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes supplémentaires</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Instructions spéciales, équipements particuliers, etc."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
              <Calendar className="h-4 w-4 mr-2" />
              Créer le contrat
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
