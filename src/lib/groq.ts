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

/** One-shot career coaching analysis for a pilot profile */
export async function getCareerCoaching(profile: Record<string, any>): Promise<CoachingResult> {
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Authorization': await getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'coaching', profile }),
  });
  if (!res.ok) throw new Error(`AI coaching failed: ${res.status}`);
  const json = await res.json();
  return json.data as CoachingResult;
}

/** Multi-turn chat with the aviation career coach */
export async function chatWithCoach(
  messages: { role: 'user' | 'assistant'; content: string }[],
  profile?: Record<string, any>
): Promise<string> {
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Authorization': await getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'chat', messages, profile }),
  });
  if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
  const json = await res.json();
  return json.message as string;
}

/** Atlas CV improvement suggestions */
export async function getAtlasCVSuggestions(profile: Record<string, any>): Promise<string> {
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
