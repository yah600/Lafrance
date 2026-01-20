import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App as KonstaApp } from 'konsta/react';
import { Toaster } from './components/ui/sonner';
import DashboardLayout from './components/layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import MultiDivisionDashboard from './pages/MultiDivisionDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import CrossDivisionProjects from './pages/CrossDivisionProjects';
import Integrations from './pages/Integrations';
import DispatchCenter from './pages/DispatchCenter';
import Technicians from './pages/Technicians';
import TechnicianDetail from './pages/TechnicianDetail';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import MapView from './pages/MapView';
import Invoices from './pages/Invoices';
import InvoiceDetail from './pages/InvoiceDetail';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Soumissions from './pages/Soumissions';
import SoumissionsNew from './pages/SoumissionsNew';
import Reviews from './pages/Reviews';
import PropertyPassports from './pages/PropertyPassports';
import PropertyPassportDetail from './pages/PropertyPassportDetail';
import MaintenanceContracts from './pages/MaintenanceContracts';
import Notifications from './pages/Notifications';
import Login from './pages/auth/Login';
import ClientLogin from './pages/auth/ClientLogin';
import ClientRegistration from './pages/auth/ClientRegistration';
import TwoFactorAuth from './pages/auth/TwoFactorAuth';
import PasswordReset from './pages/auth/PasswordReset';
import MobileTechApp from './pages/mobile/MobileTechApp';
import MobileLogin from './pages/mobile/MobileLogin';
import CustomerPortal from './pages/portal/CustomerPortal';
import ClientPortalMain from './pages/portal/ClientPortalMain';
import Help from './pages/Help';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineIndicator } from './components/OfflineIndicator';
import TechnicianProfile from './pages/TechnicianProfile';
import { UserRole } from './types/user';
import { useEffect } from 'react';
import { registerServiceWorker, setupPWAInstallPrompt, setupNetworkStatusListeners } from './utils/registerServiceWorker';
import { toast } from 'sonner';

// New feature pages
import ThermalHeatMap from './pages/ThermalHeatMap';
import RemoteQuoting from './pages/RemoteQuoting';
import BiddingMarketplace from './pages/BiddingMarketplace';
import ContractorBids from './pages/ContractorBids';

// GROUPE LAFRANCE APP - New pages
import PlumberRegistration from './pages/auth/PlumberRegistration';
import ClientRequestForm from './pages/portal/ClientRequestForm';
import ClientInvoiceView from './pages/portal/ClientInvoiceView';
import ClientAfterSalesService from './pages/portal/ClientAfterSalesService';
import ClientPaymentPage from './pages/portal/ClientPaymentPage';
import BiddingMarketplacePlumber from './pages/BiddingMarketplacePlumber';
import MobileJobWorkflow from './pages/mobile/MobileJobWorkflow';
import PlumberAfterSalesClaimsList from './pages/plumber/PlumberAfterSalesClaimsList';
import PlumberClaimDetail from './pages/plumber/PlumberClaimDetail';
import PlumberPaymentsDashboard from './pages/plumber/PlumberPaymentsDashboard';
import AdminClaimArbitrationPage from './pages/admin/AdminClaimArbitrationPage';
import AdminPaymentManagement from './pages/admin/AdminPaymentManagement';
import AdminReviewQueue from './pages/admin/AdminReviewQueue';

// BET Marketplace Authentication
import BETLogin from './pages/auth/BETLogin';
import { PlumberRoute, ClientRoute, AdminRoute } from './components/auth/BETProtectedRoute';

// BET Marketplace Dashboards
import PlumberDashboard from './pages/bet/PlumberDashboard';
import ClientDashboard from './pages/bet/ClientDashboard';
import AdminDashboard from './pages/bet/AdminDashboard';

// Suppress Figma Make internal errors - IMMEDIATELY on module load
(function() {
  if (typeof window === 'undefined') return;
  
  // Immediately override console methods before anything else
  const noop = () => {};
  const originalError = window.console.error.bind(window.console);
  const originalWarn = window.console.warn.bind(window.console);
  const originalLog = window.console.log.bind(window.console);
  
  const suppressedPatterns = [
    'webpack-artifacts',
    'code_components_preview_iframe',
    'Unknown runtime error',
    'figma.com',
    'logPreviewError',
    'reduxState',
    'Cross-Origin',
    'CORS',
    'service-worker',
    'IndexedDB',
    'InvalidStateError',
    'DataError',
    'database connection is closing',
    'Error in getUnsyncedItems',
    'Provided data is inadequate',
    'pending_jobs',
    'pending_photos',
    'pending_time_entries',
    'pending_signatures',
    'pending_notes'
  ];
  
  const shouldSuppress = (msg: any) => {
    if (!msg) return false;
    const str = msg.toString();
    return suppressedPatterns.some(pattern => str.includes(pattern));
  };
  
  // Override all console methods
  Object.defineProperty(window.console, 'error', {
    value: (...args: any[]) => {
      if (!shouldSuppress(args[0])) {
        originalError(...args);
      }
    },
    configurable: true,
    writable: true
  });
  
  Object.defineProperty(window.console, 'warn', {
    value: (...args: any[]) => {
      if (!shouldSuppress(args[0])) {
        originalWarn(...args);
      }
    },
    configurable: true,
    writable: true
  });
  
  // Catch all errors at the window level
  const errorHandler = (event: ErrorEvent) => {
    const msg = event.message || event.error?.message || event.error?.toString() || '';
    const file = event.filename || '';
    
    if (shouldSuppress(msg) || file.includes('figma.com') || file.includes('webpack')) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  };
  
  const rejectionHandler = (event: PromiseRejectionEvent) => {
    const msg = event.reason?.message || event.reason?.toString() || '';
    if (shouldSuppress(msg)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  };
  
  // Remove any existing handlers and add ours first
  window.removeEventListener('error', errorHandler as any);
  window.removeEventListener('unhandledrejection', rejectionHandler as any);
  
  // Add with capture=true to catch first
  window.addEventListener('error', errorHandler as any, true);
  window.addEventListener('unhandledrejection', rejectionHandler as any, true);
  
  // Also override onerror
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    const msg = message?.toString() || error?.message || '';
    const file = source?.toString() || '';
    
    if (shouldSuppress(msg) || file.includes('figma.com') || file.includes('webpack')) {
      return true; // Prevent default
    }
    
    if (originalOnError) {
      return originalOnError.call(window, message, source, lineno, colno, error);
    }
    return false;
  };
  
  // Override onunhandledrejection
  window.onunhandledrejection = function(event: PromiseRejectionEvent) {
    const msg = event.reason?.message || event.reason?.toString() || '';
    if (shouldSuppress(msg)) {
      event.preventDefault();
      return true;
    }
    return false;
  };
})();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Role-based route protection
function RoleProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="text-[var(--primary)] hover:underline"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route path="/bet-login" element={<BETLogin />} />

      {/* BET Marketplace Dashboards */}
      <Route path="/plumber-dashboard" element={
        <PlumberRoute>
          <PlumberDashboard />
        </PlumberRoute>
      } />
      <Route path="/client-dashboard" element={
        <ClientRoute>
          <ClientDashboard />
        </ClientRoute>
      } />
      <Route path="/admin-dashboard" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/client-login" element={<ClientLogin />} />
      <Route path="/client-register" element={<ClientRegistration />} />
      <Route path="/plumber-register" element={<PlumberRegistration />} />
      <Route path="/2fa" element={<TwoFactorAuth />} />
      <Route path="/reset-password" element={<PasswordReset />} />

      {/* Main Dashboard Routes - Protected */}
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        {/* Root - redirect based on role */}
        <Route index element={
          user?.role === 'technician' 
            ? <Navigate to="/profile" replace />
            : user?.role === 'client'
            ? <Navigate to="/client-portal" replace />
            : user?.role === 'super-admin'
            ? <Navigate to="/super-admin" replace />
            : <Dashboard />
        } />
        
        {/* Super Admin Dashboard - Super Admin only */}
        <Route path="super-admin" element={
          <RoleProtectedRoute allowedRoles={['super-admin']}>
            <SuperAdminDashboard />
          </RoleProtectedRoute>
        } />
        
        {/* Technician Profile - accessible to all */}
        <Route path="profile" element={<TechnicianProfile />} />
        
        {/* Multi-Division Dashboard - Super Admin and Operations Manager */}
        <Route path="multi-division" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'operations-manager', 'admin']}>
            <MultiDivisionDashboard />
          </RoleProtectedRoute>
        } />
        
        {/* Cross-Division Projects - Operations coordination */}
        <Route path="cross-division-projects" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'operations-manager', 'division-head', 'admin']}>
            <CrossDivisionProjects />
          </RoleProtectedRoute>
        } />
        
        {/* Dispatch - All management roles */}
        <Route path="dispatch" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <DispatchCenter />
          </RoleProtectedRoute>
        } />
        
        {/* Technicians - All management roles */}
        <Route path="technicians" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <Technicians />
          </RoleProtectedRoute>
        } />
        <Route path="technicians/:id" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <TechnicianDetail />
          </RoleProtectedRoute>
        } />
        
        {/* Clients - All management roles */}
        <Route path="clients" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <Clients />
          </RoleProtectedRoute>
        } />
        <Route path="clients/:id" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <ClientDetail />
          </RoleProtectedRoute>
        } />
        
        {/* Map - All management roles */}
        <Route path="map" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <MapView />
          </RoleProtectedRoute>
        } />
        
        {/* Invoices - All management roles */}
        <Route path="invoices" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <Invoices />
          </RoleProtectedRoute>
        } />
        <Route path="invoices/:id" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <InvoiceDetail />
          </RoleProtectedRoute>
        } />
        
        {/* Analytics - All management roles */}
        <Route path="analytics" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <Analytics />
          </RoleProtectedRoute>
        } />
        
        {/* Settings - Admin roles only */}
        <Route path="settings" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'admin']}>
            <Settings />
          </RoleProtectedRoute>
        } />
        
        {/* Integrations - Super Admin only */}
        <Route path="integrations" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'admin']}>
            <Integrations />
          </RoleProtectedRoute>
        } />
        
        {/* Soumissions - All management roles */}
        <Route path="soumissions" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <Soumissions />
          </RoleProtectedRoute>
        } />
        <Route path="soumissions/new" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <SoumissionsNew />
          </RoleProtectedRoute>
        } />
        
        {/* Reviews - All management roles */}
        <Route path="reviews" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <Reviews />
          </RoleProtectedRoute>
        } />
        
        {/* Property Passports - All management roles */}
        <Route path="property-passports" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <PropertyPassports />
          </RoleProtectedRoute>
        } />
        <Route path="property-passports/:id" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <PropertyPassportDetail />
          </RoleProtectedRoute>
        } />
        
        {/* Maintenance Contracts - All management roles */}
        <Route path="maintenance-contracts" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <MaintenanceContracts />
          </RoleProtectedRoute>
        } />
        
        {/* Notifications - All roles */}
        <Route path="notifications" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher', 'technician']}>
            <Notifications />
          </RoleProtectedRoute>
        } />
        
        {/* Help - accessible to all */}
        <Route path="help" element={<Help />} />
        
        {/* New feature routes */}
        <Route path="thermal-heat-map" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <ThermalHeatMap />
          </RoleProtectedRoute>
        } />
        <Route path="remote-quoting" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <RemoteQuoting />
          </RoleProtectedRoute>
        } />
        <Route path="bidding-marketplace" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <BiddingMarketplace />
          </RoleProtectedRoute>
        } />
        <Route path="contractor-bids" element={
          <RoleProtectedRoute allowedRoles={['super-admin', 'division-head', 'operations-manager', 'admin', 'dispatcher']}>
            <ContractorBids />
          </RoleProtectedRoute>
        } />

        {/* GROUPE LAFRANCE APP - Plumber routes (BET Marketplace) */}
        <Route path="plumber-marketplace" element={
          <PlumberRoute>
            <BiddingMarketplacePlumber />
          </PlumberRoute>
        } />
        <Route path="plumber/aftersales" element={
          <PlumberRoute>
            <PlumberAfterSalesClaimsList />
          </PlumberRoute>
        } />
        <Route path="plumber/aftersales/:claimId" element={
          <PlumberRoute>
            <PlumberClaimDetail />
          </PlumberRoute>
        } />
        <Route path="plumber/payments" element={
          <PlumberRoute>
            <PlumberPaymentsDashboard />
          </PlumberRoute>
        } />

        {/* GROUPE LAFRANCE APP - Admin routes (BET Internal Admin) */}
        <Route path="admin/review-queue" element={
          <AdminRoute>
            <AdminReviewQueue />
          </AdminRoute>
        } />
        <Route path="admin/aftersales/:claimId" element={
          <AdminRoute>
            <AdminClaimArbitrationPage />
          </AdminRoute>
        } />
        <Route path="admin/payments" element={
          <AdminRoute>
            <AdminPaymentManagement />
          </AdminRoute>
        } />

        {/* GROUPE LAFRANCE APP - Client routes (BET Marketplace) */}
        <Route path="client-request" element={
          <ClientRoute>
            <ClientRequestForm />
          </ClientRoute>
        } />
      </Route>

      {/* Mobile Technician App Routes */}
      <Route path="/mobile/login" element={<MobileLogin />} />
      <Route path="/mobile/job/:jobId" element={
        <PlumberRoute>
          <MobileJobWorkflow />
        </PlumberRoute>
      } />
      <Route path="/mobile/*" element={<MobileTechApp />} />

      {/* Customer Portal Routes (BET Marketplace) */}
      <Route path="/portal/invoice/:invoiceId" element={
        <ClientRoute>
          <ClientInvoiceView />
        </ClientRoute>
      } />
      <Route path="/portal/aftersales/:invoiceId" element={
        <ClientRoute>
          <ClientAfterSalesService />
        </ClientRoute>
      } />
      <Route path="/portal/payment" element={
        <ClientRoute>
          <ClientPaymentPage />
        </ClientRoute>
      } />
      <Route path="/portal/*" element={<CustomerPortal />} />
      <Route path="/client-portal/*" element={<ClientPortalMain />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  useEffect(() => {
    console.log("App component mounted");
    try {
      registerServiceWorker();
      setupPWAInstallPrompt();
      setupNetworkStatusListeners();
      console.log("App initialization complete");
    } catch (error) {
      console.error("Error in App useEffect:", error);
    }
  }, []);

  console.log("App component rendering");

  return (
    <ErrorBoundary>
      <KonstaApp theme="ios">
        <AuthProvider>
          <BrowserRouter>
            <AppProvider>
              <Toaster position="top-right" />
              <AppRoutes />
              <OfflineIndicator />
            </AppProvider>
          </BrowserRouter>
        </AuthProvider>
      </KonstaApp>
    </ErrorBoundary>
  );
}