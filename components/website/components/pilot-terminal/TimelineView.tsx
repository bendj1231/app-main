'use client';

import { useState, useEffect } from 'react';
import { pilotTerminalClient, PilotTerminalMessage } from '@/lib/pilot-terminal-client';

export default function TimelineView() {
  const [messages, setMessages] = useState<PilotTerminalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadTimeline();
    const interval = setInterval(loadTimeline, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadTimeline = async () => {
    try {
      const timeline = await pilotTerminalClient.getTimeline(50);
      setMessages(timeline);
    } catch (error) {
      console.error('Failed to load timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.content.topic.toLowerCase().includes(filter.toLowerCase()) ||
    msg.from.toLowerCase().includes(filter.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'data': return '📊';
      case 'query': return '🔍';
      case 'response': return '💬';
      case 'alert': return '⚠️';
      default: return '📌';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Timeline</h2>
        <input
          type="text"
          placeholder="Filter messages..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg w-64"
        />
      </div>

      <div className="space-y-3">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className="bg-white rounded-lg shadow p-4 border-l-4"
            style={{ borderLeftColor: message.priority === 'critical' ? '#ef4444' : '#3b82f6' }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getTypeIcon(message.type)}</span>
                <div>
                  <p className="font-semibold text-gray-900">{message.from}</p>
                  <p className="text-sm text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs text-white ${getPriorityColor(message.priority)}`}>
                  {message.priority}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {message.type}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Topic: {message.content.topic}</p>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                {JSON.stringify(message.content.data, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>No messages found</p>
        </div>
      )}
    </div>
  );
}
