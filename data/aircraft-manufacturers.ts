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
  why_choose_rating?: string;
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
  training_requirements: string[];
  careerPath: string;
  keySkills: string[];
  salaryRange: string;
  demandOutlook: string;
  commonRoles: string[];
  additionalNotes?: string;
}

export interface AircraftTypeRating {
  id: string;
  manufacturer_id: string;
  model: string;
  category: 'commercial' | 'private' | 'cargo' | 'regional' | 'helicopter' | 'military' | 'legacy' | 'flagship' | 'end-of-life';
  subcategory?: string;
  image: string;
  sketchfab_id?: string;
  description: string;
  why_choose_rating?: string;
  demandLevel?: 'none' | 'low' | 'high';
  conditionally_new?: 'red' | 'amber' | 'green';
  lifecycle_stage?: 'early-career' | 'mid-career' | 'end-of-life';
  order_backlog?: { orders: number; delivered: number };
  operator_count?: number;
  total_deliveries?: number;
  steep_approach_certified?: boolean;
  engine_type?: string;
  range_versatility?: 'short' | 'medium' | 'long' | 'versatile';
  cabin_features?: string[];
  news?: NewsItem[];
  careerScore?: number;
  pilot_count?: number;
  first_flight: number;
  specifications: AircraftSpecs;
  training_requirements: TrainingRequirements;
  training_curriculum: CurriculumItem[];
  simulator_details: SimulatorInfo;
  instructor_qualifications: InstructorQualification[];
  certification: CertificationInfo;
  success_stories?: SuccessStory[];
  faq?: FAQItem[];
  career_info?: CareerInfo;
}

export interface AircraftSpecs {
  max_takeoff_weight: string;
  cruising_speed: string;
  range: string;
  capacity: number | string;
  engines: number;
  engine_type: string;
  length: string;
  wingspan: string;
  height: string;
}

export interface TrainingRequirements {
  minimum_hours: number;
  required_licenses: string[];
  medical_certificate: string;
  english_proficiency: string;
  ground_school_hours: number;
  simulator_hours: number;
  flight_hours: number;
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
  renewal_requirements: string[];
}

export interface SuccessStory {
  pilot_name: string;
  current_position: string;
  story: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CareerInfo {
  job_market: string;
  average_salary: string;
  airlines_using: string[];
  growth_prospects: string;
}

// Manufacturer Data
export const manufacturers: Manufacturer[] = [
  {
    id: 'airbus',
    name: 'Airbus',
    logo: '',
    heroImage: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'Airbus offers the most comprehensive and authoritative type rating programs directly from the manufacturer. With the world\'s largest Airbus simulator fleet and OEM-direct training, pilots gain unparalleled expertise on the A320 family, A330, A350, and A220. Airbus training is globally recognized by airlines, providing pilots with a competitive edge in career advancement and access to the world\'s most popular commercial aircraft fleet.',
    why_choose_rating: 'Airbus type ratings provide pilots with direct OEM training that is recognized globally by airlines. The Airbus fly-by-wire system and common cockpit philosophy across all Airbus aircraft enable pilots to easily transition between different models, from the A320neo to the A350. With over 200,000 Airbus-rated pilots worldwide and the majority of commercial airline fleets operating Airbus aircraft, an Airbus type rating opens doors to career opportunities with airlines across Europe, Asia, the Middle East, and the Americas.',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.airbus.com/training'
      },
      {
        id: 'airbus-miami',
        name: 'Airbus Training Centre Miami',
        location: 'Miami, USA',
        country: 'United States',
        offers: ['A320', 'A330', 'A350'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
    description: 'Boeing has manufactured well over 25,000 aircraft throughout its century-long history, a total that includes more than 14,000 commercial jetliners currently in active service. Because they do not publish cumulative historical totals for all military and commercial planes ever built, the exact grand total is an ongoing, shifting count. As the world\'s largest aerospace company, Boeing dominates both commercial aviation and defense sectors with iconic platforms like the 737, 777, and 787 families alongside military staples such as the F-15, F/A-18, and C-17. A Boeing type rating opens doors to virtually every major airline and government operator on Earth.',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.boeing.com/training'
      },
      {
        id: 'boeing-seattle',
        name: 'Boeing Training Center Seattle',
        location: 'Seattle, USA',
        country: 'United States',
        offers: ['737', '747', '777', '787'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
      training_requirements: [
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
    logo: '',
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
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
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
  },
  {
    id: 'antonov',
    name: 'Antonov',
    logo: '',
    description: 'Antonov is a Ukrainian aircraft manufacturing and services company known for producing large cargo aircraft including the world\'s largest aircraft, the An-225 Mriya.',
    founded: 1946,
    headquarters: 'Kyiv, Ukraine',
    website: 'https://www.antonov.com',
    reputationScore: 8.0,
    totalAircraftCount: 22000,
    trainingCenters: [
      {
        id: 'antonov-kyiv',
        name: 'Antonov Training Center Kyiv',
        location: 'Kyiv, Ukraine',
        country: 'Ukraine',
        offers: ['An-148', 'An-158', 'An-178'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.antonov.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '3% annually',
      keyMarkets: ['Eastern Europe', 'Asia', 'Africa']
    },
    salaryExpectations: {
      entryLevel: '$40,000 - $55,000',
      midLevel: '$60,000 - $90,000',
      seniorLevel: '$90,000 - $130,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Check Airman',
      timeline: '3-5 years to Captain, 8-12 years to senior roles'
    }
  },
  {
    id: 'ilyushin',
    name: 'Ilyushin',
    logo: '',
    description: 'Ilyushin is a Russian aircraft manufacturer known for designing and building wide-body airliners and military transport aircraft including the Il-96 and Il-76 series.',
    founded: 1933,
    headquarters: 'Moscow, Russia',
    website: 'https://www.ilyushin.org',
    reputationScore: 7.8,
    totalAircraftCount: 12000,
    trainingCenters: [
      {
        id: 'ilyushin-moscow',
        name: 'Ilyushin Training Center Moscow',
        location: 'Moscow, Russia',
        country: 'Russia',
        offers: ['Il-96', 'Il-76', 'Il-114'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.ilyushin.org/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '2% annually',
      keyMarkets: ['Russia', 'Eastern Europe', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$35,000 - $50,000',
      midLevel: '$55,000 - $80,000',
      seniorLevel: '$80,000 - $120,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Check Airman',
      timeline: '3-6 years to Captain, 10-15 years to senior roles'
    }
  },
  {
    id: 'hindustan-aeronautics',
    name: 'Hindustan Aeronautics',
    logo: '',
    description: 'Hindustan Aeronautics Limited (HAL) is an Indian state-owned aerospace and defence company, one of the largest and oldest aerospace manufacturers in Asia, producing military and civil aircraft.',
    founded: 1940,
    headquarters: 'Bangalore, India',
    website: 'https://www.hal-india.com',
    reputationScore: 8.2,
    totalAircraftCount: 4500,
    trainingCenters: [
      {
        id: 'hal-bangalore',
        name: 'HAL Training Center Bangalore',
        location: 'Bangalore, India',
        country: 'India',
        offers: ['LCA Tejas', 'Dhruv', 'Dornier 228'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.hal-india.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '8% annually',
      keyMarkets: ['India', 'Southeast Asia', 'Africa']
    },
    salaryExpectations: {
      entryLevel: '$25,000 - $40,000',
      midLevel: '$45,000 - $70,000',
      seniorLevel: '$70,000 - $110,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Test Pilot',
      seniorLevel: 'Chief Test Pilot',
      timeline: '4-6 years to Test Pilot, 10-15 years to senior roles'
    }
  },
  {
    id: 'dornier',
    name: 'Dornier',
    logo: '',
    description: 'Dornier is a German aircraft manufacturer historically known for innovative flying boat and STOL aircraft designs, including the popular Dornier 228 commuter aircraft.',
    founded: 1914,
    headquarters: 'Oberpfaffenhofen, Germany',
    website: 'https://www.dornier.com',
    reputationScore: 8.0,
    totalAircraftCount: 1500,
    trainingCenters: [
      {
        id: 'dornier-germany',
        name: 'Dornier Flight Training Germany',
        location: 'Oberpfaffenhofen, Germany',
        country: 'Germany',
        offers: ['Dornier 228', 'Dornier 328'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.dornier.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '3% annually',
      keyMarkets: ['Europe', 'Africa', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$35,000 - $50,000',
      midLevel: '$55,000 - $80,000',
      seniorLevel: '$80,000 - $120,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'First Officer',
      midLevel: 'Captain',
      seniorLevel: 'Check Airman',
      timeline: '3-5 years to Captain, 8-12 years to senior roles'
    }
  },
  {
    id: 'archer',
    name: 'Archer Aviation',
    logo: '',
    description: 'Archer Aviation is an American electric aircraft manufacturer developing eVTOL (electric vertical take-off and landing) aircraft for urban air mobility.',
    founded: 2018,
    headquarters: 'San Jose, California, USA',
    website: 'https://www.archer.com',
    reputationScore: 8.5,
    totalAircraftCount: 0,
    trainingCenters: [
      {
        id: 'archer-sanjose',
        name: 'Archer Flight Academy San Jose',
        location: 'San Jose, USA',
        country: 'USA',
        offers: ['Midnight eVTOL'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.archer.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '25% annually',
      keyMarkets: ['North America', 'Europe', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$60,000 - $80,000',
      midLevel: '$90,000 - $130,000',
      seniorLevel: '$130,000 - $180,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'eVTOL Test Pilot',
      midLevel: 'Chief Pilot',
      seniorLevel: 'Director of Flight Operations',
      timeline: '2-4 years to Chief Pilot, 6-10 years to senior roles'
    }
  },
  {
    id: 'joby',
    name: 'Joby Aviation',
    logo: '',
    description: 'Joby Aviation is an American aerospace company developing electric vertical take-off and landing (eVTOL) aircraft for commercial passenger service.',
    founded: 2009,
    headquarters: 'Santa Cruz, California, USA',
    website: 'https://www.jobyaviation.com',
    reputationScore: 8.7,
    totalAircraftCount: 0,
    trainingCenters: [
      {
        id: 'joby-california',
        name: 'Joby Flight Training California',
        location: 'Marina, USA',
        country: 'USA',
        offers: ['Joby S4 eVTOL'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.jobyaviation.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '30% annually',
      keyMarkets: ['North America', 'Europe', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$65,000 - $85,000',
      midLevel: '$95,000 - $140,000',
      seniorLevel: '$140,000 - $200,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'eVTOL Test Pilot',
      midLevel: 'Chief Pilot',
      seniorLevel: 'Director of Flight Operations',
      timeline: '2-4 years to Chief Pilot, 6-10 years to senior roles'
    }
  },
  {
    id: 'mlg',
    name: 'Multi Level Group',
    logo: '',
    description: 'Multi Level Group (MLG) is an aviation services company specializing in aircraft leasing, maintenance, and technical training for commercial and corporate aviation.',
    founded: 2005,
    headquarters: 'Dubai, UAE',
    website: 'https://www.mlg.aero',
    reputationScore: 7.5,
    totalAircraftCount: 800,
    trainingCenters: [
      {
        id: 'mlg-dubai',
        name: 'MLG Aviation Training Center Dubai',
        location: 'Dubai, UAE',
        country: 'UAE',
        offers: ['A320', 'B737', 'Gulfstream'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.mlg.aero/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '5% annually',
      keyMarkets: ['Middle East', 'Africa', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$40,000 - $55,000',
      midLevel: '$60,000 - $90,000',
      seniorLevel: '$90,000 - $130,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Line Maintenance Technician',
      midLevel: 'Maintenance Manager',
      seniorLevel: 'Director of Maintenance',
      timeline: '3-5 years to Maintenance Manager, 8-12 years to senior roles'
    }
  },
  {
    id: 'bell',
    name: 'Bell Textron',
    logo: '',
    description: 'Bell Textron is an American aerospace manufacturer specializing in helicopters and tiltrotor aircraft, known for the iconic Bell UH-1 Iroquois and V-22 Osprey.',
    founded: 1935,
    headquarters: 'Fort Worth, Texas, USA',
    website: 'https://www.bellflight.com',
    reputationScore: 9.2,
    totalAircraftCount: 35000,
    trainingCenters: [
      {
        id: 'bell-fort-worth',
        name: 'Bell Training Academy',
        location: 'Fort Worth, USA',
        country: 'USA',
        offers: ['Bell 206', 'Bell 407', 'Bell 429', 'Bell 505'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.bellflight.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '4% annually',
      keyMarkets: ['North America', 'South America', 'Middle East']
    },
    salaryExpectations: {
      entryLevel: '$50,000 - $70,000',
      midLevel: '$75,000 - $110,000',
      seniorLevel: '$110,000 - $160,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Helicopter Pilot',
      midLevel: 'Senior Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Senior Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'ehang',
    name: 'EHang',
    logo: '',
    description: 'EHang is a Chinese autonomous aerial vehicle (AAV) technology company specializing in passenger-grade eVTOL aircraft and urban air mobility solutions.',
    founded: 2014,
    headquarters: 'Guangzhou, China',
    website: 'https://www.ehang.com',
    reputationScore: 8.3,
    totalAircraftCount: 0,
    trainingCenters: [
      {
        id: 'ehang-guangzhou',
        name: 'EHang Flight Training Center',
        location: 'Guangzhou, China',
        country: 'China',
        offers: ['EH216-S', 'EH216-L', 'EH216-F'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.ehang.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '35% annually',
      keyMarkets: ['China', 'Asia', 'Europe']
    },
    salaryExpectations: {
      entryLevel: '$50,000 - $70,000',
      midLevel: '$75,000 - $110,000',
      seniorLevel: '$110,000 - $160,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'eVTOL Test Pilot',
      midLevel: 'Chief Pilot',
      seniorLevel: 'Director of Flight Operations',
      timeline: '2-4 years to Chief Pilot, 6-10 years to senior roles'
    }
  },
  {
    id: 'raytheon',
    name: 'Raytheon Technologies',
    logo: '',
    description: 'Raytheon Technologies is an American multinational aerospace and defense conglomerate, one of the largest aerospace, intelligence services providers, and defense manufacturers in the world.',
    founded: 1922,
    headquarters: 'Arlington, Virginia, USA',
    website: 'https://www.rtx.com',
    reputationScore: 9.0,
    totalAircraftCount: 50000,
    trainingCenters: [
      {
        id: 'raytheon-arlington',
        name: 'Raytheon Flight Training Center',
        location: 'Arlington, USA',
        country: 'USA',
        offers: ['F-15', 'F-16', 'F-22', 'F-35'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.rtx.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '5% annually',
      keyMarkets: ['North America', 'Europe', 'Middle East']
    },
    salaryExpectations: {
      entryLevel: '$60,000 - $80,000',
      midLevel: '$90,000 - $130,000',
      seniorLevel: '$130,000 - $190,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Test Pilot',
      midLevel: 'Senior Test Pilot',
      seniorLevel: 'Chief Test Pilot',
      timeline: '4-6 years to Senior Test Pilot, 10-15 years to Chief Test Pilot'
    }
  },
  {
    id: 'lilium',
    name: 'Lilium',
    logo: '',
    description: 'Lilium is a German aerospace company developing electric vertical take-off and landing (eVTOL) jets for regional air mobility.',
    founded: 2015,
    headquarters: 'Wessling, Germany',
    website: 'https://www.lilium.com',
    reputationScore: 8.4,
    totalAircraftCount: 0,
    trainingCenters: [
      {
        id: 'lilium-germany',
        name: 'Lilium Flight Training Center',
        location: 'Wessling, Germany',
        country: 'Germany',
        offers: ['Lilium Jet'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.lilium.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '28% annually',
      keyMarkets: ['Europe', 'North America', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$55,000 - $75,000',
      midLevel: '$80,000 - $120,000',
      seniorLevel: '$120,000 - $170,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'eVTOL Test Pilot',
      midLevel: 'Chief Pilot',
      seniorLevel: 'Director of Flight Operations',
      timeline: '2-4 years to Chief Pilot, 6-10 years to senior roles'
    }
  },
  {
    id: 'wisk',
    name: 'Wisk Aero',
    logo: '',
    description: 'Wisk Aero is an American urban air mobility company developing all-electric, autonomous eVTOL aircraft for passenger transportation.',
    founded: 2010,
    headquarters: 'Mountain View, California, USA',
    website: 'https://www.wisk.aero',
    reputationScore: 8.6,
    totalAircraftCount: 0,
    trainingCenters: [
      {
        id: 'wisk-california',
        name: 'Wisk Flight Training Center',
        location: 'Mountain View, USA',
        country: 'USA',
        offers: ['Wisk Cora'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.wisk.aero/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '32% annually',
      keyMarkets: ['North America', 'Australia', 'New Zealand']
    },
    salaryExpectations: {
      entryLevel: '$58,000 - $78,000',
      midLevel: '$85,000 - $125,000',
      seniorLevel: '$125,000 - $175,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Autonomous Flight Operator',
      midLevel: 'Senior Flight Operations',
      seniorLevel: 'Director of Autonomous Flight',
      timeline: '2-4 years to Senior Flight Operations, 6-10 years to senior roles'
    }
  },
  {
    id: 'beta',
    name: 'Beta Technologies',
    logo: '',
    description: 'Beta Technologies is an American electric aerospace company developing eVTOL aircraft and a nationwide charging network for electric aviation.',
    founded: 2017,
    headquarters: 'Burlington, Vermont, USA',
    website: 'https://www.beta.team',
    reputationScore: 8.8,
    totalAircraftCount: 0,
    trainingCenters: [
      {
        id: 'beta-vermont',
        name: 'Beta Flight Training Vermont',
        location: 'Burlington, USA',
        country: 'USA',
        offers: ['Beta Alia'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.beta.team/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '33% annually',
      keyMarkets: ['North America', 'Europe']
    },
    salaryExpectations: {
      entryLevel: '$60,000 - $80,000',
      midLevel: '$90,000 - $130,000',
      seniorLevel: '$130,000 - $180,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'eVTOL Test Pilot',
      midLevel: 'Chief Pilot',
      seniorLevel: 'Director of Flight Operations',
      timeline: '2-4 years to Chief Pilot, 6-10 years to senior roles'
    }
  },
  {
    id: 'autoflight',
    name: 'AutoFlight',
    logo: '',
    description: 'AutoFlight is a Chinese eVTOL aircraft developer focused on autonomous aerial vehicles for cargo and passenger transportation.',
    founded: 2016,
    headquarters: 'Kunshan, China',
    website: 'https://www.autoflight.com',
    reputationScore: 8.1,
    totalAircraftCount: 0,
    trainingCenters: [
      {
        id: 'autoflight-china',
        name: 'AutoFlight Training Center',
        location: 'Kunshan, China',
        country: 'China',
        offers: ['Prosperity I', 'CarryAll'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.autoflight.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '30% annually',
      keyMarkets: ['China', 'Asia', 'Europe']
    },
    salaryExpectations: {
      entryLevel: '$45,000 - $65,000',
      midLevel: '$70,000 - $100,000',
      seniorLevel: '$100,000 - $150,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'eVTOL Test Pilot',
      midLevel: 'Chief Pilot',
      seniorLevel: 'Director of Flight Operations',
      timeline: '2-4 years to Chief Pilot, 6-10 years to senior roles'
    }
  },
  {
    id: 'eve',
    name: 'Eve Air Mobility',
    logo: '',
    description: 'Eve Air Mobility is a Brazilian-American eVTOL company developing urban air mobility solutions, spun off from Embraer.',
    founded: 2020,
    headquarters: 'Melbourne, Florida, USA',
    website: 'https://www.eveairmobility.com',
    reputationScore: 8.7,
    totalAircraftCount: 0,
    trainingCenters: [
      {
        id: 'eve-florida',
        name: 'Eve Flight Training Center',
        location: 'Melbourne, USA',
        country: 'USA',
        offers: ['Eve eVTOL'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.eveairmobility.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '28% annually',
      keyMarkets: ['North America', 'South America', 'Europe']
    },
    salaryExpectations: {
      entryLevel: '$55,000 - $75,000',
      midLevel: '$80,000 - $120,000',
      seniorLevel: '$120,000 - $170,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'eVTOL Test Pilot',
      midLevel: 'Chief Pilot',
      seniorLevel: 'Director of Flight Operations',
      timeline: '2-4 years to Chief Pilot, 6-10 years to senior roles'
    }
  },
  {
    id: 'mooney',
    name: 'Mooney',
    logo: '',
    description: 'Mooney International is an American general aviation aircraft manufacturer known for its high-performance, efficiency-focused single-engine piston aircraft.',
    founded: 1929,
    headquarters: 'Kerrville, Texas, USA',
    website: 'https://www.mooney.com',
    reputationScore: 8.5,
    totalAircraftCount: 11500,
    trainingCenters: [
      {
        id: 'mooney-texas',
        name: 'Mooney Flight Training Texas',
        location: 'Kerrville, USA',
        country: 'USA',
        offers: ['Mooney M20', 'Mooney Ovation', 'Mooney Acclaim'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.mooney.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '3% annually',
      keyMarkets: ['North America', 'Europe', 'Australia']
    },
    salaryExpectations: {
      entryLevel: '$35,000 - $50,000',
      midLevel: '$55,000 - $80,000',
      seniorLevel: '$80,000 - $120,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Corporate Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Corporate Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'pipistrel',
    name: 'Pipistrel',
    logo: '',
    description: 'Pipistrel is a Slovenian light aircraft manufacturer specializing in energy-efficient and electric aircraft, known for the Velis Electro and Taurus self-launching gliders.',
    founded: 1989,
    headquarters: 'Ajdovscina, Slovenia',
    website: 'https://www.pipistrel.com',
    reputationScore: 9.0,
    totalAircraftCount: 2500,
    trainingCenters: [
      {
        id: 'pipistrel-slovenia',
        name: 'Pipistrel Flight Training Slovenia',
        location: 'Ajdovscina, Slovenia',
        country: 'Slovenia',
        offers: ['Pipistrel Velis Electro', 'Pipistrel Virus', 'Pipistrel Taurus'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.pipistrel.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '8% annually',
      keyMarkets: ['Europe', 'North America', 'Australia']
    },
    salaryExpectations: {
      entryLevel: '$30,000 - $45,000',
      midLevel: '$50,000 - $75,000',
      seniorLevel: '$75,000 - $110,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Test Pilot',
      seniorLevel: 'Chief Test Pilot',
      timeline: '3-5 years to Test Pilot, 8-12 years to Chief Test Pilot'
    }
  },
  {
    id: 'aviat',
    name: 'Aviat Aircraft',
    logo: '',
    description: 'Aviat Aircraft is an American manufacturer of high-performance aerobatic and utility aircraft, known for the Pitts Special and Husky series.',
    founded: 1967,
    headquarters: 'Afton, Wyoming, USA',
    website: 'https://www.aviataircraft.com',
    reputationScore: 8.7,
    totalAircraftCount: 3000,
    trainingCenters: [
      {
        id: 'aviat-wyoming',
        name: 'Aviat Flight Training Wyoming',
        location: 'Afton, USA',
        country: 'USA',
        offers: ['Pitts Special', 'Husky A-1C'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.aviataircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '4% annually',
      keyMarkets: ['North America', 'Europe', 'Australia']
    },
    salaryExpectations: {
      entryLevel: '$30,000 - $45,000',
      midLevel: '$50,000 - $75,000',
      seniorLevel: '$75,000 - $110,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Aerobatic Pilot',
      seniorLevel: 'Chief Aerobatic Instructor',
      timeline: '3-5 years to Aerobatic Pilot, 8-12 years to Chief Aerobatic Instructor'
    }
  },
  {
    id: 'american-champion',
    name: 'American Champion Aircraft',
    logo: '',
    description: 'American Champion Aircraft is an American manufacturer of light utility and aerobatic aircraft, known for the Citabria, Decathlon, and Scout series.',
    founded: 1988,
    headquarters: 'Rochester, Wisconsin, USA',
    website: 'https://www.americanchampionaircraft.com',
    reputationScore: 8.6,
    totalAircraftCount: 5000,
    trainingCenters: [
      {
        id: 'american-champion-wisconsin',
        name: 'American Champion Flight Training Wisconsin',
        location: 'Rochester, USA',
        country: 'USA',
        offers: ['Citabria', 'Decathlon', 'Scout'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.americanchampionaircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '3% annually',
      keyMarkets: ['North America', 'South America', 'Australia']
    },
    salaryExpectations: {
      entryLevel: '$30,000 - $45,000',
      midLevel: '$50,000 - $75,000',
      seniorLevel: '$75,000 - $110,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Aerobatic Pilot',
      seniorLevel: 'Chief Aerobatic Instructor',
      timeline: '3-5 years to Aerobatic Pilot, 8-12 years to Chief Aerobatic Instructor'
    }
  },
  {
    id: 'sling',
    name: 'Sling Aircraft',
    logo: '',
    description: 'Sling Aircraft is a South African light sport aircraft manufacturer known for the Sling 2 and Sling 4 series of high-performance kit and factory-built aircraft.',
    founded: 2008,
    headquarters: 'Johannesburg, South Africa',
    website: 'https://www.slingaircraft.com',
    reputationScore: 8.4,
    totalAircraftCount: 1200,
    trainingCenters: [
      {
        id: 'sling-south-africa',
        name: 'Sling Flight Training South Africa',
        location: 'Johannesburg, South Africa',
        country: 'South Africa',
        offers: ['Sling 2', 'Sling 4', 'Sling TSi'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.slingaircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '6% annually',
      keyMarkets: ['Africa', 'Australia', 'North America', 'Europe']
    },
    salaryExpectations: {
      entryLevel: '$25,000 - $40,000',
      midLevel: '$45,000 - $65,000',
      seniorLevel: '$65,000 - $95,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Test Pilot',
      seniorLevel: 'Chief Test Pilot',
      timeline: '3-5 years to Test Pilot, 8-12 years to Chief Test Pilot'
    }
  },
  {
    id: 'epic',
    name: 'Epic Aircraft',
    logo: '',
    description: 'Epic Aircraft is an American manufacturer of high-performance single-turboprop aircraft, known for the Epic E1000 GX all-carbon-fiber luxury aircraft.',
    founded: 1995,
    headquarters: 'Bend, Oregon, USA',
    website: 'https://www.epicaircraft.com',
    reputationScore: 8.8,
    totalAircraftCount: 500,
    trainingCenters: [
      {
        id: 'epic-oregon',
        name: 'Epic Flight Training Oregon',
        location: 'Bend, USA',
        country: 'USA',
        offers: ['Epic E1000 GX'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.epicaircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '7% annually',
      keyMarkets: ['North America', 'Europe', 'Middle East']
    },
    salaryExpectations: {
      entryLevel: '$45,000 - $65,000',
      midLevel: '$70,000 - $100,000',
      seniorLevel: '$100,000 - $150,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Corporate Pilot',
      midLevel: 'Senior Corporate Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Senior Corporate Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'socata',
    name: 'SOCATA (Daher)',
    logo: '',
    description: 'SOCATA (now Daher) is a French aircraft manufacturer known for the TBM series of high-performance single-turboprop business aircraft, now marketed as Daher TBM.',
    founded: 1966,
    headquarters: 'Tarbes, France',
    website: 'https://www.daher.com',
    reputationScore: 9.1,
    totalAircraftCount: 2500,
    trainingCenters: [
      {
        id: 'socata-france',
        name: 'Daher TBM Training Center',
        location: 'Tarbes, France',
        country: 'France',
        offers: ['TBM 910', 'TBM 960'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.daher.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '5% annually',
      keyMarkets: ['North America', 'Europe', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$50,000 - $70,000',
      midLevel: '$75,000 - $110,000',
      seniorLevel: '$110,000 - $160,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Corporate Pilot',
      midLevel: 'Senior Corporate Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Senior Corporate Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'hondajet',
    name: 'Honda Aircraft Company',
    logo: '',
    description: 'Honda Aircraft Company is an American aircraft manufacturer and subsidiary of Honda Motor Company, known for the HondaJet series of light business jets featuring over-the-wing engine mount design.',
    founded: 2006,
    headquarters: 'Greensboro, North Carolina, USA',
    website: 'https://www.hondajet.com',
    reputationScore: 9.2,
    totalAircraftCount: 250,
    trainingCenters: [
      {
        id: 'hondajet-north-carolina',
        name: 'HondaJet Training Center',
        location: 'Greensboro, USA',
        country: 'USA',
        offers: ['HondaJet HA-420', 'HondaJet Elite', 'HondaJet Elite II'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.hondajet.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '8% annually',
      keyMarkets: ['North America', 'Europe', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$55,000 - $75,000',
      midLevel: '$85,000 - $120,000',
      seniorLevel: '$120,000 - $180,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Corporate Pilot',
      midLevel: 'Senior Corporate Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Senior Corporate Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'airtractor',
    name: 'Air Tractor',
    logo: '',
    description: 'Air Tractor is an American aircraft manufacturer specializing in agricultural aircraft, aerial firefighting planes, and utility aircraft based in Olney, Texas.',
    founded: 1973,
    headquarters: 'Olney, Texas, USA',
    website: 'https://www.airtractor.com',
    reputationScore: 8.5,
    totalAircraftCount: 3500,
    trainingCenters: [
      {
        id: 'airtractor-texas',
        name: 'Air Tractor Training Center',
        location: 'Olney, USA',
        country: 'USA',
        offers: ['AT-402', 'AT-502', 'AT-602', 'AT-802'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.airtractor.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '4% annually',
      keyMarkets: ['North America', 'South America', 'Australia', 'Africa']
    },
    salaryExpectations: {
      entryLevel: '$35,000 - $50,000',
      midLevel: '$55,000 - $80,000',
      seniorLevel: '$80,000 - $120,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Agricultural Pilot',
      midLevel: 'Senior Agricultural Pilot',
      seniorLevel: 'Chief Pilot / Operations Manager',
      timeline: '3-5 years to Senior Agricultural Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'thrush',
    name: 'Thrush Aircraft',
    logo: '',
    description: 'Thrush Aircraft is an American manufacturer of agricultural aircraft and aerial application planes, known for the Thrush series of turboprop crop dusters and firefighting aircraft.',
    founded: 2003,
    headquarters: 'Albany, Georgia, USA',
    website: 'https://www.thrushaircraft.com',
    reputationScore: 8.4,
    totalAircraftCount: 2000,
    trainingCenters: [
      {
        id: 'thrush-georgia',
        name: 'Thrush Aircraft Training Center',
        location: 'Albany, USA',
        country: 'USA',
        offers: ['Thrush 510P', 'Thrush 710P', 'Thrush S2R-T34'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.thrushaircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '3% annually',
      keyMarkets: ['North America', 'South America', 'Australia', 'Africa']
    },
    salaryExpectations: {
      entryLevel: '$35,000 - $50,000',
      midLevel: '$55,000 - $80,000',
      seniorLevel: '$80,000 - $120,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Agricultural Pilot',
      midLevel: 'Senior Agricultural Pilot',
      seniorLevel: 'Chief Pilot / Operations Manager',
      timeline: '3-5 years to Senior Agricultural Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'elixir',
    name: 'Elixir Aircraft',
    logo: '',
    description: 'Elixir Aircraft is a French light sport aircraft manufacturer known for the Elixir, a modern two-seat high-wing aircraft made from carbon fiber with advanced safety features.',
    founded: 2015,
    headquarters: 'La Rochelle, France',
    website: 'https://www.elixir-aircraft.com',
    reputationScore: 8.6,
    totalAircraftCount: 200,
    trainingCenters: [
      {
        id: 'elixir-france',
        name: 'Elixir Aircraft Training France',
        location: 'La Rochelle, France',
        country: 'France',
        offers: ['Elixir'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.elixir-aircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '12% annually',
      keyMarkets: ['Europe', 'North America', 'Australia']
    },
    salaryExpectations: {
      entryLevel: '$30,000 - $45,000',
      midLevel: '$50,000 - $70,000',
      seniorLevel: '$70,000 - $100,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Test Pilot',
      seniorLevel: 'Chief Test Pilot',
      timeline: '3-5 years to Test Pilot, 8-12 years to Chief Test Pilot'
    }
  },
  {
    id: 'icon',
    name: 'Icon Aircraft',
    logo: '',
    description: 'Icon Aircraft is an American light sport aircraft manufacturer known for the A5, an amphibious two-seat personal aircraft designed for recreational flying with spin-resistant safety features.',
    founded: 2006,
    headquarters: 'Tampa, Florida, USA',
    website: 'https://www.iconaircraft.com',
    reputationScore: 8.7,
    totalAircraftCount: 200,
    trainingCenters: [
      {
        id: 'icon-florida',
        name: 'Icon Aircraft Training Center',
        location: 'Tampa, USA',
        country: 'USA',
        offers: ['Icon A5'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.iconaircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '6% annually',
      keyMarkets: ['North America', 'Europe', 'Australia']
    },
    salaryExpectations: {
      entryLevel: '$30,000 - $45,000',
      midLevel: '$50,000 - $70,000',
      seniorLevel: '$70,000 - $100,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Test Pilot',
      seniorLevel: 'Chief Test Pilot',
      timeline: '3-5 years to Test Pilot, 8-12 years to Chief Test Pilot'
    }
  },
  {
    id: 'waco',
    name: 'Waco Aircraft',
    logo: '',
    description: 'Waco Aircraft is an American aircraft manufacturer known for its classic biplanes, including the YMF series, and modern sport and aerobatic aircraft.',
    founded: 1919,
    headquarters: 'Battle Creek, Michigan, USA',
    website: 'https://www.wacoaircraft.com',
    reputationScore: 8.8,
    totalAircraftCount: 5000,
    trainingCenters: [
      {
        id: 'waco-michigan',
        name: 'Waco Flight Training Michigan',
        location: 'Battle Creek, USA',
        country: 'USA',
        offers: ['Waco YMF-5', 'Waco Classic'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.wacoaircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '2% annually',
      keyMarkets: ['North America', 'Europe']
    },
    salaryExpectations: {
      entryLevel: '$30,000 - $45,000',
      midLevel: '$50,000 - $75,000',
      seniorLevel: '$75,000 - $110,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Aerobatic Pilot',
      seniorLevel: 'Chief Aerobatic Instructor',
      timeline: '3-5 years to Aerobatic Pilot, 8-12 years to Chief Aerobatic Instructor'
    }
  },
  {
    id: 'vulcanair',
    name: 'Vulcanair',
    logo: '',
    description: 'Vulcanair is an Italian aircraft manufacturer known for the P68, A-Viator, and Canguro series of light twin-engine aircraft used for utility, surveillance, and training.',
    founded: 1996,
    headquarters: 'Casoria, Naples, Italy',
    website: 'https://www.vulcanair.com',
    reputationScore: 8.4,
    totalAircraftCount: 800,
    trainingCenters: [
      {
        id: 'vulcanair-italy',
        name: 'Vulcanair Training Center Italy',
        location: 'Casoria, Italy',
        country: 'Italy',
        offers: ['P68 Observer', 'P68R', 'A-Viator', 'Canguro'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.vulcanair.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '4% annually',
      keyMarkets: ['Europe', 'North America', 'Africa', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$35,000 - $50,000',
      midLevel: '$55,000 - $80,000',
      seniorLevel: '$80,000 - $120,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Corporate Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Corporate Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'mahindra',
    name: 'Mahindra Aerospace',
    logo: '',
    description: 'Mahindra Aerospace is an Indian aircraft manufacturer and subsidiary of the Mahindra Group, producing the GippsAero GA8 Airvan series of utility aircraft.',
    founded: 2003,
    headquarters: 'Melbourne, Australia / Bengaluru, India',
    website: 'https://www.mahindraaerospace.com',
    reputationScore: 8.3,
    totalAircraftCount: 250,
    trainingCenters: [
      {
        id: 'mahindra-australia',
        name: 'Mahindra Aerospace Training Australia',
        location: 'Melbourne, Australia',
        country: 'Australia',
        offers: ['GA8 Airvan', 'GA10'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.mahindraaerospace.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '5% annually',
      keyMarkets: ['Australia', 'India', 'Africa', 'North America']
    },
    salaryExpectations: {
      entryLevel: '$30,000 - $45,000',
      midLevel: '$50,000 - $70,000',
      seniorLevel: '$70,000 - $100,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Utility Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Utility Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'twin-commander',
    name: 'Twin Commander',
    logo: '',
    description: 'Twin Commander is an American aircraft manufacturer known for the Commander series of twin-turboprop business aircraft, originally developed by Rockwell and now supported by Twin Commander Aircraft LLC.',
    founded: 1950,
    headquarters: 'Crestview, Florida, USA',
    website: 'https://www.twin-commander.com',
    reputationScore: 8.7,
    totalAircraftCount: 4000,
    trainingCenters: [
      {
        id: 'twin-commander-florida',
        name: 'Twin Commander Training Center',
        location: 'Crestview, USA',
        country: 'USA',
        offers: ['690B', '690C', '695A', '695B'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.twin-commander.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '2% annually',
      keyMarkets: ['North America', 'Europe', 'Australia']
    },
    salaryExpectations: {
      entryLevel: '$45,000 - $65,000',
      midLevel: '$70,000 - $100,000',
      seniorLevel: '$100,000 - $150,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Corporate Pilot',
      midLevel: 'Senior Corporate Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Senior Corporate Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'britten-norman',
    name: 'Britten-Norman',
    logo: '',
    description: 'Britten-Norman is a British aircraft manufacturer known for the Islander and Defender series of rugged twin-turboprop utility aircraft used for regional transport and special missions.',
    founded: 1951,
    headquarters: 'Bembridge, Isle of Wight, UK',
    website: 'https://www.britten-norman.com',
    reputationScore: 8.6,
    totalAircraftCount: 1300,
    trainingCenters: [
      {
        id: 'britten-norman-uk',
        name: 'Britten-Norman Training UK',
        location: 'Bembridge, UK',
        country: 'UK',
        offers: ['BN-2 Islander', 'BN-2T Turbine Islander', 'Defender'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.britten-norman.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '3% annually',
      keyMarkets: ['Europe', 'Caribbean', 'Pacific Islands', 'Africa']
    },
    salaryExpectations: {
      entryLevel: '$35,000 - $50,000',
      midLevel: '$55,000 - $80,000',
      seniorLevel: '$80,000 - $120,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Regional Pilot',
      midLevel: 'Senior Regional Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Senior Regional Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'evektor',
    name: 'Evektor Technik',
    logo: '',
    description: 'Evektor Technik is a Czech aircraft manufacturer known for the SportStar, Harmony, and EV-97 series of light sport and training aircraft.',
    founded: 1991,
    headquarters: 'Kunovice, Czech Republic',
    website: 'https://www.evektor.cz',
    reputationScore: 8.4,
    totalAircraftCount: 1200,
    trainingCenters: [
      {
        id: 'evektor-czech',
        name: 'Evektor Flight Training Czech Republic',
        location: 'Kunovice, Czech Republic',
        country: 'Czech Republic',
        offers: ['SportStar RTC', 'Harmony', 'EV-97 Eurostar'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.evektor.cz/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '4% annually',
      keyMarkets: ['Europe', 'North America', 'Asia', 'Australia']
    },
    salaryExpectations: {
      entryLevel: '$25,000 - $40,000',
      midLevel: '$40,000 - $60,000',
      seniorLevel: '$60,000 - $90,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Test Pilot',
      seniorLevel: 'Chief Test Pilot',
      timeline: '3-5 years to Test Pilot, 8-12 years to Chief Test Pilot'
    }
  },
  {
    id: 'bristell',
    name: 'Bristell',
    logo: '',
    description: 'Bristell is a Czech light sport aircraft manufacturer known for the Bristell NG5 series of modern two-seat low-wing aircraft designed for flight training and recreational flying.',
    founded: 2009,
    headquarters: 'Brno, Czech Republic',
    website: 'https://www.bristell.com',
    reputationScore: 8.5,
    totalAircraftCount: 500,
    trainingCenters: [
      {
        id: 'bristell-czech',
        name: 'Bristell Flight Training Czech Republic',
        location: 'Brno, Czech Republic',
        country: 'Czech Republic',
        offers: ['Bristell NG5', 'Bristell B8', 'Bristell TDO'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.bristell.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '6% annually',
      keyMarkets: ['Europe', 'North America', 'Australia', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$25,000 - $40,000',
      midLevel: '$40,000 - $60,000',
      seniorLevel: '$60,000 - $90,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Test Pilot',
      seniorLevel: 'Chief Test Pilot',
      timeline: '3-5 years to Test Pilot, 8-12 years to Chief Test Pilot'
    }
  },
  {
    id: 'velocity',
    name: 'Velocity Aircraft',
    logo: '',
    description: 'Velocity Aircraft is an American kit aircraft manufacturer known for the Velocity series of composite four-seat canard pusher aircraft designed for high performance and efficiency.',
    founded: 1984,
    headquarters: 'Sanford, Florida, USA',
    website: 'https://www.velocityaircraft.com',
    reputationScore: 8.7,
    totalAircraftCount: 1000,
    trainingCenters: [
      {
        id: 'velocity-florida',
        name: 'Velocity Aircraft Training Florida',
        location: 'Sanford, USA',
        country: 'USA',
        offers: ['Velocity XL', 'Velocity TXL', 'Velocity V-Twin'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.velocityaircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '3% annually',
      keyMarkets: ['North America', 'Europe', 'Australia']
    },
    salaryExpectations: {
      entryLevel: '$35,000 - $50,000',
      midLevel: '$55,000 - $80,000',
      seniorLevel: '$80,000 - $120,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Test Pilot',
      seniorLevel: 'Chief Test Pilot',
      timeline: '3-5 years to Test Pilot, 8-12 years to Chief Test Pilot'
    }
  },
  {
    id: 'quest',
    name: 'Quest Aircraft (Daher Kodiak)',
    logo: '',
    description: 'Quest Aircraft was an American aircraft manufacturer known for the Kodiak 100 series of rugged single-turboprop utility aircraft, now marketed as the Daher Kodiak.',
    founded: 2001,
    headquarters: 'Sandpoint, Idaho, USA',
    website: 'https://www.daher.com',
    reputationScore: 8.9,
    totalAircraftCount: 300,
    trainingCenters: [
      {
        id: 'quest-idaho',
        name: 'Kodiak Training Center',
        location: 'Sandpoint, USA',
        country: 'USA',
        offers: ['Kodiak 100 Series II', 'Kodiak 100 Series III'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.daher.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '7% annually',
      keyMarkets: ['North America', 'Africa', 'Asia', 'Pacific Islands']
    },
    salaryExpectations: {
      entryLevel: '$40,000 - $60,000',
      midLevel: '$65,000 - $95,000',
      seniorLevel: '$95,000 - $140,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Utility Pilot',
      midLevel: 'Senior Utility Pilot',
      seniorLevel: 'Chief Pilot',
      timeline: '3-5 years to Senior Utility Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'pacific-aerospace',
    name: 'Pacific Aerospace',
    logo: '',
    description: 'Pacific Aerospace is a New Zealand aircraft manufacturer known for the Fletcher, Cresco, and CT4 series of agricultural, utility, and training aircraft.',
    founded: 1955,
    headquarters: 'Hamilton, New Zealand',
    website: 'https://www.pacificaerospace.co.nz',
    reputationScore: 8.3,
    totalAircraftCount: 1200,
    trainingCenters: [
      {
        id: 'pacific-aerospace-nz',
        name: 'Pacific Aerospace Training New Zealand',
        location: 'Hamilton, New Zealand',
        country: 'New Zealand',
        offers: ['Fletcher FU24', 'Cresco', 'CT4 Airtrainer'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.pacificaerospace.co.nz/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '3% annually',
      keyMarkets: ['New Zealand', 'Australia', 'Africa', 'South America']
    },
    salaryExpectations: {
      entryLevel: '$30,000 - $45,000',
      midLevel: '$50,000 - $70,000',
      seniorLevel: '$70,000 - $100,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Agricultural Pilot',
      midLevel: 'Senior Agricultural Pilot',
      seniorLevel: 'Chief Pilot / Operations Manager',
      timeline: '3-5 years to Senior Agricultural Pilot, 8-12 years to Chief Pilot'
    }
  },
  {
    id: 'aero-east-europe',
    name: 'Aero East Europe',
    logo: '',
    description: 'Aero East Europe is a Bulgarian aircraft manufacturer known for the Sila and Antares series of light sport and ultralight aircraft designed for training and recreational flying.',
    founded: 2001,
    headquarters: 'Kazanlak, Bulgaria',
    website: 'https://www.aeroeast.net',
    reputationScore: 8.2,
    totalAircraftCount: 400,
    trainingCenters: [
      {
        id: 'aero-east-europe-bulgaria',
        name: 'Aero East Europe Training Bulgaria',
        location: 'Kazanlak, Bulgaria',
        country: 'Bulgaria',
        offers: ['Sila 450', 'Antares MA32', 'Antares MA34'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.aeroeast.net/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '4% annually',
      keyMarkets: ['Europe', 'Asia', 'Africa']
    },
    salaryExpectations: {
      entryLevel: '$20,000 - $35,000',
      midLevel: '$35,000 - $55,000',
      seniorLevel: '$55,000 - $80,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Test Pilot',
      seniorLevel: 'Chief Test Pilot',
      timeline: '3-5 years to Test Pilot, 8-12 years to Chief Test Pilot'
    }
  },
  {
    id: 'jmb',
    name: 'JMB Aircraft',
    logo: '',
    description: 'JMB Aircraft is a French light sport aircraft manufacturer known for the JMB VL-3 and JMB VL-3 Evolution series of high-performance two-seat ultralight aircraft.',
    founded: 2004,
    headquarters: 'Belfort, France',
    website: 'https://www.jmbaircraft.com',
    reputationScore: 8.4,
    totalAircraftCount: 600,
    trainingCenters: [
      {
        id: 'jmb-france',
        name: 'JMB Aircraft Training France',
        location: 'Belfort, France',
        country: 'France',
        offers: ['JMB VL-3', 'JMB VL-3 Evolution', 'JMB VL-3 Turbo'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.jmbaircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'medium',
      growthRate: '5% annually',
      keyMarkets: ['Europe', 'North America', 'Asia']
    },
    salaryExpectations: {
      entryLevel: '$25,000 - $40,000',
      midLevel: '$40,000 - $60,000',
      seniorLevel: '$60,000 - $90,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Test Pilot',
      seniorLevel: 'Chief Test Pilot',
      timeline: '3-5 years to Test Pilot, 8-12 years to Chief Test Pilot'
    }
  },
  {
    id: 'foxcon',
    name: 'Foxcon Aviation',
    logo: '',
    description: 'Foxcon Aviation is a Czech light sport and ultralight aircraft manufacturer known for the Foxcon Terrier and Foxcon Viper series of two-seat high-wing aircraft.',
    founded: 2008,
    headquarters: 'Jihlava, Czech Republic',
    website: 'https://www.foxcon.cz',
    reputationScore: 8.1,
    totalAircraftCount: 300,
    trainingCenters: [
      {
        id: 'foxcon-czech',
        name: 'Foxcon Aviation Training Czech Republic',
        location: 'Jihlava, Czech Republic',
        country: 'Czech Republic',
        offers: ['Foxcon Terrier 200', 'Foxcon Viper', 'Foxcon Alpha'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.foxcon.cz/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'low',
      growthRate: '4% annually',
      keyMarkets: ['Europe', 'Asia', 'Africa']
    },
    salaryExpectations: {
      entryLevel: '$20,000 - $35,000',
      midLevel: '$35,000 - $50,000',
      seniorLevel: '$50,000 - $75,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Test Pilot',
      seniorLevel: 'Chief Test Pilot',
      timeline: '3-5 years to Test Pilot, 8-12 years to Chief Test Pilot'
    }
  },
  {
    id: 'grob',
    name: 'Grob Aircraft',
    logo: '',
    description: 'Grob Aircraft is a German aircraft manufacturer known for the G 120 and G 115 series of high-performance composite training aircraft used by military and civilian flight schools worldwide.',
    founded: 1971,
    headquarters: 'Mindelheim, Bavaria, Germany',
    website: 'https://www.grob-aircraft.com',
    reputationScore: 8.8,
    totalAircraftCount: 3500,
    trainingCenters: [
      {
        id: 'grob-germany',
        name: 'Grob Aircraft Training Germany',
        location: 'Mindelheim, Germany',
        country: 'Germany',
        offers: ['G 120TP', 'G 115', 'G 520', 'G 109'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.grob-aircraft.com/training'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '4% annually',
      keyMarkets: ['Europe', 'North America', 'Asia', 'Middle East', 'Australia']
    },
    salaryExpectations: {
      entryLevel: '$35,000 - $50,000',
      midLevel: '$55,000 - $80,000',
      seniorLevel: '$80,000 - $120,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Flight Instructor',
      midLevel: 'Military Trainer Pilot',
      seniorLevel: 'Chief Training Captain',
      timeline: '3-5 years to Military Trainer Pilot, 8-12 years to Chief Training Captain'
    }
  },
  {
    id: 'elroy-air',
    name: 'Elroy Air',
    logo: '',
    description: 'Elroy Air is an American aerospace company developing autonomous cargo aircraft systems, including the Chaparral VTOL drone designed for middle-mile logistics and humanitarian aid delivery.',
    founded: 2016,
    headquarters: 'San Francisco, California, USA',
    website: 'https://www.elroyair.com',
    reputationScore: 8.5,
    totalAircraftCount: 50,
    trainingCenters: [
      {
        id: 'elroy-air-california',
        name: 'Elroy Air Flight Operations Center',
        location: 'San Francisco, USA',
        country: 'USA',
        offers: ['Chaparral VTOL', 'Autonomous Cargo Systems'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.elroyair.com/careers'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '25% annually',
      keyMarkets: ['North America', 'Europe', 'Middle East', 'Africa']
    },
    salaryExpectations: {
      entryLevel: '$60,000 - $85,000',
      midLevel: '$90,000 - $130,000',
      seniorLevel: '$130,000 - $180,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'UAV Pilot',
      midLevel: 'Autonomous Systems Engineer',
      seniorLevel: 'Chief Autonomous Flight Operations',
      timeline: '3-5 years to Autonomous Systems Engineer, 8-12 years to Chief Autonomous Flight Operations'
    }
  },
  {
    id: 'pyka',
    name: 'Pyka',
    logo: '',
    description: 'Pyka is an American autonomous aviation company developing electric-powered, self-flying cargo aircraft including the Pelican series for agricultural spraying and logistics.',
    founded: 2017,
    headquarters: 'Oakland, California, USA',
    website: 'https://www.flypyka.com',
    reputationScore: 8.6,
    totalAircraftCount: 30,
    trainingCenters: [
      {
        id: 'pyka-california',
        name: 'Pyka Flight Operations Center',
        location: 'Oakland, USA',
        country: 'USA',
        offers: ['Pelican Spray', 'Pelican Cargo', 'Pelican Courier'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.flypyka.com/careers'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '30% annually',
      keyMarkets: ['North America', 'South America', 'Europe', 'Australia']
    },
    salaryExpectations: {
      entryLevel: '$65,000 - $90,000',
      midLevel: '$95,000 - $140,000',
      seniorLevel: '$140,000 - $190,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'UAV Pilot',
      midLevel: 'Autonomous Flight Engineer',
      seniorLevel: 'Chief Autonomous Flight Operations',
      timeline: '3-5 years to Autonomous Flight Engineer, 8-12 years to Chief Autonomous Flight Operations'
    }
  },
  {
    id: 'sabrewing',
    name: 'Sabrewing Aircraft Company',
    logo: '',
    description: 'Sabrewing Aircraft Company is an American aerospace manufacturer developing the Rhaegal series of heavy-lift cargo VTOL aircraft capable of autonomous flight and extreme-short takeoff and landing.',
    founded: 2015,
    headquarters: 'Oxnard, California, USA',
    website: 'https://www.sabrewingair.com',
    reputationScore: 8.3,
    totalAircraftCount: 20,
    trainingCenters: [
      {
        id: 'sabrewing-california',
        name: 'Sabrewing Flight Operations Center',
        location: 'Oxnard, USA',
        country: 'USA',
        offers: ['Rhaegal A', 'Rhaegal B', 'Rhaegal C'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.sabrewingair.com/careers'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '20% annually',
      keyMarkets: ['North America', 'Middle East', 'Pacific Islands']
    },
    salaryExpectations: {
      entryLevel: '$60,000 - $85,000',
      midLevel: '$90,000 - $130,000',
      seniorLevel: '$130,000 - $180,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'UAV Pilot',
      midLevel: 'Autonomous Cargo Operations Lead',
      seniorLevel: 'Chief VTOL Operations Officer',
      timeline: '3-5 years to Autonomous Cargo Operations Lead, 8-12 years to Chief VTOL Operations Officer'
    }
  },
  {
    id: 'fugro',
    name: 'Fugro Aviation',
    logo: '',
    description: 'Fugro Aviation is part of Fugro N.V., a Dutch geodata company providing airborne geophysical and LiDAR survey services with a fleet of specialized survey aircraft operating worldwide.',
    founded: 1962,
    headquarters: 'Leidschendam, Netherlands',
    website: 'https://www.fugro.com',
    reputationScore: 8.7,
    totalAircraftCount: 40,
    trainingCenters: [
      {
        id: 'fugro-netherlands',
        name: 'Fugro Aviation Training Netherlands',
        location: 'Leidschendam, Netherlands',
        country: 'Netherlands',
        offers: ['Airborne Geophysics', 'LiDAR Survey Operations', 'Aerial Mapping'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.fugro.com/careers'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '6% annually',
      keyMarkets: ['Europe', 'North America', 'Middle East', 'Asia Pacific', 'Africa']
    },
    salaryExpectations: {
      entryLevel: '$55,000 - $80,000',
      midLevel: '$85,000 - $120,000',
      seniorLevel: '$120,000 - $170,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Survey Pilot',
      midLevel: 'Senior Survey Pilot',
      seniorLevel: 'Chief Survey Pilot / Operations Manager',
      timeline: '3-5 years to Senior Survey Pilot, 8-12 years to Chief Survey Pilot'
    }
  },
  {
    id: 'supernal',
    name: 'Supernal',
    logo: '',
    description: 'Supernal is a Hyundai Motor Group subsidiary developing electric vertical takeoff and landing (eVTOL) aircraft for urban air mobility, with the S-A2 passenger air vehicle.',
    founded: 2021,
    headquarters: 'Irvine, California, USA',
    website: 'https://www.supernal.aero',
    reputationScore: 8.6,
    totalAircraftCount: 5,
    trainingCenters: [
      {
        id: 'supernal-california',
        name: 'Supernal Flight Operations Center',
        location: 'Irvine, USA',
        country: 'USA',
        offers: ['S-A2 eVTOL', 'Urban Air Mobility Systems', 'eVTOL Pilot Training'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.supernal.aero/careers'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '35% annually',
      keyMarkets: ['North America', 'Europe', 'Asia', 'Middle East']
    },
    salaryExpectations: {
      entryLevel: '$70,000 - $95,000',
      midLevel: '$100,000 - $150,000',
      seniorLevel: '$150,000 - $210,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'eVTOL Test Pilot',
      midLevel: 'UAM Operations Lead',
      seniorLevel: 'Chief UAM Operations Officer',
      timeline: '3-5 years to UAM Operations Lead, 8-12 years to Chief UAM Operations Officer'
    }
  },
  {
    id: 'regent-craft',
    name: 'Regent Craft',
    logo: '',
    description: 'Regent Craft is an American maritime aviation company developing the Viceroy series of all-electric, wing-in-ground-effect (WIG) seagliders for coastal transportation and logistics.',
    founded: 2020,
    headquarters: 'Bristol, Rhode Island, USA',
    website: 'https://www.regentcraft.com',
    reputationScore: 8.4,
    totalAircraftCount: 10,
    trainingCenters: [
      {
        id: 'regent-craft-rhode-island',
        name: 'Regent Craft Flight Operations Center',
        location: 'Bristol, USA',
        country: 'USA',
        offers: ['Viceroy Seaglider', 'Coastal Transportation Systems', 'WIG Operations Training'],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
        website: 'https://www.regentcraft.com/careers'
      }
    ],
    marketDemandStatistics: {
      demandLevel: 'high',
      growthRate: '30% annually',
      keyMarkets: ['North America', 'Europe', 'Asia Pacific', 'Middle East']
    },
    salaryExpectations: {
      entryLevel: '$65,000 - $90,000',
      midLevel: '$95,000 - $140,000',
      seniorLevel: '$140,000 - $190,000',
      currency: 'USD'
    },
    careerProgression: {
      entryLevel: 'Seaglider Test Pilot',
      midLevel: 'Maritime Aviation Operations Lead',
      seniorLevel: 'Chief Maritime Aviation Officer',
      timeline: '3-5 years to Maritime Aviation Operations Lead, 8-12 years to Chief Maritime Aviation Officer'
    }
  }
];

// Aircraft Type Ratings Data
export const aircraftTypeRatings: AircraftTypeRating[] = [
  // Airbus
  {
    id: 'a220-100',
    manufacturer_id: 'airbus',
    model: 'A220-100',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/airbus/airbus-a220-100.jpg',
    description: 'The A220-100 is the "specialist" of the family. While it shares 99% commonality with the larger -300, it is the version pilots choose for high-performance missions. It is specifically engineered for steep approaches and short runways that traditional jets can\'t touch. It occupies a niche (100-135 seats) that Boeing currently has no answer for, providing A220 pilots with unique market leverage.',
    why_choose_rating: 'The A220-100 offers pilots the quietest cockpit in the narrow-body world with full sidestick control and active feedback—no legacy cables or pulleys. It flies like a "sports car" compared to the heavier -300, offering superior climb rates and maneuverability. With 25% less CO2 emissions, it is the "greenest" rating a pilot can hold, protecting against future environmental flight caps and ensuring long-term fleet sustainability.',
    first_flight: 2013,
    careerScore: 92,
    demandLevel: 'high',
    conditionally_new: 'green',
    lifecycle_stage: 'early-career',
    order_backlog: { orders: 959, delivered: 501 },
    operator_count: 25,
    total_deliveries: 501,
    specifications: {
      max_takeoff_weight: '63,100 kg',
      cruising_speed: 'Mach 0.78 (Max Mach 0.82)',
      range: '6,390 km (3,450 nm)',
      capacity: '100-135',
      engines: 2,
      engine_type: '2 x Pratt & Whitney PW1500G Geared Turbofan (GTF)',
      length: '35.0 m',
      wingspan: '35.1 m',
      height: '11.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 40,
      flight_hours: 50
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Level D Full Flight Simulator (FFS) - Highest fidelity',
      locations: ['Montreal (CAE)', 'Miami (Airbus)', 'Atlanta (Delta)', 'Riga (airBaltic)', 'Zurich (Lufthansa)', 'Frankfurt (FTA)', 'Paris (Air France)', 'Singapore (AATC)', 'Seoul (Korean Air)'],
      features: ['6-DOF Motion: Full six-degree-of-freedom electric motion systems', 'Visual System: 200x40 degree FOV with high-definition satellite imagery', 'Onboard Instructor Station (IOS): Real-time weather, system failure injection, and flight data playback']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a220-300',
    manufacturer_id: 'airbus',
    model: 'A220-300',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/airbus/airbus-a220-300.jpg',
    description: 'The Airbus A220 is a modern, single-aisle aircraft family designed for the 100 to 160-seat market. Originally developed by Bombardier as the CSeries, it was rebranded as the A220 after Airbus acquired a majority stake in July 2018. Known for high efficiency, advanced Fly-By-Wire cockpit, and superior passenger comfort. The A220-300 is tailored for larger markets with typical seating of 120-150 passengers. As of March 2026, there are 501 aircraft delivered and 25 commercial operators worldwide. Delta Air Lines leads with 85 active A220s, followed by JetBlue (61), Air France (55), Breeze Airways (54), and airBaltic (54).',
    why_choose_rating: 'With advanced fly-by-wire systems, fuel efficiency, and growing airline adoption worldwide, the A220-300 type rating offers pilots excellent career opportunities. The aircraft\'s modern cockpit and commonality with Airbus systems provide a solid foundation for progression to larger Airbus aircraft like the A320neo and A350 families. Pilots rated on the A220-300 gain access to a rapidly expanding fleet with strong demand across Europe, Asia, and North America.',
    demandLevel: 'high',
    conditionally_new: 'green',
    lifecycle_stage: 'early-career',
    order_backlog: { orders: 900, delivered: 501 },
    operator_count: 25,
    total_deliveries: 501,
    steep_approach_certified: true,
    engine_type: 'Pratt & Whitney PW1500G GTF',
    range_versatility: 'versatile',
    cabin_features: ['Lower cabin altitude', 'Larger windows', '2-3 seating', 'XL overhead bins'],
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
    pilot_count: 5000,
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '70,900 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,300 km',
      capacity: 160,
      engines: 2,
      engine_type: 'Pratt & Whitney PW1500G',
      length: '38.7 m',
      wingspan: '35.1 m',
      height: '11.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a320',
    manufacturer_id: 'airbus',
    model: 'A320',
    category: 'flagship',
    subcategory: 'versatile-champion',
    image: '/images/manufacturers/airbus/airbus-a320.jpg',
    sketchfab_id: 'ae3d357729a44f278f9ef9326977504a',
    description: 'The Airbus A320 is the world\'s best-selling airliner family and the pioneer of digital Fly-By-Wire technology in commercial aviation. It replaced traditional cables and pulleys with electronic signals and a sidestick controller, setting the standard for every subsequent Airbus model. Today, the A320neo variant offers 20% lower fuel burn, making it the primary choice for airlines worldwide.',
    why_choose_rating: 'An A320 rating is the most portable credential in aviation. With one landing or takeoff occurring every two seconds globally, job security is unrivaled. Pilots rated on the A320 can transition to the widebody A330 or A350 in as little as 8-10 days due to cockpit commonality through Cross-Crew Qualification (CCQ).',
    first_flight: 1987,
    careerScore: 98,
    demandLevel: 'high',
    conditionally_new: 'green',
    lifecycle_stage: 'mid-career',
    order_backlog: { orders: 6000, delivered: 12000 },
    operator_count: 375,
    total_deliveries: 12000,
    specifications: {
      max_takeoff_weight: '78,000 kg (CEO) / 79,000 kg (NEO)',
      cruising_speed: 'Mach 0.78 (Max Mach 0.82)',
      range: '6,200 km (CEO) / 6,400 km (NEO)',
      capacity: '150-180',
      engines: 2,
      engine_type: 'CEO: CFM56 or IAE V2500 / NEO: Pratt & Whitney PW1100G or CFM LEAP-1A',
      length: '37.57 m',
      wingspan: '35.8 m (with Sharklets)',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 40,
      flight_hours: 50
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Level D Full Flight Simulator (FFS) - The gold standard for "Zero Flight Time Training" (ZFTT)',
      locations: ['Toulouse (Airbus)', 'Miami (Airbus/CAE)', 'Singapore (AATC)', 'Beijing (Airbus)', 'Hamburg', 'Dubai (Emirates/CAE)', 'Phoenix', 'Madrid (Airbus)', 'Delhi/Gurugram (Air India/IndiGo)'],
      features: ['6-DOF Motion: Electric motion actuators for precise flight feel', 'Visual System: High-definition 200° collimated visual displays', 'Instructor Station: Tablet-controlled scenario injection (Windshear, Bird Strikes, Systems Failures)']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330',
    manufacturer_id: 'airbus',
    model: 'A330',
    category: 'flagship',
    subcategory: 'widebody',
    image: '/images/manufacturers/airbus/airbus-a330.jpg',
    description: 'The A330 is one of the most successful wide-body aircraft in history. It was designed alongside the four-engine A340, sharing a near-identical flight deck. Today, the family has evolved into the A330neo (-800 and -900 variants), which uses Rolls-Royce Trent 7000 engines and A350-style wings to fly further and more efficiently. For pilots, the A330 offers a seamless step up from the A320 with minimal "Difference Training."',
    why_choose_rating: 'The A330 rating is a "passport" to global wide-body carriers. It is the backbone of major carriers like Delta, Cathay Pacific, Qatar Airways, and Turkish Airlines. For A320-rated pilots, the transition is famously smooth via Cross-Crew Qualification (CCQ) - only 8-10 working days of training instead of a full month-long type rating.',
    first_flight: 1992,
    careerScore: 94,
    demandLevel: 'high',
    conditionally_new: 'green',
    lifecycle_stage: 'mid-career',
    order_backlog: { orders: 300, delivered: 1500 },
    operator_count: 120,
    total_deliveries: 1500,
    specifications: {
      max_takeoff_weight: '242,000 kg (A330-300/900)',
      cruising_speed: 'Mach 0.82 (Max Mach 0.86)',
      range: '11,750 km (ceo) / 13,334 km (neo)',
      capacity: '250-300',
      engines: 2,
      engine_type: 'A330ceo: GE CF6-80E1, Pratt & Whitney PW4000, or RR Trent 700 / A330neo: Rolls-Royce Trent 7000',
      length: '58.8 m (-200) / 63.6 m (-300/900)',
      wingspan: '64 m (neo)',
      height: '17.4 m'
    },
    training_requirements: {
      minimum_hours: 3000,
      required_licenses: ['ATPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 40,
      flight_hours: 50
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Level D Full Flight Simulator (FFS)',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai', 'Hong Kong', 'Bangalore'],
      features: ['A330/A340 Commonality training', 'Upset Prevention Recovery Training (UPRT)', '6-DOF Motion', 'High-Definition Visual Systems']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a318',
    manufacturer_id: 'airbus',
    model: 'A318',
    category: 'flagship',
    subcategory: 'legacy-fading',
    image: '/images/manufacturers/airbus/airbus-a318.jpg',
    description: 'The Airbus A318 is the smallest member of the A320 family, known as the "Baby Bus". It was designed for short-haul routes with limited passenger demand.',
    first_flight: 2002,
    specifications: {
      max_takeoff_weight: '68,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '5,950 km',
      capacity: 132,
      engines: 2,
      engine_type: 'CFM56-5B',
      length: '31.44 m',
      wingspan: '34.1 m',
      height: '12.56 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a319',
    manufacturer_id: 'airbus',
    model: 'A319',
    category: 'flagship',
    subcategory: 'legacy-fading',
    image: '/images/manufacturers/airbus/airbus-a319.jpg',
    description: 'The Airbus A319 is a shortened version of the A320, designed for routes with lower passenger demand while maintaining the A320 family\'s commonality.',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '75,500 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,700 km',
      capacity: 156,
      engines: 2,
      engine_type: 'CFM56 or V2500',
      length: '33.84 m',
      wingspan: '34.1 m',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321',
    manufacturer_id: 'airbus',
    model: 'A321',
    category: 'flagship',
    subcategory: 'legacy-fading',
    image: '/images/manufacturers/airbus/airbus-a321.jpg',
    description: 'The Airbus A321 is the stretched, highest-capacity version of the A320 family, designed for medium-haul routes with higher passenger demand.',
    first_flight: 1993,
    specifications: {
      max_takeoff_weight: '93,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '5,950 km',
      capacity: 220,
      engines: 2,
      engine_type: 'CFM56 or V2500',
      length: '44.51 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Beijing'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a319neo',
    manufacturer_id: 'airbus',
    model: 'A319neo',
    category: 'commercial',
    subcategory: 'narrow-body',
    image: '/images/manufacturers/airbus/airbus-a319neo.jpg',
    description: 'The Airbus A319neo is the upgraded A319 featuring larger, more efficient engines and aerodynamic "Sharklets" for improved fuel efficiency.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '79,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '7,200 km',
      capacity: 160,
      engines: 2,
      engine_type: 'CFM LEAP-1A or PW1100G',
      length: '33.84 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a320neo',
    manufacturer_id: 'airbus',
    model: 'A320neo',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/airbus/airbus-a320neo.jpg',
    description: 'The Airbus A320neo is the backbone of global low-cost carriers like IndiGo and Air India. It is the most frequent choice for fresh pilots due to high hiring volume.',
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '79,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,850 km',
      capacity: 180,
      engines: 2,
      engine_type: 'CFM LEAP-1A or PW1100G',
      length: '37.57 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Beijing'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321neo',
    manufacturer_id: 'airbus',
    model: 'A321neo',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/airbus/airbus-a321neo.jpg',
    description: 'The Airbus A321neo is the current "king" of narrow-body jets. With the introduction of the A321XLR, pilots can now fly 11-hour transatlantic routes previously reserved for widebodies, making this rating highly lucrative.',
    first_flight: 2016,
    specifications: {
      max_takeoff_weight: '97,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '6,150 km',
      capacity: 240,
      engines: 2,
      engine_type: 'CFM LEAP-1A or Pratt & Whitney PW1100G',
      length: '44.51 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Beijing'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321lr',
    manufacturer_id: 'airbus',
    model: 'A321LR',
    category: 'commercial',
    subcategory: 'narrow-body',
    image: '/images/manufacturers/airbus/airbus-a321lr.jpg',
    description: 'The Airbus A321LR (Long Range) is a modified A321neo with extra fuel tanks, enabling transatlantic flights and long-haul routes.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '97,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '7,400 km',
      capacity: 206,
      engines: 2,
      engine_type: 'CFM LEAP-1A or PW1100G',
      length: '44.51 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321xlr',
    manufacturer_id: 'airbus',
    model: 'A321XLR',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/airbus/airbus-a321xlr.jpg',
    description: 'The Airbus A321XLR is a game-changer in 2026 that allows single-aisle pilots to earn "long-haul" pay scales with 11-hour transatlantic capability.',
    first_flight: 2022,
    specifications: {
      max_takeoff_weight: '101,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '8,700 km',
      capacity: 244,
      engines: 2,
      engine_type: 'CFM LEAP-1A or PW1100G',
      length: '44.51 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330',
    manufacturer_id: 'airbus',
    model: 'A330',
    category: 'commercial',
    subcategory: 'wide-body',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    sketchfab_id: '50c4ed883e00436e80a3f1c8048f549f',
    description: 'The Airbus A330 is a wide-body, twin-engine jet airliner. It was designed to replace the earlier A300.',
    first_flight: 1992,
    specifications: {
      max_takeoff_weight: '242,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '13,430 km',
      capacity: 335,
      engines: 2,
      engine_type: 'CF6-80E1 or Trent 700',
      length: '63.66 m',
      wingspan: '60.3 m',
      height: '16.79 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-200',
    manufacturer_id: 'airbus',
    model: 'A330-200',
    category: 'commercial',
    subcategory: 'wide-body',
    image: '/images/manufacturers/airbus/airbus-a330-200.jpg',
    description: 'The Airbus A330-200 is the shorter fuselage, longer-range variant of the A330 family, designed for medium-to-long-haul routes.',
    first_flight: 1997,
    specifications: {
      max_takeoff_weight: '233,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '13,450 km',
      capacity: 253,
      engines: 2,
      engine_type: 'CF6-80E1 or Trent 772',
      length: '58.82 m',
      wingspan: '60.3 m',
      height: '17.39 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-300',
    manufacturer_id: 'airbus',
    model: 'A330-300',
    category: 'flagship',
    subcategory: 'legacy-fading',
    image: '/images/manufacturers/airbus/airbus-a330-300.jpg',
    description: 'The Airbus A330-300ceo is an older generation that remains heavily in service with a large pool of rated pilots, often serving as a bridge to the A350.',
    first_flight: 1992,
    specifications: {
      max_takeoff_weight: '242,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '11,750 km',
      capacity: 335,
      engines: 2,
      engine_type: 'CF6-80E1 or Trent 772',
      length: '63.66 m',
      wingspan: '60.3 m',
      height: '16.79 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-800',
    manufacturer_id: 'airbus',
    model: 'A330-800',
    category: 'commercial',
    subcategory: 'wide-body',
    image: '/images/manufacturers/airbus/airbus-a330-800neo.jpg',
    description: 'The Airbus A330-800 is the upgraded A330-200 featuring Rolls-Royce Trent 7000 engines and aerodynamic improvements for better fuel efficiency.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '251,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '15,090 km',
      capacity: 257,
      engines: 2,
      engine_type: 'Rolls-Royce Trent 7000',
      length: '58.82 m',
      wingspan: '64.0 m',
      height: '17.39 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-900',
    manufacturer_id: 'airbus',
    model: 'A330-900',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/airbus/airbus-a330-900neo.jpg',
    description: 'The Airbus A330-900neo is a fuel-efficient widebody favorite for airlines like Delta Air Lines and TAP Air Portugal.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '251,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '13,330 km',
      capacity: 336,
      engines: 2,
      engine_type: 'Rolls-Royce Trent 7000',
      length: '63.66 m',
      wingspan: '64.31 m',
      height: '16.79 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350',
    manufacturer_id: 'airbus',
    model: 'A350',
    category: 'commercial',
    subcategory: 'wide-body',
    image: '/images/manufacturers/airbus/airbus-a350.jpg',
    sketchfab_id: '0703224a1a7e497eaa2a860e1d3b1774',
    description: 'The Airbus A350 is a long-range, wide-body, twin-engine jet airliner. It is the first Airbus aircraft with both fuselage and wing structures made primarily of carbon-fiber-reinforced polymer.',
    first_flight: 2013,
    specifications: {
      max_takeoff_weight: '280,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '15,000 km',
      capacity: 369,
      engines: 2,
      engine_type: 'Trent XWB',
      length: '67.09 m',
      wingspan: '64.31 m',
      height: '17.08 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350-900',
    manufacturer_id: 'airbus',
    model: 'A350-900',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/airbus/airbus-a350-900.jpg',
    description: 'The Airbus A350-900 is a highly sought-after long-haul rating. It shares a Common Type Rating with the A330, allowing pilots to fly both with only eight days of additional training.',
    first_flight: 2013,
    specifications: {
      max_takeoff_weight: '280,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '15,000 km',
      capacity: 325,
      engines: 2,
      engine_type: 'Trent XWB-84',
      length: '66.80 m',
      wingspan: '64.31 m',
      height: '17.05 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350f',
    manufacturer_id: 'airbus',
    model: 'A350F',
    category: 'cargo',
    subcategory: 'production-freighter',
    image: '/images/manufacturers/airbus/airbus-a350f.jpg',
    description: 'The Airbus A350F is the newest flagship freighter entering service in 2026. It is a clean-sheet freighter designed to replace the Boeing 777F, featuring a massive main deck cargo door and carbon-fiber technology for maximum efficiency.',
    first_flight: 2024,
    specifications: {
      max_takeoff_weight: '351,000 kg',
      cruising_speed: 'Mach 0.84',
      range: '9,700 km',
      capacity: 111000,
      engines: 2,
      engine_type: 'Trent XWB-97',
      length: '70.80 m',
      wingspan: '64.31 m',
      height: '17.75 m'
    },
    training_requirements: {
      minimum_hours: 3000,
      required_licenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 35,
      flight_hours: 20
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321p2f',
    manufacturer_id: 'airbus',
    model: 'A321P2F',
    category: 'cargo',
    subcategory: 'p2f-freighter',
    image: '/images/manufacturers/airbus/airbus-a321p2f.jpg',
    description: 'The Airbus A321P2F is the modernized "iPhone of cargo" - a narrow-body passenger-to-freighter conversion rapidly replacing older Boeing 737 freighters for short-range express delivery with operators like DHL and Qantas.',
    first_flight: 2020,
    specifications: {
      max_takeoff_weight: '93,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,700 km',
      capacity: 28000,
      engines: 2,
      engine_type: 'CFM56-5B or V2533-A5',
      length: '44.51 m',
      wingspan: '35.80 m',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a320p2f',
    manufacturer_id: 'airbus',
    model: 'A320P2F',
    category: 'cargo',
    subcategory: 'p2f-freighter',
    image: '/images/manufacturers/airbus/airbus-a320p2f.jpg',
    description: 'The Airbus A320P2F is the smaller sibling of the A321P2F, a narrow-body passenger-to-freighter conversion used for lower-volume regional cargo routes.',
    first_flight: 2019,
    specifications: {
      max_takeoff_weight: '78,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,700 km',
      capacity: 21000,
      engines: 2,
      engine_type: 'CFM56-5B or V2527-A5',
      length: '37.57 m',
      wingspan: '35.80 m',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-300p2f',
    manufacturer_id: 'airbus',
    model: 'A330-300P2F',
    category: 'cargo',
    subcategory: 'p2f-freighter',
    image: '/images/manufacturers/airbus/airbus-a330-300p2f.jpg',
    description: 'The Airbus A330-300P2F is the most popular medium-to-long-range freighter conversion today, offering high volume and excellent efficiency for e-commerce with operators like FedEx, UPS, and DHL.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '242,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '7,400 km',
      capacity: 70000,
      engines: 2,
      engine_type: 'Trent 772B or CF6-80E1',
      length: '63.66 m',
      wingspan: '60.30 m',
      height: '16.79 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 25,
      flight_hours: 15
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['800 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-200f',
    manufacturer_id: 'airbus',
    model: 'A330-200F',
    category: 'cargo',
    subcategory: 'production-freighter',
    image: '/images/manufacturers/airbus/airbus-a330-200f.jpg',
    description: 'The Airbus A330-200F is one of the few wide-body aircraft originally built by Airbus as a freighter from day one, featuring a distinctive "nose bubble" to keep the cargo floor level on the ground.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '233,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '7,400 km',
      capacity: 70000,
      engines: 2,
      engine_type: 'Trent 772B or CF6-80E1',
      length: '58.82 m',
      wingspan: '60.30 m',
      height: '16.79 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 25,
      flight_hours: 15
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['800 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-200p2f',
    manufacturer_id: 'airbus',
    model: 'A330-200P2F',
    category: 'cargo',
    subcategory: 'p2f-freighter',
    image: '/images/manufacturers/airbus/airbus-a330-200p2f.jpg',
    description: 'The Airbus A330-200P2F is a converted version of the A330-200, offering longer range than the -300P2F but slightly less volume for medium-to-long-range cargo operations.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '233,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '8,000 km',
      capacity: 65000,
      engines: 2,
      engine_type: 'Trent 772B or CF6-80E1',
      length: '58.82 m',
      wingspan: '60.30 m',
      height: '16.79 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 25,
      flight_hours: 15
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['800 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300-600f',
    manufacturer_id: 'airbus',
    model: 'A300-600F',
    category: 'cargo',
    subcategory: 'production-freighter',
    image: '/images/manufacturers/airbus/airbus-a300-600f.jpg',
    description: 'The Airbus A300-600F is the "Grandfather" of the fleet, a reliable but aging heavy lifter. UPS and FedEx still operate large numbers, but many carriers completed final retirements in 2025/early 2026. Most will be phased out by the end of the decade.',
    first_flight: 1983,
    specifications: {
      max_takeoff_weight: '170,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '5,500 km',
      capacity: 50000,
      engines: 2,
      engine_type: 'CF6-80C2 or PW4158',
      length: '54.10 m',
      wingspan: '44.84 m',
      height: '16.54 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310-300f',
    manufacturer_id: 'airbus',
    model: 'A310-300F',
    category: 'cargo',
    subcategory: 'production-freighter',
    image: '/images/manufacturers/airbus/airbus-a310-300f.jpg',
    description: 'The Airbus A310-300F is a legacy freighter about to retire. Very few remain in commercial service, mostly used by niche regional cargo airlines or as military transports.',
    first_flight: 1985,
    specifications: {
      max_takeoff_weight: '164,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '5,200 km',
      capacity: 40000,
      engines: 2,
      engine_type: 'CF6-80C2 or PW4156',
      length: '46.66 m',
      wingspan: '43.90 m',
      height: '15.80 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'belugaxl',
    manufacturer_id: 'airbus',
    model: 'BelugaXL (A330-743L)',
    category: 'cargo',
    subcategory: 'outsize-transport',
    image: '/images/manufacturers/airbus/airbus-belugaxl__a330-743l_.jpg',
    description: 'The Airbus BelugaXL (A330-743L) is the newest "Mega-Lifter" for Airbus internal logistics. Six are currently in service, handling the massive parts like wings and fuselages for the A350 and A320 programs between Airbus factories.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '227,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '4,000 km',
      capacity: 53000,
      engines: 2,
      engine_type: 'Trent 772B',
      length: '63.10 m',
      wingspan: '60.30 m',
      height: '18.90 m'
    },
    training_requirements: {
      minimum_hours: 3000,
      required_licenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 30,
      flight_hours: 18
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Outsize Cargo Loading Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Airbus Logistics rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'belugast',
    manufacturer_id: 'airbus',
    model: 'BelugaST (A300-600ST)',
    category: 'cargo',
    subcategory: 'outsize-transport',
    image: '/images/manufacturers/airbus/airbus-belugast__a300-600st_.jpg',
    description: 'The Airbus BelugaST (A300-600ST) is the original "Mega-Lifter" that is now legacy/retired. Airbus officially began retiring this fleet in 2025. As of January 2026, Beluga #5 performed its final flight. Only 1 or 2 remain operational for "Airbus Beluga Transport" missions in their final months of service.',
    first_flight: 1994,
    specifications: {
      max_takeoff_weight: '155,000 kg',
      cruising_speed: 'Mach 0.70',
      range: '2,800 km',
      capacity: 47000,
      engines: 2,
      engine_type: 'CF6-80C2',
      length: '56.15 m',
      wingspan: '44.84 m',
      height: '17.24 m'
    },
    training_requirements: {
      minimum_hours: 3000,
      required_licenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 30,
      flight_hours: 18
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Outsize Cargo Loading Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Airbus Logistics rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300-cargo',
    manufacturer_id: 'airbus',
    model: 'A300 B2/B4 Cargo',
    category: 'cargo',
    subcategory: 'historical-cargo',
    image: '/images/manufacturers/airbus/airbus-a300_b2_b4_cargo.jpg',
    description: 'The Airbus A300 B2/B4 Cargo are the original 1970s conversions. None are in active commercial service today. They exist only in memories or museums as historical aircraft.',
    first_flight: 1972,
    specifications: {
      max_takeoff_weight: '142,000 kg',
      cruising_speed: 'Mach 0.75',
      range: '4,000 km',
      capacity: 35000,
      engines: 2,
      engine_type: 'CF6-50C or JT9D-7R4',
      length: '53.75 m',
      wingspan: '44.84 m',
      height: '16.54 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Cargo Loading Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'super-guppy',
    manufacturer_id: 'airbus',
    model: 'Super Guppy',
    category: 'cargo',
    subcategory: 'historical-cargo',
    image: '/images/manufacturers/airbus/airbus-super_guppy.jpg',
    description: 'The Super Guppy was the NASA/Airbus predecessor to the Beluga. Airbus retired its last one in the 1990s (though NASA still flies one). It was a specialized outsize transport aircraft with a uniquely enlarged fuselage for carrying large aerospace components.',
    first_flight: 1965,
    specifications: {
      max_takeoff_weight: '77,111 kg',
      cruising_speed: 'Mach 0.50',
      range: '2,000 km',
      capacity: 24000,
      engines: 4,
      engine_type: 'Turboprop',
      length: '43.84 m',
      wingspan: '47.62 m',
      height: '14.78 m'
    },
    training_requirements: {
      minimum_hours: 3000,
      required_licenses: ['CPL', 'IR', 'ME', 'Cargo Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 30,
      flight_hours: 18
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Outsize Cargo Loading Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Historical Cargo rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350-900ulr',
    manufacturer_id: 'airbus',
    model: 'A350-900ULR',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/airbus/airbus-a350-900ulr.jpg',
    description: 'The Airbus A350-900ULR (Ultra Long Range) is a variant capable of flying the world\'s longest routes, currently used by Singapore Airlines for non-stop flights between Singapore and New York. It is the flagship of long-range aviation.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '280,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '18,000 km',
      capacity: 161,
      engines: 2,
      engine_type: 'Trent XWB-97',
      length: '66.80 m',
      wingspan: '64.31 m',
      height: '17.05 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350-1000',
    manufacturer_id: 'airbus',
    model: 'A350-1000',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/airbus/airbus-a350-1000.jpg',
    description: 'The Airbus A350-1000 is the stretched, highest-capacity model of the A350 family, featuring advanced carbon-composite construction. It is the flagship of Airbus\'s current wide-body lineup.',
    first_flight: 2016,
    specifications: {
      max_takeoff_weight: '319,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '16,100 km',
      capacity: 440,
      engines: 2,
      engine_type: 'Trent XWB-97',
      length: '73.79 m',
      wingspan: '64.31 m',
      height: '17.08 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a380',
    manufacturer_id: 'airbus',
    model: 'A380',
    category: 'flagship',
    subcategory: 'resurgent',
    image: '/images/manufacturers/airbus/airbus-a380.jpg',
    sketchfab_id: 'b4fbb839e6b4bb989422426bfc8fd1c',
    description: 'The Airbus A380 is the iconic double-decker quad-engine jet, the largest commercial passenger aircraft ever built. While production ended in 2021, it remains the flagship of Airbus engineering excellence.',
    first_flight: 2005,
    specifications: {
      max_takeoff_weight: '575,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '15,700 km',
      capacity: 555,
      engines: 4,
      engine_type: 'GP7200 or Trent 900',
      length: '72.72 m',
      wingspan: '79.75 m',
      height: '24.09 m'
    },
    training_requirements: {
      minimum_hours: 3000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 200,
      simulator_hours: 32,
      flight_hours: 16
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a340-200',
    manufacturer_id: 'airbus',
    model: 'A340-200',
    category: 'flagship',
    subcategory: 'historical-flagship',
    image: '/images/manufacturers/airbus/airbus-a340-200.jpg',
    description: 'The Airbus A340-200 is the initial version of the A340 family, a four-engine long-haul airliner developed to bypass early twin-engine flight restrictions. End of Life. No commercial airline flies this version anymore. Only 28 were ever built, and the last few were used as government "Air Force One" style planes for countries like Egypt or Qatar, but even those have largely been replaced by modern A350s.',
    first_flight: 1991,
    specifications: {
      max_takeoff_weight: '275,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '14,800 km',
      capacity: 239,
      engines: 4,
      engine_type: 'CFM56-5C4',
      length: '59.39 m',
      wingspan: '60.3 m',
      height: '16.84 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a340-300',
    manufacturer_id: 'airbus',
    model: 'A340-300',
    category: 'legacy',
    subcategory: 'wide-body',
    image: '/images/manufacturers/airbus/airbus-a340-300.jpg',
    description: 'The Airbus A340-300 is the most popular variant of the A340 family, featuring a longer fuselage and higher capacity. Production ended in 2011.',
    first_flight: 1991,
    specifications: {
      max_takeoff_weight: '275,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '13,700 km',
      capacity: 295,
      engines: 4,
      engine_type: 'CFM56-5C4',
      length: '63.60 m',
      wingspan: '60.3 m',
      height: '16.84 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a340-500',
    manufacturer_id: 'airbus',
    model: 'A340-500',
    category: 'flagship',
    subcategory: 'historical-flagship',
    image: '/images/manufacturers/airbus/airbus-a340-500.jpg',
    description: 'The Airbus A340-500 is the ultra-long-range version of the A340 family with a stretched fuselage. Almost Extinct. This was a "niche" ultra-long-range plane. Almost every airline has retired them because they have four engines and burn too much fuel. Only a tiny handful exist as private VIP jets.',
    first_flight: 2002,
    specifications: {
      max_takeoff_weight: '368,000 kg',
      cruising_speed: 'Mach 0.83',
      range: '16,700 km',
      capacity: 313,
      engines: 4,
      engine_type: 'Trent 553',
      length: '67.90 m',
      wingspan: '63.45 m',
      height: '17.10 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300-passenger',
    manufacturer_id: 'airbus',
    model: 'A300',
    category: 'flagship',
    subcategory: 'historical-flagship',
    image: '/images/manufacturers/airbus/airbus-a300.jpg',
    description: 'The Airbus A300 was the first twin-engine wide-body aircraft, a pioneer in modern aviation. Once the flagship wide-body of the 80s and 90s, it now only flies in cargo or specialized military roles.',
    first_flight: 1972,
    specifications: {
      max_takeoff_weight: '142,000 kg',
      cruising_speed: 'Mach 0.75',
      range: '4,000 km',
      capacity: 250,
      engines: 2,
      engine_type: 'CF6-50C or JT9D-7R4',
      length: '53.75 m',
      wingspan: '44.84 m',
      height: '16.54 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310-passenger',
    manufacturer_id: 'airbus',
    model: 'A310',
    category: 'flagship',
    subcategory: 'historical-flagship',
    image: '/images/manufacturers/airbus/airbus-a310.jpg',
    description: 'The Airbus A310 was a smaller version of the A300, designed for medium-haul routes. Once the flagship wide-body of the 80s and 90s, it now only flies in cargo or specialized military roles.',
    first_flight: 1982,
    specifications: {
      max_takeoff_weight: '164,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '5,200 km',
      capacity: 220,
      engines: 2,
      engine_type: 'CF6-80C2 or PW4156',
      length: '46.66 m',
      wingspan: '43.90 m',
      height: '15.80 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'concorde',
    manufacturer_id: 'airbus',
    model: 'Concorde',
    category: 'flagship',
    subcategory: 'historical-flagship',
    image: '/images/manufacturers/airbus/airbus-concorde.jpg',
    description: 'Concorde was the world\'s first supersonic passenger airliner, a joint venture between Aérospatiale and BAC. While technically not exclusively Airbus, it remains the most iconic retired flagship in the Airbus heritage. It operated from 1976 to 2003, flying at Mach 2.04.',
    first_flight: 1969,
    specifications: {
      max_takeoff_weight: '185,000 kg',
      cruising_speed: 'Mach 2.04',
      range: '7,250 km',
      capacity: 100,
      engines: 4,
      engine_type: 'Rolls-Royce/Snecma Olympus 593',
      length: '61.66 m',
      wingspan: '25.60 m',
      height: '12.19 m'
    },
    training_requirements: {
      minimum_hours: 5000,
      required_licenses: ['CPL', 'IR', 'ME', 'Supersonic Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 200,
      simulator_hours: 40,
      flight_hours: 20
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Supersonic Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Supersonic Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a340-600',
    manufacturer_id: 'airbus',
    model: 'A340-600',
    category: 'legacy',
    subcategory: 'wide-body',
    image: '/images/manufacturers/airbus/airbus-a340-600.jpg',
    description: 'The Airbus A340-600 is the stretched, high-capacity version of the A340 family, the longest Airbus aircraft until the A350-1000. Production ended in 2011.',
    first_flight: 2001,
    specifications: {
      max_takeoff_weight: '368,000 kg',
      cruising_speed: 'Mach 0.83',
      range: '14,600 km',
      capacity: 380,
      engines: 4,
      engine_type: 'Trent 556',
      length: '75.30 m',
      wingspan: '63.45 m',
      height: '17.22 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300b1',
    manufacturer_id: 'airbus',
    model: 'A300B1',
    category: 'legacy',
    subcategory: 'retired',
    image: '/images/manufacturers/airbus/airbus-a300b1.jpg',
    description: 'The Airbus A300B1 was the first variant of the A300, the world\'s first twin-engine wide-body airliner. Retired. Only two were ever built. Both are long gone.',
    first_flight: 1972,
    specifications: {
      max_takeoff_weight: '132,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '3,500 km',
      capacity: 250,
      engines: 2,
      engine_type: 'CF6-50C',
      length: '53.75 m',
      wingspan: '44.84 m',
      height: '16.24 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300b2',
    manufacturer_id: 'airbus',
    model: 'A300B2',
    category: 'legacy',
    subcategory: 'retired',
    image: '/images/manufacturers/airbus/airbus-a300b2.jpg',
    description: 'The Airbus A300B2 was the production version of the A300 with increased range and capacity compared to the B1. Retired. These were the early 1970s models. They lack the modern tech required to fly in today\'s crowded airspace.',
    first_flight: 1974,
    specifications: {
      max_takeoff_weight: '142,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '4,200 km',
      capacity: 270,
      engines: 2,
      engine_type: 'CF6-50C or JT9D-59A',
      length: '53.75 m',
      wingspan: '44.84 m',
      height: '16.24 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300b4',
    manufacturer_id: 'airbus',
    model: 'A300B4',
    category: 'legacy',
    subcategory: 'retired',
    image: '/images/manufacturers/airbus/airbus-a300b4.jpg',
    description: 'The Airbus A300B4 was an extended range version of the A300 with center fuel tank for longer flights. Retired. These were the early 1970s models. They lack the modern tech required to fly in today\'s crowded airspace.',
    first_flight: 1976,
    specifications: {
      max_takeoff_weight: '157,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '5,500 km',
      capacity: 280,
      engines: 2,
      engine_type: 'CF6-50C or JT9D-59A',
      length: '53.75 m',
      wingspan: '44.84 m',
      height: '16.24 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300-600',
    manufacturer_id: 'airbus',
    model: 'A300-600',
    category: 'legacy',
    subcategory: 'wide-body',
    image: '/images/manufacturers/airbus/airbus-a300-600.jpg',
    description: 'The Airbus A300-600 was the modernized, definitive version of the A300 family with glass cockpit and improved aerodynamics.',
    first_flight: 1983,
    specifications: {
      max_takeoff_weight: '171,700 kg',
      cruising_speed: 'Mach 0.82',
      range: '7,500 km',
      capacity: 297,
      engines: 2,
      engine_type: 'CF6-80C2 or PW4158',
      length: '54.10 m',
      wingspan: '44.84 m',
      height: '16.54 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310-200',
    manufacturer_id: 'airbus',
    model: 'A310-200',
    category: 'legacy',
    subcategory: 'retired',
    image: '/images/manufacturers/airbus/airbus-a310-200.jpg',
    description: 'The Airbus A310-200 is a shorter, longer-range derivative of the A300 family. It was the first Airbus aircraft with a two-crew glass cockpit. Retired. Most were scrapped or converted years ago.',
    first_flight: 1982,
    specifications: {
      max_takeoff_weight: '144,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '6,800 km',
      capacity: 220,
      engines: 2,
      engine_type: 'CF6-80A3 or JT9D-7R4',
      length: '46.66 m',
      wingspan: '43.90 m',
      height: '15.80 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310-300',
    manufacturer_id: 'airbus',
    model: 'A310-300',
    category: 'legacy',
    subcategory: 'reaching-end-of-service',
    image: '/images/manufacturers/airbus/airbus-a310-300.jpg',
    description: 'The Airbus A310-300 is the extended range version of the A310 family with center fuel tank and increased MTOW. Final Phase. You won\'t find these at major airports like London or New York. They are mostly flying in Iran (Mahan Air) or as specialized military tankers (A310 MRTT) that are currently being replaced by the newer A330 MRTT.',
    first_flight: 1985,
    specifications: {
      max_takeoff_weight: '164,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '9,600 km',
      capacity: 250,
      engines: 2,
      engine_type: 'CF6-80C2 or PW4152',
      length: '46.66 m',
      wingspan: '43.90 m',
      height: '15.80 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310f',
    manufacturer_id: 'airbus',
    model: 'A310F',
    category: 'cargo',
    subcategory: 'freighter',
    image: '/images/manufacturers/airbus/airbus-a310f.jpg',
    description: 'The Airbus A310F is a freighter variant of the A310, featuring a large cargo door and reinforced floor for cargo operations.',
    first_flight: 1988,
    specifications: {
      max_takeoff_weight: '164,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '7,500 km',
      capacity: 0,
      engines: 2,
      engine_type: 'CF6-80C2 or PW4152',
      length: '46.66 m',
      wingspan: '43.90 m',
      height: '15.80 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330p2f',
    manufacturer_id: 'airbus',
    model: 'A330P2F',
    category: 'cargo',
    subcategory: 'p2f-conversion',
    image: '/images/manufacturers/airbus/airbus-a330p2f.jpg',
    description: 'The Airbus A330P2F is a passenger-to-freighter conversion of the A330, featuring a large cargo door and reinforced floor for cargo operations.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '233,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '7,400 km',
      capacity: 0,
      engines: 2,
      engine_type: 'CF6-80E1 or Trent 772',
      length: '58.82 m',
      wingspan: '60.3 m',
      height: '17.39 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj-twentytwenty',
    manufacturer_id: 'airbus',
    model: 'ACJ TwoTwenty',
    category: 'private',
    subcategory: 'corporate-jet',
    image: '/images/manufacturers/airbus/airbus-acj_twotwenty.jpg',
    description: 'The Airbus ACJ TwoTwenty is the corporate jet version of the A220, offering long-range capability in a compact size.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '67,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '11,100 km',
      capacity: 25,
      engines: 2,
      engine_type: 'Pratt & Whitney PW1500G',
      length: '38.9 m',
      wingspan: '35.1 m',
      height: '11.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj318',
    manufacturer_id: 'airbus',
    model: 'ACJ318',
    category: 'private',
    subcategory: 'corporate-jet',
    image: '/images/manufacturers/airbus/airbus-acj318.jpg',
    description: 'The Airbus ACJ318 is the corporate jet version of the A318, offering long-range capability in a compact size.',
    first_flight: 2005,
    specifications: {
      max_takeoff_weight: '68,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '8,300 km',
      capacity: 18,
      engines: 2,
      engine_type: 'CFM56-5B',
      length: '31.44 m',
      wingspan: '34.1 m',
      height: '12.56 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj319',
    manufacturer_id: 'airbus',
    model: 'ACJ319',
    category: 'private',
    subcategory: 'corporate-jet',
    image: '/images/manufacturers/airbus/airbus-acj319.jpg',
    description: 'The Airbus ACJ319 is the corporate jet version of the A319, offering long-range capability and spacious cabin.',
    first_flight: 2003,
    specifications: {
      max_takeoff_weight: '75,500 kg',
      cruising_speed: 'Mach 0.78',
      range: '11,650 km',
      capacity: 19,
      engines: 2,
      engine_type: 'CFM56 or V2500',
      length: '33.84 m',
      wingspan: '34.1 m',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj320',
    manufacturer_id: 'airbus',
    model: 'ACJ320',
    category: 'private',
    subcategory: 'corporate-jet',
    image: '/images/manufacturers/airbus/airbus-acj320.jpg',
    description: 'The Airbus ACJ320 is the corporate jet version of the A320, offering long-range capability and spacious cabin.',
    first_flight: 2001,
    specifications: {
      max_takeoff_weight: '77,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '11,100 km',
      capacity: 19,
      engines: 2,
      engine_type: 'CFM56 or V2500',
      length: '37.57 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj321',
    manufacturer_id: 'airbus',
    model: 'ACJ321',
    category: 'private',
    subcategory: 'corporate-jet',
    image: '/images/manufacturers/airbus/airbus-acj321.jpg',
    description: 'The Airbus ACJ321 is the corporate jet version of the A321, offering the longest range and most spacious cabin in the A320 family.',
    first_flight: 2004,
    specifications: {
      max_takeoff_weight: '93,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '11,750 km',
      capacity: 25,
      engines: 2,
      engine_type: 'CFM56 or V2500',
      length: '44.51 m',
      wingspan: '35.8 m',
      height: '11.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj330',
    manufacturer_id: 'airbus',
    model: 'ACJ330',
    category: 'private',
    subcategory: 'corporate-jet',
    image: '/images/manufacturers/airbus/airbus-acj330.jpg',
    description: 'The Airbus ACJ330 is the corporate jet version of the A330, offering ultra-long-range capability and spacious cabin.',
    first_flight: 2008,
    specifications: {
      max_takeoff_weight: '242,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '17,500 km',
      capacity: 50,
      engines: 2,
      engine_type: 'CF6-80E1 or Trent 700',
      length: '63.66 m',
      wingspan: '60.3 m',
      height: '16.79 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj340',
    manufacturer_id: 'airbus',
    model: 'ACJ340',
    category: 'private',
    subcategory: 'corporate-jet',
    image: '/images/manufacturers/airbus/airbus-acj340.jpg',
    description: 'The Airbus ACJ340 is the corporate jet version of the A340, offering ultra-long-range capability with four engines.',
    first_flight: 2005,
    specifications: {
      max_takeoff_weight: '275,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '18,500 km',
      capacity: 50,
      engines: 4,
      engine_type: 'CFM56-5C4',
      length: '63.60 m',
      wingspan: '60.3 m',
      height: '16.84 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj350',
    manufacturer_id: 'airbus',
    model: 'ACJ350',
    category: 'private',
    subcategory: 'corporate-jet',
    image: '/images/manufacturers/airbus/airbus-acj350.jpg',
    description: 'The Airbus ACJ350 is the corporate jet version of the A350, featuring advanced carbon-composite construction and ultra-long-range capability.',
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '280,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '20,550 km',
      capacity: 50,
      engines: 2,
      engine_type: 'Trent XWB',
      length: '67.09 m',
      wingspan: '64.31 m',
      height: '17.08 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Miami', 'Singapore', 'Dubai'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a400m',
    manufacturer_id: 'airbus',
    model: 'A400M Atlas',
    category: 'military',
    subcategory: 'transport-tanker',
    image: '/images/manufacturers/airbus/airbus-a400m_atlas.jpg',
    description: 'The Airbus A400M Atlas is a four-engine turboprop tactical airlifter with strategic capabilities, designed to replace older military transport aircraft.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '141,000 kg',
      cruising_speed: '780 km/h',
      range: '8,900 km',
      capacity: 116,
      engines: 4,
      engine_type: 'TP400-D6 Turboprop',
      length: '43.84 m',
      wingspan: '42.40 m',
      height: '14.66 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Seville', 'Toulouse'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / Military Authority',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-mrtt',
    manufacturer_id: 'airbus',
    model: 'A330 MRTT',
    category: 'military',
    subcategory: 'transport-tanker',
    image: '/images/manufacturers/airbus/airbus-a330_mrtt.jpg',
    description: 'The Airbus A330 MRTT (Multi Role Tanker Transport) is a military derivative of the A330 used for aerial refueling and transport.',
    first_flight: 2007,
    specifications: {
      max_takeoff_weight: '233,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '14,800 km',
      capacity: 285,
      engines: 2,
      engine_type: 'CF6-80E1 or Trent 700',
      length: '63.66 m',
      wingspan: '60.3 m',
      height: '16.79 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Getafe'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / Military Authority',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'c295',
    manufacturer_id: 'airbus',
    model: 'C295',
    category: 'military',
    subcategory: 'tactical-transport',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus C295 is a robust, twin-turboprop tactical transport and maritime patrol aircraft.',
    first_flight: 1997,
    specifications: {
      max_takeoff_weight: '23,200 kg',
      cruising_speed: '480 km/h',
      range: '5,700 km',
      capacity: 71,
      engines: 2,
      engine_type: 'TP400-D6 Turboprop',
      length: '19.35 m',
      wingspan: '25.81 m',
      height: '6.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Seville'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / Military Authority',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'cn235',
    manufacturer_id: 'airbus',
    model: 'CN235',
    category: 'military',
    subcategory: 'tactical-transport',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus CN235 is a medium-range twin-turboprop transport aircraft, originally a joint venture with CASA.',
    first_flight: 1983,
    specifications: {
      max_takeoff_weight: '16,000 kg',
      cruising_speed: '450 km/h',
      range: '4,500 km',
      capacity: 51,
      engines: 2,
      engine_type: 'CT7-9C Turboprop',
      length: '21.40 m',
      wingspan: '24.60 m',
      height: '8.18 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Seville'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / Military Authority',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'eurofighter-typhoon',
    manufacturer_id: 'airbus',
    model: 'Eurofighter Typhoon',
    category: 'military',
    subcategory: 'combat-stealth',
    image: '/images/manufacturers/airbus/airbus-eurofighter_typhoon.jpg',
    description: 'The Eurofighter Typhoon is a twin-engine, canard-delta wing, multirole fighter. Airbus is a major partner in the consortium that builds this aircraft.',
    first_flight: 1994,
    specifications: {
      max_takeoff_weight: '23,500 kg',
      cruising_speed: 'Mach 2.0',
      range: '2,900 km',
      capacity: 1,
      engines: 2,
      engine_type: 'EJ200',
      length: '15.96 m',
      wingspan: '10.95 m',
      height: '5.28 m'
    },
    training_requirements: {
      minimum_hours: 1000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 200,
      simulator_hours: 40,
      flight_hours: 20
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manching', 'Cotswold'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewal_requirements: ['Combat missions', 'Proficiency check']
    }
  },
  {
    id: 'h125',
    manufacturer_id: 'airbus',
    model: 'H125',
    category: 'helicopter',
    subcategory: 'light-single-engine',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus H125 (formerly AS350 Écureuil) is a single-engine light utility helicopter known for its performance in high-altitude and hot conditions. It holds the record for landing on Mt. Everest.',
    first_flight: 1974,
    specifications: {
      max_takeoff_weight: '2,500 kg',
      cruising_speed: '250 km/h',
      range: '660 km',
      capacity: 6,
      engines: 1,
      engine_type: 'Arriel 2D Turboshaft',
      length: '10.93 m',
      wingspan: '10.69 m',
      height: '3.14 m'
    },
    training_requirements: {
      minimum_hours: 100,
      required_licenses: ['PPL(H)', 'Helicopter Rating'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 10,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'CFI(H)', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'h130',
    manufacturer_id: 'airbus',
    model: 'H130',
    category: 'helicopter',
    subcategory: 'light-single-engine',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus H130 is a wide-body single-engine helicopter known as the "iPhone Pro" of sightseeing due to its huge windows and quiet Fenestron tail rotor. It\'s perfect for tourism and VIP transport.',
    first_flight: 2012,
    specifications: {
      max_takeoff_weight: '2,500 kg',
      cruising_speed: '250 km/h',
      range: '660 km',
      capacity: 6,
      engines: 1,
      engine_type: 'Arriel 2D Turboshaft',
      length: '10.93 m',
      wingspan: '10.69 m',
      height: '3.14 m'
    },
    training_requirements: {
      minimum_hours: 100,
      required_licenses: ['PPL(H)', 'Helicopter Rating'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 10,
      flight_hours: 5
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Dallas'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['300 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'h135',
    manufacturer_id: 'airbus',
    model: 'H135',
    category: 'helicopter',
    subcategory: 'light-twin-engine',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus H135 is a light twin-engine helicopter known for its versatility in emergency medical services and law enforcement roles.',
    first_flight: 1994,
    specifications: {
      max_takeoff_weight: '2,950 kg',
      cruising_speed: '254 km/h',
      range: '635 km',
      capacity: 7,
      engines: 2,
      engine_type: 'Arriel 2B Turboshaft',
      length: '10.26 m',
      wingspan: '10.20 m',
      height: '3.32 m'
    },
    training_requirements: {
      minimum_hours: 150,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 50,
      simulator_hours: 12,
      flight_hours: 6
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Dallas'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['400 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'h145',
    manufacturer_id: 'airbus',
    model: 'H145',
    category: 'helicopter',
    subcategory: 'medium-twin-engine',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus H145 is a light twin-engine helicopter featuring a fenestron tail rotor and advanced avionics.',
    first_flight: 2014,
    specifications: {
      max_takeoff_weight: '3,700 kg',
      cruising_speed: '250 km/h',
      range: '680 km',
      capacity: 9,
      engines: 2,
      engine_type: 'Arriel 2E Turboshaft',
      length: '13.03 m',
      wingspan: '11.00 m',
      height: '3.86 m'
    },
    training_requirements: {
      minimum_hours: 150,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 50,
      simulator_hours: 12,
      flight_hours: 6
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Dallas'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['400 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'h155',
    manufacturer_id: 'airbus',
    model: 'H155',
    category: 'helicopter',
    subcategory: 'medium-twin-engine',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus H155 (formerly EC155 B1) is a medium twin-engine helicopter with a spacious cabin for VIP transport.',
    first_flight: 1997,
    specifications: {
      max_takeoff_weight: '5,500 kg',
      cruising_speed: '280 km/h',
      range: '850 km',
      capacity: 13,
      engines: 2,
      engine_type: 'Arriel 2C2 Turboshaft',
      length: '12.64 m',
      wingspan: '12.60 m',
      height: '4.01 m'
    },
    training_requirements: {
      minimum_hours: 200,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 60,
      simulator_hours: 15,
      flight_hours: 8
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'h175',
    manufacturer_id: 'airbus',
    model: 'H175',
    category: 'helicopter',
    subcategory: 'heavy-twin-engine',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus H175 (formerly EC175 B1) is a heavy twin-engine helicopter designed for offshore oil and gas transport.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '7,500 kg',
      cruising_speed: '300 km/h',
      range: '1,300 km',
      capacity: 16,
      engines: 2,
      engine_type: 'PT6C-67E Turboshaft',
      length: '14.74 m',
      wingspan: '14.80 m',
      height: '4.66 m'
    },
    training_requirements: {
      minimum_hours: 300,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Aberdeen'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'h225',
    manufacturer_id: 'airbus',
    model: 'H225',
    category: 'helicopter',
    subcategory: 'heavy-twin-engine',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus H225 (formerly Super Puma) is a heavy twin-engine helicopter used for offshore transport and heavy lift operations.',
    first_flight: 1990,
    specifications: {
      max_takeoff_weight: '11,000 kg',
      cruising_speed: '280 km/h',
      range: '880 km',
      capacity: 24,
      engines: 2,
      engine_type: 'Makila 2A1 Turboshaft',
      length: '16.80 m',
      wingspan: '16.20 m',
      height: '4.98 m'
    },
    training_requirements: {
      minimum_hours: 300,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Aberdeen'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['3 takeoffs and landings', 'Proficiency check']
    }
  },
  {
    id: 'nh90',
    manufacturer_id: 'airbus',
    model: 'NH90',
    category: 'military',
    subcategory: 'attack-tactical-helicopter',
    image: '/images/manufacturers/airbus/airbus-nh90.jpg',
    description: 'The NH90 is a medium-sized, twin-engine multi-role military helicopter developed by NHIndustries (Airbus is a partner).',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '10,600 kg',
      cruising_speed: '280 km/h',
      range: '1,200 km',
      capacity: 20,
      engines: 2,
      engine_type: 'T700-T6E1 Turboshaft',
      length: '16.13 m',
      wingspan: '13.00 m',
      height: '5.23 m'
    },
    training_requirements: {
      minimum_hours: 300,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewal_requirements: ['Combat missions', 'Proficiency check']
    }
  },
  {
    id: 'tiger',
    manufacturer_id: 'airbus',
    model: 'Tiger',
    category: 'military',
    subcategory: 'attack-tactical-helicopter',
    image: '/images/manufacturers/airbus/airbus-tiger.jpg',
    description: 'The Airbus Tiger is a four-bladed, twin-engine attack helicopter developed by Eurocopter (now Airbus Helicopters).',
    first_flight: 1991,
    specifications: {
      max_takeoff_weight: '6,600 kg',
      cruising_speed: '280 km/h',
      range: '800 km',
      capacity: 2,
      engines: 2,
      engine_type: 'MTR390 Turboshaft',
      length: '13.99 m',
      wingspan: '13.00 m',
      height: '3.83 m'
    },
    training_requirements: {
      minimum_hours: 500,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 30,
      flight_hours: 15
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Bückeburg'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['800 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewal_requirements: ['Combat missions', 'Proficiency check']
    }
  },
  {
    id: 'h145m',
    manufacturer_id: 'airbus',
    model: 'H145M',
    category: 'military',
    subcategory: 'utility-helicopter',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus H145M is the military variant of the H145, featuring advanced mission systems for special operations and armed reconnaissance.',
    first_flight: 2014,
    specifications: {
      max_takeoff_weight: '3,700 kg',
      cruising_speed: '250 km/h',
      range: '680 km',
      capacity: 8,
      engines: 2,
      engine_type: 'Arriel 2E Turboshaft',
      length: '13.03 m',
      wingspan: '11.00 m',
      height: '3.86 m'
    },
    training_requirements: {
      minimum_hours: 200,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 60,
      simulator_hours: 15,
      flight_hours: 8
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewal_requirements: ['Combat missions', 'Proficiency check']
    }
  },
  {
    id: 'h225m',
    manufacturer_id: 'airbus',
    model: 'H225M Caracal',
    category: 'military',
    subcategory: 'attack-tactical-helicopter',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus H225M Caracal is the military variant of the H225, used for special operations, combat search and rescue, and tactical transport.',
    first_flight: 2000,
    specifications: {
      max_takeoff_weight: '11,000 kg',
      cruising_speed: '280 km/h',
      range: '1,200 km',
      capacity: 28,
      engines: 2,
      engine_type: 'Makila 2A1 Turboshaft',
      length: '16.80 m',
      wingspan: '16.20 m',
      height: '4.98 m'
    },
    training_requirements: {
      minimum_hours: 300,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewal_requirements: ['Combat missions', 'Proficiency check']
    }
  },
  {
    id: 'h215',
    manufacturer_id: 'airbus',
    model: 'H215',
    category: 'helicopter',
    subcategory: 'heavy-twin-engine',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus H215 (formerly AS332 Super Puma Mk2) is the slightly smaller, more rugged sibling of the H225. It is heavily used for heavy-lift work and firefighting operations worldwide.',
    first_flight: 1979,
    specifications: {
      max_takeoff_weight: '9,500 kg',
      cruising_speed: '270 km/h',
      range: '820 km',
      capacity: 19,
      engines: 2,
      engine_type: 'Makila 1A1 Turboshaft',
      length: '15.53 m',
      wingspan: '15.60 m',
      height: '4.92 m'
    },
    training_requirements: {
      minimum_hours: 250,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 75,
      simulator_hours: 18,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Donauwörth'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h160',
    manufacturer_id: 'airbus',
    model: 'H160',
    category: 'helicopter',
    subcategory: 'medium-twin-engine',
    image: '/images/manufacturers/airbus/airbus-h160.jpg',
    description: 'The Airbus H160 is the "Next-Gen" medium twin-engine helicopter featuring massive technological leaps like curved "Blue Edge" blades to make it incredibly quiet. It represents the future of the medium class.',
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '6,000 kg',
      cruising_speed: '290 km/h',
      range: '870 km',
      capacity: 12,
      engines: 2,
      engine_type: 'Arrano Turboshaft',
      length: '13.49 m',
      wingspan: '13.00 m',
      height: '4.33 m'
    },
    training_requirements: {
      minimum_hours: 200,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 70,
      simulator_hours: 18,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h140',
    manufacturer_id: 'airbus',
    model: 'H140',
    category: 'helicopter',
    subcategory: 'light-twin-engine',
    image: '/images/manufacturers/airbus/airbus-h140.jpg',
    description: 'The Airbus H140 is a brand new light twin-engine model introduced around 2025, designed to bridge the gap between the H135 and H145 with enhanced performance and capacity.',
    first_flight: 2025,
    specifications: {
      max_takeoff_weight: '3,400 kg',
      cruising_speed: '260 km/h',
      range: '700 km',
      capacity: 8,
      engines: 2,
      engine_type: 'Arriel 2D Turboshaft',
      length: '11.50 m',
      wingspan: '10.80 m',
      height: '3.50 m'
    },
    training_requirements: {
      minimum_hours: 150,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 55,
      simulator_hours: 12,
      flight_hours: 8
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'uh-72-lakota',
    manufacturer_id: 'airbus',
    model: 'UH-72 Lakota',
    category: 'military',
    subcategory: 'utility-helicopter',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus UH-72 Lakota is the military version of the H145, used extensively by the U.S. Army for training, medevac, and utility missions.',
    first_flight: 2006,
    specifications: {
      max_takeoff_weight: '3,700 kg',
      cruising_speed: '250 km/h',
      range: '680 km',
      capacity: 9,
      engines: 2,
      engine_type: 'Arriel 2E Turboshaft',
      length: '13.03 m',
      wingspan: '11.00 m',
      height: '3.86 m'
    },
    training_requirements: {
      minimum_hours: 200,
      required_licenses: ['CPL(H)', 'ME', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 60,
      simulator_hours: 15,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane', 'Columbus'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewal_requirements: ['Combat missions', 'Proficiency check']
    }
  },
  {
    id: 'neuron',
    manufacturer_id: 'airbus',
    model: 'nEUROn',
    category: 'military',
    subcategory: 'combat-stealth',
    image: '/images/manufacturers/airbus/airbus-neuron.jpg',
    description: 'The nEUROn is an experimental European stealth combat drone (UCAV). Airbus (CASA/EADS) was a major partner in developing its stealth and flight systems. It serves as a technology demonstrator.',
    first_flight: 2012,
    specifications: {
      max_takeoff_weight: '7,000 kg',
      cruising_speed: 'Mach 0.8',
      range: '2,900 km',
      capacity: 0,
      engines: 2,
      engine_type: 'Adour Mk951 Turbofan',
      length: '10.00 m',
      wingspan: '12.50 m',
      height: '2.50 m'
    },
    training_requirements: {
      minimum_hours: 200,
      required_licenses: ['UAV Operator License', 'Military Rating'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 60,
      simulator_hours: 30,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'UAV Simulator',
      locations: ['Istres'],
      features: ['Visual System', 'Autonomous Simulation', 'Stealth Simulation']
    },
    instructor_qualifications: [
      {
        type: 'UAV Instructor',
        requirements: ['300 hours on type', 'UAV Instructor certification', 'Remote Pilot Experience']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewal_requirements: ['Proficiency Check', 'UCAV Systems Training']
    }
  },
  {
    id: 'bird-of-prey',
    manufacturer_id: 'airbus',
    model: 'Bird of Prey',
    category: 'military',
    subcategory: 'combat-stealth',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus Bird of Prey is a high-subsonic interceptor drone designed to hunt down and "neutralize" enemy kamikaze drones autonomously. It\'s a new for 2026 platform.',
    first_flight: 2026,
    specifications: {
      max_takeoff_weight: '800 kg',
      cruising_speed: 'Mach 0.85',
      range: '1,500 km',
      capacity: 0,
      engines: 1,
      engine_type: 'Electric/Hybrid Propulsion',
      length: '5.50 m',
      wingspan: '7.20 m',
      height: '1.80 m'
    },
    training_requirements: {
      minimum_hours: 100,
      required_licenses: ['UAV Operator License', 'Military Rating'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 20,
      flight_hours: 5
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'UAV Simulator',
      locations: ['Manching'],
      features: ['Visual System', 'Autonomous Simulation', 'Drone Countermeasure Simulation']
    },
    instructor_qualifications: [
      {
        type: 'UAV Instructor',
        requirements: ['200 hours on type', 'UAV Instructor certification', 'AI Systems Experience']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewal_requirements: ['Proficiency Check', 'AI Systems Training']
    }
  },
  {
    id: 'zephyr',
    manufacturer_id: 'airbus',
    model: 'Zephyr',
    category: 'military',
    subcategory: 'surveillance-uas',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus Zephyr is a solar-powered "pseudo-satellite" (HAPS) that flies in the stratosphere for 60+ days at a time, providing constant surveillance or 5G signal.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '75 kg',
      cruising_speed: '70 km/h',
      range: 'Unlimited (solar powered)',
      capacity: 0,
      engines: 2,
      engine_type: 'Electric Motors',
      length: '5.00 m',
      wingspan: '25.00 m',
      height: '1.20 m'
    },
    training_requirements: {
      minimum_hours: 50,
      required_licenses: ['UAV Operator License', 'Military Rating'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 30,
      simulator_hours: 15,
      flight_hours: 5
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'UAV Simulator',
      locations: ['Farnborough'],
      features: ['Visual System', 'Stratospheric Simulation', 'Long-Endurance Simulation']
    },
    instructor_qualifications: [
      {
        type: 'UAV Instructor',
        requirements: ['150 hours on type', 'UAV Instructor certification', 'HAPS Experience']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewal_requirements: ['Proficiency Check', 'HAPS Systems Training']
    }
  },
  {
    id: 'capa-x',
    manufacturer_id: 'airbus',
    model: 'Capa-X',
    category: 'military',
    subcategory: 'surveillance-uas',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus Capa-X is a modular "heavy" drone (120kg) selected by the European Defence Agency for electronic warfare and cargo delivery in combat zones. It\'s a new for 2026 platform.',
    first_flight: 2026,
    specifications: {
      max_takeoff_weight: '120 kg',
      cruising_speed: '180 km/h',
      range: '1,200 km',
      capacity: 30,
      engines: 2,
      engine_type: 'Heavy-Duty Electric Motors',
      length: '4.50 m',
      wingspan: '8.00 m',
      height: '1.50 m'
    },
    training_requirements: {
      minimum_hours: 80,
      required_licenses: ['UAV Operator License', 'Military Rating'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 35,
      simulator_hours: 18,
      flight_hours: 6
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'UAV Simulator',
      locations: ['Manching'],
      features: ['Visual System', 'EW Simulation', 'Cargo Simulation']
    },
    instructor_qualifications: [
      {
        type: 'UAV Instructor',
        requirements: ['180 hours on type', 'UAV Instructor certification', 'EW Systems Experience']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewal_requirements: ['Proficiency Check', 'EW Systems Training']
    }
  },
  {
    id: 'as365-dauphin',
    manufacturer_id: 'airbus',
    model: 'AS365 Dauphin',
    category: 'helicopter',
    subcategory: 'medium-twin-engine',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus AS365 Dauphin is a sleek, fast helicopter famous for its "Fenestron" (shrouded) tail rotor. It is the "father" of the H155 and still widely used for VIP transport and offshore missions.',
    first_flight: 1975,
    specifications: {
      max_takeoff_weight: '4,250 kg',
      cruising_speed: '275 km/h',
      range: '800 km',
      capacity: 12,
      engines: 2,
      engine_type: 'Arriel 2C Turboshaft',
      length: '11.63 m',
      wingspan: '11.94 m',
      height: '3.99 m'
    },
    training_requirements: {
      minimum_hours: 180,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 65,
      simulator_hours: 14,
      flight_hours: 8
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bo-105',
    manufacturer_id: 'airbus',
    model: 'BO-105',
    category: 'helicopter',
    subcategory: 'light-twin-engine',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    description: 'The Airbus BO-105 is a legendary small twin-engine helicopter known for being the first that could perform loops and rolls. It is highly maneuverable and still in service for law enforcement and EMS.',
    first_flight: 1967,
    specifications: {
      max_takeoff_weight: '2,500 kg',
      cruising_speed: '242 km/h',
      range: '575 km',
      capacity: 5,
      engines: 2,
      engine_type: 'Allison 250-C20 Turboshaft',
      length: '8.84 m',
      wingspan: '9.84 m',
      height: '3.00 m'
    },
    training_requirements: {
      minimum_hours: 150,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 50,
      simulator_hours: 12,
      flight_hours: 8
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bk-117',
    manufacturer_id: 'airbus',
    model: 'BK-117',
    category: 'helicopter',
    subcategory: 'light-twin-engine',
    image: '/images/manufacturers/airbus/airbus-bk-117.jpg',
    description: 'The Airbus BK-117 is the predecessor to the H145 and still widely seen as life-flight/medical helicopters. It was developed in partnership with Kawasaki.',
    first_flight: 1979,
    specifications: {
      max_takeoff_weight: '3,350 kg',
      cruising_speed: '250 km/h',
      range: '680 km',
      capacity: 10,
      engines: 2,
      engine_type: 'LTS 101-750B-1 Turboshaft',
      length: '9.91 m',
      wingspan: '11.00 m',
      height: '3.36 m'
    },
    training_requirements: {
      minimum_hours: 160,
      required_licenses: ['CPL(H)', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 55,
      simulator_hours: 13,
      flight_hours: 8
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'gazelle',
    manufacturer_id: 'airbus',
    model: 'Gazelle',
    category: 'military',
    subcategory: 'utility-helicopter',
    image: '/images/manufacturers/airbus/airbus-gazelle.jpg',
    description: 'The Airbus Gazelle is a fast, thin scout helicopter with a very distinctive look, still used by many militaries for reconnaissance and light attack missions.',
    first_flight: 1967,
    specifications: {
      max_takeoff_weight: '1,800 kg',
      cruising_speed: '310 km/h',
      range: '670 km',
      capacity: 4,
      engines: 1,
      engine_type: 'Astazou XIV Turboshaft',
      length: '11.97 m',
      wingspan: '10.50 m',
      height: '3.15 m'
    },
    training_requirements: {
      minimum_hours: 120,
      required_licenses: ['CPL(H)', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 45,
      simulator_hours: 10,
      flight_hours: 6
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['400 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewal_requirements: ['Proficiency Check', 'Tactical Training']
    }
  },
  {
    id: 'cityairbus',
    manufacturer_id: 'airbus',
    model: 'CityAirbus',
    category: 'helicopter',
    subcategory: 'evtol',
    image: '/images/manufacturers/airbus/airbus-cityairbus.jpg',
    description: 'The Airbus CityAirbus is an all-electric "flying taxi" (eVTOL) project designed for urban air mobility and short-range passenger transport.',
    first_flight: 2024,
    specifications: {
      max_takeoff_weight: '2,200 kg',
      cruising_speed: '120 km/h',
      range: '100 km',
      capacity: 4,
      engines: 8,
      engine_type: 'Electric Motors',
      length: '6.20 m',
      wingspan: '11.30 m',
      height: '2.90 m'
    },
    training_requirements: {
      minimum_hours: 100,
      required_licenses: ['PPL(H)', 'eVTOL Rating'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 10,
      flight_hours: 5
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Marignane'],
      features: ['6-DOF Motion', 'Visual System', 'eVTOL Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['300 hours on type', 'TRI certification', 'Instructor rating', 'eVTOL Experience']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '1 year',
      renewal_requirements: ['Proficiency Check', 'eVTOL Systems Training']
    }
  },
  {
    id: 'vsr700',
    manufacturer_id: 'airbus',
    model: 'VSR700',
    category: 'military',
    subcategory: 'surveillance-uas',
    image: '/images/manufacturers/airbus/airbus-vsr700.jpg',
    description: 'The Airbus VSR700 is an unmanned (drone) helicopter designed for navies to launch from ships for reconnaissance and surveillance missions.',
    first_flight: 2022,
    specifications: {
      max_takeoff_weight: '700 kg',
      cruising_speed: '180 km/h',
      range: '900 km',
      capacity: 0,
      engines: 1,
      engine_type: 'Arriel 2D Turboshaft',
      length: '5.90 m',
      wingspan: '6.20 m',
      height: '2.20 m'
    },
    training_requirements: {
      minimum_hours: 50,
      required_licenses: ['UAV Operator License'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 30,
      simulator_hours: 15,
      flight_hours: 5
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'UAV Simulator',
      locations: ['Marignane'],
      features: ['Visual System', 'Autonomous Simulation', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'UAV Instructor',
        requirements: ['200 hours on type', 'UAV Instructor certification', 'Remote Pilot Experience']
      }
    ],
    certification: {
      authority: 'Military Authority',
      validity: '1 year',
      renewal_requirements: ['Proficiency Check', 'UAV Systems Training']
    }
  },
  {
    id: 'a220',
    manufacturer_id: 'airbus',
    model: 'A220',
    category: 'regional',
    image: '/images/manufacturers/airbus/airbus-a220.jpg',
    sketchfab_id: 'ce4fbb839e6b4bb989422426bfc8fd1c',
    description: 'The Airbus A220 is a family of narrow-body, twin-engine, medium-range jet airliners. It was originally developed by Bombardier as the CSeries.',
    first_flight: 2013,
    specifications: {
      max_takeoff_weight: '50,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,000 km',
      capacity: 160,
      engines: 2,
      engine_type: 'PW1500G',
      length: '35.0 m',
      wingspan: '35.1 m',
      height: '11.5 m'
    },
    training_requirements: {
      minimum_hours: 1000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 16,
      flight_hours: 8
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Mirabel', 'Mobile'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA / Transport Canada',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Cessna
  {
    id: 'cessna-172',
    manufacturer_id: 'cessna',
    model: 'Cessna 172',
    category: 'private',
    image: '/images/manufacturers/cessna/cessna-cessna_172.jpg',
    sketchfab_id: 'd1b15841c29c43d0862667300bad55a4',
    description: 'The Cessna 172 Skyhawk is a four-seat, single-engine, high wing, fixed-wing aircraft. It is the most produced aircraft in history.',
    first_flight: 1955,
    specifications: {
      max_takeoff_weight: '1,111 kg',
      cruising_speed: '122 knots',
      range: '1,289 km',
      capacity: 4,
      engines: 1,
      engine_type: 'Lycoming O-320',
      length: '8.28 m',
      wingspan: '11.0 m',
      height: '2.72 m'
    },
    training_requirements: {
      minimum_hours: 40,
      required_licenses: ['PPL'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 10,
      flight_hours: 40
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Flight Training Device',
      locations: ['Wichita', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructor_qualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewal_requirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'cessna-152',
    manufacturer_id: 'cessna',
    model: 'Cessna 152',
    category: 'private',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    sketchfab_id: 'f20f6eb4616e4a708241eb3c8a90340a',
    description: 'The Cessna 152 is a two-seat, tricycle gear, general aviation airplane. It was designed primarily as a flight trainer.',
    first_flight: 1977,
    specifications: {
      max_takeoff_weight: '757 kg',
      cruising_speed: '107 knots',
      range: '770 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Lycoming O-235',
      length: '7.3 m',
      wingspan: '10.17 m',
      height: '2.59 m'
    },
    training_requirements: {
      minimum_hours: 40,
      required_licenses: ['PPL'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 10,
      flight_hours: 40
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Flight Training Device',
      locations: ['Wichita', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructor_qualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewal_requirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'cessna-182',
    manufacturer_id: 'cessna',
    model: 'Cessna 182',
    category: 'private',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    sketchfab_id: 'ed54f082ab014626a1359009b33e7e81',
    description: 'The Cessna 182 Skylane is a four-seat, single-engine, high-wing light aircraft. It is known for its stability and performance.',
    first_flight: 1956,
    specifications: {
      max_takeoff_weight: '1,406 kg',
      cruising_speed: '145 knots',
      range: '1,770 km',
      capacity: 4,
      engines: 1,
      engine_type: 'Lycoming O-540',
      length: '8.84 m',
      wingspan: '10.97 m',
      height: '2.79 m'
    },
    training_requirements: {
      minimum_hours: 40,
      required_licenses: ['PPL'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 10,
      flight_hours: 40
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Flight Training Device',
      locations: ['Wichita', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructor_qualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewal_requirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'cessna-206',
    manufacturer_id: 'cessna',
    model: 'Cessna 206',
    category: 'private',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    sketchfab_id: 'cf61032f294f4cfab478de38451422a3',
    description: 'The Cessna 206 Stationair is a six-seat, single-engine, high-wing aircraft. It is popular for utility and bush flying.',
    first_flight: 1962,
    specifications: {
      max_takeoff_weight: '1,633 kg',
      cruising_speed: '143 knots',
      range: '1,335 km',
      capacity: 6,
      engines: 1,
      engine_type: 'Lycoming IO-540',
      length: '8.53 m',
      wingspan: '10.95 m',
      height: '2.92 m'
    },
    training_requirements: {
      minimum_hours: 40,
      required_licenses: ['PPL'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 10,
      flight_hours: 40
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Flight Training Device',
      locations: ['Wichita', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructor_qualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewal_requirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'cessna-208',
    manufacturer_id: 'cessna',
    model: 'Cessna 208 Caravan',
    category: 'cargo',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    sketchfab_id: '2759f3b519904924bb09d02bd961a308',
    description: 'The Cessna 208 Caravan is a single-engine turboprop aircraft. It is widely used for cargo and regional passenger transport.',
    first_flight: 1982,
    specifications: {
      max_takeoff_weight: '3,629 kg',
      cruising_speed: '186 knots',
      range: '1,980 km',
      capacity: 9,
      engines: 1,
      engine_type: 'Pratt & Whitney Canada PT6A',
      length: '11.46 m',
      wingspan: '15.88 m',
      height: '4.27 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 60,
      simulator_hours: 15,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Wichita', 'Various'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'cessna-citation-x',
    manufacturer_id: 'cessna',
    model: 'Cessna Citation X',
    category: 'private',
    image: '/images/manufacturers/cessna/cessna-cessna_citation_x.jpg',
    sketchfab_id: 'a9eac6363d7f4bfaa7f0ee3b9beca604',
    description: 'The Cessna Citation X is a long-range, medium-sized business jet. It was one of the fastest business jets in production.',
    first_flight: 1993,
    specifications: {
      max_takeoff_weight: '16,329 kg',
      cruising_speed: 'Mach 0.935',
      range: '6,020 km',
      capacity: 9,
      engines: 2,
      engine_type: 'AE3007C1',
      length: '22.0 m',
      wingspan: '19.4 m',
      height: '6.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Wichita', 'Various'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Boeing
  {
    id: 'b737-max',
    manufacturer_id: 'boeing',
    model: '737 MAX',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/boeing/boeing-737_max.jpg',
    sketchfab_id: '7a548b5ba64340f78f7c58d23781ffe9',
    description: 'The Boeing 737 MAX is the backbone of global short-haul operations in 2026. With the MAX 8, 9, and 10 variants, it dominates the narrow-body market and remains the most sought-after rating for rapid employment. The data-backed estimate for active, type-rated Boeing 737 pilots worldwide is between 110,000 and 130,000 pilots.',
    first_flight: 2016,
    specifications: {
      max_takeoff_weight: '79,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,000 km',
      capacity: 189,
      engines: 2,
      engine_type: 'CFM56 or CFM LEAP',
      length: '38.1 m',
      wingspan: '35.9 m',
      height: '12.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-8',
    manufacturer_id: 'boeing',
    model: '747-8F',
    category: 'cargo',
    subcategory: 'production-freighter',
    image: '/images/manufacturers/boeing/boeing-747-8f.jpg',
    sketchfab_id: '86ec524a08e74e5e8907771c2d96b525',
    description: 'There are an estimated 3,500 to 4,500 active pilots globally who hold the specific type rating required to fly the Boeing 747-8F. There will be no "next" Boeing 747-8F built, as Boeing officially ended the 747 production line. The final Boeing 747 ever manufactured—a 747-8 Freighter—rolled out of the Everett, Washington factory and was delivered to Atlas Air. Because the production tooling has been dismantled and the assembly line repurposed, no future factory-built 747-8F aircraft will ever be made. The Immediate Successor: Boeing 777-8F. Boeing has positioned the upcoming 777X Freighter (777-8F) as the direct replacement for the aging 747-400F and 747-8F fleets. Payload Capacity: It carries up to 118 tonnes of revenue payload. This is slightly less than the 747-8F (137 tonnes) but features a massive structural efficiency advantage. Efficiency: It reduces fuel use and carbon emissions by up to 30% compared to the 747-8, running on two massive GE9X engines instead of four GEnx engines. The Main Loss: The critical operational feature pilots and cargo loaders will lose with the 777-8F is the nose-loading door. The 747-8F remains unique for its capability to lift its nose to load oversized, out-of-gauge military and industrial freight. The Used Market: 747-8F Fleet Movements. While no new planes are being built, the "next" 747-8Fs appearing in airline liveries are existing airframes moving through the secondary market. Long Lifespans: Because the 747-8F fleet is relatively young (built between 2011 and 2023), these aircraft are expected to fly for another 20 to 30 years. Operator Consolidation: Major cargo giants like Atlas Air, UPS, FedEx, and CargoLux are actively acquiring any used 747-8F airframes that become available from passenger-to-freighter transitions or smaller cargo airline liquidations.',
    first_flight: 2010,
    specifications: {
      max_takeoff_weight: '447,700 kg',
      cruising_speed: 'Mach 0.85',
      range: '13,450 km',
      capacity: 467,
      engines: 4,
      engine_type: 'GE CF6 or PW4000',
      length: '70.7 m',
      wingspan: '64.9 m',
      height: '19.3 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'London', 'Tokyo'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777-300er',
    manufacturer_id: 'boeing',
    model: '777-300ER',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/boeing/boeing-777-300er.jpg',
    sketchfab_id: 'c4b6d9e7f8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
    description: 'There are an estimated 38,000 to 45,000 active pilots globally who fly the Boeing 777-300ER. The Boeing 777-300ER is a workhorse of long-haul operations. With its exceptional range and capacity, it remains a primary flagship for major airlines, particularly for premium routes and cargo operations.',
    first_flight: 2002,
    specifications: {
      max_takeoff_weight: '351,000 kg',
      cruising_speed: 'Mach 0.84',
      range: '13,650 km',
      capacity: 396,
      engines: 2,
      engine_type: 'GE90 or Trent 800',
      length: '63.7 m',
      wingspan: '60.9 m',
      height: '18.5 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b787',
    manufacturer_id: 'boeing',
    model: '787 Dreamliner',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/boeing/boeing-787_dreamliner.jpg',
    sketchfab_id: 'd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
    description: 'There are an estimated 48,000 to 55,000 active pilots globally who hold the type rating required to fly the Boeing 787 Dreamliner. The Boeing 787 Dreamliner revolutionized long-haul travel with its composite airframe and fuel efficiency. The 787-8, 787-9, and 787-10 variants are in active production and highly sought-after for medium-to-long-haul routes.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '254,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '14,075 km',
      capacity: 330,
      engines: 2,
      engine_type: 'GEnx or Trent 1000',
      length: '68.3 m',
      wingspan: '60.1 m',
      height: '16.9 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777x',
    manufacturer_id: 'boeing',
    model: '777X (777-8, 777-9)',
    category: 'flagship',
    subcategory: 'game-changer',
    image: '/images/manufacturers/boeing/boeing-777x__777-8__777-9_.jpg',
    sketchfab_id: 'e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
    description: 'There are currently zero commercial airline pilots rated to fly the Boeing 777X (777-8 and 777-9) in active revenue service. Because the 777X program is still navigating the intensive FAA Type Inspection Authorization (TIA) certification process—with first commercial deliveries expected in 2027—no standard airline crews are flying the aircraft. The Boeing 777X represents the future of long-haul travel with folding wingtips and advanced engines. The 777-8 and 777-9 are in testing and early delivery phases, set to become the new flagship for premium airlines.',
    first_flight: 2019,
    specifications: {
      max_takeoff_weight: '351,500 kg',
      cruising_speed: 'Mach 0.85',
      range: '13,645 km',
      capacity: 426,
      engines: 2,
      engine_type: 'GE9X',
      length: '76.7 m',
      wingspan: '71.8 m',
      height: '18.6 m'
    },
    training_requirements: {
      minimum_hours: 2500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 150,
      simulator_hours: 28,
      flight_hours: 14
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b767-300er',
    manufacturer_id: 'boeing',
    model: '767-300F',
    category: 'cargo',
    subcategory: 'p2f-conversion',
    image: '/images/manufacturers/boeing/boeing-767-300er.jpg',
    sketchfab_id: 'f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7',
    description: 'There are an estimated 15,000 to 18,000 active pilots globally who fly the Boeing 767-300F (Freighter). The Boeing 767-300F is a converted freighter variant of the 767-300ER. Active in cargo operations, it serves as a medium-haul freighter with excellent range and capacity.',
    first_flight: 1986,
    specifications: {
      max_takeoff_weight: '186,880 kg',
      cruising_speed: 'Mach 0.80',
      range: '11,065 km',
      capacity: 269,
      engines: 2,
      engine_type: 'GE CF6 or PW4000',
      length: '54.9 m',
      wingspan: '47.6 m',
      height: '15.9 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-ng',
    manufacturer_id: 'boeing',
    model: '737 NG (-700, -800, -900)',
    category: 'legacy',
    subcategory: 'narrow-body',
    image: '/images/manufacturers/boeing/boeing-737_ng__-700__-800__-900_.jpg',
    sketchfab_id: '7a548b5ba64340f78f7c58d23781ffe9',
    description: 'There are an estimated 110,000 to 130,000 active pilots globally who are rated to fly the Boeing 737 NG (-700, -800, -900). The Boeing 737 Next Generation (-700, -800, -900) is in legacy-retired status as airlines transition to the 737 MAX. Once the backbone of short-haul operations, it is being rapidly phased out.',
    first_flight: 1997,
    specifications: {
      max_takeoff_weight: '79,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '5,765 km',
      capacity: 189,
      engines: 2,
      engine_type: 'CFM56-7B',
      length: '42.1 m',
      wingspan: '35.8 m',
      height: '12.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b757',
    manufacturer_id: 'boeing',
    model: '757-200 / -300',
    category: 'legacy',
    subcategory: 'narrow-body',
    image: '/images/manufacturers/boeing/boeing-757-200___-300.jpg',
    sketchfab_id: 'g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7',
    description: 'There are an estimated 14,000 to 17,000 active pilots globally who fly the Boeing 757-200 and -300. The Boeing 757-200 and -300 are in legacy-retired status. Once a popular medium-haul aircraft, it has been retired by most airlines and replaced by more efficient 737 MAX and A321neo variants.',
    first_flight: 1982,
    specifications: {
      max_takeoff_weight: '115,660 kg',
      cruising_speed: 'Mach 0.80',
      range: '7,222 km',
      capacity: 239,
      engines: 2,
      engine_type: 'CFM56 or PW2000',
      length: '54.5 m',
      wingspan: '38.1 m',
      height: '13.6 m'
    },
    training_requirements: {
      minimum_hours: 1800,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 110,
      simulator_hours: 22,
      flight_hours: 11
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b717',
    manufacturer_id: 'boeing',
    model: '717 (formerly MD-95)',
    category: 'regional',
    subcategory: 'regional-jet',
    image: '/images/manufacturers/boeing/boeing-717__formerly_md-95_.jpg',
    sketchfab_id: 'h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8',
    description: 'There are an estimated 1,200 to 1,500 active pilots globally who fly the Boeing 717 (formerly known as the McDonnell Douglas MD-95). The Boeing 717, originally the McDonnell Douglas MD-95, was the last narrow-body aircraft designed by McDonnell Douglas before the Boeing merger. A regional jet that served short-haul routes efficiently.',
    first_flight: 1998,
    specifications: {
      max_takeoff_weight: '79,380 kg',
      cruising_speed: 'Mach 0.77',
      range: '3,815 km',
      capacity: 134,
      engines: 2,
      engine_type: 'BMW Rolls-Royce BR715',
      length: '37.8 m',
      wingspan: '28.4 m',
      height: '8.9 m'
    },
    training_requirements: {
      minimum_hours: 1200,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 16,
      flight_hours: 8
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['300 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b727',
    manufacturer_id: 'boeing',
    model: '727',
    category: 'legacy',
    subcategory: 'narrow-body',
    image: '/images/manufacturers/boeing/boeing-727.jpg',
    sketchfab_id: 'i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9',
    description: 'There are an estimated 300 to 500 active pilots globally who are still certified and actively flying the iconic Boeing 727. The Boeing 727 was a pioneering narrow-body trijet that revolutionized short-to-medium-haul travel. Now in legacy-retired status, it was once one of the most popular aircraft globally.',
    first_flight: 1963,
    specifications: {
      max_takeoff_weight: '95,300 kg',
      cruising_speed: 'Mach 0.80',
      range: '4,400 km',
      capacity: 189,
      engines: 3,
      engine_type: 'JT8D',
      length: '46.7 m',
      wingspan: '32.9 m',
      height: '10.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b707',
    manufacturer_id: 'boeing',
    model: '707 / 720',
    category: 'legacy',
    subcategory: 'wide-body',
    image: '/images/manufacturers/boeing/boeing-707___720.jpg',
    sketchfab_id: 'j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0',
    description: 'The Boeing 707 and its shorter variant 720 were the first successful commercial jet airliners, revolutionizing air travel. Now in legacy-retired status, they established Boeing as a global aviation leader.',
    first_flight: 1957,
    specifications: {
      max_takeoff_weight: '151,300 kg',
      cruising_speed: 'Mach 0.80',
      range: '10,000 km',
      capacity: 202,
      engines: 4,
      engine_type: 'JT3D or JT4A',
      length: '46.6 m',
      wingspan: '44.4 m',
      height: '12.9 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 24,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b377',
    manufacturer_id: 'boeing',
    model: '377 Stratocruiser',
    category: 'legacy',
    subcategory: 'wide-body',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    sketchfab_id: 'k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1',
    description: 'The Boeing 377 Stratocruiser was a luxurious long-range propeller airliner of the 1950s. In legacy-retired status, it represented the pinnacle of piston-engine commercial aviation before the jet age.',
    first_flight: 1947,
    specifications: {
      max_takeoff_weight: '79,380 kg',
      cruising_speed: '340 knots',
      range: '6,800 km',
      capacity: 100,
      engines: 4,
      engine_type: 'R-4360 Wasp Major',
      length: '33.6 m',
      wingspan: '43.1 m',
      height: '11.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 16,
      flight_hours: 8
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b247',
    manufacturer_id: 'boeing',
    model: '247',
    category: 'legacy',
    subcategory: 'narrow-body',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    sketchfab_id: 'l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2',
    description: 'The Boeing 247 was the first modern airliner, featuring all-metal construction, retractable landing gear, and de-icing boots. In legacy-retired status, it revolutionized commercial aviation in the 1930s.',
    first_flight: 1933,
    specifications: {
      max_takeoff_weight: '6,800 kg',
      cruising_speed: '189 knots',
      range: '776 km',
      capacity: 10,
      engines: 2,
      engine_type: 'Wasp Junior',
      length: '15.8 m',
      wingspan: '22.6 m',
      height: '3.4 m'
    },
    training_requirements: {
      minimum_hours: 500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 8,
      flight_hours: 4
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['300 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b314',
    manufacturer_id: 'boeing',
    model: '314 Clipper',
    category: 'legacy',
    subcategory: 'flying-boat',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    sketchfab_id: 'm4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3',
    description: 'The Boeing 314 Clipper was a legendary flying boat that pioneered transoceanic passenger service in the 1930s-40s. In legacy-retired status, it represented the golden age of luxury air travel before WWII.',
    first_flight: 1938,
    specifications: {
      max_takeoff_weight: '38,000 kg',
      cruising_speed: '184 knots',
      range: '5,200 km',
      capacity: 68,
      engines: 4,
      engine_type: 'Twin Wasp',
      length: '32.3 m',
      wingspan: '46.3 m',
      height: '6.1 m'
    },
    training_requirements: {
      minimum_hours: 1000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 60,
      simulator_hours: 12,
      flight_hours: 6
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Miami', 'Seattle', 'Singapore', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'f15ex',
    manufacturer_id: 'boeing',
    model: 'F-15EX Eagle II',
    category: 'military',
    subcategory: 'combat-stealth',
    image: '/images/manufacturers/boeing/boeing-f-15ex_eagle_ii.jpg',
    sketchfab_id: 'n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4',
    description: 'The F-15EX Eagle II is the latest iteration of the iconic F-15 Eagle, featuring advanced avionics, weapons systems, and improved range. A modern multirole fighter serving as the backbone of air superiority operations.',
    first_flight: 2021,
    specifications: {
      max_takeoff_weight: '36,700 kg',
      cruising_speed: 'Mach 2.5',
      range: '4,500 km',
      capacity: 2,
      engines: 2,
      engine_type: 'F110-GE-129',
      length: '19.4 m',
      wingspan: '13.1 m',
      height: '5.6 m'
    },
    training_requirements: {
      minimum_hours: 1000,
      required_licenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 200,
      simulator_hours: 40,
      flight_hours: 20
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['St. Louis', 'Eglin AFB', 'Nellis AFB'],
      features: ['6-DOF Motion', 'Combat Visual System', 'Weapons Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Combat Instructor rating']
      }
    ],
    certification: {
      authority: 'USAF',
      validity: '2 years',
      renewal_requirements: ['Combat currency', 'Proficiency check', 'Weapons qualification']
    }
  },
  {
    id: 'fa18f',
    manufacturer_id: 'boeing',
    model: 'F/A-18E/F Super Hornet',
    category: 'military',
    subcategory: 'combat-stealth',
    image: '/images/manufacturers/boeing/boeing-f_a-18f_super_hornet.jpg',
    sketchfab_id: 'o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5',
    description: 'The F/A-18E/F Super Hornet is a multirole fighter serving as the primary strike fighter for the US Navy and Marine Corps. Features advanced avionics, AESA radar, and extended range capabilities.',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '29,900 kg',
      cruising_speed: 'Mach 1.8',
      range: '3,300 km',
      capacity: 2,
      engines: 2,
      engine_type: 'F414-GE-400',
      length: '18.3 m',
      wingspan: '13.6 m',
      height: '4.9 m'
    },
    training_requirements: {
      minimum_hours: 800,
      required_licenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 180,
      simulator_hours: 36,
      flight_hours: 18
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Pensacola', 'Lemoore', 'Oceana'],
      features: ['6-DOF Motion', 'Carrier Visual System', 'Weapons Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['800 hours on type', 'TRI certification', 'Carrier Instructor rating']
      }
    ],
    certification: {
      authority: 'USN/USMC',
      validity: '2 years',
      renewal_requirements: ['Carrier currency', 'Proficiency check', 'Weapons qualification']
    }
  },
  {
    id: 'b52h',
    manufacturer_id: 'boeing',
    model: 'B-52H Stratofortress',
    category: 'military',
    subcategory: 'transport-tanker',
    image: '/images/manufacturers/boeing/boeing-b-52h_stratofortress.jpg',
    sketchfab_id: 'p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6',
    description: 'The B-52H Stratofortress is a legendary strategic bomber scheduled to fly until 2050+. With continuous upgrades, it remains the backbone of US strategic bombing capabilities and will serve for over 90 years.',
    first_flight: 1961,
    specifications: {
      max_takeoff_weight: '220,000 kg',
      cruising_speed: 'Mach 0.84',
      range: '14,200 km',
      capacity: 5,
      engines: 8,
      engine_type: 'TF33-P-3/103',
      length: '48.5 m',
      wingspan: '56.4 m',
      height: '12.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 250,
      simulator_hours: 50,
      flight_hours: 25
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Barksdale AFB', 'Minot AFB', 'Offutt AFB'],
      features: ['6-DOF Motion', 'Strategic Visual System', 'Weapons Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1500 hours on type', 'TRI certification', 'Strategic Instructor rating']
      }
    ],
    certification: {
      authority: 'USAF',
      validity: '2 years',
      renewal_requirements: ['Strategic currency', 'Proficiency check', 'Weapons qualification']
    }
  },
  {
    id: 'c17',
    manufacturer_id: 'boeing',
    model: 'C-17 Globemaster III',
    category: 'military',
    subcategory: 'transport-tanker',
    image: '/images/manufacturers/boeing/boeing-c-17_globemaster_iii.jpg',
    sketchfab_id: 'q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7',
    description: 'The C-17 Globemaster III is a large military transport aircraft capable of rapid strategic delivery of troops and cargo to main operating bases or forward operating bases worldwide. Active in service with global air forces. There are an estimated 3,800 to 4,500 active military pilots globally who are fully certified to fly the Boeing C-17 Globemaster III.',
    first_flight: 1991,
    specifications: {
      max_takeoff_weight: '285,700 kg',
      cruising_speed: 'Mach 0.74',
      range: '11,480 km',
      capacity: 102,
      engines: 4,
      engine_type: 'F117-PW-100',
      length: '53.0 m',
      wingspan: '51.8 m',
      height: '16.8 m'
    },
    training_requirements: {
      minimum_hours: 1200,
      required_licenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 200,
      simulator_hours: 40,
      flight_hours: 20
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Charleston AFB', 'Travis AFB', 'McChord AFB'],
      features: ['6-DOF Motion', 'Cargo Visual System', 'Airdrop Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Cargo Instructor rating']
      }
    ],
    certification: {
      authority: 'USAF/USAFR/ANG',
      validity: '2 years',
      renewal_requirements: ['Cargo currency', 'Proficiency check', 'Airdrop qualification']
    }
  },
  {
    id: 'ah64',
    manufacturer_id: 'boeing',
    model: 'AH-64 Apache',
    category: 'helicopter',
    subcategory: 'attack-helicopter',
    image: '/images/manufacturers/boeing/boeing-ah-64_apache.jpg',
    sketchfab_id: 'r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8',
    description: 'The AH-64 Apache is the world\'s most advanced multi-role combat helicopter. With advanced avionics, weapons systems, and night vision capabilities, it serves as the primary attack helicopter for the US Army and allied forces. There are an estimated 3,400 to 4,200 active military aviators globally who are fully certified to fly the Boeing AH-64 Apache attack helicopter.',
    first_flight: 1975,
    specifications: {
      max_takeoff_weight: '10,400 kg',
      cruising_speed: '145 knots',
      range: '480 km',
      capacity: 2,
      engines: 2,
      engine_type: 'T700-GE-701C',
      length: '17.7 m',
      wingspan: '5.2 m',
      height: '3.9 m'
    },
    training_requirements: {
      minimum_hours: 500,
      required_licenses: ['CPL', 'IR', 'Helicopter Rating', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 120,
      simulator_hours: 30,
      flight_hours: 15
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Fort Rucker', 'Fort Hood', 'Fort Campbell'],
      features: ['6-DOF Motion', 'Combat Visual System', 'Weapons Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Combat Instructor rating']
      }
    ],
    certification: {
      authority: 'US Army',
      validity: '2 years',
      renewal_requirements: ['Combat currency', 'Proficiency check', 'Weapons qualification']
    }
  },
  {
    id: 'ch47',
    manufacturer_id: 'boeing',
    model: 'CH-47 Chinook',
    category: 'helicopter',
    subcategory: 'heavy-lift-helicopter',
    image: '/images/manufacturers/boeing/boeing-ch-47_chinook.jpg',
    sketchfab_id: 's0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9',
    description: 'The CH-47 Chinook is a tandem-rotor heavy-lift helicopter serving as the primary transport helicopter for the US Army and allied forces. Known for its exceptional lifting capacity and versatility in combat operations. There are an estimated 3,200 to 3,800 active military aviators globally who are fully certified to fly the Boeing CH-47 Chinook heavy-lift helicopter.',
    first_flight: 1961,
    specifications: {
      max_takeoff_weight: '22,680 kg',
      cruising_speed: '160 knots',
      range: '740 km',
      capacity: 33,
      engines: 2,
      engine_type: 'T55-L-714',
      length: '15.5 m',
      wingspan: '18.3 m',
      height: '5.7 m'
    },
    training_requirements: {
      minimum_hours: 600,
      required_licenses: ['CPL', 'IR', 'Helicopter Rating', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 100,
      simulator_hours: 25,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Fort Rucker', 'Fort Hood', 'Fort Campbell'],
      features: ['6-DOF Motion', 'Tandem Rotor Simulation', 'External Load Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['600 hours on type', 'TRI certification', 'Heavy Lift Instructor rating']
      }
    ],
    certification: {
      authority: 'US Army',
      validity: '2 years',
      renewal_requirements: ['Heavy lift currency', 'Proficiency check', 'External load qualification']
    }
  },
  {
    id: 'p8',
    manufacturer_id: 'boeing',
    model: 'P-8 Poseidon',
    category: 'military',
    subcategory: 'surveillance-uas',
    image: '/images/manufacturers/boeing/boeing-p-8_poseidon.jpg',
    sketchfab_id: 't1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9v0',
    description: 'The P-8 Poseidon is a military maritime patrol aircraft based on the 737-800ERX. Active in service with the US Navy and allied forces for anti-submarine warfare, anti-surface warfare, and intelligence gathering.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '85,820 kg',
      cruising_speed: 'Mach 0.74',
      range: '8,300 km',
      capacity: 9,
      engines: 2,
      engine_type: 'CFM56-7B',
      length: '39.5 m',
      wingspan: '37.6 m',
      height: '12.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 200,
      simulator_hours: 40,
      flight_hours: 20
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Jacksonville', 'Whidbey Island', 'Sigonella'],
      features: ['6-DOF Motion', 'Maritime Visual System', 'Sonar Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Maritime Patrol Instructor rating']
      }
    ],
    certification: {
      authority: 'USN',
      validity: '2 years',
      renewal_requirements: ['Maritime patrol currency', 'Proficiency check', 'ASW qualification']
    }
  },
  {
    id: 'kc46',
    manufacturer_id: 'boeing',
    model: 'KC-46 Pegasus',
    category: 'military',
    subcategory: 'transport-tanker',
    image: '/images/manufacturers/boeing/boeing-kc-46_pegasus.jpg',
    sketchfab_id: 'u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9v0w1',
    description: 'The KC-46 Pegasus is a military aerial refueling and strategic military transport aircraft based on the 767-200ER. Active in service with the USAF and allied forces, replacing the aging KC-135 Stratotanker fleet.',
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '188,200 kg',
      cruising_speed: 'Mach 0.82',
      range: '12,200 km',
      capacity: 58,
      engines: 2,
      engine_type: 'CF6-80C2B7F',
      length: '50.5 m',
      wingspan: '47.6 m',
      height: '15.9 m'
    },
    training_requirements: {
      minimum_hours: 1200,
      required_licenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 180,
      simulator_hours: 36,
      flight_hours: 18
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['McConnell AFB', 'Altus AFB', 'Travis AFB'],
      features: ['6-DOF Motion', 'Refueling Boom Simulation', 'Cargo Visual System']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Refueling Instructor rating']
      }
    ],
    certification: {
      authority: 'USAF',
      validity: '2 years',
      renewal_requirements: ['Refueling currency', 'Proficiency check', 'Boom qualification']
    }
  },
  {
    id: 'v22',
    manufacturer_id: 'boeing',
    model: 'V-22 Osprey',
    category: 'helicopter',
    subcategory: 'tiltrotor',
    image: '/images/manufacturers/boeing/boeing-v-22_osprey.jpg',
    sketchfab_id: 'v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9v0w1x2',
    description: 'The V-22 Osprey is a multi-mission, tiltrotor military aircraft with both vertical takeoff and landing (VTOL), and short takeoff and landing (STOL) capabilities. Joint development with Bell, serving USMC, USAF, and USN.',
    first_flight: 1989,
    specifications: {
      max_takeoff_weight: '27,400 kg',
      cruising_speed: '240 knots',
      range: '1,700 km',
      capacity: 24,
      engines: 2,
      engine_type: 'Rolls-Royce T406',
      length: '17.5 m',
      wingspan: '14.0 m',
      height: '6.7 m'
    },
    training_requirements: {
      minimum_hours: 800,
      required_licenses: ['CPL', 'IR', 'Helicopter Rating', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 150,
      simulator_hours: 35,
      flight_hours: 17
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['New River', 'Camp Pendleton', 'Hurlburt Field'],
      features: ['6-DOF Motion', 'Tiltrotor Simulation', 'Ship Visual System']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['800 hours on type', 'TRI certification', 'Tiltrotor Instructor rating']
      }
    ],
    certification: {
      authority: 'USMC/USAF/USN',
      validity: '2 years',
      renewal_requirements: ['Tiltrotor currency', 'Proficiency check', 'VTOL qualification']
    }
  },
  {
    id: 'b17',
    manufacturer_id: 'boeing',
    model: 'B-17 Flying Fortress',
    category: 'military',
    subcategory: 'combat-stealth',
    image: '/images/manufacturers/boeing/boeing-b-17_flying_fortress.jpg',
    sketchfab_id: 'w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9v0w1x2y3',
    description: 'The B-17 Flying Fortress was a four-engine heavy bomber developed in the 1930s for the US Army Air Corps. A historical WWII icon that played a crucial role in the strategic bombing campaign over Europe.',
    first_flight: 1935,
    specifications: {
      max_takeoff_weight: '29,700 kg',
      cruising_speed: '180 knots',
      range: '3,200 km',
      capacity: 10,
      engines: 4,
      engine_type: 'Wright R-1820 Cyclone',
      length: '22.7 m',
      wingspan: '31.6 m',
      height: '5.8 m'
    },
    training_requirements: {
      minimum_hours: 500,
      required_licenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 80,
      simulator_hours: 16,
      flight_hours: 8
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Historical Museums'],
      features: ['6-DOF Motion', 'WWII Visual System', 'Bombing Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['300 hours on type', 'TRI certification', 'Historical Aircraft Instructor rating']
      }
    ],
    certification: {
      authority: 'Historical',
      validity: '2 years',
      renewal_requirements: ['Historical currency', 'Proficiency check', 'Historical aircraft qualification']
    }
  },
  {
    id: 'b29',
    manufacturer_id: 'boeing',
    model: 'B-29 Superfortress',
    category: 'military',
    subcategory: 'combat-stealth',
    image: '/images/manufacturers/boeing/boeing-b-29_superfortress.jpg',
    sketchfab_id: 'x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9v0w1x2y3z4',
    description: 'The B-29 Superfortress was a four-engine heavy bomber used by the US in WWII and Korea. The most advanced bomber of its time, it introduced pressurized cabins, remote-controlled turrets, and advanced fire control systems.',
    first_flight: 1942,
    specifications: {
      max_takeoff_weight: '60,000 kg',
      cruising_speed: '220 knots',
      range: '5,200 km',
      capacity: 11,
      engines: 4,
      engine_type: 'Wright R-3350 Duplex-Cyclone',
      length: '30.2 m',
      wingspan: '43.1 m',
      height: '8.5 m'
    },
    training_requirements: {
      minimum_hours: 800,
      required_licenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Historical Museums'],
      features: ['6-DOF Motion', 'WWII Visual System', 'Bombing Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Historical Aircraft Instructor rating']
      }
    ],
    certification: {
      authority: 'Historical',
      validity: '2 years',
      renewal_requirements: ['Historical currency', 'Proficiency check', 'Historical aircraft qualification']
    }
  },
  {
    id: 'f86',
    manufacturer_id: 'boeing',
    model: 'F-86 Sabre',
    category: 'military',
    subcategory: 'combat-stealth',
    image: '/images/manufacturers/boeing/boeing-f-86_sabre.jpg',
    sketchfab_id: 'y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p4q5r6s7t8u9v0w1x2y3z4a5',
    description: 'The F-86 Sabre was a transonic jet fighter aircraft produced by North American Aviation (acquired by Rockwell, later Boeing). A historical Korean War icon and the first swept-wing fighter in the US inventory.',
    first_flight: 1947,
    specifications: {
      max_takeoff_weight: '8,200 kg',
      cruising_speed: 'Mach 0.86',
      range: '2,500 km',
      capacity: 1,
      engines: 1,
      engine_type: 'J47-GE-27',
      length: '11.4 m',
      wingspan: '11.3 m',
      height: '4.5 m'
    },
    training_requirements: {
      minimum_hours: 400,
      required_licenses: ['CPL', 'IR', 'ME', 'Military Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 5',
      ground_school_hours: 60,
      simulator_hours: 15,
      flight_hours: 7
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Historical Museums'],
      features: ['6-DOF Motion', 'Korean War Visual System', 'Combat Simulation']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['300 hours on type', 'TRI certification', 'Historical Aircraft Instructor rating']
      }
    ],
    certification: {
      authority: 'Historical',
      validity: '2 years',
      renewal_requirements: ['Historical currency', 'Proficiency check', 'Historical aircraft qualification']
    }
  },
  // Tecnam
  {
    id: 'tecnam-p92',
    manufacturer_id: 'tecnam',
    model: 'Tecnam P92',
    category: 'private',
    image: '/images/manufacturers/tecnam/tecnam-tecnam_p92.jpg',
    sketchfab_id: '4b1c90cce7f14fa3bcbade0bb8c3d855',
    description: 'The Tecnam P92 is a high-wing, single-engine, light sport aircraft. It is designed for touring and flight training.',
    first_flight: 1993,
    specifications: {
      max_takeoff_weight: '600 kg',
      cruising_speed: '110 knots',
      range: '1,200 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Rotax 912',
      length: '6.6 m',
      wingspan: '8.5 m',
      height: '2.5 m'
    },
    training_requirements: {
      minimum_hours: 30,
      required_licenses: ['PPL', 'LSA'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 30,
      simulator_hours: 5,
      flight_hours: 30
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Flight Training Device',
      locations: ['Capua', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructor_qualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '2 years',
      renewal_requirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'tecnam-p2002',
    manufacturer_id: 'tecnam',
    model: 'Tecnam P2002 Sierra',
    category: 'private',
    image: '/images/manufacturers/tecnam/tecnam-tecnam_p2002_sierra.jpg',
    sketchfab_id: '5325a60e1c2f402a8b5b71656ffaea66',
    description: 'The Tecnam P2002 Sierra is a low-wing, single-engine, light sport aircraft. It is designed for touring and flight training.',
    first_flight: 2003,
    specifications: {
      max_takeoff_weight: '600 kg',
      cruising_speed: '120 knots',
      range: '1,100 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Rotax 912',
      length: '7.0 m',
      wingspan: '8.6 m',
      height: '2.4 m'
    },
    training_requirements: {
      minimum_hours: 30,
      required_licenses: ['PPL', 'LSA'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 30,
      simulator_hours: 5,
      flight_hours: 30
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Flight Training Device',
      locations: ['Capua', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructor_qualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '2 years',
      renewal_requirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'tecnam-p2006t',
    manufacturer_id: 'tecnam',
    model: 'Tecnam P2006T',
    category: 'private',
    image: '/images/manufacturers/tecnam/tecnam-tecnam_p2006t.jpg',
    sketchfab_id: 'a0a4d717a8c94a17b958eb69c4efc352',
    description: 'The Tecnam P2006T is a twin-engine, high-wing, light aircraft. It is designed for multi-engine training and utility operations.',
    first_flight: 2007,
    specifications: {
      max_takeoff_weight: '1,180 kg',
      cruising_speed: '140 knots',
      range: '1,300 km',
      capacity: 6,
      engines: 2,
      engine_type: 'Lycoming IO-360',
      length: '8.7 m',
      wingspan: '11.4 m',
      height: '2.9 m'
    },
    training_requirements: {
      minimum_hours: 100,
      required_licenses: ['PPL', 'ME'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 10,
      flight_hours: 15
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Flight Training Device',
      locations: ['Capua', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructor_qualifications: [
      {
        type: 'MEI',
        requirements: ['Commercial Pilot', 'Multi-Engine Instructor Rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '2 years',
      renewal_requirements: ['Flight Review', 'BFR']
    }
  },
  // Piper
  {
    id: 'piper-pa28',
    manufacturer_id: 'piper',
    model: 'Piper PA-28 Cherokee',
    category: 'private',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    sketchfab_id: 'e39b3679c3a94053a53c4be4eff548bc',
    description: 'The Piper PA-28 Cherokee is a family of two-seat or four-seat, light aircraft. It is widely used for flight training.',
    first_flight: 1960,
    specifications: {
      max_takeoff_weight: '1,157 kg',
      cruising_speed: '127 knots',
      range: '1,480 km',
      capacity: 4,
      engines: 1,
      engine_type: 'Lycoming O-320',
      length: '7.3 m',
      wingspan: '10.0 m',
      height: '2.2 m'
    },
    training_requirements: {
      minimum_hours: 40,
      required_licenses: ['PPL'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 10,
      flight_hours: 40
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Flight Training Device',
      locations: ['Vero Beach', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructor_qualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewal_requirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'piper-pa18',
    manufacturer_id: 'piper',
    model: 'Piper PA-18 Super Cub',
    category: 'private',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    sketchfab_id: '947504c5e11244db8d512f1511e75e4b',
    description: 'The Piper PA-18 Super Cub is a two-seat, single-engine, taildragger aircraft. It is popular for bush flying and backcountry operations.',
    first_flight: 1949,
    specifications: {
      max_takeoff_weight: '794 kg',
      cruising_speed: '97 knots',
      range: '760 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Lycoming O-320',
      length: '6.9 m',
      wingspan: '10.7 m',
      height: '2.0 m'
    },
    training_requirements: {
      minimum_hours: 40,
      required_licenses: ['PPL', 'Tailwheel'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 10,
      flight_hours: 40
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Flight Training Device',
      locations: ['Vero Beach', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructor_qualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating', 'Tailwheel Experience']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewal_requirements: ['Flight Review', 'BFR']
    }
  },
  // Embraer
  {
    id: 'embraer-e190',
    manufacturer_id: 'embraer',
    model: 'Embraer E190',
    category: 'regional',
    image: '/images/manufacturers/embraer/embraer-embraer_e190.jpg',
    sketchfab_id: 'b971aca02af4435db7104c8c2ce9bbdd',
    description: 'The Embraer E190 is a medium-range, twin-engine, narrow-body jet airliner. It is part of the E-Jet family.',
    first_flight: 2004,
    specifications: {
      max_takeoff_weight: '51,800 kg',
      cruising_speed: 'Mach 0.82',
      range: '4,540 km',
      capacity: 114,
      engines: 2,
      engine_type: 'CF34-10E',
      length: '36.2 m',
      wingspan: '28.7 m',
      height: '10.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['São Paulo', 'Miami', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'embraer-phenom-300',
    manufacturer_id: 'embraer',
    model: 'Embraer Phenom 300',
    category: 'private',
    image: '/images/manufacturers/embraer/embraer-embraer_phenom_300.jpg',
    sketchfab_id: 'cdc1ecc85bf345b788e0094f2fb7e91e',
    description: 'The Embraer Phenom 300 is a light jet aircraft. It is one of the best-selling light jets in the world.',
    first_flight: 2008,
    specifications: {
      max_takeoff_weight: '7,969 kg',
      cruising_speed: 'Mach 0.80',
      range: '3,650 km',
      capacity: 9,
      engines: 2,
      engine_type: 'Pratt & Whitney Canada PW535E',
      length: '15.9 m',
      wingspan: '16.2 m',
      height: '5.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['São Paulo', 'Miami', 'Orlando'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Cirrus
  {
    id: 'cirrus-sr22',
    manufacturer_id: 'cirrus',
    model: 'Cirrus SR22',
    category: 'private',
    image: '/images/manufacturers/cirrus/cirrus-cirrus_sr22.jpg',
    sketchfab_id: 'cba602c99c524cd4b40e5c2e5f9c5b4f',
    description: 'The Cirrus SR22 is a single-engine, composite aircraft. It is known for its ballistic parachute recovery system.',
    first_flight: 2001,
    specifications: {
      max_takeoff_weight: '1,542 kg',
      cruising_speed: '183 knots',
      range: '1,870 km',
      capacity: 4,
      engines: 1,
      engine_type: 'Continental IO-550',
      length: '7.9 m',
      wingspan: '11.7 m',
      height: '2.8 m'
    },
    training_requirements: {
      minimum_hours: 40,
      required_licenses: ['PPL'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 40,
      simulator_hours: 10,
      flight_hours: 40
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Flight Training Device',
      locations: ['Duluth', 'Various'],
      features: ['Visual System', 'Instrument Panel', 'CAPS Simulation']
    },
    instructor_qualifications: [
      {
        type: 'CSIP',
        requirements: ['Commercial Pilot', 'Cirrus Standardized Instructor Program']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '2 years',
      renewal_requirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'cirrus-vision-sf50',
    manufacturer_id: 'cirrus',
    model: 'Cirrus Vision SF50',
    category: 'private',
    image: '/images/manufacturers/cirrus/cirrus-cirrus_vision_sf50.jpg',
    sketchfab_id: 'd46dd06b4b5646acaed90993db34d639',
    description: 'The Cirrus Vision SF50 is a single-engine, very light jet. It is the first single-engine jet to receive FAA certification.',
    first_flight: 2008,
    specifications: {
      max_takeoff_weight: '2,722 kg',
      cruising_speed: 'Mach 0.75',
      range: '2,240 km',
      capacity: 5,
      engines: 1,
      engine_type: 'Williams FJ33',
      length: '9.4 m',
      wingspan: '11.0 m',
      height: '3.0 m'
    },
    training_requirements: {
      minimum_hours: 500,
      required_licenses: ['PPL', 'Jet Rating'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 60,
      simulator_hours: 15,
      flight_hours: 15
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Duluth', 'Various'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'CSIP',
        requirements: ['Commercial Pilot', 'Cirrus Standardized Instructor Program', 'Jet Experience']
      }
    ],
    certification: {
      authority: 'FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // ATR
  {
    id: 'atr-72-600',
    manufacturer_id: 'atr',
    model: 'ATR 72-600',
    category: 'regional',
    image: '/images/manufacturers/atr/atr-atr_72-600.jpg',
    sketchfab_id: '1e1a7186f7444d288675262fcee44744',
    description: 'The ATR 72-600 is a twin-engine turboprop regional airliner. It is an upgraded version of the ATR 72 with improved performance and avionics.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '23,000 kg',
      cruising_speed: '280 knots',
      range: '1,525 km',
      capacity: 78,
      engines: 2,
      engine_type: 'Pratt & Whitney Canada PW127M',
      length: '27.2 m',
      wingspan: '27.1 m',
      height: '7.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Toulouse', 'Various'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Let
  {
    id: 'let-l410',
    manufacturer_id: 'let',
    model: 'Let L410 Turbolet',
    category: 'regional',
    image: '/images/manufacturers/let/let-let_l410_turbolet.jpg',
    sketchfab_id: '38c3aaea4de54eb1a20634586c2a215f',
    description: 'The Let L410 Turbolet is a twin-engine turboprop regional airliner. It is widely used in Eastern Europe and Africa.',
    first_flight: 1969,
    specifications: {
      max_takeoff_weight: '6,600 kg',
      cruising_speed: '170 knots',
      range: '1,510 km',
      capacity: 19,
      engines: 2,
      engine_type: 'Walter M601',
      length: '14.4 m',
      wingspan: '19.5 m',
      height: '5.8 m'
    },
    training_requirements: {
      minimum_hours: 1000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 16,
      flight_hours: 8
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Kunovice', 'Various'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Gulfstream
  {
    id: 'gulfstream-g650',
    manufacturer_id: 'gulfstream',
    model: 'Gulfstream G650',
    category: 'private',
    image: '/images/manufacturers/gulfstream/gulfstream-gulfstream_g650.jpg',
    sketchfab_id: '67451e56d38746de86667347d7a56587',
    description: 'The Gulfstream G650 is a long-range, large-cabin business jet. It is one of the fastest business jets in production.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '45,359 kg',
      cruising_speed: 'Mach 0.925',
      range: '13,890 km',
      capacity: 19,
      engines: 2,
      engine_type: 'Rolls-Royce BR725',
      length: '30.4 m',
      wingspan: '28.0 m',
      height: '7.9 m'
    },
    training_requirements: {
      minimum_hours: 3000,
      required_licenses: ['CPL', 'IR', 'ME', 'ATPL'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 120,
      simulator_hours: 30,
      flight_hours: 15
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Savannah', 'London', 'Dubai', 'Singapore'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['1000 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Bombardier
  {
    id: 'challenger-350',
    manufacturer_id: 'bombardier',
    model: 'Bombardier Challenger 350',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-bombardier_challenger_350.jpg',
    sketchfab_id: '5f7af63167374f98a3a457f38818b996',
    description: 'The Bombardier Challenger 350 is a super mid-size business jet. It offers a spacious cabin and long-range capabilities.',
    first_flight: 2013,
    specifications: {
      max_takeoff_weight: '18,597 kg',
      cruising_speed: 'Mach 0.83',
      range: '5,926 km',
      capacity: 10,
      engines: 2,
      engine_type: 'GE CF34-3B',
      length: '20.9 m',
      wingspan: '19.5 m',
      height: '6.3 m'
    },
    training_requirements: {
      minimum_hours: 2000,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 25,
      flight_hours: 12
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Montreal', 'Dallas', 'London'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['750 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA / Transport Canada',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'crj-700',
    manufacturer_id: 'bombardier',
    model: 'CRJ-700',
    category: 'regional',
    image: '/images/manufacturers/bombardier/bombardier-crj-700.jpg',
    sketchfab_id: '98e4de0ba2b6489c896f224fb70c5e75',
    description: 'The CRJ-700 is a regional jet airliner. It is part of the CRJ series of regional jets.',
    first_flight: 1999,
    specifications: {
      max_takeoff_weight: '32,885 kg',
      cruising_speed: 'Mach 0.82',
      range: '3,720 km',
      capacity: 78,
      engines: 2,
      engine_type: 'GE CF34-8C5',
      length: '32.2 m',
      wingspan: '23.2 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 100,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Montreal', 'Dallas', 'Various'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'FAA / EASA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  // Aeroprakt
  {
    id: 'aeroprakt-a22',
    manufacturer_id: 'aeroprakt',
    model: 'Aeroprakt A22 Foxbat',
    category: 'private',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    sketchfab_id: '881d2479d29149b7bf2b5788b869094f',
    description: 'The Aeroprakt A22 Foxbat is a light sport aircraft. It is designed for touring and flight training.',
    first_flight: 1996,
    specifications: {
      max_takeoff_weight: '600 kg',
      cruising_speed: '90 knots',
      range: '1,000 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Rotax 912',
      length: '6.5 m',
      wingspan: '8.4 m',
      height: '2.3 m'
    },
    training_requirements: {
      minimum_hours: 30,
      required_licenses: ['PPL', 'LSA'],
      medical_certificate: 'Class 2',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 30,
      simulator_hours: 5,
      flight_hours: 30
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Flight Training Device',
      locations: ['Kyiv', 'Various'],
      features: ['Visual System', 'Instrument Panel']
    },
    instructor_qualifications: [
      {
        type: 'CFI',
        requirements: ['Commercial Pilot', 'Instructor Rating']
      }
    ],
    certification: {
      authority: 'EASA',
      validity: '2 years',
      renewal_requirements: ['Flight Review', 'BFR']
    }
  },
  {
    id: 'falcon-8x',
    manufacturer_id: 'dassault-falcon',
    model: 'Falcon 8X',
    category: 'private',
    image: '/images/manufacturers/dassault-falcon/dassault-falcon-falcon_8x.jpg',
    description: 'The Dassault Falcon 8X is an ultra-long-range business jet with three engines. It offers a spacious cabin, intercontinental range, and excellent short-field performance.',
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '33,113 kg',
      cruising_speed: 'Mach 0.85',
      range: '11,945 km',
      capacity: 14,
      engines: 3,
      engine_type: 'Pratt & Whitney Canada PW307D',
      length: '24.46 m',
      wingspan: '26.29 m',
      height: '7.94 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'falcon-7x',
    manufacturer_id: 'dassault-falcon',
    model: 'Falcon 7X',
    category: 'private',
    image: '/images/manufacturers/dassault-falcon/dassault-falcon-falcon_7x.jpg',
    description: 'The Dassault Falcon 7X is a large-cabin, long-range business jet. It was the first business jet with a digital flight control system.',
    first_flight: 2005,
    specifications: {
      max_takeoff_weight: '31,751 kg',
      cruising_speed: 'Mach 0.85',
      range: '11,019 km',
      capacity: 14,
      engines: 3,
      engine_type: 'Pratt & Whitney Canada PW307A',
      length: '23.38 m',
      wingspan: '26.21 m',
      height: '7.83 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'falcon-900',
    manufacturer_id: 'dassault-falcon',
    model: 'Falcon 900',
    category: 'private',
    image: '/images/manufacturers/dassault-falcon/dassault-falcon-falcon_900.jpg',
    description: 'The Dassault Falcon 900 is a long-range trijet business aircraft. It is known for its reliability and long-range capability.',
    first_flight: 1984,
    specifications: {
      max_takeoff_weight: '22,225 kg',
      cruising_speed: 'Mach 0.84',
      range: '8,890 km',
      capacity: 12,
      engines: 3,
      engine_type: 'Honeywell TFE731-5',
      length: '20.21 m',
      wingspan: '19.33 m',
      height: '7.55 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'pc-12',
    manufacturer_id: 'pilatus',
    model: 'PC-12',
    category: 'private',
    image: '/images/manufacturers/pilatus/pilatus-pc-12.jpg',
    description: 'The Pilatus PC-12 is a single-engine turboprop aircraft. It is popular for corporate transport, air ambulance, and regional airline operations.',
    first_flight: 1991,
    specifications: {
      max_takeoff_weight: '4,740 kg',
      cruising_speed: '528 km/h',
      range: '3,426 km',
      capacity: 11,
      engines: 1,
      engine_type: 'Pratt & Whitney Canada PT6A-67B',
      length: '14.4 m',
      wingspan: '16.28 m',
      height: '4.26 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'pc-24',
    manufacturer_id: 'pilatus',
    model: 'PC-24',
    category: 'private',
    image: '/images/manufacturers/pilatus/pilatus-pc-24.jpg',
    description: 'The Pilatus PC-24 is a light business jet capable of operating from short and unpaved runways. It is known as the "Super Versatile Jet".',
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '8,300 kg',
      cruising_speed: '815 km/h',
      range: '3,704 km',
      capacity: 11,
      engines: 2,
      engine_type: 'Williams FJ44-4A',
      length: '16.8 m',
      wingspan: '17.0 m',
      height: '5.35 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'pc-21',
    manufacturer_id: 'pilatus',
    model: 'PC-21',
    category: 'military',
    image: '/images/manufacturers/pilatus/pilatus-pc-21.jpg',
    description: 'The Pilatus PC-21 is a turboprop military trainer aircraft. It is used by air forces around the world for pilot training.',
    first_flight: 2002,
    specifications: {
      max_takeoff_weight: '4,250 kg',
      cruising_speed: '685 km/h',
      range: '1,333 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Pratt & Whitney Canada PT6A-68B',
      length: '11.23 m',
      wingspan: '9.34 m',
      height: '3.74 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'king-air-350',
    manufacturer_id: 'beechcraft',
    model: 'King Air 350',
    category: 'private',
    image: '/images/manufacturers/beechcraft/beechcraft-king_air_350.jpg',
    description: 'The Beechcraft King Air 350 is a twin-turboprop aircraft. It is one of the most popular business turboprops in the world.',
    first_flight: 1988,
    specifications: {
      max_takeoff_weight: '7,484 kg',
      cruising_speed: '577 km/h',
      range: '3,338 km',
      capacity: 11,
      engines: 2,
      engine_type: 'Pratt & Whitney Canada PT6A-60A',
      length: '14.22 m',
      wingspan: '16.61 m',
      height: '4.37 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'baron-g58',
    manufacturer_id: 'beechcraft',
    model: 'Baron G58',
    category: 'private',
    image: '/images/manufacturers/beechcraft/beechcraft-baron_g58.jpg',
    description: 'The Beechcraft Baron G58 is a twin-engine piston aircraft. It is a popular light twin for personal and business aviation.',
    first_flight: 1960,
    specifications: {
      max_takeoff_weight: '2,500 kg',
      cruising_speed: '368 km/h',
      range: '1,555 km',
      capacity: 6,
      engines: 2,
      engine_type: 'Continental IO-550-C',
      length: '9.09 m',
      wingspan: '11.48 m',
      height: '3.0 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bonanza-g36',
    manufacturer_id: 'beechcraft',
    model: 'Bonanza G36',
    category: 'private',
    image: '/images/manufacturers/beechcraft/beechcraft-bonanza_g36.jpg',
    description: 'The Beechcraft Bonanza G36 is a single-engine piston aircraft. It is one of the longest-running production aircraft in history.',
    first_flight: 1949,
    specifications: {
      max_takeoff_weight: '1,657 kg',
      cruising_speed: '326 km/h',
      range: '1,864 km',
      capacity: 6,
      engines: 1,
      engine_type: 'Continental IO-550-B',
      length: '8.38 m',
      wingspan: '10.21 m',
      height: '2.62 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 's-92',
    manufacturer_id: 'sikorsky',
    model: 'S-92',
    category: 'helicopter',
    image: '/images/manufacturers/sikorsky/sikorsky-s-92.jpg',
    description: 'The Sikorsky S-92 is a twin-engine medium-lift helicopter. It is used for offshore oil transport, search and rescue, and VIP transport.',
    first_flight: 1998,
    specifications: {
      max_takeoff_weight: '12,020 kg',
      cruising_speed: '280 km/h',
      range: '1,000 km',
      capacity: 19,
      engines: 2,
      engine_type: 'General Electric CT7-8A',
      length: '17.12 m',
      wingspan: '17.17 m',
      height: '6.45 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 's-76',
    manufacturer_id: 'sikorsky',
    model: 'S-76',
    category: 'helicopter',
    image: '/images/manufacturers/sikorsky/sikorsky-s-76.jpg',
    description: 'The Sikorsky S-76 is a medium-size commercial utility helicopter. It is widely used for corporate transport, offshore oil, and air ambulance.',
    first_flight: 1977,
    specifications: {
      max_takeoff_weight: '5,306 kg',
      cruising_speed: '287 km/h',
      range: '761 km',
      capacity: 12,
      engines: 2,
      engine_type: 'Pratt & Whitney Canada PT6B-67A',
      length: '13.22 m',
      wingspan: '13.41 m',
      height: '4.42 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'uh-60-blackhawk',
    manufacturer_id: 'sikorsky',
    model: 'UH-60 Black Hawk',
    category: 'military',
    image: '/images/manufacturers/sikorsky/sikorsky-uh-60_blackhawk.jpg',
    description: 'The Sikorsky UH-60 Black Hawk is a four-blade, twin-engine, medium-lift utility helicopter. It is the primary utility helicopter of the U.S. Army.',
    first_flight: 1974,
    specifications: {
      max_takeoff_weight: '9,979 kg',
      cruising_speed: '280 km/h',
      range: '590 km',
      capacity: 11,
      engines: 2,
      engine_type: 'General Electric T700-GE-701D',
      length: '15.26 m',
      wingspan: '16.36 m',
      height: '5.13 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'aw139',
    manufacturer_id: 'leonardo',
    model: 'AW139',
    category: 'helicopter',
    image: '/images/manufacturers/leonardo/leonardo-aw139.jpg',
    description: 'The Leonardo AW139 is a 15-seat medium-lift twin-engine helicopter. It is used for offshore transport, search and rescue, and VIP transport.',
    first_flight: 2001,
    specifications: {
      max_takeoff_weight: '6,400 kg',
      cruising_speed: '306 km/h',
      range: '1,000 km',
      capacity: 15,
      engines: 2,
      engine_type: 'Pratt & Whitney Canada PT6C-67C',
      length: '13.76 m',
      wingspan: '13.80 m',
      height: '4.98 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'aw169',
    manufacturer_id: 'leonardo',
    model: 'AW169',
    category: 'helicopter',
    image: '/images/manufacturers/leonardo/leonardo-aw169.jpg',
    description: 'The Leonardo AW169 is a 10-seat light-intermediate twin-engine helicopter. It is used for EMS, law enforcement, and corporate transport.',
    first_flight: 2012,
    specifications: {
      max_takeoff_weight: '4,800 kg',
      cruising_speed: '272 km/h',
      range: '820 km',
      capacity: 10,
      engines: 2,
      engine_type: 'Pratt & Whitney Canada PW210A',
      length: '12.96 m',
      wingspan: '12.12 m',
      height: '3.60 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'aw189',
    manufacturer_id: 'leonardo',
    model: 'AW189',
    category: 'helicopter',
    image: '/images/manufacturers/leonardo/leonardo-aw189.jpg',
    description: 'The Leonardo AW189 is a long-range, heavy-lift twin-engine helicopter. It is used for offshore transport, search and rescue, and firefighting.',
    first_flight: 2011,
    specifications: {
      max_takeoff_weight: '8,300 kg',
      cruising_speed: '287 km/h',
      range: '1,111 km',
      capacity: 19,
      engines: 2,
      engine_type: 'General Electric CT7-2E1',
      length: '17.57 m',
      wingspan: '14.60 m',
      height: '5.13 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'm-346-master',
    manufacturer_id: 'leonardo',
    model: 'M-346 Master',
    category: 'military',
    image: '/images/manufacturers/leonardo/leonardo-m-346_master.jpg',
    description: 'The Leonardo M-346 Master is a military twin-engine transonic trainer aircraft. It is used for advanced pilot training and light combat roles.',
    first_flight: 2004,
    specifications: {
      max_takeoff_weight: '9,600 kg',
      cruising_speed: 'Mach 0.85',
      range: '2,722 km',
      capacity: 2,
      engines: 2,
      engine_type: 'Honeywell F124-GA-200',
      length: '11.49 m',
      wingspan: '9.72 m',
      height: '4.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'dash-8-q400',
    manufacturer_id: 'de-havilland',
    model: 'Dash 8 Q400',
    category: 'regional',
    image: '/images/manufacturers/de-havilland/de-havilland-dash_8_q400.jpg',
    description: 'The De Havilland Canada Dash 8 Q400 is a high-wing turboprop regional airliner with seating for up to 90 passengers. It is renowned for its short-field performance, fuel efficiency, and quiet operation.',
    first_flight: 1998,
    specifications: {
      max_takeoff_weight: '29,260 kg',
      cruising_speed: '667 km/h',
      range: '2,040 km',
      capacity: 90,
      engines: 2,
      engine_type: 'Pratt & Whitney Canada PW150A',
      length: '32.84 m',
      wingspan: '28.4 m',
      height: '8.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'dhc-6-twin-otter',
    manufacturer_id: 'de-havilland',
    model: 'DHC-6 Twin Otter',
    category: 'regional',
    image: '/images/manufacturers/de-havilland/de-havilland-dhc-6_twin_otter.jpg',
    description: 'The De Havilland Canada DHC-6 Twin Otter is a Canadian 19-passenger STOL utility aircraft. It is popular for skydiving, remote area operations, and commuter flights.',
    first_flight: 1965,
    specifications: {
      max_takeoff_weight: '5,670 kg',
      cruising_speed: '278 km/h',
      range: '1,427 km',
      capacity: 19,
      engines: 2,
      engine_type: 'Pratt & Whitney Canada PT6A-34',
      length: '15.77 m',
      wingspan: '19.8 m',
      height: '5.94 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'mrj90',
    manufacturer_id: 'mitsubishi-mrj',
    model: 'Mitsubishi MRJ90',
    category: 'regional',
    image: '/images/manufacturers/mitsubishi-mrj/mitsubishi-mrj-mitsubishi_mrj90.jpg',
    description: 'The Mitsubishi SpaceJet (formerly MRJ) was a regional jet program by Mitsubishi Aircraft Corporation. The MRJ90 was designed to seat 80-92 passengers with advanced fuel-efficient engines.',
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '42,800 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,770 km',
      capacity: 88,
      engines: 2,
      engine_type: 'Pratt & Whitney PW1200G',
      length: '33.6 m',
      wingspan: '29.2 m',
      height: '10.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'c919',
    manufacturer_id: 'comac-c919',
    model: 'COMAC C919',
    category: 'commercial',
    image: '/images/manufacturers/comac-c919/comac-c919-comac_c919.jpg',
    description: 'The COMAC C919 is a Chinese narrow-body airliner. It is designed to compete with the Airbus A320neo and Boeing 737 MAX families in the single-aisle market.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '72,500 kg',
      cruising_speed: 'Mach 0.785',
      range: '5,555 km',
      capacity: 168,
      engines: 2,
      engine_type: 'CFM International LEAP-1C',
      length: '38.9 m',
      wingspan: '35.8 m',
      height: '11.95 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'arj21',
    manufacturer_id: 'comac-c919',
    model: 'COMAC ARJ21',
    category: 'regional',
    image: '/images/manufacturers/comac-c919/comac-c919-comac_arj21.jpg',
    description: 'The COMAC ARJ21 is a regional jet produced by Commercial Aircraft Corporation of China. It seats 78-90 passengers and is designed for short to medium-haul routes.',
    first_flight: 2008,
    specifications: {
      max_takeoff_weight: '43,500 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,700 km',
      capacity: 90,
      engines: 2,
      engine_type: 'General Electric CF34-10A',
      length: '33.46 m',
      wingspan: '27.28 m',
      height: '8.44 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
,
  {
    id: 'an-124',
    manufacturer_id: 'antonov',
    model: 'An-124 Ruslan',
    category: 'cargo',
    image: '/images/manufacturers/antonov/antonov-an-124_ruslan.jpg',
    description: 'The Antonov An-124 Ruslan is a strategic airlift, four-engined aircraft. It is one of the largest cargo aircraft in the world.',
    first_flight: 1982,
    specifications: {
      max_takeoff_weight: '402,000 kg',
      cruising_speed: '865 km/h',
      range: '3,700 km',
      capacity: 88,
      engines: 4,
      engine_type: 'Progress D-18T',
      length: '69.1 m',
      wingspan: '73.3 m',
      height: '20.78 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'an-225',
    manufacturer_id: 'antonov',
    model: 'An-225 Mriya',
    category: 'cargo',
    image: '/images/manufacturers/antonov/antonov-an-225_mriya.jpg',
    description: 'The Antonov An-225 Mriya was the largest cargo aircraft ever built. It was designed for oversized payloads and heavy lift missions.',
    first_flight: 1988,
    specifications: {
      max_takeoff_weight: '640,000 kg',
      cruising_speed: '850 km/h',
      range: '15,400 km',
      capacity: 88,
      engines: 6,
      engine_type: 'Progress D-18T',
      length: '84 m',
      wingspan: '88.4 m',
      height: '18.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'an-148',
    manufacturer_id: 'antonov',
    model: 'An-148',
    category: 'regional',
    image: '/images/manufacturers/antonov/antonov-an-148.jpg',
    description: 'The Antonov An-148 is a regional jet designed for short to medium-haul routes. It seats up to 85 passengers.',
    first_flight: 2004,
    specifications: {
      max_takeoff_weight: '43,700 kg',
      cruising_speed: '820 km/h',
      range: '3,500 km',
      capacity: 85,
      engines: 2,
      engine_type: 'Motor Sich D-436',
      length: '29.13 m',
      wingspan: '28.91 m',
      height: '8.19 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'il-96',
    manufacturer_id: 'ilyushin',
    model: 'Il-96',
    category: 'commercial',
    image: '/images/manufacturers/ilyushin/ilyushin-il-96.jpg',
    description: 'The Ilyushin Il-96 is a long-haul wide-body airliner. It is used by Russian airlines and government operators.',
    first_flight: 1988,
    specifications: {
      max_takeoff_weight: '250,000 kg',
      cruising_speed: '850 km/h',
      range: '11,500 km',
      capacity: 300,
      engines: 4,
      engine_type: 'Aviadvigatel PS-90A',
      length: '55.3 m',
      wingspan: '60.1 m',
      height: '17.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'il-76',
    manufacturer_id: 'ilyushin',
    model: 'Il-76',
    category: 'cargo',
    image: '/images/manufacturers/ilyushin/ilyushin-il-76.jpg',
    description: 'The Ilyushin Il-76 is a multi-purpose four-engine turbofan strategic airlifter. It is widely used for cargo and military transport.',
    first_flight: 1971,
    specifications: {
      max_takeoff_weight: '195,000 kg',
      cruising_speed: '850 km/h',
      range: '6,700 km',
      capacity: 126,
      engines: 4,
      engine_type: 'Aviadvigatel PS-90A',
      length: '46.59 m',
      wingspan: '50.5 m',
      height: '14.76 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'dhruv',
    manufacturer_id: 'hindustan-aeronautics',
    model: 'ALH Dhruv',
    category: 'helicopter',
    image: '/images/manufacturers/hindustan-aeronautics/hindustan-aeronautics-dhruv.jpg',
    description: 'The HAL Dhruv is a utility helicopter developed by Hindustan Aeronautics Limited. It is used by military and civilian operators in India.',
    first_flight: 1992,
    specifications: {
      max_takeoff_weight: '5,500 kg',
      cruising_speed: '250 km/h',
      range: '630 km',
      capacity: 12,
      engines: 2,
      engine_type: 'Turbomeca TM 333',
      length: '15.87 m',
      wingspan: '13.2 m',
      height: '4.98 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'tejas',
    manufacturer_id: 'hindustan-aeronautics',
    model: 'Tejas',
    category: 'military',
    image: '/images/manufacturers/hindustan-aeronautics/hindustan-aeronautics-tejas.jpg',
    description: 'The HAL Tejas is a single-engine, delta wing, multirole light fighter. It is the first Indian-designed and developed supersonic fighter.',
    first_flight: 2001,
    specifications: {
      max_takeoff_weight: '13,500 kg',
      cruising_speed: 'Mach 1.6',
      range: '1,850 km',
      capacity: 1,
      engines: 1,
      engine_type: 'General Electric F404',
      length: '13.2 m',
      wingspan: '8.2 m',
      height: '4.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'do-228',
    manufacturer_id: 'dornier',
    model: 'Do 228',
    category: 'regional',
    image: '/images/manufacturers/dornier/dornier-do_228.jpg',
    description: 'The Dornier Do 228 is a versatile, short takeoff and landing utility aircraft. It is used for commuter transport, surveillance, and maritime patrol.',
    first_flight: 1981,
    specifications: {
      max_takeoff_weight: '6,600 kg',
      cruising_speed: '370 km/h',
      range: '1,111 km',
      capacity: 19,
      engines: 2,
      engine_type: 'Garrett TPE331',
      length: '16.56 m',
      wingspan: '16.97 m',
      height: '4.86 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'do-328',
    manufacturer_id: 'dornier',
    model: 'Do 328',
    category: 'regional',
    image: '/images/manufacturers/dornier/dornier-do_328.jpg',
    description: 'The Dornier 328 is a turboprop-powered commuter airliner. It seats up to 33 passengers and is known for its short-field performance.',
    first_flight: 1991,
    specifications: {
      max_takeoff_weight: '13,990 kg',
      cruising_speed: '620 km/h',
      range: '1,852 km',
      capacity: 33,
      engines: 2,
      engine_type: 'Pratt & Whitney Canada PW119',
      length: '21.11 m',
      wingspan: '20.98 m',
      height: '7.06 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'archer-midnight',
    manufacturer_id: 'archer',
    model: 'Midnight',
    category: 'private',
    image: '/images/manufacturers/archer/archer-archer-midnight.jpg',
    description: 'The Archer Midnight is an electric vertical takeoff and landing (eVTOL) aircraft. It is designed for urban air mobility and short-range passenger transport.',
    first_flight: 2023,
    specifications: {
      max_takeoff_weight: '3,175 kg',
      cruising_speed: '240 km/h',
      range: '97 km',
      capacity: 4,
      engines: 12,
      engine_type: 'Electric motors',
      length: '12.2 m',
      wingspan: '13.4 m',
      height: '2.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'joby-s4',
    manufacturer_id: 'joby',
    model: 'S4',
    category: 'private',
    image: '/images/manufacturers/joby/joby-joby-s4.jpg',
    description: 'The Joby S4 is an all-electric eVTOL aircraft. It is designed for commercial air taxi services with near-silent operation.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '2,200 kg',
      cruising_speed: '320 km/h',
      range: '241 km',
      capacity: 4,
      engines: 6,
      engine_type: 'Electric motors',
      length: '10.1 m',
      wingspan: '11.6 m',
      height: '2.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'mlg-1',
    manufacturer_id: 'mlg',
    model: 'MLG Concept',
    category: 'private',
    image: '/images/manufacturers/mlg/mlg-mlg-1.jpg',
    description: 'Multi Level Group aviation concept aircraft for advanced urban air mobility platforms.',
    first_flight: 2025,
    specifications: {
      max_takeoff_weight: '1,500 kg',
      cruising_speed: '200 km/h',
      range: '100 km',
      capacity: 2,
      engines: 4,
      engine_type: 'Electric motors',
      length: '8 m',
      wingspan: '8 m',
      height: '2 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bell-407',
    manufacturer_id: 'bell',
    model: 'Bell 407',
    category: 'helicopter',
    image: '/images/manufacturers/bell/bell-bell-407.jpg',
    description: 'The Bell 407 is a four-blade, single-engine, civil utility helicopter. It is popular for corporate transport, EMS, and law enforcement.',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '2,268 kg',
      cruising_speed: '246 km/h',
      range: '598 km',
      capacity: 6,
      engines: 1,
      engine_type: 'Allison 250-C47B',
      length: '12.7 m',
      wingspan: '10.67 m',
      height: '3.56 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bell-429',
    manufacturer_id: 'bell',
    model: 'Bell 429',
    category: 'helicopter',
    image: '/images/manufacturers/bell/bell-bell-429.jpg',
    description: 'The Bell 429 is a twin-engine helicopter. It is used for EMS, corporate transport, and law enforcement operations.',
    first_flight: 2007,
    specifications: {
      max_takeoff_weight: '3,400 kg',
      cruising_speed: '278 km/h',
      range: '649 km',
      capacity: 7,
      engines: 2,
      engine_type: 'Pratt & Whitney Canada PW207D',
      length: '13.07 m',
      wingspan: '10.97 m',
      height: '3.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bell-505',
    manufacturer_id: 'bell',
    model: 'Bell 505',
    category: 'helicopter',
    image: '/images/manufacturers/bell/bell-bell-505.jpg',
    description: 'The Bell 505 Jet Ranger X is a light helicopter. It is used for training, tourism, and private aviation.',
    first_flight: 2013,
    specifications: {
      max_takeoff_weight: '1,668 kg',
      cruising_speed: '231 km/h',
      range: '566 km',
      capacity: 4,
      engines: 1,
      engine_type: 'Safran Arrius 2R',
      length: '12.93 m',
      wingspan: '10.49 m',
      height: '3.25 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'ehang-216',
    manufacturer_id: 'ehang',
    model: 'EHang 216',
    category: 'private',
    image: '/images/manufacturers/ehang/ehang-ehang-216.jpg',
    description: 'The EHang 216 is an autonomous passenger-grade eVTOL aircraft. It is designed for urban air mobility and aerial tourism.',
    first_flight: 2016,
    specifications: {
      max_takeoff_weight: '600 kg',
      cruising_speed: '130 km/h',
      range: '35 km',
      capacity: 2,
      engines: 16,
      engine_type: 'Electric motors',
      length: '5.6 m',
      wingspan: '5.6 m',
      height: '1.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b250',
    manufacturer_id: 'raytheon',
    model: 'Beechcraft B250 King Air',
    category: 'private',
    image: '/images/manufacturers/raytheon/raytheon-beechcraft_b250_king_air.jpg',
    description: 'The Beechcraft King Air 250 is a twin-turboprop aircraft. It is a popular business and utility aircraft.',
    first_flight: 2010,
    specifications: {
      max_takeoff_weight: '5,670 kg',
      cruising_speed: '574 km/h',
      range: '3,184 km',
      capacity: 9,
      engines: 2,
      engine_type: 'Pratt & Whitney Canada PT6A-52',
      length: '13.36 m',
      wingspan: '16.61 m',
      height: '4.32 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'lilium-jet',
    manufacturer_id: 'lilium',
    model: 'Lilium Jet',
    category: 'private',
    image: '/images/manufacturers/lilium/lilium-lilium_jet.jpg',
    description: 'The Lilium Jet is an all-electric eVTOL jet. It is designed for regional air mobility with high speed and low noise.',
    first_flight: 2019,
    specifications: {
      max_takeoff_weight: '3,500 kg',
      cruising_speed: '300 km/h',
      range: '250 km',
      capacity: 6,
      engines: 30,
      engine_type: 'Electric ducted fans',
      length: '9.8 m',
      wingspan: '13.9 m',
      height: '2.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'wisk-corvi',
    manufacturer_id: 'wisk',
    model: 'Wisk Cora',
    category: 'private',
    image: '/images/manufacturers/wisk/wisk-wisk-corvi.jpg',
    description: 'The Wisk Cora is an autonomous eVTOL aircraft. It is designed for self-flying air taxi services.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '1,134 kg',
      cruising_speed: '180 km/h',
      range: '40 km',
      capacity: 2,
      engines: 12,
      engine_type: 'Electric motors',
      length: '6.5 m',
      wingspan: '11 m',
      height: '2.2 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'beta-ava',
    manufacturer_id: 'beta',
    model: 'Alia CX300',
    category: 'private',
    image: '/images/manufacturers/beta/beta-alia_cx300.jpg',
    description: 'The Beta Alia CX300 is an electric conventional takeoff and landing aircraft. It is designed for cargo and passenger transport.',
    first_flight: 2020,
    specifications: {
      max_takeoff_weight: '2,268 kg',
      cruising_speed: '270 km/h',
      range: '463 km',
      capacity: 6,
      engines: 1,
      engine_type: 'Electric motor',
      length: '12.8 m',
      wingspan: '15 m',
      height: '3.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'autoflight-prosperity',
    manufacturer_id: 'autoflight',
    model: 'Prosperity I',
    category: 'private',
    image: '/images/manufacturers/autoflight/autoflight-autoflight-prosperity.jpg',
    description: 'The AutoFlight Prosperity I is an eVTOL aircraft. It is designed for inter-city air taxi services.',
    first_flight: 2022,
    specifications: {
      max_takeoff_weight: '2,200 kg',
      cruising_speed: '200 km/h',
      range: '250 km',
      capacity: 4,
      engines: 6,
      engine_type: 'Electric motors',
      length: '10.5 m',
      wingspan: '13.5 m',
      height: '2.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'eve-evtol',
    manufacturer_id: 'eve',
    model: 'Eve eVTOL',
    category: 'private',
    image: '/images/manufacturers/eve/eve-eve-evtol.jpg',
    description: 'The Eve eVTOL is an electric vertical takeoff and landing aircraft. It is being developed for urban air mobility operations.',
    first_flight: 2024,
    specifications: {
      max_takeoff_weight: '2,400 kg',
      cruising_speed: '220 km/h',
      range: '100 km',
      capacity: 4,
      engines: 8,
      engine_type: 'Electric motors',
      length: '10 m',
      wingspan: '12 m',
      height: '2.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'mooney-m20',
    manufacturer_id: 'mooney',
    model: 'M20',
    category: 'private',
    image: '/images/manufacturers/mooney/mooney-mooney-m20.jpg',
    description: 'The Mooney M20 is a family of single-engine piston-powered aircraft. They are known for their speed, efficiency, and distinctive vertical stabilizer.',
    first_flight: 1955,
    specifications: {
      max_takeoff_weight: '1,430 kg',
      cruising_speed: '401 km/h',
      range: '2,600 km',
      capacity: 4,
      engines: 1,
      engine_type: 'Continental IO-550',
      length: '7.67 m',
      wingspan: '10.97 m',
      height: '2.49 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'pipistrel-panthera',
    manufacturer_id: 'pipistrel',
    model: 'Panthera',
    category: 'private',
    image: '/images/manufacturers/pipistrel/pipistrel-pipistrel-panthera.jpg',
    description: 'The Pipistrel Panthera is a four-seat, single-engine piston aircraft. It is designed for efficiency and comfort.',
    first_flight: 2012,
    specifications: {
      max_takeoff_weight: '1,310 kg',
      cruising_speed: '368 km/h',
      range: '1,850 km',
      capacity: 4,
      engines: 1,
      engine_type: 'Lycoming IO-390',
      length: '7.9 m',
      wingspan: '10.86 m',
      height: '2.35 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'pipistrel-velis',
    manufacturer_id: 'pipistrel',
    model: 'Velis Electro',
    category: 'private',
    image: '/images/manufacturers/pipistrel/pipistrel-pipistrel-velis.jpg',
    description: 'The Pipistrel Velis Electro is the first type-certified electric aircraft. It is designed for flight training and local flying.',
    first_flight: 2019,
    specifications: {
      max_takeoff_weight: '600 kg',
      cruising_speed: '170 km/h',
      range: '108 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Electric motor',
      length: '6.5 m',
      wingspan: '10.7 m',
      height: '2.05 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'aviat-husky',
    manufacturer_id: 'aviat',
    model: 'Husky',
    category: 'private',
    image: '/images/manufacturers/aviat/aviat-husky.jpg',
    description: 'The Aviat Husky is a tandem two-seat, high-wing, utility light aircraft. It is popular for bush flying and tailwheel training.',
    first_flight: 1987,
    specifications: {
      max_takeoff_weight: '907 kg',
      cruising_speed: '220 km/h',
      range: '1,112 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Lycoming O-360',
      length: '6.83 m',
      wingspan: '10.67 m',
      height: '2.16 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'champion-decathlon',
    manufacturer_id: 'american-champion',
    model: 'Super Decathlon',
    category: 'private',
    image: '/images/manufacturers/american-champion/american-champion-champion-decathlon.jpg',
    description: 'The American Champion Super Decathlon is a two-seat, fixed tricycle gear, light aerobatic aircraft. It is widely used for aerobatic training.',
    first_flight: 1970,
    specifications: {
      max_takeoff_weight: '884 kg',
      cruising_speed: '204 km/h',
      range: '680 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Lycoming AEIO-360',
      length: '6.86 m',
      wingspan: '9.75 m',
      height: '2.31 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'sling-4',
    manufacturer_id: 'sling',
    model: 'Sling 4',
    category: 'private',
    image: '/images/manufacturers/sling/sling-sling_4.jpg',
    description: 'The Sling 4 is a four-seat, low-wing, all-metal light aircraft. It is designed for recreational and touring flights.',
    first_flight: 2012,
    specifications: {
      max_takeoff_weight: '1,000 kg',
      cruising_speed: '240 km/h',
      range: '1,200 km',
      capacity: 4,
      engines: 1,
      engine_type: 'Rotax 912',
      length: '7.1 m',
      wingspan: '9.6 m',
      height: '2.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'epic-e1000',
    manufacturer_id: 'epic',
    model: 'E1000 GX',
    category: 'private',
    image: '/images/manufacturers/epic/epic-epic-e1000.jpg',
    description: 'The Epic E1000 GX is a single-engine, six-seat turboprop aircraft. It is known for its high speed and carbon fiber construction.',
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '3,500 kg',
      cruising_speed: '611 km/h',
      range: '1,926 km',
      capacity: 6,
      engines: 1,
      engine_type: 'Pratt & Whitney PT6A-67A',
      length: '10.97 m',
      wingspan: '11.9 m',
      height: '3.94 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'tbm-910',
    manufacturer_id: 'socata',
    model: 'TBM 910',
    category: 'private',
    image: '/images/manufacturers/socata/socata-tbm_910.jpg',
    description: 'The Daher TBM 910 is a single-engine turboprop business aircraft. It is one of the fastest single-engine aircraft in the world.',
    first_flight: 2016,
    specifications: {
      max_takeoff_weight: '3,353 kg',
      cruising_speed: '611 km/h',
      range: '3,329 km',
      capacity: 6,
      engines: 1,
      engine_type: 'Pratt & Whitney Canada PT6A-66D',
      length: '10.72 m',
      wingspan: '12.83 m',
      height: '3.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'tbm-960',
    manufacturer_id: 'socata',
    model: 'TBM 960',
    category: 'private',
    image: '/images/manufacturers/socata/socata-tbm-960.jpg',
    description: 'The Daher TBM 960 is an advanced single-engine turboprop. It features digital engine control and luxury cabin appointments.',
    first_flight: 2022,
    specifications: {
      max_takeoff_weight: '3,353 kg',
      cruising_speed: '611 km/h',
      range: '3,329 km',
      capacity: 6,
      engines: 1,
      engine_type: 'Pratt & Whitney Canada PT6E-66XT',
      length: '10.72 m',
      wingspan: '12.83 m',
      height: '3.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'hondajet',
    manufacturer_id: 'hondajet',
    model: 'HondaJet',
    category: 'private',
    image: '/images/manufacturers/hondajet/hondajet-hondajet.jpg',
    description: 'The HondaJet is a light business jet. It features over-the-wing engine mounts for improved aerodynamics and cabin space.',
    first_flight: 2003,
    specifications: {
      max_takeoff_weight: '4,173 kg',
      cruising_speed: '782 km/h',
      range: '2,661 km',
      capacity: 6,
      engines: 2,
      engine_type: 'GE Honda HF120',
      length: '12.99 m',
      wingspan: '12.12 m',
      height: '4.54 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'hondajet-2600',
    manufacturer_id: 'hondajet',
    model: 'HondaJet 2600',
    category: 'private',
    image: '/images/manufacturers/hondajet/hondajet-hondajet-2600.jpg',
    description: 'The HondaJet 2600 Concept is a stretched version of the HondaJet. It is designed for transcontinental range.',
    first_flight: 2021,
    specifications: {
      max_takeoff_weight: '6,000 kg',
      cruising_speed: '800 km/h',
      range: '4,800 km',
      capacity: 11,
      engines: 2,
      engine_type: 'GE Honda HF120',
      length: '15.8 m',
      wingspan: '13.4 m',
      height: '4.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'air-tractor-802',
    manufacturer_id: 'airtractor',
    model: 'AT-802',
    category: 'private',
    image: '/images/manufacturers/airtractor/airtractor-at-802.jpg',
    description: 'The Air Tractor AT-802 is a single-engine turboprop agricultural and firefighting aircraft. It is the largest single-engine aircraft in production.',
    first_flight: 1990,
    specifications: {
      max_takeoff_weight: '7,257 kg',
      cruising_speed: '356 km/h',
      range: '1,852 km',
      capacity: 1,
      engines: 1,
      engine_type: 'Pratt & Whitney Canada PT6A-67F',
      length: '11.07 m',
      wingspan: '18.04 m',
      height: '3.53 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'thrush-510',
    manufacturer_id: 'thrush',
    model: 'Thrush 510',
    category: 'private',
    image: '/images/manufacturers/thrush/thrush-thrush_510.jpg',
    description: 'The Thrush 510 is an agricultural aircraft. It is used for crop dusting and aerial application.',
    first_flight: 1956,
    specifications: {
      max_takeoff_weight: '4,536 kg',
      cruising_speed: '240 km/h',
      range: '520 km',
      capacity: 1,
      engines: 1,
      engine_type: 'Pratt & Whitney R-1340',
      length: '8.1 m',
      wingspan: '11.5 m',
      height: '2.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'elixir-elixir',
    manufacturer_id: 'elixir',
    model: 'Elixir',
    category: 'private',
    image: '/images/manufacturers/elixir/elixir-elixir-elixir.jpg',
    description: 'The Elixir Aircraft Elixir is a two-seat, high-wing, carbon fiber light aircraft. It is designed for flight training and touring.',
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '1,000 kg',
      cruising_speed: '240 km/h',
      range: '1,250 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Rotax 912',
      length: '7.1 m',
      wingspan: '9.6 m',
      height: '2.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'icon-a5',
    manufacturer_id: 'icon',
    model: 'A5',
    category: 'private',
    image: '/images/manufacturers/icon/icon-icon-a5.jpg',
    description: 'The Icon A5 is a two-seat amphibious light sport aircraft. It features folding wings for easy trailer transport.',
    first_flight: 2008,
    specifications: {
      max_takeoff_weight: '686 kg',
      cruising_speed: '176 km/h',
      range: '555 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Rotax 912',
      length: '7.01 m',
      wingspan: '9.4 m',
      height: '2.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'waco-ymf',
    manufacturer_id: 'waco',
    model: 'YMF-5',
    category: 'private',
    image: '/images/manufacturers/waco/waco-ymf-5.jpg',
    description: 'The Waco YMF-5 is a classic biplane. It is built with modern materials and engines for recreation and touring.',
    first_flight: 1986,
    specifications: {
      max_takeoff_weight: '1,406 kg',
      cruising_speed: '257 km/h',
      range: '760 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Jacobs R-755',
      length: '7.39 m',
      wingspan: '9.14 m',
      height: '2.69 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'vulcanair-p68',
    manufacturer_id: 'vulcanair',
    model: 'P.68',
    category: 'private',
    image: '/images/manufacturers/vulcanair/vulcanair-vulcanair-p68.jpg',
    description: 'The Vulcanair P.68 is a twin-engine, high-wing, six-seat light aircraft. It is used for utility and surveillance missions.',
    first_flight: 1970,
    specifications: {
      max_takeoff_weight: '1,998 kg',
      cruising_speed: '300 km/h',
      range: '1,620 km',
      capacity: 6,
      engines: 2,
      engine_type: 'Lycoming IO-360',
      length: '9.55 m',
      wingspan: '12 m',
      height: '3.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'mahindra-airvan',
    manufacturer_id: 'mahindra',
    model: 'Airvan 8',
    category: 'private',
    image: '/images/manufacturers/mahindra/mahindra-mahindra-airvan.jpg',
    description: 'The Mahindra Airvan 8 is a single-engine utility aircraft. It is used for cargo, surveillance, and passenger transport.',
    first_flight: 2000,
    specifications: {
      max_takeoff_weight: '1,500 kg',
      cruising_speed: '230 km/h',
      range: '1,200 km',
      capacity: 8,
      engines: 1,
      engine_type: 'Lycoming IO-540',
      length: '8.8 m',
      wingspan: '12.1 m',
      height: '3.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'commander-690',
    manufacturer_id: 'twin-commander',
    model: 'Commander 690',
    category: 'private',
    image: '/images/manufacturers/twin-commander/twin-commander-commander-690.jpg',
    description: 'The Twin Commander 690 is a twin-turboprop aircraft. It is used for executive transport and special missions.',
    first_flight: 1964,
    specifications: {
      max_takeoff_weight: '4,899 kg',
      cruising_speed: '520 km/h',
      range: '2,963 km',
      capacity: 11,
      engines: 2,
      engine_type: 'Honeywell TPE331',
      length: '13.11 m',
      wingspan: '14.95 m',
      height: '4.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bn-2-islander',
    manufacturer_id: 'britten-norman',
    model: 'BN-2 Islander',
    category: 'regional',
    image: '/images/manufacturers/britten-norman/britten-norman-bn-2_islander.jpg',
    description: 'The Britten-Norman BN-2 Islander is a twin-engine, high-wing utility aircraft. It is popular for short-haul island operations.',
    first_flight: 1965,
    specifications: {
      max_takeoff_weight: '2,994 kg',
      cruising_speed: '273 km/h',
      range: '1,400 km',
      capacity: 9,
      engines: 2,
      engine_type: 'Lycoming O-540',
      length: '10.86 m',
      wingspan: '14.94 m',
      height: '4.18 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'evektor-sportstar',
    manufacturer_id: 'evektor',
    model: 'SportStar RTC',
    category: 'private',
    image: '/images/manufacturers/evektor/evektor-evektor-sportstar.jpg',
    description: 'The Evektor SportStar RTC is a two-seat, low-wing light sport aircraft. It is designed for flight training.',
    first_flight: 1996,
    specifications: {
      max_takeoff_weight: '600 kg',
      cruising_speed: '200 km/h',
      range: '700 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Rotax 912',
      length: '6.4 m',
      wingspan: '9.2 m',
      height: '2.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bristell',
    manufacturer_id: 'bristell',
    model: 'Bristell',
    category: 'private',
    image: '/images/manufacturers/bristell/bristell-bristell.jpg',
    description: 'The Bristell is a modern, all-metal, low-wing light sport aircraft. It is popular for flight training and recreational flying.',
    first_flight: 2010,
    specifications: {
      max_takeoff_weight: '750 kg',
      cruising_speed: '240 km/h',
      range: '1,000 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Rotax 912',
      length: '6.9 m',
      wingspan: '9.1 m',
      height: '2.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'velocity-xl',
    manufacturer_id: 'velocity',
    model: 'Velocity XL',
    category: 'private',
    image: '/images/manufacturers/velocity/velocity-velocity_xl.jpg',
    description: 'The Velocity XL is a four-seat, composite canard aircraft. It is built from kits by amateur builders.',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '1,500 kg',
      cruising_speed: '320 km/h',
      range: '1,600 km',
      capacity: 4,
      engines: 1,
      engine_type: 'Lycoming IO-540',
      length: '6.3 m',
      wingspan: '9.8 m',
      height: '2.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'kodiak-100',
    manufacturer_id: 'quest',
    model: 'Kodiak 100',
    category: 'private',
    image: '/images/manufacturers/quest/quest-kodiak-100.jpg',
    description: 'The Quest Kodiak 100 is a single-engine turboprop utility aircraft. It is designed for short and unimproved runways.',
    first_flight: 2004,
    specifications: {
      max_takeoff_weight: '3,340 kg',
      cruising_speed: '340 km/h',
      range: '1,718 km',
      capacity: 9,
      engines: 1,
      engine_type: 'Pratt & Whitney Canada PT6A-34',
      length: '10.5 m',
      wingspan: '13.72 m',
      height: '4.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'p750-xstol',
    manufacturer_id: 'pacific-aerospace',
    model: 'P-750 XSTOL',
    category: 'regional',
    image: '/images/manufacturers/pacific-aerospace/pacific-aerospace-p750-xstol.jpg',
    description: 'The Pacific Aerospace P-750 XSTOL is a single-engine turboprop utility aircraft. It is used for skydiving, cargo, and passenger transport.',
    first_flight: 2001,
    specifications: {
      max_takeoff_weight: '1,905 kg',
      cruising_speed: '259 km/h',
      range: '1,218 km',
      capacity: 9,
      engines: 1,
      engine_type: 'Pratt & Whitney Canada PT6A-34',
      length: '9.9 m',
      wingspan: '11.8 m',
      height: '3.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'aero-east-silatus',
    manufacturer_id: 'aero-east-europe',
    model: 'Silatus',
    category: 'private',
    image: '/images/manufacturers/aero-east-europe/aero-east-europe-aero-east-silatus.jpg',
    description: 'The Aero East Europe Silatus is a light sport aircraft. It is designed for recreational flying and flight training.',
    first_flight: 2010,
    specifications: {
      max_takeoff_weight: '600 kg',
      cruising_speed: '190 km/h',
      range: '600 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Rotax 912',
      length: '6.3 m',
      wingspan: '9.2 m',
      height: '2.2 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'jmb-evolution',
    manufacturer_id: 'jmb',
    model: 'Evolution',
    category: 'private',
    image: '/images/manufacturers/jmb/jmb-jmb-evolution.jpg',
    description: 'The JMB Aircraft Evolution is a composite light sport aircraft. It is designed for flight training and touring.',
    first_flight: 2010,
    specifications: {
      max_takeoff_weight: '600 kg',
      cruising_speed: '200 km/h',
      range: '700 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Rotax 912',
      length: '6.4 m',
      wingspan: '8.9 m',
      height: '2.2 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'foxcon-terrier',
    manufacturer_id: 'foxcon',
    model: 'Terrier 200',
    category: 'private',
    image: '/images/manufacturers/foxcon/foxcon-foxcon-terrier.jpg',
    description: 'The Foxcon Aviation Terrier 200 is a light sport aircraft. It is used for flight training and recreational flying.',
    first_flight: 2012,
    specifications: {
      max_takeoff_weight: '600 kg',
      cruising_speed: '190 km/h',
      range: '650 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Rotax 912',
      length: '6.2 m',
      wingspan: '9.1 m',
      height: '2.2 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'grob-120',
    manufacturer_id: 'grob',
    model: 'G 120',
    category: 'military',
    image: '/images/manufacturers/grob/grob-g_120.jpg',
    description: 'The Grob G 120 is a two-seat, low-wing military trainer aircraft. It is used for basic and advanced pilot training.',
    first_flight: 1999,
    specifications: {
      max_takeoff_weight: '1,440 kg',
      cruising_speed: '365 km/h',
      range: '1,380 km',
      capacity: 2,
      engines: 1,
      engine_type: 'Diamond AE300',
      length: '8.4 m',
      wingspan: '10.2 m',
      height: '2.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'elroy-chaparral',
    manufacturer_id: 'elroy-air',
    model: 'Chaparral',
    category: 'cargo',
    image: '/images/manufacturers/elroy-air/elroy-air-elroy-chaparral.jpg',
    description: 'The Elroy Air Chaparral is an autonomous, hybrid-electric cargo VTOL aircraft. It is designed for middle-mile logistics.',
    first_flight: 2019,
    specifications: {
      max_takeoff_weight: '1,200 kg',
      cruising_speed: '160 km/h',
      range: '483 km',
      capacity: 0,
      engines: 6,
      engine_type: 'Hybrid-electric',
      length: '7.6 m',
      wingspan: '8.6 m',
      height: '2.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'pyka-pelican',
    manufacturer_id: 'pyka',
    model: 'Pelican',
    category: 'cargo',
    image: '/images/manufacturers/pyka/pyka-pyka-pelican.jpg',
    description: 'The Pyka Pelican is an autonomous electric cargo aircraft. It is used for agricultural spraying and cargo transport.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '600 kg',
      cruising_speed: '130 km/h',
      range: '160 km',
      capacity: 0,
      engines: 4,
      engine_type: 'Electric motors',
      length: '6.5 m',
      wingspan: '11.5 m',
      height: '1.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'sabrewing-rhaegal',
    manufacturer_id: 'sabrewing',
    model: 'Rhaegal',
    category: 'cargo',
    image: '/images/manufacturers/sabrewing/sabrewing-rhaegal.jpg',
    description: 'The Sabrewing Rhaegal is an unmanned cargo aircraft. It is designed for heavy lift and long-range cargo missions.',
    first_flight: 2020,
    specifications: {
      max_takeoff_weight: '1,500 kg',
      cruising_speed: '220 km/h',
      range: '1,000 km',
      capacity: 0,
      engines: 4,
      engine_type: 'Hybrid-electric',
      length: '8 m',
      wingspan: '12 m',
      height: '2.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'fugro-1',
    manufacturer_id: 'fugro',
    model: 'Fugro Survey Aircraft',
    category: 'private',
    image: '/images/manufacturers/fugro/fugro-fugro_survey_aircraft.jpg',
    description: 'Fugro aviation platforms for aerial survey and geospatial data collection.',
    first_flight: 2010,
    specifications: {
      max_takeoff_weight: '2,000 kg',
      cruising_speed: '250 km/h',
      range: '800 km',
      capacity: 4,
      engines: 2,
      engine_type: 'Turboprop',
      length: '9 m',
      wingspan: '13 m',
      height: '3.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'supernal-sa-1',
    manufacturer_id: 'supernal',
    model: 'S-A1',
    category: 'private',
    image: '/images/manufacturers/supernal/supernal-s-a1.jpg',
    description: 'There are currently zero pilots rated on the Supernal S-A1. The S-A1—introduced as a concept vehicle—was an early stage prototype and has since been succeeded by the S-A2. Because the aircraft is still in the research and development phase and has not yet received FAA type certification, no pilot ratings currently exist for it.',
    first_flight: 2020,
    specifications: {
      max_takeoff_weight: '3,200 kg',
      cruising_speed: '240 km/h',
      range: '100 km',
      capacity: 4,
      engines: 8,
      engine_type: 'Electric motors',
      length: '10 m',
      wingspan: '12 m',
      height: '2.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'regent-seaglider',
    manufacturer_id: 'regent-craft',
    model: 'Seaglider',
    category: 'private',
    image: '/images/manufacturers/regent-craft/regent-craft-seaglider.jpg',
    description: 'The Regent Craft Seaglider is an electric wing-in-ground-effect vehicle. It is designed for coastal passenger transport.',
    first_flight: 2020,
    specifications: {
      max_takeoff_weight: '2,700 kg',
      cruising_speed: '290 km/h',
      range: '290 km',
      capacity: 12,
      engines: 8,
      engine_type: 'Electric motors',
      length: '11 m',
      wingspan: '14 m',
      height: '2.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
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
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
,
  {
    id: 'a220-100',
    manufacturer_id: 'airbus',
    model: 'A220-100',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a220-100.jpg',
    description: 'Modern efficient narrow-body seating 100-135.',
    first_flight: 2013,
    specifications: {
      max_takeoff_weight: '63,100 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,390 km',
      capacity: 135,
      engines: 2,
      engine_type: 'PW PW1500G',
      length: '35.0 m',
      wingspan: '35.1 m',
      height: '11.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a220-300',
    manufacturer_id: 'airbus',
    model: 'A220-300',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a220-300.jpg',
    description: 'Larger A220 seating 120-160.',
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '69,900 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,297 km',
      capacity: 160,
      engines: 2,
      engine_type: 'PW PW1500G',
      length: '38.7 m',
      wingspan: '35.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300b1',
    manufacturer_id: 'airbus',
    model: 'A300B1',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a300b1.jpg',
    description: 'First Airbus wide-body twinjet.',
    first_flight: 1972,
    specifications: {
      max_takeoff_weight: '132,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,600 km',
      capacity: 300,
      engines: 2,
      engine_type: 'GE CF6-50',
      length: '53.6 m',
      wingspan: '44.8 m',
      height: '16.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300b2',
    manufacturer_id: 'airbus',
    model: 'A300B2',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a300b2.jpg',
    description: 'First production A300.',
    first_flight: 1973,
    specifications: {
      max_takeoff_weight: '137,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,600 km',
      capacity: 300,
      engines: 2,
      engine_type: 'GE CF6-50',
      length: '53.6 m',
      wingspan: '44.8 m',
      height: '16.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300b4',
    manufacturer_id: 'airbus',
    model: 'A300B4',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a300b4.jpg',
    description: 'Improved A300 with more fuel.',
    first_flight: 1974,
    specifications: {
      max_takeoff_weight: '157,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '5,400 km',
      capacity: 300,
      engines: 2,
      engine_type: 'GE CF6-50',
      length: '53.6 m',
      wingspan: '44.8 m',
      height: '16.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300-600',
    manufacturer_id: 'airbus',
    model: 'A300-600',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a300-600.jpg',
    description: 'A300 with two-person cockpit and EFIS.',
    first_flight: 1983,
    specifications: {
      max_takeoff_weight: '170,500 kg',
      cruising_speed: 'Mach 0.78',
      range: '7,540 km',
      capacity: 300,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '54.1 m',
      wingspan: '44.8 m',
      height: '16.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300-600r',
    manufacturer_id: 'airbus',
    model: 'A300-600R',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a300-600r.jpg',
    description: 'A300-600 with extended range.',
    first_flight: 1987,
    specifications: {
      max_takeoff_weight: '170,500 kg',
      cruising_speed: 'Mach 0.78',
      range: '9,050 km',
      capacity: 300,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '54.1 m',
      wingspan: '44.8 m',
      height: '16.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300-600f',
    manufacturer_id: 'airbus',
    model: 'A300-600F',
    category: 'cargo',
    image: '/images/manufacturers/airbus/airbus-a300-600f.jpg',
    description: 'Freighter version of A300-600.',
    first_flight: 1992,
    specifications: {
      max_takeoff_weight: '170,500 kg',
      cruising_speed: 'Mach 0.78',
      range: '4,800 km',
      capacity: 0,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '54.1 m',
      wingspan: '44.8 m',
      height: '16.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a300-600st',
    manufacturer_id: 'airbus',
    model: 'A300-600ST Beluga',
    category: 'cargo',
    image: '/images/manufacturers/airbus/airbus-a300-600st_beluga.jpg',
    description: 'Modified A300 for oversized cargo.',
    first_flight: 1994,
    specifications: {
      max_takeoff_weight: '155,000 kg',
      cruising_speed: 'Mach 0.68',
      range: '2,500 km',
      capacity: 0,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '56.2 m',
      wingspan: '44.8 m',
      height: '17.2 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310-200',
    manufacturer_id: 'airbus',
    model: 'A310-200',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a310-200.jpg',
    description: 'Shortened A300 derivative.',
    first_flight: 1982,
    specifications: {
      max_takeoff_weight: '132,000 kg',
      cruising_speed: 'Mach 0.80',
      range: '6,800 km',
      capacity: 280,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '46.7 m',
      wingspan: '43.9 m',
      height: '15.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310-300',
    manufacturer_id: 'airbus',
    model: 'A310-300',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a310-300.jpg',
    description: 'A310 with winglets.',
    first_flight: 1985,
    specifications: {
      max_takeoff_weight: '164,000 kg',
      cruising_speed: 'Mach 0.80',
      range: '9,600 km',
      capacity: 280,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '46.7 m',
      wingspan: '43.9 m',
      height: '15.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310-f',
    manufacturer_id: 'airbus',
    model: 'A310F',
    category: 'cargo',
    image: '/images/manufacturers/airbus/airbus-a310f.jpg',
    description: 'Freighter version of A310.',
    first_flight: 1986,
    specifications: {
      max_takeoff_weight: '164,000 kg',
      cruising_speed: 'Mach 0.80',
      range: '4,500 km',
      capacity: 0,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '46.7 m',
      wingspan: '43.9 m',
      height: '15.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a310-mrtt',
    manufacturer_id: 'airbus',
    model: 'A310 MRTT',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-a310_mrtt.jpg',
    description: 'Multi-role tanker transport.',
    first_flight: 2003,
    specifications: {
      max_takeoff_weight: '164,000 kg',
      cruising_speed: 'Mach 0.80',
      range: '9,600 km',
      capacity: 0,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '46.7 m',
      wingspan: '43.9 m',
      height: '15.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a320-100',
    manufacturer_id: 'airbus',
    model: 'A320-100',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a320-100.jpg',
    description: 'Original A320 with fly-by-wire.',
    first_flight: 1987,
    specifications: {
      max_takeoff_weight: '68,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '5,700 km',
      capacity: 150,
      engines: 2,
      engine_type: 'CFM56-5A1',
      length: '37.6 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a320-200',
    manufacturer_id: 'airbus',
    model: 'A320-200',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a320-200.jpg',
    description: 'Standard A320 with wingtip fences.',
    first_flight: 1988,
    specifications: {
      max_takeoff_weight: '73,500 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,150 km',
      capacity: 180,
      engines: 2,
      engine_type: 'CFM56-5A1',
      length: '37.6 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a320-neo',
    manufacturer_id: 'airbus',
    model: 'A320neo',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a320neo.jpg',
    description: 'Re-engined A320 with sharklets.',
    first_flight: 2014,
    specifications: {
      max_takeoff_weight: '79,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,850 km',
      capacity: 180,
      engines: 2,
      engine_type: 'CFM LEAP-1A',
      length: '37.6 m',
      wingspan: '35.8 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a318',
    manufacturer_id: 'airbus',
    model: 'A318',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a318.jpg',
    description: 'Smallest A320 family member.',
    first_flight: 2002,
    specifications: {
      max_takeoff_weight: '68,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '5,700 km',
      capacity: 132,
      engines: 2,
      engine_type: 'CFM56-5B9',
      length: '31.4 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a318-elite',
    manufacturer_id: 'airbus',
    model: 'A318 Elite',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-a318_elite.jpg',
    description: 'VIP configuration of the A318.',
    first_flight: 2005,
    specifications: {
      max_takeoff_weight: '68,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '7,000 km',
      capacity: 19,
      engines: 2,
      engine_type: 'CFM56-5B9',
      length: '31.4 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a319',
    manufacturer_id: 'airbus',
    model: 'A319',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a319.jpg',
    description: 'Shortened A320 seating 124-156.',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '64,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,850 km',
      capacity: 156,
      engines: 2,
      engine_type: 'CFM56-5B',
      length: '33.8 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a319-neo',
    manufacturer_id: 'airbus',
    model: 'A319neo',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a319neo.jpg',
    description: 'Re-engined A319.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '75,500 kg',
      cruising_speed: 'Mach 0.78',
      range: '7,000 km',
      capacity: 156,
      engines: 2,
      engine_type: 'CFM LEAP-1A',
      length: '33.8 m',
      wingspan: '35.8 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a319-acj',
    manufacturer_id: 'airbus',
    model: 'A319 ACJ',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-a319_acj.jpg',
    description: 'Corporate jet A319.',
    first_flight: 1998,
    specifications: {
      max_takeoff_weight: '75,500 kg',
      cruising_speed: 'Mach 0.82',
      range: '11,100 km',
      capacity: 19,
      engines: 2,
      engine_type: 'CFM56-5B',
      length: '33.8 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a319-mmr',
    manufacturer_id: 'airbus',
    model: 'A319 MMR',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-a319_mmr.jpg',
    description: 'Multi-role tanker transport variant.',
    first_flight: 2008,
    specifications: {
      max_takeoff_weight: '75,500 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,850 km',
      capacity: 0,
      engines: 2,
      engine_type: 'CFM56-5B',
      length: '33.8 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321-100',
    manufacturer_id: 'airbus',
    model: 'A321-100',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a321-100.jpg',
    description: 'Stretched A320 seating 185-220.',
    first_flight: 1993,
    specifications: {
      max_takeoff_weight: '83,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '4,700 km',
      capacity: 220,
      engines: 2,
      engine_type: 'CFM56-5B3',
      length: '44.5 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321-200',
    manufacturer_id: 'airbus',
    model: 'A321-200',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a321-200.jpg',
    description: 'Higher-weight A321.',
    first_flight: 1994,
    specifications: {
      max_takeoff_weight: '89,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '5,600 km',
      capacity: 220,
      engines: 2,
      engine_type: 'CFM56-5B3',
      length: '44.5 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321-neo',
    manufacturer_id: 'airbus',
    model: 'A321neo',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a321neo.jpg',
    description: 'Stretched re-engined A320 flagship.',
    first_flight: 2016,
    specifications: {
      max_takeoff_weight: '97,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '7,400 km',
      capacity: 244,
      engines: 2,
      engine_type: 'CFM LEAP-1A',
      length: '44.5 m',
      wingspan: '35.8 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321-lr',
    manufacturer_id: 'airbus',
    model: 'A321LR',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a321lr.jpg',
    description: 'A321neo with extra fuel tanks.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '97,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '7,400 km',
      capacity: 206,
      engines: 2,
      engine_type: 'CFM LEAP-1A',
      length: '44.5 m',
      wingspan: '35.8 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321-xlr',
    manufacturer_id: 'airbus',
    model: 'A321XLR',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a321xlr.jpg',
    description: 'Ultra-long range A321neo.',
    first_flight: 2022,
    specifications: {
      max_takeoff_weight: '101,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '8,700 km',
      capacity: 200,
      engines: 2,
      engine_type: 'CFM LEAP-1A',
      length: '44.5 m',
      wingspan: '35.8 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321-acj',
    manufacturer_id: 'airbus',
    model: 'A321 ACJ',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-a321_acj.jpg',
    description: 'Largest ACJ narrow-body.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '97,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '11,100 km',
      capacity: 19,
      engines: 2,
      engine_type: 'CFM LEAP-1A',
      length: '44.5 m',
      wingspan: '35.8 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a320-p2f',
    manufacturer_id: 'airbus',
    model: 'A320P2F',
    category: 'cargo',
    image: '/images/manufacturers/airbus/airbus-a320p2f.jpg',
    description: 'Passenger-to-freighter A320.',
    first_flight: 2020,
    specifications: {
      max_takeoff_weight: '73,500 kg',
      cruising_speed: 'Mach 0.78',
      range: '4,500 km',
      capacity: 0,
      engines: 2,
      engine_type: 'CFM56-5A1',
      length: '37.6 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a321-p2f',
    manufacturer_id: 'airbus',
    model: 'A321P2F',
    category: 'cargo',
    image: '/images/manufacturers/airbus/airbus-a321p2f.jpg',
    description: 'Passenger-to-freighter A321.',
    first_flight: 2020,
    specifications: {
      max_takeoff_weight: '89,000 kg',
      cruising_speed: 'Mach 0.78',
      range: '4,800 km',
      capacity: 0,
      engines: 2,
      engine_type: 'CFM56-5B3',
      length: '44.5 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-200',
    manufacturer_id: 'airbus',
    model: 'A330-200',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a330-200.jpg',
    description: 'Shortened longer-range A330.',
    first_flight: 1997,
    specifications: {
      max_takeoff_weight: '238,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '13,450 km',
      capacity: 250,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '58.8 m',
      wingspan: '60.3 m',
      height: '17.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-300',
    manufacturer_id: 'airbus',
    model: 'A330-300',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a330-300.jpg',
    description: 'Original longer A330.',
    first_flight: 1992,
    specifications: {
      max_takeoff_weight: '242,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '11,750 km',
      capacity: 295,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '63.7 m',
      wingspan: '60.3 m',
      height: '16.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-800',
    manufacturer_id: 'airbus',
    model: 'A330-800neo',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a330-800.jpg',
    description: 'Re-engined shortened A330.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '251,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '15,090 km',
      capacity: 260,
      engines: 2,
      engine_type: 'RR Trent 7000',
      length: '58.8 m',
      wingspan: '64.0 m',
      height: '17.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-900',
    manufacturer_id: 'airbus',
    model: 'A330-900neo',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a330-900.jpg',
    description: 'Re-engined longer A330.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '251,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '13,400 km',
      capacity: 300,
      engines: 2,
      engine_type: 'RR Trent 7000',
      length: '63.7 m',
      wingspan: '64.0 m',
      height: '16.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-200f',
    manufacturer_id: 'airbus',
    model: 'A330-200F',
    category: 'cargo',
    image: '/images/manufacturers/airbus/airbus-a330-200f.jpg',
    description: 'Freighter based on A330-200.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '233,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '7,400 km',
      capacity: 0,
      engines: 2,
      engine_type: 'PW PW4000',
      length: '58.8 m',
      wingspan: '60.3 m',
      height: '17.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-mrtt',
    manufacturer_id: 'airbus',
    model: 'A330 MRTT',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-a330-mrtt.jpg',
    description: 'Multi-role tanker transport.',
    first_flight: 2007,
    specifications: {
      max_takeoff_weight: '233,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '14,800 km',
      capacity: 0,
      engines: 2,
      engine_type: 'RR Trent 700',
      length: '58.8 m',
      wingspan: '60.3 m',
      height: '17.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-300-p2f',
    manufacturer_id: 'airbus',
    model: 'A330-300P2F',
    category: 'cargo',
    image: '/images/manufacturers/airbus/airbus-a330-300p2f.jpg',
    description: 'P2F conversion for A330-300.',
    first_flight: 2020,
    specifications: {
      max_takeoff_weight: '242,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '8,200 km',
      capacity: 0,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '63.7 m',
      wingspan: '60.3 m',
      height: '16.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-200-acj',
    manufacturer_id: 'airbus',
    model: 'A330-200 ACJ',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-a330-200_acj.jpg',
    description: 'Ultra-long range VIP transport.',
    first_flight: 2001,
    specifications: {
      max_takeoff_weight: '238,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '17,700 km',
      capacity: 19,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '58.8 m',
      wingspan: '60.3 m',
      height: '17.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-300-acj',
    manufacturer_id: 'airbus',
    model: 'A330-300 ACJ',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-a330-300_acj.jpg',
    description: 'Largest ACJ cabin.',
    first_flight: 2001,
    specifications: {
      max_takeoff_weight: '242,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '14,800 km',
      capacity: 19,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '63.7 m',
      wingspan: '60.3 m',
      height: '16.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a330-700l',
    manufacturer_id: 'airbus',
    model: 'A330-700L BelugaXL',
    category: 'cargo',
    image: '/images/manufacturers/airbus/airbus-a330-700l_belugaxl.jpg',
    description: 'Next-gen oversized cargo aircraft.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '227,000 kg',
      cruising_speed: 'Mach 0.69',
      range: '4,000 km',
      capacity: 0,
      engines: 2,
      engine_type: 'RR Trent 700',
      length: '63.1 m',
      wingspan: '60.3 m',
      height: '18.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a340-200',
    manufacturer_id: 'airbus',
    model: 'A340-200',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a340-200.jpg',
    description: 'Shortest longest-range A340 quadjet.',
    first_flight: 1992,
    specifications: {
      max_takeoff_weight: '275,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '14,800 km',
      capacity: 260,
      engines: 4,
      engine_type: 'CFM56-5C2',
      length: '59.4 m',
      wingspan: '60.3 m',
      height: '17.0 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a340-300',
    manufacturer_id: 'airbus',
    model: 'A340-300',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a340-300.jpg',
    description: 'Original A340.',
    first_flight: 1991,
    specifications: {
      max_takeoff_weight: '271,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '13,700 km',
      capacity: 295,
      engines: 4,
      engine_type: 'CFM56-5C4',
      length: '63.7 m',
      wingspan: '60.3 m',
      height: '16.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a340-500',
    manufacturer_id: 'airbus',
    model: 'A340-500',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a340-500.jpg',
    description: 'Longest-range airliner at introduction.',
    first_flight: 2002,
    specifications: {
      max_takeoff_weight: '380,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '16,700 km',
      capacity: 375,
      engines: 4,
      engine_type: 'RR Trent 500',
      length: '67.9 m',
      wingspan: '63.5 m',
      height: '17.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a340-600',
    manufacturer_id: 'airbus',
    model: 'A340-600',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a340-600.jpg',
    description: 'Longest airliner at 75.4 m when introduced.',
    first_flight: 2001,
    specifications: {
      max_takeoff_weight: '380,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '14,600 km',
      capacity: 380,
      engines: 4,
      engine_type: 'RR Trent 500',
      length: '75.4 m',
      wingspan: '63.5 m',
      height: '17.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350-900',
    manufacturer_id: 'airbus',
    model: 'A350-900',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a350-900.jpg',
    description: 'Base variant composite wide-body.',
    first_flight: 2013,
    specifications: {
      max_takeoff_weight: '283,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '15,000 km',
      capacity: 315,
      engines: 2,
      engine_type: 'RR Trent XWB',
      length: '66.8 m',
      wingspan: '64.8 m',
      height: '17.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350-1000',
    manufacturer_id: 'airbus',
    model: 'A350-1000',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a350-1000.jpg',
    description: 'Stretched A350.',
    first_flight: 2016,
    specifications: {
      max_takeoff_weight: '319,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '16,100 km',
      capacity: 369,
      engines: 2,
      engine_type: 'RR Trent XWB-97',
      length: '73.8 m',
      wingspan: '64.8 m',
      height: '17.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350-900-ulr',
    manufacturer_id: 'airbus',
    model: 'A350-900ULR',
    category: 'commercial',
    image: '/images/manufacturers/airbus/airbus-a350-900ulr.jpg',
    description: 'Ultra-long range variant.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '283,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '18,000 km',
      capacity: 170,
      engines: 2,
      engine_type: 'RR Trent XWB',
      length: '66.8 m',
      wingspan: '64.8 m',
      height: '17.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350-900-f',
    manufacturer_id: 'airbus',
    model: 'A350F',
    category: 'cargo',
    image: '/images/manufacturers/airbus/airbus-a350f.jpg',
    description: 'Dedicated freighter based on A350.',
    first_flight: 2025,
    specifications: {
      max_takeoff_weight: '319,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '8,700 km',
      capacity: 0,
      engines: 2,
      engine_type: 'RR Trent XWB-97',
      length: '70.8 m',
      wingspan: '64.8 m',
      height: '17.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350-900-acj',
    manufacturer_id: 'airbus',
    model: 'A350-900 ACJ',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-a350-900_acj.jpg',
    description: 'Longest range business jet.',
    first_flight: 2020,
    specifications: {
      max_takeoff_weight: '283,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '20,000 km',
      capacity: 25,
      engines: 2,
      engine_type: 'RR Trent XWB',
      length: '66.8 m',
      wingspan: '64.8 m',
      height: '17.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a350-1000-acj',
    manufacturer_id: 'airbus',
    model: 'A350-1000 ACJ',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-a350-1000_acj.jpg',
    description: 'Largest ACJ cabin.',
    first_flight: 2020,
    specifications: {
      max_takeoff_weight: '319,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '18,000 km',
      capacity: 25,
      engines: 2,
      engine_type: 'RR Trent XWB-97',
      length: '73.8 m',
      wingspan: '64.8 m',
      height: '17.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a380-800',
    manufacturer_id: 'airbus',
    model: 'A380-800',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-a380-800.jpg',
    description: 'Worlds largest passenger airliner.',
    first_flight: 2005,
    specifications: {
      max_takeoff_weight: '560,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '15,200 km',
      capacity: 525,
      engines: 4,
      engine_type: 'Engine Alliance GP7200',
      length: '72.7 m',
      wingspan: '79.8 m',
      height: '24.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a380-800f',
    manufacturer_id: 'airbus',
    model: 'A380-800F',
    category: 'cargo',
    image: '/images/manufacturers/airbus/airbus-a380-800f.jpg',
    description: 'Proposed freighter cancelled.',
    first_flight: 2006,
    specifications: {
      max_takeoff_weight: '590,000 kg',
      cruising_speed: 'Mach 0.85',
      range: '10,400 km',
      capacity: 0,
      engines: 4,
      engine_type: 'Engine Alliance GP7200',
      length: '72.7 m',
      wingspan: '79.8 m',
      height: '24.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj-220',
    manufacturer_id: 'airbus',
    model: 'ACJ TwoTwenty',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-acj_twotwenty.jpg',
    description: 'Newest ACJ based on A220.',
    first_flight: 2021,
    specifications: {
      max_takeoff_weight: '63,100 kg',
      cruising_speed: 'Mach 0.82',
      range: '10,460 km',
      capacity: 18,
      engines: 2,
      engine_type: 'PW PW1500G',
      length: '35.0 m',
      wingspan: '35.1 m',
      height: '11.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj-318',
    manufacturer_id: 'airbus',
    model: 'ACJ318',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-acj318.jpg',
    description: 'VIP configuration of A318.',
    first_flight: 2005,
    specifications: {
      max_takeoff_weight: '68,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '7,700 km',
      capacity: 14,
      engines: 2,
      engine_type: 'CFM56-5A1',
      length: '31.4 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj-319',
    manufacturer_id: 'airbus',
    model: 'ACJ319',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-acj319.jpg',
    description: 'Popular corporate jet A319.',
    first_flight: 1998,
    specifications: {
      max_takeoff_weight: '75,500 kg',
      cruising_speed: 'Mach 0.82',
      range: '11,100 km',
      capacity: 19,
      engines: 2,
      engine_type: 'CFM56-5A1',
      length: '33.8 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj-320',
    manufacturer_id: 'airbus',
    model: 'ACJ320',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-acj320.jpg',
    description: 'Corporate jet A320.',
    first_flight: 2005,
    specifications: {
      max_takeoff_weight: '73,500 kg',
      cruising_speed: 'Mach 0.82',
      range: '7,800 km',
      capacity: 19,
      engines: 2,
      engine_type: 'CFM56-5A1',
      length: '37.6 m',
      wingspan: '34.1 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj-321',
    manufacturer_id: 'airbus',
    model: 'ACJ321',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-acj321.jpg',
    description: 'Largest ACJ narrow-body.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '97,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '11,100 km',
      capacity: 19,
      engines: 2,
      engine_type: 'CFM LEAP-1A',
      length: '44.5 m',
      wingspan: '35.8 m',
      height: '11.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj-330',
    manufacturer_id: 'airbus',
    model: 'ACJ330',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-acj330.jpg',
    description: 'Wide-body VIP transport.',
    first_flight: 2001,
    specifications: {
      max_takeoff_weight: '242,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '17,700 km',
      capacity: 25,
      engines: 2,
      engine_type: 'CFM56-5A1',
      length: '63.7 m',
      wingspan: '60.3 m',
      height: '16.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj-340',
    manufacturer_id: 'airbus',
    model: 'ACJ340',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-acj340.jpg',
    description: 'Quadjet VIP transport.',
    first_flight: 1993,
    specifications: {
      max_takeoff_weight: '380,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '17,700 km',
      capacity: 25,
      engines: 4,
      engine_type: 'CFM56-5C4',
      length: '67.9 m',
      wingspan: '63.5 m',
      height: '17.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'acj-350',
    manufacturer_id: 'airbus',
    model: 'ACJ350',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-acj350.jpg',
    description: 'Latest wide-body ACJ.',
    first_flight: 2020,
    specifications: {
      max_takeoff_weight: '283,000 kg',
      cruising_speed: 'Mach 0.82',
      range: '20,000 km',
      capacity: 25,
      engines: 2,
      engine_type: 'RR Trent XWB',
      length: '66.8 m',
      wingspan: '64.8 m',
      height: '17.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'a400m',
    manufacturer_id: 'airbus',
    model: 'A400M Atlas',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-a400m.jpg',
    description: 'Military transport aircraft.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '141,000 kg',
      cruising_speed: 'Mach 0.68',
      range: '6,400 km',
      capacity: 116,
      engines: 4,
      engine_type: 'EuroProp TP400',
      length: '45.1 m',
      wingspan: '42.4 m',
      height: '14.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'c295',
    manufacturer_id: 'airbus',
    model: 'C295',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-c295.jpg',
    description: 'Tactical transport.',
    first_flight: 1997,
    specifications: {
      max_takeoff_weight: '23,200 kg',
      cruising_speed: 'Mach 0.52',
      range: '5,000 km',
      capacity: 73,
      engines: 2,
      engine_type: 'PWC PW127',
      length: '24.5 m',
      wingspan: '25.8 m',
      height: '8.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'cn235',
    manufacturer_id: 'airbus',
    model: 'CN-235',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-cn235.jpg',
    description: 'Medium-range military transport.',
    first_flight: 1983,
    specifications: {
      max_takeoff_weight: '16,100 kg',
      cruising_speed: 'Mach 0.47',
      range: '3,600 km',
      capacity: 51,
      engines: 2,
      engine_type: 'GE CT7',
      length: '21.4 m',
      wingspan: '25.8 m',
      height: '8.2 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'eurofighter',
    manufacturer_id: 'airbus',
    model: 'Eurofighter Typhoon',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-eurofighter_typhoon.jpg',
    description: 'Delta-wing multirole fighter.',
    first_flight: 1994,
    specifications: {
      max_takeoff_weight: '23,500 kg',
      cruising_speed: 'Mach 2.0',
      range: '3,790 km',
      capacity: 1,
      engines: 2,
      engine_type: 'Eurojet EJ200',
      length: '15.96 m',
      wingspan: '10.95 m',
      height: '5.28 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'neuron',
    manufacturer_id: 'airbus',
    model: 'nEUROn',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-neuron.jpg',
    description: 'European UCAV demonstrator.',
    first_flight: 2012,
    specifications: {
      max_takeoff_weight: '7,000 kg',
      cruising_speed: 'Mach 0.8',
      range: '1,500 km',
      capacity: 0,
      engines: 1,
      engine_type: 'RR Adour',
      length: '9.5 m',
      wingspan: '7.5 m',
      height: '2.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'tiger',
    manufacturer_id: 'airbus',
    model: 'Tiger',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-tiger.jpg',
    description: 'Attack helicopter.',
    first_flight: 1991,
    specifications: {
      max_takeoff_weight: '6,000 kg',
      cruising_speed: 'Mach 0.3',
      range: '800 km',
      capacity: 2,
      engines: 2,
      engine_type: 'MTR390',
      length: '14.0 m',
      wingspan: '13.0 m',
      height: '3.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h125',
    manufacturer_id: 'airbus',
    model: 'H125',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-h125.jpg',
    description: 'Single-engine light utility helicopter.',
    first_flight: 1974,
    specifications: {
      max_takeoff_weight: '2,250 kg',
      cruising_speed: '250 km/h',
      range: '680 km',
      capacity: 5,
      engines: 1,
      engine_type: 'Turbomeca Arriel 2D',
      length: '10.9 m',
      wingspan: '10.7 m',
      height: '3.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h130',
    manufacturer_id: 'airbus',
    model: 'H130',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-h130.jpg',
    description: 'Light helicopter with Fenestron tail.',
    first_flight: 1999,
    specifications: {
      max_takeoff_weight: '2,500 kg',
      cruising_speed: '230 km/h',
      range: '610 km',
      capacity: 7,
      engines: 1,
      engine_type: 'Turbomeca Arriel 2D',
      length: '10.7 m',
      wingspan: '10.7 m',
      height: '3.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h135',
    manufacturer_id: 'airbus',
    model: 'H135',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-h135.jpg',
    description: 'Twin-engine light helicopter.',
    first_flight: 1996,
    specifications: {
      max_takeoff_weight: '2,980 kg',
      cruising_speed: '254 km/h',
      range: '635 km',
      capacity: 7,
      engines: 2,
      engine_type: 'Turbomeca Arrius 2B2',
      length: '10.2 m',
      wingspan: '10.2 m',
      height: '3.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h145',
    manufacturer_id: 'airbus',
    model: 'H145',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-h145.jpg',
    description: 'Twin-engine light helicopter.',
    first_flight: 1999,
    specifications: {
      max_takeoff_weight: '3,700 kg',
      cruising_speed: '260 km/h',
      range: '680 km',
      capacity: 9,
      engines: 2,
      engine_type: 'Turbomeca Arriel 2E',
      length: '11.0 m',
      wingspan: '11.0 m',
      height: '3.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h145m',
    manufacturer_id: 'airbus',
    model: 'H145M',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-h145m.jpg',
    description: 'Military variant of H145.',
    first_flight: 2014,
    specifications: {
      max_takeoff_weight: '3,700 kg',
      cruising_speed: '260 km/h',
      range: '680 km',
      capacity: 10,
      engines: 2,
      engine_type: 'Turbomeca Arriel 2E',
      length: '11.0 m',
      wingspan: '11.0 m',
      height: '3.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h155',
    manufacturer_id: 'airbus',
    model: 'H155',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-h155.jpg',
    description: 'Medium twin-engine helicopter.',
    first_flight: 1999,
    specifications: {
      max_takeoff_weight: '4,920 kg',
      cruising_speed: '278 km/h',
      range: '857 km',
      capacity: 13,
      engines: 2,
      engine_type: 'Turbomeca Arriel 2C2',
      length: '14.3 m',
      wingspan: '12.0 m',
      height: '4.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h160',
    manufacturer_id: 'airbus',
    model: 'H160',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-h160.jpg',
    description: 'New-gen medium helicopter.',
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '6,050 kg',
      cruising_speed: '325 km/h',
      range: '880 km',
      capacity: 12,
      engines: 2,
      engine_type: 'Turbomeca Arrano',
      length: '13.7 m',
      wingspan: '11.8 m',
      height: '4.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h175',
    manufacturer_id: 'airbus',
    model: 'H175',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-h175.jpg',
    description: 'Medium twin-engine for offshore SAR.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '7,800 kg',
      cruising_speed: '324 km/h',
      range: '1,111 km',
      capacity: 18,
      engines: 2,
      engine_type: 'PWC PT6C-67E',
      length: '18.1 m',
      wingspan: '14.8 m',
      height: '5.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h215',
    manufacturer_id: 'airbus',
    model: 'H215',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-h215.jpg',
    description: 'Medium twin-engine utility.',
    first_flight: 1978,
    specifications: {
      max_takeoff_weight: '9,300 kg',
      cruising_speed: '327 km/h',
      range: '1,000 km',
      capacity: 19,
      engines: 2,
      engine_type: 'Turbomeca Makila 1A1',
      length: '18.7 m',
      wingspan: '16.2 m',
      height: '4.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h225',
    manufacturer_id: 'airbus',
    model: 'H225',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-h225.jpg',
    description: 'Super Puma successor.',
    first_flight: 2000,
    specifications: {
      max_takeoff_weight: '11,200 kg',
      cruising_speed: '324 km/h',
      range: '1,113 km',
      capacity: 19,
      engines: 2,
      engine_type: 'Turbomeca Makila 2A1',
      length: '19.5 m',
      wingspan: '16.2 m',
      height: '4.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'h225m',
    manufacturer_id: 'airbus',
    model: 'H225M Caracal',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-h225m.jpg',
    description: 'Military transport and CSAR.',
    first_flight: 2000,
    specifications: {
      max_takeoff_weight: '11,200 kg',
      cruising_speed: '324 km/h',
      range: '1,113 km',
      capacity: 28,
      engines: 2,
      engine_type: 'Turbomeca Makila 2A1',
      length: '19.5 m',
      wingspan: '16.2 m',
      height: '4.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'nh90',
    manufacturer_id: 'airbus',
    model: 'NH90',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-nh90.jpg',
    description: 'NATO Frigate Helicopter.',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '10,600 kg',
      cruising_speed: '300 km/h',
      range: '800 km',
      capacity: 20,
      engines: 2,
      engine_type: 'RR Turbomeca RTM322',
      length: '16.1 m',
      wingspan: '13.3 m',
      height: '5.2 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'as365',
    manufacturer_id: 'airbus',
    model: 'AS365 Dauphin',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-as365.jpg',
    description: 'Twin-engine light helicopter.',
    first_flight: 1975,
    specifications: {
      max_takeoff_weight: '4,300 kg',
      cruising_speed: '306 km/h',
      range: '820 km',
      capacity: 12,
      engines: 2,
      engine_type: 'Turbomeca Arriel 2C',
      length: '13.7 m',
      wingspan: '11.9 m',
      height: '4.0 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bo105',
    manufacturer_id: 'airbus',
    model: 'BO-105',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-bo105.jpg',
    description: 'Light twin-engine helicopter.',
    first_flight: 1967,
    specifications: {
      max_takeoff_weight: '2,500 kg',
      cruising_speed: '242 km/h',
      range: '572 km',
      capacity: 5,
      engines: 2,
      engine_type: 'Allison 250-C20',
      length: '8.6 m',
      wingspan: '9.8 m',
      height: '3.0 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bk117',
    manufacturer_id: 'airbus',
    model: 'BK-117',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-bk-117.jpg',
    description: 'Twin-engine light utility helicopter.',
    first_flight: 1979,
    specifications: {
      max_takeoff_weight: '3,350 kg',
      cruising_speed: '250 km/h',
      range: '745 km',
      capacity: 10,
      engines: 2,
      engine_type: 'Allison 250-C1',
      length: '9.9 m',
      wingspan: '11.0 m',
      height: '3.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'gazelle',
    manufacturer_id: 'airbus',
    model: 'Gazelle',
    category: 'helicopter',
    image: '/images/manufacturers/airbus/airbus-gazelle.jpg',
    description: 'Light utility helicopter.',
    first_flight: 1967,
    specifications: {
      max_takeoff_weight: '1,800 kg',
      cruising_speed: '310 km/h',
      range: '670 km',
      capacity: 5,
      engines: 1,
      engine_type: 'Turbomeca Astazou',
      length: '11.9 m',
      wingspan: '10.5 m',
      height: '3.2 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'cityairbus',
    manufacturer_id: 'airbus',
    model: 'CityAirbus',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-cityairbus.jpg',
    description: 'Urban air mobility demonstrator.',
    first_flight: 2019,
    specifications: {
      max_takeoff_weight: '2,200 kg',
      cruising_speed: '120 km/h',
      range: '100 km',
      capacity: 4,
      engines: 4,
      engine_type: 'Electric motors',
      length: '8.0 m',
      wingspan: '12.0 m',
      height: '3.0 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'vsr700',
    manufacturer_id: 'airbus',
    model: 'VSR700',
    category: 'military',
    image: '/images/manufacturers/airbus/airbus-vsr700.jpg',
    description: 'Autonomous naval VTOL drone.',
    first_flight: 2020,
    specifications: {
      max_takeoff_weight: '700 kg',
      cruising_speed: '200 km/h',
      range: '300 km',
      capacity: 0,
      engines: 1,
      engine_type: 'Turbomeca Arriel',
      length: '6.5 m',
      wingspan: '10.7 m',
      height: '2.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'bird-of-prey',
    manufacturer_id: 'airbus',
    model: 'Bird of Prey',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-bird-of-prey.jpg',
    description: 'Concept aircraft with biomimetic wing design.',
    first_flight: 2002,
    specifications: {
      max_takeoff_weight: 'N/A',
      cruising_speed: 'N/A',
      range: 'N/A',
      capacity: 0,
      engines: 0,
      engine_type: 'Concept',
      length: 'N/A',
      wingspan: 'N/A',
      height: 'N/A'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'zephyr',
    manufacturer_id: 'airbus',
    model: 'Zephyr',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-zephyr.jpg',
    description: 'High-altitude solar-powered UAV.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '65 kg',
      cruising_speed: '55 km/h',
      range: 'N/A',
      capacity: 0,
      engines: 0,
      engine_type: 'Solar electric',
      length: '25.0 m',
      wingspan: '25.0 m',
      height: 'N/A'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'capa-x',
    manufacturer_id: 'airbus',
    model: 'Capa-X',
    category: 'private',
    image: '/images/manufacturers/airbus/airbus-capa-x.jpg',
    description: 'Urban air mobility concept.',
    first_flight: 2024,
    specifications: {
      max_takeoff_weight: '2,000 kg',
      cruising_speed: '200 km/h',
      range: '150 km',
      capacity: 4,
      engines: 4,
      engine_type: 'Electric motors',
      length: '6.0 m',
      wingspan: '8.0 m',
      height: '2.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'concorde',
    manufacturer_id: 'airbus',
    model: 'Concorde',
    category: 'legacy',
    image: '/images/manufacturers/airbus/airbus-concorde.jpg',
    description: 'Supersonic passenger airliner Mach 2.04.',
    first_flight: 1969,
    specifications: {
      max_takeoff_weight: '185,070 kg',
      cruising_speed: 'Mach 2.04',
      range: '7,250 km',
      capacity: 100,
      engines: 4,
      engine_type: 'RR Snecma Olympus 593',
      length: '62.2 m',
      wingspan: '25.6 m',
      height: '12.2 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  }
,
  {
    id: 'b707-120',
    manufacturer_id: 'boeing',
    model: 'B707-120',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b707-120.jpg',
    description: 'First commercial jetliner from Boeing.',
    first_flight: 1957,
    specifications: {
      max_takeoff_weight: '111,130 kg',
      cruising_speed: 'Mach 0.88',
      range: '9,200 km',
      capacity: 179,
      engines: 4,
      engine_type: 'PW JT3C',
      length: '44.2 m',
      wingspan: '39.9 m',
      height: '12.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b707-320',
    manufacturer_id: 'boeing',
    model: 'B707-320',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b707-320.jpg',
    description: 'Intercontinental variant of the 707.',
    first_flight: 1958,
    specifications: {
      max_takeoff_weight: '151,318 kg',
      cruising_speed: 'Mach 0.88',
      range: '10,010 km',
      capacity: 189,
      engines: 4,
      engine_type: 'PW JT4A',
      length: '46.6 m',
      wingspan: '43.4 m',
      height: '12.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b707-320b',
    manufacturer_id: 'boeing',
    model: 'B707-320B',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b707-320b.jpg',
    description: 'Improved 707-320 with turbofans.',
    first_flight: 1962,
    specifications: {
      max_takeoff_weight: '151,318 kg',
      cruising_speed: 'Mach 0.88',
      range: '11,050 km',
      capacity: 189,
      engines: 4,
      engine_type: 'PW JT3D',
      length: '46.6 m',
      wingspan: '43.4 m',
      height: '12.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b707-320c',
    manufacturer_id: 'boeing',
    model: 'B707-320C',
    category: 'cargo',
    image: '/images/manufacturers/boeing/boeing-b707-320c.jpg',
    description: 'Convertible passenger freight variant.',
    first_flight: 1963,
    specifications: {
      max_takeoff_weight: '151,318 kg',
      cruising_speed: 'Mach 0.88',
      range: '9,800 km',
      capacity: 189,
      engines: 4,
      engine_type: 'PW JT3D',
      length: '46.6 m',
      wingspan: '43.4 m',
      height: '12.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b720',
    manufacturer_id: 'boeing',
    model: 'B720',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b720.jpg',
    description: 'Shorter-range 707 derivative.',
    first_flight: 1960,
    specifications: {
      max_takeoff_weight: '104,325 kg',
      cruising_speed: 'Mach 0.88',
      range: '9,700 km',
      capacity: 156,
      engines: 4,
      engine_type: 'PW JT3C',
      length: '41.4 m',
      wingspan: '39.9 m',
      height: '12.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b727-100',
    manufacturer_id: 'boeing',
    model: 'B727-100',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b727-100.jpg',
    description: 'Short trijet for short to medium routes.',
    first_flight: 1963,
    specifications: {
      max_takeoff_weight: '77,111 kg',
      cruising_speed: 'Mach 0.90',
      range: '3,500 km',
      capacity: 131,
      engines: 3,
      engine_type: 'PW JT8D',
      length: '40.6 m',
      wingspan: '32.9 m',
      height: '10.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b727-200',
    manufacturer_id: 'boeing',
    model: 'B727-200',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b727-200.jpg',
    description: 'Stretched 727 seating up to 189.',
    first_flight: 1967,
    specifications: {
      max_takeoff_weight: '95,028 kg',
      cruising_speed: 'Mach 0.90',
      range: '3,220 km',
      capacity: 189,
      engines: 3,
      engine_type: 'PW JT8D',
      length: '46.7 m',
      wingspan: '32.9 m',
      height: '10.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b727-200f',
    manufacturer_id: 'boeing',
    model: 'B727-200F',
    category: 'cargo',
    image: '/images/manufacturers/boeing/boeing-b727-200f.jpg',
    description: 'Dedicated freighter conversion.',
    first_flight: 1981,
    specifications: {
      max_takeoff_weight: '95,028 kg',
      cruising_speed: 'Mach 0.90',
      range: '3,000 km',
      capacity: 0,
      engines: 3,
      engine_type: 'PW JT8D',
      length: '46.7 m',
      wingspan: '32.9 m',
      height: '10.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-100',
    manufacturer_id: 'boeing',
    model: 'B737-100',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b737-100.jpg',
    description: 'Original 737 seating 103.',
    first_flight: 1967,
    specifications: {
      max_takeoff_weight: '50,350 kg',
      cruising_speed: 'Mach 0.74',
      range: '3,600 km',
      capacity: 103,
      engines: 2,
      engine_type: 'PW JT8D',
      length: '28.6 m',
      wingspan: '28.3 m',
      height: '11.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-200',
    manufacturer_id: 'boeing',
    model: 'B737-200',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b737-200.jpg',
    description: 'Improved 737 with higher weights.',
    first_flight: 1968,
    specifications: {
      max_takeoff_weight: '58,740 kg',
      cruising_speed: 'Mach 0.74',
      range: '4,020 km',
      capacity: 130,
      engines: 2,
      engine_type: 'PW JT8D',
      length: '30.5 m',
      wingspan: '28.3 m',
      height: '11.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-200f',
    manufacturer_id: 'boeing',
    model: 'B737-200F',
    category: 'cargo',
    image: '/images/manufacturers/boeing/boeing-b737-200f.jpg',
    description: 'Freighter conversion of 737-200.',
    first_flight: 1975,
    specifications: {
      max_takeoff_weight: '58,740 kg',
      cruising_speed: 'Mach 0.74',
      range: '3,200 km',
      capacity: 0,
      engines: 2,
      engine_type: 'PW JT8D',
      length: '30.5 m',
      wingspan: '28.3 m',
      height: '11.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-300',
    manufacturer_id: 'boeing',
    model: 'B737-300',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b737-300.jpg',
    description: 'Classic 737 with CFM56 engines.',
    first_flight: 1980,
    specifications: {
      max_takeoff_weight: '62,822 kg',
      cruising_speed: 'Mach 0.74',
      range: '4,400 km',
      capacity: 149,
      engines: 2,
      engine_type: 'CFM56-3',
      length: '33.4 m',
      wingspan: '28.9 m',
      height: '11.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-400',
    manufacturer_id: 'boeing',
    model: 'B737-400',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b737-400.jpg',
    description: 'Stretched 737 Classic seating 188.',
    first_flight: 1984,
    specifications: {
      max_takeoff_weight: '68,038 kg',
      cruising_speed: 'Mach 0.74',
      range: '4,000 km',
      capacity: 188,
      engines: 2,
      engine_type: 'CFM56-3',
      length: '36.5 m',
      wingspan: '28.9 m',
      height: '11.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-500',
    manufacturer_id: 'boeing',
    model: 'B737-500',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b737-500.jpg',
    description: 'Shortened 737 Classic seating 132.',
    first_flight: 1987,
    specifications: {
      max_takeoff_weight: '60,554 kg',
      cruising_speed: 'Mach 0.74',
      range: '4,400 km',
      capacity: 132,
      engines: 2,
      engine_type: 'CFM56-3',
      length: '31.0 m',
      wingspan: '28.9 m',
      height: '11.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-600',
    manufacturer_id: 'boeing',
    model: 'B737-600',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b737-600.jpg',
    description: 'Shortest 737 NG seating 132.',
    first_flight: 1998,
    specifications: {
      max_takeoff_weight: '65,090 kg',
      cruising_speed: 'Mach 0.78',
      range: '5,648 km',
      capacity: 132,
      engines: 2,
      engine_type: 'CFM56-7',
      length: '31.2 m',
      wingspan: '34.3 m',
      height: '12.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-700',
    manufacturer_id: 'boeing',
    model: 'B737-700',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-b737-700.jpg',
    description: 'Base 737 NG seating 149.',
    first_flight: 1997,
    specifications: {
      max_takeoff_weight: '70,080 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,230 km',
      capacity: 149,
      engines: 2,
      engine_type: 'CFM56-7',
      length: '33.6 m',
      wingspan: '34.3 m',
      height: '12.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-800',
    manufacturer_id: 'boeing',
    model: 'B737-800',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-b737-800.jpg',
    description: 'Stretched 737 NG seating 189.',
    first_flight: 1997,
    specifications: {
      max_takeoff_weight: '79,010 kg',
      cruising_speed: 'Mach 0.78',
      range: '5,665 km',
      capacity: 189,
      engines: 2,
      engine_type: 'CFM56-7',
      length: '39.5 m',
      wingspan: '34.3 m',
      height: '12.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-900',
    manufacturer_id: 'boeing',
    model: 'B737-900',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-b737-900.jpg',
    description: 'Longest 737 NG seating 189.',
    first_flight: 2000,
    specifications: {
      max_takeoff_weight: '85,130 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,045 km',
      capacity: 189,
      engines: 2,
      engine_type: 'CFM56-7',
      length: '42.1 m',
      wingspan: '34.3 m',
      height: '12.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-900er',
    manufacturer_id: 'boeing',
    model: 'B737-900ER',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-b737-900er.jpg',
    description: 'Extended range 737-900.',
    first_flight: 2006,
    specifications: {
      max_takeoff_weight: '85,130 kg',
      cruising_speed: 'Mach 0.78',
      range: '6,045 km',
      capacity: 220,
      engines: 2,
      engine_type: 'CFM56-7',
      length: '42.1 m',
      wingspan: '34.3 m',
      height: '12.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-max7',
    manufacturer_id: 'boeing',
    model: '737 MAX 7',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-737_max_7.jpg',
    description: 'Shortest 737 MAX seating 172.',
    first_flight: 2018,
    specifications: {
      max_takeoff_weight: '80,286 kg',
      cruising_speed: 'Mach 0.79',
      range: '7,130 km',
      capacity: 172,
      engines: 2,
      engine_type: 'CFM LEAP-1B',
      length: '35.6 m',
      wingspan: '35.9 m',
      height: '12.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-max8',
    manufacturer_id: 'boeing',
    model: '737 MAX 8',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-737_max_8.jpg',
    description: 'Base 737 MAX seating 210.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '82,191 kg',
      cruising_speed: 'Mach 0.79',
      range: '6,570 km',
      capacity: 210,
      engines: 2,
      engine_type: 'CFM LEAP-1B',
      length: '39.5 m',
      wingspan: '35.9 m',
      height: '12.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-max9',
    manufacturer_id: 'boeing',
    model: '737 MAX 9',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-737_max_9.jpg',
    description: 'Stretched 737 MAX seating 220.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '88,314 kg',
      cruising_speed: 'Mach 0.79',
      range: '6,570 km',
      capacity: 220,
      engines: 2,
      engine_type: 'CFM LEAP-1B',
      length: '42.1 m',
      wingspan: '35.9 m',
      height: '12.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-max10',
    manufacturer_id: 'boeing',
    model: '737 MAX 10',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-737_max_10.jpg',
    description: 'Longest 737 MAX seating 230.',
    first_flight: 2021,
    specifications: {
      max_takeoff_weight: '89,790 kg',
      cruising_speed: 'Mach 0.79',
      range: '6,110 km',
      capacity: 230,
      engines: 2,
      engine_type: 'CFM LEAP-1B',
      length: '43.8 m',
      wingspan: '35.9 m',
      height: '12.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-700-bbj',
    manufacturer_id: 'boeing',
    model: 'BBJ 737-700',
    category: 'private',
    image: '/images/manufacturers/boeing/boeing-bbj_737-700.jpg',
    description: 'Business jet based on 737-700.',
    first_flight: 1998,
    specifications: {
      max_takeoff_weight: '77,564 kg',
      cruising_speed: 'Mach 0.78',
      range: '11,480 km',
      capacity: 19,
      engines: 2,
      engine_type: 'CFM56-7',
      length: '33.6 m',
      wingspan: '34.3 m',
      height: '12.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-800-bbj',
    manufacturer_id: 'boeing',
    model: 'BBJ 737-800',
    category: 'private',
    image: '/images/manufacturers/boeing/boeing-bbj_737-800.jpg',
    description: 'Business jet based on 737-800.',
    first_flight: 1999,
    specifications: {
      max_takeoff_weight: '79,010 kg',
      cruising_speed: 'Mach 0.78',
      range: '11,480 km',
      capacity: 19,
      engines: 2,
      engine_type: 'CFM56-7',
      length: '39.5 m',
      wingspan: '34.3 m',
      height: '12.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-max8-bbj',
    manufacturer_id: 'boeing',
    model: 'BBJ MAX 8',
    category: 'private',
    image: '/images/manufacturers/boeing/boeing-bbj_max_8.jpg',
    description: 'Business jet based on 737 MAX 8.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '82,191 kg',
      cruising_speed: 'Mach 0.79',
      range: '11,710 km',
      capacity: 19,
      engines: 2,
      engine_type: 'CFM LEAP-1B',
      length: '39.5 m',
      wingspan: '35.9 m',
      height: '12.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b737-max9-bbj',
    manufacturer_id: 'boeing',
    model: 'BBJ MAX 9',
    category: 'private',
    image: '/images/manufacturers/boeing/boeing-bbj_max_9.jpg',
    description: 'Business jet based on 737 MAX 9.',
    first_flight: 2019,
    specifications: {
      max_takeoff_weight: '88,314 kg',
      cruising_speed: 'Mach 0.79',
      range: '11,710 km',
      capacity: 19,
      engines: 2,
      engine_type: 'CFM LEAP-1B',
      length: '42.1 m',
      wingspan: '35.9 m',
      height: '12.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-100',
    manufacturer_id: 'boeing',
    model: 'B747-100',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b747-100.jpg',
    description: 'Original Jumbo Jet seating 452.',
    first_flight: 1969,
    specifications: {
      max_takeoff_weight: '333,390 kg',
      cruising_speed: 'Mach 0.85',
      range: '9,800 km',
      capacity: 452,
      engines: 4,
      engine_type: 'PW JT9D',
      length: '70.7 m',
      wingspan: '59.6 m',
      height: '19.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-200',
    manufacturer_id: 'boeing',
    model: 'B747-200',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b747-200.jpg',
    description: 'Higher weight Jumbo Jet.',
    first_flight: 1971,
    specifications: {
      max_takeoff_weight: '377,840 kg',
      cruising_speed: 'Mach 0.85',
      range: '10,650 km',
      capacity: 400,
      engines: 4,
      engine_type: 'PW JT9D',
      length: '70.7 m',
      wingspan: '59.6 m',
      height: '19.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-300',
    manufacturer_id: 'boeing',
    model: 'B747-300',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b747-300.jpg',
    description: 'Stretched upper deck Jumbo Jet.',
    first_flight: 1982,
    specifications: {
      max_takeoff_weight: '377,840 kg',
      cruising_speed: 'Mach 0.85',
      range: '12,400 km',
      capacity: 660,
      engines: 4,
      engine_type: 'PW JT9D',
      length: '70.7 m',
      wingspan: '59.6 m',
      height: '19.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-400',
    manufacturer_id: 'boeing',
    model: 'B747-400',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b747-400.jpg',
    description: 'Glass cockpit two-crew Jumbo Jet.',
    first_flight: 1988,
    specifications: {
      max_takeoff_weight: '412,769 kg',
      cruising_speed: 'Mach 0.85',
      range: '13,450 km',
      capacity: 660,
      engines: 4,
      engine_type: 'PW PW4000',
      length: '70.7 m',
      wingspan: '64.4 m',
      height: '19.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-400f',
    manufacturer_id: 'boeing',
    model: 'B747-400F',
    category: 'cargo',
    image: '/images/manufacturers/boeing/boeing-b747-400f.jpg',
    description: 'Dedicated freighter 747-400.',
    first_flight: 1993,
    specifications: {
      max_takeoff_weight: '412,769 kg',
      cruising_speed: 'Mach 0.85',
      range: '8,230 km',
      capacity: 0,
      engines: 4,
      engine_type: 'PW PW4000',
      length: '70.7 m',
      wingspan: '64.4 m',
      height: '19.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-400erf',
    manufacturer_id: 'boeing',
    model: 'B747-400ERF',
    category: 'cargo',
    image: '/images/manufacturers/boeing/boeing-b747-400erf.jpg',
    description: 'Extended range freighter.',
    first_flight: 2002,
    specifications: {
      max_takeoff_weight: '412,769 kg',
      cruising_speed: 'Mach 0.85',
      range: '9,200 km',
      capacity: 0,
      engines: 4,
      engine_type: 'PW PW4000',
      length: '70.7 m',
      wingspan: '64.4 m',
      height: '19.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-400m',
    manufacturer_id: 'boeing',
    model: 'B747-400M',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b747-400m.jpg',
    description: 'Combi passenger/freight variant.',
    first_flight: 1989,
    specifications: {
      max_takeoff_weight: '412,769 kg',
      cruising_speed: 'Mach 0.85',
      range: '13,270 km',
      capacity: 660,
      engines: 4,
      engine_type: 'PW PW4000',
      length: '70.7 m',
      wingspan: '64.4 m',
      height: '19.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-400d',
    manufacturer_id: 'boeing',
    model: 'B747-400D',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b747-400d.jpg',
    description: 'Domestic high-capacity variant.',
    first_flight: 1988,
    specifications: {
      max_takeoff_weight: '412,769 kg',
      cruising_speed: 'Mach 0.85',
      range: '13,450 km',
      capacity: 660,
      engines: 4,
      engine_type: 'PW PW4000',
      length: '70.7 m',
      wingspan: '64.4 m',
      height: '19.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-8i',
    manufacturer_id: 'boeing',
    model: '747-8 Intercontinental',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-747-8_intercontinental.jpg',
    description: 'Latest passenger 747 seating 605.',
    first_flight: 2011,
    specifications: {
      max_takeoff_weight: '442,253 kg',
      cruising_speed: 'Mach 0.855',
      range: '14,815 km',
      capacity: 605,
      engines: 4,
      engine_type: 'GE GEnx',
      length: '76.3 m',
      wingspan: '68.4 m',
      height: '19.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-8f',
    manufacturer_id: 'boeing',
    model: '747-8F',
    category: 'cargo',
    image: '/images/manufacturers/boeing/boeing-747-8f.jpg',
    description: 'Latest freighter 747.',
    first_flight: 2011,
    specifications: {
      max_takeoff_weight: '442,253 kg',
      cruising_speed: 'Mach 0.855',
      range: '8,130 km',
      capacity: 0,
      engines: 4,
      engine_type: 'GE GEnx',
      length: '76.3 m',
      wingspan: '68.4 m',
      height: '19.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-sp',
    manufacturer_id: 'boeing',
    model: 'B747SP',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b747sp.jpg',
    description: 'Short body long range 747.',
    first_flight: 1975,
    specifications: {
      max_takeoff_weight: '317,466 kg',
      cruising_speed: 'Mach 0.88',
      range: '12,320 km',
      capacity: 375,
      engines: 4,
      engine_type: 'PW JT9D',
      length: '56.3 m',
      wingspan: '59.6 m',
      height: '19.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-400-bbj',
    manufacturer_id: 'boeing',
    model: 'BBJ 747-400',
    category: 'private',
    image: '/images/manufacturers/boeing/boeing-bbj_747-400.jpg',
    description: 'VIP 747-400.',
    first_flight: 1996,
    specifications: {
      max_takeoff_weight: '412,769 kg',
      cruising_speed: 'Mach 0.85',
      range: '14,815 km',
      capacity: 19,
      engines: 4,
      engine_type: 'PW PW4000',
      length: '70.7 m',
      wingspan: '64.4 m',
      height: '19.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b747-8-bbj',
    manufacturer_id: 'boeing',
    model: 'BBJ 747-8',
    category: 'private',
    image: '/images/manufacturers/boeing/boeing-bbj_747-8.jpg',
    description: 'VIP 747-8.',
    first_flight: 2011,
    specifications: {
      max_takeoff_weight: '442,253 kg',
      cruising_speed: 'Mach 0.855',
      range: '17,020 km',
      capacity: 19,
      engines: 4,
      engine_type: 'GE GEnx',
      length: '76.3 m',
      wingspan: '68.4 m',
      height: '19.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b757-200',
    manufacturer_id: 'boeing',
    model: '757-200',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-757-200.jpg',
    description: 'Narrow-body for medium routes seating 239.',
    first_flight: 1982,
    specifications: {
      max_takeoff_weight: '115,680 kg',
      cruising_speed: 'Mach 0.80',
      range: '7,222 km',
      capacity: 239,
      engines: 2,
      engine_type: 'RR RB211',
      length: '47.3 m',
      wingspan: '38.1 m',
      height: '13.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b757-200f',
    manufacturer_id: 'boeing',
    model: '757-200F',
    category: 'cargo',
    image: '/images/manufacturers/boeing/boeing-757-200f.jpg',
    description: 'Dedicated freighter 757-200.',
    first_flight: 1987,
    specifications: {
      max_takeoff_weight: '115,680 kg',
      cruising_speed: 'Mach 0.80',
      range: '5,834 km',
      capacity: 0,
      engines: 2,
      engine_type: 'RR RB211',
      length: '47.3 m',
      wingspan: '38.1 m',
      height: '13.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b757-200-mrtt',
    manufacturer_id: 'boeing',
    model: '757-200 MRTT',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-757-200_mrtt.jpg',
    description: 'Multi-role tanker transport.',
    first_flight: 1984,
    specifications: {
      max_takeoff_weight: '115,680 kg',
      cruising_speed: 'Mach 0.80',
      range: '7,222 km',
      capacity: 0,
      engines: 2,
      engine_type: 'RR RB211',
      length: '47.3 m',
      wingspan: '38.1 m',
      height: '13.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b757-300',
    manufacturer_id: 'boeing',
    model: '757-300',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-757-300.jpg',
    description: 'Stretched 757 seating 289.',
    first_flight: 1998,
    specifications: {
      max_takeoff_weight: '123,831 kg',
      cruising_speed: 'Mach 0.80',
      range: '6,287 km',
      capacity: 289,
      engines: 2,
      engine_type: 'RR RB211',
      length: '54.4 m',
      wingspan: '38.1 m',
      height: '13.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b767-200',
    manufacturer_id: 'boeing',
    model: '767-200',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-767-200.jpg',
    description: 'First wide-body twinjet from Boeing.',
    first_flight: 1981,
    specifications: {
      max_takeoff_weight: '143,789 kg',
      cruising_speed: 'Mach 0.80',
      range: '7,300 km',
      capacity: 216,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '48.5 m',
      wingspan: '47.6 m',
      height: '15.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b767-200er',
    manufacturer_id: 'boeing',
    model: '767-200ER',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-767-200er.jpg',
    description: 'Extended range 767-200.',
    first_flight: 1984,
    specifications: {
      max_takeoff_weight: '179,170 kg',
      cruising_speed: 'Mach 0.80',
      range: '12,200 km',
      capacity: 216,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '48.5 m',
      wingspan: '47.6 m',
      height: '15.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b767-300',
    manufacturer_id: 'boeing',
    model: '767-300',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-767-300.jpg',
    description: 'Stretched 767 seating 269.',
    first_flight: 1986,
    specifications: {
      max_takeoff_weight: '158,758 kg',
      cruising_speed: 'Mach 0.80',
      range: '7,100 km',
      capacity: 269,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '54.9 m',
      wingspan: '47.6 m',
      height: '15.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b767-300er',
    manufacturer_id: 'boeing',
    model: '767-300ER',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-b767-300er.jpg',
    description: 'Extended range 767-300.',
    first_flight: 1986,
    specifications: {
      max_takeoff_weight: '186,880 kg',
      cruising_speed: 'Mach 0.80',
      range: '11,070 km',
      capacity: 269,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '54.9 m',
      wingspan: '47.6 m',
      height: '15.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b767-300f',
    manufacturer_id: 'boeing',
    model: '767-300F',
    category: 'cargo',
    image: '/images/manufacturers/boeing/boeing-767-300f.jpg',
    description: 'Dedicated freighter 767-300.',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '186,880 kg',
      cruising_speed: 'Mach 0.80',
      range: '6,025 km',
      capacity: 0,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '54.9 m',
      wingspan: '47.6 m',
      height: '15.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b767-400er',
    manufacturer_id: 'boeing',
    model: '767-400ER',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-767-400er.jpg',
    description: 'Further stretched 767 seating 304.',
    first_flight: 1999,
    specifications: {
      max_takeoff_weight: '204,120 kg',
      cruising_speed: 'Mach 0.80',
      range: '10,415 km',
      capacity: 304,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '61.4 m',
      wingspan: '51.9 m',
      height: '16.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b767-200-bbj',
    manufacturer_id: 'boeing',
    model: 'BBJ 767-200',
    category: 'private',
    image: '/images/manufacturers/boeing/boeing-bbj_767-200.jpg',
    description: 'VIP 767-200.',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '143,789 kg',
      cruising_speed: 'Mach 0.80',
      range: '12,200 km',
      capacity: 19,
      engines: 2,
      engine_type: 'GE CF6-80',
      length: '48.5 m',
      wingspan: '47.6 m',
      height: '15.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777-200',
    manufacturer_id: 'boeing',
    model: '777-200',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-777-200.jpg',
    description: 'First fly-by-wire Boeing seating 305.',
    first_flight: 1994,
    specifications: {
      max_takeoff_weight: '247,210 kg',
      cruising_speed: 'Mach 0.84',
      range: '9,700 km',
      capacity: 305,
      engines: 2,
      engine_type: 'GE GE90',
      length: '63.7 m',
      wingspan: '60.9 m',
      height: '18.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777-200er',
    manufacturer_id: 'boeing',
    model: '777-200ER',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-777-200er.jpg',
    description: 'Extended range 777-200.',
    first_flight: 1996,
    specifications: {
      max_takeoff_weight: '297,560 kg',
      cruising_speed: 'Mach 0.84',
      range: '14,260 km',
      capacity: 305,
      engines: 2,
      engine_type: 'GE GE90',
      length: '63.7 m',
      wingspan: '60.9 m',
      height: '18.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777-200lr',
    manufacturer_id: 'boeing',
    model: '777-200LR',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-777-200lr.jpg',
    description: 'Ultra-long range 777.',
    first_flight: 2005,
    specifications: {
      max_takeoff_weight: '347,450 kg',
      cruising_speed: 'Mach 0.84',
      range: '17,370 km',
      capacity: 301,
      engines: 2,
      engine_type: 'GE GE90-110B',
      length: '63.7 m',
      wingspan: '64.8 m',
      height: '18.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777-300',
    manufacturer_id: 'boeing',
    model: '777-300',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-777-300.jpg',
    description: 'Stretched 777 seating 368.',
    first_flight: 1997,
    specifications: {
      max_takeoff_weight: '299,370 kg',
      cruising_speed: 'Mach 0.84',
      range: '11,120 km',
      capacity: 368,
      engines: 2,
      engine_type: 'GE GE90',
      length: '73.9 m',
      wingspan: '60.9 m',
      height: '18.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777-300er',
    manufacturer_id: 'boeing',
    model: '777-300ER',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-b777-300er.jpg',
    description: 'Extended range 777-300.',
    first_flight: 2003,
    specifications: {
      max_takeoff_weight: '351,534 kg',
      cruising_speed: 'Mach 0.84',
      range: '13,650 km',
      capacity: 368,
      engines: 2,
      engine_type: 'GE GE90-115B',
      length: '73.9 m',
      wingspan: '64.8 m',
      height: '18.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777f',
    manufacturer_id: 'boeing',
    model: '777F',
    category: 'cargo',
    image: '/images/manufacturers/boeing/boeing-777f.jpg',
    description: 'Dedicated freighter based on 777-200LR.',
    first_flight: 2008,
    specifications: {
      max_takeoff_weight: '347,450 kg',
      cruising_speed: 'Mach 0.84',
      range: '9,038 km',
      capacity: 0,
      engines: 2,
      engine_type: 'GE GE90-110B',
      length: '63.7 m',
      wingspan: '64.8 m',
      height: '18.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777-8',
    manufacturer_id: 'boeing',
    model: '777-8',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-777-8.jpg',
    description: 'Next-gen stretched 777 with folding wingtips.',
    first_flight: 2025,
    specifications: {
      max_takeoff_weight: '351,500 kg',
      cruising_speed: 'Mach 0.84',
      range: '16,190 km',
      capacity: 384,
      engines: 2,
      engine_type: 'GE GE9X',
      length: '73.7 m',
      wingspan: '71.8 m',
      height: '18.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777-9',
    manufacturer_id: 'boeing',
    model: '777-9',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-777-9.jpg',
    description: 'Next-gen longest 777 with folding wingtips.',
    first_flight: 2025,
    specifications: {
      max_takeoff_weight: '351,500 kg',
      cruising_speed: 'Mach 0.84',
      range: '13,500 km',
      capacity: 426,
      engines: 2,
      engine_type: 'GE GE9X',
      length: '76.7 m',
      wingspan: '71.8 m',
      height: '18.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777-200-bbj',
    manufacturer_id: 'boeing',
    model: 'BBJ 777-200',
    category: 'private',
    image: '/images/manufacturers/boeing/boeing-bbj_777-200.jpg',
    description: 'VIP 777-200.',
    first_flight: 1998,
    specifications: {
      max_takeoff_weight: '247,210 kg',
      cruising_speed: 'Mach 0.84',
      range: '14,260 km',
      capacity: 19,
      engines: 2,
      engine_type: 'GE GE90',
      length: '63.7 m',
      wingspan: '60.9 m',
      height: '18.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b777-300-bbj',
    manufacturer_id: 'boeing',
    model: 'BBJ 777-300',
    category: 'private',
    image: '/images/manufacturers/boeing/boeing-bbj_777-300.jpg',
    description: 'VIP 777-300.',
    first_flight: 2004,
    specifications: {
      max_takeoff_weight: '351,534 kg',
      cruising_speed: 'Mach 0.84',
      range: '13,650 km',
      capacity: 19,
      engines: 2,
      engine_type: 'GE GE90-115B',
      length: '73.9 m',
      wingspan: '64.8 m',
      height: '18.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b787-8',
    manufacturer_id: 'boeing',
    model: '787-8 Dreamliner',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-787-8_dreamliner.jpg',
    description: 'First composite airliner seating 248.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '227,930 kg',
      cruising_speed: 'Mach 0.85',
      range: '13,620 km',
      capacity: 248,
      engines: 2,
      engine_type: 'GE GEnx',
      length: '56.7 m',
      wingspan: '60.1 m',
      height: '16.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b787-9',
    manufacturer_id: 'boeing',
    model: '787-9 Dreamliner',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-787-9_dreamliner.jpg',
    description: 'Stretched Dreamliner seating 296.',
    first_flight: 2013,
    specifications: {
      max_takeoff_weight: '254,011 kg',
      cruising_speed: 'Mach 0.85',
      range: '14,010 km',
      capacity: 296,
      engines: 2,
      engine_type: 'GE GEnx',
      length: '63.0 m',
      wingspan: '60.1 m',
      height: '17.0 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b787-10',
    manufacturer_id: 'boeing',
    model: '787-10 Dreamliner',
    category: 'commercial',
    image: '/images/manufacturers/boeing/boeing-787-10_dreamliner.jpg',
    description: 'Further stretched Dreamliner seating 336.',
    first_flight: 2017,
    specifications: {
      max_takeoff_weight: '254,011 kg',
      cruising_speed: 'Mach 0.85',
      range: '11,730 km',
      capacity: 336,
      engines: 2,
      engine_type: 'GE GEnx',
      length: '68.3 m',
      wingspan: '60.1 m',
      height: '17.0 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b787-8-bbj',
    manufacturer_id: 'boeing',
    model: 'BBJ 787-8',
    category: 'private',
    image: '/images/manufacturers/boeing/boeing-bbj_787-8.jpg',
    description: 'VIP 787-8.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '227,930 kg',
      cruising_speed: 'Mach 0.85',
      range: '17,220 km',
      capacity: 19,
      engines: 2,
      engine_type: 'GE GEnx',
      length: '56.7 m',
      wingspan: '60.1 m',
      height: '16.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b787-9-bbj',
    manufacturer_id: 'boeing',
    model: 'BBJ 787-9',
    category: 'private',
    image: '/images/manufacturers/boeing/boeing-bbj_787-9.jpg',
    description: 'VIP 787-9.',
    first_flight: 2014,
    specifications: {
      max_takeoff_weight: '254,011 kg',
      cruising_speed: 'Mach 0.85',
      range: '17,960 km',
      capacity: 19,
      engines: 2,
      engine_type: 'GE GEnx',
      length: '63.0 m',
      wingspan: '60.1 m',
      height: '17.0 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b377',
    manufacturer_id: 'boeing',
    model: 'B377 Stratocruiser',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b377.jpg',
    description: 'Post-war propeller airliner.',
    first_flight: 1947,
    specifications: {
      max_takeoff_weight: '67,133 kg',
      cruising_speed: '480 km/h',
      range: '6,290 km',
      capacity: 100,
      engines: 4,
      engine_type: 'PW R-4360',
      length: '33.6 m',
      wingspan: '43.1 m',
      height: '11.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b247',
    manufacturer_id: 'boeing',
    model: 'B247',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b247.jpg',
    description: 'Early all-metal monoplane airliner.',
    first_flight: 1933,
    specifications: {
      max_takeoff_weight: '26,308 kg',
      cruising_speed: '320 km/h',
      range: '1,200 km',
      capacity: 10,
      engines: 4,
      engine_type: 'PW Wasp',
      length: '15.2 m',
      wingspan: '22.9 m',
      height: '3.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b314',
    manufacturer_id: 'boeing',
    model: 'B314 Clipper',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b314.jpg',
    description: 'Long-range flying boat.',
    first_flight: 1938,
    specifications: {
      max_takeoff_weight: '38,102 kg',
      cruising_speed: '320 km/h',
      range: '5,700 km',
      capacity: 74,
      engines: 4,
      engine_type: 'PW R-1830',
      length: '32.3 m',
      wingspan: '46.3 m',
      height: '8.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'f15ex',
    manufacturer_id: 'boeing',
    model: 'F-15EX Eagle II',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-f15ex.jpg',
    description: 'Latest variant of F-15 fighter.',
    first_flight: 2021,
    specifications: {
      max_takeoff_weight: '36,741 kg',
      cruising_speed: 'Mach 2.5',
      range: '2,100 km',
      capacity: 2,
      engines: 2,
      engine_type: 'GE F110-GE-129',
      length: '19.4 m',
      wingspan: '13.1 m',
      height: '5.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'f15e',
    manufacturer_id: 'boeing',
    model: 'F-15E Strike Eagle',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-f-15e_strike_eagle.jpg',
    description: 'Dual-role fighter bomber.',
    first_flight: 1986,
    specifications: {
      max_takeoff_weight: '36,741 kg',
      cruising_speed: 'Mach 2.5',
      range: '2,100 km',
      capacity: 2,
      engines: 2,
      engine_type: 'PW F100-PW-229',
      length: '19.4 m',
      wingspan: '13.1 m',
      height: '5.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'fa18e',
    manufacturer_id: 'boeing',
    model: 'F/A-18E Super Hornet',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-fa18e.jpg',
    description: 'Carrier-based multirole fighter.',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '29,937 kg',
      cruising_speed: 'Mach 1.8',
      range: '2,346 km',
      capacity: 2,
      engines: 2,
      engine_type: 'GE F414-GE-400',
      length: '18.3 m',
      wingspan: '13.6 m',
      height: '4.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'fa18f',
    manufacturer_id: 'boeing',
    model: 'F/A-18F Super Hornet',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-fa18f.jpg',
    description: 'Two-seat Super Hornet.',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '29,937 kg',
      cruising_speed: 'Mach 1.8',
      range: '2,346 km',
      capacity: 2,
      engines: 2,
      engine_type: 'GE F414-GE-400',
      length: '18.3 m',
      wingspan: '13.6 m',
      height: '4.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b52h',
    manufacturer_id: 'boeing',
    model: 'B-52H Stratofortress',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-b52h.jpg',
    description: 'Long-range strategic bomber.',
    first_flight: 1961,
    specifications: {
      max_takeoff_weight: '220,000 kg',
      cruising_speed: 'Mach 0.86',
      range: '14,080 km',
      capacity: 5,
      engines: 8,
      engine_type: 'PW TF33-P-3',
      length: '48.5 m',
      wingspan: '56.4 m',
      height: '12.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'c17',
    manufacturer_id: 'boeing',
    model: 'C-17 Globemaster III',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-c17.jpg',
    description: 'Large military transport.',
    first_flight: 1991,
    specifications: {
      max_takeoff_weight: '265,352 kg',
      cruising_speed: 'Mach 0.74',
      range: '4,480 km',
      capacity: 134,
      engines: 4,
      engine_type: 'PW F117-PW-100',
      length: '53.0 m',
      wingspan: '51.7 m',
      height: '16.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'ah64',
    manufacturer_id: 'boeing',
    model: 'AH-64 Apache',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-ah64.jpg',
    description: 'Attack helicopter.',
    first_flight: 1975,
    specifications: {
      max_takeoff_weight: '10,433 kg',
      cruising_speed: '293 km/h',
      range: '476 km',
      capacity: 2,
      engines: 2,
      engine_type: 'GE T700-GE-701',
      length: '17.7 m',
      wingspan: '14.6 m',
      height: '4.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'ah64e',
    manufacturer_id: 'boeing',
    model: 'AH-64E Guardian',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-ah64e.jpg',
    description: 'Latest Apache variant.',
    first_flight: 2011,
    specifications: {
      max_takeoff_weight: '10,433 kg',
      cruising_speed: '293 km/h',
      range: '476 km',
      capacity: 2,
      engines: 2,
      engine_type: 'GE T700-GE-701D',
      length: '17.7 m',
      wingspan: '14.6 m',
      height: '4.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'ch47',
    manufacturer_id: 'boeing',
    model: 'CH-47 Chinook',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-ch47.jpg',
    description: 'Tandem rotor heavy-lift helicopter.',
    first_flight: 1961,
    specifications: {
      max_takeoff_weight: '22,680 kg',
      cruising_speed: '315 km/h',
      range: '400 km',
      capacity: 55,
      engines: 2,
      engine_type: 'Honeywell T55-GA-714',
      length: '30.1 m',
      wingspan: '18.3 m',
      height: '5.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'ch47f',
    manufacturer_id: 'boeing',
    model: 'CH-47F Chinook',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-ch47f.jpg',
    description: 'Improved Chinook.',
    first_flight: 2006,
    specifications: {
      max_takeoff_weight: '22,680 kg',
      cruising_speed: '315 km/h',
      range: '400 km',
      capacity: 55,
      engines: 2,
      engine_type: 'Honeywell T55-GA-714A',
      length: '30.1 m',
      wingspan: '18.3 m',
      height: '5.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'p8',
    manufacturer_id: 'boeing',
    model: 'P-8 Poseidon',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-p8.jpg',
    description: 'Maritime patrol based on 737-800.',
    first_flight: 2009,
    specifications: {
      max_takeoff_weight: '85,820 kg',
      cruising_speed: 'Mach 0.82',
      range: '2,220 km',
      capacity: 9,
      engines: 2,
      engine_type: 'CFM56-7',
      length: '39.5 m',
      wingspan: '37.6 m',
      height: '12.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'kc46',
    manufacturer_id: 'boeing',
    model: 'KC-46 Pegasus',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-kc46.jpg',
    description: 'Aerial refueling based on 767-200ER.',
    first_flight: 2015,
    specifications: {
      max_takeoff_weight: '188,240 kg',
      cruising_speed: 'Mach 0.82',
      range: '11,830 km',
      capacity: 114,
      engines: 2,
      engine_type: 'CFM56-7',
      length: '50.5 m',
      wingspan: '47.6 m',
      height: '15.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'v22',
    manufacturer_id: 'boeing',
    model: 'V-22 Osprey',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-v22.jpg',
    description: 'Tiltrotor aircraft.',
    first_flight: 1989,
    specifications: {
      max_takeoff_weight: '27,443 kg',
      cruising_speed: '565 km/h',
      range: '1,627 km',
      capacity: 24,
      engines: 2,
      engine_type: 'Rolls-Royce AE1107C',
      length: '17.5 m',
      wingspan: '14.0 m',
      height: '6.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b17',
    manufacturer_id: 'boeing',
    model: 'B-17 Flying Fortress',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b17.jpg',
    description: 'WWII heavy bomber.',
    first_flight: 1935,
    specifications: {
      max_takeoff_weight: '29,700 kg',
      cruising_speed: '462 km/h',
      range: '3,219 km',
      capacity: 10,
      engines: 4,
      engine_type: 'Wright R-1820',
      length: '22.7 m',
      wingspan: '31.6 m',
      height: '5.8 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'b29',
    manufacturer_id: 'boeing',
    model: 'B-29 Superfortress',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-b29.jpg',
    description: 'WWII long-range bomber.',
    first_flight: 1942,
    specifications: {
      max_takeoff_weight: '54,000 kg',
      cruising_speed: '574 km/h',
      range: '5,230 km',
      capacity: 11,
      engines: 4,
      engine_type: 'Wright R-3350',
      length: '30.2 m',
      wingspan: '43.1 m',
      height: '8.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'f86',
    manufacturer_id: 'boeing',
    model: 'F-86 Sabre',
    category: 'legacy',
    image: '/images/manufacturers/boeing/boeing-f86.jpg',
    description: 'Korean War era jet fighter.',
    first_flight: 1947,
    specifications: {
      max_takeoff_weight: '6,894 kg',
      cruising_speed: 'Mach 0.89',
      range: '1,074 km',
      capacity: 1,
      engines: 1,
      engine_type: 'GE J47-GE-27',
      length: '11.4 m',
      wingspan: '11.3 m',
      height: '4.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 't45',
    manufacturer_id: 'boeing',
    model: 'T-45 Goshawk',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-t-45_goshawk.jpg',
    description: 'Naval training aircraft.',
    first_flight: 1988,
    specifications: {
      max_takeoff_weight: '6,214 kg',
      cruising_speed: '1,038 km/h',
      range: '1,278 km',
      capacity: 2,
      engines: 1,
      engine_type: 'RR F405-RR-401',
      length: '11.6 m',
      wingspan: '9.4 m',
      height: '4.2 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'ea18g',
    manufacturer_id: 'boeing',
    model: 'EA-18G Growler',
    category: 'military',
    image: '/images/manufacturers/boeing/boeing-ea-18g_growler.jpg',
    description: 'Electronic warfare variant of F/A-18F.',
    first_flight: 2006,
    specifications: {
      max_takeoff_weight: '29,937 kg',
      cruising_speed: 'Mach 1.8',
      range: '2,346 km',
      capacity: 2,
      engines: 2,
      engine_type: 'GE F414-GE-400',
      length: '18.3 m',
      wingspan: '13.6 m',
      height: '4.9 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  }
,
  {
    id: 'crj100',
    manufacturer_id: 'bombardier',
    model: 'CRJ-100',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-crj100.jpg',
    description: 'Original Canadair Regional Jet seating 50.',
    first_flight: 1991,
    specifications: {
      max_takeoff_weight: '21,523 kg',
      cruising_speed: 'Mach 0.74',
      range: '2,400 km',
      capacity: 50,
      engines: 2,
      engine_type: 'GE CF34-3A1',
      length: '26.8 m',
      wingspan: '21.2 m',
      height: '6.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'crj200',
    manufacturer_id: 'bombardier',
    model: 'CRJ-200',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-crj200.jpg',
    description: 'Improved CRJ-100 with better engines.',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '23,995 kg',
      cruising_speed: 'Mach 0.74',
      range: '3,700 km',
      capacity: 50,
      engines: 2,
      engine_type: 'GE CF34-3B1',
      length: '26.8 m',
      wingspan: '21.2 m',
      height: '6.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'crj440',
    manufacturer_id: 'bombardier',
    model: 'CRJ-440',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-crj440.jpg',
    description: 'Lower-capacity CRJ-200 for regional.',
    first_flight: 2001,
    specifications: {
      max_takeoff_weight: '23,995 kg',
      cruising_speed: 'Mach 0.74',
      range: '3,700 km',
      capacity: 44,
      engines: 2,
      engine_type: 'GE CF34-3B1',
      length: '26.8 m',
      wingspan: '21.2 m',
      height: '6.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'crj700',
    manufacturer_id: 'bombardier',
    model: 'CRJ-700',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-crj-700.jpg',
    description: 'Stretched CRJ seating 70.',
    first_flight: 1997,
    specifications: {
      max_takeoff_weight: '32,999 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,650 km',
      capacity: 70,
      engines: 2,
      engine_type: 'GE CF34-8C1',
      length: '32.5 m',
      wingspan: '23.2 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'crj701',
    manufacturer_id: 'bombardier',
    model: 'CRJ-701',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-crj701.jpg',
    description: 'Extended range CRJ-700.',
    first_flight: 2001,
    specifications: {
      max_takeoff_weight: '34,019 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,650 km',
      capacity: 70,
      engines: 2,
      engine_type: 'GE CF34-8C5',
      length: '32.5 m',
      wingspan: '23.2 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'crj702',
    manufacturer_id: 'bombardier',
    model: 'CRJ-702',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-crj702.jpg',
    description: 'Higher capacity CRJ-700 variant.',
    first_flight: 2003,
    specifications: {
      max_takeoff_weight: '34,019 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,650 km',
      capacity: 75,
      engines: 2,
      engine_type: 'GE CF34-8C5',
      length: '32.5 m',
      wingspan: '23.2 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'crj705',
    manufacturer_id: 'bombardier',
    model: 'CRJ-705',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-crj705.jpg',
    description: 'CRJ-900 variant for Air Canada.',
    first_flight: 2005,
    specifications: {
      max_takeoff_weight: '36,995 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,650 km',
      capacity: 75,
      engines: 2,
      engine_type: 'GE CF34-8C5',
      length: '36.2 m',
      wingspan: '23.2 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'crj900',
    manufacturer_id: 'bombardier',
    model: 'CRJ-900',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-crj900.jpg',
    description: 'Further stretched CRJ seating 90.',
    first_flight: 2000,
    specifications: {
      max_takeoff_weight: '36,995 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,400 km',
      capacity: 90,
      engines: 2,
      engine_type: 'GE CF34-8C5',
      length: '36.2 m',
      wingspan: '23.2 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'crj1000',
    manufacturer_id: 'bombardier',
    model: 'CRJ-1000',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-crj1000.jpg',
    description: 'Largest CRJ seating 100.',
    first_flight: 2007,
    specifications: {
      max_takeoff_weight: '38,995 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,000 km',
      capacity: 100,
      engines: 2,
      engine_type: 'GE CF34-8C5',
      length: '39.1 m',
      wingspan: '23.2 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'challenger-300',
    manufacturer_id: 'bombardier',
    model: 'Challenger 300',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-challenger-300.jpg',
    description: 'Super-midsize business jet.',
    first_flight: 1998,
    specifications: {
      max_takeoff_weight: '17,622 kg',
      cruising_speed: 'Mach 0.82',
      range: '5,926 km',
      capacity: 9,
      engines: 2,
      engine_type: 'Honeywell HTF7000',
      length: '20.9 m',
      wingspan: '19.5 m',
      height: '6.2 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'challenger-350',
    manufacturer_id: 'bombardier',
    model: 'Challenger 350',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-challenger-350.jpg',
    description: 'Enhanced Challenger 300.',
    first_flight: 2013,
    specifications: {
      max_takeoff_weight: '18,416 kg',
      cruising_speed: 'Mach 0.83',
      range: '5,926 km',
      capacity: 10,
      engines: 2,
      engine_type: 'Honeywell HTF7350',
      length: '20.9 m',
      wingspan: '19.5 m',
      height: '6.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'challenger-3500',
    manufacturer_id: 'bombardier',
    model: 'Challenger 3500',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-challenger-3500.jpg',
    description: 'Latest Challenger with advanced avionics.',
    first_flight: 2021,
    specifications: {
      max_takeoff_weight: '18,600 kg',
      cruising_speed: 'Mach 0.83',
      range: '5,926 km',
      capacity: 10,
      engines: 2,
      engine_type: 'Honeywell HTF7350',
      length: '20.9 m',
      wingspan: '19.5 m',
      height: '6.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'challenger-600',
    manufacturer_id: 'bombardier',
    model: 'Challenger 600',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-challenger-600.jpg',
    description: 'Original Challenger large cabin jet.',
    first_flight: 1977,
    specifications: {
      max_takeoff_weight: '19,618 kg',
      cruising_speed: 'Mach 0.80',
      range: '6,600 km',
      capacity: 12,
      engines: 2,
      engine_type: 'GE CF34-3B',
      length: '20.8 m',
      wingspan: '19.6 m',
      height: '6.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'challenger-601',
    manufacturer_id: 'bombardier',
    model: 'Challenger 601',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-challenger-601.jpg',
    description: 'Improved Challenger with winglets.',
    first_flight: 1983,
    specifications: {
      max_takeoff_weight: '19,550 kg',
      cruising_speed: 'Mach 0.80',
      range: '6,600 km',
      capacity: 12,
      engines: 2,
      engine_type: 'GE CF34-3A2',
      length: '20.8 m',
      wingspan: '19.6 m',
      height: '6.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'challenger-604',
    manufacturer_id: 'bombardier',
    model: 'Challenger 604',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-challenger-604.jpg',
    description: 'Major upgrade with EFIS and FMS.',
    first_flight: 1995,
    specifications: {
      max_takeoff_weight: '21,863 kg',
      cruising_speed: 'Mach 0.80',
      range: '7,500 km',
      capacity: 12,
      engines: 2,
      engine_type: 'GE CF34-3B',
      length: '21.1 m',
      wingspan: '19.6 m',
      height: '6.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'challenger-605',
    manufacturer_id: 'bombardier',
    model: 'Challenger 605',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-challenger-605.jpg',
    description: 'Enhanced Challenger 604.',
    first_flight: 2005,
    specifications: {
      max_takeoff_weight: '21,863 kg',
      cruising_speed: 'Mach 0.80',
      range: '7,400 km',
      capacity: 12,
      engines: 2,
      engine_type: 'GE CF34-3B',
      length: '20.8 m',
      wingspan: '19.6 m',
      height: '6.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'challenger-650',
    manufacturer_id: 'bombardier',
    model: 'Challenger 650',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-challenger-650.jpg',
    description: 'Latest Challenger 600 series.',
    first_flight: 2014,
    specifications: {
      max_takeoff_weight: '21,863 kg',
      cruising_speed: 'Mach 0.80',
      range: '7,400 km',
      capacity: 12,
      engines: 2,
      engine_type: 'GE CF34-3B',
      length: '20.8 m',
      wingspan: '19.6 m',
      height: '6.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'challenger-850',
    manufacturer_id: 'bombardier',
    model: 'Challenger 850',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-challenger-850.jpg',
    description: 'Business jet based on CRJ-200.',
    first_flight: 2006,
    specifications: {
      max_takeoff_weight: '24,040 kg',
      cruising_speed: 'Mach 0.80',
      range: '5,206 km',
      capacity: 14,
      engines: 2,
      engine_type: 'GE CF34-3B1',
      length: '26.8 m',
      wingspan: '21.2 m',
      height: '6.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'global-5000',
    manufacturer_id: 'bombardier',
    model: 'Global 5000',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-global-5000.jpg',
    description: 'Ultra-long range business jet.',
    first_flight: 2003,
    specifications: {
      max_takeoff_weight: '41,957 kg',
      cruising_speed: 'Mach 0.89',
      range: '9,630 km',
      capacity: 19,
      engines: 2,
      engine_type: 'RR BR710-A2-20',
      length: '29.5 m',
      wingspan: '28.7 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'global-5500',
    manufacturer_id: 'bombardier',
    model: 'Global 5500',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-global-5500.jpg',
    description: 'Enhanced Global 5000.',
    first_flight: 2019,
    specifications: {
      max_takeoff_weight: '42,500 kg',
      cruising_speed: 'Mach 0.89',
      range: '10,900 km',
      capacity: 16,
      engines: 2,
      engine_type: 'RR Pearl 15',
      length: '29.5 m',
      wingspan: '28.7 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'global-6000',
    manufacturer_id: 'bombardier',
    model: 'Global 6000',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-global-6000.jpg',
    description: 'Extended range Global 5000.',
    first_flight: 2011,
    specifications: {
      max_takeoff_weight: '45,132 kg',
      cruising_speed: 'Mach 0.89',
      range: '11,112 km',
      capacity: 19,
      engines: 2,
      engine_type: 'RR BR710-A2-20',
      length: '30.3 m',
      wingspan: '28.7 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'global-6500',
    manufacturer_id: 'bombardier',
    model: 'Global 6500',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-global-6500.jpg',
    description: 'Enhanced Global 6000.',
    first_flight: 2019,
    specifications: {
      max_takeoff_weight: '45,800 kg',
      cruising_speed: 'Mach 0.89',
      range: '12,200 km',
      capacity: 17,
      engines: 2,
      engine_type: 'RR Pearl 15',
      length: '30.3 m',
      wingspan: '28.7 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'global-7500',
    manufacturer_id: 'bombardier',
    model: 'Global 7500',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-global-7500.jpg',
    description: 'Flagship ultra-long range jet.',
    first_flight: 2016,
    specifications: {
      max_takeoff_weight: '52,096 kg',
      cruising_speed: 'Mach 0.925',
      range: '14,260 km',
      capacity: 19,
      engines: 4,
      engine_type: 'GE Passport',
      length: '33.9 m',
      wingspan: '31.7 m',
      height: '8.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'global-8000',
    manufacturer_id: 'bombardier',
    model: 'Global 8000',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-global-8000.jpg',
    description: 'Extended range Global 7500.',
    first_flight: 2022,
    specifications: {
      max_takeoff_weight: '52,096 kg',
      cruising_speed: 'Mach 0.94',
      range: '14,630 km',
      capacity: 19,
      engines: 4,
      engine_type: 'GE Passport',
      length: '33.9 m',
      wingspan: '31.7 m',
      height: '8.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'global-express',
    manufacturer_id: 'bombardier',
    model: 'Global Express',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-global-express.jpg',
    description: 'Original ultra-long range business jet.',
    first_flight: 1996,
    specifications: {
      max_takeoff_weight: '42,411 kg',
      cruising_speed: 'Mach 0.89',
      range: '11,690 km',
      capacity: 19,
      engines: 2,
      engine_type: 'RR BR710',
      length: '30.3 m',
      wingspan: '28.6 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'global-express-xrs',
    manufacturer_id: 'bombardier',
    model: 'Global Express XRS',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-global-express-xrs.jpg',
    description: 'Enhanced Global Express.',
    first_flight: 2003,
    specifications: {
      max_takeoff_weight: '43,318 kg',
      cruising_speed: 'Mach 0.89',
      range: '11,390 km',
      capacity: 19,
      engines: 2,
      engine_type: 'RR BR710',
      length: '30.3 m',
      wingspan: '28.6 m',
      height: '7.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'learjet-35',
    manufacturer_id: 'bombardier',
    model: 'Learjet 35',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-learjet-35.jpg',
    description: 'Light business jet.',
    first_flight: 1973,
    specifications: {
      max_takeoff_weight: '8,300 kg',
      cruising_speed: 'Mach 0.78',
      range: '2,800 km',
      capacity: 8,
      engines: 2,
      engine_type: 'GE CJ610',
      length: '14.8 m',
      wingspan: '12.0 m',
      height: '3.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'learjet-36',
    manufacturer_id: 'bombardier',
    model: 'Learjet 36',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-learjet-36.jpg',
    description: 'Longer range Learjet 35.',
    first_flight: 1973,
    specifications: {
      max_takeoff_weight: '8,300 kg',
      cruising_speed: 'Mach 0.78',
      range: '3,600 km',
      capacity: 6,
      engines: 2,
      engine_type: 'GE CJ610',
      length: '14.8 m',
      wingspan: '12.0 m',
      height: '3.7 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'learjet-55',
    manufacturer_id: 'bombardier',
    model: 'Learjet 55',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-learjet-55.jpg',
    description: 'Midsize business jet.',
    first_flight: 1979,
    specifications: {
      max_takeoff_weight: '8,481 kg',
      cruising_speed: 'Mach 0.81',
      range: '2,700 km',
      capacity: 8,
      engines: 2,
      engine_type: 'GE CJ610',
      length: '15.6 m',
      wingspan: '13.4 m',
      height: '4.3 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'learjet-60',
    manufacturer_id: 'bombardier',
    model: 'Learjet 60',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-learjet-60.jpg',
    description: 'Improved midsize jet.',
    first_flight: 1990,
    specifications: {
      max_takeoff_weight: '10,660 kg',
      cruising_speed: 'Mach 0.78',
      range: '2,880 km',
      capacity: 8,
      engines: 2,
      engine_type: 'PW PW305A',
      length: '17.9 m',
      wingspan: '13.9 m',
      height: '4.6 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'learjet-70',
    manufacturer_id: 'bombardier',
    model: 'Learjet 70',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-learjet-70.jpg',
    description: 'Light jet with modern avionics.',
    first_flight: 2012,
    specifications: {
      max_takeoff_weight: '9,752 kg',
      cruising_speed: 'Mach 0.81',
      range: '3,700 km',
      capacity: 7,
      engines: 2,
      engine_type: 'Honeywell TFE731',
      length: '17.0 m',
      wingspan: '14.6 m',
      height: '4.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'learjet-75',
    manufacturer_id: 'bombardier',
    model: 'Learjet 75',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-learjet-75.jpg',
    description: 'Enhanced Learjet 70.',
    first_flight: 2012,
    specifications: {
      max_takeoff_weight: '9,752 kg',
      cruising_speed: 'Mach 0.81',
      range: '3,800 km',
      capacity: 9,
      engines: 2,
      engine_type: 'Honeywell TFE731',
      length: '17.7 m',
      wingspan: '14.6 m',
      height: '4.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'learjet-85',
    manufacturer_id: 'bombardier',
    model: 'Learjet 85',
    category: 'private',
    image: '/images/manufacturers/bombardier/bombardier-learjet-85.jpg',
    description: 'Composite light business jet.',
    first_flight: 2007,
    specifications: {
      max_takeoff_weight: '15,195 kg',
      cruising_speed: 'Mach 0.82',
      range: '5,560 km',
      capacity: 8,
      engines: 2,
      engine_type: 'Honeywell HTF7000',
      length: '20.8 m',
      wingspan: '18.8 m',
      height: '6.1 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'dash8-q100',
    manufacturer_id: 'bombardier',
    model: 'Dash 8-100',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-dash8-q100.jpg',
    description: 'Original Dash 8 regional turboprop.',
    first_flight: 1983,
    specifications: {
      max_takeoff_weight: '15,649 kg',
      cruising_speed: '496 km/h',
      range: '1,889 km',
      capacity: 37,
      engines: 2,
      engine_type: 'PW PW120',
      length: '22.3 m',
      wingspan: '25.9 m',
      height: '7.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'dash8-q200',
    manufacturer_id: 'bombardier',
    model: 'Dash 8-200',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-dash8-q200.jpg',
    description: 'Improved Dash 8-100.',
    first_flight: 1992,
    specifications: {
      max_takeoff_weight: '16,466 kg',
      cruising_speed: '496 km/h',
      range: '1,713 km',
      capacity: 37,
      engines: 2,
      engine_type: 'PW PW123',
      length: '22.3 m',
      wingspan: '25.9 m',
      height: '7.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'dash8-q300',
    manufacturer_id: 'bombardier',
    model: 'Dash 8-300',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-dash8-q300.jpg',
    description: 'Stretched Dash 8 seating 50.',
    first_flight: 1989,
    specifications: {
      max_takeoff_weight: '18,185 kg',
      cruising_speed: '470 km/h',
      range: '1,558 km',
      capacity: 50,
      engines: 2,
      engine_type: 'PW PW123',
      length: '25.7 m',
      wingspan: '27.4 m',
      height: '7.5 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },
  {
    id: 'dash8-q400',
    manufacturer_id: 'bombardier',
    model: 'Dash 8-Q400',
    category: 'commercial',
    image: '/images/manufacturers/bombardier/bombardier-dash8-q400.jpg',
    description: 'Latest Dash 8 with active noise cancellation.',
    first_flight: 1998,
    specifications: {
      max_takeoff_weight: '29,574 kg',
      cruising_speed: '667 km/h',
      range: '2,040 km',
      capacity: 90,
      engines: 2,
      engine_type: 'PW PW150A',
      length: '32.8 m',
      wingspan: '28.4 m',
      height: '8.4 m'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  }

];

// Helper functions
export const getManufacturerById = (id: string): Manufacturer | undefined => {
  return manufacturers.find(m => m.id === id);
};

export const getAircraftByManufacturer = (manufacturer_id: string): AircraftTypeRating[] => {
  return aircraftTypeRatings.filter(a => a.manufacturer_id === manufacturer_id);
};

export const getAircraftByCategory = (category: string): AircraftTypeRating[] => {
  return aircraftTypeRatings.filter(a => a.category === category);
};
