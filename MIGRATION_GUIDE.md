# Cloudflare D1 Migration Guide — PilotRecognition

**Goal:** Move from Supabase Free → Cloudflare (Pages + D1 + Workers + R2)  
**Cost:** $0  
**Time:** ~2 weeks  
**Do NOT run data migration yet.** This guide sets up the infrastructure first.

---

## What Has Already Been Built

| File | What It Is |
|------|-----------|
| `cloudflare/schema.sql` | D1 SQLite database schema (all tables) |
| `cloudflare/worker.ts` | Cloudflare Worker API (replaces Supabase queries) |
| `cloudflare/wrangler.toml` | Worker deployment config |
| `src/lib/d1-api.ts` | React functions to call the Worker API |
| `docs/INFRASTRUCTURE_DECISION.md` | Team decision document |

---

## Step 1: Install Wrangler (Cloudflare CLI)

```bash
npm install -g wrangler
# or
npx wrangler --version
```

---

## Step 2: Login to Cloudflare

```bash
npx wrangler login
```

This opens a browser. Log in with your Cloudflare account.

---

## Step 3: Create the D1 Database

```bash
npx wrangler d1 create pilotrecognition-d1
```

**Copy the `database_id` from the output.**

Paste it into `cloudflare/wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "pilotrecognition-d1"
database_id = "YOUR_COPIED_DATABASE_ID"
```

---

## Step 4: Apply the Schema

```bash
npx wrangler d1 execute pilotrecognition-d1 --file=./cloudflare/schema.sql
```

This creates all tables. Verify:

```bash
npx wrangler d1 execute pilotrecognition-d1 --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## Step 5: Set Secrets

```bash
# Dodo webhook secret (so Dodo can securely call your Worker)
npx wrangler secret put DODO_WEBHOOK_SECRET
# Enter your secret when prompted

# Veremark webhook secret (optional, if using Veremark)
npx wrangler secret put VEREMARK_WEBHOOK_SECRET
```

---

## Step 6: Deploy the Worker

```bash
cd cloudflare
npx wrangler deploy
```

**Copy the deployed URL** (e.g. `https://pilotrecognition-api.your-account.workers.dev`)

---

## Step 7: Add Worker URL to Environment

In `.env.local` and `.env.production`:

```env
VITE_WORKER_API_URL=https://pilotrecognition-api.your-account.workers.dev
```

---

## Step 8: Pass Auth0 Token to D1 API Functions

The Worker validates Auth0 JWTs. Every `d1-api.ts` function requires an access token:

```typescript
import { useAuth0 } from '@auth0/auth0-react';
import { getProfile, getMe } from '@/lib/d1-api';

function MyComponent() {
  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    async function load() {
      const token = await getAccessTokenSilently();
      // Get current user's profile
      const profile = await getMe(token);
      // Or lookup by auth0_id
      // const profile = await getProfile(token, user.sub);
    }
    load();
  }, [getAccessTokenSilently]);
}
```

---

## Step 9: Replace Supabase Calls (Frontend)

### Before (Supabase)

```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('auth0_id', auth0Id)
  .single();
```

### After (D1 API)

```typescript
import { useAuth0 } from '@auth0/auth0-react';
import { getProfile } from '@/lib/d1-api';

const { getAccessTokenSilently } = useAuth0();
const token = await getAccessTokenSilently();
const data = await getProfile(token, auth0Id);
```

### Full mapping:

| Old Supabase Code | New D1 API Function |
|-------------------|-------------------|
| `supabase.from('profiles').select().eq('auth0_id', id).single()` | `getProfile(token, auth0Id)` |
| `supabase.from('profiles').insert({...})` | `createProfile(token, { email, name })` |
| `supabase.from('profiles').update({...}).eq('id', id)` | `updateProfile(token, profileId, updates)` |
| `supabase.from('pilot_licensure_experience').select().eq('user_id', id)` | `getVerificationStatus(token, userId)` |
| `supabase.from('pilot_licensure_experience').upsert({...})` | *Removed — data comes from Veremark, not pilot input* |
| `supabase.from('recognition_scores').select().eq('user_id', id)` | `getRecognitionScore(token, userId)` |
| `supabase.from('recognition_scores').upsert({...})` | `saveRecognitionScore(token, data)` |
| `supabase.from('user_bookmarks').select().eq('user_id', id)` | `getBookmarks(token, userId)` |
| `supabase.from('user_bookmarks').insert({...})` | `addBookmark(token, data)` |
| `supabase.from('user_bookmarks').delete().eq('id', id)` | `removeBookmark(token, id)` |

---

## Step 10: Test the API

```bash
curl https://YOUR-WORKER.workers.dev/api/health
# Should return: {"status":"ok","db":"connected"}
```

Login to your app, check browser Network tab. You should see requests to `YOUR-WORKER.workers.dev/api` (POST with action + params).

---

## Step 11: Data Migration (DO THIS LAST)

**ONLY after everything works.**

Export from Supabase:

```bash
npx supabase db dump -f old_data.sql
```

Or use the Node.js export script (I'll write this when you're ready).

Import to D1:

```bash
npx wrangler d1 execute pilotrecognition-d1 --file=./old_data.sql
```

---

## Step 10: Webhook Testing (Optional)

Test Dodo webhook locally before going live:

```bash
curl -X POST https://YOUR-WORKER.workers.dev/api/webhooks/dodo \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: YOUR_SIGNATURE" \
  -d '{
    "event_type": "payment.succeeded",
    "status": "completed",
    "amount": 15.00,
    "currency": "USD",
    "payment_id": "test_123",
    "metadata": {
      "user_id": "YOUR_TEST_USER_ID",
      "tier": "pro"
    }
  }'
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `401 Unauthorized` | Auth0 token missing or expired. Call `getAccessTokenSilently()` before API calls. |
| `404 Not found` | Worker route doesn't exist. Check URL path. |
| `400 Field 'x' is not allowed` | You're trying to update a protected field (e.g. `subscription_tier`). Only admins can do that. |
| `Database not found` | `database_id` in wrangler.toml is wrong. Recreate and copy ID. |
| CORS errors | Worker sends `Access-Control-Allow-Origin: *`. Check that `VITE_WORKER_API_URL` is correct. |

## What You Lose Moving from Supabase

| Feature | Impact | Workaround |
|---------|--------|------------|
| Realtime subscriptions | No live updates | Poll every 30s, or use SSE later |
| Storage buckets | No file uploads | Use Cloudflare R2 (S3-compatible) |
| 60 Edge Functions | Some still missing | Build remaining endpoints incrementally |
| pg_cron | No scheduled jobs | Use Cloudflare Cron Triggers (free) |

## D1 Free Tier Limits

| Limit | Value |
|-------|-------|
| Storage | 500 MB |
| Reads / day | 100,000 |
| Writes / day | 1,000 |
| Databases | 10 |

**For production:** If you hit 1K writes/day, upgrade to D1 Paid ($5/month for 25M reads + 50M writes).

---

## Fallback Strategy (Keep Supabase as Backup)

During migration, keep Supabase running. Update your frontend to try D1 first, fall back to Supabase:

```typescript
async function getProfileSafe(token: string, auth0Id: string) {
  try {
    return await getProfile(token, auth0Id);
  } catch {
    // Fallback to Supabase while migrating
    return supabase.from('profiles').select().eq('auth0_id', auth0Id).single();
  }
}
```

Remove the fallback once D1 is stable.

## Next Steps

1. **Follow steps 1-8 above** (infrastructure setup)
2. **Test `/api/health`**
3. **Replace ONE component's Supabase calls** (e.g., profile page)
4. **Test that component**
5. **Repeat for all components**
6. **When everything works, migrate data**

**Questions? Read `docs/INFRASTRUCTURE_DECISION.md` for the full rationale.**
