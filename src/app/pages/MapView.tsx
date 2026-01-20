import { Navigation, Layers, ZoomIn, ZoomOut, MapPin, Clock, Route, RefreshCw, Users, Activity, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { useApp } from '../context/AppContext';
import { AssignJobModal } from '../components/modals/AssignJobModal';
import { toast } from 'sonner';

export default function MapView() {
  const { technicians, jobs } = useApp();
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [assignJobOpen, setAssignJobOpen] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showZones, setShowZones] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [mapZoom, setMapZoom] = useState(12);
  const [mapCenter, setMapCenter] = useState({ lat: 45.5017, lng: -73.5673 });

  const selectedTech = selectedTechId ? technicians.find(t => t.id === selectedTechId) : null;
  const activeTechs = technicians.filter(t => t.status !== 'off-duty');

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In production, this would fetch latest GPS positions
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    toast.success('Positions mises à jour');
  };

  const handleAssignJob = () => {
    if (!selectedTech) return;
    setAssignJobOpen(true);
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 8));
  };

  const handleRecenter = () => {
    setMapCenter({ lat: 45.5017, lng: -73.5673 });
    toast.success('Carte recentrée sur Montréal');
  };

  const handleCallTech = (phone: string) => {
    window.location.href = `tel:${phone}`;
    toast.success('Appel en cours...');
  };

  const statusConfig = {
    available: { 
      label: 'Disponible', 
      color: '#28A745', 
      textColor: 'text-green-800',
      bgColor: 'bg-green-100',
      dotColor: 'bg-green-500'
    },
    busy: { 
      label: 'Occupé', 
      color: '#E67E22', 
      textColor: 'text-orange-800',
      bgColor: 'bg-orange-100',
      dotColor: 'bg-orange-500'
    },
    'en-route': { 
      label: 'En route', 
      color: '#2E86AB', 
      textColor: 'text-blue-800',
      bgColor: 'bg-blue-100',
      dotColor: 'bg-blue-500'
    },
    'off-duty': { 
      label: 'Hors service', 
      color: '#6C757D', 
      textColor: 'text-gray-800',
      bgColor: 'bg-gray-100',
      dotColor: 'bg-gray-500'
    }
  };

  // Calculate tech position based on index (simulate GPS coordinates)
  const getTechPosition = (index: number) => {
    const positions = [
      { left: 25, top: 30 },
      { left: 45, top: 45 },
      { left: 65, top: 25 },
      { left: 35, top: 60 },
      { left: 55, top: 70 },
      { left: 75, top: 50 },
      { left: 20, top: 75 },
      { left: 80, top: 35 }
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* Assign Job Modal */}
      {selectedTech && (
        <AssignJobModal
          open={assignJobOpen}
          onOpenChange={setAssignJobOpen}
          technicianId={selectedTech.id}
          technicianName={selectedTech.name}
        />
      )}

      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        {/* Street Grid */}
        <div className="absolute inset-0 opacity-30">
          {/* Horizontal streets */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(top => (
            <div 
              key={`h-${top}`} 
              className="absolute left-0 right-0 h-px bg-gray-400"
              style={{ top: `${top}%` }}
            />
          ))}
          {/* Vertical streets */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(left => (
            <div 
              key={`v-${left}`} 
              className="absolute top-0 bottom-0 w-px bg-gray-400"
              style={{ left: `${left}%` }}
            />
          ))}
        </div>

        {/* Service Zones (if enabled) */}
        {showZones && (
          <>
            <div className="absolute rounded-full bg-blue-200/20 border-2 border-blue-300/40" style={{ left: '15%', top: '20%', width: '300px', height: '300px' }} />
            <div className="absolute rounded-full bg-green-200/20 border-2 border-green-300/40" style={{ left: '50%', top: '40%', width: '350px', height: '350px' }} />
            <div className="absolute rounded-full bg-purple-200/20 border-2 border-purple-300/40" style={{ left: '30%', top: '55%', width: '280px', height: '280px' }} />
          </>
        )}

        {/* Routes (if enabled) */}
        {showRoutes && (
          <svg className="absolute inset-0 pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#2E86AB" />
              </marker>
            </defs>
            {activeTechs.slice(0, 3).map((tech, i) => {
              const start = getTechPosition(i);
              const end = getTechPosition((i + 1) % activeTechs.length);
              return (
                <line
                  key={tech.id}
                  x1={`${start.left}%`}
                  y1={`${start.top}%`}
                  x2={`${end.left}%`}
                  y2={`${end.top}%`}
                  stroke="#2E86AB"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                  opacity="0.4"
                />
              );
            })}
          </svg>
        )}

        {/* Technician Markers */}
        {activeTechs.map((tech, index) => {
          const position = getTechPosition(index);
          const status = statusConfig[tech.status];
          const isSelected = selectedTechId === tech.id;
          const techJobs = jobs.filter(j => j.technicianId === tech.id);
          const activeJob = techJobs.find(j => j.status === 'in-progress' || j.status === 'en-route');

          return (
            <div
              key={tech.id}
              className="absolute group cursor-pointer z-20"
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => setSelectedTechId(isSelected ? null : tech.id)}
            >
              {/* Pulse animation for active techs */}
              {tech.status !== 'available' && (
                <div 
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ 
                    backgroundColor: status.color,
                    opacity: 0.3,
                    width: '48px',
                    height: '48px',
                    margin: '-12px'
                  }}
                />
              )}

              {/* Marker */}
              <div 
                className={`w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center font-bold text-white transition-all ${
                  isSelected ? 'scale-125 ring-4 ring-blue-400 ring-offset-2' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: status.color }}
              >
                {tech.name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Active job indicator */}
              {activeJob && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                  <Activity className="h-3 w-3 text-white" />
                </div>
              )}

              {/* Hover/Selected Popup */}
              {(isSelected || (!selectedTechId && true)) && (
                <Card className={`absolute left-14 top-0 w-80 transition-all shadow-2xl ${
                  isSelected ? 'opacity-100 z-50' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{tech.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{tech.email}</p>
                      </div>
                      <Badge className={status.bgColor + ' ' + status.textColor}>
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Performance */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Travaux aujourd'hui</span>
                        <span className="font-semibold">{tech.completedJobs}/{tech.todayJobs}</span>
                      </div>
                      <Progress value={(tech.completedJobs / tech.todayJobs) * 100} className="h-2" />
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Position actuelle</p>
                        <p className="text-muted-foreground">{tech.location.address}</p>
                      </div>
                    </div>

                    {/* Active Job */}
                    {activeJob && (
                      <div className="flex items-start gap-2 text-sm bg-blue-50 p-3 rounded-lg">
                        <Route className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-blue-900">Travail en cours</p>
                          <p className="text-blue-700">{activeJob.client.name}</p>
                          <p className="text-xs text-blue-600 mt-1">ETA: {activeJob.scheduledTime}</p>
                        </div>
                      </div>
                    )}

                    {/* ETA to next job */}
                    {tech.status === 'en-route' && (
                      <div className="flex items-center gap-2 text-sm bg-purple-50 p-2 rounded">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span className="text-purple-900">Arrivée prévue: ~{Math.floor(Math.random() * 20 + 5)} min</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCallTech(tech.phone);
                        }}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Appeler
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssignJob();
                        }}
                      >
                        Assigner
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>

      {/* Top Stats Bar */}
      <Card className="absolute top-4 left-1/2 transform -translate-x-1/2 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Actifs</p>
                <p className="text-xl font-bold">{activeTechs.length}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">{technicians.filter(t => t.status === 'available').length} Disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm font-medium">{technicians.filter(t => t.status === 'busy').length} Occupés</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm font-medium">{technicians.filter(t => t.status === 'en-route').length} En route</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button 
          size="icon" 
          variant="secondary" 
          className="shadow-lg"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button 
          size="icon" 
          variant="secondary" 
          className="shadow-lg"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button 
          size="icon" 
          variant="secondary" 
          className="shadow-lg"
          onClick={handleRecenter}
        >
          <Navigation className="h-5 w-5" />
        </Button>
        <Button 
          size="icon" 
          variant="secondary" 
          className="shadow-lg hover:bg-blue-100"
          onClick={handleRefresh}
        >
          <RefreshCw className={`h-5 w-5 ${autoRefresh ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Layer Controls */}
      <Card className="absolute bottom-4 left-4 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Affichage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="traffic" className="cursor-pointer">Trafic temps réel</Label>
            <Switch 
              id="traffic" 
              checked={showTraffic}
              onCheckedChange={setShowTraffic}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="zones" className="cursor-pointer">Zones de service</Label>
            <Switch 
              id="zones" 
              checked={showZones}
              onCheckedChange={setShowZones}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="routes" className="cursor-pointer">Routes optimisées</Label>
            <Switch 
              id="routes" 
              checked={showRoutes}
              onCheckedChange={setShowRoutes}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-refresh" className="cursor-pointer">Mise à jour auto</Label>
            <Switch 
              id="auto-refresh" 
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-CA')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="absolute bottom-4 right-4 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Légende</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(statusConfig).filter(([key]) => key !== 'off-duty').map(([key, config]) => (
            <div key={key} className="flex items-center gap-3 text-sm">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: config.color }}
              />
              <span className="flex-1">{config.label}</span>
              <span className="font-semibold text-muted-foreground">
                {technicians.filter(t => t.status === key).length}
              </span>
            </div>
          ))}
          <div className="pt-2 border-t mt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              <span>Badge rouge = Travail en cours</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}