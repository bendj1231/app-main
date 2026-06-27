/**
 * Neon PostgreSQL client
 * Cluster: neondb (Singapore ap-southeast-1)
 * Use: OEM forecasts, pathway cards, aviation index cache, IPFS CID index
 * NEVER store pilot auth/identity data here — use Supabase for that
 */

import { Pool } from 'pg';

const connectionString = import.meta.env.NEON_DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error('NEON_DATABASE_URL is not set in environment variables');
}

let pool: Pool;

declare global {
   
  var _neonPool: Pool | undefined;
}

if (import.meta.env.DEV) {
  if (!global._neonPool) {
    global._neonPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
    });
  }
  pool = global._neonPool;
} else {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
  });
}

export default pool;

export async function neonQuery<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows as T[];
}
