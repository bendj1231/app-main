/**
 * Type-rating news service
 *
 * Primary source: MongoDB Atlas Data API (read-only public data).
 * Fallback: static hardcoded articles if Atlas is not configured or request fails.
 *
 * To use MongoDB Atlas Data API:
 *   VITE_ATLAS_DATA_API_KEY=...
 *   VITE_ATLAS_DATA_API_URL=https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1
 *   VITE_ATLAS_DATA_SOURCE=pilotrecognition
 *   VITE_ATLAS_DATABASE=app
 *   VITE_ATLAS_NEWS_COLLECTION=type_rating_news
 */

export interface TypeRatingNewsArticle {
  _id?: string;
  headline: string;
  summary: string;
  source: string;
  sourceUrl?: string;
  date: string; // ISO date or display date like "July 2026"
  aircraftId: string;
  category: 'end-of-service' | 'new-entry' | 'training-update' | 'market';
  publishedAt?: string;
}

export interface LatestTypeRatingChange {
  tag: string;
  headline: string;
  summary: string;
  source: string;
  aircraftId: string;
}

const ATLAS_API_KEY = import.meta.env.VITE_ATLAS_DATA_API_KEY as string | undefined;
const ATLAS_API_URL = import.meta.env.VITE_ATLAS_DATA_API_URL as string | undefined;
const ATLAS_DATA_SOURCE = (import.meta.env.VITE_ATLAS_DATA_SOURCE as string) || 'pilotrecognition';
const ATLAS_DATABASE = (import.meta.env.VITE_ATLAS_DATABASE as string) || 'app';
const ATLAS_NEWS_COLLECTION =
  (import.meta.env.VITE_ATLAS_NEWS_COLLECTION as string) || 'type_rating_news';

const hasAtlasConfig = !!ATLAS_API_KEY && !!ATLAS_API_URL;

export const staticTypeRatingNews: TypeRatingNewsArticle[] = [
  {
    headline: 'Boeing 737 Nearing End of Service?',
    summary:
      'The 737 NG line is aging, and airlines are phasing out older -700/-800 variants while the MAX series takes over. Type-rated pilots are moving toward 737 MAX differences courses.',
    source: 'Aviation Week / Boeing Commercial Market Outlook 2026',
    date: 'July 2026',
    aircraftId: 'b737-ng',
    category: 'end-of-service',
  },
  {
    headline: 'Boeing 747 Production Winds Down',
    summary:
      'With the final 747-8F rolling out, the Queen of the Skies is entering its twilight. Cargo operators still value the type rating, but fewer new pilots are training for it.',
    source: 'Boeing Newsroom / IATA',
    date: 'June 2026',
    aircraftId: 'b747-8',
    category: 'end-of-service',
  },
  {
    headline: 'Airbus A321XLR Enters Service',
    summary:
      'The A321XLR is reshaping long-haul narrow-body flying. Airlines are adding A321neo type ratings and XLR differences training for pilots already on the A320 family.',
    source: 'Airbus Press Release / FlightGlobal',
    date: 'May 2026',
    aircraftId: 'a321',
    category: 'new-entry',
  },
  {
    headline: 'Embraer E2 Jet Orders Surge',
    summary:
      'The E190-E2 and E195-E2 are gaining traction as regional airlines refresh fleets. New type-rating courses are expanding at Embraer training centers.',
    source: 'Embraer Commercial Aviation / Aviation International News',
    date: 'April 2026',
    aircraftId: 'embraer-e190',
    category: 'new-entry',
  },
];

export const staticLatestTypeRatingChanges: LatestTypeRatingChange[] = [
  {
    tag: 'Boeing',
    headline: '737 MAX Training Updates',
    summary:
      'Enhanced simulator requirements for MAX 8, 9, and 10 variants. New MCAS training modules mandatory from Q3 2026.',
    source: 'Boeing Training & Flight Services Bulletin',
    aircraftId: 'b737-max',
  },
  {
    tag: 'Airbus',
    headline: 'A320neo Family Certification',
    summary:
      'Common type rating extended to include A321XLR. Reduced training hours for pilots with A320ceo experience.',
    source: 'Airbus Training Centre Technical Notice 2026-04',
    aircraftId: 'a320',
  },
  {
    tag: 'Embraer',
    headline: 'E-Jet E2 Cross-Qualification',
    summary:
      'New cross-qualification program between E190-E2 and E195-E2. 40% reduction in training time announced.',
    source: 'Embraer Commercial Aviation Training Update',
    aircraftId: 'embraer-e190',
  },
  {
    tag: 'ATR',
    headline: 'ATR 72-600 New Procedures',
    summary:
      'Updated cold weather operations procedures for 72-600. New de-icing certification requirements effective immediately.',
    source: 'ATR Aircraft Operations Bulletin 2026-02',
    aircraftId: 'atr-72-600',
  },
];

async function fetchFromAtlas<T>(action: string, body: Record<string, unknown>): Promise<T | null> {
  if (!hasAtlasConfig) return null;

  try {
    const res = await fetch(`${ATLAS_API_URL}/action/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': ATLAS_API_KEY!,
      },
      body: JSON.stringify({
        dataSource: ATLAS_DATA_SOURCE,
        database: ATLAS_DATABASE,
        collection: ATLAS_NEWS_COLLECTION,
        ...body,
      }),
    });

    if (!res.ok) {
      console.warn('Atlas Data API request failed:', res.status, await res.text());
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    console.warn('Atlas Data API error:', err);
    return null;
  }
}

export async function fetchTypeRatingNews(limit = 6): Promise<TypeRatingNewsArticle[]> {
  const atlasResult = await fetchFromAtlas<{ documents: TypeRatingNewsArticle[] }>('find', {
    filter: {},
    sort: { publishedAt: -1 },
    limit,
  });

  if (atlasResult && atlasResult.documents && atlasResult.documents.length > 0) {
    return atlasResult.documents;
  }

  return staticTypeRatingNews;
}

export async function fetchLatestTypeRatingChanges(limit = 6): Promise<LatestTypeRatingChange[]> {
  const atlasResult = await fetchFromAtlas<{ documents: LatestTypeRatingChange[] }>('find', {
    filter: { category: 'training-update' },
    sort: { publishedAt: -1 },
    limit,
  });

  if (atlasResult && atlasResult.documents && atlasResult.documents.length > 0) {
    return atlasResult.documents;
  }

  return staticLatestTypeRatingChanges;
}
