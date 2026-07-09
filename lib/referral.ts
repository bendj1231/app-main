import { api } from './d1-api';

const APP_URL = typeof window !== 'undefined'
  ? window.location.origin
  : 'https://pilotrecognition.com';

export async function getOrCreateReferralCode(
  accessToken: string,
  auth0Id: string,
  profileId: string
): Promise<string | null> {
  try {
    // Referral codes live in the Recognition+ trace DB (DB_TRACE)
    const rows = await api(accessToken, 'queryTable', {
      table: 'recognition_plus_referrals',
      operation: 'select',
      dbName: 'DB_TRACE',
      where: { profile_id: profileId, is_active: 1 },
      limit: 1,
    }) as Record<string, unknown>[];
    const referral = rows?.[0];

    if (referral?.['referral_code']) return referral['referral_code'] as string;

    const res = await api(accessToken, 'generateReferral', { profileId, user_id: profileId }) as Record<string, unknown>;
    return (res?.referralCode as string | null) ?? (res?.referral_code as string | null) ?? null;
  } catch {
    return null;
  }
}

export function buildReferralLink(referralCode: string): string {
  return `${APP_URL}/become-member?ref=${referralCode}`;
}

export async function applyReferralCode(
  accessToken: string,
  referralCode: string,
  profileId: string
): Promise<void> {
  if (!referralCode || !profileId) return;
  await api(accessToken, 'queryTable', {
    table: 'profiles',
    operation: 'update',
    dbName: 'DB_PROFILES',
    id: profileId,
    data: { referred_by_code: referralCode },
  });
}

export async function getReferralStats(
  accessToken: string,
  profileId: string
): Promise<{
  referralCode: string | null;
  referralLink: string | null;
  credits: number;
  totalReferred: number;
}> {
  const rows = await api(accessToken, 'queryTable', {
    table: 'recognition_plus_referrals',
    operation: 'select',
    dbName: 'DB_TRACE',
    where: { profile_id: profileId, is_active: 1 },
    limit: 1,
  }) as Record<string, unknown>[];
  const referral = rows?.[0];

  const referrals = await api(accessToken, 'queryTable', {
    table: 'referrals',
    operation: 'select',
    dbName: 'DB_OPS',
    where: { referrer_profile_id: profileId, status: 'credited' },
    limit: 1000,
  }) as Record<string, unknown>[];

  const code = (referral?.['referral_code'] as string) ?? null;
  return {
    referralCode: code,
    referralLink: code ? buildReferralLink(code) : null,
    credits: (referral?.['referral_credits'] as number) ?? 0,
    totalReferred: referrals?.length ?? 0,
  };
}
