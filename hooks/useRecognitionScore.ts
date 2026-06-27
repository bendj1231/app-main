/**
 * useRecognitionScore Hook
 * 
 * React hook for managing pilot recognition scores with real-time updates
 */

import { useState, useEffect, useCallback } from 'react';
import { useWorkerAuth } from './useWorkerAuth';
import {
  calculateRecognitionScore,
  PilotScoreInput,
  getScoreTier,
} from '@/lib/pilot-recognition-score';

export interface RecognitionScoreBreakdown {
  totalHours: number;
  picHours: number;
  ifrHours: number;
  nightHours: number;
  experienceYears: number;
  achievementsCount: number;
  licensesCount: number;
  programCompletion: number;
  performanceScore: number;
  mentorshipHours: number;
  mentorshipObservations: number;
  mentorshipCases: number;
}

export interface RecognitionScoreRecord {
  id: string;
  user_id: string;
  total_score: number;
  hours_score: number;
  experience_score: number;
  assessment_score: number;
  mentorship_score: number;
  score_tier: string;
  breakdown: RecognitionScoreBreakdown;
  recommendations: string[];
  last_calculated_at: string;
  created_at: string;
  updated_at: string;
}

export interface UseRecognitionScoreReturn {
  score: RecognitionScoreRecord | null;
  loading: boolean;
  error: string | null;
  updateScore: (input: PilotScoreInput) => Promise<void>;
  refreshScore: () => Promise<void>;
  leaderboard: RecognitionScoreRecord[];
  rank: number | null;
  statistics: unknown;
  loadLeaderboard: (limit?: number, tierFilter?: string) => Promise<void>;
}

export const useRecognitionScore = (): UseRecognitionScoreReturn => {
  const [score, setScore] = useState<RecognitionScoreRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const { callApi, userId } = useWorkerAuth();
  const [error, setError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<RecognitionScoreRecord[]>([]);
  const [rank, setRank] = useState<number | null>(null);
  const [statistics, setStatistics] = useState<unknown>(null);

  // Fetch current user's score
  const refreshScore = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const scoreData = await callApi<RecognitionScoreRecord>('getRecognitionScore', { user_id: userId });
      setScore(scoreData);

      // Fetch rank
      const rankData = await callApi<number>('getUserRank', { user_id: userId });
      setRank(rankData);

      // Fetch statistics
      const statsData = await callApi<unknown>('getScoreStatistics', { user_id: userId });
      setStatistics(statsData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [userId, callApi]);

  // Update score with new input data
  const updateScore = useCallback(async (input: PilotScoreInput) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const scoreBreakdown = calculateRecognitionScore(input);
      const scoreTier = getScoreTier(scoreBreakdown.totalScore);

      const updatedScore = await callApi<RecognitionScoreRecord>('saveRecognitionScore', {
        user_id: userId,
        total_score: scoreBreakdown.totalScore,
        hours_score: scoreBreakdown.hoursScore,
        experience_score: scoreBreakdown.experienceScore,
        assessment_score: scoreBreakdown.assessmentScore,
        mentorship_score: scoreBreakdown.mentorshipScore,
        score_tier: scoreTier,
        breakdown: scoreBreakdown.breakdown,
        recommendations: scoreBreakdown.recommendations,
      });

      if (updatedScore) {
        setScore(updatedScore);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [userId, callApi]);

  // Load leaderboard
  const loadLeaderboard = useCallback(async (limit: number = 50, tierFilter?: string) => {
    try {
      const data = await callApi<RecognitionScoreRecord[]>('getLeaderboard', { limit, tier_filter: tierFilter });
      setLeaderboard(data);
    } catch (err: unknown) {
      console.error('Error loading leaderboard:', err);
    }
  }, [callApi]);

  // Initial load
  useEffect(() => {
    refreshScore();
  }, [refreshScore]);

  return {
    score,
    loading,
    error,
    updateScore,
    refreshScore,
    leaderboard,
    rank,
    statistics,
    loadLeaderboard,
  };
};
