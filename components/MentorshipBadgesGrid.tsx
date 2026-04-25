/**
 * MentorshipBadgesGrid Component
 * 
 * Displays earned and available mentorship badges
 */

import React from 'react';
import { Trophy, Award, Star, Crown, Lock } from 'lucide-react';
import { MentorshipBadge, BadgeDefinition } from '../src/hooks/useMentorshipBadges';

interface MentorshipBadgesGridProps {
  earnedBadges: MentorshipBadge[];
  availableBadges: BadgeDefinition[];
  onEarnBadge?: (badgeId: string) => void;
  onToggleDisplay?: (badgeId: string) => void;
  loading?: boolean;
}

export const MentorshipBadgesGrid: React.FC<MentorshipBadgesGridProps> = ({
  earnedBadges,
  availableBadges,
  onEarnBadge,
  onToggleDisplay,
  loading = false,
}) => {
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return <Crown className="w-6 h-6" />;
      case 'gold':
        return <Trophy className="w-6 h-6" />;
      case 'silver':
        return <Award className="w-6 h-6" />;
      case 'bronze':
        return <Star className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'from-purple-500 to-pink-500';
      case 'gold':
        return 'from-yellow-500 to-amber-500';
      case 'silver':
        return 'from-gray-400 to-gray-500';
      case 'bronze':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getTierBgColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-100 text-purple-700';
      case 'gold':
        return 'bg-yellow-100 text-yellow-700';
      case 'silver':
        return 'bg-gray-100 text-gray-700';
      case 'bronze':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Earned Badges */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Earned Badges</h3>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${getTierColor(badge.badge_tier)}`}>
                    <span className="text-3xl">{badge.badge_icon}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBgColor(badge.badge_tier)}`}>
                    {badge.badge_tier.charAt(0).toUpperCase() + badge.badge_tier.slice(1)}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{badge.badge_name}</h4>
                <p className="text-sm text-gray-600 mb-3">{badge.badge_description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Earned {new Date(badge.earned_at).toLocaleDateString()}</span>
                  {onToggleDisplay && (
                    <button
                      onClick={() => onToggleDisplay(badge.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {badge.is_displayed ? 'Hide' : 'Show'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No badges earned yet. Start mentoring to earn your first badge!</p>
          </div>
        )}
      </div>

      {/* Available Badges */}
      {availableBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Badges Available to Earn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300">
                    <span className="text-3xl">{badge.icon}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBgColor(badge.tier)}`}>
                    {badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1)}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{badge.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                {onEarnBadge && (
                  <button
                    onClick={() => onEarnBadge(badge.id)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Earn Badge
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges (show progress) */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Locked Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Show some locked badges as preview */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 opacity-75">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">More badges available as you progress</span>
            </div>
            <p className="text-sm text-gray-600">
              Continue mentoring to unlock more achievements and recognition badges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
