/**
 * MentorshipSessionCard Component
 * 
 * Displays a mentorship session with details and rating functionality
 */

import React, { useState } from 'react';
import { Calendar, Clock, Video, Users, Star, MessageSquare, CheckCircle } from 'lucide-react';
import { MentorshipSession } from '../src/hooks/useMentorshipTracking';

interface MentorshipSessionCardProps {
  session: MentorshipSession;
  isMentor: boolean;
  onRate?: (sessionId: string, rating: number) => void;
  onViewDetails?: (sessionId: string) => void;
}

export const MentorshipSessionCard: React.FC<MentorshipSessionCardProps> = ({
  session,
  isMentor,
  onRate,
  onViewDetails,
}) => {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'video_call':
        return <Video className="w-5 h-5" />;
      case 'in_person':
        return <Users className="w-5 h-5" />;
      case 'observation':
        return <CheckCircle className="w-5 h-5" />;
      case 'case_review':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getSessionTypeLabel = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleRatingSubmit = () => {
    if (rating > 0 && onRate) {
      onRate(session.id, rating);
      setShowRating(false);
    }
  };

  const currentRating = isMentor ? session.mentor_rating : session.mentee_rating;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            {getSessionTypeIcon(session.session_type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{session.topic || 'Mentorship Session'}</h3>
            <p className="text-sm text-gray-600">{getSessionTypeLabel(session.session_type)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{session.duration_hours}h</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(session.session_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Outcomes */}
      {session.outcomes && session.outcomes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Outcomes</h4>
          <ul className="space-y-1">
            {session.outcomes.slice(0, 3).map((outcome, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rating section */}
      <div className="border-t pt-4">
        {currentRating ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Your rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= currentRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900">{currentRating}/5</span>
          </div>
        ) : showRating ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rate this session:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRatingSubmit}
                disabled={rating === 0}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Rating
              </button>
              <button
                onClick={() => {
                  setShowRating(false);
                  setRating(0);
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowRating(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Rate Session
          </button>
        )}
      </div>

      {/* View details button */}
      {onViewDetails && session.notes && (
        <button
          onClick={() => onViewDetails(session.id)}
          className="mt-4 w-full text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded py-2 hover:bg-gray-50"
        >
          View Session Notes
        </button>
      )}
    </div>
  );
};
