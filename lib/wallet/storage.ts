/**
 * PilotRecognition Wallet — Local Encrypted Storage
 *
 * Implements the three client-side storage tiers:
 *
 * Tier 2 — Credential Database   : Raw W3C VCs (AES-256-GCM encrypted, keyed to device)
 * Tier 3 — Network Status Tier   : Status list index pointers + sovereign endpoint registry
 * Tier 4 — Ephemeral Audit Log   : Presentation audit trail (local-only, never synced)
 *
 * Transport: IndexedDB via structured-clone, with AES-256-GCM envelope per record.
 * The encryption key is derived from the device-bound key held in enclave.ts.
 * On web (pre-React Native migration) we use a PBKDF2-derived key from the session UID
 * as an interim measure — this is replaced by the Secure Enclave key in the native build.
 *
 * Cloud stores: NOTHING from this module. All writes are local only.
 */

import type {
  PilotLicenseCredential,
  MedicalCurrencyCredential,
  OEMAttestationRecord,
  CredentialSlotKey,
} from './types/schemas';

// ─────────────────────────────────────────────────────────────
// DB CONSTANTS
// ─────────────────────────────────────────────────────────────

const DB_NAME    = 'pr_wallet_v1';
const DB_VERSION = 1;

const STORE_CREDENTIALS = 'credentials';      // Tier 2
const STORE_ENDPOINTS   = 'endpoints';         // Tier 3 — sovereign endpoint registry
const STORE_STATUS_PTRS = 'status_pointers';   // Tier 3 — revocation index cache
const STORE_AUDIT_LOG   = 'audit_log';         // Tier 4

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface EncryptedRecord {
  id: string;
  iv: string;        // base64 — 12-byte AES-GCM nonce
  ciphertext: string; // base64 — AES-256-GCM encrypted JSON
  createdAt: number;
  updatedAt: number;
}

export interface StoredCredential extends EncryptedRecord {
  slotKey: CredentialSlotKey;
  vcType: 'PilotLicenseCredential' | 'MedicalCurrencyCredential' | 'OEMAttestationRecord';
  issuer: string;
  validUntil: string | null;
}

export interface SovereignEndpoint {
  id: string;
  entityDid: string;
  entityName: string;
  entityType: 'airline' | 'ato' | 'authority' | 'medical_examiner';
  publicKeyJwk: Record<string, string>;
  authorizedAt: number;
  revokedAt: number | null;
}

export interface StatusListPointer {
  id: string;
  statusListUrl: string;
  slotKey: CredentialSlotKey;
  listIndex: number;
  purpose: 'revocation' | 'suspension';
  lastChecked: number | null;
  lastBitValue: 0 | 1 | null;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  recipientDid: string;
  recipientName: string;
  presentationType: 'AviationRecordSummary' | 'FullCredentialProof';
  disclosedFields: string[];
  vpId: string;
  terminalClearance: string;
  hoursBracket: string;
}

// ─────────────────────────────────────────────────────────────
// ENCRYPTION LAYER — AES-256-GCM
// ─────────────────────────────────────────────────────────────

let _cryptoKey: CryptoKey | null = null;

/**
 * Derive a per-session AES-256-GCM key from the holder DID using PBKDF2.
 * On web: salt = SHA-256(holderDid). In native build: replaced by Secure Enclave export-restricted key.
 */
export async function initStorageKey(holderDid: string): Promise<void> {
  const enc    = new TextEncoder();
  const salt   = await crypto.subtle.digest('SHA-256', enc.encode(holderDid));
  const base   = await crypto.subtle.importKey('raw', enc.encode(holderDid), 'PBKDF2', false, ['deriveKey']);
  _cryptoKey   = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 310_000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function encryptJson(obj: unknown): Promise<{ iv: string; ciphertext: string }> {
  if (!_cryptoKey) throw new Error('Storage key not initialised — call initStorageKey() first');
  const iv         = crypto.getRandomValues(new Uint8Array(12));
  const encoded    = new TextEncoder().encode(JSON.stringify(obj));
  const cipherBuf  = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, _cryptoKey, encoded);
  return {
    iv:         btoa(String.fromCharCode(...iv)),
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(cipherBuf))),
  };
}

async function decryptJson<T>(record: { iv: string; ciphertext: string }): Promise<T> {
  if (!_cryptoKey) throw new Error('Storage key not initialised');
  const iv        = Uint8Array.from(atob(record.iv), c => c.charCodeAt(0));
  const cipher    = Uint8Array.from(atob(record.ciphertext), c => c.charCodeAt(0));
  const plainBuf  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, _cryptoKey, cipher);
  return JSON.parse(new TextDecoder().decode(plainBuf)) as T;
}

// ─────────────────────────────────────────────────────────────
// INDEXEDDB BOOTSTRAP
// ─────────────────────────────────────────────────────────────

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_CREDENTIALS)) {
        const cs = db.createObjectStore(STORE_CREDENTIALS, { keyPath: 'id' });
        cs.createIndex('slotKey', 'slotKey', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_ENDPOINTS)) {
        const es = db.createObjectStore(STORE_ENDPOINTS, { keyPath: 'id' });
        es.createIndex('entityDid', 'entityDid', { unique: true });
      }
      if (!db.objectStoreNames.contains(STORE_STATUS_PTRS)) {
        const sp = db.createObjectStore(STORE_STATUS_PTRS, { keyPath: 'id' });
        sp.createIndex('slotKey', 'slotKey', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_AUDIT_LOG)) {
        const al = db.createObjectStore(STORE_AUDIT_LOG, { keyPath: 'id' });
        al.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function idbPut<T>(db: IDBDatabase, store: string, record: T): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).put(record);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

function idbGet<T>(db: IDBDatabase, store: string, key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror   = () => reject(req.error);
  });
}

function idbGetAll<T>(db: IDBDatabase, store: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror   = () => reject(req.error);
  });
}

function idbDelete(db: IDBDatabase, store: string, key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).delete(key);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

// ─────────────────────────────────────────────────────────────
// TIER 2 — CREDENTIAL DATABASE
// Full VC payloads — AES-256-GCM encrypted. Never synced to cloud.
// ─────────────────────────────────────────────────────────────

export async function storeCredential(
  slotKey: CredentialSlotKey,
  vc: PilotLicenseCredential | MedicalCurrencyCredential | OEMAttestationRecord,
): Promise<void> {
  const db      = await openDb();
  const { iv, ciphertext } = await encryptJson(vc);
  const record: StoredCredential = {
    id:         `vc_${slotKey}`,
    slotKey,
    vcType:     vc.type[1] as StoredCredential['vcType'],
    issuer:     vc.issuer,
    validUntil: vc.validUntil ?? null,
    iv,
    ciphertext,
    createdAt:  Date.now(),
    updatedAt:  Date.now(),
  };
  await idbPut(db, STORE_CREDENTIALS, record);
}

export async function loadCredential<T>(slotKey: CredentialSlotKey): Promise<T | null> {
  const db     = await openDb();
  const record = await idbGet<StoredCredential>(db, STORE_CREDENTIALS, `vc_${slotKey}`);
  if (!record) return null;
  return decryptJson<T>(record);
}

export async function deleteCredential(slotKey: CredentialSlotKey): Promise<void> {
  const db = await openDb();
  await idbDelete(db, STORE_CREDENTIALS, `vc_${slotKey}`);
}

export async function loadAllCredentialMetadata(): Promise<Omit<StoredCredential, 'ciphertext' | 'iv'>[]> {
  const db      = await openDb();
  const records = await idbGetAll<StoredCredential>(db, STORE_CREDENTIALS);
  return records.map(({ id, slotKey, vcType, issuer, validUntil, createdAt, updatedAt }) => ({
    id, slotKey, vcType, issuer, validUntil, createdAt, updatedAt,
  }));
}

// ─────────────────────────────────────────────────────────────
// TIER 3a — SOVEREIGN ENDPOINT REGISTRY
// Tracks which airlines/ATOs/authorities the pilot has authorised.
// Their public keys are stored here for VP encryption targeting.
// ─────────────────────────────────────────────────────────────

export async function registerEndpoint(endpoint: Omit<SovereignEndpoint, 'authorizedAt' | 'revokedAt'>): Promise<void> {
  const db = await openDb();
  const record: SovereignEndpoint = { ...endpoint, authorizedAt: Date.now(), revokedAt: null };
  await idbPut(db, STORE_ENDPOINTS, record);
}

export async function revokeEndpoint(entityDid: string): Promise<void> {
  const db     = await openDb();
  const record = await idbGet<SovereignEndpoint>(db, STORE_ENDPOINTS, entityDid);
  if (record) await idbPut(db, STORE_ENDPOINTS, { ...record, revokedAt: Date.now() });
}

export async function loadActiveEndpoints(): Promise<SovereignEndpoint[]> {
  const db      = await openDb();
  const records = await idbGetAll<SovereignEndpoint>(db, STORE_ENDPOINTS);
  return records.filter(e => e.revokedAt === null);
}

// ─────────────────────────────────────────────────────────────
// TIER 3b — STATUS LIST INDEX POINTERS
// The wallet's routing map for revocation checks.
// Maps each credential slot to its exact bit position in the global status list.
// ─────────────────────────────────────────────────────────────

export async function upsertStatusPointer(ptr: StatusListPointer): Promise<void> {
  const db = await openDb();
  await idbPut(db, STORE_STATUS_PTRS, ptr);
}

export async function loadStatusPointer(slotKey: CredentialSlotKey): Promise<StatusListPointer | null> {
  const db     = await openDb();
  const record = await idbGet<StatusListPointer>(db, STORE_STATUS_PTRS, `ptr_${slotKey}`);
  return record ?? null;
}

export async function loadAllStatusPointers(): Promise<StatusListPointer[]> {
  const db = await openDb();
  return idbGetAll<StatusListPointer>(db, STORE_STATUS_PTRS);
}

export async function updateStatusPointerBit(
  slotKey: CredentialSlotKey,
  bitValue: 0 | 1,
): Promise<void> {
  const db  = await openDb();
  const ptr = await idbGet<StatusListPointer>(db, STORE_STATUS_PTRS, `ptr_${slotKey}`);
  if (!ptr) return;
  await idbPut(db, STORE_STATUS_PTRS, { ...ptr, lastChecked: Date.now(), lastBitValue: bitValue });
}

// ─────────────────────────────────────────────────────────────
// TIER 4 — EPHEMERAL OUTBOUND AUDIT LOG
// Local-only ledger of all presentation events.
// Never synced to cloud. Pilot owns this trail entirely.
// ─────────────────────────────────────────────────────────────

export async function logPresentationEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
  const db = await openDb();
  const record: AuditLogEntry = {
    ...entry,
    id:        `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };
  await idbPut(db, STORE_AUDIT_LOG, record);
}

export async function loadAuditLog(): Promise<AuditLogEntry[]> {
  const db      = await openDb();
  const records = await idbGetAll<AuditLogEntry>(db, STORE_AUDIT_LOG);
  return records.sort((a, b) => b.timestamp - a.timestamp);
}

export async function clearAuditLog(): Promise<void> {
  const db      = await openDb();
  const records = await idbGetAll<AuditLogEntry>(db, STORE_AUDIT_LOG);
  for (const r of records) await idbDelete(db, STORE_AUDIT_LOG, r.id);
}

// ─────────────────────────────────────────────────────────────
// WALLET WIPE — emergency full local reset
// Called when Secure Enclave key is invalidated (device lost, identity fraud reset AV3)
// ─────────────────────────────────────────────────────────────

export async function wipeLocalWallet(): Promise<void> {
  _cryptoKey = null;
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

// ─────────────────────────────────────────────────────────────
// STORAGE HEALTH SUMMARY
// Returns a data segregation report — mirrors the architecture doc table
// ─────────────────────────────────────────────────────────────

export interface StorageHealthReport {
  tier2: { credentialCount: number; slots: string[] };
  tier3: { activeEndpoints: number; statusPointers: number };
  tier4: { auditEntries: number; oldestEntry: number | null };
  cloudHolds: {
    privateKeys: false;
    pilotNameOrLicense: false;
    rawTelemetry: false;
    revocationBits: true;
    routingHashes: true;
  };
}

export async function getStorageHealthReport(): Promise<StorageHealthReport> {
  const [meta, endpoints, ptrs, log] = await Promise.all([
    loadAllCredentialMetadata(),
    loadActiveEndpoints(),
    loadAllStatusPointers(),
    loadAuditLog(),
  ]);
  return {
    tier2: {
      credentialCount: meta.length,
      slots:           meta.map(m => m.slotKey),
    },
    tier3: {
      activeEndpoints: endpoints.length,
      statusPointers:  ptrs.length,
    },
    tier4: {
      auditEntries: log.length,
      oldestEntry:  log.length > 0 ? log[log.length - 1].timestamp : null,
    },
    cloudHolds: {
      privateKeys:        false,
      pilotNameOrLicense: false,
      rawTelemetry:       false,
      revocationBits:     true,
      routingHashes:      true,
    },
  };
}
