import { useEffect, useMemo, useState } from 'react';
import {
  OperatorManifestEntry,
  OperatorPathway,
  OperatorPathwayProfile,
  OperatorCategory,
  OPERATOR_CATEGORY_LABELS,
  RegionOverview,
  MarketStatus,
  MarketOverview,
  MarketSignal,
  GapAnalysisResult,
} from './types';
import { getEnrichment } from './operatorEnrichment';
import { analyzeGap, batchAnalyzeGaps } from './gapAnalysis';
import {
  computeMarketSignal,
  computeMarketOverview,
  computeAllMarketSignals,
  findSimilarOperators,
} from './marketIntelligence';
import {
  assessPilotValue,
  detectArchetype,
  type PilotValueInput,
  type PilotValueAssessment,
  type PilotArchetype,
} from './pilotValue';
import { generatePersonalContext } from './personaContext';

/** Base URL for the Pathways helicopter operator assets (space-encoded) */
const ASSET_BASE = '/images/Pathways/Helicopter%20Operators/APAC';

const MANIFEST_URL = `${ASSET_BASE}/manifest.json`;
const REGION_URL = `${ASSET_BASE}/apac-region.json`;

// --- Curated sets for UI grouping -------------------------------------------

const RECOMMENDED_OPERATORS = new Set([
  'Nautilus Aviation',
  'McDermott Aviation',
  'CareFlight',
  'Royal Flying Doctor Service',
  'HeliTours Fiji',
  'Island Hoppers Fiji',
  'Tahiti Helicopters',
  'Citic Offshore Helicopter',
  'PHI Asia Pacific',
  'Babcock Australasia',
]);

const FEATURED_COUNTRIES = new Set([
  'australia',
  'new-zealand',
  'japan',
  'singapore',
]);

const SUBTITLES = [
  'Helicopter Career Track',
  'Charter & VIP Pipeline',
  'EMS / SAR Pathway',
  'Agricultural Aviation Route',
  'Flight Training to Career',
  'Scenic & Tourism Track',
  'General Aviation Entry',
];

// --- Helpers ----------------------------------------------------------------

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateSubtitle(name: string): string {
  const idx = name.length % SUBTITLES.length;
  return SUBTITLES[idx];
}

function generateMatch(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const base = 60 + (Math.abs(hash) % 25);
  return Math.min(95, Math.max(50, base));
}

function generateGaps(match: number): number {
  if (match >= 85) return 1;
  if (match >= 75) return 2;
  if (match >= 65) return 4;
  return 6;
}

function generateBenefits(match: number): string[] {
  if (match >= 85) return ['Hiring now', 'Fast-track'];
  if (match >= 75) return ['Training provided', 'Career growth'];
  if (match >= 65) return ['Entry pathway', 'Build hours'];
  return ['Hour building', 'Networking'];
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// --- Manifest fetching (cached module-level) --------------------------------

let manifestPromise: Promise<OperatorManifestEntry[]> | null = null;
let cachedManifest: OperatorManifestEntry[] | null = null;

function fetchManifest(): Promise<OperatorManifestEntry[]> {
  if (cachedManifest) return Promise.resolve(cachedManifest);
  if (manifestPromise) return manifestPromise;

  manifestPromise = fetch(MANIFEST_URL)
    .then((r) => r.json())
    .then((data: OperatorManifestEntry[]) => {
      const valid = data.filter(
        (e) => e.status === 'downloaded' && (e.downloadedFile || e.path)
      );
      cachedManifest = valid;
      return valid;
    })
    .catch((err) => {
      console.error('Failed to load helicopter operator manifest:', err);
      manifestPromise = null;
      throw err;
    });

  return manifestPromise;
}

let regionPromise: Promise<RegionOverview> | null = null;
let cachedRegion: RegionOverview | null = null;

function fetchRegion(): Promise<RegionOverview> {
  if (cachedRegion) return Promise.resolve(cachedRegion);
  if (regionPromise) return regionPromise;

  regionPromise = fetch(REGION_URL)
    .then((r) => r.json())
    .then((data: RegionOverview) => {
      cachedRegion = data;
      return data;
    })
    .catch((err) => {
      console.error('Failed to load APAC region overview:', err);
      regionPromise = null;
      throw err;
    });

  return regionPromise;
}

// --- Hook -------------------------------------------------------------------

export function useHelicopterOperators(profile?: OperatorPathwayProfile) {
  const [manifest, setManifest] = useState<OperatorManifestEntry[]>(
    cachedManifest ?? []
  );
  const [region, setRegion] = useState<RegionOverview | null>(cachedRegion);
  const [loading, setLoading] = useState(!cachedManifest);

  useEffect(() => {
    let cancelled = false;
    fetchManifest()
      .then((valid) => {
        if (cancelled) return;
        setManifest(valid);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    fetchRegion()
      .then((data) => {
        if (cancelled) return;
        setRegion(data);
      })
      .catch(() => {
        /* region is optional */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Pilot value assessment (independent of any job) ---
  const pilotValue = useMemo<PilotValueAssessment | null>(() => {
    if (!profile) return null;
    const input: PilotValueInput = {
      totalFlightHours:
        typeof profile.total_flight_hours === 'string'
          ? parseFloat(profile.total_flight_hours)
          : typeof profile.total_flight_hours === 'number'
            ? profile.total_flight_hours
            : 0,
      rotaryHours: typeof profile.rotary_hours === 'number' ? profile.rotary_hours : undefined,
      picHours: typeof profile.pic_hours === 'number' ? profile.pic_hours : undefined,
      multiEngineHours: typeof profile.multi_engine_hours === 'number' ? profile.multi_engine_hours : undefined,
      instrumentHours: typeof profile.instrument_hours === 'number' ? profile.instrument_hours : undefined,
      nightHours: typeof profile.night_hours === 'number' ? profile.night_hours : undefined,
      turbineHours: typeof profile.turbine_hours === 'number' ? profile.turbine_hours : undefined,
      licenses: profile.licenses ?? [],
      typeRatings: profile.type_ratings ?? [],
      medicalClass: profile.medical_class ?? undefined,
      icaoElpLevel: profile.icao_elp_level ?? undefined,
      age: profile.age ?? undefined,
      citizenship: profile.citizenship ?? undefined,
      currentRole: profile.current_role ?? undefined,
      yearsInCareer: profile.years_in_career ?? undefined,
      recognitionScore: profile.recognition_score ?? undefined,
      recognitionTier: profile.recognition_tier ?? undefined,
      verificationStatus:
        (typeof profile.verification_status === 'string' && profile.verification_status === 'verified')
          ? 'verified'
          : (typeof profile.verification_status === 'object' && profile.verification_status?.status === 'verified')
            ? 'verified'
            : 'unverified',
      subscriptionTier: profile.subscription_tier ?? undefined,
    };
    return assessPilotValue(input);
  }, [profile]);

  const pilotArchetype = pilotValue?.archetype ?? 'unknown';
  const pilotHoursForContext = pilotValue?.marketValue?.current?.min ?? 0;

  const pathways = useMemo<OperatorPathway[]>(() => {
    const hours =
      typeof profile?.total_flight_hours === 'string'
        ? parseFloat(profile.total_flight_hours)
        : typeof profile?.total_flight_hours === 'number'
          ? profile.total_flight_hours
          : 0;
    const verified =
      (typeof profile?.verification_status === 'string' &&
        profile.verification_status === 'verified') ||
      (typeof profile?.verification_status === 'object' &&
        profile?.verification_status !== null &&
        profile.verification_status.status === 'verified');
    const isSubscriber =
      profile?.subscription_tier === 'recognition_plus' ||
      profile?.recognition_tier === 'recognition_plus' ||
      profile?.subscription_tier === 'enterprise';

    return manifest.map((entry) => {
      const relativePath = entry.downloadedFile || entry.path;
      const id = slugify(entry.name);
      let match = generateMatch(entry.name);
      if (verified) match += 5;
      if (isSubscriber) match += 3;
      if (hours >= 1500) match += 4;
      else if (hours >= 500) match += 2;
      match = Math.min(99, match);
      const gaps = generateGaps(match);
      const category = entry.category as OperatorCategory;
      const enrichmentData = getEnrichment(id);
      const marketStatus: MarketStatus = enrichmentData?.career.hiringStatus ?? 'closed';
      return {
        id,
        name: entry.name,
        logo: `${ASSET_BASE}/${relativePath}`,
        region: 'APAC',
        country: entry.country,
        category,
        categoryLabel: OPERATOR_CATEGORY_LABELS[category] ?? titleCase(category),
        serviceType: entry.serviceType,
        website: entry.website,
        match,
        gaps,
        subtitle: generateSubtitle(entry.name),
        benefits: generateBenefits(match),
        marketStatus,
        enriched: !!enrichmentData,
        enrichment: enrichmentData
          ? {
              description: enrichmentData.description,
              summary: enrichmentData.summary,
              fleet: enrichmentData.fleet,
              bases: enrichmentData.bases,
              services: enrichmentData.services,
              career: enrichmentData.career,
              hiring: enrichmentData.hiring,
              requirements: enrichmentData.requirements,
              training: enrichmentData.training,
              lifestyle: enrichmentData.lifestyle,
              progression: enrichmentData.progression,
              quality: enrichmentData.quality,
              wikipedia: enrichmentData.wikipedia,
              aiSummary: enrichmentData.aiSummary,
              aiHiringSummary: enrichmentData.aiHiringSummary,
              wikimediaImages: enrichmentData.wikimediaImages,
              founded: enrichmentData.founded,
              parentCompany: enrichmentData.parentCompany,
            }
          : undefined,
        personaContext: pilotArchetype !== 'unknown' && profile
          ? generatePersonalContext(
              {
                name: entry.name,
                category,
                country: entry.country,
                fleet: enrichmentData?.fleet,
                bases: enrichmentData?.bases,
                services: enrichmentData?.services,
                career: enrichmentData?.career,
                requirements: enrichmentData?.requirements,
                training: enrichmentData?.training,
                lifestyle: enrichmentData?.lifestyle,
              },
              pilotArchetype,
              typeof profile.total_flight_hours === 'number'
                ? profile.total_flight_hours
                : typeof profile.total_flight_hours === 'string'
                  ? parseFloat(profile.total_flight_hours)
                  : 0
            )
          : undefined,
      };
    });
  }, [manifest, profile, pilotArchetype]);

  const recommended = useMemo(
    () =>
      pathways
        .filter((p) => RECOMMENDED_OPERATORS.has(p.name))
        .sort((a, b) => b.match - a.match),
    [pathways]
  );

  const featured = useMemo(
    () =>
      pathways
        .filter((p) => FEATURED_COUNTRIES.has(p.country))
        .sort((a, b) => b.match - a.match),
    [pathways]
  );

  const byCategory = useMemo(() => {
    const map = new Map<OperatorCategory, OperatorPathway[]>();
    for (const p of pathways) {
      const list = map.get(p.category) ?? [];
      list.push(p);
      map.set(p.category, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => b.match - a.match);
    }
    return map;
  }, [pathways]);

  const byCountry = useMemo(() => {
    const map = new Map<string, OperatorPathway[]>();
    for (const p of pathways) {
      const list = map.get(p.country) ?? [];
      list.push(p);
      map.set(p.country, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => b.match - a.match);
    }
    return map;
  }, [pathways]);

  const countries = useMemo(
    () => (region?.countries ?? []).map((c) => ({
      country: c.country,
      label: titleCase(c.country),
      totalOperators: c.totalOperators,
      categories: c.categories,
    })),
    [region]
  );

  const enriched = useMemo(
    () => pathways.filter((p) => p.enriched).sort((a, b) => b.match - a.match),
    [pathways]
  );

  // --- Gap analysis (pilot profile vs operator requirements) ---
  const gapAnalyses = useMemo<GapAnalysisResult[]>(() => {
    if (!profile) return [];
    return batchAnalyzeGaps(pathways, profile);
  }, [pathways, profile]);

  const gapAnalysisMap = useMemo(() => {
    const map = new Map<string, GapAnalysisResult>();
    for (const g of gapAnalyses) map.set(g.operatorId, g);
    return map;
  }, [gapAnalyses]);

  // Attach gap analysis + similar operators to pathways
  const pathwaysWithGaps = useMemo<OperatorPathway[]>(() => {
    return pathways.map((p) => {
      const gap = gapAnalysisMap.get(p.id);
      if (!gap) return p;
      const similar = findSimilarOperators(p, pathways, 5);
      return {
        ...p,
        gapAnalysis: { ...gap, similarOperators: similar },
      };
    });
  }, [pathways, gapAnalysisMap]);

  // --- Market signals (pilot interest as demand indicator) ---
  const marketSignals = useMemo<Map<string, MarketSignal>>(() => {
    return computeAllMarketSignals(pathways.map((p) => p.id));
  }, [pathways]);

  const pathwaysWithAll = useMemo<OperatorPathway[]>(() => {
    return pathwaysWithGaps.map((p) => ({
      ...p,
      marketSignal: marketSignals.get(p.id),
    }));
  }, [pathwaysWithGaps, marketSignals]);

  // --- Market overview (the "index" view) ---
  const marketOverview = useMemo<MarketOverview>(() => {
    return computeMarketOverview(pathwaysWithAll);
  }, [pathwaysWithAll]);

  // --- Open operators (market is "open") ---
  const openOperators = useMemo(
    () =>
      pathwaysWithAll
        .filter((p) => p.marketStatus === 'open' || p.marketStatus === 'accepting')
        .sort((a, b) => b.match - a.match),
    [pathwaysWithAll]
  );

  // --- Eligible operators (pilot meets minimums) ---
  const eligibleOperators = useMemo(
    () =>
      pathwaysWithAll
        .filter((p) => p.gapAnalysis?.eligible === true)
        .sort((a, b) => (b.gapAnalysis?.overallMatchScore ?? 0) - (a.gapAnalysis?.overallMatchScore ?? 0)),
    [pathwaysWithAll]
  );

  // --- Near-eligible operators ---
  const nearEligibleOperators = useMemo(
    () =>
      pathwaysWithAll
        .filter((p) => p.gapAnalysis?.nearEligible === true && !p.gapAnalysis?.eligible)
        .sort((a, b) => (b.gapAnalysis?.overallMatchScore ?? 0) - (a.gapAnalysis?.overallMatchScore ?? 0)),
    [pathwaysWithAll]
  );

  // --- Trending operators (most pilot interest) ---
  const trending = useMemo(
    () =>
      pathwaysWithAll
        .filter((p) => (p.marketSignal?.totalInterest ?? 0) > 0)
        .sort((a, b) => (b.marketSignal?.totalInterest ?? 0) - (a.marketSignal?.totalInterest ?? 0))
        .slice(0, 10),
    [pathwaysWithAll]
  );

  return {
    pathways: pathwaysWithAll,
    recommended,
    featured,
    byCategory,
    byCountry,
    countries,
    region,
    enriched,
    // --- Market intelligence ---
    marketOverview,
    openOperators,
    trending,
    // --- Gap analysis ---
    gapAnalyses,
    eligibleOperators,
    nearEligibleOperators,
    // --- Pilot value (independent of any job) ---
    pilotValue,
    pilotArchetype,
    // --- Status ---
    loading,
    total: manifest.length,
  };
}
