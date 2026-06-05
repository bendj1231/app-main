'use client';

import { useState, useEffect, Suspense, lazy } from 'react';

type DomainBrand = 'recognition' | 'shortage' | 'pilotterminal' | 'careerpathways';

// Lazy load page components for Vite compatibility
const ShortageLanding = lazy(() => import('./shortage/ShortageLanding'));
const PilotTerminalHome = lazy(() => import('./pilotterminal/PilotTerminalHome'));

export default function BrandSwitchWrapper() {
  const [brand, setBrand] = useState<DomainBrand>('recognition');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('brand_override') as DomainBrand | null;
    if (stored) setBrand(stored);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (brand === 'shortage') return <Suspense fallback={null}><ShortageLanding /></Suspense>;
  if (brand === 'pilotterminal') return <Suspense fallback={null}><PilotTerminalHome /></Suspense>;
  // Note: careerpathways renders PilotShortageUCF, which should be handled server-side

  return null;
}
