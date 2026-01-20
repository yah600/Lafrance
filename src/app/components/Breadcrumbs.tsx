import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../lib/utils';

const routeLabels: Record<string, string> = {
  'dashboard': 'Dashboard',
  'technicians': 'Techniciens',
  'clients': 'Clients',
  'map': 'Carte GPS',
  'invoices': 'Factures',
  'settings': 'Paramètres',
  'analytics': 'Rapports',
  'soumissions': 'Soumissions',
  'maintenance-contracts': 'Contrats d\'entretien',
  'reviews': 'Avis clients',
  'property-passports': 'Passeports de propriété',
  'notifications': 'Notifications',
  'help': 'Aide',
  'profile': 'Mon profil',
  'messages': 'Messages',
  'new': 'Nouveau',
  'edit': 'Modifier',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 px-6 py-3 bg-white border-b text-sm">
      <Link 
        to="/" 
        className="flex items-center gap-1 text-gray-600 hover:text-[var(--primary)] transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Accueil</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = routeLabels[name] || name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <div key={name} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 font-medium">{label}</span>
            ) : (
              <Link 
                to={routeTo} 
                className="text-gray-600 hover:text-[var(--primary)] transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
