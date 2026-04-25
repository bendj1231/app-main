
import React, { useState, useEffect, useRef } from 'react';
import { IMAGES } from '../../src/lib/website-constants';
import { RevealOnScroll } from './RevealOnScroll';
import { MindMap } from './MindMap';
import { PilotsStory } from './PilotsStory';
import { EpauletBars } from './EpauletBars';
import { ArrowRight, Plane, BookOpen, GraduationCap, X } from 'lucide-react';

interface WebsitePageProps {
    isVideoWarm?: boolean;
    setIsVideoWarm?: (warm: boolean) => void;
    onGoToProgramDetail: () => void;
    onGoToGapPage: () => void;
    onGoToOperatingHandbook: () => void;
    onGoToBlackBox: () => void;
    onGoToExaminationTerminal: () => void;
    scrollToSection?: string | null;
    onScrollComplete?: () => void;
    onGoToEnrollment: () => void;
    onGoToHub: () => void;
}

export const WebsitePage: React.FC<WebsitePageProps> = ({
    isVideoWarm = false,
    setIsVideoWarm,
    onGoToProgramDetail,
    onGoToGapPage,
    onGoToOperatingHandbook,
    onGoToBlackBox,
    onGoToExaminationTerminal,
    scrollToSection,
    onScrollComplete,
    onGoToEnrollment,
    onGoToHub
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const appsScrollRef = useRef<HTMLDivElement>(null);
    const isDarkMode = false; // Default to light mode or adapt if theme context exists

    const [isDevConsoleOpen, setDevConsoleOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(!isVideoWarm);
    const [animationComplete, setAnimationComplete] = useState(false);

    const [loadingApp, setLoadingApp] = useState<string | null>(null);

    // States for Action Icon Carousel
    const [selectedActionIndex, setSelectedActionIndex] = useState(1);

    // NEW CAROUSEL STATE
    const [carouselIndex, setCarouselIndex] = useState(0);

    // Launch Selection State
    const [launchSelectionApp, setLaunchSelectionApp] = useState<any | null>(null);

    const CAROUSEL_APPS = [
        {
            title: "Examination Terminal",
            desc: "Experience the industry's most advanced testing environment, meticulously engineered to mirror real-world aviation exams and checkride oral evaluations. Our adaptive question bank evolves with your performance, ensuring you are battle-tested and confident before you ever step into the examination room.",
            bullets: [
                "Simulated Checkride Scenarios",
                "Knowledge Verification Tests",
                "Performance Analysis & Grading"
            ],
            icon: "fa-terminal",
            color: "bg-black",
            borderColor: "border-zinc-700",
            img: IMAGES.HUB_INTERFACE, // Using placeholder or specific app image if available
            target: 'examination'
        },
        {
            title: "The Black Box",
            desc: "Gain exclusive entry into the ultimate restricted-access vault. This comprehensive repository houses high-value study materials, Pilot Operating Handbooks (POHs), and coveted interview secrets typically reserved for senior captains, giving you the insider edge.",
            bullets: [
                "Restricted POH Library",
                "Airline Interview Cheat Sheets",
                "Advanced Systems PowerPoints"
            ],
            icon: "fa-box-open",
            color: "bg-gradient-to-br from-zinc-900 to-black",
            borderColor: "border-zinc-800",
            img: IMAGES.BLACK_BOX_BG,
            target: 'blackbox'
        },
        {
            title: "Operating Handbook",
            desc: "Your digital flight bag and comprehensive guide to the Wing Mentor ecosystem. Access detailed program syllabi, operational procedures, and policy documents anytime, anywhere. This is the central nervous system of your training compliance and progression.",
            bullets: [
                "Official Program Rules & Syllabi",
                "Standard Operating Procedures",
                "Safety & Compliance Docs"
            ],
            icon: "fa-book-reader",
            color: "bg-blue-900",
            borderColor: "border-blue-700",
            img: IMAGES.WINGMENTOR_PASSPORT_APP_IMG,
            target: 'handbook'
        },
        {
            title: "The Gap Forum",
            desc: "Join an elite, verified community of like-minded aviators navigating the 'Low Timer Gap'. Share intelligence, discuss career strategies, and build a professional network that will support you throughout your entire career. You are no longer flying solo.",
            bullets: [
                "Verified Pilot Discussions",
                "Career Strategy Networking",
                "Real-time Industry Intel"
            ],
            icon: "fa-users",
            color: "bg-indigo-900",
            borderColor: "border-indigo-700",
            img: IMAGES.PILOT_GAP_FORUM_APP_IMG,
            target: 'gap'
        }
    ];

    const handleAppLaunch = (target: string) => {
        setLoadingApp(target);
        setTimeout(() => {
            setLoadingApp(null);
            if (target === 'examination') onGoToExaminationTerminal();
            else if (target === 'blackbox') onGoToBlackBox();
            else if (target === 'handbook') onGoToOperatingHandbook();
            else if (target === 'gap') onGoToGapPage();
        }, 1500);
    };

    const handleLaunchSelection = (direction: 'prev' | 'next') => {
        setCarouselIndex(prev => {
            if (direction === 'next') {
                return (prev + 1) % CAROUSEL_APPS.length;
            } else {
                return prev === 0 ? CAROUSEL_APPS.length - 1 : prev - 1;
            }
        });
    };

    useEffect(() => {
        if (scrollToSection) {
            setTimeout(() => {
                const section = document.getElementById(scrollToSection);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
                if (onScrollComplete) onScrollComplete();
            }, 500);
        }
    }, [scrollToSection, onScrollComplete]);

    useEffect(() => {
        if (isVideoWarm) {
            setIsLoading(false);
            setAnimationComplete(true);
            return;
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setAnimationComplete(true), 800);
            if (setIsVideoWarm) setIsVideoWarm(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, [isVideoWarm, setIsVideoWarm]);

    return (
        <div className={`min-h-screen bg-white text-zinc-900 font-sans selection:bg-yellow-500/30 overflow-x-hidden`}>

            {/* --- HERO SECTION --- */}
            <div className="relative h-screen w-full overflow-hidden bg-black">
                {/* Simplified Header for Dashboard View */}
                <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                    <div className="flex items-center gap-3">
                        <img src={IMAGES.LOGO} alt="Logo" className="w-10 h-10 object-contain" />
                        <span className="text-white font-bold text-xl tracking-wider brand-font">PILOT RECOGNITION</span>
                    </div>
                    <button onClick={onGoToHub} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md border border-white/20 transition-all">
                        Enter Hub
                    </button>
                </div>

                <video
                    ref={videoRef}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover opacity-60`}
                >
                    <source src={IMAGES.HERO_VIDEO} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

                <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 md:px-6 mt-16 md:mt-0">
                    <RevealOnScroll delay={300}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 rounded-full bg-yellow-500/20 border border-yellow-500/50 backdrop-blur-md mb-6 md:mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                            <span className="text-yellow-400 text-xs md:text-sm font-bold tracking-wider uppercase">Accepting New Candidates</span>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll delay={500}>
                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white leading-tight tracking-tighter brand-font mb-4 drop-shadow-2xl">
                            WING<br />MENTOR
                        </h1>
                    </RevealOnScroll>

                    <RevealOnScroll delay={700}>
                        <p className="text-lg md:text-2xl text-zinc-300 max-w-3xl mx-auto font-light leading-relaxed mb-10 px-4 drop-shadow-lg">
                            The Gap is the period between 250 and 1500 hours where 85% of pilots quit. <br className="hidden md:block" />
                            <span className="text-white font-semibold">We built the bridge to verify your experience.</span>
                        </p>
                    </RevealOnScroll>

                    <RevealOnScroll delay={900}>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto px-6">
                            <button
                                onClick={onGoToProgramDetail}
                                className="group relative px-8 py-4 bg-yellow-500 text-black font-bold text-lg tracking-wider uppercase skew-x-[-12deg] hover:bg-yellow-400 transition-all hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                            >
                                <div className="skew-x-[12deg] flex items-center gap-3">
                                    Start Program
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            <button
                                onClick={onGoToHub}
                                className="group relative px-8 py-4 bg-zinc-900 border border-zinc-700 text-white font-bold text-lg tracking-wider uppercase skew-x-[-12deg] hover:bg-zinc-800 transition-all hover:scale-105"
                            >
                                <div className="skew-x-[12deg]">
                                    Access Dashboard
                                </div>
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* --- APPS CAROUSEL SECTION --- */}
            <div id="apps-section" className="relative py-24 bg-zinc-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${IMAGES.HUB_INTERFACE})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', filter: 'blur(10px)' }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-zinc-900"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white brand-font mb-4">Ecosystem Access</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Detailed simulators, restricted libraries, and testing environments available to program members.</p>
                    </div>

                    <div className="relative h-[600px] flex items-center justify-center">
                        {/* Main App Display */}
                        <div className="relative w-full max-w-5xl h-full flex flex-col md:flex-row bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">

                            {/* Left: Content */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10 bg-zinc-950/90 backdrop-blur-md">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-8 bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 transition-all duration-500 hover:scale-110 hover:bg-white/20 hover:rotate-6`}>
                                    <i className={`fas ${CAROUSEL_APPS[carouselIndex].icon} text-3xl text-white`}></i>
                                </div>

                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 brand-font">{CAROUSEL_APPS[carouselIndex].title}</h3>
                                <p className="text-zinc-400 text-lg leading-relaxed mb-8">{CAROUSEL_APPS[carouselIndex].desc}</p>

                                <ul className="space-y-4 mb-10">
                                    {CAROUSEL_APPS[carouselIndex].bullets.map((bullet, i) => (
                                        <li key={i} className="flex items-center text-zinc-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-3"></div>
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex gap-4 mt-auto">
                                    <button
                                        onClick={() => handleAppLaunch(CAROUSEL_APPS[carouselIndex].target)}
                                        className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-wider rounded-xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {loadingApp === CAROUSEL_APPS[carouselIndex].target ? (
                                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span>
                                        ) : (
                                            <>
                                                Launch App <i className="fas fa-external-link-alt ml-1"></i>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Right: Image */}
                            <div className="w-full md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 to-transparent z-10 md:bg-gradient-to-r"></div>
                                <img
                                    src={CAROUSEL_APPS[carouselIndex].img}
                                    alt={CAROUSEL_APPS[carouselIndex].title}
                                    className="w-full h-full object-cover transform scale-105 transition-transform duration-700"
                                />
                            </div>

                            {/* Navigation Buttons */}
                            <button
                                onClick={() => handleLaunchSelection('prev')}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-white text-white hover:text-black border border-white/10 flex items-center justify-center backdrop-blur-md transition-all z-20"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button
                                onClick={() => handleLaunchSelection('next')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-white text-white hover:text-black border border-white/10 flex items-center justify-center backdrop-blur-md transition-all z-20"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>

                            {/* Dots */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                {CAROUSEL_APPS.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCarouselIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === carouselIndex ? 'w-8 bg-yellow-500' : 'bg-zinc-600 hover:bg-zinc-500'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PILOT JOURNEY SCROLL (PilotsStory) --- */}
            <section id="pilots-story" className="relative">
                <PilotsStory onAnimationComplete={() => onGoToHub()} />
            </section>

            {/* --- MINDMAP SECTION --- */}
            <section className="py-24 bg-zinc-50 border-t border-zinc-200">
                <div className="max-w-7xl mx-auto px-6 text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 brand-font mb-4">The Career Roadmap</h2>
                    <p className="text-zinc-600 max-w-2xl mx-auto text-lg">Visualizing the path from student to airline captain, and bridging the treacherous 'Gap' in between.</p>
                </div>
                <MindMap />
            </section>

        </div>
    );
};
