import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import type { TabId } from '../types';

interface RecognitionPlusTabProps {
  setTab: (tab: TabId) => void;
  onNavigate: (page: string) => void;
}

/* ─── Rockstar-inspired cinematic Recognition+ page ─── */

const SectionStrip: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = '', style }) => (
  <section className={`relative w-full overflow-hidden ${className}`} style={style}>
    {children}
  </section>
);

const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const RecognitionPlusTab: React.FC<RecognitionPlusTabProps> = ({ onNavigate }) => {
  return (
    <div className="relative z-10 flex flex-col w-full">
      {/* ═══════════════════════════════════════════════════
          HERO — Full viewport, cinematic, massive type
      ═══════════════════════════════════════════════════ */}
      <section
        className="relative flex items-center justify-center overflow-visible"
        style={{
          minHeight: 'calc(92vh + 120px)',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Background image with dark overlay — extends up under the nav bar */}
        <img
          src="/universal-pilot-gap.jpg"
          alt="Universal pilot gap"
          className="absolute w-full h-full object-cover"
          style={{ top: '-120px', left: 0, right: 0, bottom: 0 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(2,6,23,0.15) 0%, rgba(2,6,23,0.25) 25%, rgba(2,6,23,0.45) 45%, rgba(2,6,23,0.70) 70%, rgba(2,6,23,0.92) 100%)',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Massive headline */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-6">
              RECOGNITION
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)',
                }}
              >
                +
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-light tracking-wide max-w-2xl mx-auto mb-4 leading-relaxed">
              Your license is your leverage. We make the industry see it.
            </p>

            {/* Description */}
            <p className="text-sm text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Recognition+ is not a subscription. It is a one-time verification that turns your CAAP
              license, medical, and flight hours into a live, industry-trusted credential. Airlines
              do not read PDFs. They pull verified profiles.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => onNavigate('recognition-plus')}
                className="group px-10 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition-all hover:scale-105 flex items-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                  borderRadius: '4px',
                }}
              >
                Request Verification
                <ChevronRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              <span className="text-xs text-slate-500 font-medium tracking-wide">
                $120 one-time · No recurring fees
              </span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
            Explore
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STRIP 1 — The Problem (full-width image left)
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-28" style={{ background: '#020617' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <FadeIn>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src="/pilotcenter.png"
                  alt="Pilot at terminal"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to right, rgba(2,6,23,0.4) 0%, transparent 60%)',
                  }}
                />
              </div>
            </FadeIn>

            {/* Text */}
            <FadeIn delay={0.15}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 mb-4">
                  The Reality
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-6">
                  Airlines do not read
                  <br />
                  your PDF resume.
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-md">
                  They pull from verified databases. If your hours are not attested, your license
                  not cross-checked, and your medical not confirmed, you are invisible. The pilots
                  who get pulled are the ones pre-cleared.
                </p>
                <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                  Recognition+ is that clearance. One verification. Lifetime signal.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 2 — What You Get (full-width image right)
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-28" style={{ background: '#0a0f1e' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text (left on desktop) */}
            <FadeIn className="order-2 lg:order-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 mb-4">
                  What You Get
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-6">
                  A live profile
                  <br />
                  airlines can pull.
                </h2>
                <div className="space-y-5">
                  {[
                    {
                      title: 'CAAP License Verification',
                      desc: 'We cross-reference your PEL number with CAAP records. Your license status becomes a live data point.',
                    },
                    {
                      title: 'Medical Currency Check',
                      desc: 'Class 1 medical validated against CAAP Form 551 records. No more guessing if you are current.',
                    },
                    {
                      title: 'Flight Hours Attestation',
                      desc: 'Logbook data verified and locked. Airlines see attested hours, not self-reported numbers.',
                    },
                    {
                      title: 'Recognition+ Badge',
                      desc: 'A permanent verified badge on your profile. The signal that separates cleared pilots from the pile.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="group">
                      <div className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Image (right on desktop) */}
            <FadeIn delay={0.15} className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src="/wingmentor terminal.png"
                  alt="Terminal interface"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to left, rgba(2,6,23,0.5) 0%, transparent 60%)',
                  }}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 3 — How It Works (dark, centered)
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-28" style={{ background: '#020617' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 mb-4">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-14">
              Verified in three steps.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {[
              {
                step: '01',
                title: 'Submit',
                desc: 'Upload your CAAP license, medical certificate, and logbook summary. Takes five minutes.',
              },
              {
                step: '02',
                title: 'We Verify',
                desc: 'Our team cross-references with CAAP, your ATO, and logbook providers. Best effort on hours.',
              },
              {
                step: '03',
                title: 'You Go Live',
                desc: 'Your profile gets the Recognition+ badge. Airlines see you as pre-cleared. Pull-ready.',
              },
            ].map((s, i) => (
              <FadeIn key={s.step} delay={0.1 * (i + 1)}>
                <div className="relative text-left md:text-center">
                  <span className="text-6xl md:text-7xl font-black text-white/5 absolute -top-4 left-0 md:left-1/2 md:-translate-x-1/2 select-none">
                    {s.step}
                  </span>
                  <div className="relative">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2">
                      Step {s.step}
                    </p>
                    <h3 className="text-xl font-black text-white mb-3">{s.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 right-0 translate-x-1/2">
                      <ArrowRight size={20} className="text-slate-700" />
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 4 — Pricing / CTA (bold, full-width)
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-24 relative" style={{ background: '#0a0f1e' }}>
        {/* Subtle background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url(/bridging-the-gap.png)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, #0a0f1e 0%, rgba(10,15,30,0.85) 50%, #0a0f1e 100%)',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 mb-4">
              Pricing
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[0.95] mb-6">
              $120.
              <br />
              <span className="text-slate-500">One time.</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg mx-auto mb-10">
              No subscriptions. No recurring billing. You pay once, we verify once, and your profile
              carries the Recognition+ badge for as long as your credentials remain valid.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={() => onNavigate('recognition-plus')}
                className="group px-12 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition-all hover:scale-105 flex items-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                  borderRadius: '4px',
                }}
              >
                Request Verification Now
                <ChevronRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>

            <p className="text-[10px] text-slate-600 tracking-wide">
              Secure checkout via Dodo Payments · Verified by our team within 7 business days
            </p>
          </FadeIn>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 5 — Guarantee / Trust
      ═══════════════════════════════════════════════════ */}
      <SectionStrip
        className="py-16 md:py-20"
        style={{ background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { label: '7-Day Turnaround', desc: 'Most verifications complete within one week.' },
                { label: 'No Hidden Fees', desc: '$120 covers everything. No upsells.' },
                { label: 'Data You Control', desc: 'You decide who sees your verified profile.' },
              ].map((t) => (
                <div key={t.label}>
                  <p className="text-sm font-black text-white mb-2">{t.label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </SectionStrip>
    </div>
  );
};

export default RecognitionPlusTab;
