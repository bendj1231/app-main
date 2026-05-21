import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    if (!userId) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    async function loadTier() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('account_tier')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;

        const tier = (data?.account_tier as AccountTier) || 'free';
        setState({
          tier,
          loading: false,
          isEnterprise: tier === 'enterprise' || tier === 'enterprise_admin',
          isRecognitionPlus: tier === 'recognition_plus' || tier === 'enterprise' || tier === 'enterprise_admin',
          error: null,
        });
      } catch (err: any) {
        setState({
          tier: 'free',
          loading: false,
          isEnterprise: false,
          isRecognitionPlus: false,
          error: err.message,
        });
      }
    }

    loadTier();

    // Real-time subscription for tier changes
    const channel = supabase
      .channel(`profile_tier_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const newTier = (payload.new as any)?.account_tier as AccountTier;
          if (newTier) {
            setState({
              tier: newTier,
              loading: false,
              isEnterprise: newTier === 'enterprise' || newTier === 'enterprise_admin',
              isRecognitionPlus: newTier === 'recognition_plus' || newTier === 'enterprise' || newTier === 'enterprise_admin',
              error: null,
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
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
