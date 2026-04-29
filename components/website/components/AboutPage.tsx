import React from 'react';
import { ArrowLeft, Shield, Mail, Users, BookOpen } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { sanitizeHtml } from '@/src/lib/sanitize-html';

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

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        About Us
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
                        PilotRecognition Platform
                    </h1>
                    <span className="text-xl md:text-2xl text-slate-500 leading-none block mb-8">
                        Programs · Recognition · Pathways
                    </span>

                    <div className="max-w-3xl mx-auto text-base text-slate-700 leading-relaxed text-left space-y-6">
                        <p>
                            PilotRecognition is an aviation competency platform operated by WM Pilot Group. The system provides competency-based profiling and accredited experience programs aligned with EBT CBTA international standards. Profiles are maintained in ATLAS Aviation CV format, with planned Airbus HINFACT EBT CBTA Software integration within the Transition Program.
                        </p>
                        <p>
                            Pathways are structured career routes — cadet programs, type ratings, license progression, business aviation, eVTOL, and specialized operations. Each pathway lists operator requirements and identifies competency gaps against the pilot's profile. The platform does not operate as a job board. Pilots indicate interest in a pathway; operators pull candidate profiles from the database based on verified competency scores, flight hours, and EBT assessment data. The profile functions as a live record: hours, certifications, mentorship completion, and examination results update automatically. The competency score determines pathway access and matching priority.
                        </p>
                        <p>
                            Two programs provide the competencies and credentials required for pathway access. The Foundation Program establishes baseline competency across the nine EBT CBTA core areas through structured coursework, examination, and 50 hours of evidence-based mentorship. Foundation graduates receive a 50% discount on the Transition Program, which is currently under development and will advance to full EBT CBTA assessment, ATLAS Aviation CV formatting, EBT video evaluation, and internship placement with pathway providers. Program completion generates verified competency data that feeds directly into the pilot profile and informs pathway matching.
                        </p>

                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">Programs</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Foundation Program — $49</p>
                                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                                        <li>Competency development across 9 EBT CBTA core areas</li>
                                        <li>50 hours evidence-based mentorship</li>
                                        <li>10% scholarship allocation</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Transition Program — $299 <span className="text-slate-500 font-normal">($149 for Foundation graduates)</span> <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded ml-2 align-middle">Under Development</span></p>
                                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                                        <li>Full EBT CBTA assessment</li>
                                        <li>Airbus HINFACT applications</li>
                                        <li>ATLAS Aviation CV formatting</li>
                                        <li>EBT video assessment</li>
                                        <li>Internship placement with pathway providers</li>
                                        <li>Competency verification</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">Recognition Profile</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-slate-900 font-medium">Free</span>
                                        <span className="text-slate-600">Platform access, basic matching, 3 pathways/month</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-slate-900 font-medium">Plus</span>
                                        <span className="text-slate-600">$99/year — full comparison, unlimited pathways, priority matching</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">Pathways</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-slate-900 font-medium">Free</span>
                                        <span className="text-slate-600">Public pathway access</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-slate-900 font-medium">Plus</span>
                                        <span className="text-slate-600">Full insights via Recognition Plus</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-slate-900 font-medium">Premium</span>
                                        <span className="text-slate-600">$49 each — private sector and specialized pathways</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500">
                            Profiles are matched to operator requirements through competency scoring. The competency score determines pathway access eligibility.
                        </p>
                    </div>
                </div>
            </div>

            {/* Four-Floor Tower Narrative - The Clogged Pipeline */}
            <div className="py-16 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            The Problem
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                            The Clogged Pipeline
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Four floors. Four failures. One system to fix them.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {/* Floor 0 - Top (Entry Point) */}
                        <div className="bg-white p-8 rounded-t-2xl border border-slate-200 border-b-0 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-0.5 h-6 bg-slate-300"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-xl">0</div>
                                <h3 className="text-xl font-bold text-slate-900">Floor 0: Graduates</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>200 hours. $50,000 spent. Promised airline jobs never materialize.</p>
                                <p>Instructor queue: 2–3 years. Batch of 2015 still waiting.</p>
                                <p>Loss of potential. Then became a baggage handler.</p>
                                <p>Investment unused. Competencies unrecognized.</p>
                            </div>
                        </div>

                        {/* Floor 1 */}
                        <div className="bg-white p-8 border border-slate-200 border-b-0 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-0.5 h-6 bg-slate-300"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-xl">1</div>
                                <h3 className="text-xl font-bold text-slate-900">Floor 1: Flight Instructors</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>5,000 hours. 15 years instructing. No advancement pathway.</p>
                                <p>Trained pilots who advanced. Cannot advance without verified competency assessment.</p>
                                <p>Competencies built. No system to recognize them.</p>
                            </div>
                        </div>

                        {/* Floor 2 */}
                        <div className="bg-white p-8 border border-slate-200 border-b-0 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-0.5 h-6 bg-slate-300"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-xl">2</div>
                                <h3 className="text-xl font-bold text-slate-900">Floor 2: The Competency Gap</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>2,000 applications. 12 positions. 6 months wasted. No feedback on rejection.</p>
                                <p>Half the line asks for outdated A330 requirements. Requirements changed 3 months ago.</p>
                                <p>Operators don't update demands. Manufacturers don't publish changes.</p>
                                <p>The industry operates on stale data. Pilots apply to the wrong requirements.</p>
                            </div>
                        </div>

                        {/* Floor 3 - Bottom (End Point) */}
                        <div className="bg-white p-8 rounded-b-2xl border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-xl">3</div>
                                <h3 className="text-xl font-bold text-slate-900">Floor 3: Airline Pilots</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>12+ years. Captain at $250K. Bored. Trapped.</p>
                                <p>Change airlines? Reset to First Officer at $95K.</p>
                                <p>$155,000 gone. Seniority sacrificed.</p>
                                <p>Competency score is portable. Competencies travel. Seniority doesn't.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Context Banner */}
            <div className="py-8 px-6 bg-blue-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-lg font-medium">
                        PilotRecognition gathers real-time data from manufacturers, airlines, ATOs, and governing bodies. Type rating demands, regulatory changes, and conversion requirements — updated continuously. Stop applying blind. Apply with current information.
                    </p>
                </div>
            </div>

            {/* Solution Tower */}
            <div className="py-16 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            The Solution
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                            How PilotRecognition Unclogs the Pipeline
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {/* Solution Floor 0 */}
                        <div className="bg-slate-50 p-8 rounded-t-2xl border border-slate-200 border-b-0 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-0.5 h-6 bg-slate-300"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">0</div>
                                <h3 className="text-xl font-bold text-slate-900">Foundation Program</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>Foundation Program ($49). 10% scholarship seats reserved.</p>
                                <p>Build baseline competency. Get verified. Access pathway cards.</p>
                                <p>Stop being a baggage handler. Become a recognized pilot.</p>
                            </div>
                        </div>

                        {/* Solution Floor 1 */}
                        <div className="bg-slate-50 p-8 border border-slate-200 border-b-0 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-0.5 h-6 bg-slate-300"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">1</div>
                                <h3 className="text-xl font-bold text-slate-900">Verified Competency Assessment</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>EBT-aligned evaluation. Behavioral markers and cognitive indicators.</p>
                                <p>15 years of experience gets recognized. Not just hours.</p>
                                <p>Advance to airlines. Not stuck instructing forever.</p>
                            </div>
                        </div>

                        {/* Solution Floor 2 */}
                        <div className="bg-slate-50 p-8 border border-slate-200 border-b-0 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-0.5 h-6 bg-slate-300"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">2</div>
                                <h3 className="text-xl font-bold text-slate-900">Real-Time Industry Data</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>Data from manufacturers, airlines, ATOs, and governing bodies.</p>
                                <p>A330 requirements updated continuously. No more stale information.</p>
                                <p>Apply to the right requirements. Get feedback on why you match or don't.</p>
                            </div>
                        </div>

                        {/* Solution Floor 3 */}
                        <div className="bg-slate-50 p-8 rounded-b-2xl border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">3</div>
                                <h3 className="text-xl font-bold text-slate-900">Portable Competency Score</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>Competency score is portable. Change airlines without resetting rank or seniority.</p>
                                <p>Captain stays Captain. Position and compensation preserved.</p>
                                <p>Competencies travel. Seniority doesn't.</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <button
                            onClick={() => onNavigate('about')}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-xl"
                        >
                            Start at Floor 0. Build Your Solution.
                        </button>
                    </div>
                </div>
            </div>

            {/* Technical Documentation Link */}
            <div className="py-12 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-sm text-slate-600 mb-4">For detailed program specifications, technical documentation, and operational details</p>
                    <button
                        onClick={() => onNavigate('technical-index')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-all shadow-xl border border-slate-200"
                    >
                        <BookOpen className="w-5 h-5" />
                        View Technical Index
                    </button>
                </div>
            </div>

            {/* How It Works - 3 Steps */}
            <div className="py-16 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            How It Works
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900">
                            Three Steps to Your Aviation Career
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Users className="w-10 h-10 text-blue-700" />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">01</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Create Your Profile</h3>
                            <p className="text-slate-600">Build your Initial Competency Profile with flight experience, certifications, and training history.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-10 h-10 text-blue-700" />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">02</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Complete Foundation Program</h3>
                            <p className="text-slate-600">Build baseline competency across 9 EBT CBTA areas through structured coursework and 50-hour mentorship.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-10 h-10 text-blue-700" />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">03</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Access Pathways & Get Hired</h3>
                            <p className="text-slate-600">Operators pull your verified competency profile. Match with airlines, cargo, and specialized pathways.</p>
                        </div>
                    </div>

                    <div className="text-center mt-12 space-y-4">
                        <button
                            onClick={() => onNavigate('about')}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-xl"
                        >
                            Become a Member
                        </button>
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                            <button onClick={() => onNavigate('about')} className="hover:text-blue-700 transition-colors">Enroll in Foundation Program</button>
                            <span>•</span>
                            <button onClick={() => onNavigate('recognition-career-matches')} className="hover:text-blue-700 transition-colors">Discover Pathways</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-900 text-white py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">PilotRecognition</h3>
                            <p className="text-slate-400 text-sm">The Aviation Industry's First Pilot Recognition-Based Platform</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Platform</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a onClick={() => onNavigate('recognition-plus')} className="hover:text-white cursor-pointer transition-colors">Pilot Recognition</a></li>
                                <li><a onClick={() => onNavigate('recognition-score-info')} className="hover:text-white cursor-pointer transition-colors">Recognition Score</a></li>
                                <li><a onClick={() => onNavigate('recognition-career-matches')} className="hover:text-white cursor-pointer transition-colors">Pathways</a></li>
                                <li><a href="https://pilotterminal.com" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer transition-colors">Pilot Terminal</a></li>
                                <li><a onClick={() => onNavigate('about')} className="hover:text-white cursor-pointer transition-colors">Foundation Program</a></li>
                                <li><a onClick={() => onNavigate('pilot-gap-about')} className="hover:text-white cursor-pointer transition-colors">What is the Pilot Gap?</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Contact</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a href="mailto:contact@pilotrecognition.com" className="hover:text-white cursor-pointer transition-colors">contact@pilotrecognition.com</a></li>
                                <li><a href="mailto:contact@pilotrecognition.com" className="hover:text-white cursor-pointer transition-colors">contact@pilotrecognition.com</a></li>
                                <li><a href="mailto:enterprise@pilotrecognition.com" className="hover:text-white cursor-pointer transition-colors">enterprise@pilotrecognition.com</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Legal</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a href="/privacy-policy" className="hover:text-white cursor-pointer transition-colors">Privacy Policy</a></li>
                                <li><a href="/terms-of-service" className="hover:text-white cursor-pointer transition-colors">Terms of Service</a></li>
                                <li><a href="/cookie-policy" className="hover:text-white cursor-pointer transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
                        <p>&copy; 2024 PilotRecognition - WM Pilot Group. All rights reserved.</p>
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

            <div className="flex justify-center pb-12">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-slate-300" />
                </div>
            </div>
        </div>
    );
};
