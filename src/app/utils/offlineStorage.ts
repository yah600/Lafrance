/**
 * IndexedDB Offline Storage Utility
 * Stores data locally when offline for later sync
 */

const DB_NAME = 'DispatchPlatformDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  JOBS: 'pending_jobs',
  PHOTOS: 'pending_photos',
  TIME_ENTRIES: 'pending_time_entries',
  SIGNATURES: 'pending_signatures',
  NOTES: 'pending_notes',
  CACHED_DATA: 'cached_data'
};

interface PendingJob {
  id: string;
  jobId: string;
  action: 'start' | 'complete' | 'update';
  data: any;
  timestamp: number;
  synced: boolean;
}

interface PendingPhoto {
  id: string;
  jobId: string;
  blob: Blob;
  type: 'before' | 'during' | 'after';
  timestamp: number;
  synced: boolean;
}

interface PendingTimeEntry {
  id: string;
  jobId: string;
  technicianId: string;
  action: 'clock-in' | 'clock-out';
  timestamp: number;
  synced: boolean;
}

interface PendingSignature {
  id: string;
  jobId: string;
  signatureData: string; // base64
  clientName: string;
  timestamp: number;
  synced: boolean;
}

class OfflineStorage {
  private db: IDBDatabase | null = null;

  /**
   * Initialize IndexedDB
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB failed to open', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(STORES.JOBS)) {
          const jobStore = db.createObjectStore(STORES.JOBS, { keyPath: 'id', autoIncrement: true });
          jobStore.createIndex('jobId', 'jobId', { unique: false });
          jobStore.createIndex('synced', 'synced', { unique: false });
          jobStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.PHOTOS)) {
          const photoStore = db.createObjectStore(STORES.PHOTOS, { keyPath: 'id', autoIncrement: true });
          photoStore.createIndex('jobId', 'jobId', { unique: false });
          photoStore.createIndex('synced', 'synced', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.TIME_ENTRIES)) {
          const timeStore = db.createObjectStore(STORES.TIME_ENTRIES, { keyPath: 'id', autoIncrement: true });
          timeStore.createIndex('jobId', 'jobId', { unique: false });
          timeStore.createIndex('synced', 'synced', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.SIGNATURES)) {
          const sigStore = db.createObjectStore(STORES.SIGNATURES, { keyPath: 'id', autoIncrement: true });
          sigStore.createIndex('jobId', 'jobId', { unique: false });
          sigStore.createIndex('synced', 'synced', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.NOTES)) {
          const noteStore = db.createObjectStore(STORES.NOTES, { keyPath: 'id', autoIncrement: true });
          noteStore.createIndex('jobId', 'jobId', { unique: false });
          noteStore.createIndex('synced', 'synced', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.CACHED_DATA)) {
          const cacheStore = db.createObjectStore(STORES.CACHED_DATA, { keyPath: 'key' });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        console.log('IndexedDB object stores created');
      };
    });
  }

  /**
   * Add a pending job action
   */
  async addPendingJob(jobId: string, action: 'start' | 'complete' | 'update', data: any): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction([STORES.JOBS], 'readwrite');
    const store = transaction.objectStore(STORES.JOBS);

    const pendingJob: Partial<PendingJob> = {
      jobId,
      action,
      data,
      timestamp: Date.now(),
      synced: false
    };

    return new Promise((resolve, reject) => {
      const request = store.add(pendingJob);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add a pending photo
   */
  async addPendingPhoto(jobId: string, blob: Blob, type: 'before' | 'during' | 'after'): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction([STORES.PHOTOS], 'readwrite');
    const store = transaction.objectStore(STORES.PHOTOS);

    const pendingPhoto: Partial<PendingPhoto> = {
      jobId,
      blob,
      type,
      timestamp: Date.now(),
      synced: false
    };

    return new Promise((resolve, reject) => {
      const request = store.add(pendingPhoto);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add a pending time entry
   */
  async addPendingTimeEntry(jobId: string, technicianId: string, action: 'clock-in' | 'clock-out'): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction([STORES.TIME_ENTRIES], 'readwrite');
    const store = transaction.objectStore(STORES.TIME_ENTRIES);

    const pendingEntry: Partial<PendingTimeEntry> = {
      jobId,
      technicianId,
      action,
      timestamp: Date.now(),
      synced: false
    };

    return new Promise((resolve, reject) => {
      const request = store.add(pendingEntry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add a pending signature
   */
  async addPendingSignature(jobId: string, signatureData: string, clientName: string): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction([STORES.SIGNATURES], 'readwrite');
    const store = transaction.objectStore(STORES.SIGNATURES);

    const pendingSignature: Partial<PendingSignature> = {
      jobId,
      signatureData,
      clientName,
      timestamp: Date.now(),
      synced: false
    };

    return new Promise((resolve, reject) => {
      const request = store.add(pendingSignature);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all unsynced items from a store
   */
  async getUnsyncedItems(storeName: string): Promise<any[]> {
    try {
      if (!this.db) await this.init();

      // Double-check database is still open
      if (!this.db) {
        return [];
      }

      // Check if store exists
      if (!this.db.objectStoreNames.contains(storeName)) {
        return [];
      }

      // Try to create transaction, catch if database is closing
      let transaction;
      try {
        transaction = this.db.transaction([storeName], 'readonly');
      } catch (error) {
        // Database is closing or invalid state
        if (error instanceof DOMException && error.name === 'InvalidStateError') {
          return [];
        }
        throw error;
      }

      const store = transaction.objectStore(storeName);
      
      // Check if index exists
      if (!store.indexNames.contains('synced')) {
        return [];
      }
      
      const index = store.index('synced');

      return new Promise((resolve) => {
        const request = index.getAll(IDBKeyRange.only(false));
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]); // Always resolve with empty array
      });
    } catch (error) {
      // Silently handle all errors - database may not be available in preview
      return [];
    }
  }

  /**
   * Mark an item as synced
   */
  async markAsSynced(storeName: string, id: number): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.synced = true;
          const updateRequest = store.put(item);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Delete a synced item
   */
  async deleteSyncedItem(storeName: string, id: number): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Cache data for offline use
   */
  async cacheData(key: string, data: any, expiresInMs: number = 3600000): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction([STORES.CACHED_DATA], 'readwrite');
    const store = transaction.objectStore(STORES.CACHED_DATA);

    const cachedItem = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + expiresInMs
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cachedItem);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get cached data
   */
  async getCachedData(key: string): Promise<any | null> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction([STORES.CACHED_DATA], 'readonly');
    const store = transaction.objectStore(STORES.CACHED_DATA);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      
      request.onsuccess = () => {
        const item = request.result;
        if (item && item.expiresAt > Date.now()) {
          resolve(item.data);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all unsynced data (for testing or reset)
   */
  async clearAllUnsyncedData(): Promise<void> {
    if (!this.db) await this.init();

    const storeNames = Object.values(STORES).filter(name => name !== STORES.CACHED_DATA);
    
    for (const storeName of storeNames) {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  /**
   * Get count of unsynced items
   */
  async getUnsyncedCount(): Promise<number> {
    try {
      if (!this.db) {
        try {
          await this.init();
        } catch (error) {
          console.warn('Failed to initialize IndexedDB:', error);
          return 0;
        }
      }

      // Double-check db is initialized
      if (!this.db) {
        return 0;
      }

      let totalCount = 0;
      const storeNames = Object.values(STORES).filter(name => name !== STORES.CACHED_DATA);

      for (const storeName of storeNames) {
        try {
          // Check if store exists before querying
          if (!this.db!.objectStoreNames.contains(storeName)) {
            continue;
          }

          const items = await this.getUnsyncedItems(storeName);
          totalCount += items.length;
        } catch (error) {
          // Silently continue - don't log errors for empty databases
          continue;
        }
      }

      return totalCount;
    } catch (error) {
      // Silently return 0 - database may not be initialized in iframe/preview
      return 0;
    }
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorage();

// Auto-initialize on import
offlineStorage.init().catch(console.error);

// Export types
export type { PendingJob, PendingPhoto, PendingTimeEntry, PendingSignature };
export { STORES };