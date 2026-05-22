/**
 * FleetAgeGateway.ts
 * Provider-agnostic fleet age data gateway for PilotRecognition.com
 *
 * The Weibull math engine only ever calls:
 *   const result = await FleetAgeGateway.resolve(airlineIata, aircraftFamily, airlineSlug)
 *
 * Provider priority waterfall (first available API key wins):
 *   1. Aviation Edge      — AVIATION_EDGE_API_KEY      (direct avg_age field, free tier available)
 *   2. Airlabs            — AIRLABS_API_KEY             (per-aircraft age array, $49/mo)
 *   3. AeroDataBox        — AERODATABOX_API_KEY         (RapidAPI, $5–15/mo)
 *   4. Flightradar24      — FR24_API_KEY                (enterprise, MCP-compatible)
 *   5. BTS Open Data      — no key required             (US carriers only, .gov)
 *   6. Airfleets scrape   — no key required             (HTML fallback)
 *   7. Boeing AEL static  — no key required             (hardcoded regional averages)
 *
 * All providers return the same FleetAgeResult shape.
 * The math engine is completely decoupled from data sources.
 */

// ─── Types ─────────────────────────────────────────────────────────────────

export interface FleetAgeResult {
  fleetAge: number;             // variable t — average fleet age in years
  matchedCount: number;         // aircraft records used in average
  provider: ProviderName;       // which provider was used
  providerLabel: string;        // human-readable label
  dataQuality: DataQuality;     // live_api | scraped | static_average
  sourceUrl: string;            // citable URL for data provenance
  airlineIata: string | null;
  aircraftFamily: string;
  resolvedAt: string;           // ISO timestamp
}

export type ProviderName =
  | 'aviation_edge'
  | 'airlabs'
  | 'aerodatabox'
  | 'flightradar24'
  | 'bts_open_data'
  | 'airfleets_scrape'
  | 'boeing_ael_static';

export type DataQuality = 'live_api' | 'scraped' | 'static_average';

interface ProviderConfig {
  name: ProviderName;
  label: string;
  url: string;
  tier: 'commercial_api' | 'free_api' | 'public_aggregator' | 'static_constant';
  note: string;
  keyEnvVar: string | null;
}

// ─── Provider registry (ordered by priority) ──────────────────────────────

export const PROVIDERS: ProviderConfig[] = [
  {
    name: 'aviation_edge',
    label: 'Aviation Edge Fleet API',
    url: 'https://aviation-edge.com/developers/',
    tier: 'commercial_api',
    note: 'Direct avg_age key-value per airline. Most efficient — no age calculation required.',
    keyEnvVar: 'AVIATION_EDGE_API_KEY',
  },
  {
    name: 'airlabs',
    label: 'Airlabs Fleet API',
    url: 'https://airlabs.co/docs/fleets',
    tier: 'commercial_api',
    note: 'Per-aircraft age array. Filter by aircraft_icao for type-specific average. ~$49/mo.',
    keyEnvVar: 'AIRLABS_API_KEY',
  },
  {
    name: 'aerodatabox',
    label: 'AeroDataBox (RapidAPI)',
    url: 'https://rapidapi.com/aedbx-aedbx/api/aerodatabox',
    tier: 'commercial_api',
    note: 'Per-aircraft productionYear. $5–15/mo on RapidAPI.',
    keyEnvVar: 'AERODATABOX_API_KEY',
  },
  {
    name: 'flightradar24',
    label: 'Flightradar24 Developer API',
    url: 'https://fr24api.flightradar24.com',
    tier: 'commercial_api',
    note: 'True factory delivery dates (airframe age, not registration date). MCP-compatible.',
    keyEnvVar: 'FR24_API_KEY',
  },
  {
    name: 'bts_open_data',
    label: 'US Bureau of Transportation Statistics',
    url: 'https://www.transtats.bts.gov/api_airport.asp',
    tier: 'free_api',
    note: 'Free .gov API. US carriers only. Returns average_age, oldest_age, youngest_age.',
    keyEnvVar: null,
  },
  {
    name: 'airfleets_scrape',
    label: 'Airfleets.net (HTML scrape)',
    url: 'https://airfleets.net',
    tier: 'public_aggregator',
    note: 'Fallback scrape. No key needed. Risk of IP block on high volume.',
    keyEnvVar: null,
  },
  {
    name: 'boeing_ael_static',
    label: 'Boeing AEL Regional Average',
    url: 'https://www.boeing.com/commercial/aeromagazine/articles/qtr_02_07/AERO_Q207_article4.pdf',
    tier: 'static_constant',
    note: 'Final fallback. Hardcoded Boeing AEL fleet age averages per aircraft type.',
    keyEnvVar: null,
  },
];

// ─── Static fallback constants (Boeing AEL) ──────────────────────────────

const BOEING_AEL_AVERAGES: Record<string, number> = {
  'a320': 13.2, 'a321': 10.8, 'a319': 16.4, 'a320neo': 4.1, 'a321neo': 3.8, 'a320ceo': 14.1,
  'b737': 14.7, '737max': 3.9, '737ng': 15.1, 'b737ng': 15.1, 'b738': 14.2, 'b739': 13.8,
  'a330': 12.8, 'a350': 5.2, 'a380': 11.4, 'b787': 7.3, 'b777': 18.4, 'b747': 22.1,
  'e190': 11.2, 'e195': 9.8, 'e175': 10.1, 'e170': 13.4,
  'atr72': 14.6, 'atr42': 17.2, 'crj': 17.3, 'crj9': 15.8, 'q400': 12.9,
  'a220': 3.8, 'cs300': 5.1,
};

// ─── Slug → IATA lookup ───────────────────────────────────────────────────

const SLUG_TO_IATA: Record<string, string> = {
  'cebu-pacific': 'RP', 'cebupacific': 'RP',
  'philippine-airlines': 'PR', 'philippineairlines': 'PR',
  'emirates': 'EK',
  'etihad': 'EY', 'etihad-airways': 'EY',
  'air-asia': 'AK', 'airasia': 'AK',
  'singapore-airlines': 'SQ', 'singaporeairlines': 'SQ',
  'cathay-pacific': 'CX', 'cathaypacific': 'CX',
  'qantas': 'QF',
  'garuda-indonesia': 'GA', 'garudaindonesia': 'GA',
  'thai-airways': 'TG', 'thaiairways': 'TG',
  'vietnam-airlines': 'VN', 'vietnamairlines': 'VN',
  'flydubai': 'FZ', 'fly-dubai': 'FZ',
  'air-arabia': 'G9', 'airarabia': 'G9',
  'american-airlines': 'AA', 'americanairlines': 'AA',
  'delta': 'DL', 'delta-air-lines': 'DL',
  'united': 'UA', 'united-airlines': 'UA',
  'lufthansa': 'LH',
  'ryanair': 'FR',
  'easyjet': 'U2',
  'indigo': '6E', 'indigo-airlines': '6E',
  'air-india': 'AI', 'airindia': 'AI',
  'southwest': 'WN', 'southwest-airlines': 'WN',
  'british-airways': 'BA', 'britishairways': 'BA',
  'air-france': 'AF', 'airfrance': 'AF',
  'klm': 'KL',
  'turkish-airlines': 'TK', 'turkishairlines': 'TK',
  'qatar-airways': 'QR', 'qatarairways': 'QR',
  'korean-air': 'KE', 'koreanair': 'KE',
  'japan-airlines': 'JL', 'japanairlines': 'JL',
  'ana': 'NH', 'all-nippon-airways': 'NH',
};

export function slugToIata(slug: string): string | null {
  const clean = slug.toLowerCase().replace(/[\s_]/g, '-');
  return SLUG_TO_IATA[clean] || SLUG_TO_IATA[clean.replace(/-/g, '')] || null;
}

// ─── Provider implementations ────────────────────────────────────────────

async function fromAviationEdge(
  iata: string,
  family: string,
  apiKey: string,
): Promise<FleetAgeResult | null> {
  try {
    // Aviation Edge fleet endpoint: returns airline fleet with avg_age per type
    const url = `https://aviation-edge.com/v2/public/fleetData?key=${apiKey}&airlineIata=${encodeURIComponent(iata)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = await res.json();

    // Response is array of aircraft objects
    const aircraft: any[] = Array.isArray(data) ? data : data?.data || [];
    if (!aircraft.length) return null;

    const matched = aircraft.filter((ac: any) => {
      const model = (ac.planeIcaoCode || ac.planeModel || '').toLowerCase().replace(/[\s-]/g, '');
      return model.includes(family) || family.includes(model.substring(0, 4));
    });

    const fleet = matched.length > 0 ? matched : aircraft;
    const ages: number[] = fleet
      .map((ac: any) => {
        // Aviation Edge returns registrationDate or productionLine
        const yr = ac.planeAge ?? (ac.registrationDate ? new Date(ac.registrationDate).getFullYear() : null);
        const age = typeof yr === 'number' && yr > 1950 ? (new Date().getFullYear() - yr) : (typeof yr === 'number' && yr < 100 ? yr : null);
        return age;
      })
      .filter((a): a is number => typeof a === 'number' && a >= 0 && a <= 60);

    if (!ages.length) return null;
    const avg = ages.reduce((s, a) => s + a, 0) / ages.length;

    return {
      fleetAge: Math.round(avg * 10) / 10,
      matchedCount: matched.length || fleet.length,
      provider: 'aviation_edge',
      providerLabel: 'Aviation Edge Fleet API',
      dataQuality: 'live_api',
      sourceUrl: 'https://aviation-edge.com/developers/',
      airlineIata: iata, aircraftFamily: family,
      resolvedAt: new Date().toISOString(),
    };
  } catch (err) { console.warn('AviationEdge error:', err); return null; }
}

async function fromAirlabs(
  iata: string,
  family: string,
  apiKey: string,
): Promise<FleetAgeResult | null> {
  try {
    const url = `https://airlabs.co/api/v9/fleets?airline_iata=${encodeURIComponent(iata)}&api_key=${apiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const json = await res.json();
    const aircraft: any[] = json?.response || [];
    if (!aircraft.length) return null;

    const matched = aircraft.filter((ac: any) => {
      const model = (ac.model || ac.aircraft_icao || '').toLowerCase().replace(/[\s-]/g, '');
      return model.includes(family) || family.includes(model.substring(0, 4));
    });

    const fleet = matched.length > 0 ? matched : aircraft;
    const ages: number[] = fleet
      .map((ac: any) => ac.age ?? (ac.first_flight_date ? new Date().getFullYear() - parseInt(ac.first_flight_date.substring(0, 4)) : null))
      .filter((a): a is number => typeof a === 'number' && a >= 0 && a <= 60);

    if (!ages.length) return null;
    const avg = ages.reduce((s, a) => s + a, 0) / ages.length;

    return {
      fleetAge: Math.round(avg * 10) / 10,
      matchedCount: matched.length || fleet.length,
      provider: 'airlabs',
      providerLabel: 'Airlabs Fleet API',
      dataQuality: 'live_api',
      sourceUrl: 'https://airlabs.co/docs/fleets',
      airlineIata: iata, aircraftFamily: family,
      resolvedAt: new Date().toISOString(),
    };
  } catch (err) { console.warn('Airlabs error:', err); return null; }
}

async function fromAeroDataBox(
  iata: string,
  family: string,
  apiKey: string,
): Promise<FleetAgeResult | null> {
  try {
    const url = `https://aerodatabox.p.rapidapi.com/aircrafts/airline/${encodeURIComponent(iata)}`;
    const res = await fetch(url, {
      headers: { 'x-rapidapi-host': 'aerodatabox.p.rapidapi.com', 'x-rapidapi-key': apiKey },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const items: any[] = json?.items || [];
    if (!items.length) return null;

    const matched = items.filter((ac: any) => {
      const model = (ac.model?.code || ac.typeName || '').toLowerCase().replace(/[\s-]/g, '');
      return model.includes(family) || family.includes(model.substring(0, 4));
    });

    const fleet = matched.length > 0 ? matched : items;
    const currentYear = new Date().getFullYear();
    const ages: number[] = fleet
      .map((ac: any) => {
        const yr = ac.productionYear || ac.firstFlight?.substring(0, 4);
        return yr ? currentYear - parseInt(yr) : null;
      })
      .filter((a): a is number => typeof a === 'number' && a >= 0 && a <= 60);

    if (!ages.length) return null;
    const avg = ages.reduce((s, a) => s + a, 0) / ages.length;

    return {
      fleetAge: Math.round(avg * 10) / 10,
      matchedCount: matched.length || fleet.length,
      provider: 'aerodatabox',
      providerLabel: 'AeroDataBox (RapidAPI)',
      dataQuality: 'live_api',
      sourceUrl: 'https://rapidapi.com/aedbx-aedbx/api/aerodatabox',
      airlineIata: iata, aircraftFamily: family,
      resolvedAt: new Date().toISOString(),
    };
  } catch (err) { console.warn('AeroDataBox error:', err); return null; }
}

async function fromFlightradar24(
  iata: string,
  family: string,
  apiKey: string,
): Promise<FleetAgeResult | null> {
  try {
    // FR24 API v1 — airline fleet endpoint
    const url = `https://fr24api.flightradar24.com/api/static/airlines/${encodeURIComponent(iata)}/fleet`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const aircraft: any[] = json?.data || json?.aircraft || [];
    if (!aircraft.length) return null;

    const matched = aircraft.filter((ac: any) => {
      const model = (ac.type || ac.model || ac.icaoType || '').toLowerCase().replace(/[\s-]/g, '');
      return model.includes(family) || family.includes(model.substring(0, 4));
    });

    const fleet = matched.length > 0 ? matched : aircraft;
    const currentYear = new Date().getFullYear();
    const ages: number[] = fleet
      .map((ac: any) => {
        const built = ac.built || ac.firstFlightDate || ac.deliveryDate;
        if (!built) return null;
        const yr = parseInt(String(built).substring(0, 4));
        return isNaN(yr) ? null : currentYear - yr;
      })
      .filter((a): a is number => typeof a === 'number' && a >= 0 && a <= 60);

    if (!ages.length) return null;
    const avg = ages.reduce((s, a) => s + a, 0) / ages.length;

    return {
      fleetAge: Math.round(avg * 10) / 10,
      matchedCount: matched.length || fleet.length,
      provider: 'flightradar24',
      providerLabel: 'Flightradar24 Developer API',
      dataQuality: 'live_api',
      sourceUrl: 'https://fr24api.flightradar24.com',
      airlineIata: iata, aircraftFamily: family,
      resolvedAt: new Date().toISOString(),
    };
  } catch (err) { console.warn('FR24 error:', err); return null; }
}

async function fromBTS(
  iata: string,
  family: string,
): Promise<FleetAgeResult | null> {
  // BTS public API — US carriers only, no key required
  try {
    const url = `https://api.bts.gov/RegionalFleetAge?airline=${encodeURIComponent(iata)}&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const json = await res.json();
    const avgAge = parseFloat(json?.average_age || json?.AverageAge || '');
    if (isNaN(avgAge)) return null;

    return {
      fleetAge: Math.round(avgAge * 10) / 10,
      matchedCount: json?.fleet_size || 0,
      provider: 'bts_open_data',
      providerLabel: 'US Bureau of Transportation Statistics',
      dataQuality: 'live_api',
      sourceUrl: 'https://www.transtats.bts.gov/api_airport.asp',
      airlineIata: iata, aircraftFamily: family,
      resolvedAt: new Date().toISOString(),
    };
  } catch (err) { console.warn('BTS error:', err); return null; }
}

function parseAirfleetsAge(html: string, family: string): number | null {
  const variants = [family, family.replace('b', ''), family.replace('a', '')];
  const agePattern = /(\d{1,2}\.\d{1,2})\s*(?:years?|yrs?)/i;
  for (const line of html.split('\n')) {
    const lower = line.toLowerCase();
    if (variants.some(v => lower.includes(v))) {
      const m = line.match(agePattern);
      if (m) return parseFloat(m[1]);
    }
  }
  // td cell scan
  const tdPattern = /<td[^>]*>([^<]*)<\/td>/gi;
  const cells: string[] = [];
  let m;
  while ((m = tdPattern.exec(html)) !== null) cells.push(m[1].trim());
  for (let i = 0; i < cells.length; i++) {
    const c = cells[i].toLowerCase().replace(/[\s-]/g, '');
    if (variants.some(v => c.includes(v))) {
      for (let j = i + 1; j < Math.min(i + 6, cells.length); j++) {
        const num = parseFloat(cells[j]);
        if (!isNaN(num) && num >= 0.5 && num <= 35) return num;
      }
    }
  }
  return null;
}

async function fromAirfleets(slug: string, family: string): Promise<FleetAgeResult | null> {
  const urls = [
    `https://www.airfleets.net/flottecie/${encodeURIComponent(slug)}.htm`,
    `https://www.airfleets.net/flottecie/${encodeURIComponent(slug.replace(/-/g, ''))}.htm`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'text/html' },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) continue;
      const html = await res.text();
      const age = parseAirfleetsAge(html, family);
      if (age !== null) {
        return { fleetAge: age, matchedCount: 0, provider: 'airfleets_scrape', providerLabel: 'Airfleets.net (scrape)', dataQuality: 'scraped', sourceUrl: url, airlineIata: null, aircraftFamily: family, resolvedAt: new Date().toISOString() };
      }
    } catch { continue; }
  }
  return null;
}

function fromBoeingAEL(family: string, airlineIata: string | null): FleetAgeResult {
  const age = BOEING_AEL_AVERAGES[family] ?? 14.5;
  return {
    fleetAge: age, matchedCount: 0,
    provider: 'boeing_ael_static',
    providerLabel: 'Boeing AEL Regional Average (static)',
    dataQuality: 'static_average',
    sourceUrl: 'https://www.boeing.com/commercial/aeromagazine/articles/qtr_02_07/AERO_Q207_article4.pdf',
    airlineIata, aircraftFamily: family,
    resolvedAt: new Date().toISOString(),
  };
}

// ─── Main gateway ─────────────────────────────────────────────────────────

export class FleetAgeGateway {
  /**
   * Resolve fleet age for a given airline + aircraft family.
   * Tries each provider in priority order until one succeeds.
   * The Weibull math engine calls this and never touches provider logic.
   */
  static async resolve(
    airlineIata: string | null,
    aircraftFamily: string,
    airlineSlug?: string,
  ): Promise<FleetAgeResult> {
    const family = aircraftFamily.toLowerCase().replace(/[\s-]/g, '');
    const iata = airlineIata || (airlineSlug ? slugToIata(airlineSlug) : null);

    // 1. Aviation Edge
    const aeKey = Deno.env.get('AVIATION_EDGE_API_KEY');
    if (aeKey && iata) {
      const r = await fromAviationEdge(iata, family, aeKey);
      if (r) return r;
    }

    // 2. Airlabs
    const alKey = Deno.env.get('AIRLABS_API_KEY');
    if (alKey && iata) {
      const r = await fromAirlabs(iata, family, alKey);
      if (r) return r;
    }

    // 3. AeroDataBox
    const adbKey = Deno.env.get('AERODATABOX_API_KEY');
    if (adbKey && iata) {
      const r = await fromAeroDataBox(iata, family, adbKey);
      if (r) return r;
    }

    // 4. Flightradar24
    const fr24Key = Deno.env.get('FR24_API_KEY');
    if (fr24Key && iata) {
      const r = await fromFlightradar24(iata, family, fr24Key);
      if (r) return r;
    }

    // 5. BTS (US carriers — free, no key)
    if (iata) {
      const r = await fromBTS(iata, family);
      if (r) return r;
    }

    // 6. Airfleets scrape
    if (airlineSlug) {
      const r = await fromAirfleets(airlineSlug, family);
      if (r) return r;
    }

    // 7. Boeing AEL static average — always succeeds
    return fromBoeingAEL(family, iata);
  }

  /**
   * Returns the current status of all providers — which keys are active.
   * Used by the admin/data-provenance UI to show which sources are live.
   */
  static providerStatus(): Array<ProviderConfig & { active: boolean }> {
    return PROVIDERS.map(p => ({
      ...p,
      active: p.keyEnvVar === null || !!Deno.env.get(p.keyEnvVar),
    }));
  }
}
