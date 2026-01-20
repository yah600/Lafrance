/**
 * Service Worker for Offline PWA Support
 * Multi-Division Dispatch Platform
 */

const CACHE_NAME = 'dispatch-platform-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache for offline use
const CRITICAL_ASSETS = [
  '/',
  '/offline.html',
  '/index.html',
  '/src/app/App.tsx',
  '/src/styles/index.css',
  '/src/styles/konsta-ios.css',
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[Service Worker] Caching critical assets');
      await cache.addAll(CRITICAL_ASSETS);
    })()
  );
  // Force the waiting service worker to become active
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })()
  );
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome extensions
  if (event.request.url.startsWith('chrome-extension://')) return;

  event.respondWith(
    (async () => {
      try {
        // Try to fetch from network first
        const networkResponse = await fetch(event.request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        // Network failed, try cache
        console.log('[Service Worker] Fetch failed, serving from cache:', event.request.url);
        const cachedResponse = await caches.match(event.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If cache miss and it's a navigation request, show offline page
        if (event.request.mode === 'navigate') {
          const offlineResponse = await caches.match(OFFLINE_URL);
          if (offlineResponse) {
            return offlineResponse;
          }
        }
        
        // Return error
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-jobs') {
    event.waitUntil(syncJobs());
  } else if (event.tag === 'sync-photos') {
    event.waitUntil(syncPhotos());
  }
});

// Sync jobs when back online
async function syncJobs() {
  console.log('[Service Worker] Syncing jobs...');
  try {
    const pendingJobs = await getPendingJobsFromIndexedDB();
    for (const job of pendingJobs) {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      await removePendingJobFromIndexedDB(job.id);
    }
    console.log('[Service Worker] Jobs synced successfully');
  } catch (error) {
    console.error('[Service Worker] Job sync failed:', error);
    throw error;
  }
}

// Sync photos when back online
async function syncPhotos() {
  console.log('[Service Worker] Syncing photos...');
  try {
    const pendingPhotos = await getPendingPhotosFromIndexedDB();
    for (const photo of pendingPhotos) {
      const formData = new FormData();
      formData.append('photo', photo.blob);
      formData.append('jobId', photo.jobId);
      
      await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });
      await removePendingPhotoFromIndexedDB(photo.id);
    }
    console.log('[Service Worker] Photos synced successfully');
  } catch (error) {
    console.error('[Service Worker] Photo sync failed:', error);
    throw error;
  }
}

// IndexedDB helpers (placeholder - would need full implementation)
async function getPendingJobsFromIndexedDB() {
  // This would query IndexedDB for pending jobs
  return [];
}

async function removePendingJobFromIndexedDB(id) {
  // This would remove a job from IndexedDB
  return true;
}

async function getPendingPhotosFromIndexedDB() {
  // This would query IndexedDB for pending photos
  return [];
}

async function removePendingPhotoFromIndexedDB(id) {
  // This would remove a photo from IndexedDB
  return true;
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Nouvelle notification';
  const options = {
    body: data.body || 'Vous avez reçu une nouvelle notification',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: data.tag || 'general',
    data: data.data || {},
    actions: data.actions || [],
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.notification.tag);
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

console.log('[Service Worker] Loaded');
