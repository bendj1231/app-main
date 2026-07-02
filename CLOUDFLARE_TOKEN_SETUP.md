# ☁️ Cloudflare Token & MCP Setup (Post-Revoke)

## Step 1: Create New Cloudflare API Token

Go to: https://dash.cloudflare.com/profile/api-tokens

### Create a New Custom Token

**Token name:** `PilotRecognition Workers Deploy`

**Permissions:**

| Resource | Permission | Level |
|---|---|---|
| **Cloudflare Workers Scripts** | Edit | ✅ Full deploy access |
| **Account Workers Scripts** | Edit | ✅ Deploy across account |
| **D1** | Edit | ✅ Database migrations |
| **R2 Storage** | Edit | ✅ Encrypted vault access |
| **Zone: pilotrecognition.com** | Read | ✅ DNS/zone info |

**Account Resources:**
- Include: Your account

**Zone Resources:**
- Include: Specific zone → `pilotrecognition.com`

**Client IP Address Filtering:**
- Leave empty (or restrict to your IP/VPN if you have a fixed IP)

**Not Before / Expires On:**
- Not Before: Now
- Expires On: 90 days from now (forces rotation)

**After creating:** Copy the token immediately — shown only once.

---

## Step 2: Delete Old Tokens

At the same page (https://dash.cloudflare.com/profile/api-tokens):

1. Find any old tokens you just revoked
2. Click **"Roll"** or **"Delete"** — don't leave them active
3. If you see tokens you don't recognize → **Delete immediately**

---

## Step 3: Update GitHub Actions Secret

Go to: https://github.com/bendj1231/app-main/settings/secrets/actions

Update these repository secrets:

| Secret Name | New Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Your new token from Step 1 |
| `CLOUDFLARE_ACCOUNT_ID` | Get from: https://dash.cloudflare.com (it's in the URL, or Account Home → copy ID) |

Delete any other Cloudflare-related secrets you don't recognize.

---

## Step 4: Set Worker Secrets (with New Resend Key)

After you get your **new rotated Resend API key**:

```bash
# Log in with new token
npx wrangler login

# It will open a browser. Use your Cloudflare account credentials.
# This creates ~/.config/wrangler/config/ with your new auth.

# Now set Worker secrets
cd /Users/bowler/Documents/apps/app-main/worker

# 1. Generate EMAIL_API_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# SAVE THIS OUTPUT!

# 2. Set the secrets
npx wrangler secret put EMAIL_API_SECRET --name pilotrecognition-api
# Paste the hex string you just generated

npx wrangler secret put RESEND_API_KEY --name pilotrecognition-api
# Paste your NEW rotated Resend key

npx wrangler secret put OPENROUTER_API_KEY --name pilotrecognition-api
# Paste your OpenRouter key (or skip if you want to rotate that too)

# 3. Verify secrets are set
npx wrangler secret list --name pilotrecognition-api

# 4. Deploy the patched worker
npx wrangler deploy --name pilotrecognition-api
```

---

## Step 5: Other Workers

If these workers also use secrets, repeat Step 4 for each:

```bash
cd /Users/bowler/Documents/apps/app-main/cloudflare

# Platform worker
npx wrangler secret put DODO_API_KEY --name platform-api
npx wrangler secret put VEREMARK_WEBHOOK_SECRET --name platform-api
npx wrangler deploy --config wrangler.toml

# Pilot worker
npx wrangler secret put DODO_API_KEY --name pilot-profile-api
npx wrangler deploy --config wrangler.pilot.toml

# Recognition Plus worker
npx wrangler deploy --config wrangler.recognition.toml

# Public API worker
npx wrangler deploy --config wrangler.public.toml

# Shortage worker
npx wrangler deploy --config wrangler.shortage.toml
```

---

## Step 6: Set Up MCP (Model Context Protocol)

### Option A: Cloudflare's Official MCP Server (Recommended)

Cloudflare offers an MCP server that lets Windsurf/Cursor manage your Cloudflare resources.

1. Go to: https://developers.cloudflare.com/agents/guides/remote-mcp-server/
2. Or use the wrangler-based MCP:

```bash
# Install the Cloudflare MCP server globally
npm install -g @cloudflare/mcp-server

# Authenticate it (uses your new token)
npx @cloudflare/mcp-server init
```

3. Update Windsurf MCP config:

```bash
# Edit the config
# The server will output the correct config after init
```

### Option B: Manual MCP Config (If Option A Doesn't Work)

```json
{
  "mcpServers": {
    "cloudflare-api": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your_new_token_here"
      }
    }
  }
}
```

Save this to `/Users/bowler/Documents/apps/app-main/.codeium/windsurf/mcp_config.json`

---

## Step 7: Verify Everything Works

```bash
# Test Cloudflare auth
npx wrangler whoami

# Test Worker secrets
npx wrangler secret list --name pilotrecognition-api

# Test Worker deployment
cd worker
npx wrangler deploy --name pilotrecognition-api --dry-run

# Test the email endpoint (after deploy)
curl -X POST https://pilotrecognition-api.YOUR_SUBDOMAIN.workers.dev/api/email/send \
  -H "Content-Type: application/json" \
  -H "X-Email-Secret: your_generated_secret" \
  -d '{"to":"test@example.com","subject":"Test","text":"Hello"}'
# Should return: {"success":true,...}

# Test without secret (should fail)
curl -X POST https://pilotrecognition-api.YOUR_SUBDOMAIN.workers.dev/api/email/send \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","text":"Hello"}'
# Should return: {"error":"Unauthorized"}
```

---

## Important Notes

- **Token expires in 90 days** — set a calendar reminder
- **Never commit tokens** — not in `.env.local`, not in code, not in docs
- **The old MCP server URL is dead** — `https://mcp.cloudflare.com/mcp` was part of the revoked setup
- **Use `npx wrangler login`** — this creates a local auth session, more secure than storing tokens

---

*Created: 2026-07-02 | Token expires: 90 days from creation*
