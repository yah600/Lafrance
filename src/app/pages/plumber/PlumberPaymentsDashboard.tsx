import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, AlertCircle, FileText, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { PaymentSplitCard } from '../../components/payment/PaymentSplitCard';
import { ComplianceDocumentManager } from '../../components/payment/ComplianceDocumentManager';
import {
  PaymentSplit,
  PaymentStatus,
  ComplianceStatus,
  ComplianceDocument,
  ComplianceDocumentType,
  PaymentSplitSummary,
} from '../../types/payment';
import { useBETAuth } from '../../context/BETAuthContext';
import { isPlumber } from '../../types/betUser';
import { mockDataService } from '../../services/mockDataService';

// Mock payment splits data
const mockPaymentSplits: PaymentSplit[] = [
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
    heldPaymentReleaseDate: new Date('2026-02-20'),
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
    jobCompletedAt: new Date('2026-01-21'),
    immediatePaymentAt: new Date('2026-01-21T15:00:00'),
  },
  {
    id: 'PS-003',
    invoiceId: 'INV-2026-003',
    jobId: 'JOB-458',
    plumberId: 'PLUMBER-001',
    clientId: 'CLIENT-003',
    totalAmount: 350.00,
    immediateAmount: 262.50,
    heldAmount: 87.50,
    immediatePaymentStatus: PaymentStatus.SPLIT_RELEASED,
    heldPaymentStatus: PaymentStatus.FULLY_RELEASED,
    heldPaymentReleaseDate: new Date('2026-01-20'),
    canReleaseHeldPayment: true,
    complianceStatus: ComplianceStatus.COMPLIANT,
    complianceDocuments: [],
    complianceCheckDate: new Date('2025-12-20'),
    compliancePenaltyApplied: false,
    penaltyAmount: 0,
    afterSalesHoldActive: false,
    afterSalesHoldAmount: 0,
    afterSalesClaimIds: [],
    jobCompletedAt: new Date('2025-12-20'),
    immediatePaymentAt: new Date('2025-12-20T14:00:00'),
    heldPaymentAt: new Date('2026-01-20T10:00:00'),
  },
];

// Mock compliance documents
const mockComplianceDocuments: ComplianceDocument[] = [
  {
    type: ComplianceDocumentType.RBQ,
    documentNumber: 'RBQ-8271-3456-01',
    expiryDate: new Date('2027-06-30'),
    status: 'valid',
    lastVerified: new Date('2026-01-15'),
    fileUrl: '/docs/rbq.pdf',
  },
  {
    type: ComplianceDocumentType.CNESST,
    documentNumber: 'CNESST-123456789',
    expiryDate: new Date('2025-12-31'),
    status: 'expired',
    lastVerified: new Date('2026-01-15'),
    fileUrl: '/docs/cnesst.pdf',
  },
  {
    type: ComplianceDocumentType.RQ_TAXES,
    documentNumber: 'RQ-2026-Q1',
    expiryDate: new Date('2026-03-31'),
    status: 'valid',
    lastVerified: new Date('2026-01-15'),
    fileUrl: '/docs/rq.pdf',
  },
  {
    type: ComplianceDocumentType.LIABILITY_INSURANCE,
    documentNumber: 'INS-987654321',
    expiryDate: new Date('2026-02-28'),
    status: 'valid',
    lastVerified: new Date('2026-01-15'),
    fileUrl: '/docs/insurance.pdf',
  },
];

export default function PlumberPaymentsDashboard() {
  const { user } = useBETAuth();
  const navigate = useNavigate();
  const [splits, setSplits] = useState<PaymentSplit[]>([]);
  const [documents, setDocuments] = useState<ComplianceDocument[]>(mockComplianceDocuments);

  useEffect(() => {
    if (user && isPlumber(user)) {
      // Load real payment payouts for this plumber
      const payouts = mockDataService.getPlumberPayouts(user.id);
      // For now, use mock data if no real payouts exist
      setSplits(payouts.length > 0 ? payouts : mockPaymentSplits);
    }
  }, [user]);

  // Calculate summary
  const summary: PaymentSplitSummary = {
    totalEarned: splits.reduce((sum, s) => sum + s.totalAmount, 0),
    totalPaid: splits.reduce(
      (sum, s) =>
        sum +
        (s.immediatePaymentStatus === PaymentStatus.SPLIT_RELEASED ||
        s.immediatePaymentStatus === PaymentStatus.FULLY_RELEASED
          ? s.immediateAmount
          : 0) +
        (s.heldPaymentStatus === PaymentStatus.FULLY_RELEASED ? s.heldAmount : 0),
      0
    ),
    totalPending: splits
      .filter((s) => s.heldPaymentStatus === PaymentStatus.HELD)
      .reduce((sum, s) => sum + s.heldAmount, 0),
    totalHeld: splits
      .filter((s) => s.heldPaymentStatus === PaymentStatus.HELD)
      .reduce((sum, s) => sum + s.heldAmount, 0),
    totalAfterSalesHold: splits
      .filter((s) => s.afterSalesHoldActive)
      .reduce((sum, s) => sum + s.afterSalesHoldAmount, 0),
    totalPenalties: splits.reduce((sum, s) => sum + s.penaltyAmount, 0),
    paymentsAwaitingRelease: splits.filter((s) => s.heldPaymentStatus === PaymentStatus.HELD).length,
  };

  const pendingSplits = splits.filter((s) => s.heldPaymentStatus === PaymentStatus.HELD);
  const completedSplits = splits.filter((s) => s.heldPaymentStatus === PaymentStatus.FULLY_RELEASED);

  const handleDocumentUpload = (
    type: ComplianceDocumentType,
    file: File,
    documentNumber: string,
    expiryDate: Date
  ) => {
    console.log('Uploading document:', { type, file, documentNumber, expiryDate });

    // Simulate upload
    const newDoc: ComplianceDocument = {
      type,
      documentNumber,
      expiryDate,
      status: 'valid',
      lastVerified: new Date(),
      fileUrl: `/docs/${type}-${Date.now()}.pdf`,
    };

    // Update or add document
    const existingIndex = documents.findIndex((d) => d.type === type);
    if (existingIndex >= 0) {
      const updated = [...documents];
      updated[existingIndex] = newDoc;
      setDocuments(updated);
    } else {
      setDocuments([...documents, newDoc]);
    }

    // In production: Upload to backend API
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes paiements</h1>
          <p className="text-gray-600">Gérez vos paiements et documents de conformité</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Earned */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total gagné</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {summary.totalEarned.toFixed(2)} $
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Total Paid */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total payé</p>
                  <p className="text-2xl font-bold text-green-600">
                    {summary.totalPaid.toFixed(2)} $
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Total Pending */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">En attente</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {summary.totalPending.toFixed(2)} $
                  </p>
                  <p className="text-xs text-gray-500">{summary.paymentsAwaitingRelease} paiements</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          {/* Total Penalties */}
          {summary.totalPenalties > 0 && (
            <Card className="border-red-300 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-800 mb-1">Pénalités</p>
                    <p className="text-2xl font-bold text-red-600">
                      {summary.totalPenalties.toFixed(2)} $
                    </p>
                    <p className="text-xs text-red-700">Non-conformité</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* After-sales Hold */}
          {summary.totalAfterSalesHold > 0 && (
            <Card className="border-amber-300 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-800 mb-1">Retenue après-vente</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {summary.totalAfterSalesHold.toFixed(2)} $
                    </p>
                    <p className="text-xs text-amber-700">Réclamations actives</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Warning for non-compliance */}
        {summary.totalPenalties > 0 && (
          <Card className="mb-6 border-red-300 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Pénalité de non-conformité</h3>
                  <p className="text-sm text-red-800 mb-2">
                    Des pénalités de {summary.totalPenalties.toFixed(2)} $ ont été appliquées en raison de
                    documents expirés ou manquants.
                  </p>
                  <p className="text-sm text-red-800">
                    Mettez à jour vos documents de conformité dans l'onglet "Conformité" pour éviter
                    d'autres pénalités.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              En attente ({pendingSplits.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Complétés ({completedSplits.length})
            </TabsTrigger>
            <TabsTrigger value="compliance">
              <FileText className="h-4 w-4 mr-1" />
              Conformité
            </TabsTrigger>
          </TabsList>

          {/* Pending Payments */}
          <TabsContent value="pending" className="mt-6">
            {pendingSplits.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">Aucun paiement en attente</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingSplits.map((split) => (
                  <PaymentSplitCard key={split.id} split={split} showDetails={true} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Completed Payments */}
          <TabsContent value="completed" className="mt-6">
            {completedSplits.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">Aucun paiement complété</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedSplits.map((split) => (
                  <PaymentSplitCard key={split.id} split={split} showDetails={false} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Compliance Documents */}
          <TabsContent value="compliance" className="mt-6">
            <ComplianceDocumentManager documents={documents} onUpload={handleDocumentUpload} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
