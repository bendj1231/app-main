import { createClient } from '@supabase/supabase-js';

/**
 * Regional Router — Determines which Supabase project stores a pilot account
 * based on their LICENSE ISSUING AUTHORITY (not nationality).
 *
 * EU-issued licenses → PilotRecognition-EU (Paris, eu-west-3)
 * All other licenses → PilotRecognition-World (Sydney, ap-southeast-2)
 *
 * Why license over nationality?
 * A British pilot with a Philippine CAAP license is processed under
 * CAAP jurisdiction, not UK/EU. The regulator that issued the license
 * determines the data custody rules.
 */

const SUPABASE_URL_WORLD = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY_WORLD = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_URL_EU = import.meta.env.VITE_SUPABASE_URL_EU;
const SUPABASE_ANON_KEY_EU = import.meta.env.VITE_SUPABASE_ANON_KEY_EU;

// Issuing authorities that trigger EU residency
const EU_ISSUING_AUTHORITIES = new Set([
  'EASA (Europe)',
  'DGAC (France)',
  'LBA (Germany)',
  'ENAC (Italy)',
  'AESL (Spain)',
  'IAA (Ireland)',
  'CAA (UK)',        // Post-Brexit adequacy decision
  'BCAA (Belgium)',
  'TCCA (Netherlands)',
  'Austro Control (Austria)',
  'CAA (Sweden)',
  'CAA (Denmark)',
  'CAA (Finland)',
  'CAA (Poland)',
  'CAA (Czech Republic)',
  'CAA (Greece)',
  'CAA (Portugal)',
  'CAA (Hungary)',
  'CAA (Romania)',
  'CAA (Bulgaria)',
  'CAA (Croatia)',
  'CAA (Slovakia)',
  'CAA (Slovenia)',
  'CAA (Estonia)',
  'CAA (Latvia)',
  'CAA (Lithuania)',
  'CAA (Luxembourg)',
  'CAA (Malta)',
  'CAA (Cyprus)',
  'Transport Malta',
  'Civil Aviation Directorate (Serbia)',
  'CAA (Switzerland)',      // EFTA, adequacy
  'CAA (Norway)',             // EEA
  'CAA (Iceland)',            // EEA
  'CAA (Liechtenstein)',      // EEA
]);

/**
 * Map issuing authority string to region
 */
export function getRegionForLicense(issuingAuthority: string): 'eu' | 'world' {
  return EU_ISSUING_AUTHORITIES.has(issuingAuthority) ? 'eu' : 'world';
}

/**
 * Map issuing authority to ISO country code for origin_jurisdiction stamp
 */
export function getJurisdictionCode(issuingAuthority: string): string {
  const mapping: Record<string, string> = {
    'EASA (Europe)': 'EU',
    'DGAC (France)': 'FR',
    'LBA (Germany)': 'DE',
    'ENAC (Italy)': 'IT',
    'AESL (Spain)': 'ES',
    'IAA (Ireland)': 'IE',
    'CAA (UK)': 'GB',
    'BCAA (Belgium)': 'BE',
    'TCCA (Netherlands)': 'NL',
    'Austro Control (Austria)': 'AT',
    'CAA (Sweden)': 'SE',
    'CAA (Denmark)': 'DK',
    'CAA (Finland)': 'FI',
    'CAA (Poland)': 'PL',
    'CAA (Czech Republic)': 'CZ',
    'CAA (Greece)': 'GR',
    'CAA (Portugal)': 'PT',
    'CAA (Hungary)': 'HU',
    'CAA (Romania)': 'RO',
    'CAA (Bulgaria)': 'BG',
    'CAA (Croatia)': 'HR',
    'CAA (Slovakia)': 'SK',
    'CAA (Slovenia)': 'SI',
    'CAA (Estonia)': 'EE',
    'CAA (Latvia)': 'LV',
    'CAA (Lithuania)': 'LT',
    'CAA (Luxembourg)': 'LU',
    'CAA (Malta)': 'MT',
    'CAA (Cyprus)': 'CY',
    'Transport Malta': 'MT',
    'Civil Aviation Directorate (Serbia)': 'RS',
    'CAA (Switzerland)': 'CH',
    'CAA (Norway)': 'NO',
    'CAA (Iceland)': 'IS',
    'CAA (Liechtenstein)': 'LI',
    'FAA (USA)': 'US',
    'CAAP (Philippines)': 'PH',
    'GCAA (UAE)': 'AE',
    'CASA (Australia)': 'AU',
    'DGCA (India)': 'IN',
    'TCCA (Canada)': 'CA',
    'SACAA (South Africa)': 'ZA',
    'JCAB (Japan)': 'JP',
    'CAAS (Singapore)': 'SG',
    'CAAT (Thailand)': 'TH',
    'Other': 'XX',
  };
  return mapping[issuingAuthority] || 'XX';
}

/**
 * Get the appropriate Supabase client for a pilot based on their license
 */
export function getRegionalSupabaseClient(issuingAuthority: string) {
  const region = getRegionForLicense(issuingAuthority);

  if (region === 'eu') {
    if (SUPABASE_URL_EU && SUPABASE_ANON_KEY_EU) {
      return createClient(SUPABASE_URL_EU, SUPABASE_ANON_KEY_EU);
    }
    console.warn('⚠️ EU Supabase credentials not configured. Falling back to World project (migration to Worker API in progress).');
    if (SUPABASE_URL_WORLD && SUPABASE_ANON_KEY_WORLD) {
      return createClient(SUPABASE_URL_WORLD, SUPABASE_ANON_KEY_WORLD);
    }
  }

  if (SUPABASE_URL_WORLD && SUPABASE_ANON_KEY_WORLD) {
    return createClient(SUPABASE_URL_WORLD, SUPABASE_ANON_KEY_WORLD);
  }

  console.warn('⚠️ Supabase credentials not configured — regional router returning no-op client (migration to Worker API in progress).');
  const noop = () => Promise.resolve({ data: null, error: new Error('Supabase not configured') });
  const noopChain = new Proxy({} as any, {
    get() { return noopChain; },
    apply() { return noopChain; },
  });
  return {
    from: () => noopChain,
    auth: { getSession: noop, signOut: noop, getUser: noop, onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
    functions: { invoke: noop },
    storage: { from: () => noopChain },
  } as any;
}

/**
 * Check if EU project is configured
 */
export function isEuProjectConfigured(): boolean {
  return !!(SUPABASE_URL_EU && SUPABASE_ANON_KEY_EU);
}
