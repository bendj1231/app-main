import { useState, useEffect } from 'react';

export type ProductDomain = 'pilotrecognition' | 'careerpathways' | 'shortage' | 'wallet' | 'platform' | 'enterprise';

interface DomainConfig {
  domain: ProductDomain;
  isLocalDev: boolean;
  hostname: string;
}

export function useDomainDetection(): DomainConfig {
  const [config, setConfig] = useState<DomainConfig>(() => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    return detectDomain(hostname);
  });

  useEffect(() => {
    const hostname = window.location.hostname;
    setConfig(detectDomain(hostname));
  }, []);

  return config;
}

function detectDomain(hostname: string): DomainConfig {
  const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1';

  // Check for query param override in local dev
  if (isLocalDev && typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const productOverride = params.get('product');
    if (productOverride === 'careerpathways') {
      return { domain: 'careerpathways', isLocalDev: true, hostname };
    }
    if (productOverride === 'shortage') {
      return { domain: 'shortage', isLocalDev: true, hostname };
    }
    if (productOverride === 'wallet') {
      return { domain: 'wallet', isLocalDev: true, hostname };
    }
    if (productOverride === 'platform') {
      return { domain: 'platform', isLocalDev: true, hostname };
    }
    if (productOverride === 'enterprise') {
      return { domain: 'enterprise', isLocalDev: true, hostname };
    }
  }

  // Production domain detection
  if (hostname === 'careerpathways.pilotrecognition.com' || hostname === 'pilotcareerpathways.com' || hostname === 'www.pilotcareerpathways.com') {
    return { domain: 'careerpathways', isLocalDev, hostname };
  }

  if (hostname === 'pilotshortage.org' || hostname === 'www.pilotshortage.org') {
    return { domain: 'shortage', isLocalDev, hostname };
  }

  if (hostname === 'wallet.pilotrecognition.com') {
    return { domain: 'wallet', isLocalDev, hostname };
  }

  if (hostname === 'platform.pilotrecognition.com') {
    return { domain: 'platform', isLocalDev, hostname };
  }

  if (hostname === 'enterprise.pilotrecognition.com') {
    return { domain: 'enterprise', isLocalDev, hostname };
  }

  // Default to main pilotrecognition domain
  return { domain: 'pilotrecognition', isLocalDev, hostname };
}

export function isCareerPathwaysDomain(hostname: string): boolean {
  return hostname === 'careerpathways.pilotrecognition.com' || 
         hostname === 'pilotcareerpathways.com' || 
         hostname === 'www.pilotcareerpathways.com';
}
