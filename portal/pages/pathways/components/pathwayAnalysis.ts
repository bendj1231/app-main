import type { PathwayData, GapAnalysis, RecognitionProfile, RequirementMatch } from './types';

export const MOCK_GAP_ANALYSIS: GapAnalysis = {
  gapPercentage: 23,
  totalGaps: 4,
  highPriorityGaps: 1,
  estimatedCost: 8500,
  estimatedTime: { days: 45, months: 2 },
  recommendations: [
    'Need 250 more multi-engine hours',
    'Complete A320 Type Rating Program',
    'Improve technical skills score to 80+',
    'Add turbine time through corporate charter'
  ],
};

export const MOCK_USER_PROFILE: RecognitionProfile = {
  totalScore: 78,
  breakdown: {
    programs: 85,
    experience: 72,
    behavioral: 80,
    language: 90,
    skills: 65,
  },
  pilotData: {
    totalHours: 3500,
    multiEngineHours: 1200,
    turbineHours: 800,
    typeRatings: ['B737', 'A320'],
  },
};

export function convertToRecognitionProfile(userProfile: any): RecognitionProfile {
  const totalHours = userProfile?.current_flight_hours || 0;

  const aircraftRatings = userProfile?.aircraft_ratings || [];
  const ratings = userProfile?.ratings || [];
  const typeRatings = [...aircraftRatings.map((ar: any) => ar.aircraft_type || ar), ...ratings].filter(Boolean);

  const experienceLevel = userProfile?.experience_level || 'Low Timer';
  const multiEngineHours = experienceLevel === 'High Timer' ? Math.round(totalHours * 0.6)
    : experienceLevel === 'Middle Timer' ? Math.round(totalHours * 0.4)
    : Math.round(totalHours * 0.2);
  const turbineHours = experienceLevel === 'High Timer' ? Math.round(totalHours * 0.5)
    : experienceLevel === 'Middle Timer' ? Math.round(totalHours * 0.3)
    : Math.round(totalHours * 0.1);

  const expScore = totalHours === 0 ? 10
    : Math.min(95, Math.round(30 + Math.log10(Math.max(1, totalHours)) * 18));

  const icaoLevel = userProfile?.english_proficiency_level || userProfile?.english_proficiency || '';
  const langScore = icaoLevel.includes('6') ? 100
    : icaoLevel.includes('5') ? 88
    : icaoLevel.includes('4') ? 72
    : 50;

  const medical = userProfile?.medical_class || '';
  const medScore = medical.includes('1') ? 100 : medical.includes('2') ? 75 : 40;

  const trBonus = typeRatings.length > 0 ? Math.min(20, typeRatings.length * 8) : 0;

  const totalScore = Math.min(100, Math.round(
    expScore * 0.45 + langScore * 0.20 + medScore * 0.15 + 65 * 0.20 + trBonus
  ));

  return {
    totalScore,
    breakdown: {
      programs: 65,
      experience: expScore,
      behavioral: 65,
      language: langScore,
      skills: 65,
    },
    pilotData: { totalHours, multiEngineHours, turbineHours, typeRatings },
  };
}

export function calcMatchProbability(
  job: { flightTime?: string; typeRating?: string; visaSponsorship?: string; location?: string },
  profile: RecognitionProfile
): number {
  let score = 0;
  let max = 0;

  const userHours = profile.pilotData?.totalHours || 0;
  const flightTimeText = job.flightTime?.replace(/,/g, '') || '';
  const reqHoursMatch = flightTimeText.match(/(\d{3,5})/);
  const reqHours = reqHoursMatch ? parseInt(reqHoursMatch[1]) : 0;

  max += 40;
  if (reqHours === 0 || userHours >= reqHours) {
    score += 40;
  } else if (userHours >= reqHours * 0.75) {
    score += 28;
  } else if (userHours >= reqHours * 0.5) {
    score += 16;
  } else if (userHours > 0) {
    score += 6;
  }

  max += 25;
  const trReq = String(job.typeRating || '').toLowerCase() || '';
  const userTRs = (profile.pilotData?.typeRatings || []).map((t: string) => String(t || '').toLowerCase());
  if (!trReq || trReq === 'not required' || trReq === 'n/a') {
    score += 25;
  } else if (userTRs.some(tr => trReq.includes(tr) || tr.includes(trReq.split(' ')[0]))) {
    score += 25;
  } else if (userTRs.length > 0) {
    score += 10;
  }

  max += 20;
  score += Math.round((profile.totalScore / 100) * 20);

  max += 15;
  score += Math.round((profile.breakdown.language / 100) * 15);

  const raw = Math.round((score / max) * 100);
  return Math.max(45, Math.min(99, raw));
}

export function analyzeRequirementAlignment(
  pathway: PathwayData,
  userProfile: RecognitionProfile
): RequirementMatch[] {
  const matches: RequirementMatch[] = [];

  const calculateStatus = (ratio: number): 'under-minimums' | 'close' | 'match' => {
    if (ratio < 0.5) return 'under-minimums';
    if (ratio < 0.8) return 'close';
    return 'match';
  };

  const calculateStatusFromScore = (score: number, threshold: number): 'under-minimums' | 'close' | 'match' => {
    if (score < threshold * 0.7) return 'under-minimums';
    if (score < threshold) return 'close';
    return 'match';
  };

  const hoursRatio = (userProfile.pilotData?.totalHours || 0) / pathway.requirements.totalHours;
  const hoursDiff = pathway.requirements.totalHours - (userProfile.pilotData?.totalHours || 0);
  matches.push({
    label: `Total Hours: ${userProfile.pilotData?.totalHours || 0} / ${pathway.requirements.totalHours}`,
    aligned: hoursRatio >= 0.8,
    score: Math.min(hoursRatio * 100, 100),
    status: calculateStatus(hoursRatio),
    suggestion: hoursDiff > 0 ? `Need ${hoursDiff} more flight hours` : 'Meets requirement',
  });

  if (pathway.requirements.multiEngineHours) {
    const meRatio = (userProfile.pilotData?.multiEngineHours || 0) / pathway.requirements.multiEngineHours;
    const meDiff = pathway.requirements.multiEngineHours - (userProfile.pilotData?.multiEngineHours || 0);
    matches.push({
      label: `Multi-Engine: ${userProfile.pilotData?.multiEngineHours || 0} / ${pathway.requirements.multiEngineHours}`,
      aligned: meRatio >= 0.8,
      score: Math.min(meRatio * 100, 100),
      status: calculateStatus(meRatio),
      suggestion: meDiff > 0 ? `Need ${meDiff} more multi-engine hours` : 'Meets requirement',
    });
  }

  if (pathway.requirements.turbineHours) {
    const turbineRatio = (userProfile.pilotData?.turbineHours || 0) / pathway.requirements.turbineHours;
    const turbineDiff = pathway.requirements.turbineHours - (userProfile.pilotData?.turbineHours || 0);
    matches.push({
      label: `Turbine Time: ${userProfile.pilotData?.turbineHours || 0} / ${pathway.requirements.turbineHours}`,
      aligned: turbineRatio >= 0.8,
      score: Math.min(turbineRatio * 100, 100),
      status: calculateStatus(turbineRatio),
      suggestion: turbineDiff > 0 ? `Need ${turbineDiff} more turbine hours` : 'Meets requirement',
    });
  }

  if (pathway.requirements.typeRatings.length > 0) {
    const hasTypeRating = pathway.requirements.typeRatings.some(rating =>
      userProfile.pilotData?.typeRatings?.some(userRating =>
        String(userRating || '').toUpperCase().includes(String(rating || '').toUpperCase())
      )
    );
    const missingRatings = pathway.requirements.typeRatings.filter(rating =>
      !userProfile.pilotData?.typeRatings?.some(userRating =>
        String(userRating || '').toUpperCase().includes(String(rating || '').toUpperCase())
      )
    );
    matches.push({
      label: `Type Rating: ${pathway.requirements.typeRatings.join(', ')}`,
      aligned: hasTypeRating,
      status: hasTypeRating ? 'match' : 'under-minimums',
      suggestion: hasTypeRating ? 'Type rating obtained' : `Need ${missingRatings.join(' and ')} type rating${missingRatings.length > 1 ? 's' : ''}`,
    });
  }

  const expDiff = 70 - userProfile.breakdown.experience;
  matches.push({
    label: 'Experience Score',
    aligned: userProfile.breakdown.experience >= 70,
    score: userProfile.breakdown.experience,
    status: calculateStatusFromScore(userProfile.breakdown.experience, 70),
    suggestion: expDiff > 0 ? `Improve experience by ${expDiff} points` : 'Meets requirement',
  });

  const skillsDiff = 70 - userProfile.breakdown.skills;
  matches.push({
    label: 'Technical Skills',
    aligned: userProfile.breakdown.skills >= 70,
    score: userProfile.breakdown.skills,
    status: calculateStatusFromScore(userProfile.breakdown.skills, 70),
    suggestion: skillsDiff > 0 ? `Improve technical skills by ${skillsDiff} points` : 'Meets requirement',
  });

  const langDiff = 80 - userProfile.breakdown.language;
  matches.push({
    label: 'Language Proficiency',
    aligned: userProfile.breakdown.language >= 80,
    score: userProfile.breakdown.language,
    status: calculateStatusFromScore(userProfile.breakdown.language, 80),
    suggestion: langDiff > 0 ? `Improve language proficiency by ${langDiff} points` : 'Meets requirement',
  });

  return matches;
}
