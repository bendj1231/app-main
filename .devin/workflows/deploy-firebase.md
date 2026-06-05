---
description: Deploy Firebase functions to specific project aliases (airline, pathways, recognition, programs)
---

## Deploy Firebase Functions

All functions live in `/functions/index.js` and are deployed to the project specified by the `--project` alias.

### Project aliases (from .firebaserc)
| Alias | Firebase Project |
|---|---|
| `airline` | `pilotrecognition-airline` |
| `pathways` | `pilotrecognition-pathways` |
| `recognition` | `pilotrecognition-recognition` |
| `programs` | `pilotrecognition-programs` |
| `pilotterminal` | `pilotrecognition-pilotterminal` |

### Deploy to airline project (default — enterprise + airline functions)
```
cd /Users/bowler/Documents/apps/app-main
firebase deploy --only functions --project airline
```

### Deploy to pathways project
```
cd /Users/bowler/Documents/apps/app-main
firebase deploy --only functions --project pathways
```

### Deploy to recognition project
```
cd /Users/bowler/Documents/apps/app-main
firebase deploy --only functions --project recognition
```

### Deploy to all projects
```
cd /Users/bowler/Documents/apps/app-main
firebase deploy --only functions --project airline
firebase deploy --only functions --project pathways
firebase deploy --only functions --project recognition
firebase deploy --only functions --project programs
```

### Set environment variables (run once per project)
```
cd /Users/bowler/Documents/apps/app-main/functions
firebase functions:config:set supabase.url="https://gkbhgrozrzhalnjherfu.supabase.co" supabase.anon_key="<KEY>" --project airline
```

### Check function logs
```
firebase functions:log --project airline
firebase functions:log --project pathways
```

## Enterprise Function Endpoints (pilotrecognition-airline)

| Function | Method | Purpose |
|---|---|---|
| `grantEnterpriseAccess` | POST | Admin grants enterprise access to a user profile |
| `upsertEnterpriseAccount` | POST/PUT | Create or update airline enterprise account |
| `getEnterpriseAccount` | GET | Get enterprise account for a user |
| `postEnterprisePathwayCard` | POST | Post full pathway card with requirements, alignment, compensation |
| `postEnterpriseJobListing` | POST | Post job listing to job_opportunities table |
| `updateAirlineExpectations` | POST/PUT | Airline updates their own expectations record (from the 72 airlines) |
| `searchPilotProfiles` | GET | Airline searches pilot profiles by hours, ratings, ICAO level |
| `getEnterprisePathwayCards` | GET | Fetch published enterprise pathway cards for PathwaysPageModern |
| `checkPathwayPostingAccess` | GET | Check if user can post (enterprise_access OR verified_account) |

## Supabase Tables

| Table | Purpose |
|---|---|
| `enterprise_accounts` | Airline/org enterprise profiles (linked to `profiles.id`) |
| `enterprise_pathway_cards` | Full structured pathway cards posted by enterprises |
| `airline_expectations` | 72 airline expectations — enterprise-manageable via `enterprise_account_id` |
| `job_opportunities` | Job listings — enterprise postings via `is_enterprise_listing = true` |
| `profiles` | Users — `enterprise_access` and `verified_account` flags control posting |

## Cloudinary (for airline logos & card images)
Cloud name: `dridtecu6`  
Upload images via Cloudinary before creating an enterprise_account or pathway card, then pass the resulting `secure_url` as `airline_logo_url`.
