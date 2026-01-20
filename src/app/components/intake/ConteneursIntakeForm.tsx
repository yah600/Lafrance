import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function ConteneursIntakeForm({ onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({ clientName: '', clientPhone: '', containerSize: '20yd', rentalDuration: '', materialType: '', address: '', city: '', postalCode: '' });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit({ ...formData, division: 'conteneurs', createdAt: new Date().toISOString() }); };
  return (<form onSubmit={handleSubmit} className="space-y-6"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Trash2 className="h-5 w-5" />Location de conteneur</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>Nom *</Label><Input value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} required /></div><div><Label>Téléphone *</Label><Input value={formData.clientPhone} onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })} required /></div></div><div><Label>Taille du conteneur</Label><Select value={formData.containerSize} onValueChange={(value) => setFormData({ ...formData, containerSize: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10yd">10 verges</SelectItem><SelectItem value="20yd">20 verges</SelectItem><SelectItem value="30yd">30 verges</SelectItem><SelectItem value="40yd">40 verges</SelectItem></SelectContent></Select></div><div><Label>Adresse *</Label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required /></div><div className="grid grid-cols-2 gap-4"><Input placeholder="Ville" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required /><Input placeholder="Code postal" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} required /></div></CardContent></Card><div className="flex gap-3"><Button type="button" variant="outline" onClick={onCancel} className="flex-1">Annuler</Button><Button type="submit" className="flex-1 bg-[#4A7C59]">Soumettre</Button></div></form>);
}
