/// <reference lib="deno.ns" />
// Pathway Matching Engine - Phase 2
// Calculates match scores between pilot profiles and pathways

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { getCorsHeaders } from '../_shared/cors.ts';

interface PilotProfile {
  id: string;
  total_flight_hours: number;
  current_flight_hours: string | null;
  ratings: string[];
  medical_class: string;
  medical_expiry: string | null;
  language_icao_level: string;
  overall_recognition_score: number;
  country: string;
  aircraft_rated_on: string | null;
}

interface Pathway {
  id: string;
  slug: string;
  name: string;
  category: string;
  operator_name: string;
  requirements: {
    min_total_hours: number;
    min_pic_hours: number;
    min_multi_engine_hours: number;
    required_ratings: string[];
    required_type_ratings: string[];
    medical_class_required: string;
    english_level_required: string;
    max_age: number | null;
    min_age: number | null;
    additional_requirements: string[];
  };
  hiring_status: string;
}

interface MatchResult {
  pathway_id: string;
  match_score: number;
  hours_match: number;
  ratings_match: number;
  medical_match: number;
  location_match: number;
  recognition_match: number;
  missing_requirements: string[];
  gaps_count: number;
  priority: 'high' | 'medium' | 'low';
}

function calculateMatch(pilot: PilotProfile, pathway: Pathway): MatchResult {
  const req = pathway.requirements;
  const missing: string[] = [];
  
  // Parse flight hours
  const pilotHours = pilot.total_flight_hours || 
    parseFloat(pilot.current_flight_hours || '0') || 0;
  
  // Hours match (30% weight)
  const hoursScore = req.min_total_hours > 0 
    ? Math.min(100, (pilotHours / req.min_total_hours) * 100)
    : 100;
  
  if (pilotHours < req.min_total_hours) {
    missing.push(`${req.min_total_hours - pilotHours} more flight hours needed`);
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
  
  // Medical match (20% weight)
  const pilotMedical = parseInt(pilot.medical_class || '0');
  const requiredMedical = parseInt(req.medical_class_required || '0');
  const medicalScore = pilotMedical >= requiredMedical ? 100 : 0;
  
  if (pilotMedical < requiredMedical) {
    missing.push(`Class ${req.medical_class_required} medical certificate required`);
  }
  
  if (!pilot.medical_expiry || new Date(pilot.medical_expiry) < new Date()) {
    missing.push('Current medical certificate required');
  }
  
  // Location match (15% weight) - simplified
  const locationScore = 75; // Default neutral score
  
  // Recognition score match (10% weight)
  const recognitionScore = Math.min(100, pilot.overall_recognition_score || 50);
  
  // Weighted total
  const matchScore = Math.round(
    hoursScore * 0.30 +
    ratingsScore * 0.25 +
    medicalScore * 0.20 +
    locationScore * 0.15 +
    recognitionScore * 0.10
  );
  
  // Priority based on match score
  let priority: 'high' | 'medium' | 'low' = 'low';
  if (matchScore >= 85) priority = 'high';
  else if (matchScore >= 60) priority = 'medium';
  
  // Add type rating requirements to missing
  if (req.required_type_ratings?.length > 0) {
    const pilotTypeRatings = pilot.aircraft_rated_on?.split(',').map(s => s.trim()) || [];
    const missingTypeRatings = req.required_type_ratings.filter(tr =>
      !pilotTypeRatings.some(ptr => ptr.toLowerCase().includes(tr.toLowerCase()))
    );
    missingTypeRatings.forEach(tr => missing.push(`${tr} type rating`));
  }
  
  // Add English level check
  const pilotEnglish = parseInt(pilot.language_icao_level || '0');
  const requiredEnglish = parseInt(req.english_level_required || '4');
  if (pilotEnglish < requiredEnglish) {
    missing.push(`ICAO English Level ${req.english_level_required}+`);
  }
  
  // Add additional requirements
  if (req.additional_requirements?.length > 0) {
    missing.push(...req.additional_requirements.filter(r => 
      !r.toLowerCase().includes('preferred') && !r.toLowerCase().includes('desired')
    ));
  }
  
  return {
    pathway_id: pathway.id,
    match_score: matchScore,
    hours_match: Math.round(hoursScore),
    ratings_match: Math.round(ratingsScore),
    medical_match: medicalScore,
    location_match: locationScore,
    recognition_match: recognitionScore,
    missing_requirements: missing,
    gaps_count: missing.length,
    priority
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
  const corsHeaders = getCorsHeaders(req);
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    
    const { pilot_id, recalculate = false, limit = 50 } = await req.json();
    
    if (!pilot_id) {
      return new Response(
        JSON.stringify({ error: 'pilot_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Fetch pilot profile
    const { data: pilot, error: pilotError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', pilot_id)
      .single();
    
    if (pilotError || !pilot) {
      return new Response(
        JSON.stringify({ error: 'Pilot not found', details: pilotError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check for existing valid matches
    if (!recalculate) {
      const { data: existingMatches } = await supabaseClient
        .from('pathway_matches')
        .select('*, pathways(*)')
        .eq('pilot_id', pilot_id)
        .gt('expires_at', new Date().toISOString())
        .order('match_score', { ascending: false })
        .limit(limit);
      
      if (existingMatches && existingMatches.length > 0) {
        return new Response(
          JSON.stringify({ 
            matches: existingMatches,
            source: 'cache',
            total: existingMatches.length
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Fetch active pathways
    const { data: pathways, error: pathwaysError } = await supabaseClient
      .from('pathways')
      .select('*')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('display_order', { ascending: true });
    
    if (pathwaysError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch pathways', details: pathwaysError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Calculate matches
    const matches: MatchResult[] = [];
    for (const pathway of (pathways || [])) {
      const match = calculateMatch(pilot as PilotProfile, pathway as Pathway);
      
      // Determine status based on match score
      let status = 'eligible';
      if (match.match_score >= 90) status = 'qualified';
      if (match.missing_requirements.length === 0) status = 'qualified';
      
      matches.push({
        ...match,
        // Store in database
      });
      
      // Upsert match record
      await supabaseClient
        .from('pathway_matches')
        .upsert({
          pilot_id,
          pathway_id: pathway.id,
          match_score: match.match_score,
          hours_match: match.hours_match,
          ratings_match: match.ratings_match,
          medical_match: match.medical_match,
          location_match: match.location_match,
          recognition_match: match.recognition_match,
          missing_requirements: match.missing_requirements,
          gaps_count: match.gaps_count,
          priority: match.priority,
          status,
          calculated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }, {
          onConflict: 'pilot_id,pathway_id'
        });
    }
    
    // Fetch the saved matches with pathway details
    const { data: savedMatches } = await supabaseClient
      .from('pathway_matches')
      .select(`
        *,
        pathways (*)
      `)
      .eq('pilot_id', pilot_id)
      .order('match_score', { ascending: false })
      .limit(limit);
    
    return new Response(
      JSON.stringify({
        matches: savedMatches || [],
        source: 'calculated',
        total: savedMatches?.length || 0,
        pilot_summary: {
          total_hours: pilot.total_flight_hours || parseFloat(pilot.current_flight_hours || '0') || 0,
          ratings_count: (pilot.ratings || []).length,
          recognition_score: pilot.overall_recognition_score || 0,
          medical_status: pilot.medical_expiry && new Date(pilot.medical_expiry) > new Date() ? 'valid' : 'expired'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
