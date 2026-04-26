/**
 * Aircraft Manufacturers Data Structure
 * Comprehensive manufacturer and type rating information for Type Rating Search Page
 */

export interface Manufacturer {
  id: string;
  name: string;
  logo: string;
  heroImage?: string;
  description: string;
  whyChooseRating?: string;
  founded: number;
  headquarters: string;
  website: string;
  reputationScore: number;
  totalAircraftCount: number;
  trainingCenters?: TrainingCenter[];
  newsAndUpdates?: NewsItem[];
  userReviews?: UserReview[];
  retirementTimeline?: RetirementInfo;
  marketDemandStatistics?: MarketDemand;
  salaryExpectations?: SalaryInfo;
  careerProgression?: CareerProgression;
  airlineRecruitmentPartnerships?: string[];
  internshipOpportunities?: InternshipInfo[];
  mentorshipOpportunities?: MentorshipInfo[];
  scholarships?: ScholarshipInfo[];
  insuranceOptions?: InsuranceInfo;
  accommodationCosts?: AccommodationInfo;
  visaImmigrationSupport?: VisaInfo[];
  languageRequirements?: LanguageRequirement[];
  culturalAdaptationSupport?: CulturalSupportInfo;
  networkingEvents?: NetworkingEvent[];
  alumniNetwork?: AlumniInfo;
  jobBoardIntegration?: JobBoardInfo;
  interviewPreparation?: InterviewPrepInfo;
  technicalAssessment?: TechnicalAssessmentInfo;
  simulatorPracticeSessions?: SimulatorSessionInfo;
  groundSchoolModules?: GroundSchoolModule[];
  progressTracking?: ProgressTrackingInfo;
  expectations?: ManufacturerExpectations;
}

export interface TrainingCenter {
  id: string;
  name: string;
  location: string;
  country: string;
  offers: string[];
  image: string;
  website?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  url: string;
}

export interface UserReview {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface RetirementInfo {
  aircraftName: string;
  retirementDate: string;
  replacement: string;
}

export interface MarketDemand {
  demandLevel: 'high' | 'medium' | 'low';
  growthRate: string;
  keyMarkets: string[];
}

export interface SalaryInfo {
  entryLevel: string;
  midLevel: string;
  seniorLevel: string;
  currency: string;
}

export interface CareerProgression {
  entryLevel: string;
  midLevel: string;
  seniorLevel: string;
  timeline: string;
}

export interface InternshipInfo {
  programName: string;
  duration: string;
  stipend: string;
  requirements: string[];
}

export interface MentorshipInfo {
  programName: string;
  duration: string;
  benefits: string[];
}

export interface ScholarshipInfo {
  name: string;
  amount: string;
  eligibility: string[];
  deadline: string;
}

export interface InsuranceInfo {
  provider: string;
  coverage: string;
  cost: string;
}

export interface AccommodationInfo {
  city: string;
  averageRent: string;
  utilities: string;
}

export interface VisaInfo {
  country: string;
  visaType: string;
  processingTime: string;
  requirements: string[];
}

export interface LanguageRequirement {
  language: string;
  level: string;
  certificationRequired: boolean;
}

export interface CulturalSupportInfo {
  programName: string;
  description: string;
  services: string[];
}

export interface NetworkingEvent {
  eventName: string;
  date: string;
  location: string;
  attendees: string;
}

export interface AlumniInfo {
  totalMembers: number;
  successStories: string[];
  networkingOpportunities: string[];
}

export interface JobBoardInfo {
  platformName: string;
  url: string;
  features: string[];
}

export interface InterviewPrepInfo {
  resources: string[];
  mockInterviews: boolean;
  coachingAvailable: boolean;
}

export interface TechnicalAssessmentInfo {
  assessmentType: string;
  format: string;
  preparationMaterials: string[];
}

export interface SimulatorSessionInfo {
  availableLocations: string[];
  bookingRequired: boolean;
  costPerHour: string;
}

export interface GroundSchoolModule {
  moduleName: string;
  duration: string;
  onlineAvailable: boolean;
  certification: string;
}

export interface ProgressTrackingInfo {
  enabled: boolean;
  features: string[];
  certificationTracking: boolean;
  milestoneAlerts: boolean;
}

export interface ManufacturerExpectations {
  overview: string;
  trainingRequirements: string[];
  careerPath: string;
  keySkills: string[];
  salaryRange: string;
  demandOutlook: string;
  commonRoles: string[];
  additionalNotes?: string;
}

export interface AircraftTypeRating {
  id: string;
  manufacturerId: string;
  model: string;
  category: 'commercial' | 'private' | 'cargo' | 'regional' | 'helicopter' | 'military' | 'legacy' | 'flagship' | 'end-of-life';
  subcategory?: string;
  image: string;
  sketchfabId?: string;
  description: string;
  whyChooseRating?: string;
  demandLevel?: 'none' | 'low' | 'high';
  conditionallyNew?: 'red' | 'amber' | 'green';
  lifecycleStage?: 'early-career' | 'mid-career' | 'end-of-life';
  orderBacklog?: { orders: number; delivered: number };
  operatorCount?: number;
  totalDeliveries?: number;
  steepApproachCertified?: boolean;
  engineType?: string;
  rangeVersatility?: 'short' | 'medium' | 'long' | 'versatile';
  cabinFeatures?: string[];
  news?: NewsItem[];
  careerScore?: number;
  pilotCount?: number;
  firstFlight: number;
  specifications: AircraftSpecs;
  trainingRequirements: TrainingRequirements;
  trainingCurriculum: CurriculumItem[];
  simulatorDetails: SimulatorInfo;
  instructorQualifications: InstructorQualification[];
  certification: CertificationInfo;
  successStories?: SuccessStory[];
  faq?: FAQItem[];
  careerInfo?: CareerInfo;
}

export interface AircraftSpecs {
  maxTakeoffWeight: string;
  cruisingSpeed: string;
  range: string;
  capacity: number | string;
  engines: number;
  engineType: string;
  length: string;
  wingspan: string;
  height: string;
}

export interface TrainingRequirements {
  minimumHours: number;
  requiredLicenses: string[];
  medicalCertificate: string;
  englishProficiency: string;
  groundSchoolHours: number;
  simulatorHours: number;
  flightHours: number;
}

export interface CurriculumItem {
  phase: string;
  duration: string;
  topics: string[];
}

export interface SimulatorInfo {
  type: string;
  locations: string[];
  features: string[];
}

export interface InstructorQualification {
  type: string;
  requirements: string[];
}

export interface CertificationInfo {
  authority: string;
  validity: string;
  renewalRequirements: string[];
}

export interface SuccessStory {
  pilotName: string;
  currentPosition: string;
  story: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CareerInfo {
  jobMarket: string;
  averageSalary: string;
  airlinesUsing: string[];
  growthProspects: string;
}

// Manufacturer Data
export const manufacturers: Manufacturer[] = [
  {
    id: 'airbus',
    name: 'Airbus',
    logo: 'https://1000logos.net/wp-content/uploads/2020/03/Airbus-Logo.png',
    heroImage: 'https://static0.simpleflyingimages.com/wordpress/wp-content/uploads/2020/10/A320-Family-production-increase.jpeg',
    description: 'Airbus offers the most comprehensive and authoritative type rating programs directly from the manufacturer. With the world\'s largest Airbus simulator fleet and OEM-direct training, pilots gain unparalleled expertise on the A320 family, A330, A350, and A220. Airbus training is globally recognized by airlines, providing pilots with a competitive edge in career advancement and access to the world\'s most popular commercial aircraft fleet.',
    whyChooseRating: 'Airbus type ratings provide pilots with direct OEM training that is recognized globally by airlines. The Airbus fly-by-wire system and common cockpit philosophy across all Airbus aircraft enable pilots to easily transition between different models, from the A320neo to the A350. With over 200,000 Airbus-rated pilots worldwide and the majority of commercial airline fleets operating Airbus aircraft, an Airbus type rating opens doors to career opportunities with airlines across Europe, Asia, the Middle East, and the Americas.',
    founded: 1970,
    headquarters: 'Blagnac, France',
    website: 'https://www.airbus.com',
    reputationScore: 9.2,
    totalAircraftCount: 15000,
    trainingCenters: [
      {
        id: 'airbus-toulouse',
        name: 'Airbus Training Centre Toulouse',
        location: 'Toulouse, France',
        country: 'France',
        offers: ['A320', 'A330', 'A350', 'A380', 'A220'],
        image: 'https://www.cae.com/content/images/blog/Civil_Aviation/_webp/IMG_4783_Updated_.JPG_webp_40cd750bba9870f18aada2478b24840a.webp',
        website: 'https://www.airbus.com/training'
      },
      {
        id: 'airbus-miami',
        name: 'Airbus Training Centre Miami',
        location: 'Miami, USA',
        country: 'United States',
        offers: ['A320', 'A330', 'A350'],
        image: 'https://www.airbus.com/sites/g/files/jknrzu326/images/styles/1600x900/public/2021-03/airbus-training-centre-miami-1.jpg',
        website: 'https://www.airbus.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '5% annually',
      keyMarkets: ['Europe', 'Asia', 'Middle East', 'Americas']
    },
    salaryExpectations: {
      entryLevel: '$50,000 - $70,000',
      midLevel: '$80,000 - $120,000',
      seniorLevel: '$150,000 - $250,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Training Captain / Fleet Manager',
      timeline: '5-8 years to Captain, 10-15 years to senior roles'
    }
  },
  {
    id: 'boeing',
    name: 'Boeing',
    logo: 'https://freepnglogo.com/images/all_img/boeing-logo-e30b.png',
    description: 'The Boeing Company is an American multinational corporation that designs, manufactures, and sells airplanes, rotorcraft, rockets, satellites, and missiles worldwide.',
    founded: 1916,
    headquarters: 'Chicago, Illinois, USA',
    website: 'https://www.boeing.com',
    reputationScore: 9.1,
    totalAircraftCount: 20000,
    trainingCenters: [
      {
        id: 'boeing-miami',
        name: 'Boeing Training Center Miami',
        location: 'Miami, USA',
        country: 'United States',
        offers: ['737', '747', '767', '777', '787'],
        image: 'https://www.boeing.com/resources/boeingdotcom/company/about_bc/history/images/boeing-training-center-miami.jpg',
        website: 'https://www.boeing.com/training'
      },
      {
        id: 'boeing-seattle',
        name: 'Boeing Training Center Seattle',
        location: 'Seattle, USA',
        country: 'United States',
        offers: ['737', '747', '777', '787'],
        image: 'https://www.boeing.com/resources/boeingdotcom/company/about_bc/history/images/boeing-training-center-seattle.jpg',
        website: 'https://www.boeing.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '4% annually',
      keyMarkets: ['North America', 'Asia', 'Europe', 'Middle East']
    },
    salaryExpectations: {
      entryLevel: '$55,000 - $75,000',
      midLevel: '$85,000 - $130,000',
      seniorLevel: '$160,000 - $280,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Chief Pilot / Director of Operations',
      timeline: '6-10 years to Captain, 12-18 years to senior roles'
    },
    expectations: {
      overview: 'Boeing pilots are among the most sought-after in the aviation industry, with opportunities across commercial airlines, cargo operations, and private aviation.',
      trainingRequirements: [
        'Commercial Pilot License (CPL) with Multi-Engine Instrument Rating',
        'Airline Transport Pilot License (ATPL) for Captain positions',
        'Type rating for specific Boeing aircraft models (737, 777, 787, etc.)',
        'Minimum 1,500-2,500 flight hours depending on aircraft type',
        'Class 1 Medical Certificate',
        'ICAO Level 4+ English proficiency',
        'Recurrent simulator training every 6-12 months'
      ],
      careerPath: 'Typically starts as a First Officer on narrow-body aircraft (737), progressing to wide-body (777/787) as experience grows. Captain positions require 3,000-5,000+ hours.',
      keySkills: [
        'Advanced aircraft systems knowledge',
        'Crew Resource Management (CRM)',
        'Instrument flying proficiency',
        'Emergency procedures mastery',
        'Leadership and decision-making'
      ],
      salaryRange: '$80,000 - $350,000+ annually (varies by region, airline, and experience)',
      demandOutlook: 'Strong demand for Boeing pilots continues, especially for 737 MAX and 787 Dreamliner ratings. Cargo operations also offer significant opportunities.',
      commonRoles: ['First Officer', 'Captain', 'Training Captain', 'Fleet Manager', 'Chief Pilot']
    }
  },
  {
    id: 'embraer',
    name: 'Embraer',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Embraer_logo.svg/3840px-Embraer_logo.svg.png',
    description: 'Embraer S.A. is a Brazilian aerospace conglomerate that produces commercial, military, executive and agricultural aircraft and provides aeronautical services.',
    founded: 1969,
    headquarters: 'São José dos Campos, Brazil',
    website: 'https://www.embraer.com',
    reputationScore: 8.8,
    totalAircraftCount: 8000,
    trainingCenters: [
      {
        id: 'embraer-sao-paulo',
        name: 'Embraer Training Center São Paulo',
        location: 'São Paulo, Brazil',
        country: 'Brazil',
        offers: ['E170', 'E175', 'E190', 'E195', 'E-Jets'],
        image: 'https://www.embraer.com/sites/default/files/styles/1600x900/public/2021-01/embraer-training-center.jpg',
        website: 'https://www.embraer.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '6% annually',
      keyMarkets: ['Latin America', 'Europe', 'Asia', 'North America']
    },
    salaryExpectations: {
      entryLevel: '$45,000 - $65,000',
      midLevel: '$70,000 - $100,000',
      seniorLevel: '$120,000 - $180,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Fleet Manager',
      timeline: '4-6 years to Captain, 8-12 years to senior roles'
    }
  },
  {
    id: 'bombardier',
    name: 'Bombardier',
    logo: 'https://download.logo.wine/logo/Bombardier_Inc./Bombardier_Inc.-Logo.wine.png',
    description: 'Bombardier Inc. is a Canadian multinational manufacturer of trains and aircraft. The aerospace division was sold to Airbus and Viking Air in 2020.',
    founded: 1942,
    headquarters: 'Montreal, Quebec, Canada',
    website: 'https://www.bombardier.com',
    reputationScore: 8.5,
    totalAircraftCount: 5000,
    trainingCenters: [
      {
        id: 'bombardier-montreal',
        name: 'Bombardier Training Center Montreal',
        location: 'Montreal, Canada',
        country: 'Canada',
        offers: ['CRJ Series', 'Challenger', 'Global'],
        image: 'https://www.bombardier.com/content/dam/bombardiercom/feature-stories/training-center.jpg',
        website: 'https://www.bombardier.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '3% annually',
      keyMarkets: ['North America', 'Europe', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$50,000 - $70,000',
      midLevel: '$75,000 - $110,000',
      seniorLevel: '$130,000 - $200,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Chief Pilot',
      timeline: '5-8 years to Captain, 10-15 years to senior roles'
    }
  },
  {
    id: 'gulfstream',
    name: 'Gulfstream',
    logo: 'https://download.logo.wine/logo/Gulfstream_Aerospace/Gulfstream_Aerospace-Logo.wine.png',
    description: 'Gulfstream Aerospace is an American aircraft manufacturer and a wholly owned subsidiary of General Dynamics.',
    founded: 1958,
    headquarters: 'Savannah, Georgia, USA',
    website: 'https://www.gulfstream.com',
    reputationScore: 9.3,
    totalAircraftCount: 3000,
    trainingCenters: [
      {
        id: 'gulfstream-savannah',
        name: 'Gulfstream Training Center Savannah',
        location: 'Savannah, USA',
        country: 'United States',
        offers: ['G280', 'G450', 'G550', 'G650', 'G700'],
        image: 'https://www.gulfstream.com/content/dam/gulfstream/training-center.jpg',
        website: 'https://www.gulfstream.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '7% annually',
      keyMarkets: ['North America', 'Europe', 'Middle East', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$80,000 - $120,000',
      midLevel: '$120,000 - $200,000',
      seniorLevel: '$200,000 - $400,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Director of Flight Operations',
      timeline: '5-7 years to Captain, 10-15 years to senior roles'
    }
  },
  {
    id: 'cessna',
    name: 'Cessna',
    logo: 'https://static.cdnlogo.com/logos/c/90/cessna-aircraft.png',
    description: 'Cessna is an American general aviation aircraft manufacturing corporation headquartered in Wichita, Kansas. It is now a subsidiary of Textron Aviation.',
    founded: 1927,
    headquarters: 'Wichita, Kansas, USA',
    website: 'https://www.textronaviation.com',
    reputationScore: 8.7,
    totalAircraftCount: 200000,
    trainingCenters: [
      {
        id: 'cessna-wichita',
        name: 'Cessna Training Center Wichita',
        location: 'Wichita, USA',
        country: 'United States',
        offers: ['172', '182', 'Citation', 'Caravan'],
        image: 'https://www.textronaviation.com/content/dam/textronaviation/training-center.jpg',
        website: 'https://www.textronaviation.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '4% annually',
      keyMarkets: ['North America', 'Europe', 'Asia', 'South America']
    },
    salaryExpectations: {
      entryLevel: '$35,000 - $55,000',
      midLevel: '$55,000 - $85,000',
      seniorLevel: '$90,000 - $150,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Charter Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Captain, 8-12 years to senior roles'
    }
  },
  {
    id: 'dassault-falcon',
    name: 'Dassault Falcon',
    logo: 'https://www.skyservice.com/wp-content/uploads/2023/08/dassault.png',
    description: 'Dassault Falcon is a French manufacturer of business jets and military aircraft. It is a subsidiary of Dassault Aviation.',
    founded: 1936,
    headquarters: 'Paris, France',
    website: 'https://www.dassaultfalcon.com',
    reputationScore: 9.0,
    totalAircraftCount: 2500,
    trainingCenters: [
      {
        id: 'dassault-paris',
        name: 'Dassault Falcon Training Center Paris',
        location: 'Paris, France',
        country: 'France',
        offers: ['Falcon 7X', 'Falcon 8X', 'Falcon 900', 'Falcon 2000'],
        image: 'https://www.dassaultfalcon.com/content/dam/dassaultfalcon/training-center.jpg',
        website: 'https://www.dassaultfalcon.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '5% annually',
      keyMarkets: ['Europe', 'Middle East', 'North America', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$75,000 - $110,000',
      midLevel: '$110,000 - $180,000',
      seniorLevel: '$180,000 - $350,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Fleet Manager',
      timeline: '5-8 years to Captain, 10-15 years to senior roles'
    }
  },
  {
    id: 'pilatus',
    name: 'Pilatus',
    logo: 'https://swartzaviationgroup.com/wp-content/uploads/2025/04/Pilatus.png',
    description: 'Pilatus Aircraft Ltd. is a Swiss manufacturer of aircraft and systems. It is known for its PC-12 turboprop and PC-24 business turboprop aircraft.',
    founded: 1939,
    headquarters: 'Stans, Switzerland',
    website: 'https://www.pilatus-aircraft.com',
    reputationScore: 9.1,
    totalAircraftCount: 2000,
    trainingCenters: [
      {
        id: 'pilatus-stans',
        name: 'Pilatus Training Center Stans',
        location: 'Stans, Switzerland',
        country: 'Switzerland',
        offers: ['PC-12', 'PC-24', 'PC-6'],
        image: 'https://www.pilatus-aircraft.com/content/dam/pilatus/training-center.jpg',
        website: 'https://www.pilatus-aircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '6% annually',
      keyMarkets: ['Europe', 'North America', 'Asia', 'South America']
    },
    salaryExpectations: {
      entryLevel: '$60,000 - $90,000',
      midLevel: '$90,000 - $140,000',
      seniorLevel: '$150,000 - $250,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Chief Pilot',
      timeline: '4-6 years to Captain, 8-12 years to senior roles'
    }
  },
  {
    id: 'beechcraft',
    name: 'Beechcraft',
    logo: 'https://1000logos.net/wp-content/uploads/2020/09/Beechcraft-logo.png',
    description: 'Beechcraft Corporation is an American manufacturer of general aviation and military aircraft, ranging from light single-engine aircraft to business jets.',
    founded: 1932,
    headquarters: 'Wichita, Kansas, USA',
    website: 'https://www.beechcraft.com',
    reputationScore: 8.6,
    totalAircraftCount: 50000,
    trainingCenters: [
      {
        id: 'beechcraft-wichita',
        name: 'Beechcraft Training Center Wichita',
        location: 'Wichita, USA',
        country: 'United States',
        offers: ['King Air', 'Baron', 'Bonanza', 'Premier'],
        image: 'https://www.beechcraft.com/content/dam/beechcraft/training-center.jpg',
        website: 'https://www.beechcraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '3% annually',
      keyMarkets: ['North America', 'Europe', 'South America']
    },
    salaryExpectations: {
      entryLevel: '$40,000 - $60,000',
      midLevel: '$60,000 - $90,000',
      seniorLevel: '$85,000 - $140,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Charter Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '4-6 years to Captain, 8-12 years to senior roles'
    }
  },
  {
    id: 'sikorsky',
    name: 'Sikorsky',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Sikorsky_Aircraft_Logo.png',
    description: 'Sikorsky Aircraft is an American aircraft manufacturer based in Stratford, Connecticut. It is a subsidiary of Lockheed Martin.',
    founded: 1925,
    headquarters: 'Stratford, Connecticut, USA',
    website: 'https://www.sikorsky.com',
    reputationScore: 8.9,
    totalAircraftCount: 7000,
    trainingCenters: [
      {
        id: 'sikorsky-stratford',
        name: 'Sikorsky Training Center Stratford',
        location: 'Stratford, USA',
        country: 'United States',
        offers: ['S-70', 'S-76', 'S-92', 'UH-60'],
        image: 'https://www.sikorsky.com/content/dam/sikorsky/training-center.jpg',
        website: 'https://www.sikorsky.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '5% annually',
      keyMarkets: ['North America', 'Europe', 'Asia', 'Middle East']
    },
    salaryExpectations: {
      entryLevel: '$70,000 - $100,000',
      midLevel: '$100,000 - $160,000',
      seniorLevel: '$160,000 - $300,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Co-pilot',
      midLevel: 'Pilot in Command',
      seniorLevel: 'Chief Pilot',
      timeline: '5-8 years to PIC, 10-15 years to senior roles'
    }
  },
  {
    id: 'leonardo',
    name: 'Leonardo',
    logo: 'https://iconlogovector.com/uploads/images/2025/04/lg-67fd7d3a3dbc5-Leonardo.webp',
    description: 'Leonardo S.p.A. is an Italian multinational company that produces helicopters, aircraft, and defense systems.',
    founded: 1948,
    headquarters: 'Rome, Italy',
    website: 'https://www.leonardo.com',
    reputationScore: 8.4,
    totalAircraftCount: 10000,
    trainingCenters: [
      {
        id: 'leonardo-rome',
        name: 'Leonardo Training Center Rome',
        location: 'Rome, Italy',
        country: 'Italy',
        offers: ['AW139', 'AW189', 'AW169', 'AW101'],
        image: 'https://www.leonardo.com/content/dam/leonardo/training-center.jpg',
        website: 'https://www.leonardo.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '4% annually',
      keyMarkets: ['Europe', 'Asia', 'Middle East', 'South America']
    },
    salaryExpectations: {
      entryLevel: '$55,000 - $80,000',
      midLevel: '$80,000 - $130,000',
      seniorLevel: '$130,000 - $220,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Co-pilot',
      midLevel: 'Pilot in Command',
      seniorLevel: 'Chief Pilot',
      timeline: '5-8 years to PIC, 10-15 years to senior roles'
    }
  },
  {
    id: 'atr',
    name: 'ATR',
    logo: 'https://images.seeklogo.com/logo-png/43/2/atr-logo-png_seeklogo-433115.png',
    description: 'ATR is a French-Italian aircraft manufacturer headquartered in Blagnac, France. It produces regional airliners.',
    founded: 1981,
    headquarters: 'Blagnac, France',
    website: 'https://www.atr-aircraft.com',
    reputationScore: 8.5,
    totalAircraftCount: 2500,
    trainingCenters: [
      {
        id: 'atr-toulouse',
        name: 'ATR Training Centre Toulouse',
        location: 'Toulouse, France',
        country: 'France',
        offers: ['ATR 42', 'ATR 72', 'ATR 600'],
        image: 'https://www.atr-aircraft.com/content/dam/atr/training-center-toulouse.jpg',
        website: 'https://www.atr-aircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '5% annually',
      keyMarkets: ['Europe', 'Asia', 'South America', 'Africa']
    },
    salaryExpectations: {
      entryLevel: '$45,000 - $65,000',
      midLevel: '$70,000 - $100,000',
      seniorLevel: '$110,000 - $170,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Fleet Manager',
      timeline: '4-7 years to Captain, 9-14 years to senior roles'
    }
  },
  {
    id: 'de-havilland',
    name: 'De Havilland',
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/ca/De_Havilland.png',
    description: 'De Havilland Canada was a Canadian aircraft manufacturer. The company is now part of Viking Air, which supports the DHC-8 Twin Otter and other legacy aircraft.',
    founded: 1928,
    headquarters: 'Toronto, Ontario, Canada',
    website: 'https://www.vikingair.com',
    reputationScore: 8.2,
    totalAircraftCount: 9000,
    trainingCenters: [
      {
        id: 'de-havilland-toronto',
        name: 'Viking Air Training Center Toronto',
        location: 'Toronto, Canada',
        country: 'Canada',
        offers: ['DHC-6 Twin Otter', 'DHC-8'],
        image: 'https://www.vikingair.com/content/dam/viking/training-center.jpg',
        website: 'https://www.vikingair.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'low',
      growthRate: '2% annually',
      keyMarkets: ['North America', 'South America', 'Africa']
    },
    salaryExpectations: {
      entryLevel: '$40,000 - $60,000',
      midLevel: '$60,000 - $90,000',
      seniorLevel: '$85,000 - $140,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Chief Pilot',
      timeline: '4-7 years to Captain, 9-13 years to senior roles'
    }
  },
  {
    id: 'mitsubishi-mrj',
    name: 'Mitsubishi MRJ',
    logo: 'https://image.pitchbook.com/M35hhwSoZmMCkeXDGeQYTR6rDoP1546610261630_200x200',
    description: 'Mitsubishi SpaceJet (formerly MRJ) was a regional jet project by Mitsubishi Aircraft Corporation. The program was suspended in 2020.',
    founded: 2008,
    headquarters: 'Nagoya, Japan',
    website: 'https://www.mitsubishiaircraft.com',
    reputationScore: 7.5,
    totalAircraftCount: 0,
    trainingCenters: [],
    marketDemandStatistics: {
      demandLevel: 'low',
      growthRate: '0%',
      keyMarkets: ['Asia']
    },
    salaryExpectations: {
      entryLevel: '$50,000 - $70,000',
      midLevel: '$75,000 - $110,000',
      seniorLevel: '$110,000 - $170,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Fleet Manager',
      timeline: '5-8 years to Captain, 10-15 years to senior roles'
    }
  },
  {
    id: 'comac-c919',
    name: 'COMAC C919',
    logo: 'https://www.logo.wine/a/logo/Comac/Comac-Logo.wine.svg',
    description: 'COMAC C919 is a Chinese narrow-body airliner produced by Commercial Aircraft Corporation of China (COMAC).',
    founded: 2008,
    headquarters: 'Shanghai, China',
    website: 'https://www.comac.cc',
    reputationScore: 7.8,
    totalAircraftCount: 200,
    trainingCenters: [
      {
        id: 'comac-shanghai',
        name: 'COMAC Training Center Shanghai',
        location: 'Shanghai, China',
        country: 'China',
        offers: ['C919'],
        image: 'https://www.comac.cc/content/dam/comac/training.jpg',
        website: 'https://www.comac.cc/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '8% annually',
      keyMarkets: ['China', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$45,000 - $65,000',
      midLevel: '$70,000 - $100,000',
      seniorLevel: '$110,000 - $170,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Fleet Manager',
      timeline: '5-8 years to Captain, 10-15 years to senior roles'
    }
  },
  {
    id: 'tecnam',
    name: 'Tecnam',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Primary_Logo_-_Tecnam.png',
    description: 'Tecnam is an Italian aircraft manufacturer specializing in light sport aircraft, general aviation aircraft, and twin-engine piston aircraft.',
    founded: 1948,
    headquarters: 'Capua, Italy',
    website: 'https://www.tecnam.com',
    reputationScore: 8.5,
    totalAircraftCount: 5000,
    trainingCenters: [
      {
        id: 'tecnam-capua',
        name: 'Tecnam Training Center Capua',
        location: 'Capua, Italy',
        country: 'Italy',
        offers: ['P92', 'P2002', 'P2006T'],
        image: 'https://www.tecnam.com/content/dam/tecnam/training-center.jpg',
        website: 'https://www.tecnam.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '4% annually',
      keyMarkets: ['Europe', 'North America']
    },
    salaryExpectations: {
      entryLevel: '$30,000 - $45,000',
      midLevel: '$45,000 - $65,000',
      seniorLevel: '$65,000 - $95,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Charter Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Charter Pilot, 8-12 years to senior roles'
    }
  },
  {
    id: 'piper',
    name: 'Piper',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Piper_logo.svg/1280px-Piper_logo.svg.png',
    description: 'Piper Aircraft is an American general aviation aircraft manufacturer known for their Cherokee, Archer, and Warrior series of aircraft.',
    founded: 1927,
    headquarters: 'Vero Beach, Florida, USA',
    website: 'https://www.piper.com',
    reputationScore: 9.0,
    totalAircraftCount: 90000,
    trainingCenters: [
      {
        id: 'piper-vero',
        name: 'Piper Flight Training Vero Beach',
        location: 'Vero Beach, USA',
        country: 'USA',
        offers: ['PA-28', 'PA-18', 'PA-34'],
        image: 'https://www.piper.com/content/dam/piper/training-center.jpg',
        website: 'https://www.piper.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '3% annually',
      keyMarkets: ['North America', 'Europe']
    },
    salaryExpectations: {
      entryLevel: '$35,000 - $50,000',
      midLevel: '$55,000 - $85,000',
      seniorLevel: '$80,000 - $120,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Charter Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Charter Pilot, 8-12 years to senior roles'
    }
  },
  {
    id: 'cirrus',
    name: 'Cirrus',
    logo: 'https://brandlogos.net/wp-content/uploads/2022/02/cirrus_aircraft-logo-brandlogos.net_.png',
    description: 'Cirrus Aircraft is an American aircraft manufacturer known for their SR series of single-engine piston aircraft and the Vision SF50 personal jet.',
    founded: 1984,
    headquarters: 'Duluth, Minnesota, USA',
    website: 'https://www.cirrusaircraft.com',
    reputationScore: 9.3,
    totalAircraftCount: 10000,
    trainingCenters: [
      {
        id: 'cirrus-duluth',
        name: 'Cirrus Training Center Duluth',
        location: 'Duluth, USA',
        country: 'USA',
        offers: ['SR20', 'SR22', 'Vision SF50'],
        image: 'https://www.cirrusaircraft.com/content/dam/cirrus/training-center.jpg',
        website: 'https://www.cirrusaircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '6% annually',
      keyMarkets: ['North America', 'Europe']
    },
    salaryExpectations: {
      entryLevel: '$40,000 - $60,000',
      midLevel: '$60,000 - $90,000',
      seniorLevel: '$85,000 - $130,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Charter Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Charter Pilot, 8-12 years to senior roles'
    }
  },
  {
    id: 'let',
    name: 'Let',
    logo: 'https://www.let.cz/images/logos/logo_new_s.png',
    description: 'Let Aircraft Industries is a Czech aircraft manufacturer known for their L-410 Turbolet turboprop regional airliner.',
    founded: 1936,
    headquarters: 'Kunovice, Czech Republic',
    website: 'https://www.letair.cz',
    reputationScore: 8.0,
    totalAircraftCount: 1200,
    trainingCenters: [
      {
        id: 'let-kunovice',
        name: 'Let Training Center Kunovice',
        location: 'Kunovice, Czech Republic',
        country: 'Czech Republic',
        offers: ['L-410'],
        image: 'https://www.letair.cz/content/dam/let/training-center.jpg',
        website: 'https://www.letair.cz/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'low',
      growthRate: '2% annually',
      keyMarkets: ['Europe', 'Africa', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$40,000 - $55,000',
      midLevel: '$55,000 - $75,000',
      seniorLevel: '$75,000 - $110,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Chief Pilot',
      timeline: '4-6 years to Captain, 9-12 years to senior roles'
    }
  },
  {
    id: 'aeroprakt',
    name: 'Aeroprakt',
    logo: 'https://www.aeropraktsouthafrica.co.za/img/logo.png',
    description: 'Aeroprakt is a Ukrainian aircraft manufacturer known for their A-22 Foxbat light sport aircraft.',
    founded: 1991,
    headquarters: 'Kyiv, Ukraine',
    website: 'https://www.aeroprakt.com.ua',
    reputationScore: 8.3,
    totalAircraftCount: 500,
    trainingCenters: [
      {
        id: 'aeroprakt-kyiv',
        name: 'Aeroprakt Training Center Kyiv',
        location: 'Kyiv, Ukraine',
        country: 'Ukraine',
        offers: ['A-22 Foxbat'],
        image: 'https://www.aeroprakt.com.ua/content/dam/aeroprakt/training-center.jpg',
        website: 'https://www.aeroprakt.com.ua/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'low',
      growthRate: '2% annually',
      keyMarkets: ['Europe', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$25,000 - $35,000',
      midLevel: '$35,000 - $50,000',
      seniorLevel: '$50,000 - $75,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Charter Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '2-4 years to Charter Pilot, 6-10 years to senior roles'
    }
  }
];

// Aircraft Type Ratings Data
export const aircraftTypeRatings: AircraftTypeRating[] = [
  // Airbus
  {
    id: 'a220-100',
    manufacturerId: 'airbus',
    model: 'A220-100',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1777026906/aircraft/jumdb0h50mw3g5hz0tvz.png',
    description: 'The A220-100 is the "specialist" of the family. While it shares 99% commonality with the larger -300, it is the version pilots choose for high-performance missions. It is specifically engineered for steep approaches and short runways that traditional jets can\'t touch. It occupies a niche (100-135 seats) that Boeing currently has no answer for, providing A220 pilots with unique market leverage.',
    whyChooseRating: 'The A220-100 offers pilots the quietest cockpit in the narrow-body world with full sidestick control and active feedback—no legacy cables or pulleys. It flies like a "sports car" compared to the heavier -300, offering superior climb rates and maneuverability. With 25% less CO2 emissions, it is the "greenest" rating a pilot can hold, protecting against future environmental flight caps and ensuring long-term fleet sustainability.',
    firstFlight: 2013,
    careerScore: 92,
    demandLevel: 'high',
    conditionallyNew: 'green',
    lifecycleStage: 'early-career',
    orderBacklog: { orders: 959, delivered: 501 },
    operatorCount: 25,
    totalDeliveries: 501,
    specifications: {
      maxTakeoffWeight: '63,100 kg',
      cruisingSpeed: 'Mach 0.78 (Max Mach 0.82)',
      range: '6,390 km (3,450 nm)',
      capacity: '100-135',
      engines: 2,
      engineType: '2 x Pratt & Whitney PW1500G Geared Turbofan (GTF)',
      length: '35.0 m',
      wingspan: '35.1 m',
      height: '11.5 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 40,
      flightHours: 50
    },
    trainingCurriculum: [
      {
        phase: 'Official License Endorsement',
        duration: 'BD-500 (Common to both -100 and -300 variants)',
        topics: ['Type Rating Designation']
      },
      {
        phase: 'Ground School (Phase 1)',
        duration: '2 Weeks (80+ hours)',
        topics: ['Fly-By-Wire (FBW) Logic: Normal, Direct, and Alternate laws', 'Avionics Suite: 5-screen glass cockpit and cursor control units (CCU)', 'PW1500G Systems: Geared Turbofan (GTF) architecture and cooling cycles', 'Performance & Flight Planning: FMS data entry for steep approach and short-field ops']
      },
      {
        phase: 'Simulator Training (Phase 2 - Level D FFS)',
        duration: '3 Weeks (approx. 40 hours)',
        topics: ['Automation Management: Manual flight to full Autoflight/FMS integration', 'Upset Recovery & FBW Protections: Hard Protections of the A220 envelope', 'Abnormal Ops: V1 cuts, engine fires, and flight control malfunctions', 'Specialty Certification: Category III Autoland and Steep Approach (London City Airport qualification)']
      },
      {
        phase: 'Base Training & LOFT (Phase 3)',
        duration: 'Variable',
        topics: ['Base Training: 6 Takeoffs and Landings (for pilots without previous heavy jet experience)', 'LOFT (Line Oriented Flight Training): Real-world scenario-based simulator sessions', 'IOE/Line Check: 4-6 flight sectors on the line with a Check Airman before final sign-off']
      },
      {
        phase: 'Pro-Tip',
        duration: 'Note',
        topics: ['Training footprints may be reduced for pilots already holding an Airbus FBW rating (A320/A330/A350) through Cross-Crew Qualification (CCQ) programs at select airlines']
      },
      {
        phase: 'Checkride Prep: Common Training Pitfalls',
        duration: 'Essential Knowledge',
        topics: [
          'The "Mouse" Learning Curve (Cursor Control Unit): Practice menu logic during ground school - mastery of CCD is 50% of the battle',
          'Over-Reliance on "Hard Protections": Practice manual flight raw-data skills - protections vanish in Direct Law',
          'Geared Turbofan (GTF) Engine Spool Times: Be decisive with throttles on Go-Around, understand Bowed Rotor Protection logic',
          'Steep Approach Management (LCY Ops): Trust Autothrottle logic on 5.5-degree glide slope, watch speed trend vector',
          'Glass Cockpit Information Overload: Develop disciplined Scan Pattern, focus on PFD and Navigation displays'
        ]
      },
      {
        phase: 'Checkride Ready Checklist',
        duration: 'Self-Assessment',
        topics: [
          'FMS Setup: Can you program a full flight plan, including SID/STAR change, in under 2 minutes?',
          'Memory Items: Do you know Engine Fire/Severe Damage and Abnormal Start items by heart?',
          'Automation: Do you know exactly how to drop a level of automation if flight director gives bad data?'
        ]
      }
    ],
    simulatorDetails: {
      type: 'Level D Full Flight Simulator (FFS) - Highest fidelity',
      locations: ['Montreal (CAE)', 'Miami (Airbus)', 'Atlanta (Delta)', 'Riga (airBaltic)', 'Zurich (Lufthansa)', 'Frankfurt (FTA)', 'Paris (Air France)', 'Singapore (AATC)', 'Seoul (Korean Air)'],
      features: ['6-DOF Motion: Full six-degree-of-freedom electric motion systems', 'Visual System: 200x40 degree FOV with high-definition satellite imagery', 'Onboard Instructor Station (IOS): Real-time weather, system failure injection, and flight data playback']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a220-300',
    manufacturerId: 'airbus',
    model: 'A220-300',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://accaviation.com/wp-content/uploads/2025/04/A220.jpg',
    description: 'The Airbus A220 is a modern, single-aisle aircraft family designed for the 100 to 160-seat market. Originally developed by Bombardier as the CSeries, it was rebranded as the A220 after Airbus acquired a majority stake in July 2018. Known for high efficiency, advanced Fly-By-Wire cockpit, and superior passenger comfort. The A220-300 is tailored for larger markets with typical seating of 120-150 passengers. As of March 2026, there are 501 aircraft delivered and 25 commercial operators worldwide. Delta Air Lines leads with 85 active A220s, followed by JetBlue (61), Air France (55), Breeze Airways (54), and airBaltic (54).',
    whyChooseRating: 'With advanced fly-by-wire systems, fuel efficiency, and growing airline adoption worldwide, the A220-300 type rating offers pilots excellent career opportunities. The aircraft\'s modern cockpit and commonality with Airbus systems provide a solid foundation for progression to larger Airbus aircraft like the A320neo and A350 families. Pilots rated on the A220-300 gain access to a rapidly expanding fleet with strong demand across Europe, Asia, and North America.',
    demandLevel: 'high',
    conditionallyNew: 'green',
    lifecycleStage: 'early-career',
    orderBacklog: { orders: 900, delivered: 501 },
    operatorCount: 25,
    totalDeliveries: 501,
    steepApproachCertified: true,
    engineType: 'Pratt & Whitney PW1500G GTF',
    rangeVersatility: 'versatile',
    cabinFeatures: ['Lower cabin altitude', 'Larger windows', '2-3 seating', 'XL overhead bins'],
    news: [
      {
        id: 'news-1',
        title: 'Airbus A220 Production Rate to Reach 14 Aircraft per Month by End of 2026',
        date: '2026-04-20',
        summary: 'Airbus has updated its production plans for the A220 program, aiming to reach a rate of 14 aircraft per month to meet high demand, with the ramp-up expected to reach its peak by the end of 2026 or into 2027, according to updated reports following supply chain improvements.',
        url: 'https://www.airbus.com/en/newsroom/stories/2026-04-a220-production-ramp-up'
      },
      {
        id: 'news-2',
        title: 'Delta Air Lines A220 Fleet Commitment Reaches 145 Aircraft',
        date: '2026-04-10',
        summary: 'As of April 2026, Delta Air Lines total firm commitment to the Airbus A220 family stands at 145 aircraft. Official records and recent aviation reports from 2026 confirm Delta continues to expand its A220 fleet as part of its modernization strategy.',
        url: 'https://news.delta.com/2026-04-delta-a220-fleet-update'
      },
      {
        id: 'news-3',
        title: 'A220 Program Officially Passes 500th Delivery Milestone',
        date: '2026-04-05',
        summary: 'The Airbus A220 program officially passed its 500th delivery milestone in April 2026, with the total reaching 501 aircraft by the end of March 2026. Long-time customer airBaltic was recognized as the recipient of the 500th aircraft, strengthening its position as the world\'s largest operator of the A220 type.',
        url: 'https://www.flightglobal.com/2026-04-a220-500-delivery-milestone'
      }
    ],
    careerScore: 92,
    pilotCount: 5000,
    firstFlight: 2015,
    specifications: {
      maxTakeoffWeight: '70,900 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '6,300 km',
      capacity: 160,
      engines: 2,
      engineType: 'Pratt & Whitney PW1500G',
      length: '38.7 m',
      wingspan: '35.1 m',
      height: '11.5 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a320',
    manufacturerId: 'airbus',
    model: 'A320',
    category: 'flagship',
    subcategory: 'versatile-champion',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'ae3d357729a44f278f9ef9326977504a',
    description: 'The Airbus A320 is the world\'s best-selling airliner family and the pioneer of digital Fly-By-Wire technology in commercial aviation. It replaced traditional cables and pulleys with electronic signals and a sidestick controller, setting the standard for every subsequent Airbus model. Today, the A320neo variant offers 20% lower fuel burn, making it the primary choice for airlines worldwide.',
    whyChooseRating: 'An A320 rating is the most portable credential in aviation. With one landing or takeoff occurring every two seconds globally, job security is unrivaled. Pilots rated on the A320 can transition to the widebody A330 or A350 in as little as 8-10 days due to cockpit commonality through Cross-Crew Qualification (CCQ).',
    firstFlight: 1987,
    careerScore: 98,
    demandLevel: 'high',
    conditionallyNew: 'green',
    lifecycleStage: 'mid-career',
    orderBacklog: { orders: 6000, delivered: 12000 },
    operatorCount: 375,
    totalDeliveries: 12000,
    specifications: {
      maxTakeoffWeight: '78,000 kg (CEO) / 79,000 kg (NEO)',
      cruisingSpeed: 'Mach 0.78 (Max Mach 0.82)',
      range: '6,200 km (CEO) / 6,400 km (NEO)',
      capacity: '150-180',
      engines: 2,
      engineType: 'CEO: CFM56 or IAE V2500 / NEO: Pratt & Whitney PW1100G or CFM LEAP-1A',
      length: '37.57 m',
      wingspan: '35.8 m (with Sharklets)',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 40,
      flightHours: 50
    },
    trainingCurriculum: [
      {
        phase: 'Ground School (Phase 1)',
        duration: '4 Weeks',
        topics: ['Systems: Deep dive into Hydraulics, Electrics, and the Electronic Centralized Aircraft Monitor (ECAM)', 'Fly-By-Wire Logic: Understanding Normal, Alternate, and Direct flight laws', 'FMGS: Navigation, performance database entry, and managed vs. selected guidance']
      },
      {
        phase: 'Simulator Training (Phase 2 - Level D FFS)',
        duration: '3 Weeks',
        topics: ['Normal Operations: Cold & Dark setup, auto-flight management, and cockpit flows', 'Non-Normal Ops: Engine failures (V1 cuts), hydraulic losses, and dual-FMGC failures', 'Emergency Procedures: Smoke/Fire/Fumes and Emergency Descents', 'Checkride: A 4-hour evaluation by an authorized TRE (Type Rating Examiner)']
      },
      {
        phase: 'Flight Training (Phase 3)',
        duration: 'Variable',
        topics: ['Base Training: 6 Takeoffs and Landings on the actual aircraft (for first-time jet pilots)', 'IOE (Initial Operating Experience): Flying regular passenger routes under the supervision of a Line Training Captain']
      },
      {
        phase: 'Pilot Recognition Tip',
        duration: 'Note',
        topics: ['The A320 uses a Common Cockpit philosophy. Once a pilot holds this rating, they are eligible for Shortened Transition Training to the A330, A340, or A350 through CCQ (Cross-Crew Qualification)']
      },
      {
        phase: 'Checkride Prep: Common Training Pitfalls',
        duration: 'Essential Knowledge',
        topics: [
          'ECAM Discipline (The Golden Rule): Pilot Flying (PF) must fly while Pilot Monitoring (PM) performs ECAM actions only after PF confirms "ECAM Actions"',
          'FMA Oversight: Every time you make a change, you must read the Flight Mode Annunciator (FMA) - if you don\'t say the mode out loud, the computer is flying',
          'Managed vs. Selected Guidance: "Push to give it to the computer (Managed), Pull to take it yourself (Selected)" - don\'t mix them up',
          'Sidestick Over-Controlling: A320 is "Neutral Stability" - make a correction and let go, don\'t pump the stick',
          'Alpha Floor Surprise: To disconnect Alpha Floor, push intuitive disconnect buttons on thrust levers and move to idle detent'
        ]
      },
      {
        phase: 'Checkride Ready Checklist',
        duration: 'Self-Assessment',
        topics: [
          'Hand-Flying: Can you fly a raw-data ILS (no flight director, no autothrust) without exceeding +/- 1 dot of deviation?',
          'Engine Failure at V1: Are you staying on centerline using the Beta Target (blue trapezoid) rather than looking outside?',
          'Landing Technique: Are you starting the flare at 20-30 feet and hearing the "Retard" callout before moving levers to idle?'
        ]
      }
    ],
    simulatorDetails: {
      type: 'Level D Full Flight Simulator (FFS) - The gold standard for "Zero Flight Time Training" (ZFTT)',
      locations: ['Toulouse (Airbus)', 'Miami (Airbus/CAE)', 'Singapore (AATC)', 'Beijing (Airbus)', 'Hamburg', 'Dubai (Emirates/CAE)', 'Phoenix', 'Madrid (Airbus)', 'Delhi/Gurugram (Air India/IndiGo)'],
      features: ['6-DOF Motion: Electric motion actuators for precise flight feel', 'Visual System: High-definition 200° collimated visual displays', 'Instructor Station: Tablet-controlled scenario injection (Windshear, Bird Strikes, Systems Failures)']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330',
    manufacturerId: 'airbus',
    model: 'A330',
    category: 'flagship',
    subcategory: 'widebody',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The A330 is one of the most successful wide-body aircraft in history. It was designed alongside the four-engine A340, sharing a near-identical flight deck. Today, the family has evolved into the A330neo (-800 and -900 variants), which uses Rolls-Royce Trent 7000 engines and A350-style wings to fly further and more efficiently. For pilots, the A330 offers a seamless step up from the A320 with minimal "Difference Training."',
    whyChooseRating: 'The A330 rating is a "passport" to global wide-body carriers. It is the backbone of major carriers like Delta, Cathay Pacific, Qatar Airways, and Turkish Airlines. For A320-rated pilots, the transition is famously smooth via Cross-Crew Qualification (CCQ) - only 8-10 working days of training instead of a full month-long type rating.',
    firstFlight: 1992,
    careerScore: 94,
    demandLevel: 'high',
    conditionallyNew: 'green',
    lifecycleStage: 'mid-career',
    orderBacklog: { orders: 300, delivered: 1500 },
    operatorCount: 120,
    totalDeliveries: 1500,
    specifications: {
      maxTakeoffWeight: '242,000 kg (A330-300/900)',
      cruisingSpeed: 'Mach 0.82 (Max Mach 0.86)',
      range: '11,750 km (ceo) / 13,334 km (neo)',
      capacity: '250-300',
      engines: 2,
      engineType: 'A330ceo: GE CF6-80E1, Pratt & Whitney PW4000, or RR Trent 700 / A330neo: Rolls-Royce Trent 7000',
      length: '58.8 m (-200) / 63.6 m (-300/900)',
      wingspan: '64 m (neo)',
      height: '17.4 m'
    },
    trainingRequirements: {
      minimumHours: 3000,
      requiredLicenses: ['ATPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 40,
      flightHours: 50
    },
    trainingCurriculum: [
      {
        phase: 'Ground School (4 Weeks)',
        duration: '4 Weeks',
        topics: ['A330 Systems', 'Wide-body Performance', 'Fuel System (Trim Tank)', 'Weight & Balance']
      },
      {
        phase: 'Simulator Training (3 Weeks)',
        duration: '3 Weeks',
        topics: ['Normal Operations', 'Non-Normal Procedures', 'Emergency Procedures', 'Engine Failures']
      },
      {
        phase: 'Flight Training (2 Weeks)',
        duration: '2 Weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      },
      {
        phase: 'Cross-Crew Qualification (CCQ) Secret',
        duration: '8-10 Days for A320-rated pilots',
        topics: ['If already A320 rated, pilots do not need a full month-long type rating', 'CCQ Course: Only 8-10 working days', 'Flight laws, sidestick feel, and ECAM logic are virtually identical', 'Primary differences: larger physical size, fuel system (trim tank), and weight-related performance']
      }
    ],
    simulatorDetails: {
      type: 'Level D Full Flight Simulator (FFS)',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai', 'Hong Kong', 'Bangalore'],
      features: ['A330/A340 Commonality training', 'Upset Prevention Recovery Training (UPRT)', '6-DOF Motion', 'High-Definition Visual Systems']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a318',
    manufacturerId: 'airbus',
    model: 'A318',
    category: 'flagship',
    subcategory: 'legacy-fading',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A318 is the smallest member of the A320 family, known as the "Baby Bus". It was designed for short-haul routes with limited passenger demand.',
    firstFlight: 2002,
    specifications: {
      maxTakeoffWeight: '68,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '5,950 km',
      capacity: 132,
      engines: 2,
      engineType: 'CFM56-5B',
      length: '31.44 m',
      wingspan: '34.1 m',
      height: '12.56 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a319',
    manufacturerId: 'airbus',
    model: 'A319',
    category: 'flagship',
    subcategory: 'legacy-fading',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A319 is a shortened version of the A320, designed for routes with lower passenger demand while maintaining the A320 family\'s commonality.',
    firstFlight: 1995,
    specifications: {
      maxTakeoffWeight: '75,500 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '6,700 km',
      capacity: 156,
      engines: 2,
      engineType: 'CFM56 or V2500',
      length: '33.84 m',
      wingspan: '34.1 m',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321',
    manufacturerId: 'airbus',
    model: 'A321',
    category: 'flagship',
    subcategory: 'legacy-fading',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A321 is the stretched, highest-capacity version of the A320 family, designed for medium-haul routes with higher passenger demand.',
    firstFlight: 1993,
    specifications: {
      maxTakeoffWeight: '93,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '5,950 km',
      capacity: 220,
      engines: 2,
      engineType: 'CFM56 or V2500',
      length: '44.51 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Beijing'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a319neo',
    manufacturerId: 'airbus',
    model: 'A319neo',
    category: 'commercial',
    subcategory: 'narrow-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A319neo is the upgraded A319 featuring larger, more efficient engines and aerodynamic "Sharklets" for improved fuel efficiency.',
    firstFlight: 2017,
    specifications: {
      maxTakeoffWeight: '79,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '7,200 km',
      capacity: 160,
      engines: 2,
      engineType: 'CFM LEAP-1A or PW1100G',
      length: '33.84 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a320neo',
    manufacturerId: 'airbus',
    model: 'A320neo',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A320neo is the backbone of global low-cost carriers like IndiGo and Air India. It is the most frequent choice for fresh pilots due to high hiring volume.',
    firstFlight: 2015,
    specifications: {
      maxTakeoffWeight: '79,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '6,850 km',
      capacity: 180,
      engines: 2,
      engineType: 'CFM LEAP-1A or PW1100G',
      length: '37.57 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Beijing'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321neo',
    manufacturerId: 'airbus',
    model: 'A321neo',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A321neo is the current "king" of narrow-body jets. With the introduction of the A321XLR, pilots can now fly 11-hour transatlantic routes previously reserved for widebodies, making this rating highly lucrative.',
    firstFlight: 2016,
    specifications: {
      maxTakeoffWeight: '97,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '6,150 km',
      capacity: 240,
      engines: 2,
      engineType: 'CFM LEAP-1A or Pratt & Whitney PW1100G',
      length: '44.51 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Beijing'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321lr',
    manufacturerId: 'airbus',
    model: 'A321LR',
    category: 'commercial',
    subcategory: 'narrow-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A321LR (Long Range) is a modified A321neo with extra fuel tanks, enabling transatlantic flights and long-haul routes.',
    firstFlight: 2018,
    specifications: {
      maxTakeoffWeight: '97,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '7,400 km',
      capacity: 206,
      engines: 2,
      engineType: 'CFM LEAP-1A or PW1100G',
      length: '44.51 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321xlr',
    manufacturerId: 'airbus',
    model: 'A321XLR',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A321XLR is a game-changer in 2026 that allows single-aisle pilots to earn "long-haul" pay scales with 11-hour transatlantic capability.',
    firstFlight: 2022,
    specifications: {
      maxTakeoffWeight: '101,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '8,700 km',
      capacity: 244,
      engines: 2,
      engineType: 'CFM LEAP-1A or PW1100G',
      length: '44.51 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330',
    manufacturerId: 'airbus',
    model: 'A330',
    category: 'commercial',
    subcategory: 'wide-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '50c4ed883e00436e80a3f1c8048f549f',
    description: 'The Airbus A330 is a wide-body, twin-engine jet airliner. It was designed to replace the earlier A300.',
    firstFlight: 1992,
    specifications: {
      maxTakeoffWeight: '242,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '13,430 km',
      capacity: 335,
      engines: 2,
      engineType: 'CF6-80E1 or Trent 700',
      length: '63.66 m',
      wingspan: '60.3 m',
      height: '16.79 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-200',
    manufacturerId: 'airbus',
    model: 'A330-200',
    category: 'commercial',
    subcategory: 'wide-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A330-200 is the shorter fuselage, longer-range variant of the A330 family, designed for medium-to-long-haul routes.',
    firstFlight: 1997,
    specifications: {
      maxTakeoffWeight: '233,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '13,450 km',
      capacity: 253,
      engines: 2,
      engineType: 'CF6-80E1 or Trent 772',
      length: '58.82 m',
      wingspan: '60.3 m',
      height: '17.39 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-300',
    manufacturerId: 'airbus',
    model: 'A330-300',
    category: 'flagship',
    subcategory: 'legacy-fading',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A330-300ceo is an older generation that remains heavily in service with a large pool of rated pilots, often serving as a bridge to the A350.',
    firstFlight: 1992,
    specifications: {
      maxTakeoffWeight: '242,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '11,750 km',
      capacity: 335,
      engines: 2,
      engineType: 'CF6-80E1 or Trent 772',
      length: '63.66 m',
      wingspan: '60.3 m',
      height: '16.79 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-800',
    manufacturerId: 'airbus',
    model: 'A330-800',
    category: 'commercial',
    subcategory: 'wide-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A330-800 is the upgraded A330-200 featuring Rolls-Royce Trent 7000 engines and aerodynamic improvements for better fuel efficiency.',
    firstFlight: 2018,
    specifications: {
      maxTakeoffWeight: '251,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '15,090 km',
      capacity: 257,
      engines: 2,
      engineType: 'Rolls-Royce Trent 7000',
      length: '58.82 m',
      wingspan: '64.0 m',
      height: '17.39 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-900',
    manufacturerId: 'airbus',
    model: 'A330-900',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A330-900neo is a fuel-efficient widebody favorite for airlines like Delta Air Lines and TAP Air Portugal.',
    firstFlight: 2017,
    specifications: {
      maxTakeoffWeight: '251,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '13,330 km',
      capacity: 336,
      engines: 2,
      engineType: 'Rolls-Royce Trent 7000',
      length: '63.66 m',
      wingspan: '64.31 m',
      height: '16.79 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350',
    manufacturerId: 'airbus',
    model: 'A350',
    category: 'commercial',
    subcategory: 'wide-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '0703224a1a7e497eaa2a860e1d3b1774',
    description: 'The Airbus A350 is a long-range, wide-body, twin-engine jet airliner. It is the first Airbus aircraft with both fuselage and wing structures made primarily of carbon-fiber-reinforced polymer.',
    firstFlight: 2013,
    specifications: {
      maxTakeoffWeight: '280,000 kg',
      cruisingSpeed: 'Mach 0.85',
      range: '15,000 km',
      capacity: 369,
      engines: 2,
      engineType: 'Trent XWB',
      length: '67.09 m',
      wingspan: '64.31 m',
      height: '17.08 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350-900',
    manufacturerId: 'airbus',
    model: 'A350-900',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A350-900 is a highly sought-after long-haul rating. It shares a Common Type Rating with the A330, allowing pilots to fly both with only eight days of additional training.',
    firstFlight: 2013,
    specifications: {
      maxTakeoffWeight: '280,000 kg',
      cruisingSpeed: 'Mach 0.85',
      range: '15,000 km',
      capacity: 325,
      engines: 2,
      engineType: 'Trent XWB-84',
      length: '66.80 m',
      wingspan: '64.31 m',
      height: '17.05 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350f',
    manufacturerId: 'airbus',
    model: 'A350F',
    category: 'cargo',
    subcategory: 'production-freighter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A350F is the newest flagship freighter entering service in 2026. It is a clean-sheet freighter designed to replace the Boeing 777F, featuring a massive main deck cargo door and carbon-fiber technology for maximum efficiency.',
    firstFlight: 2024,
    specifications: {
      maxTakeoffWeight: '351,000 kg',
      cruisingSpeed: 'Mach 0.84',
      range: '9,700 km',
      capacity: 111000,
      engines: 2,
      engineType: 'Trent XWB-97',
      length: '70.80 m',
      wingspan: '64.31 m',
      height: '17.75 m'
    },
    trainingRequirements: {
      minimumHours: 3000,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 35,
      flightHours: 20
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '120 hours',
        topics: ['Cargo Systems', 'Loading Procedures', 'Weight & Balance', 'Dangerous Goods']
      },
      {
        phase: 'Simulator Training',
        duration: '35 hours',
        topics: ['Cargo Operations', 'Loading Techniques', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '20 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Cargo Handling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321p2f',
    manufacturerId: 'airbus',
    model: 'A321P2F',
    category: 'cargo',
    subcategory: 'p2f-freighter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A321P2F is the modernized "iPhone of cargo" - a narrow-body passenger-to-freighter conversion rapidly replacing older Boeing 737 freighters for short-range express delivery with operators like DHL and Qantas.',
    firstFlight: 2020,
    specifications: {
      maxTakeoffWeight: '93,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '3,700 km',
      capacity: 28000,
      engines: 2,
      engineType: 'CFM56-5B or V2533-A5',
      length: '44.51 m',
      wingspan: '35.80 m',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '80 hours',
        topics: ['Cargo Systems', 'Loading Procedures', 'Weight & Balance', 'Narrow-body Operations']
      },
      {
        phase: 'Simulator Training',
        duration: '20 hours',
        topics: ['Cargo Operations', 'Loading Techniques', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '10 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Cargo Handling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a320p2f',
    manufacturerId: 'airbus',
    model: 'A320P2F',
    category: 'cargo',
    subcategory: 'p2f-freighter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A320P2F is the smaller sibling of the A321P2F, a narrow-body passenger-to-freighter conversion used for lower-volume regional cargo routes.',
    firstFlight: 2019,
    specifications: {
      maxTakeoffWeight: '78,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '3,700 km',
      capacity: 21000,
      engines: 2,
      engineType: 'CFM56-5B or V2527-A5',
      length: '37.57 m',
      wingspan: '35.80 m',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '80 hours',
        topics: ['Cargo Systems', 'Loading Procedures', 'Weight & Balance', 'Narrow-body Operations']
      },
      {
        phase: 'Simulator Training',
        duration: '20 hours',
        topics: ['Cargo Operations', 'Loading Techniques', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '10 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Cargo Handling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-300p2f',
    manufacturerId: 'airbus',
    model: 'A330-300P2F',
    category: 'cargo',
    subcategory: 'p2f-freighter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A330-300P2F is the most popular medium-to-long-range freighter conversion today, offering high volume and excellent efficiency for e-commerce with operators like FedEx, UPS, and DHL.',
    firstFlight: 2017,
    specifications: {
      maxTakeoffWeight: '242,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '7,400 km',
      capacity: 70000,
      engines: 2,
      engineType: 'Trent 772B or CF6-80E1',
      length: '63.66 m',
      wingspan: '60.30 m',
      height: '16.79 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 25,
      flightHours: 15
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '100 hours',
        topics: ['Cargo Systems', 'Loading Procedures', 'Weight & Balance', 'Wide-body Operations']
      },
      {
        phase: 'Simulator Training',
        duration: '25 hours',
        topics: ['Cargo Operations', 'Loading Techniques', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '15 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Cargo Handling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['800 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-200f',
    manufacturerId: 'airbus',
    model: 'A330-200F',
    category: 'cargo',
    subcategory: 'production-freighter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A330-200F is one of the few wide-body aircraft originally built by Airbus as a freighter from day one, featuring a distinctive "nose bubble" to keep the cargo floor level on the ground.',
    firstFlight: 2009,
    specifications: {
      maxTakeoffWeight: '233,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '7,400 km',
      capacity: 70000,
      engines: 2,
      engineType: 'Trent 772B or CF6-80E1',
      length: '58.82 m',
      wingspan: '60.30 m',
      height: '16.79 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 25,
      flightHours: 15
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '100 hours',
        topics: ['Cargo Systems', 'Loading Procedures', 'Weight & Balance', 'Production Freighter Systems']
      },
      {
        phase: 'Simulator Training',
        duration: '25 hours',
        topics: ['Cargo Operations', 'Loading Techniques', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '15 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Cargo Handling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['800 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-200p2f',
    manufacturerId: 'airbus',
    model: 'A330-200P2F',
    category: 'cargo',
    subcategory: 'p2f-freighter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A330-200P2F is a converted version of the A330-200, offering longer range than the -300P2F but slightly less volume for medium-to-long-range cargo operations.',
    firstFlight: 2018,
    specifications: {
      maxTakeoffWeight: '233,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '8,000 km',
      capacity: 65000,
      engines: 2,
      engineType: 'Trent 772B or CF6-80E1',
      length: '58.82 m',
      wingspan: '60.30 m',
      height: '16.79 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 25,
      flightHours: 15
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '100 hours',
        topics: ['Cargo Systems', 'Loading Procedures', 'Weight & Balance', 'Wide-body Operations']
      },
      {
        phase: 'Simulator Training',
        duration: '25 hours',
        topics: ['Cargo Operations', 'Loading Techniques', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '15 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Cargo Handling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['800 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300-600f',
    manufacturerId: 'airbus',
    model: 'A300-600F',
    category: 'cargo',
    subcategory: 'production-freighter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A300-600F is the "Grandfather" of the fleet, a reliable but aging heavy lifter. UPS and FedEx still operate large numbers, but many carriers completed final retirements in 2025/early 2026. Most will be phased out by the end of the decade.',
    firstFlight: 1983,
    specifications: {
      maxTakeoffWeight: '170,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '5,500 km',
      capacity: 50000,
      engines: 2,
      engineType: 'CF6-80C2 or PW4158',
      length: '54.10 m',
      wingspan: '44.84 m',
      height: '16.54 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 20,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '80 hours',
        topics: ['Cargo Systems', 'Loading Procedures', 'Weight & Balance', 'Legacy Systems']
      },
      {
        phase: 'Simulator Training',
        duration: '20 hours',
        topics: ['Cargo Operations', 'Loading Techniques', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '12 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Cargo Handling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310-300f',
    manufacturerId: 'airbus',
    model: 'A310-300F',
    category: 'cargo',
    subcategory: 'production-freighter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A310-300F is a legacy freighter about to retire. Very few remain in commercial service, mostly used by niche regional cargo airlines or as military transports.',
    firstFlight: 1985,
    specifications: {
      maxTakeoffWeight: '164,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '5,200 km',
      capacity: 40000,
      engines: 2,
      engineType: 'CF6-80C2 or PW4156',
      length: '46.66 m',
      wingspan: '43.90 m',
      height: '15.80 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 20,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '80 hours',
        topics: ['Cargo Systems', 'Loading Procedures', 'Weight & Balance', 'Legacy Systems']
      },
      {
        phase: 'Simulator Training',
        duration: '20 hours',
        topics: ['Cargo Operations', 'Loading Techniques', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '12 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Cargo Handling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'belugaxl',
    manufacturerId: 'airbus',
    model: 'BelugaXL (A330-743L)',
    category: 'cargo',
    subcategory: 'outsize-transport',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus BelugaXL (A330-743L) is the newest "Mega-Lifter" for Airbus internal logistics. Six are currently in service, handling the massive parts like wings and fuselages for the A350 and A320 programs between Airbus factories.',
    firstFlight: 2018,
    specifications: {
      maxTakeoffWeight: '227,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '4,000 km',
      capacity: 53000,
      engines: 2,
      engineType: 'Trent 772B',
      length: '63.10 m',
      wingspan: '60.30 m',
      height: '18.90 m'
    },
    trainingRequirements: {
      minimumHours: 3000,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 30,
      flightHours: 18
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '120 hours',
        topics: ['Outsize Cargo Systems', 'Loading Procedures', 'Weight & Balance', 'Airbus Logistics']
      },
      {
        phase: 'Simulator Training',
        duration: '30 hours',
        topics: ['Outsize Cargo Operations', 'Loading Techniques', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '18 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Outsize Cargo Handling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Outsize Cargo Loading Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Airbus Logistics rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'belugast',
    manufacturerId: 'airbus',
    model: 'BelugaST (A300-600ST)',
    category: 'cargo',
    subcategory: 'outsize-transport',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus BelugaST (A300-600ST) is the original "Mega-Lifter" that is now legacy/retired. Airbus officially began retiring this fleet in 2025. As of January 2026, Beluga #5 performed its final flight. Only 1 or 2 remain operational for "Airbus Beluga Transport" missions in their final months of service.',
    firstFlight: 1994,
    specifications: {
      maxTakeoffWeight: '155,000 kg',
      cruisingSpeed: 'Mach 0.70',
      range: '2,800 km',
      capacity: 47000,
      engines: 2,
      engineType: 'CF6-80C2',
      length: '56.15 m',
      wingspan: '44.84 m',
      height: '17.24 m'
    },
    trainingRequirements: {
      minimumHours: 3000,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 30,
      flightHours: 18
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '120 hours',
        topics: ['Outsize Cargo Systems', 'Loading Procedures', 'Weight & Balance', 'Airbus Logistics']
      },
      {
        phase: 'Simulator Training',
        duration: '30 hours',
        topics: ['Outsize Cargo Operations', 'Loading Techniques', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '18 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Outsize Cargo Handling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Outsize Cargo Loading Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Airbus Logistics rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300-cargo',
    manufacturerId: 'airbus',
    model: 'A300 B2/B4 Cargo',
    category: 'cargo',
    subcategory: 'historical-cargo',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A300 B2/B4 Cargo are the original 1970s conversions. None are in active commercial service today. They exist only in memories or museums as historical aircraft.',
    firstFlight: 1972,
    specifications: {
      maxTakeoffWeight: '142,000 kg',
      cruisingSpeed: 'Mach 0.75',
      range: '4,000 km',
      capacity: 35000,
      engines: 2,
      engineType: 'CF6-50C or JT9D-7R4',
      length: '53.75 m',
      wingspan: '44.84 m',
      height: '16.54 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 20,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '80 hours',
        topics: ['Cargo Systems', 'Loading Procedures', 'Weight & Balance', 'Historical Systems']
      },
      {
        phase: 'Simulator Training',
        duration: '20 hours',
        topics: ['Cargo Operations', 'Loading Techniques', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '12 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Cargo Handling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'super-guppy',
    manufacturerId: 'airbus',
    model: 'Super Guppy',
    category: 'cargo',
    subcategory: 'historical-cargo',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Super Guppy was the NASA/Airbus predecessor to the Beluga. Airbus retired its last one in the 1990s (though NASA still flies one). It was a specialized outsize transport aircraft with a uniquely enlarged fuselage for carrying large aerospace components.',
    firstFlight: 1965,
    specifications: {
      maxTakeoffWeight: '77,111 kg',
      cruisingSpeed: 'Mach 0.50',
      range: '2,000 km',
      capacity: 24000,
      engines: 4,
      engineType: 'Turboprop',
      length: '43.84 m',
      wingspan: '47.62 m',
      height: '14.78 m'
    },
    trainingRequirements: {
      minimumHours: 3000,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 30,
      flightHours: 18
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '120 hours',
        topics: ['Outsize Cargo Systems', 'Loading Procedures', 'Weight & Balance', 'Historical Systems']
      },
      {
        phase: 'Simulator Training',
        duration: '30 hours',
        topics: ['Outsize Cargo Operations', 'Loading Techniques', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '18 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Outsize Cargo Handling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Outsize Cargo Loading Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Historical Cargo rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350-900ulr',
    manufacturerId: 'airbus',
    model: 'A350-900ULR',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A350-900ULR (Ultra Long Range) is a variant capable of flying the world\'s longest routes, currently used by Singapore Airlines for non-stop flights between Singapore and New York. It is the flagship of long-range aviation.',
    firstFlight: 2018,
    specifications: {
      maxTakeoffWeight: '280,000 kg',
      cruisingSpeed: 'Mach 0.85',
      range: '18,000 km',
      capacity: 161,
      engines: 2,
      engineType: 'Trent XWB-97',
      length: '66.80 m',
      wingspan: '64.31 m',
      height: '17.05 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Ultra-Long-Range Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350-1000',
    manufacturerId: 'airbus',
    model: 'A350-1000',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A350-1000 is the stretched, highest-capacity model of the A350 family, featuring advanced carbon-composite construction. It is the flagship of Airbus\'s current wide-body lineup.',
    firstFlight: 2016,
    specifications: {
      maxTakeoffWeight: '319,000 kg',
      cruisingSpeed: 'Mach 0.85',
      range: '16,100 km',
      capacity: 440,
      engines: 2,
      engineType: 'Trent XWB-97',
      length: '73.79 m',
      wingspan: '64.31 m',
      height: '17.08 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a380',
    manufacturerId: 'airbus',
    model: 'A380',
    category: 'flagship',
    subcategory: 'resurgent',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'b4fbb839e6b4bb989422426bfc8fd1c',
    description: 'The Airbus A380 is the iconic double-decker quad-engine jet, the largest commercial passenger aircraft ever built. While production ended in 2021, it remains the flagship of Airbus engineering excellence.',
    firstFlight: 2005,
    specifications: {
      maxTakeoffWeight: '575,000 kg',
      cruisingSpeed: 'Mach 0.85',
      range: '15,700 km',
      capacity: 555,
      engines: 4,
      engineType: 'GP7200 or Trent 900',
      length: '72.72 m',
      wingspan: '79.75 m',
      height: '24.09 m'
    },
    trainingRequirements: {
      minimumHours: 3000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 200,
      simulatorHours: 32,
      flightHours: 16
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '8 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '6 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a340-200',
    manufacturerId: 'airbus',
    model: 'A340-200',
    category: 'flagship',
    subcategory: 'historical-flagship',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A340-200 is the initial version of the A340 family, a four-engine long-haul airliner developed to bypass early twin-engine flight restrictions. End of Life. No commercial airline flies this version anymore. Only 28 were ever built, and the last few were used as government "Air Force One" style planes for countries like Egypt or Qatar, but even those have largely been replaced by modern A350s.',
    firstFlight: 1991,
    specifications: {
      maxTakeoffWeight: '275,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '14,800 km',
      capacity: 239,
      engines: 4,
      engineType: 'CFM56-5C4',
      length: '59.39 m',
      wingspan: '60.3 m',
      height: '16.84 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a340-300',
    manufacturerId: 'airbus',
    model: 'A340-300',
    category: 'legacy',
    subcategory: 'wide-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A340-300 is the most popular variant of the A340 family, featuring a longer fuselage and higher capacity. Production ended in 2011.',
    firstFlight: 1991,
    specifications: {
      maxTakeoffWeight: '275,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '13,700 km',
      capacity: 295,
      engines: 4,
      engineType: 'CFM56-5C4',
      length: '63.60 m',
      wingspan: '60.3 m',
      height: '16.84 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a340-500',
    manufacturerId: 'airbus',
    model: 'A340-500',
    category: 'flagship',
    subcategory: 'historical-flagship',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A340-500 is the ultra-long-range version of the A340 family with a stretched fuselage. Almost Extinct. This was a "niche" ultra-long-range plane. Almost every airline has retired them because they have four engines and burn too much fuel. Only a tiny handful exist as private VIP jets.',
    firstFlight: 2002,
    specifications: {
      maxTakeoffWeight: '368,000 kg',
      cruisingSpeed: 'Mach 0.83',
      range: '16,700 km',
      capacity: 313,
      engines: 4,
      engineType: 'Trent 553',
      length: '67.90 m',
      wingspan: '63.45 m',
      height: '17.10 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Ultra-Long-Range Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300-passenger',
    manufacturerId: 'airbus',
    model: 'A300',
    category: 'flagship',
    subcategory: 'historical-flagship',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A300 was the first twin-engine wide-body aircraft, a pioneer in modern aviation. Once the flagship wide-body of the 80s and 90s, it now only flies in cargo or specialized military roles.',
    firstFlight: 1972,
    specifications: {
      maxTakeoffWeight: '142,000 kg',
      cruisingSpeed: 'Mach 0.75',
      range: '4,000 km',
      capacity: 250,
      engines: 2,
      engineType: 'CF6-50C or JT9D-7R4',
      length: '53.75 m',
      wingspan: '44.84 m',
      height: '16.54 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '120 hours',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '24 hours',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '12 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Wide-body Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310-passenger',
    manufacturerId: 'airbus',
    model: 'A310',
    category: 'flagship',
    subcategory: 'historical-flagship',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A310 was a smaller version of the A300, designed for medium-haul routes. Once the flagship wide-body of the 80s and 90s, it now only flies in cargo or specialized military roles.',
    firstFlight: 1982,
    specifications: {
      maxTakeoffWeight: '164,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '5,200 km',
      capacity: 220,
      engines: 2,
      engineType: 'CF6-80C2 or PW4156',
      length: '46.66 m',
      wingspan: '43.90 m',
      height: '15.80 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '120 hours',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '24 hours',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '12 hours',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Wide-body Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'concorde',
    manufacturerId: 'airbus',
    model: 'Concorde',
    category: 'flagship',
    subcategory: 'historical-flagship',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'Concorde was the world\'s first supersonic passenger airliner, a joint venture between Aérospatiale and BAC. While technically not exclusively Airbus, it remains the most iconic retired flagship in the Airbus heritage. It operated from 1976 to 2003, flying at Mach 2.04.',
    firstFlight: 1969,
    specifications: {
      maxTakeoffWeight: '185,000 kg',
      cruisingSpeed: 'Mach 2.04',
      range: '7,250 km',
      capacity: 100,
      engines: 4,
      engineType: 'Rolls-Royce/Snecma Olympus 593',
      length: '61.66 m',
      wingspan: '25.60 m',
      height: '12.19 m'
    },
    trainingRequirements: {
      minimumHours: 5000,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Supersonic Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 200,
      simulatorHours: 40,
      flightHours: 20
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '200 hours',
        topics: ['Supersonic Aerodynamics', 'Fuel Management', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '40 hours',
        topics: ['Supersonic Operations', 'Temperature Management', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '20 hours',
        topics: ['Supersonic Transition', 'Cruise Operations', 'Subsonic Approach']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Supersonic Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Supersonic Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a340-600',
    manufacturerId: 'airbus',
    model: 'A340-600',
    category: 'legacy',
    subcategory: 'wide-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A340-600 is the stretched, high-capacity version of the A340 family, the longest Airbus aircraft until the A350-1000. Production ended in 2011.',
    firstFlight: 2001,
    specifications: {
      maxTakeoffWeight: '368,000 kg',
      cruisingSpeed: 'Mach 0.83',
      range: '14,600 km',
      capacity: 380,
      engines: 4,
      engineType: 'Trent 556',
      length: '75.30 m',
      wingspan: '63.45 m',
      height: '17.22 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300b1',
    manufacturerId: 'airbus',
    model: 'A300B1',
    category: 'legacy',
    subcategory: 'retired',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A300B1 was the first variant of the A300, the world\'s first twin-engine wide-body airliner. Retired. Only two were ever built. Both are long gone.',
    firstFlight: 1972,
    specifications: {
      maxTakeoffWeight: '132,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '3,500 km',
      capacity: 250,
      engines: 2,
      engineType: 'CF6-50C',
      length: '53.75 m',
      wingspan: '44.84 m',
      height: '16.24 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300b2',
    manufacturerId: 'airbus',
    model: 'A300B2',
    category: 'legacy',
    subcategory: 'retired',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A300B2 was the production version of the A300 with increased range and capacity compared to the B1. Retired. These were the early 1970s models. They lack the modern tech required to fly in today\'s crowded airspace.',
    firstFlight: 1974,
    specifications: {
      maxTakeoffWeight: '142,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '4,200 km',
      capacity: 270,
      engines: 2,
      engineType: 'CF6-50C or JT9D-59A',
      length: '53.75 m',
      wingspan: '44.84 m',
      height: '16.24 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300b4',
    manufacturerId: 'airbus',
    model: 'A300B4',
    category: 'legacy',
    subcategory: 'retired',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A300B4 was an extended range version of the A300 with center fuel tank for longer flights. Retired. These were the early 1970s models. They lack the modern tech required to fly in today\'s crowded airspace.',
    firstFlight: 1976,
    specifications: {
      maxTakeoffWeight: '157,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '5,500 km',
      capacity: 280,
      engines: 2,
      engineType: 'CF6-50C or JT9D-59A',
      length: '53.75 m',
      wingspan: '44.84 m',
      height: '16.24 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300-600',
    manufacturerId: 'airbus',
    model: 'A300-600',
    category: 'legacy',
    subcategory: 'wide-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A300-600 was the modernized, definitive version of the A300 family with glass cockpit and improved aerodynamics.',
    firstFlight: 1983,
    specifications: {
      maxTakeoffWeight: '171,700 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '7,500 km',
      capacity: 297,
      engines: 2,
      engineType: 'CF6-80C2 or PW4158',
      length: '54.10 m',
      wingspan: '44.84 m',
      height: '16.54 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310-200',
    manufacturerId: 'airbus',
    model: 'A310-200',
    category: 'legacy',
    subcategory: 'retired',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A310-200 is a shorter, longer-range derivative of the A300 family. It was the first Airbus aircraft with a two-crew glass cockpit. Retired. Most were scrapped or converted years ago.',
    firstFlight: 1982,
    specifications: {
      maxTakeoffWeight: '144,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '6,800 km',
      capacity: 220,
      engines: 2,
      engineType: 'CF6-80A3 or JT9D-7R4',
      length: '46.66 m',
      wingspan: '43.90 m',
      height: '15.80 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310-300',
    manufacturerId: 'airbus',
    model: 'A310-300',
    category: 'legacy',
    subcategory: 'reaching-end-of-service',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A310-300 is the extended range version of the A310 family with center fuel tank and increased MTOW. Final Phase. You won\'t find these at major airports like London or New York. They are mostly flying in Iran (Mahan Air) or as specialized military tankers (A310 MRTT) that are currently being replaced by the newer A330 MRTT.',
    firstFlight: 1985,
    specifications: {
      maxTakeoffWeight: '164,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '9,600 km',
      capacity: 250,
      engines: 2,
      engineType: 'CF6-80C2 or PW4152',
      length: '46.66 m',
      wingspan: '43.90 m',
      height: '15.80 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310f',
    manufacturerId: 'airbus',
    model: 'A310F',
    category: 'cargo',
    subcategory: 'freighter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A310F is a freighter variant of the A310, featuring a large cargo door and reinforced floor for cargo operations.',
    firstFlight: 1988,
    specifications: {
      maxTakeoffWeight: '164,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '7,500 km',
      capacity: 0,
      engines: 2,
      engineType: 'CF6-80C2 or PW4152',
      length: '46.66 m',
      wingspan: '43.90 m',
      height: '15.80 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Cargo Operations', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Cargo Handling']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Cargo Loading']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330p2f',
    manufacturerId: 'airbus',
    model: 'A330P2F',
    category: 'cargo',
    subcategory: 'p2f-conversion',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A330P2F is a passenger-to-freighter conversion of the A330, featuring a large cargo door and reinforced floor for cargo operations.',
    firstFlight: 2017,
    specifications: {
      maxTakeoffWeight: '233,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '7,400 km',
      capacity: 0,
      engines: 2,
      engineType: 'CF6-80E1 or Trent 772',
      length: '58.82 m',
      wingspan: '60.3 m',
      height: '17.39 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Cargo Operations', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Cargo Handling']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Cargo Loading']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj-twentytwenty',
    manufacturerId: 'airbus',
    model: 'ACJ TwoTwenty',
    category: 'private',
    subcategory: 'corporate-jet',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus ACJ TwoTwenty is the corporate jet version of the A220, offering long-range capability in a compact size.',
    firstFlight: 2018,
    specifications: {
      maxTakeoffWeight: '67,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '11,100 km',
      capacity: 25,
      engines: 2,
      engineType: 'Pratt & Whitney PW1500G',
      length: '38.9 m',
      wingspan: '35.1 m',
      height: '11.5 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj318',
    manufacturerId: 'airbus',
    model: 'ACJ318',
    category: 'private',
    subcategory: 'corporate-jet',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus ACJ318 is the corporate jet version of the A318, offering long-range capability in a compact size.',
    firstFlight: 2005,
    specifications: {
      maxTakeoffWeight: '68,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '8,300 km',
      capacity: 18,
      engines: 2,
      engineType: 'CFM56-5B',
      length: '31.44 m',
      wingspan: '34.1 m',
      height: '12.56 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj319',
    manufacturerId: 'airbus',
    model: 'ACJ319',
    category: 'private',
    subcategory: 'corporate-jet',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus ACJ319 is the corporate jet version of the A319, offering long-range capability and spacious cabin.',
    firstFlight: 2003,
    specifications: {
      maxTakeoffWeight: '75,500 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '11,650 km',
      capacity: 19,
      engines: 2,
      engineType: 'CFM56 or V2500',
      length: '33.84 m',
      wingspan: '34.1 m',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj320',
    manufacturerId: 'airbus',
    model: 'ACJ320',
    category: 'private',
    subcategory: 'corporate-jet',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus ACJ320 is the corporate jet version of the A320, offering long-range capability and spacious cabin.',
    firstFlight: 2001,
    specifications: {
      maxTakeoffWeight: '77,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '11,100 km',
      capacity: 19,
      engines: 2,
      engineType: 'CFM56 or V2500',
      length: '37.57 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj321',
    manufacturerId: 'airbus',
    model: 'ACJ321',
    category: 'private',
    subcategory: 'corporate-jet',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus ACJ321 is the corporate jet version of the A321, offering the longest range and most spacious cabin in the A320 family.',
    firstFlight: 2004,
    specifications: {
      maxTakeoffWeight: '93,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '11,750 km',
      capacity: 25,
      engines: 2,
      engineType: 'CFM56 or V2500',
      length: '44.51 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj330',
    manufacturerId: 'airbus',
    model: 'ACJ330',
    category: 'private',
    subcategory: 'corporate-jet',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus ACJ330 is the corporate jet version of the A330, offering ultra-long-range capability and spacious cabin.',
    firstFlight: 2008,
    specifications: {
      maxTakeoffWeight: '242,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '17,500 km',
      capacity: 50,
      engines: 2,
      engineType: 'CF6-80E1 or Trent 700',
      length: '63.66 m',
      wingspan: '60.3 m',
      height: '16.79 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj340',
    manufacturerId: 'airbus',
    model: 'ACJ340',
    category: 'private',
    subcategory: 'corporate-jet',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus ACJ340 is the corporate jet version of the A340, offering ultra-long-range capability with four engines.',
    firstFlight: 2005,
    specifications: {
      maxTakeoffWeight: '275,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '18,500 km',
      capacity: 50,
      engines: 4,
      engineType: 'CFM56-5C4',
      length: '63.60 m',
      wingspan: '60.3 m',
      height: '16.84 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Ultra-Long-Range Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj350',
    manufacturerId: 'airbus',
    model: 'ACJ350',
    category: 'private',
    subcategory: 'corporate-jet',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus ACJ350 is the corporate jet version of the A350, featuring advanced carbon-composite construction and ultra-long-range capability.',
    firstFlight: 2015,
    specifications: {
      maxTakeoffWeight: '280,000 kg',
      cruisingSpeed: 'Mach 0.85',
      range: '20,550 km',
      capacity: 50,
      engines: 2,
      engineType: 'Trent XWB',
      length: '67.09 m',
      wingspan: '64.31 m',
      height: '17.08 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Ultra-Long-Range Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a400m',
    manufacturerId: 'airbus',
    model: 'A400M Atlas',
    category: 'military',
    subcategory: 'transport-tanker',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A400M Atlas is a four-engine turboprop tactical airlifter with strategic capabilities, designed to replace older military transport aircraft.',
    firstFlight: 2009,
    specifications: {
      maxTakeoffWeight: '141,000 kg',
      cruisingSpeed: '780 km/h',
      range: '8,900 km',
      capacity: 116,
      engines: 4,
      engineType: 'TP400-D6 Turboprop',
      length: '43.84 m',
      wingspan: '42.40 m',
      height: '14.66 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Tactical Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Seville', 'Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / Military Authority',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-mrtt',
    manufacturerId: 'airbus',
    model: 'A330 MRTT',
    category: 'military',
    subcategory: 'transport-tanker',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A330 MRTT (Multi Role Tanker Transport) is a military derivative of the A330 used for aerial refueling and transport.',
    firstFlight: 2007,
    specifications: {
      maxTakeoffWeight: '233,000 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '14,800 km',
      capacity: 285,
      engines: 2,
      engineType: 'CF6-80E1 or Trent 700',
      length: '63.66 m',
      wingspan: '60.3 m',
      height: '16.79 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Refueling Operations']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Refueling Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Aerial Refueling']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Getafe'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / Military Authority',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'c295',
    manufacturerId: 'airbus',
    model: 'C295',
    category: 'military',
    subcategory: 'tactical-transport',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus C295 is a robust, twin-turboprop tactical transport and maritime patrol aircraft.',
    firstFlight: 1997,
    specifications: {
      maxTakeoffWeight: '23,200 kg',
      cruisingSpeed: '480 km/h',
      range: '5,700 km',
      capacity: 71,
      engines: 2,
      engineType: 'TP400-D6 Turboprop',
      length: '19.35 m',
      wingspan: '25.81 m',
      height: '6.76 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Tactical Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Seville'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / Military Authority',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'cn235',
    manufacturerId: 'airbus',
    model: 'CN235',
    category: 'military',
    subcategory: 'tactical-transport',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus CN235 is a medium-range twin-turboprop transport aircraft, originally a joint venture with CASA.',
    firstFlight: 1983,
    specifications: {
      maxTakeoffWeight: '16,000 kg',
      cruisingSpeed: '450 km/h',
      range: '4,500 km',
      capacity: 51,
      engines: 2,
      engineType: 'CT7-9C Turboprop',
      length: '21.40 m',
      wingspan: '24.60 m',
      height: '8.18 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Tactical Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Seville'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / Military Authority',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'eurofighter-typhoon',
    manufacturerId: 'airbus',
    model: 'Eurofighter Typhoon',
    category: 'military',
    subcategory: 'combat-stealth',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Eurofighter Typhoon is a twin-engine, canard-delta wing, multirole fighter. Airbus is a major partner in the consortium that builds this aircraft.',
    firstFlight: 1994,
    specifications: {
      maxTakeoffWeight: '23,500 kg',
      cruisingSpeed: 'Mach 2.0',
      range: '2,900 km',
      capacity: 1,
      engines: 2,
      engineType: 'EJ200',
      length: '15.96 m',
      wingspan: '10.95 m',
      height: '5.28 m'
    },
    trainingRequirements: {
      minimumHours: 1000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 200,
      simulatorHours: 40,
      flightHours: 20
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '8 weeks',
        topics: ['Systems', 'Combat Systems', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '6 weeks',
        topics: ['Normal Operations', 'Combat Operations', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['Takeoff and Landing', 'Combat Maneuvers', 'Air Combat']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Manching', 'Cotswold'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewalRequirements: ['Combat missions', 'Proficiency check']
    }
  },
  {
    id: 'h125',
    manufacturerId: 'airbus',
    model: 'H125',
    category: 'helicopter',
    subcategory: 'light-single-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus H125 (formerly AS350 Écureuil) is a single-engine light utility helicopter known for its performance in high-altitude and hot conditions. It holds the record for landing on Mt. Everest.',
    firstFlight: 1974,
    specifications: {
      maxTakeoffWeight: '2,500 kg',
      cruisingSpeed: '250 km/h',
      range: '660 km',
      capacity: 6,
      engines: 1,
      engineType: 'Arriel 2D Turboshaft',
      length: '10.93 m',
      wingspan: '10.69 m',
      height: '3.14 m'
    },
    trainingRequirements: {
      minimumHours: 100,
      requiredLicenses: ['PPL(H)', 'Helicopter Rating'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 10,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '40 hours',
        topics: ['Aircraft Systems', 'Performance Planning', 'High-Altitude Operations', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '10 hours',
        topics: ['Basic Handling', 'Mountain Flying', 'High-Altitude Operations', 'Autorotations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'CFI(H)', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'h130',
    manufacturerId: 'airbus',
    model: 'H130',
    category: 'helicopter',
    subcategory: 'light-single-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus H130 is a wide-body single-engine helicopter known as the "iPhone Pro" of sightseeing due to its huge windows and quiet Fenestron tail rotor. It\'s perfect for tourism and VIP transport.',
    firstFlight: 2012,
    specifications: {
      maxTakeoffWeight: '2,500 kg',
      cruisingSpeed: '250 km/h',
      range: '660 km',
      capacity: 6,
      engines: 1,
      engineType: 'Arriel 2D Turboshaft',
      length: '10.93 m',
      wingspan: '10.69 m',
      height: '3.14 m'
    },
    trainingRequirements: {
      minimumHours: 100,
      requiredLicenses: ['PPL(H)', 'Helicopter Rating'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 10,
      flightHours: 5
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '2 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '1 week',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Mountain Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Dallas'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['300 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'h135',
    manufacturerId: 'airbus',
    model: 'H135',
    category: 'helicopter',
    subcategory: 'light-twin-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus H135 is a light twin-engine helicopter known for its versatility in emergency medical services and law enforcement roles.',
    firstFlight: 1994,
    specifications: {
      maxTakeoffWeight: '2,950 kg',
      cruisingSpeed: '254 km/h',
      range: '635 km',
      capacity: 7,
      engines: 2,
      engineType: 'Arriel 2B Turboshaft',
      length: '10.26 m',
      wingspan: '10.20 m',
      height: '3.32 m'
    },
    trainingRequirements: {
      minimumHours: 150,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 50,
      simulatorHours: 12,
      flightHours: 6
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '2 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'EMS Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Dallas'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['400 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'h145',
    manufacturerId: 'airbus',
    model: 'H145',
    category: 'helicopter',
    subcategory: 'medium-twin-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus H145 is a light twin-engine helicopter featuring a fenestron tail rotor and advanced avionics.',
    firstFlight: 2014,
    specifications: {
      maxTakeoffWeight: '3,700 kg',
      cruisingSpeed: '250 km/h',
      range: '680 km',
      capacity: 9,
      engines: 2,
      engineType: 'Arriel 2E Turboshaft',
      length: '13.03 m',
      wingspan: '11.00 m',
      height: '3.86 m'
    },
    trainingRequirements: {
      minimumHours: 150,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 50,
      simulatorHours: 12,
      flightHours: 6
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '2 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'EMS Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Dallas'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['400 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'h155',
    manufacturerId: 'airbus',
    model: 'H155',
    category: 'helicopter',
    subcategory: 'medium-twin-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus H155 (formerly EC155 B1) is a medium twin-engine helicopter with a spacious cabin for VIP transport.',
    firstFlight: 1997,
    specifications: {
      maxTakeoffWeight: '5,500 kg',
      cruisingSpeed: '280 km/h',
      range: '850 km',
      capacity: 13,
      engines: 2,
      engineType: 'Arriel 2C2 Turboshaft',
      length: '12.64 m',
      wingspan: '12.60 m',
      height: '4.01 m'
    },
    trainingRequirements: {
      minimumHours: 200,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 60,
      simulatorHours: 15,
      flightHours: 8
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'VIP Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'h175',
    manufacturerId: 'airbus',
    model: 'H175',
    category: 'helicopter',
    subcategory: 'heavy-twin-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus H175 (formerly EC175 B1) is a heavy twin-engine helicopter designed for offshore oil and gas transport.',
    firstFlight: 2009,
    specifications: {
      maxTakeoffWeight: '7,500 kg',
      cruisingSpeed: '300 km/h',
      range: '1,300 km',
      capacity: 16,
      engines: 2,
      engineType: 'PT6C-67E Turboshaft',
      length: '14.74 m',
      wingspan: '14.80 m',
      height: '4.66 m'
    },
    trainingRequirements: {
      minimumHours: 300,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Offshore Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Aberdeen'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'h225',
    manufacturerId: 'airbus',
    model: 'H225',
    category: 'helicopter',
    subcategory: 'heavy-twin-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus H225 (formerly Super Puma) is a heavy twin-engine helicopter used for offshore transport and heavy lift operations.',
    firstFlight: 1990,
    specifications: {
      maxTakeoffWeight: '11,000 kg',
      cruisingSpeed: '280 km/h',
      range: '880 km',
      capacity: 24,
      engines: 2,
      engineType: 'Makila 2A1 Turboshaft',
      length: '16.80 m',
      wingspan: '16.20 m',
      height: '4.98 m'
    },
    trainingRequirements: {
      minimumHours: 300,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Heavy Lift Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Aberdeen'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'nh90',
    manufacturerId: 'airbus',
    model: 'NH90',
    category: 'military',
    subcategory: 'attack-tactical-helicopter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The NH90 is a medium-sized, twin-engine multi-role military helicopter developed by NHIndustries (Airbus is a partner).',
    firstFlight: 1995,
    specifications: {
      maxTakeoffWeight: '10,600 kg',
      cruisingSpeed: '280 km/h',
      range: '1,200 km',
      capacity: 20,
      engines: 2,
      engineType: 'T700-T6E1 Turboshaft',
      length: '16.13 m',
      wingspan: '13.00 m',
      height: '5.23 m'
    },
    trainingRequirements: {
      minimumHours: 300,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Military Operations']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Combat Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Tactical Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewalRequirements: ['Combat missions', 'Proficiency check']
    }
  },
  {
    id: 'tiger',
    manufacturerId: 'airbus',
    model: 'Tiger',
    category: 'military',
    subcategory: 'attack-tactical-helicopter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus Tiger is a four-bladed, twin-engine attack helicopter developed by Eurocopter (now Airbus Helicopters).',
    firstFlight: 1991,
    specifications: {
      maxTakeoffWeight: '6,600 kg',
      cruisingSpeed: '280 km/h',
      range: '800 km',
      capacity: 2,
      engines: 2,
      engineType: 'MTR390 Turboshaft',
      length: '13.99 m',
      wingspan: '13.00 m',
      height: '3.83 m'
    },
    trainingRequirements: {
      minimumHours: 500,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 30,
      flightHours: 15
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Combat Systems', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Combat Operations', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['Takeoff and Landing', 'Combat Maneuvers', 'Attack Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Bückeburg'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['800 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewalRequirements: ['Combat missions', 'Proficiency check']
    }
  },
  {
    id: 'h145m',
    manufacturerId: 'airbus',
    model: 'H145M',
    category: 'military',
    subcategory: 'utility-helicopter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus H145M is the military variant of the H145, featuring advanced mission systems for special operations and armed reconnaissance.',
    firstFlight: 2014,
    specifications: {
      maxTakeoffWeight: '3,700 kg',
      cruisingSpeed: '250 km/h',
      range: '680 km',
      capacity: 8,
      engines: 2,
      engineType: 'Arriel 2E Turboshaft',
      length: '13.03 m',
      wingspan: '11.00 m',
      height: '3.86 m'
    },
    trainingRequirements: {
      minimumHours: 200,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 60,
      simulatorHours: 15,
      flightHours: 8
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Military Operations']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Combat Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Special Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewalRequirements: ['Combat missions', 'Proficiency check']
    }
  },
  {
    id: 'h225m',
    manufacturerId: 'airbus',
    model: 'H225M Caracal',
    category: 'military',
    subcategory: 'attack-tactical-helicopter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus H225M Caracal is the military variant of the H225, used for special operations, combat search and rescue, and tactical transport.',
    firstFlight: 2000,
    specifications: {
      maxTakeoffWeight: '11,000 kg',
      cruisingSpeed: '280 km/h',
      range: '1,200 km',
      capacity: 28,
      engines: 2,
      engineType: 'Makila 2A1 Turboshaft',
      length: '16.80 m',
      wingspan: '16.20 m',
      height: '4.98 m'
    },
    trainingRequirements: {
      minimumHours: 300,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Military Operations']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Combat Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Special Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewalRequirements: ['Combat missions', 'Proficiency check']
    }
  },
  {
    id: 'h215',
    manufacturerId: 'airbus',
    model: 'H215',
    category: 'helicopter',
    subcategory: 'heavy-twin-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus H215 (formerly AS332 Super Puma Mk2) is the slightly smaller, more rugged sibling of the H225. It is heavily used for heavy-lift work and firefighting operations worldwide.',
    firstFlight: 1979,
    specifications: {
      maxTakeoffWeight: '9,500 kg',
      cruisingSpeed: '270 km/h',
      range: '820 km',
      capacity: 19,
      engines: 2,
      engineType: 'Makila 1A1 Turboshaft',
      length: '15.53 m',
      wingspan: '15.60 m',
      height: '4.92 m'
    },
    trainingRequirements: {
      minimumHours: 250,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 75,
      simulatorHours: 18,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '75 hours',
        topics: ['Aircraft Systems', 'Performance Planning', 'Emergency Procedures', 'Heavy Lift Operations']
      },
      {
        phase: 'Flight Training',
        duration: '18 hours',
        topics: ['Basic Handling', 'External Load Operations', 'Mountain Flying', 'Night Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Donauwörth'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h160',
    manufacturerId: 'airbus',
    model: 'H160',
    category: 'helicopter',
    subcategory: 'medium-twin-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus H160 is the "Next-Gen" medium twin-engine helicopter featuring massive technological leaps like curved "Blue Edge" blades to make it incredibly quiet. It represents the future of the medium class.',
    firstFlight: 2015,
    specifications: {
      maxTakeoffWeight: '6,000 kg',
      cruisingSpeed: '290 km/h',
      range: '870 km',
      capacity: 12,
      engines: 2,
      engineType: 'Arrano Turboshaft',
      length: '13.49 m',
      wingspan: '13.00 m',
      height: '4.33 m'
    },
    trainingRequirements: {
      minimumHours: 200,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 70,
      simulatorHours: 18,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '70 hours',
        topics: ['Blue Edge Rotor System', 'Arrano Engine Systems', 'Performance Planning', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '18 hours',
        topics: ['Advanced Handling', 'Blue Edge Operations', 'VIP Operations', 'Night Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h140',
    manufacturerId: 'airbus',
    model: 'H140',
    category: 'helicopter',
    subcategory: 'light-twin-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus H140 is a brand new light twin-engine model introduced around 2025, designed to bridge the gap between the H135 and H145 with enhanced performance and capacity.',
    firstFlight: 2025,
    specifications: {
      maxTakeoffWeight: '3,400 kg',
      cruisingSpeed: '260 km/h',
      range: '700 km',
      capacity: 8,
      engines: 2,
      engineType: 'Arriel 2D Turboshaft',
      length: '11.50 m',
      wingspan: '10.80 m',
      height: '3.50 m'
    },
    trainingRequirements: {
      minimumHours: 150,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 55,
      simulatorHours: 12,
      flightHours: 8
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '55 hours',
        topics: ['Aircraft Systems', 'Performance Planning', 'Emergency Procedures', 'Navigation']
      },
      {
        phase: 'Flight Training',
        duration: '12 hours',
        topics: ['Basic Handling', 'Instrument Procedures', 'Emergency Training', 'Night Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'uh-72-lakota',
    manufacturerId: 'airbus',
    model: 'UH-72 Lakota',
    category: 'military',
    subcategory: 'utility-helicopter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus UH-72 Lakota is the military version of the H145, used extensively by the U.S. Army for training, medevac, and utility missions.',
    firstFlight: 2006,
    specifications: {
      maxTakeoffWeight: '3,700 kg',
      cruisingSpeed: '250 km/h',
      range: '680 km',
      capacity: 9,
      engines: 2,
      engineType: 'Arriel 2E Turboshaft',
      length: '13.03 m',
      wingspan: '11.00 m',
      height: '3.86 m'
    },
    trainingRequirements: {
      minimumHours: 200,
      requiredLicenses: ['CPL(H)', 'ME', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 60,
      simulatorHours: 15,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '60 hours',
        topics: ['Military Systems', 'Mission Planning', 'Emergency Procedures', 'Instrument Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '15 hours',
        topics: ['Military Operations', 'Formation Flying', 'Night Vision Systems', 'Tactical Procedures']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Columbus'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewalRequirements: ['Combat missions', 'Proficiency check']
    }
  },
  {
    id: 'neuron',
    manufacturerId: 'airbus',
    model: 'nEUROn',
    category: 'military',
    subcategory: 'combat-stealth',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The nEUROn is an experimental European stealth combat drone (UCAV). Airbus (CASA/EADS) was a major partner in developing its stealth and flight systems. It serves as a technology demonstrator.',
    firstFlight: 2012,
    specifications: {
      maxTakeoffWeight: '7,000 kg',
      cruisingSpeed: 'Mach 0.8',
      range: '2,900 km',
      capacity: 0,
      engines: 2,
      engineType: 'Adour Mk951 Turbofan',
      length: '10.00 m',
      wingspan: '12.50 m',
      height: '2.50 m'
    },
    trainingRequirements: {
      minimumHours: 200,
      requiredLicenses: ['UAV Operator License', 'Military Rating'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 60,
      simulatorHours: 30,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '60 hours',
        topics: ['Stealth Systems', 'Autonomous Operations', 'UCAV Systems', 'Mission Planning']
      },
      {
        phase: 'Flight Training',
        duration: '30 hours',
        topics: ['Remote Operations', 'Stealth Missions', 'Autonomous Flight', 'Emergency Procedures']
      }
    ],
    simulatorDetails: {
      type: 'UAV Simulator',
      locations: ['Istres'],
      features: ['Visual System', 'Autonomous Simulation', 'Stealth Simulation']
    },
    instructorQualifications: [
      {
        type: 'UAV Instructor',
        requirements: ['300 hours on type', 'UAV Instructor certification', 'Remote Pilot Experience']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewalRequirements: ['Proficiency Check', 'UCAV Systems Training']
    }
  },
  {
    id: 'bird-of-prey',
    manufacturerId: 'airbus',
    model: 'Bird of Prey',
    category: 'military',
    subcategory: 'combat-stealth',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus Bird of Prey is a high-subsonic interceptor drone designed to hunt down and "neutralize" enemy kamikaze drones autonomously. It\'s a new for 2026 platform.',
    firstFlight: 2026,
    specifications: {
      maxTakeoffWeight: '800 kg',
      cruisingSpeed: 'Mach 0.85',
      range: '1,500 km',
      capacity: 0,
      engines: 1,
      engineType: 'Electric/Hybrid Propulsion',
      length: '5.50 m',
      wingspan: '7.20 m',
      height: '1.80 m'
    },
    trainingRequirements: {
      minimumHours: 100,
      requiredLicenses: ['UAV Operator License', 'Military Rating'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 20,
      flightHours: 5
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '40 hours',
        topics: ['Autonomous Interception', 'Drone Countermeasures', 'AI Systems', 'Mission Planning']
      },
      {
        phase: 'Flight Training',
        duration: '20 hours',
        topics: ['Autonomous Interception', 'Drone Neutralization', 'Swarm Operations', 'Emergency Procedures']
      }
    ],
    simulatorDetails: {
      type: 'UAV Simulator',
      locations: ['Manching'],
      features: ['Visual System', 'Autonomous Simulation', 'Drone Countermeasure Simulation']
    },
    instructorQualifications: [
      {
        type: 'UAV Instructor',
        requirements: ['200 hours on type', 'UAV Instructor certification', 'AI Systems Experience']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewalRequirements: ['Proficiency Check', 'AI Systems Training']
    }
  },
  {
    id: 'zephyr',
    manufacturerId: 'airbus',
    model: 'Zephyr',
    category: 'military',
    subcategory: 'surveillance-uas',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus Zephyr is a solar-powered "pseudo-satellite" (HAPS) that flies in the stratosphere for 60+ days at a time, providing constant surveillance or 5G signal.',
    firstFlight: 2018,
    specifications: {
      maxTakeoffWeight: '75 kg',
      cruisingSpeed: '70 km/h',
      range: 'Unlimited (solar powered)',
      capacity: 0,
      engines: 2,
      engineType: 'Electric Motors',
      length: '5.00 m',
      wingspan: '25.00 m',
      height: '1.20 m'
    },
    trainingRequirements: {
      minimumHours: 50,
      requiredLicenses: ['UAV Operator License', 'Military Rating'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 30,
      simulatorHours: 15,
      flightHours: 5
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '30 hours',
        topics: ['Solar Systems', 'Stratospheric Operations', 'Surveillance Systems', 'Long-Endurance Flight']
      },
      {
        phase: 'Flight Training',
        duration: '15 hours',
        topics: ['Remote Operations', 'Stratospheric Flight', 'Surveillance Missions', 'Emergency Procedures']
      }
    ],
    simulatorDetails: {
      type: 'UAV Simulator',
      locations: ['Farnborough'],
      features: ['Visual System', 'Stratospheric Simulation', 'Long-Endurance Simulation']
    },
    instructorQualifications: [
      {
        type: 'UAV Instructor',
        requirements: ['150 hours on type', 'UAV Instructor certification', 'HAPS Experience']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewalRequirements: ['Proficiency Check', 'HAPS Systems Training']
    }
  },
  {
    id: 'capa-x',
    manufacturerId: 'airbus',
    model: 'Capa-X',
    category: 'military',
    subcategory: 'surveillance-uas',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus Capa-X is a modular "heavy" drone (120kg) selected by the European Defence Agency for electronic warfare and cargo delivery in combat zones. It\'s a new for 2026 platform.',
    firstFlight: 2026,
    specifications: {
      maxTakeoffWeight: '120 kg',
      cruisingSpeed: '180 km/h',
      range: '1,200 km',
      capacity: 30,
      engines: 2,
      engineType: 'Heavy-Duty Electric Motors',
      length: '4.50 m',
      wingspan: '8.00 m',
      height: '1.50 m'
    },
    trainingRequirements: {
      minimumHours: 80,
      requiredLicenses: ['UAV Operator License', 'Military Rating'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 35,
      simulatorHours: 18,
      flightHours: 6
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '35 hours',
        topics: ['Modular Systems', 'Electronic Warfare', 'Cargo Operations', 'Mission Planning']
      },
      {
        phase: 'Flight Training',
        duration: '18 hours',
        topics: ['Remote Operations', 'EW Missions', 'Cargo Delivery', 'Emergency Procedures']
      }
    ],
    simulatorDetails: {
      type: 'UAV Simulator',
      locations: ['Manching'],
      features: ['Visual System', 'EW Simulation', 'Cargo Simulation']
    },
    instructorQualifications: [
      {
        type: 'UAV Instructor',
        requirements: ['180 hours on type', 'UAV Instructor certification', 'EW Systems Experience']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewalRequirements: ['Proficiency Check', 'EW Systems Training']
    }
  },
  {
    id: 'as365-dauphin',
    manufacturerId: 'airbus',
    model: 'AS365 Dauphin',
    category: 'helicopter',
    subcategory: 'medium-twin-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus AS365 Dauphin is a sleek, fast helicopter famous for its "Fenestron" (shrouded) tail rotor. It is the "father" of the H155 and still widely used for VIP transport and offshore missions.',
    firstFlight: 1975,
    specifications: {
      maxTakeoffWeight: '4,250 kg',
      cruisingSpeed: '275 km/h',
      range: '800 km',
      capacity: 12,
      engines: 2,
      engineType: 'Arriel 2C Turboshaft',
      length: '11.63 m',
      wingspan: '11.94 m',
      height: '3.99 m'
    },
    trainingRequirements: {
      minimumHours: 180,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 65,
      simulatorHours: 14,
      flightHours: 8
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '65 hours',
        topics: ['Fenestron Systems', 'Aircraft Systems', 'Performance Planning', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '14 hours',
        topics: ['Fenestron Handling', 'Instrument Procedures', 'Emergency Training', 'VIP Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bo-105',
    manufacturerId: 'airbus',
    model: 'BO-105',
    category: 'helicopter',
    subcategory: 'light-twin-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus BO-105 is a legendary small twin-engine helicopter known for being the first that could perform loops and rolls. It is highly maneuverable and still in service for law enforcement and EMS.',
    firstFlight: 1967,
    specifications: {
      maxTakeoffWeight: '2,500 kg',
      cruisingSpeed: '242 km/h',
      range: '575 km',
      capacity: 5,
      engines: 2,
      engineType: 'Allison 250-C20 Turboshaft',
      length: '8.84 m',
      wingspan: '9.84 m',
      height: '3.00 m'
    },
    trainingRequirements: {
      minimumHours: 150,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 50,
      simulatorHours: 12,
      flightHours: 8
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '50 hours',
        topics: ['Aerobatic Capability', 'Aircraft Systems', 'Performance Planning', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '12 hours',
        topics: ['Advanced Handling', 'Aerobatic Maneuvers', 'Emergency Training', 'Precision Flying']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bk-117',
    manufacturerId: 'airbus',
    model: 'BK-117',
    category: 'helicopter',
    subcategory: 'light-twin-engine',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus BK-117 is the predecessor to the H145 and still widely seen as life-flight/medical helicopters. It was developed in partnership with Kawasaki.',
    firstFlight: 1979,
    specifications: {
      maxTakeoffWeight: '3,350 kg',
      cruisingSpeed: '250 km/h',
      range: '680 km',
      capacity: 10,
      engines: 2,
      engineType: 'LTS 101-750B-1 Turboshaft',
      length: '9.91 m',
      wingspan: '11.00 m',
      height: '3.36 m'
    },
    trainingRequirements: {
      minimumHours: 160,
      requiredLicenses: ['CPL(H)', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 55,
      simulatorHours: 13,
      flightHours: 8
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '55 hours',
        topics: ['Aircraft Systems', 'Performance Planning', 'Emergency Procedures', 'EMS Operations']
      },
      {
        phase: 'Flight Training',
        duration: '13 hours',
        topics: ['Basic Handling', 'EMS Operations', 'Instrument Procedures', 'Emergency Training']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'gazelle',
    manufacturerId: 'airbus',
    model: 'Gazelle',
    category: 'military',
    subcategory: 'utility-helicopter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus Gazelle is a fast, thin scout helicopter with a very distinctive look, still used by many militaries for reconnaissance and light attack missions.',
    firstFlight: 1967,
    specifications: {
      maxTakeoffWeight: '1,800 kg',
      cruisingSpeed: '310 km/h',
      range: '670 km',
      capacity: 4,
      engines: 1,
      engineType: 'Astazou XIV Turboshaft',
      length: '11.97 m',
      wingspan: '10.50 m',
      height: '3.15 m'
    },
    trainingRequirements: {
      minimumHours: 120,
      requiredLicenses: ['CPL(H)', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 45,
      simulatorHours: 10,
      flightHours: 6
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '45 hours',
        topics: ['Scout Operations', 'Navigation', 'Emergency Procedures', 'Tactical Flying']
      },
      {
        phase: 'Flight Training',
        duration: '10 hours',
        topics: ['Nap-of-the-Earth Flying', 'Reconnaissance Procedures', 'Formation Flying', 'Night Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['400 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewalRequirements: ['Proficiency Check', 'Tactical Training']
    }
  },
  {
    id: 'cityairbus',
    manufacturerId: 'airbus',
    model: 'CityAirbus',
    category: 'helicopter',
    subcategory: 'evtol',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus CityAirbus is an all-electric "flying taxi" (eVTOL) project designed for urban air mobility and short-range passenger transport.',
    firstFlight: 2024,
    specifications: {
      maxTakeoffWeight: '2,200 kg',
      cruisingSpeed: '120 km/h',
      range: '100 km',
      capacity: 4,
      engines: 8,
      engineType: 'Electric Motors',
      length: '6.20 m',
      wingspan: '11.30 m',
      height: '2.90 m'
    },
    trainingRequirements: {
      minimumHours: 100,
      requiredLicenses: ['PPL(H)', 'eVTOL Rating'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 10,
      flightHours: 5
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '40 hours',
        topics: ['Electric Propulsion', 'Autonomous Systems', 'Urban Air Mobility', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '10 hours',
        topics: ['eVTOL Handling', 'Autonomous Operations', 'Urban Navigation', 'Emergency Training']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'eVTOL Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['300 hours on type', 'TRI certification', 'Instructor rating', 'eVTOL Experience']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '1 year',
      renewalRequirements: ['Proficiency Check', 'eVTOL Systems Training']
    }
  },
  {
    id: 'vsr700',
    manufacturerId: 'airbus',
    model: 'VSR700',
    category: 'military',
    subcategory: 'surveillance-uas',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus VSR700 is an unmanned (drone) helicopter designed for navies to launch from ships for reconnaissance and surveillance missions.',
    firstFlight: 2022,
    specifications: {
      maxTakeoffWeight: '700 kg',
      cruisingSpeed: '180 km/h',
      range: '900 km',
      capacity: 0,
      engines: 1,
      engineType: 'Arriel 2D Turboshaft',
      length: '5.90 m',
      wingspan: '6.20 m',
      height: '2.20 m'
    },
    trainingRequirements: {
      minimumHours: 50,
      requiredLicenses: ['UAV Operator License'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 30,
      simulatorHours: 15,
      flightHours: 5
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '30 hours',
        topics: ['UAV Systems', 'Autonomous Operations', 'Naval Operations', 'Mission Planning']
      },
      {
        phase: 'Flight Training',
        duration: '15 hours',
        topics: ['Remote Operations', 'Ship Launch/Recovery', 'Surveillance Missions', 'Emergency Procedures']
      }
    ],
    simulatorDetails: {
      type: 'UAV Simulator',
      locations: ['Marignane'],
      features: ['Visual System', 'Autonomous Simulation', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'UAV Instructor',
        requirements: ['200 hours on type', 'UAV Instructor certification', 'Remote Pilot Experience']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewalRequirements: ['Proficiency Check', 'UAV Systems Training']
    }
  },
  {
    id: 'a220',
    manufacturerId: 'airbus',
    model: 'A220',
    category: 'regional',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'ce4fbb839e6b4bb989422426bfc8fd1c',
    description: 'The Airbus A220 is a family of narrow-body, twin-engine, medium-range jet airliners. It was originally developed by Bombardier as the CSeries.',
    firstFlight: 2013,
    specifications: {
      maxTakeoffWeight: '50,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '6,000 km',
      capacity: 160,
      engines: 2,
      engineType: 'PW1500G',
      length: '35.0 m',
      wingspan: '35.1 m',
      height: '11.5 m'
    },
    trainingRequirements: {
      minimumHours: 1000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 16,
      flightHours: 8
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '2 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Short-Field Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Mirabel', 'Mobile'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA / Transport Canada',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Cessna
  {
    id: 'cessna-172',
    manufacturerId: 'cessna',
    model: 'Cessna 172',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'd1b15841c29c43d0862667300bad55a4',
    description: 'The Cessna 172 Skyhawk is a four-seat, single-engine, high wing, fixed-wing aircraft. It is the most produced aircraft in history.',
    firstFlight: 1955,
    specifications: {
      maxTakeoffWeight: '1,111 kg',
      cruisingSpeed: '122 knots',
      range: '1,289 km',
      capacity: 4,
      engines: 1,
      engineType: 'Lycoming O-320',
      length: '8.28 m',
      wingspan: '11.0 m',
      height: '2.72 m'
    },
    trainingRequirements: {
      minimumHours: 40,
      requiredLicenses: ['PPL'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 10,
      flightHours: 40
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Aerodynamics', 'Navigation', 'Meteorology', 'Regulations']
      },
      {
        phase: 'Flight Training',
        duration: '6 weeks',
        topics: ['Basic Maneuvers', 'Cross-Country', 'Emergency Procedures', 'Solo Flight']
      }
    ],
    simulatorDetails: {
      type: 'Flight Training Device',
      locations: ['Wichita', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructorQualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewalRequirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'cessna-152',
    manufacturerId: 'cessna',
    model: 'Cessna 152',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'f20f6eb4616e4a708241eb3c8a90340a',
    description: 'The Cessna 152 is a two-seat, tricycle gear, general aviation airplane. It was designed primarily as a flight trainer.',
    firstFlight: 1977,
    specifications: {
      maxTakeoffWeight: '757 kg',
      cruisingSpeed: '107 knots',
      range: '770 km',
      capacity: 2,
      engines: 1,
      engineType: 'Lycoming O-235',
      length: '7.3 m',
      wingspan: '10.17 m',
      height: '2.59 m'
    },
    trainingRequirements: {
      minimumHours: 40,
      requiredLicenses: ['PPL'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 10,
      flightHours: 40
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Aerodynamics', 'Navigation', 'Meteorology', 'Regulations']
      },
      {
        phase: 'Flight Training',
        duration: '6 weeks',
        topics: ['Basic Maneuvers', 'Cross-Country', 'Emergency Procedures', 'Solo Flight']
      }
    ],
    simulatorDetails: {
      type: 'Flight Training Device',
      locations: ['Wichita', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructorQualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewalRequirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'cessna-182',
    manufacturerId: 'cessna',
    model: 'Cessna 182',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'ed54f082ab014626a1359009b33e7e81',
    description: 'The Cessna 182 Skylane is a four-seat, single-engine, high-wing light aircraft. It is known for its stability and performance.',
    firstFlight: 1956,
    specifications: {
      maxTakeoffWeight: '1,406 kg',
      cruisingSpeed: '145 knots',
      range: '1,770 km',
      capacity: 4,
      engines: 1,
      engineType: 'Lycoming O-540',
      length: '8.84 m',
      wingspan: '10.97 m',
      height: '2.79 m'
    },
    trainingRequirements: {
      minimumHours: 40,
      requiredLicenses: ['PPL'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 10,
      flightHours: 40
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Aerodynamics', 'Navigation', 'Meteorology', 'Regulations']
      },
      {
        phase: 'Flight Training',
        duration: '6 weeks',
        topics: ['Basic Maneuvers', 'Cross-Country', 'Emergency Procedures', 'Solo Flight']
      }
    ],
    simulatorDetails: {
      type: 'Flight Training Device',
      locations: ['Wichita', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructorQualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewalRequirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'cessna-206',
    manufacturerId: 'cessna',
    model: 'Cessna 206',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'cf61032f294f4cfab478de38451422a3',
    description: 'The Cessna 206 Stationair is a six-seat, single-engine, high-wing aircraft. It is popular for utility and bush flying.',
    firstFlight: 1962,
    specifications: {
      maxTakeoffWeight: '1,633 kg',
      cruisingSpeed: '143 knots',
      range: '1,335 km',
      capacity: 6,
      engines: 1,
      engineType: 'Lycoming IO-540',
      length: '8.53 m',
      wingspan: '10.95 m',
      height: '2.92 m'
    },
    trainingRequirements: {
      minimumHours: 40,
      requiredLicenses: ['PPL'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 10,
      flightHours: 40
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Aerodynamics', 'Navigation', 'Meteorology', 'Regulations']
      },
      {
        phase: 'Flight Training',
        duration: '6 weeks',
        topics: ['Basic Maneuvers', 'Cross-Country', 'Emergency Procedures', 'Solo Flight']
      }
    ],
    simulatorDetails: {
      type: 'Flight Training Device',
      locations: ['Wichita', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructorQualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewalRequirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'cessna-208',
    manufacturerId: 'cessna',
    model: 'Cessna 208 Caravan',
    category: 'cargo',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '2759f3b519904924bb09d02bd961a308',
    description: 'The Cessna 208 Caravan is a single-engine turboprop aircraft. It is widely used for cargo and regional passenger transport.',
    firstFlight: 1982,
    specifications: {
      maxTakeoffWeight: '3,629 kg',
      cruisingSpeed: '186 knots',
      range: '1,980 km',
      capacity: 9,
      engines: 1,
      engineType: 'Pratt & Whitney Canada PT6A',
      length: '11.46 m',
      wingspan: '15.88 m',
      height: '4.27 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 60,
      simulatorHours: 15,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Turboprop Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '2 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Short-Field Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Wichita', 'Various'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'cessna-citation-x',
    manufacturerId: 'cessna',
    model: 'Cessna Citation X',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'a9eac6363d7f4bfaa7f0ee3b9beca604',
    description: 'The Cessna Citation X is a long-range, medium-sized business jet. It was one of the fastest business jets in production.',
    firstFlight: 1993,
    specifications: {
      maxTakeoffWeight: '16,329 kg',
      cruisingSpeed: 'Mach 0.935',
      range: '6,020 km',
      capacity: 9,
      engines: 2,
      engineType: 'AE3007C1',
      length: '22.0 m',
      wingspan: '19.4 m',
      height: '6.5 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Jet Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'High-Speed Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Wichita', 'Various'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Boeing
  {
    id: 'b737-max',
    manufacturerId: 'boeing',
    model: '737 MAX',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '7a548b5ba64340f78f7c58d23781ffe9',
    description: 'The Boeing 737 MAX is the backbone of global short-haul operations in 2026. With the MAX 8, 9, and 10 variants, it dominates the narrow-body market and remains the most sought-after rating for rapid employment.',
    firstFlight: 2016,
    specifications: {
      maxTakeoffWeight: '79,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '6,000 km',
      capacity: 189,
      engines: 2,
      engineType: 'CFM56 or CFM LEAP',
      length: '38.1 m',
      wingspan: '35.9 m',
      height: '12.5 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-8',
    manufacturerId: 'boeing',
    model: '747-8F',
    category: 'cargo',
    subcategory: 'production-freighter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '86ec524a08e74e5e8907771c2d96b525',
    description: 'The Boeing 747-8F is the final iteration of the iconic Queen of the Skies freighter. The 747-8F continues to serve cargo operations as the largest cargo aircraft in Boeing fleet.',
    firstFlight: 2010,
    specifications: {
      maxTakeoffWeight: '447,700 kg',
      cruisingSpeed: 'Mach 0.85',
      range: '13,450 km',
      capacity: 467,
      engines: 4,
      engineType: 'GE CF6 or PW4000',
      length: '70.7 m',
      wingspan: '64.9 m',
      height: '19.3 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'London', 'Tokyo'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777-300er',
    manufacturerId: 'boeing',
    model: '777-300ER',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'c4b6d9e7f8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
    description: 'The Boeing 777-300ER is a workhorse of long-haul operations. With its exceptional range and capacity, it remains a primary flagship for major airlines, particularly for premium routes and cargo operations.',
    firstFlight: 2002,
    specifications: {
      maxTakeoffWeight: '351,000 kg',
      cruisingSpeed: 'Mach 0.84',
      range: '13,650 km',
      capacity: 396,
      engines: 2,
      engineType: 'GE90 or Trent 800',
      length: '63.7 m',
      wingspan: '60.9 m',
      height: '18.5 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b787',
    manufacturerId: 'boeing',
    model: '787 Dreamliner',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
    description: 'The Boeing 787 Dreamliner revolutionized long-haul travel with its composite airframe and fuel efficiency. The 787-8, 787-9, and 787-10 variants are in active production and highly sought-after for medium-to-long-haul routes.',
    firstFlight: 2009,
    specifications: {
      maxTakeoffWeight: '254,000 kg',
      cruisingSpeed: 'Mach 0.85',
      range: '14,075 km',
      capacity: 330,
      engines: 2,
      engineType: 'GEnx or Trent 1000',
      length: '68.3 m',
      wingspan: '60.1 m',
      height: '16.9 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Navigation']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777x',
    manufacturerId: 'boeing',
    model: '777X (777-8, 777-9)',
    category: 'flagship',
    subcategory: 'game-changer',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
    description: 'The Boeing 777X represents the future of long-haul travel with folding wingtips and advanced engines. The 777-8 and 777-9 are in testing and early delivery phases, set to become the new flagship for premium airlines in 2026.',
    firstFlight: 2019,
    specifications: {
      maxTakeoffWeight: '351,500 kg',
      cruisingSpeed: 'Mach 0.85',
      range: '13,645 km',
      capacity: 426,
      engines: 2,
      engineType: 'GE9X',
      length: '76.7 m',
      wingspan: '71.8 m',
      height: '18.6 m'
    },
    trainingRequirements: {
      minimumHours: 2500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 150,
      simulatorHours: 28,
      flightHours: 14
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b767-300er',
    manufacturerId: 'boeing',
    model: '767-300F',
    category: 'cargo',
    subcategory: 'p2f-conversion',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7',
    description: 'The Boeing 767-300F is a converted freighter variant of the 767-300ER. Active in cargo operations, it serves as a medium-haul freighter with excellent range and capacity.',
    firstFlight: 1986,
    specifications: {
      maxTakeoffWeight: '186,880 kg',
      cruisingSpeed: 'Mach 0.80',
      range: '11,065 km',
      capacity: 269,
      engines: 2,
      engineType: 'GE CF6 or PW4000',
      length: '54.9 m',
      wingspan: '47.6 m',
      height: '15.9 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-ng',
    manufacturerId: 'boeing',
    model: '737 NG (-700, -800, -900)',
    category: 'legacy',
    subcategory: 'narrow-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '7a548b5ba64340f78f7c58d23781ffe9',
    description: 'The Boeing 737 Next Generation (-700, -800, -900) is in legacy-retired status as airlines transition to the 737 MAX. Once the backbone of short-haul operations, it is being rapidly phased out.',
    firstFlight: 1997,
    specifications: {
      maxTakeoffWeight: '79,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '5,765 km',
      capacity: 189,
      engines: 2,
      engineType: 'CFM56-7B',
      length: '42.1 m',
      wingspan: '35.8 m',
      height: '12.5 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b757',
    manufacturerId: 'boeing',
    model: '757-200 / -300',
    category: 'legacy',
    subcategory: 'narrow-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7',
    description: 'The Boeing 757-200 and -300 are in legacy-retired status. Once a popular medium-haul aircraft, it has been retired by most airlines and replaced by more efficient 737 MAX and A321neo variants.',
    firstFlight: 1982,
    specifications: {
      maxTakeoffWeight: '115,660 kg',
      cruisingSpeed: 'Mach 0.80',
      range: '7,222 km',
      capacity: 239,
      engines: 2,
      engineType: 'CFM56 or PW2000',
      length: '54.5 m',
      wingspan: '38.1 m',
      height: '13.6 m'
    },
    trainingRequirements: {
      minimumHours: 1800,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 110,
      simulatorHours: 22,
      flightHours: 11
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b717',
    manufacturerId: 'boeing',
    model: '717 (formerly MD-95)',
    category: 'regional',
    subcategory: 'regional-jet',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8',
    description: 'The Boeing 717, originally the McDonnell Douglas MD-95, was the last narrow-body aircraft designed by McDonnell Douglas before the Boeing merger. A regional jet that served short-haul routes efficiently.',
    firstFlight: 1998,
    specifications: {
      maxTakeoffWeight: '79,380 kg',
      cruisingSpeed: 'Mach 0.77',
      range: '3,815 km',
      capacity: 134,
      engines: 2,
      engineType: 'BMW Rolls-Royce BR715',
      length: '37.8 m',
      wingspan: '28.4 m',
      height: '8.9 m'
    },
    trainingRequirements: {
      minimumHours: 1200,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 16,
      flightHours: 8
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '2 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '1 week',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['300 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b727',
    manufacturerId: 'boeing',
    model: '727',
    category: 'legacy',
    subcategory: 'narrow-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9',
    description: 'The Boeing 727 was a pioneering narrow-body trijet that revolutionized short-to-medium-haul travel. Now in legacy-retired status, it was once one of the most popular aircraft globally.',
    firstFlight: 1963,
    specifications: {
      maxTakeoffWeight: '95,300 kg',
      cruisingSpeed: 'Mach 0.80',
      range: '4,400 km',
      capacity: 189,
      engines: 3,
      engineType: 'JT8D',
      length: '46.7 m',
      wingspan: '32.9 m',
      height: '10.4 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b707',
    manufacturerId: 'boeing',
    model: '707 / 720',
    category: 'legacy',
    subcategory: 'wide-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0',
    description: 'The Boeing 707 and its shorter variant 720 were the first successful commercial jet airliners, revolutionizing air travel. Now in legacy-retired status, they established Boeing as a global aviation leader.',
    firstFlight: 1957,
    specifications: {
      maxTakeoffWeight: '151,300 kg',
      cruisingSpeed: 'Mach 0.80',
      range: '10,000 km',
      capacity: 202,
      engines: 4,
      engineType: 'JT3D or JT4A',
      length: '46.6 m',
      wingspan: '44.4 m',
      height: '12.9 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 24,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b377',
    manufacturerId: 'boeing',
    model: '377 Stratocruiser',
    category: 'legacy',
    subcategory: 'wide-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1',
    description: 'The Boeing 377 Stratocruiser was a luxurious long-range propeller airliner of the 1950s. In legacy-retired status, it represented the pinnacle of piston-engine commercial aviation before the jet age.',
    firstFlight: 1947,
    specifications: {
      maxTakeoffWeight: '79,380 kg',
      cruisingSpeed: '340 knots',
      range: '6,800 km',
      capacity: 100,
      engines: 4,
      engineType: 'R-4360 Wasp Major',
      length: '33.6 m',
      wingspan: '43.1 m',
      height: '11.7 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 16,
      flightHours: 8
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '2 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b247',
    manufacturerId: 'boeing',
    model: '247',
    category: 'legacy',
    subcategory: 'narrow-body',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2',
    description: 'The Boeing 247 was the first modern airliner, featuring all-metal construction, retractable landing gear, and de-icing boots. In legacy-retired status, it revolutionized commercial aviation in the 1930s.',
    firstFlight: 1933,
    specifications: {
      maxTakeoffWeight: '6,800 kg',
      cruisingSpeed: '189 knots',
      range: '776 km',
      capacity: 10,
      engines: 2,
      engineType: 'Wasp Junior',
      length: '15.8 m',
      wingspan: '22.6 m',
      height: '3.4 m'
    },
    trainingRequirements: {
      minimumHours: 500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 8,
      flightHours: 4
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '2 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '1 week',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '1 week',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['300 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b314',
    manufacturerId: 'boeing',
    model: '314 Clipper',
    category: 'legacy',
    subcategory: 'flying-boat',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'm4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3',
    description: 'The Boeing 314 Clipper was a legendary flying boat that pioneered transoceanic passenger service in the 1930s-40s. In legacy-retired status, it represented the golden age of luxury air travel before WWII.',
    firstFlight: 1938,
    specifications: {
      maxTakeoffWeight: '38,000 kg',
      cruisingSpeed: '184 knots',
      range: '5,200 km',
      capacity: 68,
      engines: 4,
      engineType: 'Twin Wasp',
      length: '32.3 m',
      wingspan: '46.3 m',
      height: '6.1 m'
    },
    trainingRequirements: {
      minimumHours: 1000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 60,
      simulatorHours: 12,
      flightHours: 6
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '2 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'f15ex',
    manufacturerId: 'boeing',
    model: 'F-15EX Eagle II',
    category: 'military',
    subcategory: 'combat-stealth',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4',
    description: 'The F-15EX Eagle II is the latest iteration of the iconic F-15 Eagle, featuring advanced avionics, weapons systems, and improved range. A modern multirole fighter serving as the backbone of air superiority operations.',
    firstFlight: 2021,
    specifications: {
      maxTakeoffWeight: '36,700 kg',
      cruisingSpeed: 'Mach 2.5',
      range: '4,500 km',
      capacity: 2,
      engines: 2,
      engineType: 'F110-GE-129',
      length: '19.4 m',
      wingspan: '13.1 m',
      height: '5.6 m'
    },
    trainingRequirements: {
      minimumHours: 1000,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 200,
      simulatorHours: 40,
      flightHours: 20
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '8 weeks',
        topics: ['Systems', 'Weapons', 'Combat Tactics', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '6 weeks',
        topics: ['Air Combat', 'Ground Attack', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['Combat Maneuvers', 'Weapons Delivery', 'Formation Flying']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['St. Louis', 'Eglin AFB', 'Nellis AFB'],
      features: ['6-DOF Motion', 'Combat Visual System', 'Weapons Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Combat Instructor rating']
      }
    ],
    certification: {
      authority: 'USAF',
      validity: '2 years',
      renewalRequirements: ['Combat currency', 'Proficiency check', 'Weapons qualification']
    }
  },
  {
    id: 'fa18f',
    manufacturerId: 'boeing',
    model: 'F/A-18E/F Super Hornet',
    category: 'military',
    subcategory: 'combat-stealth',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5',
    description: 'The F/A-18E/F Super Hornet is a multirole fighter serving as the primary strike fighter for the US Navy and Marine Corps. Features advanced avionics, AESA radar, and extended range capabilities.',
    firstFlight: 1995,
    specifications: {
      maxTakeoffWeight: '29,900 kg',
      cruisingSpeed: 'Mach 1.8',
      range: '3,300 km',
      capacity: 2,
      engines: 2,
      engineType: 'F414-GE-400',
      length: '18.3 m',
      wingspan: '13.6 m',
      height: '4.9 m'
    },
    trainingRequirements: {
      minimumHours: 800,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 180,
      simulatorHours: 36,
      flightHours: 18
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '7 weeks',
        topics: ['Systems', 'Weapons', 'Carrier Operations', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Air Combat', 'Ground Attack', 'Carrier Approaches']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['Carrier Operations', 'Combat Maneuvers', 'Weapons Delivery']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Pensacola', 'Lemoore', 'Oceana'],
      features: ['6-DOF Motion', 'Carrier Visual System', 'Weapons Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['800 hours on type', 'TRI certification', 'Carrier Instructor rating']
      }
    ],
    certification: {
      authority: 'USN/USMC',
      validity: '2 years',
      renewalRequirements: ['Carrier currency', 'Proficiency check', 'Weapons qualification']
    }
  },
  {
    id: 'b52h',
    manufacturerId: 'boeing',
    model: 'B-52H Stratofortress',
    category: 'military',
    subcategory: 'transport-tanker',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6',
    description: 'The B-52H Stratofortress is a legendary strategic bomber scheduled to fly until 2050+. With continuous upgrades, it remains the backbone of US strategic bombing capabilities and will serve for over 90 years.',
    firstFlight: 1961,
    specifications: {
      maxTakeoffWeight: '220,000 kg',
      cruisingSpeed: 'Mach 0.84',
      range: '14,200 km',
      capacity: 5,
      engines: 8,
      engineType: 'TF33-P-3/103',
      length: '48.5 m',
      wingspan: '56.4 m',
      height: '12.4 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 250,
      simulatorHours: 50,
      flightHours: 25
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '10 weeks',
        topics: ['Systems', 'Weapons', 'Strategic Operations', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '8 weeks',
        topics: ['Strategic Bombing', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '6 weeks',
        topics: ['Long-Range Operations', 'Weapons Delivery', 'Formation Flying']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Barksdale AFB', 'Minot AFB', 'Offutt AFB'],
      features: ['6-DOF Motion', 'Strategic Visual System', 'Weapons Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1500 hours on type', 'TRI certification', 'Strategic Instructor rating']
      }
    ],
    certification: {
      authority: 'USAF',
      validity: '2 years',
      renewalRequirements: ['Strategic currency', 'Proficiency check', 'Weapons qualification']
    }
  },
  {
    id: 'c17',
    manufacturerId: 'boeing',
    model: 'C-17 Globemaster III',
    category: 'military',
    subcategory: 'transport-tanker',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7',
    description: 'The C-17 Globemaster III is a large military transport aircraft capable of rapid strategic delivery of troops and cargo to main operating bases or forward operating bases worldwide. Active in service with global air forces.',
    firstFlight: 1991,
    specifications: {
      maxTakeoffWeight: '285,700 kg',
      cruisingSpeed: 'Mach 0.74',
      range: '11,480 km',
      capacity: 102,
      engines: 4,
      engineType: 'F117-PW-100',
      length: '53.0 m',
      wingspan: '51.8 m',
      height: '16.8 m'
    },
    trainingRequirements: {
      minimumHours: 1200,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 200,
      simulatorHours: 40,
      flightHours: 20
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '8 weeks',
        topics: ['Systems', 'Cargo Operations', 'Airdrop', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '6 weeks',
        topics: ['Airdrop Operations', 'Short Field Landings', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['Cargo Loading', 'Airdrop Missions', 'Short Field Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Charleston AFB', 'Travis AFB', 'McChord AFB'],
      features: ['6-DOF Motion', 'Cargo Visual System', 'Airdrop Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'USAF/USAFR/ANG',
      validity: '2 years',
      renewalRequirements: ['Cargo currency', 'Proficiency check', 'Airdrop qualification']
    }
  },
  {
    id: 'ah64',
    manufacturerId: 'boeing',
    model: 'AH-64 Apache',
    category: 'helicopter',
    subcategory: 'attack-helicopter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8',
    description: 'The AH-64 Apache is the world\'s most advanced multi-role combat helicopter. With advanced avionics, weapons systems, and night vision capabilities, it serves as the primary attack helicopter for the US Army and allied forces.',
    firstFlight: 1975,
    specifications: {
      maxTakeoffWeight: '10,400 kg',
      cruisingSpeed: '145 knots',
      range: '480 km',
      capacity: 2,
      engines: 2,
      engineType: 'T700-GE-701C',
      length: '17.7 m',
      wingspan: '5.2 m',
      height: '3.9 m'
    },
    trainingRequirements: {
      minimumHours: 500,
      requiredLicenses: ['CPL', 'IR', 'Helicopter Rating', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 120,
      simulatorHours: 30,
      flightHours: 15
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Weapons', 'Nap of the Earth Flying', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Combat Tactics', 'Weapons Delivery', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Combat Maneuvers', 'Weapons Training', 'Night Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Fort Rucker', 'Fort Hood', 'Fort Campbell'],
      features: ['6-DOF Motion', 'Combat Visual System', 'Weapons Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Combat Instructor rating']
      }
    ],
    certification: {
      authority: 'US Army',
      validity: '2 years',
      renewalRequirements: ['Combat currency', 'Proficiency check', 'Weapons qualification']
    }
  },
  {
    id: 'ch47',
    manufacturerId: 'boeing',
    model: 'CH-47 Chinook',
    category: 'helicopter',
    subcategory: 'heavy-lift-helicopter',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 's0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9',
    description: 'The CH-47 Chinook is a tandem-rotor heavy-lift helicopter serving as the primary transport helicopter for the US Army and allied forces. Known for its exceptional lifting capacity and versatility in combat operations.',
    firstFlight: 1961,
    specifications: {
      maxTakeoffWeight: '22,680 kg',
      cruisingSpeed: '160 knots',
      range: '740 km',
      capacity: 33,
      engines: 2,
      engineType: 'T55-L-714',
      length: '15.5 m',
      wingspan: '18.3 m',
      height: '5.7 m'
    },
    trainingRequirements: {
      minimumHours: 600,
      requiredLicenses: ['CPL', 'IR', 'Helicopter Rating', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 100,
      simulatorHours: 25,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Heavy Lift Operations', 'External Load', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['External Load Operations', 'Nap of the Earth Flying', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Heavy Lift Missions', 'External Load Training', 'Formation Flying']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Fort Rucker', 'Fort Hood', 'Fort Campbell'],
      features: ['6-DOF Motion', 'Tandem Rotor Simulation', 'External Load Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Heavy Lift Instructor rating']
      }
    ],
    certification: {
      authority: 'US Army',
      validity: '2 years',
      renewalRequirements: ['Heavy lift currency', 'Proficiency check', 'External load qualification']
    }
  },
  {
    id: 'p8',
    manufacturerId: 'boeing',
    model: 'P-8 Poseidon',
    category: 'military',
    subcategory: 'surveillance-uas',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 't1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9v0',
    description: 'The P-8 Poseidon is a military maritime patrol aircraft based on the 737-800ERX. Active in service with the US Navy and allied forces for anti-submarine warfare, anti-surface warfare, and intelligence gathering.',
    firstFlight: 2009,
    specifications: {
      maxTakeoffWeight: '85,820 kg',
      cruisingSpeed: 'Mach 0.74',
      range: '8,300 km',
      capacity: 9,
      engines: 2,
      engineType: 'CFM56-7B',
      length: '39.5 m',
      wingspan: '37.6 m',
      height: '12.8 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 200,
      simulatorHours: 40,
      flightHours: 20
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '8 weeks',
        topics: ['Systems', 'ASW Operations', 'ISR Mission Planning', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '6 weeks',
        topics: ['Maritime Patrol', 'Submarine Detection', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['Maritime Patrol Missions', 'Sonobuoy Operations', 'Low-Level Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Jacksonville', 'Whidbey Island', 'Sigonella'],
      features: ['6-DOF Motion', 'Maritime Visual System', 'Sonar Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Maritime Patrol Instructor rating']
      }
    ],
    certification: {
      authority: 'USN',
      validity: '2 years',
      renewalRequirements: ['Maritime patrol currency', 'Proficiency check', 'ASW qualification']
    }
  },
  {
    id: 'kc46',
    manufacturerId: 'boeing',
    model: 'KC-46 Pegasus',
    category: 'military',
    subcategory: 'transport-tanker',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9v0w1',
    description: 'The KC-46 Pegasus is a military aerial refueling and strategic military transport aircraft based on the 767-200ER. Active in service with the USAF and allied forces, replacing the aging KC-135 Stratotanker fleet.',
    firstFlight: 2015,
    specifications: {
      maxTakeoffWeight: '188,200 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '12,200 km',
      capacity: 58,
      engines: 2,
      engineType: 'CF6-80C2B7F',
      length: '50.5 m',
      wingspan: '47.6 m',
      height: '15.9 m'
    },
    trainingRequirements: {
      minimumHours: 1200,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 180,
      simulatorHours: 36,
      flightHours: 18
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '7 weeks',
        topics: ['Systems', 'Aerial Refueling', 'Cargo Operations', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Aerial Refueling', 'Boom Operations', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['Refueling Missions', 'Cargo Loading', 'Formation Flying']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['McConnell AFB', 'Altus AFB', 'Travis AFB'],
      features: ['6-DOF Motion', 'Refueling Boom Simulation', 'Cargo Visual System']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Refueling Instructor rating']
      }
    ],
    certification: {
      authority: 'USAF',
      validity: '2 years',
      renewalRequirements: ['Refueling currency', 'Proficiency check', 'Boom qualification']
    }
  },
  {
    id: 'v22',
    manufacturerId: 'boeing',
    model: 'V-22 Osprey',
    category: 'helicopter',
    subcategory: 'tiltrotor',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9v0w1x2',
    description: 'The V-22 Osprey is a multi-mission, tiltrotor military aircraft with both vertical takeoff and landing (VTOL), and short takeoff and landing (STOL) capabilities. Joint development with Bell, serving USMC, USAF, and USN.',
    firstFlight: 1989,
    specifications: {
      maxTakeoffWeight: '27,400 kg',
      cruisingSpeed: '240 knots',
      range: '1,700 km',
      capacity: 24,
      engines: 2,
      engineType: 'Rolls-Royce T406',
      length: '17.5 m',
      wingspan: '14.0 m',
      height: '6.7 m'
    },
    trainingRequirements: {
      minimumHours: 800,
      requiredLicenses: ['CPL', 'IR', 'Helicopter Rating', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 150,
      simulatorHours: 35,
      flightHours: 17
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Systems', 'Tiltrotor Operations', 'VTOL/STOL', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Tiltrotor Transitions', 'Ship Operations', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['VTOL Operations', 'STOL Missions', 'Ship Boarding']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['New River', 'Camp Pendleton', 'Hurlburt Field'],
      features: ['6-DOF Motion', 'Tiltrotor Simulation', 'Ship Visual System']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['800 hours on type', 'TRI certification', 'Tiltrotor Instructor rating']
      }
    ],
    certification: {
      authority: 'USMC/USAF/USN',
      validity: '2 years',
      renewalRequirements: ['Tiltrotor currency', 'Proficiency check', 'VTOL qualification']
    }
  },
  {
    id: 'b17',
    manufacturerId: 'boeing',
    model: 'B-17 Flying Fortress',
    category: 'military',
    subcategory: 'combat-stealth',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9v0w1x2y3',
    description: 'The B-17 Flying Fortress was a four-engine heavy bomber developed in the 1930s for the US Army Air Corps. A historical WWII icon that played a crucial role in the strategic bombing campaign over Europe.',
    firstFlight: 1935,
    specifications: {
      maxTakeoffWeight: '29,700 kg',
      cruisingSpeed: '180 knots',
      range: '3,200 km',
      capacity: 10,
      engines: 4,
      engineType: 'Wright R-1820 Cyclone',
      length: '22.7 m',
      wingspan: '31.6 m',
      height: '5.8 m'
    },
    trainingRequirements: {
      minimumHours: 500,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 80,
      simulatorHours: 16,
      flightHours: 8
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Bombing Operations', 'Formation Flying', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '2 weeks',
        topics: ['Bombing Runs', 'Formation Flying', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Bombing Missions', 'Formation Flying', 'Combat Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Historical Museums'],
      features: ['6-DOF Motion', 'WWII Visual System', 'Bombing Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['300 hours on type', 'TRI certification', 'Historical Aircraft Instructor rating']
      }
    ],
    certification: {
      authority: 'Historical',
      validity: '2 years',
      renewalRequirements: ['Historical currency', 'Proficiency check', 'Historical aircraft qualification']
    }
  },
  {
    id: 'b29',
    manufacturerId: 'boeing',
    model: 'B-29 Superfortress',
    category: 'military',
    subcategory: 'combat-stealth',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9v0w1x2y3z4',
    description: 'The B-29 Superfortress was a four-engine heavy bomber used by the US in WWII and Korea. The most advanced bomber of its time, it introduced pressurized cabins, remote-controlled turrets, and advanced fire control systems.',
    firstFlight: 1942,
    specifications: {
      maxTakeoffWeight: '60,000 kg',
      cruisingSpeed: '220 knots',
      range: '5,200 km',
      capacity: 11,
      engines: 4,
      engineType: 'Wright R-3350 Duplex-Cyclone',
      length: '30.2 m',
      wingspan: '43.1 m',
      height: '8.5 m'
    },
    trainingRequirements: {
      minimumHours: 800,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Systems', 'Bombing Operations', 'Pressurization', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Bombing Runs', 'Remote Turret Operations', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Bombing Missions', 'High-Altitude Operations', 'Combat Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Historical Museums'],
      features: ['6-DOF Motion', 'WWII Visual System', 'Bombing Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Historical Aircraft Instructor rating']
      }
    ],
    certification: {
      authority: 'Historical',
      validity: '2 years',
      renewalRequirements: ['Historical currency', 'Proficiency check', 'Historical aircraft qualification']
    }
  },
  {
    id: 'f86',
    manufacturerId: 'boeing',
    model: 'F-86 Sabre',
    category: 'military',
    subcategory: 'combat-stealth',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9v0w1x2y3z4a5',
    description: 'The F-86 Sabre was a transonic jet fighter aircraft produced by North American Aviation (acquired by Rockwell, later Boeing). A historical Korean War icon and the first swept-wing fighter in the US inventory.',
    firstFlight: 1947,
    specifications: {
      maxTakeoffWeight: '8,200 kg',
      cruisingSpeed: 'Mach 0.86',
      range: '2,500 km',
      capacity: 1,
      engines: 1,
      engineType: 'J47-GE-27',
      length: '11.4 m',
      wingspan: '11.3 m',
      height: '4.5 m'
    },
    trainingRequirements: {
      minimumHours: 400,
      requiredLicenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 5',
      groundSchoolHours: 60,
      simulatorHours: 15,
      flightHours: 7
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Systems', 'Jet Operations', 'Combat Tactics', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '2 weeks',
        topics: ['Air Combat', 'Jet Operations', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Combat Maneuvers', 'Jet Operations', 'Formation Flying']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Historical Museums'],
      features: ['6-DOF Motion', 'Korean War Visual System', 'Combat Simulation']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['300 hours on type', 'TRI certification', 'Historical Aircraft Instructor rating']
      }
    ],
    certification: {
      authority: 'Historical',
      validity: '2 years',
      renewalRequirements: ['Historical currency', 'Proficiency check', 'Historical aircraft qualification']
    }
  },
  // Tecnam
  {
    id: 'tecnam-p92',
    manufacturerId: 'tecnam',
    model: 'Tecnam P92',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '4b1c90cce7f14fa3bcbade0bb8c3d855',
    description: 'The Tecnam P92 is a high-wing, single-engine, light sport aircraft. It is designed for touring and flight training.',
    firstFlight: 1993,
    specifications: {
      maxTakeoffWeight: '600 kg',
      cruisingSpeed: '110 knots',
      range: '1,200 km',
      capacity: 2,
      engines: 1,
      engineType: 'Rotax 912',
      length: '6.6 m',
      wingspan: '8.5 m',
      height: '2.5 m'
    },
    trainingRequirements: {
      minimumHours: 30,
      requiredLicenses: ['PPL', 'LSA'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 30,
      simulatorHours: 5,
      flightHours: 30
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Aerodynamics', 'Navigation', 'Meteorology', 'Regulations']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['Basic Maneuvers', 'Cross-Country', 'Emergency Procedures', 'Solo Flight']
      }
    ],
    simulatorDetails: {
      type: 'Flight Training Device',
      locations: ['Capua', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructorQualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '2 years',
      renewalRequirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'tecnam-p2002',
    manufacturerId: 'tecnam',
    model: 'Tecnam P2002 Sierra',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '5325a60e1c2f402a8b5b71656ffaea66',
    description: 'The Tecnam P2002 Sierra is a low-wing, single-engine, light sport aircraft. It is designed for touring and flight training.',
    firstFlight: 2003,
    specifications: {
      maxTakeoffWeight: '600 kg',
      cruisingSpeed: '120 knots',
      range: '1,100 km',
      capacity: 2,
      engines: 1,
      engineType: 'Rotax 912',
      length: '7.0 m',
      wingspan: '8.6 m',
      height: '2.4 m'
    },
    trainingRequirements: {
      minimumHours: 30,
      requiredLicenses: ['PPL', 'LSA'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 30,
      simulatorHours: 5,
      flightHours: 30
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Aerodynamics', 'Navigation', 'Meteorology', 'Regulations']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['Basic Maneuvers', 'Cross-Country', 'Emergency Procedures', 'Solo Flight']
      }
    ],
    simulatorDetails: {
      type: 'Flight Training Device',
      locations: ['Capua', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructorQualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '2 years',
      renewalRequirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'tecnam-p2006t',
    manufacturerId: 'tecnam',
    model: 'Tecnam P2006T',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'a0a4d717a8c94a17b958eb69c4efc352',
    description: 'The Tecnam P2006T is a twin-engine, high-wing, light aircraft. It is designed for multi-engine training and utility operations.',
    firstFlight: 2007,
    specifications: {
      maxTakeoffWeight: '1,180 kg',
      cruisingSpeed: '140 knots',
      range: '1,300 km',
      capacity: 6,
      engines: 2,
      engineType: 'Lycoming IO-360',
      length: '8.7 m',
      wingspan: '11.4 m',
      height: '2.9 m'
    },
    trainingRequirements: {
      minimumHours: 100,
      requiredLicenses: ['PPL', 'ME'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 10,
      flightHours: 15
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Multi-Engine Operations', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['Asymmetric Operations', 'Engine Failures', 'Cross-Country', 'Emergency Procedures']
      }
    ],
    simulatorDetails: {
      type: 'Flight Training Device',
      locations: ['Capua', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructorQualifications: [
      {
        type: 'MEI',
        requirements: ['Commercial Pilot', 'Multi-Engine Instructor Rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '2 years',
      renewalRequirements: ['Flight Review', 'BFR']
    }
  },
  // Piper
  {
    id: 'piper-pa28',
    manufacturerId: 'piper',
    model: 'Piper PA-28 Cherokee',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'e39b3679c3a94053a53c4be4eff548bc',
    description: 'The Piper PA-28 Cherokee is a family of two-seat or four-seat, light aircraft. It is widely used for flight training.',
    firstFlight: 1960,
    specifications: {
      maxTakeoffWeight: '1,157 kg',
      cruisingSpeed: '127 knots',
      range: '1,480 km',
      capacity: 4,
      engines: 1,
      engineType: 'Lycoming O-320',
      length: '7.3 m',
      wingspan: '10.0 m',
      height: '2.2 m'
    },
    trainingRequirements: {
      minimumHours: 40,
      requiredLicenses: ['PPL'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 10,
      flightHours: 40
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Aerodynamics', 'Navigation', 'Meteorology', 'Regulations']
      },
      {
        phase: 'Flight Training',
        duration: '6 weeks',
        topics: ['Basic Maneuvers', 'Cross-Country', 'Emergency Procedures', 'Solo Flight']
      }
    ],
    simulatorDetails: {
      type: 'Flight Training Device',
      locations: ['Vero Beach', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructorQualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewalRequirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'piper-pa18',
    manufacturerId: 'piper',
    model: 'Piper PA-18 Super Cub',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '947504c5e11244db8d512f1511e75e4b',
    description: 'The Piper PA-18 Super Cub is a two-seat, single-engine, taildragger aircraft. It is popular for bush flying and backcountry operations.',
    firstFlight: 1949,
    specifications: {
      maxTakeoffWeight: '794 kg',
      cruisingSpeed: '97 knots',
      range: '760 km',
      capacity: 2,
      engines: 1,
      engineType: 'Lycoming O-320',
      length: '6.9 m',
      wingspan: '10.7 m',
      height: '2.0 m'
    },
    trainingRequirements: {
      minimumHours: 40,
      requiredLicenses: ['PPL', 'Tailwheel'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 10,
      flightHours: 40
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Tailwheel Operations', 'Aerodynamics', 'Navigation', 'Regulations']
      },
      {
        phase: 'Flight Training',
        duration: '6 weeks',
        topics: ['Tailwheel Takeoffs/Landings', 'Cross-Country', 'Emergency Procedures', 'Solo Flight']
      }
    ],
    simulatorDetails: {
      type: 'Flight Training Device',
      locations: ['Vero Beach', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructorQualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating', 'Tailwheel Experience']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewalRequirements: ['Flight Review', 'BFR']
    }
  },
  // Embraer
  {
    id: 'embraer-e190',
    manufacturerId: 'embraer',
    model: 'Embraer E190',
    category: 'regional',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'b971aca02af4435db7104c8c2ce9bbdd',
    description: 'The Embraer E190 is a medium-range, twin-engine, narrow-body jet airliner. It is part of the E-Jet family.',
    firstFlight: 2004,
    specifications: {
      maxTakeoffWeight: '51,800 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '4,540 km',
      capacity: 114,
      engines: 2,
      engineType: 'CF34-10E',
      length: '36.2 m',
      wingspan: '28.7 m',
      height: '10.6 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Regional Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['São Paulo', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'embraer-phenom-300',
    manufacturerId: 'embraer',
    model: 'Embraer Phenom 300',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'cdc1ecc85bf345b788e0094f2fb7e91e',
    description: 'The Embraer Phenom 300 is a light jet aircraft. It is one of the best-selling light jets in the world.',
    firstFlight: 2008,
    specifications: {
      maxTakeoffWeight: '7,969 kg',
      cruisingSpeed: 'Mach 0.80',
      range: '3,650 km',
      capacity: 9,
      engines: 2,
      engineType: 'Pratt & Whitney Canada PW535E',
      length: '15.9 m',
      wingspan: '16.2 m',
      height: '5.3 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Jet Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '2 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Light Jet Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['São Paulo', 'Miami', 'Orlando'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Cirrus
  {
    id: 'cirrus-sr22',
    manufacturerId: 'cirrus',
    model: 'Cirrus SR22',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'cba602c99c524cd4b40e5c2e5f9c5b4f',
    description: 'The Cirrus SR22 is a single-engine, composite aircraft. It is known for its ballistic parachute recovery system.',
    firstFlight: 2001,
    specifications: {
      maxTakeoffWeight: '1,542 kg',
      cruisingSpeed: '183 knots',
      range: '1,870 km',
      capacity: 4,
      engines: 1,
      engineType: 'Continental IO-550',
      length: '7.9 m',
      wingspan: '11.7 m',
      height: '2.8 m'
    },
    trainingRequirements: {
      minimumHours: 40,
      requiredLicenses: ['PPL'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 40,
      simulatorHours: 10,
      flightHours: 40
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Aerodynamics', 'Navigation', 'Meteorology', 'CAPS System']
      },
      {
        phase: 'Flight Training',
        duration: '6 weeks',
        topics: ['Basic Maneuvers', 'Cross-Country', 'Emergency Procedures', 'CAPS Deployment']
      }
    ],
    simulatorDetails: {
      type: 'Flight Training Device',
      locations: ['Duluth', 'Various'],
      features: ['Visual System', 'Instrument Panel', 'CAPS Simulation']
    },
    instructorQualifications: [
      {
        type: 'CSIP',
        requirements: ['Commercial Pilot', 'Cirrus Standardized Instructor Program']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewalRequirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'cirrus-vision-sf50',
    manufacturerId: 'cirrus',
    model: 'Cirrus Vision SF50',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'd46dd06b4b5646acaed90993db34d639',
    description: 'The Cirrus Vision SF50 is a single-engine, very light jet. It is the first single-engine jet to receive FAA certification.',
    firstFlight: 2008,
    specifications: {
      maxTakeoffWeight: '2,722 kg',
      cruisingSpeed: 'Mach 0.75',
      range: '2,240 km',
      capacity: 5,
      engines: 1,
      engineType: 'Williams FJ33',
      length: '9.4 m',
      wingspan: '11.0 m',
      height: '3.0 m'
    },
    trainingRequirements: {
      minimumHours: 500,
      requiredLicenses: ['PPL', 'Jet Rating'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 60,
      simulatorHours: 15,
      flightHours: 15
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Jet Systems', 'Performance', 'Navigation', 'CAPS System']
      },
      {
        phase: 'Simulator Training',
        duration: '2 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Single-Engine Jet Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Duluth', 'Various'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'CSIP',
        requirements: ['Commercial Pilot', 'Cirrus Standardized Instructor Program', 'Jet Experience']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // ATR
  {
    id: 'atr-72-600',
    manufacturerId: 'atr',
    model: 'ATR 72-600',
    category: 'regional',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '1e1a7186f7444d288675262fcee44744',
    description: 'The ATR 72-600 is a twin-engine turboprop regional airliner. It is an upgraded version of the ATR 72 with improved performance and avionics.',
    firstFlight: 2009,
    specifications: {
      maxTakeoffWeight: '23,000 kg',
      cruisingSpeed: '280 knots',
      range: '1,525 km',
      capacity: 78,
      engines: 2,
      engineType: 'Pratt & Whitney Canada PW127M',
      length: '27.2 m',
      wingspan: '27.1 m',
      height: '7.7 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Turboprop Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Regional Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Various'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Let
  {
    id: 'let-l410',
    manufacturerId: 'let',
    model: 'Let L410 Turbolet',
    category: 'regional',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '38c3aaea4de54eb1a20634586c2a215f',
    description: 'The Let L410 Turbolet is a twin-engine turboprop regional airliner. It is widely used in Eastern Europe and Africa.',
    firstFlight: 1969,
    specifications: {
      maxTakeoffWeight: '6,600 kg',
      cruisingSpeed: '170 knots',
      range: '1,510 km',
      capacity: 19,
      engines: 2,
      engineType: 'Walter M601',
      length: '14.4 m',
      wingspan: '19.5 m',
      height: '5.8 m'
    },
    trainingRequirements: {
      minimumHours: 1000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 80,
      simulatorHours: 16,
      flightHours: 8
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Turboprop Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '2 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Short-Field Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Kunovice', 'Various'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Gulfstream
  {
    id: 'gulfstream-g650',
    manufacturerId: 'gulfstream',
    model: 'Gulfstream G650',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '67451e56d38746de86667347d7a56587',
    description: 'The Gulfstream G650 is a long-range, large-cabin business jet. It is one of the fastest business jets in production.',
    firstFlight: 2009,
    specifications: {
      maxTakeoffWeight: '45,359 kg',
      cruisingSpeed: 'Mach 0.925',
      range: '13,890 km',
      capacity: 19,
      engines: 2,
      engineType: 'Rolls-Royce BR725',
      length: '30.4 m',
      wingspan: '28.0 m',
      height: '7.9 m'
    },
    trainingRequirements: {
      minimumHours: 3000,
      requiredLicenses: ['CPL', 'IR', 'ME', 'ATPL'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 120,
      simulatorHours: 30,
      flightHours: 15
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '6 weeks',
        topics: ['Jet Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '5 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Long-Range Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Savannah', 'London', 'Dubai', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Bombardier
  {
    id: 'challenger-350',
    manufacturerId: 'bombardier',
    model: 'Bombardier Challenger 350',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '5f7af63167374f98a3a457f38818b996',
    description: 'The Bombardier Challenger 350 is a super mid-size business jet. It offers a spacious cabin and long-range capabilities.',
    firstFlight: 2013,
    specifications: {
      maxTakeoffWeight: '18,597 kg',
      cruisingSpeed: 'Mach 0.83',
      range: '5,926 km',
      capacity: 10,
      engines: 2,
      engineType: 'GE CF34-3B',
      length: '20.9 m',
      wingspan: '19.5 m',
      height: '6.3 m'
    },
    trainingRequirements: {
      minimumHours: 2000,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 25,
      flightHours: 12
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '5 weeks',
        topics: ['Jet Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '4 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '3 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Business Jet Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Montreal', 'Dallas', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['750 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA / Transport Canada',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'crj-700',
    manufacturerId: 'bombardier',
    model: 'CRJ-700',
    category: 'regional',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '98e4de0ba2b6489c896f224fb70c5e75',
    description: 'The CRJ-700 is a regional jet airliner. It is part of the CRJ series of regional jets.',
    firstFlight: 1999,
    specifications: {
      maxTakeoffWeight: '32,885 kg',
      cruisingSpeed: 'Mach 0.82',
      range: '3,720 km',
      capacity: 78,
      engines: 2,
      engineType: 'GE CF34-8C5',
      length: '32.2 m',
      wingspan: '23.2 m',
      height: '7.6 m'
    },
    trainingRequirements: {
      minimumHours: 1500,
      requiredLicenses: ['CPL', 'IR', 'ME'],
      medicalCertificate: 'Class 1',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 100,
      simulatorHours: 20,
      flightHours: 10
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Regional Operations']
      }
    ],
    simulatorDetails: {
      type: 'Full Flight Simulator',
      locations: ['Montreal', 'Dallas', 'Various'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructorQualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Aeroprakt
  {
    id: 'aeroprakt-a22',
    manufacturerId: 'aeroprakt',
    model: 'Aeroprakt A22 Foxbat',
    category: 'private',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '881d2479d29149b7bf2b5788b869094f',
    description: 'The Aeroprakt A22 Foxbat is a light sport aircraft. It is designed for touring and flight training.',
    firstFlight: 1996,
    specifications: {
      maxTakeoffWeight: '600 kg',
      cruisingSpeed: '90 knots',
      range: '1,000 km',
      capacity: 2,
      engines: 1,
      engineType: 'Rotax 912',
      length: '6.5 m',
      wingspan: '8.4 m',
      height: '2.3 m'
    },
    trainingRequirements: {
      minimumHours: 30,
      requiredLicenses: ['PPL', 'LSA'],
      medicalCertificate: 'Class 2',
      englishProficiency: 'ICAO Level 4',
      groundSchoolHours: 30,
      simulatorHours: 5,
      flightHours: 30
    },
    trainingCurriculum: [
      {
        phase: 'Ground School',
        duration: '3 weeks',
        topics: ['Aerodynamics', 'Navigation', 'Meteorology', 'Regulations']
      },
      {
        phase: 'Flight Training',
        duration: '4 weeks',
        topics: ['Basic Maneuvers', 'Cross-Country', 'Emergency Procedures', 'Solo Flight']
      }
    ],
    simulatorDetails: {
      type: 'Flight Training Device',
      locations: ['Kyiv', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructorQualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '2 years',
      renewalRequirements: ['Flight Review', 'BFR']
    }
  }
];

// Helper functions
export const getManufacturerById = (id: string): Manufacturer | undefined => {
  return manufacturers.find(m => m.id === id);
};

export const getAircraftByManufacturer = (manufacturerId: string): AircraftTypeRating[] => {
  return aircraftTypeRatings.filter(a => a.manufacturerId === manufacturerId);
};

export const getAircraftByCategory = (category: string): AircraftTypeRating[] => {
  return aircraftTypeRatings.filter(a => a.category === category);
};
