'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SUPABASE_URL = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzQxOTEsImV4cCI6MjA4OTExMDE5MX0.m49ula5RMn4uEtRTk6l9q_6VElyPrY1YPMj-gtUYRsY';
const FIREBASE_BASE = 'https://us-central1-pilotrecognition-airline.cloudfunctions.net';

// ─── Nav structure ───────────────────────────────────────────────
const NAV_GROUPS = [
    {
        label: 'Solutions',
        items: [
            { id: 'airlines', label: 'Airlines & Operators', href: '/enterprise-access/airlines' },
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
type NavItem = { id: string; label: string; href?: string };

type Sector = {
    id: string;
    icon: string;
    label: string;
    color: string;
    tagline: string;
    pain: string;
    solution: string;
    mission?: string;
    benefits: string[];
    pilots: string[];
    cta: string;
};

const SECTORS: Sector[] = [
    {
        id: 'flightschools',
        icon: '🏫',
        label: 'Flight Schools & ATOs',
        color: 'emerald',
        tagline: 'Help your graduates get recognized by the industry.',
        pain: 'Flight schools train pilots, hand them a certificate, and lose them. There\'s no way to track which graduates gain recognition in the industry, no recurring relationship, and no visibility into graduate pathway outcomes.',
        solution: 'Become a partner ATO. Your graduates get prioritised pathway visibility, you earn referral revenue when graduates join the platform, and you receive analytics on graduate recognition outcomes — proving your school\'s ROI to prospective students.',
        benefits: [
            '$20 when a graduate joins and gets their Recognition Profile verified',
            'Pathway Cards listing — showcase your training to pilots exploring options',
            'Graduate outcome dashboard — track recognition progress and pathway engagement',
            'Co-branded recognition badge for graduates ("Trained at [School]")',
            'Direct integration with school CRM / student records',
            'Scholarship program — feature your funded seats to a national audience',
            'Type rating provider listing for pilots seeking conversion training',
        ],
        pilots: [
            'Find ATOs aligned with their target airline\'s OEM (Airbus / Boeing)',
            'Compare type rating providers by cost, location, recognition outcomes',
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
        tagline: 'Access verified pilot recognition data — when you need it.',
        pain: 'Private charter operators need verified pilot information quickly — for surge demand, coverage, or new routes. Today this means calling agencies and trusting unverified CVs. No live recognition data, no verification of current status.',
        solution: 'Pull verified pilot recognition data on-demand. Filter by aircraft type, location, verification status, and recency. Access pre-verified pilot profiles from the recognition database — real information, not self-declared CVs.',
        benefits: [
            'On-demand access to verified pilot recognition profiles',
            'Veremark-verified — background, criminal record, identity confirmed',
            'Live recency — confirm pilot has flown that type in last 30 days',
            'Per-access billing for recognition data — pay for what you use',
            'Concierge tier — managed pull with our recruitment team',
            'Owner-operator pathway listing — showcase your operation to recognized pilots',
            'Insurance integration — verified pilot data flows to your insurer',
            'EASA / FAA / GCAA jurisdiction filtering',
        ],
        pilots: [
            'Get recognized and become visible to charter operators',
            'Verified profile travels with you — no repeated background checks',
            'Discovery by operators who need your specific type rating and experience',
        ],
        cta: 'Per-access pricing or $750/mo Charter Pro plan. Inquire for fleet rates.',
    },
    {
        id: 'military',
        icon: '🎖️',
        label: 'Military & Defence Transition',
        color: 'rose',
        tagline: 'Help military aviators gain civilian recognition.',
        pain: 'Military pilots leaving service have thousands of hours and advanced training, but lack civilian recognition. Their experience doesn\'t map to civilian metrics, and they\'re invisible to civilian pathway providers who don\'t understand military qualifications.',
        solution: 'Military-to-Civilian (Mil2Civ) Recognition Mapping. We translate military qualifications into civilian-equivalent Recognition Scores, surface transition pathway information, and connect you with Mil2Civ programs that value your verified status.',
        benefits: [
            'Mil2Civ Recognition Mapping — military hours → civilian equivalent',
            'Tailored transition pathways from each major air force / branch',
            'Partner ATOs offering accelerated civilian type rating conversions',
            'Government / VA funding pathway integration (US, UK, AU, CA)',
            'Airline Mil2Civ pipelines — direct pathway visibility',
            'Defence contractor partnerships — test pilot, instructor, simulator pathways',
            'Cohort tracking — class of [year] outcome dashboards',
        ],
        pilots: [
            'Recognition Score from day one of civilian transition',
            'Discovery by Mil2Civ programs that value military experience',
            'Verified profile that eliminates repetitive paperwork',
        ],
        cta: 'Free veteran recognition. Partnerships for ATOs, airlines, and defence programs.',
    },
    {
        id: 'evtol',
        icon: '🚁',
        label: 'Air Taxi & eVTOL',
        color: 'cyan',
        tagline: 'Surface your pathway information to pre-qualified pilots.',
        pain: 'eVTOL and advanced air mobility operators are preparing for commercial ops but pilots can\'t find reliable information about qualifications, timelines, or pathways. Operators are building aircraft but have no way to surface their information to interested pilots.',
        solution: 'Pre-Launch Pathway Cards for eVTOL operators. Surface your aircraft specifications, training requirements, location, and operational timeline. Build a waitlist of interested, recognition-scored pilots who want to know more. We track pilot interest and readiness, connecting you with a pre-qualified discovery pool.',
        benefits: [
            'Pre-Launch Pathway Cards — surface your operational information',
            'Pilot interest waitlist — recognition-scored, qualified, interested',
            'OEM-aligned pathway co-branding (Joby, Archer, Lilium, Volocopter, Vertical, Beta)',
            'Conversion training partnerships with rotorcraft & STC schools',
            'Helicopter-to-eVTOL bridge programmes',
            'Public showcase — pilots learn what eVTOL means for their career',
            'Investor-ready pilot interest metrics for funding rounds',
        ],
        pilots: [
            'Discover emerging operators before they\'re widely known',
            'Join interest waitlists — get early access to pathway information',
            'Explore transition pathways from FW / RW into eVTOL',
        ],
        cta: 'Free pre-launch listing. $1,500/mo when commercial hiring begins.',
    },
    {
        id: 'jobboards',
        icon: '📋',
        label: 'Job Boards & Staffing Agencies',
        color: 'orange',
        tagline: 'Co-list pathway information. Share recognition data. Both sides win.',
        pain: 'Aviation information platforms have pilot traffic but lack structured pathway information, recognition scoring, and verified profile data. Pilots browse endlessly without understanding requirements or their own readiness.',
        solution: 'Partner integration. Co-list our Pathway Cards on your platform. Redirect pilots to PilotRecognition for profile creation and recognition scoring — they return with verified recognition status, and you get referral value per qualified pilot who joins the recognition platform.',
        benefits: [
            'Co-listed Pathway Cards via API or embed widget',
            'Redirect partner — pilots build recognition profile, return verified',
            'Per-referral revenue when pilots join the recognition platform (15% of subscription fee)',
            'White-label embedded recognition score badge on listings',
            'Pilot data feed (with consent) for your matching engine',
            'Cross-listing of premium pathways for your niche',
            'Joint marketing — featured partner placement',
        ],
        pilots: [
            'See structured pathway requirements alongside listings',
            'Build one recognition profile, verified across all partner platforms',
            'Get recognized once — visible everywhere',
        ],
        cta: 'Revenue share partnership. No fixed cost. Strengthen your platform with verified recognition data.',
    },
    {
        id: 'manufacturers',
        icon: '🔧',
        label: 'Manufacturers & OEMs',
        color: 'sky',
        tagline: 'Connect your aircraft information with recognized pilot data.',
        pain: 'Aircraft manufacturers want pilots to understand their aircraft capabilities and training paths — but recognition data, competency scoring, and type rating information sits siloed across airlines and ATOs, invisible to pilots exploring options.',
        solution: 'OEM-Aligned Recognition. Partner to align our recognition framework with your aircraft competencies. Pilots exploring your type get OEM-specific pathway information; you gain visibility into which pilots are recognition-ready for your fleet.',
        benefits: [
            'OEM-co-branded pathway information (e.g. "Airbus-aligned requirements")',
            'Pilot recognition data for type-specific competency insights',
            'Type rating training partner network listing',
            'EBT/CBTA scoring aligned to OEM-defined competencies',
            'Pilot expectations content co-published with your product team',
            'Simulator training partner integration',
            'New aircraft launch — recognition-ready pilot interest pool',
            'Service bulletins / fleet alerts pushed to relevant pilots',
        ],
        pilots: [
            'Discover OEM-specific requirements before choosing a type rating',
            'Understand exactly what competencies manufacturers value',
            'Connect with the teams behind the aircraft you want to fly',
        ],
        cta: 'Strategic OEM partnership. Surface your aircraft information to recognized pilots.',
    },
    {
        id: 'integrations',
        icon: '🔌',
        label: 'Software & API Integrations',
        color: 'fuchsia',
        tagline: 'Plug PilotRecognition into your stack.',
        pain: 'Aviation tech is fragmented: background screening tools, logbook apps, ops systems, crewing platforms, and document managers all operate separately. Pilot data sits in silos and never speaks across systems.',
        solution: 'Open API + verified integration partners. Plug PilotRecognition into your existing tools. Background screening integration, logbook software for hours sync, ATS for crewing, LMS for training delivery — pilot data flows once, recognised everywhere.',
        benefits: [
            'Background screening integrations — live verification status',
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
    {
        id: 'cargo',
        icon: '📦',
        label: 'Cargo & Freight Operators',
        color: 'amber',
        tagline: 'Surface your cargo pathway information to verified pilots.',
        pain: 'Cargo operators have specific type ratings (B747F, B767F, MD-11F, A330F) and operational requirements, but pilots can\'t find clear information about cargo pathways. Your pathway requirements are buried among passenger airline listings, invisible to pilots exploring all options.',
        solution: 'Cargo-focused pathway visibility. Surface your freighter type requirements, night flying expectations, and dangerous goods needs. Pilots exploring cargo options discover your information and can verify their readiness against your requirements.',
        benefits: [
            'Freighter type rating filters — B747F, B767F, MD-11F, A330F, A350F',
            'Cargo operations experience scoring',
            'Night flying recency verification',
            'Dangerous goods certification tracking',
            'ICAO Level 4+ English verification for international ops',
            'Long-haul and short-haul cargo route matching',
            'Interest tracking for seasonal pathway visibility'
        ],
        pilots: [
            'Discover cargo-specific pathway requirements not visible elsewhere',
            'Compare operators by freighter type and operational details',
            'Get recognition for cargo operations experience',
        ],
        cta: 'Enterprise pricing $1,000/mo. Volume discounts for fleet operators.',
    },
    {
        id: 'drone',
        icon: '🚁',
        label: 'Commercial Drone & UAV Operators',
        color: 'cyan',
        tagline: 'Surface your UAV pathway information to certified operators.',
        pain: 'Commercial drone operations need certified remote pilots (RPAS / Part 107 / A2 CofC), but operators can\'t surface their pathway information to qualified pilots. Pilots with BVLOS certification and specific aircraft experience are scattered across forums with no central discovery point.',
        solution: 'UAV pathway visibility platform. Surface your certification requirements, aircraft specifications, and operational details. Certified pilots discover your pathway information and can verify their readiness for your specific needs.',
        benefits: [
            'RPAS / Part 107 / A2 CofC certification verification',
            'BVLOS (Beyond Visual Line of Sight) certified pilot filter',
            'Aircraft-specific experience — DJI Matrice, Wingtra, senseFly, etc.',
            'Operational category tagging — delivery, survey, inspection, film',
            'Insurance-ready pilot profiles for commercial coverage',
            'Geographic availability mapping for field operations',
            'Pathway interest tracking by operational category'
        ],
        pilots: [
            'Discover commercial UAV pathways beyond hobby forums',
            'Get verified recognition for BVLOS and advanced certifications',
            'Connect with enterprise operators seeking certified pilots',
        ],
        cta: 'Flexible pathway listing pricing. Enterprise plans for fleet operators.'
    },
    {
        id: 'recruitment',
        icon: '🤝',
        label: 'Aviation Recruitment Agencies',
        color: 'green',
        tagline: 'Add verified recognition data to your candidate profiles.',
        pain: 'Aviation agencies spend weeks verifying pilot credentials manually. Candidates look identical on paper — hours and type ratings don\'t tell the full story. You need verified recognition data to differentiate candidates and accelerate your process.',
        solution: 'White-label recognition partnership. Your candidates build PilotRecognition profiles with verified scores. You present candidates with recognition data attached — reducing verification time and differentiating your candidate pool.',
        benefits: [
            'White-label Recognition Score for your candidates',
            'Background verification integration — reduce manual checks',
            'Live logbook sync — no more "trust me" hour claims',
            'Client-ready recognition reports with verified scoring',
            'Priority API access for high-volume agencies',
            'Revenue share on referred pilot subscriptions',
            'ATS integration for recognition-enriched profiles'
        ],
        pilots: [
            'Build recognition profile through your agency partner',
            'Verified status travels with you across all opportunities',
            'Stand out with recognition data — not just another CV',
        ],
        cta: 'Agency partnership program. Custom pricing based on volume.',
    },
];

// Static color map (Tailwind cannot resolve dynamic classnames)
const COLOR_CLASSES: Record<string, { eyebrow: string; check: string; btn: string }> = {
    blue: { eyebrow: 'text-red-600', check: 'text-red-600', btn: 'bg-red-600 hover:bg-red-500' },
    emerald: { eyebrow: 'text-emerald-600', check: 'text-emerald-600', btn: 'bg-red-600 hover:bg-red-500' },
    amber: { eyebrow: 'text-amber-600', check: 'text-amber-600', btn: 'bg-red-600 hover:bg-red-500' },
    green: { eyebrow: 'text-green-600', check: 'text-green-600', btn: 'bg-red-600 hover:bg-red-500' },
    violet: { eyebrow: 'text-violet-600', check: 'text-violet-600', btn: 'bg-red-600 hover:bg-red-500' },
    rose: { eyebrow: 'text-rose-600', check: 'text-rose-600', btn: 'bg-red-600 hover:bg-red-500' },
    cyan: { eyebrow: 'text-cyan-600', check: 'text-cyan-600', btn: 'bg-red-600 hover:bg-red-500' },
    orange: { eyebrow: 'text-orange-600', check: 'text-orange-600', btn: 'bg-red-600 hover:bg-red-500' },
    sky: { eyebrow: 'text-sky-600', check: 'text-sky-600', btn: 'bg-red-600 hover:bg-red-500' },
    fuchsia: { eyebrow: 'text-fuchsia-600', check: 'text-fuchsia-600', btn: 'bg-red-600 hover:bg-red-500' },
};
const TIER_CHECK: Record<string, string> = {
    sky: 'text-sky-600',
    blue: 'text-red-600',
    emerald: 'text-emerald-600',
};

// ─── Component ───────────────────────────────────────────────────
const EnterpriseAccessPage = () => {
    const navigate = useNavigate();
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

    const [activeSection, setActiveSection] = useState<string>('home');
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 20);
            // Calculate scroll progress
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / docHeight) * 100;
            setScrollProgress(progress);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Intersection Observer for section tracking
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { 
                rootMargin: '-20% 0px -60% 0px',
                threshold: 0.1 
            }
        );

        // Observe all sections
        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        setOpenMenu(null);
        setMobileNav(false);
        const el = document.getElementById(id);
        if (el) {
            const headerOffset = 100;
            const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
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
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-2xl p-10 max-w-lg w-full text-center shadow-lg">
                    <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Request Received</h2>
                    <p className="text-slate-600 mb-2">Thank you, <strong className="text-slate-900">{formData.name}</strong>.</p>
                    <p className="text-slate-600 text-sm mb-6">Your enterprise inquiry for <strong className="text-slate-900">{formData.company}</strong> has been received. The PilotRecognition partnership team will respond at <strong className="text-slate-900">{formData.email}</strong> within 1–2 business days.</p>
                    <a href="https://pilotrecognition.com" className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all">← Back to Pilot Site</a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900">

            {/* ─── SCROLL PROGRESS BAR ─── */}
            <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-slate-100">
                <div 
                    className="h-full bg-red-600 transition-all duration-150 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* ─── STICKY NAV ─── */}
            <header className={`sticky top-1 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
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
                                                {group.items.map(item => {
                                                    const isActive = activeSection === item.id;
                                                    return item.href ? (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => { setOpenMenu(null); navigate(item.href!); }}
                                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors block ${
                                                                isActive 
                                                                    ? 'bg-red-50 text-red-700 font-medium border-l-2 border-red-600' 
                                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                            }`}
                                                        >
                                                            {item.label}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => scrollTo(item.id)}
                                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                                                isActive 
                                                                    ? 'bg-red-50 text-red-700 font-medium border-l-2 border-red-600' 
                                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                            }`}
                                                        >
                                                            {item.label}
                                                            {isActive && (
                                                                <span className="ml-2 inline-flex items-center justify-center w-1.5 h-1.5 bg-red-600 rounded-full" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* CTA */}
                        <div className="flex items-center gap-3">
                            <button onClick={() => scrollTo('contact')} className="hidden sm:inline-flex bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                                Request Access →
                            </button>
                            <button onClick={() => setMobileNav(v => !v)} className="lg:hidden text-slate-900 p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileNav ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile nav */}
                    {mobileNav && (
                        <div className="lg:hidden border-t border-slate-200 py-4 max-h-[80vh] overflow-y-auto bg-white">
                            {NAV_GROUPS.map(group => (
                                <div key={group.label} className="mb-4">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 mb-1.5">{group.label}</p>
                                    {group.items.map(item => {
                                        const isActive = activeSection === item.id;
                                        return item.href ? (
                                            <button
                                                key={item.id}
                                                onClick={() => { setMobileNav(false); navigate(item.href!); }}
                                                className={`w-full text-left px-2 py-2 text-sm block transition-colors ${
                                                    isActive 
                                                        ? 'text-red-700 font-medium bg-red-50 rounded' 
                                                        : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                            >
                                                {item.label}
                                                {isActive && (
                                                    <span className="ml-2 inline-flex w-1.5 h-1.5 bg-red-600 rounded-full" />
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                key={item.id}
                                                onClick={() => scrollTo(item.id)}
                                                className={`w-full text-left px-2 py-2 text-sm transition-colors ${
                                                    isActive 
                                                        ? 'text-red-700 font-medium bg-red-50 rounded' 
                                                        : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                            >
                                                {item.label}
                                                {isActive && (
                                                    <span className="ml-2 inline-flex w-1.5 h-1.5 bg-red-600 rounded-full" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* ─── HERO ─── */}
            <section id="home" className="relative overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-50/60 via-white to-white pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full mb-6 uppercase tracking-widest">
                                Enterprise · Global Aviation Network
                            </span>
                            <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] mb-6 text-slate-900">
                                Connecting Pilots<br />
                                <span className="text-red-600">to the Industry.</span>
                            </h1>
                            <p className="text-slate-500 text-lg mb-8 leading-relaxed max-w-lg">
                                Live pilot profiles. Background-verified. Recognition scored. The infrastructure that connects verified pilots with pathway information from airlines, operators, insurers, lenders, ATOs, and manufacturers.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-8">
                                <button onClick={() => scrollTo('pillars')} className="bg-red-600 text-white hover:bg-red-500 font-semibold px-6 py-3 rounded-lg transition-colors">
                                    Explore 25 Pillars
                                </button>
                                <button onClick={() => scrollTo('contact')} className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors">
                                    Request Access
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                                Not a job board — a Recognition & Information Platform. No hiring promises. Just verified discovery.
                            </div>
                        </div>

                        {/* Stats cards */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { value: '25', label: 'Strategic Pillars', sub: 'Across 7 industry hubs' },
                                { value: '15+', label: 'Aviation Sectors', sub: 'Airlines to eVTOL' },
                                { value: 'Live', label: 'Real-Time Profiles', sub: 'Not static CVs' },
                                { value: 'API', label: 'Enterprise Access', sub: 'Pull verified pilot data' },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                                    <p className="text-sm font-semibold text-slate-700">{stat.label}</p>
                                    <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── UCF BANNER ─── */}
            <section id="framework" className="relative py-24 px-6 bg-slate-950 overflow-hidden">
                {/* Giant background text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <span className="text-[22vw] font-black text-white/[0.03] leading-none tracking-tighter whitespace-nowrap">UCF</span>
                </div>
                {/* Subtle red glow */}
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative max-w-5xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="h-px w-12 bg-red-600/50" />
                        <span className="text-red-500 text-xs font-semibold uppercase tracking-[0.3em]">Version 10.0-Expanded</span>
                        <div className="h-px w-12 bg-red-600/50" />
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tight">
                        Universal<br />
                        <span className="text-red-500">Commercial</span><br />
                        Framework
                    </h2>

                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
                        The master blueprint for the aviation industry operating system. Requirements, contributions, and commercial value analysis for every stakeholder.
                    </p>

                    <div className="flex items-center justify-center gap-6 text-xs text-slate-500 mb-12">
                        <span>25 Pillars</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                        <span>7 Hubs</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                        <span>90+ Pages</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                        <span>7 Stakeholder Hubs</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a href="/ucf" className="bg-red-600 hover:bg-red-500 text-white font-bold px-10 py-4 rounded-xl transition-colors text-sm tracking-wide">
                            Open UCF →
                        </a>
                        <a href="https://enterprise.pilotrecognition.com/framework/full" className="text-slate-400 hover:text-white border border-white/10 hover:border-white/30 font-semibold px-8 py-4 rounded-xl transition-colors text-sm">
                            Full Framework Document
                        </a>
                    </div>
                </div>
            </section>

            {/* ─── 25 PILLARS ─── */}
            <section id="pillars" className="py-20 px-6 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <span className="text-xs uppercase tracking-widest text-red-600 font-semibold">25 Strategic Pillars · 7 Stakeholder Hubs</span>
                        <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-3">Every Aviation Stakeholder. One Platform.</h2>
                        <p className="text-slate-500 max-w-2xl">Grouped by stakeholder hub — click any pillar to explore its requirements, contributions, and commercial value.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[
                            {
                                hub: 'Hub A', label: 'Operations & Recruitment',
                                pillars: [
                                    { n: 1, name: 'Commercial Airlines' },
                                    { n: 2, name: 'Cargo & Freight Operators' },
                                    { n: 3, name: 'Charter & Business Aviation' },
                                    { n: 4, name: 'eVTOL & Air Taxi' },
                                ]
                            },
                            {
                                hub: 'Hub B', label: 'Training & Transition',
                                pillars: [
                                    { n: 5, name: 'Flight Training ATOs' },
                                    { n: 6, name: 'Type Rating Centers' },
                                    { n: 7, name: 'Military & Defence' },
                                ]
                            },
                            {
                                hub: 'Hub C', label: 'Capital, Risk & Compliance',
                                pillars: [
                                    { n: 8, name: 'Banking & Finance' },
                                    { n: 9, name: 'Aviation Insurance' },
                                    { n: 10, name: 'Regulatory Bodies' },
                                    { n: 11, name: 'Verification APIs' },
                                    { n: 12, name: 'Flight Data Providers' },
                                    { n: 13, name: 'Aeromedical Examiners' },
                                ]
                            },
                            {
                                hub: 'Hub D', label: 'Connection & Media',
                                pillars: [
                                    { n: 14, name: 'Pilot Mentors & Unions' },
                                    { n: 15, name: 'Aircraft Manufacturers' },
                                    { n: 16, name: 'Recruitment Agencies' },
                                    { n: 17, name: 'Aviation Universities' },
                                    { n: 18, name: 'Aviation Media' },
                                    { n: 19, name: 'Career Fairs & Events' },
                                ]
                            },
                            {
                                hub: 'Hub E', label: 'Governance & Policy',
                                pillars: [
                                    { n: 20, name: 'Government Authorities' },
                                    { n: 22, name: 'International Organisations' },
                                ]
                            },
                            {
                                hub: 'Hub E-A', label: 'Humanitarian & Mission',
                                pillars: [
                                    { n: 21, name: 'Humanitarian Missions' },
                                ]
                            },
                            {
                                hub: 'Hub G', label: 'Digital Discovery',
                                pillars: [
                                    { n: 23, name: 'Search & Discovery Platforms' },
                                    { n: 24, name: 'Aviation Events' },
                                    { n: 25, name: 'Digital Platforms' },
                                ]
                            },
                        ].map((group) => (
                            <div key={group.hub} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                {/* Hub header */}
                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">{group.hub}</span>
                                    <span className="text-[10px] text-slate-400">{group.label}</span>
                                </div>
                                {/* Pillars stacked */}
                                <div className="divide-y divide-slate-100">
                                    {group.pillars.map((pillar) => (
                                        <button
                                            key={pillar.n}
                                            onClick={() => scrollTo('solutions')}
                                            className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors group"
                                        >
                                            <span className="text-[11px] font-mono text-slate-300 w-5 flex-shrink-0 group-hover:text-red-400 transition-colors">{pillar.n}</span>
                                            <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium leading-tight">{pillar.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── WHO WE SERVE / SOLUTIONS GRID ─── */}
            <section id="solutions" className="py-20 px-6 border-b border-slate-200 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Solutions for Every Aviation Sector</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Connecting Aviation Ecosystems.</h2>
                    <p className="text-slate-600 text-lg max-w-2xl mb-12">From commercial airlines to cargo operators, flight schools to finance, insurance to emerging air mobility — we connect qualified pilots with every corner of the aviation industry. Expanding to new sectors continuously.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SECTORS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => scrollTo(s.id)}
                                className="group text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-6 transition-all shadow-sm"
                            >
                                <div className="text-3xl mb-3">{s.icon}</div>
                                <h3 className="text-slate-900 font-semibold text-lg mb-1.5 group-hover:text-red-600 transition-colors">{s.label}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{s.tagline}</p>
                                <p className="mt-4 text-red-600 text-xs font-semibold flex items-center gap-1">Learn more <span className="group-hover:translate-x-1 transition-transform">→</span></p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── SECTOR DEEP-DIVES (one section per sector) ─── */}
            {SECTORS.map((s, idx) => (
                <section key={s.id} id={s.id} className={`py-20 px-6 border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-12 gap-10">
                            {/* Left: intro */}
                            <div className="lg:col-span-5">
                                <p className={`text-[11px] uppercase tracking-[0.25em] font-semibold mb-3 ${COLOR_CLASSES[s.color]?.eyebrow ?? 'text-red-600'}`}>{s.label}</p>
                                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-5 text-slate-900" dangerouslySetInnerHTML={{ __html: s.tagline }} />
                                {s.id === 'airlines' && (
                                    <div className="mb-5">
                                        <img 
                                            src="/recogntion.png" 
                                            alt="The Recognition Gap: Qualified pilots stand unrecognized while operators search for talent" 
                                            className="w-full rounded-xl shadow-md"
                                        />
                                        <p className="text-slate-500 text-xs mt-2">
                                            The paradox of modern aviation recruitment: pilots with thousands of hours stand unrecognized outside, while operators inside struggle to find qualified candidates. The Recognition Gap costs the industry millions in lost talent and misplaced opportunities.
                                        </p>
                                    </div>
                                )}
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                                    <p className="text-red-700 text-[10px] uppercase tracking-widest font-bold mb-2">The Problem</p>
                                    <p className="text-slate-700 text-sm leading-relaxed">{s.pain}</p>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
                                    <p className="text-emerald-700 text-[10px] uppercase tracking-widest font-bold mb-2">Our Solution</p>
                                    <p className="text-slate-700 text-sm leading-relaxed">{s.solution}</p>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
                                    <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mb-2">Pricing & Engagement</p>
                                    <p className="text-slate-700 text-sm leading-relaxed">{s.cta}</p>
                                    <a href="/enterprise-access/learn-more" className="inline-flex items-center gap-1 mt-3 text-sm text-red-600 hover:text-red-500 font-semibold">
                                        See pricing comparison & example pathways →
                                    </a>
                                </div>
                                {s.mission && (
                                    <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-xl p-4">
                                        <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mb-2">Our Mission for {s.label}</p>
                                        <p className="text-slate-700 text-sm leading-relaxed">{s.mission}</p>
                                    </div>
                                )}
                            </div>

                            {/* Right: benefits + pilots */}
                            <div className="lg:col-span-7 space-y-6">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">What you get</p>
                                    <ul className="grid sm:grid-cols-2 gap-3">
                                        {s.benefits.map(b => (
                                            <li key={b} className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                                                <span className={`${COLOR_CLASSES[s.color]?.check ?? 'text-red-600'} text-xs mt-0.5 flex-shrink-0`}>✓</span>
                                                <span className="text-slate-700 text-sm">{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">Why pilots win too</p>
                                    <ul className="space-y-2">
                                        {s.pilots.map(p => (
                                            <li key={p} className="flex items-start gap-2.5">
                                                <span className="text-emerald-600 text-xs mt-1 flex-shrink-0">●</span>
                                                <span className="text-slate-600 text-sm">{p}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button onClick={() => scrollTo('contact')} className={`mt-2 inline-flex items-center gap-2 ${COLOR_CLASSES[s.color]?.btn ?? 'bg-red-600 hover:bg-red-500'} text-white font-semibold px-5 py-3 rounded-lg text-sm transition-colors`}>
                                    Inquire about {s.label} <span>→</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </section>
            ))}

            {/* ─── PARTNERSHIP TIERS ─── */}
            <section id="partners" className="py-20 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Partnership Tiers</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Three ways to partner.</h2>
                    <p className="text-slate-600 text-lg max-w-2xl mb-12">Whether you want to plug in, pull pilots, or co-brand a pathway — pick the engagement that fits your business.</p>

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
                            <div key={t.tier} className={`relative bg-slate-50 border rounded-2xl p-6 ${t.featured ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200'}`}>
                                {t.featured && <span className="absolute -top-3 left-6 bg-red-600 text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded font-bold">Most Popular</span>}
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{t.tier}</h3>
                                <p className="text-slate-600 text-sm mb-5">{t.desc}</p>
                                <ul className="space-y-2 mb-6">
                                    {t.items.map(i => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                            <span className={`${TIER_CHECK[t.color] ?? 'text-red-600'} text-xs mt-1`}>✓</span>{i}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-slate-900 font-semibold text-sm border-t border-slate-200 pt-4">{t.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── PRICING ─── */}
            <section id="pricing" className="py-20 px-6 border-b border-slate-200 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Enterprise Pricing</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Simple. Outcome-aligned.</h2>
                    <p className="text-slate-600 text-lg max-w-2xl mb-12">Pay when it works. We track every placement obsessively — you should only pay when a pilot is hired through a pathway you posted.</p>

                    <div className="grid md:grid-cols-3 gap-5">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-2">Free</p>
                            <p className="text-4xl font-bold text-slate-900 mb-1">$0</p>
                            <p className="text-slate-600 text-sm mb-5">Get listed, get discovered</p>
                            <ul className="space-y-2 text-sm text-slate-700">
                                <li>• Public pathway card listing</li>
                                <li>• Receive pilot interest submissions</li>
                                <li>• Basic outcome dashboard</li>
                                <li>• Pay only on placement</li>
                            </ul>
                        </div>
                        <div className="bg-red-50 border border-red-200 ring-1 ring-red-500/20 rounded-2xl p-6">
                            <p className="text-red-600 text-xs uppercase tracking-widest font-semibold mb-2">Enterprise</p>
                            <p className="text-4xl font-bold text-slate-900 mb-1">$1,000<span className="text-lg text-slate-500 font-normal">/mo</span></p>
                            <p className="text-slate-600 text-sm mb-5">Pull API + full data access</p>
                            <ul className="space-y-2 text-sm text-slate-700">
                                <li>• Pull API — query the pilot database</li>
                                <li>• Unlimited Pathway Cards</li>
                                <li>• Recognition Score & EBT video access</li>
                                <li>• Veremark-verified pilot filter</li>
                                <li>• Live profile feed</li>
                                <li>• Placement tracking dashboard</li>
                            </ul>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-emerald-600 text-xs uppercase tracking-widest font-semibold mb-2">Outcome Fee</p>
                            <p className="text-4xl font-bold text-slate-900 mb-1">$500<span className="text-lg text-slate-500 font-normal">/outcome</span></p>
                            <p className="text-slate-600 text-sm mb-5">When a pathway connection succeeds</p>
                            <ul className="space-y-2 text-sm text-slate-700">
                                <li>• Charged when pilot engagement succeeds</li>
                                <li>• Tracked through pathway interaction</li>
                                <li>• Outcome attribution proven</li>
                                <li>• No outcome = no fee</li>
                            </ul>
                        </div>
                    </div>

                    <p className="text-slate-500 text-xs mt-6">Custom enterprise data licences available for insurers, lenders, OEMs, and high-volume integrations. Contact us for pricing.</p>
                </div>
            </section>

            {/* ─── WHY / METRIC ─── */}
            <section id="why" className="py-20 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-5xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Why PilotRecognition</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">A PDF is a dead CV.</h2>
                    <p className="text-slate-600 text-lg leading-relaxed mb-10 max-w-3xl">
                        The aviation industry runs on stale paperwork. A PDF CV doesn't tell you whether the pilot has flown in the last 6 months. A logbook scan doesn't verify type rating currency. A self-declared medical doesn't catch a 30-day expiry. We rebuilt this from scratch: every pilot profile is live, scored, and verifiable in real time.
                    </p>
                    <div className="grid md:grid-cols-3 gap-5">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <p className="text-red-600 text-xs uppercase tracking-widest font-bold mb-2">Pull, don't push</p>
                            <p className="text-slate-700 text-sm leading-relaxed">Airlines pull pilots from a ranked database. Pilots don't apply into an unresponsive system. The work flows the right direction.</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <p className="text-emerald-600 text-xs uppercase tracking-widest font-bold mb-2">Live, not snapshot</p>
                            <p className="text-slate-700 text-sm leading-relaxed">When a pilot logs hours, profiles update. When a medical expires, it's flagged. When a type rating renews, it's verified. Always current.</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <p className="text-violet-600 text-xs uppercase tracking-widest font-bold mb-2">Verified, not declared</p>
                            <p className="text-slate-700 text-sm leading-relaxed">Background-screened identity, criminal record, employment history. EBT/CBTA scoring on real video interviews. Not "trust me, bro".</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="metric" className="py-16 px-6 border-b border-slate-200 bg-gradient-to-b from-slate-100 to-slate-50">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-4">The One Metric We Track</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight text-slate-900">
                        Pilots connected to pathways within <span className="text-red-600">90 days</span>.
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">Not job placements. Not hires. Just pilots discovering the right information, at the right time, with the right recognition status. That's the outcome we obsess over.</p>
                </div>
            </section>

            {/* ─── CONTACT FORM ─── */}
            <section id="contact" className="py-20 px-6 bg-slate-100">
                <div className="max-w-3xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Request Access</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Tell us about your business.</h2>
                    <p className="text-slate-600 text-lg mb-10">We'll route your inquiry to the right team. Most partners hear back within 1–2 business days.</p>

                    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 space-y-5 shadow-sm">
                        {/* Sector */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">I represent a... *</label>
                            <select
                                name="sector"
                                required
                                value={formData.sector}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="">Select your sector</option>
                                <option value="airline">Airline / Operator</option>
                                <option value="flightschool">Flight School / ATO</option>
                                <option value="insurance">Insurance Provider</option>
                                <option value="finance">Bank / Lender</option>
                                <option value="privatejet">Private Jet / Charter</option>
                                <option value="military">Military / Defence Transition Program</option>
                                <option value="evtol">Air Taxi / eVTOL Operator</option>
                                <option value="jobboard">Information Platform / Staffing Agency</option>
                                <option value="manufacturer">Manufacturer / OEM</option>
                                <option value="integration">Software / Integration Partner</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name *</label>
                                <input name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Work Email *</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Company *</label>
                                <input name="company" required value={formData.company} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Role / Title *</label>
                                <input name="role" required value={formData.role} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Country</label>
                                <input name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Website</label>
                                <input name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Phone</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Company Size</label>
                                <select name="companySize" value={formData.companySize} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500">
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
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Partnership interest *</label>
                            <select name="partnershipInterest" required value={formData.partnershipInterest} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500">
                                <option value="">Select interest</option>
                                <option value="pull-api">Pull API access (recognition data)</option>
                                <option value="pathway-cards">Post pathway cards</option>
                                <option value="data-licence">Data licence (insurance / finance / OEM)</option>
                                <option value="integration">Software integration</option>
                                <option value="redirect-partner">Redirect / co-listing partner</option>
                                <option value="general">General inquiry</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Timeline</label>
                            <select name="timeline" value={formData.timeline} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500">
                                <option value="">When do you want to start?</option>
                                <option value="immediate">Immediate (this month)</option>
                                <option value="quarter">Within 90 days</option>
                                <option value="half">Within 6 months</option>
                                <option value="exploring">Just exploring</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Tell us more *</label>
                            <textarea name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="What problem are you trying to solve? What's your current process? What would make this a win for you?" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500 resize-none" />
                        </div>

                        <button type="submit" disabled={submitting} className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-colors">
                            {submitting && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {submitting ? 'Submitting...' : 'Submit Request →'}
                        </button>
                        <p className="text-center text-slate-500 text-xs">Or email us directly at <a href="mailto:enterprise@pilotrecognition.com" className="text-red-600 hover:text-red-500">enterprise@pilotrecognition.com</a></p>
                    </form>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="bg-white border-t border-slate-200 py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-3">
                        <span className="font-bold"><span className="text-slate-900">Pilot</span><span className="text-red-600">Recognition</span></span>
                        <span className="text-[10px] uppercase tracking-widest border border-slate-300 px-1.5 py-0.5 rounded">Enterprise</span>
                    </div>
                    <p className="text-slate-600">Pilot Recognition & Information Platform — Not a Job Board</p>
                    <a href="https://pilotrecognition.com" className="text-red-600 hover:text-red-500">← pilotrecognition.com</a>
                </div>
            </footer>
        </div>
    );
};

export default EnterpriseAccessPage;
