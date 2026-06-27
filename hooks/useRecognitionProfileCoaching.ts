/**
 * useRecognitionProfileCoaching Hook
 *
 * Integrates AI coaching recommendations with Recognition Profile boosting.
 * When pilots complete AI-recommended actions, their recognition profile gets boosted.
 */

import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

interface AICoachingAction {
  actionId: string;
  type: 'skill_gap' | 'certification' | 'training' | 'networking' | 'achievement';
  description: string;
  scoreBoost: number;
  completed: boolean;
  completedAt?: string;
}

interface ScoreBoostHistory {
  boostId: string;
  actionId: string;
  scoreBefore: number;
  scoreAfter: number;
  boostAmount: number;
  timestamp: string;
}

export const useRecognitionProfileCoaching = (userId?: string) => {
  const [pendingActions, setPendingActions] = useState<AICoachingAction[]>([]);
  const [completedActions, setCompletedActions] = useState<AICoachingAction[]>([]);
  const [boostHistory, setBoostHistory] = useState<ScoreBoostHistory[]>([]);
  const [totalBoost, setTotalBoost] = useState(0);
  const [loading, setLoading] = useState(false);
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (userId) {
      loadCoachingActions();
      loadBoostHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadCoachingActions = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'ai_coaching_actions',
        operation: 'select',
        where: { pilot_id: userId },
        orderBy: 'created_at DESC',
        limit: 200,
      });

      const actions: AICoachingAction[] = (data || []).map(item => ({
        actionId: item.id as string,
        type: item.action_type as AICoachingAction['type'],
        description: item.description as string,
        scoreBoost: item.score_boost as number,
        completed: !!item.completed,
        completedAt: item.completed_at as string | undefined,
      }));

      setPendingActions(actions.filter(a => !a.completed));
      setCompletedActions(actions.filter(a => a.completed));
    } catch (error) {
      console.error('Failed to load coaching actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBoostHistory = async () => {
    if (!userId) return;

    try {
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'score_boost_history',
        operation: 'select',
        where: { pilot_id: userId },
        orderBy: 'timestamp DESC',
        limit: 50,
      });

      const history: ScoreBoostHistory[] = (data || []).map(item => ({
        boostId: item.id as string,
        actionId: item.action_id as string,
        scoreBefore: item.score_before as number,
        scoreAfter: item.score_after as number,
        boostAmount: item.boost_amount as number,
        timestamp: item.timestamp as string,
      }));

      setBoostHistory(history);
      setTotalBoost(history.reduce((sum, h) => sum + h.boostAmount, 0));
    } catch (error) {
      console.error('Failed to load boost history:', error);
    }
  };

  const completeAction = async (actionId: string, currentScore: number) => {
    if (!userId) return;

    setLoading(true);
    try {
      const action = pendingActions.find(a => a.actionId === actionId);
      if (!action) throw new Error('Action not found');

      // Update action as completed
      await callApi('queryTable', {
        table: 'ai_coaching_actions',
        operation: 'update',
        id: actionId,
        data: { completed: true, completed_at: new Date().toISOString() },
      });

      // Calculate new score
      const newScore = currentScore + action.scoreBoost;

      // Record boost history
      await callApi('queryTable', {
        table: 'score_boost_history',
        operation: 'insert',
        data: {
          pilot_id: userId,
          action_id: actionId,
          score_before: currentScore,
          score_after: newScore,
          boost_amount: action.scoreBoost,
        },
      });

      // Update recognition score in database
      await callApi('saveRecognitionScore', {
        pilot_id: userId,
        total_score: newScore,
        ai_coaching_boost: (totalBoost || 0) + action.scoreBoost,
      });

      // Refresh data
      await loadCoachingActions();
      await loadBoostHistory();

      return { success: true, newScore, boostAmount: action.scoreBoost };
    } catch (error) {
      console.error('Failed to complete action:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const addCoachingAction = async (action: Omit<AICoachingAction, 'actionId' | 'completed'>) => {
    if (!userId) return;

    try {
      const data = await callApi<Record<string, unknown>>('queryTable', {
        table: 'ai_coaching_actions',
        operation: 'insert',
        data: {
          pilot_id: userId,
          action_type: action.type,
          description: action.description,
          score_boost: action.scoreBoost,
          completed: false,
        },
      });

      const newAction: AICoachingAction = {
        actionId: (data as { id: string }).id,
        type: action.type,
        description: action.description,
        scoreBoost: action.scoreBoost,
        completed: false,
      };

      setPendingActions([...pendingActions, newAction]);
      return { success: true, action: newAction };
    } catch (error) {
      console.error('Failed to add coaching action:', error);
      return { success: false, error };
    }
  };

  const getPotentialBoost = () => {
    return pendingActions.reduce((sum, action) => sum + action.scoreBoost, 0);
  };

  const getBoostProgress = () => {
    const totalPossible = pendingActions.reduce((sum, action) => sum + action.scoreBoost, 0) + totalBoost;
    return {
      current: totalBoost,
      potential: getPotentialBoost(),
      total: totalPossible,
      percentage: totalPossible > 0 ? (totalBoost / totalPossible) * 100 : 0,
    };
  };

  return {
    pendingActions,
    completedActions,
    boostHistory,
    totalBoost,
    loading,
    completeAction,
    addCoachingAction,
    getPotentialBoost,
    getBoostProgress,
    loadCoachingActions,
    loadBoostHistory,
  };
};
