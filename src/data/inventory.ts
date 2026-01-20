import { DivisionType } from '../types/user';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: InventoryCategory;
  division?: DivisionType; // If division-specific, otherwise available to all
  locations: InventoryLocation[];
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: number;
  supplier?: string;
  barcode?: string;
  imageUrl?: string;
}

export interface InventoryLocation {
  locationType: 'warehouse' | 'division-stock' | 'truck';
  locationId: string; // Warehouse ID, Division ID, or Truck/Technician ID
  locationName: string;
  quantity: number;
  lastUpdated: string;
}

export type InventoryCategory =
  | 'plumbing-fittings'
  | 'plumbing-valves'
  | 'plumbing-pipes'
  | 'plumbing-fixtures'
  | 'roofing-shingles'
  | 'roofing-materials'
  | 'insulation-batts'
  | 'insulation-spray'
  | 'gutter-sections'
  | 'gutter-accessories'
  | 'lumber'
  | 'hardware'
  | 'tools'
  | 'safety-equipment'
  | 'consumables';

export interface PartsRequest {
  id: string;
  jobId?: string;
  technicianId: string;
  technicianName: string;
  division: DivisionType;
  items: PartsRequestItem[];
  urgency: 'emergency' | 'urgent' | 'standard';
  status: 'pending' | 'approved' | 'in-transit' | 'delivered' | 'cancelled';
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  deliveryLocation?: string;
}

export interface PartsRequestItem {
  itemId: string;
  itemName: string;
  quantity: number;
  estimatedCost: number;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: 'restock' | 'transfer' | 'usage' | 'adjustment' | 'return';
  quantity: number;
  fromLocation?: InventoryLocation;
  toLocation?: InventoryLocation;
  jobId?: string;
  technicianId?: string;
  notes?: string;
  timestamp: string;
  performedBy: string;
}

// Sample inventory data
export const INVENTORY_ITEMS: InventoryItem[] = [
  // Plumbing items
  {
    id: 'inv-001',
    sku: 'PLB-FIT-001',
    name: '1/2" Copper Elbow',
    description: '90-degree copper elbow fitting',
    category: 'plumbing-fittings',
    division: 'plomberie',
    locations: [
      {
        locationType: 'warehouse',
        locationId: 'warehouse-main',
        locationName: 'Warehouse Principal',
        quantity: 500,
        lastUpdated: '2026-01-16T08:00:00Z'
      },
      {
        locationType: 'division-stock',
        locationId: 'plomberie',
        locationName: 'Plomberie Division Stock',
        quantity: 150,
        lastUpdated: '2026-01-16T08:00:00Z'
      }
    ],
    reorderPoint: 100,
    reorderQuantity: 500,
    unitCost: 2.50,
    supplier: 'Wolseley Canada',
    barcode: '628055123456'
  },
  {
    id: 'inv-002',
    sku: 'PLB-VAL-001',
    name: '1/2" Ball Valve',
    description: 'Chrome-plated ball valve',
    category: 'plumbing-valves',
    division: 'plomberie',
    locations: [
      {
        locationType: 'warehouse',
        locationId: 'warehouse-main',
        locationName: 'Warehouse Principal',
        quantity: 200,
        lastUpdated: '2026-01-16T08:00:00Z'
      },
      {
        locationType: 'truck',
        locationId: 'tech-001',
        locationName: 'Marc Dubois - Camion #1',
        quantity: 12,
        lastUpdated: '2026-01-16T07:30:00Z'
      }
    ],
    reorderPoint: 50,
    reorderQuantity: 200,
    unitCost: 8.75,
    supplier: 'Wolseley Canada'
  },
  {
    id: 'inv-003',
    sku: 'PLB-FIX-001',
    name: 'Kitchen Faucet - Standard Chrome',
    description: 'Single-handle pull-down kitchen faucet',
    category: 'plumbing-fixtures',
    division: 'plomberie',
    locations: [
      {
        locationType: 'warehouse',
        locationId: 'warehouse-main',
        locationName: 'Warehouse Principal',
        quantity: 25,
        lastUpdated: '2026-01-16T08:00:00Z'
      }
    ],
    reorderPoint: 10,
    reorderQuantity: 25,
    unitCost: 120.00,
    supplier: 'Delta Faucet'
  },
  // Roofing items
  {
    id: 'inv-004',
    sku: 'ROOF-SHG-001',
    name: 'Asphalt Shingles - Black',
    description: '3-tab asphalt shingles, 33.3 sq ft per bundle',
    category: 'roofing-shingles',
    division: 'toitures',
    locations: [
      {
        locationType: 'warehouse',
        locationId: 'warehouse-main',
        locationName: 'Warehouse Principal',
        quantity: 300,
        lastUpdated: '2026-01-16T08:00:00Z'
      },
      {
        locationType: 'division-stock',
        locationId: 'toitures',
        locationName: 'Toitures Division Stock',
        quantity: 80,
        lastUpdated: '2026-01-16T08:00:00Z'
      }
    ],
    reorderPoint: 100,
    reorderQuantity: 300,
    unitCost: 35.00,
    supplier: 'GAF Materials'
  },
  {
    id: 'inv-005',
    sku: 'ROOF-MAT-001',
    name: 'Roofing Nails - 1.25"',
    description: 'Galvanized roofing nails, 5lb box',
    category: 'roofing-materials',
    division: 'toitures',
    locations: [
      {
        locationType: 'warehouse',
        locationId: 'warehouse-main',
        locationName: 'Warehouse Principal',
        quantity: 150,
        lastUpdated: '2026-01-16T08:00:00Z'
      }
    ],
    reorderPoint: 50,
    reorderQuantity: 150,
    unitCost: 12.50,
    supplier: 'BMR'
  },
  // Insulation items
  {
    id: 'inv-006',
    sku: 'INS-BAT-001',
    name: 'Fiberglass Insulation Batts R20',
    description: '15" x 93" batts, R20 rating',
    category: 'insulation-batts',
    division: 'isolation',
    locations: [
      {
        locationType: 'warehouse',
        locationId: 'warehouse-main',
        locationName: 'Warehouse Principal',
        quantity: 500,
        lastUpdated: '2026-01-16T08:00:00Z'
      }
    ],
    reorderPoint: 200,
    reorderQuantity: 500,
    unitCost: 18.00,
    supplier: 'Owens Corning'
  },
  // Gutter items
  {
    id: 'inv-007',
    sku: 'GUT-SEC-001',
    name: 'Aluminum Gutter Section - White',
    description: '5" K-style gutter, 10ft section',
    category: 'gutter-sections',
    division: 'gouttieres',
    locations: [
      {
        locationType: 'warehouse',
        locationId: 'warehouse-main',
        locationName: 'Warehouse Principal',
        quantity: 100,
        lastUpdated: '2026-01-16T08:00:00Z'
      }
    ],
    reorderPoint: 30,
    reorderQuantity: 100,
    unitCost: 22.00,
    supplier: 'Alu-Rex'
  },
  // Shared items
  {
    id: 'inv-008',
    sku: 'SAFE-EQP-001',
    name: 'Safety Harness',
    description: 'Full-body safety harness with lanyard',
    category: 'safety-equipment',
    locations: [
      {
        locationType: 'warehouse',
        locationId: 'warehouse-main',
        locationName: 'Warehouse Principal',
        quantity: 25,
        lastUpdated: '2026-01-16T08:00:00Z'
      }
    ],
    reorderPoint: 10,
    reorderQuantity: 20,
    unitCost: 175.00,
    supplier: '3M Fall Protection'
  },
  {
    id: 'inv-009',
    sku: 'TOOL-DRL-001',
    name: 'Cordless Drill 20V',
    description: 'DeWalt 20V cordless drill with battery',
    category: 'tools',
    locations: [
      {
        locationType: 'warehouse',
        locationId: 'warehouse-main',
        locationName: 'Warehouse Principal',
        quantity: 15,
        lastUpdated: '2026-01-16T08:00:00Z'
      }
    ],
    reorderPoint: 5,
    reorderQuantity: 10,
    unitCost: 350.00,
    supplier: 'Home Depot'
  },
  {
    id: 'inv-010',
    sku: 'CONS-GLV-001',
    name: 'Work Gloves - Large',
    description: 'Leather palm work gloves',
    category: 'consumables',
    locations: [
      {
        locationType: 'warehouse',
        locationId: 'warehouse-main',
        locationName: 'Warehouse Principal',
        quantity: 300,
        lastUpdated: '2026-01-16T08:00:00Z'
      }
    ],
    reorderPoint: 100,
    reorderQuantity: 300,
    unitCost: 8.00,
    supplier: 'BMR'
  }
];

// Sample parts requests
export const PARTS_REQUESTS: PartsRequest[] = [
  {
    id: 'req-001',
    jobId: 'job-12345',
    technicianId: 'tech-001',
    technicianName: 'Marc Dubois',
    division: 'plomberie',
    items: [
      {
        itemId: 'inv-001',
        itemName: '1/2" Copper Elbow',
        quantity: 8,
        estimatedCost: 20.00
      },
      {
        itemId: 'inv-002',
        itemName: '1/2" Ball Valve',
        quantity: 2,
        estimatedCost: 17.50
      }
    ],
    urgency: 'urgent',
    status: 'pending',
    requestedAt: '2026-01-16T10:30:00Z',
    notes: 'Client upgrade - need by 2pm today',
    deliveryLocation: '123 rue St-Jean, Longueuil'
  },
  {
    id: 'req-002',
    jobId: 'job-67890',
    technicianId: 'tech-005',
    technicianName: 'Jonathan Isabel',
    division: 'toitures',
    items: [
      {
        itemId: 'inv-004',
        itemName: 'Asphalt Shingles - Black',
        quantity: 15,
        estimatedCost: 525.00
      },
      {
        itemId: 'inv-005',
        itemName: 'Roofing Nails - 1.25"',
        quantity: 4,
        estimatedCost: 50.00
      }
    ],
    urgency: 'standard',
    status: 'approved',
    requestedAt: '2026-01-15T14:00:00Z',
    approvedBy: 'Jonathan Isabel',
    approvedAt: '2026-01-15T14:30:00Z',
    notes: 'For tomorrow morning delivery',
    deliveryLocation: '456 ch. Chambly, Brossard'
  }
];

export const getInventoryByDivision = (division?: DivisionType): InventoryItem[] => {
  if (!division) return INVENTORY_ITEMS;
  return INVENTORY_ITEMS.filter(item => !item.division || item.division === division);
};

export const getInventoryByCategory = (category: InventoryCategory): InventoryItem[] => {
  return INVENTORY_ITEMS.filter(item => item.category === category);
};

export const getLowStockItems = (): InventoryItem[] => {
  return INVENTORY_ITEMS.filter(item => {
    const totalQuantity = item.locations.reduce((sum, loc) => sum + loc.quantity, 0);
    return totalQuantity <= item.reorderPoint;
  });
};

export const getPendingPartsRequests = (): PartsRequest[] => {
  return PARTS_REQUESTS.filter(req => req.status === 'pending');
};
