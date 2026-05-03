import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Home } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { ProgramStages } from './ProgramStages';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema';
import { FoundationLoadingScreen } from './FoundationLoadingScreen';

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
    const { currentUser, refreshUserProfile } = useAuth();
    const isLoggedIn = !!currentUser;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const [showEnrollmentLoading, setShowEnrollmentLoading] = useState(false);
    const enrollmentSuccessRef = useRef(false);

    const carouselSlides = [
        {
            src: '/images/pilot-gap.png',
            alt: 'The Pilot Gap Challenge',
            caption: 'The Pilot Gap — where most pilots exit the profession',
            header: 'The Pilot Shortage Paradox',
            breakdown: 'Airlines claim they need pilots, yet thousands of qualified low-timers never get a response. The disconnect between training and industry requirements creates a bottleneck that stalls careers before they begin.',
            moduleRef: 'Chapter 01 — Understanding the What\'s',
            moduleExcerpt: 'Before we can solve the recognition gap, we must first understand the terminology and landscape. This chapter breaks down the fundamental concepts every pilot must grasp to navigate today\'s aviation industry successfully.'
        },
        {
            src: '/the-pilot-gap.png',
            alt: 'Four Floor Tower',
            caption: 'The four-floor tower — collapsing at every level',
            header: 'The Collapsing Pipeline',
            breakdown: 'From fresh graduates stuck at 200 hours, to instructors with 15 years of experience, to seasoned captains trapped by seniority — every floor of this tower is failing. The system was not built for pilot recognition.',
            moduleRef: 'Module 01 — Industry Familiarization & Indoctrination',
            moduleExcerpt: 'Ground yourself in the realities of our industry, the paradox of the pilot shortage, and the precise framework PilotRecognition uses to turn your training hours into verifiable industry recognition.'
        },
        {
            src: '/unclogging-pipes-pilot-gap.png',
            alt: 'Unclogging the Pipeline',
            caption: 'Unclogging the pipeline — why pilots get stuck and how recognition helps',
            header: 'Why Pilots Get Stuck',
            breakdown: 'The pipeline is clogged because there is no standard for recognizing pilot competency beyond flight hours. Without a verified profile, airlines cannot identify who is truly ready — and pilots have no visibility into what they are missing.',
            moduleRef: 'Chapter 04 — The Solution',
            moduleExcerpt: 'Our solution combines verified training milestones, industry recognition protocols, and mentorship frameworks to create a clear pathway from low-time pilot to aviation professional.'
        },
        {
            src: '/candidates-pilot-gap.png',
            alt: 'Candidate Pool',
            caption: 'Why flight hours alone are no longer enough',
            header: 'Flight Hours Are No Longer Enough',
            breakdown: 'The industry has shifted from hour-counting to competency-based assessment. Airlines now look for evidence of leadership, decision-making under pressure, and structured mentorship — none of which appear on a logbook.',
            moduleRef: 'Chapter 01 — Understanding the What\'s',
            moduleExcerpt: 'We explore the low-timer paradox, the myth of the pilot shortage, and what "Pilot Recognition" actually means in an industry that still operates on outdated signals.'
        },
        {
            src: '/financial-drain-pilot-gap.jpg',
            alt: 'Financial Investment',
            caption: 'The $50,000 training investment and its real return',
            header: 'The $50,000 Training Trap',
            breakdown: 'Pilots invest $50,000+ in training with the promise of an airline job that never materializes. Years later, they are still instructing, still waiting, still invisible to the industry they trained to serve.',
            moduleRef: 'Module 01 — Welcome Aboard',
            moduleExcerpt: 'You\'ve chosen to step beyond the standard pilot career path. The PilotRecognition Foundational Program is your bridge from "low-timer" to recognized professional.'
        }
    ];

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, [carouselSlides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    }, [carouselSlides.length]);

    useEffect(() => {
        if (!autoPlay) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide, autoPlay]);

    const handlePrev = () => {
        setAutoPlay(false);
        prevSlide();
    };

    const handleNext = () => {
        setAutoPlay(false);
        nextSlide();
    };

    const handleDot = (index: number) => {
        setAutoPlay(false);
        setCurrentSlide(index);
    };

    const handleApplyEnrollment = async () => {
        if (!currentUser?.uid) {
            onNavigate('become-member');
            return;
        }
        setShowEnrollmentLoading(true);
        try {
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('enrolled_programs')
                .eq('id', currentUser.uid)
                .maybeSingle();
            const currentPrograms = existingProfile?.enrolled_programs || [];
            const updatedPrograms = currentPrograms.includes('Foundational')
                ? currentPrograms
                : [...currentPrograms, 'Foundational'];
            const { error } = await supabase
                .from('profiles')
                .update({ enrolled_programs: updatedPrograms })
                .eq('id', currentUser.uid);
            if (error) {
                console.error('Profile update error details:', error);
                throw error;
            }
            await supabase.from('notifications').insert({
                user_id: currentUser.uid,
                title: 'Congratulations!',
                message: 'You have now been enrolled in the Foundation Program. Welcome aboard!',
                type: 'success',
                is_read: false,
            });
            // Refresh user profile to update enrollment state immediately
            if (refreshUserProfile) {
                await refreshUserProfile();
            }
            enrollmentSuccessRef.current = true;
        } catch (err) {
            console.error('Enrollment error:', err);
            enrollmentSuccessRef.current = false;
        }
    };

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Programs', url: '/programs' },
                { name: 'Foundational Program', url: '/foundational-program' }
            ]} />
            <div className="min-h-screen bg-white text-slate-900 font-sans">
                {/* Home Button */}
                <button
                    onClick={() => onNavigate('home')}
                    className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-all text-slate-700 text-sm font-medium"
                    aria-label="Go to home"
                >
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Home</span>
                </button>

            <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out', paddingBottom: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '2rem' }}>
                    {/* Logo */}
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="PilotRecognition"
                        style={{ height: '96px', width: 'auto', objectFit: 'contain', margin: '0 auto 1.5rem' }}
                    />
                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                        FOUNDATION PROGRAM
                    </div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        Foundational Program
                    </h1>
                    <p style={{ color: '#475569', fontSize: '1.08rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '44rem' }}>
                        Pilots invest $50,000 and 4 years in training. The industry lacks a standardized way to recognize professional capabilities. The Foundational Program provides the recognition framework you need to connect your investment to career opportunity.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <button
                            onClick={handleApplyEnrollment}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
                        >
                            <CheckCircle className="w-5 h-5" />
                            {isLoggedIn ? 'Apply Enrollment' : 'Enroll Now'}
                        </button>
                    </div>
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
                                The Foundation Program is aimed toward building your <strong>leadership skills through mentorship</strong>, aligned with <strong>EBT CBTA core competencies</strong> used in aviation training worldwide. We review our curriculum against international competency standards to prepare pilots for industry expectations.
                            </p>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '48rem', marginBottom: '2rem' }}>
                                Flight school teaches you how to get your license—but don't expect to be teaching the same topics as an instructor. Expect <strong>pilot development</strong>. This program is <strong>free to enter</strong> and includes 50 hours of verified mentorship, competency assessment, and pathway access. Pay only when you're ready to certify. We are actively building the pilot community and operator network.
                            </p>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '48rem', marginBottom: '2rem' }}>
                                As the community grows, your verified competency profile and recognition score help demonstrate your readiness to operators. No more wondering and blindly finding a job on Facebook or a website with a job board with job requirements that hasn't been updated for years.
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

                    {/* Context Banner */}
                    <section style={{ width: '100%', maxWidth: '56rem' }}>
                        <div style={{ backgroundColor: '#0f172a', padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
                            <p style={{ color: '#ffffff', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                                Module 1 teaches you the industry reality. Your examination creates your baseline recognition score. Mentorship builds recognized experience. Every hour logged contributes to your recognition profile.
                            </p>
                        </div>
                    </section>

                    {/* Overview Cards with Images */}
                    <section style={{ textAlign: 'center', width: '100%', maxWidth: '56rem' }}>
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
                                        Understand the pilot gap through <strong>Module 1</strong>, which contains <strong>5 chapters</strong> addressing the issues facing the current industry. The content is based on <strong>collaborative research</strong> and <strong>independent journalism</strong> within the aviation industry. You will learn about <strong>EBT CBTA core principles</strong> and how they align with the industry, understand <strong>pilot risk management</strong>, access a database of <strong>investment case studies of type ratings</strong>, and learn about <strong>pilot decision making (ADM)</strong>.
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
                                        After your initial examination is complete, you will receive <strong>mentor modules</strong> to observe, learn, and view <strong>masterclasses</strong> on how to mentor fellow aviators. Mentorship is an <strong>effort-based approach</strong>—mentors who have completed <strong>20 hours of observation</strong> and passed their <strong>practical examination</strong> provide guidance and support to fellow members. The <strong>EBT CBTA-oriented mentorship cores</strong> focus on evidence-based training for decision making, competency development, and handling emergency situations. For your mentorship to be logged, your <strong>mentee</strong> (the person you are mentoring) must create an account through <strong>pilotrecognition.com</strong>, enabling you to access their profile and log their <strong>mentor ID</strong>. The mentee will receive a <strong>mentored hours count</strong> and a <strong>verified logbook of mentored hours</strong>. If you have received mentored hours, you will be required to complete only <strong>40 hours of mentorship</strong>. We also provide <strong>checkride practice</strong> where you will be tested on your knowledge—great for checkride preparation. The <strong>program handbook</strong> includes all 3 modules, and the <strong>pilot gap forum</strong> provides access to the foundation program community where you can communicate with fellow mentees and mentors. <strong>PilotRecognition chat</strong> is accessible through the portal and the W1000 application, allowing you to converse with fellow members.
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top', color: '#2563eb', fontWeight: 600, fontSize: '0.875rem' }}>
                                        4
                                    </td>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top' }}>
                                        <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                            FINAL EVALUATION
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: '#0f172a', margin: '0 0 0.5rem 0', fontFamily: 'Georgia, serif' }}>
                                            EBT Aligned Evaluation
                                        </h3>
                                    </td>
                                    <td style={{ padding: '1.5rem', verticalAlign: 'top', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
                                        An EBT CBTA-aligned evaluation of your pilot development and initial pilot recognition portfolio, along with a certificate of achievement. Upon completion, you may access pathway cards—not job listings. Pathway cards show requirements and what you're missing. Compare your recognition credentials within our platform, access cadet programmes, cargo pathways, licensure & type rating pathways, and specialized pathways aligned with your verified competencies.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* Context Banner */}
                    <section style={{ width: '100%', maxWidth: '56rem' }}>
                        <div style={{ backgroundColor: '#2563eb', padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
                            <p style={{ color: '#ffffff', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                                Your recognition score improves your pathway matching priority. Pathways are available to all users. We bridge the gap between training investment and career opportunity.
                            </p>
                        </div>
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
                                        Through the program, every examination, mentorship session, and milestone is recorded in your PilotRecognition profile. This creates a comprehensive, verifiable record of your professional development.
                                    </p>
                                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                        <li>Digital timestamps on all achievements</li>
                                        <li>Verified mentorship hours logged</li>
                                        <li>Examination outcomes archived</li>
                                        <li>Competency score tracking</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                        Unlocking Pathways
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                        Your pilot recognition profile shows your verified competencies and helps you identify career pathways that match your qualifications. As operators join the platform, your verified profile improves your matching priority.
                                    </p>
                                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                                        <li>Pathway requirements and gap analysis</li>
                                        <li>Charter and corporate aviation pathways</li>
                                        <li>Cargo operations pathways</li>
                                        <li>Advanced training program eligibility</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pilot Gap Module Showcase Carousel */}
                    <section style={{ width: '100%', maxWidth: '56rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            EXPLORE THE PILOT GAP
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'Georgia, serif' }}>
                            What You&apos;ll Learn in Module 1
                        </h2>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 auto', maxWidth: '42rem', marginBottom: '2rem' }}>
                            Five chapters on the realities facing pilots today — from the investment trap to career pathways.
                        </p>

                        {/* Image Carousel — Cross-fade */}
                        <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.08)', height: '560px' }}>
                            {carouselSlides.map((slide, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        opacity: currentSlide === index ? 1 : 0,
                                        transition: 'opacity 0.6s ease-in-out',
                                        zIndex: currentSlide === index ? 1 : 0,
                                        backgroundColor: '#0f172a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(to bottom, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.4) 60%, transparent 100%)',
                                        padding: '1.25rem 1.5rem 3rem',
                                        zIndex: 2,
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600, margin: 0, textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                                            {slide.caption}
                                        </p>
                                    </div>
                                    <img
                                        src={slide.src}
                                        alt={slide.alt}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                                        loading="lazy"
                                    />
                                </div>
                            ))}

                            {/* Navigation Arrows */}
                            <button
                                onClick={handlePrev}
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.9)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '44px',
                                    height: '44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                    transition: 'all 0.2s ease',
                                    zIndex: 10
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                                aria-label="Previous slide"
                            >
                                <ChevronLeft style={{ width: '22px', height: '22px', color: '#0f172a' }} />
                            </button>
                            <button
                                onClick={handleNext}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.9)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '44px',
                                    height: '44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                    transition: 'all 0.2s ease',
                                    zIndex: 10
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                                aria-label="Next slide"
                            >
                                <ChevronRight style={{ width: '22px', height: '22px', color: '#0f172a' }} />
                            </button>

                            {/* Dot Indicators */}
                            <div style={{
                                position: 'absolute',
                                bottom: '1rem',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                gap: '0.5rem',
                                background: 'rgba(15,23,42,0.4)',
                                padding: '0.4rem 0.75rem',
                                borderRadius: '9999px',
                                zIndex: 10
                            }}>
                                {carouselSlides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleDot(index)}
                                        style={{
                                            width: index === currentSlide ? '24px' : '8px',
                                            height: '8px',
                                            borderRadius: '9999px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            background: index === currentSlide ? '#2563eb' : 'rgba(255,255,255,0.6)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Context Panel — Floating text below, cross-fades with image */}
                        <div style={{ position: 'relative', marginTop: '1.5rem', minHeight: '260px' }}>
                            {carouselSlides.map((slide, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: index === 0 ? 'relative' : 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        opacity: currentSlide === index ? 1 : 0,
                                        transition: 'opacity 0.6s ease-in-out',
                                        zIndex: currentSlide === index ? 1 : 0,
                                        pointerEvents: currentSlide === index ? 'auto' : 'none'
                                    }}
                                >
                                    <div style={{ backgroundColor: '#ffffff', padding: '2rem 2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)' }}>
                                        <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                            PILOT GAP MODULE — {slide.moduleRef}
                                        </div>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem', fontFamily: 'Georgia, serif', lineHeight: 1.3 }}>
                                            {slide.header}
                                        </h3>
                                        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                                            {slide.breakdown}
                                        </p>
                                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '1.25rem 1.5rem', borderLeft: '3px solid #2563eb' }}>
                                            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                                                &ldquo;{slide.moduleExcerpt}&rdquo;
                                            </p>
                                        </div>
                                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '1rem', marginBottom: 0 }}>
                                            You will learn more about the causes and effects of this crisis in the industry — and what is currently happening to pilots like you.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Program Stages */}
                    <ProgramStages />

                    {/* CTA Section */}
                    <section style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '4rem 3rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'center', width: '100%', maxWidth: '56rem', boxSizing: 'border-box' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            YOUR JOURNEY BEGINS
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                            Ready to Start Your Journey?
                        </h2>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 auto', maxWidth: '42rem', marginBottom: '2rem' }}>
                            Join our pilot community and gain access to verified mentorship, competency assessment, and pathway tools.
                        </p>
                        <button
                            onClick={handleApplyEnrollment}
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

            {/* Enrollment Loading Overlay */}
            {showEnrollmentLoading && (
                <FoundationLoadingScreen
                    onComplete={() => {
                        setShowEnrollmentLoading(false);
                        if (enrollmentSuccessRef.current) {
                            sessionStorage.setItem('enrollmentSuccess', 'true');
                            onNavigate('home');
                        }
                    }}
                />
            )}
        </>
    );
};
