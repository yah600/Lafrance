export type JobStatus = 'pending' | 'assigned' | 'en-route' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
export type JobPriority = 'low' | 'normal' | 'high' | 'urgent';
export type ServiceType = 'debouchage' | 'chauffe-eau' | 'robinetterie' | 'urgence' | 'inspection' | 'installation';
export type TechnicianStatus = 'available' | 'busy' | 'en-route' | 'off-duty';
export type QuoteServiceType = 'depannage-reparation' | 'entretien' | 'renovation-construction' | 'installation';
export type QuoteClientType = 'residential' | 'commercial' | 'industriel';
export type QuoteStatus = 'new' | 'contacted' | 'quoted' | 'accepted' | 'rejected' | 'completed';
export type ClientRequestStatus = 'new' | 'reviewed' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
export type MessageType = 'email' | 'chat' | 'phone';
export type DivisionType = 'plomberie' | 'construction' | 'toitures' | 'isolation' | 'conteneurs' | 'gutters' | 'decks' | 'real-estate';

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  status: TechnicianStatus;
  division: DivisionType;
  currentJob?: string;
  todayJobs: number;
  completedJobs: number;
  rating: number;
  skills: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  type: 'residential' | 'commercial';
  totalSpent: number;
  lastService?: string;
  equipment: string[];
  // Clients can have services from multiple divisions
  divisions?: DivisionType[];
}

export interface Job {
  id: string;
  clientId: string;
  client: {
    name: string;
    address: string;
    phone: string;
  };
  technicianId?: string;
  technician?: {
    name: string;
    avatar?: string;
  };
  status: JobStatus;
  priority: JobPriority;
  serviceType: ServiceType;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  amount?: number;
  rating?: number;
  division: DivisionType;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  jobId: string;
  clientId: string;
  division: DivisionType;
  amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface QuoteSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceType: QuoteServiceType;
  clientType: QuoteClientType;
  description: string;
  status: QuoteStatus;
  division?: DivisionType;
  createdAt: string;
  contactedAt?: string;
  notes?: string;
}

export interface ClientRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: QuoteServiceType;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  preferredDate?: string;
  preferredTime?: string;
  address: string;
  status: ClientRequestStatus;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  assignedJobId?: string;
}

export interface ClientMessage {
  id: string;
  clientId: string;
  type: MessageType;
  subject?: string;
  content: string;
  from: 'client' | 'admin';
  read: boolean;
  createdAt: string;
}

export interface ClientPayment {
  id: string;
  clientId: string;
  invoiceId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'other';
  stripePaymentIntentId?: string;
  createdAt: string;
  completedAt?: string;
}