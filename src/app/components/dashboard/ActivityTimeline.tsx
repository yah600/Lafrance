import { 
  CheckCircle2, 
  UserPlus, 
  FileText, 
  MapPin, 
  Clock, 
  AlertCircle,
  DollarSign,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: string;
  type: 'job_completed' | 'client_added' | 'invoice_paid' | 'job_assigned' | 'job_scheduled' | 'message_sent' | 'alert';
  message: string;
  timestamp: string;
  user?: string;
  meta?: string;
  jobId?: string;
  clientId?: string;
  invoiceId?: string;
}

interface ActivityTimelineProps {
  activities?: Activity[];
  maxItems?: number;
}

const defaultActivities: Activity[] = [
  {
    id: '1',
    type: 'job_completed',
    message: 'Marc a terminé le travail',
    timestamp: 'Il y a 5 min',
    user: 'Marc Tremblay',
    meta: '#1234'
  },
  {
    id: '2',
    type: 'client_added',
    message: 'Nouveau client ajouté',
    timestamp: 'Il y a 12 min',
    user: 'Sophie Gagnon',
    meta: 'Jean Dupont'
  },
  {
    id: '3',
    type: 'invoice_paid',
    message: 'Facture payée',
    timestamp: 'Il y a 23 min',
    meta: '#567 - $299.00'
  },
  {
    id: '4',
    type: 'job_assigned',
    message: 'Travail assigné à Pierre',
    timestamp: 'Il y a 45 min',
    user: 'Dispatcher',
    meta: '#1235'
  },
  {
    id: '5',
    type: 'job_scheduled',
    message: 'Nouveau travail planifié',
    timestamp: 'Il y a 1h',
    meta: 'Demain 9h00'
  },
];

export function ActivityTimeline({ activities = defaultActivities, maxItems = 10 }: ActivityTimelineProps) {
  
  const getIcon = (type: Activity['type']) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case 'job_completed':
        return <CheckCircle2 className={`${iconClass} text-green-600`} />;
      case 'client_added':
        return <UserPlus className={`${iconClass} text-blue-600`} />;
      case 'invoice_paid':
        return <DollarSign className={`${iconClass} text-emerald-600`} />;
      case 'job_assigned':
        return <MapPin className={`${iconClass} text-purple-600`} />;
      case 'job_scheduled':
        return <Calendar className={`${iconClass} text-orange-600`} />;
      case 'message_sent':
        return <MessageSquare className={`${iconClass} text-blue-500`} />;
      case 'alert':
        return <AlertCircle className={`${iconClass} text-red-600`} />;
      default:
        return <Clock className={`${iconClass} text-gray-600`} />;
    }
  };

  const getBackgroundColor = (type: Activity['type']) => {
    switch (type) {
      case 'job_completed':
        return 'bg-green-50';
      case 'client_added':
        return 'bg-blue-50';
      case 'invoice_paid':
        return 'bg-emerald-50';
      case 'job_assigned':
        return 'bg-purple-50';
      case 'job_scheduled':
        return 'bg-orange-50';
      case 'message_sent':
        return 'bg-blue-50';
      case 'alert':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const displayActivities = activities.slice(0, maxItems);

  const navigate = useNavigate();

  const handleActivityClick = (activity: Activity) => {
    // Navigate based on activity type
    switch (activity.type) {
      case 'job_completed':
      case 'job_assigned':
      case 'job_scheduled':
        // Navigate to dispatch/jobs page - could add job detail page later
        navigate('/dispatch');
        break;
      case 'client_added':
        // Navigate to clients page
        navigate('/clients');
        break;
      case 'invoice_paid':
        // Navigate to invoices page
        navigate('/invoices');
        break;
      case 'message_sent':
        // Navigate to notifications or messages
        navigate('/notifications');
        break;
      default:
        // For other types, just show a toast or do nothing
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[var(--primary)]" />
          Activité Récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex gap-4 relative cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-colors" 
              onClick={() => handleActivityClick(activity)}
            >
              {/* Timeline line */}
              {index < displayActivities.length - 1 && (
                <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-200" />
              )}
              
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getBackgroundColor(activity.type)} flex items-center justify-center relative z-10`}>
                {getIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    {activity.user && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Par {activity.user}
                      </p>
                    )}
                    {activity.meta && (
                      <p className="text-xs text-[var(--primary)] font-medium mt-0.5">
                        {activity.meta}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activities.length > maxItems && (
          <button className="mt-4 w-full text-sm text-[var(--primary)] hover:text-[var(--primary)]/80 font-medium">
            Voir tout l'historique
          </button>
        )}
      </CardContent>
    </Card>
  );
}