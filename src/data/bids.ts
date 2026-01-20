/**
 * Client Bidding System Data
 * Reverse auction where clients post jobs and contractors bid
 */

import { DivisionType } from '../types/user';

export interface BidProject {
  id: string;
  clientId: string;
  clientName: string;
  address: string;
  division: DivisionType;
  serviceType: string;
  description: string;
  budgetMin?: number;
  budgetMax?: number;
  timeline: 'emergency' | 'urgent' | 'flexible';
  photos?: string[];
  heatLossRating?: number;
  estimatedArea?: number;
  status: 'open' | 'closed' | 'awarded' | 'cancelled';
  postedDate: string;
  deadline: string;
  bidCount: number;
  bids: Bid[];
  winnerId?: string;
}

export interface Bid {
  id: string;
  projectId: string;
  contractorId: string;
  contractorName: string;
  contractorRating: number;
  contractorReviews: number;
  bidAmount: number;
  scopeOfWork: string[];
  timeline: {
    startDate: string;
    duration: number; // days
  };
  warranty: {
    labor: number; // years
    material: number; // years
  };
  paymentTerms: string;
  addOns?: BidAddOn[];
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  submittedDate: string;
}

export interface BidAddOn {
  name: string;
  description: string;
  price: number;
  recommended: boolean;
}

export interface ContractorBidStats {
  contractorId: string;
  contractorName: string;
  totalBids: number;
  bidsWon: number;
  winRate: number; // percentage
  averageBidAmount: number;
  averageWinningBid: number;
  revenue: number;
  insights: string[];
}

// Sample bid projects
export const BID_PROJECTS: BidProject[] = [
  {
    id: 'bid-001',
    clientId: 'client-001',
    clientName: 'Marie Leclerc',
    address: '2279 ch. des Patriotes, Richelieu, QC',
    division: 'toitures',
    serviceType: 'Remplacement de toiture',
    description: 'Need asphalt shingle roof replacement, approximately 2,000 sq ft, moderate slope. Noticed ice dams last winter, might need insulation upgrade too.',
    budgetMin: 8000,
    budgetMax: 10000,
    timeline: 'flexible',
    heatLossRating: 8,
    estimatedArea: 2000,
    status: 'open',
    postedDate: '2026-01-16T09:00:00Z',
    deadline: '2026-01-18T15:00:00Z',
    bidCount: 4,
    bids: [
      {
        id: 'bid-001-1',
        projectId: 'bid-001',
        contractorId: 'tech-005',
        contractorName: 'Toitures Jonathan Isabel',
        contractorRating: 4.9,
        contractorReviews: 127,
        bidAmount: 9200,
        scopeOfWork: [
          'Complete tear-off of existing shingles',
          'Inspect roof deck, replace damaged boards',
          'Install synthetic underlayment',
          'Install 30-year architectural shingles',
          'Replace drip edge and valley flashing',
          'Install new ridge ventilation',
          'Cleanup and disposal included',
          'FREE thermal inspection ($150 value)'
        ],
        timeline: {
          startDate: '2026-01-25',
          duration: 3
        },
        warranty: {
          labor: 5,
          material: 30
        },
        paymentTerms: '10% deposit, balance on completion',
        addOns: [
          {
            name: 'Attic Insulation Upgrade',
            description: 'Add R60 blown fiberglass to prevent future ice dams',
            price: 2500,
            recommended: true
          },
          {
            name: 'Gutter Replacement',
            description: 'Replace aging gutters with seamless aluminum',
            price: 1800,
            recommended: false
          }
        ],
        notes: 'Based on thermal image, I recommend attic insulation upgrade to prevent future ice dams. Happy to provide combined package at 15% discount.',
        status: 'pending',
        submittedDate: '2026-01-16T12:30:00Z'
      },
      {
        id: 'bid-001-2',
        projectId: 'bid-001',
        contractorId: 'contractor-002',
        contractorName: 'ABC Toitures',
        contractorRating: 4.2,
        contractorReviews: 34,
        bidAmount: 7800,
        scopeOfWork: [
          'Basic tear-off and re-shingle',
          '25-year architectural shingles',
          'Standard ventilation',
          'Cleanup included'
        ],
        timeline: {
          startDate: '2026-02-05',
          duration: 4
        },
        warranty: {
          labor: 2,
          material: 25
        },
        paymentTerms: '10% deposit, balance on completion',
        status: 'pending',
        submittedDate: '2026-01-16T14:15:00Z'
      },
      {
        id: 'bid-001-3',
        projectId: 'bid-001',
        contractorId: 'contractor-003',
        contractorName: 'Pro Toiture Elite',
        contractorRating: 4.7,
        contractorReviews: 89,
        bidAmount: 9500,
        scopeOfWork: [
          'Complete tear-off',
          '50-year premium shingles',
          'Ice and water shield in valleys',
          'Premium ridge ventilation',
          'Extended warranty',
          'Cleanup and disposal'
        ],
        timeline: {
          startDate: '2026-01-28',
          duration: 3
        },
        warranty: {
          labor: 10,
          material: 50
        },
        paymentTerms: '10% deposit, balance on completion',
        status: 'pending',
        submittedDate: '2026-01-16T16:45:00Z'
      },
      {
        id: 'bid-001-4',
        projectId: 'bid-001',
        contractorId: 'contractor-004',
        contractorName: 'Toitures Qualité Plus',
        contractorRating: 4.5,
        contractorReviews: 62,
        bidAmount: 8900,
        scopeOfWork: [
          'Complete tear-off',
          '30-year architectural shingles',
          'Synthetic underlayment',
          'New flashing and drip edge',
          'Ridge ventilation',
          'Cleanup included'
        ],
        timeline: {
          startDate: '2026-02-01',
          duration: 3
        },
        warranty: {
          labor: 5,
          material: 30
        },
        paymentTerms: '10% deposit, balance on completion',
        status: 'pending',
        submittedDate: '2026-01-17T10:20:00Z'
      }
    ]
  },
  {
    id: 'bid-002',
    clientId: 'client-002',
    clientName: 'Jean Tremblay',
    address: '456 rue St-Jean, Longueuil, QC',
    division: 'isolation',
    serviceType: 'Isolation du grenier',
    description: 'Attic insulation upgrade. House is cold in winter, high heating bills. Looking for R60 insulation with grant application help.',
    budgetMin: 3000,
    budgetMax: 5000,
    timeline: 'urgent',
    heatLossRating: 7,
    estimatedArea: 1200,
    status: 'open',
    postedDate: '2026-01-15T14:00:00Z',
    deadline: '2026-01-17T17:00:00Z',
    bidCount: 3,
    bids: [
      {
        id: 'bid-002-1',
        projectId: 'bid-002',
        contractorId: 'contractor-005',
        contractorName: 'Isolation Mike Turmel',
        contractorRating: 4.8,
        contractorReviews: 156,
        bidAmount: 4200,
        scopeOfWork: [
          'R60 blown fiberglass insulation',
          'Complete attic coverage (1,200 sq ft)',
          'Air sealing package',
          'Ventilation baffles',
          'FREE energy audit ($300 value)',
          'Grant application assistance included'
        ],
        timeline: {
          startDate: '2026-01-22',
          duration: 1
        },
        warranty: {
          labor: 5,
          material: 25
        },
        paymentTerms: '10% deposit, balance on completion',
        addOns: [
          {
            name: 'Post-Installation Thermal Verification',
            description: 'Thermal scan to verify insulation effectiveness',
            price: 150,
            recommended: true
          }
        ],
        notes: 'Grant eligible: Up to $5,600 Canada Greener Homes. We handle all paperwork. Typical payback 3-4 years.',
        status: 'pending',
        submittedDate: '2026-01-15T16:30:00Z'
      },
      {
        id: 'bid-002-2',
        projectId: 'bid-002',
        contractorId: 'contractor-006',
        contractorName: 'Éco Isolation Pro',
        contractorRating: 4.4,
        contractorReviews: 73,
        bidAmount: 3800,
        scopeOfWork: [
          'R50 cellulose insulation',
          'Attic coverage',
          'Basic air sealing',
          'Cleanup included'
        ],
        timeline: {
          startDate: '2026-01-20',
          duration: 1
        },
        warranty: {
          labor: 3,
          material: 20
        },
        paymentTerms: '10% deposit, balance on completion',
        status: 'pending',
        submittedDate: '2026-01-15T18:00:00Z'
      },
      {
        id: 'bid-002-3',
        projectId: 'bid-002',
        contractorId: 'contractor-007',
        contractorName: 'IsolaMax Solutions',
        contractorRating: 4.6,
        contractorReviews: 91,
        bidAmount: 4500,
        scopeOfWork: [
          'R60 spray foam insulation',
          'Superior air sealing',
          'Attic coverage',
          'Energy audit included',
          'Grant application help'
        ],
        timeline: {
          startDate: '2026-01-24',
          duration: 1
        },
        warranty: {
          labor: 10,
          material: 50
        },
        paymentTerms: '10% deposit, balance on completion',
        status: 'pending',
        submittedDate: '2026-01-16T09:15:00Z'
      }
    ]
  }
];

// Sample contractor stats
export const CONTRACTOR_BID_STATS: ContractorBidStats[] = [
  {
    contractorId: 'tech-005',
    contractorName: 'Toitures Jonathan Isabel',
    totalBids: 28,
    bidsWon: 8,
    winRate: 29,
    averageBidAmount: 8750,
    averageWinningBid: 8200,
    revenue: 65600,
    insights: [
      'Your win rate improved 5% vs last month',
      "You're bidding 6% higher than average winners",
      'Try bidding $500-700 lower to improve win rate',
      'Your free thermal inspection add-on is popular'
    ]
  }
];

// Get open bid projects
export function getOpenBidProjects(): BidProject[] {
  return BID_PROJECTS.filter(project => project.status === 'open');
}

// Get bid projects by division
export function getBidProjectsByDivision(division: DivisionType): BidProject[] {
  return BID_PROJECTS.filter(project => project.division === division);
}

// Get contractor bids
export function getContractorBids(contractorId: string): Bid[] {
  const allBids: Bid[] = [];
  BID_PROJECTS.forEach(project => {
    project.bids.forEach(bid => {
      if (bid.contractorId === contractorId) {
        allBids.push(bid);
      }
    });
  });
  return allBids;
}

// Get bid project by ID
export function getBidProjectById(id: string): BidProject | undefined {
  return BID_PROJECTS.find(project => project.id === id);
}

// Calculate bid ranking
export function rankBids(bids: Bid[]): Bid[] {
  return [...bids].sort((a, b) => {
    // Score calculation: lower price + higher rating = higher score
    const scoreA = (1 / a.bidAmount) * 10000 + a.contractorRating * 100;
    const scoreB = (1 / b.bidAmount) * 10000 + b.contractorRating * 100;
    return scoreB - scoreA;
  });
}
