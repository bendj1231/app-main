import React from 'react';
import styles from './SkeletonLoader.module.css';

interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'text' | 'avatar' | 'button';
  count?: number;
  height?: string;
  width?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'text',
  count = 1,
  height,
  width
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={styles.skeletonCard}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonText} />
              <div className={styles.skeletonTextShort} />
            </div>
          </div>
        );
      case 'list':
        return (
          <div className={styles.skeletonListItem}>
            <div className={styles.skeletonAvatar} />
            <div className={styles.skeletonListItemText}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonText} />
            </div>
          </div>
        );
      case 'avatar':
        return <div className={styles.skeletonAvatar} />;
      case 'button':
        return <div className={styles.skeletonButton} />;
      default:
        return (
          <div
            className={styles.skeletonText}
            style={{ height: height || '16px', width: width || '100%' }}
          />
        );
    }
  };

  return (
    <div className={styles.skeletonContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ height?: string }> = ({ height }) => (
  <div className={styles.skeletonCard} style={{ height }}>
    <div className={styles.skeletonImage} />
    <div className={styles.skeletonContent}>
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonText} />
      <div className={styles.skeletonTextShort} />
    </div>
  </div>
);
