// Job Alignment Types
// Career alignment layer that sits on top of external job boards.
// We aggregate jobs, parse requirements, align against pilot profile,
// and redirect to the original posting to apply.

// ============================================================================
// JOB SOURCE TYPES
// ============================================================================

/** External job board sources we aggregate from */
export type JobSourceName =
  | 'pilotcareercenter'
  | 'betterjobs'
  | 'airline_direct'
  | 'operator_direct'
  | 'internal'
  | 'other';

/** Information about where a job listing came from */
export interface JobSource {
  name: JobSourceName;
  originalUrl: string;
  applicationUrl?: string;
  scrapedAt?: string;
  /** Whether this is a redirect URL (pilot applies on external site) */
  isRedirect: boolean;
}

// ============================================================================
// JOB LISTING TYPES
// ============================================================================

/** Job category — maps to our operator pathway categories */
export type JobCategory =
  | 'airline'
  | 'helicopter'
  | 'cargo'
  | 'charter'
  | 'corporate'
  | 'air_ambulance'
  | 'agricultural'
  | 'flight_training'
  | 'scenic'
  | 'private_jet'
  | 'drone'
  | 'military'
  | 'other';

/** Job seat/role level */
export type JobSeat = 'captain' | 'first_officer' | 'cadet' | 'instructor' | 'relief' | 'other';

/** Hiring status from the job board */
export type JobHiringStatus = 'hiring_now' | 'accepting_apps' | 'closing_soon' | 'closed' | 'coming_soon';

/**
 * Structured job listing aligned with our career pathway system.
 * Maps to the existing jobApplicationListings structure in PilotJobDatabasePage.tsx
 * but with richer typed fields.
 */
export interface JobListing {
  id: string;
  title: string;
  company: string;
  aircraft: string;
  location: string;
  role: string;
  seat: JobSeat;
  category: JobCategory;
  url: string;
  posted: string;
  status: JobHiringStatus;
  applicationUrl: string;
  source: JobSource;

  // --- Requirements (parsed from job posting) ---
  requirements: JobRequirements;

  // --- Compensation ---
  compensation?: string;
  compensationRange?: {
    min: number;
    max: number;
    currency: string;
    period: 'annual' | 'monthly' | 'daily' | 'hourly';
  };

  // --- Link to operator pathway (if applicable) ---
  operatorSlug?: string;

  // --- Metadata ---
  visaSponsorship?: string;
  jobDescription?: string;
  jobExpectations?: string;
  companyWebsite?: string;
}

/** Structured requirements parsed from a job posting */
export interface JobRequirements {
  minTotalHours: number;
  minPicHours: number;
  minPicInTypeHours: number;
  minMultiEngineHours?: number;
  minInstrumentHours?: number;
  minNightHours?: number;
  minTurbineHours?: number;
  minOffshoreHours?: number;
  minMountainHours?: number;
  licenseRequired: string;
  typeRatingRequired: string;
  typeRatingProvided?: boolean;
  medicalClass: string;
  icaoElpLevel: string;
  additionalRequirements?: string[];
}

// ============================================================================
// JOB ALIGNMENT RESULT
// ============================================================================

/** Severity of a job requirement gap */
export type JobGapSeverity = 'critical' | 'major' | 'minor' | 'advisory' | 'met';

/** A single gap between pilot profile and job requirements */
export interface JobRequirementGap {
  field: string;
  label: string;
  type: 'hours' | 'license' | 'type_rating' | 'medical' | 'english' | 'visa' | 'other';
  currentValue: string | number;
  requiredValue: string | number;
  shortfall: string | number;
  severity: JobGapSeverity;
  canClose: boolean;
  estimatedTimeToClose?: string;
  estimatedCost?: number;
  closingActions: string[];
}

/** Alignment result — how well a pilot fits a specific job */
export interface JobAlignmentResult {
  jobId: string;
  jobTitle: string;
  company: string;
  aircraft: string;
  location: string;
  seat: JobSeat;
  category: JobCategory;

  // --- Alignment scores ---
  alignmentScore: number;       // 0-100, overall fit
  requirementsScore: number;    // 0-100, meets minimums
  experienceScore: number;      // 0-100, competitive level
  overallFit: 'excellent' | 'good' | 'fair' | 'poor' | 'ineligible';

  // --- Gap analysis ---
  gaps: JobRequirementGap[];
  criticalGaps: number;
  majorGaps: number;
  minorGaps: number;
  advisoryGaps: number;
  metRequirements: number;
  totalRequirements: number;

  // --- Recommendation ---
  recommendation: 'apply_now' | 'apply_with_caveats' | 'close_gaps_first' | 'not_eligible' | 'blind_spot';
  recommendationReason: string;

  // --- Blind spot detection ---
  isBlindSpot: boolean;
  blindSpotReason?: string;

  // --- Application ---
  applicationUrl: string;
  isRedirect: boolean;
  operatorSlug?: string;

  // --- Next steps ---
  nextSteps: string[];
}

// ============================================================================
// PILOT PROFILE (for job alignment — extends operator pathway profile)
// ============================================================================

/** Pilot profile for job alignment — includes verification status */
export interface PilotJobProfile {
  totalFlightHours: number;
  rotaryHours?: number;
  picHours: number;
  picInTypeHours?: number;
  multiEngineHours?: number;
  instrumentHours?: number;
  nightHours?: number;
  turbineHours?: number;
  offshoreHours?: number;
  mountainHours?: number;
  license: string;
  typeRatings: string[];
  medicalClass: string;
  icaoElpLevel: string;
  citizenship?: string;
  visaStatus?: string;
  age?: number;
  // --- Platform-specific ---
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  recognitionScore?: number;
  recognitionTier?: string;
  subscriptionTier?: string;
}

// ============================================================================
// JOB FEED / AGGREGATION
// ============================================================================

/** A feed of jobs from a specific source */
export interface JobFeed {
  source: JobSourceName;
  jobs: JobListing[];
  lastUpdated: string;
  totalJobs: number;
}

/** Filter for job feed */
export interface JobFeedFilter {
  category?: JobCategory | 'all';
  seat?: JobSeat | 'all';
  location?: string | 'all';
  aircraft?: string | 'all';
  company?: string | 'all';
  minAlignment?: number;
  eligibleOnly?: boolean;
  blindSpotsOnly?: boolean;
  sortBy?: 'alignment' | 'posted' | 'company' | 'location';
}

/** Job feed statistics */
export interface JobFeedStats {
  totalJobs: number;
  hiringNow: number;
  acceptingApps: number;
  closingSoon: number;
  byCategory: Record<string, number>;
  bySeat: Record<string, number>;
  byLocation: Record<string, number>;
  avgAlignmentScore: number;
  topCompanies: string[];
  trendingAircraft: string[];
}
