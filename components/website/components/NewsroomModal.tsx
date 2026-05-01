import React, { useState, useEffect, useRef } from 'react';
import { Home as HomeIcon, X, CheckCircle2 } from 'lucide-react';
import { IMAGES } from '@/src/lib/website-constants';

interface NewsroomItem {
    id: string;
    tag: string;
    title: string;
    description: string;
    image: string;
    metrics: { label: string; value: string }[];
    bullets: string[];
    ctaTarget: string;
}

interface NewsroomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (page: string) => void;
    newsroomHighlights: NewsroomItem[];
}

export const NewsroomModal: React.FC<NewsroomModalProps> = ({
    isOpen,
    onClose,
    onNavigate,
    newsroomHighlights
}) => {
    const [activeNewsIndex, setActiveNewsIndex] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);
    const lastInteractionRef = useRef<number>(Date.now());
    const autoCycleRef = useRef<NodeJS.Timeout | null>(null);

    const activeNewsItem = newsroomHighlights[activeNewsIndex];

    // Select random news item when modal opens
    useEffect(() => {
        if (isOpen) {
            const randomIndex = Math.floor(Math.random() * newsroomHighlights.length);
            setActiveNewsIndex(randomIndex);
            lastInteractionRef.current = Date.now();
        }
    }, [isOpen, newsroomHighlights.length]);

    // Auto-cycle every 6 seconds if no mouse/keyboard activity
    useEffect(() => {
        if (!isOpen) return;

        const startAutoCycle = () => {
            if (autoCycleRef.current) clearInterval(autoCycleRef.current);
            autoCycleRef.current = setInterval(() => {
                const idleTime = Date.now() - lastInteractionRef.current;
                if (idleTime >= 6000) {
                    setActiveNewsIndex(prev => (prev + 1) % newsroomHighlights.length);
                }
            }, 6000);
        };

        startAutoCycle();

        const resetTimer = () => {
            lastInteractionRef.current = Date.now();
        };

        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach(evt => document.addEventListener(evt, resetTimer, { passive: true }));

        return () => {
            if (autoCycleRef.current) clearInterval(autoCycleRef.current);
            events.forEach(evt => document.removeEventListener(evt, resetTimer));
        };
    }, [isOpen, newsroomHighlights.length]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleNewsroomHome = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onClose();
    };

    if (!isOpen || !activeNewsItem) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-20 lg:pt-24 p-3 md:p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-[8px]"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div 
                ref={modalRef}
                className="relative w-full max-w-[92vw] md:max-w-[900px] pointer-events-auto max-h-[92vh] flex flex-col"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 md:-top-3 md:-right-3 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-black/40 border-2 border-white/20 transition-all hover:scale-110"
                    aria-label="Close newsroom"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/65 to-slate-950/80 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-[12px] flex flex-col max-h-[92vh] overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 45%)' }} />
                    
                    <div className="grid gap-4 md:grid-cols-[1.4fr,1fr] p-4 md:p-5 overflow-y-auto">
                        <div className="text-white space-y-4 flex flex-col min-h-0">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/40">
                                        <span className="text-red-400">Recognition</span> <span className="text-white">Update</span>
                                    </span>
                                    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-rose-200">
                                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                                        Live
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">{activeNewsIndex + 1} / {newsroomHighlights.length}</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-200/80">{activeNewsItem.tag}</p>
                                <h2 className="text-xl md:text-3xl lg:text-[2.2rem] font-serif leading-tight mt-2">
                                    {activeNewsItem.title}
                                </h2>
                                <p className="text-slate-100/85 text-sm md:text-base mt-3 leading-relaxed">
                                    {activeNewsItem.description}
                                </p>
                            </div>

                            <ul className="space-y-1.5">
                                {activeNewsItem.bullets.map((bullet: string, index: number) => (
                                    <li key={`${activeNewsItem.id}-bullet-${index}`} className="flex items-start gap-2.5 text-sm text-slate-100/90">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {activeNewsItem.metrics.map((metric: { label: string; value: string }) => (
                                    <div key={`${activeNewsItem.id}-${metric.label}`} className="border border-white/25 bg-white/5 px-4 py-3 shadow-lg shadow-black/30">
                                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/70">{metric.label}</p>
                                        {metric.label === 'Certification' && metric.value === 'enroll now for free!' ? (
                                            <button
                                                onClick={() => {
                                                    onNavigate('become-a-member');
                                                    onClose();
                                                }}
                                                className="text-xl font-semibold text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                            >
                                                {metric.value}
                                            </button>
                                        ) : (
                                            <p className="text-xl font-semibold">{metric.value}</p>
                                        )}
                                        {metric.label === 'Certification' && (
                                            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mt-1">
                                                certifications & terms and conditions apply
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col items-center gap-2 pt-1">
                                <button
                                    onClick={handleNewsroomHome}
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 bg-white/80 text-slate-900 text-xs font-black uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(15,23,42,0.6)] hover:-translate-y-0.5 transition"
                                >
                                    <HomeIcon className="w-4 h-4" /> Home
                                </button>
                                <button
                                    onClick={() => {
                                        onNavigate(activeNewsItem.ctaTarget);
                                        onClose();
                                    }}
                                    className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80 hover:text-white"
                                >
                                    Open update →
                                </button>
                            </div>
                        </div>

                        <div className="relative min-h-[160px] md:min-h-0 border border-white/25 flex-shrink-0">
                            <img src={activeNewsItem.image} alt={activeNewsItem.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/75 via-slate-900/10 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <p className="text-[11px] uppercase tracking-[0.35em] text-white/70">Latest drop</p>
                                <p className="text-lg font-semibold text-white leading-tight">
                                    {activeNewsItem.tag}
                                </p>
                                <p className="text-sm text-white/80">
                                    Recognition, programs, and pathways broadcast through one newsroom overlay.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-3 border-t border-white/10 bg-slate-900/30">
                        <div className="flex flex-col gap-2">
                            <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">Latest Updates</span>
                            <div className="flex gap-1.5">
                                {newsroomHighlights.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveNewsIndex(index)}
                                        className={`h-1.5 flex-1 rounded-sm transition-all ${
                                            index === activeNewsIndex
                                                ? 'bg-white/60 border-2 border-white/40'
                                                : 'bg-white/20 border-2 border-dashed border-white/10 hover:bg-white/30'
                                        }`}
                                        aria-label={`Go to news item ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
