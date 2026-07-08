import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, ChevronLeft, Plane } from 'lucide-react';

interface WelcomeGetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStepAction?: (stepIndex: number) => void;
}

const STEPS = [
  {
    image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1200&q=80',
    title: 'Welcome to RecognitionOS',
    description:
      'Your pilot career runs on three connected domains: pilotcareerpathways.com for matched opportunities, pilotrecognition.com for your verified profile, and pilotshortage.org for industry advocacy and resources.',
    action: 'Complete My Profile',
  },
  {
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=80',
    title: 'Discover Your Pathways',
    description:
      'See exactly which airlines, cargo operators, and cadet programs match your experience — and the precise gaps to close.',
    action: 'View My Pathways',
  },
  {
    image: 'https://images.unsplash.com/photo-1488085062387-9d15a4a86d47?auto=format&fit=crop&w=1200&q=80',
    title: 'Unlock Verified Access',
    description:
      'Verify your credentials once to enter the verified pilot pool and become visible to airlines and operators.',
    action: 'Verify Credentials',
  },
];

const HERO_HEADLINE = 'RecognitionOS';
const HERO_SUBHEADLINE = 'One platform. Three domains. Your pilot career.';

const STORAGE_KEY = 'pr_welcome_get_started_dismissed';

// Set to true during development to show the modal on every home tab visit.
const ALWAYS_SHOW_WELCOME = false;

export const WelcomeGetStartedModal: React.FC<WelcomeGetStartedModalProps> = ({
  isOpen,
  onClose,
  onStepAction,
}) => {
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('[WelcomeGetStartedModal] isOpen changed:', isOpen);
    if (isOpen) setStep(0);
  }, [isOpen]);

  useEffect(() => {
    console.log('[WelcomeGetStartedModal] step changed:', step);
  }, [step]);

  if (!mounted || !isOpen) return null;

  const currentImage = STEPS[step].image;
  const isLast = step === STEPS.length - 1;

  const handleAction = () => {
    onStepAction?.(step);
    if (isLast) {
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
      }}
    >
      {/* Full-screen subtle gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.55) 0%, rgba(219,234,254,0.35) 50%, rgba(15,23,42,0.55) 100%)' }}
      />

      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white/70 border border-white/60 rounded-2xl shadow-2xl shadow-slate-900/20 backdrop-blur-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(32px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          aria-label="Close welcome modal"
        >
          <X size={20} />
        </button>

        {/* Hero Image */}
        <div style={{ borderRadius: '0px', overflow: 'hidden', position: 'relative', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          <img
            src={currentImage}
            alt={STEPS[step].title}
            style={{ width: '100%', height: '340px', objectFit: 'cover', objectPosition: 'center 50%', display: 'block' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.75) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
            <p style={{ margin: 0, color: '#ffffff', fontSize: '1.75rem', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {step === 0 ? HERO_HEADLINE : STEPS[step].title}
            </p>
            <p style={{ margin: '0.5rem 0 0', color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', textShadow: '0 1px 4px rgba(0,0,0,0.4)', maxWidth: '640px' }}>
              {step === 0 ? HERO_SUBHEADLINE : STEPS[step].description}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 px-6 pt-6 pb-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= step ? 'w-10 bg-red-600' : 'w-5 bg-slate-300/60'
              }`}
            />
          ))}
        </div>

        {/* Current step feature card */}
        <div className="px-8 py-5">
          <div
            style={{
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
            }}>
              <span style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 800 }}>{step + 1}</span>
            </div>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>{STEPS[step].title}</h3>
            <p style={{ margin: 0, fontSize: '1rem', color: '#334155', lineHeight: 1.7 }}>
              {STEPS[step].description}
            </p>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="px-8 pb-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className={`flex items-center gap-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                step === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <button
              onClick={handleAction}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {isLast ? 'Start My Profile' : STEPS[step].action}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Friction-free subtext */}
        <p className="text-center text-sm text-slate-500 px-8 pb-3">
          Setup takes less than 2 minutes. You can optionally request verification later.
        </p>

        {/* Skip option */}
        <button
          onClick={onClose}
          className="w-full pb-6 text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Skip tour
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const useWelcomeModal = () => {
  const [dismissed, setDismissed] = useState(() => {
    if (ALWAYS_SHOW_WELCOME) return false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY) === '1';
      console.log('[useWelcomeModal] dismissed from localStorage:', stored);
      return stored;
    } catch {
      return false;
    }
  });

  const dismiss = () => {
    if (ALWAYS_SHOW_WELCOME) {
      // During development, closing the modal resets it for the next visit.
      setDismissed(true);
      return;
    }
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
    window.dispatchEvent(new CustomEvent('app:onboardingComplete'));
  };

  return { dismissed: ALWAYS_SHOW_WELCOME ? false : dismissed, dismiss };
};
