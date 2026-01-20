import { useState, useRef } from 'react';
import { AlertTriangle, Camera, FileText, Upload, Send, ExternalLink, Lock, Unlock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { toast } from 'sonner';
import { IncidentReport as IncidentReportType } from '../../types/compliance';

interface IncidentReportProps {
  jobId?: string;
  reportedBy: string;
  onSubmit: (report: IncidentReportType) => void;
  existingReport?: IncidentReportType;
  readOnly?: boolean;
}

export function IncidentReport({
  jobId,
  reportedBy,
  onSubmit,
  existingReport,
  readOnly = false,
}: IncidentReportProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [report, setReport] = useState<Partial<IncidentReportType>>(existingReport || {
    incidentType: 'non-conformite',
    severity: 'medium',
    description: '',
    address: '',
    photoUrls: [],
    documentUrls: [],
    forwardedToRBQ: false,
    forwardedToCMMTQ: false,
    isConfidential: false,
    status: 'submitted',
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        setReport(prev => ({
          ...prev,
          photoUrls: [...(prev.photoUrls || []), photoUrl],
        }));
        toast.success('Photo ajoutée');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const docUrl = e.target?.result as string;
        setReport(prev => ({
          ...prev,
          documentUrls: [...(prev.documentUrls || []), docUrl],
        }));
        toast.success('Document ajouté');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    // Validation
    if (!report.incidentType || !report.description || !report.address) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const fullReport: IncidentReportType = {
      id: `incident-${Date.now()}`,
      referenceNumber: `INC-${Date.now().toString().slice(-8)}`,
      reportedBy,
      reportedAt: new Date().toISOString(),
      incidentType: report.incidentType!,
      severity: report.severity!,
      description: report.description!,
      address: report.address!,
      photoUrls: report.photoUrls || [],
      documentUrls: report.documentUrls || [],
      forwardedToRBQ: false,
      forwardedToCMMTQ: false,
      isConfidential: report.isConfidential || false,
      status: 'submitted',
    };

    onSubmit(fullReport);
    setShowDialog(false);
    
    // Reset form
    setReport({
      incidentType: 'non-conformite',
      severity: 'medium',
      description: '',
      address: '',
      photoUrls: [],
      documentUrls: [],
      forwardedToRBQ: false,
      forwardedToCMMTQ: false,
      isConfidential: false,
      status: 'submitted',
    });

    toast.success(`Incident signalé - Référence: ${fullReport.referenceNumber}`);
  };

  const getIncidentTypeLabel = (type: string) => {
    switch (type) {
      case 'produit-non-certifie': return 'Produit non certifié';
      case 'pratique-illegale': return 'Pratique illégale';
      case 'non-conformite': return 'Non-conformité';
      case 'securite': return 'Sécurité';
      case 'autre': return 'Autre';
      default: return type;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'under-review': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'escalated': return 'bg-orange-100 text-orange-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Viewing existing report
  if (existingReport && readOnly) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Rapport d'incident
              </CardTitle>
              <CardDescription>
                Référence: {existingReport.referenceNumber}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={getSeverityColor(existingReport.severity)}>
                {existingReport.severity === 'low' && 'Faible'}
                {existingReport.severity === 'medium' && 'Moyen'}
                {existingReport.severity === 'high' && 'Élevé'}
                {existingReport.severity === 'critical' && 'Critique'}
              </Badge>
              <Badge className={getStatusColor(existingReport.status)}>
                {existingReport.status === 'submitted' && 'Soumis'}
                {existingReport.status === 'under-review' && 'En révision'}
                {existingReport.status === 'resolved' && 'Résolu'}
                {existingReport.status === 'escalated' && 'Escaladé'}
                {existingReport.status === 'closed' && 'Fermé'}
              </Badge>
              {existingReport.isConfidential && (
                <Badge variant="outline" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Confidentiel
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Type d'incident</Label>
            <p className="text-base font-medium">{getIncidentTypeLabel(existingReport.incidentType)}</p>
          </div>
          <div>
            <Label>Description</Label>
            <p className="text-base">{existingReport.description}</p>
          </div>
          <div>
            <Label>Adresse</Label>
            <p className="text-base">{existingReport.address}</p>
          </div>
          <div>
            <Label>Signalé le</Label>
            <p className="text-base">
              {new Date(existingReport.reportedAt).toLocaleDateString('fr-CA')} à{' '}
              {new Date(existingReport.reportedAt).toLocaleTimeString('fr-CA')}
            </p>
          </div>

          {existingReport.photoUrls.length > 0 && (
            <div>
              <Label>Photos ({existingReport.photoUrls.length})</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {existingReport.photoUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}

          {(existingReport.forwardedToRBQ || existingReport.forwardedToCMMTQ) && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
              <h4 className="font-semibold text-blue-900">Soumission aux organismes</h4>
              {existingReport.forwardedToRBQ && (
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Transmis à la RBQ</span>
                  {existingReport.submissionReferenceRBQ && (
                    <span className="font-mono">({existingReport.submissionReferenceRBQ})</span>
                  )}
                </div>
              )}
              {existingReport.forwardedToCMMTQ && (
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Transmis à la CMMTQ</span>
                  {existingReport.submissionReferenceCMMTQ && (
                    <span className="font-mono">({existingReport.submissionReferenceCMMTQ})</span>
                  )}
                </div>
              )}
            </div>
          )}

          {existingReport.resolution && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Résolution</h4>
              <p className="text-sm text-green-800">{existingReport.resolution}</p>
              {existingReport.resolvedAt && (
                <p className="text-xs text-green-600 mt-2">
                  Résolu le {new Date(existingReport.resolvedAt).toLocaleDateString('fr-CA')}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Create new report button
  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowDialog(true)}
        className="gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
      >
        <AlertTriangle className="h-4 w-4" />
        Signaler un incident
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Signaler un incident ou une non-conformité
            </DialogTitle>
            <DialogDescription>
              Documentez les incidents, pratiques non conformes ou problèmes de sécurité.
              Ce rapport peut être transmis à la RBQ et/ou CMMTQ.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Incident Type */}
            <div>
              <Label htmlFor="incidentType">Type d'incident *</Label>
              <Select
                value={report.incidentType}
                onValueChange={(value: any) => setReport({ ...report, incidentType: value })}
              >
                <SelectTrigger id="incidentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produit-non-certifie">Produit non certifié</SelectItem>
                  <SelectItem value="pratique-illegale">Pratique illégale</SelectItem>
                  <SelectItem value="non-conformite">Non-conformité réglementaire</SelectItem>
                  <SelectItem value="securite">Problème de sécurité</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Severity */}
            <div>
              <Label htmlFor="severity">Gravité *</Label>
              <Select
                value={report.severity}
                onValueChange={(value: any) => setReport({ ...report, severity: value })}
              >
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="high">Élevé</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description détaillée *</Label>
              <Textarea
                id="description"
                value={report.description}
                onChange={(e) => setReport({ ...report, description: e.target.value })}
                placeholder="Décrivez l'incident en détail..."
                rows={4}
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Adresse / Lieu *</Label>
              <Input
                id="address"
                value={report.address}
                onChange={(e) => setReport({ ...report, address: e.target.value })}
                placeholder="1234 Rue Principale, Montréal, QC"
              />
            </div>

            {/* Photos */}
            <div>
              <Label>Photos (optionnel)</Label>
              <div className="space-y-2">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => photoInputRef.current?.click()}
                  className="gap-2"
                  type="button"
                >
                  <Camera className="h-4 w-4" />
                  Ajouter des photos
                </Button>
                {report.photoUrls && report.photoUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {report.photoUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div>
              <Label>Documents (optionnel)</Label>
              <div className="space-y-2">
                <input
                  ref={docInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => docInputRef.current?.click()}
                  className="gap-2"
                  type="button"
                >
                  <Upload className="h-4 w-4" />
                  Ajouter des documents
                </Button>
                {report.documentUrls && report.documentUrls.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {report.documentUrls.length} document(s) ajouté(s)
                  </div>
                )}
              </div>
            </div>

            {/* Confidentiality */}
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox
                id="confidential"
                checked={report.isConfidential}
                onCheckedChange={(checked) => setReport({ ...report, isConfidential: checked as boolean })}
              />
              <div className="flex-1">
                <Label htmlFor="confidential" className="cursor-pointer font-normal">
                  Marquer comme confidentiel
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Les rapports confidentiels ne seront visibles que par les administrateurs
                </p>
              </div>
            </div>

            {/* Information Alert */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Ce rapport sera enregistré dans le système et pourra être transmis à la RBQ et/ou CMMTQ 
                pour enquête. Assurez-vous que toutes les informations sont exactes et complètes.
              </AlertDescription>
            </Alert>

            {/* External Links */}
            <div className="flex gap-2 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://www.rbq.gouv.qc.ca/signaler-une-plainte', '_blank')}
                className="gap-2"
                type="button"
              >
                <ExternalLink className="h-3 w-3" />
                Portail RBQ
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://www.cmmtq.org/plaintes', '_blank')}
                className="gap-2"
                type="button"
              >
                <ExternalLink className="h-3 w-3" />
                Portail CMMTQ
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              Soumettre le rapport
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Dashboard component to view all incidents
export function IncidentDashboard({ reports }: { reports: IncidentReportType[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rapports d'incidents</CardTitle>
        <CardDescription>
          {reports.length} rapport(s) soumis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun incident signalé</p>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold">{report.referenceNumber}</h4>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={
                      report.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      report.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      report.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }>
                      {report.severity === 'critical' && 'Critique'}
                      {report.severity === 'high' && 'Élevé'}
                      {report.severity === 'medium' && 'Moyen'}
                      {report.severity === 'low' && 'Faible'}
                    </Badge>
                    {report.isConfidential && (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{new Date(report.reportedAt).toLocaleDateString('fr-CA')}</span>
                  <span>•</span>
                  <span>{report.address}</span>
                  {report.forwardedToRBQ && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600">Transmis à RBQ</span>
                    </>
                  )}
                  {report.forwardedToCMMTQ && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600">Transmis à CMMTQ</span>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
