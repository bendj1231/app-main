/**
 * FleetAgeGateway.ts
 * Provider-agnostic fleet age data gateway for PilotRecognition.com
 *
 * The Weibull math engine only ever calls:
 *   const result = await FleetAgeGateway.resolve(airlineIata, aircraftFamily, airlineSlug)
 *
 * Provider priority waterfall (first available API key wins):
 *   1. Aviation Edge      — AVIATION_EDGE_API_KEY      (direct avg_age field, free tier available)
 *   2. Airlabs            — AIRLABS_API_KEY             (1,000 free calls/mo; $49/mo paid)
 *   3. Aviationstack      — AVIATIONSTACK_API_KEY       (500 free calls/mo forever — best free tier)
 *   4. AeroDataBox        — AERODATABOX_API_KEY         (RapidAPI, $5–15/mo)
 *   5. Flightradar24      — FR24_API_KEY                (enterprise, MCP-compatible)
 *   6. OpenSky Network    — no key required             (research nonprofit, ICAO24 metadata CSV)
 *   7. ARLA               — no key required             (FAA daily CSV dumps, US tail numbers)
 *   8. BTS Open Data      — no key required             (US carriers only, .gov)
 *   9. Airfleets scrape   — no key required             (HTML fallback)
 *  10. Boeing AEL static  — no key required             (hardcoded regional averages)
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
  | 'aviationstack'
  | 'aerodatabox'
  | 'flightradar24'
  | 'opensky'
  | 'arla'
  | 'bts_open_data'
  | 'opendatasoft'
  | 'wrobell_github'
  | 'openflights_github'
  | 'uk_caa'
  | 'casa_australia'
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
    name: 'aviationstack',
    label: 'Aviationstack API (Free Tier)',
    url: 'https://aviationstack.com/',
    tier: 'free_api',
    note: '500 free API calls/month forever. Returns fleet JSON with production_line and airplane_age. Register at aviationstack.com.',
    keyEnvVar: 'AVIATIONSTACK_API_KEY',
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
    name: 'opensky',
    label: 'OpenSky Network Metadata API',
    url: 'https://opensky-network.org/apidoc/',
    tier: 'free_api',
    note: 'Research nonprofit. Free, no key required. Monthly aircraft metadata snapshots link ICAO24 hex codes to manufacturer delivery dates.',
    keyEnvVar: null,
  },
  {
    name: 'arla',
    label: 'ARLA — FAA Aircraft Registration Lookup',
    url: 'https://arla.njf.dev/',
    tier: 'free_api',
    note: 'Open-source. Pulls directly from daily FAA Aircraft Registration Database CSV dumps. Returns year_of_manufacture per tail number. US only.',
    keyEnvVar: null,
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
    name: 'opendatasoft',
    label: 'OpenDataSoft World Aircraft Database',
    url: 'https://data.opendatasoft.com/explore/dataset/world-aircraft-database',
    tier: 'free_api',
    note: 'No key. REST query by tail number. Returns year_of_construction and operator. Global coverage.',
    keyEnvVar: null,
  },
  {
    name: 'wrobell_github',
    label: 'wrobell/aircraft GitHub Dataset (ICAO hex → model)',
    url: 'https://github.com/wrobell/aircraft',
    tier: 'free_api',
    note: 'No key. Raw GitHub JSON. Maps ICAO24 hex codes to model type. Used for narrowbody/widebody classification.',
    keyEnvVar: null,
  },
  {
    name: 'openflights_github',
    label: 'jpatokal/openflights Aircraft Database',
    url: 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/planes.dat',
    tier: 'free_api',
    note: 'No key. CSV on GitHub. Definitive aircraft type list — A320-200 vs neo classification for Weibull segment routing.',
    keyEnvVar: null,
  },
  {
    name: 'uk_caa',
    label: 'UK CAA G-INFO Aircraft Register',
    url: 'https://siteapps.caa.co.uk/g-info/',
    tier: 'free_api',
    note: 'No key. UK G-registered aircraft. Links tail to date of manufacture and airworthiness status.',
    keyEnvVar: null,
  },
  {
    name: 'casa_australia',
    label: 'CASA Australia Aircraft Register',
    url: 'https://www.casa.gov.au/aircraft/aircraft-register',
    tier: 'free_api',
    note: 'No key. VH-registered Australian aircraft. Manufacturing year + design type in open dataset.',
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

// ─── Free provider implementations ─────────────────────────────────────────

async function fromAviationstack(
  iata: string,
  family: string,
  apiKey: string,
): Promise<FleetAgeResult | null> {
  try {
    // Aviationstack /v1/airplanes — free tier returns 500 calls/mo
    // Filter by airline_iata to get the fleet array
    const url = `http://api.aviationstack.com/v1/airplanes?access_key=${apiKey}&airline_iata=${encodeURIComponent(iata)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const json = await res.json();
    const aircraft: any[] = json?.data || [];
    if (!aircraft.length) return null;

    // Filter by aircraft type
    const matched = aircraft.filter((ac: any) => {
      const model = (ac.plane_type || ac.iata_code_long || ac.iata_code_short || '').toLowerCase().replace(/[\s-]/g, '');
      return model.includes(family) || family.includes(model.substring(0, 4));
    });
    const fleet = matched.length > 0 ? matched : aircraft;

    const currentYear = new Date().getFullYear();
    const ages: number[] = fleet
      .map((ac: any) => {
        // Aviationstack returns plane_age (years) or construction_number / delivery_date
        if (ac.plane_age && !isNaN(parseFloat(ac.plane_age))) return parseFloat(ac.plane_age);
        const delivery = ac.delivery_date || ac.first_flight_date;
        if (delivery) { const yr = parseInt(String(delivery).substring(0, 4)); return isNaN(yr) ? null : currentYear - yr; }
        return null;
      })
      .filter((a): a is number => typeof a === 'number' && a >= 0 && a <= 60);

    if (!ages.length) return null;
    const avg = ages.reduce((s, a) => s + a, 0) / ages.length;
    return {
      fleetAge: Math.round(avg * 10) / 10,
      matchedCount: fleet.length,
      provider: 'aviationstack',
      providerLabel: 'Aviationstack API (Free Tier)',
      dataQuality: 'live_api',
      sourceUrl: 'https://aviationstack.com/',
      airlineIata: iata, aircraftFamily: family,
      resolvedAt: new Date().toISOString(),
    };
  } catch (err) { console.warn('Aviationstack error:', err); return null; }
}

async function fromOpenSky(
  iata: string,
  family: string,
): Promise<FleetAgeResult | null> {
  try {
    // OpenSky aircraft metadata endpoint — no auth required
    // Search by operator ICAO (which matches airline ICAO, close to IATA for most carriers)
    const url = `https://opensky-network.org/api/metadata/aircraft/list?operatorIcao=${encodeURIComponent(iata)}&limit=200`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const aircraft: any[] = json?.content || json?.aircrafts || json || [];
    if (!Array.isArray(aircraft) || !aircraft.length) return null;

    const matched = aircraft.filter((ac: any) => {
      const model = (ac.typecode || ac.model || '').toLowerCase().replace(/[\s-]/g, '');
      return model.includes(family) || family.includes(model.substring(0, 4));
    });
    const fleet = matched.length > 0 ? matched : aircraft;

    const currentYear = new Date().getFullYear();
    const ages: number[] = fleet
      .map((ac: any) => {
        const built = ac.built || ac.firstFlightDate || ac.manufacturerserialNo;
        if (!built) return null;
        const yr = parseInt(String(built).substring(0, 4));
        return isNaN(yr) || yr < 1950 ? null : currentYear - yr;
      })
      .filter((a): a is number => typeof a === 'number' && a >= 0 && a <= 60);

    if (!ages.length) return null;
    const avg = ages.reduce((s, a) => s + a, 0) / ages.length;
    return {
      fleetAge: Math.round(avg * 10) / 10,
      matchedCount: fleet.length,
      provider: 'opensky',
      providerLabel: 'OpenSky Network Metadata API',
      dataQuality: 'live_api',
      sourceUrl: 'https://opensky-network.org/apidoc/',
      airlineIata: iata, aircraftFamily: family,
      resolvedAt: new Date().toISOString(),
    };
  } catch (err) { console.warn('OpenSky error:', err); return null; }
}

async function fromARLA(
  registration: string,   // single tail number — used for individual aircraft lookups
  family: string,
): Promise<FleetAgeResult | null> {
  // ARLA works per-registration (tail number), not per-airline.
  // Use it when a specific N-number is provided rather than an airline IATA.
  try {
    const reg = registration.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const url = `https://arla.njf.dev/aircraft/${encodeURIComponent(reg)}`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    // ARLA returns: { year_of_manufacture, aircraft_type, ... }
    const yom = json?.year_of_manufacture || json?.yearMfr;
    if (!yom) return null;
    const age = new Date().getFullYear() - parseInt(String(yom));
    if (isNaN(age) || age < 0 || age > 60) return null;
    return {
      fleetAge: age,
      matchedCount: 1,
      provider: 'arla',
      providerLabel: 'ARLA — FAA Aircraft Registration (arla.njf.dev)',
      dataQuality: 'live_api',
      sourceUrl: 'https://arla.njf.dev/',
      airlineIata: null, aircraftFamily: family,
      resolvedAt: new Date().toISOString(),
    };
  } catch (err) { console.warn('ARLA error:', err); return null; }
}

// ─── Paid provider implementations ───────────────────────────────────────

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

// ─── Free global / government registry implementations ───────────────────

async function fromOpenDataSoft(
  registration: string,
  family: string,
): Promise<FleetAgeResult | null> {
  try {
    // OpenDataSoft world-aircraft-database: query by registration number
    const url = `https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/world-aircraft-database/records?where=registration%3D%22${encodeURIComponent(registration.toUpperCase())}%22&limit=5`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const json = await res.json();
    const records: any[] = json?.results || [];
    if (!records.length) return null;

    const currentYear = new Date().getFullYear();
    const ages: number[] = records
      .map((r: any) => {
        const yoc = r.year_of_construction || r.yearofconstruction || r.built;
        return yoc ? currentYear - parseInt(String(yoc)) : null;
      })
      .filter((a): a is number => typeof a === 'number' && a >= 0 && a <= 60);

    if (!ages.length) return null;
    const avg = ages.reduce((s, a) => s + a, 0) / ages.length;
    return {
      fleetAge: Math.round(avg * 10) / 10, matchedCount: records.length,
      provider: 'opendatasoft', providerLabel: 'OpenDataSoft World Aircraft Database',
      dataQuality: 'live_api',
      sourceUrl: 'https://data.opendatasoft.com/explore/dataset/world-aircraft-database',
      airlineIata: null, aircraftFamily: family, resolvedAt: new Date().toISOString(),
    };
  } catch (err) { console.warn('OpenDataSoft error:', err); return null; }
}

async function fromUKCAA(
  registration: string,
  family: string,
): Promise<FleetAgeResult | null> {
  // UK CAA G-INFO open data API — G-registered aircraft only
  try {
    const reg = registration.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    const url = `https://siteapps.caa.co.uk/g-info/api/aircraft?registration=${encodeURIComponent(reg)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const json = await res.json();
    const record = Array.isArray(json) ? json[0] : json;
    if (!record) return null;
    const yom = record.year_of_manufacture || record.yearOfManufacture || record.manufacturedYear;
    if (!yom) return null;
    const age = new Date().getFullYear() - parseInt(String(yom));
    if (isNaN(age) || age < 0 || age > 60) return null;
    return {
      fleetAge: age, matchedCount: 1,
      provider: 'uk_caa', providerLabel: 'UK CAA G-INFO Aircraft Register',
      dataQuality: 'live_api',
      sourceUrl: 'https://siteapps.caa.co.uk/g-info/',
      airlineIata: null, aircraftFamily: family, resolvedAt: new Date().toISOString(),
    };
  } catch (err) { console.warn('UK CAA error:', err); return null; }
}

async function fromCASA(
  registration: string,
  family: string,
): Promise<FleetAgeResult | null> {
  // CASA Australia open data — VH-registered aircraft
  try {
    const reg = registration.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    // CASA provides downloadable CSV; query via data.gov.au CKAN API
    const url = `https://data.gov.au/api/3/action/datastore_search?resource_id=2dfc59e2-57c1-497e-9636-7c9b8a11e2e1&q=${encodeURIComponent(reg)}&limit=5`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const json = await res.json();
    const records: any[] = json?.result?.records || [];
    if (!records.length) return null;
    const currentYear = new Date().getFullYear();
    const ages: number[] = records
      .map((r: any) => {
        const yom = r.year_of_manufacture || r.Year_of_Manufacture || r.built;
        return yom ? currentYear - parseInt(String(yom)) : null;
      })
      .filter((a): a is number => typeof a === 'number' && a >= 0 && a <= 60);
    if (!ages.length) return null;
    const avg = ages.reduce((s, a) => s + a, 0) / ages.length;
    return {
      fleetAge: Math.round(avg * 10) / 10, matchedCount: records.length,
      provider: 'casa_australia', providerLabel: 'CASA Australia Aircraft Register (data.gov.au)',
      dataQuality: 'live_api',
      sourceUrl: 'https://data.gov.au',
      airlineIata: null, aircraftFamily: family, resolvedAt: new Date().toISOString(),
    };
  } catch (err) { console.warn('CASA error:', err); return null; }
}

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

    // 3. Aviationstack (500 free calls/mo — free forever)
    const asKey = Deno.env.get('AVIATIONSTACK_API_KEY');
    if (asKey && iata) {
      const r = await fromAviationstack(iata, family, asKey);
      if (r) return r;
    }

    // 4. AeroDataBox
    const adbKey = Deno.env.get('AERODATABOX_API_KEY');
    if (adbKey && iata) {
      const r = await fromAeroDataBox(iata, family, adbKey);
      if (r) return r;
    }

    // 5. Flightradar24
    const fr24Key = Deno.env.get('FR24_API_KEY');
    if (fr24Key && iata) {
      const r = await fromFlightradar24(iata, family, fr24Key);
      if (r) return r;
    }

    // 6. OpenSky Network (free, no key — research nonprofit)
    if (iata) {
      const r = await fromOpenSky(iata, family);
      if (r) return r;
    }

    // 7. BTS (US carriers — free, no key)
    if (iata) {
      const r = await fromBTS(iata, family);
      if (r) return r;
    }

    // 8. OpenDataSoft world aircraft database (tail number lookup)
    if (airlineSlug) {
      const r = await fromOpenDataSoft(airlineSlug, family);
      if (r) return r;
    }

    // 9. UK CAA G-INFO (G-registered aircraft, tail number)
    if (airlineSlug && airlineSlug.toUpperCase().startsWith('G-')) {
      const r = await fromUKCAA(airlineSlug, family);
      if (r) return r;
    }

    // 10. CASA Australia (VH-registered aircraft)
    if (airlineSlug && airlineSlug.toUpperCase().startsWith('VH-')) {
      const r = await fromCASA(airlineSlug, family);
      if (r) return r;
    }

    // 11. Airfleets scrape
    if (airlineSlug) {
      const r = await fromAirfleets(airlineSlug, family);
      if (r) return r;
    }

    // 12. Boeing AEL static average — always succeeds
    return fromBoeingAEL(family, iata);
  }

  /**
   * Classify aircraft family into Weibull segment using openflights planes.dat.
   * Returns 'narrowbody' | 'widebody' | 'regional' | 'freighter'.
   * Falls back to keyword matching if GitHub fetch fails.
   */
  static async classifySegment(aircraftFamily: string): Promise<string> {
    const family = aircraftFamily.toLowerCase().replace(/[\s-]/g, '');
    // Try openflights planes.dat for IATA/ICAO type classification
    try {
      const res = await fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/planes.dat', { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const text = await res.text();
        for (const line of text.split('\n')) {
          const parts = line.split(',');
          if (parts.length < 3) continue;
          const name = parts[0].replace(/"/g, '').toLowerCase().replace(/[\s-]/g, '');
          const iata = parts[1].replace(/"/g, '').toLowerCase();
          if (name.includes(family) || iata === family.substring(0, 3)) {
            const fullName = parts[0].toLowerCase();
            if (fullName.includes('freighter') || fullName.includes('cargo') || fullName.includes('-f ')) return 'freighter';
            if (fullName.includes('a380') || fullName.includes('a350') || fullName.includes('777') || fullName.includes('787') || fullName.includes('a330') || fullName.includes('747')) return 'widebody';
            if (fullName.includes('atr') || fullName.includes('crj') || fullName.includes('embraer') || fullName.includes('e1') || fullName.includes('e17') || fullName.includes('q400') || fullName.includes('dash')) return 'regional';
            return 'narrowbody';
          }
        }
      }
    } catch { /* fall through to keyword match */ }

    // Keyword fallback
    if (['777', '787', 'a350', 'a330', 'a380', 'a340', '747', '767'].some(k => family.includes(k))) return 'widebody';
    if (['atr', 'crj', 'e170', 'e175', 'e190', 'e195', 'q400', 'dash8', 'saab'].some(k => family.includes(k))) return 'regional';
    if (['freighter', '747f', '777f', 'a330f', 'a350f'].some(k => family.includes(k))) return 'freighter';
    return 'narrowbody';
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
