/**
 * useAICoachingScoreBoost Hook
 * 
 * Integrates AI coaching recommendations with Recognition Score boosting.
 * When pilots complete AI-recommended actions, their recognition score gets boosted.
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';

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

export const useAICoachingScoreBoost = (userId?: string) => {
  const [pendingActions, setPendingActions] = useState<AICoachingAction[]>([]);
  const [completedActions, setCompletedActions] = useState<AICoachingAction[]>([]);
  const [boostHistory, setBoostHistory] = useState<ScoreBoostHistory[]>([]);
  const [totalBoost, setTotalBoost] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      loadCoachingActions();
      loadBoostHistory();
    }
  }, [userId]);

  const loadCoachingActions = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_coaching_actions')
        .select('*')
        .eq('pilot_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const actions: AICoachingAction[] = (data || []).map((item: any) => ({
        actionId: item.id,
        type: item.action_type,
        description: item.description,
        scoreBoost: item.score_boost,
        completed: item.completed,
        completedAt: item.completed_at,
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
      const { data, error } = await supabase
        .from('score_boost_history')
        .select('*')
        .eq('pilot_id', userId)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;

      const history: ScoreBoostHistory[] = (data || []).map((item: any) => ({
        boostId: item.id,
        actionId: item.action_id,
        scoreBefore: item.score_before,
        scoreAfter: item.score_after,
        boostAmount: item.boost_amount,
        timestamp: item.timestamp,
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
      const { error: updateError } = await supabase
        .from('ai_coaching_actions')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', actionId);

      if (updateError) throw updateError;

      // Calculate new score
      const newScore = currentScore + action.scoreBoost;

      // Record boost history
      const { error: historyError } = await supabase
        .from('score_boost_history')
        .insert({
          pilot_id: userId,
          action_id: actionId,
          score_before: currentScore,
          score_after: newScore,
          boost_amount: action.scoreBoost,
          timestamp: new Date().toISOString(),
        });

      if (historyError) throw historyError;

      // Update recognition score in database
      const { error: scoreError } = await supabase
        .from('recognition_scores')
        .update({
          total_score: newScore,
          ai_coaching_boost: (totalBoost || 0) + action.scoreBoost,
          updated_at: new Date().toISOString(),
        })
        .eq('pilot_id', userId);

      if (scoreError) throw scoreError;

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
      const { data, error } = await supabase
        .from('ai_coaching_actions')
        .insert({
          pilot_id: userId,
          action_type: action.type,
          description: action.description,
          score_boost: action.scoreBoost,
          completed: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const newAction: AICoachingAction = {
        actionId: data.id,
        type: data.action_type,
        description: data.description,
        scoreBoost: data.score_boost,
        completed: data.completed,
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
