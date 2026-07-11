// Persona Context Layer
//
// Every pilot archetype sees an operator differently.
// A student with 0 hours sees "this is where I could be in 10 years."
// A 15-year waiting pilot sees "this is what I could have been."
// A captain sees "this is my next move or my exit."
//
// This module recontextualizes operator data for each archetype,
// so every persona can read an operator page and see what it means
// for THEM specifically.

import type { PilotArchetype, CareerStage } from './pilotValue';
import type { OperatorCategory } from './types';

// ============================================================================
// TYPES
// ============================================================================

/** How relevant an operator is to a specific archetype */
export type RelevanceLevel =
  | 'aspirational'   // Future destination — not yet reachable
  | 'bridge'         // Stepping stone toward a bigger goal
  | 'destination'    // Direct career target
  | 'lateral'        // Alternative to current path
  | 'exit'           // Way out of current situation
  | 'recovery'       // Path back after lapse/stagnation
  | 'irrelevant'     // Not applicable to this archetype
  | 'warning';       // Cautionary tale — learn from this

/** Persona-specific context for an operator */
export interface PersonaOperatorContext {
  archetype: PilotArchetype;
  /** How this operator is relevant to this archetype */
  relevance: RelevanceLevel;
  /** One-line hook for this archetype */
  hook: string;
  /** What this operator means for this archetype (2-3 paragraphs) */
  meaning: string;
  /** What this archetype should do next */
  actionItems: string[];
  /** What this archetype should watch out for */
  warnings: string[];
  /** How far away this operator is for this archetype */
  distance: {
    hoursAway: number;
    ratingsNeeded: string[];
    estimatedYears: string;
    estimatedCost: number;
    /** Whether this is a realistic target */
    realistic: boolean;
  };
  /** What this operator looks like from this archetype's perspective */
  perspective: string;
}

/** Context for all archetypes for a single operator */
export type PersonaContextMap = Partial<Record<PilotArchetype, PersonaOperatorContext>>;

// ============================================================================
// ARCHETYPE-OPERATOR CONTEXT GENERATION
// ============================================================================

/**
 * Generate persona-specific context for an operator.
 *
 * This is the function that makes every operator readable by every persona.
 * A student sees aspiration. A lapsed pilot sees recovery. A captain sees
 * lateral movement. Each gets a tailored narrative.
 */
export function generatePersonaContext(
  operator: {
    name: string;
    category: OperatorCategory;
    country: string;
    fleet?: string[];
    bases?: string[];
    services?: string[];
    career?: {
      hiringStatus: string;
      pilotTypes: string[];
      notes: string;
    };
    requirements?: {
      firstOfficer?: { minTotalHours: number; requiredRatings: string[] };
      captain?: { minTotalHours: number; requiredRatings: string[] };
      cadet?: { minTotalHours: number; requiredRatings: string[] };
    } | null;
    training?: {
      cadetProgram?: boolean;
      typeRatingProvided?: boolean;
      bondPeriod?: string;
    } | null;
    lifestyle?: {
      compensationRange?: { min: number; max: number; currency: string };
      rosterPattern?: string;
      seasonality?: string;
    } | null;
  },
  pilotArchetype: PilotArchetype,
  pilotHours: number
): PersonaOperatorContext {
  const minHours = operator.requirements?.firstOfficer?.minTotalHours
    ?? operator.requirements?.cadet?.minTotalHours
    ?? 1000;
  const hoursAway = Math.max(0, minHours - pilotHours);
  const neededRatings = operator.requirements?.firstOfficer?.requiredRatings ?? [];
  const hasCadetProgram = operator.training?.cadetProgram ?? false;

  // Estimate years and cost
  const hoursPerYear = 300; // Conservative estimate
  const yearsToClose = hoursAway / hoursPerYear;
  let estimatedYears: string;
  if (hoursAway === 0) estimatedYears = 'Ready now';
  else if (yearsToClose <= 0.5) estimatedYears = '6 months';
  else if (yearsToClose <= 1) estimatedYears = '1 year';
  else if (yearsToClose <= 2) estimatedYears = '1-2 years';
  else if (yearsToClose <= 5) estimatedYears = `${Math.round(yearsToClose)} years`;
  else estimatedYears = `${Math.round(yearsToClose)}+ years`;

  const estimatedCost = hoursAway * 200 + (neededRatings.length * 30000);

  // Determine relevance
  let relevance: RelevanceLevel;
  if (hoursAway === 0) relevance = 'destination';
  else if (hoursAway > 5000) relevance = 'irrelevant';
  else if (pilotArchetype === 'lapsed_returning') relevance = 'recovery';
  else if (pilotArchetype === 'cfi_instructor_track' && hoursAway < 1000) relevance = 'bridge';
  else if (pilotArchetype === 'airline_captain' && operator.category === 'helicopter') relevance = 'lateral';
  else if (pilotArchetype === 'retiring_senior') relevance = 'exit';
  else if (pilotArchetype === 'student_pre_cpl' || pilotArchetype === 'fresh_cpl_no_experience') relevance = 'aspirational';
  else if (pilotArchetype === 'career_shifter' && hasCadetProgram) relevance = 'bridge';
  else relevance = 'aspirational';

  const realistic = hoursAway <= 5000 && pilotArchetype !== 'retiring_senior';

  // Generate archetype-specific content
  return generateArchetypeSpecificContext(
    operator,
    pilotArchetype,
    relevance,
    hoursAway,
    neededRatings,
    estimatedYears,
    estimatedCost,
    realistic,
    hasCadetProgram
  );
}

// ============================================================================
// ARCHETYPE-SPECIFIC CONTEXT GENERATION
// ============================================================================

function generateArchetypeSpecificContext(
  operator: {
    name: string;
    category: OperatorCategory;
    country: string;
    fleet?: string[];
    services?: string[];
    career?: { hiringStatus: string; pilotTypes: string[]; notes: string };
  },
  archetype: PilotArchetype,
  relevance: RelevanceLevel,
  hoursAway: number,
  neededRatings: string[],
  estimatedYears: string,
  estimatedCost: number,
  realistic: boolean,
  hasCadetProgram: boolean
): PersonaOperatorContext {
  const baseContext = {
    archetype,
    relevance,
    distance: {
      hoursAway,
      ratingsNeeded: neededRatings,
      estimatedYears,
      estimatedCost,
      realistic,
    },
  };

  switch (archetype) {
    // =====================================================
    case 'student_pre_cpl':
      return {
        ...baseContext,
        hook: hoursAway > 2000
          ? `${operator.name} is a future destination — here's what you're working toward.`
          : `${operator.name} could be your first or second flying job.`,
        meaning: `You are at the very beginning of your journey. ${operator.name} operates ${operator.services?.join(', ') ?? 'helicopter services'} in ${operator.country}. ${hoursAway > 2000 ? 'This is an aspirational target — something to aim for over years of building hours and experience.' : 'This could be reachable within your first few years if you stay focused.'} ${hasCadetProgram ? 'They offer a cadet program, which could be a direct entry path for you.' : ''} Right now, your job is not to apply here — it is to understand what they need so you can build toward it deliberately.`,
        actionItems: [
          'Focus on completing your current training milestone (PPL or CPL)',
          hasCadetProgram ? `Investigate ${operator.name}'s cadet program requirements — this could be your fastest path` : 'Research what qualifications this operator requires',
          'Use this operator as a north star — let it guide your training decisions',
          'Don\'t rush — every hour you build now is an investment toward operators like this',
        ],
        warnings: [
          'Do not apply yet — you are not ready, and premature applications can hurt your reputation',
          'Do not self-fund a type rating hoping it will help — most operators prefer to train their own',
          'Flight school marketing may not align with what operators like this actually want',
        ],
        perspective: 'You are looking at this operator from the bottom of the mountain. It seems far away, but every pilot who flies for them started where you are now. The question is not "can I get there?" — it is "what is the most efficient path?"',
      };

    // =====================================================
    case 'fresh_cpl_no_experience':
      return {
        ...baseContext,
        hook: hoursAway < 500
          ? `${operator.name} is within reach — but you need a bridge to get there.`
          : `${operator.name} is a longer-term target. You need to build hours first.`,
        meaning: `You have your CPL but no operational experience. This is the hardest gap in aviation. ${operator.name} requires approximately ${hoursAway > 0 ? `${hoursAway} more hours` : 'meets your hours'} and ${neededRatings.length > 0 ? neededRatings.join(', ') : 'no additional ratings'}. ${hoursAway < 500 ? 'You are close enough that a CFI role or banner towing could bridge the gap in 1-2 years.' : 'You need significant hour building before this is realistic.'} ${hasCadetProgram ? 'Their cadet program may accept you at your current level — investigate this immediately.' : ''} The key insight: your CPL is not worthless, but it is not enough. You need a plan, not just applications.`,
        actionItems: [
          hoursAway < 500 ? 'Get a CFI certificate and start instructing — this is your fastest bridge' : 'Find any flying job that builds hours (CFI, banner tow, survey, scenic)',
          hasCadetProgram ? `Check if ${operator.name}'s cadet program accepts fresh CPL holders` : 'Research operators that hire at your current hours',
          'Stop applying to jobs that require 1000h+ — focus on building, not applying',
          'Track your hours deliberately — know exactly how far you are from each target',
        ],
        warnings: [
          'The 200-500 hour gap is where most pilots give up — do not become a statistic',
          'Do not take a non-flying "survival job" unless absolutely necessary — it kills your currency',
          'Do not self-fund a type rating — it rarely helps at your stage and can trap you in debt',
          'Be wary of "pay-to-fly" schemes — they exploit desperate low-hour pilots',
        ],
        perspective: 'You are in the valley between qualification and employability. Every pilot who made it through this gap did it by finding a bridge role — CFI, banner tow, scenic, survey. Your job right now is not to get hired by this operator. It is to get hired by anyone who will pay you to fly.',
      };

    // =====================================================
    case 'cfi_instructor_track':
      return {
        ...baseContext,
        hook: hoursAway < 500
          ? `${operator.name} is your next move — you are close to qualifying.`
          : `${operator.name} is a realistic target if you keep building strategically.`,
        meaning: `You have been instructing and building hours. ${operator.name} requires approximately ${hoursAway > 0 ? `${hoursAway} more hours` : 'meets your hours'}. ${hoursAway < 500 ? 'You are within striking distance. If you have been a CFI for 3+ years and haven't applied to operators like this, you may be stuck in the CFI comfort zone.' : 'You need more hours, but you are on the right track — keep building.'} ${neededRatings.length > 0 ? `You need: ${neededRatings.join(', ')}.` : ''} The key question: are you building the RIGHT hours, or just any hours? ${operator.category === 'helicopter' ? 'Your rotary hours are valuable — make sure you are building PIC and turbine time, not just instruction time.' : ''}`,
        actionItems: [
          hoursAway < 500 ? `Apply to ${operator.name} now — you meet or are close to minimums` : `Set a target date: "${estimatedYears}" to reach ${operator.name}'s minimums`,
          neededRatings.length > 0 ? `Plan how to get ${neededRatings.join(', ')} — this is your highest-value gap` : 'Ensure your hours are in the right categories (PIC, turbine, multi-engine)',
          'Do not stay a CFI for more than 5 years without a strategic reason — the CFI loop is real',
          'Use your instructional experience as a selling point — operators value training potential',
        ],
        warnings: [
          'If you have been a CFI for 5+ years with no airline/operator call, something is wrong — audit your strategy',
          'Instruction hours are not the same as operational hours — operators know the difference',
          'Do not let comfort keep you in the CFI seat — every year of delay compounds',
          'Your type rating (if any) may be expiring — keep it current or plan to get a new one',
        ],
        perspective: 'You are on the runway, ready for takeoff. The CFI years were not wasted — they built hours and instructional value. But if you do not make your move soon, you risk becoming a permanent instructor. This operator is not a dream — it is a logical next step.',
      };

    // =====================================================
    case 'atpl_aspirant':
      return {
        ...baseContext,
        hook: `${operator.name} is ${hoursAway < 500 ? 'a direct target' : 'a future target'} on your airline pathway.`,
        meaning: `You are working toward ATPL eligibility. ${operator.name} requires ${hoursAway > 0 ? `${hoursAway} more hours` : 'meets your hours'}. ${hoursAway < 500 ? 'You are very close — finish your exams and apply.' : 'Keep building — you will get here.'} ${operator.category === 'helicopter' ? 'Note: this is a helicopter operator. If your goal is fixed-wing airline, this is a lateral move, not a step up. But rotary experience can be valuable if you want to keep options open.' : ''} Your ATPL theory is your key differentiator — once complete, your value jumps significantly.`,
        actionItems: [
          'Finish your ATPL exams — this is your highest priority',
          hoursAway < 500 ? `Apply to ${operator.name} once exams are complete` : 'Continue hour building while completing exams',
          'Consider MCC/JOC course if you haven\'t done it — many operators require it',
          'Network with pilots already at this operator — referrals matter',
        ],
        warnings: [
          'Do not let ATPL theory drag on for years — set a deadline and stick to it',
          'Make sure your hours are in the right categories for this operator',
          'A frozen ATPL with no type rating is still a tough sell — plan your next step',
        ],
        perspective: 'You are in the final stretch of qualification. The ATPL exams are grueling but they are your ticket. This operator is not a dream — it is a logical destination. Finish what you started.',
      };

    // =====================================================
    case 'regional_fo':
      return {
        ...baseContext,
        hook: hoursAway < 500
          ? `${operator.name} is a viable next step from your regional role.`
          : `${operator.name} is a longer-term target — keep building in your current seat.`,
        meaning: `You have airline experience and a type rating. ${operator.name} requires ${hoursAway > 0 ? `${hoursAway} more hours` : 'meets your hours'}. ${operator.category === 'helicopter' ? 'This is a category switch — from fixed-wing regional to rotary. That is a significant decision. Your airline hours transfer as total time, but you would need rotary qualifications. Consider whether this is a pivot you want.' : 'Your regional experience is directly transferable. You have multi-crew discipline, SOPs, and airline operations experience.'} Your current challenge is not qualifications — it is whether to stay in the seniority queue or make a strategic move.`,
        actionItems: [
          operator.category === 'helicopter' ? 'Carefully consider whether a rotary switch is right for you — it is hard to reverse' : `Apply to ${operator.name} — your airline experience is a strong differentiator`,
          'Update your CV to highlight multi-crew experience and SOP discipline',
          'Research this operator\'s culture and lifestyle — not all moves are lateral improvements',
          'Consider the seniority trade-off — starting over at a new operator has costs',
        ],
        warnings: [
          'Do not jump from one low-paying operator to another — research compensation carefully',
          'Your current type rating may not transfer — check before you assume',
          'Seniority is everything in airlines — leaving yours has a real cost',
          'Make sure you are running TO something, not FROM something',
        ],
        perspective: 'You have real value — airline experience, type rating, multi-crew discipline. The question is not "can I get hired here?" — it is "is this the right move for my career?" Do not let frustration with your current role drive a bad decision.',
      };

    // =====================================================
    case 'cargo_charter_specialist':
      return {
        ...baseContext,
        hook: `${operator.name} is ${hoursAway < 500 ? 'a direct transition target' : 'a future target'} from your cargo/charter role.`,
        meaning: `You have specialized experience in cargo/charter operations. ${operator.name} operates ${operator.services?.join(', ') ?? 'helicopter services'}. ${operator.category === 'helicopter' ? 'Your fixed-wing cargo time counts as total time, but you would need rotary qualifications. Consider whether your niche experience is an asset or a trap.' : 'Your cargo/charter experience demonstrates single-pilot discipline and all-weather capability.'} The key question: is your specialized experience valued by this operator, or do they want a different profile? ${hoursAway < 500 ? 'You are close enough to apply directly.' : 'You need more hours, but your experience profile is interesting.'}`,
        actionItems: [
          'Frame your cargo/charter experience as a strength — single-pilot IFR, all-weather, decision-making',
          hoursAway < 500 ? `Apply to ${operator.name} with a cover letter that highlights your operational experience` : 'Keep building hours while researching this operator\'s culture',
          'Consider whether you want to stay in a niche or move to a larger operation',
          'Network with pilots who have made similar transitions',
        ],
        warnings: [
          'Single-pilot turbine time is valued less than multi-crew turbine time by many operators',
          'Your niche experience may be worth more in your current sector than in a new one',
          'Do not assume your cargo hours transfer seamlessly — research what this operator actually values',
        ],
        perspective: 'You have real-world experience that many airline pilots lack — single-pilot IFR, night cargo, marginal weather. But that experience may be more valued in some sectors than others. Choose your next move based on where your specific experience is an asset, not a liability.',
      };

    // =====================================================
    case 'airline_captain':
      return {
        ...baseContext,
        hook: operator.category === 'helicopter'
          ? `${operator.name} is a lateral move — rotary could be a fresh start or a step back.`
          : `${operator.name} is a potential lateral or upward move from your captain role.`,
        meaning: `You are an experienced captain with significant value. ${operator.name} operates ${operator.services?.join(', ') ?? 'helicopter services'} in ${operator.country}. ${operator.category === 'helicopter' ? 'Switching to rotary is a major decision. Your fixed-wing hours transfer as total time, but you would need rotary qualifications and a new type rating. This is not a step up — it is a different direction. Consider whether you are looking for a change or an escape.' : 'Your captain experience is highly valued. The question is not whether you can get hired — it is whether this operator offers better compensation, lifestyle, or career satisfaction than your current role.'} Your seniority is your biggest asset and your biggest constraint.`,
        actionItems: [
          'Compare total compensation (salary, benefits, pension, lifestyle) between your current role and this operator',
          'Research the operator\'s culture, safety record, and pilot satisfaction',
          operator.category === 'helicopter' ? 'If seriously considering rotary, get a trial lesson first — make sure you actually enjoy it' : 'Talk to pilots at this operator before applying — insider knowledge is critical',
          'Consider management or training roles as an alternative to a lateral move',
        ],
        warnings: [
          'Do not leave your seniority without a clear understanding of what you gain',
          'A lateral move can reset your career trajectory — make sure it is worth it',
          'Your current type rating may not transfer — you may need to invest in a new one',
          'Boredom is not a good reason to switch — find challenges within your current role first',
        ],
        perspective: 'You have maximum market value. Your challenge is not employability — it is finding the right expression of your experience. Every move from here should be strategic, not reactive. You have the luxury of choosing, not chasing.',
      };

    // =====================================================
    case 'expat_international':
      return {
        ...baseContext,
        hook: `${operator.name} is ${operator.country === 'australia' || operator.country === 'new_zealand' ? 'a potential homecoming' : 'a potential base in your region of interest'}.`,
        meaning: `You have premium international experience. ${operator.name} in ${operator.country} operates ${operator.services?.join(', ') ?? 'helicopter services'}. ${operator.category === 'helicopter' ? 'Your wide-body experience is not directly transferable to rotary, but your multi-crew discipline and international operations experience are valued.' : 'Your international experience is directly transferable.'} The key question: are you looking for a base change, a lifestyle change, or a career change? Each has different implications.`,
        actionItems: [
          'Research visa and work permit requirements for this country',
          'Compare compensation in local currency — factor in tax differences',
          'Investigate lifestyle factors: cost of living, healthcare, education for family',
          'Consider whether this is a permanent move or a contract — each has different implications',
        ],
        warnings: [
          'Expat contracts can be volatile — research the operator\'s financial stability',
          'Your current type rating may not be valid in a new country\'s regulatory system',
          'Family considerations are often the real decision factor — do not ignore them',
          'A "better" job on paper can be worse in reality if the lifestyle is wrong',
        ],
        perspective: 'You have the most portable value in aviation — international experience, wide-body time, premium salary history. But portability does not mean every move is good. Choose based on total life value, not just compensation.',
      };

    // =====================================================
    case 'retiring_senior':
      return {
        ...baseContext,
        hook: `${operator.name} could be a post-retirement role — training, consulting, or part-time flying.`,
        meaning: `You are approaching mandatory retirement with maximum experience. ${operator.name} operates ${operator.services?.join(', ') ?? 'helicopter services'}. Your flying career has a time limit, but your experience does not. ${operator.category === 'helicopter' ? 'If you have rotary experience, this operator may value you for training or management roles.' : 'Your airline experience may not directly transfer to rotary operations, but your training and management experience does.'} Consider roles like TRE/TRI, chief pilot, safety manager, or consultant. Your value is no longer in the cockpit — it is in what you know.`,
        actionItems: [
          'Contact this operator about training, checking, or management roles',
          'Consider consulting opportunities — your experience is worth more than a salary',
          'Look into simulator instruction — it extends your teaching career beyond flight time',
          'Write, speak, and share your knowledge — there is value in being a recognized expert',
        ],
        warnings: [
          'Do not assume your airline experience automatically qualifies you for rotary roles',
          'Medical renewal may become uncertain — plan for non-flying roles',
          'Identity transition is real — start building your post-flying identity now',
          'Financial planning is critical — $180K savings is not enough for a 20+ year retirement',
        ],
        perspective: 'Your value is at its peak in terms of experience, but it is shifting from flying value to knowledge value. The operators that recognize this will want you for training, safety, and management. The ones that do not are not worth your time.',
      };

    // =====================================================
    case 'lapsed_returning':
      return {
        ...baseContext,
        hook: hoursAway < 200
          ? `${operator.name} is a realistic recovery target — if you restore your qualifications.`
          : `${operator.name} is a longer-term recovery target — but recovery is possible.`,
        meaning: `You were qualified but let your currency lapse. ${operator.name} requires ${hoursAway > 0 ? `${hoursAway} more hours` : 'meets your hours'} and ${neededRatings.length > 0 ? neededRatings.join(', ') : 'no additional ratings'}. Your first step is not applying here — it is restoring your medical, IR, and multi-engine currency. That costs approximately $5,000-10,000 and takes 2-4 weeks. ${hasCadetProgram ? 'Their cadet program may be a viable re-entry path.' : ''} Your previous experience is not worthless — it counts as total time. But you need to be honest about how much value decay has occurred.`,
        actionItems: [
          'Step 1: Restore your medical certificate — without it, nothing else matters',
          'Step 2: Restore your IR and multi-engine currency',
          'Step 3: Get current in any aircraft — even a C172 — to show recent flight time',
          'Step 4: Be honest in applications about your gap — frame it as a deliberate pause, not a failure',
          hasCadetProgram ? `Step 5: Investigate ${operator.name}'s cadet program as a structured re-entry path` : `Step 5: Research operators that are open to returning pilots`,
        ],
        warnings: [
          'Do not apply to any operator until your medical and IR are current — it wastes everyone\'s time',
          'Be prepared for rejection — many operators will not consider lapsed pilots',
          'Your age is a factor — be realistic about how many years you have left to build a career',
          'The cost of restoration may not be worth it if you cannot fly for long enough to recoup',
          'Do not let pride stop you from starting at the bottom — a CFI role may be your best re-entry',
        ],
        perspective: 'Your value has decayed but it is not zero. You have flight time, theory knowledge, and life experience that a fresh CPL holder does not. But you need to be brutally honest about what it will cost to restore your value and whether the investment is worth it. The platform can help you calculate this.',
      };

    // =====================================================
    case 'career_shifter':
      return {
        ...baseContext,
        hook: hasCadetProgram
          ? `${operator.name} has a cadet program — this could be your entry into aviation.`
          : `${operator.name} is a future target — you need to qualify first.`,
        meaning: `You are transitioning into aviation from another career. ${operator.name} operates ${operator.services?.join(', ') ?? 'helicopter services'} in ${operator.country}. ${hasCadetProgram ? 'Their cadet program is designed for people like you — those with zero or low hours who want a structured path into the cockpit.' : 'You will need to self-fund your training and build hours independently before this operator is realistic.'} Your transferable skills (leadership, decision-making, professional experience) are valuable but they do not reduce training requirements. The key question: is the investment worth it given your age and career runway?`,
        actionItems: [
          hasCadetProgram ? `Research ${operator.name}'s cadet program — this is your fastest path` : 'Research integrated ATPL programs that take you from zero to airline-ready',
          'Calculate the total cost: training + living expenses + opportunity cost of leaving your current career',
          'Be honest about your age — aviation has a long training and building period',
          'Talk to pilots who entered aviation as career shifters — learn from their experience',
        ],
        warnings: [
          'Aviation training is expensive and the payoff is slow — first-year FO pay can be $31K',
          'Your current career skills do not reduce flight training requirements',
          'Age matters — if you are over 40, the math gets harder',
          'Do not believe flight school marketing about "airline pilot in 18 months" — it rarely works that way',
        ],
        perspective: 'You have something most student pilots lack: life experience and professional skills. But aviation does not care about your previous career — it cares about your hours, ratings, and type certificates. Your challenge is deciding whether the investment is worth it, and if yes, finding the most efficient path.',
      };

    // =====================================================
    case 'industry_professional':
      return {
        ...baseContext,
        hook: `${operator.name} is an operator you may work with — or an operator you could fly for.`,
        meaning: `You work in aviation but not as a pilot. ${operator.name} operates ${operator.services?.join(', ') ?? 'helicopter services'} in ${operator.country}. Your industry knowledge gives you an advantage in understanding this operator\'s business, but it does not reduce pilot training requirements. ${pilotHours > 0 ? `You have ${pilotHours} flight hours — you have started the journey.` : 'If you want to become a pilot, you need to start from the beginning like everyone else.'} Your industry network is a real asset — use it.`,
        actionItems: [
          'Leverage your industry network — you may know people at this operator',
          pilotHours > 0 ? 'Continue flight training while working — your industry job funds it' : 'Research whether pilot training is worth it given your current career trajectory',
          'Your operations knowledge is valuable — consider management or operations roles at this operator',
          'If you want to fly, start training now — every year of delay reduces your career runway',
        ],
        warnings: [
          'Do not assume your industry experience gives you priority in pilot hiring',
          'Pilot training is a full commitment — do not underestimate the time and cost',
          'Your current career may be worth more than a pilot salary — do the math honestly',
        ],
        perspective: 'You have a unique advantage: you understand the industry from the inside. Whether you want to become a pilot or move into management at an operator like this, your knowledge is an asset. The question is which direction maximizes your value.',
      };

    // =====================================================
    case 'founder_builder':
      return {
        ...baseContext,
        hook: `${operator.name} is a data point — and potentially a partner.`,
        meaning: `You are building in aviation. ${operator.name} is the type of operator your platform serves. Understanding their hiring requirements, training programs, and pilot needs is directly relevant to what you are building. ${pilotHours > 0 ? `Your ${pilotHours} flight hours give you credibility — you are not just a tech person, you have lived it.` : 'Your lack of flight hours means you need to listen to pilots more than you talk.'} This operator\'s data — requirements, compensation, lifestyle — is the raw material for the value you are creating.`,
        actionItems: [
          'Study this operator\'s requirements and training structure — it informs your platform design',
          'Consider reaching out to this operator as a potential partner or data source',
          pilotHours > 0 ? 'Your flying experience is your greatest asset — keep current if possible' : 'Take flight lessons if you can — nothing builds empathy with users like lived experience',
          'Document what this operator gets right and wrong — it is product feedback',
        ],
        warnings: [
          'Do not treat operators as just data sources — they are potential customers and partners',
          'Your platform\'s value depends on accurate, current operator data — keep it updated',
          'Do not lose your pilot perspective — if you have hours, keep flying',
        ],
        perspective: 'Every operator like this is both a data source and a potential customer. Your job is to understand them deeply enough to build something they would use, and something that helps pilots navigate them. Your lived experience (if you have it) is what makes your platform different from a generic job board.',
      };

    // =====================================================
    default:
      return {
        ...baseContext,
        hook: `${operator.name} — complete your profile for personalized context.`,
        meaning: `Complete your profile to see how ${operator.name} relates to your specific situation. The platform will assess your value, identify your gaps, and show you exactly what this operator means for you.`,
        actionItems: [
          'Complete your pilot profile (hours, licenses, ratings, medical)',
          'Get verified through the platform',
          'Run a value assessment to understand your current worth',
        ],
        warnings: [],
        perspective: 'Every pilot sees an operator differently. Complete your profile to see this operator through your own lens.',
      };
  }
}

// ============================================================================
// BATCH CONTEXT GENERATION
// ============================================================================

/**
 * Generate persona context for all archetypes at once.
 * Useful for precomputing context or for admin views.
 */
export function generateAllPersonaContexts(
  operator: Parameters<typeof generatePersonaContext>[0],
  pilotHours: number
): PersonaContextMap {
  const archetypes: PilotArchetype[] = [
    'student_pre_cpl',
    'fresh_cpl_no_experience',
    'cfi_instructor_track',
    'atpl_aspirant',
    'regional_fo',
    'cargo_charter_specialist',
    'airline_captain',
    'expat_international',
    'retiring_senior',
    'lapsed_returning',
    'career_shifter',
    'industry_professional',
    'founder_builder',
  ];

  const map: PersonaContextMap = {};
  for (const archetype of archetypes) {
    map[archetype] = generatePersonaContext(operator, archetype, pilotHours);
  }
  return map;
}

/**
 * Generate context for a specific pilot based on their archetype and hours.
 * This is the function the UI calls to show personalized operator context.
 */
export function generatePersonalContext(
  operator: Parameters<typeof generatePersonaContext>[0],
  archetype: PilotArchetype,
  pilotHours: number
): PersonaOperatorContext {
  return generatePersonaContext(operator, archetype, pilotHours);
}
