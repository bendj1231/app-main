#!/bin/bash
# Deploy issuer-sign edge function and configure environment
# Run: chmod +x scripts/deploy-issuer-sign.sh && ./scripts/deploy-issuer-sign.sh

set -e

echo "🔐 PilotRecognition Production Issuer Deployment"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "${RED}❌ Supabase CLI not found. Install with:${NC}"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if deno is installed (for key generation)
if ! command -deno &> /dev/null; then
    echo "${YELLOW}⚠️  Deno not found. Needed for key generation.${NC}"
    echo "   Install: https://deno.land/#installation"
fi

echo "${YELLOW}Step 1/4: Checking current edge functions...${NC}"
supabase functions list || true
echo ""

echo "${YELLOW}Step 2/4: Deploying issuer-sign edge function...${NC}"
supabase functions deploy issuer-sign --project-ref gkbhgrozrzhalnjherfu
echo "${GREEN}✅ issuer-sign deployed${NC}"
echo ""

echo "${YELLOW}Step 3/4: Checking environment variables...${NC}"
supabase secrets list --project-ref gkbhgrozrzhalnjherfu || true
echo ""

# Check if PLATFORM_SIGNING_KEY_JWK is already set
if supabase secrets list --project-ref gkbhgrozrzhalnjherfu | grep -q "PLATFORM_SIGNING_KEY_JWK"; then
    echo "${GREEN}✅ PLATFORM_SIGNING_KEY_JWK is already set${NC}"
    echo ""
    read -p "Do you want to rotate/regenerate the key? (y/N): " ROTATE
    if [[ $ROTATE =~ ^[Yy]$ ]]; then
        echo "${YELLOW}Generating new keys...${NC}"
        deno run --allow-all scripts/generate-issuer-keys.ts
        echo ""
        echo "${RED}⚠️  Copy the PLATFORM_SIGNING_KEY_JWK value above and run:${NC}"
        echo "   supabase secrets set PLATFORM_SIGNING_KEY_JWK='<paste-value-here>' --project-ref gkbhgrozrzhalnjherfu"
    fi
else
    echo "${RED}❌ PLATFORM_SIGNING_KEY_JWK not set${NC}"
    echo ""
    
    # Check if generate-issuer-keys.ts exists
    if [ -f "scripts/generate-issuer-keys.ts" ]; then
        echo "${YELLOW}Generating new signing keys...${NC}"
        deno run --allow-all scripts/generate-issuer-keys.ts 2>&1 | tee /tmp/keygen-output.txt
        
        # Extract the JWK from output (this is a simple approach)
        echo ""
        echo "${YELLOW}Step 4/4: Setting environment variable...${NC}"
        echo "${RED}⚠️  IMPORTANT: Copy the PLATFORM_SIGNING_KEY_JWK from the output above${NC}"
        echo "${RED}   Then run the command it provides to set the secret.${NC}"
    else
        echo "${RED}❌ scripts/generate-issuer-keys.ts not found${NC}"
        exit 1
    fi
fi

echo ""
echo "${GREEN}================================================${NC}"
echo "${GREEN}Deployment Summary${NC}"
echo "${GREEN}================================================${NC}"
echo ""
echo "Edge Function: issuer-sign"
echo "Project: gkbhgrozrzhalnjherfu"
echo "Region: ap-southeast-2 (Sydney)"
echo ""
echo "Next steps:"
echo "1. Set PLATFORM_SIGNING_KEY_JWK if not already done"
echo "2. Test: curl https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/issuer-sign"
echo "3. Check DID document: https://pilotrecognition.com/.well-known/did.json"
echo ""
echo "${YELLOW}To test the issuer:${NC}"
cat << 'EOF'

curl -X POST "https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/issuer-sign" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <anon-key>" \
  -d '{
    "credential_type": "PilotLicenseVC",
    "subject_did": "did:web:pilotrecognition.com:pilots:test123",
    "credential_data": {
      "licenseNumber": "TEST-123456",
      "issuingAuthority": "CAAP",
      "expiryDate": "2030-12-31"
    },
    "auth0_id": "test|123",
    "profile_id": "00000000-0000-0000-0000-000000000000"
  }' | jq

EOF
