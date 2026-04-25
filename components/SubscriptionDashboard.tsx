import React, { useEffect, useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { getUserSubscription, SubscriptionStatus } from '@/lib/subscription-gating';
import { getStripe } from '@/lib/stripe-client';

interface SubscriptionDashboardProps {
  userId: string;
}

export default function SubscriptionDashboard({ userId }: SubscriptionDashboardProps) {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, [userId]);

  const loadSubscription = async () => {
    const sub = await getUserSubscription(userId);
    setSubscription(sub);
    setLoading(false);
  };

  const handleUpgrade = async (priceId: string) => {
    setProcessing(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId }),
      });

      const { url: checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/stripe/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        await loadSubscription();
      }
    } catch (error) {
      console.error('Cancel error:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading subscription status...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Subscription Management</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              Current Plan: {subscription?.isPremium ? 'Premium' : 'Free'}
            </h3>
            <p className="text-gray-600">
              Status: <span className={`capitalize ${subscription?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {subscription?.status}
              </span>
            </p>
            {subscription?.currentPeriodEnd && (
              <p className="text-gray-600">
                Renews on: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          {subscription?.cancelAtPeriodEnd && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded">
              Cancels at period end
            </div>
          )}
        </div>
      </div>

      {!subscription?.isPremium && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-500">
            <h3 className="text-xl font-bold mb-2">Semi-Annual</h3>
            <p className="text-3xl font-bold mb-4">$50<span className="text-lg font-normal text-gray-600">/6 months</span></p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">✓ Unlimited pathways</li>
              <li className="flex items-center">✓ Unlimited learning hours</li>
              <li className="flex items-center">✓ Unlimited mentor sessions</li>
              <li className="flex items-center">✓ AI career coaching</li>
              <li className="flex items-center">✓ Advanced analytics</li>
            </ul>
            <button
              onClick={() => handleUpgrade(import.meta.env.VITE_STRIPE_SEMI_ANNUAL_PRICE_ID!)}
              disabled={processing}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Upgrade to Semi-Annual'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-purple-500 relative">
            <div className="absolute -top-3 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Best Value
            </div>
            <h3 className="text-xl font-bold mb-2">Annual</h3>
            <p className="text-3xl font-bold mb-4">$100<span className="text-lg font-normal text-gray-600">/year</span></p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">✓ Unlimited pathways</li>
              <li className="flex items-center">✓ Unlimited learning hours</li>
              <li className="flex items-center">✓ Unlimited mentor sessions</li>
              <li className="flex items-center">✓ AI career coaching</li>
              <li className="flex items-center">✓ Advanced analytics</li>
              <li className="flex items-center">✓ Priority support</li>
            </ul>
            <button
              onClick={() => handleUpgrade(import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID!)}
              disabled={processing}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Upgrade to Annual'}
            </button>
          </div>
        </div>
      )}

      {subscription?.isPremium && !subscription?.cancelAtPeriodEnd && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Manage Subscription</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={() => handleUpgrade(import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID!)}
                disabled={processing}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Switch to Annual'}
              </button>
              <button
                onClick={() => handleUpgrade(import.meta.env.VITE_STRIPE_SEMI_ANNUAL_PRICE_ID!)}
                disabled={processing}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Switch to Semi-Annual'}
              </button>
            </div>
            <button
              onClick={handleCancelSubscription}
              disabled={processing}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Cancel Subscription'}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Free Plan Features</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• 3 career pathways</li>
          <li>• 10 learning hours per month</li>
          <li>• 2 mentor sessions per month</li>
          <li>• 5 job applications per month</li>
          <li>• Basic analytics</li>
        </ul>
      </div>
    </div>
  );
}
