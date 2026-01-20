import { ArrowLeft, Camera, FileText, DollarSign, CheckCircle2, Clock, Plus, X, AlertCircle, Phone, Mic, PauseCircle, PlayCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Progress } from '../../components/ui/progress';
import { Checkbox } from '../../components/ui/checkbox';
import { useApp } from '../../context/AppContext';

export default function MobileActiveJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs } = useApp();
  
  const [elapsed, setElapsed] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [partsUsed, setPartsUsed] = useState<{ name: string; cost: number }[]>([]);
  const [checklist, setChecklist] = useState([
    { id: 1, label: 'Arrivé sur place', checked: true },
    { id: 2, label: 'Diagnostic effectué', checked: true },
    { id: 3, label: 'Client informé du devis', checked: false },
    { id: 4, label: 'Travail effectué', checked: false },
    { id: 5, label: 'Test de fonctionnement', checked: false },
    { id: 6, label: 'Site nettoyé', checked: false },
  ]);

  const completedTasks = checklist.filter(item => item.checked).length;
  const progress = (completedTasks / checklist.length) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const job = jobs.find(j => j.id === id);

  if (!job) {
    return <div className="p-4">Travail non trouvé</div>;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    // Navigate to completion screen
    navigate(`/mobile/complete-job/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/mobile')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold flex-1">Travail en cours</h1>
        </div>

        {/* Timer */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Temps écoulé</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              {elapsed > 0 ? (
                <><PauseCircle className="h-4 w-4 mr-2" />Pause</>
              ) : (
                <><PlayCircle className="h-4 w-4 mr-2" />Reprendre</>
              )}
            </Button>
          </div>
          <p className="text-4xl font-bold font-mono">{formatTime(elapsed)}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Client Info Quick */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{job.client.name}</p>
                <p className="text-sm text-muted-foreground">{job.serviceType}</p>
              </div>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => window.open(`tel:${job.client.phone}`)}
              >
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold">Progression</span>
              <span className="text-muted-foreground">{completedTasks}/{checklist.length} tâches</span>
            </div>
            <Progress value={progress} className="h-2 mb-3" />
            <p className="text-sm text-muted-foreground">{Math.round(progress)}% complété</p>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Liste de contrôle
            </h2>
            <div className="space-y-3">
              {checklist.map(item => (
                <label 
                  key={item.id} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Checkbox 
                    checked={item.checked}
                    onCheckedChange={(checked) => {
                      setChecklist(prev => prev.map(i => 
                        i.id === item.id ? { ...i, checked: checked === true } : i
                      ));
                    }}
                  />
                  <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photos
            </h2>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              {photos.map((photo, idx) => (
                <div key={idx} className="aspect-square bg-gray-100 rounded-lg" />
              ))}
              <button className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors">
                <Camera className="h-6 w-6 mb-1" />
                <span className="text-xs">Ajouter</span>
              </button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Photos avant
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Photos après
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Notes
            </h2>
            <Textarea 
              placeholder="Ajoutez vos notes sur le travail effectué..."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button variant="outline" size="sm" className="mt-2">
              <Mic className="h-4 w-4 mr-2" />
              Note vocale
            </Button>
          </CardContent>
        </Card>

        {/* Materials Section */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-bold text-lg mb-4">Matériaux utilisés</h2>
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Tuyau PVC 2"</span>
                <span className="text-sm font-semibold">$45</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              + Ajouter matériel
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto">
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={() => {/* Pause/Break */}}
          >
            <PauseCircle className="h-5 w-5 mr-2" />
            Pause
          </Button>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleComplete}
            disabled={progress < 100}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Terminer
          </Button>
        </div>
      </div>
    </div>
  );
}