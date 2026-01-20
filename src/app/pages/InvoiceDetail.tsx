import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Send, Printer, Edit, Plus, Trash2, DollarSign, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import { WarrantyManagement } from '../components/compliance/WarrantyManagement';
import { CollectionWorkflow } from '../components/compliance/CollectionWorkflow';

// Mock invoice data
const mockInvoice = {
  id: 'INV-2025-001',
  jobId: 'job-1',
  clientId: 'client-1',
  client: {
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+1 514-555-0123',
    address: '123 Rue Principale, Montréal, QC H2X 1Y5'
  },
  status: 'sent' as const,
  issueDate: '2025-12-10',
  dueDate: '2025-12-30',
  paidDate: undefined,
  items: [
    { id: '1', description: 'Débouchage de drain principal', quantity: 1, unitPrice: 150, amount: 150 },
    { id: '2', description: 'Inspection caméra', quantity: 1, unitPrice: 100, amount: 100 },
    { id: '3', description: 'Déplacement', quantity: 1, unitPrice: 50, amount: 50 }
  ],
  subtotal: 300,
  tps: 15,
  tvq: 29.93,
  total: 344.93,
  notes: 'Merci pour votre confiance. Paiement dû dans 20 jours.',
  terms: 'Paiement par virement Interac, chèque ou comptant.'
};

const statusConfig = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
  sent: { label: 'Envoyée', color: 'bg-blue-100 text-blue-800' },
  viewed: { label: 'Vue', color: 'bg-purple-100 text-purple-800' },
  paid: { label: 'Payée', color: 'bg-green-100 text-green-800' },
  overdue: { label: 'En retard', color: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Annulée', color: 'bg-gray-100 text-gray-800' }
};

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(mockInvoice);
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSendInvoice = () => {
    toast.success('Facture envoyée au client par email');
    setInvoice(prev => ({ ...prev, status: 'sent' }));
  };

  const handleMarkPaid = () => {
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    setInvoice(prev => ({ 
      ...prev, 
      status: 'paid',
      paidDate: new Date().toISOString().split('T')[0]
    }));
    setShowPaymentModal(false);
    toast.success('Paiement enregistré avec succès');
  };

  const handleDownloadPDF = () => {
    toast.success('Téléchargement du PDF en cours...');
  };

  const handlePrint = () => {
    window.print();
  };

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: 'Nouveau item',
      quantity: 1,
      unitPrice: 0,
      amount: 0
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setInvoice(prev => {
      const items = prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.amount = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      });
      
      const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
      const tps = subtotal * 0.05;
      const tvq = subtotal * 0.09975;
      const total = subtotal + tps + tvq;
      
      return { ...prev, items, subtotal, tps, tvq, total };
    });
  };

  const removeItem = (id: string) => {
    setInvoice(prev => {
      const items = prev.items.filter(item => item.id !== id);
      const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
      const tps = subtotal * 0.05;
      const tvq = subtotal * 0.09975;
      const total = subtotal + tps + tvq;
      
      return { ...prev, items, subtotal, tps, tvq, total };
    });
  };

  const status = statusConfig[invoice.status];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/invoices')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Facture #{invoice.id}</h1>
          <p className="text-gray-600 mt-1">Émise le {new Date(invoice.issueDate).toLocaleDateString('fr-CA')}</p>
        </div>
        <Badge className={status.color}>{status.label}</Badge>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownloadPDF}>
            <Download className="h-5 w-5" />
          </Button>
          {invoice.status === 'draft' && (
            <Button onClick={handleSendInvoice} className="bg-[var(--primary)]">
              <Send className="h-5 w-5 mr-2" />
              Envoyer
            </Button>
          )}
          {(invoice.status === 'sent' || invoice.status === 'viewed') && (
            <Button onClick={handleMarkPaid} className="bg-green-600 hover:bg-green-700">
              <Check className="h-5 w-5 mr-2" />
              Marquer payée
            </Button>
          )}
          {invoice.status !== 'paid' && (
            <Button 
              variant={isEditing ? 'default' : 'outline'}
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-5 w-5 mr-2" />
              {isEditing ? 'Enregistrer' : 'Modifier'}
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Invoice */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardContent className="p-8">
              {/* Company & Client Info */}
              <div className="flex justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">Groupe G. Lafrance</h2>
                  <p className="text-sm text-gray-600">
                    636 Grand Bernier Nord<br />
                    St-Jean-Sur-Richelieu, QC J3B 0E6<br />
                    +1 514-555-0000<br />
                    info@plomberie.com<br />
                    TPS: 123456789 RT0001<br />
                    TVQ: 1234567890 TQ0001
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg mb-2">FACTURE</h3>
                  <p className="text-sm">
                    <strong>N°:</strong> {invoice.id}<br />
                    <strong>Date:</strong> {new Date(invoice.issueDate).toLocaleDateString('fr-CA')}<br />
                    <strong>Échéance:</strong> {new Date(invoice.dueDate).toLocaleDateString('fr-CA')}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Client Details */}
              <div className="mb-8">
                <h3 className="font-semibold mb-2">Facturé à:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">{invoice.client.name}</p>
                  <p className="text-sm text-gray-600">{invoice.client.address}</p>
                  <p className="text-sm text-gray-600">{invoice.client.phone}</p>
                  <p className="text-sm text-gray-600">{invoice.client.email}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3">Description</th>
                      <th className="text-center py-3 w-24">Qté</th>
                      <th className="text-right py-3 w-32">Prix unit.</th>
                      <th className="text-right py-3 w-32">Montant</th>
                      {isEditing && <th className="w-12"></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3">
                          {isEditing ? (
                            <Input 
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            />
                          ) : (
                            <span>{item.description}</span>
                          )}
                        </td>
                        <td className="text-center py-3">
                          {isEditing ? (
                            <Input 
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                              className="w-20"
                            />
                          ) : (
                            <span>{item.quantity}</span>
                          )}
                        </td>
                        <td className="text-right py-3">
                          {isEditing ? (
                            <Input 
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                              className="w-28"
                            />
                          ) : (
                            <span>${item.unitPrice.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="text-right py-3 font-semibold">
                          ${item.amount.toFixed(2)}
                        </td>
                        {isEditing && (
                          <td className="text-center py-3">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {isEditing && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={addItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un item
                  </Button>
                )}
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Sous-total:</span>
                    <span className="font-semibold">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">TPS (5%):</span>
                    <span className="font-semibold">${invoice.tps.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">TVQ (9.975%):</span>
                    <span className="font-semibold">${invoice.tvq.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-xl font-bold">TOTAL:</span>
                    <span className="text-xl font-bold text-[var(--primary)]">
                      ${invoice.total.toFixed(2)} CAD
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes & Terms */}
              <div className="mt-8 space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label>Notes</Label>
                      <Textarea 
                        value={invoice.notes}
                        onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Conditions</Label>
                      <Textarea 
                        value={invoice.terms}
                        onChange={(e) => setInvoice(prev => ({ ...prev, terms: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {invoice.notes && (
                      <div>
                        <p className="text-sm font-semibold mb-1">Notes:</p>
                        <p className="text-sm text-gray-600">{invoice.notes}</p>
                      </div>
                    )}
                    {invoice.terms && (
                      <div>
                        <p className="text-sm font-semibold mb-1">Conditions:</p>
                        <p className="text-sm text-gray-600">{invoice.terms}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Statut du paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <DollarSign className={`h-12 w-12 mx-auto mb-3 ${
                  invoice.status === 'paid' ? 'text-green-600' : 'text-orange-600'
                }`} />
                <p className="text-3xl font-bold mb-1">
                  ${invoice.total.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  {invoice.status === 'paid' ? 'Payé' : 'À payer'}
                </p>
              </div>

              {invoice.status === 'paid' && invoice.paidDate && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Payé le:</strong><br />
                    {new Date(invoice.paidDate).toLocaleDateString('fr-CA')}
                  </p>
                </div>
              )}

              {invoice.status !== 'paid' && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Échéance:</p>
                    <p className="font-semibold">
                      {new Date(invoice.dueDate).toLocaleDateString('fr-CA')}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handleSendInvoice}>
                <Send className="h-4 w-4 mr-2" />
                Renvoyer au client
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
              <Separator className="my-2" />
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Annuler la facture
              </Button>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5" />
                  <div>
                    <p className="font-semibold">Facture créée</p>
                    <p className="text-xs text-gray-500">10 déc. 2025, 14:30</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5" />
                  <div>
                    <p className="font-semibold">Envoyée au client</p>
                    <p className="text-xs text-gray-500">10 déc. 2025, 14:35</p>
                  </div>
                </div>
                {invoice.status === 'paid' && (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5" />
                    <div>
                      <p className="font-semibold">Paiement reçu</p>
                      <p className="text-xs text-gray-500">{invoice.paidDate}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Warranty Management Section */}
      {invoice.status === 'paid' && (
        <Card>
          <CardHeader>
            <CardTitle>Garantie légale</CardTitle>
          </CardHeader>
          <CardContent>
            <WarrantyManagement
              jobId={invoice.jobId}
              clientId={invoice.clientId}
              jobCompletedDate={invoice.paidDate || invoice.issueDate}
              onWarrantyCreate={(warranty) => {
                toast.success('Garantie activée');
              }}
              onClaimSubmit={(claim) => {
                toast.success('Réclamation de garantie soumise');
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Collection Workflow for Overdue Invoices */}
      {invoice.status === 'overdue' && (
        <Card className="border-orange-300 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Processus de recouvrement</CardTitle>
          </CardHeader>
          <CardContent>
            <CollectionWorkflow
              invoiceId={invoice.id}
              clientId={invoice.clientId}
              clientName={invoice.client.name}
              clientAddress={invoice.client.address}
              clientEmail={invoice.client.email}
              invoiceNumber={invoice.id}
              invoiceDate={invoice.issueDate}
              amountDue={invoice.total}
              daysOverdue={Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))}
              onEscalate={(escalation) => {
                toast.success('Relance envoyée');
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer le paiement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Montant</Label>
              <Input value={`$${invoice.total.toFixed(2)}`} readOnly />
            </div>
            <div>
              <Label>Méthode de paiement</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interac">Virement Interac</SelectItem>
                  <SelectItem value="cash">Comptant</SelectItem>
                  <SelectItem value="check">Chèque</SelectItem>
                  <SelectItem value="card">Carte de crédit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date de paiement</Label>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="flex-1">
                Annuler
              </Button>
              <Button 
                onClick={confirmPayment}
                disabled={!paymentMethod}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Confirmer le paiement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}