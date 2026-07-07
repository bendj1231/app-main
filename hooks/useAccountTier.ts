import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

export type AccountTier = 'free' | 'recognition_plus' | 'enterprise' | 'enterprise_admin';

interface AccountTierState {
  tier: AccountTier;
  loading: boolean;
  isEnterprise: boolean;
  isRecognitionPlus: boolean;
  error: string | null;
}

export function useAccountTier(userId?: string | null): AccountTierState {
  const [state, setState] = useState<AccountTierState>({
    tier: 'free',
    loading: true,
    isEnterprise: false,
    isRecognitionPlus: false,
    error: null,
  });
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (!userId) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    let cancelled = false;

    async function loadTier() {
      try {
        const profile = await callApi<Record<string, unknown>>('getProfile', { id: userId });
        const rawTier = ((profile?.account_tier || profile?.subscription_tier) as AccountTier) || 'free';
        const tier = rawTier === 'plus' ? 'recognition_plus' : rawTier;
        if (!cancelled) {
          setState({
            tier,
            loading: false,
            isEnterprise: tier === 'enterprise' || tier === 'enterprise_admin',
            isRecognitionPlus: tier === 'recognition_plus' || tier === 'enterprise' || tier === 'enterprise_admin',
            error: null,
          });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setState({
            tier: 'free',
            loading: false,
            isEnterprise: false,
            isRecognitionPlus: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    loadTier();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return state;
}

// Helper to check if a feature is accessible
export function canAccessFeature(tier: AccountTier, requiredTier: AccountTier): boolean {
  const tiers = ['free', 'recognition_plus', 'enterprise', 'enterprise_admin'];
  const userIdx = tiers.indexOf(tier);
  const requiredIdx = tiers.indexOf(requiredTier);
  return userIdx >= requiredIdx;
}
