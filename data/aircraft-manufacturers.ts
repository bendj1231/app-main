/**
 * Aircraft Manufacturers Data Structure
 * Comprehensive manufacturer and type rating information for Type Rating Search Page
 */

export interface Manufacturer {
  id: string;
  name: string;
  logo: string;
  description: string;
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
  features: string[];
  certificationTracking: boolean;
  milestoneAlerts: boolean;
}

export interface AircraftTypeRating {
  id: string;
  manufacturerId: string;
  model: string;
  category: 'commercial' | 'private' | 'cargo' | 'regional' | 'helicopter' | 'military';
  image: string;
  description: string;
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
  capacity: number;
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Airbus_Logo_2017.svg/1200px-Airbus_Logo_2017.svg.png',
    description: 'Airbus SE is a European multinational aerospace corporation. The company designs, manufactures and sells civil and military aerospace products worldwide.',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/22/Boeing_logo.svg/1200px-Boeing_logo.svg.png',
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
    }
  },
  {
    id: 'embraer',
    name: 'Embraer',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Embraer_logo.svg/1200px-Embraer_logo.svg.png',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bombardier_logo.svg/1200px-Bombardier_logo.svg.png',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Gulfstream_Logo.svg/1200px-Gulfstream_Logo.svg.png',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Cessna_logo.svg/1200px-Cessna_logo.svg.png',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Dassault_Aviation_logo.svg/1200px-Dassault_Aviation_logo.svg.png',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Pilatus_Aircraft_logo.svg/1200px-Pilatus_Aircraft_logo.svg.png',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Beechcraft_logo.svg/1200px-Beechcraft_logo.svg.png',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sikorsky_logo.svg/1200px-Sikorsky_logo.svg.png',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Leonardo_S.p.A._logo.svg/1200px-Leonardo_S.p.A._logo.svg.png',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/ATR_logo.svg/1200px-ATR_logo.svg.png',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/De_Havilland_logo.svg/1200px-De_Havilland_logo.svg.png',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Mitsubishi_Aircraft_logo.svg/1200px-Mitsubishi_Aircraft_logo.svg.png',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/COMAC_logo.svg/1200px-COMAC_logo.svg.png',
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
        image: 'https://www.comac.cc/content/dam/comac/training-center.jpg',
        website: 'https://www.comac.cc/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '8% annually',
      keyMarkets: ['China', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$40,000 - $60,000',
      midLevel: '$60,000 - $90,000',
      seniorLevel: '$90,000 - $140,000',
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
    id: 'sukhoi-superjet',
    name: 'Sukhoi Superjet',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Sukhoi_logo.svg/1200px-Sukhoi_logo.svg.png',
    description: 'Sukhoi Superjet (now Irkut MC-21) is a Russian regional airliner produced by Sukhoi Civil Aircraft.',
    founded: 2000,
    headquarters: 'Moscow, Russia',
    website: 'https://www.irkut.com',
    reputationScore: 7.2,
    totalAircraftCount: 200,
    trainingCenters: [
      {
        id: 'sukhoi-moscow',
        name: 'Sukhoi Training Center Moscow',
        location: 'Moscow, Russia',
        country: 'Russia',
        offers: ['Superjet 100'],
        image: 'https://www.irkut.com/content/dam/irkut/training-center.jpg',
        website: 'https://www.irkut.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'low',
      growthRate: '2% annually',
      keyMarkets: ['Russia', 'CIS']
    },
    salaryExpectations: {
      entryLevel: '$35,000 - $55,000',
      midLevel: '$55,000 - $85,000',
      seniorLevel: '$80,000 - $130,000',
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
    id: 'irkut-mc-21',
    name: 'Irkut MC-21',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Sukhoi_logo.svg/1200px-Sukhoi_logo.svg.png',
    description: 'Irkut MC-21 is a Russian single-aisle airliner produced by Irkut Corporation, a subsidiary of United Aircraft Corporation.',
    founded: 2016,
    headquarters: 'Irkutsk, Russia',
    website: 'https://www.irkut.com',
    reputationScore: 7.5,
    totalAircraftCount: 50,
    trainingCenters: [
      {
        id: 'irkut-irkutsk',
        name: 'Irkut Training Center Irkutsk',
        location: 'Irkutsk, Russia',
        country: 'Russia',
        offers: ['MC-21'],
        image: 'https://www.irkut.com/content/dam/irkut/training-center.jpg',
        website: 'https://www.irkut.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'low',
      growthRate: '3% annually',
      keyMarkets: ['Russia', 'CIS']
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
      seniorLevel: 'Fleet Manager',
      timeline: '5-8 years to Captain, 10-15 years to senior roles'
    }
  }
];

// Aircraft Type Ratings Data
export const aircraftTypeRatings: AircraftTypeRating[] = [
  // Airbus
  {
    id: 'a320',
    manufacturerId: 'airbus',
    model: 'A320',
    category: 'commercial',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A320 is a narrow-body, medium-range, twin-engine jet airliner. It was the first member of the A320 family, which was launched in March 1984.',
    firstFlight: 1987,
    specifications: {
      maxTakeoffWeight: '77,000 kg',
      cruisingSpeed: 'Mach 0.78',
      range: '6,150 km',
      capacity: 180,
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
    id: 'a330',
    manufacturerId: 'airbus',
    model: 'A330',
    category: 'commercial',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
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
        requirements: ['1000 hours on type', 'TRI certification', 'Instructor rating']
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A350 XWB is a long-range, twin-engine, wide-body jet airliner. It was the first Airbus aircraft with both a fuselage and wing structure made primarily of carbon-fiber-reinforced polymer.',
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
        requirements: ['1500 hours on type', 'TRI certification', 'Instructor rating']
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
    category: 'commercial',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Airbus A380 is a wide-body, four-engine, double-deck jet airliner. It is the world\'s largest passenger airliner.',
    firstFlight: 2005,
    specifications: {
      maxTakeoffWeight: '575,000 kg',
      cruisingSpeed: 'Mach 0.85',
      range: '15,200 km',
      capacity: 555,
      engines: 4,
      engineType: 'GP7200 or Trent 900',
      length: '72.72 m',
      wingspan: '79.75 m',
      height: '24.45 m'
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
        requirements: ['2000 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewalRequirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a220',
    manufacturerId: 'airbus',
    model: 'A220',
    category: 'regional',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
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
  // Boeing
  {
    id: 'b737',
    manufacturerId: 'boeing',
    model: '737',
    category: 'commercial',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Boeing 737 is a narrow-body, twin-engine, short- to medium-range jet airliner. It is the best-selling commercial jet airliner in history.',
    firstFlight: 1967,
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
    id: 'b747',
    manufacturerId: 'boeing',
    model: '747',
    category: 'commercial',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Boeing 747 is a wide-body, four-engine jet airliner. It was the first wide-body jet airliner and became known as the "Queen of the Skies".',
    firstFlight: 1969,
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
    id: 'b777',
    manufacturerId: 'boeing',
    model: '777',
    category: 'commercial',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Boeing 777 is a long-range, wide-body twin-engine jet airliner. It is the world\'s largest twin-engine jet airliner.',
    firstFlight: 1994,
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
    model: '787',
    category: 'commercial',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'The Boeing 787 Dreamliner is a long-range, wide-body, twin-engine jet airliner. It is the first airliner to use composite materials for most of its construction.',
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
