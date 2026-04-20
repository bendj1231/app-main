import React from 'react';

interface NavigationItem {
  name: string;
  url: string;
}

interface NavigationSchemaProps {
  items: NavigationItem[];
  siteName: string;
  siteUrl: string;
}

export const NavigationSchema: React.FC<NavigationSchemaProps> = ({ items, siteName, siteUrl }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: siteName,
    url: siteUrl,
    hasPart: items.map((item) => ({
      '@type': 'SiteNavigationElement',
      name: item.name,
      url: `${siteUrl}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
