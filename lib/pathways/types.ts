// Pathway Matching Types - Phase 2

export interface PilotProfile {
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

export interface PathwayRequirements {
  min_total_hours: number;
  min_pic_hours: number;
  min_multi_engine_hours: number;
  min_instrument_hours: number;
  required_ratings: string[];
  required_type_ratings: string[];
  medical_class_required: string;
  english_level_required: string;
  max_age: number | null;
  min_age: number | null;
  citizenship_requirements: string[];
  additional_requirements: string[];
}

export interface Pathway {
  id: string;
  slug: string;
  name: string;
  category: 'airline' | 'cargo' | 'charter' | 'air_taxi' | 'drone' | 'military' | 'corporate' | 'agricultural' | 'instructor' | 'specialized';
  description: string | null;
  operator_id: string | null;
  operator_name: string;
  operator_type: string;
  requirements: PathwayRequirements;
  fleet: any[];
  bases: any[];
  status: 'active' | 'paused' | 'closed' | 'draft';
  hiring_status: 'open' | 'accepting' | 'paused' | 'closed' | 'coming_soon';
  display_order: number;
  featured: boolean;
  logo_url: string | null;
  hero_image_url: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface PathwayMatch {
  id: string;
  pilot_id: string;
  pathway_id: string;
  match_score: number;
  hours_match: number;
  ratings_match: number;
  medical_match: number;
  location_match: number;
  recognition_match: number;
  missing_requirements: string[];
  gaps_count: number;
  status: 'eligible' | 'qualified' | 'applied' | 'interviewing' | 'matched' | 'declined' | 'expired';
  priority: 'high' | 'medium' | 'low';
  pilot_interested: boolean;
  pilot_interested_at: string | null;
  calculated_at: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  // Joined data
  pathways?: Pathway;
}

export interface PathwayApplication {
  id: string;
  pilot_id: string;
  pathway_id: string;
  match_id: string | null;
  cover_letter: string | null;
  custom_answers: Record<string, any>;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'offer_extended' | 'accepted' | 'declined' | 'withdrawn' | 'expired';
  submitted_at: string;
  reviewed_at: string | null;
  decided_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchCalculationResult {
  matches: PathwayMatch[];
  source: 'cache' | 'calculated';
  total: number;
  pilot_summary: {
    total_hours: number;
    ratings_count: number;
    recognition_score: number;
    medical_status: 'valid' | 'expired' | 'unknown';
    pilot_name?: string;
    license_type?: string;
    profile_readiness?: number;
  };
}

export interface GapAnalysis {
  pathway_id: string;
  pathway_name: string;
  current_match_score: number;
  gaps: {
    type: 'hours' | 'rating' | 'medical' | 'english' | 'age' | 'other';
    description: string;
    current_value: string | number;
    required_value: string | number;
    estimated_time_to_close?: string;
    estimated_cost?: number;
  }[];
  total_gaps: number;
  critical_gaps: number;
  estimated_time_to_qualify: string;
}
