/**
 * Mock Data Service
 *
 * Centralized data management for the BET marketplace.
 * Handles localStorage persistence, CRUD operations, and data filtering.
 * All data is stored client-side with no backend required.
 */

import { StorageService } from './storageService';
import { JobStateMachine, type JobStatus } from '../utils/jobStateMachine';
import { generateAllMockData } from '../data/mockDataGenerator';
import { toast } from 'sonner';

// Storage keys
const KEYS = {
  PLUMBERS: 'plumbers',
  CLIENTS: 'clients',
  JOBS: 'jobs',
  BIDS: 'bids',
  PAYMENTS: 'payments',
  COMPLIANCE_DOCS: 'complianceDocuments',
  AFTERSALES_CLAIMS: 'aftersalesClaims',
  RATINGS: 'ratings',
  SUBSCRIPTIONS: 'subscriptions',
  NOTIFICATIONS: 'notifications',
  INTERNAL_ALERTS: 'internalAlerts',
  CREDIT_NOTES: 'creditNotes',
  INITIALIZED: 'initialized',
  LAST_RESET: 'lastReset',
};

export class MockDataService {
  private static instance: MockDataService;

  private constructor() {
    this.initialize();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  /**
   * Initialize data from localStorage or seed new data
   */
  private initialize(): void {
    const isInitialized = StorageService.has(KEYS.INITIALIZED);

    if (!isInitialized) {
      console.log('🌱 First time initialization - generating mock data...');
      this.seedData();
      StorageService.set(KEYS.INITIALIZED, true);
      StorageService.set(KEYS.LAST_RESET, new Date());
      console.log('✅ Mock data initialized');
    } else {
      console.log('✅ Loading data from localStorage');
    }
  }

  /**
   * Seed initial data
   */
  private seedData(): void {
    const data = generateAllMockData();

    // Store all data
    Object.keys(data).forEach(key => {
      StorageService.set(key, (data as any)[key]);
    });

    toast.success('Données initiales chargées!');
  }

  /**
   * Reset all data (for testing)
   */
  reset(): void {
    if (confirm('Ceci effacera toutes les données. Continuer?')) {
      StorageService.clear();
      this.seedData();
      StorageService.set(KEYS.INITIALIZED, true);
      StorageService.set(KEYS.LAST_RESET, new Date());
      toast.success('Données réinitialisées!');
      window.location.reload();
    }
  }

  /**
   * Export all data as JSON
   */
  exportData(): string {
    return StorageService.exportAll();
  }

  /**
   * Import data from JSON
   */
  importData(jsonString: string): boolean {
    const success = StorageService.importAll(jsonString);
    if (success) {
      toast.success('Données importées!');
      window.location.reload();
    } else {
      toast.error('Erreur d\'importation');
    }
    return success;
  }

  // ============================================
  // PLUMBER OPERATIONS
  // ============================================

  getAllPlumbers() {
    return StorageService.get<any[]>(KEYS.PLUMBERS) || [];
  }

  getPlumber(id: string) {
    const plumbers = this.getAllPlumbers();
    return plumbers.find(p => p.id === id);
  }

  getPlumbersByDistance(lat: number, lng: number, maxRadius: number) {
    const plumbers = this.getAllPlumbers();
    return plumbers.filter(p => {
      const distance = this.calculateDistance(
        lat,
        lng,
        p.coordinates.lat,
        p.coordinates.lng
      );
      return distance <= maxRadius;
    });
  }

  addPlumber(plumber: any) {
    const plumbers = this.getAllPlumbers();
    plumbers.push({
      ...plumber,
      id: plumber.id || this.generateId(),
      createdAt: plumber.createdAt || new Date(),
    });
    StorageService.set(KEYS.PLUMBERS, plumbers);
    return plumber;
  }

  updatePlumber(id: string, updates: any) {
    const plumbers = this.getAllPlumbers();
    const index = plumbers.findIndex(p => p.id === id);
    if (index !== -1) {
      plumbers[index] = { ...plumbers[index], ...updates, updatedAt: new Date() };
      StorageService.set(KEYS.PLUMBERS, plumbers);
      return plumbers[index];
    }
    return null;
  }

  // ============================================
  // CLIENT OPERATIONS
  // ============================================

  getAllClients() {
    return StorageService.get<any[]>(KEYS.CLIENTS) || [];
  }

  getClient(id: string) {
    const clients = this.getAllClients();
    return clients.find(c => c.id === id);
  }

  addClient(client: any) {
    const clients = this.getAllClients();
    clients.push({
      ...client,
      id: client.id || this.generateId(),
      createdAt: client.createdAt || new Date(),
    });
    StorageService.set(KEYS.CLIENTS, clients);
    return client;
  }

  updateClient(id: string, updates: any) {
    const clients = this.getAllClients();
    const index = clients.findIndex(c => c.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updates, updatedAt: new Date() };
      StorageService.set(KEYS.CLIENTS, clients);
      return clients[index];
    }
    return null;
  }

  // ============================================
  // JOB OPERATIONS
  // ============================================

  getAllJobs() {
    return StorageService.get<any[]>(KEYS.JOBS) || [];
  }

  getJob(id: string) {
    const jobs = this.getAllJobs();
    return jobs.find(j => j.id === id);
  }

  getJobsByStatus(status: JobStatus) {
    const jobs = this.getAllJobs();
    return jobs.filter(j => j.status === status);
  }

  getJobsByPlumber(plumberId: string) {
    const jobs = this.getAllJobs();
    return jobs.filter(j => j.plumberId === plumberId);
  }

  getJobsByClient(clientId: string) {
    const jobs = this.getAllJobs();
    return jobs.filter(j => j.clientId === clientId);
  }

  addJob(job: any) {
    const jobs = this.getAllJobs();

    // Validate initial status
    const jobWithDefaults = {
      ...job,
      id: job.id || this.generateJobId(),
      status: job.status || 'pending_review',
      createdAt: job.createdAt || new Date(),
      stateHistory: job.stateHistory || [],
    };

    // Validate job state
    const validation = JobStateMachine.validateJobState(jobWithDefaults);
    if (!validation.isValid) {
      console.error('Job validation failed:', validation.errors);
      toast.error(validation.errors[0]);
      return null;
    }

    jobs.push(jobWithDefaults);
    StorageService.set(KEYS.JOBS, jobs);

    console.log('✅ Job added:', jobWithDefaults.id);
    return jobWithDefaults;
  }

  updateJob(id: string, updates: any) {
    const jobs = this.getAllJobs();
    const index = jobs.findIndex(j => j.id === id);

    if (index === -1) {
      console.error('Job not found:', id);
      return null;
    }

    const currentJob = jobs[index];

    // If status is changing, validate transition
    if (updates.status && updates.status !== currentJob.status) {
      const result = JobStateMachine.transition(
        currentJob.status,
        updates.status,
        updates.transitionMetadata
      );

      if (!result.success) {
        console.error('Invalid state transition:', result.error);
        toast.error(result.error);
        return null;
      }

      // Add transition to history
      const stateHistory = [...(currentJob.stateHistory || []), result.transition];
      updates.stateHistory = stateHistory;
    }

    // Update job
    jobs[index] = {
      ...currentJob,
      ...updates,
      updatedAt: new Date(),
    };

    // Validate updated job
    const validation = JobStateMachine.validateJobState(jobs[index]);
    if (validation.warnings.length > 0) {
      console.warn('Job validation warnings:', validation.warnings);
    }

    StorageService.set(KEYS.JOBS, jobs);
    console.log('✅ Job updated:', id, '→', jobs[index].status);

    return jobs[index];
  }

  deleteJob(id: string) {
    const jobs = this.getAllJobs();
    const filtered = jobs.filter(j => j.id !== id);
    StorageService.set(KEYS.JOBS, filtered);
  }

  // ============================================
  // BID OPERATIONS
  // ============================================

  getAllBids() {
    return StorageService.get<any[]>(KEYS.BIDS) || [];
  }

  getBidsByJob(jobId: string) {
    const bids = this.getAllBids();
    return bids.filter(b => b.jobId === jobId);
  }

  getBidsByPlumber(plumberId: string) {
    const bids = this.getAllBids();
    return bids.filter(b => b.plumberId === plumberId);
  }

  addBid(bid: any) {
    const bids = this.getAllBids();

    // Check if plumber already bid on this job
    const existingBid = bids.find(
      b => b.jobId === bid.jobId && b.plumberId === bid.plumberId
    );

    if (existingBid) {
      toast.error('Vous avez déjà soumis une offre pour ce travail');
      return null;
    }

    const newBid = {
      ...bid,
      id: bid.id || this.generateId(),
      submittedAt: bid.submittedAt || new Date(),
    };

    bids.push(newBid);
    StorageService.set(KEYS.BIDS, bids);

    console.log('✅ Bid added:', newBid.id);
    return newBid;
  }

  // ============================================
  // PAYMENT OPERATIONS
  // ============================================

  getAllPayments() {
    return StorageService.get<any[]>(KEYS.PAYMENTS) || [];
  }

  getPayment(id: string) {
    const payments = this.getAllPayments();
    return payments.find(p => p.id === id);
  }

  getPaymentByJobId(jobId: string) {
    const payments = this.getAllPayments();
    return payments.find(p => p.jobId === jobId);
  }

  getPaymentsByPlumber(plumberId: string) {
    const payments = this.getAllPayments();
    return payments.filter(p => p.plumberId === plumberId);
  }

  getHeldPayments(plumberId: string) {
    const payments = this.getAllPayments();
    return payments.filter(p => p.plumberId === plumberId && p.status === 'held');
  }

  addPayment(payment: any) {
    const payments = this.getAllPayments();
    payments.push({
      ...payment,
      id: payment.id || this.generateId(),
      createdAt: payment.createdAt || new Date(),
    });
    StorageService.set(KEYS.PAYMENTS, payments);
    return payment;
  }

  updatePayment(id: string, updates: any) {
    const payments = this.getAllPayments();
    const index = payments.findIndex(p => p.id === id);
    if (index !== -1) {
      payments[index] = { ...payments[index], ...updates, updatedAt: new Date() };
      StorageService.set(KEYS.PAYMENTS, payments);
      return payments[index];
    }
    return null;
  }

  // ============================================
  // COMPLIANCE DOCUMENTS
  // ============================================

  getComplianceDocuments(plumberId: string) {
    const docs = StorageService.get<any[]>(KEYS.COMPLIANCE_DOCS) || [];
    return docs.filter(d => d.plumberId === plumberId);
  }

  addComplianceDocument(doc: any) {
    const docs = StorageService.get<any[]>(KEYS.COMPLIANCE_DOCS) || [];
    docs.push({
      ...doc,
      id: doc.id || this.generateId(),
      uploadedAt: doc.uploadedAt || new Date(),
    });
    StorageService.set(KEYS.COMPLIANCE_DOCS, docs);
    return doc;
  }

  // ============================================
  // AFTER-SALES CLAIMS
  // ============================================

  getAllClaims() {
    return StorageService.get<any[]>(KEYS.AFTERSALES_CLAIMS) || [];
  }

  getClaim(id: string) {
    const claims = this.getAllClaims();
    return claims.find(c => c.id === id);
  }

  getClaimsByJobId(jobId: string) {
    const claims = this.getAllClaims();
    return claims.filter(c => c.jobId === jobId);
  }

  getClaimsByPlumber(plumberId: string) {
    const claims = this.getAllClaims();
    return claims.filter(c => c.plumberId === plumberId);
  }

  addClaim(claim: any) {
    const claims = this.getAllClaims();
    claims.push({
      ...claim,
      id: claim.id || this.generateId(),
      submittedAt: claim.submittedAt || new Date(),
    });
    StorageService.set(KEYS.AFTERSALES_CLAIMS, claims);
    return claim;
  }

  updateClaim(id: string, updates: any) {
    const claims = this.getAllClaims();
    const index = claims.findIndex(c => c.id === id);
    if (index !== -1) {
      claims[index] = { ...claims[index], ...updates, updatedAt: new Date() };
      StorageService.set(KEYS.AFTERSALES_CLAIMS, claims);
      return claims[index];
    }
    return null;
  }

  // ============================================
  // RATINGS
  // ============================================

  getAllRatings() {
    return StorageService.get<any[]>(KEYS.RATINGS) || [];
  }

  getRatingsByPlumber(plumberId: string) {
    const ratings = this.getAllRatings();
    return ratings.filter(r => r.plumberId === plumberId);
  }

  getRatingByJob(jobId: string) {
    const ratings = this.getAllRatings();
    return ratings.find(r => r.jobId === jobId);
  }

  addRating(rating: any) {
    const ratings = this.getAllRatings();
    ratings.push({
      ...rating,
      id: rating.id || this.generateId(),
      createdAt: rating.createdAt || new Date(),
    });
    StorageService.set(KEYS.RATINGS, ratings);

    // Update plumber average rating
    this.updatePlumberRating(rating.plumberId);

    return rating;
  }

  updatePlumberRating(plumberId: string) {
    const ratings = this.getRatingsByPlumber(plumberId);
    if (ratings.length === 0) return;

    const sum = ratings.reduce((acc, r) => acc + r.stars, 0);
    const average = sum / ratings.length;

    const distribution: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(r => {
      distribution[r.stars]++;
    });

    this.updatePlumber(plumberId, {
      rating: {
        average: Math.round(average * 10) / 10,
        count: ratings.length,
        distribution,
      },
    });
  }

  // ============================================
  // NOTIFICATIONS & ALERTS
  // ============================================

  addNotification(notification: any) {
    const notifications = StorageService.get<any[]>(KEYS.NOTIFICATIONS) || [];
    notifications.push({
      ...notification,
      id: notification.id || this.generateId(),
      createdAt: notification.createdAt || new Date(),
      read: false,
    });
    StorageService.set(KEYS.NOTIFICATIONS, notifications);
  }

  addInternalAlert(alert: any) {
    const alerts = StorageService.get<any[]>(KEYS.INTERNAL_ALERTS) || [];
    alerts.push({
      ...alert,
      id: alert.id || this.generateId(),
      createdAt: alert.createdAt || new Date(),
      resolved: false,
    });
    StorageService.set(KEYS.INTERNAL_ALERTS, alerts);
  }

  addCreditNote(creditNote: any) {
    const creditNotes = StorageService.get<any[]>(KEYS.CREDIT_NOTES) || [];
    creditNotes.push({
      ...creditNote,
      id: creditNote.id || this.generateId(),
      issuedAt: creditNote.issuedAt || new Date(),
    });
    StorageService.set(KEYS.CREDIT_NOTES, creditNotes);
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Generate job ID
   */
  private generateJobId(): string {
    return `JOB-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  /**
   * Get storage info
   */
  getStorageInfo() {
    return {
      size: StorageService.getSizeFormatted(),
      keys: StorageService.getAllKeys(),
      lastReset: StorageService.get(KEYS.LAST_RESET),
    };
  }
}

// Export singleton instance
export const mockDataService = MockDataService.getInstance();
