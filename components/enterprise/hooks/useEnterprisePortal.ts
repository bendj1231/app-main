/**
 * useEnterprisePortal — Auth0 + Cloudflare Worker bridge for enterprise accounts.
 *
 * STRICTLY SEPARATE from pilot profiles. Enterprise accounts live in D1
 * `enterprise_profiles` and are linked by Auth0 sub.
 *
 * Replaces the old useEnterpriseAuth (Supabase email/password).
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useWorkerAuth } from '@/src/hooks/useWorkerAuth';

export interface EnterpriseAccount {
  id: string;
  auth0_id?: string;
  company_name: string;
  airline_name?: string;
  airline_iata_code?: string;
  airline_logo_url?: string;
  airline_website?: string;
  company_description?: string;
  industry?: string;
  account_type?: string;
  contact_email?: string;
  contact_phone?: string;
  billing_email?: string;
  website?: string;
  country?: string;
  base_locations?: string[];
  fleet_information?: Record<string, unknown>;
  contact_information?: Record<string, unknown>;
  employee_count?: number;
  is_active?: number;
  account_tier?: string;
  can_pull_verified_profiles?: number;
  can_view_pilot_details?: number;
  can_export_data?: number;
  max_pathway_cards?: number;
  max_interest_views_per_month?: number;
  stripe_customer_id?: string;
  tier_expires_at?: string;
  subscription_status?: string;
  subscription_tier?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export function useEnterprisePortal() {
  const { isAuthenticated, isLoading: auth0Loading, user: auth0User } = useAuth0();
  const { callApi } = useWorkerAuth();

  const [account, setAccount] = useState<EnterpriseAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccount = useCallback(async () => {
    if (!auth0User?.sub) return;
    try {
      setLoading(true);
      const row = await callApi<EnterpriseAccount>('getEnterpriseByAuth0', { auth0_id: auth0User.sub });
      setAccount(row);
      setError(null);
    } catch (err: any) {
      setAccount(null);
      setError(err?.message || 'No enterprise account found');
    } finally {
      setLoading(false);
    }
  }, [auth0User?.sub, callApi]);

  useEffect(() => {
    if (auth0Loading) return;
    if (isAuthenticated && auth0User?.sub) {
      loadAccount();
    } else {
      setAccount(null);
      setLoading(false);
      if (!isAuthenticated) setError(null);
    }
  }, [isAuthenticated, auth0Loading, auth0User?.sub, loadAccount]);

  const refreshAccount = useCallback(async () => {
    await loadAccount();
  }, [loadAccount]);

  const updateAccount = useCallback(
    async (data: Partial<EnterpriseAccount>) => {
      if (!account?.id) return null;
      try {
        const updated = await callApi<EnterpriseAccount>('updateEnterprise', { id: account.id, ...data });
        setAccount(updated);
        return updated;
      } catch (err: any) {
        setError(err?.message || 'Update failed');
        return null;
      }
    },
    [account?.id, callApi]
  );

  const hasAccess = Boolean(account && account.is_active);

  return {
    // Auth0 identity
    auth0User,
    isAuthenticated,
    auth0Loading,

    // Enterprise account (D1)
    account,
    hasAccess,
    loading,
    error,

    // Actions
    refreshAccount,
    updateAccount,

    // Low-level Worker API access for child components
    callApi,
  };
}
