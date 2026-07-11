// Helicopter & General Aviation Operator Types
// Backs the assets in public/images/Pathways/Helicopter Operators/

import type { JobAlignmentResult } from './jobAlignmentTypes';
import type { PersonaOperatorContext } from './personaContext';

// ============================================================================
// RAW MANIFEST TYPES
// ============================================================================

/** Raw entry from the APAC manifest.json */
export interface OperatorManifestEntry {
  name: string;
  file: string;
  serviceType: string;
  status: string;
  country: string;
  category: OperatorCategory;
  /** Original SVG path (may not exist on disk) */
  path: string;
  website?: string;
  source?: string;
  logoUrl?: string;
  /** Actual downloaded file relative to the region root */
  downloadedFile?: string;
  error?: string;
}

export type OperatorCategory =
  | 'helicopter'
  | 'general_aviation'
  | 'air_ambulance'
  | 'agricultural'
  | 'flight_training'
  | 'scenic'
  | 'private_jet';

export const OPERATOR_CATEGORY_LABELS: Record<OperatorCategory, string> = {
  helicopter: 'Helicopter Operators',
  general_aviation: 'General Aviation',
  air_ambulance: 'Air Ambulance & Medical',
  agricultural: 'Agricultural Aviation',
  flight_training: 'Flight Training',
  scenic: 'Scenic & Tourism',
  private_jet: 'Private Jet Charter',
};

// ============================================================================
// REGION / COUNTRY TYPES
// ============================================================================

/** Region-level overview from apac-region.json */
export interface RegionOverview {
  region: string;
  totalCountries: number;
  totalOperators: number;
  categoryLabels: Record<OperatorCategory, string>;
  countries: {
    country: string;
    totalOperators: number;
    categories: {
      key: OperatorCategory;
      label: string;
      count: number;
    }[];
  }[];
}

/** Country-level data from country-info.json */
export interface CountryInfo {
  country: string;
  region: string;
  totalOperators: number;
  categories: {
    key: OperatorCategory;
    label: string;
    count: number;
    operators: {
      name: string;
      file: string;
      serviceType: string;
      status: string;
    }[];
  }[];
}

// ============================================================================
// HIRING MARKET TYPES (the "stock market" layer)
// ============================================================================

/**
 * Market status for an operator — like a stock market open/close.
 * Determines whether pilots can submit interest and whether the
 * operator is actively recruiting.
 */
export type MarketStatus = 'open' | 'accepting' | 'paused' | 'closed' | 'coming_soon';

/** A specific open role at an operator */
export interface HiringRole {
  title: string;
  base: string;
  seat: 'captain' | 'first_officer' | 'cadet' | 'instructor';
  aircraftType: string;
  minTotalHours: number;
  minRotaryHours: number;
  minPicHours: number;
  minMultiEngineHours: number;
  minOffshoreHours?: number;
  minNightHours?: number;
  minInstrumentHours?: number;
  typeRatingRequired: string[];
  typeRatingProvided: boolean;
  count: number;
  postedDate: string;
  applicationUrl?: string;
}

/** Hiring campaign / intake information */
export interface HiringCampaign {
  intakeType: 'rolling' | 'campaign' | 'cadet_intake' | 'seasonal';
  nextIntakeDate?: string;
  applicationDeadline?: string;
  applicationUrl?: string;
  activeRoles: HiringRole[];
  totalOpenPositions: number;
  lastUpdated: string;
}

// ============================================================================
// PILOT REQUIREMENTS TYPES
// ============================================================================

/** Minimum requirements for a pilot to be eligible for an operator */
export interface PilotRequirements {
  minTotalHours: number;
  minRotaryHours: number;
  minPicHours: number;
  minMultiEngineHours: number;
  minInstrumentHours?: number;
  minNightHours?: number;
  minOffshoreHours?: number;
  minTurbineHours?: number;
  minMountainHours?: number;
  requiredRatings: string[];
  requiredTypeRatings: string[];
  preferredTypeRatings: string[];
  medicalClass: 'Class 1' | 'Class 2';
  englishLevel: string;
  maxAge?: number;
  minAge?: number;
  citizenshipRequirements: string[];
  visaSponsorship: 'available' | 'limited' | 'not_available' | 'unknown';
  additionalRequirements: string[];
}

/** Requirements tiered by role level */
export interface TieredRequirements {
  cadet?: PilotRequirements;
  firstOfficer?: PilotRequirements;
  captain?: PilotRequirements;
  treTri?: PilotRequirements;
}

// ============================================================================
// TRAINING TYPES
// ============================================================================

/** Training and bonding information */
export interface TrainingInfo {
  typeRatingProvided: boolean;
  bondPeriod: string;
  bondAmount?: string;
  trainingLocation: string;
  trainingDuration: string;
  cadetProgram: boolean;
  cadetProgramDetails?: string;
  mentoringProgram: boolean;
  mentoringProgramDetails?: string;
  selfSponsoredAccepted: boolean;
}

// ============================================================================
// LIFESTYLE & COMPENSATION TYPES
// ============================================================================

/** Lifestyle and working conditions */
export interface LifestyleInfo {
  rosterPattern: string;
  rotationDays?: { on: number; off: number };
  baseType: 'permanent' | 'fifo' | 'remote_tour' | 'seasonal';
  seasonality: 'year_round' | 'seasonal' | 'peak_season';
  peakMonths?: string[];
  compensationRange: {
    min: number;
    max: number;
    currency: string;
    period: 'monthly' | 'annual' | 'daily' | 'hourly';
  };
  includesPerDiem: boolean;
  includesAccommodation: boolean;
  includesTravel: boolean;
  superannuation: boolean;
  description: string;
}

// ============================================================================
// CAREER PROGRESSION TYPES
// ============================================================================

/** Career progression information */
export interface ProgressionInfo {
  foToCaptainYears: string;
  foToCaptainTypical: number;
  upgradePathways: string[];
  treTriAvailable: boolean;
  treTriYears?: string;
  managementPathway: boolean;
  crossCategoryTransitions: string[];
  description: string;
}

// ============================================================================
// OPERATOR QUALITY / RISK TYPES
// ============================================================================

/** Quality and risk signals */
export interface QualityInfo {
  safetyRecord: string;
  safetyRating: 'excellent' | 'good' | 'average' | 'below_average' | 'unknown';
  fleetAgeRange: string;
  averageFleetAge?: number;
  growthStatus: 'expanding' | 'stable' | 'contracting' | 'unknown';
  growthDescription?: string;
  pilotTurnover: 'low' | 'moderate' | 'high' | 'unknown';
  unionized: boolean;
  pilotReviewsCount: number;
  averageRating?: number;
  certifications: string[];
  lastSafetyAudit?: string;
}

// ============================================================================
// MARKET INTELLIGENCE TYPES
// ============================================================================

/** Market signal — pilot interest as demand indicator */
export interface MarketSignal {
  operatorId: string;
  totalInterest: number;
  interestTrend: 'rising' | 'stable' | 'declining';
  weeklyInterest: number;
  monthlyInterest: number;
  interestedPilotsByStage: {
    cadet: number;
    lowTime: number;
    midTime: number;
    highTime: number;
    typed: number;
  };
  matchRate: number;
  lastUpdated: string;
}

/** Market overview across all operators */
export interface MarketOverview {
  totalOperators: number;
  openCount: number;
  acceptingCount: number;
  pausedCount: number;
  closedCount: number;
  comingSoonCount: number;
  totalOpenPositions: number;
  totalInterest: number;
  trendingOperators: string[];
  hotCategories: OperatorCategory[];
  hotCountries: string[];
  lastUpdated: string;
}

// ============================================================================
// GAP ANALYSIS TYPES
// ============================================================================

/** A single gap between pilot profile and operator requirements */
export interface RequirementGap {
  type: 'hours' | 'rating' | 'type_rating' | 'medical' | 'english' | 'age' | 'citizenship' | 'experience';
  field: string;
  label: string;
  currentValue: string | number;
  requiredValue: string | number;
  shortfall: string | number;
  severity: 'critical' | 'major' | 'minor' | 'advisory';
  estimatedTimeToClose: string;
  estimatedCost: number;
  estimatedCostCurrency: string;
  closingActions: string[];
  closedByDefault?: boolean;
}

/** Full gap analysis result for a pilot vs an operator */
export interface GapAnalysisResult {
  operatorId: string;
  operatorName: string;
  overallMatchScore: number;
  eligible: boolean;
  nearEligible: boolean;
  gaps: RequirementGap[];
  criticalGaps: number;
  majorGaps: number;
  minorGaps: number;
  advisoryGaps: number;
  estimatedTimeToQualify: string;
  estimatedTotalCost: number;
  estimatedTotalCostCurrency: string;
  nextSteps: string[];
  similarOperators: string[];
}

// ============================================================================
// ENRICHMENT DATA (attached to OperatorPathway)
// ============================================================================

/** Enrichment data attached to an OperatorPathway */
export interface OperatorEnrichmentData {
  description: string;
  summary: string;
  fleet: string[];
  bases: string[];
  services: string[];
  career: {
    hiringStatus: MarketStatus;
    pilotTypes: string[];
    pathways: string[];
    notes: string;
  };
  // --- NEW: Full pilot-centric data ---
  hiring: HiringCampaign | null;
  requirements: TieredRequirements | null;
  training: TrainingInfo | null;
  lifestyle: LifestyleInfo | null;
  progression: ProgressionInfo | null;
  quality: QualityInfo | null;
  // --- Existing MCP-sourced data ---
  wikipedia: {
    pageId: number;
    title: string;
    url: string;
    excerpt: string;
  } | null;
  aiSummary: {
    text: string;
    sources: { title: string; url: string }[];
  } | null;
  aiHiringSummary: {
    text: string;
    sources: { title: string; url: string }[];
  } | null;
  wikimediaImages: {
    url: string;
    caption: string;
    license: string;
    licenseUrl: string;
    artist: string;
    width: number;
    height: number;
  }[];
  founded?: number;
  parentCompany?: string;
}

// ============================================================================
// DERIVED OPERATOR PATHWAY
// ============================================================================

/** Derived operator pathway ready for UI consumption */
export interface OperatorPathway {
  id: string;
  name: string;
  logo: string;
  region: string;
  country: string;
  category: OperatorCategory;
  categoryLabel: string;
  serviceType: string;
  website?: string;
  match: number;
  gaps: number;
  subtitle: string;
  benefits: string[];
  /** Market status — like stock market open/close */
  marketStatus: MarketStatus;
  /** Whether MCP enrichment data is available for this operator */
  enriched: boolean;
  /** Enrichment data (from Wikipedia, Google AI Mode, Wikimedia Commons) */
  enrichment?: OperatorEnrichmentData;
  /** Gap analysis result (populated when pilot profile is provided) */
  gapAnalysis?: GapAnalysisResult;
  /** Market signal data (pilot interest as demand indicator) */
  marketSignal?: MarketSignal;
  /** Active job listings linked to this operator (from external job boards) */
  jobs?: JobAlignmentResult[];
  /** Persona-specific context — what this operator means for this pilot archetype */
  personaContext?: PersonaOperatorContext;
}

// ============================================================================
// PILOT PROFILE (expanded for gap analysis)
// ============================================================================

/** Optional pilot profile used for match scoring */
export interface OperatorPathwayProfile {
  total_flight_hours?: number | string | null;
  rotary_hours?: number | string | null;
  pic_hours?: number | string | null;
  multi_engine_hours?: number | string | null;
  instrument_hours?: number | string | null;
  night_hours?: number | string | null;
  offshore_hours?: number | string | null;
  turbine_hours?: number | string | null;
  mountain_hours?: number | string | null;
  ratings?: string[];
  type_ratings?: string[];
  medical_class?: string;
  medical_expiry?: string | null;
  icao_english_level?: string;
  age?: number | null;
  citizenship?: string;
  country?: string;
  verification_status?: string | Record<string, unknown> | null;
  subscription_tier?: string | null;
  recognition_tier?: string | null;
}
