/**
 * IP Geofencing Middleware — ToS Section 13.3 Compliance
 * 
 * Resolves client geographic jurisdiction via IP-to-location mapping
 * before any data is committed to core database engines.
 * Sets immutable origin_jurisdiction on profile creation.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface JurisdictionInfo {
  countryCode: string;      // ISO 3166-1 alpha-2 (e.g., 'PH', 'US', 'SG')
  countryName: string;
  region: string;
  complianceModule: string;   // Active regulatory module
  dataResidency: string;    // Required data storage region
}

// Compliance module mapping per ToS Section 13.3
const COMPLIANCE_MODULES: Record<string, { module: string; residency: string }> = {
  // ASEAN Hubs
  'SG': { module: 'SG-PDPA-Baseline', residency: 'ap-southeast-1' },
  'PH': { module: 'PH-DPA-Baseline', residency: 'ap-southeast-1' },
  'MY': { module: 'MY-PDPA-Baseline', residency: 'ap-southeast-1' },
  'TH': { module: 'TH-PDPA-Baseline', residency: 'ap-southeast-1' },
  'ID': { module: 'ID-Law-Baseline', residency: 'ap-southeast-1' },
  'VN': { module: 'VN-Cyber-Baseline', residency: 'ap-southeast-1' },
  
  // European Union (GDPR)
  'DE': { module: 'EU-GDPR-Enforced', residency: 'eu-west-1' },
  'FR': { module: 'EU-GDPR-Enforced', residency: 'eu-west-1' },
  'GB': { module: 'UK-GDPR-Enforced', residency: 'eu-west-2' },
  'NL': { module: 'EU-GDPR-Enforced', residency: 'eu-west-1' },
  'IT': { module: 'EU-GDPR-Enforced', residency: 'eu-west-1' },
  'ES': { module: 'EU-GDPR-Enforced', residency: 'eu-west-1' },
  // ... all EU countries default to EU-GDPR
  
  // United States (State-federated)
  'US': { module: 'US-State-Federated', residency: 'us-east-1' },
  'CA': { module: 'CA-PIPEDA-Baseline', residency: 'us-east-1' },
  
  // Middle East
  'AE': { module: 'AE-PDPL-Baseline', residency: 'me-south-1' },
  'SA': { module: 'SA-PDPL-Baseline', residency: 'me-south-1' },
  'QA': { module: 'QA-Law-Baseline', residency: 'me-south-1' },
  
  // Oceania
  'AU': { module: 'AU-Privacy-Baseline', residency: 'ap-southeast-2' },
  'NZ': { module: 'NZ-Privacy-Baseline', residency: 'ap-southeast-2' },
  
  // South Asia
  'IN': { module: 'IN-DPDPA-Baseline', residency: 'ap-south-1' },
  'PK': { module: 'PK-Law-Baseline', residency: 'ap-south-1' },
  'BD': { module: 'BD-Law-Baseline', residency: 'ap-south-1' },
  
  // Africa (via Mauritius hub)
  'MU': { module: 'MU-DPA-Baseline', residency: 'af-south-1' },
  'ZA': { module: 'ZA-POPIA-Baseline', residency: 'af-south-1' },
  'NG': { module: 'NG-Law-Baseline', residency: 'af-south-1' },
  'KE': { module: 'KE-Law-Baseline', residency: 'af-south-1' },
};

// Default for unlisted/VPN/proxies per ToS
const DEFAULT_COMPLIANCE = { module: 'Global-CBPR-Core', residency: 'ap-southeast-1' };

/**
 * Resolve jurisdiction from IP address using ipapi.co
 * Note: In production, use a more robust service or edge network headers
 */
export async function resolveJurisdictionFromIP(
  ipAddress: string | null
): Promise<JurisdictionInfo | null> {
  // If no IP, return null (will use default)
  if (!ipAddress) return null;
  
  // In production edge functions, use CF-IPCountry header from Cloudflare
  // const countryCode = req.headers.get('CF-IPCountry');
  
  try {
    // For development/demo: use ipapi.co
    // In production: use edge network headers (Cloudflare, etc.)
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
    if (!response.ok) return null;
    
    const data = await response.json();
    const countryCode = data.country_code?.toUpperCase();
    
    if (!countryCode) return null;
    
    const compliance = COMPLIANCE_MODULES[countryCode] || DEFAULT_COMPLIANCE;
    
    return {
      countryCode,
      countryName: data.country_name || 'Unknown',
      region: data.region || 'Unknown',
      complianceModule: compliance.module,
      dataResidency: compliance.residency,
    };
  } catch (error) {
    console.error('IP geofencing resolution failed:', error);
    return null;
  }
}

/**
 * Get client IP from request headers (edge network aware)
 */
export function getClientIP(req: Request): string | null {
  // Check for edge network headers first (Cloudflare, etc.)
  const cfConnectingIP = req.headers.get('CF-Connecting-IP');
  if (cfConnectingIP) return cfConnectingIP;
  
  // Standard proxy headers
  const forwarded = req.headers.get('X-Forwarded-For');
  if (forwarded) {
    // Take first IP in chain (client IP)
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('X-Real-IP');
  if (realIP) return realIP;
  
  // Deno.serve remote address (if available)
  // Note: This may be the edge network, not the end user
  return null;
}

/**
 * Get country code from edge network header (faster than IP lookup)
 */
export function getCountryFromEdgeHeader(req: Request): string | null {
  // Cloudflare CF-IPCountry header
  const cfCountry = req.headers.get('CF-IPCountry');
  if (cfCountry) return cfCountry.toUpperCase();
  
  // Other CDN headers
  const cloudfrontCountry = req.headers.get('CloudFront-Viewer-Country');
  if (cloudfrontCountry) return cloudfrontCountry.toUpperCase();
  
  return null;
}

/**
 * Set origin_jurisdiction on profile creation
 * This is called during account registration
 */
export async function setOriginJurisdiction(
  supabase: ReturnType<typeof createClient>,
  profileId: string,
  req: Request
): Promise<boolean> {
  try {
    // Try edge header first (fastest)
    let countryCode = getCountryFromEdgeHeader(req);
    
    // Fallback to IP resolution
    if (!countryCode) {
      const clientIP = getClientIP(req);
      const jurisdiction = await resolveJurisdictionFromIP(clientIP);
      countryCode = jurisdiction?.countryCode || null;
    }
    
    // If still no country, use 'XX' (unknown) - will trigger re-attestation later
    const finalCountryCode = countryCode || 'XX';
    
    // Update profile with origin_jurisdiction
    const { error } = await supabase
      .from('profiles')
      .update({
        origin_jurisdiction: finalCountryCode,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId);
    
    if (error) {
      console.error('Failed to set origin_jurisdiction:', error);
      return false;
    }
    
    console.log(`Set origin_jurisdiction: ${finalCountryCode} for profile ${profileId}`);
    return true;
  } catch (error) {
    console.error('Error in setOriginJurisdiction:', error);
    return false;
  }
}

/**
 * Check if IP drift has occurred (ToS Section 13.3 re-attestation trigger)
 */
export async function detectIPDrift(
  supabase: ReturnType<typeof createClient>,
  profileId: string,
  req: Request
): Promise<{ drift: boolean; currentCountry: string | null }> {
  try {
    // Get stored origin_jurisdiction
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('origin_jurisdiction')
      .eq('id', profileId)
      .single();
    
    if (error || !profile) {
      return { drift: false, currentCountry: null };
    }
    
    const originJurisdiction = profile.origin_jurisdiction;
    
    // Resolve current jurisdiction
    let currentCountry = getCountryFromEdgeHeader(req);
    if (!currentCountry) {
      const clientIP = getClientIP(req);
      const jurisdiction = await resolveJurisdictionFromIP(clientIP);
      currentCountry = jurisdiction?.countryCode || null;
    }
    
    // If no stored origin or no current country, no drift detection possible
    if (!originJurisdiction || !currentCountry) {
      return { drift: false, currentCountry };
    }
    
    // Check for drift
    const drift = originJurisdiction !== currentCountry;
    
    if (drift) {
      console.warn(`IP Drift detected: ${originJurisdiction} → ${currentCountry} for ${profileId}`);
      
      // Log the drift event for compliance audit
      await supabase.from('user_activity_log').insert({
        user_id: profileId,
        action: 'ip_drift_detected',
        details: {
          origin_jurisdiction: originJurisdiction,
          current_jurisdiction: currentCountry,
          requires_re_attestation: true,
        },
        created_at: new Date().toISOString(),
      });
    }
    
    return { drift, currentCountry };
  } catch (error) {
    console.error('Error in detectIPDrift:', error);
    return { drift: false, currentCountry: null };
  }
}

/**
 * Get compliance module for a country code
 */
export function getComplianceModule(countryCode: string): string {
  const upperCode = countryCode.toUpperCase();
  return COMPLIANCE_MODULES[upperCode]?.module || DEFAULT_COMPLIANCE.module;
}

/**
 * Get data residency region for a country code
 */
export function getDataResidency(countryCode: string): string {
  const upperCode = countryCode.toUpperCase();
  return COMPLIANCE_MODULES[upperCode]?.residency || DEFAULT_COMPLIANCE.residency;
}

export default {
  resolveJurisdictionFromIP,
  getClientIP,
  getCountryFromEdgeHeader,
  setOriginJurisdiction,
  detectIPDrift,
  getComplianceModule,
  getDataResidency,
};
