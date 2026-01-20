import { Calendar, CheckCircle, Clock, DollarSign, Wrench, Star, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';

export default function CustomerPortalHome() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-[var(--primary)] to-blue-600 text-white">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold mb-2">Bienvenue, Jean! 👋</h2>
          <p className="text-blue-100 mb-6">
            Gérez vos services de plomberie en toute simplicité
          </p>
          <div className="flex gap-4">
            <Button variant="secondary" size="lg">
              <Calendar className="h-5 w-5 mr-2" />
              Réserver un service
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white/20">
              Voir mes factures
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Services actifs</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Services complétés</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Factures payées</p>
                <p className="text-3xl font-bold">$3,450</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Satisfaction</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold">4.9</p>
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                </div>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rendez-vous à venir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Active Appointment */}
            <div className="p-4 bg-green-50 border-l-4 border-l-green-500 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge className="bg-green-600 mb-2">EN ROUTE</Badge>
                  <h3 className="font-bold text-lg">Installation chauffe-eau</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Aujourd'hui • 14:00 - 16:00
                  </p>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Suivre en temps réel
                </Button>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marc" 
                    alt="Technicien"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">Marc Tremblay</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-muted-foreground">4.8/5 • Plombier expert</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Arrivée estimée dans</span>
                  <span className="font-semibold">15 min</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>

            {/* Next Appointment */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">PLANIFIÉ</Badge>
                  <h3 className="font-bold">Inspection annuelle</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    23 décembre 2025 • 10:00 - 11:00
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Planifier un nouveau service
            </Button>
          </CardContent>
        </Card>

        {/* Equipment & Loyalty */}
        <div className="space-y-6">
          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Mes équipements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm">Chauffe-eau</p>
                  <Badge variant="outline" className="text-xs">Garanti</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  American Standard • Installé 2020
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✓ Prochain entretien: Mars 2026
                </p>
              </div>

              <div className="p-3 bg-yellow-50 border-l-2 border-yellow-500 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm">Tuyauterie principale</p>
                  <Badge variant="outline" className="text-xs bg-yellow-100">Alerte</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Inspection recommandée
                </p>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Planifier inspection
                </Button>
              </div>

              <Button variant="ghost" className="w-full text-sm">
                Voir tous les équipements <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Loyalty Program */}
          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Programme fidélité</h3>
                <Badge variant="secondary">Premium</Badge>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Points accumulés</span>
                  <span className="font-bold">850 / 1000</span>
                </div>
                <Progress value={85} className="h-2 bg-white/20" />
              </div>

              <p className="text-sm text-purple-100 mb-4">
                Plus que 150 points pour débloquer une récompense!
              </p>

              <Button variant="secondary" size="sm" className="w-full">
                Voir mes récompenses
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Historique récent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: '2025-12-10', service: 'Débouchage drain', technician: 'Marc Tremblay', status: 'completed', amount: 150 },
              { date: '2025-11-28', service: 'Remplacement chauffe-eau', technician: 'Sophie Martin', status: 'completed', amount: 1200 },
              { date: '2025-10-15', service: 'Réparation robinet', technician: 'Marc Tremblay', status: 'completed', amount: 120 }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.date} • {item.technician}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${item.amount}</p>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Complété
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
