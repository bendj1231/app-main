#!/bin/bash
# Deploy domain-specific wallet edge functions
# Usage: ./deploy-domain-wallets.sh

set -e

PROJECT_REF="gkbhgrozrzhalnjherfu"
SUPABASE_URL="https://gkbhgrozrzhalnjherfu.supabase.co"

echo "🔐 Deploying Domain Wallet Infrastructure"
echo "========================================="
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install with:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check authentication
if ! supabase projects list &> /dev/null; then
    echo "❌ Not authenticated. Run: supabase login"
    exit 1
fi

echo "📦 Step 1: Deploy shortage-issue edge function"
echo "-----------------------------------------------"
supabase functions deploy shortage-issue --project-ref "$PROJECT_REF"
echo "✅ shortage-issue deployed"
echo ""

echo "📦 Step 2: Deploy pathways-issue edge function"
echo "----------------------------------------------"
supabase functions deploy pathways-issue --project-ref "$PROJECT_REF"
echo "✅ pathways-issue deployed"
echo ""

echo "📦 Step 3: Verify issuer-sign is deployed"
echo "-----------------------------------------"
if ! supabase functions list --project-ref "$PROJECT_REF" | grep -q "issuer-sign"; then
    echo "⚠️  issuer-sign not found. Deploying..."
    supabase functions deploy issuer-sign --project-ref "$PROJECT_REF"
fi
echo "✅ issuer-sign ready"
echo ""

echo "🔑 Step 4: Set environment variables"
echo "--------------------------------------"
# Check if PILOT_ISSUER_URL is set
if ! supabase secrets list --project-ref "$PROJECT_REF" | grep -q "PILOT_ISSUER_URL"; then
    echo "Setting PILOT_ISSUER_URL..."
    supabase secrets set PILOT_ISSUER_URL="https://issuer.pilotrecognition.com" --project-ref "$PROJECT_REF"
else
    echo "PILOT_ISSUER_URL already set"
fi

# Check if PLATFORM_SIGNING_KEY_JWK is set
if ! supabase secrets list --project-ref "$PROJECT_REF" | grep -q "PLATFORM_SIGNING_KEY_JWK"; then
    echo "⚠️  WARNING: PLATFORM_SIGNING_KEY_JWK not set!"
    echo "   Run: ./scripts/generate-issuer-keys.ts first"
    echo "   Then set the secret with:"
    echo "   supabase secrets set PLATFORM_SIGNING_KEY_JWK='<jwk-json>' --project-ref $PROJECT_REF"
else
    echo "✅ PLATFORM_SIGNING_KEY_JWK is set"
fi
echo ""

echo "🧪 Step 5: Test deployments"
echo "--------------------------"
echo "Testing shortage-issue..."
curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/functions/v1/shortage-issue" || echo " (expected 401 without auth)"

echo "Testing pathways-issue..."
curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/functions/v1/pathways-issue" || echo " (expected 401 without auth)"

echo ""
echo "========================================="
echo "✅ Deployment complete!"
echo ""
echo "Domain Wallets Status:"
echo "  • pilotshortage.org/wallet     → Anonymous Wallet (Ready)"
echo "  • pilotcareerpathways.com/wallet → Career Wallet (Ready)"
echo "  • pilotterminal.com            → Infrastructure (Ready)"
echo ""
echo "Next steps:"
echo "  1. Test wallet creation on each domain"
echo "  2. Issue test credentials"
echo "  3. Verify navigation links work"
echo "  4. Check domain detection in useDomainDetection.ts"
echo ""
