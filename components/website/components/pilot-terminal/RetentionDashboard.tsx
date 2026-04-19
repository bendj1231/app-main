'use client';

import { useState, useEffect } from 'react';
import { pilotTerminalClient } from '@/lib/pilot-terminal-client';

export default function RetentionDashboard() {
  const [retentionReport, setRetentionReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cleanupCount, setCleanupCount] = useState<number | null>(null);

  useEffect(() => {
    loadRetentionReport();
    const interval = setInterval(loadRetentionReport, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadRetentionReport = async () => {
    try {
      const report = await pilotTerminalClient.getRetentionReport();
      setRetentionReport(report);
    } catch (error) {
      console.error('Failed to load retention report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    try {
      const result = await pilotTerminalClient.cleanupExpiredData();
      setCleanupCount(result.cleaned);
      await loadRetentionReport();
    } catch (error) {
      console.error('Failed to cleanup expired data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const retentionRate = retentionReport?.totalEntries > 0
    ? ((retentionReport.expiredEntries / retentionReport.totalEntries) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Data Retention</h2>
        <button
          onClick={handleCleanup}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Cleanup Expired Data
        </button>
      </div>

      {cleanupCount !== null && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            ✅ Successfully cleaned up {cleanupCount} expired data entries
          </p>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Entries</p>
              <p className="text-3xl font-bold text-blue-600">{retentionReport?.totalEntries || 0}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expired</p>
              <p className="text-3xl font-bold text-orange-600">{retentionReport?.expiredEntries || 0}</p>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expiring Soon</p>
              <p className="text-3xl font-bold text-yellow-600">{retentionReport?.expiringSoon || 0}</p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>
      </div>

      {/* Retention Rate */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Retention Rate</h3>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Active
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {(100 - parseFloat(retentionRate)).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${100 - parseFloat(retentionRate)}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Entries by Topic */}
      {retentionReport?.byTopic && Object.keys(retentionReport.byTopic).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Entries by Topic</h3>
          <div className="space-y-3">
            {Object.entries(retentionReport.byTopic)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([topic, count]) => (
                <div key={topic} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{topic}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${Math.min((count as number) / (retentionReport.totalEntries || 1) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Entries by Source */}
      {retentionReport?.bySource && Object.keys(retentionReport.bySource).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Entries by Source (Agent)</h3>
          <div className="space-y-3">
            {Object.entries(retentionReport.bySource)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{source}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min((count as number) / (retentionReport.totalEntries || 1) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
