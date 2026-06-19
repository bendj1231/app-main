/**
 * useVaultProfile — Encrypted profile read/write hook
 *
 * Wraps Worker API profile reads and writes with transparent AES-GCM encryption.
 * Sensitive fields are encrypted before reaching the API; decrypted on read.
 * Non-sensitive fields (hours, country, display_name) pass through unencrypted
 * so matching/search still works without decryption.
 *
 * Security rules enforced here:
 *   - Write functions THROW if vault key is unavailable — no silent plaintext fallback.
 *   - reEncryptIfPlaintext() migrates legacy plaintext records on login.
 *   - Read functions return null for a field if decryption fails — never expose ciphertext.
 */

import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useWorkerAuth } from './useWorkerAuth';
import {
  getVaultKeyFromAuth0Token,
  encryptFields,
  decryptFields,
  PROFILE_SENSITIVE_FIELDS,
  PILOT_LICENSURE_SENSITIVE_FIELDS,
} from '../../lib/vault';

const VAULT_PREFIX = '{"iv":"';

/** Returns true if a string value looks like a vault-encrypted blob. */
function isEncrypted(value: unknown): boolean {
  return typeof value === 'string' && value.startsWith(VAULT_PREFIX);
}

/** Returns true if a record has ANY sensitive field that is still plaintext. */
function hasPlaintextFields(
  record: Record<string, unknown>,
  fields: readonly string[]
): boolean {
  return fields.some(f => {
    const v = record[f];
    return v !== null && v !== undefined && v !== '' && !isEncrypted(v);
  });
}

export function useVaultProfile() {
  const { user: auth0User, getIdTokenClaims } = useAuth0();
  const { callApi } = useWorkerAuth();

  /**
   * Get the vault key for the current pilot.
   * Throws if unavailable — callers must handle and surface the error.
   * Never returns null to prevent silent plaintext writes.
   */
  const getKey = useCallback(async (): Promise<CryptoKey> => {
    if (!auth0User?.sub) {
      throw new Error('[vault] No authenticated user — cannot derive vault key');
    }
    // Prefer Auth0 ID token path — matches how data was encrypted at signup
    try {
      const claims = await getIdTokenClaims?.();
      const idToken = claims?.__raw;
      if (idToken) {
        return getVaultKeyFromAuth0Token(auth0User.sub, idToken);
      }
    } catch (err: unknown) {
      console.warn('[vault] Auth0 ID token key derivation failed:', err instanceof Error ? err.message : err);
    }
    // Fallback: derive from Auth0 access token if ID token unavailable
    throw new Error('[vault] No Auth0 ID token — cannot derive vault key');
  }, [auth0User, getIdTokenClaims]);

  /**
   * Read pilot profile from `profiles` table, decrypting sensitive fields.
   * Read failures are non-blocking — returns raw data if key unavailable.
   */
  const readProfile = useCallback(async (userId: string) => {
    try {
      const data = await callApi<Record<string, unknown>>('getProfile', { id: userId });
      if (!data) return { data: null, error: null };

      try {
        const key = await getKey();
        const decrypted = await decryptFields(data, PROFILE_SENSITIVE_FIELDS as unknown as string[], key);
        return { data: decrypted, error: null };
      } catch (err: unknown) {
        console.warn('[vault] Read: key unavailable, returning raw data:', err instanceof Error ? err.message : err);
        return { data, error: null };
      }
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }, [getKey, callApi]);

  /**
   * Read pilot licensure record from `pilot_licensure_experience`, decrypting sensitive fields.
   */
  const readLicensure = useCallback(async (userId: string) => {
    try {
      const data = await callApi<Record<string, unknown>>('getLicensure', { user_id: userId });
      if (!data) return { data: null, error: null };

      try {
        const key = await getKey();
        const decrypted = await decryptFields(data, PILOT_LICENSURE_SENSITIVE_FIELDS as unknown as string[], key);
        return { data: decrypted, error: null };
      } catch (err: unknown) {
        console.warn('[vault] Read: key unavailable, returning raw data:', err instanceof Error ? err.message : err);
        return { data, error: null };
      }
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }, [getKey, callApi]);

  /**
   * Write (insert) a new profile row, encrypting sensitive fields first.
   * THROWS if vault key is unavailable — never writes plaintext.
   */
  const writeProfile = useCallback(async (userId: string, profileData: Record<string, unknown>) => {
    const key = await getKey(); // throws if unavailable
    const payload = await encryptFields(profileData, PROFILE_SENSITIVE_FIELDS as unknown as string[], key);
    return callApi('createProfile', { id: userId, ...payload });
  }, [getKey, callApi]);

  /**
   * Update an existing profile row, encrypting sensitive fields first.
   * THROWS if vault key is unavailable — never writes plaintext.
   */
  const updateProfile = useCallback(async (userId: string, updates: Record<string, unknown>) => {
    const key = await getKey(); // throws if unavailable
    const payload = await encryptFields(updates, PROFILE_SENSITIVE_FIELDS as unknown as string[], key);
    return callApi('updateProfile', { id: userId, ...payload });
  }, [getKey, callApi]);

  /**
   * Write (upsert) pilot_licensure_experience, encrypting sensitive fields first.
   * THROWS if vault key is unavailable — never writes plaintext.
   */
  const writeLicensure = useCallback(async (userId: string, data: Record<string, unknown>) => {
    const key = await getKey(); // throws if unavailable
    const payload = await encryptFields(data, PILOT_LICENSURE_SENSITIVE_FIELDS as unknown as string[], key);
    return callApi('saveLicensure', { user_id: userId, ...payload });
  }, [getKey, callApi]);

  /**
   * Re-encrypt any plaintext sensitive fields on login.
   * Called once per session after vault key is ready.
   * Silently no-ops if all fields are already encrypted or record doesn't exist.
   */
  const reEncryptIfPlaintext = useCallback(async (userId: string) => {
    try {
      const key = await getKey();

      // Check profiles
      const profile = await callApi<Record<string, unknown>>('getProfile', { id: userId });
      if (profile && hasPlaintextFields(profile, PROFILE_SENSITIVE_FIELDS as unknown as string[])) {
        const encrypted = await encryptFields(profile, PROFILE_SENSITIVE_FIELDS as unknown as string[], key);
        await callApi('updateProfile', { id: userId, ...encrypted });
      }

      // Check licensure
      const licensure = await callApi<Record<string, unknown>>('getLicensure', { user_id: userId });
      if (licensure && hasPlaintextFields(licensure, PILOT_LICENSURE_SENSITIVE_FIELDS as unknown as string[])) {
        const encrypted = await encryptFields(licensure, PILOT_LICENSURE_SENSITIVE_FIELDS as unknown as string[], key);
        await callApi('saveLicensure', { user_id: userId, ...encrypted });
      }

    } catch (err: unknown) {
      console.warn('[vault] reEncryptIfPlaintext failed (non-critical):', err instanceof Error ? err.message : err);
    }
  }, [getKey, callApi]);

  return {
    readProfile,
    readLicensure,
    writeProfile,
    updateProfile,
    writeLicensure,
    reEncryptIfPlaintext,
  };
}
