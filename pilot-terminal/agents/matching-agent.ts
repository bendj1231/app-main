/**
 * Matching Agent
 * Account: matching@pilotterminal.com
 * Purpose: Calculate pathway matches
 * Knowledge: Only knows matching algorithms and pilot profiles
 */

import { AIAgent, AgentFactory } from '../lib/ai-agent-sdk';

export class MatchingAgent {
  private agent: AIAgent;

  constructor(apiKey: string) {
    this.agent = AgentFactory.createMatchingAgent(apiKey);
    this.agent.subscribe('pathway_updates');
    this.agent.subscribe('pilot_profiles');
  }

  /**
   * Query for pathway updates
   */
  async getPathwayUpdates(): Promise<any[]> {
    const updates = await this.agent.queryData({ topic: 'pathway_update', limit: 10 });
    return updates;
  }

  /**
   * Calculate matches for pilot profile
   */
  async calculateMatches(pilotProfile: any): Promise<void> {
    const matchData = {
      pilotId: pilotProfile.id,
      matches: [
        { pathwayId: 'pilot-001', matchPercentage: 92 },
        { pathwayId: 'pilot-002', matchPercentage: 87 },
        { pathwayId: 'pilot-003', matchPercentage: 81 }
      ],
      timestamp: new Date().toISOString()
    };

    await this.agent.submitData('match_results', matchData, {
      source: 'matching_algorithm',
      confidence: 0.95
    });
  }

  /**
   * Submit match results to Pilot Terminal
   */
  async submitMatchResults(results: any): Promise<void> {
    await this.agent.submitData('match_results', results, {
      source: 'matching_engine',
      confidence: 0.93
    });
  }

  /**
   * Run matching cycle
   */
  async runMatchingCycle(pilotProfile: any): Promise<void> {
    console.log('🎯 Matching Agent: Running matching cycle...');
    const updates = await this.getPathwayUpdates();
    await this.calculateMatches(pilotProfile);
    console.log('✅ Matching Agent: Cycle complete');
  }
}
