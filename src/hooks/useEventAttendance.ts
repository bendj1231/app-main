import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

export type EventType = 'webinar' | 'workshop' | 'conference' | 'meetup' | 'seminar';

export interface EventAttendance {
  id: string;
  user_id: string;
  event_id: string | null;
  event_title: string;
  event_type: EventType;
  attended_at: string;
  duration_hours: number;
  certificate_url: string | null;
  created_at: string;
}

export const useEventAttendance = (userId: string | null) => {
  const [events, setEvents] = useState<EventAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalEventHours, setTotalEventHours] = useState(0);
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (userId) {
      fetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchEvents = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'event_attendance',
        operation: 'select',
        where: { user_id: userId },
        orderBy: 'attended_at DESC',
        limit: 200,
      });

      setEvents((data || []) as unknown as EventAttendance[]);
      const total = (data || []).reduce((sum, e) => sum + ((e as Record<string, unknown>).duration_hours as number || 0), 0);
      setTotalEventHours(total);
    } catch (error) {
      console.error('Error in fetchEvents:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEventAttendance = async (
    eventId: string | null,
    eventTitle: string,
    eventType: EventType,
    attendedAt: string,
    durationHours: number,
    certificateUrl: string | null = null
  ) => {
    if (!userId) return null;

    try {
      const data = await callApi<Record<string, unknown>>('queryTable', {
        table: 'event_attendance',
        operation: 'insert',
        data: {
          user_id: userId,
          event_id: eventId,
          event_title: eventTitle,
          event_type: eventType,
          attended_at: attendedAt,
          duration_hours: durationHours,
          certificate_url: certificateUrl,
        },
      });

      await fetchEvents();
      return data as unknown as EventAttendance;
    } catch (error) {
      console.error('Error in addEventAttendance:', error);
      return null;
    }
  };

  const updateEventAttendance = async (
    eventId: string,
    durationHours?: number,
    certificateUrl?: string | null
  ) => {
    try {
      await callApi('queryTable', {
        table: 'event_attendance',
        operation: 'update',
        id: eventId,
        data: {
          duration_hours: durationHours,
          certificate_url: certificateUrl,
        },
      });

      if (userId) {
        await fetchEvents();
      }
      return true;
    } catch (error) {
      console.error('Error in updateEventAttendance:', error);
      return false;
    }
  };

  const deleteEventAttendance = async (eventId: string) => {
    try {
      await callApi('queryTable', {
        table: 'event_attendance',
        operation: 'delete',
        id: eventId,
      });

      if (userId) {
        await fetchEvents();
      }
      return true;
    } catch (error) {
      console.error('Error in deleteEventAttendance:', error);
      return false;
    }
  };

  const getEventsByType = (eventType: EventType) => {
    return events.filter(e => e.event_type === eventType);
  };

  return {
    events,
    totalEventHours,
    loading,
    fetchEvents,
    addEventAttendance,
    updateEventAttendance,
    deleteEventAttendance,
    getEventsByType,
  };
};
