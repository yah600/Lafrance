import React from 'react';
import { DollarSign, Clock, AlertCircle, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { PaymentSplit, PaymentStatus, ComplianceStatus, checkPaymentReleaseConditions } from '../../types/payment';

interface PaymentSplitCardProps {
  split: PaymentSplit;
  showDetails?: boolean;
}

export function PaymentSplitCard({ split, showDetails = true }: PaymentSplitCardProps) {
  const releaseConditions = checkPaymentReleaseConditions(split);

  const getStatusColor = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.CAPTURED:
      case PaymentStatus.SPLIT_RELEASED:
      case PaymentStatus.FULLY_RELEASED:
        return 'bg-green-600';
      case PaymentStatus.HELD:
        return 'bg-orange-600';
      case PaymentStatus.PENDING:
      case PaymentStatus.AUTHORIZED:
        return 'bg-blue-600';
      case PaymentStatus.PARTIALLY_REFUNDED:
      case PaymentStatus.FULLY_REFUNDED:
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusLabel = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'En attente';
      case PaymentStatus.AUTHORIZED:
        return 'Autorisé';
      case PaymentStatus.CAPTURED:
        return 'Capturé';
      case PaymentStatus.SPLIT_RELEASED:
        return 'Payé';
      case PaymentStatus.FULLY_RELEASED:
        return 'Complet';
      case PaymentStatus.HELD:
        return 'Retenu';
      case PaymentStatus.PARTIALLY_REFUNDED:
        return 'Remboursé partiellement';
      case PaymentStatus.FULLY_REFUNDED:
        return 'Remboursé';
      default:
        return status;
    }
  };

  const getComplianceColor = (status: ComplianceStatus): string => {
    switch (status) {
      case ComplianceStatus.COMPLIANT:
        return 'bg-green-600';
      case ComplianceStatus.NON_COMPLIANT:
        return 'bg-red-600';
      case ComplianceStatus.PENDING_VERIFICATION:
        return 'bg-blue-600';
      case ComplianceStatus.GRACE_PERIOD:
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getComplianceLabel = (status: ComplianceStatus): string => {
    switch (status) {
      case ComplianceStatus.COMPLIANT:
        return 'Conforme';
      case ComplianceStatus.NON_COMPLIANT:
        return 'Non-conforme';
      case ComplianceStatus.PENDING_VERIFICATION:
        return 'Vérification en cours';
      case ComplianceStatus.GRACE_PERIOD:
        return 'Période de grâce';
      default:
        return status;
    }
  };

  const daysUntilRelease = Math.ceil(
    (split.heldPaymentReleaseDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const immediatePaidPercentage = (split.immediateAmount / split.totalAmount) * 100;
  const heldPercentage = (split.heldAmount / split.totalAmount) * 100;
  const afterSalesPercentage = split.afterSalesHoldActive
    ? (split.afterSalesHoldAmount / split.totalAmount) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Facture {split.invoiceId}
            </CardTitle>
            <CardDescription>Job {split.jobId}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{split.totalAmount.toFixed(2)} $</p>
            <p className="text-sm text-gray-600">Montant total</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Payment Split Breakdown */}
        <div className="space-y-3">
          {/* Immediate Payment (75%) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
              <span className="text-sm font-medium">Paiement immédiat (75%)</span>
              <Badge className={getStatusColor(split.immediatePaymentStatus)}>
                {getStatusLabel(split.immediatePaymentStatus)}
              </Badge>
            </div>
            <span className="font-bold text-green-600">{split.immediateAmount.toFixed(2)} $</span>
          </div>

          {split.immediatePaymentAt && (
            <p className="text-xs text-gray-500 ml-5">
              Payé le {split.immediatePaymentAt.toLocaleDateString('fr-CA')}
            </p>
          )}

          {/* Held Payment (25%) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full" />
              <span className="text-sm font-medium">Paiement retenu (25%)</span>
              <Badge className={getStatusColor(split.heldPaymentStatus)}>
                {getStatusLabel(split.heldPaymentStatus)}
              </Badge>
            </div>
            <span className="font-bold text-orange-600">{split.heldAmount.toFixed(2)} $</span>
          </div>

          {/* Release date or conditions */}
          {split.heldPaymentStatus === PaymentStatus.HELD && (
            <div className="ml-5 space-y-1">
              {releaseConditions.canRelease ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Prêt à être libéré</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {daysUntilRelease > 0
                        ? `Libération dans ${daysUntilRelease} jours`
                        : 'En attente de libération'}
                    </span>
                  </div>

                  {releaseConditions.reasons.length > 0 && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                      <p className="font-semibold mb-1">Conditions non remplies:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {releaseConditions.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {split.heldPaymentAt && (
            <p className="text-xs text-gray-500 ml-5">
              Libéré le {split.heldPaymentAt.toLocaleDateString('fr-CA')}
            </p>
          )}

          {/* After-sales hold */}
          {split.afterSalesHoldActive && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Retenue après-vente</span>
                </div>
                <span className="font-bold text-red-600">-{split.afterSalesHoldAmount.toFixed(2)} $</span>
              </div>
              <p className="text-xs text-red-700 ml-6">
                {split.afterSalesClaimIds.length} réclamation(s) active(s)
              </p>
            </>
          )}

          {/* Compliance penalty */}
          {split.compliancePenaltyApplied && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Pénalité non-conformité</span>
                </div>
                <span className="font-bold text-red-600">-{split.penaltyAmount.toFixed(2)} $</span>
              </div>
              {split.penaltyReason && (
                <p className="text-xs text-red-700 ml-6">{split.penaltyReason}</p>
              )}
            </>
          )}
        </div>

        {showDetails && (
          <>
            <Separator />

            {/* Visual Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>Progression du paiement</span>
                <span>{immediatePaidPercentage.toFixed(0)}% payé</span>
              </div>
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-green-600 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${immediatePaidPercentage}%` }}
                >
                  75%
                </div>
                {split.afterSalesHoldActive ? (
                  <>
                    <div
                      className="bg-orange-600 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${heldPercentage - afterSalesPercentage}%` }}
                    >
                      {(heldPercentage - afterSalesPercentage).toFixed(0)}%
                    </div>
                    <div
                      className="bg-red-600 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${afterSalesPercentage}%` }}
                    >
                      {afterSalesPercentage.toFixed(0)}%
                    </div>
                  </>
                ) : (
                  <div
                    className="bg-orange-600 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${heldPercentage}%` }}
                  >
                    25%
                  </div>
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Payé immédiatement</span>
                {split.afterSalesHoldActive ? (
                  <span>Retenu (après-vente)</span>
                ) : (
                  <span>Retenu 30 jours</span>
                )}
              </div>
            </div>

            <Separator />

            {/* Compliance Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Statut de conformité:</span>
                <Badge className={getComplianceColor(split.complianceStatus)}>
                  {getComplianceLabel(split.complianceStatus)}
                </Badge>
              </div>

              {split.complianceStatus === ComplianceStatus.NON_COMPLIANT && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="text-sm text-red-800">
                      <p className="font-semibold mb-1">Pénalité appliquée (10%)</p>
                      <p>
                        Mettez à jour vos documents de conformité pour éviter des pénalités futures.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {split.complianceStatus === ComplianceStatus.GRACE_PERIOD && (
                <div className="bg-orange-50 border border-orange-200 rounded p-3">
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="text-sm text-orange-800">
                      <p className="font-semibold mb-1">Période de grâce active</p>
                      <p>Vous avez 7 jours pour mettre à jour vos documents expirés.</p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Dernière vérification: {split.complianceCheckDate.toLocaleDateString('fr-CA')}
              </p>
            </div>

            <Separator />

            {/* Job completion date */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Job complété:</span>
              </div>
              <span className="font-medium">{split.jobCompletedAt.toLocaleDateString('fr-CA')}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
