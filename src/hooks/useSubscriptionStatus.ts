/**
 * useSubscriptionStatus Hook
 * 
 * Checks user's subscription status for premium features
 */

import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

export interface SubscriptionStatus {
  isPremium: boolean;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  expiresAt?: string;
  features: {
    priorityMentorMatching: boolean;
    unlimitedMentorshipRequests: boolean;
    advancedAnalytics: boolean;
    badgeDisplayCustomization: boolean;
    priorityMessaging: boolean;
  };
}

export const useSubscriptionStatus = (userId: string | null) => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isPremium: false,
    plan: 'free',
    features: {
      priorityMentorMatching: false,
      unlimitedMentorshipRequests: false,
      advancedAnalytics: false,
      badgeDisplayCustomization: false,
      priorityMessaging: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (userId) {
      fetchSubscriptionStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchSubscriptionStatus = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Check subscription from profiles table
      const profile = await callApi<Record<string, unknown>>('getProfile', { id: userId });

      const plan = (profile?.subscription_tier as string) || 'free';
      const expiresAt = profile?.subscription_expires_at as string | undefined;
      const isPremium = plan !== 'free' && (!expiresAt || new Date(expiresAt) > new Date());

      const features = {
        priorityMentorMatching: isPremium,
        unlimitedMentorshipRequests: plan === 'premium' || plan === 'enterprise',
        advancedAnalytics: plan === 'premium' || plan === 'enterprise',
        badgeDisplayCustomization: isPremium,
        priorityMessaging: plan === 'premium' || plan === 'enterprise',
      };

      setStatus({
        isPremium,
        plan: plan as 'free' | 'enterprise' | 'basic' | 'premium',
        expiresAt,
        features,
      });
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    status,
    loading,
    fetchSubscriptionStatus,
  };
};
