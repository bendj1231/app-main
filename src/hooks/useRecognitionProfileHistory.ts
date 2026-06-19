import { useWorkerAuth } from './useWorkerAuth';

export type ScoreType = 'recognition' | 'programs' | 'experience' | 'behavioral' | 'language' | 'skills';

export const useRecognitionProfileHistory = () => {
  const { callApi } = useWorkerAuth();
  const logScore = async (
    userId: string,
    scoreType: ScoreType,
    scoreValue: number
  ) => {
    try {
      await callApi('queryTable', {
        table: 'score_history',
        operation: 'insert',
        data: {
          user_id: userId,
          score_type: scoreType,
          score_value: scoreValue,
        },
      });
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
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'score_history',
        operation: 'select',
        where: scoreType ? { user_id: userId, score_type: scoreType } : { user_id: userId },
        orderBy: 'calculated_at ASC',
        limit: 500,
      });

      if (days) {
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        return (data || []).filter(
          (r: Record<string, unknown>) => (r.calculated_at as string) >= cutoffDate
        );
      }

      return (data || []) as unknown as Record<string, unknown>[];
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

    const oldestScore = (history[0] as Record<string, unknown>).score_value as number || 0;
    const newestScore = (history[history.length - 1] as Record<string, unknown>).score_value as number || 0;
    
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
