/**
 * D1 API Client — Replaces Supabase direct queries
 *
 * This module provides typed functions that call the Cloudflare Worker API
 * instead of Supabase. Auth0 still handles login; this handles data.
 *
 * IMPORTANT: Every function requires an accessToken parameter.
 * Use Auth0's getAccessTokenSilently() to get it.
 *
 * Usage:
 *   import { useAuth0 } from '@auth0/auth0-react';
 *   import { getProfile } from '@/lib/d1-api';
 *
 *   const { getAccessTokenSilently } = useAuth0();
 *   const token = await getAccessTokenSilently();
 *   const profile = await getProfile(token, auth0Id);
 *
 * Environment:
 *   VITE_WORKER_API_URL=https://pilotrecognition-api.your-subdomain.workers.dev
 */

// ── Config ─────────────────────────────────────────────────────

const WORKER_URL = import.meta.env.VITE_WORKER_API_URL || '';

async function fetchAPI(
  accessToken: string,
  path: string,
  options: RequestInit = {}
): Promise<unknown> {
  if (!accessToken) throw new Error('Not authenticated');

  const url = `${WORKER_URL}${path}`;
  let lastErr: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          ...(options.headers || {}),
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (data as any)?.error || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      return data;
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
      if (attempt < 1) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }
  }
  throw lastErr;
}

// ── Generic Action Router ──────────────────────────────────────

export async function api(
  accessToken: string,
  action: string,
  params?: unknown
): Promise<unknown> {
  return fetchAPI(accessToken, '/api', {
    method: 'POST',
    body: JSON.stringify({ action, params }),
  });
}

export async function apiBatch(
  accessToken: string,
  requests: Array<{ action: string; params?: unknown; cache?: number }>
): Promise<Record<string, unknown>> {
  return fetchAPI(accessToken, '/api', {
    method: 'POST',
    body: JSON.stringify({ action: 'batch', requests }),
  }) as Promise<Record<string, unknown>>;
}

// ── Profiles ───────────────────────────────────────────────────

export interface ProfileInput {
  email?: string;
  name?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  country_code?: string;
  date_of_birth?: string;
  nationality?: string;
  avatar_url?: string;
  profile_image_url?: string;
  current_flight_hours?: number;
  total_flight_hours?: number;
  mentorship_hours?: number;
  foundation_progress?: number;
  overall_recognition_score?: number;
  current_level?: string;
  current_occupation?: string;
  license_id?: string;
  country_of_license?: string;
  ratings?: string[];
  is_enrolled_in_foundational?: boolean;
  subscription_tier?: string;
  subscription_status?: string;
  wallet_id?: string;
  wallet_email?: string;
  wallet_did?: string;
  referral_code?: string;
}

export async function getProfile(accessToken: string, auth0Id: string) {
  return api(accessToken, 'getProfile', { auth0_id: auth0Id });
}

export async function getProfileById(accessToken: string, userId: string) {
  return api(accessToken, 'getProfile', { id: userId });
}

export async function getMe(accessToken: string) {
  return api(accessToken, 'getProfile', { me: 1 });
}

export async function createProfile(accessToken: string, data: { email: string; name?: string }) {
  return api(accessToken, 'createProfile', data);
}

export async function updateProfile(accessToken: string, profileId: string, updates: ProfileInput) {
  return api(accessToken, 'updateProfile', { id: profileId, ...updates });
}

// ── Verification Status (what pilots see) ────────────────────

export interface CredentialStatus {
  valid: boolean;
  status: string;
  issued_at?: string;
  expires_at?: string;
}

export interface VerificationStatus {
  license: CredentialStatus;
  medical: CredentialStatus;
  radio_license: CredentialStatus;
  english_proficiency: CredentialStatus;
  flight_hours: CredentialStatus;
}

export async function getVerificationStatus(accessToken: string, userId: string) {
  return api(accessToken, 'getVerificationStatus', { user_id: userId });
}

// ── Recognition Scores ────────────────────────────────────────

export interface RecognitionScoreInput {
  user_id: string;
  total_score?: number;
  hours_score?: number;
  experience_score?: number;
  assessment_score?: number;
  mentorship_score?: number;
  score_tier?: string;
  breakdown?: Record<string, unknown>;
  recommendations?: string[];
}

export async function getRecognitionScore(accessToken: string, userId: string) {
  return api(accessToken, 'getRecognitionScore', { user_id: userId });
}

export async function saveRecognitionScore(accessToken: string, data: RecognitionScoreInput) {
  return api(accessToken, 'saveRecognitionScore', data);
}

// ── Payments ───────────────────────────────────────────────────

export async function getPayments(accessToken: string, userId: string) {
  return api(accessToken, 'getPayments', { user_id: userId });
}

export async function createRecognitionPlusCheckout(accessToken: string) {
  return api(accessToken, 'createCheckout');
}

// ── Pilot Recognition Profile (DID + Verified Credentials) ────

export async function createDid(accessToken: string, data: {
  profile_id: string;
  auth0_id: string;
  did: string;
  did_method?: string;
  public_key_jwk?: Record<string, unknown>;
}) {
  return api(accessToken, 'createDid', data);
}

export async function getDid(accessToken: string, auth0Id: string) {
  return api(accessToken, 'getDid', { auth0_id: auth0Id });
}

export async function createCredential(accessToken: string, data: {
  user_id: string;
  credential_type: string;
  issuer: string;
  credential_data?: Record<string, unknown>;
  walt_id?: string;
  expires_at?: string;
  status?: string;
}) {
  return api(accessToken, 'createCredential', data);
}

export async function getCredentials(accessToken: string, userId: string) {
  return api(accessToken, 'getCredentials', { user_id: userId });
}

// ── Enterprise ─────────────────────────────────────────────────

export async function createEnterpriseProfile(accessToken: string, data: {
  company_name: string;
  industry?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  country?: string;
  employee_count?: number;
}) {
  return api(accessToken, 'createEnterprise', data);
}

export async function getEnterpriseProfiles(accessToken: string) {
  return api(accessToken, 'getEnterprises');
}

export async function getEnterpriseProfile(accessToken: string, id: string) {
  return api(accessToken, 'getEnterprise', { id });
}

// ── Admin ──────────────────────────────────────────────────────

export async function getAllPilots(accessToken: string) {
  return api(accessToken, 'getAllPilots');
}

export async function updateUserTier(accessToken: string, userId: string, tier: string) {
  return api(accessToken, 'updateUserTier', { user_id: userId, tier });
}

// ── GDPR ───────────────────────────────────────────────────────

export async function deleteProfile(accessToken: string, profileId: string) {
  return api(accessToken, 'deleteProfile', { id: profileId });
}

// ── Health ─────────────────────────────────────────────────────

export async function healthCheck() {
  const res = await fetch(`${WORKER_URL}/api/health`);
  return res.json();
}

// ── Compatibility helpers (drop-in replacements for Supabase patterns) ──

// NOTE: getProfileById and getMe are the replacements for:
//   supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
// Use getMe() when you want the current logged-in user's profile.
// Use getProfileById() when you have a specific profile UUID.
