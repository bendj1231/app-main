/**
 * useRecognitionScore Hook
 * 
 * React hook for managing pilot recognition scores with real-time updates
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  getRecognitionScore,
  updateRecognitionScore,
  getLeaderboard,
  getUserRank,
  getScoreStatistics,
  subscribeToScoreUpdates,
  type RecognitionScoreRecord,
} from '../../services/recognition-score-service';
import {
  PilotScoreInput,
  calculateRecognitionScore,
} from '../../lib/pilot-recognition-score';

export interface UseRecognitionScoreReturn {
  score: RecognitionScoreRecord | null;
  loading: boolean;
  error: string | null;
  updateScore: (input: PilotScoreInput) => Promise<void>;
  refreshScore: () => Promise<void>;
  leaderboard: RecognitionScoreRecord[];
  rank: number | null;
  statistics: any;
  loadLeaderboard: (limit?: number, tierFilter?: string) => Promise<void>;
}

export const useRecognitionScore = (): UseRecognitionScoreReturn => {
  const [score, setScore] = useState<RecognitionScoreRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<RecognitionScoreRecord[]>([]);
  const [rank, setRank] = useState<number | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user ID from Supabase auth
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch current user's score
  const refreshScore = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const scoreData = await getRecognitionScore(userId);
      setScore(scoreData);

      // Fetch rank
      const rankData = await getUserRank(userId);
      setRank(rankData);

      // Fetch statistics
      const statsData = await getScoreStatistics(userId);
      setStatistics(statsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update score with new input data
  const updateScore = useCallback(async (input: PilotScoreInput) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const updatedScore = await updateRecognitionScore(userId, input);
      if (updatedScore) {
        setScore(updatedScore);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load leaderboard
  const loadLeaderboard = useCallback(async (limit: number = 50, tierFilter?: string) => {
    try {
      const data = await getLeaderboard(limit, tierFilter);
      setLeaderboard(data);
    } catch (err: any) {
      console.error('Error loading leaderboard:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshScore();
  }, [refreshScore]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToScoreUpdates(userId, (newScore) => {
      setScore(newScore);
    });

    return unsubscribe;
  }, [userId]);

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
