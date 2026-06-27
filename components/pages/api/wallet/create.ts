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

