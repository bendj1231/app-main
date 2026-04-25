/**
 * useMentorshipMessaging Hook
 * 
 * Manages message threads between mentors and mentees
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  const fetchConversations = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      // Get all mentorship requests involving the user
      const { data: requests, error: requestsError } = await supabase
        .from('mentorship_requests')
        .select('*')
        .or(`mentee_id.eq.${userId},mentor_id.eq.${userId}`)
        .in('status', ['accepted', 'pending']);

      if (requestsError) throw requestsError;

      // Build conversations from requests
      const conversationPromises = (requests || []).map(async (request) => {
        const otherUserId = request.mentee_id === userId ? request.mentor_id : request.mentee_id;
        
        // Get other user's profile
        const { data: otherUser } = await supabase
          .from('profiles')
          .select('full_name, profile_image_url')
          .eq('id', otherUserId)
          .single();

        // Get last message
        const { data: lastMessage } = await supabase
          .from('mentorship_messages')
          .select('message, created_at')
          .eq('request_id', request.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Get unread count
        const { count } = await supabase
          .from('mentorship_messages')
          .select('*', { count: 'exact', head: true })
          .eq('request_id', request.id)
          .eq('receiver_id', userId)
          .eq('is_read', false);

        return {
          request_id: request.id,
          other_user_id: otherUserId,
          other_user_name: otherUser?.full_name || 'Unknown',
          other_user_image: otherUser?.profile_image_url,
          last_message: lastMessage?.message || 'No messages yet',
          last_message_time: lastMessage?.created_at || request.created_at,
          unread_count: count || 0,
        };
      });

      const fetchedConversations = await Promise.all(conversationPromises);
      
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
      const { data, error } = await supabase
        .from('mentorship_messages')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
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
      const { data: request } = await supabase
        .from('mentorship_requests')
        .select('mentee_id, mentor_id')
        .eq('id', requestId)
        .single();

      if (!request) throw new Error('Request not found');

      const receiverId = request.mentee_id === userId ? request.mentor_id : request.mentee_id;

      const { error } = await supabase
        .from('mentorship_messages')
        .insert({
          request_id: requestId,
          sender_id: userId,
          receiver_id: receiverId,
          message,
          message_type: attachmentUrl ? 'file' : 'text',
          attachment_url: attachmentUrl,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

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
      const { error } = await supabase
        .from('mentorship_messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('request_id', requestId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) throw error;

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
