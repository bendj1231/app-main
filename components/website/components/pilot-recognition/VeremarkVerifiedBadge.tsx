/**
 * VeremarkVerifiedBadge Component
 * 
 * Premium Verification Badge for Recognition+ members:
 * - Veremark background screening integration
 * - Verified credentials display
 * - Real-time verification status tracking
 * - Compliance automation indicators
 */

import React, { useState } from 'react';
import { Shield, CheckCircle, Clock, AlertCircle, FileCheck, ExternalLink, ChevronDown, ChevronUp, Award } from 'lucide-react';

type VerificationStatus = 'pending' | 'in_review' | 'verified' | 'expired' | 'failed';

interface VerificationItem {
  id: string;
  category: 'flight_hours' | 'license_ratings' | 'academic' | 'criminal_history' | 'employment';
  label: string;
  status: VerificationStatus;
  verifiedDate?: Date;
  expiryDate?: Date;
  notes?: string;
}

interface VeremarkVerifiedBadgeProps {
  isVerified?: boolean;
  verificationDate?: Date;
  expiryDate?: Date;
  items?: VerificationItem[];
  verificationId?: string;
  onRequestVerification?: () => void;
  onViewDetails?: () => void;
}

export const VeremarkVerifiedBadge: React.FC<VeremarkVerifiedBadgeProps> = ({
  isVerified = false,
  verificationDate,
  expiryDate,
  items = [],
  verificationId,
  onRequestVerification,
  onViewDetails,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  const getStatusConfig = (status: VerificationStatus) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'flight_hours':
        return '✈️';
      case 'license_ratings':
        return '📜';
      case 'academic':
        return '🎓';
      case 'criminal_history':
        return '🔒';
      case 'employment':
        return '💼';
      default:
        return '📋';
    }
  };

  const verifiedCount = items.filter(i => i.status === 'verified').length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0;

  // Default items if none provided
  const defaultItems: VerificationItem[] = [
    { id: '1', category: 'flight_hours', label: 'Flight Hours Verification', status: 'pending' },
    { id: '2', category: 'license_ratings', label: 'License & Ratings', status: 'pending' },
    { id: '3', category: 'academic', label: 'Academic History', status: 'pending' },
    { id: '4', category: 'criminal_history', label: 'Background Check', status: 'pending' },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;
  const visibleItems = showAllItems ? displayItems : displayItems.slice(0, 3);

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
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                <Shield className="w-6 h-6 text-slate-500" />
              </div>
            )}
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white">
                  {isVerified ? 'Veremark Verified' : 'Verification Pending'}
                </h3>
                {isVerified && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isVerified 
                  ? `Verified on ${verificationDate?.toLocaleDateString() || 'N/A'}`
                  : 'Complete verification to unlock priority listing'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isVerified ? (
              <Award className="w-8 h-8 text-emerald-400" />
            ) : (
              <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                Action Required
              </span>
            )}
            <span className="text-slate-400">{expanded ? '▼' : '▶'}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Verification Progress</span>
              <span className="text-emerald-400 font-medium">{verifiedCount}/{totalCount}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="p-4">
          {/* Verification ID */}
          {verificationId && (
            <div className="mb-4 p-2 bg-slate-700/50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Verification ID</p>
              <p className="text-xs font-mono text-slate-300">{verificationId}</p>
            </div>
          )}

          {/* Verification Items */}
          <div className="space-y-2 mb-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Verified Credentials</p>
            
            {visibleItems.map((item) => {
              const statusConfig = getStatusConfig(item.status);
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCategoryIcon(item.category)}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      {item.verifiedDate && (
                        <p className="text-xs text-slate-400">
                          Verified {item.verifiedDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 ${statusConfig.textColor}`}>
                    {statusConfig.icon}
                    <span className="text-xs font-medium">{statusConfig.label}</span>
                  </div>
                </div>
              );
            })}

            {displayItems.length > 3 && (
              <button
                onClick={() => setShowAllItems(!showAllItems)}
                className="w-full py-2 text-xs text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1"
              >
                {showAllItems ? (
                  <><ChevronUp className="w-4 h-4" /> Show Less</>
                ) : (
                  <><ChevronDown className="w-4 h-4" /> Show {displayItems.length - 3} More</>
                )}
              </button>
            )}
          </div>

          {/* Compliance Info */}
          <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600 mb-4">
            <div className="flex items-start gap-2">
              <FileCheck className="w-4 h-4 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Compliance Automation</p>
                <p className="text-xs text-slate-400 mt-1">
                  {isVerified 
                    ? 'Your profile meets airline safety-critical requirements. Recruiters can view your verified status directly.'
                    : 'Complete verification to demonstrate compliance with airline and MRO requirements.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isVerified && onRequestVerification && (
              <button
                onClick={onRequestVerification}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Start Verification
              </button>
            )}
            {onViewDetails && (
              <button
                onClick={onViewDetails}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                View Details
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expiry Warning */}
          {expiryDate && new Date(expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
            <div className="mt-3 p-2 bg-amber-900/20 border border-amber-700 rounded-lg">
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
