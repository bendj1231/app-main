import React from 'react';
import { ArrowLeft, Navigation, Zap, Shield } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface ExclusivePipelinePageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const ExclusivePipelinePage: React.FC<ExclusivePipelinePageProps> = ({
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
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-red-600 mb-4">
                        Stop Sending CVs Into the "Black Hole"
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
                        Traditional Job Boards Are Where Careers Stall
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed">
                        When you upload a CV to a generic portal, you are competing with 5,000 others in a "Fugazzi" shortage. Pilot Recognition has replaced the CV with The Pathway Pool. You aren't offering a job board; you are offering an Exclusive Pipeline.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Pathway Pool */}
                        <div className="group relative p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-2xl transition-all">
                            <div className="absolute top-6 right-6 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Navigation className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 pr-12">The Pathway Pool</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                <strong>No CVs, Just Targets.</strong> Airlines and operators don't want to dig through piles of paper. They post a Pathway, and you submit your Interest.
                            </p>
                            <p className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 inline-block px-3 py-1 rounded">
                                If you aren't in the pool, you aren't even in the conversation.
                            </p>
                        </div>

                        {/* Priority Shortlisting */}
                        <div className="group relative p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-2xl transition-all">
                            <div className="absolute top-6 right-6 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Zap className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 pr-12">Priority Shortlisting</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                <strong>Skip the Line.</strong> In a crowded market, being first is everything. As a Recognized Member, you don't just sit in the pool—you rise to the top. Our system grants you Priority Shortlisting, ensuring that when an operator looks at that Pathway, your profile is the first one they see.
                            </p>
                            <p className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 inline-block px-3 py-1 rounded">
                                While everyone else waits for an email that never comes, you are already being reviewed.
                            </p>
                        </div>

                        {/* Veremark Background Screening */}
                        <div className="group relative p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-2xl transition-all">
                            <div className="absolute top-6 right-6 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Shield className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 pr-12">The $100 "Fast Track"</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                <strong>Vetted by Veremark.</strong> Airlines are terrified of hiring risks. They want pilots who are already "clean." For $100/year, we provide an official Veremark Background Screening. This isn't just a self-check; it's a professional verification that is baked into your Recognition Profile.
                            </p>
                            <p className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 inline-block px-3 py-1 rounded">
                                A high PR Score is great, but a Background-Vetted PR Score is bulletproof.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Line CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            The "pilot shortage" is only a reality for the pilots who have done the work to be visible. By joining a Pathway, securing Priority Shortlisting, and getting Veremark Screened, you transform from a "hopeful applicant" into a "vetted solution."
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                            Don't wait for a phone call. Join a Pathway and become the priority.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
