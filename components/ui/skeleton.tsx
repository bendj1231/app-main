import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circle' | 'text' | 'rect';
  width?: string;
  height?: string;
  count?: number;
}

/**
 * Skeleton component for displaying loading states
 * Used as a placeholder while content is loading
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'default',
  width,
  height,
  count = 1
}) => {
  const baseClasses = 'animate-pulse bg-slate-200 rounded';
  
  const variantClasses = {
    default: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded h-4',
    rect: 'rounded-lg'
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined)
  };

  const skeletons = Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
      role="presentation"
    />
  ));

  return <>{skeletons}</>;
};

/**
 * Card skeleton for loading card content
 */
export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton variant="circle" width="48px" height="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  );
};

/**
 * List skeleton for loading list items
 */
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200">
          <Skeleton variant="circle" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="30%" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Table skeleton for loading table content
 */
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full">
      <div className="flex gap-4 mb-4 pb-4 border-b border-slate-200">
        {Array.from({ length: cols }).map((_, index) => (
          <Skeleton key={index} variant="text" width="20%" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3 border-b border-slate-100">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width="15%" />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Profile skeleton for loading user profile
 */
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <Skeleton variant="circle" width="80px" height="80px" className="mb-4" />
      <Skeleton variant="text" width="40%" height="1.5rem" className="mb-2" />
      <Skeleton variant="text" width="30%" className="mb-6" />
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <Skeleton variant="text" width="60%" className="mb-2 mx-auto" />
          <Skeleton variant="text" width="40%" className="mx-auto" />
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <Skeleton variant="text" width="60%" className="mb-2 mx-auto" />
          <Skeleton variant="text" width="40%" className="mx-auto" />
        </div>
      </div>
    </div>
  );
};

/**
 * Form skeleton for loading form content
 */
export const FormSkeleton: React.FC<{ fieldCount?: number }> = ({ fieldCount = 4 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: fieldCount }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton variant="text" width="25%" height="1rem" />
          <Skeleton variant="rect" height="3rem" />
        </div>
      ))}
      <Skeleton variant="rect" width="30%" height="3rem" />
    </div>
  );
};

export default Skeleton;
