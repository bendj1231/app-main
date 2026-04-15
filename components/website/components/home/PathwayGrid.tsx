import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Map, GraduationCap, Compass, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

interface Slide {
    image: string;
    title: string;
    category: string;
    subtitle: string;
    description?: string;
    regions?: { name: string; flag: string }[];
    isDarkCard?: boolean;
    titleColor?: string;
    subtitleColor?: string;
}

interface PathwayGridProps {
    slides: Slide[];
    onNavigate: (page: string) => void;
    onGoToProgramDetail: (slide: Slide) => void;
    onLogin: () => void;
    isLoggedIn?: boolean;
}

// Dummy card data matching Flight Simulator style
const dummyCards = [
    {
        id: 'member',
        images: [
            'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1000&auto=format&fit=crop',
            'https://lh3.googleusercontent.com/d/1K2CccSObEUsvy6unD8iqWjSjn-Zcw08g',
            'https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=1000&auto=format&fit=crop',
        ],
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1000&auto=format&fit=crop',
        title: 'Become a Member',
        loggedInTitle: 'Access Portal',
        subtitle: 'Join our aviation community and unlock exclusive benefits',
        loggedInSubtitle: 'Enter your member dashboard and resources',
        icon: Play,
        badge: null,
        accentColor: 'from-blue-500/80 to-cyan-400/80',
        isCarousel: true,
    },
    {
        id: 'discover',
        images: [
            '/images/w1000.png',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop',
        ],
        image: '/images/w1000.png',
        title: 'Discover',
        subtitle: 'Explore W1000 application, Airline Expectations, and Examination Terminal',
        icon: Map,
        badge: null,
        accentColor: 'from-emerald-500/80 to-teal-400/80',
        isCarousel: true,
    },
    {
        id: 'programs',
        image: 'https://lh3.googleusercontent.com/d/1K2CccSObEUsvy6unD8iqWjSjn-Zcw08g',
        title: 'Programs',
        subtitle: 'Structured training pathways from flight school to airline-ready professional',
        icon: GraduationCap,
        badge: null,
        accentColor: 'from-amber-500/80 to-orange-400/80',
    },
    {
        id: 'pilot-recognition',
        image: '/images/pilotrecognitioncompoennt.png',
        title: 'Pilot Recognition',
        subtitle: 'Verified credentials, milestones, and industry-recognized achievements',
        icon: Compass,
        badge: null,
        accentColor: 'from-violet-500/80 to-purple-400/80',
    },
    {
        id: 'pathways',
        image: '/images/grok-image-6c3347bc-ed6e-4c84-9e71-dca4df5d2c70.png',
        title: 'Pathways',
        subtitle: 'Airline, charter, cargo, and emerging aviation sector opportunities',
        icon: ShoppingBag,
        badge: null,
        accentColor: 'from-rose-500/80 to-pink-400/80',
    },
];

export const PathwayGrid: React.FC<PathwayGridProps> = ({
    onGoToProgramDetail,
    isLoggedIn = false,
}) => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [mountKey, setMountKey] = useState(Date.now());

    // Trigger animations on every mount (including refresh)
    useEffect(() => {
        setMountKey(Date.now());
        setIsVisible(false);
        
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Animation variants for cards
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 30,
            scale: 0.95,
            filter: 'blur(10px)'
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-start pt-16 md:pt-20 lg:pt-24 px-4 md:px-8 lg:px-12">
            <motion.div 
                key={mountKey}
                className="w-full max-w-[1200px]"
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
            >
                {/* Section Title - Home */}
                <motion.div variants={titleVariants} className="mb-3 md:mb-4">
                    <h2 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
                        Home
                    </h2>
                    <div className="w-16 h-0.5 bg-yellow-400 mt-2 rounded-full"></div>
                </motion.div>
                
                {/* Flight Simulator Style Grid - 2 rows */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4">
                    
                    {/* Top Row - 2 larger cards spanning 3 columns each */}
                    {dummyCards.slice(0, 2).map((card) => (
                        <motion.div
                            key={card.id}
                            variants={cardVariants}
                            className="md:col-span-3 h-[220px] md:h-[280px]"
                        >
                            <GridCard 
                                card={card}
                                isHovered={hoveredCard === card.id}
                                onHover={() => setHoveredCard(card.id)}
                                onLeave={() => setHoveredCard(null)}
                                onClick={() => onGoToProgramDetail({
                                    image: card.image,
                                    title: isLoggedIn && card.loggedInTitle ? card.loggedInTitle : card.title,
                                    category: 'program',
                                    subtitle: isLoggedIn && card.loggedInSubtitle ? card.loggedInSubtitle : card.subtitle,
                                    isDarkCard: true,
                                })}
                                className="w-full h-full"
                                isLoggedIn={isLoggedIn}
                            />
                        </motion.div>
                    ))}
                    
                    {/* Bottom Row - 3 cards spanning 2 columns each */}
                    {dummyCards.slice(2).map((card) => (
                        <motion.div
                            key={card.id}
                            variants={cardVariants}
                            className="md:col-span-2 h-[180px] md:h-[220px]"
                        >
                            <GridCard 
                                card={card}
                                isHovered={hoveredCard === card.id}
                                onHover={() => setHoveredCard(card.id)}
                                onLeave={() => setHoveredCard(null)}
                                onClick={() => onGoToProgramDetail({
                                    image: card.image,
                                    title: card.title,
                                    category: 'program',
                                    subtitle: card.subtitle,
                                    isDarkCard: true,
                                })}
                                className="w-full h-full"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Discover More - Scroll Indicator */}
                <motion.div 
                    className="absolute bottom-3 left-0 right-0 flex flex-col items-center z-50"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { 
                            opacity: 1, 
                            y: 0,
                            transition: {
                                delay: 1.2,
                                duration: 0.5,
                                ease: 'easeOut'
                            }
                        }
                    }}
                >
                    <span 
                        className="text-yellow-400 text-base md:text-lg font-bold tracking-[0.12em] mb-0.5"
                        style={{ 
                            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000'
                        }}
                    >
                        Discover more!
                    </span>
                    <div className="flex flex-col items-center leading-none">
                        <svg className="w-5 h-5 text-yellow-400 -mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 0 #000) drop-shadow(1px 0 0 #000) drop-shadow(0 -1px 0 #000) drop-shadow(-1px 0 0 #000)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 -mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 0 #000) drop-shadow(1px 0 0 #000) drop-shadow(0 -1px 0 #000) drop-shadow(-1px 0 0 #000)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 0 #000) drop-shadow(1px 0 0 #000) drop-shadow(0 -1px 0 #000) drop-shadow(-1px 0 0 #000)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
};

interface GridCardProps {
    card: typeof dummyCards[0];
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
    onClick: () => void;
    className?: string;
    isLoggedIn?: boolean;
}

const GridCard: React.FC<GridCardProps> = ({ 
    card, 
    isHovered, 
    onHover, 
    onLeave, 
    onClick,
    className = '',
    isLoggedIn = false
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const displayTitle = isLoggedIn && card.loggedInTitle ? card.loggedInTitle : card.title;
    const displaySubtitle = isLoggedIn && card.loggedInSubtitle ? card.loggedInSubtitle : card.subtitle;
    
    // Auto-rotate carousel images
    useEffect(() => {
        if (!card.isCarousel || !card.images || card.images.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % card.images.length);
        }, 3000); // Change every 3 seconds
        
        return () => clearInterval(interval);
    }, [card.isCarousel, card.images]);
    
    const currentImage = card.isCarousel && card.images 
        ? card.images[currentImageIndex] 
        : card.image;
    
    return (
        <div 
            className={`relative group cursor-pointer ${className}`}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onClick={onClick}
        >
            {/* Main Card Container - Glassy UI */}
            <div className={`
                relative w-full h-full rounded-xl overflow-hidden
                bg-slate-900/40 backdrop-blur-xl border border-white/20
                shadow-lg shadow-black/30
                transition-all duration-300 ease-out
                ${isHovered ? 'scale-[1.02] bg-slate-900/50 border-white/40 shadow-2xl shadow-black/40' : 'scale-100'}
            `}>
                {/* Background Image / Carousel */}
                <div className="absolute inset-0">
                    {card.isCarousel && card.images ? (
                        // Carousel with multiple images
                        <div className="relative w-full h-full">
                            {card.images.map((img, idx) => (
                                <img 
                                    key={idx}
                                    src={img} 
                                    alt={`${card.title} ${idx + 1}`}
                                    className={`
                                        absolute inset-0 w-full h-full object-cover transition-all duration-1000
                                        ${idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                                        ${isHovered ? 'scale-110' : ''}
                                    `}
                                />
                            ))}
                            {/* Carousel Indicators */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                {card.images.map((_, idx) => (
                                    <div 
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            idx === currentImageIndex 
                                                ? 'bg-white w-4' 
                                                : 'bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Single image
                        <img 
                            src={card.image} 
                            alt={card.title}
                            className={`
                                w-full h-full object-cover transition-transform duration-700
                                ${isHovered ? 'scale-110' : 'scale-100'}
                            `}
                        />
                    )}
                    {/* Gradient Overlay */}
                    <div className={`
                        absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent
                        transition-opacity duration-300
                        ${isHovered ? 'opacity-90' : 'opacity-80'}
                    `} />
                    
                    {/* Hover Accent Glow */}
                    <div className={`
                        absolute inset-0 bg-gradient-to-t ${card.accentColor}
                        opacity-0 transition-opacity duration-300
                        ${isHovered ? 'opacity-20' : ''}
                    `} />
                </div>

                {/* Badge */}
                {card.badge && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500/90 text-black text-xs font-bold rounded">
                        {card.badge}
                    </div>
                )}

                {/* Text Overlay - Directly on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <div className="relative">
                        <h3 className="font-bold text-white text-sm md:text-lg tracking-wide mb-1 drop-shadow-lg">
                            {displayTitle}
                        </h3>
                        <p className="text-white/90 text-[10px] md:text-xs truncate drop-shadow-md">
                            {displaySubtitle.length > 45 ? displaySubtitle.slice(0, 42) + '...' : displaySubtitle}
                        </p>
                    </div>
                </div>

                {/* Hover Border Effect */}
                <div className={`
                    absolute inset-0 rounded-xl border-2 transition-all duration-300
                    ${isHovered ? 'border-white/40' : 'border-transparent'}
                    pointer-events-none
                `} />

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-white/40 to-transparent" />
                <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
                <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-white/40 to-transparent" />
                <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
            </div>
        </div>
    );
};
