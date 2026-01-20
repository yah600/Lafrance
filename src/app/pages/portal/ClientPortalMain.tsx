import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { Flame, Home, FileText, MessageSquare, CreditCard, Settings, LogOut, Bell, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import ClientPortalDashboard from './ClientPortalDashboard';
import NewClientRequest from './NewClientRequest';
import ClientPortalRequests from './ClientPortalRequests';
import ClientPortalMessages from './ClientPortalMessages';
import ClientPortalPayments from './ClientPortalPayments';
import ClientPortalInvoices from './ClientPortalInvoices';
import ClientPortalSettings from './ClientPortalSettings';
import ClientProfile from './ClientProfile';

export default function ClientPortalMain() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useState(3);

  const navItems = [
    { path: '/client-portal', icon: Home, label: 'Tableau de bord', end: true },
    { path: '/client-portal/requests', icon: FileText, label: 'Mes demandes' },
    { path: '/client-portal/messages', icon: MessageSquare, label: 'Messages', badge: 3 },
    { path: '/client-portal/invoices', icon: CreditCard, label: 'Factures' },
    { path: '/client-portal/settings', icon: Settings, label: 'Paramètres' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8 text-[var(--primary)]" />
              <div>
                <h1 className="font-bold text-lg">Plomberie D'Experts</h1>
                <p className="text-xs text-gray-600">Portail client</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {user?.name ? getInitials(user.name) : 'CL'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                title="Déconnexion"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-[var(--primary)] text-[var(--primary)]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="ml-1">
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<ClientPortalDashboard />} />
          <Route path="new-request" element={<NewClientRequest />} />
          <Route path="requests" element={<ClientPortalRequests />} />
          <Route path="messages" element={<ClientPortalMessages />} />
          <Route path="invoices" element={<ClientPortalInvoices />} />
          <Route path="invoices/:id/pay" element={<ClientPortalPayments />} />
          <Route path="settings" element={<ClientPortalSettings />} />
          <Route path="profile" element={<ClientProfile />} />
        </Routes>
      </main>

      {/* Compliance Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 px-3 py-1.5">
                <Shield className="h-4 w-4" />
                Membre CMMTQ
              </Badge>
              <Badge className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5 px-3 py-1.5">
                <CheckCircle className="h-4 w-4" />
                Licence RBQ Vérifiée
              </Badge>
              <Badge className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 px-3 py-1.5">
                <Shield className="h-4 w-4" />
                Assurance Responsabilité
              </Badge>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 text-sm text-gray-600">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => window.open('https://www.rbq.gouv.qc.ca/entreprise-de-construction/rechercher-un-entrepreneur.html', '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
                Vérifier notre licence RBQ
              </Button>
              <span className="hidden md:inline text-gray-300">|</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => window.open('https://www.cmmtq.org/', '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
                Vérifier CMMTQ
              </Button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-center text-xs text-gray-500">
            <p>RBQ: 5865-7925-01 | CMMTQ: M123456 | NEQ: 1176538933</p>
            <p className="mt-1">Groupe G. Lafrance - Plateforme unifiée de services de construction</p>
          </div>
        </div>
      </footer>
    </div>
  );
}