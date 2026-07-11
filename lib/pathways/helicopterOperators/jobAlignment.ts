// Job Alignment Engine
// Compares a pilot's verified profile against a job listing's requirements
// and produces an alignment score with gap analysis.
//
// This is the core "career alignment" value: before a pilot applies for a job,
// the platform tells them whether they're a fit, what gaps they have, and
// whether it's worth applying. When ready, they redirect to the original posting.

import {
  JobListing,
  JobAlignmentResult,
  JobRequirementGap,
  JobRequirements,
  PilotJobProfile,
  JobGapSeverity,
  JobFeedFilter,
  JobFeedStats,
  JobCategory,
  JobSeat,
} from './jobAlignmentTypes';

// --- Helpers ----------------------------------------------------------------

function parseHours(val: string | number | undefined | null): number {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  const cleaned = val.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

function licenseMatches(required: string, held: string): boolean {
  if (!required || !held) return false;
  const r = required.toUpperCase().trim();
  const h = held.toUpperCase().trim();
  // ATPL satisfies ATP/ATPL/CPL requirements
  if (r.includes('ATP') && (h.includes('ATP') || h.includes('ATPL'))) return true;
  // CPL satisfies CPL requirement (but not ATP)
  if (r.includes('CPL') && h.includes('CPL')) return true;
  // Direct match
  if (h.includes(r)) return true;
  return false;
}

function typeRatingMatches(required: string, held: string[]): boolean {
  if (!required || required.toLowerCase() === 'not required' || required === '') return true;
  if (required.toLowerCase() === 'required') {
    // Generic "required" — check if pilot has any type ratings
    return held.length > 0;
  }
  // Check for specific type in held ratings
  const reqUpper = required.toUpperCase();
  return held.some((t) => t.toUpperCase().includes(reqUpper) || reqUpper.includes(t.toUpperCase()));
}

function medicalMatches(required: string, held: string): boolean {
  if (!required) return true;
  const r = required.toUpperCase();
  const h = (held || '').toUpperCase();
  if (r.includes('CLASS 1') && h.includes('CLASS 1')) return true;
  if (r.includes('CLASS 2') && (h.includes('CLASS 2') || h.includes('CLASS 1'))) return true;
  return false;
}

function englishMatches(required: string, held: string): boolean {
  const reqNum = parseInt((required || '4').replace(/[^0-9]/g, ''), 10) || 4;
  const heldNum = parseInt((held || '0').replace(/[^0-9]/g, ''), 10) || 0;
  return heldNum >= reqNum;
}

// --- Gap Calculation --------------------------------------------------------

function checkHourGap(
  label: string,
  field: string,
  current: number,
  required: number,
  costPerHour: number
): JobRequirementGap | null {
  if (required <= 0) return null;
  if (current >= required) {
    return {
      field,
      label,
      type: 'hours',
      currentValue: current,
      requiredValue: required,
      shortfall: 0,
      severity: 'met',
      canClose: false,
      closingActions: [],
    };
  }

  const shortfall = required - current;
  const pct = current / required;
  let severity: JobGapSeverity;
  if (pct < 0.5) severity = 'critical';
  else if (pct < 0.75) severity = 'major';
  else if (pct < 0.9) severity = 'minor';
  else severity = 'advisory';

  const months = Math.ceil(shortfall / 30); // 30h/month
  let timeToClose: string;
  if (months <= 6) timeToClose = `${months} months`;
  else if (months <= 12) timeToClose = '~1 year';
  else if (months <= 24) timeToClose = '~2 years';
  else timeToClose = `${Math.ceil(months / 12)}+ years`;

  return {
    field,
    label,
    type: 'hours',
    currentValue: current,
    requiredValue: required,
    shortfall,
    severity,
    canClose: true,
    estimatedTimeToClose: timeToClose,
    estimatedCost: Math.round(shortfall * costPerHour),
    closingActions: [
      `Build ${shortfall} additional ${label.toLowerCase()}`,
      `Estimated ${timeToClose} at 30h/month`,
    ],
  };
}

// --- Main Alignment Function ------------------------------------------------

/**
 * Analyze alignment between a pilot's profile and a job listing.
 * Returns a detailed alignment report with scores, gaps, and recommendations.
 *
 * This is the core "should I apply?" function.
 */
export function alignJob(
  job: JobListing,
  profile: PilotJobProfile
): JobAlignmentResult {
  const req = job.requirements;
  const gaps: JobRequirementGap[] = [];
  let metCount = 0;
  let totalCount = 0;

  // --- Hour gaps ---
  const hourChecks: [string, string, number, number, number][] = [
    ['Total Flight Hours', 'total_hours', profile.totalFlightHours, req.minTotalHours, 200],
    ['PIC Hours', 'pic_hours', profile.picHours, req.minPicHours, 200],
    ['PIC in Type', 'pic_in_type', profile.picInTypeHours ?? 0, req.minPicInTypeHours, 250],
  ];

  if (req.minMultiEngineHours) {
    hourChecks.push(['Multi-Engine Hours', 'multi_engine', profile.multiEngineHours ?? 0, req.minMultiEngineHours, 300]);
  }
  if (req.minInstrumentHours) {
    hourChecks.push(['Instrument Hours', 'instrument', profile.instrumentHours ?? 0, req.minInstrumentHours, 300]);
  }
  if (req.minNightHours) {
    hourChecks.push(['Night Hours', 'night', profile.nightHours ?? 0, req.minNightHours, 250]);
  }
  if (req.minTurbineHours) {
    hourChecks.push(['Turbine Hours', 'turbine', profile.turbineHours ?? 0, req.minTurbineHours, 300]);
  }
  if (req.minOffshoreHours) {
    hourChecks.push(['Offshore Hours', 'offshore', profile.offshoreHours ?? 0, req.minOffshoreHours, 350]);
  }
  if (req.minMountainHours) {
    hourChecks.push(['Mountain Hours', 'mountain', profile.mountainHours ?? 0, req.minMountainHours, 300]);
  }

  for (const [label, field, current, required, costPerHr] of hourChecks) {
    if (required <= 0) continue;
    totalCount++;
    const gap = checkHourGap(label, field, current, required, costPerHr);
    if (gap) {
      gaps.push(gap);
      if (gap.severity === 'met') metCount++;
    } else {
      metCount++;
    }
  }

  // --- License ---
  if (req.licenseRequired) {
    totalCount++;
    if (licenseMatches(req.licenseRequired, profile.license)) {
      gaps.push({
        field: 'license',
        label: `${req.licenseRequired} License`,
        type: 'license',
        currentValue: profile.license,
        requiredValue: req.licenseRequired,
        shortfall: 0,
        severity: 'met',
        canClose: false,
        closingActions: [],
      });
      metCount++;
    } else {
      gaps.push({
        field: 'license',
        label: `${req.licenseRequired} License`,
        type: 'license',
        currentValue: profile.license || 'Not held',
        requiredValue: req.licenseRequired,
        shortfall: 'License upgrade required',
        severity: 'critical',
        canClose: true,
        estimatedTimeToClose: '6-18 months',
        estimatedCost: 40000,
        closingActions: [
          `Upgrade to ${req.licenseRequired}`,
          'Complete required training and examinations',
        ],
      });
    }
  }

  // --- Type Rating ---
  if (req.typeRatingRequired) {
    totalCount++;
    if (typeRatingMatches(req.typeRatingRequired, profile.typeRatings)) {
      gaps.push({
        field: 'type_rating',
        label: `${req.typeRatingRequired} Type Rating`,
        type: 'type_rating',
        currentValue: profile.typeRatings.join(', ') || 'Held',
        requiredValue: req.typeRatingRequired,
        shortfall: 0,
        severity: 'met',
        canClose: false,
        closingActions: [],
      });
      metCount++;
    } else {
      gaps.push({
        field: 'type_rating',
        label: `${req.typeRatingRequired} Type Rating`,
        type: 'type_rating',
        currentValue: profile.typeRatings.join(', ') || 'None held',
        requiredValue: req.typeRatingRequired,
        shortfall: 'Type rating not held',
        severity: req.typeRatingProvided ? 'minor' : 'major',
        canClose: true,
        estimatedTimeToClose: '4-8 weeks',
        estimatedCost: req.typeRatingProvided ? 0 : 30000,
        closingActions: req.typeRatingProvided
          ? ['Type rating provided by employer — no action needed before applying']
          : [
              `Complete ${req.typeRatingRequired} type rating course`,
              'Manufacturer or authorized training center',
            ],
      });
    }
  }

  // --- Medical ---
  if (req.medicalClass) {
    totalCount++;
    if (medicalMatches(req.medicalClass, profile.medicalClass)) {
      metCount++;
      gaps.push({
        field: 'medical',
        label: `${req.medicalClass} Medical`,
        type: 'medical',
        currentValue: profile.medicalClass,
        requiredValue: req.medicalClass,
        shortfall: 0,
        severity: 'met',
        canClose: false,
        closingActions: [],
      });
    } else {
      gaps.push({
        field: 'medical',
        label: `${req.medicalClass} Medical`,
        type: 'medical',
        currentValue: profile.medicalClass || 'Unknown',
        requiredValue: req.medicalClass,
        shortfall: 'Medical upgrade required',
        severity: 'major',
        canClose: true,
        estimatedTimeToClose: '2-4 weeks',
        estimatedCost: 500,
        closingActions: ['Complete aviation medical examination'],
      });
    }
  }

  // --- English ---
  if (req.icaoElpLevel) {
    totalCount++;
    if (englishMatches(req.icaoElpLevel, profile.icaoElpLevel)) {
      metCount++;
      gaps.push({
        field: 'english',
        label: `ICAO English Level ${req.icaoElpLevel}`,
        type: 'english',
        currentValue: profile.icaoElpLevel,
        requiredValue: req.icaoElpLevel,
        shortfall: 0,
        severity: 'met',
        canClose: false,
        closingActions: [],
      });
    } else {
      gaps.push({
        field: 'english',
        label: `ICAO English Level ${req.icaoElpLevel}`,
        type: 'english',
        currentValue: profile.icaoElpLevel || 'Unknown',
        requiredValue: req.icaoElpLevel,
        shortfall: 'English proficiency below required level',
        severity: 'minor',
        canClose: true,
        estimatedTimeToClose: '1-2 weeks',
        estimatedCost: 300,
        closingActions: ['Complete ICAO English language proficiency assessment'],
      });
    }
  }

  // --- Tally ---
  const criticalGaps = gaps.filter((g) => g.severity === 'critical').length;
  const majorGaps = gaps.filter((g) => g.severity === 'major').length;
  const minorGaps = gaps.filter((g) => g.severity === 'minor').length;
  const advisoryGaps = gaps.filter((g) => g.severity === 'advisory').length;

  // --- Scores ---
  const requirementsScore = totalCount > 0 ? Math.round((metCount / totalCount) * 100) : 0;

  // Experience score — how competitive is the pilot beyond minimums?
  const hourRatio = req.minTotalHours > 0
    ? Math.min(1.5, profile.totalFlightHours / req.minTotalHours)
    : 1;
  const experienceScore = Math.round(Math.min(100, hourRatio * 70 + (profile.verificationStatus === 'verified' ? 15 : 0) + (profile.recognitionScore ?? 0) * 0.1));

  // Overall alignment — weighted blend
  const alignmentScore = Math.round(requirementsScore * 0.6 + experienceScore * 0.4);

  // --- Overall fit ---
  let overallFit: JobAlignmentResult['overallFit'];
  if (alignmentScore >= 90 && criticalGaps === 0) overallFit = 'excellent';
  else if (alignmentScore >= 75 && criticalGaps === 0) overallFit = 'good';
  else if (alignmentScore >= 50 && criticalGaps === 0) overallFit = 'fair';
  else if (criticalGaps > 0 && criticalGaps <= 1) overallFit = 'poor';
  else overallFit = 'ineligible';

  // --- Recommendation ---
  let recommendation: JobAlignmentResult['recommendation'];
  let recommendationReason: string;

  if (criticalGaps === 0 && majorGaps === 0) {
    recommendation = 'apply_now';
    recommendationReason = 'You meet all critical and major requirements. Apply with confidence.';
  } else if (criticalGaps === 0 && majorGaps <= 1) {
    recommendation = 'apply_with_caveats';
    recommendationReason = 'You meet most requirements. One major gap exists but the employer may consider you.';
  } else if (criticalGaps <= 1 && majorGaps <= 2) {
    recommendation = 'close_gaps_first';
    recommendationReason = `You have ${criticalGaps} critical and ${majorGaps} major gaps. Close these before applying.`;
  } else {
    recommendation = 'not_eligible';
    recommendationReason = `You have ${criticalGaps} critical gaps. This job is not a fit at this time.`;
  }

  // --- Blind spot detection ---
  // A blind spot is a job the pilot wouldn't normally search for but is actually a good fit.
  let isBlindSpot = false;
  let blindSpotReason: string | undefined;

  if (alignmentScore >= 70 && criticalGaps === 0) {
    // Check if this is outside the pilot's typical category
    // (Would need search history for full implementation — using heuristics)
    if (job.category === 'helicopter' && profile.rotaryHours && profile.rotaryHours < 100) {
      // Fixed-wing pilot who could transition to rotary
      isBlindSpot = true;
      blindSpotReason = 'Outside your usual category but you meet the requirements.';
    } else if (job.seat === 'captain' && profile.picHours < req.minPicHours * 0.8) {
      // Close to captain eligibility but might not self-select
      isBlindSpot = true;
      blindSpotReason = 'You are close to captain eligibility — consider applying.';
    } else if (alignmentScore >= 85 && job.location !== 'Unknown') {
      // High match in a location the pilot might not have considered
      isBlindSpot = true;
      blindSpotReason = 'High alignment score — you might not have considered this opportunity.';
    }
  }

  // --- Next steps ---
  const nextSteps: string[] = [];
  if (recommendation === 'apply_now') {
    nextSteps.push('You are ready to apply!');
    nextSteps.push(job.applicationUrl
      ? `Apply here: ${job.applicationUrl}`
      : `Apply at: ${job.url}`
    );
  } else if (recommendation === 'apply_with_caveats') {
    nextSteps.push('You are mostly aligned — apply and address the gap in your cover letter.');
    nextSteps.push(`Apply here: ${job.applicationUrl || job.url}`);
  } else if (recommendation === 'close_gaps_first') {
    const critical = gaps.filter((g) => g.severity === 'critical');
    const major = gaps.filter((g) => g.severity === 'major');
    if (critical.length > 0) {
      nextSteps.push(`Address ${critical.length} critical gap(s):`);
      critical.forEach((g) => nextSteps.push(`  - ${g.label}: ${g.closingActions[0]}`));
    }
    if (major.length > 0) {
      nextSteps.push(`Then close ${major.length} major gap(s):`);
      major.forEach((g) => nextSteps.push(`  - ${g.label}: ${g.closingActions[0]}`));
    }
  } else {
    nextSteps.push('This job is not a fit right now.');
    nextSteps.push('Consider similar jobs or work on closing your gaps.');
  }

  return {
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    aircraft: job.aircraft,
    location: job.location,
    seat: job.seat,
    category: job.category,
    alignmentScore,
    requirementsScore,
    experienceScore,
    overallFit,
    gaps,
    criticalGaps,
    majorGaps,
    minorGaps,
    advisoryGaps,
    metRequirements: metCount,
    totalRequirements: totalCount,
    recommendation,
    recommendationReason,
    isBlindSpot,
    blindSpotReason,
    applicationUrl: job.applicationUrl || job.url,
    isRedirect: job.source.isRedirect,
    operatorSlug: job.operatorSlug,
    nextSteps,
  };
}

/**
 * Batch align jobs for a pilot.
 * Returns sorted by alignment score descending.
 */
export function batchAlignJobs(
  jobs: JobListing[],
  profile: PilotJobProfile
): JobAlignmentResult[] {
  return jobs
    .map((job) => alignJob(job, profile))
    .sort((a, b) => b.alignmentScore - a.alignmentScore);
}

// --- Job Feed Helpers -------------------------------------------------------

/**
 * Filter and sort jobs like a job board screener.
 */
export function screenJobs(
  jobs: JobListing[],
  alignments: Map<string, JobAlignmentResult>,
  filter: JobFeedFilter
): JobListing[] {
  let result = [...jobs];

  if (filter.category && filter.category !== 'all') {
    result = result.filter((j) => j.category === filter.category);
  }
  if (filter.seat && filter.seat !== 'all') {
    result = result.filter((j) => j.seat === filter.seat);
  }
  if (filter.location && filter.location !== 'all') {
    result = result.filter((j) => j.location.toLowerCase().includes(filter.location!.toLowerCase()));
  }
  if (filter.aircraft && filter.aircraft !== 'all') {
    result = result.filter((j) => j.aircraft.toLowerCase().includes(filter.aircraft!.toLowerCase()));
  }
  if (filter.company && filter.company !== 'all') {
    result = result.filter((j) => j.company.toLowerCase().includes(filter.company!.toLowerCase()));
  }
  if (filter.minAlignment != null) {
    result = result.filter((j) => (alignments.get(j.id)?.alignmentScore ?? 0) >= filter.minAlignment!);
  }
  if (filter.eligibleOnly) {
    result = result.filter((j) => {
      const a = alignments.get(j.id);
      return a && a.criticalGaps === 0 && a.majorGaps === 0;
    });
  }
  if (filter.blindSpotsOnly) {
    result = result.filter((j) => alignments.get(j.id)?.isBlindSpot === true);
  }

  const sortBy = filter.sortBy ?? 'alignment';
  switch (sortBy) {
    case 'alignment':
      result.sort((a, b) => (alignments.get(b.id)?.alignmentScore ?? 0) - (alignments.get(a.id)?.alignmentScore ?? 0));
      break;
    case 'posted':
      result.sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime());
      break;
    case 'company':
      result.sort((a, b) => a.company.localeCompare(b.company));
      break;
    case 'location':
      result.sort((a, b) => a.location.localeCompare(b.location));
      break;
  }

  return result;
}

/**
 * Compute job feed statistics.
 */
export function computeJobFeedStats(
  jobs: JobListing[],
  alignments?: Map<string, JobAlignmentResult>
): JobFeedStats {
  const byCategory: Record<string, number> = {};
  const bySeat: Record<string, number> = {};
  const byLocation: Record<string, number> = {};
  const companyCount: Record<string, number> = {};
  const aircraftCount: Record<string, number> = {};

  let hiringNow = 0;
  let acceptingApps = 0;
  let closingSoon = 0;
  let totalAlignment = 0;
  let alignedCount = 0;

  for (const job of jobs) {
    byCategory[job.category] = (byCategory[job.category] ?? 0) + 1;
    bySeat[job.seat] = (bySeat[job.seat] ?? 0) + 1;
    byLocation[job.location] = (byLocation[job.location] ?? 0) + 1;
    companyCount[job.company] = (companyCount[job.company] ?? 0) + 1;
    aircraftCount[job.aircraft] = (aircraftCount[job.aircraft] ?? 0) + 1;

    if (job.status === 'hiring_now') hiringNow++;
    else if (job.status === 'accepting_apps') acceptingApps++;
    else if (job.status === 'closing_soon') closingSoon++;

    if (alignments) {
      const a = alignments.get(job.id);
      if (a) {
        totalAlignment += a.alignmentScore;
        alignedCount++;
      }
    }
  }

  const topCompanies = Object.entries(companyCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name]) => name);

  const trendingAircraft = Object.entries(aircraftCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name]) => name);

  return {
    totalJobs: jobs.length,
    hiringNow,
    acceptingApps,
    closingSoon,
    byCategory,
    bySeat,
    byLocation,
    avgAlignmentScore: alignedCount > 0 ? Math.round(totalAlignment / alignedCount) : 0,
    topCompanies,
    trendingAircraft,
  };
}
