/**
 * DEPRECATED — Use Supabase Edge Function instead
 * 
 * ⚠️ This route is deprecated as of 2026-06-08 for security reasons:
 * - Had zero authentication (anyone could create wallets for any pilot)
 * - Had permissive CORS (Allow-Origin: * + Credentials: true)
 * - Accepted pilotId from request body (no server-side validation)
 * 
 * Migration:
 * Replace calls to POST /api/wallet/create with:
 *   supabase.functions.invoke('wallet-create', {
 *     body: { email, password, issuers }
 *     // pilotId is now server-side derived from authenticated user
 *   })
 * 
 * New endpoint validates JWT and enforces CORS allowlist.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NextApiRequest = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NextApiResponse = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Redirect to new Edge Function
  return res.status(410).json({
    error: 'Gone: This endpoint is deprecated',
    message: 'Use the Supabase Edge Function wallet-create instead',
    migration: 'https://docs.pilotrecognition.com/wallet-api (internal docs)'
  });
}

/*
// OLD CODE — REMOVED FOR SECURITY
// See git history for previous implementation
// Do not resurrect without adding authentication and CORS fixes

    // Step 1: Create wallet in Truvera
    const walletResponse = await fetch(`${TRUVERA_API_URL}/wallets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TRUVERA_API_KEY}`,
        'X-Pilot-Id': pilotId
      },
      body: JSON.stringify({
        email,
        password,
        metadata: {
          pilotId,
          platform: 'PilotRecognition',
          createdAt: new Date().toISOString()
        }
      })
    });

    if (!walletResponse.ok) {
      const errorData = await walletResponse.json().catch(() => ({}));
      console.error('Truvera wallet creation failed:', errorData);
      return res.status(500).json({ 
        error: 'Failed to create Truvera wallet',
        details: errorData.message || 'Unknown error'
      });
    }

    const walletData: TruveraWalletResponse = await walletResponse.json();

    // Step 2: Configure trusted issuers
    const approvedIssuers = issuers.filter(i => i.approved);
    
    if (approvedIssuers.length > 0) {
      const issuersResponse = await fetch(
        `${TRUVERA_API_URL}/wallets/${walletData.walletId}/issuers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TRUVERA_API_KEY}`
          },
          body: JSON.stringify({
            issuers: approvedIssuers.map(issuer => ({
              did: issuer.did,
              name: issuer.name,
              approved: true,
              permissions: ['issue', 'view', 'verify'],
              approvedAt: new Date().toISOString()
            }))
          })
        }
      );

      if (!issuersResponse.ok) {
        console.error('Failed to configure issuers:', await issuersResponse.text());
        // Continue anyway - issuers can be added later
      }
    }

    // Step 3: Log creation for audit
    console.warn('[wallet/create] Wallet created:', {
      pilotId,
      walletId: walletData.walletId,
      did: walletData.did,
      issuers: approvedIssuers.map(i => i.name),
      timestamp: new Date().toISOString()
    });

    // Return wallet info
    return res.status(201).json({
      success: true,
      walletId: walletData.walletId,
      did: walletData.did,
      createdAt: walletData.createdAt,
      issuersConfigured: approvedIssuers.length
    });

  } catch (error) {
    console.error('Wallet creation error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
