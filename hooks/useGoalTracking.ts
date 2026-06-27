import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

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
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchGoals = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'goal_tracking',
        operation: 'select',
        where: { user_id: userId },
        orderBy: 'created_at DESC',
        limit: 200,
      });

      setGoals((data || []) as unknown as Goal[]);
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
      const data = await callApi<Record<string, unknown>>('queryTable', {
        table: 'goal_tracking',
        operation: 'insert',
        data: {
          user_id: userId,
          goal_title: goalTitle,
          goal_type: goalType,
          target_value: targetValue,
          current_value: 0,
          unit: unit,
          deadline: deadline,
          status: 'not_started',
        },
      });

      await fetchGoals();
      return data as unknown as Goal;
    } catch (error) {
      console.error('Error in createGoal:', error);
      return null;
    }
  };

  const updateGoalProgress = async (goalId: string, currentValue: number) => {
    if (!userId) return false;

    try {
      const goalRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'goal_tracking',
        operation: 'select',
        where: { id: goalId },
        limit: 1,
      });
      const goalData = goalRows?.[0];

      if (!goalData) return false;

      const targetValue = goalData.target_value as number;
      const newStatus: GoalStatus = currentValue >= targetValue 
        ? 'completed' 
        : currentValue > 0 
          ? 'in_progress' 
          : 'not_started';

      await callApi('queryTable', {
        table: 'goal_tracking',
        operation: 'update',
        id: goalId,
        data: {
          current_value: currentValue,
          status: newStatus,
        },
      });

      // Log goal completion if completed
      if (newStatus === 'completed') {
        await callApi('queryTable', {
          table: 'user_activity_log',
          operation: 'insert',
          data: {
            user_id: userId,
            activity_type: 'goal_completion',
            activity_details: JSON.stringify({ goalId }),
          },
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
      await callApi('queryTable', {
        table: 'goal_tracking',
        operation: 'delete',
        id: goalId,
      });

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
