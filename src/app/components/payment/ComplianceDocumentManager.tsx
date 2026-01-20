import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import {
  ComplianceDocument,
  ComplianceDocumentType,
  COMPLIANCE_CHECK_REQUIREMENTS,
} from '../../types/payment';

interface ComplianceDocumentManagerProps {
  documents: ComplianceDocument[];
  onUpload: (type: ComplianceDocumentType, file: File, documentNumber: string, expiryDate: Date) => void;
}

export function ComplianceDocumentManager({ documents, onUpload }: ComplianceDocumentManagerProps) {
  const [uploadingType, setUploadingType] = useState<ComplianceDocumentType | null>(null);
  const [documentNumber, setDocumentNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getDocumentStatus = (doc: ComplianceDocument | undefined) => {
    if (!doc) return { status: 'missing', color: 'bg-red-600', icon: AlertCircle, label: 'Manquant' };

    const now = new Date();
    const expiry = new Date(doc.expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (doc.status === 'expired') {
      return { status: 'expired', color: 'bg-red-600', icon: AlertCircle, label: 'Expiré' };
    }

    if (daysUntilExpiry <= 30) {
      return {
        status: 'expiring',
        color: 'bg-orange-600',
        icon: Clock,
        label: `Expire dans ${daysUntilExpiry}j`,
      };
    }

    return { status: 'valid', color: 'bg-green-600', icon: CheckCircle, label: 'Valide' };
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux (max 10MB)');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!uploadingType || !selectedFile || !documentNumber || !expiryDate) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const expiry = new Date(expiryDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (expiry <= now) {
      toast.error('La date d\'expiration doit être dans le futur');
      return;
    }

    onUpload(uploadingType, selectedFile, documentNumber, expiry);
    toast.success('Document téléversé avec succès');

    // Reset form
    setUploadingType(null);
    setDocumentNumber('');
    setExpiryDate('');
    setSelectedFile(null);
  };

  const documentTypes = Object.keys(COMPLIANCE_CHECK_REQUIREMENTS) as ComplianceDocumentType[];
  const requiredDocs = documentTypes.filter(
    (type) => COMPLIANCE_CHECK_REQUIREMENTS[type].required
  );
  const optionalDocs = documentTypes.filter(
    (type) => !COMPLIANCE_CHECK_REQUIREMENTS[type].required
  );

  const allRequiredValid = requiredDocs.every((type) => {
    const doc = documents.find((d) => d.type === type);
    return doc && doc.status === 'valid';
  });

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className={allRequiredValid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            {allRequiredValid ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Tous les documents sont à jour</h3>
                  <p className="text-sm text-green-800">
                    Vos paiements seront libérés sans pénalité de conformité.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    Documents manquants ou expirés
                  </h3>
                  <p className="text-sm text-red-800">
                    Une pénalité de 10% sera appliquée sur vos paiements retenus si vos documents ne
                    sont pas à jour après 30 jours de la complétion du job.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Required Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents requis</CardTitle>
          <CardDescription>Ces documents sont obligatoires pour recevoir vos paiements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requiredDocs.map((type) => {
            const doc = documents.find((d) => d.type === type);
            const status = getDocumentStatus(doc);
            const StatusIcon = status.icon;
            const config = COMPLIANCE_CHECK_REQUIREMENTS[type];

            return (
              <div key={type} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <h4 className="font-semibold">{config.description}</h4>
                      <Badge className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    {doc && (
                      <div className="text-sm text-gray-600 space-y-1 mt-2">
                        <p>
                          <span className="font-medium">Numéro:</span> {doc.documentNumber}
                        </p>
                        <p className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">Expiration:</span>{' '}
                          {new Date(doc.expiryDate).toLocaleDateString('fr-CA')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Dernière vérification:{' '}
                          {new Date(doc.lastVerified).toLocaleDateString('fr-CA')}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    variant={doc && status.status === 'valid' ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => setUploadingType(type)}
                    className={doc && status.status === 'valid' ? '' : 'bg-blue-600 hover:bg-blue-700'}
                  >
                    {doc ? 'Mettre à jour' : 'Téléverser'}
                  </Button>
                </div>

                {status.status === 'expired' && (
                  <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-800">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Ce document est expiré. Téléversez une version à jour immédiatement.
                  </div>
                )}

                {status.status === 'expiring' && (
                  <div className="bg-orange-50 border border-orange-200 rounded p-2 text-sm text-orange-800">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Ce document expire bientôt. Préparez le renouvellement.
                  </div>
                )}

                {!doc && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-2 text-sm text-amber-800">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Document manquant - Requis pour recevoir vos paiements
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Optional Documents */}
      {optionalDocs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documents optionnels</CardTitle>
            <CardDescription>
              Ces documents peuvent être requis selon votre situation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {optionalDocs.map((type) => {
              const doc = documents.find((d) => d.type === type);
              const status = getDocumentStatus(doc);
              const StatusIcon = status.icon;
              const config = COMPLIANCE_CHECK_REQUIREMENTS[type];

              return (
                <div key={type} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <h4 className="font-semibold">{config.description}</h4>
                        {doc && (
                          <Badge className={status.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        )}
                      </div>
                      {doc && (
                        <div className="text-sm text-gray-600 space-y-1 mt-2">
                          <p>
                            <span className="font-medium">Numéro:</span> {doc.documentNumber}
                          </p>
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">Expiration:</span>{' '}
                            {new Date(doc.expiryDate).toLocaleDateString('fr-CA')}
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadingType(type)}
                    >
                      {doc ? 'Mettre à jour' : 'Téléverser'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      {uploadingType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>
                Téléverser: {COMPLIANCE_CHECK_REQUIREMENTS[uploadingType].description}
              </CardTitle>
              <CardDescription>
                Assurez-vous que le document est valide et lisible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="doc-number">Numéro du document</Label>
                <input
                  id="doc-number"
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="Ex: RBQ-12345-67"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="expiry-date">Date d'expiration</Label>
                <input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="file-upload">Fichier (PDF, JPG, PNG - Max 10MB)</Label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="w-full mt-1"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Fichier sélectionné: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setUploadingType(null);
                    setDocumentNumber('');
                    setExpiryDate('');
                    setSelectedFile(null);
                  }}
                >
                  Annuler
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Téléverser
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
