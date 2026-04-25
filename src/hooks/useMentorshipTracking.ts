/**
 * useMentorshipTracking Hook
 * 
 * Tracks mentorship sessions, hours, and outcomes
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface MentorshipSession {
  id: string;
  request_id: string;
  mentor_id: string;
  mentee_id: string;
  session_date: string;
  duration_hours: number;
  session_type: 'video_call' | 'in_person' | 'observation' | 'case_review' | 'general';
  topic?: string;
  notes?: string;
  outcomes?: string[];
  mentor_rating?: number;
  mentee_rating?: number;
  created_at: string;
  updated_at: string;
}

export interface MentorshipStats {
  totalSessions: number;
  totalHours: number;
  averageRating: number;
  sessionsByType: Record<string, number>;
  recentSessions: MentorshipSession[];
}

export const useMentorshipTracking = (userId: string | null, role: 'mentor' | 'mentee' | 'both' = 'both') => {
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [stats, setStats] = useState<MentorshipStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchSessions();
    }
  }, [userId, role]);

  const fetchSessions = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('mentorship_sessions')
        .select('*')
        .order('session_date', { ascending: false });

      if (role === 'mentor') {
        query = query.eq('mentor_id', userId);
      } else if (role === 'mentee') {
        query = query.eq('mentee_id', userId);
      } else {
        query = query.or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setSessions(data || []);
      calculateStats(data || []);
    } catch (err) {
      console.error('Error fetching mentorship sessions:', err);
      setError('Failed to load mentorship sessions');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (sessionData: MentorshipSession[]) => {
    const totalSessions = sessionData.length;
    const totalHours = sessionData.reduce((sum, session) => sum + (session.duration_hours || 0), 0);
    
    const allRatings = [
      ...sessionData.map(s => s.mentor_rating).filter((r): r is number => r !== undefined),
      ...sessionData.map(s => s.mentee_rating).filter((r): r is number => r !== undefined)
    ];
    const averageRating = allRatings.length > 0 
      ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length 
      : 0;

    const sessionsByType: Record<string, number> = {};
    sessionData.forEach(session => {
      const type = session.session_type;
      sessionsByType[type] = (sessionsByType[type] || 0) + 1;
    });

    setStats({
      totalSessions,
      totalHours,
      averageRating,
      sessionsByType,
      recentSessions: sessionData.slice(0, 5),
    });
  };

  const addSession = async (sessionData: Omit<MentorshipSession, 'id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return { success: false, error: 'No user ID provided' };

    try {
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .insert({
          ...sessionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update user's mentorship hours in profiles table
      const updateColumn = sessionData.mentor_id === userId ? 'mentorship_hours' : null;
      if (updateColumn) {
        // Fetch current hours first
        const { data: profileData } = await supabase
          .from('profiles')
          .select(updateColumn)
          .eq('id', userId)
          .single();
        
        if (profileData) {
          const currentHours = profileData[updateColumn] || 0;
          await supabase
            .from('profiles')
            .update({
              [updateColumn]: currentHours + sessionData.duration_hours
            })
            .eq('id', userId);
        }
      }

      await fetchSessions();
      return { success: true, data };
    } catch (err) {
      console.error('Error adding mentorship session:', err);
      return { success: false, error: 'Failed to add session' };
    }
  };

  const updateSession = async (sessionId: string, updates: Partial<MentorshipSession>) => {
    try {
      const { error } = await supabase
        .from('mentorship_sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (error) throw error;

      await fetchSessions();
      return { success: true };
    } catch (err) {
      console.error('Error updating mentorship session:', err);
      return { success: false, error: 'Failed to update session' };
    }
  };

  const rateSession = async (sessionId: string, rating: number, isMentorRating: boolean) => {
    const updateField = isMentorRating ? 'mentor_rating' : 'mentee_rating';
    return updateSession(sessionId, { [updateField]: rating });
  };

  return {
    sessions,
    stats,
    loading,
    error,
    fetchSessions,
    addSession,
    updateSession,
    rateSession,
  };
};
