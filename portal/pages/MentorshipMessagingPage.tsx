/**
 * MentorshipMessagingPage Component
 * 
 * Main page for mentorship messaging with conversation list and message thread
 */

import React, { useState } from 'react';
import { Icons } from '../icons';
import { useMentorshipMessaging } from '../../src/hooks/useMentorshipMessaging';
import { MentorshipConversationList } from '../../components/MentorshipConversationList';
import { MentorshipMessageThread } from '../../components/MentorshipMessageThread';
import { MessageSquare, ArrowLeft } from 'lucide-react';

interface MentorshipMessagingPageProps {
  onBack: () => void;
  userProfile?: {
    id?: string;
    uid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
}

const Icon: React.FC<{ name: keyof typeof Icons; style?: React.CSSProperties }> = ({ name, style }) => {
  try {
    const IconComponent = Icons[name];
    if (IconComponent) {
      return <IconComponent style={style} />;
    }
  } catch (error) {
    console.warn(`Icon ${name} failed:`, error);
  }
  const fallbacks: Record<string, string> = {
    ArrowLeft: '←', ArrowRight: '→', Award: '🏆', CheckCircle: '✓',
    Activity: '📊', Clock: '⏱', BookOpen: '📖', FileText: '📄',
    ChevronRight: '›', TrendingUp: '📈', MessageSquare: '💬',
    Clipboard: '📋', Users: '👥'
  };
  return <span style={style}>{fallbacks[name] || '•'}</span>;
};

export const MentorshipMessagingPage: React.FC<MentorshipMessagingPageProps> = ({ onBack, userProfile }) => {
  const userId = userProfile?.id || userProfile?.uid;
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    fetchMessages,
    sendMessage,
    getTotalUnreadCount,
  } = useMentorshipMessaging(userId || null);

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const handleSelectConversation = (requestId: string) => {
    setSelectedConversationId(requestId);
    fetchMessages(requestId);
  };

  const handleSendMessage = async (message: string) => {
    if (selectedConversationId) {
      await sendMessage(selectedConversationId, message);
    }
  };

  const unreadCount = getTotalUnreadCount();

  return (
    <div className="dashboard-container animate-fade-in" style={{ backgroundColor: '#eef4fb', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '1rem 2rem',
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onBack}
            style={{
              padding: '0.5rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#475569'
            }}
          >
            <Icon name="ArrowLeft" style={{ width: 16, height: 16 }} />
            Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h1 style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a', fontWeight: 600 }}>
              Mentorship Messages
            </h1>
            {unreadCount > 0 && (
              <span style={{
                padding: '0.25rem 0.75rem',
                background: '#ef4444',
                color: 'white',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Conversation List */}
        <div style={{
          width: '350px',
          borderRight: '1px solid #e2e8f0',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1rem', margin: 0, color: '#64748b', fontWeight: 600 }}>
              Conversations
            </h2>
          </div>
          <MentorshipConversationList
            conversations={conversations}
            activeConversation={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            loading={loading}
          />
        </div>

        {/* Message Thread */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedConversationId ? (
            <MentorshipMessageThread
              messages={messages}
              currentUserId={userId || null}
              onSendMessage={handleSendMessage}
              loading={loading}
            />
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8fafc',
            }}>
              <div style={{ textAlign: 'center', color: '#64748b' }}>
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  Select a conversation
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
