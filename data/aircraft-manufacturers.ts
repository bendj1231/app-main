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
  sketchfabId?: string;
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
    logo: 'https://1000logos.net/wp-content/uploads/2020/03/Airbus-Logo.png',
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
    logo: 'https://media.designrush.com/inspiration_images/661396/conversions/1-mobile.jpg',
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
    logo: 'https://1000logos.net/wp-content/uploads/2023/05/Embraer-Logo.jpg',
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
    logo: 'https://avioradar.net/wp-content/uploads/2024/04/Bombardier_new_logo_Foto_C_Bombardier-900x506.png',
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
    logo: 'https://brandcenter.dassault-aviation.com/assets/contents/img/dassault-falcon-jet.png',
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
    logo: 'https://alberthaviation.com/wp-content/uploads/2024/09/pilatus-e1727204799134.jpg',
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
    logo: 'https://1000logos.net/wp-content/uploads/2023/05/Leonardo-Logo.jpg',
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
    logo: 'https://www.atr-aircraft.com/wp-content/uploads/2020/11/ATR_logo3-1.jpg',
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
    logo: 'https://cdn.shoplightspeed.com/shops/603831/files/6133705/890x820x2/red-canoe-brands-sticker-dehavilland-canada-beaver.jpg',
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
    logo: 'https://www.theworldfolio.com/img_db/companies/company-571a2d0dd032c.jpg',
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
    logo: 'https://www.aviationtoday.com/wp-content/uploads/2024/12/air-12-11-photo-4.png',
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
    id: 'cessna',
    name: 'Cessna',
    logo: 'https://static.cdnlogo.com/logos/c/90/cessna-aircraft.png',
    description: 'Cessna is an American general aviation aircraft manufacturer. They are known for their single-engine piston aircraft, business jets, and turboprops.',
    founded: 1927,
    headquarters: 'Wichita, Kansas, USA',
    website: 'https://www.textronaviation.com',
    reputationScore: 9.2,
    totalAircraftCount: 200000,
    trainingCenters: [
      {
        id: 'cessna-wichita',
        name: 'Cessna Flight Training Wichita',
        location: 'Wichita, USA',
        country: 'USA',
        offers: ['172', '182', '206', 'Citation'],
        image: 'https://www.textronaviation.com/content/dam/textron/training-center.jpg',
        website: 'https://www.textronaviation.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '3% annually',
      keyMarkets: ['North America', 'Europe', 'Asia']
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
    id: 'tecnam',
    name: 'Tecnam',
    logo: 'https://logowik.com/content/uploads/images/tecnam3113.logowik.com.webp',
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
    id: 'embraer',
    name: 'Embraer',
    logo: 'https://1000logos.net/wp-content/uploads/2023/05/Embraer-Logo.jpg',
    description: 'Embraer is a Brazilian aerospace conglomerate that produces commercial, military, and executive aircraft. They are known for their E-Jet family and regional aircraft.',
    founded: 1969,
    headquarters: 'São José dos Campos, Brazil',
    website: 'https://www.embraer.com',
    reputationScore: 9.1,
    totalAircraftCount: 8000,
    trainingCenters: [
      {
        id: 'embraer-sao',
        name: 'Embraer Training Center São Paulo',
        location: 'São José dos Campos, Brazil',
        country: 'Brazil',
        offers: ['E190', 'E195', 'Phenom'],
        image: 'https://www.embraer.com/content/dam/embraer/training-center.jpg',
        website: 'https://www.embraer.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '5% annually',
      keyMarkets: ['South America', 'North America', 'Europe', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$50,000 - $70,000',
      midLevel: '$80,000 - $120,000',
      seniorLevel: '$130,000 - $180,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Fleet Manager',
      timeline: '4-6 years to Captain, 9-14 years to senior roles'
    }
  },
  {
    id: 'cirrus',
    name: 'Cirrus',
    logo: 'https://www.flyingmag.com/wp-content/uploads/sites/2/2024/02/cirrus-1.jpeg',
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
    id: 'atr',
    name: 'ATR',
    logo: 'https://www.atr-aircraft.com/wp-content/uploads/2020/11/ATR_logo3-1.jpg',
    description: 'ATR is a French-Italian aircraft manufacturer specializing in regional turboprop aircraft. The ATR 42 and ATR 72 are their most popular models.',
    founded: 1981,
    headquarters: 'Blagnac, France',
    website: 'https://www.atr-aircraft.com',
    reputationScore: 8.8,
    totalAircraftCount: 2000,
    trainingCenters: [
      {
        id: 'atr-toulouse',
        name: 'ATR Training Center Toulouse',
        location: 'Toulouse, France',
        country: 'France',
        offers: ['ATR 42', 'ATR 72'],
        image: 'https://www.atr-aircraft.com/content/dam/atr/training-center.jpg',
        website: 'https://www.atr-aircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '4% annually',
      keyMarkets: ['Europe', 'Asia', 'South America', 'Africa']
    },
    salaryExpectations: {
      entryLevel: '$45,000 - $65,000',
      midLevel: '$70,000 - $100,000',
      seniorLevel: '$110,000 - $160,000',
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
    id: 'gulfstream',
    name: 'Gulfstream',
    logo: 'https://download.logo.wine/logo/Gulfstream_Aerospace/Gulfstream_Aerospace-Logo.wine.png',
    description: 'Gulfstream Aerospace is an American aircraft manufacturer specializing in business jets. They are known for their G-series of large-cabin business jets.',
    founded: 1958,
    headquarters: 'Savannah, Georgia, USA',
    website: 'https://www.gulfstream.com',
    reputationScore: 9.5,
    totalAircraftCount: 3000,
    trainingCenters: [
      {
        id: 'gulfstream-savannah',
        name: 'Gulfstream Training Center Savannah',
        location: 'Savannah, USA',
        country: 'USA',
        offers: ['G650', 'G700', 'G800'],
        image: 'https://www.gulfstream.com/content/dam/gulfstream/training-center.jpg',
        website: 'https://www.gulfstream.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '5% annually',
      keyMarkets: ['North America', 'Europe', 'Asia', 'Middle East']
    },
    salaryExpectations: {
      entryLevel: '$80,000 - $120,000',
      midLevel: '$130,000 - $200,000',
      seniorLevel: '$200,000 - $300,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Captain, 8-12 years to senior roles'
    }
  },
  {
    id: 'bombardier',
    name: 'Bombardier',
    logo: 'https://avioradar.net/wp-content/uploads/2024/04/Bombardier_new_logo_Foto_C_Bombardier-900x506.png',
    description: 'Bombardier is a Canadian aircraft manufacturer known for their CRJ regional jets and Challenger business jets.',
    founded: 1942,
    headquarters: 'Montreal, Quebec, Canada',
    website: 'https://www.bombardier.com',
    reputationScore: 8.9,
    totalAircraftCount: 2000,
    trainingCenters: [
      {
        id: 'bombardier-montreal',
        name: 'Bombardier Training Center Montreal',
        location: 'Montreal, Canada',
        country: 'Canada',
        offers: ['CRJ-700', 'CRJ-900', 'Challenger'],
        image: 'https://www.bombardier.com/content/dam/bombardier/training-center.jpg',
        website: 'https://www.bombardier.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '3% annually',
      keyMarkets: ['North America', 'Europe', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$55,000 - $75,000',
      midLevel: '$80,000 - $120,000',
      seniorLevel: '$130,000 - $190,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Fleet Manager',
      timeline: '4-6 years to Captain, 9-14 years to senior roles'
    }
  },
  {
    id: 'aeroprakt',
    name: 'Aeroprakt',
    logo: 'https://aeroprakt.eu/images/Aeroprakt_logo_www.png',
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
    id: 'a320',
    manufacturerId: 'airbus',
    model: 'A320',
    category: 'commercial',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: 'ae3d357729a44f278f9ef9326977504a',
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
    sketchfabId: '98d21f9c8104445f814cef47ef992889',
    description: 'The Airbus A380 is a double-deck, wide-body, four-engine jet airliner. It is the world\'s largest passenger airliner.',
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
    id: 'b737',
    manufacturerId: 'boeing',
    model: '737',
    category: 'commercial',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    sketchfabId: '7a548b5ba64340f78f7c58d23781ffe9',
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
    sketchfabId: '86ec524a08e74e5e8907771c2d96b525',
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
    sketchfabId: 'be25770697e64f1daef1cc3ad26d3ce7',
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
    sketchfabId: '3ba8a5275d0e41968b34d367c34e8f0f',
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
