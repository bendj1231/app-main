/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { detectRegionalPricing, formatPrice, type RegionalPrice } from '../../lib/regionalPricing';

const FEATURES = [
  {
    id: 'live-profile',
    icon: '🔄',
    label: 'Live Real-Time Profile',
    color: 'blue',
    tagline: 'Auto-updating profile that evolves with your career.',
    pain: "Traditional pilot CVs are static documents that become outdated the moment you save them. Hours flown, new type ratings, and recent experience aren't reflected in real-time, causing missed opportunities when airlines search for candidates.",
    solution:
      'Your Recognition Profile automatically syncs with your logbook and updates in real-time. As you log hours, earn new ratings, or complete training, your profile instantly reflects these achievements — making you discoverable to airlines with current, verified data.',
    benefits: [
      'Automatic logbook synchronization',
      'Real-time hours and experience updates',
      'Instant type rating verification',
      'Live career progression tracking',
      'Airline-facing profile visibility',
      'Zero manual profile maintenance',
      'Historical career data preservation',
      'Integration with major logbook apps',
    ],
    pilots: [
      'Never miss an opportunity due to outdated profile information',
      'Let airlines see your current experience instantly',
      'Eliminate manual CV updates and data entry',
    ],
  },
  {
    id: 'ai-features',
    icon: '🤖',
    label: 'Recognition AI',
    color: 'violet',
    tagline: 'AI-powered career guidance and pathway optimization.',
    pain: 'Pilots navigate their careers blindly, unsure which type ratings to pursue, which airlines are hiring, or how their profile compares to successful candidates. Career decisions are based on hearsay rather than data.',
    solution:
      "Our AI analyzes your profile against real-time industry data from airlines and manufacturers. It provides personalized pathway recommendations, alerts you when you're close to qualifying for specific roles, and suggests optimal career moves based on market demand.",
    benefits: [
      'Personalized pathway recommendations',
      'Airline-specific qualification alerts',
      'OEM-aligned competency analysis (Airbus/Boeing)',
      'Market demand forecasting',
      'Competitive profile benchmarking',
      'Career move optimization',
      'Type rating ROI analysis',
      'Hiring surge predictions',
    ],
    pilots: [
      'Make career decisions based on data, not guesswork',
      'Know exactly what qualifications you need for target airlines',
      'Stay ahead of hiring trends and market demands',
    ],
  },
  {
    id: 'priority-matching',
    icon: '⭐',
    label: 'Priority Matching',
    color: 'amber',
    tagline: 'First in line when airlines search for talent.',
    pain: "When airlines search pilot databases, free profiles are buried under hundreds of applicants. Without priority ranking, qualified pilots get overlooked simply because they're not at the top of the list.",
    solution:
      'Recognition Plus members receive AI-ranked priority placement in airline search results. When operators review pathway pools, your profile appears first based on your Recognition Score, verified competencies, and subscription status.',
    benefits: [
      'AI-ranked priority in search results',
      'First visibility in airline pulling system',
      'Hiring surge priority access',
      'Profile highlighting to recruiters',
      'Top placement in ranked shortlists',
      'Operator notification when you match',
      'Fast-track interview scheduling',
      'Priority pathway submission',
    ],
    pilots: [
      'Be seen first when airlines search for pilots',
      'Skip the queue during urgent hiring surges',
      'Get noticed by recruiters before free-tier pilots',
    ],
  },
  {
    id: 'ebt-cbta',
    icon: '🚀',
    label: 'EBT CBTA Fast-Track',
    color: 'emerald',
    tagline: 'Skip the queue for EBT/CBTA interviews.',
    pain: 'Foundation Program graduates often wait 1-2 months for EBT/CBTA interview slots. During this time, hiring opportunities pass by and candidates lose momentum in their job search.',
    solution:
      'Recognition Plus members receive fast-track access to EBT/CBTA interviews, skipping initial screening stages. This time advantage can be the difference between landing your dream job and missing the opportunity entirely.',
    benefits: [
      'Skip initial screening queues',
      'Priority interview scheduling',
      'Foundation Program fast-track',
      'Reduced waiting time for assessments',
      'Direct pathway to airline interviews',
      'Expedited competency evaluations',
      'Preferential assessment center slots',
      'Accelerated hiring pipeline',
    ],
    pilots: [
      'Get assessed faster after Foundation training',
      'Reduce time between training and employment',
      'Capitalize on urgent hiring opportunities',
    ],
  },
  {
    id: 'medical-alerts',
    icon: '🏥',
    label: 'AI Medical Alerts',
    color: 'rose',
    tagline: 'Never miss a medical renewal with automated monitoring.',
    pain: "Medical certificate expiration can ground a pilot unexpectedly. With 60/90-day validity windows and complex renewal requirements, it's easy to miss deadlines — especially when managing multiple certificates across jurisdictions.",
    solution:
      '24/7 automated monitoring tracks all your medical certificates and licenses with AI-powered alerts. Get warned 60 days before expiration with suggested Aviation Medical Examiners and open appointment slots.',
    benefits: [
      '60-day expiration warnings',
      'AME appointment suggestions',
      'Multi-jurisdiction tracking',
      'License renewal reminders',
      'Type rating recency alerts',
      'Recency requirement monitoring',
      'Auto-renewal documentation',
      'Compliance status dashboard',
    ],
    pilots: [
      'Never face unexpected grounding due to expired certificates',
      'Stay ahead of renewal deadlines with early warnings',
      'Manage multiple licenses across different authorities',
    ],
  },
  {
    id: 'program-discounts',
    icon: '💰',
    label: 'Program Discounts',
    color: 'teal',
    tagline: 'Save 25-50% on Foundation and Transition programs.',
    pain: 'Quality flight training programs cost $30,000-$100,000+. These expenses are significant barriers for pilots advancing their careers, especially when transitioning between aircraft types or upgrading to command.',
    solution:
      'Recognition Plus members receive exclusive discounts on partner training programs: 25% off Foundation and Transition programs, with savings increasing to 50% for Recognition+ Verified members. These discounts alone can offset your annual subscription cost.',
    benefits: [
      '25% off Foundation Program (Regular)',
      '25% off Transition Program (Regular)',
      '50% off Foundation Program (Verified)',
      '50% off Transition Program (Verified)',
      'Member-only training rates',
      'Partner ATO preferential pricing',
      'Type rating cost reductions',
      'Simulator session discounts',
    ],
    pilots: [
      'Save thousands on essential training programs',
      'Invest in career advancement at reduced costs',
      'Subscription pays for itself through training savings',
    ],
  },
];

const COLOR_CLASSES: Record<
  string,
  { eyebrow: string; badge: string; border: string; bg: string }
> = {
  blue: {
    eyebrow: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
  },
  violet: {
    eyebrow: 'text-violet-600',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
    border: 'border-violet-200',
    bg: 'bg-violet-50',
  },
  amber: {
    eyebrow: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
  },
  emerald: {
    eyebrow: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
  },
  rose: {
    eyebrow: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    border: 'border-rose-200',
    bg: 'bg-rose-50',
  },
  teal: {
    eyebrow: 'text-teal-600',
    badge: 'bg-teal-100 text-teal-700 border-teal-200',
    border: 'border-teal-200',
    bg: 'bg-teal-50',
  },
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
    currency: 'USD',
    symbol: '$',
    annual: 99,
    monthly: 12,
    semiAnnual: 60,
    annualNote: 'Save $45/yr vs monthly',
    locale: 'en-US',
    countryCode: 'US',
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

  const handleCheckout = async (priceId: string, planName: string, trialPeriodDays?: number) => {
    setProcessing(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          priceId,
          trialPeriodDays,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || 'Failed to create checkout session'
        );
      }

      const { url: checkoutUrl } = await response.json();
      safeRedirect(checkoutUrl);
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Failed to start checkout: ${error.message}`);
    } finally {
      setProcessing(false);
    }
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
                <p className="text-sm text-green-700">
                  Your Recognition Plus subscription is now active. Welcome aboard!
                </p>
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
                <p className="text-sm text-amber-700">
                  You cancelled the checkout. No charges were made. Feel free to try again anytime.
                </p>
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
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-sm font-medium">Home</span>
              </button>
              <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-slate-900">Pilot</span>
                  <span className="text-red-600">Recognition</span>
                </span>
                <span className="text-sm font-semibold text-slate-900 tracking-wide">Plus</span>
              </button>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {FEATURES.map((feat) => (
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileNav && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {FEATURES.map((feat) => (
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
          <div className="max-w-3xl">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors mb-4"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-sm font-medium">Back to Home</span>
            </button>
            <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">
              Premium Membership
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight">
              Pilot
              <span className="text-red-600 relative inline-block ml-2">
                Recognition
                <span className="absolute -top-2 md:-top-3 -right-2 md:-right-3 text-red-600 text-xl md:text-3xl font-bold">
                  +
                </span>
              </span>
            </h1>
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
              Unlock premium features, priority matching, and AI-powered career tools for your
              aviation journey. Join thousands of pilots accelerating their careers.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo('pricing')}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                View Plans
              </button>
              <button
                onClick={() => scrollTo('features')}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-12 pt-8 border-t border-slate-200">
            <div>
              <p className="text-3xl font-bold text-red-600 mb-1">
                {formatPrice(pricing.symbol, pricing.annual)}
              </p>
              <p className="text-sm text-red-500">Per year ({pricing.currency})</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600 mb-1">AI-Matching</p>
              <p className="text-sm text-slate-500">AI Career Tools</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600 mb-1">Priority</p>
              <p className="text-sm text-slate-500">All pathway listings</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600 mb-1">Exclusive</p>
              <p className="text-sm text-slate-500">Private Jet · eVTOL pathways</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600 mb-1">Verified</p>
              <p className="text-sm text-slate-500">Flight hours & credentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURE COMPARISON TABLE ─── */}
      <section id="features" className="py-16 px-6 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">
            Compare Plans
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Choose Your Tier.</h2>
          <p className="text-slate-600 text-lg max-w-2xl mb-10">
            See exactly what you get at each level — from free essentials to premium career
            acceleration.
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-4 font-bold text-slate-900 bg-slate-50 border-b border-slate-200 w-1/2">
                      Feature
                    </th>
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
                    {
                      feature: 'Live real-time profile',
                      free: '—',
                      verified: '✓ Updates when you log hours',
                    },
                    {
                      feature: 'Recognition Score',
                      free: 'Visible, no badge',
                      verified: '✓ Recognition+ Verified badge',
                    },
                    {
                      feature: 'Veremark background check',
                      free: '—',
                      verified: '✓ Screened & verified',
                    },
                    {
                      feature: 'Profile in airline pulling system',
                      free: 'General pool',
                      verified: 'Top of ranked shortlist (background checked)',
                    },
                    {
                      feature: 'Airline filters you by',
                      free: '—',
                      verified: 'Veremark status, score, recency, type rating, hours',
                    },
                    {
                      feature: 'Pathway interest submissions',
                      free: '2 / month',
                      verified: 'Unlimited',
                    },
                    { feature: 'Profile comparisons', free: '3 / month', verified: 'Unlimited' },
                    {
                      feature: 'Recognition AI',
                      free: '5 chats / month (basic)',
                      verified: '✓ Extended — live type rating, airline & pathway data',
                    },
                    {
                      feature: 'Atlas CV',
                      free: 'Standard (no screening)',
                      verified: 'Upload + Veremark screened, visible to airlines',
                    },
                    {
                      feature: 'EBT CBTA Interview',
                      free: '1–2 months after Foundation',
                      verified: '✓ Fast-track (skip the queue)',
                    },
                    {
                      feature: 'Program discounts',
                      free: '—',
                      verified: '50% off Foundation & Transition',
                    },
                    { feature: 'Price', free: 'Free', verified: '$100 / year', isPrice: true },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-slate-100 hover:bg-slate-50/60 transition-colors ${row.isPrice ? 'bg-slate-50 font-bold' : ''}`}
                    >
                      <td className="py-3 px-4 text-slate-800 font-semibold">{row.feature}</td>
                      <td className="py-3 px-4 text-center text-slate-500">{row.free}</td>
                      <td className="py-3 px-4 text-center text-red-600 font-medium bg-red-50/30">
                        {row.verified}
                      </td>
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

      {/* ─── PRICING CARDS ─── */}
      <section id="pricing" className="py-16 px-6 border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Choose Your Plan.</h2>
          <p className="text-slate-600 text-lg max-w-2xl mb-10">
            Start with a free trial. Upgrade to Recognition Plus for priority matching and
            AI-powered career tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-slate-100 rounded-xl p-8 text-center border border-slate-200">
              <h3 className="text-xl font-bold text-slate-700 mb-2">Free</h3>
              <p className="text-4xl font-bold text-slate-700 mb-1">
                $0<span className="text-lg font-normal text-slate-500">/year</span>
              </p>
              <p className="text-sm text-slate-500 mb-2">Basic access</p>
              <p className="text-xs text-slate-400 mb-6 font-semibold">Get started today</p>
              <ul className="space-y-2 mb-6 text-left text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">✓</span>
                  <span>Basic profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">✓</span>
                  <span>2 pathway submissions/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">✓</span>
                  <span>3 profile comparisons/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">✓</span>
                  <span>5 AI chats/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">✓</span>
                  <span>General pool visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">—</span>
                  <span className="text-slate-400">Priority matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">—</span>
                  <span className="text-slate-400">Exclusive pathways</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">—</span>
                  <span className="text-slate-400">Verified credentials</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/become-member')}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-full transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* Annual Plan - Best Value */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-8 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                Best Value
              </div>
              <h3 className="text-xl font-bold text-white mb-2 mt-2">Recognition+ Verified</h3>
              <p className="text-4xl font-bold text-white mb-1">
                {formatPrice(pricing.symbol, pricing.annual)}
                <span className="text-lg font-normal text-red-200">/year</span>
              </p>
              <p className="text-sm text-red-200 mb-2">Annual membership</p>
              <p className="text-xs text-red-300 mb-6 font-semibold">✓ 3-day free trial</p>
              <ul className="space-y-2 mb-6 text-left text-sm text-white">
                <li className="flex items-start gap-2">
                  <span className="text-red-200 font-bold">✓</span>
                  <span>Full profile comparison</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-200 font-bold">✓</span>
                  <span>Unlimited pathway submissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-200 font-bold">✓</span>
                  <span>Priority matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-200 font-bold">✓</span>
                  <span>AI career strategist</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-200 font-bold">✓</span>
                  <span>EBT CBTA Fast-Track</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-200 font-bold">✓</span>
                  <span>Exclusive pathways (Private Jet, eVTOL)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-200 font-bold">✓</span>
                  <span>Verified flight hours & credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-200 font-bold">✓</span>
                  <span>50% off Foundation & Transition</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/become-member')}
                className="w-full bg-white hover:bg-red-50 text-red-700 font-bold py-3 rounded-full transition-colors"
              >
                Get Annual Plan
              </button>
            </div>
          </div>
          <p className="text-center text-slate-500 text-sm mt-8">
            Cancel anytime. No hidden fees. Free trial included.
          </p>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="py-16 px-6 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Everything Included.
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mb-10">
            Explore the premium features that accelerate your aviation career.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feat) => (
              <button
                key={feat.id}
                onClick={() => scrollTo(feat.id)}
                className="group text-left bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md"
              >
                <div className="text-3xl mb-3">{feat.icon}</div>
                <h3 className="text-slate-900 font-semibold text-lg mb-1.5 group-hover:text-red-600 transition-colors">
                  {feat.label}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feat.tagline}</p>
                <p className="mt-4 text-red-600 text-xs font-semibold flex items-center gap-1">
                  Learn more{' '}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURE DEEP-DIVES ─── */}
      {FEATURES.map((feat, idx) => (
        <section
          key={feat.id}
          id={feat.id}
          className={`py-16 px-6 border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-10">
              {/* Left: intro */}
              <div className="lg:col-span-5">
                <p
                  className={`text-[11px] uppercase tracking-[0.25em] font-semibold mb-3 ${COLOR_CLASSES[feat.color]?.eyebrow ?? 'text-red-600'}`}
                >
                  {feat.label}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5 text-slate-900">
                  {feat.tagline}
                </h2>

                <div
                  className={`${COLOR_CLASSES[feat.color]?.bg ?? 'bg-red-50'} border ${COLOR_CLASSES[feat.color]?.border ?? 'border-red-200'} rounded-xl p-4 mb-5`}
                >
                  <p
                    className={`${COLOR_CLASSES[feat.color]?.eyebrow ?? 'text-red-600'} text-[10px] uppercase tracking-widest font-bold mb-2`}
                  >
                    The Problem
                  </p>
                  <p className="text-slate-700 text-sm leading-relaxed">{feat.pain}</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
                  <p className="text-emerald-700 text-[10px] uppercase tracking-widest font-bold mb-2">
                    Our Solution
                  </p>
                  <p className="text-slate-700 text-sm leading-relaxed">{feat.solution}</p>
                </div>
              </div>

              {/* Right: benefits + pilots */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">
                    What you get
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {feat.benefits.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-3"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${COLOR_CLASSES[feat.color]?.badge ?? 'bg-red-100 text-red-700'}`}
                        >
                          <span className="text-xs">✓</span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{b}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">
                    For Pilots
                  </p>
                  <ul className="space-y-3">
                    {feat.pilots.map((p, i) => (
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
          <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 text-center">
            Frequently Asked Questions.
          </h2>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Is Recognition Plus worth the investment?
              </h3>
              <p className="text-slate-700">
                Absolutely. Professional pilots value these features at over $100 annually. For
                $99/year, you get AI-powered career guidance, priority access to hiring surges,
                interview fast-track, OEM-aligned profiles, and 24/7 compliance monitoring. The
                faster hiring and better opportunities alone can save you months of job searching
                and thousands in lost income.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                How does the AI Career Strategist work?
              </h3>
              <p className="text-slate-700">
                Our AI continuously analyzes your profile against real-time industry data from
                airlines and manufacturers. It alerts you when you're close to qualifying for
                specific roles and provides exact requirements. For example: "You need 12 more
                flight hours on A320 to qualify for Emirates First Officer." It recommends optimal
                pathways based on your career goals.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                What is the Priority Pipeline?
              </h3>
              <p className="text-slate-700">
                When operators review pathway pools, Recognition Plus members appear first due to
                AI-ranked priority. During partner hiring surges, you receive interview fast-track
                access, skipping initial screening stages. This time advantage can be the difference
                between landing your dream job and missing the opportunity.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-700">
                Yes. You can cancel your Recognition Plus subscription at any time with no
                penalties. Your profile and data will be preserved, and you can continue using the
                free tier features. Many pilots find the value so compelling they never cancel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STRATEGIC PARTNERSHIPS ─── */}
      <section className="py-16 px-6 border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">
            Growth
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Strategic Partnerships.
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mb-10">
            Building relationships across the aviation ecosystem to create comprehensive value for
            pilots, schools, airlines, and investors.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">
                Investor Readiness
              </h3>
              <p className="text-slate-600 text-sm text-center mb-4">
                Target: 100-500 pilot subscribers
              </p>
              <p className="text-slate-700 text-sm leading-relaxed">
                Building investor readiness traction through organic growth. Recognition Plus
                subscriptions at $99/year create sustainable recurring revenue that scales with our
                user base.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">
                Flight School Partnerships
              </h3>
              <p className="text-slate-600 text-sm text-center mb-4">Target: 2-3 flight schools</p>
              <p className="text-slate-700 text-sm leading-relaxed">
                Partner flight schools refer graduating students to PilotRecognition, where they
                build professional profiles and access career pathways. Schools receive placement
                tracking and career services enhancement.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-lg">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">
                Airline Partnerships
              </h3>
              <p className="text-slate-600 text-sm text-center mb-4">
                Target: 1 airline pilot program
              </p>
              <p className="text-slate-700 text-sm leading-relaxed">
                Recognition Plus members receive priority consideration for hiring opportunities.
                Airlines gain access to pre-vetted pilots with verified competencies and OEM-aligned
                profiles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM SECTION ─── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-slate-400 mb-2">
            PILOTRECOGNITION.COM
          </p>
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-red-600 mb-4">
            RECOGNITION PLUS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
            AI-Powered Career Acceleration: Your Competitive Edge in Aviation
          </h2>
          <p className="text-xl font-medium text-slate-700 italic mb-10">
            Premium Recognition for Professional Pilots Worth $100/Year
          </p>

          <div className="space-y-6 mb-10">
            <p className="text-slate-600 leading-relaxed">
              Recognition Plus transforms your pilot career from reactive to proactive. In an
              industry where timing is everything and opportunities are scarce, Recognition Plus
              gives you the AI-powered insights, verified credentials, and priority access that put
              you at the front of the line when airlines hire.
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
                  Our Recognition AI system continuously monitors your profile, flight hours, type
                  ratings, and certifications against real-time industry data. When you're 12 flight
                  hours away from qualifying for a specific airline role, the AI alerts you with
                  exact requirements and actionable steps.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  The Priority Access feature ensures that when operators review pathway pools, your
                  profile appears first. During partner hiring surges, Recognition Plus members
                  receive interview fast-track access, skipping initial screening stages that can
                  take weeks.
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
            VIEW FULL COMPARISON{' '}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              <span className="text-slate-900">Pilot</span>
              <span className="text-red-600">Recognition</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; 2026 PilotRecognition. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
