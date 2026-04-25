/**
 * MentorshipAnalyticsDashboard Component
 * 
 * Displays comprehensive mentorship analytics for mentors
 */

import React from 'react';
import { Users, Clock, TrendingUp, Award, BarChart3, Star } from 'lucide-react';
import { MentorshipAnalytics } from '../src/hooks/useMentorshipAnalytics';

interface MentorshipAnalyticsDashboardProps {
  analytics: MentorshipAnalytics | null;
  loading?: boolean;
}

export const MentorshipAnalyticsDashboard: React.FC<MentorshipAnalyticsDashboardProps> = ({
  analytics,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No analytics data available</p>
      </div>
    );
  }

  const getImpactScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getImpactScoreLabel = (score: number) => {
    if (score >= 80) return 'Exceptional';
    if (score >= 60) return 'Strong';
    if (score >= 40) return 'Good';
    return 'Developing';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalMenteesHelped}</p>
          <p className="text-sm text-gray-600 mt-1">Mentees Helped</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalHoursContributed.toFixed(0)}</p>
          <p className="text-sm text-gray-600 mt-1">Hours Contributed</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">Average</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.averageSessionDuration.toFixed(1)}</p>
          <p className="text-sm text-gray-600 mt-1">Avg Session (hrs)</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs text-gray-500">Score</span>
          </div>
          <p className={`text-3xl font-bold ${getImpactScoreColor(analytics.impactScore)}`}>
            {analytics.impactScore}
          </p>
          <p className="text-sm text-gray-600 mt-1">{getImpactScoreLabel(analytics.impactScore)} Impact</p>
        </div>
      </div>

      {/* Sessions by Month Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sessions Over Time</h3>
        </div>
        {analytics.sessionsByMonth.length > 0 ? (
          <div className="space-y-3">
            {analytics.sessionsByMonth.slice(-6).map((month) => (
              <div key={month.month} className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-24">{month.month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{
                      width: `${(month.count / Math.max(...analytics.sessionsByMonth.map(m => m.count))) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-16 text-right">
                  {month.count} sessions
                </span>
                <span className="text-sm text-gray-500 w-16 text-right">
                  {month.hours.toFixed(1)}h
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No session data available</p>
        )}
      </div>

      {/* Mentee Progress */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Mentee Progress</h3>
        </div>
        {analytics.menteeProgress.length > 0 ? (
          <div className="space-y-4">
            {analytics.menteeProgress.slice(0, 5).map((mentee) => (
              <div key={mentee.menteeId} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{mentee.menteeName}</span>
                    <span className="text-sm text-gray-600">{mentee.sessions} sessions</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full transition-all"
                      style={{ width: `${mentee.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                  {mentee.progress.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No mentee progress data available</p>
        )}
      </div>

      {/* Top Topics & Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Topics */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Discussion Topics</h3>
          {analytics.topTopics.length > 0 ? (
            <div className="space-y-3">
              {analytics.topTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{topic.topic}</span>
                  <span className="text-sm font-medium text-gray-900">{topic.count} sessions</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No topic data available</p>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">Rating Distribution</h3>
          </div>
          {analytics.ratingDistribution.length > 0 ? (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const ratingData = analytics.ratingDistribution.find(r => r.rating === rating);
                const count = ratingData?.count || 0;
                const total = analytics.ratingDistribution.reduce((sum, r) => sum + r.count, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No rating data available</p>
          )}
        </div>
      </div>
    </div>
  );
};
