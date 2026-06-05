import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';


export type CheckStatus = 'pending' | 'in_review' | 'verified' | 'failed' | 'expired' | 'not_required';
export type WalletStatus = 'not_started' | 'in_progress' | 'verified' | 'partially_verified';

export interface VerificationCheck {
  id: string;
  check_type: 'identity' | 'education' | 'professional_qualification';
  status: CheckStatus;
  verified_at: string | null;
  notes: string | null;
  updated_at: string | null;
}

export interface VerificationWallet {
  id: string;
  wallet_status: WalletStatus;
  wallet_completeness_pct: number;
  is_pre_cleared: boolean;
  pre_cleared_at: string | null;
  initiated_at: string | null;
  last_updated_at: string | null;
  veremark_order_id: string | null;
  checks: VerificationCheck[];
}

export function useVerificationWallet() {
  const { currentUser } = useAuth();
  const [wallet, setWallet] = useState<VerificationWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = useCallback(async () => {
    if (!currentUser?.id) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const { data: walletRow, error: walletErr } = await supabase
        .from('pilot_verification_wallet')
        .select('*')
        .eq('pilot_id', currentUser.id)
        .maybeSingle();

      if (walletErr) throw walletErr;

      if (!walletRow) {
        setWallet(null);
        setLoading(false);
        return;
      }

      const { data: checks, error: checksErr } = await supabase
        .from('verification_checks')
        .select('id, check_type, status, verified_at, notes, updated_at')
        .eq('wallet_id', walletRow.id)
        .order('check_type');

      if (checksErr) throw checksErr;

      setWallet({ ...walletRow, checks: checks ?? [] });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load verification wallet');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => { loadWallet(); }, [loadWallet]);

  const initiateVerification = useCallback(async () => {
    if (!currentUser?.id) return;
    setInitiating(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const baseUrl = (import.meta as any).env?.VITE_FIREBASE_FUNCTIONS_URL as string;

      const res = await window.fetch(`${baseUrl}/initiateVerification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ pilot_id: currentUser.id }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to initiate verification');
      await loadWallet();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to start verification');
    } finally {
      setInitiating(false);
    }
  }, [currentUser?.id, loadWallet]);

  const CHECK_LABELS: Record<string, string> = {
    identity: 'Identity',
    education: 'Education',
    professional_qualification: 'License & Medical',
  };

  return { wallet, loading, initiating, error, refetch: loadWallet, initiateVerification, CHECK_LABELS };
}
