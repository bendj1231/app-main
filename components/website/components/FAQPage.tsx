import React from 'react';
import { ArrowLeft, Shield, Award, CheckCircle2, HelpCircle, Mail, ChevronRight } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface FAQPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const faqs = [
        {
            category: "About Pilotrecognition.com",
            questions: [
                {
                    q: "What is pilotrecognition?",
                    a: "<strong>Pilotrecognition.com</strong> is a Recognition platform operated by <strong>WM Pilot Group</strong>, designed to serve the greater future of pilot Recognition. We provide industry-accredited Recognition profiles with support, assurance & Recognition from <strong>Airbus Head of training of EBT CBTA</strong> and <strong>Etihad head of Cadet Program & Head of Training</strong>, using our <strong>ATLAS Aviation CV Recognition System</strong> to benchmark your flight experience against flagship carrier standards. Our platform transforms your profile to leadership-aligned standards, giving you the Recognition the industry doesn't provide until now."
                },
                {
                    q: "How does pilotrecognition work?",
                    a: "Pilotrecognition uses our proprietary <strong>ATLAS Aviation CV Recognition System</strong> to benchmark your flight experience against flagship carrier standards (Etihad, Emirates, etc.). Our <strong>Pilot-Terminal Recognition AI</strong> analyzes your profile, matches you with suitable career pathways, and connects you with industry opportunities through our network of airlines and operators. Airlines access pilot profiles through our <strong>Pilot-Terminal Database API</strong>, enabling direct recruitment based on Recognition scores."
                },
                {
                    q: "Is PilotRecognition free to use?",
                    a: "Yes, PilotRecognition is 100% free to use for pilots. All features including AI-powered career matching, ATLAS CV optimization, pathway analysis, mentorship, and recruiter connections are available at no cost. We use our Pilot Terminal Network with free API access to provide all services. Our revenue model is based on API access for airlines who pay to access our pilot database, not from pilots."
                },
                {
                    q: "What are the benefits of using PilotRecognition?",
                    a: "Benefits include free AI-powered career matching, ATLAS CV optimization, pathway analysis, access to exclusive job opportunities, professional Recognition profile building, real-time market intelligence, credibility verification through our ATLAS system, and industry Recognition from major airlines. Pilots who build Recognition profiles gain a competitive edge with top-scoring profiles and EBT CBTA aligned standards."
                },
                {
                    q: "How do certificate endorsements work?",
                    a: "Certificate endorsements require a processing fee, with rates varying around $20-25 as a one-time payment for blockchain certification. Each certificate receives a unique blockchain ID for verification and authenticity, making your credentials tamper-proof and easily verifiable by employers worldwide. The fee includes the Airbus interview evaluation and EBT CBTA aligned program recognition. Airlines can verify certificates through our Supabase API."
                },
                {
                    q: "What makes pilotrecognition different from other aviation platforms?",
                    a: "Pilotrecognition is <strong>run by pilots for pilots</strong>, not by corporations. We have direct communication with <strong>Airbus</strong> and <strong>Etihad</strong>, integrate <strong>Airbus HINFACT EBT CBTA</strong> applications, and provide Recognition that the industry doesn't currently offer. Our platform transforms your profile to leadership-aligned standards with <strong>AI-powered matching</strong> and <strong>blockchain-verified credentials</strong>."
                }
            ]
        },
        {
            category: "Program Structure",
            questions: [
                {
                    q: "What is the Foundational Program?",
                    a: "The <strong>Foundational Program</strong> is designed for pilots (from 4th year to 1st year) to align themselves with industry standards before advancing to the <strong>Transition Program</strong>. It's required for pilot development and provides the foundational knowledge needed for the more rigorous Transition Program. Pilots who complete the <strong>Foundation Program</strong> are <strong>prioritized</strong> for the Transition Program."
                },
                {
                    q: "What is the Transition Program?",
                    a: "The <strong>Transition Program</strong> is the advanced stage featuring access to <strong>HINFACT EBT CBTA applications</strong> and direct industry integration. It's more rigorous and includes <strong>examination scores</strong> and evaluation. Without foundational knowledge from the Foundation Program, the Transition Program may be challenging and could lead to <strong>rejection</strong> based on examination scores."
                },
                {
                    q: "Can I skip the Foundation Program and go directly to Transition?",
                    a: "While technically possible, we highly recommend completing the <strong>Foundation Program</strong> first. Without foundational knowledge, the Transition Program will be rigorous and you may be <strong>rejected</strong> based on examination scores and evaluation. <strong>Foundation Program graduates</strong> are prioritized for Transition Program acceptance."
                },
                {
                    q: "When will HINFACT integration be available?",
                    a: "<strong>HINFACT EBT CBTA integration</strong> will be available in the later stages of our platform development. We have direct confirmation to contact <strong>HINFACT</strong> to access their application. Currently, we focus on the <strong>Foundation Program</strong> to align pilots with industry standards before introducing HINFACT applications in the Transition Program."
                }
            ]
        },
        {
            category: "Mentorship",
            questions: [
                {
                    q: "How does the mentorship system work?",
                    a: "Mentorship can be done <strong>in-person or virtually</strong>, similar to a missionary approach where experienced pilots help others from 4th year to 1st year. You log mentorship sessions digitally through the <strong>mentorship logbook</strong> in the app, providing <strong>video proof</strong> or dated entries with a <strong>2-step verification process</strong> where both parties must verify and accept the session."
                },
                {
                    q: "How is mentorship verified?",
                    a: "Mentorship uses a <strong>2-step verification process</strong>. When you log a mentorship session, the other user gets flagged to verify and accept. We use <strong>manual checking</strong> and <strong>AI automated systems</strong> to screen and process entries. We email both parties to verify based on logged hours, and if there's <strong>suspicious activity</strong>, we verify with both sides."
                },
                {
                    q: "Is mentorship free?",
                    a: "Yes, mentorship is <strong>free and effort-based</strong>. It's part of the <strong>Foundation Program</strong> to help pilots gain Recognition and industry-aligned experience. The goal is to provide pilots with meaningful mentorship opportunities that build their <strong>Recognition profile</strong> and <strong>leadership skills</strong>."
                },
                {
                    q: "What if someone refuses to verify my mentorship session?",
                    a: "If someone refuses to verify a mentorship session, it won't be counted toward your <strong>Recognition profile</strong>. Our verification system ensures authenticity, and suspicious activity triggers <strong>email verification</strong> to both parties. This maintains the integrity of the <strong>mentorship logbook system</strong>."
                }
            ]
        },
        {
            category: "Recognition & Evaluation",
            questions: [
                {
                    q: "What is a Recognition profile?",
                    a: "A <strong>Recognition profile</strong> is your industry-aligned pilot profile that benchmarks your flight experience against flagship carrier standards using our <strong>ATLAS system</strong>. It includes your <strong>FAA examination scores</strong>, <strong>mentorship hours</strong>, <strong>leadership development scores</strong>, and <strong>EBT CBTA scenario performance</strong>. It's designed to give you the Recognition the industry doesn't currently provide."
                },
                {
                    q: "How is the Recognition score calculated?",
                    a: "Recognition scores are calculated through a <strong>collaborative evaluation</strong> of your Recognition profile, <strong>human intervention</strong> for processing certifications, <strong>AI tracking progression</strong>, and pilot evaluation based on current <strong>FAA examination scores</strong>, mentorship practical, <strong>leadership development skills</strong>, and <strong>EBT CBTA scenario performance</strong>."
                },
                {
                    q: "What are EBT CBTA scenarios?",
                    a: "<strong>EBT CBTA</strong> (Evidence-Based Training Competency-Based Training and Assessment) scenarios are industry-standard training situations that test how well you handle various aviation situations. Our platform includes these scenarios in the evaluation process to align pilots with <strong>Airbus</strong> and major airline standards."
                },
                {
                    q: "How do airlines access my Recognition profile?",
                    a: "Airlines access pilot Recognition profiles through our <strong>Supabase API</strong>. We provide airlines with backend access to our <strong>pilot database</strong>, allowing them to query profiles, update job board listings, and set their airline expectations. The <strong>blockchain certificate ID</strong> can be verified through this API system."
                }
            ]
        },
        {
            category: "Technical & Security",
            questions: [
                {
                    q: "What is the blockchain certificate system?",
                    a: "Each certificate endorsement receives a <strong>unique blockchain ID</strong> for verification and authenticity. This <strong>tamper-proof system</strong> ensures your credentials are easily verifiable by employers worldwide. Airlines can verify certificates through our <strong>Supabase API</strong> by reading your Recognition profile."
                },
                {
                    q: "How do you protect pilot data?",
                    a: "We use <strong>Supabase</strong> for secure data storage with proper <strong>authentication</strong> and <strong>authorization</strong>. Airlines must be <strong>vetted</strong> before receiving API access to pilot profiles. We have security measures to prevent <strong>unauthorized API access</strong> and <strong>rate-limiting</strong> to prevent abuse. You can see which airlines have accessed your profile."
                },
                {
                    q: "Can I export my data from the platform?",
                    a: "Yes, you can export your <strong>Recognition profile</strong> and <strong>mentorship logbook</strong> data. We believe in <strong>data ownership</strong> - your pilot data belongs to you. We provide options to export your data for your own records or to use elsewhere."
                },
                {
                    q: "What happens to my data if the platform shuts down?",
                    a: "We have <strong>backup strategies</strong> for Supabase data. In the unlikely event of platform shutdown, we would provide notice and options for pilots to export their data. Your <strong>blockchain certificates</strong> remain on the blockchain independently of our platform."
                }
            ]
        },
        {
            category: "Business Model",
            questions: [
                {
                    q: "How does pilotrecognition make money if it's free for pilots?",
                    a: "Our revenue model is based on <strong>API access for airlines</strong>. Airlines pay to access our large database of <strong>pilot Recognition profiles</strong> through our <strong>Supabase API</strong>. The more pilots who build Recognition profiles, the more valuable our <strong>database</strong> becomes to airlines. We may introduce small charges later as we reach mass users, but core features remain <strong>free for pilots</strong>."
                },
                {
                    q: "Why should I join now if the best features aren't ready yet?",
                    a: "Pilots who complete the <strong>Foundation Program</strong> are <strong>prioritized</strong> for the Transition Program when <strong>HINFACT integration</strong> launches. Without foundational knowledge, the Transition Program will be rigorous and you may face rejection. Building your <strong>Recognition profile</strong> now positions you ahead of other pilots when advanced features become available."
                },
                {
                    q: "What is the value proposition for airlines?",
                    a: "Airlines gain access to a large, free database of <strong>pilot Recognition profiles</strong> with industry-aligned scores, <strong>EBT CBTA standards</strong>, and <strong>blockchain-verified credentials</strong>. They can query pilots by <strong>Recognition score</strong>, qualifications, and <strong>leadership alignment</strong>, streamlining their recruitment process compared to traditional methods."
                },
                {
                    q: "How do you plan to attract airlines to your platform?",
                    a: "We contact airlines, manufacturers, flight schools, and type rating centers to advertise our platform and demonstrate why pilots should choose our pathway over competitors. We provide airlines with <strong>backend API access</strong> to update job board listings and their airline expectations, creating a <strong>direct recruitment channel</strong>."
                }
            ]
        }
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        About Pilotrecognition.com
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-blue-700 mb-6">
                        Recognition-Based Support
                    </p>
                    <div className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed pt-8">
                        <p>
                            Detailed answers to common questions about eligibility, program timelines,
                            pricing, and our global recognition standards.
                        </p>
                    </div>
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
                                    <p className="text-base text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.a }}></p>
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
