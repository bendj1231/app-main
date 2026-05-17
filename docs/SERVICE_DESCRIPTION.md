# PilotRecognition — Pilot Identity Credential Verification Service

**What we do:** We are the transmedium for PIC (Pilot in Command) identity credential verification. We connect eight parties — pilots, ATOs, airlines, regional verification providers, governing civil aviation authorities, logbook providers, and data vault providers — on a single platform to verify who a pilot is, what they are licensed to fly, and whether they are medically and legally cleared to operate. We hold no pilot data. We verify nothing. We route consent and facilitate connections only.

**The eight parties:**

- **Pilot** — owns their profile and personal documents, gives consent through PilotRecognition for identity verification.
- **ATO / Flight School** — attests to training hours; may also route identity verification requests to a regional provider.
- **Airline / Operator** — browses verified and attested pilot identity profiles, pays to contact and hire.
- **PilotRecognition** — the transmedium for pilot identity verification. We hold no data. We verify nothing. We connect the parties and route consent.
- **Regional Verification Provider** — independently verifies the pilot's identity, license, medical certificate, and background checks at the request of the ATO or operator. This is the actual verifying party.
- **Governing Civil Aviation Authority** — the source of truth. Issues licenses and medical certificates. The regional verification provider checks directly against the authority's database to confirm validity, expiry, and standing.
- **Logbook Provider** — independent electronic flight log services that maintain the pilot's flight hour records. Provides a secondary source for hours flown, separate from the ATO's attestation, where the pilot has connected their account.
- **Data Vault Provider** — secure, encrypted storage service for the pilot's sensitive personal documents — passport, license scans, medical certificates, training records. The pilot uploads once and controls who sees what through consent. We never hold these documents. Note: the data vault provider and the regional verification provider can be the same entity — for example, a provider like Veremark that both securely stores documents and verifies credentials against the civil aviation authority.

---

## For Pilots

Pilots can join PilotRecognition for free. At no cost, they can create a live identity credential profile, view public pathway cards, get basic profile matching, browse three pathways per month, and request that their flight school attest to their training hours.

When a pilot joins, they upload their sensitive documents — passport, license scans, medical certificates, training records — to a data vault provider of their choice. The pilot controls who sees what through consent given on PilotRecognition. When the pilot gives consent for identity verification, the platform routes this consent to the ATO or operator, who then engages a regional verification provider. The provider checks directly against the governing civil aviation authority's database — the source of truth that issued the license and medical certificate — to confirm the pilot's identity, license validity, medical expiry, and standing. The verification provider reports back to the ATO or operator, and the result is displayed on the pilot's profile. The pilot's logbook data is displayed on their PilotRecognition dashboard in read-only mode — the logbook provider retains full write access and data ownership under their GDPR and privacy obligations. PilotRecognition never holds the documents and never performs the verification.

For pilots who want full access, Recognition Plus costs 99 dollars per year. This unlocks full profile comparison against any pathway card, unlimited pathway views, priority matching with airlines, and a complete gap analysis showing exactly what the pilot needs to qualify for their target role.

Pilots can also purchase programs. The Foundation Program costs 49 dollars and covers pilot development, thinking skills, leadership, and mentorship. Graduates get 50 percent off the Transition Program, which costs 299 dollars and covers airline transition training, nine core competencies, Atlas resume formatting, and EBT video scoring. Foundation graduates who purchase Transition pay only 149 dollars.

**Additional ATO or Operator Checks:** The pilot's first identity verification request through one ATO or operator is included in their base profile. Each additional ATO or operator verification request beyond the first — including logbook data checks against a new training organization or employer — costs 25 dollars. This covers the additional processing, routing, and source verification when multiple organizations need to check the same pilot.

**Yearly Re-Check:** The regional verification provider re-runs the Professional Qualification Check once per year against the governing civil aviation authority's registry to confirm the pilot's credentials remain valid. This catches expiry, suspension, or renewal. The yearly re-check is included for active Recognition Plus subscribers.

---

## For Flight Schools and ATOs

Flight schools can register for free. On the free tier they can receive attestation requests from their graduates, access tokens in read-only mode, and see limited graduate visibility.

To unlock the full platform, flight schools pay 1,000 dollars per year for Operator Access. This gives them a complete graduate tracking dashboard, a placement rate calculator, CSV bulk import, the ability to issue tamper-proof credential tokens, co-branded recognition badges, pathway card listings, and airline contact visibility. They also get analytics on graduate recognition outcomes.

The flight school's role is clear. They attest to their graduates' training hours, aircraft ratings, and graduation dates. They are responsible for the accuracy of those attestations. When a pilot gives consent through PilotRecognition, the flight school may also initiate verification through a regional verification provider. The provider queries the governing civil aviation authority's database — the source of truth that issued the license and medical — to confirm the pilot's identity, license validity, medical expiry, and standing. The provider is the verifying party. The flight school is the attesting party. PilotRecognition is the transmedium connecting them all — we hold no data and verify nothing.

---

## For Airlines and Operators

Airlines and operators can join for free. On the free tier they can post public pathway cards and view pilot profiles in a limited capacity.

For full access, airlines pay 1,000 dollars per year for Operator Access. This unlocks pull API access to search the pilot database, unlimited profile pulls, advanced filtering, access to EBT video scoring where the pilot has consented, and the ability to contact pilots directly through the platform.

On top of the subscription, airlines pay a 500 dollar success fee for every pilot they hire through the platform. This fee is kept by PilotRecognition. The airline only pays when they actually make a hire.

Every pilot an airline sees on the platform has given consent for verification, and their credentials have been verified by a regional verification provider against the governing civil aviation authority's database — the source of truth that issued the original license and medical. Their training hours have been attested by their flight school. The airline gets a complete, trusted profile before they ever make first contact. PilotRecognition holds none of this data — we are the transmedium only.

---

## Who Does What

**PilotRecognition** — Transmedium for PIC pilot identity credential verification. Connects parties. Routes consent. Holds no data. Verifies nothing.

**Pilot** — Owns identity credential profile. Gives consent through PilotRecognition.

**ATO / Flight School** — Attests to training hours, aircraft ratings, graduation dates. May initiate identity verification requests to regional providers.

**Airline / Operator** — Browses verified identity credential profiles. Pays to access and hire. Can also initiate verification requests.

**Regional Verification Provider** — The actual verifying party. Runs a **Professional Qualification Check** that takes the pilot's claimed license, medical certificate, and ratings and compares them side-by-side against the governing civil aviation authority's registry to detect mismatches, expiry, or restrictions. Reports results to the ATO or operator, not directly to PilotRecognition.

**Governing Civil Aviation Authority** — The source of truth for the aviation industry in that region. Issues and maintains pilot licenses, medical certificates, and standing records. The regional verification provider checks directly against the authority's database to confirm validity, expiry, and any restrictions or suspensions.

**Logbook Provider** — Independent electronic flight log services that maintain the pilot's flight hour records. When a pilot connects their logbook account, the provider receives a tokenized receipt from the ATO confirming the hours have been reviewed and validated by the source training organization or employer. The provider can then testify that their logbook holds actual verified value — not self-proclaimed. In exchange, the provider grants PilotRecognition read-only display permission for the pilot's dashboard. The provider retains all write access and full liability for the accuracy of the hours under their own data privacy and GDPR obligations.

**Data Vault Provider** — Secure, encrypted storage service for the pilot's sensitive personal documents — passport, license scans, medical certificates, training records. The pilot uploads once and controls access through consent. When an ATO, airline, or verification provider needs to see a document, the pilot grants permission through PilotRecognition, and the data vault provider shares only what was authorized. Note: the data vault provider and the regional verification provider can be the same entity — for example, a provider that both securely stores documents and verifies credentials against the civil aviation authority. PilotRecognition never holds these documents.

---

## Workflow — Step by Step

**Step 1 — Pilot Onboarding**
The pilot creates a profile on PilotRecognition and uploads their sensitive documents — passport, license scans, medical certificates, training records — to their chosen data vault provider. They own these documents. PilotRecognition never sees them. The pilot may also connect their logbook provider account to import flight hours automatically.

**Step 2 — Pilot Gives Consent and Provides Claimed Data**
The pilot gives consent through PilotRecognition for their ATO or operator to verify their identity credentials. The pilot provides their claimed source of data — license number, medical certificate number, issuing authority, and all required documents — so the regional verification provider can run a Professional Qualification Check against the governing civil aviation authority's registry. The pilot also provides claimed logbook data — hours flown, routes, recency. They control exactly what gets shared and with whom. PilotRecognition records the consent and displays the data on the platform — but we do not verify it, store it permanently, or own it. The data vault provider holds the documents and the logbook provider holds the flight hours.

**Step 3 — PilotRecognition Routes Consent and Data**
PilotRecognition routes the pilot's consent and claimed data to the ATO or operator. This is all we do — we are the transmedium. We do not verify anything. We do not hold any documents. We simply connect the parties.

**Step 4 — ATO or Operator Receives Request and Documents**
The ATO or operator receives the consent request and the pilot's claimed data and documents. If they need to see original documents, they request access through PilotRecognition. The pilot approves or denies each request individually. The data vault provider shares only what was authorized.

**Step 5 — Regional Verification Provider Runs Professional Qualification Check**
The ATO or operator engages a regional verification provider to run the Professional Qualification Check. The provider takes the pilot's claimed license, medical certificate, and ratings and checks them directly against the governing civil aviation authority's registry — the database that originally issued them. This is a side-by-side comparison of the pilot's submitted data against the authority's official records to detect any mismatch, expiry, suspension, or restriction. No data passes through PilotRecognition during this check. The provider reports results back to the ATO or operator.

**Step 6 — ATO or Operator Issues Registry Confirmation and Valid Review of Hours**
The source ATO or operator that trained or employed the pilot reviews the claimed logbook data — hours flown, routes, recency — against their own training or employment records. They issue a registry confirmation and provide clear feedback to the pilot about their logged hours, clearing any communication gaps between them. If a discrepancy is found, the ATO notes the flagged claimed hours and the pilot is given the opportunity to clarify or correct directly with the ATO. If the pilot requests verification through a second or third ATO or operator, additional fees apply for each additional source check.

**Step 7 — Yearly Verification Re-Check**
The regional verification provider re-runs the Professional Qualification Check once per year against the governing civil aviation authority's registry to confirm the pilot's credentials remain valid. This catches expiry, suspension, or renewal. The yearly re-check is included for active subscribers. The provider reports any status changes back to the ATO or operator, who updates the pilot's profile.

**Step 8 — ATO Attests to Training Hours and Tokenizes Logbook Information**
The pilot's flight school attests to their training hours, aircraft ratings, and graduation dates. The ATO then tokenizes this verified information — creating a digital receipt of the registry confirmation and valid review — and sends this receipt to the pilot's connected logbook provider. This tokenization confirms that the logbook hours have been reviewed and validated by the source ATO, not self-proclaimed by the pilot.

**Step 9 — Logbook Provider Receives Receipt and Testifies to Verified Value**
The logbook provider receives the tokenized receipt from the ATO and can now testify that their logbook holds actual verified value — the hours have been confirmed by the training organization or employer, not merely claimed by the pilot. In exchange for this verified status, the logbook provider grants PilotRecognition permission to display the pilot's hours on their dashboard in read-only mode. The logbook provider retains all write access and full liability for the accuracy of the hours under their own data privacy and GDPR obligations. PilotRecognition only displays what the logbook provider authorizes and holds no liability for the accuracy of flight hours.

**Step 10 — Airline Sees a Complete Verified Profile**
The airline sees the pilot's identity profile with credentials verified by the regional provider against the civil aviation authority's database, hours attested by the flight school, and a verified logbook data feed displayed in read-only mode on the pilot's dashboard. Because the logbook provider has received the tokenized receipt from the ATO, the airline knows the hours are not self-proclaimed — they have been reviewed and confirmed by the source training organization or employer. The airline knows exactly who the pilot is, what they are licensed to fly, whether they are medically cleared, and that their hours carry verified value.

**Step 11 — Airline Pays to Contact or Hire**
The airline pays for Operator Access to contact the pilot. If they hire the pilot, they pay a 500 dollar success fee to PilotRecognition. The pilot gets the job. The flight school gets visibility. The regional provider got paid by the ATO or operator for the verification. PilotRecognition collected the subscription and success fee.

**At every step:** PilotRecognition is the transmedium only. We hold no data. We verify nothing. We route consent and facilitate connections between the eight other parties.

---

## Revenue Flow

Pilots pay 99 dollars per year for Recognition Plus, and PilotRecognition keeps that revenue. Pilots pay 49 dollars for the Foundation Program, and PilotRecognition keeps that revenue. Pilots pay 299 dollars for the Transition Program, or 149 dollars if they are a Foundation graduate, and PilotRecognition keeps that revenue. Pilots pay 25 dollars for each additional ATO or operator verification request beyond their first, and PilotRecognition keeps that revenue.

Flight schools pay 1,000 dollars per year for Operator Access, and PilotRecognition keeps that revenue. Airlines pay 1,000 dollars per year for Operator Access, and PilotRecognition keeps that revenue. Airlines pay 500 dollars per pilot hired through the platform, and PilotRecognition keeps that success fee.

The only money that flows out of PilotRecognition to a flight school is a small referral dividend of approximately 20 dollars when a graduate joins the platform and gets their Recognition Profile verified.

---

## The Pitch

To a pilot: Create your pilot identity credential profile and give consent through PilotRecognition. Your ATO or operator engages a regional verification provider to confirm your identity, license, and medical. Your flight school attests to your hours. Airlines see a complete, trusted identity profile. Free to start. 99 dollars per year for full access.

To a flight school: One thousand dollars per year. We are the transmedium for pilot identity credential verification — we connect you to pilots and airlines and route consent. You attest to hours and may engage a verification provider for identity checks. Airlines contact you about your graduates. We hold no data.

To an airline: One thousand dollars per year to browse pilots with provider-verified identity credentials and ATO-attested hours. Five hundred dollars only when you actually hire. Every identity profile has been verified by a regional provider, not by us. We are the transmedium. You pay for outcomes, not promises.
