/**
 * Recognition Score Algorithm
 * Calculates a pilot's recognition score (0-100) based on their credentials
 */

export interface PilotProfile {
  totalHours: number;
  licenseType: 'PPL' | 'CPL' | 'ATPL' | 'Student' | 'Other';
  ratings: string[];
  trainingCompleted: string[];
  verificationStatus: {
    hours: boolean;
    licenses: boolean;
    backgroundCheck: boolean;
  };
  mentorshipHours: number;
  programsCompleted: string[];
}

export interface ScoreBreakdown {
  total: number;
  flightHours: number;
  licenses: number;
  ratings: number;
  training: number;
  verification: number;
  mentorship: number;
  programs: number;
  gaps: string[];
}

const MAX_SCORE = 100;

export function calculateRecognitionScore(profile: PilotProfile): ScoreBreakdown {
  const gaps: string[] = [];
  
  // 1. Flight Hours (max 25 points)
  let flightHours = 0;
  if (profile.totalHours >= 1500) flightHours = 25;
  else if (profile.totalHours >= 1000) flightHours = 20;
  else if (profile.totalHours >= 500) flightHours = 15;
  else if (profile.totalHours >= 200) flightHours = 10;
  else if (profile.totalHours >= 50) flightHours = 5;
  else flightHours = Math.max(1, Math.floor(profile.totalHours / 10));
  
  if (profile.totalHours < 200) {
    gaps.push(`Need ${200 - profile.totalHours} more flight hours for better pathway access`);
  }
  
  // 2. License Type (max 20 points)
  const licenseScores: Record<string, number> = {
    'ATPL': 20,
    'CPL': 15,
    'PPL': 10,
    'Student': 5,
    'Other': 5
  };
  const licenses = licenseScores[profile.licenseType] || 5;
  
  if (profile.licenseType === 'Student' || profile.licenseType === 'PPL') {
    gaps.push('Commercial License (CPL) required for airline pathways');
  }
  
  // 3. Ratings (max 15 points)
  const ratingPoints = Math.min(15, profile.ratings.length * 3);
  const ratings = ratingPoints;
  
  if (profile.ratings.length < 3) {
    gaps.push(`Add ${3 - profile.ratings.length} more ratings (Instrument, Multi-Engine, Type Rating)`);
  }
  
  // 4. Training Programs (max 15 points)
  const trainingScores: Record<string, number> = {
    'Foundation Program': 5,
    'Transition Program': 10,
    'EBT CBTA': 8,
    'ATLAS CV': 3,
    'Simulator Training': 5,
    'CRM': 3,
    'Leadership': 3
  };
  
  let training = 0;
  for (const program of profile.trainingCompleted) {
    training += trainingScores[program] || 2;
  }
  training = Math.min(15, training);
  
  if (profile.trainingCompleted.length === 0) {
    gaps.push('Complete Foundation Program to boost your score (+5 points)');
  }
  
  // 5. Verification Status (max 15 points)
  let verification = 0;
  if (profile.verificationStatus.hours) verification += 5;
  if (profile.verificationStatus.licenses) verification += 5;
  if (profile.verificationStatus.backgroundCheck) verification += 5;
  
  if (!profile.verificationStatus.hours) {
    gaps.push('Verify flight hours to unlock +5 points');
  }
  if (!profile.verificationStatus.backgroundCheck) {
    gaps.push('Complete background check for +5 points and airline access');
  }
  
  // 6. Mentorship (max 5 points)
  const mentorship = Math.min(5, Math.floor(profile.mentorshipHours / 10));
  
  if (profile.mentorshipHours < 10) {
    gaps.push(`Complete mentorship program (+${Math.ceil((10 - profile.mentorshipHours) / 10)} points)`);
  }
  
  // 7. Programs (max 5 points)
  const programs = Math.min(5, profile.programsCompleted.length * 2);
  
  // Calculate total
  const total = Math.min(MAX_SCORE, 
    flightHours + licenses + ratings + training + verification + mentorship + programs
  );
  
  return {
    total,
    flightHours,
    licenses,
    ratings,
    training,
    verification,
    mentorship,
    programs,
    gaps
  };
}

export function getScoreTier(score: number): {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  color: string;
  description: string;
} {
  if (score >= 80) {
    return {
      tier: 'Platinum',
      color: '#E5E4E2',
      description: 'Airline-ready with full verification'
    };
  } else if (score >= 60) {
    return {
      tier: 'Gold',
      color: '#FFD700',
      description: 'Highly qualified, minor gaps to close'
    };
  } else if (score >= 40) {
    return {
      tier: 'Silver',
      color: '#C0C0C0',
      description: 'Good foundation, working toward airline readiness'
    };
  } else {
    return {
      tier: 'Bronze',
      color: '#CD7F32',
      description: 'Building your recognition profile'
    };
  }
}

export function getNextMilestone(score: number): { target: number; action: string } {
  if (score < 40) {
    return { target: 40, action: 'Add verified flight hours and complete Foundation Program' };
  } else if (score < 60) {
    return { target: 60, action: 'Get CPL license and complete additional ratings' };
  } else if (score < 80) {
    return { target: 80, action: 'Complete background check and Transition Program' };
  } else {
    return { target: 100, action: 'Maintain currency and add specialized training' };
  }
}
