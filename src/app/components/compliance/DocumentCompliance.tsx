import { useState } from 'react';
import { FileText, Upload, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { CompanyLegalInfo, DocumentTemplate } from '../../types/compliance';

interface DocumentComplianceProps {
  companyInfo?: CompanyLegalInfo;
  onSave: (info: CompanyLegalInfo) => void;
}

export function DocumentCompliance({ companyInfo: existing, onSave }: DocumentComplianceProps) {
  const [companyInfo, setCompanyInfo] = useState<CompanyLegalInfo>(existing || {
    cmmtqLogoUrl: '',
    rbqLogoUrl: '',
    rbqLicenseNumber: '',
    cmmtqMembershipNumber: '',
    companyName: 'Groupe G. Lafrance',
    address: '636 Grand Bernier Nord, St-Jean-Sur-Richelieu, QC J3B 0E6',
    phone: '',
    email: '',
    autoInsertOnDocuments: true,
  });

  const isCompliant = Boolean(
    companyInfo.rbqLicenseNumber &&
    companyInfo.cmmtqMembershipNumber &&
    companyInfo.cmmtqLogoUrl &&
    companyInfo.companyName &&
    companyInfo.address
  );

  const handleLogoUpload = (type: 'cmmtq' | 'rbq', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (type === 'cmmtq') {
        setCompanyInfo({ ...companyInfo, cmmtqLogoUrl: url });
      } else {
        setCompanyInfo({ ...companyInfo, rbqLogoUrl: url });
      }
      toast.success('Logo téléversé');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!isCompliant) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onSave(companyInfo);
    toast.success('Configuration sauvegardée');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Identification sur les documents</CardTitle>
              <CardDescription>
                Configuration obligatoire pour tous les documents légaux (factures, contrats, soumissions)
              </CardDescription>
            </div>
            {isCompliant ? (
              <Badge variant="default" className="bg-green-600 gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Conforme
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Non conforme
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isCompliant && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Les informations de licence sont incomplètes. Les documents ne peuvent pas être générés 
                tant que toutes les informations obligatoires ne sont pas fournies.
              </AlertDescription>
            </Alert>
          )}

          {/* Company Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Informations de l'entreprise</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input
                  id="companyName"
                  value={companyInfo.companyName}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                  placeholder="+1 514-555-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Courriel *</Label>
                <Input
                  id="email"
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                  placeholder="info@plomberie.com"
                />
              </div>
              <div>
                <Label htmlFor="address">Adresse *</Label>
                <Input
                  id="address"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  placeholder="1234 Rue Principale, Montréal, QC"
                />
              </div>
            </div>
          </div>

          {/* License Numbers */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Numéros de licence</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rbqNumber">Numéro de licence RBQ *</Label>
                <Input
                  id="rbqNumber"
                  value={companyInfo.rbqLicenseNumber}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, rbqLicenseNumber: e.target.value })}
                  placeholder="5678-1234-01"
                />
              </div>
              <div>
                <Label htmlFor="cmmtqNumber">Numéro d'adhésion CMMTQ *</Label>
                <Input
                  id="cmmtqNumber"
                  value={companyInfo.cmmtqMembershipNumber}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, cmmtqMembershipNumber: e.target.value })}
                  placeholder="CMMTQ-12345"
                />
              </div>
            </div>
          </div>

          {/* Logos */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Logos officiels</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CMMTQ Logo */}
              <div>
                <Label>Logo CMMTQ *</Label>
                <div className="mt-2">
                  {companyInfo.cmmtqLogoUrl ? (
                    <div className="space-y-2">
                      <img
                        src={companyInfo.cmmtqLogoUrl}
                        alt="Logo CMMTQ"
                        className="h-20 object-contain border rounded p-2 bg-white"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('cmmtq-logo-input')?.click()}
                      >
                        Changer le logo
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('cmmtq-logo-input')?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Téléverser le logo CMMTQ
                    </Button>
                  )}
                  <input
                    id="cmmtq-logo-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload('cmmtq', e)}
                    className="hidden"
                  />
                </div>
              </div>

              {/* RBQ Logo (optional) */}
              <div>
                <Label>Logo RBQ (optionnel)</Label>
                <div className="mt-2">
                  {companyInfo.rbqLogoUrl ? (
                    <div className="space-y-2">
                      <img
                        src={companyInfo.rbqLogoUrl}
                        alt="Logo RBQ"
                        className="h-20 object-contain border rounded p-2 bg-white"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('rbq-logo-input')?.click()}
                      >
                        Changer le logo
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('rbq-logo-input')?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Téléverser le logo RBQ
                    </Button>
                  )}
                  <input
                    id="rbq-logo-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload('rbq', e)}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Auto-insert option */}
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <Checkbox
              id="autoInsert"
              checked={companyInfo.autoInsertOnDocuments}
              onCheckedChange={(checked) =>
                setCompanyInfo({ ...companyInfo, autoInsertOnDocuments: checked as boolean })
              }
            />
            <div className="flex-1">
              <Label htmlFor="autoInsert" className="cursor-pointer font-normal">
                Insérer automatiquement sur tous les documents
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Les logos et numéros de licence seront automatiquement ajoutés à l'en-tête de tous 
                les documents générés (factures, contrats, soumissions, certificats)
              </p>
            </div>
          </div>

          {/* Document Template Preview */}
          <div className="p-4 bg-gray-50 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Aperçu de l'en-tête de document</h4>
              <Button variant="ghost" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                Prévisualiser
              </Button>
            </div>
            <div className="border bg-white p-6 rounded">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {companyInfo.cmmtqLogoUrl && (
                    <img src={companyInfo.cmmtqLogoUrl} alt="CMMTQ" className="h-12 object-contain" />
                  )}
                  {companyInfo.rbqLogoUrl && (
                    <img src={companyInfo.rbqLogoUrl} alt="RBQ" className="h-12 object-contain" />
                  )}
                </div>
                <div className="text-right text-sm">
                  <p className="font-bold">{companyInfo.companyName || '[Nom de l\'entreprise]'}</p>
                  <p className="text-gray-600">{companyInfo.address || '[Adresse]'}</p>
                  <p className="text-gray-600">{companyInfo.phone || '[Téléphone]'}</p>
                  <p className="text-gray-600">{companyInfo.email || '[Courriel]'}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    RBQ: {companyInfo.rbqLicenseNumber || '[Numéro]'} • CMMTQ: {companyInfo.cmmtqMembershipNumber || '[Numéro]'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Conformément aux exigences de la CMMTQ et de la RBQ, tous les documents destinés aux clients 
              doivent afficher clairement votre numéro de licence et votre adhésion. L'omission de ces 
              informations peut entraîner des sanctions.
            </AlertDescription>
          </Alert>

          <Button onClick={handleSave} size="lg" disabled={!isCompliant} className="w-full">
            Sauvegarder la configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Document template validation
export function validateDocumentTemplate(template: DocumentTemplate): boolean {
  return (
    template.includesCMMTQLogo &&
    template.includesRBQLicense &&
    template.isLegallyCompliant
  );
}