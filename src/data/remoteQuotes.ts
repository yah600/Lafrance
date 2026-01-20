/**
 * Remote Quoting System Data
 * 3D property modeling and instant quote generation
 */

import { DivisionType } from '../types/user';

export interface RemoteQuote {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  division: DivisionType;
  serviceType: string;
  buildingData: BuildingData;
  measurements: Measurements;
  pricing: QuotePricing;
  confidence: 'high' | 'medium' | 'low';
  confidenceScore: number; // 0-100
  status: 'draft' | 'generated' | 'accepted' | 'site-visit-requested';
  createdDate: string;
  clientId?: string;
}

export interface BuildingData {
  age: number;
  stories: number;
  roofType: 'gable' | 'hip' | 'flat' | 'complex';
  roofPitch: number; // degrees
  roofComplexity: number; // 1-5 scale
  materialType?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  accessLevel?: 'easy' | 'moderate' | 'difficult';
}

export interface Measurements {
  roofArea: number; // sq ft
  footprint: {
    length: number;
    width: number;
  };
  height: number; // feet
  complexityFactors: {
    valleys: number;
    hips: number;
    dormers: number;
    skylights: number;
  };
  wasteFactor: number; // percentage
  totalMaterialNeeded: number; // sq ft with waste
}

export interface QuotePricing {
  materials: {
    description: string;
    quantity: number;
    unitCost: number;
    total: number;
  }[];
  labor: {
    hours: number;
    hourlyRate: number;
    total: number;
  };
  equipment: number;
  overhead: number;
  profit: number;
  subtotal: number;
  regionalMultiplier: number;
  complexityMultiplier: number;
  thermalFactor?: number;
  priceRangeMin: number;
  priceRangeMax: number;
  priceEstimate: number;
}

export interface QuoteOption {
  name: string;
  description: string;
  priceAdjustment: number; // +/- from base
  features: string[];
  warranty: {
    labor: number;
    material: number;
  };
  recommended: boolean;
}

// Sample remote quotes
export const REMOTE_QUOTES: RemoteQuote[] = [
  {
    id: 'quote-001',
    address: '123 Main St, Calgary, AB',
    latitude: 51.0447,
    longitude: -114.0719,
    division: 'toitures',
    serviceType: 'Roof Replacement',
    buildingData: {
      age: 2010,
      stories: 2,
      roofType: 'gable',
      roofPitch: 30,
      roofComplexity: 2,
      materialType: 'Asphalt Shingles',
      condition: 'fair',
      accessLevel: 'moderate'
    },
    measurements: {
      roofArea: 2150,
      footprint: {
        length: 50,
        width: 30
      },
      height: 22,
      complexityFactors: {
        valleys: 2,
        hips: 1,
        dormers: 0,
        skylights: 1
      },
      wasteFactor: 12,
      totalMaterialNeeded: 2408
    },
    pricing: {
      materials: [
        {
          description: '30-year Architectural Shingles',
          quantity: 72,
          unitCost: 95,
          total: 6840
        },
        {
          description: 'Synthetic Underlayment',
          quantity: 22,
          unitCost: 85,
          total: 1870
        },
        {
          description: 'Drip Edge & Ridge Cap',
          quantity: 1,
          unitCost: 450,
          total: 450
        }
      ],
      labor: {
        hours: 28,
        hourlyRate: 75,
        total: 2100
      },
      equipment: 800,
      overhead: 1809,
      profit: 2414,
      subtotal: 16283,
      regionalMultiplier: 1.0,
      complexityMultiplier: 1.05,
      priceRangeMin: 8500,
      priceRangeMax: 9800,
      priceEstimate: 9150
    },
    confidence: 'high',
    confidenceScore: 92,
    status: 'generated',
    createdDate: '2026-01-16T10:30:00Z'
  },
  {
    id: 'quote-002',
    address: '456 rue Principale, Richelieu, QC',
    latitude: 45.4405,
    longitude: -73.2474,
    division: 'isolation',
    serviceType: 'Attic Insulation',
    buildingData: {
      age: 1985,
      stories: 1,
      roofType: 'gable',
      roofPitch: 35,
      roofComplexity: 1,
      accessLevel: 'easy'
    },
    measurements: {
      roofArea: 1200,
      footprint: {
        length: 40,
        width: 30
      },
      height: 15,
      complexityFactors: {
        valleys: 0,
        hips: 0,
        dormers: 0,
        skylights: 0
      },
      wasteFactor: 8,
      totalMaterialNeeded: 1296
    },
    pricing: {
      materials: [
        {
          description: 'R60 Blown Fiberglass',
          quantity: 1296,
          unitCost: 1.85,
          total: 2398
        },
        {
          description: 'Ventilation Baffles',
          quantity: 48,
          unitCost: 3.50,
          total: 168
        },
        {
          description: 'Air Sealing Materials',
          quantity: 1,
          unitCost: 250,
          total: 250
        }
      ],
      labor: {
        hours: 8,
        hourlyRate: 65,
        total: 520
      },
      equipment: 300,
      overhead: 492,
      profit: 656,
      subtotal: 4784,
      regionalMultiplier: 1.0,
      complexityMultiplier: 1.0,
      priceRangeMin: 4200,
      priceRangeMax: 5300,
      priceEstimate: 4750
    },
    confidence: 'high',
    confidenceScore: 88,
    status: 'generated',
    createdDate: '2026-01-16T14:15:00Z'
  }
];

// Quote upgrade options
export const QUOTE_OPTIONS: Record<string, QuoteOption[]> = {
  roofing: [
    {
      name: 'Good',
      description: '25-year 3-tab shingles',
      priceAdjustment: -1200,
      features: ['Basic 3-tab shingles', 'Standard underlayment', '25-year material warranty'],
      warranty: { labor: 2, material: 25 },
      recommended: false
    },
    {
      name: 'Better',
      description: '30-year architectural shingles',
      priceAdjustment: 0,
      features: ['Architectural shingles', 'Synthetic underlayment', '30-year material warranty'],
      warranty: { labor: 5, material: 30 },
      recommended: true
    },
    {
      name: 'Best',
      description: '50-year premium shingles',
      priceAdjustment: 1800,
      features: ['Premium designer shingles', 'Ice & water shield', '50-year material warranty'],
      warranty: { labor: 10, material: 50 },
      recommended: false
    }
  ],
  insulation: [
    {
      name: 'R50',
      description: 'Good insulation',
      priceAdjustment: -500,
      features: ['R50 insulation', 'Basic air sealing', 'Meets minimum code'],
      warranty: { labor: 3, material: 20 },
      recommended: false
    },
    {
      name: 'R60',
      description: 'Better insulation',
      priceAdjustment: 0,
      features: ['R60 insulation', 'Complete air sealing', 'Energy Star certified'],
      warranty: { labor: 5, material: 25 },
      recommended: true
    },
    {
      name: 'R70',
      description: 'Best insulation',
      priceAdjustment: 800,
      features: ['R70+ spray foam', 'Superior air sealing', 'Maximum energy savings'],
      warranty: { labor: 10, material: 50 },
      recommended: false
    }
  ]
};

// Calculate roof area with pitch adjustment
export function calculateRoofArea(footprintArea: number, pitch: number): number {
  const pitchMultipliers: Record<string, number> = {
    '0-15': 1.0,
    '15-30': 1.05,
    '30-45': 1.15,
    '45-60': 1.3,
    '60+': 1.5
  };

  let multiplier = 1.0;
  if (pitch <= 15) multiplier = 1.0;
  else if (pitch <= 30) multiplier = 1.05;
  else if (pitch <= 45) multiplier = 1.15;
  else if (pitch <= 60) multiplier = 1.3;
  else multiplier = 1.5;

  return Math.round(footprintArea * multiplier);
}

// Calculate quote confidence score
export function calculateConfidenceScore(
  buildingAge: number | undefined,
  roofComplexity: number,
  thermalDataAvailable: boolean,
  imageQuality: 'excellent' | 'good' | 'poor'
): number {
  let score = 100;

  // Age data available
  if (!buildingAge) score -= 15;

  // Complexity
  if (roofComplexity >= 4) score -= 20;
  else if (roofComplexity === 3) score -= 10;

  // Thermal data
  if (!thermalDataAvailable) score -= 10;

  // Image quality
  if (imageQuality === 'poor') score -= 25;
  else if (imageQuality === 'good') score -= 5;

  return Math.max(0, score);
}

// Get remote quote by address
export function getRemoteQuoteByAddress(address: string): RemoteQuote | undefined {
  return REMOTE_QUOTES.find(quote =>
    quote.address.toLowerCase().includes(address.toLowerCase())
  );
}
