// 🔄 CRITICAL: SINGLE SOURCE OF TRUTH FOR ALL SERVICES
// This file is the MASTER SERVICE LIST for the Synergair x Groupe G. Lafrance Platform
// Plomberie Division Services (Plomberie Michaël Lacoste)
// ALL service forms must import from this file
// See: /SERVICE_SYNCHRONIZATION_MAP.md

import { AlertTriangle, Wrench, Hammer, Search, Droplet, Flame } from 'lucide-react';

export interface Service {
  value: string;
  label: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  icon: any;
  color: string;
  services: Service[];
}

/**
 * MASTER SERVICE CATEGORIES - 40 services across 8 categories
 * Last Updated: December 28, 2024
 * 
 * Used in:
 * - /src/app/pages/auth/Login.tsx (Public quote form)
 * - /src/app/pages/portal/NewClientRequest.tsx (Client portal)
 * - Any other service selection interfaces
 */
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'urgences',
    label: 'Urgences 24/7',
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-50',
    services: [
      { 
        value: 'fuites-eau-urgence', 
        label: 'Réparation de fuites (urgence)', 
        description: 'Réparation de fuites + actions préventives pour éviter les dégâts' 
      },
      { 
        value: 'debouchage-drains-urgence', 
        label: 'Débouchage et nettoyage de drains', 
        description: 'Élimination rapide des obstructions de drains' 
      },
      { 
        value: 'debouchage-toilettes-urgence', 
        label: 'Débouchage et nettoyage de toilettes', 
        description: 'Intervention possible < 60 minutes' 
      },
      { 
        value: 'debouchage-drains-francais-urgence', 
        label: 'Débouchage de drains français', 
        description: 'Débouchage/nettoyage de drains français en urgence' 
      },
      { 
        value: 'debouchage-drains-plancher-urgence', 
        label: 'Débouchage de drains de plancher', 
        description: 'Débouchage/nettoyage de drains de plancher' 
      },
      { 
        value: 'inspection-camera-urgence', 
        label: 'Inspection et rapport avec caméra', 
        description: 'Diagnostic + rapport par caméra en urgence' 
      },
    ],
  },
  {
    id: 'reparation',
    label: 'Réparation de plomberie',
    icon: Wrench,
    color: 'text-gray-900 bg-gray-50',
    services: [
      { 
        value: 'reparation-fuites', 
        label: 'Réparation fuites d\'eau', 
        description: 'Réparation rapide de fuites, bris, dysfonctionnements avec diagnostic et réparations durables' 
      },
      { 
        value: 'reparation-robinet', 
        label: 'Réparation de robinet', 
        description: 'Robinets qui fuient, réparation ou remplacement' 
      },
      { 
        value: 'reparation-toilette', 
        label: 'Réparation toilette', 
        description: 'Toilettes qui coulent ou bouchées' 
      },
      { 
        value: 'reparation-tuyaux', 
        label: 'Réparation de tuyaux', 
        description: 'Réparation ou remplacement de tuyauterie' 
      },
      { 
        value: 'reparation-entrees-eau', 
        label: 'Réparation entrées d\'eau', 
        description: 'Réparation d\'entrées d\'eau' 
      },
      { 
        value: 'entretien-preventif', 
        label: 'Entretien préventif', 
        description: 'Actions préventives pour éviter les dégâts futurs' 
      },
    ],
  },
  {
    id: 'installation',
    label: 'Installation de plomberie',
    icon: Hammer,
    color: 'text-gray-900 bg-gray-50',
    services: [
      { 
        value: 'installation-robinet', 
        label: 'Installation de robinet', 
        description: 'Installation professionnelle de robinets neufs' 
      },
      { 
        value: 'installation-toilette', 
        label: 'Installation toilette', 
        description: 'Installation complète de toilettes neuves' 
      },
      { 
        value: 'installation-douche', 
        label: 'Installation de douche', 
        description: 'Installation de nouvelle douche conforme aux normes' 
      },
      { 
        value: 'installation-cuisine', 
        label: 'Installation de plomberie cuisine', 
        description: 'Installation plomberie complète pour cuisine' 
      },
      { 
        value: 'installation-systeme-complet', 
        label: 'Installation système complet', 
        description: 'Système de plomberie complet de la planification à l\'exécution' 
      },
      { 
        value: 'installation-pompe-puisard', 
        label: 'Installation pompe de puisard', 
        description: 'Installation de pompe de puisard' 
      },
      { 
        value: 'installation-clapet-anti-retour', 
        label: 'Installation clapet anti-retour', 
        description: 'Installation pour prévenir les refoulements' 
      },
    ],
  },
  {
    id: 'renovation',
    label: 'Rénovation de plomberie',
    icon: Hammer,
    color: 'text-gray-900 bg-gray-50',
    services: [
      { 
        value: 'renovation-salle-bain', 
        label: 'Rénovation salle de bain', 
        description: 'Rénovation complète ou partielle de salle de bain' 
      },
      { 
        value: 'renovation-cuisine', 
        label: 'Rénovation cuisine', 
        description: 'Modernisation plomberie de cuisine' 
      },
      { 
        value: 'renovation-systeme-complet', 
        label: 'Rénovation système complet', 
        description: 'Modernisation complète du système de plomberie pour améliorer confort et efficacité' 
      },
    ],
  },
  {
    id: 'inspection',
    label: 'Inspection par caméra',
    icon: Search,
    color: 'text-gray-900 bg-gray-50',
    services: [
      { 
        value: 'inspection-camera', 
        label: 'Inspection de plomberie par caméra', 
        description: 'Inspection interne des canalisations avec caméras' 
      },
      { 
        value: 'inspection-egouts', 
        label: 'Inspection des égouts', 
        description: 'Détection de fissures/obstructions/problèmes cachés avec rapports et recommandations' 
      },
      { 
        value: 'evaluation-drainage', 
        label: 'Évaluation de drainage', 
        description: 'Inspection/évaluation du système de drainage et recommandations' 
      },
    ],
  },
  {
    id: 'debouchage',
    label: 'Débouchage',
    icon: Droplet,
    color: 'text-gray-900 bg-gray-50',
    services: [
      { 
        value: 'debouchage-drains', 
        label: 'Débouchage de drain', 
        description: 'Débouchage de drains avec équipements modernes (caméras/hydrojet)' 
      },
      { 
        value: 'debouchage-toilette', 
        label: 'Débouchage de toilette', 
        description: 'Débouchage de toilettes, résultats garantis' 
      },
      { 
        value: 'debouchage-salle-bain', 
        label: 'Débouchage de salle de bain', 
        description: 'Débouchage des installations de salle de bain, urgence 24/7' 
      },
      { 
        value: 'debouchage-evier', 
        label: 'Débouchage d\'évier', 
        description: 'Débouchage d\'éviers de cuisine ou salle de bain' 
      },
      { 
        value: 'debouchage-baignoire', 
        label: 'Débouchage de baignoire', 
        description: 'Débouchage de baignoires' 
      },
      { 
        value: 'debouchage-canalisation', 
        label: 'Débouchage de canalisation principale', 
        description: 'Débouchage de canalisation principale, service 24/7' 
      },
    ],
  },
  {
    id: 'drain-francais',
    label: 'Drain français',
    icon: Droplet,
    color: 'text-gray-900 bg-gray-50',
    services: [
      { 
        value: 'installation-drain-francais', 
        label: 'Installation drain français', 
        description: 'Installation de drains français pour évacuer l\'eau autour des fondations' 
      },
      { 
        value: 'reparation-drain-francais', 
        label: 'Réparation drain français', 
        description: 'Réparation de drains français pour prévenir l\'humidité et infiltrations' 
      },
      { 
        value: 'installation-drains-exterieurs', 
        label: 'Installation drains extérieurs', 
        description: 'Pose de drains autour des fondations pour canaliser l\'eau' 
      },
      { 
        value: 'installation-drains-interieurs', 
        label: 'Installation drains intérieurs', 
        description: 'Pose de drains à l\'intérieur du sous-sol/cave' 
      },
      { 
        value: 'maintenance-drain-francais', 
        label: 'Maintenance drain français', 
        description: 'Entretien/réparation du système de drainage pour efficacité optimale' 
      },
    ],
  },
  {
    id: 'chauffe-eau',
    label: 'Chauffe-eau',
    icon: Flame,
    color: 'text-orange-600 bg-orange-50',
    services: [
      { 
        value: 'installation-chauffe-eau', 
        label: 'Installation chauffe-eau', 
        description: 'Installation/remplacement sécuritaire de chauffe-eau (clé en main)' 
      },
      { 
        value: 'reparation-chauffe-eau', 
        label: 'Réparation chauffe-eau', 
        description: 'Réparation de chauffe-eau défectueux' 
      },
      { 
        value: 'entretien-chauffe-eau', 
        label: 'Entretien chauffe-eau', 
        description: 'Entretien préventif et vidange de chauffe-eau' 
      },
      { 
        value: 'remplacement-chauffe-eau', 
        label: 'Remplacement chauffe-eau', 
        description: 'Remplacement complet avec tests et conseils' 
      },
    ],
  },
];

/**
 * Get total number of services
 */
export const getTotalServices = (): number => {
  return SERVICE_CATEGORIES.reduce((total, category) => total + category.services.length, 0);
};

/**
 * Get service by value
 */
export const getServiceByValue = (value: string): Service | undefined => {
  for (const category of SERVICE_CATEGORIES) {
    const service = category.services.find(s => s.value === value);
    if (service) return service;
  }
  return undefined;
};

/**
 * Get category by ID
 */
export const getCategoryById = (id: string): ServiceCategory | undefined => {
  return SERVICE_CATEGORIES.find(cat => cat.id === id);
};

/**
 * Search services
 */
export const searchServices = (searchTerm: string): ServiceCategory[] => {
  if (!searchTerm) return SERVICE_CATEGORIES;

  return SERVICE_CATEGORIES.map(category => ({
    ...category,
    services: category.services.filter(service =>
      service.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.services.length > 0);
};