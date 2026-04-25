/**
 * Job Shortage Notifications Component
 * 
 * Displays job shortage alerts and notifications including:
 * - Real-time job shortage alerts
 * - Regional shortage notifications
 * - Role-specific opportunities
 * - Hiring surge alerts
 * - Salary spike notifications
 */

import React, { useState, useEffect } from 'react';

interface JobShortageAlert {
  alertId: string;
  type: 'shortage' | 'surplus' | 'opportunity' | 'salary_spike' | 'hiring_surge';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  region: string;
  role: string;
  impact: string;
  timeframe: string;
  recommendedActions: string[];
  timestamp: string;
}

export const JobShortageNotifications: React.FC = () => {
  const [alerts, setAlerts] = useState<JobShortageAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'shortage' | 'opportunity' | 'salary_spike'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      // In production, this would call the API
      // const response = await fetch('/api/jobs/alerts');
      // const data = await response.json();
      
      // For now, use mock data
      const mockAlerts: JobShortageAlert[] = [
        {
          alertId: '1',
          type: 'shortage',
          severity: 'critical',
          title: 'Critical Pilot Shortage: Asia Pacific',
          description: 'Severe pilot shortage detected in Asia Pacific. Multiple airlines reporting hiring challenges.',
          region: 'Asia Pacific',
          role: 'Multiple',
          impact: 'Increased hiring competition, higher salary offers, faster career progression',
          timeframe: '6-12 months',
          recommendedActions: [
            'Update resume and ATLAS profile',
            'Apply to airlines in the region',
            'Consider relocation for better opportunities',
            'Highlight relevant experience for region'
          ],
          timestamp: new Date().toISOString()
        },
        {
          alertId: '2',
          type: 'hiring_surge',
          severity: 'high',
          title: 'Hiring Surge: Major Asian Carrier',
          description: 'Major Asian Carrier is hiring 500 pilots in Next 6 months',
          region: 'Asia Pacific',
          role: 'Multiple',
          impact: 'Excellent opportunity window',
          timeframe: 'Next 6 months',
          recommendedActions: [
            'Apply immediately',
            'Prepare for interviews',
            'Ensure documentation is current'
          ],
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          alertId: '3',
          type: 'salary_spike',
          severity: 'high',
          title: 'Salary Spike Alert: Captain (Airline)',
          description: 'Salaries for Captain (Airline) in Asia Pacific increased by 20% due to Severe pilot shortage',
          region: 'Asia Pacific',
          role: 'Captain (Airline)',
          impact: 'Higher earning potential',
          timeframe: 'Immediate',
          recommendedActions: [
            'Negotiate salary if employed in region',
            'Consider relocation for higher pay',
            'Update salary expectations'
          ],
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
          alertId: '4',
          type: 'opportunity',
          severity: 'medium',
          title: 'eVTOL Pilot Opportunities',
          description: 'Urban air mobility companies beginning to hire pilots',
          region: 'Global',
          role: 'Emerging',
          impact: 'First-mover advantage in new markets',
          timeframe: '1-2 years',
          recommendedActions: [
            'Research the opportunity',
            'Consider relevant training',
            'Network with industry leaders'
          ],
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          alertId: '5',
          type: 'shortage',
          severity: 'high',
          title: 'Captain (Airline) Shortage Alert',
          description: 'High demand for experienced Captains, especially in Asia Pacific and Middle East',
          region: 'Global',
          role: 'Captain (Airline)',
          impact: 'Premium salary packages, signing bonuses',
          timeframe: 'Ongoing',
          recommendedActions: [
            'Consider international opportunities',
            'Update leadership experience',
            'Apply to expanding airlines'
          ],
          timestamp: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter !== 'all' && alert.type !== filter) return false;
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'shortage': return '⚠️';
      case 'opportunity': return '🚀';
      case 'salary_spike': return '💰';
      case 'hiring_surge': return '📈';
      case 'surplus': return '📉';
      default: return 'ℹ️';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading job shortage notifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Job Shortage Notifications</h2>
        <p className="text-orange-100">Real-time alerts about job opportunities and market shortages</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              <option value="shortage">Shortages</option>
              <option value="opportunity">Opportunities</option>
              <option value="salary_spike">Salary Spikes</option>
              <option value="hiring_surge">Hiring Surges</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="ml-auto flex items-end">
            <button
              onClick={fetchAlerts}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Alert Count */}
      <div className="flex items-center justify-between">
        <span className="text-gray-600">
          Showing {filteredAlerts.length} of {alerts.length} alerts
        </span>
        <span className="text-sm text-gray-500">
          Last updated: {formatTimestamp(alerts[0]?.timestamp || new Date().toISOString())}
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No alerts match your filters
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.alertId} className="bg-white rounded-lg shadow border-l-4 border-orange-500">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(alert.type)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">{alert.region}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{formatTimestamp(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{alert.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">Impact</span>
                    <p className="text-sm text-gray-800">{alert.impact}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">Timeframe</span>
                    <p className="text-sm text-gray-800">{alert.timeframe}</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Recommended Actions</span>
                  <ul className="space-y-1">
                    {alert.recommendedActions.map((action, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity Threshold</label>
            <select className="border rounded-lg px-3 py-2 text-sm w-full">
              <option>All Severities</option>
              <option>High and Critical Only</option>
              <option>Critical Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notification Frequency</label>
            <select className="border rounded-lg px-3 py-2 text-sm w-full">
              <option>Immediate</option>
              <option>Daily Digest</option>
              <option>Weekly Summary</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notification Channels</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Email</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Push Notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">SMS</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">In-App</span>
            </label>
          </div>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          Save Preferences
        </button>
      </div>
    </div>
  );
};
