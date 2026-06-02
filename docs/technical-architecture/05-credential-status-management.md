# Credential Status Management

**Bitstring Status List v2021** — Real-Time Revocation Checking

---

## Overview

The platform implements W3C Bitstring Status List v2021 for efficient, privacy-preserving credential revocation checking.

```
┌─────────────────────────────────────────────────────────────┐
│                    STATUS CHECK ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────┐        ┌─────────────────────────┐    │
│   │   Pilot Wallet   │◄──────▶│   Status List Server     │    │
│   │                 │  60s    │                         │    │
│   │  ┌───────────┐  │  poll   │  ┌─────────────────┐    │    │
│   │  │ IndexedDB │  │        │  │ bitstring.json  │    │    │
│   │  │ (creds)   │  │        │  │ (compressed)    │    │    │
│   │  └─────┬─────┘  │        │  └─────────────────┘    │    │
│   │        │        │        │           ▲               │    │
│   │        ▼        │        │           │               │    │
│   │  ┌───────────┐  │        │  ┌────────┴────────┐      │    │
│   │  │ Status    │  │        │  │  Admin Actions   │      │    │
│   │  │ Cache     │  │        │  │  (Revoke/etc)   │      │    │
│   │  └───────────┘  │        │  └─────────────────┘      │    │
│   └─────────────────┘        └─────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Bitstring Status List v2021

### How It Works

Each credential maps to a specific bit in a compressed bitstring:
- **Bit 0 (0x00)**: Active/Clear
- **Bit 1 (0x01)**: Revoked/Suspended

### Bit Index Calculation

```typescript
// lib/wallet/statusList.ts
export function deriveBitIndex(credentialId: string): number {
  // Deterministic hash of credential ID
  const hash = sha256(credentialId);
  // Use first 4 bytes as index (supports up to 4 billion credentials)
  const index = parseInt(hash.slice(0, 8), 16);
  return index % STATUS_LIST_SIZE; // e.g., 1,000,000 bits
}
```

### Status List Structure

```typescript
interface StatusList {
  '@context': ['https://w3id.org/vc/status-list/2021/v1'];
  id: string;                    // https://pilotrecognition.com/.well-known/status-list.json
  type: 'StatusList2021';
  statusPurpose: 'revocation';   // or 'suspension'
  encodedList: string;           // Base64URL-encoded gzip compressed bitstring
  validFrom: string;             // ISO8601
  validUntil: string;            // ISO8601
}
```

---

## Client-Side Polling

### Circuit Breaker Pattern

```typescript
// lib/wallet/statusList.ts
const STATUS_POLL_INTERVAL = 60000; // 60 seconds
let pollingActive = true;
let consecutiveFailures = 0;
const MAX_FAILURES = 5;

export async function startStatusPolling(): Promise<void> {
  if (!pollingActive) return;

  try {
    // Fetch latest status list
    const statusList = await fetchStatusList();
    
    // Check all credentials
    const credentials = await db.credentials.toArray();
    for (const cred of credentials) {
      const status = await checkCredentialStatus(cred.id, statusList);
      await updateCredentialStatus(cred.id, status);
    }
    
    // Reset failure counter on success
    consecutiveFailures = 0;
    
  } catch (err) {
    consecutiveFailures++;
    console.error('Status poll failed:', err);
    
    // Circuit breaker: Stop after 5 consecutive failures
    if (consecutiveFailures >= MAX_FAILURES) {
      pollingActive = false;
      emitStatusAlert('status_check_failed');
    }
  }

  // Schedule next poll
  setTimeout(startStatusPolling, STATUS_POLL_INTERVAL);
}
```

### Status Decoding

```typescript
export async function checkCredentialStatus(
  credentialId: string,
  statusList: StatusList
): Promise<Status> {
  // Decompress bitstring
  const compressed = base64urlToBuffer(statusList.encodedList);
  const bitstring = await gunzip(compressed);
  
  // Calculate bit position
  const bitIndex = deriveBitIndex(credentialId);
  const byteIndex = Math.floor(bitIndex / 8);
  const bitOffset = bitIndex % 8;
  
  // Check bit
  const byte = bitstring[byteIndex];
  const bit = (byte >> bitOffset) & 1;
  
  return bit === 0 ? 'active' : 'revoked';
}
```

---

## Terminal Status Model

### Three-Tier Status Display

```typescript
type TerminalTier = 'terminal-1' | 'terminal-2' | 'terminal-3';

interface TerminalStatus {
  tier: TerminalTier;
  color: string;
  label: string;
  description: string;
}

const terminalStatuses: Record<TerminalTier, TerminalStatus> = {
  'terminal-1': {
    tier: 'terminal-1',
    color: '#dc2626', // Red
    label: 'Revoked/Expired',
    description: 'Credential is revoked or has expired. Cannot be used for verification.',
  },
  'terminal-2': {
    tier: 'terminal-2',
    color: '#d97706', // Amber
    label: 'Suspended/Unverified',
    description: 'Credential under review or pending verification. Limited functionality.',
  },
  'terminal-3': {
    tier: 'terminal-3',
    color: '#059669', // Green
    label: 'Verified/Active',
    description: 'All credentials verified and active. Full platform access.',
  },
};
```

### Overall Wallet Status

```typescript
export function calculateWalletStatus(credentials: Credential[]): TerminalTier {
  const statuses = credentials.map(c => c.status);
  
  // T1 if any credential is revoked
  if (statuses.some(s => s === 'revoked')) return 'terminal-1';
  
  // T1 if medical is expired (flight-critical)
  if (hasExpiredMedical(credentials)) return 'terminal-1';
  
  // T2 if any credential is suspended or pending
  if (statuses.some(s => s === 'suspended' || s === 'pending')) return 'terminal-2';
  
  // T3 if all credentials are active
  return 'terminal-3';
}
```

---

## Server-Side Status Management

### Revocation API

```typescript
// Admin API: POST /api/admin/revoke-credential
export async function revokeCredentialHandler(req: Request): Promise<Response> {
  const { credentialId, reason, adminId } = await req.json();

  // 1. Verify admin authorization
  const admin = await verifyAdmin(adminId);
  if (!admin.canRevoke) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // 2. Update credential status in database
  await supabase.from('pilot_credentials')
    .update({
      status: 'revoked',
      revoked_at: new Date().toISOString(),
      revoked_by: adminId,
      revocation_reason: reason,
    })
    .eq('id', credentialId);

  // 3. Update status list bitstring
  await updateStatusListBit(credentialId, 1); // Set to revoked

  // 4. Log revocation
  await supabase.from('credential_revocation_log').insert({
    credential_id: credentialId,
    revoked_by: adminId,
    reason,
    timestamp: new Date().toISOString(),
  });

  return Response.json({ success: true });
}
```

### Status List Generation

```typescript
// Cron job: Regenerate status list every 5 minutes
export async function regenerateStatusList(): Promise<void> {
  // 1. Get all credentials and their statuses
  const credentials = await supabase
    .from('pilot_credentials')
    .select('id, status');

  // 2. Build bitstring
  const bitSize = Math.max(...credentials.map(c => deriveBitIndex(c.id))) + 1;
  const bytes = new Uint8Array(Math.ceil(bitSize / 8));

  for (const cred of credentials) {
    const bitIndex = deriveBitIndex(cred.id);
    const byteIndex = Math.floor(bitIndex / 8);
    const bitOffset = bitIndex % 8;

    if (cred.status === 'revoked') {
      bytes[byteIndex] |= (1 << bitOffset);
    }
  }

  // 3. Compress
  const compressed = await gzip(bytes);
  const encoded = bufferToBase64url(compressed);

  // 4. Update status list file
  const statusList: StatusList = {
    '@context': ['https://w3id.org/vc/status-list/2021/v1'],
    id: 'https://pilotrecognition.com/.well-known/status-list.json',
    type: 'StatusList2021',
    statusPurpose: 'revocation',
    encodedList: encoded,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  await publishStatusList(statusList);
}
```

---

## Privacy Considerations

### Single-Request Status Checking

The Bitstring Status List allows checking a single credential's status without revealing which credential is being checked:

```typescript
// Privacy-preserving status check
async function privateStatusCheck(credentialId: string): Promise<Status> {
  // Client downloads full status list (or uses cached version)
  const statusList = await fetchStatusList();
  
  // Client computes bit index locally
  const bitIndex = deriveBitIndex(credentialId);
  
  // Client checks bit locally
  // Server never knows which credential was checked
  return checkBit(statusList, bitIndex);
}
```

---

## Drift Tolerance

### Maximum Acceptable Drift

```typescript
const MAX_STATUS_AGE_MS = 300000; // 5 minutes

export async function getCachedStatusWithDrift(credentialId: string): Promise<Status> {
  const cached = await db.statusCache.get(credentialId);
  const age = Date.now() - (cached?.lastChecked || 0);
  
  if (age < MAX_STATUS_AGE_MS) {
    // Cache is fresh, use it
    return cached.status;
  }
  
  // Cache is stale, refresh
  const fresh = await checkCredentialStatus(credentialId, await fetchStatusList());
  await db.statusCache.put({
    credentialId,
    status: fresh,
    lastChecked: Date.now(),
  });
  
  return fresh;
}
```

---

## Related Documents

- [03-wallet-system-architecture.md](./03-wallet-system-architecture.md) — Four-tier wallet infrastructure
- [04-credential-issuance-flow.md](./04-credential-issuance-flow.md) — VC issuance pipeline

---

**Document Version:** 1.0  
**Last Updated:** June 2, 2026
