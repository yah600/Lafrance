import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Camera, Download, FileText, Award } from 'lucide-react';
import { toast } from 'sonner';

interface BackwaterValveFormData {
  interventionType: string;
  photoLocationBefore: File | null;
  valveType: string;
  brand: string;
  model: string;
  diameter: string;
  material: string;
  valveCondition: number;
  functionalityVerified: boolean;
  photoAfter: File | null;
  serialNumber: string;
  warrantyDate: string;
}

interface Props {
  jobId: string;
  onComplete: (data: BackwaterValveFormData) => void;
  onCancel: () => void;
}

export default function BackwaterValveForm({ jobId, onComplete, onCancel }: Props) {
  const [formData, setFormData] = useState<BackwaterValveFormData>({
    interventionType: '',
    photoLocationBefore: null,
    valveType: '',
    brand: '',
    model: '',
    diameter: '',
    material: '',
    valveCondition: 10,
    functionalityVerified: false,
    photoAfter: null,
    serialNumber: '',
    warrantyDate: '',
  });

  const [photoBeforePreview, setPhotoBeforePreview] = useState<string>('');
  const [photoAfterPreview, setPhotoAfterPreview] = useState<string>('');

  const handleFileChange = (field: 'photoLocationBefore' | 'photoAfter', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'photoLocationBefore') setPhotoBeforePreview(result);
        if (field === 'photoAfter') setPhotoAfterPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.interventionType || !formData.photoLocationBefore || !formData.photoAfter) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onComplete(formData);
    toast.success('Fiche technique enregistrée avec succès');
  };

  const generateCertificate = () => {
    toast.success('Génération du certificat de conformité...');
    // TODO: Generate certificate PDF
  };

  const isInstallation = formData.interventionType === 'installation';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fiche Technique - Clapet anti-retour</h2>
          <p className="text-gray-600">Job #{jobId}</p>
        </div>
        {isInstallation && (
          <Button variant="outline" onClick={generateCertificate}>
            <Award className="h-4 w-4 mr-2" />
            Générer certificat
          </Button>
        )}
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
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="reparation">Réparation</SelectItem>
                  <SelectItem value="remplacement">Remplacement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Photo emplacement AVANT <span className="text-red-500">*</span></Label>
              <div className="flex gap-4">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition">
                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Prendre une photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFileChange('photoLocationBefore', e.target.files?.[0] || null)}
                  />
                </label>
                {photoBeforePreview && (
                  <div className="flex-1">
                    <img src={photoBeforePreview} alt="Avant" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valve Details */}
        <Card>
          <CardHeader>
            <CardTitle>Détails du clapet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type de clapet <span className="text-red-500">*</span></Label>
                <Select value={formData.valveType} onValueChange={(value) => setFormData(prev => ({ ...prev, valveType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normalement-ferme">Normalement fermé</SelectItem>
                    <SelectItem value="normalement-ouvert">Normalement ouvert</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Diamètre <span className="text-red-500">*</span></Label>
                <Select value={formData.diameter} onValueChange={(value) => setFormData(prev => ({ ...prev, diameter: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 pouces</SelectItem>
                    <SelectItem value="4">4 pouces</SelectItem>
                    <SelectItem value="6">6 pouces</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Matériau <span className="text-red-500">*</span></Label>
                <Select value={formData.material} onValueChange={(value) => setFormData(prev => ({ ...prev, material: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pvc">PVC</SelectItem>
                    <SelectItem value="abs">ABS</SelectItem>
                    <SelectItem value="fonte">Fonte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isInstallation && (
                <>
                  <div className="space-y-2">
                    <Label>Marque</Label>
                    <Input
                      placeholder="Mainline, Canplas, etc."
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Modèle</Label>
                    <Input
                      placeholder="ML-FR4"
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Numéro de série</Label>
                    <Input
                      placeholder="ML2024-45892"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date de garantie fabricant</Label>
                    <Input
                      type="date"
                      value={formData.warrantyDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, warrantyDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </>
              )}
            </div>

            {formData.interventionType === 'inspection' && (
              <div className="space-y-2">
                <Label>État du clapet (1-10)</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.valveCondition}
                    onChange={(e) => setFormData(prev => ({ ...prev, valveCondition: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <Badge variant="secondary" className="text-lg min-w-[60px] justify-center">
                    {formData.valveCondition}/10
                  </Badge>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <input
                type="checkbox"
                id="functionalityVerified"
                checked={formData.functionalityVerified}
                onChange={(e) => setFormData(prev => ({ ...prev, functionalityVerified: e.target.checked }))}
                className="h-4 w-4"
              />
              <label htmlFor="functionalityVerified" className="text-sm cursor-pointer">
                Fonctionnement vérifié et conforme
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Installation Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Photo finale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Photo installation APRÈS <span className="text-red-500">*</span></Label>
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

            {isInstallation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Un certificat de conformité sera généré automatiquement pour cette installation. 
                  Ce document peut être requis par l'assureur du client.
                </p>
              </div>
            )}
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
