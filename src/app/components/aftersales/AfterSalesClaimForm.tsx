import React, { useState } from 'react';
import { AlertCircle, Camera, Clock, Upload, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { AfterSalesPriority, AfterSalesClaimType } from '../../types/aftersales';

interface AfterSalesClaimFormProps {
  invoiceId: string;
  jobId: string;
  plumberName: string;
  serviceDate: Date;
  invoiceAmount: number;
  onSubmit: (claim: any) => void;
}

export function AfterSalesClaimForm({
  invoiceId,
  jobId,
  plumberName,
  serviceDate,
  invoiceAmount,
  onSubmit,
}: AfterSalesClaimFormProps) {
  const [claimType, setClaimType] = useState<AfterSalesClaimType | null>(null);
  const [priority, setPriority] = useState<AfterSalesPriority>(AfterSalesPriority.IMPORTANT);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const holdAmount = Math.round(invoiceAmount * 0.25 * 100) / 100;

  const claimTypes = [
    {
      type: AfterSalesClaimType.WARRANTY,
      label: 'Problème de garantie',
      description: 'Défaut de fabrication ou problème lié aux travaux',
      icon: AlertCircle,
      color: 'text-orange-600',
    },
    {
      type: AfterSalesClaimType.DAMAGE,
      label: 'Dommage causé',
      description: 'Dommages causés pendant les travaux',
      icon: AlertTriangle,
      color: 'text-red-600',
    },
    {
      type: AfterSalesClaimType.DISSATISFACTION,
      label: 'Insatisfaction',
      description: 'Qualité du service ou résultat insatisfaisant',
      icon: AlertCircle,
      color: 'text-yellow-600',
    },
  ];

  const priorityLevels = [
    {
      value: AfterSalesPriority.URGENT,
      label: 'Urgence',
      description: 'Situation dangereuse ou fuite active (réponse sous 1h)',
      responseTime: '1 heure',
      color: 'bg-red-600',
    },
    {
      value: AfterSalesPriority.IMPORTANT,
      label: 'Important',
      description: 'Problème important mais non urgent (réponse sous 48h)',
      responseTime: '48 heures',
      color: 'bg-orange-600',
    },
    {
      value: AfterSalesPriority.AESTHETIC,
      label: 'Esthétique',
      description: 'Problème esthétique ou mineur (réponse sous 7 jours)',
      responseTime: '7 jours',
      color: 'bg-yellow-600',
    },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 6) {
      toast.error('Maximum 6 photos permises');
      return;
    }
    setPhotos([...photos, ...files]);
  };

  const handleSubmit = async () => {
    if (!claimType) {
      toast.error('Veuillez sélectionner un type de réclamation');
      return;
    }

    if (!description.trim()) {
      toast.error('Veuillez décrire le problème');
      return;
    }

    if (photos.length === 0) {
      toast.error('Veuillez ajouter au moins une photo du problème');
      return;
    }

    setIsSubmitting(true);

    try {
      const claim = {
        id: `CLAIM-${Date.now()}`,
        invoiceId,
        jobId,
        type: claimType,
        priority,
        description,
        photos: photos.map((p, idx) => ({ id: `${Date.now()}-${idx}`, name: p.name })),
        status: 'pending',
        createdAt: new Date(),
        holdAmount,
      };

      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSubmit(claim);

      toast.success('Réclamation soumise avec succès', {
        description: `Un montant de ${holdAmount.toFixed(2)} $ sera retenu jusqu'à résolution.`,
      });
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Hold Notice */}
      <Card className="border-amber-300 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">
                Retenue de paiement automatique
              </h3>
              <p className="text-sm text-amber-800 mb-2">
                Un montant de <span className="font-bold">{holdAmount.toFixed(2)} $ (25%)</span> sera
                automatiquement retenu du paiement du plombier jusqu'à la résolution de votre réclamation.
              </p>
              <p className="text-xs text-amber-700">
                Le plombier a {priorityLevels.find((p) => p.value === priority)?.responseTime} pour
                répondre à votre réclamation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations du service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Plombier:</span>
            <span className="font-medium">{plumberName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date du service:</span>
            <span className="font-medium">{serviceDate.toLocaleDateString('fr-CA')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Facture:</span>
            <span className="font-medium">{invoiceId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Montant total:</span>
            <span className="font-bold text-lg">{invoiceAmount.toFixed(2)} $</span>
          </div>
        </CardContent>
      </Card>

      {/* Claim Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Type de réclamation</CardTitle>
          <CardDescription>Sélectionnez la nature du problème</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={claimType || ''} onValueChange={(v) => setClaimType(v as AfterSalesClaimType)}>
            <div className="space-y-3">
              {claimTypes.map((type) => (
                <div
                  key={type.type}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    claimType === type.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setClaimType(type.type)}
                >
                  <RadioGroupItem value={type.type} id={type.type} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <type.icon className={`h-5 w-5 ${type.color}`} />
                      <Label htmlFor={type.type} className="font-semibold cursor-pointer">
                        {type.label}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Priority Level */}
      <Card>
        <CardHeader>
          <CardTitle>Niveau de priorité</CardTitle>
          <CardDescription>Définit le délai de réponse requis</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={priority} onValueChange={(v) => setPriority(v as AfterSalesPriority)}>
            <div className="space-y-3">
              {priorityLevels.map((level) => (
                <div
                  key={level.value}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    priority === level.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPriority(level.value)}
                >
                  <RadioGroupItem value={level.value} id={level.value} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4" />
                      <Label htmlFor={level.value} className="font-semibold cursor-pointer">
                        {level.label}
                      </Label>
                      <Badge className={level.color}>{level.responseTime}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description du problème</CardTitle>
          <CardDescription>Expliquez en détail la situation</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez le problème en détail: quand est-il survenu, où se situe-t-il, quelle est l'ampleur..."
            className="resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">{description.length} caractères</p>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Photos du problème</CardTitle>
          <CardDescription>Au moins 1 photo requise (max 6)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, idx) => (
                  <div key={idx} className="relative">
                    <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center">
                      <Camera className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">{photo.name}</p>
                    <button
                      onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < 6 && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <Label htmlFor="photo-upload">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">
                      Cliquez pour ajouter des photos
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {photos.length} / 6 photos ajoutées
                    </p>
                  </div>
                </Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        size="lg"
        className="w-full bg-orange-600 hover:bg-orange-700"
        onClick={handleSubmit}
        disabled={isSubmitting || !claimType || !description.trim() || photos.length === 0}
      >
        {isSubmitting ? 'Soumission en cours...' : 'Soumettre la réclamation'}
      </Button>

      <p className="text-xs text-center text-gray-500">
        Le plombier sera notifié immédiatement et devra répondre dans le délai spécifié
      </p>
    </div>
  );
}
