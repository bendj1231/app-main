# Payment Setup Instructions
## PilotRecognition.com — Launch Payment Stack
**Last updated:** May 2026

---

## The Flow

```
Pilot (Philippines)
  → GCash → Coins.ph → buys USDC → sends to your Phantom wallet
  → You confirm payment in Phantom
  → You log into Veremark → trigger pilot's check manually
  → Veremark charges $22 from pre-funded balance
  → Pilot gets verified
  → You keep ~$77
```

---

## STEP 1 — Set Up Phantom Wallet (5 minutes)

1. Go to **phantom.app**
2. Click **Create New Wallet**
3. Write down the **12-word seed phrase on paper** — this is the only way to recover your wallet. Do not take a screenshot. Do not save it on your phone. Write it on paper and store it safely.
4. Set a password
5. Once inside, click **Solana** network (default)
6. Click **Receive** → copy your wallet address (looks like: `7xKf...abc`)
7. **Save that address** — this is what you give pilots to send USDC to

---

## STEP 2 — Pre-Fund Veremark (15 minutes)

1. Log into your Veremark dashboard
2. Go to **Billing** or **Credits**
3. Select **Buy Credits** — purchase **$220 worth** (covers 10 pilot checks at $22 each)
4. Enter your mom's **SBM Mauritius debit card**
5. Your mom needs to be nearby — SBM will send an **OTP to her phone**
6. Enter the OTP to approve the transaction
7. Credits now sit in your Veremark account — no more card needed until balance runs low

**Top up rule:** When balance drops below 3 checks ($66), top up again.

---

## STEP 3 — What You Tell Pilots (the payment instructions)

When a pilot wants to subscribe to Recognition Plus, send them this message:

---

*"To complete your Recognition Plus subscription ($99/year), please follow these steps:*

*1. Open Coins.ph on your phone*
*2. Go to Buy Crypto → select USDC*
*3. Pay using GCash — amount: PHP 5,700 (approximately $99 USD)*
*4. Once you have USDC, tap Send*
*5. Send to this address: **[YOUR PHANTOM ADDRESS HERE]***
*6. Send me a screenshot of the transaction*
*7. Your verification will be activated within 1 hour"*

---

## STEP 4 — When a Pilot Pays (your manual process)

1. Open Phantom wallet
2. Confirm USDC has arrived (check the transaction)
3. Log into Veremark dashboard
4. Click **New Check** → select the pilot's region (Philippines)
5. Enter pilot details — name, PEL number, email
6. Submit — Veremark deducts $22 from your pre-funded balance
7. Reply to pilot: *"Your verification has been initiated. You will receive results within 3-5 business days."*
8. Log the transaction in your tracking sheet (see below)

---

## STEP 5 — Track Every Transaction

Keep a simple Google Sheet with these columns:

| Date | Pilot Name | USDC Received | Veremark Cost | Profit | Veremark Check ID | Status |
|------|-----------|---------------|---------------|--------|-------------------|--------|
| 27 May | John Cruz | $99 | $22 | $77 | VRM-XXXX | Initiated |

---

## When to Top Up Veremark

- Check balance after every 3 pilots
- Top up in $220 blocks (10 checks)
- Always top up before balance hits zero — don't let a pilot pay and have no credits available

---

## Referral Tracking — Team Codes

When a pilot signs up, ask: *"Were you referred by anyone?"*

| Person | Code |
|--------|------|
| Benjamin | BENJAMIN |
| Karl | KARL |
| Daniel | DANIEL |
| Keiv | KEIV |

Log the referral code in your tracking sheet. The database handles commission calculation automatically.

---

## Summary — What's Needed Before First Pilot

- [ ] Phantom wallet created, address saved
- [ ] Veremark pre-funded with $220
- [ ] SBM card e-commerce enabled (mom activates via SBM app or calls +230 202 1256)
- [ ] Google Sheet tracking set up
- [ ] Phantom address shared with Daniel and Keiv so they can send to pilots

---

*This is the manual v1 process. Once volume exceeds 20 pilots/month, automate with Helio webhooks.*
