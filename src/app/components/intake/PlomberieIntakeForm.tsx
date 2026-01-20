/**
 * Plomberie Emergency Intake Form
 * Implements update.md Section 3.1 - Plomberie (Emergency Priority)
 */

import { useState } from 'react';
import { AlertTriangle, Clock, MapPin, Phone, User, Camera, Droplets } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';

interface PlomberieIntakeFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function PlomberieIntakeForm({ onSubmit, onCancel }: PlomberieIntakeFormProps) {
  const [formData, setFormData] = useState({
    // Client Info
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    
    // Emergency Level
    emergencyLevel: 'scheduled' as 'critical' | 'urgent' | 'scheduled',
    
    // Problem Type
    problemType: '',
    problemDescription: '',
    
    // Access Info
    buildingType: 'residential' as 'residential' | 'commercial' | 'industrial',
    floor: '',
    parkingAvailable: true,
    keyCode: '',
    accessNotes: '',
    
    // Service Details
    cameraInspection: false,
    afterHours: false,
    
    // Location
    address: '',
    city: '',
    postalCode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate surcharge based on emergency level and time
    const now = new Date();
    const hour = now.getHours();
    let surcharge = 0;
    
    if (formData.afterHours || hour < 7 || hour > 18) {
      if (hour >= 18 && hour < 23) surcharge = 190; // Evening
      else if (hour >= 23 || hour < 7) surcharge = 275; // Night
      else if (now.getDay() === 0 || now.getDay() === 6) surcharge = 375; // Weekend
    }
    
    const submissionData = {
      ...formData,
      division: 'plomberie',
      surcharge,
      priority: formData.emergencyLevel,
      createdAt: new Date().toISOString(),
    };
    
    onSubmit(submissionData);
  };

  const getEmergencyColor = () => {
    switch (formData.emergencyLevel) {
      case 'critical': return 'bg-red-500';
      case 'urgent': return 'bg-yellow-500';
      case 'scheduled': return 'bg-green-500';
    }
  };

  const getEmergencyText = () => {
    switch (formData.emergencyLevel) {
      case 'critical': return '🔴 Critique (1h)';
      case 'urgent': return '🟡 Urgent (4h)';
      case 'scheduled': return '🟢 Planifié';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Emergency Level Selector - Prominent */}
      <Card className="border-2" style={{ borderColor: formData.emergencyLevel === 'critical' ? '#ef4444' : formData.emergencyLevel === 'urgent' ? '#eab308' : '#22c55e' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Niveau d'urgence
          </CardTitle>
          <CardDescription>Sélectionnez le niveau de priorité du service</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.emergencyLevel}
            onValueChange={(value: any) => setFormData({ ...formData, emergencyLevel: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 border-2 border-red-200 rounded-lg bg-red-50">
              <RadioGroupItem value="critical" id="critical" />
              <Label htmlFor="critical" className="flex-1 cursor-pointer">
                <div className="font-semibold text-red-700">🔴 Critique - Réponse 1h</div>
                <div className="text-sm text-red-600">Fuite majeure, inondation, urgence 24/7</div>
              </Label>
              <Badge variant="destructive">+$275-$375/h</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border-2 border-yellow-200 rounded-lg bg-yellow-50">
              <RadioGroupItem value="urgent" id="urgent" />
              <Label htmlFor="urgent" className="flex-1 cursor-pointer">
                <div className="font-semibold text-yellow-700">🟡 Urgent - Réponse 4h</div>
                <div className="text-sm text-yellow-600">Problème nécessitant intervention rapide</div>
              </Label>
              <Badge className="bg-yellow-500">+$190/h</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border-2 border-green-200 rounded-lg bg-green-50">
              <RadioGroupItem value="scheduled" id="scheduled" />
              <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                <div className="font-semibold text-green-700">🟢 Planifié</div>
                <div className="text-sm text-green-600">Service régulier, rendez-vous planifié</div>
              </Label>
              <Badge className="bg-green-500">Tarif normal</Badge>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Information du client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Nom complet *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Jean Tremblay"
                required
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Téléphone *</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="+1 514-555-0123"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="clientEmail">Courriel</Label>
            <Input
              id="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              placeholder="jean.tremblay@email.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Problem Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Description du problème
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="problemType">Type de problème *</Label>
            <Select
              value={formData.problemType}
              onValueChange={(value) => setFormData({ ...formData, problemType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type de problème" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leak">Fuite d'eau</SelectItem>
                <SelectItem value="blockage">Blocage / Débouchage</SelectItem>
                <SelectItem value="no-hot-water">Pas d'eau chaude</SelectItem>
                <SelectItem value="frozen-pipes">Tuyaux gelés</SelectItem>
                <SelectItem value="installation">Installation / Remplacement</SelectItem>
                <SelectItem value="repair">Réparation</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="problemDescription">Description détaillée *</Label>
            <Textarea
              id="problemDescription"
              value={formData.problemDescription}
              onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
              placeholder="Décrivez le problème en détail..."
              rows={4}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Access Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Informations d'accès
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 rue Principale"
                required
              />
            </div>
            <div>
              <Label htmlFor="floor">Étage</Label>
              <Input
                id="floor"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                placeholder="2e étage"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Montréal"
                required
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="H1A 1A1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="buildingType">Type de bâtiment</Label>
            <Select
              value={formData.buildingType}
              onValueChange={(value: any) => setFormData({ ...formData, buildingType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Résidentiel</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industriel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="parkingAvailable" className="font-normal">Stationnement disponible</Label>
              <p className="text-sm text-gray-500">Pour le véhicule du technicien</p>
            </div>
            <Switch
              id="parkingAvailable"
              checked={formData.parkingAvailable}
              onCheckedChange={(checked) => setFormData({ ...formData, parkingAvailable: checked })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="keyCode">Code d'accès / Porte</Label>
              <Input
                id="keyCode"
                value={formData.keyCode}
                onChange={(e) => setFormData({ ...formData, keyCode: e.target.value })}
                placeholder="Ex: #1234"
              />
            </div>
            <div>
              <Label htmlFor="accessNotes">Notes d'accès</Label>
              <Input
                id="accessNotes"
                value={formData.accessNotes}
                onChange={(e) => setFormData({ ...formData, accessNotes: e.target.value })}
                placeholder="Sonnette, interphone, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Services additionnels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="cameraInspection" className="font-normal">Inspection caméra</Label>
              <p className="text-sm text-gray-500">Inspection vidéo des canalisations</p>
            </div>
            <Switch
              id="cameraInspection"
              checked={formData.cameraInspection}
              onCheckedChange={(checked) => setFormData({ ...formData, cameraInspection: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* CMMTQ Verification Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">✓</span>
            </div>
            <div>
              <p className="font-semibold text-blue-900">Technicien certifié CMMTQ</p>
              <p className="text-sm text-blue-700">
                Tous nos techniciens sont membres de la Corporation des maîtres mécaniciens en tuyauterie du Québec.
                Certification vérifiée automatiquement lors de l'assignation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
        <Button type="submit" className="flex-1 bg-[#2B5A8E] hover:bg-[#1e3f63]">
          Soumettre la demande
        </Button>
      </div>
    </form>
  );
}
