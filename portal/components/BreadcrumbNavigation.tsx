import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import styles from './BreadcrumbNavigation.module.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  onHomeClick?: () => void;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items,
  homeHref,
  onHomeClick
}) => {
  const allItems = [{ label: 'Home', href: homeHref, onClick: onHomeClick }, ...items];

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {allItems.map((item, index) => (
          <li key={index} className={styles.breadcrumbItem}>
            {index > 0 && (
              <ChevronRight className={styles.separator} size={16} />
            )}
            {index === 0 ? (
              <button
                className={styles.breadcrumbLink}
                onClick={item.onClick}
                aria-label="Home"
              >
                <Home size={16} />
              </button>
            ) : (
              <span className={styles.breadcrumbText}>
                {index === allItems.length - 1 ? (
                  <span className={styles.currentPage}>{item.label}</span>
                ) : (
                  <button
                    className={styles.breadcrumbLink}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                )}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
