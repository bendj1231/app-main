import React from 'react';
import { ArrowLeft, Target, Briefcase, Users, TrendingUp, CheckCircle2, Search, Award, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface RecognitionCareerMatchesPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const RecognitionCareerMatchesPage: React.FC<RecognitionCareerMatchesPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Career Matching
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                        Recognition Career Matches
                    </h1>
                    <p className="text-base md:text-lg text-slate-700 max-w-3xl mx-auto mt-6">
                        Your <strong>Pilot Recognition Profile</strong> automatically matches you with career opportunities that align with your skills, experience, and professional standing.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                {/* Section 1: How It Works */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        How It Works
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                        Intelligent Matching System
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Our <strong>recognition-based matching algorithm</strong> analyzes your <strong>Pilot Recognition Score</strong>, flight hours, certifications, and competency assessments to identify the most suitable career opportunities. Unlike traditional job boards that rely on manual resume screening, our system uses <strong>AI-powered matching</strong> to connect you with positions where you're most likely to succeed.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        The system continuously updates your match percentage as you log new flight hours, complete training programs, and achieve new certifications. This ensures that your profile always reflects your current capabilities and readiness for career advancement.
                    </p>
                </div>

                {/* Section 2: Recommended Pathways (Static Mock for SEO) */}
                <div className="mb-16">
                    <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '1rem' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>
                            Pathways to Partnered Cadet Programs
                        </p>
                        <h2 style={{ 
                            margin: '0.5rem 0 0', 
                            fontSize: '3rem', 
                            fontWeight: 'normal', 
                            fontFamily: 'Georgia, serif', 
                            color: '#0f172a', 
                            letterSpacing: '-0.02em' 
                        }}>
                            Recommended Pathways
                        </h2>
                        <p style={{ margin: '0.5rem 0 0', color: '#475569', fontSize: '1rem' }}>
                            Explore career pathways matched to your profile
                        </p>
                        <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                            Discover cadet programs, airline partnerships, and career progression opportunities tailored to your experience level
                        </p>
                    </div>

                    {/* Filters and Score */}
                    <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-sm font-medium text-red-600">Low Match</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-sm font-medium text-amber-600">Middle Match</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-green-600">High Match</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-sm font-medium text-slate-600">All</span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-slate-400 italic mb-4">
                        Swipe left and right or click to select a card
                    </p>

                    {/* Overall Profile Score */}
                    <div className="flex justify-end mb-6">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                Overall Profile Score
                            </p>
                            <div className="text-xs text-slate-600 mb-1">
                                <div>Flight Hours: 200 <span className="font-bold text-amber-600">(unverified)</span></div>
                                <div>Recency: N/A</div>
                                <div>Recognition: 0</div>
                            </div>
                            <div className="text-4xl font-serif text-slate-900">0</div>
                        </div>
                    </div>

                    {/* Pathway Cards Carousel (Static Mock) */}
                    <div style={{ position: 'relative', width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '0', paddingRight: '0', marginTop: '0.5rem' }}>
                        <style>{`
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                            .scrollbar-hide {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                            .snap-scroll {
                                scroll-snap-type: x mandatory;
                                scroll-padding-left: 3rem;
                                scroll-padding-right: 3rem;
                            }
                            .snap-scroll > div {
                                scroll-snap-align: center;
                                scroll-snap-stop: always;
                            }
                        `}</style>
                        <div 
                            style={{ 
                                display: 'flex', 
                                gap: '1.5rem', 
                                overflowX: 'scroll', 
                                overflowY: 'hidden', 
                                paddingBottom: '1rem', 
                                scrollbarWidth: 'none', 
                                msOverflowStyle: 'none',
                                overscrollBehaviorX: 'none',
                                WebkitOverflowScrolling: 'touch',
                                width: '100%',
                                maxWidth: '100%',
                                paddingLeft: '3rem',
                                paddingRight: '3rem'
                            }}
                            className="snap-scroll scrollbar-hide"
                        >
                            {/* WingMentor Intro Card */}
                            <div 
                                style={{ 
                                    flexShrink: 0, 
                                    width: '450px',
                                    cursor: 'default',
                                    border: '3px solid transparent',
                                    borderRadius: '1rem',
                                    padding: '3px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                                    <div style={{ position: 'relative', height: '300px', borderRadius: '0.75rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
                                        <img
                                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                            alt="WingMentor"
                                            style={{ width: '120px', height: '120px', objectFit: 'contain', margin: 'auto' }}
                                        />
                                        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '1rem', background: 'transparent', textAlign: 'center' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'normal', color: '#0f172a', fontFamily: 'Georgia, serif', textShadow: 'none' }}>
                                                Pathways to Partnered Cadet Programs
                                            </h4>
                                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                                                WingMentor
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {[
                                { title: 'Envoy Air Pilot Cadet Program', subtitle: 'Envoy Air (American Airlines Group)', match: 80, pr: 0, image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
                                { title: 'CAE Philippines Type Rating Center', subtitle: 'CAE Philippines (PAAT)', match: 80, pr: 0, image: 'https://images.unsplash.com/photo-1565514020176-792dd98c6d6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
                                { title: 'SkyWest Airlines Cadet Program', subtitle: 'SkyWest Airlines', match: 80, pr: 0, image: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
                                { title: 'Zipline Flight Operations', subtitle: 'Zipline International', match: 79, pr: 0, image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
                                { title: 'Drone Delivery Pilot', subtitle: 'Wing (Alphabet)', match: 79, pr: 0, image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
                                { title: 'MLG Pilotless Drone Ops', subtitle: 'MLG (Medical Logistics Group)', match: 79, pr: 0, image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
                                { title: 'Cathay Pacific Cadet Pilot Programme', subtitle: 'Cathay Pacific Airways', match: 75, pr: 0, image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
                                { title: 'Cebu Pacific Cadet Pilot Program', subtitle: 'Cebu Pacific', match: 60, pr: 0, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
                            ].map((pathway, index) => (
                                <div 
                                    key={index}
                                    style={{ 
                                        flexShrink: 0, 
                                        width: '600px',
                                        cursor: 'pointer',
                                        border: index === 0 ? '3px solid #0ea5e9' : '3px solid transparent',
                                        borderRadius: '1rem',
                                        padding: '3px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                                        <div style={{ position: 'relative', height: '300px', borderRadius: '0.75rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
                                            <img
                                                src={pathway.image}
                                                alt={pathway.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                            />
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent 40%)' }} />
                                            
                                            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                                <div style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.9)', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    {pathway.match}% Match
                                                </div>
                                                <div style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(14, 165, 233, 0.9)', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    PR: {pathway.pr}
                                                </div>
                                            </div>

                                            <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '1rem', background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)', textAlign: 'center' }}>
                                                <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'normal', color: 'white', fontFamily: 'Georgia, serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                                    {pathway.title}
                                                </h4>
                                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                                                    {pathway.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <button style={{
                            padding: '0.75rem',
                            borderRadius: '50%',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            color: '#64748b',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <ChevronLeft size={20} />
                        </button>

                        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                            <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>
                                Selected Pathway
                            </p>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'normal', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'Georgia, serif' }}>
                                Envoy Air Pilot Cadet Program
                            </h3>
                        </div>

                        <button style={{
                            padding: '0.75rem',
                            borderRadius: '50%',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            color: '#64748b',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Section 3: Selected Pathway (Static Mock for SEO) */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">
                                    Selected Pathway
                                </p>
                                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-2">
                                    Envoy Air Pilot Cadet Program
                                </h2>
                                <p className="text-lg text-slate-600">Envoy Air (American Airlines Group)</p>
                            </div>
                            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                                <span className="text-2xl font-bold">80%</span>
                                <span className="text-sm font-medium ml-1">Match</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6 mb-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Why this pathway is recommended to you
                            </h3>
                            <p className="text-slate-700 leading-relaxed">
                                Based on your profile, this pathway has a 80% match with your interests in American Airlines Flow, Embraer Fleet, Tuition Reimbursement. Your recognition score of 0 indicates strong alignment with this program's requirements. This pathway is one of the best starting points to build your recognition profile score throughout your pilot career, setting a foundation for future opportunities.
                            </p>
                            <p className="text-slate-700 leading-relaxed mt-2">
                                Financial assistance + guaranteed First Officer position with American Airlines flow-through.
                            </p>
                        </div>

                        <div className="border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Requirements & Profile Alignment
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Understand how your current profile aligns with the pathway requirements and identify areas for improvement to increase your eligibility.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Flight Hours
                                    </p>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Your account shows: 200 total flight hours
                                    </p>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="pb-2 font-medium text-slate-700">REQUIREMENT</th>
                                                    <th className="pb-2 font-medium text-slate-700">STATUS</th>
                                                    <th className="pb-2 font-medium text-slate-700">DETAILS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="py-2 text-slate-600">40+ Flight Hours</td>
                                                    <td className="py-2 text-green-600 font-medium">✓ Met</td>
                                                    <td className="py-2 text-slate-600">You have sufficient hours</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Licenses
                                    </p>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Your account shows: ppl, cpl, ir, multi_engine, student
                                    </p>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="pb-2 font-medium text-slate-700">REQUIREMENT</th>
                                                    <th className="pb-2 font-medium text-slate-700">STATUS</th>
                                                    <th className="pb-2 font-medium text-slate-700">DETAILS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="py-2 text-slate-600">Commercial Pilot License</td>
                                                    <td className="py-2 text-green-600 font-medium">✓ Met</td>
                                                    <td className="py-2 text-slate-600">License requirement met</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Medical
                                    </p>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Your account shows: None
                                    </p>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="pb-2 font-medium text-slate-700">REQUIREMENT</th>
                                                    <th className="pb-2 font-medium text-slate-700">STATUS</th>
                                                    <th className="pb-2 font-medium text-slate-700">DETAILS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="py-2 text-slate-600">Class 1 Medical</td>
                                                    <td className="py-2 text-red-600 font-medium">✗ Not Met</td>
                                                    <td className="py-2 text-slate-600">Medical certificate not valid or expired</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Certifications
                                    </p>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Your account shows: 0 certifications on file
                                    </p>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="pb-2 font-medium text-slate-700">REQUIREMENT</th>
                                                    <th className="pb-2 font-medium text-slate-700">STATUS</th>
                                                    <th className="pb-2 font-medium text-slate-700">DETAILS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="py-2 text-slate-600">US Citizen/Perm Resident</td>
                                                    <td className="py-2 text-red-600 font-medium">✗ Not Met</td>
                                                    <td className="py-2 text-slate-600">Missing US Citizen/Perm Resident</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 text-slate-600">FAA License Holders Eligible</td>
                                                    <td className="py-2 text-red-600 font-medium">✗ Not Met</td>
                                                    <td className="py-2 text-slate-600">Missing FAA License Holders Eligible</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6 mt-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Why Your Profile Matches
                            </h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                Your profile shows a 80% match based on your interests in American Airlines Flow, Embraer Fleet, Tuition Reimbursement and your recognition score of 0. Consider adding relevant interests to improve your match score.
                            </p>
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                Discover Envoy Air Pilot Cadet Program →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 4: Benefits */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Advantages
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                        Why Recognition-Based Matching
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Traditional job applications often result in your resume being lost in a sea of applications, with little guarantee that hiring managers will even see your qualifications. Our recognition-based matching system ensures that your profile is <strong>actively presented</strong> to airlines and operators who are looking for pilots with your specific qualifications and experience level.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        By leveraging your <strong>Pilot Recognition Score</strong> and verified credentials, you gain a competitive advantage in the hiring process. Airlines can see your professional standing at a glance, reducing the time and effort required to evaluate candidates and increasing your chances of securing desirable positions.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">AI-Powered Matching</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Verified Credentials</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Real-Time Updates</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Industry Connections</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back button */}
            <div className="py-12 flex justify-center">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>
        </div>
    );
};
