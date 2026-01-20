import React, { useState } from 'react';
import { Mail, Check, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { paymentService, InteracTransferRequest } from '../../services/paymentService';

interface InteracPaymentFormProps {
  amount: number;
  invoiceId: string;
  jobId: string;
  recipientEmail: string;
  recipientName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function InteracPaymentForm({
  amount,
  invoiceId,
  jobId,
  recipientEmail,
  recipientName,
  onSuccess,
  onCancel,
}: InteracPaymentFormProps) {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transferRequest, setTransferRequest] = useState<InteracTransferRequest | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendRequest = async () => {
    if (!email || !validateEmail(email)) {
      toast.error('Veuillez entrer une adresse courriel valide');
      return;
    }

    setIsProcessing(true);

    try {
      const message = `Paiement pour facture ${invoiceId} - ${recipientName}`;

      const request = await paymentService.requestInteracTransfer(
        amount,
        email,
        message,
        invoiceId,
        jobId
      );

      setTransferRequest(request);
      toast.success('Demande Interac envoyée', {
        description: 'Consultez votre courriel pour compléter le paiement',
      });

      // In production: This would actually send an Interac request
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualInstructions = () => {
    setShowInstructions(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papiers`);
  };

  if (showInstructions || transferRequest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Instructions Interac e-Transfer
          </CardTitle>
          <CardDescription>
            Suivez ces étapes pour effectuer votre paiement
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Amount */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">Montant à transférer:</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-900">{amount.toFixed(2)} $ CAD</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(amount.toFixed(2), 'Montant')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Étapes à suivre:</h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Ouvrez votre application bancaire</p>
                  <p className="text-sm text-gray-600">
                    Connectez-vous à votre banque en ligne ou application mobile
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Trouvez Interac e-Transfer</p>
                  <p className="text-sm text-gray-600">
                    Sélectionnez "Envoyer de l'argent" ou "Interac e-Transfer"
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-2">Entrez les informations suivantes:</p>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Destinataire:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{recipientEmail}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(recipientEmail, 'Courriel')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Montant:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{amount.toFixed(2)} $</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(amount.toFixed(2), 'Montant')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Message (optionnel):</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs">Facture {invoiceId}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(`Facture ${invoiceId}`, 'Message')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Pas de question de sécurité requise</p>
                  <p className="text-sm text-gray-600">
                    {recipientName} utilise le dépôt automatique. Aucune question de sécurité
                    n'est nécessaire.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Confirmez l'envoi</p>
                  <p className="text-sm text-gray-600">
                    Vérifiez les informations et confirmez le transfert. Le paiement sera traité
                    immédiatement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Important</p>
                <p>
                  Une fois le transfert effectué, il peut prendre de quelques minutes à 30 minutes
                  pour apparaître dans notre système. Nous vous enverrons un courriel de
                  confirmation dès réception.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {onCancel && (
              <Button variant="outline" className="flex-1" onClick={onCancel}>
                Retour
              </Button>
            )}
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => {
                if (onSuccess) onSuccess();
              }}
            >
              <Check className="h-4 w-4 mr-2" />
              J'ai effectué le transfert
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Conservez votre numéro de confirmation de transfert pour vos dossiers
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Paiement par Interac e-Transfer
        </CardTitle>
        <CardDescription>
          Payez directement depuis votre compte bancaire via Interac e-Transfer
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Amount Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">Montant à payer:</span>
            <span className="text-2xl font-bold text-blue-900">{amount.toFixed(2)} $ CAD</span>
          </div>
        </div>

        {/* Recipient Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Le paiement sera envoyé à:</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{recipientName}</Badge>
            <span className="text-sm font-medium text-gray-900">{recipientEmail}</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-900">Avantages Interac:</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Paiement sécurisé directement de votre banque</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Aucuns frais additionnels</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Dépôt automatique - Aucune question de sécurité</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Traitement instantané</span>
            </li>
          </ul>
        </div>

        {/* Two Options */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-gray-900">Choisissez votre méthode:</h3>

          {/* Option 1: Request via email */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold mb-1">Demande par courriel (recommandé)</p>
                <p className="text-sm text-gray-600">
                  Nous vous enverrons une demande Interac à votre courriel
                </p>
              </div>
              <Badge className="bg-green-600">Rapide</Badge>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Votre adresse courriel</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.courriel@example.com"
                />
              </div>

              <Button
                onClick={handleSendRequest}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Envoi en cours...
                  </span>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Recevoir la demande par courriel
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Option 2: Manual instructions */}
          <div className="border rounded-lg p-4">
            <div className="mb-3">
              <p className="font-semibold mb-1">Transfert manuel</p>
              <p className="text-sm text-gray-600">
                Effectuez le transfert manuellement depuis votre banque
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleManualInstructions}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir les instructions de transfert
            </Button>
          </div>
        </div>

        {/* Info Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700">
          <p className="font-semibold mb-1">Note:</p>
          <p>
            Interac e-Transfer est un service sécurisé offert par votre institution financière. Les
            transferts sont généralement traités en quelques minutes.
          </p>
        </div>

        {/* Cancel Button */}
        {onCancel && (
          <Button variant="outline" className="w-full" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
