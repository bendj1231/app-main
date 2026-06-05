import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const FIREBASE_BASE = (import.meta as any).env?.VITE_FIREBASE_FUNCTIONS_URL as string;

export interface EnterpriseAccount {
  id: string;
  profile_id: string;
  airline_name: string;
  airline_iata_code?: string;
  airline_logo_url?: string;
  airline_website?: string;
  company_description?: string;
  country?: string;
  base_locations?: string[];
  fleet_information?: Record<string, any>;
  contact_information?: Record<string, any>;
  account_type: string;
  is_active: boolean;
  // Tier & billing fields
  account_tier?: 'free' | 'data_controller' | 'enterprise';
  can_pull_verified_profiles?: boolean;
  can_view_pilot_details?: boolean;
  can_export_data?: boolean;
  max_pathway_cards?: number;
  max_interest_views_per_month?: number;
  stripe_customer_id?: string;
  billing_email?: string;
  tier_expires_at?: string;
}

export interface EnterpriseUser {
  id: string;
  email: string;
  enterprise_access: boolean;
  verified_account: boolean;
  display_name?: string;
  profile_image_url?: string;
}

export function useEnterpriseAuth() {
  const [user, setUser] = useState<EnterpriseUser | null>(null);
  const [account, setAccount] = useState<EnterpriseAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, enterprise_access, verified_account, display_name, profile_image_url')
      .eq('id', userId)
      .single();
    return profile;
  };

  const loadEnterpriseAccount = async (userId: string) => {
    const { data } = await supabase
      .from('enterprise_accounts')
      .select('id, profile_id, airline_name, airline_iata_code, airline_logo_url, airline_website, company_description, country, base_locations, fleet_information, contact_information, account_type, is_active, account_tier, can_pull_verified_profiles, can_view_pilot_details, can_export_data, max_pathway_cards, max_interest_views_per_month, stripe_customer_id, billing_email, tier_expires_at')
      .eq('profile_id', userId)
      .single();
    return data;
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await loadProfile(session.user.id);
        if (profile) {
          setUser(profile as EnterpriseUser);
          if (profile.enterprise_access) {
            const ea = await loadEnterpriseAccount(session.user.id);
            setAccount(ea);
          }
        }
      }
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await loadProfile(session.user.id);
        if (profile) {
          setUser(profile as EnterpriseUser);
          if (profile.enterprise_access) {
            const ea = await loadEnterpriseAccount(session.user.id);
            setAccount(ea);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAccount(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); return false; }

    const profile = await loadProfile(data.user.id);
    if (!profile?.enterprise_access) {
      await supabase.auth.signOut();
      setError('This account does not have enterprise access. Request access at /enterprise-access.');
      return false;
    }
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccount(null);
  };

  const refreshAccount = async () => {
    if (user?.id) {
      const ea = await loadEnterpriseAccount(user.id);
      setAccount(ea);
    }
  };

  const upsertEnterpriseAccount = async (accountData: Partial<EnterpriseAccount>) => {
    if (!user?.id) return null;
    const res = await fetch(`${FIREBASE_BASE}/upsertEnterpriseAccount`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, accountData }),
    });
    const data = await res.json();
    if (res.ok) { setAccount(data.account); return data.account; }
    throw new Error(data.error);
  };

  return { user, account, loading, error, login, logout, refreshAccount, upsertEnterpriseAccount, supabase };
}

export { supabase, FIREBASE_BASE };
