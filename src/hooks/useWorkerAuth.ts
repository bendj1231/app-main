/**
 * useWorkerAuth — Bridge hook for Cloudflare Worker API + Auth0
 *
 * Replaces Supabase data fetching with Worker API calls.
 * All hooks that previously imported `supabase` should use this instead.
 */

import { useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { api, apiBatch } from '../lib/d1-api';

export function useWorkerAuth() {
  const { getAccessTokenSilently, user: auth0User } = useAuth0();
  const tokenRef = useRef<string | null>(null);

  const getToken = useCallback(async (): Promise<string> => {
    if (tokenRef.current) return tokenRef.current;
    const token = await getAccessTokenSilently();
    tokenRef.current = token;
    return token;
  }, [getAccessTokenSilently]);

  const callApi = useCallback(
    async <T>(action: string, params?: Record<string, unknown>): Promise<T> => {
      const token = await getToken();
      return api(token, action, params ?? {}) as Promise<T>;
    },
    [getToken]
  );

  const callBatch = useCallback(
    async (requests: Array<{ action: string; params?: Record<string, unknown> }>): Promise<Record<string, unknown>> => {
      const token = await getToken();
      return apiBatch(token, requests);
    },
    [getToken]
  );

  const userId = auth0User?.sub ?? null;

  return { getToken, callApi, callBatch, userId, auth0User };
}
