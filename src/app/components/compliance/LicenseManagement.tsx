import { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, XCircle, Calendar, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { TechnicianLicense, LicenseBadge } from '../../types/compliance';

interface LicenseManagementProps {
  technicianId?: string;
  technicianName?: string;
  license?: TechnicianLicense;
  onSave?: (license: TechnicianLicense) => void;
  readOnly?: boolean;
}

export function LicenseManagement({ 
  technicianId, 
  technicianName,
  license: initialLicense,
  onSave,
  readOnly = false 
}: LicenseManagementProps) {
  const [license, setLicense] = useState<TechnicianLicense>(initialLicense || {
    rbqLicenseNumber: '',
    rbqLicenseExpiry: '',
    rbqLicenseStatus: 'pending',
    rbqSubclasses: [],
    cmmtqMembershipId: '',
    cmmtqMembershipExpiry: '',
    cmmtqMembershipStatus: 'pending',
    cmmtqMemberType: 'compagnon',
    lastVerificationDate: new Date().toISOString(),
  });

  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (type: 'rbq' | 'cmmtq') => {
    setIsVerifying(true);
    
    // Simulate API call to verify license
    setTimeout(() => {
      if (type === 'rbq') {
        setLicense({
          ...license,
          rbqLicenseStatus: license.rbqLicenseNumber ? 'active' : 'pending',
          lastVerificationDate: new Date().toISOString(),
        });
        toast.success('Licence RBQ vérifiée avec succès');
      } else {
        setLicense({
          ...license,
          cmmtqMembershipStatus: license.cmmtqMembershipId ? 'active' : 'pending',
          lastVerificationDate: new Date().toISOString(),
        });
        toast.success('Adhésion CMMTQ vérifiée avec succès');
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(license);
      toast.success('Informations de licence sauvegardées');
    }
  };

  const getRBQBadge = (): LicenseBadge => {
    if (!license.rbqLicenseNumber) {
      return {
        type: 'rbq',
        status: 'missing',
        displayText: 'RBQ Manquant',
      };
    }
    
    const isExpired = license.rbqLicenseExpiry && new Date(license.rbqLicenseExpiry) < new Date();
    
    if (isExpired) {
      return {
        type: 'rbq',
        status: 'expired',
        displayText: 'RBQ Expiré',
        expiryDate: license.rbqLicenseExpiry,
      };
    }
    
    if (license.rbqLicenseStatus === 'active') {
      return {
        type: 'rbq',
        status: 'verified',
        displayText: 'RBQ Vérifié',
        expiryDate: license.rbqLicenseExpiry,
      };
    }
    
    return {
      type: 'rbq',
      status: 'pending',
      displayText: 'RBQ En attente',
    };
  };

  const getCMMTQBadge = (): LicenseBadge => {
    if (!license.cmmtqMembershipId) {
      return {
        type: 'cmmtq',
        status: 'missing',
        displayText: 'CMMTQ Manquant',
      };
    }
    
    const isExpired = license.cmmtqMembershipExpiry && new Date(license.cmmtqMembershipExpiry) < new Date();
    
    if (isExpired) {
      return {
        type: 'cmmtq',
        status: 'expired',
        displayText: 'CMMTQ Expiré',
        expiryDate: license.cmmtqMembershipExpiry,
      };
    }
    
    if (license.cmmtqMembershipStatus === 'active') {
      return {
        type: 'cmmtq',
        status: 'verified',
        displayText: 'CMMTQ Membre Actif',
        expiryDate: license.cmmtqMembershipExpiry,
      };
    }
    
    return {
      type: 'cmmtq',
      status: 'pending',
      displayText: 'CMMTQ En attente',
    };
  };

  const rbqBadge = getRBQBadge();
  const cmmtqBadge = getCMMTQBadge();

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'verified': return 'default';
      case 'expired': return 'destructive';
      case 'missing': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'expired': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'missing': return <AlertTriangle className="h-4 w-4 text-gray-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Badges */}
      {technicianName && (
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-gray-400" />
          <span className="font-medium text-gray-700">{technicianName}</span>
          <div className="flex gap-2">
            <Badge variant={getBadgeVariant(rbqBadge.status)} className="gap-1">
              {getStatusIcon(rbqBadge.status)}
              {rbqBadge.displayText}
            </Badge>
            <Badge variant={getBadgeVariant(cmmtqBadge.status)} className="gap-1">
              {getStatusIcon(cmmtqBadge.status)}
              {cmmtqBadge.displayText}
            </Badge>
          </div>
        </div>
      )}

      {/* Alerts */}
      {(rbqBadge.status === 'expired' || cmmtqBadge.status === 'expired') && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Une ou plusieurs licences sont expirées. Le technicien ne peut pas être assigné à de nouveaux travaux jusqu'à renouvellement.
          </AlertDescription>
        </Alert>
      )}
      
      {(rbqBadge.status === 'missing' || cmmtqBadge.status === 'missing') && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Informations de licence manquantes. Veuillez compléter pour activer la répartition.
          </AlertDescription>
        </Alert>
      )}

      {/* RBQ License Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Licence RBQ (Régie du bâtiment du Québec)
          </CardTitle>
          <CardDescription>
            Licence obligatoire pour exercer des travaux de plomberie au Québec
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rbqNumber">Numéro de licence RBQ</Label>
              <Input
                id="rbqNumber"
                value={license.rbqLicenseNumber}
                onChange={(e) => setLicense({ ...license, rbqLicenseNumber: e.target.value })}
                placeholder="5678-1234-01"
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="rbqExpiry">Date d'expiration</Label>
              <Input
                id="rbqExpiry"
                type="date"
                value={license.rbqLicenseExpiry}
                onChange={(e) => setLicense({ ...license, rbqLicenseExpiry: e.target.value })}
                disabled={readOnly}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rbqSubclasses">Sous-classes RBQ</Label>
            <Input
              id="rbqSubclasses"
              value={license.rbqSubclasses.join(', ')}
              onChange={(e) => setLicense({ 
                ...license, 
                rbqSubclasses: e.target.value.split(',').map(s => s.trim()) 
              })}
              placeholder="15.1, 15.2, 15.5"
              disabled={readOnly}
            />
            <p className="text-sm text-gray-500 mt-1">
              Séparées par des virgules (ex: 15.1, 15.2)
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleVerify('rbq')}
              disabled={isVerifying || !license.rbqLicenseNumber || readOnly}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isVerifying ? 'animate-spin' : ''}`} />
              Vérifier la licence
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.open('https://www.rbq.gouv.qc.ca/verification-licence', '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Vérifier sur RBQ.gouv.qc.ca
            </Button>
          </div>

          {license.lastVerificationDate && license.rbqLicenseStatus === 'active' && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Dernière vérification: {new Date(license.lastVerificationDate).toLocaleDateString('fr-CA')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CMMTQ Membership Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Adhésion CMMTQ (Corporation des maîtres mécaniciens en tuyauterie du Québec)
          </CardTitle>
          <CardDescription>
            Adhésion obligatoire pour les entrepreneurs en plomberie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cmmtqId">Numéro d'adhésion CMMTQ</Label>
              <Input
                id="cmmtqId"
                value={license.cmmtqMembershipId}
                onChange={(e) => setLicense({ ...license, cmmtqMembershipId: e.target.value })}
                placeholder="CMMTQ-12345"
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="cmmtqExpiry">Date d'expiration</Label>
              <Input
                id="cmmtqExpiry"
                type="date"
                value={license.cmmtqMembershipExpiry}
                onChange={(e) => setLicense({ ...license, cmmtqMembershipExpiry: e.target.value })}
                disabled={readOnly}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cmmtqType">Type de membre</Label>
            <Select
              value={license.cmmtqMemberType}
              onValueChange={(value: any) => setLicense({ ...license, cmmtqMemberType: value })}
              disabled={readOnly}
            >
              <SelectTrigger id="cmmtqType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apprenti">Apprenti</SelectItem>
                <SelectItem value="compagnon">Compagnon</SelectItem>
                <SelectItem value="maitre">Maître</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleVerify('cmmtq')}
              disabled={isVerifying || !license.cmmtqMembershipId || readOnly}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isVerifying ? 'animate-spin' : ''}`} />
              Vérifier l'adhésion
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.open('https://www.cmmtq.org/verification', '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Vérifier sur CMMTQ.org
            </Button>
          </div>

          {license.lastVerificationDate && license.cmmtqMembershipStatus === 'active' && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Dernière vérification: {new Date(license.lastVerificationDate).toLocaleDateString('fr-CA')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      {!readOnly && onSave && (
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Sauvegarder les informations de licence
          </Button>
        </div>
      )}
    </div>
  );
}

// Badge display component for use in technician cards, invoices, etc.
export function LicenseBadges({ license }: { license?: TechnicianLicense }) {
  if (!license) return null;

  const getRBQBadgeStatus = () => {
    if (!license.rbqLicenseNumber) return 'missing';
    const isExpired = license.rbqLicenseExpiry && new Date(license.rbqLicenseExpiry) < new Date();
    if (isExpired) return 'expired';
    if (license.rbqLicenseStatus === 'active') return 'verified';
    return 'pending';
  };

  const getCMMTQBadgeStatus = () => {
    if (!license.cmmtqMembershipId) return 'missing';
    const isExpired = license.cmmtqMembershipExpiry && new Date(license.cmmtqMembershipExpiry) < new Date();
    if (isExpired) return 'expired';
    if (license.cmmtqMembershipStatus === 'active') return 'verified';
    return 'pending';
  };

  const rbqStatus = getRBQBadgeStatus();
  const cmmtqStatus = getCMMTQBadgeStatus();

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'verified': return 'default';
      case 'expired': return 'destructive';
      case 'missing': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="h-3 w-3" />;
      case 'expired': return <XCircle className="h-3 w-3" />;
      case 'missing': return <AlertTriangle className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {rbqStatus === 'verified' && (
        <Badge variant={getBadgeVariant(rbqStatus)} className="gap-1 text-xs">
          {getStatusIcon(rbqStatus)}
          RBQ Vérifié
        </Badge>
      )}
      {cmmtqStatus === 'verified' && (
        <Badge variant={getBadgeVariant(cmmtqStatus)} className="gap-1 text-xs">
          {getStatusIcon(cmmtqStatus)}
          CMMTQ Membre Actif
        </Badge>
      )}
      {(rbqStatus === 'expired' || cmmtqStatus === 'expired') && (
        <Badge variant="destructive" className="gap-1 text-xs">
          <XCircle className="h-3 w-3" />
          Licence expirée
        </Badge>
      )}
    </div>
  );
}
