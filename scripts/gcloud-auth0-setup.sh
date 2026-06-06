#!/usr/bin/env bash
set -euo pipefail

# gcloud-auth0-setup.sh
# Quick helper to inspect gcloud project and (attempt to) create an OAuth brand + client
# NOTE: Creating Google OAuth client IDs programmatically relies on gcloud alpha IAP
# commands which may not be available in all SDK installations. This script will
# attempt the alpha commands and falls back to printing manual steps.

PROJECT_ID=${1:-}
SUPPORT_EMAIL=${2:-}

check_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Required: $1 not found in PATH."; exit 1; }
}

check_cmd gcloud
check_cmd jq

if [ -z "$PROJECT_ID" ]; then
  PROJECT_ID=$(gcloud config get-value project 2>/dev/null || true)
fi

if [ -z "$PROJECT_ID" ]; then
  echo "No GCP project found. Provide PROJECT_ID as first arg or run:"
  echo "  gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo "Using GCP project: $PROJECT_ID"

if [ -z "$SUPPORT_EMAIL" ]; then
  echo "Warning: no support email passed as second arg — some flows require it."
fi

if gcloud alpha iap oauth-brands describe --project="$PROJECT_ID" >/dev/null 2>&1; then
  echo "OAuth brand commands available. Attempting to create brand and client..."
  BRAND_OUT=$(gcloud alpha iap oauth-brands create --project="$PROJECT_ID" --application_title="PilotRecognition" --support_email="${SUPPORT_EMAIL:-support@localhost}" --format=json 2>/dev/null || true)
  if [ -n "$BRAND_OUT" ]; then
    echo "Created or updated OAuth brand:" >&2
    echo "$BRAND_OUT" | jq -r '.'
  else
    echo "Could not create brand programmatically (may already exist)."
  fi

  # Try to create an OAuth client. This requires the IAP APIs and appropriate IAM.
  CLIENT_OUT=$(gcloud alpha iap oauth-clients create --project="$PROJECT_ID" --display_name="Auth0 Google Client" --format=json 2>/dev/null || true)
  if [ -n "$CLIENT_OUT" ]; then
    echo "OAuth client created. Extract these and set in Auth0:" >&2
    echo "$CLIENT_OUT" | jq -r '.'
    echo
    echo "Note: copy client_id and client_secret into your Auth0 Google social connection."
    exit 0
  else
    echo "Could not create OAuth client programmatically."
  fi
fi

cat <<'EOF'
Manual fallback:

1. Open Google Cloud Console > APIs & Services > Credentials:
   https://console.cloud.google.com/apis/credentials

2. Configure OAuth consent screen (Brand) for your project if not already configured.

3. Create an OAuth 2.0 Client ID (Application type: Web application).
   - Add Authorized redirect URIs (for Auth0, you'll add these later into Auth0 settings).

4. Copy the Client ID and Client Secret and then run the Auth0 configuration script:
   ./scripts/auth0-enable-google.sh <AUTH0_DOMAIN> <MGMT_TOKEN> <AUTH0_CLIENT_ID> <GOOGLE_CLIENT_ID> <GOOGLE_CLIENT_SECRET>

EOF
