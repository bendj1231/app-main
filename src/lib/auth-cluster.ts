/**
 * AUTH CLUSTER — 2-Node Regional Auth Router
 * ===========================================
 * Configuration: Sydney (existing) + Singapore (new)
 *
 * Architecture:
 * - SYDNEY (ap-southeast-2): Primary node (existing, has data tables)
 * - SINGAPORE (ap-southeast-1): Backup node (new, auth-only for failover test)
 *
 * Rules:
 * - EU pilots: Home → EU-1 → EU-2 → SG-1 (emergency)
 * - Asia pilots: Home → SG-1 → EU-1 → EU-2
 * - Cross-feed opens when primary node hits 80% capacity
 * - Cross-feed closes when primary drops to 70%
 * - All 3 nodes pinged every 5 days to prevent auto-pause
 *
 * Supabase nodes = auth-only turnstiles (no profile data)
 * Auth0 = identity provider (Google OAuth)
 * Neon = all profile/flight/credential data
 *
 * If Node A dies, pilot logs in on Node B. Data preserved in Neon.
 * Zero sync. Zero drift. Zero data loss.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── REGION & NODE CONFIGURATION ───

export type NodeId = 'sydney' | 'singapore';

export interface AuthNode {
  id: NodeId;
  region: string;
  regionCode: string;
  url: string;
  anonKey: string;
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  latencyMs: number;
  lastChecked: number;
  failureCount: number;
  sessionCount: number;
  sessionCapacity: number;
  compositeLoad: number;
}

/** Active node registry — Sydney + Singapore */
export const AUTH_NODES = ([
  {
    id: 'sydney' as NodeId,
    region: 'Asia Pacific (Sydney)',
    regionCode: 'ap-southeast-2',
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    status: 'unknown' as AuthNode['status'],
    latencyMs: 0,
    lastChecked: 0,
    failureCount: 0,
    sessionCount: 0,
    sessionCapacity: 1000,
    compositeLoad: 0,
  },
  {
    id: 'singapore' as NodeId,
    region: 'Asia Pacific (Singapore)',
    regionCode: 'ap-southeast-1',
    url: import.meta.env.VITE_SUPABASE_URL_SG || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_SG || '',
    status: 'unknown' as AuthNode['status'],
    latencyMs: 0,
    lastChecked: 0,
    failureCount: 0,
    sessionCount: 0,
    sessionCapacity: 1000,
    compositeLoad: 0,
  },
] as AuthNode[]).filter((n): n is AuthNode => Boolean(n.url && n.anonKey));

// ─── REGIONAL FAILOVER CHAINS ───

const REGIONAL_CHAINS: Record<string, NodeId[]> = {
  asia: ['sydney', 'singapore'],
  eu: ['singapore', 'sydney'],
  americas: ['sydney', 'singapore'],
  default: ['sydney', 'singapore'],
};

// ─── CAPACITY THRESHOLDS ───

const THRESHOLDS = {
  GREEN: 0.70,
  YELLOW: 0.80,
  RED: 0.95,
} as const;

// ─── INTERNAL STATE ───

const clients: Map<NodeId, SupabaseClient> = new Map();
let healthInterval: ReturnType<typeof setInterval> | null = null;
const crossFeedState: Map<NodeId, boolean> = new Map();

// ─── CLIENT FACTORY ───

function getClient(node: AuthNode): SupabaseClient {
  if (!clients.has(node.id)) {
    clients.set(
      node.id,
      createClient(node.url, node.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: {
            getItem: (key) => {
              const nodeKey = `sb-${node.id}-${key}`;
              return sessionStorage.getItem(nodeKey);
            },
            setItem: (key, value) => {
              const nodeKey = `sb-${node.id}-${key}`;
              sessionStorage.setItem(nodeKey, value);
            },
            removeItem: (key) => {
              const nodeKey = `sb-${node.id}-${key}`;
              sessionStorage.removeItem(nodeKey);
            },
          },
        },
      })
    );
  }
  return clients.get(node.id)!;
}

// ─── HEALTH MONITORING (FADEC-style) ───

async function pingNode(node: AuthNode): Promise<void> {
  if (!node.url) return;
  const start = performance.now();

  try {
    const client = getClient(node);
    const { error } = await client.auth.getSession();
    const latency = Math.round(performance.now() - start);

    if (error) {
      const status = (error as any)?.status;
      if (status === 522 || status === 503 || status === 'timeout') {
        node.status = 'down';
        node.failureCount++;
      } else {
        node.status = 'degraded';
        node.failureCount = Math.max(0, node.failureCount - 1);
      }
    } else {
      node.status = latency > 2000 ? 'degraded' : 'healthy';
      node.failureCount = Math.max(0, node.failureCount - 1);
    }
    node.latencyMs = latency;
  } catch {
    node.status = 'down';
    node.failureCount++;
    node.latencyMs = 9999;
  }

  node.lastChecked = Date.now();

  const sessionLoad = node.sessionCount / node.sessionCapacity;
  const latencyLoad = Math.min(node.latencyMs / 2000, 1);
  const errorLoad = Math.min(node.failureCount / 5, 1);
  node.compositeLoad = sessionLoad * 0.5 + latencyLoad * 0.3 + errorLoad * 0.2;

  if (node.compositeLoad >= THRESHOLDS.YELLOW && !crossFeedState.get(node.id)) {
    console.log(`[CrossFeed] OPENING valve for ${node.id} — load ${(node.compositeLoad * 100).toFixed(0)}%`);
    crossFeedState.set(node.id, true);
  } else if (node.compositeLoad <= THRESHOLDS.GREEN && crossFeedState.get(node.id)) {
    console.log(`[CrossFeed] CLOSING valve for ${node.id} — load ${(node.compositeLoad * 100).toFixed(0)}%`);
    crossFeedState.set(node.id, false);
  }
}

/** Start health monitoring (default: every 10 seconds) */
export function startHealthChecks(intervalMs = 10000): void {
  if (healthInterval) return;
  AUTH_NODES.forEach((n) => pingNode(n));
  healthInterval = setInterval(() => AUTH_NODES.forEach((n) => pingNode(n)), intervalMs);
}

/** Stop health monitoring */
export function stopHealthChecks(): void {
  if (healthInterval) {
    clearInterval(healthInterval);
    healthInterval = null;
  }
}

// ─── NODE SELECTION ───

/** Get nodes that are currently usable (healthy or degraded, not red) */
export function getUsableNodes(): AuthNode[] {
  return [...AUTH_NODES]
    .filter((n) => n.status === 'healthy' || n.status === 'degraded')
    .filter((n) => n.compositeLoad < THRESHOLDS.RED)
    .sort((a, b) => {
      if (a.status === 'healthy' && b.status !== 'healthy') return -1;
      if (a.status !== 'healthy' && b.status === 'healthy') return 1;
      return a.latencyMs - b.latencyMs;
    });
}

/** Get the complete status of all nodes (for dashboard) */
export function getClusterStatus(): AuthNode[] {
  return AUTH_NODES.map((n) => ({ ...n }));
}

/** Detect pilot's region from timezone */
function detectPilotRegion(): string {
  const stored = sessionStorage.getItem('pilot_region');
  if (stored) return stored;

  const offset = new Date().getTimezoneOffset();
  if (offset <= -180) return 'americas';
  if (offset >= -120 && offset <= 0) return 'eu';
  return 'asia';
}

/** Get the failover chain for a pilot based on region */
export function getFailoverChain(region?: string): NodeId[] {
  const r = region || detectPilotRegion();
  return REGIONAL_CHAINS[r] || REGIONAL_CHAINS.default;
}

/** Select the best node for login */
export function selectNodeForLogin(preferredNodeId?: NodeId): AuthNode | null {
  const region = detectPilotRegion();
  const chain = getFailoverChain(region);
  const usable = getUsableNodes();

  if (preferredNodeId) {
    const preferred = usable.find((n) => n.id === preferredNodeId);
    if (preferred && preferred.compositeLoad < THRESHOLDS.YELLOW) {
      return preferred;
    }
    console.log(`[HomeBase] ${preferredNodeId} full — cross-feeding`);
  }

  for (const nodeId of chain) {
    const node = usable.find((n) => n.id === nodeId);
    if (node && node.compositeLoad < THRESHOLDS.YELLOW) {
      return node;
    }
  }

  let leastLoaded: AuthNode | null = null;
  let minLoad = 1.0;
  for (const node of usable) {
    if (node.compositeLoad < minLoad) {
      minLoad = node.compositeLoad;
      leastLoaded = node;
    }
  }

  if (leastLoaded) {
    console.log(`[Emergency] All nodes yellow — routing to least loaded: ${leastLoaded.id}`);
    return leastLoaded;
  }

  console.error('[Emergency] ALL NODES RED — rejecting new login');
  return null;
}

// ─── AUTH OPERATIONS ───

export interface AuthResult<T> {
  data: T | null;
  error: Error | null;
  node: AuthNode | null;
}

/** Sign in with OAuth — routes to best available node */
export async function clusterSignInWithOAuth(
  provider: 'google',
  redirectTo?: string
): Promise<AuthResult<{ url: string }>> {
  const homeNodeId = sessionStorage.getItem('pilot_home_node') as NodeId | null;
  const node = selectNodeForLogin(homeNodeId);

  if (!node) {
    return { data: null, error: new Error('All auth nodes at capacity'), node: null };
  }

  try {
    const client = getClient(node);
    const { data, error } = await client.auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectTo || `${window.location.origin}/callback` },
    });

    if (error) throw error;
    if (data?.url) {
      sessionStorage.setItem('active_auth_node', node.id);
      if (!homeNodeId) {
        sessionStorage.setItem('pilot_home_node', node.id);
        sessionStorage.setItem('pilot_region', detectPilotRegion());
      }
      return { data: { url: data.url }, error: null, node };
    }
  } catch (err) {
    console.warn(`[AuthCluster] Node ${node.id} OAuth failed:`, err);
    node.failureCount++;
    if (node.failureCount >= 3) node.status = 'down';
  }

  return { data: null, error: new Error('OAuth initialization failed'), node: null };
}

/** Get session — tries active node first, then failover chain */
export async function clusterGetSession(): Promise<
  AuthResult<{ session: any; user: any }>
> {
  const activeNodeId = sessionStorage.getItem('active_auth_node') as NodeId | null;
  const region = detectPilotRegion();
  const chain = getFailoverChain(region);
  const usable = getUsableNodes();

  if (activeNodeId) {
    const active = usable.find((n) => n.id === activeNodeId);
    if (active) {
      try {
        const client = getClient(active);
        const { data, error } = await client.auth.getSession();
        if (!error && data.session) {
          return { data: { session: data.session, user: data.session.user }, error: null, node: active };
        }
      } catch (err) {
        console.warn(`[AuthCluster] Active node ${activeNodeId} session failed:`, err);
      }
    }
  }

  for (const nodeId of chain) {
    const node = usable.find((n) => n.id === nodeId);
    if (!node) continue;
    try {
      const client = getClient(node);
      const { data, error } = await client.auth.getSession();
      if (!error && data.session) {
        sessionStorage.setItem('active_auth_node', node.id);
        return { data: { session: data.session, user: data.session.user }, error: null, node };
      }
    } catch {
      // Node unreachable, continue
    }
  }

  return { data: null, error: new Error('No active session on any node'), node: null };
}

/** Sign out from all nodes (best effort) */
export async function clusterSignOut(): Promise<void> {
  const errors: string[] = [];

  for (const node of AUTH_NODES) {
    try {
      const client = getClient(node);
      await client.auth.signOut();
    } catch (err) {
      errors.push(`${node.id}: ${(err as Error).message}`);
    }
  }

  sessionStorage.removeItem('active_auth_node');
  sessionStorage.removeItem('pilot_home_node');

  if (errors.length === AUTH_NODES.length) {
    throw new Error(`All signout failed: ${errors.join('; ')}`);
  }
}

/** Get active client for direct Supabase operations */
export function getActiveClient(): SupabaseClient | null {
  const activeNodeId = sessionStorage.getItem('active_auth_node') as NodeId | null;
  if (!activeNodeId) return null;
  const node = AUTH_NODES.find((n) => n.id === activeNodeId);
  return node ? getClient(node) : null;
}

/** Manual node switch (for admin/debug) */
export async function switchToNode(nodeId: NodeId): Promise<AuthResult<{ session: any }>> {
  const node = AUTH_NODES.find((n) => n.id === nodeId);
  if (!node) return { data: null, error: new Error(`Node ${nodeId} not found`), node: null };

  const client = getClient(node);
  const { data, error } = await client.auth.getSession();
  if (error || !data.session) {
    return { data: null, error: error || new Error('No session on target node'), node };
  }

  sessionStorage.setItem('active_auth_node', node.id);
  return { data: { session: data.session }, error: null, node };
}

// ─── EMERGENCY MODE DETECTION ───

export function isEmergencyMode(): boolean {
  const usable = getUsableNodes();
  return usable.length === 0;
}

// ─── TEST HELPERS ───

/** Manually mark a node as down (for testing failover) */
export function markNodeDown(nodeId: NodeId): void {
  const node = AUTH_NODES.find((n) => n.id === nodeId);
  if (node) {
    node.status = 'down';
    node.failureCount = 99;
    node.compositeLoad = 1.0;
    console.log(`[TEST] Manually marked ${nodeId} as DOWN`);
  }
}

/** Restore a node to healthy (for testing recovery) */
export function markNodeHealthy(nodeId: NodeId): void {
  const node = AUTH_NODES.find((n) => n.id === nodeId);
  if (node) {
    node.status = 'healthy';
    node.failureCount = 0;
    node.compositeLoad = 0;
    console.log(`[TEST] Manually marked ${nodeId} as HEALTHY`);
  }
}

/** Get the best available client for data operations (profiles, etc.) */
export function getBestClient(): SupabaseClient | null {
  const usable = getUsableNodes();
  if (usable.length === 0) return null;
  return getClient(usable[0]);
}

// ─── INIT ───
startHealthChecks();
