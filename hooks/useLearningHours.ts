import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

export interface LearningHours {
  id: string;
  user_id: string;
  course_id: string | null;
  course_title: string;
  hours_completed: number;
  completed_at: string | null;
  certificate_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useLearningHours = (userId: string | null) => {
  const [learningHours, setLearningHours] = useState<LearningHours[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalHours, setTotalHours] = useState(0);
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (userId) {
      fetchLearningHours();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchLearningHours = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'learning_hours',
        operation: 'select',
        where: { user_id: userId },
        orderBy: 'created_at DESC',
        limit: 200,
      });

      setLearningHours((data || []) as unknown as LearningHours[]);
      const total = (data || []).reduce((sum, item) => sum + ((item as Record<string, unknown>).hours_completed as number || 0), 0);
      setTotalHours(total);
    } catch (error) {
      console.error('Error in fetchLearningHours:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLearningHours = async (
    courseTitle: string,
    hoursCompleted: number,
    courseId: string | null = null,
    certificateUrl: string | null = null
  ) => {
    if (!userId) return null;

    try {
      const data = await callApi<Record<string, unknown>>('queryTable', {
        table: 'learning_hours',
        operation: 'insert',
        data: {
          user_id: userId,
          course_id: courseId,
          course_title: courseTitle,
          hours_completed: hoursCompleted,
          completed_at: new Date().toISOString(),
          certificate_url: certificateUrl,
        },
      });

      await fetchLearningHours();
      return data as unknown as LearningHours;
    } catch (error) {
      console.error('Error in addLearningHours:', error);
      return null;
    }
  };

  const updateLearningHours = async (
    learningId: string,
    hoursCompleted: number,
    completedAt: string | null = null
  ) => {
    if (!userId) return false;

    try {
      await callApi('queryTable', {
        table: 'learning_hours',
        operation: 'update',
        id: learningId,
        data: {
          hours_completed: hoursCompleted,
          completed_at: completedAt || new Date().toISOString(),
        },
      });

      await fetchLearningHours();
      return true;
    } catch (error) {
      console.error('Error in updateLearningHours:', error);
      return false;
    }
  };

  const deleteLearningHours = async (learningId: string) => {
    if (!userId) return false;

    try {
      await callApi('queryTable', {
        table: 'learning_hours',
        operation: 'delete',
        id: learningId,
      });

      await fetchLearningHours();
      return true;
    } catch (error) {
      console.error('Error in deleteLearningHours:', error);
      return false;
    }
  };

  const getHoursByCourse = (courseTitle: string) => {
    return learningHours.filter(item => item.course_title === courseTitle);
  };

  return {
    learningHours,
    totalHours,
    loading,
    fetchLearningHours,
    addLearningHours,
    updateLearningHours,
    deleteLearningHours,
    getHoursByCourse,
  };
};
