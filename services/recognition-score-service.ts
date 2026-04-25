/**
 * Recognition Score Service
 * 
 * Handles real-time score calculation and updates for pilot recognition system
 */

import { supabase } from '../shared/lib/supabase';
import {
  calculateRecognitionScore,
  PilotScoreInput,
  ScoreBreakdown,
  getScoreTier,
} from '../lib/pilot-recognition-score';

export interface RecognitionScoreRecord {
  id: string;
  user_id: string;
  total_score: number;
  hours_score: number;
  experience_score: number;
  assessment_score: number;
  mentorship_score: number;
  score_tier: string;
  breakdown: any;
  recommendations: string[];
  last_calculated_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Calculate and update recognition score for a user
 */
export const updateRecognitionScore = async (
  userId: string,
  input: PilotScoreInput
): Promise<RecognitionScoreRecord | null> => {
  try {
    // Calculate score using the algorithm
    const scoreBreakdown = calculateRecognitionScore(input);
    const scoreTier = getScoreTier(scoreBreakdown.totalScore);

    // Check if record exists
    const { data: existingRecord } = await supabase
      .from('recognition_scores')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingRecord) {
      // Update existing record
      const { data, error } = await supabase
        .from('recognition_scores')
        .update({
          total_score: scoreBreakdown.totalScore,
          hours_score: scoreBreakdown.hoursScore,
          experience_score: scoreBreakdown.experienceScore,
          assessment_score: scoreBreakdown.assessmentScore,
          mentorship_score: scoreBreakdown.mentorshipScore,
          score_tier: scoreTier,
          breakdown: scoreBreakdown.breakdown,
          recommendations: scoreBreakdown.recommendations,
          last_calculated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('recognition_scores')
        .insert({
          user_id: userId,
          total_score: scoreBreakdown.totalScore,
          hours_score: scoreBreakdown.hoursScore,
          experience_score: scoreBreakdown.experienceScore,
          assessment_score: scoreBreakdown.assessmentScore,
          mentorship_score: scoreBreakdown.mentorshipScore,
          score_tier: scoreTier,
          breakdown: scoreBreakdown.breakdown,
          recommendations: scoreBreakdown.recommendations,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error updating recognition score:', error);
    return null;
  }
};

/**
 * Get recognition score for a user
 */
export const getRecognitionScore = async (
  userId: string
): Promise<RecognitionScoreRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('recognition_scores')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recognition score:', error);
    return null;
  }
};

/**
 * Get leaderboard - top pilots by recognition score
 */
export const getLeaderboard = async (
  limit: number = 50,
  tierFilter?: string
): Promise<RecognitionScoreRecord[]> => {
  try {
    let query = supabase
      .from('recognition_scores')
      .select('*, profiles!inner(first_name, last_name, profile_image_url)')
      .order('total_score', { ascending: false })
      .limit(limit);

    if (tierFilter) {
      query = query.eq('score_tier', tierFilter);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

/**
 * Get user's rank on leaderboard
 */
export const getUserRank = async (userId: string): Promise<number | null> => {
  try {
    const { data: userScore } = await supabase
      .from('recognition_scores')
      .select('total_score')
      .eq('user_id', userId)
      .single();

    if (!userScore) return null;

    const { count, error } = await supabase
      .from('recognition_scores')
      .select('*', { count: 'exact', head: true })
      .gt('total_score', userScore.total_score);

    if (error) throw error;

    // Rank is count + 1 (1-indexed)
    return (count || 0) + 1;
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return null;
  }
};

/**
 * Get score history for a user (from score_history table)
 */
export const getScoreHistory = async (
  userId: string,
  days: number = 90
): Promise<any[]> => {
  try {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('score_history')
      .select('*')
      .eq('user_id', userId)
      .eq('score_type', 'recognition')
      .gte('calculated_at', cutoffDate)
      .order('calculated_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching score history:', error);
    return [];
  }
};

/**
 * Get score statistics for a user
 */
export const getScoreStatistics = async (userId: string) => {
  try {
    const score = await getRecognitionScore(userId);
    if (!score) return null;

    const history = await getScoreHistory(userId, 90);
    const rank = await getUserRank(userId);

    // Calculate growth rate
    let growthRate = 0;
    if (history.length >= 2) {
      const oldestScore = history[0].score_value || 0;
      const newestScore = history[history.length - 1].score_value || 0;
      growthRate = newestScore - oldestScore;
    }

    return {
      currentScore: score.total_score,
      scoreTier: score.score_tier,
      rank,
      growthRate,
      breakdown: score.breakdown,
      recommendations: score.recommendations,
      lastCalculated: score.last_calculated_at,
    };
  } catch (error) {
    console.error('Error fetching score statistics:', error);
    return null;
  }
};

/**
 * Subscribe to real-time score updates for a user
 */
export const subscribeToScoreUpdates = (
  userId: string,
  callback: (score: RecognitionScoreRecord) => void
) => {
  const channel = supabase
    .channel(`recognition_score_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'recognition_scores',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as RecognitionScoreRecord);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Batch update scores for multiple users (for admin use)
 */
export const batchUpdateScores = async (
  userIds: string[]
): Promise<{ success: string[]; failed: string[] }> => {
  const success: string[] = [];
  const failed: string[] = [];

  for (const userId of userIds) {
    try {
      // Fetch user data from profiles and other tables
      // This would need to be implemented based on your data structure
      // For now, we'll skip this as it requires data from multiple sources
      failed.push(userId);
    } catch (error) {
      failed.push(userId);
    }
  }

  return { success, failed };
};
