import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Progress } from '../../components/ui/progress';

type Step = 'request' | 'sent' | 'reset' | 'success';

export default function PasswordReset() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthLabel = () => {
    const strength = passwordStrength();
    if (strength < 50) return { label: 'Faible', color: 'text-red-600' };
    if (strength < 75) return { label: 'Moyen', color: 'text-yellow-600' };
    return { label: 'Fort', color: 'text-green-600' };
  };

  const requirements = [
    { label: '8 caractères minimum', met: password.length >= 8 },
    { label: 'Une majuscule', met: /[A-Z]/.test(password) },
    { label: 'Un chiffre', met: /[0-9]/.test(password) },
    { label: 'Un caractère spécial', met: /[^A-Za-z0-9]/.test(password) }
  ];

  if (step === 'request') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la connexion
          </Button>

          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Réinitialiser votre mot de passe
                </h2>
                <p className="text-gray-600">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setStep('sent'); }} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@plomberie.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                  size="lg"
                >
                  Envoyer le lien
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'sent') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-green-100 rounded-full">
                  <Mail className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vérifiez votre boîte mail
                </h2>
                <p className="text-gray-600">
                  Nous avons envoyé un lien de réinitialisation à
                </p>
                <p className="font-semibold text-gray-900 mt-1">{email}</p>
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => setStep('reset')}
                >
                  Ouvrir l'application email
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Vous n'avez rien reçu?
                  </p>
                  <Button variant="link" className="text-[var(--primary)]">
                    Renvoyer l'email
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => window.history.back()}
                >
                  Retour à la connexion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Créer un nouveau mot de passe
                </h2>
                <p className="text-gray-600">
                  Votre nouveau mot de passe doit être différent des précédents
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setStep('success'); }} className="space-y-6">
                <div>
                  <Label htmlFor="password">Nouveau mot de passe</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {password && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Force du mot de passe</span>
                        <span className={`text-sm font-medium ${getStrengthLabel().color}`}>
                          {getStrengthLabel().label}
                        </span>
                      </div>
                      <Progress value={passwordStrength()} className="h-2" />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Votre mot de passe doit contenir:</p>
                  {requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        req.met ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {req.met && <CheckCircle className="h-3 w-3 text-green-600" />}
                      </div>
                      <span className={`text-sm ${req.met ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                  size="lg"
                  disabled={password !== confirmPassword || passwordStrength() < 75}
                >
                  Réinitialiser le mot de passe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success step
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Mot de passe mis à jour!
              </h2>
              <p className="text-gray-600">
                Votre mot de passe a été réinitialisé avec succès
              </p>
            </div>

            <Button
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90"
              size="lg"
              onClick={() => window.location.href = '/'}
            >
              Retour à la connexion
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Redirection automatique dans 3 secondes...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
