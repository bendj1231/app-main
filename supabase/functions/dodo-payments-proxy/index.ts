/// <reference lib="deno.ns" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const dodoApiKey = Deno.env.get('DODO_PAYMENTS_API_KEY')

import { getCorsHeaders } from '../_shared/cors.ts';

const DODO_BASE = 'https://live.dodopayments.com'

interface DodoStats {
  totalRevenue: number
  totalPayments: number
  activeSubscriptions: number
  failedPayments: number
  revenueThisMonth: number
  revenueLastMonth: number
  mrr: number
  customers: number
  products: number
}

async function fetchDodoStats(): Promise<Partial<DodoStats>> {
  if (!dodoApiKey) return {}

  const headers = {
    'Authorization': `Bearer ${dodoApiKey}`,
    'Content-Type': 'application/json',
  }

  try {
    // Fetch all payments (paginated, grab first page)
    const paymentsRes = await fetch(`${DODO_BASE}/payments?page_size=100`, { headers })
    const payments = paymentsRes.ok ? await paymentsRes.json() : { items: [] }

    // Fetch subscriptions
    const subsRes = await fetch(`${DODO_BASE}/subscriptions?page_size=100&status=active`, { headers })
    const subs = subsRes.ok ? await subsRes.json() : { items: [] }

    // Fetch products
    const productsRes = await fetch(`${DODO_BASE}/products?page_size=100`, { headers })
    const products = productsRes.ok ? await productsRes.json() : { items: [] }

    // Fetch customers
    const customersRes = await fetch(`${DODO_BASE}/customers?page_size=100`, { headers })
    const customers = customersRes.ok ? await customersRes.json() : { items: [] }

    const allPayments = payments.items || []
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear

    const totalRevenue = allPayments
      .filter((p: any) => p.status === 'succeeded' || p.status === 'paid')
      .reduce((sum: number, p: any) => sum + (p.total_amount || 0), 0)

    const revenueThisMonth = allPayments
      .filter((p: any) => {
        const d = new Date(p.created_at)
        return (p.status === 'succeeded' || p.status === 'paid') &&
               d.getMonth() === thisMonth && d.getFullYear() === thisYear
      })
      .reduce((sum: number, p: any) => sum + (p.total_amount || 0), 0)

    const revenueLastMonth = allPayments
      .filter((p: any) => {
        const d = new Date(p.created_at)
        return (p.status === 'succeeded' || p.status === 'paid') &&
               d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
      })
      .reduce((sum: number, p: any) => sum + (p.total_amount || 0), 0)

    const activeSubscriptions = (subs.items || []).length
    const mrr = (subs.items || []).reduce((sum: number, s: any) => {
      return sum + (s.recurring_pre_tax_amount || 0)
    }, 0)

    const failedPayments = allPayments.filter((p: any) => p.status === 'failed').length

    return {
      totalRevenue,
      totalPayments: allPayments.length,
      activeSubscriptions,
      failedPayments,
      revenueThisMonth,
      revenueLastMonth,
      mrr,
      customers: (customers.items || []).length,
      products: (products.items || []).length,
    }
  } catch (err) {
    console.error('[dodo-payments-proxy] Dodo API error:', err)
    return {}
  }
}

async function fetchSupabaseFallback(): Promise<Partial<DodoStats>> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('amount, status, created_at')
      .order('created_at', { ascending: false })

    const { data: allSubs } = await supabase
      .from('subscriptions')
      .select('amount, status')
      .eq('status', 'active')

    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear

    const all = subs || []
    const active = allSubs || []

    const totalRevenue = all
      .filter((s: any) => s.status === 'active' || s.status === 'completed')
      .reduce((sum: number, s: any) => sum + (s.amount || 0), 0)

    const revenueThisMonth = all
      .filter((s: any) => {
        const d = new Date(s.created_at)
        return (s.status === 'active' || s.status === 'completed') &&
               d.getMonth() === thisMonth && d.getFullYear() === thisYear
      })
      .reduce((sum: number, s: any) => sum + (s.amount || 0), 0)

    const revenueLastMonth = all
      .filter((s: any) => {
        const d = new Date(s.created_at)
        return (s.status === 'active' || s.status === 'completed') &&
               d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
      })
      .reduce((sum: number, s: any) => sum + (s.amount || 0), 0)

    const mrr = active.reduce((sum: number, s: any) => sum + (s.amount || 0), 0)

    return {
      totalRevenue,
      totalPayments: all.length,
      activeSubscriptions: active.length,
      failedPayments: all.filter((s: any) => s.status === 'failed').length,
      revenueThisMonth,
      revenueLastMonth,
      mrr,
    }
  } catch (err) {
    console.error('[dodo-payments-proxy] Supabase fallback error:', err)
    return {}
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // Try Dodo API first, fall back to Supabase subscriptions table
    let stats = await fetchDodoStats()

    // Merge with fallback for any missing fields
    if (!stats.totalRevenue && !stats.activeSubscriptions) {
      const fallback = await fetchSupabaseFallback()
      stats = { ...fallback, ...stats }
    } else {
      const fallback = await fetchSupabaseFallback()
      stats = { ...fallback, ...stats }
    }

    return new Response(JSON.stringify({
      ...stats,
      source: dodoApiKey ? 'dodo_api' : 'supabase_fallback',
      cached: false,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
