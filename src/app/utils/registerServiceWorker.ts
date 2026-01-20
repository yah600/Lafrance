/**
 * Service Worker Registration Utility
 * Registers service worker for PWA offline capabilities
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported in this browser');
    return null;
  }

  // Check if running in iframe (Figma preview, etc.)
  if (window.self !== window.top) {
    console.log('Service Worker registration skipped: Running in iframe');
    return null;
  }

  // Check if running on localhost or secure context
  if (!window.isSecureContext && location.hostname !== 'localhost') {
    console.log('Service Worker registration skipped: Not a secure context');
    return null;
  }

  try {
    // Register the service worker
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    });

    console.log('Service Worker registered successfully:', registration.scope);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            console.log('New service worker available. Refresh to update.');
            
            // Optionally show a notification to the user
            if (window.confirm('Une nouvelle version est disponible. Voulez-vous actualiser?')) {
              window.location.reload();
            }
          }
        });
      }
    });

    // Listen for controlling service worker changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
    });

    // Check if there's a waiting service worker
    if (registration.waiting) {
      console.log('Service Worker is waiting');
    }

    // Check if service worker is installing
    if (registration.installing) {
      console.log('Service Worker is installing');
    }

    // Check if service worker is active
    if (registration.active) {
      console.log('Service Worker is active');
    }

    return registration;
  } catch (error) {
    // Silently handle service worker registration errors in development/preview
    if (error instanceof Error && error.name === 'SecurityError') {
      console.log('Service Worker registration skipped: Security restrictions (likely iframe/preview)');
    } else {
      console.warn('Service Worker registration failed:', error);
    }
    return null;
  }
}

/**
 * Unregister service worker (for development/testing)
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const success = await registration.unregister();
      
      if (success) {
        console.log('Service Worker unregistered successfully');
      } else {
        console.log('Service Worker unregistration failed');
      }
      
      return success;
    } catch (error) {
      console.error('Error unregistering service worker:', error);
      return false;
    }
  }
  
  return false;
}

/**
 * Check if app is running in standalone mode (installed as PWA)
 */
export function isStandalone(): boolean {
  // Check if running in standalone mode
  const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check iOS standalone mode
  const isIOSStandalone = (window.navigator as any).standalone === true;
  
  return isStandaloneMode || isIOSStandalone;
}

/**
 * Sync pending data when back online
 */
export async function syncPendingData(registration: ServiceWorkerRegistration): Promise<void> {
  if ('sync' in registration) {
    try {
      // Register sync events
      await (registration as any).sync.register('sync-jobs');
      await (registration as any).sync.register('sync-photos');
      console.log('Background sync registered');
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  } else {
    console.log('Background sync not supported');
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  try {
    // Request notification permission first
    const permission = await requestNotificationPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    console.log('Push notification subscription:', subscription);
    
    // Send subscription to server
    // await fetch('/api/push-subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(subscription)
    // });

    return subscription;
  } catch (error) {
    console.error('Push notification subscription failed:', error);
    return null;
  }
}

/**
 * Convert VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

/**
 * Show PWA install prompt
 */
export function setupPWAInstallPrompt(): void {
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show custom install button or banner
    console.log('PWA install prompt available');
    
    // Dispatch custom event that UI can listen to
    window.dispatchEvent(new CustomEvent('pwa-install-available', { 
      detail: { prompt: deferredPrompt } 
    }));
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
  });
}

/**
 * Show install prompt when user clicks install button
 */
export async function showInstallPrompt(deferredPrompt: any): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User response to install prompt: ${outcome}`);
  
  return outcome === 'accepted';
}

/**
 * Check network status
 */
export function setupNetworkStatusListeners(
  onOnline: () => void,
  onOffline: () => void
): void {
  window.addEventListener('online', () => {
    console.log('Network: Online');
    onOnline();
  });

  window.addEventListener('offline', () => {
    console.log('Network: Offline');
    onOffline();
  });

  // Check initial status
  if (!navigator.onLine) {
    onOffline();
  }
}

/**
 * Get network information
 */
export function getNetworkInfo(): {
  online: boolean;
  type?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
} {
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;

  return {
    online: navigator.onLine,
    type: connection?.type,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt
  };
}