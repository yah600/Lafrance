/**
 * Bidding System Types for GROUPE LAFRANCE APP
 *
 * BET System (Bidding Et Triage)
 * - Urgent jobs: 5 minutes bidding window
 * - Normal jobs: 2 hours bidding window
 * - Quote requests: TBD
 */

export enum BidStatus {
  PENDING = 'pending', // Waiting for bids
  ACTIVE = 'active', // Currently accepting bids
  AWARDED = 'awarded', // Bid winner selected
  CANCELLED = 'cancelled', // Job cancelled
  EXPIRED = 'expired', // No bids received
}

export enum JobUrgency {
  URGENT = 'urgent', // Must arrive within 1 hour
  NORMAL = 'normal', // Scheduled with time slots
  QUOTE = 'quote', // Quote request (future implementation)
}

export interface BiddingJob {
  id: string;
  clientId: string;
  title: string;
  description: string; // AI-reformulated description
  originalDescription: string; // Client's original text
  photos: string[]; // Photo URLs

  // Job details
  urgency: JobUrgency;
  serviceType: string;
  estimatedDuration: number; // minutes
  suggestedPrice: number; // Platform's suggested price

  // Location
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  serviceRadius: number; // km - who can see this job

  // Timing
  createdAt: Date;
  biddingStartTime: Date;
  biddingEndTime: Date;
  preferredTimeSlots: TimeSlot[];

  // Status
  status: BidStatus;
  winnerId: string | null; // Winning plumber ID
  winningBid: Bid | null;

  // Client requirements
  languagePreference: Language[];
  requiresInsurance: boolean;
  requiresRBQ: boolean;

  // Payment
  depositAmount: number; // Pre-authorized amount
  depositStatus: 'pending' | 'authorized' | 'captured' | 'failed';
}

export interface TimeSlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  available: boolean;
}

export enum Language {
  FRENCH = 'fr',
  ENGLISH = 'en',
  SPANISH = 'es',
}

export interface Bid {
  id: string;
  jobId: string;
  plumberId: string;
  plumberName: string;
  plumberRating: number;
  plumberPhoto: string | null;

  // Bid details
  bidAmount: number;
  estimatedDuration: number; // minutes
  selectedTimeSlot: TimeSlot;
  message: string; // Optional message to client

  // Status
  status: 'submitted' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: Date;
  respondedAt: Date | null;

  // Plumber info
  distanceFromJob: number; // km
  eta: number; // minutes for urgent jobs
  languagesSpoken: Language[];
  hasRBQ: boolean;
  hasInsurance: boolean;
}

export interface BiddingNotification {
  id: string;
  plumberId: string;
  jobId: string;
  type: 'new_job' | 'bid_won' | 'bid_lost' | 'job_cancelled';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;

  // Sound notification
  playSound: boolean;
  soundType: 'urgent' | 'normal';
}

export interface BiddingPreferences {
  plumberId: string;

  // Availability
  acceptUrgentJobs: boolean;
  workingHours: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  workingDays: number[]; // 0-6 (Sunday-Saturday)

  // Service area
  serviceRadius: number; // km from plumber's location
  maxServiceRadius: number; // maximum willing to travel

  // Job preferences
  minJobValue: number;
  maxJobValue: number;
  preferredServiceTypes: string[];
  languagesSpoken: Language[];

  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  soundAlerts: boolean;
}

export interface BiddingAnalytics {
  plumberId: string;

  // Win rate
  totalBids: number;
  bidsWon: number;
  bidsLost: number;
  winRate: number;

  // Response time
  averageResponseTime: number; // seconds
  fastestResponse: number;
  slowestResponse: number;

  // Revenue
  totalRevenue: number;
  averageBidAmount: number;
  highestBid: number;
  lowestBid: number;

  // Jobs completed
  jobsCompleted: number;
  jobsCancelled: number;
  averageRating: number;
}

// Bidding rules and constraints
export const BIDDING_RULES = {
  URGENT_JOB: {
    biddingWindowMinutes: 5,
    maxServiceRadius: 50, // km
    requiredETA: 60, // Must arrive within 60 minutes
    autoExpireIfNoBids: true,
  },
  NORMAL_JOB: {
    biddingWindowMinutes: 120, // 2 hours
    maxServiceRadius: 100, // km
    requiredETA: null,
    autoExpireIfNoBids: true,
  },
  QUOTE_JOB: {
    biddingWindowMinutes: 1440, // 24 hours (TBD)
    maxServiceRadius: 100,
    requiredETA: null,
    autoExpireIfNoBids: false,
  },
  PENALTIES: {
    noShowPenalty: 100, // $CAD
    cancelAfterAccept: 50, // $CAD
    lateArrivalMinutes: 15, // Grace period
    lateArrivalPenalty: 25, // $CAD
  },
};

export interface BidderLocation {
  plumberId: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  lastUpdated: Date;
  isOnline: boolean;
  isAvailable: boolean;
}
