import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Flame, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Card, CardContent } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function ClientLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('client@example.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberClientEmail', email);
      } else {
        localStorage.removeItem('rememberClientEmail');
      }
      
      toast.success('Bienvenue sur votre portail client!');
      navigate('/client-portal');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary)] to-[var(--accent-blue)] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255,255,255,.1) 35px,
            rgba(255,255,255,.1) 70px
          )`
        }} />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white p-3 rounded-2xl shadow-lg">
              <Flame className="h-10 w-10 text-[var(--flame-orange)]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Groupe G. Lafrance
          </h1>
          <p className="text-blue-100">Portail Client</p>
        </div>

        <Card className="shadow-2xl">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connexion
              </h2>
              <p className="text-gray-600">
                Accédez à votre espace client
              </p>
            </div>

            {/* Demo Account Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-1">Compte de démonstration:</p>
              <p className="text-xs text-blue-800">Email: client@example.com</p>
              <p className="text-xs text-blue-800">Mot de passe: n'importe quoi</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Se souvenir de moi
                  </label>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  Mot de passe oublié?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Nouveau client?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <Link to="/client-register">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Créer un compte
              </Button>
            </Link>

            {/* Employee Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous êtes un employé?{' '}
                <Link to="/login" className="text-[var(--primary)] hover:underline font-medium">
                  Connexion employés
                </Link>
              </p>
            </div>

            {/* Help Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Besoin d'aide?{' '}
                <a href="tel:+15145550123" className="text-[var(--primary)] hover:underline">
                  514-555-0123
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-blue-100">
            © 2026 Groupe G. Lafrance. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}