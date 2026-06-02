import type { NextApiRequest, NextApiResponse } from 'next';

interface CreateWalletRequest {
  pilotId: string;
  email: string;
  password: string;
  issuers: {
    name: string;
    did: string;
    approved: boolean;
  }[];
}

interface TruveraWalletResponse {
  walletId: string;
  did: string;
  createdAt: string;
}

const TRUVERA_API_URL = process.env.TRUVERA_API_URL || 'https://api.truvera.io';
const TRUVERA_API_KEY = process.env.TRUVERA_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pilotId, email, password, issuers }: CreateWalletRequest = req.body;

    // Validate input
    if (!pilotId || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['pilotId', 'email', 'password']
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters'
      });
    }

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
// [AUDIT] Removed console.log // line 109
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
