import React, { useEffect, useState } from 'react';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'flip';
  duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  animation = 'fade',
  duration = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => {
      setIsExiting(true);
    };
  }, []);

  const getAnimationClass = () => {
    if (isExiting) return styles.exiting;
    if (!isVisible) return styles.entering;
    return styles.visible;
  };

  const getAnimationType = () => {
    switch (animation) {
      case 'slide':
        return styles.slide;
      case 'scale':
        return styles.scale;
      case 'flip':
        return styles.flip;
      default:
        return styles.fade;
    }
  };

  return (
    <div
      className={`${styles.pageTransition} ${getAnimationClass()} ${getAnimationType()}`}
      style={{ animationDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};
