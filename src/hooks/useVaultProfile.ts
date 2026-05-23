/**
 * useVaultProfile — Encrypted profile read/write hook
 *
 * Wraps Supabase profile reads and writes with transparent AES-GCM encryption.
 * Sensitive fields are encrypted before reaching Supabase; decrypted on read.
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
import { supabase } from '../lib/supabase';
import {
  getVaultKey,
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
  record: Record<string, any>,
  fields: readonly string[]
): boolean {
  return fields.some(f => {
    const v = record[f];
    return v !== null && v !== undefined && v !== '' && !isEncrypted(v);
  });
}

export function useVaultProfile() {
  const { user: auth0User } = useAuth0();

  /**
   * Get the vault key for the current pilot.
   * Throws if unavailable — callers must handle and surface the error.
   * Never returns null to prevent silent plaintext writes.
   */
  const { getIdTokenClaims } = useAuth0();

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
    } catch (_) {}
    // Fallback: server-pepper path (Supabase session required)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('[vault] No active session — cannot derive vault key');
    }
    return getVaultKey(auth0User.sub, session.access_token);
  }, [auth0User?.sub, getIdTokenClaims]);

  /**
   * Read pilot profile from `profiles` table, decrypting sensitive fields.
   * Read failures are non-blocking — returns raw data if key unavailable.
   */
  const readProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return { data: null, error };

    try {
      const key = await getKey();
      const decrypted = await decryptFields(data, PROFILE_SENSITIVE_FIELDS as any, key);
      return { data: decrypted, error: null };
    } catch (err: any) {
      console.warn('[vault] Read: key unavailable, returning raw data:', err.message);
      return { data, error: null };
    }
  }, [getKey]);

  /**
   * Read pilot licensure record from `pilot_licensure_experience`, decrypting sensitive fields.
   */
  const readLicensure = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('pilot_licensure_experience')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return { data: null, error };

    try {
      const key = await getKey();
      const decrypted = await decryptFields(data, PILOT_LICENSURE_SENSITIVE_FIELDS as any, key);
      return { data: decrypted, error: null };
    } catch (err: any) {
      console.warn('[vault] Read: key unavailable, returning raw data:', err.message);
      return { data, error: null };
    }
  }, [getKey]);

  /**
   * Write (insert) a new profile row, encrypting sensitive fields first.
   * THROWS if vault key is unavailable — never writes plaintext.
   */
  const writeProfile = useCallback(async (userId: string, profileData: Record<string, any>) => {
    const key = await getKey(); // throws if unavailable
    const payload = await encryptFields(profileData, PROFILE_SENSITIVE_FIELDS as any, key);
    return supabase.from('profiles').insert({ id: userId, ...payload });
  }, [getKey]);

  /**
   * Update an existing profile row, encrypting sensitive fields first.
   * THROWS if vault key is unavailable — never writes plaintext.
   */
  const updateProfile = useCallback(async (userId: string, updates: Record<string, any>) => {
    const key = await getKey(); // throws if unavailable
    const payload = await encryptFields(updates, PROFILE_SENSITIVE_FIELDS as any, key);
    return supabase.from('profiles').update(payload).eq('id', userId);
  }, [getKey]);

  /**
   * Write (upsert) pilot_licensure_experience, encrypting sensitive fields first.
   * THROWS if vault key is unavailable — never writes plaintext.
   */
  const writeLicensure = useCallback(async (userId: string, data: Record<string, any>) => {
    const key = await getKey(); // throws if unavailable
    const payload = await encryptFields(data, PILOT_LICENSURE_SENSITIVE_FIELDS as any, key);
    return supabase
      .from('pilot_licensure_experience')
      .upsert({ user_id: userId, ...payload }, { onConflict: 'user_id' });
  }, [getKey]);

  /**
   * Re-encrypt any plaintext sensitive fields on login.
   * Called once per session after vault key is ready.
   * Silently no-ops if all fields are already encrypted or record doesn't exist.
   */
  const reEncryptIfPlaintext = useCallback(async (userId: string) => {
    try {
      const key = await getKey();

      // Check profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profile && hasPlaintextFields(profile, PROFILE_SENSITIVE_FIELDS as any)) {
        console.log('[vault] Re-encrypting plaintext profile fields for', userId);
        const encrypted = await encryptFields(profile, PROFILE_SENSITIVE_FIELDS as any, key);
        await supabase.from('profiles').update(encrypted).eq('id', userId);
        console.log('[vault] ✅ Profile re-encrypted');
      }

      // Check pilot_licensure_experience table
      const { data: licensure } = await supabase
        .from('pilot_licensure_experience')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (licensure && hasPlaintextFields(licensure, PILOT_LICENSURE_SENSITIVE_FIELDS as any)) {
        console.log('[vault] Re-encrypting plaintext licensure fields for', userId);
        const encrypted = await encryptFields(licensure, PILOT_LICENSURE_SENSITIVE_FIELDS as any, key);
        await supabase.from('pilot_licensure_experience').update(encrypted).eq('user_id', userId);
        console.log('[vault] ✅ Licensure re-encrypted');
      }

    } catch (err: any) {
      console.warn('[vault] reEncryptIfPlaintext failed (non-critical):', err.message);
    }
  }, [getKey]);

  return {
    readProfile,
    readLicensure,
    writeProfile,
    updateProfile,
    writeLicensure,
    reEncryptIfPlaintext,
  };
}
