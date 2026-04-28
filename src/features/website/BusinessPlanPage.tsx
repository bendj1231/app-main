import React from 'react';

export const BusinessPlanPage = ({ onBack }: { onBack: () => void }) => (
    <div className="fade-in-up">
        <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

            <header style={{ marginBottom: 60, textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '8px 16px', background: '#e0f2fe', color: '#0369a1', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, marginBottom: 20 }}>WINGMENTOR STRATEGY 2026</div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24, background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    We are here to guide you through it all.
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                    Bridging the pilot low-timer gap through specialized mentorship, modern digitized tools, and direct industry pathways.
                </p>
            </header>

            <div style={{ display: 'grid', gap: 80 }}>

                <section>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ width: 40, height: 40, background: '#1a1a1a', color: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>1</span>
                        Executive Summary
                    </h2>
                    <div className="logbook-card" style={{ padding: 40, background: '#fff' }}>
                        <div style={{ display: 'grid', gap: 24 }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>The Hook</h3>
                                <p style={{ color: '#475569', lineHeight: 1.6 }}>We are bridging the pilot low timer gap.</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>The Opportunity</h3>
                                <p style={{ color: '#475569', lineHeight: 1.6 }}>Addressing the critical "pilot gap" within the industry—specifically the low timer gap where graduates are stalled before reaching airline requirements.</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>The Solution</h3>
                                <p style={{ color: '#475569', lineHeight: 1.6 }}>A comprehensive ecosystem: a program, an institution, and a consulting methodology interlinking you as a pilot with the industry through our verified database.</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>The Goal</h3>
                                <p style={{ color: '#475569', lineHeight: 1.6 }}>To provide directional guidance not just for individual pilots, but to solve this major industry issue. We speak for all pilots who want answers and want to be heard.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ width: 40, height: 40, background: '#1a1a1a', color: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>2</span>
                        Company Overview
                    </h2>

                    <div style={{ marginBottom: 40 }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16 }}>Mission Statement</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155' }}>
                            We consult pilots within the gap of the aviation industry by providing a bridge between airline operators, aircraft brokers, and flight schools. We link candidates to ATPL advancement training with discounts and provide integrated Airbus apps to familiarize pilots with EBT & CBT training.
                            <br /><br />
                            We offer deep insight into the private jet industry, working with manufacturers to provide guidance on exactly what they are looking for. We reform your CV using the ATLAS format to be recognized within the industry.
                            <br /><br />
                            Our ecosystem includes:
                        </p>
                        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginTop: 24 }}>
                            {['Foundational Leadership Programs', 'Instructor Transition Mentorship', 'English Phraseology Training', 'EBT/CBT Integrated Apps', '9-Module Familiarization', 'Type Rating Investment Guidance'].map((item, i) => (
                                <li key={i} style={{ padding: '12px 20px', background: '#f8fafc', borderRadius: 12, color: '#475569', fontWeight: 500, listStyle: 'none', border: '1px solid #e2e8f0' }}>• {item}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
                        <div className="logbook-card" style={{ padding: 32, background: '#f0f9ff', border: 'none' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12, color: '#0369a1' }}>Our Vision</h3>
                            <p style={{ color: '#334155', lineHeight: 1.6 }}>
                                To help pilots who have the skill but are stopped by high industry entry standards. We stop them from "falling off" or shifting careers due to the saturation of Plan A (Airlines) and Plan B (Flight Instruction). We address the bottleneck directly.
                            </p>
                        </div>
                        <div className="logbook-card" style={{ padding: 32, background: '#f0fdf4', border: 'none' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12, color: '#15803d' }}>Core Values</h3>
                            <p style={{ color: '#334155', lineHeight: 1.6 }}>
                                Connection, Attitude, and Respect. Treat fellow pilots with support and guidance. Consult professionally. Maintain authoritative thinking without being blindly guided by others.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ width: 40, height: 40, background: '#1a1a1a', color: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>3</span>
                        The Problem
                    </h2>
                    <div className="logbook-card" style={{ padding: 0 }}>
                        <div style={{ padding: 40, borderBottom: '1px solid #f0f0f0' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>The Pain Point</h3>
                            <p style={{ color: '#666', fontSize: '1.1rem' }}>Lack of guidance and answers. The "pilot voice" is not heard by the industry's biggest companies. There is a disconnect between pilot graduates and employer expectations.</p>
                        </div>
                        <div style={{ padding: 40, borderBottom: '1px solid #f0f0f0', background: '#fff1f2' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8, color: '#be123c' }}>The Consequence</h3>
                            <p style={{ color: '#881337', fontSize: '1.1rem', fontStyle: 'italic' }}>
                                "My friend Daniel called me up one day saying 'Ben, I quit flying' after investing $30,000 USD in a ATR type rating."
                            </p>
                            <p style={{ marginTop: 12, color: '#9f1239' }}>Loss of talent, passion, and revenue. Burnout. Wasted investments.</p>
                        </div>
                        <div style={{ padding: 40 }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>Current Alternatives</h3>
                            <p style={{ color: '#666', fontSize: '1.1rem' }}>Blindly investing in type ratings without knowing the outcome. Not knowing airline expectations. Relying on flight schools that sell "hopes and dreams" from childhood rather than industry reality.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ width: 40, height: 40, background: '#1a1a1a', color: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>4</span>
                        Our Solution
                    </h2>
                    <div style={{ display: 'grid', gap: 24 }}>
                        {[
                            { feature: "PilotRecognition Program Suite", need: "Lack of direction & guidance", benefit: "Insight prior to major investments ($30k+). Only $5,000 investment for complete industry roadmap." },
                            { feature: "24/7 Support & Mentorship", need: "Transitioning career anxiety", benefit: "A sense of direction. Saving money on wrong investments. Feeling recognized and supported." },
                            { feature: "Industry Direct Link", need: "No network or connections", benefit: "Guidance from aviation training specialists and private operator brokers." }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, padding: 24, background: 'white', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Feature</label>
                                    <p style={{ fontWeight: 600, color: '#1a1a1a', margin: '4px 0 0 0' }}>{item.feature}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>The Need</label>
                                    <p style={{ color: '#475569', margin: '4px 0 0 0' }}>{item.need}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>The Benefit</label>
                                    <p style={{ color: '#059669', fontWeight: 500, margin: '4px 0 0 0' }}>{item.benefit}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ padding: 40, background: '#1e293b', borderRadius: 32, color: 'white' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 24 }}>Market Analysis & Strategy</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase' }}>Target Audience</h3>
                            <p style={{ lineHeight: 1.6, opacity: 0.9 }}>Private pilots, Student pilots, Wannabe pilots, Commercial pilots, Airline pilots, Flight Instructors. From those with money to those without.</p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase' }}>Unique Selling Proposition</h3>
                            <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
                                We are the <strong>first</strong> to solve the industry's biggest issue with the low timer gap. Airbus has admitted the issue. We provide the missing voice and bridge. We are an institute for pilots, not just a service.
                            </p>
                        </div>
                        <div style={{ gridColumn: '1 / -1', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#94a3b8', marginBottom: 16, textTransform: 'uppercase' }}>Operational Plan</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                                <div>
                                    <strong style={{ color: '#fff' }}>Location</strong>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: 4 }}>App-based currently. Hosting events for members.</p>
                                </div>
                                <div>
                                    <strong style={{ color: '#fff' }}>Technology</strong>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: 4 }}>Mobile, Laptop, Log Systems. Provided apps from Airbus & Etihad.</p>
                                </div>
                                <div>
                                    <strong style={{ color: '#fff' }}>Staffing</strong>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: 4 }}>Ben, Karl, Kenneth (Private Jet), Mahindra (IT Sales), UX Designers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#64748b', marginBottom: 24 }}>Ready to bridge the gap?</h2>
                    <button style={{ padding: '16px 48px', fontSize: '1.1rem', fontWeight: 700, background: '#1a1a1a', color: 'white', borderRadius: 100, border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => window.location.href = 'mailto:contact@pilotrecognition.com'}>
                        Contact Founders
                    </button>
                </div>

            </div>
        </div>
    </div>
);
