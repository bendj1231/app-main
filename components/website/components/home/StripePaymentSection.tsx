import React, { useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';

interface StripePaymentSectionProps {
  onNavigate: (page: string) => void;
}

export default function StripePaymentSection({ onNavigate }: StripePaymentSectionProps) {
  const { currentUser } = useAuth();
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async (priceId: string, planName: string) => {
    if (!currentUser) {
      onNavigate('recognition-plus');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId, 
          userId: currentUser.id 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url: checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
        <h2 className="text-2xl md:text-4xl font-serif text-slate-900 mb-8 leading-tight text-center">
          Choose Your Plan
        </h2>

        {/* Free Account */}
        <div className="bg-gradient-to-br from-green-50 to-slate-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Free Account</h3>
            <p className="text-3xl font-bold text-slate-900 mb-1">$0<span className="text-lg font-normal text-slate-600">/forever</span></p>
            <p className="text-sm text-slate-600">Basic platform access</p>
          </div>
          
          <ul className="space-y-3 mb-6 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-slate-700">Platform access</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-slate-700">Basic profile matching (shows 2 gaps)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-slate-700">3 pathways per month</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-slate-700">Free Foundation Program enrollment</span>
            </li>
          </ul>

          <button
            onClick={() => {
              onNavigate('become-member');
              window.scrollTo(0, 0);
            }}
            disabled={processing}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : 'Create Free Account'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recognition Plus - Annual */}
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 border-2 border-blue-200 rounded-2xl p-6 relative">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Recognition Plus</h3>
              <p className="text-3xl font-bold text-slate-900 mb-1">$100<span className="text-lg font-normal text-slate-600">/year</span></p>
              <p className="text-sm text-slate-600">Premium features & priority access</p>
            </div>
            
            <ul className="space-y-3 mb-6 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span className="text-slate-700">Full profile comparison</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span className="text-slate-700">Unlimited pathway views</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span className="text-slate-700">Priority matching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span className="text-slate-700">AI career strategist</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span className="text-slate-700">Interview fast-track</span>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('recognition-plus')}
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Get Recognition Plus'}
            </button>
          </div>

          {/* Recognition Plus - Semi-Annual */}
          <div className="bg-gradient-to-br from-purple-50 to-slate-50 border-2 border-purple-200 rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Flexible
            </div>
            
            <div className="mb-4 mt-2">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Recognition Plus</h3>
              <p className="text-3xl font-bold text-slate-900 mb-1">$50<span className="text-lg font-normal text-slate-600">/6 months</span></p>
              <p className="text-sm text-slate-600">Same features, flexible payment</p>
            </div>
            
            <ul className="space-y-3 mb-6 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-slate-700">Full profile comparison</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-slate-700">Unlimited pathway views</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-slate-700">Priority matching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-slate-700">AI career strategist</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-slate-700">Interview fast-track</span>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('recognition-plus')}
              disabled={processing}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Get Recognition Plus'}
            </button>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-8 bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
          <p className="text-slate-900 text-sm mb-2 font-semibold text-center">
            Are you an airline, operator, or training organization?
          </p>
          <button
            onClick={() => window.location.href = '/enterprise-access'}
            className="w-full text-blue-600 hover:text-blue-700 text-sm font-bold underline text-center"
          >
            Click here for enterprise access →
          </button>
        </div>
      </div>
    </div>
  );
}
