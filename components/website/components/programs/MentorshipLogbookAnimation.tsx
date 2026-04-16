import React, { useEffect, useRef, useState } from 'react';

export const MentorshipLogbookAnimation: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const animationRef = useRef<number | null>(null);
    const scrollPositionRef = useRef(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollSpeed = 0.5;
        
        const animate = () => {
            if (!isPlaying) return;
            
            const container = containerRef.current;
            if (!container) return;

            scrollPositionRef.current += scrollSpeed;
            
            if (scrollPositionRef.current >= container.scrollHeight - container.clientHeight) {
                scrollPositionRef.current = 0;
            }
            
            container.scrollTop = scrollPositionRef.current;
            
            // Update progress percentage
            const progressPercent = Math.min((scrollPositionRef.current / (container.scrollHeight - container.clientHeight)) * 100, 100);
            setProgress(progressPercent);
            
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
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    };

    return (
        <div 
            ref={containerRef}
            style={{
                width: '100%',
                height: '400px',
                overflow: 'auto',
                background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '24px',
                position: 'relative',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}
        >
            <style>{`
                #mentorship-animation::-webkit-scrollbar {
                    display: none;
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.6;
                    }
                }
            `}</style>

            {/* Progress Bar */}
            <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'rgba(37, 99, 235, 0.2)',
                zIndex: 10
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
                    transition: 'width 0.1s linear'
                }} />
            </div>

            {/* Controls */}
            <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                display: 'flex',
                gap: '0.5rem',
                zIndex: 10
            }}>
                <button
                    onClick={togglePlay}
                    style={{
                        padding: '0.5rem 1rem',
                        background: isPlaying ? '#ef4444' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                    onClick={resetScroll}
                    style={{
                        padding: '0.5rem 1rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    ↺
                </button>
            </div>

            {/* Content */}
            <div style={{
                minHeight: '800px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    animation: 'slideIn 0.5s ease-out'
                }}>
                    <div style={{
                        color: '#2563eb',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem'
                    }}>
                        MENTORSHIP LOGBOOK
                    </div>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 400,
                        color: '#0f172a',
                        margin: 0,
                        fontFamily: 'Georgia, serif'
                    }}>
                        Track Your Progress
                    </h3>
                </div>

                {/* Progress Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    animation: 'slideIn 0.5s ease-out 0.1s both'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                                Mentorship Hours
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                Track your 50-hour certification goal
                            </div>
                        </div>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: '#2563eb',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}>
                            0 / 50
                        </div>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '8px',
                        background: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '0%',
                            height: '100%',
                            background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>

                {/* Session Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    animation: 'slideIn 0.5s ease-out 0.2s both'
                }}>
                    <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        marginBottom: '1rem'
                    }}>
                        Sample Session Entry
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Date</div>
                            <div style={{ color: '#0f172a', fontWeight: 500 }}>Mar 20, 2026</div>
                        </div>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Hours</div>
                            <div style={{ color: '#0f172a', fontWeight: 500 }}>2.5 hrs</div>
                        </div>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Mentor</div>
                            <div style={{ color: '#0f172a', fontWeight: 500 }}>Capt. Sarah</div>
                        </div>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Status</div>
                            <div style={{
                                color: '#22c55e',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                background: '#dcfce7',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '9999px',
                                display: 'inline-block'
                            }}>
                                Verified
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    animation: 'slideIn 0.5s ease-out 0.3s both'
                }}>
                    <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        marginBottom: '1rem'
                    }}>
                        Logbook Features
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        {[
                            'Track mentorship hours in real-time',
                            'Log consultations and prescriptions',
                            'Double-verification system',
                            'Progress toward 50-hour certification',
                            'WingMentor verification badges'
                        ].map((feature, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                color: '#475569'
                            }}>
                                <span style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: '#2563eb'
                                }} />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Milestone Card */}
                <div style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                    color: 'white',
                    animation: 'slideIn 0.5s ease-out 0.4s both'
                }}>
                    <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        opacity: 0.9
                    }}>
                        Certification Milestones
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '1rem'
                    }}>
                        {[
                            { hours: 10, label: 'Pre-Mentorship' },
                            { hours: 20, label: 'Supervised' },
                            { hours: 50, label: 'Certified' }
                        ].map((milestone, i) => (
                            <div key={i} style={{
                                flex: 1,
                                textAlign: 'center',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '8px'
                            }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                    {milestone.hours}h
                                </div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                    {milestone.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorshipLogbookAnimation;
