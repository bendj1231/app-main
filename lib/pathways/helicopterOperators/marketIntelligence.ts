// Market Intelligence Layer
// Treats operators like stocks that "open" and "close" for hiring.
// Pilot interest = demand signal. Match scores = analyst ratings.
// Gap analysis = investment thesis.

import {
  OperatorPathway,
  MarketStatus,
  MarketSignal,
  MarketOverview,
  OperatorCategory,
  OperatorPathwayProfile,
} from './types';
import { batchAnalyzeGaps, GapAnalysisResult } from './gapAnalysis';

// --- Interest Signal Storage (localStorage-backed) -------------------------

const STORAGE_KEY = 'pathways:operatorInterest';
const SIGNALS_KEY = 'pathways:operatorSignals';

interface InterestRecord {
  operatorId: string;
  pilotId: string;
  timestamp: string;
  pilotStage: 'cadet' | 'low_time' | 'mid_time' | 'high_time' | 'typed';
}

function loadInterest(): InterestRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InterestRecord[];
  } catch {
    return [];
  }
}

function saveInterest(records: InterestRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* ignore quota errors */
  }
}

function classifyPilotStage(profile: OperatorPathwayProfile): InterestRecord['pilotStage'] {
  const hours =
    typeof profile.total_flight_hours === 'string'
      ? parseFloat(profile.total_flight_hours)
      : typeof profile.total_flight_hours === 'number'
        ? profile.total_flight_hours
        : 0;
  const typeRatings = profile.type_ratings ?? [];

  if (typeRatings.length > 0) return 'typed';
  if (hours >= 3000) return 'high_time';
  if (hours >= 1000) return 'mid_time';
  if (hours >= 200) return 'low_time';
  return 'cadet';
}

// --- Public API: Interest Submission ----------------------------------------

/**
 * Submit pilot interest in an operator.
 * This is the "buy" action — the pilot is signaling demand.
 */
export function submitInterest(
  operatorId: string,
  pilotId: string,
  profile: OperatorPathwayProfile
): void {
  const records = loadInterest();
  const existing = records.find(
    (r) => r.operatorId === operatorId && r.pilotId === pilotId
  );
  if (existing) return; // already interested

  records.push({
    operatorId,
    pilotId,
    timestamp: new Date().toISOString(),
    pilotStage: classifyPilotStage(profile),
  });
  saveInterest(records);
}

/** Remove pilot interest in an operator (the "sell" action) */
export function withdrawInterest(operatorId: string, pilotId: string): void {
  const records = loadInterest().filter(
    (r) => !(r.operatorId === operatorId && r.pilotId === pilotId)
  );
  saveInterest(records);
}

/** Check if a pilot has expressed interest in an operator */
export function hasInterest(operatorId: string, pilotId: string): boolean {
  return loadInterest().some(
    (r) => r.operatorId === operatorId && r.pilotId === pilotId
  );
}

/** Get all operators a pilot is interested in */
export function getPilotInterests(pilotId: string): string[] {
  return loadInterest()
    .filter((r) => r.pilotId === pilotId)
    .map((r) => r.operatorId);
}

// --- Market Signal Computation ----------------------------------------------

/**
 * Compute market signal for a single operator.
 * Aggregates all pilot interest as a demand indicator.
 */
export function computeMarketSignal(operatorId: string): MarketSignal {
  const records = loadInterest().filter((r) => r.operatorId === operatorId);
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const weeklyInterest = records.filter(
    (r) => new Date(r.timestamp) >= oneWeekAgo
  ).length;
  const monthlyInterest = records.filter(
    (r) => new Date(r.timestamp) >= oneMonthAgo
  ).length;

  // Trend: compare last 2 weeks
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const lastWeek = records.filter(
    (r) => new Date(r.timestamp) >= oneWeekAgo
  ).length;
  const prevWeek = records.filter((r) => {
    const ts = new Date(r.timestamp);
    return ts >= twoWeeksAgo && ts < oneWeekAgo;
  }).length;

  let interestTrend: MarketSignal['interestTrend'] = 'stable';
  if (lastWeek > prevWeek * 1.3) interestTrend = 'rising';
  else if (lastWeek < prevWeek * 0.7) interestTrend = 'declining';

  const byStage = {
    cadet: records.filter((r) => r.pilotStage === 'cadet').length,
    lowTime: records.filter((r) => r.pilotStage === 'low_time').length,
    midTime: records.filter((r) => r.pilotStage === 'mid_time').length,
    highTime: records.filter((r) => r.pilotStage === 'high_time').length,
    typed: records.filter((r) => r.pilotStage === 'typed').length,
  };

  return {
    operatorId,
    totalInterest: records.length,
    interestTrend,
    weeklyInterest,
    monthlyInterest,
    interestedPilotsByStage: byStage,
    matchRate: 0, // populated by hook when gap analysis is available
    lastUpdated: now.toISOString(),
  };
}

/**
 * Compute market signals for all operators.
 */
export function computeAllMarketSignals(operatorIds: string[]): Map<string, MarketSignal> {
  const map = new Map<string, MarketSignal>();
  for (const id of operatorIds) {
    map.set(id, computeMarketSignal(id));
  }
  return map;
}

// --- Market Overview (the "index" view) -------------------------------------

/**
 * Compute a market overview across all operators.
 * Like a stock market index showing open/closed status and trends.
 */
export function computeMarketOverview(pathways: OperatorPathway[]): MarketOverview {
  const statusCounts = { open: 0, accepting: 0, paused: 0, closed: 0, coming_soon: 0 };
  let totalOpenPositions = 0;
  const categoryInterest = new Map<OperatorCategory, number>();
  const countryInterest = new Map<string, number>();

  for (const p of pathways) {
    statusCounts[p.marketStatus]++;
    if (p.enrichment?.hiring) {
      totalOpenPositions += p.enrichment.hiring.totalOpenPositions;
    }

    const signal = computeMarketSignal(p.id);
    const interest = signal.totalInterest;
    if (interest > 0) {
      categoryInterest.set(
        p.category,
        (categoryInterest.get(p.category) ?? 0) + interest
      );
      countryInterest.set(
        p.country,
        (countryInterest.get(p.country) ?? 0) + interest
      );
    }
  }

  // Trending = top 5 by total interest
  const trending = pathways
    .map((p) => ({ id: p.id, interest: computeMarketSignal(p.id).totalInterest }))
    .filter((x) => x.interest > 0)
    .sort((a, b) => b.interest - a.interest)
    .slice(0, 5)
    .map((x) => x.id);

  // Hot categories = top 3 by interest
  const hotCategories = [...categoryInterest.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);

  // Hot countries = top 3 by interest
  const hotCountries = [...countryInterest.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([country]) => country);

  const totalInterest = pathways.reduce(
    (sum, p) => sum + computeMarketSignal(p.id).totalInterest,
    0
  );

  return {
    totalOperators: pathways.length,
    openCount: statusCounts.open,
    acceptingCount: statusCounts.accepting,
    pausedCount: statusCounts.paused,
    closedCount: statusCounts.closed,
    comingSoonCount: statusCounts.coming_soon,
    totalOpenPositions,
    totalInterest,
    trendingOperators: trending,
    hotCategories,
    hotCountries,
    lastUpdated: new Date().toISOString(),
  };
}

// --- Filtering / Sorting helpers (the "screener") ---------------------------

export interface MarketFilter {
  status?: MarketStatus | 'all';
  category?: OperatorCategory | 'all';
  country?: string | 'all';
  minMatch?: number;
  eligibleOnly?: boolean;
  interestedOnly?: boolean;
  pilotId?: string;
  sortBy?: 'match' | 'interest' | 'name' | 'status' | 'gaps';
}

/**
 * Filter and sort operators like a stock screener.
 */
export function screenOperators(
  pathways: OperatorPathway[],
  filter: MarketFilter
): OperatorPathway[] {
  let result = [...pathways];

  if (filter.status && filter.status !== 'all') {
    result = result.filter((p) => p.marketStatus === filter.status);
  }
  if (filter.category && filter.category !== 'all') {
    result = result.filter((p) => p.category === filter.category);
  }
  if (filter.country && filter.country !== 'all') {
    result = result.filter((p) => p.country === filter.country);
  }
  if (filter.minMatch != null) {
    result = result.filter((p) => p.match >= filter.minMatch!);
  }
  if (filter.eligibleOnly) {
    result = result.filter((p) => p.gapAnalysis?.eligible === true);
  }
  if (filter.interestedOnly && filter.pilotId) {
    const interests = new Set(getPilotInterests(filter.pilotId));
    result = result.filter((p) => interests.has(p.id));
  }

  // Sort
  const sortBy = filter.sortBy ?? 'match';
  switch (sortBy) {
    case 'match':
      result.sort((a, b) => b.match - a.match);
      break;
    case 'interest':
      result.sort(
        (a, b) =>
          (b.marketSignal?.totalInterest ?? 0) - (a.marketSignal?.totalInterest ?? 0)
      );
      break;
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'status':
      result.sort((a, b) => {
        const order: MarketStatus[] = ['open', 'accepting', 'coming_soon', 'paused', 'closed'];
        return order.indexOf(a.marketStatus) - order.indexOf(b.marketStatus);
      });
      break;
    case 'gaps':
      result.sort((a, b) => (a.gapAnalysis?.criticalGaps ?? 99) - (b.gapAnalysis?.criticalGaps ?? 99));
      break;
  }

  return result;
}

// --- Similar Operators (the "peer comparison") ------------------------------

/**
 * Find similar operators based on category, country, and fleet overlap.
 * Like finding peer stocks in the same sector.
 */
export function findSimilarOperators(
  target: OperatorPathway,
  all: OperatorPathway[],
  limit = 5
): string[] {
  const targetFleet = new Set(
    (target.enrichment?.fleet ?? []).map((f) => f.toUpperCase())
  );

  const scored = all
    .filter((p) => p.id !== target.id)
    .map((p) => {
      let score = 0;
      if (p.category === target.category) score += 40;
      if (p.country === target.country) score += 30;
      const fleet = new Set((p.enrichment?.fleet ?? []).map((f) => f.toUpperCase()));
      for (const f of targetFleet) {
        if (fleet.has(f)) score += 10;
      }
      if (p.marketStatus === 'open' || p.marketStatus === 'accepting') score += 5;
      return { id: p.id, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((x) => x.id);
}

// --- Re-export gap analysis for convenience ---------------------------------

export { batchAnalyzeGaps, type GapAnalysisResult };
