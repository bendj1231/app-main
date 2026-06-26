/**
 * Pathway Worker — Aviation Reference Data API
 *
 * Public endpoints (no auth):
 *   GET /manufacturers
 *   GET /manufacturers/:id
 *   GET /aircraft
 *   GET /aircraft/:id
 *   GET /aircraft?manufacturer_id=xxx
 *   GET /aircraft?category=xxx
 *   GET /training-requirements?aircraft_id=xxx
 *   GET /simulator-locations?aircraft_id=xxx
 *   GET /atos
 *   GET /atos?country=xxx&city=xxx&fast_track=1
 *   GET /atos/:slug
 *   GET /atos/:slug/programs
 *   GET /atos/:slug/ratings
 *   GET /atos/:slug/fleet
 *   GET /atos/:slug/instructors
 *   GET /trcs
 *   GET /trcs?country=xxx&aircraft=a320neo
 *   GET /trcs/:slug
 *   GET /trcs/:slug/ratings
 *   GET /trcs/:slug/simulators
 *   GET /trcs/:slug/instructors
 *   GET /airlines
 *   GET /airlines?country=xxx&is_hiring=1
 *   GET /airlines/:slug
 *   GET /airlines/:slug/cadet-programs
 *   GET /airlines/:slug/fleet
 *   GET /airlines/:slug/pathways
 *   POST /airlines/:slug/pathway-match   → Compare pilot profile vs airline pathways
 *   POST /pathways/:id/submit-interest   → Pilot submits interest, falls into candidate pool
 *   GET /private-jet-charters
 *   GET /private-jet-charters?country=xxx&is_hiring=1
 *   GET /private-jet-charters/:slug
 *   GET /search?q=query
 *
 * Enterprise endpoints (Auth0 JWT + enterprise role):
 *   PUT  /manufacturers/:id          → Update manufacturer profile
 *   POST /manufacturers/:id/claim    → Claim manufacturer profile
 *   PUT  /aircraft/:id               → Update aircraft specs
 *   POST /aircraft                   → Add new aircraft model
 *   PUT  /training-requirements/:id  → Update training requirement
 *   POST /training-requirements      → Add new requirement
 *   PUT  /simulator-locations/:id    → Update simulator location
 *   POST /simulator-locations        → Add new location
 *   POST /atos/:slug/claim           → Claim ATO profile
 *   PUT  /atos/:slug                 → Update ATO profile
 *   POST /atos/:slug/programs        → Add ATO program
 *   PUT  /programs/:id               → Update ATO program
 *   POST /atos/:slug/ratings         → Add rating offered
 *   PUT  /ratings/:id                → Update rating offered
 *   POST /atos/:slug/fleet           → Add fleet aircraft
 *   PUT  /fleet/:id                  → Update fleet aircraft
 *   POST /atos/:slug/instructors     → Add instructor
 *   PUT  /instructors/:id            → Update instructor
 *   POST /trcs/:slug/claim           → Claim TRC profile
 *   PUT  /trcs/:slug                 → Update TRC profile
 *   POST /trcs/:slug/ratings         → Add type rating course
 *   PUT  /trc-ratings/:id            → Update type rating course
 *   POST /trcs/:slug/simulators      → Add simulator
 *   PUT  /trc-simulators/:id         → Update simulator
 *   POST /trcs/:slug/instructors     → Add TRC instructor
 *   PUT  /trc-instructors/:id        → Update TRC instructor
 *   POST /airlines/:slug/claim       → Claim airline profile
 *   PUT  /airlines/:slug             → Update airline profile
 *   POST /airlines/:slug/cadet-programs → Add cadet program
 *   PUT  /cadet-programs/:id         → Update cadet program
 *   POST /airlines/:slug/fleet       → Add fleet entry
 *   PUT  /airline-fleet/:id          → Update fleet entry
 *   POST /airlines/:slug/pathways    → Add airline pathway
 *   PUT  /airline-pathways/:id       → Update airline pathway
 *   GET  /airlines/:slug/candidate-pool  → View candidate pool with filtering
 *   PUT  /pool-entry/:id               → Update pool entry status (shortlist/contact/reject/hire)
 *   POST /private-jet-charters/:slug/claim → Claim PJC profile
 *   PUT  /private-jet-charters/:slug       → Update PJC profile
 *
 * Auth: Bearer token from Auth0 (validated via JWKS)
 * Rate limit: 120 req/min per IP (higher than platform — mostly reads)
 */

// ── D1 Types ───────────────────────────────────────────────────

declare interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

declare interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean }>;
  run(): Promise<{ success: boolean }>;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

interface ExportedHandler<Env = unknown> {
  fetch?: (request: Request, env: Env, ctx: ExecutionContext) => Response | Promise<Response>;
}

// ── Types ────────────────────────────────────────────────────────

interface Env {
  DB: D1Database;                    // pilotrecognition-reference-data
  DB_PROFILES: D1Database;           // pilotrecognition-profiles
  DB_OPS: D1Database;               // pilotrecognition-d1 (airlines, ATOs, TRCs, pathways)
  DB_TRACE: D1Database;             // recognition-plus-trace (audit, compliance)
  DB_DOCS: D1Database;              // apc-document-metadata (stories, evidence)
  AUTH0_DOMAIN: string;
  AUTH0_AUDIENCE: string;
}

interface JWTPayload {
  sub: string;
  email?: string;
  name?: string;
  exp: number;
  iat: number;
}

// ── JWKS Cache ─────────────────────────────────────────────────

interface CachedJWKS {
  keys: JsonWebKey[];
  fetchedAt: number;
}

let jwksCache: CachedJWKS | null = null;
const JWKS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getAuth0JWKS(domain: string): Promise<JsonWebKey[]> {
  if (jwksCache && Date.now() - jwksCache.fetchedAt < JWKS_CACHE_TTL_MS) {
    return jwksCache.keys;
  }
  const res = await fetch(`https://${domain}/.well-known/jwks.json`, { cf: { cacheTtl: 300 } });
  if (!res.ok) throw new Error('Failed to fetch JWKS');
  const data = (await res.json()) as { keys: JsonWebKey[] };
  jwksCache = { keys: data.keys, fetchedAt: Date.now() };
  return data.keys;
}

async function verifyAuth0Token(request: Request, env: Env): Promise<JWTPayload> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Missing Bearer token');

  const token = authHeader.slice(7);
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');

  const payload = JSON.parse(atob(parts[1])) as JWTPayload;
  if (payload.exp && payload.exp * 1000 < Date.now()) throw new Error('Token expired');

  const keys = await getAuth0JWKS(env.AUTH0_DOMAIN);
  const header = JSON.parse(atob(parts[0])) as { kid?: string };
  const key = keys.find((k) => k.kid === header.kid);
  if (!key) throw new Error('Signing key not found');

  const cryptoKey = await crypto.subtle.importKey(
    'jwk', key, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
  );

  const encoder = new TextEncoder();
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5', cryptoKey,
    encoder.encode(parts[2]),
    encoder.encode(`${parts[0]}.${parts[1]}`)
  );

  if (!valid) throw new Error('Invalid signature');
  return payload;
}

// ── CORS ───────────────────────────────────────────────────────

function corsHeaders(origin?: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
  };
}

function jsonResponse(data: unknown, status = 200, origin?: string): Response {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders(origin) });
}

// ── Rate Limiting ──────────────────────────────────────────────

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 120;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ── Helpers ────────────────────────────────────────────────────

async function getManufacturer(db: D1Database, id: string) {
  return db.prepare('SELECT * FROM manufacturers WHERE id = ?').bind(id).first() as Promise<Record<string, unknown> | null>;
}

async function getAircraft(db: D1Database, id: string) {
  return db.prepare('SELECT * FROM aircraft_type_ratings WHERE id = ?').bind(id).first() as Promise<Record<string, unknown> | null>;
}

async function getAto(db: D1Database, slug: string) {
  return db.prepare('SELECT * FROM atos WHERE slug = ?').bind(slug).first() as Promise<Record<string, unknown> | null>;
}

async function getTrc(db: D1Database, slug: string) {
  return db.prepare('SELECT * FROM type_rating_centers WHERE slug = ?').bind(slug).first() as Promise<Record<string, unknown> | null>;
}

async function getAirline(db: D1Database, slug: string) {
  return db.prepare('SELECT * FROM airlines WHERE slug = ?').bind(slug).first() as Promise<Record<string, unknown> | null>;
}

// ── Instrument Panel Helpers ──────────────────────────────────
// Data completeness is a pilot-facing instrument reading, not an airline badge.
// It tells the pilot: "How much can I trust this match reading?"
// Like a pitot-static system: the sensors (airline data) feed into the instrument (match confidence).
function computePathwayDataCompleteness(pathway: Record<string, unknown>): number {
  const requiredFields = [
    'min_total_hours', 'min_pic_hours', 'required_english_level',
    'required_medical_class', 'min_age', 'education_requirement',
    'estimated_timeline_months', 'competitiveness_score',
    'target_pilot_persona', 'message_to_low_time_pilots',
  ];
  const niceToHaveFields = [
    'min_pic_on_jet_hours', 'min_multi_engine_hours', 'min_night_hours',
    'min_instrument_hours', 'min_cross_country_hours', 'required_ratings',
    'required_type_ratings', 'career_progression_overview', 'support_programs',
    'assessment_stages', 'salary_first_year_usd', 'estimated_cost_to_pilot_usd',
    'values_ebt_cbta_programs', 'values_mentorship_program', 'ebt_cbta_description', 'mentorship_description',
    'message_to_stuck_instructors', 'stuck_instructor_definition', 'stuck_instructor_support',
    'type_rating_policy', 'training_pathway_for_non_type_rated', 'values_instructor_experience',
    'instructor_transition_program', 'pipeline_priority_for_stuck_pilots', 'stuck_pilot_support_description',
    'operations_focus', 'starter_aircraft_policy', 'regional_pathway_description',
    'industry_alignment_statement', 'low_hour_regional_message',
  ];
  let score = 0;
  for (const f of requiredFields) {
    if (pathway[f] !== null && pathway[f] !== undefined && pathway[f] !== '') score += 6;
  }
  for (const f of niceToHaveFields) {
    if (pathway[f] !== null && pathway[f] !== undefined && pathway[f] !== '') score += 2;
  }
  return Math.min(100, score);
}

// ── Pilot Profile Auto-Generation (Pilot-Centric Presentation) ─────────────
// The platform tells the pilot's story from their profile data.
// Airlines see auto-generated pilot cards, not custom airline essays.

interface PilotProfile {
  total_hours?: number;
  pic_hours?: number;
  pic_on_jet_hours?: number;
  multi_engine_hours?: number;
  instrument_hours?: number;
  ratings?: string[];
  years_applying?: number;
  years_experience?: number;
  current_role?: string;
  is_verified?: boolean;
  is_background_checked?: boolean;
  has_degree?: boolean;
  english_level?: string;
  medical_class?: string;
  age?: number;
  type_ratings_held?: string[];
  last_operator?: string;
  total_landings?: number;
  jet_hours?: number;
}

type PilotPersona = 'low_time_graduate' | 'flight_instructor_building' | 'stuck_instructor' | 'stuck_type_rated' | 'transition_ready' | 'experienced_captain' | 'career_changer' | 'regional_turboprop_pilot';

function detectPilotPersona(p: PilotProfile): { persona: PilotPersona; confidence: number; flags: string[] } {
  const hours = p.total_hours || 0;
  const yearsApplying = p.years_applying || 0;
  const yearsExp = p.years_experience || 0;
  const hasTypeRating = (p.type_ratings_held || []).length > 0;
  const isInstructor = (p.current_role || '').toLowerCase().includes('instructor');
  const isVerified = p.is_verified === true;
  const flags: string[] = [];

  // Stuck instructor: high hours, instructor role, applying for years
  if (hours >= 3000 && isInstructor && yearsApplying >= 3) {
    if (hasTypeRating) {
      flags.push('type_rated_but_unplaced');
      return { persona: 'stuck_type_rated', confidence: 0.95, flags };
    }
    flags.push('no_type_rating');
    return { persona: 'stuck_instructor', confidence: 0.92, flags };
  }

  // Stuck type-rated pilot (not necessarily instructor)
  if (hours >= 3000 && yearsApplying >= 3 && hasTypeRating) {
    flags.push('long_term_applicant');
    return { persona: 'stuck_type_rated', confidence: 0.88, flags };
  }

  // Low-time graduate
  if (hours < 500) {
    flags.push('building_hours');
    return { persona: 'low_time_graduate', confidence: 0.95, flags };
  }

  // Flight instructor building hours (not stuck yet)
  if (isInstructor && hours >= 500 && hours < 3000) {
    flags.push('hour_building_phase');
    return { persona: 'flight_instructor_building', confidence: 0.85, flags };
  }

  // Regional turboprop pilot (ATR, Dash 8, Twin Otter experience)
  const turbopropTypes = ['ATR', 'DHC-8', 'DHC-6', 'DHC', 'Q400', 'TWIN OTTER'];
  const hasTurboprop = (p.type_ratings_held || []).some((tr: string) =>
    turbopropTypes.some(tp => tr.toUpperCase().includes(tp))
  );
  if (hasTurboprop && hours < 1500) {
    flags.push('regional_experience_low_total_hours');
    return { persona: 'regional_turboprop_pilot', confidence: 0.82, flags };
  }

  // Transition ready
  if (hours >= 3000 && hours < 8000 && yearsApplying < 2) {
    flags.push('active_seeker');
    return { persona: 'transition_ready', confidence: 0.78, flags };
  }

  // Experienced captain
  if (hours >= 8000 || yearsExp >= 10) {
    flags.push('high_experience');
    return { persona: 'experienced_captain', confidence: 0.85, flags };
  }

  // Career changer (has degree, non-aviation background)
  if (p.has_degree && hours < 1000) {
    flags.push('career_transition');
    return { persona: 'career_changer', confidence: 0.65, flags };
  }

  // Default
  return { persona: 'transition_ready', confidence: 0.5, flags: ['profile_incomplete'] };
}

function generatePilotProfileSummary(p: PilotProfile, persona: PilotPersona): string {
  const hours = p.total_hours || 0;
  const pic = p.pic_hours || 0;
  const typeRatings = p.type_ratings_held || [];
  const yearsApplying = p.years_applying || 0;
  const currentRole = p.current_role || 'pilot';
  const isVerified = p.is_verified === true;
  const isBgChecked = p.is_background_checked === true;

  const verificationBadge = isVerified && isBgChecked ? 'Verified & Background-Checked' : isVerified ? 'Verified' : 'Unverified';

  switch (persona) {
    case 'stuck_instructor':
      return `${hours.toLocaleString()}h flight instructor. ${pic.toLocaleString()}h PIC. ${verificationBadge}. Applying ${yearsApplying}+ years without placement — the industry failed to recognize their experience. Missing type rating but has the hours, the discipline, and the teaching record. Ready for assessment.`;

    case 'stuck_type_rated':
      return `${hours.toLocaleString()}h with ${typeRatings.join(', ')} rating${typeRatings.length > 1 ? 's' : ''}. ${verificationBadge}. ${yearsApplying}+ years applying — type-rated but unplaced. The industry took their $50K for the rating and left them hanging. Assessment-ready.`;

    case 'low_time_graduate':
      return `${hours}h fresh graduate. ${verificationBadge}. Building hours toward first role. Needs pathway clarity — where do 200h pilots actually get placed?`;

    case 'flight_instructor_building':
      return `${hours.toLocaleString()}h flight instructor. ${pic.toLocaleString()}h PIC. ${verificationBadge}. Building hours. Teaching others to fly while waiting for their own pathway.`;

    case 'regional_turboprop_pilot':
      return `${hours.toLocaleString()}h with ${typeRatings.join(', ')} experience. ${verificationBadge}. Regional turboprop operator. Self-funded type rating. Industry needs to recognize regional experience as valid pathway entry.`;

    case 'transition_ready':
      return `${hours.toLocaleString()}h active job seeker. ${typeRatings.length > 0 ? typeRatings.join(', ') + ' rated. ' : ''}${verificationBadge}. Ready for pathway match.`;

    case 'experienced_captain':
      return `${hours.toLocaleString()}h experienced captain. ${typeRatings.length > 0 ? typeRatings.join(', ') + ' rated. ' : ''}${verificationBadge}. Seeking change. Capabilities travel, not seniority.`;

    case 'career_changer':
      return `${hours}h pilot with prior professional background. ${verificationBadge}. Career transition in progress.`;

    default:
      return `${hours.toLocaleString()}h pilot. ${verificationBadge}.`;
  }
}

function generatePilotBlockerAnalysis(p: PilotProfile, persona: PilotPersona): { primary_blocker: string | null; secondary_blockers: string[]; years_stuck: number; self_funded_investment_usd: number | null } {
  const hours = p.total_hours || 0;
  const yearsApplying = p.years_applying || 0;
  const typeRatings = p.type_ratings_held || [];
  const blockers: string[] = [];
  let selfFunded = null;

  if (persona === 'stuck_instructor') {
    blockers.push('Missing type rating — industry requires $50K+ investment with no placement guarantee');
    blockers.push('Instructor role not recognized as airline-relevant experience');
    blockers.push('No pathway from CFI/FI to airline FO without type rating sponsorship');
    selfFunded = 50000;
  } else if (persona === 'stuck_type_rated') {
    blockers.push('Type rated but no operator connection — airlines hire internally or from cadet pipelines');
    blockers.push('Application history ignored — rejected by algorithms before human review');
    selfFunded = 50000;
  } else if (persona === 'low_time_graduate') {
    blockers.push('200h CPL not competitive for direct airline entry');
    blockers.push('Instructor pipeline backed up 2-3 years');
    blockers.push('$50K training investment with no clear ROI timeline');
    selfFunded = 50000;
  } else if (persona === 'regional_turboprop_pilot') {
    blockers.push('Regional turboprop hours undervalued against jet-only requirements');
    blockers.push('Self-funded type rating not recognized by legacy carriers');
    blockers.push('ATR/Dash 8 experience treated as "non-airline" by HR filters');
    selfFunded = 30000;
  } else if (persona === 'flight_instructor_building') {
    blockers.push('Instructor hours building slowly — 50-100h/year typical');
    blockers.push('No visibility into which airlines value instructor experience');
  }

  const primary = blockers.length > 0 ? blockers[0] : null;
  const secondary = blockers.slice(1);

  return {
    primary_blocker: primary,
    secondary_blockers: secondary,
    years_stuck: yearsApplying,
    self_funded_investment_usd: selfFunded,
  };
}

// ── Pilot Profile Presentation Helpers ────────────────────────
// Builds the teaser (public) and full (airline-only) profile views.

function buildPilotProfileTeaser(raw: Record<string, unknown>): Record<string, unknown> {
  const verificationStatus = raw.verification_status as string || 'unverified';
  const isVerified = (raw.is_verified as number || 0) === 1;
  const isBgChecked = (raw.is_background_checked as number || 0) === 1;
  const isClaimed = (raw.is_claimed as number || 0) === 1;
  const hours = (raw.total_hours as number) || 0;
  const typeRatingsStr = (raw.type_ratings as string) || '';
  const typeRatings = typeRatingsStr.split(',').map((r: string) => r.trim()).filter(Boolean);

  // Auto-detect persona from stored profile data
  const pilotProfile: PilotProfile = {
    total_hours: hours,
    pic_hours: (raw.pic_hours as number) || 0,
    type_ratings_held: typeRatings,
    years_applying: (raw.years_experience as number) || 0,
    years_experience: (raw.years_experience as number) || 0,
    current_role: (raw.current_role as string) || '',
    is_verified: isVerified,
    is_background_checked: isBgChecked,
  };
  const personaResult = detectPilotPersona(pilotProfile);
  const blockerAnalysis = generatePilotBlockerAnalysis(pilotProfile, personaResult.persona);

  // Immaculate teaser — only the best, no clutter
  return {
    id: raw.id,
    public_slug: raw.public_slug,
    display_name: raw.display_name,
    teaser_headline: raw.teaser_headline,
    teaser_summary: raw.teaser_summary,
    avatar_url: raw.avatar_url,
    country: raw.country,
    base_location: raw.base_location,
    // Key stats (the numbers that matter)
    total_hours: hours,
    pic_hours: raw.pic_hours,
    type_ratings: typeRatings,
    current_role: raw.current_role,
    last_operator: raw.last_operator,
    years_experience: raw.years_experience,
    // Trust & verification (notification bell triggers)
    verification_status: verificationStatus,
    is_verified: isVerified,
    is_background_checked: isBgChecked,
    is_claimed: isClaimed,
    claimed_by: raw.claimed_by,
    // Value & risk (airline decision support)
    insurance_risk_score: raw.insurance_risk_score,
    profile_value_tier: raw.profile_value_tier,
    // Diversity & recommendation (pool curation)
    diversity_tags: (() => {
      try { return JSON.parse((raw.diversity_tags as string) || '[]'); } catch { return []; }
    })(),
    is_recommended: (raw.is_recommended as number || 0) === 1,
    recommendation_reason: raw.recommendation_reason,
    // Bio stories — teaser gets full bio content, not truncated
    bio_story_teaser: raw.bio_story_teaser,
    bio_story_full: raw.bio_story_full,
    career_narrative: raw.career_narrative,
    training_background: raw.training_background,
    instructor_background: raw.instructor_background,
    operational_experience: raw.operational_experience,
    achievements: raw.achievements,
    goals: raw.goals,
    // Full ratings & credentials — displayed on teaser, not hidden
    full_ratings: (() => { try { return JSON.parse((raw.full_ratings as string) || '[]'); } catch { return []; } })(),
    full_type_ratings: (() => { try { return JSON.parse((raw.full_type_ratings as string) || '[]'); } catch { return []; } })(),
    medical_expiry: raw.medical_expiry,
    english_level: raw.english_level,
    // EBT video interview — displayed and watchable on teaser profile
    ebt_video_url: raw.ebt_video_url,
    // pilotshortage.org — testify your pilot journey. in exchange for recognition.
    // Free to join. Anyone can write their story. But the claim is worthless until verified.
    // The pilot tells the industry what happened to them. The industry verifies it.
    // In exchange, the pilot gets visibility, credibility, and a shot at coming back.
    // Stages: license_verified → logbook_verified → interview_conducted → approved
    pilot_shortage_testimonial: {
      is_member: (raw.is_pilot_shortage_member as number || 0) === 1,
      status: raw.pilot_shortage_status || 'draft', // draft, submitted, under_review, verified, approved, rejected
      testimonial_text: raw.pilot_shortage_testimonial,
      // Verification is the only thing that makes a claim credible
      is_verified: (raw.pilot_shortage_verified as number || 0) === 1,
      verification_stages: (() => {
        try {
          return JSON.parse((raw.pilot_shortage_verification_stages as string) || '[]');
        } catch { return []; }
      })(),
      verified_by: raw.pilot_shortage_verified_by,
      verified_at: raw.pilot_shortage_verified_at,
      verification_notes: raw.pilot_shortage_verification_notes,
      submitted_at: raw.pilot_shortage_submitted_at,
      // The pilot's story — why they left, what they need to come back
      career_shift_reason: raw.career_shift_reason,
      career_shift_to: raw.career_shift_to,
      investment_willing_usd: raw.pilot_shortage_investment_usd,
      support_request: raw.pilot_shortage_support_request,
      // The value exchange
      value_proposition: 'Testify your pilot journey. In exchange for recognition.',
      // Anonymity control — verified but name hidden, license never shown
      is_anonymous: (raw.pilot_shortage_anonymous as number || 0) === 1,
      display_name: (raw.pilot_shortage_anonymous as number || 0) === 1
        ? ((raw.display_name as string || '').split(' ')[0] || 'Anonymous Pilot')
        : raw.display_name,
    },
    // Auto-generated persona data
    persona: personaResult.persona,
    persona_confidence: personaResult.confidence,
    persona_flags: personaResult.flags,
    blocker_analysis: blockerAnalysis,
    profile_completeness_score: raw.profile_completeness_score,
    // Explicitly NOT included in teaser: email, phone, linkedin, portfolio, license_number
  };
}

function buildPilotProfileFull(raw: Record<string, unknown>): Record<string, unknown> {
  const teaser = buildPilotProfileTeaser(raw);
  return {
    ...teaser,
    // Contact / reachability — only in full profile
    email: raw.email,
    phone: raw.phone,
    linkedin_url: raw.linkedin_url,
    portfolio_url: raw.portfolio_url,
    license_number: raw.license_number,
    // System
    last_synced_at: raw.last_synced_at,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

// ── Enterprise Auth Helpers ───────────────────────────────────

async function getPjc(db: D1Database, slug: string) {
  return db.prepare('SELECT * FROM private_jet_charters WHERE slug = ?').bind(slug).first() as Promise<Record<string, unknown> | null>;
}

// ── Pilot Auth (Auth0) ──────────────────────────────────────

async function requirePilotAuth(request: Request, env: Env, db: D1Database): Promise<JWTPayload> {
  const auth = await verifyAuth0Token(request, env);
  if (!auth.sub) throw new Error('Invalid token: missing sub');

  // Verify this sub has a pilot profile linked
  const profile = await db.prepare('SELECT id FROM pilot_profiles WHERE auth0_id = ?').bind(auth.sub).first() as Record<string, unknown> | null;
  if (!profile) throw new Error('No pilot profile found for this Auth0 account');

  return auth;
}

async function requireEnterpriseAuth(request: Request, env: Env, db: D1Database): Promise<JWTPayload> {
  const auth = await verifyAuth0Token(request, env);

  // Check if user has an enterprise profile linked to a manufacturer, ATO, TRC, airline, or PJC
  const enterprise = await db.prepare(
    'SELECT id, manufacturer_id, ato_id, trc_id, airline_id, pjc_id FROM enterprise_profiles WHERE auth0_id = ? AND status = ?'
  ).bind(auth.sub, 'active').first() as Record<string, unknown> | null;

  if (!enterprise) {
    throw new Error('Forbidden: Enterprise access required. Claim a manufacturer, ATO, TRC, airline, or private jet charter profile first.');
  }

  return auth;
}

// ── Route Handlers ─────────────────────────────────────────────

async function handlePublicRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || undefined;
  const path = url.pathname;
  const db = env.DB_OPS;      // Default: operational DB (atos, trcs, airlines, pathways, pjc)
  const dbOps = env.DB_OPS;     // Explicit alias for operational helper call sites
  const dbRef = env.DB;         // Reference data (manufacturers, aircraft, training, simulators)
  const dbProfiles = env.DB_PROFILES;
  const dbTrace = env.DB_TRACE;
  const dbDocs = env.DB_DOCS;

  // GET /manufacturers
  if (path === '/manufacturers') {
    const { results } = await dbRef.prepare('SELECT * FROM manufacturers ORDER BY name').all();
    return jsonResponse(results || [], 200, origin);
  }

  // GET /manufacturers/:id
  if (path.match(/^\/manufacturers\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const mfr = await getManufacturer(db, id);
    if (!mfr) return jsonResponse({ error: 'Not found' }, 404, origin);
    return jsonResponse(mfr, 200, origin);
  }

  // GET /aircraft
  if (path === '/aircraft') {
    const manufacturerId = url.searchParams.get('manufacturer_id');
    const category = url.searchParams.get('category');
    const subcategory = url.searchParams.get('subcategory');

    let sql = 'SELECT * FROM aircraft_type_ratings WHERE 1=1';
    const binds: unknown[] = [];

    if (manufacturerId) { sql += ' AND manufacturer_id = ?'; binds.push(manufacturerId); }
    if (category) { sql += ' AND category = ?'; binds.push(category); }
    if (subcategory) { sql += ' AND subcategory = ?'; binds.push(subcategory); }

    sql += ' ORDER BY model';
    const { results } = await dbRef.prepare(sql).bind(...binds).all();
    return jsonResponse(results || [], 200, origin);
  }

  // GET /aircraft/:id
  if (path.match(/^\/aircraft\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const aircraft = await getAircraft(dbRef, id);
    if (!aircraft) return jsonResponse({ error: 'Not found' }, 404, origin);

    // Include manufacturer details
    const mfr = await getManufacturer(dbRef, aircraft.manufacturer_id as string);
    return jsonResponse({ aircraft, manufacturer: mfr }, 200, origin);
  }

  // GET /aircraft/:id/training-requirements
  if (path.match(/^\/aircraft\/[^\/]+\/training-requirements$/)) {
    const aircraftId = path.split('/')[2];
    const { results } = await dbRef.prepare(
      'SELECT * FROM training_requirements WHERE aircraft_id = ? ORDER BY requirement_type'
    ).bind(aircraftId).all();
    return jsonResponse(results || [], 200, origin);
  }

  // GET /aircraft/:id/simulator-locations
  if (path.match(/^\/aircraft\/[^\/]+\/simulator-locations$/)) {
    const aircraftId = path.split('/')[2];
    const { results } = await dbRef.prepare(
      'SELECT * FROM simulator_locations WHERE aircraft_id = ? ORDER BY city'
    ).bind(aircraftId).all();
    return jsonResponse(results || [], 200, origin);
  }

  // ── ATOs (Public Read) ────────────────────────────────────

  // GET /atos
  if (path === '/atos') {
    const country = url.searchParams.get('country');
    const city = url.searchParams.get('city');
    const fastTrack = url.searchParams.get('fast_track');

    let sql = 'SELECT * FROM atos WHERE is_active = 1';
    const binds: unknown[] = [];

    if (country) { sql += ' AND country = ?'; binds.push(country); }
    if (city) { sql += ' AND city = ?'; binds.push(city); }
    if (fastTrack === '1') {
      sql += ' AND id IN (SELECT DISTINCT ato_id FROM ato_programs WHERE fast_track = 1 AND is_active = 1)';
    }

    sql += ' ORDER BY average_rating DESC, name';
    const { results } = await db.prepare(sql).bind(...binds).all();
    return jsonResponse(results || [], 200, origin);
  }

  // GET /atos/:slug
  if (path.match(/^\/atos\/[^\/]+$/)) {
    const slug = path.split('/')[2];
    const ato = await getAto(dbOps, slug);
    if (!ato) return jsonResponse({ error: 'Not found' }, 404, origin);

    const hasOutputData = ato.pilots_trained_total && (ato.pilots_trained_total as number) > 0;
    const hasYearlyData = ato.pilots_trained_yearly && (ato.pilots_trained_yearly as number) > 0;
    const hasPlacementData = ato.job_placement_rate && (ato.job_placement_rate as number) > 0;

    if (!hasOutputData && !hasYearlyData && !hasPlacementData) {
      return jsonResponse({
        ...ato,
        output_data_status: 'not_yet_available',
        message: `${ato.name} has not yet shared their graduate output data, including total pilots trained, yearly production numbers, graduation rates, or job placement statistics. If you represent ${ato.name}, claim this profile to showcase your training output, graduate success rates, and airline placement numbers to prospective students worldwide.`,
        claim_url: `/atos/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }

    return jsonResponse(ato, 200, origin);
  }

  // GET /atos/:slug/programs
  if (path.match(/^\/atos\/[^\/]+\/programs$/)) {
    const slug = path.split('/')[2];
    const ato = await getAto(dbOps, slug);
    if (!ato) return jsonResponse({ error: 'Not found' }, 404, origin);
    const { results } = await db.prepare(
      'SELECT * FROM ato_programs WHERE ato_id = ? AND is_active = 1 ORDER BY name'
    ).bind(ato.id).all();
    const items = results || [];
    if (items.length === 0) {
      return jsonResponse({
        message: `${ato.name} has not yet shared their program details. This flight school has not claimed their profile or added their training programs. If you represent ${ato.name}, claim this profile to showcase your programs, pricing, and availability to pilots worldwide.`,
        ato: { name: ato.name, slug: ato.slug, country: ato.country, city: ato.city },
        programs: [],
        claim_url: `/atos/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }
    return jsonResponse(items, 200, origin);
  }

  // GET /atos/:slug/ratings
  if (path.match(/^\/atos\/[^\/]+\/ratings$/)) {
    const slug = path.split('/')[2];
    const ato = await getAto(dbOps, slug);
    if (!ato) return jsonResponse({ error: 'Not found' }, 404, origin);
    const { results } = await db.prepare(
      'SELECT * FROM ato_ratings_offered WHERE ato_id = ? AND is_active = 1 ORDER BY rating_type'
    ).bind(ato.id).all();
    const items = results || [];
    if (items.length === 0) {
      return jsonResponse({
        message: `${ato.name} has not yet listed their available ratings. If you represent ${ato.name}, claim this profile to add PPL, CPL, Instrument Rating, Multi-Engine, Night Rating, and Type Rating offerings.`,
        ato: { name: ato.name, slug: ato.slug, country: ato.country, city: ato.city },
        ratings: [],
        claim_url: `/atos/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }
    return jsonResponse(items, 200, origin);
  }

  // GET /atos/:slug/fleet
  if (path.match(/^\/atos\/[^\/]+\/fleet$/)) {
    const slug = path.split('/')[2];
    const ato = await getAto(dbOps, slug);
    if (!ato) return jsonResponse({ error: 'Not found' }, 404, origin);
    const { results } = await db.prepare(
      'SELECT * FROM ato_fleet WHERE ato_id = ? AND is_active = 1 ORDER BY model'
    ).bind(ato.id).all();
    const items = results || [];
    if (items.length === 0) {
      return jsonResponse({
        message: `${ato.name} has not yet shared their aircraft fleet or simulator details. If you represent ${ato.name}, claim this profile to list your training aircraft, simulators, and hourly rates.`,
        ato: { name: ato.name, slug: ato.slug, country: ato.country, city: ato.city },
        fleet: [],
        claim_url: `/atos/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }
    return jsonResponse(items, 200, origin);
  }

  // ── Type Rating Centers (Public Read) ──────────────────────

  // GET /trcs
  if (path === '/trcs') {
    const country = url.searchParams.get('country');
    const aircraftModel = url.searchParams.get('aircraft');

    let sql = 'SELECT * FROM type_rating_centers WHERE is_active = 1';
    const binds: unknown[] = [];

    if (country) { sql += ' AND country = ?'; binds.push(country); }
    if (aircraftModel) {
      sql += ' AND id IN (SELECT DISTINCT trc_id FROM trc_type_ratings_offered WHERE aircraft_model LIKE ? AND is_active = 1)';
      binds.push(`%${aircraftModel}%`);
    }

    sql += ' ORDER BY average_rating DESC, name';
    const { results } = await db.prepare(sql).bind(...binds).all();
    return jsonResponse(results || [], 200, origin);
  }

  // GET /trcs/:slug
  if (path.match(/^\/trcs\/[^\/]+$/)) {
    const slug = path.split('/')[2];
    const trc = await getTrc(dbOps, slug);
    if (!trc) return jsonResponse({ error: 'Not found' }, 404, origin);

    const hasOutputData = trc.total_type_ratings_issued && (trc.total_type_ratings_issued as number) > 0;
    const hasYearlyData = trc.yearly_output && (trc.yearly_output as number) > 0;

    if (!hasOutputData && !hasYearlyData) {
      return jsonResponse({
        ...trc,
        output_data_status: 'not_yet_available',
        message: `${trc.name} has not yet shared their training output data, including total type ratings issued, yearly output, or simulator availability. If you represent ${trc.name}, claim this profile to showcase your type rating courses, simulator fleet, and instructor team to pilots worldwide.`,
        claim_url: `/trcs/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }

    return jsonResponse(trc, 200, origin);
  }

  // GET /trcs/:slug/ratings
  if (path.match(/^\/trcs\/[^\/]+\/ratings$/)) {
    const slug = path.split('/')[2];
    const trc = await getTrc(dbOps, slug);
    if (!trc) return jsonResponse({ error: 'Not found' }, 404, origin);
    const { results } = await db.prepare(
      'SELECT * FROM trc_type_ratings_offered WHERE trc_id = ? AND is_active = 1 ORDER BY aircraft_model'
    ).bind(trc.id).all();
    const items = results || [];
    if (items.length === 0) {
      return jsonResponse({
        message: `${trc.name} has not yet shared their type rating course details. If you represent ${trc.name}, claim this profile to list your A320, B737, A350, and other type rating courses with pricing and availability.`,
        trc: { name: trc.name, slug: trc.slug, country: trc.country, city: trc.city },
        ratings: [],
        claim_url: `/trcs/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }
    return jsonResponse(items, 200, origin);
  }

  // GET /trcs/:slug/simulators
  if (path.match(/^\/trcs\/[^\/]+\/simulators$/)) {
    const slug = path.split('/')[2];
    const trc = await getTrc(dbOps, slug);
    if (!trc) return jsonResponse({ error: 'Not found' }, 404, origin);
    const { results } = await db.prepare(
      'SELECT * FROM trc_simulators WHERE trc_id = ? AND is_active = 1 ORDER BY aircraft_model'
    ).bind(trc.id).all();
    const items = results || [];
    if (items.length === 0) {
      return jsonResponse({
        message: `${trc.name} has not yet shared their simulator fleet details. If you represent ${trc.name}, claim this profile to list your Full Flight Simulators, FTDs, and hourly rates.`,
        trc: { name: trc.name, slug: trc.slug, country: trc.country, city: trc.city },
        simulators: [],
        claim_url: `/trcs/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }
    return jsonResponse(items, 200, origin);
  }

  // GET /trcs/:slug/instructors
  if (path.match(/^\/trcs\/[^\/]+\/instructors$/)) {
    const slug = path.split('/')[2];
    const trc = await getTrc(dbOps, slug);
    if (!trc) return jsonResponse({ error: 'Not found' }, 404, origin);
    const { results } = await db.prepare(
      'SELECT * FROM trc_instructors WHERE trc_id = ? AND is_active = 1 ORDER BY name'
    ).bind(trc.id).all();
    const items = results || [];
    if (items.length === 0) {
      return jsonResponse({
        message: `${trc.name} has not yet shared their instructor team. If you represent ${trc.name}, claim this profile to showcase your type rating instructors, check airmen, and examiners.`,
        trc: { name: trc.name, slug: trc.slug, country: trc.country, city: trc.city },
        instructors: [],
        claim_url: `/trcs/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }
    return jsonResponse(items, 200, origin);
  }

  // GET /atos/:slug/instructors
  if (path.match(/^\/atos\/[^\/]+\/instructors$/)) {
    const slug = path.split('/')[2];
    const ato = await getAto(dbOps, slug);
    if (!ato) return jsonResponse({ error: 'Not found' }, 404, origin);
    const { results } = await db.prepare(
      'SELECT * FROM ato_instructors WHERE ato_id = ? AND is_active = 1 ORDER BY name'
    ).bind(ato.id).all();
    const items = results || [];
    if (items.length === 0) {
      return jsonResponse({
        message: `${ato.name} has not yet shared their instructor team. If you represent ${ato.name}, claim this profile to showcase your senior instructors, check airmen, and examiners.`,
        ato: { name: ato.name, slug: ato.slug, country: ato.country, city: ato.city },
        instructors: [],
        claim_url: `/atos/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }
    return jsonResponse(items, 200, origin);
  }

  // ── Airlines (Public Read) ───────────────────────────────────

  // GET /airlines
  if (path === '/airlines') {
    const country = url.searchParams.get('country');
    const isHiring = url.searchParams.get('is_hiring');
    const airlineType = url.searchParams.get('type');

    let sql = 'SELECT * FROM airlines WHERE is_active = 1';
    const binds: unknown[] = [];

    if (country) { sql += ' AND country = ?'; binds.push(country); }
    if (isHiring) { sql += ' AND is_hiring = 1'; }
    if (airlineType) {
      switch (airlineType) {
        case 'low_cost': sql += ' AND is_low_cost_carrier = 1'; break;
        case 'legacy': sql += ' AND is_legacy_carrier = 1'; break;
        case 'cargo': sql += ' AND is_cargo = 1'; break;
        case 'regional': sql += ' AND is_regional = 1'; break;
        case 'charter': sql += ' AND is_charter = 1'; break;
      }
    }

    sql += ' ORDER BY yearly_hires DESC, name';
    const { results } = await db.prepare(sql).bind(...binds).all();
    return jsonResponse(results || [], 200, origin);
  }

  // GET /airlines/:slug
  if (path.match(/^\/airlines\/[^\/]+$/)) {
    const slug = path.split('/')[2];
    const airline = await getAirline(dbOps, slug);
    if (!airline) return jsonResponse({ error: 'Not found' }, 404, origin);

    const hasOutputData = airline.yearly_hires && (airline.yearly_hires as number) > 0;
    const hasPilotCount = airline.pilot_count && (airline.pilot_count as number) > 0;

    if (!hasOutputData && !hasPilotCount) {
      return jsonResponse({
        ...airline,
        output_data_status: 'not_yet_available',
        message: `${airline.name} has not yet shared their hiring data, fleet details, or pathway information. If you represent ${airline.name}, claim this profile to showcase your cadet programs, hiring pathways, expectations, and future fleet so pilots can prepare and compare their profiles.`,
        claim_url: `/airlines/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }

    return jsonResponse(airline, 200, origin);
  }

  // GET /airlines/:slug/cadet-programs
  if (path.match(/^\/airlines\/[^\/]+\/cadet-programs$/)) {
    const slug = path.split('/')[2];
    const airline = await getAirline(dbOps, slug);
    if (!airline) return jsonResponse({ error: 'Not found' }, 404, origin);
    const { results } = await db.prepare(
      'SELECT * FROM airline_cadet_programs WHERE airline_id = ? AND is_active = 1 ORDER BY program_name'
    ).bind(airline.id).all();
    const items = results || [];
    if (items.length === 0) {
      return jsonResponse({
        message: `${airline.name} has not yet listed their cadet programs. If you represent ${airline.name}, claim this profile to add your cadet program details, partner ATOs, costs, and intake schedules.`,
        airline: { name: airline.name, slug: airline.slug, country: airline.country, iata_code: airline.iata_code },
        cadet_programs: [],
        claim_url: `/airlines/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }
    return jsonResponse(items, 200, origin);
  }

  // GET /airlines/:slug/fleet
  if (path.match(/^\/airlines\/[^\/]+\/fleet$/)) {
    const slug = path.split('/')[2];
    const airline = await getAirline(dbOps, slug);
    if (!airline) return jsonResponse({ error: 'Not found' }, 404, origin);
    const { results } = await db.prepare(
      'SELECT * FROM airline_fleet WHERE airline_id = ? AND is_active = 1 ORDER BY aircraft_model'
    ).bind(airline.id).all();
    const items = results || [];
    if (items.length === 0) {
      return jsonResponse({
        message: `${airline.name} has not yet shared their fleet details. If you represent ${airline.name}, claim this profile to list your aircraft types, in-service numbers, and route networks.`,
        airline: { name: airline.name, slug: airline.slug, country: airline.country, iata_code: airline.iata_code },
        fleet: [],
        claim_url: `/airlines/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }
    return jsonResponse(items, 200, origin);
  }

  // GET /airlines/:slug/pathways
  if (path.match(/^\/airlines\/[^\/]+\/pathways$/)) {
    const slug = path.split('/')[2];
    const airline = await getAirline(dbOps, slug);
    if (!airline) return jsonResponse({ error: 'Not found' }, 404, origin);
    const { results } = await db.prepare(
      'SELECT * FROM airline_pathways WHERE airline_id = ? AND is_active = 1 ORDER BY pathway_type, title'
    ).bind(airline.id).all();
    const items = results || [];
    if (items.length === 0) {
      return jsonResponse({
        message: `${airline.name} has not yet published their pilot hiring pathways. If you represent ${airline.name}, claim this profile to add your cadet, direct entry, and transition pathways with requirements so pilots can compare their profiles.`,
        airline: {
          name: airline.name, slug: airline.slug, country: airline.country,
          iata_code: airline.iata_code, logo: airline.logo,
        },
        pathways: [],
        claim_url: `/airlines/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }

    // Enrich each pathway with airline branding for the pathway card
    const enrichedItems = (items as Record<string, unknown>[]).map((p) => ({
      ...p,
      airline_name: airline.name,
      airline_slug: airline.slug,
      airline_logo: airline.logo,
      airline_iata_code: airline.iata_code,
      airline_country: airline.country,
      about_airline: p.about_airline || airline.about_airline,
      airline_expectations: p.airline_expectations || airline.expectations,
      future_fleet: p.future_fleet || airline.future_fleet,
      aptitude_test_url: p.aptitude_test_url || airline.aptitude_test_url,
      aptitude_test_description: p.aptitude_test_description || airline.aptitude_test_description,
      verified_pilots_only: p.verified_pilots_only || airline.verified_pilots_only || 0,
      // Airline's voice to different pilot personas
      target_pilot_persona: p.target_pilot_persona || null,
      message_to_low_time_pilots: p.message_to_low_time_pilots || airline.message_to_graduates || null,
      message_to_instructors: p.message_to_instructors || airline.message_to_instructors || null,
      message_to_stuck_instructors: p.message_to_stuck_instructors || airline.message_to_stuck_instructors || null,
      stuck_instructor_definition: p.stuck_instructor_definition || airline.stuck_instructor_definition || null,
      stuck_instructor_support: p.stuck_instructor_support || airline.stuck_instructor_support || null,
      message_to_transition_pilots: p.message_to_transition_pilots || airline.message_to_captains || null,
      career_progression_overview: p.career_progression_overview || null,
      support_programs: p.support_programs || airline.partnership_support || null,
      airline_values: p.airline_values || null,
      industry_alignment: p.industry_alignment || null,
      // EBT/CBTA and mentorship program preferences
      values_ebt_cbta_programs: p.values_ebt_cbta_programs || airline.values_ebt_cbta_programs || 0,
      values_mentorship_program: p.values_mentorship_program || airline.values_mentorship_program || 0,
      prefers_program_experience: p.prefers_program_experience || airline.prefers_program_experience || 0,
      prefers_industry_pre_accessed: p.prefers_industry_pre_accessed || airline.prefers_industry_pre_accessed || 0,
      ebt_cbta_description: p.ebt_cbta_description || airline.ebt_cbta_description || null,
      mentorship_description: p.mentorship_description || airline.mentorship_description || null,
      // Airline positioning and identity
      why_choose_us: p.why_choose_us || airline.why_choose_us || null,
      pilot_alignment_statement: p.pilot_alignment_statement || airline.pilot_alignment_statement || null,
      unique_value_proposition: p.unique_value_proposition || airline.unique_value_proposition || null,
      comparison_context: p.comparison_context || airline.comparison_context || null,
      citizenship_policy: p.citizenship_policy || airline.citizenship_policy || null,
      experience_level_preference: p.experience_level_preference || airline.experience_level_preference || null,
      airline_culture: p.airline_culture || airline.airline_culture || null,
      diversity_statement: p.diversity_statement || airline.diversity_statement || null,
      // Type rating and pipeline unblocker policy
      type_rating_policy: p.type_rating_policy || airline.type_rating_policy || 'required',
      values_instructor_experience: p.values_instructor_experience || airline.values_instructor_experience || 0,
      instructor_transition_program: p.instructor_transition_program || airline.instructor_transition_program || 0,
      pipeline_priority_for_stuck_pilots: p.pipeline_priority_for_stuck_pilots || airline.pipeline_priority_for_stuck_pilots || 0,
      training_pathway_for_non_type_rated: p.training_pathway_for_non_type_rated || airline.training_pathway_for_non_type_rated || null,
      stuck_pilot_support_description: p.stuck_pilot_support_description || airline.stuck_pilot_support_description || null,
      // Operations focus and regional pathway policy
      operations_focus: p.operations_focus || airline.operations_focus || null,
      starter_aircraft_policy: p.starter_aircraft_policy || airline.starter_aircraft_policy || 0,
      regional_pathway_description: p.regional_pathway_description || airline.regional_pathway_description || null,
      industry_alignment_statement: p.industry_alignment_statement || airline.industry_alignment_statement || null,
      low_hour_regional_message: p.low_hour_regional_message || airline.low_hour_regional_message || null,
      // Instrument reading: computed from available data, not a badge
      data_completeness_score: computePathwayDataCompleteness(p),
    }));

    return jsonResponse(enrichedItems, 200, origin);
  }

  // POST /airlines/:slug/pathway-match
  // Body: pilot profile snapshot { total_hours, pic_hours, ratings, age, english_level, ... }
  if (path.match(/^\/airlines\/[^\/]+\/pathway-match$/)) {
    const slug = path.split('/')[2];
    const airline = await getAirline(dbOps, slug);
    if (!airline) return jsonResponse({ error: 'Not found' }, 404, origin);

    const body = await request.json().catch(() => ({})) as Record<string, unknown>;

    // Fetch all active pathways for this airline
    const { results: pathways } = await db.prepare(
      'SELECT * FROM airline_pathways WHERE airline_id = ? AND is_active = 1 ORDER BY pathway_type, title'
    ).bind(airline.id).all();

    const items = (pathways || []) as Record<string, unknown>[];
    if (items.length === 0) {
      return jsonResponse({
        message: `${airline.name} has not yet published pathways. No comparison is possible yet.`,
        airline: { name: airline.name, slug: airline.slug },
        matches: [],
      }, 200, origin);
    }

    // Build gap analysis for each pathway
    const pilotHours = Number(body.total_hours) || 0;
    const pilotPic = Number(body.pic_hours) || 0;
    const pilotPicJet = Number(body.pic_on_jet_hours) || 0;
    const pilotMulti = Number(body.multi_engine_hours) || 0;
    const pilotNight = Number(body.night_hours) || 0;
    const pilotInst = Number(body.instrument_hours) || 0;
    const pilotXc = Number(body.cross_country_hours) || 0;
    const pilotAge = Number(body.age) || 0;
    const pilotRatings = new Set((body.ratings as string[] || []).map((r: string) => r.toUpperCase().trim()));
    const pilotEnglish = body.english_level as string || '';
    const pilotMedical = body.medical_class as string || '';

    const matches = items.map((pathway: Record<string, unknown>) => {
      const gaps: string[] = [];
      const met: string[] = [];

      // Hours gates
      if (pathway.min_total_hours && pilotHours < (pathway.min_total_hours as number)) {
        gaps.push(`Total hours: need ${pathway.min_total_hours}, have ${pilotHours} (short ${(pathway.min_total_hours as number) - pilotHours})`);
      } else if (pathway.min_total_hours) {
        met.push(`Total hours: ${pilotHours} >= ${pathway.min_total_hours}`);
      }

      if (pathway.min_pic_hours && pilotPic < (pathway.min_pic_hours as number)) {
        gaps.push(`PIC hours: need ${pathway.min_pic_hours}, have ${pilotPic} (short ${(pathway.min_pic_hours as number) - pilotPic})`);
      } else if (pathway.min_pic_hours) {
        met.push(`PIC hours: ${pilotPic} >= ${pathway.min_pic_hours}`);
      }

      if (pathway.min_pic_on_jet_hours && pilotPicJet < (pathway.min_pic_on_jet_hours as number)) {
        gaps.push(`PIC on jet hours: need ${pathway.min_pic_on_jet_hours}, have ${pilotPicJet} (short ${(pathway.min_pic_on_jet_hours as number) - pilotPicJet})`);
      } else if (pathway.min_pic_on_jet_hours) {
        met.push(`PIC on jet: ${pilotPicJet} >= ${pathway.min_pic_on_jet_hours}`);
      }

      if (pathway.min_multi_engine_hours && pilotMulti < (pathway.min_multi_engine_hours as number)) {
        gaps.push(`Multi-engine hours: need ${pathway.min_multi_engine_hours}, have ${pilotMulti} (short ${(pathway.min_multi_engine_hours as number) - pilotMulti})`);
      } else if (pathway.min_multi_engine_hours) {
        met.push(`Multi-engine: ${pilotMulti} >= ${pathway.min_multi_engine_hours}`);
      }

      if (pathway.min_night_hours && pilotNight < (pathway.min_night_hours as number)) {
        gaps.push(`Night hours: need ${pathway.min_night_hours}, have ${pilotNight} (short ${(pathway.min_night_hours as number) - pilotNight})`);
      } else if (pathway.min_night_hours) {
        met.push(`Night: ${pilotNight} >= ${pathway.min_night_hours}`);
      }

      if (pathway.min_instrument_hours && pilotInst < (pathway.min_instrument_hours as number)) {
        gaps.push(`Instrument hours: need ${pathway.min_instrument_hours}, have ${pilotInst} (short ${(pathway.min_instrument_hours as number) - pilotInst})`);
      } else if (pathway.min_instrument_hours) {
        met.push(`Instrument: ${pilotInst} >= ${pathway.min_instrument_hours}`);
      }

      if (pathway.min_cross_country_hours && pilotXc < (pathway.min_cross_country_hours as number)) {
        gaps.push(`Cross-country hours: need ${pathway.min_cross_country_hours}, have ${pilotXc} (short ${(pathway.min_cross_country_hours as number) - pilotXc})`);
      } else if (pathway.min_cross_country_hours) {
        met.push(`Cross-country: ${pilotXc} >= ${pathway.min_cross_country_hours}`);
      }

      // Age gates
      if (pathway.min_age && pilotAge < (pathway.min_age as number)) {
        gaps.push(`Minimum age: need ${pathway.min_age}, have ${pilotAge}`);
      } else if (pathway.min_age) {
        met.push(`Age: ${pilotAge} >= ${pathway.min_age}`);
      }

      if (pathway.max_age && pilotAge > (pathway.max_age as number)) {
        gaps.push(`Maximum age: must be <= ${pathway.max_age}, have ${pilotAge}`);
      } else if (pathway.max_age) {
        met.push(`Age: ${pilotAge} <= ${pathway.max_age}`);
      }

      // Ratings
      const reqRatings = (pathway.required_ratings as string || '').split(',').map((r: string) => r.trim().toUpperCase()).filter(Boolean);
      for (const req of reqRatings) {
        if (pilotRatings.has(req)) {
          met.push(`Rating: ${req} held`);
        } else {
          gaps.push(`Rating required: ${req} (not held)`);
        }
      }

      // Type ratings
      const reqTypeRatings = (pathway.required_type_ratings as string || '').split(',').map((r: string) => r.trim().toUpperCase()).filter(Boolean);
      let missingTypeRatings = 0;
      for (const req of reqTypeRatings) {
        if (pilotRatings.has(req)) {
          met.push(`Type rating: ${req} held`);
        } else {
          gaps.push(`Type rating required: ${req} (not held)`);
          missingTypeRatings++;
        }
      }

      // Pipeline Unblocker: High-hour instructor without type rating
      // Airlines that value instructor experience and accept assessment over existing type ratings
      const typeRatingPolicy = (pathway.type_rating_policy || airline.type_rating_policy || 'required') as string;
      const airlineValuesInstructors = (pathway.values_instructor_experience || airline.values_instructor_experience || 0) as number;
      const airlinePrioritizesStuckPilots = (pathway.pipeline_priority_for_stuck_pilots || airline.pipeline_priority_for_stuck_pilots || 0) as number;
      const pilotVerified = body.is_verified === true;
      const pilotBackgroundChecked = body.is_background_checked === true;
      const isStuckInstructor = pilotHours >= 5000 && missingTypeRatings > 0 && reqTypeRatings.length > 0;
      const isPipelineUnblocker = isStuckInstructor &&
        typeRatingPolicy !== 'required' &&
        airlineValuesInstructors === 1 &&
        pilotVerified &&
        pilotBackgroundChecked;

      if (isPipelineUnblocker) {
        // Don't penalize the match score for missing type ratings when airline is willing to assess
        const typeRatingGaps = gaps.filter(g => g.startsWith('Type rating required'));
        const otherGaps = gaps.filter(g => !g.startsWith('Type rating required'));
        const reassessedPercent = met.length + otherGaps.length > 0
          ? Math.round((met.length / (met.length + otherGaps.length)) * 100)
          : 100;
        // Override gaps with a note
        const unblockerNote = `Type rating gap waived: ${missingTypeRatings} type ratings missing, but airline accepts assessment pathway for verified high-hour instructors.`;
        gaps.splice(0, gaps.length, ...otherGaps, unblockerNote);
      }

      // English level
      const engLevels = ['1', '2', '3', '4', '5', '6'];
      const reqEng = pathway.required_english_level as string || '';
      const pilotEngIdx = engLevels.indexOf(pilotEnglish);
      const reqEngIdx = engLevels.indexOf(reqEng);
      if (reqEng && (pilotEngIdx < reqEngIdx || pilotEngIdx === -1)) {
        gaps.push(`English level: need ICAO Level ${reqEng}, have ${pilotEnglish || 'none'}`);
      } else if (reqEng) {
        met.push(`English: Level ${pilotEnglish} >= required Level ${reqEng}`);
      }

      // Medical
      const medClasses = ['class_3', 'class_2', 'class_1'];
      const reqMed = (pathway.required_medical_class as string || '').toLowerCase().trim();
      const pilotMed = pilotMedical.toLowerCase().trim();
      const reqMedIdx = medClasses.indexOf(reqMed);
      const pilotMedIdx = medClasses.indexOf(pilotMed);
      if (reqMed && (pilotMedIdx < reqMedIdx || pilotMedIdx === -1)) {
        gaps.push(`Medical: need ${reqMed}, have ${pilotMedical || 'none'}`);
      } else if (reqMed) {
        met.push(`Medical: ${pilotMedical} meets ${reqMed}`);
      }

      // Degree
      const hasDegree = body.has_degree === true;
      if (pathway.requires_degree && (pathway.requires_degree as number) === 1 && !hasDegree) {
        gaps.push('Degree required: bachelor or higher');
      } else if ((pathway.requires_degree as number) === 1) {
        met.push('Degree: held');
      }

      // Assessment stages preview
      let assessmentPreview: unknown[] = [];
      try {
        assessmentPreview = JSON.parse(pathway.assessment_stages as string || '[]');
      } catch { assessmentPreview = []; }

      const percentMet = isPipelineUnblocker
        ? Math.round((met.length / (met.length + gaps.filter(g => !g.startsWith('Type rating gap waived')).length)) * 100)
        : (met.length + gaps.length > 0 ? Math.round((met.length / (met.length + gaps.length)) * 100) : 100);

      // Auto-generate pilot persona and profile summary from pilot data
      // The platform tells the pilot's story — airlines see auto-generated cards, not custom essays
      const pilotProfile: PilotProfile = {
        total_hours: pilotHours,
        pic_hours: pilotPic,
        pic_on_jet_hours: pilotPicJet,
        multi_engine_hours: pilotMulti,
        instrument_hours: pilotInst,
        ratings: Array.from(pilotRatings),
        years_applying: Number(body.years_applying) || 0,
        years_experience: Number(body.years_experience) || 0,
        current_role: body.current_role as string || '',
        is_verified: body.is_verified === true,
        is_background_checked: body.is_background_checked === true,
        has_degree: body.has_degree === true,
        english_level: pilotEnglish,
        medical_class: pilotMedical,
        age: pilotAge,
        type_ratings_held: Array.from(pilotRatings).filter(r => reqTypeRatings.includes(r)),
        last_operator: body.last_operator as string || '',
        total_landings: Number(body.total_landings) || 0,
        jet_hours: pilotPicJet,
      };

      const personaResult = detectPilotPersona(pilotProfile);
      const pilotSummary = generatePilotProfileSummary(pilotProfile, personaResult.persona);
      const blockerAnalysis = generatePilotBlockerAnalysis(pilotProfile, personaResult.persona);

      // Fallback: airline-written message if present, but auto-generated is primary
      let contextualMessage: string | null = pilotSummary;
      if (pathway.message_to_low_time_pilots && pilotHours < 500) {
        contextualMessage = pathway.message_to_low_time_pilots as string;
      } else if ((pathway.message_to_stuck_instructors || airline.message_to_stuck_instructors) && personaResult.persona === 'stuck_instructor') {
        contextualMessage = (pathway.message_to_stuck_instructors || airline.message_to_stuck_instructors) as string;
      } else if ((pathway.message_to_stuck_instructors || airline.message_to_stuck_instructors) && personaResult.persona === 'stuck_type_rated') {
        contextualMessage = (pathway.message_to_stuck_instructors || airline.message_to_stuck_instructors) as string;
      } else if (pathway.message_to_instructors && personaResult.persona === 'flight_instructor_building') {
        contextualMessage = pathway.message_to_instructors as string;
      } else if (pathway.message_to_transition_pilots && personaResult.persona === 'experienced_captain') {
        contextualMessage = pathway.message_to_transition_pilots as string;
      }

      return {
        pathway_id: pathway.id,
        title: pathway.title,
        pathway_type: pathway.pathway_type,
        description: pathway.description,
        competitiveness_score: pathway.competitiveness_score,
        estimated_timeline_months: pathway.estimated_timeline_months,
        estimated_cost_to_pilot_usd: pathway.estimated_cost_to_pilot_usd,
        salary_first_year_usd: pathway.salary_first_year_usd,
        percent_match: percentMet,
        gaps,
        met,
        assessment_stages: assessmentPreview,
        // Auto-generated pilot profile presentation
        pilot_profile: {
          summary: pilotSummary,
          persona: personaResult.persona,
          persona_confidence: personaResult.confidence,
          persona_flags: personaResult.flags,
          blocker_analysis: blockerAnalysis,
          raw_snapshot: pilotProfile,
        },
        // Educational context from the airline
        target_pilot_persona: pathway.target_pilot_persona,
        contextual_message: contextualMessage,
        message_to_stuck_instructors: pathway.message_to_stuck_instructors || airline.message_to_stuck_instructors || null,
        stuck_instructor_definition: pathway.stuck_instructor_definition || airline.stuck_instructor_definition || null,
        stuck_instructor_support: pathway.stuck_instructor_support || airline.stuck_instructor_support || null,
        career_progression_overview: pathway.career_progression_overview,
        support_programs: pathway.support_programs,
        airline_values: pathway.airline_values,
        industry_alignment: pathway.industry_alignment,
        // Program preferences
        values_ebt_cbta_programs: pathway.values_ebt_cbta_programs,
        values_mentorship_program: pathway.values_mentorship_program,
        prefers_program_experience: pathway.prefers_program_experience,
        prefers_industry_pre_accessed: pathway.prefers_industry_pre_accessed,
        ebt_cbta_description: pathway.ebt_cbta_description,
        mentorship_description: pathway.mentorship_description,
        // Airline positioning and identity
        why_choose_us: pathway.why_choose_us || airline.why_choose_us || null,
        pilot_alignment_statement: pathway.pilot_alignment_statement || airline.pilot_alignment_statement || null,
        unique_value_proposition: pathway.unique_value_proposition || airline.unique_value_proposition || null,
        comparison_context: pathway.comparison_context || airline.comparison_context || null,
        citizenship_policy: pathway.citizenship_policy || airline.citizenship_policy || null,
        experience_level_preference: pathway.experience_level_preference || airline.experience_level_preference || null,
        airline_culture: pathway.airline_culture || airline.airline_culture || null,
        diversity_statement: pathway.diversity_statement || airline.diversity_statement || null,
        // Type rating and pipeline unblocker policy
        type_rating_policy: typeRatingPolicy,
        values_instructor_experience: airlineValuesInstructors,
        instructor_transition_program: pathway.instructor_transition_program || airline.instructor_transition_program || 0,
        pipeline_priority_for_stuck_pilots: airlinePrioritizesStuckPilots,
        training_pathway_for_non_type_rated: pathway.training_pathway_for_non_type_rated || airline.training_pathway_for_non_type_rated || null,
        stuck_pilot_support_description: pathway.stuck_pilot_support_description || airline.stuck_pilot_support_description || null,
        // Operations focus and regional pathway policy
        operations_focus: pathway.operations_focus || airline.operations_focus || null,
        starter_aircraft_policy: pathway.starter_aircraft_policy || airline.starter_aircraft_policy || 0,
        regional_pathway_description: pathway.regional_pathway_description || airline.regional_pathway_description || null,
        industry_alignment_statement: pathway.industry_alignment_statement || airline.industry_alignment_statement || null,
        low_hour_regional_message: pathway.low_hour_regional_message || airline.low_hour_regional_message || null,
        // Pipeline unblocker recommendation
        pipeline_unblocker_recommendation: isPipelineUnblocker ? {
          recommended: true,
          reason: `Pilot has ${pilotHours} verified hours as an instructor. Missing ${missingTypeRatings} type ratings, but ${airline.name} accepts assessment pathway. Verified hours. Background checked. High match profile.`,
          pilot_summary: `${pilotHours}h instructor, ${missingTypeRatings} type ratings missing, verified, background-checked`,
          suggested_action: `Pull profile from candidate pool. Assess for type rating training pathway.`,
        } : null,
        // Instrument reading: how complete is the data this match is based on?
        data_completeness_score: computePathwayDataCompleteness(pathway),
      };
    });

    // Sort by percent_match descending
    matches.sort((a: { percent_match: number }, b: { percent_match: number }) => b.percent_match - a.percent_match);

    // Check if airline only welcomes verified pilots
    const airlineVerifiedOnly = airline.verified_pilots_only && (airline.verified_pilots_only as number) === 1;
    const pilotIsVerified = body.is_verified === true;

    // Filter matches: if airline is verified-only and pilot isn't verified, mark as restricted
    const matchesWithAccess = matches.map((m: Record<string, unknown>) => {
      const pathwayVerifiedOnly = m.verified_pilots_only && (m.verified_pilots_only as number) === 1;
      const isRestricted = (airlineVerifiedOnly || pathwayVerifiedOnly) && !pilotIsVerified;
      return {
        ...m,
        access_status: isRestricted ? 'verification_required' : 'open',
        ...(isRestricted ? {
          message: `${airline.name} prefers verified pilots for this pathway. Complete your profile verification to unlock full pathway details and express interest.`,
          unlock_url: '/verification',
        } : {}),
      };
    });

    return jsonResponse({
      airline: {
        name: airline.name, slug: airline.slug, iata_code: airline.iata_code,
        logo: airline.logo, country: airline.country,
        about_airline: airline.about_airline,
        expectations: airline.expectations,
        future_fleet: airline.future_fleet,
        aptitude_test_url: airline.aptitude_test_url,
        aptitude_test_description: airline.aptitude_test_description,
        verified_pilots_only: airline.verified_pilots_only,
        // Airline's educational voice to the community
        airline_mission: airline.airline_mission,
        message_to_graduates: airline.message_to_graduates,
        message_to_instructors: airline.message_to_instructors,
        message_to_stuck_instructors: airline.message_to_stuck_instructors,
        stuck_instructor_definition: airline.stuck_instructor_definition,
        stuck_instructor_support: airline.stuck_instructor_support,
        message_to_captains: airline.message_to_captains,
        pilot_development_philosophy: airline.pilot_development_philosophy,
        partnership_support: airline.partnership_support,
      },
      pilot_snapshot: {
        total_hours: pilotHours,
        pic_hours: pilotPic,
        pic_on_jet_hours: pilotPicJet,
        multi_engine_hours: pilotMulti,
        night_hours: pilotNight,
        instrument_hours: pilotInst,
        cross_country_hours: pilotXc,
        age: pilotAge,
        ratings: Array.from(pilotRatings),
        english_level: pilotEnglish,
        medical_class: pilotMedical,
        has_degree: body.has_degree,
        is_verified: pilotIsVerified,
      },
      matches: matchesWithAccess,
      best_match: matchesWithAccess[0] || null,
    }, 200, origin);
  }

  // POST /pathways/:id/submit-interest
  // Body: { pilot_id, pilot_email, pilot_name, pilot_profile_url, percent_match, verified_hours, unverified_hours, is_verified, pilot_snapshot }
  if (request.method === 'POST' && path.match(/^\/pathways\/[^\/]+\/submit-interest$/)) {
    const pathwayId = path.split('/')[2];
    const pathway = await db.prepare('SELECT * FROM airline_pathways WHERE id = ? AND is_active = 1').bind(pathwayId).first() as Record<string, unknown> | null;
    if (!pathway) return jsonResponse({ error: 'Pathway not found or inactive' }, 404, origin);

    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    if (!body.pilot_id) return jsonResponse({ error: 'pilot_id is required' }, 400, origin);

    // Check if pathway/airline is verified-only
    const airline = await db.prepare('SELECT * FROM airlines WHERE id = ?').bind(pathway.airline_id).first() as Record<string, unknown> | null;
    const pathwayVerifiedOnly = pathway.verified_pilots_only && (pathway.verified_pilots_only as number) === 1;
    const airlineVerifiedOnly = airline && airline.verified_pilots_only && (airline.verified_pilots_only as number) === 1;
    const pilotIsVerified = body.is_verified === true;

    if ((pathwayVerifiedOnly || airlineVerifiedOnly) && !pilotIsVerified) {
      return jsonResponse({
        error: 'Verification required',
        message: `${airline?.name || 'This airline'} prefers verified pilots. Complete your profile verification to submit interest in this pathway.`,
        unlock_url: '/verification',
      }, 403, origin);
    }

    // 3-Month Verification Window Check
    // Aviation compliance takes time. Pilots should be verified at least 3 months before applying.
    // We allow submission but flag it if the window hasn't passed.
    let verificationAgeStatus = 'not_verified';
    let verificationAgeDays = 0;
    let verificationWarning = '';

    if (pilotIsVerified && body.pilot_profile_id) {
      const pilotProfile = await dbProfiles.prepare(
        'SELECT verification_completed_at FROM pilot_profiles WHERE id = ? OR auth0_id = ? LIMIT 1'
      ).bind(body.pilot_profile_id, body.pilot_id).first() as Record<string, unknown> | null;

      if (pilotProfile?.verification_completed_at) {
        const completedAt = new Date(pilotProfile.verification_completed_at as string);
        const now = new Date();
        const diffMs = now.getTime() - completedAt.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        verificationAgeDays = diffDays;

        if (diffDays >= 90) {
          verificationAgeStatus = 'verified_3m_plus';
        } else {
          verificationAgeStatus = 'verified_under_3m';
          verificationWarning = `Your profile was verified ${diffDays} days ago. For maximum credibility with airlines, we recommend initiating verification at least 3 months before applying. Aviation compliance takes time — early verification puts you ahead.`;
        }
      }
    }

    // Check for duplicate submission
    const existing = await dbProfiles.prepare('SELECT id FROM pilot_pathway_pool WHERE pathway_id = ? AND pilot_id = ?').bind(pathwayId, body.pilot_id).first();
    if (existing) {
      return jsonResponse({ error: 'Already submitted interest in this pathway' }, 409, origin);
    }

    // Calculate risk ratio: unverified / total hours (1.0 = all unverified, 0.0 = all verified)
    const verifiedHours = Number(body.verified_hours) || 0;
    const unverifiedHours = Number(body.unverified_hours) || 0;
    const totalHours = verifiedHours + unverifiedHours;
    const riskRatio = totalHours > 0 ? unverifiedHours / totalHours : 1.0;

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await dbProfiles.prepare(`
      INSERT INTO pilot_pathway_pool (
        id, pathway_id, airline_id, pilot_id, pilot_profile_id, pilot_email, pilot_name, pilot_profile_url,
        percent_match, verified_hours, unverified_hours, risk_ratio, is_verified,
        verification_age_status, pilot_snapshot, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, pathwayId, pathway.airline_id as string, body.pilot_id, body.pilot_profile_id || body.pilot_id || null,
      body.pilot_email || null, body.pilot_name || null, body.pilot_profile_url || null,
      body.percent_match || null,
      verifiedHours, unverifiedHours, riskRatio, pilotIsVerified ? 1 : 0,
      verificationAgeStatus,
      body.pilot_snapshot ? JSON.stringify(body.pilot_snapshot) : null,
      'submitted', now, now
    ).run();

    const created = await dbProfiles.prepare('SELECT * FROM pilot_pathway_pool WHERE id = ?').bind(id).first();

    const responseMessage = verificationWarning
      ? `Interest submitted with early-verification flag. ${verificationWarning} Your public profile is now visible in this pathway. Airlines may prioritize pilots with 3+ months of verified standing. PilotRecognition is the infrastructure — we do not broker hiring or take success fees.`
      : 'Interest submitted. Your public profile is now visible in this pathway. The airline reviews the pool directly. PilotRecognition is the infrastructure — we do not broker hiring or take success fees.';

    return jsonResponse({
      message: responseMessage,
      verification_window: {
        status: verificationAgeStatus,
        days_since_verification: verificationAgeDays,
        recommended_minimum_days: 90,
        meets_window: verificationAgeStatus === 'verified_3m_plus',
      },
      pool_entry: created,
    }, 201, origin);
  }

  // ── Private Jet Charters (Public Read) ───────────────────────

  // GET /private-jet-charters
  if (path === '/private-jet-charters') {
    const country = url.searchParams.get('country');
    const isHiring = url.searchParams.get('is_hiring');
    const includePlus = url.searchParams.get('recognition_plus') === '1';

    let sql = 'SELECT * FROM private_jet_charters WHERE is_active = 1';
    const binds: unknown[] = [];

    if (country) { sql += ' AND country = ?'; binds.push(country); }
    if (isHiring) { sql += ' AND is_hiring = 1'; }

    // Only show Recognition Plus charters if explicitly requested
    if (!includePlus) {
      sql += ' AND recognition_plus_only = 0';
    }

    sql += ' ORDER BY average_captain_salary_usd DESC, name';
    const { results } = await db.prepare(sql).bind(...binds).all();
    return jsonResponse(results || [], 200, origin);
  }

  // GET /private-jet-charters/:slug
  if (path.match(/^\/private-jet-charters\/[^\/]+$/)) {
    const slug = path.split('/')[2];
    const pjc = await getPjc(dbOps, slug);
    if (!pjc) return jsonResponse({ error: 'Not found' }, 404, origin);

    const isPlusOnly = pjc.recognition_plus_only && (pjc.recognition_plus_only as number) === 1;
    if (isPlusOnly) {
      return jsonResponse({
        ...pjc,
        visibility: 'recognition_plus_only',
        message: `${pjc.name} is exclusively visible to Recognition Plus subscribers. Upgrade to Recognition Plus to view detailed profiles, hiring requirements, and salary information for private jet charter operators.`,
        upgrade_url: '/subscription/recognition-plus',
      }, 200, origin);
    }

    const hasOutputData = pjc.fleet_size && (pjc.fleet_size as number) > 0;
    if (!hasOutputData) {
      return jsonResponse({
        ...pjc,
        output_data_status: 'not_yet_available',
        message: `${pjc.name} has not yet shared their fleet or hiring details. If you represent ${pjc.name}, claim this profile to showcase your aircraft, bases, and captain requirements to pilots worldwide.`,
        claim_url: `/private-jet-charters/${encodeURIComponent(slug)}/claim`,
      }, 200, origin);
    }

    return jsonResponse(pjc, 200, origin);
  }

  // ── pilotshortage.org Stories API (Public) ───────────────────

  // GET /pilotshortage/stats
  // Public counter for homepage/live ticker
  if (path === '/pilotshortage/stats') {
    const totalStories = await dbDocs.prepare("SELECT COUNT(*) as count FROM pilotshortage_stories WHERE status IN ('submitted', 'under_review', 'license_verified', 'logbook_verified', 'interview_scheduled', 'interview_conducted', 'approved')").first() as Record<string, unknown>;
    const verifiedStories = await dbDocs.prepare("SELECT COUNT(*) as count FROM pilotshortage_stories WHERE status = 'approved'").first() as Record<string, unknown>;
    const byFloor = await dbDocs.prepare(`
      SELECT floor_level, COUNT(*) as count FROM pilotshortage_stories
      WHERE status IN ('submitted', 'under_review', 'license_verified', 'logbook_verified', 'interview_scheduled', 'interview_conducted', 'approved')
      GROUP BY floor_level ORDER BY floor_level
    `).all() as { results: Record<string, unknown>[] };
    const featuredCount = await dbDocs.prepare("SELECT COUNT(*) as count FROM pilotshortage_stories WHERE is_featured = 1 AND status = 'approved'").first() as Record<string, unknown>;

    return jsonResponse({
      total_stories: totalStories?.count || 0,
      verified_approved: verifiedStories?.count || 0,
      featured: featuredCount?.count || 0,
      by_floor: (byFloor.results || []).reduce((acc: Record<string, unknown>, row: Record<string, unknown>) => {
        const floorNames: Record<number, string> = { 0: 'graduate', 1: 'instructor', 2: 'recognition_gap', 3: 'airline' };
        const name = floorNames[row.floor_level as number] || `floor_${row.floor_level}`;
        acc[name] = row.count;
        return acc;
      }, {}),
      message: 'The pilot is not the failure. The pipeline is.',
    }, 200, origin);
  }

  // GET /pilotshortage/stories
  // Public list with filters. Supports anonymous stories.
  if (path === '/pilotshortage/stories') {
    const status = url.searchParams.get('status');
    const floor = url.searchParams.get('floor');
    const featured = url.searchParams.get('featured') === '1';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    let sql = `
      SELECT id, display_name, is_anonymous, headline, content, floor_level,
             career_shift_from, career_shift_to, years_in_aviation, total_hours_at_shift,
             investment_usd, support_request, status, verification_stages, verified_at,
             is_featured, featured_at, view_count, share_count, created_at
      FROM pilotshortage_stories
      WHERE status IN ('submitted', 'under_review', 'license_verified', 'logbook_verified', 'interview_scheduled', 'interview_conducted', 'approved')
    `;
    const binds: unknown[] = [];

    if (status) {
      sql += ' AND status = ?';
      binds.push(status);
    }
    if (floor) {
      sql += ' AND floor_level = ?';
      binds.push(parseInt(floor, 10));
    }
    if (featured) {
      sql += ' AND is_featured = 1 AND status = \'approved\'';
    }

    sql += ' ORDER BY is_featured DESC, created_at DESC LIMIT ? OFFSET ?';
    binds.push(limit, offset);

    const { results } = await dbDocs.prepare(sql).bind(...binds).all() as { results: Record<string, unknown>[] };

    const stories = (results || []).map((row: Record<string, unknown>) => ({
      id: row.id,
      display_name: row.display_name,
      is_anonymous: (row.is_anonymous as number || 0) === 1,
      headline: row.headline,
      content: row.content,
      floor_level: row.floor_level,
      floor_label: ['Graduate (200 hrs CPL)', 'Instructor (5K hrs)', 'Recognition Gap', 'Airline (12+ yrs)'][row.floor_level as number] || 'Unknown',
      career_shift_from: row.career_shift_from,
      career_shift_to: row.career_shift_to,
      years_in_aviation: row.years_in_aviation,
      total_hours_at_shift: row.total_hours_at_shift,
      investment_usd: row.investment_usd,
      support_request: row.support_request,
      status: row.status,
      verification_stages: (() => { try { return JSON.parse((row.verification_stages as string) || '[]'); } catch { return []; } })(),
      verified_at: row.verified_at,
      is_featured: (row.is_featured as number || 0) === 1,
      view_count: row.view_count,
      share_count: row.share_count,
      created_at: row.created_at,
    }));

    return jsonResponse({
      stories,
      count: stories.length,
      offset,
      limit,
      has_more: stories.length === limit,
    }, 200, origin);
  }

  // GET /pilotshortage/stories/:id
  // Public single story. Increments view_count.
  if (path.match(/^\/pilotshortage\/stories\/[^\/]+$/) && request.method === 'GET') {
    const id = path.split('/')[3];

    const story = await dbDocs.prepare(`
      SELECT id, display_name, is_anonymous, headline, content, floor_level,
             career_shift_from, career_shift_to, years_in_aviation, total_hours_at_shift,
             investment_usd, support_request, status, verification_stages, verified_at,
             is_featured, featured_at, view_count, share_count, created_at
      FROM pilotshortage_stories WHERE id = ?
    `).bind(id).first() as Record<string, unknown> | null;

    if (!story) return jsonResponse({ error: 'Story not found' }, 404, origin);

    // Increment view count (fire and forget)
    dbDocs.prepare('UPDATE pilotshortage_stories SET view_count = COALESCE(view_count, 0) + 1 WHERE id = ?').bind(id).run().catch(() => {});

    return jsonResponse({
      id: story.id,
      display_name: story.display_name,
      is_anonymous: (story.is_anonymous as number || 0) === 1,
      headline: story.headline,
      content: story.content,
      floor_level: story.floor_level,
      floor_label: ['Graduate (200 hrs CPL)', 'Instructor (5K hrs)', 'Recognition Gap', 'Airline (12+ yrs)'][story.floor_level as number] || 'Unknown',
      career_shift_from: story.career_shift_from,
      career_shift_to: story.career_shift_to,
      years_in_aviation: story.years_in_aviation,
      total_hours_at_shift: story.total_hours_at_shift,
      investment_usd: story.investment_usd,
      support_request: story.support_request,
      status: story.status,
      verification_stages: (() => { try { return JSON.parse((story.verification_stages as string) || '[]'); } catch { return []; } })(),
      verified_at: story.verified_at,
      is_featured: (story.is_featured as number || 0) === 1,
      view_count: (story.view_count as number || 0) + 1,
      share_count: story.share_count,
      created_at: story.created_at,
      value_proposition: 'Testify your pilot journey. In exchange for recognition.',
    }, 200, origin);
  }

  // POST /pilotshortage/stories
  // Anyone can submit. No auth required. Free to join. Free to write.
  if (path === '/pilotshortage/stories' && request.method === 'POST') {
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;

    if (!body.content || typeof body.content !== 'string' || body.content.length < 10) {
      return jsonResponse({ error: 'Content is required (minimum 10 characters). Tell your story.' }, 400, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Parse display name: if anonymous, use provided name or fallback
    let displayName = body.display_name as string || 'Anonymous Pilot';
    const isAnonymous = body.is_anonymous === true;
    const showFirstNameOnly = body.show_first_name_only !== false; // default true

    if (isAnonymous) {
      displayName = 'Anonymous Pilot';
    } else if (showFirstNameOnly && displayName.includes(' ')) {
      displayName = displayName.split(' ')[0];
    }

    await dbDocs.prepare(`
      INSERT INTO pilotshortage_stories (
        id, pilot_profile_id, pilot_slug, story_type, content, headline,
        display_name, is_anonymous, show_first_name_only, floor_level,
        career_shift_from, career_shift_to, years_in_aviation, total_hours_at_shift,
        investment_usd, support_request, status, verification_stages, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.pilot_profile_id || null,
      body.pilot_slug || null,
      body.story_type || 'claim',
      body.content,
      body.headline || null,
      displayName,
      isAnonymous ? 1 : 0,
      showFirstNameOnly ? 1 : 0,
      body.floor_level !== undefined ? Math.min(Math.max(parseInt(String(body.floor_level), 10), 0), 3) : 0,
      body.career_shift_from || null,
      body.career_shift_to || null,
      body.years_in_aviation || null,
      body.total_hours_at_shift || null,
      body.investment_usd || null,
      body.support_request || null,
      'submitted',
      JSON.stringify([{ stage: 'submitted', status: 'pending', at: now }]),
      now, now
    ).run();

    const created = await dbDocs.prepare('SELECT * FROM pilotshortage_stories WHERE id = ?').bind(id).first() as Record<string, unknown>;

    return jsonResponse({
      message: 'Story submitted. Free to join. Free to write. But the claim is worthless until verified. Your story enters the verification queue.',
      verification_note: 'Verification stages: license → logbook → interview → approved. Only then does your testimony hold weight.',
      story: created,
    }, 201, origin);
  }

  // GET /search?q=query
  if (path === '/search') {
    const q = url.searchParams.get('q')?.replace(/[%_]/g, '').trim();
    if (!q) return jsonResponse([], 200, origin);

    const pattern = `%${q}%`;
    const [aircraftResults, mfrResults, atoResults, trcResults, airlineResults, pjcResults] = await Promise.all([
      db.prepare('SELECT * FROM aircraft_type_ratings WHERE model LIKE ? OR description LIKE ? ORDER BY model LIMIT 20')
        .bind(pattern, pattern).all(),
      db.prepare('SELECT * FROM manufacturers WHERE name LIKE ? OR description LIKE ? ORDER BY name LIMIT 10')
        .bind(pattern, pattern).all(),
      db.prepare('SELECT * FROM atos WHERE name LIKE ? OR description LIKE ? ORDER BY name LIMIT 10')
        .bind(pattern, pattern).all(),
      db.prepare('SELECT * FROM type_rating_centers WHERE name LIKE ? OR description LIKE ? ORDER BY name LIMIT 10')
        .bind(pattern, pattern).all(),
      db.prepare('SELECT * FROM airlines WHERE name LIKE ? OR description LIKE ? OR iata_code LIKE ? ORDER BY name LIMIT 10')
        .bind(pattern, pattern, pattern).all(),
      db.prepare('SELECT * FROM private_jet_charters WHERE name LIKE ? OR description LIKE ? AND is_active = 1 AND recognition_plus_only = 0 ORDER BY name LIMIT 10')
        .bind(pattern, pattern).all(),
    ]);

    return jsonResponse({
      aircraft: aircraftResults.results || [],
      manufacturers: mfrResults.results || [],
      atos: atoResults.results || [],
      trcs: trcResults.results || [],
      airlines: airlineResults.results || [],
      private_jet_charters: pjcResults.results || [],
    }, 200, origin);
  }

  // GET /benchmarks
  if (path === '/benchmarks') {
    const category = url.searchParams.get('category');
    let sql = 'SELECT * FROM ato_benchmarks';
    const binds: unknown[] = [];
    if (category) { sql += ' WHERE metric_category = ?'; binds.push(category); }
    const { results } = await db.prepare(sql).bind(...binds).all();
    return jsonResponse(results || [], 200, origin);
  }

  // GET /pilots — Public pilot directory (teaser view)
  // Query params: verified_only, recommended_only, value_tier, persona, country
  if (path === '/pilots') {
    const verifiedOnly = url.searchParams.get('verified_only') === '1';
    const recommendedOnly = url.searchParams.get('recommended_only') === '1';
    const valueTier = url.searchParams.get('value_tier');
    const persona = url.searchParams.get('persona');
    const country = url.searchParams.get('country');

    let sql = 'SELECT * FROM pilot_profiles WHERE is_active = 1';
    const binds: unknown[] = [];

    if (verifiedOnly) { sql += ' AND is_verified = 1 AND is_background_checked = 1'; }
    if (recommendedOnly) { sql += ' AND is_recommended = 1'; }
    if (valueTier) { sql += ' AND profile_value_tier = ?'; binds.push(valueTier); }
    if (persona) { sql += ' AND persona = ?'; binds.push(persona); }
    if (country) { sql += ' AND country = ?'; binds.push(country); }

    sql += ' ORDER BY is_recommended DESC, profile_value_tier DESC, total_hours DESC';

    const { results } = await dbProfiles.prepare(sql).bind(...binds).all();
    const items = (results || []) as Record<string, unknown>[];
    const teasers = items.map(buildPilotProfileTeaser);

    return jsonResponse({
      total: teasers.length,
      filters_applied: {
        verified_only: verifiedOnly,
        recommended_only: recommendedOnly,
        value_tier: valueTier,
        persona,
        country,
      },
      pilots: teasers,
    }, 200, origin);
  }

  // GET /pilots/:slug — Public pilot profile (teaser view)
  if (path.match(/^\/pilots\/[^\/]+$/)) {
    const slug = path.split('/')[2];
    const raw = await dbProfiles.prepare('SELECT * FROM pilot_profiles WHERE public_slug = ? AND is_active = 1').bind(slug).first() as Record<string, unknown> | null;
    if (!raw) return jsonResponse({ error: 'Not found' }, 404, origin);

    // Fetch authoritative credentials from trace DB
    const [licenseRow, medicalRow, hoursRow] = await Promise.all([
      dbTrace.prepare('SELECT license_number, license_type, issuing_authority FROM pilot_licenses WHERE pilot_profile_id = ? ORDER BY created_at DESC LIMIT 1').bind(raw.id).first().catch(() => null) as Promise<Record<string, unknown> | null>,
      dbTrace.prepare('SELECT medical_class, expiry_date FROM pilot_medicals WHERE pilot_profile_id = ? ORDER BY created_at DESC LIMIT 1').bind(raw.id).first().catch(() => null) as Promise<Record<string, unknown> | null>,
      dbTrace.prepare('SELECT total_hours, pic_hours FROM pilot_flight_hours WHERE pilot_profile_id = ? ORDER BY created_at DESC LIMIT 1').bind(raw.id).first().catch(() => null) as Promise<Record<string, unknown> | null>,
    ]);
    if (licenseRow) { raw.license_number = licenseRow.license_number; raw.license_type = licenseRow.license_type; raw.issuing_authority = licenseRow.issuing_authority; }
    if (medicalRow) { raw.medical_expiry = medicalRow.expiry_date; raw.medical_class = medicalRow.medical_class; }
    if (hoursRow) { raw.total_hours = hoursRow.total_hours; raw.pic_hours = hoursRow.pic_hours; }

    const teaser = buildPilotProfileTeaser(raw);

    return jsonResponse({
      ...teaser,
      // Teaser notice: full profile available via accepted connect request or pathway interest
      _access_note: 'This is the public teaser profile. Full profile (contact info, full bio stories, full ratings, medical, license) is available to airlines when the pilot accepts a connect request or submits interest to a specific pathway.',
    }, 200, origin);
  }

  // GET /pilots/:slug/connect-requests
  // Pilot views incoming connect requests from airlines
  if (path.match(/^\/pilots\/[^\/]+\/connect-requests$/)) {
    const slug = path.split('/')[2];

    // Require pilot auth
    let auth: JWTPayload;
    try {
      auth = await requirePilotAuth(request, env, dbProfiles);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: msg }, 403, origin);
    }

    // Verify this pilot owns the profile
    const profile = await dbProfiles.prepare('SELECT * FROM pilot_profiles WHERE public_slug = ? AND auth0_id = ?').bind(slug, auth.sub).first() as Record<string, unknown> | null;
    if (!profile) return jsonResponse({ error: 'Forbidden: Not your profile' }, 403, origin);

    // Fetch connect requests from profiles DB and airlines from ops DB, merge in worker
    const { results: reqResults } = await dbProfiles.prepare(`
      SELECT * FROM pilot_connect_requests WHERE pilot_profile_id = ? ORDER BY created_at DESC
    `).bind(profile.id).all() as { results: Record<string, unknown>[] };

    const requests = reqResults || [];
    const airlineIds = Array.from(new Set(requests.map((r: Record<string, unknown>) => r.airline_id as string).filter(Boolean)));
    const airlinesMap: Record<string, Record<string, unknown>> = {};
    if (airlineIds.length > 0) {
      const placeholders = airlineIds.map(() => '?').join(',');
      const { results: airlineResults } = await dbOps.prepare(`
        SELECT id, name, slug, iata_code, logo FROM airlines WHERE id IN (${placeholders})
      `).bind(...airlineIds).all() as { results: Record<string, unknown>[] };
      for (const a of (airlineResults || [])) {
        airlinesMap[a.id as string] = a;
      }
    }

    const items = requests.map((r: Record<string, unknown>) => {
      const a = airlinesMap[r.airline_id as string] || {};
      return {
        ...r,
        airline_name: a.name || r.airline_name || null,
        airline_slug: a.slug || r.airline_slug || null,
        airline_iata_code: a.iata_code || r.airline_iata_code || null,
        airline_logo: a.logo || null,
      };
    });

    // Summary stats for notification bell
    const pendingCount = items.filter((r: Record<string, unknown>) => (r.status as string) === 'pending').length;
    const acceptedCount = items.filter((r: Record<string, unknown>) => (r.status as string) === 'accepted').length;

    return jsonResponse({
      pilot: { display_name: profile.display_name, slug },
      total_requests: items.length,
      pending_count: pendingCount,
      accepted_count: acceptedCount,
      requests: items,
    }, 200, origin);
  }

  // PUT /connect-requests/:id
  // Pilot accepts or declines a connect request from an airline
  if (path.match(/^\/connect-requests\/[^\/]+$/) && request.method === 'PUT') {
    const id = path.split('/')[2];

    let auth: JWTPayload;
    try {
      auth = await requirePilotAuth(request, env, dbProfiles);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: msg }, 403, origin);
    }

    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const status = body.status as string; // 'accepted' or 'declined'
    if (!status || !['accepted', 'declined'].includes(status)) {
      return jsonResponse({ error: 'Status must be "accepted" or "declined"' }, 400, origin);
    }

    // Verify the connect request belongs to this pilot
    const reqRecord = await dbProfiles.prepare('SELECT * FROM pilot_connect_requests WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!reqRecord) return jsonResponse({ error: 'Not found' }, 404, origin);

    const pilotProfile = await dbProfiles.prepare('SELECT id FROM pilot_profiles WHERE auth0_id = ?').bind(auth.sub).first() as Record<string, unknown> | null;
    if (!pilotProfile || reqRecord.pilot_profile_id !== pilotProfile.id) {
      return jsonResponse({ error: 'Forbidden: Not your connect request' }, 403, origin);
    }

    const now = new Date().toISOString();
    await dbProfiles.prepare(`
      UPDATE pilot_connect_requests
      SET status = ?, pilot_response = ?, updated_at = ?
      WHERE id = ?
    `).bind(status, body.pilot_response || null, now, id).run();

    const updated = await dbProfiles.prepare('SELECT * FROM pilot_connect_requests WHERE id = ?').bind(id).first() as Record<string, unknown>;

    const pilotResponse = body.pilot_response as string || '';
    const message = status === 'accepted'
      ? 'Connect request accepted. The airline can now view your full profile.'
      : pilotResponse
        ? `Connect request declined. Reason: "${pilotResponse}". The airline only sees your teaser profile.`
        : 'Connect request declined. The airline only sees your teaser profile.';

    return jsonResponse({
      message,
      pilot_response: pilotResponse || null,
      connect_request: updated,
    }, 200, origin);
  }

  return jsonResponse({ error: 'Not found' }, 404, origin);
}

async function handleEnterpriseRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || undefined;
  const path = url.pathname;
  const method = request.method;
  const db = env.DB_OPS;      // Default: operational DB
  const dbOps = env.DB_OPS;     // Explicit alias
  const dbRef = env.DB;         // Reference data
  const dbProfiles = env.DB_PROFILES;
  const dbTrace = env.DB_TRACE;
  const dbDocs = env.DB_DOCS;

  // All enterprise endpoints require auth
  let auth: JWTPayload;
  try {
    auth = await requireEnterpriseAuth(request, env, dbOps);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: msg }, msg.includes('Forbidden') ? 403 : 401, origin);
  }

  // Get the enterprise profile for scoping
  const enterprise = await db.prepare(
    'SELECT id, manufacturer_id, ato_id, trc_id, airline_id, pjc_id FROM enterprise_profiles WHERE auth0_id = ? AND status = ?'
  ).bind(auth.sub, 'active').first() as Record<string, unknown> | null;

  if (!enterprise) {
    return jsonResponse({ error: 'Enterprise profile not found' }, 403, origin);
  }

  const enterpriseId = enterprise.id as string;
  const claimedManufacturerId = enterprise.manufacturer_id as string | null;
  const claimedAtoId = enterprise.ato_id as string | null;
  const claimedTrcId = enterprise.trc_id as string | null;
  const claimedAirlineId = enterprise.airline_id as string | null;
  const claimedPjcId = enterprise.pjc_id as string | null;

  const body = await request.json().catch(() => ({})) as Record<string, unknown>;

  // PUT /manufacturers/:id
  if (method === 'PUT' && path.match(/^\/manufacturers\/[^\/]+$/)) {
    const id = path.split('/')[2];

    // Scope check: can only edit their own claimed manufacturer
    if (!claimedManufacturerId || claimedManufacturerId !== id) {
      return jsonResponse({ error: 'Forbidden: Can only edit your claimed manufacturer profile' }, 403, origin);
    }

    const allowed = ['name', 'logo', 'hero_image', 'description', 'why_choose_rating',
      'headquarters', 'website', 'training_centers', 'news_and_updates'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);

    sets.push('updated_by = ?');
    sets.push("updated_at = datetime('now')");
    values.push(enterpriseId);
    values.push(id);

    await dbRef.prepare(`UPDATE manufacturers SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();

    // Log the edit
    await dbRef.prepare(
      'INSERT INTO manufacturer_edits (id, table_name, record_id, action, old_values, new_values, changed_by, changed_by_enterprise_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), 'manufacturers', id, 'update', '{}', JSON.stringify(body), enterpriseId, enterpriseId).run();

    const updated = await getManufacturer(dbRef, id);
    return jsonResponse(updated, 200, origin);
  }

  // POST /manufacturers/:id/claim
  if (method === 'POST' && path.match(/^\/manufacturers\/[^\/]+\/claim$/)) {
    const id = path.split('/')[2];
    const mfr = await getManufacturer(dbRef, id);
    if (!mfr) return jsonResponse({ error: 'Not found' }, 404, origin);
    if (mfr.claimed_by) return jsonResponse({ error: 'Already claimed' }, 409, origin);

    const now = new Date().toISOString();
    await dbRef.prepare(
      'UPDATE manufacturers SET claimed_by = ?, verification_status = ?, claimed_at = ?, updated_by = ? WHERE id = ?'
    ).bind(enterpriseId, 'claimed', now, enterpriseId, id).run();

    // Link enterprise to manufacturer
    await dbOps.prepare(
      'UPDATE enterprise_profiles SET manufacturer_id = ? WHERE id = ?'
    ).bind(id, enterpriseId).run();

    const updated = await getManufacturer(dbRef, id);
    return jsonResponse(updated, 200, origin);
  }

  // PUT /aircraft/:id
  if (method === 'PUT' && path.match(/^\/aircraft\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const aircraft = await getAircraft(dbRef, id);
    if (!aircraft) return jsonResponse({ error: 'Not found' }, 404, origin);

    // Scope check: can only edit aircraft from their claimed manufacturer
    if (!claimedManufacturerId || aircraft.manufacturer_id !== claimedManufacturerId) {
      return jsonResponse({ error: 'Forbidden: Can only edit aircraft from your claimed manufacturer' }, 403, origin);
    }

    const allowed = ['model', 'category', 'subcategory', 'image', 'description',
      'why_choose_rating', 'demand_level', 'conditionally_new', 'lifecycle_stage',
      'order_backlog', 'operator_count', 'total_deliveries', 'steep_approach_certified',
      'engine_type', 'range_versatility', 'cabin_features', 'news', 'career_score',
      'pilot_count', 'first_flight', 'specifications', 'training_requirements',
      'training_curriculum', 'simulator_details', 'instructor_qualifications',
      'certification', 'success_stories', 'faq', 'career_info'];

    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);

    sets.push('updated_by = ?');
    sets.push("updated_at = datetime('now')");
    values.push(enterpriseId);
    values.push(id);

    await dbRef.prepare(`UPDATE aircraft_type_ratings SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();

    const updated = await getAircraft(dbRef, id);
    return jsonResponse(updated, 200, origin);
  }

  // POST /aircraft
  if (method === 'POST' && path === '/aircraft') {
    // Scope check: can only add aircraft for their claimed manufacturer
    const manufacturerId = body.manufacturer_id as string;
    if (!manufacturerId) return jsonResponse({ error: 'manufacturer_id required' }, 400, origin);
    if (!claimedManufacturerId || manufacturerId !== claimedManufacturerId) {
      return jsonResponse({ error: 'Forbidden: Can only add aircraft for your claimed manufacturer' }, 403, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await dbRef.prepare(`
      INSERT INTO aircraft_type_ratings (
        id, manufacturer_id, model, category, subcategory, image, description,
        why_choose_rating, demand_level, conditionally_new, lifecycle_stage,
        operator_count, total_deliveries, steep_approach_certified, engine_type,
        range_versatility, cabin_features, career_score, pilot_count, first_flight,
        specifications, training_requirements, training_curriculum, simulator_details,
        instructor_qualifications, certification, success_stories, faq, career_info,
        updated_by, updated_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, manufacturerId, body.model || '', body.category || 'commercial', body.subcategory || null,
      body.image || null, body.description || null, body.why_choose_rating || null,
      body.demand_level || 'medium', body.conditionally_new || null, body.lifecycle_stage || null,
      body.operator_count || 0, body.total_deliveries || 0, body.steep_approach_certified ? 1 : 0,
      body.engine_type || null, body.range_versatility || null,
      body.cabin_features ? JSON.stringify(body.cabin_features) : null,
      body.career_score || 0, body.pilot_count || 0, body.first_flight || null,
      body.specifications ? JSON.stringify(body.specifications) : null,
      body.training_requirements ? JSON.stringify(body.training_requirements) : null,
      body.training_curriculum ? JSON.stringify(body.training_curriculum) : null,
      body.simulator_details ? JSON.stringify(body.simulator_details) : null,
      body.instructor_qualifications ? JSON.stringify(body.instructor_qualifications) : null,
      body.certification ? JSON.stringify(body.certification) : null,
      body.success_stories ? JSON.stringify(body.success_stories) : null,
      body.faq ? JSON.stringify(body.faq) : null,
      body.career_info ? JSON.stringify(body.career_info) : null,
      enterpriseId, now, now
    ).run();

    const created = await getAircraft(dbRef, id);
    return jsonResponse(created, 201, origin);
  }

  // ── ATO Enterprise ──

  // POST /atos/:slug/claim
  if (method === 'POST' && path.match(/^\/atos\/[^\/]+\/claim$/)) {
    const slug = path.split('/')[2];
    const ato = await getAto(dbOps, slug);
    if (!ato) return jsonResponse({ error: 'Not found' }, 404, origin);
    if (ato.claimed_by) return jsonResponse({ error: 'Already claimed' }, 409, origin);

    const now = new Date().toISOString();
    await db.prepare(
      'UPDATE atos SET claimed_by = ?, verification_status = ?, claimed_at = ?, updated_by = ? WHERE slug = ?'
    ).bind(enterpriseId, 'claimed', now, enterpriseId, slug).run();

    // Link enterprise to ATO
    await db.prepare(
      'UPDATE enterprise_profiles SET ato_id = ? WHERE id = ?'
    ).bind(ato.id as string, enterpriseId).run();

    const updated = await getAto(dbOps, slug);
    return jsonResponse(updated, 200, origin);
  }

  // PUT /atos/:slug
  if (method === 'PUT' && path.match(/^\/atos\/[^\/]+$/)) {
    const slug = path.split('/')[2];
    const ato = await getAto(dbOps, slug);
    if (!ato) return jsonResponse({ error: 'Not found' }, 404, origin);

    // Scope check: can only edit their own claimed ATO
    if (!claimedAtoId || claimedAtoId !== ato.id) {
      return jsonResponse({ error: 'Forbidden: Can only edit your claimed ATO profile' }, 403, origin);
    }

    const allowed = ['name', 'legal_name', 'logo', 'hero_image', 'description', 'short_bio',
      'website', 'email', 'phone', 'address', 'postal_code', 'icao_designator',
      'regulatory_authority', 'license_number', 'certifications', 'accreditations',
      'commission_rate', 'social_media', 'insurance_required', 'insurance_included',
      'insurance_provider', 'insurance_coverage_details', 'fuel_surcharge_percent',
      'wet_rate', 'landing_fees_included'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);

    sets.push('updated_by = ?');
    sets.push("updated_at = datetime('now')");
    values.push(enterpriseId);
    values.push(slug);

    await db.prepare(`UPDATE atos SET ${sets.join(', ')} WHERE slug = ?`).bind(...values).run();

    const updated = await getAto(dbOps, slug);
    return jsonResponse(updated, 200, origin);
  }

  // POST /atos/:slug/programs
  if (method === 'POST' && path.match(/^\/atos\/[^\/]+\/programs$/)) {
    const slug = path.split('/')[2];
    const ato = await getAto(dbOps, slug);
    if (!ato) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAtoId || claimedAtoId !== ato.id) {
      return jsonResponse({ error: 'Forbidden: Can only add programs for your claimed ATO' }, 403, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO ato_programs (
        id, ato_id, name, description, program_type, aircraft_type_id, aircraft_model,
        duration_hours, duration_days, cost_usd, cost_local, currency,
        includes_accommodation, includes_meals, includes_transport, includes_visa_support,
        max_students_per_batch, batch_schedule, prerequisites,
        is_full_motion_sim, ftd_level, deposit_required, deposit_percent,
        cancellation_policy, reschedule_policy, requires_degree, fast_track,
        fast_track_duration_months, ground_school_hours, flight_training_hours,
        total_hours, min_age, medical_class_required, min_education,
        program_route, degree_awarded, degree_type, university_partner,
        total_program_cost_usd, total_program_cost_local,
        license_only_cost_usd, license_only_cost_local,
        degree_only_cost_usd, degree_only_cost_local,
        years_to_complete, intakes_per_year, next_intake_date, seats_available,
        application_deadline, is_degree_program, is_integrated,
        flight_hours_integrated, flight_hours_separate, degree_includes_license,
        license_includes_degree, explanation_for_parents, license_validity_warning,
        ato_certification_number,
        is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, ato.id as string, body.name || '', body.description || null, body.program_type || 'type_rating',
      body.aircraft_type_id || null, body.aircraft_model || null,
      body.duration_hours || null, body.duration_days || null,
      body.cost_usd || null, body.cost_local || null, body.currency || 'USD',
      body.includes_accommodation ? 1 : 0, body.includes_meals ? 1 : 0,
      body.includes_transport ? 1 : 0, body.includes_visa_support ? 1 : 0,
      body.max_students_per_batch || null, body.batch_schedule || null, body.prerequisites || null,
      body.is_full_motion_sim ? 1 : 0, body.ftd_level || null,
      body.deposit_required ? 1 : 0, body.deposit_percent || 0,
      body.cancellation_policy || null, body.reschedule_policy || null,
      body.requires_degree ? 1 : 0, body.fast_track ? 1 : 0,
      body.fast_track_duration_months || null, body.ground_school_hours || 0,
      body.flight_training_hours || 0, body.total_hours || 0,
      body.min_age || 17, body.medical_class_required || 'class_2', body.min_education || 'high_school',
      body.program_route || 'fast_track', body.degree_awarded || null, body.degree_type || null, body.university_partner || null,
      body.total_program_cost_usd || null, body.total_program_cost_local || null,
      body.license_only_cost_usd || null, body.license_only_cost_local || null,
      body.degree_only_cost_usd || null, body.degree_only_cost_local || null,
      body.years_to_complete || null, body.intakes_per_year || 2, body.next_intake_date || null,
      body.seats_available || null, body.application_deadline || null,
      body.is_degree_program ? 1 : 0, body.is_integrated ? 1 : 0,
      body.flight_hours_integrated ? 1 : 0, body.flight_hours_separate ? 1 : 0,
      body.degree_includes_license ? 1 : 0, body.license_includes_degree ? 1 : 0,
      body.explanation_for_parents || null, body.license_validity_warning || null,
      body.ato_certification_number || null,
      1, now, now
    ).run();

    const created = await db.prepare('SELECT * FROM ato_programs WHERE id = ?').bind(id).first();
    return jsonResponse(created, 201, origin);
  }

  // PUT /programs/:id
  if (method === 'PUT' && path.match(/^\/programs\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const program = await db.prepare('SELECT * FROM ato_programs WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!program) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAtoId || claimedAtoId !== program.ato_id) {
      return jsonResponse({ error: 'Forbidden: Can only edit programs from your claimed ATO' }, 403, origin);
    }

    const allowed = ['name', 'description', 'program_type', 'aircraft_type_id', 'aircraft_model',
      'duration_hours', 'duration_days', 'cost_usd', 'cost_local', 'currency',
      'includes_accommodation', 'includes_meals', 'includes_transport', 'includes_visa_support',
      'max_students_per_batch', 'batch_schedule', 'prerequisites',
      'is_full_motion_sim', 'ftd_level', 'deposit_required', 'deposit_percent',
      'cancellation_policy', 'reschedule_policy', 'requires_degree', 'fast_track',
      'fast_track_duration_months', 'ground_school_hours', 'flight_training_hours',
      'total_hours', 'min_age', 'medical_class_required', 'min_education',
      'program_route', 'degree_awarded', 'degree_type', 'university_partner',
      'total_program_cost_usd', 'total_program_cost_local',
      'license_only_cost_usd', 'license_only_cost_local',
      'degree_only_cost_usd', 'degree_only_cost_local',
      'years_to_complete', 'intakes_per_year', 'next_intake_date', 'seats_available',
      'application_deadline', 'is_degree_program', 'is_integrated',
      'flight_hours_integrated', 'flight_hours_separate', 'degree_includes_license',
      'license_includes_degree', 'explanation_for_parents', 'license_validity_warning',
      'ato_certification_number', 'is_active'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);

    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.prepare(`UPDATE ato_programs SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    const updated = await db.prepare('SELECT * FROM ato_programs WHERE id = ?').bind(id).first();
    return jsonResponse(updated, 200, origin);
  }

  // POST /atos/:slug/ratings
  if (method === 'POST' && path.match(/^\/atos\/[^\/]+\/ratings$/)) {
    const slug = path.split('/')[2];
    const ato = await getAto(dbOps, slug);
    if (!ato) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAtoId || claimedAtoId !== ato.id) {
      return jsonResponse({ error: 'Forbidden: Can only add ratings for your claimed ATO' }, 403, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO ato_ratings_offered (
        id, ato_id, rating_type, rating_category, full_name, description,
        minimum_hours, cost_usd, currency, aircraft_type_id, aircraft_model,
        prerequisite_ratings, includes_ground_school, includes_flight_training,
        includes_simulator_hours, simulator_hours_included, flight_hours_included,
        duration_days, is_active, requires_degree, fast_track_eligible,
        min_age, medical_class_required, min_education, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, ato.id as string, body.rating_type || '', body.rating_category || null,
      body.full_name || null, body.description || null, body.minimum_hours || null,
      body.cost_usd || null, body.currency || 'USD', body.aircraft_type_id || null,
      body.aircraft_model || null, body.prerequisite_ratings || null,
      body.includes_ground_school ? 1 : 0, body.includes_flight_training ? 1 : 0,
      body.includes_simulator_hours ? 1 : 0, body.simulator_hours_included || 0,
      body.flight_hours_included || 0, body.duration_days || null,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      body.requires_degree ? 1 : 0, body.fast_track_eligible ? 1 : 0,
      body.min_age || 17, body.medical_class_required || 'class_2', body.min_education || 'high_school',
      now, now
    ).run();

    const created = await db.prepare('SELECT * FROM ato_ratings_offered WHERE id = ?').bind(id).first();
    return jsonResponse(created, 201, origin);
  }

  // PUT /ratings/:id
  if (method === 'PUT' && path.match(/^\/ratings\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const rating = await db.prepare('SELECT * FROM ato_ratings_offered WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!rating) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAtoId || claimedAtoId !== rating.ato_id) {
      return jsonResponse({ error: 'Forbidden: Can only edit ratings from your claimed ATO' }, 403, origin);
    }

    const allowed = ['rating_type', 'rating_category', 'full_name', 'description',
      'minimum_hours', 'cost_usd', 'currency', 'aircraft_type_id', 'aircraft_model',
      'prerequisite_ratings', 'includes_ground_school', 'includes_flight_training',
      'includes_simulator_hours', 'simulator_hours_included', 'flight_hours_included',
      'duration_days', 'is_active', 'requires_degree', 'fast_track_eligible',
      'min_age', 'medical_class_required', 'min_education'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.prepare(`UPDATE ato_ratings_offered SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    const updated = await db.prepare('SELECT * FROM ato_ratings_offered WHERE id = ?').bind(id).first();
    return jsonResponse(updated, 200, origin);
  }

  // POST /atos/:slug/fleet
  if (method === 'POST' && path.match(/^\/atos\/[^\/]+\/fleet$/)) {
    const slug = path.split('/')[2];
    const ato = await getAto(dbOps, slug);
    if (!ato) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAtoId || claimedAtoId !== ato.id) {
      return jsonResponse({ error: 'Forbidden: Can only add fleet for your claimed ATO' }, 403, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO ato_fleet (
        id, ato_id, aircraft_type_id, tail_number, registration, manufacturer, model,
        variant, year_built, total_airframe_hours, engine_hours, avionics_package, image,
        is_simulator, simulator_level, ftd_level, is_full_motion, hourly_rate_usd,
        hourly_rate_local, currency, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, ato.id as string, body.aircraft_type_id || null, body.tail_number || null,
      body.registration || null, body.manufacturer || null, body.model || '',
      body.variant || null, body.year_built || null, body.total_airframe_hours || null,
      body.engine_hours || null, body.avionics_package || null, body.image || null,
      body.is_simulator ? 1 : 0, body.simulator_level || null, body.ftd_level || null,
      body.is_full_motion ? 1 : 0, body.hourly_rate_usd || null, body.hourly_rate_local || null,
      body.currency || 'USD', body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      now, now
    ).run();

    const created = await db.prepare('SELECT * FROM ato_fleet WHERE id = ?').bind(id).first();
    return jsonResponse(created, 201, origin);
  }

  // PUT /fleet/:id
  if (method === 'PUT' && path.match(/^\/fleet\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const aircraft = await db.prepare('SELECT * FROM ato_fleet WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!aircraft) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAtoId || claimedAtoId !== aircraft.ato_id) {
      return jsonResponse({ error: 'Forbidden: Can only edit fleet from your claimed ATO' }, 403, origin);
    }

    const allowed = ['aircraft_type_id', 'tail_number', 'registration', 'manufacturer', 'model',
      'variant', 'year_built', 'total_airframe_hours', 'engine_hours', 'avionics_package', 'image',
      'is_simulator', 'simulator_level', 'ftd_level', 'is_full_motion', 'hourly_rate_usd',
      'hourly_rate_local', 'currency', 'is_active'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.prepare(`UPDATE ato_fleet SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    const updated = await db.prepare('SELECT * FROM ato_fleet WHERE id = ?').bind(id).first();
    return jsonResponse(updated, 200, origin);
  }

  // POST /atos/:slug/instructors
  if (method === 'POST' && path.match(/^\/atos\/[^\/]+\/instructors$/)) {
    const slug = path.split('/')[2];
    const ato = await getAto(dbOps, slug);
    if (!ato) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAtoId || claimedAtoId !== ato.id) {
      return jsonResponse({ error: 'Forbidden: Can only add instructors for your claimed ATO' }, 403, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO ato_instructors (
        id, ato_id, name, title, bio, image, total_instructor_hours,
        total_flight_hours, ratings, specializations, languages,
        is_senior_instructor, is_check_airman, is_examiner,
        is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, ato.id as string, body.name || '', body.title || null, body.bio || null,
      body.image || null, body.total_instructor_hours || null, body.total_flight_hours || null,
      body.ratings || null, body.specializations || null, body.languages || null,
      body.is_senior_instructor ? 1 : 0, body.is_check_airman ? 1 : 0,
      body.is_examiner ? 1 : 0,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      now, now
    ).run();

    const created = await db.prepare('SELECT * FROM ato_instructors WHERE id = ?').bind(id).first();
    return jsonResponse(created, 201, origin);
  }

  // PUT /instructors/:id
  if (method === 'PUT' && path.match(/^\/instructors\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const instructor = await db.prepare('SELECT * FROM ato_instructors WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!instructor) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAtoId || claimedAtoId !== instructor.ato_id) {
      return jsonResponse({ error: 'Forbidden: Can only edit instructors from your claimed ATO' }, 403, origin);
    }

    const allowed = ['name', 'title', 'bio', 'image', 'total_instructor_hours',
      'total_flight_hours', 'ratings', 'specializations', 'languages',
      'is_senior_instructor', 'is_check_airman', 'is_examiner', 'is_active'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.prepare(`UPDATE ato_instructors SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    const updated = await db.prepare('SELECT * FROM ato_instructors WHERE id = ?').bind(id).first();
    return jsonResponse(updated, 200, origin);
  }

  // ── TRC Enterprise ──

  // POST /trcs/:slug/claim
  if (method === 'POST' && path.match(/^\/trcs\/[^\/]+\/claim$/)) {
    const slug = path.split('/')[2];
    const trc = await getTrc(dbOps, slug);
    if (!trc) return jsonResponse({ error: 'Not found' }, 404, origin);
    if (trc.claimed_by) return jsonResponse({ error: 'Already claimed' }, 409, origin);

    const now = new Date().toISOString();
    await db.prepare(
      'UPDATE type_rating_centers SET claimed_by = ?, verification_status = ?, claimed_at = ?, updated_by = ? WHERE slug = ?'
    ).bind(enterpriseId, 'claimed', now, enterpriseId, slug).run();

    // Link enterprise to TRC
    await db.prepare(
      'UPDATE enterprise_profiles SET trc_id = ? WHERE id = ?'
    ).bind(trc.id as string, enterpriseId).run();

    const updated = await getTrc(dbOps, slug);
    return jsonResponse(updated, 200, origin);
  }

  // PUT /trcs/:slug
  if (method === 'PUT' && path.match(/^\/trcs\/[^\/]+$/)) {
    const slug = path.split('/')[2];
    const trc = await getTrc(dbOps, slug);
    if (!trc) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedTrcId || claimedTrcId !== trc.id) {
      return jsonResponse({ error: 'Forbidden: Can only edit your claimed TRC profile' }, 403, origin);
    }

    const allowed = ['name', 'legal_name', 'logo', 'hero_image', 'description', 'short_bio',
      'website', 'email', 'phone', 'address', 'postal_code', 'regulatory_approval',
      'approvals', 'is_full_motion_only', 'commission_rate', 'social_media',
      'total_type_ratings_issued', 'yearly_output'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);

    sets.push('updated_by = ?');
    sets.push("updated_at = datetime('now')");
    values.push(enterpriseId);
    values.push(slug);

    await db.prepare(`UPDATE type_rating_centers SET ${sets.join(', ')} WHERE slug = ?`).bind(...values).run();

    const updated = await getTrc(dbOps, slug);
    return jsonResponse(updated, 200, origin);
  }

  // POST /trcs/:slug/ratings
  if (method === 'POST' && path.match(/^\/trcs\/[^\/]+\/ratings$/)) {
    const slug = path.split('/')[2];
    const trc = await getTrc(dbOps, slug);
    if (!trc) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedTrcId || claimedTrcId !== trc.id) {
      return jsonResponse({ error: 'Forbidden: Can only add ratings for your claimed TRC' }, 403, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO trc_type_ratings_offered (
        id, trc_id, aircraft_type_id, aircraft_model, manufacturer, course_name, description,
        duration_days, duration_hours, simulator_hours, ground_school_hours,
        cost_usd, cost_local, currency, deposit_required, deposit_percent,
        includes_accommodation, includes_meals, includes_transport, includes_visa_support,
        prerequisites, ftd_level, simulator_model, is_full_motion,
        batch_schedule, next_batch_date, seats_available, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, trc.id as string, body.aircraft_type_id || null, body.aircraft_model || '',
      body.manufacturer || null, body.course_name || null, body.description || null,
      body.duration_days || null, body.duration_hours || null, body.simulator_hours || null,
      body.ground_school_hours || null, body.cost_usd || null, body.cost_local || null,
      body.currency || 'USD', body.deposit_required ? 1 : 0, body.deposit_percent || 0,
      body.includes_accommodation ? 1 : 0, body.includes_meals ? 1 : 0,
      body.includes_transport ? 1 : 0, body.includes_visa_support ? 1 : 0,
      body.prerequisites || null, body.ftd_level || null, body.simulator_model || null,
      body.is_full_motion ? 1 : 0, body.batch_schedule || null, body.next_batch_date || null,
      body.seats_available || null, body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      now, now
    ).run();

    const created = await db.prepare('SELECT * FROM trc_type_ratings_offered WHERE id = ?').bind(id).first();
    return jsonResponse(created, 201, origin);
  }

  // PUT /trc-ratings/:id
  if (method === 'PUT' && path.match(/^\/trc-ratings\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const rating = await db.prepare('SELECT * FROM trc_type_ratings_offered WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!rating) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedTrcId || claimedTrcId !== rating.trc_id) {
      return jsonResponse({ error: 'Forbidden: Can only edit ratings from your claimed TRC' }, 403, origin);
    }

    const allowed = ['aircraft_type_id', 'aircraft_model', 'manufacturer', 'course_name', 'description',
      'duration_days', 'duration_hours', 'simulator_hours', 'ground_school_hours',
      'cost_usd', 'cost_local', 'currency', 'deposit_required', 'deposit_percent',
      'includes_accommodation', 'includes_meals', 'includes_transport', 'includes_visa_support',
      'prerequisites', 'ftd_level', 'simulator_model', 'is_full_motion',
      'batch_schedule', 'next_batch_date', 'seats_available', 'is_active'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.prepare(`UPDATE trc_type_ratings_offered SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    const updated = await db.prepare('SELECT * FROM trc_type_ratings_offered WHERE id = ?').bind(id).first();
    return jsonResponse(updated, 200, origin);
  }

  // POST /trcs/:slug/simulators
  if (method === 'POST' && path.match(/^\/trcs\/[^\/]+\/simulators$/)) {
    const slug = path.split('/')[2];
    const trc = await getTrc(dbOps, slug);
    if (!trc) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedTrcId || claimedTrcId !== trc.id) {
      return jsonResponse({ error: 'Forbidden: Can only add simulators for your claimed TRC' }, 403, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO trc_simulators (
        id, trc_id, aircraft_type_id, aircraft_model, simulator_model, manufacturer,
        ftd_level, is_full_motion, faa_approved, easa_approved, caap_approved,
        gcaa_approved, caac_approved, hourly_rate_usd, hourly_rate_local, currency,
        location, year_installed, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, trc.id as string, body.aircraft_type_id || null, body.aircraft_model || '',
      body.simulator_model || null, body.manufacturer || null, body.ftd_level || null,
      body.is_full_motion ? 1 : 0, body.faa_approved ? 1 : 0, body.easa_approved ? 1 : 0,
      body.caap_approved ? 1 : 0, body.gcaa_approved ? 1 : 0, body.caac_approved ? 1 : 0,
      body.hourly_rate_usd || null, body.hourly_rate_local || null, body.currency || 'USD',
      body.location || null, body.year_installed || null,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      now, now
    ).run();

    const created = await db.prepare('SELECT * FROM trc_simulators WHERE id = ?').bind(id).first();
    return jsonResponse(created, 201, origin);
  }

  // PUT /trc-simulators/:id
  if (method === 'PUT' && path.match(/^\/trc-simulators\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const simulator = await db.prepare('SELECT * FROM trc_simulators WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!simulator) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedTrcId || claimedTrcId !== simulator.trc_id) {
      return jsonResponse({ error: 'Forbidden: Can only edit simulators from your claimed TRC' }, 403, origin);
    }

    const allowed = ['aircraft_type_id', 'aircraft_model', 'simulator_model', 'manufacturer',
      'ftd_level', 'is_full_motion', 'faa_approved', 'easa_approved', 'caap_approved',
      'gcaa_approved', 'caac_approved', 'hourly_rate_usd', 'hourly_rate_local', 'currency',
      'location', 'year_installed', 'is_active'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.prepare(`UPDATE trc_simulators SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    const updated = await db.prepare('SELECT * FROM trc_simulators WHERE id = ?').bind(id).first();
    return jsonResponse(updated, 200, origin);
  }

  // POST /trcs/:slug/instructors
  if (method === 'POST' && path.match(/^\/trcs\/[^\/]+\/instructors$/)) {
    const slug = path.split('/')[2];
    const trc = await getTrc(dbOps, slug);
    if (!trc) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedTrcId || claimedTrcId !== trc.id) {
      return jsonResponse({ error: 'Forbidden: Can only add instructors for your claimed TRC' }, 403, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO trc_instructors (
        id, trc_id, name, title, bio, image, total_instructor_hours,
        total_type_rating_hours, type_ratings, specializations, languages,
        is_senior_instructor, is_check_airman, is_examiner, is_line_training_captain,
        is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, trc.id as string, body.name || '', body.title || null, body.bio || null,
      body.image || null, body.total_instructor_hours || null, body.total_type_rating_hours || null,
      body.type_ratings || null, body.specializations || null, body.languages || null,
      body.is_senior_instructor ? 1 : 0, body.is_check_airman ? 1 : 0,
      body.is_examiner ? 1 : 0, body.is_line_training_captain ? 1 : 0,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      now, now
    ).run();

    const created = await db.prepare('SELECT * FROM trc_instructors WHERE id = ?').bind(id).first();
    return jsonResponse(created, 201, origin);
  }

  // PUT /trc-instructors/:id
  if (method === 'PUT' && path.match(/^\/trc-instructors\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const instructor = await db.prepare('SELECT * FROM trc_instructors WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!instructor) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedTrcId || claimedTrcId !== instructor.trc_id) {
      return jsonResponse({ error: 'Forbidden: Can only edit instructors from your claimed TRC' }, 403, origin);
    }

    const allowed = ['name', 'title', 'bio', 'image', 'total_instructor_hours',
      'total_type_rating_hours', 'type_ratings', 'specializations', 'languages',
      'is_senior_instructor', 'is_check_airman', 'is_examiner', 'is_line_training_captain', 'is_active'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.prepare(`UPDATE trc_instructors SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    const updated = await db.prepare('SELECT * FROM trc_instructors WHERE id = ?').bind(id).first();
    return jsonResponse(updated, 200, origin);
  }

  // ── Airline Enterprise ──

  // POST /airlines/:slug/claim
  if (method === 'POST' && path.match(/^\/airlines\/[^\/]+\/claim$/)) {
    const slug = path.split('/')[2];
    const airline = await getAirline(dbOps, slug);
    if (!airline) return jsonResponse({ error: 'Not found' }, 404, origin);
    if (airline.claimed_by) return jsonResponse({ error: 'Already claimed' }, 409, origin);

    const now = new Date().toISOString();
    await db.prepare(
      'UPDATE airlines SET claimed_by = ?, verification_status = ?, claimed_at = ?, updated_by = ? WHERE slug = ?'
    ).bind(enterpriseId, 'claimed', now, enterpriseId, slug).run();

    await db.prepare(
      'UPDATE enterprise_profiles SET airline_id = ? WHERE id = ?'
    ).bind(airline.id as string, enterpriseId).run();

    const updated = await getAirline(dbOps, slug);
    return jsonResponse(updated, 200, origin);
  }

  // PUT /airlines/:slug
  if (method === 'PUT' && path.match(/^\/airlines\/[^\/]+$/)) {
    const slug = path.split('/')[2];
    const airline = await getAirline(dbOps, slug);
    if (!airline) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAirlineId || claimedAirlineId !== airline.id) {
      return jsonResponse({ error: 'Forbidden: Can only edit your claimed airline profile' }, 403, origin);
    }

    const allowed = ['name', 'logo', 'hero_image', 'description', 'short_bio',
      'website', 'email', 'phone', 'social_media', 'iata_code', 'icao_code', 'call_sign',
      'country', 'headquarters', 'hub_airports', 'fleet_size', 'destinations_count',
      'pilot_count', 'yearly_hires', 'is_hiring', 'hiring_url', 'average_new_hire_hours',
      'minimum_requirements', 'salary_first_year_usd', 'salary_captain_usd', 'benefits',
      'recognition_score_required', 'partner_atos', 'partner_trcs',
      'is_low_cost_carrier', 'is_legacy_carrier', 'is_cargo', 'is_regional', 'is_charter',
      'about_airline', 'expectations', 'future_fleet', 'aptitude_test_url',
      'aptitude_test_description', 'verified_pilots_only',
      'airline_mission', 'message_to_graduates', 'message_to_instructors',
      'message_to_stuck_instructors', 'stuck_instructor_definition', 'stuck_instructor_support',
      'message_to_captains', 'pilot_development_philosophy', 'partnership_support',
      'values_ebt_cbta_programs', 'values_mentorship_program', 'prefers_program_experience', 'prefers_industry_pre_accessed',
      'ebt_cbta_description', 'mentorship_description',
      'why_choose_us', 'pilot_alignment_statement', 'unique_value_proposition', 'comparison_context',
      'citizenship_policy', 'experience_level_preference', 'airline_culture', 'diversity_statement',
      'type_rating_policy', 'training_pathway_for_non_type_rated', 'values_instructor_experience',
      'instructor_transition_program', 'pipeline_priority_for_stuck_pilots', 'stuck_pilot_support_description',
      'operations_focus', 'starter_aircraft_policy', 'regional_pathway_description',
      'industry_alignment_statement', 'low_hour_regional_message'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);

    sets.push('updated_by = ?');
    sets.push("updated_at = datetime('now')");
    values.push(enterpriseId);
    values.push(slug);

    await db.prepare(`UPDATE airlines SET ${sets.join(', ')} WHERE slug = ?`).bind(...values).run();
    const updated = await getAirline(dbOps, slug);
    return jsonResponse(updated, 200, origin);
  }

  // POST /airlines/:slug/cadet-programs
  if (method === 'POST' && path.match(/^\/airlines\/[^\/]+\/cadet-programs$/)) {
    const slug = path.split('/')[2];
    const airline = await getAirline(dbOps, slug);
    if (!airline) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAirlineId || claimedAirlineId !== airline.id) {
      return jsonResponse({ error: 'Forbidden: Can only add cadet programs for your claimed airline' }, 403, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO airline_cadet_programs (
        id, airline_id, program_name, description, partner_ato_id, partner_ato_name,
        duration_months, cost_to_pilot_usd, cost_to_pilot_local, currency,
        salary_during_training_usd, bond_years, bond_amount_usd,
        aircraft_type_id, aircraft_model, requirements, min_age, min_education,
        requires_degree, medical_class_required, min_flight_hours,
        next_intake_date, application_deadline, seats_available, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, airline.id as string, body.program_name || '', body.description || null,
      body.partner_ato_id || null, body.partner_ato_name || null,
      body.duration_months || null, body.cost_to_pilot_usd || null,
      body.cost_to_pilot_local || null, body.currency || 'USD',
      body.salary_during_training_usd || null, body.bond_years || 0,
      body.bond_amount_usd || null, body.aircraft_type_id || null,
      body.aircraft_model || null, body.requirements || null,
      body.min_age || 17, body.min_education || 'high_school',
      body.requires_degree ? 1 : 0, body.medical_class_required || 'class_1',
      body.min_flight_hours || null, body.next_intake_date || null,
      body.application_deadline || null, body.seats_available || null,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      now, now
    ).run();

    const created = await db.prepare('SELECT * FROM airline_cadet_programs WHERE id = ?').bind(id).first();
    return jsonResponse(created, 201, origin);
  }

  // PUT /cadet-programs/:id
  if (method === 'PUT' && path.match(/^\/cadet-programs\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const program = await db.prepare('SELECT * FROM airline_cadet_programs WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!program) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAirlineId || claimedAirlineId !== program.airline_id) {
      return jsonResponse({ error: 'Forbidden: Can only edit cadet programs from your claimed airline' }, 403, origin);
    }

    const allowed = ['program_name', 'description', 'partner_ato_id', 'partner_ato_name',
      'duration_months', 'cost_to_pilot_usd', 'cost_to_pilot_local', 'currency',
      'salary_during_training_usd', 'bond_years', 'bond_amount_usd',
      'aircraft_type_id', 'aircraft_model', 'requirements', 'min_age', 'min_education',
      'requires_degree', 'medical_class_required', 'min_flight_hours',
      'next_intake_date', 'application_deadline', 'seats_available', 'is_active'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.prepare(`UPDATE airline_cadet_programs SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    const updated = await db.prepare('SELECT * FROM airline_cadet_programs WHERE id = ?').bind(id).first();
    return jsonResponse(updated, 200, origin);
  }

  // POST /airlines/:slug/fleet
  if (method === 'POST' && path.match(/^\/airlines\/[^\/]+\/fleet$/)) {
    const slug = path.split('/')[2];
    const airline = await getAirline(dbOps, slug);
    if (!airline) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAirlineId || claimedAirlineId !== airline.id) {
      return jsonResponse({ error: 'Forbidden: Can only add fleet for your claimed airline' }, 403, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO airline_fleet (
        id, airline_id, aircraft_type_id, aircraft_model, manufacturer,
        in_service, on_order, average_age_years, seat_configuration, route_types, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, airline.id as string, body.aircraft_type_id || null, body.aircraft_model || '',
      body.manufacturer || null, body.in_service || 0, body.on_order || 0,
      body.average_age_years || null, body.seat_configuration || null,
      body.route_types || null, body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      now, now
    ).run();

    const created = await db.prepare('SELECT * FROM airline_fleet WHERE id = ?').bind(id).first();
    return jsonResponse(created, 201, origin);
  }

  // PUT /airline-fleet/:id
  if (method === 'PUT' && path.match(/^\/airline-fleet\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const fleet = await db.prepare('SELECT * FROM airline_fleet WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!fleet) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAirlineId || claimedAirlineId !== fleet.airline_id) {
      return jsonResponse({ error: 'Forbidden: Can only edit fleet from your claimed airline' }, 403, origin);
    }

    const allowed = ['aircraft_type_id', 'aircraft_model', 'manufacturer',
      'in_service', 'on_order', 'average_age_years', 'seat_configuration', 'route_types', 'is_active'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.prepare(`UPDATE airline_fleet SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    const updated = await db.prepare('SELECT * FROM airline_fleet WHERE id = ?').bind(id).first();
    return jsonResponse(updated, 200, origin);
  }

  // POST /airlines/:slug/pathways
  if (method === 'POST' && path.match(/^\/airlines\/[^\/]+\/pathways$/)) {
    const slug = path.split('/')[2];
    const airline = await getAirline(dbOps, slug);
    if (!airline) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAirlineId || claimedAirlineId !== airline.id) {
      return jsonResponse({ error: 'Forbidden: Can only add pathways for your claimed airline' }, 403, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO airline_pathways (
        id, airline_id, title, description, pathway_type,
        min_total_hours, min_pic_hours, min_pic_on_jet_hours, min_multi_engine_hours,
        min_night_hours, min_instrument_hours, min_cross_country_hours,
        required_ratings, required_type_ratings, required_english_level, required_medical_class,
        min_age, max_age, education_requirement, requires_degree,
        citizenship_requirement, visa_sponsorship_available,
        assessment_stages, estimated_timeline_months, success_rate_percent, competitiveness_score,
        estimated_cost_to_pilot_usd, bond_years, bond_amount_usd, salary_first_year_usd,
        training_location, aircraft_type_id, aircraft_model, partner_ato_id, partner_trc_id,
        next_intake_date, application_url,
        about_airline, airline_expectations, future_fleet, aptitude_test_url, aptitude_test_description, verified_pilots_only,
        target_pilot_persona, message_to_low_time_pilots, message_to_instructors, message_to_stuck_instructors, stuck_instructor_definition, stuck_instructor_support, message_to_transition_pilots,
        career_progression_overview, support_programs, airline_values, industry_alignment,
        values_ebt_cbta_programs, values_mentorship_program, prefers_program_experience, prefers_industry_pre_accessed,
        ebt_cbta_description, mentorship_description,
        why_choose_us, pilot_alignment_statement, unique_value_proposition, comparison_context,
        citizenship_policy, experience_level_preference, airline_culture, diversity_statement,
        type_rating_policy, training_pathway_for_non_type_rated, values_instructor_experience,
        instructor_transition_program, pipeline_priority_for_stuck_pilots, stuck_pilot_support_description,
        operations_focus, starter_aircraft_policy, regional_pathway_description,
        industry_alignment_statement, low_hour_regional_message,
        is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, airline.id as string, body.title || '', body.description || null,
      body.pathway_type || 'direct_entry',
      body.min_total_hours || null, body.min_pic_hours || null, body.min_pic_on_jet_hours || null,
      body.min_multi_engine_hours || null, body.min_night_hours || null,
      body.min_instrument_hours || null, body.min_cross_country_hours || null,
      body.required_ratings || null, body.required_type_ratings || null,
      body.required_english_level || null, body.required_medical_class || null,
      body.min_age || null, body.max_age || null, body.education_requirement || null,
      body.requires_degree ? 1 : 0, body.citizenship_requirement || null,
      body.visa_sponsorship_available ? 1 : 0,
      body.assessment_stages ? JSON.stringify(body.assessment_stages) : null,
      body.estimated_timeline_months || null, body.success_rate_percent || null,
      body.competitiveness_score || 'moderate', body.estimated_cost_to_pilot_usd || null,
      body.bond_years || 0, body.bond_amount_usd || null, body.salary_first_year_usd || null,
      body.training_location || null, body.aircraft_type_id || null, body.aircraft_model || null,
      body.partner_ato_id || null, body.partner_trc_id || null,
      body.next_intake_date || null, body.application_url || null,
      body.about_airline || null, body.airline_expectations || null, body.future_fleet || null,
      body.aptitude_test_url || null, body.aptitude_test_description || null,
      body.verified_pilots_only ? 1 : 0,
      body.target_pilot_persona || null, body.message_to_low_time_pilots || null,
      body.message_to_instructors || null, body.message_to_stuck_instructors || null, body.stuck_instructor_definition || null, body.stuck_instructor_support || null, body.message_to_transition_pilots || null,
      body.career_progression_overview || null, body.support_programs || null,
      body.airline_values || null, body.industry_alignment || null,
      body.values_ebt_cbta_programs ? 1 : 0, body.values_mentorship_program ? 1 : 0,
      body.prefers_program_experience ? 1 : 0, body.prefers_industry_pre_accessed ? 1 : 0,
      body.ebt_cbta_description || null, body.mentorship_description || null,
      body.why_choose_us || null, body.pilot_alignment_statement || null,
      body.unique_value_proposition || null, body.comparison_context || null,
      body.citizenship_policy || null, body.experience_level_preference || null,
      body.airline_culture || null, body.diversity_statement || null,
      body.type_rating_policy || 'required', body.training_pathway_for_non_type_rated || null,
      body.values_instructor_experience ? 1 : 0, body.instructor_transition_program ? 1 : 0,
      body.pipeline_priority_for_stuck_pilots ? 1 : 0, body.stuck_pilot_support_description || null,
      body.operations_focus || null, body.starter_aircraft_policy ? 1 : 0,
      body.regional_pathway_description || null, body.industry_alignment_statement || null,
      body.low_hour_regional_message || null,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      now, now
    ).run();

    const created = await db.prepare('SELECT * FROM airline_pathways WHERE id = ?').bind(id).first();
    return jsonResponse(created, 201, origin);
  }

  // PUT /airline-pathways/:id
  if (method === 'PUT' && path.match(/^\/airline-pathways\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const pathway = await db.prepare('SELECT * FROM airline_pathways WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!pathway) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAirlineId || claimedAirlineId !== pathway.airline_id) {
      return jsonResponse({ error: 'Forbidden: Can only edit pathways from your claimed airline' }, 403, origin);
    }

    const allowed = ['title', 'description', 'pathway_type',
      'min_total_hours', 'min_pic_hours', 'min_pic_on_jet_hours', 'min_multi_engine_hours',
      'min_night_hours', 'min_instrument_hours', 'min_cross_country_hours',
      'required_ratings', 'required_type_ratings', 'required_english_level', 'required_medical_class',
      'min_age', 'max_age', 'education_requirement', 'requires_degree',
      'citizenship_requirement', 'visa_sponsorship_available',
      'assessment_stages', 'estimated_timeline_months', 'success_rate_percent', 'competitiveness_score',
      'estimated_cost_to_pilot_usd', 'bond_years', 'bond_amount_usd', 'salary_first_year_usd',
      'training_location', 'aircraft_type_id', 'aircraft_model', 'partner_ato_id', 'partner_trc_id',
      'next_intake_date', 'application_url',
      'about_airline', 'airline_expectations', 'future_fleet', 'aptitude_test_url', 'aptitude_test_description', 'verified_pilots_only',
      'target_pilot_persona', 'message_to_low_time_pilots', 'message_to_instructors', 'message_to_stuck_instructors', 'stuck_instructor_definition', 'stuck_instructor_support', 'message_to_transition_pilots',
      'career_progression_overview', 'support_programs', 'airline_values', 'industry_alignment',
      'values_ebt_cbta_programs', 'values_mentorship_program', 'prefers_program_experience', 'prefers_industry_pre_accessed',
      'ebt_cbta_description', 'mentorship_description',
      'why_choose_us', 'pilot_alignment_statement', 'unique_value_proposition', 'comparison_context',
      'citizenship_policy', 'experience_level_preference', 'airline_culture', 'diversity_statement',
      'type_rating_policy', 'training_pathway_for_non_type_rated', 'values_instructor_experience',
      'instructor_transition_program', 'pipeline_priority_for_stuck_pilots', 'stuck_pilot_support_description',
      'operations_focus', 'starter_aircraft_policy', 'regional_pathway_description',
      'industry_alignment_statement', 'low_hour_regional_message',
      'is_active'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        if (key === 'assessment_stages' && Array.isArray(body[key])) {
          sets.push(`${key} = ?`);
          values.push(JSON.stringify(body[key]));
        } else {
          sets.push(`${key} = ?`);
          values.push(body[key]);
        }
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.prepare(`UPDATE airline_pathways SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    const updated = await db.prepare('SELECT * FROM airline_pathways WHERE id = ?').bind(id).first();
    return jsonResponse(updated, 200, origin);
  }

  // GET /airlines/:slug/candidate-pool
  // Enterprise only — airline views pilots who submitted interest (the pool)
  if (method === 'GET' && path.match(/^\/airlines\/[^\/]+\/candidate-pool$/)) {
    const slug = path.split('/')[2];
    const airline = await getAirline(dbOps, slug);
    if (!airline) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAirlineId || claimedAirlineId !== airline.id) {
      return jsonResponse({ error: 'Forbidden: Can only view candidate pool for your claimed airline' }, 403, origin);
    }

    const statusFilter = url.searchParams.get('status');
    const verifiedOnly = url.searchParams.get('verified_only') === '1';
    const maxRisk = url.searchParams.get('max_risk_ratio');
    const minMatch = url.searchParams.get('min_match_percent');
    let sql = 'SELECT * FROM pilot_pathway_pool WHERE airline_id = ?';
    const binds: unknown[] = [airline.id];

    if (statusFilter) {
      sql += ' AND status = ?';
      binds.push(statusFilter);
    }
    if (verifiedOnly) {
      sql += ' AND is_verified = 1';
    }
    if (maxRisk) {
      sql += ' AND risk_ratio <= ?';
      binds.push(Number(maxRisk));
    }
    if (minMatch) {
      sql += ' AND percent_match >= ?';
      binds.push(Number(minMatch));
    }
    sql += ' ORDER BY percent_match DESC, risk_ratio ASC, created_at DESC';

    const { results } = await db.prepare(sql).bind(...binds).all();
    const poolItems = (results || []) as Record<string, unknown>[];

    // Enrich each pool entry with pilot profile teaser
    const enriched = await Promise.all(poolItems.map(async (item) => {
      const pilotProfileId = item.pilot_profile_id as string || item.pilot_id as string || null;
      let pilotTeaser: Record<string, unknown> | null = null;
      if (pilotProfileId) {
        const raw = await dbProfiles.prepare('SELECT * FROM pilot_profiles WHERE id = ? OR public_slug = ?').bind(pilotProfileId, pilotProfileId).first() as Record<string, unknown> | null;
        if (raw) pilotTeaser = buildPilotProfileTeaser(raw);
      }
      return {
        ...item,
        pilot_teaser: pilotTeaser,
        // Notification bell data — what makes this pilot stand out in the pool
        notification_flags: {
          is_verified: (item.is_verified as number || 0) === 1,
          is_background_checked: (item.is_background_checked as number || 0) === 1,
          is_recommended: pilotTeaser ? (pilotTeaser.is_recommended as boolean || false) : false,
          profile_value_tier: pilotTeaser ? (pilotTeaser.profile_value_tier as string || 'standard') : 'standard',
          insurance_risk_score: pilotTeaser ? (pilotTeaser.insurance_risk_score as string || 'unknown') : 'unknown',
        },
      };
    }));

    return jsonResponse({
      airline: { name: airline.name, slug: airline.slug, iata_code: airline.iata_code },
      total: enriched.length,
      filters_applied: {
        status: statusFilter,
        verified_only: verifiedOnly,
        max_risk_ratio: maxRisk ? Number(maxRisk) : null,
        min_match_percent: minMatch ? Number(minMatch) : null,
      },
      pilots: enriched,
      // Pool curation stats
      curation: {
        verified_count: enriched.filter((p: Record<string, unknown>) => (p.is_verified as number || 0) === 1).length,
        background_checked_count: enriched.filter((p: Record<string, unknown>) => (p.is_background_checked as number || 0) === 1).length,
        recommended_count: enriched.filter((p: Record<string, unknown>) => ((p.pilot_teaser as Record<string, unknown> || {}).is_recommended as boolean || false)).length,
        high_value_count: enriched.filter((p: Record<string, unknown>) => (((p.pilot_teaser as Record<string, unknown> || {}).profile_value_tier as string || '') === 'high_value' || ((p.pilot_teaser as Record<string, unknown> || {}).profile_value_tier as string || '') === 'elite')).length,
      },
    }, 200, origin);
  }

  // PUT /pool-entry/:id
  // Enterprise — airline updates status of a pool entry (submitted, shortlisted, contacted, rejected, advanced)
  if (method === 'PUT' && path.match(/^\/pool-entry\/[^\/]+$/)) {
    const id = path.split('/')[2];
    const entry = await dbProfiles.prepare('SELECT * FROM pilot_pathway_pool WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!entry) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedAirlineId || claimedAirlineId !== entry.airline_id) {
      return jsonResponse({ error: 'Forbidden' }, 403, origin);
    }

    const allowed = ['status', 'airline_notes'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await dbProfiles.prepare(`UPDATE pilot_pathway_pool SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    const updated = await dbProfiles.prepare('SELECT * FROM pilot_pathway_pool WHERE id = ?').bind(id).first();
    return jsonResponse(updated, 200, origin);
  }

  // POST /pilots/profile-card
  // Public — auto-generates pilot profile card from profile snapshot
  // Airlines see system-generated pilot story, not custom airline essays
  if (method === 'POST' && path === '/pilots/profile-card') {
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;

    const pilotProfile: PilotProfile = {
      total_hours: Number(body.total_hours) || 0,
      pic_hours: Number(body.pic_hours) || 0,
      pic_on_jet_hours: Number(body.pic_on_jet_hours) || 0,
      multi_engine_hours: Number(body.multi_engine_hours) || 0,
      instrument_hours: Number(body.instrument_hours) || 0,
      ratings: (body.ratings as string[] || []),
      years_applying: Number(body.years_applying) || 0,
      years_experience: Number(body.years_experience) || 0,
      current_role: body.current_role as string || '',
      is_verified: body.is_verified === true,
      is_background_checked: body.is_background_checked === true,
      has_degree: body.has_degree === true,
      english_level: body.english_level as string || '',
      medical_class: body.medical_class as string || '',
      age: Number(body.age) || 0,
      type_ratings_held: (body.type_ratings as string[] || []),
      last_operator: body.last_operator as string || '',
      total_landings: Number(body.total_landings) || 0,
      jet_hours: Number(body.pic_on_jet_hours) || 0,
    };

    const personaResult = detectPilotPersona(pilotProfile);
    const pilotSummary = generatePilotProfileSummary(pilotProfile, personaResult.persona);
    const blockerAnalysis = generatePilotBlockerAnalysis(pilotProfile, personaResult.persona);

    return jsonResponse({
      pilot_profile_card: {
        summary: pilotSummary,
        persona: personaResult.persona,
        persona_confidence: personaResult.confidence,
        persona_flags: personaResult.flags,
        blocker_analysis: blockerAnalysis,
        raw_profile: pilotProfile,
      },
      message: "This profile card is auto-generated from the pilot's data. Airlines see the pilot's story, not custom essays.",
    }, 200, origin);
  }

  // GET /pilots/:slug/full
  // Enterprise — airline views FULL pilot profile (non-teaser)
  // Allowed if: (1) pilot has submitted interest to one of airline's pathways, OR (2) pilot accepted a connect request from this airline
  if (method === 'GET' && path.match(/^\/pilots\/[^\/]+\/full$/)) {
    const slug = path.split('/')[2];

    // Auth required
    let auth: JWTPayload;
    try {
      auth = await requireEnterpriseAuth(request, env, dbOps);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: msg }, 403, origin);
    }

    // Get enterprise profile to find airline
    const enterprise = await db.prepare(
      'SELECT id, airline_id FROM enterprise_profiles WHERE auth0_id = ? AND status = ?'
    ).bind(auth.sub, 'active').first() as Record<string, unknown> | null;

    const airlineId = enterprise?.airline_id as string | undefined;
    if (!airlineId) {
      return jsonResponse({ error: 'Forbidden: Airline access required' }, 403, origin);
    }

    // Fetch pilot profile
    const raw = await dbProfiles.prepare('SELECT * FROM pilot_profiles WHERE public_slug = ? AND is_active = 1').bind(slug).first() as Record<string, unknown> | null;
    if (!raw) return jsonResponse({ error: 'Not found' }, 404, origin);

    const pilotProfileId = raw.id as string;

    // Check pathway interest
    const interestCheck = await dbProfiles.prepare(
      'SELECT id FROM pilot_pathway_pool WHERE pilot_profile_id = ? AND airline_id = ? LIMIT 1'
    ).bind(pilotProfileId, airlineId).first() as Record<string, unknown> | null;

    // Check accepted connect request
    const connectCheck = await dbProfiles.prepare(
      'SELECT id FROM pilot_connect_requests WHERE pilot_profile_id = ? AND airline_id = ? AND status = ? LIMIT 1'
    ).bind(pilotProfileId, airlineId, 'accepted').first() as Record<string, unknown> | null;

    if (!interestCheck && !connectCheck) {
      return jsonResponse({
        error: 'Access denied',
        message: 'Full profile is only available when the pilot has accepted a connect request or submitted interest to one of your pathways. Send a connect request to unlock the full profile.',
        _teaser_available_at: `/pilots/${slug}`,
        _connect_request_endpoint: `POST /pilots/${slug}/connect-request`,
      }, 403, origin);
    }

    // Fetch authoritative credentials from trace DB for full profile
    const [licenseRow, medicalRow, hoursRow] = await Promise.all([
      dbTrace.prepare('SELECT license_number, license_type, issuing_authority FROM pilot_licenses WHERE pilot_profile_id = ? ORDER BY created_at DESC LIMIT 1').bind(pilotProfileId).first().catch(() => null) as Promise<Record<string, unknown> | null>,
      dbTrace.prepare('SELECT medical_class, expiry_date FROM pilot_medicals WHERE pilot_profile_id = ? ORDER BY created_at DESC LIMIT 1').bind(pilotProfileId).first().catch(() => null) as Promise<Record<string, unknown> | null>,
      dbTrace.prepare('SELECT total_hours, pic_hours FROM pilot_flight_hours WHERE pilot_profile_id = ? ORDER BY created_at DESC LIMIT 1').bind(pilotProfileId).first().catch(() => null) as Promise<Record<string, unknown> | null>,
    ]);
    if (licenseRow) { raw.license_number = licenseRow.license_number; raw.license_type = licenseRow.license_type; raw.issuing_authority = licenseRow.issuing_authority; }
    if (medicalRow) { raw.medical_expiry = medicalRow.expiry_date; raw.medical_class = medicalRow.medical_class; }
    if (hoursRow) { raw.total_hours = hoursRow.total_hours; raw.pic_hours = hoursRow.pic_hours; }

    const full = buildPilotProfileFull(raw);

    return jsonResponse({
      ...full,
      _access_level: 'full',
      _access_reason: interestCheck
        ? 'Pilot submitted interest to a pathway for this airline.'
        : 'Pilot accepted a connect request from this airline.',
    }, 200, origin);
  }

  // POST /pilots/:slug/connect-request
  // Enterprise — airline sends a connect request to a pilot to unlock full profile
  if (method === 'POST' && path.match(/^\/pilots\/[^\/]+\/connect-request$/)) {
    const slug = path.split('/')[2];

    let auth: JWTPayload;
    try {
      auth = await requireEnterpriseAuth(request, env, dbOps);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: msg }, 403, origin);
    }

    // Get enterprise profile to find airline
    const enterprise = await db.prepare(
      'SELECT id, airline_id FROM enterprise_profiles WHERE auth0_id = ? AND status = ?'
    ).bind(auth.sub, 'active').first() as Record<string, unknown> | null;

    const airlineId = enterprise?.airline_id as string | undefined;
    if (!airlineId) {
      return jsonResponse({ error: 'Forbidden: Airline access required' }, 403, origin);
    }

    const airline = await db.prepare('SELECT * FROM airlines WHERE id = ?').bind(airlineId).first() as Record<string, unknown> | null;
    if (!airline) return jsonResponse({ error: 'Airline not found' }, 404, origin);

    // Fetch pilot profile
    const raw = await dbProfiles.prepare('SELECT * FROM pilot_profiles WHERE public_slug = ? AND is_active = 1').bind(slug).first() as Record<string, unknown> | null;
    if (!raw) return jsonResponse({ error: 'Not found' }, 404, origin);

    const pilotProfileId = raw.id as string;
    const pilotId = raw.auth0_id as string || raw.supabase_user_id as string;

    // Check if a pending or accepted request already exists
    const existing = await dbProfiles.prepare(
      'SELECT id, status FROM pilot_connect_requests WHERE pilot_profile_id = ? AND airline_id = ? AND status IN (?, ?) LIMIT 1'
    ).bind(pilotProfileId, airlineId, 'pending', 'accepted').first() as Record<string, unknown> | null;

    if (existing) {
      const existingStatus = existing.status as string;
      if (existingStatus === 'accepted') {
        return jsonResponse({ error: 'Already connected', message: 'This pilot has already accepted a connect request from your airline.' }, 409, origin);
      }
      return jsonResponse({ error: 'Pending request exists', message: 'A connect request to this pilot is already pending.', request_id: existing.id }, 409, origin);
    }

    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 14 days

    await dbProfiles.prepare(`
      INSERT INTO pilot_connect_requests (
        id, pilot_profile_id, pilot_id, airline_id, airline_name, airline_slug, airline_iata_code,
        message, status, expires_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, pilotProfileId, pilotId, airlineId, airline.name, airline.slug, airline.iata_code,
      body.message || null, 'pending', expiresAt, now, now
    ).run();

    const created = await dbProfiles.prepare('SELECT * FROM pilot_connect_requests WHERE id = ?').bind(id).first() as Record<string, unknown>;

    return jsonResponse({
      message: `Connect request sent to ${raw.display_name || slug}. The pilot will be notified that ${airline.name} has viewed their profile and is interested to connect regarding pathway opportunities, cadet programs, or internship experience. The pilot can accept or decline. Full profile will be unlocked upon acceptance.`,
      connect_request: created,
      // Notification payload (for email/notification service)
      notification: {
        recipient: raw.display_name || slug,
        recipient_email: raw.email,
        sender: airline.name,
        sender_iata: airline.iata_code,
        message: body.message || `${airline.name} has viewed your profile within the PilotRecognition database and is interested to connect with you regarding pathway opportunities, cadet programs, and internship experience.`,
        action_url: `/pilots/${slug}/connect-requests`,
        expires_at: expiresAt,
      },
    }, 201, origin);
  }

  // POST /pilots/:slug/sync
  // Enterprise — sync or update a pilot profile from Supabase to D1
  if (method === 'POST' && path.match(/^\/pilots\/[^\/]+\/sync$/)) {
    const slug = path.split('/')[2];

    let auth: JWTPayload;
    try {
      auth = await requireEnterpriseAuth(request, env, dbOps);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: msg }, 403, origin);
    }

    const body = await request.json().catch(() => ({})) as Record<string, unknown>;

    // Upsert pilot profile
    const id = body.id as string || crypto.randomUUID();
    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO pilot_profiles (
        id, auth0_id, public_slug, display_name, teaser_headline, teaser_summary,
        avatar_url, country, base_location, total_hours, pic_hours, type_ratings, current_role,
        last_operator, years_experience, verification_status, is_verified, is_background_checked,
        is_claimed, claimed_by, insurance_risk_score, profile_value_tier, diversity_tags,
        is_recommended, recommendation_reason, bio_story_teaser, bio_story_full, career_narrative,
        training_background, instructor_background, operational_experience, achievements, goals,
        full_ratings, full_type_ratings, medical_expiry, english_level, license_number,
        email, phone, linkedin_url, portfolio_url, ebt_video_url,
        is_pilot_shortage_member, pilot_shortage_testimonial, pilot_shortage_verified, pilot_shortage_status,
        pilot_shortage_verification_stages, pilot_shortage_verified_by, pilot_shortage_verified_at,
        pilot_shortage_verification_notes, pilot_shortage_submitted_at, pilot_shortage_anonymous,
        career_shift_reason, career_shift_to, pilot_shortage_investment_usd, pilot_shortage_support_request,
        last_synced_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(auth0_id) DO UPDATE SET
        public_slug = excluded.public_slug,
        display_name = excluded.display_name,
        teaser_headline = excluded.teaser_headline,
        teaser_summary = excluded.teaser_summary,
        avatar_url = excluded.avatar_url,
        country = excluded.country,
        base_location = excluded.base_location,
        total_hours = excluded.total_hours,
        pic_hours = excluded.pic_hours,
        type_ratings = excluded.type_ratings,
        current_role = excluded.current_role,
        last_operator = excluded.last_operator,
        years_experience = excluded.years_experience,
        verification_status = excluded.verification_status,
        is_verified = excluded.is_verified,
        is_background_checked = excluded.is_background_checked,
        is_claimed = excluded.is_claimed,
        claimed_by = excluded.claimed_by,
        insurance_risk_score = excluded.insurance_risk_score,
        profile_value_tier = excluded.profile_value_tier,
        diversity_tags = excluded.diversity_tags,
        is_recommended = excluded.is_recommended,
        recommendation_reason = excluded.recommendation_reason,
        bio_story_teaser = excluded.bio_story_teaser,
        bio_story_full = excluded.bio_story_full,
        career_narrative = excluded.career_narrative,
        training_background = excluded.training_background,
        instructor_background = excluded.instructor_background,
        operational_experience = excluded.operational_experience,
        achievements = excluded.achievements,
        goals = excluded.goals,
        full_ratings = excluded.full_ratings,
        full_type_ratings = excluded.full_type_ratings,
        medical_expiry = excluded.medical_expiry,
        english_level = excluded.english_level,
        license_number = excluded.license_number,
        email = excluded.email,
        phone = excluded.phone,
        linkedin_url = excluded.linkedin_url,
        portfolio_url = excluded.portfolio_url,
        ebt_video_url = excluded.ebt_video_url,
        is_pilot_shortage_member = excluded.is_pilot_shortage_member,
        pilot_shortage_testimonial = excluded.pilot_shortage_testimonial,
        pilot_shortage_verified = excluded.pilot_shortage_verified,
        pilot_shortage_status = excluded.pilot_shortage_status,
        pilot_shortage_verification_stages = excluded.pilot_shortage_verification_stages,
        pilot_shortage_verified_by = excluded.pilot_shortage_verified_by,
        pilot_shortage_verified_at = excluded.pilot_shortage_verified_at,
        pilot_shortage_verification_notes = excluded.pilot_shortage_verification_notes,
        pilot_shortage_submitted_at = excluded.pilot_shortage_submitted_at,
        pilot_shortage_anonymous = excluded.pilot_shortage_anonymous,
        career_shift_reason = excluded.career_shift_reason,
        career_shift_to = excluded.career_shift_to,
        pilot_shortage_investment_usd = excluded.pilot_shortage_investment_usd,
        pilot_shortage_support_request = excluded.pilot_shortage_support_request,
        last_synced_at = excluded.last_synced_at,
        updated_at = excluded.updated_at
    `).bind(
      id, body.auth0_id || body.supabase_user_id || id, slug,
      body.display_name || null, body.teaser_headline || null, body.teaser_summary || null,
      body.avatar_url || null, body.country || null, body.base_location || null,
      body.total_hours || null, body.pic_hours || null, (body.type_ratings as string[] || []).join(','), body.current_role || null,
      body.last_operator || null, body.years_experience || null,
      body.verification_status || 'unverified', body.is_verified ? 1 : 0, body.is_background_checked ? 1 : 0,
      body.is_claimed ? 1 : 0, body.claimed_by || null,
      body.insurance_risk_score || 'unknown', body.profile_value_tier || 'standard',
      JSON.stringify(body.diversity_tags || []), body.is_recommended ? 1 : 0, body.recommendation_reason || null,
      body.bio_story_teaser || null, body.bio_story_full || null, body.career_narrative || null,
      body.training_background || null, body.instructor_background || null, body.operational_experience || null,
      body.achievements || null, body.goals || null,
      JSON.stringify(body.full_ratings || []), JSON.stringify(body.full_type_ratings || []),
      body.medical_expiry || null, body.english_level || null, body.license_number || null,
      body.email || null, body.phone || null, body.linkedin_url || null, body.portfolio_url || null, body.ebt_video_url || null,
      body.is_pilot_shortage_member ? 1 : 0, body.pilot_shortage_testimonial || null, body.pilot_shortage_verified ? 1 : 0,
      body.pilot_shortage_status || 'draft',
      JSON.stringify(body.pilot_shortage_verification_stages || []),
      body.pilot_shortage_verified_by || null,
      body.pilot_shortage_verified_at || null,
      body.pilot_shortage_verification_notes || null,
      body.pilot_shortage_submitted_at || null,
      body.pilot_shortage_anonymous ? 1 : 0,
      body.career_shift_reason || null, body.career_shift_to || null, body.pilot_shortage_investment_usd || null, body.pilot_shortage_support_request || null,
      now, now
    ).run();

    // ── Write traceable credentials to audit DB ──
    if (body.license_number) {
      await dbTrace.prepare(`
        INSERT INTO pilot_licenses (id, pilot_profile_id, license_number, issuing_authority, license_type, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          license_number = excluded.license_number, updated_at = excluded.updated_at
      `).bind(crypto.randomUUID(), id, body.license_number, body.issuing_authority || 'unknown', body.license_type || 'CPL', 'active', now, now).run().catch(() => {});
    }
    if (body.medical_expiry) {
      await dbTrace.prepare(`
        INSERT INTO pilot_medicals (id, pilot_profile_id, medical_class, expiry_date, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          expiry_date = excluded.expiry_date, updated_at = excluded.updated_at
      `).bind(crypto.randomUUID(), id, body.medical_class || 'Class 1', body.medical_expiry, 'active', now, now).run().catch(() => {});
    }
    if (body.total_hours !== undefined || body.pic_hours !== undefined) {
      await dbTrace.prepare(`
        INSERT INTO pilot_flight_hours (id, pilot_profile_id, total_hours, pic_hours, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          total_hours = excluded.total_hours, pic_hours = excluded.pic_hours, updated_at = excluded.updated_at
      `).bind(crypto.randomUUID(), id, body.total_hours || 0, body.pic_hours || 0, now, now).run().catch(() => {});
    }
    const typeRatingsArr = body.full_type_ratings as string[] || [];
    if (typeRatingsArr.length > 0) {
      for (const tr of typeRatingsArr) {
        await dbTrace.prepare(`
          INSERT INTO pilot_type_ratings (id, pilot_profile_id, aircraft_type, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            aircraft_type = excluded.aircraft_type, updated_at = excluded.updated_at
        `).bind(crypto.randomUUID(), id, tr, 'active', now, now).run().catch(() => {});
      }
    }

    const updated = await dbProfiles.prepare('SELECT * FROM pilot_profiles WHERE id = ?').bind(id).first() as Record<string, unknown>;
    return jsonResponse({
      ...buildPilotProfileFull(updated),
      _synced_at: now,
    }, 200, origin);
  }

  // PUT /pilots/:slug/pilot-shortage
  // Enterprise — verification team updates pilot shortage testimonial status & stages
  // Anyone can join pilotshortage.org for free. Anyone can write a claim.
  // But the claim is worthless until verified through international industry standards.
  // Stages: license_verified → logbook_verified → interview_conducted → approved
  if (method === 'PUT' && path.match(/^\/pilots\/[^\/]+\/pilot-shortage$/)) {
    const slug = path.split('/')[2];

    let auth: JWTPayload;
    try {
      auth = await requireEnterpriseAuth(request, env, dbOps);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: msg }, 403, origin);
    }

    const body = await request.json().catch(() => ({})) as Record<string, unknown>;

    // Allowed fields for verification team to update
    const allowedFields = [
      'pilot_shortage_status',
      'pilot_shortage_verified',
      'pilot_shortage_verification_stages',
      'pilot_shortage_verified_by',
      'pilot_shortage_verified_at',
      'pilot_shortage_verification_notes',
      'pilot_shortage_anonymous',
    ];

    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowedFields) {
      if (key in body) {
        sets.push(`${key} = ?`);
        if (key === 'pilot_shortage_verification_stages') {
          values.push(JSON.stringify(body[key]));
        } else if (key === 'pilot_shortage_verified') {
          values.push(body[key] ? 1 : 0);
        } else {
          values.push(body[key]);
        }
      }
    }

    if (sets.length === 0) {
      return jsonResponse({ error: 'No valid fields to update. Allowed: pilot_shortage_status, pilot_shortage_verified, pilot_shortage_verification_stages, pilot_shortage_verified_by, pilot_shortage_verified_at, pilot_shortage_verification_notes, pilot_shortage_anonymous' }, 400, origin);
    }

    const now = new Date().toISOString();
    sets.push("updated_at = ?");
    values.push(now);
    values.push(slug);

    await dbProfiles.prepare(`UPDATE pilot_profiles SET ${sets.join(', ')} WHERE public_slug = ?`).bind(...values).run();

    const updated = await dbProfiles.prepare('SELECT * FROM pilot_profiles WHERE public_slug = ?').bind(slug).first() as Record<string, unknown> | null;

    return jsonResponse({
      message: 'Pilot shortage testimonial verification updated. The claim is only credible when it passes all stages.',
      verification_note: 'Free to join. Free to write. But worthless until verified.',
      profile: updated ? buildPilotProfileTeaser(updated) : null,
    }, 200, origin);
  }

  // ── Pilot Verification (Self-Operated, No Veremark) ──────────

  // GET /pilots/:slug/verifications
  // List all verification records for a pilot
  if (method === 'GET' && path.match(/^\/pilots\/[^\/]+\/verifications$/)) {
    const slug = path.split('/')[2];

    let auth: JWTPayload;
    try {
      auth = await requireEnterpriseAuth(request, env, dbOps);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: msg }, 403, origin);
    }

    const pilot = await dbProfiles.prepare('SELECT id FROM pilot_profiles WHERE public_slug = ?').bind(slug).first() as Record<string, unknown> | null;
    if (!pilot) return jsonResponse({ error: 'Not found' }, 404, origin);

    const verifications = await dbProfiles.prepare(`
      SELECT * FROM pilot_verifications WHERE pilot_profile_id = ? ORDER BY created_at DESC
    `).bind(pilot.id).all() as { results: Record<string, unknown>[] };

    return jsonResponse({
      pilot_slug: slug,
      verification_count: (verifications.results || []).length,
      overall_status: (verifications.results || []).every((v: Record<string, unknown>) => (v.status as string) === 'verified') ? 'fully_verified' : 'partial',
      verifications: verifications.results || [],
    }, 200, origin);
  }

  // POST /pilots/:slug/verifications
  // Create a new verification record (license, logbook, medical, etc.)
  if (method === 'POST' && path.match(/^\/pilots\/[^\/]+\/verifications$/)) {
    const slug = path.split('/')[2];

    let auth: JWTPayload;
    try {
      auth = await requireEnterpriseAuth(request, env, dbOps);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: msg }, 403, origin);
    }

    const pilot = await dbProfiles.prepare('SELECT id FROM pilot_profiles WHERE public_slug = ?').bind(slug).first() as Record<string, unknown> | null;
    if (!pilot) return jsonResponse({ error: 'Not found' }, 404, origin);

    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const verificationType = body.verification_type as string;
    const validTypes = ['license', 'logbook', 'medical', 'english', 'background_check', 'identity', 'employment_history', 'type_rating'];
    if (!verificationType || !validTypes.includes(verificationType)) {
      return jsonResponse({ error: `verification_type must be one of: ${validTypes.join(', ')}` }, 400, origin);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const expiresAt = body.expires_at as string || null;

    await dbProfiles.prepare(`
      INSERT INTO pilot_verifications (
        id, pilot_profile_id, verification_type, status, verification_method,
        verified_by, verification_notes, evidence_url, verified_at, expires_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, pilot.id, verificationType,
      body.status || 'pending',
      body.verification_method || 'manual_review',
      body.verified_by || auth.sub,
      body.verification_notes || null,
      body.evidence_url || null,
      body.status === 'verified' ? now : null,
      expiresAt,
      now, now
    ).run();

    const created = await dbProfiles.prepare('SELECT * FROM pilot_verifications WHERE id = ?').bind(id).first() as Record<string, unknown>;

    // Update pilot profile overall verification status if all key types are verified
    const keyTypes = ['license', 'logbook', 'medical', 'english'];
    const allVerified = await db.prepare(`
      SELECT COUNT(DISTINCT verification_type) as verified_count FROM pilot_verifications
      WHERE pilot_profile_id = ? AND verification_type IN (?, ?, ?, ?) AND status = ?
    `).bind(pilot.id, ...keyTypes, 'verified').first() as Record<string, unknown> | null;

    const verifiedCount = (allVerified?.verified_count as number) || 0;
    if (verifiedCount >= keyTypes.length) {
      await db.prepare(`
        UPDATE pilot_profiles SET verification_status = ?, is_verified = 1, updated_at = ?, verification_completed_at = COALESCE(verification_completed_at, ?) WHERE id = ?
      `).bind('verified', now, now, pilot.id).run();
    }

    return jsonResponse({
      message: `Verification record created for ${verificationType}. Status: ${body.status || 'pending'}.`,
      verification: created,
      pilot_verification_progress: `${verifiedCount}/${keyTypes.length} core checks complete`,
    }, 201, origin);
  }

  // PUT /verifications/:id
  // Update an existing verification record
  if (method === 'PUT' && path.match(/^\/verifications\/[^\/]+$/)) {
    const id = path.split('/')[2];

    let auth: JWTPayload;
    try {
      auth = await requireEnterpriseAuth(request, env, dbOps);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: msg }, 403, origin);
    }

    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const allowedFields = [
      'status', 'verification_method', 'verified_by', 'verification_notes',
      'evidence_url', 'verified_at', 'expires_at'
    ];

    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowedFields) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }

    if (sets.length === 0) {
      return jsonResponse({ error: 'No valid fields to update' }, 400, origin);
    }

    const now = new Date().toISOString();
    sets.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await dbProfiles.prepare(`UPDATE pilot_verifications SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();

    const updated = await dbProfiles.prepare('SELECT * FROM pilot_verifications WHERE id = ?').bind(id).first() as Record<string, unknown>;

    // If status changed to verified, update pilot profile
    if (body.status === 'verified' && updated) {
      const pilotId = updated.pilot_profile_id as string;
      const keyTypes = ['license', 'logbook', 'medical', 'english'];
      const allVerified = await db.prepare(`
        SELECT COUNT(DISTINCT verification_type) as verified_count FROM pilot_verifications
        WHERE pilot_profile_id = ? AND verification_type IN (?, ?, ?, ?) AND status = ?
      `).bind(pilotId, ...keyTypes, 'verified').first() as Record<string, unknown> | null;

      const verifiedCount = (allVerified?.verified_count as number) || 0;
      if (verifiedCount >= keyTypes.length) {
        await db.prepare(`
          UPDATE pilot_profiles SET verification_status = ?, is_verified = 1, updated_at = ?, verification_completed_at = COALESCE(verification_completed_at, ?) WHERE id = ?
        `).bind('verified', now, now, pilotId).run();
      }
    }

    return jsonResponse({
      message: 'Verification record updated.',
      verification: updated,
    }, 200, origin);
  }

  // ── pilotshortage.org Stories API (Enterprise / Admin) ──────

  // PUT /pilotshortage/stories/:id
  // Admin/verification team can update story status, feature, flag
  if (method === 'PUT' && path.match(/^\/pilotshortage\/stories\/[^\/]+$/)) {
    const id = path.split('/')[3];

    let auth: JWTPayload;
    try {
      auth = await requireEnterpriseAuth(request, env, dbOps);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: msg }, 403, origin);
    }

    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const allowedFields = [
      'status', 'verification_stages', 'verified_by', 'verified_at',
      'verification_notes', 'is_featured', 'featured_reason', 'is_flagged', 'flagged_reason',
      'headline', 'floor_level', 'career_shift_from', 'career_shift_to',
      'years_in_aviation', 'total_hours_at_shift', 'investment_usd', 'support_request'
    ];

    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowedFields) {
      if (key in body) {
        if (key === 'verification_stages') {
          sets.push(`${key} = ?`);
          values.push(JSON.stringify(body[key]));
        } else if (key === 'is_featured' || key === 'is_flagged') {
          sets.push(`${key} = ?`);
          values.push(body[key] ? 1 : 0);
        } else {
          sets.push(`${key} = ?`);
          values.push(body[key]);
        }
      }
    }

    if (sets.length === 0) {
      return jsonResponse({ error: 'No valid fields to update' }, 400, origin);
    }

    const now = new Date().toISOString();
    sets.push("updated_at = ?");
    values.push(now);

    if (body.is_featured === true && !sets.some((s) => s.includes('featured_at'))) {
      sets.push("featured_at = ?");
      values.push(now);
    }

    values.push(id);

    await dbDocs.prepare(`UPDATE pilotshortage_stories SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();

    const updated = await dbDocs.prepare('SELECT * FROM pilotshortage_stories WHERE id = ?').bind(id).first() as Record<string, unknown>;

    return jsonResponse({
      message: 'Story updated by verification team.',
      story: updated,
    }, 200, origin);
  }

  // POST /pilotshortage/stories/:id/verify
  // Shortcut endpoint for verification team to advance verification stages
  if (method === 'POST' && path.match(/^\/pilotshortage\/stories\/[^\/]+\/verify$/)) {
    const id = path.split('/')[3];

    let auth: JWTPayload;
    try {
      auth = await requireEnterpriseAuth(request, env, dbOps);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: msg }, 403, origin);
    }

    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const stage = body.stage as string; // license_verified, logbook_verified, interview_scheduled, interview_conducted, approved
    const validStages = ['license_verified', 'logbook_verified', 'interview_scheduled', 'interview_conducted', 'approved', 'rejected'];
    if (!stage || !validStages.includes(stage)) {
      return jsonResponse({ error: `stage must be one of: ${validStages.join(', ')}` }, 400, origin);
    }

    const story = await dbDocs.prepare('SELECT verification_stages, status FROM pilotshortage_stories WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
    if (!story) return jsonResponse({ error: 'Story not found' }, 404, origin);

    const now = new Date().toISOString();
    let stages: Record<string, unknown>[] = [];
    try {
      stages = JSON.parse((story.verification_stages as string) || '[]');
    } catch { stages = []; }

    stages.push({
      stage,
      status: stage === 'rejected' ? 'rejected' : 'passed',
      at: now,
      by: auth.sub,
      notes: body.notes || null,
    });

    let newStatus = stage;
    if (stage === 'approved') {
      newStatus = 'approved';
    } else if (stage === 'rejected') {
      newStatus = 'rejected';
    } else {
      // Keep current status if not a terminal state
      newStatus = story.status as string;
    }

    await db.prepare(`
      UPDATE pilotshortage_stories SET status = ?, verification_stages = ?, verified_by = ?, verified_at = ?, verification_notes = ?, updated_at = ? WHERE id = ?
    `).bind(
      newStatus,
      JSON.stringify(stages),
      auth.sub,
      now,
      body.notes || null,
      now,
      id
    ).run();

    const updated = await dbDocs.prepare('SELECT * FROM pilotshortage_stories WHERE id = ?').bind(id).first() as Record<string, unknown>;

    return jsonResponse({
      message: `Story verification advanced to '${stage}'.`,
      verification_note: stage === 'approved'
        ? 'This testimony is now verified and approved. It holds weight.'
        : 'Free to join. Free to write. But worthless until fully verified.',
      story: updated,
    }, 200, origin);
  }

  // ── Private Jet Charter Enterprise ──

  // POST /private-jet-charters/:slug/claim
  if (method === 'POST' && path.match(/^\/private-jet-charters\/[^\/]+\/claim$/)) {
    const slug = path.split('/')[2];
    const pjc = await getPjc(dbOps, slug);
    if (!pjc) return jsonResponse({ error: 'Not found' }, 404, origin);
    if (pjc.claimed_by) return jsonResponse({ error: 'Already claimed' }, 409, origin);

    const now = new Date().toISOString();
    await db.prepare(
      'UPDATE private_jet_charters SET claimed_by = ?, verification_status = ?, claimed_at = ?, updated_by = ? WHERE slug = ?'
    ).bind(enterpriseId, 'claimed', now, enterpriseId, slug).run();

    await db.prepare(
      'UPDATE enterprise_profiles SET pjc_id = ? WHERE id = ?'
    ).bind(pjc.id as string, enterpriseId).run();

    const updated = await getPjc(dbOps, slug);
    return jsonResponse(updated, 200, origin);
  }

  // PUT /private-jet-charters/:slug
  if (method === 'PUT' && path.match(/^\/private-jet-charters\/[^\/]+$/)) {
    const slug = path.split('/')[2];
    const pjc = await getPjc(dbOps, slug);
    if (!pjc) return jsonResponse({ error: 'Not found' }, 404, origin);

    if (!claimedPjcId || claimedPjcId !== pjc.id) {
      return jsonResponse({ error: 'Forbidden: Can only edit your claimed private jet charter profile' }, 403, origin);
    }

    const allowed = ['name', 'logo', 'hero_image', 'description', 'short_bio',
      'website', 'email', 'phone', 'social_media', 'country', 'city', 'headquarters',
      'bases', 'fleet_size', 'aircraft_types', 'charter_types', 'is_hiring', 'hiring_url',
      'average_captain_salary_usd', 'salary_range', 'requirements',
      'min_total_hours', 'min_pic_hours', 'min_jet_hours', 'type_ratings_required',
      'lifestyle_notes', 'schedule_type', 'home_every_night',
      'recognition_plus_only'];
    const sets: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (sets.length === 0) return jsonResponse({ error: 'No fields to update' }, 400, origin);

    sets.push('updated_by = ?');
    sets.push("updated_at = datetime('now')");
    values.push(enterpriseId);
    values.push(slug);

    await db.prepare(`UPDATE private_jet_charters SET ${sets.join(', ')} WHERE slug = ?`).bind(...values).run();
    const updated = await getPjc(dbOps, slug);
    return jsonResponse(updated, 200, origin);
  }

  return jsonResponse({ error: 'Not found' }, 404, origin);
}

// ── Main Router ─────────────────────────────────────────────────

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || undefined;
  const path = url.pathname;
  const method = request.method;

  // Preflight
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  // Rate limiting
  const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isRateLimited(`${method}:${path}:${clientIp}`)) {
    return jsonResponse({ error: 'Rate limit exceeded' }, 429, origin);
  }

  // Health check
  if (path === '/health') {
    try {
      await env.DB.prepare('SELECT 1').first();
      return jsonResponse({ status: 'ok', db: 'connected' }, 200, origin);
    } catch {
      return jsonResponse({ status: 'error', db: 'disconnected' }, 503, origin);
    }
  }

  // Pilot-specific endpoints (require pilot auth, not enterprise auth)
  if (method === 'PUT' && path.match(/^\/connect-requests\/[^\/]+$/)) {
    return handlePublicRequest(request, env);
  }

  // Enterprise writes (require auth)
  if (method === 'PUT' || method === 'POST' || method === 'DELETE') {
    return handleEnterpriseRequest(request, env);
  }

  // Public reads (no auth)
  if (method === 'GET') {
    return handlePublicRequest(request, env);
  }

  return jsonResponse({ error: 'Method not allowed' }, 405, origin);
}

// ── Main Export ────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await handleRequest(request, env);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Pathway Worker error:', msg);
      return jsonResponse({ error: 'Internal error', message: msg }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
