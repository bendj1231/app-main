/**
 * RecognitionDashboard Component
 * 
 * Main dashboard component combining all recognition score features
 */

import React, { useEffect } from 'react';
import { useRecognitionScore } from '../src/hooks/useRecognitionScore';
import { RecognitionScoreDisplay } from './RecognitionScoreDisplay';
import { RecognitionScoreCard } from './RecognitionScoreCard';
import { LeaderboardTable } from './LeaderboardTable';
import { ScoreOptimizationGuide } from './ScoreOptimizationGuide';
import { PilotScoreInput, calculateRecognitionScore } from '../lib/pilot-recognition-score';

export const RecognitionDashboard: React.FC = () => {
  const {
    score,
    loading,
    error,
    leaderboard,
    rank,
    statistics,
    loadLeaderboard,
  } = useRecognitionScore();

  useEffect(() => {
    loadLeaderboard(50);
  }, [loadLeaderboard]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">Error loading recognition data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Pilot Recognition System</h1>
        <p className="text-blue-100">
          Track your progress, compare with peers, and optimize your recognition score
        </p>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecognitionScoreDisplay
            score={score ? calculateRecognitionScore({
              stats: {
                totalHours: score.breakdown.totalHours,
                picHours: score.breakdown.picHours,
                ifrHours: score.breakdown.ifrHours,
                nightHours: score.breakdown.nightHours,
              },
              experience: {
                years: score.breakdown.experienceYears,
                achievements: score.breakdown.achievementsCount,
                licenses: score.breakdown.licensesCount,
              },
              assessments: {
                programCompletion: score.breakdown.programCompletion,
                performanceScore: score.breakdown.performanceScore,
              },
              mentorship: {
                hours: score.breakdown.mentorshipHours,
                observations: score.breakdown.mentorshipObservations,
                cases: score.breakdown.mentorshipCases,
              },
            }) : null}
            loading={loading}
          />
        </div>
        <div>
          <RecognitionScoreCard
            score={score?.total_score || 0}
            tier={score?.score_tier}
            rank={rank}
            showRank={true}
          />
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Score</h3>
            <p className="text-3xl font-bold text-blue-600">{statistics.currentScore}</p>
            <p className="text-sm text-gray-500 mt-1">{statistics.scoreTier} Tier</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Rank</h3>
            <p className="text-3xl font-bold text-purple-600">#{statistics.rank}</p>
            <p className="text-sm text-gray-500 mt-1">Out of all pilots</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">90-Day Growth</h3>
            <p className={`text-3xl font-bold ${statistics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {statistics.growthRate >= 0 ? '+' : ''}{statistics.growthRate}
            </p>
            <p className="text-sm text-gray-500 mt-1">Points gained/lost</p>
          </div>
        </div>
      )}

      {/* Leaderboard and Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeaderboardTable
          leaderboard={leaderboard}
          loading={loading}
          currentUserRank={rank}
          currentUserScore={score?.total_score}
          showCurrentUser={true}
        />
        <ScoreOptimizationGuide
          currentScore={score ? calculateRecognitionScore({
            stats: {
              totalHours: score.breakdown.totalHours,
              picHours: score.breakdown.picHours,
              ifrHours: score.breakdown.ifrHours,
              nightHours: score.breakdown.nightHours,
            },
            experience: {
              years: score.breakdown.experienceYears,
              achievements: score.breakdown.achievementsCount,
              licenses: score.breakdown.licensesCount,
            },
            assessments: {
              programCompletion: score.breakdown.programCompletion,
              performanceScore: score.breakdown.performanceScore,
            },
            mentorship: {
              hours: score.breakdown.mentorshipHours,
              observations: score.breakdown.mentorshipObservations,
              cases: score.breakdown.mentorshipCases,
            },
          }) : null}
        />
      </div>
    </div>
  );
};
