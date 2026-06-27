Setup notes — Google OAuth + Auth0

Overview:

- Use Google Cloud Console (or gcloud) to create an OAuth 2.0 Client ID (web application).
- Configure Auth0's Google social connection with the client ID / secret so users can sign in with Google via Auth0.

Provided scripts:

- `scripts/gcloud-auth0-setup.sh` — attempts to inspect your `gcloud` project and (when available) create an OAuth brand and client via `gcloud alpha iap` commands. If the alpha commands are not available, it prints manual fallback steps.
- `scripts/auth0-enable-google.sh` — uses an Auth0 Management API token to create or update the `google-oauth2` connection and enable it for your Auth0 application.

Quick manual flow:

1. Ensure you have `gcloud` and `jq` installed and authenticated:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

2. Run `gcloud-auth0-setup.sh` to try to create a Google OAuth client automatically (may require alpha components):

```bash
./scripts/gcloud-auth0-setup.sh YOUR_PROJECT_ID support@yourdomain.com
```

If that fails, create credentials manually in the Google Cloud Console:

- Console: https://console.cloud.google.com/apis/credentials
- Create OAuth 2.0 Client ID (Web application)
- Add redirect URIs used by Auth0 (Auth0 Dashboard -> Applications -> YOUR_APP -> Allowed Callback URLs)

3. Obtain an Auth0 Management API token (create a Machine-to-Machine Application in Auth0, grant `read:connections` and `update:connections` or `create:connections` as needed):

```bash
curl --request POST \
  --url https://YOUR_AUTH0_DOMAIN/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id":"MGMT_CLIENT_ID","client_secret":"MGMT_CLIENT_SECRET","audience":"https://YOUR_AUTH0_DOMAIN/api/v2/","grant_type":"client_credentials"}'
```

4. Run the Auth0 configuration script with the Management API token and the Google client credentials:

```bash
./scripts/auth0-enable-google.sh dev-yourtenant.eu.auth0.com <MGMT_TOKEN> <AUTH0_APP_CLIENT_ID> <GOOGLE_CLIENT_ID> <GOOGLE_CLIENT_SECRET>
```

5. Verify in the Auth0 Dashboard:

- Auth0 -> Connections -> Social -> Google -> credentials present
- Auth0 -> Applications -> Your Application -> Enabled Connections -> Google toggled on

Security notes:

- Never commit client secrets or management tokens into the repository. Store them in CI/CD secrets or environment variables.
