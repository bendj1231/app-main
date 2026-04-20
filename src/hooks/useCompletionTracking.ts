import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    if (userId) {
      fetchCompletions();
    }
  }, [userId]);

  const fetchCompletions = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('completion_tracking')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch completions:', error);
      } else {
        setCompletions(data || []);
        if (data && data.length > 0) {
          const avg = data.reduce((sum, c) => sum + (c.completion_percentage || 0), 0) / data.length;
          setAverageCompletionPercentage(avg);
        } else {
          setAverageCompletionPercentage(0);
        }
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
      const { data, error } = await supabase
        .from('completion_tracking')
        .insert({
          user_id: userId,
          item_id: itemId,
          item_type: itemType,
          item_title: itemTitle,
          completion_percentage: 0,
          status: 'in_progress',
          started_at: new Date().toISOString(),
          time_spent_hours: 0,
          score: null,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to start tracking:', error);
        return null;
      }

      await fetchCompletions();
      return data;
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
      const { error } = await supabase
        .from('completion_tracking')
        .update({
          completion_percentage: completionPercentage,
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
          time_spent_hours: timeSpentHours,
          score: score,
          updated_at: new Date().toISOString(),
        })
        .eq('id', trackingId);

      if (error) {
        console.error('Failed to update progress:', error);
        return false;
      }

      // Log assessment completion
      if (newStatus === 'completed') {
        const { data: trackingData } = await supabase
          .from('completion_tracking')
          .select('item_type, item_title, score')
          .eq('id', trackingId)
          .single();

        if (trackingData?.item_type === 'assessment') {
          await supabase
            .from('user_activity_log')
            .insert({
              user_id: userId,
              activity_type: 'assessment_completion',
              activity_details: {
                assessmentName: trackingData.item_title,
                score: trackingData.score,
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
      const { error } = await supabase
        .from('completion_tracking')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', trackingId);

      if (error) {
        console.error('Failed to mark as failed:', error);
        return false;
      }

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
