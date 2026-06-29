/**
 * useWorkerAuth — Bridge hook for Cloudflare Worker API + Auth0
 *
 * Replaces Supabase data fetching with Worker API calls.
 * All hooks that previously imported `supabase` should use this instead.
 */

import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { api, apiBatch, pilotApi } from '../lib/d1-api';

export function useWorkerAuth() {
  const { getIdTokenClaims, user: auth0User } = useAuth0();

  const getToken = useCallback(async (): Promise<string> => {
    // ID token (__raw) is always a standard JWT (3 parts).
    // getAccessTokenSilently() returns an opaque token when no audience is set,
    // which the Worker cannot validate. We ONLY use the ID token.
    let claims: { __raw?: string } | undefined;
    for (let i = 0; i < 12; i++) {
      claims = await getIdTokenClaims() as { __raw?: string } | undefined;
      if (claims?.__raw) break;
      await new Promise((r) => setTimeout(r, 250));
    }
    const token = claims?.__raw;
    if (!token) throw new Error('Auth0 ID token not available — user may not be fully authenticated yet');
    return token;
  }, [getIdTokenClaims]);

  const callApi = useCallback(
    async <T>(action: string, params?: Record<string, unknown>): Promise<T> => {
      const token = await getToken();
      return api(token, action, params ?? {}) as Promise<T>;
    },
    [getToken]
  );

  const callPilotApi = useCallback(
    async <T>(action: string, params?: Record<string, unknown>): Promise<T> => {
      const token = await getToken();
      return pilotApi(token, action, params ?? {}) as Promise<T>;
    },
    [getToken]
  );

  const callBatch = useCallback(
    async (requests: Array<{ action: string; params?: Record<string, unknown>; cache?: number }>): Promise<Record<string, unknown>> => {
      const token = await getToken();
      return apiBatch(token, requests);
    },
    [getToken]
  );

  const userId = auth0User?.sub ?? null;

  return { getToken, callApi, callPilotApi, callBatch, userId, auth0User };
}
