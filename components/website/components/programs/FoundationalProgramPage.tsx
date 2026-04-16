import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { MentorshipLogbookAnimation } from './MentorshipLogbookAnimation';
import { ProgramStages } from './ProgramStages';

interface FoundationalProgramPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const FoundationalProgramPage: React.FC<FoundationalProgramPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out', paddingBottom: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '2rem' }}>
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <img src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain' }} />
                    </div>
                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                        FOUNDATION PROGRAM
                    </div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        Foundational Program
                    </h1>
                    <p style={{ color: '#475569', fontSize: '1.08rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '44rem' }}>
                        Structured training pathways from flight school to airline-ready professional. Explore our core foundational training and specialized career tracks.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>
                    {/* Foundation Program Description */}
                    <section style={{ textAlign: 'center', width: '100%', maxWidth: '56rem' }}>
                        <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.03)', borderRadius: '24px', padding: '3rem 2rem', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                OUR VISION
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Building Future Aviation Leaders
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '48rem', marginBottom: '2rem' }}>
                                The Foundation Program is aimed toward building your <strong>leadership skills through mentorship</strong>, aligned with <strong>AIRBUS EBT & CBTA core competencies</strong>. We are working directly with the Head of Training at Airbus, specialized in EBT/CBTA, to align future pilots to be EBT-prepared.
                            </p>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '48rem', marginBottom: '2rem' }}>
                                Flight school teaches you how to get your license—but don't expect to be teaching the same topics as an instructor. Expect <strong>pilot development</strong>. This program is <strong>free</strong> because we are building it first to gain recognition. The collaborative effort of experience will get seen by the industry.
                            </p>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '48rem', marginBottom: '2rem' }}>
                                When WingMentor Pilot Recognition approaches airlines, we will speak for the <strong>thousands of pilots under this program</strong> to gain recognition and meet the expectations from airlines. No more wondering and blindly finding a job on Facebook or a website with a job board with job requirements that hasn't been updated for years.
                            </p>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '48rem', marginBottom: '2rem' }}>
                                <strong>Say no more.</strong>
                            </p>
                            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(37, 99, 235, 0.2)' }}>
                                <p style={{ color: '#2563eb', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>
                                    This is the vision of pilotrecognition.com
                                </p>
                                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                                    — Benjamin Tiger Bowler & Karl Vogt, Founders
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Overview Cards with Images */}
                    <section style={{ textAlign: 'center', width: '100%', maxWidth: '56rem' }}>
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <img src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" alt="WingMentor Logo" style={{ maxWidth: '200px', height: 'auto', objectFit: 'contain' }} />
                        </div>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            PROGRAM OVERVIEW
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                            The Summarized Core Program Overview
                        </h2>

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)' }}>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#2563eb', borderBottom: '1px solid rgba(37, 99, 235, 0.1)' }}>
                                        #
                                    </th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#2563eb', borderBottom: '1px solid rgba(37, 99, 235, 0.1)' }}>
                                        Concept
                                    </th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#2563eb', borderBottom: '1px solid rgba(37, 99, 235, 0.1)' }}>
                                        Description
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.05)' }}>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top', color: '#2563eb', fontWeight: 600, fontSize: '0.875rem' }}>
                                        1
                                    </td>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top' }}>
                                        <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                            THE CONTEXT
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: '#0f172a', margin: '0 0 0.5rem 0', fontFamily: 'Georgia, serif' }}>
                                            The Pilot Gap
                                        </h3>
                                    </td>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
                                        Understand the pilot gap through <strong>Module 1</strong>, which contains <strong>5 chapters</strong> addressing the issues facing the current industry. The content is based on <strong>collaborative research</strong> and <strong>independent journalism</strong> within the aviation industry. You will learn about <strong>AIRBUS EBT CBTA core principles</strong> and how they align with the industry, understand <strong>pilot risk management</strong>, access a database of <strong>investment case studies of type ratings</strong>, and learn about <strong>pilot decision making (ADM)</strong>.
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.05)' }}>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top', color: '#2563eb', fontWeight: 600, fontSize: '0.875rem' }}>
                                        1.5
                                    </td>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top' }}>
                                        <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                            W1000 ACCESS
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: '#0f172a', margin: '0 0 0.5rem 0', fontFamily: 'Georgia, serif' }}>
                                            Application Access
                                        </h3>
                                    </td>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
                                        Prior to your examination, you will receive access to the <strong>W1000 application</strong>—a state-of-the-art software for pilot development featuring <strong>examination practice</strong>, <strong>core material</strong> for <strong>PPL, CPL, IR, and ME</strong>, examination reviewers, PowerPoint slides, video content, POH handbooks, an <strong>IFR Jeppesen Charts database</strong>, and <strong>IFR simulators</strong>. The Apps serve as a <strong>practical examination terminal</strong> for exam preparation—not the official examination. The <strong>Black Box</strong> contains PowerPoint presentations, core material, and the <strong>Simulator Room</strong>, which offers <strong>IFR simulation</strong> for practicing <strong>VOR homing</strong>, <strong>ILS landing approaches</strong>, <strong>G1000 system practice</strong>, and flight plan navigation. The <strong>official examination</strong> will take place on <strong>pilotrecognition.com</strong> in the <strong>examinations portal</strong>.
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.05)' }}>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top', color: '#2563eb', fontWeight: 600, fontSize: '0.875rem' }}>
                                        2
                                    </td>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top' }}>
                                        <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                            EXAMINATION
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: '#0f172a', margin: '0 0 0.5rem 0', fontFamily: 'Georgia, serif' }}>
                                            Examination
                                        </h3>
                                    </td>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
                                        Your <strong>first examination</strong> evaluates how well you know the industry and the chapters you have read. The initial pilot licensure examination uses integrated <strong>Gleims software</strong> for <strong>FAA/CAAP examinations</strong>. This examination will provide your first score, identifying areas where you are struggling and highlighting weaknesses based on <strong>recurrency</strong> through <strong>monthly examinations</strong> to stay current before mentorship. This will also create the first imprint on your <strong>pilot recognition profile</strong>—you may check the examination results as well as your profile score.
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.05)' }}>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top', color: '#2563eb', fontWeight: 600, fontSize: '0.875rem' }}>
                                        3
                                    </td>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top' }}>
                                        <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                            MENTORSHIP
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: '#0f172a', margin: '0 0 0.5rem 0', fontFamily: 'Georgia, serif' }}>
                                            Mentorship & Road to 50hrs Certification
                                        </h3>
                                    </td>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
                                        After your initial examination is complete, you will receive <strong>mentor modules</strong> to observe, learn, and view <strong>masterclasses</strong> on how to mentor fellow aviators. Mentorship is an <strong>effort-based approach</strong>—mentors who have completed <strong>20 hours of observation</strong> and passed their <strong>practical examination</strong> become <strong>missionaries</strong> who provide guidance and support to fellow members and pilots within the community. For your mentorship to be logged, your <strong>mentee</strong> (the person you are mentoring) must create an account through <strong>pilotrecognition.com</strong>, enabling you to access their profile and log their <strong>mentor ID</strong>. The mentee will receive a <strong>mentored hours count</strong> and a <strong>verified logbook of mentored hours</strong>. If you have received mentored hours, you will be required to complete only <strong>40 hours of mentorship</strong>. We also provide <strong>checkride practice</strong> where you will be tested on your knowledge—great for checkride preparation. The <strong>EBT CBTA Airbus Application</strong> focuses on evidence-based training for decision making, testing your ability to handle emergency situations and visual awareness with eye tracking to verify instrument scanning. <strong>VFR simulation</strong> is available for PPL students who want to master the basics of traffic patterns, radio communication, visual landing scenarios, and more. The <strong>program handbook</strong> includes all 3 modules, and the <strong>pilot gap forum</strong> provides access to the foundation program community where you can communicate with fellow mentees and mentors. <strong>WingMentor chat</strong> is accessible through the portal and the W1000 application, allowing you to converse with fellow members.
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top', color: '#2563eb', fontWeight: 600, fontSize: '0.875rem' }}>
                                        4
                                    </td>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top' }}>
                                        <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                            AIRBUS INTERVIEW
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: '#0f172a', margin: '0 0 0.5rem 0', fontFamily: 'Georgia, serif' }}>
                                            EBT Aligned Evaluation
                                        </h3>
                                    </td>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
                                        An <strong>AIRBUS interview</strong> based on an <strong>EBT-aligned evaluation</strong> of your <strong>pilot development</strong> and <strong>initial pilot recognition portfolio</strong>, along with a <strong>certificate of achievement</strong>. Once received initial pilot recognition, you may access pathways and compare your recognition credentials within our network consisting of jobs from pilotcareercenter.com, betterjobs.com and many more, along with direct relations with airlines expectations to review their requirements and access various pathways such as cadet programmes, cargo pathways, licensure & type rating pathways, specialized pathways and more!
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* Pilot Recognition Profile Section */}
                    <section style={{ textAlign: 'center', width: '100%', maxWidth: '56rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            YOUR PROFILE
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                            Your First Pilot Recognition Profile
                        </h2>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 auto', maxWidth: '42rem', marginBottom: '3rem' }}>
                            The Foundational Program creates your first verifiable pilot recognition profile—a digital identity that establishes your credibility across the aviation industry and unlocks multiple career pathways.
                        </p>

                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                        Building Your Profile
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                        Through the 10-stage program, every examination, mentorship session, and milestone is recorded in your Global Industry Registry profile. This creates a comprehensive, verifiable record of your professional development.
                                    </p>
                                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                        <li>Digital timestamps on all achievements</li>
                                        <li>Verified mentorship hours logged</li>
                                        <li>Examination outcomes archived</li>
                                        <li>Industry partner endorsements</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                        Unlocking Pathways
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                        Your pilot recognition profile becomes the key that opens doors to multiple career pathways. Airlines, operators, and industry partners use this verified profile to identify qualified candidates.
                                    </p>
                                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                        <li>Direct airline recruitment access</li>
                                        <li>Charter and corporate aviation opportunities</li>
                                        <li>Cargo operations pathways</li>
                                        <li>Advanced training program eligibility</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Mentorship Logbook Animation Section */}
                    <section style={{ width: '100%', maxWidth: '56rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            MENTORSHIP TRACKING
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                            Track Your Progress
                        </h2>
                        <MentorshipLogbookAnimation />
                    </section>

                    {/* Program Stages */}
                    <ProgramStages />

                    {/* CTA Section */}
                    <section style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '4rem 3rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'center', width: '100%', maxWidth: '56rem', boxSizing: 'border-box' }}>
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <img src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" alt="WingMentor Logo" style={{ maxWidth: '160px', height: 'auto', objectFit: 'contain' }} />
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

            {/* Back button */}
            <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={onBack}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem 2rem',
                        backgroundColor: '#0f172a',
                        color: 'white',
                        fontWeight: 700,
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <ArrowLeft style={{ width: '20px', height: '20px' }} />
                    Back to Home
                </button>
            </div>
        </div>
    );
};
