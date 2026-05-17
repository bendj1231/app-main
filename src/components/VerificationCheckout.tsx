import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { HelioPaywall } from './HelioPaywall';
import { RevenueShare } from './RevenueShare';

interface AtoStatus {
  id: string;
  name: string;
  account_tier: string;
  status: string;
  isPaid: boolean;
}

interface VerificationCheckoutProps {
  onComplete?: () => void;
}

export const VerificationCheckout: React.FC<VerificationCheckoutProps> = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState<'loading' | 'review' | 'pay' | 'success'>('loading');
  const [atoStatus, setAtoStatus] = useState<AtoStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verificationAmount = 100; // $100 USDC

  useEffect(() => {
    if (!currentUser?.id) {
      setStep('review');
      return;
    }
    checkAtoStatus();
  }, [currentUser]);

  async function checkAtoStatus() {
    try {
      // 1. Get pilot's ATO from profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ato_enterprise_account_id, flight_school_address')
        .eq('id', currentUser!.id)
        .maybeSingle();

      if (profileError) throw profileError;

      // 2. If pilot has an ATO, check if it's paid
      if (profile?.ato_enterprise_account_id) {
        const { data: atoAccount, error: atoError } = await supabase
          .from('enterprise_accounts')
          .select('id, name, account_tier, status')
          .eq('id', profile.ato_enterprise_account_id)
          .maybeSingle();

        if (atoError) throw atoError;

        setAtoStatus({
          id: atoAccount?.id || '',
          name: atoAccount?.name || 'Unknown ATO',
          account_tier: atoAccount?.account_tier || 'free',
          status: atoAccount?.status || 'inactive',
          isPaid: atoAccount?.account_tier === 'enterprise' && atoAccount?.status === 'active',
        });
      } else {
        // No ATO linked — platform keeps everything
        setAtoStatus({
          id: '',
          name: 'No ATO linked',
          account_tier: 'none',
          status: 'none',
          isPaid: false,
        });
      }

      setStep('review');
    } catch (err: any) {
      console.error('ATO check failed:', err);
      setError('Failed to load ATO status. Please try again.');
      setStep('review');
    }
  }

  if (step === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-sm text-slate-500">Checking ATO status...</span>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl border border-green-200 shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Complete</h3>
        <p className="text-slate-600 mb-2">
          Your $100 USDC payment has been recorded and split automatically.
        </p>
        {atoStatus?.isPaid ? (
          <p className="text-sm text-green-600 mb-4">
            ✓ {atoStatus.name} received their 5% share
          </p>
        ) : (
          <p className="text-sm text-amber-600 mb-4">
            ⚠️ No ATO linked — full platform share retained
          </p>
        )}
        <div className="bg-slate-50 rounded-lg p-4 text-left text-sm space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-600">Veremark (Verification)</span>
            <span className="font-semibold text-slate-900">$23.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Logbook Provider</span>
            <span className="font-semibold text-slate-900">$5.00</span>
          </div>
          {atoStatus?.isPaid && (
            <div className="flex justify-between">
              <span className="text-slate-600">{atoStatus.name}</span>
              <span className="font-semibold text-slate-900">$5.00</span>
            </div>
          )}
          <div className="border-t border-slate-200 pt-2 flex justify-between">
            <span className="text-slate-600">Platform</span>
            <span className="font-semibold text-slate-900">
              ${atoStatus?.isPaid ? '67.00' : '72.00'}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Veremark will now begin your credential verification. This typically takes 3-5 business days.
        </p>
        <button
          onClick={onComplete}
          className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (step === 'pay') {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <button
          onClick={() => setStep('review')}
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to review
        </button>

        <HelioPaywall
          amount={verificationAmount}
          recipientWallet={(window as any).ENV?.PLATFORM_WALLET || 'YOUR_WALLET'}
          paymentType="recognition_plus"
          userId={currentUser?.id}
          userEmail={currentUser?.email}
          onSuccess={(paymentId) => {
            // Record the split via backend
            fetch('/api/payment-splitter', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pilotId: currentUser?.id,
                amount: verificationAmount,
                paymentId,
                paymentProvider: 'helio',
                metadata: {
                  ato_id: atoStatus?.id || null,
                  ato_is_paid: atoStatus?.isPaid || false,
                },
              }),
            }).then(() => {
              setStep('success');
            });
          }}
          onError={(err) => {
            setError(`Payment failed: ${err}`);
            setStep('review');
          }}
        />
      </div>
    );
  }

  // Review step
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Professional Qualification Check</h2>
        <p className="text-slate-500 mt-2">
          Verify your license, medical, and ratings through Veremark.
          Your verified badge appears on your profile for airlines to see.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-blue-900">What you get:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> License verification via CAAP/FAA/EASA
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Medical certificate status check
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Type rating confirmation
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Verified badge on your profile
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Priority in airline shortlists
          </li>
        </ul>
      </div>

      {/* ATO status indicator */}
      {atoStatus && (
        <div className={`rounded-lg p-3 text-sm ${
          atoStatus.isPaid 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-amber-50 border border-amber-200 text-amber-800'
        }`}>
          {atoStatus.isPaid ? (
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>
                <strong>{atoStatus.name}</strong> is a subscribed enterprise partner.
                They will receive 5% of this verification fee.
              </span>
            </div>
          ) : atoStatus.id ? (
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-bold">!</span>
              <span>
                <strong>{atoStatus.name}</strong> is not subscribed.
                Their 5% share will roll to the platform.
                <a href="#" className="text-amber-700 underline ml-1">Invite them to subscribe</a>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">-</span>
              <span>No ATO linked to your profile.</span>
            </div>
          )}
        </div>
      )}

      <RevenueShare
        amount={verificationAmount}
        atoIsPaid={atoStatus?.isPaid || false}
        onConfirm={() => setStep('pay')}
      />
    </div>
  );
};
