import React from 'react';
import { ScoreBreakdown, getScoreTier, getNextMilestone } from '../lib/recognition-score';

interface RecognitionScoreProps {
  breakdown: ScoreBreakdown;
}

export function RecognitionScore({ breakdown }: RecognitionScoreProps) {
  const tier = getScoreTier(breakdown.total);
  const milestone = getNextMilestone(breakdown.total);
  
  // Calculate circumference for progress ring
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (breakdown.total / 100) * circumference;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recognition Score</h2>
        <p className="text-sm text-gray-500">Your currency for pathway access</p>
      </div>
      
      {/* Score Circle */}
      <div className="relative flex justify-center mb-6">
        <svg width="120" height="120" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={tier.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900">{breakdown.total}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      
      {/* Tier Badge */}
      <div className="text-center mb-6">
        <span 
          className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
          style={{ backgroundColor: tier.color + '30', color: '#1e293b', border: `2px solid ${tier.color}` }}
        >
          {tier.tier} Tier
        </span>
        <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
      </div>
      
      {/* Score Breakdown */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Score Breakdown</h3>
        
        <ScoreBar label="Flight Hours" value={breakdown.flightHours} max={25} color="#3b82f6" />
        <ScoreBar label="Licenses" value={breakdown.licenses} max={20} color="#10b981" />
        <ScoreBar label="Ratings" value={breakdown.ratings} max={15} color="#f59e0b" />
        <ScoreBar label="Training" value={breakdown.training} max={15} color="#8b5cf6" />
        <ScoreBar label="Verification" value={breakdown.verification} max={15} color="#ec4899" />
        <ScoreBar label="Mentorship" value={breakdown.mentorship} max={5} color="#06b6d4" />
        <ScoreBar label="Programs" value={breakdown.programs} max={5} color="#84cc16" />
      </div>
      
      {/* Next Milestone */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Next Milestone: {milestone.target} Points
        </h3>
        <p className="text-sm text-gray-600">{milestone.action}</p>
      </div>
      
      {/* Gaps to Close */}
      {breakdown.gaps.length > 0 && (
        <div className="bg-red-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-red-700 mb-2">Gaps to Close</h3>
          <ul className="space-y-2">
            {breakdown.gaps.slice(0, 3).map((gap: string, index: number) => (
              <li key={index} className="text-sm text-red-600 flex items-start">
                <span className="mr-2">•</span>
                {gap}
              </li>
            ))}
          </ul>
          {breakdown.gaps.length > 3 && (
            <p className="text-xs text-red-500 mt-2">
              +{breakdown.gaps.length - 3} more items...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreBar({ 
  label, 
  value, 
  max, 
  color 
}: { 
  label: string; 
  value: number; 
  max: number; 
  color: string;
}) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="flex items-center space-x-3">
      <span className="text-xs text-gray-600 w-20">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 w-12 text-right">
        {value}/{max}
      </span>
    </div>
  );
}
