// Gap Analysis Engine
// Compares a pilot's profile against an operator's requirements
// and produces a detailed gap report with actionable next steps.

import {
  OperatorPathway,
  OperatorPathwayProfile,
  PilotRequirements,
  RequirementGap,
  GapAnalysisResult,
  TieredRequirements,
} from './types';

// --- Helpers ----------------------------------------------------------------

function num(val: number | string | null | undefined): number {
  if (val == null) return 0;
  if (typeof val === 'string') return parseFloat(val) || 0;
  return val;
}

function monthsToClose(hoursNeeded: number, monthlyRate: number): string {
  if (hoursNeeded <= 0) return 'Met';
  if (monthlyRate <= 0) return 'Unknown';
  const months = Math.ceil(hoursNeeded / monthlyRate);
  if (months <= 6) return `${months} months`;
  if (months <= 12) return '~1 year';
  if (months <= 24) return '~2 years';
  if (months <= 36) return '~3 years';
  return `${Math.ceil(months / 12)} years`;
}

function costLabel(cost: number, currency: string): string {
  if (cost <= 0) return '$0';
  if (currency === 'USD') return `$${cost.toLocaleString()}`;
  if (currency === 'AUD') return `A$${cost.toLocaleString()}`;
  if (currency === 'NZD') return `NZ$${cost.toLocaleString()}`;
  if (currency === 'INR') return `\u20b9${cost.toLocaleString('en-IN')}`;
  if (currency === 'MYR') return `RM${cost.toLocaleString()}`;
  if (currency === 'CNY') return `\u00a5${cost.toLocaleString()}`;
  return `${cost.toLocaleString()} ${currency}`;
}

// --- Hour Gap Calculation ---------------------------------------------------

function checkHourGap(
  label: string,
  field: string,
  current: number,
  required: number,
  monthlyRate: number,
  costPerHour: number,
  currency: string
): RequirementGap | null {
  if (required <= 0) return null;
  const shortfall = required - current;
  if (shortfall <= 0) return null;

  const pct = current / required;
  let severity: RequirementGap['severity'];
  if (pct < 0.5) severity = 'critical';
  else if (pct < 0.75) severity = 'major';
  else if (pct < 0.9) severity = 'minor';
  else severity = 'advisory';

  const estimatedCost = Math.round(shortfall * costPerHour);

  return {
    type: 'hours',
    field,
    label,
    currentValue: current,
    requiredValue: required,
    shortfall,
    severity,
    estimatedTimeToClose: monthsToClose(shortfall, monthlyRate),
    estimatedCost,
    estimatedCostCurrency: currency,
    closingActions: [
      `Build ${shortfall} additional ${label.toLowerCase()}`,
      monthlyRate > 0
        ? `At ${monthlyRate}h/month, approximately ${monthsToClose(shortfall, monthlyRate)}`
        : 'Rate depends on flying opportunity',
    ],
  };
}

// --- Rating Gap Calculation -------------------------------------------------

function checkRatingGap(
  label: string,
  requiredRatings: string[],
  heldRatings: string[]
): RequirementGap[] {
  const gaps: RequirementGap[] = [];
  const held = new Set(heldRatings.map((r) => r.toUpperCase().trim()));

  for (const rating of requiredRatings) {
    if (!held.has(rating.toUpperCase().trim())) {
      gaps.push({
        type: 'rating',
        field: rating.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        label: `${rating} Rating`,
        currentValue: 'Not held',
        requiredValue: rating,
        shortfall: rating,
        severity: 'critical',
        estimatedTimeToClose: '3-6 months',
        estimatedCost: 15000,
        estimatedCostCurrency: 'USD',
        closingActions: [
          `Obtain ${rating} rating through an approved training organization`,
          'Includes ground school, flight training, and flight test',
        ],
      });
    }
  }
  return gaps;
}

// --- Type Rating Gap Calculation --------------------------------------------

function checkTypeRatingGap(
  requiredTypes: string[],
  preferredTypes: string[],
  heldTypes: string[]
): RequirementGap[] {
  const gaps: RequirementGap[] = [];
  const held = new Set(heldTypes.map((t) => t.toUpperCase().trim()));

  for (const typeRating of requiredTypes) {
    if (!held.has(typeRating.toUpperCase().trim())) {
      gaps.push({
        type: 'type_rating',
        field: typeRating.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        label: `${typeRating} Type Rating`,
        currentValue: 'Not held',
        requiredValue: typeRating,
        shortfall: typeRating,
        severity: 'major',
        estimatedTimeToClose: '4-8 weeks',
        estimatedCost: 30000,
        estimatedCostCurrency: 'USD',
        closingActions: [
          `Complete ${typeRating} type rating course`,
          'Manufacturer or authorized training center',
          'Includes simulator and aircraft training',
        ],
      });
    }
  }

  for (const typeRating of preferredTypes) {
    if (!held.has(typeRating.toUpperCase().trim())) {
      gaps.push({
        type: 'type_rating',
        field: typeRating.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        label: `${typeRating} Type Rating (preferred)`,
        currentValue: 'Not held',
        requiredValue: typeRating,
        shortfall: typeRating,
        severity: 'advisory',
        estimatedTimeToClose: '4-8 weeks',
        estimatedCost: 30000,
        estimatedCostCurrency: 'USD',
        closingActions: [
          `Complete ${typeRating} type rating (preferred, not required)`,
          'Improves competitiveness but not mandatory',
        ],
      });
    }
  }

  return gaps;
}

// --- Medical / English / Age / Citizenship ----------------------------------

function checkMedicalGap(
  requiredClass: string,
  pilotMedical?: string
): RequirementGap | null {
  if (!pilotMedical) {
    return {
      type: 'medical',
      field: 'medical_class',
      label: `${requiredClass} Medical`,
      currentValue: 'Unknown',
      requiredValue: requiredClass,
      shortfall: 'Not verified',
      severity: 'major',
      estimatedTimeToClose: '2-4 weeks',
      estimatedCost: 500,
      estimatedCostCurrency: 'USD',
      closingActions: ['Complete aviation medical examination with approved examiner'],
    };
  }
  const pilot = pilotMedical.toUpperCase();
  const required = requiredClass.toUpperCase();
  if (required === 'CLASS 1' && pilot !== 'CLASS 1' && pilot !== 'CLASS 1 MEDICAL') {
    return {
      type: 'medical',
      field: 'medical_class',
      label: 'Class 1 Medical',
      currentValue: pilotMedical,
      requiredValue: requiredClass,
      shortfall: 'Upgrade required',
      severity: 'major',
      estimatedTimeToClose: '2-4 weeks',
      estimatedCost: 500,
      estimatedCostCurrency: 'USD',
      closingActions: ['Upgrade to Class 1 medical certificate'],
    };
  }
  return null;
}

function checkEnglishGap(
  requiredLevel: string,
  pilotLevel?: string
): RequirementGap | null {
  if (!pilotLevel) {
    return {
      type: 'english',
      field: 'icao_english',
      label: 'ICAO English Proficiency',
      currentValue: 'Unknown',
      requiredValue: requiredLevel,
      shortfall: 'Not verified',
      severity: 'minor',
      estimatedTimeToClose: '1-2 weeks',
      estimatedCost: 300,
      estimatedCostCurrency: 'USD',
      closingActions: ['Complete ICAO English language proficiency assessment'],
    };
  }
  const pilotNum = parseInt(pilotLevel.replace(/[^0-9]/g, ''), 10) || 0;
  const reqNum = parseInt(requiredLevel.replace(/[^0-9]/g, ''), 10) || 4;
  if (pilotNum < reqNum) {
    return {
      type: 'english',
      field: 'icao_english',
      label: 'ICAO English Proficiency',
      currentValue: pilotLevel,
      requiredValue: requiredLevel,
      shortfall: `Level ${reqNum} required, have ${pilotNum}`,
      severity: 'minor',
      estimatedTimeToClose: '1-2 weeks',
      estimatedCost: 300,
      estimatedCostCurrency: 'USD',
      closingActions: [`Upgrade English proficiency to ICAO Level ${reqNum}`],
    };
  }
  return null;
}

function checkAgeGap(
  maxAge: number | undefined,
  pilotAge: number | null | undefined
): RequirementGap | null {
  if (maxAge == null || maxAge <= 0) return null;
  if (pilotAge == null) return null;
  if (pilotAge > maxAge) {
    return {
      type: 'age',
      field: 'age',
      label: 'Age Limit',
      currentValue: pilotAge,
      requiredValue: `Max ${maxAge}`,
      shortfall: `Over limit by ${pilotAge - maxAge} years`,
      severity: 'critical',
      estimatedTimeToClose: 'Not closeable',
      estimatedCost: 0,
      estimatedCostCurrency: 'USD',
      closingActions: ['Age limit exceeded — consider operators without age restrictions'],
    };
  }
  if (pilotAge > maxAge - 3) {
    return {
      type: 'age',
      field: 'age',
      label: 'Age Limit',
      currentValue: pilotAge,
      requiredValue: `Max ${maxAge}`,
      shortfall: `Within ${maxAge - pilotAge} years of limit`,
      severity: 'advisory',
      estimatedTimeToClose: 'N/A',
      estimatedCost: 0,
      estimatedCostCurrency: 'USD',
      closingActions: [`Apply soon — within ${maxAge - pilotAge} years of age limit`],
    };
  }
  return null;
}

function checkCitizenshipGap(
  requirements: string[],
  pilotCitizenship?: string
): RequirementGap | null {
  if (!requirements.length || !pilotCitizenship) return null;
  const pilot = pilotCitizenship.toLowerCase();
  const matches = requirements.some((r) => r.toLowerCase().includes(pilot));
  if (!matches && requirements.length > 0) {
    return {
      type: 'citizenship',
      field: 'citizenship',
      label: 'Citizenship / Work Rights',
      currentValue: pilotCitizenship,
      requiredValue: requirements.join(' or '),
      shortfall: 'Citizenship requirement not met',
      severity: 'critical',
      estimatedTimeToClose: 'Variable',
      estimatedCost: 0,
      estimatedCostCurrency: 'USD',
      closingActions: [
        'Check visa sponsorship availability',
        'Consider operators in your country of citizenship',
      ],
    };
  }
  return null;
}

// --- Main Gap Analysis ------------------------------------------------------

/**
 * Analyze the gap between a pilot's profile and an operator's requirements.
 * Returns a detailed gap report with severity, time/cost estimates, and actions.
 */
export function analyzeGap(
  pathway: OperatorPathway,
  profile: OperatorPathwayProfile
): GapAnalysisResult | null {
  const enrichment = pathway.enrichment;
  if (!enrichment?.requirements) return null;

  // Pick the most relevant tier based on pilot hours
  const totalHours = num(profile.total_flight_hours);
  const tiered = enrichment.requirements as TieredRequirements;

  let requirements: PilotRequirements | undefined;
  if (totalHours >= 3000 && tiered.captain) {
    requirements = tiered.captain;
  } else if (totalHours >= 500 && tiered.firstOfficer) {
    requirements = tiered.firstOfficer;
  } else if (tiered.cadet) {
    requirements = tiered.cadet;
  } else {
    // Fall back to any available tier
    requirements = tiered.captain || tiered.firstOfficer || tiered.cadet || undefined;
  }

  if (!requirements) return null;

  const gaps: RequirementGap[] = [];
  const currency = 'USD';

  // --- Hour gaps ---
  const monthlyRate = 30; // assume 30h/month building time
  const hourChecks: [string, string, number, number, number, number][] = [
    ['Total Flight Hours', 'total_hours', totalHours, requirements.minTotalHours, monthlyRate, 200],
    ['Rotary Hours', 'rotary_hours', num(profile.rotary_hours), requirements.minRotaryHours, monthlyRate, 250],
    ['PIC Hours', 'pic_hours', num(profile.pic_hours), requirements.minPicHours, monthlyRate, 200],
    ['Multi-Engine Hours', 'multi_engine_hours', num(profile.multi_engine_hours), requirements.minMultiEngineHours, 20, 300],
  ];

  if (requirements.minInstrumentHours) {
    hourChecks.push([
      'Instrument Hours', 'instrument_hours',
      num(profile.instrument_hours), requirements.minInstrumentHours,
      10, 300,
    ]);
  }
  if (requirements.minNightHours) {
    hourChecks.push([
      'Night Hours', 'night_hours',
      num(profile.night_hours), requirements.minNightHours,
      10, 250,
    ]);
  }
  if (requirements.minOffshoreHours) {
    hourChecks.push([
      'Offshore Hours', 'offshore_hours',
      num(profile.offshore_hours), requirements.minOffshoreHours,
      15, 350,
    ]);
  }
  if (requirements.minTurbineHours) {
    hourChecks.push([
      'Turbine Hours', 'turbine_hours',
      num(profile.turbine_hours), requirements.minTurbineHours,
      20, 300,
    ]);
  }
  if (requirements.minMountainHours) {
    hourChecks.push([
      'Mountain Hours', 'mountain_hours',
      num(profile.mountain_hours), requirements.minMountainHours,
      15, 300,
    ]);
  }

  for (const [label, field, current, required, rate, costPerHr] of hourChecks) {
    const gap = checkHourGap(label, field, current, required, rate, costPerHr, currency);
    if (gap) gaps.push(gap);
  }

  // --- Rating gaps ---
  gaps.push(...checkRatingGap('Ratings', requirements.requiredRatings, profile.ratings ?? []));

  // --- Type rating gaps ---
  gaps.push(
    ...checkTypeRatingGap(
      requirements.requiredTypeRatings,
      requirements.preferredTypeRatings,
      profile.type_ratings ?? []
    )
  );

  // --- Medical ---
  const medGap = checkMedicalGap(requirements.medicalClass, profile.medical_class);
  if (medGap) gaps.push(medGap);

  // --- English ---
  const engGap = checkEnglishGap(requirements.englishLevel, profile.icao_english_level);
  if (engGap) gaps.push(engGap);

  // --- Age ---
  const ageGap = checkAgeGap(requirements.maxAge, profile.age);
  if (ageGap) gaps.push(ageGap);

  // --- Citizenship ---
  const citGap = checkCitizenshipGap(requirements.citizenshipRequirements, profile.citizenship);
  if (citGap) gaps.push(citGap);

  // --- Tally ---
  const criticalGaps = gaps.filter((g) => g.severity === 'critical').length;
  const majorGaps = gaps.filter((g) => g.severity === 'major').length;
  const minorGaps = gaps.filter((g) => g.severity === 'minor').length;
  const advisoryGaps = gaps.filter((g) => g.severity === 'advisory').length;

  // --- Match score ---
  const totalChecks = gaps.length + 6; // approximate total checks
  const metChecks = totalChecks - gaps.length;
  const overallMatchScore = Math.round((metChecks / totalChecks) * 100);

  // --- Eligibility ---
  const eligible = criticalGaps === 0 && majorGaps === 0;
  const nearEligible = criticalGaps === 0 && majorGaps <= 2;

  // --- Time/cost estimates ---
  const totalCost = gaps.reduce((sum, g) => sum + g.estimatedCost, 0);
  const maxMonths = Math.max(
    ...gaps.map((g) => {
      const m = parseInt(g.estimatedTimeToClose.replace(/[^0-9]/g, ''), 10);
      return isNaN(m) ? 0 : m;
    }),
    0
  );

  let estimatedTimeToQualify: string;
  if (gaps.length === 0) {
    estimatedTimeToQualify = 'Qualified now';
  } else if (maxMonths <= 0) {
    estimatedTimeToQualify = 'Variable';
  } else if (maxMonths <= 6) {
    estimatedTimeToQualify = `${maxMonths} months`;
  } else if (maxMonths <= 12) {
    estimatedTimeToQualify = '~1 year';
  } else if (maxMonths <= 24) {
    estimatedTimeToQualify = '~2 years';
  } else if (maxMonths <= 36) {
    estimatedTimeToQualify = '~3 years';
  } else {
    estimatedTimeToQualify = `${Math.ceil(maxMonths / 12)}+ years`;
  }

  // --- Next steps ---
  const nextSteps: string[] = [];
  const critical = gaps.filter((g) => g.severity === 'critical');
  const major = gaps.filter((g) => g.severity === 'major');

  if (critical.length > 0) {
    nextSteps.push(`Address ${critical.length} critical gap(s) first:`);
    critical.forEach((g) => nextSteps.push(`  - ${g.label}: ${g.closingActions[0]}`));
  }
  if (major.length > 0) {
    nextSteps.push(`Then close ${major.length} major gap(s):`);
    major.forEach((g) => nextSteps.push(`  - ${g.label}: ${g.closingActions[0]}`));
  }
  if (gaps.length === 0) {
    nextSteps.push('You meet all minimum requirements — submit your application!');
    nextSteps.push(`Apply at: ${pathway.website ?? 'operator website'}`);
  }
  if (nearEligible && !eligible) {
    nextSteps.push('You are close to eligible — consider submitting an expression of interest.');
  }

  return {
    operatorId: pathway.id,
    operatorName: pathway.name,
    overallMatchScore,
    eligible,
    nearEligible,
    gaps,
    criticalGaps,
    majorGaps,
    minorGaps,
    advisoryGaps,
    estimatedTimeToQualify,
    estimatedTotalCost: totalCost,
    estimatedTotalCostCurrency: currency,
    nextSteps,
    similarOperators: [], // populated by hook
  };
}

/**
 * Batch analyze gaps for multiple operators.
 * Returns sorted by match score descending.
 */
export function batchAnalyzeGaps(
  pathways: OperatorPathway[],
  profile: OperatorPathwayProfile
): GapAnalysisResult[] {
  return pathways
    .map((p) => analyzeGap(p, profile))
    .filter((r): r is GapAnalysisResult => r !== null)
    .sort((a, b) => b.overallMatchScore - a.overallMatchScore);
}
