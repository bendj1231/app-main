import React, { useEffect, useRef, useState } from 'react';

export const FoundationalProgramAnimation: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const animationRef = useRef<number | null>(null);
    const scrollPositionRef = useRef(0);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollSpeed = 0.8; // pixels per frame
        
        const animate = () => {
            if (!isPlaying) return;
            
            const container = scrollContainerRef.current;
            if (!container) return;

            scrollPositionRef.current += scrollSpeed;
            
            // Reset to top when reaching bottom
            if (scrollPositionRef.current >= container.scrollHeight - container.clientHeight) {
                scrollPositionRef.current = 0;
            }
            
            container.scrollTop = scrollPositionRef.current;
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const resetScroll = () => {
        scrollPositionRef.current = 0;
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    };

    return (
        <div 
            ref={scrollContainerRef}
            style={{
                width: '100vw',
                height: '100vh',
                overflow: 'auto',
                background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999,
            }}
        >
            {/* Recording Controls */}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                display: 'flex',
                gap: '1rem',
                zIndex: 10000,
            }}>
                <button
                    onClick={togglePlay}
                    style={{
                        padding: '1rem 2rem',
                        background: isPlaying ? '#ef4444' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button
                    onClick={resetScroll}
                    style={{
                        padding: '1rem 2rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                >
                    ↺ Reset
                </button>
            </div>

            {/* Main Content - Extended for scrolling */}
            <div style={{
                minHeight: '300vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4rem 2rem',
            }}>
                {/* Hub-Style Header */}
                <div style={{ 
                    textAlign: 'center', 
                    paddingBottom: '3.5rem', 
                    paddingTop: '4rem',
                    maxWidth: '900px'
                }}>
                    <div style={{ 
                        marginBottom: '2rem', 
                        display: 'flex', 
                        justifyContent: 'center',
                        animation: 'fadeInDown 1s ease-out'
                    }}>
                        <img 
                            src="/logo.png" 
                            alt="WingMentor Logo" 
                            style={{ 
                                maxWidth: '320px', 
                                height: 'auto', 
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 4px 20px rgba(37, 99, 235, 0.2))'
                            }} 
                        />
                    </div>
                    <div style={{ 
                        color: '#2563eb', 
                        fontWeight: 700, 
                        fontSize: '1rem', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.3em', 
                        marginBottom: '1.5rem',
                        animation: 'fadeInUp 1s ease-out 0.3s both'
                    }}>
                        MODULE 01
                    </div>
                    <h1 style={{ 
                        fontFamily: 'Georgia, serif', 
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
                        fontWeight: 400, 
                        color: '#0f172a', 
                        margin: '0 0 1.5rem 0', 
                        lineHeight: 1.2, 
                        letterSpacing: '-0.02em',
                        animation: 'fadeInUp 1s ease-out 0.5s both'
                    }}>
                        Industry Familiarization &<br />Indoctrination
                    </h1>
                </div>

                {/* Welcome Section */}
                <section style={{ 
                    textAlign: 'center', 
                    maxWidth: '800px', 
                    marginTop: '3rem',
                    padding: '4rem 2rem',
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                }}>
                    <div style={{ 
                        color: '#2563eb', 
                        fontSize: '1rem', 
                        fontWeight: 700, 
                        letterSpacing: '0.3em', 
                        textTransform: 'uppercase', 
                        marginBottom: '1.5rem'
                    }}>
                        INTRODUCTION
                    </div>
                    <h2 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 400, 
                        color: '#0f172a', 
                        marginBottom: '2rem', 
                        fontFamily: 'Georgia, serif'
                    }}>
                        Welcome Aboard, Future Aviator
                    </h2>
                    <p style={{ 
                        color: '#475569', 
                        fontSize: '1.25rem', 
                        lineHeight: 1.9, 
                        margin: '0 auto',
                        maxWidth: '700px'
                    }}>
                        You've chosen to step beyond the standard pilot career path. The WingMentor Foundational Program 
                        is your bridge from "low-timer" to recognized professional. This module will ground you in 
                        the realities of our industry, the paradox of the pilot shortage, and the precise framework 
                        WingMentor uses to turn your training hours into verifiable industry recognition.
                    </p>
                </section>

                {/* Content Sections for Extended Scroll */}
                <section style={{
                    maxWidth: '800px',
                    marginTop: '6rem',
                    padding: '4rem 2rem',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    borderRadius: '24px',
                    color: 'white',
                }}>
                    <h3 style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '2rem',
                        fontWeight: 400,
                        marginBottom: '1.5rem',
                        color: '#60a5fa'
                    }}>
                        The Pilot Gap
                    </h3>
                    <p style={{
                        fontSize: '1.15rem',
                        lineHeight: 1.8,
                        color: '#cbd5e1',
                        marginBottom: '2rem'
                    }}>
                        Understanding the critical transition between flight school graduation and airline employment. 
                        This program provides recent graduates with essential hands-on experience, helping you maintain 
                        strict professional proficiency during extended hiring cycles.
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1.5rem',
                        marginTop: '2rem'
                    }}>
                        {['Industry Status', 'Market Analysis', 'Indoctrination', 'Risk Management'].map((item, i) => (
                            <div key={i} style={{
                                padding: '1.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <span style={{ color: '#60a5fa', fontWeight: 600 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Program Overview */}
                <section style={{
                    maxWidth: '800px',
                    marginTop: '6rem',
                    padding: '4rem 2rem',
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        color: '#2563eb',
                        fontSize: '1rem',
                        fontWeight: 700,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem'
                    }}>
                        PROGRAM OVERVIEW
                    </div>
                    <h3 style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '2rem',
                        fontWeight: 400,
                        marginBottom: '2rem',
                        color: '#0f172a'
                    }}>
                        Building Your Foundation
                    </h3>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        textAlign: 'left'
                    }}>
                        {[
                            {
                                title: 'Industry Recognition',
                                desc: 'Gain credentials trusted by airlines and operators worldwide through our AIRBUS, Etihad & Archer partnerships.'
                            },
                            {
                                title: 'Verifiable Experience',
                                desc: 'Build a data-driven portfolio with digital signatures and timestamps that airlines demand.'
                            },
                            {
                                title: 'Mentorship Integration',
                                desc: 'Learn the core difference between instructing and mentoring with structured peer observation.'
                            },
                            {
                                title: 'Career Pathway Planning',
                                desc: 'Navigate from low-timer to professional with clear milestones and industry-aligned competencies.'
                            }
                        ].map((item, i) => (
                            <div key={i} style={{
                                padding: '2rem',
                                background: '#f8fafc',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <h4 style={{
                                    color: '#0f172a',
                                    fontWeight: 600,
                                    fontSize: '1.2rem',
                                    marginBottom: '0.75rem'
                                }}>{item.title}</h4>
                                <p style={{ color: '#64748b', lineHeight: 1.7 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section style={{
                    maxWidth: '800px',
                    marginTop: '6rem',
                    marginBottom: '8rem',
                    padding: '4rem 3rem',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    borderRadius: '24px',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <h3 style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '2.5rem',
                        fontWeight: 400,
                        marginBottom: '1.5rem'
                    }}>
                        Ready to Begin?
                    </h3>
                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: 1.8,
                        opacity: 0.9,
                        maxWidth: '600px',
                        margin: '0 auto 2rem'
                    }}>
                        Your journey from licensed pilot to recognized professional starts here. 
                        Join the WingMentor Foundational Program and bridge the gap to your aviation career.
                    </p>
                    <div style={{
                        padding: '1rem 2rem',
                        background: 'white',
                        color: '#2563eb',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        display: 'inline-block'
                    }}>
                        Enroll Now
                    </div>
                </section>

                {/* Spacer for smooth loop */}
                <div style={{ height: '50vh' }} />
            </div>

            <style>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default FoundationalProgramAnimation;
