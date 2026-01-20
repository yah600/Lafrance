import type { Technician, Client, Job, Invoice, QuoteSubmission } from '../types';

export const mockTechnicians: Technician[] = [
  {
    id: '1',
    name: 'Marc Tremblay',
    phone: '+1 514-555-0101',
    email: 'marc.tremblay@plomberie.com',
    division: 'plomberie',
    status: 'busy',
    currentJob: '1',
    todayJobs: 5,
    completedJobs: 3,
    rating: 4.9,
    skills: ['Débouchage', 'Chauffe-eau', 'Urgences'],
    location: {
      lat: 45.5017,
      lng: -73.5673,
      address: '1234 Rue Sainte-Catherine, Montréal'
    }
  },
  {
    id: '2',
    name: 'Sophie Gagnon',
    phone: '+1 514-555-0102',
    email: 'sophie.gagnon@plomberie.com',
    division: 'plomberie',
    status: 'en-route',
    currentJob: '2',
    todayJobs: 4,
    completedJobs: 2,
    rating: 4.8,
    skills: ['Installation', 'Robinetterie', 'Inspection'],
    location: {
      lat: 45.5088,
      lng: -73.5878,
      address: '5678 Boulevard Saint-Laurent, Montréal'
    }
  },
  {
    id: '3',
    name: 'Jean-Pierre Dubois',
    phone: '+1 514-555-0103',
    email: 'jp.dubois@plomberie.com',
    division: 'plomberie',
    status: 'available',
    todayJobs: 3,
    completedJobs: 3,
    rating: 4.7,
    skills: ['Chauffe-eau', 'Installation', 'Réparations'],
    location: {
      lat: 45.4972,
      lng: -73.5793,
      address: '9012 Avenue du Parc, Montréal'
    }
  },
  {
    id: '4',
    name: 'Marie Bouchard',
    phone: '+1 514-555-0104',
    email: 'marie.bouchard@plomberie.com',
    division: 'plomberie',
    status: 'busy',
    currentJob: '3',
    todayJobs: 6,
    completedJobs: 4,
    rating: 5.0,
    skills: ['Urgences', 'Débouchage', 'Diagnostic'],
    location: {
      lat: 45.5276,
      lng: -73.5870,
      address: '3456 Rue Sherbrooke, Montréal'
    }
  },
  {
    id: '5',
    name: 'Jonathan Isabel',
    phone: '+1 514-555-0105',
    email: 'jonathan@toitures.com',
    division: 'toitures',
    status: 'available',
    todayJobs: 2,
    completedJobs: 2,
    rating: 4.9,
    skills: ['Toiture', 'Réparations', 'Installation'],
    location: {
      lat: 45.5147,
      lng: -73.6132,
      address: '7890 Avenue Monkland, Montréal'
    }
  },
  {
    id: '6',
    name: 'Mike Turmel',
    phone: '+1 514-555-0106',
    email: 'mike@isolation.com',
    division: 'isolation',
    status: 'busy',
    currentJob: '7',
    todayJobs: 3,
    completedJobs: 2,
    rating: 4.8,
    skills: ['Isolation', 'Ventilation', 'Efficacité énergétique'],
    location: {
      lat: 45.4689,
      lng: -73.5753,
      address: '2345 Boulevard de Maisonneuve, Montréal'
    }
  }
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Restaurant Le Gourmet',
    phone: '+1 514-555-1001',
    email: 'info@legourmet.com',
    address: '100 Rue Notre-Dame O, Montréal, QC H2Y 1T1',
    type: 'commercial',
    totalSpent: 8950,
    lastService: '2025-12-10',
    equipment: ['Commercial Kitchen Drains', 'Water Heater 80gal', 'Grease Trap']
  },
  {
    id: '2',
    name: 'Jean Dupont',
    phone: '+1 514-555-1002',
    email: 'j.dupont@email.com',
    address: '245 Avenue du Mont-Royal E, Montréal, QC H2T 1P4',
    type: 'residential',
    totalSpent: 2340,
    lastService: '2025-11-28',
    equipment: ['Water Heater 40gal', 'Kitchen Sink']
  },
  {
    id: '3',
    name: 'Marie-Claire Bergeron',
    phone: '+1 514-555-1003',
    email: 'mc.bergeron@email.com',
    address: '890 Rue Sherbrooke O, Montréal, QC H3A 1G1',
    type: 'residential',
    totalSpent: 4520,
    lastService: '2025-12-14',
    equipment: ['Water Heater 50gal', 'Bathroom Fixtures', 'Main Line']
  },
  {
    id: '4',
    name: 'Hôtel du Vieux-Port',
    phone: '+1 514-555-1004',
    email: 'maintenance@hotelvp.com',
    address: '97 Rue de la Commune E, Montréal, QC H2Y 1J1',
    type: 'commercial',
    totalSpent: 15680,
    lastService: '2025-12-15',
    equipment: ['Central Water System', 'Multiple Water Heaters', 'Commercial Fixtures']
  },
  {
    id: '5',
    name: 'Pierre Lavoie',
    phone: '+1 514-555-1005',
    email: 'p.lavoie@email.com',
    address: '456 Boulevard René-Lévesque O, Montréal, QC H2Z 1A7',
    type: 'residential',
    totalSpent: 1890,
    equipment: ['Water Heater 40gal']
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    clientId: '1',
    client: {
      name: 'Restaurant Le Gourmet',
      address: '100 Rue Notre-Dame O, Montréal',
      phone: '+1 514-555-1001'
    },
    technicianId: '1',
    technician: {
      name: 'Marc Tremblay'
    },
    division: 'plomberie',
    status: 'in-progress',
    priority: 'urgent',
    serviceType: 'urgence',
    description: 'Débouchage urgent - cuisine commerciale',
    scheduledDate: '2025-12-16',
    scheduledTime: '08:00',
    duration: 120,
    amount: 450,
    location: {
      lat: 45.5016,
      lng: -73.5553
    },
    createdAt: '2025-12-16T06:30:00Z',
    updatedAt: '2025-12-16T08:00:00Z'
  },
  {
    id: '2',
    clientId: '2',
    client: {
      name: 'Jean Dupont',
      address: '245 Avenue du Mont-Royal E, Montréal',
      phone: '+1 514-555-1002'
    },
    technicianId: '2',
    technician: {
      name: 'Sophie Gagnon'
    },
    division: 'plomberie',
    status: 'en-route',
    priority: 'normal',
    serviceType: 'chauffe-eau',
    description: 'Remplacement chauffe-eau résidentiel',
    scheduledDate: '2025-12-16',
    scheduledTime: '10:00',
    duration: 180,
    amount: 1200,
    location: {
      lat: 45.5225,
      lng: -73.5800
    },
    createdAt: '2025-12-15T14:00:00Z',
    updatedAt: '2025-12-16T09:30:00Z'
  },
  {
    id: '3',
    clientId: '3',
    client: {
      name: 'Marie-Claire Bergeron',
      address: '890 Rue Sherbrooke O, Montréal',
      phone: '+1 514-555-1003'
    },
    technicianId: '4',
    technician: {
      name: 'Marie Bouchard'
    },
    division: 'plomberie',
    status: 'in-progress',
    priority: 'high',
    serviceType: 'robinetterie',
    description: 'Réparation robinet cuisine - fuite importante',
    scheduledDate: '2025-12-16',
    scheduledTime: '09:00',
    duration: 90,
    amount: 280,
    location: {
      lat: 45.5076,
      lng: -73.5735
    },
    createdAt: '2025-12-16T07:00:00Z',
    updatedAt: '2025-12-16T09:00:00Z'
  },
  {
    id: '4',
    clientId: '4',
    client: {
      name: 'Hôtel du Vieux-Port',
      address: '97 Rue de la Commune E, Montréal',
      phone: '+1 514-555-1004'
    },
    division: 'plomberie',
    status: 'assigned',
    priority: 'normal',
    serviceType: 'inspection',
    description: 'Inspection mensuelle - système central',
    scheduledDate: '2025-12-16',
    scheduledTime: '14:00',
    duration: 120,
    location: {
      lat: 45.5086,
      lng: -73.5526
    },
    createdAt: '2025-12-15T16:00:00Z',
    updatedAt: '2025-12-16T08:00:00Z'
  },
  {
    id: '5',
    clientId: '5',
    client: {
      name: 'Pierre Lavoie',
      address: '456 Boulevard René-Lévesque O, Montréal',
      phone: '+1 514-555-1005'
    },
    division: 'plomberie',
    status: 'pending',
    priority: 'normal',
    serviceType: 'debouchage',
    description: 'Débouchage toilette principale',
    scheduledDate: '2025-12-17',
    scheduledTime: '09:00',
    duration: 60,
    location: {
      lat: 45.5050,
      lng: -73.5680
    },
    createdAt: '2025-12-16T09:15:00Z',
    updatedAt: '2025-12-16T09:15:00Z'
  },
  {
    id: '6',
    clientId: '2',
    client: {
      name: 'Jean Dupont',
      address: '245 Avenue du Mont-Royal E, Montréal',
      phone: '+1 514-555-1002'
    },
    technicianId: '1',
    technician: {
      name: 'Marc Tremblay'
    },
    division: 'plomberie',
    status: 'completed',
    priority: 'low',
    serviceType: 'inspection',
    description: 'Inspection préventive annuelle',
    scheduledDate: '2025-12-15',
    scheduledTime: '14:00',
    duration: 60,
    amount: 150,
    rating: 5,
    location: {
      lat: 45.5225,
      lng: -73.5800
    },
    createdAt: '2025-12-14T10:00:00Z',
    updatedAt: '2025-12-15T15:30:00Z'
  },
  // Toitures division jobs
  {
    id: '7',
    clientId: '3',
    client: {
      name: 'Marie-Claire Bergeron',
      address: '890 Rue Sherbrooke O, Montréal',
      phone: '+1 514-555-1003'
    },
    technicianId: '5',
    technician: {
      name: 'Jonathan Isabel'
    },
    division: 'toitures',
    status: 'assigned',
    priority: 'normal',
    serviceType: 'inspection',
    description: 'Inspection de toiture après tempête',
    scheduledDate: '2025-12-17',
    scheduledTime: '09:00',
    duration: 120,
    amount: 350,
    location: {
      lat: 45.5076,
      lng: -73.5735
    },
    createdAt: '2025-12-16T10:00:00Z',
    updatedAt: '2025-12-16T10:00:00Z'
  },
  // Isolation division jobs
  {
    id: '8',
    clientId: '2',
    client: {
      name: 'Jean Dupont',
      address: '245 Avenue du Mont-Royal E, Montréal',
      phone: '+1 514-555-1002'
    },
    technicianId: '6',
    technician: {
      name: 'Mike Turmel'
    },
    division: 'isolation',
    status: 'in-progress',
    priority: 'normal',
    serviceType: 'installation',
    description: 'Isolation de grenier - cellulose soufflée R-50',
    scheduledDate: '2025-12-16',
    scheduledTime: '08:30',
    duration: 240,
    amount: 1800,
    location: {
      lat: 45.5225,
      lng: -73.5800
    },
    createdAt: '2025-12-15T14:30:00Z',
    updatedAt: '2025-12-16T08:30:00Z'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-2025-001',
    jobId: '6',
    clientId: '2',
    division: 'plomberie',
    amount: 172.49,
    status: 'paid',
    dueDate: '2025-12-30',
    paidDate: '2025-12-15',
    items: [
      {
        description: 'Inspection préventive annuelle',
        quantity: 1,
        unitPrice: 150,
        amount: 150
      }
    ],
    subtotal: 150,
    tax: 22.49,
    total: 172.49
  },
  {
    id: 'INV-2025-002',
    jobId: '1',
    clientId: '1',
    division: 'plomberie',
    amount: 517.49,
    status: 'sent',
    dueDate: '2025-12-30',
    items: [
      {
        description: 'Débouchage urgent - cuisine commerciale',
        quantity: 1,
        unitPrice: 450,
        amount: 450
      }
    ],
    subtotal: 450,
    tax: 67.49,
    total: 517.49
  },
  {
    id: 'INV-2025-003',
    jobId: '8',
    clientId: '2',
    division: 'isolation',
    amount: 2069.99,
    status: 'draft',
    dueDate: '2025-12-31',
    items: [
      {
        description: 'Isolation de grenier - cellulose soufflée R-50',
        quantity: 1,
        unitPrice: 1800,
        amount: 1800
      }
    ],
    subtotal: 1800,
    tax: 269.99,
    total: 2069.99
  }
];

export const mockQuoteSubmissions: QuoteSubmission[] = [
  {
    id: 'quote-001',
    name: 'François Dubois',
    phone: '+1 514-555-2001',
    email: 'f.dubois@email.com',
    serviceType: 'depannage-reparation',
    clientType: 'residential',
    description: 'Fuite au sous-sol, besoin urgent de réparation',
    status: 'new',
    createdAt: '2025-12-16T10:30:00Z'
  },
  {
    id: 'quote-002',
    name: 'Café Boulevard',
    phone: '+1 514-555-2002',
    email: 'contact@cafeboulevard.com',
    serviceType: 'entretien',
    clientType: 'commercial',
    description: 'Contrat d\'entretien mensuel pour notre café',
    status: 'contacted',
    createdAt: '2025-12-15T14:20:00Z',
    contactedAt: '2025-12-15T16:00:00Z',
    notes: 'Envoyé soumission par email'
  },
  {
    id: 'quote-003',
    name: 'Usine Laval Inc.',
    phone: '+1 450-555-2003',
    email: 'maintenance@usinelaval.com',
    serviceType: 'renovation-construction',
    clientType: 'industriel',
    description: 'Rénovation complète du système de plomberie - 3 étages',
    status: 'quoted',
    createdAt: '2025-12-14T09:00:00Z',
    contactedAt: '2025-12-14T11:30:00Z',
    notes: 'Soumission de 45 000$ envoyée. En attente de réponse.'
  },
  {
    id: 'quote-004',
    name: 'Sylvie Martin',
    phone: '+1 514-555-2004',
    email: 's.martin@email.com',
    serviceType: 'installation',
    clientType: 'residential',
    description: 'Installation nouveau chauffe-eau 50 gallons',
    status: 'new',
    createdAt: '2025-12-16T08:15:00Z'
  }
];