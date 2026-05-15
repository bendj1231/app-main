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

const LOCALE_TO_COUNTRY: Record<string, string> = {
  'fil': 'PH',
  'fil-PH': 'PH',
  'en-PH': 'PH',
  'ar-AE': 'AE',
  'en-AE': 'AE',
  'en-SG': 'SG',
  'zh-SG': 'SG',
  'en-GB': 'GB',
  'en-IN': 'IN',
  'hi': 'IN',
  'hi-IN': 'IN',
};

export function detectRegionalPricing(): RegionalPrice & { countryCode: string } {
  const languages = navigator.languages ?? [navigator.language];
  for (const lang of languages) {
    const country = LOCALE_TO_COUNTRY[lang] ?? LOCALE_TO_COUNTRY[lang.split('-')[0]];
    if (country && REGIONAL_PRICING[country]) {
      return { ...REGIONAL_PRICING[country], countryCode: country };
    }
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.startsWith('Asia/Manila') || tz === 'Asia/Manila') return { ...REGIONAL_PRICING.PH, countryCode: 'PH' };
    if (tz.startsWith('Asia/Dubai')) return { ...REGIONAL_PRICING.AE, countryCode: 'AE' };
    if (tz.startsWith('Asia/Singapore')) return { ...REGIONAL_PRICING.SG, countryCode: 'SG' };
    if (tz.startsWith('Europe/London')) return { ...REGIONAL_PRICING.GB, countryCode: 'GB' };
    if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) return { ...REGIONAL_PRICING.IN, countryCode: 'IN' };
  } catch {}
  return { ...REGIONAL_PRICING.DEFAULT, countryCode: 'US' };
}

export function formatPrice(symbol: string, amount: number): string {
  return `${symbol}${amount.toLocaleString()}`;
}
