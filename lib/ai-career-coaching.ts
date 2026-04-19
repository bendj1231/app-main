/**
 * AI-Powered Career Coaching System
 * 
 * This is an innovative feature that provides personalized career coaching using AI.
 * No other pilot platform does this - it offers:
 * - Personalized career advice based on profile
 * - Skill gap analysis
 * - Certification roadmap
 * - Interview preparation
 * - Salary negotiation guidance
 * - Career pivot recommendations
 * 
 * This is a first-of-its-kind feature that gives pilots access to AI career coaching.
 */

export interface PilotProfile {
  totalFlightHours: number;
  licenses: string[];
  recognitionScore: number;
  careerGoals: string[];
  experienceLevel: string;
  currentRole?: string;
  targetPathway?: string;
}

export interface CareerCoachingSession {
  sessionId: string;
  pilotId: string;
  profile: PilotProfile;
  advice: {
    immediateActions: string[];
    shortTermGoals: string[];
    longTermVision: string[];
  };
  skillGapAnalysis: {
    missingSkills: string[];
    priorityOrder: string[];
    estimatedTimeToAcquire: string[];
  };
  certificationRoadmap: {
    certifications: {
      name: string;
      priority: number;
      estimatedCost: string;
      estimatedTime: string;
      prerequisites: string[];
    }[];
  };
  interviewPreparation: {
    commonQuestions: string[];
    recommendedAnswers: string[];
    tips: string[];
  };
  salaryGuidance: {
    currentMarketRate: string;
    negotiationTips: string[];
    targetSalary: string;
  };
  confidenceScore: number;
  generatedAt: string;
}

export class AICareerCoaching {
  private consensusSystem: any;

  constructor(consensusSystem: any) {
    this.consensusSystem = consensusSystem;
  }

  /**
   * Generate comprehensive career coaching session
   */
  async generateCoachingSession(
    pilotId: string,
    profile: PilotProfile
  ): Promise<CareerCoachingSession> {
    console.log('🎓 Generating AI career coaching session...');

    const sessionId = crypto.randomUUID();

    // Get AI consensus for career advice
    const advice = await this.getCareerAdvice(profile);
    
    // Analyze skill gaps
    const skillGapAnalysis = this.analyzeSkillGaps(profile);
    
    // Generate certification roadmap
    const certificationRoadmap = this.generateCertificationRoadmap(profile);
    
    // Prepare interview guidance
    const interviewPreparation = this.generateInterviewPreparation(profile);
    
    // Provide salary guidance
    const salaryGuidance = this.generateSalaryGuidance(profile);

    const session: CareerCoachingSession = {
      sessionId,
      pilotId,
      profile,
      advice,
      skillGapAnalysis,
      certificationRoadmap,
      interviewPreparation,
      salaryGuidance,
      confidenceScore: this.calculateConfidence(profile),
      generatedAt: new Date().toISOString()
    };

    console.log(`   Generated coaching session ${sessionId}`);
    console.log(`   Confidence: ${session.confidenceScore}%`);

    return session;
  }

  /**
   * Get AI-powered career advice
   */
  private async getCareerAdvice(profile: PilotProfile): Promise<any> {
    const prompt = `
As an expert aviation career coach, analyze this pilot profile and provide specific career advice:

Pilot Profile:
- Total Flight Hours: ${profile.totalFlightHours}
- Licenses: ${profile.licenses.join(', ')}
- Recognition Score: ${profile.recognitionScore}
- Career Goals: ${profile.licenses.join(', ')}
- Experience Level: ${profile.experienceLevel}
- Target Pathway: ${profile.targetPathway || 'Not specified'}

Provide advice in JSON format with:
1. immediateActions: 3-5 actions to take this month
2. shortTermGoals: 3-5 goals for the next 6 months
3. longTermVision: 3-5 goals for the next 2-5 years

Be specific, actionable, and realistic.
`;

    try {
      const consensus = await this.consensusSystem.getConsensusRecommendation(prompt, { profile });
      return this.parseAdvice(consensus.consensusRecommendations);
    } catch {
      return this.generateDefaultAdvice(profile);
    }
  }

  /**
   * Parse AI advice into structured format
   */
  private parseAdvice(recommendations: string[]): any {
    return {
      immediateActions: recommendations.slice(0, 3),
      shortTermGoals: recommendations.slice(3, 6),
      longTermVision: recommendations.slice(6, 9)
    };
  }

  /**
   * Generate default advice if AI fails
   */
  private generateDefaultAdvice(profile: PilotProfile): any {
    return {
      immediateActions: [
        'Update your ATLAS resume with latest flight hours',
        'Join aviation forums and networking groups',
        'Research target airlines/companies'
      ],
      shortTermGoals: [
        'Complete next certification within 6 months',
        'Build flight hours through diverse experience',
        'Connect with mentors in target field'
      ],
      longTermVision: [
        'Achieve Captain position within 5 years',
        'Build expertise in specific aircraft type',
        'Develop leadership and management skills'
      ]
    };
  }

  /**
   * Analyze skill gaps
   */
  private analyzeSkillGaps(profile: PilotProfile): any {
    const requiredSkills = this.getRequiredSkills(profile);
    const currentSkills = profile.licenses;
    
    const missingSkills = requiredSkills.filter(skill => 
      !currentSkills.some(current => 
        current.toLowerCase().includes(skill.toLowerCase())
      )
    );

    return {
      missingSkills,
      priorityOrder: this.prioritizeSkills(missingSkills, profile),
      estimatedTimeToAcquire: missingSkills.map(skill => 
        this.estimateTimeToAcquire(skill)
      )
    };
  }

  /**
   * Get required skills based on profile
   */
  private getRequiredSkills(profile: PilotProfile): string[] {
    const skills = ['ppl', 'cpl', 'ir', 'multi_engine', 'atpl'];
    
    if (profile.careerGoals.includes('airline_career')) {
      skills.push('type_rating', 'jet_experience');
    }
    
    if (profile.careerGoals.includes('business_aviation')) {
      skills.push('vip_service', 'international_experience');
    }
    
    if (profile.careerGoals.includes('cargo')) {
      skills.push('night_flying', 'heavy_aircraft');
    }

    return skills;
  }

  /**
   * Prioritize skills based on profile and career goals
   */
  private prioritizeSkills(skills: string[], profile: PilotProfile): string[] {
    return skills.sort((a, b) => {
      const priorityA = this.getSkillPriority(a, profile);
      const priorityB = this.getSkillPriority(b, profile);
      return priorityB - priorityA;
    });
  }

  /**
   * Get skill priority
   */
  private getSkillPriority(skill: string, profile: PilotProfile): number {
    if (skill === 'cpl' && !profile.licenses.includes('cpl')) return 100;
    if (skill === 'ir' && !profile.licenses.includes('ir')) return 90;
    if (skill === 'atpl' && profile.totalFlightHours > 1000) return 85;
    return 50;
  }

  /**
   * Estimate time to acquire skill
   */
  private estimateTimeToAcquire(skill: string): string {
    const times: Record<string, string> = {
      ppl: '3-6 months',
      cpl: '6-12 months',
      ir: '2-4 months',
      multi_engine: '1-2 months',
      atpl: '12-24 months',
      type_rating: '2-6 months',
      jet_experience: '6-12 months',
      vip_service: '1-3 months',
      international_experience: '12-24 months',
      night_flying: '3-6 months',
      heavy_aircraft: '6-12 months'
    };

    return times[skill] || '6-12 months';
  }

  /**
   * Generate certification roadmap
   */
  private generateCertificationRoadmap(profile: PilotProfile): any {
    const certifications = this.getCertificationSequence(profile);

    return {
      certifications: certifications.map(cert => ({
        name: cert.name,
        priority: cert.priority,
        estimatedCost: cert.cost,
        estimatedTime: cert.time,
        prerequisites: cert.prerequisites
      }))
    };
  }

  /**
   * Get certification sequence based on profile
   */
  private getCertificationSequence(profile: PilotProfile): any[] {
    const sequence: any[] = [];

    if (!profile.licenses.includes('ppl')) {
      sequence.push({
        name: 'Private Pilot License (PPL)',
        priority: 1,
        cost: '$8,000 - $15,000',
        time: '3-6 months',
        prerequisites: ['Medical certificate', 'English proficiency']
      });
    }

    if (!profile.licenses.includes('cpl')) {
      sequence.push({
        name: 'Commercial Pilot License (CPL)',
        priority: 2,
        cost: '$15,000 - $25,000',
        time: '6-12 months',
        prerequisites: ['PPL', '250 flight hours']
      });
    }

    if (!profile.licenses.includes('ir')) {
      sequence.push({
        name: 'Instrument Rating (IR)',
        priority: 3,
        cost: '$5,000 - $10,000',
        time: '2-4 months',
        prerequisites: ['PPL', '50 cross-country hours']
      });
    }

    if (!profile.licenses.includes('multi_engine')) {
      sequence.push({
        name: 'Multi-Engine Rating',
        priority: 4,
        cost: '$3,000 - $8,000',
        time: '1-2 months',
        prerequisites: ['PPL']
      });
    }

    if (profile.totalFlightHours > 1000 && !profile.licenses.includes('atpl')) {
      sequence.push({
        name: 'Airline Transport Pilot License (ATPL)',
        priority: 5,
        cost: '$10,000 - $20,000',
        time: '12-24 months',
        prerequisites: ['CPL', 'IR', '1500 flight hours']
      });
    }

    if (profile.careerGoals.includes('airline_career')) {
      sequence.push({
        name: 'Type Rating (B737/A320)',
        priority: 6,
        cost: '$15,000 - $30,000',
        time: '2-6 months',
        prerequisites: ['CPL', 'IR']
      });
    }

    return sequence;
  }

  /**
   * Generate interview preparation
   */
  private generateInterviewPreparation(profile: PilotProfile): any {
    const questions = this.getCommonInterviewQuestions(profile);
    
    return {
      commonQuestions: questions,
      recommendedAnswers: questions.map(q => this.generateAnswer(q, profile)),
      tips: [
        'Research the company thoroughly',
        'Prepare specific examples of your experience',
        'Practice situational judgement questions',
        'Be honest about your experience level',
        'Show enthusiasm and professionalism',
        'Ask thoughtful questions about the role'
      ]
    };
  }

  /**
   * Get common interview questions
   */
  private getCommonInterviewQuestions(profile: PilotProfile): string[] {
    return [
      'Tell me about yourself and your aviation background',
      'Why do you want to work for our company?',
      'Describe a challenging situation you faced in flight and how you handled it',
      'How do you handle pressure and stress?',
      'What are your strengths and weaknesses as a pilot?',
      'Where do you see yourself in 5 years?',
      'How do you stay current with aviation regulations and best practices?',
      'Describe a time you had to make a quick decision under pressure',
      'How do you work with other crew members?',
      'What would you do if you disagreed with a captain\'s decision?'
    ];
  }

  /**
   * Generate recommended answer
   */
  private generateAnswer(question: string, profile: PilotProfile): string {
    // Simple template-based answers
    if (question.includes('background')) {
      return `I have ${profile.totalFlightHours} flight hours with certifications in ${profile.licenses.join(', ')}. My goal is to ${profile.careerGoals.join(' and ')}.`;
    }
    
    if (question.includes('5 years')) {
      return `I aim to advance to a Captain position while continuing to develop my skills and take on leadership responsibilities.`;
    }
    
    return 'Focus on providing specific examples from your experience, demonstrating professionalism, safety consciousness, and teamwork.';
  }

  /**
   * Generate salary guidance
   */
  private generateSalaryGuidance(profile: PilotProfile): any {
    const marketRate = this.calculateMarketRate(profile);
    const targetSalary = this.calculateTargetSalary(profile);

    return {
      currentMarketRate: marketRate,
      negotiationTips: [
        'Research industry standards for your experience level',
        'Highlight your unique skills and certifications',
        'Be prepared to discuss your value proposition',
        'Consider total compensation package, not just base salary',
        'Practice your negotiation approach',
        'Be professional but firm in your expectations'
      ],
      targetSalary: targetSalary
    };
  }

  /**
   * Calculate market rate
   */
  private calculateMarketRate(profile: PilotProfile): string {
    const base = 50000;
    const hoursBonus = profile.totalFlightHours * 10;
    const licenseBonus = profile.licenses.length * 5000;
    const recognitionBonus = profile.recognitionScore * 50;
    
    const marketRate = base + hoursBonus + licenseBonus + recognitionBonus;
    
    return `$${Math.round(marketRate).toLocaleString()} - $${Math.round(marketRate * 1.3).toLocaleString()}/year`;
  }

  /**
   * Calculate target salary
   */
  private calculateTargetSalary(profile: PilotProfile): string {
    const marketRate = this.parseSalaryNumber(this.calculateMarketRate(profile));
    const target = marketRate * 1.2;
    
    return `$${Math.round(target).toLocaleString()}/year`;
  }

  /**
   * Parse salary number
   */
  private parseSalaryNumber(salaryStr: string): number {
    const match = salaryStr.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''));
    }
    return 50000;
  }

  /**
   * Calculate confidence in coaching advice
   */
  private calculateConfidence(profile: PilotProfile): number {
    let confidence = 70;

    if (profile.totalFlightHours > 500) confidence += 10;
    if (profile.licenses.length >= 3) confidence += 10;
    if (profile.recognitionScore > 400) confidence += 10;

    return Math.min(100, confidence);
  }

  /**
   * Provide career pivot recommendations (innovative feature)
   */
  async recommendCareerPivots(profile: PilotProfile): Promise<any> {
    const prompt = `
As an expert aviation career coach, analyze this pilot's profile and recommend career pivot opportunities:

Pilot Profile:
- Total Flight Hours: ${profile.totalFlightHours}
- Licenses: ${profile.licenses.join(', ')}
- Recognition Score: ${profile.recognitionScore}
- Career Goals: ${profile.careerGoals.join(', ')}
- Current Role: ${profile.currentRole || 'Not specified'}

Recommend 3-5 potential career pivots that leverage their current skills but offer new opportunities.
Consider: aviation management, training, consulting, technology, or related fields.
Provide recommendations as a JSON array with title, description, and required skills.
`;

    try {
      const consensus = await this.consensusSystem.getConsensusRecommendation(prompt, { profile });
      return {
        pivots: consensus.consensusRecommendations,
        confidence: consensus.confidence,
        reasoning: consensus.reasoning
      };
    } catch {
      return this.generateDefaultPivots(profile);
    }
  }

  /**
   * Generate default career pivots
   */
  private generateDefaultPivots(profile: PilotProfile): any {
    return {
      pivots: [
        'Aviation Management - Leverage operational experience for leadership roles',
        'Flight Instructor - Share knowledge while building hours',
        'Aviation Consulting - Provide expertise to organizations',
        'Aviation Technology - Combine flying with tech skills',
        'Safety Management - Focus on operational safety and compliance'
      ],
      confidence: 60,
      reasoning: 'Default recommendations based on common aviation career transitions'
    };
  }

  /**
   * Generate personalized learning plan (innovative feature)
   */
  generateLearningPlan(profile: PilotProfile, timeframe: string): any {
    const skills = this.analyzeSkillGaps(profile);
    
    return {
      timeframe,
      learningObjectives: skills.missingSkills.map((skill, index) => ({
        skill,
        week: Math.ceil((index + 1) * (parseInt(timeframe) / skills.missingSkills.length)),
        resources: this.getLearningResources(skill),
        milestones: this.getMilestones(skill)
      })),
      totalSkills: skills.missingSkills.length,
      estimatedCompletion: timeframe
    };
  }

  /**
   * Get learning resources for skill
   */
  private getLearningResources(skill: string): string[] {
    const resources: Record<string, string[]> = {
      ppl: ['Ground school', 'Flight simulator', 'Textbook study', 'Practice tests'],
      cpl: ['Advanced flight training', 'Cross-country experience', 'Night flying', 'Commercial maneuvers'],
      ir: ['Instrument ground school', 'Simulator training', 'Actual instrument flight', 'IFR procedures'],
      multi_engine: ['Multi-engine flight training', 'Systems knowledge', 'Emergency procedures', 'Performance calculations'],
      atpl: ['ATPL ground school', 'Airline procedures', 'Advanced meteorology', 'Flight planning']
    };

    return resources[skill] || ['Study materials', 'Practical training', 'Mentorship'];
  }

  /**
   * Get milestones for skill
   */
  private getMilestones(skill: string): string[] {
    return [
      'Complete ground school',
      'Pass written exam',
      'Complete flight training',
      'Pass practical exam',
      'Receive certification'
    ];
  }
}

// Export singleton instance
export const aiCareerCoaching = new AICareerCoaching(null);
