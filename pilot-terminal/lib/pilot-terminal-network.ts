/**
 * Pilot Terminal Network Backend
 * 
 * A distributed, compartmentalized AI communication system where AI agents
 * communicate through a social media-like backend platform.
 * 
 * Features:
 * - Message bus for agent communication
 * - Data store with time-series indexing
 * - Query engine for natural language queries
 * - Timeline visualization (river-like data flow)
 * - Retention manager (5-hour data lifecycle)
 */

export interface PilotTerminalMessage {
  id: string;
  from: string; // AI agent account
  to: string; // "broadcast" or specific agent
  timestamp: string;
  type: 'data' | 'query' | 'response' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'critical';
  content: {
    topic: string;
    data: any;
    metadata?: {
      source: string;
      confidence: number;
      expiresAt: string;
    };
  };
}

export interface DataStoreEntry {
  id: string;
  topic: string;
  source: string;
  data: any;
  timestamp: string;
  expiresAt: string;
  confidence: number;
  accessCount: number;
  lastAccessed: string;
}

export class PilotTerminalNetwork {
  private messageBus: Map<string, PilotTerminalMessage[]> = new Map();
  private dataStore: Map<string, DataStoreEntry> = new Map();
  private agentSubscriptions: Map<string, Set<string>> = new Map();
  private retentionWindow: number = 5 * 60 * 60 * 1000; // 5 hours

  /**
   * Submit message to Pilot Terminal
   */
  async submitMessage(message: PilotTerminalMessage): Promise<void> {
    console.log(`📨 Message from ${message.from}: ${message.content.topic}`);

    // Store in message bus
    const fromMessages = this.messageBus.get(message.from) || [];
    fromMessages.push(message);
    this.messageBus.set(message.from, fromMessages);

    // Store in data store if type is 'data'
    if (message.type === 'data') {
      await this.storeData(message);
    }

    // Route to subscribers
    await this.routeMessage(message);
  }

  /**
   * Store data in data store
   */
  private async storeData(message: PilotTerminalMessage): Promise<void> {
    const entry: DataStoreEntry = {
      id: crypto.randomUUID(),
      topic: message.content.topic,
      source: message.from,
      data: message.content.data,
      timestamp: message.timestamp,
      expiresAt: message.content.metadata?.expiresAt || 
               new Date(Date.now() + this.retentionWindow).toISOString(),
      confidence: message.content.metadata?.confidence || 0.8,
      accessCount: 0,
      lastAccessed: message.timestamp
    };

    this.dataStore.set(entry.id, entry);
    console.log(`💾 Stored data: ${entry.topic} (expires: ${entry.expiresAt})`);
  }

  /**
   * Route message to subscribers
   */
  private async routeMessage(message: PilotTerminalMessage): Promise<void> {
    const subscribers = this.agentSubscriptions.get(message.content.topic) || new Set();
    
    for (const subscriber of subscribers) {
      if (message.to === 'broadcast' || message.to === subscriber) {
        console.log(`📤 Routing to ${subscriber}`);
        // In production, this would send to the agent's endpoint
      }
    }
  }

  /**
   * Query Pilot Terminal for data
   */
  async query(query: {
    topic?: string;
    source?: string;
    since?: string;
    limit?: number;
  }): Promise<DataStoreEntry[]> {
    const results: DataStoreEntry[] = [];

    for (const [id, entry] of this.dataStore.entries()) {
      // Check if expired
      if (new Date(entry.expiresAt) < new Date()) {
        continue;
      }

      // Filter by topic
      if (query.topic && !entry.topic.includes(query.topic)) {
        continue;
      }

      // Filter by source
      if (query.source && entry.source !== query.source) {
        continue;
      }

      // Filter by time
      if (query.since && new Date(entry.timestamp) < new Date(query.since)) {
        continue;
      }

      // Update access count
      entry.accessCount++;
      entry.lastAccessed = new Date().toISOString();

      results.push(entry);
    }

    // Sort by timestamp (newest first) and limit
    results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return query.limit ? results.slice(0, query.limit) : results;
  }

  /**
   * Subscribe to topic
   */
  subscribe(agent: string, topic: string): void {
    const subscribers = this.agentSubscriptions.get(topic) || new Set();
    subscribers.add(agent);
    this.agentSubscriptions.set(topic, subscribers);
    console.log(`🔔 ${agent} subscribed to ${topic}`);
  }

  /**
   * Get timeline (river view)
   */
  getTimeline(limit: number = 50): PilotTerminalMessage[] {
    const allMessages: PilotTerminalMessage[] = [];

    for (const messages of this.messageBus.values()) {
      allMessages.push(...messages);
    }

    // Sort by timestamp (newest first)
    allMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return allMessages.slice(0, limit);
  }

  /**
   * Get expired data for retention evaluation
   */
  getExpiredData(): DataStoreEntry[] {
    const expired: DataStoreEntry[] = [];
    const now = new Date();

    for (const entry of this.dataStore.values()) {
      if (new Date(entry.expiresAt) < now) {
        expired.push(entry);
      }
    }

    return expired;
  }

  /**
   * Keep data (extend expiration)
   */
  keepData(entryId: string, additionalHours: number = 5): void {
    const entry = this.dataStore.get(entryId);
    if (entry) {
      const newExpiresAt = new Date(Date.now() + additionalHours * 60 * 60 * 1000);
      entry.expiresAt = newExpiresAt.toISOString();
      console.log(`✅ Extended data: ${entry.topic} (expires: ${entry.expiresAt})`);
    }
  }

  /**
   * Discard data
   */
  discardData(entryId: string): void {
    const entry = this.dataStore.get(entryId);
    if (entry) {
      this.dataStore.delete(entryId);
      console.log(`🗑️  Discarded data: ${entry.topic}`);
    }
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalMessages: number;
    totalDataEntries: number;
    expiredEntries: number;
    activeSubscriptions: number;
    agentActivity: Map<string, number>;
  } {
    let totalMessages = 0;
    const agentActivity = new Map<string, number>();

    for (const [agent, messages] of this.messageBus.entries()) {
      totalMessages += messages.length;
      agentActivity.set(agent, messages.length);
    }

    const expiredEntries = this.getExpiredData().length;
    let activeSubscriptions = 0;

    for (const subscribers of this.agentSubscriptions.values()) {
      activeSubscriptions += subscribers.size;
    }

    return {
      totalMessages,
      totalDataEntries: this.dataStore.size,
      expiredEntries,
      activeSubscriptions,
      agentActivity
    };
  }

  /**
   * Get data by topic (for agent queries)
   */
  async getDataByTopic(topic: string, limit: number = 10): Promise<DataStoreEntry[]> {
    return this.query({ topic, limit });
  }

  /**
   * Get latest data from specific agent
   */
  async getLatestFromAgent(agent: string, limit: number = 10): Promise<DataStoreEntry[]> {
    return this.query({ source: agent, limit });
  }

  /**
   * Search data by natural language
   */
  async search(query: string, limit: number = 10): Promise<DataStoreEntry[]> {
    const results: DataStoreEntry[] = [];
    const queryLower = query.toLowerCase();

    for (const entry of this.dataStore.values()) {
      // Check if expired
      if (new Date(entry.expiresAt) < new Date()) {
        continue;
      }

      // Search in topic
      if (entry.topic.toLowerCase().includes(queryLower)) {
        results.push(entry);
        continue;
      }

      // Search in data (if string)
      if (typeof entry.data === 'string' && 
          entry.data.toLowerCase().includes(queryLower)) {
        results.push(entry);
        continue;
      }

      // Search in data (if object)
      if (typeof entry.data === 'object') {
        const dataStr = JSON.stringify(entry.data).toLowerCase();
        if (dataStr.includes(queryLower)) {
          results.push(entry);
        }
      }
    }

    // Sort by confidence and timestamp
    results.sort((a, b) => {
      if (b.confidence !== a.confidence) {
        return b.confidence - a.confidence;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return results.slice(0, limit);
  }

  /**
   * Get agent activity summary
   */
  getAgentActivity(agent: string): {
    messageCount: number;
    dataEntries: number;
    lastActivity: string;
    topics: string[];
  } {
    const messages = this.messageBus.get(agent) || [];
    const dataEntries = Array.from(this.dataStore.values())
      .filter(entry => entry.source === agent);

    const topics = [...new Set(dataEntries.map(entry => entry.topic))];
    const lastActivity = messages.length > 0 ? 
      messages[messages.length - 1].timestamp : 'Never';

    return {
      messageCount: messages.length,
      dataEntries: dataEntries.length,
      lastActivity,
      topics
    };
  }

  /**
   * Cleanup expired data automatically
   */
  async cleanupExpiredData(): Promise<number> {
    const expired = this.getExpiredData();
    let cleaned = 0;

    for (const entry of expired) {
      this.discardData(entry.id);
      cleaned++;
    }

    console.log(`🧹 Cleaned up ${cleaned} expired data entries`);
    return cleaned;
  }

  /**
   * Get data retention report
   */
  getRetentionReport(): {
    totalEntries: number;
    expiredEntries: number;
    expiringSoon: number;
    byTopic: Map<string, number>;
    bySource: Map<string, number>;
  } {
    const now = new Date();
    const soonThreshold = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
    const byTopic = new Map<string, number>();
    const bySource = new Map<string, number>();
    let expiringSoon = 0;

    for (const entry of this.dataStore.values()) {
      // Count by topic
      byTopic.set(entry.topic, (byTopic.get(entry.topic) || 0) + 1);

      // Count by source
      bySource.set(entry.source, (bySource.get(entry.source) || 0) + 1);

      // Check expiring soon
      if (new Date(entry.expiresAt) < soonThreshold && new Date(entry.expiresAt) > now) {
        expiringSoon++;
      }
    }

    return {
      totalEntries: this.dataStore.size,
      expiredEntries: this.getExpiredData().length,
      expiringSoon,
      byTopic,
      bySource
    };
  }
}

// Export singleton instance
export const pilotTerminal = new PilotTerminalNetwork();

// Automatic cleanup every hour
setInterval(() => {
  pilotTerminal.cleanupExpiredData();
}, 60 * 60 * 1000);
