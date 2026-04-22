import React from 'react';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { PageTransition } from './PageTransition';
import styles from './PageLayout.module.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumbs?: boolean;
  maxWidth?: string;
  padding?: string;
  animation?: 'fade' | 'slide' | 'scale' | 'flip';
  headerActions?: React.ReactNode;
  onHomeClick?: () => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  breadcrumbs,
  showBreadcrumbs = true,
  maxWidth = '1200px',
  padding = '1rem',
  animation = 'fade',
  headerActions,
  onHomeClick
}) => {
  return (
    <div className={styles.pageLayout}>
      {/* Page Header */}
      {(title || subtitle || headerActions) && (
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              {title && <h1 className={styles.pageTitle}>{title}</h1>}
              {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
            </div>
            {headerActions && <div className={styles.headerRight}>{headerActions}</div>}
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      {showBreadcrumbs && breadcrumbs && breadcrumbs.length > 0 && (
        <BreadcrumbNavigation
          items={breadcrumbs}
          onHomeClick={onHomeClick}
        />
      )}

      {/* Page Content */}
      <div className={styles.pageContent} style={{ maxWidth, padding }}>
        <PageTransition animation={animation}>
          {children}
        </PageTransition>
      </div>
    </div>
  );
};
