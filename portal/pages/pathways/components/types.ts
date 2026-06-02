import type { Region } from '../../../../data/flight-schools';

export interface PathwayData {
  id: string;
  name: string;
  category: 'all' | 'airline-pathways' | 'cadet-programme' | 'private' | 'privateSector' | 'cargo' | 'type-rating' | 'airtaxi-drones' | 'flight-schools' | 'military' | 'pathway';
  airline: string;
  description?: string;
  image: string;
  matchProbability: number;
  aircraftType: string;
  claimed?: boolean;
  region?: Region;
  requirements: {
    totalHours: number;
    multiEngineHours?: number;
    turbineHours?: number;
    typeRatings: string[];
  };
  salary?: {
    firstYear: string;
    fifthYear: string;
    bonuses: string;
  };
  benefits?: string[];
  locations: string[];
  interestLevel: 'high_interest' | 'moderate' | 'limited' | 'paused' | 'active';
  positions?: number;
  url?: string;
  isEnterprise?: boolean;
  enterpriseLogoUrl?: string;
  pathwayId?: string;
}

export interface GapAnalysis {
  gapPercentage: number;
  totalGaps: number;
  highPriorityGaps: number;
  estimatedCost: number;
  estimatedTime: { days: number; months: number };
  recommendations: string[];
}

export interface RecognitionProfile {
  totalScore: number;
  breakdown: {
    programs: number;
    experience: number;
    behavioral: number;
    language: number;
    skills: number;
  };
  pilotData?: {
    totalHours: number;
    multiEngineHours: number;
    turbineHours: number;
    typeRatings: string[];
  };
}

export interface RequirementMatch {
  label: string;
  aligned: boolean;
  score?: number;
  status: 'under-minimums' | 'close' | 'match';
  suggestion?: string;
}
