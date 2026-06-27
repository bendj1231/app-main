/**
 * useMentorshipAnalytics Hook
 * 
 * Provides comprehensive mentorship analytics for mentors
 */

import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

export interface MentorshipAnalytics {
  totalMenteesHelped: number;
  totalHoursContributed: number;
  averageSessionDuration: number;
  impactScore: number;
  sessionsByMonth: { month: string; count: number; hours: number }[];
  menteeProgress: { menteeId: string; menteeName: string; progress: number; sessions: number }[];
  topTopics: { topic: string; count: number }[];
  ratingDistribution: { rating: number; count: number }[];
}

export const useMentorshipAnalytics = (mentorId: string | null) => {
  const [analytics, setAnalytics] = useState<MentorshipAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const { callApi } = useWorkerAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mentorId) {
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorId]);

  const fetchAnalytics = async () => {
    if (!mentorId) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch all mentorship sessions for this mentor
      const sessions = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'mentorship_sessions',
        operation: 'select',
        where: { mentor_id: mentorId },
        limit: 500,
      });

      // Fetch all accepted mentorship requests
      const requestRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'mentorship_requests',
        operation: 'select',
        where: { mentor_id: mentorId },
        limit: 500,
      });
      const requests = (requestRows || []).filter(
        r => ['accepted', 'completed'].includes(r.status as string)
      );

      // Calculate analytics
      const totalMenteesHelped = new Set(requests?.map(r => r.mentee_id)).size;
      const totalHoursContributed = sessions?.reduce((sum, s) => sum + ((s as Record<string, unknown>).duration_hours as number || 0), 0) || 0;
      const averageSessionDuration = sessions?.length > 0 
        ? totalHoursContributed / sessions.length 
        : 0;

      // Calculate impact score (composite metric)
      const impactScore = calculateImpactScore(
        totalMenteesHelped,
        totalHoursContributed,
        sessions?.length || 0,
        calculateAverageRating(sessions || [])
      );

      // Sessions by month
      const sessionsByMonth = groupSessionsByMonth(sessions || []);

      // Mentee progress (simplified - would need more data for real progress tracking)
      const menteeProgress = await fetchMenteeProgress(mentorId, requests || []);

      // Top topics
      const topTopics = extractTopTopics(sessions || []);

      // Rating distribution
      const ratingDistribution = calculateRatingDistribution(sessions || []);

      setAnalytics({
        totalMenteesHelped,
        totalHoursContributed,
        averageSessionDuration,
        impactScore,
        sessionsByMonth,
        menteeProgress,
        topTopics,
        ratingDistribution,
      });
    } catch (err) {
      console.error('Error fetching mentorship analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const calculateImpactScore = (
    menteesHelped: number,
    hoursContributed: number,
    sessionsCount: number,
    averageRating: number
  ): number => {
    let score = 0;

    // Mentee diversity (max 30 points)
    score += Math.min(menteesHelped * 3, 30);

    // Hours contributed (max 30 points)
    score += Math.min(hoursContributed * 0.5, 30);

    // Session frequency (max 20 points)
    score += Math.min(sessionsCount * 0.5, 20);

    // Quality rating (max 20 points)
    score += Math.min(averageRating * 4, 20);

    return Math.min(Math.round(score), 100);
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const calculateAverageRating = (sessions: any[]): number => {
    const ratings = [
      ...sessions.map(s => s.mentor_rating).filter((r): r is number => r !== undefined),
      ...sessions.map(s => s.mentee_rating).filter((r): r is number => r !== undefined)
    ];
    return ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const groupSessionsByMonth = (sessions: any[]): { month: string; count: number; hours: number }[] => {
    const grouped: Record<string, { count: number; hours: number }> = {};

    sessions.forEach(session => {
      const date = new Date(session.session_date);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = { count: 0, hours: 0 };
      }
      
      grouped[monthKey].count += 1;
      grouped[monthKey].hours += session.duration_hours || 0;
    });

    return Object.entries(grouped)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const fetchMenteeProgress = async (mentorId: string, requests: any[]) => {
    // Simplified progress tracking - in real implementation would track actual mentee progress
    const menteeIds = [...new Set(requests.map(r => r.mentee_id))];
    
    const progressPromises = menteeIds.map(async (menteeId) => {
      const mentee = await callApi<Record<string, unknown>>('getProfile', { id: menteeId });

      const countResult = await callApi<{ count: number }>('queryTable', {
        table: 'mentorship_sessions',
        operation: 'count',
        where: { mentor_id: mentorId, mentee_id: menteeId },
      });

      return {
        menteeId,
        menteeName: (mentee?.full_name as string) || 'Unknown',
        progress: Math.min(Math.random() * 100, 100), // Placeholder - would calculate real progress
        sessions: countResult.count || 0,
      };
    });

    return Promise.all(progressPromises);
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const extractTopTopics = (sessions: any[]): { topic: string; count: number }[] => {
    const topicCounts: Record<string, number> = {};

    sessions.forEach(session => {
      if (session.topic) {
        topicCounts[session.topic] = (topicCounts[session.topic] || 0) + 1;
      }
    });

    return Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const calculateRatingDistribution = (sessions: any[]): { rating: number; count: number }[] => {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    sessions.forEach(session => {
      if (session.mentor_rating) {
        distribution[session.mentor_rating]++;
      }
      if (session.mentee_rating) {
        distribution[session.mentee_rating]++;
      }
    });

    return Object.entries(distribution).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
    }));
  };

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
  };
};
