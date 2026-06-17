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
  console.log('[dodo-payments-proxy] fetchDodoStats() called')
  console.log('[dodo-payments-proxy] DODO_PAYMENTS_API_KEY present:', !!dodoApiKey)
  console.log('[dodo-payments-proxy] DODO_PAYMENTS_API_KEY length:', dodoApiKey?.length || 0)

  if (!dodoApiKey) {
    console.warn('[dodo-payments-proxy] No DODO_PAYMENTS_API_KEY set — skipping Dodo API calls')
    return {}
  }

  const headers = {
    'Authorization': `Bearer ${dodoApiKey}`,
    'Content-Type': 'application/json',
  }

  try {
    console.log('[dodo-payments-proxy] Fetching /payments ...')
    const paymentsRes = await fetch(`${DODO_BASE}/payments?page_size=100`, { headers })
    console.log('[dodo-payments-proxy] /payments status:', paymentsRes.status, paymentsRes.statusText)
    const payments = paymentsRes.ok ? await paymentsRes.json() : { items: [] }
    if (!paymentsRes.ok) console.warn('[dodo-payments-proxy] /payments failed body preview:', await paymentsRes.text().catch(() => 'unreadable'))
    console.log('[dodo-payments-proxy] /payments items count:', (payments.items || []).length)

    console.log('[dodo-payments-proxy] Fetching /subscriptions ...')
    const subsRes = await fetch(`${DODO_BASE}/subscriptions?page_size=100&status=active`, { headers })
    console.log('[dodo-payments-proxy] /subscriptions status:', subsRes.status, subsRes.statusText)
    const subs = subsRes.ok ? await subsRes.json() : { items: [] }
    if (!subsRes.ok) console.warn('[dodo-payments-proxy] /subscriptions failed body preview:', await subsRes.text().catch(() => 'unreadable'))
    console.log('[dodo-payments-proxy] /subscriptions items count:', (subs.items || []).length)

    console.log('[dodo-payments-proxy] Fetching /products ...')
    const productsRes = await fetch(`${DODO_BASE}/products?page_size=100`, { headers })
    console.log('[dodo-payments-proxy] /products status:', productsRes.status, productsRes.statusText)
    const products = productsRes.ok ? await productsRes.json() : { items: [] }
    if (!productsRes.ok) console.warn('[dodo-payments-proxy] /products failed body preview:', await productsRes.text().catch(() => 'unreadable'))
    console.log('[dodo-payments-proxy] /products items count:', (products.items || []).length)

    console.log('[dodo-payments-proxy] Fetching /customers ...')
    const customersRes = await fetch(`${DODO_BASE}/customers?page_size=100`, { headers })
    console.log('[dodo-payments-proxy] /customers status:', customersRes.status, customersRes.statusText)
    const customers = customersRes.ok ? await customersRes.json() : { items: [] }
    if (!customersRes.ok) console.warn('[dodo-payments-proxy] /customers failed body preview:', await customersRes.text().catch(() => 'unreadable'))
    console.log('[dodo-payments-proxy] /customers items count:', (customers.items || []).length)

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
  console.log('[dodo-payments-proxy] Request received:', req.method, req.url)
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

    const url = new URL(req.url)
    const detail = url.searchParams.get('detail') === 'true'
    console.log('[dodo-payments-proxy] detail param:', detail)
    console.log('[dodo-payments-proxy] stats so far:', JSON.stringify({ totalRevenue: stats.totalRevenue, totalPayments: stats.totalPayments, activeSubscriptions: stats.activeSubscriptions, mrr: stats.mrr }))

    let responseBody: any = {
      ...stats,
      source: dodoApiKey ? 'dodo_api' : 'supabase_fallback',
      cached: false,
    }

    // If detail requested, fetch and attach raw lists
    if (detail && dodoApiKey) {
      console.log('[dodo-payments-proxy] detail=true — fetching raw lists ...')
      const headers = { 'Authorization': `Bearer ${dodoApiKey}`, 'Content-Type': 'application/json' }
      try {
        const [paymentsRes, subsRes, customersRes, productsRes] = await Promise.all([
          fetch(`${DODO_BASE}/payments?page_size=100`, { headers }),
          fetch(`${DODO_BASE}/subscriptions?page_size=100`, { headers }),
          fetch(`${DODO_BASE}/customers?page_size=100`, { headers }),
          fetch(`${DODO_BASE}/products?page_size=100`, { headers }),
        ])
        console.log('[dodo-payments-proxy] detail fetches — payments:', paymentsRes.status, 'subs:', subsRes.status, 'customers:', customersRes.status, 'products:', productsRes.status)
        const payments = paymentsRes.ok ? await paymentsRes.json() : { items: [] }
        const subscriptions = subsRes.ok ? await subsRes.json() : { items: [] }
        const customers = customersRes.ok ? await customersRes.json() : { items: [] }
        const products = productsRes.ok ? await productsRes.json() : { items: [] }

        responseBody.payments = payments.items || []
        responseBody.subscriptions = subscriptions.items || []
        responseBody.customers = customers.items || []
        responseBody.products = products.items || []
        console.log('[dodo-payments-proxy] detail lists attached — payments:', responseBody.payments.length, 'subs:', responseBody.subscriptions.length, 'customers:', responseBody.customers.length, 'products:', responseBody.products.length)
      } catch (detailErr) {
        console.error('[dodo-payments-proxy] Detail fetch error:', detailErr)
        responseBody.detailError = 'Failed to fetch detailed data'
      }
    }

    console.log('[dodo-payments-proxy] returning responseBody keys:', Object.keys(responseBody))
    return new Response(JSON.stringify(responseBody), {
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
