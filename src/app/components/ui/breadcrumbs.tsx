import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs() {
  const location = useLocation();
  const { user } = useAuth();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split('/').filter(Boolean);
    
    // Map routes to labels
    const routeLabels: Record<string, string> = {
      'dispatch': 'Dispatch',
      'technicians': 'Techniciens',
      'clients': 'Clients',
      'map': 'Carte GPS',
      'invoices': 'Factures',
      'analytics': 'Rapports',
      'settings': 'Paramètres',
      'mobile': 'Mobile',
      'portal': 'Portail Client',
      'home': 'Accueil',
      'jobs': 'Travaux',
      'messages': 'Messages',
      'profile': user?.role === 'technician' ? 'Mes Travaux' : 'Profil',
      'booking': 'Réservation',
      'help': 'Aide',
    };

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Accueil', href: '/' }
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const label = routeLabels[path] || path.charAt(0).toUpperCase() + path.slice(1);
      
      // Don't add href for the last item (current page)
      if (index === paths.length - 1) {
        breadcrumbs.push({ label });
      } else {
        breadcrumbs.push({ label, href: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on home page or if only one level
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4 px-6 pt-6">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {index === 0 && <Home className="h-4 w-4 mr-2" />}
          {crumb.href ? (
            <Link 
              to={crumb.href} 
              className="hover:text-[var(--primary)] transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}