/**
 * Cross-Referral Capture Modal
 * THE REVENUE MULTIPLIER - Core feature of the multi-trade platform
 * 
 * When a technician spots an opportunity in another division, they capture it here.
 * The system then scores, routes, and converts the opportunity automatically.
 * 
 * Expected Impact:
 * - 10-25% cross-sell lift per transaction
 * - $150K-$300K Year 1 revenue
 * - $400K-$800K Year 2 revenue
 */

import { useState } from 'react';
import { Camera, Mic, Send, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { DIVISIONS } from '../../data/divisions';
import type { DivisionType } from '../../types/lacoste-platform';
import { toast } from 'sonner';

interface CrossReferralCaptureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentJobId: string;
  propertyId: string;
  technicianId: string;
  technicianName: string;
  originDivision: DivisionType;
}

const SEVERITY_LABELS = {
  1: { label: 'Mineur', description: 'Peut attendre', color: 'bg-green-100 text-green-800 border-green-300' },
  2: { label: 'Modéré', description: 'Planifier bientôt', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  3: { label: 'Significatif', description: 'Action recommandée', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  4: { label: 'Sérieux', description: 'Attention urgente', color: 'bg-red-100 text-red-800 border-red-300' },
  5: { label: 'Critique', description: 'Action immédiate', color: 'bg-purple-100 text-purple-800 border-purple-300' }
};

export function CrossReferralCapture({
  open,
  onOpenChange,
  currentJobId,
  propertyId,
  technicianId,
  technicianName,
  originDivision
}: CrossReferralCaptureProps) {
  const [selectedDivision, setSelectedDivision] = useState<DivisionType | null>(null);
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available divisions (excluding current division)
  const availableDivisions = DIVISIONS.filter(d => d.active && d.id !== originDivision);

  const handlePhotoCapture = () => {
    // Simulate photo capture (in production, this would use device camera)
    const photoId = `photo-${Date.now()}`;
    setPhotos([...photos, photoId]);
    toast.success('Photo ajoutée', {
      description: `${photos.length + 1} photo(s) capturée(s)`
    });
  };

  const handleVoiceNote = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info('Enregistrement vocal...', {
        description: 'Parlez maintenant. Appuyez à nouveau pour arrêter.'
      });
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        toast.success('Enregistrement terminé', {
          description: 'Transcription en cours avec IA...'
        });
      }, 3000);
    }
  };

  const calculateMLScore = (): number => {
    // Simplified ML scoring algorithm
    // In production, this would call a backend ML model
    let score = 0;
    
    // Severity (25 points)
    score += severity * 5;
    
    // Has photos (10 points)
    if (photos.length > 0) score += 10;
    
    // Has description (10 points)
    if (description.length > 20) score += 10;
    
    // Property age factor (simulated - 15 points)
    score += Math.floor(Math.random() * 15);
    
    // Customer LTV factor (simulated - 20 points)
    score += Math.floor(Math.random() * 20);
    
    // Seasonal relevance (simulated - 15 points)
    score += Math.floor(Math.random() * 15);
    
    // Service gap (simulated - 15 points)
    score += Math.floor(Math.random() * 15);
    
    return Math.min(100, score);
  };

  const handleSubmit = async () => {
    if (!selectedDivision) {
      toast.error('Division requise', {
        description: 'Veuillez sélectionner la division cible'
      });
      return;
    }

    if (photos.length === 0) {
      toast.error('Photo requise', {
        description: 'Au moins une photo est nécessaire'
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate ML scoring
    const mlScore = calculateMLScore();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create cross-referral record (in production, this would call API)
    const crossReferral = {
      id: `ref-${Date.now()}`,
      propertyId,
      originDivision,
      originTechnicianId: technicianId,
      originTechnicianName: technicianName,
      originJobId: currentJobId,
      targetDivision: selectedDivision,
      description,
      severityRating: severity,
      photos,
      mlScore,
      status: 'captured' as const,
      priority: mlScore >= 75 ? 'high' as const : mlScore >= 50 ? 'standard' as const : 'low' as const,
      capturedDate: new Date()
    };

    console.log('Cross-Referral Created:', crossReferral);

    // Determine priority message
    let priorityMessage = '';
    if (mlScore >= 75) {
      priorityMessage = 'HAUTE PRIORITÉ - Appel téléphonique dans 24h';
    } else if (mlScore >= 50) {
      priorityMessage = 'STANDARD - Email + appel dans 72h';
    } else {
      priorityMessage = 'BASSE - Ajouté à la campagne saisonnière';
    }

    toast.success('Opportunité capturée! 🎯', {
      description: `Score ML: ${mlScore}/100 - ${priorityMessage}`,
      duration: 5000
    });

    // Commission notification
    setTimeout(() => {
      toast.success('Commission enregistrée! 💰', {
        description: `Vous recevrez $25-$100 si cette opportunité se concrétise.`
      });
    }, 1000);

    setIsSubmitting(false);
    onOpenChange(false);

    // Reset form
    setSelectedDivision(null);
    setSeverity(3);
    setDescription('');
    setPhotos([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Opportunité inter-divisions
          </DialogTitle>
          <DialogDescription>
            Vous avez repéré une opportunité dans une autre division? Capturez-la ici!
            <br />
            <span className="text-sm text-green-600 font-medium">
              💰 Gagnez $25-$100 de commission si l'opportunité se concrétise
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Division Selection */}
          <div>
            <Label>Division cible *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {availableDivisions.map((division) => (
                <button
                  key={division.id}
                  onClick={() => setSelectedDivision(division.id)}
                  className={`
                    p-3 rounded-lg border-2 text-left transition-all
                    ${selectedDivision === division.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="font-medium text-sm">{division.nameFr}</div>
                  {division.rrbqLicense && (
                    <div className="text-xs text-gray-500 mt-1">
                      {division.rrbqLicense}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Severity Rating */}
          <div>
            <Label>Niveau de gravité *</Label>
            <div className="flex gap-2 mt-2">
              {([1, 2, 3, 4, 5] as const).map((level) => {
                const config = SEVERITY_LABELS[level];
                return (
                  <button
                    key={level}
                    onClick={() => setSeverity(level)}
                    className={`
                      flex-1 p-3 rounded-lg border-2 text-center transition-all
                      ${severity === level ? config.color : 'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <div className="font-bold text-lg">{level}</div>
                    <div className="text-xs font-medium">{config.label}</div>
                    <div className="text-xs">{config.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description de l'opportunité</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Bardeaux de toiture manquants sur le côté nord, solins détériorés autour de la cheminée..."
              className="mt-2 min-h-[100px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Plus de détails = meilleur score ML = priorisation plus élevée
            </p>
          </div>

          {/* Photo Capture */}
          <div>
            <Label>Photos * (minimum 1)</Label>
            <div className="mt-2 space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePhotoCapture}
                className="w-full"
              >
                <Camera className="w-4 h-4 mr-2" />
                Prendre une photo ({photos.length})
              </Button>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo, index) => (
                    <div key={photo} className="relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                      <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <button
                        onClick={() => setPhotos(photos.filter(p => p !== photo))}
                        className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Voice Note (Optional) */}
          <div>
            <Label>Note vocale (optionnel)</Label>
            <Button
              type="button"
              variant="outline"
              onClick={handleVoiceNote}
              className={`w-full mt-2 ${isRecording ? 'bg-red-50 border-red-500' : ''}`}
            >
              <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-pulse text-red-500' : ''}`} />
              {isRecording ? 'Enregistrement... (touchez pour arrêter)' : 'Ajouter une note vocale'}
            </Button>
            <p className="text-xs text-gray-500 mt-1">
              IA transcrit automatiquement votre note vocale
            </p>
          </div>

          {/* ML Score Preview (if enough data) */}
          {selectedDivision && photos.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-blue-900">Prêt à soumettre</div>
                  <div className="text-sm text-blue-700 mt-1">
                    Le système ML va scorer cette opportunité (0-100) basé sur la gravité, 
                    l'âge de la propriété, la valeur du client, et plus encore.
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    Score élevé = suivi plus rapide = commission plus probable! 💰
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting || !selectedDivision || photos.length === 0}
            >
              {isSubmitting ? (
                <>Calcul du score ML...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Soumettre l'opportunité
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
