/**
 * Pilot Terminal Network Configuration
 * Configuration for cross-folder communication between main app and Pilot Terminal
 */

export const PILOT_TERMINAL_CONFIG = {
  // API Configuration
  api: {
    baseUrl: process.env.PILOT_TERMINAL_API_URL || 'http://localhost:4000',
    timeout: 10000,
    retries: 3
  },

  // Agent Configuration
  agents: {
    enrollment: {
      account: 'enrollment@pilotterminal.com',
      apiKey: process.env.ENROLLMENT_AGENT_API_KEY || '',
      enabled: true
    },
    pathways: {
      account: 'pathways@pilotterminal.com',
      apiKey: process.env.PATHWAYS_AGENT_API_KEY || '',
      enabled: true
    },
    demand: {
      account: 'demand@pilotterminal.com',
      apiKey: process.env.DEMAND_AGENT_API_KEY || '',
      enabled: true
    },
    matching: {
      account: 'matching@pilotterminal.com',
      apiKey: process.env.MATCHING_AGENT_API_KEY || '',
      enabled: true
    },
    coaching: {
      account: 'coaching@pilotterminal.com',
      apiKey: process.env.COACHING_AGENT_API_KEY || '',
      enabled: true
    },
    social: {
      account: 'social@pilotterminal.com',
      apiKey: process.env.SOCIAL_AGENT_API_KEY || '',
      enabled: true
    },
    retention: {
      account: 'retention@pilotterminal.com',
      apiKey: process.env.RETENTION_AGENT_API_KEY || '',
      enabled: true
    }
  },

  // Communication Configuration
  communication: {
    messageQueueSize: 1000,
    retryDelay: 1000,
    maxRetries: 3,
    timeout: 30000
  },

  // Data Configuration
  data: {
    retentionWindow: 5 * 60 * 60 * 1000, // 5 hours
    cleanupInterval: 60 * 60 * 1000, // 1 hour
    maxDataEntries: 10000
  }
};

/**
 * Pilot Terminal Client for main app integration
 */
export class PilotTerminalClient {
  private config: typeof PILOT_TERMINAL_CONFIG;

  constructor() {
    this.config = PILOT_TERMINAL_CONFIG;
  }

  /**
   * Submit data to Pilot Terminal
   */
  async submitData(topic: string, data: any, metadata?: any): Promise<void> {
    const response = await fetch(`${this.config.api.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'main-app',
        to: 'broadcast',
        timestamp: new Date().toISOString(),
        type: 'data',
        priority: 'medium',
        content: {
          topic,
          data,
          metadata: {
            source: 'main-app',
            confidence: 0.9,
            expiresAt: new Date(Date.now() + this.config.data.retentionWindow).toISOString(),
            ...metadata
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to submit data: ${response.statusText}`);
    }
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
    const response = await fetch(`${this.config.api.baseUrl}/query`, {
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
   * Search Pilot Terminal
   */
  async searchData(query: string, limit: number = 10): Promise<any[]> {
    const response = await fetch(`${this.config.api.baseUrl}/search`, {
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
  async getTimeline(limit: number = 50): Promise<any[]> {
    const response = await fetch(`${this.config.api.baseUrl}/timeline?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to get timeline: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get statistics from Pilot Terminal
   */
  async getStatistics(): Promise<any> {
    const response = await fetch(`${this.config.api.baseUrl}/stats`);

    if (!response.ok) {
      throw new Error(`Failed to get statistics: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get retention report from Pilot Terminal
   */
  async getRetentionReport(): Promise<any> {
    const response = await fetch(`${this.config.api.baseUrl}/retention`);

    if (!response.ok) {
      throw new Error(`Failed to get retention report: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }
}

// Export singleton instance
export const pilotTerminalClient = new PilotTerminalClient();
