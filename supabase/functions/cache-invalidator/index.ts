// Cache Invalidation and Warming Service
// Manages multi-tier cache lifecycle for API Gateway

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Cache warming targets - frequently accessed endpoints
const WARM_TARGETS = [
  { path: '/api/v1/airlines', ttl: 3600 },
  { path: '/api/v1/programs', ttl: 600 }
]

interface InvalidationRequest {
  pattern?: string
  keys?: string[]
  tags?: string[]
  warm?: boolean
}

class CacheManager {
  private supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Invalidate cache by pattern
  async invalidateByPattern(pattern: string): Promise<{ invalidated: number }> {
    // Call cache invalidation on API Gateway via database
    const { data, error } = await this.supabase
      .from('cache_invalidation_log')
      .insert({
        pattern,
        invalidated_at: new Date().toISOString(),
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error(JSON.stringify({ level: 'error', message: 'Invalidation failed', error: error.message }))
      return { invalidated: 0 }
    }

    console.log(JSON.stringify({ level: 'info', message: 'Invalidation queued', pattern, id: data.id }))
    return { invalidated: 1 }
  }

  // Warm cache for specified endpoints
  async warmCache(): Promise<{ warmed: number; errors: number }> {
    let warmed = 0
    let errors = 0

    for (const target of WARM_TARGETS) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/api-gateway${target.path}`, {
          method: 'GET',
          headers: {
            'X-Cache-Warm': 'true',
            'Authorization': `Bearer ${supabaseServiceKey}`
          }
        })

        if (response.ok) {
          warmed++
          console.log(JSON.stringify({ 
            level: 'info', 
            message: 'Cache warmed', 
            path: target.path,
            status: response.status
          }))
        } else {
          errors++
          console.warn(JSON.stringify({ 
            level: 'warn', 
            message: 'Cache warm failed', 
            path: target.path,
            status: response.status
          }))
        }
      } catch (err) {
        errors++
        console.error(JSON.stringify({ 
          level: 'error', 
          message: 'Cache warm error', 
          path: target.path,
          error: err instanceof Error ? err.message : String(err)
        }))
      }
    }

    return { warmed, errors }
  }

  // Get cache statistics
  async getStats(): Promise<{
    invalidations: number
    lastWarmed: string | null
    warmTargets: number
  }> {
    const { count } = await this.supabase
      .from('cache_invalidation_log')
      .select('*', { count: 'exact', head: true })

    const { data: lastEntry } = await this.supabase
      .from('cache_invalidation_log')
      .select('invalidated_at')
      .order('invalidated_at', { ascending: false })
      .limit(1)
      .single()

    return {
      invalidations: count || 0,
      lastWarmed: lastEntry?.invalidated_at || null,
      warmTargets: WARM_TARGETS.length
    }
  }
}

const cacheManager = new CacheManager()

serve(async (req) => {
  const requestId = crypto.randomUUID()
  
  try {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Cache invalidation request',
      requestId,
      method: req.method
    }))

    // Verify authorization
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const method = req.method

    // GET - Cache statistics
    if (method === 'GET') {
      const stats = await cacheManager.getStats()
      return new Response(JSON.stringify({
        success: true,
        stats,
        targets: WARM_TARGETS
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // POST - Invalidate or warm cache
    if (method === 'POST') {
      const body: InvalidationRequest = await req.json()

      // Handle cache warming
      if (body.warm) {
        const result = await cacheManager.warmCache()
        return new Response(JSON.stringify({
          success: true,
          operation: 'warm',
          result
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Handle invalidation by pattern
      if (body.pattern) {
        const result = await cacheManager.invalidateByPattern(body.pattern)
        return new Response(JSON.stringify({
          success: true,
          operation: 'invalidate',
          pattern: body.pattern,
          result
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({
        error: 'Invalid request. Provide pattern or warm=true'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'Cache manager error',
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
