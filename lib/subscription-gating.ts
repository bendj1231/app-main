import { supabase } from '@/shared/lib/supabase';

export interface SubscriptionStatus {
  isPremium: boolean;
  isActive: boolean;
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export async function getUserSubscription(userId: string): Promise<SubscriptionStatus> {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !subscription) {
      return {
        isPremium: false,
        isActive: false,
        status: 'inactive',
        cancelAtPeriodEnd: false,
      };
    }

    const isActive = subscription.status === 'active' || subscription.status === 'trialing';
    const isPremium = isActive && !subscription.cancel_at_period_end;

    return {
      isPremium,
      isActive,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return {
      isPremium: false,
      isActive: false,
      status: 'inactive',
      cancelAtPeriodEnd: false,
    };
  }
}

export function checkFeatureAccess(
  subscription: SubscriptionStatus,
  feature: 'basic' | 'premium' | 'enterprise'
): boolean {
  switch (feature) {
    case 'basic':
      return true; // All users have basic access
    case 'premium':
      return subscription.isPremium;
    case 'enterprise':
      return subscription.isPremium; // For now, premium includes enterprise features
    default:
      return false;
  }
}

export function getFeatureLimits(subscription: SubscriptionStatus) {
  if (subscription.isPremium) {
    return {
      maxPathways: Infinity,
      maxLearningHours: Infinity,
      maxMentorSessions: Infinity,
      maxJobApplications: Infinity,
      canAccessAI: true,
      canAccessAdvancedAnalytics: true,
      canExportData: true,
      prioritySupport: true,
    };
  }

  return {
    maxPathways: 3,
    maxLearningHours: 10,
    maxMentorSessions: 2,
    maxJobApplications: 5,
    canAccessAI: false,
    canAccessAdvancedAnalytics: false,
    canExportData: false,
    prioritySupport: false,
  };
}
