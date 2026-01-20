import { Plus, Sparkles } from 'lucide-react';
import { cn } from './utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ai' | 'secondary';
  size?: 'md' | 'lg';
  icon?: React.ReactNode;
  label?: string;
}

const FAB = forwardRef<HTMLButtonElement, FABProps>(
  ({ className, variant = 'primary', size = 'lg', icon, label, ...props }, ref) => {
    const baseClasses = "fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 font-semibold z-50";
    
    const variantClasses = {
      primary: "bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white",
      ai: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
      secondary: "bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200"
    };

    const sizeClasses = {
      md: label ? "h-12 px-5" : "h-12 w-12",
      lg: label ? "h-14 px-6" : "h-14 w-14"
    };

    const iconSizeClasses = {
      md: "h-5 w-5",
      lg: "h-6 w-6"
    };

    const defaultIcon = variant === 'ai' ? <Sparkles className={iconSizeClasses[size]} /> : <Plus className={iconSizeClasses[size]} />;

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {icon || defaultIcon}
        {label && <span>{label}</span>}
      </button>
    );
  }
);

FAB.displayName = 'FAB';

export { FAB };