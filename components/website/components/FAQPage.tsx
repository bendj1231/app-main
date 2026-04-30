import React from 'react';
import { ArrowLeft, Shield, Award, CheckCircle2, HelpCircle, Mail, ChevronRight } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { sanitizeJsonLd, sanitizeHtml } from '@/src/lib/sanitize-html';

interface FAQPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const faqs = [
        {
            category: "Platform Overview",
            questions: [
                {
                    q: "What is PilotRecognition?",
                    a: "A competency framework and career platform for pilots. We assess behavioral markers alongside flight hours, match you with verified pathways, and give operators access to your verified profile. You build a recognition score based on verified mentorship hours, EBT CBTA-aligned competency assessment, and professional development."
                },
                {
                    q: "Is PilotRecognition free?",
                    a: "Creating a profile, logging flight hours, and viewing 3 pathways per month are free. <strong>Foundation Program</strong> is free to enter and includes 50 hours of verified mentorship, competency assessment, and industry-aligned CV formatting. Certification at completion is $49. <strong>Transition Program ($149)</strong> is the advanced stage with EBT CBTA video assessment. Foundation graduates unlock it at $99. <strong>Recognition Plus ($99/year)</strong> unlocks unlimited pathway views and priority matching. Revenue comes from pilot programs and operator subscriptions."
                },
                {
                    q: "How does it work?",
                    a: "Create your profile. Complete verified mentorship hours. Your competencies are assessed through our EBT CBTA-aligned framework. You see match indicators against pathway requirements posted on the platform. When operators join, they can pull verified profiles that match their requirements. Your recognition score determines your pathway access and visibility. We are actively recruiting operator partners."
                },
                {
                    q: "What's the difference from a job board?",
                    a: "Job boards are push-based: you apply, you wait, you compete. PilotRecognition is a pulling system: when operators join, they see verified competency data and pull candidates who match requirements. Your profile updates as you log hours and complete assessments. Pathways show you exactly what competencies you're missing—not just open positions."
                },
                {
                    q: "Why join now?",
                    a: "Early adopters build recognition scores before the platform is saturated. Foundation Program graduates are prioritized for Transition Program access and operator matching. As more operators join, higher recognition scores unlock better pathways. The pilots who start now have a head start on the pilots who wait."
                }
            ]
        },
        {
            category: "Programs & Pricing",
            questions: [
                {
                    q: "What is the Foundation Program?",
                    a: "<strong>Free to enter.</strong> Includes 50 hours of verified mentorship, competency assessment, and industry-aligned CV formatting. EBT CBTA-aligned competency assessment. Certification at completion is $49. Foundation graduates unlock the Transition Program at graduate pricing ($99, a $50 discount from $149). This builds your baseline recognition score that determines pathway access."
                },
                {
                    q: "What is the Transition Program?",
                    a: "<strong>$149</strong> ($99 for Foundation graduates). Includes EBT CBTA video assessment after mentorship completion, detailed competency scoring across 9 markers, and direct pathway eligibility. Without Foundation completion, the assessment is rigorous and you may not pass if baseline competencies aren't met. Foundation graduates are prioritized."
                },
                {
                    q: "What is Recognition Plus?",
                    a: "<strong>$99/year.</strong> Unlocks unlimited pathway views, full profile comparison against airline requirements, and priority matching when operators search the platform. Free tier is limited to basic profile creation and restricted pathway views. Program participants receive the same priority matching as paid members—effort-based recognition, not pay-to-win."
                },
                {
                    q: "Can I skip the Foundation Program?",
                    a: "You can attempt the Transition Program directly, but the assessment is rigorous. Without the baseline competencies and mentorship hours from Foundation, you may not pass. Foundation graduates are automatically prioritized for Transition acceptance and pathway matching."
                }
            ]
        },
        {
            category: "Mentorship",
            questions: [
                {
                    q: "How does mentorship work?",
                    a: "Free, effort-based, in-person or virtual. You log sessions through the Pilot Terminal app. Each session requires 2-step verification: both mentor and mentee must confirm. Verified sessions count toward your recognition score and Foundation Program completion."
                },
                {
                    q: "How is mentorship verified?",
                    a: "Both parties verify each session through the app. We cross-check for suspicious patterns: same-day bulk entries, mismatched locations, impossible travel times. Flagged entries trigger manual review. Refused verifications don't count. There's no gaming the system."
                },
                {
                    q: "What if my mentor won't verify?",
                    a: "The session doesn't count. Choose mentors active on the platform who understand the verification requirement. We track mentor verification rates. Low-rate mentors are deprioritized in matching. Build relationships with reliable mentors—network quality affects your recognition score."
                }
            ]
        },
        {
            category: "Recognition & Assessment",
            questions: [
                {
                    q: "What is a recognition score?",
                    a: "A composite metric based on: verified mentorship hours, EBT CBTA competency assessment results, program completion status, and professional development markers. It determines pathway access and improves visibility to operators. Higher scores improve your matching priority. Not about popularity—about demonstrated capability."
                },
                {
                    q: "What is EBT CBTA assessment?",
                    a: "Evidence-Based Training and Competency-Based Training Assessment. We measure 9 core competencies: decision making, communication, leadership, situational awareness, workload management, procedures, flight path management, knowledge, and automation management. These are the behavioral markers used in EBT CBTA training frameworks. We score them, not just log your hours."
                },
                {
                    q: "How do airlines access my profile?",
                    a: "When verified operators subscribe to our platform, they search by competency requirements. They see your recognition score, verified hours, and assessment results—not your personal contact info until you authorize contact. You control visibility. Matching is based on competency alignment, not keyword search. We are actively recruiting operator partners."
                }
            ]
        },
        {
            category: "Data & Security",
            questions: [
                {
                    q: "Is my data secure?",
                    a: "Yes. All data is encrypted and stored securely. Airlines are vetted before receiving platform access. You see which operators have viewed your profile. Rate limiting prevents abuse. We comply with standard data protection practices. Your profile data belongs to you and can be exported at any time."
                },
                {
                    q: "Can I export my data?",
                    a: "Yes. Your recognition profile, mentorship logbook, and assessment results can be exported in standard formats for your own records. You own your data. We don't lock you in."
                },
                {
                    q: "What happens to my data if you shut down?",
                    a: "We maintain regular backups. In the unlikely event of shutdown, we provide notice and export options. Your data belongs to you, not us."
                }
            ]
        },
    ];

    // Generate FAQ schema for SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.flatMap(group => 
            group.questions.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        )
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            {/* FAQ Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(faqSchema) }}
            />
            
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Straight Answers
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed">
                        How it works. What it costs. What you actually get. No corporate fluff.
                    </p>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
                {faqs.map((group, groupIdx) => (
                    <div key={groupIdx} className="text-center max-w-4xl mx-auto">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            {group.category}
                        </p>
                        <h2 className="text-2xl md:text-3xl font-serif text-slate-900 mb-8">
                            {group.category}
                        </h2>
                        <div className="text-left space-y-8">
                            {group.questions.map((faq, idx) => (
                                <div key={idx} className="space-y-2">
                                    <h3 className="text-lg font-bold text-slate-900">{faq.q}</h3>
                                    <p className="text-base text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.a) }}></p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
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
