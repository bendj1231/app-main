export interface AircraftTypeRating {
  id: string;
  model: string;
  manufacturer_id: string;
  category: string;
  subcategory?: string;
  image?: string;
  description?: string;
  demandLevel?: string;
  lifecycle_stage?: string;
  order_backlog?: {
    orders: number;
    delivered: number;
  };
  operator_count?: number;
  pilot_count?: number;
  careerScore?: number;
  sketchfab_id?: string;
  conditionally_new?: string;
  first_flight?: number;
  why_choose_rating?: string;
  specifications?: any;
  news?: any;
  training_curriculum?: Array<{
    phase: string;
    duration: string;
    topics: string[];
  }>;
  simulator_details?: {
    type: string;
    locations: string[];
    features: string[];
  };
  hiring_requirements?: any;
  compensation_data?: any;
  comparison_data?: any;
  training_requirements?: {
    minimum_hours?: number;
    ground_school_hours?: number;
    simulator_hours?: number;
    flight_hours?: number;
  };
  show_career_outlook?: boolean;
  extended_info_content?: any;
}

export interface PilotProfile {
  totalFlightHours?: number;
  licenses?: string[];
  recognitionScore?: number;
  experienceLevel?: string;
  technicalSkillsScore?: number;
  interviewScore?: number;
  examinationScore?: number;
}

export function calculateCareerScore(aircraft: AircraftTypeRating, pilotProfile?: PilotProfile): number {
  let score = 0;
  const maxScore = 100;

  // === Aircraft-Based Scoring (60 points) ===

  // Demand Level (15 points)
  if (aircraft.demandLevel === 'high') score += 15;
  else if (aircraft.demandLevel === 'low') score += 6;
  else score += 0;

  // Lifecycle Stage (12 points)
  if (aircraft.lifecycle_stage === 'early-career') score += 12;
  else if (aircraft.lifecycle_stage === 'mid-career') score += 6;
  else score += 0;

  // Order Backlog Ratio (12 points) - orders/delivered
  if (aircraft.order_backlog) {
    const ratio = aircraft.order_backlog.orders / (aircraft.order_backlog.delivered || 1);
    if (ratio >= 2) score += 12;
    else if (ratio >= 1.5) score += 9;
    else if (ratio >= 1) score += 6;
    else score += 3;
  }

  // Operator Count (9 points) - more operators = more opportunities
  if (aircraft.operator_count) {
    if (aircraft.operator_count >= 30) score += 9;
    else if (aircraft.operator_count >= 20) score += 7;
    else if (aircraft.operator_count >= 10) score += 5;
    else score += 2;
  }

  // Pilot Count (6 points) - more pilots = more competition
  if (aircraft.pilot_count) {
    if (aircraft.pilot_count >= 5000) score += 2;
    else if (aircraft.pilot_count >= 3000) score += 4;
    else if (aircraft.pilot_count >= 1000) score += 6;
    else score += 3;
  }

  // Career Score (6 points) - higher career score = better opportunities
  if (aircraft.careerScore) {
    if (aircraft.careerScore >= 80) score += 6;
    else if (aircraft.careerScore >= 60) score += 4;
    else if (aircraft.careerScore >= 40) score += 2;
    else score += 0;
  }

  // === Pilot-Based Scoring (40 points) ===

  if (pilotProfile) {
    // Total Flight Hours (15 points)
    if (pilotProfile.totalFlightHours) {
      if (pilotProfile.totalFlightHours >= 5000) score += 15;
      else if (pilotProfile.totalFlightHours >= 3000) score += 12;
      else if (pilotProfile.totalFlightHours >= 1500) score += 9;
      else if (pilotProfile.totalFlightHours >= 500) score += 6;
      else score += 3;
    }

    // Recognition Score (10 points)
    if (pilotProfile.recognitionScore) {
      if (pilotProfile.recognitionScore >= 90) score += 10;
      else if (pilotProfile.recognitionScore >= 75) score += 8;
      else if (pilotProfile.recognitionScore >= 60) score += 6;
      else if (pilotProfile.recognitionScore >= 40) score += 4;
      else score += 2;
    }

    // Technical Skills Score (5 points)
    if (pilotProfile.technicalSkillsScore) {
      if (pilotProfile.technicalSkillsScore >= 80) score += 5;
      else if (pilotProfile.technicalSkillsScore >= 60) score += 3;
      else if (pilotProfile.technicalSkillsScore >= 40) score += 1;
    }

    // Interview Score (5 points)
    if (pilotProfile.interviewScore) {
      if (pilotProfile.interviewScore >= 80) score += 5;
      else if (pilotProfile.interviewScore >= 60) score += 3;
      else if (pilotProfile.interviewScore >= 40) score += 1;
    }

    // Examination Score (5 points)
    if (pilotProfile.examinationScore) {
      if (pilotProfile.examinationScore >= 80) score += 5;
      else if (pilotProfile.examinationScore >= 60) score += 3;
      else if (pilotProfile.examinationScore >= 40) score += 1;
    }
  }

  return Math.min(score, maxScore);
}
