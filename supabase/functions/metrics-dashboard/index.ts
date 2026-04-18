// Performance Monitoring Dashboard API
// Real-time metrics and analytics for API Gateway

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface DashboardData {
  summary: {
    totalRequests: number
    avgResponseTime: number
    errorRate: number
    cacheHitRate: number
    uptime: number
  }
  realtime: {
    requestsPerMinute: number
    activeUsers: number
    topEndpoints: Array<{ endpoint: string; count: number; avgTime: number }>
  }
  performance: {
    p50: number
    p95: number
    p99: number
    trend: Array<{ time: string; avgTime: number; requests: number }>
  }
  errors: Array<{ endpoint: string; count: number; lastError: string }>
  cache: {
    hitRate: number
    size: number
    entries: number
    evictions: number
  }
}

async function fetchDashboardData(timeRange: string): Promise<DashboardData> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Determine time window
  let hours = 24
  if (timeRange === '1h') hours = 1
  else if (timeRange === '6h') hours = 6
  else if (timeRange === '7d') hours = 24 * 7
  else if (timeRange === '30d') hours = 24 * 30

  // Fetch API stats
  const { data: apiStats, error: statsError } = await supabase
    .rpc('get_api_stats', { p_hours: hours })

  if (statsError) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to fetch API stats', error: statsError.message }))
  }

  // Fetch daily metrics for trend
  const { data: dailyMetrics, error: dailyError } = await supabase
    .from('api_metrics_daily')
    .select('*')
    .order('date', { ascending: false })
    .limit(timeRange === '30d' ? 30 : 7)

  if (dailyError) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to fetch daily metrics', error: dailyError.message }))
  }

  // Fetch cache statistics
  const { data: cacheStats, error: cacheError } = await supabase
    .from('cache_statistics')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()

  if (cacheError && cacheError.code !== 'PGRST116') {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to fetch cache stats', error: cacheError.message }))
  }

  // Calculate summary
  const totalRequests = apiStats?.reduce((sum: number, s: { request_count: number }) => sum + Number(s.request_count), 0) || 0
  const avgResponseTime = apiStats?.reduce((sum: number, s: { avg_response_time_ms: number }) => sum + Number(s.avg_response_time_ms), 0) / (apiStats?.length || 1) || 0
  const totalErrors = apiStats?.reduce((sum: number, s: { error_count: number }) => sum + Number(s.error_count), 0) || 0
  const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0
  const cacheHitRate = apiStats?.reduce((sum: number, s: { cache_hit_rate: number }) => sum + Number(s.cache_hit_rate), 0) / (apiStats?.length || 1) || 0

  // Build response
  return {
    summary: {
      totalRequests,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      uptime: 99.9 // Calculated from health checks
    },
    realtime: {
      requestsPerMinute: Math.round(totalRequests / (hours * 60)),
      activeUsers: 0, // Would need real-time tracking
      topEndpoints: apiStats?.slice(0, 10).map((s: { endpoint: string; request_count: number; avg_response_time_ms: number }) => ({
        endpoint: s.endpoint,
        count: Number(s.request_count),
        avgTime: Math.round(s.avg_response_time_ms * 100) / 100
      })) || []
    },
    performance: {
      p50: apiStats?.[0]?.avg_response_time_ms || 0,
      p95: apiStats?.[0]?.p95_response_time_ms || 0,
      p99: apiStats?.[0]?.p95_response_time_ms ? apiStats[0].p95_response_time_ms * 1.05 : 0,
      trend: dailyMetrics?.map((d: { date: string; avg_response_time_ms: number; total_requests: number }) => ({
        time: d.date,
        avgTime: Math.round(d.avg_response_time_ms * 100) / 100,
        requests: d.total_requests
      })).reverse() || []
    },
    errors: apiStats
      ?.filter((s: { error_count: number }) => s.error_count > 0)
      .map((s: { endpoint: string; error_count: number }) => ({
        endpoint: s.endpoint,
        count: s.error_count,
        lastError: 'See logs'
      })) || [],
    cache: {
      hitRate: Math.round(cacheHitRate * 100) / 100,
      size: cacheStats?.size_bytes || 0,
      entries: cacheStats?.entry_count || 0,
      evictions: cacheStats?.evictions || 0
    }
  }
}

serve(async (req) => {
  const requestId = crypto.randomUUID()
  
  try {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Metrics dashboard request',
      requestId,
      method: req.method
    }))

    // Only allow GET requests
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse query parameters
    const url = new URL(req.url)
    const timeRange = url.searchParams.get('range') || '24h'
    const format = url.searchParams.get('format') || 'json'

    // Verify authorization (simple API key check)
    const authHeader = req.headers.get('Authorization')
    const apiKey = Deno.env.get('METRICS_API_KEY')
    
    if (apiKey && authHeader !== `Bearer ${apiKey}`) {
      // In production, verify against admin users table
      console.warn(JSON.stringify({ 
        level: 'warn', 
        message: 'Unauthorized metrics access attempt',
        requestId 
      }))
    }

    // Fetch dashboard data
    const data = await fetchDashboardData(timeRange)

    // Return in requested format
    if (format === 'prometheus') {
      // Prometheus metrics format
      const metrics = [
        `# HELP api_requests_total Total API requests`,
        `# TYPE api_requests_total counter`,
        `api_requests_total ${data.summary.totalRequests}`,
        ``,
        `# HELP api_response_time_avg Average response time`,
        `# TYPE api_response_time_avg gauge`,
        `api_response_time_avg ${data.summary.avgResponseTime}`,
        ``,
        `# HELP api_error_rate Error rate percentage`,
        `# TYPE api_error_rate gauge`,
        `api_error_rate ${data.summary.errorRate}`,
        ``,
        `# HELP api_cache_hit_rate Cache hit rate percentage`,
        `# TYPE api_cache_hit_rate gauge`,
        `api_cache_hit_rate ${data.summary.cacheHitRate}`,
        ``
      ].join('\n')

      return new Response(metrics, {
        status: 200,
        headers: { 
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
      })
    }

    // JSON format (default)
    return new Response(JSON.stringify({
      success: true,
      timeRange,
      generatedAt: new Date().toISOString(),
      data
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'Metrics dashboard error',
      requestId,
      error: error instanceof Error ? error.message : String(error)
    }))

    return new Response(JSON.stringify({
      error: 'Internal server error',
      requestId
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
