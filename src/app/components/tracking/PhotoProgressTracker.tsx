import React, { useState, useEffect, useRef } from 'react';
import { Camera, Clock, Check, AlertTriangle, Upload, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';

interface PhotoEntry {
  id: string;
  timestamp: Date;
  photo: File | null;
  photoPreview: string | null;
  description: string;
  aiReformulated: string;
  required: boolean;
}

interface PhotoProgressTrackerProps {
  timerStartTime: Date;
  intervalMinutes?: number; // Default 45 minutes
  onPhotoSubmit?: (entry: PhotoEntry) => void;
}

export function PhotoProgressTracker({
  timerStartTime,
  intervalMinutes = 45,
  onPhotoSubmit,
}: PhotoProgressTrackerProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [photoEntries, setPhotoEntries] = useState<PhotoEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<PhotoEntry | null>(null);
  const [isReformulating, setIsReformulating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const intervalSeconds = intervalMinutes * 60;
  const nextPhotoTime = Math.ceil((elapsedMinutes + 1) / intervalMinutes) * intervalMinutes;
  const minutesUntilNext = nextPhotoTime - elapsedMinutes;
  const progress = ((elapsedMinutes % intervalMinutes) / intervalMinutes) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - timerStartTime.getTime()) / 1000 / 60);
      setElapsedMinutes(elapsed);

      // Check if it's time for a photo
      if (elapsed > 0 && elapsed % intervalMinutes === 0) {
        const alreadyHasEntry = photoEntries.some(
          (entry) =>
            Math.floor((entry.timestamp.getTime() - timerStartTime.getTime()) / 1000 / 60) ===
            elapsed
        );

        if (!alreadyHasEntry && !currentEntry) {
          createPhotoEntry(elapsed);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [timerStartTime, intervalMinutes, photoEntries, currentEntry]);

  const createPhotoEntry = (elapsed: number) => {
    const newEntry: PhotoEntry = {
      id: `photo-${Date.now()}`,
      timestamp: new Date(),
      photo: null,
      photoPreview: null,
      description: '',
      aiReformulated: '',
      required: true,
    };

    setCurrentEntry(newEntry);

    toast.warning(`Temps écoulé: ${elapsed} minutes. Veuillez prendre une photo de progression.`, {
      duration: 10000,
    });

    // Play sound (in production)
    console.log('🔔 Photo reminder alert!');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentEntry) return;

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentEntry({
        ...currentEntry,
        photo: file,
        photoPreview: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleReformulate = async () => {
    if (!currentEntry || !currentEntry.description.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    setIsReformulating(true);

    // Simulate AI reformulation
    setTimeout(() => {
      const reformulated = `Progression des travaux: ${currentEntry.description.trim()}. Photo prise à ${currentEntry.timestamp.toLocaleTimeString('fr-CA')}. État du chantier documenté conformément aux exigences.`;

      setCurrentEntry({
        ...currentEntry,
        aiReformulated: reformulated,
      });

      setIsReformulating(false);
      toast.success('Description reformulée par l\'IA');
    }, 1500);
  };

  const handleSubmitPhoto = () => {
    if (!currentEntry) return;

    if (!currentEntry.photo) {
      toast.error('Veuillez ajouter une photo');
      return;
    }

    if (!currentEntry.description.trim()) {
      toast.error('Veuillez ajouter une description');
      return;
    }

    // Add to entries
    setPhotoEntries((prev) => [...prev, currentEntry]);

    if (onPhotoSubmit) {
      onPhotoSubmit(currentEntry);
    }

    toast.success('Photo de progression enregistrée!');
    setCurrentEntry(null);
  };

  const handleSkipPhoto = () => {
    if (!currentEntry) return;

    const skipped = {
      ...currentEntry,
      required: false,
    };

    setPhotoEntries((prev) => [...prev, skipped]);
    setCurrentEntry(null);
    toast.info('Photo de progression reportée (non recommandé)');
  };

  const completedPhotos = photoEntries.filter((e) => e.photo !== null).length;
  const expectedPhotos = Math.floor(elapsedMinutes / intervalMinutes);

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Suivi de progression
            </CardTitle>
            <Badge variant={completedPhotos >= expectedPhotos ? 'default' : 'destructive'}>
              {completedPhotos}/{expectedPhotos} photos
            </Badge>
          </div>
          <CardDescription>
            Photos requises toutes les {intervalMinutes} minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Next Photo Timer */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Prochaine photo dans:</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{minutesUntilNext} min</span>
            </div>
            <Progress value={progress} className="h-2 bg-blue-200" />
          </div>

          {/* Photo Entry Form (if time for photo) */}
          {currentEntry && (
            <div className="p-6 border-2 border-orange-300 bg-orange-50 rounded-lg animate-pulse">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-900">
                  Photo de progression requise maintenant!
                </h3>
              </div>

              <div className="space-y-4">
                {/* Photo Upload */}
                <div>
                  <Label>Photo *</Label>
                  {currentEntry.photoPreview ? (
                    <div className="relative">
                      <img
                        src={currentEntry.photoPreview}
                        alt="Photo de progression"
                        className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <button
                        onClick={() =>
                          setCurrentEntry({
                            ...currentEntry,
                            photo: null,
                            photoPreview: null,
                          })
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary hover:bg-white transition-colors"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Cliquer pour ajouter une photo</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description des travaux *</Label>
                  <Textarea
                    id="description"
                    value={currentEntry.description}
                    onChange={(e) =>
                      setCurrentEntry({ ...currentEntry, description: e.target.value })
                    }
                    placeholder="Décrivez l'état actuel des travaux, ce qui a été fait depuis la dernière photo..."
                    rows={3}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleReformulate}
                    disabled={isReformulating || !currentEntry.description.trim()}
                  >
                    {isReformulating ? 'Reformulation...' : 'Reformuler avec l\'IA'}
                  </Button>
                </div>

                {/* AI Reformulated Description */}
                {currentEntry.aiReformulated && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <Label className="text-blue-900 font-medium">
                      Description reformulée par l'IA:
                    </Label>
                    <p className="text-sm text-blue-800 mt-2">{currentEntry.aiReformulated}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleSubmitPhoto}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Enregistrer la photo
                  </Button>
                  <Button variant="outline" onClick={handleSkipPhoto}>
                    Reporter
                  </Button>
                </div>

                <p className="text-xs text-orange-700 text-center">
                  Les photos de progression seront incluses dans la facture finale
                </p>
              </div>
            </div>
          )}

          {/* Photo History */}
          {photoEntries.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Historique des photos ({photoEntries.length})</h4>
              <div className="space-y-3">
                {photoEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      entry.photo
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {entry.photoPreview ? (
                      <img
                        src={entry.photoPreview}
                        alt="Photo de progression"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <Camera className="h-6 w-6 text-gray-400" />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {entry.timestamp.toLocaleTimeString('fr-CA')}
                        </span>
                        {entry.photo ? (
                          <Badge className="bg-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Complété
                          </Badge>
                        ) : (
                          <Badge variant="outline">Reporté</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-700">
                        {entry.aiReformulated || entry.description || 'Aucune description'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
