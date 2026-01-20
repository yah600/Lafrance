import { useState, useRef } from 'react';
import { FileText, Download, CheckCircle2, PenTool, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner';
import SignatureCanvas from 'react-signature-canvas';
import { CompletionCertificate as CompletionCertificateType, MaterialUsage } from '../../types/compliance';

interface CompletionCertificateProps {
  jobId: string;
  clientName: string;
  clientAddress: string;
  technicianName: string;
  technicianLicense: string;
  workDescription: string;
  materialsUsed: MaterialUsage[];
  checklistId?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  onGenerate: (certificate: CompletionCertificateType) => void;
  existingCertificate?: CompletionCertificateType;
}

export function CompletionCertificate({
  jobId,
  clientName,
  clientAddress,
  technicianName,
  technicianLicense,
  workDescription,
  materialsUsed,
  checklistId,
  beforePhotos = [],
  afterPhotos = [],
  onGenerate,
  existingCertificate,
}: CompletionCertificateProps) {
  const techSignatureRef = useRef<SignatureCanvas>(null);
  const clientSignatureRef = useRef<SignatureCanvas>(null);
  const [showSignatures, setShowSignatures] = useState(false);

  const handleGenerate = () => {
    // Validate signatures
    if (!techSignatureRef.current || techSignatureRef.current.isEmpty()) {
      toast.error('Signature du technicien requise');
      return;
    }
    if (!clientSignatureRef.current || clientSignatureRef.current.isEmpty()) {
      toast.error('Signature du client requise');
      return;
    }

    const certificate: CompletionCertificateType = {
      id: `cert-${jobId}`,
      jobId,
      clientName,
      clientAddress,
      technicianName,
      technicianLicense,
      workDescription,
      materialsUsed,
      checklistId: checklistId || '',
      beforePhotoUrls: beforePhotos,
      afterPhotoUrls: afterPhotos,
      technicianSignature: techSignatureRef.current.toDataURL(),
      technicianSignedAt: new Date().toISOString(),
      clientSignature: clientSignatureRef.current.toDataURL(),
      clientSignedAt: new Date().toISOString(),
      certificateNumber: `CERT-${Date.now().toString().slice(-8)}`,
      issuedAt: new Date().toISOString(),
      pdfUrl: '', // Generated server-side
      warrantyActivated: true,
    };

    onGenerate(certificate);
    toast.success('Certificat de clôture généré avec succès');
  };

  // Display existing certificate
  if (existingCertificate) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Certificat de clôture de travaux
              </CardTitle>
              <CardDescription>
                Numéro: {existingCertificate.certificateNumber}
              </CardDescription>
            </div>
            <Badge variant="default" className="bg-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Émis
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Certificate Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Client</Label>
              <p className="font-medium">{existingCertificate.clientName}</p>
              <p className="text-sm text-gray-600">{existingCertificate.clientAddress}</p>
            </div>
            <div>
              <Label>Technicien</Label>
              <p className="font-medium">{existingCertificate.technicianName}</p>
              <p className="text-sm text-gray-600">Licence RBQ: {existingCertificate.technicianLicense}</p>
            </div>
          </div>

          <Separator />

          {/* Work Description */}
          <div>
            <Label>Travaux effectués</Label>
            <p className="text-base mt-1">{existingCertificate.workDescription}</p>
          </div>

          {/* Materials */}
          {existingCertificate.materialsUsed.length > 0 && (
            <div>
              <Label>Matériaux utilisés ({existingCertificate.materialsUsed.length})</Label>
              <div className="mt-2 space-y-2">
                {existingCertificate.materialsUsed.map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{material.materialName}</span>
                    <span className="text-sm text-gray-600">
                      {material.quantity} {material.unit}
                      {material.isCertified && <Badge variant="outline" className="ml-2 text-xs">Certifié</Badge>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photos */}
          <div className="grid grid-cols-2 gap-4">
            {existingCertificate.beforePhotoUrls.length > 0 && (
              <div>
                <Label>Photos avant</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {existingCertificate.beforePhotoUrls.map((url, index) => (
                    <img key={index} src={url} alt="Avant" className="w-full h-24 object-cover rounded border" />
                  ))}
                </div>
              </div>
            )}
            {existingCertificate.afterPhotoUrls.length > 0 && (
              <div>
                <Label>Photos après</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {existingCertificate.afterPhotoUrls.map((url, index) => (
                    <img key={index} src={url} alt="Après" className="w-full h-24 object-cover rounded border" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Signature du technicien</Label>
              <img src={existingCertificate.technicianSignature} alt="Signature technicien" className="border rounded p-2 bg-white mt-2" />
              <p className="text-xs text-gray-500 mt-1">
                {new Date(existingCertificate.technicianSignedAt).toLocaleDateString('fr-CA')}
              </p>
            </div>
            <div>
              <Label>Signature du client</Label>
              <img src={existingCertificate.clientSignature} alt="Signature client" className="border rounded p-2 bg-white mt-2" />
              <p className="text-xs text-gray-500 mt-1">
                {new Date(existingCertificate.clientSignedAt).toLocaleDateString('fr-CA')}
              </p>
            </div>
          </div>

          {existingCertificate.warrantyActivated && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                La garantie légale a été activée automatiquement
              </AlertDescription>
            </Alert>
          )}

          <Button className="w-full gap-2">
            <Download className="h-4 w-4" />
            Télécharger le certificat PDF
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Generate new certificate
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Générer le certificat de clôture
        </CardTitle>
        <CardDescription>
          Document officiel requis pour activer la garantie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview Info */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <h4 className="font-semibold">Informations du certificat</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Client:</span>
              <p className="font-medium">{clientName}</p>
            </div>
            <div>
              <span className="text-gray-600">Technicien:</span>
              <p className="font-medium">{technicianName}</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Travaux:</span>
              <p className="font-medium">{workDescription}</p>
            </div>
            <div>
              <span className="text-gray-600">Matériaux:</span>
              <p className="font-medium">{materialsUsed.length} items</p>
            </div>
            <div>
              <span className="text-gray-600">Photos:</span>
              <p className="font-medium">{beforePhotos.length + afterPhotos.length} photos</p>
            </div>
          </div>
        </div>

        {!showSignatures ? (
          <Button onClick={() => setShowSignatures(true)} className="w-full gap-2">
            <PenTool className="h-4 w-4" />
            Procéder aux signatures
          </Button>
        ) : (
          <>
            {/* Signature Section */}
            <div className="space-y-6">
              {/* Technician Signature */}
              <div>
                <Label>Signature du technicien *</Label>
                <div className="border rounded-lg p-4 bg-white mt-2">
                  <SignatureCanvas
                    ref={techSignatureRef}
                    canvasProps={{
                      className: 'w-full h-32 border rounded',
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => techSignatureRef.current?.clear()}
                    className="mt-2"
                  >
                    Effacer
                  </Button>
                </div>
              </div>

              {/* Client Signature */}
              <div>
                <Label>Signature du client *</Label>
                <div className="border rounded-lg p-4 bg-white mt-2">
                  <SignatureCanvas
                    ref={clientSignatureRef}
                    canvasProps={{
                      className: 'w-full h-32 border rounded',
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clientSignatureRef.current?.clear()}
                    className="mt-2"
                  >
                    Effacer
                  </Button>
                </div>
              </div>
            </div>

            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription className="text-sm">
                En signant ce certificat, vous confirmez que les travaux ont été complétés de manière satisfaisante 
                et que la garantie légale de 1 an (main-d'œuvre) et 5 ans (structurale) est activée.
              </AlertDescription>
            </Alert>

            <Button onClick={handleGenerate} className="w-full gap-2" size="lg">
              <CheckCircle2 className="h-5 w-5" />
              Générer le certificat
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
