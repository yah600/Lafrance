import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { cn } from './utils';

interface AvatarGroupProps {
  avatars: {
    src?: string;
    fallback: string;
    name?: string;
  }[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarGroup({ avatars, max = 5, size = 'md', className }: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn("flex -space-x-2", className)}>
      {displayAvatars.map((avatar, index) => (
        <Avatar 
          key={index} 
          className={cn(
            "border-2 border-white ring-1 ring-gray-200 hover:z-10 transition-all",
            sizeClasses[size]
          )}
          title={avatar.name}
        >
          <AvatarImage src={avatar.src} alt={avatar.name} />
          <AvatarFallback className={textSizeClasses[size]}>
            {avatar.fallback}
          </AvatarFallback>
        </Avatar>
      ))}
      
      {remainingCount > 0 && (
        <Avatar 
          className={cn(
            "border-2 border-white ring-1 ring-gray-200 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all hover:z-10",
            sizeClasses[size]
          )}
          title={`+${remainingCount} autres`}
        >
          <AvatarFallback className={cn("text-gray-600 font-semibold", textSizeClasses[size])}>
            +{remainingCount}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}