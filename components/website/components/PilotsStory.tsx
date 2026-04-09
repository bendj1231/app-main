
import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';

interface PilotsStoryProps {
    onAnimationComplete?: () => void;
}

export const PilotsStory: React.FC<PilotsStoryProps> = ({ onAnimationComplete }) => {
    const { config } = useConfig();
    const { images } = config;
    const scrollRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const starterMenteeRef = useRef<HTMLDivElement>(null); // Ref to trigger animation
    const [isAutoScrolling, setIsAutoScrolling] = useState(false);
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);

    // State for the Modals
    const [isMenteeModalOpen, setIsMenteeModalOpen] = useState(false);
    const [isJuniorModalOpen, setIsJuniorModalOpen] = useState(false);
    const [isOfficialModalOpen, setIsOfficialModalOpen] = useState(false);
    const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState(false);
    const [isVerifiableModalOpen, setIsVerifiableModalOpen] = useState(false);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

    // Consolidated state for performance
    const [storyState, setStoryState] = useState({
        progress: 0,
        planeX: 150, // Starting coordinates based on path "M 150 50"
        planeY: 50,
        planeAngle: 0
    });

    const PLANE_ICON = "https://lh3.googleusercontent.com/d/1q78Cwx2mA6g-imdVfDPfFX1WkxN7pn7j";

    useEffect(() => {
        let isUserScrolling = false;
        let lastScrollY = window.scrollY;
        let scrollTimeout: NodeJS.Timeout;

        const handleScroll = () => {
            if (!scrollRef.current || !pathRef.current || !starterMenteeRef.current) return;

            const elementHeight = scrollRef.current.getBoundingClientRect().height;

            if (elementHeight === 0) return; // Prevent division by zero if element is hidden or height is 0

            const starterMenteeRect = starterMenteeRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate raw progress based on the starter mentee's position.
            // Animation starts when the starter mentee section enters the viewport.
            let rawProgress = (windowHeight - starterMenteeRect.top) / elementHeight;

            // Clamp raw progress between 0 and 1
            rawProgress = Math.max(0, Math.min(1, rawProgress));

            // Apply a constant fast speed curve to the progress
            // Adjusted speed to be faster (approx 1.5 times faster than original 1.5 multiplier)
            let progress = rawProgress * 2.25;

            // Final animation progress is clamped to 1
            progress = Math.min(1, progress);

            // Calculate Plane Position and Rotation
            const path = pathRef.current;

            // Check if getTotalLength exists and returns a valid number (browser compatibility/state check)
            if (typeof path.getTotalLength !== 'function') return;

            const totalLen = path.getTotalLength();

            if (!Number.isFinite(totalLen) || totalLen === 0) return; // Safety check

            const currentLen = totalLen * progress;

            if (!Number.isFinite(currentLen)) return; // Prevent passing non-finite value to getPointAtLength

            const point = path.getPointAtLength(currentLen);

            // Calculate angle for rotation (look ahead/behind for tangent)
            const lookAhead = 2;
            let p1 = point;
            let p2 = point;

            if (currentLen < totalLen - lookAhead) {
                p2 = path.getPointAtLength(currentLen + lookAhead);
                // Standard atan2
            } else {
                // At end of path, look backward to maintain angle
                p1 = path.getPointAtLength(currentLen - lookAhead);
                p2 = point;
            }

            // Calculate angle in degrees
            // Standard math calculates 0 deg as East (Right). 
            // If the plane icon points right by default, no adjustment needed.
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

            setStoryState({
                progress,
                planeX: point.x,
                planeY: point.y,
                planeAngle: angle
            });

            // Detect user scrolling to interrupt auto-scroll
            const currentScrollY = window.scrollY;
            if (Math.abs(currentScrollY - lastScrollY) > 5) {
                isUserScrolling = true;
                setIsAutoScrolling(false);
            }
            lastScrollY = currentScrollY;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isUserScrolling = false;
            }, 150);
        };

        const startAutoScroll = () => {
            if (isAutoScrolling) return;
            setIsAutoScrolling(true);
            setShowScrollIndicator(false);
            
            // Calculate the total scrollable height
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const scrollableHeight = documentHeight - windowHeight;
            const startScrollY = window.scrollY;
            const duration = 5000; // 5 seconds to scroll through
            const startTime = performance.now();

            const animateScroll = (currentTime: number) => {
                if (isUserScrolling || !isAutoScrolling) return;
                
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth scrolling
                const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                const easedProgress = easeInOutQuad(progress);
                
                const targetScrollY = startScrollY + (scrollableHeight * easedProgress);
                window.scrollTo({ top: targetScrollY, behavior: 'auto' });
                
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                } else {
                    setIsAutoScrolling(false);
                    // Trigger navigation callback after animation completes
                    if (onAnimationComplete) {
                        setTimeout(() => onAnimationComplete(), 500);
                    }
                }
            };

            requestAnimationFrame(animateScroll);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial call to set state correctly on mount
        handleScroll();

        // Start auto-scroll after a short delay when component mounts
        const autoScrollTimeout = setTimeout(() => {
            startAutoScroll();
        }, 1000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(autoScrollTimeout);
            clearTimeout(scrollTimeout);
        };
    }, [isAutoScrolling, onAnimationComplete]);

    return (
        <div className="w-full relative bg-[#e3d0a6] overflow-hidden">

            {/* Scroll Indicator */}
            {showScrollIndicator && (
                <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#3e2b1e]/70">Auto-scrolling</span>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-[#3e2b1e]/50 to-transparent" />
                </div>
            )}

            {/* Starter Mentee Full Detail Modal */}
            {isMenteeModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative max-w-2xl w-full bg-[#fdfbf7] rounded-2xl overflow-hidden shadow-2xl flex flex-col border-4 border-[#3e2b1e]">
                        <button
                            onClick={() => setIsMenteeModalOpen(false)}
                            className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors border border-white/20"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        {/* Modal Image Section - Wide Landscape */}
                        <div className="w-full h-56 md:h-80 bg-black overflow-hidden">
                            <img src={images.STORY_STUDENT} alt="Starter Mentee Full Detail" className="w-full h-full object-cover" />
                        </div>

                        {/* Modal Content Section - Below Image */}
                        <div className="w-full p-8 flex flex-col justify-center">
                            <h2 className="text-3xl brand-font font-bold text-[#3e2b1e] uppercase tracking-wider mb-4">Starter Mentee</h2>
                            <div className="w-16 h-1 bg-[#b91c1c] mb-6"></div>

                            <div className="space-y-4 text-[#4a3b2a] font-['Playfair_Display',_serif] text-base md:text-lg leading-relaxed italic">
                                <p>
                                    "This is where your aviation legacy begins. Every master was once a student who refused to give up."
                                </p>
                                <p>
                                    Reaching the goal of <span className="font-bold text-[#b91c1c]">10 hours</span> with a mentor is more than just a number—it is your first verified certificate of dedication. This milestone serves as the key to <strong>The Black Box</strong>, our most exclusive repository of knowledge.
                                </p>
                                <p>
                                    Inside the Black Box, you will unlock proprietary study materials, advanced maneuver sequences, and career strategy documents that are typically withheld from entry-level pilots. This is the intelligence advantage you need to accelerate through your training and beyond.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsMenteeModalOpen(false)}
                                className="mt-8 py-4 bg-[#3e2b1e] text-[#e3d0a6] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-black transition-colors"
                            >
                                Return to Journey
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Junior Mentor Full Detail Modal */}
            {isJuniorModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative max-w-2xl w-full bg-[#fdfbf7] rounded-2xl overflow-hidden shadow-2xl flex flex-col border-4 border-[#3e2b1e]">
                        <button
                            onClick={() => setIsJuniorModalOpen(false)}
                            className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors border border-white/20"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        {/* Modal Image Section - Wide Landscape */}
                        <div className="w-full h-56 md:h-80 bg-black overflow-hidden">
                            <img src={images.STORY_PPL} alt="Junior Mentor Full Detail" className="w-full h-full object-cover" />
                        </div>

                        {/* Modal Content Section - Below Image */}
                        <div className="w-full p-8 flex flex-col justify-center">
                            <h2 className="text-3xl brand-font font-bold text-[#3e2b1e] uppercase tracking-wider mb-4">Junior Mentor</h2>
                            <div className="w-16 h-1 bg-[#b91c1c] mb-6"></div>

                            <div className="space-y-4 text-[#4a3b2a] font-['Playfair_Display',_serif] text-base md:text-lg leading-relaxed italic">
                                <p>
                                    "The crucible of leadership. After completing 20 hours of supervised mentorship, you shall gain the experience and valuable skills to become an official mentor."
                                </p>
                                <p>
                                    In this phase, you transition from consumer to contributor. You will work under the direct supervision of a <strong>Senior Wing Mentor</strong>, learning the surgical precision of diagnostic guidance.
                                </p>
                                <p>
                                    This 20-hour milestone is your professional checkride. You will be evaluated on your ability to simplify complex aerodynamics, manage mentee frustration, and maintain the highest ethical standards of the program. Success here earns you your first major stamp in the WingMentor Passport.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsJuniorModalOpen(false)}
                                className="mt-8 py-4 bg-[#3e2b1e] text-[#e3d0a6] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-black transition-colors"
                            >
                                Return to Journey
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Official Wingmentor Full Detail Modal */}
            {isOfficialModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative max-w-2xl w-full bg-[#fdfbf7] rounded-2xl overflow-hidden shadow-2xl flex flex-col border-4 border-[#3e2b1e]">
                        <button
                            onClick={() => setIsOfficialModalOpen(false)}
                            className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors border border-white/20"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        {/* Modal Image Section - Wide Landscape */}
                        <div className="w-full h-56 md:h-80 bg-black overflow-hidden">
                            <img src={images.STORY_CPL} alt="Official Wingmentor Full Detail" className="w-full h-full object-cover" />
                        </div>

                        {/* Modal Content Section - Below Image */}
                        <div className="w-full p-8 flex flex-col justify-center">
                            <h2 className="text-3xl brand-font font-bold text-[#3e2b1e] uppercase tracking-wider mb-4">Official Wingmentor</h2>
                            <div className="w-16 h-1 bg-[#b91c1c] mb-6"></div>

                            <div className="space-y-4 text-[#4a3b2a] font-['Playfair_Display',_serif] text-base md:text-lg leading-relaxed italic">
                                <p>
                                    "The pinnacle of the program. Official Wingmentor status is not just a title; it is a declaration of mastery and professional readiness."
                                </p>
                                <p>
                                    Upon reaching the 20-hour milestone, you transition to an Official Wingmentor. By the time you reach 50 hours, you will receive a comprehensive <strong>Program Completion Certificate</strong>.
                                </p>
                                <p>
                                    This journey transforms you into a verified asset. You gain documented proof of Crew Resource Management (CRM), complex problem-solving through consultation, and thousands of data points on student performance. You leave the program not just as a pilot, but as a leader who has actively shaped the careers of others.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsOfficialModalOpen(false)}
                                className="mt-8 py-4 bg-[#3e2b1e] text-[#e3d0a6] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-black transition-colors"
                            >
                                Return to Journey
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Guidance & Strategy Full Detail Modal */}
            {isGuidanceModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative max-w-2xl w-full bg-[#fdfbf7] rounded-2xl overflow-hidden shadow-2xl flex flex-col border-4 border-[#3e2b1e]">
                        <button
                            onClick={() => setIsGuidanceModalOpen(false)}
                            className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors border border-white/20"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        {/* Modal Image Section - Wide Landscape */}
                        <div className="w-full h-56 md:h-80 bg-black overflow-hidden">
                            <img src={images.STORY_MENTOR_1} alt="Guidance & Strategy Full Detail" className="w-full h-full object-cover" />
                        </div>

                        {/* Modal Content Section - Below Image */}
                        <div className="w-full p-8 flex flex-col justify-center">
                            <h2 className="text-3xl brand-font font-bold text-[#3e2b1e] uppercase tracking-wider mb-4">Guidance & Strategy</h2>
                            <div className="w-16 h-1 bg-[#b91c1c] mb-6"></div>

                            <div className="space-y-4 text-[#4a3b2a] font-['Playfair_Display',_serif] text-base md:text-lg leading-relaxed italic">
                                <p>
                                    "A pilot without a strategy is merely a passenger in the front seat. True command is born from anticipation, not reaction."
                                </p>
                                <p>
                                    The <strong>Guidance & Strategy</strong> pillar of our program focus on the mental architecture of flight. We don't just teach you what the books say; we teach you how to apply that knowledge under pressure. You will develop a tactical approach to mission planning, learning to identify operational threats before they manifest.
                                </p>
                                <p>
                                    By mastering these strategies, you transition from executing maneuvers to managing a complete flight environment. This sophisticated level of thinking is exactly what airline recruiters look for in potential captains.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsGuidanceModalOpen(false)}
                                className="mt-8 py-4 bg-[#3e2b1e] text-[#e3d0a6] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-black transition-colors"
                            >
                                Return to Journey
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Verifiable Experience Full Detail Modal */}
            {isVerifiableModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative max-w-2xl w-full bg-[#fdfbf7] rounded-2xl overflow-hidden shadow-2xl flex flex-col border-4 border-[#3e2b1e]">
                        <button
                            onClick={() => setIsVerifiableModalOpen(false)}
                            className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors border border-white/20"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        {/* Modal Image Section - Wide Landscape */}
                        <div className="w-full h-56 md:h-80 bg-black overflow-hidden">
                            <img src={images.STORY_MENTOR_2} alt="Verifiable Experience Full Detail" className="w-full h-full object-cover" />
                        </div>

                        {/* Modal Content Section - Below Image */}
                        <div className="w-full p-8 flex flex-col justify-center">
                            <h2 className="text-3xl brand-font font-bold text-[#3e2b1e] uppercase tracking-wider mb-4">Verifiable Experience</h2>
                            <div className="w-16 h-1 bg-[#b91c1c] mb-6"></div>

                            <div className="space-y-4 text-[#4a3b2a] font-['Playfair_Display',_serif] text-base md:text-lg leading-relaxed italic">
                                <p>
                                    "In aviation, if it isn't logged, it didn't happen. Our program transforms your support hours into the most valuable currency in the industry: proof."
                                </p>
                                <p>
                                    The <strong>Verifiable Experience</strong> module is powered by the WingLogs system. Every consultation session is digitally timestamped, geo-tagged, and verified by the mentee. This creates a forensic trail of your professional development that stands up to the closest scrutiny.
                                </p>
                                <p>
                                    Airlines no longer just look at flight hours; they look at 'Quality of Time.' By demonstrating thousands of minutes spent analyzing, correcting, and guiding others, you provide recruiters with definitive proof of your command capability and Crew Resource Management (CRM) proficiency. This is the difference between being a pilot and being an asset.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsVerifiableModalOpen(false)}
                                className="mt-8 py-4 bg-[#3e2b1e] text-[#e3d0a6] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-black transition-colors"
                            >
                                Return to Journey
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Interview Leverage Full Detail Modal */}
            {isInterviewModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative max-w-2xl w-full bg-[#fdfbf7] rounded-2xl overflow-hidden shadow-2xl flex flex-col border-4 border-[#3e2b1e]">
                        <button
                            onClick={() => setIsInterviewModalOpen(false)}
                            className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors border border-white/20"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        {/* Modal Image Section - Wide Landscape */}
                        <div className="w-full h-56 md:h-80 bg-black overflow-hidden">
                            <img src={images.STORY_MENTOR_3} alt="Interview Leverage Full Detail" className="w-full h-full object-cover" />
                        </div>

                        {/* Modal Content Section - Below Image */}
                        <div className="w-full p-8 flex flex-col justify-center">
                            <h2 className="text-3xl brand-font font-bold text-[#3e2b1e] uppercase tracking-wider mb-4">Interview Leverage</h2>
                            <div className="w-16 h-1 bg-[#b91c1c] mb-6"></div>

                            <div className="space-y-4 text-[#4a3b2a] font-['Playfair_Display',_serif] text-base md:text-lg leading-relaxed italic">
                                <p>
                                    "The competitive edge. Turn your mentorship history into your most powerful interview asset."
                                </p>
                                <p>
                                    Walking into an airline interview is often about defending your record. With Wing Mentor, you aren't just defending; you're demonstrating. You can point to verified data showing your leadership and instructional capability.
                                </p>
                                <p>
                                    When asked, 'Tell me about a time you handled a difficult colleague,' or 'How do you ensure safe operations with a junior crew member?', you have real-world, documented mentorship scenarios to draw from. This is the leverage that converts a candidate into a captain.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsInterviewModalOpen(false)}
                                className="mt-8 py-4 bg-[#3e2b1e] text-[#e3d0a6] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-black transition-colors"
                            >
                                Return to Journey
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Scrolling Story Container */}
            <div className="max-w-6xl mx-auto px-4 py-20 relative min-h-[400vh]" ref={scrollRef}>

                {/* SVG Path - The visual journey line */}
                <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                    <path
                        ref={pathRef}
                        d="M 150 50 
                       C 150 300, -100 600, 150 900 
                       C 400 1200, 400 1500, 150 1800 
                       C -100 2100, -100 2400, 150 2700 
                       C 400 3000, 400 3300, 150 3600"
                        fill="none"
                        stroke="#8b4513"
                        strokeWidth="4"
                        strokeDasharray="15, 15"
                        className="opacity-50"
                    />
                </svg>

                {/* The Moving Plane Icon */}
                <div
                    className="absolute z-50 w-16 h-16 transition-transform duration-100 ease-linear pointer-events-none drop-shadow-2xl"
                    style={{
                        left: '50%', // Center the reference point
                        transform: `translate(${storyState.planeX - 180}px, ${storyState.planeY - 30}px) rotate(${storyState.planeAngle}deg)`, // Adjust for SVG coordinates relative to center
                        // Note: The SVG path is drawn relative to a coordinate system. 
                        // Since the SVG is centered with left-1/2 -translate-x-1/2, 
                        // 150 is the center x-coordinate in the path definition "M 150 50".
                        // But "left: 50%" puts 0 at the center. 
                        // So we needed to offset planeX by the starting X of the path (approx 150) plus/minus some to align perfectly.
                        // Trial & Error optimization: planeX is roughly 150 at start. We want start to be center.
                        // If planeX=150 is center, then translateX should be 0. So -150.
                        // Refined adjustment: -180 seems to center it visually on the dotted line.
                    }}
                >
                    <img
                        src={PLANE_ICON}
                        alt="Plane"
                        className="w-full h-full object-contain"
                        style={{ transform: 'rotate(90deg)' }} // Rotate image if source points up
                    />
                </div>

                {/* STAGE 1: THE STARTER MENTEE (Top Center) */}
                <div ref={starterMenteeRef} className="absolute top-[50px] left-1/2 -translate-x-1/2 w-80 md:w-96 text-center z-20">
                    <div
                        className="group relative cursor-pointer transform hover:scale-105 transition-all duration-300"
                        onClick={() => setIsMenteeModalOpen(true)}
                    >
                        <div className="w-40 h-40 mx-auto rounded-full border-4 border-[#8b4513] overflow-hidden shadow-2xl relative z-10 bg-[#fdfbf7]">
                            <img src={images.STORY_STUDENT} alt="Starter Mentee" className="w-full h-full object-cover" />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-[#e3d0a6] font-bold uppercase tracking-widest text-sm mb-1">View</span>
                                <span className="text-white font-serif italic text-xs">The Beginning</span>
                            </div>
                        </div>

                        <div className="mt-6 bg-[#fdfbf7] p-6 rounded-lg shadow-xl border-t-4 border-[#b91c1c] relative z-10">
                            <h3 className="text-2xl brand-font font-bold text-[#3e2b1e] uppercase mb-2">Starter Mentee</h3>
                            <p className="font-['Playfair_Display',_serif] italic text-[#4a3b2a]">
                                "The journey begins with a choice: to be passive, or to be prepared."
                            </p>
                        </div>
                    </div>
                </div>

                {/* STAGE 2: JUNIOR MENTOR (Left Side) */}
                <div className="absolute top-[900px] left-[5%] md:left-[10%] w-80 md:w-96 text-center z-20">
                    <div
                        className="group relative cursor-pointer transform hover:scale-105 transition-all duration-300"
                        onClick={() => setIsJuniorModalOpen(true)}
                    >
                        <div className="w-40 h-40 mx-auto rounded-full border-4 border-[#8b4513] overflow-hidden shadow-2xl relative z-10 bg-[#fdfbf7]">
                            <img src={images.STORY_PPL} alt="Junior Mentor" className="w-full h-full object-cover" />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-[#e3d0a6] font-bold uppercase tracking-widest text-sm mb-1">View</span>
                                <span className="text-white font-serif italic text-xs">First Command</span>
                            </div>
                        </div>

                        <div className="mt-6 bg-[#fdfbf7] p-6 rounded-lg shadow-xl border-t-4 border-[#b91c1c] relative z-10">
                            <h3 className="text-2xl brand-font font-bold text-[#3e2b1e] uppercase mb-2">Junior Mentor</h3>
                            <div className="flex justify-center items-center space-x-2 text-[#b91c1c] font-bold mb-2">
                                <i className="fas fa-star"></i>
                                <span>20 HRS</span>
                                <i className="fas fa-star"></i>
                            </div>
                            <p className="font-['Playfair_Display',_serif] italic text-[#4a3b2a]">
                                "Leadership is not granted; it is learned. You now guide others through the turbulence you once navigated."
                            </p>
                        </div>
                    </div>
                </div>

                {/* STAGE 3: OFFICIAL WINGMENTOR (Right Side) */}
                <div className="absolute top-[1800px] right-[5%] md:right-[10%] w-80 md:w-96 text-center z-20">
                    <div
                        className="group relative cursor-pointer transform hover:scale-105 transition-all duration-300"
                        onClick={() => setIsOfficialModalOpen(true)}
                    >
                        <div className="w-40 h-40 mx-auto rounded-full border-4 border-[#8b4513] overflow-hidden shadow-2xl relative z-10 bg-[#fdfbf7]">
                            <img src={images.STORY_CPL} alt="Official Wingmentor" className="w-full h-full object-cover" />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-[#e3d0a6] font-bold uppercase tracking-widest text-sm mb-1">View</span>
                                <span className="text-white font-serif italic text-xs">Mastery</span>
                            </div>
                        </div>

                        <div className="mt-6 bg-[#fdfbf7] p-6 rounded-lg shadow-xl border-t-4 border-[#b91c1c] relative z-10">
                            <h3 className="text-2xl brand-font font-bold text-[#3e2b1e] uppercase mb-2">Official Wingmentor</h3>
                            <div className="flex justify-center items-center space-x-2 text-[#b91c1c] font-bold mb-2">
                                <i className="fas fa-crown"></i>
                                <span>50 HRS</span>
                                <i className="fas fa-crown"></i>
                            </div>
                            <p className="font-['Playfair_Display',_serif] italic text-[#4a3b2a]">
                                "A verified expert. You have the hours, the experience, and the certificate to prove you are an asset to any flight deck."
                            </p>
                        </div>
                    </div>
                </div>

                {/* STAGE 4: THREE PILLARS OF MASTERY (Bottom Center Cluster) */}
                <div className="absolute top-[2700px] left-0 right-0 px-4">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Pillar 1: Guidance */}
                        <div
                            className="bg-[#fdfbf7] p-6 rounded-lg shadow-xl border-t-4 border-[#b91c1c] cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 group"
                            onClick={() => setIsGuidanceModalOpen(true)}
                        >
                            <div className="h-40 overflow-hidden rounded-md mb-4 relative">
                                <img src={images.STORY_MENTOR_1} alt="Guidance" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-bold uppercase tracking-wider text-xs border border-white px-3 py-1">Expand</span>
                                </div>
                            </div>
                            <h4 className="text-xl brand-font font-bold text-[#3e2b1e] uppercase mb-2">Guidance & Strategy</h4>
                            <p className="text-sm font-['Playfair_Display',_serif] italic text-[#4a3b2a]">
                                "Tactical planning and decision making."
                            </p>
                        </div>

                        {/* Pillar 2: Verifiable Experience */}
                        <div
                            className="bg-[#fdfbf7] p-6 rounded-lg shadow-xl border-t-4 border-[#b91c1c] cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 group"
                            onClick={() => setIsVerifiableModalOpen(true)}
                        >
                            <div className="h-40 overflow-hidden rounded-md mb-4 relative">
                                <img src={images.STORY_MENTOR_2} alt="Verifiable" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-bold uppercase tracking-wider text-xs border border-white px-3 py-1">Expand</span>
                                </div>
                            </div>
                            <h4 className="text-xl brand-font font-bold text-[#3e2b1e] uppercase mb-2">Verifiable Experience</h4>
                            <p className="text-sm font-['Playfair_Display',_serif] italic text-[#4a3b2a]">
                                "Forensic proof of your mentorship hours."
                            </p>
                        </div>

                        {/* Pillar 3: Interview Leverage */}
                        <div
                            className="bg-[#fdfbf7] p-6 rounded-lg shadow-xl border-t-4 border-[#b91c1c] cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 group"
                            onClick={() => setIsInterviewModalOpen(true)}
                        >
                            <div className="h-40 overflow-hidden rounded-md mb-4 relative">
                                <img src={images.STORY_MENTOR_3} alt="Interview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-bold uppercase tracking-wider text-xs border border-white px-3 py-1">Expand</span>
                                </div>
                            </div>
                            <h4 className="text-xl brand-font font-bold text-[#3e2b1e] uppercase mb-2">Interview Leverage</h4>
                            <p className="text-sm font-['Playfair_Display',_serif] italic text-[#4a3b2a]">
                                "The competitive edge for airline screening."
                            </p>
                        </div>

                    </div>
                </div>

                {/* FINAL DESTINATION (Bottom) */}
                <div className="absolute top-[3400px] left-1/2 -translate-x-1/2 text-center w-full max-w-2xl px-4 pb-20">
                    <h2 className="text-4xl md:text-5xl brand-font font-bold text-[#3e2b1e] uppercase mb-6 drop-shadow-sm">
                        Ready to Command?
                    </h2>
                    <p className="text-xl md:text-2xl font-['Playfair_Display',_serif] italic text-[#4a3b2a] mb-8">
                        "The cockpit is waiting. Your journey from student to mentor to captain starts here."
                    </p>
                    <button
                        onClick={() => {
                            const applicationSection = document.getElementById('application');
                            if (applicationSection) {
                                applicationSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className="px-10 py-5 bg-[#b91c1c] text-white font-bold text-xl uppercase tracking-[0.2em] rounded shadow-2xl hover:bg-red-800 transition-colors animate-pulse"
                    >
                        Apply Now
                    </button>
                </div>

            </div>

        </div>
    );
};
