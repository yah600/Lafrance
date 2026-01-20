import { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Camera, Save, Building2, 
  UserCircle, Shield, Clock, AlertCircle, Plus, Trash2, Edit2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

interface ServiceAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  propertyType: 'residential' | 'commercial';
  isPrimary: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

interface ActivityLog {
  id: string;
  type: 'login' | 'profile_update' | 'service_request' | 'payment' | 'password_change';
  description: string;
  timestamp: Date;
  ipAddress?: string;
}

export default function ClientProfile() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Profile Information
  const [profile, setProfile] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: user?.email || 'client@example.com',
    phone: '514-555-0123',
    alternatePhone: '514-555-0124',
    dateOfBirth: '1985-06-15',
    preferredLanguage: 'fr' as 'fr' | 'en',
    companyName: '',
    taxNumber: '',
  });

  // Service Addresses
  const [addresses, setAddresses] = useState<ServiceAddress[]>([
    {
      id: '1',
      label: 'Résidence principale',
      address: '123 Rue Principale',
      city: 'Montréal',
      province: 'QC',
      postalCode: 'H1A 1A1',
      propertyType: 'residential',
      isPrimary: true,
    },
  ]);

  // Emergency Contacts
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Marie Dupont',
      relationship: 'Conjoint(e)',
      phone: '514-555-0125',
      email: 'marie.dupont@email.com',
    },
  ]);

  // Activity Log
  const [activityLog] = useState<ActivityLog[]>([
    {
      id: '1',
      type: 'login',
      description: 'Connexion au portail client',
      timestamp: new Date('2025-12-17T09:30:00'),
      ipAddress: '192.168.1.100',
    },
    {
      id: '2',
      type: 'service_request',
      description: 'Nouvelle demande de service: Fuite d\'eau',
      timestamp: new Date('2025-12-16T14:22:00'),
    },
    {
      id: '3',
      type: 'payment',
      description: 'Paiement de facture #INV-2025-0234',
      timestamp: new Date('2025-12-15T11:15:00'),
    },
    {
      id: '4',
      type: 'profile_update',
      description: 'Mise à jour des informations de profil',
      timestamp: new Date('2025-12-10T16:45:00'),
    },
  ]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        toast.success('Photo de profil mise à jour');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('clientProfile', JSON.stringify(profile));
    toast.success('Profil mis à jour avec succès!');
    setIsSaving(false);
  };

  const handleAddAddress = () => {
    const newAddress: ServiceAddress = {
      id: Date.now().toString(),
      label: 'Nouvelle adresse',
      address: '',
      city: '',
      province: 'QC',
      postalCode: '',
      propertyType: 'residential',
      isPrimary: false,
    };
    setAddresses([...addresses, newAddress]);
  };

  const handleDeleteAddress = (id: string) => {
    if (addresses.length === 1) {
      toast.error('Vous devez avoir au moins une adresse');
      return;
    }
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast.success('Adresse supprimée');
  };

  const handleSetPrimaryAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isPrimary: addr.id === id,
    })));
    toast.success('Adresse principale mise à jour');
  };

  const handleAddEmergencyContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      phone: '',
      email: '',
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
  };

  const handleDeleteEmergencyContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
    toast.success('Contact d\'urgence supprimé');
  };

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'login':
        return <Shield className="h-4 w-4" />;
      case 'profile_update':
        return <Edit2 className="h-4 w-4" />;
      case 'service_request':
        return <AlertCircle className="h-4 w-4" />;
      case 'payment':
        return <Clock className="h-4 w-4" />;
      case 'password_change':
        return <Shield className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'login':
        return 'text-blue-600 bg-blue-100';
      case 'profile_update':
        return 'text-green-600 bg-green-100';
      case 'service_request':
        return 'text-orange-600 bg-orange-100';
      case 'payment':
        return 'text-purple-600 bg-purple-100';
      case 'password_change':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-600 mt-1">Gérez vos informations personnelles et préférences</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full lg:w-auto">
          <TabsTrigger value="personal">
            <User className="h-4 w-4 mr-2" />
            Personnel
          </TabsTrigger>
          <TabsTrigger value="addresses">
            <MapPin className="h-4 w-4 mr-2" />
            Adresses
          </TabsTrigger>
          <TabsTrigger value="emergency">
            <Phone className="h-4 w-4 mr-2" />
            Urgences
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Clock className="h-4 w-4 mr-2" />
            Activité
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          {/* Avatar & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
              <CardDescription>Votre photo sera visible dans toutes vos interactions</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt={user?.name} />
                  ) : (
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                      {getInitials(profile.firstName, profile.lastName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-[var(--primary)] text-white p-2 rounded-full cursor-pointer hover:bg-[var(--primary)]/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-gray-600">{profile.email}</p>
                <Badge variant="outline" className="mt-2">
                  <UserCircle className="h-3 w-3 mr-1" />
                  Client vérifié
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom de famille</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone principal</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">Téléphone secondaire</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <Input
                      id="alternatePhone"
                      type="tel"
                      value={profile.alternatePhone}
                      onChange={(e) => setProfile({ ...profile, alternatePhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date de naissance</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Langue préférée</Label>
                  <Select
                    value={profile.preferredLanguage}
                    onValueChange={(value: 'fr' | 'en') => setProfile({ ...profile, preferredLanguage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise (optionnel)</Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <Input
                      id="companyName"
                      value={profile.companyName}
                      onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                      placeholder="Si client commercial"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSaveProfile} 
                disabled={isSaving}
                className="w-full md:w-auto"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Addresses Tab */}
        <TabsContent value="addresses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Adresses de service
                  </CardTitle>
                  <CardDescription>Gérez vos adresses pour les interventions</CardDescription>
                </div>
                <Button onClick={handleAddAddress} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une adresse
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {addresses.map((address, index) => (
                <div key={address.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Input
                        value={address.label}
                        onChange={(e) => {
                          const updated = [...addresses];
                          updated[index].label = e.target.value;
                          setAddresses(updated);
                        }}
                        placeholder="Nom de l'adresse"
                        className="max-w-xs"
                      />
                      <div className="flex items-center gap-2">
                        {address.isPrimary ? (
                          <Badge variant="default">Principale</Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetPrimaryAddress(address.id)}
                          >
                            Définir comme principale
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAddress(address.id)}
                          disabled={addresses.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type de propriété</Label>
                        <Select
                          value={address.propertyType}
                          onValueChange={(value: 'residential' | 'commercial') => {
                            const updated = [...addresses];
                            updated[index].propertyType = value;
                            setAddresses(updated);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">Résidentiel</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Adresse</Label>
                        <Input
                          value={address.address}
                          onChange={(e) => {
                            const updated = [...addresses];
                            updated[index].address = e.target.value;
                            setAddresses(updated);
                          }}
                          placeholder="123 Rue Principale"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Ville</Label>
                        <Input
                          value={address.city}
                          onChange={(e) => {
                            const updated = [...addresses];
                            updated[index].city = e.target.value;
                            setAddresses(updated);
                          }}
                          placeholder="Montréal"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Province</Label>
                          <Select
                            value={address.province}
                            onValueChange={(value) => {
                              const updated = [...addresses];
                              updated[index].province = value;
                              setAddresses(updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="QC">QC</SelectItem>
                              <SelectItem value="ON">ON</SelectItem>
                              <SelectItem value="BC">BC</SelectItem>
                              <SelectItem value="AB">AB</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Code postal</Label>
                          <Input
                            value={address.postalCode}
                            onChange={(e) => {
                              const updated = [...addresses];
                              updated[index].postalCode = e.target.value;
                              setAddresses(updated);
                            }}
                            placeholder="H1A 1A1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contacts Tab */}
        <TabsContent value="emergency" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contacts d'urgence
                  </CardTitle>
                  <CardDescription>
                    Personnes à contacter en cas d'urgence ou d'absence
                  </CardDescription>
                </div>
                <Button onClick={handleAddEmergencyContact} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un contact
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div key={contact.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Contact #{index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEmergencyContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nom complet</Label>
                        <Input
                          value={contact.name}
                          onChange={(e) => {
                            const updated = [...emergencyContacts];
                            updated[index].name = e.target.value;
                            setEmergencyContacts(updated);
                          }}
                          placeholder="Nom du contact"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Lien de parenté</Label>
                        <Input
                          value={contact.relationship}
                          onChange={(e) => {
                            const updated = [...emergencyContacts];
                            updated[index].relationship = e.target.value;
                            setEmergencyContacts(updated);
                          }}
                          placeholder="Ex: Conjoint(e), Parent, Ami(e)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => {
                            const updated = [...emergencyContacts];
                            updated[index].phone = e.target.value;
                            setEmergencyContacts(updated);
                          }}
                          placeholder="514-555-0123"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email (optionnel)</Label>
                        <Input
                          type="email"
                          value={contact.email}
                          onChange={(e) => {
                            const updated = [...emergencyContacts];
                            updated[index].email = e.target.value;
                            setEmergencyContacts(updated);
                          }}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {emergencyContacts.length === 0 && (
                <div className="text-center py-12">
                  <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucun contact d'urgence configuré</p>
                  <Button onClick={handleAddEmergencyContact}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter votre premier contact
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Journal d'activité
              </CardTitle>
              <CardDescription>
                Historique de vos actions sur le portail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.map((activity, index) => (
                  <div key={activity.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(activity.timestamp)}
                        </p>
                        {activity.ipAddress && (
                          <p className="text-xs text-gray-500 mt-1">
                            IP: {activity.ipAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
