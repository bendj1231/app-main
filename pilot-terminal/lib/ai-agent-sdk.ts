/**
 * AI Agent SDK
 * 
 * SDK for AI agents to communicate with Pilot Terminal Network.
 * Each agent has minimal knowledge and only communicates through
 * the Pilot Terminal backend.
 */

import { pilotTerminal, PilotTerminalMessage } from './pilot-terminal-network';

export interface AgentConfig {
  account: string;
  apiKey: string;
  aiProvider: string;
  task: string;
  knowledgeBase: string[]; // Minimal, compartmentalized knowledge
}

export class AIAgent {
  private config: AgentConfig;
  private agentId: string;

  constructor(config: AgentConfig) {
    this.config = config;
    this.agentId = crypto.randomUUID();
    console.log(`🤖 Agent initialized: ${config.account}`);
  }

  /**
   * Submit data to Pilot Terminal
   */
  async submitData(topic: string, data: any, metadata?: any): Promise<void> {
    const message: PilotTerminalMessage = {
      id: crypto.randomUUID(),
      from: this.config.account,
      to: 'broadcast',
      timestamp: new Date().toISOString(),
      type: 'data',
      priority: this.determinePriority(topic),
      content: {
        topic,
        data,
        metadata: {
          source: this.config.account,
          confidence: 0.8,
          expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
          ...metadata
        }
      }
    };

    await pilotTerminal.submitMessage(message);
  }

  /**
   * Query Pilot Terminal for data
   */
  async queryData(query: {
    topic?: string;
    source?: string;
    since?: string;
    limit?: number;
  }): Promise<any[]> {
    const results = await pilotTerminal.query(query);
    
    // Log query for token optimization tracking
    console.log(`🔍 ${this.config.account} queried: ${JSON.stringify(query)}`);
    
    return results;
  }

  /**
   * Search Pilot Terminal
   */
  async searchData(query: string, limit: number = 10): Promise<any[]> {
    const results = await pilotTerminal.search(query, limit);
    
    console.log(`🔎 ${this.config.account} searched: "${query}"`);
    
    return results;
  }

  /**
   * Subscribe to topic
   */
  subscribe(topic: string): void {
    pilotTerminal.subscribe(this.config.account, topic);
    console.log(`🔔 ${this.config.account} subscribed to ${topic}`);
  }

  /**
   * Get latest data from specific agent
   */
  async getLatestFromAgent(agent: string, limit: number = 10): Promise<any[]> {
    return await pilotTerminal.getLatestFromAgent(agent, limit);
  }

  /**
   * Determine message priority based on topic
   */
  private determinePriority(topic: string): 'low' | 'medium' | 'high' | 'critical' {
    const criticalTopics = ['emergency', 'alert', 'critical', 'security'];
    const highTopics = ['update', 'change', 'new', 'important'];
    const mediumTopics = ['data', 'info', 'status'];

    if (criticalTopics.some(t => topic.toLowerCase().includes(t))) {
      return 'critical';
    }
    if (highTopics.some(t => topic.toLowerCase().includes(t))) {
      return 'high';
    }
    if (mediumTopics.some(t => topic.toLowerCase().includes(t))) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Get agent info
   */
  getInfo(): any {
    return {
      agentId: this.agentId,
      account: this.config.account,
      task: this.config.task,
      aiProvider: this.config.aiProvider
    };
  }

  /**
   * Get activity summary
   */
  getActivity(): any {
    return pilotTerminal.getAgentActivity(this.config.account);
  }
}

/**
 * Compartmentalized Agent Factory
 * Creates agents with minimal, focused knowledge bases
 */
export class AgentFactory {
  /**
   * Create Enrollment Agent
   */
  static createEnrollmentAgent(apiKey: string): AIAgent {
    return new AIAgent({
      account: 'enroll@PR.com',
      apiKey,
      aiProvider: 'groq',
      task: 'Pull enrollment data from external systems',
      knowledgeBase: [
        'Enrollment system APIs',
        'Student registration data',
        'Course completion tracking',
        'Submission protocol'
      ]
    });
  }

  /**
   * Create Pathways Agent
   */
  static createPathwaysAgent(apiKey: string): AIAgent {
    return new AIAgent({
      account: 'pathways@PR.com',
      apiKey,
      aiProvider: 'huggingface',
      task: 'Manage pathway data and updates',
      knowledgeBase: [
        'Git repository structure',
        'Pathway data format',
        'Sync protocols',
        'Submission protocol'
      ]
    });
  }

  /**
   * Create Demand Agent
   */
  static createDemandAgent(apiKey: string): AIAgent {
    return new AIAgent({
      account: 'demand@PR.com',
      apiKey,
      aiProvider: 'groq',
      task: 'Monitor industry demand and trends',
      knowledgeBase: [
        'Industry API endpoints',
        'Demand metrics',
        'Market analysis',
        'Submission protocol'
      ]
    });
  }

  /**
   * Create Matching Agent
   */
  static createMatchingAgent(apiKey: string): AIAgent {
    return new AIAgent({
      account: 'matching@PR.com',
      apiKey,
      aiProvider: 'openai',
      task: 'Calculate pathway matches',
      knowledgeBase: [
        'Matching algorithms',
        'Pilot profile format',
        'Match scoring',
        'Submission protocol'
      ]
    });
  }

  /**
   * Create Coaching Agent
   */
  static createCoachingAgent(apiKey: string): AIAgent {
    return new AIAgent({
      account: 'coaching@PR.com',
      apiKey,
      aiProvider: 'openai',
      task: 'Provide career coaching advice',
      knowledgeBase: [
        'Career frameworks',
        'Coaching methodologies',
        'Career data',
        'Submission protocol'
      ]
    });
  }

  /**
   * Create Social Agent
   */
  static createSocialAgent(apiKey: string): AIAgent {
    return new AIAgent({
      account: 'social@PR.com',
      apiKey,
      aiProvider: 'groq',
      task: 'Manage social proof and peer data',
      knowledgeBase: [
        'Social data format',
        'Peer interaction patterns',
        'Mentor matching',
        'Submission protocol'
      ]
    });
  }

  /**
   * Create Retention Manager Agent
   */
  static createRetentionManagerAgent(apiKey: string): AIAgent {
    return new AIAgent({
      account: 'retention@PR.com',
      apiKey,
      aiProvider: 'huggingface',
      task: 'Evaluate data retention',
      knowledgeBase: [
        'Retention policies',
        'Data value assessment',
        'Archival criteria',
        'Submission protocol'
      ]
    });
  }
}
