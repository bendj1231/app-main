import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'medium', text, fullScreen = false }: LoadingSpinnerProps) {
  const sizeMap = {
    small: 20,
    medium: 32,
    large: 48,
  };

  const spinnerSize = sizeMap[size];

  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #ef4444',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      {text && (
        <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
          {text}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255,255,255,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}

interface SkeletonProps {
  count?: number;
  height?: number;
  width?: string | number;
}

export function Skeleton({ count = 1, height = 40, width = '100%' }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height,
            width,
            background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 6,
            marginBottom: count > 1 ? 12 : 0,
          }}
        />
      ))}
    </>
  );
}

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 1 }: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: 20,
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Skeleton height={20} width="60%" />
          <Skeleton height={14} width="40%" />
          <Skeleton height={14} width="80%" />
        </div>
      ))}
    </>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} height={16} width={`${100 / columns}%`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} style={{ display: 'flex', gap: 12, marginBottom: 12, padding: '12px 0' }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} height={14} width={`${100 / columns}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}

// Add CSS animations to global styles or inject here
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
if (!document.head.querySelector('#loading-animations')) {
  style.id = 'loading-animations';
  document.head.appendChild(style);
}
