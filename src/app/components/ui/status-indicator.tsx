import { cn } from './utils';

export type StatusType = 'online' | 'busy' | 'away' | 'offline' | 'available' | 'en-route' | 'on-job';

interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  pulse?: boolean;
}

export function StatusIndicator({ 
  status, 
  size = 'md', 
  showLabel = false,
  className,
  pulse = false
}: StatusIndicatorProps) {
  
  const getStatusColor = () => {
    switch (status) {
      case 'online':
      case 'available':
        return 'bg-green-500';
      case 'busy':
      case 'on-job':
        return 'bg-blue-500';
      case 'en-route':
        return 'bg-yellow-500';
      case 'away':
        return 'bg-orange-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'online':
        return 'En ligne';
      case 'available':
        return 'Disponible';
      case 'busy':
        return 'Occupé';
      case 'on-job':
        return 'En travail';
      case 'en-route':
        return 'En route';
      case 'away':
        return 'Absent';
      case 'offline':
        return 'Hors ligne';
      default:
        return 'Inconnu';
    }
  };

  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex">
        <span 
          className={cn(
            "inline-flex rounded-full",
            sizeClasses[size],
            getStatusColor()
          )}
        />
        {pulse && (
          <span 
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
              getStatusColor()
            )}
          />
        )}
      </span>
      {showLabel && (
        <span className="text-sm text-muted-foreground">
          {getStatusLabel()}
        </span>
      )}
    </div>
  );
}