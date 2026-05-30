export type DomainBrand = 'shortage' | 'recognition';

// Client-side domain detection for Vite/React Router
export function getDomainBrand(): DomainBrand {
  if (typeof window === 'undefined') return 'recognition';
  
  const domain = window.location.hostname;
  
  if (domain.includes('pilotshortage.org')) {
    return 'shortage';
  }
  
  return 'recognition';
}

export function getBrandConfig(brand: DomainBrand) {
  const configs = {
    shortage: {
      name: 'Pilot Shortage Association',
      tagline: 'Solving the Philippines Pilot Shortage',
      primaryColor: 'blue',
      accentColor: 'red',
      currency: 'PHP',
      price: '₱1,500',
      priceSubtext: '/year',
      ctaText: 'Join the Association',
      foundingMembers: true,
      region: 'Philippines',
      contactMethods: ['GCash', 'Bank Transfer'],
      showCommunity: true,
    },
    recognition: {
      name: 'Pilot Recognition',
      tagline: 'Global Pilot Career Platform',
      primaryColor: 'indigo',
      accentColor: 'amber',
      currency: 'USD',
      price: '$99',
      priceSubtext: '/year',
      ctaText: 'Get Recognized',
      foundingMembers: false,
      region: 'Global',
      contactMethods: ['Credit Card', 'PayPal'],
      showCommunity: false,
    },
  };
  
  return configs[brand];
}

// For client-side usage (navbar, etc)
export function getBrandFromLocalStorage(): DomainBrand {
  if (typeof window === 'undefined') return 'recognition';
  return (localStorage.getItem('brand_override') as DomainBrand) || 'recognition';
}

export function setBrandOverride(brand: DomainBrand) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('brand_override', brand);
    window.location.reload();
  }
}
