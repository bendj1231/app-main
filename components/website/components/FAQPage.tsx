import React, { useState } from 'react';
import { ArrowLeft, Shield, Award, Target, Globe, Briefcase, Zap, CheckCircle2, ChevronDown, HelpCircle, Mail } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface FAQPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const faqs = [
        {
            category: "Eligibility",
            questions: [
                {
                    q: "Who is the Foundational Program for?",
                    a: "The Foundational Program is designed for private pilots, students, and aspiring aviators who want to build a professional profile and gain industry insight before making major career investments."
                },
                {
                    q: "Can I join if I'm already a commercial pilot?",
                    a: "Yes. Commercial pilots often join our Transition Program to optimize their ATLAS CVs and gain direct connections to our network of corporate and air taxi operators."
                }
            ]
        },
        {
            category: "Program Details",
            questions: [
                {
                    q: "What is the ATLAS Aviation CV Recognition System?",
                    a: "ATLAS is our proprietary AI-driven data extraction system that benchmarks your flight experience against flagship carrier standards (Etihad, Emirates, etc.), making your profile visible to elite recruiters."
                },
                {
                    q: "How does the mentorship work?",
                    a: "You are paired with active airline captains or private jet operators who provide direct, one-on-one sessions to review your career path, interview readiness, and technical competency."
                }
            ]
        },
        {
            category: "Pricing & Enrollment",
            questions: [
                {
                    q: "What are the costs associated with the programs?",
                    a: "The Foundational Program starts with a tiered membership. Specific investment details for the Transition and ATPL pathways are provided upon initial profile verification."
                },
                {
                    q: "How do I secure UAE GCAA theoretical credits?",
                    a: "Our Emirates ATPL Pathway is delivered via Fujairah Aviation Academy. We guide you through the Bristol Ground School mastery and the official UAE GCAA examination process."
                }
            ]
        }
    ];

    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <div className="flex justify-center items-center gap-4 mb-8">
                            <HelpCircle className="w-12 h-12 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Knowledge Base
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">
                            FAQs
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            Detailed answers to common questions about eligibility, program timelines,
                            pricing, and our global recognition standards.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* FAQ List */}
            <div className="py-24 px-6 max-w-4xl mx-auto">
                {faqs.map((group, groupIdx) => (
                    <div key={groupIdx} className="mb-16 last:mb-0">
                        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-8 px-4 border-l-4 border-blue-600">
                            {group.category}
                        </h2>
                        <div className="space-y-4">
                            {group.questions.map((faq, idx) => {
                                const id = `${groupIdx}-${idx}`;
                                const isOpen = openIndex === id;
                                return (
                                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden transition-all">
                                        <button
                                            onClick={() => toggle(id)}
                                            className="w-full p-8 flex items-center justify-between text-left hover:bg-slate-100/50 transition-colors"
                                        >
                                            <span className="text-lg font-bold text-slate-800 font-sans tracking-tight">{faq.q}</span>
                                            <ChevronDown className={`w-5 h-5 text-blue-600 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                            <div className="p-8 pt-0 text-slate-600 leading-relaxed font-sans">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer CTA */}
            <div className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-10 leading-tight">Still have questions?</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button
                                onClick={() => window.location.href = 'mailto:wingmentorprogram@gmail.com'}
                                className="bg-slate-900 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl font-sans flex items-center gap-3"
                            >
                                <Mail className="w-5 h-5" />
                                Contact Founders
                            </button>
                            <button
                                onClick={onBack}
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-12 py-5 rounded-full font-bold text-lg transition-all font-sans"
                            >
                                Back to Home
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};
