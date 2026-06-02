// Pathway Matching Engine - Browser-based calculation
// All calculations happen locally in browser state for privacy and speed

import type { Pathway, PathwayRequirements, PathwayMatch, PilotProfile } from './types';

// External job type for BetterJobs and other sources
export interface ExternalJob {
  id: string;
  source: 'betterjobs' | 'betteraviationjobs' | 'indeed' | 'linkedin' | 'other';
  title: string;
  airline_name: string;
  location: string;
  description: string;
  external_url: string;
  min_hours: number | null;
  required_ratings: string[];
  required_type_ratings: string[];
  required_medical_class: string | null;
  required_english_level: number | null;
  posted_at: string;
  salary_range: string | null;
}

// Pilot profile data structure (subset of full profile)
export interface LocalPilotProfile {
  id: string;
  total_flight_hours: number;
  pic_hours: number;
  multi_engine_hours: number;
  instrument_hours: number;
  ratings: string[];
  type_ratings: string[];
  medical_class: string;
  medical_expiry: string | null;
  icao_english_level: string;
  age: number | null;
  citizenship: string;
  country: string;
  recognition_score: number;
  last_flown_date: string | null;
}

// Match calculation weights
const WEIGHTS = {
  hours: 0.30,
  ratings: 0.25,
  medical: 0.20,
  location: 0.15,
  recognition: 0.10
};

export class PathwayMatchingEngine {
  private pathways: Pathway[] = [];
  private externalJobs: ExternalJob[] = [];
  private pilotProfile: LocalPilotProfile | null = null;
  private matches: PathwayMatch[] = [];
  private jobMatches: PathwayMatch[] = []; // For external jobs
  private listeners: Set<(matches: PathwayMatch[]) => void> = new Set();
  private jobListeners: Set<(matches: PathwayMatch[]) => void> = new Set();

  // Initialize with pathways data
  setPathways(pathways: Pathway[]) {
    this.pathways = pathways;
    this.recalculateIfReady();
  }

  // Update pilot profile
  setPilotProfile(profile: LocalPilotProfile) {
    this.pilotProfile = profile;
    this.recalculateIfReady();
  }

  // Get current matches
  getMatches(): PathwayMatch[] {
    return [...this.matches];
  }

  // Get top matches
  getTopMatches(limit: number = 5): PathwayMatch[] {
    return this.matches
      .filter(m => m.match_score >= 60)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, limit);
  }

  // Get qualified matches (80%+ match)
  getQualifiedMatches(): PathwayMatch[] {
    return this.matches
      .filter(m => m.match_score >= 80)
      .sort((a, b) => b.match_score - a.match_score);
  }

  // Subscribe to match updates
  subscribe(listener: (matches: PathwayMatch[]) => void): () => void {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.matches);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Force recalculation
  recalculate(): PathwayMatch[] {
    return this.calculateMatches();
  }

  // Set external jobs from BetterJobs API
  setExternalJobs(jobs: ExternalJob[]) {
    this.externalJobs = jobs;
    this.recalculateJobsIfReady();
  }

  // Get external jobs
  getExternalJobs(): ExternalJob[] {
    return this.externalJobs;
  }

  // Calculate matches for external jobs
  calculateJobMatches(): PathwayMatch[] {
    if (!this.pilotProfile || this.externalJobs.length === 0) return [];

    const now = new Date().toISOString();
    const pilotId = this.pilotProfile.id;

    const matches: PathwayMatch[] = this.externalJobs.map(job => {
      const score = this.calculateJobMatchScore(job);
      return {
        id: `job_${job.id}`,
        pilot_id: pilotId,
        pathway_id: job.id,
        match_score: Math.round(score),
        hours_match: job.min_hours ? Math.min(this.pilotProfile!.total_flight_hours / job.min_hours * 100, 100) : 100,
        ratings_match: 100, // Simplified
        medical_match: 100,
        location_match: 100,
        recognition_match: Math.min(this.pilotProfile!.recognition_score, 100),
        missing_requirements: [],
        gaps_count: 0,
        status: score >= 80 ? 'qualified' : score >= 60 ? 'eligible' : 'declined',
        priority: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low',
        pilot_interested: false,
        pilot_interested_at: null,
        calculated_at: now,
        expires_at: job.posted_at || now,
        created_at: now,
        updated_at: now,
        pathways: {
          id: job.id,
          name: job.title,
          airline_name: job.airline_name,
          location: job.location,
          description: job.description,
          salary_range: job.salary_range,
          external_url: job.external_url
        } as any
      };
    });

    matches.sort((a, b) => b.match_score - a.match_score);
    this.jobMatches = matches;
    return matches;
  }

  private calculateJobMatchScore(job: ExternalJob): number {
    if (!this.pilotProfile) return 0;

    let score = 0;
    const profile = this.pilotProfile;

    // Hours match (35% weight)
    if (job.min_hours) {
      const hoursRatio = Math.min(profile.total_flight_hours / job.min_hours, 1.5);
      score += Math.min(hoursRatio * 35, 35);
    } else {
      score += 35;
    }

    // Ratings match (25% weight)
    if (job.required_ratings.length > 0) {
      const matchedRatings = job.required_ratings.filter(r => 
        profile.ratings.some(pr => pr.toLowerCase().includes(r.toLowerCase()))
      );
      score += (matchedRatings.length / job.required_ratings.length) * 25;
    } else {
      score += 25;
    }

    // Medical class (20% weight)
    if (job.required_medical_class) {
      const classMatch = profile.medical_class === job.required_medical_class;
      score += classMatch ? 20 : 0;
    } else {
      score += 20;
    }

    // Recognition score bonus (up to 20%)
    score += Math.min(profile.recognition_score / 5, 20);

    return Math.min(Math.round(score), 100);
  }

  private recalculateJobsIfReady() {
    if (this.pilotProfile && this.externalJobs.length > 0) {
      this.calculateJobMatches();
    }
  }

  private recalculateIfReady() {
    if (this.pathways.length > 0 && this.pilotProfile) {
      this.calculateMatches();
    }
  }

  private calculateMatches(): PathwayMatch[] {
    if (!this.pilotProfile) return [];

    this.matches = this.pathways.map(pathway => {
      const match = this.calculateSingleMatch(this.pilotProfile!, pathway);
      return {
        ...match,
        pathway_id: pathway.id,
        pilot_id: this.pilotProfile!.id,
        status: this.determineStatus(match.match_score, match.gaps_count),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    // Sort by match score descending
    this.matches.sort((a, b) => b.match_score - a.match_score);

    // Notify listeners
    this.listeners.forEach(listener => listener([...this.matches]));

    return this.matches;
  }

  private calculateSingleMatch(
    pilot: LocalPilotProfile,
    pathway: Pathway
  ): Omit<PathwayMatch, 'pathway_id' | 'pilot_id' | 'status' | 'created_at' | 'updated_at'> {
    const req = pathway.requirements;
    const missing: string[] = [];

    // Hours match (30% weight)
    const pilotHours = pilot.total_flight_hours || 0;
    const hoursScore = req.min_total_hours > 0
      ? Math.min(100, (pilotHours / req.min_total_hours) * 100)
      : 100;

    if (pilotHours < req.min_total_hours) {
      const needed = req.min_total_hours - pilotHours;
      missing.push(`${needed} more flight hours needed (${pilotHours}/${req.min_total_hours})`);
    }

    // PIC hours check
    if (req.min_pic_hours > 0 && pilot.pic_hours < req.min_pic_hours) {
      const needed = req.min_pic_hours - pilot.pic_hours;
      missing.push(`${needed} more PIC hours needed`);
    }

    // Multi-engine hours check
    if (req.min_multi_engine_hours > 0 && pilot.multi_engine_hours < req.min_multi_engine_hours) {
      const needed = req.min_multi_engine_hours - pilot.multi_engine_hours;
      missing.push(`${needed} more multi-engine hours needed`);
    }

    // Ratings match (25% weight)
    const pilotRatings = pilot.ratings || [];
    const requiredRatings = req.required_ratings || [];
    const matchedRatings = requiredRatings.filter(r =>
      pilotRatings.some(pr => pr.toLowerCase().includes(r.toLowerCase()))
    );
    const ratingsScore = requiredRatings.length > 0
      ? (matchedRatings.length / requiredRatings.length) * 100
      : 100;

    const missingRatings = requiredRatings.filter(r =>
      !pilotRatings.some(pr => pr.toLowerCase().includes(r.toLowerCase()))
    );
    missingRatings.forEach(r => missing.push(`${r} rating required`));

    // Type ratings check
    if (req.required_type_ratings?.length > 0) {
      const pilotTypeRatings = pilot.type_ratings || [];
      const missingTypeRatings = req.required_type_ratings.filter(tr =>
        !pilotTypeRatings.some(ptr => ptr.toLowerCase().includes(tr.toLowerCase()))
      );
      missingTypeRatings.forEach(tr => missing.push(`${tr} type rating required`));
    }

    // Medical match (20% weight)
    const pilotMedical = parseInt(pilot.medical_class || '0');
    const requiredMedical = parseInt(req.medical_class_required || '0');
    const medicalScore = pilotMedical >= requiredMedical ? 100 : 0;

    if (pilotMedical < requiredMedical) {
      missing.push(`Class ${req.medical_class_required} medical certificate required (have Class ${pilotMedical})`);
    }

    // Medical expiry check
    if (!pilot.medical_expiry || new Date(pilot.medical_expiry) < new Date()) {
      missing.push('Current medical certificate required (expired or not held)');
    }

    // Location match (15% weight) - simplified geography match
    const locationScore = this.calculateLocationScore(pilot.country, pathway.bases);

    // Recognition score match (10% weight)
    const recognitionScore = Math.min(100, pilot.recognition_score || 50);

    // Weighted total
    const matchScore = Math.round(
      hoursScore * WEIGHTS.hours +
      ratingsScore * WEIGHTS.ratings +
      medicalScore * WEIGHTS.medical +
      locationScore * WEIGHTS.location +
      recognitionScore * WEIGHTS.recognition
    );

    // English level check
    const pilotEnglish = parseInt(pilot.icao_english_level || '0');
    const requiredEnglish = parseInt(req.english_level_required || '4');
    if (pilotEnglish < requiredEnglish) {
      missing.push(`ICAO English Level ${req.english_level_required}+ (currently Level ${pilotEnglish})`);
    }

    // Age requirements
    if (req.max_age && pilot.age && pilot.age > req.max_age) {
      missing.push(`Maximum age ${req.max_age} (currently ${pilot.age})`);
    }
    if (req.min_age && pilot.age && pilot.age < req.min_age) {
      missing.push(`Minimum age ${req.min_age} (currently ${pilot.age})`);
    }

    // Additional requirements (non-blocking but tracked)
    if (req.additional_requirements?.length > 0) {
      req.additional_requirements
        .filter(r => !r.toLowerCase().includes('preferred') && !r.toLowerCase().includes('desired'))
        .forEach(r => missing.push(r));
    }

    // Priority based on match score
    let priority: 'high' | 'medium' | 'low' = 'low';
    if (matchScore >= 85) priority = 'high';
    else if (matchScore >= 60) priority = 'medium';

    // Recency decay (penalty for not flying recently)
    let timeDecay = 1.0;
    if (pilot.last_flown_date) {
      const lastFlown = new Date(pilot.last_flown_date);
      const monthsSince = (Date.now() - lastFlown.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsSince > 12) {
        timeDecay = 0.7;
        missing.push('Recent flight experience recommended (>12 months since last flight)');
      } else if (monthsSince > 6) {
        timeDecay = 0.85;
      }
    }

    // Apply time decay to final score
    const finalScore = Math.round(matchScore * timeDecay);

    return {
      id: `${pilot.id}-${pathway.id}`,
      match_score: finalScore,
      hours_match: Math.round(hoursScore),
      ratings_match: Math.round(ratingsScore),
      medical_match: medicalScore,
      location_match: Math.round(locationScore),
      recognition_match: recognitionScore,
      missing_requirements: missing,
      gaps_count: missing.length,
      priority,
      pilot_interested: false,
      pilot_interested_at: null,
      calculated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private calculateLocationScore(pilotCountry: string, bases: any[]): number {
    if (!bases || bases.length === 0) return 75; // Neutral if no base info
    
    // Check if pilot's country matches any base country
    const pilotCountryLower = pilotCountry?.toLowerCase() || '';
    const matchingBases = bases.filter(b => 
      b.country?.toLowerCase() === pilotCountryLower ||
      b.region?.toLowerCase().includes(pilotCountryLower)
    );
    
    if (matchingBases.length > 0) return 100; // Perfect match
    return 60; // Some distance but still viable
  }

  private determineStatus(matchScore: number, gapsCount: number): PathwayMatch['status'] {
    if (matchScore >= 90 && gapsCount === 0) return 'qualified';
    if (matchScore >= 80) return 'eligible';
    if (matchScore >= 60) return 'eligible';
    return 'declined';
  }
}

// Singleton instance for app-wide state
export const pathwayEngine = new PathwayMatchingEngine();

// Helper to convert full profile to local format
export function extractPilotProfile(fullProfile: any): LocalPilotProfile {
  // Parse hours from various possible fields
  const totalHours = fullProfile.total_flight_hours || 
    parseFloat(fullProfile.current_flight_hours) || 0;

  // Extract ratings from array or string
  let ratings: string[] = [];
  if (Array.isArray(fullProfile.ratings)) {
    ratings = fullProfile.ratings;
  } else if (typeof fullProfile.ratings === 'string') {
    ratings = fullProfile.ratings.split(',').map((r: string) => r.trim());
  }

  // Extract type ratings
  let typeRatings: string[] = [];
  if (fullProfile.aircraft_rated_on) {
    typeRatings = fullProfile.aircraft_rated_on.split(',').map((r: string) => r.trim());
  }

  return {
    id: fullProfile.id,
    total_flight_hours: totalHours,
    pic_hours: fullProfile.pic_hours || Math.floor(totalHours * 0.3), // Estimate if not specified
    multi_engine_hours: fullProfile.multi_engine_hours || 0,
    instrument_hours: fullProfile.instrument_hours || 0,
    ratings,
    type_ratings: typeRatings,
    medical_class: fullProfile.medical_class || fullProfile.medical_class_required || '0',
    medical_expiry: fullProfile.medical_expiry,
    icao_english_level: fullProfile.language_icao_level || fullProfile.english_proficiency_level || '0',
    age: fullProfile.date_of_birth ? calculateAge(fullProfile.date_of_birth) : null,
    citizenship: fullProfile.nationality || fullProfile.country || '',
    country: fullProfile.country || '',
    recognition_score: fullProfile.overall_recognition_score || 50,
    last_flown_date: fullProfile.last_flown || fullProfile.last_flight_date || null
  };
}

function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Local storage helpers for caching
const STORAGE_KEYS = {
  pathways: 'pathway_cache',
  matches: 'pathway_matches_cache',
  profile: 'pilot_profile_cache'
};

export function cachePathways(pathways: Pathway[]) {
  localStorage.setItem(STORAGE_KEYS.pathways, JSON.stringify({
    data: pathways,
    timestamp: Date.now()
  }));
}

export function getCachedPathways(): Pathway[] | null {
  const cached = localStorage.getItem(STORAGE_KEYS.pathways);
  if (!cached) return null;
  
  try {
    const { data, timestamp } = JSON.parse(cached);
    // Cache valid for 1 hour
    if (Date.now() - timestamp > 60 * 60 * 1000) return null;
    return data;
  } catch {
    return null;
  }
}

export function cacheMatches(matches: PathwayMatch[]) {
  localStorage.setItem(STORAGE_KEYS.matches, JSON.stringify({
    data: matches,
    timestamp: Date.now()
  }));
}

export function getCachedMatches(): PathwayMatch[] | null {
  const cached = localStorage.getItem(STORAGE_KEYS.matches);
  if (!cached) return null;
  
  try {
    const { data, timestamp } = JSON.parse(cached);
    // Cache valid for 30 minutes
    if (Date.now() - timestamp > 30 * 60 * 1000) return null;
    return data;
  } catch {
    return null;
  }
}
