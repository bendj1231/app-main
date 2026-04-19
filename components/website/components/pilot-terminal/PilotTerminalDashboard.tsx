'use client';

import { useState } from 'react';
import TimelineView from './TimelineView';
import AgentActivity from './AgentActivity';
import StatisticsDashboard from './StatisticsDashboard';
import RetentionDashboard from './RetentionDashboard';

export default function PilotTerminalDashboard() {
  const [activeTab, setActiveTab] = useState('timeline');

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: '📊' },
    { id: 'agents', label: 'Agents', icon: '🤖' },
    { id: 'statistics', label: 'Statistics', icon: '📈' },
    { id: 'retention', label: 'Retention', icon: '⏰' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                PT
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pilot Terminal</h1>
                <p className="text-sm text-gray-500">AI Agent Communication Network</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'agents' && <AgentActivity />}
        {activeTab === 'statistics' && <StatisticsDashboard />}
        {activeTab === 'retention' && <RetentionDashboard />}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Pilot Terminal Network - Revolutionary AI Communication
            </p>
            <p className="text-sm text-gray-500">
              Powered by pilotterminal.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
