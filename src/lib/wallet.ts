import { supabase } from './supabase';

const PILOT_ISSUER_URL = (typeof window !== 'undefined' && (import.meta as any).env?.VITE_PILOT_ISSUER_URL)
  ? (import.meta as any).env.VITE_PILOT_ISSUER_URL
  : 'https://issuer.pilotrecognition.com';

// PilotRecognition Wallet API — native browser wallet, no external dependency
const PILOT_WALLET_API = (typeof window !== 'undefined' && (import.meta as any).env?.VITE_WALT_WALLET_API)
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

// ── Client-side DID wallet (100% browser-native, $0, works on Vercel) ────────

export async function createClientWallet(
  profileId: string,
  auth0Id: string
): Promise<{ did: string; publicKeyJwk: JsonWebKey; walletId: string }> {
  // ── Prompt browser to save a passkey (Google Password Manager / iCloud Keychain) ──
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = new TextEncoder().encode(profileId.slice(0, 64));
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'PilotRecognition', id: window.location.hostname },
        user: { id: userId, name: auth0Id, displayName: 'Pilot Wallet' },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }], // ES256
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // Forces device credential (FaceID/Touch/Google PM)
          residentKey: 'preferred',
          userVerification: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      },
    }) as PublicKeyCredential | null;

    if (credential) {
      // Store the passkey credential_id so we can use it for future sign-ins
      const credId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      await supabase.from('pilot_passkeys').upsert({
        user_id: auth0Id,
        credential_id: credId,
        public_key: new Uint8Array((credential.response as AuthenticatorAttestationResponse).getPublicKey() || []),
        sign_count: 0,
        device_name: 'Platform Authenticator',
        transports: ['internal'],
      }, { onConflict: 'credential_id' });
    }
  } catch (passkeyErr) {
    // Non-fatal — user may have cancelled or device doesn't support passkeys
    console.warn('⚠️ Passkey creation skipped:', passkeyErr instanceof Error ? passkeyErr.message : passkeyErr);
  }

  // Generate cryptographic keypair entirely in the browser
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
  );
  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);

  // Build did:key from the public key
  const pubKeyBytes = new TextEncoder().encode(JSON.stringify(publicKeyJwk));
  const hashBuf = await crypto.subtle.digest('SHA-256', pubKeyBytes);
  const hashB64 = btoa(String.fromCharCode(...new Uint8Array(hashBuf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const did = `did:key:z${hashB64}`;

  // walletId = SHA-256 of profileId+auth0Id — stable, deterministic
  const walletId = await sha256(`${profileId}:${auth0Id}`);

  // Store DID in Supabase pilot_dids
  await supabase.from('pilot_dids').upsert({
    profile_id: profileId,
    auth0_id: auth0Id,
    did,
    did_method: 'did:key',
    public_key_jwk: publicKeyJwk,
  }, { onConflict: 'auth0_id' });

  // Store walletId + DID directly on profiles for easy querying
  await supabase.from('profiles').update({
    wallet_id: walletId,
    wallet_email: `${profileId}@wallet.pilotrecognition.com`,
    wallet_did: did,
  }).eq('id', profileId);

  return { did, publicKeyJwk, walletId };
}

export async function getOrCreateClientWallet(
  profileId: string,
  auth0Id: string
): Promise<{ did: string; walletId: string }> {
  // Check existing
  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_id')
    .eq('id', profileId)
    .single();

  const { data: didData } = await supabase
    .from('pilot_dids')
    .select('did')
    .eq('auth0_id', auth0Id)
    .single();

  if (profile?.wallet_id && didData?.did) {
    return { did: didData.did, walletId: profile.wallet_id };
  }

  // Create new client-side wallet
  const { did, walletId } = await createClientWallet(profileId, auth0Id);
  return { did, walletId };
}

// ── PilotRecognition Wallet API helpers (legacy compatibility) ─────────────

export async function registerPilotWallet(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; token?: string; walletId?: string; error?: string }> {
  try {
    // Step 1: Register account
    const regRes = await fetch(`${PILOT_WALLET_API}/wallet-api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', name, email, password }),
    });
    if (!regRes.ok && regRes.status !== 409) {
      throw new Error(`Register failed: ${regRes.status}`);
    }

    // Step 2: Login to get token
    const loginRes = await fetch(`${PILOT_WALLET_API}/wallet-api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', email, password }),
    });
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
    const loginData = await loginRes.json();
    const token = loginData.token;

    // Step 3: Get wallet ID
    const walletsRes = await fetch(`${PILOT_WALLET_API}/wallet-api/wallet/accounts/wallets`, {
      headers: { 'Authorization': `Bearer ${token}` },
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
  auth0Id: string,
  profileId: string,
  email: string
): Promise<{ walletId: string; token: string } | null> {
  // Check if already registered in Supabase
  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_id, wallet_email')
    .eq('id', profileId)
    .single();

  if (profile?.wallet_id) {
    // Re-login to get fresh token
    const password = `PR-${auth0Id.replace(/\|/g, '-')}`;
    const loginRes = await fetch(`${PILOT_WALLET_API}/wallet-api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', email: profile.wallet_email, password }),
    });
    if (!loginRes.ok) return null;
    const { token } = await loginRes.json();
    return { walletId: profile.wallet_id, token };
  }

  // Register new wallet
  const password = `PR-${auth0Id.replace(/\|/g, '-')}`;
  const walletEmail = `${profileId}@wallet.pilotrecognition.com`;
  const result = await registerPilotWallet(walletEmail, password, `Pilot-${profileId.slice(0, 8)}`);
  if (!result.success || !result.walletId || !result.token) return null;

  // Store wallet_id in Supabase
  await supabase.from('profiles').update({
    wallet_id: result.walletId,
    wallet_email: walletEmail,
  }).eq('id', profileId);

  return { walletId: result.walletId, token: result.token };
}

// ── Credential issuance ─────────────────────────────────────────────────────

export interface IssuedCredential {
  credentialJwt: string;
  credentialHash: string;
  credentialOfferUrl: string;
  subjectDid: string;
  walletId: string;
}

export async function issueAndStoreCredential(
  auth0Id: string,
  profileId: string,
  totalHours: number,
  storageBackend: 'supabase' | 'firebase' | 'both' = 'both'
): Promise<{ success: boolean; credential?: IssuedCredential; error?: string }> {
  try {
    const now = new Date();
    const issuanceDate = now.toISOString();
    const expirationDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString();

    // Get or create client-side DID wallet (browser-native, $0, no Docker)
    const { did: subjectDid, walletId } = await getOrCreateClientWallet(profileId, auth0Id);

    // Onboard issuer key from legacy external issuer (deprecated, use issuer-sign)
    const onboardRes = await fetch(`${PILOT_ISSUER_URL}/onboard/issuer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: { backend: 'jwk', keyType: 'secp256r1' },
        did: { method: 'jwk' }
      })
    });
    if (!onboardRes.ok) throw new Error('External issuer onboard failed');
    const onboardData = await onboardRes.json();

    // Issue credential via OID4VCI (legacy path)
    const issueRes = await fetch(`${PILOT_ISSUER_URL}/openid4vc/jwt/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'accept': 'text/plain' },
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
          credentialSubject: {
            id: subjectDid,
            flightHours: totalHours,
            auth0Id,
          },
        },
      })
    });
    if (!issueRes.ok) throw new Error(`External issuer failed: ${issueRes.status}`);
    const credentialOfferUrl = await issueRes.text();
    const credentialJwt = credentialOfferUrl;
    const credentialHash = await sha256(credentialJwt);

    // Store credential in Supabase
    const { error: dbError } = await supabase.from('pilot_credentials').insert({
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
      metadata: {
        issuerDid: onboardData.issuerDid,
        walletId: walletId || null,
      },
    });
    if (dbError) throw new Error(`Supabase store failed: ${dbError.message}`);

    return {
      success: true,
      credential: {
        credentialJwt,
        credentialHash,
        credentialOfferUrl,
        subjectDid,
        walletId: walletId || '',
      }
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[wallet] issueAndStoreCredential failed:', message);
    return { success: false, error: message };
  }
}

// ── Wallet API pass-through ─────────────────────────────────────────────────

export async function getWalletCredentials(profileId: string) {
  const { data } = await supabase
    .from('pilot_credentials')
    .select('*')
    .eq('profile_id', profileId)
    .eq('status', 'active')
    .order('issued_at', { ascending: false });
  return data || [];
}

export async function getWalletDid(profileId: string) {
  const { data } = await supabase
    .from('pilot_dids')
    .select('did, did_method, created_at')
    .eq('profile_id', profileId)
    .single();
  return data;
}

// ── Self-Hosted Issuer (Production Signing via issuer-sign edge function) ────

export async function issueAndStoreCredentialSelfHosted(
  auth0Id: string,
  profileId: string,
  licenseNumber: string,
  licenseType: string = 'Commercial Pilot License',
  countryOfLicense: string = 'CAAP',
  licenseExpiry: string | null = null,
  totalHours: number = 0
): Promise<{ success: boolean; credential?: IssuedCredential; error?: string }> {
  try {
    // Get or create client-side DID wallet
    const { did: subjectDid, walletId } = await getOrCreateClientWallet(profileId, auth0Id);

    // Call our self-hosted issuer (no Walt.id dependency)
    const { data: issueData, error: issueError } = await supabase.functions.invoke('issuer-sign', {
      body: {
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
      },
    });

    if (issueError || !issueData?.success) {
      throw new Error(issueError?.message || issueData?.error || 'Issuer-sign failed');
    }

    // Store the issued credential in database
    const { error: dbError } = await supabase.from('pilot_credentials').insert({
      profile_id: profileId,
      auth0_id: auth0Id,
      credential_type: 'PilotLicenseVC',
      issuer_did: issueData.issuer_did,
      subject_did: subjectDid,
      credential_offer_url: null, // Self-hosted doesn't use offer URLs
      credential_jwt: JSON.stringify(issueData.signed_credential),
      credential_hash: issueData.signed_credential.proof?.proofValue?.slice(0, 64),
      source_provider: 'issuer-sign',
      total_hours: totalHours,
      issued_at: issueData.issued_at,
      expires_at: licenseExpiry,
      status: 'active',
      storage_backend: 'supabase',
      signed_credential: issueData.signed_credential,
      proof_value: issueData.signed_credential.proof?.proofValue,
      metadata: {
        credential_id: issueData.credential_id,
        issuer_did: issueData.issuer_did,
        walletId: walletId || null,
        self_hosted: true,
      },
    });

    if (dbError) throw new Error(`Supabase store failed: ${dbError.message}`);

    return {
      success: true,
      credential: {
        credentialJwt: JSON.stringify(issueData.signed_credential),
        credentialHash: issueData.signed_credential.proof?.proofValue?.slice(0, 64),
        credentialOfferUrl: '', // No offer URL for self-hosted
        subjectDid,
        walletId: walletId || '',
      }
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[wallet] issueAndStoreCredentialSelfHosted failed:', message);
    return { success: false, error: message };
  }
}
