import React, { useState } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { sanitizeJsonLd, sanitizeHtml } from '@/src/lib/sanitize-html';

interface FAQPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const [openItem, setOpenItem] = useState<string | null>(null);

    const toggle = (key: string) => setOpenItem(prev => prev === key ? null : key);

    const faqs = [
        {
            category: "What it is",
            label: "Platform Overview",
            questions: [
                {
                    q: "What is PilotRecognition?",
                    a: "Aviation's first pilot-owned career platform. The industry has never given pilots the infrastructure to prove who they are — only the paperwork to survive audits. PilotRecognition fixes that. You sync your logbook from your flight logbook provider. You verify your license, medical, and credentials through international verification providers. You build a recognition profile that reflects what you've actually done — not just what you claim. Operators post pathway cards showing exactly what they need. You align your profile, submit interest, and consent to verified data being shared. Airlines see real people with real proof. Not 500 PDF resumes."
                },
                {
                    q: "This sounds like a job board. Is it?",
                    a: "No. Job boards are push-based: you send a CV into a void, hope someone reads it, compete with everyone else who sent the same thing. PilotRecognition is a pulling system. Operators post what they need — hours, ratings, nationality requirements, type rating preferences, experience level. You align your profile against those requirements. When an operator sees a verified pilot who matches and submits interest, they initiate a Pull — a consent-based request to access your verified data. You read the request. You consent. That's the handshake. No unsolicited contact. No guessing. No wasted applications."
                },
                {
                    q: "How does it actually work — step by step?",
                    a: "<strong>1. Sign up</strong> — create your profile, text-based for free members, document upload for Recognition Plus.<br/><br/><strong>2. Discover programs and pathways</strong> — browse operator pathway cards, understand industry requirements, see where you stand before applying anything.<br/><br/><strong>3. Build your recognition profile</strong> — sync your logbook, add your licenses, ratings, and experience. Free members are text claims. Verified members have documentation backed by regional verification providers.<br/><br/><strong>4. Get verified</strong> — Recognition Plus members upload credentials temporarily to our secure storage. With your consent, a regional verification provider accesses and authenticates them. Once confirmed, your credentials are deleted from our storage and a Verified Credential token is issued to your cryptographic wallet. We receive only the confirmation — we never see your documents.<br/><br/><strong>5. Access exclusive pathways</strong> — verified members unlock private pathways: charter operators, corporate aviation, and operators who require background-checked pilots before entry.<br/><br/><strong>6. Submit interest with one profile</strong> — submit to multiple pathways simultaneously. Operators see your verified data-rich interest.<br/><br/><strong>7. Operator engages — for free</strong> — if an operator wants to move forward, they send you a consent message. Free. They may include a confidential offer document — salary, base, days on/off, conditions. That document self-destructs within 5 days of inactivity. You read it, negotiate if needed, and decide.<br/><br/><strong>8. Employment verification</strong> — once you agree to proceed, the operator commissions additional employment-grade verification checks through our verification provider. That cost is on the operator, not you. A pilot should never pay for pre-employment checks before securing the job."
                },
                {
                    q: "What's the difference between a free and verified member?",
                    a: "Free members are a claim. You can build a profile, list your experience, create a wallet, and browse airline and manufacturer pages to align your profile. But your hours are unverified, your license is unverified, and your credentials are text — not documentation. Operators can see free profiles but the industry standard for serious hiring is verified data. If an airline notices a free profile that interests them, they will notify that pilot — but they will recommend verification before proceeding. That notification is actually your confirmation: the platform is working. Recognition Plus is how you convert that interest into a verified conversation."
                },
                {
                    q: "Why join now and not when you have more operators?",
                    a: "Because recognition is built before the room fills up. The pilots who build verified profiles now are the ones operators see first when they join. Recognition Plus members who verified early hold positions in exclusive pathways that later applicants cannot access retroactively. Every month you wait is a month another pilot ahead of you in the queue."
                }
            ]
        },
        {
            category: "What it costs",
            label: "Pricing",
            questions: [
                {
                    q: "What do pilots pay?",
                    a: "<strong>Free tier — $0:</strong> Create a profile, build a wallet, browse pathways and operator pages, submit basic interest. Your data is text-only — no document uploads, no verification. You are a claim, not a confirmed identity.<br/><br/><strong>Recognition Plus — $99/year:</strong> The verified tier. Document upload, credential verification via regional providers, Verified Credential token issued to your cryptographic wallet, blue verification badge, access to exclusive private pathways (charter, corporate, confidential airline postings), full profile comparison against operator requirements, and unlimited pathway submissions. Credentials must be re-verified yearly to maintain active status — because the industry needs current, not outdated, records.<br/><br/><strong>Foundation Program — free to enter, $49 certification:</strong> 50 hours of logged mentorship, EBT CBTA-aligned industry education, understanding of the pilot pipeline, type rating investment risk management, and a practical mentorship interview. Certification at completion adds a layer to your profile that operators can request to view.<br/><br/><strong>Transition Program — $149 ($99 for Foundation graduates):</strong> Advanced EBT CBTA video assessment, 9-competency scoring, direct pathway eligibility preparation."
                },
                {
                    q: "What do operators and airlines pay?",
                    a: "Operators contact us to request free enterprise access. We review and approve. Approved operators get: up to 3 pathway card postings, pilot interest inbox, up to 10 profile views, and a 1-month expectation page where they answer the questions pilots actually need answered — nationality requirements, hour thresholds, self-funded type rating preferences, what makes their pathway worth choosing. That transparency is what gives pilots the tools to align properly.<br/><br/>If an operator wants to Pull a pilot directly — initiate a consent-based verified data request — they pay a <strong>$500 recognition fee</strong> per Pull. That fee goes back into the platform. No annual subscription. No per-seat pricing. Just a fee when a real engagement is initiated."
                },
                {
                    q: "Do airlines pay a subscription?",
                    a: "No. The industry model on platforms like this has always required pilots to pay — because pilots are the ones investing in their careers. Airlines don't pay monthly subscriptions here. They get free posting, free traction visibility, and free pilot interest. The only time they pay is when they initiate a direct Pull on a verified pilot. That $500 is not a subscription — it is a transaction fee for a real, consent-gated engagement with a background-checked candidate."
                },
                {
                    q: "What is the $500 recognition fee for?",
                    a: "The $500 is charged to operators for employment-grade verification checks commissioned through our verification provider — the additional background and employment checks that happen after a pilot has agreed to proceed with an operator. Pilots never pay for pre-employment checks. That cost belongs to the employer. The consent engagement itself — the initial message, the confidential offer, the negotiation — is free. Operators only pay when they are ready to formally progress a candidate."
                },
                {
                    q: "Is there a referral program?",
                    a: "Yes. If you refer another pilot to Recognition Plus and they subscribe, you earn $20 — paid from platform revenue on their $99/year subscription. Flight schools and ATOs on the $1,000/year enterprise partnership also operate their own referral system. For every pilot they route through the verification flow, they earn a 5% credit against their annual fee. At 50 verified referrals, their $1,000/year partnership is covered. That credit also means ATOs have a direct financial incentive to help their students verify — which reduces fraud and builds the credibility of the pool."
                }
            ]
        },
        {
            category: "The Foundation Program",
            label: "Foundation Program",
            questions: [
                {
                    q: "What is the Foundation Program and why does it exist?",
                    a: "Most pilots graduate with hours and no idea what the industry actually expects of them. They don't know what happens after 200 hours. They don't know why the queue is backed up. They don't know how to evaluate a type rating investment, or what separates a pilot who gets called back from one who doesn't. The Foundation Program exists to fix that. It's not flight instructing — you already know how to fly. This is about understanding the industry, your position in it, and how to navigate it without wasting $60,000 on the wrong decisions.<br/><br/>50 hours of certified mentorship, logged physically or digitally. Industry positioning modules — the pilot gap, career risk management, type rating economics. Mentorship education: how to guide fellow pilots, not teach them procedures. A practical written examination and a closing interview aligned to Airbus-inspired EBT CBTA standards. When you finish, that interview is attached to your profile — operators can request to view it."
                },
                {
                    q: "Is the Foundation Program just mentorship hours?",
                    a: "No. Mentorship is the practical and missionary component. You go out and help other pilots — in person, digitally, at your ATO, in your flying club — and log it. The mentee also logs the session independently. When both logs match, they are validated. If there is a discrepancy, it is flagged for review. Photo or video evidence can be submitted as supporting proof. The system flags suspicious patterns — more than 4 hours logged in a single day triggers a review notice. You cannot backdate or bulk-manufacture the 50 hours. Alongside the mentorship, you complete modules on industry positioning, type rating economics, career risk management, and pilot pipeline strategy. The program concludes with a written examination and an EBT CBTA-aligned recorded interview. Certification is $49 at completion."
                },
                {
                    q: "What is the Transition Program?",
                    a: "$149 ($99 for Foundation graduates). This is the advanced stage — a full EBT CBTA video assessment across 9 competency markers after your mentorship and program completion. It produces a detailed competency score that operators can access when reviewing your profile with your consent. Foundation graduates are prioritized. Without the baseline from Foundation, the assessment is rigorous and many pilots don't pass on first attempt."
                }
            ]
        },
        {
            category: "Verification & Your Wallet",
            label: "Verification & Your Wallet",
            questions: [
                {
                    q: "How does verification actually work?",
                    a: "Recognition Plus members upload their credentials — license, medical, ratings — to our temporary secure storage. You initiate the verification process. With your consent, a regional verification provider accesses your credentials and authenticates them against the issuing authority (CAAP, FAA, EASA, etc.). Once the provider returns their confirmation, your documents are automatically deleted from our storage. We receive only the result: verified or not. A Verified Credential token is then issued to your cryptographic wallet by the provider. That token is yours. PilotRecognition never sees your documents — we receive the stamp, not the paper."
                },
                {
                    q: "What is the cryptographic wallet?",
                    a: "Every pilot on PilotRecognition gets a wallet built on open-source cryptographic infrastructure (currently walt.id, with additional DID integrations planned). Only you can see what's stored in it. Your private key is bound to your device — synced to your Google or iCloud Keychain, or saved manually if you prefer. Every time you access your wallet, you decrypt it with your key. Every time you share data with an operator, you re-authenticate. Your credentials live there as cryptographic tokens — not PDFs that can be photocopied or falsified. We are the infrastructure. The key is yours."
                },
                {
                    q: "How are flight hours actually verified — not just documents?",
                    a: "This is where the platform earns its position. Hours verification is included in the $99/year Recognition Plus qualification check alongside your license, medical, ELP, and radio license. The process: your logbook provider (ForeFlight, Safelog, LogTen Pro, etc.) is accessed via API or export — with your consent — by the regional verification provider. The provider contacts your ATO or previous operator directly to confirm the hours you claim against their records and the Chief Flying Officer's endorsement. The ATO or operator becomes an issuer of verified flight hours. If they are a platform partner, they earn a 5% contribution credit for each verification they confirm. If hours are disputed or flagged as falsified, the claimant pays a $500 consultation fee to open a formal review process — which then escalates through the logbook provider, verification provider, CAA, and ATO independently. Remaining neutral in disputes is how we maintain credibility with everyone on the platform."
                },
                {
                    q: "Why do I need to re-verify every year?",
                    a: "Because the industry needs current credentials, not historical ones. A Class 1 medical commonly expires before the year is up. A license can be suspended. ELP has a validity window. Your verified status is only as current as your shortest-validity credential. Annual re-verification at $99/year keeps your Recognition Plus active and your verified directory listing current. If a credential lapses before your renewal date, your verified status updates to reflect that — operators see what you actually hold right now, not what you held at sign-up."
                },
                {
                    q: "What happens if I don't renew Recognition Plus?",
                    a: "You are downgraded to free tier. Your profile reverts to text-claim status — no verified badge, no exclusive pathway access, no priority matching. Your wallet tokens remain intact in your possession. Nothing is deleted. When you renew and re-verify, your status restores. The platform also flags credential expiry as part of the downgrade notice — if your medical or ELP has lapsed in the meantime, the re-verification process will surface that."
                },
                {
                    q: "What happens to my documents after verification?",
                    a: "Deleted automatically once the verification process completes. Your credentials are stored in a dual-provider system during the process — so if one storage provider goes down, continuity is maintained. After verification, both copies are purged. What remains is the Verified Credential token in your wallet, signed by the verification provider, not by us. We receive only the confirmation. We never retain the source files."
                },
                {
                    q: "Who owns my data?",
                    a: "You. Pilot in command of pilot identity — that is our legal and infrastructure position. PilotRecognition is the infrastructure data controller: we maintain the platform, storage providers, pathway operations, and user account access. You are the data controller of your credentials. You decide what you upload, who you consent to share with, and what interest you submit. Your wallet is encrypted, your private key is yours, and no one — including us — can read what is in it. You can delete your account and export your data at any time."
                }
            ]
        },
        {
            category: "Pathways & Operators",
            label: "Pathways & Operators",
            questions: [
                {
                    q: "What is a pathway card?",
                    a: "A pathway card is not a job posting. It is an operator's published expectations — the honest, specific requirements a pilot needs to meet before submitting interest. Hours. Ratings. Nationality. License type. Whether they accept self-funded type ratings. What makes their operation different. Why a pilot should choose them over a competing airline or ATO. Pathway cards give pilots the instruments to align their profile before they approach. No more applying blind. No more 6-week silence after sending a PDF."
                },
                {
                    q: "What are exclusive pathways?",
                    a: "Certain operators — private charter, corporate aviation, and client-confidential airline programs — post pathways only visible to verified Recognition Plus members. These operators require background-checked pilots before they will even read an interest submission. The gate of entry is your verification status. If you are verified, the pathway is visible and accessible. If you are not verified, it is not. This protects the operator's client confidentiality and protects pilots from entering processes they cannot complete."
                },
                {
                    q: "Can I submit interest to multiple pathways at once?",
                    a: "Yes. One verified profile, multiple simultaneous submissions. You build your profile once and align it toward any pathway you qualify for. Operators receive your interest with your verified data visible to them up to their access level. You do not need to reapply, reformat, or re-explain yourself for each one."
                },
                {
                    q: "How do operators contact me?",
                    a: "Operators who find your profile through the verified directory can send you a consent engagement — free of charge. They introduce themselves, reference your profile, and may attach a confidential offer document: salary, base location, days on/off, rostering conditions, and other specifics that operators normally keep off public postings. That document is self-destructing — it becomes inaccessible within 5 days of inactivity. You read it in the platform, negotiate if the terms need adjusting, and decide whether to proceed. If you proceed, the operator commissions employment-grade verification checks at their own cost. If you decline, nothing is shared and nothing is owed."
                },
                {
                    q: "What about type rating center pathways?",
                    a: "Type rating pathways are one of the most important and least understood decisions a pilot makes — a $60,000 investment, sometimes self-funded, with no clear answer on whether an A320 or A330 rating makes more sense for your specific career stage and target operators. Type rating center pathway cards on PilotRecognition answer that. They specify what type of pilots the rating is designed for, which operators actively use it, and what the career trajectory looks like after completion. You align your profile against that information before committing $60K, not after."
                }
            ]
        },
        {
            category: "Who it is for",
            label: "Who Is This For",
            questions: [
                {
                    q: "I just graduated with 200 hours. Is this for me?",
                    a: "Yes — and the earlier you start, the better your position. The recognition gap hits hardest at 200 hours. You have the investment behind you and no clear path forward. The Foundation Program was built for exactly this stage. It teaches you how the industry pipeline actually works, where the bottlenecks are, and how to position yourself ahead of the pilots waiting in the same queue. Your recognition profile starts building now, before the platform has more pilots competing for the same pathways. Starting early is the only advantage that can't be bought later."
                },
                {
                    q: "I'm an experienced instructor with 5,000+ hours. Is this still relevant?",
                    a: "Especially yes. Flight instructors are the most underrecognized pilots in aviation. You have 5,000 hours, 10–15 years of experience, and the industry treats you as a stepping stone, not a destination. PilotRecognition gives instructors the infrastructure to demonstrate what they've actually built — verified hours, mentorship credentials, competency scores — in a format operators can evaluate. It also exposes you to ATO and operator pathways specifically seeking experienced instructors, not just cadets."
                },
                {
                    q: "I already have connections at an airline. Why do I need this?",
                    a: "Connections get you into the room. Verified data is what you show when you're in it. An operator with a connection to you still needs documented, standardized proof of your credentials before they can progress hiring. PilotRecognition gives you that proof in a format that travels across every career move — not tied to one employer's HR system, not dependent on a reference that may or may not be favorable. Your recognition profile is yours. It doesn't change when your connections do."
                },
                {
                    q: "I fly charter or corporate, not airlines. Is this platform for me?",
                    a: "Yes. Corporate aviation, private charter, and specialized operations often require more rigorous background checks than mainline airlines — because clients are high-profile, operations are non-standard, and the liability is personal. Exclusive pathways on PilotRecognition are specifically designed for operators who need pre-vetted, verified pilots before they open a conversation. If you're in or moving toward corporate or charter, your verified profile is the access key to those pathways."
                },
                {
                    q: "I'm an AOM (Airline Operations Management) student with a PPL. Is this relevant?",
                    a: "Yes. Some operators are specifically looking for pilots who combine flight experience with business and operational management training — that profile is genuinely useful in airline operations, charter management, and aviation corporate roles. Your PPL hours can be verified, your AOM qualifications can be noted, and you can build a profile that reflects both sides of your training. Aviation isn't only about total hours."
                },
                {
                    q: "How do I improve my recognition score?",
                    a: "The score reflects what you have actually done — it's not a hidden algorithm. Verify your credentials, complete the Foundation Program, pass the Transition assessment, log genuine mentorship hours, and align your profile to pathway requirements. The profile dashboard shows you the gap between your current profile and any pathway you're looking at. Close the gap and the score reflects it. There are no tricks. Pathways are accessible to all members — exclusive ones require verified status, not a minimum score."
                }
            ]
        },
        {
            category: "Integrity & disputes",
            label: "Verification Integrity",
            questions: [
                {
                    q: "What if the verification provider doesn't respond or is slow?",
                    a: "Verification providers operate under a grace period SLA. If a provider does not respond within the defined window, the verification request is automatically relayed to the next available regional provider. We do not leave a pilot's verification stuck behind a single unresponsive party. Providers accepted onto the platform have agreed to response standards. Neutrality means we don't favour any one provider — if one fails to act, another picks it up."
                },
                {
                    q: "What stops an ATO from falsely confirming a pilot's hours to earn the 5% credit?",
                    a: "The CAA is the warrant. We verify credentials through the CAA first. The verification provider is then directed by the CAA to contact the specific ATO or operator on record — making it a CAA-sanctioned inquiry, not a cold call. The ATO is aware their confirmation will be triangulated against CAA records. A false confirmation from an ATO against CAA data creates a direct discrepancy that flags the ATO, not the pilot. As the platform grows and multiple pilots from the same ATO request verification simultaneously, the school becomes subject to a volume of CAA-coordinated checks — which pushes the industry toward compliant, internationally-monitored verification standards. The long-term goal is to work directly with CAAs to make this a government-monitored framework."
                },
                {
                    q: "What do operators actually see on a pilot's profile — and when?",
                    a: "Operators browsing the public directory see what is voluntarily public: account information and total logged hours as a number. Deeper data — verified credential statuses, competency scores, program completions, EBT CBTA interview — is only visible when a pilot submits interest in a pathway the operator has posted. That submission is the pilot's consent. Before that, the operator sees only what the pilot has chosen to surface publicly. No personal contact details, no license numbers, no medical examiner details — ever — without explicit pilot consent per engagement."
                },
                {
                    q: "The $500 dispute fee feels like a barrier. What if the error was yours?",
                    a: "The $500 is intentional — and it protects everyone including you. A dispute is not a complaint form. It opens a formal multi-party investigation involving the platform, the logbook provider, the verification provider, the CAA, and the ATO. Each of those organisations has their own investigation costs and administrative burden. The fee signals that a real, formal claim is being made — not a casual objection to a result someone didn't like. It keeps the dispute process credible and serious. We remain neutral precisely because every party, including pilots, knows that raising a dispute carries weight."
                }
            ]
        },
        {
            category: "Your data",
            label: "Data & Privacy",
            questions: [
                {
                    q: "Is my data secure?",
                    a: "Your credentials are encrypted at rest and in transit. Your wallet contents are visible only to you — they are cryptographically locked, not stored in plaintext anywhere on our infrastructure. Document uploads for verification are held in temporary secure storage and deleted automatically after the verification process completes. Operators cannot access your personal information without your explicit consent. Every access event is logged to your activity record. You can see who has viewed your profile and when."
                },
                {
                    q: "What if I want to delete my account?",
                    a: "You can delete your account and all associated data at any time from your settings. Your cryptographic wallet credentials are yours — export them before deletion if you want to retain your verified tokens for use elsewhere. Once deleted, your data is removed from our systems. We do not retain it."
                },
                {
                    q: "Can I use my verified credentials outside PilotRecognition?",
                    a: "Yes. That is by design. Your Verified Credential tokens are issued to a cryptographic wallet built on open standards. They are yours to use, port, and present wherever they are accepted. The platform is infrastructure — your career record is not locked inside it."
                }
            ]
        },
        {
            category: "Brutal",
            label: "No Softening",
            questions: [
                {
                    q: "You claim pilot data sovereignty but your infrastructure is US cloud providers subject to the CLOUD Act. How is that pilot-owned data?",
                    a: "Because what sits on our servers is not your credential data. Verified credentials live in your wallet, on your device, encrypted with a private key we have never held. What our databases store are hashes, consent logs, and profile metadata. A CLOUD Act request served to Supabase or MongoDB would return encrypted records with no decryption key — because the key was never ours to begin with. Your meaningful credential data left our servers the moment verification completed. The distinction between infrastructure data controller and pilot data controller is not just language — it is the architecture."
                },
                {
                    q: "The EBT CBTA video interview lets airlines evaluate a pilot's face, accent, and mannerisms. You've built a discrimination machine with a verified badge on it.",
                    a: "If an airline requested a pilot's interview, they were already interested in their verified profile. A pilot who refuses to do a face-to-face interview will face the same barrier in every airline selection process — the interview isn't invented by this platform. What the platform adds is a structured EBT CBTA scoring framework against 9 published competency markers: application of procedures, communication, workload management, situational awareness, problem solving, decision making, leadership, professionalism, and knowledge. An airline that discriminates on accent while using an internationally standardised competency assessment is violating the standard — that is between them and the pilot. The interview is a portfolio of the pilot's actual capability. The pilot consents to share it per operator, per engagement."
                },
                {
                    q: "A pilot pays $99, their CAA takes 6 months to respond, their ATO ignores emails. They've paid and they're stuck. What do you do?",
                    a: "The verification provider carries the liability for completing the verification, not the pilot. If a CAA or ATO is unresponsive, the verification provider goes in person — this is a consent-driven, urgent inquiry on behalf of a pilot actively submitting interest in a pathway. ATOs and CAAs are required to respond. If the institution delays the process, it exposes the weakness in their own compliance infrastructure. The pilot is not left without status — their profile shows a live delivery-tracker style update: verification submitted, CAA registry check in progress, ATO education check ongoing, result pending. Their Recognition Plus access is active throughout. The subscription clock does not run while verification is blocked by institutional delay."
                },
                {
                    q: "Pilots pay $99 to be visible. Operators get in for free. You've made pilots pay for the privilege of being recruited. How is that pilot-first?",
                    a: "Pilots are not paying to be recruited. They are paying to own a verified record of who they are — a credential that travels with their career for life, independent of whether any operator ever engages them. Operators get free access to post pathways because maximum operator participation is what makes the pilot's investment valuable. The operator pays nothing to browse. But once they want to run employment-grade verification and formally hire through the platform, the cost is on them — not the pilot. The pathway card is the destination the pilot is working toward. The operator's free posting is what makes that destination visible."
                },
                {
                    q: "The Foundation Program certificate is issued by a startup with no regulatory endorsement. Why would any airline care?",
                    a: "Because the certificate is a record of real, documented activity — not a credential from an authority. Behind every Foundation certificate is 50 independently dual-logged mentorship hours, fraud-detected with photo or video proof, cross-validated by both users. The EBT CBTA interview behind the Transition Program is scored against 9 internationally published competency markers. Those markers are Airbus-aligned — and we will be approaching Airbus for accreditation once 500 pilots have completed the program. The first cohort builds the standard. The campus and flight school partnerships are the distribution channel. The certificate earns its weight through the volume of pilots who hold it and the institutional endorsements that follow."
                },
                {
                    q: "You're a small team handling thousands of pilots' most sensitive documents. What happens when you get hacked?",
                    a: "A breach of our servers doesn't yield useful credential data — because it was never there. Free tier profiles are text, encrypted with keys held in the pilot's Google or iCloud Keychain, never on our database. Recognition Plus document uploads are temporary storage only — deleted the moment verification completes. What remains on our servers post-verification is hashed metadata with no decryption key in our possession. We are built on enterprise-grade infrastructure — Supabase, Neon, MongoDB — each with SOC 2 compliance, encryption at rest and in transit, and independent security audits. We have no single point of failure, like a multi-engine aircraft. Penetration testing and a formal security review are actively in progress. We do not treat security as a launch-day afterthought."
                }
            ]
        },
        {
            category: "Unfiltered",
            label: "The Hard Questions",
            questions: [
                {
                    q: "Why would any airline take this seriously?",
                    a: "Because the pilots force them to. PilotRecognition does not need to cold-call airline HR directors and pitch them a new recruitment tool. When a pilot initiates verification, the regional verification provider contacts the CAA and the pilot's ATO directly. That contact mentions PilotRecognition by name. The airline or ATO receives a professional, CAA-coordinated inquiry and understands the standard behind it immediately. We don't go to them. The verification process brings us into their operational reality. Veremark and our network of verification partners are the face of that professionalism."
                },
                {
                    q: "Every aviation hiring startup has failed. What makes this different?",
                    a: "The ones that failed built job boards for airlines and died waiting for procurement approvals. We sell to individual pilots at $99/year — one decision, one payment, no IT integration, no VP signature. But more importantly, the platforms that failed owned the pilot data. We don't. The pilot owns their verified credential in a device-bound wallet. If this platform shuts down, the pilot still has their verified record. That structural difference means pilots are building something for themselves, not renting access to our database. We also treat the existing market as partners — AeroCrew, Goose, and others can become pillars of the pathway ecosystem. More doors for pilots is the goal."
                },
                {
                    q: "A pilot verified, submitted to 10 pathways, and got zero responses in 6 months. What do you tell them?",
                    a: "We owe them data, not silence. If a verified pilot is getting no engagement, the platform surfaces: how many operators viewed their profile, how their profile compares to pilots who did receive engagement on the same pathways, and what specific gaps exist between their current profile and each pathway's requirements. Silence without context is not acceptable. The platform's job at that point is to tell them honestly what is missing and what to do about it — whether that's hours, a rating, a program completion, or a different pathway target entirely."
                },
                {
                    q: "An operator's pathway says nationals only, 2000 hours, self-funded type rating. You're charging 200-hour pilots $99 to see a door they can't open. Is that honest?",
                    a: "Yes — because the pathway card is not a rejection, it's a map. A 200-hour pilot seeing that requirement for the first time now knows exactly what the target is: the hours to build, the type rating to consider, the timeline to plan. Without that information, they were flying blind and potentially spending $60,000 on a type rating for an airline that requires nationals only. Pathway requirements are the operator's choice and we respect their criteria. The pilot's job is to use that information to build toward the right doors, not to complain the wrong ones are closed. The platform also shows pathways they do qualify for — alignment is the tool for that."
                },
                {
                    q: "At what point does a CAA or aviation authority say you can't operate a verification layer and shut you down?",
                    a: "PilotRecognition does not issue aviation credentials. The CAA issues the license. The medical examiner issues the certificate. The verification provider confirms their validity against the issuing authority. We tokenise that confirmation into a cryptographic wallet. We are infrastructure that records the outcome of an authorised verification — not a competing licensing body. That distinction is what keeps us outside the regulatory perimeter. The long-term direction is to approach CAAs as partners — a platform that surfaces fake licenses and reduces credential fraud at scale is something governments want to endorse, not restrict."
                },
                {
                    q: "What happens to the pilot database if PilotRecognition goes bankrupt or gets acquired?",
                    a: "An acquirer gets the platform infrastructure — not the pilot credentials. The verified credential tokens are device-bound, encrypted with the pilot's private key, and already out of our hands by design. The database a buyer would receive is a collection of hashed records with no meaningful access to the underlying credential data. PilotRecognition's legal position is that we are the infrastructure data controller — responsible for platform operations, storage providers, and pathway management. We are not the pilot data controller. Pilots control their own credentials. That position is built into the architecture, not just the terms of service."
                },
                {
                    q: "Why should I trust a platform this early — built by people nobody has heard of?",
                    a: "Because it was built by pilots who lived the problem, not consultants who studied it. The team behind PilotRecognition carries $50,000 in flight training debt. One of us has the CPL and the expired medical and knows exactly what it feels like to have credentials that no employer can see or verify. We almost walked away from aviation entirely. We built this because nothing existed that solved the problem we were living inside. The platform was started from zero coding knowledge \u2014 learned in order to build this specific thing. The architecture, the verification chain, the wallet, the mentorship fraud detection, the self-destructing offer system \u2014 none of it came from a product team in a corporate office. It came from pilots who needed it to exist and had no choice but to build it. That is the only qualification that matters for this problem."}
            ]
        },
        {
            category: "Standards & conduct",
            label: "Platform Standards & Conduct",
            questions: [
                {
                    q: "What happens if a pilot becomes permanently medically unfit or passes away?",
                    a: "Permanent medical unfitness is a credential event — it surfaces through the annual verification process as a grounded or lapsed medical certificate. The verified status updates to reflect the real credential state automatically. For pilots who pass away, the wallet is device-bound and private-key locked. If the key is lost, the wallet contents are cryptographically inaccessible to everyone including us — by design. The platform is working toward future integration with aviation insurance providers so that pilots facing permanent medical unfitness can access benefit provisions through their verified credential record. For pilots who disappear mid-verification, results are delivered to their email and account. If credentials are flagged, a review notice is issued. Aviation requires professional standards in credential presentation — incomplete or messy submissions are not accepted."
                },
                {
                    q: "A pilot leaked a confidential operator offer. What happens?",
                    a: "The platform maintains a full audit trail of every consent engagement: when the offer was opened, by which account, the consent chain, and the timestamp. That record is available to the operator as evidence in any legal proceeding they choose to initiate. PilotRecognition's role is to provide that audit trail and cooperate with legal process. The consequence between the operator and the pilot is a matter for them and their legal representatives — we provide the evidence, we do not adjudicate the outcome."
                },
                {
                    q: "Can a Foundation or Transition certification be revoked?",
                    a: "Yes. PilotRecognition issues these certifications and can suspend or revoke them. Confirmed falsified mentorship logs trigger a full re-audit — the certification is suspended, the pilot must re-submit legitimate verified logs, and the certification is re-issued only after a clean re-audit. Repeated professional misconduct — such as a pattern of ghosting operators after accepting consent engagements — results in a reliability flag on the profile visible to future operators. A single ghost is not a revocation event. Three or more confirmed incidents create a conduct record. Professional misconduct that rises to a regulatory level is referred to the relevant CAA. We are infrastructure, not a tribunal."
                },
                {
                    q: "What if a verified pilot misuses the badge off-platform to run scams?",
                    a: "The platform cannot monitor every verified member's conduct off-platform. What it can do is act on reports. Platform-level consequences for confirmed off-platform misuse of the verified badge are suspension and removal from the verified directory. Over time, a pilot running schemes outside the platform generates signals inside it too — complaints, operator reports, dispute filings. The professional reliability score aggregates those signals. A clean profile is earned continuously, not issued once and held forever."
                },
                {
                    q: "Can a pilot engage with multiple operators at the same time?",
                    a: "Yes. Pilots are sovereign over their career decisions. Submitting interest in multiple pathways simultaneously and engaging with multiple operators in parallel is permitted and expected. Airlines engage multiple candidates at the same time — pilots can engage multiple operators. No commitment exists until a contract is signed outside the platform. The pilot reads the offers, negotiates the terms, and chooses. That is how the market should work."
                },
                {
                    q: "Does PilotRecognition have a financial incentive to lower verification standards as it grows?",
                    a: "The flat fee model is the structural protection against this. We earn $99/year per verified pilot regardless of how fast or slow the verification completes. There is no per-verification revenue that creates pressure to rush approvals or accept weaker providers. Verification provider acceptance criteria are published and evaluated against CAA compliance, jurisdictional coverage, professional indemnity, and turnaround standards. Operator access is manual-review only — operators contact us, we review, we approve. That friction is intentional. The platform earns nothing extra by letting in an operator who doesn't meet the standard. Standards are the product."
                }
            ]
        },
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.flatMap(group =>
            group.questions.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a.replace(/<[^>]+>/g, '')
                }
            }))
        )
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(faqSchema) }}
            />

            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Hero */}
            <div className="pt-32 pb-16 px-6 border-b border-slate-100">
                <div className="max-w-3xl mx-auto">
                    <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-red-600 mb-4">
                        Straight Answers
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        How it works. What it costs. What you actually get. No fluff.
                    </p>
                </div>
            </div>

            {/* FAQ sections */}
            <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">
                {faqs.map((group, groupIdx) => (
                    <div key={groupIdx}>
                        <div className="mb-8">
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-[0.35em] mb-1">
                                {group.category}
                            </p>
                            <h2 className="text-2xl font-bold text-slate-900">
                                {group.label}
                            </h2>
                        </div>
                        <div className="space-y-1">
                            {group.questions.map((faq, idx) => {
                                const key = `${groupIdx}-${idx}`;
                                const isOpen = openItem === key;
                                return (
                                    <div key={idx} className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? 'border-slate-300 bg-white' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                                        <button
                                            onClick={() => toggle(key)}
                                            className="w-full text-left px-6 py-4 flex items-start justify-between gap-4"
                                        >
                                            <span className="font-semibold text-slate-900 text-sm leading-snug">{faq.q}</span>
                                            <span className={`flex-shrink-0 mt-0.5 text-slate-400 text-lg leading-none transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                                        </button>
                                        {isOpen && (
                                            <div
                                                className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 space-y-2"
                                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.a) }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA strip */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-16 text-center">
                <p className="text-slate-500 text-sm mb-2 uppercase tracking-widest font-semibold text-[10px]">Still have questions?</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Talk to us directly.</h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => onNavigate('become-member')}
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors"
                    >
                        Create your profile
                    </button>
                    <button
                        onClick={onBack}
                        className="border border-slate-200 text-slate-700 px-8 py-3 rounded-xl font-semibold text-sm hover:border-slate-400 transition-colors flex items-center gap-2 justify-center"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </button>
                </div>
            </div>

            <div className="flex justify-center py-8">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-slate-300" />
                </div>
            </div>
        </div>
    );
};
