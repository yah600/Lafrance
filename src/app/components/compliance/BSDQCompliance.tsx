import { AlertTriangle, ExternalLink, CheckCircle2, Lock, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { BSDQCompliance as BSDQComplianceType } from '../../types/compliance';

interface BSDQComplianceProps {
  jobId: string;
  quoteId: string;
  estimatedValue: number;
  hasMultipleSubcontractors?: boolean;
  isBidSituation?: boolean;
  compliance?: BSDQComplianceType;
  onSubmit?: (compliance: BSDQComplianceType) => void;
}

export function BSDQCompliance({
  jobId,
  quoteId,
  estimatedValue,
  hasMultipleSubcontractors = false,
  isBidSituation = false,
  compliance: existing,
  onSubmit,
}: BSDQComplianceProps) {
  const requiresBSDQ = estimatedValue > 20000 && (hasMultipleSubcontractors || isBidSituation);
  
  const compliance: BSDQComplianceType = existing || {
    jobId,
    quoteId,
    estimatedValue,
    hasMultipleSubcontractors,
    isBidSituation,
    requiresBSDQSubmission: requiresBSDQ,
    bsdqSubmitted: false,
    tesUrl: 'https://www.tes.tresor.gouv.qc.ca/',
    instructions: 'Consultez le portail TES pour soumettre votre appel d\'offres conforme au BSDQ',
    fullQuoteExportAllowed: !requiresBSDQ,
    blockReason: requiresBSDQ ? 'Soumission BSDQ requise pour les contrats > 20 000$ avec appel d\'offres' : undefined,
  };

  const handleConfirmSubmission = () => {
    const updatedCompliance: BSDQComplianceType = {
      ...compliance,
      bsdqSubmitted: true,
      bsdqSubmissionDate: new Date().toISOString(),
      bsdqReferenceNumber: `BSDQ-${Date.now().toString().slice(-8)}`,
      fullQuoteExportAllowed: true,
      blockReason: undefined,
    };

    if (onSubmit) {
      onSubmit(updatedCompliance);
    }
  };

  // No BSDQ requirements
  if (!requiresBSDQ) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Aucune soumission BSDQ requise</p>
              <p className="text-sm text-green-700">
                Ce contrat ne répond pas aux critères du BSDQ (valeur ≤ 20 000$ ou contrat de gré à gré)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // BSDQ already submitted
  if (compliance.bsdqSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle2 className="h-5 w-5" />
                Soumission BSDQ confirmée
              </CardTitle>
              <CardDescription className="text-green-700">
                Référence: {compliance.bsdqReferenceNumber}
              </CardDescription>
            </div>
            <Badge variant="default" className="bg-green-600">Conforme</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-green-700">Date de soumission:</span>
              <p className="font-medium text-green-900">
                {compliance.bsdqSubmissionDate && new Date(compliance.bsdqSubmissionDate).toLocaleDateString('fr-CA')}
              </p>
            </div>
            <div>
              <span className="text-green-700">Valeur estimée:</span>
              <p className="font-medium text-green-900">{estimatedValue.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
            </div>
          </div>
          <div className="pt-3">
            <Button variant="outline" className="w-full gap-2 border-green-600 text-green-700 hover:bg-green-100">
              <FileText className="h-4 w-4" />
              Exporter la soumission PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // BSDQ required but not submitted
  return (
    <Card className="border-orange-300 bg-orange-50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertTriangle className="h-5 w-5" />
              Soumission BSDQ requise
            </CardTitle>
            <CardDescription className="text-orange-700">
              Ce contrat doit être soumis au Bureau de la sécurité du Québec
            </CardDescription>
          </div>
          <Badge variant="destructive">Action requise</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trigger Conditions */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Conditions déclenchant le BSDQ:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Valeur du contrat: {estimatedValue.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} (&gt; 20 000$)</li>
              {hasMultipleSubcontractors && <li>Contrat avec plusieurs sous-traitants</li>}
              {isBidSituation && <li>Situation d'appel d'offres</li>}
            </ul>
          </AlertDescription>
        </Alert>

        {/* Requirements */}
        <div className="p-4 bg-white border border-orange-200 rounded-lg space-y-3">
          <h4 className="font-semibold text-orange-900">Exigences BSDQ</h4>
          <ul className="text-sm text-orange-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Soumission obligatoire via le portail TES (Travaux électroniques de soumission)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Tous les soumissionnaires doivent être inscrits</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Licence RBQ valide et adhésion CMMTQ requises</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Délais de publication et de dépôt à respecter</span>
            </li>
          </ul>
        </div>

        {/* Export Restriction */}
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            <strong>Exportation de soumission bloquée</strong>
            <p className="text-sm mt-1">
              {compliance.blockReason}. Vous devez d'abord soumettre votre appel d'offres via le portail TES.
            </p>
          </AlertDescription>
        </Alert>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => window.open(compliance.tesUrl, '_blank')}
            className="w-full gap-2 bg-orange-600 hover:bg-orange-700"
          >
            <ExternalLink className="h-4 w-4" />
            Accéder au portail TES (BSDQ)
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.open('https://www.rbq.gouv.qc.ca/appels-doffres/bsdq', '_blank')}
              className="flex-1 gap-2"
            >
              <FileText className="h-4 w-4" />
              Guide BSDQ
            </Button>
            <Button
              variant="outline"
              onClick={handleConfirmSubmission}
              className="flex-1"
            >
              Confirmer la soumission
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Instructions</h4>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Accédez au portail TES via le bouton ci-dessus</li>
            <li>Connectez-vous avec vos identifiants clicSÉQUR</li>
            <li>Créez un nouvel appel d'offres avec les détails du contrat</li>
            <li>Téléversez les documents requis (plans, devis, soumission)</li>
            <li>Publiez l'appel d'offres selon les délais réglementaires</li>
            <li>Une fois soumis, revenez ici et cliquez sur "Confirmer la soumission"</li>
          </ol>
        </div>

        {/* Legal Info */}
        <div className="text-xs text-gray-600 border-t pt-4">
          <p>
            <strong>Référence légale:</strong> Loi sur le bâtiment (L.R.Q., c. B-1.1), Règlement sur les marchés publics. 
            Tout contrat de construction d'une valeur supérieure à 20 000$ impliquant un appel d'offres public doit être 
            soumis via le portail BSDQ/TES.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Admin dashboard widget
export function BSDQDashboard({ contracts }: { contracts: BSDQComplianceType[] }) {
  const requiresSubmission = contracts.filter(c => c.requiresBSDQSubmission);
  const submitted = requiresSubmission.filter(c => c.bsdqSubmitted);
  const pending = requiresSubmission.filter(c => !c.bsdqSubmitted);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{requiresSubmission.length}</p>
            <p className="text-sm text-gray-600 mt-1">Contrats BSDQ</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{submitted.length}</p>
            <p className="text-sm text-gray-600 mt-1">Soumis</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{pending.length}</p>
            <p className="text-sm text-gray-600 mt-1">En attente</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
