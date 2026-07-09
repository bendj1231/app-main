import { useEffect, useMemo, useState } from 'react';

export interface AirlineManifestEntry {
  name: string;
  status: string;
  file: string;
  title: string;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  mime?: string | null;
  path: string;
  source?: string;
  note?: string;
}

export interface AirlinePathway {
  id: string;
  name: string;
  logo: string;
  region: string;
  category: string;
  match: number;
  gaps: number;
  subtitle: string;
  benefits: string[];
  submitted?: boolean;
}

export interface AirlinePathwayProfile {
  total_flight_hours?: number | string | null;
  verification_status?: string | Record<string, unknown> | null;
  subscription_tier?: string | null;
  recognition_tier?: string | null;
}

const RECOMMENDED_AIRLINES = new Set([
  'Singapore Airlines',
  'Cathay Pacific',
  'Philippine Airlines',
  'Cebu Pacific',
  'Qantas',
  'Air New Zealand',
  'All Nippon Airways',
  'Japan Airlines',
  'Korean Air',
  'Malaysia Airlines',
  'Thai Airways',
  'Vietnam Airlines',
  'IndiGo',
  'Air India',
  'Garuda Indonesia',
  'EVA Air',
  'China Airlines',
  'AirAsia',
  'Bangkok Airways',
  'Fiji Airways',
  'SriLankan Airlines',
  'Biman Bangladesh Airlines',
  'Royal Brunei Airlines',
]);

const LATEST_AIRLINES = new Set([
  'Starlux Airlines',
  'Zipair',
  'Akasa Air',
  'Air Seoul',
  'Tway Air',
  'Peach Aviation',
  'Scoot',
  'Jeju Air',
  'Jin Air',
  'Air Busan',
  'Eastar Jet',
  'Skymark Airlines',
  'Star Flyer',
  'Solaseed Air',
  'Spring Japan',
  'Hong Kong Express',
  'Tigerair Taiwan',
  'Mandarin Airlines',
  'VietJet Air',
  'Bamboo Airways',
  'Thai AirAsia',
  'Thai Lion Air',
  'Nok Air',
  'Citilink',
  'Batik Air',
  'Lion Air',
  'SkyJet Airlines',
  'Sunlight Air',
  'Royal Air Philippines',
  'Air Juan',
  'Sky Pasada',
  'Cebgo',
  'Philippines AirAsia',
]);

const SUBMITTED_AIRLINES = new Set([
  'Cebu Pacific',
  'Philippine Airlines',
  'AirAsia',
  'Philippines AirAsia',
]);

const SUBTITLES = [
  'First Officer Pipeline',
  'Direct Entry Captain',
  'Cadet Development Program',
  'Type-Rated Placement',
  'International Expansion',
  'Regional FO Track',
];

function generateSubtitle(name: string): string {
  const idx = name.length % SUBTITLES.length;
  return SUBTITLES[idx];
}

function generateMatch(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const base = 65 + (Math.abs(hash) % 30);
  return Math.min(98, Math.max(55, base));
}

function generateGaps(match: number): number {
  if (match >= 90) return 1;
  if (match >= 80) return 2;
  if (match >= 70) return 4;
  return 6;
}

function generateBenefits(match: number): string[] {
  if (match >= 90) return ['Fast-track', 'Hiring now'];
  if (match >= 80) return ['Training included', 'Global network'];
  if (match >= 70) return ['Competitive package', 'Upgrade path'];
  return ['Entry pathway', 'Build hours'];
}

function regionFromPath(path: string): string {
  const first = path.split('/')[0];
  return first
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function categoryFromPath(path: string): string {
  const second = path.split('/')[1] || 'operator';
  return second
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

let manifestPromise: Promise<AirlineManifestEntry[]> | null = null;
let cachedManifest: AirlineManifestEntry[] | null = null;

function fetchManifest(): Promise<AirlineManifestEntry[]> {
  if (cachedManifest) return Promise.resolve(cachedManifest);
  if (manifestPromise) return manifestPromise;

  manifestPromise = fetch('/images/airline-logos/APAC/manifest.json')
    .then((r) => r.json())
    .then((data: AirlineManifestEntry[]) => {
      const valid = data.filter((e) => e.status === 'downloaded' && e.path);
      cachedManifest = valid;
      return valid;
    })
    .catch((err) => {
      console.error('Failed to load airline logo manifest:', err);
      manifestPromise = null;
      throw err;
    });

  return manifestPromise;
}

export function useAirlinePathways(profile?: AirlinePathwayProfile) {
  const [manifest, setManifest] = useState<AirlineManifestEntry[]>(cachedManifest ?? []);
  const [loading, setLoading] = useState(!cachedManifest);

  useEffect(() => {
    let cancelled = false;
    fetchManifest()
      .then((valid) => {
        if (cancelled) return;
        setManifest(valid);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const pathways = useMemo<AirlinePathway[]>(() => {
    const hours =
      typeof profile?.total_flight_hours === 'string'
        ? parseFloat(profile.total_flight_hours)
        : typeof profile?.total_flight_hours === 'number'
          ? profile.total_flight_hours
          : 0;
    const verified =
      (typeof profile?.verification_status === 'string' &&
        profile.verification_status === 'verified') ||
      (typeof profile?.verification_status === 'object' &&
        profile?.verification_status !== null &&
        profile.verification_status.status === 'verified');
    const isSubscriber =
      profile?.subscription_tier === 'recognition_plus' ||
      profile?.recognition_tier === 'recognition_plus' ||
      profile?.subscription_tier === 'enterprise';

    return manifest.map((entry) => {
      let match = generateMatch(entry.name);
      if (verified) match += 5;
      if (isSubscriber) match += 3;
      if (hours >= 1500) match += 4;
      else if (hours >= 500) match += 2;
      match = Math.min(99, match);
      const gaps = generateGaps(match);
      return {
        id: slugify(entry.name),
        name: entry.name,
        logo: `/images/airline-logos/APAC/${entry.path}`,
        region: regionFromPath(entry.path),
        category: categoryFromPath(entry.path),
        match,
        gaps,
        subtitle: generateSubtitle(entry.name),
        benefits: generateBenefits(match),
        submitted: SUBMITTED_AIRLINES.has(entry.name),
      };
    });
  }, [manifest, profile]);

  const recommended = useMemo(
    () =>
      pathways
        .filter((p) => RECOMMENDED_AIRLINES.has(p.name))
        .sort((a, b) => b.match - a.match),
    [pathways]
  );

  const latest = useMemo(
    () =>
      pathways
        .filter((p) => LATEST_AIRLINES.has(p.name))
        .sort((a, b) => b.match - a.match),
    [pathways]
  );

  const submitted = useMemo(
    () => pathways.filter((p) => p.submitted).sort((a, b) => b.match - a.match),
    [pathways]
  );

  return { pathways, recommended, latest, submitted, loading };
}
