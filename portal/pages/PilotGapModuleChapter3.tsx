import React from 'react';
import { Icons } from '../icons';

interface PilotGapModuleChapter3Props {
    onBack: () => void;
}

export const PilotGapModuleChapter3: React.FC<PilotGapModuleChapter3Props> = ({ onBack }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out' }}>

            {/* ── Section Header ── */}
            <div style={{ textAlign: 'center', paddingBottom: '2rem', paddingTop: '1.5rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <img src="/logo.png" alt="PilotRecognition Logo" style={{ maxWidth: '200px', height: 'auto', objectFit: 'contain', margin: '0 auto' }} />
                </div>
                <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem' }}>
                    CHAPTER 04
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 400, color: '#0f172a', fontFamily: 'Georgia, serif', margin: '0 auto 1rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                    The Solution
                </h2>
                <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '42rem', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
                    PilotRecognition's comprehensive approach to bridging the pilot gap and building sustainable aviation careers.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>
                {/* Content will be added here */}
            </div>
        </div>
    );
};
