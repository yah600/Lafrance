import { useState, useRef } from 'react';
import { CheckCircle2, Circle, Camera, FileText, AlertTriangle, Check, X, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { 
  ChecklistTemplate, 
  ChecklistItem, 
  CompletedChecklist, 
  CompletedChecklistItem 
} from '../../types/compliance';

// Mock checklist templates by job type
const CHECKLIST_TEMPLATES: Record<string, ChecklistTemplate> = {
  'chauffe-eau': {
    id: 'tpl-chauffe-eau',
    name: 'Installation chauffe-eau',
    jobType: 'chauffe-eau',
    requiresPhotos: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin',
    items: [
      {
        id: 'item-1',
        description: 'Vérifier la conformité électrique (disjoncteur 30A, câblage approprié)',
        category: 'safety',
        isMandatory: true,
        requiresPhoto: true,
        requiresNote: false,
      },
      {
        id: 'item-2',
        description: 'Installer la soupape de sûreté (150 PSI minimum)',
        category: 'safety',
        isMandatory: true,
        requiresPhoto: true,
        requiresNote: false,
      },
      {
        id: 'item-3',
        description: 'Vérifier le tuyau de décharge dirigé vers drain de plancher',
        category: 'safety',
        isMandatory: true,
        requiresPhoto: true,
        requiresNote: false,
      },
      {
        id: 'item-4',
        description: 'Installer le clapet anti-retour sur l\'alimentation',
        category: 'regulatory',
        isMandatory: true,
        requiresPhoto: false,
        requiresNote: false,
      },
      {
        id: 'item-5',
        description: 'Tester la température de sortie (max 49°C)',
        category: 'quality',
        isMandatory: true,
        requiresPhoto: false,
        requiresNote: true,
      },
      {
        id: 'item-6',
        description: 'Vérifier l\'absence de fuites (connexions et soupape)',
        category: 'quality',
        isMandatory: true,
        requiresPhoto: true,
        requiresNote: false,
      },
      {
        id: 'item-7',
        description: 'Nettoyer l\'aire de travail',
        category: 'cleanup',
        isMandatory: true,
        requiresPhoto: true,
        requiresNote: false,
      },
      {
        id: 'item-8',
        description: 'Expliquer au client l\'entretien annuel recommandé',
        category: 'quality',
        isMandatory: false,
        requiresPhoto: false,
        requiresNote: true,
      },
    ],
  },
  'debouchage': {
    id: 'tpl-debouchage',
    name: 'Débouchage de drain',
    jobType: 'debouchage',
    requiresPhotos: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin',
    items: [
      {
        id: 'item-1',
        description: 'Photo avant: documenter l\'obstruction',
        category: 'quality',
        isMandatory: true,
        requiresPhoto: true,
        requiresNote: false,
      },
      {
        id: 'item-2',
        description: 'Vérifier l\'accès sécuritaire au drain',
        category: 'safety',
        isMandatory: true,
        requiresPhoto: false,
        requiresNote: false,
      },
      {
        id: 'item-3',
        description: 'Utiliser équipement de protection approprié',
        category: 'safety',
        isMandatory: true,
        requiresPhoto: false,
        requiresNote: false,
      },
      {
        id: 'item-4',
        description: 'Tester l\'écoulement après débouchage',
        category: 'quality',
        isMandatory: true,
        requiresPhoto: true,
        requiresNote: false,
      },
      {
        id: 'item-5',
        description: 'Inspecter la condition de la tuyauterie',
        category: 'quality',
        isMandatory: true,
        requiresPhoto: false,
        requiresNote: true,
      },
      {
        id: 'item-6',
        description: 'Nettoyer et désinfecter l\'aire de travail',
        category: 'cleanup',
        isMandatory: true,
        requiresPhoto: true,
        requiresNote: false,
      },
    ],
  },
  'robinetterie': {
    id: 'tpl-robinetterie',
    name: 'Installation/réparation robinetterie',
    jobType: 'robinetterie',
    requiresPhotos: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin',
    items: [
      {
        id: 'item-1',
        description: 'Fermer l\'alimentation en eau',
        category: 'safety',
        isMandatory: true,
        requiresPhoto: false,
        requiresNote: false,
      },
      {
        id: 'item-2',
        description: 'Vérifier la compatibilité du robinet (CSA certifié)',
        category: 'regulatory',
        isMandatory: true,
        requiresPhoto: false,
        requiresNote: false,
      },
      {
        id: 'item-3',
        description: 'Installer les joints d\'étanchéité appropriés',
        category: 'quality',
        isMandatory: true,
        requiresPhoto: false,
        requiresNote: false,
      },
      {
        id: 'item-4',
        description: 'Tester l\'absence de fuites (robinet ouvert et fermé)',
        category: 'quality',
        isMandatory: true,
        requiresPhoto: true,
        requiresNote: false,
      },
      {
        id: 'item-5',
        description: 'Vérifier le débit d\'eau (pression adéquate)',
        category: 'quality',
        isMandatory: true,
        requiresPhoto: false,
        requiresNote: true,
      },
      {
        id: 'item-6',
        description: 'Nettoyer et polir le robinet',
        category: 'cleanup',
        isMandatory: false,
        requiresPhoto: false,
        requiresNote: false,
      },
    ],
  },
};

interface SafetyChecklistProps {
  jobId: string;
  jobType: string;
  technicianId: string;
  existingChecklist?: CompletedChecklist;
  onSave?: (checklist: CompletedChecklist) => void;
  onComplete?: (checklist: CompletedChecklist) => void;
  readOnly?: boolean;
}

export function SafetyChecklist({
  jobId,
  jobType,
  technicianId,
  existingChecklist,
  onSave,
  onComplete,
  readOnly = false,
}: SafetyChecklistProps) {
  // Get template for job type
  const template = CHECKLIST_TEMPLATES[jobType] || CHECKLIST_TEMPLATES['robinetterie'];
  
  const [checklist, setChecklist] = useState<CompletedChecklist>(existingChecklist || {
    id: `checklist-${jobId}`,
    jobId,
    templateId: template.id,
    technicianId,
    items: template.items.map(item => ({
      checklistItemId: item.id,
      completed: false,
      photoUrls: [],
    })),
    completedAt: '',
    signedOffBy: '',
    overallStatus: 'incomplete',
  });

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Calculate progress
  const totalItems = template.items.length;
  const mandatoryItems = template.items.filter(i => i.isMandatory).length;
  const completedItems = checklist.items.filter(i => i.completed).length;
  const completedMandatory = checklist.items.filter((ci, index) => 
    ci.completed && template.items[index].isMandatory
  ).length;
  const progress = (completedItems / totalItems) * 100;

  const handleToggleComplete = (itemIndex: number) => {
    if (readOnly) return;

    const updatedItems = [...checklist.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      completed: !updatedItems[itemIndex].completed,
      completedAt: !updatedItems[itemIndex].completed ? new Date().toISOString() : undefined,
    };

    setChecklist({
      ...checklist,
      items: updatedItems,
      overallStatus: updatedItems.every(i => i.completed) ? 'complete' : 
                     updatedItems.some(i => i.completed) ? 'partial' : 'incomplete',
    });
  };

  const handleAddNote = (itemIndex: number, note: string) => {
    if (readOnly) return;

    const updatedItems = [...checklist.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      note,
    };
    setChecklist({ ...checklist, items: updatedItems });
  };

  const handlePhotoUpload = (itemIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;

    const file = event.target.files?.[0];
    if (!file) return;

    // In production, upload to cloud storage and get URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string;
      
      const updatedItems = [...checklist.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        photoUrls: [...updatedItems[itemIndex].photoUrls, photoUrl],
      };
      setChecklist({ ...checklist, items: updatedItems });
      
      toast.success('Photo ajoutée');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (itemIndex: number, photoIndex: number) => {
    if (readOnly) return;

    const updatedItems = [...checklist.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      photoUrls: updatedItems[itemIndex].photoUrls.filter((_, i) => i !== photoIndex),
    };
    setChecklist({ ...checklist, items: updatedItems });
    toast.success('Photo retirée');
  };

  const handleSave = () => {
    if (onSave) {
      onSave(checklist);
      toast.success('Liste de contrôle sauvegardée');
    }
  };

  const handleMarkComplete = () => {
    // Validation
    const missingMandatory = template.items.filter((item, index) => 
      item.isMandatory && !checklist.items[index].completed
    );

    if (missingMandatory.length > 0) {
      toast.error(`${missingMandatory.length} élément(s) obligatoire(s) non complété(s)`);
      return;
    }

    const missingPhotos = template.items.filter((item, index) => 
      item.requiresPhoto && checklist.items[index].photoUrls.length === 0
    );

    if (missingPhotos.length > 0) {
      toast.error(`${missingPhotos.length} photo(s) obligatoire(s) manquante(s)`);
      return;
    }

    const completedChecklist: CompletedChecklist = {
      ...checklist,
      completedAt: new Date().toISOString(),
      signedOffBy: technicianId,
      overallStatus: 'complete',
    };

    setChecklist(completedChecklist);

    if (onComplete) {
      onComplete(completedChecklist);
    }

    toast.success('Liste de contrôle complétée et signée');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety': return 'bg-red-100 text-red-700 border-red-200';
      case 'quality': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'regulatory': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cleanup': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'safety': return 'Sécurité';
      case 'quality': return 'Qualité';
      case 'regulatory': return 'Réglementaire';
      case 'cleanup': return 'Nettoyage';
      default: return category;
    }
  };

  const canComplete = completedMandatory === mandatoryItems && !readOnly && checklist.overallStatus !== 'complete';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{template.name}</h3>
            <p className="text-gray-600 mt-1">
              Liste de contrôle qualité et sécurité obligatoire
            </p>
          </div>
          {checklist.overallStatus === 'complete' && (
            <Badge variant="default" className="bg-green-600 gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Complété
            </Badge>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Progression: {completedItems}/{totalItems} éléments
            </span>
            <span className="font-medium">
              {completedMandatory}/{mandatoryItems} obligatoires
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Validation Alert */}
      {!readOnly && checklist.overallStatus !== 'complete' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous devez compléter tous les éléments obligatoires et ajouter les photos requises 
            avant de pouvoir terminer ce travail.
          </AlertDescription>
        </Alert>
      )}

      {/* Checklist Items */}
      <div className="space-y-4">
        {template.items.map((item, index) => {
          const completedItem = checklist.items[index];
          const isCompleted = completedItem?.completed || false;
          const hasPhotos = completedItem?.photoUrls?.length > 0;
          const hasNote = completedItem?.note && completedItem.note.trim() !== '';

          return (
            <Card 
              key={item.id} 
              className={`${isCompleted ? 'bg-green-50 border-green-200' : ''} ${
                item.isMandatory && !isCompleted ? 'border-l-4 border-l-red-500' : ''
              }`}
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Item Header */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleComplete(index)}
                      disabled={readOnly}
                      className="mt-1"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <p className={`text-base ${isCompleted ? 'text-green-900 font-medium' : 'text-gray-900'}`}>
                          {item.description}
                        </p>
                        <div className="flex gap-2 flex-shrink-0">
                          <Badge variant="outline" className={getCategoryColor(item.category)}>
                            {getCategoryLabel(item.category)}
                          </Badge>
                          {item.isMandatory && (
                            <Badge variant="destructive">Obligatoire</Badge>
                          )}
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="flex gap-3 mt-2 text-sm text-gray-500">
                        {item.requiresPhoto && (
                          <span className={hasPhotos ? 'text-green-600' : 'text-gray-500'}>
                            <Camera className="h-4 w-4 inline mr-1" />
                            Photo requise {hasPhotos && `(${completedItem.photoUrls.length})`}
                          </span>
                        )}
                        {item.requiresNote && (
                          <span className={hasNote ? 'text-green-600' : 'text-gray-500'}>
                            <FileText className="h-4 w-4 inline mr-1" />
                            Note requise
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  {item.requiresPhoto && !readOnly && (
                    <div>
                      <input
                        ref={el => fileInputRefs.current[item.id] = el}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handlePhotoUpload(index, e)}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRefs.current[item.id]?.click()}
                        className="gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Ajouter une photo
                      </Button>
                    </div>
                  )}

                  {/* Photo Gallery */}
                  {completedItem?.photoUrls && completedItem.photoUrls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {completedItem.photoUrls.map((photoUrl, photoIndex) => (
                        <div key={photoIndex} className="relative group">
                          <img
                            src={photoUrl}
                            alt={`Photo ${photoIndex + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          {!readOnly && (
                            <button
                              onClick={() => handleRemovePhoto(index, photoIndex)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Note Field */}
                  {item.requiresNote && !readOnly && (
                    <div>
                      <Label htmlFor={`note-${item.id}`}>Note</Label>
                      <Textarea
                        id={`note-${item.id}`}
                        value={completedItem?.note || ''}
                        onChange={(e) => handleAddNote(index, e.target.value)}
                        placeholder="Ajoutez vos observations..."
                        rows={2}
                      />
                    </div>
                  )}
                  {item.requiresNote && readOnly && completedItem?.note && (
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="text-sm text-gray-700">{completedItem.note}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Actions */}
      {!readOnly && (
        <div className="flex gap-3">
          <Button onClick={handleSave} variant="outline" size="lg">
            Sauvegarder la progression
          </Button>
          <Button 
            onClick={handleMarkComplete} 
            size="lg" 
            disabled={!canComplete}
            className="gap-2"
          >
            <Check className="h-5 w-5" />
            Marquer comme complété
          </Button>
        </div>
      )}

      {/* Completion Info */}
      {checklist.overallStatus === 'complete' && checklist.completedAt && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Liste de contrôle complétée le {new Date(checklist.completedAt).toLocaleDateString('fr-CA')} 
            à {new Date(checklist.completedAt).toLocaleTimeString('fr-CA')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
