import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    if (userId) {
      fetchLearningHours();
    }
  }, [userId]);

  const fetchLearningHours = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('learning_hours')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch learning hours:', error);
      } else {
        setLearningHours(data || []);
        const total = (data || []).reduce((sum, item) => sum + (item.hours_completed || 0), 0);
        setTotalHours(total);
      }
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
      const { data, error } = await supabase
        .from('learning_hours')
        .insert({
          user_id: userId,
          course_id: courseId,
          course_title: courseTitle,
          hours_completed: hoursCompleted,
          completed_at: new Date().toISOString(),
          certificate_url: certificateUrl,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to add learning hours:', error);
        return null;
      }

      await fetchLearningHours();
      return data;
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
      const { error } = await supabase
        .from('learning_hours')
        .update({
          hours_completed: hoursCompleted,
          completed_at: completedAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', learningId);

      if (error) {
        console.error('Failed to update learning hours:', error);
        return false;
      }

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
      const { error } = await supabase
        .from('learning_hours')
        .delete()
        .eq('id', learningId);

      if (error) {
        console.error('Failed to delete learning hours:', error);
        return false;
      }

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
