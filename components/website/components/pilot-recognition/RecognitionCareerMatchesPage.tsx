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

                {/* Section 2: Match Categories */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Career Categories
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                        Available Pathways
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Your recognition profile opens doors to multiple career pathways across the aviation industry. From commercial airlines to emerging sectors like air taxis and cargo operations, we connect you with opportunities that match your professional development goals.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-slate-50 p-6 rounded-xl">
                            <div className="flex items-center justify-center mb-4">
                                <Building2 className="w-12 h-12 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Commercial Airlines</h3>
                            <p className="text-slate-700 text-sm">Major carriers and regional airlines seeking qualified pilots</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl">
                            <div className="flex items-center justify-center mb-4">
                                <Briefcase className="w-12 h-12 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Private Charter</h3>
                            <p className="text-slate-700 text-sm">VIP and corporate aviation opportunities</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl">
                            <div className="flex items-center justify-center mb-4">
                                <Target className="w-12 h-12 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Cargo Operations</h3>
                            <p className="text-slate-700 text-sm">Freight and logistics aviation pathways</p>
                        </div>
                    </div>
                </div>

                {/* Section 3: Match Percentage */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Your Score
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                        Understanding Match Percentage
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Your <strong>match percentage</strong> represents how well your profile aligns with the requirements of a specific job position. This percentage is calculated based on your flight hours, type ratings, certifications, recent activity, and competency assessments. A higher match percentage indicates a stronger alignment with the position requirements.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Airlines and operators use this match percentage to quickly identify qualified candidates who meet their specific operational needs. By maintaining a high recognition score and keeping your profile current, you increase your visibility and improve your match percentages across multiple career opportunities.
                    </p>
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
