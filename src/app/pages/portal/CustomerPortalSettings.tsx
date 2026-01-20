import { Save, Upload, Bell, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';

export default function CustomerPortalSettings() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Paramètres du compte</h2>
        <p className="text-muted-foreground">Gérez vos informations personnelles et préférences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input defaultValue="Jean" />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input defaultValue="Dupont" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" defaultValue="jean.dupont@email.com" />
          </div>
          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input type="tel" defaultValue="+1 514-555-0123" />
          </div>
          <div className="space-y-2">
            <Label>Adresse</Label>
            <Input defaultValue="123 Rue Principale, Montréal, QC H2X 1Y5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Rappels de rendez-vous', desc: 'Email 24h avant' },
            { label: 'Arrivée du technicien', desc: 'SMS quand le technicien est en route' },
            { label: 'Factures', desc: 'Notifications pour nouvelles factures' },
            { label: 'Promotions', desc: 'Offres spéciales et récompenses' }
          ].map((notif, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{notif.label}</p>
                <p className="text-sm text-muted-foreground">{notif.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Changer le mot de passe
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Activer l'authentification à deux facteurs
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1">Annuler</Button>
        <Button className="flex-1 bg-[var(--primary)]">
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
