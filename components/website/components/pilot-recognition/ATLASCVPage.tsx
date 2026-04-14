import React from 'react';
import { ArrowLeft, Globe, Zap, Target } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';

interface ATLASCVPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const ATLASCVPage: React.FC<ATLASCVPageProps> = ({
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
                        Professional Aviation Standardization
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        The ATLAS Aviation CV
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                        The globally recognized, AI-optimized format that presents your experience, competencies, and qualifications in the standardized structure preferred by international airlines.
                    </p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-24">

                {/* Row 1: The Standard (Text Left, Image Right) */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Industry Standard
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                            The Professional Format for Modern Aviation
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                            The <strong>ATLAS Aviation CV</strong> is more than a document; it is a standardized data protocol designed specifically for aviation professionals. Unlike generic CVs, it aligns your experience with EBT/CBTA frameworks, ensuring that airlines can instantly evaluate your operational readiness.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed font-sans">
                            This format is <strong>AI-optimized</strong> for Applicant Tracking Systems (ATS), ensuring your application passes automated screening and reaches human reviewers. It transforms your raw hours into meaningful competency markers.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full mx-auto group">
                            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-3 group-hover:rotate-1 transition-transform duration-500 opacity-10"></div>
                            <img
                                src="https://lh3.googleusercontent.com/d/1wPEIiMRj4fW34_NIQKRnzCf8KNhdD1TC"
                                alt="ATLAS CV Format"
                                className="w-full h-auto object-cover rounded-[2.5rem] shadow-2xl relative z-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Row 2: Why it Matters (Image Left, Text Right) */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">
                            Competitive Advantage
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                            Why the ATLAS Format Sets You Apart
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                            The ATLAS format bridges the gap between pilot application and airline expectation. It is recognized by recruitment agencies and aviation organizations worldwide as the professional standard for presenting pilot credentials.
                        </p>

                        <div className="space-y-6 text-left">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <Globe className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Global Recognition</h4>
                                    <p className="text-sm text-slate-600">Accepted by major carriers and preferred by international recruiters.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">ATS Optimization</h4>
                                    <p className="text-sm text-slate-600">Keywords and structure designed to pass automated AI screening filters.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <Target className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Competency-Based</h4>
                                    <p className="text-sm text-slate-600">Aligns with EBT/CBTA frameworks, highlighting capability beyond hours.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full mx-auto group">
                            <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem] -rotate-3 group-hover:-rotate-1 transition-transform duration-500 opacity-5"></div>
                            <img
                                src="https://lh3.googleusercontent.com/d/1Ars9ou0JcoloGv-W18gvJ1G0eWrdFNAu"
                                alt="Global Recognition"
                                className="w-full h-auto object-cover rounded-[2.5rem] shadow-2xl relative z-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Row 3: What's Included (Text Left, Image Right) */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            CV Components
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                            Comprehensive Documentation
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                            The ATLAS format is comprehensive yet concise, presenting all critical information in a standardized structure that airlines expect and understand. It removes the guesswork for recruiters.
                        </p>

                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { title: "Personal Information", desc: "Professional details, licenses, ratings, medical status" },
                                { title: "Flight Experience", desc: "Total hours, PIC, multi-engine, type-specific breakdown" },
                                { title: "Competencies & Skills", desc: "EBT/CBTA competencies, languages, technical skills" },
                                { title: "Education & History", desc: "Academic qualifications, employment history, achievements" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-blue-600 font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full mx-auto group">
                            <div className="absolute inset-0 bg-blue-100 rounded-[2.5rem] rotate-2 group-hover:-rotate-1 transition-transform duration-500 opacity-20"></div>
                            <img
                                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2940&auto-format&fit=crop"
                                alt="Comprehensive Documentation"
                                className="w-full h-auto object-cover rounded-[2.5rem] shadow-2xl relative z-10 aspect-[4/5]"
                            />
                        </div>
                    </div>
                </div>

                {/* Row 4: Tools & Builder (Image Left, Text Right) */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">
                            Professional Tools
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                            WingMentor's ATLAS CV Builder
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                            Creating an ATLAS-compliant CV from scratch is complex. WingMentor's CV builder automates the process, ensuring your CV meets all formatting standards while optimizing it for both ATS systems and human reviewers.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                            Your ATLAS CV automatically syncs with the WingMentor Pilot Database, creating a verifiable, industry-recognized profile that airlines can access directly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button
                                onClick={() => onNavigate('contact-support')}
                                className="px-8 py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-lg uppercase tracking-wider text-xs"
                            >
                                Start Building
                            </button>
                            <button
                                onClick={() => onNavigate('transition-program')}
                                className="px-8 py-4 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                            >
                                Learn More <ArrowLeft className="w-4 h-4 rotate-180" />
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full mx-auto group">
                            <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem] -rotate-2 group-hover:rotate-1 transition-transform duration-500 opacity-5"></div>
                            <img
                                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2940&auto-format&fit=crop"
                                alt="CV Builder Tool"
                                className="w-full h-auto object-cover rounded-[2.5rem] shadow-2xl relative z-10"
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer CTA - Clean & Simple */}
            <div className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                        Ready to Professionalize Your Profile?
                    </h2>
                    <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                        Stop using generic CVs that get filtered out. Switch to the industry standard.
                    </p>
                    <button
                        onClick={onBack}
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-full hover:border-slate-300 hover:shadow-lg transition-all"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};
