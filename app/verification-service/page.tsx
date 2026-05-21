'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// No icons — Swiss government white paper style

type NavItem = { id: string; label: string; href?: string };

// ─── Nav structure ───────────────────────────────────────────────
const NAV_GROUPS = [
    {
        label: 'Solutions',
        items: [
            { id: 'airlines', label: 'Airlines & Operators', href: '/enterprise-access/airlines' },
            { id: 'flightschools', label: 'Flight Schools & ATOs', href: '/enterprise-access' },
            { id: 'privatejet', label: 'Private Jet & Charter', href: '/enterprise-access' },
            { id: 'evtol', label: 'Air Taxi & eVTOL', href: '/enterprise-access' },
            { id: 'military', label: 'Military & Defence', href: '/enterprise-access' },
            { id: 'manufacturers', label: 'Manufacturers & OEMs', href: '/enterprise-access' },
        ],
    },
    {
        label: 'Services',
        items: [
            { id: 'verification', label: 'PIC Identity Credential Verification', href: '/verification-service' },
            { id: 'insurance', label: 'Insurance Providers', href: '/enterprise-access' },
            { id: 'finance', label: 'Banks & Pilot Finance', href: '/enterprise-access' },
            { id: 'jobboards', label: 'Job Boards & Staffing', href: '/enterprise-access' },
            { id: 'integrations', label: 'Software & API', href: '/enterprise-access' },
        ],
    },
    {
        label: 'Pricing',
        items: [
            { id: 'pricing', label: 'Enterprise Pricing', href: '/enterprise-access/pricing' },
            { id: 'partners', label: 'Partnership Tiers', href: '/enterprise-access' },
        ],
    },
    {
        label: 'About',
        items: [
            { id: 'why', label: 'Why PilotRecognition', href: '/enterprise-access' },
            { id: 'metric', label: 'The 90-Day Metric', href: '/enterprise-access' },
            { id: 'contact', label: 'Request Access', href: '/enterprise-access' },
        ],
    },
];

// ─── Types ─────────────────────────────────────────────────────────
type Step = {
    number: number;
    title: React.ReactNode;
    description: string;
};

type Party = {
    role: string;
    label: string;
    description: string;
};

// ─── Data ──────────────────────────────────────────────────────────
const PARTIES: Party[] = [
    {
        role: 'Pilot',
        label: 'Owns profile & documents',
        description:
            'Gives consent through PilotRecognition. Controls who sees what. Provides claimed data for verification.',
    },
    {
        role: 'ATO / Flight School',
        label: 'Attests to training hours',
        description:
            'Reviews claimed logbook data against their own records. Issues registry confirmation. Responsible for accuracy of attestations.',
    },
    {
        role: 'Airline / Operator',
        label: 'Browses verified profiles',
        description:
            'Pays to access and hire pilots with verified identity credentials and attested hours.',
    },
    {
        role: 'PilotRecognition',
        label: 'The transmedium',
        description:
            'Holds no data. Verifies nothing. Routes consent and facilitates connections between the other parties.',
    },
    {
        role: 'Regional Verification Provider',
        label: 'The actual verifying party',
        description:
            'Runs the Professional Qualification Check — side-by-side comparison of claimed credentials against the governing civil aviation authority registry.',
    },
    {
        role: 'Governing Civil Aviation Authority',
        label: 'The source of truth',
        description:
            'Issues and maintains pilot licenses and medical certificates. The verification provider checks directly against their database.',
    },
    {
        role: 'Logbook Provider',
        label: 'Holds flight hour records',
        description:
            'Receives tokenized receipt from ATO. Testifies that logbook holds verified value. Grants read-only display permission. Retains write access and liability.',
    },
    {
        role: 'Data Vault Provider',
        label: 'Secure document storage',
        description:
            'Encrypts and stores sensitive documents. Pilot controls access. Can be the same entity as the regional verification provider (e.g. Veremark).',
    },
];

const STEPS: Step[] = [
    {
        number: 1,
        title: <>Pilot <span className="text-red-600">Onboarding</span></>,
        description:
            "Before creating a profile, the pilot must accept the Terms of Service and Privacy Agreement — a person-to-person contract with Karl Brian Vogt and Andrew Bowler, the individual developers operating pilotrecognition.com. The agreement contains the explicit consent clause: 'By creating an account, you provide your explicit, informed consent to Karl Brian Vogt and Andrew Bowler, operating as the developers of pilotrecognition.com. You authorize us to store your anonymous user identifier and your estimated flight hours (user-declared metadata) in our Supabase database strictly for the purpose of displaying your pilot profile. Authentication Proxy: Login and account security are independently managed by Auth0 by Okta, a third-party authentication proxy service. When you enter your email and password, that data is sent directly to Auth0's secure servers — it never touches our own servers or database. Auth0 validates your credentials and returns a cryptographically secure token (JSON Web Token) to our application. Our Supabase database stores only an anonymous User ID token (e.g., auth0|12345...), not your email or password. We do not have the ability to view, access, or store your login credentials. You retain the right to withdraw this consent and request the permanent deletion of your data at any time by closing your account or contacting us directly. Data Limitation and Non-Verification Disclaimer: pilotrecognition.com displays only user-declared aviation metadata, such as estimated flight hours and general license ratings, based entirely on explicit user input. This platform does not collect, store, or verify official government-issued license numbers, logs, or legal credentials. Legal authentication of certifications remains strictly between the user, the relevant aviation Data Issuer, and authorized verification providers. Third-Party Verification Disclaimer: pilotrecognition.com does not collect or store official government license documents or sensitive identification numbers on its own servers. Professional credential verification is securely offloaded to Veremark, an independent, third-party screening provider. By initiating a verification check, you consent to sharing your basic contact information with Veremark to process your credentials. Your verified achievements will be managed via your independent Verepass wallet.' The timestamp of acceptance is recorded as legal proof of consent. The pilot then authenticates by clicking 'Connect Verepass Wallet' on pilotrecognition.com. They are redirected to Veremark's official portal where they authenticate securely using their email-based magic link system. Veremark returns a cryptographically secure token with an anonymous Wallet ID to our site, confirming the user is valid. Our Supabase database stores only the anonymous Wallet ID and the pilot's declared flight hours — no email, no password, no sensitive credentials. The pilot then creates a profile and enters their claimed details as text — license numbers, medical certificate numbers, training records, ratings. On the free tier, pilots enter this information manually as text only. Uploading document images or scans of pilot licenses, medical certificates, and training records is a Recognition+ feature. All data at this stage is self-claimed. Nothing has been verified. Whatever is displayed on a free user's profile is a claim, not a verified credential. The pilot controls who sees what through consent. PilotRecognition never sees or stores these documents. The pilot may also sign in with their existing logbook provider account to import flight hours automatically — this option is available on the free tier as well. The hours displayed are claimed hours until the verification workflow is completed through Recognition+.",
    },
    {
        number: 2,
        title: <>Pilot <span className="text-red-600">Discovers</span> the Platform</>,
        description:
            "The pilot browses public pathway cards and sees what airlines, cargo operators, and charter companies actually require — including manufacturer expectations from Airbus, Boeing, and other OEMs on aircraft-specific competencies and type ratings. They discover recommended type rating centers connected to their target pathways. They compare their current credentials against these requirements and see exactly where they stand — and what gaps remain. The pilot sees a platform connected like never before: airlines, flight schools, manufacturers, and verification providers all linked on one system. The pilot discovers that employers see both verified and non-verified profiles — but operators and Pathway Posters prefer pilots who have been background checked through a Professional Qualification Check and whose hours have been validated between their ATO and operator. Currently, if an operator asks a pilot to verify their hours, this is a manual task. The pilot must contact their flight school, wait for a response, and provide paper documentation. On PilotRecognition, this validation happens automatically once the ATO attests to the hours and tokenizes the logbook data. Verified pilots rank higher in search results and are contacted first.",
    },
    {
        number: 3,
        title: <><span className="text-red-600">Recognition+</span> Subscription Unlocks</>,
        description:
            "The pilot subscribes to Recognition+ for $100 per year. This unlocks the PIC Identity Credential Verification workflow, unlimited pathway views, full profile comparison, and priority matching with operators and Pathway Posters. Recognition+ also grants access to exclusive pathways — private jet, charter, corporate aviation, VIP transport, helicopter, seaplane, and agricultural aviation — reserved for pilots with serious career profiles. These premium pathways are not visible on the free tier. Without Recognition+, the pilot can browse public pathways and see requirements — but cannot initiate verification, cannot access premium pathways, cannot compare their full profile against pathways, and will not surface in filtered searches by verified employers. Recognition+ is the key that turns a basic profile into a verified, discoverable identity credential.",
    },
    {
        number: 4,
        title: <><span className="text-red-600">Get Started</span> — Initiate Verification Now or Later</>,
        description:
            "After subscribing to Recognition+, the pilot is redirected to the Recognition+ Get Started page. This page prompts the pilot with a clear choice: initiate verification of their credentials immediately, or defer to a later time. If they choose to initiate now, they are taken directly to the PIC Identity Credential Verification section of their dashboard. If they choose later, the verification workflow remains on standby — they have paid, they have clearance, and the option is always available when they are ready. Nothing happens until the pilot actively chooses to begin.",
    },
    {
        number: 5,
        title: <><span className="text-red-600">Initiation</span> of PIC Identity Credential Verification Workflow</>,
        description:
            "On the pilot's dashboard, their profile displays current flight hours and license credentials with two clear options: Verify Now — to get recognition for their professional qualifications such as licenses, medical certificate, and ratings — and Validate Now — to verify their flight hours displayed from their logbook. The pilot is prompted to sync their logbook data either to an existing connected logbook provider or to the default vault provider, which is an automatic option included with the Recognition+ subscription. If they choose an existing logbook provider, they connect through API integration and hours sync into their profile as a read-only feed, not a data write. Once the sync is successful, both the pilot's dashboard and the logbook provider's app show a green light confirming the data read is active. The logbook provider's app also displays a message stating: Your account is in sync with your PilotRecognition account and you may start the validation process. The pilot presses the Verify My Hours button, which opens a form. The form states that the information provided is true and accurate, and the pilot must press Agree to proceed. The pilot must also state all operators they have flown with within the year. If there is more than one operator, additional surcharges apply for verification — each extra operator beyond the first requires a separate verification request and fee.",
    },
    {
        number: 6,
        title: <>Pilot Gives <span className="text-red-600">Consent</span> and Provides Claimed Data</>,
        description:
            "The pilot gives consent through PilotRecognition for their ATO or operator to verify their identity credentials. The pilot provides their claimed source of data — license number, medical certificate number, issuing authority, and all required documents — so the regional verification provider can run a Professional Qualification Check against the governing civil aviation authority's registry. The pilot also provides claimed logbook data — hours flown, routes, recency. They control exactly what gets shared and with whom. PilotRecognition records the consent and displays the data on the platform — but we do not verify it, store it permanently, or own it. The data vault provider holds the documents and the logbook provider holds the flight hours.",
    },
    {
        number: 7,
        title: <>ATO or Operator <span className="text-red-600">Requests</span> to Verify Pilot Identity</>,
        description:
            "The ATO or operator — the airline, cargo company, charter firm, or flight school that wants to verify the pilot — initiates a request through PilotRecognition to verify the pilot's identity credentials. This request is routed to the pilot, who receives a notification that an operator wants to verify their license, medical certificate, and training records. The pilot can approve or deny this request. Until the pilot gives consent, no data moves. The operator pays for this verification service as part of their Operator Access subscription.",
    },
    {
        number: 8,
        title: <>PilotRecognition <span className="text-red-600">Routes</span> Consent and Data</>,
        description:
            "PilotRecognition routes the pilot's consent and claimed data to the ATO or operator. This is all we do — we are the transmedium. We do not verify anything. We do not hold any documents. We simply connect the parties.",
    },
    {
        number: 9,
        title: 'Regional Verification Provider Runs Professional Qualification Check',
        description:
            "The ATO or operator engages a regional verification provider to run the Professional Qualification Check. The provider takes the pilot's claimed license, medical certificate, and ratings and checks them directly against the governing civil aviation authority's registry — the database that originally issued them. This is a side-by-side comparison of the pilot's submitted data against the authority's official records to detect any mismatch, expiry, suspension, or restriction. No data passes through PilotRecognition during this check. The provider reports results back to the ATO or operator.",
    },
    {
        number: 10,
        title: 'ATO or Operator Receives Request and Documents',
        description:
            "The ATO or operator receives the consent request and the pilot's claimed data and documents. If they need to see original documents, they request access through PilotRecognition. The pilot approves or denies each request individually. The data vault provider shares only what was authorized.",
    },
    {
        number: 11,
        title: 'ATO or Operator Issues Registry Confirmation and Valid Review of Hours',
        description:
            "The source ATO or operator that trained or employed the pilot reviews the claimed logbook data — hours flown, routes, recency — against their own training or employment records. They issue a registry confirmation and provide clear feedback to the pilot about their logged hours, clearing any communication gaps between them. If a discrepancy is found, the ATO notes the flagged claimed hours and the pilot is given the opportunity to clarify or correct directly with the ATO. If the pilot requests verification through a second or third ATO or operator, additional fees apply for each additional source check.",
    },
    {
        number: 12,
        title: 'Yearly Verification Re-Check',
        description:
            "The regional verification provider re-runs the Professional Qualification Check once per year against the governing civil aviation authority's registry to confirm the pilot's credentials remain valid. This catches expiry, suspension, or renewal. The yearly re-check is included for active subscribers. The provider reports any status changes back to the ATO or operator, who updates the pilot's profile.",
    },
    {
        number: 13,
        title: 'ATO Attests to Training Hours and Tokenizes Logbook Information',
        description:
            "The pilot's flight school attests to their training hours, aircraft ratings, and graduation dates. The ATO then tokenizes this verified information — creating a digital receipt of the registry confirmation and valid review — and sends this receipt to the pilot's connected logbook provider. This tokenization confirms that the logbook hours have been reviewed and validated by the source ATO, not self-proclaimed by the pilot.",
    },
    {
        number: 14,
        title: 'Logbook Provider Receives Receipt and Testifies to Verified Value',
        description:
            "The logbook provider receives the tokenized receipt from the ATO and can now testify that their logbook holds actual verified value — the hours have been confirmed by the training organization or employer, not merely claimed by the pilot. In exchange for this verified status, the logbook provider grants PilotRecognition permission to display the pilot's hours on their dashboard in read-only mode. The logbook provider retains all write access and full liability for the accuracy of the hours under their own data privacy and GDPR obligations. PilotRecognition only displays what the logbook provider authorizes and holds no liability for the accuracy of flight hours.",
    },
    {
        number: 15,
        title: 'Airline Sees a Complete Verified Profile',
        description:
            "The airline sees the pilot's identity profile with credentials verified by the regional provider against the civil aviation authority's database, hours attested by the flight school, and a verified logbook data feed displayed in read-only mode on the pilot's dashboard. Because the logbook provider has received the tokenized receipt from the ATO, the airline knows the hours are not self-proclaimed — they have been reviewed and confirmed by the source training organization or employer. The airline knows exactly who the pilot is, what they are licensed to fly, whether they are medically cleared, and that their hours carry verified value.",
    },
    {
        number: 16,
        title: 'Airline Pays to Contact or Hire',
        description:
            "The airline pays for Operator Access to contact the pilot. If they hire the pilot, they pay a 500 dollar success fee to PilotRecognition. The pilot gets the job. The flight school gets visibility. The regional provider got paid by the ATO or operator for the verification. PilotRecognition collected the subscription and success fee.",
    },
];

const FEES = [
    { who: 'Pilots — Recognition Plus', price: '$100/year', note: 'Required for PIC Identity Credential Verification. Includes full platform access, unlimited pathway views, priority matching.' },
    { who: 'Pilots — Foundation Program', price: '$49', note: 'One-time' },
    { who: 'Pilots — Transition Program', price: '$299', note: '$149 for Foundation graduates' },
    { who: 'Pilots — Additional ATO Check', price: '$25', note: 'Per additional ATO/operator' },
    { who: 'Flight Schools — Operator Access', price: '$1,000/year', note: 'Full graduate tracking and verification' },
    { who: 'Airlines — Operator Access', price: '$1,000/year', note: 'Pull API and unlimited profile access' },
    { who: 'Airlines — Success Fee', price: '$500', note: 'Per pilot hired through the platform' },
];

// ─── Component ─────────────────────────────────────────────────────
export default function VerificationServicePage() {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [mobileNav, setMobileNav] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900">

            {/* ─── STICKY NAV ─── */}
            <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <a href="https://pilotrecognition.com" className="flex items-center gap-3 group">
                            <span className="text-xl font-bold tracking-tight">
                                <span className="text-slate-900">Pilot</span><span className="text-red-600">Recognition</span>
                            </span>
                            <span className="text-sm font-semibold text-slate-900 tracking-wide">Enterprise</span>
                        </a>

                        {/* Desktop dropdowns */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {NAV_GROUPS.map(group => (
                                <div
                                    key={group.label}
                                    className="relative"
                                    onMouseEnter={() => setOpenMenu(group.label)}
                                    onMouseLeave={() => setOpenMenu(null)}
                                >
                                    <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">
                                        {group.label}
                                        <svg className={`w-3 h-3 transition-transform ${openMenu === group.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {openMenu === group.label && (
                                        <div className="absolute top-full left-0 pt-2 min-w-[260px]">
                                            <div className="bg-white border border-slate-200 rounded-xl shadow-2xl py-2">
                                                {group.items.map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => { setOpenMenu(null); navigate(item.href!); }}
                                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors block ${
                                                            item.id === 'verification'
                                                                ? 'bg-red-50 text-red-700 font-medium border-l-2 border-red-600'
                                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* CTA */}
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/enterprise-access')} className="hidden sm:inline-flex bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                                Request Access →
                            </button>
                            <button onClick={() => setMobileNav(v => !v)} className="lg:hidden text-slate-900 p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileNav ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile nav */}
                    {mobileNav && (
                        <div className="lg:hidden border-t border-slate-200 py-4 max-h-[80vh] overflow-y-auto bg-white pb-6">
                            {NAV_GROUPS.map(group => (
                                <div key={group.label} className="mb-3">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 mb-1.5">{group.label}</p>
                                    {group.items.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => { setMobileNav(false); navigate(item.href!); }}
                                            className={`w-full text-left px-2 py-2 text-sm block transition-colors ${
                                                item.id === 'verification'
                                                    ? 'text-red-700 font-medium bg-red-50 rounded'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            ))}
                            <div className="mt-4 px-2">
                                <button onClick={() => { setMobileNav(false); navigate('/enterprise-access'); }} className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors">Request Access →</button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* ─── Hero ─────────────────────────────────────────── */}
            <section className="relative overflow-hidden px-6 py-20 lg:py-32">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white" />
                <div className="relative mx-auto max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-600 mb-6">
                            PIC Identity Credential Verification
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Pilot{' '}
                            <span className="text-red-600">in-Command</span>{' '}
                            <br className="hidden sm:block" />
                            Identity Credentials
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
                            We are the transmedium for PIC (Pilot in Command) identity credential verification. We connect
                            eight parties on a single platform to verify who a pilot is, what they are
                            licensed to fly, and whether they are medically and legally cleared to operate.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <div className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-4 py-2 text-slate-700 text-sm">
                                We hold no data
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-4 py-2 text-slate-700 text-sm">
                                We verify nothing
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-4 py-2 text-slate-700 text-sm">
                                We route consent only
                            </div>
                        </div>
                        <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                            <span className="text-red-600">Recognition+</span> Exclusive — $100/year
                        </div>
                        <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto">
                            PIC Identity Credential Verification is available exclusively to <span className="text-red-600">Recognition+</span> members.
                            Upgrade your profile to unlock full verification, unlimited pathway views, and priority matching with airlines.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ─── The Current State ──────────────────────────── */}
            <section className="px-6 py-16 border-t border-slate-200">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Current State</p>
                        <h2 className="mt-2 text-3xl font-bold">The Industry Has a Verification Gap</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            'Pilot flight hours are self-reported. There is no standardized mechanism for ATOs to confirm the hours their graduates actually logged.',
                            'Airlines reviewing pilot credentials must manually contact civil aviation authorities or rely on photocopied documents that may be outdated or falsified.',
                            'A pilot licensed in one jurisdiction has no portable, verifiable credential record recognized across borders. Each employer must verify independently.',
                            'Logbook data sits in proprietary apps with no connection to the training organizations that issued the original certificates.',
                            'There is no single source of truth for pilot identity, license status, and medical validity that all parties can reference in real time.',
                        ].map((point, i) => (
                            <div key={i} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
                                    {i + 1}
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── The Eight Parties ────────────────────────────── */}
            <section className="px-6 py-16 border-t border-slate-200/50 bg-slate-50">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold">
                            The <span className="text-red-600">Eight</span> Parties
                        </h2>
                        <p className="mt-3 text-slate-600">
                            Every verification involves these eight parties. PilotRecognition is the transmedium connecting them all.
                        </p>
                    </div>
                    <div className="space-y-8">
                        {/* Row 1: 1-4 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {PARTIES.slice(0, 4).map((party, i) => (
                                <div key={party.role} className="relative">
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="rounded-xl border border-slate-200 bg-white p-5 h-full"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900">{party.role}</h3>
                                                <p className="text-xs font-medium text-red-600">{party.label}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{party.description}</p>
                                    </motion.div>
                                    {/* Arrow to next — hidden on last and on mobile */}
                                    {i < 3 && (
                                        <div className="hidden lg:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Row 2: 5-8 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {PARTIES.slice(4, 8).map((party, i) => (
                                <div key={party.role} className="relative">
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: (i + 4) * 0.05 }}
                                        className="rounded-xl border border-slate-200 bg-white p-5 h-full"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">
                                                {i + 5}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900">{party.role}</h3>
                                                <p className="text-xs font-medium text-red-600">{party.label}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{party.description}</p>
                                    </motion.div>
                                    {/* Arrow to next — hidden on last and on mobile */}
                                    {i < 3 && (
                                        <div className="hidden lg:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── How It Works ─────────────────────────────────── */}
            <section className="px-6 py-16 border-t border-slate-200/50">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold">How It <span className="text-red-600">Works</span></h2>
                        <p className="mt-3 text-slate-600">
                            Sixteen steps from pilot onboarding to verified hire. At every step, PilotRecognition is the transmedium only.
                        </p>
                    </div>
                    <div className="space-y-8">
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.03 }}
                                className="flex gap-5"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm">
                                        {step.number}
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className="mt-2 h-full w-px bg-slate-300" />
                                    )}
                                </div>
                                <div className="pb-8">
                                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Recognition+ Membership ──────────────────────── */}
            <section className="px-6 py-16 border-t border-slate-200/50 bg-white">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold">
                            <span className="text-red-600">Recognition+</span> Membership
                        </h2>
                        <p className="mt-3 text-slate-600">
                            PIC Identity Credential Verification is a <span className="text-red-600">Recognition+</span> exclusive service.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                title: 'Full Profile Comparison',
                                text: 'Compare your verified identity credentials against any pathway card. See exactly which requirements you meet and which gaps remain.',
                            },
                            {
                                title: 'Exclusive Premium Pathways',
                                text: 'Access pathways hidden from free-tier users — private jet, charter, corporate aviation, VIP transport, helicopter, seaplane, agricultural aviation. Reserved for pilots with serious career profiles who are committed to their professional development.',
                            },
                            {
                                title: 'Priority Matching',
                                text: 'Your verified profile surfaces first when airlines run filtered searches. Verified pilots are ranked above unverified profiles.',
                            },
                            {
                                title: 'Complete Gap Analysis',
                                text: 'Get a detailed breakdown of exactly what you need to qualify for your target role — hours, ratings, medical currency, language level.',
                            },
                            {
                                title: 'Yearly Re-Check Included',
                                text: 'The regional verification provider re-runs the Professional Qualification Check annually to confirm your credentials remain valid. Catches expiry, suspension, or renewal.',
                            },
                            {
                                title: 'Live Real-Time Profile',
                                text: 'Your profile updates as you log hours, earn ratings, or renew your medical. Airlines see current data — not a static CV from six months ago.',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="rounded-xl border border-slate-200 bg-white p-5"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">
                                        {i + 1}
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-10 text-center">
                        <div className="inline-flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4">
                            <div className="text-left">
                                <p className="text-sm font-semibold text-red-700"><span className="text-red-600">Recognition+</span> — $100/year</p>
                                <p className="text-xs text-red-600">Required for PIC Identity Credential Verification</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto">
                            Pilots can join PilotRecognition for free with basic platform access. <span className="text-red-600">Recognition+</span> unlocks
                            the full verification workflow, unlimited pathway views, and priority airline matching.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── What We Are Not ──────────────────────────────── */}
            <section className="px-6 py-16 border-t border-slate-200/50 bg-slate-100">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold">Clarification of Roles</h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        {[
                            {
                                title: 'We are not a verifier',
                                text: 'The regional verification provider and the governing civil aviation authority perform all credential verification. We route consent only.',
                            },
                            {
                                title: 'We are not a data holder',
                                text: 'The data vault provider holds documents. The logbook provider holds flight hours. We display data on the platform but do not store it permanently.',
                            },
                            {
                                title: 'We are not a job board',
                                text: 'We are a recognition framework. Airlines browse verified profiles and contact pilots directly. We facilitate connections, not placements.',
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="rounded-xl border border-slate-200 bg-white p-6 text-left"
                            >
                                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Pricing ──────────────────────────────────────── */}
            <section className="px-6 py-16 border-t border-slate-200/50">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold">Pricing & Revenue Flow</h2>
                        <p className="mt-3 text-slate-600">
                            Transparent pricing for every party in the verification chain.
                        </p>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Who pays</th>
                                    <th className="px-6 py-3 font-medium">What</th>
                                    <th className="px-6 py-3 font-medium">Price</th>
                                    <th className="px-6 py-3 font-medium">Note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {FEES.map((fee) => (
                                    <tr key={fee.who} className="hover:bg-slate-100">
                                        <td className="px-6 py-4 font-medium text-slate-900">{fee.who}</td>
                                        <td className="px-6 py-4 text-slate-600">{fee.price}</td>
                                        <td className="px-6 py-4 text-slate-700 font-semibold">{fee.price}</td>
                                        <td className="px-6 py-4 text-slate-500">{fee.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-6 text-center text-sm text-slate-500">
                        The only money that flows out of PilotRecognition to a flight school is a small referral dividend
                        of approximately $20 when a graduate joins the platform and gets their Recognition Profile verified.
                    </p>
                </div>
            </section>

            {/* ─── CTA ──────────────────────────────────────────── */}
            <section className="px-6 py-20 border-t border-slate-200/50">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold">
                        Ready to verify your{' '}
                        <span className="text-red-600">Pilot-in-Command</span> credentials?
                    </h2>
                    <p className="mt-4 text-slate-600">
                        Join the platform that connects pilots, ATOs, and airlines with verified identity credentials —
                        not self-proclaimed hours.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-3 font-semibold text-white hover:bg-slate-700 transition-colors">
                            Get Verified
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── Footer disclaimer ────────────────────────────── */}
            <footer className="border-t border-slate-200/50 px-6 py-8">
                <div className="mx-auto max-w-4xl text-center text-xs text-slate-500">
                    <p>
                        <strong>At every step:</strong> PilotRecognition is the transmedium only. We hold no data. We verify nothing. We route consent and
                        facilitate connections between the eight other parties.
                    </p>
                </div>
            </footer>
        </div>
    );
}
