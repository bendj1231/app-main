/**
 * Service Router for Multi-Account AI Architecture
 * 
 * Routes requests to appropriate AI service containers based on:
 * - Service type (matching, coaching, prediction, etc.)
 * - Service health
 * - Load balancing strategy
 * - Account capacity
 * 
 * This enables scaling by using multiple free-tier AI accounts.
 */

export interface ServiceConfig {
  name: string;
  container: string;
  account: string;
  endpoint: string;
  priority: number;
  healthCheck: string;
  aiProvider: string;
  apiKey: string;
  capacity: {
    requestsPerMinute: number;
    currentLoad: number;
  };
}

export interface RoutingDecision {
  service: ServiceConfig;
  endpoint: string;
  reason: string;
  fallbackAvailable: boolean;
}

export class ServiceRouter {
  private services: ServiceConfig[];
  private loadBalancer: string = 'health-based'; // 'round-robin', 'health-based', 'least-loaded'

  constructor() {
    this.services = this.initializeServices();
  }

  /**
   * Initialize service configurations
   */
  private initializeServices(): ServiceConfig[] {
    return [
      {
        name: 'matching',
        container: 'container-1',
        account: 'matching@pilotrecognition.com',
        endpoint: process.env.MATCHING_SERVICE_ENDPOINT || 'http://localhost:3001',
        priority: 1,
        healthCheck: '/health',
        aiProvider: 'groq',
        apiKey: process.env.GROQ_API_KEY_1 || '',
        capacity: {
          requestsPerMinute: 100,
          currentLoad: 0
        }
      },
      {
        name: 'coaching',
        container: 'container-2',
        account: 'coaching@pilotrecognition.com',
        endpoint: process.env.COACHING_SERVICE_ENDPOINT || 'http://localhost:3002',
        priority: 2,
        healthCheck: '/health',
        aiProvider: 'openai',
        apiKey: process.env.OPENAI_API_KEY_1 || '',
        capacity: {
          requestsPerMinute: 100,
          currentLoad: 0
        }
      },
      {
        name: 'prediction',
        container: 'container-3',
        account: 'prediction@pilotrecognition.com',
        endpoint: process.env.PREDICTION_SERVICE_ENDPOINT || 'http://localhost:3003',
        priority: 3,
        healthCheck: '/health',
        aiProvider: 'huggingface',
        apiKey: process.env.HF_TOKEN_1 || '',
        capacity: {
          requestsPerMinute: 100,
          currentLoad: 0
        }
      },
      {
        name: 'consensus',
        container: 'container-4',
        account: 'consensus@pilotrecognition.com',
        endpoint: process.env.CONSENSUS_SERVICE_ENDPOINT || 'http://localhost:3004',
        priority: 4,
        healthCheck: '/health',
        aiProvider: 'multi',
        apiKey: '', // Uses multiple keys
        capacity: {
          requestsPerMinute: 100,
          currentLoad: 0
        }
      },
      {
        name: 'social',
        container: 'container-5',
        account: 'social@pilotrecognition.com',
        endpoint: process.env.SOCIAL_SERVICE_ENDPOINT || 'http://localhost:3005',
        priority: 5,
        healthCheck: '/health',
        aiProvider: 'groq',
        apiKey: process.env.GROQ_API_KEY_2 || '',
        capacity: {
          requestsPerMinute: 100,
          currentLoad: 0
        }
      },
      {
        name: 'demand',
        container: 'container-6',
        account: 'demand@pilotrecognition.com',
        endpoint: process.env.DEMAND_SERVICE_ENDPOINT || 'http://localhost:3006',
        priority: 6,
        healthCheck: '/health',
        aiProvider: 'huggingface',
        apiKey: process.env.HF_TOKEN_2 || '',
        capacity: {
          requestsPerMinute: 100,
          currentLoad: 0
        }
      }
    ];
  }

  /**
   * Route request to appropriate service
   */
  async routeRequest(serviceName: string, payload: any): Promise<RoutingDecision> {
    const service = this.getService(serviceName);
    
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    // Check capacity
    if (service.capacity.currentLoad >= service.capacity.requestsPerMinute) {
      console.log(`⚠️  Service ${serviceName} at capacity, using fallback`);
      return this.routeToBackup(serviceName, payload);
    }

    // Check health
    const isHealthy = await this.checkHealth(service);
    
    if (!isHealthy) {
      console.log(`⚠️  Service ${serviceName} unhealthy, using fallback`);
      return this.routeToBackup(serviceName, payload);
    }

    // Update load
    service.capacity.currentLoad++;

    return {
      service,
      endpoint: service.endpoint,
      reason: 'Primary service selected',
      fallbackAvailable: this.hasFallback(serviceName)
    };
  }

  /**
   * Get service configuration
   */
  private getService(serviceName: string): ServiceConfig | undefined {
    return this.services.find(s => s.name === serviceName);
  }

  /**
   * Check service health
   */
  private async checkHealth(service: ServiceConfig): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${service.endpoint}${service.healthCheck}`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error(`Health check failed for ${service.name}:`, error);
      return false;
    }
  }

  /**
   * Route to backup service
   */
  private async routeToBackup(serviceName: string, payload: any): Promise<RoutingDecision> {
    const service = this.getService(serviceName);
    
    // Try local AI as fallback
    const localEndpoint = 'http://localhost:11434/api/generate';
    
    return {
      service: {
        ...service,
        endpoint: localEndpoint,
        account: 'local@localhost',
        aiProvider: 'local'
      },
      endpoint: localEndpoint,
      reason: 'Primary service unavailable, using local AI',
      fallbackAvailable: false
    };
  }

  /**
   * Check if fallback is available
   */
  private hasFallback(serviceName: string): boolean {
    // Check if local AI is available
    return true; // Always have local AI as fallback
  }

  /**
   * Get all service statuses
   */
  async getAllServiceStatuses(): Promise<any[]> {
    const statuses = await Promise.all(
      this.services.map(async (service) => ({
        name: service.name,
        account: service.account,
        container: service.container,
        healthy: await this.checkHealth(service),
        currentLoad: service.capacity.currentLoad,
        capacity: service.capacity.requestsPerMinute,
        aiProvider: service.aiProvider
      }))
    );

    return statuses;
  }

  /**
   * Reset service load (called periodically)
   */
  resetServiceLoads(): void {
    this.services.forEach(service => {
      service.capacity.currentLoad = 0;
    });
  }

  /**
   * Get total capacity
   */
  getTotalCapacity(): number {
    return this.services.reduce((total, service) => 
      total + service.capacity.requestsPerMinute, 0
    );
  }

  /**
   * Get current total load
   */
  getCurrentTotalLoad(): number {
    return this.services.reduce((total, service) => 
      total + service.capacity.currentLoad, 0
    );
  }

  /**
   * Get capacity utilization percentage
   */
  getCapacityUtilization(): number {
    const totalCapacity = this.getTotalCapacity();
    const currentLoad = this.getCurrentTotalLoad();
    
    return totalCapacity > 0 ? Math.round((currentLoad / totalCapacity) * 100) : 0;
  }
}

// Export singleton instance
export const serviceRouter = new ServiceRouter();

// Reset loads every minute
setInterval(() => {
  serviceRouter.resetServiceLoads();
}, 60000);
