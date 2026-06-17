/**
 * Database Router — distributes load across multiple data stores
 * 
 * Auth (JWT, sessions)    → Supabase (lightweight only)
 * Profiles, Pathways       → Neon PostgreSQL (primary data)
 * Telemetry, Logs        → MongoDB (unstructured)
 * Cache, Sessions         → Oracle VM Redis (future) or in-memory (now)
 */

import { supabase } from './supabase';

// Database connection config
const DB_CONFIG = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  neon: {
    url: import.meta.env.NEON_DATABASE_URL,
  },
  mongodb: {
    uri: import.meta.env.MONGODB_URI,
  }
};

// Cache layer (in-memory for now, Redis on Oracle VM later)
const memoryCache = new Map<string, { value: unknown; expiry: number }>();
const CACHE_TTL_MS = 60_000; // 60 seconds

function getCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value as T;
}

function setCache(key: string, value: unknown, ttlMs = CACHE_TTL_MS): void {
  memoryCache.set(key, { value, expiry: Date.now() + ttlMs });
}

// ─── Profile Operations (moved from Supabase to Neon) ───

export interface ProfileData {
  id: string;
  auth0_id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  total_flight_hours?: number;
  account_tier?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch profile by auth0_id — routes to Neon, not Supabase
 * Falls back to Supabase during migration period
 */
export async function getProfileByAuth0Id(auth0Id: string): Promise<ProfileData | null> {
  const cacheKey = `profile:auth0:${auth0Id}`;
  const cached = getCache<ProfileData>(cacheKey);
  if (cached) return cached;

  // Phase 1: Try Neon first (primary data store)
  try {
    const profile = await fetchNeonProfile(auth0Id);
    if (profile) {
      setCache(cacheKey, profile);
      return profile;
    }
  } catch (err) {
    console.warn('[DB Router] Neon profile fetch failed, falling back to Supabase:', err);
  }

  // Fallback: Supabase (migration compatibility)
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, auth0_id, display_name, email, avatar_url, total_flight_hours, account_tier, created_at')
      .eq('auth0_id', auth0Id)
      .maybeSingle();
    
    if (error) throw error;
    if (data) {
      setCache(cacheKey, data);
      return data as ProfileData;
    }
  } catch (err) {
    console.error('[DB Router] Supabase fallback also failed:', err);
  }

  return null;
}

/**
 * Create or update profile — writes to Neon (primary), mirrors to Supabase (migration)
 */
export async function upsertProfile(profile: Partial<ProfileData>): Promise<ProfileData | null> {
  // Phase 1: Write to Neon
  try {
    const neonProfile = await upsertNeonProfile(profile);
    if (neonProfile) {
      // Invalidate cache
      memoryCache.delete(`profile:auth0:${profile.auth0_id}`);
      
      // Background: mirror to Supabase for compatibility
      mirrorToSupabase(profile).catch(() => {});
      
      return neonProfile;
    }
  } catch (err) {
    console.warn('[DB Router] Neon write failed, using Supabase:', err);
  }

  // Fallback: write directly to Supabase
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'auth0_id' })
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as ProfileData | null;
}

// ─── Neon API Layer (HTTP REST for now, direct PG later) ───

async function fetchNeonProfile(auth0Id: string): Promise<ProfileData | null> {
  // Phase 1: Use Supabase Edge Function as proxy to Neon
  // Phase 2: Direct Neon connection via pg or postgREST
  
  const { data, error } = await supabase.functions.invoke('neon-profile-get', {
    body: { auth0_id: auth0Id }
  });
  
  if (error) throw error;
  return data?.profile || null;
}

async function upsertNeonProfile(profile: Partial<ProfileData>): Promise<ProfileData | null> {
  const { data, error } = await supabase.functions.invoke('neon-profile-upsert', {
    body: { profile }
  });
  
  if (error) throw error;
  return data?.profile || null;
}

// Background mirror to Supabase for migration compatibility
async function mirrorToSupabase(profile: Partial<ProfileData>): Promise<void> {
  try {
    await supabase.from('profiles').upsert(profile, { onConflict: 'auth0_id' });
  } catch {
    // Silent fail — Neon is primary
  }
}

// ─── Auth Operations (Supabase ONLY — lightweight) ───

export async function getAuthSession() {
  // This is the ONLY Supabase DB operation we keep
  return supabase.auth.getSession();
}

export async function signOut() {
  return supabase.auth.signOut();
}

// ─── Health Check ───

export async function checkDatabaseHealth(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {
    supabase: false,
    neon: false,
    mongodb: false,
  };

  // Check Supabase (auth only)
  try {
    const { error } = await supabase.auth.getSession();
    results.supabase = !error;
  } catch {
    results.supabase = false;
  }

  // Check Neon
  try {
    const { error } = await supabase.functions.invoke('neon-health-check', {});
    results.neon = !error;
  } catch {
    results.neon = false;
  }

  return results;
}
