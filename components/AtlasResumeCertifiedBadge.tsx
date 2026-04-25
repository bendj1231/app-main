import React from 'react';
import { Award, Shield, CheckCircle } from 'lucide-react';

interface AtlasResumeCertifiedBadgeProps {
  certified: boolean;
  certificationDate?: Date;
  score?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'compact' | 'inline';
}

const AtlasResumeCertifiedBadge: React.FC<AtlasResumeCertifiedBadgeProps> = ({
  certified,
  certificationDate,
  score,
  size = 'medium',
  variant = 'default'
}) => {
  if (!certified) {
    return null;
  }

  const sizeClasses = {
    small: 'text-xs px-2 py-1 gap-1',
    medium: 'text-sm px-3 py-2 gap-2',
    large: 'text-base px-4 py-3 gap-2'
  };

  const iconSize = {
    small: 12,
    medium: 16,
    large: 20
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full ${sizeClasses[size]}`}>
        <Award size={iconSize[size]} />
        <span className="font-semibold">Atlas Certified</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-purple-700">
        <CheckCircle className="w-4 h-4" />
        <span className="font-medium">Atlas Résumé Certified</span>
        {certificationDate && (
          <span className="text-xs text-slate-500">
            ({certificationDate.toLocaleDateString()})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Award className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold">Atlas Résumé Certified</h3>
            <Shield className="w-4 h-4 text-yellow-300" />
          </div>
          <p className="text-xs text-white/80 mt-1">
            Industry-validated aviation resume format
          </p>
          {certificationDate && (
            <p className="text-xs text-white/70 mt-0.5">
              Certified: {certificationDate.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      {score !== undefined && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/80">Recognition Score</span>
            <span className="font-bold text-lg">{score}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtlasResumeCertifiedBadge;
