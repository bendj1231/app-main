/**
 * LeaderboardTable Component
 * 
 * Displays leaderboard of pilots ranked by recognition score
 */

import React, { useState } from 'react';
import { getScoreColor } from '../lib/pilot-recognition-score';
import type { RecognitionScoreRecord } from '../services/recognition-score-service';

interface LeaderboardTableProps {
  leaderboard: RecognitionScoreRecord[];
  loading?: boolean;
  currentUserRank?: number;
  currentUserScore?: number;
  showCurrentUser?: boolean;
}

const TIER_ORDER = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Copper', 'Steel', 'Iron'];

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  leaderboard,
  loading = false,
  currentUserRank,
  currentUserScore,
  showCurrentUser = true,
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('All');

  const filteredLeaderboard =
    selectedTier === 'All'
      ? leaderboard
      : leaderboard.filter((entry) => entry.score_tier === selectedTier);

  const uniqueTiers = Array.from(
    new Set(leaderboard.map((entry) => entry.score_tier))
  ).sort((a, b) => TIER_ORDER.indexOf(a) - TIER_ORDER.indexOf(b));

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold text-gray-900">Leaderboard</h3>
        
        {/* Tier Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTier('All')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTier === 'All'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {uniqueTiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTier === tier
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={
                selectedTier === tier
                  ? { backgroundColor: getScoreColor(
                      tier === 'Platinum' ? 900 :
                      tier === 'Gold' ? 800 :
                      tier === 'Silver' ? 700 :
                      tier === 'Bronze' ? 600 :
                      tier === 'Copper' ? 500 :
                      tier === 'Steel' ? 400 : 300
                    )}
                  : {}
              }
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pilot</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tier</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.map((entry, index) => (
              <tr
                key={entry.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    {index < 3 && (
                      <span className="mr-2">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                      </span>
                    )}
                    <span className="font-medium text-gray-900">#{index + 1}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 overflow-hidden">
                      {/* Profile image would go here */}
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                        {(entry as any).profiles?.first_name?.[0] || 'P'}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {(entry as any).profiles?.first_name || 'Unknown'}{' '}
                        {(entry as any).profiles?.last_name || ''}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: getScoreColor(entry.total_score) + '20',
                      color: getScoreColor(entry.total_score),
                    }}
                  >
                    {entry.score_tier}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-bold text-gray-900">{entry.total_score}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Current User Row */}
      {showCurrentUser && currentUserRank && currentUserScore && (
        <div className="mt-4 pt-4 border-t-2 border-blue-200">
          <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-bold text-blue-900">#{currentUserRank}</span>
              <span className="text-sm font-medium text-blue-800">Your Rank</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-bold text-blue-900">{currentUserScore}</span>
              <span className="text-sm text-blue-600">points</span>
            </div>
          </div>
        </div>
      )}

      {filteredLeaderboard.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No pilots found in this tier
        </div>
      )}
    </div>
  );
};
