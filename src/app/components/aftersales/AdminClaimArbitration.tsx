import React, { useState } from 'react';
import { Scale, CheckCircle, XCircle, MessageSquare, DollarSign, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { AfterSalesClaimType } from '../../types/aftersales';

interface AdminClaimArbitrationProps {
  claim: {
    id: string;
    type: AfterSalesClaimType;
    clientName: string;
    plumberName: string;
    description: string;
    photos: any[];
    plumberResponse?: {
      action: 'accept' | 'dispute';
      explanation: string;
      submittedAt: Date;
    };
    holdAmount: number;
    invoiceAmount: number;
  };
  onResolve: (decision: any) => void;
}

export function AdminClaimArbitration({ claim, onResolve }: AdminClaimArbitrationProps) {
  const [decision, setDecision] = useState<'favor_client' | 'favor_plumber' | 'partial' | null>(null);
  const [explanation, setExplanation] = useState('');
  const [action, setAction] = useState<
    'full_refund' | 'partial_refund' | 'new_bet' | 'insurance' | 'dismiss' | null
  >(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const decisions = [
    {
      value: 'favor_client',
      label: 'En faveur du client',
      description: 'La réclamation est légitime',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      value: 'favor_plumber',
      label: 'En faveur du plombier',
      description: 'La réclamation n\'est pas fondée',
      icon: XCircle,
      color: 'text-red-600',
    },
    {
      value: 'partial',
      label: 'Responsabilité partagée',
      description: 'Les deux parties ont une part de responsabilité',
      icon: Scale,
      color: 'text-orange-600',
    },
  ];

  const actions = {
    favor_client: [
      {
        value: 'full_refund',
        label: 'Remboursement complet',
        description: `Rembourser ${claim.invoiceAmount.toFixed(2)} $ au client`,
      },
      {
        value: 'partial_refund',
        label: 'Remboursement partiel',
        description: 'Spécifier le montant à rembourser',
      },
      {
        value: 'new_bet',
        label: 'Nouveau BET',
        description: 'Lancer un nouveau BET pour corriger le problème',
      },
    ],
    favor_plumber: [
      {
        value: 'dismiss',
        label: 'Rejeter la réclamation',
        description: 'Libérer les fonds retenus au plombier',
      },
    ],
    partial: [
      {
        value: 'partial_refund',
        label: 'Remboursement partiel',
        description: 'Partager les coûts entre client et plombier',
      },
      {
        value: 'insurance',
        label: 'Réclamation d\'assurance',
        description: 'Soumettre à l\'assurance de la compagnie',
      },
    ],
  };

  const handleSubmit = async () => {
    if (!decision || !action) {
      toast.error('Veuillez prendre une décision et choisir une action');
      return;
    }

    if (!explanation.trim()) {
      toast.error('Veuillez fournir une explication de votre décision');
      return;
    }

    if (
      (action === 'partial_refund' || action === 'full_refund') &&
      action === 'partial_refund' &&
      !refundAmount
    ) {
      toast.error('Veuillez spécifier le montant du remboursement');
      return;
    }

    setIsSubmitting(true);

    try {
      const resolution = {
        decision,
        action,
        explanation,
        refundAmount:
          action === 'full_refund'
            ? claim.invoiceAmount
            : action === 'partial_refund'
            ? parseFloat(refundAmount)
            : 0,
        resolvedAt: new Date(),
        resolvedBy: 'admin',
      };

      await new Promise((resolve) => setTimeout(resolve, 1500));
      onResolve(resolution);

      toast.success('Décision enregistrée', {
        description: 'Le client et le plombier seront notifiés.',
      });
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement de la décision');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = (type: AfterSalesClaimType): string => {
    switch (type) {
      case AfterSalesClaimType.WARRANTY:
        return 'Garantie';
      case AfterSalesClaimType.DAMAGE:
        return 'Dommage';
      case AfterSalesClaimType.DISSATISFACTION:
        return 'Insatisfaction';
      default:
        return type;
    }
  };

  const currentActions = decision ? actions[decision] : [];

  return (
    <div className="space-y-6">
      {/* Case Overview */}
      <Card className="border-blue-300 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Scale className="h-6 w-6 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Arbitrage requis</h3>
              <p className="text-sm text-blue-800">
                Cette réclamation nécessite une décision d'administrateur. Examinez les détails et rendez
                une décision équitable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Impact financier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Montant de la facture:</span>
            <span className="font-bold">{claim.invoiceAmount.toFixed(2)} $</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Montant retenu (25%):</span>
            <span className="font-bold text-orange-600">{claim.holdAmount.toFixed(2)} $</span>
          </div>
        </CardContent>
      </Card>

      {/* Claim Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Détails de la réclamation</CardTitle>
              <CardDescription>Réclamation {claim.id}</CardDescription>
            </div>
            <Badge
              className={
                claim.type === AfterSalesClaimType.DAMAGE
                  ? 'bg-red-600'
                  : claim.type === AfterSalesClaimType.WARRANTY
                  ? 'bg-orange-600'
                  : 'bg-yellow-600'
              }
            >
              {getTypeLabel(claim.type)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Client:</span>
              <p className="font-medium">{claim.clientName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Plombier:</span>
              <p className="font-medium">{claim.plumberName}</p>
            </div>
          </div>

          <Separator />

          <div>
            <span className="text-sm font-semibold text-gray-700 block mb-2">
              Description du client:
            </span>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{claim.description}</p>
          </div>

          {/* Photos */}
          {claim.photos.length > 0 && (
            <div>
              <span className="text-sm font-semibold text-gray-700 block mb-2">Photos:</span>
              <div className="grid grid-cols-4 gap-3">
                {claim.photos.map((photo) => (
                  <div key={photo.id} className="bg-gray-200 rounded-lg h-20 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plumber Response */}
          {claim.plumberResponse && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Réponse du plombier:</span>
                  <Badge
                    className={
                      claim.plumberResponse.action === 'accept' ? 'bg-green-600' : 'bg-red-600'
                    }
                  >
                    {claim.plumberResponse.action === 'accept' ? 'Acceptée' : 'Contestée'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {claim.plumberResponse.explanation}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Soumis le {new Date(claim.plumberResponse.submittedAt).toLocaleString('fr-CA')}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Decision */}
      <Card>
        <CardHeader>
          <CardTitle>Votre décision</CardTitle>
          <CardDescription>Choisissez en faveur de qui trancher</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={decision || ''} onValueChange={(v) => setDecision(v as any)}>
            <div className="space-y-3">
              {decisions.map((d) => (
                <div
                  key={d.value}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    decision === d.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setDecision(d.value as any)}
                >
                  <RadioGroupItem value={d.value} id={d.value} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <d.icon className={`h-5 w-5 ${d.color}`} />
                      <Label htmlFor={d.value} className="font-semibold cursor-pointer">
                        {d.label}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Action Selection */}
      {decision && (
        <Card className="animate-in fade-in slide-in-from-bottom-2">
          <CardHeader>
            <CardTitle>Action à prendre</CardTitle>
            <CardDescription>Choisissez la résolution appropriée</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={action || ''} onValueChange={(v) => setAction(v as any)}>
              <div className="space-y-3">
                {currentActions.map((a) => (
                  <div
                    key={a.value}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      action === a.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setAction(a.value as any)}
                  >
                    <RadioGroupItem value={a.value} id={a.value} />
                    <div className="flex-1">
                      <Label htmlFor={a.value} className="font-semibold cursor-pointer">
                        {a.label}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Refund Amount Input */}
            {action === 'partial_refund' && (
              <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <Label htmlFor="refund-amount">Montant du remboursement</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="refund-amount"
                    type="number"
                    min="0"
                    max={claim.invoiceAmount}
                    step="0.01"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                  <span className="text-sm text-gray-600">$ CAD</span>
                </div>
                <p className="text-xs text-gray-500">
                  Maximum: {claim.invoiceAmount.toFixed(2)} $ (montant total de la facture)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Explanation */}
      {decision && action && (
        <Card className="animate-in fade-in slide-in-from-bottom-2">
          <CardHeader>
            <CardTitle>Explication de la décision</CardTitle>
            <CardDescription>
              Fournissez un raisonnement détaillé qui sera communiqué aux deux parties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={6}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Expliquez votre décision de manière claire et professionnelle. Cette explication sera envoyée au client et au plombier..."
              className="resize-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        size="lg"
        className="w-full bg-blue-600 hover:bg-blue-700"
        onClick={handleSubmit}
        disabled={!decision || !action || !explanation.trim() || isSubmitting}
      >
        {isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer la décision'}
      </Button>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-800">
            Cette décision est finale et affectera les paiements. Assurez-vous d'avoir examiné tous les
            détails attentivement.
          </p>
        </div>
      </div>
    </div>
  );
}
