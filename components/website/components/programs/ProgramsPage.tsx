import React from 'react';
import { GraduationCap, Target, Globe, ChevronRight } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';

interface ProgramsPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    const corePrograms = [
        {
            title: "Foundational Program",
            desc: "The literal foundation of our pilot organization. Bridging the gap from 'I have a license' to 'I am a professional'.",
            target: "foundational-program",
            icon: GraduationCap
        },
        {
            title: "Transition Program",
            desc: "Designed for instructors and low-timers seeking to transition into multi-crew and jet environments.",
            target: "transition-program",
            icon: Target
        },
        {
            title: "Emirates ATPL Pathway",
            desc: "A specialized track for pilots seeking an Emirates‑standard ATPL and GCAA licensing standards.",
            target: "emirates-atpl",
            icon: Globe
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '2rem' }}>
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <img src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain' }} />
                    </div>
                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                        PROGRAMS
                    </div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        Foundation Program
                    </h1>
                    <p style={{ color: '#475569', fontSize: '1.08rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '44rem' }}>
                        Structured training pathways from flight school to airline-ready professional. Explore our core foundational training and specialized career tracks.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>
                    {/* Video Section */}
                    <section style={{ width: '100%', maxWidth: '56rem' }}>
                        <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', backgroundColor: '#020617', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.15)' }}>
                            <video
                                src="/images/My Movie 3 - 720WebShareName.mov"
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.25) 50%, rgba(15,23,42,0.55) 100%)' }} />
                        </div>
                    </section>

                    {/* Core Programs Section */}
                    <section style={{ textAlign: 'center', width: '100%', maxWidth: '56rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            CORE PROGRAMS
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2rem', fontFamily: 'Georgia, serif' }}>
                            Our Training Pathways
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                            {corePrograms.map((prog, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => onNavigate(prog.target)}
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                        borderRadius: '24px',
                                        padding: '2.5rem',
                                        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                        border: '1px solid rgba(255, 255, 255, 0.8)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        textAlign: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(15, 23, 42, 0.08)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 23, 42, 0.04)';
                                    }}
                                >
                                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '16px',
                                            backgroundColor: '#dbeafe',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#2563eb'
                                        }}>
                                            <prog.icon style={{ width: '28px', height: '28px' }} />
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                        {prog.title}
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                                        {prog.desc}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        color: '#2563eb',
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Learn More <ChevronRight style={{ width: '16px', height: '16px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Program Stages Breakdown */}
                    <section style={{ textAlign: 'center', width: '100%', maxWidth: '56rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            PROGRAM STRUCTURE
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                            Understanding Your Journey
                        </h2>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 auto', maxWidth: '42rem', marginBottom: '3rem' }}>
                            The Foundational Program consists of 10 comprehensive stages designed to build your skills progressively. Each stage builds upon the previous, leading to industry recognition and career placement.
                        </p>

                        {/* Stage 1 */}
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left', width: '100%', boxSizing: 'border-box', marginBottom: '2rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                STAGE 01
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                Initial Program Module
                            </h3>
                            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                A deep dive into the current status of the aviation industry and the pilot market. Understand the systemic gaps in training and employment that WingMentor addresses through its foundational indoctrination.
                            </p>
                            <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                <li>Current Industry Status and market analysis</li>
                                <li>Pilot Gap Market Analysis</li>
                                <li>Indoctrination Protocols</li>
                                <li>Risk management strategies</li>
                            </ul>
                        </div>

                        {/* Stage 2 */}
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left', width: '100%', boxSizing: 'border-box', marginBottom: '2rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                STAGE 02
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                Initial Examination Module
                            </h3>
                            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                After the initial induction, you must prepare for a knowledge assessment based on the industry information provided. Your baseline retention is evaluated using integrated FAA/CAAP standards to establish your first verified skills record.
                            </p>
                            <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                <li>Academic Bridge Knowledge</li>
                                <li>Baseline Retention assessment</li>
                                <li>Initial Skills Record establishment</li>
                                <li>FAA/CAAP integrated standards</li>
                            </ul>
                        </div>

                        {/* Stage 3 */}
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left', width: '100%', boxSizing: 'border-box', marginBottom: '2rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                STAGE 03
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                Global Industry Registry
                            </h3>
                            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                All examination outcomes are safely archived within the Global Industry Registry. This serves as your verifiable professional record, ensuring transparency and credibility for airline recruitment partners.
                            </p>
                            <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                <li>Centralized Professional Record</li>
                                <li>Recruitment Transparency</li>
                                <li>Pilot Recognition Metrics</li>
                                <li>Verifiable credential storage</li>
                            </ul>
                        </div>

                        {/* Stage 4 */}
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left', width: '100%', boxSizing: 'border-box', marginBottom: '2rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                STAGE 04
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                Mentorship Module
                            </h3>
                            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                Learn the core difference between instructing and mentoring. This stage focuses on self-assessment, issue-resolution techniques, and the pre-psychology of peer observation. Once received initial pilot recognition, you may access pathways and compare your recognition credentials within our network consisting of jobs from pilotcareercenter.com, betterjobs.com and many more, along with direct relations with airlines expectations to review their requirements and access various pathways such as cadet programmes, cargo pathways, licensure & type rating pathways, specialized pathways and more!
                            </p>
                            <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                <li>Mentorship Fundamentals</li>
                                <li>Psychological Awareness</li>
                                <li>Peer Observation Psychology</li>
                                <li>Self-assessment techniques</li>
                            </ul>
                        </div>

                        {/* Stage 5 */}
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left', width: '100%', boxSizing: 'border-box', marginBottom: '2rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                STAGE 05
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                Pre-Mentorship Examination & Observation
                            </h3>
                            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                Prior to your 20-hour official supervised phase, you must pass a pre-examination on mentorship knowledge and complete 10 hours of active peer mentorship observation.
                            </p>
                            <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                <li>Mentorship Prep Exam</li>
                                <li>Practical Interview</li>
                                <li>10hr Observation Requirement</li>
                                <li>Peer mentorship observation</li>
                            </ul>
                        </div>

                        {/* Stage 6 */}
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left', width: '100%', boxSizing: 'border-box', marginBottom: '2rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                STAGE 06
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                Supervised Mentorship
                            </h3>
                            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                Execute 20 hours of supervised, tracked peer mentorship. You must maintain highly detailed, objective logs delivering accurate problem-solving consultations and prescriptions.
                            </p>
                            <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                <li>20-Hour Mentorship Goal</li>
                                <li>Objective Logging</li>
                                <li>Consultation Delivery</li>
                                <li>Problem-solving prescriptions</li>
                            </ul>
                        </div>

                        {/* Stage 7 */}
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left', width: '100%', boxSizing: 'border-box', marginBottom: '2rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                STAGE 07
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                Accreditation & Professional Prescription
                            </h3>
                            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                Upon meeting criteria, your experience is accredited against industry standards recognized by major partners, authorizing you for advanced placement within the ecosystem.
                            </p>
                            <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                <li>Mentorship Evaluation</li>
                                <li>Industry Credentials</li>
                                <li>Advanced Ecosystem Placement</li>
                                <li>Partner accreditation</li>
                            </ul>
                        </div>

                        {/* Stage 8 */}
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left', width: '100%', boxSizing: 'border-box', marginBottom: '2rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                STAGE 08
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                Advanced Mentorship & Leadership Milestone
                            </h3>
                            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                Continue your mentorship to the 50-hour milestone to demonstrate sustained leadership and advanced instructional readiness within the WingMentor ecosystem.
                            </p>
                            <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                <li>50-Hour Milestone</li>
                                <li>Advanced Instruction Prep</li>
                                <li>Ecosystem Leadership</li>
                                <li>Sustained leadership demonstration</li>
                            </ul>
                        </div>

                        {/* Stage 9 */}
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left', width: '100%', boxSizing: 'border-box', marginBottom: '2rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                STAGE 09
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                AIRBUS Recognition Interview
                            </h3>
                            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                The final culmination of the program: the AIRBUS Recognition Interview. This rigorous assessment verifies your readiness for direct airline placement and official industry recognition.
                            </p>
                            <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                <li>Industry Evaluation</li>
                                <li>AIRBUS Recognition</li>
                                <li>Airline Placement Prep</li>
                                <li>Final competency assessment</li>
                            </ul>
                        </div>

                        {/* Stage 10 */}
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                STAGE 10
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                WingMentor Certification & Recognition
                            </h3>
                            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                Official certification of all mentorship hours and industry recognition. Your profile is now verified for our global airline partners and the industry registry.
                            </p>
                            <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                <li>Final Accreditation</li>
                                <li>Industry Endorsement</li>
                                <li>Registry Verification</li>
                                <li>Global airline partner access</li>
                            </ul>
                        </div>
                    </section>

                    {/* Overview Cards with Images */}
                    <section style={{ textAlign: 'center', width: '100%', maxWidth: '56rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            PROGRAM OVERVIEW
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                            Key Concepts
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    1. THE CONTEXT
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                    The Pilot Gap
                                </h3>
                                <img src="/images/pilot-gap.png" alt="The Pilot Gap" style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem' }} />
                                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                                    Maps the critical transition between flight school graduation and airline employment. This program provides recent graduates with essential hands-on experience, helping you maintain strict professional proficiency during extended hiring cycles.
                                </p>
                            </div>

                            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    2. THE GOAL
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                    Wingmentorship Approach
                                </h3>
                                <img src="https://lh3.googleusercontent.com/d/1hHcJHmG0pTPDuvgiv79l88VpPz_lOXi1" alt="Wingmentorship Approach" style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem' }} />
                                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                                    We create a database of vetting screened pilots based not just on flight hours, but on industry recognition through EBT & CBTA applications provided by Airbus, Foundational Program leadership skills, and our pilot recognition logging system.
                                </p>
                            </div>

                            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    3. RECOGNITION
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                    Pilot Recognition & Advocacy
                                </h3>
                                <img src="https://lh3.googleusercontent.com/d/1MfE9fiot6b9kCpgwQfc4aUY6e317nrUj" alt="Pilot Recognition & Advocacy" style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem' }} />
                                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                                    Your efforts and input won't go to waste. Your data is recognized by airlines, manufacturers, and industry insiders to give pilots what they really want: the chance to be seen.
                                </p>
                            </div>

                            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    4. THE DIFFERENCE
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                    Instructor vs WingMentor
                                </h3>
                                <img src="https://lh3.googleusercontent.com/d/1GyMG1004Ny93i4_ktGikIXgzy-FHiPBI" alt="Instructor vs WingMentor" style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem' }} />
                                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                                    Traditional instructors often struggle to support dozens of students simultaneously. WingMentors provide the one-on-one consultation and targeted problem-solving that large classrooms lack.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '4rem 3rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'center', width: '100%', maxWidth: '56rem', boxSizing: 'border-box' }}>
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <img src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png" alt="WingMentor Logo" style={{ maxWidth: '160px', height: 'auto', objectFit: 'contain' }} />
                        </div>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            YOUR JOURNEY BEGINS
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                            Ready to Start Your Journey?
                        </h2>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 auto', maxWidth: '42rem', marginBottom: '2rem' }}>
                            Join our global network of verified pilots and gain access to the industry's most specialized mentorship and tools.
                        </p>
                        <button
                            onClick={() => onNavigate('become-member')}
                            style={{
                                padding: '1rem 3rem',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                fontWeight: 700,
                                borderRadius: '9999px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                letterSpacing: '0.025em',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#1d4ed8';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#2563eb';
                            }}
                        >
                            Apply for Enrollment
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};
