/**
 * Mock Data Generator
 *
 * Generates realistic mock data for the BET marketplace:
 * - 50+ plumbers with Quebec names and coordinates
 * - 100+ clients with Montreal addresses
 * - 200+ historical jobs
 * - Realistic compliance status, ratings, and subscriptions
 */

// Quebec first names (French)
const quebecFirstNames = [
  'Jean', 'Pierre', 'Marc', 'François', 'Michel', 'Alain', 'Daniel', 'Claude',
  'Jacques', 'André', 'Philippe', 'Robert', 'Luc', 'Yves', 'Gilles', 'Martin',
  'Sylvain', 'Denis', 'Paul', 'Richard', 'Bernard', 'Stéphane', 'Patrick', 'René',
  'Louis', 'Georges', 'Serge', 'Christian', 'Guy', 'Raymond', 'Roger', 'Benoît',
  'Éric', 'Bruno', 'Mathieu', 'Simon', 'David', 'Alexandre', 'Maxime', 'Nicolas',
  'Sébastien', 'Guillaume', 'Vincent', 'Gabriel', 'Julien', 'Antoine', 'Samuel',
  'Thomas', 'Olivier', 'Jonathan'
];

// Quebec last names
const quebecLastNames = [
  'Tremblay', 'Gagnon', 'Roy', 'Côté', 'Bouchard', 'Gauthier', 'Morin', 'Lavoie',
  'Fortin', 'Gagné', 'Ouellet', 'Pelletier', 'Bélanger', 'Lévesque', 'Bergeron',
  'Leblanc', 'Paquette', 'Beaulieu', 'Caron', 'Poulin', 'Fournier', 'Thibault',
  'Simard', 'Girard', 'Boucher', 'Cloutier', 'Lefebvre', 'Parent', 'Poirier',
  'Lapointe', 'Leclerc', 'Martel', 'Dub', 'Bédard', 'Rousseau', 'Lessard',
  'Turcotte', 'Martin', 'Deschamps', 'Paradis', 'Proulx', 'Vaillancourt',
  'Lacoste', 'Lafrance', 'Beaumont', 'Desjardins', 'Nadeau', 'Mercier', 'Dubois'
];

// Montreal street names
const montrealStreets = [
  'Rue Saint-Denis', 'Boulevard Saint-Laurent', 'Rue Sainte-Catherine',
  'Avenue du Parc', 'Rue Sherbrooke', 'Boulevard René-Lévesque', 'Rue Ontario',
  'Avenue des Pins', 'Rue Saint-Hubert', 'Rue Beaubien', 'Rue Jean-Talon',
  'Boulevard Pie-IX', 'Rue Papineau', 'Avenue du Mont-Royal', 'Rue Masson',
  'Rue Laurier', 'Rue Fleury', 'Rue Jarry', 'Boulevard Décarie', 'Rue Wellington',
  'Rue Notre-Dame', 'Rue Saint-Jacques', 'Boulevard Henri-Bourassa', 'Rue Hochelaga',
  'Avenue Christophe-Colomb', 'Rue Beaudry', 'Rue Amherst', 'Rue de Lanaudière',
  'Rue Berri', 'Rue Saint-André', 'Rue Rivard', 'Rue de Bordeaux', 'Rue Chapleau',
  'Avenue de Gaspé', 'Rue Clark', 'Rue Saint-Urbain', 'Rue Hutchison',
  'Rue Jeanne-Mance', 'Rue Saint-Dominique', 'Avenue Henri-Julien', 'Rue Drolet',
  'Rue de l\'Épée', 'Rue de la Roche', 'Rue Cartier', 'Rue Montcalm',
  'Rue Garnier', 'Rue Chambord', 'Rue Marquette', 'Rue Boyer', 'Rue Fullum'
];

// Montreal neighborhoods
const montrealNeighborhoods = [
  'Ville-Marie', 'Plateau Mont-Royal', 'Rosemont-La Petite-Patrie', 'Villeray',
  'Ahuntsic', 'Côte-des-Neiges', 'Notre-Dame-de-Grâce', 'Verdun', 'LaSalle',
  'Lachine', 'Saint-Laurent', 'Montréal-Nord', 'Anjou', 'Saint-Léonard',
  'Mercier', 'Hochelaga-Maisonneuve', 'Pointe-aux-Trembles', 'Rivière-des-Prairies',
  'Outremont', 'Westmount', 'Hampstead', 'Mont-Royal'
];

// Service types
const serviceTypes = [
  'Débouchage', 'Fuite d\'eau', 'Chauffe-eau', 'Robinetterie', 'Toilette',
  'Bain et douche', 'Lavabo', 'Évier', 'Drain', 'Tuyauterie', 'Urgence 24h'
];

/**
 * Generate a random number between min and max
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a random item from an array
 */
function randomPick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random Montreal coordinate
 * Montreal center: 45.5017° N, -73.5673° W
 * ±20km radius
 */
function randomMontrealCoordinate(): { lat: number; lng: number } {
  const centerLat = 45.5017;
  const centerLng = -73.5673;

  // ~1 degree = ~111km
  // 20km = ~0.18 degrees
  const radiusDegrees = 0.18;

  const lat = centerLat + (Math.random() - 0.5) * 2 * radiusDegrees;
  const lng = centerLng + (Math.random() - 0.5) * 2 * radiusDegrees;

  return {
    lat: Math.round(lat * 10000) / 10000,
    lng: Math.round(lng * 10000) / 10000,
  };
}

/**
 * Generate RBQ number (Quebec contractor license)
 * Format: 1234-5678-01
 */
function generateRBQNumber(): string {
  const part1 = randomInt(1000, 9999);
  const part2 = randomInt(1000, 9999);
  const part3 = String(randomInt(10, 99)).padStart(2, '0');
  return `${part1}-${part2}-${part3}`;
}

/**
 * Generate Quebec postal code
 * Format: H1A 1A1
 */
function generatePostalCode(): string {
  const letters = 'ABCDEFGHJKLMNPRSTVWXYZ';
  const digits = '0123456789';

  const l1 = 'H'; // Montreal postal codes start with H
  const d1 = digits[Math.floor(Math.random() * digits.length)];
  const l2 = letters[Math.floor(Math.random() * letters.length)];
  const d2 = digits[Math.floor(Math.random() * digits.length)];
  const l3 = letters[Math.floor(Math.random() * letters.length)];
  const d3 = digits[Math.floor(Math.random() * digits.length)];

  return `${l1}${d1}${l2} ${d2}${l3}${d3}`;
}

/**
 * Generate phone number
 * Format: (514) 555-0123
 */
function generatePhone(): string {
  const areaCode = randomPick(['514', '438', '450']);
  const exchange = randomInt(200, 999);
  const lineNumber = String(randomInt(0, 9999)).padStart(4, '0');
  return `(${areaCode}) ${exchange}-${lineNumber}`;
}

/**
 * Generate email from name
 */
function generateEmail(firstName: string, lastName: string, domain: string = 'plomberie.com'): string {
  const first = firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const last = lastName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return `${first}.${last}@${domain}`;
}

/**
 * Generate a random date within a range
 */
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate UUID-like ID
 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generate 50+ plumbers
 */
export function generatePlumbers(count: number = 50) {
  const plumbers = [];
  const subscriptionTiers = ['bronze', 'silver', 'gold'];
  const subscriptionDistribution = [0.3, 0.5, 0.2]; // 30% bronze, 50% silver, 20% gold

  for (let i = 0; i < count; i++) {
    const firstName = randomPick(quebecFirstNames);
    const lastName = randomPick(quebecLastNames);
    const email = generateEmail(firstName, lastName);
    const coords = randomMontrealCoordinate();

    // Subscription tier (weighted random)
    let tier: string;
    const rand = Math.random();
    if (rand < 0.3) tier = 'bronze';
    else if (rand < 0.8) tier = 'silver';
    else tier = 'gold';

    // 80% compliant, 20% missing/expired docs
    const isCompliant = Math.random() > 0.2;
    const expiredDocs = !isCompliant ? randomPick(['CNESST', 'CCQ', 'RQ']) : null;

    // Rating: 3.5-5.0 stars with normal distribution towards 4.5
    const rating = Math.max(3.5, Math.min(5.0, 4.5 + (Math.random() - 0.5)));

    const plumber = {
      id: generateId(),
      userId: generateId(),
      firstName,
      lastName,
      businessName: `${lastName} Plomberie`,
      email,
      phone: generatePhone(),
      rbqNumber: generateRBQNumber(),
      coordinates: coords,
      address: {
        street: `${randomInt(100, 9999)} ${randomPick(montrealStreets)}`,
        neighborhood: randomPick(montrealNeighborhoods),
        city: 'Montréal',
        province: 'QC',
        postalCode: generatePostalCode(),
      },
      subscription: {
        tier,
        startDate: randomDate(new Date('2024-01-01'), new Date()),
        trialEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        status: Math.random() > 0.1 ? 'active' : 'trial',
      },
      preferences: {
        acceptUrgent: Math.random() > 0.3,
        workingHours: {
          start: '08:00',
          end: '18:00',
        },
        serviceTypes: Array.from(
          { length: randomInt(3, 7) },
          () => randomPick(serviceTypes)
        ).filter((v, i, a) => a.indexOf(v) === i), // unique
        distanceRadius: randomPick([25, 50, 75, 100]),
        languages: randomPick([
          ['fr'],
          ['fr', 'en'],
          ['en', 'fr'],
        ]),
      },
      complianceStatus: {
        isCompliant,
        documents: {
          CNESST: {
            status: expiredDocs === 'CNESST' ? 'expired' : 'valid',
            expiryDate: expiredDocs === 'CNESST'
              ? new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
              : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
          },
          CCQ: {
            status: expiredDocs === 'CCQ' ? 'expired' : 'valid',
            expiryDate: expiredDocs === 'CCQ'
              ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
              : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          },
          RQ: {
            status: expiredDocs === 'RQ' ? 'expired' : 'valid',
            expiryDate: expiredDocs === 'RQ'
              ? new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
              : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          },
          RBQ: {
            status: 'valid',
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          },
          liability_insurance: {
            status: 'valid',
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        },
        lastChecked: new Date(),
      },
      rating: {
        average: Math.round(rating * 10) / 10,
        count: randomInt(5, 200),
        distribution: {
          5: randomInt(50, 90),
          4: randomInt(5, 30),
          3: randomInt(0, 10),
          2: randomInt(0, 5),
          1: randomInt(0, 2),
        },
      },
      stats: {
        jobsCompleted: randomInt(10, 500),
        completionRate: Math.round((0.9 + Math.random() * 0.09) * 100) / 100,
        responseTime: randomInt(10, 120), // minutes
        repeatCustomerRate: Math.round((0.2 + Math.random() * 0.5) * 100) / 100,
      },
      createdAt: randomDate(new Date('2023-01-01'), new Date()),
      active: Math.random() > 0.05, // 95% active
    };

    plumbers.push(plumber);
  }

  return plumbers;
}

/**
 * Generate 100+ clients
 */
export function generateClients(count: number = 100) {
  const clients = [];

  for (let i = 0; i < count; i++) {
    const firstName = randomPick(quebecFirstNames);
    const lastName = randomPick(quebecLastNames);
    const email = generateEmail(firstName, lastName, 'gmail.com');
    const coords = randomMontrealCoordinate();

    const client = {
      id: generateId(),
      firstName,
      lastName,
      email,
      phone: generatePhone(),
      address: {
        street: `${randomInt(100, 9999)} ${randomPick(montrealStreets)}`,
        apt: Math.random() > 0.6 ? `App. ${randomInt(1, 50)}` : undefined,
        neighborhood: randomPick(montrealNeighborhoods),
        city: 'Montréal',
        province: 'QC',
        postalCode: generatePostalCode(),
        coordinates: coords,
      },
      languagePreference: randomPick(['fr', 'en', 'fr,en']),
      createdAt: randomDate(new Date('2022-01-01'), new Date()),
      totalSpent: randomInt(100, 5000),
      jobsCount: randomInt(1, 15),
    };

    clients.push(client);
  }

  return clients;
}

/**
 * Generate 200+ historical jobs
 */
export function generateHistoricalJobs(
  count: number,
  plumbers: any[],
  clients: any[]
) {
  const jobs = [];
  const statuses = ['completed', 'paid', 'closed', 'cancelled'];

  for (let i = 0; i < count; i++) {
    const client = randomPick(clients);
    const plumber = randomPick(plumbers);
    const serviceType = randomPick(serviceTypes);
    const urgency = Math.random() > 0.7 ? 'urgent' : 'normal';
    const status = randomPick(statuses);

    const createdAt = randomDate(new Date('2023-01-01'), new Date());
    const suggestedPrice = randomInt(150, 800);
    const finalAmount = Math.round(suggestedPrice * (0.85 + Math.random() * 0.30));

    const job = {
      id: `JOB-${Date.now()}-${i}`,
      clientId: client.id,
      plumberId: status !== 'cancelled' ? plumber.id : undefined,
      title: `${serviceType} - ${client.address.neighborhood}`,
      description: `Service requis: ${serviceType}. ${
        urgency === 'urgent' ? 'URGENT - ' : ''
      }Intervention professionnelle nécessaire.`,
      serviceType,
      urgency,
      status,
      address: client.address.street,
      coordinates: client.address.coordinates,
      suggestedPrice,
      finalAmount: status !== 'cancelled' ? finalAmount : undefined,
      createdAt,
      completedAt: status !== 'cancelled'
        ? new Date(createdAt.getTime() + randomInt(1, 8) * 60 * 60 * 1000)
        : undefined,
      paidAt: ['paid', 'closed'].includes(status)
        ? new Date(createdAt.getTime() + randomInt(8, 24) * 60 * 60 * 1000)
        : undefined,
      duration: status !== 'cancelled' ? randomInt(30, 240) : undefined, // minutes
      rating: status === 'closed' ? randomInt(3, 5) : undefined,
    };

    jobs.push(job);
  }

  return jobs;
}

/**
 * Generate all mock data
 */
export function generateAllMockData() {
  console.log('🔄 Generating mock data...');

  const plumbers = generatePlumbers(50);
  console.log(`✅ Generated ${plumbers.length} plumbers`);

  const clients = generateClients(100);
  console.log(`✅ Generated ${clients.length} clients`);

  const historicalJobs = generateHistoricalJobs(200, plumbers, clients);
  console.log(`✅ Generated ${historicalJobs.length} historical jobs`);

  // Generate active demo jobs for immediate testing
  const activeDemoJobs = generateActiveDemoJobs(clients, 5);
  console.log(`✅ Generated ${activeDemoJobs.length} active demo jobs for BET marketplace`);

  return {
    plumbers,
    clients,
    jobs: [...historicalJobs, ...activeDemoJobs],
    bids: [],
    payments: [],
    complianceDocuments: [],
    aftersalesClaims: [],
    ratings: [],
    subscriptions: [],
    notifications: [],
    internalAlerts: [],
    creditNotes: [],
  };
}

/**
 * Generate active demo jobs ready for bidding
 */
function generateActiveDemoJobs(clients: any[], count: number = 5): any[] {
  const jobs: any[] = [];
  const now = new Date();

  const demoJobTemplates = [
    {
      description: "Fuite d'eau importante sous l'évier de cuisine. L'eau coule constamment et nécessite une intervention rapide.",
      urgency: 'urgent',
      estimatedPrice: 250,
      estimatedDuration: 60,
      biddingMinutes: 5,
    },
    {
      description: "Installation d'un nouveau chauffe-eau électrique 40 gallons. Le client a déjà acheté l'appareil.",
      urgency: 'normal',
      estimatedPrice: 600,
      estimatedDuration: 180,
      biddingMinutes: 120,
    },
    {
      description: "Débouchage urgent de toilette principale. La maison n'a qu'une seule salle de bain.",
      urgency: 'urgent',
      estimatedPrice: 200,
      estimatedDuration: 45,
      biddingMinutes: 5,
    },
    {
      description: "Réparation de robinet qui goutte constamment. Problème dans la salle de bain principale.",
      urgency: 'normal',
      estimatedPrice: 150,
      estimatedDuration: 60,
      biddingMinutes: 120,
    },
    {
      description: "Installation de clapet anti-retour pour conformité municipale. Inspection prévue dans 2 semaines.",
      urgency: 'normal',
      estimatedPrice: 400,
      estimatedDuration: 120,
      biddingMinutes: 120,
    },
  ];

  for (let i = 0; i < Math.min(count, demoJobTemplates.length); i++) {
    const template = demoJobTemplates[i];
    const client = randomPick(clients);
    const jobId = `JOB-${Date.now() + i}-${randomString(4).toUpperCase()}`;

    const biddingStartTime = new Date(now.getTime() - Math.random() * 60000); // Started 0-1 min ago
    const biddingEndTime = new Date(biddingStartTime.getTime() + template.biddingMinutes * 60 * 1000);

    const job = {
      id: jobId,
      clientId: client.id,
      clientName: `${client.firstName} ${client.lastName}`,
      description: template.description,
      originalDescription: template.description,
      address: client.address,
      coordinates: client.coordinates,
      urgency: template.urgency,
      estimatedPrice: template.estimatedPrice,
      estimatedDuration: template.estimatedDuration,
      status: 'in_bet',
      biddingStartTime,
      biddingEndTime,
      photos: [], // No photos for demo
      timeSlots: template.urgency === 'normal' ? [
        {
          date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '09:00',
          endTime: '12:00',
        },
        {
          date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '13:00',
          endTime: '17:00',
        },
      ] : [],
      languagePreference: 'french',
      requiresInsurance: true,
      requiresRBQ: true,
      paymentPreauthorized: true,
      cardLast4: '4242',
      createdAt: new Date(now.getTime() - Math.random() * 3600000), // Created 0-1 hour ago
      approvedBy: 'admin-1',
      approvedAt: biddingStartTime,
    };

    jobs.push(job);
  }

  return jobs;
}
