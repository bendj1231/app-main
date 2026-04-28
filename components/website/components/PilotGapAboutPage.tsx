import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from './RevealOnScroll';
import { BreadcrumbSchema } from './seo/BreadcrumbSchema';

interface PilotGapAboutPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const PilotGapAboutPage: React.FC<PilotGapAboutPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'About', url: '/about' },
                { name: 'What is the Pilot Gap?', url: '/what-is-the-pilot-gap' }
            ]} />
            <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-16 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="PilotRecognition Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-[#DAA520] mb-4 font-serif">
                        Understanding the Industry
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        What is the Pilot Gap?
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed">
                        The "Pilot Gap" refers to the treacherous period in an aviator's career between obtaining initial commercial licenses (around 250 hours) and achieving the experience levels required for major airline employment (often 1500+ hours). Our programs align with Airbus EBT CBTA standards, ensuring that our programs align with the exacting standards required to bridge this critical career transition.
                    </p>
                </div>
            </div>

            {/* Full-width Section Header */}
            <div className="w-full bg-slate-50 py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <RevealOnScroll>
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#DAA520] mb-2 font-serif">
                            The Career Challenge
                        </p>
                        <h2 className="text-[2.5rem] font-serif text-slate-900 leading-tight mb-6">
                            Where 85% of Pilots Exit the Profession
                        </h2>
                        <p className="max-w-4xl text-base text-slate-700 leading-relaxed">
                            After investing significant time and capital into flight training, many pilots find themselves in a "no-man's land." They are too experienced for basic training but lack the specific multi-crew, high-performance, or operational hours that airlines demand. This gap represents the most significant point of attrition in the aviation career pipeline, where talent is lost due to lack of structured pathways and verified experience opportunities.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Content Section */}
            <div className="py-16 px-6 max-w-6xl mx-auto space-y-16">
                <RevealOnScroll delay={100}>
                    <div>
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#DAA520] mb-2 font-serif">
                            The Financial Impact
                        </p>
                        <h2 className="text-[2.5rem] font-serif text-slate-900 leading-tight mb-6">
                            Investment Without Return
                        </h2>
                        <p className="max-w-4xl text-base text-slate-700 leading-relaxed mb-6">
                            Pilots invest approximately $50,000 USD in training and dedicate 4 years to university education, yet many find themselves unable to secure airline positions. This represents not just a personal financial loss but a significant industry waste of trained talent. The gap between license acquisition and airline readiness creates a barrier that eliminates many qualified candidates before they can demonstrate their potential.
                        </p>
                        <p className="max-w-4xl text-base text-slate-700 leading-relaxed">
                            Traditional pathways provide limited visibility into professional development needs. Hours accumulation without structured mentorship and verified competency assessment often fails to meet airline expectations. Our approach addresses this by providing <strong>verified professional recognition</strong> that demonstrates actual operational readiness.
                        </p>
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={200}>
                    <div>
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#DAA520] mb-2 font-serif">
                            The PilotRecognition Solution
                        </p>
                        <h2 className="text-[2.5rem] font-serif text-slate-900 leading-tight mb-6">
                            Bridging the Gap Through Verified Experience
                        </h2>
                        <p className="max-w-4xl text-base text-slate-700 leading-relaxed mb-6">
                            PilotRecognition doesn't just acknowledge the gap; we bridge it through structured programs that turn "empty hours" into "verifiable operational experience." Our Foundational Program provides access to professional-grade applications, structured mentorship, and a verified database that aligns with Airbus EBT CBTA standards.
                        </p>
                        <p className="max-w-4xl text-base text-slate-700 leading-relaxed">
                            Through our EBT CBTA-aligned assessment framework and 50 hours of verifiable mentorship, pilots can demonstrate the specific competencies that airlines demand. This approach transforms the career gap from a barrier into a structured development pathway, ensuring that pilots are not just accumulating hours but building the professional recognition that leads to airline opportunities.
                        </p>
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={300}>
                    <div>
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#DAA520] mb-2 font-serif">
                            Industry Alignment
                        </p>
                        <h2 className="text-[2.5rem] font-serif text-slate-900 leading-tight mb-6">
                            Standards That Matter to Airlines
                        </h2>
                        <p className="max-w-4xl text-base text-slate-700 leading-relaxed mb-6">
                            Our programs are directly aligned with the competencies and standards that major airlines assess in their recruitment processes. Our assessment framework evaluates the same core competencies that airlines prioritize: cognitive and behavioral markers, decision-making under pressure, and operational awareness.
                        </p>
                        <p className="max-w-4xl text-base text-slate-700 leading-relaxed">
                            Industry alignment means that verified competencies through PilotRecognition translate directly to airline readiness and competitive advantage in recruitment.
                        </p>
                    </div>
                </RevealOnScroll>
            </div>

            {/* Member Access Gateway */}
            <div className="w-full bg-slate-50 py-16 px-6 mt-16">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#DAA520] mb-2 font-serif">
                            Member Access Gateway
                        </p>
                        <h2 className="text-[2.5rem] font-serif text-slate-900 leading-tight mb-6">
                            Start Your Bridge Program
                        </h2>
                        <p className="max-w-2xl mx-auto text-base text-slate-700 leading-relaxed mb-8">
                            Join the PilotRecognition Foundational Program to begin bridging the pilot gap through structured mentorship, verified experience, and industry-aligned assessment. Our programs provide the pathway from license to airline readiness.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="bg-[#050A30] hover:bg-[#070D3D] text-white py-4 px-8 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-900/30 hover:scale-[1.02] active:scale-95 border border-white/10"
                            >
                                Become a Member
                            </button>
                            <button
                                onClick={() => onLogin()}
                                className="bg-white hover:bg-slate-50 text-slate-900 py-4 px-8 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-slate-200 hover:scale-[1.02] active:scale-95 border border-slate-200"
                            >
                                Login to Access
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Back button */}
            <div className="py-12 flex justify-center">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to About
                </button>
            </div>
        </div>
        </>
    );
};
