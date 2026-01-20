/**
 * 🏢 SYNERGAIR x GROUPE G. LAFRANCE - DIVISION CONFIGURATIONS
 * 
 * Complete service catalog and compliance requirements for all 8 divisions
 * Joint Venture between Synergair Technologies Inc. and Groupe G. Lafrance
 * 
 * @fileoverview Division-specific data, services, and regulatory requirements
 * @version 2.0.0
 * @date January 16, 2026
 */

import { 
  AlertTriangle, Wrench, Hammer, Search, Droplet, Flame,
  Home, Warehouse, Sparkles, Shield, DollarSign
} from 'lucide-react';
import type { Division, DivisionType } from '../types/lacoste-platform';

// ============================================================================
// DIVISION MASTER LIST
// ============================================================================

export const DIVISIONS: Division[] = [
  {
    id: 'plomberie',
    name: 'Plomberie Michaël Lacoste',
    nameFr: 'Plomberie Michaël Lacoste',
    rrbqLicense: '5865.7925.01',
    ccqCertificate: 'Plombier',
    active: true,
    primaryContact: 'Michael Lacoste',
    emergencyPhone: '514-555-URGENT',
    serviceArea: ['H1', 'H2', 'H3', 'H4', 'H5', 'H7', 'H8', 'H9', 'J4', 'J5', 'J6', 'J7']
  },
  {
    id: 'construction',
    name: 'GAB Lafrance Construction',
    nameFr: 'GAB Lafrance Construction',
    rrbqLicense: '5726.2941.01',
    ccqCertificate: 'Entrepreneur général',
    active: true,
    primaryContact: 'Gabriel Lafrance',
    serviceArea: ['H1', 'H2', 'H3', 'H4', 'H5', 'H7', 'H8', 'H9', 'J4', 'J5', 'J6', 'J7']
  },
  {
    id: 'toitures',
    name: 'Les Toitures Jonathan Isabel',
    nameFr: 'Les Toitures Jonathan Isabel',
    rrbqLicense: 'Subcategory 7',
    ccqCertificate: 'Couvreur / Ferblantier',
    active: true,
    primaryContact: 'Jonathan Isabel',
    serviceArea: ['H1', 'H2', 'H3', 'H4', 'H5', 'H7', 'H8', 'H9', 'J4', 'J5', 'J6', 'J7']
  },
  {
    id: 'isolation',
    name: 'Isolation Mike Turmel',
    nameFr: 'Isolation Mike Turmel',
    rrbqLicense: 'Subcategory 7',
    ccqCertificate: 'Calorifugeur',
    active: true,
    primaryContact: 'Mike Turmel',
    serviceArea: ['H1', 'H2', 'H3', 'H4', 'H5', 'H7', 'H8', 'H9', 'J4', 'J5', 'J6', 'J7']
  },
  {
    id: 'conteneurs',
    name: 'Conteneurs Mira',
    nameFr: 'Conteneurs Mira',
    active: true,
    primaryContact: 'Mira Operations',
    serviceArea: ['H1', 'H2', 'H3', 'H4', 'H5', 'H7', 'H8', 'H9', 'J4', 'J5', 'J6', 'J7', 'J8']
  },
  {
    id: 'gutters',
    name: 'Gouttières et Revêtements Alex Roussin',
    nameFr: 'Gouttières et Revêtements Alex Roussin',
    rrbqLicense: 'Subcategory 7',
    ccqCertificate: 'Ferblantier',
    active: true,
    primaryContact: 'Alex Roussin',
    serviceArea: ['H1', 'H2', 'H3', 'H4', 'H5', 'H7', 'H8', 'H9']
  },
  {
    id: 'decks',
    name: 'Patio Terrasse Francis Girard',
    nameFr: 'Patio Terrasse Francis Girard',
    rrbqLicense: 'Subcategory 6',
    ccqCertificate: 'Charpentier-menuisier',
    active: true,
    primaryContact: 'Francis Girard',
    serviceArea: ['H1', 'H2', 'H3', 'H4', 'H5', 'H7', 'H8', 'H9']
  },
  {
    id: 'real-estate',
    name: 'Maison Cash',
    nameFr: 'Maison Cash',
    active: true,
    primaryContact: 'Real Estate Team',
    serviceArea: ['H1', 'H2', 'H3', 'H4', 'H5', 'H7', 'H8', 'H9', 'J4', 'J5', 'J6', 'J7']
  }
];

// ============================================================================
// DIVISION-SPECIFIC SERVICE CATEGORIES
// ============================================================================

/**
 * PLOMBERIE MICHAËL LACOSTE - Service Catalog
 * (Already centralized in /src/app/data/services.ts)
 * 
 * 8 Categories | 40 Services
 * See: SERVICE_CATEGORIES in services.ts
 */

/**
 * GAB LAFRANCE CONSTRUCTION - General Contracting Service Catalog
 */
export const CONSTRUCTION_SERVICES = [
  {
    id: 'residential-renovation',
    category: 'Rénovation résidentielle',
    name: 'Rénovation complète',
    nameFr: 'Rénovation complète',
    description: 'Rénovation intérieure et extérieure complète',
    permitRequired: true,
    avgDuration: '4-12 semaines',
    warrantyYears: 5,
    multiTradeCoordination: true
  },
  {
    id: 'kitchen-renovation',
    category: 'Rénovation résidentielle',
    name: 'Rénovation de cuisine',
    nameFr: 'Rénovation de cuisine',
    description: 'Rénovation complète de cuisine avec coordination plomberie/électricité',
    permitRequired: true,
    avgDuration: '3-6 semaines',
    warrantyYears: 5
  },
  {
    id: 'bathroom-renovation',
    category: 'Rénovation résidentielle',
    name: 'Rénovation de salle de bain',
    nameFr: 'Rénovation de salle de bain',
    description: 'Rénovation complète de salle de bain',
    permitRequired: true,
    avgDuration: '2-4 semaines',
    warrantyYears: 5,
    crossSell: 'plomberie'
  },
  {
    id: 'basement-finishing',
    category: 'Rénovation résidentielle',
    name: 'Aménagement de sous-sol',
    nameFr: 'Aménagement de sous-sol',
    description: 'Finition complète de sous-sol',
    permitRequired: true,
    avgDuration: '4-8 semaines',
    warrantyYears: 5,
    crossSell: 'isolation'
  },
  {
    id: 'commercial-buildout',
    category: 'Construction commerciale',
    name: 'Aménagement commercial',
    nameFr: 'Aménagement commercial',
    description: 'Construction et aménagement d\'espaces commerciaux',
    permitRequired: true,
    avgDuration: '8-16 semaines',
    warrantyYears: 5
  },
  {
    id: 'structural-repairs',
    category: 'Réparations structurelles',
    name: 'Réparations structurelles',
    nameFr: 'Réparations structurelles',
    description: 'Réparations de fondations, poutres, colonnes',
    engineeringRequired: true,
    permitRequired: true,
    avgDuration: '2-6 semaines',
    warrantyYears: 10
  },
  {
    id: 'foundation-work',
    category: 'Fondations',
    name: 'Travaux de fondations',
    nameFr: 'Travaux de fondations',
    description: 'Réparation et renforcement de fondations',
    engineeringRequired: true,
    permitRequired: true,
    avgDuration: '2-8 semaines',
    warrantyYears: 10
  },
  {
    id: 'framing',
    category: 'Charpente',
    name: 'Charpente et ossature',
    nameFr: 'Charpente et ossature',
    description: 'Construction de charpente en bois ou acier',
    permitRequired: true,
    avgDuration: '2-6 semaines',
    warrantyYears: 5
  },
  {
    id: 'drywall-installation',
    category: 'Finitions intérieures',
    name: 'Installation de gypse',
    nameFr: 'Installation de gypse',
    description: 'Installation et finition de panneaux de gypse',
    avgDuration: '1-3 semaines',
    warrantyYears: 2
  },
  {
    id: 'flooring-installation',
    category: 'Revêtements de sol',
    name: 'Installation de planchers',
    nameFr: 'Installation de planchers',
    description: 'Installation de bois franc, céramique, vinyle',
    materials: ['hardwood', 'ceramic', 'vinyl', 'laminate'],
    avgDuration: '1-2 semaines',
    warrantyYears: 3
  },
  {
    id: 'project-management',
    category: 'Gestion de projet',
    name: 'Gestion de projet de construction',
    nameFr: 'Gestion de projet de construction',
    description: 'Coordination complète de projets multi-métiers',
    multiTradeCoordination: true
  }
];

/**
 * LES TOITURES JONATHAN ISABEL - Roofing Service Catalog
 */
export const ROOFING_SERVICES = [
  {
    id: 'shingle-installation',
    category: 'Installation',
    name: 'Installation de toiture en bardeau',
    nameFr: 'Installation de toiture en bardeau',
    description: 'Installation complète de toiture en bardeau d\'asphalte avec garantie',
    permitRequired: true,
    permitTrigger: 'height > 60cm',
    avgDuration: '2-3 jours',
    warrantyYears: 5,
    seasonalPeak: ['spring', 'summer', 'fall']
  },
  {
    id: 'flat-roof-tpo',
    category: 'Installation',
    name: 'Membrane TPO pour toit plat',
    nameFr: 'Membrane TPO pour toit plat',
    description: 'Installation de membrane TPO blanche (SRI ≥78) pour toits plats >300m²',
    permitRequired: true,
    complianceNote: 'SRI ≥78 requis pour surfaces >300m² (Montreal)',
    avgDuration: '1-2 jours',
    warrantyYears: 5,
    seasonalPeak: ['summer', 'fall']
  },
  {
    id: 'flat-roof-epdm',
    category: 'Installation',
    name: 'Membrane EPDM pour toit plat',
    nameFr: 'Membrane EPDM pour toit plat',
    description: 'Installation de membrane EPDM résistante et durable',
    permitRequired: true,
    avgDuration: '1-2 jours',
    warrantyYears: 5,
    seasonalPeak: ['summer', 'fall']
  },
  {
    id: 'torch-on-roofing',
    category: 'Installation',
    name: 'Toiture en asphalte et gravier',
    nameFr: 'Toiture en asphalte et gravier',
    description: 'Installation de membrane torch-on multicouche',
    permitRequired: true,
    avgDuration: '2-3 jours',
    warrantyYears: 5,
    seasonalPeak: ['summer', 'fall']
  },
  {
    id: 'emergency-roof-repair',
    category: 'Urgences 24/7',
    name: 'Réparation de toiture d\'urgence',
    nameFr: 'Réparation de toiture d\'urgence',
    description: 'Intervention d\'urgence pour fuites actives',
    emergencyService: true,
    responseTime: '2-4 heures',
    avgDuration: '2-4 heures',
    warrantyYears: 1
  },
  {
    id: 'roof-leak-repair',
    category: 'Réparation',
    name: 'Réparation de fuites',
    nameFr: 'Réparation de fuites',
    description: 'Détection et réparation de fuites de toiture',
    avgDuration: '0.5-1 jour',
    warrantyYears: 2
  },
  {
    id: 'shingle-replacement',
    category: 'Réparation',
    name: 'Remplacement de bardeaux',
    nameFr: 'Remplacement de bardeaux',
    description: 'Remplacement de bardeaux endommagés ou manquants',
    avgDuration: '0.5 jour',
    warrantyYears: 1
  },
  {
    id: 'flashing-repair',
    category: 'Réparation',
    name: 'Réparation de solins',
    nameFr: 'Réparation de solins',
    description: 'Réparation ou remplacement de solins autour cheminées, lucarnes',
    avgDuration: '0.5-1 jour',
    warrantyYears: 2
  },
  {
    id: 'roof-inspection',
    category: 'Inspection',
    name: 'Inspection de toiture',
    nameFr: 'Inspection de toiture',
    description: 'Inspection visuelle complète avec rapport photographique',
    avgDuration: '1-2 heures',
    droneOption: true,
    reportIncluded: true
  },
  {
    id: 'pre-purchase-inspection',
    category: 'Inspection',
    name: 'Inspection pré-achat',
    nameFr: 'Inspection pré-achat',
    description: 'Évaluation complète de l\'état de la toiture pour acheteurs',
    avgDuration: '2-3 heures',
    reportIncluded: true
  },
  {
    id: 'storm-damage-assessment',
    category: 'Inspection',
    name: 'Évaluation des dommages après tempête',
    nameFr: 'Évaluation des dommages après tempête',
    description: 'Inspection post-tempête avec photos pour réclamation d\'assurance',
    weatherTriggered: true,
    responseTime: '24-48 heures',
    avgDuration: '1-2 heures',
    insuranceReport: true
  },
  {
    id: 'ice-dam-prevention',
    category: 'Prévention',
    name: 'Prévention de barrages de glace',
    nameFr: 'Prévention de barrages de glace',
    description: 'Installation de câbles chauffants et amélioration ventilation',
    avgDuration: '1 jour',
    seasonalPeak: ['fall', 'winter']
  },
  {
    id: 'roof-ventilation',
    category: 'Ventilation',
    name: 'Amélioration de la ventilation',
    nameFr: 'Amélioration de la ventilation',
    description: 'Installation de ventilateurs de toiture et évents de soffite',
    avgDuration: '0.5-1 jour',
    crossSell: 'insulation'
  },
  {
    id: 'skylight-installation',
    category: 'Installation',
    name: 'Installation de puits de lumière',
    nameFr: 'Installation de puits de lumière',
    description: 'Installation professionnelle de puits de lumière avec étanchéité',
    permitRequired: true,
    avgDuration: '1 jour',
    warrantyYears: 5
  }
];

/**
 * ISOLATION MIKE TURMEL - Insulation Service Catalog
 */
export const INSULATION_SERVICES = [
  {
    id: 'attic-insulation-blown',
    category: 'Isolation de grenier',
    name: 'Isolation de grenier soufflée',
    nameFr: 'Isolation de grenier soufflée',
    description: 'Isolation de cellulose ou fibre de verre soufflée, conforme Code du bâtiment',
    rValueOptions: ['R40', 'R50', 'R60'],
    avgDuration: '1 jour',
    renoclimatEligible: true,
    grantPrograms: ['Énergir', 'Hydro-Québec', 'Chauffez vert']
  },
  {
    id: 'attic-insulation-batt',
    category: 'Isolation de grenier',
    name: 'Isolation de grenier en nattes',
    nameFr: 'Isolation de grenier en nattes',
    description: 'Installation de nattes de fibre de verre ou laine de roche',
    rValueOptions: ['R30', 'R40', 'R50'],
    avgDuration: '1-2 jours',
    renoclimatEligible: true
  },
  {
    id: 'wall-insulation-injection',
    category: 'Isolation de murs',
    name: 'Isolation de murs par injection',
    nameFr: 'Isolation de murs par injection',
    description: 'Injection de mousse ou cellulose dans murs existants',
    rValueOptions: ['R12', 'R15', 'R20'],
    avgDuration: '1-2 jours',
    renoclimatEligible: true,
    grantPrograms: ['Énergir', 'Hydro-Québec']
  },
  {
    id: 'spray-foam-insulation',
    category: 'Isolation de murs',
    name: 'Isolation en mousse pulvérisée',
    nameFr: 'Isolation en mousse pulvérisée',
    description: 'Mousse polyuréthane haute performance avec barrière vapeur intégrée',
    rValueOptions: ['R20', 'R30', 'R40'],
    avgDuration: '1-2 jours',
    renoclimatEligible: true
  },
  {
    id: 'basement-insulation',
    category: 'Isolation de sous-sol',
    name: 'Isolation de sous-sol',
    nameFr: 'Isolation de sous-sol',
    description: 'Isolation de murs de fondation et plafond de sous-sol',
    rValueOptions: ['R12', 'R20', 'R24'],
    avgDuration: '2-3 jours',
    renoclimatEligible: true
  },
  {
    id: 'crawl-space-insulation',
    category: 'Isolation de sous-sol',
    name: 'Isolation de vide sanitaire',
    nameFr: 'Isolation de vide sanitaire',
    description: 'Isolation et scellement de vide sanitaire avec barrière vapeur',
    avgDuration: '1-2 jours',
    renoclimatEligible: true
  },
  {
    id: 'soundproofing',
    category: 'Insonorisation',
    name: 'Insonorisation',
    nameFr: 'Insonorisation',
    description: 'Isolation acoustique entre étages ou pièces',
    avgDuration: '1-3 jours',
    rValueOptions: ['STC 50', 'STC 55', 'STC 60']
  },
  {
    id: 'air-sealing',
    category: 'Scellement',
    name: 'Scellement à l\'air',
    nameFr: 'Scellement à l\'air',
    description: 'Colmatage des fuites d\'air avec test d\'infiltrométrie',
    avgDuration: '1 jour',
    renoclimatEligible: true,
    blowerDoorTest: true
  },
  {
    id: 'vapor-barrier',
    category: 'Barrière vapeur',
    name: 'Installation de pare-vapeur',
    nameFr: 'Installation de pare-vapeur',
    description: 'Pose de pare-vapeur polyéthylène conforme au Code',
    avgDuration: '0.5-1 jour',
    renoclimatEligible: true
  },
  {
    id: 'energy-audit',
    category: 'Évaluation énergétique',
    name: 'Évaluation Rénoclimat',
    nameFr: 'Évaluation Rénoclimat',
    description: 'Évaluation énergétique pré/post rénovation avec conseiller certifié',
    avgDuration: '2-3 heures',
    renoclimatRequired: true,
    reportIncluded: true,
    thermalImagingIncluded: true
  },
  {
    id: 'asbestos-removal',
    category: 'Désamiantage',
    name: 'Retrait d\'amiante',
    nameFr: 'Retrait d\'amiante',
    description: 'Enlèvement sécuritaire d\'isolant contenant de l\'amiante',
    certificationRequired: 'Asbestos Awareness Training',
    avgDuration: '2-5 jours',
    healthAndSafety: true
  }
];

/**
 * CONTENEURS MIRA - Portable Sanitation Service Catalog
 */
export const CONTAINER_SERVICES = [
  {
    id: 'construction-toilet-standard',
    category: 'Chantiers de construction',
    name: 'Toilette de chantier standard',
    nameFr: 'Toilette de chantier standard',
    description: 'Toilette portative standard pour chantiers de construction',
    serviceSchedule: ['weekly', 'bi-weekly', 'monthly'],
    cnesstCompliant: true,
    workerRatio: '1:30',
    avgMonthlyRate: 125
  },
  {
    id: 'construction-toilet-flush',
    category: 'Chantiers de construction',
    name: 'Toilette de chantier avec chasse',
    nameFr: 'Toilette de chantier avec chasse',
    description: 'Toilette avec chasse d\'eau (requis pour 25+ travailleurs)',
    serviceSchedule: ['weekly', 'bi-weekly'],
    cnesstRequired: 'workers >= 25',
    workerRatio: '1:30',
    avgMonthlyRate: 175
  },
  {
    id: 'handwashing-station',
    category: 'Chantiers de construction',
    name: 'Station de lavage des mains',
    nameFr: 'Station de lavage des mains',
    description: 'Station autonome de lavage avec savon et eau',
    serviceSchedule: ['weekly', 'bi-weekly'],
    cnesstRecommended: true,
    avgMonthlyRate: 85
  },
  {
    id: 'event-toilet-standard',
    category: 'Événements',
    name: 'Toilette d\'événement standard',
    nameFr: 'Toilette d\'événement standard',
    description: 'Toilette portative pour événements extérieurs',
    eventRatio: '1 toilette / 50-75 personnes',
    avgDailyRate: 150
  },
  {
    id: 'luxury-restroom-trailer',
    category: 'Événements',
    name: 'Remorque-toilettes de luxe',
    nameFr: 'Remorque-toilettes de luxe',
    description: 'Remorque avec toilettes, lavabos, éclairage, musique',
    capacity: '4-8 stations',
    avgDailyRate: 500,
    powerRequired: true,
    waterConnectionRequired: true
  },
  {
    id: 'ada-accessible-unit',
    category: 'Accessibilité',
    name: 'Unité accessible PMR',
    nameFr: 'Unité accessible PMR',
    description: 'Toilette accessible aux personnes à mobilité réduite',
    adaCompliant: true,
    avgMonthlyRate: 150
  },
  {
    id: 'event-package-small',
    category: 'Forfaits événements',
    name: 'Forfait petit événement (<100 personnes)',
    nameFr: 'Forfait petit événement (<100 personnes)',
    description: '2 toilettes standard + 1 station lavage',
    attendeeCapacity: '50-100',
    avgRate: 400
  },
  {
    id: 'event-package-medium',
    category: 'Forfaits événements',
    name: 'Forfait événement moyen (100-300 personnes)',
    nameFr: 'Forfait événement moyen (100-300 personnes)',
    description: '4 toilettes + 2 stations lavage + 1 PMR',
    attendeeCapacity: '100-300',
    avgRate: 850
  },
  {
    id: 'event-package-large',
    category: 'Forfaits événements',
    name: 'Forfait grand événement (300+ personnes)',
    nameFr: 'Forfait grand événement (300+ personnes)',
    description: '8 toilettes + 3 stations + 1 PMR + 1 remorque luxe',
    attendeeCapacity: '300-500',
    avgRate: 1800
  },
  {
    id: 'iot-smart-servicing',
    category: 'Service intelligent',
    name: 'Service optimisé par capteurs IoT',
    nameFr: 'Service optimisé par capteurs IoT',
    description: 'Service basé sur niveau de remplissage (capteurs IoT)',
    iotEnabled: true,
    efficiencyGain: '26%',
    costReduction: '44%'
  }
];

/**
 * GUTTERS & CLADDING DIVISION - Service Catalog
 */
export const GUTTER_SERVICES = [
  {
    id: 'seamless-gutter-installation',
    category: 'Installation',
    name: 'Installation de gouttières sans soudure',
    nameFr: 'Installation de gouttières sans soudure',
    description: 'Installation de gouttières en aluminium fabriquées sur place',
    materials: ['aluminum', 'copper', 'steel'],
    avgDuration: '1 jour',
    warrantyYears: 5
  },
  {
    id: 'gutter-replacement',
    category: 'Remplacement',
    name: 'Remplacement de gouttières',
    nameFr: 'Remplacement de gouttières',
    description: 'Retrait et remplacement complet du système de gouttières',
    avgDuration: '1 jour',
    warrantyYears: 5
  },
  {
    id: 'downspout-installation',
    category: 'Installation',
    name: 'Installation de descentes pluviales',
    nameFr: 'Installation de descentes pluviales',
    description: 'Installation ou ajout de descentes pluviales',
    avgDuration: '0.5 jour',
    warrantyYears: 3
  },
  {
    id: 'gutter-cleaning-fall',
    category: 'Entretien saisonnier',
    name: 'Nettoyage de gouttières (automne)',
    nameFr: 'Nettoyage de gouttières (automne)',
    description: 'Nettoyage complet avant l\'hiver',
    seasonalPeak: 'fall',
    avgDuration: '2-3 heures',
    campaignReady: true
  },
  {
    id: 'gutter-cleaning-spring',
    category: 'Entretien saisonnier',
    name: 'Nettoyage de gouttières (printemps)',
    nameFr: 'Nettoyage de gouttières (printemps)',
    description: 'Nettoyage après la fonte des neiges',
    seasonalPeak: 'spring',
    avgDuration: '2-3 heures',
    campaignReady: true
  },
  {
    id: 'gutter-guard-installation',
    category: 'Protection',
    name: 'Installation de grilles protectrices',
    nameFr: 'Installation de grilles protectrices',
    description: 'Installation de systèmes anti-feuilles',
    avgDuration: '0.5-1 jour',
    warrantyYears: 5,
    maintenanceReduction: '80%'
  },
  {
    id: 'gutter-repair',
    category: 'Réparation',
    name: 'Réparation de gouttières',
    nameFr: 'Réparation de gouttières',
    description: 'Réparation de sections endommagées, joints qui fuient',
    avgDuration: '2-4 heures',
    warrantyYears: 1
  },
  {
    id: 'fascia-installation',
    category: 'Revêtement',
    name: 'Installation de fascia',
    nameFr: 'Installation de fascia',
    description: 'Installation ou remplacement de planches de fascia',
    materials: ['aluminum', 'pvc', 'wood'],
    avgDuration: '1-2 jours',
    warrantyYears: 5
  },
  {
    id: 'soffit-installation',
    category: 'Revêtement',
    name: 'Installation de soffites',
    nameFr: 'Installation de soffites',
    description: 'Installation de soffites ventilés',
    avgDuration: '1-2 jours',
    warrantyYears: 5,
    crossSell: 'roofing' // Ventilation improvement
  },
  {
    id: 'cladding-installation',
    category: 'Revêtement',
    name: 'Installation de revêtement extérieur',
    nameFr: 'Installation de revêtement extérieur',
    description: 'Revêtement en aluminium, vinyle ou fibre-ciment',
    materials: ['aluminum', 'vinyl', 'fiber-cement'],
    avgDuration: '3-7 jours',
    permitRequired: true,
    heritageApprovalRequired: 'if heritage zone'
  }
];

/**
 * PATIOS & DECKS DIVISION - Service Catalog
 */
export const DECK_SERVICES = [
  {
    id: 'deck-construction-wood',
    category: 'Construction de terrasses',
    name: 'Construction de terrasse en bois',
    nameFr: 'Construction de terrasse en bois',
    description: 'Terrasse en bois traité, cèdre ou bois exotique',
    materials: ['pressure-treated', 'cedar', 'ipe', 'mahogany'],
    permitRequired: 'height > 60cm',
    permitThreshold: '60cm height',
    avgDuration: '3-7 jours',
    warrantyYears: 3,
    engineeringRequired: 'if height > 180cm'
  },
  {
    id: 'deck-construction-composite',
    category: 'Construction de terrasses',
    name: 'Construction de terrasse en composite',
    nameFr: 'Construction de terrasse en composite',
    description: 'Terrasse en matériaux composites (Trex, TimberTech, etc.)',
    materials: ['Trex', 'TimberTech', 'Fiberon'],
    permitRequired: 'height > 60cm',
    avgDuration: '3-7 jours',
    warrantyYears: 10,
    maintenanceFree: true
  },
  {
    id: 'deck-construction-pvc',
    category: 'Construction de terrasses',
    name: 'Construction de terrasse en PVC',
    nameFr: 'Construction de terrasse en PVC',
    description: 'Terrasse en PVC 100% synthétique',
    permitRequired: 'height > 60cm',
    avgDuration: '3-7 jours',
    warrantyYears: 15,
    maintenanceFree: true
  },
  {
    id: 'patio-stone',
    category: 'Installation de patios',
    name: 'Patio en pierre naturelle',
    nameFr: 'Patio en pierre naturelle',
    description: 'Patio en dalles de pierre naturelle',
    materials: ['flagstone', 'slate', 'limestone'],
    avgDuration: '3-5 jours',
    warrantyYears: 5
  },
  {
    id: 'patio-pavers',
    category: 'Installation de patios',
    name: 'Patio en pavés',
    nameFr: 'Patio en pavés',
    description: 'Patio en pavés de béton imbriqués',
    avgDuration: '2-4 jours',
    warrantyYears: 5
  },
  {
    id: 'patio-concrete',
    category: 'Installation de patios',
    name: 'Patio en béton',
    nameFr: 'Patio en béton',
    description: 'Dalle de béton coulé, estampé ou poli',
    finishes: ['standard', 'stamped', 'polished', 'stained'],
    avgDuration: '2-3 jours',
    warrantyYears: 3
  },
  {
    id: 'deck-railing-installation',
    category: 'Rampes et garde-corps',
    name: 'Installation de rampe',
    nameFr: 'Installation de rampe',
    description: 'Installation de garde-corps conforme au Code',
    materials: ['wood', 'aluminum', 'glass', 'cable'],
    codeCompliance: 'Height 1m minimum, 1.07m if >180cm from ground',
    balusterSpacing: '10cm maximum',
    avgDuration: '1-2 jours',
    warrantyYears: 5
  },
  {
    id: 'deck-stairs',
    category: 'Escaliers',
    name: 'Construction d\'escalier extérieur',
    nameFr: 'Construction d\'escalier extérieur',
    description: 'Escalier pour accès à terrasse',
    avgDuration: '1-2 jours',
    warrantyYears: 3
  },
  {
    id: 'gazebo-construction',
    category: 'Structures',
    name: 'Construction de gazebo',
    nameFr: 'Construction de gazebo',
    description: 'Gazebo en bois ou aluminium',
    permitRequired: true,
    avgDuration: '3-5 jours',
    warrantyYears: 5
  },
  {
    id: 'pergola-construction',
    category: 'Structures',
    name: 'Construction de pergola',
    nameFr: 'Construction de pergola',
    description: 'Pergola en bois, aluminium ou vinyle',
    permitRequired: 'if attached to house',
    avgDuration: '2-4 jours',
    warrantyYears: 5
  },
  {
    id: 'outdoor-kitchen-plumbing',
    category: 'Cuisine extérieure',
    name: 'Plomberie pour cuisine extérieure',
    nameFr: 'Plomberie pour cuisine extérieure',
    description: 'Installation de plomberie pour évier, BBQ au gaz',
    avgDuration: '1-2 jours',
    crossSell: 'plomberie',
    permitRequired: true
  },
  {
    id: 'deck-refinishing',
    category: 'Entretien',
    name: 'Décapage et teinture de terrasse',
    nameFr: 'Décapage et teinture de terrasse',
    description: 'Décapage, sablage et nouvelle couche de teinture/scellant',
    avgDuration: '2-3 jours',
    seasonalPeak: ['spring', 'summer']
  },
  {
    id: 'deck-repair',
    category: 'Réparation',
    name: 'Réparation de terrasse',
    nameFr: 'Réparation de terrasse',
    description: 'Remplacement de planches, réparations structurelles',
    avgDuration: '1-3 jours',
    warrantyYears: 1
  },
  {
    id: '3d-visualization',
    category: 'Consultation',
    name: 'Visualisation 3D de projet',
    nameFr: 'Visualisation 3D de projet',
    description: 'Modélisation 3D avec HOVER pour visualiser le projet',
    hoverIntegration: true,
    avgDuration: '1-2 heures',
    includedInQuote: true
  }
];

/**
 * MAISON CASH - Real Estate Service Catalog
 */
export const REAL_ESTATE_SERVICES = [
  {
    id: 'cash-offer',
    category: 'Achat comptant',
    name: 'Offre d\'achat comptant',
    nameFr: 'Offre d\'achat comptant',
    description: 'Offre d\'achat rapide, paiement comptant sous 7 jours',
    timeline: '7-14 days',
    oaciqCompliant: true
  },
  {
    id: 'pre-listing-reno-package',
    category: 'Rénovation pré-vente',
    name: 'Programme "Prix de Vente Maximum"',
    nameFr: 'Programme "Prix de Vente Maximum"',
    description: 'Rénovations stratégiques pour maximiser prix de vente',
    targetROI: '1:1 to 1:1.5',
    typicalInvestment: '$10,000-$50,000',
    deferredPayment: true,
    timeline: '3-6 weeks',
    multiTradeCoordination: true
  },
  {
    id: 'home-inspection-coordination',
    category: 'Inspection',
    name: 'Coordination d\'inspection AIBQ',
    nameFr: 'Coordination d\'inspection AIBQ',
    description: 'Organisation d\'inspection par inspecteur AIBQ certifié',
    aibqCertified: true,
    reportTurnaround: '24-48 hours'
  },
  {
    id: 'repair-estimate-package',
    category: 'Évaluation',
    name: 'Forfait d\'estimation multi-métiers',
    nameFr: 'Forfait d\'estimation multi-métiers',
    description: 'Soumissions pour toutes réparations identifiées à l\'inspection',
    turnaround: '48-72 hours',
    multiTradeCoordination: true,
    oaciqCompliance: '3+ contractor options provided'
  },
  {
    id: 'renovation-roi-analysis',
    category: 'Consultation',
    name: 'Analyse ROI de rénovations',
    nameFr: 'Analyse ROI de rénovations',
    description: 'Évaluation professionnelle du retour sur investissement',
    reportIncluded: true,
    marketDataIntegration: 'Centris MLS'
  },
  {
    id: 'property-flipping-consultation',
    category: 'Consultation',
    name: 'Consultation revente rapide',
    nameFr: 'Consultation revente rapide',
    description: 'Stratégie complète pour achat-rénovation-revente',
    budgetPlanning: true,
    timelineOptimization: true,
    multiTradeCoordination: true
  },
  {
    id: 'deferred-payment-program',
    category: 'Financement',
    name: 'Paiement différé à la clôture',
    nameFr: 'Paiement différé à la clôture',
    description: 'Travaux payés par le vendeur lors de la vente',
    paymentSource: 'proceeds of sale',
    oaciqCompliant: true
  }
];

// ============================================================================
// DIVISION SERVICE COUNTS
// ============================================================================

export const DIVISION_SERVICE_COUNTS = {
  plomberie: 40,        // From services.ts
  construction: CONSTRUCTION_SERVICES.length,
  toitures: ROOFING_SERVICES.length,
  isolation: INSULATION_SERVICES.length,
  conteneurs: CONTAINER_SERVICES.length,
  gutters: GUTTER_SERVICES.length,
  decks: DECK_SERVICES.length,
  'real-estate': REAL_ESTATE_SERVICES.length
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getDivisionById(divisionId: DivisionType): Division | undefined {
  return DIVISIONS.find(d => d.id === divisionId);
}

export function getActiveDivisions(): Division[] {
  return DIVISIONS.filter(d => d.active);
}

export function getDivisionServices(divisionId: DivisionType): any[] {
  switch (divisionId) {
    case 'construction':
      return CONSTRUCTION_SERVICES;
    case 'toitures':
      return ROOFING_SERVICES;
    case 'isolation':
      return INSULATION_SERVICES;
    case 'conteneurs':
      return CONTAINER_SERVICES;
    case 'gutters':
      return GUTTER_SERVICES;
    case 'decks':
      return DECK_SERVICES;
    case 'real-estate':
      return REAL_ESTATE_SERVICES;
    case 'plomberie':
      // Import from services.ts
      return []; // TODO: Import SERVICE_CATEGORIES
    default:
      return [];
  }
}

export function getTotalServiceCount(): number {
  return Object.values(DIVISION_SERVICE_COUNTS).reduce((a, b) => a + b, 0);
}

export function getSeasonalServices(season: 'spring' | 'summer' | 'fall' | 'winter'): any[] {
  const allServices = [
    ...ROOFING_SERVICES,
    ...INSULATION_SERVICES,
    ...GUTTER_SERVICES,
    ...DECK_SERVICES
  ];
  
  return allServices.filter(s => 
    s.seasonalPeak && 
    (Array.isArray(s.seasonalPeak) 
      ? s.seasonalPeak.includes(season)
      : s.seasonalPeak === season)
  );
}

export function getEmergencyServices(): any[] {
  const allServices = [
    ...ROOFING_SERVICES,
    ...getDivisionServices('plomberie')
  ];
  
  return allServices.filter(s => s.emergencyService || s.responseTime);
}

export function getRenoclimatEligibleServices(): any[] {
  return INSULATION_SERVICES.filter(s => s.renoclimatEligible);
}

export function getPermitRequiredServices(): any[] {
  const allServices = [
    ...ROOFING_SERVICES,
    ...DECK_SERVICES,
    ...GUTTER_SERVICES
  ];
  
  return allServices.filter(s => s.permitRequired);
}