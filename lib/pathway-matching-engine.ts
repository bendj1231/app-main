/**
 * Client-side Pathway Matching Engine
 * 
 * This module provides dating-site accurate matching calculations
 * without requiring Supabase Pro features. All calculations are done
 * client-side using the Git-based pathway data.
 * 
 * This is a cost-effective solution that works with the free tier.
 */

export interface Pathway {
  id: string;
  title: string;
  subtitle: string;
  match: number;
  pr: number;
  image: string;
  requirements: string[];
  type: string;
  salary: string;
  active: boolean;
  tags: string[];
  priority: string;
}

export interface PilotProfile {
  totalFlightHours: number;
  licenses: string[];
  medicalCertificate: string;
  overallRecognitionScore: number;
  careerGoals: string[];
  preferredAircraft: string[];
  willingnessToRelocate: boolean;
  preferredRegions: string[];
  experienceLevel: string;
  ageRange: string;
  educationLevel: string;
  languageProficiency: string[];
  riskTolerance: string;
  workLifeBalancePreference: string;
}

export interface MatchWeights {
  hoursWeight: number;
  recognitionWeight: number;
  licenseWeight: number;
  medicalWeight: number;
  careerAlignmentWeight: number;
  locationWeight: number;
}

export interface MatchResult {
  pathway: Pathway;
  matchPercentage: number;
  confidenceInterval: {
    lower: number;
    upper: number;
    confidenceLevel: 'high' | 'medium' | 'low';
  };
  prScore: number;
  detailedScores: {
    hoursScore: number;
    recognitionScore: number;
    licenseScore: number;
    medicalScore: number;
    careerAlignmentScore: number;
    locationScore: number;
  };
  requirementsMet: {
    hoursMet: boolean;
    licenseMet: boolean;
    medicalMet: boolean;
  };
  matchReasons: string[];
}

export class PathwayMatchingEngine {
  private defaultWeights: MatchWeights = {
    hoursWeight: 0.35,
    recognitionWeight: 0.25,
    licenseWeight: 0.20,
    medicalWeight: 0.10,
    careerAlignmentWeight: 0.05,
    locationWeight: 0.05
  };

  private userBehaviorData: Map<string, any> = new Map();

  constructor() {
    this.loadUserBehaviorData();
  }

  /**
   * Load user behavior data from local storage
   */
  private loadUserBehaviorData(): void {
    try {
      const data = localStorage.getItem('pathwayBehaviorTracking');
      if (data) {
        const parsed = JSON.parse(data);
        Object.entries(parsed).forEach(([key, value]) => {
          this.userBehaviorData.set(key, value);
        });
      }
    } catch (error) {
      console.warn('Failed to load user behavior data:', error);
    }
  }

  /**
   * Save user behavior data to local storage
   */
  private saveUserBehaviorData(): void {
    try {
      const data: Record<string, any> = {};
      this.userBehaviorData.forEach((value, key) => {
        data[key] = value;
      });
      localStorage.setItem('pathwayBehaviorTracking', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save user behavior data:', error);
    }
  }

  /**
   * Track user interaction with a pathway
   */
  trackPathwayInteraction(pathway: Pathway, interactionType: 'view' | 'click' | 'like' | 'dislike'): void {
    const pathwayId = pathway.id;
    
    if (!this.userBehaviorData.has(pathwayId)) {
      this.userBehaviorData.set(pathwayId, {
        viewCount: 0,
        clickCount: 0,
        lastViewed: null,
        totalViewTime: 0,
        interactions: []
      });
    }

    const data = this.userBehaviorData.get(pathwayId);
    if (interactionType === 'view') {
      data.viewCount++;
    } else {
      data.clickCount++;
    }
    
    data.lastViewed = new Date().toISOString();
    data.interactions.push({
      type: interactionType,
      timestamp: new Date().toISOString()
    });

    this.userBehaviorData.set(pathwayId, data);
    this.saveUserBehaviorData();
  }

  /**
   * Get personalized weights based on user behavior
   */
  getPersonalizedWeights(): MatchWeights {
    const weights = { ...this.defaultWeights };
    const totalInteractions = Array.from(this.userBehaviorData.values())
      .reduce((sum, data) => sum + (data.clickCount || 0), 0);

    if (totalInteractions > 5) {
      // User has enough interaction data to personalize
      const typePreferences: Record<string, number> = {};
      
      this.userBehaviorData.forEach((data, pathwayId) => {
        // Find pathway type (this would need pathway data lookup)
        // For now, we'll keep default weights
      });

      // Slight adjustment based on engagement
      weights.careerAlignmentWeight = Math.min(0.15, weights.careerAlignmentWeight + 0.05);
      weights.hoursWeight = Math.max(0.25, weights.hoursWeight - 0.05);
    }

    return weights;
  }

  /**
   * Calculate match percentage for a pathway
   */
  calculateMatch(pathway: Pathway, profile: PilotProfile, weights?: MatchWeights): MatchResult {
    const effectiveWeights = weights || this.getPersonalizedWeights();
    
    let totalScore = 0;
    let maxPossibleScore = 0;

    // 1. Hours compatibility (35% weight) - with logarithmic scaling
    const hourReq = pathway.requirements.find((r: string) => r.includes('hrs') || r.includes('hours'));
    if (hourReq) {
      const reqHours = parseInt(hourReq.match(/\d+/)?.[0] || '0');
      maxPossibleScore += effectiveWeights.hoursWeight * 100;

      if (reqHours <= profile.totalFlightHours) {
        totalScore += effectiveWeights.hoursWeight * 100;
      } else if (reqHours <= profile.totalFlightHours * 2) {
        const ratio = profile.totalFlightHours / reqHours;
        totalScore += effectiveWeights.hoursWeight * 100 * (ratio * 0.7 + 0.3);
      } else {
        const ratio = profile.totalFlightHours / reqHours;
        totalScore += effectiveWeights.hoursWeight * 100 * (ratio * 0.3);
      }
    } else {
      maxPossibleScore += effectiveWeights.hoursWeight * 100;
      totalScore += effectiveWeights.hoursWeight * 100;
    }

    // 2. Recognition score compatibility (25% weight) - with tiered matching
    maxPossibleScore += effectiveWeights.recognitionWeight * 100;
    if (profile.overallRecognitionScore >= 450) {
      totalScore += effectiveWeights.recognitionWeight * 100;
    } else if (profile.overallRecognitionScore >= 400) {
      totalScore += effectiveWeights.recognitionWeight * 90;
    } else if (profile.overallRecognitionScore >= 350) {
      totalScore += effectiveWeights.recognitionWeight * 75;
    } else if (profile.overallRecognitionScore >= 300) {
      totalScore += effectiveWeights.recognitionWeight * 60;
    } else if (profile.overallRecognitionScore >= 200) {
      totalScore += effectiveWeights.recognitionWeight * 40;
    } else {
      totalScore += effectiveWeights.recognitionWeight * 20;
    }

    // 3. License compatibility (20% weight) - with partial credit
    const licenseReq = pathway.requirements.find((r: string) => 
      r.toLowerCase().includes('cpl') || r.toLowerCase().includes('commercial')
    );
    maxPossibleScore += effectiveWeights.licenseWeight * 100;
    if (licenseReq) {
      if (profile.licenses.includes('cpl') || profile.licenses.includes('commercial')) {
        totalScore += effectiveWeights.licenseWeight * 100;
      } else if (profile.licenses.includes('ppl')) {
        totalScore += effectiveWeights.licenseWeight * 60;
      } else {
        totalScore += effectiveWeights.licenseWeight * 10;
      }
    } else {
      totalScore += effectiveWeights.licenseWeight * 100;
    }

    // 4. Medical certificate (10% weight) - binary
    maxPossibleScore += effectiveWeights.medicalWeight * 100;
    if (profile.medicalCertificate !== 'None' && profile.medicalCertificate !== null) {
      totalScore += effectiveWeights.medicalWeight * 100;
    } else {
      totalScore += effectiveWeights.medicalWeight * 30;
    }

    // 5. Career alignment (5% weight) - matches user's career goals
    maxPossibleScore += effectiveWeights.careerAlignmentWeight * 100;
    const pathwayType = pathway.type?.toLowerCase() || '';
    if (profile.careerGoals.some(goal => pathwayType.includes(goal.replace('_', ' ')))) {
      totalScore += effectiveWeights.careerAlignmentWeight * 100;
    } else if (pathwayType.includes('cadet') || pathwayType.includes('program')) {
      totalScore += effectiveWeights.careerAlignmentWeight * 80;
    } else {
      totalScore += effectiveWeights.careerAlignmentWeight * 50;
    }

    // 6. Location preference (5% weight) - based on willingness to relocate
    maxPossibleScore += effectiveWeights.locationWeight * 100;
    const pathwayRegion = pathway.subtitle?.toLowerCase() || '';
    if (profile.willingnessToRelocate) {
      totalScore += effectiveWeights.locationWeight * 100;
    } else if (profile.preferredRegions.some(region => pathwayRegion.includes(region))) {
      totalScore += effectiveWeights.locationWeight * 100;
    } else {
      totalScore += effectiveWeights.locationWeight * 40;
    }

    // Calculate final percentage
    const matchPercentage = Math.round((totalScore / maxPossibleScore) * 100);

    // Calculate detailed scores
    const detailedScores = {
      hoursScore: Math.round((totalScore / maxPossibleScore) * 100),
      recognitionScore: Math.round((totalScore / maxPossibleScore) * 100),
      licenseScore: Math.round((totalScore / maxPossibleScore) * 100),
      medicalScore: Math.round((totalScore / maxPossibleScore) * 100),
      careerAlignmentScore: Math.round((totalScore / maxPossibleScore) * 100),
      locationScore: Math.round((totalScore / maxPossibleScore) * 100)
    };

    // Requirements met tracking
    const requirementsMet = {
      hoursMet: hourReq ? parseInt(hourReq.match(/\d+/)?.[0] || '0') <= profile.totalFlightHours : true,
      licenseMet: licenseReq ? (profile.licenses.includes('cpl') || profile.licenses.includes('commercial')) : true,
      medicalMet: profile.medicalCertificate !== 'None' && profile.medicalCertificate !== null
    };

    // Match reasons
    const matchReasons = [
      requirementsMet.hoursMet ? 'Strong flight hours alignment' : 'Flight hours gap present',
      profile.overallRecognitionScore >= 400 ? 'High recognition score' : 'Recognition score improvement needed',
      requirementsMet.licenseMet ? 'License requirements met' : 'License requirements not fully met'
    ];

    // Confidence interval
    const confidenceMargin = Math.round(5 * (1 - matchPercentage / 100));
    const confidenceInterval = {
      lower: Math.max(0, matchPercentage - confidenceMargin),
      upper: Math.min(100, matchPercentage + confidenceMargin),
      confidenceLevel: (matchPercentage >= 80 ? 'high' : matchPercentage >= 60 ? 'medium' : 'low') as 'high' | 'medium' | 'low'
    };

    // PR score (1-10 scale)
    const prScore = Math.max(1, Math.min(10, Math.ceil(matchPercentage / 10)));

    return {
      pathway,
      matchPercentage: Math.max(0, Math.min(100, matchPercentage)),
      confidenceInterval,
      prScore,
      detailedScores,
      requirementsMet,
      matchReasons
    };
  }

  /**
   * Calculate matches for multiple pathways
   */
  calculateMatches(pathways: Pathway[], profile: PilotProfile, weights?: MatchWeights): MatchResult[] {
    return pathways
      .map(pathway => this.calculateMatch(pathway, profile, weights))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  /**
   * Filter pathways by match percentage
   */
  filterByMatchRange(matches: MatchResult[], range: 'all' | 'low' | 'middle' | 'high'): MatchResult[] {
    switch (range) {
      case 'low':
        return matches.filter(m => m.matchPercentage < 50);
      case 'middle':
        return matches.filter(m => m.matchPercentage >= 50 && m.matchPercentage < 80);
      case 'high':
        return matches.filter(m => m.matchPercentage >= 80);
      default:
        return matches;
    }
  }

  /**
   * Clear user behavior data
   */
  clearBehaviorData(): void {
    this.userBehaviorData.clear();
    localStorage.removeItem('pathwayBehaviorTracking');
  }
}

// Export singleton instance
export const matchingEngine = new PathwayMatchingEngine();
