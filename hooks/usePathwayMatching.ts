// Pathway Matching Hook - Browser-Based Calculation
// All matching happens locally in the browser for privacy and speed

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/shared/supabase';
import { 
  pathwayEngine, 
  extractPilotProfile, 
  cachePathways, 
  getCachedPathways,
  cacheMatches,
  getCachedMatches,
  type LocalPilotProfile 
} from '../lib/pathways/pathwayMatchingEngine';
import type { PathwayMatch, MatchCalculationResult, GapAnalysis, Pathway } from '../lib/pathways/types';

interface UsePathwayMatchingOptions {
  pilotId?: string;
  autoCalculate?: boolean;
  limit?: number;
}

interface UsePathwayMatchingReturn {
  matches: PathwayMatch[];
  topMatches: PathwayMatch[];
  qualifiedMatches: PathwayMatch[];
  loading: boolean;
  error: string | null;
  recalculate: () => void;
  expressInterest: (matchId: string) => void;
  pilotSummary: MatchCalculationResult['pilot_summary'] | null;
}

export function usePathwayMatching({
  pilotId,
  autoCalculate = true,
  limit = 50
}: UsePathwayMatchingOptions): UsePathwayMatchingReturn {
  const [matches, setMatches] = useState<PathwayMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pilotSummary, setPilotSummary] = useState<MatchCalculationResult['pilot_summary'] | null>(null);
  const engineRef = useRef(pathwayEngine);

  // Load pathways and pilot profile, then calculate matches
  const calculateMatches = useCallback(async (forceRecalculate = false) => {
    if (!pilotId) {
      setError('No pilot ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Load pathways (from cache or fetch)
      let pathways: Pathway[] | null = forceRecalculate ? null : getCachedPathways();
      
      if (!pathways) {
        const { data: pathwayData, error: pathwayError } = await supabase
          .from('pathways')
          .select('*')
          .eq('status', 'active')
          .order('featured', { ascending: false })
          .order('display_order', { ascending: true });

        if (pathwayError) throw pathwayError;
        pathways = pathwayData || [];
        cachePathways(pathways);
      }

      // Set pathways in engine
      engineRef.current.setPathways(pathways);

      // Step 2: Load pilot profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', pilotId)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Profile not found');

      // Convert to local format
      const localProfile: LocalPilotProfile = extractPilotProfile(profile);
      engineRef.current.setPilotProfile(localProfile);

      // Step 3: Calculate matches (happens synchronously in browser)
      const calculatedMatches = engineRef.current.recalculate();
      
      // Cache results
      cacheMatches(calculatedMatches);

      // Update state
      setMatches(calculatedMatches.slice(0, limit));
      
      // Calculate profile readiness (same formula as Align Profile)
      let profileReadiness = 0;
      if (localProfile.total_flight_hours > 0) profileReadiness += 20;
      if (localProfile.ratings.length > 0) profileReadiness += 20;
      if (localProfile.medical_class && localProfile.medical_expiry) profileReadiness += 20;
      if (localProfile.icao_english_level && localProfile.icao_english_level !== '0') profileReadiness += 20;
      if (localProfile.type_ratings.length > 0) profileReadiness += 20;
      
      setPilotSummary({
        total_hours: localProfile.total_flight_hours,
        ratings_count: localProfile.ratings.length,
        recognition_score: localProfile.recognition_score,
        medical_status: localProfile.medical_expiry && new Date(localProfile.medical_expiry) > new Date() 
          ? 'valid' 
          : 'expired',
        pilot_name: profile.full_name || profile.display_name || undefined,
        license_type: profile.license_type || profile.highest_certification || undefined,
        profile_readiness: profileReadiness
      });

    } catch (err: any) {
      console.error('Pathway matching error:', err);
      setError(err.message || 'Failed to calculate pathway matches');
      
      // Fallback to cached matches
      const cached = getCachedMatches();
      if (cached) {
        setMatches(cached.slice(0, limit));
      }
    } finally {
      setLoading(false);
    }
  }, [pilotId, limit]);

  // Subscribe to real-time engine updates
  useEffect(() => {
    const unsubscribe = engineRef.current.subscribe((updatedMatches) => {
      setMatches(updatedMatches.slice(0, limit));
    });

    return unsubscribe;
  }, [limit]);

  const recalculate = useCallback(() => {
    calculateMatches(true);
  }, [calculateMatches]);

  const expressInterest = useCallback((matchId: string) => {
    if (!pilotId) return;

    // Update local state immediately (optimistic update)
    setMatches(prev => prev.map(m => 
      m.id === matchId 
        ? { ...m, pilot_interested: true, pilot_interested_at: new Date().toISOString() }
        : m
    ));

    // Optionally sync to server (fire-and-forget)
    supabase
      .from('pathway_matches')
      .upsert({
        id: matchId,
        pilot_id: pilotId,
        pilot_interested: true,
        pilot_interested_at: new Date().toISOString()
      })
      .then(({ error }) => {
        if (error) console.error('Failed to sync interest:', error);
      });
  }, [pilotId]);

  useEffect(() => {
    if (autoCalculate && pilotId) {
      calculateMatches(false);
    }
  }, [autoCalculate, pilotId, calculateMatches]);

  // Filter matches
  const topMatches = matches.slice(0, 5);
  const qualifiedMatches = matches.filter(m => m.status === 'qualified' || m.match_score >= 85);

  return {
    matches,
    topMatches,
    qualifiedMatches,
    loading,
    error,
    recalculate,
    expressInterest,
    pilotSummary
  };
}

// Hook for fetching pathways (for non-logged in users)
export function usePathways(options?: { 
  category?: string; 
  featured?: boolean; 
  hiringStatus?: string;
  limit?: number;
}) {
  const [pathways, setPathways] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPathways = async () => {
      setLoading(true);
      
      try {
        let query = supabase
          .from('pathways')
          .select('*')
          .eq('status', 'active')
          .order('featured', { ascending: false })
          .order('display_order', { ascending: true });

        if (options?.category) {
          query = query.eq('category', options.category);
        }
        
        if (options?.featured) {
          query = query.eq('featured', true);
        }
        
        if (options?.hiringStatus) {
          query = query.eq('hiring_status', options.hiringStatus);
        }
        
        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        
        setPathways(data || []);
      } catch (err: any) {
        console.error('Fetch pathways error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPathways();
  }, [options?.category, options?.featured, options?.hiringStatus, options?.limit]);

  return { pathways, loading, error };
}

// Hook for gap analysis - browser-based
export function useGapAnalysis(match?: PathwayMatch): {
  analysis: GapAnalysis | null;
  loading: boolean;
} {
  const [analysis, setAnalysis] = useState<GapAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!match) {
      setAnalysis(null);
      return;
    }

    setLoading(true);
    
    // Build gap analysis from match data (browser-based)
    const gaps: GapAnalysis['gaps'] = [];
    
    (match.missing_requirements || []).forEach((req: string) => {
      let type: GapAnalysis['gaps'][0]['type'] = 'other';
      
      if (req.toLowerCase().includes('hour') || req.toLowerCase().includes('hours')) {
        type = 'hours';
      } else if (req.toLowerCase().includes('rating') || req.toLowerCase().includes('atpl') || req.toLowerCase().includes('cpl')) {
        type = 'rating';
      } else if (req.toLowerCase().includes('medical')) {
        type = 'medical';
      } else if (req.toLowerCase().includes('english') || req.toLowerCase().includes('icao')) {
        type = 'english';
      } else if (req.toLowerCase().includes('age')) {
        type = 'age';
      }
      
      gaps.push({
        type,
        description: req,
        current_value: 'N/A',
        required_value: 'N/A'
      });
    });

    const gapAnalysis: GapAnalysis = {
      pathway_id: match.pathway_id,
      pathway_name: match.pathways?.name || 'Unknown Pathway',
      current_match_score: match.match_score,
      gaps,
      total_gaps: gaps.length,
      critical_gaps: gaps.filter((g) => g.type === 'medical' || g.type === 'rating').length,
      estimated_time_to_qualify: gaps.length > 3 ? '12-18 months' : gaps.length > 0 ? '6-12 months' : 'Ready now'
    };

    setAnalysis(gapAnalysis);
    setLoading(false);
  }, [match]);

  return { analysis, loading };
}
