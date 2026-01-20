import { X, Phone, MapPin, Clock, Camera, FileText, CheckCircle, PlayCircle, PauseCircle, AlertCircle, User, DollarSign, Navigation } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { CertifiedMaterialsEntry } from '../compliance/CertifiedMaterialsEntry';
import { SafetyChecklist } from '../compliance/SafetyChecklist';
import { CompletionCertificate } from '../compliance/CompletionCertificate';

interface Job {
  id: string;
  time: string;
  client: string;
  phone: string;
  address: string;
  service: string;
  priority: string;
  status: string;
  description: string;
}

interface JobDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onStatusChange: (jobId: string, newStatus: string) => void;
}

export default function JobDetailsModal({ open, onOpenChange, job, onStatusChange }: JobDetailsModalProps) {
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);

  if (!open || !job) return null;

  const handleStartJob = () => {
    onStatusChange(job.id, 'in-progress');
    toast.success('Travail démarré!');
  };

  const handleCompleteJob = () => {
    if (notes.trim() === '') {
      toast.error('Veuillez ajouter des notes avant de compléter le travail');
      return;
    }
    // Open completion certificate dialog instead of completing directly
    setCompletionDialogOpen(true);
  };

  const handleCertificateGenerated = () => {
    onStatusChange(job.id, 'completed');
    toast.success('Travail complété! Certificat généré! 🎉');
    setCompletionDialogOpen(false);
    onOpenChange(false);
  };

  const handlePauseJob = () => {
    toast.info('Travail mis en pause');
  };

  const handleAddPhoto = () => {
    // Simulate photo upload
    const photoId = `photo_${Date.now()}`;
    setPhotos([...photos, photoId]);
    toast.success('Photo ajoutée');
  };

  const handleCallClient = () => {
    window.location.href = `tel:${job.phone}`;
    toast.success('Appel du client...');
  };

  const handleNavigate = () => {
    const encodedAddress = encodeURIComponent(job.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    toast.success('Ouverture de la navigation...');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'in-progress':
        return 'En cours';
      case 'pending':
        return 'À venir';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">Détails du travail</h2>
              <Badge
                variant="outline"
                className={getPriorityColor(job.priority)}
              >
                {job.priority === 'urgent' ? 'Urgent' : job.priority === 'high' ? 'Haute priorité' : 'Normal'}
              </Badge>
              <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                {getStatusLabel(job.status)}
              </Badge>
            </div>
            <p className="text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {job.time}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Client Info Card - Always visible */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Client</p>
                      <p className="font-semibold text-lg">{job.client}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Téléphone</p>
                      <p className="font-medium">{job.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Adresse</p>
                      <p className="font-medium">{job.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={handleCallClient}>
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleNavigate}>
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="materials">Matériaux</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Service Info */}
              <div>
                <h3 className="font-semibold mb-2">Service requis</h3>
                <Badge variant="outline" className="text-base py-2 px-4">
                  {job.service}
                </Badge>
                <p className="text-gray-600 mt-3">{job.description}</p>
              </div>

              <Separator />

              {/* Job Actions */}
              <div>
                <h3 className="font-semibold mb-3">Actions du travail</h3>
                <div className="flex gap-2 flex-wrap">
                  {job.status === 'pending' && (
                    <Button onClick={handleStartJob} className="bg-green-600 hover:bg-green-700">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Démarrer le travail
                    </Button>
                  )}
                  {job.status === 'in-progress' && (
                    <>
                      <Button onClick={handlePauseJob} variant="outline">
                        <PauseCircle className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Button onClick={handleCompleteJob} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Compléter
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-base font-semibold mb-2 block">
                  Notes du travail {job.status === 'in-progress' && <span className="text-red-600">*</span>}
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Décrivez le travail effectué, les pièces utilisées, et toute information pertinente..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                />
                {job.status === 'in-progress' && notes.trim() === '' && (
                  <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Les notes sont requises pour compléter le travail
                  </p>
                )}
              </div>

              {/* Completion Info */}
              {job.status === 'completed' && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 text-green-800">
                      <CheckCircle className="h-6 w-6" />
                      <div>
                        <p className="font-semibold">Travail complété</p>
                        <p className="text-sm">Excellent travail! Le client sera notifié.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="mt-6">
              <CertifiedMaterialsEntry
                jobId={job.id}
                materials={[]}
                onMaterialAdd={(material) => {
                  toast.success('Matériau ajouté');
                }}
              />
            </TabsContent>

            {/* Checklist Tab */}
            <TabsContent value="checklist" className="mt-6">
              <SafetyChecklist
                jobId={job.id}
                jobType={job.service}
                onComplete={(checklist) => {
                  toast.success('Checklist complétée');
                }}
              />
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photos" className="mt-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Photos du travail</h3>
                  <Button size="sm" variant="outline" onClick={handleAddPhoto}>
                    <Camera className="h-4 w-4 mr-2" />
                    Ajouter photo
                  </Button>
                </div>
                
                {photos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {photos.map((photo, idx) => (
                      <div
                        key={photo}
                        className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
                      >
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Aucune photo ajoutée</p>
                    <p className="text-sm text-gray-500 mt-1">Cliquez sur "Ajouter photo" pour commencer</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          {job.status === 'in-progress' && (
            <Button onClick={handleCompleteJob} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Compléter le travail
            </Button>
          )}
        </div>
      </div>

      {/* Completion Certificate Dialog */}
      <Dialog open={completionDialogOpen} onOpenChange={setCompletionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Certificat de réalisation des travaux</DialogTitle>
          </DialogHeader>
          <CompletionCertificate
            jobId={job.id}
            clientName={job.client}
            clientAddress={job.address}
            technicianName="Technicien Principal"
            technicianLicense="RBQ-5678-1234-01"
            workDescription={notes || job.description}
            materialsUsed={[]}
            beforePhotos={photos.slice(0, Math.floor(photos.length / 2))}
            afterPhotos={photos.slice(Math.floor(photos.length / 2))}
            onGenerate={handleCertificateGenerated}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}