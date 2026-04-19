'use client';

import { useState, useEffect } from 'react';
import { pilotTerminalClient } from '@/lib/pilot-terminal-client';

const AGENTS = [
  'enrollment@pilotterminal.com',
  'pathways@pilotterminal.com',
  'demand@pilotterminal.com',
  'matching@pilotterminal.com',
  'coaching@pilotterminal.com',
  'social@pilotterminal.com'
];

export default function AgentActivity() {
  const [activities, setActivities] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentActivities();
    const interval = setInterval(loadAgentActivities, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadAgentActivities = async () => {
    try {
      const activityMap = new Map();
      for (const agent of AGENTS) {
        try {
          const activity = await pilotTerminalClient.getAgentActivity(agent);
          activityMap.set(agent, activity);
        } catch (error) {
          console.error(`Failed to load activity for ${agent}:`, error);
          activityMap.set(agent, {
            messageCount: 0,
            dataEntries: 0,
            lastActivity: 'Never',
            topics: []
          });
        }
      }
      setActivities(activityMap);
    } catch (error) {
      console.error('Failed to load agent activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAgentDisplayName = (agent: string) => {
    return agent.split('@')[0];
  };

  const getAgentColor = (agent: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    const index = AGENTS.indexOf(agent);
    return colors[index % colors.length];
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
      <h2 className="text-2xl font-bold mb-6">Agent Activity</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((agent) => {
          const activity = activities.get(agent);
          return (
            <div key={agent} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${getAgentColor(agent)} flex items-center justify-center text-white font-bold`}>
                  {getAgentDisplayName(agent).substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{getAgentDisplayName(agent)}</h3>
                  <p className="text-sm text-gray-500">{agent}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Messages:</span>
                  <span className="font-semibold">{activity?.messageCount || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Data Entries:</span>
                  <span className="font-semibold">{activity?.dataEntries || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Activity:</span>
                  <span className="font-semibold text-sm">
                    {activity?.lastActivity === 'Never' 
                      ? 'Never' 
                      : new Date(activity?.lastActivity).toLocaleString()}
                  </span>
                </div>
              </div>

              {activity?.topics && activity.topics.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">Subscribed Topics:</p>
                  <div className="flex flex-wrap gap-1">
                    {activity.topics.map((topic: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
