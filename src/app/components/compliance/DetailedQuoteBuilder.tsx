import { useState, useRef } from 'react';
import { Plus, Trash2, FileText, Check, Edit, PenTool, Calculator, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { toast } from 'sonner';
import SignatureCanvas from 'react-signature-canvas';
import { 
  DetailedQuote, 
  QuoteServiceItem, 
  QuoteLaborItem, 
  QuoteMaterialItem,
  ClientConsent,
  QuoteModification 
} from '../../types/compliance';

interface DetailedQuoteBuilderProps {
  clientId: string;
  clientName: string;
  jobId?: string;
  existingQuote?: DetailedQuote;
  onSave: (quote: DetailedQuote) => void;
  onApprove?: (quote: DetailedQuote) => void;
}

const TPS_RATE = 0.05; // 5%
const TVQ_RATE = 0.09975; // 9.975%

export function DetailedQuoteBuilder({
  clientId,
  clientName,
  jobId,
  existingQuote,
  onSave,
  onApprove,
}: DetailedQuoteBuilderProps) {
  const [quote, setQuote] = useState<DetailedQuote>(existingQuote || {
    id: `quote-${Date.now()}`,
    jobId,
    clientId,
    status: 'draft',
    services: [],
    labor: [],
    materials: [],
    subtotal: 0,
    tps: 0,
    tvq: 0,
    total: 0,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modifications: [],
  });

  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [consentType, setConsentType] = useState<'signature' | 'checkbox'>('signature');
  const [checkboxConsent, setCheckboxConsent] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);

  const [showModificationDialog, setShowModificationDialog] = useState(false);
  const [modificationReason, setModificationReason] = useState('');
  const [modificationDescription, setModificationDescription] = useState('');

  // Calculate totals
  const calculateTotals = () => {
    const servicesTotal = quote.services.reduce((sum, item) => sum + item.total, 0);
    const laborTotal = quote.labor.reduce((sum, item) => sum + item.total, 0);
    const materialsTotal = quote.materials.reduce((sum, item) => sum + item.total, 0);
    
    const subtotal = servicesTotal + laborTotal + materialsTotal;
    const tps = subtotal * TPS_RATE;
    const tvq = subtotal * TVQ_RATE;
    const total = subtotal + tps + tvq;

    setQuote({
      ...quote,
      subtotal,
      tps,
      tvq,
      total,
      updatedAt: new Date().toISOString(),
    });
  };

  // Service items
  const addService = () => {
    const newService: QuoteServiceItem = {
      description: '',
      estimatedDuration: 1,
      unitPrice: 0,
      quantity: 1,
      total: 0,
    };
    setQuote({ ...quote, services: [...quote.services, newService] });
  };

  const updateService = (index: number, field: keyof QuoteServiceItem, value: any) => {
    const updatedServices = [...quote.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    
    // Recalculate total for this service
    if (field === 'unitPrice' || field === 'quantity') {
      updatedServices[index].total = updatedServices[index].unitPrice * updatedServices[index].quantity;
    }
    
    setQuote({ ...quote, services: updatedServices });
  };

  const removeService = (index: number) => {
    const updatedServices = quote.services.filter((_, i) => i !== index);
    setQuote({ ...quote, services: updatedServices });
  };

  // Labor items
  const addLabor = () => {
    const newLabor: QuoteLaborItem = {
      technicianType: 'compagnon',
      hours: 1,
      hourlyRate: 85,
      total: 85,
    };
    setQuote({ ...quote, labor: [...quote.labor, newLabor] });
  };

  const updateLabor = (index: number, field: keyof QuoteLaborItem, value: any) => {
    const updatedLabor = [...quote.labor];
    updatedLabor[index] = { ...updatedLabor[index], [field]: value };
    
    // Recalculate total
    if (field === 'hours' || field === 'hourlyRate') {
      updatedLabor[index].total = updatedLabor[index].hours * updatedLabor[index].hourlyRate;
    }
    
    setQuote({ ...quote, labor: updatedLabor });
  };

  const removeLabor = (index: number) => {
    const updatedLabor = quote.labor.filter((_, i) => i !== index);
    setQuote({ ...quote, labor: updatedLabor });
  };

  // Material items
  const addMaterial = () => {
    const newMaterial: QuoteMaterialItem = {
      materialId: `mat-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      isCertified: true,
    };
    setQuote({ ...quote, materials: [...quote.materials, newMaterial] });
  };

  const updateMaterial = (index: number, field: keyof QuoteMaterialItem, value: any) => {
    const updatedMaterials = [...quote.materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    
    // Recalculate total
    if (field === 'quantity' || field === 'unitPrice') {
      updatedMaterials[index].total = updatedMaterials[index].quantity * updatedMaterials[index].unitPrice;
    }
    
    setQuote({ ...quote, materials: updatedMaterials });
  };

  const removeMaterial = (index: number) => {
    const updatedMaterials = quote.materials.filter((_, i) => i !== index);
    setQuote({ ...quote, materials: updatedMaterials });
  };

  // Handle save
  const handleSave = () => {
    calculateTotals();
    onSave(quote);
    toast.success('Soumission sauvegardée');
  };

  // Handle client consent
  const handleRequestConsent = () => {
    if (quote.status !== 'draft') {
      toast.error('La soumission doit être en mode brouillon');
      return;
    }
    calculateTotals();
    setShowConsentDialog(true);
  };

  const handleConsentSubmit = () => {
    let consentData: ClientConsent;

    if (consentType === 'signature') {
      if (!signatureRef.current || signatureRef.current.isEmpty()) {
        toast.error('Veuillez signer avant de continuer');
        return;
      }

      consentData = {
        consentGiven: true,
        consentType: 'signature',
        signatureData: signatureRef.current.toDataURL(),
        consentedAt: new Date().toISOString(),
        ipAddress: 'client-ip', // In production, get from request
        userAgent: navigator.userAgent,
      };
    } else {
      if (!checkboxConsent) {
        toast.error('Veuillez cocher la case de consentement');
        return;
      }

      consentData = {
        consentGiven: true,
        consentType: 'checkbox',
        consentedAt: new Date().toISOString(),
        ipAddress: 'client-ip',
        userAgent: navigator.userAgent,
      };
    }

    const approvedQuote = {
      ...quote,
      status: 'approved' as const,
      clientConsent: consentData,
      updatedAt: new Date().toISOString(),
    };

    setQuote(approvedQuote);
    setShowConsentDialog(false);
    
    if (onApprove) {
      onApprove(approvedQuote);
    }

    toast.success('Soumission approuvée par le client');
  };

  // Handle modification request
  const handleRequestModification = () => {
    if (!modificationReason || !modificationDescription) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const modification: QuoteModification = {
      id: `mod-${Date.now()}`,
      modifiedAt: new Date().toISOString(),
      modifiedBy: 'client-id', // Replace with actual client ID
      reason: modificationReason,
      changeDescription: modificationDescription,
      previousTotal: quote.total,
      newTotal: 0, // To be filled when quote is updated
      clientNotified: false,
    };

    const updatedQuote = {
      ...quote,
      status: 'modified' as const,
      modifications: [...quote.modifications, modification],
      updatedAt: new Date().toISOString(),
    };

    setQuote(updatedQuote);
    onSave(updatedQuote);
    setShowModificationDialog(false);
    setModificationReason('');
    setModificationDescription('');

    toast.info('Demande de modification envoyée');
  };

  const getStatusBadge = () => {
    switch (quote.status) {
      case 'draft':
        return <Badge variant="secondary">Brouillon</Badge>;
      case 'sent':
        return <Badge variant="outline">Envoyée</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejetée</Badge>;
      case 'modified':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Modification demandée</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expirée</Badge>;
      default:
        return null;
    }
  };

  const isExpired = new Date(quote.validUntil) < new Date();
  const canEdit = quote.status === 'draft';
  const canApprove = quote.status === 'sent' || quote.status === 'draft';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Soumission détaillée</h2>
            {getStatusBadge()}
          </div>
          <p className="text-gray-600 mt-1">
            Client: {clientName} • Valide jusqu'au: {new Date(quote.validUntil).toLocaleDateString('fr-CA')}
          </p>
          {isExpired && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Cette soumission est expirée</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <Button onClick={calculateTotals} variant="outline" className="gap-2">
              <Calculator className="h-4 w-4" />
              Recalculer
            </Button>
          )}
          <Button onClick={handleSave} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Services Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Services</CardTitle>
              <CardDescription>Description des services à fournir</CardDescription>
            </div>
            {canEdit && (
              <Button onClick={addService} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter service
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quote.services.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Aucun service ajouté</p>
            ) : (
              quote.services.map((service, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-start p-4 border rounded-lg">
                  <div className="col-span-5">
                    <Label>Description</Label>
                    <Input
                      value={service.description}
                      onChange={(e) => updateService(index, 'description', e.target.value)}
                      placeholder="Ex: Installation chauffe-eau..."
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Durée (h)</Label>
                    <Input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={service.estimatedDuration}
                      onChange={(e) => updateService(index, 'estimatedDuration', parseFloat(e.target.value))}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Prix unitaire</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={service.unitPrice}
                      onChange={(e) => updateService(index, 'unitPrice', parseFloat(e.target.value))}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label>Qté</Label>
                    <Input
                      type="number"
                      min="1"
                      value={service.quantity}
                      onChange={(e) => updateService(index, 'quantity', parseInt(e.target.value))}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label>Total</Label>
                    <div className="font-semibold text-lg">${service.total.toFixed(2)}</div>
                  </div>
                  {canEdit && (
                    <div className="col-span-1 flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Labor Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Main-d'œuvre</CardTitle>
              <CardDescription>Heures de travail et taux horaires</CardDescription>
            </div>
            {canEdit && (
              <Button onClick={addLabor} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter main-d'œuvre
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quote.labor.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Aucune main-d'œuvre ajoutée</p>
            ) : (
              quote.labor.map((labor, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-start p-4 border rounded-lg">
                  <div className="col-span-4">
                    <Label>Type de technicien</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-gray-200"
                      value={labor.technicianType}
                      onChange={(e) => updateLabor(index, 'technicianType', e.target.value as any)}
                      disabled={!canEdit}
                    >
                      <option value="apprenti">Apprenti</option>
                      <option value="compagnon">Compagnon</option>
                      <option value="maitre">Maître</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <Label>Heures</Label>
                    <Input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={labor.hours}
                      onChange={(e) => updateLabor(index, 'hours', parseFloat(e.target.value))}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="col-span-3">
                    <Label>Taux horaire</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={labor.hourlyRate}
                      onChange={(e) => updateLabor(index, 'hourlyRate', parseFloat(e.target.value))}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label>Total</Label>
                    <div className="font-semibold text-lg">${labor.total.toFixed(2)}</div>
                  </div>
                  {canEdit && (
                    <div className="col-span-1 flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLabor(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Materials Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Matériaux</CardTitle>
              <CardDescription>Pièces et matériaux nécessaires</CardDescription>
            </div>
            {canEdit && (
              <Button onClick={addMaterial} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter matériau
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quote.materials.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Aucun matériau ajouté</p>
            ) : (
              quote.materials.map((material, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-start p-4 border rounded-lg">
                  <div className="col-span-5">
                    <Label>Description</Label>
                    <Input
                      value={material.description}
                      onChange={(e) => updateMaterial(index, 'description', e.target.value)}
                      placeholder="Ex: Tuyau PEX 1/2..."
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      min="1"
                      value={material.quantity}
                      onChange={(e) => updateMaterial(index, 'quantity', parseInt(e.target.value))}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Prix unitaire</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={material.unitPrice}
                      onChange={(e) => updateMaterial(index, 'unitPrice', parseFloat(e.target.value))}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label>Certifié</Label>
                    <Checkbox
                      checked={material.isCertified}
                      onCheckedChange={(checked) => updateMaterial(index, 'isCertified', checked)}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label>Total</Label>
                    <div className="font-semibold text-lg">${material.total.toFixed(2)}</div>
                  </div>
                  {canEdit && (
                    <div className="col-span-1 flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMaterial(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Total de la soumission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-base">
            <span>Sous-total:</span>
            <span className="font-semibold">${quote.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span>TPS (5%):</span>
            <span className="font-semibold">${quote.tps.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span>TVQ (9.975%):</span>
            <span className="font-semibold">${quote.tvq.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span className="text-blue-600">${quote.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        {canApprove && (
          <Button onClick={handleRequestConsent} size="lg" className="gap-2">
            <Check className="h-5 w-5" />
            Demander l'approbation du client
          </Button>
        )}
        {quote.status === 'sent' && (
          <Button onClick={() => setShowModificationDialog(true)} variant="outline" size="lg" className="gap-2">
            <Edit className="h-5 w-5" />
            Demander une modification
          </Button>
        )}
      </div>

      {/* Modifications History */}
      {quote.modifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des modifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quote.modifications.map((mod) => (
                <div key={mod.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{mod.reason}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(mod.modifiedAt).toLocaleDateString('fr-CA')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{mod.changeDescription}</p>
                  {mod.clientApproved !== undefined && (
                    <div className="mt-2">
                      {mod.clientApproved ? (
                        <Badge variant="default" className="bg-green-600">Approuvée</Badge>
                      ) : (
                        <Badge variant="destructive">Rejetée</Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client Consent Dialog */}
      <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Approbation du client</DialogTitle>
            <DialogDescription>
              Le client doit approuver cette soumission avant que les travaux puissent commencer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3">Résumé de la soumission</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Services:</span>
                  <span>{quote.services.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Main-d'œuvre:</span>
                  <span>{quote.labor.reduce((sum, l) => sum + l.hours, 0)} heures</span>
                </div>
                <div className="flex justify-between">
                  <span>Matériaux:</span>
                  <span>{quote.materials.length}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span className="text-blue-600">${quote.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Consent Type Selection */}
            <div className="space-y-4">
              <Label>Type de consentement</Label>
              <div className="flex gap-4">
                <Button
                  variant={consentType === 'signature' ? 'default' : 'outline'}
                  onClick={() => setConsentType('signature')}
                  className="flex-1"
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  Signature numérique
                </Button>
                <Button
                  variant={consentType === 'checkbox' ? 'default' : 'outline'}
                  onClick={() => setConsentType('checkbox')}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Case à cocher
                </Button>
              </div>
            </div>

            {/* Signature Canvas */}
            {consentType === 'signature' && (
              <div className="space-y-2">
                <Label>Signature du client</Label>
                <div className="border rounded-lg p-4 bg-white">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: 'w-full h-40 border rounded',
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signatureRef.current?.clear()}
                    className="mt-2"
                  >
                    Effacer
                  </Button>
                </div>
              </div>
            )}

            {/* Checkbox Consent */}
            {consentType === 'checkbox' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Checkbox
                    id="consent-checkbox"
                    checked={checkboxConsent}
                    onCheckedChange={(checked) => setCheckboxConsent(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="consent-checkbox" className="text-base font-normal cursor-pointer">
                      J'approuve cette soumission et j'autorise le Groupe G. Lafrance à procéder aux 
                      travaux décrits ci-dessus pour un montant total de ${quote.total.toFixed(2)} (taxes incluses).
                      Je comprends que toute modification à la portée des travaux nécessitera une nouvelle approbation.
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Legal Notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                En approuvant cette soumission, vous acceptez les termes et conditions. 
                Garantie de 1 an sur la main-d'œuvre et 5 ans sur les travaux structuraux conformément au Code civil du Québec.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConsentDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleConsentSubmit}>
              Approuver la soumission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modification Request Dialog */}
      <Dialog open={showModificationDialog} onOpenChange={setShowModificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demande de modification</DialogTitle>
            <DialogDescription>
              Décrivez les changements que vous souhaitez apporter à cette soumission
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="modReason">Raison de la modification</Label>
              <Input
                id="modReason"
                value={modificationReason}
                onChange={(e) => setModificationReason(e.target.value)}
                placeholder="Ex: Changement de matériaux..."
              />
            </div>
            <div>
              <Label htmlFor="modDescription">Description détaillée</Label>
              <Textarea
                id="modDescription"
                value={modificationDescription}
                onChange={(e) => setModificationDescription(e.target.value)}
                placeholder="Décrivez les changements souhaités..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModificationDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleRequestModification}>
              Envoyer la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}