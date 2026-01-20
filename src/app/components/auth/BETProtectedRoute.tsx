/**
 * BET Protected Route Component
 *
 * Wraps BET-specific routes with the BET authentication context
 * and role-based access control
 */

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { BETAuthProvider, useBETAuth } from '../../context/BETAuthContext';
import { BETUserRole } from '../../types/betUser';

interface BETProtectedRouteProps {
  children: ReactNode;
  allowedRoles: BETUserRole[];
  redirectTo?: string;
}

function BETRouteGuard({ children, allowedRoles, redirectTo = '/login' }: BETProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useBETAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
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
          <p className="text-sm text-gray-500 mb-6">
            Rôle requis: {allowedRoles.join(', ')}
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

  return <>{children}</>;
}

/**
 * BET Protected Route - Wraps children with BETAuthProvider and role guard
 */
export function BETProtectedRoute({ children, allowedRoles, redirectTo }: BETProtectedRouteProps) {
  return (
    <BETAuthProvider>
      <BETRouteGuard allowedRoles={allowedRoles} redirectTo={redirectTo}>
        {children}
      </BETRouteGuard>
    </BETAuthProvider>
  );
}

/**
 * Plumber-only route
 */
export function PlumberRoute({ children }: { children: ReactNode }) {
  return (
    <BETProtectedRoute allowedRoles={['plumber']}>
      {children}
    </BETProtectedRoute>
  );
}

/**
 * Client-only route
 */
export function ClientRoute({ children }: { children: ReactNode }) {
  return (
    <BETProtectedRoute allowedRoles={['client']}>
      {children}
    </BETProtectedRoute>
  );
}

/**
 * Internal Admin-only route
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <BETProtectedRoute allowedRoles={['internal-admin']}>
      {children}
    </BETProtectedRoute>
  );
}
