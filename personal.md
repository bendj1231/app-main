# Personal Session Notes — June 28, 2026

## Current Situation

- Living in the Philippines on 50,000 PHP/month allowance from father (ends August 2026)
- Father cutting off all support in August; no September allowance
- Mother's house rent in Mauritius (44,000 MUR/month) is critical income — do NOT sell
- Father is pressuring sale of house for his share; this must be resisted
- Visa status uncertain after August; school paid until August only
- Surviving on one meal/day; M4 Air laptop is last significant possession from father
- Girlfriend and dog living with me; 2,000 PHP remaining until next allowance

## Emotional State

Exhausted, spiraling, feeling like a failure. Comparing to past unfinished projects (limo business, etc.). Father's emotional abuse and stepmother's indifference are compounding pressure.

**Reality check:** CPL License 155660-CPL is REAL. It was earned. It is on the CAAP registry. That is a finished thing.

## Business / Team Situation

### Karl ("Cofounder")
- Since January 2026, keeps promising to come. Never arrived.
- April 28 was the last date. It is now June 28. Two months of waiting.
- **Decision:** Set hard deadline: July 15. If no flight booked, he is out.

### Kiev
- Actually shows up and does work.
- Wants equity/cut + suggesting a 260,000 PHP loan using BRN.
- **Decision:** NO loan. NO debt. NO signing anything tonight.
- If Kiev wants partnership, he proves value in one week first. Equity only for work done.

### BRN / Company
- Sole proprietorship. I own it. Keep it unencumbered.
- Do NOT let anyone take loans against it. Do NOT sign personal guarantees.

## Product — PilotRecognition.com

### What Actually Works (Real Code)
- Cloudflare Worker API with D1 SQLite (`getDashboardData`, batch actions, profile CRUD)
- Auth0 JWT authentication
- Wallet shell: ECDSA P-256 key generation in IndexedDB, did:key derivation
- VC Builder: W3C credential construction (license, medical, OEM attestation)
- MyFlightBook OAuth integration (logbook connect)
- Terminal state machine (T1/T2/T3) for UI gating
- Dodo Payments webhooks
- Resend email sending
- `UnifiedPilotPlatform.tsx` with single API call architecture

### What Is Cut (But Code Is Still Heavy)
- Onboarding UX is staged: Stage 1 (name/DOB/nationality) → Stage 2 (license/role/stage/hours) → Create
- But `BecomeMemberPage.tsx` is still 2,798 lines carrying dead logic (wallet flows, modals, passkey, etc.)
- **Tomorrow's task:** Refactor to ~400 lines. Move advanced logic to `PilotLicensureExperiencePage.tsx` where it belongs.

### What Is NOT The Product Anymore
- Cryptographic VC signing (enclave, walt.id, etc.) — deprioritized
- Complex onboarding gate — deprioritized
- The product is now: Create profile → Connect logbook → View pathways → Recognition+ verification via consultancy

## Immediate Survival Priorities (Before Code)

1. **Sleep tonight.** No more coding. No more decisions.
2. **Call mother tomorrow.** Warn her about father's pressure to sell house. Protect the asset.
3. **Talk to girlfriend.** She needs to know the financial reality before August.
4. **Flight school / instructor positions.** Ask about ground instructor, sim operator, any paid role.
5. **No loans.** No debt. No signing company documents while exhausted.

## Technical Plan (When Ready)

1. Refactor `BecomeMemberPage.tsx` to 2-stage gate only (~400 lines)
2. Keep `PilotLicensureExperiencePage.tsx` as advanced profile completion (3,481 lines — already correct)
3. Ensure `getDashboardData` surfaces pathway matches
4. Build consultancy intake form for Recognition+ verification ($120/pilot)
5. Admin dashboard for manual verification workflow

## The Real Fight

Not the app. Not Karl. Not the loan.

The fight is surviving August with the house intact, the company unencumbered, and the CPL still valid.

Everything else — the code, the platform, the vision — waits until survival is handled.

**I built the app because it's something I can control.** The app can't reject me. The app can't tell me I'm not family. But the app also can't feed me.

## Reminders

- I am not a failure. I have a CPL. I built a working platform alone.
- My father spent $200K on flight school and treats me like a stranger. That is his failure, not mine.
- My stepmother gets an iPhone 16 Pro Max and sends automated allowance texts. I get one meal a day and an eviction timeline. I see it.
- My mother is fighting for me. Protect her house. Protect her income.
- My girlfriend is still here. She chose me. Don't waste that by pretending the app will save us.

## Crisis Resources

If thoughts of self-harm emerge:
- **Philippines Hopeline:** 0917-558-4673 or 2919 (toll-free)

## Next Action (Tomorrow Morning)

1. Call mother about house
2. Call girlfriend about money
3. Call flight school about instructor work
4. Then, and only then, open the laptop

---
*Written after a midnight session where exhaustion, fear, and clarity collided.*
