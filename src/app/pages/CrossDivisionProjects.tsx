/**
 * Cross-Division Project Coordination
 * Implements update.md Section 3.6 - Multi-Service Job Orchestration
 * 
 * Example scenario from update.md:
 * Client needs roof replacement + new gutters + attic insulation
 * System creates 3 linked jobs across divisions with sequencing
 */

import { useState } from 'react';
import { Plus, Link2, Calendar, DollarSign, Users, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { DIVISIONS } from '../data/divisions';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface ProjectPhase {
  id: string;
  division: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'blocked';
  assignedTo?: string;
  startDate?: string;
  completionDate?: string;
  dependencies?: string[];
  estimatedCost: number;
}

interface CrossDivisionProject {
  id: string;
  clientName: string;
  address: string;
  phases: ProjectPhase[];
  totalCost: number;
  status: 'planning' | 'in-progress' | 'completed';
  sharedResources?: string[];
  createdAt: string;
}

export default function CrossDivisionProjects() {
  const { user, activeDivision } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);

  // Mock cross-division projects
  const [projects, setProjects] = useState<CrossDivisionProject[]>([
    {
      id: 'CDP-001',
      clientName: 'Marie Leclerc',
      address: '123 rue des Érables, Longueuil',
      totalCost: 32500,
      status: 'in-progress',
      createdAt: '2026-01-10',
      sharedResources: ['Conteneur 20yd (Mira) - Jan 14-20'],
      phases: [
        {
          id: 'phase-1',
          division: 'isolation',
          description: 'Isolation de grenier - Upgrade R-50',
          status: 'completed',
          assignedTo: 'Mike Turmel',
          startDate: '2026-01-12',
          completionDate: '2026-01-12',
          estimatedCost: 1800,
        },
        {
          id: 'phase-2',
          division: 'toitures',
          description: 'Remplacement complet toiture - Bardeau asphalte',
          status: 'active',
          assignedTo: 'Jonathan Isabel',
          startDate: '2026-01-14',
          dependencies: ['phase-1'],
          estimatedCost: 18200,
        },
        {
          id: 'phase-3',
          division: 'gutters',
          description: 'Installation gouttières sans soudure',
          status: 'pending',
          dependencies: ['phase-2'],
          estimatedCost: 3500,
        },
      ],
    },
    {
      id: 'CDP-002',
      clientName: 'Jean Dupont',
      address: '456 Avenue du Parc, Montréal',
      totalCost: 15800,
      status: 'planning',
      createdAt: '2026-01-15',
      phases: [
        {
          id: 'phase-1',
          division: 'plomberie',
          description: 'Remplacement chauffe-eau + nouvelles vannes',
          status: 'pending',
          estimatedCost: 2200,
        },
        {
          id: 'phase-2',
          division: 'construction',
          description: 'Rénovation salle de bain complète',
          status: 'pending',
          dependencies: ['phase-1'],
          estimatedCost: 12000,
        },
        {
          id: 'phase-3',
          division: 'isolation',
          description: 'Isolation murs extérieurs',
          status: 'pending',
          estimatedCost: 1600,
        },
      ],
    },
  ]);

  const getDivisionColor = (divisionId: string) => {
    const colors: Record<string, string> = {
      'plomberie': '#2B5A8E',
      'construction': '#1C3D5A',
      'toitures': '#8B4513',
      'isolation': '#FF8C00',
      'conteneurs': '#4A7C59',
      'gutters': '#708090',
      'decks': '#8B7355',
      'real-estate': '#DAA520',
    };
    return colors[divisionId] || '#2B5A8E';
  };

  const getDivisionName = (divisionId: string) => {
    const division = DIVISIONS.find(d => d.id === divisionId);
    return division?.nameFr || divisionId;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'active': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'blocked': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'completed': { className: 'bg-green-100 text-green-800', label: '✓ Terminé' },
      'active': { className: 'bg-blue-100 text-blue-800', label: '→ En cours' },
      'pending': { className: 'bg-gray-100 text-gray-800', label: '○ En attente' },
      'blocked': { className: 'bg-red-100 text-red-800', label: '⊗ Bloqué' },
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const handleCreateProject = () => {
    toast.success('Projet multi-division créé avec succès!');
    setCreateModalOpen(false);
  };

  const toggleDivision = (divisionId: string) => {
    setSelectedDivisions(prev => 
      prev.includes(divisionId) 
        ? prev.filter(d => d !== divisionId)
        : [...prev, divisionId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projets Multi-Divisions</h1>
          <p className="text-gray-600">Coordination de projets complexes nécessitant plusieurs divisions</p>
        </div>
        
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau projet multi-division
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un projet multi-division</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nom du client *</Label>
                <Input placeholder="Nom complet" />
              </div>
              <div>
                <Label>Adresse de la propriété *</Label>
                <Input placeholder="123 rue Principale, Ville" />
              </div>
              
              <div>
                <Label className="mb-3 block">Divisions impliquées *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {DIVISIONS.filter(d => d.active).map(division => (
                    <div
                      key={division.id}
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedDivisions.includes(division.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleDivision(division.id)}
                    >
                      <Checkbox
                        checked={selectedDivisions.includes(division.id)}
                        onCheckedChange={() => toggleDivision(division.id)}
                      />
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getDivisionColor(division.id) }}
                        />
                        <span className="text-sm font-medium">{division.nameFr.split(' ').slice(-1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Sélectionnez {selectedDivisions.length} division{selectedDivisions.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleCreateProject} className="flex-1" disabled={selectedDivisions.length < 2}>
                  Créer le projet
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter(p => p.status === 'in-progress').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En planification</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter(p => p.status === 'planning').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur totale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${projects.reduce((sum, p) => sum + p.totalCost, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Divisions impliquées</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(projects.flatMap(p => p.phases.map(ph => ph.division))).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map(project => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{project.clientName}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <span>{project.address}</span>
                    <Badge variant="outline">{project.id}</Badge>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${project.totalCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Coût total</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              {/* Project Timeline */}
              <div className="space-y-4">
                {project.phases.map((phase, index) => {
                  const isBlocked = phase.dependencies?.some(depId => {
                    const dep = project.phases.find(p => p.id === depId);
                    return dep?.status !== 'completed';
                  });
                  const actualStatus = isBlocked ? 'blocked' : phase.status;
                  
                  return (
                    <div key={phase.id} className="relative">
                      {/* Connector line */}
                      {index < project.phases.length - 1 && (
                        <div className="absolute left-5 top-12 w-0.5 h-8 bg-gray-200" />
                      )}
                      
                      <div className="flex items-start gap-4">
                        {/* Status indicator */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white"
                          style={{ borderColor: getDivisionColor(phase.division) }}>
                          {getStatusIcon(actualStatus)}
                        </div>
                        
                        {/* Phase content */}
                        <div className="flex-1 pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: getDivisionColor(phase.division) }}
                                />
                                <span className="font-semibold text-gray-900">
                                  {getDivisionName(phase.division)}
                                </span>
                                {getStatusBadge(actualStatus)}
                              </div>
                              
                              <p className="text-gray-700 mb-2">{phase.description}</p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {phase.assignedTo && (
                                  <span>👤 {phase.assignedTo}</span>
                                )}
                                {phase.startDate && (
                                  <span>📅 Début: {new Date(phase.startDate).toLocaleDateString('fr-CA')}</span>
                                )}
                                {phase.completionDate && (
                                  <span>✓ Complété: {new Date(phase.completionDate).toLocaleDateString('fr-CA')}</span>
                                )}
                                {phase.dependencies && phase.dependencies.length > 0 && (
                                  <span className="text-orange-600">
                                    ⚠️ Dépend de l'étape précédente
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                ${phase.estimatedCost.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shared Resources */}
              {project.sharedResources && project.sharedResources.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-blue-900">Ressources partagées:</div>
                      <ul className="text-sm text-blue-700 mt-1">
                        {project.sharedResources.map((resource, i) => (
                          <li key={i}>• {resource}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Client Payment Status */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Paiement client</div>
                    <div className="text-xs text-gray-500">30% acompte payé ✓ | 70% dû à la complétion</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      ${(project.totalCost * 0.3).toLocaleString()} reçu
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
