import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type GoalType = 'career' | 'learning' | 'certification' | 'experience' | 'network';
export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'missed';

export interface Goal {
  id: string;
  user_id: string;
  goal_title: string;
  goal_type: GoalType;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string | null;
  status: GoalStatus;
  created_at: string;
  updated_at: string;
}

export const useGoalTracking = (userId: string | null) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  const fetchGoals = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('goal_tracking')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch goals:', error);
      } else {
        setGoals(data || []);
      }
    } catch (error) {
      console.error('Error in fetchGoals:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (
    goalTitle: string,
    goalType: GoalType,
    targetValue: number,
    unit: string,
    deadline: string | null = null
  ) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('goal_tracking')
        .insert({
          user_id: userId,
          goal_title: goalTitle,
          goal_type: goalType,
          target_value: targetValue,
          current_value: 0,
          unit: unit,
          deadline: deadline,
          status: 'not_started',
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create goal:', error);
        return null;
      }

      await fetchGoals();
      return data;
    } catch (error) {
      console.error('Error in createGoal:', error);
      return null;
    }
  };

  const updateGoalProgress = async (goalId: string, currentValue: number) => {
    if (!userId) return false;

    try {
      const { data: goalData } = await supabase
        .from('goal_tracking')
        .select('target_value')
        .eq('id', goalId)
        .single();

      if (!goalData) return false;

      const targetValue = goalData.target_value;
      const newStatus: GoalStatus = currentValue >= targetValue 
        ? 'completed' 
        : currentValue > 0 
          ? 'in_progress' 
          : 'not_started';

      const { error } = await supabase
        .from('goal_tracking')
        .update({
          current_value: currentValue,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId);

      if (error) {
        console.error('Failed to update goal progress:', error);
        return false;
      }

      // Log goal completion if completed
      if (newStatus === 'completed') {
        await supabase
          .from('user_activity_log')
          .insert({
            user_id: userId,
            activity_type: 'goal_completion',
            activity_details: { goalId },
          });
      }

      await fetchGoals();
      return true;
    } catch (error) {
      console.error('Error in updateGoalProgress:', error);
      return false;
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('goal_tracking')
        .delete()
        .eq('id', goalId);

      if (error) {
        console.error('Failed to delete goal:', error);
        return false;
      }

      await fetchGoals();
      return true;
    } catch (error) {
      console.error('Error in deleteGoal:', error);
      return false;
    }
  };

  const getGoalsByType = (goalType: GoalType) => {
    return goals.filter(goal => goal.goal_type === goalType);
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => goal.status === 'completed');
  };

  const getInProgressGoals = () => {
    return goals.filter(goal => goal.status === 'in_progress');
  };

  const getGoalCompletionRate = () => {
    if (goals.length === 0) return 0;
    return (getCompletedGoals().length / goals.length) * 100;
  };

  return {
    goals,
    loading,
    fetchGoals,
    createGoal,
    updateGoalProgress,
    deleteGoal,
    getGoalsByType,
    getCompletedGoals,
    getInProgressGoals,
    getGoalCompletionRate,
  };
};
