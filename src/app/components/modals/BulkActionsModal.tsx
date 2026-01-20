import { useState } from 'react';
import { X, CheckSquare, Mail, Trash2, Archive, UserPlus, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface BulkActionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  entityType: 'jobs' | 'clients' | 'invoices' | 'technicians';
  onActionComplete?: (action: string) => void;
}

export default function BulkActionsModal({ 
  open, 
  onOpenChange,
  selectedCount,
  entityType,
  onActionComplete 
}: BulkActionsModalProps) {
  const [selectedAction, setSelectedAction] = useState('');

  const actionsByType = {
    jobs: [
      { value: 'assign', label: 'Assigner à un technicien', icon: UserPlus },
      { value: 'reschedule', label: 'Replanifier', icon: Calendar },
      { value: 'cancel', label: 'Annuler', icon: X },
      { value: 'archive', label: 'Archiver', icon: Archive },
    ],
    clients: [
      { value: 'email', label: 'Envoyer un email', icon: Mail },
      { value: 'tag', label: 'Ajouter une étiquette', icon: CheckSquare },
      { value: 'export', label: 'Exporter', icon: Archive },
      { value: 'delete', label: 'Supprimer', icon: Trash2 },
    ],
    invoices: [
      { value: 'send', label: 'Envoyer par email', icon: Mail },
      { value: 'paid', label: 'Marquer comme payé', icon: CheckSquare },
      { value: 'reminder', label: 'Envoyer rappel', icon: Mail },
      { value: 'export', label: 'Exporter', icon: Archive },
    ],
    technicians: [
      { value: 'email', label: 'Envoyer un email', icon: Mail },
      { value: 'schedule', label: 'Bloquer calendrier', icon: Calendar },
      { value: 'training', label: 'Assigner formation', icon: CheckSquare },
    ],
  };

  const actions = actionsByType[entityType] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAction) {
      toast.error('Veuillez sélectionner une action');
      return;
    }

    const actionLabel = actions.find(a => a.value === selectedAction)?.label || selectedAction;
    
    // Execute the action
    if (onActionComplete) {
      onActionComplete(selectedAction);
    }

    toast.success(`Action "${actionLabel}" appliquée à ${selectedCount} éléments`);
    onOpenChange(false);
    setSelectedAction('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            Actions groupées
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
          {/* Selection Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <span className="font-bold">{selectedCount}</span> élément{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
            </p>
          </div>

          {/* Action Selection */}
          <div>
            <Label htmlFor="action">Action à appliquer *</Label>
            <Select 
              value={selectedAction}
              onValueChange={setSelectedAction}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une action..." />
              </SelectTrigger>
              <SelectContent>
                {actions.map(action => (
                  <SelectItem key={action.value} value={action.value}>
                    <div className="flex items-center gap-2">
                      <action.icon className="h-4 w-4" />
                      {action.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warning for destructive actions */}
          {(selectedAction === 'delete' || selectedAction === 'cancel') && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-900 font-medium">
                ⚠️ Attention: Cette action est irréversible
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className={
                selectedAction === 'delete' || selectedAction === 'cancel'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[var(--primary)] hover:bg-[var(--primary)]/90'
              }
            >
              Appliquer l'action
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
