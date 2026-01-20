/**
 * Thermal Heat Map Data
 * Heat loss ratings, thermal scans, and energy efficiency data
 */

import { DivisionType } from '../types/user';

export interface ThermalScan {
  id: string;
  propertyId: string;
  address: string;
  scanDate: string;
  heatLossRating: number; // 1-10 scale
  thermalImageUrl?: string;
  visibleImageUrl?: string;
  zones: ThermalZone[];
  estimatedAnnualWaste: number; // in dollars
  potentialSavings: number; // in dollars
  neighborhoodAverage: number; // heat loss rating
  buildingAge?: number;
  lastInsulationUpgrade?: string;
  division: DivisionType;
  technicianId?: string;
}

export interface ThermalZone {
  id: string;
  name: string;
  area: 'roof' | 'walls' | 'windows' | 'doors' | 'attic' | 'basement' | 'foundation';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  temperature: number; // degrees Celsius
  heatLossIntensity: number; // 1-10
  recommendation: string;
  estimatedCost: number;
  priority: number; // 1-5
}

export interface HeatLossRecommendation {
  zone: string;
  issue: string;
  solution: string;
  estimatedCost: number;
  energySavings: number; // annual $ savings
  paybackPeriod: number; // years
  priority: 'immediate' | 'high' | 'medium' | 'low';
}

// Sample thermal scan data
export const THERMAL_SCANS: ThermalScan[] = [
  {
    id: 'thermal-001',
    propertyId: 'prop-001',
    address: '2279 ch. des Patriotes, Richelieu, QC',
    scanDate: '2026-01-10T14:30:00Z',
    heatLossRating: 8,
    neighborhoodAverage: 5,
    buildingAge: 1985,
    lastInsulationUpgrade: '1985',
    estimatedAnnualWaste: 1200,
    potentialSavings: 950,
    division: 'toitures',
    zones: [
      {
        id: 'zone-001',
        name: 'Roof Ridge',
        area: 'roof',
        severity: 'critical',
        temperature: 8.5,
        heatLossIntensity: 9,
        recommendation: 'Critical heat escape. Attic insulation insufficient. Ice dam risk.',
        estimatedCost: 3500,
        priority: 1
      },
      {
        id: 'zone-002',
        name: 'Northeast Corner',
        area: 'attic',
        severity: 'high',
        temperature: 6.2,
        heatLossIntensity: 7,
        recommendation: 'High heat loss through attic. Add R60 insulation.',
        estimatedCost: 2800,
        priority: 2
      },
      {
        id: 'zone-003',
        name: 'Attic Hatch',
        area: 'attic',
        severity: 'moderate',
        temperature: 4.1,
        heatLossIntensity: 5,
        recommendation: 'Moderate heat loss. Add insulated hatch cover.',
        estimatedCost: 300,
        priority: 3
      }
    ]
  },
  {
    id: 'thermal-002',
    propertyId: 'prop-002',
    address: '456 rue St-Jean, Longueuil, QC',
    scanDate: '2026-01-12T10:15:00Z',
    heatLossRating: 3,
    neighborhoodAverage: 5,
    buildingAge: 2018,
    lastInsulationUpgrade: '2018',
    estimatedAnnualWaste: 350,
    potentialSavings: 200,
    division: 'isolation',
    zones: [
      {
        id: 'zone-004',
        name: 'North Wall',
        area: 'walls',
        severity: 'low',
        temperature: 2.1,
        heatLossIntensity: 3,
        recommendation: 'Minimal heat loss. Well insulated.',
        estimatedCost: 0,
        priority: 5
      }
    ]
  },
  {
    id: 'thermal-003',
    propertyId: 'prop-003',
    address: '789 av. de la Montagne, Brossard, QC',
    scanDate: '2026-01-14T13:45:00Z',
    heatLossRating: 10,
    neighborhoodAverage: 5,
    buildingAge: 1972,
    lastInsulationUpgrade: 'Unknown',
    estimatedAnnualWaste: 2100,
    potentialSavings: 1800,
    division: 'toitures',
    zones: [
      {
        id: 'zone-005',
        name: 'Entire Roof',
        area: 'roof',
        severity: 'critical',
        temperature: 12.8,
        heatLossIntensity: 10,
        recommendation: 'EMERGENCY: Severe heat loss. No insulation detected. Immediate action required.',
        estimatedCost: 8500,
        priority: 1
      },
      {
        id: 'zone-006',
        name: 'Basement Ceiling',
        area: 'basement',
        severity: 'critical',
        temperature: 9.4,
        heatLossIntensity: 9,
        recommendation: 'Critical heat loss to basement. Add spray foam insulation.',
        estimatedCost: 4200,
        priority: 1
      }
    ]
  }
];

// Heat loss rating categories
export const HEAT_LOSS_CATEGORIES = {
  low: { min: 1, max: 3, color: '#10B981', label: 'Faible perte', description: 'Bien isolé, efficace' },
  moderate: { min: 4, max: 6, color: '#F59E0B', label: 'Perte modérée', description: 'Améliorations recommandées' },
  high: { min: 7, max: 9, color: '#EF4444', label: 'Perte élevée', description: 'Action prioritaire' },
  critical: { min: 10, max: 10, color: '#DC2626', label: 'Perte critique', description: 'Intervention immédiate' }
};

// Get heat loss category
export function getHeatLossCategory(rating: number): keyof typeof HEAT_LOSS_CATEGORIES {
  if (rating <= 3) return 'low';
  if (rating <= 6) return 'moderate';
  if (rating <= 9) return 'high';
  return 'critical';
}

// Calculate energy savings
export function calculateEnergySavings(currentRating: number, targetRating: number, sqft: number): number {
  const baseWastePerSqft = 0.60; // $/sqft/year at rating 10
  const currentWaste = (currentRating / 10) * baseWastePerSqft * sqft;
  const targetWaste = (targetRating / 10) * baseWastePerSqft * sqft;
  return Math.round(currentWaste - targetWaste);
}

// Get thermal scans by address
export function getThermalScanByAddress(address: string): ThermalScan | undefined {
  return THERMAL_SCANS.find(scan => 
    scan.address.toLowerCase().includes(address.toLowerCase())
  );
}

// Get thermal scans by heat loss rating range
export function getThermalScansByRating(minRating: number, maxRating: number): ThermalScan[] {
  return THERMAL_SCANS.filter(scan => 
    scan.heatLossRating >= minRating && scan.heatLossRating <= maxRating
  );
}

// Get high priority thermal scans (rating >= 7)
export function getHighPriorityScans(): ThermalScan[] {
  return THERMAL_SCANS.filter(scan => scan.heatLossRating >= 7);
}
