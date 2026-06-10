
'use client';

import React, { useState, useEffect } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { detectRegionalPricing, formatPrice, type RegionalPrice } from '../../lib/regionalPricing';

const FEATURES: any[] = [];

const COLOR_CLASSES: Record<string, { eyebrow: string; badge: string; border: string; bg: string }> = {
    blue: { eyebrow: 'text-blue-600', badge: 'bg-blue-100 text-blue-700 border-blue-200', border: 'border-blue-200', bg: 'bg-blue-50' },
    violet: { eyebrow: 'text-violet-600', badge: 'bg-violet-100 text-violet-700 border-violet-200', border: 'border-violet-200', bg: 'bg-violet-50' },
    amber: { eyebrow: 'text-amber-600', badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-amber-200', bg: 'bg-amber-50' },
    emerald: { eyebrow: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', border: 'border-emerald-200', bg: 'bg-emerald-50' },
    rose: { eyebrow: 'text-rose-600', badge: 'bg-rose-100 text-rose-700 border-rose-200', border: 'border-rose-200', bg: 'bg-rose-50' },
    teal: { eyebrow: 'text-teal-600', badge: 'bg-teal-100 text-teal-700 border-teal-200', border: 'border-teal-200', bg: 'bg-teal-50' },
};

export default function RecognitionPlusPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const [showCancelledBanner, setShowCancelledBanner] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileNav, setMobileNav] = useState(false);
    const [pricing, setPricing] = useState<RegionalPrice & { countryCode: string }>({
        currency: 'USD', symbol: '$', annual: 99, monthly: 12, semiAnnual: 60,
        annualNote: 'Save $45/yr vs monthly', locale: 'en-US', countryCode: 'US',
    });

    useEffect(() => {
        setPricing(detectRegionalPricing());
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (searchParams.get('success') === 'true') {
            setShowSuccessBanner(true);
        }
        if (searchParams.get('cancelled') === 'true') {
            setShowCancelledBanner(true);
        }
        // Handle section anchors for dropdown navigation
        const section = searchParams.get('section');
        if (section) {
            const element = document.getElementById(section);
            if (element) {
                setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id: string) => {
        setMobileNav(false);
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    const handleCheckout = async (_priceId: string, _planName: string, _trialPeriodDays?: number) => {
        // Paid Recognition+ plans are no longer offered. Direct users to the free tier instead.
        alert('Recognition Plus is now free — please create a free account at /become-member.');
        setProcessing(false);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Success Banner */}
            {showSuccessBanner && (
                <div className="bg-green-50 border-b-2 border-green-200 px-6 py-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-lg">✓</span>
                            </div>
                            <div>
                                <p className="font-bold text-green-900">Payment Successful!</p>
                                <p className="text-sm text-green-700">Your Recognition Plus subscription is now active. Welcome aboard!</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowSuccessBanner(false)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Cancelled Banner */}
            {showCancelledBanner && (
                <div className="bg-amber-50 border-b-2 border-amber-200 px-6 py-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-lg">!</span>
                            </div>
                            <div>
                                <p className="font-bold text-amber-900">Payment Cancelled</p>
                                <p className="text-sm text-amber-700">You cancelled the checkout. No charges were made. Feel free to try again anytime.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCancelledBanner(false)}
                            className="text-amber-600 hover:text-amber-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* ─── STICKY NAV ─── */}
            <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="text-sm font-medium">Home</span>
                            </button>
                            <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
                                <span className="text-xl font-bold tracking-tight">
                                    <span className="text-slate-900">Pilot</span><span className="text-red-600">Recognition</span>
                                </span>
                                <span className="text-sm font-semibold text-slate-900 tracking-wide">Plus</span>
                            </button>
                        </div>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {FEATURES.map(feat => (
                                <button
                                    key={feat.id}
                                    onClick={() => scrollTo(feat.id)}
                                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    {feat.label}
                                </button>
                            ))}
                        </nav>

                        {/* CTA */}
                        <div className="hidden lg:flex items-center gap-3">
                            <button
                                onClick={() => navigate('/become-member')}
                                className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                Get Recognition+
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
                            onClick={() => setMobileNav(!mobileNav)}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileNav ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile nav */}
                {mobileNav && (
                    <div className="lg:hidden border-t border-slate-200 bg-white">
                        <div className="px-4 py-3 space-y-1">
                            {FEATURES.map(feat => (
                                <button
                                    key={feat.id}
                                    onClick={() => scrollTo(feat.id)}
                                    className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-lg"
                                >
                                    {feat.icon} {feat.label}
                                </button>
                            ))}
                            <div className="pt-2 border-t border-slate-100 mt-2">
                                <button
                                    onClick={() => navigate('/become-member')}
                                    className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                                >
                                    Get Recognition+
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* ─── HERO ─── */}
            <section className="relative bg-slate-50 border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
                    <div className="w-full">
                        {/* Pricing moved to top as requested */}
                        <section id="pricing" className="py-10 px-0 border-b-0 bg-slate-50">
                            <div className="max-w-6xl mx-auto">
                                <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Pricing</p>
                                <p className="text-slate-600 text-lg max-w-2xl mb-6">
                                    Start with a free trial. Upgrade to Recognition Plus for priority matching and AI-powered career tools.
                                </p>

                                <div className="text-center">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Choose Your Plan.</h2>
                                    <p className="text-xl md:text-2xl font-bold text-red-600 mb-8">For Pilots</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                    {/* Free Tier */}
                                    <div className="bg-slate-100 rounded-xl p-8 text-center border border-slate-200 flex flex-col h-full">
                                        <h3 className="text-xl font-bold text-slate-700 mb-2">Free</h3>
                                        <p className="text-4xl font-bold text-slate-700 mb-1">$0<span className="text-lg font-normal text-slate-500">/year</span></p>
                                        <p className="text-sm text-slate-500 mb-2">Basic access</p>
                                        <Link
                                            to="/recognition-plus/free"
                                            className="text-blue-600 hover:text-blue-700 underline text-sm font-semibold mb-2 inline-block"
                                        >
                                            Learn more
                                        </Link>
                                        <p className="text-xs text-slate-400 mb-6 font-semibold">Get started today</p>
                                        <ul className="space-y-2 mb-6 text-left text-sm text-slate-600">
                                            <li className="flex items-start gap-2"><span className="text-slate-400 font-bold">✓</span><span>Basic profile</span></li>
                                            <li className="flex items-start gap-2"><span className="text-slate-400 font-bold">✓</span><span>2 pathway submissions/month</span></li>
                                            <li className="flex items-start gap-2"><span className="text-slate-400 font-bold">✓</span><span>3 profile comparisons/month</span></li>
                                            <li className="flex items-start gap-2"><span className="text-slate-400 font-bold">✓</span><span>5 AI chats/month</span></li>
                                            <li className="flex items-start gap-2"><span className="text-slate-400 font-bold">✓</span><span>General pool visibility</span></li>
                                            <li className="flex items-start gap-2"><span className="text-slate-400 font-bold">—</span><span className="text-slate-400">Priority matching</span></li>
                                            <li className="flex items-start gap-2"><span className="text-slate-400 font-bold">—</span><span className="text-slate-400">Exclusive pathways</span></li>
                                            <li className="flex items-start gap-2"><span className="text-slate-400 font-bold">—</span><span className="text-slate-400">Verified credentials</span></li>
                                        </ul>
                                        <button
                                            onClick={() => navigate('/become-member')}
                                            className="mt-auto w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-full transition-colors"
                                        >
                                            Get Started Free
                                        </button>
                                    </div>

                                    {/* Recognition+ Verified */}
                                    <div className="bg-slate-100 rounded-xl p-8 text-center border border-slate-200 relative flex flex-col h-full">
                                        <h3 className="text-xl font-bold text-red-700 mb-2 mt-2">Recognition +</h3>
                                        <p className="text-4xl font-bold text-slate-700 mb-1">{formatPrice(pricing.symbol, pricing.annual)}<span className="text-lg font-normal text-slate-500">/year</span></p>
                                        <p className="text-sm text-slate-600 mb-2">Annual membership</p>
                                        <Link
                                            to="/recognition-plus/verified"
                                            className="text-blue-600 hover:text-blue-700 underline text-sm font-semibold mb-2 inline-block"
                                        >
                                            Learn more
                                        </Link>
                                        <p className="text-xs text-slate-500 mb-6 font-semibold">✓ 3-day free trial</p>
                                        <ul className="space-y-2 mb-6 text-left text-sm text-slate-700">
                                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>Full profile comparison</span></li>
                                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>Unlimited pathway submissions</span></li>
                                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>Priority matching</span></li>
                                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>AI career strategist</span></li>
                                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>EBT CBTA Fast-Track</span></li>
                                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>Exclusive pathways (Private Jet, eVTOL)</span></li>
                                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>Verified flight hours & credentials</span></li>
                                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>50% off Foundation & Transition</span></li>
                                        </ul>
                                        <button
                                            onClick={() => navigate('/become-member')}
                                            className="mt-auto w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-full transition-colors"
                                        >
                                            Get Annual Plan
                                        </button>
                                    </div>

                                    {/* Lets Talk */}
                                    <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm flex flex-col h-full">
                                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Lets Talk</h3>
                                        <p className="text-sm text-slate-600 mb-4">Join our elite members of pilots to gain opportunities, including internships and operations experience with partnered airlines—plus ambassador status, standard verification onboarding, and Foundation Program enrollment.</p>
                                        <Link
                                            to="/recognition-plus/livetalk"
                                            className="text-blue-600 hover:text-blue-700 underline text-sm font-semibold mb-4 inline-block"
                                        >
                                            Learn more
                                        </Link>
                                        <ul className="space-y-2 mb-6 text-left text-sm text-slate-700">
                                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>Scholarships</span></li>
                                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>Associate member eligibility to be promoted as Ambassador of Association</span></li>
                                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>Internships opportunities</span></li>
                                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>Operations opportunities</span></li>
                                        </ul>
                                        <button
                                            onClick={() => navigate('/become-member')}
                                            className="mt-auto w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-full transition-colors"
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-10 text-center">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Choose Your Plan.</h2>
                                    <p className="text-xl md:text-2xl font-bold text-red-600 mb-6">For Operators</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Operator Free Tier Card */}
                                        <div className="w-full bg-slate-100 rounded-xl p-8 text-center border border-slate-200 shadow-sm flex flex-col h-full">
                                            <h3 className="text-xl font-bold text-slate-700 mb-2">Free Operator Access</h3>
                                            <p className="text-3xl font-bold text-slate-700 mb-1">$0<span className="text-lg font-normal text-slate-500">/year</span></p>
                                            <p className="text-sm text-slate-500 mb-2">Access verified pilot profiles for operations</p>

                                            <ul className="space-y-2 mt-2 mb-6 text-left text-sm text-slate-600">
                                                <li className="flex items-start gap-2"><span className="text-slate-400 font-bold">✓</span><span>Basic search & profile visibility</span></li>
                                                <li className="flex items-start gap-2"><span className="text-slate-400 font-bold">✓</span><span>Limited pathway pool access</span></li>
                                                <li className="flex items-start gap-2"><span className="text-slate-400 font-bold">—</span><span>Advanced eligibility filtering & notifications (Plus)</span></li>
                                            </ul>

                                            <button
                                                onClick={() => navigate('/become-member')}
                                                className="mt-auto w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-full transition-colors"
                                            >
                                                Get Started
                                            </button>
                                        </div>

                                        {/* Enterprise Operator Card */}
                                        <div className="w-full bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm flex flex-col h-full">
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise Operator</h3>
                                            <p className="text-sm text-slate-600 mb-2">Custom pricing</p>
                                            <p className="text-3xl font-bold text-slate-700 mb-1">
                                                Contact<span className="text-lg font-normal text-slate-500"> us</span>
                                            </p>

                                            <ul className="space-y-2 mt-2 mb-6 text-left text-sm text-slate-700">
                                                <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>Advanced eligibility filtering & profile insights</span></li>
                                                <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>Team access & admin controls</span></li>
                                                <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✓</span><span>Dedicated onboarding & operations workflow setup</span></li>
                                            </ul>

                                            <button
                                                onClick={() => navigate('/contact-support')}
                                                className="mt-auto w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-full transition-colors"
                                            >
                                                Talk to Enterprise
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Partnerships */}
                                <div className="mt-12 text-center">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Partnerships</h2>
                                    <p className="text-slate-600 text-sm mb-6 max-w-2xl mx-auto">
                                        Partner with PilotRecognition to support the mission behind PilotShortage.org—helping solve pilot shortages with priority access, streamlined verification, and operations-ready pathways.
                                    </p>

                                    <div className="mx-auto w-full max-w-4xl bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-left">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Become a Key Partnerships Member</h3>
                                        <p className="text-slate-600 text-sm mb-6">
                                            Partnership benefits include priority over enterprise members, plus integrated onboarding through verified pilot data.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                                <p className="font-bold text-slate-900 text-sm mb-1">Team Controls</p>
                                                <p className="text-slate-600 text-sm">Admin access and team-level management for partner workflows.</p>
                                            </div>
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                                <p className="font-bold text-slate-900 text-sm mb-1">Internship & Operations Provider</p>
                                                <p className="text-slate-600 text-sm">Opportunities connecting partner pathways with operations-ready progression.</p>
                                            </div>
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                                <p className="font-bold text-slate-900 text-sm mb-1">Verification Issuer of Hours</p>
                                                <p className="text-slate-600 text-sm">Support verified hours and credentials that pilots can present with confidence.</p>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                                            <button
                                                onClick={() => navigate('/partnerships/onboarding')}
                                                className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-full transition-colors"
                                            >
                                                Become a Partner
                                            </button>

                                            <a
                                                href="https://enterprise.pilotrecognition.com/ucf/official-release"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full sm:w-auto inline-flex justify-center bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold py-3 px-6 rounded-full transition-colors"
                                            >
                                                Refer UCF Official Release
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-center text-slate-500 text-sm mt-10">Cancel anytime. No hidden fees. Free trial included.</p>
                            </div>
                        </section>

                    </div>
                </div>
            </section>

            {/* ─── FEATURE COMPARISON TABLE ─── */}
            <section id="features" className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Compare Plans</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Choose Your Tier.</h2>
                    <p className="text-slate-600 text-lg max-w-2xl mb-10">See exactly what you get at each level — from free essentials to premium career acceleration.</p>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs md:text-sm">
                                <thead>
                                    <tr>
                                        <th className="text-left py-4 px-4 font-bold text-slate-900 bg-slate-50 border-b border-slate-200 w-1/2">Feature</th>
                                        <th className="text-center py-4 px-4 font-bold text-slate-600 bg-slate-50 border-b border-slate-200">
                                            <div>Free</div>
                                            <div className="text-slate-400 font-normal text-[10px] mt-0.5">$0</div>
                                        </th>
                                        <th className="text-center py-4 px-4 font-bold text-red-600 bg-red-50 border-b border-red-200">
                                            <div>Recognition+ Verified</div>
                                            <div className="text-red-400 font-normal text-[10px] mt-0.5">$100 / year</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { feature: 'Live real-time profile', free: '—', verified: '✓ Updates when you log hours' },
                                        { feature: 'Recognition Score', free: 'Visible, no badge', verified: '✓ Recognition+ Verified badge' },
                                        { feature: 'Veremark background check', free: '—', verified: '✓ Screened & verified' },
                                        { feature: 'Profile in airline pulling system', free: 'General pool', verified: 'Top of ranked shortlist (background checked)' },
                                        { feature: 'Airline filters you by', free: '—', verified: 'Veremark status, score, recency, type rating, hours' },
                                        { feature: 'Pathway interest submissions', free: '2 / month', verified: 'Unlimited' },
                                        { feature: 'Profile comparisons', free: '3 / month', verified: 'Unlimited' },
                                        { feature: 'Recognition AI', free: '5 chats / month (basic)', verified: '✓ Extended — live type rating, airline & pathway data' },
                                        { feature: 'Atlas CV', free: 'Standard (no screening)', verified: 'Upload + Veremark screened, visible to airlines' },
                                        { feature: 'EBT CBTA Interview', free: '1–2 months after Foundation', verified: '✓ Fast-track (skip the queue)' },
                                        { feature: 'Program discounts', free: '—', verified: '50% off Foundation & Transition' },
                                        { feature: 'Price', free: 'Free', verified: '$100 / year', isPrice: true },
                                    ].map((row, i) => (
                                        <tr key={i} className={`border-b border-slate-100 hover:bg-slate-50/60 transition-colors ${row.isPrice ? 'bg-slate-50 font-bold' : ''}`}>
                                            <td className="py-3 px-4 text-slate-800 font-semibold">{row.feature}</td>
                                            <td className="py-3 px-4 text-center text-slate-500">{row.free}</td>
                                            <td className="py-3 px-4 text-center text-red-600 font-medium bg-red-50/30">{row.verified}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Link
                            to="/recognition-plus-comparison"
                            className="block text-center text-blue-600 hover:text-blue-700 text-sm font-bold underline py-4 bg-slate-50"
                        >
                            View full comparison →
                        </Link>
                    </div>
                </div>
            </section>



            {/* ─── FEATURE DEEP-DIVES ─── */}
            {FEATURES.map((feat, idx) => (
                <section key={feat.id} id={feat.id} className={`py-16 px-6 border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-12 gap-10">
                            {/* Left: intro */}
                            <div className="lg:col-span-5">
                                <p className={`text-[11px] uppercase tracking-[0.25em] font-semibold mb-3 ${COLOR_CLASSES[feat.color]?.eyebrow ?? 'text-red-600'}`}>{feat.label}</p>
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5 text-slate-900">{feat.tagline}</h2>

                                <div className={`${COLOR_CLASSES[feat.color]?.bg ?? 'bg-red-50'} border ${COLOR_CLASSES[feat.color]?.border ?? 'border-red-200'} rounded-xl p-4 mb-5`}>
                                    <p className={`${COLOR_CLASSES[feat.color]?.eyebrow ?? 'text-red-600'} text-[10px] uppercase tracking-widest font-bold mb-2`}>The Problem</p>
                                    <p className="text-slate-700 text-sm leading-relaxed">{feat.pain}</p>
                                </div>

                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
                                    <p className="text-emerald-700 text-[10px] uppercase tracking-widest font-bold mb-2">Our Solution</p>
                                    <p className="text-slate-700 text-sm leading-relaxed">{feat.solution}</p>
                                </div>
                            </div>

                            {/* Right: benefits + pilots */}
                            <div className="lg:col-span-7 space-y-6">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">What you get</p>
                                    <ul className="grid sm:grid-cols-2 gap-3">
                                        {feat.benefits.map((b: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${COLOR_CLASSES[feat.color]?.badge ?? 'bg-red-100 text-red-700'}`}>
                                                    <span className="text-xs">✓</span>
                                                </div>
                                                <p className="text-slate-700 text-sm leading-relaxed">{b}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6">
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">For Pilots</p>
                                    <ul className="space-y-3">
                                        {feat.pilots.map((p: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                                <p className="text-slate-700 leading-relaxed">{p}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* ─── FAQ SECTION ─── */}
            <section className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-4xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">FAQ</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 text-center">Frequently Asked Questions.</h2>

                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Is Recognition Plus worth the investment?</h3>
                            <p className="text-slate-700">Absolutely. Professional pilots value these features at over $100 annually. For $99/year, you get AI-powered career guidance, priority access to hiring surges, interview fast-track, OEM-aligned profiles, and 24/7 compliance monitoring. The faster hiring and better opportunities alone can save you months of job searching and thousands in lost income.</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">How does the AI Career Strategist work?</h3>
                            <p className="text-slate-700">Our AI continuously analyzes your profile against real-time industry data from airlines and manufacturers. It alerts you when you're close to qualifying for specific roles and provides exact requirements. For example: "You need 12 more flight hours on A320 to qualify for Emirates First Officer." It recommends optimal pathways based on your career goals.</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">What is the Priority Pipeline?</h3>
                            <p className="text-slate-700">When operators review pathway pools, Recognition Plus members appear first due to AI-ranked priority. During partner hiring surges, you receive interview fast-track access, skipping initial screening stages. This time advantage can be the difference between landing your dream job and missing the opportunity.</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Can I cancel anytime?</h3>
                            <p className="text-slate-700">Yes. You can cancel your Recognition Plus subscription at any time with no penalties. Your profile and data will be preserved, and you can continue using the free tier features. Many pilots find the value so compelling they never cancel.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── STRATEGIC PARTNERSHIPS ─── */}
            <section className="py-16 px-6 border-b border-slate-200 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">GROWTH</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Strategic Partnerships.</h2>
                    <p className="text-slate-600 text-lg max-w-3xl mb-10">
                        Partnerships are built to serve <span className="font-semibold text-slate-900">pilots</span> with verified momentum,
                        and to serve <span className="font-semibold text-slate-900">industry stakeholders</span> (schools, airlines, investors) with reliable data and scalable pathways.
                    </p>

                    {/* For Pilots */}
                    <div className="mb-6">
                        <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-slate-500 mb-3">For Pilots</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Recognition & Industry Networking (Pilots) */}
                            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-lg">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Recognition + Networking</h3>
                                <p className="text-slate-600 text-sm text-center mb-4">Target: Pilot connections & verified introductions</p>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    Use your Recognition membership to stay industry-visible—so <span className="font-semibold">you</span> get matched with the right opportunities and are introduced with verified, operations-ready context.
                                </p>
                            </div>

                            {/* Associate Ambassador Titleship */}
                            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-lg">
                                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Ambassador Titleship</h3>
                                <p className="text-slate-600 text-sm text-center mb-4">Target: Associate ambassador pipeline</p>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    Earn your place as an associate ambassador—so <span className="font-semibold">you</span> build credibility, receive prioritization, and grow your leadership standing inside the aviation network.
                                </p>
                            </div>

                            {/* Internship & Experience */}
                            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-lg">
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Internship Experience</h3>
                                <p className="text-slate-600 text-sm text-center mb-4">Target: Internship + operations-ready placements</p>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    Convert your Recognition progress into hands-on internship experience—so <span className="font-semibold">you</span> strengthen your operational readiness and gain practical visibility with partnered airlines.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/recognition-plus/livetalk')}
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-full transition-colors"
                            >
                                Lets Talk
                            </button>
                        </div>
                    </div>

                    {/* For Industry Stakeholders */}
                    <div className="mt-8">
                        <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-slate-500 mb-3">For Aviation Industry Stakeholders</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Flight School Partnerships (Stakeholders) */}
                            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-lg">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Flight School Partnerships</h3>
                                <p className="text-slate-600 text-sm text-center mb-4">Target: 2-3 flight schools</p>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    Feed verified learner data into PilotRecognition so schools can support placement outcomes and pilots can demonstrate readiness reliably.
                                </p>
                            </div>

                            {/* Airline Partnerships (Stakeholders) */}
                            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-lg">
                                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Airline Partnerships</h3>
                                <p className="text-slate-600 text-sm text-center mb-4">Target: 1 airline pilot program</p>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    Access pre-vetted pilots with verified competencies and OEM-aligned profiles—backed by a clear, trackable pipeline to interview readiness.
                                </p>
                            </div>

                            {/* Investor Readiness (Stakeholders) */}
                            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-lg">
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Investor Readiness</h3>
                                <p className="text-slate-600 text-sm text-center mb-4">Target: 100-500 pilot subscribers</p>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    Build sustainable traction through organic growth—creating measurable, scalable recurring revenue driven by pilot adoption and stakeholder trust.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/contact-support')}
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-full transition-colors"
                            >
                                Lets Talk
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── BOTTOM SECTION ─── */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-slate-400 mb-2">PILOTRECOGNITION.COM</p>
                    <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-red-600 mb-4">RECOGNITION PLUS</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
                        AI-Powered Career Acceleration: Your Competitive Edge in Aviation
                    </h2>
                    <p className="text-xl font-medium text-slate-700 italic mb-10">
                        Premium Recognition for Professional Pilots Worth $100/Year
                    </p>

                    <div className="space-y-6 mb-10">
                        <p className="text-slate-600 leading-relaxed">
                            Recognition Plus transforms your pilot career from reactive to proactive. In an industry where timing is everything and opportunities are scarce, Recognition Plus gives you the AI-powered insights, verified credentials, and priority access that put you at the front of the line when airlines hire.
                        </p>
                        {!isFeaturesExpanded && (
                            <button
                                onClick={() => setIsFeaturesExpanded(true)}
                                className="text-sm font-bold tracking-wide uppercase text-red-600 hover:text-red-700 transition-colors flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-white border-2 border-red-600 rounded-lg"
                            >
                                READ MORE <ChevronDown className="w-4 h-4" />
                            </button>
                        )}
                        {isFeaturesExpanded && (
                            <>
                                <p className="text-slate-600 leading-relaxed">
                                    Our Recognition AI system continuously monitors your profile, flight hours, type ratings, and certifications against real-time industry data. When you're 12 flight hours away from qualifying for a specific airline role, the AI alerts you with exact requirements and actionable steps.
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    The Priority Access feature ensures that when operators review pathway pools, your profile appears first. During partner hiring surges, Recognition Plus members receive interview fast-track access, skipping initial screening stages that can take weeks.
                                </p>
                                <button
                                    onClick={() => setIsFeaturesExpanded(false)}
                                    className="text-sm font-bold tracking-wide uppercase text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-2 mx-auto"
                                >
                                    SHOW LESS <ChevronDown className="w-4 h-4 rotate-180" />
                                </button>
                            </>
                        )}
                    </div>

                    <Link
                        to="/recognition-plus-comparison"
                        className="text-sm font-bold tracking-wide uppercase text-red-600 hover:text-red-700 transition-colors flex items-center justify-center gap-2 group"
                    >
                        VIEW FULL COMPARISON <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="bg-white border-t border-slate-200 py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                            <span className="text-slate-900">Pilot</span><span className="text-red-600">Recognition</span>
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm">&copy; 2024 PilotRecognition. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
