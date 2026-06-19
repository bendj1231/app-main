#!/bin/bash
# Test script for the Cloudflare Worker Batch API
# Usage: ./test-batch-api.sh

set -e

WORKER_URL="${1:-https://pilotrecognition-api.YOUR_SUBDOMAIN.workers.dev}"
TOKEN="${2:-YOUR_AUTH0_TOKEN}"

echo "====================================="
echo "Cloudflare Worker Batch API Tests"
echo "Worker: $WORKER_URL"
echo "====================================="

# 1. Health Check (no auth)
echo ""
echo "[1/4] Health Check..."
curl -s "$WORKER_URL/api/health" | python3 -m json.tool 2>/dev/null || curl -s "$WORKER_URL/api/health"

# 2. Missing auth should fail
echo ""
echo "[2/4] Missing Auth (should fail with 401)..."
curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$WORKER_URL/api" \
  -H "Content-Type: application/json" \
  -d '{"action":"getProfile","params":{"me":1}}' | tail -1

# 3. Single action (needs real token)
echo ""
echo "[3/4] Single Action: getProfile me=1..."
if [ "$TOKEN" != "YOUR_AUTH0_TOKEN" ]; then
  curl -s -X POST "$WORKER_URL/api" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"action":"getProfile","params":{"me":1}}' | python3 -m json.tool 2>/dev/null || true
else
  echo "SKIP: Set your Auth0 token as the second argument."
fi

# 4. Batch action (needs real token)
echo ""
echo "[4/4] Batch Action: profile + verification + recognition..."
if [ "$TOKEN" != "YOUR_AUTH0_TOKEN" ]; then
  curl -s -X POST "$WORKER_URL/api" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "action": "batch",
      "requests": [
        {"action": "getProfile", "params": {"me": 1}},
        {"action": "getVerificationStatus", "params": {"user_id": "test"}},
        {"action": "getRecognitionScore", "params": {"user_id": "test"}},
        {"action": "getPayments", "params": {"user_id": "test"}}
      ]
    }' | python3 -m json.tool 2>/dev/null || true
else
  echo "SKIP: Set your Auth0 token as the second argument."
fi

echo ""
echo "====================================="
echo "Tests complete."
echo "====================================="
