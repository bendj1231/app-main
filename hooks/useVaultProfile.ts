/**
 * useVaultProfile — Plaintext profile read/write hook
 *
 * Reads/writes profiles and licensure through the Worker API without any
 * client-side encryption. The D1 table is the system of record and the
 * application holds the data controller role, so data is stored as-is.
 */

import { useCallback } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

export function useVaultProfile() {
  const { callApi } = useWorkerAuth();

  /**
   * Read pilot profile from `profiles` table.
   */
  const readProfile = useCallback(async (userId: string) => {
    try {
      const data = await callApi<Record<string, unknown>>('getProfile', { id: userId });
      return { data: data || null, error: null };
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }, [callApi]);

  /**
   * Read pilot licensure record from `pilot_licensure_experience`.
   */
  const readLicensure = useCallback(async (userId: string) => {
    try {
      const data = await callApi<Record<string, unknown>>('getLicensure', { user_id: userId });
      return { data: data || null, error: null };
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }, [callApi]);

  /**
   * Write (insert) a new profile row.
   */
  const writeProfile = useCallback(async (userId: string, profileData: Record<string, unknown>) => {
    try {
      const data = await callApi('createProfile', { id: userId, ...profileData });
      return { data, error: null };
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }, [callApi]);

  /**
   * Update an existing profile row.
   */
  const updateProfile = useCallback(async (userId: string, updates: Record<string, unknown>) => {
    try {
      const data = await callApi('updateProfile', { id: userId, ...updates });
      return { data, error: null };
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }, [callApi]);

  /**
   * Write (upsert) pilot_licensure_experience.
   */
  const writeLicensure = useCallback(async (userId: string, data: Record<string, unknown>) => {
    try {
      const result = await callApi('saveLicensure', { user_id: userId, ...data });
      return { data: result, error: null };
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }, [callApi]);

  /**
   * No-op: encryption layer removed. Kept for API compatibility.
   */
  const reEncryptIfPlaintext = useCallback(async () => {
    return;
  }, []);

  return {
    readProfile,
    readLicensure,
    writeProfile,
    updateProfile,
    writeLicensure,
    reEncryptIfPlaintext,
  };
}
