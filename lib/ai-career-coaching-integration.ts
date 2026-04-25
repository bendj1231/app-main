/**
 * AI Career Coaching Integration Service
 * 
 * This service integrates all AI career coaching components with the existing
 * AI services (multi-ai-consensus-system, industry-demand-prediction, etc.).
 * It provides a unified interface for the entire AI career coaching system.
 */

import { consensusSystem } from './multi-ai-consensus-system';
import { industryDemandPrediction } from './industry-demand-prediction';
import { aiCareerCoaching } from './ai-career-coaching';
import { matchingEngine } from './pathway-matching-engine';
import { scoreMaintenanceAdvice } from './score-maintenance-advice';
import { jobShortageNotifications } from './job-shortage-notifications';
import { marketIntelligenceDashboard } from './market-intelligence-dashboard';

export interface AICareerCoachingIntegrationConfig {
  enableConsensusSystem: boolean;
  enableDemandPrediction: boolean;
  enableScoreMaintenance: boolean;
  enableJobNotifications: boolean;
  enableMarketIntelligence: boolean;
}

export class AICareerCoachingIntegration {
  private config: AICareerCoachingIntegrationConfig;

  constructor(config?: Partial<AICareerCoachingIntegrationConfig>) {
    this.config = {
      enableConsensusSystem: true,
      enableDemandPrediction: true,
      enableScoreMaintenance: true,
      enableJobNotifications: true,
      enableMarketIntelligence: true,
      ...config
    };

    this.initializeServices();
  }

  /**
   * Initialize all services with proper dependencies
   */
  private initializeServices(): void {
    console.log('🔧 Initializing AI Career Coaching Integration...');

    // Initialize services with consensus system
    if (this.config.enableConsensusSystem) {
      // Update matching engine with consensus system
      (matchingEngine as any).consensusSystem = consensusSystem;
      
      // Update other services
      (scoreMaintenanceAdvice as any).consensusSystem = consensusSystem;
      (jobShortageNotifications as any).consensusSystem = consensusSystem;
      (marketIntelligenceDashboard as any).consensusSystem = consensusSystem;
      (industryDemandPrediction as any).consensusSystem = consensusSystem;
      (aiCareerCoaching as any).consensusSystem = consensusSystem;

      console.log('   ✓ Consensus system integrated');
    }

    if (this.config.enableDemandPrediction) {
      console.log('   ✓ Demand prediction enabled');
    }

    if (this.config.enableScoreMaintenance) {
      console.log('   ✓ Score maintenance advice enabled');
    }

    if (this.config.enableJobNotifications) {
      console.log('   ✓ Job shortage notifications enabled');
    }

    if (this.config.enableMarketIntelligence) {
      console.log('   ✓ Market intelligence dashboard enabled');
    }

    console.log('✅ AI Career Coaching Integration initialized');
  }

  /**
   * Get comprehensive career coaching session
   */
  async getComprehensiveCoachingSession(pilotId: string, profile: any): Promise<any> {
    console.log('🎓 Generating comprehensive career coaching session...');

    const results: any = {
      pilotId,
      profile,
      timestamp: new Date().toISOString(),
      components: {}
    };

    // 1. Career coaching session
    if (this.config.enableConsensusSystem) {
      results.components.careerCoaching = await aiCareerCoaching.generateCoachingSession(pilotId, profile);
    }

    // 2. Score maintenance advice
    if (this.config.enableScoreMaintenance) {
      const components = this.calculateScoreComponents(profile);
      results.components.scoreAdvice = await scoreMaintenanceAdvice.generateScoreAdvice(
        pilotId,
        profile.overallRecognitionScore || 350,
        450,
        components,
        profile
      );
    }

    // 3. Industry demand prediction
    if (this.config.enableDemandPrediction) {
      results.components.demandPrediction = await industryDemandPrediction.generateDemandPrediction();
    }

    // 4. Market intelligence
    if (this.config.enableMarketIntelligence) {
      results.components.marketIntelligence = await marketIntelligenceDashboard.getPersonalizedIntelligence(profile);
    }

    // 5. Job shortage notifications
    if (this.config.enableJobNotifications) {
      const preferences = this.getDefaultNotificationPreferences(pilotId, profile);
      results.components.jobAlerts = await jobShortageNotifications.getPersonalizedAlerts(
        pilotId,
        preferences,
        profile
      );
    }

    // 6. Pathway recommendations
    if (this.config.enableConsensusSystem) {
      // This would need pathway data from the app
      results.components.pathwayRecommendations = {
        message: 'Pathway recommendations available when pathway data is provided'
      };
    }

    // Generate overall summary
    results.summary = this.generateSummary(results.components);

    return results;
  }

  /**
   * Calculate score components from profile
   */
  private calculateScoreComponents(profile: any): any {
    return {
      flightHours: Math.min(100, (profile.totalFlightHours || 0) / 20),
      licenses: Math.min(100, (profile.licenses?.length || 0) * 15),
      certifications: Math.min(100, (profile.certifications?.length || 0) * 10),
      experience: Math.min(100, profile.totalFlightHours > 1000 ? 80 : profile.totalFlightHours / 15),
      education: Math.min(100, profile.educationLevel === 'degree' ? 80 : 50),
      networking: Math.min(100, profile.networkingScore || 50),
      achievements: Math.min(100, (profile.achievements?.length || 0) * 15)
    };
  }

  /**
   * Get default notification preferences
   */
  private getDefaultNotificationPreferences(pilotId: string, profile: any): any {
    return {
      pilotId,
      enabled: true,
      regions: profile.preferredRegions || ['North America', 'Europe'],
      roles: profile.careerGoals || ['airline_career'],
      severityThreshold: 'medium',
      notificationChannels: {
        email: true,
        push: true,
        sms: false,
        inApp: true
      },
      frequency: 'daily'
    };
  }

  /**
   * Generate overall summary
   */
  private generateSummary(components: any): any {
    const summary: any = {
      overallHealth: 'good',
      keyInsights: [],
      priorityActions: [],
      confidence: 75
    };

    // Analyze career coaching
    if (components.careerCoaching) {
      summary.keyInsights.push(`Career coaching confidence: ${components.careerCoaching.confidenceScore}%`);
      summary.priorityActions.push(...components.careerCoaching.advice.immediateActions.slice(0, 2));
    }

    // Analyze score advice
    if (components.scoreAdvice) {
      summary.keyInsights.push(`Current score: ${components.scoreAdvice.currentScore}, Target: ${components.scoreAdvice.targetScore}`);
      summary.priorityActions.push(...components.scoreAdvice.recommendations.immediate.slice(0, 2));
    }

    // Analyze demand prediction
    if (components.demandPrediction) {
      summary.keyInsights.push(`Market health: ${components.demandPrediction.overallMarketHealth}%`);
    }

    // Analyze market intelligence
    if (components.marketIntelligence) {
      summary.keyInsights.push(`Market fit: ${components.marketIntelligence.marketFit.level}`);
    }

    // Analyze job alerts
    if (components.jobAlerts) {
      summary.keyInsights.push(`${components.jobAlerts.length} relevant job alerts`);
    }

    return summary;
  }

  /**
   * Get AI-powered pathway recommendations
   */
  async getPathwayRecommendations(profile: any, pathways: any[]): Promise<any> {
    if (!this.config.enableConsensusSystem) {
      return matchingEngine.calculateMatches(pathways, profile);
    }

    return matchingEngine.getAIRecommendations(profile, pathways);
  }

  /**
   * Get score tracking data
   */
  getScoreTracking(pilotId: string, timeframe: string = '30d'): any {
    if (!this.config.enableScoreMaintenance) {
      return { error: 'Score maintenance disabled' };
    }

    return scoreMaintenanceAdvice.getScoreTracking(pilotId, timeframe);
  }

  /**
   * Get component-specific advice
   */
  getComponentAdvice(component: string, currentValue: number): any {
    if (!this.config.enableScoreMaintenance) {
      return { error: 'Score maintenance disabled' };
    }

    return scoreMaintenanceAdvice.getComponentAdvice(component, currentValue);
  }

  /**
   * Get job shortage alerts
   */
  async getJobShortageAlerts(pilotId: string, profile: any): Promise<any> {
    if (!this.config.enableJobNotifications) {
      return { error: 'Job notifications disabled' };
    }

    const preferences = this.getDefaultNotificationPreferences(pilotId, profile);
    return jobShortageNotifications.getPersonalizedAlerts(pilotId, preferences, profile);
  }

  /**
   * Get notification history
   */
  getNotificationHistory(pilotId: string): any {
    if (!this.config.enableJobNotifications) {
      return { error: 'Job notifications disabled' };
    }

    return jobShortageNotifications.getNotificationHistory(pilotId);
  }

  /**
   * Get market intelligence dashboard
   */
  async getMarketIntelligence(profile?: any): Promise<any> {
    if (!this.config.enableMarketIntelligence) {
      return { error: 'Market intelligence disabled' };
    }

    if (profile) {
      return marketIntelligenceDashboard.getPersonalizedIntelligence(profile);
    }

    return marketIntelligenceDashboard.generateDashboard();
  }

  /**
   * Get historical market data
   */
  getHistoricalMarketData(timeframe: string = '12m'): any {
    if (!this.config.enableMarketIntelligence) {
      return { error: 'Market intelligence disabled' };
    }

    return marketIntelligenceDashboard.getHistoricalData(timeframe);
  }

  /**
   * Get industry demand prediction
   */
  async getIndustryDemand(): Promise<any> {
    if (!this.config.enableDemandPrediction) {
      return { error: 'Demand prediction disabled' };
    }

    return industryDemandPrediction.generateDemandPrediction();
  }

  /**
   * Get pathway-specific demand
   */
  async getPathwayDemand(pathway: string): Promise<any> {
    if (!this.config.enableDemandPrediction) {
      return { error: 'Demand prediction disabled' };
    }

    return industryDemandPrediction.getPathwayDemand(pathway);
  }

  /**
   * Get career pivot recommendations
   */
  async getCareerPivotRecommendations(profile: any): Promise<any> {
    if (!this.config.enableConsensusSystem) {
      return { error: 'Consensus system disabled' };
    }

    return aiCareerCoaching.recommendCareerPivots(profile);
  }

  /**
   * Get learning plan
   */
  getLearningPlan(profile: any, timeframe: string): any {
    return aiCareerCoaching.generateLearningPlan(profile, timeframe);
  }

  /**
   * Update notification preferences
   */
  updateNotificationPreferences(preferences: any): void {
    if (!this.config.enableJobNotifications) {
      console.warn('Job notifications disabled');
      return;
    }

    jobShortageNotifications.updatePreferences(preferences);
  }

  /**
   * Mark alert as read
   */
  markAlertAsRead(pilotId: string, alertId: string): void {
    if (!this.config.enableJobNotifications) {
      console.warn('Job notifications disabled');
      return;
    }

    jobShortageNotifications.markAlertAsRead(pilotId, alertId);
  }

  /**
   * Get system status
   */
  getSystemStatus(): any {
    return {
      timestamp: new Date().toISOString(),
      config: this.config,
      services: {
        consensusSystem: this.config.enableConsensusSystem ? 'enabled' : 'disabled',
        demandPrediction: this.config.enableDemandPrediction ? 'enabled' : 'disabled',
        scoreMaintenance: this.config.enableScoreMaintenance ? 'enabled' : 'disabled',
        jobNotifications: this.config.enableJobNotifications ? 'enabled' : 'disabled',
        marketIntelligence: this.config.enableMarketIntelligence ? 'enabled' : 'disabled'
      },
      status: 'operational'
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AICareerCoachingIntegrationConfig>): void {
    this.config = { ...this.config, ...config };
    this.initializeServices();
  }
}

// Export singleton instance
export const aiCareerCoachingIntegration = new AICareerCoachingIntegration();
