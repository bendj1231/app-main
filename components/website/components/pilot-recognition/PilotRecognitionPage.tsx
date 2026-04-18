import React from 'react';
import { Database, Award, Shield, ChevronRight, CheckCircle2, ShieldCheck, Zap, Globe, Lock, BarChart3, Search, UserCheck } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { IMAGES } from '../../../../src/lib/website-constants';

interface PilotRecognitionPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const PilotRecognitionPage: React.FC<PilotRecognitionPageProps> = ({ onBack, onNavigate, onLogin }) => {
    // Magazine Rows Data
    const magazineRows = [
        {
            title: "Unified Aviation Identity",
            desc: "Your complete aviation journey in one verified digital profile. WingMentor consolidates flight hours, certifications, mentorship, and career milestones into a single source of truth that travels with you throughout your professional life.",
            bullets: ["Single Profile", "Career Timeline", "Cross-Platform"],
            image: IMAGES.LOGBOOK_IMG,
            reverse: false
        },
        {
            title: "Verified Professional Standing",
            desc: "Every credential, flight hour, and achievement is cryptographically verified. Our blockchain-backed verification system creates an unbreakable chain of custody that airlines and regulatory bodies trust implicitly.",
            bullets: ["Cryptographic Proof", "Real-Time Verification", "Industry Trust"],
            image: IMAGES.STORY_MAP_BG,
            reverse: true
        },
        {
            title: "AI-Native Career Intelligence",
            desc: "Your profile is optimized for modern airline recruitment AI systems. We translate your experience into structured data that automated screening systems recognize, prioritize, and rank at the top of candidate pools.",
            bullets: ["AI-Optimized", "Global Reach", "Smart Matching"],
            image: IMAGES.ANALYST_PROFILE_IMG,
            reverse: false
        },
        {
            title: "Competency-Based Recognition",
            desc: "Beyond flight hours—we measure capability. Our competency framework maps your skills against industry standards like CBTA, highlighting strengths that matter to airlines: decision-making, leadership, technical expertise, and adaptability.",
            bullets: ["Competency Mapping", "Skill Analytics", "Growth Tracking"],
            image: IMAGES.GAP_CAREER_TURBULENCE_IMG,
            reverse: true
        }
    ];

    const recognitionPillars = [
        { title: "Live Verification", value: "Real-time verification of credentials across the entire WingMentor ecosystem.", icon: CheckCircle2 },
        { title: "AI Integration", value: "Seamless integration with airline AI screening and recruitment platforms.", icon: (props: any) => <Zap {...props} /> },
        { title: "Verified Status", value: "Earn the globally recognized 'Verified Pilot' digital credential.", icon: Award },
        { title: "Career Pipeline", value: "Direct visibility to our network of partner airline recruiters.", icon: Search }
    ];

    return (
        <div className="min-h-screen font-sans text-left" style={{ background: '#ffffff', color: '#0f172a' }}>
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div style={{ textAlign: 'center', paddingBottom: '3.5rem', paddingTop: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
                <RevealOnScroll>
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
                    </div>
                    <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem' }}>
                        PILOT RECOGNITION
                    </div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                        Pilot Recognition
                    </h1>
                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 2.5rem', maxWidth: '42rem' }}>
                        Transform your flight hours into verifiable professional credentials. WingMentor creates a trusted digital identity that airlines recognize and recruiters seek—bridging the gap between your training and airline-ready credibility.
                    </p>
                </RevealOnScroll>
            </div>

            {/* Magazine Content Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center', maxWidth: '42rem', margin: '0 auto', padding: '0 2rem' }}>
                {magazineRows.map((row, idx) => (
                    <section key={idx} style={{ textAlign: 'center' }}>
                        <RevealOnScroll>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                FEATURE {idx + 1}
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                {row.title}
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 2.5rem' }}>
                                {row.desc}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                {row.bullets.map((bullet, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <CheckCircle2 style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                                        <span style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#475569' }}>{bullet}</span>
                                    </div>
                                ))}
                            </div>
                        </RevealOnScroll>
                    </section>
                ))}
            </div>

            {/* Cinematic Stewardship Section */}
            <section style={{ textAlign: 'center', maxWidth: '42rem', margin: '4.5rem auto', padding: '0 2rem' }}>
                <RevealOnScroll>
                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        PROFESSIONAL TRUST
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                        Verified Excellence, Recognized Globally
                    </h2>
                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 2.5rem', fontStyle: 'italic' }}>
                        "Your professional identity deserves more than a paper logbook—it deserves verification."
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '36rem' }}>
                            <UserCheck style={{ width: '24px', height: '24px', color: '#2563eb', flexShrink: 0 }} />
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                Every achievement, certification, and milestone is cryptographically verified and timestamped.
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '36rem' }}>
                            <Lock style={{ width: '24px', height: '24px', color: '#2563eb', flexShrink: 0 }} />
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                Military-grade encryption protects your professional data while enabling instant verification.
                            </p>
                        </div>
                    </div>
                </RevealOnScroll>
            </section>

            {/* Recognition Pillars (System Infrastructure) */}
            <section style={{ textAlign: 'center', maxWidth: '42rem', margin: '4.5rem auto', padding: '0 2rem' }}>
                <RevealOnScroll>
                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        INFRASTRUCTURE
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                        System Architecture
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                        {recognitionPillars.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '36rem' }}>
                                <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {typeof item.icon === 'function' ? item.icon({ style: { width: '24px', height: '24px', color: '#2563eb' } }) : React.createElement(item.icon, { style: { width: '24px', height: '24px', color: '#2563eb' } })}
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', color: '#0f172a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item.title}</h3>
                                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </RevealOnScroll>
            </section>

            {/* Footer CTA */}
            <section style={{ textAlign: 'center', maxWidth: '42rem', margin: '4.5rem auto', padding: '0 2rem', borderTop: '1px solid #e2e8f0', paddingTop: '4.5rem' }}>
                <RevealOnScroll>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                        Build Your Verified Aviation Identity
                    </h2>
                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 2.5rem' }}>
                        Join thousands of pilots who have transformed their careers with WingMentor's recognition system.
                        Start building your verified professional identity today.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <button
                            onClick={() => onNavigate('become-member')}
                            style={{ background: '#2563eb', color: '#ffffff', padding: '1rem 3rem', borderRadius: '9999px', fontWeight: 700, fontSize: '1.1rem', border: 'none', cursor: 'pointer', fontFamily: 'sans-serif', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
                        >
                            Start Your Journey
                        </button>
                        <button
                            onClick={onBack}
                            style={{ background: 'transparent', color: '#0f172a', padding: '1rem 3rem', borderRadius: '9999px', fontWeight: 700, fontSize: '1.1rem', border: '1px solid #e2e8f0', cursor: 'pointer', fontFamily: 'sans-serif', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            Back to Directory
                        </button>
                    </div>
                </RevealOnScroll>
            </section>
        </div>
    );
};
