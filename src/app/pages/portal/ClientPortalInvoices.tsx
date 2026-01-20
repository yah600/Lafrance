import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, DollarSign, CheckCircle2, Clock, AlertCircle, Download, Eye,
  Filter, Search, FileText, Calendar, TrendingUp, Printer, Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  description: string;
  jobId: string;
  items?: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal?: number;
  tax?: number;
  paidAmount?: number;
  paymentMethod?: string;
  paymentDate?: string;
}

export default function ClientPortalInvoices() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Mock data - would come from API in production
  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-2025-001',
      date: '2025-12-01',
      dueDate: '2025-12-15',
      amount: 350.00,
      status: 'paid',
      description: 'Réparation fuite robinet cuisine',
      jobId: 'REQ-2025-001',
      subtotal: 305.22,
      tax: 44.78,
      paidAmount: 350.00,
      paymentMethod: 'Carte de crédit',
      paymentDate: '2025-12-05',
      items: [
        { description: 'Main d\'oeuvre - Réparation robinet', quantity: 2, unitPrice: 75.00, total: 150.00 },
        { description: 'Cartouche de robinet', quantity: 1, unitPrice: 45.00, total: 45.00 },
        { description: 'Ruban de plombier', quantity: 2, unitPrice: 5.11, total: 10.22 },
        { description: 'Déplacement', quantity: 1, unitPrice: 100.00, total: 100.00 },
      ],
    },
    {
      id: 'INV-2025-002',
      date: '2025-12-15',
      dueDate: '2025-12-25',
      amount: 850.00,
      status: 'pending',
      description: 'Installation chauffe-eau électrique',
      jobId: 'REQ-2025-002',
      subtotal: 741.59,
      tax: 108.41,
      items: [
        { description: 'Chauffe-eau 40 gallons', quantity: 1, unitPrice: 450.00, total: 450.00 },
        { description: 'Main d\'oeuvre - Installation', quantity: 3, unitPrice: 85.00, total: 255.00 },
        { description: 'Tuyauterie et raccords', quantity: 1, unitPrice: 36.59, total: 36.59 },
      ],
    },
    {
      id: 'INV-2025-003',
      date: '2025-11-20',
      dueDate: '2025-12-05',
      amount: 275.00,
      status: 'overdue',
      description: 'Débouchage drain principal',
      jobId: 'REQ-2025-003',
      subtotal: 239.82,
      tax: 35.18,
      items: [
        { description: 'Débouchage avec équipement spécialisé', quantity: 1, unitPrice: 175.00, total: 175.00 },
        { description: 'Inspection caméra', quantity: 1, unitPrice: 64.82, total: 64.82 },
      ],
    },
    {
      id: 'INV-2025-004',
      date: '2025-12-10',
      dueDate: '2025-12-20',
      amount: 520.00,
      status: 'partial',
      description: 'Réparation fuite sous-sol',
      jobId: 'REQ-2025-004',
      subtotal: 453.54,
      tax: 66.46,
      paidAmount: 260.00,
      items: [
        { description: 'Réparation tuyau principal', quantity: 1, unitPrice: 250.00, total: 250.00 },
        { description: 'Main d\'oeuvre', quantity: 2.5, unitPrice: 75.00, total: 187.50 },
        { description: 'Matériaux divers', quantity: 1, unitPrice: 16.04, total: 16.04 },
      ],
    },
  ]);

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Payée
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            En retard
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <DollarSign className="h-3 w-3 mr-1" />
            Partiellement payée
          </Badge>
        );
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.jobId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getInvoicesByStatus = (status: Invoice['status'] | 'all') => {
    if (status === 'all') return filteredInvoices;
    return filteredInvoices.filter(i => i.status === status);
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Téléchargement de la facture ${invoiceId}...`);
  };

  const handlePrintInvoice = (invoiceId: string) => {
    toast.info(`Impression de la facture ${invoiceId}...`);
  };

  const handleEmailInvoice = (invoiceId: string) => {
    toast.success(`Facture ${invoiceId} envoyée par email`);
  };

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'pending' || i.status === 'overdue' || i.status === 'partial').reduce((sum, i) => sum + (i.amount - (i.paidAmount || 0)), 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes factures</h1>
        <p className="text-gray-600 mt-1">Gérez et payez vos factures</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total factures</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{invoices.length}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solde à payer</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">${totalPending.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En retard</p>
                <p className="text-2xl font-bold text-red-600 mt-1">${totalOverdue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total payé</p>
                <p className="text-2xl font-bold text-green-600 mt-1">${totalPaid.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par numéro, description ou demande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="paid">Payées</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
                <SelectItem value="partial">Partiellement payées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des factures</CardTitle>
          <CardDescription>
            {filteredInvoices.length} facture{filteredInvoices.length !== 1 ? 's' : ''} trouvée{filteredInvoices.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="all">
                Toutes ({filteredInvoices.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                En attente ({getInvoicesByStatus('pending').length})
              </TabsTrigger>
              <TabsTrigger value="overdue">
                En retard ({getInvoicesByStatus('overdue').length})
              </TabsTrigger>
              <TabsTrigger value="partial">
                Partielles ({getInvoicesByStatus('partial').length})
              </TabsTrigger>
              <TabsTrigger value="paid">
                Payées ({getInvoicesByStatus('paid').length})
              </TabsTrigger>
            </TabsList>

            {['all', 'pending', 'overdue', 'partial', 'paid'].map(status => (
              <TabsContent key={status} value={status} className="space-y-4">
                {getInvoicesByStatus(status as Invoice['status'] | 'all').length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune facture dans cette catégorie</p>
                  </div>
                ) : (
                  getInvoicesByStatus(status as Invoice['status'] | 'all').map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{invoice.id}</span>
                          {getStatusBadge(invoice.status)}
                          <Badge variant="outline" className="text-xs">
                            {invoice.jobId}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{invoice.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Émise: {new Date(invoice.date).toLocaleDateString('fr-CA')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-CA')}
                          </span>
                          {invoice.paymentDate && (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Payée: {new Date(invoice.paymentDate).toLocaleDateString('fr-CA')}
                            </span>
                          )}
                        </div>
                        {invoice.status === 'partial' && invoice.paidAmount && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              Payé: ${invoice.paidAmount.toFixed(2)} / ${invoice.amount.toFixed(2)}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                          <p className="text-2xl font-bold text-gray-900">${invoice.amount.toFixed(2)}</p>
                          {invoice.status === 'partial' && invoice.paidAmount && (
                            <p className="text-sm text-red-600">
                              Reste: ${(invoice.amount - invoice.paidAmount).toFixed(2)}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          {(invoice.status === 'pending' || invoice.status === 'overdue' || invoice.status === 'partial') && (
                            <Button
                              size="sm"
                              onClick={() => navigate(`/client-portal/invoices/${invoice.id}/pay`)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              Payer
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Invoice Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la facture</DialogTitle>
            <DialogDescription>
              Informations complètes et détaillées de la facture
            </DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-2xl">{selectedInvoice.id}</h3>
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                  <p className="text-gray-600">{selectedInvoice.description}</p>
                  <p className="text-sm text-gray-500 mt-1">Demande: {selectedInvoice.jobId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Montant total</p>
                  <p className="text-3xl font-bold text-gray-900">${selectedInvoice.amount.toFixed(2)}</p>
                </div>
              </div>

              <Separator />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Date d'émission</p>
                  <p className="text-gray-900">{new Date(selectedInvoice.date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Date d'échéance</p>
                  <p className="text-gray-900">{new Date(selectedInvoice.dueDate).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                {selectedInvoice.paymentDate && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Date de paiement</p>
                      <p className="text-gray-900">{new Date(selectedInvoice.paymentDate).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Méthode de paiement</p>
                      <p className="text-gray-900">{selectedInvoice.paymentMethod}</p>
                    </div>
                  </>
                )}
              </div>

              <Separator />

              {/* Items */}
              {selectedInvoice.items && (
                <>
                  <div>
                    <h4 className="font-semibold mb-3">Détails des services</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3 text-sm font-medium text-gray-600">Description</th>
                            <th className="text-right p-3 text-sm font-medium text-gray-600">Qté</th>
                            <th className="text-right p-3 text-sm font-medium text-gray-600">Prix unitaire</th>
                            <th className="text-right p-3 text-sm font-medium text-gray-600">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.items.map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3 text-sm text-gray-900">{item.description}</td>
                              <td className="p-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                              <td className="p-3 text-sm text-gray-900 text-right">${item.unitPrice.toFixed(2)}</td>
                              <td className="p-3 text-sm font-medium text-gray-900 text-right">${item.total.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sous-total:</span>
                        <span className="font-medium">${selectedInvoice.subtotal?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">TPS/TVQ (14.68%):</span>
                        <span className="font-medium">${selectedInvoice.tax?.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-lg">${selectedInvoice.amount.toFixed(2)}</span>
                      </div>
                      {selectedInvoice.paidAmount && (
                        <>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Montant payé:</span>
                            <span className="font-medium">-${selectedInvoice.paidAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span className="font-semibold">Solde dû:</span>
                            <span className="font-bold text-lg">${(selectedInvoice.amount - selectedInvoice.paidAmount).toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadInvoice(selectedInvoice.id)}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePrintInvoice(selectedInvoice.id)}
                  className="flex-1"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleEmailInvoice(selectedInvoice.id)}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer par email
                </Button>
              </div>

              {(selectedInvoice.status === 'pending' || selectedInvoice.status === 'overdue' || selectedInvoice.status === 'partial') && (
                <>
                  <Separator />
                  <Button
                    onClick={() => {
                      setIsDetailsOpen(false);
                      navigate(`/client-portal/invoices/${selectedInvoice.id}/pay`);
                    }}
                    className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                    size="lg"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Procéder au paiement
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}