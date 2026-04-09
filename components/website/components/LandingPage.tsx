
import React, { useRef, useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { DeveloperConsole } from './DeveloperConsole';
import { useTheme } from '../context/ThemeContext';
// Import RevealOnScroll component
import { RevealOnScroll } from './RevealOnScroll';
import { EpauletBars } from './EpauletBars'; // Import EpauletBars
import { MindMap } from './MindMap'; // Import the new MindMap component
import { PilotsStory } from './PilotsStory'; // Import the new PilotsStory component

interface LandingPageProps {
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

const ACTION_ICONS = [
    {
        icon: 'fa-book-open',
        title: 'Operating Handbook',
        description: 'Access the official Program Operating Handbook. Detailed protocols and program guidelines.',
        target: 'handbook',
        image: 'https://lh3.googleusercontent.com/d/1GbUopHNGyXMhzi5sW1Ybo5gZMh2_YSKN'
    },
    {
        icon: 'fa-terminal',
        title: 'Examination Terminal',
        description: 'Prepare for checkrides and knowledge tests with our interactive preparation hub.',
        target: 'examination',
        image: 'https://lh3.googleusercontent.com/d/11j7ZHv874EBZZ6O36etvuHC6rRWWm8kF'
    },
    {
        icon: 'fa-exclamation-triangle',
        title: 'Pilot Gap Forum',
        description: 'Discuss industry challenges with peers and mentors in our secure intelligence hub.',
        target: 'gap',
        image: 'https://lh3.googleusercontent.com/d/1InHXB-jhAZ3UNDXcvHbENwbB5ApY8eOp'
    },
    {
        icon: 'fa-box-open',
        title: 'The Black Box',
        description: 'Unlock deeply guarded information and resources from our comprehensive knowledge vault.',
        target: 'blackbox',
        image: 'https://lh3.googleusercontent.com/d/1yLM_bGVPN8Sa__fqR95C0EeA1CUsTAA7'
    },
];

const APPROACH_STEPS = [
    {
        num: "01",
        title: "THE DEBRIEF: PROBLEM IDENTIFIED",
        desc: "Following a lesson with your Certified Flight Instructor (CFI), you receive a grading sheet highlighting areas needing improvement. This document becomes the mission objective."
    },
    {
        num: "02",
        title: "THE CONSULTATION: SUPPORT REQUESTED",
        desc: "You submit the grading sheet and relevant notes through the Wing Mentor platform to schedule a session with a qualified mentor."
    },
    {
        num: "03",
        title: "THE ASSESSMENT: MENTOR ANALYSIS",
        desc: "Your Wing Mentor reviews the data, diagnoses the root cause of the issue, and prepares a tailored consultation plan. This is the 'Doctor's' preparation phase."
    },
    {
        num: "04",
        title: "THE SESSION: GUIDANCE PROVIDED",
        desc: "In a one-on-one session (online or in-person), the mentor guides you through the problem, utilizing diagrams, simulators, and practical examples to build deep understanding."
    },
    {
        num: "05",
        title: "THE LOGBOOK: EXPERIENCE VERIFIED",
        desc: "The session is meticulously documented in the official Wing Mentor logbook, detailing the issue, consultation provided, and duration, signed by the mentee. This creates a verifiable record of experience for the mentor."
    },
    {
        num: "06",
        title: "THE PRE-FLIGHT: PROFICIENCY APPLIED",
        desc: "Armed with new insights and strategies, you are fully prepared for your next flight with your CFI, ready to demonstrate mastery and turn a weakness into a strength."
    }
];

// External App Links
const DESKTOP_APP_URL = 'https://wingmentordesktop.vercel.app/';
const MOBILE_APP_URL = 'https://wingmentormobile.vercel.app/';

export const LandingPage: React.FC<LandingPageProps> = ({ isVideoWarm = false, setIsVideoWarm, onGoToProgramDetail, onGoToGapPage, onGoToOperatingHandbook, onGoToBlackBox, onGoToExaminationTerminal, scrollToSection, onScrollComplete, onGoToEnrollment, onGoToHub }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const appsScrollRef = useRef<HTMLDivElement>(null); // Ref for new Apps Carousel
    const { config } = useConfig();
    const { images } = config;
    const { isDarkMode } = useTheme();

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
            img: "https://lh3.googleusercontent.com/d/11j7ZHv874EBZZ6O36etvuHC6rRWWm8kF",
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
            color: "bg-gradient-to-br from-red-950 to-black",
            borderColor: "border-red-900",
            img: "https://lh3.googleusercontent.com/d/1yLM_bGVPN8Sa__fqR95C0EeA1CUsTAA7",
            target: 'blackbox'
        },
        {
            title: "WingMentor Passport",
            desc: "Your official digital identification and career progress tracker within the WingMentor ecosystem. This secure credential tracks your rank evolution from Student to Mentor, validating your achievements and unlocking tiered privileges as you advance.",
            bullets: [
                "Digital Pilot Identification",
                "Program Milestone Stamps",
                "Verified Rank Progression"
            ],
            icon: "fa-passport",
            color: "bg-gradient-to-br from-blue-950 to-black",
            borderColor: "border-blue-900",
            img: "https://lh3.googleusercontent.com/d/12yV8_AmHGkJedZ7c86VZoUwzcSbZt3fV",
            target: 'hub'
        },
        {
            title: "Pilot Gap Forum",
            desc: "Access a secure, high-level intelligence hub designed for serious career strategy. Engage in unfiltered discussions about industry gaps, financial realities, and market trends with peers and mentors, shielded from the noise of public social media.",
            bullets: [
                "Real life case studies with large sum investments feedback",
                "Understand how pilot credentials and type rating works",
                "Forum for communication with fellow pilots"
            ],
            icon: "fa-comments",
            color: "bg-gradient-to-br from-emerald-950 to-black",
            borderColor: "border-emerald-900",
            img: "https://lh3.googleusercontent.com/d/1InHXB-jhAZ3UNDXcvHbENwbB5ApY8eOp",
            target: 'gap'
        },
        {
            title: "Digital Logbook",
            desc: "WingLogs is the definitive system for logging, verifying, and exporting your mentorship experience. It provides a legally robust record of your leadership hours, complete with digital signatures, ensuring your time spent guiding others is recognized as verifiable professional development.",
            bullets: [
                "Verified Session Logging",
                "Mentor/Mentee Digital Signatures",
                "Exportable Experience Reports"
            ],
            icon: "fa-book-medical",
            color: "bg-gradient-to-br from-purple-950 to-black",
            borderColor: "border-purple-900",
            img: images.LOGBOOK_IMG,
            target: 'hub'
        },
        {
            title: "Operating Handbook",
            desc: "The master guide to program protocols, legal frameworks, and standard operating procedures. This essential document governs the rules of engagement for both Mentors and Mentees, ensuring safety, compliance, and professional standards are maintained at all times.",
            bullets: [
                "Standard Operating Procedures",
                "Legal & Liability Frameworks",
                "Program Rules of Engagement"
            ],
            icon: "fa-book",
            color: "bg-gradient-to-br from-amber-950 to-black",
            borderColor: "border-amber-900",
            img: "https://lh3.googleusercontent.com/d/1GbUopHNGyXMhzi5sW1Ybo5gZMh2_YSKN",
            target: 'handbook'
        }
    ];

    /* PART 1 Continued Logic */
    const handleNextCard = () => {
        setCarouselIndex((prev) => (prev + 1) % CAROUSEL_APPS.length);
    };

    const handlePrevCard = () => {
        setCarouselIndex((prev) => (prev - 1 + CAROUSEL_APPS.length) % CAROUSEL_APPS.length);
    };

    const touchStartX = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent, type: 'action' | 'app') => {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX.current;
        const SWIPE_THRESHOLD = 50;

        if (type === 'action') {
            if (deltaX > SWIPE_THRESHOLD) {
                setSelectedActionIndex(prev => Math.max(0, prev - 1));
            } else if (deltaX < -SWIPE_THRESHOLD) {
                setSelectedActionIndex(prev => Math.min(ACTION_ICONS.length - 1, prev + 1));
            }
        }
    };

    const scrollApps = (direction: 'left' | 'right') => {
        if (appsScrollRef.current) {
            const scrollAmount = 300;
            appsScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        if (scrollToSection) {
            const element = document.getElementById(scrollToSection);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
            if (onScrollComplete) {
                onScrollComplete();
            }
        }
    }, [scrollToSection, onScrollComplete]);

    useEffect(() => {
        const attemptPlay = async () => {
            if (!videoRef.current) return;

            try {
                await videoRef.current.play();
            } catch (error) {
                console.warn("Autoplay with sound prevented:", error);
                if (!isMuted) {
                    setIsMuted(true);
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        videoRef.current.play().catch(e => console.error("Muted autoplay failed", e));
                    }
                }
            }
        };

        if (!isLoading || isVideoWarm) {
            attemptPlay();
        }
    }, [isLoading, isMuted, isVideoWarm]);

    const handleScrollClick = (e: React.MouseEvent) => {
        const aboutSection = document.getElementById('about-program-overview-section');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleLearnMoreApps = (e: React.MouseEvent) => {
        e.stopPropagation();
        const appsSection = document.getElementById('pilot-apps-ecosystem');
        if (appsSection) {
            appsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const handleWaiting = () => {
        if (!isVideoWarm) setIsLoading(true);
    };

    const handleCanPlay = () => {
        setIsLoading(false);
        if (setIsVideoWarm) setIsVideoWarm(true);
    };

    const handlePlaying = () => {
        setIsLoading(false);
        if (setIsVideoWarm) setIsVideoWarm(true);
    };

    const handleLoadedData = () => {
        setIsLoading(false);
        if (setIsVideoWarm) setIsVideoWarm(true);
    };

    const handleIconClick = (target: string) => {
        setLoadingApp(target);

        setTimeout(() => {
            setLoadingApp(null);
            switch (target) {
                case 'handbook':
                    onGoToOperatingHandbook();
                    break;
                case 'examination':
                    onGoToExaminationTerminal();
                    break;
                case 'gap':
                    onGoToGapPage();
                    break;
                case 'blackbox':
                    onGoToBlackBox();
                    break;
                case 'hub':
                    onGoToHub();
                    break;
                default:
                    // Fallback to hub if target undefined
                    onGoToHub();
                    break;
            }
        }, 2000);
    };

    const textHighlight = isDarkMode ? 'text-blue-400' : 'text-blue-600';

    return (
        <div
            className={`relative pt-32 min-h-screen flex flex-col transition-colors ${isDarkMode ? 'bg-black' : 'bg-white'}`}
            style={!animationComplete ? { animation: 'landing-blur-enter 2s ease-out forwards' } : {}}
            onAnimationEnd={() => setAnimationComplete(true)}
        >
            <style>
                {`
              @keyframes landing-blur-enter {
                  0% { filter: blur(30px); opacity: 0; }
                  100% { filter: blur(0); opacity: 1; }
              }
          `}
            </style>

            {/* LAUNCH SELECTION OVERLAY */}
            {launchSelectionApp && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300 p-6 overflow-hidden">
                    {/* App Header */}
                    <div className="flex flex-col items-center mb-12 animate-in slide-in-from-top-4 duration-500">
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 shadow-2xl border-2 border-white/10 bg-black`}>
                            <img src={images.LOGO} alt="Wing Mentor Logo" className="w-16 h-16 object-contain filter brightness-0 invert" />
                        </div>
                        <h2 className="text-xl md:text-3xl font-bold brand-font text-white uppercase tracking-widest text-center max-w-2xl leading-relaxed">
                            CHOOSE YOUR PLATFORM TO OPEN WINGMENTOR PILOT APPS
                        </h2>
                        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-4">Select Platform Interface</p>
                    </div>

                    {/* Platform Selection */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full max-w-4xl justify-center items-center">
                        <button
                            onClick={() => window.open(DESKTOP_APP_URL, '_blank')}
                            className="group w-full md:flex-1 bg-zinc-900 border border-zinc-800 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:bg-zinc-800 shadow-2xl"
                        >
                            <div className="w-16 h-16 rounded-full bg-blue-900/20 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                                <i className="fas fa-desktop text-2xl text-blue-500 group-hover:text-white"></i>
                            </div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Desktop</h3>
                            <p className="text-zinc-500 text-xs text-center leading-relaxed">full immersive suite<br />unlimited data nodes</p>
                        </button>

                        <button
                            onClick={() => window.open(MOBILE_APP_URL, '_blank')}
                            className="group w-full md:flex-1 bg-zinc-900 border border-zinc-800 hover:border-green-500 rounded-2xl p-8 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:bg-zinc-800 shadow-2xl"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-900/20 flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                                <i className="fas fa-mobile-alt text-2xl text-green-500 group-hover:text-white"></i>
                            </div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Mobile</h3>
                            <p className="text-zinc-500 text-xs text-center leading-relaxed">optimized for touch<br />compact interface</p>
                        </button>
                    </div>

                    {/* Cancel */}
                    <button
                        onClick={() => setLaunchSelectionApp(null)}
                        className="mt-16 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center animate-in slide-in-from-bottom-4 duration-500"
                    >
                        <i className="fas fa-times mr-2"></i> Cancel Launch
                    </button>
                </div>
            )
            }

            {
                loadingApp && (
                    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                        {(() => {
                            const app = CAROUSEL_APPS.find(a => a.target === loadingApp) || ACTION_ICONS.find(a => a.target === loadingApp);
                            if (!app) return null;
                            // Use image from config/constants if not present in app object directly, fallback to placeholder
                            const appImage = (app as any).image || (app as any).img;

                            return (
                                <div className="flex flex-col items-center p-8">
                                    <div className="relative mb-8">
                                        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full animate-pulse"></div>
                                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.15)] flex items-center justify-center relative z-10 transition-all duration-700 hover:scale-105 hover:bg-white/15">
                                            {appImage && <img
                                                src={appImage}
                                                alt={app.title}
                                                className="w-20 h-20 md:w-32 md:h-32 object-contain rounded-xl"
                                                style={{ animation: 'logo-glow-pulse 2s infinite ease-in-out' }}
                                            />}
                                        </div>
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-bold brand-font text-white uppercase tracking-widest mb-2 text-center">
                                        {app.title}
                                    </h2>
                                    <div className="flex items-center space-x-2 mt-4">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-4 animate-pulse">
                                        Initializing System...
                                    </p>
                                </div>
                            );
                        })()}
                    </div>
                )
            }

            <DeveloperConsole isOpen={isDevConsoleOpen} onClose={() => setDevConsoleOpen(false)} />

            {/* Hero Header Section - Explicitly setting bg to ensure white in light mode */}
            <div className={`relative z-10 flex flex-col items-center pb-8 px-4 pointer-events-none text-center space-y-2 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
                <h2 className={`text-3xl md:text-6xl font-['Raleway'] font-extrabold uppercase tracking-[0.1em] drop-shadow-2xl
                                ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                    Become a Wing Mentor
                </h2>
                <h2 className={`text-xl md:text-4xl font-['Raleway'] font-[200] uppercase tracking-widest drop-shadow-xl
                                ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                    Bridging the experience gap <br />
                    <span className={`relative inline-flex items-center gap-x-2 md:gap-x-4 align-middle border-b-2 pb-0.5 ${isDarkMode ? 'border-white/50' : 'border-zinc-400'}`}>
                        Low timer

                        {/* Mechanical VOR Revolve - Total Loop 5.5s (Synced with plane in index.html CSS) */}
                        <div className="revolve-container">
                            <div className="revolve-inner" style={{ animation: 'to-fr-revolve 5.5s linear infinite' }}>
                                <span className="revolve-face face-to">TO</span>
                                <span className="revolve-face face-flag"></span>
                                <span className="revolve-face face-fr">FR</span>
                            </div>
                        </div>

                        wing mentor

                        {/* Specifically requested airplane icon, facing towards the right (direction of travel) */}
                        <img
                            src="https://lh3.googleusercontent.com/d/1XGp7XKF4Pzsq9KoO-QHsMUaPDdUo_B-6"
                            alt="Airplane Icon"
                            className="absolute -bottom-[22px] md:-bottom-[26px] w-12 h-12 md:w-16 md:h-16 object-contain pointer-events-none z-[60]"
                            style={{
                                animation: 'underline-slide 5.5s linear infinite, icon-pulse-glow 2s ease-in-out infinite',
                                transform: 'rotate(90deg)'
                            }}
                        />
                    </span>
                </h2>
                <p className={`pt-4 text-[10px] md:text-sm tracking-wide uppercase opacity-80
                                ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Welcome to Wing Mentor fellow pilot
                </p>
            </div>

            {/* Optimized Video Container - Width stabilized for 680px frame */}
            <div className={`relative w-full h-[55vh] md:h-[65vh] overflow-hidden group flex flex-col border-y ${isDarkMode ? 'border-zinc-900 bg-black' : 'border-zinc-200 bg-zinc-100'}`}>

                {isLoading && !isVideoWarm && (
                    <div className={`absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none ${isDarkMode ? 'bg-black/40' : 'bg-white/40'}`}>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-12 h-12 border-4 border-zinc-300 border-t-yellow-500 rounded-full animate-spin"></div>
                            <span className={`text-xs font-bold uppercase tracking-widest animate-pulse ${isDarkMode ? 'text-yellow-500' : 'text-yellow-600'}`}>
                                Loading Flight Data...
                            </span>
                        </div>
                    </div>
                )}

                <div className={`absolute inset-0 overflow-hidden bg-black flex items-center justify-center ${isMuted ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover transition-opacity duration-1000" // Removed scale-[1.35] to fix cropping
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        preload="auto"
                        poster={images.HERO_POSTER}
                        onWaiting={handleWaiting}
                        onCanPlay={handleCanPlay}
                        onPlaying={handlePlaying}
                        onLoadedData={handleLoadedData}
                        src={images.HERO_VIDEO}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30 pointer-events-none"></div>

                <div className="absolute bottom-10 right-10 z-30">
                    {isMuted ? (
                        <button
                            onClick={toggleMute}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-black/60 hover:bg-zinc-800/80 backdrop-blur-md border border-zinc-500 transition-all text-white hover:text-yellow-400 group shadow-lg cursor-pointer"
                        >
                            <i className="fas fa-volume-mute text-sm group-hover:scale-110 transition-transform"></i>
                            <span className="text-xs font-bold uppercase tracking-wider">Unmute</span>
                        </button>
                    ) : (
                        <button
                            onClick={toggleMute}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-black/60 hover:bg-zinc-800/80 backdrop-blur-md border border-zinc-500 transition-all text-white hover:text-yellow-400 group shadow-lg cursor-pointer"
                        >
                            <i className="fas fa-volume-up text-sm group-hover:scale-110 transition-transform"></i>
                            <span className="text-xs font-bold uppercase tracking-wider">Mute</span>
                        </button>
                    )}
                </div>

            </div>

            {/* Laptop Mobile Suite Showcase Section */}
            <div className={`w-full py-16 md:py-24 border-b relative ${isDarkMode ? 'bg-black border-zinc-900' : 'bg-white border-zinc-200'}`}>
                <div
                    className="cursor-pointer flex flex-col items-center justify-center space-y-4 select-none mb-12"
                    onClick={handleScrollClick}
                >
                    <div className="w-full flex flex-col items-center justify-center text-center">
                        <span className={`text-[14px] md:text-lg font-bold uppercase tracking-[0.15em] ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            WINGMENTOR APPS <span className="text-red-600">FOR PILOTS</span> MADE <span className="text-blue-600">BY PILOTS</span>
                        </span>
                        <span className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] font-['Raleway'] mr-[-0.3em] mt-3 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            Learn more about the program
                        </span>
                    </div>
                    <div className="w-full flex justify-center pt-6">
                        <div className="flex flex-col items-center justify-center">
                            <div className="chevron-scroll"></div>
                            <div className="chevron-scroll"></div>
                            <div className="chevron-scroll"></div>
                        </div>
                    </div>
                </div>

                {/* Device Showcase - ON TOP */}
                <div className="w-full flex flex-col items-center mb-12 px-4">
                    <div className="relative w-full max-w-7xl flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-4 group perspective-1000">

                        {/* Ambient Glow */}
                        <div className={`absolute -inset-4 bg-gradient-to-t from-blue-500/20 to-purple-500/10 blur-3xl rounded-[50%] opacity-40 transition-opacity group-hover:opacity-70 ${isDarkMode ? 'block' : 'hidden'}`}></div>

                        {/* Laptop Image */}
                        <div className="relative transform transition-transform duration-700 hover:scale-[1.02] z-10 w-full md:w-2/3">
                            <img
                                src="https://lh3.googleusercontent.com/d/1_R5nqlbDHHvGt69R11eXYBI4xkFueMqE"
                                alt="WingMentor Laptop Interface"
                                className="w-full h-auto object-contain drop-shadow-2xl rounded-lg"
                            />
                        </div>

                        {/* Mobile/iPad Image */}
                        {/* Collision Awareness: Added a clear black border and crisp shadow to the overlapping iPad to clearly define its volume */}
                        <div className="relative transform transition-transform duration-700 hover:scale-[1.05] z-20 w-3/4 md:w-1/4 mt-4 md:mt-0 md:-ml-12 md:mb-2 border-[6px] border-zinc-900 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,1)] bg-black overflow-hidden">
                            <img
                                src={images.IPAD_APPS_IMG}
                                alt="WingMentor Mobile Interface"
                                className="w-full h-auto object-contain rounded-[2rem]"
                            />
                        </div>
                    </div>

                    <p className={`mt-12 text-xs font-mono uppercase tracking-[0.2em] font-bold opacity-60 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        Cross-Platform WingMentor Pilot Apps Suite
                    </p>

                    {/* Access Buttons - REPLACED WITH MOBILE AND DESKTOP */}
                    <div className="mt-8 flex flex-col items-center space-y-6">
                        <div className="flex flex-wrap justify-center gap-6">
                            <button
                                onClick={() => window.open(MOBILE_APP_URL, '_blank')}
                                className={`flex items-center space-x-3 px-6 py-3 rounded-xl border transition-all hover:-translate-y-1 shadow-lg cursor-pointer
                                          bg-red-600 border-red-500 text-white hover:bg-red-500 shadow-red-900/20`}
                            >
                                <i className="fas fa-mobile-alt text-2xl"></i>
                                <div className="text-left">
                                    <p className="text-[9px] uppercase tracking-wider opacity-80">Access on</p>
                                    <p className="text-sm font-bold leading-none">Mobile</p>
                                </div>
                            </button>

                            <button
                                onClick={() => window.open(DESKTOP_APP_URL, '_blank')}
                                className={`flex items-center space-x-3 px-6 py-3 rounded-xl border transition-all hover:-translate-y-1 shadow-lg cursor-pointer
                                          bg-blue-600 border-blue-500 text-white hover:bg-blue-500 shadow-blue-900/20`}
                            >
                                <i className="fas fa-desktop text-2xl"></i>
                                <div className="text-left">
                                    <p className="text-[9px] uppercase tracking-wider opacity-80">Access on</p>
                                    <p className="text-sm font-bold leading-none">Desktop</p>
                                </div>
                            </button>
                        </div>

                        <p className={`mt-6 text-[10px] font-bold uppercase tracking-widest text-center max-w-md ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
                            You must be signed in or part of the WingMentor Program to access the Apps Suite.
                        </p>
                    </div>
                </div>

                {/* WingMentor Portal Access Section - MOVED BELOW DEVICE SHOWCASE */}
                <div className="w-full max-w-5xl mx-auto mt-24 mb-16 px-6 flex flex-col items-center text-center">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-400 to-transparent opacity-30 mb-12"></div>

                    <RevealOnScroll>
                        <h3 className={`text-2xl md:text-3xl font-bold brand-font uppercase tracking-widest mb-6 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                            WingMentor Program Portal
                        </h3>
                    </RevealOnScroll>

                    <div className="relative w-full max-w-4xl group perspective-1000 mb-8">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-red-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className={`relative rounded-xl overflow-hidden border-2 shadow-2xl ${isDarkMode ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'}`}>
                            <img
                                src="https://lh3.googleusercontent.com/d/1ey-O8iN08k9C5z2aqCcSANVJAFmhhD6k"
                                alt="WingMentor Portal Interface"
                                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.01]"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                        </div>
                    </div>

                    <RevealOnScroll delay={100}>
                        <div className="max-w-3xl mx-auto space-y-4">
                            <p className={`text-lg md:text-xl font-light leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                This portal is your command center.
                            </p>
                            <p className={`text-sm md:text-base leading-relaxed font-sans ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                Seamlessly connect to the WingMentor Network and unlock the full suite of pilot-engineered applications. From here, you manage your flight profile, access the Black Box intelligence vault, and engage with the community in the Gap Forum. It is the centralized gateway where your career acceleration begins.
                            </p>
                            <div className="pt-6 flex justify-center flex-col items-center gap-12">

                                {/* 1. Header Text - Kept Above Button */}
                                <span className={`text-[14px] md:text-lg font-bold uppercase tracking-[0.15em] ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                    WINGMENTOR APPS <span className="text-red-600">FOR PILOTS</span> MADE <span className="text-blue-600">BY PILOTS</span>
                                </span>

                                {/* 2. Button - In Middle */}
                                <button
                                    onClick={() => window.open('https://wmprogram.vercel.app/', '_blank')}
                                    className={`px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-xl hover:scale-105
                                              ${isDarkMode
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-blue-900/50'
                                            : 'bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-blue-500/30'}`}
                                >
                                    Access Portal Terminal <i className="fas fa-arrow-right ml-3"></i>
                                </button>

                                {/* 3. Learn More + Chevrons - Moved Below Button */}
                                <div
                                    className="cursor-pointer flex flex-col items-center justify-center space-y-4 select-none"
                                    onClick={handleScrollClick}
                                >
                                    <span className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] font-['Raleway'] mr-[-0.3em] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                        Learn more about the program
                                    </span>
                                    <div className="w-full flex justify-center pt-2">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="chevron-scroll"></div>
                                            <div className="chevron-scroll"></div>
                                            <div className="chevron-scroll"></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* Unified Link positioned on the border of the section */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 flex justify-center">
                    <button
                        onClick={handleLearnMoreApps}
                        className={`px-8 py-3 border rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl backdrop-blur-md
                                   ${isDarkMode
                                ? 'bg-black border-zinc-700 text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/50'
                                : 'bg-white border-zinc-300 text-zinc-600 hover:text-blue-600 hover:border-blue-400'}`}
                    >
                        learn more about pilot apps <i className="fas fa-chevron-right ml-2 text-[8px] animate-pulse"></i>
                    </button>
                </div>
            </div>

            <PilotsStory onAnimationComplete={() => onGoToHub()} />

            {/* --- RECONSTRUCTED 'ABOUT PROGRAM & APPS' SECTION BASED ON USER REQUEST --- */}
            <div
                id="about-program-overview-section"
                className={`w-full relative py-24 px-6 flex flex-col items-center justify-center transition-colors duration-500
                            ${isDarkMode ? 'bg-black text-white' : 'bg-zinc-100 text-black'} border-y ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'}`}
            >
                {/* Background */}
                <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5" style={{ backgroundImage: `url(${images.MINDMAP_SECTION_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className={`absolute inset-0 z-0 ${isDarkMode ? 'bg-black/80' : 'bg-zinc-100/80'}`}></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto text-center space-y-32">

                    {/* RESTORED: Program Overview Header & Description (Based on original functionality) */}
                    <RevealOnScroll className="flex flex-col items-center space-y-8">
                        <div className="flex justify-center mb-6">
                            <img src={images.LOGO} alt="Wing Mentor Logo" className={`w-64 md:w-[450px] h-auto object-contain ${isDarkMode ? 'filter invert' : ''}`} />
                        </div>
                        <h2 className={`text-4xl md:text-5xl font-bold brand-font uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                            About Program & Apps
                        </h2>
                        <p className={`text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            Transforming Low-Time Pilots into Verifiable Assets.
                        </p>

                        <div className={`w-full rounded-xl overflow-hidden shadow-2xl border relative group max-w-4xl mx-auto ${isDarkMode ? 'border-zinc-700/50' : 'border-zinc-300'}`}>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                            <img
                                src="https://lh3.googleusercontent.com/d/143EeRX8BneoJRBh32bD4UgpHLUByBCbc"
                                alt="Wing Mentor Session Analysis"
                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-xs font-bold uppercase tracking-widest text-center">Verified Logged Guidance & Consultation</p>
                            </div>
                        </div>

                        <div className={`text-lg leading-relaxed space-y-6 font-light max-w-4xl mx-auto text-left ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
                            <p>
                                The WingMentor program creates a symbiotic environment where both mentor and mentee gain valuable experience. Every logged mentor session is another tangible step towards your program goals. Within the WingMentor framework, you will assess and learn how to understand and assess mentees on their decision-making thinking—whether it is in a simulator practice session or analyzing complex <span className="font-bold">IFR approach charts</span>.
                            </p>
                            <p>
                                The more detailed the session, the more profound the Crew Resource Management (CRM) skills you gain. You are building capability not just as a mentor, but as a pilot who can expertly consult and assess problem-solving skills in high-stakes environments.
                            </p>
                        </div>
                    </RevealOnScroll>

                    {/* 1. Milestones & Achievements */}
                    <RevealOnScroll className="flex flex-col items-center">
                        <button
                            onClick={onGoToProgramDetail}
                            className="mb-16 px-12 py-4 rounded-full bg-[#b91c1c] text-white font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-red-800 transition-colors"
                        >
                            <i className="fas fa-info-circle mr-2"></i> Learn More About The Program
                        </button>

                        <h2 className={`text-4xl md:text-6xl font-bold brand-font uppercase tracking-widest mb-10 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                            Milestones & Achievements
                        </h2>
                        <p className={`text-lg md:text-xl leading-relaxed max-w-4xl mx-auto mb-12 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            Throughout your mentorship journey, your dedication is tracked and celebrated. You will receive recognition through <span className="font-bold">official digital badges</span>, exclusive pilot awards, and a progressive rank structure. Every milestone you reach within the WingMentor ecosystem is a verifiable achievement that signals your growth as an aviator and a leader. We provide <span className="font-bold">Program Completion Certificates</span> and specialized awards for mentors who exhibit exceptional CRM and technical consultation skills. These aren't just pieces of paper; they are assets for your professional portfolio, proving you have been vetted and recognized by a senior panel of industry professionals.
                        </p>
                        <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                            <img src="https://lh3.googleusercontent.com/d/112h6L1fuk_wR5HVZEtiDJY7Xz02KyEbx" alt="WingMentor Passport and Awards" className="w-full h-auto object-cover" />
                        </div>
                    </RevealOnScroll>

                    {/* 2. Differentiation (Comic) */}
                    <RevealOnScroll className="flex flex-col items-center">
                        <h2 className={`text-3xl md:text-5xl font-bold brand-font uppercase tracking-tight mb-12 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                            Differentiation: Flight Instructor vs Wing Mentor<br />Consultancy Approach
                        </h2>
                        <div className="w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-zinc-500/20">
                            <img src={images.INSTRUCTION_VS_CONSULTANCY_IMG} alt="Comparison Comic" className="w-full h-auto object-contain" />
                        </div>
                    </RevealOnScroll>


                    {/* 3. Consultation Text */}
                    <RevealOnScroll className="max-w-4xl mx-auto text-center space-y-8">
                        <p className={`text-lg md:text-xl leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
                            It is crucial to understand the distinction: <span className="font-bold">We do not teach lectures or seminars.</span> It is not our role to teach initial concepts or replace your flight school's curriculum. Instead, our mission is to <span className="font-bold">support and consult</span> based on your specific performance within your education and flight training in the aviation industry.
                        </p>
                        <p className={`text-lg md:text-xl leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
                            Whether you are a <span className="font-bold">student pilot</span> struggling with a specific maneuver, a <span className="font-bold">flight instructor</span> looking to refine your briefing techniques, or a <span className="font-bold">pilot returning after 10 years</span> who needs a skills refresher to get back in the cockpit—this is where WingMentor comes in. We analyze your performance gaps and provide the targeted consultation needed to bridge them.
                        </p>
                        <div className="pt-8">
                            <p className="text-sm italic text-zinc-500 mb-4">Read more engaging sketched pilot real life scenarios in our handbook</p>
                            <button
                                onClick={onGoToOperatingHandbook}
                                className="px-12 py-4 rounded-full bg-blue-700 text-white font-bold uppercase tracking-[0.15em] shadow-xl hover:bg-blue-800 transition-colors flex items-center mx-auto"
                            >
                                Read The Handbook as a Requirement of the Program <i className="fas fa-book-open ml-3"></i>
                            </button>
                        </div>
                    </RevealOnScroll>

                    {/* 4. Approach Chart - REDESIGNED as Checklist */}
                    <RevealOnScroll className="w-full max-w-5xl mx-auto bg-black text-white p-8 md:p-12 rounded-xl shadow-2xl border border-zinc-800 relative overflow-hidden">
                        {/* Decorative corner markers for technical look */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/30"></div>
                        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/30"></div>
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/30"></div>
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/30"></div>

                        <div className="flex flex-col md:flex-row justify-between items-end border-b border-zinc-800 pb-4 mb-8">
                            <div className="text-left">
                                <h2 className="text-4xl md:text-5xl font-black brand-font uppercase tracking-tighter leading-none text-white">
                                    WINGMENTOR APPROACH CHECKLIST
                                </h2>
                            </div>
                            <div className="hidden md:block text-right">
                            </div>
                        </div>

                        <div className="relative">
                            {/* Vertical Divider Line */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800 -translate-x-1/2"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {APPROACH_STEPS.map((step, idx) => (
                                    <div key={idx} className={`flex flex-col relative ${idx % 2 === 0 ? 'md:pr-6' : 'md:pl-6'}`}>
                                        {/* Header Line */}
                                        <div className="flex items-start gap-4 mb-2">
                                            {/* Bullet/Number */}
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            </div>
                                            <div className="flex-1 border-b border-zinc-800 border-dotted pb-2">
                                                <div className="flex justify-between items-end">
                                                    <h4 className="text-lg font-black uppercase tracking-tight text-yellow-500 leading-none">
                                                        {step.title.split(':')[0]}
                                                    </h4>
                                                    <span className="font-mono text-sm font-bold text-zinc-500">{step.num}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pl-6">
                                            <p className="font-sans text-xs md:text-sm font-medium text-zinc-300 leading-relaxed text-justify">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* 5. CTAs: Mentor & Mentee - REFACTORED TO VERTICAL RECTANGULAR CARDS */}
                    <div className="w-full max-w-4xl mx-auto flex flex-col gap-10">

                        {/* Mentor CTA - Red Card (On Top) */}
                        <RevealOnScroll className={`flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl border-2 border-[#b91c1c] ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                            {/* Image Side */}
                            <div className="w-full md:w-5/12 h-64 md:h-auto relative">
                                <img
                                    src="https://lh3.googleusercontent.com/d/143EeRX8BneoJRBh32bD4UgpHLUByBCbc"
                                    alt="Mentor Handshake"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-[#b91c1c]/20"></div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-center text-left">
                                <h2 className={`text-2xl md:text-3xl font-bold brand-font uppercase tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                    Becoming a Wing Mentor
                                </h2>
                                <p className={`text-sm leading-relaxed mb-6 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                    Walk into an interview not just with a license, but with the leverage to say, '<span className="italic font-bold">I have supported and guided pilots.</span>' Transform your flight hours into verifiable leadership experience.
                                </p>
                                <button
                                    onClick={onGoToEnrollment}
                                    className="w-full md:w-auto py-3 px-8 bg-[#b91c1c] text-white font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-red-800 transition-colors flex justify-center items-center text-xs"
                                >
                                    Enroll as Mentor <i className="fas fa-plane-departure ml-3"></i>
                                </button>
                            </div>
                        </RevealOnScroll>

                        {/* Mentee CTA - Blue Card (Below) */}
                        <RevealOnScroll className={`flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl border-2 border-blue-600 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`} delay={200}>
                            {/* Image Side */}
                            <div className="w-full md:w-5/12 h-64 md:h-auto relative">
                                <img
                                    src={images.STORY_MENTOR_1}
                                    alt="Mentorship Session"
                                    className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-blue-600/20"></div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-center text-left">
                                <h2 className={`text-2xl md:text-3xl font-bold brand-font uppercase tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                    Enroll Now as Mentee
                                </h2>
                                <p className={`text-sm leading-relaxed mb-6 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                    Gain a decisive advantage in your flight training. Receive personalized guidance, unlock the Black Box Knowledge Vault, and connect with experienced mentors who have already walked the path to the cockpit.
                                </p>
                                <button
                                    onClick={onGoToEnrollment}
                                    className="w-full md:w-auto py-3 px-8 bg-blue-700 text-white font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-blue-800 transition-colors flex justify-center items-center text-xs"
                                >
                                    Enroll as Mentee <i className="fas fa-graduation-cap ml-3"></i>
                                </button>
                            </div>
                        </RevealOnScroll>
                    </div>

                    {/* 5b. Mentee Additional Text */}
                    <RevealOnScroll className="max-w-4xl mx-auto text-center">
                        <p className={`text-lg leading-relaxed font-mono ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>
                            For the <span className="text-blue-500 font-bold">Mentee</span>, your path is one of guided growth. Your mission is to absorb, learn, and overcome challenges with the support of a dedicated mentor. Upon successful enrollment and a vetting interview, you gain access to the Wing Mentor Knowledge Vault—our comprehensive library of resources including study materials for PPL, CPL, IR, and ME ratings. This is about building a deep, practical understanding that prepares you for your next lesson and instills the confidence to command a career.
                        </p>
                    </RevealOnScroll>

                    {/* NEW CAROUSEL SECTION - With Updated Content & Layout */}
                    <RevealOnScroll className="w-full mt-24 px-4 overflow-hidden relative" id="pilot-apps-ecosystem">
                        <div className="max-w-7xl mx-auto relative">
                            <h3 className={`text-2xl font-bold brand-font uppercase tracking-widest text-center mb-16 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                Pilot App Ecosystem
                            </h3>

                            {/* Left Arrow */}
                            <button
                                onClick={handlePrevCard}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-lg hidden md:flex"
                            >
                                <i className="fas fa-chevron-left text-lg"></i>
                            </button>

                            {/* Right Arrow */}
                            <button
                                onClick={handleNextCard}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-lg hidden md:flex"
                            >
                                <i className="fas fa-chevron-right text-lg"></i>
                            </button>

                            {/* Carousel Container */}
                            <div className="flex justify-center items-center h-[550px] perspective-1000">
                                {CAROUSEL_APPS.map((app, index) => {
                                    // Calculate relative position based on current index
                                    // We want 3 visible: -1 (left), 0 (center), 1 (right)
                                    let offset = (index - carouselIndex + CAROUSEL_APPS.length) % CAROUSEL_APPS.length;
                                    // Adjust for wrapping to center the active card logic
                                    if (offset > CAROUSEL_APPS.length / 2) offset -= CAROUSEL_APPS.length;

                                    const isActive = offset === 0;
                                    const isVisible = Math.abs(offset) <= 1; // Only show center and immediate neighbors on desktop

                                    // Mobile Logic: Only show active
                                    // Desktop Logic: Show 3
                                    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                                    if (isMobile && !isActive) return null;
                                    if (!isMobile && !isVisible) return null;

                                    return (
                                        <div
                                            key={index}
                                            className={`absolute w-80 md:w-96 h-[500px] rounded-3xl p-6 flex flex-col border-2 shadow-2xl transition-all duration-500 ease-out transform
                                                  ${isActive
                                                    ? `z-20 scale-100 opacity-100 ${app.color} ${app.borderColor}`
                                                    : `z-10 scale-90 opacity-50 blur-[1px] translate-x-[${offset * 120}%] bg-zinc-900 border-zinc-800`}`}
                                            style={{
                                                // Manual transform for positioning if not using Tailwind translate classes directly for dynamic values
                                                transform: !isMobile
                                                    ? `translateX(${offset * 110}%) scale(${isActive ? 1 : 0.9}) rotateY(${offset * -5}deg)`
                                                    : `scale(1)`
                                            }}
                                        >
                                            {/* Top Section: App Image */}
                                            <div className="flex flex-col items-center mb-6 relative">
                                                {/* App Image Container - Clean, no overlays */}
                                                <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 mb-4 group cursor-pointer transition-transform duration-300 hover:scale-105">
                                                    {/* Background Image */}
                                                    <img
                                                        src={app.img}
                                                        alt={app.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>

                                                {/* Title */}
                                                <h4 className="text-2xl font-bold brand-font text-white uppercase tracking-wider text-center leading-none mt-2">
                                                    {app.title}
                                                </h4>
                                            </div>

                                            {/* Middle Section: Description */}
                                            <div className="mb-6 flex-grow border-b border-white/10 pb-4">
                                                <p className="text-xs text-zinc-300 font-sans leading-relaxed text-center">
                                                    {app.desc}
                                                </p>
                                            </div>

                                            {/* Bottom Section: Bullet Points & Action */}
                                            <div className="mt-auto">
                                                <p className="text-[9px] font-bold uppercase text-white/50 mb-3 tracking-widest">Key Features</p>
                                                <ul className="space-y-2 mb-6">
                                                    {app.bullets.map((bullet, idx) => (
                                                        <li key={idx} className="flex items-start text-xs text-zinc-200">
                                                            <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-[10px]"></i>
                                                            <span className="font-medium tracking-tight">{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button
                                                    onClick={() => setLaunchSelectionApp(app)}
                                                    className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all flex justify-center items-center group shadow-lg"
                                                >
                                                    Launch Application <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform text-[10px]"></i>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Mobile Dots */}
                            <div className="flex justify-center space-x-2 mt-8 md:hidden">
                                {CAROUSEL_APPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-colors ${i === carouselIndex ? 'bg-blue-500' : 'bg-zinc-600'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </RevealOnScroll>

                </div>
            </div>

            {/* How We Fill The Aviation Low Timer Pilot Gap */}
            <div
                id="how-we-fill-gap-section"
                className={`w-full transition-colors duration-500 ${isDarkMode ? 'bg-black' : 'bg-white'}`}
            >
                <div className="w-full relative pt-24 pb-16 px-6 flex flex-col items-center justify-center">
                    <div className="relative z-10 w-full max-w-6xl mx-auto text-center">
                        <RevealOnScroll delay={100}>
                            <h2 className={`text-4xl md:text-6xl font-bold brand-font uppercase tracking-wider mb-6 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                How We Filled The Aviation Low Timer Pilot Gap
                            </h2>
                            <h3 className={`text-xl md:text-3xl font-light leading-relaxed uppercase tracking-widest ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                Visualizing the Pilot's Journey: Bridging the Red Gap
                            </h3>
                        </RevealOnScroll>
                    </div>
                </div>

                <div className="px-6 pb-16">
                    <RevealOnScroll delay={150}>
                        <div className={`relative rounded-2xl overflow-hidden shadow-2xl border group max-w-7xl mx-auto ${isDarkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-white'}`}>
                            <img
                                src="https://lh3.googleusercontent.com/d/1cyHKAiNbxXZltgOwIk5wxZg2_J_2ShGO"
                                alt="Aviation Gap Strategic Blueprint"
                                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.01]"
                            />
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    </RevealOnScroll>
                </div>

                <div className="w-full relative pb-24 px-6 flex flex-col items-center justify-center">
                    <div className="relative z-10 w-full max-w-6xl mx-auto text-center">
                        <RevealOnScroll delay={200}>
                            <p className={`text-center text-xs mb-12 uppercase tracking-widest animate-pulse relative z-10 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                Hover over nodes to reveal details • Click nodes to unfold the story
                            </p>
                        </RevealOnScroll>

                        <MindMap />

                        <RevealOnScroll delay={700}>
                            <button
                                onClick={onGoToGapPage}
                                className={`px-10 py-4 rounded-full tracking-widest text-lg font-bold transition-all shadow-xl mt-16
                                        ${isDarkMode
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                                        : 'bg-blue-700 hover:bg-blue-600 text-white shadow-blue-200'}`}
                            >
                                Access Our Pilot Gap Forum For More Information <i className="fas fa-arrow-right ml-3"></i>
                            </button>
                            <p className={`mt-4 text-sm max-w-xl mx-auto ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                Insight into previous pilot investments so that you don’t have to experience and avoid hardship and loss.
                            </p>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            <div
                id="why-wing-mentor-section"
                className={`w-full relative py-24 px-6 flex flex-col items-center justify-center transition-colors duration-500
                            ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-black'}`}>
                <RevealOnScroll delay={100} className="max-w-4xl mx-auto text-center">
                    <h2 className={`text-4xl md:text-5xl font-bold brand-font uppercase tracking-widest mb-8 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                        Why Wing Mentor?
                    </h2>
                    <p className={`text-xl md:text-2xl leading-relaxed mb-12 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        We exist to solve the industry's toughest challenge: the "experience paradox." Wing Mentor is the innovative bridge for low-time pilots, offering verifiable mentorship, crucial skill refinement, and a supportive community. It's not just about getting hours; it's about gaining the confidence and documented experience that truly sets you apart.
                    </p>
                    <button
                        onClick={onGoToProgramDetail}
                        className={`px-10 py-4 rounded-full tracking-widest text-lg font-bold transition-all shadow-xl
                                ${isDarkMode
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                                : 'bg-blue-700 hover:bg-blue-600 text-white shadow-blue-200'}`}
                    >
                        Explore Our Program <i className="fas fa-arrow-right ml-3"></i>
                    </button>
                </RevealOnScroll>
            </div>

            <div
                id="about-us-section"
                className="w-full min-h-screen relative flex flex-col items-center justify-center py-32 md:py-48 overflow-hidden"
            >
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                        src={images.ABOUT_BG}
                        alt="About Page Background"
                        className="w-full h-full object-cover object-center scale-150 sm:scale-100"
                        style={{
                            filter: isDarkMode ? 'grayscale(0.6) blur(2px)' : 'grayscale(0.2) blur(2px) opacity(0.6)',
                            pointerEvents: 'none'
                        }}
                    />
                    <div className={`absolute inset-0 z-10 ${isDarkMode ? 'bg-black/60' : 'bg-white/80'}`}></div>
                </div>

                <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-12 mb-16">

                        <RevealOnScroll className="mb-4">
                            <div className={`flex justify-center mb-8 backdrop-blur-sm p-4 rounded-xl shadow-lg ${isDarkMode ? 'bg-black/50' : 'bg-white/70 border border-zinc-200'}`}>
                                <img
                                    src={images.ABOUT_US_HEADER_IMAGE}
                                    alt="About Us Header Graphic"
                                    className="w-64 md:w-80 h-auto object-contain"
                                />
                            </div>
                            <h2 className={`text-4xl md:text-5xl font-bold brand-font uppercase tracking-widest
                                        ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                About Wing Mentor
                            </h2>
                        </RevealOnScroll>
                        <div className={`w-32 h-1 mx-auto ${isDarkMode ? 'bg-red-600' : 'bg-red-50'}`}></div>
                    </div>

                    <div className="mb-24">
                        <RevealOnScroll className="mb-16">
                            <h3 className={`text-3xl md:text-4xl font-bold brand-font uppercase text-center tracking-widest
                                        ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                Meet The Founders
                            </h3>
                        </RevealOnScroll>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

                            <RevealOnScroll delay={100} className={`flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 border
                                            ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800 hover:border-yellow-600/50' : 'bg-white/70 border border-zinc-200 hover:border-blue-400'}`}>
                                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-yellow-500 shadow-xl mb-6 relative group">
                                    <img
                                        src={images.BENJAMIN_BOWLER_PORTRAIT}
                                        alt="Benjamin Tiger Bowler"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h4 className={`text-2xl font-bold brand-font uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                    Benjamin Tiger Bowler
                                </h4>
                                <span className={`text-sm font-bold uppercase tracking-[0.2em] mb-4 ${isDarkMode ? 'text-red-500' : 'text-red-600'}`}>
                                    Founder
                                </span>
                                <p className={`text-sm md:text-base leading-relaxed notam-font ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                    "We couldn't stand by and watch qualified pilots give up. Wing Mentor is our answer to the 'experience paradox'—providing a structured environment where pilots can prove their worth and keep their dreams alive."
                                </p>
                            </RevealOnScroll>

                            <RevealOnScroll delay={200} className={`flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 border
                                            ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800 hover:border-yellow-600/50' : 'bg-white/70 border border-zinc-200 hover:border-blue-400'}`}>
                                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-yellow-500 shadow-xl mb-6 relative group">
                                    <img
                                        src={images.KARL_VOGT_PORTRAIT}
                                        alt="Karl Brian Vogt"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h4 className={`text-2xl font-bold brand-font uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                    Karl Brian Vogt
                                </h4>
                                <span className={`text-sm font-bold uppercase tracking-[0.2em] mb-4 ${isDarkMode ? 'text-red-500' : 'text-red-600'}`}>
                                    Founder
                                </span>
                                <p className={`text-sm md:text-base leading-relaxed notam-font ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                    "The aviation industry demands more than just hours; it demands leadership, critical thinking, and adaptability. Wing Mentor cultivates these essential qualities, preparing pilots to not just fill a seat, but to command a career. We're building aviators of influence."
                                </p>
                            </RevealOnScroll>
                        </div>
                    </div>
                </div>
            </div>

            <footer id="contact-us-section" className={`border-t pt-16 pb-8 px-6 relative z-10 transition-colors duration-500 ${isDarkMode ? 'bg-black border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <img src={images.LOGO} alt="Wing Mentor Logo" className={`w-12 h-12 object-contain ${!isDarkMode && 'filter brightness-0 invert-0'}`} />
                            <span className={`text-xl font-bold brand-font uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Wing Mentor</span>
                        </div>
                        <p className={`text-xs leading-relaxed max-sm ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
                            Bridging the gap between license and career. A dedicated platform for low-timer pilots to build verifiable experience, command authority, and professional industry connections.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="#" className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300 hover:text-blue-600'}`}>
                                <i className="fab fa-facebook-f text-xs"></i>
                            </a>
                            <a href="#" className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300 hover:text-blue-600'}`}>
                                <i className="fab fa-instagram text-xs"></i>
                            </a>
                            <a href="#" className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300 hover:text-blue-600'}`}>
                                <i className="fab fa-twitter text-xs"></i>
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className={`text-sm font-bold uppercase tracking-widest border-b pb-2 inline-block ${isDarkMode ? 'text-white border-zinc-800' : 'text-zinc-900 border-zinc-300'}`}>Flight Operations</h4>
                        <ul className={`space-y-4 text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            <li className="flex items-start space-x-3">
                                <i className="fas fa-map-marker-alt mt-1 text-yellow-600"></i>
                                <span>Manila, Philippines<br />Global Remote Operations</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <i className="fas fa-envelope mt-1 text-yellow-600"></i>
                                <a href="mailto:wingmentorprogram@gmail.com" className={`hover:underline ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>wingmentorprogram@gmail.com</a>
                            </li>
                            <li className="flex items-start space-x-3">
                                <i className="fas fa-headset mt-1 text-yellow-600"></i>
                                <span>Support Frequency: 123.45</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className={`text-sm font-bold uppercase tracking-widest border-b pb-2 inline-block ${isDarkMode ? 'text-white border-zinc-800' : 'text-zinc-900 border-zinc-300'}`}>System Status</h4>
                        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800/50' : 'bg-zinc-100 border-zinc-200'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] uppercase font-bold text-zinc-500">Mentor Level</span>
                                <span className="text-[10px] uppercase font-bold text-green-500">Active</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <EpauletBars count={4} size="small" />
                                <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Captain / Mentor</span>
                            </div>
                            <div className={`w-full h-px my-3 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-300'}`}></div>
                            <p className="text-[10px] text-zinc-600">
                                Authorized Personnel Only. <br />
                                System ID: WM-2024-ALPHA
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-wider ${isDarkMode ? 'border-zinc-900 text-zinc-600' : 'border-zinc-200 text-zinc-500'}`}>
                    <p>&copy; 2024 WingMentor. All Rights Reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className={`hover:underline ${isDarkMode ? 'hover:text-zinc-400' : 'hover:text-zinc-800'}`}>Privacy Policy</a>
                        <a href="#" className={`hover:underline ${isDarkMode ? 'hover:text-zinc-400' : 'hover:text-zinc-800'}`}>Terms of Service</a>
                        <a href="#" className={`hover:underline ${isDarkMode ? 'hover:text-zinc-400' : 'hover:text-zinc-800'}`}>POH Reference</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

