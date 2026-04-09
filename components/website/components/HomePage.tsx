
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Globe, User, CheckCircle2 } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from './RevealOnScroll';
import { ImmersiveVideoHero } from './ImmersiveVideoHero';
import { AirlineExpectationsCarousel } from './AirlineExpectationsCarousel';
import { PilotJourneyScroll } from './PilotJourneyScroll';
import { IMAGES } from '../../../src/lib/website-constants';

interface HomePageProps {
    onJoinUs: () => void;
    onLogin: () => void;
    onNavigate: (page: string) => void;
    onGoToProgramDetail: (slide?: Slide) => void;
}

interface Slide {
    image: string;
    title: string;
    subtitle: string;
    category: 'program' | 'systems_automation' | 'network' | 'application' | 'pathways';
    regions?: { name: string; flag?: string }[];
    isDarkCard?: boolean;
    titleColor?: string;
    subtitleColor?: string;
    description?: string;
}

const navItems = [
    { name: 'Home', target: 'home' },
    { name: 'About', target: 'about' },
    { name: 'Pathways', target: 'about_programs' },
    { name: 'Accreditation', target: 'accreditation' },
    { name: 'Contact', target: 'dashboard' },
];

export const HomePage: React.FC<HomePageProps> = ({ onJoinUs, onLogin, onNavigate, onGoToProgramDetail }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [activeCategory, setActiveCategory] = useState<
        'all' | 'program' | 'systems_automation' | 'network' | 'application' | 'pathways'
    >('all');
    const [currentFaq, setCurrentFaq] = useState(0);

    const faqItems = [
        {
            question: "What is the Pilot Gap?",
            answer: "It's the critical experience void between basic commercial licensing and the elite standards required by major airlines. We bridge this through verified operational experience and industry-standard EBT/CBTA training modules."
        },
        {
            question: "How does membership work?",
            answer: "Membership is free and provides restricted community access to our strategic intelligence hub, expert mentorship, and professional-grade applications usually reserved for airline flight decks."
        },
        {
            question: "Is WingMentor accredited?",
            answer: "Yes. Our pathways are supported by key industry players including Airbus partners, and our documentation mirrors the regulatory requirements of governing bodies like the FAA, CAAP, and GCAA."
        },
        {
            question: "What are the career pathways?",
            answer: "We offer direct routes into major airlines, private sector operators, and emerging aviation segments like the Air Taxi sector (AAM), ensuring your hours are recognized by top recruiters."
        }
    ];

    const nextFaq = () => setCurrentFaq((prev) => (prev + 1) % faqItems.length);
    const prevFaq = () => setCurrentFaq((prev) => (prev - 1 + faqItems.length) % faqItems.length);

    const allSlides: Slide[] = [
        {
            image: "https://lh3.googleusercontent.com/d/1wPEIiMRj4fW34_NIQKRnzCf8KNhdD1TC",
            title: "Transition Program",
            category: 'program',
            subtitle: "Shifting students and graduates from flight school to an airline environment mindset through EBT & CBT familiarization.",
            description: "A structured bridge from fresh graduate to airline‑industry‑ready pilot. The Transition Program walks you through all nine EBT/CBTA core competencies using industry‑standard tools such as Airbus‑recommended HINFACT, aligns you with real airline expectations, and gives type‑rating insight before you commit tens of thousands to training. Combined with our Emirates‑standard GCAA ATPL theoretical pathway and accreditation partners, you gain a decisive advantage when presenting yourself to cadet programs, ATOs, and early first‑officer opportunities.",
            isDarkCard: true
        },
        {
            image: "https://images.unsplash.com/photo-1520437358207-323b43b50729?q=80&w=2940&auto-format&fit=crop",
            title: "EBT CBTA familiarization",
            category: 'program',
            subtitle: "airline expectations",
            description: "Master the core competencies of Evidence-Based Training (EBT) and Competency-Based Training & Assessment (CBTA). Our program integrates industry-leading software solutions, including Airbus-recommended HINFACT, to simulate real-world airline evaluation environments.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/1K2CccSObEUsvy6unD8iqWjSjn-Zcw08g",
            title: "Foundational Program",
            subtitle: "Leadership skills, verifiable experience, and industry-recognized accreditation supported by AIRBUS, Etihad & Archer.",
            category: 'program',
            description: "Designed for recent graduates and ongoing pilots seeking a competitive edge. Our verified leadership and mentorship training prepares you to be Flight Instructor and mentor ready. Gain credibility, verifiable experience, and critical insights into the Transition Program, ensuring you are fully prepared for the next stage of your professional aviation career.",
            regions: [
                { name: "UAE", flag: "🇦🇪" },
                { name: "UK", flag: "🇬🇧" },
                { name: "Philippines", flag: "🇵🇭" },
                { name: "Mauritius", flag: "🇲🇺" },
                { name: "Germany", flag: "🇩🇪" }
            ],
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/1Ars9ou0JcoloGv-W18gvJ1G0eWrdFNAu",
            title: "Emirates ATPL Pilot Pathways",
            subtitle: "For pilots seeking an Emirates‑standard ATPL and GCAA license.",
            category: 'pathways',
            description:
                "Wing Mentor provides a structured Emirates ATPL Pathway through partner schools such as Fujairah Aviation, combining full ATPL training with license conversion inside the UAE. Pilots currently under the FAA system are guided through a smooth transition into EASA standards while completing their ATPL. The overall investment is comparable to many flight instructor ratings, while earning a respected GCAA license aligned with Emirates‑standard expectations—positioning you as a globally recognizable candidate whether you plan to fly in Dubai, the Philippines, or other international markets.",
            regions: [
                { name: "UAE", flag: "🇦🇪" },
                { name: "UK", flag: "🇬🇧" },
                { name: "Mauritius", flag: "🇲🇺" },
                { name: "Philippines", flag: "🇵🇭" },
                { name: "Germany", flag: "🇩🇪" }
            ],
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/1XcRDW3p9C965siBjl5HsTXDHaQZJ-Ona",
            title: "Emerging Air Taxi Sector",
            subtitle: "For pilots under 1,000 hours stuck in the gap.",
            category: 'pathways',
            description:
                "WingMentor offers direct pilot pathways into the emerging air taxi sector, including leading industry players such as Archer and Joby—who have openly highlighted the need for pilots within this gap, typically under 1,000 hours. We also open routes into unmanned drone operations that are pilot-controlled from the ground. Through our network you gain strategic insight, connections, and a clear roadmap for how your current skills translate into this new segment.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/1aTWWTtFwIMCrrU9HnCtWdUPTGhvWk6Yi",
            title: "Air Taxi Pilot Pathways",
            subtitle: "From CPL/IR to eVTOL flight deck.",
            category: 'pathways',
            description:
                "A structured pathway for pilots aiming at eVTOL and air taxi roles. Understand licensing considerations, multi‑crew expectations, and how to present your experience to early‑stage operators building their first pilot rosters.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/18tXsX2e_uYI5i8EBJEgZYhAUhVhDkOGn",
            title: "Private Charter Pathways",
            subtitle: "Corporate and VIP flight departments.",
            category: 'pathways',
            description:
                "Guidance for pilots targeting private charter and corporate aviation. We unpack what owners, brokers, and chief pilots look for beyond raw hours—discretion, consistency, and the service mindset that defines successful charter crews.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/11rzk2pXR99JuKEjhanfvAn58cgVETtId",
            title: "Unmanned Drones Pathways",
            subtitle: "From manned cockpit to remote operations.",
            category: 'pathways',
            description:
                "For pilots interested in RPAS and unmanned operations, this pathway explains certifications, operational roles, and how traditional flying experience translates into high‑value skills for drone operators and data‑driven missions.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/1RuXrqruV5eSKoL1lasEVpML__Pcqfjmi",
            title: "Airline Expectations",
            category: 'network',
            subtitle: "Strategic Investment Guidance",
            description: "A specialized data bank of airline-specific expectations and information, providing critical value for pilots prior to investing in expensive type ratings.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/1F9fPZsg-cn8bGyJkhUmGm0lRt9JL0oha",
            title: "Private Sector Insight",
            category: 'network',
            subtitle: "Executive Intelligence & Corporate Trends",
            description: "Exclusive access to private sector requirements, corporate aviation trends, and non-scheduled operator insights typically unavailable to the general public.",
            isDarkCard: true
        },
        {
            image: "/images/atlas_wallpaper_regular.png",
            title: "ATLAS Aviation CV",
            category: 'systems_automation',
            subtitle: "Globally Recognized AI-Optimized Format",
            description: "The new standard Resume recognized through automated platforms. ATLAS is a 'machine-language' version of a pilot's career, optimized for AI-powered parsers used by major airlines like Etihad and Cebu Pacific.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/1Ars9ou0JcoloGv-W18gvJ1G0eWrdFNAu",
            title: "Pilot Database Recognition System",
            category: 'systems_automation',
            subtitle: "Verifiable Excellence & Industry Standards",
            description: "A comprehensive database tracking pilot milestones, recognition, and professional development pathways recognized by global aviation authorities.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/1jL8lgdJZgdMrzUJkhvDOrlb1S8s7dEb4",
            title: "What is the Pilot Gap?",
            category: 'network',
            subtitle: "Unifying the voices of experienced aviators and all professional pilots to navigate the critical transition between flight training and the airline flight deck.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/11JxfuQ_5Tu3GZP4wab734qPnd1sDxCnv",
            title: "Examination Terminal",
            category: 'application',
            subtitle: "Pilot Applications — Access our suite of professional aviation applications, including standardized examination environments and operational tools.",
            isDarkCard: true,
            titleColor: "text-yellow-500"
        },
        {
            image: "https://lh3.googleusercontent.com/d/1klsusO1TwuXnDWrke-HzadozUrF9ri4u",
            title: "WingMentor W1000",
            category: 'application',
            subtitle: "The Professional Standard in glass cockpit familiarity.",
            description: "An application software inspired by the G1000 with our modern systems and simulators perfect suite for pilots to refresh on areas such as IFR, CPL examinations, and integrated Gleims examination software.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/1rZLzWxCpouDAIoNRFxeli5GDa3lhGyr2",
            title: "Pilot Gap Forum",
            category: 'network',
            subtitle: "Bridging the Experience Gap",
            subtitleColor: "text-red-600 font-bold",
            description: "A secure intelligence hub for unfiltered career strategy discussions, industry gap analysis, and professional networking.",
            isDarkCard: true
        }
    ];

    const filteredSlides = allSlides.filter(slide => {
        if (activeCategory === 'all') {
            const excludedFromAll = ["Examination Terminal", "Pilot Gap Forum", "WingMentor W1000"];
            return !excludedFromAll.includes(slide.title);
        }
        if (activeCategory === 'pathways') {
            // Keep Emerging Air Taxi Sector only in the All view, not in the dedicated Pathways filter
            return slide.category === 'pathways' && slide.title !== "Emerging Air Taxi Sector";
        }
        return slide.category === activeCategory;
    });

    const slides = filteredSlides;

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Ensure currentSlide is always in range when category changes
    useEffect(() => {
        if (currentSlide >= slides.length) {
            setCurrentSlide(0);
        }
    }, [slides.length, currentSlide]);

    // Auto-advance carousel
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(nextSlide, 8000);
        return () => clearInterval(timer);
    }, [slides.length, activeCategory]); // Reset timer when content changes


    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollToCarousel = () => {
        carouselRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative min-h-screen font-sans bg-black overflow-x-hidden">
            {/* Navigation Bar */}
            <TopNavbar
                onNavigate={onNavigate}
                onLogin={onLogin}
                isDark={true}
            />

            {/* Immersive Video Hero - Above Carousel */}
            <ImmersiveVideoHero onScrollToCarousel={scrollToCarousel} />

            {/* Airline Expectations 3D Carousel */}
            <AirlineExpectationsCarousel />

            {/* Hero Section - Carousel */}
            <div ref={carouselRef} className="relative h-screen w-full flex items-center pt-20 overflow-hidden">
                {/* Background Images Layer */}
                {slides.map((slide, index) => (
                    <div
                        key={`${index}-${slide.title}`}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out z-0 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Vertical Gradient Scrim - Left Third */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.isDarkCard ? 'from-black/80 via-black/40' : 'from-[#050A30]/80 via-[#050A30]/40'} to-transparent z-10 transition-colors duration-1000`}></div>
                        <div className="absolute inset-0 bg-black/40 via-transparent to-black/20 z-0"></div>
                    </div>
                ))}

                <div className="max-w-7xl mx-auto px-6 w-full relative z-40 text-left">
                    <div className="space-y-8 max-w-3xl">
                        <h1
                            key={currentSlide}
                            className={`text-5xl md:text-9xl font-serif leading-none tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 ${slides[currentSlide]?.titleColor || 'text-white'}`}
                        >
                            {slides[currentSlide]?.title.split(' ').map((word, i) => (
                                <span key={i}>
                                    {word === 'Gap' ? (
                                        <span className="text-red-700">{word}</span>
                                    ) : (
                                        word
                                    )}
                                    {i < (slides[currentSlide]?.title.split(' ').length || 0) - 1 && ' '}
                                </span>
                            ))}
                        </h1>
                        <p
                            key={`subtitle-${currentSlide}`}
                            className={`text-lg md:text-xl font-light leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 ${slides[currentSlide]?.subtitleColor || 'text-white'}`}
                        >
                            {slides[currentSlide]?.subtitle}
                        </p>
                        {slides[currentSlide]?.description && (
                            <p
                                key={`description-${currentSlide}`}
                                className="text-sm md:text-base text-white/80 font-light leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300"
                            >
                                {slides[currentSlide].description}
                            </p>
                        )}

                        {slides[currentSlide]?.regions && (
                            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
                                <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase">Regions Available</p>
                                <div className="flex gap-4">
                                    {slides[currentSlide].regions?.map((region, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm backdrop-blur-md group/flag hover:bg-white/10 transition-colors"
                                            aria-label={region.name}
                                        >
                                            <span className="text-lg md:text-xl">
                                                {region.flag || region.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="pt-4 flex justify-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
                            <button
                                onClick={() => onGoToProgramDetail(slides[currentSlide])}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-sm text-sm font-bold uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 border border-white/10 min-w-[200px]"
                            >
                                LEARN MORE
                            </button>
                            <button
                                onClick={onLogin}
                                className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-sm text-sm font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-sm min-w-[180px]"
                            >
                                MEMBER LOGIN
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <div className="absolute top-1/2 left-6 -translate-y-1/2 z-30">
                    <button
                        onClick={prevSlide}
                        className="text-white/40 hover:text-white transition-all hover:scale-110 p-4"
                    >
                        <ChevronLeft className="w-12 h-12 stroke-[1px]" />
                    </button>
                </div>
                <div className="absolute top-1/2 right-6 -translate-y-1/2 z-30">
                    <button
                        onClick={nextSlide}
                        className="text-white/40 hover:text-white transition-all hover:scale-110 p-4"
                    >
                        <ChevronRight className="w-12 h-12 stroke-[1px]" />
                    </button>
                </div>
                {/* Indicator Dots */}
                {slides.length > 1 && (
                    <div className="absolute bottom-24 right-8 z-40 flex gap-2 items-center">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`group relative py-2 transition-all duration-300 ${index === currentSlide ? 'px-1' : 'px-0'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                <div className={`h-1 rounded-full transition-all duration-500 ease-out ${index === currentSlide
                                    ? 'w-8 bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]'
                                    : 'w-2 bg-white/20 group-hover:bg-white/40'
                                    }`} />
                            </button>
                        ))}
                    </div>
                )}

                {/* Glassy Category Filters */}
                <div className="absolute bottom-8 right-8 z-50">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl py-2 px-6 shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-center gap-8">
                        {/* Interest of Pilots Group */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[7px] font-bold tracking-[0.2em] uppercase text-white/50">Interest of Pilots</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => { setActiveCategory('all'); setCurrentSlide(0); }}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${activeCategory === 'all' ? 'text-white scale-110 drop-shadow-md' : 'text-white/60 hover:text-white/90'}`}
                                >
                                    All
                                </button>
                                <div className="w-[1px] h-3 bg-white/20"></div>
                                <button
                                    onClick={() => { setActiveCategory('program'); setCurrentSlide(0); }}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${activeCategory === 'program' ? 'text-white scale-110 drop-shadow-md' : 'text-white/60 hover:text-white/90'}`}
                                >
                                    Programs
                                </button>
                                <div className="w-[1px] h-3 bg-white/20"></div>
                                <button
                                    onClick={() => { setActiveCategory('pathways'); setCurrentSlide(0); }}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${activeCategory === 'pathways' ? 'text-white scale-110 drop-shadow-md' : 'text-white/60 hover:text-white/90'}`}
                                >
                                    Pathways
                                </button>
                                <div className="w-[1px] h-3 bg-white/20"></div>
                                <button
                                    onClick={() => { setActiveCategory('application'); setCurrentSlide(0); }}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${activeCategory === 'application' ? 'text-white scale-110 drop-shadow-md' : 'text-white/60 hover:text-white/90'}`}
                                >
                                    Applications
                                </button>
                                <div className="w-[1px] h-3 bg-white/20"></div>
                                <button
                                    onClick={() => { setActiveCategory('network'); setCurrentSlide(0); }}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${activeCategory === 'network' ? 'text-white scale-110 drop-shadow-md' : 'text-white/60 hover:text-white/90'}`}
                                >
                                    Networking
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-[1px] h-8 bg-white/20"></div>
                        <div className="md:hidden w-full h-[1px] bg-white/20"></div>

                        {/* Aviation Industry Interest Group */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[7px] font-bold tracking-[0.2em] uppercase text-white/50">Aviation Industry Interest</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => { setActiveCategory('systems_automation'); setCurrentSlide(0); }}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${activeCategory === 'systems_automation' ? 'text-white scale-110 drop-shadow-md' : 'text-white/60 hover:text-white/90'}`}
                                >
                                    Systems & Automation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Gradient Fade Overlay - Adjusted for White Transition */}
                <div className={`absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t pointer-events-none z-20 transition-colors duration-1000 ${slides[currentSlide]?.isDarkCard ? 'from-black/80 via-black/40' : 'from-[#050A30]/80 via-[#050A30]/40'} to-transparent`}></div>

                {/* Additional White Fade for Smooth Transition to Next Section */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/40 to-transparent z-30 pointer-events-none"></div>
            </div>

            {/* Pilot Journey Scroll Animation - Between Video and Content */}
            <PilotJourneyScroll onNavigate={onNavigate} />

            {/* Main Content Area (Separated from Hero for Scrolling) */}
            <div className="relative bg-white">


                {/* About Us section - Restored */}
                <div className="relative bg-white pt-24 pb-12 px-6">
                    <div className="max-w-6xl mx-auto text-center relative z-20">
                        <RevealOnScroll delay={100}>
                            <img
                                src={IMAGES.LOGO}
                                alt="WingMentor Logo"
                                className="mx-auto w-48 h-auto object-contain mb-8 opacity-90"
                            />
                            <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-blue-700 mb-4">
                                ABOUT US
                            </p>
                            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
                                Pilot Recognition Programs & <br />WingMentor Pathways
                            </h2>
                            <p className="text-xl font-medium tracking-wide text-slate-700 italic mb-10">
                                Bridging the Gap Between License and Career
                            </p>

                            <div className="max-w-4xl mx-auto space-y-8 mb-12">
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
                                    WingMentor is the aviation industry's first Competency Assurance Network, designed to solve the critical "experience gap" in the modern pilot market. We are connecting all pilots, whether you are a low-timer pilot looking for pathways, a seasoned instructor looking for evolution in their current career, or a time-constrained airline captain looking for opportunities. We are speaking in direct relation with various Airlines, manufacturers, emerging air taxis, and many more. Making the connection between pilot & Industry Expectations, demands & Pilot Recognition easier like never before.
                                </p>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
                                    Through our proprietary Verified Pilot Database and ATLAS-compliant profiling, we transform raw flight hours into data-driven professional competencies recognized by manufacturers and recruiters. By facilitating direct access to industry veterans and "hidden" job markets, WingMentor ensures that pilots don't just graduate—they transition seamlessly into the cockpit with the insights, network, and credibility the industry demands.
                                </p>
                            </div>

                            <button
                                onClick={() => onNavigate('accreditation')}
                                className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-700 hover:text-blue-900 transition-colors flex items-center justify-center gap-2 mx-auto group"
                            >
                                LEARN MORE ABOUT OUR ACCREDITATIONS AND SUPPORT PROVIDED <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </RevealOnScroll>
                    </div>
                </div>

                {/* Accreditation and Recognition Logos - Marquee (Full Width) */}
                <div className="relative w-full overflow-hidden bg-white pb-10">
                    <div className="relative w-full pt-8">
                        <div className="text-center relative z-10 mb-6">
                            <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-blue-700 mb-2">
                                RECOGNITION | ASSURANCE | SUPPORT
                            </p>
                            <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
                                Strategic presence at the Etihad Museum UAE Career Fair, represented by leading aviation governing bodies.
                            </p>
                        </div>

                        <div className="relative py-6 z-10 flex overflow-hidden group">
                            {/* Gradient Masks for Fade/Glass Effect */}
                            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-20"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-20"></div>

                            <div className="flex gap-16 animate-marquee whitespace-nowrap min-w-full pl-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex gap-16 items-center shrink-0">
                                        <img src={IMAGES.ACCREDITATION_1} alt="FAA" className="h-14 w-auto object-contain" />
                                        <img src={IMAGES.ACCREDITATION_3} alt="GCAA" className="h-14 w-auto object-contain" />
                                        <img src={IMAGES.ACCREDITATION_4} alt="Airbus" className="h-16 w-auto object-contain" />
                                        <img src={IMAGES.ACCREDITATION_5} alt="WM Group" className="h-16 w-auto object-contain" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Membership Benefits Section - matching AboutPage style */}
                <div id="membership" className="relative bg-white pt-12 pb-0 px-6 overflow-hidden">
                    <div className="max-w-6xl mx-auto text-center relative z-20 mb-12">
                        <RevealOnScroll delay={100}>
                            <img
                                src={IMAGES.LOGO}
                                alt="WingMentor Logo"
                                className="mx-auto w-64 h-auto object-contain mb-2"
                            />
                            <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                                Programs | Applications & Systems | Pathways
                            </p>
                            <h2 className="text-3xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                                Membership Benefits & <br />Program Awards
                            </h2>
                            <img
                                src="https://lh3.googleusercontent.com/d/112h6L1fuk_wR5HVZEtiDJY7Xz02KyEbx"
                                alt="WingMentor Asset"
                                className="mx-auto w-64 md:w-[500px] h-auto object-contain mb-4 rounded-2xl shadow-xl"
                            />
                            <p className="text-[10px] text-slate-500 mb-8 italic max-w-md mx-auto">
                                Awarded certificates are given once completion of Wingmentor Foundation & Transition Program
                            </p>
                            <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                                Whether you are a student pilot starting your journey or a seasoned instructor seeking evolution,
                                the WingMentor network provides the strategic intelligence and verified pathways to advance your professional status.
                            </p>
                        </RevealOnScroll>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10 pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch min-h-[350px]">
                            {[
                                {
                                    corePoint: "Recognition",
                                    title: "ATLAS profile & Pilot Database",
                                    description: "Forget standard resumes. Build an ATLAS-compliant CV optimized for airline AI scanners. Your performance data is hosted in our Verified Pilot Database, allowing partner airlines and manufacturers to \"scout\" your specific competencies before you even apply.",
                                    image: "https://lh3.googleusercontent.com/d/1waom5qY_plA5lA_gWvhlQOx0A8_YcPpg",
                                    delay: 200
                                },
                                {
                                    corePoint: "Communication",
                                    title: "Multi-Sector Networking",
                                    description: "Break the \"experience barrier.\" Gain direct communication lines to veteran mentors and scarce insights into the Private Jet (VIP) and Air Taxi (eVTOL) sectors. Connect with the peers and pros who actually control the \"Hidden Job Market.\"",
                                    image: "https://lh3.googleusercontent.com/d/16bw28MVKysFEjz5g1W4LDNX7deBSDf1e",
                                    delay: 300
                                },
                                {
                                    corePoint: "Verification",
                                    title: "The \"New Standard\" Logging",
                                    description: "Be part of the industry's solution to the pilot gap. Access our 20/30 Mentorship Programs to log Verifiable Leadership Hours. We turn your \"soft skills\" into hard data that proves you are ready for the airline environment.",
                                    image: "https://lh3.googleusercontent.com/d/1S1tI2SooE-tOLBAulyVtcnlrtiK5fw0X",
                                    delay: 400
                                },
                                {
                                    corePoint: "Insider Knowledge",
                                    title: "Investment Intelligence",
                                    description: "Don't fly blind. Understand Airline & Manufacturer expectations (EBT/CBTA) before you invest $30k in a Type Rating. We provide the recommendations and \"reality checks\" you need to ensure your next step is a hired step.",
                                    image: "https://lh3.googleusercontent.com/d/1USf_f9ZXG1Aflandx6_EMwR1JMhNBi8l",
                                    delay: 500
                                }
                            ].map((benefit, index) => (
                                <RevealOnScroll key={index} delay={benefit.delay} className="h-full">
                                    <div className="flex flex-col h-full group">
                                        {/* Core Point Label */}
                                        <div className="text-center mb-8">
                                            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-600 group-hover:text-blue-800 transition-colors">
                                                {benefit.corePoint}
                                            </span>
                                        </div>

                                        {/* The Epaulet Bar */}
                                        <div
                                            className="flex-1 px-4 py-4 bg-white border-x-2 border-t-2 border-slate-100 rounded-t-sm flex flex-col items-center text-center transition-all duration-700 hover:border-slate-200 shadow-2xl relative overflow-hidden group/bar"
                                        >
                                            {/* Image Background */}
                                            <div className="absolute inset-0 z-0">
                                                <img
                                                    src={benefit.image}
                                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 group-hover:scale-110"
                                                    alt=""
                                                />
                                                {/* Very Light Neutral White Overlay for high image visibility */}
                                                <div
                                                    className="absolute inset-0"
                                                    style={{
                                                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 40%, rgba(5, 10, 48, 0.9) 90%, #050A30 100%)'
                                                    }}
                                                ></div>
                                            </div>

                                            <div className="relative z-10 flex flex-col items-center h-full">

                                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors leading-tight min-h-[3rem] flex items-center">
                                                    {benefit.title}
                                                </h3>
                                                <p className="text-slate-700 leading-relaxed text-sm font-semibold px-4">
                                                    {benefit.description}
                                                </p>

                                                <div className="mt-auto pt-4">
                                                    <div className="w-px h-16 bg-gradient-to-b from-slate-900/10 to-transparent mx-auto"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </RevealOnScroll>
                            ))}
                        </div>
                    </div>
                </div>


                {/* Join The Network Section (High-Fidelity Redesign) */}
                <div className="relative py-16 md:py-32 px-4 md:px-6 overflow-hidden">
                    {/* High-Fidelity Background: Modern Flight Deck */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1483450389192-3d3a08d2ae46?q=80&w=2669&auto=format&fit=crop"
                            alt="Modern Flight Deck"
                            className="w-full h-full object-cover"
                        />
                        {/* Dark Overlay with Blur */}
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#050A30] via-transparent to-[#050A30]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-24">
                            <RevealOnScroll delay={100}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-400/20 mb-8 backdrop-blur-md">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-300">Global Enrollment Open</span>
                                </div>
                                <h1 className="text-5xl md:text-8xl font-serif text-white leading-tight mb-8 tracking-tighter">
                                    Become a Member
                                </h1>
                                <p className="text-xl text-blue-100/70 max-w-3xl mx-auto leading-relaxed font-light italic">
                                    "From verified logbook audits to global airline visibility, start your journey into legalized pilot recognition."
                                </p>
                            </RevealOnScroll>
                        </div>

                        <div className="max-w-6xl mx-auto">
                            <RevealOnScroll delay={200}>
                                <div className="relative group p-[1px] bg-gradient-to-b from-slate-200 to-transparent rounded-[3rem]">
                                    <div className="absolute inset-0 bg-white/40 rounded-[3rem] blur-3xl transition-all duration-500 group-hover:bg-blue-100/20"></div>
                                    <div className="relative bg-white border border-slate-100 rounded-[3rem] p-12 md:py-20 md:px-24 flex flex-col items-center text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">

                                        <img
                                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                            alt="WingMentor Logo"
                                            className="w-72 h-auto object-contain mb-8 opacity-90"
                                        />

                                        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-2">
                                            Pilot Database Recognition & Network Access
                                        </p>
                                        <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-12 leading-tight">
                                            Become A Member To Access
                                        </h2>

                                        <div className="w-full mt-4 border-t border-slate-100">
                                            {/* Program Comparison Table */}
                                            <div className="hidden md:flex items-center py-4 px-6 border-b border-slate-100 bg-slate-50/50">
                                                <div className="w-1/3 text-[10px] font-bold text-blue-700 uppercase tracking-[0.3em] text-left">Professional Access</div>
                                                <div className="w-1/3 text-[10px] font-bold text-blue-700 uppercase tracking-[0.3em] text-center">Foundation</div>
                                                <div className="w-1/3 text-[10px] font-bold text-blue-700 uppercase tracking-[0.3em] text-center">Transition</div>
                                            </div>

                                            <div className="divide-y divide-slate-50">
                                                {[
                                                    {
                                                        label: "W1000 Suite & 50hr Cert",
                                                        foundation: true,
                                                        transition: true,
                                                        pillar: "Accredited Experience",
                                                        description: "Core systems engineering and foundational certification for entry-level pilot readiness."
                                                    },
                                                    {
                                                        label: "Foundational Exams",
                                                        foundation: true,
                                                        transition: true,
                                                        pillar: "Accredited Experience",
                                                        description: "Standardized competency assessments to validate core aviation knowledge and SOP understanding."
                                                    },
                                                    {
                                                        label: "Mentorship Network Access",
                                                        foundation: true,
                                                        transition: true,
                                                        pillar: "Leadership Skills",
                                                        description: "Direct connection to the global WingMentor community of mentees and experienced industry mentors."
                                                    },
                                                    {
                                                        label: "HINFACT EBT CBTA",
                                                        foundation: false,
                                                        transition: true,
                                                        pillar: "Pilot Recognition",
                                                        description: "Advanced Airbus Integrated applications and Evidence-Based Training (EBT) competency modules."
                                                    },
                                                    {
                                                        label: "Airline Expectations prior Apply",
                                                        foundation: false,
                                                        transition: true,
                                                        pillar: "Pilot Recognition",
                                                        description: "Exclusive access to airline expectations and prep-requirements for Etihad, SkyPasada, FlyDubai, and Air Asia."
                                                    },
                                                    {
                                                        label: "UAE GCAA Pathway",
                                                        foundation: false,
                                                        transition: true,
                                                        pillar: "Unity & Support",
                                                        description: "Strategic guidance for ATPL pathways and direct licensure within the United Arab Emirates (GCAA)."
                                                    }
                                                ].map((item, idx) => (
                                                    <div key={idx} className="group/row flex items-center py-4 px-6 hover:bg-slate-50/50 transition-all duration-300 relative">
                                                        <div className="w-1/3 text-left relative">
                                                            <span className="text-xs font-bold text-slate-700 block group-hover/row:text-blue-700 transition-colors">{item.label}</span>
                                                            {/* Fade-in Description Box */}
                                                            <div className="absolute left-0 top-full mt-1 z-30 w-64 p-4 bg-white border border-slate-100 rounded-2xl shadow-2xl opacity-0 translate-y-2 group-hover/row:opacity-100 group-hover/row:translate-y-0 transition-all duration-300 pointer-events-none">
                                                                <div className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                    <div className="w-1 h-1 rounded-full bg-blue-600"></div>
                                                                    {item.pillar}
                                                                </div>
                                                                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">{item.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="w-1/3 flex justify-center">
                                                            {item.foundation ? <CheckCircle2 className="w-4 h-4 text-slate-300" /> : <span className="text-slate-200 text-xs">—</span>}
                                                        </div>
                                                        <div className="w-1/3 flex justify-center">
                                                            {item.transition ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> : <span className="text-slate-200 text-xs">—</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Verifiable and Accredited Experience Section */}
                                            <div className="mt-12 pt-12 border-t border-slate-100 w-full text-center">
                                                <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.4em] mb-8">
                                                    Verifiable and Accredited Experience
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                                    <div className="group/pillar">
                                                        <h4 className="text-[11px] font-bold text-[#050A30] uppercase tracking-widest mb-3 flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#050A30]"></div>
                                                            Leadership Skills
                                                        </h4>
                                                        <p className="text-slate-600 text-xs leading-relaxed font-sans">
                                                            Master the <strong className="text-slate-900 font-semibold">Foundational Program</strong> & <strong className="text-slate-900 font-semibold">Mentorship Certification</strong>. Develop a flight instructor mindset, specializing in problem-solving through professional consultation and observation.
                                                        </p>
                                                    </div>
                                                    <div className="group/pillar">
                                                        <h4 className="text-[11px] font-bold text-[#050A30] uppercase tracking-widest mb-3 flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#050A30]"></div>
                                                            Pilot Recognition
                                                        </h4>
                                                        <p className="text-slate-600 text-xs leading-relaxed font-sans">
                                                            Gain industry recognition <strong className="text-slate-900 font-semibold">prior to major investments</strong>. Master airline expectations and type rating requirements instead of investing blindly in your future.
                                                        </p>
                                                    </div>
                                                    <div className="group/pillar">
                                                        <h4 className="text-[11px] font-bold text-[#050A30] uppercase tracking-widest mb-3 flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#050A30]"></div>
                                                            Unity & Support
                                                        </h4>
                                                        <p className="text-slate-600 text-xs leading-relaxed font-sans">
                                                            A network dedicated to supporting pilots. Find <strong className="text-slate-900 font-semibold">strategic pathways</strong> and get connected through industry relations and the diverse people within our program.
                                                        </p>
                                                    </div>
                                                    <div className="group/pillar">
                                                        <h4 className="text-[11px] font-bold text-[#050A30] uppercase tracking-widest mb-3 flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#050A30]"></div>
                                                            Accredited Experience
                                                        </h4>
                                                        <p className="text-slate-600 text-xs leading-relaxed font-sans">
                                                            Transform your operational history into a <strong className="text-slate-900 font-semibold">verifiable competency record</strong>, accredited by partners and recognized by top recruiters.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bridging the Gap Section - Inner Card Section */}
                                        <div className="mt-20 pt-20 border-t border-slate-100 w-full flex flex-col items-center">
                                            <img
                                                src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                                alt="WingMentor Logo"
                                                className="w-48 h-auto object-contain mb-8 opacity-70"
                                            />
                                            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-2">
                                                Connecting Pilots to the Aviation Industry
                                            </p>
                                            <h3 className="text-4xl md:text-6xl font-serif text-slate-900 mb-12 leading-tight tracking-tight">
                                                Bridging the Pilot Gap
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 text-left w-full max-w-5xl mx-auto">
                                                <div className="space-y-8">
                                                    <div className="flex items-start gap-5 group/item p-4 -mx-4 rounded-2xl transition-all duration-500 hover:bg-slate-50/50">
                                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#050A30] flex-shrink-0"></div>
                                                        <div>
                                                            <h4 className="font-bold text-[#050A30] uppercase tracking-[0.2em] text-xs mb-2 transition-colors">Pathways</h4>
                                                            <p className="text-slate-600 text-[14px] leading-relaxed font-sans">Strategic placement into <strong className="text-slate-900 font-semibold">Commercial Airlines, Private Jet (VIP), Air Taxi (eVTOL)</strong>, and Unmanned Systems. We solve the "Experience Gap" by facilitating direct-to-industry transitions through verified operational history.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-5 group/item p-4 -mx-4 rounded-2xl transition-all duration-500 hover:bg-slate-50/50">
                                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#050A30] flex-shrink-0"></div>
                                                        <div>
                                                            <h4 className="font-bold text-[#050A30] uppercase tracking-[0.2em] text-xs mb-2 transition-colors">Programs</h4>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-blue-800 font-bold text-[10px] uppercase tracking-widest mb-1.5">Foundational Tier</p>
                                                                    <p className="text-slate-600 text-[14px] leading-relaxed font-sans">High-impact recognition for <strong className="text-slate-900 font-semibold">Leadership, CRM</strong>, and <strong className="text-slate-900 font-semibold">Flight Instructor Readiness</strong>, establishing a verified baseline required for elite carrier recruitment.</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-blue-800 font-bold text-[10px] uppercase tracking-widest mb-1.5">Transition Tier</p>
                                                                    <p className="text-slate-600 text-[14px] leading-relaxed font-sans">Advanced <strong className="text-slate-900 font-semibold">EBT & CBTA Familiarization</strong>, aligning your performance metrics to the global standards demanded by manufacturers like <strong className="text-slate-900 font-semibold">Airbus</strong>.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-8">
                                                    <div className="flex items-start gap-5 group/item p-4 -mx-4 rounded-2xl transition-all duration-500 hover:bg-slate-50/50">
                                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#050A30] flex-shrink-0"></div>
                                                        <div>
                                                            <h4 className="font-bold text-[#050A30] uppercase tracking-[0.2em] text-xs mb-2 transition-colors">Applications</h4>
                                                            <p className="text-slate-600 text-[14px] leading-relaxed font-sans">Direct access to our proprietary ecosystem: <strong className="text-slate-900 font-semibold">W1000 Glass Cockpit Suite</strong>, Gleims Examination Terminal, and the <strong className="text-slate-900 font-semibold">Black Box</strong> intelligence repository for real-world simulation.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-5 group/item p-4 -mx-4 rounded-2xl transition-all duration-500 hover:bg-slate-50/50">
                                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#050A30] flex-shrink-0"></div>
                                                        <div>
                                                            <h4 className="font-bold text-[#050A30] uppercase tracking-[0.2em] text-xs mb-2 transition-colors">Systems</h4>
                                                            <p className="text-slate-600 text-[14px] leading-relaxed font-sans"><strong className="text-slate-900 font-semibold">ATLAS-Compliant AI CV</strong> profiling and permanent placement within the industry-standard <strong className="text-slate-900 font-semibold">Verified Pilot Database</strong>, transforming raw hours into data-driven competency markers.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-16 w-full max-w-lg flex flex-col items-center">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-4 animate-pulse">Join the Pilot Network & Get Recognized</span>
                                            <button
                                                onClick={onJoinUs}
                                                className="w-full bg-[#050A30] hover:bg-[#070D3D] text-white py-6 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/10 hover:shadow-blue-900/30 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-98 border border-white/10"
                                            >
                                                Become a Member <i className="fas fa-arrow-right text-xs opacity-50"></i>
                                            </button>
                                            <div className="mt-6 flex items-center justify-center gap-6">
                                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Verified Access</span>
                                                <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Restricted Community</span>
                                            </div>
                                            <div className="mt-8 max-w-2xl bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <p className="text-[10px] text-slate-500 font-medium tracking-tight leading-relaxed text-center">
                                                    Service fees apply for professional awards, certifications, and program completions. Please consult our official documentation regarding pathway enrollment, system database screening fees, and administrative processing requirements according to regulatory standards.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>

                        {/* Footer Note: Progressive Pathway */}
                        {/* Footer Note: Progressive Pathway */}
                        <div className="text-center mt-8 mb-12 max-w-3xl mx-auto">
                            <p className="text-blue-200/60 italic text-sm md:text-base leading-relaxed">
                                <span className="text-blue-400 font-bold block mb-2 not-italic uppercase tracking-widest text-xs">Progressive Pathway Recommendation</span>
                                Doing the Foundational Program first, rather than going straight to the Transition Program & Airline Familiarizations, will give you a <strong className="text-white">preferred edge</strong> towards the beneficial and <strong className="text-white">recognizability</strong> within the WingMentor Pilot Database.
                            </p>
                        </div>


                        {/* Section 3: The Why (For Airlines & ATOs) */}
                        <div className="mt-24 mb-16 text-center max-w-4xl mx-auto relative z-10 px-4">
                            <RevealOnScroll delay={400}>
                                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-xl">
                                    <h3 className="text-xl md:text-3xl font-sans font-bold text-white mb-4">
                                        Airlines, Operators, or Regulatory Authorities?
                                    </h3>
                                    <p className="text-zinc-300 text-lg leading-relaxed mb-8">
                                        WingMentor provides an industry-standard database of candidates vetted through EBT CBTA familiarization and Hinfact. We serve Major Carriers, Private Sector Operators, and Governing Bodies (FAA/CAAP) to streamline "Airline-Ready" talent acquisition.
                                    </p>
                                    <button className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white uppercase tracking-widest transition-all duration-200 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/40 group">
                                        <span>Contact for Enterprise Access</span>
                                        <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                                    </button>
                                </div>
                            </RevealOnScroll>
                        </div>

                        {/* User Agreement */}
                        <div className="text-center relative z-10 pb-12">
                            <p className="text-slate-400/60 text-xs uppercase tracking-widest">
                                By joining, you agree to the <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors underline decoration-slate-300 underline-offset-4">Privacy Policy</a> & <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors underline decoration-slate-300 underline-offset-4">User Agreement</a>
                            </p>
                        </div>
                    </div>
                </div>



                {/* Frequently Asked Questions Section (Carousel) */}
                <div className="relative bg-[#0A1138] py-24 px-6 overflow-hidden">
                    <div className="max-w-6xl mx-auto relative z-10">
                        <RevealOnScroll delay={100}>
                            <div className="relative group">
                                {/* Glassy Background Glow */}
                                <div className="absolute inset-0 bg-white/5 rounded-3xl blur-2xl transition-all duration-500 group-hover:bg-white/10"></div>

                                <div className="relative bg-white border border-slate-200 rounded-3xl p-8 md:py-10 md:px-20 flex flex-col items-center text-center shadow-2xl min-h-[350px] justify-center">

                                    {/* Navigation Chevrons */}
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 pointer-events-none">
                                        <button
                                            onClick={prevFaq}
                                            className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:scale-110 transition-all pointer-events-auto shadow-sm active:scale-95"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={nextFaq}
                                            className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:scale-110 transition-all pointer-events-auto shadow-sm active:scale-95"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <img
                                        src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                        alt="WingMentor Logo"
                                        className="w-64 h-auto object-contain mb-4 opacity-80"
                                    />

                                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-2">
                                        Support & Guidance
                                    </p>

                                    {/* Animated Content Wrapper */}
                                    <div className="relative w-full overflow-hidden mb-6">
                                        <div
                                            key={currentFaq}
                                            className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center"
                                        >
                                            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4 leading-tight max-w-3xl">
                                                {faqItems[currentFaq].question}
                                            </h2>

                                            <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
                                                {faqItems[currentFaq].answer}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pagination Dots */}
                                    <div className="flex gap-3 mb-6">
                                        {faqItems.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentFaq(idx)}
                                                className={`h-1.5 transition-all duration-500 rounded-full ${currentFaq === idx ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex flex-col items-center w-full max-w-md">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-2 animate-pulse">Join the Pilot Network & Get Recognized</span>
                                        <div className="flex flex-col sm:flex-row gap-4 w-full relative z-20">
                                            <button
                                                onClick={onJoinUs}
                                                className="flex-1 bg-[#050A30] hover:bg-[#070D3D] text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-900/30 hover:scale-[1.02] active:scale-95 border border-white/10"
                                            >
                                                Become a Member
                                            </button>
                                            <button
                                                onClick={() => onNavigate('dashboard')}
                                                className="flex-1 bg-white hover:bg-slate-50 text-slate-900 py-4 rounded-xl font-bold uppercase tracking-widest transition-all border border-slate-200 hover:border-slate-300 hover:scale-[1.02] active:scale-95 shadow-sm"
                                            >
                                                Visit FAQ Center
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="relative bg-black text-white py-24 px-6 overflow-hidden">

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
                        {/* Logo & About Us */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                                    <img src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white text-lg font-bold tracking-tighter leading-none uppercase">WingMentor</span>
                                    <span className="text-white/60 text-[10px] uppercase tracking-widest font-light italic">Pilot Recognition & WingMentor Pathways</span>
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-sm max-w-sm">
                                WingMentor provides comprehensive Pilot Recognition & WingMentor Pathways: bridging the gap between training and career excellence through methodology and verifiable experience.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-white/60 hover:text-white transition-colors"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>

                        {/* Important Links */}
                        <div className="md:pl-12">
                            <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-blue-400">Important Links</h3>
                            <ul className="space-y-4">
                                {navItems.map((item) => (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => onNavigate(item.target)}
                                            className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-widest font-semibold"
                                        >
                                            {item.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div>
                            <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-blue-400">Contact Us</h3>
                            <div className="space-y-6 text-gray-300">
                                <div className="flex items-start gap-4">
                                    <span className="text-blue-400 mt-1"><i className="fas fa-envelope"></i></span>
                                    <div>
                                        <p className="text-xs uppercase text-white/40 font-bold tracking-widest mb-1">Email Now</p>
                                        <p className="text-sm font-semibold">wingmentorprogram@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-blue-400 mt-1"><i className="fas fa-phone"></i></span>
                                    <div>
                                        <p className="text-xs uppercase text-white/40 font-bold tracking-widest mb-1">Call Support</p>
                                        <p className="text-sm font-semibold">+971 55 519 5391</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-blue-400 mt-1"><i className="fas fa-map-marker-alt"></i></span>
                                    <div>
                                        <p className="text-xs uppercase text-white/40 font-bold tracking-widest mb-1">Office Location</p>
                                        <p className="text-sm font-semibold">Global Operations (UAE, EU, PH)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                        <p>&copy; {new Date().getFullYear()} WingMentor Pilot Recognition & WingMentor Pathways. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>


        </div>
    );
};
