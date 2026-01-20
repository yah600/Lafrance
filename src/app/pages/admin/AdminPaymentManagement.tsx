import React, { useState } from 'react';
import { DollarSign, CheckCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';
import {
  PaymentSplit,
  PaymentStatus,
  ComplianceStatus,
  checkPaymentReleaseConditions,
} from '../../types/payment';

// Mock data - same as plumber dashboard but for all plumbers
const mockAllPaymentSplits: PaymentSplit[] = [
  {
    id: 'PS-001',
    invoiceId: 'INV-2026-001',
    jobId: 'JOB-456',
    plumberId: 'PLUMBER-001',
    clientId: 'CLIENT-001',
    totalAmount: 287.44,
    immediateAmount: 215.58,
    heldAmount: 71.86,
    immediatePaymentStatus: PaymentStatus.SPLIT_RELEASED,
    heldPaymentStatus: PaymentStatus.HELD,
    heldPaymentReleaseDate: new Date('2026-02-19'),
    canReleaseHeldPayment: false,
    complianceStatus: ComplianceStatus.COMPLIANT,
    complianceDocuments: [],
    complianceCheckDate: new Date('2026-01-20'),
    compliancePenaltyApplied: false,
    penaltyAmount: 0,
    afterSalesHoldActive: false,
    afterSalesHoldAmount: 0,
    afterSalesClaimIds: [],
    jobCompletedAt: new Date('2026-01-20'),
    immediatePaymentAt: new Date('2026-01-20T14:00:00'),
  },
  {
    id: 'PS-002',
    invoiceId: 'INV-2026-002',
    jobId: 'JOB-457',
    plumberId: 'PLUMBER-001',
    clientId: 'CLIENT-002',
    totalAmount: 500.00,
    immediateAmount: 375.00,
    heldAmount: 125.00,
    immediatePaymentStatus: PaymentStatus.SPLIT_RELEASED,
    heldPaymentStatus: PaymentStatus.HELD,
    heldPaymentReleaseDate: new Date('2026-01-20'), // Ready to release (past due)
    canReleaseHeldPayment: false,
    complianceStatus: ComplianceStatus.NON_COMPLIANT,
    complianceDocuments: [],
    complianceCheckDate: new Date('2026-01-21'),
    compliancePenaltyApplied: true,
    penaltyAmount: 12.50,
    penaltyReason: 'Attestation CNESST expirée',
    afterSalesHoldActive: true,
    afterSalesHoldAmount: 125.00,
    afterSalesClaimIds: ['CLAIM-002'],
    jobCompletedAt: new Date('2025-12-21'),
    immediatePaymentAt: new Date('2025-12-21T15:00:00'),
  },
  {
    id: 'PS-004',
    invoiceId: 'INV-2026-004',
    jobId: 'JOB-459',
    plumberId: 'PLUMBER-002',
    clientId: 'CLIENT-004',
    totalAmount: 425.00,
    immediateAmount: 318.75,
    heldAmount: 106.25,
    immediatePaymentStatus: PaymentStatus.SPLIT_RELEASED,
    heldPaymentStatus: PaymentStatus.HELD,
    heldPaymentReleaseDate: new Date('2026-01-19'), // Ready to release
    canReleaseHeldPayment: true,
    complianceStatus: ComplianceStatus.COMPLIANT,
    complianceDocuments: [],
    complianceCheckDate: new Date('2026-01-19'),
    compliancePenaltyApplied: false,
    penaltyAmount: 0,
    afterSalesHoldActive: false,
    afterSalesHoldAmount: 0,
    afterSalesClaimIds: [],
    jobCompletedAt: new Date('2025-12-19'),
    immediatePaymentAt: new Date('2025-12-19T16:00:00'),
  },
];

// Mock plumber names
const plumberNames: Record<string, string> = {
  'PLUMBER-001': 'Michel Lacoste',
  'PLUMBER-002': 'Jean Tremblay',
};

export default function AdminPaymentManagement() {
  const [splits, setSplits] = useState<PaymentSplit[]>(mockAllPaymentSplits);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlumber, setSelectedPlumber] = useState<string | null>(null);

  const handleReleasePayment = async (splitId: string) => {
    const split = splits.find((s) => s.id === splitId);
    if (!split) return;

    const conditions = checkPaymentReleaseConditions(split);

    if (!conditions.canRelease) {
      toast.error('Impossible de libérer ce paiement', {
        description: conditions.reasons.join(', '),
      });
      return;
    }

    // Simulate payment release
    toast.info('Libération du paiement en cours...');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSplits(
      splits.map((s) =>
        s.id === splitId
          ? {
              ...s,
              heldPaymentStatus: PaymentStatus.FULLY_RELEASED,
              heldPaymentAt: new Date(),
            }
          : s
      )
    );

    toast.success('Paiement libéré avec succès', {
      description: `${split.heldAmount.toFixed(2)} $ transféré à ${plumberNames[split.plumberId]}`,
    });

    // In production: Call backend API to process payment via Stripe
  };

  const filteredSplits = splits.filter((split) => {
    const matchesSearch =
      split.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      split.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plumberNames[split.plumberId]?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlumber = !selectedPlumber || split.plumberId === selectedPlumber;

    return matchesSearch && matchesPlumber;
  });

  const pendingSplits = filteredSplits.filter((s) => s.heldPaymentStatus === PaymentStatus.HELD);
  const releasableSplits = pendingSplits.filter((s) => {
    const conditions = checkPaymentReleaseConditions(s);
    return conditions.canRelease;
  });
  const blockedSplits = pendingSplits.filter((s) => {
    const conditions = checkPaymentReleaseConditions(s);
    return !conditions.canRelease;
  });
  const completedSplits = filteredSplits.filter(
    (s) => s.heldPaymentStatus === PaymentStatus.FULLY_RELEASED
  );

  const totalPendingAmount = pendingSplits.reduce((sum, s) => sum + s.heldAmount, 0);
  const totalReleasableAmount = releasableSplits.reduce((sum, s) => sum + s.heldAmount, 0);
  const totalPenalties = splits.reduce((sum, s) => sum + s.penaltyAmount, 0);

  const renderPaymentRow = (split: PaymentSplit) => {
    const conditions = checkPaymentReleaseConditions(split);
    const plumberName = plumberNames[split.plumberId] || split.plumberId;

    return (
      <Card key={split.id} className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{plumberName}</h3>
                <Badge variant="outline">{split.invoiceId}</Badge>
                <Badge
                  className={
                    split.complianceStatus === ComplianceStatus.COMPLIANT
                      ? 'bg-green-600'
                      : 'bg-red-600'
                  }
                >
                  {split.complianceStatus === ComplianceStatus.COMPLIANT
                    ? 'Conforme'
                    : 'Non-conforme'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                <div>
                  <span className="text-gray-600">Montant retenu:</span>
                  <p className="font-bold">{split.heldAmount.toFixed(2)} $</p>
                </div>
                <div>
                  <span className="text-gray-600">Date de libération:</span>
                  <p className="font-medium">
                    {split.heldPaymentReleaseDate.toLocaleDateString('fr-CA')}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Job complété:</span>
                  <p className="font-medium">
                    {split.jobCompletedAt.toLocaleDateString('fr-CA')}
                  </p>
                </div>
                {split.compliancePenaltyApplied && (
                  <div>
                    <span className="text-gray-600">Pénalité:</span>
                    <p className="font-bold text-red-600">-{split.penaltyAmount.toFixed(2)} $</p>
                  </div>
                )}
              </div>

              {!conditions.canRelease && conditions.reasons.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm">
                  <p className="font-semibold text-amber-900 mb-1">Blocages:</p>
                  <ul className="list-disc list-inside text-amber-800">
                    {conditions.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {split.afterSalesHoldActive && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-sm mt-2">
                  <AlertCircle className="h-4 w-4 inline mr-1 text-red-600" />
                  <span className="font-semibold text-red-900">Réclamation après-vente active</span>
                  <p className="text-red-800 mt-1">
                    {split.afterSalesClaimIds.length} réclamation(s) doit être résolue avant libération
                  </p>
                </div>
              )}
            </div>

            <div className="ml-4">
              {split.heldPaymentStatus === PaymentStatus.HELD ? (
                <Button
                  onClick={() => handleReleasePayment(split.id)}
                  disabled={!conditions.canRelease}
                  className={
                    conditions.canRelease
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'opacity-50 cursor-not-allowed'
                  }
                >
                  {conditions.canRelease ? 'Libérer le paiement' : 'Bloqué'}
                </Button>
              ) : (
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Libéré
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des paiements</h1>
          <p className="text-gray-600">Gérez les paiements retenus et la conformité des plombiers</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Paiements en attente</p>
                  <p className="text-2xl font-bold">{pendingSplits.length}</p>
                  <p className="text-xs text-gray-500">{totalPendingAmount.toFixed(2)} $</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-300 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800 mb-1">Prêts à libérer</p>
                  <p className="text-2xl font-bold text-green-900">{releasableSplits.length}</p>
                  <p className="text-xs text-green-700">{totalReleasableAmount.toFixed(2)} $</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-800 mb-1">Bloqués</p>
                  <p className="text-2xl font-bold text-amber-900">{blockedSplits.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pénalités totales</p>
                  <p className="text-2xl font-bold text-red-600">{totalPenalties.toFixed(2)} $</p>
                </div>
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher par facture, job, ou plombier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="releasable" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="releasable">
              Prêts à libérer ({releasableSplits.length})
            </TabsTrigger>
            <TabsTrigger value="blocked">Bloqués ({blockedSplits.length})</TabsTrigger>
            <TabsTrigger value="completed">Complétés ({completedSplits.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="releasable" className="mt-6">
            {releasableSplits.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">Aucun paiement prêt à être libéré</p>
                </CardContent>
              </Card>
            ) : (
              <div>{releasableSplits.map(renderPaymentRow)}</div>
            )}
          </TabsContent>

          <TabsContent value="blocked" className="mt-6">
            {blockedSplits.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">Aucun paiement bloqué</p>
                </CardContent>
              </Card>
            ) : (
              <div>{blockedSplits.map(renderPaymentRow)}</div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedSplits.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">Aucun paiement complété</p>
                </CardContent>
              </Card>
            ) : (
              <div>{completedSplits.map(renderPaymentRow)}</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
