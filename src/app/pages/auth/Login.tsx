import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Lock, Mail
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Card, CardContent } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../context/AuthContext';
import { DivisionType } from '../../types/user';
import { DIVISIONS } from '../../data/divisions';
import { toast } from 'sonner';
import logoImage from 'figma:asset/83a3f7928951158ed260807664911891c4b1df6f.png';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('gabriel@lafrance.com');
  const [password, setPassword] = useState('password123');
  const [selectedDivision, setSelectedDivision] = useState<DivisionType>('plomberie');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, selectedDivision);
      toast.success('Connexion réussie!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      {/* Content */}
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">Connexion</h2>
              <p className="text-gray-500">Espace employés</p>
            </div>

            {/* Demo Accounts */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-900 mb-3">Comptes de démonstration</p>
              <div className="text-xs text-gray-600 space-y-1.5">
                <p>• Super Admin: gabriel@lafrance.com</p>
                <p>• Chef Division Plomberie: michael@lafrance.com</p>
                <p>• Chef Division Toitures: jonathan@lafrance.com</p>
                <p>• Dispatcher Plomberie: dispatcher.plomberie@lafrance.com</p>
                <p>• Dispatcher Toitures: dispatcher.toitures@lafrance.com</p>
                <p>• Technicien: technicien@plomberie.com</p>
                <p>• Client: client@example.com</p>
                <p className="mt-3 italic font-medium text-gray-700">Mot de passe: n'importe quoi</p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Division Selector */}
              <div className="space-y-2">
                <Label htmlFor="division" className="text-gray-900 font-medium">Division</Label>
                <Select value={selectedDivision} onValueChange={(value) => setSelectedDivision(value as DivisionType)}>
                  <SelectTrigger className="w-full h-12 border-gray-200 rounded-xl">
                    <SelectValue placeholder="Sélectionner une division" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIVISIONS.map((division) => (
                      <SelectItem key={division.id} value={division.id}>
                        {division.nameFr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Sélectionnez votre division de travail
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@plomberie.com"
                    className="pl-11 h-12 border-gray-200 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 font-medium">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-11 pr-11 h-12 border-gray-200 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer select-none"
                  >
                    Se souvenir de moi
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors font-medium"
                >
                  Mot de passe oublié?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 h-12 rounded-xl font-semibold shadow-sm transition-all"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">ou</span>
                </div>
              </div>

              {/* Microsoft SSO */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50 transition-all"
                size="lg"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                Connexion avec Microsoft
              </Button>
            </form>

            {/* Help Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Besoin d'aide?{' '}
                <button className="text-[var(--primary)] hover:text-[var(--primary)]/80 font-medium transition-colors">
                  Contactez le support
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>© 2026 Synergair x Groupe G. Lafrance</p>
          <p className="mt-1">Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}