import React from 'react';

const stages = [
    { number: '01', title: 'Initial Program Module', description: 'Industry analysis & indoctrination protocols' },
    { number: '02', title: 'Initial Examination Module', description: 'Baseline retention assessment & skills record' },
    { number: '03', title: 'Your PilotRecognition Profile', description: 'Centralized professional record & transparency' },
    { number: '04', title: 'Mentorship Module', description: 'Mentorship fundamentals & peer observation' },
    { number: '05', title: 'Pre-Mentorship Examination', description: 'Mentorship prep exam & 10hr observation' },
    { number: '06', title: 'Supervised Mentorship', description: '20-hour mentorship with objective logging' },
    { number: '07', title: 'Competency Review & Transition Prep', description: 'Review of verified competencies & preparation for next stage' },
    { number: '08', title: 'Advanced Mentorship', description: '50-hour milestone & leadership demonstration' },
    { number: '09', title: 'Final Competency Evaluation', description: 'EBT CBTA-aligned evaluation & certificate of achievement' },
    { number: '10', title: 'PilotRecognition Certification', description: 'Foundation Program completion verified on your profile' }
];

export const ProgramStages: React.FC = () => {
    return (
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

            {/* Single Condensed Component */}
            <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                backdropFilter: 'blur(16px)', 
                WebkitBackdropFilter: 'blur(16px)', 
                borderRadius: '24px', 
                padding: '2.5rem', 
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', 
                border: '1px solid rgba(255, 255, 255, 0.8)', 
                textAlign: 'left', 
                width: '100%', 
                boxSizing: 'border-box' 
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {stages.map((stage) => (
                        <div key={stage.number} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{ 
                                color: '#2563eb', 
                                fontSize: '0.875rem', 
                                fontWeight: 700, 
                                letterSpacing: '0.15em', 
                                textTransform: 'uppercase', 
                                flexShrink: 0,
                                minWidth: '50px'
                            }}>
                                {stage.number}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem', fontFamily: 'Georgia, serif' }}>
                                    {stage.title}
                                </h3>
                                <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
                                    {stage.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProgramStages;
