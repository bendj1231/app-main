import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PlatformEmiratesAtplPageProps {
    onNavigate: (page: string) => void;
}

export const PlatformEmiratesAtplPage: React.FC<PlatformEmiratesAtplPageProps> = ({
    onNavigate
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">

            {/* Header Section */}
            <div className="pt-10 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Emirates ATPL Pilot Pathway
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Pathway to Globally Recognized GCAA ATPL Theory
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        Designed for pilots in the UAE and abroad, the Emirates ATPL Pathway delivered through Wing Mentor
                        and partner schools such as Fujairah Aviation Academy helps you secure GCAA ATPL theoretical credits
                        that are recognized well beyond the Gulf – including Europe and Asia.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
                {/* Section 1 – Why GCAA ATPL Theory Adds Value */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Global Career Positioning
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Adds Real Weight – Even if You Start in the Philippines
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Completing your GCAA ATPL theory in the UAE is a strategic upgrade for pilots holding a CAAP
                            (Philippines) license or training in other regions. Because CAAP licenses cannot be directly
                            converted into most GCC licenses, you must pass GCAA exams anyway if you want to fly in the UAE.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            By finishing the ATPL theory first through the Emirates pathway, you clear the hardest
                            conversion hurdle in advance – turning a future barrier into today&apos;s advantage.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="relative w-full max-w-md mx-auto">
                            <img
                                src="https://lh3.googleusercontent.com/d/1Ars9ou0JcoloGv-W18gvJ1G0eWrdFNAu"
                                alt="Emirates ATPL Pathway"
                                className="w-full rounded-3xl shadow-lg object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2 – Frozen ATPL & Recognition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="md:pr-8">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Frozen ATPL & Recognition
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Emirates-Standard Theory, Recognized Worldwide
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Passing the GCAA ATPL theoretical exams gives you a frozen ATPL aligned with Emirates hiring
                            standards. These credits signal to airlines in Europe, Asia, and the Middle East that you can
                            handle rigorous international training – a powerful differentiator when competing for limited
                            cadet and First Officer positions.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            In practice, this makes your profile readable and trusted by operators beyond the UAE alone,
                            positioning you as a globally recognizable candidate, not just a local hire.
                        </p>
                    </div>
                    <div className="md:pl-8">
                        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">
                                What a Frozen ATPL Unlocks
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
                                <li>Meets theoretical requirements for command progression in many regions.</li>
                                <li>Signals readiness for airline multi-crew training and type ratings.</li>
                                <li>Strengthens CVs for Emirates, Etihad, FlyDubai and other global carriers.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Section 3 – Earning Power & Career Mobility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Earning Power
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Theory First – So You Are Ready When Opportunity Arrives
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Even while your license remains &quot;frozen,&quot; having GCAA ATPL theory completed makes
                            you eligible for higher-value First Officer opportunities once your hours and experience meet
                            operator thresholds.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            In markets like India and the Middle East, command tracks and upgrade routes all require ATPL
                            theoretical credits. Pilots who complete theory early don&apos;t just earn more later – they
                            move faster through seniority lists and command upgrades.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="bg-slate-900 rounded-3xl text-white p-8 space-y-4 shadow-xl">
                            <h3 className="text-lg font-semibold">
                                From CPL to Global CV
                            </h3>
                            <p className="text-sm text-slate-200 leading-relaxed">
                                A CPL alone keeps you competing in saturated local markets. A CPL plus GCAA ATPL theory and a
                                Wing Mentor profile positions you for cross-border roles in Dubai, the wider GCC, and
                                emerging aviation hubs that actively benchmark against Emirates standards.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 4 – Fujairah Aviation Academy & Delivery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="md:pr-8">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Delivered Through Fujairah Aviation Academy
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Bristol Ground School Materials & Security Cleared in the UAE
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The Emirates ATPL Pathway is delivered with Fujairah Aviation Academy using the Bristol Ground
                            School distance-learning system (approx. AED 18,000). Bristol materials are widely regarded as
                            a gold standard for ATPL theory, helping you study to a level recognized by regulators and
                            airlines worldwide.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Fujairah also supports mandatory UAE security clearance – a process that can be difficult for
                            international applicants to navigate alone – so your theory is not just complete, but properly
                            documented inside the UAE system.
                        </p>
                    </div>
                    <div className="md:pl-8">
                        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Pathway Regions Available
                            </h3>
                            <p className="text-sm text-slate-700">
                                Wing Mentor and partner schools support candidates currently training or working in:
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <span className="text-2xl" aria-label="United Arab Emirates">🇦🇪</span>
                                <span className="text-2xl" aria-label="United Kingdom">🇬🇧</span>
                                <span className="text-2xl" aria-label="Mauritius">🇲🇺</span>
                                <span className="text-2xl" aria-label="Philippines">🇵🇭</span>
                                <span className="text-2xl" aria-label="Germany">🇩🇪</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
