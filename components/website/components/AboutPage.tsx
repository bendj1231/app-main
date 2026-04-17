import React from 'react';
import { ArrowLeft, Mail, Users, Shield } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface AboutPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section - matching the Membership & Apps Support style */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        About the WingMentor Program
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Guiding Pilots Through the Gap
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        WingMentor bridges the low-timer gap through structured programs, industry-aligned apps, and a verified pilot
                        database that creates real pathways for pilots, operators, and ATOs—before major investments are made.
                    </p>
                </div>
            </div>

            {/* WingMentor Foundational Program - magazine layout */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
                {/* Row 1: text left, image right */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Foundational Program
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            WingMentor Foundational Program
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The WingMentor Foundational Program is where every journey with us begins—the literal foundation of our
                            pilot organization. It is a guided runway that takes you from “I have a license” to “I understand what
                            operators and ATOs actually expect from me in the next 6–24 months.”
                        </p>
                        <ul className="mt-2 space-y-2 text-base text-slate-700 list-disc list-inside md:list-outside md:pl-5 text-left">
                            <li>Structured mentoring blocks covering standards, mindset, and professional communication.</li>
                            <li>Guidance on realistic timelines, investment decisions, and alternate pathways beyond airlines only.</li>
                            <li>CV and ATLAS profile support built around manufacturer and operator expectations.</li>
                            <li>Intro to our apps and tools so you brief, plan, and debrief like the flight deck you are aiming for.</li>
                        </ul>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full max-w-md mx-auto">
                            <img
                                src="/images/foundational-program.png"
                                alt="WingMentor Foundational Program"
                                className="w-full rounded-3xl shadow-lg object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Row 2: image left, text right */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            For Operators &amp; ATOs
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            A Program and Database That Work for You
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            While the Foundational Program supports pilots, it is also built with operators and ATOs in mind. Every
                            module, briefing, and debrief is designed so that graduates think and perform closer to your SOPs from day
                            one.
                        </p>
                        <ul className="mt-2 space-y-2 text-base text-slate-700 list-disc list-inside md:list-outside md:pl-5 text-left">
                            <li>Pilots arrive pre‑mentored on EBT, CRM, and professional behaviors you already assess.</li>
                            <li>
                                Our verified database lets you search by experience band, region, fleet goals, and program progress.
                            </li>
                            <li>Faster shortlisting with candidates whose expectations and readiness are already aligned to your entry level.</li>
                            <li>Lower training risk by seeing a clearer picture of a pilot&apos;s journey before they reach your sim or interview.</li>
                        </ul>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full max-w-md mx-auto">
                            <img
                                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1600"
                                alt="Operators reviewing WingMentor pilot profiles"
                                className="w-full rounded-3xl shadow-lg object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Programs and database for operators & ATOs */}
            <div className="pb-4 px-6 max-w-4xl mx-auto text-center">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                    Programs, Operators &amp; ATOS
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                    Built for Both Pilots and Industry Partners
                </h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-3">
                    Our foundational and advanced mentoring tracks are structured around real fleet needs: evidence‑based training,
                    modern CRM, and the behaviors operators actually assess in interview and simulator profiles. Pilots move through a
                    clear program roadmap, while operators and ATOs see candidates who already think and brief the way their SOPs
                    require.
                </p>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                    Behind the scenes, the WingMentor database does a lot of the heavy lifting. It allows us—and our partner
                    operators and ATOs—to search by experience level, region, aircraft goals, and program progress so that the right
                    pilots are matched to the right opportunities at the right time.
                </p>
            </div>

            {/* Contact information in the same style as the support page */}
            <div className="py-8 px-6 max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Programs &amp; Apps Support
                    </p>
                    <p className="text-base md:text-lg text-slate-700 max-w-2xl mx-auto">
                        For questions about the WingMentor program, membership, or apps, reach out to us below and our founders or
                        team will respond directly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
                    {/* Email Contacts */}
                    <div className="p-10 bg-slate-50 rounded-3xl border border-slate-100 space-y-8">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto md:mx-0">
                            <Mail className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-slate-900">Email Contacts</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        In regards to the Program
                                    </p>
                                    <a
                                        href="mailto:wingmentorprogram@gmail.com"
                                        className="text-xl font-medium text-blue-600 hover:text-blue-800 transition-colors break-words"
                                    >
                                        wingmentorprogram@gmail.com
                                    </a>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        WingMentor Founders &amp; Team
                                    </p>
                                    <a
                                        href="mailto:wmpilotgroup@gmail.com"
                                        className="text-xl font-medium text-blue-600 hover:text-blue-800 transition-colors break-words"
                                    >
                                        wmpilotgroup@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How We Work With You */}
                    <div className="p-10 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto md:mx-0">
                            <Users className="w-8 h-8 text-slate-900" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">How We Work With You</h3>
                            <p className="text-base text-slate-700 leading-relaxed">
                                Every pilot we speak with receives direct, practical feedback on where they stand today and what the
                                next 6–24 months can realistically look like. We review your background, training, and goals, then
                                align you with the WingMentor program track and industry partners that fit—whether that is airline,
                                corporate, or specialized roles.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed mt-4">
                                For operators and ATOs, our database and mentoring structure mean you meet pilots who have already been
                                coached to your level of professionalism. Use the email contacts here to start the conversation—whether
                                you are an individual pilot or an organization building your next intake.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back button and small decoration for visual balance */}
            <div className="py-12 flex justify-center">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>

            <div className="flex justify-center pb-12">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-slate-300" />
                </div>
            </div>
        </div>
    );
};
