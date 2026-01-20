import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Camera, Download, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WaterHeaterFormData {
  interventionType: string;
  photoLabel: File | null;
  heaterType: string;
  brand: string;
  model: string;
  serialNumber: string;
  capacity: string;
  yearManufactured: string;
  anodeCondition: string;
  sedimentLevel: string;
  temperatureSetting: string;
  pressureVerified: string;
  tpValveCondition: string;
  leaks: string;
  photoAfter: File | null;
  estimatedLifespan: string;
}

interface Props {
  jobId: string;
  onComplete: (data: WaterHeaterFormData) => void;
  onCancel: () => void;
}

export default function WaterHeaterForm({ jobId, onComplete, onCancel }: Props) {
  const [formData, setFormData] = useState<WaterHeaterFormData>({
    interventionType: '',
    photoLabel: null,
    heaterType: '',
    brand: '',
    model: '',
    serialNumber: '',
    capacity: '',
    yearManufactured: '',
    anodeCondition: '',
    sedimentLevel: '',
    temperatureSetting: '',
    pressureVerified: '',
    tpValveCondition: '',
    leaks: '',
    photoAfter: null,
    estimatedLifespan: '',
  });

  const [photoLabelPreview, setPhotoLabelPreview] = useState<string>('');
  const [photoAfterPreview, setPhotoAfterPreview] = useState<string>('');

  const currentYear = new Date().getFullYear();
  const heaterAge = formData.yearManufactured ? currentYear - parseInt(formData.yearManufactured) : 0;

  const handleFileChange = (field: 'photoLabel' | 'photoAfter', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'photoLabel') setPhotoLabelPreview(result);
        if (field === 'photoAfter') setPhotoAfterPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.interventionType || !formData.photoLabel || !formData.photoAfter) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onComplete(formData);
    toast.success('Fiche technique enregistrée avec succès');
  };

  const generateReport = () => {
    toast.success('Génération du rapport d\'équipement...');
    // TODO: Generate equipment report PDF
  };

  const getLifespanStatus = () => {
    if (heaterAge < 5) return { color: 'bg-green-500', label: 'BON ÉTAT', bars: 10 };
    if (heaterAge < 8) return { color: 'bg-blue-500', label: 'BON', bars: 7 };
    if (heaterAge < 10) return { color: 'bg-yellow-500', label: 'SURVEILLER', bars: 5 };
    if (heaterAge < 12) return { color: 'bg-orange-500', label: 'VIEILLISSANT', bars: 3 };
    return { color: 'bg-red-500', label: 'REMPLACEMENT RECOMMANDÉ', bars: 1 };
  };

  const lifespanStatus = getLifespanStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fiche Technique - Chauffe-eau</h2>
          <p className="text-gray-600">Job #{jobId}</p>
        </div>
        <Button variant="outline" onClick={generateReport}>
          <Download className="h-4 w-4 mr-2" />
          Générer fiche équipement
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Intervention Type */}
        <Card>
          <CardHeader>
            <CardTitle>Type d'intervention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Type d'intervention <span className="text-red-500">*</span></Label>
              <Select value={formData.interventionType} onValueChange={(value) => setFormData(prev => ({ ...prev, interventionType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="installation">Installation</SelectItem>
                  <SelectItem value="reparation">Réparation</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="remplacement">Remplacement</SelectItem>
                  <SelectItem value="flush">Flush (vidange)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Photo étiquette <span className="text-red-500">*</span></Label>
              <p className="text-xs text-gray-600">Prenez une photo claire de l'étiquette du chauffe-eau</p>
              <div className="flex gap-4">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition">
                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Prendre une photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFileChange('photoLabel', e.target.files?.[0] || null)}
                  />
                </label>
                {photoLabelPreview && (
                  <div className="flex-1">
                    <img src={photoLabelPreview} alt="Étiquette" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Identification de l'équipement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type chauffe-eau <span className="text-red-500">*</span></Label>
                <Select value={formData.heaterType} onValueChange={(value) => setFormData(prev => ({ ...prev, heaterType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrique">Électrique</SelectItem>
                    <SelectItem value="gaz">Gaz</SelectItem>
                    <SelectItem value="thermopompe">Thermopompe</SelectItem>
                    <SelectItem value="tankless">Tankless (sans réservoir)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Marque <span className="text-red-500">*</span></Label>
                <Select value={formData.brand} onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="giant">Giant</SelectItem>
                    <SelectItem value="bradford-white">Bradford White</SelectItem>
                    <SelectItem value="rheem">Rheem</SelectItem>
                    <SelectItem value="gsw">GSW</SelectItem>
                    <SelectItem value="bosch">Bosch</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Modèle <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="172ETE-3F7M"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>No. Série <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="G2019-458721"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Capacité <span className="text-red-500">*</span></Label>
                <Select value={formData.capacity} onValueChange={(value) => setFormData(prev => ({ ...prev, capacity: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="40">40 gallons</SelectItem>
                    <SelectItem value="50">50 gallons</SelectItem>
                    <SelectItem value="60">60 gallons</SelectItem>
                    <SelectItem value="80">80 gallons</SelectItem>
                    <SelectItem value="tankless">Tankless</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Année de fabrication <span className="text-red-500">*</span></Label>
                <Select value={formData.yearManufactured} onValueChange={(value) => setFormData(prev => ({ ...prev, yearManufactured: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => currentYear - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {heaterAge > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Âge actuel:</span>
                  <Badge variant="secondary">{heaterAge} ans</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${lifespanStatus.color} transition-all`}
                      style={{ width: `${(lifespanStatus.bars / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap">{lifespanStatus.label}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inspection Details */}
        {['inspection', 'reparation', 'flush'].includes(formData.interventionType) && (
          <Card>
            <CardHeader>
              <CardTitle>Inspection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>État anode</Label>
                  <Select value={formData.anodeCondition} onValueChange={(value) => setFormData(prev => ({ ...prev, anodeCondition: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bon">Bon</SelectItem>
                      <SelectItem value="a-remplacer">À remplacer</SelectItem>
                      <SelectItem value="remplacee">Remplacée</SelectItem>
                      <SelectItem value="na">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sédiments</Label>
                  <Select value={formData.sedimentLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, sedimentLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aucun">Aucun</SelectItem>
                      <SelectItem value="leger">Léger</SelectItem>
                      <SelectItem value="modere">Modéré</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Température réglée <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="60"
                      value={formData.temperatureSetting}
                      onChange={(e) => setFormData(prev => ({ ...prev, temperatureSetting: e.target.value }))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">°C</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pression vérifiée <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="50"
                      value={formData.pressureVerified}
                      onChange={(e) => setFormData(prev => ({ ...prev, pressureVerified: e.target.value }))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">PSI</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Valve T&P <span className="text-red-500">*</span></Label>
                  <Select value={formData.tpValveCondition} onValueChange={(value) => setFormData(prev => ({ ...prev, tpValveCondition: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fonctionnelle">Fonctionnelle</SelectItem>
                      <SelectItem value="defectueuse">Défectueuse</SelectItem>
                      <SelectItem value="remplacee">Remplacée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fuites <span className="text-red-500">*</span></Label>
                  <Select value={formData.leaks} onValueChange={(value) => setFormData(prev => ({ ...prev, leaks: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aucune">Aucune</SelectItem>
                      <SelectItem value="base">Base</SelectItem>
                      <SelectItem value="connexions">Connexions</SelectItem>
                      <SelectItem value="valve">Valve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Durée de vie estimée (années)</Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={formData.estimatedLifespan}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedLifespan: e.target.value }))}
                />
              </div>

              {heaterAge >= 8 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-semibold mb-1">Chauffe-eau vieillissant</p>
                    <p>Ce chauffe-eau a {heaterAge} ans. La durée de vie moyenne est de 10-12 ans. Recommandez au client de prévoir un budget pour le remplacement.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Final Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Photo finale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Photo APRÈS <span className="text-red-500">*</span></Label>
              <div className="flex gap-4">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition">
                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Prendre une photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFileChange('photoAfter', e.target.files?.[0] || null)}
                  />
                </label>
                {photoAfterPreview && (
                  <div className="flex-1">
                    <img src={photoAfterPreview} alt="Après" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            <FileText className="h-4 w-4 mr-2" />
            Enregistrer la fiche technique
          </Button>
        </div>
      </form>
    </div>
  );
}
