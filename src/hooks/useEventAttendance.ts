import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    if (userId) {
      fetchEvents();
    }
  }, [userId]);

  const fetchEvents = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_attendance')
        .select('*')
        .eq('user_id', userId)
        .order('attended_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch events:', error);
      } else {
        setEvents(data || []);
        const total = (data || []).reduce((sum, e) => sum + (e.duration_hours || 0), 0);
        setTotalEventHours(total);
      }
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
      const { data, error } = await supabase
        .from('event_attendance')
        .insert({
          user_id: userId,
          event_id: eventId,
          event_title: eventTitle,
          event_type: eventType,
          attended_at: attendedAt,
          duration_hours: durationHours,
          certificate_url: certificateUrl,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to add event attendance:', error);
        return null;
      }

      await fetchEvents();
      return data;
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
      const { error } = await supabase
        .from('event_attendance')
        .update({
          duration_hours: durationHours,
          certificate_url: certificateUrl,
        })
        .eq('id', eventId);

      if (error) {
        console.error('Failed to update event attendance:', error);
        return false;
      }

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
      const { error } = await supabase
        .from('event_attendance')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Failed to delete event attendance:', error);
        return false;
      }

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
