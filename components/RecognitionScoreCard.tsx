/**
 * RecognitionScoreCard Component
 * 
 * Compact card component for displaying recognition score
 */

import React, { useState } from 'react';
import { getScoreColor, getScoreTier } from '../lib/pilot-recognition-score';
import { Share2, Linkedin, Twitter, X } from 'lucide-react';

interface RecognitionScoreCardProps {
  score: number;
  tier?: string;
  rank?: number;
  showRank?: boolean;
  compact?: boolean;
  showShare?: boolean;
  onShare?: (platform: 'linkedin' | 'twitter') => void;
  loading?: boolean;
}

export const RecognitionScoreCard: React.FC<RecognitionScoreCardProps> = ({
  score,
  tier,
  rank,
  showRank = false,
  compact = false,
  showShare = false,
  onShare,
  loading = false,
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleShare = (platform: 'linkedin' | 'twitter') => {
    if (onShare) {
      onShare(platform);
    } else {
      // Default share behavior
      const text = `I've achieved a ${getScoreTier(score)} tier with ${score} points on the WingMentor Pilot Recognition System! 🛩️`;
      const url = window.location.href;
      
      if (platform === 'linkedin') {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
      } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      }
    }
    setShowShareMenu(false);
  };
  const scoreTier = tier || getScoreTier(score);
  const scoreColor = getScoreColor(score);
  const scorePercentage = (score / 1000) * 100;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-2">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: scoreColor + '20' }}
          >
            <span
              className="text-lg font-bold"
              style={{ color: scoreColor }}
            >
              {score}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{scoreTier}</p>
            <p className="text-xs text-gray-500">Recognition Score</p>
          </div>
        </div>
        {showRank && rank && (
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">#{rank}</p>
            <p className="text-xs text-gray-500">Rank</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recognition Score</h3>
        <div className="flex items-center gap-2">
          {showRank && rank && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              #{rank}
            </div>
          )}
          {showShare && (
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Share score"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[150px]">
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
                  >
                    <Twitter className="w-4 h-4 text-blue-400" />
                    Twitter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={scoreColor}
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - scorePercentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{score}</span>
          </div>
        </div>

        <div className="flex-1">
          <div
            className="inline-block px-4 py-2 rounded-lg text-lg font-bold mb-2"
            style={{ backgroundColor: scoreColor + '20', color: scoreColor }}
          >
            {scoreTier}
          </div>
          <p className="text-sm text-gray-600">
            {scorePercentage.toFixed(1)}% of maximum score
          </p>
        </div>
      </div>
    </div>
  );
};
