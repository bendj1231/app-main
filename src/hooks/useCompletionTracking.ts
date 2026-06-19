import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

export type ItemType = 'assessment' | 'course' | 'module' | 'program' | 'certification';
export type CompletionStatus = 'not_started' | 'in_progress' | 'completed' | 'failed';

export interface CompletionTracking {
  id: string;
  user_id: string;
  item_id: string | null;
  item_type: ItemType;
  item_title: string;
  completion_percentage: number;
  status: CompletionStatus;
  started_at: string | null;
  completed_at: string | null;
  time_spent_hours: number;
  score: number | null;
  created_at: string;
  updated_at: string;
}

export const useCompletionTracking = (userId: string | null) => {
  const [completions, setCompletions] = useState<CompletionTracking[]>([]);
  const [loading, setLoading] = useState(false);
  const [averageCompletionPercentage, setAverageCompletionPercentage] = useState(0);
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (userId) {
      fetchCompletions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchCompletions = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'completion_tracking',
        operation: 'select',
        where: { user_id: userId },
        orderBy: 'updated_at DESC',
        limit: 200,
      });

      setCompletions((data || []) as unknown as CompletionTracking[]);
      if (data && data.length > 0) {
        const avg = data.reduce((sum, c) => sum + ((c as Record<string, unknown>).completion_percentage as number || 0), 0) / data.length;
        setAverageCompletionPercentage(avg);
      } else {
        setAverageCompletionPercentage(0);
      }
    } catch (error) {
      console.error('Error in fetchCompletions:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTracking = async (
    itemId: string | null,
    itemType: ItemType,
    itemTitle: string
  ) => {
    if (!userId) return null;

    try {
      const data = await callApi<Record<string, unknown>>('queryTable', {
        table: 'completion_tracking',
        operation: 'insert',
        data: {
          user_id: userId,
          item_id: itemId,
          item_type: itemType,
          item_title: itemTitle,
          completion_percentage: 0,
          status: 'in_progress',
          started_at: new Date().toISOString(),
          time_spent_hours: 0,
          score: null,
        },
      });

      await fetchCompletions();
      return data as unknown as CompletionTracking;
    } catch (error) {
      console.error('Error in startTracking:', error);
      return null;
    }
  };

  const updateProgress = async (
    trackingId: string,
    completionPercentage: number,
    timeSpentHours?: number,
    score?: number | null
  ) => {
    if (!userId) return false;

    const newStatus: CompletionStatus = completionPercentage === 100
      ? 'completed'
      : completionPercentage > 0
        ? 'in_progress'
        : 'not_started';

    try {
      await callApi('queryTable', {
        table: 'completion_tracking',
        operation: 'update',
        id: trackingId,
        data: {
          completion_percentage: completionPercentage,
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
          time_spent_hours: timeSpentHours,
          score: score,
        },
      });

      // Log assessment completion
      if (newStatus === 'completed') {
        const trackingRows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'completion_tracking',
          operation: 'select',
          where: { id: trackingId },
          limit: 1,
        });
        const trackingData = trackingRows?.[0];

        if (trackingData?.item_type === 'assessment') {
          await callApi('queryTable', {
            table: 'user_activity_log',
            operation: 'insert',
            data: {
              user_id: userId,
              activity_type: 'assessment_completion',
              activity_details: JSON.stringify({
                assessmentName: trackingData.item_title,
                score: trackingData.score,
              }),
            },
          });
        }
      }

      await fetchCompletions();
      return true;
    } catch (error) {
      console.error('Error in updateProgress:', error);
      return false;
    }
  };

  const markFailed = async (trackingId: string) => {
    if (!userId) return false;

    try {
      await callApi('queryTable', {
        table: 'completion_tracking',
        operation: 'update',
        id: trackingId,
        data: { status: 'failed' },
      });

      await fetchCompletions();
      return true;
    } catch (error) {
      console.error('Error in markFailed:', error);
      return false;
    }
  };

  const getCompletionsByType = (itemType: ItemType) => {
    return completions.filter(c => c.item_type === itemType);
  };

  const getCompletedItems = () => {
    return completions.filter(c => c.status === 'completed');
  };

  const getInProgressItems = () => {
    return completions.filter(c => c.status === 'in_progress');
  };

  return {
    completions,
    averageCompletionPercentage,
    loading,
    fetchCompletions,
    startTracking,
    updateProgress,
    markFailed,
    getCompletionsByType,
    getCompletedItems,
    getInProgressItems,
  };
};
