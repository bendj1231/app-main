# Using the Batch API from React

## Single Action

```tsx
import { api, apiBatch } from '@/lib/d1-api';
import { useAuth0 } from '@auth0/auth0-react';

function MyComponent() {
  const { getAccessTokenSilently } = useAuth0();

  const loadProfile = async () => {
    const token = await getAccessTokenSilently();
    const profile = await api(token, 'getProfile', { me: 1 });
    console.log(profile);
  };
}
```

## Batch Action (Dashboard Load)

Use this when a page needs profile + verification + recognition + payments all at once.
One request instead of four.

```tsx
import { apiBatch } from '@/lib/d1-api';
import { useAuth0 } from '@auth0/auth0-react';

function DashboardPage() {
  const { getAccessTokenSilently } = useAuth0();

  const loadDashboard = async () => {
    const token = await getAccessTokenSilently();
    const data = await apiBatch(token, [
      { action: 'getProfile', params: { me: 1 } },
      { action: 'getVerificationStatus', params: { user_id: userId } },
      { action: 'getRecognitionScore', params: { user_id: userId } },
      { action: 'getPayments', params: { user_id: userId } },
    ]);

    // data.getProfile, data.getVerificationStatus, etc.
    setProfile(data.getProfile);
    setVerification(data.getVerificationStatus);
    setRecognition(data.getRecognitionScore);
    setPayments(data.getPayments);
  };
}
```

## Available Actions

| Action | Params | Returns |
|--------|--------|---------|
| `getProfile` | `{ me: 1 }` or `{ id }` or `{ auth0_id }` | Profile object |
| `createProfile` | `{ email, name? }` | Profile object |
| `updateProfile` | `{ id, ...fields }` | Updated profile |
| `deleteProfile` | `{ id }` | `{ deleted: true }` |
| `getVerificationStatus` | `{ user_id }` | Verification status object |
| `getRecognitionScore` | `{ user_id }` | Recognition score object |
| `saveRecognitionScore` | `{ user_id, total_score?, ... }` | Recognition score object |
| `getPayments` | `{ user_id }` | Array of payments |
| `createPayment` | `{ user_id, amount_cents, ... }` | Payment object |
| `createCheckout` | `{}` | `{ checkout_url, session_id }` |
| `createDid` | `{ profile_id, auth0_id, did, ... }` | DID object |
| `getDid` | `{ auth0_id }` | DID object |
| `createCredential` | `{ user_id, credential_type, issuer, ... }` | Credential object |
| `getCredentials` | `{ user_id }` | Array of credentials |
| `createEnterprise` | `{ company_name, ... }` | Enterprise profile |
| `getEnterprises` | `{}` | Array of enterprises |
| `getEnterprise` | `{ id }` | Enterprise profile |
| `getAllPilots` | `{}` | Array of profiles (admin only) |
| `updateUserTier` | `{ user_id, tier }` | Updated profile (admin only) |
| `batch` | `{ requests: [...] }` | Object with results keyed by action name |
