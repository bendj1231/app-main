import React from 'react';

interface PlatformFoundationalProgramPageProps {
    onNavigate: (page: string) => void;
}

export const PlatformFoundationalProgramPage: React.FC<PlatformFoundationalProgramPageProps> = ({
    onNavigate
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">

            {/* Header Section */}
            <div className="pt-10 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="WingMentor Logo"
                        className="block mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Building Your Foundation
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Foundational Program
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        Leadership skills, verifiable experience, and industry-recognized accreditation supported by AIRBUS, Etihad & Archer.
                    </p>

                    <button
                        onClick={() => onNavigate('foundational-verification')}
                        className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all hover:-translate-y-1"
                    >
                        Access / Verify Eligibility
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">

                {/* Section 1 – IDENTIFICATION: What is the Foundational Program? */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Identification
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            What is the Foundational Program?
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The <strong>Foundational Program</strong> is a comprehensive professional development initiative designed for <strong>recent graduates and ongoing pilots</strong> seeking to establish credibility and leadership skills in the aviation industry.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Unlike traditional flight training that focuses solely on technical skills, this program develops the <strong>professional competencies, verifiable credentials, and industry recognition</strong> that set you apart from other pilots at the same experience level.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="relative w-full max-w-md mx-auto">
                            <img
                                src="https://lh3.googleusercontent.com/d/1K2CccSObEUsvy6unD8iqWjSjn-Zcw08g"
                                alt="Foundational Program"
                                className="w-full rounded-3xl shadow-lg object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2 – PURPOSE: Build Credibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="md:pr-8">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Purpose
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Build Credibility
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The primary purpose of the Foundational Program is to <strong>build verifiable credibility</strong> that distinguishes you as a professional pilot with proven competencies, not just flight hours.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Through industry-recognized accreditation from AIRBUS, Etihad Airways, and Archer Aviation, you gain credentials that are trusted by airlines and operators worldwide, giving you a competitive advantage in a crowded market.
                        </p>
                    </div>
                    <div className="md:pl-8">
                        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">
                                What Credibility Unlocks
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
                                <li>Verifiable experience with digital signatures and timestamps</li>
                                <li>Industry recognition from AIRBUS, Etihad & Archer</li>
                                <li>Global acceptance across UAE, UK, Philippines, Mauritius, Germany</li>
                                <li>Competitive edge over pilots with only flight hours</li>
                                <li>Professional network and industry connections</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Section 3 – INTENT: Flight Instructor Mindset, Mentorship, Leadership */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Intent
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            What You'll Develop
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The Foundational Program is intentionally designed to prepare you for <strong>multiple career pathways</strong> by developing the core competencies that define professional aviators.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Whether you're targeting Flight Instructor roles, building time toward airline minimums, or preparing for the Transition Program, this foundation gives you the skills and mindset that airlines actively seek.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="bg-slate-900 rounded-3xl text-white p-8 space-y-4 shadow-xl">
                            <h3 className="text-lg font-semibold">
                                Program Intent & Outcomes
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-200">
                                <li>
                                    <strong className="text-white">Flight Instructor Mindset:</strong> Teaching methodologies, student management, and instructional best practices for CFI/CFII roles.
                                </li>
                                <li>
                                    <strong className="text-white">Mentorship Training:</strong> Learn to guide, support, and develop other pilots—critical for instructors and First Officer candidates.
                                </li>
                                <li>
                                    <strong className="text-white">Leadership Development:</strong> Decision-making, communication, and crew resource management skills for professional operations.
                                </li>
                                <li>
                                    <strong className="text-white">Transition Program Eligibility:</strong> Gain insights into airline expectations, EBT/CBTA competencies, and career pathway planning.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Section 4 – Industry Recognition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="md:pr-8">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Industry Accreditation
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Supported by Industry Leaders
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The Foundational Program is supported and recognized by leading aviation organizations, giving your professional development industry-wide credibility.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            <strong>WingMentor was recognized at the first Aviation Career Fair at Etihad Museum</strong>, demonstrating our commitment to industry collaboration and pilot development.
                        </p>
                    </div>
                    <div className="md:pl-8">
                        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Accreditation Partners
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
                                <li><strong>AIRBUS:</strong> Alignment with EBT/CBTA competency frameworks</li>
                                <li><strong>Etihad Airways:</strong> Recognition from a world premier airline</li>
                                <li><strong>Archer Aviation:</strong> Positioning for eVTOL and air taxi opportunities</li>
                            </ul>
                            <div className="pt-4">
                                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                                    Regions Available
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    <span className="text-2xl" aria-label="United Arab Emirates">🇦🇪</span>
                                    <span className="text-2xl" aria-label="United Kingdom">🇬🇧</span>
                                    <span className="text-2xl" aria-label="Philippines">🇵🇭</span>
                                    <span className="text-2xl" aria-label="Mauritius">🇲🇺</span>
                                    <span className="text-2xl" aria-label="Germany">🇩🇪</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 5 – Getting Started */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Your Next Step
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Build Your Foundation Today
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Don't just accumulate hours—build <strong>verifiable credibility, leadership skills, and industry recognition</strong> that will set you apart throughout your entire aviation career.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Join the WingMentor Foundational Program and gain the professional development that accelerates your path to Flight Instructor roles and airline careers.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-6">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Ready to Stand Out?
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Contact us to learn more about the Foundational Program and how it can accelerate your aviation career.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => onNavigate('contact-support')}
                                    className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg"
                                >
                                    Contact Us to Get Started
                                </button>
                                <button
                                    onClick={() => onNavigate('transition-program')}
                                    className="w-full px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg border-2 border-slate-200"
                                >
                                    Explore Transition Program
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
