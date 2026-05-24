/**
 * VeremarkVerifiedBadge Component - Pillar 11 Full Implementation
 *
 * Background Checks & Verification Providers integration:
 * - 9 Pillar 11 check types (identity, employment, license, medical, criminal,
 *   right-to-work, education, references, insurance)
 * - Pre-Cleared status badge for fast-track hiring
 * - Insurance risk profile tier (Low / Moderate / High)
 * - Service tier selector (Standard / Expedited)
 * - Geographic transparency (estimated turnaround per country)
 * - Blockchain-backed verification wallet indicator
 */

import React, { useState, useMemo } from 'react';
import {
  Shield, CheckCircle, Clock, AlertCircle, FileCheck, ExternalLink,
  ChevronDown, ChevronUp, Award, Globe, Zap, TrendingUp,
  UserCheck, Briefcase, GraduationCap, Lock, Stethoscope,
  Plane, FileText, BadgeCheck, Wallet
} from 'lucide-react';

export type VerificationStatus = 'pending' | 'in_review' | 'verified' | 'expired' | 'failed' | 'not_required';
export type ServiceTier = 'standard' | 'expedited';
export type RiskTier = 'low' | 'moderate' | 'high' | 'unknown';

export type VerificationCategory =
  | 'identity'
  | 'employment'
  | 'license'
  | 'medical'
  | 'criminal'
  | 'right_to_work'
  | 'education'
  | 'references'
  | 'insurance';

export interface VerificationItem {
  id: string;
  category: VerificationCategory;
  label: string;
  status: VerificationStatus;
  verifiedDate?: Date;
  expiryDate?: Date;
  notes?: string;
  turnaroundHours?: number;
}

export interface VeremarkVerifiedBadgeProps {
  isVerified?: boolean;
  isPreCleared?: boolean;
  verificationDate?: Date;
  expiryDate?: Date;
  items?: VerificationItem[];
  verificationId?: string;
  riskTier?: RiskTier;
  serviceTier?: ServiceTier;
  countryCode?: string;
  isPremium?: boolean;
  walletCompletenessPercent?: number;
  onRequestVerification?: () => void;
  onViewDetails?: () => void;
  onChangeServiceTier?: (tier: ServiceTier) => void;
}

const ALL_CHECK_TYPES: { category: VerificationCategory; label: string; defaultStatus: VerificationStatus }[] = [
  { category: 'identity', label: 'Identity Verification', defaultStatus: 'pending' },
  { category: 'employment', label: 'Employment History', defaultStatus: 'pending' },
  { category: 'license', label: 'License Validation', defaultStatus: 'pending' },
  { category: 'medical', label: 'Medical Certificate Status', defaultStatus: 'pending' },
  { category: 'criminal', label: 'Criminal Background', defaultStatus: 'pending' },
  { category: 'right_to_work', label: 'Right-to-Work / Visa', defaultStatus: 'pending' },
  { category: 'education', label: 'Education & Credentials', defaultStatus: 'pending' },
  { category: 'references', label: 'Reference Checks', defaultStatus: 'pending' },
  { category: 'insurance', label: 'Insurance Background Check', defaultStatus: 'pending' },
];

const COUNTRY_TURNAROUNDS: Record<string, { standard: number; expedited: number }> = {
  GB: { standard: 48, expedited: 12 },
  US: { standard: 72, expedited: 24 },
  CA: { standard: 72, expedited: 24 },
  AU: { standard: 48, expedited: 12 },
  DE: { standard: 168, expedited: 72 },
  FR: { standard: 72, expedited: 24 },
  PH: { standard: 96, expedited: 48 },
  SG: { standard: 48, expedited: 12 },
  AE: { standard: 72, expedited: 24 },
  default: { standard: 72, expedited: 24 },
};

export const getCountryTurnaround = (countryCode?: string, tier: ServiceTier = 'standard') => {
  const data = COUNTRY_TURNAROUNDS[countryCode?.toUpperCase() || ''] || COUNTRY_TURNAROUNDS.default;
  return tier === 'expedited' ? data.expedited : data.standard;
};

export const getRiskTierConfig = (tier: RiskTier) => {
  switch (tier) {
    case 'low':
      return {
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-900/30',
        borderColor: 'border-emerald-700',
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'Low Risk',
        description: 'Clean record, current medical, stable employment. Preferred rates available.',
      };
    case 'moderate':
      return {
        color: 'text-amber-400',
        bgColor: 'bg-amber-900/30',
        borderColor: 'border-amber-700',
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'Moderate Risk',
        description: 'Minor incidents or employment gaps. Standard rates with conditions may apply.',
      };
    case 'high':
      return {
        color: 'text-red-400',
        bgColor: 'bg-red-900/30',
        borderColor: 'border-red-700',
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'High Risk',
        description: 'Multiple incidents, suspensions, or medical Special Issuances. Premium rates possible.',
      };
    default:
      return {
        color: 'text-slate-400',
        bgColor: 'bg-slate-700',
        borderColor: 'border-slate-600',
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'Unknown',
        description: 'Complete verification to determine risk profile.',
      };
  }
};

export const getStatusConfig = (status: VerificationStatus) => {
  switch (status) {
    case 'verified':
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: 'bg-emerald-900/30',
        borderColor: 'border-emerald-700',
        textColor: 'text-emerald-400',
        label: 'Verified',
      };
    case 'in_review':
      return {
        icon: <Clock className="w-4 h-4" />,
        bgColor: 'bg-amber-900/30',
        borderColor: 'border-amber-700',
        textColor: 'text-amber-400',
        label: 'In Review',
      };
    case 'pending':
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: 'bg-blue-900/30',
        borderColor: 'border-blue-700',
        textColor: 'text-blue-400',
        label: 'Pending',
      };
    case 'expired':
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: 'bg-red-900/30',
        borderColor: 'border-red-700',
        textColor: 'text-red-400',
        label: 'Expired',
      };
    case 'failed':
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: 'bg-red-900/30',
        borderColor: 'border-red-700',
        textColor: 'text-red-400',
        label: 'Failed',
      };
    case 'not_required':
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: 'bg-slate-700/50',
        borderColor: 'border-slate-600',
        textColor: 'text-slate-400',
        label: 'Not Required',
      };
    default:
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: 'bg-slate-700',
        borderColor: 'border-slate-600',
        textColor: 'text-slate-400',
        label: 'Unknown',
      };
  }
};

const getCategoryIcon = (category: VerificationCategory) => {
  switch (category) {
    case 'identity': return <UserCheck className="w-4 h-4" />;
    case 'employment': return <Briefcase className="w-4 h-4" />;
    case 'license': return <Plane className="w-4 h-4" />;
    case 'medical': return <Stethoscope className="w-4 h-4" />;
    case 'criminal': return <Lock className="w-4 h-4" />;
    case 'right_to_work': return <Globe className="w-4 h-4" />;
    case 'education': return <GraduationCap className="w-4 h-4" />;
    case 'references': return <FileText className="w-4 h-4" />;
    case 'insurance': return <Shield className="w-4 h-4" />;
    default: return <FileCheck className="w-4 h-4" />;
  }
};

export const VeremarkVerifiedBadge: React.FC<VeremarkVerifiedBadgeProps> = ({
  isVerified = false,
  isPreCleared = false,
  verificationDate,
  expiryDate,
  items = [],
  verificationId,
  riskTier = 'unknown',
  serviceTier = 'standard',
  countryCode,
  isPremium = false,
  walletCompletenessPercent,
  onRequestVerification,
  onViewDetails,
  onChangeServiceTier,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ServiceTier>(serviceTier);

  // Merge provided items with default check types to ensure all 9 are always shown
  const mergedItems = useMemo(() => {
    const itemMap = new Map(items.map(i => [i.category, i]));
    return ALL_CHECK_TYPES.map(type => {
      const existing = itemMap.get(type.category);
      return existing || {
        id: type.category,
        category: type.category,
        label: type.label,
        status: type.defaultStatus,
      };
    });
  }, [items]);

  const verifiedCount = mergedItems.filter(i => i.status === 'verified' || i.status === 'not_required').length;
  const totalCount = mergedItems.length;
  const progressPercent = walletCompletenessPercent ?? (totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0);
  const turnaroundHours = getCountryTurnaround(countryCode, selectedTier);

  const riskConfig = getRiskTierConfig(riskTier);
  const visibleItems = showAllItems ? mergedItems : mergedItems.slice(0, 4);

  return (
    <div className="bg-slate-800/80 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
      {/* Header / Badge */}
      <div
        className="p-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border-b border-slate-600 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isVerified ? (
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                {isPreCleared && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                    <BadgeCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                <Shield className="w-6 h-6 text-slate-500" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white">
                  {isVerified ? (isPreCleared ? 'Pre-Cleared & Verified' : 'Veremark Verified') : 'Verification Pending'}
                </h3>
                {isPreCleared && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Pre-Cleared
                  </span>
                )}
                {isVerified && isPremium && (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isVerified
                  ? `Verified on ${verificationDate?.toLocaleDateString() || 'N/A'}${isPreCleared ? ' — Fast-track recognition enabled' : ''}`
                  : 'Complete verification to unlock priority listing and pre-cleared status'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isVerified ? (
              <Award className="w-8 h-8 text-emerald-400" />
            ) : (
              <span className="text-xs text-white px-2 py-1 rounded font-bold tracking-wide" style={{ background: 'linear-gradient(135deg,#e53e3e,#9b1c1c)', boxShadow: '0 0 8px rgba(229,62,62,0.3)' }}>
                Action Required
              </span>
            )}
            <span className="text-slate-400">{expanded ? '▼' : '▶'}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Wallet Completeness</span>
            <span className="text-emerald-400 font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1D2636', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="p-4 space-y-4">

          {/* Pre-Cleared Advantage Banner */}
          {isPreCleared && (
            <div className="p-3 bg-emerald-900/20 border border-emerald-700/50 rounded-lg">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-300">Pre-Cleared Advantage</p>
                  <p className="text-xs text-emerald-400/80 mt-1">
                    Airlines see you as pre-cleared. 80% faster screening time. Priority on candidate lists. Zero surprise rejections.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Risk Profile Tier */}
          <div className={`p-3 ${riskConfig.bgColor} border ${riskConfig.borderColor} rounded-lg`}>
            <div className="flex items-start gap-2">
              {riskConfig.icon}
              <div>
                <p className="text-sm font-medium text-white">Insurance Risk Profile: <span className={riskConfig.color}>{riskConfig.label}</span></p>
                <p className="text-xs text-slate-400 mt-1">{riskConfig.description}</p>
              </div>
            </div>
          </div>

          {/* Verification ID & Wallet */}
          <div className="flex flex-wrap gap-2">
            {verificationId && (
              <div className="flex-1 min-w-[200px] p-2 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Verification ID</p>
                <p className="text-xs font-mono text-slate-300">{verificationId}</p>
              </div>
            )}
            <div className="flex-1 min-w-[200px] p-2 bg-slate-700/50 rounded-lg flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-slate-500">Blockchain Wallet</p>
                <p className="text-xs text-slate-300">{isVerified ? 'Backed & Immutable' : 'Not yet created'}</p>
              </div>
            </div>
          </div>

          {/* Service Tier Selector (premium only) */}
          {isPremium && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 uppercase tracking-wide">Service Tier</span>
              <div className="flex gap-2">
                {(['standard', 'expedited'] as ServiceTier[]).map((tier) => (
                  <button
                    key={tier}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTier(tier);
                      onChangeServiceTier?.(tier);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedTier === tier
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {tier === 'expedited' ? (
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Expedited</span>
                    ) : (
                      'Standard'
                    )}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-500">
                Est. turnaround: <span className="text-blue-400">{turnaroundHours}h</span>
              </span>
            </div>
          )}

          {/* Check Type Tiles */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Verification Checks ({verifiedCount}/{totalCount})</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {visibleItems.map((item) => {
                const statusConfig = getStatusConfig(item.status);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={statusConfig.textColor}>{getCategoryIcon(item.category)}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        {item.verifiedDate && (
                          <p className="text-xs text-slate-400">
                            Verified {item.verifiedDate.toLocaleDateString()}
                          </p>
                        )}
                        {item.turnaroundHours && item.status === 'in_review' && (
                          <p className="text-xs text-amber-400">~{item.turnaroundHours}h remaining</p>
                        )}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 ${statusConfig.textColor}`}>
                      {statusConfig.icon}
                      <span className="text-xs font-medium hidden sm:inline">{statusConfig.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {mergedItems.length > 4 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllItems(!showAllItems);
                }}
                className="w-full py-2 text-xs text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 mt-2"
              >
                {showAllItems ? (
                  <><ChevronUp className="w-4 h-4" /> Show Less</>
                ) : (
                  <><ChevronDown className="w-4 h-4" /> Show {mergedItems.length - 4} More</>
                )}
              </button>
            )}
          </div>

          {/* Compliance Info */}
          <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className="flex items-start gap-2">
              <FileCheck className="w-4 h-4 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Compliance Automation</p>
                <p className="text-xs text-slate-400 mt-1">
                  {isVerified
                    ? 'Your verification wallet meets airline safety-critical requirements. Recruiters can view your verified status directly via API.'
                    : 'Complete all 9 verification checks to demonstrate compliance with airline, MRO, and insurance requirements. Verify once, apply anywhere.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isVerified && onRequestVerification && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestVerification();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Start Verification
              </button>
            )}
            {onViewDetails && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                View Details
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expiry Warning */}
          {expiryDate && new Date(expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
            <div className="p-2 bg-amber-900/20 border border-amber-700 rounded-lg">
              <p className="text-xs text-amber-400">
                ⚠️ Verification expires {expiryDate.toLocaleDateString()}. Renewal required.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VeremarkVerifiedBadge;
