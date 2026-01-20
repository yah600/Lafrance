import { useState } from 'react';
import { Shield, Calendar, Clock, FileText, AlertCircle, CheckCircle2, Plus, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { toast } from 'sonner';
import { Warranty, WarrantyClaim } from '../../types/compliance';

interface WarrantyManagementProps {
  jobId: string;
  clientId: string;
  jobCompletedDate: string;
  warranty?: Warranty;
  onWarrantyCreate?: (warranty: Warranty) => void;
  onClaimSubmit?: (claim: WarrantyClaim) => void;
}

export function WarrantyManagement({
  jobId,
  clientId,
  jobCompletedDate,
  warranty: existingWarranty,
  onWarrantyCreate,
  onClaimSubmit,
}: WarrantyManagementProps) {
  const [warranty, setWarranty] = useState<Warranty>(existingWarranty || createWarranty(jobId, clientId, jobCompletedDate));
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [claimDescription, setClaimDescription] = useState('');
  const [claimType, setClaimType] = useState<'labor' | 'structural'>('labor');

  // Calculate warranty status
  const now = new Date();
  const laborEndDate = new Date(warranty.laborWarrantyEndDate);
  const structuralEndDate = new Date(warranty.structuralWarrantyEndDate);
  
  const isLaborActive = now < laborEndDate;
  const isStructuralActive = now < structuralEndDate;
  
  const laborDaysRemaining = Math.ceil((laborEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const structuralDaysRemaining = Math.ceil((structuralEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const laborProgress = ((365 - laborDaysRemaining) / 365) * 100;
  const structuralProgress = ((1825 - structuralDaysRemaining) / 1825) * 100;

  const handleSubmitClaim = () => {
    if (!claimDescription.trim()) {
      toast.error('Veuillez décrire le problème');
      return;
    }

    const newClaim: WarrantyClaim = {
      id: `claim-${Date.now()}`,
      warrantyId: warranty.id,
      claimDate: new Date().toISOString(),
      claimType,
      description: claimDescription,
      photoUrls: [],
      status: 'submitted',
      noChargeConfirmed: true,
    };

    const updatedWarranty = {
      ...warranty,
      claims: [...warranty.claims, newClaim],
      status: 'claimed' as const,
    };

    setWarranty(updatedWarranty);
    
    if (onClaimSubmit) {
      onClaimSubmit(newClaim);
    }

    setShowClaimDialog(false);
    setClaimDescription('');
    
    toast.success('Réclamation de garantie soumise');
  };

  return (
    <div className="space-y-6">
      {/* Warranty Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Garantie légale
              </CardTitle>
              <CardDescription>
                Conforme au Code civil du Québec (articles 2118 et 2120)
              </CardDescription>
            </div>
            {warranty.status === 'active' && (
              <Badge variant="default" className="bg-green-600">Garantie active</Badge>
            )}
            {warranty.status === 'expired' && (
              <Badge variant="secondary">Expirée</Badge>
            )}
            {warranty.status === 'claimed' && (
              <Badge variant="outline" className="border-orange-500 text-orange-700">
                Réclamation en cours
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Labor Warranty (1 year) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Garantie sur la main-d'œuvre</h4>
                <p className="text-sm text-gray-600">1 an à compter de la fin des travaux</p>
              </div>
              {isLaborActive ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary">Expirée</Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {new Date(warranty.laborWarrantyStartDate).toLocaleDateString('fr-CA')} - {' '}
                  {new Date(warranty.laborWarrantyEndDate).toLocaleDateString('fr-CA')}
                </span>
                {isLaborActive && (
                  <span className="font-medium">
                    {laborDaysRemaining} jours restants
                  </span>
                )}
              </div>
              <Progress value={isLaborActive ? laborProgress : 100} className="h-2" />
            </div>

            {isLaborActive && laborDaysRemaining <= 90 && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  La garantie sur la main-d'œuvre expire dans {laborDaysRemaining} jours
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Structural Warranty (5 years) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Garantie structurale</h4>
                <p className="text-sm text-gray-600">5 ans contre la perte de l'ouvrage</p>
              </div>
              {isStructuralActive ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary">Expirée</Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {new Date(warranty.structuralWarrantyStartDate).toLocaleDateString('fr-CA')} - {' '}
                  {new Date(warranty.structuralWarrantyEndDate).toLocaleDateString('fr-CA')}
                </span>
                {isStructuralActive && (
                  <span className="font-medium">
                    {Math.ceil(structuralDaysRemaining / 365)} années restantes
                  </span>
                )}
              </div>
              <Progress value={isStructuralActive ? structuralProgress : 100} className="h-2" />
            </div>
          </div>

          {/* Coverage Details */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Couverture de la garantie</h4>
            <p className="text-sm text-blue-800 mb-3">{warranty.coverageDescription}</p>
            
            {warranty.exclusions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Exclusions:</p>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  {warranty.exclusions.map((exclusion, index) => (
                    <li key={index}>{exclusion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Claim Button */}
          {(isLaborActive || isStructuralActive) && (
            <Button
              onClick={() => setShowClaimDialog(true)}
              variant="outline"
              className="w-full gap-2"
            >
              <FileText className="h-4 w-4" />
              Soumettre une réclamation de garantie
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Warranty Claims */}
      {warranty.claims.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Réclamations de garantie ({warranty.claims.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warranty.claims.map((claim) => (
                <div key={claim.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={claim.claimType === 'labor' ? 'default' : 'outline'}>
                          {claim.claimType === 'labor' ? 'Main-d\'œuvre' : 'Structurale'}
                        </Badge>
                        <Badge variant={
                          claim.status === 'completed' ? 'default' :
                          claim.status === 'in-progress' ? 'outline' :
                          claim.status === 'denied' ? 'destructive' :
                          'secondary'
                        } className={
                          claim.status === 'completed' ? 'bg-green-600' : ''
                        }>
                          {claim.status === 'submitted' && 'Soumise'}
                          {claim.status === 'approved' && 'Approuvée'}
                          {claim.status === 'denied' && 'Refusée'}
                          {claim.status === 'in-progress' && 'En cours'}
                          {claim.status === 'completed' && 'Complétée'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(claim.claimDate).toLocaleDateString('fr-CA')}
                      </p>
                    </div>
                    {claim.noChargeConfirmed && (
                      <Badge variant="default" className="bg-green-600">
                        Service gratuit
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-base mb-3">{claim.description}</p>
                  
                  {claim.assignedTechnicianId && (
                    <div className="text-sm text-gray-600">
                      Technicien assigné: {claim.assignedTechnicianId}
                    </div>
                  )}
                  
                  {claim.resolution && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm font-medium text-green-900 mb-1">Résolution:</p>
                      <p className="text-sm text-green-800">{claim.resolution}</p>
                      {claim.completedAt && (
                        <p className="text-xs text-green-600 mt-2">
                          Complété le {new Date(claim.completedAt).toLocaleDateString('fr-CA')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legal Information */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Information légale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-gray-600">
          <p>
            <strong>Article 2120 du Code civil du Québec:</strong> L'entrepreneur est tenu de la garantie 
            légale de la qualité pour une période d'un an à compter de la réception de l'ouvrage.
          </p>
          <p>
            <strong>Article 2118 du Code civil du Québec:</strong> L'entrepreneur et l'architecte qui ont 
            dirigé les travaux sont solidairement tenus de la perte de l'ouvrage pendant cinq ans.
          </p>
          <p className="pt-2">
            Pour toute question concernant la garantie, contactez-nous au{' '}
            <a href="tel:+15145550000" className="text-blue-600 hover:underline">
              <Phone className="h-3 w-3 inline" /> 514-555-0000
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Claim Submission Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Soumettre une réclamation de garantie</DialogTitle>
            <DialogDescription>
              Décrivez le problème rencontré. Un technicien sera assigné dans les 48 heures.
              Le service sous garantie est entièrement gratuit.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Type de garantie</Label>
              <div className="flex gap-3 mt-2">
                <Button
                  variant={claimType === 'labor' ? 'default' : 'outline'}
                  onClick={() => setClaimType('labor')}
                  className="flex-1"
                  disabled={!isLaborActive}
                >
                  Main-d'œuvre (1 an)
                </Button>
                <Button
                  variant={claimType === 'structural' ? 'default' : 'outline'}
                  onClick={() => setClaimType('structural')}
                  className="flex-1"
                  disabled={!isStructuralActive}
                >
                  Structurale (5 ans)
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="claimDescription">Description du problème</Label>
              <Textarea
                id="claimDescription"
                value={claimDescription}
                onChange={(e) => setClaimDescription(e.target.value)}
                placeholder="Décrivez le problème en détail..."
                rows={4}
              />
            </div>

            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Ce service est couvert par la garantie et sera effectué sans frais.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClaimDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmitClaim}>
              Soumettre la réclamation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to create warranty from job completion
function createWarranty(jobId: string, clientId: string, completionDate: string): Warranty {
  const startDate = new Date(completionDate);
  const laborEndDate = new Date(startDate);
  laborEndDate.setFullYear(laborEndDate.getFullYear() + 1);
  
  const structuralEndDate = new Date(startDate);
  structuralEndDate.setFullYear(structuralEndDate.getFullYear() + 5);

  return {
    id: `warranty-${jobId}`,
    jobId,
    clientId,
    laborWarrantyStartDate: startDate.toISOString(),
    laborWarrantyEndDate: laborEndDate.toISOString(),
    structuralWarrantyStartDate: startDate.toISOString(),
    structuralWarrantyEndDate: structuralEndDate.toISOString(),
    coverageDescription: 'Garantie légale couvrant les défauts de main-d\'œuvre et de matériaux pour une période d\'un an, et la perte de l\'ouvrage pour une période de cinq ans.',
    exclusions: [
      'Usure normale',
      'Mauvaise utilisation ou entretien inadéquat',
      'Modifications effectuées par des tiers',
      'Dommages causés par le gel ou catastrophes naturelles',
      'Pièces soumises à l\'usure normale (joints, cartouches, etc.)',
    ],
    status: 'active',
    claims: [],
  };
}

// Warranty expiry notification component
export function WarrantyExpiryNotifications({ warranties }: { warranties: Warranty[] }) {
  const now = new Date();
  const expiringWarranties = warranties.filter(w => {
    const laborEndDate = new Date(w.laborWarrantyEndDate);
    const daysUntilExpiry = Math.ceil((laborEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
  });

  if (expiringWarranties.length === 0) return null;

  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {expiringWarranties.length} garantie(s) expire(nt) dans les 90 prochains jours.
        Contactez vos clients pour offrir un service de suivi.
      </AlertDescription>
    </Alert>
  );
}
