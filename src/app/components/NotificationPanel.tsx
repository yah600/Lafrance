import { Bell, Check, X, Clock, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'urgent' | 'info' | 'payment';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Urgence: Fuite d\'eau majeure',
    message: 'Nouveau travail urgent de Restaurant Le Gourmet',
    time: 'Il y a 5 min',
    read: false,
    link: '/dispatch'
  },
  {
    id: '2',
    type: 'info',
    title: 'Travail complété',
    message: 'Marc Tremblay a terminé le travail #1234',
    time: 'Il y a 15 min',
    read: false,
    link: '/dispatch'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Paiement reçu',
    message: 'Facture #567 payée - $299',
    time: 'Il y a 30 min',
    read: false,
    link: '/invoices'
  },
  {
    id: '4',
    type: 'info',
    title: 'Nouveau client',
    message: 'Jean Dupont a été ajouté au système',
    time: 'Il y a 1h',
    read: true,
    link: '/clients'
  }
];

export default function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const navigate = useNavigate();

  if (!open) return null;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Toutes les notifications marquées comme lues');
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => prev.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
    
    // Navigate if link exists
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  const goToSettings = () => {
    navigate('/settings');
    onClose();
  };

  const viewAllNotifications = () => {
    navigate('/notifications');
    onClose();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-16 bottom-0 w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h3 className="font-semibold">Notifications</h3>
            <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Actions */}
        <div className="p-3 border-b flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Tout marquer lu
          </Button>
          <Button variant="outline" size="sm" onClick={goToSettings}>
            <SettingsIcon className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${ 
                  !notif.read ? 'bg-blue-50/50' : ''
                }`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${ 
                    notif.type === 'urgent' ? 'bg-red-100' :
                    notif.type === 'payment' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {notif.type === 'urgent' ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : notif.type === 'payment' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Bell className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-sm">{notif.title}</h4>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{notif.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t text-center">
          <Button variant="link" className="text-sm" onClick={viewAllNotifications}>
            Voir toutes les notifications
          </Button>
        </div>
      </div>
    </>
  );
}