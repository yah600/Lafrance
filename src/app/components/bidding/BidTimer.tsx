import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface BidTimerProps {
  endTime: Date;
  urgent?: boolean;
  onExpire?: () => void;
}

export function BidTimer({ endTime, urgent = false, onExpire }: BidTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    total: number;
    minutes: number;
    seconds: number;
  }>({ total: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft({ total: 0, minutes: 0, seconds: 0 });
        if (onExpire) onExpire();
        return;
      }

      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ total: difference, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  const totalDuration = urgent ? 5 * 60 * 1000 : 120 * 60 * 1000; // 5 min or 2 hours
  const progress = ((totalDuration - timeLeft.total) / totalDuration) * 100;

  const isUrgent = timeLeft.total > 0 && timeLeft.total < 60000; // Less than 1 minute
  const isExpired = timeLeft.total <= 0;

  if (isExpired) {
    return (
      <div className="bg-red-100 border border-red-300 rounded-lg p-3">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-semibold">Période de soumission expirée</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg p-4 border-2 ${
        isUrgent
          ? 'bg-red-50 border-red-300 animate-pulse'
          : urgent
          ? 'bg-orange-50 border-orange-300'
          : 'bg-blue-50 border-blue-300'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock
            className={`h-5 w-5 ${
              isUrgent ? 'text-red-600' : urgent ? 'text-orange-600' : 'text-blue-600'
            }`}
          />
          <span
            className={`font-semibold ${
              isUrgent ? 'text-red-700' : urgent ? 'text-orange-700' : 'text-blue-700'
            }`}
          >
            Temps restant pour soumissionner
          </span>
        </div>

        {urgent && (
          <Badge variant="destructive" className="animate-pulse">
            URGENT
          </Badge>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span
          className={`text-4xl font-bold tabular-nums ${
            isUrgent ? 'text-red-700' : urgent ? 'text-orange-700' : 'text-blue-700'
          }`}
        >
          {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span
          className={`text-sm ${
            isUrgent ? 'text-red-600' : urgent ? 'text-orange-600' : 'text-blue-600'
          }`}
        >
          minutes
        </span>
      </div>

      <Progress
        value={progress}
        className={`h-2 ${
          isUrgent ? 'bg-red-200' : urgent ? 'bg-orange-200' : 'bg-blue-200'
        }`}
      />

      {isUrgent && (
        <p className="text-xs text-red-700 font-medium mt-2 animate-pulse">
          ⚠️ Moins d'une minute restante!
        </p>
      )}
    </div>
  );
}
