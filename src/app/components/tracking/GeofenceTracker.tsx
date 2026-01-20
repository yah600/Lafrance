import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Circle, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';

interface GeofenceTrackerProps {
  jobAddress: string;
  jobCoordinates: { lat: number; lng: number };
  plumberLocation: { lat: number; lng: number } | null;
  geofenceRadius?: number; // in meters, default 100m
  minDwellTime?: number; // in minutes, default 3 minutes
  onTimerStart?: () => void;
  onTimerStop?: () => void;
}

interface TimerState {
  isRunning: boolean;
  startTime: Date | null;
  elapsedSeconds: number;
  isInGeofence: boolean;
  dwellTime: number; // Time spent in geofence (seconds)
}

export function GeofenceTracker({
  jobAddress,
  jobCoordinates,
  plumberLocation,
  geofenceRadius = 100,
  minDwellTime = 3,
  onTimerStart,
  onTimerStop,
}: GeofenceTrackerProps) {
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    startTime: null,
    elapsedSeconds: 0,
    isInGeofence: false,
    dwellTime: 0,
  });

  const [distance, setDistance] = useState<number | null>(null);

  // Calculate distance using Haversine formula
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  useEffect(() => {
    if (!plumberLocation) return;

    const dist = calculateDistance(
      plumberLocation.lat,
      plumberLocation.lng,
      jobCoordinates.lat,
      jobCoordinates.lng
    );
    setDistance(dist);

    const isInside = dist <= geofenceRadius;
    const wasInside = timer.isInGeofence;

    // Update geofence status
    setTimer((prev) => ({ ...prev, isInGeofence: isInside }));

    // Entered geofence
    if (isInside && !wasInside) {
      toast.info('Plombier entré dans la zone du client (100m)');
    }

    // Exited geofence
    if (!isInside && wasInside) {
      toast.warning('Plombier sorti de la zone du client');
      // Reset dwell time
      setTimer((prev) => ({ ...prev, dwellTime: 0 }));
    }
  }, [plumberLocation, jobCoordinates, geofenceRadius, timer.isInGeofence]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (!prev.isInGeofence) {
          return { ...prev, dwellTime: 0 };
        }

        const newDwellTime = prev.dwellTime + 1;

        // Start timer if dwell time >= minimum (3 minutes = 180 seconds)
        if (newDwellTime >= minDwellTime * 60 && !prev.isRunning) {
          toast.success('Le plombier est arrivé! Le timer démarre automatiquement.');
          if (onTimerStart) onTimerStart();

          return {
            ...prev,
            dwellTime: newDwellTime,
            isRunning: true,
            startTime: new Date(),
            elapsedSeconds: 0,
          };
        }

        return { ...prev, dwellTime: newDwellTime };
      });

      // Update elapsed time if timer is running
      setTimer((prev) => {
        if (!prev.isRunning || !prev.startTime) return prev;

        const now = new Date();
        const elapsed = Math.floor((now.getTime() - prev.startTime.getTime()) / 1000);

        return { ...prev, elapsedSeconds: elapsed };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [minDwellTime, onTimerStart]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const dwellProgress = (timer.dwellTime / (minDwellTime * 60)) * 100;

  return (
    <div className="space-y-4">
      {/* Location Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Suivi de localisation
            </CardTitle>
            {timer.isInGeofence ? (
              <Badge className="bg-green-600">Dans la zone</Badge>
            ) : distance !== null && distance < 1000 ? (
              <Badge variant="secondary">À proximité</Badge>
            ) : (
              <Badge variant="outline">En route</Badge>
            )}
          </div>
          <CardDescription>{jobAddress}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Distance Display */}
          {distance !== null && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Distance du client:</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {distance < 1000 ? `${Math.round(distance)} m` : `${(distance / 1000).toFixed(1)} km`}
              </span>
            </div>
          )}

          {/* Geofence Status */}
          <div
            className={`p-4 rounded-lg border-2 ${
              timer.isInGeofence
                ? 'bg-green-50 border-green-300'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Circle
                  className={`h-5 w-5 ${
                    timer.isInGeofence ? 'text-green-600 fill-green-600' : 'text-gray-400'
                  }`}
                />
                <span className="font-medium">
                  Zone de service (rayon {geofenceRadius}m)
                </span>
              </div>
              {timer.isInGeofence && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
            </div>

            {timer.isInGeofence && !timer.isRunning && (
              <div>
                <p className="text-sm text-green-700 mb-2">
                  Temps dans la zone: {Math.floor(timer.dwellTime / 60)} min {timer.dwellTime % 60} sec
                </p>
                <Progress value={Math.min(dwellProgress, 100)} className="h-2 bg-green-200" />
                <p className="text-xs text-green-600 mt-1">
                  Le timer démarrera automatiquement après {minDwellTime} minutes dans la zone
                </p>
              </div>
            )}
          </div>

          {/* Timer Display */}
          {timer.isRunning && (
            <div className="p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <span className="text-lg font-semibold text-blue-900">
                    Timer de service
                  </span>
                </div>
                <Badge className="bg-blue-600">En cours</Badge>
              </div>

              <div className="text-center">
                <p className="text-5xl font-bold text-blue-900 tabular-nums mb-2">
                  {formatTime(timer.elapsedSeconds)}
                </p>
                <p className="text-sm text-blue-700">
                  Démarré à {timer.startTime?.toLocaleTimeString('fr-CA')}
                </p>
              </div>

              {/* Reminder for 45-minute intervals */}
              {timer.elapsedSeconds > 0 && timer.elapsedSeconds % 2700 < 5 && (
                <div className="mt-4 bg-amber-50 border border-amber-300 rounded-lg p-3">
                  <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Rappel: Prendre des photos de progression toutes les 45 minutes
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Warning if not in geofence */}
          {!plumberLocation && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                ⚠️ En attente de la localisation du plombier...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
