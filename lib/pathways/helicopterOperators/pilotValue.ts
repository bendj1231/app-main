// Pilot Value Module
//
// "Can I get the job?" is the wrong question.
// "Do I have value in myself?" is the right question.
//
// This module assesses a pilot's value across 6 dimensions,
// independent of any specific job. Value exists whether or not
// anyone is hiring. Jobs are just expressions of value.
//
// The 6 dimensions:
//   1. Verified    — What do you actually have (not claim)?
//   2. Market      — What will employers pay for your combination?
//   3. Career      — What's your trajectory and potential?
//   4. Transferable — What crosses categories?
//   5. Gap         — What are you worth if you close specific gaps?
//   6. Recognition — What does the platform verify about you?

// ============================================================================
// TYPES
// ============================================================================

/** Pilot archetype — derived from hours, licenses, and career stage */
export type PilotArchetype =
  | 'student_pre_cpl'        // 0-250h, no CPL yet
  | 'fresh_cpl_no_experience' // 200-250h, CPL/IR, no flying job
  | 'cfi_instructor_track'   // 250-5000h, CPL+CFI, instructing
  | 'atpl_aspirant'          // 250+h, CPL/IR, ATPL exams
  | 'regional_fo'            // 800-2000h, regional airline FO
  | 'cargo_charter_specialist' // 2500h+, cargo/charter/specialist
  | 'airline_captain'        // 4000+h, ATPL, captain
  | 'expat_international'    // 4000h+, expat contract
  | 'retiring_senior'        // 20000h+, near retirement
  | 'lapsed_returning'       // Was qualified, lapsed, wants to return
  | 'career_shifter'         // Non-pilot background, transitioning in
  | 'industry_professional'  // Works in aviation, not a pilot (AOM, ATC, etc.)
  | 'founder_builder'        // Building in aviation, may or may not be a pilot
  | 'unknown';

/** Career stage — where the pilot is in their journey */
export type CareerStage =
  | 'pre_training'      // Hasn't started flying
  | 'in_training'       // Actively training (PPL/CPL/IR)
  | 'hour_building'     // CPL done, building hours
  | 'entry_level'       // First flying job
  | 'early_career'      // 1-3 years in
  | 'mid_career'        // 3-10 years in
  | 'senior'            // 10+ years, captain/specialist
  | 'late_career'       // Nearing retirement
  | 'lapsed'            // Qualified but not current
  | 'transitioning'     // Changing career direction
  | 'unknown';

/** Verification status of a credential */
export type VerificationStatus = 'verified' | 'pending' | 'unverified' | 'lapsed' | 'expired';

/** A single verified or unverified credential */
export interface Credential {
  type: 'license' | 'rating' | 'medical' | 'type_rating' | 'endorsement' | 'english' | 'degree';
  name: string;
  status: VerificationStatus;
  /** When it was obtained */
  obtainedDate?: string;
  /** When it expires (if applicable) */
  expiryDate?: string;
  /** Hours associated with this credential */
  hours?: number;
}

/** A dimension of pilot value */
export interface ValueDimension {
  key: 'verified' | 'market' | 'career' | 'transferable' | 'gap' | 'recognition';
  label: string;
  score: number;          // 0-100
  status: 'strong' | 'moderate' | 'weak' | 'critical' | 'none';
  description: string;
  /** What would improve this dimension */
  improvementActions: string[];
}

/** Market value estimate for the pilot's current qualification combo */
export interface MarketValueEstimate {
  /** Current realistic salary range */
  current: { min: number; max: number; currency: string; period: string };
  /** What they could earn with their next logical step */
  projected: { min: number; max: number; currency: string; period: string };
  /** What they could earn at peak career */
  peak: { min: number; max: number; currency: string; period: string };
  /** Confidence in the estimate (0-100) */
  confidence: number;
  /** Factors that increase value */
  valueDrivers: string[];
  /** Factors that decrease value */
  valueLimiters: string[];
  /** Notes on the estimate */
  notes: string;
}

/** A value gap — something that, if closed, would increase value */
export interface ValueGap {
  label: string;
  currentValue: string;
  targetValue: string;
  estimatedCost: number;
  estimatedTime: string;
  valueIncrease: { min: number; max: number; currency: string; period: string };
  priority: 'high' | 'medium' | 'low';
  rationale: string;
}

/** Transferable skill that crosses categories */
export interface TransferableSkill {
  skill: string;
  fromCategory: string;
  toCategories: string[];
  valueNote: string;
}

/** The complete pilot value assessment */
export interface PilotValueAssessment {
  // --- Identity ---
  archetype: PilotArchetype;
  careerStage: CareerStage;
  archetypeLabel: string;
  archetypeDescription: string;

  // --- Dimensions ---
  dimensions: ValueDimension[];
  overallValueScore: number;  // 0-100, weighted blend

  // --- Market ---
  marketValue: MarketValueEstimate;

  // --- Gaps ---
  valueGaps: ValueGap[];

  // --- Transferable ---
  transferableSkills: TransferableSkill[];

  // --- Credentials ---
  credentials: Credential[];

  // --- Narrative ---
  valueNarrative: string;
  oneLineValue: string;

  // --- Meta ---
  assessmentDate: string;
  confidenceLevel: number;  // 0-100
}

// ============================================================================
// INPUT PROFILE
// ============================================================================

/** Input profile for value assessment — minimal required fields */
export interface PilotValueInput {
  totalFlightHours: number;
  rotaryHours?: number;
  picHours?: number;
  multiEngineHours?: number;
  instrumentHours?: number;
  nightHours?: number;
  turbineHours?: number;
  offshoreHours?: number;
  mountainHours?: number;
  licenses: string[];
  typeRatings: string[];
  medicalClass?: string;
  medicalStatus?: VerificationStatus;
  icaoElpLevel?: string;
  age?: number;
  citizenship?: string;
  currentRole?: string;
  yearsInCareer?: number;
  // Platform-specific
  recognitionScore?: number;
  recognitionTier?: string;
  verificationStatus?: VerificationStatus;
  subscriptionTier?: string;
  // Currency status
  lastFlightDate?: string;
  medicalExpiryDate?: string;
}

// ============================================================================
// ARCHETYPE DETECTION
// ============================================================================

const ARCHETYPE_LABELS: Record<PilotArchetype, { label: string; description: string }> = {
  student_pre_cpl: {
    label: 'Student Pilot (Pre-CPL)',
    description: 'You are in training, building toward your first qualification. Your value is potential, not yet realized.',
  },
  fresh_cpl_no_experience: {
    label: 'Fresh CPL, No Experience',
    description: 'You are qualified on paper but have no operational experience. This is the hardest gap in aviation — you have the license but not the value yet.',
  },
  cfi_instructor_track: {
    label: 'CFI / Instructor Track',
    description: 'You are building hours through instruction. Your value is growing steadily but you may be trapped in the CFI loop.',
  },
  atpl_aspirant: {
    label: 'ATPL Aspirant',
    description: 'You are working toward airline eligibility. Your value is increasing with every exam and hour.',
  },
  regional_fo: {
    label: 'Regional / Low-Cost FO',
    description: 'You have your first airline job. Your value is real but suppressed by low pay and seniority constraints.',
  },
  cargo_charter_specialist: {
    label: 'Cargo / Charter Specialist',
    description: 'You are building specialized experience in a niche. Your value is real but may not transfer as far as you think.',
  },
  airline_captain: {
    label: 'Airline Captain',
    description: 'You have significant value and experience. Your challenge is not getting hired — it is finding the right expression of your value.',
  },
  expat_international: {
    label: 'Expat / International Pilot',
    description: 'You have high market value in the international market. Your value is premium but comes with lifestyle costs.',
  },
  retiring_senior: {
    label: 'Retiring Senior Captain',
    description: 'You have maximum experience value. Your challenge is converting that value into what comes next.',
  },
  lapsed_returning: {
    label: 'Lapsed / Returning Pilot',
    description: 'You were qualified but let currency lapse. Your value has decayed but is not zero — it can be restored.',
  },
  career_shifter: {
    label: 'Career Shifter',
    description: 'You are transitioning into aviation from another field. Your value is a combination of transferable skills and aviation potential.',
  },
  industry_professional: {
    label: 'Aviation Industry Professional',
    description: 'You work in aviation but not as a pilot. Your value is industry knowledge plus whatever flying credentials you hold.',
  },
  founder_builder: {
    label: 'Founder / Builder',
    description: 'You are building in aviation. Your value is a unique combination of lived experience and platform recognition.',
  },
  unknown: {
    label: 'Pilot',
    description: 'Your archetype is being determined. Complete your profile for a full value assessment.',
  },
};

export function detectArchetype(input: PilotValueInput): { archetype: PilotArchetype; stage: CareerStage } {
  const h = input.totalFlightHours;
  const licenses = input.licenses.map((l) => l.toUpperCase());
  const hasCPL = licenses.some((l) => l.includes('CPL'));
  const hasATPL = licenses.some((l) => l.includes('ATPL'));
  const hasCFI = licenses.some((l) => l.includes('CFI') || l.includes('INSTRUCTOR'));
  const currentRole = (input.currentRole || '').toLowerCase();

  // Check for lapsed status
  if (input.medicalStatus === 'lapsed' || input.medicalStatus === 'expired') {
    return { archetype: 'lapsed_returning', stage: 'lapsed' };
  }
  if (input.lastFlightDate) {
    const yearsSinceFlight = (Date.now() - new Date(input.lastFlightDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (yearsSinceFlight > 3 && hasCPL) {
      return { archetype: 'lapsed_returning', stage: 'lapsed' };
    }
  }

  // Retiring
  if (input.age && input.age >= 60 && hasATPL && h >= 20000) {
    return { archetype: 'retiring_senior', stage: 'late_career' };
  }

  // Expat
  if (hasATPL && h >= 4000 && (currentRole.includes('expat') || currentRole.includes('emirates') || currentRole.includes('qatar') || currentRole.includes('etihad'))) {
    return { archetype: 'expat_international', stage: 'mid_career' };
  }

  // Airline captain
  if (hasATPL && h >= 4000 && (currentRole.includes('captain') || input.yearsInCareer && input.yearsInCareer >= 8)) {
    return { archetype: 'airline_captain', stage: 'senior' };
  }

  // Cargo/charter
  if (hasCPL && h >= 2000 && (currentRole.includes('cargo') || currentRole.includes('charter') || currentRole.includes('caravan') || currentRole.includes('feeder'))) {
    return { archetype: 'cargo_charter_specialist', stage: 'mid_career' };
  }

  // Regional FO
  if (hasCPL && h >= 500 && h < 4000 && (currentRole.includes('first officer') || currentRole.includes('fo') || currentRole.includes('regional'))) {
    return { archetype: 'regional_fo', stage: 'early_career' };
  }

  // CFI track
  if (hasCPL && hasCFI && h >= 250 && h < 5000 && (currentRole.includes('instructor') || currentRole.includes('cfi'))) {
    return { archetype: 'cfi_instructor_track', stage: 'hour_building' };
  }

  // ATPL aspirant
  if (hasCPL && h >= 250 && !hasATPL && licenses.some((l) => l.includes('ATPL') || l.includes('FROZEN'))) {
    return { archetype: 'atpl_aspirant', stage: 'hour_building' };
  }

  // Fresh CPL, no experience
  if (hasCPL && h >= 200 && h <= 300 && (!currentRole || !currentRole.includes('pilot'))) {
    return { archetype: 'fresh_cpl_no_experience', stage: 'entry_level' };
  }

  // Student pre-CPL
  if (h < 200 && !hasCPL) {
    if (h === 0 && !currentRole) {
      return { archetype: 'student_pre_cpl', stage: 'pre_training' };
    }
    return { archetype: 'student_pre_cpl', stage: 'in_training' };
  }

  // Career shifter
  if (h < 150 && input.yearsInCareer && input.yearsInCareer > 5 && !hasCPL) {
    return { archetype: 'career_shifter', stage: 'transitioning' };
  }

  // Industry professional
  if (currentRole.includes('operations') || currentRole.includes('manager') || currentRole.includes('dispatch') || currentRole.includes('atc')) {
    return { archetype: 'industry_professional', stage: 'unknown' };
  }

  // Founder
  if (currentRole.includes('founder') || currentRole.includes('builder')) {
    return { archetype: 'founder_builder', stage: 'unknown' };
  }

  return { archetype: 'unknown', stage: 'unknown' };
}

// ============================================================================
// VALUE DIMENSION SCORING
// ============================================================================

function scoreVerified(input: PilotValueInput): ValueDimension {
  let score = 0;
  const actions: string[] = [];

  // Hours verified
  if (input.verificationStatus === 'verified') score += 30;
  else if (input.verificationStatus === 'pending') score += 15;
  else actions.push('Verify your flight hours through the platform');

  // Licenses
  if (input.licenses.length > 0) score += 15;
  else actions.push('Add your licenses to your profile');

  // Type ratings
  if (input.typeRatings.length > 0) score += 15;

  // Medical
  if (input.medicalClass && input.medicalStatus === 'verified') score += 15;
  else if (input.medicalClass) score += 8;
  else actions.push('Add your medical certificate');

  // English
  if (input.icaoElpLevel) score += 10;

  // Recognition score
  if (input.recognitionScore && input.recognitionScore >= 75) score += 15;
  else if (input.recognitionScore && input.recognitionScore >= 50) score += 8;

  score = Math.min(100, score);

  let status: ValueDimension['status'];
  if (score >= 75) status = 'strong';
  else if (score >= 50) status = 'moderate';
  else if (score >= 25) status = 'weak';
  else status = 'critical';

  return {
    key: 'verified',
    label: 'Verified Credentials',
    score,
    status,
    description: score >= 75
      ? 'Your credentials are verified and recognized by the platform. Employers can trust your profile.'
      : score >= 50
      ? 'Some credentials are verified. Complete verification to maximize trust.'
      : 'Your credentials are mostly unverified. Employers cannot trust your profile yet.',
    improvementActions: actions.length > 0 ? actions : ['Maintain currency and keep credentials updated'],
  };
}

function scoreMarket(input: PilotValueInput, archetype: PilotArchetype): ValueDimension {
  let score = 0;
  const actions: string[] = [];
  const h = input.totalFlightHours;

  // Hours → market value
  if (h >= 3000) score += 30;
  else if (h >= 1500) score += 22;
  else if (h >= 500) score += 15;
  else if (h >= 250) score += 8;
  else score += 2;

  // Type ratings → market value
  if (input.typeRatings.length >= 2) score += 20;
  else if (input.typeRatings.length === 1) score += 12;
  else actions.push('Obtain a type rating to increase market value');

  // PIC hours
  if (input.picHours && input.picHours >= 1000) score += 15;
  else if (input.picHours && input.picHours >= 500) score += 10;
  else if (input.picHours && input.picHours >= 100) score += 5;

  // Multi-engine + turbine
  if (input.multiEngineHours && input.multiEngineHours >= 500) score += 10;
  if (input.turbineHours && input.turbineHours >= 500) score += 10;

  // Current role
  if (input.currentRole && (input.currentRole.toLowerCase().includes('captain') || input.currentRole.toLowerCase().includes('fo'))) {
    score += 5;
  }

  // Lapsed penalty
  if (archetype === 'lapsed_returning') score = Math.round(score * 0.3);

  score = Math.min(100, score);

  let status: ValueDimension['status'];
  if (score >= 70) status = 'strong';
  else if (score >= 45) status = 'moderate';
  else if (score >= 20) status = 'weak';
  else status = 'critical';

  return {
    key: 'market',
    label: 'Market Value',
    score,
    status,
    description: score >= 70
      ? 'Your qualification combination commands strong market value. Employers will compete for you.'
      : score >= 45
      ? 'You have moderate market value. Strategic additions could significantly increase your worth.'
      : score >= 20
      ? 'Your market value is limited. Focus on building hours and ratings to increase employability.'
      : 'Your market value is minimal. You need significant investment before employers will pay for your qualifications.',
    improvementActions: actions.length > 0 ? actions : ['Keep building hours and consider additional type ratings'],
  };
}

function scoreCareer(input: PilotValueInput, archetype: PilotArchetype): ValueDimension {
  let score = 0;
  const actions: string[] = [];
  const h = input.totalFlightHours;
  const years = input.yearsInCareer || 0;

  // Trajectory — are you moving forward?
  if (h >= 3000 && years >= 5) score += 30;  // Established career
  else if (h >= 1500 && years >= 3) score += 22;  // Building well
  else if (h >= 500 && years >= 2) score += 15;  // Early progress
  else if (h >= 250) score += 8;  // Just starting
  else score += 3;  // Pre-start

  // Upward movement — type ratings indicate progression
  if (input.typeRatings.length >= 2) score += 15;
  else if (input.typeRatings.length === 1) score += 10;

  // PIC time — command potential
  if (input.picHours && input.picHours >= 1500) score += 15;
  else if (input.picHours && input.picHours >= 500) score += 10;
  else if (input.picHours && input.picHours >= 100) score += 5;
  else actions.push('Build PIC hours to increase command potential');

  // Age — career runway
  if (input.age) {
    if (input.age < 30) score += 15;
    else if (input.age < 40) score += 12;
    else if (input.age < 50) score += 8;
    else if (input.age < 55) score += 5;
    else score += 2;
  }

  // Lapsed or stuck penalty
  if (archetype === 'lapsed_returning') score = Math.round(score * 0.4);
  if (archetype === 'cfi_instructor_track' && years >= 5) {
    score = Math.round(score * 0.7);
    actions.push('You may be stuck in the CFI loop — consider strategic moves to break out');
  }

  score = Math.min(100, score);

  let status: ValueDimension['status'];
  if (score >= 65) status = 'strong';
  else if (score >= 40) status = 'moderate';
  else if (score >= 20) status = 'weak';
  else status = 'critical';

  return {
    key: 'career',
    label: 'Career Trajectory',
    score,
    status,
    description: score >= 65
      ? 'Your career is on a strong upward trajectory. You are building value with every hour.'
      : score >= 40
      ? 'Your career is progressing. Strategic decisions now will compound over time.'
      : score >= 20
      ? 'Your career trajectory is slow. Consider whether you are building the right kind of value.'
      : 'Your career trajectory is stalled or has not begun. The platform can help you identify the most efficient path forward.',
    improvementActions: actions.length > 0 ? actions : ['Keep building hours and consider your next career move'],
  };
}

function scoreTransferable(input: PilotValueInput): ValueDimension {
  let score = 0;
  const skills: string[] = [];

  // Rotary + fixed-wing = highly transferable
  if (input.rotaryHours && input.rotaryHours > 100 && input.totalFlightHours - input.rotaryHours > 100) {
    score += 25;
    skills.push('Dual rotary/fixed-wing experience');
  }

  // Offshore → HEMS, SAR
  if (input.offshoreHours && input.offshoreHours > 200) {
    score += 15;
    skills.push('Offshore experience transfers to HEMS, SAR, and maritime operations');
  }

  // Mountain → scenic, charter, HEMS
  if (input.mountainHours && input.mountainHours > 100) {
    score += 15;
    skills.push('Mountain flying transfers to scenic, charter, and alpine HEMS');
  }

  // Night → any IFR operation
  if (input.nightHours && input.nightHours > 100) {
    score += 10;
    skills.push('Night hours transfer to any IFR or 24/7 operation');
  }

  // Instrument → everything
  if (input.instrumentHours && input.instrumentHours > 100) {
    score += 15;
    skills.push('Instrument time transfers to every commercial operation');
  }

  // Multi-engine → airline, corporate
  if (input.multiEngineHours && input.multiEngineHours > 200) {
    score += 10;
    skills.push('Multi-engine time transfers to airline and corporate');
  }

  // Instructor → any training role
  if (input.licenses.some((l) => l.toUpperCase().includes('CFI') || l.toUpperCase().includes('INSTRUCTOR'))) {
    score += 10;
    skills.push('Instructor qualification transfers to training roles at airlines and ATOs');
  }

  score = Math.min(100, score);

  let status: ValueDimension['status'];
  if (score >= 50) status = 'strong';
  else if (score >= 25) status = 'moderate';
  else if (score >= 10) status = 'weak';
  else status = 'none';

  return {
    key: 'transferable',
    label: 'Transferable Skills',
    score,
    status,
    description: skills.length > 0
      ? `You have ${skills.length} transferable skill${skills.length > 1 ? 's' : ''}: ${skills.join('; ')}.`
      : 'Your experience is concentrated in one area. Consider broadening to increase transferability.',
    improvementActions: skills.length === 0
      ? ['Build experience in multiple categories to increase transferability']
      : ['Leverage your transferable skills when exploring new career pathways'],
  };
}

function scoreGap(input: PilotValueInput, archetype: PilotArchetype): ValueDimension {
  let score = 0;
  const actions: string[] = [];
  const h = input.totalFlightHours;

  // How close are you to the next milestone?
  if (h >= 3000) score += 30;  // Captain eligible
  else if (h >= 2000) score += 25;  // Close to captain minimums
  else if (h >= 1500) score += 20;  // ATPL/airline eligible
  else if (h >= 1000) score += 15;  // Getting close
  else if (h >= 500) score += 10;  // Building
  else if (h >= 250) score += 5;   // Just qualified
  else score += 2;

  // Type rating gap
  if (input.typeRatings.length > 0) score += 15;
  else actions.push('A type rating is likely your highest-value gap to close');

  // IR
  if (input.instrumentHours && input.instrumentHours > 50) score += 15;
  else actions.push('An instrument rating dramatically increases your value');

  // Multi-engine
  if (input.multiEngineHours && input.multiEngineHours > 50) score += 10;
  else actions.push('Multi-engine hours open more doors');

  // Medical
  if (input.medicalClass && input.medicalStatus !== 'lapsed' && input.medicalStatus !== 'expired') {
    score += 10;
  } else {
    actions.push('A current medical is foundational — without it, all other value is locked');
  }

  // Lapsed — gap is large but identifiable
  if (archetype === 'lapsed_returning') {
    score = Math.min(score, 15);
    actions.push('Your gaps are large but well-defined: medical, IR, ME currency. Each is closable.');
  }

  score = Math.min(100, score);

  let status: ValueDimension['status'];
  if (score >= 60) status = 'strong';
  else if (score >= 35) status = 'moderate';
  else if (score >= 15) status = 'weak';
  else status = 'critical';

  return {
    key: 'gap',
    label: 'Gap Potential',
    score,
    status,
    description: score >= 60
      ? 'You are close to multiple upgrade milestones. Small investments now will yield large value increases.'
      : score >= 35
      ? 'You have identifiable gaps that, if closed strategically, would significantly increase your value.'
      : score >= 15
      ? 'Your gaps are significant but well-defined. The platform can help you prioritize which to close first.'
      : 'Your gaps are large. The platform can help you build a restoration plan with clear costs and timelines.',
    improvementActions: actions.length > 0 ? actions : ['Continue closing gaps strategically'],
  };
}

function scoreRecognition(input: PilotValueInput): ValueDimension {
  let score = 0;
  const actions: string[] = [];

  if (input.recognitionScore) {
    score = Math.min(60, input.recognitionScore * 0.6);
  }

  if (input.recognitionTier) {
    const tier = input.recognitionTier.toLowerCase();
    if (tier.includes('platinum')) score += 25;
    else if (tier.includes('gold')) score += 20;
    else if (tier.includes('silver')) score += 15;
    else if (tier.includes('bronze')) score += 10;
    else score += 5;
  } else {
    actions.push('Achieve a recognition tier by completing your profile and getting verified');
  }

  if (input.subscriptionTier) {
    const sub = input.subscriptionTier.toLowerCase();
    if (sub.includes('enterprise') || sub.includes('plus')) score += 15;
    else if (sub.includes('recognition')) score += 10;
  }

  score = Math.min(100, score);

  let status: ValueDimension['status'];
  if (score >= 60) status = 'strong';
  else if (score >= 35) status = 'moderate';
  else if (score >= 15) status = 'weak';
  else status = 'none';

  return {
    key: 'recognition',
    label: 'Platform Recognition',
    score,
    status,
    description: score >= 60
      ? 'You are highly recognized on the platform. Your profile stands out to employers and peers.'
      : score >= 35
      ? 'You have moderate recognition. Completing verification and engaging more will increase your standing.'
      : score >= 15
      ? 'Your platform recognition is low. Get verified and engage with the community to build your profile.'
      : 'You have no platform recognition yet. Start by completing your profile and getting verified.',
    improvementActions: actions.length > 0 ? actions : ['Maintain your recognition tier through ongoing engagement'],
  };
}

// ============================================================================
// MARKET VALUE ESTIMATION
// ============================================================================

function estimateMarketValue(input: PilotValueInput, archetype: PilotArchetype): MarketValueEstimate {
  const h = input.totalFlightHours;
  const hasTypeRating = input.typeRatings.length > 0;
  const hasIR = (input.instrumentHours ?? 0) > 50;
  const hasME = (input.multiEngineHours ?? 0) > 50;

  // Base estimates by archetype (USD annual)
  const estimates: Record<PilotArchetype, MarketValueEstimate> = {
    student_pre_cpl: {
      current: { min: 0, max: 0, currency: 'USD', period: 'annual' },
      projected: { min: 25000, max: 40000, currency: 'USD', period: 'annual' },
      peak: { min: 150000, max: 280000, currency: 'USD', period: 'annual' },
      confidence: 30,
      valueDrivers: ['Potential', 'Training investment in progress'],
      valueLimiters: ['No qualifications yet', 'No flight hours', 'No verified credentials'],
      notes: 'Your current market value is zero. Your projected value after CPL+IR is $25-40K. Peak career value is $150-280K but requires 10-15 years of progression.',
    },
    fresh_cpl_no_experience: {
      current: { min: 0, max: 25000, currency: 'USD', period: 'annual' },
      projected: { min: 25000, max: 40000, currency: 'USD', period: 'annual' },
      peak: { min: 150000, max: 280000, currency: 'USD', period: 'annual' },
      confidence: 40,
      valueDrivers: ['CPL/IR qualification', 'Willingness to work'],
      valueLimiters: ['No operational experience', 'Low hours (200-250)', 'No type rating', 'No CFI'],
      notes: 'You are qualified on paper but have minimal market value. The hardest gap is 250→500 hours. CFI work or banner towing are the most common bridges.',
    },
    cfi_instructor_track: {
      current: { min: 25000, max: 45000, currency: 'USD', period: 'annual' },
      projected: { min: 45000, max: 80000, currency: 'USD', period: 'annual' },
      peak: { min: 150000, max: 280000, currency: 'USD', period: 'annual' },
      confidence: 55,
      valueDrivers: ['CFI/CFII/MEI qualifications', 'Building hours', 'Instructional experience'],
      valueLimiters: ['Low PIC time in type', 'May be stuck in CFI loop', 'Type rating may be needed'],
      notes: 'Your value is growing but may be plateauing. If you have been a CFI for 5+ years with no airline call, the issue may be type ratings or strategic positioning.',
    },
    atpl_aspirant: {
      current: { min: 30000, max: 50000, currency: 'USD', period: 'annual' },
      projected: { min: 50000, max: 90000, currency: 'USD', period: 'annual' },
      peak: { min: 150000, max: 280000, currency: 'USD', period: 'annual' },
      confidence: 50,
      valueDrivers: ['ATPL theory complete or in progress', 'Building toward airline minimums'],
      valueLimiters: ['Not yet at airline minimums', 'May need MCC/JOC'],
      notes: 'You are on the airline track. Your value will jump significantly once you hit 1500h and get a type rating.',
    },
    regional_fo: {
      current: { min: 31000, max: 60000, currency: 'USD', period: 'annual' },
      projected: { min: 60000, max: 120000, currency: 'USD', period: 'annual' },
      peak: { min: 150000, max: 280000, currency: 'USD', period: 'annual' },
      confidence: 65,
      valueDrivers: ['Airline experience', 'Type rating', 'Multi-crew experience', '121/135 operations'],
      valueLimiters: ['Low seniority', 'Reserve life', 'First-year pay scale'],
      notes: 'Your value is real but suppressed. First-year pay is low but your trajectory is strong. Your type rating and multi-crew experience are your key value drivers.',
    },
    cargo_charter_specialist: {
      current: { min: 45000, max: 85000, currency: 'USD', period: 'annual' },
      projected: { min: 70000, max: 130000, currency: 'USD', period: 'annual' },
      peak: { min: 150000, max: 250000, currency: 'USD', period: 'annual' },
      confidence: 55,
      valueDrivers: ['Turbine time', 'Single-pilot IFR', 'All-weather experience', 'Night operations'],
      valueLimiters: ['Niche experience may not transfer', 'Single-pilot time less valued by airlines', 'Type may not be airline-relevant'],
      notes: 'Your experience is valuable but may be more niche than you think. Airlines value multi-crew turbine time more than single-pilot turbine. Consider how to frame your experience.',
    },
    airline_captain: {
      current: { min: 120000, max: 250000, currency: 'USD', period: 'annual' },
      projected: { min: 150000, max: 280000, currency: 'USD', period: 'annual' },
      peak: { min: 200000, max: 350000, currency: 'USD', period: 'annual' },
      confidence: 70,
      valueDrivers: ['ATPL', 'Captain experience', 'Multiple type ratings', 'Multi-crew turbine PIC'],
      valueLimiters: ['Seniority chain at current employer', 'May be type-locked', 'Age may limit transitions'],
      notes: 'You have high market value. Your challenge is not employability — it is finding the right expression of your value. Consider expat contracts, wide-body transitions, or management roles.',
    },
    expat_international: {
      current: { min: 144000, max: 288000, currency: 'USD', period: 'annual' },
      projected: { min: 180000, max: 360000, currency: 'USD', period: 'annual' },
      peak: { min: 240000, max: 450000, currency: 'USD', period: 'annual' },
      confidence: 60,
      valueDrivers: ['Wide-body experience', 'International operations', 'High total time', 'Premium salary scale'],
      valueLimiters: ['Lifestyle costs (family, isolation)', 'Contract volatility', 'Type-specific lock-in'],
      notes: 'Your market value is premium. The international market pays 2-3x domestic rates. Your challenge is balancing value with lifestyle.',
    },
    retiring_senior: {
      current: { min: 180000, max: 300000, currency: 'USD', period: 'annual' },
      projected: { min: 0, max: 80000, currency: 'USD', period: 'annual' },
      peak: { min: 200000, max: 350000, currency: 'USD', period: 'annual' },
      confidence: 50,
      valueDrivers: ['Maximum experience', 'Training/management potential', 'Consulting value', 'Mentorship value'],
      valueLimiters: ['Mandatory retirement', 'Medical renewal risk', 'Pension/savings gap', 'Identity transition'],
      notes: 'Your flying value has a time limit. Your experience value does not. Consider training, consulting, management, or platform roles that leverage your knowledge.',
    },
    lapsed_returning: {
      current: { min: 0, max: 0, currency: 'USD', period: 'annual' },
      projected: { min: 25000, max: 50000, currency: 'USD', period: 'annual' },
      peak: { min: 100000, max: 200000, currency: 'USD', period: 'annual' },
      confidence: 30,
      valueDrivers: ['Existing CPL/IR theory', 'Previous flight experience', 'Life experience'],
      valueLimiters: ['Lapsed medical', 'Lapsed IR/ME', 'Currency gap', 'Age factor', 'Employment gap'],
      notes: 'Your current market value is near zero due to lapsed qualifications. Restoration cost: $5-10K. After restoration, your value would be $25-50K. The platform can help you decide if restoration is worth it.',
    },
    career_shifter: {
      current: { min: 0, max: 0, currency: 'USD', period: 'annual' },
      projected: { min: 25000, max: 45000, currency: 'USD', period: 'annual' },
      peak: { min: 120000, max: 250000, currency: 'USD', period: 'annual' },
      confidence: 25,
      valueDrivers: ['Transferable professional skills', 'Life experience', 'Potential'],
      valueLimiters: ['No aviation qualifications', 'Training cost', 'Time to qualification'],
      notes: 'Your aviation value is zero but your transferable skills have value. The platform can help you assess whether the investment in aviation training is worth it given your current career.',
    },
    industry_professional: {
      current: { min: 40000, max: 120000, currency: 'USD', period: 'annual' },
      projected: { min: 50000, max: 150000, currency: 'USD', period: 'annual' },
      peak: { min: 80000, max: 200000, currency: 'USD', period: 'annual' },
      confidence: 35,
      valueDrivers: ['Industry knowledge', 'Network', 'Operational understanding'],
      valueLimiters: ['Limited or no flying credentials', 'May need full training pathway'],
      notes: 'Your aviation industry value is real but separate from pilot value. If you want to become a pilot, your industry knowledge will accelerate your career but won't reduce training requirements.',
    },
    founder_builder: {
      current: { min: 0, max: 0, currency: 'USD', period: 'annual' },
      projected: { min: 0, max: 0, currency: 'USD', period: 'annual' },
      peak: { min: 0, max: 0, currency: 'USD', period: 'annual' },
      confidence: 20,
      valueDrivers: ['Lived experience', 'Platform building', 'Community contribution'],
      valueLimiters: ['Value is non-traditional', 'Not measured by employer salary'],
      notes: 'Your value is not measured in employer salary. Your value is in what you build, the pilots you help, and the platform you create. The recognition system should reflect this.',
    },
    unknown: {
      current: { min: 0, max: 0, currency: 'USD', period: 'annual' },
      projected: { min: 0, max: 0, currency: 'USD', period: 'annual' },
      peak: { min: 0, max: 0, currency: 'USD', period: 'annual' },
      confidence: 10,
      valueDrivers: [],
      valueLimiters: ['Insufficient profile data'],
      notes: 'Complete your profile to receive a value assessment.',
    },
  };

  const base = estimates[archetype];

  // Adjust for specific qualifications
  const valueDrivers = [...base.valueDrivers];
  const valueLimiters = [...base.valueLimiters];

  if (hasTypeRating) {
    valueDrivers.push(`${input.typeRatings.join(', ')} type rating${input.typeRatings.length > 1 ? 's' : ''}`);
  }
  if (hasIR && h >= 500) {
    valueDrivers.push('Instrument current');
  }
  if (hasME && h >= 200) {
    valueDrivers.push('Multi-engine time');
  }

  return {
    ...base,
    valueDrivers,
    valueLimiters,
  };
}

// ============================================================================
// VALUE GAP IDENTIFICATION
// ============================================================================

function identifyValueGaps(input: PilotValueInput, archetype: PilotArchetype): ValueGap[] {
  const gaps: ValueGap[] = [];
  const h = input.totalFlightHours;

  // Hours to next milestone
  if (h < 1500) {
    const needed = 1500 - h;
    gaps.push({
      label: 'Total Hours to 1,500 (Airline Minimum)',
      currentValue: `${h}h`,
      targetValue: '1,500h',
      estimatedCost: Math.round(needed * 200),
      estimatedTime: needed > 1250 ? '2-3 years (CFI/charter)' : needed > 500 ? '1-2 years' : '6-12 months',
      valueIncrease: { min: 20000, max: 40000, currency: 'USD', period: 'annual' },
      priority: 'high',
      rationale: '1,500h is the threshold for ATP/ATPL eligibility and most airline minimums. This is the single most important gap for most pilots.',
    });
  }

  // Type rating
  if (input.typeRatings.length === 0 && h >= 250) {
    gaps.push({
      label: 'Type Rating',
      currentValue: 'None',
      targetValue: 'Relevant type rating (e.g., A320, B737, AW139)',
      estimatedCost: 30000,
      estimatedTime: '4-8 weeks',
      valueIncrease: { min: 15000, max: 35000, currency: 'USD', period: 'annual' },
      priority: 'high',
      rationale: 'A type rating is often the difference between "qualified" and "employable." Choose based on market demand, not preference.',
    });
  }

  // Instrument rating
  if ((input.instrumentHours ?? 0) < 50) {
    gaps.push({
      label: 'Instrument Rating / Hours',
      currentValue: `${input.instrumentHours ?? 0}h instrument`,
      targetValue: '50+h instrument (IR current)',
      estimatedCost: 8000,
      estimatedTime: '2-3 months',
      valueIncrease: { min: 10000, max: 20000, currency: 'USD', period: 'annual' },
      priority: 'high',
      rationale: 'An instrument rating dramatically increases employability across all commercial operations.',
    });
  }

  // Multi-engine
  if ((input.multiEngineHours ?? 0) < 50) {
    gaps.push({
      label: 'Multi-Engine Hours',
      currentValue: `${input.multiEngineHours ?? 0}h ME`,
      targetValue: '50-200h multi-engine',
      estimatedCost: 5000,
      estimatedTime: '1-2 months',
      valueIncrease: { min: 8000, max: 15000, currency: 'USD', period: 'annual' },
      priority: 'medium',
      rationale: 'Multi-engine time is required for most airline and corporate positions.',
    });
  }

  // PIC hours
  if ((input.picHours ?? 0) < 500 && h >= 500) {
    gaps.push({
      label: 'PIC Hours',
      currentValue: `${input.picHours ?? 0}h PIC`,
      targetValue: '500-1000h PIC',
      estimatedCost: 0,
      estimatedTime: '1-2 years (in current role)',
      valueIncrease: { min: 10000, max: 25000, currency: 'USD', period: 'annual' },
      priority: 'medium',
      rationale: 'PIC time is valued more than total time by many employers. Build it strategically.',
    });
  }

  // Medical restoration (for lapsed)
  if (input.medicalStatus === 'lapsed' || input.medicalStatus === 'expired') {
    gaps.push({
      label: 'Medical Certificate Restoration',
      currentValue: input.medicalStatus,
      targetValue: 'Current Class 1 Medical',
      estimatedCost: 500,
      estimatedTime: '2-4 weeks',
      valueIncrease: { min: 25000, max: 50000, currency: 'USD', period: 'annual' },
      priority: 'high',
      rationale: 'Without a current medical, all other qualifications are locked. This is the first gap to close.',
    });
  }

  // CFI (for hour builders)
  if (h >= 250 && h < 1500 && !input.licenses.some((l) => l.toUpperCase().includes('CFI'))) {
    gaps.push({
      label: 'CFI Certification',
      currentValue: 'No CFI',
      targetValue: 'CFI/CFII/MEI',
      estimatedCost: 3000,
      estimatedTime: '1-2 months',
      valueIncrease: { min: 5000, max: 15000, currency: 'USD', period: 'annual' },
      priority: 'medium',
      rationale: 'A CFI is the most common and reliable way to build hours while earning income. It also adds instructional value.',
    });
  }

  return gaps.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// ============================================================================
// TRANSFERABLE SKILLS
// ============================================================================

function identifyTransferableSkills(input: PilotValueInput): TransferableSkill[] {
  const skills: TransferableSkill[] = [];

  if (input.rotaryHours && input.rotaryHours > 100) {
    skills.push({
      skill: 'Rotary-wing experience',
      fromCategory: 'Helicopter',
      toCategories: ['HEMS', 'SAR', 'Offshore', 'VIP charter', 'Aerial work'],
      valueNote: 'Rotary hours are scarce and command premium rates in specialized operations.',
    });
  }

  if (input.offshoreHours && input.offshoreHours > 200) {
    skills.push({
      skill: 'Offshore operations',
      fromCategory: 'Offshore O&G',
      toCategories: ['HEMS', 'SAR', 'Maritime patrol', 'Search and rescue'],
      valueNote: 'Offshore experience demonstrates multi-crew discipline and overwater operations capability.',
    });
  }

  if (input.mountainHours && input.mountainHours > 100) {
    skills.push({
      skill: 'Mountain flying',
      fromCategory: 'Alpine/Scenic',
      toCategories: ['HEMS', 'Charter', 'SAR', 'Aerial work', 'Film/photography'],
      valueNote: 'Mountain flying requires precision and judgment that transfers to any challenging environment.',
    });
  }

  if (input.nightHours && input.nightHours > 100) {
    skills.push({
      skill: 'Night operations',
      fromCategory: 'Any',
      toCategories: ['Cargo', 'HEMS', 'SAR', 'Airline', 'Charter'],
      valueNote: 'Night hours demonstrate instrument discipline and operational maturity.',
    });
  }

  if (input.licenses.some((l) => l.toUpperCase().includes('CFI') || l.toUpperCase().includes('INSTRUCTOR'))) {
    skills.push({
      skill: 'Instructional qualification',
      fromCategory: 'Flight training',
      toCategories: ['Airline training', 'ATO instructor', 'Simulator instructor', 'Type rating instructor'],
      valueNote: 'Instructor qualifications open training roles at every level, from CFI to TRE/TRI.',
    });
  }

  if (input.typeRatings.length > 0) {
    skills.push({
      skill: `${input.typeRatings.join(', ')} type rating${input.typeRatings.length > 1 ? 's' : ''}`,
      fromCategory: 'Type-specific',
      toCategories: ['Any operator flying that type', 'Simulator instruction', 'Type rating training'],
      valueNote: 'Type ratings are the most direct path to employability — they match you to specific operators.',
    });
  }

  return skills;
}

// ============================================================================
// VALUE NARRATIVE GENERATION
// ============================================================================

function generateNarrative(
  input: PilotValueInput,
  archetype: PilotArchetype,
  dimensions: ValueDimension[],
  marketValue: MarketValueEstimate,
  gaps: ValueGap[]
): { narrative: string; oneLine: string } {
  const archetypeInfo = ARCHETYPE_LABELS[archetype];
  const verifiedScore = dimensions.find((d) => d.key === 'verified')?.score ?? 0;
  const marketScore = dimensions.find((d) => d.key === 'market')?.score ?? 0;
  const careerScore = dimensions.find((d) => d.key === 'career')?.score ?? 0;

  const h = input.totalFlightHours;
  const tr = input.typeRatings.length > 0 ? ` with ${input.typeRatings.join(', ')} type rating${input.typeRatings.length > 1 ? 's' : ''}` : '';
  const lic = input.licenses.length > 0 ? ` and ${input.licenses.join(', ')}` : '';

  const oneLine = `${h}h total time${tr}${lic}. ${archetypeInfo.label}. Market value: $${marketValue.current.min.toLocaleString()}-$${marketValue.current.max.toLocaleString()}/yr.`;

  const gapSummary = gaps.length > 0
    ? `\n\nYour highest-value gap to close: ${gaps[0].label}. Closing it would increase your value by $${gaps[0].valueIncrease.min.toLocaleString()}-$${gaps[0].valueIncrease.max.toLocaleString()}/yr for an estimated $${gaps[0].estimatedCost.toLocaleString()} investment.`
    : '';

  const narrative = `${archetypeInfo.description}

You currently have ${h} total flight hours${lic}${tr}. Your verified credential score is ${verifiedScore}/100, your market value score is ${marketScore}/100, and your career trajectory score is ${careerScore}/100.

Your current market value is estimated at $${marketValue.current.min.toLocaleString()}-$${marketValue.current.max.toLocaleString()} ${marketValue.currency}/${marketValue.period}. With strategic development, your projected value is $${marketValue.projected.min.toLocaleString()}-$${marketValue.projected.max.toLocaleString()}, and your peak career value could reach $${marketValue.peak.min.toLocaleString()}-$${marketValue.peak.max.toLocaleString()}.

Key value drivers: ${marketValue.valueDrivers.join(', ')}.
Key value limiters: ${marketValue.valueLimiters.join(', ')}.${gapSummary}

Remember: your value exists independent of any job opening. Jobs are expressions of value, not the source of it. When you know your value, the right jobs find you.`;

  return { narrative, oneLine };
}

// ============================================================================
// MAIN ASSESSMENT FUNCTION
// ============================================================================

/**
 * Assess a pilot's value across 6 dimensions.
 * This is the core "what are you worth?" function.
 * It is independent of any specific job or operator.
 */
export function assessPilotValue(input: PilotValueInput): PilotValueAssessment {
  const { archetype, stage } = detectArchetype(input);
  const archetypeInfo = ARCHETYPE_LABELS[archetype];

  // Score each dimension
  const verified = scoreVerified(input);
  const market = scoreMarket(input, archetype);
  const career = scoreCareer(input, archetype);
  const transferable = scoreTransferable(input);
  const gap = scoreGap(input, archetype);
  const recognition = scoreRecognition(input);

  const dimensions = [verified, market, career, transferable, gap, recognition];

  // Overall score — weighted blend
  const overallValueScore = Math.round(
    verified.score * 0.20 +
    market.score * 0.25 +
    career.score * 0.20 +
    transferable.score * 0.10 +
    gap.score * 0.15 +
    recognition.score * 0.10
  );

  // Market value estimate
  const marketValue = estimateMarketValue(input, archetype);

  // Value gaps
  const valueGaps = identifyValueGaps(input, archetype);

  // Transferable skills
  const transferableSkills = identifyTransferableSkills(input);

  // Credentials
  const credentials: Credential[] = [];
  for (const license of input.licenses) {
    credentials.push({
      type: 'license',
      name: license,
      status: input.verificationStatus || 'unverified',
    });
  }
  for (const tr of input.typeRatings) {
    credentials.push({
      type: 'type_rating',
      name: tr,
      status: input.verificationStatus || 'unverified',
    });
  }
  if (input.medicalClass) {
    credentials.push({
      type: 'medical',
      name: input.medicalClass,
      status: input.medicalStatus || 'unverified',
      expiryDate: input.medicalExpiryDate,
    });
  }
  if (input.icaoElpLevel) {
    credentials.push({
      type: 'english',
      name: `ICAO English Level ${input.icaoElpLevel}`,
      status: 'verified',
    });
  }

  // Narrative
  const { narrative, oneLine } = generateNarrative(input, archetype, dimensions, marketValue, valueGaps);

  // Confidence — based on how much data we have
  let confidenceLevel = 50;
  if (input.verificationStatus === 'verified') confidenceLevel += 20;
  if (input.licenses.length > 0) confidenceLevel += 10;
  if (input.typeRatings.length > 0) confidenceLevel += 10;
  if (input.medicalClass) confidenceLevel += 5;
  if (input.currentRole) confidenceLevel += 5;
  confidenceLevel = Math.min(100, confidenceLevel);

  return {
    archetype,
    careerStage: stage,
    archetypeLabel: archetypeInfo.label,
    archetypeDescription: archetypeInfo.description,
    dimensions,
    overallValueScore,
    marketValue,
    valueGaps,
    transferableSkills,
    credentials,
    valueNarrative: narrative,
    oneLineValue: oneLine,
    assessmentDate: new Date().toISOString(),
    confidenceLevel,
  };
}
