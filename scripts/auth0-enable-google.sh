#!/usr/bin/env bash
set -euo pipefail

# auth0-enable-google.sh
# Configure or create the Auth0 "google-oauth2" connection using the Auth0 Management API.
# Usage:
#   ./scripts/auth0-enable-google.sh <AUTH0_DOMAIN> <MGMT_API_TOKEN> <AUTH0_CLIENT_ID> <GOOGLE_CLIENT_ID> <GOOGLE_CLIENT_SECRET>

AUTH0_DOMAIN=${1:-}
MGMT_TOKEN=${2:-}
AUTH0_CLIENT_ID=${3:-}
GOOGLE_CLIENT_ID=${4:-}
GOOGLE_CLIENT_SECRET=${5:-}

if [ -z "$AUTH0_DOMAIN" ] || [ -z "$MGMT_TOKEN" ] || [ -z "$AUTH0_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
  echo "Usage: $0 <AUTH0_DOMAIN> <MGMT_API_TOKEN> <AUTH0_CLIENT_ID> <GOOGLE_CLIENT_ID> <GOOGLE_CLIENT_SECRET>"
  exit 1
fi

API="https://${AUTH0_DOMAIN}/api/v2"

echo "Looking for existing google-oauth2 connection..."
CONN_JSON=$(curl -s -H "Authorization: Bearer ${MGMT_TOKEN}" "${API}/connections?strategy=google-oauth2")
CONN_ID=$(echo "$CONN_JSON" | jq -r '.[0].id // empty')

PAYLOAD=$(jq -n --arg cid "$GOOGLE_CLIENT_ID" --arg csecret "$GOOGLE_CLIENT_SECRET" --arg appid "$AUTH0_CLIENT_ID" '{options: {client_id: $cid, client_secret: $csecret, scope: "openid profile email"}, enabled_clients: [$appid] }')

if [ -n "$CONN_ID" ]; then
  echo "Updating existing connection id=$CONN_ID"
  curl -s -X PATCH "${API}/connections/${CONN_ID}" \
    -H "Authorization: Bearer ${MGMT_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" | jq -r '.'
  echo "Connection updated. Ensure Google OAuth credentials are correct in Auth0 Dashboard and that callback URIs match."
  exit 0
fi

echo "No existing google-oauth2 connection found — creating one."
CREATE_PAYLOAD=$(jq -n --arg name "google-oauth2" --arg strategy "google-oauth2" --argjson options '{client_id: "'${GOOGLE_CLIENT_ID}'", client_secret: "'${GOOGLE_CLIENT_SECRET}'", scope: "openid profile email"}' --arg appid "$AUTH0_CLIENT_ID" '{name: $name, strategy: $strategy, options: $options, enabled_clients: [$appid] }')

curl -s -X POST "${API}/connections" \
  -H "Authorization: Bearer ${MGMT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$CREATE_PAYLOAD" | jq -r '.'

echo "Created Auth0 google-oauth2 connection. Verify in Auth0 Dashboard that the connection is enabled for your Application."
