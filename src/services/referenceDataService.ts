/**
 * Reference Data Service — Replaces typeRatingService.ts
 *
 * Public aviation reference data: manufacturers, aircraft, training requirements.
 * Calls the dedicated pilotcareerpathways-api Worker.
 *
 * - READ: Public — no auth required
 * - WRITE: Enterprise API key required (manufacturers claim their data)
 *
 * Tables:
 *   manufacturers, aircraft_type_ratings, training_requirements, simulator_locations
 */

// ── Config ──────────────────────────────────────────────────────

const PATHWAY_API_URL = import.meta.env.VITE_PATHWAY_API_URL || 'https://pilotcareerpathways-api.benjamintigerbowler.workers.dev';

// Public fetch — no auth needed for reads
async function publicFetch(path: string): Promise<unknown> {
  const res = await fetch(`${PATHWAY_API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.error || `HTTP ${res.status}`);
  return data;
}

// Authenticated fetch — enterprise writes need auth
async function authFetch(accessToken: string, path: string, body?: Record<string, unknown>): Promise<unknown> {
  if (!accessToken) throw new Error('Not authenticated');
  const res = await fetch(`${PATHWAY_API_URL}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.error || `HTTP ${res.status}`);
  return data;
}

// ── Types ──────────────────────────────────────────────────────

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
  marketDemandStatistics?: unknown;
  salaryExpectations?: unknown;
  careerProgression?: unknown;
  expectations?: unknown;
  trainingCenters?: unknown[];
  newsAndUpdates?: unknown[];
  userReviews?: unknown[];
  // Claim / verification fields
  claimedBy?: string;
  verificationStatus: 'community' | 'claimed' | 'verified';
  claimedAt?: string;
  updatedBy?: string;
  updatedAt: string;
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
  news?: unknown[];
  careerScore?: number;
  pilotCount?: number;
  firstFlight: number;
  specifications: unknown;
  trainingRequirements: unknown;
  trainingCurriculum?: unknown[];
  simulatorDetails?: unknown;
  instructorQualifications?: unknown[];
  certification?: unknown;
  successStories?: unknown[];
  faq?: unknown[];
  careerInfo?: unknown;
  // Verification fields
  lastVerifiedBy?: string;
  lastVerifiedAt?: string;
  updatedBy?: string;
  updatedAt: string;
}

export interface TrainingRequirement {
  id: string;
  aircraftId: string;
  requirementType: string;
  details: string;
  minimumHours?: number;
  estimatedCostUsd?: number;
  currency?: string;
  prerequisiteRatings?: string;
  medicalClass?: string;
  licensePrerequisite?: string;
  validityPeriodMonths?: number;
  regulatoryAuthority?: string;
  source: 'community' | 'manufacturer' | 'authority';
  lastVerifiedBy?: string;
  lastVerifiedAt?: string;
}

export interface SimulatorLocation {
  id: string;
  aircraftId: string;
  city: string;
  country?: string;
  provider: string;
  providerType?: 'manufacturer' | 'ato' | 'independent';
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  hourlyRateUsd?: number;
  equipmentAge?: string;
  isApproved?: boolean;
  approvedByAuthority?: string;
  source: 'community' | 'manufacturer' | 'authority';
  lastVerifiedBy?: string;
  lastVerifiedAt?: string;
}

// ── Helper: snake_case → camelCase ───────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
function toCamelCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
    }
  }
  return result;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Service ──────────────────────────────────────────────────────

class ReferenceDataService {
  // ── Manufacturers (Public Read) ─────────────────────────────

  async getAllManufacturers(): Promise<Manufacturer[]> {
    const data = await publicFetch('/manufacturers') as Record<string, unknown>[];
    return (data || []).map(toCamelCase);
  }

  async getManufacturerById(id: string): Promise<Manufacturer | null> {
    const data = await publicFetch(`/manufacturers/${encodeURIComponent(id)}`) as Record<string, unknown>;
    return data ? toCamelCase(data) : null;
  }

  /** Enterprise: Update manufacturer profile (logo, description, etc) */
  async updateManufacturer(
    accessToken: string,
    id: string,
    updates: Partial<Manufacturer>
  ): Promise<Manufacturer> {
    const data = await authFetch(accessToken, `/manufacturers/${encodeURIComponent(id)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Claim a manufacturer profile */
  async claimManufacturer(
    accessToken: string,
    manufacturerId: string,
    enterpriseId: string
  ): Promise<Manufacturer> {
    const data = await authFetch(
      accessToken,
      `/manufacturers/${encodeURIComponent(manufacturerId)}/claim`,
      { enterprise_id: enterpriseId }
    ) as Record<string, unknown>;
    return toCamelCase(data);
  }

  // ── Aircraft (Public Read) ──────────────────────────────────

  async getAllAircraft(): Promise<AircraftTypeRating[]> {
    const data = await publicFetch('/aircraft') as Record<string, unknown>[];
    return (data || []).map(toCamelCase);
  }

  async getAircraftByManufacturer(manufacturerId: string): Promise<AircraftTypeRating[]> {
    const data = await publicFetch(`/aircraft?manufacturer_id=${encodeURIComponent(manufacturerId)}`) as Record<string, unknown>[];
    return (data || []).map(toCamelCase);
  }

  async getAircraftByCategory(category: string): Promise<AircraftTypeRating[]> {
    const data = await publicFetch(`/aircraft?category=${encodeURIComponent(category)}`) as Record<string, unknown>[];
    return (data || []).map(toCamelCase);
  }

  async getAircraftById(id: string): Promise<AircraftTypeRating | null> {
    const res = await publicFetch(`/aircraft/${encodeURIComponent(id)}`) as { aircraft: Record<string, unknown>; manufacturer: Record<string, unknown> };
    return res?.aircraft ? toCamelCase(res.aircraft) : null;
  }

  async searchAircraft(query: string): Promise<AircraftTypeRating[]> {
    const safeQuery = query.replace(/[%_]/g, '').trim();
    if (!safeQuery) return [];
    const data = await publicFetch(`/search?q=${encodeURIComponent(safeQuery)}`) as { aircraft: Record<string, unknown>[] };
    return (data?.aircraft || []).map(toCamelCase);
  }

  /** Enterprise: Update aircraft specs (training requirements, sim locations, etc) */
  async updateAircraft(
    accessToken: string,
    id: string,
    updates: Partial<AircraftTypeRating>
  ): Promise<AircraftTypeRating> {
    const data = await authFetch(accessToken, `/aircraft/${encodeURIComponent(id)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Add a new aircraft model */
  async createAircraft(
    accessToken: string,
    aircraft: Omit<AircraftTypeRating, 'id' | 'updatedAt' | 'createdAt'>
  ): Promise<AircraftTypeRating> {
    const data = await authFetch(accessToken, '/aircraft', aircraft) as Record<string, unknown>;
    return toCamelCase(data);
  }

  // ── Training Requirements (Public Read) ─────────────────────

  async getTrainingRequirements(aircraftId: string): Promise<TrainingRequirement[]> {
    const data = await publicFetch(`/aircraft/${encodeURIComponent(aircraftId)}/training-requirements`) as Record<string, unknown>[];
    return (data || []).map(toCamelCase);
  }

  /** Enterprise: Update training requirements */
  async updateTrainingRequirement(
    accessToken: string,
    id: string,
    updates: Partial<TrainingRequirement>
  ): Promise<TrainingRequirement> {
    const data = await authFetch(accessToken, `/training-requirements/${encodeURIComponent(id)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Add training requirement */
  async createTrainingRequirement(
    accessToken: string,
    requirement: Omit<TrainingRequirement, 'id' | 'createdAt'>
  ): Promise<TrainingRequirement> {
    const data = await authFetch(accessToken, '/training-requirements', requirement) as Record<string, unknown>;
    return toCamelCase(data);
  }

  // ── Simulator Locations (Public Read) ────────────────────────

  async getSimulatorLocations(aircraftId: string): Promise<SimulatorLocation[]> {
    const data = await publicFetch(`/aircraft/${encodeURIComponent(aircraftId)}/simulator-locations`) as Record<string, unknown>[];
    return (data || []).map(toCamelCase);
  }

  /** Enterprise: Add/update simulator location */
  async upsertSimulatorLocation(
    accessToken: string,
    location: Partial<SimulatorLocation> & { aircraftId: string; city: string; provider: string }
  ): Promise<SimulatorLocation> {
    const data = await authFetch(accessToken, '/simulator-locations', location) as Record<string, unknown>;
    return toCamelCase(data);
  }

  // ── Type Rating Centers (Public Read) ────────────────────────

  async getAllTRCs(): Promise<Record<string, unknown>[]> {
    const data = await publicFetch('/trcs') as Record<string, unknown>[];
    return (data || []).map(toCamelCase);
  }

  async getTRCBySlug(slug: string): Promise<Record<string, unknown> | null> {
    const data = await publicFetch(`/trcs/${encodeURIComponent(slug)}`) as Record<string, unknown>;
    return data ? toCamelCase(data) : null;
  }

  async getTRCRatings(slug: string): Promise<Record<string, unknown>[]> {
    const data = await publicFetch(`/trcs/${encodeURIComponent(slug)}/ratings`) as Record<string, unknown>;
    if (Array.isArray(data)) return data.map(toCamelCase);
    if (data && 'ratings' in data) return (data.ratings as Record<string, unknown>[]).map(toCamelCase);
    return [];
  }

  async getTRCSimulators(slug: string): Promise<Record<string, unknown>[]> {
    const data = await publicFetch(`/trcs/${encodeURIComponent(slug)}/simulators`) as Record<string, unknown>;
    if (Array.isArray(data)) return data.map(toCamelCase);
    if (data && 'simulators' in data) return (data.simulators as Record<string, unknown>[]).map(toCamelCase);
    return [];
  }

  async getTRCInstructors(slug: string): Promise<Record<string, unknown>[]> {
    const data = await publicFetch(`/trcs/${encodeURIComponent(slug)}/instructors`) as Record<string, unknown>;
    if (Array.isArray(data)) return data.map(toCamelCase);
    if (data && 'instructors' in data) return (data.instructors as Record<string, unknown>[]).map(toCamelCase);
    return [];
  }

  /** Enterprise: Claim a TRC profile */
  async claimTRC(accessToken: string, slug: string): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/trcs/${encodeURIComponent(slug)}/claim`, {}) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Update TRC profile */
  async updateTRC(accessToken: string, slug: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/trcs/${encodeURIComponent(slug)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Add type rating course to TRC */
  async createTRCRating(accessToken: string, slug: string, rating: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/trcs/${encodeURIComponent(slug)}/ratings`, rating) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Update type rating course */
  async updateTRCRating(accessToken: string, id: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/trc-ratings/${encodeURIComponent(id)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Add simulator to TRC */
  async createTRCSimulator(accessToken: string, slug: string, simulator: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/trcs/${encodeURIComponent(slug)}/simulators`, simulator) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Update simulator */
  async updateTRCSimulator(accessToken: string, id: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/trc-simulators/${encodeURIComponent(id)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Add instructor to TRC */
  async createTRCInstructor(accessToken: string, slug: string, instructor: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/trcs/${encodeURIComponent(slug)}/instructors`, instructor) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Update TRC instructor */
  async updateTRCInstructor(accessToken: string, id: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/trc-instructors/${encodeURIComponent(id)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  // ── Airlines (Public Read) ───────────────────────────────────

  async getAllAirlines(): Promise<Record<string, unknown>[]> {
    const data = await publicFetch('/airlines') as Record<string, unknown>[];
    return (data || []).map(toCamelCase);
  }

  async getAirlineBySlug(slug: string): Promise<Record<string, unknown> | null> {
    const data = await publicFetch(`/airlines/${encodeURIComponent(slug)}`) as Record<string, unknown>;
    return data ? toCamelCase(data) : null;
  }

  async getAirlineCadetPrograms(slug: string): Promise<Record<string, unknown>[]> {
    const data = await publicFetch(`/airlines/${encodeURIComponent(slug)}/cadet-programs`) as Record<string, unknown>;
    if (Array.isArray(data)) return data.map(toCamelCase);
    if (data && 'cadet_programs' in data) return (data.cadet_programs as Record<string, unknown>[]).map(toCamelCase);
    return [];
  }

  async getAirlineFleet(slug: string): Promise<Record<string, unknown>[]> {
    const data = await publicFetch(`/airlines/${encodeURIComponent(slug)}/fleet`) as Record<string, unknown>;
    if (Array.isArray(data)) return data.map(toCamelCase);
    if (data && 'fleet' in data) return (data.fleet as Record<string, unknown>[]).map(toCamelCase);
    return [];
  }

  /** Enterprise: Claim an airline profile */
  async claimAirline(accessToken: string, slug: string): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/airlines/${encodeURIComponent(slug)}/claim`, {}) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Update airline profile */
  async updateAirline(accessToken: string, slug: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/airlines/${encodeURIComponent(slug)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Add cadet program */
  async createCadetProgram(accessToken: string, slug: string, program: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/airlines/${encodeURIComponent(slug)}/cadet-programs`, program) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Update cadet program */
  async updateCadetProgram(accessToken: string, id: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/cadet-programs/${encodeURIComponent(id)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Add airline fleet entry */
  async createAirlineFleet(accessToken: string, slug: string, fleet: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/airlines/${encodeURIComponent(slug)}/fleet`, fleet) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Update airline fleet entry */
  async updateAirlineFleet(accessToken: string, id: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/airline-fleet/${encodeURIComponent(id)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  // ── Airline Pathways ─────────────────────────────────────────

  async getAirlinePathways(slug: string): Promise<Record<string, unknown>[]> {
    const data = await publicFetch(`/airlines/${encodeURIComponent(slug)}/pathways`) as Record<string, unknown>;
    if (Array.isArray(data)) return data.map(toCamelCase);
    if (data && 'pathways' in data) return (data.pathways as Record<string, unknown>[]).map(toCamelCase);
    return [];
  }

  async matchAirlinePathways(slug: string, pilotProfile: Record<string, unknown>): Promise<Record<string, unknown>> {
    const res = await fetch(`${PATHWAY_API_URL}/airlines/${encodeURIComponent(slug)}/pathway-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pilotProfile),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any)?.error || `HTTP ${res.status}`);
    return toCamelCase(data);
  }

  /** Enterprise: Add airline pathway */
  async createAirlinePathway(accessToken: string, slug: string, pathway: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/airlines/${encodeURIComponent(slug)}/pathways`, pathway) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Update airline pathway */
  async updateAirlinePathway(accessToken: string, id: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/airline-pathways/${encodeURIComponent(id)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Pilot: Submit interest in a pathway — falls into airline candidate pool */
  async submitPathwayInterest(pathwayId: string, interest: Record<string, unknown>): Promise<Record<string, unknown>> {
    const res = await fetch(`${PATHWAY_API_URL}/pathways/${encodeURIComponent(pathwayId)}/submit-interest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(interest),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any)?.error || `HTTP ${res.status}`);
    return toCamelCase(data);
  }

  /** Enterprise: View candidate pool for claimed airline with filtering */
  async getCandidatePool(accessToken: string, slug: string, filters?: { status?: string; verified_only?: boolean; max_risk_ratio?: number; min_match_percent?: number }): Promise<Record<string, unknown>> {
    let url = `/airlines/${encodeURIComponent(slug)}/candidate-pool`;
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.verified_only) params.append('verified_only', '1');
    if (filters?.max_risk_ratio !== undefined) params.append('max_risk_ratio', String(filters.max_risk_ratio));
    if (filters?.min_match_percent !== undefined) params.append('min_match_percent', String(filters.min_match_percent));
    if (params.toString()) url += `?${params.toString()}`;
    const data = await authFetch(accessToken, url, {}) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Update pool entry status (submitted, shortlisted, contacted, rejected, advanced) */
  async updatePoolEntry(accessToken: string, id: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/pool-entry/${encodeURIComponent(id)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  // ── Private Jet Charters (Public Read) ───────────────────────

  async getAllPrivateJetCharters(): Promise<Record<string, unknown>[]> {
    const data = await publicFetch('/private-jet-charters') as Record<string, unknown>[];
    return (data || []).map(toCamelCase);
  }

  async getPrivateJetChartersPlus(): Promise<Record<string, unknown>[]> {
    const data = await publicFetch('/private-jet-charters?recognition_plus=1') as Record<string, unknown>[];
    return (data || []).map(toCamelCase);
  }

  async getPrivateJetCharterBySlug(slug: string): Promise<Record<string, unknown> | null> {
    const data = await publicFetch(`/private-jet-charters/${encodeURIComponent(slug)}`) as Record<string, unknown>;
    return data ? toCamelCase(data) : null;
  }

  /** Enterprise: Claim a private jet charter profile */
  async claimPrivateJetCharter(accessToken: string, slug: string): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/private-jet-charters/${encodeURIComponent(slug)}/claim`, {}) as Record<string, unknown>;
    return toCamelCase(data);
  }

  /** Enterprise: Update private jet charter profile */
  async updatePrivateJetCharter(accessToken: string, slug: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await authFetch(accessToken, `/private-jet-charters/${encodeURIComponent(slug)}`, updates) as Record<string, unknown>;
    return toCamelCase(data);
  }

  // ── Convenience: Aircraft with full details ──────────────────

  async getAircraftWithDetails(id: string): Promise<{
    aircraft: AircraftTypeRating;
    trainingRequirements: TrainingRequirement[];
    simulatorLocations: SimulatorLocation[];
    manufacturer: Manufacturer;
  } | null> {
    const [aircraftData, trainingData, simData, mfrData] = await Promise.all([
      this.getAircraftById(id),
      this.getTrainingRequirements(id),
      this.getSimulatorLocations(id),
      publicFetch(`/aircraft/${encodeURIComponent(id)}`) as Promise<{ manufacturer: Record<string, unknown> }>,
    ]);

    if (!aircraftData) return null;

    return {
      aircraft: aircraftData,
      trainingRequirements: trainingData,
      simulatorLocations: simData,
      manufacturer: toCamelCase(mfrData.manufacturer),
    };
  }
}

export const referenceDataService = new ReferenceDataService();
