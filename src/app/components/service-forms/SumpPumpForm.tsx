import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Camera, Download, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SumpPumpFormData {
  interventionType: string;
  photoSump: File | null;
  brand: string;
  model: string;
  power: string;
  pumpType: string;
  estimatedAge: string;
  functionalTest: string;
  evacuationTime: string;
  floatCondition: string;
  checkValve: string;
  batteryBackup: string;
  basinCondition: string;
  photoAfter: File | null;
}

interface Props {
  jobId: string;
  onComplete: (data: SumpPumpFormData) => void;
  onCancel: () => void;
}

export default function SumpPumpForm({ jobId, onComplete, onCancel }: Props) {
  const [formData, setFormData] = useState<SumpPumpFormData>({
    interventionType: '',
    photoSump: null,
    brand: '',
    model: '',
    power: '',
    pumpType: '',
    estimatedAge: '',
    functionalTest: '',
    evacuationTime: '',
    floatCondition: '',
    checkValve: '',
    batteryBackup: '',
    basinCondition: '',
    photoAfter: null,
  });

  const [photoSumpPreview, setPhotoSumpPreview] = useState<string>('');
  const [photoAfterPreview, setPhotoAfterPreview] = useState<string>('');

  const handleFileChange = (field: 'photoSump' | 'photoAfter', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'photoSump') setPhotoSumpPreview(result);
        if (field === 'photoAfter') setPhotoAfterPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.interventionType || !formData.photoSump || !formData.photoAfter) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onComplete(formData);
    toast.success('Fiche technique enregistrée avec succès');
  };

  const generateReport = () => {
    toast.success('Génération du rapport...');
    // TODO: Generate PDF report
  };

  const testPassed = formData.functionalTest === 'reussi';
  const backupPresent = formData.batteryBackup === 'presente';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fiche Technique - Pompe de puisard</h2>
          <p className="text-gray-600">Job #{jobId}</p>
        </div>
        <Button variant="outline" onClick={generateReport}>
          <Download className="h-4 w-4 mr-2" />
          Générer rapport
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
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="reparation">Réparation</SelectItem>
                  <SelectItem value="remplacement">Remplacement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Photo puisard <span className="text-red-500">*</span></Label>
              <div className="flex gap-4">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition">
                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Prendre une photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFileChange('photoSump', e.target.files?.[0] || null)}
                  />
                </label>
                {photoSumpPreview && (
                  <div className="flex-1">
                    <img src={photoSumpPreview} alt="Puisard" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pump Details */}
        <Card>
          <CardHeader>
            <CardTitle>Détails de la pompe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Marque/Modèle</Label>
                <Input
                  placeholder="Wayne, Zoeller, Liberty, etc."
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Puissance <span className="text-red-500">*</span></Label>
                <Select value={formData.power} onValueChange={(value) => setFormData(prev => ({ ...prev, power: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1/3">1/3 HP</SelectItem>
                    <SelectItem value="1/2">1/2 HP</SelectItem>
                    <SelectItem value="3/4">3/4 HP</SelectItem>
                    <SelectItem value="1">1 HP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type <span className="text-red-500">*</span></Label>
                <Select value={formData.pumpType} onValueChange={(value) => setFormData(prev => ({ ...prev, pumpType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submersible">Submersible</SelectItem>
                    <SelectItem value="sur-pied">Sur pied (pedestal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Âge estimé (années) <span className="text-red-500">*</span></Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={formData.estimatedAge}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedAge: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Functional Test */}
        <Card>
          <CardHeader>
            <CardTitle>Test fonctionnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Test fonctionnel <span className="text-red-500">*</span></Label>
                <Select value={formData.functionalTest} onValueChange={(value) => setFormData(prev => ({ ...prev, functionalTest: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reussi">Réussi ✓</SelectItem>
                    <SelectItem value="echoue">Échoué ✗</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {testPassed && (
                <div className="space-y-2">
                  <Label>Temps d'évacuation (secondes)</Label>
                  <Input
                    type="number"
                    placeholder="45"
                    value={formData.evacuationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, evacuationTime: e.target.value }))}
                  />
                </div>
              )}
            </div>

            {testPassed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="text-sm text-green-900">
                  <p className="font-semibold">Test réussi</p>
                  <p>La pompe fonctionne correctement</p>
                </div>
              </div>
            ) : formData.functionalTest === 'echoue' ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div className="text-sm text-red-900">
                  <p className="font-semibold">Test échoué</p>
                  <p>La pompe nécessite une réparation ou un remplacement</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Components Inspection */}
        <Card>
          <CardHeader>
            <CardTitle>Inspection des composants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Flotteur <span className="text-red-500">*</span></Label>
                <Select value={formData.floatCondition} onValueChange={(value) => setFormData(prev => ({ ...prev, floatCondition: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fonctionnel">Fonctionnel</SelectItem>
                    <SelectItem value="coince">Coincé</SelectItem>
                    <SelectItem value="remplace">Remplacé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Clapet de retenue <span className="text-red-500">*</span></Label>
                <Select value={formData.checkValve} onValueChange={(value) => setFormData(prev => ({ ...prev, checkValve: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present-fonctionnel">Présent + Fonctionnel</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="defectueux">Défectueux</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Batterie backup <span className="text-red-500">*</span></Label>
                <Select value={formData.batteryBackup} onValueChange={(value) => setFormData(prev => ({ ...prev, batteryBackup: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presente">Présente</SelectItem>
                    <SelectItem value="absente">Absente</SelectItem>
                    <SelectItem value="recommandee">Recommandée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>État du bassin <span className="text-red-500">*</span></Label>
                <Select value={formData.basinCondition} onValueChange={(value) => setFormData(prev => ({ ...prev, basinCondition: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="propre">Propre</SelectItem>
                    <SelectItem value="debris">Débris présents</SelectItem>
                    <SelectItem value="nettoye">Nettoyé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!backupPresent && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div className="text-sm text-yellow-900">
                  <p className="font-semibold">Batterie de secours recommandée</p>
                  <p>En cas de panne électrique, une batterie de secours peut prévenir les inondations au sous-sol. Recommandez cette option au client.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
