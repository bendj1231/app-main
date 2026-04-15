import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface PathwayCarouselProps {
    slides: Slide[];
    onNavigate: (page: string) => void;
    onGoToProgramDetail: (slide: Slide) => void;
    onLogin: () => void;
}

export const PathwayCarousel: React.FC<PathwayCarouselProps> = ({
    slides,
    onGoToProgramDetail,
    onLogin
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const filteredSlides = slides.filter(slide => 
        slide.category === 'program' || slide.category === 'pathways'
    );

    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % filteredSlides.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [filteredSlides.length, isAnimating]);

    const prevSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + filteredSlides.length) % filteredSlides.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [filteredSlides.length, isAnimating]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    const getSlideIndex = (offset: number) => {
        const newIndex = currentIndex + offset;
        if (newIndex < 0) return filteredSlides.length - 1;
        if (newIndex >= filteredSlides.length) return 0;
        return newIndex;
    };

    const prevIndex = getSlideIndex(-1);
    const nextIndex = getSlideIndex(1);

    const getCardStyle = (position: 'prev' | 'active' | 'next') => {
        const baseStyle = {
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        };

        switch (position) {
            case 'prev':
                return {
                    ...baseStyle,
                    transform: 'translateX(-85%) scale(0.75) rotateY(25deg)',
                    opacity: 0.5,
                    zIndex: 10,
                    filter: 'blur(2px) brightness(0.7)',
                };
            case 'active':
                return {
                    ...baseStyle,
                    transform: 'translateX(0) scale(1) rotateY(0deg)',
                    opacity: 1,
                    zIndex: 30,
                    filter: 'none',
                };
            case 'next':
                return {
                    ...baseStyle,
                    transform: 'translateX(85%) scale(0.75) rotateY(-25deg)',
                    opacity: 0.5,
                    zIndex: 10,
                    filter: 'blur(2px) brightness(0.7)',
                };
        }
    };

    if (filteredSlides.length === 0) return null;

    const activeSlide = filteredSlides[currentIndex];
    const prevSlideData = filteredSlides[prevIndex];
    const nextSlideData = filteredSlides[nextIndex];

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center perspective-[1200px]">
            {/* 3D Carousel Container */}
            <div className="relative w-full max-w-[1100px] h-[500px] md:h-[580px] flex items-center justify-center">
                
                {/* Previous Card (Ghost) */}
                <div 
                    className="absolute w-[320px] md:w-[400px] cursor-pointer"
                    style={getCardStyle('prev')}
                    onClick={prevSlide}
                >
                    <GhostCard slide={prevSlideData} />
                </div>

                {/* Active Card */}
                <div 
                    className="absolute w-[360px] md:w-[480px]"
                    style={getCardStyle('active')}
                >
                    <ActiveCard 
                        slide={activeSlide} 
                        onLearnMore={() => onGoToProgramDetail(activeSlide)}
                        onLogin={onLogin}
                    />
                </div>

                {/* Next Card (Ghost) */}
                <div 
                    className="absolute w-[320px] md:w-[400px] cursor-pointer"
                    style={getCardStyle('next')}
                    onClick={nextSlide}
                >
                    <GhostCard slide={nextSlideData} />
                </div>

                {/* Navigation Arrows */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-40 flex gap-2">
                    {filteredSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                if (!isAnimating) {
                                    setIsAnimating(true);
                                    setCurrentIndex(idx);
                                    setTimeout(() => setIsAnimating(false), 500);
                                }
                            }}
                            className={`transition-all duration-300 rounded-full ${
                                idx === currentIndex 
                                    ? 'w-8 h-2 bg-white' 
                                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Active (Center) Card Component
const ActiveCard: React.FC<{
    slide: Slide;
    onLearnMore: () => void;
    onLogin: () => void;
}> = ({ slide, onLearnMore, onLogin }) => {
    return (
        <div className="relative group">
            {/* Main glass card */}
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                
                {/* Card Image */}
                <div className="relative h-[220px] md:h-[280px] overflow-hidden">
                    <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                        <span className="text-white text-xs font-medium uppercase tracking-wider">
                            {slide.category}
                        </span>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                    <h3 className={`text-xl md:text-2xl font-serif leading-tight ${slide.titleColor || 'text-white'}`}>
                        {slide.title}
                    </h3>
                    
                    <p className={`text-sm leading-relaxed ${slide.subtitleColor || 'text-white/70'}`}>
                        {slide.subtitle}
                    </p>

                    {slide.regions && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {slide.regions.slice(0, 4).map((region, idx) => (
                                <span 
                                    key={idx} 
                                    className="text-lg"
                                    title={region.name}
                                >
                                    {region.flag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button 
                            onClick={onLearnMore}
                            className="flex-1 px-4 py-3 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105"
                        >
                            Learn More
                        </button>
                        <button 
                            onClick={onLogin}
                            className="px-4 py-3 bg-transparent hover:bg-white/10 text-white/80 text-sm font-medium rounded-lg border border-white/15 transition-all duration-300"
                        >
                            Login
                        </button>
                    </div>
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-white/50 to-transparent" />
                <div className="absolute top-0 left-0 w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
                <div className="absolute top-0 right-0 w-12 h-px bg-gradient-to-l from-white/50 to-transparent" />
                <div className="absolute top-0 right-0 w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 -z-10" />
        </div>
    );
};

// Ghost (Side) Card Component
const GhostCard: React.FC<{ slide: Slide }> = ({ slide }) => {
    return (
        <div className="relative">
            {/* Ghost glass card - simplified */}
            <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
                
                {/* Card Image - dimmed */}
                <div className="relative h-[180px] md:h-[220px] overflow-hidden">
                    <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                        <span className="text-white/80 text-[10px] font-medium uppercase tracking-wider">
                            {slide.category}
                        </span>
                    </div>
                </div>

                {/* Card Content - minimal */}
                <div className="p-4 space-y-2">
                    <h3 className={`text-base md:text-lg font-serif leading-tight ${slide.titleColor || 'text-white/80'}`}>
                        {slide.title.length > 30 ? slide.title.slice(0, 30) + '...' : slide.title}
                    </h3>
                    
                    <p className={`text-xs leading-relaxed line-clamp-2 ${slide.subtitleColor || 'text-white/50'}`}>
                        {slide.subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
};
