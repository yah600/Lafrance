import { Plus, Download, Send } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useApp } from '../context/AppContext';
import CreateInvoiceModal from '../components/modals/CreateInvoiceModal';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const statusConfig = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
  sent: { label: 'Envoyée', color: 'bg-blue-100 text-blue-800' },
  viewed: { label: 'Vue', color: 'bg-purple-100 text-purple-800' },
  paid: { label: 'Payée', color: 'bg-green-100 text-green-800' },
  overdue: { label: 'En retard', color: 'bg-red-100 text-red-800 animate-pulse' },
  cancelled: { label: 'Annulée', color: 'bg-gray-100 text-gray-800 line-through' }
};

export default function Invoices() {
  const navigate = useNavigate();
  const { invoices, jobs } = useApp();
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const pending = invoices.filter(i => i.status === 'sent' || i.status === 'viewed').reduce((sum, inv) => sum + inv.total, 0);

  const handleSendInvoice = (invoiceId: string) => {
    toast.success('Facture envoyée par email');
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success('Téléchargement de la facture...');
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice) {
      const job = jobs.find(j => j.id === invoice.jobId);
      if (job) {
        const doc = new jsPDF();
        doc.text(`Facture #${invoice.id}`, 10, 10);
        doc.text(`Date: ${invoice.dueDate}`, 10, 20);
        doc.text(`Client: ${job.client.name}`, 10, 30);
        doc.text(`Montant: $${invoice.total.toFixed(2)}`, 10, 40);
        doc.text(`Statut: ${statusConfig[invoice.status].label}`, 10, 50);
        doc.save(`facture_${invoice.id}.pdf`);
      }
    }
  };

  const handleExport = () => {
    toast.success('Export en cours...');
  };

  return (
    <div className="p-6 space-y-6">
      <CreateInvoiceModal open={createInvoiceOpen} onOpenChange={setCreateInvoiceOpen} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturation</h1>
          <p className="text-gray-600 mt-1">Gérez vos factures et paiements</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={handleExport}>
            <Download className="h-5 w-5 mr-2" />
            Exporter
          </Button>
          <Button size="lg" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90" onClick={() => setCreateInvoiceOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle facture
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Revenus ce mois</p>
            <p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">En attente</p>
            <p className="text-3xl font-bold text-orange-600">${pending.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">En retard</p>
            <p className="text-3xl font-bold text-red-600">$0</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="paid">Payées</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="overdue">En retard</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Facture #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map(invoice => {
                      const job = jobs.find(j => j.id === invoice.jobId);
                      const status = statusConfig[invoice.status];
                      
                      return (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm font-medium">{invoice.id}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{invoice.dueDate}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {job?.client.name || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">
                              ${invoice.total.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={status.color}>{status.label}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/invoices/${invoice.id}`)}>Voir</Button>
                              <Button variant="ghost" size="sm" onClick={() => handleSendInvoice(invoice.id)}>
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}>
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {invoices.filter(i => i.status === 'paid').length} facture(s) payée(s)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {invoices.filter(i => i.status === 'sent' || i.status === 'viewed').length} facture(s) en attente
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Aucune facture en retard</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}