# Supabase Migration Guide
**Old Project:** `gkbhgrozrzhalnjherfu` (Sydney, wingmentor org)  
**New Project:** `upaainmhcqlghtsfmtrc` (Singapore, database@pilotrecognition.com)  
**Date:** 2026-06-16  

---

## What We Found in the Old Project

| Metric | Value |
|---|---|
| Tables | 176 |
| Tables with data | ~60 |
| Auth users | 4 |
| Extensions enabled | uuid-ossp, pgcrypto, supabase_vault, pg_cron, pg_net |
| Largest table | `profiles` (4 rows, 195 columns, 912 kB) |
| RLS policies | Hundreds (500+ across all tables) |

**Key data tables:**
- `profiles` — 4 pilot profiles
- `airlines` — 71 rows
- `aircraft_type_ratings` — 133 rows
- `career_hierarchy_sub_pathways` — 193 rows
- `framework_content_sections` — 265 rows
- `framework_table_rows` — 159 rows
- `flight_school_cards` — 50 rows
- `user_activity_log` — 29 rows
- `notifications` — 23 rows
- And 50+ more with smaller counts

---

## Method A: Supabase CLI (Recommended — Easiest)

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
# or
npx supabase --version
```

### Step 2: Login
```bash
supabase login
```

### Step 3: Link to OLD project and dump
```bash
# Link old project
supabase link --project-ref gkbhgrozrzhalnjherfu

# Dump schema + data
supabase db dump -f old_project_dump.sql
```

### Step 4: Link to NEW project and restore
```bash
# Link new project
supabase link --project-ref upaainmhcqlghtsfmtrc

# Restore
supabase db restore -f old_project_dump.sql
```

> ⚠️ If restore fails due to pre-existing tables, use `--data-only` flag or manually drop tables first via SQL Editor: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`

### Step 5: Verify
```bash
psql -h db.upaainmhcqlghtsfmtrc.supabase.co -U postgres -d postgres -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';"
```

---

## Method B: Direct PostgreSQL (psql / pg_dump)

Get the connection string from old project Dashboard → Database → Connection String:
```bash
# Export from old
pg_dump \
  "postgres://postgres:[password]@db.gkbhgrozrzhalnjherfu.supabase.co:5432/postgres" \
  --clean --if-exists \
  -f old_dump.sql

# Import to new
psql \
  "postgres://postgres:[password]@db.upaainmhcqlghtsfmtrc.supabase.co:5432/postgres" \
  -f old_dump.sql
```

---

## Method C: Node.js Data Migration Script (Fallback)

Use this if CLI methods fail. This script migrates data only — you must create the schema first.

```bash
# Install dependency
cd /Users/bowler/Documents/apps/app-main
npm install @supabase/supabase-js

# Set env vars
export OLD_SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM"
export NEW_SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwYWFpbm1oY3FsZ2h0c2ZtdHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTU1MjM0OSwiZXhwIjoyMDk3MTI4MzQ5fQ.5Lx_zSbmllRIV7QseEplPjL2-EOWtcfNDLh-0vrUkkU"

# Run migration
node scripts/migrate-supabase-to-new-project.js
```

---

## Auth Users Migration

**Important:** Passwords CANNOT be migrated. You have 4 auth users in the old project.

### Option 1: Magic Link Re-invite (Recommended)
```javascript
// After schema is restored, send magic links to all users
const { data: users } = await oldSupabase.auth.admin.listUsers();
for (const user of users) {
  await newSupabase.auth.admin.generateLink({
    type: 'magiclink',
    email: user.email,
  });
}
```

### Option 2: Create users with admin API
```javascript
for (const user of users) {
  await newSupabase.auth.admin.createUser({
    email: user.email,
    email_confirm: true,
    user_metadata: user.user_metadata,
  });
}
// Then tell users to use "Forgot Password"
```

### Option 3: Ask users to re-signup
If there are only 4 users, the simplest approach may be to ask them to sign up again on the new project.

---

## Post-Migration Checklist

### 1. ✅ Update Frontend Env Vars
Already done in `.env.local`:
```
VITE_SUPABASE_URL=https://upaainmhcqlghtsfmtrc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Update MCP Config
Tell your teammate to update `.vscode/settings.json` or `.windsurf/mcp.json`:
```json
{
  "mcp.servers": {
    "supabase": {
      "command": "node",
      "args": [".windsurf/mcp-servers/supabase-mcp-server.js"],
      "cwd": ".",
      "env": {
        "SUPABASE_URL": "https://upaainmhcqlghtsfmtrc.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwYWFpbm1oY3FsZ2h0c2ZtdHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTU1MjM0OSwiZXhwIjoyMDk3MTI4MzQ5fQ.5Lx_zSbmllRIV7QseEplPjL2-EOWtcfNDLh-0vrUkkU"
      }
    }
  }
}
```

### 3. Enable Extensions on New Project
Go to new project Dashboard → Database → Extensions → Enable:
- `uuid-ossp`
- `pgcrypto`
- `supabase_vault`
- `pg_cron`
- `pg_net`

### 4. Re-create Storage Buckets
If you use Supabase Storage, manually re-create buckets in the new project.

### 5. Update Edge Function Secrets
New project needs these secrets set in Dashboard → Edge Functions:
- `GROQ_API_KEY`
- `WALT_ISSUER_JWK`
- `VAULT_MASTER_SECRET`
- `CLOUDINARY_API_SECRET`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `RESEND_API_KEY`
- `STRIPE_SECRET_KEY`
- `VEREMARK_WEBHOOK_SECRET`

### 6. Update Auth Redirect URLs
New project Dashboard → Authentication → URL Configuration:
- Site URL: `https://pilotrecognition.com`
- Redirect URLs: `https://pilotrecognition.com/callback`, `http://localhost:3000/callback`

### 7. Update Auth0 / OAuth Callbacks
If OAuth providers (Google) have hardcoded redirect URIs, update them to the new project.

### 8. Test
```bash
npm run build
npm run dev
# Test login, signup, profile creation
```

---

## Rollback Plan

If migration fails, `.env.local` has the old credentials commented out:
```bash
# Uncomment to rollback
# VITE_SUPABASE_URL=https://gkbhgrozrzhalnjherfu.supabase.co
```

---

## Security Note

⚠️ **Rotate the old service_role key after migration.** The old key was exposed in git history. Go to old project Dashboard → Settings → API → Generate new service_role key.

---

*End of Guide*
