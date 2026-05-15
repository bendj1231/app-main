export interface RegionalPrice {
  currency: string;
  symbol: string;
  annual: number;
  monthly: number;
  semiAnnual: number;
  annualNote: string;
  locale: string;
}

export const REGIONAL_PRICING: Record<string, RegionalPrice> = {
  PH: {
    currency: 'PHP',
    symbol: '₱',
    annual: 10000,
    monthly: 950,
    semiAnnual: 5500,
    annualNote: 'Save ₱1,400/yr vs monthly',
    locale: 'fil-PH',
  },
  AE: {
    currency: 'AED',
    symbol: 'AED ',
    annual: 399,
    monthly: 45,
    semiAnnual: 220,
    annualNote: 'Save AED 141/yr vs monthly',
    locale: 'ar-AE',
  },
  SG: {
    currency: 'SGD',
    symbol: 'S$',
    annual: 149,
    monthly: 17,
    semiAnnual: 85,
    annualNote: 'Save S$55/yr vs monthly',
    locale: 'en-SG',
  },
  GB: {
    currency: 'GBP',
    symbol: '£',
    annual: 89,
    monthly: 10,
    semiAnnual: 50,
    annualNote: 'Save £31/yr vs monthly',
    locale: 'en-GB',
  },
  IN: {
    currency: 'INR',
    symbol: '₹',
    annual: 8999,
    monthly: 849,
    semiAnnual: 4799,
    annualNote: 'Save ₹1,189/yr vs monthly',
    locale: 'en-IN',
  },
  DEFAULT: {
    currency: 'USD',
    symbol: '$',
    annual: 99,
    monthly: 12,
    semiAnnual: 60,
    annualNote: 'Save $45/yr vs monthly',
    locale: 'en-US',
  },
};

export function detectRegionalPricing(): RegionalPrice & { countryCode: string } {
  // Primary: use the IP-detected country code cached by TopNavbar (ipapi.co)
  try {
    const cached = localStorage.getItem('cachedCountryCode');
    if (cached && REGIONAL_PRICING[cached]) {
      return { ...REGIONAL_PRICING[cached], countryCode: cached };
    }
  } catch {}
  return { ...REGIONAL_PRICING.DEFAULT, countryCode: 'US' };
}

export function formatPrice(symbol: string, amount: number): string {
  return `${symbol}${amount.toLocaleString()}`;
}
