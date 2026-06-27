/**
 * Advanced R-Formula Calculation Engine
 * 
 * Implements the sophisticated Trust & Readiness Score system with:
 * - Recency & Decay variables
 * - Pathway Weighted Scores
 * - Program Quality Factors (PQF)
 * - Predictive Readiness Index
 * 
 * Formula: R = (H × Wh) + (P × Wp) - (D × T)
 * Where:
 * H = Hours (with pathway weighting)
 * P = Program points (with quality factors)
 * W = Weights (pathway-specific)
 * D = Decay constant (time-based)
 * T = Time since last activity
 */

import { supabase } from './supabase';

// Types for the R-Formula system
export interface PilotProfile {
  user_id: string;
  total_flight_hours: number;
  pic_hours: number;
  multi_engine_hours: number;
  instrument_hours: number;
  night_hours: number;
  last_flight_date?: string;
  medical_expiry?: string;
  license_expiry?: string;
  completed_programs: string[];
  type_ratings: string[];
  behavioral_scores: {
    sjt_score: number;
    psychometric_score: number;
    cognitive_workload: number;
    stress_management: number;
    decision_making: number;
    crm_assessment: number;
  };
  language_scores: {
    icao_level: string;
    cultural_adaptability: number;
    international_experience: boolean;
    cross_cultural_comm: number;
  };
  technical_skills: {
    weather_ops: number;
    terrain_complexity: number;
    emergency_procedures: number;
    type_rating_diversity: number;
    instrument_approaches: number;
  };
}

export interface PathwayWeights {
  pathway_key: string;
  component_type: string;
  weight: number;
  is_active: boolean;
}

export interface ProgramQualityFactor {
  program_key: string;
  provider_tier: 'tier1' | 'tier2' | 'tier3' | 'generic';
  quality_multiplier: number;
  peer_validation_score: number;
  success_rate: number;
  sample_size: number;
  is_active: boolean;
}

export interface RecencyDecayConfig {
  component_type: string;
  decay_rate: number; // Daily decay rate
  max_decay_days: number;
  grace_period_days: number;
  is_active: boolean;
}

export interface RecognitionScore {
  user_id: string;
  pathway_key?: string;
  base_score: number;
  weighted_score: number;
  quality_adjusted_score: number;
  decay_adjusted_score: number;
  readiness_index: number;
  last_activity_date: Date;
  score_breakdown: {
    hours_component: number;
    program_component: number;
    behavioral_component: number;
    technical_component: number;
    language_component: number;
    decay_component: number;
  };
  decay_factors: {
    flight_hours_decay: number;
    program_decay: number;
    medical_decay: number;
    currency_decay: number;
  };
  calculated_at: Date;
  expires_at: Date;
}

export interface FlightInstrumentMetrics {
  user_id: string;
  instrument_type: 'altimeter' | 'airspeed' | 'vsi' | 'annunciator';
  current_value: number;
  target_value?: number;
  trend_direction: 'up' | 'down' | 'stable';
  trend_percentage: number;
  warning_level: 'green' | 'yellow' | 'red';
  last_updated: Date;
}

class RFormulaEngine {
  private static instance: RFormulaEngine;
  private pathwayWeightsCache: Map<string, PathwayWeights[]> = new Map();
  private programQualityCache: Map<string, ProgramQualityFactor> = new Map();
  private decayConfigCache: Map<string, RecencyDecayConfig> = new Map();
  private lastCacheUpdate: Date = new Date(0);

  private constructor() {}

  public static getInstance(): RFormulaEngine {
    if (!RFormulaEngine.instance) {
      RFormulaEngine.instance = new RFormulaEngine();
    }
    return RFormulaEngine.instance;
  }

  /**
   * Main calculation method - computes the complete R-Formula score
   */
  public async calculateRecognitionScore(
    profile: PilotProfile,
    pathwayKey?: string
  ): Promise<RecognitionScore> {
    // Refresh cache if needed
    await this.refreshCacheIfNeeded();

    const now = new Date();
    const breakdown = this.calculateBaseScore(profile, pathwayKey);
    const weightedScore = this.applyPathwayWeights(breakdown, pathwayKey);
    const qualityAdjustedScore = this.applyProgramQualityFactors(weightedScore, profile);
    const decayFactors = this.calculateDecayFactors(profile);
    const decayAdjustedScore = this.applyRecencyDecay(qualityAdjustedScore, decayFactors);
    const readinessIndex = this.calculatePredictiveReadiness(profile, decayAdjustedScore, pathwayKey);

    return {
      user_id: profile.user_id,
      pathway_key: pathwayKey,
      base_score: breakdown.total,
      weighted_score: weightedScore,
      quality_adjusted_score: qualityAdjustedScore,
      decay_adjusted_score: decayAdjustedScore,
      readiness_index: readinessIndex,
      last_activity_date: profile.last_flight_date ? new Date(profile.last_flight_date) : now,
      score_breakdown: breakdown,
      decay_factors: decayFactors,
      calculated_at: now,
      expires_at: new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours
    };
  }

  /**
   * Calculate the base score from all profile components
   */
  private calculateBaseScore(profile: PilotProfile, _pathwayKey?: string) {
    const hoursComponent = this.calculateHoursScore(profile);
    const programComponent = this.calculateProgramScore(profile);
    const behavioralComponent = this.calculateBehavioralScore(profile);
    const technicalComponent = this.calculateTechnicalScore(profile);
    const languageComponent = this.calculateLanguageScore(profile);

    const total = hoursComponent + programComponent + behavioralComponent + 
                 technicalComponent + languageComponent;

    return {
      hours_component: hoursComponent,
      program_component: programComponent,
      behavioral_component: behavioralComponent,
      technical_component: technicalComponent,
      language_component: languageComponent,
      decay_component: 0, // Will be calculated separately
      total
    };
  }

  /**
   * Calculate hours-based score with differentiation between PIC and dual hours
   */
  private calculateHoursScore(profile: PilotProfile): number {
    const baseHours = profile.total_flight_hours || 0;
    const picHours = profile.pic_hours || 0;
    const multiEngineHours = profile.multi_engine_hours || 0;
    const instrumentHours = profile.instrument_hours || 0;
    const nightHours = profile.night_hours || 0;

    // Weight different hour types differently
    const picWeight = 1.5; // PIC hours worth more
    const multiEngineWeight = 1.3;
    const instrumentWeight = 1.4;
    const nightWeight = 1.1;

    const weightedHours = (picHours * picWeight) + 
                          ((baseHours - picHours) * 1.0) + // Non-PIC hours
                          (multiEngineHours * multiEngineWeight) +
                          (instrumentHours * instrumentWeight) +
                          (nightHours * nightWeight);

    // Cap at reasonable maximum and normalize to 0-100 scale
    const maxHours = 10000;
    const normalizedScore = Math.min((weightedHours / maxHours) * 40, 40); // Max 40 points from hours

    return Math.round(normalizedScore * 100) / 100;
  }

  /**
   * Calculate program completion score
   */
  private calculateProgramScore(profile: PilotProfile): number {
    const programWeights = {
      'foundation_program': 15,
      'transition_program': 20,
      'ebt_video_scoring': 10,
      'mentorship_program': 12,
      'type_rating_course': 8,
      'leadership_training': 5,
      'crm_advanced': 7,
      'international_ops': 6
    };

    let score = 0;
    for (const program of profile.completed_programs) {
      score += programWeights[program as keyof typeof programWeights] || 3;
    }

    return Math.min(score, 30); // Cap at 30 points from programs
  }

  /**
   * Calculate behavioral assessment scores
   */
  private calculateBehavioralScore(profile: PilotProfile): number {
    const { behavioral_scores } = profile;
    
    const weights = {
      sjt_score: 0.25,
      psychometric_score: 0.20,
      cognitive_workload: 0.15,
      stress_management: 0.15,
      decision_making: 0.15,
      crm_assessment: 0.10
    };

    const score = 
      (behavioral_scores.sjt_score * weights.sjt_score) +
      (behavioral_scores.psychometric_score * weights.psychometric_score) +
      (behavioral_scores.cognitive_workload * weights.cognitive_workload) +
      (behavioral_scores.stress_management * weights.stress_management) +
      (behavioral_scores.decision_making * weights.decision_making) +
      (behavioral_scores.crm_assessment * weights.crm_assessment);

    return Math.min(score, 20); // Cap at 20 points from behavioral
  }

  /**
   * Calculate technical skills score
   */
  private calculateTechnicalScore(profile: PilotProfile): number {
    const { technical_skills } = profile;
    
    const weights = {
      weather_ops: 0.25,
      terrain_complexity: 0.20,
      emergency_procedures: 0.25,
      type_rating_diversity: 0.15,
      instrument_approaches: 0.15
    };

    const score = 
      (technical_skills.weather_ops * weights.weather_ops) +
      (technical_skills.terrain_complexity * weights.terrain_complexity) +
      (technical_skills.emergency_procedures * weights.emergency_procedures) +
      (technical_skills.type_rating_diversity * weights.type_rating_diversity) +
      (technical_skills.instrument_approaches * weights.instrument_approaches);

    return Math.min(score, 15); // Cap at 15 points from technical
  }

  /**
   * Calculate language and communication score
   */
  private calculateLanguageScore(profile: PilotProfile): number {
    const { language_scores } = profile;
    
    // ICAO level scoring (Level 4 = 80, Level 5 = 90, Level 6 = 100)
    const icaoScores: { [key: string]: number } = {
      'Level 4': 80,
      'Level 5': 90,
      'Level 6': 100,
      'None': 0
    };

    const icaoScore = icaoScores[language_scores.icao_level] || 0;
    const culturalScore = language_scores.cultural_adaptability;
    const internationalBonus = language_scores.international_experience ? 10 : 0;
    const crossCulturalScore = language_scores.cross_cultural_comm;

    const totalScore = (icaoScore * 0.4) + 
                       (culturalScore * 0.3) + 
                       (crossCulturalScore * 0.3) + 
                       internationalBonus;

    return Math.min(totalScore, 15); // Cap at 15 points from language
  }

  /**
   * Apply pathway-specific weights to the base score
   */
  private applyPathwayWeights(breakdown: Record<string, unknown>, pathwayKey?: string): number {
    if (!pathwayKey) {
      return breakdown.total as number; // Return base score for overall recognition
    }

    const pathwayWeights = this.pathwayWeightsCache.get(pathwayKey) || [];
    let weightedTotal = 0;

    // Apply pathway weights to each component
    for (const [component, value] of Object.entries(breakdown)) {
      if (component === 'total' || component === 'decay_component') continue;
      
      const weight = pathwayWeights.find(w => w.component_type === component)?.weight || 1.0;
      weightedTotal += (value as number) * weight;
    }

    return Math.round(weightedTotal * 100) / 100;
  }

  /**
   * Apply Program Quality Factors to the score
   */
  private applyProgramQualityFactors(score: number, profile: PilotProfile): number {
    let qualityMultiplier = 1.0;

    for (const programKey of profile.completed_programs) {
      const pqf = this.programQualityCache.get(programKey);
      if (pqf && pqf.is_active) {
        qualityMultiplier += (pqf.quality_multiplier - 1.0) * 0.1; // Apply 10% of the quality boost
      }
    }

    return Math.round(score * qualityMultiplier * 100) / 100;
  }

  /**
   * Calculate decay factors based on recency
   */
  private calculateDecayFactors(profile: PilotProfile) {
    const now = new Date();
    const decayFactors = {
      flight_hours_decay: 1.0,
      program_decay: 1.0,
      medical_decay: 1.0,
      currency_decay: 1.0
    };

    // Flight hours decay
    if (profile.last_flight_date) {
      const daysSinceFlight = Math.floor((now.getTime() - new Date(profile.last_flight_date).getTime()) / (1000 * 60 * 60 * 24));
      const flightDecayConfig = this.decayConfigCache.get('flight_hours');
      
      if (flightDecayConfig && daysSinceFlight > flightDecayConfig.grace_period_days) {
        const daysToDecay = Math.min(daysSinceFlight - flightDecayConfig.grace_period_days, flightDecayConfig.max_decay_days);
        const decayAmount = Math.pow(1 - flightDecayConfig.decay_rate, daysToDecay);
        decayFactors.flight_hours_decay = Math.max(decayAmount, 0.5); // Minimum 50% retention
      }
    }

    // Program completion decay
    const programDecayConfig = this.decayConfigCache.get('program_completion');
    if (programDecayConfig && profile.completed_programs.length > 0) {
      // For simplicity, assume programs were completed 90 days ago (this should be tracked per program)
      const daysSinceProgram = 90;
      if (daysSinceProgram > programDecayConfig.grace_period_days) {
        const daysToDecay = Math.min(daysSinceProgram - programDecayConfig.grace_period_days, programDecayConfig.max_decay_days);
        const decayAmount = Math.pow(1 - programDecayConfig.decay_rate, daysToDecay);
        decayFactors.program_decay = Math.max(decayAmount, 0.7); // Minimum 70% retention
      }
    }

    // Medical decay
    if (profile.medical_expiry) {
      const daysUntilExpiry = Math.floor((new Date(profile.medical_expiry).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const medicalDecayConfig = this.decayConfigCache.get('medical');
      
      if (medicalDecayConfig && daysUntilExpiry < 180) {
        const decayAmount = 1.0 - (daysUntilExpiry / 180) * 0.5;
        decayFactors.medical_decay = Math.max(decayAmount, 0.5);
      }
    }

    // Currency decay (license, instrument currency, etc.)
    if (profile.license_expiry) {
      const daysUntilExpiry = Math.floor((new Date(profile.license_expiry).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const currencyDecayConfig = this.decayConfigCache.get('currency');
      
      if (currencyDecayConfig && daysUntilExpiry < 365) {
        const decayAmount = 1.0 - (daysUntilExpiry / 365) * 0.3;
        decayFactors.currency_decay = Math.max(decayAmount, 0.7);
      }
    }

    return decayFactors;
  }

  /**
   * Apply recency decay to the score
   */
  private applyRecencyDecay(score: number, decayFactors: Record<string, unknown>): number {
    const averageDecay = ((decayFactors.flight_hours_decay as number) + 
                          (decayFactors.program_decay as number) + 
                          (decayFactors.medical_decay as number) + 
                          (decayFactors.currency_decay as number)) / 4;
    
    return Math.round(score * averageDecay * 100) / 100;
  }

  /**
   * Calculate Predictive Readiness Index
   */
  private calculatePredictiveReadiness(profile: PilotProfile, currentScore: number, _pathwayKey?: string): number {
    let readinessScore = currentScore * 0.7; // Base score contributes 70%

    // Forward-looking factors
    const medicalValid = profile.medical_expiry && new Date(profile.medical_expiry) > new Date();
    const licenseValid = profile.license_expiry && new Date(profile.license_expiry) > new Date();
    const recentActivity = profile.last_flight_date && 
                         (Date.now() - new Date(profile.last_flight_date).getTime()) < (90 * 24 * 60 * 60 * 1000);

    // Add forward-looking bonuses
    if (medicalValid) readinessScore += 5;
    if (licenseValid) readinessScore += 5;
    if (recentActivity) readinessScore += 10;

    // Program completion trajectory (are they actively completing programs?)
    if (profile.completed_programs.length >= 2) readinessScore += 10;

    // Type rating diversity bonus
    if (profile.type_ratings.length >= 2) readinessScore += 5;

    return Math.min(Math.round(readinessScore), 100);
  }

  /**
   * Generate flight instrument metrics for dashboard
   */
  public async generateFlightInstrumentMetrics(profile: PilotProfile): Promise<FlightInstrumentMetrics[]> {
    const now = new Date();
    const metrics: FlightInstrumentMetrics[] = [];

    // Altimeter - Represents Total Career Height
    const altimeterValue = Math.min((profile.total_flight_hours / 10000) * 100, 100);
    metrics.push({
      user_id: profile.user_id,
      instrument_type: 'altimeter',
      current_value: altimeterValue,
      target_value: 100,
      trend_direction: 'stable',
      trend_percentage: 0,
      warning_level: altimeterValue >= 80 ? 'green' : altimeterValue >= 60 ? 'yellow' : 'red',
      last_updated: now
    });

    // Airspeed - Represents Current Momentum
    const airspeedValue = profile.completed_programs.length * 15 + (profile.last_flight_date ? 20 : 0);
    metrics.push({
      user_id: profile.user_id,
      instrument_type: 'airspeed',
      current_value: Math.min(airspeedValue, 100),
      target_value: 80,
      trend_direction: 'up',
      trend_percentage: 12.5,
      warning_level: airspeedValue >= 70 ? 'green' : airspeedValue >= 40 ? 'yellow' : 'red',
      last_updated: now
    });

    // VSI - Represents Score Trend
    const vsiValue = 75; // This would be calculated from historical data
    metrics.push({
      user_id: profile.user_id,
      instrument_type: 'vsi',
      current_value: vsiValue,
      trend_direction: 'up',
      trend_percentage: 8.3,
      warning_level: vsiValue >= 70 ? 'green' : vsiValue >= 50 ? 'yellow' : 'red',
      last_updated: now
    });

    // Annunciator - Warning lights for compliance
    const medicalWarning = profile.medical_expiry && new Date(profile.medical_expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const licenseWarning = profile.license_expiry && new Date(profile.license_expiry) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    const activityWarning = !profile.last_flight_date || (Date.now() - new Date(profile.last_flight_date).getTime()) > (90 * 24 * 60 * 60 * 1000);

    metrics.push({
      user_id: profile.user_id,
      instrument_type: 'annunciator',
      current_value: medicalWarning || licenseWarning || activityWarning ? 25 : 100,
      target_value: 100,
      trend_direction: 'stable',
      trend_percentage: 0,
      warning_level: medicalWarning || licenseWarning || activityWarning ? 'red' : 'green',
      last_updated: now
    });

    return metrics;
  }

  /**
   * Refresh cached data from database
   */
  private async refreshCacheIfNeeded() {
    const now = new Date();
    const cacheAge = now.getTime() - this.lastCacheUpdate.getTime();
    
    // Refresh cache if it's older than 1 hour
    if (cacheAge > 60 * 60 * 1000) {
      await this.loadPathwayWeights();
      await this.loadProgramQualityFactors();
      await this.loadRecencyDecayConfig();
      this.lastCacheUpdate = now;
    }
  }

  /**
   * Load pathway weights from database
   */
  private async loadPathwayWeights() {
    try {
      const { data, error } = await supabase
        .from('pathway_weights')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      // Group by pathway_key
      const grouped = new Map<string, PathwayWeights[]>();
      for (const weight of data || []) {
        if (!grouped.has(weight.pathway_key)) {
          grouped.set(weight.pathway_key, []);
        }
        grouped.get(weight.pathway_key)!.push(weight);
      }

      this.pathwayWeightsCache = grouped;
    } catch (error) {
      console.error('Error loading pathway weights:', error);
    }
  }

  /**
   * Load program quality factors from database
   */
  private async loadProgramQualityFactors() {
    try {
      const { data, error } = await supabase
        .from('program_quality_factors')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      const map = new Map<string, ProgramQualityFactor>();
      for (const pqf of data || []) {
        map.set(pqf.program_key, pqf);
      }

      this.programQualityCache = map;
    } catch (error) {
      console.error('Error loading program quality factors:', error);
    }
  }

  /**
   * Load recency decay configuration from database
   */
  private async loadRecencyDecayConfig() {
    try {
      const { data, error } = await supabase
        .from('recency_decay_config')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      const map = new Map<string, RecencyDecayConfig>();
      for (const config of data || []) {
        map.set(config.component_type, config);
      }

      this.decayConfigCache = map;
    } catch (error) {
      console.error('Error loading recency decay config:', error);
    }
  }

  /**
   * Save calculated score to database
   */
  public async saveRecognitionScore(score: RecognitionScore): Promise<void> {
    try {
      const { error } = await supabase
        .from('pilot_recognition_scores')
        .upsert({
          user_id: score.user_id,
          pathway_key: score.pathway_key,
          base_score: score.base_score,
          weighted_score: score.weighted_score,
          quality_adjusted_score: score.quality_adjusted_score,
          decay_adjusted_score: score.decay_adjusted_score,
          readiness_index: score.readiness_index,
          last_activity_date: score.last_activity_date.toISOString(),
          score_breakdown: score.score_breakdown,
          decay_factors: score.decay_factors,
          calculated_at: score.calculated_at.toISOString(),
          expires_at: score.expires_at.toISOString()
        });

      if (error) throw error;

      // Also save to history for trend analysis
      await this.saveScoreHistory(score);
    } catch (error) {
      console.error('Error saving recognition score:', error);
      throw error;
    }
  }

  /**
   * Save score calculation history
   */
  private async saveScoreHistory(score: RecognitionScore): Promise<void> {
    try {
      const { error } = await supabase
        .from('score_calculation_history')
        .insert({
          user_id: score.user_id,
          pathway_key: score.pathway_key,
          score_type: 'final',
          score_value: score.decay_adjusted_score,
          calculation_date: score.calculated_at.toISOString(),
          decay_applied: 1.0 - (score.decay_adjusted_score / score.quality_adjusted_score),
          quality_multiplier: score.quality_adjusted_score / score.weighted_score
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving score history:', error);
    }
  }

  /**
   * Get cached recognition score for a user
   */
  public async getCachedScore(userId: string, pathwayKey?: string): Promise<RecognitionScore | null> {
    try {
      const { data, error } = await supabase
        .from('pilot_recognition_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('pathway_key', pathwayKey || null)
        .gt('expires_at', new Date().toISOString())
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      
      return data;
    } catch (_error) {
      return null;
    }
  }

  /**
   * Get score trend data for dashboard
   */
  public async getScoreTrend(userId: string, days: number = 30): Promise<unknown[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('score_calculation_history')
        .select('*')
        .eq('user_id', userId)
        .gte('calculation_date', startDate.toISOString())
        .order('calculation_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting score trend:', error);
      return [];
    }
  }
}

export default RFormulaEngine;
