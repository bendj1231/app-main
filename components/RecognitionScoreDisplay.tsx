/**
 * RecognitionScoreDisplay Component
 * 
 * Displays pilot recognition score with breakdown visualization
 */

import React from 'react';
import { getScoreColor, getScoreTier, ScoreBreakdown } from '../lib/pilot-recognition-score';

interface RecognitionScoreDisplayProps {
  score: ScoreBreakdown | null;
  loading?: boolean;
  showBreakdown?: boolean;
  showRecommendations?: boolean;
}

export const RecognitionScoreDisplay: React.FC<RecognitionScoreDisplayProps> = ({
  score,
  loading = false,
  showBreakdown = true,
  showRecommendations = true,
}) => {
  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-6">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">No score data available</p>
      </div>
    );
  }

  const scoreTier = getScoreTier(score.totalScore);
  const scoreColor = getScoreColor(score.totalScore);
  const scorePercentage = (score.totalScore / 1000) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Main Score Display */}
      <div className="text-center">
        <div className="inline-block relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={scoreColor}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - scorePercentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{score.totalScore}</span>
            <span
              className="text-sm font-semibold"
              style={{ color: scoreColor }}
            >
              {scoreTier}
            </span>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      {showBreakdown && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Score Breakdown</h3>
          
          <div className="space-y-3">
            {/* Hours Score */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Flight Hours</span>
                <span className="font-medium text-gray-900">{score.hoursScore}/350</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(score.hoursScore / 350) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {score.breakdown.totalHours} total hours ({score.breakdown.picHours} PIC)
              </p>
            </div>

            {/* Experience Score */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Experience</span>
                <span className="font-medium text-gray-900">{score.experienceScore}/250</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(score.experienceScore / 250) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {score.breakdown.experienceYears} years, {score.breakdown.achievementsCount} achievements
              </p>
            </div>

            {/* Assessment Score */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Assessments</span>
                <span className="font-medium text-gray-900">{score.assessmentScore}/250</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(score.assessmentScore / 250) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {score.breakdown.programCompletion}% completion, {score.breakdown.performanceScore} performance
              </p>
            </div>

            {/* Mentorship Score */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Mentorship</span>
                <span className="font-medium text-gray-900">{score.mentorshipScore}/150</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(score.mentorshipScore / 150) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {score.breakdown.mentorshipHours} hours, {score.breakdown.mentorshipObservations} observations
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {showRecommendations && score.recommendations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
          <ul className="space-y-2">
            {score.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
