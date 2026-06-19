# Infrastructure Decision — PilotRecognition Platform
**Date:** June 19, 2026  
**Decision:** Migrate from Supabase Free to Cloudflare (Pages + D1 + Workers + R2)  
**Auth:** Keep Auth0 (free tier, 7,500 users)  
**For:** Benjamin, Karl, Daniel, Keiv — the whole team

---

## The Problem We Have Right Now

### Supabase Free Tier Is Broken
- Every time a pilot tries to log in or sign up, the database is **asleep**.
- It takes 15-30 seconds to wake up. Pilots see a spinner, then an error, then they leave.
- This is not a bug we can fix. It's how Supabase Free works — they intentionally pause idle projects.
- We have lost pilots because of this. Every day it stays broken, we lose more.

### What We Tried Already
- Keep-alive scripts (Oracle VM) — didn't stop the pausing.
- GitHub Actions pinging — didn't stop the pausing.
- UptimeRobot — helps slightly, but Supabase still throttles and throws 522 errors.
- The free tier is fundamentally unreliable for production.

---

## The Options We Looked At

| Option | Cost | What It Means | Verdict |
|--------|------|---------------|---------|
| **Supabase Pro** | $25/month ($300/year) | Pay Supabase to keep our database awake. Zero code changes. | Too expensive for a pre-revenue startup. |
| **RackNerd VPS** | $89/year (~$7.50/month) | Buy our own cheap server. Install everything ourselves. Maintain it forever. | Cheap, but Benjamin becomes the IT guy. SSH, Docker, updates, security patches. If it breaks at 3 AM, we fix it. |
| **Cloudflare Stack** | **$0** (free tier covers everything) | Move our database and API to Cloudflare's free services. No servers to manage. | **Chosen.** Zero cost, zero server management, and it scales to thousands of pilots. |

---

## Why We Chose Cloudflare

### In Plain Language (For Karl, Daniel, Keiv)

Think of our app like an airline:

- **The app (React)** = The cockpit instruments. The brain. This stays exactly the same.
- **Auth0** = The security checkpoint. Pilots show ID, get a boarding pass. We keep this.
- **Cloudflare Pages** = The gate agent. Shows the app to anyone who visits. Free, unlimited.
- **Cloudflare D1** = The filing cabinet that holds pilot records. This replaces Supabase. It **never sleeps**.
- **Cloudflare Workers** = The middle manager. When the app needs data, the Worker asks D1 and brings it back.
- **Cloudflare R2** = The cargo hold. Stores backup files, PDFs, images. We already use this.

**We don't own or manage any servers. Cloudflare runs everything. We just write the app code.**

### Why Not RackNerd?

RackNerd is a physical computer in a data center that we rent. It's cheap, but:
- We have to install the operating system, database, and security updates.
- If the hard drive dies, our data is gone unless we have backups (which we do on R2, but still).
- If it gets hacked, that's on us.
- If it breaks at 3 AM, Benjamin has to SSH in and fix it.
- RackNerd is a **budget** provider. Their support is slow. Their hardware is old.

**RackNerd is a great deal for people who know servers. We are not those people.**

### Why Not Supabase Pro?

$25/month is $300/year. That is real money when we have zero revenue. We are a pre-revenue startup with a September deadline. Every dollar matters.

If we had 1,000 paying pilots, $300/year would be nothing. But we don't yet.

---

## What Auth0 Does and Why We Keep It

### The 7,500 User Question

**Auth0 Free allows 7,500 active users.** After that, it costs ~$23/month.

| Question | Answer |
|----------|--------|
| Is 7,500 a problem right now? | **No.** We have maybe 50-100 users. |
| Will we hit 7,500 soon? | **Not before we have revenue.** |
| What happens if we do hit it? | We pay $23/month. At that point, we have a successful product and revenue. |
| Should we build our own login system to avoid the $23? | **No.** Building login from scratch is 2-3 weeks of work, full of security holes, and constantly needs maintenance. |
| Why not switch to Firebase Auth (also free, unlimited)? | We'd have to rewrite ALL our login code. 1 week of work for zero user benefit. Not worth it right now. |

**Auth0 is not the problem. The database that falls asleep is the problem.**

### What Auth0 Handles (So We Don't Have To)
- Google Sign-In
- Email/password login
- Password reset emails
- Session tokens (keeping pilots logged in)
- Account security (rate limiting, brute force protection)
- Admin dashboard to see all users

**We keep Auth0 exactly as-is. We don't touch it.**

---

## The Cloudflare Stack: What Costs What

| Service | What It Does | Free Tier Limit | Our Cost |
|---------|-------------|-----------------|----------|
| **Cloudflare Pages** | Hosts our React app | Unlimited bandwidth, unlimited requests | **$0** |
| **Cloudflare Workers** | Runs our API (the middle manager) | 100,000 requests/day | **$0** |
| **Cloudflare D1** | Our new database (replaces Supabase) | 500 MB storage, 100K reads/day, 1K writes/day | **$0** |
| **Cloudflare R2** | File storage (backups, PDFs) | 10 GB | **$0** |
| **Auth0** | Login and user management | 7,500 users | **$0** |
| **Resend** | Transactional emails | 3,000 emails/month | **$0** |
| **Cloudinary** | Image hosting | Free tier | **$0** |

**Total infrastructure cost: $0 per month.**

### When Would We Pay?

If we grow to ~10,000 very active pilots:
- Cloudflare Workers: ~$5/month
- D1 reads/writes: ~$5/month
- R2 storage (over 10GB): ~$1/month
- **Total: ~$11/month**

Compare to Supabase Pro: flat $25/month regardless of users.

**Cloudflare is cheaper until we have ~20,000 pilots. Then we can afford $25+ anyway.**

---

## The Traps and Downsides (Honest Assessment)

### 1. D1 Write Limit: 1,000 per day
- Every time a pilot updates their profile, adds a logbook entry, or we write audit data = 1 write.
- At 100 pilots, we might use 200-500 writes/day. Fine.
- At 1,000 very active pilots, we might hit the limit.
- **Mitigation:** We batch writes where possible. Profile updates are rare. Logbook entries are the main write.
- **Reality:** This limit is soft. If we exceed it, D1 slows down rather than breaking. We can add a paid plan later for pennies.

### 2. D1 Has No Real-Time Subscriptions
- Supabase could push live updates to the dashboard. D1 cannot.
- **Mitigation:** The app polls for updates every 30 seconds. For a pilot platform, this is fine. Pilots don't need millisecond-level live updates.

### 3. D1 Is SQLite, Not PostgreSQL
- Some advanced database features don't exist in SQLite.
- **Mitigation:** Our app doesn't use advanced PostgreSQL features. Basic tables, queries, and indexes work the same.

### 4. No Built-In Auth/RLS (Row Level Security)
- Supabase had RLS policies that automatically filtered data by user.
- D1 has no RLS. We must write our own "check this user owns this data" logic in the API.
- **Mitigation:** This is 1-2 days of work in the API layer. Not hard, just explicit.

### 5. Two Weeks of Rewrite Work
- We have to rewrite our database layer. Every `supabase.from('profiles').select()` becomes a `fetch('/api/profile')`.
- **Mitigation:** We do this once. After that, the infrastructure is free forever.

### 6. Migration Effort Later (If We Outgrow D1)
- If we hit 50,000+ pilots and want PostgreSQL on a server, migrating from D1 to PostgreSQL is a 1-2 week project.
- **Reality:** At 50,000 pilots, we have revenue and can hire a developer for $500 to do it. This is a "good problem to have."

---

## Egress and Bandwidth: Why We Don't Worry

### What "Egress" Means
- Egress = data leaving the server when someone visits your site.
- Hetzner, DigitalOcean, AWS, and RackNerd all charge for this.
- **Cloudflare does NOT charge for egress. Ever.** It's their core marketing promise.

### Why Cloudflare Is Different
- Cloudflare makes money selling security and speed to big companies like Shopify and Discord.
- They don't need to charge startups for bandwidth. They want developers on their platform.
- Even if we serve 1 million pilots, Cloudflare Pages bandwidth is still $0.

---

## Why Cloudflare Is Reliable

| Provider | Uptime | Our Experience |
|----------|--------|---------------|
| **Supabase Free** | N/A (by design it pauses) | Daily timeouts and 522 errors |
| **RackNerd** | ~99.5% | Unknown, but budget hardware fails more often |
| **Cloudflare** | **99.99%** | Occasional 1-hour outage every 1-2 years. Far more reliable than Supabase pausing daily. |

Cloudflare runs the internet for massive companies. A 1-hour outage every year is nothing compared to Supabase pausing on us every single day.

---

## The Work Ahead (Two-Week Plan)

### Week 1: Backend Migration
| Day | Task | Who |
|-----|------|-----|
| 1 | Create D1 database schema | Benjamin (with my code) |
| 1 | Set up Cloudflare Worker project | Benjamin |
| 2-3 | Write API endpoints (profile, logbook, pathways, credentials) | Benjamin |
| 4 | Write export script to pull data from Supabase | Benjamin |
| 5 | Import data into D1, test everything | Benjamin |

### Week 2: Frontend Migration
| Day | Task | Who |
|-----|------|-----|
| 6-8 | Replace Supabase calls with fetch() to new API | Benjamin |
| 9 | Update environment variables, deploy to Cloudflare Pages | Benjamin |
| 10 | Test login, profiles, pathways end-to-end | Team (Karl, Daniel, Keiv) |
| 11-12 | Bug fixes, polish | Benjamin |
| 13-14 | Soft launch, monitor, celebrate | Everyone |

---

## Summary for the Team

| Question | Answer |
|----------|--------|
| **Why are we doing this?** | Supabase Free is broken. Pilots can't log in. |
| **What does it cost?** | **$0.** |
| **Who manages the servers?** | **Nobody.** Cloudflare runs everything. |
| **Will login still work?** | **Yes.** Auth0 stays exactly the same. |
| **What if we grow to 10,000 pilots?** | We might pay ~$10/month. Still cheaper than Supabase Pro. |
| **What if Cloudflare goes down?** | It happens once a year for an hour. Supabase pauses on us every day. |
| **How long until this is done?** | **2 weeks of focused work.** |
| **What if this breaks?** | We have nightly backups on R2. We can rebuild anywhere in 30 minutes. |
| **Does Karl/Daniel/Keiv need to learn servers?** | **No.** Benjamin writes the code once. Everyone else just uses the app. |

---

## Decision

**We are moving to Cloudflare D1 + Workers + Pages. We are keeping Auth0. We are not buying RackNerd. We are not paying Supabase $25/month.**

**The trade-off is 2 weeks of Benjamin's time in exchange for $0 infrastructure costs forever.**

**Approved by:** Benjamin Bowler  
**Date:** June 19, 2026

---

*Next step: Start writing the D1 schema and Worker API code.*
