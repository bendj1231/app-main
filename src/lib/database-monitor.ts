/**
 * Database Query Performance Monitoring
 * 
 * This module provides database query performance monitoring for Supabase:
 * - Query execution time tracking
 * - Slow query detection
 * - Query pattern analysis
 * - Performance recommendations
 */

export interface QueryMetric {
  query: string;
  table: string;
  operation: 'select' | 'insert' | 'update' | 'delete';
  duration: number;
  timestamp: number;
  success: boolean;
  rowCount?: number;
}

export interface QueryPerformanceStats {
  totalQueries: number;
  avgDuration: number;
  slowQueries: number;
  errorRate: number;
  queriesByOperation: Record<string, number>;
  queriesByTable: Record<string, number>;
}

class DatabaseMonitor {
  private metrics: QueryMetric[] = [];
  private slowQueryThreshold: number = 1000; // 1 second

  constructor(threshold: number = 1000) {
    this.slowQueryThreshold = threshold;
  }

  trackQuery(
    query: string,
    table: string,
    operation: 'select' | 'insert' | 'update' | 'delete',
    startTime: number,
    success: boolean,
    rowCount?: number
  ): void {
    const duration = performance.now() - startTime;

    const metric: QueryMetric = {
      query: this.sanitizeQuery(query),
      table,
      operation,
      duration,
      timestamp: startTime,
      success,
      rowCount
    };

    this.metrics.push(metric);

    // Log slow queries
    if (duration > this.slowQueryThreshold) {
      console.warn(`[DatabaseMonitor] Slow query detected: ${operation} on ${table} (${duration.toFixed(0)}ms)`);
      console.warn(`Query: ${query}`);
    }

    // Log failed queries
    if (!success) {
      console.error(`[DatabaseMonitor] Failed query: ${operation} on ${table}`);
    }
  }

  private sanitizeQuery(query: string): string {
    // Remove sensitive data and limit length
    let sanitized = query.replace(/password\s*=\s*'[^']*'/gi, "password='***'");
    sanitized = sanitized.replace(/token\s*=\s*'[^']*'/gi, "token='***'");
    return sanitized.length > 200 ? sanitized.substring(0, 200) + '...' : sanitized;
  }

  getMetrics(): QueryMetric[] {
    return [...this.metrics];
  }

  getStats(): QueryPerformanceStats {
    if (this.metrics.length === 0) {
      return {
        totalQueries: 0,
        avgDuration: 0,
        slowQueries: 0,
        errorRate: 0,
        queriesByOperation: {},
        queriesByTable: {}
      };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const slowQueries = this.metrics.filter(m => m.duration > this.slowQueryThreshold).length;
    const failedQueries = this.metrics.filter(m => !m.success).length;

    const queriesByOperation: Record<string, number> = {};
    const queriesByTable: Record<string, number> = {};

    this.metrics.forEach(metric => {
      queriesByOperation[metric.operation] = (queriesByOperation[metric.operation] || 0) + 1;
      queriesByTable[metric.table] = (queriesByTable[metric.table] || 0) + 1;
    });

    return {
      totalQueries: this.metrics.length,
      avgDuration: totalDuration / this.metrics.length,
      slowQueries,
      errorRate: (failedQueries / this.metrics.length) * 100,
      queriesByOperation,
      queriesByTable
    };
  }

  getSlowQueries(threshold?: number): QueryMetric[] {
    const limit = threshold || this.slowQueryThreshold;
    return this.metrics.filter(m => m.duration > limit);
  }

  getFailedQueries(): QueryMetric[] {
    return this.metrics.filter(m => !m.success);
  }

  getQueriesByTable(table: string): QueryMetric[] {
    return this.metrics.filter(m => m.table === table);
  }

  getAverageQueryDuration(table?: string): number {
    const relevantMetrics = table 
      ? this.metrics.filter(m => m.table === table)
      : this.metrics;

    if (relevantMetrics.length === 0) return 0;

    const total = relevantMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / relevantMetrics.length;
  }

  reset(): void {
    this.metrics = [];
  }

  setSlowQueryThreshold(threshold: number): void {
    this.slowQueryThreshold = threshold;
  }
}

// Default instance
let databaseMonitorInstance: DatabaseMonitor | null = null;

export function initDatabaseMonitor(threshold: number = 1000): DatabaseMonitor {
  if (!databaseMonitorInstance) {
    databaseMonitorInstance = new DatabaseMonitor(threshold);
  }
  return databaseMonitorInstance;
}

export function getDatabaseMonitor(): DatabaseMonitor | null {
  return databaseMonitorInstance;
}

// Helper function to wrap Supabase queries with monitoring
export async function withDatabaseTracking<T>(
  query: string,
  table: string,
  operation: 'select' | 'insert' | 'update' | 'delete',
  dbCall: () => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any }> {
  const monitor = getDatabaseMonitor();
  const startTime = performance.now();

  try {
    const result = await dbCall();
    
    if (monitor) {
      monitor.trackQuery(
        query,
        table,
        operation,
        startTime,
        !result.error,
        Array.isArray(result.data) ? result.data.length : (result.data ? 1 : 0)
      );
    }

    return result;
  } catch (error) {
    if (monitor) {
      monitor.trackQuery(query, table, operation, startTime, false);
    }
    throw error;
  }
}

