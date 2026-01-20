/**
 * Toitures Project Intake Form
 * Implements update.md Section 3.1 - Toitures (Project-Based)
 */

import { useState } from 'react';
import { Home, Ruler, CloudRain, Hammer, User, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Badge } from '../ui/badge';

interface ToituresIntakeFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ToituresIntakeForm({ onSubmit, onCancel }: ToituresIntakeFormProps) {
  const [formData, setFormData] = useState({
    // Client Info
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    
    // Job Type
    jobType: '' as '' | 'new-installation' | 'repair' | 'inspection' | 'emergency-leak',
    
    // Roof Details
    roofArea: '',
    currentRoofType: '',
    
    // Access
    roofAccess: '',
    
    // Scheduling
    weatherWindow: '',
    urgency: 'normal' as 'emergency' | 'urgent' | 'normal' | 'flexible',
    
    // Location
    address: '',
    city: '',
    postalCode: '',
    
    // Description
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      division: 'toitures',
      priority: formData.urgency,
      createdAt: new Date().toISOString(),
    };
    
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Type */}
      <Card className="border-2 border-[#8B4513]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hammer className="h-5 w-5" />
            Type de travaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.jobType}
            onValueChange={(value: any) => setFormData({ ...formData, jobType: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="new-installation" id="new-installation" />
              <Label htmlFor="new-installation" className="flex-1 cursor-pointer">
                <div className="font-semibold">Nouvelle installation</div>
                <div className="text-sm text-gray-500">Remplacement complet de toiture</div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="repair" id="repair" />
              <Label htmlFor="repair" className="flex-1 cursor-pointer">
                <div className="font-semibold">Réparation</div>
                <div className="text-sm text-gray-500">Réparation de sections endommagées</div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="inspection" id="inspection" />
              <Label htmlFor="inspection" className="flex-1 cursor-pointer">
                <div className="font-semibold">Inspection</div>
                <div className="text-sm text-gray-500">Évaluation de l'état de la toiture</div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border-2 border-red-200 rounded-lg bg-red-50">
              <RadioGroupItem value="emergency-leak" id="emergency-leak" />
              <Label htmlFor="emergency-leak" className="flex-1 cursor-pointer">
                <div className="font-semibold text-red-700">Fuite d'urgence</div>
                <div className="text-sm text-red-600">Intervention immédiate requise</div>
              </Label>
              <Badge variant="destructive">Urgent</Badge>
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
            />
          </div>
        </CardContent>
      </Card>

      {/* Roof Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Détails de la toiture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roofArea">Superficie (pi²)</Label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="roofArea"
                  type="number"
                  value={formData.roofArea}
                  onChange={(e) => setFormData({ ...formData, roofArea: e.target.value })}
                  placeholder="ex: 2000"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Estimation acceptable si inconnue</p>
            </div>
            
            <div>
              <Label htmlFor="currentRoofType">Type de toiture actuelle</Label>
              <Select
                value={formData.currentRoofType}
                onValueChange={(value) => setFormData({ ...formData, currentRoofType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asphalt-shingle">Bardeau d'asphalte</SelectItem>
                  <SelectItem value="flat-membrane">Membrane (toit plat)</SelectItem>
                  <SelectItem value="metal">Métal</SelectItem>
                  <SelectItem value="tile">Tuile</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                  <SelectItem value="unknown">Inconnu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="roofAccess">Accès à la toiture</Label>
            <Select
              value={formData.roofAccess}
              onValueChange={(value) => setFormData({ ...formData, roofAccess: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Comment accéder à la toiture?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ladder">Échelle nécessaire</SelectItem>
                <SelectItem value="scaffolding">Échafaudage requis</SelectItem>
                <SelectItem value="lift">Nacelle/Lift</SelectItem>
                <SelectItem value="easy">Accès facile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="weatherWindow">Fenêtre météo préférée</Label>
            <Select
              value={formData.weatherWindow}
              onValueChange={(value) => setFormData({ ...formData, weatherWindow: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Préférence saisonnière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asap">Dès que possible</SelectItem>
                <SelectItem value="spring">Printemps</SelectItem>
                <SelectItem value="summer">Été</SelectItem>
                <SelectItem value="fall">Automne</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Adresse de la propriété
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Adresse *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 rue Principale"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Décrivez vos besoins, problèmes observés, ou détails du projet..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* RBQ Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">✓</span>
            </div>
            <div>
              <p className="font-semibold text-amber-900">Licence RBQ vérifiée</p>
              <p className="text-sm text-amber-700">
                Entrepreneur licencié RBQ. Vérification automatique de licence lors de l'assignation.
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
        <Button type="submit" className="flex-1 bg-[#8B4513] hover:bg-[#6d3510]">
          Soumettre la demande
        </Button>
      </div>
    </form>
  );
}
