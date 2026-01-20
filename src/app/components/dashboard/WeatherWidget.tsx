import { Cloud, CloudRain, CloudSnow, Sun, Wind } from 'lucide-react';

interface WeatherWidgetProps {
  temperature?: number;
  condition?: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  location?: string;
}

export function WeatherWidget({ 
  temperature = -5, 
  condition = 'snowy',
  location = 'Montréal'
}: WeatherWidgetProps) {
  
  const getWeatherIcon = () => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'snowy':
        return <CloudSnow className="h-5 w-5 text-blue-300" />;
      case 'windy':
        return <Wind className="h-5 w-5 text-gray-600" />;
      default:
        return <Cloud className="h-5 w-5 text-gray-500" />;
    }
  };

  const getConditionLabel = () => {
    switch (condition) {
      case 'sunny':
        return 'Ensoleillé';
      case 'cloudy':
        return 'Nuageux';
      case 'rainy':
        return 'Pluvieux';
      case 'snowy':
        return 'Neigeux';
      case 'windy':
        return 'Venteux';
      default:
        return 'Nuageux';
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200">
      {getWeatherIcon()}
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">
          {temperature > 0 ? '+' : ''}{temperature}°C
        </span>
        <div className="h-4 w-px bg-gray-300" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{location}</span>
          <span className="text-xs text-muted-foreground">{getConditionLabel()}</span>
        </div>
      </div>
    </div>
  );
}
