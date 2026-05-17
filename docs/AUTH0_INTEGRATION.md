# Auth0 Integration Architecture

## Overview
Auth0 by Okta is the authentication proxy for pilotrecognition.com. No passwords or emails are stored in our Supabase database.

## Architecture Flow

```
[ Pilot ] ──(enters email/password)──► [ Auth0 Login Form (embedded) ]
                                              │
                                              │ Auth0 validates credentials
                                              ▼
[ Auth0 Servers ] ◄──────stores email/password──────┘
       │
       │ Returns JWT with anonymous User ID: "auth0|6647b19a..."
       ▼
[ PilotRecognition Frontend ] ──(sends JWT to Supabase)──► [ Supabase DB ]
                                                                 │
                                                                 │ Stores only:
                                                                 │ - User ID: auth0|6647b19a...
                                                                 │ - Flight hours: 1500
                                                                 │ - Ratings: ["CPL", "A320"]
                                                                 │ - Veremark status: VERIFIED
                                                                 │
                                                                 ▼
                                                      [ Hacker sees nothing ]
                                                      Anonymous IDs only
```

## What We Store vs. What Auth0 Stores

| Data | Stored By | We See It? |
|------|-----------|------------|
| Email address | Auth0 | No |
| Password (hashed) | Auth0 | No |
| Login session tokens | Auth0 | No |
| Anonymous User ID | Supabase | Yes (e.g., `auth0|6647b19a...`) |
| Flight hours | Supabase | Yes (user-declared) |
| License ratings | Supabase | Yes (user-declared text) |
| Veremark verification | Supabase | Yes (status flag) |
| Official license numbers | Veremark | No (Veremark only) |
| Logbook history | Logbook provider | No (tokenized display) |

## Supabase RLS Policies Applied

All policies use `auth.jwt() ->> 'sub'` to match the Auth0 User ID:

```sql
-- Example: profiles table
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (id::text = (auth.jwt() ->> 'sub'));
```

### Tables Protected
- `profiles` — SELECT/UPDATE own row only
- `pilot_documents` — SELECT/INSERT/DELETE own documents
- `user_activity_log` — SELECT own activity
- `pathway_card_interests` — SELECT/INSERT/DELETE own interests
- `enrollments` — SELECT own enrollments
- `user_app_access` — SELECT own access
- `pilot_licensure_experience` — SELECT/UPDATE own data
- `notifications` — SELECT/UPDATE own notifications
- `subscriptions` — SELECT own subscriptions
- `pilot_verification_wallet` — SELECT own wallet
- `verification_checks` — SELECT own checks

### Admin Policies
- Admins (role = 'admin' in profiles) can read all `pilot_documents` for verification queue
- `service_role` can insert to activity logs and manage enterprise accounts

## Auth0 Setup Steps (Manual)

1. **Create Auth0 Account**
   - Sign up at auth0.com (free tier: 7,500 active users)
   - Create a new "Regular Web Application"

2. **Configure Allowed Callback URLs**
   ```
   http://localhost:5173/callback
   https://pilotrecognition.com/callback
   ```

3. **Configure Allowed Logout URLs**
   ```
   http://localhost:5173
   https://pilotrecognition.com
   ```

4. **Get Credentials**
   - Domain: `your-tenant.auth0.com`
   - Client ID: `xxxxxxxxxxxxxxxxxxxxxxxx`
   - Client Secret: (for backend use only)

5. **Install Auth0 SDK**
   ```bash
   npm install @auth0/auth0-react
   ```

6. **Wrap App with Auth0Provider**
   ```tsx
   import { Auth0Provider } from '@auth0/auth0-react';

   <Auth0Provider
     domain="your-tenant.auth0.com"
     clientId="xxxxxxxxxxxxxxxxxxxxxxxx"
     authorizationParams={{
       redirect_uri: window.location.origin + '/callback'
     }}
   >
     <App />
   </Auth0Provider>
   ```

7. **Add Login Button**
   ```tsx
   import { useAuth0 } from '@auth0/auth0-react';

   const LoginButton = () => {
     const { loginWithRedirect } = useAuth0();
     return <button onClick={() => loginWithRedirect()}>Log In</button>;
   };
   ```

8. **Send Auth0 Token to Supabase**
   ```tsx
   const { getAccessTokenSilently, user } = useAuth0();

   // Get Auth0 JWT
   const token = await getAccessTokenSilently();

   // Create Supabase client with Auth0 token
   const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
     global: { headers: { Authorization: `Bearer ${token}` } }
   });
   ```

9. **Configure Supabase to Accept Auth0 JWT**
   - In Supabase Dashboard → Authentication → Settings
   - Under "JWT Settings" → "JWT Secret"
   - Or use Edge Function to verify Auth0 token and create Supabase session

## Legal Documentation References

All legal docs have been updated to reference Auth0:

- **Terms of Service** (`app/terms-of-service/page.tsx`): Authentication Proxy section
- **Privacy Policy** (`app/privacy-policy/page.tsx`): Authentication Proxy section
- **Verification Service** (`app/verification-service/page.tsx`): Step 1 consent clause

## Free Tier Limits

| Provider | Free Users | Cost After |
|----------|-----------|------------|
| Auth0 | 7,500/month | $23/month per 1,000 users |
| Supabase | Unlimited | $25/month (Pro) |
| Veremark | API-based pricing | Per-check pricing |

## Next Steps

1. ✅ Legal docs updated with Auth0 references
2. ✅ RLS policies created for Auth0 User ID matching
3. ⬜ Create Auth0 tenant and get credentials
4. ⬜ Install `@auth0/auth0-react` package
5. ⬜ Configure Supabase to validate Auth0 JWTs
6. ⬜ Replace current login/signup forms with Auth0 embedded login
7. ⬜ Test end-to-end: Auth0 login → Supabase profile → Veremark verification

## Security Checklist

- [x] RLS enabled on all tables
- [x] RLS policies restrict to `auth.jwt() ->> 'sub'` (Auth0 User ID)
- [x] No email/password in Supabase
- [x] Admin access controlled via `role = 'admin'` check
- [x] Service role restricted to specific operations
- [ ] Enable Auth0 MFA for admin accounts
- [ ] Configure Auth0 brute force protection
- [ ] Enable Auth0 anomaly detection
