/**
 * useMentorshipBadges Hook
 * 
 * Manages mentorship badges and achievements
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface MentorshipBadge {
  id: string;
  user_id: string;
  badge_id: string;
  badge_name: string;
  badge_description: string;
  badge_icon: string;
  badge_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earned_at: string;
  criteria_met: any;
  is_displayed: boolean;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  criteria: (stats: any) => boolean;
}

// Badge definitions
const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_mentee',
    name: 'First Steps',
    description: 'Mentored your first mentee',
    icon: '🌟',
    tier: 'bronze',
    criteria: (stats) => stats.totalMenteesHelped >= 1,
  },
  {
    id: 'five_mentees',
    name: 'Mentor to Five',
    description: 'Mentored 5 different mentees',
    icon: '👥',
    tier: 'bronze',
    criteria: (stats) => stats.totalMenteesHelped >= 5,
  },
  {
    id: 'ten_mentees',
    name: 'Mentor to Ten',
    description: 'Mentored 10 different mentees',
    icon: '🎯',
    tier: 'silver',
    criteria: (stats) => stats.totalMenteesHelped >= 10,
  },
  {
    id: 'twenty_five_mentees',
    name: 'Community Leader',
    description: 'Mentored 25 different mentees',
    icon: '🏆',
    tier: 'gold',
    criteria: (stats) => stats.totalMenteesHelped >= 25,
  },
  {
    id: 'fifty_mentees',
    name: 'Master Mentor',
    description: 'Mentored 50 different mentees',
    icon: '👑',
    tier: 'platinum',
    criteria: (stats) => stats.totalMenteesHelped >= 50,
  },
  {
    id: 'ten_hours',
    name: 'Dedicated Mentor',
    description: 'Contributed 10+ mentorship hours',
    icon: '⏰',
    tier: 'bronze',
    criteria: (stats) => stats.totalHoursContributed >= 10,
  },
  {
    id: 'fifty_hours',
    name: 'Experienced Mentor',
    description: 'Contributed 50+ mentorship hours',
    icon: '⏱',
    tier: 'silver',
    criteria: (stats) => stats.totalHoursContributed >= 50,
  },
  {
    id: 'hundred_hours',
    name: 'Veteran Mentor',
    description: 'Contributed 100+ mentorship hours',
    icon: '🕐',
    tier: 'gold',
    criteria: (stats) => stats.totalHoursContributed >= 100,
  },
  {
    id: 'perfect_rating',
    name: 'Perfect Score',
    description: 'Maintained 5.0 average rating with 10+ sessions',
    icon: '⭐',
    tier: 'gold',
    criteria: (stats) => stats.averageRating >= 5 && stats.totalSessions >= 10,
  },
  {
    id: 'high_impact',
    name: 'High Impact',
    description: 'Achieved impact score of 80+',
    icon: '💪',
    tier: 'gold',
    criteria: (stats) => stats.impactScore >= 80,
  },
  {
    id: 'year_mentor',
    name: 'Year of Service',
    description: 'Active mentor for 1+ year',
    icon: '📅',
    tier: 'silver',
    criteria: (stats) => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return new Date(stats.firstSessionDate) <= oneYearAgo;
    },
  },
  {
    id: 'atlas_mentor',
    name: 'Atlas Mentor',
    description: 'Certified Atlas Mentor with exceptional track record',
    icon: '🎖',
    tier: 'platinum',
    criteria: (stats) => 
      stats.totalMenteesHelped >= 25 && 
      stats.totalHoursContributed >= 100 && 
      stats.averageRating >= 4.5 &&
      stats.impactScore >= 85,
  },
];

export const useMentorshipBadges = (userId: string | null) => {
  const [badges, setBadges] = useState<MentorshipBadge[]>([]);
  const [availableBadges, setAvailableBadges] = useState<BadgeDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchBadges();
      checkAvailableBadges();
    }
  }, [userId]);

  const fetchBadges = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('mentorship_badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;

      setBadges(data || []);
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError('Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailableBadges = async () => {
    if (!userId) return;

    try {
      // Fetch user's mentorship stats
      const { data: sessions } = await supabase
        .from('mentorship_sessions')
        .select('*')
        .eq('mentor_id', userId);

      const { data: requests } = await supabase
        .from('mentorship_requests')
        .select('mentee_id')
        .eq('mentor_id', userId)
        .in('status', ['accepted', 'completed']);

      // Calculate stats
      const totalMenteesHelped = new Set(requests?.map(r => r.mentee_id)).size;
      const totalHoursContributed = sessions?.reduce((sum, s) => sum + (s.duration_hours || 0), 0) || 0;
      const totalSessions = sessions?.length || 0;
      
      const ratings = [
        ...sessions.map(s => s.mentor_rating).filter((r): r is number => r !== undefined),
        ...sessions.map(s => s.mentee_rating).filter((r): r is number => r !== undefined)
      ];
      const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;

      const firstSessionDate = sessions?.[0]?.session_date || new Date().toISOString();

      // Calculate impact score
      const impactScore = calculateImpactScore(
        totalMenteesHelped,
        totalHoursContributed,
        totalSessions,
        averageRating
      );

      const stats = {
        totalMenteesHelped,
        totalHoursContributed,
        totalSessions,
        averageRating,
        firstSessionDate,
        impactScore,
      };

      // Check which badges can be earned
      const earnedBadgeIds = badges.map(b => b.badge_id);
      const newBadges = BADGE_DEFINITIONS.filter(
        badge => !earnedBadgeIds.includes(badge.id) && badge.criteria(stats)
      );

      setAvailableBadges(newBadges);
    } catch (err) {
      console.error('Error checking available badges:', err);
    }
  };

  const calculateImpactScore = (
    menteesHelped: number,
    hoursContributed: number,
    sessionsCount: number,
    averageRating: number
  ): number => {
    let score = 0;
    score += Math.min(menteesHelped * 3, 30);
    score += Math.min(hoursContributed * 0.5, 30);
    score += Math.min(sessionsCount * 0.5, 20);
    score += Math.min(averageRating * 4, 20);
    return Math.min(Math.round(score), 100);
  };

  const earnBadge = async (badgeId: string) => {
    if (!userId) return { success: false, error: 'No user ID provided' };

    const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
    if (!badge) return { success: false, error: 'Badge not found' };

    try {
      const { error } = await supabase
        .from('mentorship_badges')
        .insert({
          user_id: userId,
          badge_id: badge.id,
          badge_name: badge.name,
          badge_description: badge.description,
          badge_icon: badge.icon,
          badge_tier: badge.tier,
          earned_at: new Date().toISOString(),
          is_displayed: true,
        });

      if (error) throw error;

      await fetchBadges();
      return { success: true };
    } catch (err) {
      console.error('Error earning badge:', err);
      return { success: false, error: 'Failed to earn badge' };
    }
  };

  const toggleBadgeDisplay = async (badgeId: string) => {
    if (!userId) return { success: false };

    try {
      const badge = badges.find(b => b.id === badgeId);
      if (!badge) return { success: false };

      const { error } = await supabase
        .from('mentorship_badges')
        .update({ is_displayed: !badge.is_displayed })
        .eq('id', badgeId);

      if (error) throw error;

      await fetchBadges();
      return { success: true };
    } catch (err) {
      console.error('Error toggling badge display:', err);
      return { success: false };
    }
  };

  const getBadgesByTier = (tier: 'bronze' | 'silver' | 'gold' | 'platinum') => {
    return badges.filter(b => b.badge_tier === tier);
  };

  return {
    badges,
    availableBadges,
    loading,
    error,
    fetchBadges,
    checkAvailableBadges,
    earnBadge,
    toggleBadgeDisplay,
    getBadgesByTier,
  };
};
