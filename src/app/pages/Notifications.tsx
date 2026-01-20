import { useState } from 'react';
import { Bell, Check, Trash2, Filter, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'urgent' | 'info' | 'payment' | 'system';
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Urgence: Fuite d\'eau majeure',
    message: 'Nouveau travail urgent de Restaurant Le Gourmet - intervention requise immédiatement',
    time: 'Il y a 5 min',
    date: '2024-12-17',
    read: false,
    link: '/dispatch'
  },
  {
    id: '2',
    type: 'info',
    title: 'Travail complété',
    message: 'Marc Tremblay a terminé le travail #1234 - Déblocage drain résidentiel',
    time: 'Il y a 15 min',
    date: '2024-12-17',
    read: false,
    link: '/dispatch'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Paiement reçu',
    message: 'Facture #567 payée - Montant: $299 - Client: Marie Tremblay',
    time: 'Il y a 30 min',
    date: '2024-12-17',
    read: false,
    link: '/invoices'
  },
  {
    id: '4',
    type: 'info',
    title: 'Nouveau client',
    message: 'Jean Dupont a été ajouté au système - 450-555-0123',
    time: 'Il y a 1h',
    date: '2024-12-17',
    read: true,
    link: '/clients'
  },
  {
    id: '5',
    type: 'system',
    title: 'Rapport mensuel disponible',
    message: 'Le rapport d\'analytique de novembre est maintenant disponible',
    time: 'Il y a 2h',
    date: '2024-12-17',
    read: true,
    link: '/analytics'
  },
  {
    id: '6',
    type: 'info',
    title: 'Travail assigné',
    message: 'Pierre Gagnon a été assigné au travail #1235 - Installation chauffe-eau',
    time: 'Il y a 3h',
    date: '2024-12-17',
    read: true,
    link: '/dispatch'
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Toutes les notifications marquées comme lues');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification supprimée');
  };

  const deleteAllRead = () => {
    setNotifications(prev => prev.filter(n => !n.read));
    toast.success('Notifications lues supprimées');
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'payment':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'system':
        return <Bell className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100';
      case 'payment':
        return 'bg-green-100';
      case 'system':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Gérez toutes vos notifications
            </p>
          </div>
          <Badge variant="destructive" className="text-lg py-1 px-3">
            {unreadCount} non lues
          </Badge>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
          <Button variant="outline" onClick={deleteAllRead}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer les lues
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">
            Toutes ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Non lues ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="read">
            Lues ({notifications.length - unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="font-semibold mb-2">Aucune notification</h3>
                <p className="text-muted-foreground">
                  Vous n'avez aucune notification dans cette catégorie
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`transition-colors ${
                    !notification.read ? 'border-blue-200 bg-blue-50/30' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${getBgColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{notification.time}</span>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            title="Marquer comme lu"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
