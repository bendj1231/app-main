import React, { useState } from 'react';
import { RevenueShare } from './RevenueShare';

interface VerificationPaymentProps {
  pilotId?: string;
  pilotEmail?: string;
  onComplete?: () => void;
}

export const VerificationPayment: React.FC<VerificationPaymentProps> = ({
  pilotId,
  pilotEmail,
  onComplete,
}) => {
  const [step, setStep] = useState<'review' | 'pay' | 'success'>('review');

  const verificationAmount = 100; // $100 USDC for full verification

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl border border-green-200 shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Initiated</h3>
        <p className="text-slate-600 mb-4">
          Your $100 USDC payment has been recorded. The split will process automatically.
        </p>
        <div className="bg-slate-50 rounded-lg p-4 text-left text-sm space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-600">Veremark (Verification)</span>
            <span className="font-semibold text-slate-900">$23.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Logbook Provider</span>
            <span className="font-semibold text-slate-900">$5.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">ATO / Operator</span>
            <span className="font-semibold text-slate-900">$5.00</span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex justify-between">
            <span className="text-slate-600">Platform</span>
            <span className="font-semibold text-slate-900">~$66.00</span>
          </div>
        </div>
        <button
          onClick={onComplete}
          className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all"
        >
          Continue to Dashboard
        </button>
      </div>
    );
  }

  // The pay step is no longer required — verification is free.
  if (step === 'pay') {
    return (
      <div className="max-w-lg mx-auto space-y-4 text-center">
        <p className="text-slate-700">
          Verification is now free. Proceed to confirmation.
        </p>
        <button
          onClick={() => setStep('success')}
          className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all"
        >
          Continue
        </button>
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

      <RevenueShare
        amount={verificationAmount}
        atoIsPaid={false} // In production, check pilot's ATO enterprise status
        onConfirm={() => setStep('pay')}
      />
    </div>
  );
};
