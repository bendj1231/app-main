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
    const profiles = await api(accessToken, 'queryTable', {
      table: 'profiles',
      operation: 'select',
      where: { id: profileId },
      limit: 1,
    }) as Record<string, unknown>[];
    const profile = profiles?.[0];

    if (profile?.referral_code) return profile.referral_code as string;

    const res = await api(accessToken, 'generateReferral', { auth0Id, profileId }) as Record<string, unknown>;
    return res?.referralCode as string | null ?? null;
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
  const profiles = await api(accessToken, 'queryTable', {
    table: 'profiles',
    operation: 'select',
    where: { id: profileId },
    limit: 1,
  }) as Record<string, unknown>[];
  const profile = profiles?.[0];

  const referrals = await api(accessToken, 'queryTable', {
    table: 'referrals',
    operation: 'select',
    where: { referrer_profile_id: profileId, status: 'credited' },
    limit: 1000,
  }) as Record<string, unknown>[];

  const code = (profile?.referral_code as string) ?? null;
  return {
    referralCode: code,
    referralLink: code ? buildReferralLink(code) : null,
    credits: (profile?.referral_credits as number) ?? 0,
    totalReferred: referrals?.length ?? 0,
  };
}
