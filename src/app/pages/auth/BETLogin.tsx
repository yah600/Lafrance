/**
 * BET Marketplace Login Page
 *
 * Unified login for all BET user types:
 * - Plumbers (external contractors)
 * - Clients (customers)
 * - Internal Admins (Groupe Lafrance staff)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BETAuthProvider, useBETAuth } from '../../context/BETAuthContext';
import { isPlumber, isClient, isInternalAdmin } from '../../types/betUser';
import { toast } from 'sonner';

function BETLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, isLoading } = useBETAuth();
  const navigate = useNavigate();

  // Redirect after successful login
  useEffect(() => {
    if (user) {
      if (isPlumber(user)) {
        navigate('/plumber-dashboard');
      } else if (isClient(user)) {
        navigate('/client-dashboard');
      } else if (isInternalAdmin(user)) {
        navigate('/admin-dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(email, password);
      // Redirect based on user role - handled in useBETAuth after login
      // Navigation will happen after user state is set
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
    }
  };

  // Quick login buttons for demo
  const quickLogin = async (role: 'plumber' | 'client' | 'admin') => {
    const credentials = {
      plumber: { email: 'technicien@plomberie.com', password: 'password' },
      client: { email: 'client@example.com', password: 'password' },
      admin: { email: 'gabriel@lafrance.com', password: 'password' },
    };

    setEmail(credentials[role].email);
    setPassword(credentials[role].password);

    try {
      await login(credentials[role].email, credentials[role].password);
      // Navigation will be handled by useEffect when user state changes
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            BET Marketplace
          </h1>
          <p className="text-gray-600">
            Plateforme de répartition par enchères
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse courriel
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="votre@email.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <a href="/reset-password" className="text-sm text-blue-600 hover:text-blue-700">
            Mot de passe oublié?
          </a>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou</span>
          </div>
        </div>

        {/* Quick Login Buttons (Demo) */}
        <div className="space-y-3">
          <p className="text-xs text-center text-gray-500 mb-3">Connexion rapide (démo)</p>

          <button
            onClick={() => quickLogin('plumber')}
            disabled={isLoading}
            className="w-full border-2 border-green-200 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-50 transition flex items-center justify-center disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Connexion Plombier
          </button>

          <button
            onClick={() => quickLogin('client')}
            disabled={isLoading}
            className="w-full border-2 border-blue-200 text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Connexion Client
          </button>

          <button
            onClick={() => quickLogin('admin')}
            disabled={isLoading}
            className="w-full border-2 border-purple-200 text-purple-700 py-2 px-4 rounded-lg font-medium hover:bg-purple-50 transition flex items-center justify-center disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Connexion Admin
          </button>
        </div>

        {/* Register Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-3">
            Nouveau sur la plateforme?
          </p>
          <div className="flex gap-3">
            <a
              href="/plumber-register"
              className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Inscription Plombier
            </a>
            <a
              href="/client-register"
              className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Inscription Client
            </a>
          </div>
        </div>

        {/* Test Accounts Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-semibold mb-2">Comptes de test:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Plombier: <code>technicien@plomberie.com</code></li>
            <li>• Client: <code>client@example.com</code></li>
            <li>• Admin: <code>gabriel@lafrance.com</code></li>
            <li className="mt-2">• Mot de passe: <code>password</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function BETLogin() {
  return (
    <BETAuthProvider>
      <BETLoginForm />
    </BETAuthProvider>
  );
}
