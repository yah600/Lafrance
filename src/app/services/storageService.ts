/**
 * Storage Service
 *
 * Centralized localStorage wrapper for managing persistent data in the BET marketplace.
 * All data is stored client-side with no backend required.
 */

export class StorageService {
  private static PREFIX = 'mockData_';

  /**
   * Get item from localStorage
   */
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      if (!item) return null;

      const parsed = JSON.parse(item);

      // Convert date strings back to Date objects
      return this.reviveDates(parsed);
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  static set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.PREFIX + key, serialized);
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);

      // Check if quota exceeded
      if (error instanceof DOMException && error.code === 22) {
        console.warn('localStorage quota exceeded. Clearing old data...');
        this.clearOldData();

        // Try again
        try {
          const serialized = JSON.stringify(value);
          localStorage.setItem(this.PREFIX + key, serialized);
        } catch (retryError) {
          console.error('Still failed after clearing old data:', retryError);
        }
      }
    }
  }

  /**
   * Remove item from localStorage
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  /**
   * Clear all data with our prefix
   */
  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Get all keys with our prefix
   */
  static getAllKeys(): string[] {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.PREFIX))
        .map(key => key.replace(this.PREFIX, ''));
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Check if key exists
   */
  static has(key: string): boolean {
    return localStorage.getItem(this.PREFIX + key) !== null;
  }

  /**
   * Get storage size in bytes
   */
  static getSize(): number {
    let total = 0;
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          const item = localStorage.getItem(key);
          if (item) {
            total += item.length + key.length;
          }
        }
      });
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }
    return total;
  }

  /**
   * Get storage size in human-readable format
   */
  static getSizeFormatted(): string {
    const bytes = this.getSize();
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Export all data as JSON
   */
  static exportAll(): string {
    try {
      const data: Record<string, any> = {};
      const keys = this.getAllKeys();

      keys.forEach(key => {
        data[key] = this.get(key);
      });

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '{}';
    }
  }

  /**
   * Import data from JSON
   */
  static importAll(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);

      Object.keys(data).forEach(key => {
        this.set(key, data[key]);
      });

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Clear old data to free up space
   * Removes data older than 30 days
   */
  private static clearOldData(): void {
    try {
      const keys = this.getAllKeys();
      const now = Date.now();
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

      keys.forEach(key => {
        const data = this.get<any>(key);
        if (Array.isArray(data)) {
          // Filter out old items
          const filtered = data.filter((item: any) => {
            if (item.createdAt) {
              const createdAt = new Date(item.createdAt).getTime();
              return createdAt > thirtyDaysAgo;
            }
            return true; // Keep items without createdAt
          });

          if (filtered.length < data.length) {
            this.set(key, filtered);
            console.log(`Cleared ${data.length - filtered.length} old items from ${key}`);
          }
        }
      });
    } catch (error) {
      console.error('Error clearing old data:', error);
    }
  }

  /**
   * Revive Date objects from JSON
   */
  private static reviveDates(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    // Check if it's a date string (ISO 8601 format)
    if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
      return new Date(obj);
    }

    // Recursively process objects
    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        return obj.map(item => this.reviveDates(item));
      }

      const result: any = {};
      Object.keys(obj).forEach(key => {
        result[key] = this.reviveDates(obj[key]);
      });
      return result;
    }

    return obj;
  }
}
