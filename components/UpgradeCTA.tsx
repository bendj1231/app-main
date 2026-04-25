import React from 'react';
import { Zap, Crown, ArrowRight } from 'lucide-react';
import { getUserSubscription } from '@/lib/subscription-gating';

interface UpgradeCTAProps {
  userId: string;
  onUpgrade: () => void;
  compact?: boolean;
  variant?: 'card' | 'banner' | 'button';
}

export default function UpgradeCTA({ userId, onUpgrade, compact = false, variant = 'card' }: UpgradeCTAProps) {
  const [subscription, setSubscription] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadSubscription() {
      const sub = await getUserSubscription(userId);
      setSubscription(sub);
      setLoading(false);
    }
    loadSubscription();
  }, [userId]);

  if (loading || subscription?.isPremium) {
    return null;
  }

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6" />
            <div>
              <p className="font-semibold">Upgrade to Premium</p>
              <p className="text-sm opacity-90">Unlock unlimited features</p>
            </div>
          </div>
          <button
            onClick={onUpgrade}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity flex items-center gap-2"
          >
            Upgrade
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={onUpgrade}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
      >
        <Crown className="w-5 h-5" />
        Upgrade to Premium
      </button>
    );
  }

  // Default card variant
  if (compact) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <Crown className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-900">Upgrade to Premium</span>
        </div>
        <p className="text-sm text-purple-700 mb-3">Unlock unlimited pathways, AI coaching, and more</p>
        <button
          onClick={onUpgrade}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          View Plans
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-xl">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-white/20 rounded-lg">
          <Crown className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">Upgrade to Premium</h3>
          <p className="text-white/90 text-sm">Unlock your full potential</p>
        </div>
      </div>

      <ul className="space-y-2 mb-6">
        <li className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-yellow-300" />
          <span>Unlimited career pathways</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-yellow-300" />
          <span>AI-powered career coaching</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-yellow-300" />
          <span>Advanced analytics & insights</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-yellow-300" />
          <span>Priority support</span>
        </li>
      </ul>

      <button
        onClick={onUpgrade}
        className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        View Plans
        <ArrowRight className="w-4 h-4" />
      </button>

      <p className="text-center text-xs text-white/80 mt-3">Starting at $50/6 months</p>
    </div>
  );
}
