import React from 'react';
import { Target } from 'lucide-react';

interface ProbabilityBadgeProps {
  probability: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ProbabilityBadge: React.FC<ProbabilityBadgeProps> = ({ 
  probability, 
  size = 'md' 
}) => {
  const getColor = (p: number) => {
    if (p >= 85) return 'from-emerald-500 to-emerald-400';
    if (p >= 70) return 'from-blue-500 to-blue-400';
    if (p >= 50) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${getColor(probability)} ${sizeClasses[size]} font-semibold text-white shadow-lg`}>
      <Target className="w-3.5 h-3.5" />
      {probability}% Match
    </div>
  );
};
