// Enriched operator context data gathered from MCP sources:
// - wikipedia-mcp (article summaries, page IDs)
// - google-ai-mode (AI summaries with citations, fleet/operations detail)
// - wikimedia-image-search (Commons images with licensing)
//
// This file is keyed by operator slug (slugified name) and merged with
// manifest data at runtime by useHelicopterOperators.

import type {
  OperatorCategory,
  HiringCampaign,
  TieredRequirements,
  TrainingInfo,
  LifestyleInfo,
  ProgressionInfo,
  QualityInfo,
  MarketStatus,
} from './types';

export interface WikimediaImage {
  url: string;
  caption: string;
  license: string;
  licenseUrl: string;
  artist: string;
  width: number;
  height: number;
}

export interface EnrichmentSource {
  title: string;
  url: string;
}

export interface OperatorEnrichment {
  /** Operator slug (matches slugify(name) in the hook) */
  slug: string;
  /** Display name (matches manifest entry name) */
  name: string;
  /** ISO country slug (matches manifest country field) */
  country: string;
  category: OperatorCategory;

  /** Short description for cards / tooltips */
  description: string;
  /** Longer summary paragraph for detail pages */
  summary: string;

  /** Wikipedia article reference */
  wikipedia: {
    pageId: number;
    title: string;
    url: string;
    excerpt: string;
  } | null;

  /** Google AI Mode summary */
  aiSummary: {
    text: string;
    sources: EnrichmentSource[];
  } | null;

  /** Google AI Mode hiring/requirements summary */
  aiHiringSummary: {
    text: string;
    sources: EnrichmentSource[];
  } | null;

  /** Fleet aircraft types */
  fleet: string[];

  /** Operational bases / hubs */
  bases: string[];

  /** Key services / specializations */
  services: string[];

  /** Career pathway info for pilots */
  career: {
    hiringStatus: MarketStatus;
    pilotTypes: string[];
    pathways: string[];
    notes: string;
  };

  // --- NEW: Full pilot-centric data ---

  /** Active hiring campaigns and open roles */
  hiring: HiringCampaign | null;

  /** Tiered minimum requirements by role (cadet / FO / captain) */
  requirements: TieredRequirements | null;

  /** Training and bonding information */
  training: TrainingInfo | null;

  /** Lifestyle and compensation */
  lifestyle: LifestyleInfo | null;

  /** Career progression information */
  progression: ProgressionInfo | null;

  /** Quality and risk signals */
  quality: QualityInfo | null;

  /** Wikimedia Commons images (aircraft, logos, operations) */
  wikimediaImages: WikimediaImage[];

  /** Official website (if known beyond manifest) */
  website?: string;

  /** Founded year */
  founded?: number;

  /** Parent company / ownership */
  parentCompany?: string;
}

export const operatorEnrichment: Record<string, OperatorEnrichment> = {
  // === AUSTRALIA ===

  'royal-flying-doctor-service': {
    slug: 'royal-flying-doctor-service',
    name: 'Royal Flying Doctor Service',
    country: 'australia',
    category: 'air_ambulance',
    description:
      'Australia\u2019s iconic aeromedical retrieval service, providing emergency medical transport and primary healthcare to remote communities since 1928.',
    summary:
      'The Royal Flying Doctor Service (RFDS) is a non-profit aeromedical retrieval service providing urgent emergency medical transport and primary healthcare to rural and remote Australia. Founded in 1928 by John Flynn, it operates a mixed fleet of fixed-wing aircraft and helicopters. The WA section operates the Fortescue Heli-Med Service with two Airbus EC145/H145 helicopters based at Jandakot Airport, serving a 250km radius with direct hospital rooftop access.',
    wikipedia: {
      pageId: 1033979,
      title: 'Royal Flying Doctor Service',
      url: 'https://en.wikipedia.org/wiki/Royal_Flying_Doctor_Service',
      excerpt:
        'The Royal Flying Doctor Service (RFDS), commonly known as the Flying Doctor, is an aeromedical retrieval service in Australia. It is a non-profit organisation that provides urgent and emergency medical transport for patients in rural and remote areas.',
    },
    aiSummary: {
      text: 'The RFDS WA section operates the Fortescue Heli-Med Service with two specialized Airbus EC145/H145 helicopters based at Jandakot Airport, Perth. They serve a 250km radius with direct hospital rooftop landings at Perth Children\u2019s Hospital, Fiona Stanley Hospital, and Royal Perth Hospital. The helicopters are uniquely fitted to power intensive care neonatal cots for critical infant retrievals.',
      sources: [
        {
          title: 'Our Fleet - Royal Flying Doctor Service',
          url: 'https://www.flyingdoctor.org.au/about-the-rfds/our-fleet/',
        },
        {
          title: 'RFDS Western Australia',
          url: 'https://www.flyingdoctor.org.au/wa/',
        },
        {
          title: 'RFDS SA/NT Fleet',
          url: 'https://www.flyingdoctor.org.au/sant/about/our-fleet/',
        },
      ],
    },
    fleet: ['Airbus EC145 (H145)', 'Pilatus PC-12', 'Pilatus PC-24'],
    bases: ['Jandakot Airport, Perth (WA)', 'Broome (WA)', 'Port Hedland (WA)'],
    services: [
      'Aeromedical retrieval',
      'HEMS / Helicopter Emergency Medical Services',
      'Neonatal transport',
      'Primary healthcare',
      'Search and Rescue',
    ],
    aiHiringSummary: {
      text: 'RFDS hiring varies by section. WA Operations (EC145): 1,500h total, 1,000h PIC, ~100h night, ~100h instrument. South Eastern Section (AW139): 2,500h total, 2,000h command, 500h multi-engine command, 100h night/instrument. Requires CASA CPL-H or ATPL, MECIR, Class 1 Medical. Australian work rights required. "Close to hours" rule encourages pilots slightly short of minimums to apply. RAMP mentoring program available for lower-hour pilots.',
      sources: [
        { title: 'Become a pilot - RFDS WA', url: 'https://www.flyingdoctor.org.au/wa/workwithus/your-career-rfds-wa/becomeapilot/' },
        { title: 'Pilot careers - RFDS Queensland', url: 'https://www.flyingdoctor.org.au/qld/careers/become-rfds-pilots/' },
        { title: 'Line Pilot job posting', url: 'https://www.flyingdoctor.org.au/careers/job/8RCR4A-line-pilot-various-locations/' },
      ],
    },
    career: {
      hiringStatus: 'accepting',
      pilotTypes: ['Helicopter Pilot', 'Fixed-Wing Pilot', 'Flight Nurse'],
      pathways: [
        'EMS / HEMS Pilot Track',
        'Aeromedical Retrieval Pilot',
        'Remote Area Aviation',
        'RAMP Mentoring Program (low-time pathway)',
      ],
      notes:
        'RFDS recruits rotary-wing pilots with EMS/SAR experience. "Close to hours" rule — if slightly short of minimums but strong single-pilot and night experience, encouraged to apply. RAMP mentoring program assists lower-hour pilots (1,500h). Flight nurses require critical care qualifications.',
    },
    hiring: {
      intakeType: 'rolling',
      applicationUrl: 'https://www.flyingdoctor.org.au/careers/',
      activeRoles: [
        {
          title: 'Line Pilot (Helicopter - WA Operations)',
          base: 'Jandakot Airport, Perth',
          seat: 'captain',
          aircraftType: 'Airbus EC145 (H145)',
          minTotalHours: 1500,
          minRotaryHours: 1000,
          minPicHours: 1000,
          minMultiEngineHours: 200,
          minNightHours: 100,
          minInstrumentHours: 100,
          typeRatingRequired: [],
          typeRatingProvided: true,
          count: 2,
          postedDate: '2025-01-15',
          applicationUrl: 'https://www.flyingdoctor.org.au/careers/',
        },
        {
          title: 'Line Pilot (Helicopter - South Eastern Section)',
          base: 'Various, SE Australia',
          seat: 'captain',
          aircraftType: 'Leonardo AW139',
          minTotalHours: 2500,
          minRotaryHours: 2000,
          minPicHours: 2000,
          minMultiEngineHours: 500,
          minNightHours: 100,
          minInstrumentHours: 100,
          typeRatingRequired: ['AW139'],
          typeRatingProvided: true,
          count: 1,
          postedDate: '2025-01-15',
          applicationUrl: 'https://www.flyingdoctor.org.au/careers/',
        },
      ],
      totalOpenPositions: 3,
      lastUpdated: '2025-07-11',
    },
    requirements: {
      firstOfficer: {
        minTotalHours: 1500,
        minRotaryHours: 1000,
        minPicHours: 1000,
        minMultiEngineHours: 200,
        minNightHours: 100,
        minInstrumentHours: 100,
        requiredRatings: ['CPL(H)', 'MECIR'],
        requiredTypeRatings: [],
        preferredTypeRatings: ['EC145', 'AW139'],
        medicalClass: 'Class 1',
        englishLevel: 'ICAO Level 4',
        citizenshipRequirements: ['Australian citizen', 'Permanent Resident', 'Valid work visa'],
        visaSponsorship: 'limited',
        additionalRequirements: [
          'Single-pilot charter experience heavily favored',
          'Remote area operations experience desirable',
          'Aeromedical or emergency services background highly desirable',
        ],
      },
      captain: {
        minTotalHours: 2500,
        minRotaryHours: 2000,
        minPicHours: 2000,
        minMultiEngineHours: 500,
        minNightHours: 100,
        minInstrumentHours: 100,
        requiredRatings: ['ATPL(H)', 'MECIR'],
        requiredTypeRatings: ['AW139'],
        preferredTypeRatings: ['EC145'],
        medicalClass: 'Class 1',
        englishLevel: 'ICAO Level 4',
        citizenshipRequirements: ['Australian citizen', 'Permanent Resident', 'Valid work visa'],
        visaSponsorship: 'limited',
        additionalRequirements: [
          'Multi-engine command experience',
          'Aeromedical retrieval experience',
          'Current IPC (Instrument Proficiency Check)',
        ],
      },
    },
    training: {
      typeRatingProvided: true,
      bondPeriod: '2 years',
      bondAmount: 'Not published',
      trainingLocation: 'Section-specific bases',
      trainingDuration: '4-8 weeks',
      cadetProgram: true,
      cadetProgramDetails: 'RAMP (RFDS Aircrew Mentoring Program) for lower-hour pilots around 1,500h total. Provides structured pathway to HEMS operations.',
      mentoringProgram: true,
      mentoringProgramDetails: 'RAMP provides mentoring for fixed-wing pathways; helicopter pilots use regional charter roles to build hours before recruitment.',
      selfSponsoredAccepted: false,
    },
    lifestyle: {
      rosterPattern: '4-on-4-off / variable',
      baseType: 'permanent',
      seasonality: 'year_round',
      compensationRange: { min: 110000, max: 180000, currency: 'AUD', period: 'annual' },
      includesPerDiem: true,
      includesAccommodation: false,
      includesTravel: true,
      superannuation: true,
      description: 'Permanent bases with 24/7 aeromedical readiness. Roster varies by section — WA Heli-Med operates scheduled shifts with on-call elements. Competitive compensation with superannuation and travel allowances.',
    },
    progression: {
      foToCaptainYears: '3-5 years',
      foToCaptainTypical: 4,
      upgradePathways: ['Line Pilot → Senior Line Pilot → Check Pilot → Chief Pilot'],
      treTriAvailable: true,
      treTriYears: '5-7 years',
      managementPathway: true,
      crossCategoryTransitions: ['Fixed-wing to rotary (WA section)', 'Charter to HEMS', 'SAR to HEMS'],
      description: 'Clear progression from line pilot to check/training roles. Management pathway to Chief Pilot. Cross-category transitions available between fixed-wing and rotary depending on section.',
    },
    quality: {
      safetyRecord: 'Excellent — one of Australia\u2019s safest aeromedical operators with rigorous safety management system',
      safetyRating: 'excellent',
      fleetAgeRange: 'Modern fleet (PC-12/PC-24 new, EC145 relatively new)',
      averageFleetAge: 8,
      growthStatus: 'expanding',
      growthDescription: 'Expanding rotary-wing operations, particularly WA Heli-Med Service. Growing fleet with PC-24 additions.',
      pilotTurnover: 'low',
      unionized: false,
      pilotReviewsCount: 0,
      certifications: ['CASA AOC', 'SMS Level 3', 'ISO 9001'],
    },
    wikimediaImages: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Royal_Flying_Doctor_Service_%28VH-FGT%29_Pilatus_PC-12-45_at_Sydney_Airport.jpg/330px-Royal_Flying_Doctor_Service_%28VH-FGT%29_Pilatus_PC-12-45_at_Sydney_Airport.jpg',
        caption: 'RFDS Pilatus PC-12-45 at Sydney Airport',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        artist: 'YSSYguy',
        width: 3888,
        height: 2592,
      },
    ],
    website: 'https://www.flyingdoctor.org.au',
    founded: 1928,
  },

  // === INDIA ===

  'pawan-hans': {
    slug: 'pawan-hans',
    name: 'Pawan Hans Limited',
    country: 'india',
    category: 'helicopter',
    description:
      'India\u2019s state-run helicopter operator and largest helicopter service provider in South Asia, with 47+ aircraft serving offshore, VIP, pilgrimage, and SAR missions.',
    summary:
      'Pawan Hans Limited (PHL) is a central public sector undertaking under India\u2019s Ministry of Civil Aviation. Founded in 1985 as Helicopter Corporation of India, it operates 47+ helicopters from 19+ bases across India. PHL is the primary offshore logistics partner for ONGC, operates heli-pilgrimage services to Kedarnath and Amarnath, and serves regional connectivity under RCS UDAN. The company recently secured a \u20b92,141 crore contract with ONGC for HAL Dhruv NG helicopters.',
    wikipedia: {
      pageId: 6955984,
      title: 'Pawan Hans',
      url: 'https://en.wikipedia.org/wiki/Pawan_Hans',
      excerpt:
        'Pawan Hans Limited (PHL) is a transport service operated as a central public sector undertaking based at Noida in Delhi NCR, India. It is a Mini Ratna-I category PSU under the ownership of Ministry of Civil Aviation of the Government of India.',
    },
    aiSummary: {
      text: 'Pawan Hans operates a diverse fleet of 43-47 helicopters including Airbus Dauphin 365N/N3 (offshore backbone), Mil Mi-172 (heavy-lift), HAL Dhruv/Dhruv NG (indigenous ALH), Sikorsky S-76D (VIP/offshore), Bell 407/412/206L4 (utility), and AS-350B3 Ecureuil (high-altitude). Key operations include offshore logistics for ONGC, RCS UDAN regional connectivity, heli-pilgrimage to Kedarnath/Amarnath, VIP charters, and SAR. PHL operates a certified MRO facility in Mumbai.',
      sources: [
        {
          title: 'Pawan Hans Official Website',
          url: 'https://www.pawanhans.co.in/english/index.aspx',
        },
        {
          title: 'About Us - Pawan Hans',
          url: 'https://www.pawanhans.co.in/english/inner.aspx?status=1&menu_id=35',
        },
        {
          title: 'Pawan Hans Airbus Helicopters MRO Collaboration',
          url: 'https://www.pawanhans.co.in/english/Press_Release8.aspx',
        },
      ],
    },
    fleet: [
      'Airbus AS365 Dauphin N/N3',
      'Mil Mi-172',
      'HAL Dhruv / Dhruv NG',
      'Sikorsky S-76D',
      'Bell 407',
      'Bell 412',
      'Bell 206L4',
      'AS-350B3 Ecureuil',
    ],
    bases: [
      'Rohini Heliport, New Delhi',
      'Juhu Aerodrome, Mumbai',
      'Guwahati',
      '19+ operational bases across India',
    ],
    services: [
      'Offshore oil & gas logistics (ONGC)',
      'Heli-pilgrimage (Kedarnath, Amarnath, Vaishno Devi)',
      'RCS UDAN regional connectivity',
      'VIP & state government charters',
      'Search and Rescue (SAR)',
      'Air ambulance',
      'MRO services',
    ],
    aiHiringSummary: {
      text: 'Pawan Hans recruits in 7 tiers: Fresh Pilot (150h, max 30y), Pilot A (500h, max 30y), Pilot B/E-2 (1,000h, max 35y), Pilot C/E-3 (2,000h, max 35y), Captain A/E-4 (3,000h + 1,000h PIC, max 45y), Captain B/E-5 (4,000h + 2,000h PIC, max 45y), Captain C/E-6 (5,000h + 3,000h PIC, max 50y). Requires DGCA CHPL/ATPL(H), Class 1 Medical, FRTO/RTR. Cadet scheme available. Type endorsement training costs \u20b925-50 Lakhs with 10-year service bond up to \u20b925.50 Lakhs. Fresh pilots start at \u20b915,000/mo stipend, upgrading to \u20b91,00,000/mo as Junior Pilots after 500h.',
      sources: [
        { title: 'Pawan Hans Career - Fresh Pilot', url: 'https://www.pawanhans.co.in/english/CareerDetailsN.aspx?id=2422' },
        { title: 'Pawan Hans Career - Experienced', url: 'https://www.pawanhans.co.in/english/CareerDetailsN.aspx?id=2421' },
        { title: 'Pawan Hans Career Details', url: 'https://www.pawanhans.co.in/english/CareerDetailsN.aspx?id=1171' },
      ],
    },
    career: {
      hiringStatus: 'open',
      pilotTypes: [
        'Helicopter Pilot (rotary-wing)',
        'Co-Pilot',
        'Test Pilot',
        'Flight Instructor',
      ],
      pathways: [
        'Offshore O&G Pilot Track',
        'Pilgrimage / High-Altitude Pilot',
        'VIP Charter Pilot',
        'IAF Transition Pathway (MoU with Indian Air Force)',
        'Cadet / Fresh Pilot Scheme',
      ],
      notes:
        'PHL accepts IAF pilots nearing retirement via MoU. DGCA CPL(H) required. 7-tier career structure from Fresh Pilot (150h) to Captain C (5,000h). Type endorsement training costs \u20b925-50L with 10-year bond. Cadet scheme available for fresh CPL holders.',
    },
    hiring: {
      intakeType: 'rolling',
      applicationUrl: 'https://www.pawanhans.co.in/english/index.aspx',
      activeRoles: [
        {
          title: 'Fresh Pilot (Cadet)',
          base: 'Various (training at Juhu/Rohini)',
          seat: 'cadet',
          aircraftType: 'Various (type endorsement)',
          minTotalHours: 150,
          minRotaryHours: 150,
          minPicHours: 0,
          minMultiEngineHours: 0,
          typeRatingRequired: [],
          typeRatingProvided: true,
          count: 10,
          postedDate: '2025-01-01',
          applicationUrl: 'https://www.pawanhans.co.in/english/CareerDetailsN.aspx?id=2422',
        },
        {
          title: 'Pilot B (E-2) - Co-Pilot',
          base: 'Juhu Aerodrome, Mumbai / Rohini, Delhi',
          seat: 'first_officer',
          aircraftType: 'AS365 Dauphin / Mi-172',
          minTotalHours: 1000,
          minRotaryHours: 1000,
          minPicHours: 200,
          minMultiEngineHours: 100,
          typeRatingRequired: [],
          typeRatingProvided: true,
          count: 5,
          postedDate: '2025-01-01',
          applicationUrl: 'https://www.pawanhans.co.in/english/CareerDetailsN.aspx?id=2421',
        },
        {
          title: 'Captain A (E-4) - Offshore',
          base: 'Juhu Aerodrome, Mumbai',
          seat: 'captain',
          aircraftType: 'AS365 Dauphin / HAL Dhruv',
          minTotalHours: 3000,
          minRotaryHours: 3000,
          minPicHours: 1000,
          minMultiEngineHours: 500,
          typeRatingRequired: ['AS365 Dauphin'],
          typeRatingProvided: false,
          count: 3,
          postedDate: '2025-01-01',
          applicationUrl: 'https://www.pawanhans.co.in/english/CareerDetailsN.aspx?id=2421',
        },
      ],
      totalOpenPositions: 18,
      lastUpdated: '2025-07-11',
    },
    requirements: {
      cadet: {
        minTotalHours: 150,
        minRotaryHours: 150,
        minPicHours: 0,
        minMultiEngineHours: 0,
        requiredRatings: ['CHPL'],
        requiredTypeRatings: [],
        preferredTypeRatings: [],
        medicalClass: 'Class 1',
        englishLevel: 'ICAO Level 4',
        maxAge: 30,
        citizenshipRequirements: ['Indian citizen'],
        visaSponsorship: 'not_available',
        additionalRequirements: [
          'Valid DGCA CHPL',
          'Valid FRTO and RTR certificates',
          'Incident/accident-free flying record',
          'Application fee \u20b9295',
        ],
      },
      firstOfficer: {
        minTotalHours: 1000,
        minRotaryHours: 1000,
        minPicHours: 200,
        minMultiEngineHours: 100,
        requiredRatings: ['CHPL'],
        requiredTypeRatings: [],
        preferredTypeRatings: ['AS365 Dauphin', 'Mi-172', 'HAL Dhruv'],
        medicalClass: 'Class 1',
        englishLevel: 'ICAO Level 4',
        maxAge: 35,
        citizenshipRequirements: ['Indian citizen'],
        visaSponsorship: 'not_available',
        additionalRequirements: [
          'Valid DGCA CHPL',
          'Valid FRTO and RTR certificates',
          'Incident/accident-free flying record',
        ],
      },
      captain: {
        minTotalHours: 3000,
        minRotaryHours: 3000,
        minPicHours: 1000,
        minMultiEngineHours: 500,
        requiredRatings: ['CHPL', 'ATPL(H)'],
        requiredTypeRatings: ['AS365 Dauphin'],
        preferredTypeRatings: ['HAL Dhruv', 'Sikorsky S-76D', 'Mi-172'],
        medicalClass: 'Class 1',
        englishLevel: 'ICAO Level 4',
        maxAge: 45,
        citizenshipRequirements: ['Indian citizen'],
        visaSponsorship: 'not_available',
        additionalRequirements: [
          'Valid DGCA ATPL(H)',
          'Valid FRTO and RTR certificates',
          'Incident/accident-free flying record',
          '1,000h PIC minimum',
        ],
      },
    },
    training: {
      typeRatingProvided: true,
      bondPeriod: '10 years (for type endorsement)',
      bondAmount: '\u20b925.50 Lakhs (bank guarantee)',
      trainingLocation: 'Juhu Aerodrome, Mumbai / Rohini Heliport, Delhi',
      trainingDuration: '6-12 months (type endorsement)',
      cadetProgram: true,
      cadetProgramDetails: 'Fresh Pilot Scheme: CHPL with 150h. Type endorsement training at \u20b925-50L cost or service bond up to \u20b925.50L for 10 years. Financial training loans covering up to 50% sometimes provided. Stipend \u20b915,000/mo during ground training, upgrading to \u20b91,00,000/mo as Junior Pilot after 500h on PHL helicopter.',
      mentoringProgram: true,
      mentoringProgramDetails: 'IAF MoU enables helicopter pilots nearing retirement to transition to PHL. Skills upgrade program for aeronautical engineers to become pilots.',
      selfSponsoredAccepted: true,
    },
    lifestyle: {
      rosterPattern: 'Variable by operation (offshore: 28/28, pilgrimage: seasonal, VIP: on-call)',
      baseType: 'permanent',
      seasonality: 'year_round',
      compensationRange: { min: 100000, max: 800000, currency: 'INR', period: 'monthly' },
      includesPerDiem: true,
      includesAccommodation: true,
      includesTravel: true,
      superannuation: true,
      description: 'Compensation varies dramatically by tier: Fresh Pilot stipend \u20b915,000/mo, Junior Pilot \u20b91,00,000/mo after 500h, Captain E-4 \u20b93,00,000-5,00,000/mo, Captain E-6 \u20b95,00,000-8,00,000/mo. Offshore pilots get 28/28 rotation. Pilgrimage operations seasonal (May-Oct). Accommodation and travel provided at remote bases.',
    },
    progression: {
      foToCaptainYears: '5-8 years',
      foToCaptainTypical: 6,
      upgradePathways: [
        'Fresh Pilot → Pilot A → Pilot B (E-2) → Pilot C (E-3) → Captain A (E-4) → Captain B (E-5) → Captain C (E-6)',
      ],
      treTriAvailable: true,
      treTriYears: '8-10 years',
      managementPathway: true,
      crossCategoryTransitions: ['Offshore to VIP charter', 'Pilgrimage to offshore', 'IAF to PHL (MoU pathway)'],
      description: '7-tier career structure from Fresh Pilot (150h) to Captain C (5,000h + 3,000h PIC). Clear progression with defined hour and age requirements at each tier. MRO engineer training also available for career diversification.',
    },
    quality: {
      safetyRecord: 'Mixed — several notable accidents (2011 Tawang Mi-17 crash, 2010 Arunachal crash). Fleet aging issues with Dauphin and Westland helicopters.',
      safetyRating: 'average',
      fleetAgeRange: 'Mixed — aging Dauphins and Westland 30s being replaced by new Dhruv NG and S-76D',
      averageFleetAge: 15,
      growthStatus: 'expanding',
      growthDescription: 'Fleet refresh underway — proposal for 23 factory-new helicopters. \u20b92,141 crore ONGC contract for HAL Dhruv NG. Diversifying into seaplanes and fixed-wing regional routes.',
      pilotTurnover: 'moderate',
      unionized: true,
      pilotReviewsCount: 0,
      certifications: ['DGCA AOC', 'Mini Ratna-I PSU', 'MRO certified (Airbus Helicopters)'],
    },
    wikimediaImages: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pawan_Hans.jpg/330px-Pawan_Hans.jpg',
        caption: 'Pawan Hans Sikorsky S-76D (VT-PWK)',
        license: 'CC BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
        artist: 'Sanil Nath',
        width: 5600,
        height: 7000,
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Pawan_Hans_helicopter_service_-_Bagdogra_airport_%28Siliguri%29_to_Gangtok.jpg/330px-Pawan_Hans_helicopter_service_-_Bagdogra_airport_%28Siliguri%29_to_Gangtok.jpg',
        caption: 'Pawan Hans helicopter service - Bagdogra to Gangtok',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        artist: 'Sujay25',
        width: 3872,
        height: 2592,
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Pawan_hans_helicopter_mizoram.jpg/330px-Pawan_hans_helicopter_mizoram.jpg',
        caption: 'Pawan Hans helicopter in Mizoram',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        artist: 'tluanga colney',
        width: 1402,
        height: 872,
      },
    ],
    website: 'https://www.pawanhans.co.in',
    founded: 1985,
    parentCompany: 'Ministry of Civil Aviation, Government of India',
  },

  // === CHINA ===

  'citic-offshore-helicopter': {
    slug: 'citic-offshore-helicopter',
    name: 'CITIC Offshore Helicopter',
    country: 'china',
    category: 'helicopter',
    description:
      'China\u2019s largest general aviation operator and only mainboard-listed helicopter company, dominating offshore oil & gas flight services with 80+ aircraft.',
    summary:
      'CITIC Offshore Helicopter Co., Ltd. (COHC) is the leading general aviation operator in China, founded in 1983 and headquartered in Shenzhen. A core subsidiary of CITIC Group, it was the first publicly traded general aviation company on the Shenzhen Stock Exchange (SZSE: 000099). COHC operates the largest civil helicopter fleet in Asia with 80+ aircraft, serving offshore oil & gas, port pilotage, polar expeditions, HEMS, and maritime law enforcement.',
    wikipedia: {
      pageId: 24334975,
      title: 'CITIC Offshore Helicopter',
      url: 'https://en.wikipedia.org/wiki/CITIC_Offshore_Helicopter',
      excerpt:
        'CITIC Offshore Helicopter Co., Ltd. is a China-based company that engages in offshore helicopter oil, general aviation transportation and aviation maintenance services. It is a part of CITIC Group.',
    },
    aiSummary: {
      text: 'COHC commands the largest civil helicopter fleet in Asia with 80+ aircraft including Leonardo AW139, Sikorsky S-92, Airbus H225/Super Puma, Eurocopter EC155, and Mil Mi-171. It operates from Shenzhen, Tianjin, Zhanjiang, Shanghai, and Hainan, covering the South China Sea, East China Sea, and Bohai Sea. COHC is the exclusive provider of helicopter port pilotage services in China and the sole helicopter service provider for China\u2019s Arctic and Antarctic expeditions. The company has pioneered eVTOL cargo deliveries to offshore platforms with AutoFlight.',
      sources: [
        {
          title: 'CITIC Offshore Helicopter - CITIC GROUP',
          url: 'https://www.group.citic/en/Diversified_Portfolio/New_Urbanization/Citic_Cohc/',
        },
        {
          title: 'COHC acquires four AW139 helicopters - Leonardo',
          url: 'https://www.leonardo.com/en/press-release-detail/-/detail/25-07-2022-leonardo-china-s-citic-offshore-helicopter-company-cohc-acquires-four-aw139-helicopters-for-offshore-oil-and-gas-production-operations',
        },
        {
          title: 'CITIC Offshore Helicopter (COHC) - Annual Report 2024',
          url: 'https://www.citic.com/ar2024/en/urbanisation/cohc',
        },
      ],
    },
    fleet: [
      'Leonardo AW139',
      'Sikorsky S-92',
      'Airbus H225 / EC225 Super Puma',
      'Eurocopter EC155 B1',
      'AS332L2 Super Puma Mark 2',
      'AS365B2 Dauphin',
      'EC135 / H135',
      'Mil Mi-171',
      'Ka-32A',
      'AgustaWestland A109E / A109S',
      'Dassault Falcon 2000EX / 7X',
      'Harbin H410 (Z-9)',
      'Changhe Z-11',
    ],
    bases: [
      'Shenzhen',
      'Zhanjiang (Guangdong)',
      'Shanghai',
      'Tianjin',
      'Beijing',
      'Hainan',
    ],
    services: [
      'Offshore oil & gas support (CNOOC)',
      'Port pilotage (exclusive in China)',
      'Polar / Antarctic expedition support',
      'HEMS / Emergency Medical Services',
      'Maritime law enforcement',
      'Disaster relief',
      'Government charter',
      'Aviation MRO (Airbus Helicopters authorized)',
      'eVTOL cargo delivery (AutoFlight partnership)',
    ],
    aiHiringSummary: {
      text: 'COHC pilot recruitment aligns with CAAC mandates and IOGP 690 standards. Captains: 3,000h total rotary, 1,200-1,500h multi-engine multi-crew, 500h offshore, 100h on type (S-92 or AW139). Co-Pilots: 500-1,000h total, 100-500h turbine/multi-engine, MCC certification. Requires CAAC ATP(H) with IR, Class 1 Medical, ICAO Level 4 English. Type ratings on S-92 or AW139 heavily preferred. Annual HEET/HUET training required. Clean safety record for preceding 5 years. Foreign applicants must undergo CAAC license conversion.',
      sources: [
        { title: 'COHC - CITIC Group', url: 'https://www.group.citic/en/Diversified_Portfolio/New_Urbanization/Citic_Cohc/' },
        { title: 'COHC AW139 acquisition - Leonardo', url: 'https://www.leonardo.com/en/press-release-detail/-/detail/25-07-2022-leonardo-china-s-citic-offshore-helicopter-company-cohc-acquires-four-aw139-helicopters-for-offshore-oil-and-gas-production-operations' },
        { title: 'COHC Annual Report 2024', url: 'https://www.citic.com/ar2024/en/urbanisation/cohc' },
      ],
    },
    career: {
      hiringStatus: 'open',
      pilotTypes: [
        'Helicopter Pilot (offshore)',
        'SAR Pilot',
        'HEMS Pilot',
        'Maritime Patrol Pilot',
        'Polar Operations Pilot',
      ],
      pathways: [
        'Offshore O&G Pilot Track',
        'SAR / HEMS Career Path',
        'Maritime Law Enforcement Aviation',
        'Polar Expedition Aviation',
        'eVTOL / Drone Operations (emerging)',
      ],
      notes:
        'COHC is China\u2019s largest helicopter employer with 80+ aircraft. Type ratings on AW139, S-92, H225, or EC155 highly valued. CAAC ATP(H) with IR required for captains. Foreign applicants need CAAC license conversion. Annual HEET/HUET recurrent training. Expanding into eVTOL with AutoFlight partnership.',
    },
    hiring: {
      intakeType: 'rolling',
      applicationUrl: 'http://www.cohc.citic',
      activeRoles: [
        {
          title: 'Offshore Helicopter Captain (S-92 / AW139)',
          base: 'Shenzhen / Zhanjiang',
          seat: 'captain',
          aircraftType: 'Sikorsky S-92 / Leonardo AW139',
          minTotalHours: 3000,
          minRotaryHours: 3000,
          minPicHours: 100,
          minMultiEngineHours: 1200,
          minOffshoreHours: 500,
          typeRatingRequired: ['S-92', 'AW139'],
          typeRatingProvided: true,
          count: 5,
          postedDate: '2025-01-01',
        },
        {
          title: 'Offshore Helicopter Co-Pilot (First Officer)',
          base: 'Shenzhen / Zhanjiang / Tianjin',
          seat: 'first_officer',
          aircraftType: 'Sikorsky S-92 / Leonardo AW139',
          minTotalHours: 500,
          minRotaryHours: 500,
          minPicHours: 0,
          minMultiEngineHours: 100,
          typeRatingRequired: [],
          typeRatingProvided: true,
          count: 8,
          postedDate: '2025-01-01',
        },
      ],
      totalOpenPositions: 13,
      lastUpdated: '2025-07-11',
    },
    requirements: {
      firstOfficer: {
        minTotalHours: 500,
        minRotaryHours: 500,
        minPicHours: 0,
        minMultiEngineHours: 100,
        requiredRatings: ['CAAC CPL(H)', 'IR', 'MCC'],
        requiredTypeRatings: [],
        preferredTypeRatings: ['S-92', 'AW139', 'H225'],
        medicalClass: 'Class 1',
        englishLevel: 'ICAO Level 4',
        citizenshipRequirements: ['Chinese citizen (preferred)', 'Foreign applicants with CAAC license conversion'],
        visaSponsorship: 'limited',
        additionalRequirements: [
          'Turbine/multi-engine rotary experience (100-500h)',
          'MCC certification course completed',
          'Clean safety record (5 years)',
          'HEET/HUET certification',
        ],
      },
      captain: {
        minTotalHours: 3000,
        minRotaryHours: 3000,
        minPicHours: 100,
        minMultiEngineHours: 1200,
        minOffshoreHours: 500,
        requiredRatings: ['CAAC ATP(H)', 'IR'],
        requiredTypeRatings: ['S-92', 'AW139'],
        preferredTypeRatings: ['H225', 'EC155'],
        medicalClass: 'Class 1',
        englishLevel: 'ICAO Level 4',
        citizenshipRequirements: ['Chinese citizen (preferred)', 'Foreign contract pilots with CAAC conversion'],
        visaSponsorship: 'limited',
        additionalRequirements: [
          '3 years or 500h offshore O&G experience',
          '100h PIC on type (S-92 or AW139)',
          'Night flying currency',
          'Annual emergency/rescue training (HEET/HUET)',
          'Clean safety record (5 years)',
          'Clean background check',
        ],
      },
    },
    training: {
      typeRatingProvided: true,
      bondPeriod: '3-5 years (typical for Chinese operators)',
      bondAmount: 'Not published',
      trainingLocation: 'Shenzhen / authorized training centers',
      trainingDuration: '6-10 weeks per type rating',
      cadetProgram: true,
      cadetProgramDetails: 'Targeted Chinese aviation university graduates may enter with lower hours. Alternative entry-level pathway for cadet graduates.',
      mentoringProgram: true,
      mentoringProgramDetails: 'Co-pilots paired with experienced captains for offshore operations training. Structured progression to captain upgrade.',
      selfSponsoredAccepted: true,
    },
    lifestyle: {
      rosterPattern: '28/28 or 2/2 rotation (offshore standard)',
      rotationDays: { on: 28, off: 28 },
      baseType: 'permanent',
      seasonality: 'year_round',
      compensationRange: { min: 300000, max: 600000, currency: 'CNY', period: 'annual' },
      includesPerDiem: true,
      includesAccommodation: true,
      includesTravel: true,
      superannuation: true,
      description: 'Offshore standard 28/28 rotation. Accommodation provided at bases. Year-round operations across South China Sea, East China Sea, and Bohai Sea. Competitive compensation with per diem, accommodation, and travel included. Polar expedition assignments offer premium compensation.',
    },
    progression: {
      foToCaptainYears: '4-6 years',
      foToCaptainTypical: 5,
      upgradePathways: [
        'Co-Pilot → Captain → Check Pilot → TRE/TRI → Management Pilot',
        'Offshore → SAR/HEMS specialization',
        'Offshore → Polar expedition operations',
      ],
      treTriAvailable: true,
      treTriYears: '7-10 years',
      managementPathway: true,
      crossCategoryTransitions: ['Offshore to HEMS', 'Offshore to SAR', 'Pilot to MRO engineer', 'Traditional helicopter to eVTOL'],
      description: 'Structured progression from co-pilot to captain with defined hour requirements. Specialization pathways in SAR, HEMS, and polar operations. TRE/TRI available for senior captains. Emerging eVTOL/drone operations creating new career paths.',
    },
    quality: {
      safetyRecord: 'Good — adheres to IOGP 690 standards, CAAC regulations. Authorized Airbus Helicopters MRO center.',
      safetyRating: 'good',
      fleetAgeRange: 'Mixed — modern AW139 and S-92 acquisitions alongside older EC225 and AS332',
      averageFleetAge: 12,
      growthStatus: 'expanding',
      growthDescription: 'Largest civil helicopter fleet in Asia (80+ aircraft). Active fleet expansion with AW139 acquisitions. Pioneering eVTOL cargo deliveries with AutoFlight. Expanding drone operations.',
      pilotTurnover: 'low',
      unionized: false,
      pilotReviewsCount: 0,
      certifications: ['CAAC AOC', 'IOGP 690 compliant', 'Airbus Helicopters authorized MRO', 'SZSE listed (000099)'],
    },
    wikimediaImages: [],
    website: 'http://www.cohc.citic',
    founded: 1983,
    parentCompany: 'CITIC Group',
  },

  // === MALAYSIA ===

  'mhs-aviation': {
    slug: 'mhs-aviation',
    name: 'MHS Aviation Berhad',
    country: 'malaysia',
    category: 'helicopter',
    description:
      'Malaysia\u2019s premier offshore helicopter operator with 70% market share, serving Petronas, Shell, and ExxonMobil from bases across Peninsular and East Malaysia.',
    summary:
      'MHS Aviation Berhad (formerly Malaysian Helicopter Services), founded in 1983, is Malaysia\u2019s largest offshore helicopter operator with 70% market share in the O&G sector. A subsidiary of Boustead Holdings Berhad, it serves Petronas, Shell, and ExxonMobil from bases across Malaysia. The company has expanded internationally to Mauritania, Syria, Timor Leste, Turkmenistan, Myanmar, Brazil, Indonesia, and most recently Namibia via a 7-year lease with Westair Helicopters deploying Airbus H175s.',
    wikipedia: {
      pageId: 30967898,
      title: 'MHS Aviation',
      url: 'https://en.wikipedia.org/wiki/MHS_Aviation',
      excerpt:
        'MHS Aviation Berhad (formerly Malaysian Helicopter Services) is a charter airline company based in Malaysia. Its operations are mainly in the oil and gas industry, where their helicopters transport personnel to offshore rigs. They are the largest company in the offshore oil and gas helicopter market in Malaysia, having a 70% market share.',
    },
    aiSummary: {
      text: 'MHS Aviation operates a diverse fleet including Airbus H175 (configured for O&G, SAF-certified), Airbus H135 P3H, Eurocopter AS332L2 Super Puma, Beechcraft 1900D, and historically Sikorsky S-76 series and S-61N. The company holds the world fleet-leader record for S-76A airframe hours. Domestic bases include Kerteh, Kuala Terengganu, Kota Bharu, Subang, Penang, Miri, Kuching, Bintulu, and Kota Kinabalu. International operations span Mauritania, Turkmenistan, Myanmar, Brazil, Indonesia, and Namibia. All flights operated by two-pilot, twin-engine aircraft.',
      sources: [
        {
          title: 'MHS Aviation 7-year lease with Westair Helicopters - The Edge Malaysia',
          url: 'https://theedgemalaysia.com/node/705423',
        },
        {
          title: 'MHS Aviation Westair lease signing - NST',
          url: 'https://www.nst.com.my/business/corporate/2024/03/1028670/bousteads-mhs-aviation-westair-helicopters-sign-7-year-lease',
        },
        {
          title: 'MHS Aviation Official Website',
          url: 'https://mhsaviation.com/',
        },
      ],
    },
    fleet: [
      'Airbus H175B',
      'Airbus H135 P3H',
      'Eurocopter AS332L2 Super Puma',
      'Beechcraft 1900D',
      'Sikorsky S-76A/C/C++ (historical)',
      'Sikorsky S-61N (historical)',
    ],
    bases: [
      'Subang (Kuala Lumpur)',
      'Kerteh (Terengganu)',
      'Kuala Terengganu',
      'Kota Bharu (Kelantan)',
      'Penang',
      'Miri (Sarawak)',
      'Kuching (Sarawak)',
      'Bintulu (Sarawak)',
      'Kota Kinabalu (Sabah)',
      'Labuan',
    ],
    services: [
      'Offshore O&G personnel transport',
      'Search and Rescue (SAR)',
      'Emergency Medical Services (EMS/Medevac)',
      'Pipeline inspection',
      'Heavy lifting',
      'International offshore operations',
    ],
    aiHiringSummary: {
      text: 'MHS Aviation requires CAAM ATPL(H) or CPL(H) with frozen ATPL, Class 1 Medical, ICAO Level 4 English. Captains: 2,000-3,000h total helicopter, 1,000-1,500h PIC multi-engine, 500h+ offshore preferred. First Officers: 500-1,000h total helicopter. Type ratings on EC225/H225, AW139, or S-76 heavily prioritized. Mandatory HUET/BOSIET certification, Oil & Gas Medical, clean safety record. Apply directly via MHS Aviation website or aviation job portals like FlyGosh. Contract-based hiring aligned with O&G client demands.',
      sources: [
        { title: 'MHS Aviation Official Website', url: 'https://mhsaviation.com/' },
        { title: 'FlyGosh Jobs - MHS Aviation', url: 'https://flygoshjobs.com/' },
        { title: 'MHS Aviation 7-year Westair lease - The Edge Malaysia', url: 'https://theedgemalaysia.com/node/705423' },
      ],
    },
    career: {
      hiringStatus: 'accepting',
      pilotTypes: [
        'Helicopter Pilot (offshore)',
        'SAR Pilot',
        'EMS Pilot',
        'Fixed-Wing Pilot (Beechcraft 1900D)',
      ],
      pathways: [
        'Offshore O&G Pilot Track',
        'SAR / EMS Career Path',
        'International Deployment Track',
        'Namibia/Africa Deployment (via Westair lease)',
      ],
      notes:
        'MHS Aviation operates two-pilot, twin-engine only. CAAM CPL(H) or ATPL(H) required. Type ratings on H175, H225, AW139, or S-76 heavily prioritized. HUET/BOSIET mandatory. International deployment opportunities in Mauritania, Namibia, Timor Leste, and others. 70% market share in Malaysian offshore O&G.',
    },
    hiring: {
      intakeType: 'campaign',
      applicationUrl: 'https://mhsaviation.com/',
      activeRoles: [
        {
          title: 'Offshore Helicopter Captain (H175 / AS332)',
          base: 'Kerteh / Miri / Subang',
          seat: 'captain',
          aircraftType: 'Airbus H175 / AS332L2 Super Puma',
          minTotalHours: 2000,
          minRotaryHours: 2000,
          minPicHours: 1000,
          minMultiEngineHours: 1000,
          minOffshoreHours: 500,
          typeRatingRequired: ['H175', 'AS332 Super Puma'],
          typeRatingProvided: true,
          count: 3,
          postedDate: '2025-01-01',
        },
        {
          title: 'Offshore Helicopter Co-Pilot (First Officer)',
          base: 'Kerteh / Kota Bharu / Subang',
          seat: 'first_officer',
          aircraftType: 'Airbus H175 / H135 / AS332',
          minTotalHours: 500,
          minRotaryHours: 500,
          minPicHours: 0,
          minMultiEngineHours: 100,
          typeRatingRequired: [],
          typeRatingProvided: true,
          count: 4,
          postedDate: '2025-01-01',
        },
      ],
      totalOpenPositions: 7,
      lastUpdated: '2025-07-11',
    },
    requirements: {
      firstOfficer: {
        minTotalHours: 500,
        minRotaryHours: 500,
        minPicHours: 0,
        minMultiEngineHours: 100,
        requiredRatings: ['CAAM CPL(H)', 'Frozen ATPL(H)'],
        requiredTypeRatings: [],
        preferredTypeRatings: ['H175', 'H225', 'AS332 Super Puma', 'AW139', 'S-76'],
        medicalClass: 'Class 1',
        englishLevel: 'ICAO Level 4',
        citizenshipRequirements: ['Malaysian citizen (preferred)', 'Foreign contract pilots considered'],
        visaSponsorship: 'available',
        additionalRequirements: [
          'HUET / BOSIET certification',
          'Oil & Gas Medical (Petronas/Shell approved)',
          'Clean safety record',
          'Turbine/multi-engine rotary experience',
        ],
      },
      captain: {
        minTotalHours: 2000,
        minRotaryHours: 2000,
        minPicHours: 1000,
        minMultiEngineHours: 1000,
        minOffshoreHours: 500,
        requiredRatings: ['CAAM ATPL(H)'],
        requiredTypeRatings: ['H175', 'AS332 Super Puma'],
        preferredTypeRatings: ['AW139', 'S-76', 'H135'],
        medicalClass: 'Class 1',
        englishLevel: 'ICAO Level 4',
        citizenshipRequirements: ['Malaysian citizen (preferred)', 'Foreign contract pilots considered'],
        visaSponsorship: 'available',
        additionalRequirements: [
          '1,000-1,500h PIC on multi-engine helicopters',
          '500h+ offshore flight hours',
          'HUET / BOSIET certification',
          'Oil & Gas Medical',
          'Clean safety record — no major incidents/accidents',
        ],
      },
    },
    training: {
      typeRatingProvided: true,
      bondPeriod: '2-3 years (typical for offshore operators)',
      bondAmount: 'Not published',
      trainingLocation: 'Subang / Kerteh bases',
      trainingDuration: '6-8 weeks per type rating',
      cadetProgram: false,
      mentoringProgram: true,
      mentoringProgramDetails: 'Co-pilots paired with experienced captains. Structured offshore operations training including HUET/BOSIET and O&G client-specific procedures.',
      selfSponsoredAccepted: true,
    },
    lifestyle: {
      rosterPattern: '2/2 or 28/28 rotation (offshore standard)',
      rotationDays: { on: 28, off: 28 },
      baseType: 'fifo',
      seasonality: 'year_round',
      compensationRange: { min: 8000, max: 18000, currency: 'MYR', period: 'monthly' },
      includesPerDiem: true,
      includesAccommodation: true,
      includesTravel: true,
      superannuation: true,
      description: 'FIFO roster with 28/28 or 2/2 rotation. Accommodation and travel provided at offshore bases. International deployments (Namibia, Mauritania) offer premium compensation. Year-round operations. Per diem and offshore allowances included. Two-pilot, twin-engine operations only — high safety standard.',
    },
    progression: {
      foToCaptainYears: '4-6 years',
      foToCaptainTypical: 5,
      upgradePathways: [
        'Co-Pilot → Captain → Check Pilot → TRE/TRI',
        'Offshore → SAR/EMS specialization',
        'Domestic → International deployment (Namibia, Mauritania, etc.)',
      ],
      treTriAvailable: true,
      treTriYears: '8-10 years',
      managementPathway: true,
      crossCategoryTransitions: ['Offshore to SAR', 'Offshore to EMS', 'Domestic to international operations', 'Helicopter to fixed-wing (Beechcraft 1900D)'],
      description: 'Clear progression from co-pilot to captain with offshore hour requirements. International deployment opportunities available for experienced captains. TRE/TRI pathway for senior pilots. Fixed-wing transition possible via Beechcraft 1900D operations.',
    },
    quality: {
      safetyRecord: 'Good — two-pilot, twin-engine only policy. Holds world fleet-leader record for S-76A airframe hours. 70% market share in Malaysian offshore O&G.',
      safetyRating: 'good',
      fleetAgeRange: 'Modernizing — new H175 acquisitions replacing older S-76 and S-61',
      averageFleetAge: 10,
      growthStatus: 'expanding',
      growthDescription: 'Fleet modernization with H175 and H135. 7-year Westair lease for Namibia operations. Expanding international footprint.',
      pilotTurnover: 'low',
      unionized: false,
      pilotReviewsCount: 0,
      certifications: ['CAAM AOC', 'Petronas approved', 'Shell approved', 'ExxonMobil approved', 'HUET/BOSIET certified'],
    },
    wikimediaImages: [],
    website: 'https://mhsaviation.com',
    founded: 1983,
    parentCompany: 'Boustead Holdings Berhad',
  },

  // === NEW ZEALAND ===

  'the-helicopter-line': {
    slug: 'the-helicopter-line',
    name: 'The Helicopter Line',
    country: 'new-zealand',
    category: 'helicopter',
    description:
      'New Zealand\u2019s largest locally owned helicopter company, specializing in scenic flights, glacier landings, and heli-hiking across the South Island for 38+ years.',
    summary:
      'The Helicopter Line is New Zealand\u2019s largest locally owned helicopter company and leading scenic flight provider, with over 38 years of alpine aviation experience. Operating from Queenstown, Aoraki/Mount Cook, Franz Josef, and Fox Glacier, they specialize in scenic flights, premium snow landings, and glacier heli-hiking. The company began as a scenic helicopter sightseeing business and later became part of Tourism Holdings Limited (thl), now the world\u2019s largest RV rental provider.',
    wikipedia: {
      pageId: 22633243,
      title: 'Tourism Holdings',
      url: 'https://en.wikipedia.org/wiki/Tourism_Holdings',
      excerpt:
        'Tourism Holdings Limited (stylized as thl) is a New Zealand tourism company. The company began as a scenic helicopter sightseeing business, known as The Helicopter Line. It is now the world\u2019s largest provider of commercial RV rentals.',
    },
    aiSummary: {
      text: 'The Helicopter Line operates a modern fleet of Airbus AS350 Squirrels (6-seat, excellent visibility) and Airbus H130 T2s (luxury, anti-vibration, leather seating). Bases at Queenstown Airport, Glentanner Park (Mount Cook), Franz Josef village, and Fox Glacier village. Popular experiences include Alpine Vista (20-25 min, $385 NZD), Mountains High (40 min, $655 NZD), Mt Cook & Glaciers (55 min, $875 NZD), Tasman Glacier Heli-Hike (3 hrs, $540+ NZD), and Milford Sound with Cruise (4 hrs, $1,595 NZD). Holds the highest CAA certification for scenic operations and extensive DOC concessions for wilderness landings.',
      sources: [
        {
          title: 'The Helicopter Line - Home',
          url: 'https://www.helicopter.co.nz/',
        },
        {
          title: 'The Helicopter Line - Aoraki/Mount Cook',
          url: 'https://www.helicopter.co.nz/aoraki-mount-cook',
        },
        {
          title: 'The Helicopter Line - Tasman Glacier Heli Hike',
          url: 'https://www.helicopter.co.nz/aoraki-mount-cook/tasman-glacier-heli-hike',
        },
      ],
    },
    fleet: ['Airbus AS350 Squirrel (Ecureuil)', 'Airbus H130 T2'],
    bases: [
      'Queenstown Airport (Lucas Place)',
      'Glentanner Park, Aoraki/Mount Cook',
      'Franz Josef village',
      'Fox Glacier village',
    ],
    services: [
      'Scenic helicopter flights',
      'Glacier / snow landings',
      'Heli-hiking (Tasman Glacier)',
      'Milford Sound excursions',
      'Charter flights',
      'Film / photography support',
    ],
    aiHiringSummary: {
      text: 'The Helicopter Line requires CAA NZ CPL(H), Class 1 Medical. Minimum 500-1,000h total helicopter for entry-level scenic positions; 1,000-2,000h+ preferred for alpine operations. Minimum 500h turbine experience. AS350/H125 type rating highly preferred (bulk of fleet). Mountain flying and snow/alpine landing experience essential. NZ CAA Part 135 experience. Valid NZ citizenship, residency, or work visa required. Strong customer service and communication skills for tourism commentary. Seasonal hiring for Oct-April peak season.',
      sources: [
        { title: 'The Helicopter Line - Careers', url: 'https://www.helicopter.co.nz/careers' },
        { title: 'H125 Aerial Work/Tour Pilots NZ - Helijobs', url: 'https://helijobs.net/2025/03/h125-aerial-work-tour-pilots-new-zealand/' },
        { title: 'H125 Aerial Work Pilot NZ - Helijobs', url: 'https://helijobs.net/2025/03/h125-aerial-work-pilot-new-zealand-4/' },
      ],
    },
    career: {
      hiringStatus: 'accepting',
      pilotTypes: [
        'Scenic / Tourism Helicopter Pilot',
        'Charter Pilot',
        'Alpine / Glacier Pilot',
      ],
      pathways: [
        'Scenic Tourism Pilot Track',
        'Alpine Aviation Career Path',
        'Charter / Film Work Pathway',
        'Seasonal to Permanent Progression',
      ],
      notes:
        'NZ CAA CPL(H) required. 500-1,000h minimum for scenic, 1,000-2,000h+ for alpine. AS350/H125 type rating highly preferred. Mountain flying experience essential. Seasonal hiring for Oct-April peak. Tourism/customer service skills important. DOC concessions require additional training.',
    },
    hiring: {
      intakeType: 'seasonal',
      nextIntakeDate: 'August-September (for October start)',
      applicationUrl: 'https://www.helicopter.co.nz/careers',
      activeRoles: [
        {
          title: 'Scenic Helicopter Pilot (AS350 / H130)',
          base: 'Queenstown / Franz Josef / Fox Glacier / Mount Cook',
          seat: 'captain',
          aircraftType: 'Airbus AS350 Squirrel / H130 T2',
          minTotalHours: 500,
          minRotaryHours: 500,
          minPicHours: 500,
          minMultiEngineHours: 0,
          minTurbineHours: 500,
          minMountainHours: 100,
          typeRatingRequired: ['AS350'],
          typeRatingProvided: false,
          count: 4,
          postedDate: '2025-06-01',
          applicationUrl: 'https://www.helicopter.co.nz/careers',
        },
        {
          title: 'Senior Alpine Scenic Pilot (H130 T2)',
          base: 'Queenstown / Mount Cook',
          seat: 'captain',
          aircraftType: 'Airbus H130 T2',
          minTotalHours: 2000,
          minRotaryHours: 2000,
          minPicHours: 1500,
          minMultiEngineHours: 0,
          minTurbineHours: 1000,
          minMountainHours: 500,
          typeRatingRequired: ['H130'],
          typeRatingProvided: true,
          count: 2,
          postedDate: '2025-06-01',
          applicationUrl: 'https://www.helicopter.co.nz/careers',
        },
      ],
      totalOpenPositions: 6,
      lastUpdated: '2025-07-11',
    },
    requirements: {
      firstOfficer: {
        minTotalHours: 500,
        minRotaryHours: 500,
        minPicHours: 500,
        minMultiEngineHours: 0,
        minTurbineHours: 500,
        minMountainHours: 100,
        requiredRatings: ['CAA NZ CPL(H)'],
        requiredTypeRatings: ['AS350'],
        preferredTypeRatings: ['H130'],
        medicalClass: 'Class 1',
        englishLevel: 'ICAO Level 4',
        citizenshipRequirements: ['New Zealand citizen', 'Permanent Resident', 'Valid work visa'],
        visaSponsorship: 'limited',
        additionalRequirements: [
          'Mountain flying and snow/alpine landing experience',
          'NZ CAA Part 135 experience',
          'Tourism/customer service skills',
          'Engaging personality for flight commentary',
        ],
      },
      captain: {
        minTotalHours: 2000,
        minRotaryHours: 2000,
        minPicHours: 1500,
        minMultiEngineHours: 0,
        minTurbineHours: 1000,
        minMountainHours: 500,
        requiredRatings: ['CAA NZ CPL(H)'],
        requiredTypeRatings: ['AS350', 'H130'],
        preferredTypeRatings: [],
        medicalClass: 'Class 1',
        englishLevel: 'ICAO Level 4',
        citizenshipRequirements: ['New Zealand citizen', 'Permanent Resident', 'Valid work visa'],
        visaSponsorship: 'limited',
        additionalRequirements: [
          'Extensive mountain flying and alpine landing experience',
          'NZ CAA Part 135 experience',
          'DOC concession operations experience',
          'Flawless safety mindset for rapidly changing alpine weather',
          'Premium tourism customer service skills',
        ],
      },
    },
    training: {
      typeRatingProvided: true,
      bondPeriod: '1-2 years (for H130 type rating)',
      bondAmount: 'Not published',
      trainingLocation: 'Queenstown base',
      trainingDuration: '2-4 weeks (type rating + alpine conversion)',
      cadetProgram: false,
      mentoringProgram: true,
      mentoringProgramDetails: 'New pilots paired with experienced alpine pilots for mountain flying and scenic route familiarization. DOC concession landing site training included.',
      selfSponsoredAccepted: true,
    },
    lifestyle: {
      rosterPattern: '5-6 days/week during peak season (Oct-April)',
      baseType: 'permanent',
      seasonality: 'seasonal',
      peakMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
      compensationRange: { min: 65000, max: 95000, currency: 'NZD', period: 'annual' },
      includesPerDiem: false,
      includesAccommodation: false,
      includesTravel: false,
      superannuation: true,
      description: 'Seasonal operations with peak from October to April (South Island summer). 5-6 flying days per week during peak. Off-season (May-September) typically maintenance, training, or overseas opportunities. Bases in premium tourist destinations — Queenstown, Mount Cook, Franz Josef, Fox Glacier. Tourism-focused — pilots deliver commentary and interact with international tourists.',
    },
    progression: {
      foToCaptainYears: '2-4 years (scenic); 4-6 years (alpine senior)',
      foToCaptainTypical: 3,
      upgradePathways: [
        'Scenic Pilot → Senior Scenic Pilot → Check Pilot → Chief Pilot',
        'AS350 Squirrel → H130 T2 (luxury fleet upgrade)',
        'Scenic → Charter → Film/Photography work',
        'Seasonal → Permanent position',
      ],
      treTriAvailable: true,
      treTriYears: '5-7 years',
      managementPathway: true,
      crossCategoryTransitions: ['Scenic to charter', 'Scenic to agricultural', 'Scenic to EMS/SAR', 'NZ to overseas scenic operations'],
      description: 'Progression from entry-level scenic pilot on AS350 to senior alpine pilot on H130 T2. Check pilot and TRE/TRI pathways available. Film/photography work as a specialization. Many pilots use scenic as hour-building pathway to offshore or EMS careers.',
    },
    quality: {
      safetyRecord: 'Excellent — highest CAA NZ certification for scenic operations. 38+ years of alpine aviation without major incidents.',
      safetyRating: 'excellent',
      fleetAgeRange: 'Modern — AS350 Squirrels and H130 T2s with anti-vibration systems',
      averageFleetAge: 6,
      growthStatus: 'stable',
      growthDescription: 'Established operator with stable fleet. Part of Tourism Holdings Limited (thl) — world\u2019s largest RV rental provider. Tourism demand drives growth.',
      pilotTurnover: 'moderate',
      unionized: false,
      pilotReviewsCount: 0,
      certifications: ['CAA NZ AOC Part 135', 'DOC Concessions (extensive)', 'Highest CAA NZ scenic certification'],
    },
    wikimediaImages: [],
    website: 'https://www.helicopter.co.nz',
    founded: 1984,
    parentCompany: 'Tourism Holdings Limited (thl)',
  },
};

/** Get enrichment for an operator by slug, or null if not yet enriched */
export function getEnrichment(slug: string): OperatorEnrichment | null {
  return operatorEnrichment[slug] ?? null;
}

/** Get enrichment for an operator by name (slugifies internally) */
export function getEnrichmentByName(name: string): OperatorEnrichment | null {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return getEnrichment(slug);
}

/** List of all enriched operator slugs */
export const enrichedOperatorSlugs = Object.keys(operatorEnrichment);
