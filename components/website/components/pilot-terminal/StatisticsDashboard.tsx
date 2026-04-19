'use client';

import { useState, useEffect } from 'react';
import { pilotTerminalClient } from '@/lib/pilot-terminal-client';

export default function StatisticsDashboard() {
  const [statistics, setStatistics] = useState<any>(null);
  const [retentionReport, setRetentionReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [stats, retention] = await Promise.all([
        pilotTerminalClient.getStatistics(),
        pilotTerminalClient.getRetentionReport()
      ]);
      setStatistics(stats);
      setRetentionReport(retention);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Statistics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Messages</p>
              <p className="text-3xl font-bold text-blue-600">{statistics?.totalMessages || 0}</p>
            </div>
            <div className="text-4xl">📨</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Data Entries</p>
              <p className="text-3xl font-bold text-green-600">{statistics?.totalDataEntries || 0}</p>
            </div>
            <div className="text-4xl">💾</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expired Entries</p>
              <p className="text-3xl font-bold text-orange-600">{statistics?.expiredEntries || 0}</p>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Subscriptions</p>
              <p className="text-3xl font-bold text-purple-600">{statistics?.activeSubscriptions || 0}</p>
            </div>
            <div className="text-4xl">🔔</div>
          </div>
        </div>
      </div>

      {/* Agent Activity Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Agent Activity Breakdown</h3>
        <div className="space-y-3">
          {statistics?.agentActivity && Object.entries(statistics.agentActivity).map(([agent, count]) => (
            <div key={agent} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{agent}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min((count as number) / (statistics.totalMessages || 1) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retention Report */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Data Retention Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Entries</p>
            <p className="text-2xl font-bold text-blue-600">{retentionReport?.totalEntries || 0}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Expired</p>
            <p className="text-2xl font-bold text-orange-600">{retentionReport?.expiredEntries || 0}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Expiring Soon</p>
            <p className="text-2xl font-bold text-yellow-600">{retentionReport?.expiringSoon || 0}</p>
          </div>
        </div>

        {retentionReport?.byTopic && Object.keys(retentionReport.byTopic).length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Entries by Topic</p>
            <div className="space-y-2">
              {Object.entries(retentionReport.byTopic).map(([topic, count]) => (
                <div key={topic} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{topic}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
