import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Job, Technician, Client, Invoice, QuoteSubmission } from '../types';
import { DivisionType } from '../types/user';
import { useAuth } from './AuthContext';

interface AppContextType {
  jobs: Job[];
  technicians: Technician[];
  clients: Client[];
  invoices: Invoice[];
  quoteSubmissions: QuoteSubmission[];
  // Division-filtered data
  divisionJobs: Job[];
  divisionTechnicians: Technician[];
  divisionInvoices: Invoice[];
  addJob: (job: Omit<Job, 'id'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addTechnician: (tech: Omit<Technician, 'id'>) => void;
  updateTechnician: (id: string, updates: Partial<Technician>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  addQuoteSubmission: (quote: Omit<QuoteSubmission, 'id' | 'createdAt' | 'status'>) => void;
  updateQuoteSubmission: (id: string, updates: Partial<QuoteSubmission>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const auth = useAuth(); // Must be called unconditionally at top level
  const activeDivision = auth?.activeDivision || null;
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quoteSubmissions, setQuoteSubmissions] = useState<QuoteSubmission[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Division-filtered data - safely handle null activeDivision
  const divisionJobs = activeDivision 
    ? jobs.filter(job => job.division === activeDivision)
    : jobs;
  
  const divisionTechnicians = activeDivision
    ? technicians.filter(tech => tech.division === activeDivision)
    : technicians;
  
  const divisionInvoices = activeDivision
    ? invoices.filter(inv => inv.division === activeDivision)
    : invoices;

  // Initialize data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const mockData = await import('../data/mockData');
        setJobs(mockData.mockJobs || []);
        setTechnicians(mockData.mockTechnicians || []);
        setClients(mockData.mockClients || []);
        setInvoices(mockData.mockInvoices || []);
        
        // Load quote submissions from localStorage and merge with mock data
        const localQuotes = JSON.parse(localStorage.getItem('quoteSubmissions') || '[]');
        const allQuotes = [...(mockData.mockQuoteSubmissions || []), ...localQuotes];
        setQuoteSubmissions(allQuotes);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading mock data:', error);
        setIsInitialized(true); // Still mark as initialized to prevent infinite loading
      }
    };
    
    loadData();
  }, []);

  const addJob = (job: Omit<Job, 'id'>) => {
    try {
      const newJob: Job = {
        ...job,
        id: `job-${Date.now()}`,
      } as Job;
      setJobs(prev => [...prev, newJob]);
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    try {
      setJobs(prev => prev.map(job => job.id === id ? { ...job, ...updates } : job));
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const deleteJob = (id: string) => {
    try {
      setJobs(prev => prev.filter(job => job.id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    try {
      const newClient: Client = {
        ...client,
        id: `client-${Date.now()}`,
      } as Client;
      setClients(prev => [...prev, newClient]);
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    try {
      setClients(prev => prev.map(client => client.id === id ? { ...client, ...updates } : client));
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const addTechnician = (tech: Omit<Technician, 'id'>) => {
    try {
      const newTech: Technician = {
        ...tech,
        id: `tech-${Date.now()}`,
      } as Technician;
      setTechnicians(prev => [...prev, newTech]);
    } catch (error) {
      console.error('Error adding technician:', error);
    }
  };

  const updateTechnician = (id: string, updates: Partial<Technician>) => {
    try {
      setTechnicians(prev => prev.map(tech => tech.id === id ? { ...tech, ...updates } : tech));
    } catch (error) {
      console.error('Error updating technician:', error);
    }
  };

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    try {
      const newInvoice: Invoice = {
        ...invoice,
        id: `INV-${Date.now()}`,
      } as Invoice;
      setInvoices(prev => [...prev, newInvoice]);
    } catch (error) {
      console.error('Error adding invoice:', error);
    }
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    try {
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const addQuoteSubmission = (quote: Omit<QuoteSubmission, 'id' | 'createdAt' | 'status'>) => {
    try {
      const newQuote: QuoteSubmission = {
        ...quote,
        id: `quote-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'new',
      };
      setQuoteSubmissions(prev => [...prev, newQuote]);
    } catch (error) {
      console.error('Error adding quote submission:', error);
    }
  };

  const updateQuoteSubmission = (id: string, updates: Partial<QuoteSubmission>) => {
    try {
      setQuoteSubmissions(prev => prev.map(qs => qs.id === id ? { ...qs, ...updates } : qs));
    } catch (error) {
      console.error('Error updating quote submission:', error);
    }
  };

  // Don't render children until initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        jobs,
        technicians,
        clients,
        invoices,
        quoteSubmissions,
        divisionJobs,
        divisionTechnicians,
        divisionInvoices,
        addJob,
        updateJob,
        deleteJob,
        addClient,
        updateClient,
        addTechnician,
        updateTechnician,
        addInvoice,
        updateInvoice,
        addQuoteSubmission,
        updateQuoteSubmission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}