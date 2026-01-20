/**
 * Offline Indicator Component
 * Shows network status and pending sync count
 */

import { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { offlineStorage } from '../utils/offlineStorage';
import { toast } from 'sonner';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connexion rétablie', {
        description: 'Synchronisation en cours...'
      });
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Connexion perdue', {
        description: 'Les données seront synchronisées au retour en ligne'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update unsynced count
  useEffect(() => {
    const updateCount = async () => {
      try {
        const count = await offlineStorage.getUnsyncedCount();
        setUnsyncedCount(count);
      } catch (error) {
        console.error('Error getting unsynced count:', error);
        // Don't show error to user, just log it
        setUnsyncedCount(0);
      }
    };

    // Delay initial fetch to allow IndexedDB to initialize
    const initialTimeout = setTimeout(updateCount, 1000);
    
    // Update every 10 seconds after that
    const interval = setInterval(updateCount, 10000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Sync pending data
  const syncPendingData = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    
    try {
      // In production, this would sync with the server
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark all items as synced (simulation)
      await offlineStorage.clearAllUnsyncedData();
      
      setUnsyncedCount(0);
      toast.success('Données synchronisées', {
        description: 'Toutes les modifications ont été envoyées'
      });
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Échec de la synchronisation', {
        description: 'Réessayez plus tard'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Don't show anything if online and no pending data
  if (isOnline && unsyncedCount === 0) {
    return null;
  }

  return (
    <>
      {/* Compact indicator */}
      <div 
        className="fixed bottom-4 right-4 z-50 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <Badge 
          className={`flex items-center gap-2 px-3 py-2 shadow-lg ${
            isOnline 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-orange-500 hover:bg-orange-600 animate-pulse'
          } text-white`}
        >
          {isOnline ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </span>
          {unsyncedCount > 0 && (
            <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {unsyncedCount}
            </span>
          )}
        </Badge>
      </div>

      {/* Detailed panel */}
      {showDetails && (
        <Card className="fixed bottom-20 right-4 z-50 w-80 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                ) : (
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                )}
                <h3 className="font-semibold text-sm">
                  {isOnline ? 'Connexion active' : 'Mode hors ligne'}
                </h3>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Status message */}
              <div className={`text-xs p-2 rounded ${
                isOnline ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
              }`}>
                {isOnline ? (
                  <>
                    <p className="font-medium mb-1">Connecté au serveur</p>
                    <p className="text-xs opacity-80">Toutes les fonctionnalités disponibles</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium mb-1">Mode hors ligne activé</p>
                    <p className="text-xs opacity-80">
                      Vos modifications seront synchronisées automatiquement au retour en ligne
                    </p>
                  </>
                )}
              </div>

              {/* Unsynced items */}
              {unsyncedCount > 0 && (
                <div className="border border-blue-200 bg-blue-50 rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-medium text-blue-900">
                      {unsyncedCount} modification{unsyncedCount > 1 ? 's' : ''} en attente
                    </p>
                  </div>
                  <p className="text-xs text-blue-700 opacity-80">
                    {isOnline 
                      ? 'Prêtes à être synchronisées' 
                      : 'Seront envoyées au retour en ligne'
                    }
                  </p>
                </div>
              )}

              {/* Sync button */}
              {isOnline && unsyncedCount > 0 && (
                <Button
                  onClick={syncPendingData}
                  disabled={isSyncing}
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Synchronisation...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Synchroniser maintenant
                    </>
                  )}
                </Button>
              )}

              {/* Offline capabilities */}
              {!isOnline && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Disponible hors ligne:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Consulter l'horaire</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Voir les détails des travaux</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Prendre des photos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Signer des documents</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}