import { Phone, Mail, MapPin, Star, Award, Clock, DollarSign, LogOut, Settings, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { mockTechnicians } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function MobileProfile() {
  const tech = mockTechnicians[0]; // Marc Tremblay
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    toast.success('Déconnexion réussie');
  };

  return (
    <div className="pb-4 bg-gray-50">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white p-6 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Profil</h1>
          <Button variant="ghost" size="icon" className="text-white">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-12">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-lg">
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">MT</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{tech.name}</h2>
              <Badge className="mt-2 bg-green-100 text-green-800">Technicien Senior</Badge>
              
              <div className="flex items-center gap-1 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.floor(tech.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 font-semibold">{tech.rating}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{tech.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{tech.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{tech.location.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-xs text-muted-foreground">Travaux complétés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">98.5%</p>
              <p className="text-xs text-muted-foreground">Taux complétion</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-bold">$89k</p>
              <p className="text-xs text-muted-foreground">Revenus générés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-amber-400 fill-amber-400" />
              <p className="text-2xl font-bold">4.9</p>
              <p className="text-xs text-muted-foreground">Note moyenne</p>
            </CardContent>
          </Card>
        </div>

        {/* Skills */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Compétences</h3>
            <div className="flex flex-wrap gap-2">
              {tech.skills.map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
              <Badge variant="outline">Certification QC-2025</Badge>
              <Badge variant="outline">RBQ</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Menu Actions */}
        <Card className="mt-4">
          <CardContent className="p-0">
            {[
              { icon: Clock, label: 'Mes horaires', action: () => {} },
              { icon: Award, label: 'Mes certifications', action: () => {} },
              { icon: HelpCircle, label: 'Aide & Support', action: () => {} },
              { icon: Settings, label: 'Paramètres', action: () => {} }
            ].map((item, idx) => (
              <div key={idx}>
                <button
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                  onClick={item.action}
                >
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className="text-muted-foreground">›</span>
                </button>
                {idx < 3 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full mt-4 text-red-600 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Se déconnecter
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Version 1.0.0 • © 2025 Plomberie D'Experts
        </p>
      </div>
    </div>
  );
}