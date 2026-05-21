import { supabase } from './supabase';

const WALT_ISSUER_URL = (typeof window !== 'undefined' && (import.meta as any).env?.VITE_WALT_ISSUER_URL)
  ? (import.meta as any).env.VITE_WALT_ISSUER_URL
  : 'https://issuer.portal.walt.id';

// Walt.id Wallet API — only used when Docker/VPS is running, gracefully skipped otherwise
const WALT_WALLET_API = (typeof window !== 'undefined' && (import.meta as any).env?.VITE_WALT_WALLET_API)
  ? (import.meta as any).env.VITE_WALT_WALLET_API
  : 'http://localhost:7001';

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
      console.log('✅ Passkey saved to device credential manager');
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
    walt_wallet_id: walletId,
    walt_account_email: `${profileId}@wallet.pilotrecognition.com`,
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
    .select('walt_wallet_id')
    .eq('id', profileId)
    .single();

  const { data: didData } = await supabase
    .from('pilot_dids')
    .select('did')
    .eq('auth0_id', auth0Id)
    .single();

  if (profile?.walt_wallet_id && didData?.did) {
    return { did: didData.did, walletId: profile.walt_wallet_id };
  }

  // Create new client-side wallet
  const { did, walletId } = await createClientWallet(profileId, auth0Id);
  return { did, walletId };
}

// ── Walt.id Wallet API helpers (requires Docker/VPS — gracefully skipped) ────

export async function registerWaltWallet(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; token?: string; walletId?: string; error?: string }> {
  try {
    // Step 1: Register account
    const regRes = await fetch(`${WALT_WALLET_API}/wallet-api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', name, email, password }),
    });
    if (!regRes.ok && regRes.status !== 409) {
      throw new Error(`Register failed: ${regRes.status}`);
    }

    // Step 2: Login to get token
    const loginRes = await fetch(`${WALT_WALLET_API}/wallet-api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', email, password }),
    });
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
    const loginData = await loginRes.json();
    const token = loginData.token;

    // Step 3: Get wallet ID
    const walletsRes = await fetch(`${WALT_WALLET_API}/wallet-api/wallet/accounts/wallets`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!walletsRes.ok) throw new Error(`Get wallets failed: ${walletsRes.status}`);
    const walletsData = await walletsRes.json();
    const walletId = walletsData.wallets?.[0]?.id;
    if (!walletId) throw new Error('No wallet found after registration');

    return { success: true, token, walletId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[wallet] registerWaltWallet failed:', message);
    return { success: false, error: message };
  }
}

export async function getOrCreateWaltWallet(
  auth0Id: string,
  profileId: string,
  email: string
): Promise<{ walletId: string; token: string } | null> {
  // Check if already registered in Supabase
  const { data: profile } = await supabase
    .from('profiles')
    .select('walt_wallet_id, walt_account_email')
    .eq('id', profileId)
    .single();

  if (profile?.walt_wallet_id) {
    // Re-login to get fresh token
    const password = `PR-${auth0Id.replace(/\|/g, '-')}`;
    const loginRes = await fetch(`${WALT_WALLET_API}/wallet-api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', email: profile.walt_account_email, password }),
    });
    if (!loginRes.ok) return null;
    const { token } = await loginRes.json();
    return { walletId: profile.walt_wallet_id, token };
  }

  // Register new wallet
  const password = `PR-${auth0Id.replace(/\|/g, '-')}`;
  const waltEmail = `${profileId}@wallet.pilotrecognition.com`;
  const result = await registerWaltWallet(waltEmail, password, `Pilot-${profileId.slice(0, 8)}`);
  if (!result.success || !result.walletId || !result.token) return null;

  // Store wallet_id in Supabase
  await supabase.from('profiles').update({
    walt_wallet_id: result.walletId,
    walt_account_email: waltEmail,
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

    // Onboard issuer key from walt.id issuer API (signs the credential)
    const onboardRes = await fetch(`${WALT_ISSUER_URL}/onboard/issuer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: { backend: 'jwk', keyType: 'secp256r1' },
        did: { method: 'jwk' }
      })
    });
    if (!onboardRes.ok) throw new Error('walt.id onboard failed');
    const onboardData = await onboardRes.json();

    // Issue credential via OID4VCI
    const issueRes = await fetch(`${WALT_ISSUER_URL}/openid4vc/jwt/issue`, {
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
    if (!issueRes.ok) throw new Error(`walt.id issue failed: ${issueRes.status}`);
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
      source_provider: 'walt.id',
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

// ── Wallet API pass-through (mirrors walt.id Wallet API contract) ────────────

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
