import { Clock, MapPin, Phone } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import type { Job } from '../../types';
import { cn } from '../ui/utils';

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  assigned: { label: 'Assigné', color: 'bg-blue-100 text-blue-800' },
  'en-route': { label: 'En route', color: 'bg-purple-100 text-purple-800' },
  'in-progress': { label: 'En cours', color: 'bg-teal-100 text-teal-800' },
  completed: { label: 'Terminé', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800' },
  'on-hold': { label: 'En attente', color: 'bg-gray-100 text-gray-800' }
};

const priorityColors = {
  low: 'bg-gray-200',
  normal: 'bg-blue-400',
  high: 'bg-orange-400',
  urgent: 'bg-red-500'
};

interface JobCardProps {
  job: Job;
  onClick?: () => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  const statusInfo = statusConfig[job.status];

  return (
    <Card 
      className={cn(
        'hover:shadow-md transition-all cursor-pointer',
        job.priority === 'urgent' && 'ring-2 ring-red-200'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Priority bar */}
        <div className={cn('h-1 rounded-full mb-3', priorityColors[job.priority])} />

        {/* Time and Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{job.scheduledTime}</span>
          </div>
          <Badge className={statusInfo.color}>
            {statusInfo.label}
          </Badge>
        </div>

        {/* Client Info */}
        <div className="mb-3">
          <h4 className="font-semibold text-base mb-1">{job.client.name}</h4>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{job.client.address}</span>
          </div>
        </div>

        {/* Service Type */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
            {job.serviceType}
          </span>
        </div>

        {/* Technician or Assign */}
        <div className="flex items-center justify-between">
          {job.technician ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                  {job.technician.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{job.technician.name}</span>
            </div>
          ) : (
            <span className="text-sm text-orange-600 font-medium">À assigner</span>
          )}

          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
