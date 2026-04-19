/**
 * Pilot Terminal Client
 * Client for interacting with Pilot Terminal API
 */

export interface PilotTerminalMessage {
  id: string;
  from: string;
  to: string;
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

export interface Statistics {
  totalMessages: number;
  totalDataEntries: number;
  expiredEntries: number;
  activeSubscriptions: number;
  agentActivity: Map<string, number>;
}

export interface RetentionReport {
  totalEntries: number;
  expiredEntries: number;
  expiringSoon: number;
  byTopic: Map<string, number>;
  bySource: Map<string, number>;
}

export class PilotTerminalClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:4000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Submit message to Pilot Terminal
   */
  async submitMessage(message: PilotTerminalMessage): Promise<any> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`Failed to submit message: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Query data from Pilot Terminal
   */
  async queryData(query: {
    topic?: string;
    source?: string;
    since?: string;
    limit?: number;
  }): Promise<DataStoreEntry[]> {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      throw new Error(`Failed to query data: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Search data in Pilot Terminal
   */
  async searchData(query: string, limit: number = 10): Promise<DataStoreEntry[]> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, limit })
    });

    if (!response.ok) {
      throw new Error(`Failed to search data: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get timeline from Pilot Terminal
   */
  async getTimeline(limit: number = 50): Promise<PilotTerminalMessage[]> {
    const response = await fetch(`${this.baseUrl}/timeline?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to get timeline: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get statistics from Pilot Terminal
   */
  async getStatistics(): Promise<Statistics> {
    const response = await fetch(`${this.baseUrl}/stats`);

    if (!response.ok) {
      throw new Error(`Failed to get statistics: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get retention report from Pilot Terminal
   */
  async getRetentionReport(): Promise<RetentionReport> {
    const response = await fetch(`${this.baseUrl}/retention`);

    if (!response.ok) {
      throw new Error(`Failed to get retention report: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get agent activity
   */
  async getAgentActivity(agent: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/activity/${agent}`);

    if (!response.ok) {
      throw new Error(`Failed to get agent activity: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get data by topic
   */
  async getDataByTopic(topic: string, limit: number = 10): Promise<DataStoreEntry[]> {
    const response = await fetch(`${this.baseUrl}/data/${topic}?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to get data by topic: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Keep data (extend expiration)
   */
  async keepData(entryId: string, additionalHours: number = 5): Promise<any> {
    const response = await fetch(`${this.baseUrl}/keep/${entryId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ additionalHours })
    });

    if (!response.ok) {
      throw new Error(`Failed to keep data: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Discard data
   */
  async discardData(entryId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/discard/${entryId}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`Failed to discard data: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Cleanup expired data
   */
  async cleanupExpiredData(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/cleanup`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`Failed to cleanup expired data: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Check health
   */
  async healthCheck(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const pilotTerminalClient = new PilotTerminalClient();
