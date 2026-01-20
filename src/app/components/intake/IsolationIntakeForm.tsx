/**
 * Isolation Energy Efficiency Intake Form
 * Implements update.md Section 3.1 - Isolation (Energy Efficiency)
 */

import { useState } from 'react';
import { Thermometer, User, MapPin, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';

interface IsolationIntakeFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function IsolationIntakeForm({ onSubmit, onCancel }: IsolationIntakeFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    address: '',
    city: '',
    postalCode: '',
    areaToInsulate: '',
    currentRValue: 'unknown',
    squareFootage: '',
    energyAudit: false,
    grantApplication: [] as string[],
    timeline: 'flexible',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, division: 'isolation', createdAt: new Date().toISOString() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Client</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Nom *</Label><Input value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} required /></div>
            <div><Label>Téléphone *</Label><Input value={formData.clientPhone} onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })} required /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Thermometer className="h-5 w-5" />Zone à isoler</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Select value={formData.areaToInsulate} onValueChange={(value) => setFormData({ ...formData, areaToInsulate: value })}>
            <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="attic">Grenier</SelectItem>
              <SelectItem value="walls">Murs</SelectItem>
              <SelectItem value="basement">Sous-sol</SelectItem>
              <SelectItem value="crawlspace">Vide sanitaire</SelectItem>
            </SelectContent>
          </Select>
          <div><Label>Superficie (pi²)</Label><Input type="number" value={formData.squareFootage} onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })} /></div>
          
          <div className="space-y-2">
            <Label>Programmes de subventions</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="energir" /><Label htmlFor="energir" className="font-normal">Énergir</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hydro" /><Label htmlFor="hydro" className="font-normal">Hydro-Québec</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Adresse</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Adresse" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Ville" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
            <Input placeholder="Code postal" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} required />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3"><Button type="button" variant="outline" onClick={onCancel} className="flex-1">Annuler</Button><Button type="submit" className="flex-1 bg-[#FF8C00] hover:bg-[#cc7000]">Soumettre</Button></div>
    </form>
  );
}
