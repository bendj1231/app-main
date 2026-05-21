import { supabase } from './supabase';

const APP_URL = typeof window !== 'undefined'
  ? window.location.origin
  : 'https://pilotrecognition.com';

export async function getOrCreateReferralCode(
  auth0Id: string,
  profileId: string
): Promise<string | null> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', profileId)
      .single();

    if (profile?.referral_code) return profile.referral_code;

    const res = await supabase.functions.invoke('generate-referral', {
      body: { auth0Id, profileId },
    });

    return res.data?.referralCode ?? null;
  } catch {
    return null;
  }
}

export function buildReferralLink(referralCode: string): string {
  return `${APP_URL}/become-member?ref=${referralCode}`;
}

export async function applyReferralCode(
  referralCode: string,
  profileId: string
): Promise<void> {
  if (!referralCode || !profileId) return;
  await supabase
    .from('profiles')
    .update({ referred_by_code: referralCode })
    .eq('id', profileId)
    .is('referred_by_code', null); // only set once, never overwrite
}

export async function getReferralStats(profileId: string): Promise<{
  referralCode: string | null;
  referralLink: string | null;
  credits: number;
  totalReferred: number;
}> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code, referral_credits')
    .eq('id', profileId)
    .single();

  const { count } = await supabase
    .from('referrals')
    .select('id', { count: 'exact', head: true })
    .eq('referrer_profile_id', profileId)
    .eq('status', 'credited');

  const code = profile?.referral_code ?? null;
  return {
    referralCode: code,
    referralLink: code ? buildReferralLink(code) : null,
    credits: profile?.referral_credits ?? 0,
    totalReferred: count ?? 0,
  };
}
