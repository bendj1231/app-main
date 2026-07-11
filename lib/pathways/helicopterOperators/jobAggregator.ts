// Job Aggregator
// Converts existing job data (from PilotJobDatabasePage) into structured
// JobListing objects, and provides a mechanism to fetch/parse jobs from
// external job boards like pilotcareercenter.com and betterjobs.com.
//
// The platform is a career alignment UI layer on top of job boards.
// We don't host applications — we align pilots to jobs and redirect.

import {
  JobListing,
  JobSource,
  JobSourceName,
  JobRequirements,
  JobCategory,
  JobSeat,
  JobHiringStatus,
  JobFeed,
  PilotJobProfile,
  JobAlignmentResult,
} from './jobAlignmentTypes';
import { batchAlignJobs, screenJobs, computeJobFeedStats } from './jobAlignment';

// ============================================================================
// EXISTING JOB DATA ADAPTER
// ============================================================================

/** Shape of the existing jobApplicationListings entries */
interface RawJobEntry {
  title: string;
  company: string;
  aircraft: string;
  location: string;
  role: string;
  url: string;
  posted: string;
  status: string;
  applicationUrl: string;
  flightTime: string;
  license: string;
  visaSponsorship?: string;
  picTime: string;
  picInTypeTime: string;
  typeRating: string;
  medicalClass: string;
  icaoElpLevel: string;
  compensation: string;
  jobDescription?: string;
  jobExpectations?: string;
  companyWebsite?: string;
  source?: string;
}

/**
 * Convert a raw job entry from PilotJobDatabasePage into a structured JobListing.
 */
export function adaptRawJob(entry: RawJobEntry, index: number): JobListing {
  const url = entry.url || '';
  const sourceName = detectJobSource(url);
  const isRedirect = url.includes('pilotcareercenter.com/redirect') ||
    !!entry.applicationUrl?.includes('pilotcareercenter.com/redirect');

  return {
    id: `job-${index}`,
    title: entry.title,
    company: entry.company,
    aircraft: entry.aircraft,
    location: entry.location,
    role: entry.role,
    seat: detectSeat(entry.role),
    category: detectCategory(entry.aircraft, entry.role, entry.company),
    url,
    posted: entry.posted,
    status: detectHiringStatus(entry.status),
    applicationUrl: entry.applicationUrl || '',
    source: {
      name: sourceName,
      originalUrl: url,
      applicationUrl: entry.applicationUrl || undefined,
      isRedirect,
    },
    requirements: {
      minTotalHours: parseHours(entry.flightTime),
      minPicHours: parseHours(entry.picTime),
      minPicInTypeHours: parseHours(entry.picInTypeTime),
      licenseRequired: entry.license || '',
      typeRatingRequired: entry.typeRating || '',
      medicalClass: entry.medicalClass || '',
      icaoElpLevel: entry.icaoElpLevel || '',
    },
    compensation: entry.compensation || undefined,
    visaSponsorship: entry.visaSponsorship || undefined,
    jobDescription: entry.jobDescription,
    jobExpectations: entry.jobExpectations,
    companyWebsite: entry.companyWebsite,
    operatorSlug: slugify(entry.company),
  };
}

/**
 * Batch convert raw job entries into structured JobListing[].
 * Use this to convert the existing jobApplicationListings array.
 */
export function adaptRawJobs(entries: RawJobEntry[]): JobListing[] {
  return entries.map((entry, index) => adaptRawJob(entry, index));
}

// ============================================================================
// EXTERNAL JOB BOARD FETCHING
// ============================================================================

/**
 * Fetch jobs from pilotcareercenter.com.
 * In production, this would call a backend scraper or API.
 * For now, returns an empty feed — the existing hardcoded data
 * is adapted via adaptRawJobs().
 */
export async function fetchPilotCareerCenterJobs(): Promise<JobFeed> {
  // In production, this would call:
  // - A backend Cloud Function that scrapes pilotcareercenter.com
  // - Or an API if one becomes available
  // - Or a cached feed stored in Firestore/KV
  //
  // The existing jobApplicationListings in PilotJobDatabasePage.tsx
  // already contains 168 jobs scraped from pilotcareercenter.com.
  // Those should be migrated to use adaptRawJobs() and then
  // periodically refreshed via a backend scraper.

  return {
    source: 'pilotcareercenter',
    jobs: [],
    lastUpdated: new Date().toISOString(),
    totalJobs: 0,
  };
}

/**
 * Fetch jobs from betterjobs.com (or similar board).
 * Same pattern as above — would call backend scraper in production.
 */
export async function fetchBetterJobsFeed(): Promise<JobFeed> {
  return {
    source: 'betterjobs',
    jobs: [],
    lastUpdated: new Date().toISOString(),
    totalJobs: 0,
  };
}

/**
 * Fetch airline direct career pages.
 * Many airlines have structured career APIs or job posting pages.
 */
export async function fetchAirlineDirectJobs(): Promise<JobFeed> {
  return {
    source: 'airline_direct',
    jobs: [],
    lastUpdated: new Date().toISOString(),
    totalJobs: 0,
  };
}

/**
 * Aggregate jobs from all sources.
 * In production, this calls multiple backend scrapers in parallel.
 */
export async function aggregateAllJobs(): Promise<{
  feeds: JobFeed[];
  allJobs: JobListing[];
  totalJobs: number;
}> {
  const [pcc, bj, airline] = await Promise.all([
    fetchPilotCareerCenterJobs(),
    fetchBetterJobsFeed(),
    fetchAirlineDirectJobs(),
  ]);

  const feeds = [pcc, bj, airline];
  const allJobs = feeds.flatMap((f) => f.jobs);

  return {
    feeds,
    allJobs,
    totalJobs: allJobs.length,
  };
}

// ============================================================================
// JOB ALIGNMENT HOOK
// ============================================================================

import { useMemo } from 'react';

/**
 * React hook for job alignment.
 * Takes a list of jobs and a pilot profile, returns aligned results.
 */
export function useJobAlignment(jobs: JobListing[], profile: PilotJobProfile | null) {
  const alignments = useMemo(() => {
    if (!profile) return new Map<string, JobAlignmentResult>();
    const results = batchAlignJobs(jobs, profile);
    const map = new Map<string, JobAlignmentResult>();
    for (const r of results) map.set(r.jobId, r);
    return map;
  }, [jobs, profile]);

  const sortedJobs = useMemo(() => {
    if (!profile) return jobs;
    return [...jobs].sort((a, b) => {
      const aScore = alignments.get(a.id)?.alignmentScore ?? 0;
      const bScore = alignments.get(b.id)?.alignmentScore ?? 0;
      return bScore - aScore;
    });
  }, [jobs, alignments, profile]);

  const applyReady = useMemo(
    () => sortedJobs.filter((j) => {
      const a = alignments.get(j.id);
      return a && (a.recommendation === 'apply_now' || a.recommendation === 'apply_with_caveats');
    }),
    [sortedJobs, alignments]
  );

  const blindSpots = useMemo(
    () => sortedJobs.filter((j) => alignments.get(j.id)?.isBlindSpot === true),
    [sortedJobs, alignments]
  );

  const notEligible = useMemo(
    () => sortedJobs.filter((j) => alignments.get(j.id)?.recommendation === 'not_eligible'),
    [sortedJobs, alignments]
  );

  const closeGapsFirst = useMemo(
    () => sortedJobs.filter((j) => alignments.get(j.id)?.recommendation === 'close_gaps_first'),
    [sortedJobs, alignments]
  );

  const stats = useMemo(
    () => computeJobFeedStats(jobs, alignments),
    [jobs, alignments]
  );

  return {
    alignments,
    sortedJobs,
    applyReady,
    blindSpots,
    notEligible,
    closeGapsFirst,
    stats,
  };
}

// ============================================================================
// DETECTION HELPERS
// ============================================================================

function detectJobSource(url: string): JobSourceName {
  if (url.includes('pilotcareercenter.com')) return 'pilotcareercenter';
  if (url.includes('betterjobs')) return 'betterjobs';
  if (url.includes('delta.com') || url.includes('southwest.com') || url.includes('aa.com') ||
      url.includes('united.com') || url.includes('jetblue.com') || url.includes('alaskaair.com')) {
    return 'airline_direct';
  }
  if (url.includes('mhsaviation') || url.includes('pawanhans') || url.includes('cohc.citic')) {
    return 'operator_direct';
  }
  return 'other';
}

function detectSeat(role: string): JobSeat {
  const r = role.toLowerCase();
  if (r.includes('captain') || r.includes('capt')) return 'captain';
  if (r.includes('first officer') || r.includes('f/o') || r.includes('f-o') || r.includes('f/o')) return 'first_officer';
  if (r.includes('cadet')) return 'cadet';
  if (r.includes('instructor') || r.includes('cfi')) return 'instructor';
  if (r.includes('relief')) return 'relief';
  return 'other';
}

function detectCategory(aircraft: string, role: string, company: string): JobCategory {
  const a = aircraft.toLowerCase();
  const c = company.toLowerCase();
  const r = role.toLowerCase();

  // Helicopter operators
  if (a.includes('helicopter') || a.includes('aw139') || a.includes('s-92') ||
      a.includes('as350') || a.includes('h145') || a.includes('ec145') ||
      a.includes('dauphin') || a.includes('mi-17') || a.includes('dhruv') ||
      c.includes('helicopter') || c.includes('pawan hans') || c.includes('mhs aviation') ||
      c.includes('citic offshore') || c.includes('helicopter line')) {
    return 'helicopter';
  }

  // Cargo
  if (a.includes('cargo') || c.includes('fedex') || c.includes('ups') ||
      c.includes('cargo') || c.includes('freight') || r.includes('cargo')) {
    return 'cargo';
  }

  // Corporate / private jet
  if (a.includes('cessna cj') || a.includes('challenger') || a.includes('legacy') ||
      a.includes('global') || a.includes('phenom') || a.includes('gulfstream') ||
      a.includes('falcon') || a.includes('learjet') || a.includes('pc24') || a.includes('pc-24')) {
    return 'corporate';
  }

  // Air ambulance
  if (c.includes('flight doctor') || c.includes('careflight') || c.includes('lifeflight') ||
      r.includes('medevac') || r.includes('hems') || r.includes('ems')) {
    return 'air_ambulance';
  }

  // Agricultural
  if (a.includes('ag') || r.includes('agricultural') || r.includes('spraying')) {
    return 'agricultural';
  }

  // Flight training
  if (r.includes('instructor') || r.includes('cfi') || c.includes('academy') ||
      c.includes('flight school') || c.includes('training')) {
    return 'flight_training';
  }

  // Airline (default for large commercial aircraft)
  if (a.includes('b737') || a.includes('a320') || a.includes('b777') || a.includes('a350') ||
      a.includes('b787') || a.includes('a330') || a.includes('q400') || a.includes('erj') ||
      a.includes('crj') || a.includes('atrs') || a.includes('boeing') || a.includes('airbus')) {
    return 'airline';
  }

  return 'other';
}

function detectHiringStatus(status: string): JobHiringStatus {
  const s = status.toLowerCase();
  if (s.includes('hiring now')) return 'hiring_now';
  if (s.includes('accepting')) return 'accepting_apps';
  if (s.includes('closing')) return 'closing_soon';
  if (s.includes('closed')) return 'closed';
  if (s.includes('coming')) return 'coming_soon';
  return 'accepting_apps';
}

function parseHours(val: string | number | undefined | null): number {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  const cleaned = val.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
