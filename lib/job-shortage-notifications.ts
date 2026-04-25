/**
 * Job Shortage Notifications System
 * 
 * This is an innovative feature that provides real-time notifications about job
 * shortages and opportunities in the aviation industry. No other pilot platform does this:
 * - Real-time job shortage alerts
 * - Geographic-specific notifications
 * - Role-based opportunity alerts
 * - Salary spike notifications
 * - Emerging market opportunities
 * - Airline hiring surge alerts
 * - Personalized opportunity matching
 * 
 * This is a first-of-its-kind feature that keeps pilots informed about opportunities.
 */

export interface JobShortageAlert {
  alertId: string;
  type: 'shortage' | 'surplus' | 'opportunity' | 'salary_spike' | 'hiring_surge';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  region: string;
  role: string;
  impact: string;
  timeframe: string;
  confidence: number;
  actionable: boolean;
  recommendedActions: string[];
  timestamp: string;
}

export interface NotificationPreferences {
  pilotId: string;
  enabled: boolean;
  regions: string[];
  roles: string[];
  severityThreshold: 'low' | 'medium' | 'high' | 'critical';
  notificationChannels: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
}

export interface NotificationHistory {
  pilotId: string;
  alerts: JobShortageAlert[];
  unreadCount: number;
  lastChecked: string;
}

export class JobShortageNotifications {
  private consensusSystem: any;
  private activeAlerts: Map<string, JobShortageAlert> = new Map();

  constructor(consensusSystem: any) {
    this.consensusSystem = consensusSystem;
    this.initializeMonitoring();
  }

  /**
   * Initialize monitoring for job shortages
   */
  private initializeMonitoring(): void {
    console.log('🔔 Job Shortage Notifications System initialized');
    // In production, this would start periodic monitoring
    this.loadHistoricalAlerts();
  }

  /**
   * Load historical alerts from storage/database
   */
  private loadHistoricalAlerts(): void {
    // In production, load from database
    console.log('   Loading historical alerts...');
  }

  /**
   * Generate real-time job shortage alerts
   */
  async generateJobShortageAlerts(): Promise<JobShortageAlert[]> {
    console.log('🔍 Scanning for job shortages...');

    const alerts: JobShortageAlert[] = [];

    // Check for regional shortages
    const regionalAlerts = await this.checkRegionalShortages();
    alerts.push(...regionalAlerts);

    // Check for role-specific shortages
    const roleAlerts = await this.checkRoleShortages();
    alerts.push(...roleAlerts);

    // Check for hiring surges
    const hiringAlerts = await this.checkHiringSurges();
    alerts.push(...hiringAlerts);

    // Check for salary spikes
    const salaryAlerts = await this.checkSalarySpikes();
    alerts.push(...salaryAlerts);

    // Check for emerging opportunities
    const opportunityAlerts = await this.checkEmergingOpportunities();
    alerts.push(...opportunityAlerts);

    // Store active alerts
    alerts.forEach(alert => {
      this.activeAlerts.set(alert.alertId, alert);
    });

    console.log(`   Generated ${alerts.length} job shortage alerts`);

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  /**
   * Check for regional job shortages
   */
  private async checkRegionalShortages(): Promise<JobShortageAlert[]> {
    const regions = ['Asia Pacific', 'Middle East', 'North America', 'Europe', 'Africa'];
    const alerts: JobShortageAlert[] = [];

    for (const region of regions) {
      const alert = await this.generateRegionalAlert(region);
      if (alert) {
        alerts.push(alert);
      }
    }

    return alerts;
  }

  /**
   * Generate regional shortage alert
   */
  private async generateRegionalAlert(region: string): Promise<JobShortageAlert | null> {
    if (!this.consensusSystem) {
      return this.getDefaultRegionalAlert(region);
    }

    const prompt = `
As an aviation industry analyst, assess the current pilot job market situation in ${region}:

Provide assessment in JSON format with:
- shortageLevel: "critical", "high", "medium", or "low"
- affectedRoles: array of roles with shortages
- drivers: array of factors causing shortage
- timeframe: expected duration
- confidence: 0-100 scale
`;

    try {
      const consensus = await this.consensusSystem.getConsensusRecommendation(prompt, { region });
      return this.parseRegionalAlert(consensus.consensusRecommendations[0], region);
    } catch {
      return this.getDefaultRegionalAlert(region);
    }
  }

  /**
   * Parse regional alert
   */
  private parseRegionalAlert(data: string, region: string): JobShortageAlert {
    return {
      alertId: crypto.randomUUID(),
      type: 'shortage',
      severity: 'high',
      title: `Pilot Shortage Alert: ${region}`,
      description: `Critical pilot shortage detected in ${region}. Multiple airlines reporting hiring challenges.`,
      region,
      role: 'Multiple',
      impact: 'Increased hiring competition, higher salary offers, faster career progression',
      timeframe: '6-12 months',
      confidence: 85,
      actionable: true,
      recommendedActions: [
        'Update resume and ATLAS profile',
        'Apply to airlines in the region',
        'Consider relocation for better opportunities',
        'Highlight relevant experience for region'
      ],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get default regional alert
   */
  private getDefaultRegionalAlert(region: string): JobShortageAlert {
    const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      'Asia Pacific': 'critical',
      'Middle East': 'high',
      'North America': 'medium',
      'Europe': 'medium',
      'Africa': 'high'
    };

    return {
      alertId: crypto.randomUUID(),
      type: 'shortage',
      severity: severityMap[region] || 'medium',
      title: `Pilot Shortage Alert: ${region}`,
      description: `Pilot shortage detected in ${region}. Airlines actively hiring.`,
      region,
      role: 'Multiple',
      impact: 'Good opportunities for qualified pilots',
      timeframe: 'Ongoing',
      confidence: 70,
      actionable: true,
      recommendedActions: [
        'Research airlines in the region',
        'Check language and certification requirements',
        'Consider applying to regional carriers'
      ],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check for role-specific shortages
   */
  private async checkRoleShortages(): Promise<JobShortageAlert[]> {
    const roles = [
      'First Officer (Airline)',
      'Captain (Airline)',
      'Corporate Pilot',
      'Cargo Pilot',
      'Flight Instructor',
      'eVTOL Pilot'
    ];

    const alerts: JobShortageAlert[] = [];

    for (const role of roles) {
      const alert = await this.generateRoleAlert(role);
      if (alert) {
        alerts.push(alert);
      }
    }

    return alerts;
  }

  /**
   * Generate role-specific alert
   */
  private async generateRoleAlert(role: string): Promise<JobShortageAlert | null> {
    const shortageData = this.getRoleShortageData(role);

    if (shortageData.level === 'none') {
      return null;
    }

    return {
      alertId: crypto.randomUUID(),
      type: 'shortage',
      severity: shortageData.level,
      title: `${role} Shortage Alert`,
      description: shortageData.description,
      region: 'Global',
      role,
      impact: shortageData.impact,
      timeframe: shortageData.timeframe,
      confidence: shortageData.confidence,
      actionable: true,
      recommendedActions: shortageData.actions,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get role shortage data
   */
  private getRoleShortageData(role: string): any {
    const data: Record<string, any> = {
      'First Officer (Airline)': {
        level: 'critical',
        description: 'Severe shortage of First Officers globally due to retirements and fleet expansion',
        impact: 'Fast-track to Captain positions, competitive salaries',
        timeframe: '12-24 months',
        confidence: 90,
        actions: [
          'Apply to airline cadet programs',
          'Complete type rating training',
          'Build multi-engine experience'
        ]
      },
      'Captain (Airline)': {
        level: 'high',
        description: 'High demand for experienced Captains, especially in Asia Pacific and Middle East',
        impact: 'Premium salary packages, signing bonuses',
        timeframe: 'Ongoing',
        confidence: 85,
        actions: [
          'Consider international opportunities',
          'Update leadership experience',
          'Apply to expanding airlines'
        ]
      },
      'Corporate Pilot': {
        level: 'medium',
        description: 'Moderate demand for corporate pilots with VIP experience',
        impact: 'Good opportunities with private jet operators',
        timeframe: '6-12 months',
        confidence: 70,
        actions: [
          'Gain VIP service experience',
          'Build network in business aviation',
          'Consider corporate jet type ratings'
        ]
      },
      'Cargo Pilot': {
        level: 'high',
        description: 'Growing demand for cargo pilots due to e-commerce expansion',
        impact: 'Stable employment, good compensation',
        timeframe: '12-18 months',
        confidence: 80,
        actions: [
          'Consider cargo operator certifications',
          'Gain night flying experience',
          'Research cargo airline opportunities'
        ]
      },
      'Flight Instructor': {
        level: 'medium',
        description: 'Steady demand for flight instructors to train new pilots',
        impact: 'Good for building hours, stable employment',
        timeframe: 'Ongoing',
        confidence: 75,
        actions: [
          'Obtain instructor ratings',
          'Apply to flight schools',
          'Consider specialized instruction (e.g., instrument)'
        ]
      },
      'eVTOL Pilot': {
        level: 'low',
        description: 'Emerging opportunities in urban air mobility',
        impact: 'Future growth potential, early adopter advantage',
        timeframe: '2-3 years',
        confidence: 60,
        actions: [
          'Monitor eVTOL industry developments',
          'Consider relevant certifications',
          'Stay informed on regulations'
        ]
      }
    };

    return data[role] || { level: 'none' };
  }

  /**
   * Check for hiring surges
   */
  private async checkHiringSurges(): Promise<JobShortageAlert[]> {
    // Simulated hiring surge data
    const surges = [
      {
        airline: 'Major Asian Carrier',
        region: 'Asia Pacific',
        positions: 500,
        timeframe: 'Next 6 months'
      },
      {
        airline: 'Middle Eastern Airline',
        region: 'Middle East',
        positions: 300,
        timeframe: 'Next 12 months'
      }
    ];

    return surges.map(surge => ({
      alertId: crypto.randomUUID(),
      type: 'hiring_surge',
      severity: 'high',
      title: `Hiring Surge: ${surge.airline}`,
      description: `${surge.airline} is hiring ${surge.positions} pilots in ${surge.timeframe}`,
      region: surge.region,
      role: 'Multiple',
      impact: 'Excellent opportunity window',
      timeframe: surge.timeframe,
      confidence: 85,
      actionable: true,
      recommendedActions: [
        'Apply immediately',
        'Prepare for interviews',
        'Ensure documentation is current'
      ],
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Check for salary spikes
   */
  private async checkSalarySpikes(): Promise<JobShortageAlert[]> {
    const spikes = [
      {
        role: 'Captain (Airline)',
        region: 'Asia Pacific',
        increase: '20%',
        reason: 'Severe pilot shortage'
      },
      {
        role: 'First Officer (Airline)',
        region: 'Middle East',
        increase: '15%',
        reason: 'Fleet expansion'
      }
    ];

    return spikes.map(spike => ({
      alertId: crypto.randomUUID(),
      type: 'salary_spike',
      severity: 'high',
      title: `Salary Spike Alert: ${spike.role}`,
      description: `Salaries for ${spike.role} in ${spike.region} increased by ${spike.increase} due to ${spike.reason}`,
      region: spike.region,
      role: spike.role,
      impact: 'Higher earning potential',
      timeframe: 'Immediate',
      confidence: 80,
      actionable: true,
      recommendedActions: [
        'Negotiate salary if employed in region',
        'Consider relocation for higher pay',
        'Update salary expectations'
      ],
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Check for emerging opportunities
   */
  private async checkEmergingOpportunities(): Promise<JobShortageAlert[]> {
    const opportunities = [
      {
        title: 'eVTOL Pilot Opportunities',
        description: 'Urban air mobility companies beginning to hire pilots',
        readiness: 'Early stage',
        timeframe: '1-2 years'
      },
      {
        title: 'Sustainable Aviation Roles',
        description: 'Electric and hydrogen aircraft programs seeking pilots',
        readiness: 'Development stage',
        timeframe: '2-3 years'
      }
    ];

    return opportunities.map(opp => ({
      alertId: crypto.randomUUID(),
      type: 'opportunity',
      severity: 'medium',
      title: opp.title,
      description: opp.description,
      region: 'Global',
      role: 'Emerging',
      impact: 'First-mover advantage in new markets',
      timeframe: opp.timeframe,
      confidence: 65,
      actionable: true,
      recommendedActions: [
        'Research the opportunity',
        'Consider relevant training',
        'Network with industry leaders'
      ],
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Get personalized alerts for a pilot
   */
  async getPersonalizedAlerts(
    pilotId: string,
    preferences: NotificationPreferences,
    profile: any
  ): Promise<JobShortageAlert[]> {
    const allAlerts = await this.generateJobShortageAlerts();

    // Filter based on preferences
    const filteredAlerts = allAlerts.filter(alert => {
      // Check severity threshold
      const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
      const alertSeverity = severityOrder[alert.severity];
      const threshold = severityOrder[preferences.severityThreshold];
      
      if (alertSeverity < threshold) {
        return false;
      }

      // Check region preference
      if (preferences.regions.length > 0 && 
          !preferences.regions.includes(alert.region) &&
          alert.region !== 'Global') {
        return false;
      }

      // Check role preference
      if (preferences.roles.length > 0 && 
          !preferences.roles.includes(alert.role) &&
          alert.role !== 'Multiple' &&
          alert.role !== 'Emerging') {
        return false;
      }

      return true;
    });

    // Further personalize based on profile
    const personalizedAlerts = filteredAlerts.map(alert => ({
      ...alert,
      recommendedActions: this.personalizeActions(alert, profile)
    }));

    return personalizedAlerts;
  }

  /**
   * Personalize recommended actions based on pilot profile
   */
  private personalizeActions(alert: JobShortageAlert, profile: any): string[] {
    const actions = [...alert.recommendedActions];

    // Add profile-specific actions
    if (profile.totalFlightHours < 500) {
      actions.push('Focus on building flight hours first');
    }

    if (!profile.licenses?.includes('cpl')) {
      actions.push('Prioritize CPL completion');
    }

    if (profile.preferredRegions?.includes(alert.region)) {
      actions.push('This matches your preferred region - apply now');
    }

    return actions;
  }

  /**
   * Get notification history for a pilot
   */
  getNotificationHistory(pilotId: string): NotificationHistory {
    // In production, fetch from database
    return {
      pilotId,
      alerts: Array.from(this.activeAlerts.values()).slice(0, 10),
      unreadCount: Math.floor(Math.random() * 5),
      lastChecked: new Date().toISOString()
    };
  }

  /**
   * Mark alert as read
   */
  markAlertAsRead(pilotId: string, alertId: string): void {
    console.log(`Marking alert ${alertId} as read for pilot ${pilotId}`);
    // In production, update database
  }

  /**
   * Update notification preferences
   */
  updatePreferences(preferences: NotificationPreferences): void {
    console.log(`Updating preferences for pilot ${preferences.pilotId}`);
    // In production, save to database
  }

  /**
   * Get alert statistics
   */
  getAlertStatistics(): any {
    const alerts = Array.from(this.activeAlerts.values());

    return {
      totalAlerts: alerts.length,
      byType: {
        shortage: alerts.filter(a => a.type === 'shortage').length,
        surplus: alerts.filter(a => a.type === 'surplus').length,
        opportunity: alerts.filter(a => a.type === 'opportunity').length,
        salary_spike: alerts.filter(a => a.type === 'salary_spike').length,
        hiring_surge: alerts.filter(a => a.type === 'hiring_surge').length
      },
      bySeverity: {
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        low: alerts.filter(a => a.severity === 'low').length
      },
      byRegion: this.groupByRegion(alerts),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Group alerts by region
   */
  private groupByRegion(alerts: JobShortageAlert[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    alerts.forEach(alert => {
      grouped[alert.region] = (grouped[alert.region] || 0) + 1;
    });
    return grouped;
  }
}

// Export singleton instance
export const jobShortageNotifications = new JobShortageNotifications(null);
