import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface EmergingAirTaxiPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const EmergingAirTaxiPage: React.FC<EmergingAirTaxiPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Emerging Air Taxi Sector
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Pathways Into the Next Generation of Urban Air Mobility
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        Built for pilots under 1,000 hours who feel stuck in the gap, Wing Mentor&apos;s Emerging Air Taxi
                        pathway connects you to the first wave of eVTOL and advanced air mobility operators – before
                        traditional airline hours become your only option.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
                {/* Section 1 - Intro: What is Air Taxi? */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            The Future of Short-Haul
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Faster, Cleaner, Smarter Travel
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Air Taxis are revolutionizing short domestic travel. Imagine turning a 48-minute drive through city congestion into a 5-minute flight. These electric vertical takeoff and landing (eVTOL) aircraft offer a streamlined rapid-transit solution that is quieter, cleaner, and significantly cheaper than traditional helicopter services in terms of hourly operational rates.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            This isn't just about speed; it's a strategic infrastructure shift designed to decongest modern cities and connect communities like never before.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="relative w-full max-w-md mx-auto">
                            <img
                                src="https://lh3.googleusercontent.com/d/1XcRDW3p9C965siBjl5HsTXDHaQZJ-Ona"
                                alt="Emerging Air Taxi Sector"
                                className="w-full rounded-3xl shadow-lg object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2 – Who This Pathway Is For (Updated) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            For Pilots Under 1,000 Hours
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Targeting the Gap with Archer & Industry Leaders
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            WingMentor has engaged directly with industry leaders like <strong>Archer</strong> and <strong>MLG</strong> at the <strong>Aviation Career Fair at the Etihad Museum</strong> regarding their pilot recruitment strategy. They have stated a clear interest in a specific profile: pilots with <strong>below 1,000 hours</strong> who possess "decent experience" and high-quality training standards.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            This pathway is designed to bridge that exact gap. It helps you position your existing CPL/IR skills to meet this specific demand, turning your supposedly "low time" into the exact sweet spot for the next generation of flight operations.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="relative w-full max-w-md mx-auto">
                            <img
                                src="https://lh3.googleusercontent.com/d/1aTWWTtFwIMCrrU9HnCtWdUPTGhvWk6Yi"
                                alt="Air Taxi Pilot Pathways"
                                className="w-full rounded-3xl shadow-lg object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2 – Industry Players & Roles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="md:pr-8">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Archer, Joby & Beyond
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            A Sector That Publicly Admits It Needs Pilots
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Wing Mentor tracks announcements and demand signals from leading air taxi manufacturers such as
                            Archer and Joby – companies who have openly highlighted the need for pilots in the sub‑1,000
                            hour band. We map which roles are likely to appear first: test operations, early route proving,
                            and initial commercial services.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Through our network and Pilot Gap Forum, you gain practical intelligence on where these
                            opportunities are emerging, what profiles they favor, and how to align your training roadmap
                            today for roles that may open over the next 12–36 months.
                        </p>
                    </div>
                    <div className="md:pl-8">
                        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Example Roles in the Emerging Sector
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
                                <li>eVTOL line pilot and operations crew for early-stage city pairs.</li>
                                <li>Ground-based remote pilot roles for unmanned or supervised missions.</li>
                                <li>Operations & dispatch hybrids that value both flying and systems knowledge.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Section 3 – Where Drones Fit In */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Manned Skills, Unmanned Platforms
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            From Cockpit to Remote Operations
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Many emerging operators are building hybrid fleets: piloted eVTOL aircraft alongside advanced
                            drones flown from the ground. Wing Mentor helps you understand how your IFR, procedural, and CRM
                            skills transfer into these RPAS roles – so you can present yourself as more than just &quot;a
                            drone hobbyist.&quot;
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            We outline certification routes, operational approvals (including BVLOS), and how to log and
                            present this experience so it builds a future case for both air taxi and airline recruiters.
                        </p>

                        <button
                            onClick={() => onNavigate('piloted-drones')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors group"
                        >
                            Learn More about Pilotless & Automated Drones
                            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="bg-slate-900 rounded-3xl text-white p-8 space-y-4 shadow-xl">
                            <h3 className="text-lg font-semibold">
                                A Different Kind of PIC Time
                            </h3>
                            <p className="text-sm text-slate-200 leading-relaxed">
                                Remote operations demand discipline, procedures, and decision-making no different from a
                                traditional cockpit. When structured and documented correctly, this experience can become a
                                compelling part of your professional story – not a side note.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 4 – How Wing Mentor Supports You */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="md:pr-8">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Strategy, Not Just Hours
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Turning Today&apos;s Experience Into Tomorrow&apos;s Air Taxi CV
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The Emerging Air Taxi pathway is not a stand‑alone course; it is a curated combination of
                            Wing Mentor&apos;s Foundational mentoring, Transition insights, and sector‑specific intelligence
                            focused on eVTOL and advanced air mobility.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            We work with you to structure your logbook, ATLAS CV, and interview story so recruiters in this
                            new sector can clearly see how your current 300–1,000 hours translate into value on their first
                            pilot roster.
                        </p>
                    </div>
                    <div className="md:pl-8">
                        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">
                                What You Leave With
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
                                <li>Clear map of licensing and regulatory expectations for air taxi roles.</li>
                                <li>Positioning strategy for your ATPL, RPAS, or airline ambitions.</li>
                                <li>Connections into a network actively discussing and building this new market.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back button */}
            <div className="py-12 flex justify-center">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>
        </div>
    );
};

