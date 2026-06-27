/**
 * MongoDB Atlas client
 * Cluster: pilotrecognition (Singapore ap-southeast-1)
 * Use: unstructured telemetry, raw aviation API payloads, flight logs
 * NEVER store pilot PII here — use Supabase for identity data
 */

import { MongoClient, Db } from 'mongodb';

const uri = import.meta.env.MONGODB_URI || process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is not set in environment variables');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
   
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (import.meta.env.DEV) {
  // In development, reuse the client across HMR reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(dbName = 'pilotrecognition'): Promise<Db> {
  const c = await clientPromise;
  return c.db(dbName);
}

// Collection name constants
export const COLLECTIONS = {
  AVIATION_API_PAYLOADS: 'aviation_api_payloads',   // raw Aviationstack / OpenSky responses
  FLIGHT_TELEMETRY:      'flight_telemetry',          // raw cockpit/ADS-B telemetry logs
  LOGBOOK_RAW:           'logbook_raw',               // unstructured logbook import JSONs
  API_CACHE:             'api_cache',                 // third-party API response cache
} as const;
