import { useState } from 'react';
import { Hammer } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function PatioIntakeForm({ onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({ clientName: '', clientPhone: '', address: '', city: '', postalCode: '', description: '' });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit({ ...formData, division: 'decks', createdAt: new Date().toISOString() }); };
  return (<form onSubmit={handleSubmit} className="space-y-6"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Hammer className="h-5 w-5" />Patio et terrasse</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>Nom *</Label><Input value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} required /></div><div><Label>Téléphone *</Label><Input value={formData.clientPhone} onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })} required /></div></div><Input placeholder="Adresse" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required /><div className="grid grid-cols-2 gap-4"><Input placeholder="Ville" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required /><Input placeholder="Code postal" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} required /></div></CardContent></Card><div className="flex gap-3"><Button type="button" variant="outline" onClick={onCancel} className="flex-1">Annuler</Button><Button type="submit" className="flex-1 bg-[#8B7355]">Soumettre</Button></div></form>);
}
