import { useState } from 'react';
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  MapPin, 
  FileText, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X, 
  Shield,
  Receipt,
  ClipboardList,
  BarChart3,
  HelpCircle,
  MessageSquare,
  Star,
  Wrench,
  Home,
  User,
  LogOut,
  Building2,
  Plug,
  MoreHorizontal,
  Thermometer,
  Ruler,
  Gavel
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { useAuth } from '../../context/AuthContext';
import { DIVISIONS } from '../../data/divisions';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../../hooks/useMediaQuery';
import NotificationPanel from '../NotificationPanel';
import CommandPalette from '../CommandPalette';
import Breadcrumbs from '../Breadcrumbs';
// Logo removed - using text-based logo instead

const roleLabels: Record<string, string> = {
  'super-admin': 'Super Administrateur',
  'division-head': 'Chef de Division',
  'operations-manager': 'Gestionnaire Opérations',
  'dispatcher': 'Répartiteur',
  'admin': 'Administrateur',
  'technician': 'Technicien',
  'client': 'Client'
};

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Multi-Divisions', path: '/multi-division', icon: Building2, roles: ['super-admin', 'operations-manager', 'admin'] },
  { name: 'Projets Multi-Div', path: '/cross-division-projects', icon: Building2, roles: ['super-admin', 'operations-manager', 'division-head', 'admin'] },
  { name: 'Répartition', path: '/dispatch', icon: Shield, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Techniciens', path: '/technicians', icon: Users, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Clients', path: '/clients', icon: UserCircle, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Carte GPS', path: '/map', icon: MapPin, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Factures', path: '/invoices', icon: FileText, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Rapports', path: '/analytics', icon: BarChart3, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Soumissions', path: '/soumissions', icon: ClipboardList, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Carte Thermique', path: '/thermal-heat-map', icon: Thermometer, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Soum. À Distance', path: '/remote-quoting', icon: Ruler, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Marketplace', path: '/bidding-marketplace', icon: Gavel, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Mes Soumissions', path: '/contractor-bids', icon: Gavel, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Contrats entretien', path: '/maintenance-contracts', icon: Shield, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Avis clients', path: '/reviews', icon: Star, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Passeports', path: '/property-passports', icon: Home, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher'] },
  { name: 'Paramètres', path: '/settings', icon: Settings, roles: ['super-admin', 'division-head', 'admin'] },
  { name: 'Intégrations', path: '/integrations', icon: Plug, roles: ['super-admin', 'admin'] },
  { name: 'Notifications', path: '/notifications', icon: Bell, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher', 'technician'] },
  { name: 'Aide', path: '/help', icon: HelpCircle, roles: ['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher', 'technician'] },
];

// Technician-specific navigation
const technicianNavItems = [
  { name: 'Mes Travaux', path: '/profile', icon: User, roles: ['technician'] },
  { name: 'Aide', path: '/help', icon: HelpCircle, roles: ['technician'] },
];

export default function DashboardLayout() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, activeDivision, setActiveDivision } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Get division color from update.md specification
  const getDivisionColor = (division: string | null) => {
    const colors: Record<string, string> = {
      'plomberie': '#2B5A8E',
      'construction': '#1C3D5A',
      'toitures': '#8B4513',
      'isolation': '#FF8C00',
      'conteneurs': '#4A7C59',
      'gutters': '#708090',
      'decks': '#8B7355',
      'real-estate': '#DAA520',
    };
    return division ? colors[division] || '#2B5A8E' : '#2B5A8E';
  };

  const getDivisionName = (division: string | null) => {
    if (!division) return 'Aucune division';
    const div = DIVISIONS.find(d => d.id === division);
    return div?.nameFr || division;
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter navigation items based on user role
  const getVisibleNavItems = () => {
    if (!user) return [];
    
    // Technicians get a simplified nav
    if (user.role === 'technician') {
      return technicianNavItems;
    }
    
    // Other roles get filtered standard nav
    return navItems.filter(item => item.roles.includes(user.role));
  };

  const visibleNavItems = getVisibleNavItems();

  // Bottom nav items for mobile (key pages)
  const bottomNavItems = visibleNavItems.slice(0, 3).concat([
    { name: 'Plus', path: '/more', icon: MoreHorizontal, roles: ['admin', 'dispatcher', 'technician'] }
  ]);

  return (
    <div className="flex h-screen bg-gray-50">
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex w-64 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">GL</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white">GROUPE LAFRANCE</div>
              <div className="text-xs text-gray-400">Plateforme Pro</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/' || item.path === '/profile'}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2.5 rounded-lg transition-colors min-h-[44px]',
                  isActive
                    ? 'bg-[var(--sidebar-primary)] text-white'
                    : 'text-[var(--sidebar-foreground)]/80 hover:bg-[var(--sidebar-accent)] hover:text-white'
                )
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[var(--sidebar-border)]">
          {/* For technicians: Simple logout button */}
          {user?.role === 'technician' ? (
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 hover:bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] min-h-[44px]"
                onClick={() => navigate('/profile')}
              >
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarFallback className="bg-[var(--sidebar-primary)] text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{user?.name || 'User'}</span>
                  <span className="text-xs text-[var(--sidebar-foreground)]/60">
                    {roleLabels[user.role]}
                  </span>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 min-h-[44px]"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </Button>
            </div>
          ) : (
            /* For other roles: Dropdown menu */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-3 hover:bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] min-h-[44px]"
                >
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-[var(--sidebar-primary)] text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{user?.name || 'User'}</span>
                    <span className="text-xs text-[var(--sidebar-foreground)]/60">
                      {user?.email || 'user@example.com'}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p>{user?.name}</p>
                    <p className="text-xs text-muted-foreground font-normal">
                      {user?.role ? roleLabels[user.role] : 'Role'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>

      {/* Mobile Menu Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0 bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
          <SheetHeader className="p-6 border-b border-[var(--sidebar-border)]">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">GL</span>
              </div>
              <div>
                <div className="text-sm font-bold text-white">GROUPE LAFRANCE</div>
                <div className="text-xs text-gray-400">Plateforme Pro</div>
              </div>
            </div>
          </SheetHeader>
          
          <nav className="px-3 py-4 space-y-1">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/' || item.path === '/profile'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3 py-2.5 rounded-lg transition-colors min-h-[44px]',
                    isActive
                      ? 'bg-[var(--sidebar-primary)] text-white'
                      : 'text-[var(--sidebar-foreground)]/80 hover:bg-[var(--sidebar-accent)] hover:text-white'
                  )
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--sidebar-border)]">
            <div className="flex items-center px-3 py-2 mb-2">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback className="bg-[var(--sidebar-primary)] text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span className="font-medium">{user?.name || 'User'}</span>
                <span className="text-xs text-[var(--sidebar-foreground)]/60">
                  {user?.role ? roleLabels[user.role] : ''}
                </span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 min-h-[44px]"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 lg:h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 gap-3 lg:gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden min-w-[44px] min-h-[44px]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Division Indicator - Visual feedback per update.md */}
          {activeDivision && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 bg-white" style={{ borderColor: getDivisionColor(activeDivision) }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getDivisionColor(activeDivision) }} />
              <span className="text-sm font-medium hidden sm:inline">{getDivisionName(activeDivision)}</span>
            </div>
          )}

          {/* Division Switcher - For users with multiple divisions */}
          {user && user.divisions && user.divisions.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden md:inline">Changer de division</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Divisions disponibles</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.divisions.map((div) => {
                  const division = DIVISIONS.find(d => d.id === div);
                  if (!division) return null;
                  return (
                    <DropdownMenuItem 
                      key={div}
                      onClick={() => setActiveDivision(div)}
                      className="flex items-center gap-2"
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getDivisionColor(div) }} />
                      <span>{division.nameFr}</span>
                      {activeDivision === div && <Badge className="ml-auto">Active</Badge>}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Search */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="search"
              placeholder="Rechercher..."
              className="pl-10 bg-gray-50 h-10 lg:h-auto"
              onClick={() => setCommandPaletteOpen(true)}
              readOnly
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative min-w-[44px] min-h-[44px]" 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* User - Desktop only */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hidden lg:flex min-h-[44px]">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user?.name?.split(' ')[0] || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>Profil</DropdownMenuItem>
                {user?.role !== 'technician' && (
                  <DropdownMenuItem onClick={() => navigate('/settings')}>Paramètres</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pb-16 lg:pb-0">
          <Breadcrumbs />
          <Outlet />
        </main>

        {/* Bottom Navigation - Mobile Only */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
          <div className="flex items-center justify-around">
            {bottomNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path === '/more' ? '#' : item.path}
                end={item.path === '/' || item.path === '/profile'}
                onClick={(e) => {
                  if (item.path === '/more') {
                    e.preventDefault();
                    setMobileMenuOpen(true);
                  }
                }}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors min-w-[64px] min-h-[56px]',
                    isActive && item.path !== '/more'
                      ? 'text-[var(--primary)]'
                      : 'text-gray-600'
                  )
                }
              >
                <item.icon className="h-6 w-6 mb-1" />
                <span className="text-xs">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Notification Panel */}
      <NotificationPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  );
}