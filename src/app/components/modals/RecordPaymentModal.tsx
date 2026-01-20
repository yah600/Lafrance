import { useState } from 'react';
import { X, DollarSign, CreditCard, Banknote, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId?: string;
  amountDue?: number;
  clientName?: string;
  onPaymentRecorded?: (payment: any) => void;
}

export default function RecordPaymentModal({ 
  open, 
  onOpenChange,
  invoiceId,
  amountDue = 0,
  clientName,
  onPaymentRecorded 
}: RecordPaymentModalProps) {
  const [formData, setFormData] = useState({
    amount: amountDue.toString(),
    paymentMethod: 'credit',
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const paymentMethods = [
    { value: 'credit', label: 'Carte de crédit', icon: CreditCard },
    { value: 'debit', label: 'Carte de débit', icon: CreditCard },
    { value: 'cash', label: 'Comptant', icon: Banknote },
    { value: 'check', label: 'Chèque', icon: Building2 },
    { value: 'transfer', label: 'Virement bancaire', icon: Building2 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    if (parseFloat(formData.amount) > amountDue) {
      toast.error('Le montant ne peut pas dépasser le montant dû');
      return;
    }

    const payment = {
      id: `payment-${Date.now()}`,
      invoiceId,
      amount: parseFloat(formData.amount),
      method: formData.paymentMethod,
      transactionId: formData.transactionId,
      date: formData.date,
      notes: formData.notes,
      processedBy: 'Current User',
      timestamp: new Date().toISOString()
    };

    if (onPaymentRecorded) {
      onPaymentRecorded(payment);
    }

    const methodLabel = paymentMethods.find(m => m.value === formData.paymentMethod)?.label;
    toast.success(`Paiement de ${formData.amount}$ enregistré (${methodLabel})`);
    
    onOpenChange(false);
    setFormData({
      amount: amountDue.toString(),
      paymentMethod: 'credit',
      transactionId: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Enregistrer un paiement
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Invoice Info */}
          {clientName && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-medium text-gray-900">{clientName}</p>
              {invoiceId && (
                <p className="text-xs text-gray-500 mt-1">Facture: {invoiceId}</p>
              )}
              <div className="mt-2 pt-2 border-t border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Montant dû:</span>
                  <span className="font-bold text-lg text-gray-900">{amountDue.toFixed(2)}$</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Amount */}
          <div>
            <Label htmlFor="amount">Montant du paiement *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={amountDue}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="pl-10"
                placeholder="0.00"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {amountDue.toFixed(2)}$
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <Label htmlFor="paymentMethod">Méthode de paiement *</Label>
            <Select 
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method.value} value={method.value}>
                    <div className="flex items-center gap-2">
                      <method.icon className="h-4 w-4" />
                      {method.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction ID */}
          {formData.paymentMethod !== 'cash' && (
            <div>
              <Label htmlFor="transactionId">Numéro de transaction</Label>
              <Input
                id="transactionId"
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                placeholder="TXN123456789"
              />
            </div>
          )}

          {/* Date */}
          <div>
            <Label htmlFor="date">Date du paiement *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informations supplémentaires..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <DollarSign className="h-4 w-4 mr-2" />
              Enregistrer le paiement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
