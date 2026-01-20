import { useState } from 'react';
import { GraduationCap, Plus, Calendar, FileText, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { toast } from 'sonner';
import { ContinuingEducation, EducationCourse } from '../../types/compliance';

interface EducationTrackingProps {
  technicianId: string;
  technicianName: string;
  certificationLevel: 'apprenti' | 'compagnon' | 'maitre';
  education?: ContinuingEducation;
  onUpdate?: (education: ContinuingEducation) => void;
}

export function EducationTracking({
  technicianId,
  technicianName,
  certificationLevel,
  education: existingEducation,
  onUpdate,
}: EducationTrackingProps) {
  const requiredHours = certificationLevel === 'apprenti' ? 16 : certificationLevel === 'compagnon' ? 24 : 32;
  
  const [education, setEducation] = useState<ContinuingEducation>(existingEducation || {
    technicianId,
    periodStart: new Date().toISOString().split('T')[0],
    periodEnd: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    requiredHours,
    completedHours: 0,
    courses: [],
    status: 'on-track',
    nextDeadline: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [showAddCourseDialog, setShowAddCourseDialog] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<EducationCourse>>({
    title: '',
    provider: '',
    hours: 0,
    completedDate: new Date().toISOString().split('T')[0],
    category: '',
    cmmtqApproved: true,
  });

  const progress = (education.completedHours / education.requiredHours) * 100;
  const hoursRemaining = education.requiredHours - education.completedHours;
  
  const deadlineDate = new Date(education.nextDeadline);
  const now = new Date();
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const getStatus = (): 'on-track' | 'at-risk' | 'overdue' | 'completed' => {
    if (education.completedHours >= education.requiredHours) return 'completed';
    if (daysUntilDeadline < 0) return 'overdue';
    if (daysUntilDeadline <= 90) return 'at-risk';
    return 'on-track';
  };

  const status = getStatus();

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.provider || !newCourse.hours || newCourse.hours <= 0) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const course: EducationCourse = {
      id: `course-${Date.now()}`,
      title: newCourse.title!,
      provider: newCourse.provider!,
      hours: newCourse.hours!,
      completedDate: newCourse.completedDate!,
      category: newCourse.category || 'Autre',
      cmmtqApproved: newCourse.cmmtqApproved || false,
    };

    const updatedEducation = {
      ...education,
      courses: [...education.courses, course],
      completedHours: education.completedHours + course.hours,
      status: getStatus(),
    };

    setEducation(updatedEducation);
    
    if (onUpdate) {
      onUpdate(updatedEducation);
    }

    setShowAddCourseDialog(false);
    setNewCourse({
      title: '',
      provider: '',
      hours: 0,
      completedDate: new Date().toISOString().split('T')[0],
      category: '',
      cmmtqApproved: true,
    });

    toast.success('Formation ajoutée avec succès');
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Formation continue CMMTQ
              </CardTitle>
              <CardDescription>
                {technicianName} - {certificationLevel === 'apprenti' ? 'Apprenti' : certificationLevel === 'compagnon' ? 'Compagnon' : 'Maître'}
              </CardDescription>
            </div>
            <Badge variant={
              status === 'completed' ? 'default' :
              status === 'overdue' ? 'destructive' :
              status === 'at-risk' ? 'outline' :
              'secondary'
            } className={
              status === 'completed' ? 'bg-green-600' :
              status === 'at-risk' ? 'border-yellow-500 text-yellow-700' : ''
            }>
              {status === 'completed' && 'Complété'}
              {status === 'overdue' && 'En retard'}
              {status === 'at-risk' && 'À risque'}
              {status === 'on-track' && 'En cours'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold text-gray-900">
                  {education.completedHours} / {education.requiredHours} heures
                </h4>
                <p className="text-sm text-gray-600">
                  Période: {new Date(education.periodStart).toLocaleDateString('fr-CA')} - {new Date(education.periodEnd).toLocaleDateString('fr-CA')}
                </p>
              </div>
              <div className="text-right">
                {hoursRemaining > 0 ? (
                  <>
                    <p className="text-lg font-semibold text-gray-900">{hoursRemaining} heures</p>
                    <p className="text-sm text-gray-600">restantes</p>
                  </>
                ) : (
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                )}
              </div>
            </div>

            <Progress value={progress} className="h-3" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progression: {Math.round(progress)}%</span>
              <span className="font-medium">
                {daysUntilDeadline > 0 ? `${daysUntilDeadline} jours restants` : 'Échéance dépassée'}
              </span>
            </div>
          </div>

          {/* Status Alerts */}
          {status === 'overdue' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                La période de formation est expirée. Complétez vos heures de formation immédiatement pour maintenir votre certification.
              </AlertDescription>
            </Alert>
          )}

          {status === 'at-risk' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Il vous reste {daysUntilDeadline} jours pour compléter {hoursRemaining} heures de formation.
              </AlertDescription>
            </Alert>
          )}

          {status === 'completed' && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Félicitations! Vous avez complété vos heures de formation requises pour cette période.
              </AlertDescription>
            </Alert>
          )}

          {/* Requirements by Level */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Exigences CMMTQ</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Apprenti: 16 heures / 2 ans</li>
              <li>• Compagnon: 24 heures / 2 ans</li>
              <li>• Maître: 32 heures / 2 ans</li>
              <li>• Formations approuvées par la CMMTQ requises</li>
            </ul>
          </div>

          {/* Add Course Button */}
          <Button
            onClick={() => setShowAddCourseDialog(true)}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une formation
          </Button>
        </CardContent>
      </Card>

      {/* Courses List */}
      {education.courses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Formations complétées ({education.courses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {education.courses.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-600">{course.provider}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="default">{course.hours}h</Badge>
                      {course.cmmtqApproved && (
                        <Badge variant="outline" className="border-green-500 text-green-700 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          CMMTQ
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(course.completedDate).toLocaleDateString('fr-CA')}
                    </span>
                    {course.category && (
                      <>
                        <span>•</span>
                        <span>{course.category}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Course Dialog */}
      <Dialog open={showAddCourseDialog} onOpenChange={setShowAddCourseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une formation</DialogTitle>
            <DialogDescription>
              Enregistrez une formation complétée pour suivre votre progression
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="courseTitle">Titre de la formation *</Label>
              <Input
                id="courseTitle"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                placeholder="Ex: Certification chauffe-eau haute efficacité"
              />
            </div>

            <div>
              <Label htmlFor="provider">Fournisseur / Organisme *</Label>
              <Input
                id="provider"
                value={newCourse.provider}
                onChange={(e) => setNewCourse({ ...newCourse, provider: e.target.value })}
                placeholder="Ex: CMMTQ Formation"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hours">Heures *</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={newCourse.hours}
                  onChange={(e) => setNewCourse({ ...newCourse, hours: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="completedDate">Date de complétion *</Label>
                <Input
                  id="completedDate"
                  type="date"
                  value={newCourse.completedDate}
                  onChange={(e) => setNewCourse({ ...newCourse, completedDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Input
                id="category"
                value={newCourse.category}
                onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                placeholder="Ex: Sécurité, Technique, Réglementation"
              />
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <input
                type="checkbox"
                id="cmmtqApproved"
                checked={newCourse.cmmtqApproved}
                onChange={(e) => setNewCourse({ ...newCourse, cmmtqApproved: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="cmmtqApproved" className="font-normal cursor-pointer">
                Formation approuvée par la CMMTQ
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCourseDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddCourse}>
              Ajouter la formation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Dashboard widget for admin view
export function EducationDashboard({ technicians }: { technicians: Array<{ id: string; name: string; education: ContinuingEducation }> }) {
  const onTrack = technicians.filter(t => t.education.status === 'on-track' || t.education.status === 'completed').length;
  const atRisk = technicians.filter(t => t.education.status === 'at-risk').length;
  const overdue = technicians.filter(t => t.education.status === 'overdue').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En règle</p>
              <p className="text-2xl font-bold text-green-600">{onTrack}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">À risque</p>
              <p className="text-2xl font-bold text-yellow-600">{atRisk}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En retard</p>
              <p className="text-2xl font-bold text-red-600">{overdue}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
