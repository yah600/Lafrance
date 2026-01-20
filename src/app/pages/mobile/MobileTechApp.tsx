import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, MessageSquare, User, Menu } from 'lucide-react';
import MobileHome from './MobileHome';
import MobileJobDetail from './MobileJobDetail';
import MobileActiveJob from './MobileActiveJob';
import MobileJobCompletion from './MobileJobCompletion';
import MobileMessages from './MobileMessages';
import MobileProfile from './MobileProfile';
import MobileServiceForm from './MobileServiceForm';
import MobileEstimator from './MobileEstimator';

export default function MobileTechApp() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/mobile', icon: Home, label: 'Accueil' },
    { path: '/mobile/map', icon: Map, label: 'Carte' },
    { path: '/mobile/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/mobile/profile', icon: User, label: 'Profil' }
  ];

  const isActive = (path: string) => {
    if (path === '/mobile') {
      return location.pathname === '/mobile' || location.pathname === '/mobile/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 max-w-md mx-auto border-x">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<MobileHome />} />
          <Route path="job/:id" element={<MobileJobDetail />} />
          <Route path="active-job/:id" element={<MobileActiveJob />} />
          <Route path="complete-job/:id" element={<MobileJobCompletion />} />
          <Route path="map" element={<div className="p-4"><h2>Carte (à venir)</h2></div>} />
          <Route path="messages" element={<MobileMessages />} />
          <Route path="profile" element={<MobileProfile />} />
          <Route path="service-form" element={<MobileServiceForm />} />
          <Route path="estimator" element={<MobileEstimator />} />
          <Route path="*" element={<Navigate to="/mobile" replace />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t flex items-center justify-around h-16 px-2">
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive(item.path)
                ? 'text-[var(--primary)]'
                : 'text-gray-500'
            }`}
          >
            <item.icon className={`h-6 w-6 mb-1 ${isActive(item.path) ? 'stroke-[2.5]' : ''}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}