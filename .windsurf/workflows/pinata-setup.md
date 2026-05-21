---
description: Set up Pinata IPFS for wallet VP pinning
---

## Step 1 — Create a Pinata account

1. Go to https://pinata.cloud and sign up (free tier: 1 GB, 100 pins/month)
2. Verify your email

## Step 2 — Generate an API Key

1. In the Pinata dashboard, click **API Keys** in the left sidebar
2. Click **+ New Key**
3. Toggle **Admin** on (gives full pin access)
4. Give it a name: `pilotrecognition-wallet`
5. Click **Generate API Key**
6. **Copy the JWT** shown — you will NOT be able to see it again

## Step 3 — Get your dedicated gateway (optional but recommended)

1. In Pinata dashboard, click **Gateways**
2. Copy your gateway subdomain — it looks like: `amber-defensive-minnow-123.mypinata.cloud`
3. The subdomain part before `.mypinata.cloud` is your gateway slug

## Step 4 — Add secrets to Supabase

1. Go to https://supabase.com/dashboard/project/gkbhgrozrzhalnjherfu/settings/edge-functions
2. Click **Add secret** and add each of the following:

| Secret Name | Value |
|---|---|
| `PINATA_JWT` | The JWT you copied in Step 2 |
| `PINATA_GATEWAY` | Your gateway slug (e.g. `amber-defensive-minnow-123.mypinata.cloud`) — optional |

3. Click **Save**

## Step 5 — Test it

1. Go to https://pilotrecognition.com/platform?tab=wallet
2. Log in, go to the **Logbook** tab
3. Click **Generate Tokenized Candidate Record**
4. In the VP export panel, click **↑ Pin to IPFS**
5. After ~2 seconds, a purple tile should appear with the CID and a "View on IPFS →" link
6. Click the link — it should open your pilot VP JSON on the public IPFS gateway

## What the CID URL looks like

```
https://ipfs.io/ipfs/bafybeihgxdzljxb26q6nf3r3eifqeedsvt2eubqtskghpme66cgjyw4fra
```

This is the permanent, shareable link pilots send to airline HR instead of a PDF resume.
