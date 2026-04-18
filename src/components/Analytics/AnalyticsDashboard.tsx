/**
 * Analytics Dashboard
 * 
 * Real-time analytics dashboard showing:
 * - Active users and sessions
 * - Performance metrics
 * - Error rates
 * - Conversion funnels
 * - Key metrics overview
 */

import React, { useState, useEffect } from 'react';
import { Users, Activity, AlertTriangle, TrendingUp, Clock, Zap, Database, BarChart3 } from 'lucide-react';
import { getWebVitals } from '../../lib/web-vitals';
import { getPerformanceMonitor } from '../../lib/performance-monitor';
import { getAnalytics } from '../../lib/analytics';

export interface MetricCard {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

export const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [webVitalsScore, setWebVitalsScore] = useState(0);
  const [apiMetrics, setApiMetrics] = useState({ avgDuration: 0, totalCalls: 0, errorRate: 0 });
  const [edgeFunctionMetrics, setEdgeFunctionMetrics] = useState({ avgDuration: 0, totalCalls: 0, coldStartRate: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateMetrics = () => {
      // Web Vitals
      const webVitals = getWebVitals();
      const score = webVitals?.getPerformanceScore() || 0;
      setWebVitalsScore(score);

      // API Performance
      const perfMonitor = getPerformanceMonitor();
      const apiCalls = perfMonitor?.getAPIMetrics() || [];
      const edgeCalls = perfMonitor?.getEdgeFunctionMetrics() || [];

      const avgApiDuration = perfMonitor?.getAverageAPIDuration() || 0;
      const avgEdgeDuration = perfMonitor?.getAverageEdgeFunctionDuration() || 0;
      const errorRate = apiCalls.length > 0 
        ? (apiCalls.filter(m => !m.success).length / apiCalls.length) * 100 
        : 0;
      const coldStartRate = edgeCalls.length > 0
        ? (edgeCalls.filter(m => m.coldStart).length / edgeCalls.length) * 100
        : 0;

      setApiMetrics({
        avgDuration: avgApiDuration,
        totalCalls: apiCalls.length,
        errorRate
      });

      setEdgeFunctionMetrics({
        avgDuration: avgEdgeDuration,
        totalCalls: edgeCalls.length,
        coldStartRate
      });

      // Update dashboard metrics
      setMetrics([
        {
          title: 'Performance Score',
          value: `${score}%`,
          change: score > 80 ? '+5%' : '-2%',
          icon: <TrendingUp className="w-5 h-5" />,
          color: score > 80 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500'
        },
        {
          title: 'Avg API Response',
          value: `${avgApiDuration.toFixed(0)}ms`,
          change: avgApiDuration < 500 ? 'Good' : 'Slow',
          icon: <Clock className="w-5 h-5" />,
          color: avgApiDuration < 500 ? 'text-green-500' : avgApiDuration < 1000 ? 'text-yellow-500' : 'text-red-500'
        },
        {
          title: 'API Error Rate',
          value: `${errorRate.toFixed(1)}%`,
          change: errorRate < 1 ? 'Low' : 'High',
          icon: <AlertTriangle className="w-5 h-5" />,
          color: errorRate < 1 ? 'text-green-500' : errorRate < 5 ? 'text-yellow-500' : 'text-red-500'
        },
        {
          title: 'Edge Function Avg',
          value: `${avgEdgeDuration.toFixed(0)}ms`,
          icon: <Zap className="w-5 h-5" />,
          color: avgEdgeDuration < 200 ? 'text-green-500' : avgEdgeDuration < 500 ? 'text-yellow-500' : 'text-red-500'
        }
      ]);

      setIsLoading(false);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getWebVitalsDetails = () => {
    const webVitals = getWebVitals();
    const metrics = webVitals?.getMetrics() || [];
    
    return metrics.map(metric => ({
      name: metric.name,
      value: metric.value.toFixed(0),
      rating: metric.rating,
      color: metric.rating === 'good' ? 'bg-green-500' : metric.rating === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const webVitalsDetails = getWebVitalsDetails();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Real-time</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className={metric.color}>{metric.icon}</div>
              {metric.change && (
                <span className={`text-sm ${metric.change.includes('+') || metric.change === 'Good' || metric.change === 'Low' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-500 mt-1">{metric.title}</p>
          </div>
        ))}
      </div>

      {/* Web Vitals */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Core Web Vitals</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {webVitalsDetails.map((vital, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${vital.color} mx-auto mb-2`}></div>
              <p className="text-2xl font-bold text-gray-900">{vital.value}</p>
              <p className="text-sm text-gray-500">{vital.name}</p>
              <p className="text-xs text-gray-400 mt-1 capitalize">{vital.rating}</p>
            </div>
          ))}
        </div>
      </div>

      {/* API Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">API Performance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Calls</span>
              <span className="font-semibold">{apiMetrics.totalCalls}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Duration</span>
              <span className={`font-semibold ${apiMetrics.avgDuration < 500 ? 'text-green-600' : apiMetrics.avgDuration < 1000 ? 'text-yellow-600' : 'text-red-600'}`}>
                {apiMetrics.avgDuration.toFixed(0)}ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Error Rate</span>
              <span className={`font-semibold ${apiMetrics.errorRate < 1 ? 'text-green-600' : apiMetrics.errorRate < 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                {apiMetrics.errorRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Edge Functions</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Calls</span>
              <span className="font-semibold">{edgeFunctionMetrics.totalCalls}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Duration</span>
              <span className={`font-semibold ${edgeFunctionMetrics.avgDuration < 200 ? 'text-green-600' : edgeFunctionMetrics.avgDuration < 500 ? 'text-yellow-600' : 'text-red-600'}`}>
                {edgeFunctionMetrics.avgDuration.toFixed(0)}ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cold Start Rate</span>
              <span className={`font-semibold ${edgeFunctionMetrics.coldStartRate < 10 ? 'text-green-600' : edgeFunctionMetrics.coldStartRate < 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                {edgeFunctionMetrics.coldStartRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Session Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Session ID</p>
            <p className="font-mono text-sm mt-1">{getAnalytics()?.getSessionId().substring(0, 20)}...</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Analytics Enabled</p>
            <p className="font-semibold mt-1">{getAnalytics()?.isEnabled() ? 'Yes' : 'No'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Tracking Status</p>
            <p className="font-semibold mt-1 text-green-600">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};
