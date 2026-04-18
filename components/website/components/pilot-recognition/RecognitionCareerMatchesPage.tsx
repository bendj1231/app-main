import React from 'react';
import { ArrowLeft, Target, Briefcase, Users, TrendingUp, CheckCircle2, Search, Award, Building2 } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface RecognitionCareerMatchesPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const RecognitionCareerMatchesPage: React.FC<RecognitionCareerMatchesPageProps> = ({
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
                        Career Matching
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                        Recognition Career Matches
                    </h1>
                    <p className="text-base md:text-lg text-slate-700 max-w-3xl mx-auto mt-6">
                        Your <strong>Pilot Recognition Profile</strong> automatically matches you with career opportunities that align with your skills, experience, and professional standing.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                {/* Section 1: How It Works */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        How It Works
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                        Intelligent Matching System
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Our <strong>recognition-based matching algorithm</strong> analyzes your <strong>Pilot Recognition Score</strong>, flight hours, certifications, and competency assessments to identify the most suitable career opportunities. Unlike traditional job boards that rely on manual resume screening, our system uses <strong>AI-powered matching</strong> to connect you with positions where you're most likely to succeed.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        The system continuously updates your match percentage as you log new flight hours, complete training programs, and achieve new certifications. This ensures that your profile always reflects your current capabilities and readiness for career advancement.
                    </p>
                </div>

                {/* Section 2: Recommended Pathways (Static Mock for SEO) */}
                <div className="mb-16">
                    <div className="text-center max-w-4xl mx-auto">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Pathways to Partnered Cadet Programs
                        </p>
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                            Recommended Pathways
                        </h2>
                        <p className="text-lg text-slate-700 leading-relaxed mb-4">
                            Explore career pathways matched to your profile
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            Discover cadet programs, airline partnerships, and career progression opportunities tailored to your experience level
                        </p>
                    </div>

                    {/* Filters and Score */}
                    <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-sm font-medium text-red-600">Low Match</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-sm font-medium text-amber-600">Middle Match</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-green-600">High Match</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-sm font-medium text-slate-600">All</span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-slate-400 italic mb-4">
                        Swipe left and right or click to select a card
                    </p>

                    {/* Overall Profile Score */}
                    <div className="flex justify-end mb-6">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                Overall Profile Score
                            </p>
                            <div className="text-xs text-slate-600 mb-1">
                                <div>Flight Hours: 200 <span className="font-bold text-amber-600">(unverified)</span></div>
                                <div>Recency: N/A</div>
                                <div>Recognition: 0</div>
                            </div>
                            <div className="text-4xl font-serif text-slate-900">0</div>
                        </div>
                    </div>

                    {/* Pathway Cards Carousel (Static Mock) */}
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        <div className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-900">Envoy Air Pilot Cadet Program</h3>
                                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">80% Match</div>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">Envoy Air (American Airlines Group)</p>
                            <p className="text-xs text-slate-500">PR: 0</p>
                        </div>
                        <div className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-900">CAE Philippines Type Rating Center</h3>
                                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">80% Match</div>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">CAE Philippines (PAAT)</p>
                            <p className="text-xs text-slate-500">PR: 0</p>
                        </div>
                        <div className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-900">SkyWest Airlines Cadet Program</h3>
                                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">80% Match</div>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">SkyWest Airlines</p>
                            <p className="text-xs text-slate-500">PR: 0</p>
                        </div>
                        <div className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-900">Zipline Flight Operations</h3>
                                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">79% Match</div>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">Zipline International</p>
                            <p className="text-xs text-slate-500">PR: 0</p>
                        </div>
                        <div className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-900">Drone Delivery Pilot</h3>
                                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">79% Match</div>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">Wing (Alphabet)</p>
                            <p className="text-xs text-slate-500">PR: 0</p>
                        </div>
                        <div className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-900">MLG Pilotless Drone Ops</h3>
                                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">79% Match</div>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">MLG (Medical Logistics Group)</p>
                            <p className="text-xs text-slate-500">PR: 0</p>
                        </div>
                        <div className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-900">Cathay Pacific Cadet Pilot Programme</h3>
                                <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-sm font-bold">75% Match</div>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">Cathay Pacific Airways</p>
                            <p className="text-xs text-slate-500">PR: 0</p>
                        </div>
                        <div className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-900">Cebu Pacific Cadet Pilot Program</h3>
                                <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-sm font-bold">60% Match</div>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">Cebu Pacific</p>
                            <p className="text-xs text-slate-500">PR: 0</p>
                        </div>
                    </div>
                </div>

                {/* Section 3: Selected Pathway (Static Mock for SEO) */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">
                                    Selected Pathway
                                </p>
                                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-2">
                                    Envoy Air Pilot Cadet Program
                                </h2>
                                <p className="text-lg text-slate-600">Envoy Air (American Airlines Group)</p>
                            </div>
                            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                                <span className="text-2xl font-bold">80%</span>
                                <span className="text-sm font-medium ml-1">Match</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6 mb-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Why this pathway is recommended to you
                            </h3>
                            <p className="text-slate-700 leading-relaxed">
                                Based on your profile, this pathway has a 80% match with your interests in American Airlines Flow, Embraer Fleet, Tuition Reimbursement. Your recognition score of 0 indicates strong alignment with this program's requirements. This pathway is one of the best starting points to build your recognition profile score throughout your pilot career, setting a foundation for future opportunities.
                            </p>
                            <p className="text-slate-700 leading-relaxed mt-2">
                                Financial assistance + guaranteed First Officer position with American Airlines flow-through.
                            </p>
                        </div>

                        <div className="border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Requirements & Profile Alignment
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Understand how your current profile aligns with the pathway requirements and identify areas for improvement to increase your eligibility.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Flight Hours
                                    </p>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Your account shows: 200 total flight hours
                                    </p>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="pb-2 font-medium text-slate-700">REQUIREMENT</th>
                                                    <th className="pb-2 font-medium text-slate-700">STATUS</th>
                                                    <th className="pb-2 font-medium text-slate-700">DETAILS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="py-2 text-slate-600">40+ Flight Hours</td>
                                                    <td className="py-2 text-green-600 font-medium">✓ Met</td>
                                                    <td className="py-2 text-slate-600">You have sufficient hours</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Licenses
                                    </p>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Your account shows: ppl, cpl, ir, multi_engine, student
                                    </p>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="pb-2 font-medium text-slate-700">REQUIREMENT</th>
                                                    <th className="pb-2 font-medium text-slate-700">STATUS</th>
                                                    <th className="pb-2 font-medium text-slate-700">DETAILS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="py-2 text-slate-600">Commercial Pilot License</td>
                                                    <td className="py-2 text-green-600 font-medium">✓ Met</td>
                                                    <td className="py-2 text-slate-600">License requirement met</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Medical
                                    </p>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Your account shows: None
                                    </p>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="pb-2 font-medium text-slate-700">REQUIREMENT</th>
                                                    <th className="pb-2 font-medium text-slate-700">STATUS</th>
                                                    <th className="pb-2 font-medium text-slate-700">DETAILS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="py-2 text-slate-600">Class 1 Medical</td>
                                                    <td className="py-2 text-red-600 font-medium">✗ Not Met</td>
                                                    <td className="py-2 text-slate-600">Medical certificate not valid or expired</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Certifications
                                    </p>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Your account shows: 0 certifications on file
                                    </p>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="pb-2 font-medium text-slate-700">REQUIREMENT</th>
                                                    <th className="pb-2 font-medium text-slate-700">STATUS</th>
                                                    <th className="pb-2 font-medium text-slate-700">DETAILS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="py-2 text-slate-600">US Citizen/Perm Resident</td>
                                                    <td className="py-2 text-red-600 font-medium">✗ Not Met</td>
                                                    <td className="py-2 text-slate-600">Missing US Citizen/Perm Resident</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 text-slate-600">FAA License Holders Eligible</td>
                                                    <td className="py-2 text-red-600 font-medium">✗ Not Met</td>
                                                    <td className="py-2 text-slate-600">Missing FAA License Holders Eligible</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6 mt-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Why Your Profile Matches
                            </h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                Your profile shows a 80% match based on your interests in American Airlines Flow, Embraer Fleet, Tuition Reimbursement and your recognition score of 0. Consider adding relevant interests to improve your match score.
                            </p>
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                Discover Envoy Air Pilot Cadet Program →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 4: Benefits */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Advantages
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                        Why Recognition-Based Matching
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Traditional job applications often result in your resume being lost in a sea of applications, with little guarantee that hiring managers will even see your qualifications. Our recognition-based matching system ensures that your profile is <strong>actively presented</strong> to airlines and operators who are looking for pilots with your specific qualifications and experience level.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        By leveraging your <strong>Pilot Recognition Score</strong> and verified credentials, you gain a competitive advantage in the hiring process. Airlines can see your professional standing at a glance, reducing the time and effort required to evaluate candidates and increasing your chances of securing desirable positions.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">AI-Powered Matching</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Verified Credentials</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Real-Time Updates</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Industry Connections</span>
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
