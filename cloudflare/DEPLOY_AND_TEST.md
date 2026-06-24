# Deploy & Test — Cloudflare Worker (Batch API)

## Prerequisites

```bash
# 1. Install wrangler (one time)
npm install -g wrangler

# 2. Login to Cloudflare (one time)
npx wrangler login
```

## Step 1: Create D1 Database (if not already created)

```bash
npx wrangler d1 create pilotrecognition-d1
```

Copy the `database_id` from the output and paste it into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "pilotrecognition-d1"
database_id = "YOUR_ACTUAL_DATABASE_ID_HERE"
```

## Step 2: Apply Schema

```bash
cd /Users/bowler/Documents/apps/app-main/cloudflare
npx wrangler d1 execute pilotrecognition-d1 --file=./schema.sql
```

## Step 3: Set Secrets

```bash
npx wrangler secret put DODO_API_KEY
# Paste your Dodo Payments API key

npx wrangler secret put DODO_WEBHOOK_SECRET
# Paste your Dodo webhook secret (optional)

npx wrangler secret put VEREMARK_WEBHOOK_SECRET
# Paste your Veremark webhook secret (optional)
```

## Step 4: Update wrangler.toml Vars

Edit `cloudflare/wrangler.toml`:

```toml
[vars]
AUTH0_DOMAIN = "dev-ir828tguibp1dh5f.eu.auth0.com"
AUTH0_AUDIENCE = "https://dev-ir828tguibp1dh5f.eu.auth0.com/api/v2/"
DODO_PRODUCT_ID_RECOGNITION_PLUS = "pdt_0NhgDLaiGjWD45S1gJmng"
```

## Step 5: Deploy

```bash
cd /Users/bowler/Documents/apps/app-main/cloudflare
npx wrangler deploy
```

After deploy, note the Worker URL (e.g. `https://pilotrecognition-api.YOUR_SUBDOMAIN.workers.dev`).

## Step 6: Update Frontend Env

Add to your frontend `.env`:

```
VITE_WORKER_API_URL=https://pilotrecognition-api.YOUR_SUBDOMAIN.workers.dev
```

## Step 7: Test

Run the test script (creates a real test profile via the batch endpoint):

```bash
cd /Users/bowler/Documents/apps/app-main/cloudflare
chmod +x test-batch-api.sh
./test-batch-api.sh
```

Or manually with curl:

```bash
# Health check
curl https://YOUR-WORKER.workers.dev/api/health

# Single action (needs a real Auth0 token)
curl -X POST https://YOUR-WORKER.workers.dev/api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH0_TOKEN" \
  -d '{"action":"getProfile","params":{"me":1}}'

# Batch action (needs a real Auth0 token)
curl -X POST https://YOUR-WORKER.workers.dev/api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH0_TOKEN" \
  -d '{
    "action": "batch",
    "requests": [
      {"action": "getProfile", "params": {"me": 1}},
      {"action": "getVerificationStatus", "params": {"user_id": "test-user-id"}}
    ]
  }'
```

## Expected Results

- **Health**: `{"status":"ok","db":"connected"}`
- **Single action**: Returns profile object or `{"error":"Not found"}`
- **Batch**: Returns object with keys matching action names, e.g. `{"getProfile": {...}, "getVerificationStatus": {...}}`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `database_id not found` | Run `npx wrangler d1 list` to get the real ID |
| `Unauthorized` | Auth0 token is missing or expired. Get a fresh one from your app. |
| `Not found` | Profile doesn't exist yet. Use `createProfile` first. |
| `Rate limit exceeded` | Wait 60 seconds. The limit is 60 req/min per IP. |
| Dodo checkout fails | Check that `DODO_API_KEY` and `DODO_PRODUCT_ID_RECOGNITION_PLUS` are set correctly. |
