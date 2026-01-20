/**
 * Job State Machine
 *
 * Manages job lifecycle state transitions according to bbb.md specification.
 * Enforces valid transitions and business rules.
 */

export type JobStatus =
  | 'pending_review'    // Client submitted, waiting admin review
  | 'in_bet'            // Active bidding phase
  | 'assigned'          // Winner selected, scheduled
  | 'en_route'          // Plumber traveling to job
  | 'in_progress'       // Work started (geofence + 3min dwell)
  | 'completed'         // Work finished, invoice generated
  | 'paid'              // Client paid invoice
  | 'closed'            // Rating submitted, fully closed
  | 'cancelled';        // Job cancelled

export interface StateTransition {
  from: JobStatus;
  to: JobStatus;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class JobStateMachine {
  /**
   * Valid state transitions
   */
  private static readonly TRANSITIONS: Record<JobStatus, JobStatus[]> = {
    'pending_review': ['in_bet', 'cancelled'],
    'in_bet': ['assigned', 'cancelled'],
    'assigned': ['en_route', 'cancelled'],
    'en_route': ['in_progress', 'cancelled'],
    'in_progress': ['completed', 'cancelled'],
    'completed': ['paid', 'cancelled'],
    'paid': ['closed'],
    'closed': [], // Terminal state
    'cancelled': [], // Terminal state
  };

  /**
   * Check if a transition is valid
   */
  static canTransition(from: JobStatus, to: JobStatus): boolean {
    const allowedTransitions = this.TRANSITIONS[from] || [];
    return allowedTransitions.includes(to);
  }

  /**
   * Perform a state transition
   */
  static transition(
    currentStatus: JobStatus,
    newStatus: JobStatus,
    metadata?: Record<string, any>
  ): {
    success: boolean;
    newStatus: JobStatus;
    transition: StateTransition | null;
    error?: string;
  } {
    // Check if transition is valid
    if (!this.canTransition(currentStatus, newStatus)) {
      return {
        success: false,
        newStatus: currentStatus,
        transition: null,
        error: `Invalid transition from ${currentStatus} to ${newStatus}`,
      };
    }

    // Create transition record
    const transition: StateTransition = {
      from: currentStatus,
      to: newStatus,
      timestamp: new Date(),
      metadata,
    };

    return {
      success: true,
      newStatus,
      transition,
    };
  }

  /**
   * Validate job state and business rules
   */
  static validateJobState(job: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields based on status
    switch (job.status) {
      case 'pending_review':
        if (!job.clientId) errors.push('Client ID is required');
        if (!job.description) errors.push('Description is required');
        if (!job.address) errors.push('Address is required');
        break;

      case 'in_bet':
        if (!job.biddingStartTime) errors.push('Bidding start time is required');
        if (!job.biddingEndTime) errors.push('Bidding end time is required');
        if (!job.urgency) errors.push('Urgency level is required');

        // Check if bidding time is valid
        const now = new Date().getTime();
        const endTime = new Date(job.biddingEndTime).getTime();
        if (endTime < now) {
          warnings.push('Bidding period has expired');
        }
        break;

      case 'assigned':
        if (!job.plumberId) errors.push('Plumber ID is required');
        if (!job.winnerId) errors.push('Winner ID is required');
        if (!job.winningBid) errors.push('Winning bid is required');
        break;

      case 'en_route':
        if (!job.plumberId) errors.push('Plumber ID is required');
        if (!job.estimatedArrival) warnings.push('Estimated arrival time not set');
        break;

      case 'in_progress':
        if (!job.startedAt) errors.push('Start time is required');
        if (!job.timerId) warnings.push('Timer not started');
        break;

      case 'completed':
        if (!job.completedAt) errors.push('Completion time is required');
        if (!job.invoiceId) errors.push('Invoice is required');
        if (!job.finalPhotos || job.finalPhotos.length < 2) {
          errors.push('At least 2 final photos are required');
        }
        if (!job.workDescription || job.workDescription.length < 50) {
          errors.push('Work description must be at least 50 characters');
        }
        break;

      case 'paid':
        if (!job.paymentId) errors.push('Payment ID is required');
        if (!job.paidAt) errors.push('Payment timestamp is required');
        break;

      case 'closed':
        if (!job.ratingId) warnings.push('Rating not submitted yet');
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get all possible next states
   */
  static getNextStates(currentStatus: JobStatus): JobStatus[] {
    return this.TRANSITIONS[currentStatus] || [];
  }

  /**
   * Check if state is terminal (no further transitions possible)
   */
  static isTerminalState(status: JobStatus): boolean {
    return this.TRANSITIONS[status]?.length === 0;
  }

  /**
   * Get state description
   */
  static getStateDescription(status: JobStatus): string {
    const descriptions: Record<JobStatus, string> = {
      'pending_review': 'En attente de révision administrative',
      'in_bet': 'Appel d\'offres en cours',
      'assigned': 'Assigné à un plombier',
      'en_route': 'Le plombier est en route',
      'in_progress': 'Travail en cours',
      'completed': 'Travail terminé',
      'paid': 'Facture payée',
      'closed': 'Travail clôturé',
      'cancelled': 'Travail annulé',
    };
    return descriptions[status] || status;
  }

  /**
   * Get state color for UI
   */
  static getStateColor(status: JobStatus): string {
    const colors: Record<JobStatus, string> = {
      'pending_review': 'yellow',
      'in_bet': 'blue',
      'assigned': 'purple',
      'en_route': 'indigo',
      'in_progress': 'teal',
      'completed': 'green',
      'paid': 'green',
      'closed': 'gray',
      'cancelled': 'red',
    };
    return colors[status] || 'gray';
  }

  /**
   * Enforce business rules for specific actions
   */
  static enforceBusinessRules(
    job: any,
    action: string,
    params?: any
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    switch (action) {
      case 'start_bidding':
        // Urgent jobs: 5 minutes bidding time
        // Normal jobs: 2 hours bidding time
        if (job.urgency === 'urgent') {
          const biddingDuration = 5 * 60 * 1000; // 5 minutes
          const expectedEndTime = new Date(job.biddingStartTime).getTime() + biddingDuration;
          const actualEndTime = new Date(job.biddingEndTime).getTime();

          if (Math.abs(actualEndTime - expectedEndTime) > 1000) {
            errors.push('Urgent jobs must have 5-minute bidding period');
          }
        } else {
          const biddingDuration = 2 * 60 * 60 * 1000; // 2 hours
          const expectedEndTime = new Date(job.biddingStartTime).getTime() + biddingDuration;
          const actualEndTime = new Date(job.biddingEndTime).getTime();

          if (Math.abs(actualEndTime - expectedEndTime) > 60000) {
            errors.push('Normal jobs must have 2-hour bidding period');
          }
        }
        break;

      case 'submit_bid':
        // Check if bidding is still open
        const now = Date.now();
        const endTime = new Date(job.biddingEndTime).getTime();
        if (now > endTime) {
          errors.push('Bidding period has ended');
        }

        // Check if plumber is within radius for urgent jobs
        if (job.urgency === 'urgent' && params?.plumberDistance) {
          if (params.plumberDistance > 50) {
            errors.push('Plumber must be within 50km for urgent jobs');
          }
        }
        break;

      case 'start_work':
        // Check geofence conditions (100m for 3 minutes)
        if (!params?.inGeofence) {
          errors.push('Must be within 100m geofence');
        }
        if (!params?.dwellTimeMet) {
          warnings.push('Must remain in geofence for 3 minutes');
        }
        break;

      case 'complete_work':
        // Check invoice margin (±20%)
        if (params?.invoiceAmount && params?.suggestedAmount) {
          const suggested = params.suggestedAmount;
          const actual = params.invoiceAmount;
          const diff = Math.abs(actual - suggested);
          const maxDiff = suggested * 0.20;

          if (diff > maxDiff) {
            errors.push('Invoice amount cannot differ by more than 20% from suggested amount');
          }
        }

        // Check photos and description
        if (!params?.finalPhotos || params.finalPhotos.length < 2) {
          errors.push('At least 2 final photos required');
        }
        if (!params?.description || params.description.length < 50) {
          errors.push('Description must be at least 50 characters');
        }
        break;

      case 'process_payment':
        // Check payment method for urgent jobs
        if (job.urgency === 'urgent' && params?.method !== 'credit_card') {
          warnings.push('Urgent jobs should use credit card for faster payment');
        }
        break;

      case 'release_payment':
        // Check if 30 days have passed
        if (params?.paidDate) {
          const daysSincePaid = (Date.now() - new Date(params.paidDate).getTime()) / (1000 * 60 * 60 * 24);
          if (daysSincePaid < 30) {
            errors.push('Cannot release held payment before 30 days');
          }
        }

        // Check for active after-sales claims
        if (params?.hasActiveClaims) {
          errors.push('Cannot release payment with active after-sales claims');
        }

        // Check compliance
        if (params?.isNonCompliant) {
          warnings.push('Plumber is non-compliant: 10% penalty will be applied');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get state history summary
   */
  static getStateHistory(transitions: StateTransition[]): string {
    return transitions
      .map(t => `${this.getStateDescription(t.from)} → ${this.getStateDescription(t.to)}`)
      .join('\n');
  }
}
