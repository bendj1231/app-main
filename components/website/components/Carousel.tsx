import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Users, Briefcase, ArrowRight } from 'lucide-react';

export const Carousel = ({ onCardClick }: { onCardClick: (id: string) => void }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const cards = [
        {
            id: 'foundational',
            title: "Foundation Program",
            subtitle: "Systems Architecture",
            description: "Begin your first pilot experience with us at WM through learning leadership skills, mentoring, and one-on-one consultation.",
            image: "/images/foundational-program.png",
            color: "text-sky-400",
            btnColor: "bg-sky-500 hover:bg-sky-600 shadow-sky-500/25",
            icon: BookOpen
        },
        {
            id: 'transition',
            title: "Transition Program",
            subtitle: "The Human Foundation",
            description: "Beyond the cockpit, we build the person. A 50-hour journey into Consultative Leadership and Character Formation, with a strategic introduction to EBT standards.",
            bullets: [
                { title: "Character over Credits", desc: "Developing the ethical discipline and leadership presence required for the flight deck." },
                { title: "The EBT Preview", desc: "Foundational introduction to the 9 Core Competencies before you finish flight school." },
                { title: "Accredited Mentorship", desc: "Gain verified experience mentoring peers aligned with Airbus and Etihad standards." },
                { title: "The Career Bridge", desc: "Builds your Refined Database Profile and unlocks a 50% discount on Transition." }
            ],
            image: "/images/carousel-accredited-mentorship.png",
            color: "text-purple-400",
            btnColor: "bg-purple-500 hover:bg-purple-600 shadow-purple-500/25",
            icon: Users
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % cards.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [cards.length]);

    const nextSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentSlide((prev) => (prev + 1) % cards.length);
    };

    const prevSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentSlide((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > 50) setCurrentSlide((prev) => (prev + 1) % cards.length);
        if (distance < -50) setCurrentSlide((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const getCardStyle = (index: number) => {
        const total = cards.length;
        let offset = (index - currentSlide + total) % total;
        if (offset > total / 2) offset -= total;
        const isActive = offset === 0;

        return {
            position: 'absolute' as const,
            width: '90%',
            height: '100%',
            left: '5%',
            top: 0,
            transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
            transformStyle: 'preserve-3d' as const,
            zIndex: isActive ? 20 : 10,
            opacity: Math.abs(offset) > 1 ? 0 : (isActive ? 1 : 0.4),
            transform: `translateX(${offset * 105}%) scale(${isActive ? 1 : 0.85}) rotateY(${offset * -25}deg) translateZ(${isActive ? 0 : -50}px)`,
            cursor: isActive ? 'default' : 'pointer',
            pointerEvents: (Math.abs(offset) > 1 ? 'none' : 'auto') as any,
        };
    };

    return (
        <div className="mb-16">
            <div
                className="relative h-[480px] w-full touch-pan-y"
                style={{ perspective: '1200px' }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    const isActive = index === currentSlide;
                    return (
                        <div
                            key={card.id}
                            style={getCardStyle(index)}
                            onClick={() => !isActive && setCurrentSlide(index)}
                            className="rounded-[40px] overflow-hidden shadow-2xl bg-slate-900 border border-slate-700/30"
                        >
                            <div className="absolute inset-0 z-0">
                                <img src={card.image} alt={card.title} className="w-full h-full object-cover opacity-50" />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                            </div>
                            <div className={`relative z-10 p-12 h-full flex flex-col justify-center max-w-2xl transition-opacity duration-500 ${isActive ? 'opacity-100 delay-200' : 'opacity-0'}`}>
                                <div className={`flex items-center space-x-4 mb-6 font-mono ${card.color}`}>
                                    <div className="glassy-icon-circle">
                                        <Icon size={28} />
                                    </div>
                                    <span className="text-sm tracking-[0.2em] uppercase font-bold">{card.subtitle}</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{card.title}</h2>
                                <p className="text-slate-300 text-lg mb-6 leading-relaxed max-w-xl">{card.description}</p>

                                {card.bullets && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        {card.bullets.map((bullet: any, idx: number) => (
                                            <div key={idx} className="flex items-start space-x-3">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                                <div>
                                                    <p className="text-sm font-bold text-white leading-none mb-1">{bullet.title}</p>
                                                    <p className="text-xs text-slate-400 leading-tight">{bullet.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); onCardClick(card.id); }}
                                    className={`self-start flex items-center space-x-3 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg transform hover:-translate-y-1 ${card.btnColor}`}
                                >
                                    <span>Enroll Now</span>
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    );
                })}
                <div className="absolute right-8 bottom-8 flex space-x-3 z-30">
                    <button onClick={prevSlide} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-colors"><ChevronLeft size={24} /></button>
                    <button onClick={nextSlide} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-colors"><ChevronRight size={24} /></button>
                </div>
                <div className="absolute left-10 bottom-10 flex space-x-2 z-30">
                    {cards.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};
