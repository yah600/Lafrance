import { Building2, Users, Briefcase, MapPin, Clock, Bell, Link2, CreditCard, Shield, Code, Calendar, LogOut, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DocumentCompliance } from '../components/compliance/DocumentCompliance';
import { CompanyLegalInfo } from '../types/compliance';
import { useState } from 'react';

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [companyLegalInfo, setCompanyLegalInfo] = useState<CompanyLegalInfo | undefined>(undefined);

  const handleSave = () => {
    toast.success('Paramètres sauvegardés avec succès!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    toast.success('Déconnexion réussie');
  };

  const handleInviteUser = () => {
    toast.info('Invitation d\'utilisateur à venir');
  };

  const handleAddService = () => {
    toast.info('Ajout de service à venir');
  };

  const handleDeleteService = (serviceName: string) => {
    toast.info(`Suppression de ${serviceName} à venir`);
  };

  const handleConnectIntegration = (integrationName: string) => {
    toast.info(`Connexion à ${integrationName} à venir`);
  };

  const handleViewAuditLog = () => {
    toast.info('Journal d\'audit à venir');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">Gérez les paramètres de votre entreprise</p>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList>
          <TabsTrigger value="company">Entreprise</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
          <TabsTrigger value="conformite">Conformité</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil de l'entreprise</CardTitle>
              <CardDescription>Informations générales sur votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input id="companyName" defaultValue="Groupe G. Lafrance" />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue="+1 514-555-0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="info@plomberie.com" />
                </div>
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input id="website" defaultValue="www.plomberie.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" defaultValue="1234 Rue Principal, Montréal, QC H1A 1A1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tps">Numéro TPS</Label>
                  <Input id="tps" defaultValue="123456789 RT0001" />
                </div>
                <div>
                  <Label htmlFor="tvq">Numéro TVQ</Label>
                  <Input id="tvq" defaultValue="1234567890 TQ0001" />
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-4">Heures d'ouverture</h4>
                <div className="space-y-3">
                  {['Lundi-Vendredi', 'Samedi', 'Dimanche'].map((day) => (
                    <div key={day} className="grid grid-cols-3 gap-4 items-center">
                      <Label>{day}</Label>
                      <Input type="time" defaultValue="08:00" />
                      <Input type="time" defaultValue="17:00" />
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleSave}>Sauvegarder</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs & Rôles</CardTitle>
              <CardDescription>Gérez les accès et permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Admin User', email: 'admin@plomberie.com', role: 'Admin', status: 'Active' },
                  { name: 'Dispatcher 1', email: 'dispatch@plomberie.com', role: 'Dispatcher', status: 'Active' },
                  { name: 'Viewer User', email: 'viewer@plomberie.com', role: 'Viewer', status: 'Inactive' }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Select defaultValue={user.role}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Switch defaultChecked={user.status === 'Active'} />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4" onClick={handleInviteUser}>Inviter un utilisateur</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Services & Tarification</CardTitle>
              <CardDescription>Configurez vos services et prix</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Débouchage', price: 150, duration: 60 },
                  { name: 'Chauffe-eau', price: 1200, duration: 180 },
                  { name: 'Robinetterie', price: 250, duration: 90 },
                  { name: 'Urgence', price: 350, duration: 120 }
                ].map((service, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center p-4 border rounded-lg">
                    <Input defaultValue={service.name} />
                    <div>
                      <Input type="number" defaultValue={service.price} className="pl-6" />
                      <span className="absolute ml-2 mt-2 text-sm text-muted-foreground">$</span>
                    </div>
                    <div>
                      <Input type="number" defaultValue={service.duration} />
                      <span className="text-xs text-muted-foreground">minutes</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteService(service.name)}>Supprimer</Button>
                  </div>
                ))}
              </div>
              <Button className="mt-4" onClick={handleAddService}>Ajouter un service</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configurez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Email</h4>
                {[
                  'Nouveau travail créé',
                  'Travail complété',
                  'Paiement reçu',
                  'Avis client'
                ].map((notif) => (
                  <div key={notif} className="flex items-center justify-between">
                    <Label>{notif}</Label>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">SMS</h4>
                {[
                  'Urgence assignée',
                  'Technicien en retard',
                  'Client annule'
                ].map((notif) => (
                  <div key={notif} className="flex items-center justify-between">
                    <Label>{notif}</Label>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations</CardTitle>
              <CardDescription>Connectez vos outils externes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Google Calendar', icon: Calendar, status: 'Connecté', color: 'text-blue-600' },
                  { name: 'QuickBooks', icon: CreditCard, status: 'Non connecté', color: 'text-green-600' },
                  { name: 'Stripe', icon: CreditCard, status: 'Connecté', color: 'text-purple-600' },
                  { name: 'Twilio (SMS)', icon: Bell, status: 'Connecté', color: 'text-red-600' }
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <integration.icon className={`h-8 w-8 ${integration.color}`} />
                      <div>
                        <h4 className="font-semibold">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.status}</p>
                      </div>
                    </div>
                    <Button variant={integration.status === 'Connecté' ? 'outline' : 'default'} onClick={() => handleConnectIntegration(integration.name)}>
                      {integration.status === 'Connecté' ? 'Configurer' : 'Connecter'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Facturation</CardTitle>
              <CardDescription>Paramètres de facturation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoicePrefix">Préfixe facture</Label>
                  <Input id="invoicePrefix" defaultValue="INV" />
                </div>
                <div>
                  <Label htmlFor="invoiceNumber">Prochain numéro</Label>
                  <Input id="invoiceNumber" type="number" defaultValue="1001" />
                </div>
              </div>
              <div>
                <Label htmlFor="paymentTerms">Termes de paiement</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Immédiat</SelectItem>
                    <SelectItem value="15">Net 15 jours</SelectItem>
                    <SelectItem value="30">Net 30 jours</SelectItem>
                    <SelectItem value="60">Net 60 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Taxes</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="5" className="w-20" />
                    <span>% TPS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="9.975" className="w-20" />
                    <span>% TVQ</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleSave}>Sauvegarder</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conformité Tab */}
        <TabsContent value="conformite" className="space-y-6 mt-6">
          <DocumentCompliance 
            companyInfo={companyLegalInfo} 
            onSave={(info) => setCompanyLegalInfo(info)} 
          />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Paramètres de sécurité et d'accès</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Authentification</h4>
                <div className="flex items-center justify-between">
                  <Label>Authentification à deux facteurs (2FA)</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Forcer 2FA pour tous les utilisateurs</Label>
                  <Switch />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">Sessions</h4>
                <div>
                  <Label>Durée de session</Label>
                  <Select defaultValue="8">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 heure</SelectItem>
                      <SelectItem value="8">8 heures</SelectItem>
                      <SelectItem value="24">24 heures</SelectItem>
                      <SelectItem value="168">7 jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-4">Journal d'audit</h4>
                <p className="text-sm text-muted-foreground">
                  Voir toutes les actions effectuées dans le système
                </p>
                <Button variant="outline" className="mt-4" onClick={handleViewAuditLog}>Voir le journal</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Button variant="destructive" className="mt-6" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Déconnexion
      </Button>
    </div>
  );
}