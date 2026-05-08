'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SUPABASE_URL = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzQxOTEsImV4cCI6MjA4OTExMDE5MX0.m49ula5RMn4uEtRTk6l9q_6VElyPrY1YPMj-gtUYRsY';
const FIREBASE_BASE = 'https://us-central1-pilotrecognition-airline.cloudfunctions.net';

// ─── Nav structure ───────────────────────────────────────────────
const NAV_GROUPS = [
    {
        label: 'Solutions',
        items: [
            { id: 'airlines', label: 'Airlines & Operators' },
            { id: 'flightschools', label: 'Flight Schools & ATOs' },
            { id: 'privatejet', label: 'Private Jet & Charter' },
            { id: 'evtol', label: 'Air Taxi & eVTOL' },
            { id: 'military', label: 'Military & Defence' },
            { id: 'manufacturers', label: 'Manufacturers & OEMs' },
        ],
    },
    {
        label: 'Services',
        items: [
            { id: 'insurance', label: 'Insurance Providers' },
            { id: 'finance', label: 'Banks & Pilot Finance' },
            { id: 'jobboards', label: 'Job Boards & Staffing' },
            { id: 'integrations', label: 'Software & API' },
        ],
    },
    {
        label: 'Pricing',
        items: [
            { id: 'pricing', label: 'Enterprise Pricing' },
            { id: 'partners', label: 'Partnership Tiers' },
        ],
    },
    {
        label: 'About',
        items: [
            { id: 'why', label: 'Why PilotRecognition' },
            { id: 'metric', label: 'The 90-Day Metric' },
            { id: 'contact', label: 'Request Access' },
        ],
    },
];

// ─── Sector data ─────────────────────────────────────────────────
type Sector = {
    id: string;
    icon: string;
    label: string;
    color: string;
    tagline: string;
    pain: string;
    solution: string;
    benefits: string[];
    pilots: string[];
    cta: string;
};

const SECTORS: Sector[] = [
    {
        id: 'airlines',
        icon: '✈️',
        label: 'Airlines & Operators',
        color: 'blue',
        tagline: 'Stop chasing CVs. Pull the pilots that fit.',
        pain: 'Recruitment teams sift through dead PDFs. By the time you call a pilot, their hours are 6 months out of date, their medical may have lapsed, and you have no way to verify recency, type rating currency, or background.',
        solution: 'PilotRecognition gives airline recruiters a live, scored, background-checked pilot database. Post a pathway card with your minimums (e.g. 1,500 hrs, A320 type, current Class 1). Pilots submit interest. You get a ranked, scored, real-time shortlist — filtered by Recognition Score, recency, type rating, and Veremark verification status.',
        benefits: [
            'Pull API — query the database by type rating, hours, recency, country, score',
            'Pathway Cards — post hiring requirements; pilots submit interest, you pull',
            'Live profiles — every pilot updates when they log hours, no stale data',
            'Veremark-verified pilots — background-checked, criminal-record screened',
            'Recognition Score — proprietary readiness score (recency × hours × type × EBT)',
            'EBT/CBTA video interview library — view pilot competency before screening',
            'Placement tracking — every hire through a pathway is recorded for outcome data',
            'No applicant pile — only ranked, qualified candidates surface',
        ],
        pilots: [
            'Get matched to airlines that actually fit their profile',
            'No CV black-hole — they know who pulled them and why',
            'Recognition Score becomes portable currency between airlines',
        ],
        cta: 'Pricing: $1,000/mo Enterprise + $500 success fee per pilot placed within 90 days.',
    },
    {
        id: 'flightschools',
        icon: '🏫',
        label: 'Flight Schools & ATOs',
        color: 'emerald',
        tagline: 'Turn your graduates into a tracked, monetisable pipeline.',
        pain: 'Flight schools train pilots, hand them a certificate, and lose them. There\'s no way to track which graduates actually got hired, no recurring relationship, and no revenue from the placement.',
        solution: 'Become a partner ATO. Your graduates get prioritised pathway access, you earn placement referral revenue, and you receive analytics on graduate outcomes — proving your school\'s ROI to prospective students.',
        benefits: [
            '$20 referral payout when one of your graduates signs up',
            'Pathway Cards listing — feature your ATO directly to pilot applicants',
            'Graduate outcome dashboard — track placement % at airlines',
            'Co-branded recognition badge for graduates ("Trained at [School]")',
            'Direct integration with school CRM / student records',
            'Scholarship program — feature your funded seats to a national audience',
            'Type rating provider listing for pilots seeking conversion training',
        ],
        pilots: [
            'Find ATOs aligned with their target airline\'s OEM (Airbus / Boeing)',
            'Compare type rating providers by cost, location, success rate',
            'Discover scholarships and funded pathways before paying out of pocket',
        ],
        cta: 'Free to join. $20/referral. Optional analytics tier $200/month.',
    },
    {
        id: 'insurance',
        icon: '🛡️',
        label: 'Insurance Providers',
        color: 'amber',
        tagline: 'Underwrite pilots with live data — not annual self-reports.',
        pain: 'Pilot insurance — life, disability, loss-of-licence, hull, third-party — depends on accurate, current data on hours flown, type rated aircraft, recency, and medical status. Today, insurers rely on annual self-reported declarations. The data is stale, sometimes inaccurate, and impossible to verify in real time.',
        solution: 'PilotRecognition can provide a live data feed (with pilot consent) of recency, type rating currency, medical certificate status, and incident history — letting insurers underwrite with current data and offer dynamic premiums based on real activity.',
        benefits: [
            'Live recency feed — confirm hours flown in last 30/90 days',
            'Medical certificate status — auto-alert when expiry approaches',
            'Type rating currency verification — confirmed against fleet data',
            'EBT / CBTA score data — behavioural risk indicator',
            'Veremark verification status — background screening confirmed',
            'Incident & violation history (where pilot consents to disclosure)',
            'API integration with underwriting engines',
            'Reduced fraud — real activity vs self-declared',
        ],
        pilots: [
            'Lower premiums for actively current pilots — rewarded for flying',
            'Automatic policy updates — no need to fax forms annually',
            'Loss-of-licence cover that actually reflects current risk profile',
        ],
        cta: 'Custom enterprise data licence. Inquire for pricing.',
    },
    {
        id: 'finance',
        icon: '🏦',
        label: 'Banks & Pilot Finance',
        color: 'green',
        tagline: 'Lend to pilots based on career trajectory — not just credit score.',
        pain: 'Pilots taking out loans for type ratings ($30K), aircraft purchase, or flight school ($100K+) are a black-box for underwriters. Credit score alone misses the picture: a 200-hour graduate with $50K debt looks risky, but a pilot with strong Recognition Score on track to a major airline is excellent collateral.',
        solution: 'Career-trajectory-aware pilot lending. PilotRecognition provides a verified employment-readiness score, hours trajectory, type rating progression, and pathway match probability — letting lenders price loans on actual aviation career risk rather than generic credit metrics.',
        benefits: [
            'Pilot Recognition Score — proprietary career-readiness indicator',
            'Hours trajectory — last 12 months progression',
            'Type rating progress — current ratings + ratings in progress',
            'Pathway match score — probability of placement at target airlines',
            'Employment verification — live link to current operator',
            'Loan-to-pathway product — type rating loans tied to specific airline pathways',
            'Default-risk reduction via career insight, not just FICO',
            'White-label "Pilot Career Loan" product for partner banks',
        ],
        pilots: [
            'Type rating loans pre-approved against specific airline pathways',
            'Lower interest rates if Recognition Score is high',
            'Aircraft & home loans without proving aviation income three times over',
        ],
        cta: 'Partner program. Custom data licence per lender.',
    },
    {
        id: 'privatejet',
        icon: '💼',
        label: 'Private Jet & Charter',
        color: 'violet',
        tagline: 'On-demand, verified, type-rated pilots — pulled in hours.',
        pain: 'Private charter and corporate flight departments need pilots fast — for repositioning, sick calls, surge demand. Today this means phoning agencies, sifting freelance CVs, and trusting a self-declared logbook. No live data, no verification, no scoring.',
        solution: 'Pull-on-demand for verified, current, type-rated, background-checked pilots. Filter by aircraft type (Gulfstream, Falcon, Citation, Global, Challenger, Legacy), location, availability, recency. Pull a Veremark-verified pilot in hours, not weeks.',
        benefits: [
            'On-demand pilot pull by type rating + location + availability',
            'Veremark-verified — background, criminal record, identity confirmed',
            'Live recency — confirm pilot has flown that type in last 30 days',
            'Per-trip or per-month pull billing — pay for what you use',
            'Concierge tier — managed pull with our recruitment team',
            'Owner-operator listing — list captains for fractional / charter use',
            'Insurance integration — verified pilot data flows to your insurer',
            'EASA / FAA / GCAA jurisdiction filtering',
        ],
        pilots: [
            'High-paying ad-hoc work without going through agencies that take 30%',
            'Direct relationship with operators who pull them',
            'Listed once, pulled many times — passive opportunity flow',
        ],
        cta: 'Per-pull pricing or $750/mo Charter Pro plan. Inquire for fleet rates.',
    },
    {
        id: 'military',
        icon: '🎖️',
        label: 'Military & Defence Transition',
        color: 'rose',
        tagline: 'Bridge military aviators into civilian flight decks.',
        pain: 'Military pilots leaving service have thousands of hours, advanced training, and zero civilian recognition. Their logbooks don\'t map to civilian metrics, their type ratings don\'t exist on civilian aircraft, and airlines don\'t know how to score them.',
        solution: 'Military-to-Civilian (Mil2Civ) Recognition Mapping. We translate military hours, qualifications, and competencies into civilian-equivalent Recognition Scores, surface tailored transition pathways, and partner with Mil2Civ programs run by airlines and ATOs.',
        benefits: [
            'Mil2Civ Recognition Mapping — military hours → civilian equivalent',
            'Tailored transition pathways from each major air force / branch',
            'Partner ATOs offering accelerated civilian type rating conversions',
            'Government / VA funding pathway integration (US, UK, AU, CA)',
            'Airline Mil2Civ pipelines — direct fast-track placements',
            'Defence contractor partnerships — test pilot, instructor, simulator pathways',
            'Cohort tracking — class of [year] outcome dashboards',
        ],
        pilots: [
            'Civilian-recognised score from day one of separation',
            'Funded transition pathways with airlines, not generic CV submission',
            'Veteran-only support, mentorship, and peer network',
        ],
        cta: 'Free for veterans. Partner programs for ATOs, airlines, and defence contractors.',
    },
    {
        id: 'evtol',
        icon: '🚁',
        label: 'Air Taxi & eVTOL',
        color: 'cyan',
        tagline: 'Build the talent pipeline before your fleet lifts off.',
        pain: 'eVTOL and advanced air mobility (AAM) operators are 12–24 months from commercial ops. Pilots ask: "How do I get qualified for Joby / Archer / Lilium / Vertical?" There\'s no public pathway, no data, no pipeline. Operators are building aircraft but have no surfaced pilot pool.',
        solution: 'Pre-Launch Pathway Cards for eVTOL operators. Surface your aircraft, training requirements, location, hiring timeline. Build a waitlist of pre-qualified pilots ready to convert when type certification lands. We tag interested pilots, score readiness, and hand you a pre-warmed pipeline.',
        benefits: [
            'Pre-Launch Pathway Cards — list pre-commercial hiring intent',
            'Pilot interest waitlist — scored, ranked, type-rating-ready',
            'OEM-aligned pathway co-branding (Joby, Archer, Lilium, Volocopter, Vertical, Beta)',
            'Conversion training partnerships with rotorcraft & STC schools',
            'Helicopter-to-eVTOL bridge programmes',
            'Public showcase — pilots learn what eVTOL means for their career',
            'Investor-ready pilot pipeline metrics for funding rounds',
        ],
        pilots: [
            'Find emerging operators before they hit mainstream job boards',
            'Get on a tracked waitlist — first in line when hiring opens',
            'Discover transition pathways from FW / RW into eVTOL',
        ],
        cta: 'Free pre-launch listing. $1,500/mo when commercial hiring begins.',
    },
    {
        id: 'jobboards',
        icon: '📋',
        label: 'Job Boards & Staffing Agencies',
        color: 'orange',
        tagline: 'Co-list pathways. Redirect pilots. Both sides win.',
        pain: 'Aviation job boards (CV-Library, Climbto350, FlightDeckRecruitment, etc.) and staffing agencies have pilot traffic but lack the structured pathway, scoring, and live profile data. Pilots churn through listings without context.',
        solution: 'Partner integration. Co-list our Pathway Cards on your board. Redirect pilots to PilotRecognition for profile creation and recognition scoring — they come back to your board with a real profile, and you get a referral fee per qualified placement.',
        benefits: [
            'Co-listed Pathway Cards via API or embed widget',
            'Redirect partner — pilots create scored profile, return to your board',
            'Per-placement referral revenue (15% of success fee)',
            'White-label embedded recognition score badge on listings',
            'Pilot data feed (with consent) for your matching engine',
            'Cross-listing of premium pathways for your niche',
            'Joint marketing — featured partner placement',
        ],
        pilots: [
            'See structured pathway data alongside traditional listings',
            'Build one profile, apply across many partner boards',
            'Get scored once — recognised everywhere',
        ],
        cta: 'Revenue share partnership. No fixed cost. Inquire for terms.',
    },
    {
        id: 'manufacturers',
        icon: '🔧',
        label: 'Manufacturers & OEMs',
        color: 'sky',
        tagline: 'Align pilot training data with the aircraft you build.',
        pain: 'Aircraft manufacturers (Airbus, Boeing, Embraer, ATR, Bombardier, Pilatus, Cessna, Piper, Gulfstream, Dassault, Cirrus, Daher, etc.) want training programs aligned with their fleet — but pilot recognition, EBT/CBTA scoring, and type rating data sits siloed at airlines and ATOs.',
        solution: 'OEM-Aligned Recognition. Partner to certify our recognition framework against your aircraft\'s competencies. Fleet pilots get OEM-co-branded recognition; you get global pilot training data tied to your aircraft type.',
        benefits: [
            'OEM-co-branded Recognition Score (e.g. "Airbus-Aligned Recognition")',
            'Fleet pilot competency data for product development',
            'Type rating training partner network listing',
            'EBT/CBTA scoring aligned to OEM-defined competencies',
            'Pilot expectations content co-published with your product team',
            'Simulator training partner integration',
            'New aircraft launch — pre-qualified pilot pipeline',
            'Service bulletins / fleet alerts pushed to relevant pilots',
        ],
        pilots: [
            'Get OEM-recognised credentials alongside airline employment',
            'Know exactly what each manufacturer expects from a pilot on their type',
            'Direct line to the people who built the aircraft they fly',
        ],
        cta: 'Strategic OEM partnership. Custom integration scope.',
    },
    {
        id: 'integrations',
        icon: '🔌',
        label: 'Software & API Integrations',
        color: 'fuchsia',
        tagline: 'Plug PilotRecognition into your stack.',
        pain: 'Aviation tech is fragmented: Veremark for screening, Crew Lounge for logbook, AeroCRS for ops, Sabre / Amadeus for crewing, Vistair for documents. Pilot data sits in silos and never speaks across systems.',
        solution: 'Open API + verified integration partners. Plug PilotRecognition into your existing tools. Veremark for background screening, logbook software for hours sync, ATS for crewing, LMS for training delivery — pilot data flows once, recognised everywhere.',
        benefits: [
            'Veremark — background-screening integration (live)',
            'Logbook integrations — Crew Lounge, Logten Pro, MCC Pilot Log, ForeFlight',
            'ATS / HRIS integrations — Workday, BambooHR, Greenhouse',
            'LMS integrations — for training delivery and CBTA scoring',
            'Crewing systems — Sabre Crew Manager, AIMS, Raido Crewing',
            'Document management — Vistair, Comply365',
            'Webhooks — real-time pilot profile, score, and pathway updates',
            'Public REST API + GraphQL — full pilot recognition data layer',
            'OAuth 2.0 — pilots grant scoped data access to partner apps',
        ],
        pilots: [
            'One profile, recognised across every aviation tool they use',
            'Logbook syncs automatically — hours feed into Recognition Score',
            'Background check happens once and travels with them',
        ],
        cta: 'Free developer API tier. Enterprise integration $2,000/mo + setup.',
    },
];

// Static color map (Tailwind cannot resolve dynamic classnames)
const COLOR_CLASSES: Record<string, { eyebrow: string; check: string; btn: string }> = {
    blue: { eyebrow: 'text-blue-400', check: 'text-blue-400', btn: 'bg-blue-600 hover:bg-blue-500' },
    emerald: { eyebrow: 'text-emerald-400', check: 'text-emerald-400', btn: 'bg-emerald-600 hover:bg-emerald-500' },
    amber: { eyebrow: 'text-amber-400', check: 'text-amber-400', btn: 'bg-amber-600 hover:bg-amber-500' },
    green: { eyebrow: 'text-green-400', check: 'text-green-400', btn: 'bg-green-600 hover:bg-green-500' },
    violet: { eyebrow: 'text-violet-400', check: 'text-violet-400', btn: 'bg-violet-600 hover:bg-violet-500' },
    rose: { eyebrow: 'text-rose-400', check: 'text-rose-400', btn: 'bg-rose-600 hover:bg-rose-500' },
    cyan: { eyebrow: 'text-cyan-400', check: 'text-cyan-400', btn: 'bg-cyan-600 hover:bg-cyan-500' },
    orange: { eyebrow: 'text-orange-400', check: 'text-orange-400', btn: 'bg-orange-600 hover:bg-orange-500' },
    sky: { eyebrow: 'text-sky-400', check: 'text-sky-400', btn: 'bg-sky-600 hover:bg-sky-500' },
    fuchsia: { eyebrow: 'text-fuchsia-400', check: 'text-fuchsia-400', btn: 'bg-fuchsia-600 hover:bg-fuchsia-500' },
};
const TIER_CHECK: Record<string, string> = {
    sky: 'text-sky-400',
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
};

// ─── Component ───────────────────────────────────────────────────
const EnterpriseAccessPage = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [mobileNav, setMobileNav] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', company: '', role: '', businessType: '',
        sector: '', country: '', companySize: '', website: '',
        partnershipInterest: '', timeline: '', budgetRange: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id: string) => {
        setOpenMenu(null);
        setMobileNav(false);
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/enterprise_access_requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON,
                    'Authorization': `Bearer ${SUPABASE_ANON}`,
                    'Prefer': 'return=minimal',
                },
                body: JSON.stringify({
                    full_name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company_name: formData.company,
                    role: formData.role,
                    website: formData.website,
                    company_size: formData.companySize,
                    country: formData.country,
                    business_type: formData.businessType || formData.sector,
                    partnership_interest: formData.partnershipInterest,
                    timeline: formData.timeline,
                    message: formData.message,
                    status: 'pending',
                }),
            });

            await fetch(`${FIREBASE_BASE}/enterpriseAccess`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            }).catch(() => {});

            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Submit error:', err);
            alert('Could not send your request. Email enterprise@pilotrecognition.com directly.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-white/10 rounded-2xl p-10 max-w-lg w-full text-center">
                    <div className="w-16 h-16 bg-emerald-600/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Request Received</h2>
                    <p className="text-slate-400 mb-2">Thank you, <strong className="text-white">{formData.name}</strong>.</p>
                    <p className="text-slate-400 text-sm mb-6">Your enterprise inquiry for <strong className="text-white">{formData.company}</strong> has been received. The PilotRecognition partnership team will respond at <strong className="text-white">{formData.email}</strong> within 1–2 business days.</p>
                    <a href="https://pilotrecognition.com" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all">← pilotrecognition.com</a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* ─── STICKY NAV ─── */}
            <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-slate-950/95 backdrop-blur-md border-b border-white/10' : 'bg-slate-950/80 backdrop-blur-sm'}`}>
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <a href="https://pilotrecognition.com" className="flex items-center gap-2 group">
                            <span className="text-xl font-bold tracking-tight">
                                <span className="text-white">Pilot</span><span className="text-blue-400">Recognition</span>
                            </span>
                            <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-slate-500 border border-slate-700 px-1.5 py-0.5 rounded">Enterprise</span>
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
                                    <button className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                                        {group.label}
                                        <svg className={`w-3 h-3 transition-transform ${openMenu === group.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {openMenu === group.label && (
                                        <div className="absolute top-full left-0 pt-2 min-w-[260px]">
                                            <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-2">
                                                {group.items.map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => scrollTo(item.id)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
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
                            <button onClick={() => scrollTo('contact')} className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                                Request Access →
                            </button>
                            <button onClick={() => setMobileNav(v => !v)} className="lg:hidden text-white p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileNav ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile nav */}
                    {mobileNav && (
                        <div className="lg:hidden border-t border-white/10 py-4 max-h-[80vh] overflow-y-auto">
                            {NAV_GROUPS.map(group => (
                                <div key={group.label} className="mb-4">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 mb-1.5">{group.label}</p>
                                    {group.items.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollTo(item.id)}
                                            className="w-full text-left px-2 py-2 text-sm text-slate-300 hover:text-white"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* ─── HERO ─── */}
            <section id="home" className="relative overflow-hidden border-b border-white/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-violet-600/10 blur-3xl rounded-full pointer-events-none" />
                <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-blue-400 font-semibold mb-5">Enterprise · Aviation Industry Infrastructure</p>
                    <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
                        Connecting Pilots<br />
                        <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">to the Industry.</span>
                    </h1>
                    <p className="text-slate-300 text-xl max-w-3xl mb-10 leading-relaxed">
                        Live pilot profiles. Veremark-verified. Type-rating filtered. Recognition-scored. The infrastructure that connects qualified pilots with airlines, operators, insurers, lenders, ATOs, and manufacturers.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => scrollTo('solutions')} className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-6 py-3 rounded-lg transition-colors">
                            Explore Solutions
                        </button>
                        <button onClick={() => scrollTo('contact')} className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                            Talk to Partnerships
                        </button>
                    </div>

                    {/* Stat strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-white/10">
                        <div>
                            <p className="text-3xl font-bold text-white mb-1">10+</p>
                            <p className="text-sm text-slate-400">Industry sectors served</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white mb-1">90<span className="text-lg text-slate-400">d</span></p>
                            <p className="text-sm text-slate-400">Placement metric</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white mb-1">Live</p>
                            <p className="text-sm text-slate-400">Real-time pilot profiles</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white mb-1">API</p>
                            <p className="text-sm text-slate-400">First-class integration</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── WHO WE SERVE / SOLUTIONS GRID ─── */}
            <section id="solutions" className="py-20 px-6 border-b border-white/10">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-blue-400 font-semibold mb-3">Who We Connect</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Bridging Pilots & Industry.</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mb-12">From airline recruitment to pilot finance, insurance underwriting to eVTOL talent pipelines — we connect qualified pilots with the businesses that need them.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SECTORS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => scrollTo(s.id)}
                                className="group text-left bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all"
                            >
                                <div className="text-3xl mb-3">{s.icon}</div>
                                <h3 className="text-white font-semibold text-lg mb-1.5 group-hover:text-blue-300 transition-colors">{s.label}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{s.tagline}</p>
                                <p className="mt-4 text-blue-400 text-xs font-semibold flex items-center gap-1">Learn more <span className="group-hover:translate-x-1 transition-transform">→</span></p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── SECTOR DEEP-DIVES (one section per sector) ─── */}
            {SECTORS.map((s, idx) => (
                <section key={s.id} id={s.id} className={`py-20 px-6 border-b border-white/10 ${idx % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/40'}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-12 gap-10">
                            {/* Left: intro */}
                            <div className="lg:col-span-5">
                                <div className="text-5xl mb-4">{s.icon}</div>
                                <p className={`text-[11px] uppercase tracking-[0.25em] font-semibold mb-3 ${COLOR_CLASSES[s.color]?.eyebrow ?? 'text-blue-400'}`}>{s.label}</p>
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5">{s.tagline}</h2>
                                <div className="bg-rose-950/30 border border-rose-900/40 rounded-xl p-4 mb-5">
                                    <p className="text-rose-300 text-[10px] uppercase tracking-widest font-bold mb-2">The Problem</p>
                                    <p className="text-slate-300 text-sm leading-relaxed">{s.pain}</p>
                                </div>
                                <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-4 mb-5">
                                    <p className="text-emerald-300 text-[10px] uppercase tracking-widest font-bold mb-2">Our Solution</p>
                                    <p className="text-slate-300 text-sm leading-relaxed">{s.solution}</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-2">Pricing & Engagement</p>
                                    <p className="text-slate-300 text-sm leading-relaxed">{s.cta}</p>
                                </div>
                            </div>

                            {/* Right: benefits + pilots */}
                            <div className="lg:col-span-7 space-y-6">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold mb-4">What you get</p>
                                    <ul className="grid sm:grid-cols-2 gap-3">
                                        {s.benefits.map(b => (
                                            <li key={b} className="flex items-start gap-2.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5">
                                                <span className={`${COLOR_CLASSES[s.color]?.check ?? 'text-blue-400'} text-xs mt-0.5 flex-shrink-0`}>✓</span>
                                                <span className="text-slate-300 text-sm">{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold mb-4">Why pilots win too</p>
                                    <ul className="space-y-2">
                                        {s.pilots.map(p => (
                                            <li key={p} className="flex items-start gap-2.5">
                                                <span className="text-emerald-400 text-xs mt-1 flex-shrink-0">●</span>
                                                <span className="text-slate-400 text-sm">{p}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button onClick={() => scrollTo('contact')} className={`mt-2 inline-flex items-center gap-2 ${COLOR_CLASSES[s.color]?.btn ?? 'bg-blue-600 hover:bg-blue-500'} text-white font-semibold px-5 py-3 rounded-lg text-sm transition-colors`}>
                                    Inquire about {s.label} <span>→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* ─── PARTNERSHIP TIERS ─── */}
            <section id="partners" className="py-20 px-6 border-b border-white/10">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-blue-400 font-semibold mb-3">Partnership Tiers</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Three ways to partner.</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mb-12">Whether you want to plug in, pull pilots, or co-brand a pathway — pick the engagement that fits your business.</p>

                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            {
                                tier: 'Integration Partner',
                                color: 'sky',
                                desc: 'Connect your software (logbook, ATS, LMS, screening) to our API. Data flows both ways.',
                                items: ['Open REST + GraphQL API', 'Webhook events', 'OAuth 2.0 pilot consent', 'Joint marketing listing'],
                                price: 'From $2,000 / month',
                            },
                            {
                                tier: 'Preferred Partner',
                                color: 'blue',
                                desc: 'Pull pilots, post pathway cards, run end-to-end recruitment with placement tracking.',
                                items: ['Full Pull API access', 'Unlimited Pathway Cards', 'Placement outcome dashboards', 'Recognition Score insights'],
                                price: '$1,000 / month + $500 success fee',
                                featured: true,
                            },
                            {
                                tier: 'Pathway Partner',
                                color: 'emerald',
                                desc: 'List pathways for free. Pay only when a pilot is placed through your card. Best for ATOs, charter, niche operators.',
                                items: ['Free pathway listings', 'Pay-on-placement only', 'Pilot interest waitlist', 'Performance dashboard'],
                                price: 'Free + $500 / placement',
                            },
                        ].map(t => (
                            <div key={t.tier} className={`relative bg-white/5 border rounded-2xl p-6 ${t.featured ? 'border-blue-500/50 ring-1 ring-blue-500/30' : 'border-white/10'}`}>
                                {t.featured && <span className="absolute -top-3 left-6 bg-blue-500 text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded font-bold">Most Popular</span>}
                                <h3 className="text-xl font-bold text-white mb-2">{t.tier}</h3>
                                <p className="text-slate-400 text-sm mb-5">{t.desc}</p>
                                <ul className="space-y-2 mb-6">
                                    {t.items.map(i => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                            <span className={`${TIER_CHECK[t.color] ?? 'text-blue-400'} text-xs mt-1`}>✓</span>{i}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-white font-semibold text-sm border-t border-white/10 pt-4">{t.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── PRICING ─── */}
            <section id="pricing" className="py-20 px-6 border-b border-white/10">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-blue-400 font-semibold mb-3">Enterprise Pricing</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple. Outcome-aligned.</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mb-12">Pay when it works. We track every placement obsessively — you should only pay when a pilot is hired through a pathway you posted.</p>

                    <div className="grid md:grid-cols-3 gap-5">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-2">Free</p>
                            <p className="text-4xl font-bold text-white mb-1">$0</p>
                            <p className="text-slate-400 text-sm mb-5">Get listed, get discovered</p>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li>• Public pathway card listing</li>
                                <li>• Receive pilot interest submissions</li>
                                <li>• Basic outcome dashboard</li>
                                <li>• Pay only on placement</li>
                            </ul>
                        </div>
                        <div className="bg-blue-600/10 border border-blue-500/40 ring-1 ring-blue-500/30 rounded-2xl p-6">
                            <p className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-2">Enterprise</p>
                            <p className="text-4xl font-bold text-white mb-1">$1,000<span className="text-lg text-slate-400 font-normal">/mo</span></p>
                            <p className="text-slate-400 text-sm mb-5">Pull API + full data access</p>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li>• Pull API — query the pilot database</li>
                                <li>• Unlimited Pathway Cards</li>
                                <li>• Recognition Score & EBT video access</li>
                                <li>• Veremark-verified pilot filter</li>
                                <li>• Live profile feed</li>
                                <li>• Placement tracking dashboard</li>
                            </ul>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <p className="text-emerald-400 text-xs uppercase tracking-widest font-semibold mb-2">Success Fee</p>
                            <p className="text-4xl font-bold text-white mb-1">$500<span className="text-lg text-slate-400 font-normal">/placement</span></p>
                            <p className="text-slate-400 text-sm mb-5">Per pilot placed within 90 days</p>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li>• Charged when a pilot is hired</li>
                                <li>• Tracked through pathway card</li>
                                <li>• Outcome attribution proven</li>
                                <li>• No placement = no fee</li>
                            </ul>
                        </div>
                    </div>

                    <p className="text-slate-500 text-xs mt-6">Custom enterprise data licences available for insurers, lenders, OEMs, and high-volume integrations. Contact us for pricing.</p>
                </div>
            </section>

            {/* ─── WHY / METRIC ─── */}
            <section id="why" className="py-20 px-6 border-b border-white/10">
                <div className="max-w-5xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-blue-400 font-semibold mb-3">Why PilotRecognition</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">A PDF is a dead CV.</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-3xl">
                        The aviation industry runs on stale paperwork. A PDF CV doesn't tell you whether the pilot has flown in the last 6 months. A logbook scan doesn't verify type rating currency. A self-declared medical doesn't catch a 30-day expiry. We rebuilt this from scratch: every pilot profile is live, scored, and verifiable in real time.
                    </p>
                    <div className="grid md:grid-cols-3 gap-5">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <p className="text-blue-400 text-xs uppercase tracking-widest font-bold mb-2">Pull, don't push</p>
                            <p className="text-slate-300 text-sm leading-relaxed">Airlines pull pilots from a ranked database. Pilots don't apply into a CV black-hole. The work flows the right direction.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <p className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Live, not snapshot</p>
                            <p className="text-slate-300 text-sm leading-relaxed">When a pilot logs hours, profiles update. When a medical expires, it's flagged. When a type rating renews, it's verified. Always current.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <p className="text-violet-400 text-xs uppercase tracking-widest font-bold mb-2">Verified, not declared</p>
                            <p className="text-slate-300 text-sm leading-relaxed">Veremark-screened identity, criminal record, employment history. EBT/CBTA scoring on real video interviews. Not "trust me, bro".</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="metric" className="py-16 px-6 border-b border-white/10 bg-gradient-to-b from-slate-950 to-slate-900/50">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-blue-400 font-semibold mb-4">The One Metric We Track</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
                        Pilots placed within <span className="text-blue-400">90 days</span> of a pathway being posted.
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">Every other vanity metric — listings, profile views, applications — doesn't matter if pilots aren't getting hired. We obsess over outcomes. So should every partner.</p>
                </div>
            </section>

            {/* ─── CONTACT FORM ─── */}
            <section id="contact" className="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
                <div className="max-w-3xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-blue-400 font-semibold mb-3">Request Access</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Tell us about your business.</h2>
                    <p className="text-slate-400 text-lg mb-10">We'll route your inquiry to the right team. Most partners hear back within 1–2 business days.</p>

                    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
                        {/* Sector */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">I represent a... *</label>
                            <select
                                name="sector"
                                required
                                value={formData.sector}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select your sector</option>
                                <option value="airline">Airline / Operator</option>
                                <option value="flightschool">Flight School / ATO</option>
                                <option value="insurance">Insurance Provider</option>
                                <option value="finance">Bank / Lender</option>
                                <option value="privatejet">Private Jet / Charter</option>
                                <option value="military">Military / Defence Transition Program</option>
                                <option value="evtol">Air Taxi / eVTOL Operator</option>
                                <option value="jobboard">Job Board / Staffing Agency</option>
                                <option value="manufacturer">Manufacturer / OEM</option>
                                <option value="integration">Software / Integration Partner</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">Full Name *</label>
                                <input name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">Work Email *</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">Company *</label>
                                <input name="company" required value={formData.company} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">Role / Title *</label>
                                <input name="role" required value={formData.role} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">Country</label>
                                <input name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">Website</label>
                                <input name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">Phone</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">Company Size</label>
                                <select name="companySize" value={formData.companySize} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select size</option>
                                    <option>1–10</option>
                                    <option>11–50</option>
                                    <option>51–200</option>
                                    <option>201–1000</option>
                                    <option>1000+</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Partnership interest *</label>
                            <select name="partnershipInterest" required value={formData.partnershipInterest} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                                <option value="">Select interest</option>
                                <option value="pull-api">Pull API access (pull pilots)</option>
                                <option value="pathway-cards">Post pathway cards</option>
                                <option value="data-licence">Data licence (insurance / finance / OEM)</option>
                                <option value="integration">Software integration</option>
                                <option value="redirect-partner">Redirect / co-listing (job board)</option>
                                <option value="general">General inquiry</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Timeline</label>
                            <select name="timeline" value={formData.timeline} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                                <option value="">When do you want to start?</option>
                                <option value="immediate">Immediate (this month)</option>
                                <option value="quarter">Within 90 days</option>
                                <option value="half">Within 6 months</option>
                                <option value="exploring">Just exploring</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Tell us more *</label>
                            <textarea name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="What problem are you trying to solve? What's your current process? What would make this a win for you?" className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 resize-none" />
                        </div>

                        <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-colors">
                            {submitting && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {submitting ? 'Submitting...' : 'Submit Request →'}
                        </button>
                        <p className="text-center text-slate-500 text-xs">Or email us directly at <a href="mailto:enterprise@pilotrecognition.com" className="text-blue-400 hover:text-blue-300">enterprise@pilotrecognition.com</a></p>
                    </form>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="bg-slate-950 border-t border-white/10 py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-3">
                        <span className="font-bold"><span className="text-white">Pilot</span><span className="text-blue-400">Recognition</span></span>
                        <span className="text-[10px] uppercase tracking-widest border border-slate-700 px-1.5 py-0.5 rounded">Enterprise</span>
                    </div>
                    <p>The aviation industry's talent infrastructure.</p>
                    <a href="https://pilotrecognition.com" className="text-blue-400 hover:text-blue-300">← pilotrecognition.com</a>
                </div>
            </footer>
        </div>
    );
};

export default EnterpriseAccessPage;
