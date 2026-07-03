#!/bin/bash
# Deploy the patched PilotRecognition Worker with secure email endpoint
# Run this after rotating your Resend API key

set -e

echo "☁️  PilotRecognition Worker Secure Deployment"
echo "================================================"

# Generate EMAIL_API_SECRET if not already set
echo ""
echo "Step 1: Generating EMAIL_API_SECRET..."
EMAIL_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "   Generated: ${EMAIL_SECRET:0:16}... (save this!)"

echo ""
echo "Step 2: Setting Cloudflare Worker secrets..."

echo "   → Setting EMAIL_API_SECRET"
npx wrangler secret put EMAIL_API_SECRET --name pilotrecognition-api <<EOF
$EMAIL_SECRET
EOF

echo ""
echo "⚠️  You need to provide your NEW rotated Resend API key."
echo "   Get it from: https://resend.com → API Keys → Create New Key"
echo ""
read -p "Paste your new Resend API key: " RESEND_KEY
echo ""

echo "   → Setting RESEND_API_KEY"
npx wrangler secret put RESEND_API_KEY --name pilotrecognition-api <<EOF
$RESEND_KEY
EOF

echo ""
echo "Step 3: Deploying patched worker..."
npx wrangler deploy --name pilotrecognition-api

echo ""
echo "================================================"
echo "✅ Worker deployed securely!"
echo ""
echo "IMPORTANT: Save this EMAIL_API_SECRET somewhere safe:"
echo "   $EMAIL_SECRET"
echo ""
echo "Your email endpoint now requires:"
echo "   Header: X-Email-Secret: <the-secret-above>"
echo "   Resend key is no longer accepted from clients"
echo ""
echo "Update your frontend/client code to send X-Email-Secret"
echo "instead of X-Resend-Key when calling /api/email/send"
