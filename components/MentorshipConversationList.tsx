/**
 * MentorshipConversationList Component
 * 
 * Displays list of mentorship conversations
 */

import React from 'react';
import { User, Clock } from 'lucide-react';
import { Conversation } from '../src/hooks/useMentorshipMessaging';

interface MentorshipConversationListProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onSelectConversation: (requestId: string) => void;
  loading?: boolean;
}

export const MentorshipConversationList: React.FC<MentorshipConversationListProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  loading = false,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <User className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No conversations yet</p>
        <p className="text-gray-400 text-sm mt-1">Start a mentorship to begin messaging</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {conversations.map((conversation) => (
        <div
          key={conversation.request_id}
          onClick={() => onSelectConversation(conversation.request_id)}
          className={`flex items-start gap-3 p-4 cursor-pointer transition-colors border-b ${
            activeConversation === conversation.request_id
              ? 'bg-blue-50 border-l-4 border-l-blue-600'
              : 'hover:bg-gray-50 border-l-4 border-l-transparent'
          }`}
        >
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold"
            style={{
              background: conversation.other_user_image
                ? `url(${conversation.other_user_image}) center/cover`
                : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            }}
          >
            {!conversation.other_user_image &&
              conversation.other_user_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {conversation.other_user_name}
              </h3>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(conversation.last_message_time)}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate mb-1">
              {conversation.last_message}
            </p>
          </div>

          {/* Unread badge */}
          {conversation.unread_count > 0 && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full">
                {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
