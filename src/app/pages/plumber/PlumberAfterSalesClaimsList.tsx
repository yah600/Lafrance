import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle, ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { AfterSalesPriority, AfterSalesClaimType } from '../../types/aftersales';
import { useBETAuth } from '../../context/BETAuthContext';
import { isPlumber } from '../../types/betUser';
import { mockDataService } from '../../services/mockDataService';

// Mock claims data
const mockClaims = [
  {
    id: 'CLAIM-001',
    invoiceId: 'INV-2026-001',
    jobId: 'JOB-456',
    type: AfterSalesClaimType.WARRANTY,
    priority: AfterSalesPriority.URGENT,
    description: 'La fuite est revenue après 2 jours. L\'eau coule encore sous l\'évier.',
    photos: [{ id: '1' }, { id: '2' }],
    createdAt: new Date('2026-01-22T10:30:00'),
    status: 'pending',
    holdAmount: 71.86,
    clientName: 'Jean Tremblay',
    address: '1234 Rue Principale, Montréal, QC H1A 1A1',
  },
  {
    id: 'CLAIM-002',
    invoiceId: 'INV-2026-002',
    jobId: 'JOB-457',
    type: AfterSalesClaimType.DAMAGE,
    priority: AfterSalesPriority.IMPORTANT,
    description: 'Un tuyau a été endommagé pendant les travaux, causant une fuite dans le plafond du sous-sol.',
    photos: [{ id: '1' }, { id: '2' }, { id: '3' }],
    createdAt: new Date('2026-01-21T14:00:00'),
    status: 'pending',
    holdAmount: 125.00,
    clientName: 'Marie Dubois',
    address: '5678 Avenue du Parc, Montréal, QC H2V 4E2',
  },
  {
    id: 'CLAIM-003',
    invoiceId: 'INV-2026-003',
    jobId: 'JOB-458',
    type: AfterSalesClaimType.DISSATISFACTION,
    priority: AfterSalesPriority.AESTHETIC,
    description: 'Le travail est fonctionnel mais l\'esthétique n\'est pas satisfaisante. Traces sur le mur.',
    photos: [{ id: '1' }],
    createdAt: new Date('2026-01-20T09:00:00'),
    status: 'accepted',
    holdAmount: 87.50,
    clientName: 'Pierre Gagnon',
    address: '9012 Rue Saint-Denis, Montréal, QC H2X 3K8',
    appointmentDate: new Date('2026-01-25T14:00:00'),
  },
  {
    id: 'CLAIM-004',
    invoiceId: 'INV-2026-004',
    jobId: 'JOB-459',
    type: AfterSalesClaimType.WARRANTY,
    priority: AfterSalesPriority.IMPORTANT,
    description: 'Le robinet installé fuit légèrement.',
    photos: [{ id: '1' }, { id: '2' }],
    createdAt: new Date('2026-01-19T16:30:00'),
    status: 'disputed',
    holdAmount: 62.50,
    clientName: 'Sophie Leblanc',
    address: '3456 Boulevard René-Lévesque, Montréal, QC H3B 1Y8',
  },
];

export default function PlumberAfterSalesClaimsList() {
  const { user } = useBETAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState<any[]>([]);

  useEffect(() => {
    if (user && isPlumber(user)) {
      // Load claims for this plumber from mockDataService
      const plumberClaims = mockDataService.getClaimsByPlumber(user.id);
      setClaims(plumberClaims.length > 0 ? plumberClaims : mockClaims); // Fallback to mock if empty
    }
  }, [user]);

  const pendingClaims = claims.filter((c) => c.status === 'pending' || c.status === 'submitted');
  const acceptedClaims = claims.filter((c) => c.status === 'accepted' || c.status === 'awaiting_client_selection');
  const disputedClaims = claims.filter((c) => c.status === 'disputed');
  const urgentClaims = pendingClaims.filter((c) => c.priority === AfterSalesPriority.URGENT || c.priority === 'urgent');

  const totalHoldAmount = claims
    .filter((c) => c.status !== 'resolved' && c.status !== 'closed')
    .reduce((sum, c) => sum + (c.holdAmount || 0), 0);

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

  const getPriorityLabel = (priority: AfterSalesPriority): string => {
    switch (priority) {
      case AfterSalesPriority.URGENT:
        return 'Urgent (1h)';
      case AfterSalesPriority.IMPORTANT:
        return 'Important (48h)';
      case AfterSalesPriority.AESTHETIC:
        return 'Esthétique (7j)';
      default:
        return priority;
    }
  };

  const getDeadline = (claim: any) => {
    const created = new Date(claim.createdAt);
    switch (claim.priority) {
      case AfterSalesPriority.URGENT:
        return new Date(created.getTime() + 60 * 60 * 1000);
      case AfterSalesPriority.IMPORTANT:
        return new Date(created.getTime() + 48 * 60 * 60 * 1000);
      case AfterSalesPriority.AESTHETIC:
        return new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000);
      default:
        return new Date();
    }
  };

  const getTimeLeft = (claim: any) => {
    const now = new Date();
    const deadline = getDeadline(claim);
    const difference = deadline.getTime() - now.getTime();

    if (difference <= 0) return 'Délai dépassé';

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 24) {
      return `${hours}h ${minutes}m`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}j ${hours % 24}h`;
    }
  };

  const handleClaimClick = (claimId: string) => {
    navigate(`/plumber/aftersales/${claimId}`);
  };

  const renderClaimCard = (claim: any) => {
    const isOverdue = getTimeLeft(claim) === 'Délai dépassé' && claim.status === 'pending';

    return (
      <Card
        key={claim.id}
        className={`cursor-pointer hover:shadow-md transition-shadow ${
          isOverdue ? 'border-red-300 bg-red-50' : ''
        }`}
        onClick={() => handleClaimClick(claim.id)}
      >
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{claim.clientName}</h3>
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
              <p className="text-sm text-gray-600">{claim.address}</p>
              <p className="text-xs text-gray-500 mt-1">Réclamation {claim.id}</p>
            </div>

            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{claim.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                className={
                  claim.priority === AfterSalesPriority.URGENT
                    ? 'bg-red-600'
                    : claim.priority === AfterSalesPriority.IMPORTANT
                    ? 'bg-orange-600'
                    : 'bg-yellow-600'
                }
              >
                {getPriorityLabel(claim.priority)}
              </Badge>

              {claim.status === 'pending' && (
                <Badge variant={isOverdue ? 'destructive' : 'outline'}>
                  <Clock className="h-3 w-3 mr-1" />
                  {getTimeLeft(claim)}
                </Badge>
              )}

              {claim.status === 'accepted' && (
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Acceptée
                </Badge>
              )}

              {claim.status === 'disputed' && (
                <Badge className="bg-blue-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  En arbitrage
                </Badge>
              )}
            </div>

            <span className="text-sm font-bold text-orange-600">
              -{claim.holdAmount.toFixed(2)} $
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service après-vente</h1>
          <p className="text-gray-600">Gérez vos réclamations et garanties</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Urgent Claims */}
          <Card className="border-red-300 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-800 mb-1">Réclamations urgentes</p>
                  <p className="text-3xl font-bold text-red-900">{urgentClaims.length}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
            </CardContent>
          </Card>

          {/* Pending Claims */}
          <Card className="border-orange-300 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-800 mb-1">En attente de réponse</p>
                  <p className="text-3xl font-bold text-orange-900">{pendingClaims.length}</p>
                </div>
                <Clock className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          {/* Total Hold */}
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-800 mb-1">Montant total retenu</p>
                  <p className="text-3xl font-bold text-amber-900">
                    {totalHoldAmount.toFixed(2)} $
                  </p>
                </div>
                <AlertCircle className="h-10 w-10 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Notice */}
        {urgentClaims.length > 0 && (
          <Card className="mb-6 border-red-300 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 animate-pulse" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    {urgentClaims.length} réclamation{urgentClaims.length > 1 ? 's' : ''} urgente
                    {urgentClaims.length > 1 ? 's' : ''}
                  </h3>
                  <p className="text-sm text-red-800">
                    Ces réclamations nécessitent une réponse dans l'heure. Le non-respect du délai
                    entraînera une escalade automatique à un administrateur.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Claims Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              En attente ({pendingClaims.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Acceptées ({acceptedClaims.length})
            </TabsTrigger>
            <TabsTrigger value="disputed">
              En arbitrage ({disputedClaims.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingClaims.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">Aucune réclamation en attente</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingClaims.map((claim) => renderClaimCard(claim))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="mt-6">
            {acceptedClaims.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">Aucune réclamation acceptée</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {acceptedClaims.map((claim) => renderClaimCard(claim))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="disputed" className="mt-6">
            {disputedClaims.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <XCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">Aucune réclamation en arbitrage</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {disputedClaims.map((claim) => renderClaimCard(claim))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
