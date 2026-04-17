import React, { useState } from 'react';
import { Icons } from '../icons';
import { ShaderCloud } from '../../components/website/components/home/ShaderCloud';

interface PostEnrollmentSlideshowProps {
    onComplete: () => void;
}

export const PostEnrollmentSlideshow: React.FC<PostEnrollmentSlideshowProps> = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "The Pilot Gap",
            subtitle: "Phase 1: The Context",
            content: "Understand the pilot gap through Module 1, which contains 5 chapters addressing the issues facing the current industry. The content is based on collaborative research and independent journalism within the aviation industry. You will learn about AIRBUS EBT CBTA core principles and how they align with the industry, understand pilot risk management, access a database of investment case studies of type ratings, and learn about pilot decision making (ADM).",
            points: [
                "Learn about AIRBUS EBT CBTA core principles and industry alignment",
                "Understand pilot risk management strategies",
                "Access database of investment case studies for type ratings",
                "Master pilot decision making (ADM) concepts"
            ],
            icon: <Icons.BookOpen style={{ width: 48, height: 48 }} />
        },
        {
            title: "Application Access",
            subtitle: "Phase 1.5: W1000 Access",
            content: "Prior to your examination, you will receive access to the W1000 application—a state-of-the-art software for pilot development featuring examination practice, core material for PPL, CPL, IR, and ME, examination reviewers, PowerPoint slides, video content, POH handbooks, an IFR Jeppesen Charts database, and IFR simulators.",
            points: [
                "Access examination practice and core material for PPL, CPL, IR, and ME",
                "Utilize examination reviewers and video content",
                "Access POH handbooks and IFR Jeppesen Charts database",
                "Practice with IFR simulators for VOR homing, ILS approaches, and G1000"
            ],
            icon: <Icons.Monitor style={{ width: 48, height: 48 }} />
        },
        {
            title: "Examination",
            subtitle: "Phase 2: Examination",
            content: "Your first examination evaluates how well you know the industry and the chapters you have read. The initial pilot licensure examination uses integrated Gleims software for FAA/CAAP examinations. This examination will provide your first score, identifying areas where you are struggling and highlighting weaknesses based on recurrency through monthly examinations.",
            points: [
                "Complete initial pilot licensure examination using Gleims software",
                "Receive your first score and identify areas for improvement",
                "Stay current with monthly recurrency examinations",
                "Create first imprint on your pilot recognition profile"
            ],
            icon: <Icons.Cpu style={{ width: 48, height: 48 }} />
        },
        {
            title: "Mentorship & Road to 50hrs Certification",
            subtitle: "Phase 3: Mentorship",
            content: "After your initial examination is complete, you will receive mentor modules to observe, learn, and view masterclasses on how to mentor fellow aviators. Mentorship is an effort-based approach—mentors who have completed 20 hours of observation and passed their practical examination become missionaries who provide guidance and support to fellow members and pilots within the community.",
            points: [
                "Complete 20 hours of mentorship observation",
                "Pass practical examination to become a missionary",
                "Log mentored hours through pilotrecognition.com",
                "Access checkride practice for checkride preparation"
            ],
            icon: <Icons.Users style={{ width: 48, height: 48 }} />
        },
        {
            title: "EBT Aligned Evaluation",
            subtitle: "Phase 4: Airbus Interview",
            content: "An AIRBUS interview based on an EBT-aligned evaluation of your pilot development and initial pilot recognition portfolio, along with a certificate of achievement. Once received initial pilot recognition, you may access pathways and compare your recognition credentials within our network consisting of jobs from pilotcareercenter.com, betterjobs.com and many more.",
            points: [
                "Complete EBT-aligned AIRBUS interview evaluation",
                "Receive certificate of achievement and initial pilot recognition",
                "Access pathways network with pilotcareercenter.com and betterjobs.com",
                "Review airline expectations and access cadet programmes, cargo pathways, and specialized pathways"
            ],
            icon: <Icons.Award style={{ width: 48, height: 48 }} />
        }
    ];

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onComplete();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <div className="dashboard-container animate-fade-in" style={{ zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', height: '100vh' }}>
                <div style={{ height: '100vh', width: '100%' }}>
                    <ShaderCloud />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30" />
            </div>
            <main className="dashboard-card" style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 'auto',
                maxHeight: '85vh',
                padding: 0,
                maxWidth: '750px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
            }}>
                {/* Progress Bar */}
                <div style={{ display: 'flex', width: '100%', height: '6px', backgroundColor: '#f1f5f9' }}>
                    <div style={{
                        height: '100%',
                        width: `${((currentSlide + 1) / slides.length) * 100}%`,
                        backgroundColor: '#2563eb',
                        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}></div>
                </div>

                {/* Slides content area */}
                <div style={{ padding: '2.5rem 2.5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', overflow: 'auto' }}>
                    <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                        <div className="dashboard-logo" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '90px', height: 'auto' }} />
                        </div>

                        <div className="dashboard-subtitle">
                            {slides[currentSlide].subtitle}
                        </div>

                        <h1 className="dashboard-title" style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                            {slides[currentSlide].title}
                        </h1>

                        <p style={{ maxWidth: '550px', margin: '0 auto', fontSize: '0.95rem', color: '#475569', lineHeight: 1.5 }}>
                            {slides[currentSlide].content}
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '480px', textAlign: 'center', margin: '0 auto' }}>
                        <div style={{
                            padding: '1.25rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
                        }}>
                            {slides[currentSlide].points.map((point, index) => (
                                <div key={index} className="animate-fade-in" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', animationDelay: `${index * 0.15}s`, marginBottom: index < slides[currentSlide].points.length - 1 ? '0.8rem' : '0' }}>
                                    <div style={{ marginTop: '0.1rem', color: '#10b981' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <p style={{ margin: 0, color: '#334155', fontSize: '0.875rem', lineHeight: 1.4, textAlign: 'left' }}>{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div style={{ padding: '1.25rem 2.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
                    <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        style={{
                            flex: 1,
                            padding: '0.6rem 1.25rem',
                            borderRadius: '10px',
                            backgroundColor: currentSlide === 0 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(12px)',
                            border: currentSlide === 0 ? '1px solid rgba(148, 163, 184, 0.3)' : '1px solid rgba(226, 232, 240, 0.8)',
                            boxShadow: currentSlide === 0 ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                            color: currentSlide === 0 ? '#94a3b8' : '#475569',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: currentSlide === 0 ? 0.5 : 1,
                            maxWidth: '110px'
                        }}
                        onMouseOver={(e) => {
                            if (currentSlide !== 0) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Icons.ArrowLeft style={{ width: 14, height: 14, marginRight: '0.4rem', display: 'inline', verticalAlign: 'middle' }} />
                        Back
                    </button>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {slides.map((_, i) => (
                            <div key={i} style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: i === currentSlide ? '#2563eb' : '#cbd5e1',
                                transition: 'background-color 0.3s'
                            }}></div>
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        disabled={currentSlide === slides.length - 1}
                        style={{
                            flex: 1,
                            padding: '0.6rem 1.25rem',
                            borderRadius: '10px',
                            backgroundColor: currentSlide === slides.length - 1 ? 'rgba(148, 163, 184, 0.3)' : '#2563eb',
                            backdropFilter: 'blur(12px)',
                            border: currentSlide === slides.length - 1 ? '1px solid rgba(148, 163, 184, 0.3)' : '1px solid #2563eb',
                            boxShadow: currentSlide === slides.length - 1 ? 'none' : '0 8px 32px rgba(37, 99, 235, 0.3)',
                            color: currentSlide === slides.length - 1 ? '#94a3b8' : '#ffffff',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: currentSlide === slides.length - 1 ? 0.5 : 1,
                            maxWidth: '110px'
                        }}
                        onMouseOver={(e) => {
                            if (currentSlide !== slides.length - 1) {
                                e.currentTarget.style.backgroundColor = '#1d4ed8';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563eb';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Next
                        <Icons.ArrowRight style={{ width: 14, height: 14, marginLeft: '0.4rem', display: 'inline', verticalAlign: 'middle' }} />
                    </button>
                </div>
            </main>
        </div>
    );
};
