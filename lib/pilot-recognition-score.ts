/**
 * Pilot Recognition Score Algorithm
 * 
 * Calculates a comprehensive recognition score based on:
 * - Flight hours (total, PIC, IFR, night)
 * - Experience (roles, achievements, licenses)
 * - Assessments (program completion, performance)
 * - Mentorship (hours mentored, observations, cases)
 * 
 * Score Range: 0-1000
 */

export interface ScoreWeights {
  hours: number;
  experience: number;
  assessments: number;
  mentorship: number;
}

export interface ScoreBreakdown {
  totalScore: number;
  hoursScore: number;
  experienceScore: number;
  assessmentScore: number;
  mentorshipScore: number;
  breakdown: {
    totalHours: number;
    picHours: number;
    ifrHours: number;
    nightHours: number;
    experienceYears: number;
    achievementsCount: number;
    licensesCount: number;
    programCompletion: number;
    performanceScore: number;
    mentorshipHours: number;
    mentorshipObservations: number;
    mentorshipCases: number;
    mentorshipMenteesHelped?: number;
    mentorshipAverageRating?: number;
    mentorshipOutcomesCompleted?: number;
  };
  recommendations: string[];
}

export interface PilotScoreInput {
  stats: {
    totalHours: number;
    picHours: number;
    ifrHours: number;
    nightHours: number;
  };
  experience: {
    years: number;
    achievements: number;
    licenses: number;
  };
  assessments: {
    programCompletion: number; // 0-100
    performanceScore: number; // 0-100
  };
  mentorship: {
    hours: number;
    observations: number;
    cases: number;
    menteesHelped?: number;
    averageRating?: number;
    outcomesCompleted?: number;
  };
}

const DEFAULT_WEIGHTS: ScoreWeights = {
  hours: 0.35,      // 35% weight
  experience: 0.25, // 25% weight
  assessments: 0.25, // 25% weight
  mentorship: 0.15,  // 15% weight
};

/**
 * Calculate hours score based on flight hours
 * Max score: 350 points (35% of 1000)
 */
export const calculateHoursScore = (
  totalHours: number,
  picHours: number,
  ifrHours: number,
  nightHours: number
): number => {
  let score = 0;

  // Total hours (max 150 points)
  // 0-250 hours: linear scale
  // 250-500 hours: reduced scale
  // 500+ hours: diminishing returns
  if (totalHours <= 250) {
    score += (totalHours / 250) * 100;
  } else if (totalHours <= 500) {
    score += 100 + ((totalHours - 250) / 250) * 30;
  } else if (totalHours <= 1000) {
    score += 130 + ((totalHours - 500) / 500) * 15;
  } else {
    score += 145 + Math.min((totalHours - 1000) / 1000 * 5, 5);
  }

  // PIC hours (max 100 points)
  // PIC ratio matters - higher ratio = more points
  const picRatio = totalHours > 0 ? picHours / totalHours : 0;
  if (picHours >= 100) {
    score += 50 + Math.min(picRatio * 50, 50);
  } else {
    score += (picHours / 100) * 50;
  }

  // IFR hours (max 50 points)
  score += Math.min((ifrHours / 100) * 50, 50);

  // Night hours (max 50 points)
  score += Math.min((nightHours / 100) * 50, 50);

  return Math.round(score);
};

/**
 * Calculate experience score based on career achievements
 * Max score: 250 points (25% of 1000)
 */
export const calculateExperienceScore = (
  years: number,
  achievements: number,
  licenses: number
): number => {
  let score = 0;

  // Years of experience (max 100 points)
  // 0-1 years: 0-20 points
  // 1-3 years: 20-50 points
  // 3-5 years: 50-75 points
  // 5-10 years: 75-90 points
  // 10+ years: 90-100 points
  if (years <= 1) {
    score += years * 20;
  } else if (years <= 3) {
    score += 20 + ((years - 1) / 2) * 30;
  } else if (years <= 5) {
    score += 50 + ((years - 3) / 2) * 25;
  } else if (years <= 10) {
    score += 75 + ((years - 5) / 5) * 15;
  } else {
    score += 90 + Math.min((years - 10) / 10 * 10, 10);
  }

  // Achievements (max 75 points)
  // Each achievement gives points, but diminishing returns
  score += Math.min(achievements * 10, 75);

  // Licenses (max 75 points)
  // Core licenses: PPL (10), CPL (20), ATPL (30)
  // Additional type ratings: 5 points each
  score += Math.min(licenses * 15, 75);

  return Math.round(score);
};

/**
 * Calculate assessment score based on program performance
 * Max score: 250 points (25% of 1000)
 */
export const calculateAssessmentScore = (
  programCompletion: number,
  performanceScore: number
): number => {
  let score = 0;

  // Program completion (max 125 points)
  score += (programCompletion / 100) * 125;

  // Performance score (max 125 points)
  score += (performanceScore / 100) * 125;

  return Math.round(score);
};

/**
 * Calculate mentorship score based on mentoring activities
 * Max score: 150 points (15% of 1000)
 * 
 * Enhanced to include:
 * - Mentorship hours (base score)
 * - Mentees helped (diversity impact)
 * - Average rating (quality impact)
 * - Session outcomes (tangible results)
 */
export const calculateMentorshipScore = (
  hours: number,
  observations: number,
  cases: number,
  menteesHelped: number = 0,
  averageRating: number = 0,
  outcomesCompleted: number = 0
): number => {
  let score = 0;

  // Mentorship hours (max 50 points)
  // 0-10 hours: linear scale
  // 10-50 hours: reduced scale
  // 50+ hours: diminishing returns
  if (hours <= 10) {
    score += (hours / 10) * 20;
  } else if (hours <= 50) {
    score += 20 + ((hours - 10) / 40) * 20;
  } else if (hours <= 100) {
    score += 40 + ((hours - 50) / 50) * 8;
  } else {
    score += 48 + Math.min((hours - 100) / 100 * 2, 2);
  }

  // Mentorship observations (max 25 points)
  // 0-10 observations: linear scale
  // 10+ observations: diminishing returns
  if (observations <= 10) {
    score += (observations / 10) * 15;
  } else {
    score += 15 + Math.min((observations - 10) / 20 * 10, 10);
  }

  // Mentorship cases (max 20 points)
  // 0-5 cases: linear scale
  // 5+ cases: diminishing returns
  if (cases <= 5) {
    score += (cases / 5) * 12;
  } else {
    score += 12 + Math.min((cases - 5) / 10 * 8, 8);
  }

  // Mentees helped (max 25 points)
  // Rewards diversity of mentorship impact
  // 0-5 mentees: linear scale
  // 5-10 mentees: reduced scale
  // 10+ mentees: diminishing returns
  if (menteesHelped <= 5) {
    score += (menteesHelped / 5) * 15;
  } else if (menteesHelped <= 10) {
    score += 15 + ((menteesHelped - 5) / 5) * 7;
  } else {
    score += 22 + Math.min((menteesHelped - 10) / 10 * 3, 3);
  }

  // Average rating quality bonus (max 20 points)
  // Rewards high-quality mentorship
  if (averageRating >= 4.5) {
    score += 20;
  } else if (averageRating >= 4.0) {
    score += 15;
  } else if (averageRating >= 3.5) {
    score += 10;
  } else if (averageRating >= 3.0) {
    score += 5;
  }

  // Outcomes completed (max 10 points)
  // Rewards tangible results from mentorship
  if (outcomesCompleted >= 20) {
    score += 10;
  } else if (outcomesCompleted >= 10) {
    score += 7;
  } else if (outcomesCompleted >= 5) {
    score += 4;
  }

  return Math.min(score, 150);
};

/**
 * Generate recommendations for score improvement
 */
export const generateRecommendations = (input: PilotScoreInput): string[] => {
  const recommendations: string[] = [];

  // Hours recommendations
  if (input.stats.totalHours < 250) {
    recommendations.push('Build flight hours to reach 250 total hours for significant score boost');
  }
  if (input.stats.picHours / Math.max(input.stats.totalHours, 1) < 0.5) {
    recommendations.push('Increase PIC hours ratio by flying more as Pilot-in-Command');
  }
  if (input.stats.ifrHours < 50) {
    recommendations.push('Gain more IFR experience to improve instrument flying skills');
  }

  // Experience recommendations
  if (input.experience.years < 3) {
    recommendations.push('Continue building experience - each year adds significant points');
  }
  if (input.experience.achievements < 5) {
    recommendations.push('Pursue additional achievements and certifications');
  }
  if (input.experience.licenses < 3) {
    recommendations.push('Obtain additional licenses or type ratings');
  }

  // Assessment recommendations
  if (input.assessments.programCompletion < 100) {
    recommendations.push('Complete all program modules to maximize assessment score');
  }
  if (input.assessments.performanceScore < 80) {
    recommendations.push('Focus on improving performance in assessments and evaluations');
  }

  // Mentorship recommendations
  if (input.mentorship.hours < 10) {
    recommendations.push('Engage in mentorship activities to gain mentorship hours');
  }
  if (input.mentorship.observations < 10) {
    recommendations.push('Participate in more observation sessions');
  }
  if (input.mentorship.cases < 5) {
    recommendations.push('Take on more mentorship cases to demonstrate leadership');
  }

  return recommendations;
};

/**
 * Calculate total recognition score with breakdown
 */
export const calculateRecognitionScore = (
  input: PilotScoreInput,
  weights: ScoreWeights = DEFAULT_WEIGHTS
): ScoreBreakdown => {
  const hoursScore = calculateHoursScore(
    input.stats.totalHours,
    input.stats.picHours,
    input.stats.ifrHours,
    input.stats.nightHours
  );

  const experienceScore = calculateExperienceScore(
    input.experience.years,
    input.experience.achievements,
    input.experience.licenses
  );

  const assessmentScore = calculateAssessmentScore(
    input.assessments.programCompletion,
    input.assessments.performanceScore
  );

  const mentorshipScore = calculateMentorshipScore(
    input.mentorship.hours,
    input.mentorship.observations,
    input.mentorship.cases,
    input.mentorship.menteesHelped || 0,
    input.mentorship.averageRating || 0,
    input.mentorship.outcomesCompleted || 0
  );

  const totalScore = Math.round(
    hoursScore * weights.hours +
    experienceScore * weights.experience +
    assessmentScore * weights.assessments +
    mentorshipScore * weights.mentorship
  );

  const recommendations = generateRecommendations(input);

  return {
    totalScore: Math.min(totalScore, 1000),
    hoursScore,
    experienceScore,
    assessmentScore,
    mentorshipScore,
    breakdown: {
      totalHours: input.stats.totalHours,
      picHours: input.stats.picHours,
      ifrHours: input.stats.ifrHours,
      nightHours: input.stats.nightHours,
      experienceYears: input.experience.years,
      achievementsCount: input.experience.achievements,
      licensesCount: input.experience.licenses,
      programCompletion: input.assessments.programCompletion,
      performanceScore: input.assessments.performanceScore,
      mentorshipHours: input.mentorship.hours,
      mentorshipObservations: input.mentorship.observations,
      mentorshipCases: input.mentorship.cases,
      mentorshipMenteesHelped: input.mentorship.menteesHelped || 0,
      mentorshipAverageRating: input.mentorship.averageRating || 0,
      mentorshipOutcomesCompleted: input.mentorship.outcomesCompleted || 0,
    },
    recommendations,
  };
};

/**
 * Get score tier/rank based on total score
 */
export const getScoreTier = (score: number): string => {
  if (score >= 900) return 'Platinum';
  if (score >= 800) return 'Gold';
  if (score >= 700) return 'Silver';
  if (score >= 600) return 'Bronze';
  if (score >= 500) return 'Copper';
  if (score >= 400) return 'Steel';
  return 'Iron';
};

/**
 * Get score color for UI display
 */
export const getScoreColor = (score: number): string => {
  if (score >= 900) return '#E5E4E2'; // Platinum
  if (score >= 800) return '#FFD700'; // Gold
  if (score >= 700) return '#C0C0C0'; // Silver
  if (score >= 600) return '#CD7F32'; // Bronze
  if (score >= 500) return '#B87333'; // Copper
  if (score >= 400) return '#71797E'; // Steel
  return '#434343'; // Iron
};
