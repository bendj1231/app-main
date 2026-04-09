import React from 'react';
import { ArrowLeft, Globe, Shield, Users, Leaf, Plane, BarChart3 } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface IndustryStewardshipPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const IndustryStewardshipPage: React.FC<IndustryStewardshipPageProps> = ({
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
                    <RevealOnScroll>
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                            Guardians of the Profession
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                            Industry Stewardship
                        </h1>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                            We view our role as more than a service provider. We are custodians of the pilot
                            profession, dedicated to raising safety standards, advocating for aircrew, and
                            preparing the next generation for a sustainable future.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Section 1: Safety Standards */}
            <div className="py-12 px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <RevealOnScroll>
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 mx-auto md:mx-0">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                Eleveating Standards
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                                EBT & Safety Alignment
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                The era of "box-ticking" training is over. We champion Evidence-Based Training (EBT)
                                and Competency-Based Training & Assessment (CBTA) as the only way forward for global aviation safety.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                By integrating these methodologies into our Foundational Program, we ensure that
                                even low-time pilots are developing the resilience and decision-making skills
                                required by modern flight decks.
                            </p>
                        </RevealOnScroll>
                    </div>
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <div className="relative w-full max-w-md mx-auto">
                                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                    <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&q=80&w=1600"
                                        alt="Safety Standards"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Section 2: Pilot Advocacy */}
            <div className="py-20 px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <RevealOnScroll>
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 mx-auto md:mx-0">
                                <Users className="w-8 h-8 text-indigo-600" />
                            </div>
                            <p className="text-xs font-bold text-indigo-700 uppercase tracking-[0.3em] mb-2">
                                The Voice of the Pilot
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                                Pilot Advocacy
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                In a profit-driven industry, the voice of the pilot can be drowned out. We serve as
                                an independent advocate, representing the interests of our members to regulators,
                                airlines, and flight schools.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                We push for fair hiring practices, transparent career pathways, and mental health
                                support, ensuring that the human element remains at the center of aviation.
                            </p>
                        </RevealOnScroll>
                    </div>
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <div className="relative w-full max-w-md mx-auto">
                                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                    <div className="absolute inset-0 bg-indigo-600/10 mix-blend-multiply"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1600"
                                        alt="Pilot Advocacy"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Section 3: 2030 Vision */}
            <div className="py-20 px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <RevealOnScroll>
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 mx-auto md:mx-0">
                                <Globe className="w-8 h-8 text-emerald-600" />
                            </div>
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-[0.3em] mb-2">
                                Future Ready
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                                Vision 2030
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                Aviation is changing. From sustainable fuels to single-pilot operations and urban
                                air mobility, we are preparing our pilots for the flight deck of tomorrow.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                Our stewardship involves anticipating these shifts and updating our curriculum
                                continuously, ensuring a WingMentor pilot is always ahead of the curve.
                            </p>
                        </RevealOnScroll>
                    </div>
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <div className="relative w-full max-w-md mx-auto">
                                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                    <div className="absolute inset-0 bg-emerald-600/10 mix-blend-multiply"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600"
                                        alt="Future Vision"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Back button */}
            <div className="py-12 flex justify-center bg-white">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Overview
                </button>
            </div>
        </div>
    );
};
