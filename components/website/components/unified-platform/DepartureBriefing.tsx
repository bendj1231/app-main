import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronLeft, Plane, Map, ShieldCheck, User } from 'lucide-react';

interface DepartureBriefingProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tabId: string) => void;
}

interface Phase {
  target: string | null;
  title: string;
  body: string;
  button: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const PHASES: Phase[] = [
  {
    target: null,
    title: 'Welcome to the Grid',
    body: 'You are currently invisible to the industry. Let\'s map your competencies and route you to active pathways. Let\'s look at your instruments.',
    button: 'Start Briefing',
    icon: Plane,
  },
  {
    target: 'home-access-recognition',
    title: '1. The Asset: Your Profile',
    body: 'This is your verified logbook. You will build your baseline here by adding your licenses, hours, and ratings.',
    button: 'Next',
    icon: User,
  },
  {
    target: 'home-discover-pathways',
    title: '2. The Engine: Pathways',
    body: 'Once your profile is built, this card goes live. This is where we run your raw data against airline demands to generate your percentage-matched roles.',
    button: 'Next',
    icon: Map,
  },
  {
    target: 'home-pilot-shortage',
    title: '3. The Mission: PilotShortage.org',
    body: 'The industry is broken. This is the advocacy layer where we publish the data to force market transparency.',
    button: 'Complete Briefing & Go To Profile',
    icon: ShieldCheck,
  },
];

export const DepartureBriefing: React.FC<DepartureBriefingProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [phase, setPhase] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) setPhase(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const target = PHASES[phase].target;
    if (!target) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour-target="${target}"]`) as HTMLElement | null;
    if (el) {
      const originalPosition = el.style.position;
      const originalZIndex = el.style.zIndex;
      const originalTransform = el.style.transform;
      el.style.position = 'relative';
      el.style.zIndex = '9998';
      el.style.transform = 'translateZ(0)';
      const update = () => setTargetRect(el.getBoundingClientRect());
      update();
      window.addEventListener('resize', update);
      window.addEventListener('scroll', update, true);
      return () => {
        el.style.position = originalPosition;
        el.style.zIndex = originalZIndex;
        el.style.transform = originalTransform;
        window.removeEventListener('resize', update);
        window.removeEventListener('scroll', update, true);
      };
    }
    setTargetRect(null);
  }, [phase, isOpen]);

  if (!mounted || !isOpen) return null;

  const current = PHASES[phase];
  const isLast = phase === PHASES.length - 1;
  const isFirst = phase === 0;
  const CurrentIcon = current.icon;

  const handleNext = () => {
    if (isLast) {
      onClose();
      onNavigateToTab('profile');
    } else {
      setPhase((p) => p + 1);
    }
  };

  const handleBack = () => {
    setPhase((p) => Math.max(0, p - 1));
  };

  // Spotlight ring around the target element
  const spotlight = targetRect && (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        top: targetRect.top - 8,
        left: targetRect.left - 8,
        width: targetRect.width + 16,
        height: targetRect.height + 16,
        borderRadius: 14,
        boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.72), 0 0 0 4px rgba(255,255,255,0.9), 0 0 32px 8px rgba(255,255,255,0.35)',
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    />
  );

  const modalContent = (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center px-4 py-6">
      {/* Background dim overlay */}
      <div className="absolute inset-0 bg-slate-950/60" />

      {spotlight}

      {/* Central briefing card */}
      <div
        ref={cardRef}
        className="relative z-[9999] w-full max-w-2xl bg-white/80 border border-white/60 rounded-2xl shadow-2xl shadow-slate-900/30 backdrop-blur-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(32px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Header accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

        {/* Phase indicator */}
        <div className="flex items-center justify-center gap-3 px-8 pt-8 pb-2">
          {PHASES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= phase ? 'w-10 bg-red-600' : 'w-5 bg-slate-300/60'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="flex justify-center mt-6 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400/20 to-blue-500/20 border border-sky-400/25 flex items-center justify-center shadow-lg shadow-sky-500/10">
            <CurrentIcon size={40} className="text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-slate-900 text-center px-8 mb-3">
          {current.title}
        </h2>

        {/* Body */}
        <p className="text-lg text-slate-600 text-center leading-relaxed px-8 mb-8 max-w-lg mx-auto">
          {current.body}
        </p>

        {/* Navigation */}
        <div className="px-8 pb-4 flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={isFirst}
            className={`flex items-center gap-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
              isFirst
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {current.button}
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Skip option */}
        <button
          onClick={onClose}
          className="w-full pb-6 text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Skip briefing
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
