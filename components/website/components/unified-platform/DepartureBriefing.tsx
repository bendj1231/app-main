import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Map, Plane, ShieldCheck, User } from 'lucide-react';

interface DepartureBriefingProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tabId: string) => void;
  isMobile?: boolean;
}

interface Phase {
  target: string | null;
  title: string;
  titleHighlight?: string;
  body: string;
  button: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  placement?: 'above' | 'below' | 'left' | 'right' | 'top' | 'bottom' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  image?: string;
  navigateTab?: string;
  navigateLabel?: string;
  showcaseTitle?: string;
  showcaseTitleHighlight?: string;
  showcaseSubtitle?: string;
  showcaseImage?: string;
  showcaseAccent?: string;
}

const PHASES: Phase[] = [
  {
    target: null,
    title: 'Welcome to Recognition',
    titleHighlight: 'OS',
    body: 'Navigate across pilotcareerpathways.com, pilotrecognition.com, and the pilotshortage.org association and forum — all connected to move your pilot career forward.',
    button: 'Next',
    icon: Plane,
    image: '/images/set-04-screenshots/photo1.png',
  },
  {
    target: 'home-right-profile',
    title: 'Your Pilot Profile Control Center',
    body: 'This panel aggregates your total logged hours, active licenses, and digital credentials. Syncing your logbook and completing profile elements here dynamically unlocks matched career pathways and custom airline application tracks across the network.',
    button: 'Next Step',
    icon: Plane,
    placement: 'left',
    navigateTab: 'profile',
    navigateLabel: 'Go to Profile',
    showcaseTitle: 'Recognition',
    showcaseTitleHighlight: 'OS',
    showcaseSubtitle: 'One platform. Three domains. Your pilot career.',
    showcaseImage: '/images/set-04-screenshots/photo1.png',
    showcaseAccent: 'from-cyan-500/80 to-blue-400/80',
  },
  {
    target: 'discover-pathways-card',
    title: '3. Discover Pathways',
    body: 'This card opens your career pathways. Tap it to navigate to the pathways tab, where the system analyzes your profile data against current global airline requirements to generate your percentage-matched roles.',
    button: 'Next',
    icon: Map,
    placement: 'top-start',
    navigateTab: 'pathways',
    navigateLabel: 'Go to Pathways',
    showcaseTitle: 'Discover Pathways',
    showcaseSubtitle: 'Percentage-matched roles from airlines, cargo, and cadet programs.',
    showcaseImage: '/images/set-06-pathways/pathway4.png',
    showcaseAccent: 'from-rose-500/80 to-pink-400/80',
  },
  {
    target: 'home-pilot-shortage',
    title: '3. The Pilot Shortage',
    body: 'This is the advocacy layer. Tap this card to navigate to pilotshortage.org where we publish the data forcing market transparency across the industry.',
    button: 'Next',
    icon: ShieldCheck,
    placement: 'above',
    navigateTab: 'pilotshortage',
    navigateLabel: 'Go to Pilot Shortage',
    showcaseTitle: 'The Pilot Shortage',
    showcaseSubtitle: 'Advocacy, data, and market transparency for pilots.',
    showcaseImage: '/images/set-07-ui-graphics/construct.png',
    showcaseAccent: 'from-red-500/80 to-orange-400/80',
  },
  {
    target: 'home-access-recognition',
    title: '4. Access Recognition',
    body: 'Start building your verified logbook here. Tap this card to navigate to the verification tab and add your licenses, hours, and ratings.',
    button: 'Complete Briefing',
    icon: User,
    placement: 'above',
    navigateTab: 'verification',
    navigateLabel: 'Go to Verification',
    showcaseTitle: 'Access Recognition',
    showcaseSubtitle: 'Verified logbook, licenses, and ratings for operators.',
    showcaseImage: '/images/set-07-ui-graphics/trailer1.png',
    showcaseAccent: 'from-violet-500/80 to-purple-400/80',
  },
];

export const DepartureBriefing: React.FC<DepartureBriefingProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  isMobile = false,
}) => {
  const [phase, setPhase] = useState(isMobile ? 1 : 0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [targetBorderRadius, setTargetBorderRadius] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!isOpen) return;
    const target = PHASES[phase].target;
    if (!target) return;

    let el: HTMLElement | null = null;
    let rafId: number;
    let observer: ResizeObserver | null = null;
    let originalStyles: { position: string; zIndex: string; transform: string } | null = null;

    const cleanup = () => {
      cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      if (el && originalStyles) {
        el.style.position = originalStyles.position;
        el.style.zIndex = originalStyles.zIndex;
        el.style.transform = originalStyles.transform;
        el.style.boxShadow = originalStyles.boxShadow;
        el.style.borderRadius = originalStyles.borderRadius;
        el.classList.remove('home-right-profile-active-spotlight');
      }
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };

    const update = () => {
      if (!el || !document.contains(el)) {
        el = document.querySelector(
          target.startsWith('.') ? target : `[data-tour-target="${target}"]`
        ) as HTMLElement | null;
        if (!el) {
          rafId = requestAnimationFrame(update);
          return;
        }
        originalStyles = {
          position: el.style.position,
          zIndex: el.style.zIndex,
          transform: el.style.transform,
          boxShadow: el.style.boxShadow,
          borderRadius: el.style.borderRadius,
        };
        el.style.position = 'relative';
        el.style.zIndex = '1000';
        el.style.transform = 'translateZ(0)';
        if (target === 'home-right-profile') {
          el.classList.add('home-right-profile-active-spotlight');
          el.style.boxShadow = '0 0 0 4px rgba(226, 35, 26, 0.2), 0 20px 40px rgba(0, 0, 0, 0.4)';
          el.style.borderRadius = '12px';
        }
        setTargetBorderRadius(parseFloat(window.getComputedStyle(el).borderRadius) || 0);
        observer = new ResizeObserver(update);
        observer.observe(el);
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
      }
      setTargetRect(el.getBoundingClientRect());
    };

    update();
    return cleanup;
  }, [phase, isOpen]);

  if (!mounted || !isOpen) return null;

  const current = PHASES[phase];
  const isLast = phase === PHASES.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
      onNavigateToTab('dashboard');
    } else {
      setPhase((p) => p + 1);
    }
  };

  const handleBack = () => {
    setPhase((p) => Math.max(0, p - 1));
  };

  const renderBody = (text: string) => {
    const parts = text.split(
      /(pilotcareerpathways\.com|pilotrecognition\.com|pilotshortage\.org)/g
    );
    return parts.map((part, i) => {
      if (
        part === 'pilotcareerpathways.com' ||
        part === 'pilotrecognition.com' ||
        part === 'pilotshortage.org'
      ) {
        return (
          <span
            key={i}
            className="text-[#E2231A] font-semibold hover:underline cursor-pointer transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(226,35,26,0.6)]"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Spotlight ring around the target element
  const spotlight = current.target && targetRect && (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
        borderRadius: targetBorderRadius,
        boxShadow:
          '0 0 0 9999px rgba(2, 6, 23, 0.25), 0 0 0 4px rgba(255,255,255,0.9), 0 0 32px 8px rgba(255,255,255,0.35)',
      }}
    />
  );

  // Position the floating message based on the target and placement
  const tooltipPosition: React.CSSProperties = (() => {
    if (current.target === null || !targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const MARGIN = 20;
    const placement = current.placement;

    switch (placement) {
      case 'top-start':
        return {
          top: targetRect.top - MARGIN,
          left: targetRect.left,
          transform: 'translate(0, -100%)',
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left - MARGIN,
          transform: 'translate(-100%, -50%)',
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + MARGIN,
          transform: 'translate(0, -50%)',
        };
      case 'above':
      case 'top':
        return {
          top: targetRect.top - MARGIN,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translate(-50%, -100%)',
        };
      case 'below':
      case 'bottom':
        return {
          top: targetRect.bottom + MARGIN,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translate(-50%, 0)',
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  })();

  const briefingContent = (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center px-4 py-6">
      <style>{`
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(220, 38, 38, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
          }
        }
      `}</style>

      {/* Background dim overlay — blurred everywhere except the spotlighted target */}
      {current.target === null || !targetRect ? (
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(8, 10, 15, 0.65)', backdropFilter: 'blur(4px)' }}
        />
      ) : (
        <>
          <div
            className="absolute"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: targetRect.top,
              background: 'rgba(8, 10, 15, 0.65)',
              backdropFilter: 'blur(4px)',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: 0,
              left: 0,
              right: 0,
              height: window.innerHeight - targetRect.bottom,
              background: 'rgba(8, 10, 15, 0.65)',
              backdropFilter: 'blur(4px)',
            }}
          />
          <div
            className="absolute"
            style={{
              top: targetRect.top,
              left: 0,
              width: targetRect.left,
              height: targetRect.height,
              background: 'rgba(8, 10, 15, 0.65)',
              backdropFilter: 'blur(4px)',
            }}
          />
          <div
            className="absolute"
            style={{
              top: targetRect.top,
              right: 0,
              width: window.innerWidth - targetRect.right,
              height: targetRect.height,
              background: 'rgba(8, 10, 15, 0.65)',
              backdropFilter: 'blur(4px)',
            }}
          />
        </>
      )}

      {!isMobile && spotlight}

      {/* Arrow indicator pointing from the target toward the tooltip */}
      {!isMobile && targetRect && current.target !== null && (
        <div
          className="fixed z-[9998] pointer-events-none"
          style={(() => {
            const MARGIN = 20;
            const placement = current.placement;
            let left = targetRect.left + targetRect.width / 2;
            let top = targetRect.top - MARGIN / 2;
            let rotation = 180;

            switch (placement) {
              case 'top-start':
                left = targetRect.left + 24;
                top = targetRect.top - MARGIN / 2;
                rotation = 180;
                break;
              case 'left':
                left = targetRect.left - MARGIN / 2;
                top = targetRect.top + targetRect.height / 2;
                rotation = 0;
                break;
              case 'right':
                left = targetRect.right + MARGIN / 2;
                top = targetRect.top + targetRect.height / 2;
                rotation = 180;
                break;
              case 'above':
              case 'top':
                left = targetRect.left + targetRect.width / 2;
                top = targetRect.top - MARGIN / 2;
                rotation = 180;
                break;
              case 'below':
              case 'bottom':
                left = targetRect.left + targetRect.width / 2;
                top = targetRect.bottom + MARGIN / 2;
                rotation = 0;
                break;
              default:
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight / 2;
                const tx = targetRect.left + targetRect.width / 2;
                const ty = targetRect.top + targetRect.height / 2;
                left = (tx + cx) / 2;
                top = (ty + cy) / 2;
                rotation = Math.atan2(cy - top, cx - left) * (180 / Math.PI) - 90;
                break;
            }

            return {
              left,
              top,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '14px solid rgba(255,255,255,0.9)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
            };
          })()}
        />
      )}

      {/* Floating message above the spotlight */}
      <div
        ref={tooltipRef}
        className={`fixed z-[10000] w-full text-center ${current.target === null ? 'max-w-4xl text-white' : 'max-w-lg text-white'} ${isMobile && current.target !== null ? 'px-4' : ''}`}
        style={{
          ...tooltipPosition,
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Welcome card — RecognitionOS glassmorphism step 1 */}
        {current.target === null ? (
          <div
            className={`w-full overflow-hidden ${isMobile ? 'max-w-full' : 'max-w-4xl'}`}
            style={{
              background: 'rgba(20, 24, 33, 0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
              borderRadius: '16px',
            }}
          >
            {/* Hero image */}
            {current.image && (
              <div
                className="relative w-full overflow-hidden"
                style={{ height: isMobile ? '220px' : '320px' }}
              >
                <img
                  src={current.image}
                  alt="RecognitionOS"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h1
                    className="text-white text-3xl md:text-4xl font-bold tracking-tight"
                    style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
                  >
                    Recognition<span className="text-red-500">OS</span>
                  </h1>
                  <p
                    className="text-white/90 text-base md:text-lg mt-2"
                    style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
                  >
                    One platform. Three domains. Your pilot career.
                  </p>
                </div>
              </div>
            )}

            {/* Content column */}
            <div className="px-6 py-8 md:px-12 md:py-10 text-center">
              {/* Step indicator */}
              <div className="mb-6">
                <span className="text-[11px] font-black tracking-[0.25em] text-sky-400 uppercase">
                  Getting Started
                </span>
                <span className="text-[11px] font-bold text-white/40 ml-3">1/4</span>
              </div>

              {/* Main title */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {current.title}
                {current.titleHighlight && (
                  <span className="text-red-500">{current.titleHighlight}</span>
                )}
              </h2>

              {/* Main body */}
              <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
                {renderBody(current.body)}
              </p>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleNext}
                  className="relative flex items-center justify-center gap-1 px-7 py-3 rounded-full text-sm font-bold text-white transition-all overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.4)',
                    animation: 'pulse-glow 2s infinite',
                  }}
                >
                  <span
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                  />
                  <span className="relative flex items-center gap-1">
                    {current.button}
                    <ChevronRight size={16} />
                  </span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-full text-sm font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/30 transition-all"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        ) : !isMobile ? (
          /* Desktop spotlight tooltip */
          <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-slate-950/30 rounded-2xl overflow-hidden w-[460px]">
            {current.showcaseImage && (
              <div className="relative h-52 bg-slate-900">
                <img
                  src={current.showcaseImage}
                  alt={current.showcaseTitle}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mb-2 shadow-lg">
                    <current.icon size={20} className="text-white" />
                  </div>
                  <h3
                    className="text-white text-xl font-bold mb-0.5"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
                  >
                    {current.showcaseTitle}
                    {current.showcaseTitleHighlight && (
                      <span className="text-red-500">{current.showcaseTitleHighlight}</span>
                    )}
                  </h3>
                  <p
                    className="text-white/90 text-sm leading-relaxed"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
                  >
                    {current.showcaseSubtitle}
                  </p>
                </div>
              </div>
            )}
            <div className="px-6 py-5">
              <div className="mb-3 text-center">
                <span className="text-[11px] font-black tracking-[0.2em] text-sky-400 uppercase">
                  Departure Briefing
                </span>
                <span className="text-[11px] font-bold text-white/50 ml-2">
                  Step {phase + 1} of {PHASES.length}
                </span>
              </div>

              <h2
                className="text-xl font-bold text-white leading-tight mb-3 text-center"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
              >
                {current.title}
                {current.titleHighlight && (
                  <span className="text-red-500">{current.titleHighlight}</span>
                )}
              </h2>
              <p
                className="text-lg text-white/90 leading-relaxed text-center"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
              >
                {renderBody(current.body)}
              </p>

              <div className="flex items-center justify-center gap-4 mt-5">
                {phase > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 px-4 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
                >
                  {current.button}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile showcase modal — the card animates into the tour */
          <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl shadow-slate-950/30 overflow-hidden">
            <div className="flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="w-full rounded-t-2xl overflow-hidden">
                    <div className="relative h-48 bg-slate-900">
                      {current.showcaseImage && (
                        <img
                          src={current.showcaseImage}
                          alt={current.showcaseTitle}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mb-2 shadow-lg">
                          <current.icon size={20} className="text-white" />
                        </div>
                        <h3
                          className="text-white text-xl font-bold mb-0.5"
                          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
                        >
                          {current.showcaseTitle}
                          {current.showcaseTitleHighlight && (
                            <span className="text-red-500">{current.showcaseTitleHighlight}</span>
                          )}
                        </h3>
                        <p
                          className="text-white/90 text-sm leading-relaxed"
                          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
                        >
                          {current.showcaseSubtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="p-5 text-left">
                <div className="mb-3">
                  <span className="text-xs font-black tracking-[0.2em] text-sky-400 uppercase">
                    Departure Briefing
                  </span>
                  <span className="text-xs font-bold text-white/50 ml-2">
                    Step {phase + 1} of {PHASES.length}
                  </span>
                </div>
                <h2
                  className="text-xl font-bold text-white mb-2 leading-tight"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
                >
                  {current.title}
                  {current.titleHighlight && (
                    <span className="text-red-500">{current.titleHighlight}</span>
                  )}
                </h2>
                <p
                  className="text-base text-white/90 leading-relaxed mb-5"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
                >
                  {renderBody(current.body)}
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleNext}
                    className="flex items-center justify-center gap-1 px-5 py-3.5 rounded-full text-base font-bold text-white transition-all w-full"
                    style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
                  >
                    {current.button}
                    <ChevronRight size={20} />
                  </button>
                  {phase > 1 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center justify-center gap-1 px-5 py-3.5 rounded-full text-base font-semibold text-white/80 hover:text-white transition-all w-full text-center"
                    >
                      <ChevronLeft size={20} />
                      Back
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-5 py-3.5 rounded-full text-base font-semibold text-white/80 hover:text-white transition-all w-full text-center"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(briefingContent, document.body);
};
