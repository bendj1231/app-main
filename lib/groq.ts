/**
 * Groq AI client — calls the Cloudflare Worker AI coaching endpoint.
 * The Worker holds the GROQ_API_KEY server-side; this file never
 * exposes it to the browser.
 */

const API_URL = (import.meta.env as any).VITE_PILOT_API_URL || 'https://pilotrecognition-api.benjamintigerbowler.workers.dev';
const FUNCTION_URL = `${API_URL}/api/ai-coaching`;

function ensureToken(accessToken: string): string {
  if (!accessToken) throw new Error('Not authenticated');
  return accessToken;
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

async function postWithToken(accessToken: string, body: object): Promise<Response> {
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
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
export async function getCareerCoaching(accessToken: string, profile: Record<string, unknown>): Promise<CoachingResponse> {
  const res = await postWithToken(ensureToken(accessToken), { type: 'coaching', profile });
  const json = await res.json();
  return { data: json.data as CoachingResult, quota: json.quota };
}

/** Multi-turn chat with the aviation career coach */
export async function chatWithCoach(
  accessToken: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  profile?: Record<string, unknown>
): Promise<ChatResponse> {
  const res = await postWithToken(ensureToken(accessToken), { type: 'chat', messages, profile });
  const json = await res.json();
  return { message: json.message as string, quota: json.quota };
}

/** Atlas CV improvement suggestions */
export async function getAtlasCVSuggestions(accessToken: string, profile: Record<string, unknown>): Promise<string> {
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ensureToken(accessToken)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'atlas-cv', profile }),
  });
  if (!res.ok) throw new Error(`Atlas CV suggestion failed: ${res.status}`);
  const json = await res.json();
  return json.message as string;
}
