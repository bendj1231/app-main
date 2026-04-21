import { useState, useEffect, useCallback, useRef } from 'react';

// Firebase project URL for pilotrecognition-pathways
const PATHWAYS_BASE_URL = 'https://us-central1-pilotrecognition-pathways.cloudfunctions.net';

export interface RFormulaBreakdown {
  P: number;  // Programs
  ET: number; // Experience × Time Decay
  B: number;  // Behavioral
  L: number;  // Language
  S: number;  // Specialized Skills
}

export interface ScoreInsight {
  factor: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
}

export interface FullScoreResult {
  totalScore: number;
  rankLabel: string;
  profileCompleteness: number;
  breakdown: RFormulaBreakdown;
  scoreVelocity: number;
  velocityLabel: string;
  scoreHistory: { value: number; date: string }[];
  insights: ScoreInsight[];
  totalHours: number;
  typeRatings: string[];
  icaoLevel: number;
}

export interface JobMatchResult {
  jobId: string;
  title: string;
  company: string;
  matchPct: number;
  hoursGap: number;
  missingRating: string | null;
  blindSpotScore: number;
  isBlindSpot: boolean;
  breakdown: { hours: number; typeRating: number; behavioral: number; language: number };
  hiringStatus: string;
}

export interface JobMatchesResult {
  totalJobs: number;
  matchesAbove75: number;
  matchesAbove90: number;
  scoredJobs: JobMatchResult[];
  blindSpotPicks: JobMatchResult[];
  pilotScore: { totalScore: number; B: number; L: number };
}

export interface RoadmapStep {
  step: number;
  title: string;
  status: 'current' | 'active' | 'complete' | 'pending' | 'ready' | 'future';
  description: string;
  metrics?: any;
  gaps?: any[];
  programs?: any[];
  etaMonths?: number;
  targetRole?: string;
  targetAirline?: string;
  estimatedSalary?: string;
}

export interface TypeRatingRec {
  rating: string;
  family: string;
  airlines: string[];
  costUSD: number;
  jobsUnlocked: number;
  priority: string;
  priorityLabel: string;
  roiMonths: number;
  roiLabel: string;
  estimatedScoreImpact: string;
  programLink: string;
}

export interface AirlineMatchResult {
  id: string;
  name: string;
  tier: string;
  matchPct: number;
  hoursGap: number;
  ratingGap: string | null;
  readinessLabel: string;
  readinessColor: string;
  breakdown: { hours: number; typeRating: number; behavioral: number; language: number };
  reqHours: number;
  reqRating: string;
  behavioralFit: boolean;
}

export interface PathwaysIntelligenceState {
  fullScore: FullScoreResult | null;
  jobMatches: JobMatchesResult | null;
  roadmap: { roadmapSteps: RoadmapStep[]; etaMonths: number; programRecommendations: any[] } | null;
  typeRatings: { recommendations: TypeRatingRec[]; currentPortfolio: string[]; coverageScore: number; coverageLabel: string; airlinesAccessible: number } | null;
  airlineMatches: { airlineMatches: AirlineMatchResult[]; readyNow: number; closeReach: number; longTerm: number; globalPercentile: number; percentileLabel: string; grouped: any } | null;
  loadingScore: boolean;
  loadingJobs: boolean;
  loadingRoadmap: boolean;
  loadingTypeRatings: boolean;
  loadingAirlines: boolean;
  errors: Record<string, string>;
}

async function callPathwaysFunction(name: string, method: 'GET' | 'POST', params: any): Promise<any> {
  const url = `${PATHWAYS_BASE_URL}/${name}`;
  let response: Response;
  if (method === 'GET') {
    const qs = new URLSearchParams(params).toString();
    response = await fetch(`${url}?${qs}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  } else {
    response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
  }
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `HTTP ${response.status}`);
  }
  return response.json();
}

export function usePathwaysIntelligence(userId: string | undefined, jobListings: any[] = []) {
  const [state, setState] = useState<PathwaysIntelligenceState>({
    fullScore: null,
    jobMatches: null,
    roadmap: null,
    typeRatings: null,
    airlineMatches: null,
    loadingScore: false,
    loadingJobs: false,
    loadingRoadmap: false,
    loadingTypeRatings: false,
    loadingAirlines: false,
    errors: {},
  });

  const roadmapPathwayRef = useRef<string | null>(null);
  const fetchedForUserRef = useRef<string | null>(null);

  const fetchFullScore = useCallback(async (uid: string) => {
    setState(s => ({ ...s, loadingScore: true }));
    try {
      const data = await callPathwaysFunction('pathways_calculateFullScore', 'GET', { userId: uid });
      setState(s => ({ ...s, fullScore: data, loadingScore: false }));
    } catch (e: any) {
      setState(s => ({ ...s, loadingScore: false, errors: { ...s.errors, score: e.message } }));
    }
  }, []);

  const fetchJobMatches = useCallback(async (uid: string, jobs: any[]) => {
    if (!jobs.length) return;
    setState(s => ({ ...s, loadingJobs: true }));
    try {
      const data = await callPathwaysFunction('pathways_getJobMatches', 'POST', { userId: uid, jobListings: jobs });
      setState(s => ({ ...s, jobMatches: data, loadingJobs: false }));
    } catch (e: any) {
      setState(s => ({ ...s, loadingJobs: false, errors: { ...s.errors, jobs: e.message } }));
    }
  }, []);

  const fetchTypeRatings = useCallback(async (uid: string) => {
    setState(s => ({ ...s, loadingTypeRatings: true }));
    try {
      const data = await callPathwaysFunction('pathways_getTypeRatingRecommendations', 'GET', { userId: uid });
      setState(s => ({ ...s, typeRatings: data, loadingTypeRatings: false }));
    } catch (e: any) {
      setState(s => ({ ...s, loadingTypeRatings: false, errors: { ...s.errors, typeRatings: e.message } }));
    }
  }, []);

  const fetchAirlineMatches = useCallback(async (uid: string) => {
    setState(s => ({ ...s, loadingAirlines: true }));
    try {
      const data = await callPathwaysFunction('pathways_getAirlineExpectationsMatch', 'GET', { userId: uid });
      setState(s => ({ ...s, airlineMatches: data, loadingAirlines: false }));
    } catch (e: any) {
      setState(s => ({ ...s, loadingAirlines: false, errors: { ...s.errors, airlines: e.message } }));
    }
  }, []);

  const fetchRoadmap = useCallback(async (uid: string, pathway: any) => {
    if (!pathway?.id || roadmapPathwayRef.current === pathway.id) return;
    roadmapPathwayRef.current = pathway.id;
    setState(s => ({ ...s, loadingRoadmap: true }));
    try {
      const data = await callPathwaysFunction('pathways_getPathwayRoadmap', 'POST', { userId: uid, pathway });
      setState(s => ({ ...s, roadmap: data, loadingRoadmap: false }));
    } catch (e: any) {
      setState(s => ({ ...s, loadingRoadmap: false, errors: { ...s.errors, roadmap: e.message } }));
    }
  }, []);

  // On mount / userId change — fetch score, type ratings, airline matches
  useEffect(() => {
    if (!userId || fetchedForUserRef.current === userId) return;
    fetchedForUserRef.current = userId;
    fetchFullScore(userId);
    fetchTypeRatings(userId);
    fetchAirlineMatches(userId);
  }, [userId, fetchFullScore, fetchTypeRatings, fetchAirlineMatches]);

  // When job listings are available — fetch job matches
  useEffect(() => {
    if (!userId || !jobListings.length) return;
    fetchJobMatches(userId, jobListings);
  }, [userId, jobListings.length, fetchJobMatches]);

  return { ...state, fetchRoadmap };
}
