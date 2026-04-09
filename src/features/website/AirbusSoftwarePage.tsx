import React from 'react';

export const AirbusSoftwarePage = ({ onBack }: { onBack: () => void }) => (
    <div className="fade-in-up">
        <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
        <header style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: '0.85rem', color: '#1a237e', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Aeronautical Digital Suite</h3>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>AIRBUS Integrated Software</h1>
            <p style={{ color: '#666', fontSize: 'clamp(1rem, 3vw, 1.2rem)', marginTop: 12, maxWidth: '800px' }}>
                A unified ecosystem for modern fleet management, electronic flight bag operations, and advanced data-driven safety protocols.
            </p>
        </header>

        <div className="airbus-grid">
            {[
                { title: "FlySmart+", module: "EFB Solutions", desc: "Integrated performance calculations, flight manuals, and mission planning.", icon: "📱" },
                { title: "Airman-web", module: "Maintenance Ops", desc: "Real-time health monitoring and aircraft technical log management.", icon: "🔧" },
                { title: "Skywise", module: "Data Analytics", desc: "Global data platform for airline operational efficiency and predictive safety.", icon: "🌐" },
                { title: "LISA", module: "Library App", desc: "Unified access to all technical and operational documentation.", icon: "📖" },
                { title: "ROPS+", module: "Safety Systems", desc: "Runway Overrun Prevention System software for advanced landing protection.", icon: "🛑" },
                { title: "FOMAX", module: "Connectivity", desc: "High-bandwidth interface for cockpit and cabin data synchronization.", icon: "📡" }
            ].map((mod, i) => (
                <div key={i} className="airbus-module-card">
                    <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>{mod.icon}</div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.7 }}>{mod.module}</h4>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '1.5rem', fontWeight: 800 }}>{mod.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.9 }}>{mod.desc}</p>
                    <div style={{ marginTop: 24, padding: '8px 16px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12, display: 'inline-block', fontSize: '0.8rem', fontWeight: 600 }}>Enroll Now</div>
                </div>
            ))}
        </div>
    </div>
);
