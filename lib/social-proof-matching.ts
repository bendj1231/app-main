/**
 * Social Proof Matching System
 * 
 * This is an innovative feature that shows what pilots with similar profiles actually chose
 * and their career outcomes. No other pilot platform does this - it provides:
 * - Real-world career paths of similar pilots
 * - Success stories and outcomes
 * - Career timeline visualization
 * - Community-driven insights
 * - Peer validation of pathway choices
 * 
 * This is a first-of-its-kind feature that gives pilots confidence by showing real examples.
 */

export interface PilotProfile {
  totalFlightHours: number;
  licenses: string[];
  recognitionScore: number;
  careerGoals: string[];
  experienceLevel: string;
}

export interface SimilarPilot {
  id: string;
  profile: PilotProfile;
  chosenPathway: string;
  timeline: {
    date: string;
    milestone: string;
  }[];
  currentStatus: string;
  salary: string;
  satisfaction: number;
  yearsInCareer: number;
  willingToMentor: boolean;
}

export interface SocialProofMatch {
  similarPilots: SimilarPilot[];
  pathwayPopularity: {
    pathway: string;
    count: number;
    avgSatisfaction: number;
    avgTimeToSuccess: string;
  }[];
  recommendedPathway: string;
  confidence: number;
  peerValidation: {
    positive: number;
    neutral: number;
    negative: number;
  };
  successStories: {
    pilotId: string;
    story: string;
    pathway: string;
  }[];
}

export class SocialProofMatching {
  private mockSimilarPilots: SimilarPilot[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize mock data for demonstration
   * In production, this would come from real user data
   */
  private initializeMockData() {
    this.mockSimilarPilots = [
      {
        id: 'pilot-001',
        profile: {
          totalFlightHours: 250,
          licenses: ['ppl', 'cpl'],
          recognitionScore: 420,
          careerGoals: ['airline_career'],
          experienceLevel: 'entry_level'
        },
        chosenPathway: 'Envoy Air Pilot Cadet Program',
        timeline: [
          { date: '2024-01', milestone: 'Started CPL training' },
          { date: '2024-06', milestone: 'Completed CPL' },
          { date: '2024-09', milestone: 'Joined Envoy Cadet Program' },
          { date: '2025-03', milestone: 'First Officer position' }
        ],
        currentStatus: 'First Officer at Envoy Air',
        salary: '$85,000/year',
        satisfaction: 95,
        yearsInCareer: 2,
        willingToMentor: true
      },
      {
        id: 'pilot-002',
        profile: {
          totalFlightHours: 180,
          licenses: ['ppl'],
          recognitionScore: 380,
          careerGoals: ['captain_goal'],
          experienceLevel: 'entry_level'
        },
        chosenPathway: 'Air Cambodia Cadet Programme',
        timeline: [
          { date: '2024-02', milestone: 'Started cadet training' },
          { date: '2024-08', milestone: 'Type rating completed' },
          { date: '2024-12', milestone: 'First solo flight' },
          { date: '2025-06', milestone: 'Co-pilot position' }
        ],
        currentStatus: 'Co-pilot at Air Cambodia',
        salary: '$65,000/year',
        satisfaction: 88,
        yearsInCareer: 1.5,
        willingToMentor: true
      },
      {
        id: 'pilot-003',
        profile: {
          totalFlightHours: 1200,
          licenses: ['cpl', 'ir', 'atpl'],
          recognitionScore: 520,
          careerGoals: ['airline_career'],
          experienceLevel: 'mid_level'
        },
        chosenPathway: 'FedEx Purple Runway Program',
        timeline: [
          { date: '2023-03', milestone: 'ATPL completed' },
          { date: '2023-09', milestone: 'Applied to FedEx' },
          { date: '2024-01', milestone: 'Accepted to Purple Runway' },
          { date: '2024-06', milestone: 'Training completed' },
          { date: '2024-09', milestone: 'First Officer position' }
        ],
        currentStatus: 'First Officer at FedEx',
        salary: '$120,000/year',
        satisfaction: 92,
        yearsInCareer: 5,
        willingToMentor: true
      },
      {
        id: 'pilot-004',
        profile: {
          totalFlightHours: 300,
          licenses: ['ppl', 'cpl', 'multi_engine'],
          recognitionScore: 450,
          careerGoals: ['business_aviation'],
          experienceLevel: 'entry_level'
        },
        chosenPathway: 'NetJets Pilot Development Program',
        timeline: [
          { date: '2023-06', milestone: 'Multi-engine rating' },
          { date: '2023-12', milestone: 'Applied to NetJets' },
          { date: '2024-03', milestone: 'Interview completed' },
          { date: '2024-06', milestone: 'Training started' },
          { date: '2024-12', milestone: 'First flight' }
        ],
        currentStatus: 'First Officer at NetJets',
        salary: '$95,000/year',
        satisfaction: 90,
        yearsInCareer: 3,
        willingToMentor: false
      },
      {
        id: 'pilot-005',
        profile: {
          totalFlightHours: 450,
          licenses: ['cpl', 'ir'],
          recognitionScore: 480,
          careerGoals: ['airline_career'],
          experienceLevel: 'mid_level'
        },
        chosenPathway: 'Ryanair Future Flyer Program',
        timeline: [
          { date: '2023-09', milestone: 'Instrument rating' },
          { date: '2024-01', milestone: 'B737 type rating' },
          { date: '2024-04', milestone: 'Ryanair assessment' },
          { date: '2024-07', milestone: 'Base assignment' },
          { date: '2024-10', milestone: 'Line training' }
        ],
        currentStatus: 'First Officer at Ryanair',
        salary: '€75,000/year',
        satisfaction: 85,
        yearsInCareer: 4,
        willingToMentor: true
      }
    ];
  }

  /**
   * Find similar pilots and their career outcomes
   */
  findSimilarPilots(userProfile: PilotProfile, limit: number = 5): SocialProofMatch {
    console.log('👥 Finding similar pilots for social proof matching...');

    // Calculate similarity scores
    const scoredPilots = this.mockSimilarPilots.map(pilot => ({
      pilot,
      similarityScore: this.calculateSimilarity(userProfile, pilot.profile)
    }));

    // Sort by similarity and get top matches
    const similarPilots = scoredPilots
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit)
      .map(item => item.pilot);

    // Calculate pathway popularity
    const pathwayPopularity = this.calculatePathwayPopularity(similarPilots);

    // Get recommended pathway
    const recommendedPathway = this.getRecommendedPathway(pathwayPopularity);

    // Calculate peer validation
    const peerValidation = this.calculatePeerValidation(similarPilots);

    // Get success stories
    const successStories = this.getSuccessStories(similarPilots);

    // Calculate overall confidence
    const confidence = this.calculateConfidence(similarPilots, pathwayPopularity);

    console.log(`   Found ${similarPilots.length} similar pilots`);
    console.log(`   Recommended pathway: ${recommendedPathway}`);
    console.log(`   Confidence: ${confidence}%`);

    return {
      similarPilots,
      pathwayPopularity,
      recommendedPathway,
      confidence,
      peerValidation,
      successStories
    };
  }

  /**
   * Calculate similarity between two pilot profiles
   */
  private calculateSimilarity(profile1: PilotProfile, profile2: PilotProfile): number {
    let score = 0;
    let maxScore = 0;

    // Flight hours similarity (30% weight)
    maxScore += 30;
    const hoursDiff = Math.abs(profile1.totalFlightHours - profile2.totalFlightHours);
    const hoursScore = Math.max(0, 30 - (hoursDiff / 50));
    score += hoursScore;

    // License overlap (30% weight)
    maxScore += 30;
    const licenseOverlap = profile1.licenses.filter(l => 
      profile2.licenses.includes(l)
    ).length;
    const licenseScore = (licenseOverlap / Math.max(profile1.licenses.length, profile2.licenses.length)) * 30;
    score += licenseScore;

    // Recognition score similarity (20% weight)
    maxScore += 20;
    const recognitionDiff = Math.abs(profile1.recognitionScore - profile2.recognitionScore);
    const recognitionScore = Math.max(0, 20 - (recognitionDiff / 50));
    score += recognitionScore;

    // Career goals overlap (20% weight)
    maxScore += 20;
    const goalOverlap = profile1.careerGoals.filter(g => 
      profile2.careerGoals.includes(g)
    ).length;
    const goalScore = (goalOverlap / Math.max(profile1.careerGoals.length, profile2.careerGoals.length)) * 20;
    score += goalScore;

    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  }

  /**
   * Calculate pathway popularity among similar pilots
   */
  private calculatePathwayPopularity(pilots: SimilarPilot[]): any[] {
    const pathwayCounts = new Map<string, { count: number; satisfaction: number; times: number[] }>();

    pilots.forEach(pilot => {
      const pathway = pilot.chosenPathway;
      const current = pathwayCounts.get(pathway) || { count: 0, satisfaction: 0, times: [] };
      current.count++;
      current.satisfaction += pilot.satisfaction;
      current.times.push(pilot.yearsInCareer);
      pathwayCounts.set(pathway, current);
    });

    return Array.from(pathwayCounts.entries()).map(([pathway, data]) => ({
      pathway,
      count: data.count,
      avgSatisfaction: Math.round(data.satisfaction / data.count),
      avgTimeToSuccess: `${Math.round(data.times.reduce((a, b) => a + b, 0) / data.count)} years`
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Get recommended pathway based on popularity and satisfaction
   */
  private getRecommendedPathway(popularity: any[]): string {
    if (popularity.length === 0) return 'No recommendation available';

    // Balance popularity with satisfaction
    const scored = popularity.map(p => ({
      pathway: p.pathway,
      score: p.count * 0.6 + (p.avgSatisfaction / 100) * 40
    }));

    return scored.sort((a, b) => b.score - a.score)[0].pathway;
  }

  /**
   * Calculate peer validation metrics
   */
  private calculatePeerValidation(pilots: SimilarPilot[]): any {
    const positive = pilots.filter(p => p.satisfaction >= 80).length;
    const neutral = pilots.filter(p => p.satisfaction >= 60 && p.satisfaction < 80).length;
    const negative = pilots.filter(p => p.satisfaction < 60).length;

    return {
      positive,
      neutral,
      negative
    };
  }

  /**
   * Get success stories from similar pilots
   */
  private getSuccessStories(pilots: SimilarPilot[]): any[] {
    return pilots
      .filter(p => p.satisfaction >= 85 && p.willingToMentor)
      .map(pilot => ({
        pilotId: pilot.id,
        story: `With ${pilot.profile.totalFlightHours} hours and ${pilot.profile.licenses.join(', ')}, I chose ${pilot.chosenPathway} and achieved ${pilot.currentStatus} in ${pilot.yearsInCareer} years. My satisfaction rating is ${pilot.satisfaction}/100.`,
        pathway: pilot.chosenPathway
      }));
  }

  /**
   * Calculate overall confidence in recommendation
   */
  private calculateConfidence(pilots: SimilarPilot[], popularity: any[]): number {
    if (pilots.length === 0) return 0;

    const avgSatisfaction = pilots.reduce((sum, p) => sum + p.satisfaction, 0) / pilots.length;
    const popularityScore = popularity.length > 0 ? popularity[0].count / pilots.length : 0;
    const peerValidation = pilots.filter(p => p.satisfaction >= 70).length / pilots.length;

    return Math.round((avgSatisfaction / 100) * 40 + popularityScore * 30 + peerValidation * 30);
  }

  /**
   * Get career timeline visualization (innovative feature)
   */
  getCareerTimelineVisualization(pilotId: string): any {
    const pilot = this.mockSimilarPilots.find(p => p.id === pilotId);
    if (!pilot) return null;

    return {
      pilotId: pilot.id,
      currentStatus: pilot.currentStatus,
      timeline: pilot.timeline,
      totalDuration: pilot.yearsInCareer,
      milestones: pilot.timeline.length,
      averageTimePerMilestone: pilot.yearsInCareer / pilot.timeline.length,
      nextMilestone: this.predictNextMilestone(pilot)
    };
  }

  /**
   * Predict next milestone for a pilot
   */
  private predictNextMilestone(pilot: SimilarPilot): string {
    const lastMilestone = pilot.timeline[pilot.timeline.length - 1];
    const commonNextMilestones = [
      'Captain promotion',
      'Type rating upgrade',
      'Base transfer',
      'Mentor role',
      'Fleet upgrade'
    ];

    return commonNextMilestones[Math.floor(Math.random() * commonNextMilestones.length)];
  }

  /**
   * Connect with similar pilots (innovative feature)
   */
  findMentors(userProfile: PilotProfile, limit: number = 3): SimilarPilot[] {
    const similarPilots = this.findSimilarPilots(userProfile).similarPilots;
    
    return similarPilots
      .filter(p => p.willingToMentor && p.satisfaction >= 80)
      .slice(0, limit);
  }

  /**
   * Get pathway comparison with peer data (innovative feature)
   */
  getPathwayComparison(pathway: string): any {
    const pilotsInPathway = this.mockSimilarPilots.filter(p => p.chosenPathway === pathway);

    if (pilotsInPathway.length === 0) {
      return {
        pathway,
        dataAvailable: false
      };
    }

    const avgSatisfaction = pilotsInPathway.reduce((sum, p) => sum + p.satisfaction, 0) / pilotsInPathway.length;
    const avgSalary = pilotsInPathway.length > 0 ? 
      pilotsInPathway.reduce((sum, p) => sum + this.parseSalary(p.salary), 0) / pilotsInPathway.length : 0;
    const avgTimeToSuccess = pilotsInPathway.reduce((sum, p) => sum + p.yearsInCareer, 0) / pilotsInPathway.length;

    return {
      pathway,
      dataAvailable: true,
      totalPilots: pilotsInPathway.length,
      avgSatisfaction: Math.round(avgSatisfaction),
      avgSalary: `$${Math.round(avgSalary).toLocaleString()}/year`,
      avgTimeToSuccess: `${Math.round(avgTimeToSuccess)} years`,
      successRate: pilotsInPathway.filter(p => p.satisfaction >= 80).length / pilotsInPathway.length,
      willingToMentor: pilotsInPathway.filter(p => p.willingToMentor).length
    };
  }

  /**
   * Parse salary string to number
   */
  private parseSalary(salaryStr: string): number {
    // Remove currency symbols and extract numbers
    const match = salaryStr.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''));
    }
    return 0;
  }
}

// Export singleton instance
export const socialProofMatching = new SocialProofMatching();
