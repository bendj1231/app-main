/**
 * useMentorshipMessaging Hook
 * 
 * Manages message threads between mentors and mentees
 */

import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

export interface MentorshipMessage {
  id: string;
  request_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: 'text' | 'system' | 'file';
  attachment_url?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface Conversation {
  request_id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_image?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const useMentorshipMessaging = (userId: string | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<MentorshipMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { callApi } = useWorkerAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchConversations = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      // Get all mentorship requests involving the user
      const requests = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'mentorship_requests',
        operation: 'select',
        where: { mentee_id: userId },
        orderBy: 'created_at DESC',
        limit: 200,
      });
      const requests2 = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'mentorship_requests',
        operation: 'select',
        where: { mentor_id: userId },
        orderBy: 'created_at DESC',
        limit: 200,
      });
      const allRequests = [...(requests || []), ...(requests2 || [])].filter(
        (r, i, arr) => arr.findIndex(x => x.id === r.id) === i
      ).filter(r => ['accepted', 'pending'].includes(r.status as string));

      // Build conversations from requests
      const conversationPromises = (allRequests || []).map(async (req) => {
        const request = req as Record<string, unknown>;
        const otherUserId = request.mentee_id === userId ? request.mentor_id : request.mentee_id;
        
        // Get other user's profile
        const otherUser = await callApi<Record<string, unknown>>('getProfile', { id: otherUserId });

        // Get last message
        const lastMessages = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'mentorship_messages',
          operation: 'select',
          where: { request_id: request.id },
          orderBy: 'created_at DESC',
          limit: 1,
        });
        const lastMessage = lastMessages?.[0];

        // Get unread count
        const unreadCount = await callApi<{ count: number }>('queryTable', {
          table: 'mentorship_messages',
          operation: 'count',
          where: { request_id: request.id, receiver_id: userId, is_read: false },
        });

        return {
          request_id: request.id,
          other_user_id: otherUserId,
          other_user_name: otherUser?.full_name || 'Unknown',
          other_user_image: otherUser?.profile_image_url,
          last_message: lastMessage?.message || 'No messages yet',
          last_message_time: lastMessage?.created_at || request.created_at,
          unread_count: unreadCount.count || 0,
        };
      });

      const fetchedConversations = await Promise.all(conversationPromises) as Conversation[];
      
      // Sort by last message time
      setConversations(
        fetchedConversations.sort((a, b) => 
          new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
        )
      );
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (requestId: string) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'mentorship_messages',
        operation: 'select',
        where: { request_id: requestId },
        orderBy: 'created_at ASC',
        limit: 500,
      });

      setMessages((data || []) as unknown as MentorshipMessage[]);
      setActiveConversation(requestId);

      // Mark messages as read
      await markMessagesAsRead(requestId);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (requestId: string, message: string, attachmentUrl?: string) => {
    if (!userId) return { success: false, error: 'No user ID provided' };

    try {
      // Get the request to determine receiver
      const requestRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'mentorship_requests',
        operation: 'select',
        where: { id: requestId },
        limit: 1,
      });
      const request = requestRows?.[0];

      if (!request) throw new Error('Request not found');

      const receiverId = request.mentee_id === userId ? request.mentor_id : request.mentee_id;

      await callApi('queryTable', {
        table: 'mentorship_messages',
        operation: 'insert',
        data: {
          request_id: requestId,
          sender_id: userId,
          receiver_id: receiverId,
          message,
          message_type: attachmentUrl ? 'file' : 'text',
          attachment_url: attachmentUrl,
        },
      });

      await fetchMessages(requestId);
      await fetchConversations();
      return { success: true };
    } catch (err) {
      console.error('Error sending message:', err);
      return { success: false, error: 'Failed to send message' };
    }
  };

  const markMessagesAsRead = async (requestId: string) => {
    if (!userId) return;

    try {
      // Get unread messages to mark as read
      const unreadMsgs = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'mentorship_messages',
        operation: 'select',
        where: { request_id: requestId, receiver_id: userId, is_read: false },
        limit: 100,
      });
      for (const msg of (unreadMsgs || [])) {
        await callApi('queryTable', {
          table: 'mentorship_messages',
          operation: 'update',
          id: msg.id,
          data: { is_read: true, read_at: new Date().toISOString() },
        });
      }

      await fetchConversations();
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const getTotalUnreadCount = () => {
    return conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
  };

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markMessagesAsRead,
    getTotalUnreadCount,
  };
};
