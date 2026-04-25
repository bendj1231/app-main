/**
 * MentorMatchingCard Component
 * 
 * Displays a potential mentor match with compatibility score and reasons
 */

import React from 'react';
import { User, MapPin, Clock, Award, Send } from 'lucide-react';
import { MentorMatch } from '../src/hooks/useMentorMatching';

interface MentorMatchingCardProps {
  match: MentorMatch;
  onRequestMentorship: (mentorId: string) => void;
  isPremium?: boolean;
}

export const MentorMatchingCard: React.FC<MentorMatchingCardProps> = ({
  match,
  onRequestMentorship,
  isPremium = false,
}) => {
  const { mentor, compatibilityScore, matchReasons } = match;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Potential Match';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header with score */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
            {mentor.full_name?.split(' ').map(n => n[0]).join('') || 'M'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{mentor.full_name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{mentor.total_flight_hours?.toFixed(0) || 0} hours</span>
            </div>
            {mentor.country && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{mentor.country}</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(compatibilityScore)}`}>
            <Award className="w-4 h-4" />
            {compatibilityScore.toFixed(0)}%
          </div>
          <p className="text-xs text-gray-500 mt-1">{getScoreLabel(compatibilityScore)}</p>
        </div>
      </div>

      {/* Mentor tier badge */}
      {mentor.mentor_tier && (
        <div className="mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
            mentor.mentor_tier === 'senior'
              ? 'bg-purple-100 text-purple-700'
              : mentor.mentor_tier === 'expert'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            <User className="w-3 h-3" />
            {mentor.mentor_tier.charAt(0).toUpperCase() + mentor.mentor_tier.slice(1)} Mentor
          </span>
        </div>
      )}

      {/* Match reasons */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Why this match?</h4>
        <ul className="space-y-1">
          {matchReasons.slice(0, 3).map((reason, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Expertise areas */}
      {mentor.aircraft_rated_on && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Aircraft Expertise</h4>
          <p className="text-sm text-gray-600">{mentor.aircraft_rated_on}</p>
        </div>
      )}

      {mentor.program_interests && mentor.program_interests.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Program Interests</h4>
          <div className="flex flex-wrap gap-2">
            {mentor.program_interests.slice(0, 3).map((interest, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mentorship stats */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Mentorship Hours</span>
          <span className="font-semibold text-gray-900">{mentor.mentorship_hours?.toFixed(0) || 0}h</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Endorsement Rating</span>
          <span className="font-semibold text-gray-900">{mentor.mentorship_endorsement?.toFixed(1) || 'N/A'}/5.0</span>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={() => onRequestMentorship(mentor.id)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        <Send className="w-4 h-4" />
        Request Mentorship
      </button>

      {/* Premium indicator */}
      {isPremium && compatibilityScore >= 80 && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            ⭐ Premium Priority Match
          </span>
        </div>
      )}
    </div>
  );
};
