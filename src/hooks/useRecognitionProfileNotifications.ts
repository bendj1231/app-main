/**
 * useRecognitionProfileNotifications Hook
 *
 * Provides real-time notification system for recognition profile updates
 */

import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

interface ScoreNotification {
  id: string;
  userId: string;
  oldScore: number;
  newScore: number;
  changeAmount: number;
  message: string;
  createdAt: string;
  read: boolean;
}

export const useRecognitionProfileNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<ScoreNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const data = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'score_notifications',
          operation: 'select',
          where: { user_id: userId },
          orderBy: 'created_at DESC',
          limit: 20,
        });

        setNotifications((data || []) as unknown as ScoreNotification[]);
        setUnreadCount(data?.filter((n: Record<string, unknown>) => !n.read).length || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      await callApi('queryTable', {
        table: 'score_notifications',
        operation: 'update',
        id: notificationId,
        data: { read: true },
      });

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      const unread = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'score_notifications',
        operation: 'select',
        where: { user_id: userId, read: false },
        limit: 100,
      });
      for (const msg of (unread || [])) {
        await callApi('queryTable', {
          table: 'score_notifications',
          operation: 'update',
          id: msg.id as string,
          data: { read: true },
        });
      }

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    requestNotificationPermission
  };
};
