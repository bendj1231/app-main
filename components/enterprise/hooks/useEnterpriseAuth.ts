import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';

const FIREBASE_BASE = 'https://us-central1-pilotrecognition-airline.cloudfunctions.net';

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
      .select('*')
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
