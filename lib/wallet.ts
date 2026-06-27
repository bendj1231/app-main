import { api } from './d1-api';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const PILOT_ISSUER_URL = (typeof window !== 'undefined' && (import.meta as any).env?.VITE_PILOT_ISSUER_URL)
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  ? (import.meta as any).env.VITE_PILOT_ISSUER_URL
  : 'https://issuer.pilotrecognition.com';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const PILOT_WALLET_API = (typeof window !== 'undefined' && (import.meta as any).env?.VITE_WALT_WALLET_API)
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  ? (import.meta as any).env.VITE_WALT_WALLET_API
  : '';

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createClientWallet(
  accessToken: string,
  profileId: string,
  auth0Id: string
): Promise<{ did: string; publicKeyJwk: JsonWebKey; walletId: string }> {
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = new TextEncoder().encode(profileId.slice(0, 64));
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'PilotRecognition', id: window.location.hostname },
        user: { id: userId, name: auth0Id, displayName: 'Pilot Wallet' },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
        timeout: 60000,
        attestation: 'none',
      },
    }) as PublicKeyCredential | null;

    if (credential) {
      const credId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      await api(accessToken, 'queryTable', {
        table: 'pilot_passkeys',
        operation: 'insert',
        data: {
          user_id: auth0Id,
          credential_id: credId,
          public_key: new Uint8Array((credential.response as AuthenticatorAttestationResponse).getPublicKey() || []),
          sign_count: 0,
          device_name: 'Platform Authenticator',
          transports: ['internal'],
        },
      });
    }
  } catch (passkeyErr) {
    console.warn('Passkey creation skipped:', passkeyErr instanceof Error ? passkeyErr.message : passkeyErr);
  }

  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']
  );
  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);

  const pubKeyBytes = new TextEncoder().encode(JSON.stringify(publicKeyJwk));
  const hashBuf = await crypto.subtle.digest('SHA-256', pubKeyBytes);
  const hashB64 = btoa(String.fromCharCode(...new Uint8Array(hashBuf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const did = `did:key:z${hashB64}`;

  const walletId = await sha256(`${profileId}:${auth0Id}`);

  await api(accessToken, 'queryTable', {
    table: 'pilot_dids',
    operation: 'insert',
    data: { profile_id: profileId, auth0_id: auth0Id, did, did_method: 'did:key', public_key_jwk: publicKeyJwk },
  });

  await api(accessToken, 'queryTable', {
    table: 'profiles',
    operation: 'update',
    id: profileId,
    data: { wallet_id: walletId, wallet_email: `${profileId}@wallet.pilotrecognition.com`, wallet_did: did },
  });

  return { did, publicKeyJwk, walletId };
}

export async function getOrCreateClientWallet(
  accessToken: string,
  profileId: string,
  auth0Id: string
): Promise<{ did: string; walletId: string }> {
  const profileRows = await api(accessToken, 'queryTable', {
    table: 'profiles', operation: 'select', where: { id: profileId }, limit: 1,
  }) as Record<string, unknown>[];
  const profile = profileRows?.[0];

  const didRows = await api(accessToken, 'queryTable', {
    table: 'pilot_dids', operation: 'select', where: { auth0_id: auth0Id }, limit: 1,
  }) as Record<string, unknown>[];
  const didData = didRows?.[0];

  if (profile?.wallet_id && didData?.did) {
    return { did: String(didData.did), walletId: String(profile.wallet_id) };
  }

  const { did, walletId } = await createClientWallet(accessToken, profileId, auth0Id);
  return { did, walletId };
}

export async function registerPilotWallet(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; token?: string; walletId?: string; error?: string }> {
  try {
    const regRes = await fetch(`${PILOT_WALLET_API}/wallet-api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', name, email, password }),
    });
    if (!regRes.ok && regRes.status !== 409) throw new Error(`Register failed: ${regRes.status}`);

    const loginRes = await fetch(`${PILOT_WALLET_API}/wallet-api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', email, password }),
    });
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
    const { token } = await loginRes.json();

    const walletsRes = await fetch(`${PILOT_WALLET_API}/wallet-api/wallet/accounts/wallets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!walletsRes.ok) throw new Error(`Get wallets failed: ${walletsRes.status}`);
    const walletsData = await walletsRes.json();
    const walletId = walletsData.wallets?.[0]?.id;
    if (!walletId) throw new Error('No wallet found after registration');

    return { success: true, token, walletId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[wallet] registerPilotWallet failed:', message);
    return { success: false, error: message };
  }
}

export async function getOrCreatePilotWallet(
  accessToken: string,
  auth0Id: string,
  profileId: string,
  _email: string
): Promise<{ walletId: string; token: string } | null> {
  const rows = await api(accessToken, 'queryTable', {
    table: 'profiles', operation: 'select', where: { id: profileId }, limit: 1,
  }) as Record<string, unknown>[];
  const profile = rows?.[0];

  if (profile?.wallet_id) {
    const password = `PR-${auth0Id.replace(/\|/g, '-')}`;
    const loginRes = await fetch(`${PILOT_WALLET_API}/wallet-api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', email: profile.wallet_email, password }),
    });
    if (!loginRes.ok) return null;
    const { token } = await loginRes.json();
    return { walletId: String(profile.wallet_id), token };
  }

  const password = `PR-${auth0Id.replace(/\|/g, '-')}`;
  const walletEmail = `${profileId}@wallet.pilotrecognition.com`;
  const result = await registerPilotWallet(walletEmail, password, `Pilot-${profileId.slice(0, 8)}`);
  if (!result.success || !result.walletId || !result.token) return null;

  await api(accessToken, 'queryTable', {
    table: 'profiles',
    operation: 'update',
    id: profileId,
    data: { wallet_id: result.walletId, wallet_email: walletEmail },
  });

  return { walletId: result.walletId, token: result.token };
}

export interface IssuedCredential {
  credentialJwt: string;
  credentialHash: string;
  credentialOfferUrl: string;
  subjectDid: string;
  walletId: string;
}

export async function issueAndStoreCredential(
  accessToken: string,
  auth0Id: string,
  profileId: string,
  totalHours: number,
  storageBackend: 'supabase' | 'firebase' | 'both' = 'both'
): Promise<{ success: boolean; credential?: IssuedCredential; error?: string }> {
  try {
    const now = new Date();
    const issuanceDate = now.toISOString();
    const expirationDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString();

    const { did: subjectDid, walletId } = await getOrCreateClientWallet(accessToken, profileId, auth0Id);

    const onboardRes = await fetch(`${PILOT_ISSUER_URL}/onboard/issuer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: { backend: 'jwk', keyType: 'secp256r1' }, did: { method: 'jwk' } }),
    });
    if (!onboardRes.ok) throw new Error('External issuer onboard failed');
    const onboardData = await onboardRes.json();

    const issueRes = await fetch(`${PILOT_ISSUER_URL}/openid4vc/jwt/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: 'text/plain' },
      body: JSON.stringify({
        issuerKey: { type: 'jwk', jwk: onboardData.issuerKey.jwk },
        issuerDid: onboardData.issuerDid,
        credentialConfigurationId: 'OpenBadgeCredential_jwt_vc_json',
        credentialData: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'FlightHoursVC'],
          issuer: onboardData.issuerDid,
          issuanceDate,
          expirationDate,
          credentialSubject: { id: subjectDid, flightHours: totalHours, auth0Id },
        },
      }),
    });
    if (!issueRes.ok) throw new Error(`External issuer failed: ${issueRes.status}`);
    const credentialOfferUrl = await issueRes.text();
    const credentialJwt = credentialOfferUrl;
    const credentialHash = await sha256(credentialJwt);

    await api(accessToken, 'queryTable', {
      table: 'pilot_credentials',
      operation: 'insert',
      data: {
        profile_id: profileId,
        auth0_id: auth0Id,
        credential_type: 'FlightHoursVC',
        issuer_did: onboardData.issuerDid,
        subject_did: subjectDid,
        credential_offer_url: credentialOfferUrl,
        credential_jwt: credentialJwt,
        credential_hash: credentialHash,
        source_provider: 'pilot.wallet',
        total_hours: totalHours,
        issued_at: issuanceDate,
        expires_at: expirationDate,
        status: 'active',
        storage_backend: storageBackend,
        metadata: JSON.stringify({ issuerDid: onboardData.issuerDid, walletId: walletId || null }),
      },
    });

    return {
      success: true,
      credential: {
        credentialJwt,
        credentialHash,
        credentialOfferUrl,
        subjectDid,
        walletId: walletId || '',
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[wallet] issueAndStoreCredential failed:', message);
    return { success: false, error: message };
  }
}

export async function getWalletCredentials(accessToken: string, profileId: string) {
  return api(accessToken, 'queryTable', {
    table: 'pilot_credentials',
    operation: 'select',
    where: { profile_id: profileId, status: 'active' },
    orderBy: 'issued_at DESC',
  }) as Promise<Record<string, unknown>[]>;
}

export async function getWalletDid(accessToken: string, profileId: string) {
  const rows = await api(accessToken, 'queryTable', {
    table: 'pilot_dids',
    operation: 'select',
    where: { profile_id: profileId },
    limit: 1,
  }) as Record<string, unknown>[];
  return rows?.[0] ?? null;
}

export async function issueAndStoreCredentialSelfHosted(
  accessToken: string,
  auth0Id: string,
  profileId: string,
  licenseNumber: string,
  licenseType: string = 'Commercial Pilot License',
  countryOfLicense: string = 'CAAP',
  licenseExpiry: string | null = null,
  totalHours: number = 0
): Promise<{ success: boolean; credential?: IssuedCredential; error?: string }> {
  try {
    const { did: subjectDid, walletId } = await getOrCreateClientWallet(accessToken, profileId, auth0Id);

    const issueRes = await api(accessToken, 'issuerSign', {
      auth0_id: auth0Id,
      profile_id: profileId,
      subject_did: subjectDid,
      credential_type: 'PilotLicenseVC',
      credential_data: {
        licenseNumber,
        licenseType,
        pelNumber: licenseNumber.replace(/[^0-9]/g, ''),
        issuingAuthority: countryOfLicense,
        issuingCountry: countryOfLicense,
        expiryDate: licenseExpiry,
        totalHours,
        verificationMethod: 'Self-Asserted (Account Creation)',
      },
    }) as {
      success: boolean;
      issuer_did?: string;
      signed_credential?: Record<string, unknown>;
      credential_id?: string;
      issued_at?: string;
      error?: string;
    };

    if (!issueRes?.success) {
      throw new Error(issueRes?.error || 'Issuer-sign failed');
    }

    const signedCred = issueRes.signed_credential ?? {};
    const proofValue = (signedCred.proof as Record<string, unknown>)?.proofValue as string | undefined;

    await api(accessToken, 'queryTable', {
      table: 'pilot_credentials',
      operation: 'insert',
      data: {
        profile_id: profileId,
        auth0_id: auth0Id,
        credential_type: 'PilotLicenseVC',
        issuer_did: issueRes.issuer_did,
        subject_did: subjectDid,
        credential_offer_url: null,
        credential_jwt: JSON.stringify(signedCred),
        credential_hash: proofValue?.slice(0, 64),
        source_provider: 'issuer-sign',
        total_hours: totalHours,
        issued_at: issueRes.issued_at,
        expires_at: licenseExpiry,
        status: 'active',
        storage_backend: 'supabase',
        signed_credential: JSON.stringify(signedCred),
        proof_value: proofValue,
        metadata: JSON.stringify({
          credential_id: issueRes.credential_id,
          issuer_did: issueRes.issuer_did,
          walletId: walletId || null,
          self_hosted: true,
        }),
      },
    });

    return {
      success: true,
      credential: {
        credentialJwt: JSON.stringify(signedCred),
        credentialHash: proofValue?.slice(0, 64) || '',
        credentialOfferUrl: '',
        subjectDid,
        walletId: walletId || '',
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[wallet] issueAndStoreCredentialSelfHosted failed:', message);
    return { success: false, error: message };
  }
}
