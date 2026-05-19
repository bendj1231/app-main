import React from 'react';
import { Clock, Gift, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

interface ActivationCreditNoticeProps {
  atoName: string;
  creditAmount: number;
  hoursRemaining: number;
  daysRemaining: number;
  verificationCount: number;
  enterpriseSeatPrice: number;
  onActivate: () => void;
  onDismiss: () => void;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED';
}

export const ActivationCreditNotice: React.FC<ActivationCreditNoticeProps> = ({
  atoName,
  creditAmount,
  hoursRemaining,
  daysRemaining,
  verificationCount,
  enterpriseSeatPrice,
  onActivate,
  onDismiss,
  status
}) => {
  if (status === 'EXPIRED') {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-slate-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              Previous Activation Credit Expired
            </h3>
            <p className="text-slate-500 text-sm mb-3">
              A $5.00 Member Credit for {atoName} was not claimed within the 5-day activation window 
              and has returned to the platform infrastructure pool. Future verification credits will 
              continue to be calculated and reserved for your organization.
            </p>
            <button 
              onClick={onActivate}
              className="text-blue-600 font-medium text-sm hover:underline"
            >
              Activate Enterprise Seat to claim future credits →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Gift className="w-7 h-7 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
              ENTERPRISE BENEFIT
            </span>
            <span className="text-blue-700 text-sm font-medium">
              Member Activation Credit Generated
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            ${creditAmount.toFixed(2)} New Member Credit Available
          </h3>
          
          <p className="text-slate-600 text-sm mb-4">
            An automated pilot verification was successfully processed through the Recognition+ network 
            under explicit pilot consent. As an authorized aviation asset manager, your organization 
            is eligible for our <strong>Enterprise Revenue-Share Protocol</strong>, which pays a 5% 
            dividend back to the verifying organization for every network check.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <p className="text-xs text-slate-500 mb-1">Verification Events</p>
              <p className="text-lg font-bold text-slate-900">{verificationCount}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <p className="text-xs text-slate-500 mb-1">Pending Credits</p>
              <p className="text-lg font-bold text-green-600">${creditAmount.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <p className="text-xs text-slate-500 mb-1">Per-Check Rate</p>
              <p className="text-lg font-bold text-blue-600">5%</p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900">
                  {daysRemaining} Days, {hoursRemaining} Hours Remaining
                </p>
                <p className="text-sm text-amber-700">
                  Activate your ${enterpriseSeatPrice.toLocaleString()}/Year Enterprise Seat to claim 
                  this credit as an immediate onboarding discount
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onActivate}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <CheckCircle className="w-5 h-5" />
              Activate Enterprise Seat
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onDismiss}
              className="px-6 py-3 bg-white text-slate-600 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Remind Me Later
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            If the activation window expires, this promotional credit will lapse and future dividends 
            will remain reserved until an Enterprise Seat is secured. Verification processing continues 
            normally regardless of membership status.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivationCreditNotice;
