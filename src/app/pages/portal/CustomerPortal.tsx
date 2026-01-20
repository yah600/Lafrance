import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { Flame, Calendar, FileText, Settings, LogOut, Home, Bell } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import CustomerPortalHome from './CustomerPortalHome';
import CustomerPortalBooking from './CustomerPortalBooking';
import CustomerPortalInvoices from './CustomerPortalInvoices';
import CustomerPortalSettings from './CustomerPortalSettings';

export default function CustomerPortal() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(2);

  const navItems = [
    { path: '/portal', icon: Home, label: 'Accueil' },
    { path: '/portal/booking', icon: Calendar, label: 'Réserver' },
    { path: '/portal/invoices', icon: FileText, label: 'Factures' },
    { path: '/portal/settings', icon: Settings, label: 'Paramètres' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b sticky top-0 z-10">
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
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="font-medium text-sm">Jean Dupont</p>
                  <p className="text-xs text-gray-600">Client premium</p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/login')}
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
          <div className="flex gap-8">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/portal'}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 border-b-2 transition-colors ${
                    isActive
                      ? 'border-[var(--primary)] text-[var(--primary)]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<CustomerPortalHome />} />
          <Route path="booking" element={<CustomerPortalBooking />} />
          <Route path="invoices" element={<CustomerPortalInvoices />} />
          <Route path="settings" element={<CustomerPortalSettings />} />
        </Routes>
      </main>
    </div>
  );
}
