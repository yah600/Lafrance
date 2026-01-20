import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Camera, Upload, Download, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { PDFGenerator } from '../../utils/pdfGenerator';

interface DrainUnblockingFormData {
  location: string;
  initialSymptom: string;
  photoBefore: File | null;
  methodsUsed: string[];
  causeIdentified: string;
  photoCause: File | null;
  snakeLength: string;
  cameraInspection: boolean;
  cameraVideo: File | null;
  pipeCondition: number;
  photoAfter: File | null;
  recommendations: string;
  nextVisitDate: string;
}

interface Props {
  jobId: string;
  onComplete: (data: DrainUnblockingFormData) => void;
  onCancel: () => void;
}

export default function DrainUnblockingForm({ jobId, onComplete, onCancel }: Props) {
  const [formData, setFormData] = useState<DrainUnblockingFormData>({
    location: '',
    initialSymptom: '',
    photoBefore: null,
    methodsUsed: [],
    causeIdentified: '',
    photoCause: null,
    snakeLength: '',
    cameraInspection: false,
    cameraVideo: null,
    pipeCondition: 7,
    photoAfter: null,
    recommendations: '',
    nextVisitDate: '',
  });

  const [photoBeforePreview, setPhotoBeforePreview] = useState<string>('');
  const [photoCausePreview, setPhotoCausePreview] = useState<string>('');
  const [photoAfterPreview, setPhotoAfterPreview] = useState<string>('');

  const handleFileChange = (field: 'photoBefore' | 'photoCause' | 'photoAfter' | 'cameraVideo', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    
    if (file && field !== 'cameraVideo') {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'photoBefore') setPhotoBeforePreview(result);
        if (field === 'photoCause') setPhotoCausePreview(result);
        if (field === 'photoAfter') setPhotoAfterPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      methodsUsed: prev.methodsUsed.includes(method)
        ? prev.methodsUsed.filter(m => m !== method)
        : [...prev.methodsUsed, method]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location || !formData.initialSymptom || !formData.photoBefore || !formData.photoAfter) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onComplete(formData);
    toast.success('Fiche technique enregistrée avec succès');
  };

  const generateReport = () => {
    if (!formData.location || !formData.initialSymptom) {
      toast.error('Veuillez remplir les informations de base avant de générer le rapport');
      return;
    }

    try {
      const reportData = {
        jobId: jobId,
        clientName: 'Client Example', // TODO: Get from job data
        clientAddress: '123 Rue Example, Montréal', // TODO: Get from job data
        date: new Date().toLocaleDateString('fr-CA'),
        technicianName: 'Technicien Example', // TODO: Get from current user
        technicianLicense: '5678-1234-01',
        location: formData.location,
        initialSymptom: formData.initialSymptom,
        methodsUsed: formData.methodsUsed,
        causeIdentified: formData.causeIdentified,
        snakeLength: formData.snakeLength,
        pipeCondition: formData.pipeCondition,
        recommendations: formData.recommendations,
        nextVisitDate: formData.nextVisitDate,
        photoBefore: photoBeforePreview,
        photoCause: photoCausePreview,
        photoAfter: photoAfterPreview,
      };

      const pdf = PDFGenerator.generateDrainUnblockingReport(reportData);
      PDFGenerator.openPDF(pdf);
      toast.success('Rapport PDF généré avec succès!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fiche Technique - Débouchage de drains</h2>
          <p className="text-gray-600">Job #{jobId}</p>
        </div>
        <Button variant="outline" onClick={generateReport}>
          <Download className="h-4 w-4 mr-2" />
          Prévisualiser rapport
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location & Initial Symptom */}
        <Card>
          <CardHeader>
            <CardTitle>Diagnostic initial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Localisation <span className="text-red-500">*</span></Label>
                <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cuisine">Cuisine</SelectItem>
                    <SelectItem value="salle-de-bain">Salle de bain</SelectItem>
                    <SelectItem value="sous-sol">Sous-sol</SelectItem>
                    <SelectItem value="exterieur">Extérieur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Symptôme initial <span className="text-red-500">*</span></Label>
                <Select value={formData.initialSymptom} onValueChange={(value) => setFormData(prev => ({ ...prev, initialSymptom: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eau-stagnante">Eau stagnante</SelectItem>
                    <SelectItem value="drainage-lent">Drainage lent</SelectItem>
                    <SelectItem value="refoulement">Refoulement</SelectItem>
                    <SelectItem value="odeurs">Odeurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Photo AVANT <span className="text-red-500">*</span></Label>
              <div className="flex gap-4">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition">
                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Prendre une photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFileChange('photoBefore', e.target.files?.[0] || null)}
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

        {/* Intervention */}
        <Card>
          <CardHeader>
            <CardTitle>Intervention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Méthode(s) utilisée(s) <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Ventouse', 'Snake', 'Hydro-jet', 'Caméra', 'Chimique'].map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={method}
                      checked={formData.methodsUsed.includes(method)}
                      onCheckedChange={() => toggleMethod(method)}
                    />
                    <label htmlFor={method} className="text-sm cursor-pointer">
                      {method}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {formData.methodsUsed.includes('Snake') && (
              <div className="space-y-2">
                <Label>Longueur de snake (pieds)</Label>
                <Input
                  type="number"
                  placeholder="25"
                  value={formData.snakeLength}
                  onChange={(e) => setFormData(prev => ({ ...prev, snakeLength: e.target.value }))}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Cause identifiée <span className="text-red-500">*</span></Label>
              <Select value={formData.causeIdentified} onValueChange={(value) => setFormData(prev => ({ ...prev, causeIdentified: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="graisse">Graisse</SelectItem>
                  <SelectItem value="cheveux">Cheveux</SelectItem>
                  <SelectItem value="racines">Racines</SelectItem>
                  <SelectItem value="objet-etranger">Objet étranger</SelectItem>
                  <SelectItem value="affaissement">Affaissement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.causeIdentified && (
              <div className="space-y-2">
                <Label>Photo de la cause</Label>
                <div className="flex gap-4">
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition">
                    <Camera className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Prendre une photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleFileChange('photoCause', e.target.files?.[0] || null)}
                    />
                  </label>
                  {photoCausePreview && (
                    <div className="flex-1">
                      <img src={photoCausePreview} alt="Cause" className="w-full h-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cameraInspection"
                  checked={formData.cameraInspection}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, cameraInspection: !!checked }))}
                />
                <label htmlFor="cameraInspection" className="text-sm cursor-pointer">
                  Inspection caméra effectuée
                </label>
              </div>

              {formData.cameraInspection && (
                <div className="space-y-2">
                  <Label>Vidéo d'inspection</Label>
                  <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition">
                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formData.cameraVideo ? formData.cameraVideo.name : 'Télécharger vidéo'}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleFileChange('cameraVideo', e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Résultats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>État des tuyaux (1-10) <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.pipeCondition}
                  onChange={(e) => setFormData(prev => ({ ...prev, pipeCondition: parseInt(e.target.value) }))}
                  className="flex-1"
                />
                <Badge variant="secondary" className="text-lg min-w-[60px] justify-center">
                  {formData.pipeCondition}/10
                </Badge>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Mauvais</span>
                <span>Excellent</span>
              </div>
            </div>

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

            <div className="space-y-2">
              <Label>Recommandations <span className="text-red-500">*</span></Label>
              <Select value={formData.recommendations} onValueChange={(value) => setFormData(prev => ({ ...prev, recommendations: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aucune">Aucune</SelectItem>
                  <SelectItem value="entretien-preventif">Entretien préventif</SelectItem>
                  <SelectItem value="remplacement-suggere">Remplacement suggéré</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.recommendations === 'entretien-preventif' && (
              <div className="space-y-2">
                <Label>Prochaine visite suggérée</Label>
                <Input
                  type="date"
                  value={formData.nextVisitDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, nextVisitDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
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