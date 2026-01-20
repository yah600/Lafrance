import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, Truck, Camera, FileText, Check, AlertTriangle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';

interface PhotoEntry {
  id: string;
  timestamp: Date;
  photoPreview: string | null;
  aiReformulated: string;
}

interface AutoInvoiceGeneratorProps {
  jobId: string;
  clientName: string;
  serviceAddress: string;
  serviceType: string;

  // Timer data
  timerElapsedSeconds: number;
  timerStartTime: Date;

  // Transport
  distanceTraveled: number; // km

  // Photos from progression
  progressPhotos: PhotoEntry[];

  // Rates
  hourlyRate?: number; // Default 100 $/hour
  transportRatePerKm?: number; // Default 2 $/km

  onGenerateInvoice?: (invoiceData: any) => void;
  onCancel?: () => void;
}

export function AutoInvoiceGenerator({
  jobId,
  clientName,
  serviceAddress,
  serviceType,
  timerElapsedSeconds,
  timerStartTime,
  distanceTraveled,
  progressPhotos,
  hourlyRate = 100,
  transportRatePerKm = 2,
  onGenerateInvoice,
  onCancel,
}: AutoInvoiceGeneratorProps) {
  // Calculate suggested amounts
  const hoursWorked = timerElapsedSeconds / 3600;
  const suggestedLabor = Math.round(hoursWorked * hourlyRate * 100) / 100;
  const suggestedTransport = Math.round(distanceTraveled * transportRatePerKm * 100) / 100;
  const suggestedSubtotal = suggestedLabor + suggestedTransport;
  const tps = Math.round(suggestedSubtotal * 0.05 * 100) / 100;
  const tvq = Math.round(suggestedSubtotal * 0.09975 * 100) / 100;
  const suggestedTotal = Math.round((suggestedSubtotal + tps + tvq) * 100) / 100;

  // Adjustment limits (20% margin)
  const minAllowed = Math.round(suggestedTotal * 0.8 * 100) / 100;
  const maxAllowed = Math.round(suggestedTotal * 1.2 * 100) / 100;

  // State
  const [adjustedLabor, setAdjustedLabor] = useState(suggestedLabor);
  const [adjustedTransport, setAdjustedTransport] = useState(suggestedTransport);
  const [materials, setMaterials] = useState(0);
  const [finalDescription, setFinalDescription] = useState('');
  const [workStatus, setWorkStatus] = useState<'complete' | 'follow-up' | 'other-work'>('complete');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpDescription, setFollowUpDescription] = useState('');
  const [endPhotos, setEndPhotos] = useState<File[]>([]);
  const [endPhotosPreviews, setEndPhotosPreviews] = useState<string[]>([]);

  // Calculate current total
  const currentSubtotal = adjustedLabor + adjustedTransport + materials;
  const currentTPS = Math.round(currentSubtotal * 0.05 * 100) / 100;
  const currentTVQ = Math.round(currentSubtotal * 0.09975 * 100) / 100;
  const currentTotal = Math.round((currentSubtotal + currentTPS + currentTVQ) * 100) / 100;

  // Check if within margin
  const isWithinMargin = currentTotal >= minAllowed && currentTotal <= maxAllowed;
  const percentageChange = Math.round(((currentTotal - suggestedTotal) / suggestedTotal) * 100);

  const handleEndPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEndPhotos((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEndPhotosPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerateInvoice = () => {
    if (!finalDescription.trim()) {
      toast.error('Veuillez ajouter une description complète des travaux');
      return;
    }

    if (endPhotos.length === 0) {
      toast.error('Veuillez ajouter au moins une photo de fin de chantier');
      return;
    }

    if (!isWithinMargin) {
      toast.error('Le montant doit être dans la marge de ±20% du montant suggéré');
      return;
    }

    if (workStatus === 'follow-up' && !followUpDate) {
      toast.error('Veuillez sélectionner une date de retour');
      return;
    }

    const invoiceData = {
      jobId,
      clientName,
      serviceAddress,
      serviceType,

      // Time tracking
      workStartTime: timerStartTime,
      workEndTime: new Date(),
      hoursWorked,

      // Amounts
      laborAmount: adjustedLabor,
      transportAmount: adjustedTransport,
      materialsAmount: materials,
      subtotal: currentSubtotal,
      tps: currentTPS,
      tvq: currentTVQ,
      total: currentTotal,

      // Suggested vs actual
      suggestedTotal,
      adjustmentPercentage: percentageChange,

      // Description and photos
      finalDescription,
      progressPhotos,
      endPhotos,

      // Work status
      workStatus,
      followUpDate: workStatus === 'follow-up' ? followUpDate : null,
      followUpDescription: workStatus === 'follow-up' ? followUpDescription : null,

      createdAt: new Date(),
    };

    if (onGenerateInvoice) {
      onGenerateInvoice(invoiceData);
    }

    toast.success('Facture générée avec succès!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Génération automatique de facture
          </CardTitle>
          <CardDescription>
            Bon de travail pour {clientName} • {serviceType}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Adresse:</span>
              <p className="font-medium">{serviceAddress}</p>
            </div>
            <div>
              <span className="text-gray-600">Date:</span>
              <p className="font-medium">{new Date().toLocaleDateString('fr-CA')}</p>
            </div>
            <div>
              <span className="text-gray-600">Début travaux:</span>
              <p className="font-medium">{timerStartTime.toLocaleTimeString('fr-CA')}</p>
            </div>
            <div>
              <span className="text-gray-600">Durée:</span>
              <p className="font-medium">
                {Math.floor(hoursWorked)}h {Math.round((hoursWorked % 1) * 60)}min
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Amounts */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900 text-lg">Montants suggérés par la plateforme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Main d'œuvre ({hoursWorked.toFixed(2)}h × {hourlyRate}$/h)</span>
            </div>
            <span className="font-bold text-blue-900">{suggestedLabor.toFixed(2)} $</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Transport ({distanceTraveled.toFixed(1)} km × {transportRatePerKm}$/km)</span>
            </div>
            <span className="font-bold text-blue-900">{suggestedTransport.toFixed(2)} $</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold">Total suggéré (taxes incluses):</span>
            <span className="font-bold text-blue-900">{suggestedTotal.toFixed(2)} $</span>
          </div>

          <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
            Vous pouvez ajuster entre {minAllowed.toFixed(2)} $ et {maxAllowed.toFixed(2)} $ (±20%)
          </div>
        </CardContent>
      </Card>

      {/* Adjustment Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Ajustements (marge de 20%)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="labor">Main d'œuvre ($)</Label>
            <Input
              id="labor"
              type="number"
              step="0.01"
              value={adjustedLabor}
              onChange={(e) => setAdjustedLabor(parseFloat(e.target.value) || 0)}
              className={adjustedLabor !== suggestedLabor ? 'border-orange-300' : ''}
            />
            {adjustedLabor !== suggestedLabor && (
              <p className="text-xs text-orange-600 mt-1">
                Ajusté de {((adjustedLabor - suggestedLabor) / suggestedLabor * 100).toFixed(1)}%
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="transport">Transport ($)</Label>
            <Input
              id="transport"
              type="number"
              step="0.01"
              value={adjustedTransport}
              onChange={(e) => setAdjustedTransport(parseFloat(e.target.value) || 0)}
              className={adjustedTransport !== suggestedTransport ? 'border-orange-300' : ''}
            />
          </div>

          <div>
            <Label htmlFor="materials">Matériaux ($)</Label>
            <Input
              id="materials"
              type="number"
              step="0.01"
              value={materials}
              onChange={(e) => setMaterials(parseFloat(e.target.value) || 0)}
            />
            <p className="text-xs text-gray-500 mt-1">Matériaux utilisés (optionnel)</p>
          </div>

          <Separator />

          {/* Current Total */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sous-total:</span>
              <span>{currentSubtotal.toFixed(2)} $</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>TPS (5%):</span>
              <span>{currentTPS.toFixed(2)} $</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>TVQ (9.975%):</span>
              <span>{currentTVQ.toFixed(2)} $</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className={isWithinMargin ? 'text-green-600' : 'text-red-600'}>
                {currentTotal.toFixed(2)} $
              </span>
            </div>

            {percentageChange !== 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className={percentageChange > 0 ? 'text-green-600' : 'text-orange-600'}>
                  {percentageChange > 0 ? '+' : ''}{percentageChange}% vs suggéré
                </span>
                {isWithinMargin ? (
                  <Badge className="bg-green-600">Dans la marge</Badge>
                ) : (
                  <Badge variant="destructive">Hors marge!</Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Final Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description complète des travaux *</CardTitle>
          <CardDescription>Cette description apparaîtra sur la facture du client</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={5}
            value={finalDescription}
            onChange={(e) => setFinalDescription(e.target.value)}
            placeholder="Décrivez en détail tous les travaux effectués..."
          />
          <p className="text-xs text-gray-500 mt-2">
            L'IA reformulera cette description pour plus de clarté
          </p>
        </CardContent>
      </Card>

      {/* End Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photos de fin de chantier *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {endPhotosPreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Fin ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
              />
            ))}
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleEndPhotoUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {progressPhotos.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Photos de progression ({progressPhotos.length})
              </p>
              <p className="text-xs text-gray-500">
                Les photos de progression seront automatiquement incluses dans la facture
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Status */}
      <Card>
        <CardHeader>
          <CardTitle>Statut des travaux *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={workStatus} onValueChange={(val: any) => setWorkStatus(val)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="complete" id="complete" />
              <Label htmlFor="complete" className="cursor-pointer">
                Travaux terminés - Aucune intervention nécessaire
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="follow-up" id="follow-up" />
              <Label htmlFor="follow-up" className="cursor-pointer">
                Retouche nécessaire - Je dois y retourner
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other-work" id="other-work" />
              <Label htmlFor="other-work" className="cursor-pointer">
                Travaux additionnels requis (autre corps de métier)
              </Label>
            </div>
          </RadioGroup>

          {workStatus === 'follow-up' && (
            <div className="space-y-3 pl-6 border-l-2 border-orange-300 ml-3">
              <div>
                <Label htmlFor="followUpDate">Date de retour</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="followUpDescription">Description de la retouche</Label>
                <Textarea
                  id="followUpDescription"
                  rows={3}
                  value={followUpDescription}
                  onChange={(e) => setFollowUpDescription(e.target.value)}
                  placeholder="Qu'est-ce qui doit être retouché?"
                />
              </div>
            </div>
          )}

          {workStatus === 'other-work' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                Ce job sera automatiquement remis en BET pour permettre à d'autres corps de métier
                de soumettre pour les travaux additionnels.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warning */}
      {!isWithinMargin && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Montant hors marge</p>
            <p className="text-xs text-red-700 mt-1">
              Le montant total doit être entre {minAllowed.toFixed(2)} $ et {maxAllowed.toFixed(2)} $
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Annuler
        </Button>

        <Button
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={handleGenerateInvoice}
          disabled={!isWithinMargin}
        >
          <Check className="h-4 w-4 mr-2" />
          Générer la facture
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Le bon de travail doit être complété avant votre départ du chantier
      </p>
    </div>
  );
}
