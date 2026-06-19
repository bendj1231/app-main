/**
 * useMentorshipTracking Hook
 * 
 * Tracks mentorship sessions, hours, and outcomes
 */

import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

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
  const { callApi } = useWorkerAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, role]);

  const fetchSessions = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      let data: Record<string, unknown>[] = [];

      if (role === 'mentor') {
        data = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'mentorship_sessions',
          operation: 'select',
          where: { mentor_id: userId },
          orderBy: 'session_date DESC',
          limit: 500,
        });
      } else if (role === 'mentee') {
        data = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'mentorship_sessions',
          operation: 'select',
          where: { mentee_id: userId },
          orderBy: 'session_date DESC',
          limit: 500,
        });
      } else {
        const data1 = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'mentorship_sessions',
          operation: 'select',
          where: { mentor_id: userId },
          orderBy: 'session_date DESC',
          limit: 500,
        });
        const data2 = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'mentorship_sessions',
          operation: 'select',
          where: { mentee_id: userId },
          orderBy: 'session_date DESC',
          limit: 500,
        });
        data = [...(data1 || []), ...(data2 || [])].filter(
          (r, i, arr) => arr.findIndex(x => x.id === r.id) === i
        );
      }

      setSessions(data as unknown as MentorshipSession[]);
      calculateStats(data as unknown as MentorshipSession[]);
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
      const newSession = await callApi<Record<string, unknown>>('queryTable', {
        table: 'mentorship_sessions',
        operation: 'insert',
        data: { ...sessionData },
      });

      // Update user's mentorship hours in profiles table
      const updateColumn = sessionData.mentor_id === userId ? 'mentorship_hours' : null;
      if (updateColumn) {
        const profile = await callApi<Record<string, unknown>>('getProfile', { id: userId });
        if (profile) {
          const currentHours = (profile[updateColumn] as number) || 0;
          await callApi('updateProfile', {
            id: userId,
            [updateColumn]: currentHours + sessionData.duration_hours,
          });
        }
      }

      await fetchSessions();
      return { success: true, data: newSession };
    } catch (err) {
      console.error('Error adding mentorship session:', err);
      return { success: false, error: 'Failed to add session' };
    }
  };

  const updateSession = async (sessionId: string, updates: Partial<MentorshipSession>) => {
    try {
      await callApi('queryTable', {
        table: 'mentorship_sessions',
        operation: 'update',
        id: sessionId,
        data: { ...updates },
      });

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
