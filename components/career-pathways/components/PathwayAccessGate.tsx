/**
 * PathwayAccessGate - Controls access to premium/exclusive pathways
 * 
 * Unverified users see a "Verification Required" message instead of pathway details
 * Verified users see the full pathway content
 */

import React from 'react';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PathwayAccessGateProps {
  children: React.ReactNode;
  isVerified: boolean;
  isLoggedIn: boolean;
  pathwayName: string;
  pathwayTier: 'public' | 'premium' | 'enterprise';
  redirectUrl?: string;
}

export const PathwayAccessGate: React.FC<PathwayAccessGateProps> = ({
  children,
  isVerified,
  isLoggedIn,
  pathwayName,
  pathwayTier,
  redirectUrl = '/verify'
}) => {
  // Public pathways are always accessible
  if (pathwayTier === 'public') {
    return <>{children}</>;
  }

  // Premium pathways require verification
  if (pathwayTier === 'premium' && !isVerified) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        {/* Locked Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white text-center mb-2">
          Exclusive Pathway
        </h3>
        <p className="text-slate-400 text-center mb-6">
          <strong className="text-white">{pathwayName}</strong> requires pilot verification
          to ensure credential authenticity for airline partners.
        </p>

        {/* Benefits List */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">
            What you'll unlock:
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              Access to {pathwayName} requirements and details
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              Direct application submission to airline
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              Priority matching with verified credentials
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              Skip initial verification steps (already done)
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          {isLoggedIn ? (
            <Link
              to={`${redirectUrl}?redirect=${encodeURIComponent(window.location.pathname)}&pathway=${encodeURIComponent(pathwayName)}`}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              <ShieldCheck className="w-5 h-5" />
              Get Verified to Access
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to={`/join?redirect=${encodeURIComponent(window.location.pathname)}`}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Create Account & Verify
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <p className="text-xs text-slate-500 text-center">
            Verification is free for PSA members. Powered by pilotrecognition.com
          </p>
        </div>
      </div>
    );
  }

  // Enterprise pathways require both verification and enterprise access
  if (pathwayTier === 'enterprise') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white text-center mb-2">
          Enterprise Pathway
        </h3>
        <p className="text-slate-400 text-center mb-6">
          <strong className="text-white">{pathwayName}</strong> is available exclusively 
          to verified pilots through enterprise airline partnerships.
        </p>
        <div className="flex flex-col gap-3">
          {!isVerified ? (
            <Link
              to={`${redirectUrl}?redirect=${encodeURIComponent(window.location.pathname)}`}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              <ShieldCheck className="w-5 h-5" />
              Get Verified
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => {/* Open enterprise access modal */}}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Contact Enterprise Team
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default: show content
  return <>{children}</>;
};

// Compact version for pathway cards
interface PathwayTierBadgeProps {
  tier: 'public' | 'premium' | 'enterprise';
  isVerified?: boolean;
  className?: string;
}

export const PathwayTierBadge: React.FC<PathwayTierBadgeProps> = ({
  tier,
  isVerified,
  className = ''
}) => {
  const configs = {
    public: {
      bg: 'bg-slate-700',
      text: 'text-slate-300',
      border: 'border-slate-600',
      label: 'Public',
      icon: null
    },
    premium: {
      bg: isVerified ? 'bg-green-500/20' : 'bg-amber-500/20',
      text: isVerified ? 'text-green-400' : 'text-amber-400',
      border: isVerified ? 'border-green-500/30' : 'border-amber-500/30',
      label: isVerified ? 'Verified Access' : 'Verification Required',
      icon: isVerified ? '✓' : '🔒'
    },
    enterprise: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      label: 'Enterprise',
      icon: '🏢'
    }
  };

  const config = configs[tier];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}>
      {config.icon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
};

export default PathwayAccessGate;
