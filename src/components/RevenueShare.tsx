import React, { useState } from 'react';

interface SplitConfig {
  label: string;
  percentage: number;
  wallet: string;
  color: string;
}

interface RevenueShareProps {
  amount?: number;
  atoIsPaid?: boolean;
  onConfirm?: () => void;
}

export const RevenueShare: React.FC<RevenueShareProps> = ({
  amount = 100,
  atoIsPaid = false,
  onConfirm,
}) => {
  const [showWallets, setShowWallets] = useState(false);

  // Build splits based on ATO status
  const splits: SplitConfig[] = [
    { label: 'Pilot Verification (Veremark)', percentage: 23, wallet: 'veremark...', color: '#dc2626' },
    { label: 'Logbook Data Feed', percentage: 5, wallet: 'logbook...', color: '#2563eb' },
  ];

  if (atoIsPaid) {
    splits.push({ label: 'ATO / Operator', percentage: 5, wallet: 'ato...', color: '#16a34a' });
    splits.push({ label: 'PilotRecognition Platform', percentage: 67, wallet: 'platform...', color: '#7c3aed' });
  } else {
    splits.push({ label: 'ATO / Operator', percentage: 0, wallet: 'ato...', color: '#9ca3af' });
    splits.push({ label: 'PilotRecognition Platform', percentage: 72, wallet: 'platform...', color: '#7c3aed' });
  }

  const platformShare = atoIsPaid ? 0.67 : 0.72;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4">
        <h3 className="text-lg font-bold text-white">Payment Distribution</h3>
        <p className="text-sm text-slate-400">
          ${amount.toLocaleString(} USDC split automatically on payment
        </p>
        {!atoIsPaid && (
          <p className="text-xs text-amber-400 mt-1">
            ⚠️ ATO not subscribed — platform receives extra 5%
          </p>
        )}
      </div>

      {/* Split breakdown */}
      <div className="p-6 space-y-4">
        {splits.map((split) => {
          const splitAmount = (amount * split.percentage) / 100;
          const isSkipped = split.percentage === 0;
          return (
            <div key={split.label} className={`relative ${isSkipped ? 'opacity-40' : ''}`}>
              {/* Bar background */}
              <div className="h-10 rounded-lg bg-slate-100 overflow-hidden">
                <div
                  className="h-full flex items-center px-3 transition-all duration-500"
                  style={{
                    width: `${split.percentage}%`,
                    backgroundColor: split.color,
                    minWidth: split.percentage < 10 && split.percentage > 0 ? '60px' : undefined,
                  }}
                >
                  <span className="text-white text-xs font-bold whitespace-nowrap">
                    {split.percentage > 0 ? `${split.percentage}%` : 'Skipped'}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-semibold text-slate-700">{split.label}</span>
                <span className={`text-sm font-bold ${isSkipped ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                  {split.percentage > 0 ? `$${splitAmount.toFixed(2} USDC` : '$0.00'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Total */}
        <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">Total</span>
          <span className="text-lg font-bold text-slate-900">${amount.toFixed(2} USDC</span>
        </div>

        {/* Helio fee note */}
        <p className="text-xs text-slate-500 text-center">
          Helio processing fee (~1%) deducted from platform share.
          Net to platform: ~${(amount * platformShare).toFixed(2} USDC.
        </p>

        {/* Wallet toggle */}
        <button
          onClick={() => setShowWallets(!showWallets)}
          className="text-xs text-slate-400 hover:text-slate-600 underline"
        >
          {showWallets ? 'Hide' : 'Show'} receiving wallet addresses
        </button>

        {showWallets && (
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            {splits.map((split) => (
              <div key={split.label} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{split.label}</span>
                <code className="text-slate-500 font-mono">{split.wallet}</code>
              </div>
            ))}
          </div>
        )}

        {/* Confirm button */}
        {onConfirm && (
          <button
            onClick={onConfirm}
            className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm uppercase tracking-wider hover:bg-slate-800 transition-all"
          >
            Confirm Split & Proceed to Payment
          </button>
        )}
      </div>
    </div>
  );
};
