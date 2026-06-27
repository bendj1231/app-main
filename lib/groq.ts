/**
 * Groq AI client — calls the ai-coaching Supabase Edge Function.
 * The edge function holds the GROQ_API_KEY server-side; this file never
 * exposes it to the browser.
 */

import { supabase } from './supabase';

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coaching`;

async function getAuthHeader(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');
  return `Bearer ${session.access_token}`;
}

export interface CoachingResult {
  immediateActions: string[];
  shortTermGoals: string[];
  longTermVision: string[];
  skillGaps: string[];
  nextCertification: string;
  confidenceTip: string;
}

export interface QuotaInfo {
  remaining: number;
  limit: number;
  isPremium: boolean;
}

export interface CoachingResponse {
  data: CoachingResult;
  quota: QuotaInfo;
}

export interface ChatResponse {
  message: string;
  quota: QuotaInfo;
}

export class QuotaExceededError extends Error {
  constructor(public isPremium: boolean) {
    super(isPremium
      ? 'Daily AI limit reached. Resets tomorrow.'
      : 'Daily AI limit reached. Upgrade to Recognition+ for more requests.'
    );
  }
}

async function post(body: object): Promise<Response> {
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Authorization': await getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (res.status === 429) {
    const json = await res.json().catch(() => ({}));
    throw new QuotaExceededError(!json.upgrade);
  }
  if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
  return res;
}

/** One-shot career coaching analysis for a pilot profile */
export async function getCareerCoaching(profile: Record<string, unknown>): Promise<CoachingResponse> {
  const res = await post({ type: 'coaching', profile });
  const json = await res.json();
  return { data: json.data as CoachingResult, quota: json.quota };
}

/** Multi-turn chat with the aviation career coach */
export async function chatWithCoach(
  messages: { role: 'user' | 'assistant'; content: string }[],
  profile?: Record<string, unknown>
): Promise<ChatResponse> {
  const res = await post({ type: 'chat', messages, profile });
  const json = await res.json();
  return { message: json.message as string, quota: json.quota };
}

/** Atlas CV improvement suggestions */
export async function getAtlasCVSuggestions(profile: Record<string, unknown>): Promise<string> {
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Authorization': await getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'atlas-cv', profile }),
  });
  if (!res.ok) throw new Error(`Atlas CV suggestion failed: ${res.status}`);
  const json = await res.json();
  return json.message as string;
}
