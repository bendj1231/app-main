/**
 * AI Coaching Dashboard Component
 * 
 * Comprehensive dashboard integrating all AI coaching features:
 * - Market Intelligence Dashboard
 * - Job Shortage Notifications
 * - Pathway Recommendations
 * - AI Coaching Session Launcher
 * - Coaching Insights Summary
 * - Subscription Gating
 * - Notification Badges
 */

import React, { useState, useEffect } from 'react';
import { Brain, Bell, TrendingUp, Target, Crown, Lock, Play, History, Sparkles } from 'lucide-react';
import { MarketIntelligenceDashboard } from './MarketIntelligenceDashboard';
import { JobShortageNotifications } from './JobShortageNotifications';

interface AICoachingDashboardProps {
  userId?: string;
  isPremium?: boolean;
  pilotProfile?: any;
  pathways?: any[];
}

interface CoachingSession {
  sessionId: string;
  timestamp: string;
  type: 'comprehensive' | 'pathway' | 'score' | 'career_pivot';
  confidence: number;
  summary: string;
}

export const AICoachingDashboard: React.FC<AICoachingDashboardProps> = ({
  userId,
  isPremium = false,
  pilotProfile,
  pathways = [],
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'market' | 'jobs' | 'pathways' | 'history'>('overview');
  const [coachingHistory, setCoachingHistory] = useState<CoachingSession[]>([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [showSessionLauncher, setShowSessionLauncher] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      loadCoachingHistory();
      loadUnreadAlerts();
    }
  }, [userId]);

  const loadCoachingHistory = async () => {
    try {
      const response = await fetch(`/api/coaching/history/${userId}`);
      const data = await response.json();
      if (data.success) {
        setCoachingHistory(data.data.sessions || []);
      }
    } catch (error) {
      console.error('Failed to load coaching history:', error);
    }
  };

  const loadUnreadAlerts = async () => {
    try {
      const response = await fetch(`/api/notifications/history/${userId}`);
      const data = await response.json();
      if (data.success) {
        setUnreadAlerts(data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to load unread alerts:', error);
    }
  };

  const startCoachingSession = async (type: 'comprehensive' | 'pathway' | 'score' | 'career_pivot') => {
    if (!isPremium) {
      alert('Upgrade to Premium to access AI coaching sessions');
      return;
    }

    setLoadingSession(true);
    try {
      const response = await fetch('/api/coaching/comprehensive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilotId: userId,
          profile: pilotProfile || {},
        }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentSession(data.data);
        setShowSessionLauncher(false);
        // Add to history
        const newSession: CoachingSession = {
          sessionId: data.data.sessionId,
          timestamp: new Date().toISOString(),
          type,
          confidence: data.data.confidenceScore,
          summary: 'Comprehensive coaching session completed',
        };
        setCoachingHistory([newSession, ...coachingHistory]);
      }
    } catch (error) {
      console.error('Failed to start coaching session:', error);
    } finally {
      setLoadingSession(false);
    }
  };

  const getCoachingInsights = () => {
    if (!coachingHistory.length) return null;

    const latestSession = coachingHistory[0];
    const avgConfidence = coachingHistory.reduce((sum, s) => sum + s.confidence, 0) / coachingHistory.length;

    return {
      latestSession,
      avgConfidence: Math.round(avgConfidence),
      totalSessions: coachingHistory.length,
      trend: coachingHistory.length > 1 ? 'improving' : 'stable',
    };
  };

  const insights = getCoachingInsights();

  return (
    <div className="space-y-6">
      {/* Header with Subscription Gating */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain size={32} />
            <div>
              <h1 className="text-3xl font-bold">AI Career Coaching</h1>
              <p className="text-violet-100">
                Personalized AI-powered career guidance and market intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Badge */}
            <div className="relative">
              <Bell size={24} />
              {unreadAlerts > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </div>
            {!isPremium && (
              <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                <Crown size={20} />
                <span>Upgrade</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Premium Upsell Banner */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-900">Unlock Full AI Coaching Features</p>
                <p className="text-sm text-amber-700">
                  Get personalized career guidance, market intelligence, and job alerts for $100/year
                </p>
              </div>
            </div>
            <button className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Coaching Insights Summary (Premium) */}
      {isPremium && insights && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-violet-500">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-violet-600" />
              <span className="text-sm text-gray-600">Total Sessions</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{insights.totalSessions}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-emerald-500">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-emerald-600" />
              <span className="text-sm text-gray-600">Avg Confidence</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{insights.avgConfidence}%</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <Target size={20} className="text-blue-600" />
              <span className="text-sm text-gray-600">Latest Type</span>
            </div>
            <p className="text-lg font-bold text-gray-900 capitalize">{insights.latestSession.type.replace('_', ' ')}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <History size={20} className="text-purple-600" />
              <span className="text-sm text-gray-600">Trend</span>
            </div>
            <p className="text-lg font-bold text-gray-900 capitalize">{insights.trend}</p>
          </div>
        </div>
      )}

      {/* AI Coaching Session Launcher */}
      {isPremium && (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <Play size={24} />
                Start AI Coaching Session
              </h2>
              <p className="text-blue-100">
                Get personalized career guidance, pathway recommendations, and score optimization advice
              </p>
            </div>
            <button
              onClick={() => setShowSessionLauncher(!showSessionLauncher)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {showSessionLauncher ? 'Close' : 'Start Session'}
            </button>
          </div>

          {showSessionLauncher && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => startCoachingSession('comprehensive')}
                disabled={loadingSession}
                className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-left transition-colors disabled:opacity-50"
              >
                <Brain size={24} className="mb-2" />
                <h3 className="font-semibold mb-1">Comprehensive</h3>
                <p className="text-sm text-blue-100">Full career analysis</p>
              </button>
              <button
                onClick={() => startCoachingSession('pathway')}
                disabled={loadingSession}
                className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-left transition-colors disabled:opacity-50"
              >
                <Target size={24} className="mb-2" />
                <h3 className="font-semibold mb-1">Pathway Match</h3>
                <p className="text-sm text-blue-100">Best career pathways</p>
              </button>
              <button
                onClick={() => startCoachingSession('score')}
                disabled={loadingSession}
                className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-left transition-colors disabled:opacity-50"
              >
                <TrendingUp size={24} className="mb-2" />
                <h3 className="font-semibold mb-1">Score Boost</h3>
                <p className="text-sm text-blue-100">Optimize your score</p>
              </button>
              <button
                onClick={() => startCoachingSession('career_pivot')}
                disabled={loadingSession}
                className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-left transition-colors disabled:opacity-50"
              >
                <Sparkles size={24} className="mb-2" />
                <h3 className="font-semibold mb-1">Career Pivot</h3>
                <p className="text-sm text-blue-100">New opportunities</p>
              </button>
            </div>
          )}

          {loadingSession && (
            <div className="mt-6 flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Generating AI insights...</span>
            </div>
          )}

          {currentSession && (
            <div className="mt-6 bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Latest Session Results</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-200">Confidence:</span> {currentSession.confidenceScore}%
                </div>
                <div>
                  <span className="text-blue-200">Generated:</span> {new Date(currentSession.generatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-violet-500 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'market'
                ? 'border-violet-500 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Market Intelligence
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'jobs'
                ? 'border-violet-500 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Job Alerts
            {unreadAlerts > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {unreadAlerts}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('pathways')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pathways'
                ? 'border-violet-500 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pathway Recommendations
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-violet-500 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Coaching History
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="text-orange-500" size={24} />
                <h3 className="font-semibold">Job Alerts</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{unreadAlerts}</p>
              <p className="text-sm text-gray-500 mt-1">Unmatched opportunities</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-emerald-500" size={24} />
                <h3 className="font-semibold">Market Health</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">78%</p>
              <p className="text-sm text-gray-500 mt-1">Overall market score</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="text-blue-500" size={24} />
                <h3 className="font-semibold">Pathway Matches</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{pathways.length}</p>
              <p className="text-sm text-gray-500 mt-1">Available pathways</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4">Recent AI Coaching Activity</h3>
            {coachingHistory.length > 0 ? (
              <div className="space-y-3">
                {coachingHistory.slice(0, 5).map((session) => (
                  <div key={session.sessionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Brain className="text-violet-600" size={20} />
                      <div>
                        <p className="font-medium capitalize">{session.type.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-500">{new Date(session.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{session.confidence}%</p>
                      <p className="text-xs text-gray-500">confidence</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No coaching sessions yet. Start your first session!</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'market' && (
        <div>
          {isPremium ? (
            <MarketIntelligenceDashboard />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-6">
                Upgrade to access real-time market intelligence, salary trends, and industry insights
              </p>
              <button className="bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors">
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'jobs' && (
        <div>
          {isPremium ? (
            <JobShortageNotifications />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-6">
                Upgrade to access real-time job shortage alerts and opportunity notifications
              </p>
              <button className="bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors">
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pathways' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold mb-4">AI-Powered Pathway Recommendations</h3>
          {isPremium ? (
            <div className="space-y-4">
              {pathways.slice(0, 5).map((pathway: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{pathway.title || pathway.name || 'Pathway'}</h4>
                    <p className="text-sm text-gray-600">{pathway.match || pathway.description || 'Great match for your profile'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-violet-600">{pathway.match || pathway.pr || '85'}%</p>
                    <p className="text-xs text-gray-500">match score</p>
                  </div>
                </div>
              ))}
              {pathways.length === 0 && (
                <p className="text-gray-500 text-center py-4">Load your pathway data to see AI recommendations</p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-6">
                Upgrade to access AI-powered pathway recommendations and career matching
              </p>
              <button className="bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors">
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold mb-4">Coaching Session History</h3>
          {coachingHistory.length > 0 ? (
            <div className="space-y-3">
              {coachingHistory.map((session) => (
                <div key={session.sessionId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Brain className="text-violet-600" size={20} />
                      <span className="font-medium capitalize">{session.type.replace('_', ' ')}</span>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(session.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{session.summary}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">Confidence: {session.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No coaching history yet. Start your first session!</p>
          )}
        </div>
      )}
    </div>
  );
};
