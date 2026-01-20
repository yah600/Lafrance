import { useState } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../components/ui/input-otp';

export default function TwoFactorAuth() {
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(60);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <Card>
          <CardContent className="p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <Shield className="h-12 w-12 text-[var(--primary)]" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Vérification en deux étapes
              </h2>
              <p className="text-gray-600">
                Entrez le code envoyé à votre téléphone
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                *** *** 4567
              </p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center mb-6">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Resend */}
            <div className="text-center mb-6">
              {countdown > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Renvoyer le code dans {countdown}s
                </p>
              ) : (
                <Button variant="link" className="text-[var(--primary)]">
                  Renvoyer le code
                </Button>
              )}
            </div>

            {/* Alternative Methods */}
            <div className="mb-6">
              <p className="text-sm text-center text-muted-foreground mb-3">
                Utiliser une autre méthode
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  Envoyer par SMS
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Envoyer par email
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Utiliser l'application d'authentification
                </Button>
              </div>
            </div>

            {/* Verify Button */}
            <Button
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90"
              size="lg"
              disabled={code.length !== 6}
            >
              Vérifier
            </Button>

            {/* Trust Device */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <input type="checkbox" id="trust" className="h-4 w-4" />
              <label htmlFor="trust" className="text-sm text-muted-foreground cursor-pointer">
                Faire confiance à cet appareil pendant 30 jours
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
