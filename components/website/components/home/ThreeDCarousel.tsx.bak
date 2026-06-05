"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ThreeDCarouselProps {
    items: {
        icon?: React.ReactNode;
        title: string;
        value: string;
        index: number;
    }[];
    onItemClick?: (index: number) => void;
}

export const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({ items, onItemClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const nextSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const getTransform = (index: number) => {
        const offset = index - currentIndex;
        
        // Handle wrap-around for smoother transitions
        let adjustedOffset = offset;
        if (offset > items.length / 2) {
            adjustedOffset -= items.length;
        } else if (offset < -items.length / 2) {
            adjustedOffset += items.length;
        }

        const absOffset = Math.abs(adjustedOffset);
        
        // Calculate transform based on position - centered at 0
        const translateX = adjustedOffset * 140; // Horizontal spacing
        const translateZ = -Math.abs(adjustedOffset) * 150; // Depth
        const rotateY = adjustedOffset * -25; // Rotation
        const scale = 1 - absOffset * 0.12; // Scale down for side items
        const opacity = 1 - absOffset * 0.25; // Fade out for side items
        const zIndex = 100 - absOffset; // Layering

        return {
            transform: `translateX(${translateX}px) translateY(-60px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
            opacity: Math.max(0, opacity),
            zIndex,
            filter: absOffset > 0 ? 'blur(1px)' : 'none'
        };
    };

    return (
        <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 z-50 w-14 h-14 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full shadow-lg flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
                disabled={isAnimating}
            >
                <ChevronLeft className="w-7 h-7 text-white" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 z-50 w-14 h-14 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full shadow-lg flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
                disabled={isAnimating}
            >
                <ChevronRight className="w-7 h-7 text-white" />
            </button>

            {/* Carousel Container with 3D Perspective */}
            <div 
                ref={containerRef}
                className="relative w-full h-full perspective-1000"
                style={{ perspective: '1200px' }}
            >
                <div 
                    className="relative w-full h-full flex items-center justify-center preserve-3d"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {items.map((item, index) => {
                        const style = getTransform(index);
                        return (
                            <div
                                key={index}
                                className="absolute w-72 md:w-96 h-96 md:h-[450px] rounded-3xl overflow-hidden transition-all duration-500 ease-out shadow-2xl cursor-pointer hover:shadow-3xl"
                                style={style}
                                onClick={() => onItemClick && onItemClick(index)}
                            >
                                {/* Background Image */}
                                <div className="relative w-full h-full">
                                    {item.icon && (
                                        <div className="absolute inset-0">
                                            {React.cloneElement(item.icon as React.ReactElement, {
                                                className: "w-full h-full object-cover"
                                            })}
                                        </div>
                                    )}
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                    
                                    {/* Content */}
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        <div className="absolute top-4 right-6 font-serif text-4xl text-white/30">
                                            0{item.index + 1}
                                        </div>
                                        <h3 className="text-sm md:text-base font-serif text-white uppercase tracking-[0.08em] mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-white/80 leading-relaxed">
                                            {item.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (!isAnimating) {
                                setIsAnimating(true);
                                setCurrentIndex(index);
                                setTimeout(() => setIsAnimating(false), 500);
                            }
                        }}
                        className={`w-3 h-3 rounded-full transition-all ${
                            index === currentIndex
                                ? 'bg-blue-600 w-8'
                                : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};
