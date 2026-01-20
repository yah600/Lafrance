import { useState } from 'react';
import { CheckCircle, Building2, Users, MapPin, Clock, Zap, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Progress } from '../../components/ui/progress';

const TOTAL_STEPS = 5;

export default function Onboarding() {
  const [step, setStep] = useState(1);

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Étape {step} sur {TOTAL_STEPS}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        {step === 1 && (
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Sparkles className="h-12 w-12 text-[var(--primary)]" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Bienvenue sur la plateforme!
                </h2>
                <p className="text-lg text-gray-600">
                  Configurons votre compte en quelques étapes simples
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-5 w-5 text-[var(--primary)]" />
                    <h3 className="font-semibold">Configuration entreprise</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Informations de base</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-[var(--primary)]" />
                    <h3 className="font-semibold">Votre équipe</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Ajoutez des techniciens</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="h-5 w-5 text-[var(--primary)]" />
                    <h3 className="font-semibold">Zones de service</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Définissez vos zones</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-5 w-5 text-[var(--primary)]" />
                    <h3 className="font-semibold">Intégrations</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Connectez vos outils</p>
                </div>
              </div>

              <Button 
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90" 
                size="lg"
                onClick={() => setStep(2)}
              >
                Commencer la configuration
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Configuration de l'entreprise
                </h2>
                <p className="text-gray-600">
                  Confirmez les informations de votre entreprise
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company-name">Nom de l'entreprise</Label>
                    <Input id="company-name" defaultValue="Groupe G. Lafrance" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" placeholder="+1 514-555-0000" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" placeholder="123 Rue Principale, Montréal, QC" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email de contact</Label>
                    <Input id="email" type="email" placeholder="contact@plomberie.com" />
                  </div>
                  <div>
                    <Label htmlFor="website">Site web</Label>
                    <Input id="website" type="url" placeholder="www.plomberie.com" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tps">Numéro TPS</Label>
                    <Input id="tps" placeholder="123456789 RT0001" />
                  </div>
                  <div>
                    <Label htmlFor="tvq">Numéro TVQ</Label>
                    <Input id="tvq" placeholder="1234567890 TQ0001" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Retour
                  </Button>
                  <Button 
                    className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                    onClick={() => setStep(3)}
                  >
                    Suivant
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ajoutez votre équipe
                </h2>
                <p className="text-gray-600">
                  Commencez à ajouter vos techniciens (vous pourrez en ajouter d'autres plus tard)
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {[1, 2].map((idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`tech-name-${idx}`}>Nom complet</Label>
                        <Input id={`tech-name-${idx}`} placeholder="Marc Tremblay" />
                      </div>
                      <div>
                        <Label htmlFor={`tech-phone-${idx}`}>Téléphone</Label>
                        <Input id={`tech-phone-${idx}`} type="tel" placeholder="+1 514-555-0000" />
                      </div>
                      <div>
                        <Label htmlFor={`tech-email-${idx}`}>Email</Label>
                        <Input id={`tech-email-${idx}`} type="email" placeholder="technicien@email.com" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mb-6">
                + Ajouter un technicien
              </Button>

              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">Ou</p>
              </div>

              <Button variant="outline" className="w-full mb-6">
                Importer depuis un fichier CSV
              </Button>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Retour
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setStep(4)}
                >
                  Passer cette étape
                </Button>
                <Button 
                  className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                  onClick={() => setStep(4)}
                >
                  Suivant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Définissez vos zones de service
                </h2>
                <p className="text-gray-600">
                  Indiquez les zones géographiques que vous desservez
                </p>
              </div>

              <div className="mb-6">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-[var(--primary)] mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Carte interactive (simulation)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="postal-codes">Codes postaux</Label>
                  <Textarea 
                    id="postal-codes" 
                    placeholder="H1A, H1B, H1C, H2A, H2B..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Séparez les codes postaux par des virgules
                  </p>
                </div>

                <div>
                  <Label htmlFor="service-radius">Rayon de service (km)</Label>
                  <Input id="service-radius" type="number" defaultValue="50" />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Retour
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setStep(5)}
                >
                  Passer cette étape
                </Button>
                <Button 
                  className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                  onClick={() => setStep(5)}
                >
                  Suivant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 5 && (
          <Card>
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Connectez vos outils
                </h2>
                <p className="text-gray-600">
                  Intégrez vos applications préférées (optionnel)
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  { name: 'Google Calendar', desc: 'Synchronisez vos rendez-vous', icon: '📅' },
                  { name: 'Microsoft Outlook', desc: 'Synchronisez votre calendrier', icon: '📧' },
                  { name: 'QuickBooks', desc: 'Gestion comptable automatique', icon: '💰' },
                  { name: 'Stripe', desc: 'Acceptez les paiements en ligne', icon: '💳' },
                  { name: 'Twilio', desc: 'Envoi de SMS automatiques', icon: '📱' }
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <h4 className="font-semibold">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.desc}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connecter
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(4)}>
                  Retour
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.location.href = '/'}
                >
                  Passer cette étape
                </Button>
                <Button 
                  className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                  onClick={() => window.location.href = '/'}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Terminer la configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}