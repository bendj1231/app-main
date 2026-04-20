import { supabase } from '../lib/supabase';

export type ScoreType = 'recognition' | 'programs' | 'experience' | 'behavioral' | 'language' | 'skills';

export const useScoreHistory = () => {
  const logScore = async (
    userId: string,
    scoreType: ScoreType,
    scoreValue: number
  ) => {
    try {
      const { error } = await supabase
        .from('score_history')
        .insert({
          user_id: userId,
          score_type: scoreType,
          score_value: scoreValue,
          calculated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Failed to log score:', error);
      }
    } catch (error) {
      console.error('Error in logScore:', error);
    }
  };

  const logRecognitionScore = async (userId: string, scoreValue: number) => {
    await logScore(userId, 'recognition', scoreValue);
  };

  const logProgramScore = async (userId: string, scoreValue: number) => {
    await logScore(userId, 'programs', scoreValue);
  };

  const logExperienceScore = async (userId: string, scoreValue: number) => {
    await logScore(userId, 'experience', scoreValue);
  };

  const logBehavioralScore = async (userId: string, scoreValue: number) => {
    await logScore(userId, 'behavioral', scoreValue);
  };

  const logLanguageScore = async (userId: string, scoreValue: number) => {
    await logScore(userId, 'language', scoreValue);
  };

  const logSkillsScore = async (userId: string, scoreValue: number) => {
    await logScore(userId, 'skills', scoreValue);
  };

  const getScoreHistory = async (
    userId: string,
    scoreType?: ScoreType,
    days?: number
  ) => {
    try {
      let query = supabase
        .from('score_history')
        .select('*')
        .eq('user_id', userId);

      if (scoreType) {
        query = query.eq('score_type', scoreType);
      }

      if (days) {
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('calculated_at', cutoffDate);
      }

      query = query.order('calculated_at', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Failed to get score history:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error in getScoreHistory:', error);
      return [];
    }
  };

  const getGrowthRate = async (userId: string, scoreType: ScoreType, days: number = 90) => {
    const history = await getScoreHistory(userId, scoreType, days);
    
    if (history.length < 2) {
      return 0;
    }

    const oldestScore = history[0].score_value || 0;
    const newestScore = history[history.length - 1].score_value || 0;
    
    return newestScore - oldestScore;
  };

  return {
    logScore,
    logRecognitionScore,
    logProgramScore,
    logExperienceScore,
    logBehavioralScore,
    logLanguageScore,
    logSkillsScore,
    getScoreHistory,
    getGrowthRate,
  };
};
