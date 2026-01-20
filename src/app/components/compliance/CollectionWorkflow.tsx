import { useState } from 'react';
import { AlertTriangle, Mail, FileText, Scale, Send, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { toast } from 'sonner';
import { CollectionEscalation, EscalationStage, MiseEnDemeureTemplate } from '../../types/compliance';

interface CollectionWorkflowProps {
  invoiceId: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  invoiceNumber: string;
  invoiceDate: string;
  amountDue: number;
  daysOverdue: number;
  escalation?: CollectionEscalation;
  onEscalate: (escalation: CollectionEscalation) => void;
}

export function CollectionWorkflow({
  invoiceId,
  clientId,
  clientName,
  clientAddress,
  clientEmail,
  invoiceNumber,
  invoiceDate,
  amountDue,
  daysOverdue,
  escalation: existing,
  onEscalate,
}: CollectionWorkflowProps) {
  const [escalation, setEscalation] = useState<CollectionEscalation>(existing || {
    id: `escalation-${invoiceId}`,
    invoiceId,
    clientId,
    currentStage: 'none',
    stages: [],
    taggedForLegal: false,
  });

  const [showMiseEnDemeureDialog, setShowMiseEnDemeureDialog] = useState(false);
  const [miseEnDemeureData, setMiseEnDemeureData] = useState<MiseEnDemeureTemplate>({
    recipientName: clientName,
    recipientAddress: clientAddress,
    invoiceNumber,
    invoiceDate,
    amountDue,
    daysOverdue,
    paymentDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    interestRate: 1.5,
    legalFees: 150,
    companyName: 'Groupe G. Lafrance',
    companyAddress: '636 Grand Bernier Nord, St-Jean-Sur-Richelieu, QC J3B 0E6',
    companyRepresentative: 'Gabriel Lafrance',
  });

  const canSendReminder1 = escalation.currentStage === 'none' && daysOverdue >= 15;
  const canSendReminder2 = escalation.currentStage === 'reminder-1' && daysOverdue >= 30;
  const canSendMiseEnDemeure = escalation.currentStage === 'reminder-2' && daysOverdue >= 45;
  const canTagForLegal = escalation.currentStage === 'mise-en-demeure' && daysOverdue >= 60;

  const handleSendReminder = (reminderType: 'reminder-1' | 'reminder-2') => {
    const newStage: EscalationStage = {
      stage: reminderType,
      sentAt: new Date().toISOString(),
      sentBy: 'current-user-id',
      method: 'email',
      documentUrl: '', // Generated server-side
      responseReceived: false,
    };

    const updatedEscalation: CollectionEscalation = {
      ...escalation,
      currentStage: reminderType,
      stages: [...escalation.stages, newStage],
    };

    setEscalation(updatedEscalation);
    onEscalate(updatedEscalation);

    toast.success(`${reminderType === 'reminder-1' ? 'Premier' : 'Deuxième'} rappel envoyé à ${clientEmail}`);
  };

  const handleSendMiseEnDemeure = () => {
    const newStage: EscalationStage = {
      stage: 'mise-en-demeure',
      sentAt: new Date().toISOString(),
      sentBy: 'current-user-id',
      method: 'registered-mail',
      documentUrl: '', // Generated server-side
      deadline: miseEnDemeureData.paymentDeadline,
      responseReceived: false,
    };

    const updatedEscalation: CollectionEscalation = {
      ...escalation,
      currentStage: 'mise-en-demeure',
      stages: [...escalation.stages, newStage],
    };

    setEscalation(updatedEscalation);
    onEscalate(updatedEscalation);

    setShowMiseEnDemeureDialog(false);
    toast.success('Mise en demeure générée et prête à être envoyée');
  };

  const handleTagForLegal = () => {
    const newStage: EscalationStage = {
      stage: 'legal',
      sentAt: new Date().toISOString(),
      sentBy: 'current-user-id',
      method: 'mail',
      documentUrl: '',
      responseReceived: false,
    };

    const updatedEscalation: CollectionEscalation = {
      ...escalation,
      currentStage: 'legal',
      stages: [...escalation.stages, newStage],
      taggedForLegal: true,
      legalReferenceNumber: `LEGAL-${Date.now().toString().slice(-8)}`,
    };

    setEscalation(updatedEscalation);
    onEscalate(updatedEscalation);

    toast.success('Dossier transféré aux poursuites légales');
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'reminder-1': return 'bg-blue-100 text-blue-700';
      case 'reminder-2': return 'bg-yellow-100 text-yellow-700';
      case 'mise-en-demeure': return 'bg-orange-100 text-orange-700';
      case 'legal': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Recouvrement de créances
              </CardTitle>
              <CardDescription>
                Facture #{invoiceNumber} - {daysOverdue} jours de retard
              </CardDescription>
            </div>
            <Badge className={getStageColor(escalation.currentStage)}>
              {escalation.currentStage === 'none' && 'Nouveau'}
              {escalation.currentStage === 'reminder-1' && '1er rappel envoyé'}
              {escalation.currentStage === 'reminder-2' && '2e rappel envoyé'}
              {escalation.currentStage === 'mise-en-demeure' && 'Mise en demeure'}
              {escalation.currentStage === 'legal' && 'Poursuites légales'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invoice Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-medium">{clientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Montant dû</p>
              <p className="font-medium text-red-600">{amountDue.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date de facturation</p>
              <p className="font-medium">{new Date(invoiceDate).toLocaleDateString('fr-CA')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Jours de retard</p>
              <p className="font-medium text-orange-600">{daysOverdue} jours</p>
            </div>
          </div>

          {/* Escalation Timeline */}
          <div>
            <h4 className="font-semibold mb-3">Processus d'escalade</h4>
            <div className="space-y-3">
              {/* Stage 1: First Reminder */}
              <div className={`flex items-start gap-3 p-3 rounded-lg ${escalation.currentStage !== 'none' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className={`mt-1 ${escalation.currentStage !== 'none' ? 'text-blue-600' : 'text-gray-400'}`}>
                  {escalation.currentStage !== 'none' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">1. Premier rappel (15 jours)</p>
                  <p className="text-sm text-gray-600">Courriel de courtoisie rappelant le paiement</p>
                  {escalation.stages.find(s => s.stage === 'reminder-1') && (
                    <p className="text-xs text-blue-600 mt-1">
                      Envoyé le {new Date(escalation.stages.find(s => s.stage === 'reminder-1')!.sentAt).toLocaleDateString('fr-CA')}
                    </p>
                  )}
                </div>
                {canSendReminder1 && (
                  <Button onClick={() => handleSendReminder('reminder-1')} size="sm" className="gap-2">
                    <Send className="h-4 w-4" />
                    Envoyer
                  </Button>
                )}
              </div>

              {/* Stage 2: Second Reminder */}
              <div className={`flex items-start gap-3 p-3 rounded-lg ${escalation.currentStage === 'reminder-2' || escalation.currentStage === 'mise-en-demeure' || escalation.currentStage === 'legal' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className={`mt-1 ${escalation.currentStage === 'reminder-2' || escalation.currentStage === 'mise-en-demeure' || escalation.currentStage === 'legal' ? 'text-yellow-600' : 'text-gray-400'}`}>
                  {escalation.currentStage === 'reminder-2' || escalation.currentStage === 'mise-en-demeure' || escalation.currentStage === 'legal' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">2. Deuxième rappel (30 jours)</p>
                  <p className="text-sm text-gray-600">Courriel formel avec mention des frais de retard</p>
                  {escalation.stages.find(s => s.stage === 'reminder-2') && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Envoyé le {new Date(escalation.stages.find(s => s.stage === 'reminder-2')!.sentAt).toLocaleDateString('fr-CA')}
                    </p>
                  )}
                </div>
                {canSendReminder2 && (
                  <Button onClick={() => handleSendReminder('reminder-2')} size="sm" variant="outline" className="gap-2 border-yellow-600 text-yellow-700 hover:bg-yellow-100">
                    <Send className="h-4 w-4" />
                    Envoyer
                  </Button>
                )}
              </div>

              {/* Stage 3: Mise en demeure */}
              <div className={`flex items-start gap-3 p-3 rounded-lg ${escalation.currentStage === 'mise-en-demeure' || escalation.currentStage === 'legal' ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className={`mt-1 ${escalation.currentStage === 'mise-en-demeure' || escalation.currentStage === 'legal' ? 'text-orange-600' : 'text-gray-400'}`}>
                  {escalation.currentStage === 'mise-en-demeure' || escalation.currentStage === 'legal' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">3. Mise en demeure (45 jours)</p>
                  <p className="text-sm text-gray-600">Document légal envoyé par courrier recommandé</p>
                  {escalation.stages.find(s => s.stage === 'mise-en-demeure') && (
                    <p className="text-xs text-orange-600 mt-1">
                      Envoyé le {new Date(escalation.stages.find(s => s.stage === 'mise-en-demeure')!.sentAt).toLocaleDateString('fr-CA')}
                      {escalation.stages.find(s => s.stage === 'mise-en-demeure')!.deadline && (
                        <span> - Échéance: {new Date(escalation.stages.find(s => s.stage === 'mise-en-demeure')!.deadline!).toLocaleDateString('fr-CA')}</span>
                      )}
                    </p>
                  )}
                </div>
                {canSendMiseEnDemeure && (
                  <Button onClick={() => setShowMiseEnDemeureDialog(true)} size="sm" variant="outline" className="gap-2 border-orange-600 text-orange-700 hover:bg-orange-100">
                    <FileText className="h-4 w-4" />
                    Générer
                  </Button>
                )}
              </div>

              {/* Stage 4: Legal */}
              <div className={`flex items-start gap-3 p-3 rounded-lg ${escalation.currentStage === 'legal' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className={`mt-1 ${escalation.currentStage === 'legal' ? 'text-red-600' : 'text-gray-400'}`}>
                  {escalation.currentStage === 'legal' ? <CheckCircle2 className="h-5 w-5" /> : <Scale className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">4. Poursuites légales (60 jours)</p>
                  <p className="text-sm text-gray-600">Transfert du dossier à un avocat ou agence de recouvrement</p>
                  {escalation.taggedForLegal && (
                    <p className="text-xs text-red-600 mt-1">
                      Référence: {escalation.legalReferenceNumber}
                    </p>
                  )}
                </div>
                {canTagForLegal && (
                  <Button onClick={handleTagForLegal} size="sm" variant="destructive" className="gap-2">
                    <Scale className="h-4 w-4" />
                    Transférer
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Guidance */}
          {escalation.currentStage === 'none' && daysOverdue < 15 && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Le premier rappel sera disponible après 15 jours de retard. Actuellement: {daysOverdue} jours.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* History */}
      {escalation.stages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des communications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {escalation.stages.map((stage, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {stage.stage === 'reminder-1' && 'Premier rappel'}
                      {stage.stage === 'reminder-2' && 'Deuxième rappel'}
                      {stage.stage === 'mise-en-demeure' && 'Mise en demeure'}
                      {stage.stage === 'legal' && 'Poursuites légales'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(stage.sentAt).toLocaleDateString('fr-CA')} via {
                        stage.method === 'email' ? 'courriel' :
                        stage.method === 'registered-mail' ? 'courrier recommandé' :
                        'courrier'
                      }
                    </p>
                  </div>
                  <Badge variant={stage.responseReceived ? 'default' : 'secondary'} className={stage.responseReceived ? 'bg-green-600' : ''}>
                    {stage.responseReceived ? 'Réponse reçue' : 'En attente'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mise en Demeure Dialog */}
      <Dialog open={showMiseEnDemeureDialog} onOpenChange={setShowMiseEnDemeureDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Générer une mise en demeure</DialogTitle>
            <DialogDescription>
              Document légal formel exigeant le paiement dans un délai précis
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                La mise en demeure est une étape préalable obligatoire aux poursuites légales. 
                Assurez-vous que toutes les informations sont exactes.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentDeadline">Date limite de paiement</Label>
                <Input
                  id="paymentDeadline"
                  type="date"
                  value={miseEnDemeureData.paymentDeadline}
                  onChange={(e) => setMiseEnDemeureData({ ...miseEnDemeureData, paymentDeadline: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Généralement 10 jours ouvrables</p>
              </div>
              <div>
                <Label htmlFor="interestRate">Taux d'intérêt (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={miseEnDemeureData.interestRate}
                  onChange={(e) => setMiseEnDemeureData({ ...miseEnDemeureData, interestRate: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="legalFees">Frais juridiques ($)</Label>
              <Input
                id="legalFees"
                type="number"
                value={miseEnDemeureData.legalFees}
                onChange={(e) => setMiseEnDemeureData({ ...miseEnDemeureData, legalFees: parseFloat(e.target.value) })}
              />
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 border rounded-lg">
              <h4 className="font-semibold mb-2">Aperçu</h4>
              <div className="text-sm space-y-2">
                <p>Montant initial: {amountDue.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
                <p>Intérêts ({miseEnDemeureData.interestRate}%): {(amountDue * miseEnDemeureData.interestRate / 100).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
                <p>Frais juridiques: {miseEnDemeureData.legalFees.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
                <p className="font-bold border-t pt-2">
                  Total: {(amountDue + (amountDue * miseEnDemeureData.interestRate / 100) + miseEnDemeureData.legalFees).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMiseEnDemeureDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendMiseEnDemeure} className="gap-2">
              <FileText className="h-4 w-4" />
              Générer et envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}