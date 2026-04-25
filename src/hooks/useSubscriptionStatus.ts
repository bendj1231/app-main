/**
 * useSubscriptionStatus Hook
 * 
 * Checks user's subscription status for premium features
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    if (userId) {
      fetchSubscriptionStatus();
    }
  }, [userId]);

  const fetchSubscriptionStatus = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Check subscription from profiles table or subscriptions table
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_expires_at')
        .eq('id', userId)
        .single();

      const plan = profile?.subscription_tier || 'free';
      const expiresAt = profile?.subscription_expires_at;
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
        plan: plan as any,
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
