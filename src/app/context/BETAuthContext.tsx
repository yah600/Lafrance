/**
 * BET Marketplace Authentication Context
 *
 * Manages authentication for three distinct user types:
 * - Plumber: External contractors who bid on jobs
 * - Client: Customers who request services
 * - Internal Admin: Groupe Lafrance staff who manage the platform
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  BETUser,
  BETUserRole,
  PlumberUser,
  ClientUser,
  InternalAdminUser,
  isPlumber,
  isClient,
  isInternalAdmin,
} from '../types/betUser';
import { MockDataService } from '../services/mockDataService';
import { toast } from 'sonner';

interface BETAuthContextType {
  user: BETUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerPlumber: (plumberData: Partial<PlumberUser>) => Promise<void>;
  registerClient: (clientData: Partial<ClientUser>) => Promise<void>;
  hasRole: (role: BETUserRole) => boolean;
  isPlumber: () => boolean;
  isClient: () => boolean;
  isAdmin: () => boolean;
  updateProfile: (updates: Partial<BETUser>) => Promise<void>;
}

const BETAuthContext = createContext<BETAuthContextType | undefined>(undefined);

// Mock admin users for the platform (internal staff)
const INTERNAL_ADMINS: InternalAdminUser[] = [
  {
    id: 'admin-1',
    email: 'gabriel@lafrance.com',
    role: 'internal-admin',
    adminId: 'admin-1',
    firstName: 'Gabriel',
    lastName: 'Lafrance',
    phone: '+1 514-555-0001',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    divisions: ['plomberie', 'construction', 'toitures', 'isolation', 'conteneurs', 'gutters', 'decks', 'real-estate'],
    permissions: {
      canReviewJobs: true,
      canApproveJobs: true,
      canRejectJobs: true,
      canArbitrateClaims: true,
      canManagePayments: true,
      canManagePlumbers: true,
      canManageClients: true,
      canViewAnalytics: true,
    },
    title: 'Super Administrateur',
  },
  {
    id: 'admin-2',
    email: 'michael@lafrance.com',
    role: 'internal-admin',
    adminId: 'admin-2',
    firstName: 'Michael',
    lastName: 'Lacoste',
    phone: '+1 514-555-0002',
    active: true,
    createdAt: '2025-01-15T00:00:00Z',
    division: 'plomberie',
    divisions: ['plomberie'],
    permissions: {
      canReviewJobs: true,
      canApproveJobs: true,
      canRejectJobs: true,
      canArbitrateClaims: true,
      canManagePayments: true,
      canManagePlumbers: true,
      canManageClients: false,
      canViewAnalytics: true,
    },
    title: 'Chef de Division - Plomberie',
  },
  {
    id: 'admin-3',
    email: 'dispatcher.plomberie@lafrance.com',
    role: 'internal-admin',
    adminId: 'admin-3',
    firstName: 'Dispatcher',
    lastName: 'Plomberie',
    phone: '+1 514-555-0004',
    active: true,
    createdAt: '2025-02-10T00:00:00Z',
    division: 'plomberie',
    divisions: ['plomberie'],
    permissions: {
      canReviewJobs: true,
      canApproveJobs: true,
      canRejectJobs: true,
      canArbitrateClaims: false,
      canManagePayments: false,
      canManagePlumbers: false,
      canManageClients: false,
      canViewAnalytics: true,
    },
    title: 'Dispatcher',
  },
];

export function BETAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BETUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mockDataService = MockDataService.getInstance();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('betCurrentUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('betCurrentUser');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Login - Determines user type and loads appropriate data
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Check if internal admin
      const admin = INTERNAL_ADMINS.find(a => a.email === email);
      if (admin) {
        const userWithLogin = {
          ...admin,
          lastLogin: new Date().toISOString(),
        };
        setUser(userWithLogin);
        localStorage.setItem('betCurrentUser', JSON.stringify(userWithLogin));
        toast.success(`Bienvenue, ${admin.firstName}!`);
        setIsLoading(false);
        return;
      }

      // Check if plumber
      const plumbers = mockDataService.getAllPlumbers();
      const plumber = plumbers.find((p: any) => p.email === email);
      if (plumber) {
        const userWithLogin = {
          ...plumber,
          lastLogin: new Date().toISOString(),
        };
        setUser(userWithLogin);
        localStorage.setItem('betCurrentUser', JSON.stringify(userWithLogin));
        toast.success(`Bienvenue, ${plumber.firstName}!`);
        setIsLoading(false);
        return;
      }

      // Check if client
      const clients = mockDataService.getAllClients();
      const client = clients.find((c: any) => c.email === email);
      if (client) {
        const userWithLogin = {
          ...client,
          lastLogin: new Date().toISOString(),
        };
        setUser(userWithLogin);
        localStorage.setItem('betCurrentUser', JSON.stringify(userWithLogin));
        toast.success(`Bienvenue, ${client.firstName}!`);
        setIsLoading(false);
        return;
      }

      // User not found
      toast.error('Email ou mot de passe incorrect');
      throw new Error('Email ou mot de passe incorrect');
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('betCurrentUser');
    toast.info('Déconnexion réussie');
  };

  /**
   * Register a new plumber
   */
  const registerPlumber = async (plumberData: Partial<PlumberUser>) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Check if email already exists
      const plumbers = mockDataService.getAllPlumbers();
      const existingPlumber = plumbers.find((p: any) => p.email === plumberData.email);
      if (existingPlumber) {
        toast.error('Un compte avec cet email existe déjà');
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Create new plumber with defaults
      const newPlumber: PlumberUser = {
        id: `PLB-${Date.now()}`,
        role: 'plumber',
        plumberId: `PLB-${Date.now()}`,
        email: plumberData.email || '',
        firstName: plumberData.firstName || '',
        lastName: plumberData.lastName || '',
        phone: plumberData.phone || '',
        businessName: plumberData.businessName || '',
        rbqNumber: plumberData.rbqNumber || '',
        coordinates: plumberData.coordinates || { lat: 45.5017, lng: -73.5673 },
        address: plumberData.address || {
          street: '',
          city: 'Montréal',
          province: 'QC',
          postalCode: '',
        },
        subscription: plumberData.subscription || {
          tier: 'bronze',
          billingCycle: 'monthly',
          status: 'trial',
          startDate: new Date().toISOString(),
          trialEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          price: 49.99,
        },
        complianceStatus: plumberData.complianceStatus || {
          isCompliant: false,
          documents: {
            RBQ: { type: 'RBQ', status: 'pending' },
            CNESST: { type: 'CNESST', status: 'pending' },
            CCQ: { type: 'CCQ', status: 'pending' },
            RQ: { type: 'RQ', status: 'pending' },
            LIABILITY_INSURANCE: { type: 'LIABILITY_INSURANCE', status: 'pending' },
          },
          note: 'Documents de conformité requis avant premier paiement',
        },
        preferences: plumberData.preferences || {
          serviceTypes: ['urgences', 'débouchage', 'chauffe-eau'],
          serviceRadius: 50,
          workingHours: { start: '08:00', end: '18:00' },
          availableWeekdays: [1, 2, 3, 4, 5],
          acceptUrgentJobs: true,
          acceptNormalJobs: true,
        },
        rating: {
          average: 0,
          count: 0,
          last5Stars: 0,
          last30Days: 0,
        },
        stats: {
          jobsCompleted: 0,
          jobsCancelled: 0,
          totalEarnings: 0,
          averageResponseTime: 0,
          onTimeRate: 0,
        },
        active: true,
        createdAt: new Date().toISOString(),
      };

      // Save to mockDataService
      mockDataService.addPlumber(newPlumber);

      // Auto-login
      setUser(newPlumber);
      localStorage.setItem('betCurrentUser', JSON.stringify(newPlumber));

      toast.success('Inscription réussie! 6 mois d\'essai gratuit activés.');
      setIsLoading(false);
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Register a new client
   */
  const registerClient = async (clientData: Partial<ClientUser>) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Check if email already exists
      const clients = mockDataService.getAllClients();
      const existingClient = clients.find((c: any) => c.email === clientData.email);
      if (existingClient) {
        toast.error('Un compte avec cet email existe déjà');
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Create new client
      const newClient: ClientUser = {
        id: `CLI-${Date.now()}`,
        role: 'client',
        clientId: `CLI-${Date.now()}`,
        email: clientData.email || '',
        firstName: clientData.firstName || '',
        lastName: clientData.lastName || '',
        phone: clientData.phone || '',
        preferredLanguage: clientData.preferredLanguage || 'fr',
        address: clientData.address,
        paymentMethods: {},
        stats: {
          jobsRequested: 0,
          jobsCompleted: 0,
          totalSpent: 0,
          averageRatingGiven: 0,
        },
        active: true,
        createdAt: new Date().toISOString(),
      };

      // Save to mockDataService
      mockDataService.addClient(newClient);

      // Auto-login
      setUser(newClient);
      localStorage.setItem('betCurrentUser', JSON.stringify(newClient));

      toast.success('Inscription réussie! Bienvenue sur la plateforme.');
      setIsLoading(false);
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates: Partial<BETUser>) => {
    if (!user) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('betCurrentUser', JSON.stringify(updatedUser));

      // Update in mockDataService
      if (isPlumber(updatedUser)) {
        mockDataService.updatePlumber(updatedUser.id, updates);
      } else if (isClient(updatedUser)) {
        mockDataService.updateClient(updatedUser.id, updates);
      }

      toast.success('Profil mis à jour');
      setIsLoading(false);
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Erreur lors de la mise à jour');
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Role checking helpers
   */
  const hasRole = (role: BETUserRole): boolean => {
    return user?.role === role;
  };

  const isPlumberUser = (): boolean => {
    return isPlumber(user);
  };

  const isClientUser = (): boolean => {
    return isClient(user);
  };

  const isAdminUser = (): boolean => {
    return isInternalAdmin(user);
  };

  const value: BETAuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    registerPlumber,
    registerClient,
    hasRole,
    isPlumber: isPlumberUser,
    isClient: isClientUser,
    isAdmin: isAdminUser,
    updateProfile,
  };

  return <BETAuthContext.Provider value={value}>{children}</BETAuthContext.Provider>;
}

export function useBETAuth() {
  const context = useContext(BETAuthContext);
  if (context === undefined) {
    throw new Error('useBETAuth must be used within a BETAuthProvider');
  }
  return context;
}

/**
 * HOC for role-based route protection
 */
export function withBETRole(allowedRoles: BETUserRole[]) {
  return (Component: React.ComponentType<any>) => {
    return function ProtectedComponent(props: any) {
      const { user, isLoading } = useBETAuth();

      if (isLoading) {
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          </div>
        );
      }

      if (!user || !allowedRoles.includes(user.role)) {
        return (
          <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
              <div className="text-red-500 text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        );
      }

      return <Component {...props} />;
    };
  };
}

/**
 * Component for role-based conditional rendering
 */
export function RequireBETRole({
  roles,
  children,
  fallback = null,
}: {
  roles: BETUserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user } = useBETAuth();

  if (!user || !roles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
