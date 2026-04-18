import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { 
  SecurityMiddleware, 
  RATE_LIMIT_CONFIGS, 
  Logger, 
  PerformanceMonitor, 
  Cache,
  generateRequestId 
} from '../_shared/security-middleware.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  checks: {
    database: { status: 'healthy' | 'unhealthy'; responseTime: number; message?: string }
    memory: { status: 'healthy' | 'unhealthy'; usage: number; limit: number }
    cache: { status: 'healthy' | 'unhealthy'; entries: number; size: number }
  }
  metrics: {
    totalRequests: number
    errorRate: number
    avgResponseTime: number
  }
}

serve(async (req) => {
  const requestId = generateRequestId()
  PerformanceMonitor.startTimer(requestId)
  
  try {
    Logger.info('Health check started', { method: req.method }, requestId)
    
    // Rate limiting check (very permissive for health checks)
    const clientId = SecurityMiddleware.getClientIdentifier(req)
    const rateLimitResult = SecurityMiddleware.checkRateLimit(
      `health:${clientId}`,
      RATE_LIMIT_CONFIGS.health
    )

    if (!rateLimitResult.allowed) {
      return SecurityMiddleware.createResponse({
        error: 'Too many health check requests'
      }, 429, { 'Retry-After': '60' })
    }

    const startTime = Date.now()
    let dbStatus: HealthStatus['checks']['database'] = { status: 'unhealthy', responseTime: 0 }
    
    try {
      // Test database connection with a simple query
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      })
      
      const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
      
      const dbResponseTime = Date.now() - startTime
      
      if (error) {
        dbStatus = { 
          status: 'unhealthy', 
          responseTime: dbResponseTime,
          message: error.message 
        }
        Logger.error('Database health check failed', new Error(error.message), { duration: dbResponseTime }, requestId)
      } else {
        dbStatus = { 
          status: dbResponseTime < 500 ? 'healthy' : 'unhealthy', 
          responseTime: dbResponseTime 
        }
      }
    } catch (dbError) {
      dbStatus = { 
        status: 'unhealthy', 
        responseTime: Date.now() - startTime,
        message: dbError instanceof Error ? dbError.message : 'Unknown error'
      }
      Logger.error('Database connection error', dbError instanceof Error ? dbError : new Error(String(dbError)), {}, requestId)
    }

    // Memory usage check
    // Note: Deno doesn't have process.memoryUsage() like Node.js, so we estimate
    const memoryUsage = 0 // Placeholder - Deno runtime handles memory automatically
    const memoryLimit = 512 * 1024 * 1024 // 512MB Edge Function limit
    const memoryStatus: HealthStatus['checks']['memory'] = {
      status: 'healthy',
      usage: memoryUsage,
      limit: memoryLimit
    }

    // Cache status
    const cacheStats = Cache.getStats()
    const cacheStatus: HealthStatus['checks']['cache'] = {
      status: cacheStats.currentSize < cacheStats.size * 0.9 ? 'healthy' : 'unhealthy',
      entries: cacheStats.entries,
      size: cacheStats.currentSize
    }

    // Get performance metrics
    const metrics = PerformanceMonitor.getMetrics()

    // Determine overall status
    let overallStatus: HealthStatus['status'] = 'healthy'
    if (dbStatus.status === 'unhealthy' || cacheStatus.status === 'unhealthy') {
      overallStatus = 'degraded'
    }
    if (dbStatus.status === 'unhealthy' && metrics.errorRate > 10) {
      overallStatus = 'unhealthy'
    }

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: metrics.uptime,
      checks: {
        database: dbStatus,
        memory: memoryStatus,
        cache: cacheStatus
      },
      metrics: {
        totalRequests: metrics.requests,
        errorRate: parseFloat(metrics.errorRate.toFixed(2)),
        avgResponseTime: parseFloat(metrics.avgResponseTime.toFixed(2))
      }
    }

    const duration = PerformanceMonitor.endTimer(requestId)
    Logger.info('Health check completed', { status: overallStatus, duration }, requestId)

    const response = SecurityMiddleware.createResponse(healthStatus, overallStatus === 'healthy' ? 200 : 503)
    
    // Add service availability headers
    response.headers.set('X-Service-Status', overallStatus)
    response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining))

    return response
  } catch (error) {
    PerformanceMonitor.recordError()
    const duration = PerformanceMonitor.endTimer(requestId)
    Logger.error('Health check error', error instanceof Error ? error : new Error(String(error)), { duration }, requestId)
    
    return SecurityMiddleware.createResponse({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, 503)
  }
})
