'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

type DomainBrand = 'recognition' | 'shortage' | 'pilotterminal' | 'careerpathways';

// Dynamic imports to avoid path resolution issues
const ShortageLanding = dynamic(() => import('./shortage/ShortageLanding'), { ssr: false });
const PilotTerminalHome = dynamic(() => import('./pilotterminal/PilotTerminalHome'), { ssr: false });

export default function BrandSwitchWrapper() {
  const [brand, setBrand] = useState<DomainBrand>('recognition');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('brand_override') as DomainBrand | null;
    if (stored) setBrand(stored);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (brand === 'shortage') return <ShortageLanding />;
  if (brand === 'pilotterminal') return <PilotTerminalHome />;
  // Note: careerpathways renders PilotShortageUCF, which should be handled server-side

  return null;
}
