/**
 * Retention Manager Agent
 * 
 * Evaluates data older than 5 hours and decides whether to keep or discard.
 * This agent has minimal knowledge - only knows retention policies and data value.
 */

import { AIAgent, AgentFactory } from './ai-agent-sdk';
import { pilotTerminal } from './pilot-terminal-network';

export class RetentionManagerAgent {
  private agent: AIAgent;

  constructor(apiKey: string) {
    this.agent = AgentFactory.createRetentionManagerAgent(apiKey);
    console.log('🗄️  Retention Manager Agent initialized');
  }

  /**
   * Run retention evaluation cycle
   */
  async runRetentionCycle(): Promise<{
    evaluated: number;
    kept: number;
    discarded: number;
    archived: number;
  }> {
    console.log('🔄 Running retention evaluation cycle...');

    const expiredData = pilotTerminal.getExpiredData();
    let kept = 0;
    let discarded = 0;
    let archived = 0;

    for (const entry of expiredData) {
      const decision = await this.evaluateDataValue(entry);

      switch (decision) {
        case 'keep':
          pilotTerminal.keepData(entry.id, 5); // Extend by 5 hours
          kept++;
          break;
        case 'discard':
          pilotTerminal.discardData(entry.id);
          discarded++;
          break;
        case 'archive':
          // Archive instead of discard
          await this.archiveData(entry);
          pilotTerminal.discardData(entry.id);
          archived++;
          break;
      }
    }

    console.log(`✅ Retention cycle complete: ${kept} kept, ${discarded} discarded, ${archived} archived`);

    return {
      evaluated: expiredData.length,
      kept,
      discarded,
      archived
    };
  }

  /**
   * Evaluate data value for retention decision
   */
  private async evaluateDataValue(entry: any): Promise<'keep' | 'discard' | 'archive'> {
    // Simple heuristic-based evaluation (in production, this would use AI)

    // Keep if high confidence and frequently accessed
    if (entry.confidence > 0.9 && entry.accessCount > 10) {
      return 'keep';
    }

    // Archive if medium confidence and some access
    if (entry.confidence > 0.7 && entry.accessCount > 5) {
      return 'archive';
    }

    // Discard if low confidence or rarely accessed
    if (entry.confidence < 0.5 || entry.accessCount < 3) {
      return 'discard';
    }

    // Default to discard
    return 'discard';
  }

  /**
   * Archive data (in production, this would store in long-term storage)
   */
  private async archiveData(entry: any): Promise<void> {
    console.log(`📦 Archiving data: ${entry.topic}`);
    // In production, this would move to S3, database archival, etc.
  }

  /**
   * Get retention statistics
   */
  getRetentionStats(): {
    retentionReport: any;
    agentActivity: any;
  } {
    return {
      retentionReport: pilotTerminal.getRetentionReport(),
      agentActivity: this.agent.getActivity()
    };
  }

  /**
   * Start automatic retention cycles
   */
  startAutomaticCycles(intervalMs: number = 60 * 60 * 1000): void {
    console.log(`⏰ Starting automatic retention cycles (every ${intervalMs / 1000 / 60} minutes)`);
    
    setInterval(async () => {
      await this.runRetentionCycle();
    }, intervalMs);
  }
}

// Export singleton instance
export const retentionManager = new RetentionManagerAgent(process.env.RETENTION_API_KEY || '');
