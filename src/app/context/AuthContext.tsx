import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, DivisionType } from '../types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeDivision: DivisionType | null;
  setActiveDivision: (division: DivisionType) => void;
  login: (email: string, password: string, division?: DivisionType) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  canAccessDivision: (division: DivisionType) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration - Multi-Division Platform
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'gabriel@lafrance.com',
    name: 'Gabriel Lafrance',
    role: 'super-admin',
    divisions: ['plomberie', 'construction', 'toitures', 'isolation', 'conteneurs', 'gutters', 'decks', 'real-estate'],
    phone: '+1 514-555-0001',
    active: true,
    createdAt: '2025-01-01',
  },
  {
    id: '2',
    email: 'michael@lafrance.com',
    name: 'Michael Lacoste',
    role: 'division-head',
    division: 'plomberie',
    divisions: ['plomberie'],
    phone: '+1 514-555-0002',
    license: 'CMMTQ M123456',
    active: true,
    createdAt: '2025-01-15',
  },
  {
    id: '3',
    email: 'jonathan@lafrance.com',
    name: 'Jonathan Isabel',
    role: 'division-head',
    division: 'toitures',
    divisions: ['toitures'],
    phone: '+1 514-555-0003',
    license: 'RBQ 5717-1111-01',
    active: true,
    createdAt: '2025-02-01',
  },
  {
    id: '4',
    email: 'dispatcher.plomberie@lafrance.com',
    name: 'Dispatcher Plomberie',
    role: 'dispatcher',
    division: 'plomberie',
    divisions: ['plomberie'],
    phone: '+1 514-555-0004',
    active: true,
    createdAt: '2025-02-10',
  },
  {
    id: '5',
    email: 'dispatcher.toitures@lafrance.com',
    name: 'Dispatcher Toitures',
    role: 'dispatcher',
    division: 'toitures',
    divisions: ['toitures'],
    phone: '+1 514-555-0005',
    active: true,
    createdAt: '2025-02-15',
  },
  {
    id: '6',
    email: 'technicien@plomberie.com',
    name: 'Marc Tremblay',
    role: 'technician',
    division: 'plomberie',
    divisions: ['plomberie'],
    phone: '+1 514-555-0006',
    license: 'CMMTQ M789012',
    active: true,
    createdAt: '2025-03-01',
  },
  {
    id: '7',
    email: 'client@example.com',
    name: 'Jean Dupont',
    role: 'client',
    phone: '+1 514-555-0007',
    active: true,
    createdAt: '2025-03-15',
  },
  {
    id: '8',
    email: 'admin@lafrance.com',
    name: 'Admin User',
    role: 'admin',
    division: 'plomberie',
    divisions: ['plomberie', 'construction', 'toitures'],
    phone: '+1 514-555-0008',
    active: true,
    createdAt: '2025-01-01',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDivision, setActiveDivision] = useState<DivisionType | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setActiveDivision(parsed.division || null);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, division?: DivisionType) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user by email
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Email ou mot de passe incorrect');
    }

    // In production, verify password here
    // For demo, any password works
    
    // Update last login
    const userWithLogin = {
      ...foundUser,
      lastLogin: new Date(),
    };

    // Create a serializable version for localStorage (convert Dates to ISO strings)
    const serializableUser = {
      ...userWithLogin,
      createdAt: userWithLogin.createdAt instanceof Date ? userWithLogin.createdAt.toISOString() : userWithLogin.createdAt,
      lastLogin: userWithLogin.lastLogin instanceof Date ? userWithLogin.lastLogin.toISOString() : userWithLogin.lastLogin,
    };

    setUser(userWithLogin);
    localStorage.setItem('currentUser', JSON.stringify(serializableUser));
    setActiveDivision(division || userWithLogin.division || null);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    const existingUser = MOCK_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      setIsLoading(false);
      throw new Error('Un compte avec cet email existe déjà');
    }

    // Create new client user
    const newUser: User = {
      id: `client-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      role: 'client',
      phone: userData.phone,
      active: true,
      createdAt: new Date().toISOString(),
    };

    // Store additional client data
    const clientData = {
      ...userData,
      userId: newUser.id,
      registrationDate: new Date().toISOString(),
    };
    
    // Save to localStorage (in production, this would be sent to backend)
    const existingClients = JSON.parse(localStorage.getItem('registeredClients') || '[]');
    localStorage.setItem('registeredClients', JSON.stringify([...existingClients, clientData]));

    MOCK_USERS.push(newUser);

    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const canAccessDivision = (division: DivisionType): boolean => {
    if (!user || !user.divisions) return false;
    return user.divisions.includes(division);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    activeDivision,
    setActiveDivision,
    login,
    logout,
    register,
    hasRole,
    canAccessDivision,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for role-based access control
export function withRole(allowedRoles: UserRole[]) {
  return (Component: React.ComponentType) => {
    return function ProtectedComponent(props: any) {
      const { user } = useAuth();

      if (!user || !allowedRoles.includes(user.role)) {
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
              <p className="text-gray-600">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </p>
            </div>
          </div>
        );
      }

      return <Component {...props} />;
    };
  };
}