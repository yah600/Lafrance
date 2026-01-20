import { Download, Eye, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const invoices = [
  { id: 'INV-001', date: '2025-12-10', service: 'Débouchage', amount: 150, status: 'paid' },
  { id: 'INV-002', date: '2025-11-28', service: 'Chauffe-eau', amount: 1200, status: 'paid' },
  { id: 'INV-003', date: '2025-10-15', service: 'Robinet', amount: 120, status: 'paid' }
];

export default function CustomerPortalInvoices() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mes factures</h2>
          <p className="text-muted-foreground">Historique complet de vos paiements</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Tout télécharger
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total payé</p>
            <p className="text-3xl font-bold text-green-600">$3,450</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">En attente</p>
            <p className="text-3xl font-bold">$0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Nombre de factures</p>
            <p className="text-3xl font-bold">{invoices.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {invoices.map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.date} • {invoice.service}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-lg">${invoice.amount}</p>
                    <Badge className="bg-green-100 text-green-800">Payée</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
